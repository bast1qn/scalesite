// ============================================
// SECURE CONFIRMATION DIALOG
// OWASP Compliant Alternative to confirm()
// ============================================

import { Fragment, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
}

/**
 * Secure confirmation dialog component
 * Replaces native confirm() with proper UI modal
 *
 * @example
 * <ConfirmDialog
 *     isOpen={true}
 *     title="Delete Item?"
 *     message="This action cannot be undone."
 *     type="danger"
 *     onConfirm={() => handleDelete()}
 *     onCancel={() => setShowConfirm(false)}
 * />
 */
export const ConfirmDialog: FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmLabel = 'Bestätigen',
    cancelLabel = 'Abbrechen',
    type = 'warning',
    onConfirm,
    onCancel
}) => {
    // Keyboard accessibility
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onCancel();
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            onConfirm();
        }
    };

    const typeStyles = {
        danger: {
            icon: '⚠️',
            confirmBg: 'bg-red-600 hover:bg-red-700',
            confirmText: 'text-white'
        },
        warning: {
            icon: '⚠️',
            confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
            confirmText: 'text-white'
        },
        info: {
            icon: 'ℹ️',
            confirmBg: 'bg-blue-600 hover:bg-blue-700',
            confirmText: 'text-white'
        }
    };

    const styles = typeStyles[type];

    return (
        <AnimatePresence>
            {isOpen && (
                <Fragment>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onCancel}
                        aria-hidden="true"
                    />

                    {/* Dialog */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={handleKeyDown}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="confirm-title"
                            aria-describedby="confirm-message"
                            tabIndex={-1}
                        >
                            {/* Icon */}
                            <div className="flex justify-center mb-4">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                                    type === 'danger' ? 'bg-red-100 dark:bg-red-900/30' :
                                    type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                                    'bg-blue-100 dark:bg-blue-900/30'
                                }`}>
                                    {styles.icon}
                                </div>
                            </div>

                            {/* Title */}
                            <h2
                                id="confirm-title"
                                className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2"
                            >
                                {title}
                            </h2>

                            {/* Message */}
                            <p
                                id="confirm-message"
                                className="text-slate-600 dark:text-slate-300 text-center mb-6"
                            >
                                {message}
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    {cancelLabel}
                                </button>
                                <button
                                    type="button"
                                    onClick={onConfirm}
                                    className={`flex-1 px-4 py-2 rounded-lg ${styles.confirmBg} ${styles.confirmText} transition-colors`}
                                >
                                    {confirmLabel}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </Fragment>
            )}
        </AnimatePresence>
    );
};

export default ConfirmDialog;
