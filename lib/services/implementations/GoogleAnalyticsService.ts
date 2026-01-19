/**
 * Google Analytics Service Implementation
 *
 * Concrete implementation of IAnalyticsService for Google Analytics 4
 */

import {
  IAnalyticsService,
  AnalyticsConfig,
  EventData,
  PageViewData,
  UserProperties,
  TransactionData,
  ItemData,
} from '../interfaces/IAnalyticsService';

export class GoogleAnalyticsService implements IAnalyticsService {
  private initialized = false;
  private enabled = true;
  private config?: AnalyticsConfig;

  async initialize(config: AnalyticsConfig): Promise<void> {
    this.config = config;
    this.initialized = true;

    // Initialize GA4
    if (typeof window !== 'undefined' && config.trackingId) {
      // Load GA4 script
      this.loadGAScript(config.trackingId);
    }
  }

  trackPageView(data: PageViewData): void {
    if (!this.enabled || !this.initialized) return;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: data.path,
        page_title: data.title,
        page_referrer: data.referrer,
        ...data.dimensions,
      });
    }
  }

  trackEvent(event: EventData): void {
    if (!this.enabled || !this.initialized) return;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.dimensions,
        custom_map: event.metrics,
      });
    }
  }

  setUser(properties: UserProperties): void {
    if (!this.enabled || !this.initialized) return;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('set', 'user_properties', {
        ...properties.customProperties,
      });

      if (properties.userId) {
        this.setUserId(properties.userId);
      }
    }
  }

  setUserId(userId: string): void {
    if (!this.enabled || !this.initialized) return;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', this.config?.trackingId, {
        user_id: userId,
      });
    }
  }

  clearUser(): void {
    if (!this.enabled || !this.initialized) return;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', this.config?.trackingId, {
        user_id: null,
      });
    }
  }

  trackTransaction(transaction: TransactionData): void {
    if (!this.enabled || !this.initialized) return;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: transaction.orderId,
        value: transaction.revenue,
        tax: transaction.tax,
        shipping: transaction.shipping,
        currency: transaction.currency || 'USD',
        items: transaction.items?.map((item) => ({
          item_id: item.itemId,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
          item_category: item.category,
        })),
      });
    }
  }

  trackItem(item: ItemData): void {
    if (!this.enabled || !this.initialized) return;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'view_item', {
        item_id: item.itemId,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
        item_category: item.category,
      });
    }
  }

  trackTiming(category: string, variable: string, value: number, label?: string): void {
    if (!this.enabled || !this.initialized) return;

    // GA4 doesn't have built-in timing tracking
    // Use custom event instead
    this.trackEvent({
      category,
      action: 'timing_complete',
      label,
      value,
      dimensions: { variable },
    });
  }

  trackException(description: string, fatal = false): void {
    if (!this.enabled || !this.initialized) return;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description,
        fatal,
      });
    }
  }

  disable(): void {
    this.enabled = false;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', this.config?.trackingId, {
        send_page_view: false,
      });
    }
  }

  enable(): void {
    this.enabled = true;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', this.config?.trackingId, {
        send_page_view: true,
      });
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  private loadGAScript(trackingId: string): void {
    // Inject GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    // Initialize gtag
    const configScript = document.createElement('script');
    configScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}');
    `;
    document.head.appendChild(configScript);
  }
}
