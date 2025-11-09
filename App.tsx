import React, { useState, useCallback, useEffect } from 'react';
import { TherionData, TfwData, ParsedInfo } from './types';
import { FileInput } from './components/FileInput';
import { ResultDisplay } from './components/ResultDisplay';
import { LoadingSpinner } from './components/Icons';
import { PreviewAndSettings } from './components/PreviewAndSettings';

// Module-level cache for the GeoTIFF library
let geoTiffModule: any = null;

// Helper to dynamically load the GeoTIFF library using ES Modules import()
const loadGeoTIFF = async (): Promise<any> => {
    if (geoTiffModule) {
        return geoTiffModule;
    }
    try {
        // Use dynamic import to load the library from a CDN
        geoTiffModule = await import('https://cdn.jsdelivr.net/npm/geotiff@2.1.4-beta.0/+esm');
        return geoTiffModule;
    } catch (error) {
        console.error("GeoTIFF dynamic import from CDN failed:", error);
        // Reset cache on failure to allow retry
        geoTiffModule = null; 
        throw new Error('Failed to load the GeoTIFF library from the CDN. Please check your internet connection.');
    }
};


const App: React.FC = () => {
    const [tifFile, setTifFile] = useState<File | null>(null);
    const [tfwFile, setTfwFile] = useState<File | null>(null);
    const [therionData, setTherionData] = useState<TherionData | null>(null);
    const [isParsing, setIsParsing] = useState<boolean>(false);
    const [isConverting, setIsConverting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'upload' | 'preview' | 'result'>('upload');
    const [parsedInfo, setParsedInfo] = useState<ParsedInfo | null>(null);
    const [resampleFactor, setResampleFactor] = useState<number>(1);
    const [coordinateSystem, setCoordinateSystem] = useState<string>('ijtsk');
    const [debugLog, setDebugLog] = useState<string>('');

    const readFileAs = <T extends 'Text' | 'ArrayBuffer'>(file: File, type: T): Promise<T extends 'Text' ? string : ArrayBuffer> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as any);
            reader.onerror = (err) => reject(new Error(`Error reading file: ${file.name}`));
            if (type === 'Text') {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        });
    };
    
    useEffect(() => {
        const parseInputFiles = async () => {
            if (!tifFile || !tfwFile) {
                return;
            }

            setIsParsing(true);
            setError(null);
            setParsedInfo(null);
            setTherionData(null);
            setView('upload');
            let log = `--- GeoTIFF to Therion Conversion Log ---\nTimestamp: ${new Date().toISOString()}\n\n`;

            try {
                log += `--- 1. INPUT FILES ---\n`;
                log += `TIFF File: ${tifFile.name}\n`;
                log += `TFW File: ${tfwFile.name}\n\n`;

                const GeoTIFF = await loadGeoTIFF();
                
                // 1. Read and parse .tfw
                const tfwContent = await readFileAs(tfwFile, 'Text');
                log += `--- 2. TFW (World File) PARSING ---\nRaw Content:\n${tfwContent.trim()}\n\nParsed Values:\n`;
                
                const lines = tfwContent.trim().split(/\r?\n/);
                if (lines.length < 6) throw new Error("Invalid .tfw file: must contain 6 lines.");
                
                const [A, D, B, E, C, F] = lines.map(parseFloat);
                if ([A, D, B, E, C, F].some(isNaN)) throw new Error("Invalid .tfw file: contains non-numeric values.");
                
                const tfwData: TfwData = { pixelSizeX: A, rotationY: D, rotationX: B, pixelSizeY: E, centerX: C, centerY: F };
                log += `  A (pixelSizeX): ${A}\n`;
                log += `  D (rotationY): ${D}\n`;
                log += `  B (rotationX): ${B}\n`;
                log += `  E (pixelSizeY): ${E}\n`;
                log += `  C (centerX_ull): ${C}\n`;
                log += `  F (centerY_ull): ${F}\n\n`;

                // 2. Read and parse .tif
                const tifBuffer = await readFileAs(tifFile, 'ArrayBuffer');
                const tiff = await GeoTIFF.fromArrayBuffer(tifBuffer);
                const image = await tiff.getImage();
                const width = image.getWidth();
                const height = image.getHeight();
                const rasters = await image.readRasters();
                const elevationData = rasters[0] as number[];

                log += `--- 3. TIFF METADATA ---\n`;
                log += `Width: ${width} px\n`;
                log += `Height: ${height} px\n`;

                // 3. Calculate additional info for preview
                let minElevation = Infinity;
                let maxElevation = -Infinity;
                for (let i = 0; i < elevationData.length; i++) {
                    if (elevationData[i] < minElevation) minElevation = elevationData[i];
                    if (elevationData[i] > maxElevation) maxElevation = elevationData[i];
                }
                log += `Min Elevation: ${minElevation.toFixed(3)} m\n`;
                log += `Max Elevation: ${maxElevation.toFixed(3)} m\n\n`;

                // 4. CRITICAL: Calculate correct origin for Therion
                log += `--- 4. ORIGIN CALCULATION for Therion \`grid\` ---\n`;
                log += `Note: Therion's \`grid\` command requires the X coordinate of the Upper-Left raster corner\n`;
                log += `      and the Y coordinate of the Lower-Left raster corner.\n\n`;

                const { pixelSizeX, pixelSizeY, centerX, centerY } = tfwData;
                log += `[a] Center of Upper-Left Pixel (from TFW):\n    X: ${centerX}\n    Y: ${centerY}\n\n`;
                
                const upperLeftCornerX = centerX - (pixelSizeX / 2);
                const upperLeftCornerY = centerY - (pixelSizeY / 2); // pixelSizeY is negative
                log += `[b] Calculated Upper-Left Corner (ull):\n`;
                log += `    X = [a].X - (pixelSizeX / 2) = ${upperLeftCornerX}\n`;
                log += `    Y = [a].Y - (pixelSizeY / 2) = ${upperLeftCornerY}\n\n`;

                const lowerLeftCornerY = upperLeftCornerY + (height * pixelSizeY);
                log += `[c] Calculated Lower-Left Corner Y (lll):\n`;
                log += `    Y = [b].Y + (height * pixelSizeY) = ${lowerLeftCornerY}\n\n`;
                
                const therionGridOriginX = upperLeftCornerX;
                const therionGridOriginY = lowerLeftCornerY;
                log += `[d] Final Therion Grid Origin:\n`;
                log += `    X: ${therionGridOriginX}\n`;
                log += `    Y: ${therionGridOriginY}\n\n`;


                setParsedInfo({
                    width,
                    height,
                    pixelSizeX: tfwData.pixelSizeX,
                    pixelSizeY: tfwData.pixelSizeY,
                    originX: therionGridOriginX,
                    originY: therionGridOriginY,
                    elevationData,
                    minElevation,
                    maxElevation,
                    tfwData,
                    filename: tifFile.name.replace(/\.(tif|tiff)$/i, '')
                });
                setView('preview');
                setResampleFactor(1);
                setDebugLog(log);

            } catch (err: any) {
                console.error(err);
                setError(err.message || "An unknown error occurred during parsing.");
                handleReset();
            } finally {
                setIsParsing(false);
            }
        };

        parseInputFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tifFile, tfwFile]);

    const handleConvert = useCallback(async () => {
        if (!parsedInfo) {
            setError("No parsed data available to convert.");
            return;
        }

        setIsConverting(true);
        setError(null);
        setTherionData(null);
        let log = debugLog;

        try {
            const { elevationData, width, height, pixelSizeX, pixelSizeY, originX, originY, filename } = parsedInfo;
            const factor = Math.max(1, Math.floor(resampleFactor));
            
            log += `--- 5. CONVERSION SETTINGS ---\n`;
            log += `Coordinate System: ${coordinateSystem}\n`;
            log += `Resample Factor: ${factor}\n`;
            log += `  - Original Dimensions: ${width} x ${height}\n`;
            
            const newWidth = Math.floor(width / factor);
            const newHeight = Math.floor(height / factor);
            const newElevationData = new Array(newWidth * newHeight);
            
            // Simple nearest-neighbor resampling
            for (let y = 0; y < newHeight; y++) {
                for (let x = 0; x < newWidth; x++) {
                    const oldY = y * factor;
                    const oldX = x * factor;
                    newElevationData[y * newWidth + x] = elevationData[oldY * width + oldX];
                }
            }
            log += `  - New Dimensions: ${newWidth} x ${newHeight}\n`;
            
            const txtRows: string[] = [];
            for (let y = 0; y < newHeight; y++) {
                const row = newElevationData.slice(y * newWidth, (y + 1) * newWidth);
                txtRows.push(row.map(val => val.toFixed(3)).join(' '));
            }
            const txtContent = txtRows.join('\n');
            const txtFilename = `${filename}.txt`;

            const newPixelSizeX = pixelSizeX * factor;
            const newPixelSizeY = pixelSizeY * factor;
            log += `  - Original Resolution: ${pixelSizeX.toFixed(2)} x ${Math.abs(pixelSizeY).toFixed(2)}\n`;
            log += `  - New Resolution: ${newPixelSizeX.toFixed(2)} x ${Math.abs(newPixelSizeY).toFixed(2)}\n\n`;

            let thOriginX = originX;
            let thOriginY = originY;

            // `jtsk` in Therion expects positive coordinates, inverted from standard GIS.
            // `ijtsk` uses the raw negative coordinates.
            if (coordinateSystem === 'jtsk') {
                thOriginX = -originX;
                // This is more complex than just inverting. The lower-left Y becomes the upper-right Y.
                // For now, only inverting X is supported as a simple transform.
                // The correct transform is already baked into the originX/Y calculation.
                // This block is now just for the non-inverted `jtsk` variant.
                thOriginY = -(originY + (newHeight * newPixelSizeY));
            }
            
            const thGridLine = `grid ${thOriginX.toFixed(8)} ${thOriginY.toFixed(8)} ${newPixelSizeX.toFixed(12)} ${Math.abs(newPixelSizeY).toFixed(12)} ${newWidth} ${newHeight}`;
            log += `--- 6. FINAL OUTPUT ---\n`;
            log += `Generated .th \`grid\` line:\n${thGridLine}\n`;
            setDebugLog(log);

            const thContent = `encoding utf-8
surface
  cs ${coordinateSystem}
  ${thGridLine}
  input ${txtFilename}
endsurface
`;
            setTherionData({
                thContent,
                txtContent,
                baseFilename: filename,
                width: newWidth,
                height: newHeight,
                debugLog: log,
            });
            setView('result');

        } catch (err: any) {
            console.error(err);
            setError(err.message || "An unknown error occurred during conversion.");
        } finally {
            setIsConverting(false);
        }
    }, [parsedInfo, resampleFactor, coordinateSystem, debugLog]);

    const handleReset = () => {
        setTifFile(null);
        setTfwFile(null);
        setTherionData(null);
        setError(null);
        setIsParsing(false);
        setIsConverting(false);
        setView('upload');
        setParsedInfo(null);
        setCoordinateSystem('ijtsk');
        setDebugLog('');
    };

    const renderContent = () => {
        if (isParsing) {
            return (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                    <LoadingSpinner />
                    <span className="mt-4">Parsing files...</span>
                </div>
            )
        }
        switch(view) {
            case 'upload':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FileInput
                            id="tif-upload"
                            label="GeoTIFF Image (.tif)"
                            onFileSelect={setTifFile}
                            file={tifFile}
                            acceptedTypes=".tif,.tiff"
                        />
                        <FileInput
                            id="tfw-upload"
                            label="World File (.tfw)"
                            onFileSelect={setTfwFile}
                            file={tfwFile}
                            acceptedTypes=".tfw"
                        />
                    </div>
                );
            case 'preview':
                if (parsedInfo) {
                    return <PreviewAndSettings 
                                info={parsedInfo} 
                                resampleFactor={resampleFactor}
                                onFactorChange={setResampleFactor}
                                coordinateSystem={coordinateSystem}
                                onCoordinateSystemChange={setCoordinateSystem}
                                onConvert={handleConvert}
                                isConverting={isConverting}
                            />
                }
                return null;
            case 'result':
                if (therionData) {
                    return <ResultDisplay data={therionData} onReset={handleReset} />
                }
                return null;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
            <div className="w-full max-w-5xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                        GeoTIFF to Therion Converter
                    </h1>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                        Convert geospatial elevation data (.tif + .tfw) into Therion's surface format (.th + .txt) seamlessly in your browser.
                    </p>
                </header>

                <main className="bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-8 min-h-[250px] flex flex-col justify-center">
                     {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                            <span className="font-semibold">Error:</span> {error}
                        </div>
                    )}
                    
                    {renderContent()}
                </main>
                 <footer className="text-center mt-8 text-gray-500 text-sm">
                    <p>Designed for cave surveyors and geology enthusiasts.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;