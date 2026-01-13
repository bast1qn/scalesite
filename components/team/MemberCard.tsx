import React, { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { TeamRole, RoleBadge } from './RoleBadge';

/**
 * MemberCard Component
 *
 * Displays a team member with their role, status, and actions
 *
 * @param member - Member data
 * @param currentUserId - Current user ID for permission checks
 * @param onRoleChange - Callback when role is changed
 * @param onRemove - Callback when member is removed
 * @param className - Additional CSS classes
 */

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
    role: TeamRole;
    status: 'active' | 'pending';
    invited_at?: string;
    joined_at?: string;
    last_active?: string;
}

export interface MemberCardProps {
    member: TeamMember;
    currentUserId: string;
    onRoleChange?: (memberId: string, newRole: TeamRole) => Promise<void>;
    onRemove?: (memberId: string) => Promise<void>;
    className?: string;
}

const MemberCard: React.FC<MemberCardProps> = ({
    member,
    currentUserId,
    onRoleChange,
    onRemove,
    className = ''
}) => {
    const [isChangingRole, setIsChangingRole] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

    const isOwner = member.role === 'Owner';
    const isCurrentUser = member.id === currentUserId;
    const canManage = !isOwner && !isCurrentUser;

    // Get initials from name
    const getInitials = useCallback((name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }, []);

    const formatRelativeTime = useCallback((dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    }, []);

    const handleRoleChange = useCallback(async (newRole: TeamRole) => {
        if (!onRoleChange || isOwner) return;

        setIsChangingRole(true);
        setRoleDropdownOpen(false);
        try {
            await onRoleChange(member.id, newRole);
        } finally {
            setIsChangingRole(false);
        }
    }, [onRoleChange, member.id, isOwner]);

    const handleRemove = useCallback(async () => {
        if (!onRemove || isOwner) return;

        const confirmed = window.confirm(
            `Are you sure you want to remove ${member.name} from the team?`
        );

        if (!confirmed) return;

        setIsRemoving(true);
        try {
            await onRemove(member.id);
        } finally {
            setIsRemoving(false);
        }
    }, [onRemove, member.id, member.name, isOwner]);

    const roles: TeamRole[] = ['Admin', 'Member', 'Viewer'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`
                bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700
                rounded-lg
                p-4
                hover:shadow-lg
                transition-shadow duration-200
                ${className}
            `}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="flex items-start justify-between gap-4">
                {/* Avatar and Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="relative">
                        {member.avatar_url ? (
                            <img
                                src={member.avatar_url}
                                alt={member.name}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                                loading="lazy"
                                decoding="async"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-gray-200 dark:ring-gray-700">
                                {getInitials(member.name)}
                            </div>
                        )}

                        {/* Status Indicator */}
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 ${
                            member.status === 'active'
                                ? 'bg-green-500'
                                : 'bg-yellow-500'
                        }`} title={member.status === 'active' ? 'Active' : 'Pending'} />
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {member.name}
                            </h3>
                            {isCurrentUser && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">(You)</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {member.email}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <RoleBadge role={member.role} size="sm" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {member.status === 'active'
                                    ? `Joined ${formatRelativeTime(member.joined_at)}`
                                    : `Invited ${formatRelativeTime(member.invited_at)}`
                                }
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions Dropdown */}
                {(canManage || onRemove) && showActions && (
                    <div className="relative">
                        <div className="flex items-center gap-2">
                            {/* Role Change */}
                            {canManage && onRoleChange && (
                                <div className="relative">
                                    <button
                                        onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                                        disabled={isChangingRole || isRemoving}
                                        className={`
                                            px-3 py-1.5 text-xs font-medium rounded-md
                                            transition-colors duration-200
                                            ${isChangingRole || isRemoving
                                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }
                                        `}
                                    >
                                        {isChangingRole ? 'Changing...' : 'Change Role'}
                                    </button>

                                    {roleDropdownOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setRoleDropdownOpen(false)}
                                            />
                                            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                                                {roles.map((role) => (
                                                    <button
                                                        key={role}
                                                        onClick={() => handleRoleChange(role)}
                                                        className={`
                                                            w-full px-4 py-2 text-left text-sm
                                                            hover:bg-gray-100 dark:hover:bg-gray-700
                                                            transition-colors duration-150
                                                            ${member.role === role
                                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                                                                : 'text-gray-700 dark:text-gray-300'
                                                            }
                                                        `}
                                                    >
                                                        {role}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Remove Button */}
                            {canManage && onRemove && (
                                <button
                                    onClick={handleRemove}
                                    disabled={isRemoving || isChangingRole}
                                    className={`
                                        px-3 py-1.5 text-xs font-medium rounded-md
                                        transition-colors duration-200
                                        ${isRemoving || isChangingRole
                                            ? 'bg-red-50 dark:bg-red-900/20 text-red-400 cursor-not-allowed'
                                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                                        }
                                    `}
                                >
                                    {isRemoving ? 'Removing...' : 'Remove'}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Owner Badge */}
            {isOwner && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Team Owner - Cannot be removed or role changed
                    </p>
                </div>
            )}

            {/* Current User Badge */}
            {isCurrentUser && !isOwner && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        You can view your own profile but cannot change your role
                    </p>
                </div>
            )}
        </motion.div>
    );
};

const MemoizedMemberCard = memo(MemberCard, (prevProps, nextProps) => {
    return (
        prevProps.member.id === nextProps.member.id &&
        prevProps.member.role === nextProps.member.role &&
        prevProps.member.status === nextProps.member.status &&
        prevProps.currentUserId === nextProps.currentUserId
    );
});

MemoizedMemberCard.displayName = 'MemberCard';

export default MemoizedMemberCard;
