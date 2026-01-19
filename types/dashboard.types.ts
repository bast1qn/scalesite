/**
 * Dashboard Type Definitions
 *
 * PURPOSE: Shared types to avoid circular dependencies
 * LOCATION: types/dashboard.types.ts
 * ARCHITECTURE: Enterprise-grade type organization
 */

/**
 * Dashboard View Type
 * All possible views in the dashboard
 */
export type DashboardView =
  | 'übersicht'
  | 'ticket-support'
  | 'dienstleistungen'
  | 'transaktionen'
  | 'einstellungen'
  | 'freunde-werben'
  | 'partner-werden'
  | 'user-management'
  | 'discount-manager'
  | 'newsletter-manager'
  | 'analytics';

/**
 * Dashboard Page Props
 */
export interface DashboardPageProps {
  setCurrentPage: (page: string) => void;
}

/**
 * Dashboard Layout Props
 */
export interface DashboardLayoutProps {
  children: React.ReactNode;
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
  setCurrentPage: (page: string) => void;
}

/**
 * Navigation Item
 */
export interface NavItem {
  view: DashboardView;
  label: string;
  icon: React.ReactNode;
}
