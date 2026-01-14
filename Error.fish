#!/usr/bin/env fish

# ==========================================
# LOAD FISH CONFIG (for zclaude function)
# ==========================================
if test -f ~/.config/fish/config.fish
    source ~/.config/fish/config.fish
end

# ==========================================
# KONFIGURATION
# ==========================================
set MAX_LOOPS 30              # Anzahl der Runden
set PAUSE_SECONDS 60         # Pause zwischen Runden
set LOG_FILE "agent.log"      # Haupt-Log-Datei
set ERROR_LOG_FILE "agent_errors.log"  # Separate Error-Log
set METRICS_FILE "agent_metrics.jsonl"  # Performance Metrics (JSON Lines format)
set CHECKPOINT_INTERVAL 4     # Alle 4 Runden: Extended Validation
set MAX_FAILED_REPAIRS 5      # Emergency Stop nach X fehlgeschlagenen Repairs
set MILESTONE_INTERVAL 5      # Git Tag alle 5 Loops
set ENABLE_HTML_REPORT true   # HTML Final Report generieren

# Statistik-Variablen (global für Funktions-Zugriff)
set -g TOTAL_PHASES 0
set -g SUCCESSFUL_PHASES 0
set -g FAILED_REPAIRS 0
set -g SKIPPED_PHASES 0
set -g TOTAL_FILES_CHANGED 0
set -g TOTAL_LINES_ADDED 0
set -g TOTAL_LINES_REMOVED 0

# Phase-spezifische Erfolge (global für Funktions-Zugriff)
set -g PHASE_1_SUCCESS 0

# ==========================================
# ADAPTIVE PROMPT SYSTEM
# ==========================================
# Prompts passen sich an basierend auf Loop-Nummer

function get_adaptive_prompt
    set -l loop_num $argv[1]
    echo "🔍 UMFASSENDE BUGSUCHE & FEHLERBEHEBUNG - Loop $loop_num/$MAX_LOOPS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEINE MISSION: Suche ALLE Dateien systematisch ab und finde/fixe ALLE Fehler
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ARBEITSABLAUF:
1. Durchsuche JEDE Datei im Projekt (pages/, components/, lib/, server/, etc.)
2. Finde JEDE Art von Bug, Error, Problem
3. Fixe SOFORT und committe

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🐛 REACT/FRONTEND BUGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ useEffect ohne Dependencies oder falsche Dependencies
□ Memory Leaks (missing cleanup in useEffect)
□ Infinity Loops durch state updates in useEffect
□ Falsche Keys in map()-Listen
□ Props Drilling Probleme
□ State Updates ohne setState/Dispatcher
□ Undefined/null Zugriffe ohne Optional Chaining
□ Missing Error Boundaries
□ Missing Loading States
□ Fehlende oder falsche Types (any, implicit any)
□ Console.log/console.error vergessen (außer für debugging)
□ Inline Functions in JSX Props (Re-Render Probleme)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 UI/UX BUGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Buttons ohne hover/focus/active States
□ Inputs ohne Labels oder aria-labels
□ Broken Layouts (overflow, alignment issues)
□ Text cut-offs oder overflow
□ Missing responsive breakpoints (Mobile/Tablet/Desktop)
□ Touch Targets zu klein (< 44px)
□ Colors mit schlechtem Kontrast
□ Missing Transitions für Interaktionen
□ Missing loading indicators
□ Missing error feedback für User
□ Form validation fehlt oder unvollständig
□ Empty States nicht behandelt
□ Broken Links oder Navigation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 API BUGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ API Calls ohne Error Handling (try/catch)
□ Missing loading states bei API Calls
□ Duplicate API Calls (useEffect ohne Dependency)
□ API Responses nicht validiert
□ Falsche HTTP Methods (GET statt POST, etc.)
□ Missing Request Headers (Authorization, Content-Type)
□ API Error Responses nicht dem User gezeigt
□ Rate Limiting nicht beachtet
□ Pagination fehlerhaft
□ Data fetching race conditions
□ Missing AbortController für cancelled requests
□ Hardcoded API URLs (statt Environment Variables)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗄️ DATENBANK BUGS (Supabase/PostgreSQL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ SQL Injection vulnerabilities
□ Missing RLS (Row Level Security) Policies
□ N+1 Query Probleme
□ Missing Indexes auf foreign keys
□ Cascade deletes nicht konfiguriert
□ Duplicate Daten möglich (missing unique constraints)
□ Missing validations auf Database Level
□ Transactions nicht korrekt verwendet
□ Connection Leaks (connections nicht geschlossen)
□ Falsche Data Types in Spalten
□ Missing migrations für schema changes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 SECURITY BUGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ XSS (Cross-Site Scripting) - dangerouslySetInnerHTML ohne sanitize
□ CSRF Tokens fehlen oder nicht validiert
□ Sensitive Data im Code (API Keys, Secrets)
□ Environment Variables nicht genutzt
□ Passwords nicht gehasht
□ Auth Bypass möglich
□ Input Validation fehlt
□ File Upload Validation fehlt
□ Open Redirect vulnerabilities
□ Missing Content Security Policy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ PERFORMANCE BUGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Unnecessary Re-Renders
□ Missing React.memo für Listen-Items
□ Large Components nicht aufgeteilt
□ Missing Code Splitting (lazy loading)
□ Images nicht optimiert (kein lazy loading, zu groß)
□ Bundle zu groß durch unused dependencies
□ Missing debounce/throttle für search/input
□ Memory Leaks durch nicht aufgeräumte Event Listener
□ Forced Reflows/Reflows im Loop
□ Missing Virtual Scrolling für lange Listen

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧼 CODE QUALITY BUGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Unused Imports, Variables, Functions
□ Dead Code (unreachable code)
□ Duplicate Code (DRY verletzt)
□ Magic Numbers (konstanten ohne Namen)
□ Missing Error Handling (try/catch fehlt)
□ Hardcoded Values die konfiguriert sein sollten
□ Inconsistent Naming Conventions
□ Missing JSDoc für komplexe Funktionen
□ TODO/FIXME Kommentare die gefixt werden müssen
□ Console/Warnings im Browser

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 TYPESCRIPT BUGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ 'any' Types (ersetzen mit proper types)
□ @ts-ignore oder @ts-any Kommentare
□ Missing Type Annotations für Props
□ Missing Return Types für Functions
□ Implicit Any
□ Type Assertions mit 'as' die unsafe sind
□ Missing null checks
□ Union Types nicht korrekt behandelt

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 BUILD/CONFIG BUGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Vite/Rspack Config Fehler
□ Missing oder falsche Environment Variables
□ Path Alias nicht konfiguriert (@/ imports)
□ Build Errors durch circular dependencies
□ Missing Dependencies in package.json
□ Version Conflicts in dependencies
□ Bundle Size zu groß
□ Tree shaking nicht optimal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 TESTING BUGS (falls Tests vorhanden)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Failing Tests
□ Missing Test Coverage für kritische Pfade
□ Flaky Tests (sometimes fail, sometimes pass)
□ Mocks nicht korrekt implementiert

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RICHTLINIEN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ SEI GRÜNDLICH: Prüfe wirklich ALLE Dateien
✓ Fixe SOFORT: Keine Diskussionen, direkt fixen
✓ KOMMITTE ALLE FIXES: Jeder Fix als eigener Commit
✓ BLEIBE SICHER: Keine Breaking Changes ohne Absicht
✓ DOCUMENTIERE: Füge Kommentare bei komplexen Fixes hinzu
✓ TESTE: Überprüfe ob der Fix funktioniert

✗ KEINE Refactorings ohne Bug-Fix
✗ KEINE \"Optimierungen\" ohne konkreten Bug
✗ KEINE Style Changes ohne Bug-Fix
✗ KEINE neuen Features (nur Bugs fixen!)

START JETZT mit der systematischen Durchsuchung aller Dateien!"
end

# ==========================================
# HELPER FUNCTIONS
# ==========================================

function log_msg
    set timestamp (date "+%Y-%m-%d %H:%M:%S")
    echo "[$timestamp] $argv" | tee -a $LOG_FILE
end

function log_error
    set timestamp (date "+%Y-%m-%d %H:%M:%S")
    echo "[$timestamp] ❌ ERROR: $argv" | tee -a $LOG_FILE | tee -a $ERROR_LOG_FILE
end

function log_success
    set timestamp (date "+%Y-%m-%d %H:%M:%S")
    echo "[$timestamp] ✅ $argv" | tee -a $LOG_FILE
end

function log_metric
    set -l metric_name $argv[1]
    set -l metric_value $argv[2]
    set timestamp (date "+%s")
    echo "{\"timestamp\": $timestamp, \"metric\": \"$metric_name\", \"value\": \"$metric_value\"}" >> $METRICS_FILE
end

function update_phase_stats
    set -l phase_num $argv[1]
    switch $phase_num
        case 1
            set -g PHASE_1_SUCCESS (math $PHASE_1_SUCCESS + 1)
    end
end

function track_git_stats
    set -l last_commit_files (git diff HEAD~1 HEAD --numstat 2>/dev/null | wc -l)
    set -l last_commit_added (git diff HEAD~1 HEAD --numstat 2>/dev/null | awk '{added+=$1} END {print added}')
    set -l last_commit_removed (git diff HEAD~1 HEAD --numstat 2>/dev/null | awk '{removed+=$2} END {print removed}')

    if test -n "$last_commit_added"
        set TOTAL_FILES_CHANGED (math $TOTAL_FILES_CHANGED + $last_commit_files)
        set TOTAL_LINES_ADDED (math $TOTAL_LINES_ADDED + $last_commit_added)
        set TOTAL_LINES_REMOVED (math $TOTAL_LINES_REMOVED + $last_commit_removed)
    end
end

function check_and_repair
    log_msg "🛠️  Build Check..."
    npm run build > /dev/null 2>&1

    if test $status -eq 0
        log_success "Build SUCCESS"
        set SUCCESSFUL_PHASES (math $SUCCESSFUL_PHASES + 1)
        track_git_stats
        return 0
    else
        log_error "BUILD FAILED! Starting Emergency Repair..."
        set ERROR_LOG (npm run build 2>&1 | tail -n 50)

        set REPAIR_PROMPT "🚨 CRITICAL BUILD FAILURE - Emergency QA Engineer Mode.

ERROR LOG (Last 50 lines):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
$ERROR_LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REPAIR PROTOCOL:
1. IDENTIFY Error Type:
   [TS] TypeScript error → Line + File + Expected vs. Got
   [IMPORT] Module error → Check import path + file exists
   [SYNTAX] Syntax error → Missing bracket/semicolon/quote
   [RUNTIME] Runtime error → Undefined access, null reference

2. FIX Strategy:
   - TypeScript: Add type assertion OR fix type definition
   - Import: Correct path OR add missing file
   - Syntax: Add missing character
   - Runtime: Add optional chaining OR null check

3. SINGLE FOCUS:
   Fix ONLY the first error listed
   Ignore subsequent errors (they might auto-resolve)

DEBUGGING CHECKLIST:
□ Error message understood?
□ File + Line identified?
□ Root cause clear?
□ Fix minimal and surgical?

CRITICAL RULES:
✗ NO refactoring
✗ NO optimizations
✗ NO style changes
✗ NO feature additions
✓ ONLY fix the breaking error

Execute minimal fix NOW."

        zclaude -p "$REPAIR_PROMPT" --dangerously-skip-permissions

        # Verify Fix
        log_msg "🔍 Verifying repair..."
        npm run build > /dev/null 2>&1
        if test $status -eq 0
            log_success "Repair SUCCESSFUL!"
            git add .
            git commit -m "🚑 Emergency: Auto-Repair Build" --allow-empty
            set SUCCESSFUL_PHASES (math $SUCCESSFUL_PHASES + 1)
            log_metric "repair_success" "1"
            return 0
        else
            log_error "Repair FAILED. Executing ROLLBACK..."

            # Safety: Stash failed changes
            git stash push -m "Failed-Repair-$(date +%Y%m%d_%H%M%S)" 2>/dev/null
            git reset --hard HEAD

            set FAILED_REPAIRS (math $FAILED_REPAIRS + 1)
            log_error "Failed Repairs: $FAILED_REPAIRS/$MAX_FAILED_REPAIRS"
            log_metric "repair_failed" "1"

            if test $FAILED_REPAIRS -ge $MAX_FAILED_REPAIRS
                log_error "🛑 EMERGENCY STOP: Too many failed repairs ($FAILED_REPAIRS)"
                log_error "System unstable. Aborting."
                generate_html_report "emergency_stop"
                exit 1
            end

            return 1
        end
    end
end

function create_milestone
    set -l loop_num $argv[1]
    set -l tag_name "loop-milestone-$loop_num"
    set -l tag_message "Milestone: Loop $loop_num completed | $SUCCESSFUL_PHASES successful phases"

    git tag -a $tag_name -m "$tag_message" 2>/dev/null
    if test $status -eq 0
        log_success "Git Tag created: $tag_name"
        log_metric "milestone" "$loop_num"
    end
end

function log_summary
    set -l loop_num $argv[1]
    set -l progress_percent (math "round($loop_num * 100 / $MAX_LOOPS)")

    log_msg ""
    log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_msg "📊 ROUND SUMMARY - Bug Hunt Loop $loop_num/$MAX_LOOPS"
    log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_msg "📍 Progress: $progress_percent% complete"

    # Calculate success rate
    if test $TOTAL_PHASES -gt 0
        set -l success_rate (math "round($SUCCESSFUL_PHASES * 100 / $TOTAL_PHASES)")
        log_msg "✅ Success Rate: $success_rate% ($SUCCESSFUL_PHASES/$TOTAL_PHASES loops)"
    end

    # Bugs fixed
    log_msg "🐛 Bugs Fixed: $PHASE_1_SUCCESS"

    # Git stats
    set -l commits_session (git rev-list --count HEAD --since="6 hours ago")
    log_msg "💾 Commits (Session): $commits_session"
    log_msg "📝 Total Changes: +$TOTAL_LINES_ADDED -$TOTAL_LINES_REMOVED lines, $TOTAL_FILES_CHANGED files"

    # Warnings
    if test $FAILED_REPAIRS -gt 0
        log_msg "⚠️  Failed Repairs: $FAILED_REPAIRS/$MAX_FAILED_REPAIRS"
    end

    log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_msg ""
end

function pre_flight_check
    log_msg "🔍 PRE-FLIGHT CHECK INITIATED..."
    log_msg ""

    # Check git repo
    if not test -d .git
        log_error "Git repository not found!"
        return 1
    end
    log_success "Git repository ✓"

    # Check npm
    if not command -q npm
        log_error "npm not found!"
        return 1
    end
    log_success "npm available ✓"

    # Check zclaude function
    if not type -q zclaude
        log_error "zclaude function not found! Make sure Fish config is loaded."
        return 1
    end
    log_success "zclaude function available (Z.ai API) ✓"

    # Check package.json
    if not test -f package.json
        log_error "package.json not found!"
        return 1
    end
    log_success "package.json exists ✓"

    # Initial build check
    log_msg "🏗️  Testing initial build..."
    npm run build > /dev/null 2>&1
    if test $status -ne 0
        log_error "Initial build FAILED! Fix manually before starting."
        return 1
    end
    log_success "Initial build SUCCESS ✓"

    # Check branch
    set -l branch (git branch --show-current)
    log_success "Current branch: $branch ✓"

    # Handle uncommitted changes
    if not git diff --quiet
        log_msg "⚠️  Uncommitted changes detected - committing..."
        git add .
        git commit -m "Pre-Loop: Save working state" --allow-empty
        log_success "Changes committed ✓"
    end

    # Initialize metrics file (JSON Lines format - one JSON object per line)
    echo -n "" > $METRICS_FILE

    log_msg ""
    log_success "PRE-FLIGHT CHECK COMPLETE"
    log_msg ""
    return 0
end

function generate_html_report
    set -l status_type $argv[1]  # "success" or "emergency_stop"

    if not test "$ENABLE_HTML_REPORT" = "true"
        return 0
    end

    set -l report_file "agent_report.html"
    set -l end_time (date "+%Y-%m-%d %H:%M:%S")
    set -l total_commits (git rev-list --count HEAD --since="8 hours ago")
    set -l success_rate 0

    if test $TOTAL_PHASES -gt 0
        set success_rate (math "round($SUCCESSFUL_PHASES * 100 / $TOTAL_PHASES)")
    end

    # Generate HTML Report
    echo "<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Scalesite Bug Hunt Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background: #0a0a0a; color: #fff; padding: 40px 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 60px; }
        .header h1 { font-size: 48px; margin-bottom: 10px; background: linear-gradient(135deg, #4B5AED 0%, #8B5CF6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { color: #888; font-size: 18px; }
        .status { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: 600; margin-top: 20px; }
        .status.success { background: #10B981; color: white; }
        .status.emergency { background: #EF4444; color: white; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px; }
        .card { background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 24px; }
        .card h3 { font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
        .card .value { font-size: 36px; font-weight: 700; color: #fff; }
        .card .subvalue { font-size: 14px; color: #666; margin-top: 8px; }
        .progress-bar { width: 100%; height: 8px; background: #333; border-radius: 4px; overflow: hidden; margin-top: 12px; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #4B5AED 0%, #8B5CF6 100%); transition: width 0.3s ease; }
        .phase-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 12px; margin-top: 20px; }
        .phase { background: #2a2a2a; border-radius: 8px; padding: 16px; text-align: center; }
        .phase .name { font-size: 12px; color: #888; margin-bottom: 8px; }
        .phase .count { font-size: 24px; font-weight: 700; }
        .footer { text-align: center; margin-top: 60px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🔍 Scalesite Bug Hunt Report</h1>
            <p>Autonomous Bug Hunting & Fixing Results</p>
            <div class='status $status_type'>$status_type</div>
        </div>

        <div class='grid'>
            <div class='card'>
                <h3>Total Loops</h3>
                <div class='value'>$TOTAL_PHASES</div>
                <div class='subvalue'>Bug hunting loops executed</div>
            </div>
            <div class='card'>
                <h3>Success Rate</h3>
                <div class='value'>$success_rate%</div>
                <div class='progress-bar'><div class='progress-fill' style='width: $success_rate%'></div></div>
                <div class='subvalue'>$SUCCESSFUL_PHASES successful loops</div>
            </div>
            <div class='card'>
                <h3>Total Commits</h3>
                <div class='value'>$total_commits</div>
                <div class='subvalue'>Last 8 hours</div>
            </div>
            <div class='card'>
                <h3>Code Changes</h3>
                <div class='value' style='color: #10B981'>+$TOTAL_LINES_ADDED</div>
                <div class='value' style='color: #EF4444'>-$TOTAL_LINES_REMOVED</div>
                <div class='subvalue'>$TOTAL_FILES_CHANGED files changed</div>
            </div>
        </div>

        <div class='card'>
            <h3>Bugs Fixed</h3>
            <div class='phase-grid'>
                <div class='phase'>
                    <div class='name'>🐛 Bug Fixes</div>
                    <div class='count'>$PHASE_1_SUCCESS</div>
                </div>
            </div>
        </div>

        <div class='footer'>
            <p>Generated on $end_time</p>
            <p>Scalesite Bug Hunt Agent © 2026</p>
        </div>
    </div>
</body>
</html>" > $report_file

    log_success "HTML Report generated: $report_file"
end

function final_report
    set -l end_time (date "+%Y-%m-%d %H:%M:%S")
    set -l total_commits (git rev-list --count HEAD --since="8 hours ago")

    log_msg ""
    log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_msg "🎉 BUG HUNT FINAL REPORT"
    log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_msg "🏁 End Time: $end_time"
    log_msg "🔄 Bug Hunt Loops: $TOTAL_PHASES"
    log_msg "✅ Successful Loops: $SUCCESSFUL_PHASES"

    if test $TOTAL_PHASES -gt 0
        set -l final_success_rate (math "round($SUCCESSFUL_PHASES * 100 / $TOTAL_PHASES)")
        log_msg "📊 Success Rate: $final_success_rate%"
    end

    log_msg ""
    log_msg "🐛 Bugs Fixed: $PHASE_1_SUCCESS"

    log_msg ""
    log_msg "📝 Code Statistics:"
    log_msg "   💾 Total Commits: $total_commits"
    log_msg "   📝 Lines Added: +$TOTAL_LINES_ADDED"
    log_msg "   📝 Lines Removed: -$TOTAL_LINES_REMOVED"
    log_msg "   📁 Files Changed: $TOTAL_FILES_CHANGED"

    if test $FAILED_REPAIRS -gt 0
        log_msg ""
        log_msg "⚠️  Total Failed Repairs: $FAILED_REPAIRS"
    end

    log_msg ""
    log_msg "📁 Output Files:"
    log_msg "   📄 Main Log: $LOG_FILE"
    if test $FAILED_REPAIRS -gt 0
        log_msg "   📄 Error Log: $ERROR_LOG_FILE"
    end
    log_msg "   📄 Metrics: $METRICS_FILE"
    if test "$ENABLE_HTML_REPORT" = "true"
        log_msg "   📄 HTML Report: agent_report.html"
    end

    log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_msg ""

    # Generate HTML Report
    generate_html_report "success"
end

# ==========================================
# MAIN LOOP
# ==========================================

# Pre-Flight Check
if not pre_flight_check
    echo "❌ Pre-Flight Check failed. Aborting."
    exit 1
end

set START_TIME (date "+%Y-%m-%d %H:%M:%S")
log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_msg "🔍 SCALESITE BUG HUNT v1.0"
log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_msg "⚙️  Configuration:"
log_msg "   • Max Loops: $MAX_LOOPS"
log_msg "   • Focus: Comprehensive Bug Hunting & Fixing"
log_msg "   • Pause: $PAUSE_SECONDS seconds"
log_msg "   • Checkpoints: Every $CHECKPOINT_INTERVAL loops"
log_msg "   • Milestones: Every $MILESTONE_INTERVAL loops"
log_msg "   • HTML Report: $ENABLE_HTML_REPORT"
log_msg "🕐 Start Time: $START_TIME"
log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_msg ""

for i in (seq 1 $MAX_LOOPS)
    log_msg ""
    log_msg "╔═══════════════════════════════════════════════╗"
    log_msg "║  🔄 LOOP $i of $MAX_LOOPS"
    log_msg "╚═══════════════════════════════════════════════╝"
    log_msg ""

    # --- PHASE 1: COMPREHENSIVE BUG HUNT ---
    log_msg "🐛 Phase 1/1: Comprehensive Bug Hunt (All Files)"
    set TOTAL_PHASES (math $TOTAL_PHASES + 1)
    set ADAPTIVE_PROMPT (get_adaptive_prompt $i)
    zclaude -p "$ADAPTIVE_PROMPT" --dangerously-skip-permissions

    if check_and_repair
        update_phase_stats 1
        git add .
        git commit -m "Loop $i/Phase 1: Bug Hunt & Fix" --allow-empty
    else
        log_error "Bug hunt failed - continuing to next loop"
    end

    # --- MILESTONE TAGGING ---
    if test (math "$i % $MILESTONE_INTERVAL") -eq 0
        log_msg ""
        log_msg "🏆 MILESTONE REACHED: Loop $i"
        create_milestone $i
    end

    # --- CHECKPOINT VALIDATION ---
    if test (math "$i % $CHECKPOINT_INTERVAL") -eq 0
        log_msg ""
        log_msg "🔍 ═══ CHECKPOINT $i ═══"
        log_msg "Running Extended Validation..."
        npm run build > /dev/null 2>&1
        if test $status -eq 0
            log_success "Checkpoint Build: PASSED"
            log_metric "checkpoint_$i" "passed"
        else
            log_error "Checkpoint Build: FAILED"
            log_metric "checkpoint_$i" "failed"
        end
    end

    # --- ROUND SUMMARY ---
    log_msg ""
    log_summary $i

    # --- PAUSE ---
    log_msg ""
    log_success "Bug Hunt Loop $i complete"
    if test $i -lt $MAX_LOOPS
        log_msg "☕ Pause for $PAUSE_SECONDS seconds..."
        log_msg ""
        sleep $PAUSE_SECONDS
    end
end

# Final Report
log_msg ""
final_report
log_success "🎉 BUG HUNT COMPLETED!"
