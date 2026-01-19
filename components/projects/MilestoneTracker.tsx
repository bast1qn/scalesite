import { useState, useEffect, type FC } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { api } from '../../lib';
import type { ProjectMilestone } from '../../lib/supabase';
import {
    CheckCircleIcon,
    ClockIcon,
    CalendarDaysIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon
} from '../Icons';

export interface MilestoneTrackerProps {
    projectId: string;
    readonly?: boolean;
    className?: string;
    onMilestoneUpdate?: (milestone: ProjectMilestone) => void;
}

type EditingMilestone = {
    id: string | null;
    title: string;
    description: string;
    due_date: string;
};

const initialEditingState: EditingMilestone = {
    id: null,
    title: '',
    description: '',
    due_date: ''
};

const statusConfig = {
    pending: {
        label: 'Ausstehend',
        bgColor: 'from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30',
        textColor: 'text-gray-700 dark:text-gray-300',
        borderColor: 'border-gray-200 dark:border-gray-700',
        iconColor: 'text-gray-500',
        icon: ClockIcon
    },
    in_progress: {
        label: 'In Bearbeitung',
        bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30',
        textColor: 'text-blue-700 dark:text-blue-300',
        borderColor: 'border-blue-200 dark:border-blue-700',
        iconColor: 'text-blue-500',
        icon: ClockIcon
    },
    completed: {
        label: 'Abgeschlossen',
        bgColor: 'from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30',
        textColor: 'text-emerald-700 dark:text-emerald-300',
        borderColor: 'border-emerald-200 dark:border-emerald-700',
        iconColor: 'text-emerald-500',
        icon: CheckCircleIcon
    },
    delayed: {
        label: 'Verzögert',
        bgColor: 'from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30',
        textColor: 'text-red-700 dark:text-red-300',
        borderColor: 'border-red-200 dark:border-red-700',
        iconColor: 'text-red-500',
        icon: ClockIcon
    }
};

export const MilestoneTracker: FC<MilestoneTrackerProps> = ({
    projectId,
    readonly = false,
    className = '',
    onMilestoneUpdate
}) => {
    const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState<EditingMilestone>(initialEditingState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMilestones = async () => {
            try {
                setLoading(true);
                const result = await api.getMilestones(projectId);

                if (!result.error && result.data) {
                    const milestoneData = Array.isArray(result.data) ? result.data : [];
                    // Sort by order_index
                    const sorted = milestoneData.sort((a: ProjectMilestone, b: ProjectMilestone) =>
                        a.order_index - b.order_index
                    );
                    setMilestones(sorted);
                } else {
                    setMilestones([]);
                }
            } catch (err) {
                if (import.meta.env.DEV) {
                    console.error('Error fetching milestones:', err);
                }
                setError('Meilensteine konnten nicht geladen werden');
                setMilestones([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMilestones();
    }, [projectId]);

    const calculateProgress = (): number => {
        if (milestones.length === 0) return 0;
        const completed = milestones.filter(m => m.status === 'completed').length;
        return Math.round((completed / milestones.length) * 100);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMilestone.title.trim()) return;

        try {
            setIsSubmitting(true);
            setError(null);

            if (editingMilestone.id) {
                // Update existing milestone
                const result = await api.updateMilestone(editingMilestone.id, {
                    title: editingMilestone.title,
                    description: editingMilestone.description || undefined,
                    due_date: editingMilestone.due_date || undefined
                });

                if (!result.error) {
                    setMilestones(prev =>
                        prev.map(m =>
                            m.id === editingMilestone.id
                                ? { ...m, ...result.data }
                                : m
                        )
                    );
                    onMilestoneUpdate?.(result.data as ProjectMilestone);
                }
            } else {
                // Create new milestone
                const nextOrderIndex = Math.max(...milestones.map(m => m.order_index), -1) + 1;
                const result = await api.createMilestone(projectId, {
                    title: editingMilestone.title,
                    description: editingMilestone.description || undefined,
                    due_date: editingMilestone.due_date || undefined,
                    order_index: nextOrderIndex
                });

                if (!result.error && result.data) {
                    setMilestones(prev => [...prev, result.data as ProjectMilestone]);
                    onMilestoneUpdate?.(result.data as ProjectMilestone);
                }
            }

            setEditingMilestone(initialEditingState);
            setShowAddForm(false);
        } catch (err) {
            if (import.meta.env.DEV) {
                console.error('Error saving milestone:', err);
            }
            setError('Fehler beim Speichern des Meilensteins');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (milestone: ProjectMilestone) => {
        setEditingMilestone({
            id: milestone.id,
            title: milestone.title,
            description: milestone.description || '',
            due_date: milestone.due_date || ''
        });
        setShowAddForm(true);
    };

    const handleDelete = async (milestoneId: string) => {
        if (!confirm('Möchten Sie diesen Meilenstein wirklich löschen?')) return;

        try {
            const result = await api.deleteMilestone(milestoneId);
            if (!result.error) {
                setMilestones(prev => prev.filter(m => m.id !== milestoneId));
            }
        } catch (err) {
            if (import.meta.env.DEV) {
                console.error('Error deleting milestone:', err);
            }
            setError('Fehler beim Löschen des Meilensteins');
        }
    };

    const handleStatusChange = async (milestoneId: string, newStatus: ProjectMilestone['status']) => {
        try {
            const result = await api.updateMilestone(milestoneId, {
                status: newStatus,
                completed_at: newStatus === 'completed' ? new Date().toISOString() : undefined
            });

            if (!result.error) {
                setMilestones(prev =>
                    prev.map(m =>
                        m.id === milestoneId
                            ? { ...m, ...result.data }
                            : m
                    )
                );
                onMilestoneUpdate?.(result.data as ProjectMilestone);
            }
        } catch (err) {
            if (import.meta.env.DEV) {
                console.error('Error updating milestone status:', err);
            }
            setError('Fehler beim Aktualisieren des Status');
        }
    };

    const formatDate = (dateString?: string): string => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getDaysUntilDue = (dueDate: string): number | null => {
        const due = new Date(dueDate);
        const now = new Date();
        const diff = due.getTime() - now.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    if (loading) {
        return (
            <div className={`flex items-center justify-center py-8 ${className}`}>
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Meilensteine werden geladen...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                        Meilensteine
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Verfolgen Sie den Fortschritt Ihres Projekts
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                        {calculateProgress()}%
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Abgeschlossen</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateProgress()}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500 rounded-full relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </motion.div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
            )}

            {/* Milestones List */}
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {milestones.map((milestone, index) => {
                        const config = statusConfig[milestone.status];
                        const Icon = config.icon;
                        const daysUntil = milestone.due_date ? getDaysUntilDue(milestone.due_date) : null;

                        return (
                            <motion.div
                                key={milestone.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                                className={`
                                    relative p-4 rounded-xl border transition-all duration-300
                                    bg-gradient-to-r ${config.bgColor}
                                    ${config.borderColor}
                                    hover:shadow-md
                                `}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Status Icon */}
                                    <div className={`p-2 rounded-lg ${config.iconColor} bg-white dark:bg-slate-900 shadow-sm`}>
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className={`font-semibold ${config.textColor}`}>
                                                {milestone.title}
                                            </h4>
                                            {!readonly && (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleEdit(milestone)}
                                                        className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(milestone.id)}
                                                        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {milestone.description && (
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                {milestone.description}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${config.textColor} ${config.bgColor}`}>
                                                {config.label}
                                            </span>
                                            {milestone.due_date && (
                                                <span className="inline-flex items-center gap-1">
                                                    <CalendarDaysIcon className="w-3.5 h-3.5" />
                                                    {formatDate(milestone.due_date)}
                                                    {daysUntil !== null && (
                                                        <span className={`
                                                            ml-1 px-1.5 py-0.5 rounded text-xs font-medium
                                                            ${daysUntil < 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                                              daysUntil <= 3 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                                                              'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}
                                                        `}>
                                                            {daysUntil < 0 ? 'Überfällig' : daysUntil === 0 ? 'Heute' : `Noch ${daysUntil} Tage`}
                                                        </span>
                                                    )}
                                                </span>
                                            )}
                                            {milestone.completed_at && milestone.status === 'completed' && (
                                                <span className="text-emerald-600 dark:text-emerald-400">
                                                    Abgeschlossen am {formatDate(milestone.completed_at)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Status Toggle (for non-readonly) */}
                                        {!readonly && milestone.status !== 'completed' && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <button
                                                    onClick={() => handleStatusChange(milestone.id, milestone.status === 'pending' ? 'in_progress' : 'completed')}
                                                    className={`
                                                        px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                                                        ${milestone.status === 'pending'
                                                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
                                                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300'
                                                        }
                                                    `}
                                                >
                                                    {milestone.status === 'pending' ? 'Starten' : 'Abschließen'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {!loading && milestones.length === 0 && (
                <div className="text-center py-8 px-4">
                    <ClockIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 mb-1">Keine Meilensteine</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                        Fügen Sie Meilensteine hinzu, um den Fortschritt zu verfolgen
                    </p>
                </div>
            )}

            {/* Add/Edit Form */}
            {!readonly && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    {!showAddForm ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                setEditingMilestone(initialEditingState);
                                setShowAddForm(true);
                            }}
                            className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-center gap-2 font-medium"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Meilenstein hinzufügen
                        </motion.button>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleSubmit}
                            className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-slate-900 dark:text-white">
                                    {editingMilestone.id ? 'Meilenstein bearbeiten' : 'Neuer Meilenstein'}
                                </h4>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setEditingMilestone(initialEditingState);
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Titel *
                                </label>
                                <input
                                    type="text"
                                    value={editingMilestone.title}
                                    onChange={(e) => setEditingMilestone(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="z.B. Design-Konzept fertigstellen"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Beschreibung
                                </label>
                                <textarea
                                    value={editingMilestone.description}
                                    onChange={(e) => setEditingMilestone(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Details zu diesem Meilenstein..."
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Fälligkeitsdatum
                                </label>
                                <input
                                    type="date"
                                    value={editingMilestone.due_date}
                                    onChange={(e) => setEditingMilestone(prev => ({ ...prev, due_date: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isSubmitting || !editingMilestone.title.trim()}
                                    className={`
                                        flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all
                                        ${isSubmitting || !editingMilestone.title.trim()
                                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-lg hover:shadow-blue-500/20'
                                        }
                                    `}
                                >
                                    {isSubmitting ? 'Wird gespeichert...' : editingMilestone.id ? 'Aktualisieren' : 'Hinzufügen'}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setEditingMilestone(initialEditingState);
                                    }}
                                    className="px-6 py-2.5 rounded-lg font-semibold border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                >
                                    Abbrechen
                                </motion.button>
                            </div>
                        </motion.form>
                    )}
                </div>
            )}
        </div>
    );
};
