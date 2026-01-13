// ============================================
// COLOR PALETTE PICKER
// Interactive color scheme selection
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ColorPalette } from './Configurator';

export { type ColorPalette };

interface ColorPalettePickerProps {
    palettes: ColorPalette[];
    selectedPalette: ColorPalette;
    onSelect: (palette: ColorPalette) => void;
    readOnly?: boolean;
}

export const ColorPalettePicker = ({
    palettes,
    selectedPalette,
    onSelect,
    readOnly = false
}: ColorPalettePickerProps) => {
    const [isCustom, setIsCustom] = useState(false);
    const [customColors, setCustomColors] = useState<ColorPalette>(selectedPalette);

    const handlePaletteSelect = (palette: ColorPalette) => {
        if (!readOnly) {
            setIsCustom(false);
            onSelect(palette);
        }
    };

    const handleCustomColorChange = (colorKey: keyof ColorPalette, value: string) => {
        if (readOnly) return;

        const updated = { ...customColors, [colorKey]: value };
        setCustomColors(updated);
        onSelect(updated);
    };

    return (
        <div className="space-y-6">
            {/* Preset Palettes */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-dark-text dark:text-light-text">
                        Farbpaletten
                    </label>
                    {!readOnly && (
                        <button
                            onClick={() => {
                                setIsCustom(!isCustom);
                                if (!isCustom) {
                                    setCustomColors(selectedPalette);
                                }
                            }}
                            className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                            {isCustom ? 'Zurück zu Presets' : 'Eigene Farben'}
                        </button>
                    )}
                </div>

                {!isCustom && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {palettes.map((palette, index) => {
                            const isSelected = !isCustom &&
                                palette.primary === selectedPalette.primary &&
                                palette.secondary === selectedPalette.secondary;

                            return (
                                <motion.button
                                    key={index}
                                    onClick={() => handlePaletteSelect(palette)}
                                    disabled={readOnly}
                                    whileHover={{ scale: readOnly ? 1 : 1.05 }}
                                    whileTap={{ scale: readOnly ? 1 : 0.95 }}
                                    className={`relative p-3 rounded-lg border-2 transition-all ${
                                        isSelected
                                            ? 'border-primary shadow-lg'
                                            : 'border-dark-text/20 dark:border-light-text/20 hover:border-primary/50'
                                    } ${readOnly ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    {/* Color Preview */}
                                    <div className="flex h-16 rounded-md overflow-hidden mb-2">
                                        <div
                                            className="flex-1"
                                            style={{ backgroundColor: palette.primary }}
                                        />
                                        <div
                                            className="flex-1"
                                            style={{ backgroundColor: palette.secondary }}
                                        />
                                        <div
                                            className="flex-1"
                                            style={{ backgroundColor: palette.accent }}
                                        />
                                    </div>

                                    {/* Color Details */}
                                    <div className="flex gap-1">
                                        <div
                                            className="w-4 h-4 rounded-full border border-dark-text/10"
                                            style={{ backgroundColor: palette.background }}
                                            title="Background"
                                        />
                                        <div
                                            className="w-4 h-4 rounded-full border border-dark-text/10"
                                            style={{ backgroundColor: palette.text }}
                                            title="Text"
                                        />
                                    </div>

                                    {/* Selected Indicator */}
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                                        >
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </motion.div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Custom Color Editor */}
            {isCustom && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                >
                    <ColorInput
                        label="Primärfarbe"
                        value={customColors.primary}
                        onChange={(value) => handleCustomColorChange('primary', value)}
                        readOnly={readOnly}
                    />
                    <ColorInput
                        label="Sekundärfarbe"
                        value={customColors.secondary}
                        onChange={(value) => handleCustomColorChange('secondary', value)}
                        readOnly={readOnly}
                    />
                    <ColorInput
                        label="Akzentfarbe"
                        value={customColors.accent}
                        onChange={(value) => handleCustomColorChange('accent', value)}
                        readOnly={readOnly}
                    />
                    <ColorInput
                        label="Hintergrund"
                        value={customColors.background}
                        onChange={(value) => handleCustomColorChange('background', value)}
                        readOnly={readOnly}
                    />
                    <ColorInput
                        label="Textfarbe"
                        value={customColors.text}
                        onChange={(value) => handleCustomColorChange('text', value)}
                        readOnly={readOnly}
                    />

                    {/* Custom Palette Preview */}
                    <div className="mt-4 p-3 bg-light-bg dark:bg-dark-bg rounded-lg">
                        <div className="flex h-20 rounded-md overflow-hidden">
                            <div
                                className="flex-1"
                                style={{ backgroundColor: customColors.primary }}
                            />
                            <div
                                className="flex-1"
                                style={{ backgroundColor: customColors.secondary }}
                            />
                            <div
                                className="flex-1"
                                style={{ backgroundColor: customColors.accent }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Selected Palette Details */}
            {!isCustom && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-4 bg-light-bg dark:bg-dark-bg rounded-lg"
                >
                    <h4 className="text-sm font-medium text-dark-text dark:text-light-text mb-3">
                        Aktuelle Farben
                    </h4>
                    <div className="space-y-2">
                        <ColorDetail label="Primär" color={selectedPalette.primary} />
                        <ColorDetail label="Sekundär" color={selectedPalette.secondary} />
                        <ColorDetail label="Akzent" color={selectedPalette.accent} />
                        <ColorDetail label="Hintergrund" color={selectedPalette.background} />
                        <ColorDetail label="Text" color={selectedPalette.text} />
                    </div>
                </motion.div>
            )}
        </div>
    );
};

// ============================================
// SUB-COMPONENTS
// ============================================

interface ColorInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
}

const ColorInput = ({ label, value, onChange, readOnly }: ColorInputProps) => {
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (newValue: string) => {
        setInputValue(newValue);

        // Validate hex color
        if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
            onChange(newValue);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <div className="flex-1">
                <label className="block text-sm font-medium text-dark-text dark:text-light-text mb-1">
                    {label}
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                        disabled={readOnly}
                        className={`w-12 h-10 rounded cursor-pointer ${readOnly ? 'cursor-not-allowed' : ''}`}
                    />
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => handleChange(e.target.value)}
                        disabled={readOnly}
                        placeholder="#000000"
                        className={`flex-1 px-3 py-2 border border-dark-text/20 dark:border-light-text/20 rounded-md bg-surface dark:bg-dark-surface text-dark-text dark:text-light-text ${
                            readOnly ? 'cursor-not-allowed bg-opacity-50' : ''
                        }`}
                    />
                </div>
            </div>
            <div
                className="w-16 h-10 rounded-md border border-dark-text/10"
                style={{ backgroundColor: value }}
            />
        </div>
    );
};

interface ColorDetailProps {
    label: string;
    color: string;
}

const ColorDetail = ({ label, color }: ColorDetailProps) => {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-dark-text/70 dark:text-light-text/70">
                {label}
            </span>
            <div className="flex items-center gap-2">
                <div
                    className="w-8 h-8 rounded border border-dark-text/10"
                    style={{ backgroundColor: color }}
                />
                <code className="text-xs text-dark-text dark:text-light-text font-mono">
                    {color}
                </code>
            </div>
        </div>
    );
};
