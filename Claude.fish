#!/usr/bin/env fish

# ==========================================
# KONFIGURATION
# ==========================================
set MAX_LOOPS 20              # Anzahl der Runden (20 Runden × 5 Phasen = ~5-6 Stunden)
set PAUSE_SECONDS 240         # Pause zwischen Runden (240s = 4 Min)
set LOG_FILE "agent.log"      # Haupt-Log-Datei
set ERROR_LOG_FILE "agent_errors.log"  # Separate Error-Log
set CHECKPOINT_INTERVAL 4     # Alle 4 Runden: Extended Validation
set MAX_FAILED_REPAIRS 5      # Emergency Stop nach X fehlgeschlagenen Repairs

# Statistik-Variablen
set TOTAL_PHASES 0
set SUCCESSFUL_PHASES 0
set FAILED_REPAIRS 0

# ==========================================
# HIGH-END PROMPTS (5 Phasen pro Runde)
# ==========================================

# Prompt 1: React QA & Type Safety Engineer
set PROMPT_1_BASE "Handle als Senior React QA Engineer für Scalesite.

KONTEXT: Du bist in Phase 1 von 5. Dein Fokus liegt auf Stabilität und Type Safety.

PRIORITÄTEN (in dieser Reihenfolge):
1. React Best Practices:
   - Prüfe useEffect Dependencies in allen Components (components/, pages/)
   - Finde instabile Props und unnötige Re-Renders
   - Suche nach Memory Leaks (Event Listeners nicht aufgeräumt)
   - Prüfe auf falsche Keys in Listen

2. TypeScript Hygiene:
   - Eliminiere 'any' Types wo möglich (lib/api.ts hat viele)
   - Füge fehlende Interfaces hinzu
   - Prüfe Props-Types in allen Components
   - Nutze Union Types statt 'any' für flexible Types

3. Runtime Safety:
   - Finde potenzielle undefined/null Zugriffe (Optional Chaining)
   - Prüfe API Error Handling (lib/api.ts hat 80+ Endpoints)
   - Validiere Form Inputs (lib/validation.ts ist minimal - erweitere!)
   - Checke Array.map/filter ohne Null-Checks

4. Performance Red Flags:
   - Finde unnötige Re-Renders (React.memo Kandidaten)
   - Prüfe ob useMemo/useCallback fehlen bei teuren Operationen
   - Inline Functions in JSX Props vermeiden

CONSTRAINT: Fixe Fehler SOFORT und DEFENSIV. Keine Breaking Changes.
Arbeite schrittweise - nicht alle Probleme auf einmal!"

# Prompt 2: UI/UX Designer (Linear/Vercel-inspiriert)
set PROMPT_2_BASE "Handle als Lead UI/UX Designer (Referenz: Linear, Vercel, Stripe Design).

KONTEXT: Du bist in Phase 2 von 5. Phase 1 hat gerade Code-Fixes gemacht.

LIES ZUERST: /home/user/scalesite/SCALESITE_AGENT.md (Design Guidelines)

FOKUS BEREICHE:
1. Visual Hierarchy & Spacing:
   - Prüfe Tailwind spacing consistency (tailwind.config.js definiert custom spacing)
   - Stelle sicher: Hero (text-5xl/6xl) → Überschriften (text-3xl/4xl) → Body (text-base) → Meta (text-sm/xs)
   - Padding/Margin: Nutze 4, 6, 8, 12, 16, 20, 24 (keine krummen Werte)
   - Line-height: Überschriften (leading-tight), Body (leading-relaxed)

2. Interactive States (Subtle, nicht flashy):
   - Hover: scale-105, brightness-110 oder subtle shadow-glow
   - Focus: ring-2 ring-primary/50 mit outline-none
   - Active: scale-95 für feedback
   - Disabled: opacity-50 + cursor-not-allowed
   - Loading: Skeleton screens (nicht nur Spinner)

3. Responsive Design:
   - Mobile-First: Teste alle Breakpoints (sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px)
   - Touch-Targets: min-h-11 oder min-h-12 für alle Buttons/Links auf Mobile
   - Font-Sizes: Reduziere Hero-Text auf Mobile (text-5xl → text-3xl)
   - Spacing: Reduziere auf Mobile (p-12 → p-6)
   - Overflow: Checke horizontal scroll bugs (overflow-x-hidden wo nötig)

4. Accessibility:
   - Color Contrast: WCAG AA minimum (text-white auf dark bg, text-gray-900 auf light)
   - Focus Indicators: NIEMALS outline-none ohne ring-Replacement
   - Alt-Text für alle Bilder
   - ARIA-Labels für Icon-Buttons

5. Micro-Interactions:
   - Transition-Duration: 200ms (quick), 300ms (normal), 500ms (slow)
   - Easing: ease-out für erscheinen, ease-in für verschwinden
   - Transform: translate, scale (kein rotate/skew außer explizit gewollt)

CRITICAL CONSTRAINTS:
- KEINE cosmic/holographic/neon/glassmorphism Effects (steht in SCALESITE_AGENT.md)
- KEINE Änderungen am Farbschema (blue #4B5AED, violet #8B5CF6 sind fix)
- Animationen: 0.2s-0.5s duration max, ease-out default (lib/animations.ts als Referenz)
- AnimatedSection ist aktuell disabled (SCALESITE_AGENT.md) - NICHT aktivieren!

WICHTIG: Prüfe git diff HEAD~1 HEAD und fokussiere auf geänderte Components!"

# Prompt 3: Performance & Optimization Engineer
set PROMPT_3_BASE "Handle als Performance Engineer für Scalesite (Web Vitals Spezialist).

KONTEXT: Du bist in Phase 3 von 5. Phase 1+2 haben Code & Design verbessert.

MISSION: Optimiere die Performance ohne Funktionalität zu ändern.

PERFORMANCE-AUDITS:
1. Bundle Size & Code Splitting:
   - Prüfe vite.config.ts manualChunks Konfiguration
   - Suche nach großen Dependencies die lazy geladen werden sollten
   - Analysiere: Werden große Libs (framer-motion, supabase) optimal gesplittet?
   - Dynamic Imports für schwere Components (import('...).then(...))

2. React Performance:
   - React.memo für teure Components (besonders Listen, Charts)
   - useMemo für teure Berechnungen (Sortierung, Filterung, Transformationen)
   - useCallback für Callbacks die an React.memo Components gehen
   - Vermeide inline objects/arrays in Props ({} oder [] direkt in JSX)
   - Key-Props optimieren (stabile IDs, nicht Array-Index)

3. Rendering Optimization:
   - Finde Components die oft re-rendern (console.log kann helfen, aber entferne danach)
   - Checke ob Context-Consumer zu oft rendern (Split contexts?)
   - Lazy Loading: Nutze React.lazy() für Routes/Pages
   - Suspense Boundaries für bessere UX

4. Asset Optimization:
   - Bilder: Checke ob loading='lazy' gesetzt ist
   - Bilder: Modern formats (webp) bevorzugen
   - Fonts: Nutze font-display: swap
   - Icons: Inline SVGs für kritische, lazy für andere

5. API & Data Fetching:
   - Prüfe ob API Calls dedupliziert werden (mehrere Components fetchen dasselbe?)
   - Nutze Caching wo möglich
   - Pagination/Infinite Scroll für große Listen
   - Debounce Search-Inputs (lib/hooks.ts hat Utilities)

6. CSS & Animations:
   - Nutze transform + opacity für Animationen (GPU-accelerated)
   - Vermeide: width, height, top, left in Animationen
   - will-change nur für aktive Animationen
   - Reduce motion: respect prefers-reduced-motion

CONSTRAINT: KEINE funktionalen Änderungen. Nur Performance-Optimierung.
Messe vor/nach wenn möglich. Dokumentiere größere Änderungen im Commit."

# Prompt 4: Security & Validation Engineer
set PROMPT_4_BASE "Handle als Security Engineer für Scalesite (OWASP Top 10 Spezialist).

KONTEXT: Du bist in Phase 4 von 5. Fokus auf Security & Robustness.

SECURITY-AUDIT:
1. Input Validation (CRITICAL):
   - Alle User-Inputs validieren (Forms, URL params, API requests)
   - lib/validation.ts erweitern mit Schemas
   - Email-Validation: Proper regex oder Library
   - Number-Inputs: Min/Max checks
   - String-Inputs: Length limits, Sanitization
   - File-Uploads: Type + Size validation

2. XSS Prevention:
   - Prüfe dangerouslySetInnerHTML Nutzung (sollte minimal sein)
   - User-Generated Content: Sanitize vor Anzeige
   - URLs: Validate vor href/src (keine javascript: protokolle)
   - Nutze React's built-in XSS protection (automatisches Escaping)

3. Authentication & Authorization:
   - Prüfe AuthContext: Sind geschützte Routes wirklich geschützt?
   - Token Storage: localStorage vs. httpOnly cookies (Supabase handled das)
   - Session Timeout: Ist implementiert?
   - Password Policies: Mind. 8 Zeichen? Complexity?

4. API Security:
   - Rate Limiting: Ist implementiert? (Client + Server)
   - Error Messages: Leaken keine sensiblen Infos
   - CORS: Proper configuration (Supabase handled das)
   - Environment Variables: Niemals secrets in Code

5. Data Privacy:
   - Sensitive Data: Nicht in Logs
   - PII: Minimal sammeln, sicher speichern
   - Error Boundaries: Zeigen keine Stack Traces in Production

6. Dependencies:
   - Checke package.json auf bekannte Vulnerabilities (npm audit)
   - Outdated Packages mit Security-Issues?

7. Common Vulnerabilities:
   - SQL Injection: Nutzt Supabase Prepared Statements? (Ja, aber prüfe Query-Building)
   - CSRF: Tokens implementiert? (Supabase handled das)
   - Open Redirects: Validate Redirect-URLs
   - Prototype Pollution: Vermeide Object.assign mit User-Data

CONSTRAINT: Fixe Security-Issues SOFORT. Bei Zweifeln: Lieber zu streng als zu locker.
Dokumentiere Security-Fixes klar im Commit."

# Prompt 5: Software Architect & Code Cleanup
set PROMPT_5_BASE "Handle als Senior Software Architect. Code Cleanup ohne Funktionalitätsänderungen.

KONTEXT: Du bist in Phase 5 von 5 (letzte Phase der Runde). Cleanup-Zeit.

ZIELE:
1. DRY (Don't Repeat Yourself):
   - Extrahiere doppelte Tailwind className patterns
     Beispiel: Button-Variants in separate Utility oder Component
   - Finde Copy-Paste Code in components/ und extrahiere in Custom Hooks
   - Konsolidiere ähnliche Form-Components (Input, Textarea, Select)
   - Wiederholte Logik → lib/utils.ts oder Custom Hook

2. Dead Code Elimination:
   - Ungenutzte Imports (TypeScript/ESLint findet diese)
   - Auskommentierte Code-Blöcke löschen
   - Ungenutzte Variables/Functions (grau in VSCode)
   - Unreachable Code (nach return/throw)

3. Import Organization:
   - Gruppierung:
     1. React + React-hooks
     2. External Libraries (framer-motion, supabase, etc.)
     3. Internal Components (./components/...)
     4. Internal Utilities (./lib/...)
     5. Types (./types, interfaces)
     6. Assets/Styles
   - Alphabetische Sortierung innerhalb jeder Gruppe
   - Relative Imports konsistent (./ statt ../ wo möglich)

4. File Structure Optimization:
   - Components >300 Zeilen: Split-Kandidat (extract Sub-Components)
   - Components >500 Zeilen: MUSS gesplittet werden
   - Helper Functions: Extrahiere in lib/utils.ts
   - Constants: Separate const files (colors, breakpoints, etc.)
   - Types: Zentral in types/ oder per-file Co-Location

5. Code Readability:
   - Magic Numbers: Ersetze durch Named Constants
   - Boolean Flags: Nutze enums für State (nicht isLoadingPhase1, isLoadingPhase2...)
   - Long Functions: Breche in kleinere Functions
   - Nested Ternaries: Ersetze durch if/else oder early returns
   - Complex Conditions: Extrahiere in Named Functions

6. Light Documentation:
   - JSDoc für komplexe Functions (nicht triviale Getter/Setter)
   - Type Aliases für wiederkehrende Complex Types
     Beispiel: type UserId = string; statt überall string
   - README-Sektion-Kommentare für große Files (z.B. // === API CALLS ===)

7. Consistency:
   - Naming Conventions: camelCase für Variablen, PascalCase für Components
   - Event Handler: handleClick, onButtonClick (konsistent)
   - Boolean Variables: is/has/should Prefix (isLoading, hasError, shouldRender)
   - File Naming: PascalCase für Components, camelCase für Utils

ABSOLUTE CONSTRAINTS:
- KEINE Änderungen an Geschäftslogik oder Algorithmen
- KEINE Änderungen am UI/Styling/Design
- KEINE Umbenennungen von Public API Endpoints oder Props (Breaking Change!)
- KEINE neuen Features oder große Refactorings (nur cleanup)
- KEINE Änderungen an Dependencies oder package.json

WENN ZWEIFEL OB ÄNDERUNG SAFE IST: Lieber NICHT ändern. Safety first.
Diese Phase sollte NULL Breaking Changes produzieren."

# ==========================================
# HELPER FUNCTIONS
# ==========================================

function log_msg
    set timestamp (date "+%Y-%m-%d %H:%M:%S")
    echo "[$timestamp] $argv" | tee -a $LOG_FILE
end

function log_error
    set timestamp (date "+%Y-%m-%d %H:%M:%S")
    echo "[$timestamp] ERROR: $argv" | tee -a $LOG_FILE | tee -a $ERROR_LOG_FILE
end

function check_and_repair
    log_msg "🛠️  Prüfe Build-Status..."
    npm run build > /dev/null 2>&1

    if test $status -eq 0
        log_msg "✅ Build erfolgreich."
        set SUCCESSFUL_PHASES (math $SUCCESSFUL_PHASES + 1)
        return 0
    else
        log_error "BUILD FEHLGESCHLAGEN! Starte Notfall-Reparatur..."
        set ERROR_LOG (npm run build 2>&1 | tail -n 40)

        set REPAIR_PROMPT "🚨 CRITICAL BUILD FAILURE - Du bist Scalesite Emergency QA Engineer.

ERROR LOG (letzte 40 Zeilen):
$ERROR_LOG

DEINE AUFGABE:
1. Analysiere den Error präzise:
   - TypeScript Error? → Zeile und File identifizieren
   - Import Error? → Missing/Wrong import path
   - Syntax Error? → Klammern, Semicolons, Quotes
2. Fixe NUR den spezifischen Fehler - KEINE anderen Änderungen
3. Wenn mehrere Errors: Fixe den ERSTEN komplett, ignore rest

DEBUGGING TIPPS:
- Bei 'Cannot find module': Prüfe import path und file existence
- Bei 'Type X is not assignable': Nutze Type Assertion oder fix Type
- Bei 'Unexpected token': Suche nach fehlenden Klammern/Quotes

WICHTIG:
- Minimaler chirurgischer Fix
- Keine Refactorings
- Keine Optimierungen
- Keine Style-Änderungen
- Single Responsibility: Fix den Error, nichts mehr."

        zclaude -p "$REPAIR_PROMPT" --dangerously-skip-permissions

        # Verify Fix
        log_msg "🔍 Verifiziere Reparatur..."
        npm run build > /dev/null 2>&1
        if test $status -eq 0
            log_msg "✅ Reparatur erfolgreich!"
            git add .
            git commit -m "🚑 Emergency: Build Repair (Auto-Fixed)" --allow-empty
            set SUCCESSFUL_PHASES (math $SUCCESSFUL_PHASES + 1)
            return 0
        else
            log_error "Reparatur gescheitert. Führe ROLLBACK durch..."

            # Safety: Stash changes before hard reset
            git stash push -m "Failed repair attempt - $(date +%Y%m%d_%H%M%S)" 2>/dev/null

            git reset --hard HEAD
            log_msg "🔙 Zurückgesetzt auf letzten funktionierenden Commit."

            set FAILED_REPAIRS (math $FAILED_REPAIRS + 1)
            log_error "Failed Repairs Counter: $FAILED_REPAIRS/$MAX_FAILED_REPAIRS"

            if test $FAILED_REPAIRS -ge $MAX_FAILED_REPAIRS
                log_error "🛑 EMERGENCY STOP: Zu viele fehlgeschlagene Repairs ($FAILED_REPAIRS)"
                log_error "Das System scheint instabil. Breche ab."
                exit 1
            end

            return 1
        end
    end
end

function log_summary
    set -l loop_num $argv[1]
    set -l progress_percent (math "round($loop_num * 100 / $MAX_LOOPS)")

    log_msg "📊 ═══════════════════════════════════════"
    log_msg "📊 RUNDEN-ZUSAMMENFASSUNG"
    log_msg "📊 ═══════════════════════════════════════"
    log_msg "📍 Fortschritt: Runde $loop_num/$MAX_LOOPS ($progress_percent%)"

    set -l commits_today (git rev-list --count HEAD --since="24 hours ago")
    log_msg "💾 Commits (letzte 24h): $commits_today"

    set -l commits_this_session (git rev-list --count HEAD --since="6 hours ago")
    log_msg "💾 Commits (diese Session): $commits_this_session"

    if test $TOTAL_PHASES -gt 0
        set -l success_rate (math "round($SUCCESSFUL_PHASES * 100 / $TOTAL_PHASES)")
        log_msg "✅ Erfolgsrate: $success_rate% ($SUCCESSFUL_PHASES/$TOTAL_PHASES Phasen)"
    end

    if test $FAILED_REPAIRS -gt 0
        log_msg "⚠️  Failed Repairs: $FAILED_REPAIRS/$MAX_FAILED_REPAIRS"
    end

    set -l changes (git diff HEAD~5 HEAD --shortstat 2>/dev/null)
    if test -n "$changes"
        log_msg "📝 Letzte 5 Commits: $changes"
    end

    set -l current_branch (git branch --show-current)
    log_msg "🌿 Branch: $current_branch"

    log_msg "📊 ═══════════════════════════════════════"
end

function pre_flight_check
    log_msg "🔍 PRE-FLIGHT CHECK..."

    # Check git repo
    if not test -d .git
        log_error "Kein Git Repository gefunden!"
        return 1
    end
    log_msg "✅ Git Repository OK"

    # Check npm
    if not command -q npm
        log_error "npm nicht gefunden!"
        return 1
    end
    log_msg "✅ npm verfügbar"

    # Check zclaude
    if not command -q zclaude
        log_error "zclaude command nicht gefunden!"
        return 1
    end
    log_msg "✅ zclaude verfügbar"

    # Check if package.json exists
    if not test -f package.json
        log_error "package.json nicht gefunden!"
        return 1
    end
    log_msg "✅ package.json vorhanden"

    # Initial build check
    log_msg "🏗️  Prüfe initialen Build-Status..."
    npm run build > /dev/null 2>&1
    if test $status -ne 0
        log_error "Initialer Build fehlgeschlagen! Bitte manuell fixen vor Start."
        return 1
    end
    log_msg "✅ Initialer Build erfolgreich"

    # Check branch
    set -l branch (git branch --show-current)
    log_msg "✅ Aktueller Branch: $branch"

    # Check for uncommitted changes
    if not git diff --quiet
        log_msg "⚠️  Uncommitted changes vorhanden - werden committed vor Start"
        git add .
        git commit -m "Pre-Loop: Save working state" --allow-empty
    end

    log_msg "✅ PRE-FLIGHT CHECK KOMPLETT"
    return 0
end

function final_report
    set -l end_time (date "+%Y-%m-%d %H:%M:%S")
    set -l total_commits (git rev-list --count HEAD --since="8 hours ago")

    log_msg ""
    log_msg "🎉 ═══════════════════════════════════════"
    log_msg "🎉 FINAL REPORT"
    log_msg "🎉 ═══════════════════════════════════════"
    log_msg "🏁 End Time: $end_time"
    log_msg "🔄 Loops Completed: $MAX_LOOPS"
    log_msg "📦 Total Phases: $TOTAL_PHASES"
    log_msg "✅ Successful Phases: $SUCCESSFUL_PHASES"
    if test $TOTAL_PHASES -gt 0
        set -l final_success_rate (math "round($SUCCESSFUL_PHASES * 100 / $TOTAL_PHASES)")
        log_msg "📊 Final Success Rate: $final_success_rate%"
    end
    log_msg "💾 Total Commits (Session): $total_commits"
    if test $FAILED_REPAIRS -gt 0
        log_msg "⚠️  Total Failed Repairs: $FAILED_REPAIRS"
    end
    log_msg "📁 Log File: $LOG_FILE"
    if test $FAILED_REPAIRS -gt 0
        log_msg "📁 Error Log: $ERROR_LOG_FILE"
    end
    log_msg "🎉 ═══════════════════════════════════════"
    log_msg ""
end

# ==========================================
# MAIN LOOP
# ==========================================

# Pre-Flight Check
if not pre_flight_check
    echo "❌ Pre-Flight Check fehlgeschlagen. Abbruch."
    exit 1
end

set START_TIME (date "+%Y-%m-%d %H:%M:%S")
log_msg ""
log_msg "🚀 ═══════════════════════════════════════"
log_msg "🚀 SCALESITE PRO-LOOP GESTARTET"
log_msg "🚀 ═══════════════════════════════════════"
log_msg "⚙️  Konfiguration:"
log_msg "   - Max Loops: $MAX_LOOPS"
log_msg "   - Phasen pro Loop: 5 (QA → Design → Performance → Security → Cleanup)"
log_msg "   - Pause zwischen Loops: $PAUSE_SECONDS Sekunden"
log_msg "   - Checkpoint Interval: $CHECKPOINT_INTERVAL Runden"
log_msg "🕐 Start Time: $START_TIME"
log_msg "🚀 ═══════════════════════════════════════"
log_msg ""

for i in (seq 1 $MAX_LOOPS)
    log_msg ""
    log_msg "╔═══════════════════════════════════════╗"
    log_msg "║  RUNDE $i von $MAX_LOOPS"
    log_msg "╚═══════════════════════════════════════╝"
    log_msg ""

    # --- PHASE 1: QA & TYPE SAFETY ---
    log_msg "🐞 Phase 1/5: React QA & Type Safety"
    set TOTAL_PHASES (math $TOTAL_PHASES + 1)
    zclaude -p "$PROMPT_1_BASE" --dangerously-skip-permissions

    if check_and_repair
        git add .
        git commit -m "Loop $i/Phase 1: QA & Type Safety" --allow-empty
    else
        log_error "Phase 1 failed - skipping rest of loop $i"
        continue
    end

    # --- PHASE 2: UI/UX DESIGN ---
    log_msg ""
    log_msg "🎨 Phase 2/5: UI/UX Design"
    set TOTAL_PHASES (math $TOTAL_PHASES + 1)
    set RECENT_CHANGES (git diff HEAD~1 HEAD --stat)
    set DYNAMIC_PROMPT_2 "$PROMPT_2_BASE

ÄNDERUNGEN IN PHASE 1:
$RECENT_CHANGES"

    zclaude -p "$DYNAMIC_PROMPT_2" --dangerously-skip-permissions

    if check_and_repair
        git add .
        git commit -m "Loop $i/Phase 2: UI/UX Design" --allow-empty
    else
        log_error "Phase 2 failed - skipping rest of loop $i"
        continue
    end

    # --- PHASE 3: PERFORMANCE ---
    log_msg ""
    log_msg "⚡ Phase 3/5: Performance Optimization"
    set TOTAL_PHASES (math $TOTAL_PHASES + 1)
    zclaude -p "$PROMPT_3_BASE" --dangerously-skip-permissions

    if check_and_repair
        git add .
        git commit -m "Loop $i/Phase 3: Performance" --allow-empty
    else
        log_error "Phase 3 failed - skipping rest of loop $i"
        continue
    end

    # --- PHASE 4: SECURITY ---
    log_msg ""
    log_msg "🔒 Phase 4/5: Security & Validation"
    set TOTAL_PHASES (math $TOTAL_PHASES + 1)
    zclaude -p "$PROMPT_4_BASE" --dangerously-skip-permissions

    if check_and_repair
        git add .
        git commit -m "Loop $i/Phase 4: Security" --allow-empty
    else
        log_error "Phase 4 failed - skipping rest of loop $i"
        continue
    end

    # --- PHASE 5: ARCHITECTURE & CLEANUP ---
    log_msg ""
    log_msg "🧹 Phase 5/5: Architecture Cleanup"
    set TOTAL_PHASES (math $TOTAL_PHASES + 1)
    zclaude -p "$PROMPT_5_BASE" --dangerously-skip-permissions

    if check_and_repair
        git add .
        git commit -m "Loop $i/Phase 5: Cleanup" --allow-empty
    else
        log_error "Phase 5 failed - continuing to next loop"
        # Don't continue here - loop is done anyway
    end

    # --- CHECKPOINT VALIDATION ---
    if test (math "$i % $CHECKPOINT_INTERVAL") -eq 0
        log_msg ""
        log_msg "🔍 ═══ CHECKPOINT $i ═══"
        log_msg "🔍 Running Extended Validation..."
        npm run build > /dev/null 2>&1
        if test $status -eq 0
            log_msg "✅ Checkpoint Build: SUCCESS"
        else
            log_error "⚠️  Checkpoint Build: FAILED (aber bereits committed)"
            log_error "Manual review empfohlen!"
        end
    end

    # --- RUNDEN-ZUSAMMENFASSUNG ---
    log_msg ""
    log_summary $i

    # --- PAUSE ---
    log_msg ""
    log_msg "✅ Runde $i komplett (5/5 Phasen durchlaufen)"
    if test $i -lt $MAX_LOOPS
        log_msg "☕ Mache Pause für $PAUSE_SECONDS Sekunden..."
        log_msg ""
        sleep $PAUSE_SECONDS
    end
end

# Final Report
log_msg ""
final_report

log_msg "🎉 PRO-LOOP ABGESCHLOSSEN!"
