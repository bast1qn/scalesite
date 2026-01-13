// ============================================
// DESIGN PREFS STEP - Third Onboarding Step
// Design preferences: colors, layouts, fonts
// ============================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OnboardingData } from './OnboardingWizard';

// ============================================
// TYPES & INTERFACES
// ============================================

interface DesignPrefsStepProps {
    data: OnboardingData;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    onChange: (field: string, value: OnboardingData[keyof OnboardingData]) => void;
}

// ============================================
// CONSTANTS
// ============================================

interface ColorPalette {
    id: string;
    name: string;
    colors: string[];
    description: string;
}

const COLOR_PALETTES: ColorPalette[] = [
    {
        id: 'blue-violet',
        name: 'Blau-Violett',
        colors: ['#8B5CF6', '#3B82F6', '#60A5FA', '#A78BFA', '#C4B5FD'],
        description: 'Modern & professionell'
    },
    {
        id: 'green-teal',
        name: 'Grün-Teal',
        colors: ['#10B981', '#14B8A6', '#34D399', '#5EEAD4', '#99F6E4'],
        description: 'Frisch & natürlich'
    },
    {
        id: 'warm-orange',
        name: 'Warm-Orange',
        colors: ['#F97316', '#FB923C', '#FDBA74', '#FED7AA', '#FFEDD5'],
        description: 'Energetisch & kreativ'
    },
    {
        id: 'elegant-gray',
        name: 'Eleganz Grau',
        colors: ['#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6'],
        description: 'Klassisch & minimalistisch'
    },
    {
        id: 'bold-red',
        name: 'Mutig Rot',
        colors: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2'],
        description: 'Aufmerksamkeitsstark'
    },
    {
        id: 'royal-purple',
        name: 'Königslila',
        colors: ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'],
        description: 'Premium & exklusiv'
    }
];

interface LayoutOption {
    id: string;
    name: string;
    description: string;
    preview: string;
}

const LAYOUTS: LayoutOption[] = [
    {
        id: 'modern',
        name: 'Modern',
        description: 'Große Bilder, viel Weißraum',
        preview: 'Modern minimalistisch mit großem Hero-Bild und cleanem Design'
    },
    {
        id: 'classic',
        name: 'Klassisch',
        description: 'Traditionelles Grid-Layout',
        preview: 'Zeitloses Design mit klarer Struktur und Symmetrie'
    },
    {
        id: 'bold',
        name: 'Mutig',
        description: 'Kräftige Farben, auffällig',
        preview: 'Gewagt und dynamisch mit starken Kontrasten'
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Reduciert, fokussiert',
        preview: 'Ultra-clean mit maximaler Fokus auf Inhalte'
    }
];

const FONTS = [
    { id: 'inter', name: 'Inter', style: 'sans-serif', description: 'Modern & lesbar' },
    { id: 'roboto', name: 'Roboto', style: 'sans-serif', description: 'Professionell & vielseitig' },
    { id: 'open-sans', name: 'Open Sans', style: 'sans-serif', description: 'Freundlich & klar' },
    { id: 'montserrat', name: 'Montserrat', style: 'sans-serif', description: 'Stilvoll & elegant' },
    { id: 'playfair', name: 'Playfair Display', style: 'serif', description: 'Klassisch & prestigeträchtig' },
    { id: 'lato', name: 'Lato', style: 'sans-serif', description: 'Warm & einladend' }
];

// ============================================
// COLOR PALETTE SELECTOR
// ============================================

function ColorPaletteSelector({
    selected,
    onSelect
}: {
    selected: string;
    onSelect: (palette: string) => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Farbschema
                <span className="text-gray-400 font-normal ml-2">(Optional)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {COLOR_PALETTES.map((palette, index) => (
                    <motion.button
                        key={palette.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        type="button"
                        onClick={() => onSelect(palette.id)}
                        className={`
                            relative p-4 rounded-lg border-2 transition-all duration-200
                            ${selected === palette.id
                                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-md'
                                : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600'
                            }
                        `}
                    >
                        {/* Color Swatches */}
                        <div className="flex gap-1 mb-3">
                            {palette.colors.map((color, i) => (
                                <div
                                    key={i}
                                    className="flex-1 h-8 rounded-full"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>

                        {/* Palette Name & Description */}
                        <div className="text-left">
                            <p className={`font-medium mb-1 ${
                                selected === palette.id
                                    ? 'text-violet-700 dark:text-violet-300'
                                    : 'text-gray-900 dark:text-white'
                            }`}>
                                {palette.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {palette.description}
                            </p>
                        </div>

                        {/* Selected Indicator */}
                        {selected === palette.id && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center"
                            >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </motion.div>
                        )}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}

// ============================================
// LAYOUT SELECTOR
// ============================================

function LayoutSelector({
    selected,
    onSelect
}: {
    selected: string;
    onSelect: (layout: string) => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
        >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Layout-Stil
                <span className="text-gray-400 font-normal ml-2">(Optional)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {LAYOUTS.map((layout, index) => (
                    <motion.button
                        key={layout.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        type="button"
                        onClick={() => onSelect(layout.id)}
                        className={`
                            relative p-4 rounded-lg border-2 text-left transition-all duration-200
                            ${selected === layout.id
                                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600'
                            }
                        `}
                    >
                        {/* Preview Area */}
                        <div className={`
                            h-24 rounded-lg mb-3 flex items-center justify-center text-xs font-medium
                            ${selected === layout.id
                                ? 'bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30'
                                : 'bg-gray-100 dark:bg-gray-700'
                            }
                        `}>
                            <span className={`${
                                selected === layout.id ? 'text-violet-700 dark:text-violet-300' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                                {layout.name}
                            </span>
                        </div>

                        {/* Layout Info */}
                        <div>
                            <p className={`font-medium mb-1 ${
                                selected === layout.id
                                    ? 'text-violet-700 dark:text-violet-300'
                                    : 'text-gray-900 dark:text-white'
                            }`}>
                                {layout.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                {layout.description}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                {layout.preview}
                            </p>
                        </div>

                        {/* Selected Indicator */}
                        {selected === layout.id && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center"
                            >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </motion.div>
                        )}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}

// ============================================
// FONT SELECTOR
// ============================================

function FontSelector({
    selected,
    onSelect
}: {
    selected: string;
    onSelect: (font: string) => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
        >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Schriftart
                <span className="text-gray-400 font-normal ml-2">(Optional)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FONTS.map((font, index) => (
                    <motion.button
                        key={font.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                        type="button"
                        onClick={() => onSelect(font.id)}
                        className={`
                            relative p-4 rounded-lg border-2 text-left transition-all duration-200
                            ${selected === font.id
                                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600'
                            }
                        `}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-lg font-medium mb-1 ${
                                    selected === font.id
                                        ? 'text-violet-700 dark:text-violet-300'
                                        : 'text-gray-900 dark:text-white'
                                }`} style={{ fontFamily: font.style }}>
                                    {font.name}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {font.description}
                                </p>
                            </div>

                            {/* Selected Indicator */}
                            {selected === font.id && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </motion.div>
                            )}
                        </div>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function DesignPrefsStep({ data, errors, touched, onChange }: DesignPrefsStepProps) {
    const [selectedPalette, setSelectedPalette] = useState(data.colorPalette || '');
    const [selectedLayout, setSelectedLayout] = useState(data.layout || '');
    const [selectedFont, setSelectedFont] = useState(data.font || '');

    const handlePaletteChange = (palette: string) => {
        setSelectedPalette(palette);
        onChange('colorPalette', palette);
    };

    const handleLayoutChange = (layout: string) => {
        setSelectedLayout(layout);
        onChange('layout', layout);
    };

    const handleFontChange = (font: string) => {
        setSelectedFont(font);
        onChange('font', font);
    };

    return (
        <div className="space-y-6">
            {/* Color Palette Selector */}
            <ColorPaletteSelector
                selected={selectedPalette}
                onSelect={handlePaletteChange}
            />

            {/* Layout Selector */}
            <LayoutSelector
                selected={selectedLayout}
                onSelect={handleLayoutChange}
            />

            {/* Font Selector */}
            <FontSelector
                selected={selectedFont}
                onSelect={handleFontChange}
            />

            {/* Info Box */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg"
            >
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <div className="text-sm text-purple-800 dark:text-purple-200">
                        <p className="font-medium mb-1">Design Preview</p>
                        <p className="text-purple-700 dark:text-purple-300">
                            Basierend auf Ihren Auswahl erstellen wir einen ersten Entwurf. Sie können alle Design-Entscheidungen später im Konfigurator anpassen.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
