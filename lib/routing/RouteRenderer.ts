/**
 * Route Renderer
 * Strategy Pattern: Different rendering strategies for routes
 */

import { lazy, Suspense, type ComponentType } from 'react';
import type { RouteConfig, RouteContext } from './RouteTypes';

export class RouteRenderer {
  private componentCache: Map<string, ComponentType<any>> = new Map();

  /**
   * Render a route by path
   * Uses component caching for performance
   */
  async renderRoute(path: string, context: RouteContext): Promise<JSX.Element | null> {
    const { routerFactory } = await import('./RouterFactory');
    const route = routerFactory.createRoute(path);

    if (!route) {
      console.warn(`Route not found: ${path}`);
      return null;
    }

    // Check authentication for protected routes
    if (route.protected && !context.user) {
      console.warn(`Protected route accessed without authentication: ${path}`);
      return null;
    }

    // Get or load component
    const Component = await this.loadComponent(route);

    if (!Component) {
      return null;
    }

    const loader = <this.PageLoader />;
    return (
      <Suspense fallback={loader}>
        <Component setCurrentPage={context.setCurrentPage} />
      </Suspense>
    );
  }

  /**
   * Load component with caching
   * Singleton Pattern for component instances
   */
  private async loadComponent(route: RouteConfig): Promise<ComponentType<any> | null> {
    // Check cache first
    if (this.componentCache.has(route.path)) {
      return this.componentCache.get(route.path)!;
    }

    try {
      const module = await route.component();
      const Component = module.default;

      // Cache the component
      this.componentCache.set(route.path, Component);
      return Component;
    } catch (error) {
      console.error(`Failed to load route component: ${route.path}`, error);
      return null;
    }
  }

  /**
   * Clear component cache
   * Useful for testing or HMR
   */
  clearCache(): void {
    this.componentCache.clear();
  }

  /**
   * Loading component
   */
  private PageLoader() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="flex flex-col items-center gap-6 px-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary-500 border-r-primary-600 rounded-full animate-spin"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-primary-500/10 to-violet-500/10 rounded-full animate-pulse"></div>
          </div>
          <div className="text-center">
            <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">Loading...</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Bitte warten...</p>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Singleton instance
 */
export const routeRenderer = new RouteRenderer();
