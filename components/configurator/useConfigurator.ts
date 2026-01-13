// ============================================
// CONFIGURATOR API INTEGRATION
// Helper functions for saving/loading configurations
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import type { ProjectConfig } from './Configurator';

interface UseConfiguratorReturn {
    config: ProjectConfig | null;
    loading: boolean;
    error: string | null;
    saveConfig: (config: ProjectConfig) => Promise<void>;
    loadConfig: (projectId: string) => Promise<void>;
    reset: () => void;
}

/**
 * Custom hook for managing configuration state with API
 * @param projectId - Optional project ID for loading existing config
 */
export const useConfigurator = (projectId?: string): UseConfiguratorReturn => {
    const [config, setConfig] = useState<ProjectConfig | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Load configuration from database
     */
    const loadConfig = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            const { data: project, error: projectError } = await api.getProject(id);

            if (projectError) {
                throw new Error(projectError);
            }

            if (!project) {
                throw new Error('Projekt nicht gefunden');
            }

            // Parse config from JSON
            const parsedConfig = typeof project.config === 'string'
                ? JSON.parse(project.config)
                : project.config;

            // Parse content from JSON
            const parsedContent = typeof project.content === 'string'
                ? JSON.parse(project.content)
                : project.content;

            setConfig({
                colors: parsedConfig.colors || config?.colors || getDefaultColors(),
                layout: parsedConfig.layout || 'modern',
                device: 'desktop',
                content: parsedContent || getDefaultContent(),
                features: parsedConfig.features || []
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Fehler beim Laden der Konfiguration';
            setError(message);
            console.error('Failed to load config:', err);
        } finally {
            setLoading(false);
        }
    }, [config]);

    /**
     * Save configuration to database
     */
    const saveConfig = useCallback(async (newConfig: ProjectConfig) => {
        setLoading(true);
        setError(null);

        try {
            // If projectId exists, update existing project
            if (projectId) {
                const { error: updateError } = await api.updateProjectConfig(projectId, {
                    colors: newConfig.colors,
                    layout: newConfig.layout,
                    features: newConfig.features
                });

                if (updateError) {
                    throw new Error(updateError);
                }

                // Also update content
                const { error: contentError } = await api.updateProjectContent(projectId, newConfig.content);

                if (contentError) {
                    throw new Error(contentError);
                }
            } else {
                // Create new project
                const { data: newProject, error: createError } = await api.createProject({
                    name: newConfig.content.headline,
                    description: newConfig.content.subheadline,
                    industry: 'general',
                    config: {
                        colors: newConfig.colors,
                        layout: newConfig.layout,
                        features: newConfig.features
                    },
                    content: newConfig.content,
                    service_id: 1 // Default service
                });

                if (createError) {
                    throw new Error(createError);
                }

                if (!newProject) {
                    throw new Error('Fehler beim Erstellen des Projekts');
                }

                // TODO: Redirect to new project or return ID
                console.log('New project created:', newProject.id);
            }

            setConfig(newConfig);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Fehler beim Speichern der Konfiguration';
            setError(message);
            console.error('Failed to save config:', err);
            throw err; // Re-throw to let caller handle
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    /**
     * Reset to default configuration
     */
    const reset = useCallback(() => {
        setConfig({
            colors: getDefaultColors(),
            layout: 'modern',
            device: 'desktop',
            content: getDefaultContent(),
            features: []
        });
        setError(null);
    }, []);

    // Auto-load config if projectId provided
    useEffect(() => {
        if (projectId) {
            loadConfig(projectId);
        } else {
            // Initialize with default config
            reset();
        }
    }, [projectId, loadConfig, reset]);

    return {
        config,
        loading,
        error,
        saveConfig,
        loadConfig,
        reset
    };
};

// ============================================
// HELPER FUNCTIONS
// ============================================

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
export const getDefaultContent = () => ({
    headline: 'Ihr Erfolg beginnt hier',
    subheadline: 'Professionelle Websites für Ihr Business',
    aboutText: 'Wir sind Ihr Partner für professionelle Webseiten-Lösungen.',
    services: ['Web Design', 'Entwicklung', 'SEO']
});

/**
 * Validate configuration before saving
 */
export const validateConfig = (config: ProjectConfig): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validate colors
    if (!config.colors?.primary) errors.push('Primärfarbe fehlt');
    if (!config.colors?.secondary) errors.push('Sekundärfarbe fehlt');
    if (!config.colors?.background) errors.push('Hintergrundfarbe fehlt');

    // Validate content
    if (!config.content?.headline || config.content.headline.length < 5) {
        errors.push('Headline muss mindestens 5 Zeichen lang sein');
    }
    if (config.content?.headline && config.content.headline.length > 100) {
        errors.push('Headline darf maximal 100 Zeichen lang sein');
    }
    if (!config.content?.aboutText || config.content.aboutText.length < 20) {
        errors.push('About-Text muss mindestens 20 Zeichen lang sein');
    }

    // Validate layout
    if (!['modern', 'classic', 'bold'].includes(config.layout)) {
        errors.push('Ungültiges Layout');
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

/**
 * Export configuration as JSON
 */
export const exportConfig = (config: ProjectConfig): string => {
    return JSON.stringify(config, null, 2);
};

/**
 * Import configuration from JSON
 */
export const importConfig = (json: string): ProjectConfig | null => {
    try {
        const parsed = JSON.parse(json);
        const validation = validateConfig(parsed);

        if (!validation.valid) {
            console.error('Invalid config:', validation.errors);
            return null;
        }

        return parsed;
    } catch (error) {
        console.error('Failed to import config:', error);
        return null;
    }
};

/**
 * Generate preview URL for project
 */
export const generatePreviewUrl = (projectId: string): string => {
    // In production, this would point to your preview server
    return `/preview/${projectId}`;
};

/**
 * Clone configuration
 */
export const cloneConfig = (config: ProjectConfig): ProjectConfig => {
    return JSON.parse(JSON.stringify(config));
};

/**
 * Merge two configurations
 */
export const mergeConfigs = (
    base: ProjectConfig,
    override: Partial<ProjectConfig>
): ProjectConfig => {
    return {
        colors: { ...base.colors, ...override.colors },
        layout: override.layout || base.layout,
        device: override.device || base.device,
        content: { ...base.content, ...override.content },
        features: override.features || base.features
    };
};

/**
 * Check if configuration has unsaved changes
 */
export const hasChanges = (
    original: ProjectConfig,
    current: ProjectConfig
): boolean => {
    return JSON.stringify(original) !== JSON.stringify(current);
};

/**
 * Get configuration summary for display
 */
export const getConfigSummary = (config: ProjectConfig): string => {
    return `${config.layout} layout • ${config.features.length} features • ${config.content.headline.substring(0, 30)}...`;
};
