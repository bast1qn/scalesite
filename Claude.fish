#!/usr/bin/env fish

# ==========================================
# KONFIGURATION
# ==========================================
set MAX_LOOPS 10              # Anzahl der Runden
set PAUSE_SECONDS 60         # Pause zwischen Runden (600s = 10 Min)
set LOG_FILE "agent.log"      # Log-Datei

# ==========================================
# HIGH-END PROMPTS (Optimiert)
# ==========================================

# Prompt 1: Fokus auf Stabilität & React Best Practices
set PROMPT_1_BASE "Handle als Senior React QA Engineer. Analysiere den Code rekursiv auf technische Schulden.
Deine Aufgaben:
1. Prüfe auf React-Antipatterns (z.B. falsche useEffect Dependencies, instabile Props).
2. Suche nach potenziellen Laufzeitfehlern und 'undefined' Zugriffen.
3. Fixe TypeScript 'any' Nutzungen wo möglich.
4. Behebe gefundene Fehler sofort und defensiv.
Ziel: Maximale Stabilität der App."

# Prompt 2: Fokus auf Ästhetik, Spacing & Hierarchie
set PROMPT_2_BASE "Handle als Lead UI/UX Designer (inspiriert von Vercel/Linear Design).
Überarbeite das visuelle Erscheinungsbild.
Deine Aufgaben:
1. Visual Hierarchy: Nutze Schriftgrößen und Farben, um Wichtiges hervorzuheben.
2. Spacing: Stelle sicher, dass Padding/Margin konsistent sind (Tailwind Standard).
3. Micro-Interactions: Füge subtile Hover-Effekte und Transitions hinzu, wo es die UX verbessert.
WICHTIG: Halte dich strikt an die Design-Vorgaben in SCALESITE_AGENT.md."

# Prompt 3: Fokus auf Clean Code & Architektur
set PROMPT_3_BASE "Handle als Senior Software Architect. Führe einen Code-Cleanup durch.
Deine Aufgaben:
1. DRY (Don't Repeat Yourself): Extrahiere wiederkehrende Logik in Hooks oder Utils.
2. Entferne toten Code, ungenutzte Imports und Kommentare.
3. Optimiere Imports und Datei-Struktur für bessere Lesbarkeit.
CONSTRAINT: Ändere NIEMALS die Geschäftslogik oder das UI in diesem Schritt. Nur Struktur & Qualität."

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
        set ERROR_LOG (npm run build 2>&1 | tail -n 20)
        set REPAIR_PROMPT "CRITICAL: Build broken. Error Log:\n\n$ERROR_LOG\n\nFix it immediately. Do not change anything else."
        
        zclaude -p "$REPAIR_PROMPT" --dangerously-skip-permissions
        
        npm run build > /dev/null 2>&1
        if test $status -eq 0
            log_msg "✅ Reparatur erfolgreich!"
            git add .
            git commit -m "🚑 Auto-Repair: Build Fixed" --allow-empty
        else
            log_msg "❌ Reparatur gescheitert. Führe ROLLBACK durch..."
            git reset --hard HEAD
            log_msg "🔙 Zurückgesetzt auf letzten funktionierenden Commit. Überspringe Rest der Runde."
            return 1
        end
    end
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
    
    # --- PAUSE ---
    log_msg "✅ Runde $i komplett."
    if test $i -lt $MAX_LOOPS
        log_msg "☕ Mache Pause für $PAUSE_SECONDS Sekunden..."
        sleep $PAUSE_SECONDS
    end
end

log_msg "🎉 Fertig."
