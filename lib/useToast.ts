// ============================================
// SECURE NOTIFICATION SYSTEM
// OWASP Compliant Alternative to alert()/confirm()
// ============================================

import { useCallback, useContext, useEffect } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

/**
 * Secure toast notification hook
 * Replaces native alert() with proper UI component
 *
 * @example
 * const { showToast } = useToast();
 * showToast({ type: 'error', message: 'Validation failed' });
 */
export const useToast = () => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error('useToast must be used within NotificationProvider');
    }

    const showToast = useCallback((options: {
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
        duration?: number;
    }) => {
        const { type, message, duration = 5000 } = options;

        context.addNotification({
            id: Date.now().toString(),
            type,
            message,
            duration
        });
    }, [context]);

    /**
     * Show success notification
     */
    const showSuccess = useCallback((message: string, duration?: number) => {
        showToast({ type: 'success', message, duration });
    }, [showToast]);

    /**
     * Show error notification
     */
    const showError = useCallback((message: string, duration?: number) => {
        showToast({ type: 'error', message, duration });
    }, [showToast]);

    /**
     * Show warning notification
     */
    const showWarning = useCallback((message: string, duration?: number) => {
        showToast({ type: 'warning', message, duration });
    }, [showToast]);

    /**
     * Show info notification
     */
    const showInfo = useCallback((message: string, duration?: number) => {
        showToast({ type: 'info', message, duration });
    }, [showToast]);

    return {
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };
};

/**
 * Secure confirmation dialog hook
 * Replaces native confirm() with proper UI modal
 *
 * @example
 * const { showConfirm } = useConfirm();
 * const confirmed = await showConfirm({
 *     title: 'Delete Item?',
 *     message: 'This action cannot be undone.'
 * });
 */
export const useConfirm = () => {
    const [confirmState, setConfirmState] = React.useState<{
        resolve: (value: boolean) => void;
        title: string;
        message: string;
    } | null>(null);

    const showConfirm = useCallback((options: {
        title: string;
        message: string;
    }): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirmState({
                resolve,
                title: options.title,
                message: options.message
            });
        });
    }, []);

    const handleConfirm = useCallback(() => {
        if (confirmState) {
            confirmState.resolve(true);
            setConfirmState(null);
        }
    }, [confirmState]);

    const handleCancel = useCallback(() => {
        if (confirmState) {
            confirmState.resolve(false);
            setConfirmState(null);
        }
    }, [confirmState]);

    return {
        showConfirm,
        confirmState,
        handleConfirm,
        handleCancel
    };
};

// Import React for useState
import React from 'react';
