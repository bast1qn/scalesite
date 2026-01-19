/**
 * Routing Module - Barrel Export
 * Factory Pattern for route management
 */

export { RouterFactory, routerFactory } from './RouterFactory';
export { RouteRenderer, routeRenderer } from './RouteRenderer';
export type {
  RouteConfig,
  RouteContext,
  RoutePriority,
  IRouterFactory
} from './RouteTypes';
