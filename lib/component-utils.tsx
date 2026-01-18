// ============================================
// COMPONENT UTILITIES - Shared Logic & Helpers
// DRY: Extract frequently duplicated component code
// ============================================

import React from 'react';

/**
 * Status badge configuration
 * Maps status values to badge styling and labels
 */
export interface StatusBadgeConfig {
  label: string;
  className: string;
  icon?: React.ReactNode;
}

/**
 * Magic numbers for UI dimensions and timings
 */
const UI_CONSTANTS = {
  BADGE_ICON_SIZE: 6, // w-1.5 h-1.5 in Tailwind (6px)
  BADGE_PADDING_X: 12, // px-3 in Tailwind (12px horizontally)
  BADGE_PADDING_Y: 4, // py-1 in Tailwind (4px vertically)
  BADGE_BORDER_RADIUS: 9999, // rounded-full (pill shape)
  PROGRESS_BAR_HEIGHT: 12, // h-3 in Tailwind (12px)
  RESOURCE_BAR_HEIGHT: 8, // h-2 in Tailwind (8px)
} as const;

/**
 * Creates a standardized status badge configuration
 *
 * This function provides consistent status badges across the application
 * with proper styling, icons, and labels for common status values.
 *
 * @param status - The status string (pending, active, completed, cancelled, open, closed)
 * @returns StatusBadgeConfig object with className, label, and optional icon
 *
 * @example
 * ```tsx
 * const badge = createStatusBadge('active');
 * // Returns: { label: 'Aktiv', className: '...', icon: <span>...</span> }
 * ```
 */
export const createStatusBadge = (status: string): StatusBadgeConfig => {
  const badges: Record<string, StatusBadgeConfig> = {
    pending: {
      label: 'Geplant',
      className: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 shadow-sm',
      icon: <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>,
    },
    active: {
      label: 'Aktiv',
      className: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 shadow-sm',
      icon: <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>,
    },
    completed: {
      label: 'Fertig',
      className: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm',
      icon: (
        <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
    },
    cancelled: {
      label: 'Storniert',
      className: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 text-red-700 dark:text-red-300 border border-red-200/60 dark:border-red-800/40 shadow-sm',
      icon: <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>,
    },
    open: {
      label: 'Offen',
      className: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 shadow-sm',
    },
    closed: {
      label: 'Geschlossen',
      className: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/30 dark:to-gray-900/30 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800/40 shadow-sm',
    },
  };

  return badges[status] || {
    label: status,
    className: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  };
};

/**
 * Render a status badge component
 *
 * Renders a fully styled status badge element based on the status value.
 * This is a convenience wrapper around createStatusBadge that directly
 * returns a React element.
 *
 * @param status - The status string to render
 * @returns React element with styled badge or null for unknown statuses
 *
 * @example
 * ```tsx
 * {renderStatusBadge(project.status)}
 * ```
 */
export const renderStatusBadge = (status: string): React.ReactElement | null => {
  const config = createStatusBadge(status);
  return (
    <span className={config.className}>
      {config.icon}
      {config.label}
    </span>
  );
};

/**
 * Progress bar with gradient and shimmer effect
 *
 * Displays a horizontal progress bar with optional shimmer animation.
 * Used for displaying project completion, file uploads, etc.
 *
 * @param value - Progress percentage (0-100)
 * @param color - Tailwind color classes for the bar (default: blue-violet-indigo gradient)
 * @param showShimmer - Whether to show shimmer animation (default: true)
 * @param className - Additional CSS classes to apply
 *
 * @example
 * ```tsx
 * <ProgressBar value={75} color="bg-emerald-500" />
 * ```
 */
export interface ProgressBarProps {
  value: number;
  color?: string;
  showShimmer?: boolean;
  className?: string;
}

export const ProgressBar = React.memo<ProgressBarProps>(({ value, color = 'bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500', showShimmer = true, className = '' }) => (
  <div className={`relative w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${className}`}>
    {/* Background pattern */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, currentColor 5px, currentColor 10px)',
      }}
    ></div>
    {/* Animated progress bar */}
    <div className={`h-full ${color} rounded-full transition-all duration-700 ease-out relative overflow-hidden`} style={{ width: `${value}%` }}>
      {/* Shimmer effect */}
      {showShimmer && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>}
    </div>
  </div>
));

ProgressBar.displayName = 'ProgressBar';

/**
 * Resource bar for stats display (CPU, RAM, etc.)
 *
 * Displays a resource usage bar with percentage label.
 * Commonly used for server stats, disk usage, memory, etc.
 *
 * @param label - Resource name (e.g., "CPU", "RAM", "Disk")
 * @param value - Usage percentage (0-100)
 * @param color - Tailwind color class for the bar (e.g., "bg-cyan-500")
 *
 * @example
 * ```tsx
 * <ResourceBar label="RAM" value={42} color="bg-violet-500" />
 * ```
 */
export interface ResourceBarProps {
  label: string;
  value: number;
  color: string;
}

export const ResourceBar = React.memo<ResourceBarProps>(({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-xs mb-1.5 text-slate-600 dark:text-slate-400">
      <span className="font-medium">{label}</span>
      <span className="font-bold">{Math.round(value)}%</span>
    </div>
    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
      <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
));

ResourceBar.displayName = 'ResourceBar';

/**
 * Empty state component
 *
 * Displays a styled empty state with icon, title, optional description,
 * and optional call-to-action button.
 *
 * @param icon - React element to display as icon
 * @param title - Main heading text
 * @param description - Optional descriptive text
 * @param action - Optional action button configuration
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<BriefcaseIcon />}
 *   title="No projects found"
 *   description="Create your first project to get started"
 *   action={{ label: 'Create Project', onClick: handleCreate }}
 * />
 * ```
 */
export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = React.memo<EmptyStateProps>(({ icon, title, description, action }) => (
  <div className="text-center py-10 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-950/20 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
    <div className="mx-auto mb-4 text-slate-300 dark:text-slate-600">{icon}</div>
    <p className="text-slate-500 dark:text-slate-400 mb-3 font-medium">{title}</p>
    {description && <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">{description}</p>}
    {action && (
      <button onClick={action.onClick} className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline group">
        {action.label}
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    )}
  </div>
));

EmptyState.displayName = 'EmptyState';

/**
 * Activity item for timeline feeds
 *
 * Displays a single activity entry in a timeline format with
 * colored dot indicator, text, and timestamp.
 *
 * @param id - Unique identifier for the activity
 * @param text - Activity description text
 * @param time - Relative or absolute time string
 * @param type - Activity type (info, success, warning, system) - determines dot color
 *
 * @example
 * ```tsx
 * <ActivityItem
 *   id="1"
 *   text="Ticket created: Support request"
 *   time="2 hours ago"
 *   type="info"
 * />
 * ```
 */
export interface ActivityItemProps {
  id: string;
  text: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'system';
}

export const ActivityItem = React.memo<ActivityItemProps>(({ text, time, type }) => {
  const colorClass =
    type === 'success' ? 'bg-green-500' : type === 'warning' ? 'bg-red-500' : type === 'system' ? 'bg-slate-400' : 'bg-blue-500';

  return (
    <div className="relative group">
      <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 transition-all duration-300 ${colorClass} group-hover:scale-125`}></div>
      <p className="text-sm text-slate-700 dark:text-slate-300">{text}</p>
      <p className="text-xs text-slate-400 mt-0.5">{time}</p>
    </div>
  );
});

ActivityItem.displayName = 'ActivityItem';

/**
 * KPI Card component for dashboard metrics
 * Supports optional click handling for navigation
 */
export interface KPICardProps {
  title?: string;
  value: string | number;
  icon: React.ReactNode;
  subtext?: React.ReactNode;
  onClick?: () => void;
}

export const KPICard = React.memo<KPICardProps>(({ title, value, icon, subtext, onClick }) => (
  <div
    onClick={onClick}
    className={`group relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 overflow-hidden transition-all duration-300 ${
      onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] hover:shadow-glow' : ''
    }`}
  >
    {/* Hover gradient overlay */}
    {onClick && (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-violet-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:via-violet-500/5 group-hover:to-indigo-500/5 transition-all duration-300"></div>
    )}

    <div className="relative flex justify-between items-start mb-4">
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700/50 shadow-sm transition-all duration-300 ${
        onClick ? 'group-hover:scale-[1.02] group-hover:rotate-3' : ''
      }`}>
        {icon}
      </div>
    </div>
    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 relative">
      {subtext}
      {onClick && (
        <svg className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-blue-500 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </p>
  </div>
));

KPICard.displayName = 'KPICard';
