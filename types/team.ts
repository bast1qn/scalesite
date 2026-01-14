/**
 * Team Type Definitions
 * Centralized types for team management components
 */

// ============================================================================
// TEAM MEMBER TYPES
// ============================================================================

/**
 * Team member status values
 */
export type TeamMemberStatus = 'pending' | 'active' | 'inactive';

/**
 * Team member roles
 */
export type TeamMemberRole = 'owner' | 'admin' | 'member' | 'viewer';

/**
 * Permission categories
 */
export type PermissionCategory = 'projects' | 'billing' | 'team' | 'settings' | 'analytics';

/**
 * Team member data
 */
export interface TeamMember {
  id: string;
  team_id: string;
  member_id: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  permissions?: Record<PermissionCategory, boolean>;
  invited_by: string;
  invited_at: string;
  joined_at?: string;
  profiles?: {
    name: string;
    email: string;
    avatar_url?: string;
  };
}

// ============================================================================
// TEAM INVITATION TYPES
// ============================================================================

/**
 * Invitation status values
 */
export type InvitationStatus = 'pending' | 'accepted' | 'cancelled' | 'expired';

/**
 * Team invitation data
 */
export interface TeamInvitation {
  id: string;
  team_id: string;
  email: string;
  role: TeamMemberRole;
  status: InvitationStatus;
  invited_by: string;
  invited_by_name?: string;
  expires_at: string;
  created_at: string;
  accepted_at?: string;
  permissions?: Record<PermissionCategory, boolean>;
}

// ============================================================================
// TEAM ACTIVITY TYPES
// ============================================================================

/**
 * Activity types for team activity feed
 */
export type ActivityType =
  | 'member_joined'
  | 'member_left'
  | 'member_invited'
  | 'role_changed'
  | 'project_created'
  | 'project_updated'
  | 'settings_updated'
  | 'permission_changed';

/**
 * Target types for activity
 */
export type ActivityTargetType = 'team' | 'member' | 'project' | 'settings' | 'permission';

/**
 * Team activity data
 */
export interface TeamActivity {
  id: string;
  type: ActivityType;
  user_id: string;
  user_name: string;
  user_email?: string;
  target_type?: ActivityTargetType;
  target_id?: string;
  target_name?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

/**
 * Activity feed item for display
 */
export interface ActivityFeedItem {
  id: string;
  type: ActivityType;
  user_name: string;
  user_avatar?: string;
  description: string;
  target_name?: string;
  target_link?: string;
  timestamp: string;
  relative_time?: string;
}

// ============================================================================
// TEAM SETTINGS TYPES
// ============================================================================

/**
 * Team settings data
 */
export interface TeamSettings {
  id: string;
  team_id: string;
  name: string;
  description?: string;
  logo_url?: string;
  default_permissions?: Record<PermissionCategory, boolean>;
  allow_member_invitation: boolean;
  require_approval_for_new_members: boolean;
  max_members?: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// TEAM COMPONENT PROPS
// ============================================================================

/**
 * Props for TeamActivityFeed component
 */
export interface TeamActivityFeedProps {
  teamId: string;
  limit?: number;
  refreshInterval?: number;
  showFilters?: boolean;
  filterTypes?: ActivityType[];
}

/**
 * Props for TeamMemberList component
 */
export interface TeamMemberListProps {
  teamId: string;
  allowEdit?: boolean;
  allowRemove?: boolean;
  allowInvite?: boolean;
  showPermissions?: boolean;
}

/**
 * Props for TeamInvitationManager component
 */
export interface TeamInvitationManagerProps {
  teamId: string;
  allowCancel?: boolean;
  allowResend?: boolean;
  showExpired?: boolean;
}
