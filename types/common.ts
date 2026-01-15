/**
 * Common Type Definitions
 * Shared types used across multiple components
 */

// ============================================================================
// DISPLAY VARIANT TYPES
// ============================================================================

/**
 * Display variant options for component sizing/detail level
 */
export type DisplayVariant = 'default' | 'compact' | 'detailed';

/**
 * Status types for UI elements
 */
export type StatusType = 'success' | 'error' | 'warning' | 'info';

/**
 * Position types for tooltips/popovers
 */
export type PositionType = 'top' | 'bottom' | 'left' | 'right';

/**
 * Size variants for UI elements
 */
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// ============================================================================
// STATUS ENUMS (Replace boolean flags)
// ============================================================================

/**
 * Loading/Async operation states
 * Use instead of: boolean isLoading
 */
export enum LoadingState {
    IDLE = 'idle',
    LOADING = 'loading',
    SUCCESS = 'success',
    ERROR = 'error',
}

/**
 * Validation states
 * Use instead of: boolean isValid, boolean isInvalid
 */
export enum ValidationStatus {
    IDLE = 'idle',
    VALIDATING = 'validating',
    VALID = 'valid',
    INVALID = 'invalid',
}

/**
 * API request states
 * Use instead of: boolean isPending, boolean isSuccess
 */
export enum RequestStatus {
    IDLE = 'idle',
    PENDING = 'pending',
    SUCCESS = 'success',
    ERROR = 'error',
}

/**
 * Visibility states
 * Use instead of: boolean isVisible
 */
export enum Visibility {
    VISIBLE = 'visible',
    HIDDEN = 'hidden',
}

/**
 * Enabled states
 * Use instead of: boolean isEnabled
 */
export enum EnabledState {
    ENABLED = 'enabled',
    DISABLED = 'disabled',
}

/**
 * Active states
 * Use instead of: boolean isActive
 */
export enum ActiveState {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

/**
 * Selection states
 * Use instead of: boolean isSelected
 */
export enum SelectionState {
    SELECTED = 'selected',
    UNSELECTED = 'unselected',
}

// ============================================================================
// LANGUAGE & LOCALE TYPES
// ============================================================================

/**
 * Supported languages
 */
export type Language = 'de' | 'en';

/**
 * Locale codes
 */
export type Locale = 'de-DE' | 'en-US' | 'de-AT' | 'de-CH' | 'en-GB';

// ============================================================================
// FORM & INPUT TYPES
// ============================================================================

/**
 * Input field types
 */
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'file';

/**
 * Form validation status
 */
export type ValidationStatus = 'valid' | 'invalid' | 'pending';

/**
 * Form field error
 */
export interface FieldError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Form validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: FieldError[];
  warnings?: FieldError[];
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  message?: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * API error response
 */
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

// ============================================================================
// LOADING & ASYNC TYPES
// ============================================================================

/**
 * Loading state for async operations
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Async data state with loading and error handling
 */
export interface AsyncData<T> {
  data: T | null;
  loadingState: LoadingState;
  error: string | null;
  lastUpdated?: string;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

/**
 * Notification types
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Notification priority
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Toast notification data
 */
export interface ToastNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  priority?: NotificationPriority;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
  createdAt: string;
}

// ============================================================================
// MODAL & DIALOG TYPES
// ============================================================================

/**
 * Modal size options
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Modal props base
 */
export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

// ============================================================================
// TABLE & LIST TYPES
// ============================================================================

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Column sort config
 */
export interface ColumnSort {
  column: string;
  direction: SortDirection;
}

/**
 * Table pagination config
 */
export interface TablePagination {
  page: number;
  pageSize: number;
  total: number;
}

/**
 * Filter operator
 */
export type FilterOperator = 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'startsWith' | 'endsWith';

/**
 * Table filter config
 */
export interface TableFilter {
  column: string;
  operator: FilterOperator;
  value: unknown;
}

// ============================================================================
// ANIMATION TYPES
// ============================================================================

/**
 * Animation duration presets
 */
export type AnimationDuration = 'fast' | 'normal' | 'slow';

/**
 * Animation easing types
 */
export type AnimationEasing = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

/**
 * Animation config
 */
export interface AnimationConfig {
  duration: AnimationDuration;
  easing: AnimationEasing;
  delay?: number;
}

// ============================================================================
// THEME TYPES
// ============================================================================

/**
 * Theme mode
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Theme configuration
 */
export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor?: string;
  borderRadius?: SizeVariant;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Make specific properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific properties required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
