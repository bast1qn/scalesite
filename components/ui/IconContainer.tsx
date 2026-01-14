import { type FC, type ReactNode } from 'react';

interface IconContainerProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'solid' | 'gradient' | 'ghost';
    color?: 'blue' | 'green' | 'red' | 'violet' | 'yellow' | 'slate';
    children: ReactNode;
    className?: string;
}

const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
};

const variantClasses = {
    solid: (color: string) => `bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400 rounded-xl flex items-center justify-center`,
    gradient: 'bg-gradient-to-br from-blue-500 to-violet-600 text-white rounded-full flex items-center justify-center',
    ghost: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl flex items-center justify-center'
};

/**
 * Reusable icon container component
 * Eliminates duplicate icon container code across the codebase
 * @example
 * <IconContainer size="md" variant="solid" color="blue">
 *   <UserIcon />
 * </IconContainer>
 */
export const IconContainer: FC<IconContainerProps> = ({
    size = 'md',
    variant = 'solid',
    color = 'blue',
    children,
    className = ''
}) => {
    const baseClasses = sizeClasses[size];
    const variantClass = variant === 'solid'
        ? variantClasses.solid(color)
        : variantClasses[variant];

    return (
        <div className={`${baseClasses} ${variantClass} ${className}`}>
            {children}
        </div>
    );
};
