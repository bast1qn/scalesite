// ============================================
// CONTENT REQ STEP - Fourth Onboarding Step
// Content requirements: pages, features, timeline, budget
// ============================================

import React, { useState } from 'react';
import { motion } from '@/lib/motion';
import type { OnboardingData } from './types';

// ============================================
// TYPES & INTERFACES
// ============================================

interface ContentReqStepProps {
    data: OnboardingData;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    onChange: (field: string, value: OnboardingData[keyof OnboardingData]) => void;
}

// ============================================
// CONSTANTS
// ============================================

const PAGES = [
    { id: 'home', name: 'Startseite', icon: '🏠', description: 'Hero, USPs, CTA' },
    { id: 'about', name: 'Über uns', icon: '👥', description: 'Team, Geschichte, Werte' },
    { id: 'services', name: 'Leistungen', icon: '⚡', description: 'Produkte/Dienste' },
    { id: 'portfolio', name: 'Portfolio/Referenzen', icon: '💼', description: 'Projekt-Samples' },
    { id: 'blog', name: 'Blog', icon: '📝', description: 'News, Artikel' },
    { id: 'contact', name: 'Kontakt', icon: '📧', description: 'Formular, Standort' },
    { id: 'imprint', name: 'Impressum', icon: '⚖️', description: 'Rechtliches (Pflicht)' },
    { id: 'privacy', name: 'Datenschutz', icon: '🔒', description: 'DSGVO (Pflicht)' }
];

const FEATURES = [
    { id: 'contact-form', name: 'Kontaktformular', icon: '📮', description: 'Anfragen senden' },
    { id: 'newsletter', name: 'Newsletter', icon: '📬', description: 'E-Mail Sammlung' },
    { id: 'seo', name: 'SEO Optimierung', icon: '🔍', description: 'Google Rankings' },
    { id: 'analytics', name: 'Analytics', icon: '📊', description: 'Tracking & Stats' },
    { id: 'cms', name: 'CMS / Admin', icon: '⚙️', description: 'Selbst editieren' },
    { id: 'multilingual', name: 'Mehrsprachigkeit', icon: '🌍', description: 'DE + EN + ...' },
    { id: 'social', name: 'Social Media Integration', icon: '📱', description: 'Facebook, Instagram' },
    { id: 'booking', name: 'Buchungssystem', icon: '📅', description: 'Termine buchen' },
    { id: 'payment', name: 'Payment Integration', icon: '💳', description: 'Stripe, PayPal' },
    { id: 'chat', name: 'Live Chat', icon: '💬', description: 'Kunden-Support' }
];

const TIMELINES = [
    { id: 'asap', name: 'So schnell wie möglich', timeframe: '< 2 Wochen' },
    { id: '2-4-weeks', name: 'Eilig', timeframe: '2-4 Wochen' },
    { id: '1-2-months', name: 'Normal', timeframe: '1-2 Monate' },
    { id: '3-months', name: 'Entspannt', timeframe: '3 Monate' },
    { id: 'flexible', name: 'Flexibel', timeframe: 'Keine deadline' }
];

const BUDGETS = [
    { id: 'starter', name: 'Starter', range: '< €1.000', description: 'Basic Website' },
    { id: 'standard', name: 'Standard', range: '€1.000 - €3.000', description: 'Professionelle Website' },
    { id: 'premium', name: 'Premium', range: '€3.000 - €5.000', description: 'Erweiterte Features' },
    { id: 'enterprise', name: 'Enterprise', range: '€5.000+', description: 'Komplettlösung' },
    { id: 'discuss', name: 'Unsicher', range: 'Zu besprechen', description: 'Lassen Sie uns sprechen' }
];

// ============================================
// PAGE SELECTOR
// ============================================

function PageSelector({
    selected,
    onSelect
}: {
    selected: string[];
    onSelect: (pages: string[]) => void;
}) {
    const togglePage = (pageId: string) => {
        if (selected.includes(pageId)) {
            onSelect(selected.filter(id => id !== pageId));
        } else {
            onSelect([...selected, pageId]);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Gewünschte Seiten
                <span className="text-gray-400 font-normal ml-2">(Mehrfachauswahl)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {PAGES.map((page, index) => {
                    const isSelected = selected.includes(page.id);
                    return (
                        <motion.button
                            key={page.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            type="button"
                            onClick={() => togglePage(page.id)}
                            className={`
                                relative p-4 rounded-lg border-2 text-left transition-all duration-200
                                ${isSelected
                                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600'
                                }
                            `}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">{page.icon}</span>
                                <span className={`font-medium text-sm ${
                                    isSelected
                                        ? 'text-violet-700 dark:text-violet-300'
                                        : 'text-gray-900 dark:text-white'
                                }`}>
                                    {page.name}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {page.description}
                            </p>

                            {/* Selected Indicator */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center"
                                >
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Required Pages Notice */}
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                        <p className="font-medium">Rechtlich erforderlich</p>
                        <p className="text-yellow-700 dark:text-yellow-300 text-xs mt-1">
                            Impressum und Datenschutz sind in Deutschland gesetzlich vorgeschrieben
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ============================================
// FEATURE SELECTOR
// ============================================

function FeatureSelector({
    selected,
    onSelect
}: {
    selected: string[];
    onSelect: (features: string[]) => void;
}) {
    const toggleFeature = (featureId: string) => {
        if (selected.includes(featureId)) {
            onSelect(selected.filter(id => id !== featureId));
        } else {
            onSelect([...selected, featureId]);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
        >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Gewünschte Features
                <span className="text-gray-400 font-normal ml-2">(Mehrfachauswahl)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {FEATURES.map((feature, index) => {
                    const isSelected = selected.includes(feature.id);
                    return (
                        <motion.button
                            key={feature.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            type="button"
                            onClick={() => toggleFeature(feature.id)}
                            className={`
                                relative p-3 rounded-lg border-2 text-left transition-all duration-200
                                ${isSelected
                                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600'
                                }
                            `}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">{feature.icon}</span>
                                <span className={`font-medium text-sm ${
                                    isSelected
                                        ? 'text-violet-700 dark:text-violet-300'
                                        : 'text-gray-900 dark:text-white'
                                }`}>
                                    {feature.name}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {feature.description}
                            </p>

                            {/* Selected Indicator */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center"
                                >
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}

// ============================================
// TIMELINE SELECTOR
// ============================================

function TimelineSelector({
    selected,
    onSelect
}: {
    selected: string;
    onSelect: (timeline: string) => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
        >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Zeitrahmen
                <span className="text-gray-400 font-normal ml-2">(Optional)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TIMELINES.map((timeline, index) => {
                    const isSelected = selected === timeline.id;
                    return (
                        <motion.button
                            key={timeline.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            type="button"
                            onClick={() => onSelect(timeline.id)}
                            className={`
                                relative p-4 rounded-lg border-2 text-left transition-all duration-200
                                ${isSelected
                                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600'
                                }
                            `}
                        >
                            <div>
                                <p className={`font-medium mb-1 ${
                                    isSelected
                                        ? 'text-violet-700 dark:text-violet-300'
                                        : 'text-gray-900 dark:text-white'
                                }`}>
                                    {timeline.name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {timeline.timeframe}
                                </p>
                            </div>

                            {/* Selected Indicator */}
                            {isSelected && (
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
                    );
                })}
            </div>
        </motion.div>
    );
}

// ============================================
// BUDGET SELECTOR
// ============================================

function BudgetSelector({
    selected,
    onSelect
}: {
    selected: string;
    onSelect: (budget: string) => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
        >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Budget
                <span className="text-gray-400 font-normal ml-2">(Optional)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {BUDGETS.map((budget, index) => {
                    const isSelected = selected === budget.id;
                    return (
                        <motion.button
                            key={budget.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            type="button"
                            onClick={() => onSelect(budget.id)}
                            className={`
                                relative p-4 rounded-lg border-2 text-left transition-all duration-200
                                ${isSelected
                                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600'
                                }
                            `}
                        >
                            <div>
                                <p className={`font-medium mb-1 ${
                                    isSelected
                                        ? 'text-violet-700 dark:text-violet-300'
                                        : 'text-gray-900 dark:text-white'
                                }`}>
                                    {budget.name}
                                </p>
                                <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 mb-1">
                                    {budget.range}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {budget.description}
                                </p>
                            </div>

                            {/* Selected Indicator */}
                            {isSelected && (
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
                    );
                })}
            </div>
        </motion.div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ContentReqStep({ data, errors, touched, onChange }: ContentReqStepProps) {
    const [selectedPages, setSelectedPages] = useState<string[]>(data.requiredPages || []);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>(data.features || []);
    const [selectedTimeline, setSelectedTimeline] = useState(data.timeline || '');
    const [selectedBudget, setSelectedBudget] = useState(data.budget || '');

    const handlePagesChange = (pages: string[]) => {
        setSelectedPages(pages);
        onChange('requiredPages', pages);
    };

    const handleFeaturesChange = (features: string[]) => {
        setSelectedFeatures(features);
        onChange('features', features);
    };

    const handleTimelineChange = (timeline: string) => {
        setSelectedTimeline(timeline);
        onChange('timeline', timeline);
    };

    const handleBudgetChange = (budget: string) => {
        setSelectedBudget(budget);
        onChange('budget', budget);
    };

    return (
        <div className="space-y-6">
            {/* Pages Selector */}
            <PageSelector
                selected={selectedPages}
                onSelect={handlePagesChange}
            />

            {/* Features Selector */}
            <FeatureSelector
                selected={selectedFeatures}
                onSelect={handleFeaturesChange}
            />

            {/* Timeline Selector */}
            <TimelineSelector
                selected={selectedTimeline}
                onSelect={handleTimelineChange}
            />

            {/* Budget Selector */}
            <BudgetSelector
                selected={selectedBudget}
                onSelect={handleBudgetChange}
            />

            {/* Summary Box */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 border border-violet-200 dark:border-violet-800 rounded-lg"
            >
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-violet-800 dark:text-violet-200">
                        <p className="font-medium mb-1">Fast fertig!</p>
                        <p className="text-violet-700 dark:text-violet-300">
                            Sie haben {selectedPages.length} Seiten und {selectedFeatures.length} Features ausgewählt.
                            Klicken Sie auf "Konto erstellen" um Ihren Onboarding-Prozess abzuschließen.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
