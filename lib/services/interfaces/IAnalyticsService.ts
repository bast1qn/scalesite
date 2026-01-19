/**
 * Analytics Service Interface
 *
 * Abstraction layer for analytics operations
 * Supports multiple analytics providers (Google Analytics, Plausible, etc.)
 */

export interface EventData {
  category: string;
  action: string;
  label?: string;
  value?: number;
  dimensions?: Record<string, string>;
  metrics?: Record<string, number>;
}

export interface PageViewData {
  path: string;
  title: string;
  referrer?: string;
  dimensions?: Record<string, string>;
}

export interface UserProperties {
  userId?: string;
  email?: string;
  name?: string;
  customProperties?: Record<string, any>;
}

export interface AnalyticsConfig {
  provider: 'google_analytics' | 'plausible' | 'matomo' | 'custom';
  trackingId: string;
  options?: Record<string, any>;
}

export interface IAnalyticsService {
  /**
   * Initialize analytics service
   */
  initialize(config: AnalyticsConfig): Promise<void>;

  /**
   * Track a page view
   */
  trackPageView(data: PageViewData): void;

  /**
   * Track a custom event
   */
  trackEvent(event: EventData): void;

  /**
   * Track user properties
   */
  setUser(properties: UserProperties): void;

  /**
   * Set user ID
   */
  setUserId(userId: string): void;

  /**
   * Clear user ID and properties
   */
  clearUser(): void;

  /**
   * Track e-commerce transaction
   */
  trackTransaction(transaction: TransactionData): void;

  /**
   * Track e-commerce item
   */
  trackItem(item: ItemData): void;

  /**
   * Track timing
   */
  trackTiming(category: string, variable: string, value: number, label?: string): void;

  /**
   * Track exception
   */
  trackException(description: string, fatal?: boolean): void;

  /**
   * Disable analytics tracking
   */
  disable(): void;

  /**
   * Enable analytics tracking
   */
  enable(): void;

  /**
   * Check if analytics is enabled
   */
  isEnabled(): boolean;
}

export interface TransactionData {
  orderId: string;
  revenue: number;
  tax?: number;
  shipping?: number;
  currency?: string;
  items?: ItemData[];
}

export interface ItemData {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}
