#!/usr/bin/env fish

# ============================================
# ScaleSite AUTO-LOOP Script
# Exakt wie Claude.fish - Wochen-basierte Entwicklung
# ============================================

# ============================================================================
# KONFIGURATION
# ============================================================================

# Week Settings
set -g START_WEEK 4              # Start Woche ( wird automatisch erkannt )
set -g TOTAL_WEEKS 32            # Gesamtzahl Wochen im Plan
# MAX_WEEKS wird beim Start abgefragt

# Pause Settings
set -g PAUSE_BETWEEN_WEEKS 60     # Sekunden Pause zwischen Wochen

# File Paths
set -g PROJECT_ROOT "/home/basti/projects/scalesite"
set -g MASTER_PLAN "$PROJECT_ROOT/MASTER_PLAN.md"
set -g STATUS_FILE "$PROJECT_ROOT/.autoloop-status"
set -g LOG_FILE "$PROJECT_ROOT/.autoloop.log"
set -g ERROR_LOG_FILE "$PROJECT_ROOT/.autoloop_errors.log"
set -g METRICS_FILE "$PROJECT_ROOT/.autoloop_metrics.jsonl"
set -g REPORT_FILE "$PROJECT_ROOT/.autoloop_report.html"

# Claude Settings
set -g MAX_REPAIR_ATTEMPTS 3     # Wie oft versuchen zu reparieren

# Git Settings
set -g AUTO_COMMIT true          # Automatisch commits nach jeder Woche
set -g COMMIT_PREFIX "Woche"

# ============================================================================
# COLORS
# ============================================================================

set -g COLOR_RESET '\033[0m'
set -g COLOR_RED '\033[0;31m'
set -g COLOR_GREEN '\033[0;32m'
set -g COLOR_YELLOW '\033[0;33m'
set -g COLOR_BLUE '\033[0;34m'
set -g COLOR_PURPLE '\033[0;35m'
set -g COLOR_CYAN '\033[0;36m'
set -g COLOR_BOLD '\033[1m'

# ============================================================================
# LOGGING FUNCTIONS
# ============================================================================

function log_message
    set timestamp (date +%Y-%m-%d\ %H:%M:%S)
    echo "[$timestamp] $argv[1]" >> "$LOG_FILE"
end

function log_error
    set timestamp (date +%Y-%m-%d\ %H:%M:%S)
    echo "[$timestamp] ERROR: $argv[1]" >> "$ERROR_LOG_FILE"
    echo -e "$COLOR_RED✗ $argv[1]$COLOR_RESET"
end

function log_success
    set timestamp (date +%Y-%m-%d\ %H:%M:%S)
    echo "[$timestamp] SUCCESS: $argv[1]" >> "$LOG_FILE"
    echo -e "$COLOR_GREEN✓ $argv[1]$COLOR_RESET"
end

function log_info
    set timestamp (date +%Y-%m-%d\ %H:%M:%S)
    echo "[$timestamp] INFO: $argv[1]" >> "$LOG_FILE"
    echo -e "$COLOR_CYANℹ $argv[1]$COLOR_RESET"
end

function log_warning
    set timestamp (date +%Y-%m-%d\ %H:%M:%S)
    echo "[$timestamp] WARNING: $argv[1]" >> "$LOG_FILE"
    echo -e "$COLOR_YELLOW⚠ $argv[1]$COLOR_RESET"
end

# ============================================================================
# METRICS FUNCTIONS
# ============================================================================

function init_metrics
    echo '{"version": "1.0", "start_time": "'(date +%s)'", "weeks": []}' > "$METRICS_FILE.tmp"
end

function log_week_metrics
    set week $argv[1]
    set duration $argv[2]
    set status $argv[3]
    set files_changed $argv[4]

    set timestamp (date +%s)
    set metric '{"week": '$week', "duration": '$duration', "status": "'$status'", "files_changed": '$files_changed', "timestamp": '$timestamp'}'

    # Append to JSONL
    echo $metric >> "$METRICS_FILE"
end

# ============================================================================
# GIT FUNCTIONS
# ============================================================================

function git_commit_week
    set week $argv[1]
    set week_name $argv[2]

    if test "$AUTO_COMMIT" = "true"
        log_info "Git Commit für Woche $week..."

        cd "$PROJECT_ROOT"

        # Check if there are changes
        set changes (git status --porcelain | wc -l)
        if test $changes -gt 0
            git add .
            git commit -m "$COMMIT_PREFIX $week: $week_name

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>" > /dev/null 2>&1

            if test $status -eq 0
                log_success "Woche $week committed"
            else
                log_warning "Git commit fehlgeschlagen (keine Änderungen?)"
            end
        else
            log_info "Keine Änderungen zum committen"
        end
    end
end

# ============================================================================
# STATUS MANAGEMENT
# ============================================================================

function get_current_week
    if test -f "$STATUS_FILE"
        cat "$STATUS_FILE" | grep "current_week" | cut -d'=' -f2
    else
        echo "$START_WEEK"
    end
end

function set_current_week
    set week $argv[1]
    echo "current_week=$week" > "$STATUS_FILE"
    echo "last_updated="(date +%Y-%m-%d) >> "$STATUS_FILE"
    echo "last_claude_call="(date +%s) >> "$STATUS_FILE"
end

function check_week_completed
    set week $argv[1]
    set done_file "$PROJECT_ROOT/.week_$week_done"

    if test -f "$done_file"
        echo "true"
    else
        echo "false"
    end
end

function mark_week_completed
    set week $argv[1]
    set done_file "$PROJECT_ROOT/.week_$week_done"
    touch "$done_file"

    # Update MASTER_PLAN.md
    set date (date +%Y-%m-%d)
    awk -v week="$week" -v status="✅ COMPLETED" -v date="$date" '
        /^## WOCHE / { in_week = 0 }
        /^## WOCHE '$week':/ { in_week = 1; print; next }
        in_week && /\*\*Status\*\*:/ {
            print "**Status**: " status
            modified_status = 1
        }
        in_week && /\*\*Abgeschlossen\*\*:/ && modified_status == 0 {
            print "**Abgeschlossen**: " date
        }
        in_week && modified_status == 1 && /\*\*Abgeschlossen\*\*:/ {
            print "**Abgeschlossen**: " date
            modified_status = 0
        }
        !in_week || !/(\*\*Status\*\*:|\*\*Abgeschlossen\*\*:/) { print }
        /^## WOCHE / && in_week { in_week = 0 }
    ' "$MASTER_PLAN" > "$MASTER_PLAN.tmp"

    if test -s "$MASTER_PLAN.tmp"
        mv "$MASTER_PLAN.tmp" "$MASTER_PLAN"
    else
        rm "$MASTER_PLAN.tmp"
    end
end

# ============================================================================
# WEEK EXTRACTION
# ============================================================================

function get_week_name
    set week $argv[1]
    awk "/^## WOCHE $week:/,/^###/ {
        if (/^###/) {
            gsub(/### /, \"\")
            print
            exit
        }
    }" "$MASTER_PLAN"
end

function get_week_tasks
    set week $argv[1]

    # Extract ALL content for the week
    awk "/^## WOCHE $week:/,/^## WOCHE/ {
        if (!/^## WOCHE/ || /^## WOCHE $week:/) print
    }" "$MASTER_PLAN"
end

# ============================================================================
# BUILD CHECK & REPAIR
# ============================================================================

function check_build
    log_info "Build Check..."

    cd "$PROJECT_ROOT"

    # Run build
    npm run build > /tmp/build_output.txt 2>&1
    set build_status $status

    if test $build_status -eq 0
        log_success "Build SUCCESS"
        return 0
    else
        log_error "BUILD FAILED!"
        echo "Build Output:"
        cat /tmp/build_output.txt
        return 1
    end
end

function repair_build
    set week $argv[1]
    set attempt $argv[2]

    log_warning "Reparatur-Versuch $attempt für Woche $week..."

    # Build output lesen
    set build_output (cat /tmp/build_output.txt)

    # Prompt erstellen
    set repair_prompt "# 🚨 EMERGENCY REPAIR - Woche $week

## Problem:
Der Build ist fehlgeschlagen nach Woche $week!

## Deine Aufgabe:
1. Analysiere den Build-Fehler
2. Korrigiere alle TypeScript/ESLint Fehler
3. Stelle sicher dass \`npm run build\` erfolgreich durchläuft
4. Mache KEINE funktionalen Änderungen, nur Reparaturen

## Build Output:
$build_output

## Wichtige Hinweise:
- Nur reparieren, keine neuen Features
- TypeScript errors korrigieren
- Import paths prüfen
- Missing dependencies installieren falls nötig

Beginne mit der Reparatur!"

    # Call Claude to repair
    cd "$PROJECT_ROOT"
    zclaude -p "$repair_prompt" --dangerously-skip-permissions

    # Check if repair worked
    check_build
    return $status
end

function check_and_repair
    set week $argv[1]

    # First check
    if check_build
        return 0
    end

    # Try to repair
    for attempt in (seq 1 $MAX_REPAIR_ATTEMPTS)
        log_warning "Versuche Reparatur $attempt/$MAX_REPAIR_ATTEMPTS..."

        if repair_build $week $attempt
            log_success "Reparatur erfolgreich!"
            return 0
        else
            log_error "Reparatur $attempt fehlgeschlagen"
        end
    end

    # All repairs failed
    log_error "Alle Reparatur-Versuche fehlgeschlagen für Woche $week"
    return 1
end

# ============================================================================
# ADAPTIVE PROMPT SYSTEM
# ============================================================================

function get_week_prompt
    set week $argv[1]
    set total_weeks $argv[2]

    # Get week details
    set week_name (get_week_name "$week")
    set week_content (get_week_tasks "$week")

    # Generate adaptive prompt
    set prompt "# ScaleSite Auto-Entwicklung - Woche $week von $total_weeks

## Woche $week: $week_name

Du bist jetzt dabei, Woche $week des ScaleSite Entwicklungsplans zu implementieren.

## Deiner Aufgabe:

Implementiere **ALLE Aufgaben** für Woche $week vollständig und automatisch.

## Woche $week Details:

$week_content

## Wichtige Hinweise:

1. **Projekt Root**: $PROJECT_ROOT
2. **Tech Stack**:
   - React 19 + TypeScript + Vite 6
   - Tailwind CSS (Blue-Violet Theme)
   - Supabase (PostgreSQL, Auth, Storage, Realtime)
   - Framer Motion (Animationen)

3. **Code Style**:
   - Schreibe TypeScript mit strict types
   - Verwende existing patterns aus dem Projekt
   - Keine over-engineering, keep it simple
   - Kommentiere komplexe Stellen

4. **Vorgehensweise**:
   - Lies alle Aufgaben der Woche
   - Erstelle/ändere Dateien wie erforderlich
   - Teste dein Code soweit möglich
   - Am Ende: Summary aller erstellen/geänderten Dateien

5. **Existierende Dateien prüfen**:
   - Bevor du Dateien erstellst, prüfe ob sie schon existieren
   - Wenn ja: erweitere/ändere sie entsprechend
   - Sieh dir existierende Code-Pattern an

6. **Build Verification**:
   - Nach Abschluss: \`npm run build\` muss erfolgreich sein
   - TypeScript Fehler sofort korrigieren
   - Import paths prüfen

## Report Format:

Am Ende deiner Arbeit:

### Erstellt/Geändert:
1. datei1.ts - Beschreibung
2. datei2.ts - Beschreibung
...

### Zusammenfassung:
- Was wurde implementiert
- Gab es Probleme?
- Nächste Schritte

Beginne jetzt mit der Implementierung von Woche $week!"

    echo "$prompt"
end

# ============================================================================
# PRE-FLIGHT CHECKS
# ============================================================================

function pre_flight_check
    echo ""
    echo -e "$COLOR_BOLD$COLOR_CYAN═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_CYAN  PRE-FLIGHT CHECKS$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_CYAN═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo ""

    # 1. Check project root
    if test -d "$PROJECT_ROOT"
        log_success "Project Root gefunden: $PROJECT_ROOT"
    else
        log_error "Project Root nicht gefunden: $PROJECT_ROOT"
        exit 1
    end

    # 2. Check MASTER_PLAN
    if test -f "$MASTER_PLAN"
        log_success "MASTER_PLAN.md gefunden"
    else
        log_error "MASTER_PLAN.md nicht gefunden: $MASTER_PLAN"
        exit 1
    end

    # 3. Check Claude CLI (zclaude function)
    if not type -q zclaude
        log_error "zclaude function nicht gefunden!"
        echo "Bitte Fish config laden oder zclaude installieren"
        exit 1
    end
    log_success "zclaude function verfügbar ✓"

    # 4. Check git repo
    cd "$PROJECT_ROOT"
    if git rev-parse --git-dir > /dev/null 2>&1
        log_success "Git Repository gefunden"
    else
        log_error "Kein Git Repository!"
        exit 1
    end

    # 5. Check npm
    if command -q npm
        log_success "npm gefunden"
    else
        log_error "npm nicht gefunden!"
        exit 1
    end

    # 6. Check package.json
    if test -f "$PROJECT_ROOT/package.json"
        log_success "package.json gefunden"
    else
        log_error "package.json nicht gefunden!"
        exit 1
    end

    # 7. Initial build check
    log_info "Initial Build Check..."
    npm run build > /dev/null 2>&1
    if test $status -eq 0
        log_success "Initial Build SUCCESS"
    else
        log_warning "Initial Build FAILED - wird versucht zu reparieren..."
        check_and_repair 0
        if test $status -ne 0
            log_error "Konzept initial Build nicht reparieren!"
            log_info "Bitte erst manuell reparieren, dann Skript neu starten"
            exit 1
        end
    end

    # 8. Check branch
    set current_branch (git branch --show-current)
    log_info "Aktueller Branch: $current_branch"

    # 9. Check for uncommitted changes
    set uncommitted (git status --porcelain | wc -l)
    if test $uncommitted -gt 0
        log_warning "Uncommitted Changes gefunden!"
        git status --short
        echo ""
        echo -n -e "$COLOR_YELLOW Trotzdem fortfahren? (j/N): $COLOR_RESET"
        read -l answer < /dev/stdin

        if test "$answer" != "j"; and test "$answer" != "J"
            log_info "Abgebrochen"
            exit 0
        end
    else
        log_success "Keine uncommitted Changes"
    end

    echo ""
    echo -e "$COLOR_GREEN✅ Alle Pre-Flight Checks bestanden!$COLOR_RESET"
    echo ""
end

# ============================================================================
# PRINT FUNCTIONS
# ============================================================================

function ask_week_count
    echo ""
    echo -e "$COLOR_BOLD$COLOR_CYAN═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_CYAN  WIE VIELE WOCHEN?$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_CYAN═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo ""
    echo -e "$COLOR_YELLOW  Aktuelle Woche: $COLOR_BOLD"(get_current_week)"$COLOR_RESET"
    echo ""
    echo "Optionen:"
    echo "  1     = Nur 1 Woche"
    echo "  5     = 5 Wochen (ca. 1 Stunde)"
    echo "  10    = 10 Wochen (ca. 2-3 Stunden)"
    echo "  32    = ALLE remaining Wochen"
    echo ""
    echo -n -e "$COLOR_CYAN Deine Wahl (1-32): $COLOR_RESET"

    read -l weeks_count < /dev/stdin

    # Validate input
    if not echo "$weeks_count" | grep -qE '^[0-9]+$'
        log_error "Ungültige Eingabe! Verwende Nummer 1-32"
        echo -n "" # Return empty on error
        return 1
    end

    if test "$weeks_count" -lt 1 -o "$weeks_count" -gt 32
        log_error "Ungültige Anzahl! Muss zwischen 1 und 32 sein."
        echo -n "" # Return empty on error
        return 1
    end

    # Store in global variable instead of returning
    set -g __weeks_count_input $weeks_count
end

function print_header
    echo ""
    echo -e "$COLOR_BOLD$COLOR_PURPLE═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_PURPLE  ScaleSite Auto-Loop - Woche-für-Woche Entwicklung$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_PURPLE═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo ""
end

function print_week_header
    set week $argv[1]
    set week_name $argv[2]

    echo ""
    echo -e "$COLOR_BOLD$COLOR_BLUE═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_BLUE  WOCHE $week: $week_name$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_BLUE═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo ""
end

function print_summary
    set week $argv[1]
    set week_name $argv[2]
    set duration $argv[3]
    set success $argv[4]

    echo ""
    echo -e "$COLOR_BOLD$COLOR_CYAN═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_CYAN  ZUSAMMENFASSUNG WOCHE $week$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_CYAN═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo ""

    if test $success -eq 0
        echo -e "$COLOR_GREEN✅ Woche $week abgeschlossen: $week_name$COLOR_RESET"
    else
        echo -e "$COLOR_RED❌ Woche $week fehlgeschlagen: $week_name$COLOR_RESET"
    end

    echo -e "$COLOR_YELLOW⏱ Dauer: $duration Sekunden$COLOR_RESET"
    echo ""
end

# ============================================================================
# MAIN EXECUTION
# ============================================================================

function main
    print_header

    # Pre-flight checks
    pre_flight_check

    # Ask how many weeks to do (stores in global variable)
    ask_week_count

    if test $status -ne 0
        log_error "Ungültige Eingabe!"
        exit 1
    end

    # Get the value from global variable
    set max_weeks $__weeks_count_input

    # Initialize metrics
    init_metrics

    # Get current week
    set current_week (get_current_week)

    # Calculate end week
    set end_week (math "$current_week + $max_weeks - 1")

    if test "$end_week" -gt "$TOTAL_WEEKS"
        set end_week $TOTAL_WEEKS
    end

    # Show preview
    echo -e "$COLOR_BOLD$COLOR_CYAN═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_CYAN  AUSFÜHRUNGS-PLAN$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_CYAN═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo ""
    echo -e "$COLOR_YELLOW  Start Woche:   $COLOR_BOLD$current_week$COLOR_RESET"
    echo -e "$COLOR_YELLOW  Ende Woche:    $COLOR_BOLD$end_week$COLOR_RESET"
    echo -e "$COLOR_YELLOW  Anzahl Wochen: $COLOR_BOLD"(math "$end_week - $current_week + 1")"$COLOR_RESET"
    echo ""

    echo -e "$COLOR_CYAN  Wochen die bearbeitet werden:$COLOR_RESET"
    echo ""

    for week in (seq $current_week $end_week)
        set week_name (get_week_name "$week")
        set week_status "⏳"

        if test (check_week_completed "$week") = "true"
            set week_status "✅"
        end

        echo -e "  $week_status Woche $week: $week_name"
    end

    echo ""
    echo -e "$COLOR_YELLOW  Pause zwischen Wochen: $PAUSE_BETWEEN_WEEKS Sekunden$COLOR_RESET"
    echo ""
    echo -e "$COLOR_YELLOW  Auto-Commit: $AUTO_COMMIT$COLOR_RESET"
    echo ""

    # Confirm
    echo -n -e "$COLOR_YELLOW  BEREIT? (j/N): $COLOR_RESET"
    read -l answer < /dev/stdin

    if test "$answer" != "j"; and test "$answer" != "J"
        log_info "Abgebrochen"
        exit 0
    end

    echo ""
    echo -e "$COLOR_BOLD$COLOR_GREEN═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_GREEN  START! $max_weeks Woche(n) von Woche $current_week bis $end_week$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_GREEN═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo ""

    # MAIN LOOP
    set completed_count 0

    for week in (seq $current_week $end_week)
        set week_name (get_week_name "$week")

        # Print header
        print_week_header "$week" "$week_name"

        # Check if already completed
        if test (check_week_completed "$week") = "true"
            log_success "Woche $week bereits erledigt, überspringe..."
            continue
        end

        # Start timer
        set start_time (date +%s)

        # Generate prompt
        log_info "Generiere Prompt für Woche $week..."
        set prompt (get_week_prompt "$week" "$TOTAL_WEEKS")

        # Show progress
        echo -e "$COLOR_YELLOW┌─────────────────────────────────────────────────────────────┐$COLOR_RESET"
        echo -e "$COLOR_YELLOW│ Claude führt Woche $week aus...                          │$COLOR_RESET"
        echo -e "$COLOR_YELLOW│                                                            │$COLOR_RESET"
        echo -e "$COLOR_YELLOW│ Dies kann 10-30 Minuten dauern                           │$COLOR_RESET"
        echo -e "$COLOR_YELLOW│ Bitte das Skript NICHT unterbrechen!                    │$COLOR_RESET"
        echo -e "$COLOR_YELLOW└─────────────────────────────────────────────────────────────┘$COLOR_RESET"
        echo ""

        # Call Claude
        cd "$PROJECT_ROOT"
        zclaude -p "$prompt" --dangerously-skip-permissions

        set claude_exit_code $status

        # End timer
        set end_time (date +%s)
        set duration (math "$end_time - $start_time")

        echo ""
        echo ""

        # Check build
        if test $claude_exit_code -eq 0
            log_info "Claude erfolgreich beendet"

            # Build check & repair
            if check_and_repair $week
                # Success!
                mark_week_completed $week
                git_commit_week $week "$week_name"

                set next_week (math "$week + 1")
                set_current_week "$next_week"

                set completed_count (math "$completed_count + 1")

                # Log metrics
                set files_changed (git diff --name-only HEAD~1 HEAD 2>/dev/null | wc -l)
                if test $files_changed -lt 0
                    set files_changed 0
                end
                log_week_metrics $week $duration "success" $files_changed

                print_summary $week "$week_name" $duration 0

                log_success "Woche $week fertig! Nächste Woche: $next_week"
            else
                # Build failed, couldn't repair
                print_summary $week "$week_name" $duration 1
                log_error "Woche $week fehlgeschlagen - Build konnte nicht repariert werden"
                log_info "Stoppe Loop. Bitte manuell prüfen und neu starten."
                break
            end
        else
            # Claude failed
            print_summary $week "$week_name" $duration 1
            log_error "Claude fehlgeschlagen bei Woche $week (Exit Code: $claude_exit_code)"
            log_info "Stoppe Loop. Bitte Problem prüfen und neu starten."
            break
        end

        # Pause between weeks
        if test "$week" -lt "$end_week"
            echo ""
            log_info "Kurze Pause... ($PAUSE_BETWEEN_WEEKS Sekunden)"
            sleep $PAUSE_BETWEEN_WEEKS
        end
    end

    # FINAL SUMMARY
    echo ""
    echo ""
    echo -e "$COLOR_BOLD$COLOR_PURPLE═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_PURPLE  ENDZUSAMMENFASSUNG$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_PURPLE═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo ""

    set next_week (get_current_week)

    echo -e "$COLOR_GREEN✓ $completed_count Woche(n) erledigt!$COLOR_RESET"
    echo ""

    if test "$next_week" -gt "$TOTAL_WEEKS"
        echo -e "$COLOR_BOLD$COLOR_GREEN🎉 ALLE WOCHEN ABGESCHLOSSEN! 🎉$COLOR_RESET"
        echo ""
        log_info "ScaleSite ist komplett implementiert!"
    else
        echo -e "$COLOR_CYAN Nächste Woche beim nächsten Start: Woche $next_week$COLOR_RESET"
        echo ""
        log_info "Neustart mit: $COLOR_BOLD./scalesite-auto.fish$COLOR_RESET"
    end

    echo ""
    log_info "Logs: $LOG_FILE"
    log_info "Metrics: $METRICS_FILE"
    echo ""
end

# ============================================================================
# SCRIPT START
# ============================================================================

# Run main function
main

# EOF
