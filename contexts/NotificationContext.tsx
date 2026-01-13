// NotificationContext - Real-time Notification Management
// Woche 25: Real-time Features - Notifications

import { createContext, useState, useEffect, useContext, useRef, useCallback, type ReactNode, type FC } from 'react';
import { useAuth } from './AuthContext';
import { supabase, Notification } from '../lib/supabase';
import {
    subscribeToNotifications,
    unsubscribe,
    requestNotificationPermission,
    showBrowserNotification,
    canShowNotifications
} from '../lib/realtime';

// ============================================
// TYPES
// ============================================

export type NotificationType =
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'ticket'
    | 'project'
    | 'billing'
    | 'system'
    | 'team'
    | 'message';

export interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    message?: string;
    link?: string;
    read: boolean;
    created_at: string;
    expires_at?: string;
    related_entity_type?: string;
    related_entity_id?: string;
}

export interface NotificationPreferences {
    browser: boolean;
    sound: boolean;
    email: boolean;
    types: {
        ticket: boolean;
        project: boolean;
        billing: boolean;
        team: boolean;
        system: boolean;
        marketing: boolean;
    };
    quiet_hours: {
        enabled: boolean;
        start: string; // HH:mm format
        end: string;   // HH:mm format
    };
}

interface NotificationContextType {
    notifications: AppNotification[];
    unreadCount: number;
    loading: boolean;
    preferences: NotificationPreferences;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    clearAll: () => Promise<void>;
    updatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
    requestPermission: () => Promise<boolean>;
    canShowBrowserNotifications: () => boolean;
    refreshNotifications: () => Promise<void>;
}

// ============================================
// DEFAULT PREFERENCES
// ============================================

const defaultPreferences: NotificationPreferences = {
    browser: false,
    sound: false,
    email: true,
    types: {
        ticket: true,
        project: true,
        billing: true,
        team: true,
        system: true,
        marketing: false,
    },
    quiet_hours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
    },
};

// ============================================
// CONTEXT
// ============================================

export const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    unreadCount: 0,
    loading: true,
    preferences: defaultPreferences,
    markAsRead: async () => {},
    markAllAsRead: async () => {},
    deleteNotification: async () => {},
    clearAll: async () => {},
    updatePreferences: async () => {},
    requestPermission: async () => false,
    canShowBrowserNotifications: () => false,
    refreshNotifications: async () => {},
});

// ============================================
// PROVIDER
// ============================================

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: FC<NotificationProviderProps> = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
    const [subscriptionActive, setSubscriptionActive] = useState(false);

    const channelRef = useRef<string | null>(null);
    const isMountedRef = useRef(true);

    // Load notifications from database
    const loadNotifications = useCallback(async () => {
        if (!user) {
            setNotifications([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            if (data && isMountedRef.current) {
                setNotifications(data.map(n => mapDbNotificationToApp(n)));
            }
        } catch (error) {
            console.error('[NOTIFICATIONS] Error loading notifications:', error);
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, [user]);

    // Load preferences
    const loadPreferences = useCallback(async () => {
        if (!user) {
            setPreferences(defaultPreferences);
            return;
        }

        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('preferences')
                .eq('id', user.id)
                .single();

            if (profile?.preferences?.notification && isMountedRef.current) {
                setPreferences({
                    ...defaultPreferences,
                    ...profile.preferences.notification,
                });
            }
        } catch (error) {
            console.error('[NOTIFICATIONS] Error loading preferences:', error);
        }
    }, [user]);

    // Map DB notification to app notification
    // ✅ FIXED: Made function stable with useCallback to prevent recreation
    const mapDbNotificationToApp = useCallback((n: Notification): AppNotification => {
        return {
            id: n.id,
            type: n.type as NotificationType,
            title: n.title,
            message: n.message,
            link: n.link,
            read: n.read,
            created_at: n.created_at,
            expires_at: n.expires_at,
            related_entity_type: n.related_entity_type,
            related_entity_id: n.related_entity_id,
        };
    }, []); // ✅ FIXED: No dependencies - pure mapping function

    // Check if quiet hours are active
    const isQuietHours = useCallback((): boolean => {
        if (!preferences.quiet_hours.enabled) return false;

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [startHour, startMin] = preferences.quiet_hours.start.split(':').map(Number);
        const [endHour, endMin] = preferences.quiet_hours.end.split(':').map(Number);
        const startTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;

        // Handle overnight quiet hours (e.g., 22:00 to 08:00)
        if (startTime > endTime) {
            return currentTime >= startTime || currentTime < endTime;
        }

        return currentTime >= startTime && currentTime < endTime;
    }, [preferences]);

    // Check if notification type is enabled
    const isTypeEnabled = useCallback((type: NotificationType): boolean => {
        const typeMap: Record<NotificationType, keyof NotificationPreferences['types']> = {
            info: 'system',
            success: 'system',
            warning: 'system',
            error: 'system',
            ticket: 'ticket',
            project: 'project',
            billing: 'billing',
            system: 'system',
            team: 'team',
            message: 'team',
        };

        const prefKey = typeMap[type] || 'system';
        return preferences.types[prefKey];
    }, [preferences]);

    // Show browser notification if enabled
    const showNotification = useCallback((notification: AppNotification) => {
        // Check quiet hours
        if (isQuietHours()) return;

        // Check if type is enabled
        if (!isTypeEnabled(notification.type)) return;

        // Show browser notification
        if (preferences.browser && canShowNotifications()) {
            showBrowserNotification(notification.title, {
                body: notification.message,
                icon: '/favicon.ico',
                tag: notification.id,
                data: { link: notification.link },
            });
        }
    }, [preferences, isQuietHours, isTypeEnabled]);

    // Mark notification as read
    const markAsRead = useCallback(async (id: string) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true, read_at: new Date().toISOString() })
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;

            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
        } catch (error) {
            console.error('[NOTIFICATIONS] Error marking as read:', error);
        }
    }, [user]);

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true, read_at: new Date().toISOString() })
                .eq('user_id', user.id)
                .eq('read', false);

            if (error) throw error;

            setNotifications(prev =>
                prev.map(n => ({ ...n, read: true }))
            );
        } catch (error) {
            console.error('[NOTIFICATIONS] Error marking all as read:', error);
        }
    }, [user]);

    // Delete notification
    const deleteNotification = useCallback(async (id: string) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;

            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error('[NOTIFICATIONS] Error deleting notification:', error);
        }
    }, [user]);

    // Clear all notifications
    const clearAll = useCallback(async () => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('user_id', user.id);

            if (error) throw error;

            setNotifications([]);
        } catch (error) {
            console.error('[NOTIFICATIONS] Error clearing notifications:', error);
        }
    }, [user]);

    // Update preferences
    const updatePreferences = useCallback(async (newPrefs: Partial<NotificationPreferences>) => {
        if (!user) return;

        try {
            const updatedPrefs = {
                ...preferences,
                ...newPrefs,
                types: {
                    ...preferences.types,
                    ...(newPrefs.types || {}),
                },
                quiet_hours: {
                    ...preferences.quiet_hours,
                    ...(newPrefs.quiet_hours || {}),
                },
            };

            const { error } = await supabase
                .from('profiles')
                .update({
                    preferences: {
                        notification: updatedPrefs,
                    },
                })
                .eq('id', user.id);

            if (error) throw error;

            setPreferences(updatedPrefs);
        } catch (error) {
            console.error('[NOTIFICATIONS] Error updating preferences:', error);
        }
    }, [user, preferences]);

    // Request browser notification permission
    const requestPermission = useCallback(async (): Promise<boolean> => {
        const permission = await requestNotificationPermission();

        if (permission === 'granted') {
            await updatePreferences({ browser: true });
        }

        return permission === 'granted';
    }, [updatePreferences]);

    // Check if can show browser notifications
    const canShowBrowserNotifications = useCallback((): boolean => {
        return canShowNotifications();
    }, []);

    // Refresh notifications
    const refreshNotifications = useCallback(async () => {
        await loadNotifications();
    }, [loadNotifications]);

    // Subscribe to real-time notifications
    useEffect(() => {
        if (!user || subscriptionActive) return;

        const channelName = subscribeToNotifications(user.id, {
            onInsert: (newNotification) => {
                if (!isMountedRef.current) return;

                const appNotification = mapDbNotificationToApp(newNotification);
                setNotifications(prev => [appNotification, ...prev]);

                // Show browser notification
                showNotification(appNotification);
            },
            onUpdate: (payload) => {
                if (!isMountedRef.current) return;

                setNotifications(prev =>
                    prev.map(n =>
                        n.id === payload.new.id
                            ? mapDbNotificationToApp(payload.new)
                            : n
                    )
                );
            },
            onDelete: (oldNotification) => {
                if (!isMountedRef.current) return;

                setNotifications(prev =>
                    prev.filter(n => n.id !== oldNotification.id)
                );
            },
            onError: (error) => {
                console.error('[NOTIFICATIONS] Subscription error:', error);
            },
        });

        channelRef.current = channelName;
        setSubscriptionActive(true);

        return () => {
            if (channelRef.current) {
                unsubscribe(channelRef.current);
                channelRef.current = null;
            }
            setSubscriptionActive(false);
        };
    }, [user, subscriptionActive, showNotification, mapDbNotificationToApp]); // ✅ FIXED: Added mapDbNotificationToApp

    // Load initial data
    useEffect(() => {
        isMountedRef.current = true;

        loadNotifications();
        loadPreferences();

        return () => {
            isMountedRef.current = false;
            if (channelRef.current) {
                unsubscribe(channelRef.current);
            }
        };
    }, [loadNotifications, loadPreferences]);

    // Calculate unread count
    const unreadCount = notifications.filter(n => !n.read).length;

    const value: NotificationContextType = {
        notifications,
        unreadCount,
        loading,
        preferences,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        updatePreferences,
        requestPermission,
        canShowBrowserNotifications,
        refreshNotifications,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

// ============================================
// HOOK
// ============================================

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
