/**
 * Stripe Webhook Handler
 *
 * Supabase Edge Function that handles Stripe webhook events
 *
 * Webhook events handled:
 * - payment_intent.succeeded
 * - payment_intent.payment_failed
 * - invoice.paid
 * - invoice.payment_failed
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.created
 * - payment_method.attached
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0';

// Configuration
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') || '';
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Initialize Supabase client with service role key (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Initialize Stripe
const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient()
});

// Helper: Verify Stripe webhook signature
async function verifyWebhookSignature(
    body: string,
    signature: string
): Promise<boolean> {
    try {
        await stripe.webhooks.constructEventAsync(
            body,
            signature,
            STRIPE_WEBHOOK_SECRET
        );
        return true;
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return false;
    }
}

// Helper: Log webhook event to database
async function logWebhookEvent(
    eventType: string,
    eventId: string,
    payload: any
): Promise<void> {
    try {
        await supabase.from('webhook_events').insert({
            provider: 'stripe',
            event_type: eventType,
            event_id: eventId,
            payload: payload,
            processed: false
        });
    } catch (error) {
        console.error('Error logging webhook event:', error);
    }
}

// Helper: Mark webhook event as processed
async function markWebhookEventProcessed(eventId: string): Promise<void> {
    try {
        await supabase
            .from('webhook_events')
            .update({ processed: true, processed_at: new Date().toISOString() })
            .eq('event_id', eventId);
    } catch (error) {
        console.error('Error marking webhook event as processed:', error);
    }
}

// Handler: Payment Intent Succeeded
async function handlePaymentIntentSucceeded(paymentIntent: any): Promise<void> {
    const { data: paymentIntentData } = await supabase
        .from('payment_intents')
        .select('id, user_id, invoice_id')
        .eq('provider_payment_intent_id', paymentIntent.id)
        .single();

    if (!paymentIntentData) {
        console.error('Payment intent not found in database:', paymentIntent.id);
        return;
    }

    // Create payment record
    const charge = paymentIntent.charges?.data?.[0];

    await supabase.from('payments').insert({
        id: crypto.randomUUID(),
        user_id: paymentIntentData.user_id,
        invoice_id: paymentIntentData.invoice_id,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency.toUpperCase(),
        status: 'completed',
        payment_method_id: paymentIntent.payment_method,
        provider: 'stripe',
        provider_payment_intent_id: paymentIntent.id,
        provider_charge_id: charge?.id,
        receipt_url: charge?.receipt_url,
        metadata: paymentIntent.metadata,
        completed_at: new Date(paymentIntent.created * 1000).toISOString()
    });

    // Update payment intent status
    await supabase
        .from('payment_intents')
        .update({ status: paymentIntent.status })
        .eq('provider_payment_intent_id', paymentIntent.id);

    // Update invoice status if linked
    if (paymentIntentData.invoice_id) {
        await supabase
            .from('invoices')
            .update({
                status: 'paid',
                paid_at: new Date().toISOString(),
                payment_method: 'stripe',
                payment_id: paymentIntent.id,
                stripe_invoice_id: paymentIntent.invoice,
                payment_attempts: supabase.raw('payment_attempts + 1'),
                updated_at: new Date().toISOString()
            })
            .eq('id', paymentIntentData.invoice_id);
    }
}

// Handler: Payment Intent Failed
async function handlePaymentIntentFailed(paymentIntent: any): Promise<void> {
    const { data: paymentIntentData } = await supabase
        .from('payment_intents')
        .select('id, user_id, invoice_id')
        .eq('provider_payment_intent_id', paymentIntent.id)
        .single();

    if (!paymentIntentData) {
        console.error('Payment intent not found in database:', paymentIntent.id);
        return;
    }

    // Create failed payment record
    await supabase.from('payments').insert({
        id: crypto.randomUUID(),
        user_id: paymentIntentData.user_id,
        invoice_id: paymentIntentData.invoice_id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        status: 'failed',
        provider: 'stripe',
        provider_payment_intent_id: paymentIntent.id,
        failure_reason: paymentIntent.last_payment_error?.message || 'Payment failed',
        metadata: paymentIntent.metadata
    });

    // Update payment intent status
    await supabase
        .from('payment_intents')
        .update({ status: paymentIntent.status })
        .eq('provider_payment_intent_id', paymentIntent.id);

    // Update invoice if linked
    if (paymentIntentData.invoice_id) {
        await supabase
            .from('invoices')
            .update({
                payment_attempts: supabase.raw('payment_attempts + 1'),
                last_payment_attempt_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', paymentIntentData.invoice_id);
    }
}

// Handler: Invoice Paid
async function handleInvoicePaid(invoice: any): Promise<void> {
    // Find subscription by Stripe subscription ID
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('id, user_id')
        .eq('provider_subscription_id', invoice.subscription)
        .single();

    if (!subscription) {
        console.error('Subscription not found for invoice:', invoice.subscription);
        return;
    }

    // Update invoice in database
    await supabase
        .from('invoices')
        .update({
            status: 'paid',
            paid_at: new Date(invoice.status_transitions.paid_at * 1000).toISOString(),
            stripe_invoice_id: invoice.id,
            stripe_hosted_invoice_url: invoice.hosted_invoice_url,
            invoice_pdf_url: invoice.invoice_pdf,
            updated_at: new Date().toISOString()
        })
        .eq('stripe_invoice_id', invoice.id);

    // Create payment record
    const charge = invoice.charge?.toString();

    await supabase.from('payments').insert({
        id: crypto.randomUUID(),
        user_id: subscription.user_id,
        invoice_id: invoice.id,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency.toUpperCase(),
        status: 'completed',
        provider: 'stripe',
        provider_charge_id: charge,
        receipt_url: invoice.hosted_invoice_url,
        metadata: { subscription: invoice.subscription }
    });
}

// Handler: Invoice Payment Failed
async function handleInvoicePaymentFailed(invoice: any): Promise<void> {
    // Find subscription
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('id, user_id')
        .eq('provider_subscription_id', invoice.subscription)
        .single();

    if (!subscription) {
        console.error('Subscription not found for invoice:', invoice.subscription);
        return;
    }

    // Create failed payment record
    await supabase.from('payments').insert({
        id: crypto.randomUUID(),
        user_id: subscription.user_id,
        amount: invoice.amount_due / 100,
        currency: invoice.currency.toUpperCase(),
        status: 'failed',
        provider: 'stripe',
        description: `Invoice payment failed: ${invoice.id}`,
        metadata: { subscription: invoice.subscription, invoice: invoice.id }
    });
}

// Handler: Subscription Created
async function handleSubscriptionCreated(subscription: any): Promise<void> {
    // Get customer metadata to find user
    const customer = await stripe.customers.retrieve(subscription.customer as string);

    if (!customer || customer.deleted) {
        console.error('Customer not found:', subscription.customer);
        return;
    }

    const userId = (customer as any).metadata?.user_id;
    if (!userId) {
        console.error('User ID not found in customer metadata');
        return;
    }

    const item = subscription.items.data[0];
    const price = item.price;

    // Check if subscription already exists
    const { data: existing } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('provider_subscription_id', subscription.id)
        .single();

    if (existing) {
        console.log('Subscription already exists, skipping creation');
        return;
    }

    // Create subscription in database
    await supabase.from('subscriptions').insert({
        id: crypto.randomUUID(),
        user_id: userId,
        status: subscription.status,
        provider: 'stripe',
        provider_subscription_id: subscription.id,
        provider_price_id: price.id,
        provider_product_id: price.product as string,
        amount: price.unit_amount / 100,
        currency: subscription.currency.toUpperCase(),
        interval: price.recurring.interval,
        interval_count: price.recurring.interval_count,
        trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        metadata: subscription.metadata
    });
}

// Handler: Subscription Updated
async function handleSubscriptionUpdated(subscription: any): Promise<void> {
    const { data: existing } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('provider_subscription_id', subscription.id)
        .single();

    if (!existing) {
        console.error('Subscription not found in database:', subscription.id);
        return;
    }

    // Update subscription
    await supabase
        .from('subscriptions')
        .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
            updated_at: new Date().toISOString()
        })
        .eq('provider_subscription_id', subscription.id);
}

// Handler: Subscription Deleted
async function handleSubscriptionDeleted(subscription: any): Promise<void> {
    await supabase
        .from('subscriptions')
        .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('provider_subscription_id', subscription.id);
}

// Handler: Invoice Created
async function handleInvoiceCreated(invoice: any): Promise<void> {
    // Only process invoices for subscriptions
    if (!invoice.subscription) return;

    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('id, user_id')
        .eq('provider_subscription_id', invoice.subscription)
        .single();

    if (!subscription) {
        console.error('Subscription not found for invoice:', invoice.subscription);
        return;
    }

    // Check if invoice already exists
    const { data: existing } = await supabase
        .from('invoices')
        .select('id')
        .eq('stripe_invoice_id', invoice.id)
        .single();

    if (existing) {
        console.log('Invoice already exists, skipping creation');
        return;
    }

    // Get next invoice number
    const { data: invoiceNumberResult } = await supabase
        .rpc('get_next_invoice_number');

    // Create invoice in database
    await supabase.from('invoices').insert({
        id: crypto.randomUUID(),
        user_id: subscription.user_id,
        invoice_number: invoiceNumberResult || `INV-${invoice.number}`,
        amount: invoice.total / 100,
        currency: invoice.currency.toUpperCase(),
        status: invoice.status === 'paid' ? 'paid' : 'sent',
        issue_date: new Date(invoice.created * 1000).toISOString(),
        due_date: new Date(invoice.due_date * 1000).toISOString(),
        subscription_id: subscription.id,
        stripe_invoice_id: invoice.id,
        stripe_hosted_invoice_url: invoice.hosted_invoice_url,
        invoice_pdf_url: invoice.invoice_pdf,
        line_items: invoice.lines.data.map((line: any) => ({
            id: line.id,
            description: line.description,
            quantity: line.quantity || 1,
            unitPrice: line.price?.unit_amount ? line.price.unit_amount / 100 : 0,
            total: line.amount / 100
        })),
        tax_amount: invoice.tax / 100,
        discount_amount: (invoice.total_discount_amounts?.[0]?.amount || 0) / 100
    });
}

// Handler: Payment Method Attached
async function handlePaymentMethodAttached(paymentMethod: any): Promise<void> {
    // Get customer to find user
    const customer = await stripe.customers.retrieve(paymentMethod.customer as string);

    if (!customer || customer.deleted) {
        console.error('Customer not found:', paymentMethod.customer);
        return;
    }

    const userId = (customer as any).metadata?.user_id;
    if (!userId) {
        console.error('User ID not found in customer metadata');
        return;
    }

    // Check if payment method already exists
    const { data: existing } = await supabase
        .from('payment_methods')
        .select('id')
        .eq('provider_payment_method_id', paymentMethod.id)
        .single();

    if (existing) {
        console.log('Payment method already exists, skipping creation');
        return;
    }

    // Determine payment method type
    let type = 'other';
    let cardLast4: string | undefined;
    let cardBrand: string | undefined;
    let cardExpMonth: number | undefined;
    let cardExpYear: number | undefined;
    let sepaMandateReference: string | undefined;
    let sepaMandateUrl: string | undefined;

    if (paymentMethod.type === 'card') {
        type = 'card';
        cardLast4 = paymentMethod.card.last4;
        cardBrand = paymentMethod.card.brand;
        cardExpMonth = paymentMethod.card.exp_month;
        cardExpYear = paymentMethod.card.exp_year;
    } else if (paymentMethod.type === 'sepa_debit') {
        type = 'sepa_debit';
        sepaMandateReference = paymentMethod.sepa_debit.mandate_reference;
        sepaMandateUrl = paymentMethod.sepa_debit.mandate_url;
    }

    // Create payment method in database
    await supabase.from('payment_methods').insert({
        id: crypto.randomUUID(),
        user_id: userId,
        type: type as any,
        provider: 'stripe',
        provider_payment_method_id: paymentMethod.id,
        is_default: false,
        card_last4: cardLast4,
        card_brand: cardBrand,
        card_exp_month: cardExpMonth,
        card_exp_year: cardExpYear,
        sepa_mandate_reference: sepaMandateReference,
        sepa_mandate_url: sepaMandateUrl,
        billing_name: paymentMethod.billing_details?.name,
        billing_email: paymentMethod.billing_details?.email,
        metadata: paymentMethod.metadata
    });
}

// Main handler
serve(async (req) => {
    // Only accept POST requests
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        // Get signature from headers
        const signature = req.headers.get('stripe-signature');
        if (!signature) {
            return new Response('No signature provided', { status: 400 });
        }

        // Get raw body
        const body = await req.text();

        // Verify webhook signature
        const isValid = await verifyWebhookSignature(body, signature);
        if (!isValid) {
            return new Response('Invalid signature', { status: 401 });
        }

        // Parse event
        const event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            STRIPE_WEBHOOK_SECRET
        );

        // Log webhook event
        await logWebhookEvent(event.type, event.id, event.data);

        // Handle different event types
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentIntentSucceeded(event.data.object);
                break;

            case 'payment_intent.payment_failed':
                await handlePaymentIntentFailed(event.data.object);
                break;

            case 'invoice.paid':
                await handleInvoicePaid(event.data.object);
                break;

            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(event.data.object);
                break;

            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object);
                break;

            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;

            case 'invoice.created':
                await handleInvoiceCreated(event.data.object);
                break;

            case 'payment_method.attached':
                await handlePaymentMethodAttached(event.data.object);
                break;

            default:
                console.log('Unhandled event type:', event.type);
        }

        // Mark webhook event as processed
        await markWebhookEventProcessed(event.id);

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Webhook handler error:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
});
