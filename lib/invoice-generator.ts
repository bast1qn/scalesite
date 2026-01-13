/**
 * Invoice Generator Utilities
 *
 * Automated invoice generation for:
 * - One-time payments
 * - Subscription billing cycles
 * - Service purchases
 * - Manual invoice creation
 */

import { API } from './constants';

import { supabase } from './supabase';
import type { Invoice, PaymentMethod } from './stripe';

// ============================================
// TYPES
// ============================================

export interface InvoiceLineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface CreateInvoiceParams {
    userId: string;
    projectId?: string;
    subscriptionId?: string;
    description?: string;
    lineItems: Omit<InvoiceLineItem, 'id' | 'total'>[];
    discountCode?: string;
    taxRate?: number;
    currency?: string;
    dueDays?: number;
}

export interface InvoicePreview {
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    total: number;
}

// ============================================
// INVOICE GENERATOR
// ============================================

/**
 * Generate invoice number
 */
export async function generateInvoiceNumber(): Promise<string> {
    // Call Supabase function to get next invoice number
    const { data, error } = await supabase.rpc('get_next_invoice_number');

    if (error || !data) {
        // Fallback: generate timestamp-based number
        return `INV-${Date.now()}`;
    }

    return data as string;
}

/**
 * Calculate invoice totals
 */
export function calculateInvoiceTotals(
    lineItems: Omit<InvoiceLineItem, 'id' | 'total'>[],
    discountRate: number = 0,
    taxRate: number = 19
): InvoicePreview {
    // Calculate subtotal
    const subtotal = lineItems.reduce((sum, item) => {
        return sum + (item.unitPrice * item.quantity);
    }, 0);

    // Calculate discount
    const discountAmount = subtotal * (discountRate / 100);

    // Calculate tax on discounted amount
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (taxRate / 100);

    // Calculate total
    const total = taxableAmount + taxAmount;

    return {
        subtotal: Math.round(subtotal * 100) / 100,
        discountAmount: Math.round(discountAmount * 100) / 100,
        taxAmount: Math.round(taxAmount * 100) / 100,
        total: Math.round(total * 100) / 100
    };
}

/**
 * Get discount by code
 */
export async function getDiscountByCode(code: string): Promise<{
    data: { id: string; type: string; value: number } | null;
    error: any;
}> {
    try {
        const { data, error } = await supabase
            .from('discounts')
            .select('id, type, value')
            .eq('code', code.toUpperCase())
            .single();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

/**
 * Create invoice
 */
export async function createInvoice(params: CreateInvoiceParams): Promise<{
    data: Invoice | null;
    error: any;
}> {
    try {
        // Get discount if code provided
        let discountRate = 0;
        let discountId = null;

        if (params.discountCode) {
            const { data: discount, error: discountError } = await getDiscountByCode(params.discountCode);

            if (!discountError && discount) {
                discountId = discount.id;
                discountRate = discount.value;

                // Increment discount usage
                await supabase
                    .from('discounts')
                    .update({ used_count: supabase.raw('used_count + 1') })
                    .eq('id', discount.id);
            }
        }

        // Calculate totals
        const totals = calculateInvoiceTotals(
            params.lineItems,
            discountRate,
            params.taxRate
        );

        // Generate invoice number
        const invoiceNumber = await generateInvoiceNumber();

        // Calculate dates
        const now = new Date();
        const issueDate = now.toISOString();
        const MS_PER_DAY = 24 * 60 * 60 * 1000;
        const dueDate = new Date(now.getTime() + (params.dueDays || API.invoiceDueDays) * MS_PER_DAY).toISOString();

        // Build line items with IDs and totals
        const lineItems: InvoiceLineItem[] = params.lineItems.map((item, index) => ({
            id: `line-${Date.now()}-${index}`,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.unitPrice * item.quantity
        }));

        // Create invoice
        const { data, error } = await supabase
            .from('invoices')
            .insert({
                user_id: params.userId,
                project_id: params.projectId,
                subscription_id: params.subscriptionId,
                invoice_number: invoiceNumber,
                amount: totals.total,
                currency: params.currency || 'EUR',
                status: 'draft',
                issue_date: issueDate,
                due_date: dueDate,
                line_items: lineItems,
                discount_code: params.discountCode,
                discount_amount: totals.discountAmount,
                tax_amount: totals.taxAmount,
                description: params.description
            })
            .select()
            .single();

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

/**
 * Create invoice from subscription
 */
export async function createSubscriptionInvoice(
    subscriptionId: string,
    amount: number,
    currency: string = 'EUR',
    description?: string
): Promise<{
    data: Invoice | null;
    error: any;
}> {
    try {
        // Get subscription details
        const { data: subscription, error: subError } = await supabase
            .from('subscriptions')
            .select('*, user_id, service_id, project_id')
            .eq('id', subscriptionId)
            .single();

        if (subError || !subscription) {
            return { data: null, error: subError || 'Subscription not found' };
        }

        // Get service details if available
        let serviceDescription = 'Abonnement';
        if (subscription.service_id) {
            const { data: service } = await supabase
                .from('services')
                .select('name, name_en')
                .eq('id', subscription.service_id)
                .single();

            if (service) {
                serviceDescription = service.name_en || service.name;
            }
        }

        // Create line item
        const intervalLabel = subscription.interval === 'month' ? 'Monat' : 'Jahr';

        const lineItems = [{
            description: description || `${serviceDescription} (${intervalLabel})`,
            quantity: 1,
            unitPrice: amount
        }];

        // Create invoice
        return await createInvoice({
            userId: subscription.user_id,
            projectId: subscription.project_id,
            subscriptionId: subscription.id,
            description: description || `Abonnement: ${serviceDescription}`,
            lineItems,
            currency
        });
    } catch (error) {
        return { data: null, error };
    }
}

/**
 * Create invoice from service purchase
 */
export async function createServiceInvoice(
    userId: string,
    serviceId: number,
    projectId: string
): Promise<{
    data: Invoice | null;
    error: any;
}> {
    try {
        // Get service details
        const { data: service, error: serviceError } = await supabase
            .from('services')
            .select('*')
            .eq('id', serviceId)
            .single();

        if (serviceError || !service) {
            return { data: null, error: serviceError || 'Service not found' };
        }

        // Use sale price if available, otherwise regular price
        const price = service.sale_price || service.price;

        // Create line item
        const lineItems = [{
            description: service.name_en || service.name,
            quantity: 1,
            unitPrice: price
        }];

        // Create invoice
        return await createInvoice({
            userId,
            projectId,
            description: `Service: ${service.name_en || service.name}`,
            lineItems,
            currency: 'EUR',
            dueDays: 7 // One-time payments due in 7 days
        });
    } catch (error) {
        return { data: null, error };
    }
}

/**
 * Update invoice status
 */
export async function updateInvoiceStatus(
    invoiceId: string,
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled',
    metadata?: {
        paidAt?: string;
        paymentMethod?: string;
        paymentId?: string;
    }
): Promise<{
    success: boolean;
    error: any;
}> {
    try {
        const updateData: any = {
            status,
            updated_at: new Date().toISOString()
        };

        if (metadata) {
            if (metadata.paidAt) updateData.paid_at = metadata.paidAt;
            if (metadata.paymentMethod) updateData.payment_method = metadata.paymentMethod;
            if (metadata.paymentId) updateData.payment_id = metadata.paymentId;
        }

        const { error } = await supabase
            .from('invoices')
            .update(updateData)
            .eq('id', invoiceId);

        return { success: !error, error };
    } catch (error) {
        return { success: false, error };
    }
}

/**
 * Mark invoice as sent
 */
export async function markInvoiceAsSent(invoiceId: string): Promise<{
    success: boolean;
    error: any;
}> {
    return await updateInvoiceStatus(invoiceId, 'sent');
}

/**
 * Void invoice
 */
export async function voidInvoice(invoiceId: string, reason?: string): Promise<{
    success: boolean;
    error: any;
}> {
    try {
        const { error } = await supabase
            .from('invoices')
            .update({
                status: 'cancelled',
                voided: true,
                voided_at: new Date().toISOString(),
                cancellation_reason: reason,
                updated_at: new Date().toISOString()
            })
            .eq('id', invoiceId);

        return { success: !error, error };
    } catch (error) {
        return { success: false, error };
    }
}

/**
 * Get overdue invoices
 */
export async function getOverdueInvoices(): Promise<{
    data: Invoice[] | null;
    error: any;
}> {
    try {
        const now = new Date().toISOString();

        const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .lt('due_date', now)
            .in('status', ['sent', 'overdue'])
            .order('due_date', { ascending: true });

        // Update status to overdue
        if (data && data.length > 0) {
            await supabase
                .from('invoices')
                .update({ status: 'overdue' })
                .in('id', data.map(inv => inv.id));
        }

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

/**
 * Send invoice reminder
 */
export async function sendInvoiceReminder(invoiceId: string): Promise<{
    success: boolean;
    error: any;
}> {
    try {
        // Get invoice with user details
        const { data: invoice, error: invError } = await supabase
            .from('invoices')
            .select('*, profiles(email, name)')
            .eq('id', invoiceId)
            .single();

        if (invError || !invoice) {
            return { success: false, error: invError || 'Invoice not found' };
        }

        // TODO: Implement email sending via Supabase Edge Function or email service
        // For now, just create a notification

        const { error: notifError } = await supabase
            .from('notifications')
            .insert({
                id: crypto.randomUUID(),
                user_id: invoice.user_id,
                type: 'invoice_reminder',
                title: 'Erinnerung: Rechnung fällig',
                message: `Ihre Rechnung ${invoice.invoice_number} über ${invoice.amount} ${invoice.currency} ist fällig.`,
                link: `/billing?invoice=${invoice.id}`,
                related_entity_type: 'invoice',
                related_entity_id: invoice.id
            });

        return { success: !notifError, error: notifError };
    } catch (error) {
        return { success: false, error };
    }
}

/**
 * Generate invoice preview without saving
 */
export function generateInvoicePreview(
    lineItems: Omit<InvoiceLineItem, 'id' | 'total'>[],
    discountCode?: string,
    discountValue?: number,
    taxRate: number = 19
): InvoicePreview {
    const discountRate = discountValue || 0;
    return calculateInvoiceTotals(lineItems, discountRate, taxRate);
}

/**
 * Bulk invoice generation (for billing cycles)
 */
export async function generateBulkInvoices(subscriptionIds: string[]): Promise<{
    success: number;
    failed: number;
    errors: any[];
}> {
    let success = 0;
    let failed = 0;
    const errors: any[] = [];

    for (const subscriptionId of subscriptionIds) {
        try {
            // Get subscription details
            const { data: subscription } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('id', subscriptionId)
                .eq('status', 'active')
                .single();

            if (!subscription) {
                failed++;
                continue;
            }

            // Create invoice
            const { error } = await createSubscriptionInvoice(
                subscriptionId,
                subscription.amount,
                subscription.currency
            );

            if (error) {
                failed++;
                errors.push({ subscriptionId, error: error.message });
            } else {
                success++;
            }
        } catch (error: any) {
            failed++;
            errors.push({ subscriptionId, error: error.message });
        }
    }

    return { success, failed, errors };
}

// ============================================
// EXPORTS
// ============================================

export default {
    generateInvoiceNumber,
    calculateInvoiceTotals,
    getDiscountByCode,
    createInvoice,
    createSubscriptionInvoice,
    createServiceInvoice,
    updateInvoiceStatus,
    markInvoiceAsSent,
    voidInvoice,
    getOverdueInvoices,
    sendInvoiceReminder,
    generateInvoicePreview,
    generateBulkInvoices
};
