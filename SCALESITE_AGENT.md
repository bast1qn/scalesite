# ScaleSite Agent Knowledge Base

> **Usage:** Start conversation with: "Hol dir das Wissen als SCALESITE_AGENT.md damit du schonmal weißt was zu tun ist"

## Projekt-Übersicht

**ScaleSite** ist eine professionelle Website-Plattform für den Mittelstand, die maßgeschneiderte Websites mit modernster Technologie anbietet.

- **Domain:** https://www.scalesite.de
- **Typ:** React SPA (Single Page Application)
- **Zielgruppe:** KMUs, Dienstleister, lokale Unternehmen
- **USP:** 48h Lieferung, ab 29€, DSGVO-konform, moderne Tech-Stack

## Tech-Stack

| Kategorie | Technologie |
|-----------|-------------|
| Framework | React 18 + TypeScript |
| Build | Vite 6.x |
| Styling | Tailwind CSS |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Animationen | Framer Motion |
| Hosting | Vercel |
| Deployment | `npx vercel deploy --prod` |

## Wichtige Projekt-Struktur

```
scalesite/
├── components/          # React-Komponenten
│   ├── AnimatedSection.tsx    # ⚠️ ACHTUNG: Zurzeit deaktiviert (debugging)
│   ├── Hero.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── PricingSection.tsx
│   └── ...
├── contexts/           # React Contexts
│   ├── AuthContext.tsx
│   ├── LanguageContext.tsx
│   └── CurrencyContext.tsx
├── pages/              # Seiten-Komponenten
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   └── ...
├── lib/                # Utilities
│   ├── supabase.ts     # Supabase Client
│   ├── animations.ts   # Animation-Konfiguration
│   └── translations.ts # i18n
├── index.css           # Globale Styles
└── tailwind.config.js  # Tailwind-Konfiguration
```

## Workflow (SEHR WICHTIG!)

### Vor jeder Änderung:
1. Pull sicherstellen: `git pull`

### Während der Arbeit:
1. Änderungen vornehmen
2. Lokal testen: `npm run dev` (Port 3000/3001)
3. Build testen: `npm run build`

### Nach jeder funktionierenden Änderung:
1. **IMMER commiten:**
   ```bash
   git add -A
   git commit -m "Beschreibung der Änderung"
   ```
2. **IMMER pushen:**
   ```bash
   git push
   ```
3. **Deployen** (wenn für Production bestimmt):
   ```bash
   npx vercel deploy --prod --yes
   ```

### Commit-Nachrichten-Format:
- Kurz, prägnant, englisch oder deutsch
- Beschreibt WAS geändert wurde (nicht warum)
- Beispiel: "Fix React hooks error", "Update Hero section"

## Wichtige Commands

```bash
# Development
npm run dev          # Start Dev Server
npm run build        # Production Build

# Git
git status           # Änderungen sehen
git pull             # Updates holen
git push             # Updates senden

# Deployment
npx vercel --prod    # Deploy to Production
vercel logs          # Deployment Logs ansehen

# Dependencies
npm install          # Installieren
npm update           # Updaten (Vorsicht!)
```

## Aktuelle Probleme / TODOs

### ⚠️ Bekannte Issues:

1. **AnimatedSection deaktiviert (Commit: efded22)**
   - AnimatedSection, StaggerContainer, StaggerItem geben nur plain `div` zurück
   - Grund: Debugging von React Error #130 (invalid hook call)
   - Status: Warte auf User-Feedback ob Fehler behoben

### Design-Philosophie:
- **Clean, Minimal, Professional** (Stripe/Linear/Vercel inspired)
- Keine übermäßigen Effekte (kein cosmic, holographic, etc.)
- Farbschema: Blue (#3b82f6) → Violet (#8b5cf6)
- True Dark Mode: #0a0a0a

## Supabase Konfiguration

- **URL:** https://vqrcckyywuhfxipycett.supabase.co
- **Tables:** profiles, services, tickets, etc.
- **RLS:** Row Level Security aktiviert
- **Auth:** Email/Password + Google OAuth

## Häufige Tasks

### Neue Seite hinzufügen:
1. `pages/NeueSeitePage.tsx` erstellen
2. In `App.tsx` importieren & switch-case ergänzen
3. In Header Navigation hinzufügen (wenn nötig)

### Neue Komponente erstellen:
1. In `components/NeueKomponente.tsx` erstellen
2. Mit AnimatedSection wrapper (wenn Animation gewünscht)
3. Export in jeweiliger Page importieren

### Style Änderungen:
- Global: `index.css`
- Components: Tailwind classes direkt im JSX
- Theme-Farben: `tailwind.config.js`

## Deployment-Infos

- **Vercel Project:** scalesite
- **Production URL:** https://www.scalesite.de
- **Preview URL:** https://scalesite-*.vercel.app
- **Build Output:** `dist/`
- **Build Command:** `npm run build`

## Browser Cache nach Deployment:

Nach einem Deployment die Seite mit Hard Refresh neu laden:
- **Chrome/Firefox:** `Ctrl+Shift+R` (Windows/Linux) oder `Cmd+Shift+R` (Mac)
- **Safari:** `Cmd+Option+R`

## Kontakt bei Problemen:

- Git Issues: https://github.com/bast1qn/scalesite/issues
- User: Bastian Giersch (giersch.bastian@gmx.de)

---

**Zuletzt aktualisiert:** 2025-01-12
**Letztes Deployment:** Commit efded22 (AnimatedSection deaktiviert)
