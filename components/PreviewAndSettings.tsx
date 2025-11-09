import React, { useMemo } from 'react';
import { ParsedInfo } from '../types';
import { ConvertIcon, InfoIcon, LoadingSpinner, SettingsIcon } from './Icons';

interface PreviewAndSettingsProps {
    info: ParsedInfo;
    resampleFactor: number;
    onFactorChange: (factor: number) => void;
    coordinateSystem: string;
    onCoordinateSystemChange: (cs: string) => void;
    onConvert: () => void;
    isConverting: boolean;
}

const COORDINATE_SYSTEMS = [
    { id: 'ijtsk', name: 'S-JTSK (JTSK03, Inverted Y)', example: 'Example: X: -377168, Y: -1200776' },
    { id: 'jtsk', name: 'S-JTSK (JTSK03)', example: 'Example: X: 377168, Y: 1200776' },
    { id: 'utm33n', name: 'UTM 33N', example: 'Example: X: 582155, Y: 5333156' },
    { id: 'utm34n', name: 'UTM 34N', example: 'Example: X: 339034, Y: 5349764' },
    { id: 'wgs84', name: 'WGS 84 (Lat/Lon)', example: 'Example: Lat: 48.14, Lon: 17.10' },
];

const InfoItem: React.FC<{ label: string; value: string | React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}:</span>
        <span className="font-mono text-gray-200">{value}</span>
    </div>
);

export const PreviewAndSettings: React.FC<PreviewAndSettingsProps> = ({ 
    info, 
    resampleFactor, 
    onFactorChange, 
    coordinateSystem,
    onCoordinateSystemChange,
    onConvert, 
    isConverting 
}) => {

    const factor = Math.max(1, Math.floor(resampleFactor));
    const newWidth = Math.floor(info.width / factor);
    const newHeight = Math.floor(info.height / factor);
    const newPixelSizeX = info.pixelSizeX * factor;
    const newPixelSizeY = Math.abs(info.pixelSizeY * factor);

    const selectedSystemInfo = useMemo(() => {
        return COORDINATE_SYSTEMS.find(cs => cs.id === coordinateSystem);
    }, [coordinateSystem]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data Information Section */}
                <div className="bg-gray-900/40 p-4 rounded-lg space-y-3">
                    <h3 className="text-lg font-bold text-teal-400 flex items-center gap-2">
                        <InfoIcon className="w-5 h-5" />
                        Data Information
                    </h3>
                    <InfoItem label="Filename" value={info.filename} />
                    <InfoItem label="Dimensions" value={`${info.width} x ${info.height} px`} />
                    <InfoItem label="Resolution" value={`${info.pixelSizeX.toFixed(2)} x ${Math.abs(info.pixelSizeY).toFixed(2)} m`} />
                    <InfoItem label="Min Elevation" value={`${info.minElevation.toFixed(2)} m`} />
                    <InfoItem label="Max Elevation" value={`${info.maxElevation.toFixed(2)} m`} />
                </div>
                {/* Resampling Settings Section */}
                 <div className="bg-gray-900/40 p-4 rounded-lg space-y-3 flex flex-col">
                    <h3 className="text-lg font-bold text-teal-400 flex items-center gap-2">
                        <SettingsIcon className="w-5 h-5" />
                        Conversion Settings
                    </h3>
                    <div>
                        <label htmlFor="cs-select" className="block text-sm font-medium text-gray-300 mb-2">
                            Coordinate System
                        </label>
                        <select
                            id="cs-select"
                            value={coordinateSystem}
                            onChange={(e) => onCoordinateSystemChange(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                           {COORDINATE_SYSTEMS.map(cs => (
                               <option key={cs.id} value={cs.id}>{cs.name}</option>
                           ))}
                        </select>
                        {selectedSystemInfo && (
                            <p className="text-xs text-gray-500 mt-2 font-mono">
                                {selectedSystemInfo.example}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="resample-factor" className="block text-sm font-medium text-gray-300 mb-2">
                            Resample Factor
                        </label>
                        <input 
                            type="number"
                            id="resample-factor"
                            min="1"
                            step="1"
                            value={resampleFactor}
                            onChange={(e) => onFactorChange(parseInt(e.target.value, 10) || 1)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                         <p className="text-xs text-gray-500 mt-2">
                           A factor of 2 creates a 2x2m grid from a 1x1m source, reducing points by 75%.
                        </p>
                    </div>
                     <div className="border-t border-gray-700 pt-3 space-y-2 mt-auto">
                         <h4 className="text-sm font-semibold text-gray-400">Resulting Grid:</h4>
                        <InfoItem label="New Dimensions" value={`${newWidth} x ${newHeight} px`} />
                        <InfoItem label="New Resolution" value={`${newPixelSizeX.toFixed(2)} x ${newPixelSizeY.toFixed(2)} m`} />
                    </div>
                </div>
            </div>
             <div className="flex justify-center pt-4">
                <button
                    onClick={onConvert}
                    disabled={isConverting}
                    className="flex items-center justify-center gap-3 w-full sm:w-auto text-lg font-bold px-8 py-4 rounded-full bg-teal-500 text-white shadow-lg hover:bg-teal-600 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
                >
                    {isConverting ? (
                        <>
                            <LoadingSpinner />
                            <span>Converting...</span>
                        </>
                    ) : (
                        <>
                            <ConvertIcon />
                            <span>Convert Files</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};