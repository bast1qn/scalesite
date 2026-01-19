import { type FC } from 'react';
import { motion } from '@/lib/motion';
import { ClockIcon } from '../Icons';

export interface StatusTimelineProps {
    currentStatus: 'konzeption' | 'design' | 'entwicklung' | 'review' | 'launch' | 'active';
    className?: string;
}

interface TimelineStep {
    id: string;
    status: 'konzeption' | 'design' | 'entwicklung' | 'review' | 'launch' | 'active';
    label: string;
    description: string;
    index: number;
}

const steps: Omit<TimelineStep, 'index'>[] = [
    {
        id: 'konzeption',
        status: 'konzeption',
        label: 'Konzeption',
        description: 'Anforderungsanalyse & Planung'
    },
    {
        id: 'design',
        status: 'design',
        label: 'Design',
        description: 'UI/UX Design & Prototyping'
    },
    {
        id: 'entwicklung',
        status: 'entwicklung',
        label: 'Entwicklung',
        description: 'Frontend & Backend Implementierung'
    },
    {
        id: 'review',
        status: 'review',
        label: 'Review',
        description: 'Testing & Quality Assurance'
    },
    {
        id: 'launch',
        status: 'launch',
        label: 'Launch',
        description: 'Deployment & Go-Live'
    },
    {
        id: 'active',
        status: 'active',
        label: 'Aktiv',
        description: 'Live & Wartung'
    }
];

const getStatusState = (
    stepStatus: string,
    currentStatus: string
): 'completed' | 'current' | 'pending' => {
    const statusOrder = ['konzeption', 'design', 'entwicklung', 'review', 'launch', 'active'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
};

const getStepStyles = (state: 'completed' | 'current' | 'pending') => {
    switch (state) {
        case 'completed':
            return {
                iconBg: 'bg-gradient-to-br from-emerald-400 to-green-500',
                textColor: 'text-gray-900 dark:text-white',
                descriptionColor: 'text-gray-600 dark:text-gray-400',
                lineColor: 'bg-gradient-to-r from-emerald-400 to-green-500',
                showIcon: 'check'
            };
        case 'current':
            return {
                iconBg: 'bg-gradient-to-br from-blue-400 to-violet-500',
                textColor: 'text-gray-900 dark:text-white',
                descriptionColor: 'text-gray-600 dark:text-gray-400',
                lineColor: 'bg-gradient-to-r from-blue-400 to-violet-500',
                showIcon: 'clock'
            };
        case 'pending':
            return {
                iconBg: 'bg-gray-200 dark:bg-gray-700',
                textColor: 'text-gray-500 dark:text-gray-400',
                descriptionColor: 'text-gray-400 dark:text-gray-500',
                lineColor: 'bg-gray-200 dark:bg-gray-700',
                showIcon: 'circle'
            };
    }
};

export const StatusTimeline: FC<StatusTimelineProps> = ({
    currentStatus,
    className = ''
}) => {
    const timelineSteps = steps.map((step, index) => ({
        ...step,
        index
    }));

    return (
        <div className={`w-full ${className}`}>
            {/* Horizontal Timeline (Desktop) */}
            <div className="hidden md:block">
                <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{
                                width: `${(steps.findIndex(s => s.status === currentStatus) / (steps.length - 1)) * 100}%`
                            }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                        />
                    </div>

                    {/* Steps */}
                    <div className="relative flex justify-between">
                        {timelineSteps.map((step) => {
                            const state = getStatusState(step.status, currentStatus);
                            const styles = getStepStyles(state);

                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: step.index * 0.1 }}
                                    className="flex flex-col items-center"
                                >
                                    {/* Icon */}
                                    <div className={`
                                        w-12 h-12 rounded-full ${styles.iconBg}
                                        flex items-center justify-center mb-3 shadow-lg text-white
                                        ${state === 'current' ? 'ring-4 ring-blue-200 dark:ring-blue-900' : ''}
                                        transition-all duration-300
                                    `}>
                                        {styles.showIcon === 'check' ? (
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : styles.showIcon === 'clock' ? (
                                            <ClockIcon className="w-6 h-6" />
                                        ) : (
                                            <div className="w-3 h-3 rounded-full bg-current opacity-40" />
                                        )}
                                    </div>

                                    {/* Label */}
                                    <div className="text-center">
                                        <p className={`text-sm font-bold ${styles.textColor} mb-1`}>
                                            {step.label}
                                        </p>
                                        <p className={`text-xs ${styles.descriptionColor} max-w-[120px]`}>
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Vertical Timeline (Mobile) */}
            <div className="md:hidden">
                <div className="relative pl-8">
                    {/* Vertical Line */}
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700">
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{
                                height: `${((steps.findIndex(s => s.status === currentStatus) + 1) / steps.length) * 100}%`
                            }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="w-full bg-gradient-to-b from-blue-500 to-violet-500"
                        />
                    </div>

                    {/* Steps */}
                    <div className="space-y-6">
                        {timelineSteps.map((step) => {
                            const state = getStatusState(step.status, currentStatus);
                            const styles = getStepStyles(state);

                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: step.index * 0.1 }}
                                    className="relative"
                                >
                                    {/* Icon */}
                                    <div className={`
                                        absolute left-0 top-0 w-6 h-6 rounded-full ${styles.iconBg}
                                        flex items-center justify-center shadow-md text-white
                                        ${state === 'current' ? 'ring-2 ring-blue-200 dark:ring-blue-900' : ''}
                                        transition-all duration-300
                                    `}>
                                        {styles.showIcon === 'check' ? (
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : styles.showIcon === 'clock' ? (
                                            <ClockIcon className="w-3.5 h-3.5" />
                                        ) : (
                                            <div className="w-2 h-2 rounded-full bg-current opacity-40" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="ml-10">
                                        <p className={`text-sm font-bold ${styles.textColor} mb-0.5`}>
                                            {step.label}
                                        </p>
                                        <p className={`text-xs ${styles.descriptionColor}`}>
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
