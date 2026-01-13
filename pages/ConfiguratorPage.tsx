// ============================================
// CONFIGURATOR PAGE
// ============================================

import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts';
import { Configurator, ProjectConfig } from '../components/configurator/Configurator';
import { api } from '../lib/api.js';

interface ConfiguratorPageProps {
    setCurrentPage: (page: string) => void;
}

export const ConfiguratorPage = ({ setCurrentPage }: ConfiguratorPageProps) => {
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [currentConfig, setCurrentConfig] = useState<ProjectConfig | undefined>();
    const [projectId, setProjectId] = useState<string | undefined>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Get project ID from URL or create new project
    useEffect(() => {
        const loadProject = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                // Check if we have a project ID in URL
                const urlParams = new URLSearchParams(window.location.search);
                const projectIdFromUrl = urlParams.get('project');

                if (projectIdFromUrl) {
                    // Load existing project
                    const { data, error } = await api.getProject(projectIdFromUrl);

                    if (error || !data) {
                        setErrorMessage('Projekt konnte nicht geladen werden');
                        setIsLoading(false);
                        return;
                    }

                    setProjectId(data.id);
                    if (data.config) {
                        setCurrentConfig(data.config as ProjectConfig);
                    }
                }
            } catch (error) {
                console.error('Error loading project:', error);
                setErrorMessage('Ein Fehler ist aufgetreten');
            } finally {
                setIsLoading(false);
            }
        };

        loadProject();
    }, [user]);

    const handleSave = async (config: ProjectConfig) => {
        if (!user) {
            setErrorMessage('Sie müssen eingeloggt sein, um zu speichern');
            return;
        }

        try {
            let result;

            if (projectId) {
                // Update existing project
                result = await api.updateProject(projectId, {
                    config: config as any,
                    updated_at: new Date().toISOString()
                });
            } else {
                // Create new project
                result = await api.createProject({
                    name: config.content.headline || 'Neues Projekt',
                    config: config as any,
                    status: 'draft',
                    user_id: user.id
                });

                if (result.data && !result.error) {
                    setProjectId(result.data.id);
                }
            }

            if (result.error) {
                setErrorMessage(result.error);
                setSuccessMessage(null);
                return;
            }

            setSuccessMessage('Konfiguration erfolgreich gespeichert!');
            setErrorMessage(null);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error('Error saving configuration:', error);
            setErrorMessage('Fehler beim Speichern der Konfiguration');
            setSuccessMessage(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Konfigurator wird geladen...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 max-w-md">
                        <div className="text-6xl mb-4">🔐</div>
                        <h2 className="text-2xl font-bold mb-4">Login erforderlich</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Bitte melden Sie sich an, um den Konfigurator zu verwenden.
                        </p>
                        <button
                            onClick={() => setCurrentPage('login')}
                            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
                        >
                            Zum Login
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Error Message */}
            {errorMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
                >
                    {errorMessage}
                    <button
                        onClick={() => setErrorMessage(null)}
                        className="ml-4 hover:text-red-200"
                    >
                        ✕
                    </button>
                </motion.div>
            )}

            {/* Success Message */}
            {successMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
                >
                    {successMessage}
                    <button
                        onClick={() => setSuccessMessage(null)}
                        className="ml-4 hover:text-green-200"
                    >
                        ✕
                    </button>
                </motion.div>
            )}

            <Configurator
                projectId={projectId}
                initialConfig={currentConfig}
                onSave={handleSave}
            />
        </div>
    );
};
