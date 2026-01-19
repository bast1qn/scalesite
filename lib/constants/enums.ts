/**
 * Centralized Enums for ScaleSite
 * Replaces string literal types with proper enums for better type safety and consistency
 */

// ===== VIEW MODES =====

/**
 * View mode for list/grid displays
 */
export enum ViewMode {
  /** Grid view layout */
  Grid = 'grid',
  /** List view layout */
  List = 'list',
}

// ===== DEVICE TYPES =====

/**
 * Device type for responsive previews
 */
export enum DeviceType {
  /** Desktop preview */
  Desktop = 'desktop',
  /** Tablet preview */
  Tablet = 'tablet',
  /** Mobile preview */
  Mobile = 'mobile',
}

// ===== NOTIFICATION TYPES =====

/**
 * Type of notification/toast message
 */
export enum NotificationType {
  /** Success notification */
  Success = 'success',
  /** Error notification */
  Error = 'error',
  /** Warning notification */
  Warning = 'warning',
  /** Information notification */
  Info = 'info',
}

// ===== TICKET STATUS =====

/**
 * Unified ticket status across the application
 */
export enum TicketStatus {
  /** Ticket is open */
  Open = 'Offen',
  /** Ticket is being worked on */
  InProgress = 'In Bearbeitung',
  /** Ticket is waiting for response */
  WaitingForResponse = 'Wartet auf Antwort',
  /** Ticket is closed */
  Closed = 'Geschlossen',
}

// ===== TICKET PRIORITY =====

/**
 * Unified ticket priority across the application
 */
export enum TicketPriority {
  /** Critical priority */
  Critical = 'Kritisch',
  /** High priority */
  High = 'Hoch',
  /** Medium priority */
  Medium = 'Mittel',
  /** Low priority */
  Low = 'Niedrig',
}

// ===== SUBSCRIPTION STATUS =====

/**
 * Subscription status for billing
 */
export enum SubscriptionStatus {
  /** Active subscription */
  Active = 'active',
  /** Trial period */
  Trialing = 'trialing',
  /** Payment overdue */
  PastDue = 'past_due',
  /** Subscription canceled */
  Canceled = 'canceled',
  /** Payment failed */
  Unpaid = 'unpaid',
}

// ===== INVOICE STATUS =====

/**
 * Invoice status for billing
 */
export enum InvoiceStatus {
  /** Draft invoice */
  Draft = 'draft',
  /** Open invoice */
  Open = 'open',
  /** Paid invoice */
  Paid = 'paid',
  /** Uncollectible invoice */
  Uncollectible = 'uncollectible',
  /** Voided invoice */
  Void = 'void',
}

// ===== USER ROLES =====

/**
 * User role for permissions
 */
export enum UserRole {
  /** Administrator */
  Admin = 'admin',
  /** Editor */
  Editor = 'editor',
  /** Viewer */
  Viewer = 'viewer',
}

// ===== THEME =====

/**
 * Application theme
 */
export enum Theme {
  /** Light theme */
  Light = 'light',
  /** Dark theme */
  Dark = 'dark',
  /** System theme */
  System = 'system',
}

// ===== ANIMATION DURATION =====

/**
 * Animation duration presets
 */
export enum AnimationDuration {
  /** Fast animation (150ms) */
  Fast = 'fast',
  /** Normal animation (300ms) */
  Normal = 'normal',
  /** Slow animation (500ms) */
  Slow = 'slow',
}

// ===== TAB TYPES =====

/**
 * Common tab types for tabbed interfaces
 */
export enum TabType {
  /** Edit tab */
  Edit = 'edit',
  /** Preview tab */
  Preview = 'preview',
  /** Settings tab */
  Settings = 'settings',
}

// ===== FILTER STATUS =====

/**
 * Filter status for lists
 */
export enum FilterStatus {
  /** Show all items */
  All = 'all',
  /** Show active items */
  Active = 'active',
  /** Show pending items */
  Pending = 'pending',
  /** Show inactive items */
  Inactive = 'inactive',
}

// ===== SORT ORDER =====

/**
 * Sort order direction
 */
export enum SortOrder {
  /** Ascending order */
  Ascending = 'asc',
  /** Descending order */
  Descending = 'desc',
}
