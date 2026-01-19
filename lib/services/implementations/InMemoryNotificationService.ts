/**
 * In-Memory Notification Service Implementation
 *
 * Concrete implementation of INotificationService for development/testing
 * Can be replaced with a real implementation (Push notifications, Email service, etc.)
 */

import {
  INotificationService,
  Notification,
  NotificationPayload,
  NotificationOptions,
  NotificationPreferences,
  NotificationChannel,
} from '../interfaces/INotificationService';

export class InMemoryNotificationService implements INotificationService {
  private notifications: Map<string, Notification[]> = new Map();
  private preferences: Map<string, NotificationPreferences> = new Map();

  async send(
    userId: string,
    payload: NotificationPayload,
    options?: NotificationOptions
  ): Promise<string> {
    const notification: Notification = {
      id: this.generateId(),
      userId,
      title: payload.title,
      message: payload.message,
      data: payload.data,
      actionUrl: payload.actionUrl,
      actionLabel: payload.actionLabel,
      channels: options?.channels || ['in_app'],
      priority: options?.priority || 'normal',
      type: options?.type || 'info',
      read: false,
      createdAt: new Date(),
      expiresAt: options?.ttl
        ? new Date(Date.now() + options.ttl * 1000)
        : undefined,
    };

    // Store notification
    const userNotifications = this.notifications.get(userId) || [];
    userNotifications.push(notification);
    this.notifications.set(userId, userNotifications);

    return notification.id;
  }

  async sendBulk(
    userIds: string[],
    payload: NotificationPayload,
    options?: NotificationOptions
  ): Promise<string[]> {
    const notificationIds = await Promise.all(
      userIds.map((userId) => this.send(userId, payload, options))
    );
    return notificationIds;
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const notifications = this.notifications.get(userId);
    if (!notifications) return;

    const notification = notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    const notifications = this.notifications.get(userId);
    if (!notifications) return;

    notifications.forEach((n) => {
      n.read = true;
    });
  }

  async getNotifications(
    userId: string,
    unreadOnly = false
  ): Promise<Notification[]> {
    const notifications = this.notifications.get(userId) || [];

    if (unreadOnly) {
      return notifications.filter((n) => !n.read);
    }

    return notifications.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const notifications = this.notifications.get(userId);
    if (!notifications) return;

    const index = notifications.findIndex((n) => n.id === notificationId);
    if (index !== -1) {
      notifications.splice(index, 1);
    }
  }

  async getPreferences(userId: string): Promise<NotificationPreferences> {
    let preferences = this.preferences.get(userId);

    if (!preferences) {
      // Create default preferences
      preferences = {
        userId,
        channels: {
          inApp: true,
          email: false,
          push: false,
          sms: false,
        },
        categories: {
          system: true,
          updates: true,
          marketing: false,
          security: true,
        },
      };
      this.preferences.set(userId, preferences);
    }

    return preferences;
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const current = await this.getPreferences(userId);
    const updated = {
      ...current,
      ...preferences,
      channels: { ...current.channels, ...preferences.channels },
      categories: { ...current.categories, ...preferences.categories },
      quietHours: preferences.quietHours || current.quietHours,
    };

    this.preferences.set(userId, updated);
    return updated;
  }

  async subscribe(
    userId: string,
    channel: NotificationChannel,
    deviceToken?: string
  ): Promise<void> {
    const preferences = await this.getPreferences(userId);

    switch (channel) {
      case 'email':
        preferences.channels.email = true;
        break;
      case 'push':
        preferences.channels.push = true;
        // Store device token for push notifications
        if (deviceToken) {
          preferences.channels[`${channel}_token` as keyof typeof preferences.channels] =
            deviceToken as any;
        }
        break;
      case 'sms':
        preferences.channels.sms = true;
        break;
    }

    this.preferences.set(userId, preferences);
  }

  async unsubscribe(userId: string, channel: NotificationChannel): Promise<void> {
    const preferences = await this.getPreferences(userId);

    switch (channel) {
      case 'email':
        preferences.channels.email = false;
        break;
      case 'push':
        preferences.channels.push = false;
        break;
      case 'sms':
        preferences.channels.sms = false;
        break;
    }

    this.preferences.set(userId, preferences);
  }

  async broadcast(
    payload: NotificationPayload,
    options?: NotificationOptions
  ): Promise<void> {
    // Send to all users with in-app notifications enabled
    const userIds = Array.from(this.preferences.keys()).filter((userId) => {
      const prefs = this.preferences.get(userId);
      return prefs?.channels.inApp;
    });

    await this.sendBulk(userIds, payload, options);
  }

  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear all notifications (useful for testing)
   */
  clear(): void {
    this.notifications.clear();
    this.preferences.clear();
  }
}
