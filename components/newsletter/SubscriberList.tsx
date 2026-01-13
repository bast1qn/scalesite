import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UsersIcon,
    UserPlusIcon,
    TrashIcon,
    DownloadIcon,
    UploadIcon,
    XIcon,
    SearchIcon,
    FunnelIcon,
    LayoutGridIcon,
    ListIcon,
    CalendarIcon
} from 'lucide-react';

/**
 * SubscriberList Component
 *
 * Full subscriber management with search, filtering, segments, and import/export
 *
 * @param subscribers - List of subscribers
 * @param onAdd - Callback for adding subscriber
 * @param onRemove - Callback for removing subscriber
 * @param onExport - Callback for exporting subscribers
 * @param onImport - Callback for importing subscribers
 * @param isLoading - Loading state
 * @param className - Additional CSS classes
 */

export interface Subscriber {
    id: string;
    name: string | null;
    email: string;
    status: 'active' | 'unsubscribed' | 'bounced';
    subscribed_at: string;
    unsubscribed_at: string | null;
    last_opened: string | null;
    last_clicked: string | null;
}

export type SubscriberStatus = Subscriber['status'];

export interface SubscriberListProps {
    subscribers: Subscriber[];
    onAdd?: (email: string, name?: string) => Promise<void>;
    onRemove?: (subscriberId: string) => Promise<void>;
    onExport?: () => Promise<void>;
    onImport?: (file: File) => Promise<void>;
    isLoading?: boolean;
    className?: string;
}

type ViewMode = 'grid' | 'list';
type FilterStatus = 'all' | SubscriberStatus;
type SortField = 'subscribed_at' | 'name' | 'email';
type SortOrder = 'asc' | 'desc';

const SubscriberList: React.FC<SubscriberListProps> = ({
    subscribers,
    onAdd,
    onRemove,
    onExport,
    onImport,
    isLoading = false,
    className = ''
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('active');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('subscribed_at');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newName, setNewName] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState(false);

    // Filter, search, and sort subscribers
    const filteredSubscribers = useMemo(() => {
        return subscribers
            .filter((subscriber) => {
                // Status filter
                if (filterStatus !== 'all' && subscriber.status !== filterStatus) {
                    return false;
                }

                // Search query
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    return (
                        subscriber.email.toLowerCase().includes(query) ||
                        (subscriber.name && subscriber.name.toLowerCase().includes(query))
                    );
                }

                return true;
            })
            .sort((a, b) => {
                let aVal: any, bVal: any;

                switch (sortField) {
                    case 'subscribed_at':
                        aVal = new Date(a.subscribed_at).getTime();
                        bVal = new Date(b.subscribed_at).getTime();
                        break;
                    case 'name':
                        aVal = a.name || '';
                        bVal = b.name || '';
                        break;
                    case 'email':
                        aVal = a.email;
                        bVal = b.email;
                        break;
                }

                if (sortOrder === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });
    }, [subscribers, filterStatus, searchQuery, sortField, sortOrder]);

    // Statistics
    const stats = useMemo(() => {
        return {
            total: subscribers.length,
            active: subscribers.filter(s => s.status === 'active').length,
            unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
            bounced: subscribers.filter(s => s.status === 'bounced').length
        };
    }, [subscribers]);

    const getStatusBadge = (status: SubscriberStatus) => {
        const badges = {
            active: {
                bg: 'bg-green-100 dark:bg-green-900/30',
                text: 'text-green-600 dark:text-green-400',
                label: 'Aktiv'
            },
            unsubscribed: {
                bg: 'bg-slate-100 dark:bg-slate-800',
                text: 'text-slate-600 dark:text-slate-400',
                label: 'Abgemeldet'
            },
            bounced: {
                bg: 'bg-red-100 dark:bg-red-900/30',
                text: 'text-red-600 dark:text-red-400',
                label: 'Bounced'
            }
        };
        const badge = badges[status];
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onAdd || !newEmail.trim()) return;

        setIsAdding(true);
        try {
            await onAdd(newEmail.trim(), newName.trim() || undefined);
            setNewEmail('');
            setNewName('');
            setShowAddForm(false);
        } finally {
            setIsAdding(false);
        }
    };

    const handleRemove = async (subscriberId: string) => {
        if (!onRemove) return;
        if (!confirm('Möchtest du diesen Abonnenten wirklich entfernen?')) return;
        await onRemove(subscriberId);
    };

    const handleExport = async () => {
        if (!onExport) return;
        await onExport();
    };

    const handleImport = async () => {
        if (!onImport || !importFile) return;
        setIsImporting(true);
        try {
            await onImport(importFile);
            setImportFile(null);
            setShowImportModal(false);
        } finally {
            setIsImporting(false);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Heute';
        if (diffDays === 1) return 'Gestern';
        if (diffDays < 7) return `Vor ${diffDays} Tagen`;
        if (diffDays < 30) return `Vor ${Math.floor(diffDays / 7)} Wochen`;
        if (diffDays < 365) return `Vor ${Math.floor(diffDays / 30)} Monaten`;
        return `Vor ${Math.floor(diffDays / 365)} Jahren`;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                            <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                            <p className="text-sm text-slate-500">Gesamt</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                            <UsersIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.active}</p>
                            <p className="text-sm text-slate-500">Aktiv</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                            <UserPlusIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.unsubscribed}</p>
                            <p className="text-sm text-slate-500">Abgemeldet</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                            <UsersIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.bounced}</p>
                            <p className="text-sm text-slate-500">Bounced</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === 'list'
                                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                            title="Listenansicht"
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === 'grid'
                                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                            title="Kachelansicht"
                        >
                            <LayoutGridIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                            className="pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer"
                        >
                            <option value="active">Aktiv</option>
                            <option value="all">Alle Status</option>
                            <option value="unsubscribed">Abgemeldet</option>
                            <option value="bounced">Bounced</option>
                        </select>
                    </div>

                    {/* Sort */}
                    <select
                        value={`${sortField}-${sortOrder}`}
                        onChange={(e) => {
                            const [field, order] = e.target.value.split('-') as [SortField, SortOrder];
                            setSortField(field);
                            setSortOrder(order);
                        }}
                        className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer"
                    >
                        <option value="subscribed_at-desc">Neueste zuerst</option>
                        <option value="subscribed_at-asc">Älteste zuerst</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="email-asc">Email (A-Z)</option>
                        <option value="email-desc">Email (Z-A)</option>
                    </select>

                    {/* Search */}
                    <div className="relative flex-1 sm:flex-none">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Suche..."
                            className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {onExport && (
                        <button
                            onClick={handleExport}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <DownloadIcon className="w-4 h-4" />
                            Export
                        </button>
                    )}
                    {onImport && (
                        <button
                            onClick={() => setShowImportModal(true)}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <UploadIcon className="w-4 h-4" />
                            Import
                        </button>
                    )}
                    {onAdd && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                        >
                            <UserPlusIcon className="w-5 h-5" />
                            Hinzufügen
                        </button>
                    )}
                </div>
            </div>

            {/* Subscriber List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {filteredSubscribers.length === 0 ? (
                    <div className="p-12 text-center">
                        <UsersIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">
                            {subscribers.length === 0
                                ? 'Noch keine Abonnenten vorhanden'
                                : 'Keine Abonnenten gefunden'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        <AnimatePresence>
                            {filteredSubscribers.map((subscriber, index) => (
                                <motion.div
                                    key={subscriber.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                                                    {subscriber.name || 'Unbekannt'}
                                                </h3>
                                                {getStatusBadge(subscriber.status)}
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 mb-2">
                                                {subscriber.email}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1.5">
                                                    <CalendarIcon className="w-4 h-4" />
                                                    Angemeldet: {formatDate(subscriber.subscribed_at)}
                                                </span>
                                                {subscriber.last_opened && (
                                                    <span>
                                                        Zuletzt geöffnet: {formatDate(subscriber.last_opened)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {onRemove && subscriber.status === 'active' && (
                                            <button
                                                onClick={() => handleRemove(subscriber.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                                title="Entfernen"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Add Subscriber Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setShowAddForm(false)}
                        ></div>
                        <motion.div
                            initial={{ scale: 0.95, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 10 }}
                            className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6"
                        >
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <XIcon className="w-5 h-5 text-slate-500" />
                            </button>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                Abonnent hinzufügen
                            </h3>

                            <form onSubmit={handleAdd} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="email@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Name (optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="Max Mustermann"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Abbrechen
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isAdding}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isAdding ? 'Hinzufügen...' : 'Hinzufügen'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Import Modal */}
            <AnimatePresence>
                {showImportModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setShowImportModal(false)}
                        ></div>
                        <motion.div
                            initial={{ scale: 0.95, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 10 }}
                            className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6"
                        >
                            <button
                                onClick={() => setShowImportModal(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <XIcon className="w-5 h-5 text-slate-500" />
                            </button>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                Abonnenten importieren
                            </h3>

                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center">
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="import-file"
                                    />
                                    <label
                                        htmlFor="import-file"
                                        className="cursor-pointer block"
                                    >
                                        <UploadIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                        <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
                                            {importFile ? importFile.name : 'CSV Datei auswählen'}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            CSV mit Email und Name (optional) Spalten
                                        </p>
                                    </label>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowImportModal(false)}
                                        className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Abbrechen
                                    </button>
                                    <button
                                        onClick={handleImport}
                                        disabled={!importFile || isImporting}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isImporting ? 'Importiert...' : 'Importieren'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubscriberList;
