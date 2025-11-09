
import React, { useCallback, useState } from 'react';
import { UploadIcon, FileIcon, CheckCircleIcon } from './Icons';

interface FileInputProps {
    id: string;
    label: string;
    onFileSelect: (file: File | null) => void;
    file: File | null;
    acceptedTypes: string;
}

export const FileInput: React.FC<FileInputProps> = ({ id, label, onFileSelect, file, acceptedTypes }) => {
    const [isDragging, setIsDragging] = useState(false);

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
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileSelect(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    }, [onFileSelect]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
        }
    };

    const borderColor = file ? 'border-teal-500' : isDragging ? 'border-blue-500' : 'border-gray-600';
    const bgColor = file ? 'bg-teal-900/20' : isDragging ? 'bg-blue-900/20' : 'bg-gray-900/30';
    
    return (
        <div className="w-full">
            <label
                htmlFor={id}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center p-6 border-2 ${borderColor} border-dashed rounded-lg cursor-pointer ${bgColor} hover:bg-gray-700/50 transition-colors duration-300 h-48`}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    {file ? (
                        <>
                            <CheckCircleIcon className="w-10 h-10 mb-3 text-teal-400"/>
                            <p className="mb-2 text-sm text-gray-300 font-semibold">{label} selected:</p>
                            <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-md">
                                <FileIcon className="w-4 h-4 text-gray-400" />
                                <span className="text-xs font-medium text-gray-200 truncate max-w-[200px]">{file.name}</span>
                            </div>
                        </>
                    ) : (
                         <>
                            <UploadIcon className="w-10 h-10 mb-3 text-gray-500"/>
                            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">{label}</span></p>
                            <p className="text-xs text-gray-500">Drag & drop or click to upload</p>
                        </>
                    )}
                </div>
                <input id={id} type="file" className="hidden" onChange={handleFileChange} accept={acceptedTypes} />
            </label>
        </div>
    );
};
