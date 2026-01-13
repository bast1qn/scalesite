// ============================================
// CONFIGURATOR - Main Container
// Interactive Website Configuration with Live Preview
// ============================================

// React imports
import { useReducer, useEffect, useState, useCallback, useRef } from 'react';

// Third-party imports
import { AnimatePresence, motion } from 'framer-motion';

// Component imports
import { ColorPalettePicker } from './ColorPalettePicker';
import { ContentEditor } from './ContentEditor';
import { DeviceToggle } from './DeviceToggle';
import { LayoutSelector } from './LayoutSelector';
import { PreviewFrame } from './PreviewFrame';

// ============================================
// TYPES & INTERFACES
// ============================================

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface ColorPalette {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
}

export interface ContentConfig {
    headline: string;
    subheadline: string;
    aboutText: string;
    services: string[];
}

export interface ProjectConfig {
    colors: ColorPalette;
    layout: 'modern' | 'classic' | 'bold';
    device: DeviceType;
    content: ContentConfig;
    features: string[];
}

interface ConfiguratorProps {
    projectId?: string;
    initialConfig?: Partial<ProjectConfig>;
    onSave?: (config: ProjectConfig) => Promise<void>;
    readOnly?: boolean;
}

// ============================================
// INITIAL STATE
// ============================================

const AUTO_SAVE_DELAY_MS = 3000;
const SUCCESS_MESSAGE_DELAY_MS = 3000;

const DEFAULT_COLOR_PALETTES: ColorPalette[] = [
    {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#ec4899',
        background: '#ffffff',
        text: '#1f2937'
    },
    {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#1f2937'
    },
    {
        primary: '#ef4444',
        secondary: '#f97316',
        accent: '#eab308',
        background: '#ffffff',
        text: '#1f2937'
    },
    {
        primary: '#1f2937',
        secondary: '#4b5563',
        accent: '#6b7280',
        background: '#ffffff',
        text: '#1f2937'
    },
    {
        primary: '#059669',
        secondary: '#0891b2',
        accent: '#0d9488',
        background: '#ffffff',
        text: '#1f2937'
    },
    {
        primary: '#7c3aed',
        secondary: '#db2777',
        accent: '#f43f5e',
        background: '#ffffff',
        text: '#1f2937'
    }
];

export const INITIAL_CONTENT: ContentConfig = {
    headline: 'Ihr Erfolg beginnt hier',
    subheadline: 'Professionelle Websites für Ihr Business',
    aboutText: 'Wir sind Ihr Partner für professionelle Webseiten-Lösungen.',
    services: ['Web Design', 'Entwicklung', 'SEO']
};

/**
 * Get default color palette
 */
export const getDefaultColors = () => ({
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    background: '#ffffff',
    text: '#1f2937'
});

/**
 * Get default content
 */
export const getDefaultContent = () => INITIAL_CONTENT;

const getInitialState = (initialConfig?: Partial<ProjectConfig>): ProjectConfig => ({
    colors: initialConfig?.colors || DEFAULT_COLOR_PALETTES[0],
    layout: initialConfig?.layout || 'modern',
    device: initialConfig?.device || 'desktop',
    content: initialConfig?.content || INITIAL_CONTENT,
    features: initialConfig?.features || []
});

// ============================================
// REDUCER
// ============================================

type ConfigAction =
    | { type: 'SET_COLORS'; payload: ColorPalette }
    | { type: 'SET_LAYOUT'; payload: 'modern' | 'classic' | 'bold' }
    | { type: 'SET_DEVICE'; payload: DeviceType }
    | { type: 'SET_CONTENT'; payload: ContentConfig }
    | { type: 'UPDATE_CONTENT_FIELD'; payload: { field: keyof ContentConfig; value: ContentConfig[keyof ContentConfig] } }
    | { type: 'TOGGLE_FEATURE'; payload: string }
    | { type: 'RESET_CONFIG' }
    | { type: 'LOAD_CONFIG'; payload: ProjectConfig };

const configReducer = (state: ProjectConfig, action: ConfigAction): ProjectConfig => {
    switch (action.type) {
        case 'SET_COLORS':
            return { ...state, colors: action.payload };
        case 'SET_LAYOUT':
            return { ...state, layout: action.payload };
        case 'SET_DEVICE':
            return { ...state, device: action.payload };
        case 'SET_CONTENT':
            return { ...state, content: action.payload };
        case 'UPDATE_CONTENT_FIELD':
            return {
                ...state,
                content: {
                    ...state.content,
                    [action.payload.field]: action.payload.value
                }
            };
        case 'TOGGLE_FEATURE':
            const features = state.features.includes(action.payload)
                ? state.features.filter(f => f !== action.payload)
                : [...state.features, action.payload];
            return { ...state, features };
        case 'RESET_CONFIG':
            return getInitialState();
        case 'LOAD_CONFIG':
            return action.payload;
        default:
            return state;
    }
};

// ============================================
// MAIN COMPONENT
// ============================================

export const Configurator = ({
    projectId,
    initialConfig,
    onSave,
    readOnly = false
}: ConfiguratorProps) => {
    const [state, dispatch] = useReducer(configReducer, getInitialState(initialConfig));
    const [activeTab, setActiveTab] = useState<'design' | 'content' | 'features'>('design');
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isAutoSaving, setIsAutoSaving] = useState(false);

    // Auto-save with debounce (3 seconds)
    const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastSavedStateRef = useRef<ProjectConfig | null>(null);

    // Debounced auto-save function
    const debouncedAutoSave = useCallback(async () => {
        if (!onSave || readOnly || !projectId) return;

        // Don't auto-save if state hasn't changed since last save
        if (lastSavedStateRef.current && JSON.stringify(state) === JSON.stringify(lastSavedStateRef.current)) {
            return;
        }

        setIsAutoSaving(true);
        try {
            await onSave(state);
            lastSavedStateRef.current = state;
            setHasUnsavedChanges(false);
            setSaveSuccess(true);

            // Reset success message after delay
            setTimeout(() => setSaveSuccess(false), SUCCESS_MESSAGE_DELAY_MS);
        } catch (error) {
            console.error('Auto-save failed:', error);
            setHasUnsavedChanges(true); // Keep unsaved changes indicator on error
        } finally {
            setIsAutoSaving(false);
        }
    }, [state, onSave, readOnly, projectId]);

    // Track unsaved changes and trigger auto-save
    useEffect(() => {
        if (lastSavedStateRef.current && JSON.stringify(state) !== JSON.stringify(lastSavedStateRef.current)) {
            setHasUnsavedChanges(true);
            setSaveSuccess(false);

            // Clear existing timeout
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }

            // Set new timeout for auto-save
            if (projectId) {
                autoSaveTimeoutRef.current = setTimeout(() => {
                    debouncedAutoSave();
                }, AUTO_SAVE_DELAY_MS);
            }
        }
    }, [state, projectId, debouncedAutoSave]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, []);

    // Handle manual save
    const handleSave = useCallback(async () => {
        if (!onSave || readOnly) return;

        // Cancel any pending auto-save
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
            autoSaveTimeoutRef.current = null;
        }

        setIsSaving(true);
        try {
            await onSave(state);
            lastSavedStateRef.current = state;
            setHasUnsavedChanges(false);
            setSaveSuccess(true);

            // Reset success message after delay
            setTimeout(() => setSaveSuccess(false), SUCCESS_MESSAGE_DELAY_MS);
        } catch (error) {
            console.error('Failed to save configuration:', error);
            setHasUnsavedChanges(true);
        } finally {
            setIsSaving(false);
        }
    }, [onSave, readOnly, state]);

    // Handle reset
    const handleReset = useCallback(() => {
        if (confirm('Möchten Sie die Konfiguration zurücksetzen?')) {
            dispatch({ type: 'RESET_CONFIG' });
        }
    }, []);

    return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-surface dark:bg-dark-surface border-b border-dark-text/10 dark:border-light-text/10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div>
                            <h1 className="text-2xl font-bold text-dark-text dark:text-light-text">
                                Website Konfigurator
                            </h1>
                            <p className="text-sm text-dark-text/60 dark:text-light-text/60">
                                {projectId ? 'Projekt bearbeiten' : 'Neues Projekt erstellen'}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Auto-Saving Indicator */}
                            {isAutoSaving && (
                                <span className="text-sm text-blue-500 dark:text-blue-400 flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    Speichern...
                                </span>
                            )}

                            {/* Unsaved Changes Indicator */}
                            {hasUnsavedChanges && !isAutoSaving && (
                                <span className="text-sm text-orange-500 dark:text-orange-400">
                                    Nicht gespeicherte Änderungen
                                </span>
                            )}

                            {/* Save Success Indicator */}
                            <AnimatePresence>
                                {saveSuccess && (
                                    <motion.span
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-sm text-green-500 dark:text-green-400"
                                    >
                                        ✓ Gespeichert
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Save Button */}
                            {!readOnly && (
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || isAutoSaving || !hasUnsavedChanges}
                                    className="px-6 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                                >
                                    {isSaving ? 'Speichern...' : 'Speichern'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-surface dark:bg-dark-surface border-b border-dark-text/10 dark:border-light-text/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('design')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'design'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-dark-text/60 dark:text-light-text/60 hover:text-dark-text dark:hover:text-light-text'
                            }`}
                        >
                            Design
                        </button>
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'content'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-dark-text/60 dark:text-light-text/60 hover:text-dark-text dark:hover:text-light-text'
                            }`}
                        >
                            Inhalt
                        </button>
                        <button
                            onClick={() => setActiveTab('features')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'features'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-dark-text/60 dark:text-light-text/60 hover:text-dark-text dark:hover:text-light-text'
                            }`}
                        >
                            Features
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Panel - Configuration */}
                    <div className="space-y-6">
                        <AnimatePresence mode="wait">
                            {activeTab === 'design' && (
                                <motion.div
                                    key="design"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    {/* Color Palette */}
                                    <div className="bg-surface dark:bg-dark-surface rounded-lg p-6 shadow-sm border border-dark-text/10 dark:border-light-text/10">
                                        <h2 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">
                                            Farbschema
                                        </h2>
                                        <ColorPalettePicker
                                            palettes={DEFAULT_COLOR_PALETTES}
                                            selectedPalette={state.colors}
                                            onSelect={(colors) => dispatch({ type: 'SET_COLORS', payload: colors })}
                                            readOnly={readOnly}
                                        />
                                    </div>

                                    {/* Layout Selector */}
                                    <div className="bg-surface dark:bg-dark-surface rounded-lg p-6 shadow-sm border border-dark-text/10 dark:border-light-text/10">
                                        <h2 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">
                                            Layout-Stil
                                        </h2>
                                        <LayoutSelector
                                            selectedLayout={state.layout}
                                            onSelect={(layout) => dispatch({ type: 'SET_LAYOUT', payload: layout })}
                                            readOnly={readOnly}
                                        />
                                    </div>

                                    {/* Device Toggle */}
                                    <div className="bg-surface dark:bg-dark-surface rounded-lg p-6 shadow-sm border border-dark-text/10 dark:border-light-text/10">
                                        <h2 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">
                                            Vorschau Gerät
                                        </h2>
                                        <DeviceToggle
                                            selectedDevice={state.device}
                                            onSelect={(device) => dispatch({ type: 'SET_DEVICE', payload: device })}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'content' && (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-surface dark:bg-dark-surface rounded-lg p-6 shadow-sm border border-dark-text/10 dark:border-light-text/10"
                                >
                                    <h2 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">
                                        Inhalte bearbeiten
                                    </h2>
                                    <ContentEditor
                                        content={state.content}
                                        onChange={(content) => dispatch({ type: 'SET_CONTENT', payload: content })}
                                        readOnly={readOnly}
                                    />
                                </motion.div>
                            )}

                            {activeTab === 'features' && (
                                <motion.div
                                    key="features"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-surface dark:bg-dark-surface rounded-lg p-6 shadow-sm border border-dark-text/10 dark:border-light-text/10"
                                >
                                    <h2 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">
                                        Features auswählen
                                    </h2>
                                    <FeatureSelector
                                        selectedFeatures={state.features}
                                        onToggle={(feature) => dispatch({ type: 'TOGGLE_FEATURE', payload: feature })}
                                        readOnly={readOnly}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Reset Button */}
                        {!readOnly && (
                            <button
                                onClick={handleReset}
                                className="w-full px-4 py-2 text-dark-text/60 dark:text-light-text/60 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                                Zurücksetzen
                            </button>
                        )}
                    </div>

                    {/* Right Panel - Live Preview */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <div className="bg-surface dark:bg-dark-surface rounded-lg p-6 shadow-sm border border-dark-text/10 dark:border-light-text/10">
                            <h2 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">
                                Live Vorschau
                            </h2>
                            <PreviewFrame
                                config={state}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================
// FEATURE SELECTOR COMPONENT
// ============================================

interface FeatureSelectorProps {
    selectedFeatures: string[];
    onToggle: (feature: string) => void;
    readOnly?: boolean;
}

const AVAILABLE_FEATURES = [
    { id: 'contact_form', name: 'Kontaktformular', icon: '📝' },
    { id: 'gallery', name: 'Bildergalerie', icon: '🖼️' },
    { id: 'blog', name: 'Blog', icon: '📝' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'newsletter', name: 'Newsletter', icon: '📧' },
    { id: 'seo', name: 'SEO Optimierung', icon: '🔍' },
    { id: 'multilingual', name: 'Mehrsprachigkeit', icon: '🌍' },
    { id: 'booking', name: 'Buchungssystem', icon: '📅' },
    { id: 'social', name: 'Social Media Integration', icon: '📱' },
    { id: 'payment', name: 'Zahlungsintegration', icon: '💳' }
];

const FeatureSelector = ({ selectedFeatures, onToggle, readOnly }: FeatureSelectorProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AVAILABLE_FEATURES.map((feature) => {
                const isSelected = selectedFeatures.includes(feature.id);

                return (
                    <button
                        key={feature.id}
                        onClick={() => !readOnly && onToggle(feature.id)}
                        disabled={readOnly}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                            isSelected
                                ? 'border-primary bg-primary/10'
                                : 'border-dark-text/20 dark:border-light-text/20 hover:border-primary/50'
                        } ${readOnly ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{feature.icon}</span>
                            <span className={`font-medium ${
                                isSelected
                                    ? 'text-primary'
                                    : 'text-dark-text dark:text-light-text'
                            }`}>
                                {feature.name}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};
