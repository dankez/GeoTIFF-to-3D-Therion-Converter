import React, { useState } from 'react';
import { TherionData } from '../types';
import { DownloadIcon, RestartIcon, CopyIcon, CheckCircleIcon } from './Icons';

interface ResultDisplayProps {
    data: TherionData;
    onReset: () => void;
}

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


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ data, onReset }) => {
    
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
                Download {filename.split('.').pop()}
            </button>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-teal-400">Conversion Successful!</h2>
                <p className="text-gray-400 mt-1">Your Therion surface files are ready for download.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <FileResultCard 
                    filename={`${data.baseFilename}.th`}
                    content={data.thContent}
                />
                 <FileResultCard 
                    filename={`${data.baseFilename}.txt`}
                    content={data.txtContent}
                    info={`Grid: ${data.height} rows, ${data.width} columns.`}
                    previewLength={300}
                />
                <FileResultCard 
                    filename="debug.log"
                    content={data.debugLog}
                    info="Process log for debugging."
                    previewLength={300}
                />
            </div>

            <div className="pt-4 flex justify-center">
                 <button
                    onClick={onReset}
                    className="flex items-center justify-center gap-3 w-full sm:w-auto text-lg font-bold px-8 py-4 rounded-full bg-gray-600 text-white shadow-lg hover:bg-gray-500 transition-all duration-300 ease-in-out"
                >
                    <RestartIcon />
                    <span>Start New Conversion</span>
                </button>
            </div>
        </div>
    );
};