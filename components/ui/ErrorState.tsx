// React
import { type ReactNode, type MouseEvent } from 'react';

// Internal - Components
import { Button } from './Button';
import { illustrations } from './EmptyStateIllustrations';

// Types
export interface ErrorStateAction {
  label: string;
  onClick: (e?: MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export type ErrorType = 'network' | 'timeout' | 'notFound' | 'permission' | 'generic';

export interface ErrorStateProps {
  /**
   * Type of error - determines illustration
   * @default 'generic'
   */
  type?: ErrorType;

  /**
   * Custom illustration component (overrides type)
   */
  illustration?: ReactNode;

  /**
   * Error title
   * Should be clear and friendly
   * @default 'Etwas ist schiefgelaufen'
   */
  title?: string;

  /**
   * Error description
   * Should explain what happened and what to do next
   * @default 'Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.'
   */
  description?: string;

  /**
   * Primary action button
   * This should be the main recovery action (e.g., "Retry")
   */
  primaryAction?: ErrorStateAction;

  /**
   * Optional secondary action
   * This should be an alternative action (e.g., "Go back")
   */
  secondaryAction?: ErrorStateAction;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Show support contact information
   * @default true
   */
  showContact?: boolean;

  /**
   * Contact email address
   * @default 'support@scalesite.de'
   */
  contactEmail?: string;

  /**
   * Size variant
   * @default 'default'
   */
  size?: 'compact' | 'default' | 'large';

  /**
   * Show error code or ID
   */
  errorCode?: string;
}

/**
 * ErrorState Component - Stripe-inspired friendly error states
 *
 * @example
 * ```tsx
 * <ErrorState
 *   type="network"
 *   title="Verbindungsfehler"
 *   description="Wir konnten keine Verbindung zum Server herstellen. Bitte überprüfen Sie Ihre Internetverbindung."
 *   primaryAction={{ label: 'Erneut versuchen', onClick: retry }}
 *   secondaryAction={{ label: 'Zurück zur Startseite', onClick: () => navigate('/') }}
 *   errorCode="ERR_NETWORK_001"
 * />
 * ```
 */
export const ErrorState = ({
  type = 'generic',
  illustration: customIllustration,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = '',
  showContact = true,
  contactEmail = 'support@scalesite.de',
  size = 'default',
  errorCode,
}: ErrorStateProps) => {
  // Default messages by error type
  const defaultMessages: Record<ErrorType, { title: string; description: string }> = {
    network: {
      title: 'Verbindungsfehler',
      description: 'Wir konnten keine Verbindung zum Server herstellen. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.',
    },
    timeout: {
      title: 'Zeitüberschreitung',
      description: 'Die Anfrage hat zu lange gedauert. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support, wenn das Problem weiterhin besteht.',
    },
    notFound: {
      title: 'Seite nicht gefunden',
      description: 'Die von Ihnen gesuchte Seite konnte nicht gefunden werden. Überprüfen Sie die URL oder navigieren Sie zurück zur Startseite.',
    },
    permission: {
      title: 'Keine Berechtigung',
      description: 'Sie haben nicht die notwendigen Berechtigungen, um auf diese Ressource zuzugreifen. Kontaktieren Sie Ihren Administrator, wenn Sie think dies ist ein Fehler.',
    },
    generic: {
      title: 'Etwas ist schiefgelaufen',
      description: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.',
    },
  };

  // Get illustration (custom or default based on type)
  const getIllustration = (): ReactNode => {
    if (customIllustration) return customIllustration;

    const illustrationMap: Record<ErrorType, ReactNode> = {
      network: illustrations.network(),
      timeout: illustrations.timeout(),
      notFound: illustrations.notFound(),
      permission: illustrations.permission(),
      generic: illustrations.generic(),
    };

    return illustrationMap[type];
  };

  // Use provided messages or defaults
  const errorTitle = title || defaultMessages[type].title;
  const errorDescription = description || defaultMessages[type].description;

  // Size variants
  const sizes = {
    compact: {
      container: 'py-8 px-4',
      illustration: 'w-20 h-20 mb-4',
      title: 'text-lg font-semibold mb-1.5',
      description: 'text-sm mb-6 max-w-sm',
      errorCode: 'text-xs',
    },
    default: {
      container: 'py-16 px-6',
      illustration: 'w-32 h-32 mb-6',
      title: 'text-xl font-semibold mb-2',
      description: 'text-base mb-8 max-w-md',
      errorCode: 'text-sm',
    },
    large: {
      container: 'py-24 px-8',
      illustration: 'w-40 h-40 mb-8',
      title: 'text-2xl font-semibold mb-3',
      description: 'text-lg mb-10 max-w-lg',
      errorCode: 'text-base',
    },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex flex-col items-center justify-center ${currentSize.container} ${className}`}>
      {/* Animated illustration with subtle bounce */}
      <div
        className={`${currentSize.illustration} text-slate-300 dark:text-slate-700`}
        style={{
          animation: 'error-bounce 2s ease-in-out infinite',
        }}
      >
        {getIllustration()}
      </div>

      {/* Error code */}
      {errorCode && (
        <div className={`${currentSize.errorCode} font-mono text-primary-500 dark:text-primary-400 mb-2`}>
          {errorCode}
        </div>
      )}

      {/* Clear hierarchy - title */}
      <h3 className={`${currentSize.title} text-slate-900 dark:text-white text-center`}>
        {errorTitle}
      </h3>

      {/* Clear hierarchy - description */}
      <p className={`${currentSize.description} text-slate-500 dark:text-slate-400 text-center`}>
        {errorDescription}
      </p>

      {/* Clear recovery actions */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {primaryAction && (
            <Button
              variant={primaryAction.variant || 'primary'}
              onClick={primaryAction.onClick}
              size={size === 'compact' ? 'sm' : size === 'large' ? 'lg' : 'md'}
            >
              {primaryAction.label}
            </Button>
          )}

          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || 'secondary'}
              onClick={secondaryAction.onClick}
              size={size === 'compact' ? 'sm' : size === 'large' ? 'lg' : 'md'}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}

      {/* Support contact */}
      {showContact && (
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <a
            href={`mailto:${contactEmail}`}
            className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
          >
            {contactEmail}
          </a>
        </div>
      )}
    </div>
  );
};

// Add error bounce animation
export const errorStateStyles = `
  @keyframes error-bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }
`;

// Default export
export default ErrorState;
