import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamRole } from './RoleBadge';

/**
 * PermissionSelector Component
 *
 * Granular permission management for team roles and custom permissions
 *
 * @param currentRole - Current team role
 * @param currentPermissions - Current permission set
 * @param onChange - Callback when permissions change
 * @param readOnly - Whether permissions are read-only
 * @param variant - Display variant (default, compact, detailed)
 * @param className - Additional CSS classes
 */

export type PermissionLevel = 'none' | 'read' | 'write';
export type PermissionCategory = 'projects' | 'billing' | 'team' | 'settings' | 'content' | 'analytics';

export interface PermissionConfig {
    projects: PermissionLevel;
    billing: PermissionLevel;
    team: PermissionLevel;
    settings: PermissionLevel;
    content: PermissionLevel;
    analytics: PermissionLevel;
}

export interface PermissionSelectorProps {
    currentRole?: TeamRole;
    currentPermissions?: PermissionConfig;
    onChange?: (permissions: PermissionConfig) => void;
    readOnly?: boolean;
    variant?: 'default' | 'compact' | 'detailed';
    className?: string;
}

// Default permissions per role
const defaultRolePermissions: Record<TeamRole, PermissionConfig> = {
    Owner: {
        projects: 'write',
        billing: 'write',
        team: 'write',
        settings: 'write',
        content: 'write',
        analytics: 'read'
    },
    Admin: {
        projects: 'write',
        billing: 'write',
        team: 'write',
        settings: 'read',
        content: 'write',
        analytics: 'read'
    },
    Member: {
        projects: 'write',
        billing: 'none',
        team: 'read',
        settings: 'none',
        content: 'write',
        analytics: 'read'
    },
    Viewer: {
        projects: 'read',
        billing: 'none',
        team: 'none',
        settings: 'none',
        content: 'read',
        analytics: 'none'
    }
};

// Permission category details
const permissionCategories: Record<PermissionCategory, {
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}> = {
    projects: {
        label: 'Projects',
        description: 'Create, edit, and manage website projects',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
        ),
        color: 'blue'
    },
    billing: {
        label: 'Billing',
        description: 'Access invoices, payment methods, and billing info',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        ),
        color: 'green'
    },
    team: {
        label: 'Team',
        description: 'Manage team members, invitations, and roles',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        color: 'purple'
    },
    settings: {
        label: 'Settings',
        description: 'Access account and organization settings',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        color: 'gray'
    },
    content: {
        label: 'Content',
        description: 'AI content generation and management',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        color: 'yellow'
    },
    analytics: {
        label: 'Analytics',
        description: 'View reports, metrics, and performance data',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        color: 'indigo'
    }
};

// Permission level configurations
const permissionLevels: Record<PermissionLevel, {
    label: string;
    description: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
}> = {
    none: {
        label: 'No Access',
        description: 'Cannot view or modify',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        textColor: 'text-gray-600 dark:text-gray-400',
        borderColor: 'border-gray-300 dark:border-gray-600'
    },
    read: {
        label: 'Read Only',
        description: 'Can view but not modify',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        textColor: 'text-blue-700 dark:text-blue-300',
        borderColor: 'border-blue-300 dark:border-blue-700'
    },
    write: {
        label: 'Full Access',
        description: 'Can view and modify',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        textColor: 'text-green-700 dark:text-green-300',
        borderColor: 'border-green-300 dark:border-green-700'
    }
};

const PermissionSelector: React.FC<PermissionSelectorProps> = ({
    currentRole,
    currentPermissions,
    onChange,
    readOnly = false,
    variant = 'default',
    className = ''
}) => {
    const [permissions, setPermissions] = useState<PermissionConfig>(
        currentPermissions || (currentRole ? defaultRolePermissions[currentRole] : defaultRolePermissions.Member)
    );

    const [expandedCategory, setExpandedCategory] = useState<PermissionCategory | null>(null);

    // Update permissions when role changes
    React.useEffect(() => {
        if (currentRole && !currentPermissions) {
            setPermissions(defaultRolePermissions[currentRole]);
        }
    }, [currentRole, currentPermissions]);

    const handlePermissionChange = (category: PermissionCategory, level: PermissionLevel) => {
        if (readOnly) return;

        const newPermissions = {
            ...permissions,
            [category]: level
        };

        setPermissions(newPermissions);
        onChange?.(newPermissions);
    };

    const resetToDefaults = () => {
        if (readOnly || !currentRole) return;
        const defaults = defaultRolePermissions[currentRole];
        setPermissions(defaults);
        onChange?.(defaults);
    };

    // Calculate permission summary
    const permissionSummary = useMemo(() => {
        const total = Object.keys(permissions).length;
        const writeCount = Object.values(permissions).filter(p => p === 'write').length;
        const readCount = Object.values(permissions).filter(p => p === 'read').length;

        return { total, writeCount, readCount };
    }, [permissions]);

    // Compact variant
    if (variant === 'compact') {
        return (
            <div className={`space-y-2 ${className}`}>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Permissions
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {permissionSummary.writeCount} Write, {permissionSummary.readCount} Read
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {(Object.keys(permissions) as PermissionCategory[]).map((category) => {
                        const level = permissions[category];
                        const config = permissionLevels[level];
                        const catConfig = permissionCategories[category];

                        return (
                            <button
                                key={category}
                                onClick={() => !readOnly && setExpandedCategory(expandedCategory === category ? null : category)}
                                className={`
                                    inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border
                                    text-xs font-medium transition-colors duration-200
                                    ${config.bgColor} ${config.textColor} ${config.borderColor}
                                    ${readOnly ? 'cursor-default' : 'cursor-pointer hover:opacity-80'}
                                `}
                                title={`${catConfig.label}: ${config.label}`}
                            >
                                {catConfig.icon}
                                <span>{catConfig.label}</span>
                                <span className="opacity-75">•</span>
                                <span>{config.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Expanded detail modal */}
                <AnimatePresence>
                    {expandedCategory && !readOnly && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                            <div className="mb-3">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    {permissionCategories[expandedCategory].icon}
                                    {permissionCategories[expandedCategory].label}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {permissionCategories[expandedCategory].description}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {(Object.keys(permissionLevels) as PermissionLevel[]).map((level) => {
                                    const config = permissionLevels[level];
                                    const isActive = permissions[expandedCategory] === level;

                                    return (
                                        <button
                                            key={level}
                                            onClick={() => {
                                                handlePermissionChange(expandedCategory, level);
                                                setExpandedCategory(null);
                                            }
                                            className={`
                                                flex-1 px-3 py-2 rounded-lg border text-sm font-medium
                                                transition-all duration-200
                                                ${isActive
                                                    ? `${config.bgColor} ${config.textColor} ${config.borderColor} ring-2 ring-offset-2 ring-${permissionCategories[expandedCategory].color}-500`
                                                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                                }
                                            `}
                                        >
                                            <div>{config.label}</div>
                                            <div className="text-xs opacity-75 mt-0.5">{config.description}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // Default and detailed variants
    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Permissions
                    </h3>
                    {currentRole && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Based on role: <span className="font-medium">{currentRole}</span>
                        </p>
                    )}
                </div>
                {!readOnly && currentRole && (
                    <button
                        onClick={resetToDefaults}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                        Reset to Defaults
                    </button>
                )}
            </div>

            {/* Permission Summary */}
            {variant === 'detailed' && (
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-3">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {permissionSummary.writeCount}
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                            Full Access
                        </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-3">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {permissionSummary.readCount}
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            Read Only
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                        <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                            {permissionSummary.total - permissionSummary.writeCount - permissionSummary.readCount}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                            No Access
                        </div>
                    </div>
                </div>
            )}

            {/* Permission Categories */}
            <div className="space-y-3">
                {(Object.keys(permissions) as PermissionCategory[]).map((category) => {
                    const level = permissions[category];
                    const catConfig = permissionCategories[category];

                    return (
                        <div
                            key={category}
                            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                        >
                            <div className="flex items-start gap-3">
                                <div className={`
                                    flex-shrink-0 p-2 rounded-lg
                                    ${level === 'write' ? 'bg-green-100 dark:bg-green-900/30' : ''}
                                    ${level === 'read' ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
                                    ${level === 'none' ? 'bg-gray-100 dark:bg-gray-800' : ''}
                                `}>
                                    <div className={`
                                        ${level === 'write' ? 'text-green-600 dark:text-green-400' : ''}
                                        ${level === 'read' ? 'text-blue-600 dark:text-blue-400' : ''}
                                        ${level === 'none' ? 'text-gray-400' : ''}
                                    `}>
                                        {catConfig.icon}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                {catConfig.label}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                                {catConfig.description}
                                            </p>
                                        </div>
                                        {!readOnly && (
                                            <div className="flex gap-2">
                                                {(Object.keys(permissionLevels) as PermissionLevel[]).map((permLevel) => {
                                                    const config = permissionLevels[permLevel];
                                                    const isActive = level === permLevel;

                                                    return (
                                                        <button
                                                            key={permLevel}
                                                            onClick={() => handlePermissionChange(category, permLevel)}
                                                            className={`
                                                                px-3 py-1.5 rounded-lg border text-xs font-medium
                                                                transition-all duration-200 whitespace-nowrap
                                                                ${isActive
                                                                    ? `${config.bgColor} ${config.textColor} ${config.borderColor} ring-2 ring-offset-2`
                                                                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                                                }
                                                            `}
                                                            style={isActive ? { ringColor: permissionCategories[category].color } : {}}
                                                        >
                                                            {config.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {readOnly && (
                                        <div className="mt-2">
                                            <span className={`
                                                inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-medium
                                                ${permissionLevels[level].bgColor} ${permissionLevels[level].textColor} ${permissionLevels[level].borderColor}
                                            `}>
                                                {permissionLevels[level].label}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
                <div className="flex gap-3">
                    <svg className="flex-shrink-0 w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                            About Permissions
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            Permissions control what team members can access and modify. Custom permissions override default role permissions. Changes take effect immediately.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PermissionSelector;
