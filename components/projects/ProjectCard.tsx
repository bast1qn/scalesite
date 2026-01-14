import { type FC, React } from 'react';
import { motion } from 'framer-motion';
import {
    CalendarDaysIcon,
    ClockIcon,
    ArrowRightIcon
} from '../Icons';

export interface ProjectCardProps {
    id: string;
    name: string;
    description?: string;
    status: 'konzeption' | 'design' | 'entwicklung' | 'review' | 'launch' | 'active';
    progress: number;
    estimated_launch_date?: string;
    updated_at?: string;
    onClick?: () => void;
    variant?: 'default' | 'compact';
}

const statusConfig = {
    konzeption: {
        label: 'Konzeption',
        bgColor: 'from-amber-50 to-yellow-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200/60',
        dotColor: 'bg-amber-500'
    },
    design: {
        label: 'Design',
        bgColor: 'from-purple-50 to-violet-50',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200/60',
        dotColor: 'bg-purple-500'
    },
    entwicklung: {
        label: 'Entwicklung',
        bgColor: 'from-blue-50 to-indigo-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200/60',
        dotColor: 'bg-blue-500'
    },
    review: {
        label: 'Review',
        bgColor: 'from-cyan-50 to-teal-50',
        textColor: 'text-cyan-700',
        borderColor: 'border-cyan-200/60',
        dotColor: 'bg-cyan-500'
    },
    launch: {
        label: 'Launch',
        bgColor: 'from-orange-50 to-amber-50',
        textColor: 'text-orange-700',
        borderColor: 'border-orange-200/60',
        dotColor: 'bg-orange-500',
        icon: ClockIcon
    },
    active: {
        label: 'Aktiv',
        bgColor: 'from-emerald-50 to-green-50',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200/60',
        dotColor: 'bg-emerald-500',
        icon: 'check'
    }
};

const formatDate = (dateString?: string): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays < 1) return 'Heute';
    if (diffDays < 7) return `vor ${diffDays} Tagen`;
    if (diffDays < 30) return `vor ${Math.floor(diffDays / 7)} Wochen`;

    return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    });
};

const formatLaunchDate = (dateString?: string): string => {
    if (!dateString) return '-';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export const ProjectCard: FC<ProjectCardProps> = ({
    id,
    name,
    description,
    status,
    progress,
    estimated_launch_date,
    updated_at,
    onClick,
    variant = 'default'
}) => {
    const config = statusConfig[status];

    const cardVariants = {
        default: 'p-6',
        compact: 'p-4'
  };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className={`
                bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl
                border border-gray-200 dark:border-gray-700 transition-all duration-300
                cursor-pointer relative overflow-hidden group
                ${cardVariants[variant]}
            `}
            onClick={onClick}
        >
            {/* Shimmer Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />

            {/* Header */}
            <div className="flex items-start justify-between mb-4 relative">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {name}
                    </h3>
                    {description && variant === 'default' && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {description}
                        </p>
                    )}
                </div>

                {/* Status Badge */}
                <span className={`
                    inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                    bg-gradient-to-r ${config.bgColor} ${config.textColor}
                    border ${config.borderColor} flex-shrink-0 ml-2
                `}>
                    {config.icon === 'check' ? (
                        <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    ) : typeof config.icon === 'function' ? (
                        <config.icon className={`w-3 h-3 ${config.dotColor}`} />
                    ) : (
                        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`} />
                    )}
                    {config.label}
                </span>
            </div>

            {/* Progress Section */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Fortschritt
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {progress}%
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            {variant === 'default' && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                        {updated_at && (
                            <div className="flex items-center gap-1">
                                <ClockIcon className="w-3.5 h-3.5" />
                                <span>{formatDate(updated_at)}</span>
                            </div>
                        )}
                        {estimated_launch_date && (
                            <div className="flex items-center gap-1">
                                <CalendarDaysIcon className="w-3.5 h-3.5" />
                                <span>{formatLaunchDate(estimated_launch_date)}</span>
                            </div>
                        )}
                    </div>

                    <motion.div
                        className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400"
                        whileHover={{ x: 4 }}
                    >
                        <span>Details</span>
                        <ArrowRightIcon className="w-4 h-4" />
                    </motion.div>
                </div>
            )}

            {/* Compact Variant Footer */}
            {variant === 'compact' && (
                <div className="flex items-center justify-between pt-3">
                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                        {estimated_launch_date && (
                            <div className="flex items-center gap-1">
                                <CalendarDaysIcon className="w-3.5 h-3.5" />
                                <span>{formatLaunchDate(estimated_launch_date)}</span>
                            </div>
                        )}
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                </div>
            )}
        </motion.div>
    );
};

// PERFORMANCE: Properly memoize ProjectCard to prevent unnecessary re-renders
// Without React.memo, all cards re-render when any single card changes
export const ProjectCardMemo = React.memo(ProjectCard);
