/**
 * Notification Service Interface
 *
 * Abstraction layer for notification operations
 * Supports multiple channels: in-app, email, push, SMS
 */

export type NotificationChannel = 'in_app' | 'email' | 'push' | 'sms';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationPayload {
  title: string;
  message: string;
  data?: Record<string, any>;
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotificationOptions {
  channels?: NotificationChannel[];
  priority?: NotificationPriority;
  type?: NotificationType;
  ttl?: number; // Time to live in seconds
  tags?: string[];
  icon?: string;
  badge?: number;
}

export interface Notification extends NotificationPayload {
  id: string;
  userId: string;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface NotificationPreferences {
  userId: string;
  channels: {
    inApp: boolean;
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  categories: {
    system: boolean;
    updates: boolean;
    marketing: boolean;
    security: boolean;
  };
  quietHours?: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
    timezone: string;
  };
}

export interface INotificationService {
  /**
   * Send a notification to a user
   */
  send(userId: string, payload: NotificationPayload, options?: NotificationOptions): Promise<string>;

  /**
   * Send notification to multiple users
   */
  sendBulk(userIds: string[], payload: NotificationPayload, options?: NotificationOptions): Promise<string[]>;

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string, userId: string): Promise<void>;

  /**
   * Mark all notifications as read for a user
   */
  markAllAsRead(userId: string): Promise<void>;

  /**
   * Get notifications for a user
   */
  getNotifications(userId: string, unreadOnly?: boolean): Promise<Notification[]>;

  /**
   * Delete a notification
   */
  deleteNotification(notificationId: string, userId: string): Promise<void>;

  /**
   * Get user notification preferences
   */
  getPreferences(userId: string): Promise<NotificationPreferences>;

  /**
   * Update user notification preferences
   */
  updatePreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences>;

  /**
   * Subscribe to notification channel
   */
  subscribe(userId: string, channel: NotificationChannel, deviceToken?: string): Promise<void>;

  /**
   * Unsubscribe from notification channel
   */
  unsubscribe(userId: string, channel: NotificationChannel): Promise<void>;

  /**
   * Send notification to all users (broadcast)
   */
  broadcast(payload: NotificationPayload, options?: NotificationOptions): Promise<void>;
}
