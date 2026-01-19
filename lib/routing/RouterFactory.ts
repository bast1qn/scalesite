/**
 * Router Factory
 * Factory Pattern: Creates and manages route configurations
 * Open/Closed Principle: Add new routes without modifying existing code
 */

import { lazy } from 'react';
import type { IRouterFactory, RouteConfig } from './RouteTypes';

export class RouterFactory implements IRouterFactory {
  private routes: Map<string, RouteConfig> = new Map();

  constructor() {
    this.initializeDefaultRoutes();
  }

  /**
   * Initialize default application routes
   * Can be extended without modifying factory code
   */
  private initializeDefaultRoutes(): void {
    // High-priority routes (prefetch immediately)
    this.registerRoute({
      path: 'home',
      component: () => import(/* webpackPrefetch: true */ '../../pages/HomePage'),
      title: 'ScaleSite | Exzellente Websites',
      protected: false,
      priority: 'high',
      prefetch: true
    });

    this.registerRoute({
      path: 'preise',
      component: () => import(/* webpackPrefetch: true */ '../../pages/PreisePage'),
      title: 'Preise & Pakete | ScaleSite',
      protected: false,
      priority: 'high',
      prefetch: true
    });

    this.registerRoute({
      path: 'projekte',
      component: () => import(/* webpackPrefetch: true */ '../../pages/ProjektePage'),
      title: 'Referenzen & Projekte | ScaleSite',
      protected: false,
      priority: 'high',
      prefetch: true
    });

    this.registerRoute({
      path: 'contact',
      component: () => import(/* webpackPrefetch: true */ '../../pages/ContactPage'),
      title: 'Kontakt aufnehmen | ScaleSite',
      protected: false,
      priority: 'high',
      prefetch: true
    });

    // Medium-priority routes
    this.registerRoute({
      path: 'leistungen',
      component: () => import('../../pages/LeistungenPage'),
      title: 'Leistungen | ScaleSite',
      protected: false,
      priority: 'medium'
    });

    this.registerRoute({
      path: 'automationen',
      component: () => import('../../pages/AutomationenPage'),
      title: 'KI & Automation | ScaleSite',
      protected: false,
      priority: 'medium'
    });

    // Auth routes (load on demand)
    this.registerRoute({
      path: 'login',
      component: () => import('../../pages/LoginPage'),
      title: 'Login | ScaleSite',
      protected: false,
      priority: 'ondemand'
    });

    this.registerRoute({
      path: 'register',
      component: () => import('../../pages/RegisterPage'),
      title: 'Registrieren | ScaleSite',
      protected: false,
      priority: 'ondemand'
    });

    // Protected routes (require authentication)
    this.registerRoute({
      path: 'dashboard',
      component: () => import('../../pages/DashboardPage'),
      title: 'Mein Dashboard | ScaleSite',
      protected: true,
      priority: 'ondemand'
    });

    this.registerRoute({
      path: 'analytics',
      component: () => import('../../pages/AnalyticsPage'),
      title: 'Analytics | ScaleSite',
      protected: true,
      priority: 'ondemand'
    });

    this.registerRoute({
      path: 'chat',
      component: () => import('../../pages/ChatPage'),
      title: 'Chat | ScaleSite',
      protected: true,
      priority: 'ondemand'
    });

    // Legal pages (low priority)
    this.registerRoute({
      path: 'impressum',
      component: () => import('../../pages/ImpressumPage'),
      title: 'Impressum | ScaleSite',
      protected: false,
      priority: 'low'
    });

    this.registerRoute({
      path: 'datenschutz',
      component: () => import('../../pages/DatenschutzPage'),
      title: 'Datenschutz | ScaleSite',
      protected: false,
      priority: 'low'
    });

    this.registerRoute({
      path: 'faq',
      component: () => import('../../pages/FaqPage'),
      title: 'FAQ | ScaleSite',
      protected: false,
      priority: 'low'
    });

    // Showcase pages
    this.registerRoute({
      path: 'restaurant',
      component: () => import('../../pages/RestaurantPage'),
      title: 'The Coffee House | Showcase',
      protected: false,
      priority: 'medium'
    });

    this.registerRoute({
      path: 'architecture',
      component: () => import('../../pages/ArchitecturePage'),
      title: 'Richter Architects | Showcase',
      protected: false,
      priority: 'medium'
    });

    this.registerRoute({
      path: 'realestate',
      component: () => import('../../pages/RealEstatePage'),
      title: 'Premium Properties | Showcase',
      protected: false,
      priority: 'medium'
    });

    // Feature pages
    this.registerRoute({
      path: 'configurator',
      component: () => import('../../pages/ConfiguratorPage'),
      title: 'Website Konfigurator | ScaleSite',
      protected: false,
      priority: 'ondemand'
    });

    this.registerRoute({
      path: 'seo',
      component: () => import('../../pages/SEOPage'),
      title: 'SEO Tools | ScaleSite',
      protected: false,
      priority: 'ondemand'
    });
  }

  /**
   * Register a new route
   * Open/Closed: Can add routes without modifying factory
   */
  registerRoute(config: RouteConfig): void {
    this.routes.set(config.path, config);
  }

  /**
   * Get route configuration by path
   */
  createRoute(path: string): RouteConfig | undefined {
    return this.routes.get(path);
  }

  /**
   * Get all registered routes
   */
  getRegisteredRoutes(): RouteConfig[] {
    return Array.from(this.routes.values());
  }

  /**
   * Get protected routes only
   */
  getProtectedRoutes(): RouteConfig[] {
    return this.getRegisteredRoutes().filter(route => route.protected);
  }

  /**
   * Get public routes only
   */
  getPublicRoutes(): RouteConfig[] {
    return this.getRegisteredRoutes().filter(route => !route.protected);
  }

  /**
   * Get routes by priority
   */
  getRoutesByPriority(priority: RouteConfig['priority']): RouteConfig[] {
    return this.getRegisteredRoutes().filter(route => route.priority === priority);
  }

  /**
   * Check if route exists
   */
  hasRoute(path: string): boolean {
    return this.routes.has(path);
  }

  /**
   * Get route title
   */
  getRouteTitle(path: string): string {
    const route = this.routes.get(path);
    return route?.title || 'ScaleSite';
  }

  /**
   * Check if route is protected
   */
  isRouteProtected(path: string): boolean {
    const route = this.routes.get(path);
    return route?.protected || false;
  }
}

/**
 * Singleton instance of the router factory
 */
export const routerFactory = new RouterFactory();
