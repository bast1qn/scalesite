import { type FC } from 'react';

interface BorderSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'blue' | 'slate';
    className?: string;
}

const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4'
};

const colorClasses = {
    primary: 'border-primary',
    blue: 'border-blue-500',
    slate: 'border-slate-200 dark:border-slate-700'
};

/**
 * Reusable border-style loading spinner component
 * Eliminates duplicate spinner code across the codebase
 */
export const BorderSpinner: FC<BorderSpinnerProps> = ({
    size = 'md',
    color = 'primary',
    className = ''
}) => {
    return (
        <div
            className={`${sizeClasses[size]} ${colorClasses[color]} border-t-transparent rounded-full animate-spin ${className}`}
        />
    );
};
