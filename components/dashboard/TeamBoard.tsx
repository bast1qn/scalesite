
import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { PlusIcon, XMarkIcon, EllipsisHorizontalIcon, CheckBadgeIcon, ClockIcon, PencilIcon, TrashIcon } from '../Icons';
import { alertError } from '../../lib/dashboardAlerts';

interface Task {
    id: string;
    column_id: 'todo' | 'progress' | 'review' | 'done';
    title: string;
    client_name: string;
    priority: 'low' | 'medium' | 'high';
    created_at?: string;
}

const columns = [
    { id: 'todo', title: 'To Do', bg: 'bg-slate-100/50 dark:bg-slate-900/30', border: 'border-slate-200 dark:border-slate-800' },
    { id: 'progress', title: 'In Arbeit', bg: 'bg-blue-50/50 dark:bg-blue-900/10', border: 'border-blue-100 dark:border-blue-900/30' },
    { id: 'review', title: 'Review', bg: 'bg-yellow-50/50 dark:bg-yellow-900/10', border: 'border-yellow-100 dark:border-yellow-900/30' },
    { id: 'done', title: 'Fertig', bg: 'bg-green-50/50 dark:bg-green-900/10', border: 'border-green-100 dark:border-green-900/30' },
];

const TeamBoard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    
    // Form State
    const [title, setTitle] = useState('');
    const [client, setClient] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const { data } = await api.getTeamTasks();
            setTasks(data || []);
        } catch (e) {
            console.error("Failed to fetch tasks", e);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (task?: Task) => {
        if (task) {
            setEditingTask(task);
            setTitle(task.title);
            setClient(task.client_name);
            setPriority(task.priority);
        } else {
            setEditingTask(null);
            setTitle('');
            setClient('');
            setPriority('medium');
        }
        setShowModal(true);
        setOpenMenuId(null);
    };

    const handleSaveTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingTask) {
                await api.updateTeamTask(editingTask.id, { title, client_name: client, priority });
            } else {
                await api.createTeamTask({ title, client_name: client, priority });
            }
            setShowModal(false);
            setTitle('');
            setClient('');
            setPriority('medium');
            setEditingTask(null);
            fetchTasks();
        } catch (e: any) {
            alertError(e.message);
        }
    };

    const moveTask = async (taskId: string, newColumn: Task['column_id']) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, column_id: newColumn } : t));
        try {
            await api.updateTeamTask(taskId, { column_id: newColumn });
        } catch (e) {
            console.error("Move failed", e);
            fetchTasks();
        }
    };

    const deleteTask = async (taskId: string) => {
        if(!confirm("Aufgabe wirklich löschen?")) return;
        try {
            await api.deleteTeamTask(taskId);
            setTasks(prev => prev.filter(t => t.id !== taskId));
            setOpenMenuId(null);
        } catch(e) { console.error(e); }
    };

    const getPriorityBadge = (p: string) => {
        const styles = {
            high: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
            medium: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
            low: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
        };
        return (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${styles[p as keyof typeof styles]}`}>
                {p.toUpperCase()}
            </span>
        );
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex justify-between items-center mb-6 px-1">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Projekt Board</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Übersicht aller aktiven Tasks im Team.</p>
                </div>
                <button onClick={() => openModal()} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-all shadow-md flex items-center gap-2 text-sm">
                    <PlusIcon className="w-4 h-4" />
                    <span>Aufgabe</span>
                </button>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-6 h-full min-w-[1200px]">
                    {columns.map(col => (
                        <div key={col.id} className={`flex-1 flex flex-col rounded-2xl ${col.bg} border ${col.border} p-2`}>
                            <div className="px-3 py-3 flex justify-between items-center mb-2">
                                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center gap-2">
                                    {col.title}
                                    <span className="bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-md text-xs text-slate-500 dark:text-slate-400">
                                        {tasks.filter(t => t.column_id === col.id).length}
                                    </span>
                                </h3>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-3 pb-2">
                                {tasks.filter(t => t.column_id === col.id).map(task => (
                                    <div key={task.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 group hover:border-primary/40 dark:hover:border-primary/40 hover:shadow-md transition-all duration-200 relative">
                                        
                                        <div className="flex justify-between items-start mb-3">
                                            {getPriorityBadge(task.priority)}
                                            <div className="relative">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenuId(openMenuId === task.id ? null : task.id);
                                                    }}
                                                    className="text-slate-400 hover:text-primary p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                                >
                                                    <EllipsisHorizontalIcon className="w-5 h-5" />
                                                </button>
                                                
                                                {openMenuId === task.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-10 cursor-default" onClick={() => setOpenMenuId(null)}></div>
                                                        <div className="absolute right-0 top-8 bg-white dark:bg-slate-900 shadow-xl rounded-lg p-1 z-20 w-32 border border-slate-100 dark:border-slate-700 ring-1 ring-black/5 animate-scale-in">
                                                            <button 
                                                                onClick={(e) => { 
                                                                    e.stopPropagation(); 
                                                                    openModal(task); 
                                                                }} 
                                                                className="w-full text-left text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-2 rounded-md transition-colors flex items-center gap-2"
                                                            >
                                                                <PencilIcon className="w-3 h-3" /> Bearbeiten
                                                            </button>
                                                            <button 
                                                                onClick={(e) => { 
                                                                    e.stopPropagation(); 
                                                                    deleteTask(task.id); 
                                                                }} 
                                                                className="w-full text-left text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-md transition-colors flex items-center gap-2"
                                                            >
                                                                <TrashIcon className="w-3 h-3" /> Löschen
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 leading-tight">{task.title}</h4>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
                                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                                            {task.client_name}
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                                           <div className="flex -space-x-2">
                                                {/* Fake Avatars */}
                                                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 border-2 border-white dark:border-slate-800"></div>
                                           </div>
                                           
                                           <div className="flex gap-1">
                                                {col.id !== 'todo' && (
                                                    <button 
                                                        onClick={() => moveTask(task.id, columns[columns.findIndex(c => c.id === col.id) - 1].id as any)} 
                                                        className="p-1.5 rounded-md bg-slate-50 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 transition-colors"
                                                        title="Zurück"
                                                    >
                                                        <svg className="w-3 h-3 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                    </button>
                                                )}
                                                {col.id !== 'done' && (
                                                    <button 
                                                        onClick={() => moveTask(task.id, columns[columns.findIndex(c => c.id === col.id) + 1].id as any)} 
                                                        className="p-1.5 rounded-md bg-slate-50 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 transition-colors"
                                                        title="Weiter"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                    </button>
                                                )}
                                           </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

             {/* Create/Edit Modal */}
             {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-dark-surface w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {editingTask ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveTask} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Titel</label>
                                <input required value={title} onChange={e => setTitle(e.target.value)} className="input-premium py-2" placeholder="Bugfix Header..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Kunde / Projekt</label>
                                <input required value={client} onChange={e => setClient(e.target.value)} className="input-premium py-2" placeholder="Kundenkürzel" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Priorität</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['low', 'medium', 'high'].map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPriority(p as any)}
                                            className={`py-2 rounded-lg text-xs font-bold uppercase border transition-all ${priority === p ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98]">
                                    {editingTask ? 'Speichern' : 'Aufgabe erstellen'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamBoard;
