// ============================================
// ONBOARDING WIZARD - Main Container
// Multi-Step Onboarding Flow with Progress & Validation
// ============================================

// React imports
import { useReducer, useEffect, useCallback } from 'react';

// Third-party imports
import { motion, AnimatePresence } from 'framer-motion';

// Internal imports
import { GRADIENTS } from '../../lib/utils';
import { validateEmail, validatePassword, validateName } from '../../lib/validation';

// Component imports
import { StepIndicator } from './StepIndicator';
import { BasicInfoStep } from './BasicInfoStep';
import { BusinessDataStep } from './BusinessDataStep';
import { DesignPrefsStep } from './DesignPrefsStep';
import { ContentReqStep } from './ContentReqStep';

// ============================================
// TYPES & INTERFACES
// ============================================

export type OnboardingStep = 'basic-info' | 'business-data' | 'design-prefs' | 'content-req';

export interface OnboardingData {
    // Step 1: Basic Info
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword?: string;

    // Step 2: Business Data (Woche 6)
    companyName?: string;
    logoUrl?: string;
    industry?: string;
    websiteType?: string;

    // Step 3: Design Preferences (Woche 6)
    colorPalette?: string;
    layout?: string;
    font?: string;

    // Step 4: Content Requirements (Woche 6)
    requiredPages?: string[];
    features?: string[];
    timeline?: string;
    budget?: string;
}

interface OnboardingWizardProps {
    onComplete?: (data: OnboardingData) => Promise<void>;
    onSaveDraft?: (data: OnboardingData) => Promise<void>;
    initialStep?: OnboardingStep;
    initialData?: Partial<OnboardingData>;
}

interface WizardState {
    currentStep: OnboardingStep;
    data: OnboardingData;
    errors: Record<string, string>;
    isSubmitting: boolean;
    isSaved: boolean;
    touched: Record<string, boolean>;
}

type WizardAction =
    | { type: 'NEXT_STEP' }
    | { type: 'PREV_STEP' }
    | { type: 'GO_TO_STEP'; step: OnboardingStep }
    | { type: 'UPDATE_DATA'; field: keyof OnboardingData; value: OnboardingData[keyof OnboardingData] }
    | { type: 'SET_ERRORS'; errors: Record<string, string> }
    | { type: 'CLEAR_ERROR'; field: string }
    | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
    | { type: 'SET_SAVED'; isSaved: boolean }
    | { type: 'TOUCH_FIELD'; field: string }
    | { type: 'LOAD_DATA'; data: Partial<OnboardingData> };

// ============================================
// CONSTANTS
// ============================================

const DRAFT_AUTOSAVE_DELAY_MS = 1000;
const SUCCESS_MESSAGE_TIMEOUT_MS = 3000;

const STEPS: OnboardingStep[] = ['basic-info', 'business-data', 'design-prefs', 'content-req'];

const STEP_INFO: Record<OnboardingStep, { title: string; description: string }> = {
    'basic-info': {
        title: 'Persönliche Informationen',
        description: 'Erstellen Sie Ihr Konto'
    },
    'business-data': {
        title: 'Unternehmensdaten',
        description: 'Erzählen Sie uns von Ihrem Unternehmen'
    },
    'design-prefs': {
        title: 'Designpräferenzen',
        description: 'Gestalten Sie Ihren Webauftritt'
    },
    'content-req': {
        description: 'Definieren Sie Ihre Anforderungen',
        title: 'Inhalte & Funktionen'
    }
};

const STORAGE_KEY = 'scalesite_onboarding_draft';

// ============================================
// INITIAL STATE
// ============================================

const createInitialState = (initialStep?: OnboardingStep, initialData?: Partial<OnboardingData>): WizardState => ({
    currentStep: initialStep || 'basic-info',
    data: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        ...initialData
    },
    errors: {},
    isSubmitting: false,
    isSaved: false,
    touched: {}
});

// ============================================
// REDUCER
// ============================================

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
    switch (action.type) {
        case 'NEXT_STEP': {
            const currentIndex = STEPS.indexOf(state.currentStep);
            const nextStep = STEPS[currentIndex + 1];
            if (!nextStep) return state;
            return {
                ...state,
                currentStep: nextStep,
                errors: {},
                isSaved: false
            };
        }

        case 'PREV_STEP': {
            const currentIndex = STEPS.indexOf(state.currentStep);
            const prevStep = STEPS[currentIndex - 1];
            if (!prevStep) return state;
            return {
                ...state,
                currentStep: prevStep,
                errors: {},
                isSaved: false
            };
        }

        case 'GO_TO_STEP':
            return {
                ...state,
                currentStep: action.step,
                errors: {},
                isSaved: false
            };

        case 'UPDATE_DATA':
            return {
                ...state,
                data: {
                    ...state.data,
                    [action.field]: action.value
                },
                isSaved: false
            };

        case 'SET_ERRORS':
            return {
                ...state,
                errors: action.errors
            };

        case 'CLEAR_ERROR':
            return {
                ...state,
                errors: Object.fromEntries(
                    Object.entries(state.errors).filter(([key]) => key !== action.field)
                )
            };

        case 'SET_SUBMITTING':
            return {
                ...state,
                isSubmitting: action.isSubmitting
            };

        case 'SET_SAVED':
            return {
                ...state,
                isSaved: action.isSaved
            };

        case 'TOUCH_FIELD':
            return {
                ...state,
                touched: {
                    ...state.touched,
                    [action.field]: true
                }
            };

        case 'LOAD_DATA':
            return {
                ...state,
                data: {
                    ...state.data,
                    ...action.data
                }
            };

        default:
            return state;
    }
}

// ============================================
// MAIN COMPONENT
// ============================================

export function OnboardingWizard({
    onComplete,
    onSaveDraft,
    initialStep,
    initialData
}: OnboardingWizardProps) {
    const [state, dispatch] = useReducer(
        wizardReducer,
        createInitialState(initialStep, initialData)
    );

    // Load draft from localStorage on mount
    useEffect(() => {
        // SSR-Safety: Check if window is defined (not server-side)
        if (typeof window === 'undefined') return;

        try {
            const savedDraft = localStorage.getItem(STORAGE_KEY);
            if (savedDraft && !initialData) {
                const parsed = JSON.parse(savedDraft) as Partial<OnboardingData>;
                dispatch({ type: 'LOAD_DATA', data: parsed });
            }
        } catch (error) {
            console.warn('Failed to load onboarding draft:', error);
        }
    }, [initialData]);

    // Auto-save draft to localStorage
    useEffect(() => {
        const timer = setTimeout(() => {
            // SSR-Safety: Check if window is defined (not server-side)
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
                } catch (error) {
                    console.warn('Failed to save onboarding draft:', error);
                }
            }
        }, DRAFT_AUTOSAVE_DELAY_MS);

        return () => clearTimeout(timer);
    }, [state.data]);

    // Calculate current step index
    const currentStepIndex = STEPS.indexOf(state.currentStep);
    const isLastStep = currentStepIndex === STEPS.length - 1;
    const isFirstStep = currentStepIndex === 0;

    // Validation for current step
    const validateStep = useCallback((): boolean => {
        const errors: Record<string, string> = {};

        switch (state.currentStep) {
            case 'basic-info':
                // First name validation
                const firstNameValidation = validateName(state.data.firstName || '');
                if (!firstNameValidation.isValid) {
                    errors.firstName = 'Vorname ist erforderlich';
                }

                // Last name validation
                const lastNameValidation = validateName(state.data.lastName || '');
                if (!lastNameValidation.isValid) {
                    errors.lastName = 'Nachname ist erforderlich';
                }

                // Email validation - using centralized validation for security
                if (!state.data.email?.trim()) {
                    errors.email = 'E-Mail ist erforderlich';
                } else {
                    const emailValidation = validateEmail(state.data.email);
                    if (!emailValidation.isValid) {
                        errors.email = 'Ungültige E-Mail-Adresse';
                    }
                }

                // Password validation - using centralized validation for security
                if (!state.data.password) {
                    errors.password = 'Passwort ist erforderlich';
                } else {
                    const passwordValidation = validatePassword(state.data.password);
                    if (!passwordValidation.isValid) {
                        if (passwordValidation.errors.includes('min_length')) {
                            errors.password = 'Passwort muss mindestens 8 Zeichen lang sein';
                        } else if (passwordValidation.errors.includes('lowercase')) {
                            errors.password = 'Passwort muss Kleinbuchstaben enthalten';
                        } else if (passwordValidation.errors.includes('uppercase')) {
                            errors.password = 'Passwort muss Großbuchstaben enthalten';
                        } else if (passwordValidation.errors.includes('number')) {
                            errors.password = 'Passwort muss Zahlen enthalten';
                        } else {
                            errors.password = 'Passwort ist nicht sicher genug';
                        }
                    }
                }

                // Password confirmation
                if (state.data.password !== state.data.confirmPassword) {
                    errors.confirmPassword = 'Passwörter stimmen nicht überein';
                }
                break;

            // Additional steps will be validated in Woche 6
            case 'business-data':
                // Optional validation for business data
                // Currently all fields are optional
                break;

            case 'design-prefs':
                // Optional validation for design preferences
                // Currently all fields are optional
                break;

            case 'content-req':
                // Optional validation for content requirements
                // Currently all fields are optional
                break;
        }

        if (Object.keys(errors).length > 0) {
            dispatch({ type: 'SET_ERRORS', errors });
            return false;
        }

        return true;
    }, [state.currentStep, state.data]);

    // Handle next step
    const handleNext = useCallback(async () => {
        if (!validateStep()) {
            return;
        }

        if (isLastStep) {
            // Complete onboarding
            await handleSubmit();
        } else {
            dispatch({ type: 'NEXT_STEP' });
        }
    }, [validateStep, isLastStep]);

    // Handle previous step
    const handlePrevious = useCallback(() => {
        if (!isFirstStep) {
            dispatch({ type: 'PREV_STEP' });
        }
    }, [isFirstStep]);

    // Handle step click
    const handleStepClick = useCallback((step: OnboardingStep) => {
        const stepIndex = STEPS.indexOf(step);
        // Only allow going back to already completed steps
        if (stepIndex <= currentStepIndex) {
            dispatch({ type: 'GO_TO_STEP', step });
        }
    }, [currentStepIndex]);

    // Handle form submission
    const handleSubmit = useCallback(async () => {
        if (!validateStep()) {
            return;
        }

        dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });

        try {
            await onComplete?.(state.data);

            // Clear draft on successful completion (SSR-safe)
            if (typeof window !== 'undefined') {
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch (error) {
            console.error('Onboarding completion failed:', error);
            dispatch({
                type: 'SET_ERRORS',
                errors: {
                    submit: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
                }
            });
        } finally {
            dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
        }
    }, [state.data, validateStep, onComplete]);

    // Handle save draft
    const handleSaveDraft = useCallback(async () => {
        dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });

        try {
            await onSaveDraft?.(state.data);
            dispatch({ type: 'SET_SAVED', isSaved: true });

            // Clear saved flag after delay
            setTimeout(() => {
                dispatch({ type: 'SET_SAVED', isSaved: false });
            }, SUCCESS_MESSAGE_TIMEOUT_MS);
        } catch (error) {
            console.error('Failed to save draft:', error);
        } finally {
            dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
        }
    }, [state.data, onSaveDraft]);

    // Handle field change
    const handleFieldChange = useCallback((field: keyof OnboardingData, value: OnboardingData[keyof OnboardingData]) => {
        dispatch({ type: 'UPDATE_DATA', field, value });
        dispatch({ type: 'TOUCH_FIELD', field });

        // Clear error for this field
        if (state.errors[field]) {
            dispatch({ type: 'CLEAR_ERROR', field });
        }
    }, [state.errors]);

    return (
        <div className={`min-h-screen ${GRADIENTS.subtle} py-12 px-4`}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Willkommen bei ScaleSite
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Erstellen Sie Ihr Konto in wenigen Schritten
                    </p>
                </motion.div>

                {/* Step Indicator */}
                <StepIndicator
                    steps={STEPS}
                    currentStep={state.currentStep}
                    stepInfo={STEP_INFO}
                    onStepClick={handleStepClick}
                />

                {/* Form Error */}
                {state.errors.submit && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                    >
                        <p className="text-red-600 dark:text-red-400 text-center">
                            {state.errors.submit}
                        </p>
                    </motion.div>
                )}

                {/* Step Content */}
                <motion.div
                    key={state.currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
                >
                    <AnimatePresence mode="wait">
                        {state.currentStep === 'basic-info' && (
                            <BasicInfoStep
                                data={state.data}
                                errors={state.errors}
                                touched={state.touched}
                                onChange={handleFieldChange}
                            />
                        )}

                        {state.currentStep === 'business-data' && (
                            <BusinessDataStep
                                data={state.data}
                                errors={state.errors}
                                touched={state.touched}
                                onChange={handleFieldChange}
                            />
                        )}

                        {state.currentStep === 'design-prefs' && (
                            <DesignPrefsStep
                                data={state.data}
                                errors={state.errors}
                                touched={state.touched}
                                onChange={handleFieldChange}
                            />
                        )}

                        {state.currentStep === 'content-req' && (
                            <ContentReqStep
                                data={state.data}
                                errors={state.errors}
                                touched={state.touched}
                                onChange={handleFieldChange}
                            />
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Navigation Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 flex items-center justify-between gap-4"
                >
                    {/* Back Button */}
                    {!isFirstStep && (
                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={state.isSubmitting}
                            className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            ← Zurück
                        </button>
                    )}

                    {/* Spacer for centering */}
                    <div className="flex-1" />

                    {/* Save Draft Button */}
                    {onSaveDraft && (
                        <button
                            type="button"
                            onClick={handleSaveDraft}
                            disabled={state.isSubmitting}
                            className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {state.isSaved ? (
                                <>
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Gespeichert
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    Entwurf speichern
                                </>
                            )}
                        </button>
                    )}

                    {/* Next/Submit Button */}
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={state.isSubmitting}
                        className={`px-8 py-3 ${GRADIENTS.primary} ${GRADIENTS.primaryHover} text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl`}
                    >
                        {state.isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 inline" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                {isLastStep ? 'Wird erstellt...' : 'Lädt...'}
                            </>
                        ) : (
                            <>
                                {isLastStep ? 'Konto erstellen →' : 'Weiter →'}
                            </>
                        )}
                    </button>
                </motion.div>

                {/* Progress Bar */}
                <div className="mt-8">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${GRADIENTS.primary}`}
                        />
                    </div>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Schritt {currentStepIndex + 1} von {STEPS.length}
                    </p>
                </div>
            </div>
        </div>
    );
}
