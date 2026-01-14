/**
 * Dashboard Type Definitions
 * Centralized types for dashboard components
 */

// ============================================================================
// TICKET SYSTEM TYPES
// ============================================================================

/**
 * Ticket status values
 */
export type TicketStatus = 'Offen' | 'In Bearbeitung' | 'Wartet auf Antwort' | 'Geschlossen';

/**
 * Ticket priority levels
 */
export type TicketPriority = 'Niedrig' | 'Mittel' | 'Hoch';

/**
 * Ticket data structure
 */
export interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  last_update: string;
  profiles?: {
    name: string;
    role: string;
    company?: string;
  };
}

/**
 * Ticket message data
 */
export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string | null;
  text: string;
  created_at: string;
  profiles?: {
    name: string;
    role: string;
  };
}

/**
 * Ticket member data
 */
export interface TicketMember {
  id: string;
  ticket_id: string;
  user_id: string;
  added_at: string;
}

// ============================================================================
// OVERVIEW WIDGET TYPES
// ============================================================================

/**
 * Widget types for dashboard
 */
export type WidgetType = 'stats' | 'chart' | 'activity' | 'alert';

/**
 * Base widget structure
 */
export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config?: Record<string, unknown>;
}

/**
 * Statistics widget data
 */
export interface StatsWidgetData {
  label: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon?: string;
}

/**
 * Chart data point
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  timestamp?: string;
}

/**
 * Chart widget data
 */
export interface ChartWidgetData {
  title: string;
  type: 'line' | 'bar' | 'pie';
  data: ChartDataPoint[];
  xAxis?: string;
  yAxis?: string;
}

// ============================================================================
// DASHBOARD STATS TYPES
// ============================================================================

/**
 * Dashboard statistics summary
 */
export interface DashboardStats {
  ticketCount: number;
  serviceCount: number;
  activeProjects: number;
  pendingTasks: number;
  unreadNotifications: number;
}

/**
 * Activity feed item
 */
export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: string;
  link?: string;
}

// ============================================================================
// DASHBOARD COMPONENT PROPS
// ============================================================================

/**
 * Props for Overview component
 */
export interface OverviewProps {
  userId: string;
  refreshInterval?: number;
  showWidgets?: WidgetType[];
}

/**
 * Props for TicketSupport component
 */
export interface TicketSupportProps {
  userId: string;
  initialFilter?: {
    status?: TicketStatus;
    priority?: TicketPriority;
  };
  allowCreate?: boolean;
}
