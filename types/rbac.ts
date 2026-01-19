/**
 * RBAC (Role-Based Access Control) Type Definitions
 *
 * Centralized types to avoid circular dependencies between
 * lib/rbac.ts and components/team/*
 */

/**
 * Team roles for RBAC
 */
export type TeamRole = 'Owner' | 'Admin' | 'Member' | 'Viewer';

/**
 * Permission levels
 */
export type PermissionLevel = 'none' | 'read' | 'write';

/**
 * Permission categories
 */
export type PermissionCategory = 'projects' | 'billing' | 'team' | 'settings' | 'content' | 'analytics';

/**
 * Permission configuration object
 */
export interface PermissionConfig {
  projects: PermissionLevel;
  billing: PermissionLevel;
  team: PermissionLevel;
  settings: PermissionLevel;
  content: PermissionLevel;
  analytics: PermissionLevel;
}
