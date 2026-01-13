import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

/**
 * FileUploader Component
 *
 * Drag & drop file upload with preview, progress tracking, and validation
 *
 * @param onUpload - Callback function when files are uploaded
 * @param maxSize - Maximum file size in bytes (default: 10MB)
 * @param accept - Accepted file types
 * @param maxFiles - Maximum number of files (default: 5)
 * @param multiple - Allow multiple file selection (default: true)
 * @param disabled - Disable upload (default: false)
 * @param className - Additional CSS classes
 */

export interface UploadedFile {
    file: File;
    id: string;
    preview?: string;
    progress: number;
    error?: string;
}

export interface FileRejection {
    file: File;
    errors: Array<{
        code: string;
        message: string;
    }>;
}

export interface FileUploaderProps {
    onUpload: (files: UploadedFile[]) => void | Promise<void>;
    maxSize?: number;
    accept?: Record<string, string[]>;
    maxFiles?: number;
    multiple?: boolean;
    disabled?: boolean;
    className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
    onUpload,
    maxSize = 10 * 1024 * 1024, // 10MB
    accept = {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
        'application/pdf': ['.pdf'],
        'text/*': ['.txt', '.csv', '.json']
    },
    maxFiles = 5,
    multiple = true,
    disabled = false,
    className = ''
}) => {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [uploading, setUploading] = useState(false);

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    // Get file icon based on type
    const getFileIcon = (fileType: string): React.ReactNode => {
        if (fileType.startsWith('image/')) {
            return (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            );
        }
        if (fileType === 'application/pdf') {
            return (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            );
        }
        return (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        );
    };

    // Remove file
    const removeFile = (id: string) => {
        setUploadedFiles(prev => {
            const newFiles = prev.filter(f => f.id !== id);
            // Revoke preview URL for images
            const fileToRemove = prev.find(f => f.id === id);
            if (fileToRemove?.preview) {
                URL.revokeObjectURL(fileToRemove.preview);
            }
            return newFiles;
        });
    };

    // Dropzone configuration
    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        accept,
        maxFiles,
        maxSize,
        multiple,
        disabled: disabled || uploading,
        onDrop: useCallback(async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            if (acceptedFiles.length === 0) return;

            setUploading(true);

            // Process files
            const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
                file,
                id: `${file.name}-${Date.now()}-${Math.random()}`,
                preview: file.type.startsWith('image/')
                    ? URL.createObjectURL(file)
                    : undefined,
                progress: 0
            }));

            setUploadedFiles(prev => [...prev, ...newFiles]);

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadedFiles(prev => prev.map(f => {
                    if (f.progress < 100) {
                        return { ...f, progress: Math.min(f.progress + 10, 100) };
                    }
                    return f;
                }));
            }, 200);

            // Call onUpload callback
            try {
                await onUpload(newFiles);
            } catch (error) {
                console.error('Upload error:', error);
                setUploadedFiles(prev => prev.map(f =>
                    newFiles.find(nf => nf.id === f.id)
                        ? { ...f, error: 'Upload failed' }
                        : f
                ));
            } finally {
                clearInterval(progressInterval);
                setUploading(false);
            }
        }, [onUpload, maxSize, maxFiles])
    });

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`
                    relative border-2 border-dashed rounded-xl p-6 sm:p-8
                    transition-all duration-200 cursor-pointer
                    ${isDragActive
                        ? isDragReject
                            ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                            : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
                        : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
                    }
                    ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center justify-center text-center space-y-3">
                    {/* Upload Icon */}
                    <div className={`
                        w-16 h-16 rounded-full flex items-center justify-center
                        ${isDragActive
                            ? isDragReject
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }
                        transition-colors duration-200
                    `}>
                        {uploading ? (
                            <div className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        )}
                    </div>

                    {/* Text */}
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {isDragActive
                                ? isDragReject
                                    ? 'Dateityp nicht unterstützt'
                                    : 'Dateien hier ablegen'
                                : uploading
                                    ? 'Upload läuft...'
                                    : 'Dateien hierher ziehen oder klicken'
                            }
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {multiple ? `Bis zu ${maxFiles} Dateien` : '1 Dateie'}, max. {formatFileSize(maxSize)}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">
                            PNG, JPG, PDF, TXT, CSV, JSON
                        </p>
                    </div>
                </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                        Hochgeladene Dateien ({uploadedFiles.length})
                    </p>
                    <div className="space-y-2">
                        {uploadedFiles.map((uploadedFile) => (
                            <div
                                key={uploadedFile.id}
                                className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                            >
                                {/* Preview/Icon */}
                                <div className="flex-shrink-0 w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400">
                                    {uploadedFile.preview ? (
                                        <img
                                            src={uploadedFile.preview}
                                            alt={uploadedFile.file.name}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        getFileIcon(uploadedFile.file.type)
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                        {uploadedFile.file.name}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {formatFileSize(uploadedFile.file.size)}
                                        {uploadedFile.error && (
                                            <span className="ml-2 text-red-600 dark:text-red-400">
                                                • {uploadedFile.error}
                                            </span>
                                        )}
                                    </p>

                                    {/* Progress Bar */}
                                    {uploadedFile.progress < 100 && !uploadedFile.error && (
                                        <div className="mt-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                                                style={{ width: `${uploadedFile.progress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Status Icon */}
                                <div className="flex-shrink-0">
                                    {uploadedFile.error ? (
                                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    ) : uploadedFile.progress === 100 ? (
                                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    )}
                                </div>

                                {/* Remove Button */}
                                {!disabled && (
                                    <button
                                        onClick={() => removeFile(uploadedFile.id)}
                                        disabled={uploading}
                                        className="flex-shrink-0 p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Datei entfernen"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
