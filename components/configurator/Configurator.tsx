// ============================================
// CONFIGURATOR - Main Container
// Interactive Website Configuration with Live Preview
// ============================================

import { useReducer, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ColorPalettePicker } from './ColorPalettePicker';
import { LayoutSelector } from './LayoutSelector';
import { ContentEditor } from './ContentEditor';
import { PreviewFrame } from './PreviewFrame';
import { DeviceToggle } from './DeviceToggle';

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

const INITIAL_CONTENT: ContentConfig = {
    headline: 'Ihr Erfolg beginnt hier',
    subheadline: 'Professionelle Websites für Ihr Business',
    aboutText: 'Wir sind Ihr Partner für professionelle Webseiten-Lösungen.',
    services: ['Web Design', 'Entwicklung', 'SEO']
};

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
    | { type: 'UPDATE_CONTENT_FIELD'; payload: { field: keyof ContentConfig; value: any } }
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

    // Track unsaved changes
    useEffect(() => {
        setHasUnsavedChanges(true);
        setSaveSuccess(false);
    }, [state]);

    // Handle save
    const handleSave = async () => {
        if (!onSave || readOnly) return;

        setIsSaving(true);
        try {
            await onSave(state);
            setHasUnsavedChanges(false);
            setSaveSuccess(true);

            // Reset success message after 3 seconds
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to save configuration:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle reset
    const handleReset = () => {
        if (confirm('Möchten Sie die Konfiguration zurücksetzen?')) {
            dispatch({ type: 'RESET_CONFIG' });
        }
    };

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
                            {/* Unsaved Changes Indicator */}
                            {hasUnsavedChanges && (
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
                                    disabled={isSaving || !hasUnsavedChanges}
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
