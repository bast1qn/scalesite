-- ============================================
-- WOCHE 18: Billing & Invoice Management - Payment Integration
-- ============================================
-- Führe dieses SQL im Supabase SQL Editor aus
-- Erweitert das bestehende Schema um Payment-Funktionalität

-- ============================================
-- PAYMENT METHODS
-- Speichert Zahlungsmethoden der Benutzer (Kreditkarten, SEPA, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS payment_methods (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'card', 'sepa_debit', 'paypal', etc.
    provider TEXT DEFAULT 'stripe', -- 'stripe', 'paypal', 'bank_transfer'
    provider_payment_method_id TEXT UNIQUE, -- Stripe PaymentMethod ID
    is_default BOOLEAN DEFAULT FALSE,
    card_last4 TEXT,
    card_brand TEXT, -- 'visa', 'mastercard', etc.
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    sepa_mandate_reference TEXT,
    sepa_mandate_url TEXT,
    paypal_email TEXT,
    billing_name TEXT,
    billing_email TEXT,
    metadata JSONB DEFAULT '{}',
    status TEXT DEFAULT 'active', -- 'active', 'inactive', 'expired'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PAYMENTS
-- Einzelne Zahlungen und Transaktionen
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    invoice_id TEXT REFERENCES invoices(id),
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'
    payment_method_id TEXT REFERENCES payment_methods(id),
    provider TEXT DEFAULT 'stripe',
    provider_payment_intent_id TEXT UNIQUE, -- Stripe PaymentIntent ID
    provider_charge_id TEXT, -- Stripe Charge ID
    description TEXT,
    failure_reason TEXT,
    receipt_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    refund_amount REAL DEFAULT 0,
    refund_reason TEXT
);

-- ============================================
-- SUBSCRIPTIONS
-- Wiederkehrende Abonnements (z.B. Hosting)
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id TEXT REFERENCES projects(id),
    service_id INTEGER REFERENCES services(id),
    status TEXT DEFAULT 'active', -- 'active', 'past_due', 'canceled', 'unpaid', 'trialing'
    provider TEXT DEFAULT 'stripe',
    provider_subscription_id TEXT UNIQUE, -- Stripe Subscription ID
    provider_price_id TEXT, -- Stripe Price ID
    provider_product_id TEXT, -- Stripe Product ID

    -- Pricing
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'EUR',
    interval TEXT NOT NULL, -- 'month', 'year'
    interval_count INTEGER DEFAULT 1,

    -- Trial
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,

    -- Dates
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMPTZ,

    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SUBSCRIPTION ITEMS
-- Einzelne Positionen innerhalb eines Abonnements
-- ============================================
CREATE TABLE IF NOT EXISTS subscription_items (
    id TEXT PRIMARY KEY,
    subscription_id TEXT NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    provider_subscription_item_id TEXT UNIQUE, -- Stripe SubscriptionItem ID
    provider_price_id TEXT,
    quantity INTEGER DEFAULT 1,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PAYMENT INTENTS
-- Temporäre Payment Intents für Checkout-Prozess
-- ============================================
CREATE TABLE IF NOT EXISTS payment_intents (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    invoice_id TEXT REFERENCES invoices(id),
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'requires_payment_method',
    provider_payment_intent_id TEXT UNIQUE,
    client_secret TEXT, -- Stripe Client Secret für Frontend
    payment_method_id TEXT REFERENCES payment_methods(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ
);

-- ============================================
-- WEBHOOK EVENTS
-- Log aller eingehenden Webhook-Events
-- ============================================
CREATE TABLE IF NOT EXISTS webhook_events (
    id TEXT PRIMARY KEY,
    provider TEXT DEFAULT 'stripe',
    event_type TEXT NOT NULL, -- z.B. 'payment_intent.succeeded'
    event_id TEXT UNIQUE, -- Stripe Event ID
    processed BOOLEAN DEFAULT FALSE,
    processing_error TEXT,
    payload JSONB NOT NULL,
    received_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMPTZ
);

-- ============================================
-- INVOICES (Erweiterungen)
-- ============================================

-- Füge neue Spalten zur invoices Tabelle hinzu
ALTER TABLE invoices
    ADD COLUMN IF NOT EXISTS subscription_id TEXT REFERENCES subscriptions(id),
    ADD COLUMN IF NOT EXISTS stripe_invoice_id TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS stripe_hosted_invoice_url TEXT,
    ADD COLUMN IF NOT EXISTS invoice_pdf_url TEXT,
    ADD COLUMN IF NOT EXISTS paid_via TEXT, -- 'stripe', 'paypal', 'bank_transfer', 'other'
    ADD COLUMN IF NOT EXISTS payment_attempts INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS last_payment_attempt_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
    ADD COLUMN IF NOT EXISTS voided BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS voided_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS notes TEXT;

-- ============================================
-- INDEXES für Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_default ON payment_methods(is_default);
CREATE INDEX IF NOT EXISTS idx_payment_methods_status ON payment_methods(status);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_provider_payment_intent_id ON payments(provider_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider_subscription_id ON subscriptions(provider_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_project_id ON subscriptions(project_id);

CREATE INDEX IF NOT EXISTS idx_subscription_items_subscription_id ON subscription_items(subscription_id);

CREATE INDEX IF NOT EXISTS idx_payment_intents_user_id ON payment_intents(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_invoice_id ON payment_intents(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_status ON payment_intents(status);

CREATE INDEX IF NOT EXISTS idx_webhook_events_provider ON webhook_events(provider);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id);

CREATE INDEX IF NOT EXISTS idx_invoices_subscription_id ON invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe_invoice_id ON invoices(stripe_invoice_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Payment Methods
DROP POLICY IF EXISTS "Users can view own payment methods" ON payment_methods;
CREATE POLICY "Users can view own payment methods" ON payment_methods
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own payment methods" ON payment_methods;
CREATE POLICY "Users can insert own payment methods" ON payment_methods
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own payment methods" ON payment_methods;
CREATE POLICY "Users can update own payment methods" ON payment_methods
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own payment methods" ON payment_methods;
CREATE POLICY "Users can delete own payment methods" ON payment_methods
    FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Team can view all payment methods" ON payment_methods;
CREATE POLICY "Team can view all payment methods" ON payment_methods
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Payments
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own payments" ON payments;
CREATE POLICY "Users can insert own payments" ON payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own payments" ON payments;
CREATE POLICY "Users can update own payments" ON payments
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Team can view all payments" ON payments;
CREATE POLICY "Team can view all payments" ON payments
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can update all payments" ON payments;
CREATE POLICY "Team can update all payments" ON payments
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own subscriptions" ON subscriptions;
CREATE POLICY "Users can insert own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
CREATE POLICY "Users can update own subscriptions" ON subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Team can view all subscriptions" ON subscriptions;
CREATE POLICY "Team can view all subscriptions" ON subscriptions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can manage all subscriptions" ON subscriptions;
CREATE POLICY "Team can manage all subscriptions" ON subscriptions
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Subscription Items (geht über subscriptions)
DROP POLICY IF EXISTS "Users can view own subscription items" ON subscription_items;
CREATE POLICY "Users can view own subscription items" ON subscription_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM subscriptions s
            WHERE s.id = subscription_items.subscription_id
            AND s.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Team can view all subscription items" ON subscription_items;
CREATE POLICY "Team can view all subscription items" ON subscription_items
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Payment Intents
DROP POLICY IF EXISTS "Users can view own payment intents" ON payment_intents;
CREATE POLICY "Users can view own payment intents" ON payment_intents
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own payment intents" ON payment_intents;
CREATE POLICY "Users can insert own payment intents" ON payment_intents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own payment intents" ON payment_intents;
CREATE POLICY "Users can update own payment intents" ON payment_intents
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Team can view all payment intents" ON payment_intents;
CREATE POLICY "Team can view all payment intents" ON payment_intents
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Webhook Events (nur Team/Server)
DROP POLICY IF EXISTS "Team can view webhook events" ON webhook_events;
CREATE POLICY "Team can view webhook events" ON webhook_events
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can insert webhook events" ON webhook_events;
CREATE POLICY "Team can insert webhook events" ON webhook_events
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can update webhook events" ON webhook_events;
CREATE POLICY "Team can update webhook events" ON webhook_events
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function: Ensure only one default payment method per user
CREATE OR REPLACE FUNCTION ensure_single_default_payment_method()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default = TRUE THEN
        UPDATE payment_methods
        SET is_default = FALSE
        WHERE user_id = NEW.user_id
        AND id != NEW.id
        AND is_default = TRUE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for default payment method
DROP TRIGGER IF EXISTS trigger_ensure_single_default_payment_method ON payment_methods;
CREATE TRIGGER trigger_ensure_single_default_payment_method
    BEFORE INSERT OR UPDATE OF is_default ON payment_methods
    FOR EACH ROW
    WHEN (NEW.is_default = TRUE)
    EXECUTE FUNCTION ensure_single_default_payment_method();

-- Function: Update invoice status based on payment
CREATE OR REPLACE FUNCTION update_invoice_status_on_payment()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND NEW.invoice_id IS NOT NULL THEN
        UPDATE invoices
        SET
            status = 'paid',
            paid_at = NEW.completed_at,
            payment_method = NEW.provider,
            payment_id = NEW.id,
            payment_attempts = payment_attempts + 1,
            last_payment_attempt_at = NEW.created_at,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.invoice_id;
    END IF;

    IF NEW.status = 'failed' AND NEW.invoice_id IS NOT NULL THEN
        UPDATE invoices
        SET
            payment_attempts = payment_attempts + 1,
            last_payment_attempt_at = NEW.created_at,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.invoice_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for invoice status update
DROP TRIGGER IF EXISTS trigger_update_invoice_status_on_payment ON payments;
CREATE TRIGGER trigger_update_invoice_status_on_payment
    AFTER INSERT OR UPDATE OF status, completed_at ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_invoice_status_on_payment();

-- Function: Update subscription status
CREATE OR REPLACE FUNCTION update_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;

    -- Auto-cancel if past due for too long (optional logic)
    IF NEW.status = 'past_due' AND NEW.current_period_end < CURRENT_TIMESTAMP - INTERVAL '7 days' THEN
        NEW.status = 'canceled';
        NEW.canceled_at = CURRENT_TIMESTAMP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for subscription status
DROP TRIGGER IF EXISTS trigger_update_subscription_status ON subscriptions;
CREATE TRIGGER trigger_update_subscription_status
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_subscription_status();

-- Function: Auto-create default payment method if first one
CREATE OR REPLACE FUNCTION auto_set_first_payment_method_as_default()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if this is the first payment method for this user
    IF NOT EXISTS (
        SELECT 1 FROM payment_methods
        WHERE user_id = NEW.user_id
        AND id != NEW.id
    ) THEN
        NEW.is_default = TRUE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-default payment method
DROP TRIGGER IF EXISTS trigger_auto_set_first_payment_method_as_default ON payment_methods;
CREATE TRIGGER trigger_auto_set_first_payment_method_as_default
    BEFORE INSERT ON payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION auto_set_first_payment_method_as_default();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function: Get next invoice number
CREATE OR REPLACE FUNCTION get_next_invoice_number()
RETURNS TEXT AS $$
DECLARE
    last_number TEXT;
    next_number INTEGER;
BEGIN
    -- Get last invoice number
    SELECT invoice_number INTO last_number
    FROM invoices
    WHERE invoice_number ~ '^INV-[0-9]+$'
    ORDER BY invoice_number DESC
    LIMIT 1;

    IF last_number IS NULL THEN
        next_number := 1001;
    ELSE
        next_number := CAST(SUBSTRING(last_number FROM 5) AS INTEGER) + 1;
    END IF;

    RETURN 'INV-' || next_number;
END;
$$ LANGUAGE plpgsql;

-- Function: Get user's active subscription for a service
CREATE OR REPLACE FUNCTION get_user_active_subscription(
    p_user_id UUID,
    p_service_id INTEGER
)
RETURNS TABLE (
    id TEXT,
    status TEXT,
    amount REAL,
    current_period_end TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT s.id, s.status, s.amount, s.current_period_end
    FROM subscriptions s
    WHERE s.user_id = p_user_id
    AND s.service_id = p_service_id
    AND s.status IN ('active', 'trialing')
    ORDER BY s.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VIEWS für Reporting
-- ============================================

-- View: Billing Dashboard Summary
CREATE OR REPLACE VIEW billing_dashboard_summary AS
SELECT
    p.id as user_id,
    p.name,
    p.email,
    -- Invoice summary
    (SELECT COUNT(*) FROM invoices i WHERE i.user_id = p.id) as total_invoices,
    (SELECT COALESCE(SUM(amount), 0) FROM invoices i WHERE i.user_id = p.id AND i.status = 'paid') as total_paid,
    (SELECT COALESCE(SUM(amount), 0) FROM invoices i WHERE i.user_id = p.id AND i.status IN ('sent', 'overdue')) as total_outstanding,
    -- Subscription summary
    (SELECT COUNT(*) FROM subscriptions s WHERE s.user_id = p.id AND s.status = 'active') as active_subscriptions,
    (SELECT COALESCE(SUM(amount), 0) FROM subscriptions s WHERE s.user_id = p.id AND s.status = 'active') as monthly_subscription_cost
FROM profiles p
WHERE p.id IN (SELECT DISTINCT user_id FROM invoices)
   OR p.id IN (SELECT DISTINCT user_id FROM subscriptions);

-- View: Payment Statistics
CREATE OR REPLACE VIEW payment_statistics AS
SELECT
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_payments,
    COUNT(*) FILTER (WHERE status = 'completed') as successful_payments,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_payments,
    COALESCE(SUM(amount) FILTER (WHERE status = 'completed'), 0) as total_revenue,
    COALESCE(AVG(amount) FILTER (WHERE status = 'completed'), 0) as average_payment_amount
FROM payments
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- ============================================
-- END OF WOCHE 18 BILLING SCHEMA
-- ============================================
