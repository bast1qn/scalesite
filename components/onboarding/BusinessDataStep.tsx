// ============================================
// BUSINESS DATA STEP - Second Onboarding Step
// Company information with logo upload
// ============================================

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { OnboardingData } from './OnboardingWizard';

// ============================================
// TYPES & INTERFACES
// ============================================

interface BusinessDataStepProps {
    data: OnboardingData;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    onChange: (field: string, value: OnboardingData[keyof OnboardingData]) => void;
}

// ============================================
// CONSTANTS
// ============================================

const INDUSTRIES = [
    'E-Commerce & Online-Handel',
    'Software & SaaS',
    'Agentur & Dienstleistung',
    'Gesundheitswesen',
    'Bildung & Training',
    'Finanzdienstleistungen',
    'Immobilien',
    'Restaurant & Gastgewerbe',
    'Tourismus & Reisen',
    'Medien & Entertainment',
    'Technologie & IT',
    'Consulting & Beratung',
    'Produktion & Industrie',
    'Logistik & Transport',
    'Non-Profit & Organisation',
    'Sonstiges'
];

const WEBSITE_TYPES = [
    { value: 'corporate', label: 'Unternehmenswebsite', description: 'Präsentieren Sie Ihr Unternehmen' },
    { value: 'ecommerce', label: 'Online-Shop', description: 'Verkaufen Sie Produkte online' },
    { value: 'portfolio', label: 'Portfolio', description: 'Zeigen Sie Ihre Arbeiten' },
    { value: 'blog', label: 'Blog / Magazin', description: 'Publizieren Sie Inhalte' },
    { value: 'landingpage', label: 'Landing Page', description: 'Konvertieren Sie Besucher' },
    { value: 'saas', label: 'SaaS Produkt', description: 'Software-Präsenz' },
    { value: 'other', label: 'Sonstiges', description: 'Anderer Typ' }
];

// ============================================
// INPUT FIELD COMPONENT
// ============================================

interface InputFieldProps {
    label: string;
    type: string;
    value: string;
    error?: string;
    touched?: boolean;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
}

function InputField({
    label,
    type,
    value,
    error,
    touched,
    onChange,
    placeholder,
    required = false
}: InputFieldProps) {
    const hasError = error && touched;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
        >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`
                    w-full px-4 py-3 rounded-lg border transition-all duration-200
                    focus:ring-2 focus:ring-violet-500 focus:border-transparent
                    ${hasError
                        ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    }
                    text-gray-900 dark:text-white
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                `}
            />
            {hasError && (
                <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                    {error}
                </motion.p>
            )}
        </motion.div>
    );
}

// ============================================
// LOGO UPLOAD COMPONENT
// ============================================

interface LogoUploadProps {
    logoUrl?: string;
    onChange: (url: string) => void;
}

function LogoUpload({ logoUrl, onChange }: LogoUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileSelect = useCallback(async (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Bitte wählen Sie eine Bilddatei aus (PNG, JPG, SVG)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Das Bild darf maximal 5MB groß sein');
            return;
        }

        setIsUploading(true);

        try {
            // For now, create a local preview URL
            // In production, this would upload to Supabase Storage
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result as string);
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Logo upload failed:', error);
            setIsUploading(false);
            alert('Fehler beim Hochladen des Logos');
        }
    }, [onChange]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    }, [handleFileSelect]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    }, [handleFileSelect]);

    const handleRemove = useCallback(() => {
        onChange('');
    }, [onChange]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
        >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unternehmenslogo
                <span className="text-gray-400 font-normal ml-2">(Optional)</span>
            </label>

            {logoUrl ? (
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <img
                        src={logoUrl}
                        alt="Logo Preview"
                        className="w-20 h-20 object-contain rounded-lg bg-white dark:bg-gray-800 p-2"
                    />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            Logo hochgeladen
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG oder SVG bis 5MB
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                    >
                        Entfernen
                    </button>
                </div>
            ) : (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
                        relative p-8 rounded-lg border-2 border-dashed transition-all duration-200
                        ${isDragging
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-violet-400 dark:hover:border-violet-500'
                        }
                        ${isUploading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                    `}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                    />
                    <div className="text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {isDragging ? 'Datei loslassen' : 'Logo hochladen'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            Drag & Drop oder klicken zum Auswählen
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
                            PNG, JPG oder SVG bis 5MB
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function BusinessDataStep({ data, errors, touched, onChange }: BusinessDataStepProps) {
    const [selectedIndustry, setSelectedIndustry] = useState(data.industry || '');
    const [selectedWebsiteType, setSelectedWebsiteType] = useState(data.websiteType || '');

    const handleIndustryChange = (industry: string) => {
        setSelectedIndustry(industry);
        onChange('industry', industry);
    };

    const handleWebsiteTypeChange = (type: string) => {
        setSelectedWebsiteType(type);
        onChange('websiteType', type);
    };

    return (
        <div className="space-y-6">
            {/* Company Name */}
            <InputField
                label="Unternehmensname"
                type="text"
                value={data.companyName || ''}
                error={errors.companyName}
                touched={touched.companyName}
                onChange={(value) => onChange('companyName', value)}
                placeholder="Muster GmbH"
            />

            {/* Logo Upload */}
            <LogoUpload
                logoUrl={data.logoUrl}
                onChange={(value) => onChange('logoUrl', value)}
            />

            {/* Industry Selector */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
            >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Branche
                    <span className="text-gray-400 font-normal ml-2">(Optional)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
                    {INDUSTRIES.map((industry, index) => (
                        <motion.button
                            key={industry}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.02 }}
                            type="button"
                            onClick={() => handleIndustryChange(industry)}
                            className={`
                                px-4 py-3 rounded-lg text-left text-sm transition-all duration-200
                                ${selectedIndustry === industry
                                    ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }
                            `}
                        >
                            <span className="flex items-center gap-2">
                                {selectedIndustry === industry && (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                {industry}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Website Type Selector */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
            >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Art der Website
                    <span className="text-gray-400 font-normal ml-2">(Optional)</span>
                </label>
                <div className="grid grid-cols-1 gap-3">
                    {WEBSITE_TYPES.map((type, index) => (
                        <motion.button
                            key={type.value}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            type="button"
                            onClick={() => handleWebsiteTypeChange(type.value)}
                            className={`
                                relative p-4 rounded-lg text-left transition-all duration-200 border-2
                                ${selectedWebsiteType === type.value
                                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600'
                                }
                            `}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`flex-1`}>
                                    <p className={`font-medium mb-1 ${
                                        selectedWebsiteType === type.value
                                            ? 'text-violet-700 dark:text-violet-300'
                                            : 'text-gray-900 dark:text-white'
                                    }`}>
                                        {type.label}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {type.description}
                                    </p>
                                </div>
                                {selectedWebsiteType === type.value && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center"
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

            {/* Info Box */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
            >
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-medium mb-1">Tipp</p>
                        <p className="text-blue-700 dark:text-blue-300">
                            Diese Informationen helfen uns, Ihre Website besser auf Ihre Bedürfnisse abzustimmen. Sie können alle Angaben später noch anpassen.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
