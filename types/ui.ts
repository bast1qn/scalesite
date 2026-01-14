/**
 * UI Types
 * Common type definitions for UI components
 */

export type Variant = 'default' | 'compact' | 'detailed';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

export type Language = 'de' | 'en';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface IconProps {
  className?: string;
  size?: Size;
}

export interface BaseComponentProps {
  className?: string;
  variant?: Variant;
  disabled?: boolean;
}

export interface ActionProps extends BaseComponentProps {
  onClick?: () => void;
  onAction?: () => void;
  label?: string;
  ariaLabel?: string;
}
