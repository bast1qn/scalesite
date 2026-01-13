#!/usr/bin/env fish

# ==========================================
# KONFIGURATION
# ==========================================
set MAX_LOOPS 25              # Anzahl der Runden (25 Runden = ~4-5 Stunden)
set PAUSE_SECONDS 180         # Pause zwischen Runden (180s = 3 Min)
set LOG_FILE "agent.log"      # Log-Datei
set CHECKPOINT_INTERVAL 5     # Alle 5 Runden: Extra validation

# ==========================================
# HIGH-END PROMPTS (Optimiert für 4-5h autonomes Arbeiten)
# ==========================================

# Prompt 1: React QA & Type Safety Engineer
set PROMPT_1_BASE "Handle als Senior React QA Engineer für Scalesite.

PRIORITÄTEN (in dieser Reihenfolge):
1. React Best Practices:
   - Prüfe useEffect Dependencies in allen Components (components/, pages/)
   - Finde instabile Props und unnötige Re-Renders
   - Suche nach Memory Leaks (Event Listeners nicht aufgeräumt)

2. TypeScript Hygiene:
   - Eliminiere 'any' Types wo möglich
   - Füge fehlende Interfaces hinzu (besonders in lib/api.ts)
   - Prüfe Props-Types in allen Components

3. Runtime Safety:
   - Finde potenzielle undefined/null Zugriffe
   - Prüfe API Error Handling (lib/api.ts hat 80+ Endpoints)
   - Validiere Form Inputs (lib/validation.ts ist minimal)

4. Performance:
   - Finde unnötige Re-Renders (React.memo Kandidaten)
   - Prüfe ob useMemo/useCallback fehlen bei teuren Operationen

CONSTRAINT: Fixe Fehler SOFORT und DEFENSIV. Keine Breaking Changes."

# Prompt 2: Linear/Vercel-Inspired UI/UX Designer
set PROMPT_2_BASE "Handle als Lead UI/UX Designer (Referenz: Linear, Vercel, Stripe Design).

LIES ZUERST: /home/user/scalesite/SCALESITE_AGENT.md (Design Guidelines)

FOKUS BEREICHE:
1. Visual Hierarchy & Spacing:
   - Prüfe Tailwind spacing consistency (tailwind.config.js definiert custom spacing)
   - Stelle sicher: Überschriften (text-4xl, text-5xl) → Body (text-base) → Meta (text-sm)
   - Padding/Margin sollten Tailwind-Skala folgen (4, 6, 8, 12, 16...)

2. Interactive States (Subtle, nicht flashy):
   - Hover: brightness, scale oder subtle glow (kein neon)
   - Focus: Ring mit primary color
   - Disabled: opacity-50
   - Loading: Skeleton states (nicht nur spinner)

3. Responsive Design:
   - Mobile-First: Teste alle Breakpoints (sm, md, lg, xl, 2xl)
   - Touch-Targets: min-h-12 für buttons auf mobile
   - Overflow: Checke horizontal scroll bugs

4. Accessibility:
   - Contrast: text-white auf dunklem BG, nicht auf gray-400
   - Focus indicators: niemals outline-none ohne replacement

CRITICAL CONSTRAINTS:
- KEINE cosmic/holographic/flashy Effects (steht in SCALESITE_AGENT.md)
- KEINE Änderungen an Farbschema (blue-violet theme ist fix)
- Animationen: 0.3s-0.6s duration, ease-out (lib/animations.ts als Referenz)
- Wenn AnimatedSection disabled ist (SCALESITE_AGENT.md warnt davor), NICHT aktivieren

WICHTIG: Prüfe welche Files in vorheriger Phase geändert wurden - fokussiere auf diese."

# Prompt 3: Software Architect & Code Cleanup
set PROMPT_3_BASE "Handle als Senior Software Architect. Code Cleanup ohne Funktionalitätsänderungen.

ZIELE:
1. DRY (Don't Repeat Yourself):
   - Extrahiere doppelte Tailwind className patterns (z.B. button variants)
   - Finde Copy-Paste Code in components/ und extrahiere in Hooks
   - Konsolidiere ähnliche Form-Components

2. Toten Code entfernen:
   - Ungenutzte Imports (TypeScript findet diese)
   - Auskommentierte Code-Blöcke
   - Ungenutzte Variables/Functions (ES Lint warnings)

3. Import Organization:
   - Gruppiere: React imports → External libs → Internal components → Types
   - Alphabetische Sortierung innerhalb Gruppen
   - Relative imports konsistent halten

4. File Structure Optimization:
   - Prüfe ob Components zu groß sind (>300 Zeilen = Split-Kandidat)
   - Extract Helper Functions in lib/utils.ts
   - Constants in separate files wenn sinnvoll

5. Documentation (leicht):
   - JSDoc für komplexe Functions (nicht triviale)
   - Type aliases für wiederkehrende Complex Types

ABSOLUTE CONSTRAINTS:
- KEINE Änderungen an Geschäftslogik
- KEINE Änderungen am UI/Styling
- KEINE Umbenennungen von API Endpoints oder Props (würde Code breaken)
- KEINE neuen Features oder Refactorings (nur cleanup)

WENN ZWEIFEL: Lieber NICHT ändern. Safety first."

# ==========================================
# HELPER FUNCTIONS
# ==========================================

function log_msg
    set timestamp (date "+%Y-%m-%d %H:%M:%S")
    echo "[$timestamp] $argv" | tee -a $LOG_FILE
end

function check_and_repair
    log_msg "🛠️ Prüfe Build-Status..."
    npm run build > /dev/null 2>&1

    if test $status -eq 0
        log_msg "✅ Build erfolgreich."
        return 0
    else
        log_msg "🔥 BUILD FEHLGESCHLAGEN! Starte Notfall-Reparatur..."
        set ERROR_LOG (npm run build 2>&1 | tail -n 30)

        set REPAIR_PROMPT "CRITICAL BUILD FAILURE - Du bist Scalesite QA Engineer.

ERROR LOG:
$ERROR_LOG

DEINE AUFGABE:
1. Analysiere den Error (TypeScript? Import? Syntax?)
2. Fixe NUR den spezifischen Fehler - keine anderen Änderungen
3. Wenn mehrere Errors: Fixe den ERSTEN komplett

WICHTIG: Minimaler Fix. Keine Refactorings. Keine Optimierungen."

        zclaude -p "$REPAIR_PROMPT" --dangerously-skip-permissions

        # Verify Fix
        npm run build > /dev/null 2>&1
        if test $status -eq 0
            log_msg "✅ Reparatur erfolgreich!"
            git add .
            git commit -m "🚑 Auto-Repair: Build Fixed" --allow-empty
            return 0
        else
            log_msg "❌ Reparatur gescheitert. ROLLBACK..."
            git reset --hard HEAD
            log_msg "🔙 Zurückgesetzt. Überspringe Rest der Runde."
            return 1
        end
    end
end

function log_summary
    set -l i $argv[1]
    log_msg "📊 === RUNDEN-ZUSAMMENFASSUNG ==="
    log_msg "Aktuelle Runde: $i von $MAX_LOOPS"
    set -l commits_since_start (git rev-list --count HEAD --since="6 hours ago")
    log_msg "Total Commits (letzte 6h): $commits_since_start"
    set -l changes (git diff HEAD~3 HEAD --shortstat 2>/dev/null)
    if test -n "$changes"
        log_msg "Letzte 3 Commits: $changes"
    end
    log_msg "=========================================="
end

# ==========================================
# MAIN LOOP
# ==========================================
if not test -d .git; echo "❌ Kein Git Repo"; exit 1; end

# FIX: Keine geschweiften Klammern um Variablen in Fish
log_msg "🚀 Starte PRO-Loop ($MAX_LOOPS Runden) mit $PAUSE_SECONDS Sekunden Pause..."

for i in (seq 1 $MAX_LOOPS)
    log_msg "=== RUNDE $i von $MAX_LOOPS ==="

    # --- PHASE 1: QA & FIXES ---
    log_msg "🐞 Phase 1: QA Engineer (Fixes)"
    zclaude -p "$PROMPT_1_BASE" --dangerously-skip-permissions
    
    if check_and_repair
        git add .
        git commit -m "Loop $i (Phase 1): QA Fixes" --allow-empty
    else
        continue
    end

    # --- PHASE 2: DESIGN (Mit Kontext) ---
    log_msg "🎨 Phase 2: Lead Designer (UI/UX)"
    set RECENT_CHANGES (git diff HEAD~1 HEAD --stat)
    set DYNAMIC_PROMPT "$PROMPT_2_BASE. HINWEIS: Es wurden gerade folgende Files geändert (bitte prüfen ob Design davon betroffen): $RECENT_CHANGES"
    
    zclaude -p "$DYNAMIC_PROMPT" --dangerously-skip-permissions
    
    if check_and_repair
        git add .
        git commit -m "Loop $i (Phase 2): Design Polish" --allow-empty
    else
        continue
    end

    # --- PHASE 3: ARCHITECTURE ---
    log_msg "🧹 Phase 3: Architect (Refactoring)"
    zclaude -p "$PROMPT_3_BASE" --dangerously-skip-permissions
    
    if check_and_repair
        git add .
        git commit -m "Loop $i (Phase 3): Architecture Cleanup" --allow-empty
    else
        continue
    end
    
    # --- CHECKPOINT VALIDATION (alle 5 Runden) ---
    if test (math "$i % $CHECKPOINT_INTERVAL") -eq 0
        log_msg "🔍 Checkpoint: Running Extended Validation..."
        npm run build > /dev/null 2>&1
        if test $status -eq 0
            log_msg "✅ Checkpoint erfolgreich."
        else
            log_msg "⚠️ Checkpoint fehlgeschlagen - aber Runde war bereits committed."
        end
    end

    # --- RUNDEN-ZUSAMMENFASSUNG ---
    log_summary $i

    # --- PAUSE ---
    log_msg "✅ Runde $i komplett."
    if test $i -lt $MAX_LOOPS
        log_msg "☕ Mache Pause für $PAUSE_SECONDS Sekunden..."
        sleep $PAUSE_SECONDS
    end
end

log_msg "🎉 Fertig."
