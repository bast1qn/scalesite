import React, { useState, useMemo, useCallback } from 'react';

/**
 * CannedResponses Component
 *
 * Template library for quick response insertion
 * with category filtering and custom template management
 *
 * @param onSelect - Callback when a response is selected
 * @onCreateTemplate - Callback to create a new custom template
 * * loading - Loading state
 * @className - Additional CSS classes
 */

export interface CannedResponse {
    id: string;
    title: string;
    category: string;
    content: string;
    isCustom?: boolean;
    language?: 'de' | 'en';
    variables?: string[];
}

export interface CannedResponsesProps {
    onSelect: (content: string) => void;
    onCreateTemplate?: (template: Omit<CannedResponse, 'id'>) => void;
    onDeleteTemplate?: (templateId: string) => void;
    customTemplates?: CannedResponse[];
    loading?: boolean;
    className?: string;
}

// Default canned responses
const DEFAULT_RESPONSES: CannedResponse[] = [
    // DE - Greetings
    {
        id: 'greeting-1',
        title: 'Hallo & Willkommen',
        category: 'Begrüßung',
        content: 'Hallo {{name}},\n\nvielen Dank für Ihre Nachricht. Ich habe Ihr Ticket erhalten und werde mich so schnell wie möglich darum kümmern.\n\nMit freundlichen Grüßen',
        language: 'de',
        variables: ['name']
    },
    {
        id: 'greeting-2',
        title: 'Danke für Geduld',
        category: 'Begrüßung',
        content: 'Hallo {{name}},\n\nvielen Dank für Ihre Geduld. Ich habe mir Ihre Anfrage noch einmal genau angesehen und arbeite an einer Lösung.\n\nBeste Grüße',
        language: 'de',
        variables: ['name']
    },
    // DE - Status Updates
    {
        id: 'status-1',
        title: 'In Bearbeitung',
        category: 'Status-Update',
        content: 'Hallo {{name}},\n\nkurzes Update: Ich arbeite derzeit an Ihrem Anliegen. Ich werde Sie informieren, sobald ich neue Informationen habe.\n\nBeste Grüße',
        language: 'de',
        variables: ['name']
    },
    {
        id: 'status-2',
        title: 'Warten auf Informationen',
        category: 'Status-Update',
        content: 'Hallo {{name}},\n\num Ihr Anliegen weiter zu bearbeiten, benötige ich noch folgende Informationen:\n\n- {{info1}}\n- {{info2}}\n\nBitte lassen Sie mich diese wissen, damit ich Ihnen weiterhelfen kann.\n\nVielen Dank!',
        language: 'de',
        variables: ['name', 'info1', 'info2']
    },
    {
        id: 'status-3',
        title: 'Problem gelöst',
        category: 'Status-Update',
        content: 'Hallo {{name}},\n\ngute Neuigkeiten! Das Problem wurde behoben. Bitte überprüfen Sie, ob alles wie erwartet funktioniert.\n\nBei weiteren Fragen stehe ich gerne zur Verfügung.\n\nBeste Grüße',
        language: 'de',
        variables: ['name']
    },
    // DE - Technical
    {
        id: 'tech-1',
        title: 'Cache leeren',
        category: 'Technisch',
        content: 'Hallo {{name}},\n\nbitte versuchen Sie folgende Schritte:\n\n1. Browser-Cache leeren (Strg+Shift+Entf)\n2. Cookies löschen\n3. Seite neu laden\n\nFalls das Problem weiterhin besteht, geben Sie mir bitte Bescheid.\n\nBeste Grüße',
        language: 'de',
        variables: ['name']
    },
    {
        id: 'tech-2',
        title: 'Screenshots angefordert',
        category: 'Technisch',
        content: 'Hallo {{name}},\n\num das Problem besser zu verstehen, könnten Sie bitte einen Screenshot des Fehlers machen? Dies hilft mir bei der schnellen Lösung.\n\nVielen Dank!',
        language: 'de',
        variables: ['name']
    },
    // DE - Closing
    {
        id: 'closing-1',
        title: 'Ticket geschlossen',
        category: 'Abschluss',
        content: 'Hallo {{name}},\n\nich hoffe, ich konnte Ihnen helfen. Da ich keine weitere Rückmeldung erhalten habe, schließe ich dieses Ticket.\n\nBei weiteren Fragen können Sie gerne jederzeit ein neues Ticket erstellen.\n\nMit freundlichen Grüßen',
        language: 'de',
        variables: ['name']
    },
    // EN - Greetings
    {
        id: 'en-greeting-1',
        title: 'Hello & Welcome',
        category: 'Greeting',
        content: 'Hello {{name}},\n\nThank you for your message. I have received your ticket and will look into it as soon as possible.\n\nBest regards',
        language: 'en',
        variables: ['name']
    },
    {
        id: 'en-greeting-2',
        title: 'Thank you for patience',
        category: 'Greeting',
        content: 'Hi {{name}},\n\nthank you for your patience. I\'ve reviewed your request again and am working on a solution.\n\nBest regards',
        language: 'en',
        variables: ['name']
    },
    // EN - Status Updates
    {
        id: 'en-status-1',
        title: 'In Progress',
        category: 'Status Update',
        content: 'Hello {{name}},\n\nquick update: I\'m currently working on your request. I\'ll let you know as soon as I have more information.\n\nBest regards',
        language: 'en',
        variables: ['name']
    },
    {
        id: 'en-status-2',
        title: 'Need more info',
        category: 'Status Update',
        content: 'Hi {{name}},\n\nto proceed with your request, I need some additional information:\n\n- {{info1}}\n- {{info2}}\n\nPlease let me know so I can assist you further.\n\nThank you!',
        language: 'en',
        variables: ['name', 'info1', 'info2']
    },
    {
        id: 'en-status-3',
        title: 'Issue Resolved',
        category: 'Status Update',
        content: 'Hello {{name}},\n\ngood news! The issue has been resolved. Please verify that everything is working as expected.\n\nIf you have any further questions, I\'m here to help.\n\nBest regards',
        language: 'en',
        variables: ['name']
    }
];

const CannedResponses: React.FC<CannedResponsesProps> = ({
    onSelect,
    onCreateTemplate,
    onDeleteTemplate,
    customTemplates = [],
    loading = false,
    className = ''
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTemplate, setNewTemplate] = useState({
        title: '',
        category: '',
        content: '',
        language: 'de' as 'de' | 'en'
    });

    // Combine default and custom templates
    const allResponses = useMemo(() => {
        return [...DEFAULT_RESPONSES, ...customTemplates];
    }, [customTemplates]);

    // Get unique categories
    const categories = useMemo(() => {
        const cats = new Set(allResponses.map(r => r.category));
        return ['all', ...Array.from(cats).sort()];
    }, [allResponses]);

    // Filter responses
    const filteredResponses = useMemo(() => {
        return allResponses.filter(response => {
            const matchesCategory = selectedCategory === 'all' || response.category === selectedCategory;
            const matchesSearch = searchQuery === '' ||
                response.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                response.content.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [allResponses, selectedCategory, searchQuery]);

    // Handle template selection - MEMOIZED with useCallback
    const handleSelectTemplate = useCallback((response: CannedResponse) => {
        // Replace variables with placeholders
        let content = response.content;
        if (response.variables) {
            response.variables.forEach(variable => {
                const placeholder = `{{${variable}}}`;
                content = content.replace(new RegExp(placeholder, 'g'), `[${variable}]`);
            });
        }
        onSelect(content);
    }, [onSelect]);

    // Handle create template - MEMOIZED with useCallback
    const handleCreateTemplate = useCallback(() => {
        if (newTemplate.title && newTemplate.category && newTemplate.content) {
            onCreateTemplate?.({
                title: newTemplate.title,
                category: newTemplate.category,
                content: newTemplate.content,
                language: newTemplate.language,
                isCustom: true
            });
            setNewTemplate({
                title: '',
                category: '',
                content: '',
                language: 'de'
            });
            setShowCreateModal(false);
        }
    }, [newTemplate, onCreateTemplate]);

    // MEMOIZED: Show create modal
    const handleShowCreateModal = useCallback(() => {
        setShowCreateModal(true);
    }, []);

    // MEMOIZED: Search query change handler
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    // MEMOIZED: Category selection handler
    const handleCategorySelect = useCallback((category: string) => {
        setSelectedCategory(category);
    }, []);

    // MEMOIZED: Delete template handler
    const handleDeleteTemplate = useCallback((e: React.MouseEvent, templateId: string) => {
        e.stopPropagation();
        if (confirm('Möchten Sie diese Vorlage wirklich löschen?')) {
            onDeleteTemplate?.(templateId);
        }
    }, [onDeleteTemplate]);

    if (loading) {
        return (
            <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 ${className}`}>
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        Schnellantworten
                    </h3>
                    {onCreateTemplate && (
                        <button
                            onClick={handleShowCreateModal}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors"
                        >
                            + Neu
                        </button>
                    )}
                </div>

                {/* Search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Vorlagen durchsuchen..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <svg
                        className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 dark:text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Category Filter */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategorySelect(category)}
                            className={`
                                px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                                ${selectedCategory === category
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }
                            `}
                        >
                            {category === 'all' ? 'Alle' : category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Templates List */}
            <div className="max-h-96 overflow-y-auto p-4 space-y-2">
                {filteredResponses.length > 0 ? (
                    filteredResponses.map((response) => (
                        <div
                            key={response.id}
                            className="group relative p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                            onClick={() => handleSelectTemplate(response)}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                            {response.title}
                                        </p>
                                        {response.language && (
                                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                                                {response.language}
                                            </span>
                                        )}
                                        {response.isCustom && (
                                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                                                Custom
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                                        {response.category}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                                        {response.content.split('\n')[0]}...
                                    </p>
                                    {response.variables && response.variables.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {response.variables.map((variable) => (
                                                <span
                                                    key={variable}
                                                    className="text-[10px] font-semibold px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
                                                >
                                                    {`{${variable}}`}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {/* Delete button for custom templates */}
                                {response.isCustom && onDeleteTemplate && (
                                    <button
                                        onClick={(e) => handleDeleteTemplate(e, response.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all"
                                        title="Vorlage löschen"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <svg className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                            Keine Vorlagen gefunden
                        </p>
                    </div>
                )}
            </div>

            {/* Create Template Modal */}
            {showCreateModal && onCreateTemplate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                Neue Vorlage erstellen
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                                    Titel
                                </label>
                                <input
                                    type="text"
                                    value={newTemplate.title}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                                    placeholder="z.B. Danke für Geduld"
                                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                                    Kategorie
                                </label>
                                <input
                                    type="text"
                                    value={newTemplate.category}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                                    placeholder="z.B. Begrüßung, Status-Update, Technisch"
                                    list="categories"
                                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <datalist id="categories">
                                    {categories.filter(c => c !== 'all').map(cat => (
                                        <option key={cat} value={cat} />
                                    ))}
                                </datalist>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                                    Sprache
                                </label>
                                <select
                                    value={newTemplate.language}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, language: e.target.value as 'de' | 'en' })}
                                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="de">Deutsch</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                                    Inhalt
                                </label>
                                <textarea
                                    value={newTemplate.content}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                                    placeholder="Hallo {{name}}, vielen Dank für Ihre Nachricht..."
                                    rows={6}
                                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                                    Verwende {'{{variable}}'} für Platzhalter (z.B. {'{{name}}'})
                                </p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3 justify-end">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition-colors"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={handleCreateTemplate}
                                disabled={!newTemplate.title || !newTemplate.category || !newTemplate.content}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
                            >
                                Erstellen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CannedResponses;
