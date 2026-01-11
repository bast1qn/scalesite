
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../lib/api';
import { CloudArrowUpIcon, DocumentIcon, PhotoIcon, TrashIcon, ArrowDownOnSquareIcon, EyeIcon } from '../Icons';
import { alertFileTooLarge, alertUploadFailed, alertFileReadError, alertError, alertDownloadFailed } from '../../lib/dashboardAlerts';

interface FileData {
    id: string;
    name: string;
    size: number;
    type: string;
    created_at: string;
    data?: string; // Optional now, loaded on demand
}

const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileManager: React.FC = () => {
    const [files, setFiles] = useState<FileData[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Image preview cache
    const [previews, setPreviews] = useState<{[key: string]: string}>({});

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            // Now only fetches metadata, much faster
            const { data } = await api.getFiles();
            setFiles(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const loadPreview = async (id: string) => {
        if (previews[id]) return; // Already loaded
        try {
            const { data } = await api.getFileContent(id);
            if (data && data.data) {
                setPreviews(prev => ({ ...prev, [id]: data.data }));
            }
        } catch (e) {
            console.warn("Failed to load preview", e);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        // Reset input value to allow re-selecting the same file if upload fails
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) { // 5MB Limit for demo
            alertFileTooLarge();
            return;
        }

        setUploading(true);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            try {
                await api.uploadFile(file.name, file.size, file.type, reader.result as string);
                fetchFiles();
            } catch (err: any) {
                alertUploadFailed(err.message);
            } finally {
                setUploading(false);
            }
        };
        reader.onerror = () => {
             alertFileReadError();
             setUploading(false);
        };
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Datei wirklich löschen?")) return;
        try {
            await api.deleteFile(id);
            setFiles(prev => prev.filter(f => f.id !== id));
            // Cleanup preview cache
            const newPreviews = {...previews};
            delete newPreviews[id];
            setPreviews(newPreviews);
        } catch (e: any) {
            alertError(e.message);
        }
    };

    const handleDownload = async (file: FileData) => {
        let dataUrl = previews[file.id];
        if (!dataUrl) {
            // Fetch if not in cache
            try {
                const { data } = await api.getFileContent(file.id);
                if (data && data.data) dataUrl = data.data;
                else throw new Error("Daten nicht verfügbar");
            } catch (e) {
                alertDownloadFailed();
                return;
            }
        }

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-dark-text dark:text-light-text">Datei-Manager</h1>
                    <p className="mt-2 text-dark-text/80 dark:text-light-text/80">
                        Laden Sie Logos, Bilder und Dokumente für Ihr Projekt hoch.
                    </p>
                </div>
                
                <div className="relative">
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange} 
                        className="hidden" 
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="bg-primary text-white font-bold py-2.5 px-6 rounded-xl hover:bg-primary-hover transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                    >
                        {uploading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <CloudArrowUpIcon className="w-5 h-5" />
                        )}
                        <span>{uploading ? 'Wird hochgeladen...' : 'Datei hochladen'}</span>
                    </button>
                </div>
            </div>

            {/* Upload Zone (Visual) */}
            {!loading && files.length === 0 && (
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                        <CloudArrowUpIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Noch keine Dateien</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Klicken Sie hier, um etwas hochzuladen.</p>
                </div>
            )}

            {/* File Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {files.map(file => {
                    const isImage = file.type.startsWith('image/');
                    const hasPreview = previews[file.id];

                    // Trigger load if image and visible (simple approach: trigger on render)
                    // Ideally use IntersectionObserver but simple effect works for grid
                    useEffect(() => {
                        if (isImage && !hasPreview) {
                            // Lazy load a bit delayed to not block UI
                            const t = setTimeout(() => loadPreview(file.id), 100);
                            return () => clearTimeout(t);
                        }
                    }, [isImage]);

                    return (
                        <div key={file.id} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 hover:shadow-md transition-all hover:border-primary/30">
                            <div className="aspect-square rounded-xl bg-slate-50 dark:bg-slate-950 overflow-hidden mb-3 flex items-center justify-center relative">
                                {isImage ? (
                                    hasPreview ? (
                                        <img src={hasPreview} alt={file.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="animate-pulse bg-slate-200 dark:bg-slate-800 w-full h-full flex items-center justify-center">
                                            <PhotoIcon className="w-8 h-8 text-slate-400 opacity-50" />
                                        </div>
                                    )
                                ) : (
                                    <DocumentIcon className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                                )}
                                
                                {/* Hover Actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                                    <button 
                                        onClick={() => handleDownload(file)}
                                        className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                                        title="Download"
                                    >
                                        <ArrowDownOnSquareIcon className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(file.id)}
                                        className="p-2 bg-white/20 hover:bg-red-500/80 rounded-full text-white transition-colors"
                                        title="Löschen"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={file.name}>{file.name}</p>
                                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                                    <span>{formatSize(file.size)}</span>
                                    <span>{new Date(file.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FileManager;
