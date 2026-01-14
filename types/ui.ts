/**
 * UI Types
 * Common type definitions for UI components
 */

// ✅ BUG FIX: Removed duplicate types - now re-exporting from common.ts
export type {
  DisplayVariant as Variant,
  SizeVariant as Size,
  Language,
  LoadingState
} from './common';

// Color type is unique to this file
export type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

export interface IconProps {
  className?: string;
  size?: SizeVariant;
}

export interface BaseComponentProps {
  className?: string;
  variant?: DisplayVariant;
  disabled?: boolean;
}

export interface ActionProps extends BaseComponentProps {
  onClick?: () => void;
  onAction?: () => void;
  label?: string;
  ariaLabel?: string;
}

// Import types from common for re-use
import type { DisplayVariant, SizeVariant } from './common';
