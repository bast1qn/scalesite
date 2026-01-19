// React
import { type ReactNode, type MouseEvent } from 'react';

// Internal - Components
import { Button } from './Button';

// Types
export interface EmptyStateAction {
  label: string;
  onClick: (e?: MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface EmptyStateProps {
  /**
   * Illustration component (SVG icon or illustration)
   * Recommended size: 128x128px (w-32 h-32)
   */
  illustration?: ReactNode;

  /**
   * Empty state title
   * Should be clear and friendly
   */
  title: string;

  /**
   * Empty state description
   * Should explain why it's empty and what to do next
   */
  description: string;

  /**
   * Primary action button
   * This should be the main next step
   */
  primaryAction: EmptyStateAction;

  /**
   * Optional secondary action
   * This should be an alternative or less important action
   */
  secondaryAction?: EmptyStateAction;

  /**
   * Theme for the illustration
   * @default 'light'
   */
  theme?: 'light' | 'dark';

  /**
   * Additional CSS classes
   */
  className?: '';

  /**
   * Show support contact information
   * @default false
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
}

/**
 * EmptyState Component - Linear-inspired beautiful empty states
 *
 * @example
 * ```tsx
 * <EmptyState
 *   illustration={<EmptyTicketsIllustration />}
 *   title="Noch keine Tickets"
 *   description="Erstellen Sie Ihr erstes Support-Ticket und wir helfen Ihnen innerhalb von 24h."
 *   primaryAction={{ label: 'Ticket erstellen', onClick: () => setShowModal(true) }}
 *   secondaryAction={{ label: 'Zur Dokumentation', onClick: () => navigate('/docs') }}
 * />
 * ```
 */
export const EmptyState = ({
  illustration,
  title,
  description,
  primaryAction,
  secondaryAction,
  theme = 'light',
  className = '',
  showContact = false,
  contactEmail = 'support@scalesite.de',
  size = 'default',
}: EmptyStateProps) => {
  // Size variants
  const sizes = {
    compact: {
      container: 'py-8 px-4',
      illustration: 'w-20 h-20 mb-4',
      title: 'text-lg font-semibold mb-1.5',
      description: 'text-sm mb-6 max-w-sm',
    },
    default: {
      container: 'py-16 px-6',
      illustration: 'w-32 h-32 mb-6',
      title: 'text-xl font-semibold mb-2',
      description: 'text-base mb-8 max-w-md',
    },
    large: {
      container: 'py-24 px-8',
      illustration: 'w-40 h-40 mb-8',
      title: 'text-2xl font-semibold mb-3',
      description: 'text-lg mb-10 max-w-lg',
    },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex flex-col items-center justify-center ${currentSize.container} ${className}`}>
      {/* Beautiful illustration with subtle animation */}
      {illustration && (
        <div
          className={`${currentSize.illustration} text-slate-300 dark:text-slate-700 animate-float`}
          style={{ animationDuration: '6s' }}
        >
          {illustration}
        </div>
      )}

      {/* Clear hierarchy - title */}
      <h3
        className={`${currentSize.title} text-slate-900 dark:text-white text-center`}
      >
        {title}
      </h3>

      {/* Clear hierarchy - description */}
      <p className={`${currentSize.description} text-slate-500 dark:text-slate-400 text-center`}>
        {description}
      </p>

      {/* Clear CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button
          variant={primaryAction.variant || 'primary'}
          onClick={primaryAction.onClick}
          className="min-h-11"
        >
          {primaryAction.label}
        </Button>

        {secondaryAction && (
          <Button
            variant={secondaryAction.variant || 'secondary'}
            onClick={secondaryAction.onClick}
            className="min-h-11"
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>

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

// Default export
export default EmptyState;
