# ScaleSite - Master Plan (24 Wochen)
## Vollständiger Implementierungsplan für alle Phasen

---

## STATUS ÜBERSICHT

| Woche | Phase | Status | Zuletzt aktualisiert |
|-------|-------|--------|---------------------|
| 1 | Foundation | ✅ COMPLETED | 2025-01-13 |
| 2 | Foundation | ✅ COMPLETED | 2025-01-13 |
| 3 | Configurator | ✅ COMPLETED | 2025-01-13 |
| 4 | Configurator | ⏳ PENDING | - |
| 5 | Onboarding | ✅ COMPLETED | 2026-01-13 |
| 6 | Onboarding | ✅ COMPLETED | 2026-01-13 |
| 7 | Pricing | ✅ COMPLETED | 2026-01-13 |
| 8 | Pricing | ⏳ PENDING | - |
| ... | ... | ... | ... |

---

## WOCHE 1: Database Setup ✅ COMPLETED

### Status
- **Status**: ✅ COMPLETED
- **Abgeschlossen**: 2025-01-13

### Aufgaben (Alle erledigt)
- ✅ supabase_schema.sql erstellt mit 7 neuen Tabellen
- ✅ ALTER TABLE Statements für 5 bestehende Tabellen
- ✅ RLS Policies implementiert
- ✅ 12 Performance Indizes erstellt
- ✅ Deployment Guide (WOCHE_1_DATABASE.md) erstellt

### Auslieferung
- ✅ supabase_schema.sql
- ✅ WOCHE_1_DATABASE.md

### Nächste Schritte (ToDo)
- ⚠️ **DATABASE DEPLOYMENT NÖTIG**: Schema in Supabase ausführen
- Siehe WOCHE_1_DATABASE.md für Anleitung

---

## WOCHE 2: API Foundation ✅ COMPLETED

### Status
- **Status**: ✅ COMPLETED
- **Abgeschlossen**: 2025-01-13

### Aufgaben (Alle erledigt)
- ✅ lib/api.ts erweitert (+770 Zeilen)
  - Projects CRUD
  - Content Generations API
  - Team Members API
  - Invoices API
  - Notifications API
  - Newsletter Campaigns API
  - Analytics API
- ✅ lib/storage.ts erstellt (300 Zeilen)
- ✅ lib/realtime.ts erstellt (650 Zeilen)
- ✅ lib/ai-content.ts erstellt (780 Zeilen)
- ✅ lib/pricing.ts erstellt (630 Zeilen)
- ✅ lib/validation.ts erweitert (+664 Zeilen)
- ✅ lib/supabase.ts erweitert (+707 Zeilen)

### Auslieferung
- ✅ 7 Library Files komplett
- ✅ ~4.500 Zeilen neuer Code
- ✅ 100+ neue Funktionen

---

## WOCHE 3: Configurator Foundation ✅ COMPLETED

### Status
- **Status**: ✅ COMPLETED
- **Abgeschlossen**: 2025-01-13

### Aufgaben (Alle erledigt)
- ✅ components/configurator/ Verzeichnis erstellt
- ✅ Configurator.tsx (460 Zeilen)
  - useReducer State Management
  - Tab Navigation (Design, Content, Features)
  - Save/Reset Functions
  - Unsaved Changes Indicator
- ✅ ColorPalettePicker.tsx (260 Zeilen)
  - 6 Preset Palettes
  - Custom Color Editor
- ✅ LayoutSelector.tsx (150 Zeilen)
  - 3 Layouts: Modern, Classic, Bold
  - Visual Previews
- ✅ ContentEditor.tsx (330 Zeilen)
  - Live Editing mit Validation
  - Character Counters
- ✅ PreviewFrame.tsx (370 Zeilen)
  - 3 Layout Implementierungen
  - Responsive Preview
- ✅ DeviceToggle.tsx (115 Zeilen)
- ✅ useConfigurator.ts Hook (250 Zeilen)

### Auslieferung
- ✅ 7 Komponenten
- ✅ ~1.935 Zeilen Code
- ✅ Full Interactive Configurator

---

## WOCHE 4: Configurator Integration & Polish

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 1-3 completed, Database deployed

### Aufgaben

#### 1. Route Integration
- [ ] Route in App.tsx hinzufügen: `/konfigurator`
- [ ] Route mit Project ID: `/projects/:id/configure`
- [ ] Protected Route Wrapper
- [ ] Navigation Links setzen

#### 2. Configurator enhancements
- [ ] Auto-Save functionality (debounced, 3s)
- [ ] Loading States während API Calls
- [ ] Error Handling mit User Feedback
- [ ] Success Toast Notifications
- [ ] Undo/Redo für Changes (optional)

#### 3. Content Editor Integration
- [ ] AI Content Generator Button
- [ ] Modal für AI Generation
- [ ] Integration mit lib/ai-content.ts
- [ ] Loading State während Generation
- [ ] Generated Content Auswahl

#### 4. Preview Enhancements
- [ ] Smooth Transitions zwischen Device Changes
- [ ] Zoom In/Out für Preview
- [ ] Fullscreen Mode
- [ ] Export Preview as Screenshot

#### 5. Testing & Bug Fixes
- [ ] Manuelles Testing aller Features
- [ ] Responsive Design Testing
- [ ] Dark Mode Testing
- [ ] Error Scenarios testen
- [ ] Bug Fixes

#### 6. Documentation
- [ ] README für Configurator
- [ ] Usage Examples
- [ ] API Dokumentation

### Auslieferung
- [ ] Vollständig integrierter Configurator
- [ ] Ready for User Testing
- [ ] Dokumentation

### Dateien
- App.tsx (modify)
- components/configurator/* (enhance)
- README.md (update)

---

## WOCHE 5: Multi-Step Onboarding Wizard - Foundation

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 1-4 completed

### Aufgaben

#### 1. Onboarding Wizard Structure
- [ ] components/onboarding/ Verzeichnis erstellen
- [ ] OnboardingWizard.tsx (Main Container)
  - Step Progress Indicator
  - Navigation Controls (Next/Back/Save Draft)
  - Form Data Persistence (localStorage)
  - Step Validation Logic

#### 2. Step Indicators
- [ ] StepIndicator.tsx
  - Visual Progress: ● ● ● ○ (4 Steps)
  - Animated Transitions
  - Step Labels
  - Active/Completed States

#### 3. Step Components
- [ ] BasicInfoStep.tsx
  - Name, Email, Password
  - Validation
  - Password Strength Indicator

#### 4. State Management
- [ ] Wizard State (useReducer)
- [ ] Form Data Schema
- [ ] Validation Rules per Step
- [ ] Auto-save to localStorage

### Auslieferung
- [ ] OnboardingWizard Component
- [ ] StepIndicator Component
- [ ] BasicInfoStep Component

### Dateien
- components/onboarding/OnboardingWizard.tsx
- components/onboarding/StepIndicator.tsx
- components/onboarding/BasicInfoStep.tsx

---

## WOCHE 6: Multi-Step Onboarding Wizard - Completion

### Status
- **Status**: ✅ COMPLETED
- **Abgeschlossen**: 2026-01-13

### Aufgaben (Alle erledigt)

#### 1. Remaining Steps ✅
- ✅ BusinessDataStep.tsx (436 Zeilen)
  - Company Name Input
  - Logo Upload mit Drag & Drop
  - Industry Selector (16 Branchen)
  - Website Type Selector (7 Typen)

- ✅ DesignPrefsStep.tsx (424 Zeilen)
  - Color Palette Selection (6 Paletten)
  - Layout Selection (4 Layouts)
  - Font Selection (6 Fonts)
  - Style Preferences

- ✅ ContentReqStep.tsx (474 Zeilen)
  - Required Pages Selection (8 Seiten)
  - Features Selection (10 Features)
  - Timeline Estimation (5 Optionen)
  - Budget Range (5 Budget-Stufen)

#### 2. Integration ✅
- ✅ OnboardingWizard.tsx aktualisiert
- ✅ Alle Steps integriert
- ✅ Validierungslogik erweitert
- ✅ index.ts Exporte aktualisiert
- ⚠️ API Integration folgt in Woche 7+
- ⚠️ Dashboard Redirect folgt in Woche 7+

#### 3. Polish ✅
- ✅ Framer Motion Animationen
- ✅ Loading States (Upload)
- ✅ Error Handling & Validation
- ✅ Progress Bar Animation
- ✅ Mobile Responsive Design

#### 4. Testing ✅
- ✅ Build erfolgreich
- ✅ TypeScript Typprüfung ohne Errors
- ✅ Alle Steps rendern korrekt
- ⚠️ Full User Flow Testing folgt

### Auslieferung
- ✅ Kompletter 4-Schritt Onboarding Wizard
- ✅ Full Integration mit OnboardingWizard
- ✅ Bereit für API Integration (Woche 7+)

### Dateien
- ✅ components/onboarding/BusinessDataStep.tsx (436 Zeilen)
- ✅ components/onboarding/DesignPrefsStep.tsx (424 Zeilen)
- ✅ components/onboarding/ContentReqStep.tsx (474 Zeilen)
- ✅ components/onboarding/OnboardingWizard.tsx (Updated)
- ✅ components/onboarding/index.ts (Updated)

### Zusammenfassung Woche 6
- **Neuer Code**: 1.334 Zeilen in 3 neuen Step-Komponenten
- **Gesamt Onboarding System**: 2.379 Zeilen
- **Features**:
  - 16 Industrien zur Auswahl
  - 7 Website-Typen mit Beschreibungen
  - 6 Farb-Paletten mit Vorschau
  - 4 Layout-Stile
  - 6 Schriftarten
  - 8 Seiten-Typen (Multi-Select)
  - 10 Features (Multi-Select)
  - 5 Timeline-Optionen
  - 5 Budget-Stufen
  - Drag & Drop Logo Upload
  - Vollständig responsive
  - Dark Mode support
  - Framer Motion Animationen

### Nächste Schritte (Woche 7+)
- ⚠️ API Integration (createProject, Profile Update)
- ⚠️ Dashboard Redirect nach Abschluss
- ⚠️ Welcome Email Notification
- ⚠️ Full User Flow Testing

---

## WOCHE 7: Intelligent Pricing System - Foundation

### Status
- **Status**: ✅ COMPLETED
- **Abgeschlossen**: 2026-01-13

### Aufgaben (Alle erledigt)

#### 1. Pricing Components Structure ✅
- ✅ components/pricing/ Verzeichnis erstellt
- ✅ PricingCalculator.tsx (340 Zeilen)
  - State Management (useState, useEffect, useMemo)
  - Real-time Calculations via lib/pricing.ts
  - LocalStorage Persistence
  - Quantity Input mit +/- Buttons
  - Discount Code Validation

#### 2. Feature Toggle ✅
- ✅ FeatureToggle.tsx (365 Zeilen)
  - Available Services List (13 Features)
  - Feature Add/Remove mit Toggle
  - Visual Feedback (Hover, Selected, Disabled)
  - Pricing Impact Display
  - Grid/List Layout Option
  - Kategorie-Gruppierung
  - Max Selections Support

#### 3. Volume Discount ✅
- ✅ VolumeDiscount.tsx (290 Zeilen)
  - Quantity Input mit Quick-Add Buttons
  - Discount Tiers Display (4 Stufen: 10%, 20%, 30%, 40%)
  - Progress Bar für Savings
  - Breakdown Visualization
  - Next Tier Calculation
  - Editable/Read-only Mode

#### 4. Price Breakdown ✅
- ✅ PriceBreakdown.tsx (285 Zeilen)
  - Line Items mit Aufschlüsselung
  - Subtotal, Discounts, Tax, Total
  - Savings Banner
  - 3 Varianten (default, card, minimal)
  - Compact Mode
  - Per Unit Preis

### Auslieferung
- ✅ PricingCalculator Component (340 Zeilen)
- ✅ FeatureToggle Component (365 Zeilen)
- ✅ VolumeDiscount Component (290 Zeilen)
- ✅ PriceBreakdown Component (285 Zeilen)
- ✅ index.ts Export Datei
- ✅ README.md Dokumentation

### Dateien
- ✅ components/pricing/PricingCalculator.tsx
- ✅ components/pricing/FeatureToggle.tsx
- ✅ components/pricing/VolumeDiscount.tsx
- ✅ components/pricing/PriceBreakdown.tsx
- ✅ components/pricing/index.ts
- ✅ components/pricing/README.md
- ✅ components/index.ts (aktualisiert)

### Zusammenfassung Woche 7
- **Neuer Code**: 1.280 Zeilen in 4 Hauptkomponenten
- **Features**:
  - Volle Integration mit lib/pricing.ts
  - 13 verfügbare Features mit Preisen
  - 4 Discount-Tiers (5-50 Einheiten)
  - 5 aktive Discount-Codes
  - LocalStorage Persistenz
  - Multi-Währung Support
  - Multi-Language Support (DE/EN)
  - Dark Mode Support
  - Responsive Design
- **Build Status**: ✅ Erfolgreich (0 TypeScript Errors)

### Nächste Schritte (Woche 8)
- ⚠️ TimeLimitedOffer Komponente
- ⚠️ DiscountCodeInput Komponente
- ⚠️ Integration mit PricingSection
- ⚠️ Analytics Tracking

---

## WOCHE 8: Intelligent Pricing System - Advanced

### Status
- **Status**: ✅ COMPLETED
- **Abgeschlossen**: 2026-01-13

### Aufgaben (Alle erledigt)

#### 1. Time-Limited Offers ✅
- ✅ TimeLimitedOffer.tsx (550 Zeilen)
  - CountdownTimer Component
  - Offer Details Display
  - Expiry Countdown (Days, Hours, Min, Sec)
  - Claim CTA Button
  - 3 Varianten: banner, card, modal
  - Auto-hide when expired
  - localStorage dismissal sync

#### 2. Discount Code System ✅
- ✅ DiscountCodeInput.tsx (690 Zeilen)
  - Real-time Code Validation
  - Success/Error Feedback
  - Applied Discount Display
  - 3 Varianten: input, button, compact
  - Minimum purchase validation
  - Discount calculation (percentage & fixed)
  - Show saved amount

#### 3. Integration & Polish ✅
- ✅ Integration mit lib/pricing.ts
- ✅ Real-time Price Updates
- ✅ localStorage Sync (dismissed offers, applied codes)
- ✅ index.ts Exporte aktualisiert

#### 4. Testing ✅
- ✅ Build Verification (npm run build)
- ✅ TypeScript Errors korrigiert
- ✅ Icon-Importe korrigiert
- ✅ 0 TypeScript Errors

### Auslieferung
- ✅ TimeLimitedOffer Component
- ✅ DiscountCodeInput Component
- ✅ CountdownTimer Component
- ✅ OfferList Component
- ✅ AppliedCodeBadge Component
- ✅ Build erfolgreich

### Dateien
- ✅ components/pricing/TimeLimitedOffer.tsx
- ✅ components/pricing/DiscountCodeInput.tsx
- ✅ components/pricing/index.ts (updated)

### Zusammenfassung Woche 8
- **Neuer Code**: 1.240 Zeilen in 2 Hauptkomponenten + 3 Hilfskomponenten
- **Features**:
  - Countdown Timer mit 3 Varianten (digital, circular, minimal)
  - Time-limited offer detection aus lib/pricing.ts
  - Service & Quantity applicability check
  - Discount Code Validation mit debounce
  - Real-time discount calculation
  - Minimum purchase validation
  - localStorage Persistenz (dismissed offers, applied codes)
  - 3 Varianten pro Component (banner/card/modal, input/button/compact)
  - Multi-Language Support (DE/EN)
  - Dark Mode Support
  - Responsive Design
- **Build Status**: ✅ Erfolgreich (0 TypeScript Errors)

---

## WOCHE 9: Project Status Tracking - Foundation

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 1-8 completed

### Aufgaben

#### 1. Project Components Structure
- [ ] components/projects/ Verzeichnis erstellen
- [ ] ProjectList.tsx
  - Grid/List View Toggle
  - Filter & Sort
  - Search
  - Pagination

#### 2. Project Card
- [ ] ProjectCard.tsx
  - Project Details
  - Status Badge
  - Progress Bar
  - Hover Actions
  - Link to Detail View

#### 3. Status Timeline
- [ ] StatusTimeline.tsx
  - Visual Pipeline
  - Status Icons
  - Date Labels
  - Progress Indicators

#### 4. API Integration
- [ ] Integration mit lib/api.ts
- [ ] Project Loading
- [ ] Real-time Updates (lib/realtime.ts)

### Auslieferung
- [ ] ProjectList Component
- [ ] ProjectCard Component
- [ ] StatusTimeline Component

### Dateien
- components/projects/ProjectList.tsx
- components/projects/ProjectCard.tsx
- components/projects/StatusTimeline.tsx

---

## WOCHE 10: Project Status Tracking - Milestones & Detail

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 9 completed

### Aufgaben

#### 1. Milestone Tracker
- [ ] MilestoneTracker.tsx
  - Milestone List
  - Add/Edit/Delete Milestones
  - Status Updates
  - Due Dates
  - Completion Percentage

#### 2. Project Detail Page
- [ ] ProjectDetailPage.tsx
  - Full Project Info
  - Milestone Timeline
  - Activity Feed
  - Team Members
  - Related Services

#### 3. Automatic Milestones
- [ ] Auto-create Milestones bei Projekt-Start
- [ ] Status Updates basierend auf Milestones
- [ ] Progress Calculation
- [ ] Email Notifications bei Status Changes

#### 4. Integration
- [ ] Route: /projects/:id
- [ ] Navigation Integration
- [ ] Real-time Updates
- [ ] Analytics Events

### Auslieferung
- [ ] Vollständiges Project Tracking System
- [ ] Milestone Management
- [ ] Detail View

### Dateien
- components/projects/MilestoneTracker.tsx
- pages/ProjectDetailPage.tsx

---

## WOCHE 11: AI Content Generator - Foundation

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 1-10 completed

### Aufgaben

#### 1. AI Content Components Structure
- [ ] components/ai-content/ Verzeichnis erstellen
- [ ] ContentGenerator.tsx (Main Container)
  - Content Type Selection
  - Input Forms
  - Generation Trigger
  - Loading States
  - Result Display

#### 2. Industry Selector
- [ ] IndustrySelector.tsx
  - 25+ Industries
  - Search/Filter
  - Categorized List

#### 3. Keyword Input
- [ ] KeywordInput.tsx
  - Tag Input System
  - Suggestions
  - Validation

#### 4. Tone Selection
- [ ] ToneSelector.tsx
  - Professional, Casual, Formal, Friendly, Persuasive
  - Visual Preview

### Auslieferung
- [ ] ContentGenerator Component
- [ ] IndustrySelector Component
- [ ] KeywordInput Component
- [ ] ToneSelector Component

### Dateien
- components/ai-content/ContentGenerator.tsx
- components/ai-content/IndustrySelector.tsx
- components/ai-content/KeywordInput.tsx
- components/ai-content/ToneSelector.tsx

---

## WOCHE 12: AI Content Generator - Generation & Editing

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 11 completed

### Aufgaben

#### 1. Generated Content Card
- [ ] GeneratedContentCard.tsx
  - Content Display
  - Copy to Clipboard
  - Select Option
  - Regenerate Button

#### 2. Content Editor
- [ ] ContentEditor.tsx (In-Place Editing)
  - Rich Text Editor
  - Word/Character Count
  - Save/Cancel
  - Version History

#### 3. API Integration
- [ ] Gemini API Integration (lib/ai-content.ts)
- [ ] Prompt Templates
- [ ] Error Handling
- [ ] Rate Limiting

#### 4. Save to Project
- [ ] Link to Project
- [ ] Store in content_generations Table
- [ ] Load Previous Generations
- [ ] Favorites System

### Auslieferung
- [ ] Vollständiger AI Content Generator
- [ ] Ready for Use

### Dateien
- components/ai-content/GeneratedContentCard.tsx
- components/ai-content/ContentEditor.tsx

---

## WOCHE 13: Analytics Dashboard - Charts

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 1-12 completed, recharts installiert

### Aufgaben

#### 1. Install Dependencies
```bash
npm install recharts
```

#### 2. Analytics Components Structure
- [ ] components/analytics/ Verzeichnis erstellen
- [ ] AnalyticsDashboard.tsx (Main Container)
  - KPI Cards Overview
  - Charts Grid
  - Date Range Selector

#### 3. Charts Implementation
- [ ] VisitorChart.tsx
  - Line Chart (Visitors over Time)
  - Date Range Filter
  - Zoom/Pan (optional)

- [ ] PageViewsChart.tsx
  - Bar Chart (Page Views)
  - Top Pages List
  - Comparison Mode

- [ ] ConversionRate.tsx
  - KPI Card with Trend
  - Percentage Display
  - Comparison Period

#### 4. Date Range Picker
- [ ] DateRangePicker.tsx
  - Presets (7 days, 30 days, 90 days)
  - Custom Range
  - Quick Select

### Auslieferung
- [ ] AnalyticsDashboard Component
- [ ] 3 Chart Components
- [ ] DateRangePicker Component

### Dateien
- components/analytics/AnalyticsDashboard.tsx
- components/analytics/VisitorChart.tsx
- components/analytics/PageViewsChart.tsx
- components/analytics/ConversionRate.tsx
- components/analytics/DateRangePicker.tsx

---

## WOCHE 14: Analytics Dashboard - Metrics & Export

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 13 completed

### Aufgaben

#### 1. Additional Metrics
- [ ] BounceRate Card
- [ ] AvgSessionDuration Card
- [ ] TopPages Card
- [ ] TopReferrers Card

#### 2. Analytics Events Tracking
- [ ] Automatic Event Tracking
- [ ] Page View Tracking
- [ ] User Actions Tracking
- [ ] Custom Events

#### 3. Export Functionality
- [ ] ExportCSV.tsx
  - Data Export
  - Date Range Selection
  - Format Options

- [ ] ExportPDF.tsx
  - Dashboard PDF
  - Chart Screenshots
  - Report Generation

#### 4. Integration
- [ ] Route: /analytics
- [ ] Navigation Link
- [ ] Permission Check (User vs Team)

### Auslieferung
- [ ] Vollständiges Analytics Dashboard
- [ ] Export Functions
- [ ] Event Tracking System

### Dateien
- components/analytics/BounceRate.tsx
- components/analytics/ExportCSV.tsx
- components/analytics/ExportPDF.tsx
- pages/AnalyticsPage.tsx

---

## WOCHE 15: Enhanced Ticket Support - Foundation

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 1-14 completed

### Aufgaben

#### 1. Install Dependencies
```bash
npm install react-dropzone
```

#### 2. Ticket Components Structure
- [ ] components/tickets/ Verzeichnis erstellen
- [ ] TicketPriorityBadge.tsx
  - Priority Levels (Critical, High, Medium, Low)
  - Color Coding
  - Icons

#### 3. File Upload
- [ ] FileUploader.tsx
  - Drag & Drop Zone
  - File Preview
  - Upload Progress
  - Validation

#### 4. Ticket History
- [ ] TicketHistory.tsx
  - Timeline View
  - Status Changes
  - Comments
  - Attachments

### Auslieferung
- [ ] TicketPriorityBadge Component
- [ ] FileUploader Component
- [ ] TicketHistory Component

### Dateien
- components/tickets/TicketPriorityBadge.tsx
- components/tickets/FileUploader.tsx
- components/tickets/TicketHistory.tsx

---

## WOCHE 16: Enhanced Ticket Support - Advanced Features

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 15 completed

### Aufgaben

#### 1. Ticket Sidebar
- [ ] TicketSidebar.tsx
  - Project Info
  - Related Service
  - Status History
  - Assigned Team Members

#### 2. Canned Responses
- [ ] CannedResponses.tsx
  - Template Library
  - Category Filter
  - Insert Response
  - Custom Templates

#### 3. Ticket Assignment
- [ ] TicketAssignment.tsx
  - Team Member Selection
  - Auto-Assignment Rules
  - Notifications

#### 4. Enhanced Notifications
- [ ] Real-time Ticket Updates (lib/realtime.ts)
- [ ] Browser Notifications
- [ ] Email Notifications
- [ ] Sound Alerts (optional)

### Auslieferung
- [ ] Erweitertes Ticket System
- [ ] Full Integration

### Dateien
- components/tickets/TicketSidebar.tsx
- components/tickets/CannedResponses.tsx
- components/tickets/TicketAssignment.tsx

---

## WOCHE 17: Billing & Invoice Management - Foundation

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 1-16 completed

### Aufgaben

#### 1. Install Dependencies
```bash
npm install jspdf html2canvas
```

#### 2. Billing Components Structure
- [ ] components/billing/ Verzeichnis erstellen
- [ ] InvoiceList.tsx
  - Filter (Status, Date Range)
  - Sort
  - Search
  - Pagination

#### 3. Invoice Detail
- [ ] InvoiceDetail.tsx
  - Invoice Header
  - Line Items
  - Tax Breakdown
  - Payment Status
  - Download Button

#### 4. Invoice PDF
- [ ] InvoicePDF.tsx
  - PDF Generation (jspdf)
  - Professional Layout
  - Company Logo
  - Export Function

#### 5. Payment History
- [ ] PaymentHistory.tsx
  - Timeline View
  - Payment Details
  - Receipt Download

### Auslieferung
- [ ] InvoiceList Component
- [ ] InvoiceDetail Component
- [ ] InvoicePDF Component
- [ ] PaymentHistory Component

### Dateien
- components/billing/InvoiceList.tsx
- components/billing/InvoiceDetail.tsx
- components/billing/InvoicePDF.tsx
- components/billing/PaymentHistory.tsx

---

## WOCHE 18: Billing & Invoice Management - Payment Integration

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 17 completed

### Aufgaben

#### 1. Payment Methods
- [ ] PaymentMethod.tsx
  - Credit Card
  - PayPal
  - SEPA (optional)
  - Saved Methods

#### 2. Stripe Integration
- [ ] Stripe Checkout
  - Payment Intent
  - Webhook Handler
  - Success/Error Pages

#### 3. PayPal Integration
- [ ] PayPal Button
  - Order Creation
  - Payment Execution
  - Webhook Handler

#### 4. Invoice Workflow
- [ ] Draft → Sent → Paid Workflow
- [ ] Automatic Invoice Creation
- [ ] Payment Reminders
- [ ] Overdue Handling

#### 5. Email Notifications
- [ ] Invoice Sent Email
- [ ] Payment Confirmation
- [ ] Overdue Reminder
- [ ] Receipt Email

### Auslieferung
- [ ] Komplettes Billing System
- [ ] Payment Integration

### Dateien
- components/billing/PaymentMethod.tsx
- components/billing/StripeCheckout.tsx
- components/billing/PayPalButton.tsx

---

## WOCHE 19: Team Collaboration - Foundation

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 1-18 completed

### Aufgaben

#### 1. Team Components Structure
- [ ] components/team/ Verzeichnis erstellen
- [ ] TeamList.tsx
  - Grid/List View
  - Filter by Role
  - Search
  - Invite Button

#### 2. Team Invite
- [ ] TeamInvite.tsx
  - Email Input
  - Role Selection
  - Permissions (optional)
  - Invite Message

#### 3. Member Card
- [ ] MemberCard.tsx
  - Avatar
  - Name & Email
  - Role Badge
  - Status (Active/Pending)
  - Actions (Remove, Change Role)

#### 4. Role Badge
- [ ] RoleBadge.tsx
  - Owner (Gold)
  - Admin (Blue)
  - Member (Green)
  - Viewer (Gray)

### Auslieferung
- [ ] TeamList Component
- [ ] TeamInvite Component
- [ ] MemberCard Component
- [ ] RoleBadge Component

### Dateien
- components/team/TeamList.tsx
- components/team/TeamInvite.tsx
- components/team/MemberCard.tsx
- components/team/RoleBadge.tsx

---

## WOCHE 20: Team Collaboration - Permissions & Activity

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 19 completed

### Aufgaben

#### 1. Permission Selector
- [ ] PermissionSelector.tsx
  - Granular Permissions
  - Categories (Projects, Billing, Team, Settings)
  - Read/Write/No Access
  - Custom Role Creation

#### 2. Invitation System
- [ ] Email Sending
- [ ] Invitation Token
- [ ] Accept/Decline Flow
- [ ] Expiry Handling

#### 3. Activity Feed
- [ ] TeamActivityFeed.tsx
  - Recent Actions
  - User Filter
  - Date Range
  - Event Types

#### 4. Member Management
- [ ] Remove Member
- [ ] Change Role
- [ ] Deactivate Member
- [ ] Activity History

#### 5. RBAC Implementation
- [ ] Role-Based Access Control
- [ ] Permission Checks
- [ ] UI Protection
- [ ] API Protection

### Auslieferung
- [ ] Vollständiges Team Collaboration System
- [ ] RBAC Implementation

### Dateien
- components/team/PermissionSelector.tsx
- components/team/TeamActivityFeed.tsx

---

## WOCHE 21: SEO Tools - Foundation

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 1-20 completed

### Aufgaben

#### 1. SEO Components Structure
- [ ] components/seo/ Verzeichnis erstellen
- [ ] MetaTagGenerator.tsx
  - Title Input
  - Description Input
  - Keywords Input
  - Preview
  - Character Counters

#### 2. Sitemap Generator
- [ ] SitemapGenerator.tsx
  - URL List
  - Priority Selection
  - Change Frequency
  - Last Modified
  - XML Download

#### 3. Robots Editor
- [ ] RobotsEditor.tsx
  - Allow/Disallow Rules
  - Crawl Delay
  - Sitemap Reference
  - Preview
  - Download robots.txt

#### 4. SEO Score
- [ ] SEOScore.tsx
  - Score Calculation (0-100)
  - Checklist
  - Suggestions
  - Progress Circle

### Auslieferung
- [ ] MetaTagGenerator Component
- [ ] SitemapGenerator Component
- [ ] RobotsEditor Component
- [ ] SEOScore Component

### Dateien
- components/seo/MetaTagGenerator.tsx
- components/seo/SitemapGenerator.tsx
- components/seo/RobotsEditor.tsx
- components/seo/SEOScore.tsx

---

## WOCHE 22: SEO Tools - Automation

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 21 completed

### Aufgaben

#### 1. Auto Meta Tags
- [ ] Automatic Suggestions
- [ ] AI-Powered Generation
- [ ] Title Templates
- [ ] Description Templates

#### 2. Open Graph Tags
- [ ] OG Title
- [ ] OG Description
- [ ] OG Image
- [ ] OG Type
- [ ] Social Preview

#### 3. Twitter Cards
- [ ] Card Type Selection
- [ ] Twitter Preview
- [ ] Image Upload
- [ ] Validation

#### 4. Structured Data
- [ ] Schema.org Generator
- [ ] JSON-LD Format
- [ ] Types: Article, LocalBusiness, Organization
- [ ] Validation

#### 5. Sitemap Auto-Update
- [ ] Automatic on New Pages
- [ ] Cron Job (Server-side)
- [ ] Ping Search Engines

#### 6. SEO Audit Report
- [ ] Full Site Audit
- [ ] Performance Check
- [ ] Mobile Friendliness
- [ ] SSL Check
- [ ] PDF Export

### Auslieferung
- [ ] Komplettes SEO Toolkit
- [ ] Automation Features

### Dateien
- components/seo/OpenGraphTags.tsx
- components/seo/TwitterCards.tsx
- components/seo/StructuredData.tsx
- components/seo/SEOAuditReport.tsx

---

## WOCHE 23: Newsletter System - Foundation

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 1-22 completed

### Aufgaben

#### 1. Newsletter Components Structure
- [ ] components/newsletter/ Verzeichnis erstellen
- [ ] CampaignList.tsx
  - Filter (Status, Date)
  - Search
  - Create Button
  - Stats Overview

#### 2. Campaign Builder
- [ ] CampaignBuilder.tsx
  - WYSIWYG Editor
  - Subject Line
  - Preview Text
  - From Name/Email
  - Content Editor

#### 3. Subscriber List
- [ ] SubscriberList.tsx
  - List View
  - Search
  - Segments
  - Add/Remove
  - Export

#### 4. Email Preview
- [ ] EmailPreview.tsx
  - Desktop Preview
  - Mobile Preview
  - Live Update

### Auslieferung
- [ ] CampaignList Component
- [ ] CampaignBuilder Component
- [ ] SubscriberList Component
- [ ] EmailPreview Component

### Dateien
- components/newsletter/CampaignList.tsx
- components/newsletter/CampaignBuilder.tsx
- components/newsletter/SubscriberList.tsx
- components/newsletter/EmailPreview.tsx

---

## WOCHE 24: Newsletter System - Sending & Analytics

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 23 completed

### Aufgaben

#### 1. SendGrid/Resend Integration
- [ ] API Integration
- [ ] Template System
- [ ] List Management
- [ ] Sending Logic

#### 2. Campaign Scheduling
- [ ] DateTime Picker
- [ ] Timezone Selection
- [ ] Recurring Options (optional)
- [ ] Queue Management

#### 3. Analytics Charts
- [ ] AnalyticsCharts.tsx
  - Open Rate Chart
  - Click Rate Chart
  - Unsubscribe Rate
  - Bounce Rate
  - Trend Lines

#### 4. Automation
- [ ] Welcome Email
- [ ] Drip Campaigns
- [ ] Triggers
- [ ] Workflows

#### 5. Unsubscribe Handling
- [ ] One-Click Unsubscribe
- [ ] Preference Center
- [ ] Resubscribe Flow
- [ ] Compliance (GDPR)

### Auslieferung
- [ ] Komplettes Newsletter System
- [ ] Analytics Dashboard
- [ ] Automation Features

### Dateien
- components/newsletter/SendGridIntegration.tsx
- components/newsletter/CampaignScheduler.tsx
- components/newsletter/AnalyticsCharts.tsx
- components/newsletter/AutomationRules.tsx

---

## WOCHE 25: Real-time Features - Notifications

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 1-24 completed

### Aufgaben

#### 1. Realtime Components Structure
- [ ] components/realtime/ Verzeichnis erstellen
- [ ] NotificationCenter.tsx
  - Notification List
  - Filter by Type
  - Mark as Read
  - Delete
  - Settings

#### 2. Notification Item
- [ ] NotificationItem.tsx
  - Icon (Type-specific)
  - Message
  - Timestamp
  - Link (if applicable)
  - Mark as Read Button
  - Delete Button

#### 3. Integration
- [ ] lib/realtime.ts Integration
- [ ] Subscribe to Notifications
- [ ] Real-time Updates
- [ ] Sound Alerts (optional)

#### 4. Browser Notifications
- [ ] Permission Request
- [ ] Notification Display
- [ ] Click Handler
- [ ] Close Handler

### Auslieferung
- [ ] NotificationCenter Component
- [ ] NotificationItem Component
- [ ] Full Real-time Integration

### Dateien
- components/realtime/NotificationCenter.tsx
- components/realtime/NotificationItem.tsx

---

## WOCHE 26: Real-time Features - Live Chat

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 25 completed

### Aufgaben

#### 1. Live Chat Component
- [ ] LiveChat.tsx
  - Chat Window
  - Message List
  - Input Field
  - Send Button
  - Minimize/Maximize

#### 2. Typing Indicator
- [ ] TypingIndicator.tsx
  - Dots Animation
  - "X is typing..." Label

#### 3. Online Presence
- [ ] OnlinePresence.tsx
  - Who is Online
  - Status Indicators
  - Last Seen

#### 4. Chat Features
- [ ] Message History
- [ ] File Upload
- [ ] Emoji Picker (optional)
- [ ] Search Messages

#### 5. Real-time Project Updates
- [ ] Project Changes Live
- [ ] Collaborative Editing
- [ ] Cursor Position (optional)

### Auslieferung
- [ ] LiveChat Component
- [ ] TypingIndicator Component
- [ ] OnlinePresence Component

### Dateien
- components/realtime/LiveChat.tsx
- components/realtime/TypingIndicator.tsx
- components/realtime/OnlinePresence.tsx

---

## WOCHE 27: UI/UX 1 - Enhanced Dark Mode

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 1-26 completed

### Aufgaben

#### 1. System Preference Detection
- [ ] Detect prefers-color-scheme
- [ ] Auto-switch based on system
- [ ] Respect user choice

#### 2. Smooth Transitions
- [ ] CSS Transitions between themes
- [ ] No flash of wrong theme
- [ ] Animated theme switch

#### 3. Theme Persistence
- [ ] localStorage
- [ ] Database Storage (profiles.preferences)
- [ ] Sync across devices

#### 4. Theme Selector
- [ ] ThemeSelector.tsx
  - System (Auto)
  - Light
  - Dark
  - High Contrast (optional)

#### 5. Enhanced ThemeToggle
- [ ] Extend existing ThemeToggle.tsx
- [ ] Add System Option
- [ ] Improved UX

### Auslieferung
- [ ] Enhanced Dark Mode
- [ ] ThemeSelector Component

### Dateien
- components/ThemeSelector.tsx
- components/ThemeToggle.tsx (enhance)
- index.css (transitions)

---

## WOCHE 28: UI/UX 2 - Mobile Navigation

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 27 completed

### Aufgaben

#### 1. Install Dependencies
```bash
npm install react-swipeable
```

#### 2. Mobile Components Structure
- [ ] components/mobile/ Verzeichnis erstellen
- [ ] MobileNav.tsx
  - Hamburger Menu
  - Full Screen Overlay
  - Menu Items
  - Close Button

#### 3. Slide Out Menu
- [ ] SlideOutMenu.tsx
  - Swipe to Open (react-swipeable)
  - Animated Slide
  - Backdrop
  - Categories

#### 4. Bottom Nav
- [ ] BottomNav.tsx
  - Tab Bar
  - Active Indicator
  - Icons
  - Labels

#### 5. Gesture Support
- [ ] Swipe Gestures
- [ ] Touch Feedback
- [ ] Haptic Feedback (optional)

### Auslieferung
- [ ] MobileNav Component
- [ ] SlideOutMenu Component
- [ ] BottomNav Component

### Dateien
- components/mobile/MobileNav.tsx
- components/mobile/SlideOutMenu.tsx
- components/mobile/BottomNav.tsx
- Header.tsx (enhance)

---

## WOCHE 29: UI/UX 3 - Loading States

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 28 completed

### Aufgaben

#### 1. Skeleton Components Structure
- [ ] components/skeleton/ Verzeichnis erstellen
- [ ] TableSkeleton.tsx
  - Row Skeleton
  - Repeat for N rows
  - Shimmer Effect

#### 2. Card Skeleton
- [ ] CardSkeleton.tsx
  - Image Skeleton
  - Title Skeleton
  - Text Lines
  - Button Skeleton

#### 3. Text Skeleton
- [ ] TextSkeleton.tsx
  - Single Line
  - Multi Line
  - Width Options

#### 4. Progressive Image Loading
- [ ] Blur-up Effect
- [ ] Lazy Loading
- [ ] Fallback

#### 5. Optimistic UI
- [ ] Immediate Feedback
- [ ] Rollback on Error
- [ ] Loading Indicators

#### 6. Apply to All List Views
- [ ] Projects
- [ ] Tickets
- [ ] Invoices
- [ ] Team Members
- [ ] Campaigns

### Auslieferung
- [ ] TableSkeleton Component
- [ ] CardSkeleton Component
- [ ] TextSkeleton Component
- [ ] Applied everywhere

### Dateien
- components/skeleton/TableSkeleton.tsx
- components/skeleton/CardSkeleton.tsx
- components/skeleton/TextSkeleton.tsx
- All list components (update)

---

## WOCHE 30: Testing & Quality Assurance

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 1-29 completed

### Aufgaben

#### 1. Manual Testing
- [ ] Complete User Journey Testing
- [ ] Cross-browser Testing
- [ ] Device Testing
- [ ] Accessibility Testing
- [ ] Performance Testing

#### 2. Bug Fixes
- [ ] Critical Bugs
- [ ] Major Bugs
- [ ] Minor Bugs
- [ ] UI Polish

#### 3. Code Review
- [ ] Security Review
- [ ] Performance Review
- [ ] Architecture Review
- [ ] Code Quality

#### 4. Documentation
- [ ] Update README
- [ ] API Documentation
- [ ] User Guide
- [ ] Deployment Guide

### Auslieferung
- [ ] Tested Application
- [ ] Bug Fixes
- [ ] Complete Documentation

---

## WOCHE 31: Deployment Preparation

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 30 completed

### Aufgaben

#### 1. Production Build
- [ ] npm run build
- [ ] Check Bundle Size
- [ ] Optimize Assets
- [ ] Remove Dev Dependencies

#### 2. Environment Variables
- [ ] Production .env
- [ ] Supabase Production
- [ ] Gemini API Key
- [ ] Stripe/PayPal Keys

#### 3. Database Migration
- [ ] Production Schema
- [ ] Data Migration (if needed)
- [ ] Backup
- [ ] Rollback Plan

#### 4. Monitoring Setup
- [ ] Error Tracking (Sentry)
- [ ] Analytics (GA4)
- [ ] Performance Monitoring
- [ ] Uptime Monitoring

### Auslieferung
- [ ] Production Build
- [ ] Deployment Checklist

---

## WOCHE 32: Launch & Post-Launch

### Status
- **Status**: ⏳ PENDING
- **Abhängigkeiten**: Woche 31 completed

### Aufgaben

#### 1. Soft Launch
- [ ] Beta User Access
- [ ] Monitor Performance
- [ ] Collect Feedback
- [ ] Fix Critical Issues

#### 2. Full Launch
- [ ] Public Launch
- [ ] Announcement
- [ ] Marketing
- [ ] Support Preparation

#### 3. Post-Launch Monitoring
- [ ] 24/7 Monitoring
- [ ] User Feedback
- [ ] Bug Tracking
- [ ] Performance Metrics

#### 4. Iteration Planning
- [ ] Feature Requests
- [ ] Roadmap Update
- [ ] Next Sprint Planning

### Auslieferung
- [ ] 🎉 **LAUNCHED APPLICATION** 🎉

---

## DEPENDENCIES INSTALLATION

### All Required Packages
```bash
# Charts & Analytics
npm install recharts

# File Upload
npm install react-dropzone

# PDF Generation
npm install jspdf html2canvas

# Date Handling
npm install date-fns

# Mobile Gestures
npm install react-swipeable

# Virtual Scrolling
npm install @tanstack/react-virtual
```

---

## DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All Weeks Completed
- [ ] Testing Done
- [ ] Database Deployed
- [ ] Environment Variables Set
- [ ] Monitoring Configured

### Deployment Steps
1. Database Schema deployen
2. Environment Variables konfigurieren
3. Production Build erstellen
4. Deploy to Vercel/Netlify
5. DNS konfigurieren
6. SSL Setup
7. Monitoring aktivieren

### Post-Deployment
- [ ] Smoke Testing
- [ ] User Acceptance Testing
- [ ] Performance Monitoring
- [ ] Error Tracking aktivieren

---

**END OF MASTER PLAN**
