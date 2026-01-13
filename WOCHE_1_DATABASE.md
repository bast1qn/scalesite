# Woche 1: Database Setup - Deployment Guide

## ✅ Was wurde erledigt

### Neue Tabellen erstellt (7)
1. **projects** - Für Live Preview & Project Status Tracking
2. **project_milestones** - Meilensteine für Projekte
3. **content_generations** - AI-generierte Inhalte
4. **team_members** - Team Collaboration
5. **invoices** - Billing & Invoice Management
6. **notifications** - Real-time Notifications
7. **newsletter_campaigns** - Newsletter System

### Bestehende Tabellen erweitert (5)
1. **profiles** - Neue Spalten: phone, timezone, preferences, onboarding_completed, avatar_url
2. **tickets** - Neue Spalten: project_id, priority_order
3. **user_services** - Neue Spalten: project_id, started_at, completed_at, estimated_completion_date
4. **transactions** - Neue Spalten: invoice_id, payment_provider, provider_transaction_id
5. **files** - Neue Spalten: related_entity_type, related_entity_id, uploaded_by, storage_path

### Analytics Events erweitert
- Neue Spalten: project_id, user_id, event_data, created_at

### Indizes erstellt (12)
- idx_projects_user_id, idx_projects_status
- idx_project_milestones_project_id
- idx_content_generations_user_id
- idx_team_members_team_id, idx_team_members_member_id
- idx_invoices_user_id, idx_invoices_status
- idx_notifications_user_id, idx_notifications_read
- idx_analytics_project_id, idx_analytics_timestamp

### RLS Policies implementiert
- Policies für alle 7 neuen Tabellen
- Benutzer können eigene Daten sehen/bearbeiten
- Team-Mitglieder können alle Daten sehen/bearbeiten

---

## 🚀 Deployment: So führst du das Schema in Supabase aus

### Methode 1: Supabase Dashboard (Empfohlen)

1. **Gehe zu deinem Supabase Projekt**
   - Öffne: https://supabase.com/dashboard
   - Wähle dein ScaleSite Projekt

2. **SQL Editor öffnen**
   - Links im Menü: "SQL Editor" klicken
   - Neues Query erstellen

3. **Schema ausführen**
   - Öffne: `/home/basti/projects/scalesite/supabase_schema.sql`
   - Kompletten Inhalt kopieren
   - In SQL Editor einfügen
   - "Run" klicken ⚡

4. **Überprüfen**
   - Prüfe auf Errors in der Console
   - Alle Tabellen sollten erstellt worden sein

### Methode 2: CLI (für Fortgeschrittene)

```bash
# Supabase CLI installieren (falls noch nicht geschehen)
npm install -g supabase

# Mit Supabase verbinden
supabase login

# Projekt linken
supabase link --project-ref YOUR_PROJECT_REF

# Schema ausführen
supabase db push
```

---

## ✅ Nach dem Deployment: Überprüfen

### 1. Tabellen prüfen

```sql
-- Alle Tabellen auflisten
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Sollte folgende neue Tabellen enthalten:
- content_generations
- invoices
- newsletter_campaigns
- notifications
- project_milestones
- projects
- team_members

### 2. Indizes prüfen

```sql
-- Alle Indizes auflisten
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### 3. RLS Policies prüfen

```sql
-- Policies für projects Tabelle
SELECT * FROM pg_policies
WHERE tablename = 'projects';
```

### 4. ALTER TABLE prüfen

```sql
-- profiles Tabelle Struktur
\d profiles

-- Sollte neue Spalten enthalten:
-- - phone
-- - timezone
-- - preferences
-- - onboarding_completed
-- - avatar_url
```

---

## 🔧 Troubleshooting

### Error: "relation already exists"
**Ursache**: Tabelle existiert bereits
**Lösung**:
```sql
-- Tabelle löschen und neu erstellen
DROP TABLE IF EXISTS projects CASCADE;
-- Dann Schema erneut ausführen
```

### Error: "column already exists"
**Ursache**: Spalte existiert bereits
**Lösung**:
```sql
-- ALTER TABLE mit IF NOT EXISTS verwenden
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
```

### Error: "foreign key constraint failed"
**Ursache**: Referenzierte Tabelle existiert nicht
**Lösung**:
- Stelle sicher, dass alle Tabellen in korrekter Reihenfolge erstellt werden
- projects MUSS vor project_milestones erstellt werden

---

## 📋 Nächste Schritte

### Woche 1 (fast fertig! ✅)
- [x] Database Schema erstellen
- [x] RLS Policies implementieren
- [x] Indizes erstellen
- [ ] **Schema in Supabase deployen** ← DU BIST HIER!
- [ ] Deployment testen

### Woche 2: API Foundation
- [ ] `lib/api.ts` erweitern mit neuen Endpoints
- [ ] `lib/supabase.ts` erweitern für Real-time
- [ ] `lib/validation.ts` erweitern
- [ ] `lib/storage.ts` erstellen
- [ ] `lib/realtime.ts` erstellen

---

## 📞 Bei Problemen

Wenn du Errors beim Deployment bekommst:
1. Error-Message kopieren
2. Mir schicken
3. Ich helfe sofort! 🚀

---

**Viel Erfolg beim Deployen!** 🎉
