import { useEffect, useState } from 'react';
import { CheckBadgeIcon, XMarkIcon, InformationCircleIcon, ExclamationTriangleIcon } from './Icons';

/**
 * Premium Toast Component (Linear/Stripe-style)
 * Subtle, non-intrusive feedback with smooth animations
 */

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 4000,
  onClose,
  position = 'bottom-right'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);

    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for exit animation before calling onClose
      setTimeout(() => onClose?.(), 400);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckBadgeIcon className="w-5 h-5" />,
    error: <XMarkIcon className="w-5 h-5" />,
    info: <InformationCircleIcon className="w-5 h-5" />,
    warning: <ExclamationTriangleIcon className="w-5 h-5" />
  };

  const colors = {
    success: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/30',
    error: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-200/50 dark:border-rose-800/30',
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/30',
    warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/30'
  };

  const positions = {
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  return (
    <div
      className={`fixed z-[9999] ${positions[position]} transition-all duration-400 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
      }`}
      role="alert"
      aria-live="polite"
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-premium-lg backdrop-blur-xl max-w-md ${colors[type]} transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
      >
        <span className="flex-shrink-0">{icons[type]}</span>
        <p className="flex-1 text-sm font-medium leading-snug">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 400);
          }}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200 focus:ring-2 focus:ring-primary-500/50"
          aria-label="Close notification"
        >
          <XMarkIcon className="w-4 h-4 opacity-60" />
        </button>
      </div>
    </div>
  );
};

/**
 * Hook for managing toasts
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{ id: string; props: Omit<ToastProps, 'onClose'> }>>([]);

  const show = (props: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, props }]);
  };

  const remove = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map(({ id, props }) => (
        <Toast key={id} {...props} onClose={() => remove(id)} />
      ))}
    </>
  );

  return {
    show,
    success: (message: string, duration?: number) => show({ message, type: 'success', duration }),
    error: (message: string, duration?: number) => show({ message, type: 'error', duration }),
    info: (message: string, duration?: number) => show({ message, type: 'info', duration }),
    warning: (message: string, duration?: number) => show({ message, type: 'warning', duration }),
    ToastContainer
  };
};
