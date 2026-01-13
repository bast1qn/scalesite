import React from 'react';

/**
 * RoleBadge Component
 *
 * Displays team member role with color coding and icons
 *
 * @param role - Team role (Owner, Admin, Member, Viewer)
 * @param size - Badge size variant (sm, md, lg)
 * @param showLabel - Whether to show text label
 * @param className - Additional CSS classes
 */

export type TeamRole = 'Owner' | 'Admin' | 'Member' | 'Viewer';

export interface RoleBadgeProps {
    role: TeamRole;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    className?: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({
    role,
    size = 'md',
    showLabel = true,
    className = ''
}) => {
    // Size configurations
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm'
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-3.5 h-3.5',
        lg: 'w-4 h-4'
    };

    // Role configurations
    const roleConfig = {
        Owner: {
            bgColor: 'bg-amber-500/20 dark:bg-amber-500/30',
            textColor: 'text-amber-700 dark:text-amber-300',
            borderColor: 'border-amber-300 dark:border-amber-700',
            icon: (
                <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            )
        },
        Admin: {
            bgColor: 'bg-blue-500/20 dark:bg-blue-500/30',
            textColor: 'text-blue-700 dark:text-blue-300',
            borderColor: 'border-blue-300 dark:border-blue-700',
            icon: (
                <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
            )
        },
        Member: {
            bgColor: 'bg-green-500/20 dark:bg-green-500/30',
            textColor: 'text-green-700 dark:text-green-300',
            borderColor: 'border-green-300 dark:border-green-700',
            icon: (
                <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
            )
        },
        Viewer: {
            bgColor: 'bg-gray-500/20 dark:bg-gray-500/30',
            textColor: 'text-gray-700 dark:text-gray-300',
            borderColor: 'border-gray-300 dark:border-gray-700',
            icon: (
                <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            )
        }
    };

    const config = roleConfig[role] || roleConfig.Viewer;

    return (
        <span
            className={`
                inline-flex items-center gap-1.5 rounded-full border
                font-semibold
                transition-all duration-200
                ${sizeClasses[size]}
                ${config.bgColor}
                ${config.textColor}
                ${config.borderColor}
                ${className}
            `}
            title={`Role: ${role}`}
        >
            {config.icon}
            {showLabel && <span>{role}</span>}
        </span>
    );
};

export default RoleBadge;
