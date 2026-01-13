/**
 * RBAC (Role-Based Access Control) System
 *
 * Provides permission checking and role management for team collaboration
 */

import { TeamRole } from '../components/team/RoleBadge';
import type { PermissionConfig, PermissionLevel, PermissionCategory } from '../components/team/PermissionSelector';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface RBACUser {
    id: string;
    name: string;
    email: string;
    role: TeamRole;
    permissions?: PermissionConfig;
    isOwner?: boolean;
}

export interface PermissionCheck {
    allowed: boolean;
    reason?: string;
    requiredRole?: TeamRole;
    requiredPermission?: PermissionLevel;
}

export interface ResourceAccess {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canCreate: boolean;
}

// ============================================
// DEFAULT PERMISSIONS PER ROLE
// ============================================

export const defaultRolePermissions: Record<TeamRole, PermissionConfig> = {
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

// ============================================
// ROLE HIERARCHY (for role comparisons)
// ============================================

const roleHierarchy: Record<TeamRole, number> = {
    Owner: 4,
    Admin: 3,
    Member: 2,
    Viewer: 1
};

// ============================================
// PERMISSION CHECKING
// ============================================

/**
 * Check if a user has a specific role level or higher
 */
export const hasRoleLevel = (user: RBACUser, requiredRole: TeamRole): boolean => {
    if (user.isOwner) return true;
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};

/**
 * Check if a user has permission for a specific category
 */
export const hasPermission = (
    user: RBACUser,
    category: PermissionCategory,
    requiredLevel: PermissionLevel = 'read'
): boolean => {
    const userPermissions = user.permissions || defaultRolePermissions[user.role];
    const userLevel = userPermissions[category];

    // Permission hierarchy: write > read > none
    const levelHierarchy: Record<PermissionLevel, number> = {
        write: 2,
        read: 1,
        none: 0
    };

    return levelHierarchy[userLevel] >= levelHierarchy[requiredLevel];
};

/**
 * Check multiple permissions at once
 */
export const hasPermissions = (
    user: RBACUser,
    permissions: Partial<Record<PermissionCategory, PermissionLevel>>
): boolean => {
    return Object.entries(permissions).every(([category, level]) =>
        hasPermission(user, category as PermissionCategory, level)
    );
};

/**
 * Get resource access for a user
 */
export const getResourceAccess = (
    user: RBACUser,
    resourceType: 'project' | 'invoice' | 'team' | 'settings' | 'content' | 'analytics'
): ResourceAccess => {
    const categoryMap: Record<typeof resourceType, PermissionCategory> = {
        project: 'projects',
        invoice: 'billing',
        team: 'team',
        settings: 'settings',
        content: 'content',
        analytics: 'analytics'
    };

    const category = categoryMap[resourceType];
    const permissionLevel = (user.permissions || defaultRolePermissions[user.role])[category];

    return {
        canView: permissionLevel !== 'none',
        canEdit: permissionLevel === 'write',
        canDelete: permissionLevel === 'write' && (user.role === 'Owner' || user.role === 'Admin'),
        canCreate: permissionLevel === 'write'
    };
};

/**
 * Check if user can perform a specific action
 */
export const canPerformAction = (
    user: RBACUser,
    action: 'create' | 'read' | 'update' | 'delete',
    resourceType: 'project' | 'invoice' | 'team' | 'settings' | 'content' | 'analytics'
): boolean => {
    const access = getResourceAccess(user, resourceType);

    switch (action) {
        case 'create':
            return access.canCreate;
        case 'read':
            return access.canView;
        case 'update':
            return access.canEdit;
        case 'delete':
            return access.canDelete;
        default:
            return false;
    }
};

// ============================================
// ROLE MANAGEMENT
// ============================================

/**
 * Check if user can change another user's role
 */
export const canChangeRole = (currentUser: RBACUser, targetUser: RBACUser, newRole: TeamRole): PermissionCheck => {
    // Owner can change any role
    if (currentUser.isOwner) {
        return { allowed: true };
    }

    // Cannot change owner role
    if (targetUser.isOwner || targetUser.role === 'Owner') {
        return { allowed: false, reason: 'Cannot change Owner role' };
    }

    // Cannot promote someone to higher or equal level
    if (roleHierarchy[newRole] >= roleHierarchy[currentUser.role]) {
        return {
            allowed: false,
            reason: `Cannot promote to ${newRole} (must be lower than your role)`,
            requiredRole: currentUser.role
        };
    }

    // Can only change roles of lower-level users
    if (roleHierarchy[targetUser.role] >= roleHierarchy[currentUser.role]) {
        return {
            allowed: false,
            reason: `Cannot change role of ${targetUser.role} or higher`,
            requiredRole: currentUser.role
        };
    }

    return { allowed: true };
};

/**
 * Check if user can remove a team member
 */
export const canRemoveMember = (currentUser: RBACUser, targetUser: RBACUser): PermissionCheck => {
    // Owner can remove anyone (except themselves)
    if (currentUser.isOwner && currentUser.id !== targetUser.id) {
        return { allowed: true };
    }

    // Cannot remove owner
    if (targetUser.isOwner || targetUser.role === 'Owner') {
        return { allowed: false, reason: 'Cannot remove Owner' };
    }

    // Cannot remove yourself
    if (currentUser.id === targetUser.id) {
        return { allowed: false, reason: 'Cannot remove yourself' };
    }

    // Can only remove lower-level members
    if (roleHierarchy[targetUser.role] >= roleHierarchy[currentUser.role]) {
        return {
            allowed: false,
            reason: `Cannot remove ${targetUser.role} or higher`,
            requiredRole: currentUser.role
        };
    }

    return { allowed: true };
};

/**
 * Check if user can invite new members
 */
export const canInviteMembers = (currentUser: RBACUser, invitedRole: TeamRole): PermissionCheck => {
    // Owner can invite anyone
    if (currentUser.isOwner) {
        return { allowed: true };
    }

    // Check team permission
    const hasTeamPermission = hasPermission(currentUser, 'team', 'write');
    if (!hasTeamPermission) {
        return {
            allowed: false,
            reason: 'Insufficient team permissions',
            requiredPermission: 'write'
        };
    }

    // Cannot invite someone to equal or higher role
    if (roleHierarchy[invitedRole] >= roleHierarchy[currentUser.role]) {
        return {
            allowed: false,
            reason: `Cannot invite ${invitedRole} (must be lower than your role)`,
            requiredRole: currentUser.role
        };
    }

    return { allowed: true };
};

// ============================================
// PERMISSION VALIDATION
// ============================================

/**
 * Validate custom permissions against role restrictions
 */
export const validateCustomPermissions = (
    user: RBACUser,
    customPermissions: PermissionConfig
): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Owner can have any permissions
    if (user.isOwner || user.role === 'Owner') {
        return { valid: true, errors: [] };
    }

    // Check if custom permissions exceed role permissions
    const rolePerms = defaultRolePermissions[user.role];

    Object.entries(customPermissions).forEach(([category, customLevel]) => {
        const roleLevel = rolePerms[category as PermissionCategory];

        const levelHierarchy: Record<PermissionLevel, number> = {
            write: 2,
            read: 1,
            none: 0
        };

        if (levelHierarchy[customLevel] > levelHierarchy[roleLevel]) {
            errors.push(
                `Cannot grant ${customLevel} access to ${category} for ${user.role} role (max: ${roleLevel})`
            );
        }
    });

    return { valid: errors.length === 0, errors };
};

/**
 * Merge custom permissions with role defaults
 */
export const mergePermissions = (
    role: TeamRole,
    customPermissions?: Partial<PermissionConfig>
): PermissionConfig => {
    const rolePerms = defaultRolePermissions[role];

    if (!customPermissions) {
        return rolePerms;
    }

    return {
        ...rolePerms,
        ...customPermissions
    };
};

// ============================================
// UI HELPERS
// ============================================

/**
 * Get filtered list of roles a user can assign
 */
export const getAssignableRoles = (currentUser: RBACUser): TeamRole[] => {
    if (currentUser.isOwner) {
        return ['Owner', 'Admin', 'Member', 'Viewer'];
    }

    const currentLevel = roleHierarchy[currentUser.role];
    return (Object.keys(roleHierarchy) as TeamRole[]).filter(
        role => roleHierarchy[role] < currentLevel
    );
};

/**
 * Check if UI element should be visible
 */
export const canViewElement = (
    user: RBACUser | null,
    requiredRole?: TeamRole,
    requiredPermission?: { category: PermissionCategory; level: PermissionLevel }
): boolean => {
    if (!user) return false;

    if (requiredRole) {
        return hasRoleLevel(user, requiredRole);
    }

    if (requiredPermission) {
        return hasPermission(user, requiredPermission.category, requiredPermission.level);
    }

    return true;
};

/**
 * Filter menu items based on permissions
 */
export const filterMenuItems = <T extends { requiredRole?: TeamRole; requiredPermission?: { category: PermissionCategory; level: PermissionLevel } }>(
    user: RBACUser | null,
    items: T[]
): T[] => {
    if (!user) return [];

    return items.filter(item => canViewElement(user, item.requiredRole, item.requiredPermission));
};

// ============================================
// ACTIVITY LOGGING HELPERS
// ============================================

/**
 * Create activity event object
 */
export const createActivityEvent = (
    type: string,
    user: RBACUser,
    targetType?: string,
    targetId?: string,
    targetName?: string,
    metadata?: Record<string, any>
) => {
    return {
        id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        targetId,
        targetName,
        targetType,
        metadata,
        createdAt: new Date().toISOString()
    };
};

// ============================================
// EXPORTS
// ============================================

export const rbac = {
    // Permission checking
    hasRoleLevel,
    hasPermission,
    hasPermissions,
    getResourceAccess,
    canPerformAction,

    // Role management
    canChangeRole,
    canRemoveMember,
    canInviteMembers,

    // Permission validation
    validateCustomPermissions,
    mergePermissions,

    // UI helpers
    getAssignableRoles,
    canViewElement,
    filterMenuItems,

    // Activity logging
    createActivityEvent,

    // Defaults
    defaultRolePermissions
};

export default rbac;
