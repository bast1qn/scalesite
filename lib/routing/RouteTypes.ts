/**
 * Routing Type Definitions
 * Open/Closed Principle: Open for extension, closed for modification
 */

import type { ComponentType } from 'react';

export type RoutePriority = 'high' | 'medium' | 'low' | 'ondemand';

export interface RouteConfig {
  path: string;
  component: () => Promise<{ default: ComponentType<any> }>;
  title: string;
  protected: boolean;
  priority: RoutePriority;
  prefetch?: boolean;
  meta?: {
    description?: string;
    keywords?: string[];
  };
}

export interface RouteContext {
  user: any;
  setCurrentPage: (page: string) => void;
}

export interface IRouterFactory {
  createRoute(path: string): RouteConfig | undefined;
  registerRoute(config: RouteConfig): void;
  getRegisteredRoutes(): RouteConfig[];
  getProtectedRoutes(): RouteConfig[];
  getPublicRoutes(): RouteConfig[];
}
