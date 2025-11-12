import React, { useCallback, useState } from 'react';
import { UploadIcon, FileIcon, CheckCircleIcon } from './Icons';
import { useTranslation } from '../LanguageContext';

interface UnifiedFileInputProps {
    onFilesSelect: (tifFile: File, tfwFile: File) => void;
    onReset: () => void;
    files: { tif: File | null, tfw: File | null };
    setError: (error: string | null) => void;
}

export const FileInput: React.FC<UnifiedFileInputProps> = ({ onFilesSelect, onReset, files, setError }) => {
    const [isDragging, setIsDragging] = useState(false);
    const { t } = useTranslation();

    const processFiles = useCallback((fileList: FileList | null) => {
        if (!fileList) return;
        
        onReset(); 

        if (fileList.length !== 2) {
            setError(t('error_missing_one_file'));
            return;
        }

        let tifFile: File | null = null;
        let tfwFile: File | null = null;

        for (const file of Array.from(fileList)) {
            if (/\.(tiff?)$/i.test(file.name)) {
                tifFile = file;
            } else if (/\.tfw$/i.test(file.name)) {
                tfwFile = file;
            }
        }

        if (!tifFile) {
            setError(t('error_missing_tif'));
            return;
        }
        if (!tfwFile) {
            setError(t('error_missing_tfw'));
            return;
        }
        
        const tifBase = tifFile.name.replace(/\.(tiff?)$/i, '');
        const tfwBase = tfwFile.name.replace(/\.tfw$/i, '');
        if (tifBase !== tfwBase) {
            setError(t('error_mismatched_names'));
            return;
        }
        
        setError(null);
        onFilesSelect(tifFile, tfwFile);

    }, [onFilesSelect, onReset, setError, t]);

    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            processFiles(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    }, [processFiles]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files);
        e.target.value = ''; // Allow re-selecting the same files
    };

    const bothFilesSelected = files.tif && files.tfw;
    const borderColor = bothFilesSelected ? 'border-teal-500' : isDragging ? 'border-blue-500' : 'border-gray-600';
    const bgColor = bothFilesSelected ? 'bg-teal-900/20' : isDragging ? 'bg-blue-900/20' : 'bg-gray-900/30';
    
    return (
        <div className="w-full">
            <label
                htmlFor="unified-upload"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center p-6 border-2 ${borderColor} border-dashed rounded-lg cursor-pointer ${bgColor} hover:bg-gray-700/50 transition-colors duration-300 min-h-[192px]`}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    {bothFilesSelected ? (
                        <>
                            <CheckCircleIcon className="w-10 h-10 mb-3 text-teal-400"/>
                            <p className="mb-2 text-sm text-gray-300 font-semibold">{t('fileInputSelected')}</p>
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-md">
                                    <FileIcon className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs font-medium text-gray-200 truncate max-w-[200px] sm:max-w-xs">{files.tif?.name}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-md">
                                    <FileIcon className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs font-medium text-gray-200 truncate max-w-[200px] sm:max-w-xs">{files.tfw?.name}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                         <>
                            <UploadIcon className="w-10 h-10 mb-3 text-gray-500"/>
                            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">{t('fileInputTitle')}</span></p>
                            <p className="text-xs text-gray-500">{t('fileInputPrompt')}</p>
                        </>
                    )}
                </div>
                <input id="unified-upload" type="file" className="hidden" onChange={handleFileChange} multiple accept=".tif,.tiff,.tfw" />
            </label>
        </div>
    );
};