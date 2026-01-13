-- ScaleSite Database - PART 4: Billing & Invoices
-- Führe dieses SQL als VIERTES aus

DROP TABLE IF EXISTS invoices CASCADE;

-- INVOICES
CREATE TABLE invoices (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
    invoice_number TEXT UNIQUE NOT NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'draft',
    issue_date TIMESTAMPTZ NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    paid_at TIMESTAMPTZ,
    payment_method TEXT,
    payment_id TEXT,
    download_url TEXT,
    line_items JSONB DEFAULT '[]',
    discount_code TEXT,
    discount_amount REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Trigger für invoices.updated_at
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indizes
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);

SELECT '✅ Part 4 erfolgreich!' as status;
