// ============================================
// CONFIGURATOR - Shared Types
// Breaking circular dependencies
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

export interface ConfiguratorState {
    config: ProjectConfig;
    isDirty: boolean;
    isSaving: boolean;
    lastSaved: Date | null;
    currentStep: number;
}

export interface ConfiguratorActions {
    updateConfig: (updates: Partial<ProjectConfig>) => void;
    saveConfig: () => Promise<void>;
    resetConfig: () => void;
    setDevice: (device: DeviceType) => void;
}

// ============================================
// CONSTANTS
// ============================================

/**
 * Default content configuration for new projects
 */
export const INITIAL_CONTENT: ContentConfig = {
    headline: 'Ihr Erfolg beginnt hier',
    subheadline: 'Professionelle Websites für Ihr Business',
    aboutText: 'Wir sind Ihr Partner für professionelle Webseiten-Lösungen.',
    services: ['Web Design', 'Entwicklung', 'SEO']
};

/**
 * Returns default color palette (indigo/violet theme)
 */
export const getDefaultColors = (): ColorPalette => ({
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    background: '#ffffff',
    text: '#1f2937'
});

/**
 * Returns default content configuration
 */
export const getDefaultContent = (): ContentConfig => INITIAL_CONTENT;

/**
 * Predefined color palettes for quick selection
 * Each palette follows modern design principles with good contrast
 */
export const DEFAULT_COLOR_PALETTES: ColorPalette[] = [
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

export const AUTO_SAVE_DELAY = 2000;
export const SUCCESS_MESSAGE_DELAY = 3000;
