// ============================================
// STEP INDICATOR - Visual Progress Display
// Shows current step with animated progress indicators
// ============================================

import { motion } from 'framer-motion';
import { OnboardingStep } from './OnboardingWizard';

// ============================================
// TYPES & INTERFACES
// ============================================

interface StepIndicatorProps {
    steps: OnboardingStep[];
    currentStep: OnboardingStep;
    stepInfo: Record<OnboardingStep, { title: string; description: string }>;
    onStepClick?: (step: OnboardingStep) => void;
}

// ============================================
// MAIN COMPONENT
// ============================================

export function StepIndicator({
    steps,
    currentStep,
    stepInfo,
    onStepClick
}: StepIndicatorProps) {
    const currentIndex = steps.indexOf(currentStep);

    return (
        <div className="mb-12">
            {/* Step Indicators */}
            <div className="flex items-center justify-center mb-8">
                {steps.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const isClickable = index <= currentIndex && onStepClick;

                    return (
                        <div key={step} className="flex items-center">
                            {/* Step Circle */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col items-center"
                            >
                                <button
                                    type="button"
                                    onClick={() => isClickable && onStepClick(step)}
                                    disabled={!isClickable}
                                    className={`
                                        relative w-12 h-12 rounded-full flex items-center justify-center
                                        font-semibold text-sm transition-all duration-300
                                        ${isCurrent
                                            ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg scale-110'
                                            : isCompleted
                                                ? 'bg-green-500 text-white shadow-md hover:shadow-lg'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                        }
                                        ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                                    `}
                                >
                                    {isCompleted ? (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <motion.path
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.3 }}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}

                                    {/* Pulse animation for current step */}
                                    {isCurrent && (
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-blue-600"
                                            initial={{ scale: 1, opacity: 0.5 }}
                                            animate={{ scale: 1.3, opacity: 0 }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                ease: "easeOut"
                                            }}
                                        />
                                    )}
                                </button>

                                {/* Step Label */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + 0.2 }}
                                    className="mt-3 text-center"
                                >
                                    <p className={`text-sm font-medium ${
                                        isCurrent
                                            ? 'text-violet-600 dark:text-violet-400'
                                            : isCompleted
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                        {stepInfo[step].title}
                                    </p>
                                </motion.div>
                            </motion.div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="flex items-center px-4 sm:px-8">
                                    <div className="relative w-16 sm:w-24 h-1">
                                        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full" />
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: isCompleted ? '100%' : '0%' }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Current Step Description */}
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
            >
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stepInfo[currentStep].title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {stepInfo[currentStep].description}
                </p>
            </motion.div>
        </div>
    );
}
