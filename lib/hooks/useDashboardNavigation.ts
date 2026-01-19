/**
 * useDashboardNavigation Hook
 *
 * Single Responsibility: Manage dashboard navigation logic
 * Part of DashboardLayout SRP refactoring
 */

import { useCallback, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { DashboardView, NavItem } from '../../types/dashboard.types';
import type { AppUser } from '../../types';

export interface NavigationConfig {
  primaryItems: NavItem[];
  secondaryItems?: NavItem[];
  adminTools?: NavItem[];
  workspaceItems?: NavItem[];
  hasAdminTools: boolean;
}

export interface UseDashboardNavigationReturn {
  config: NavigationConfig;
  handleNavClick: (view: DashboardView, setActiveView: (v: DashboardView) => void, closeSidebar?: () => void) => void;
}

/**
 * Custom hook for dashboard navigation configuration and logic
 * Separates navigation concerns from UI rendering
 */
export function useDashboardNavigation(user: AppUser | null): UseDashboardNavigationReturn {
  const { t } = useLanguage();
  const isTeam = user?.role === 'team' || user?.role === 'owner';

  /**
   * Navigation configuration for regular users
   */
  const userNavigation: NavigationConfig = useMemo(() => ({
    primaryItems: [
      { view: 'übersicht' as DashboardView, label: t('dashboard.nav.overview'), icon: 'HomeIcon' },
      { view: 'analytics' as DashboardView, label: 'Analytics', icon: 'ChartBarIcon' },
      { view: 'ticket-support' as DashboardView, label: t('dashboard.nav.tickets'), icon: 'TicketIcon' },
      { view: 'dienstleistungen' as DashboardView, label: t('dashboard.nav.services'), icon: 'BriefcaseIcon' },
      { view: 'transaktionen' as DashboardView, label: t('dashboard.nav.transactions'), icon: 'CreditCardIcon' },
      { view: 'einstellungen' as DashboardView, label: t('dashboard.nav.settings'), icon: 'Cog6ToothIcon' },
    ],
    secondaryItems: [
      { view: 'freunde-werben' as DashboardView, label: t('dashboard.nav.referrals'), icon: 'UserGroupIcon' },
      { view: 'partner-werden' as DashboardView, label: 'Partner werden', icon: 'BuildingStorefrontIcon' },
    ],
    hasAdminTools: false
  }), [t]);

  /**
   * Navigation configuration for team members
   */
  const teamNavigation: NavigationConfig = useMemo(() => ({
    workspaceItems: [
      { view: 'übersicht' as DashboardView, label: t('dashboard.nav.overview'), icon: 'HomeIcon' },
      { view: 'analytics' as DashboardView, label: 'Analytics', icon: 'ChartBarIcon' },
      { view: 'user-management' as DashboardView, label: t('dashboard.users.title'), icon: 'UsersIcon' },
      { view: 'ticket-support' as DashboardView, label: t('dashboard.nav.tickets'), icon: 'TicketIcon' },
    ],
    adminTools: [
      { view: 'discount-manager' as DashboardView, label: t('dashboard.discounts.title'), icon: 'TagIcon' },
      { view: 'newsletter-manager' as DashboardView, label: 'Newsletter', icon: 'EnvelopeIcon' },
      { view: 'einstellungen' as DashboardView, label: t('dashboard.nav.settings'), icon: 'Cog6ToothIcon' },
    ],
    hasAdminTools: true
  }), [t]);

  /**
   * Get appropriate navigation config based on user role
   */
  const config = useMemo(() => {
    return isTeam ? teamNavigation : userNavigation;
  }, [isTeam, teamNavigation, userNavigation]);

  /**
   * Stable navigation click handler
   * Prevents unnecessary re-renders
   */
  const handleNavClick = useCallback((
    view: DashboardView,
    setActiveView: (v: DashboardView) => void,
    closeSidebar?: () => void
  ) => {
    setActiveView(view);
    if (closeSidebar) {
      closeSidebar();
    }
  }, []);

  return {
    config,
    handleNavClick
  };
}
