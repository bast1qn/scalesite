#!/usr/bin/env fish

# ============================================
# ScaleSite Auto-Dev Script
# Automatische Woche-für-Woche Entwicklung
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

# ============================================
# HELPER FUNCTIONS
# ============================================

function print_header
    echo ""
    echo -e "$COLOR_BOLD$COLOR_PURPLE═══════════════════════════════════════════════════════════════$COLOR_RESET"
    echo -e "$COLOR_BOLD$COLOR_PURPLE  ScaleSite Auto-Dev - Automatische Woche-für-Woche Entwicklung$COLOR_RESET"
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

function get_completed_weeks
    if test -f "$STATUS_FILE"
        cat "$STATUS_FILE" | grep "completed_weeks" | cut -d'=' -f2
    else
        echo ""
    end
end

function mark_week_completed
    set week $argv[1]
    set completed (get_completed_weeks)
    set date (date +%Y-%m-%d)

    if not echo "$completed" | grep -q "$week"
        set new_completed "$completed $week"
        echo "completed_weeks=$new_completed" >> "$STATUS_FILE"

        print_success "Woche $week als COMPLETED markiert"

        # Update MASTER_PLAN.md
        update_master_plan_status $week "✅ COMPLETED" $date
    end
end

# ============================================
# MASTER PLAN PARSING
# ============================================

function update_master_plan_status
    set week $argv[1]
    set status $argv[2]
    set date $argv[3]

    # Backup the file first
    cp "$MASTER_PLAN" "$MASTER_PLAN.bak"

    # Update the week section
    awk -v week="$week" -v status="$status" -v date="$date" '
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
    ' "$MASTER_PLAN.bak" > "$MASTER_PLAN.tmp"

    mv "$MASTER_PLAN.tmp" "$MASTER_PLAN"
    rm "$MASTER_PLAN.bak"
end

# ============================================
# WEEK IMPLEMENTATION
# ============================================

function implement_week_1
    print_week_header "1" "Database Setup"

    print_info "Prüfe Woche 1 Status..."

    if test -f "$PROJECT_ROOT/supabase_schema.sql"; and test -f "$PROJECT_ROOT/WOCHE_1_DATABASE.md"
        print_success "Woche 1 Dateien existieren!"
        echo ""
        print_info "Status: ✅ COMPLETED"
        echo ""
        print_info "Auslieferung:"
        echo "  • supabase_schema.sql"
        echo "  • WOCHE_1_DATABASE.md"
        echo ""
        print_warning "⚠️  DATABASE DEPLOYMENT NÖTIG:"
        echo "   1. Supabase Dashboard öffnen"
        echo "   2. SQL Editor → supabase_schema.sql ausführen"
        echo "   3. Verify mit Queries aus WOCHE_1_DATABASE.md"
        echo ""

        mark_week_completed 1
        return 0
    else
        print_error "Woche 1 Dateien fehlen!"
        echo ""
        print_info "Erstelle Woche 1..."
        print_info "Siehe MASTER_PLAN.md für Details"
        echo ""
        return 1
    end
end

function implement_week_2
    print_week_header "2" "API Foundation"

    print_info "Prüfe Woche 2 Status..."

    if test -f "$PROJECT_ROOT/lib/api.ts"; and test -f "$PROJECT_ROOT/lib/storage.ts"
        print_success "Woche 2 Dateien existieren!"
        echo ""
        print_info "Status: ✅ COMPLETED"
        echo ""
        print_info "Auslieferung:"
        echo "  • lib/api.ts (+770 Zeilen)"
        echo "  • lib/storage.ts (300 Zeilen)"
        echo "  • lib/realtime.ts (650 Zeilen)"
        echo "  • lib/ai-content.ts (780 Zeilen)"
        echo "  • lib/pricing.ts (630 Zeilen)"
        echo "  • lib/validation.ts (+664 Zeilen)"
        echo "  • lib/supabase.ts (+707 Zeilen)"
        echo ""
        print_info "Gesamt: ~4.500 Zeilen neuer Code"
        echo ""

        mark_week_completed 2
        return 0
    else
        print_error "Woche 2 Dateien fehlen!"
        echo ""
        print_info "Erstelle Woche 2..."
        print_info "Siehe MASTER_PLAN.md für Details"
        echo ""
        return 1
    end
end

function implement_week_3
    print_week_header "3" "Configurator Foundation"

    print_info "Prüfe Woche 3 Status..."

    if test -d "$PROJECT_ROOT/components/configurator"
        print_success "Woche 3 Dateien existieren!"
        echo ""
        print_info "Status: ✅ COMPLETED"
        echo ""
        print_info "Auslieferung:"
        echo "  • Configurator.tsx (460 Zeilen)"
        echo "  • ColorPalettePicker.tsx (260 Zeilen)"
        echo "  • LayoutSelector.tsx (150 Zeilen)"
        echo "  • ContentEditor.tsx (330 Zeilen)"
        echo "  • PreviewFrame.tsx (370 Zeilen)"
        echo "  • DeviceToggle.tsx (115 Zeilen)"
        echo "  • useConfigurator.ts (250 Zeilen)"
        echo ""
        print_info "Gesamt: ~1.935 Zeilen Code"
        echo ""

        mark_week_completed 3
        return 0
    else
        print_error "Woche 3 Dateien fehlen!"
        echo ""
        print_info "Erstelle Woche 3..."
        print_info "Siehe MASTER_PLAN.md für Details"
        echo ""
        return 1
    end
end

function implement_week_4
    print_week_header "4" "Configurator Integration & Polish"

    print_info "Aufgaben für Woche 4:"
    echo ""
    echo "1. Route Integration"
    echo "   [ ] Route in App.tsx: /konfigurator"
    echo "   [ ] Route mit Project ID: /projects/:id/configure"
    echo "   [ ] Protected Route Wrapper"
    echo "   [ ] Navigation Links"
    echo ""
    echo "2. Configurator Enhancements"
    echo "   [ ] Auto-Save (debounced, 3s)"
    echo "   [ ] Loading States"
    echo "   [ ] Error Handling"
    echo "   [ ] Toast Notifications"
    echo "   [ ] Undo/Redo (optional)"
    echo ""
    echo "3. Content Editor Integration"
    echo "   [ ] AI Generator Button"
    echo "   [ ] Modal für AI Generation"
    echo "   [ ] Integration mit lib/ai-content.ts"
    echo "   [ ] Loading State"
    echo "   [ ] Generated Content Auswahl"
    echo ""
    echo "4. Preview Enhancements"
    echo "   [ ] Smooth Transitions"
    echo "   [ ] Zoom In/Out"
    echo "   [ ] Fullscreen Mode"
    echo "   [ ] Export Screenshot"
    echo ""
    echo "5. Testing & Bug Fixes"
    echo "   [ ] Manuelles Testing"
    echo "   [ ] Responsive Testing"
    echo "   [ ] Dark Mode Testing"
    echo "   [ ] Error Scenarios"
    echo "   [ ] Bug Fixes"
    echo ""
    echo "6. Documentation"
    echo "   [ ] README für Configurator"
    echo "   [ ] Usage Examples"
    echo "   [ ] API Dokumentation"
    echo ""

    print_warning "Diese Woche erfordert manuelle Implementierung"
    print_info "Das Skript wird pausiert."
    echo ""
    print_info "Wenn alle Aufgaben erledigt sind:"
    print_info "  1. Erledigte Aufgaben in MASTER_PLAN.md abhaken"
    print_info "  2. Skript neu starten: ./auto-dev.fish"
    print_info ""

    # Check if user confirms completion
    echo -n "Woche 4 abgeschlossen? (j/N): "
    read -l answer < /dev/stdin

    if test "$answer" = "j"; or test "$answer" = "J"; or test "$answer" = "y"; or test "$answer" = "Y"
        mark_week_completed 4
        return 0
    else
        print_info "Woche 4 noch nicht abgeschlossen. Beim nächsten Mal weiter!"
        return 1
    end
end

function implement_week_generic
    set week $argv[1]
    set week_name (awk "/^## WOCHE $week:/,/^## WOCHE/ { if (/^###/) print; exit }" "$MASTER_PLAN" | sed 's/^### //')

    if test -z "$week_name"
        set week_name "Allgemeine Woche"
    end

    print_week_header "$week" "$week_name"

    print_warning "Woche $week ist noch nicht implementiert"
    print_info "Das Skript führt automatisch nur Wochen 1-3 aus."
    print_info "Für Wochen 4+ ist manuelle Implementierung notwendig."
    echo ""
    print_info "Siehe MASTER_PLAN.md für Details zu Woche $week"
    echo ""

    # Show tasks from master plan
    awk "/^## WOCHE $week:/,/^## WOCHE/ {
        if (/^- \[/) print "  " $0
    }" "$MASTER_PLAN" | head -20
    echo ""

    return 1
end

# ============================================
# MAIN EXECUTION
# ============================================

function main
    print_header

    # Get current week from status
    set current_week (get_current_week)
    set completed_weeks (get_completed_weeks)

    print_info "Aktuelle Woche: $current_week"
    print_info "Abgeschlossene Wochen: $completed_weeks"
    echo ""

    # Auto-detect completed weeks
    if test -f "$PROJECT_ROOT/supabase_schema.sql"; and test -f "$PROJECT_ROOT/WOCHE_1_DATABASE.md"
        if not echo "$completed_weeks" | grep -q "1"
            print_info "Woche 1 automatisch erkannt"
            mark_week_completed 1
        end
    end

    if test -f "$PROJECT_ROOT/lib/api.ts"; and test -f "$PROJECT_ROOT/lib/storage.ts"
        if not echo "$completed_weeks" | grep -q "2"
            print_info "Woche 2 automatisch erkannt"
            mark_week_completed 2
        end
    end

    if test -d "$PROJECT_ROOT/components/configurator"
        if not echo "$completed_weeks" | grep -q "3"
            print_info "Woche 3 automatisch erkannt"
            mark_week_completed 3
        end
    end

    # Reload completed weeks
    set completed_weeks (get_completed_weeks)

    # Execute based on current week
    set result 1

    switch "$current_week"
        case "1"
            implement_week_1
            set result $status

        case "2"
            implement_week_2
            set result $status

        case "3"
            implement_week_3
            set result $status

        case "4"
            implement_week_4
            set result $status

        case '*'
            implement_week_generic "$current_week"
            set result $status
    end

    # Update to next week if successful
    if test $result -eq 0
        set next_week (math "$current_week + 1")

        if test "$next_week" -le 32
            print_info ""
            print_success "Woche $current_week abgeschlossen!"
            print_info "Nächste Woche: $next_week"
            set_current_week "$next_week"
        end
    end

    echo ""
    print_success "Skript abgeschlossen"
    echo ""
    print_info "Status gespeichert in: $STATUS_FILE"
    print_info "Zum Fortsetzen: $COLOR_BOLD./auto-dev.fish$COLOR_RESET"
    echo ""
end

# ============================================
# SCRIPT START
# ============================================

# Change to project directory
cd "$PROJECT_ROOT"
or begin
    print_error "Konnte nicht in Projektverzeichnis wechseln: $PROJECT_ROOT"
    exit 1
end

# Run main function
main

# EOF
