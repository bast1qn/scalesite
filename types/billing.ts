/**
 * Billing Type Definitions
 * Centralized types for billing and payment components
 */

// ============================================================================
// PAYMENT METHOD TYPES
// ============================================================================

/**
 * Payment method types
 */
export type PaymentMethodType = 'credit_card' | 'debit_card' | 'paypal' | 'sepa' | 'bank_transfer';

/**
 * Card brands
 */
export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover';

/**
 * Payment method data
 */
export interface PaymentMethod {
  id: string;
  user_id: string;
  type: PaymentMethodType;
  isDefault: boolean;
  cardBrand?: CardBrand;
  lastFour?: string;
  expiryMonth?: number;
  expiryYear?: number;
  paypalEmail?: string;
  sepaIban?: string;
  sepaBic?: string;
  created_at: string;
}

// ============================================================================
// SUBSCRIPTION TYPES
// ============================================================================

/**
 * Subscription status values
 */
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete';

/**
 * Subscription interval
 */
export type SubscriptionInterval = 'monthly' | 'yearly';

/**
 * Subscription data
 */
export interface Subscription {
  id: string;
  user_id: string;
  status: SubscriptionStatus;
  interval: SubscriptionInterval;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: string;
  planId: string;
  planName: string;
  features?: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Subscription plan data
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  interval: SubscriptionInterval;
  features: string[];
  maxProjects?: number;
  maxUsers?: number;
  storageLimit?: number;
}

// ============================================================================
// INVOICE TYPES
// ============================================================================

/**
 * Invoice status values
 */
export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';

/**
 * Invoice line item
 */
export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/**
 * Invoice data
 */
export interface Invoice {
  id: string;
  user_id: string;
  project_id?: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  lineItems: InvoiceLineItem[];
  discountCode?: string;
  discountAmount: number;
  taxAmount: number;
  taxRate: number;
  subtotal: number;
  total: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

/**
 * Transaction status values
 */
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

/**
 * Transaction data
 */
export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  date: string;
  description: string;
  invoiceId?: string;
  subscriptionId?: string;
  paymentMethodId?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// ============================================================================
// DISCOUNT TYPES
// ============================================================================

/**
 * Discount type values
 */
export type DiscountType = 'percentage' | 'fixed_amount';

/**
 * Discount duration
 */
export type DiscountDuration = 'once' | 'repeating' | 'forever';

/**
 * Discount code data
 */
export interface DiscountCode {
  id: string;
  code: string;
  type: DiscountType;
  amount: number;
  currency?: string;
  duration: DiscountDuration;
  durationInMonths?: number;
  maxRedemptions?: number;
  timesRedeemed: number;
  valid: boolean;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

/**
 * Applied discount to subscription
 */
export interface AppliedDiscount {
  code: string;
  type: DiscountType;
  amount: number;
  expiresAt?: string;
}

// ============================================================================
// BILLING COMPONENT PROPS
// ============================================================================

/**
 * Props for PaymentMethodManager component
 */
export interface PaymentMethodManagerProps {
  userId: string;
  allowAdd?: boolean;
  allowRemove?: boolean;
  allowSetDefault?: boolean;
}

/**
 * Props for SubscriptionManager component
 */
export interface SubscriptionManagerProps {
  userId: string;
  currentSubscription?: Subscription;
  availablePlans: SubscriptionPlan[];
  allowCancel?: boolean;
  allowUpgrade?: boolean;
}

/**
 * Props for InvoiceList component
 */
export interface InvoiceListProps {
  userId: string;
  projectId?: string;
  limit?: number;
  downloadable?: boolean;
}
