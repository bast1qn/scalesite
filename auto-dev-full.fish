#!/usr/bin/env fish

# ============================================
# ScaleSite FULL AUTO-DEV Script
# Ruft Claude automatisch auf für jede Aufgabe
# ============================================

# Colors
set -g COLOR_RESET '\033[0m'
set -g COLOR_RED '\033[0;31m'
set -g COLOR_GREEN '\033[0;32m'
set -g COLOR_YELLOW '\033[0;33m'
set -g COLOR_BLUE '\033[0;34m'
set -g COLOR_PURPLE '\033[0;35m'
set -g COLOR_CYAN '\033[0;36m'
set -g COLOR_BOLD '\033[1m'

# Paths
set -g MASTER_PLAN "/home/basti/projects/scalesite/MASTER_PLAN.md"
set -g PROJECT_ROOT "/home/basti/projects/scalesite"
set -g STATUS_FILE "/home/basti/projects/scalesite/.autodev-status"
set -g CLAUDE_CLI "/home/basti/.local/bin/zclaude"  # Pfad zu zclaude

# Claude Settings
set -g MAX_TASKS_PER_RUN 5  # Max Aufgaben pro Durchlauf
set -g TASK_TIMEOUT 600       # 10 Minuten pro Aufgabe

# ============================================
# HELPER FUNCTIONS
# ============================================

function print_header
    echo ""
    echo -e "$COLOR_BOLD$COLOR_PURPLE═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_PURPLE  ScaleSite FULL AUTO-DEV - Automatische Claude Integration$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_PURPLE═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo ""
end

function print_success
    echo -e "$COLOR_GREEN✓ $argv[1]$COLOR_RESET"
end

function print_error
    echo -e "$COLOR_RED✗ $argv[1]$COLOR_RESET"
end

function print_info
    echo -e "$COLOR_CYANℹ $argv[1]$COLOR_RESET"
end

function print_warning
    echo -e "$COLOR_YELLOW⚠ $argv[1]$COLOR_RESET"
end

function print_week_header
    set week $argv[1]
    set title $argv[2]
    echo ""
    echo -e "$COLOR_BOLD$COLOR_BLUE═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_BLUE  WOCHE $week: $title$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_BLUE═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo ""
end

# ============================================
# STATUS MANAGEMENT
# ============================================

function get_current_week
    if test -f "$STATUS_FILE"
        cat "$STATUS_FILE" | grep "current_week" | cut -d'=' -f2
    else
        echo "1"
    end
end

function set_current_week
    set week $argv[1]
    echo "current_week=$week" > "$STATUS_FILE"
    echo "last_updated="(date +%Y-%m-%d) >> "$STATUS_FILE"
    echo "started_at="(date +%s) >> "$STATUS_FILE"
end

function get_current_task_index
    if test -f "$STATUS_FILE"
        cat "$STATUS_FILE" | grep "current_task_index" | cut -d'=' -f2
    else
        echo "0"
    end
end

function set_current_task_index
    set index $argv[1]
    # Update or add the line
    if grep -q "current_task_index" "$STATUS_FILE"
        sed -i "s/current_task_index=.*/current_task_index=$index/" "$STATUS_FILE"
    else
        echo "current_task_index=$index" >> "$STATUS_FILE"
    end
end

function mark_task_completed
    set week $argv[1]
    set task_index $argv[2]
    set completed_file "$PROJECT_ROOT/.week_{$week}_tasks"

    # Create completed tasks file if not exists
    if not test -f "$completed_file"
        touch "$completed_file"
    end

    # Add task to completed list if not already there
    if not grep -q "task_$task_index" "$completed_file"
        echo "task_$task_index=completed" >> "$completed_file"
    end
end

function is_task_completed
    set week $argv[1]
    set task_index $argv[2]
    set completed_file "$PROJECT_ROOT/.week_{$week}_tasks"

    if test -f "$completed_file"
        if grep -q "task_$task_index=completed" "$completed_file"
            echo "true"
        else
            echo "false"
        end
    else
        echo "false"
    end
end

# ============================================
# TASK EXTRACTION
# ============================================

function get_week_tasks
    set week $argv[1]
    set tasks_file "$PROJECT_ROOT/.week_{$week}_tasks_current"

    # Extract tasks from MASTER_PLAN for this week
    awk "/^## WOCHE $week:/,/^## WOCHE/ {
        if (/^- \[ \]/) {
            gsub(/^- \[ \] /, "")
            gsub(/^- \[x\] /, "")
            print
        }
    }" "$MASTER_PLAN" > "$tasks_file"

    cat "$tasks_file"
end

function get_task_count
    set week $argv[1]
    set tasks_file "$PROJECT_ROOT/.week_{$week}_tasks_current"

    if test -f "$tasks_file"
        wc -l < "$tasks_file" | tr -d ' '
    else
        echo "0"
    end
end

function get_task_at_index
    set week $argv[1]
    set index $argv[2]
    set tasks_file "$PROJECT_ROOT/.week_{$week}_tasks_current"

    if test -f "$tasks_file"
        sed -n "{index}p" "$tasks_file"
    else
        echo ""
    end
end

# ============================================
# CLAUDE INTEGRATION
# ============================================

function check_claude_cli
    if test -f "$CLAUDE_CLI"
        print_success "Claude CLI gefunden: $CLAUDE_CLI"
        return 0
    else
        print_error "Claude CLI nicht gefunden: $CLAUDE_CLI"
        print_info "Bitte pfad anpassen oder zclaude installieren"
        return 1
    end
end

function generate_claude_prompt
    set week $argv[1]
    set task $argv[2]
    set task_index $argv[3]
    set total_tasks $argv[4]

    set prompt (cat <<EOF
# ScaleSite Auto-Dev Task

## Woche $week - Aufgabe $task_index von $total_tasks

### Aktueller Task:
$task

### Kontext:
- Wir befinden uns in Woche $week des ScaleSite Entwicklungsplans
- Projekt Root: $PROJECT_ROOT
- Master Plan: $MASTER_PLAN

### Deine Aufgabe:
1. Lese die Aufgabenbeschreibung genau
2. Implementiere die Aufgabe vollständig
3. Erstelle alle notwendigen Dateien
4. Achte auf bestehende Code-Pattern im Projekt
5. Teste deinen Code (falls möglich)

### Wichtige Hinweise:
- TypeScript React Projekt (Vite + Tailwind)
- Supabase Backend
- Verwende existierende Patterns
- Füge Kommentare hinzu bei Bedarf
- Sehe dir existierende Dateien an für Style-Referenz

### Report:
Am Ende der Aufgabe:
1. List alle erstellen/veränderten Dateien auf
2. Beschreibe was implementiert wurde
3. Nenne eventuelle Probleme oder offene Punkte

Beginne jetzt mit der Implementierung!
EOF
)
    echo "$prompt"
end

function call_claude_for_task
    set week $argv[1]
    set task $argv[2]
    set task_index $argv[3]
    set total_tasks $argv[4]

    set prompt (generate_claude_prompt $week $task $task_index $total_tasks)
    set temp_prompt "/tmp/scalesite_task_$week_$task_index.txt"

    # Save prompt to temp file
    echo "$prompt" > "$temp_prompt"

    print_info "Rufe Claude auf für Woche $week, Aufgabe $task_index/$total_tasks..."
    echo ""
    echo -e "$COLOR_YELLOW┌─────────────────────────────────────────────────────────────┐$COLOR_RESET"
    echo -e "$COLOR_YELLOW│ Claude arbeitet daran...                               │$COLOR_RESET"
    echo -e "$COLOR_YELLOW│ Dies kann einige Minuten dauern                         │$COLOR_RESET"
    echo -e "$COLOR_YELLOW└─────────────────────────────────────────────────────────────┘$COLOR_RESET"
    echo ""

    # Call Claude CLI
    set start_time (date +%s)

    $CLAUDE_CLI -p "$prompt" --dangerously-skip-permissions

    set claude_exit_code $status
    set end_time (date +%s)
    set duration (math "$end_time - $start_time")

    # Cleanup temp file
    rm -f "$temp_prompt"

    echo ""
    echo ""
    print_info "Claude fertig in $duration Sekunden"

    return $claude_exit_code
end

# ============================================
# AUTO-EXECUTION LOGIC
# ============================================

function execute_week_tasks
    set week $argv[1]
    set max_tasks $argv[2]

    print_week_header "$week" "Automatische Ausführung"

    # Get tasks for this week
    get_week_tasks "$week"
    set total_tasks (get_task_count "$week")

    if test "$total_tasks" -eq 0
        print_warning "Keine Aufgaben für Woche $week gefunden!"
        return 1
    end

    print_info "Gesamt: $total_tasks Aufgaben"
    print_info "Max pro Durchlauf: $max_tasks"
    echo ""

    # Get current task index
    set current_index (get_current_task_index)

    # Execute tasks
    set tasks_completed 0
    set task_index (math "$current_index + 1")

    while test "$task_index" -le "$total_tasks"
        if test "$tasks_completed" -ge "$max_tasks"
            print_warning "Maximale Aufgabenanzahl ($max_tasks) erreicht. Pausiere..."
            set_current_task_index (math "$task_index - 1")
            break
        end

        # Check if task already completed
        if test (is_task_completed "$week" "$task_index") = "true"
            print_success "Aufgabe $task_index bereits erledigt, überspringe..."
            set task_index (math "$task_index + 1")
            continue
        end

        # Get task description
        set task (get_task_at_index "$week" "$task_index")

        if test -z "$task"
            print_error "Konnte Aufgabe $task_index nicht lesen!"
            set task_index (math "$task_index + 1")
            continue
        end

        echo ""
        echo -e "$COLOR_BOLD$COLOR_CYAN═══════════════════════════════════════════════════════════════$COLOR_RESET"
        echo -e "$COLOR_BOLD$COLOR_CYAN  Aufgabe $task_index/$total_tasks$COLOR_RESET"
        echo -e "$COLOR_BOLD$COLOR_CYAN═══════════════════════════════════════════════════════════════$COLOR_RESET"
        echo ""
        echo "$task"
        echo ""
        echo -e "$COLOR_BOLD$COLOR_CYAN─────────────────────────────────────────────────────────────$COLOR_RESET"
        echo ""

        # Call Claude
        if call_claude_for_task "$week" "$task" "$task_index" "$total_tasks"
            print_success "Aufgabe $task_index erledigt!"
            mark_task_completed "$week" "$task_index"
            set tasks_completed (math "$tasks_completed + 1")
        else
            print_error "Claude fehlgeschlagen bei Aufgabe $task_index"
            print_info "Aufgabe wird beim nächsten Mal wiederholt"
            set_current_task_index (math "$task_index - 1")
            return 1
        end

        set task_index (math "$task_index + 1")

        # Small pause between tasks
        echo ""
        sleep 2
    end

    # Check if week is complete
    if test "$task_index" -gt "$total_tasks"
        print_success "Alle Aufgaben für Woche $week erledigt!"
        set_current_task_index "0"
        return 0
    else
        print_info "Woche $week noch nicht fertig. Nächster Start: Aufgabe $task_index"
        return 1
    end
end

# ============================================
# MAIN EXECUTION
# ============================================

function main
    print_header

    # Check Claude CLI
    if not check_claude_cli
        exit 1
    end

    # Get current week
    set current_week (get_current_week)

    print_info "Aktuelle Woche: $current_week"
    print_info "Projekt: $PROJECT_ROOT"
    print_info "Max Aufgaben pro Durchlauf: $MAX_TASKS_PER_RUN"
    echo ""

    # Change to project directory
    cd "$PROJECT_ROOT"
    or begin
        print_error "Konnte nicht in Projektverzeichnis wechseln"
        exit 1
    end

    # Execute week
    if execute_week_tasks "$current_week" "$MAX_TASKS_PER_RUN"
        # Week completed, move to next week
        set next_week (math "$current_week + 1")

        if test "$next_week" -le 32
            print_success "Woche $current_week komplett! Gehe zu Woche $next_week..."
            set_current_week "$next_week"
            set_current_task_index "0"
        else
            print_success "🎉 ALLE WOCHEN ABGESCHLOSSEN! 🎉"
            echo ""
            print_info "ScaleSite ist komplett!"
        end
    else
        print_info ""
        print_info "Nächster Start setzt bei Woche $current_week fort"
    end

    echo ""
    print_success "Skript abgeschlossen"
    echo ""
    print_info "Neustart mit: $COLOR_BOLD./auto-dev-full.fish$COLOR_RESET"
    echo ""
end

# ============================================
# SCRIPT START
# ============================================

# Run main function
main

# EOF
