/**
 * Route Configuration Module
 *
 * Extracted from App.tsx following Single Responsibility Principle
 * This module is responsible ONLY for defining route configurations
 *
 * SOLID Compliance:
 * - Single Responsibility: Defines route structure only
 * - Open/Closed: New routes can be added without modifying existing logic
 */

import { lazy } from 'react';

// ==================== Page Imports ====================

// High-priority pages (prefetch immediately on idle)
const HomePage = lazy(() => import(/* webpackPrefetch: true */ '../../pages/HomePage'));
const PreisePage = lazy(() => import(/* webpackPrefetch: true */ '../../pages/PreisePage'));
const ProjektePage = lazy(() => import(/* webpackPrefetch: true */ '../../pages/ProjektePage'));

// Medium-priority pages (prefetch on hover/interaction)
const LeistungenPage = lazy(() => import('../../pages/LeistungenPage'));
const AutomationenPage = lazy(() => import('../../pages/AutomationenPage'));
const ContactPage = lazy(() => import(/* webpackPrefetch: true */ '../../pages/ContactPage'));

// Auth pages (load on demand)
const LoginPage = lazy(() => import('../../pages/LoginPage'));
const RegisterPage = lazy(() => import('../../pages/RegisterPage'));

// Protected routes (load on demand)
const DashboardPage = lazy(() => import('../../pages/DashboardPage'));
const AnalyticsPage = lazy(() => import('../../pages/AnalyticsPage'));
const ChatPage = lazy(() => import('../../pages/ChatPage'));

// Legal pages (low priority)
const ImpressumPage = lazy(() => import('../../pages/ImpressumPage'));
const DatenschutzPage = lazy(() => import('../../pages/DatenschutzPage'));
const FaqPage = lazy(() => import('../../pages/FaqPage'));

// Showcase pages (medium priority)
const RestaurantPage = lazy(() => import('../../pages/RestaurantPage'));
const ArchitecturePage = lazy(() => import('../../pages/ArchitecturePage'));
const RealEstatePage = lazy(() => import('../../pages/RealEstatePage'));

// Feature pages (load on demand)
const ConfiguratorPage = lazy(() => import('../../pages/ConfiguratorPage'));
const ProjectDetailPage = lazy(() => import('../../pages/ProjectDetailPage'));
const SEOPage = lazy(() => import('../../pages/SEOPage'));

// ==================== Type Definitions ====================

export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  title: string;
  protected?: boolean;
  prefetchPriority?: 'high' | 'medium' | 'low';
}

export interface PageTitles {
  [key: string]: string;
}

// ==================== Route Configuration ====================

/**
 * Page titles for SEO and browser tab identification
 */
export const PAGE_TITLES: PageTitles = {
  home: 'ScaleSite | Exzellente Websites',
  leistungen: 'Leistungen | ScaleSite',
  projekte: 'Referenzen & Projekte',
  automationen: 'KI & Automation',
  preise: 'Preise & Pakete',
  contact: 'Kontakt aufnehmen',
  login: 'Login',
  register: 'Registrieren',
  dashboard: 'Mein Dashboard',
  impressum: 'Impressum',
  datenschutz: 'Datenschutz',
  faq: 'FAQ',
  restaurant: 'The Coffee House | Showcase',
  architecture: 'Richter Architects | Showcase',
  realestate: 'Premium Properties | Showcase',
  configurator: 'Website Konfigurator | ScaleSite',
  analytics: 'Analytics | ScaleSite',
  seo: 'SEO Tools | ScaleSite',
  chat: 'Chat | ScaleSite'
};

/**
 * Complete route configuration
 */
export const ROUTES: RouteConfig[] = [
  // Public pages
  { path: 'home', component: HomePage, title: PAGE_TITLES.home, prefetchPriority: 'high' },
  { path: 'leistungen', component: LeistungenPage, title: PAGE_TITLES.leistungen, prefetchPriority: 'medium' },
  { path: 'projekte', component: ProjektePage, title: PAGE_TITLES.projekte, prefetchPriority: 'high' },
  { path: 'automationen', component: AutomationenPage, title: PAGE_TITLES.automationen, prefetchPriority: 'medium' },
  { path: 'preise', component: PreisePage, title: PAGE_TITLES.preise, prefetchPriority: 'high' },
  { path: 'contact', component: ContactPage, title: PAGE_TITLES.contact, prefetchPriority: 'high' },

  // Auth pages
  { path: 'login', component: LoginPage, title: PAGE_TITLES.login, prefetchPriority: 'low' },
  { path: 'register', component: RegisterPage, title: PAGE_TITLES.register, prefetchPriority: 'low' },

  // Protected routes
  { path: 'dashboard', component: DashboardPage, title: PAGE_TITLES.dashboard, protected: true, prefetchPriority: 'medium' },
  { path: 'analytics', component: AnalyticsPage, title: PAGE_TITLES.analytics, protected: true, prefetchPriority: 'low' },
  { path: 'chat', component: ChatPage, title: PAGE_TITLES.chat, protected: true, prefetchPriority: 'low' },

  // Legal pages
  { path: 'impressum', component: ImpressumPage, title: PAGE_TITLES.impressum, prefetchPriority: 'low' },
  { path: 'datenschutz', component: DatenschutzPage, title: PAGE_TITLES.datenschutz, prefetchPriority: 'low' },
  { path: 'faq', component: FaqPage, title: PAGE_TITLES.faq, prefetchPriority: 'low' },

  // Showcase pages
  { path: 'restaurant', component: RestaurantPage, title: PAGE_TITLES.restaurant, prefetchPriority: 'medium' },
  { path: 'architecture', component: ArchitecturePage, title: PAGE_TITLES.architecture, prefetchPriority: 'medium' },
  { path: 'realestate', component: RealEstatePage, title: PAGE_TITLES.realestate, prefetchPriority: 'medium' },

  // Feature pages
  { path: 'configurator', component: ConfiguratorPage, title: PAGE_TITLES.configurator, prefetchPriority: 'low' },
  { path: 'seo', component: SEOPage, title: PAGE_TITLES.seo, prefetchPriority: 'low' },
];

// ==================== Utility Functions ====================

/**
 * Get route configuration by path
 */
export function getRoute(path: string): RouteConfig | undefined {
  return ROUTES.find(route => route.path === path);
}

/**
 * Get all protected routes
 */
export function getProtectedRoutes(): RouteConfig[] {
  return ROUTES.filter(route => route.protected);
}

/**
 * Get all public routes
 */
export function getPublicRoutes(): RouteConfig[] {
  return ROUTES.filter(route => !route.protected);
}

/**
 * Get routes by prefetch priority
 */
export function getRoutesByPriority(priority: 'high' | 'medium' | 'low'): RouteConfig[] {
  return ROUTES.filter(route => route.prefetchPriority === priority);
}

/**
 * Check if a route is protected
 */
export function isProtectedRoute(path: string): boolean {
  const route = getRoute(path);
  return route?.protected || false;
}

/**
 * Get page title for a route
 */
export function getPageTitle(path: string): string {
  const route = getRoute(path);
  return route?.title || 'ScaleSite';
}
