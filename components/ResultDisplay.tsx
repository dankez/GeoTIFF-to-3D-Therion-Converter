import React, { useState } from 'react';
import { TherionData } from '../types';
import { DownloadIcon, RestartIcon, CopyIcon, CheckCircleIcon, ArchiveIcon, LoadingSpinner } from './Icons';
import { useTranslation } from '../LanguageContext';

// Module-level cache for JSZip to avoid re-importing
let jszipModule: any = null;

// Helper to dynamically load the JSZip library for creating zip files
const loadJSZip = async (): Promise<any> => {
    if (jszipModule) {
        return jszipModule;
    }
    try {
        // Use dynamic import to load the library from a CDN
        const jszip = await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm');
        jszipModule = jszip.default; // The default export is the JSZip class
        return jszipModule;
    } catch (error) {
        console.error("JSZip dynamic import from CDN failed:", error);
        jszipModule = null; 
        throw new Error('Failed to load the zipping library. Please check your internet connection.');
    }
};

const CodeBlock: React.FC<{ title: string; content: string; language?: string, previewLength?: number }> = ({ title, content, previewLength }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        }, (err) => {
            console.error('Failed to copy text: ', err);
        });
    };

    const displayContent = previewLength ? content.substring(0, previewLength) + (content.length > previewLength ? '...' : '') : content;

    return (
        <div className="bg-gray-900/50 rounded-lg overflow-hidden h-full flex flex-col">
            <div className="px-4 py-2 bg-gray-700/50 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
                <button 
                    onClick={handleCopy} 
                    className="text-gray-400 hover:text-white transition-colors p-1 -mr-1"
                    aria-label={`Copy ${title} to clipboard`}
                >
                    {copied ? <CheckCircleIcon className="w-4 h-4 text-teal-400" /> : <CopyIcon className="w-4 h-4" />}
                </button>
            </div>
            <pre className="p-4 text-xs text-gray-300 overflow-x-auto flex-grow">
                <code>{displayContent}</code>
            </pre>
        </div>
    );
};

// Fix: Define props interface for ResultDisplay component
interface ResultDisplayProps {
    data: TherionData;
    onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ data, onReset }) => {
    const { t } = useTranslation();
    const [isZipping, setIsZipping] = useState(false);
    
    const handleDownload = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadAll = async () => {
        setIsZipping(true);
        try {
            const JSZip = await loadJSZip();
            const zip = new JSZip();

            zip.file(`${data.baseFilename}.th`, data.thContent);
            zip.file(`${data.baseFilename}.txt`, data.txtContent);
            zip.file('debug.log', data.debugLog);

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${data.baseFilename}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } catch (err: any) {
            console.error('Failed to create zip file:', err);
            // Optionally, set an error state to show an error message to the user
        } finally {
            setIsZipping(false);
        }
    };

    const FileResultCard: React.FC<{
        filename: string;
        content: string;
        info?: string;
        previewLength?: number;
    }> = ({ filename, content, info, previewLength }) => (
        <div className="flex flex-col">
            {info && (
                <div className="px-1 pb-2 text-sm text-gray-400">
                    <p>{info}</p>
                </div>
            )}
            <div className="flex-grow">
                <CodeBlock title={filename} content={content} previewLength={previewLength} />
            </div>
            <button
                onClick={() => handleDownload(content, filename)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
            >
                <DownloadIcon />
                {t('downloadButton', filename.split('.').pop() || '')}
            </button>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-teal-400">{t('result_success')}</h2>
                <p className="text-gray-400 mt-1">{t('result_description')}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <FileResultCard 
                    filename={`${data.baseFilename}.th`}
                    content={data.thContent}
                />
                 <FileResultCard 
                    filename={`${data.baseFilename}.txt`}
                    content={data.txtContent}
                    info={t('result_gridInfo', data.height, data.width)}
                    previewLength={300}
                />
                <FileResultCard 
                    filename="debug.log"
                    content={data.debugLog}
                    info={t('result_debugInfo')}
                    previewLength={300}
                />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                 <button
                    onClick={handleDownloadAll}
                    disabled={isZipping}
                    className="flex items-center justify-center gap-3 w-full sm:w-auto text-lg font-bold px-8 py-4 rounded-full bg-teal-500 text-white shadow-lg hover:bg-teal-600 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
                >
                    {isZipping ? (
                        <>
                            <LoadingSpinner />
                            <span>{t('zipping')}</span>
                        </>
                    ) : (
                        <>
                            <ArchiveIcon />
                            <span>{t('downloadAllButton')}</span>
                        </>
                    )}
                </button>
                 <button
                    onClick={onReset}
                    className="flex items-center justify-center gap-3 w-full sm:w-auto text-lg font-bold px-8 py-4 rounded-full bg-gray-600 text-white shadow-lg hover:bg-gray-500 transition-all duration-300 ease-in-out"
                >
                    <RestartIcon />
                    <span>{t('newConversionButton')}</span>
                </button>
            </div>
        </div>
    );
};
