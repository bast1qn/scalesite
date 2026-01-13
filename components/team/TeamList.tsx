import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamMember, MemberCard } from './MemberCard';
import { TeamInvite } from './TeamInvite';
import { TeamRole } from './RoleBadge';
import { TeamCardSkeleton } from '../skeleton';
import { useDebounce } from '../../lib/hooks/useDebounce';

/**
 * TeamList Component
 *
 * Main team management component with grid/list view, filtering, and search
 *
 * @param members - List of team members
 * @param currentUserId - Current user ID
 * @param onInvite - Callback for inviting new members
 * @param onRoleChange - Callback for changing member roles
 * @param onRemove - Callback for removing members
 * @param isLoading - Loading state
 * @param className - Additional CSS classes
 */

export interface TeamListProps {
    members: TeamMember[];
    currentUserId: string;
    onInvite: (email: string, role: TeamRole, message?: string) => Promise<void>;
    onRoleChange: (memberId: string, newRole: TeamRole) => Promise<void>;
    onRemove: (memberId: string) => Promise<void>;
    isLoading?: boolean;
    className?: string;
}

type ViewMode = 'grid' | 'list';
type FilterRole = 'all' | TeamRole;
type FilterStatus = 'all' | 'active' | 'pending';

const TeamList: React.FC<TeamListProps> = ({
    members,
    currentUserId,
    onInvite,
    onRoleChange,
    onRemove,
    isLoading = false,
    className = ''
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [filterRole, setFilterRole] = useState<FilterRole>('all');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [isInviting, setIsInviting] = useState(false);

    // Debounce search query to improve performance
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Filter and search members
    const filteredMembers = useMemo(() => {
        return members.filter((member) => {
            // Role filter
            if (filterRole !== 'all' && member.role !== filterRole) {
                return false;
            }

            // Status filter
            if (filterStatus !== 'all' && member.status !== filterStatus) {
                return false;
            }

            // Search query (using debounced value)
            if (debouncedSearchQuery) {
                const query = debouncedSearchQuery.toLowerCase();
                return (
                    member.name.toLowerCase().includes(query) ||
                    member.email.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [members, filterRole, filterStatus, debouncedSearchQuery]);

    // Member statistics
    const stats = useMemo(() => {
        return {
            total: members.length,
            active: members.filter(m => m.status === 'active').length,
            pending: members.filter(m => m.status === 'pending').length,
            byRole: {
                Owner: members.filter(m => m.role === 'Owner').length,
                Admin: members.filter(m => m.role === 'Admin').length,
                Member: members.filter(m => m.role === 'Member').length,
                Viewer: members.filter(m => m.role === 'Viewer').length
            }
        };
    }, [members]);

    const handleInvite = async (email: string, role: TeamRole, message?: string) => {
        setIsInviting(true);
        try {
            await onInvite(email, role, message);
            setShowInviteForm(false);
        } finally {
            setIsInviting(false);
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Team Members
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Manage your team and permissions
                    </p>
                </div>
                <button
                    onClick={() => setShowInviteForm(!showInviteForm)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {showInviteForm ? 'Cancel' : 'Invite Member'}
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                                {stats.total}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                                {stats.active}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                                {stats.pending}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                {stats.byRole.Admin}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invite Form */}
            <AnimatePresence>
                {showInviteForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <TeamInvite
                            onInvite={handleInvite}
                            isLoading={isInviting}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name or email..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Role Filter */}
                    <div>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value as FilterRole)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Roles</option>
                            <option value="Owner">Owners</option>
                            <option value="Admin">Admins</option>
                            <option value="Member">Members</option>
                            <option value="Viewer">Viewers</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-1 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded transition-colors duration-200 ${
                                viewMode === 'grid'
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                            }`}
                            title="Grid view"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded transition-colors duration-200 ${
                                viewMode === 'list'
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                            }`}
                            title="List view"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Members Grid/List */}
            {isLoading ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                    {Array.from({ length: viewMode === 'grid' ? 6 : 5 }).map((_, i) => (
                        <TeamCardSkeleton key={i} />
                    ))}
                </div>
            ) : filteredMembers.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {searchQuery || filterRole !== 'all' || filterStatus !== 'all'
                            ? 'No members found'
                            : 'No team members yet'
                        }
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {searchQuery || filterRole !== 'all' || filterStatus !== 'all'
                            ? 'Try adjusting your filters or search query'
                            : 'Invite team members to get started'
                        }
                    </p>
                    {!showInviteForm && (
                        <button
                            onClick={() => setShowInviteForm(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Invite First Member
                        </button>
                    )}
                </div>
            ) : (
                <motion.div
                    layout
                    className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
                            : 'space-y-4'
                    }
                >
                    <AnimatePresence>
                        {filteredMembers.map((member) => (
                            <MemberCard
                                key={member.id}
                                member={member}
                                currentUserId={currentUserId}
                                onRoleChange={onRoleChange}
                                onRemove={onRemove}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Results Count */}
            {filteredMembers.length > 0 && (
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Showing {filteredMembers.length} of {members.length} members
                </div>
            )}
        </div>
    );
};

export default TeamList;
