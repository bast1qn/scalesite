// ============================================
// LAYOUT SELECTOR
// Choose from predefined layout styles
// ============================================

import { motion } from 'framer-motion';

export type LayoutType = 'modern' | 'classic' | 'bold';

interface LayoutSelectorProps {
    selectedLayout: LayoutType;
    onSelect: (layout: LayoutType) => void;
    readOnly?: boolean;
}

interface LayoutOption {
    id: LayoutType;
    name: string;
    description: string;
    preview: React.ReactNode;
}

export const LayoutSelector = ({
    selectedLayout,
    onSelect,
    readOnly = false
}: LayoutSelectorProps) => {
    const layouts: LayoutOption[] = [
        {
            id: 'modern',
            name: 'Modern',
            description: 'Klare Linien, viel Weißraum, minimalistisch',
            preview: <ModernPreview />
        },
        {
            id: 'classic',
            name: 'Klassisch',
            description: 'Zeitloses Design, symmetrisch, professionell',
            preview: <ClassicPreview />
        },
        {
            id: 'bold',
            name: 'Mutig',
            description: 'Große Typografie, kontrastreich, auffällig',
            preview: <BoldPreview />
        }
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                {layouts.map((layout) => {
                    const isSelected = selectedLayout === layout.id;

                    return (
                        <motion.button
                            key={layout.id}
                            onClick={() => !readOnly && onSelect(layout.id)}
                            disabled={readOnly}
                            whileHover={{ scale: readOnly ? 1 : 1.01 }}
                            whileTap={{ scale: readOnly ? 1 : 0.99 }}
                            className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                                isSelected
                                    ? 'border-primary bg-primary/5'
                                    : 'border-dark-text/20 dark:border-light-text/20 hover:border-primary/30'
                            } ${readOnly ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <div className="flex gap-4">
                                {/* Layout Preview */}
                                <div className="flex-1 h-32 bg-white dark:bg-dark-surface rounded border border-dark-text/10 dark:border-light-text/10 p-3 overflow-hidden">
                                    {layout.preview}
                                </div>

                                {/* Layout Info */}
                                <div className="flex-1">
                                    <h3 className={`font-semibold text-lg mb-1 ${
                                        isSelected
                                            ? 'text-primary'
                                            : 'text-dark-text dark:text-light-text'
                                    }`}>
                                        {layout.name}
                                    </h3>
                                    <p className="text-sm text-dark-text/60 dark:text-light-text/60">
                                        {layout.description}
                                    </p>

                                    {/* Selected Indicator */}
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-4 right-4"
                                        >
                                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Selected Layout Info */}
            <div className="mt-4 p-3 bg-light-bg dark:bg-dark-bg rounded-lg">
                <p className="text-sm text-dark-text/70 dark:text-light-text/70">
                    <span className="font-medium">Aktuelles Layout:</span>{' '}
                    {layouts.find(l => l.id === selectedLayout)?.name}
                </p>
            </div>
        </div>
    );
};

// ============================================
// LAYOUT PREVIEWS
// ============================================

const ModernPreview = () => (
    <div className="h-full flex flex-col gap-1">
        {/* Header */}
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-sm" />
        {/* Hero */}
        <div className="flex-1 flex gap-1">
            <div className="w-1/2 bg-blue-100 dark:bg-blue-900/30 rounded-sm" />
            <div className="w-1/2 bg-gray-100 dark:bg-gray-800 rounded-sm flex flex-col gap-1 p-1">
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-sm w-3/4" />
                <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-sm" />
                <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-sm w-1/2" />
            </div>
        </div>
        {/* Content */}
        <div className="h-4 flex gap-1">
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-sm" />
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-sm" />
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-sm" />
        </div>
    </div>
);

const ClassicPreview = () => (
    <div className="h-full flex flex-col gap-1">
        {/* Header */}
        <div className="h-3 bg-gray-800 dark:bg-gray-200 rounded-sm flex items-center justify-center px-2">
            <div className="w-full h-1.5 bg-gray-600 dark:bg-gray-400 rounded-sm" />
        </div>
        {/* Hero - Centered */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-sm flex flex-col items-center justify-center gap-1 p-2">
            <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-sm w-2/3" />
            <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded-sm w-1/2" />
        </div>
        {/* Content - Symmetrical */}
        <div className="h-4 flex gap-1 px-1">
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-sm" />
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-sm" />
        </div>
    </div>
);

const BoldPreview = () => (
    <div className="h-full flex flex-col gap-1">
        {/* Hero - Big, Bold */}
        <div className="h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-sm flex items-center justify-center p-2">
            <div className="w-full h-3 bg-white/80 rounded-sm" />
        </div>
        {/* Content - High Contrast */}
        <div className="flex-1 flex gap-1">
            <div className="w-2/3 bg-gray-900 dark:bg-white flex flex-col gap-1 p-2">
                <div className="h-1 bg-white dark:bg-gray-900 rounded-sm" />
                <div className="h-1 bg-white dark:bg-gray-900 rounded-sm w-3/4" />
            </div>
            <div className="w-1/3 bg-yellow-400 dark:bg-yellow-600 rounded-sm" />
        </div>
        {/* CTA */}
        <div className="h-3 bg-purple-500 rounded-sm flex items-center justify-center px-2">
            <div className="h-1.5 bg-white rounded-sm w-1/2" />
        </div>
    </div>
);
