/**
 * Observer Pattern Implementation
 *
 * Purpose: Define a one-to-many dependency between objects so that when one object changes state,
 * all its dependents are notified and updated automatically.
 *
 * Use Cases: Event systems, pub/sub messaging, reactive state management
 *
 * SOLID Compliance:
 * - Single Responsibility: Subject manages observers, observers handle their own updates
 * - Open/Closed: New observers can be added without modifying the subject
 * - Dependency Inversion: Subject depends on Observer interface, not concrete implementations
 */

// ==================== Core Observer Pattern ====================

/**
 * Observer Interface
 * All observers must implement this interface
 */
export interface IObserver<T = any> {
  update(data: T): void;
  id?: string;
}

/**
 * Subject Interface
 * Subjects maintain a list of observers and notify them of changes
 */
export interface ISubject<T = any> {
  attach(observer: IObserver<T>): void;
  detach(observer: IObserver<T>): void;
  notify(data: T): void;
  notifyOne(observerId: string, data: T): void;
  getObserverCount(): number;
}

/**
 * Concrete Subject Implementation
 */
export class Subject<T = any> implements ISubject<T> {
  private observers: Map<string, IObserver<T>> = new Map();
  private observerIdCounter = 0;

  /**
   * Attach an observer to this subject
   */
  attach(observer: IObserver<T>): string {
    const id = observer.id || `observer_${this.observerIdCounter++}`;
    if (!observer.id) {
      observer.id = id;
    }
    this.observers.set(id, observer);
    return id;
  }

  /**
   * Detach an observer from this subject
   */
  detach(observer: IObserver<T>): void;
  detach(observerId: string): void;
  detach(observerOrId: IObserver<T> | string): void {
    const id = typeof observerOrId === 'string' ? observerOrId : observerOrId.id;
    if (id) {
      this.observers.delete(id);
    }
  }

  /**
   * Notify all attached observers
   */
  notify(data: T): void {
    this.observers.forEach(observer => {
      try {
        observer.update(data);
      } catch (error) {
        console.error(`Error notifying observer ${observer.id}:`, error);
      }
    });
  }

  /**
   * Notify a specific observer
   */
  notifyOne(observerId: string, data: T): void {
    const observer = this.observers.get(observerId);
    if (observer) {
      try {
        observer.update(data);
      } catch (error) {
        console.error(`Error notifying observer ${observerId}:`, error);
      }
    }
  }

  /**
   * Get the number of attached observers
   */
  getObserverCount(): number {
    return this.observers.size;
  }

  /**
   * Clear all observers
   */
  detachAll(): void {
    this.observers.clear();
  }
}

// ==================== Event System ====================

/**
 * Event Handler Type
 */
export type EventHandler<T = any> = (data: T) => void | Promise<void>;

/**
 * Event Types for the application
 */
export enum AppEventType {
  // Auth events
  USER_LOGIN = 'user:login',
  USER_LOGOUT = 'user:logout',
  USER_REGISTER = 'user:register',
  SESSION_EXPIRED = 'session:expired',

  // Data events
  DATA_CHANGED = 'data:changed',
  DATA_SAVED = 'data:saved',
  DATA_DELETED = 'data:deleted',

  // UI events
  THEME_CHANGED = 'ui:theme:changed',
  LANGUAGE_CHANGED = 'ui:language:changed',
  NOTIFICATION = 'ui:notification',

  // Network events
  REQUEST_START = 'network:request:start',
 _REQUEST_SUCCESS = 'network:request:success',
  REQUEST_ERROR = 'network:request:error',

  // Custom events
  CUSTOM = 'custom',
}

/**
 * Event Data Interface
 */
export interface EventData {
  type: AppEventType | string;
  timestamp: number;
  payload?: any;
  source?: string;
}

/**
 * Event Bus (Pub/Sub Pattern)
 * Centralized event management system
 */
export class EventBus {
  private static instance: EventBus;
  private subjects: Map<string, Subject<any>> = new Map();

  private constructor() {
    // Private constructor for Singleton
  }

  /**
   * Get the singleton instance
   */
  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Get or create a subject for a specific event type
   */
  private getSubject(eventType: string): Subject<any> {
    if (!this.subjects.has(eventType)) {
      this.subjects.set(eventType, new Subject<any>());
    }
    return this.subjects.get(eventType)!;
  }

  /**
   * Subscribe to an event
   * @param eventType - The event type to subscribe to
   * @param handler - The event handler function
   * @returns Unsubscribe function
   */
  subscribe(eventType: AppEventType | string, handler: EventHandler): () => void {
    const subject = this.getSubject(eventType);

    // Wrap handler in observer
    const observer: IObserver = {
      update: (data: EventData) => {
        handler(data.payload);
      },
    };

    const id = subject.attach(observer);

    // Return unsubscribe function
    return () => {
      subject.detach(id);
    };
  }

  /**
   * Subscribe to an event once
   * @param eventType - The event type to subscribe to
   * @param handler - The event handler function
   */
  subscribeOnce(eventType: AppEventType | string, handler: EventHandler): () => void {
    const unsubscribe = this.subscribe(eventType, (data) => {
      handler(data);
      unsubscribe();
    });
    return unsubscribe;
  }

  /**
   * Publish an event
   * @param eventType - The event type to publish
   * @param payload - The event payload
   * @param source - Optional source identifier
   */
  publish(eventType: AppEventType | string, payload?: any, source?: string): void {
    const subject = this.getSubject(eventType);
    const eventData: EventData = {
      type: eventType,
      timestamp: Date.now(),
      payload,
      source,
    };
    subject.notify(eventData);
  }

  /**
   * Clear all subscribers for a specific event type
   */
  clear(eventType: string): void {
    const subject = this.subjects.get(eventType);
    if (subject) {
      subject.detachAll();
      this.subjects.delete(eventType);
    }
  }

  /**
   * Clear all subscribers for all events
   */
  clearAll(): void {
    this.subjects.forEach(subject => subject.detachAll());
    this.subjects.clear();
  }

  /**
   * Get the number of subscribers for an event type
   */
  getSubscriberCount(eventType: string): number {
    const subject = this.subjects.get(eventType);
    return subject ? subject.getObserverCount() : 0;
  }
}

// ==================== React Hook Integration ====================

/**
 * React hook for subscribing to events
 * @param eventType - The event type to subscribe to
 * @param handler - The event handler function
 * @param deps - Dependencies array
 */
export function useEventSubscription<T = any>(
  eventType: AppEventType | string,
  handler: EventHandler<T>,
  deps: any[] = []
): void {
  React.useEffect(() => {
    const eventBus = EventBus.getInstance();
    const unsubscribe = eventBus.subscribe(eventType, handler);

    return () => {
      unsubscribe();
    };
  }, [eventType, ...deps]);
}

// ==================== Usage Examples ====================

/**
 * Example: Publishing events
 */
export function publishUserLogin(userData: any) {
  const eventBus = EventBus.getInstance();
  eventBus.publish(AppEventType.USER_LOGIN, userData, 'AuthService');
}

/**
 * Example: Subscribing to events
 */
export function setupUserLoginListener() {
  const eventBus = EventBus.getInstance();
  const unsubscribe = eventBus.subscribe(AppEventType.USER_LOGIN, (userData) => {
    console.log('User logged in:', userData);
    // Update UI, fetch user data, etc.
  });

  // Later: unsubscribe();
}

/**
 * Example: Using the React hook
 */
export function UserLoginNotification() {
  useEventSubscription(AppEventType.USER_LOGIN, (userData) => {
    // Show notification or update UI
    console.log('User logged in:', userData);
  }, []);

  return null;
}

/**
 * Example: Custom event with payload
 */
export function publishDataChanged(entityType: string, entityId: string, changes: any) {
  const eventBus = EventBus.getInstance();
  eventBus.publish(AppEventType.DATA_CHANGED, {
    entityType,
    entityId,
    changes,
    timestamp: Date.now(),
  }, 'DataService');
}

/**
 * Example: Multiple subscribers
 */
export function setupMultipleSubscribers() {
  const eventBus = EventBus.getInstance();

  // Subscriber 1: Log all data changes
  const unsub1 = eventBus.subscribe(AppEventType.DATA_CHANGED, (data) => {
    console.log('Data changed:', data);
  });

  // Subscriber 2: Update cache
  const unsub2 = eventBus.subscribe(AppEventType.DATA_CHANGED, (data) => {
    // Update cache
  });

  // Subscriber 3: Trigger analytics
  const unsub3 = eventBus.subscribe(AppEventType.DATA_CHANGED, (data) => {
    // Send analytics event
  });

  // Cleanup later
  // unsub1();
  // unsub2();
  // unsub3();
}

/**
 * Example: One-time subscription
 */
export function waitForUserLogin(): Promise<any> {
  return new Promise((resolve) => {
    const eventBus = EventBus.getInstance();
    eventBus.subscribeOnce(AppEventType.USER_LOGIN, (userData) => {
      resolve(userData);
    });
  });
}

// ==================== Typed Event Wrapper ====================

/**
 * Typed Event Wrapper for type-safe event handling
 */
export class TypedEvent<T> {
  private eventBus = EventBus.getInstance();
  private eventType: string;

  constructor(eventType: string) {
    this.eventType = eventType;
  }

  subscribe(handler: (data: T) => void | Promise<void>): () => void {
    return this.eventBus.subscribe(this.eventType, handler);
  }

  subscribeOnce(handler: (data: T) => void | Promise<void>): () => void {
    return this.eventBus.subscribeOnce(this.eventType, handler);
  }

  publish(data: T): void {
    this.eventBus.publish(this.eventType, data);
  }

  clear(): void {
    this.eventBus.clear(this.eventType);
  }

  getSubscriberCount(): number {
    return this.eventBus.getSubscriberCount(this.eventType);
  }
}

/**
 * Example: Creating typed events
 */
export const userLoginEvent = new TypedEvent<any>(AppEventType.USER_LOGIN);
export const themeChangedEvent = new TypedEvent<'light' | 'dark'>(AppEventType.THEME_CHANGED);
export const languageChangedEvent = new TypedEvent<'de' | 'en'>(AppEventType.LANGUAGE_CHANGED);
