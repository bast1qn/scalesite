-- TEST: Nur die ersten Tabellen erstellen
-- Führe dieses SQL zuerst aus um zu prüfen ob es funktioniert

DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS user_services CASCADE;

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    company TEXT,
    role TEXT DEFAULT 'user',
    referral_code TEXT UNIQUE,
    referred_by TEXT,
    phone TEXT,
    timezone TEXT DEFAULT 'Europe/Berlin',
    preferences JSONB DEFAULT '{}',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    description_en TEXT,
    price REAL,
    sale_price REAL,
    price_details TEXT,
    price_details_en TEXT
);

INSERT INTO services (name, name_en, description, description_en, price, sale_price, price_details, price_details_en) VALUES
('Basic Website', 'Basic Website', 'Perfekte One-Page für kleine businesses', 'Perfect one-pager for small businesses', 99, 29, 'einmalig', 'one-time');

CREATE TABLE user_services (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    project_id TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Test: Abfragen ob Tabellen existieren
SELECT
    'profiles' as table_name,
    COUNT(*) as count
FROM profiles
UNION ALL
SELECT
    'services' as table_name,
    COUNT(*) as count
FROM services
UNION ALL
SELECT
    'user_services' as table_name,
    COUNT(*) as count
FROM user_services;

SELECT '✅ Step 1 erfolgreich!' as status;
