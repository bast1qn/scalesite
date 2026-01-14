// NotificationContext - Simplified version for Neon + Clerk migration

import { createContext, useState, useCallback, useContext, useMemo, type ReactNode, type FC } from 'react';
import {
    requestNotificationPermission,
    showBrowserNotification,
    canShowNotifications
} from '../lib/realtime';

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
    read_at?: string;
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
        start: string;
        end: string;
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

export const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    unreadCount: 0,
    loading: false,
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

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: FC<NotificationProviderProps> = ({ children }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);

    const unreadCount = useMemo(() => {
        return notifications.filter(n => !n.read).length;
    }, [notifications]);

    const markAsRead = useCallback(async (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    }, []);

    const markAllAsRead = useCallback(async () => {
        setNotifications(prev =>
            prev.map(n => ({ ...n, read: true }))
        );
    }, []);

    const deleteNotification = useCallback(async (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const clearAll = useCallback(async () => {
        setNotifications([]);
    }, []);

    const updatePreferences = useCallback(async (newPrefs: Partial<NotificationPreferences>) => {
        setPreferences(prev => ({
            ...prev,
            ...newPrefs,
            types: {
                ...prev.types,
                ...(newPrefs.types || {}),
            },
            quiet_hours: {
                ...prev.quiet_hours,
                ...(newPrefs.quiet_hours || {}),
            },
        }));
    }, []);

    const requestPermission = useCallback(async (): Promise<boolean> => {
        const permission = await requestNotificationPermission();

        if (permission === 'granted') {
            await updatePreferences({ browser: true });
        }

        return permission === 'granted';
    }, [updatePreferences]);

    const canShowBrowserNotifications = useCallback((): boolean => {
        return canShowNotifications();
    }, []);

    /**
     * Refreshes notifications from database
     * @remarks Backend integration with Neon pending
     */
    const refreshNotifications = useCallback(async () => {
        setNotifications([]);
    }, []);

    const contextValue = useMemo<NotificationContextType>(() => ({
        notifications,
        unreadCount,
        loading: false,
        preferences,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        updatePreferences,
        requestPermission,
        canShowBrowserNotifications,
        refreshNotifications,
    }), [notifications, unreadCount, preferences, markAsRead, markAllAsRead, deleteNotification, clearAll, updatePreferences, requestPermission, canShowBrowserNotifications, refreshNotifications]);

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
};

// Convenience hook
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
