
import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { PlusCircleIcon, XMarkIcon, PencilIcon, TrashIcon } from '../Icons';
import { alertDeleteFailed, alertSaveFailed } from '../../lib/dashboardAlerts';

const BlogManager: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState<any>(null);
    
    // Form State
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const { data } = await api.getBlogPosts();
            setPosts(data || []);
        } catch (error) {
            console.error("Failed to fetch blog posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const openModal = (post?: any) => {
        if (post) {
            setEditingPost(post);
            setTitle(post.title);
            setExcerpt(post.excerpt);
            setContent(post.content);
            setCategory(post.category);
            setImageUrl(post.image_url || '');
        } else {
            setEditingPost(null);
            setTitle('');
            setExcerpt('');
            setContent('');
            setCategory('');
            setImageUrl('');
        }
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Diesen Artikel wirklich löschen?")) return;
        
        try {
            await api.deleteBlogPost(id);
            await fetchPosts();
        } catch (error: any) {
            alertDeleteFailed(error.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const payload = { title, excerpt, content, category, image_url: imageUrl };

            if (editingPost) {
                await api.updateBlogPost(editingPost.id, payload);
            } else {
                await api.createBlogPost(payload);
            }
            
            setShowModal(false);
            await fetchPosts();
        } catch (error: any) {
            alertSaveFailed(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Bild+fehlt';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-dark-text dark:text-light-text">Content Management</h1>
                    <p className="mt-2 text-dark-text/80 dark:text-light-text/80">Blog-Artikel erstellen und verwalten.</p>
                </div>
                <button onClick={() => openModal()} className="bg-primary text-white font-semibold py-2 px-4 rounded-full hover:bg-primary-hover transition-all shadow-lg flex items-center gap-2">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>Neuer Artikel</span>
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map(post => (
                    <div key={post.id} className="group relative bg-surface dark:bg-dark-surface rounded-xl shadow-md overflow-hidden border border-dark-text/10 dark:border-light-text/10 flex flex-col">
                        
                        {/* Edit/Delete Overlay */}
                        <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => openModal(post)} 
                                className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-md hover:text-primary transition-colors"
                                title="Bearbeiten"
                            >
                                <PencilIcon className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => handleDelete(post.id)} 
                                className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-md hover:text-red-500 transition-colors"
                                title="Löschen"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="h-40 bg-gray-200 dark:bg-gray-800 relative">
                            {post.image_url ? (
                                <img 
                                    src={post.image_url} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover" 
                                    onError={handleImageError}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">Kein Bild</div>
                            )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <span className="text-xs font-bold text-primary mb-2 uppercase tracking-wide">{post.category}</span>
                            <h3 className="text-lg font-bold text-dark-text dark:text-light-text mb-2 line-clamp-2">{post.title}</h3>
                            <p className="text-sm text-dark-text/70 dark:text-light-text/70 line-clamp-3 flex-1">{post.excerpt}</p>
                            <div className="mt-4 pt-4 border-t border-dark-text/10 dark:border-light-text/10 flex justify-between items-center text-xs text-gray-500">
                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                <span>{post.author_name || 'Team'}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {posts.length === 0 && !loading && (
                    <div className="col-span-full text-center py-12 text-gray-500">Keine Artikel gefunden.</div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-dark-surface w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editingPost ? 'Artikel bearbeiten' : 'Neuen Artikel verfassen'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                <XMarkIcon className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-text dark:text-light-text mb-1">Titel</label>
                                    <input required value={title} onChange={e => setTitle(e.target.value)} className="input-premium py-2" placeholder="Titel des Artikels" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-dark-text dark:text-light-text mb-1">Kategorie</label>
                                        <input required value={category} onChange={e => setCategory(e.target.value)} className="input-premium py-2" placeholder="z.B. Tech, News" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-dark-text dark:text-light-text mb-1">Bild URL</label>
                                        <input required value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="input-premium py-2" placeholder="https://..." />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-text dark:text-light-text mb-1">Kurzbeschreibung (Excerpt)</label>
                                    <textarea required value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2} className="input-premium resize-none" placeholder="Vorschautext..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-text dark:text-light-text mb-1">Inhalt (HTML erlaubt)</label>
                                    <textarea required value={content} onChange={e => setContent(e.target.value)} rows={10} className="input-premium resize-none font-mono text-sm" placeholder="<h3>Überschrift</h3><p>Text...</p>" />
                                </div>
                                <div className="pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">Abbrechen</button>
                                    <button type="submit" disabled={actionLoading} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 shadow-md">
                                        {actionLoading ? 'Speichere...' : (editingPost ? 'Aktualisieren' : 'Veröffentlichen')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogManager;
