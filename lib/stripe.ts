/**
 * Stripe Payment Integration for ScaleSite
 *
 * Handles:
 * - Payment Intents (one-time payments)
 * - Payment Methods (saved cards, SEPA)
 * - Subscriptions (recurring billing)
 * - Invoices
 * - Webhooks
 */

import { supabase } from './supabase';

// ============================================
// TYPES
// ============================================

export interface PaymentMethod {
    id: string;
    user_id: string;
    type: 'card' | 'sepa_debit' | 'paypal' | 'bank_transfer' | 'other';
    provider: string;
    provider_payment_method_id: string;
    is_default: boolean;
    card_last4?: string;
    card_brand?: string;
    card_exp_month?: number;
    card_exp_year?: number;
    sepa_mandate_reference?: string;
    sepa_mandate_url?: string;
    paypal_email?: string;
    billing_name?: string;
    billing_email?: string;
    metadata?: Record<string, unknown>;
    status: 'active' | 'inactive' | 'expired';
    created_at: string;
    updated_at: string;
}

export interface Payment {
    id: string;
    user_id: string;
    invoice_id?: string;
    amount: number;
    currency: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
    payment_method_id?: string;
    provider: string;
    provider_payment_intent_id?: string;
    provider_charge_id?: string;
    description?: string;
    failure_reason?: string;
    receipt_url?: string;
    metadata?: Record<string, unknown>;
    created_at: string;
    updated_at: string;
    completed_at?: string;
    refunded_at?: string;
    refund_amount: number;
    refund_reason?: string;
}

export interface Subscription {
    id: string;
    user_id: string;
    project_id?: string;
    service_id?: number;
    status: 'active' | 'past_due' | 'canceled' | 'unpaid' | 'trialing';
    provider: string;
    provider_subscription_id: string;
    provider_price_id?: string;
    provider_product_id?: string;
    amount: number;
    currency: string;
    interval: 'month' | 'year';
    interval_count: number;
    trial_start?: string;
    trial_end?: string;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    canceled_at?: string;
    metadata?: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export interface PaymentIntent {
    id: string;
    user_id: string;
    invoice_id?: string;
    amount: number;
    currency: string;
    status: string;
    provider_payment_intent_id?: string;
    client_secret?: string;
    payment_method_id?: string;
    metadata?: Record<string, unknown>;
    created_at: string;
    updated_at: string;
    expires_at?: string;
}

export interface CreatePaymentIntentParams {
    amount: number;
    currency?: string;
    invoice_id?: string;
    payment_method_id?: string;
    description?: string;
    metadata?: Record<string, unknown>;
}

export interface CreateSubscriptionParams {
    service_id: number;
    price_id: string;
    payment_method_id: string;
    project_id?: string;
    trial_days?: number;
    metadata?: Record<string, unknown>;
}

export interface Invoice {
    id: string;
    user_id: string;
    project_id?: string;
    invoice_number: string;
    amount: number;
    currency: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    issue_date: string;
    due_date: string;
    paid_at?: string;
    payment_method?: string;
    payment_id?: string;
    subscription_id?: string;
    stripe_invoice_id?: string;
    stripe_hosted_invoice_url?: string;
    invoice_pdf_url?: string;
    line_items: Array<{
        description: string;
        quantity: number;
        unit_price: number;
        total: number;
    }>;
    discount_amount: number;
    tax_amount: number;
    created_at: string;
    updated_at: string;
}

// ============================================
// CONFIG
// ============================================

// ⚠️ SECURITY: Stripe Secret keys MUST be server-side only (Deno.env in Edge Functions)
// NEVER expose VITE_STRIPE_SECRET_KEY in frontend bundle!
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

// Check if Stripe is configured (only need publishable key in frontend)
export const isStripeConfigured = !!STRIPE_PUBLISHABLE_KEY;

// ============================================
// ERROR HANDLING
// ============================================

export class StripeError extends Error {
    constructor(
        message: string,
        public code?: string,
        public statusCode?: number,
        public stripeError?: unknown
    ) {
        super(message);
        this.name = 'StripeError';
    }
}

// ============================================
// API HELPERS (Client-side)
// ============================================

/**
 * Call the Stripe backend API via Supabase Edge Function
 */
async function callStripeAPI(endpoint: string, data: Record<string, unknown> = {}): Promise<unknown> {
    try {
        // In a real setup, this would call a Supabase Edge Function
        // For now, we'll simulate the API call

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new StripeError('User not authenticated', 'auth_required', 401);
        }

        // Get session token for auth
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        // Call Supabase Edge Function (you'd create this in functions/stripe)
        // For development, we'll use a direct approach
        const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe/${endpoint}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || ''
                },
                body: JSON.stringify(data)
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new StripeError(
                error.message || 'Stripe API error',
                error.code,
                response.status,
                error
            );
        }

        return await response.json();
    } catch (error: unknown) {
        if (error instanceof StripeError) throw error;
        throw new StripeError(error instanceof Error ? error.message : 'Failed to call Stripe API', 'api_error', 500);
    }
}

// ============================================
// PAYMENT METHODS
// ============================================

/**
 * Get all payment methods for current user
 */
export const getPaymentMethods = async (): Promise<{
    data: PaymentMethod[] | null;
    error: Error | null;
}> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { data: null, error: new StripeError('Not authenticated', 'auth_required') };
        }

        const { data, error } = await supabase
            .from('payment_methods')
            .select('*')
            .eq('user_id', user.id)
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false });

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * Get default payment method
 */
export const getDefaultPaymentMethod = async (): Promise<{
    data: PaymentMethod | null;
    error: Error | null;
}> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { data: null, error: new StripeError('Not authenticated', 'auth_required') };
        }

        const { data, error } = await supabase
            .from('payment_methods')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_default', true)
            .single();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * Attach a payment method (Stripe SetupIntent)
 */
export const attachPaymentMethod = async (paymentMethodId: string): Promise<{
    data: PaymentMethod | null;
    error: Error | null;
}> => {
    try {
        const result = await callStripeAPI('attach-payment-method', {
            payment_method_id: paymentMethodId
        });

        return { data: result.paymentMethod, error: null };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * Set default payment method
 */
export const setDefaultPaymentMethod = async (paymentMethodId: string): Promise<{
    success: boolean;
    error: Error | null;
}> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: new StripeError('Not authenticated', 'auth_required') };
        }

        const { error } = await supabase
            .from('payment_methods')
            .update({ is_default: true })
            .eq('id', paymentMethodId)
            .eq('user_id', user.id);

        return { success: !error, error };
    } catch (error) {
        return { success: false, error };
    }
};

/**
 * Detach/delete a payment method
 */
export const detachPaymentMethod = async (paymentMethodId: string): Promise<{
    success: boolean;
    error: Error | null;
}> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: new StripeError('Not authenticated', 'auth_required') };
        }

        // Call Stripe API to detach
        await callStripeAPI('detach-payment-method', {
            payment_method_id: paymentMethodId
        });

        // Delete from database
        const { error } = await supabase
            .from('payment_methods')
            .delete()
            .eq('id', paymentMethodId)
            .eq('user_id', user.id);

        return { success: !error, error };
    } catch (error) {
        return { success: false, error };
    }
};

// ============================================
// PAYMENT INTENTS (One-time payments)
// ============================================

/**
 * Create a payment intent
 */
export const createPaymentIntent = async (
    params: CreatePaymentIntentParams
): Promise<{
    data: PaymentIntent | null;
    error: Error | null;
}> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { data: null, error: new StripeError('Not authenticated', 'auth_required') };
        }

        // Call Stripe API
        const result = await callStripeAPI('create-payment-intent', {
            amount: params.amount,
            currency: params.currency || 'EUR',
            payment_method_id: params.payment_method_id,
            metadata: {
                ...params.metadata,
                user_id: user.id,
                invoice_id: params.invoice_id
            }
        });

        // Store in database
        const { data, error } = await supabase
            .from('payment_intents')
            .insert({
                user_id: user.id,
                invoice_id: params.invoice_id,
                amount: params.amount,
                currency: params.currency || 'EUR',
                status: 'requires_payment_method',
                provider_payment_intent_id: result.paymentIntent.id,
                client_secret: result.paymentIntent.client_secret,
                payment_method_id: params.payment_method_id,
                metadata: params.metadata,
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
            })
            .select()
            .single();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * Confirm a payment intent
 */
export const confirmPaymentIntent = async (
    paymentIntentId: string,
    paymentMethodId?: string
): Promise<{
    data: Payment | null;
    error: Error | null;
}> => {
    try {
        const result = await callStripeAPI('confirm-payment-intent', {
            payment_intent_id: paymentIntentId,
            payment_method_id: paymentMethodId
        });

        // Update payment intent in DB
        const { data: intent } = await supabase
            .from('payment_intents')
            .update({
                status: result.paymentIntent.status,
                updated_at: new Date().toISOString()
            })
            .eq('provider_payment_intent_id', paymentIntentId)
            .select()
            .single();

        // If successful, create payment record
        if (result.paymentIntent.status === 'succeeded') {
            const { data: payment } = await supabase
                .from('payments')
                .insert({
                    user_id: intent!.user_id,
                    invoice_id: intent!.invoice_id,
                    amount: intent!.amount,
                    currency: intent!.currency,
                    status: 'completed',
                    payment_method_id: paymentMethodId,
                    provider: 'stripe',
                    provider_payment_intent_id: paymentIntentId,
                    provider_charge_id: result.paymentIntent.charges?.data?.[0]?.id,
                    receipt_url: result.paymentIntent.charges?.data?.[0]?.receipt_url,
                    completed_at: new Date().toISOString()
                })
                .select()
                .single();

            return { data: payment, error: null };
        }

        return { data: null, error: null };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * Get payment intent status
 */
export const getPaymentIntentStatus = async (
    providerPaymentIntentId: string
): Promise<{
    data: PaymentIntent | null;
    error: Error | null;
}> => {
    try {
        const { data, error } = await supabase
            .from('payment_intents')
            .select('*')
            .eq('provider_payment_intent_id', providerPaymentIntentId)
            .single();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

// ============================================
// PAYMENTS
// ============================================

/**
 * Get payments for current user
 */
export const getPayments = async (filters?: {
    status?: string;
    limit?: number;
    offset?: number;
}): Promise<{
    data: Payment[] | null;
    error: Error | null;
}> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { data: null, error: new StripeError('Not authenticated', 'auth_required') };
        }

        let query = supabase
            .from('payments')
            .select('*')
            .eq('user_id', user.id);

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }

        query = query.order('created_at', { ascending: false });

        if (filters?.limit) {
            query = query.limit(filters.limit);
        }
        if (filters?.offset) {
            query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
        }

        const { data, error } = await query;

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * Get payment by ID
 */
export const getPayment = async (paymentId: string): Promise<{
    data: Payment | null;
    error: Error | null;
}> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { data: null, error: new StripeError('Not authenticated', 'auth_required') };
        }

        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('id', paymentId)
            .eq('user_id', user.id)
            .single();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * Refund a payment
 */
export const refundPayment = async (
    paymentId: string,
    amount?: number,
    reason?: string
): Promise<{
    data: Payment | null;
    error: Error | null;
}> => {
    try {
        // Get original payment
        const { data: payment, error: fetchError } = await getPayment(paymentId);
        if (fetchError || !payment) {
            return { data: null, error: fetchError || 'Payment not found' };
        }

        // Call Stripe API
        await callStripeAPI('refund-payment', {
            charge_id: payment.provider_charge_id,
            amount: amount || payment.amount,
            reason: reason || 'requested_by_customer'
        });

        // Update payment record
        const refundAmount = amount || payment.amount;

        const { data: updated, error: updateError } = await supabase
            .from('payments')
            .update({
                status: refundAmount >= payment.amount ? 'refunded' : 'partially_refunded',
                refund_amount: payment.refund_amount + refundAmount,
                refund_reason: reason,
                refunded_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', paymentId)
            .select()
            .single();

        return { data: updated, error: updateError };
    } catch (error) {
        return { data: null, error };
    }
};

// ============================================
// SUBSCRIPTIONS
// ============================================

/**
 * Create a subscription
 */
export const createSubscription = async (
    params: CreateSubscriptionParams
): Promise<{
    data: Subscription | null;
    error: Error | null;
}> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { data: null, error: new StripeError('Not authenticated', 'auth_required') };
        }

        // Call Stripe API
        const result = await callStripeAPI('create-subscription', {
            price_id: params.price_id,
            payment_method_id: params.payment_method_id,
            trial_days: params.trial_days,
            metadata: {
                ...params.metadata,
                user_id: user.id,
                service_id: params.service_id,
                project_id: params.project_id
            }
        });

        // Store in database
        const subscription = result.subscription;

        // ✅ BUG FIX: Validate subscription.items.data has at least one item before accessing [0]
        if (!subscription.items.data || subscription.items.data.length === 0) {
            return {
                data: null,
                error: new Error('Subscription has no items')
            };
        }

        const firstItem = subscription.items.data[0];
        if (!firstItem?.price?.product || !firstItem?.price?.unit_amount || !firstItem?.price?.recurring) {
            return {
                data: null,
                error: new Error('Invalid subscription item data')
            };
        }

        const { data, error } = await supabase
            .from('subscriptions')
            .insert({
                user_id: user.id,
                project_id: params.project_id,
                service_id: params.service_id,
                status: subscription.status,
                provider: 'stripe',
                provider_subscription_id: subscription.id,
                provider_price_id: params.price_id,
                provider_product_id: firstItem.price.product,
                amount: firstItem.price.unit_amount / 100,
                currency: subscription.currency.toUpperCase(),
                interval: firstItem.price.recurring.interval,
                interval_count: firstItem.price.recurring.interval_count,
                trial_start: subscription.trial_start,
                trial_end: subscription.trial_end,
                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                metadata: params.metadata
            })
            .select()
            .single();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * Get subscriptions for current user
 */
export const getSubscriptions = async (filters?: {
    status?: string;
    service_id?: number;
}): Promise<{
    data: Subscription[] | null;
    error: Error | null;
}> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { data: null, error: new StripeError('Not authenticated', 'auth_required') };
        }

        let query = supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id);

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }
        if (filters?.service_id) {
            query = query.eq('service_id', filters.service_id);
        }

        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * Get subscription by ID
 */
export const getSubscription = async (subscriptionId: string): Promise<{
    data: Subscription | null;
    error: Error | null;
}> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { data: null, error: new StripeError('Not authenticated', 'auth_required') };
        }

        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('id', subscriptionId)
            .eq('user_id', user.id)
            .single();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * Cancel a subscription
 */
export const cancelSubscription = async (
    subscriptionId: string,
    cancelAtPeriodEnd: boolean = true
): Promise<{
    data: Subscription | null;
    error: Error | null;
}> => {
    try {
        // Get subscription
        const { data: subscription, error: fetchError } = await getSubscription(subscriptionId);
        if (fetchError || !subscription) {
            return { data: null, error: fetchError || 'Subscription not found' };
        }

        // Call Stripe API
        await callStripeAPI('cancel-subscription', {
            subscription_id: subscription.provider_subscription_id,
            cancel_at_period_end: cancelAtPeriodEnd
        });

        // Update in database
        const updates: Record<string, unknown> = {
            cancel_at_period_end: cancelAtPeriodEnd,
            updated_at: new Date().toISOString()
        };

        if (!cancelAtPeriodEnd) {
            updates.status = 'canceled';
            updates.canceled_at = new Date().toISOString();
        }

        const { data: updated, error: updateError } = await supabase
            .from('subscriptions')
            .update(updates)
            .eq('id', subscriptionId)
            .select()
            .single();

        return { data: updated, error: updateError };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * Update subscription payment method
 */
export const updateSubscriptionPaymentMethod = async (
    subscriptionId: string,
    paymentMethodId: string
): Promise<{
    success: boolean;
    error: Error | null;
}> => {
    try {
        const { data: subscription } = await getSubscription(subscriptionId);
        if (!subscription) {
            return { success: false, error: 'Subscription not found' };
        }

        // Call Stripe API
        await callStripeAPI('update-subscription-payment-method', {
            subscription_id: subscription.provider_subscription_id,
            payment_method_id: paymentMethodId
        });

        return { success: true, error: null };
    } catch (error) {
        return { success: false, error };
    }
};

// ============================================
// INVOICES
// ============================================

/**
 * Get invoices for current user
 */
export const getInvoices = async (filters?: {
    status?: string;
    limit?: number;
}): Promise<{
    data: Invoice[] | null;
    error: Error | null;
}> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { data: null, error: new StripeError('Not authenticated', 'auth_required') };
        }

        let query = supabase
            .from('invoices')
            .select('*')
            .eq('user_id', user.id);

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }

        query = query.order('created_at', { ascending: false });

        if (filters?.limit) {
            query = query.limit(filters.limit);
        }

        const { data, error } = await query;

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * Get invoice by ID
 */
export const getInvoice = async (invoiceId: string): Promise<{
    data: Invoice | null;
    error: Error | null;
}> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { data: null, error: new StripeError('Not authenticated', 'auth_required') };
        }

        const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('id', invoiceId)
            .eq('user_id', user.id)
            .single();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * Pay invoice with payment method
 */
export const payInvoice = async (
    invoiceId: string,
    paymentMethodId: string
): Promise<{
    data: Payment | null;
    error: Error | null;
}> => {
    try {
        // Get invoice
        const { data: invoice, error: invoiceError } = await getInvoice(invoiceId);
        if (invoiceError || !invoice) {
            return { data: null, error: invoiceError || 'Invoice not found' };
        }

        // Create payment intent
        const { data: intent, error: intentError } = await createPaymentIntent({
            amount: invoice.amount,
            currency: invoice.currency,
            invoice_id: invoiceId,
            payment_method_id: paymentMethodId,
            description: `Payment for invoice ${invoice.invoice_number}`
        });

        if (intentError || !intent) {
            return { data: null, error: intentError };
        }

        // Confirm payment
        const { data: payment, error: paymentError } = await confirmPaymentIntent(
            intent!.provider_payment_intent_id!,
            paymentMethodId
        );

        return { data: payment, error: paymentError };
    } catch (error) {
        return { data: null, error };
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

/**
 * Get card brand icon
 */
export const getCardBrandIcon = (brand: string): string => {
    const brandIcons: Record<string, string> = {
        visa: '💳 Visa',
        mastercard: '💳 Mastercard',
        amex: '💳 American Express',
        discover: '💳 Discover',
        'visa-electron': '💳 Visa Electron',
        maestro: '💳 Maestro'
    };

    return brandIcons[brand.toLowerCase()] || '💳 Karte';
};

/**
 * Calculate prorated amount for subscription upgrade/downgrade
 */
export const calculateProratedAmount = (
    currentAmount: number,
    newAmount: number,
    periodStart: string,
    periodEnd: string
): number => {
    const now = new Date();
    const start = new Date(periodStart);
    const end = new Date(periodEnd);

    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const proratedRatio = remainingDays / totalDays;

    return Math.round((newAmount - currentAmount) * proratedRatio * 100) / 100;
};

// ============================================
// EXPORTS
// ============================================

export default {
    // Payment Methods
    getPaymentMethods,
    getDefaultPaymentMethod,
    attachPaymentMethod,
    setDefaultPaymentMethod,
    detachPaymentMethod,

    // Payment Intents
    createPaymentIntent,
    confirmPaymentIntent,
    getPaymentIntentStatus,

    // Payments
    getPayments,
    getPayment,
    refundPayment,

    // Subscriptions
    createSubscription,
    getSubscriptions,
    getSubscription,
    cancelSubscription,
    updateSubscriptionPaymentMethod,

    // Invoices
    getInvoices,
    getInvoice,
    payInvoice,

    // Utils
    formatCurrency,
    formatDate,
    getCardBrandIcon,
    calculateProratedAmount,

    // Config
    isStripeConfigured,
    STRIPE_PUBLISHABLE_KEY
};
