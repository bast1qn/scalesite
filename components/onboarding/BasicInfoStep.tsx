// ============================================
// BASIC INFO STEP - First Onboarding Step
// Personal information with validation & password strength
// ============================================

import { motion } from '@/lib/motion';
// ✅ FIXED: Import types from separate file to avoid circular dependency
import type { OnboardingData, StepProps } from './types';

// ============================================
// TYPES & INTERFACES
// ============================================

interface BasicInfoStepProps extends StepProps {}

// ============================================
// PASSWORD STRENGTH CALCULATOR
// ============================================

function calculatePasswordStrength(password: string): {
    score: number;
    label: string;
    color: string;
} {
    if (!password) {
        return { score: 0, label: 'Passwort erforderlich', color: 'bg-gray-200 dark:bg-gray-700' };
    }

    let score = 0;

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Complexity checks
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 1) {
        return { score, label: 'Sehr schwach', color: 'bg-red-500' };
    } else if (score === 2) {
        return { score, label: 'Schwach', color: 'bg-orange-500' };
    } else if (score === 3) {
        return { score, label: 'Mittel', color: 'bg-yellow-500' };
    } else if (score === 4) {
        return { score, label: 'Stark', color: 'bg-green-500' };
    } else {
        return { score, label: 'Sehr stark', color: 'bg-green-600' };
    }
}

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
    autoComplete?: string;
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
    autoComplete,
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
                autoComplete={autoComplete}
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
// MAIN COMPONENT
// ============================================

export function BasicInfoStep({ data, errors, touched, onChange }: BasicInfoStepProps) {
    const passwordStrength = calculatePasswordStrength(data.password || '');

    return (
        <div className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputField
                    label="Vorname"
                    type="text"
                    value={data.firstName || ''}
                    error={errors.firstName}
                    touched={touched.firstName}
                    onChange={(value) => onChange('firstName', value)}
                    placeholder="Max"
                    autoComplete="given-name"
                    required
                />
                <InputField
                    label="Nachname"
                    type="text"
                    value={data.lastName || ''}
                    error={errors.lastName}
                    touched={touched.lastName}
                    onChange={(value) => onChange('lastName', value)}
                    placeholder="Mustermann"
                    autoComplete="family-name"
                    required
                />
            </div>

            {/* Email Field */}
            <InputField
                label="E-Mail-Adresse"
                type="email"
                value={data.email || ''}
                error={errors.email}
                touched={touched.email}
                onChange={(value) => onChange('email', value)}
                placeholder="max@beispiel.de"
                autoComplete="email"
                required
            />

            {/* Password Field */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Passwort
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                    type="password"
                    value={data.password || ''}
                    onChange={(e) => onChange('password', e.target.value)}
                    placeholder="Mindestens 8 Zeichen"
                    autoComplete="new-password"
                    className={`
                        w-full px-4 py-3 rounded-lg border transition-all duration-200
                        focus:ring-2 focus:ring-violet-500 focus:border-transparent
                        ${errors.password && touched.password
                            ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                        }
                        text-gray-900 dark:text-white
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                    `}
                />

                {/* Password Strength Indicator */}
                {data.password && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                    transition={{ duration: 0.3 }}
                                    className={`h-full ${passwordStrength.color} rounded-full`}
                                />
                            </div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {passwordStrength.label}
                            </span>
                        </div>

                        {/* Password Requirements */}
                        <div className="space-y-1 mt-3">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Passwort Anforderungen:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {[
                                    { test: data.password.length >= 8, text: 'Mindestens 8 Zeichen' },
                                    { test: data.password.length >= 12, text: '12+ Zeichen (optional)' },
                                    { test: /[a-z]/.test(data.password) && /[A-Z]/.test(data.password), text: 'Groß- & Kleinbuchstaben' },
                                    { test: /\d/.test(data.password), text: 'Mindestens eine Zahl' },
                                    { test: /[^a-zA-Z0-9]/.test(data.password), text: 'Sonderzeichen (optional)' }
                                ].map((req, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-center gap-2 text-xs"
                                    >
                                        <svg
                                            className={`w-4 h-4 ${req.test ? 'text-green-500' : 'text-gray-400'}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            {req.test ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            ) : (
                                                <circle cx="12" cy="12" r="10" strokeWidth={2} />
                                            )}
                                        </svg>
                                        <span className={req.test ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}>
                                            {req.text}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {errors.password && touched.password && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 text-sm text-red-600 dark:text-red-400"
                    >
                        {errors.password}
                    </motion.p>
                )}
            </div>

            {/* Confirm Password Field */}
            <InputField
                label="Passwort bestätigen"
                type="password"
                value={data.confirmPassword || ''}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
                onChange={(value) => onChange('confirmPassword', value)}
                placeholder="Passwort wiederholen"
                autoComplete="new-password"
                required
            />

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
                        <p className="font-medium mb-1">Sicherheitshinweis</p>
                        <p className="text-blue-700 dark:text-blue-300">
                            Ihr Passwort wird verschlüsselt gespeichert. Wir haben keinen Zugriff auf Ihr Passwort.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
