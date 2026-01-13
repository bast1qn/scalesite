// ============================================
// FEATURE TOGGLE COMPONENT
// Week 7: Interactive Feature Selection
// ============================================

import { useState, useCallback, useMemo } from 'react';
import { useCurrency, useLanguage } from '../../contexts';

export interface Feature {
    key: string;
    label: string;
    labelEn?: string;
    price: number;
    description?: string;
    descriptionEn?: string;
    icon?: string;
    category?: string;
}

interface FeatureToggleProps {
    features: Feature[];
    selectedFeatures: string[];
    onToggle: (featureKey: string) => void;
    maxSelections?: number;
    showPrices?: boolean;
    layout?: 'grid' | 'list';
    size?: 'sm' | 'md' | 'lg';
}

export const FeatureToggle = ({
    features,
    selectedFeatures,
    onToggle,
    maxSelections,
    showPrices = true,
    layout = 'grid',
    size = 'md'
}: FeatureToggleProps) => {
    const { language } = useLanguage();
    const { formatPrice } = useCurrency();

    const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

    // Group features by category if provided
    const groupedFeatures = useMemo(() => {
        const groups: Record<string, Feature[]> = {};

        features.forEach(feature => {
            const category = feature.category || (language === 'de' ? 'Allgemein' : 'General');
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(feature);
        });

        return groups;
    }, [features, language]);

    // Check if max selections reached
    const isMaxReached = maxSelections !== undefined && selectedFeatures.length >= maxSelections;
    const isDisabled = useCallback((featureKey: string) => {
        return isMaxReached && !selectedFeatures.includes(featureKey);
    }, [isMaxReached, selectedFeatures]);

    // Size classes
    const sizeClasses = useMemo(() => {
        switch (size) {
            case 'sm':
                return {
                    button: 'p-2 text-xs',
                    grid: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
                    icon: 'w-4 h-4'
                };
            case 'lg':
                return {
                    button: 'p-5 text-base',
                    grid: 'grid-cols-1 sm:grid-cols-2',
                    icon: 'w-6 h-6'
                };
            default: // 'md'
                return {
                    button: 'p-3 text-sm',
                    grid: 'grid-cols-2 sm:grid-cols-3',
                    icon: 'w-5 h-5'
                };
        }
    }, [size]);

    const getFeatureLabel = (feature: Feature) => {
        if (language === 'en' && feature.labelEn) {
            return feature.labelEn;
        }
        return feature.label;
    };

    const getFeatureDescription = (feature: Feature) => {
        if (language === 'en' && feature.descriptionEn) {
            return feature.descriptionEn;
        }
        return feature.description;
    };

    const renderFeatureButton = (feature: Feature) => {
        const isSelected = selectedFeatures.includes(feature.key);
        const disabled = isDisabled(feature.key);
        const isHovered = hoveredFeature === feature.key;

        return (
            <button
                key={feature.key}
                onClick={() => onToggle(feature.key)}
                disabled={disabled}
                onMouseEnter={() => setHoveredFeature(feature.key)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`
                    relative rounded-lg text-left transition-all duration-200
                    ${sizeClasses.button}
                    ${isSelected
                        ? 'bg-gradient-to-br from-primary-500 to-violet-600 text-white shadow-lg shadow-primary-500/30 scale-105'
                        : disabled
                            ? 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-md'
                    }
                `}
            >
                {/* Selection indicator */}
                {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}

                {/* Icon (if provided) */}
                {feature.icon && (
                    <div className={`${sizeClasses.icon} mb-2 ${isSelected ? 'text-white' : 'text-primary-500'}`}>
                        {feature.icon}
                    </div>
                )}

                {/* Label */}
                <div className={`font-semibold mb-1 ${isSelected ? 'text-white' : ''}`}>
                    {getFeatureLabel(feature)}
                </div>

                {/* Description (if provided) */}
                {feature.description && size !== 'sm' && (
                    <div className={`text-xs leading-relaxed ${isSelected ? 'text-primary-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {getFeatureDescription(feature)}
                    </div>
                )}

                {/* Price */}
                {showPrices && (
                    <div className={`mt-2 font-bold ${isSelected ? 'text-white' : 'text-primary-600 dark:text-primary-400'}`}>
                        +{formatPrice(feature.price)}
                    </div>
                )}

                {/* Hover effect for unselected items */}
                {!isSelected && !disabled && isHovered && (
                    <div className="absolute inset-0 bg-primary-50 dark:bg-primary-900/10 rounded-lg pointer-events-none" />
                )}

                {/* Disabled tooltip */}
                {disabled && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap">
                        {language === 'de' ? 'Max. erreicht' : 'Max reached'}
                    </div>
                )}
            </button>
        );
    };

    const renderGridView = () => {
        // If features are grouped, render by category
        if (Object.keys(groupedFeatures).length > 1) {
            return (
                <div className="space-y-6">
                    {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
                        <div key={category}>
                            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                {category}
                            </h4>
                            <div className={`grid gap-3 ${sizeClasses.grid}`}>
                                {categoryFeatures.map(renderFeatureButton)}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // Simple grid without categories
        return (
            <div className={`grid gap-3 ${sizeClasses.grid}`}>
                {features.map(renderFeatureButton)}
            </div>
        );
    };

    const renderListView = () => {
        return (
            <div className="space-y-2">
                {features.map(feature => {
                    const isSelected = selectedFeatures.includes(feature.key);
                    const disabled = isDisabled(feature.key);

                    return (
                        <button
                            key={feature.key}
                            onClick={() => onToggle(feature.key)}
                            disabled={disabled}
                            className={`
                                w-full flex items-center justify-between p-4 rounded-lg transition-all duration-200
                                ${isSelected
                                    ? 'bg-gradient-to-r from-primary-500 to-violet-600 text-white shadow-md'
                                    : disabled
                                        ? 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500'
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                {/* Checkbox */}
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                    isSelected
                                        ? 'bg-white border-white'
                                        : 'border-slate-300 dark:border-slate-600'
                                }`}>
                                    {isSelected && (
                                        <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>

                                {/* Label and description */}
                                <div className="text-left">
                                    <div className={`font-medium ${isSelected ? 'text-white' : ''}`}>
                                        {getFeatureLabel(feature)}
                                    </div>
                                    {feature.description && (
                                        <div className={`text-xs ${isSelected ? 'text-primary-100' : 'text-slate-500 dark:text-slate-400'}`}>
                                            {getFeatureDescription(feature)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Price */}
                            {showPrices && (
                                <div className={`font-bold ${isSelected ? 'text-white' : 'text-primary-600 dark:text-primary-400'}`}>
                                    +{formatPrice(feature.price)}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div>
            {/* Selection counter */}
            {maxSelections && (
                <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                        {language === 'de' ? 'Ausgewählt' : 'Selected'}: {selectedFeatures.length}
                        {maxSelections && ` / ${maxSelections}`}
                    </span>
                    {isMaxReached && (
                        <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                            {language === 'de' ? 'Maximum erreicht' : 'Maximum reached'}
                        </span>
                    )}
                </div>
            )}

            {/* Features */}
            {layout === 'grid' ? renderGridView() : renderListView()}
        </div>
    );
};

export default FeatureToggle;
