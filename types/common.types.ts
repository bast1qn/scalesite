// ============================================
// COMMON TYPE DEFINITIONS
// ============================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  errors?: Record<string, string[]>;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

/**
 * ID-only entity
 */
export interface Entity {
  id: string;
}

/**
 * Timestamps for entities
 */
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Soft deletable entity
 */
export interface SoftDeletable {
  isDeleted: boolean;
  deletedAt?: Date;
}

/**
 * Select option
 */
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

/**
 * Color variant
 */
export type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'gray';

/**
 * Size variant
 */
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Sort order
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Sort configuration
 */
export interface SortConfig {
  key: string;
  order: SortOrder;
}

/**
 * Filter configuration
 */
export interface FilterConfig {
  key: string;
  operator: 'eq' | 'neq' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'gte' | 'lt' | 'lte' | 'in';
  value: unknown;
}

/**
 * Generic data table column
 */
export interface TableColumn<T = unknown> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T) => React.ReactNode;
}

/**
 * Form field error
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Form state
 */
export interface FormState<T = Record<string, unknown>> {
  data: T;
  errors: FieldError[];
  touched: Set<keyof T>;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * Toast notification
 */
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

/**
 * Modal props
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
}

/**
 * Dropdown option
 */
export interface DropdownOption<T = string> {
  value: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  divider?: boolean;
}

/**
 * Tab item
 */
export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  content: React.ReactNode;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * Menu item
 */
export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string | number;
  children?: MenuItem[];
}

/**
 * User role
 */
export type UserRole = 'admin' | 'moderator' | 'user' | 'guest';

/**
 * Permission
 */
export type Permission =
  | 'read'
  | 'write'
  | 'update'
  | 'delete'
  | 'admin'
  | 'moderate';

/**
 * User permissions
 */
export interface UserPermissions {
  canRead: boolean;
  canWrite: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canAdmin: boolean;
  canModerate: boolean;
}

/**
 * Status type
 */
export type StatusType =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'draft'
  | 'published'
  | 'archived';

/**
 * Priority type
 */
export type PriorityType = 'low' | 'medium' | 'high' | 'urgent';

/**
 * File upload
 */
export interface FileUpload {
  file: File;
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

/**
 * Image dimensions
 */
export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Address
 */
export interface Address {
  street: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  country: string;
  state?: string;
}

/**
 * Contact info
 */
export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
}

/**
 * Social links
 */
export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

/**
 * SEO metadata
 */
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  twitterCard?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

/**
 * Chart data point
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

/**
 * Progress state
 */
export interface ProgressState {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
}

/**
 * Loading state
 */
export interface LoadingState {
  isLoading: boolean;
  error?: Error | string;
  data?: unknown;
}

/**
 * Async state
 */
export type AsyncState<T = unknown, E = Error> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };

/**
 * Entity with async state
 */
export type EntityAsyncState<T> = AsyncState<T, Error> & {
  data?: T;
  error?: Error;
  isLoading: boolean;
};

/**
 * Locale
 */
export type Locale = 'de' | 'en' | 'fr' | 'es' | 'it';

/**
 * Currency
 */
export type Currency = 'EUR' | 'USD' | 'GBP' | 'CHF';

/**
 * Price
 */
export interface Price {
  amount: number;
  currency: Currency;
  taxIncluded?: boolean;
  taxRate?: number;
}

/**
 * Discount
 */
export interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
  code?: string;
  validUntil?: Date;
  minPurchase?: number;
}
