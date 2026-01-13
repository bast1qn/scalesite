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
set MAX_LOOPS 20              # Anzahl der Runden (5 × 5 Phasen = 25 total)
set PAUSE_SECONDS 120         # Pause zwischen Runden
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
set -g PHASE_2_SUCCESS 0
set -g PHASE_3_SUCCESS 0
set -g PHASE_4_SUCCESS 0
set -g PHASE_5_SUCCESS 0

# ==========================================
# ADAPTIVE PROMPT SYSTEM
# ==========================================
# Prompts passen sich an basierend auf Loop-Nummer

function get_adaptive_prompt_1
    set -l loop_num $argv[1]
    set -l base_context "Handle als Senior React QA Engineer für Scalesite.

KONTEXT: Phase 1 von 5 | Loop $loop_num/$MAX_LOOPS"

    # Early Loops (1-7): Focus auf Basics
    if test $loop_num -le 7
        echo "$base_context

FOCUS: FUNDAMENTALS (Early Phase - Aggressive Fixes)

PRIORITÄTEN:
1. React Critical Bugs:
   - useEffect Dependencies (ALLE prüfen!)
   - Memory Leaks (Event Listeners cleanup)
   - Instabile Props causing Re-Renders
   - Falsche Keys in Listen
   - Props Drilling Probleme

2. TypeScript MUSS-Fixes:
   - Eliminiere ALLE 'any' Types (ersetze durch proper types)
   - Fehlende Interfaces für API responses
   - Implicit any in Callbacks
   - Props ohne Types

3. Critical Runtime Errors:
   - undefined/null Zugriffe (Optional Chaining ?. verwenden)
   - Array operations ohne Checks
   - API Error Handling fehlend
   - Form Validation minimal → erweitern!

4. Performance Quick Wins:
   - Inline Functions in JSX Props → useCallback
   - Inline Objects/Arrays in Props → useMemo
   - Große Listen ohne React.memo

STYLE: Aggressiv, viele Fixes, Safety First. Keine Breaking Changes!"

    # Mid Loops (8-14): Focus auf Quality
    else if test $loop_num -le 14
        echo "$base_context

FOCUS: QUALITY IMPROVEMENTS (Mid Phase - Deep Analysis)

PRIORITÄTEN:
1. React Advanced Patterns:
   - Context Performance (Split providers?)
   - Custom Hooks Optimization
   - Ref Usage (useRef vs. state)
   - Suspense Boundaries strategisch
   - Error Boundaries Granularität

2. TypeScript Advanced:
   - Generic Types für wiederverwendbare Components
   - Discriminated Unions für State
   - Type Guards für Runtime Checks
   - Utility Types (Pick, Omit, Partial)

3. Code Robustness:
   - Edge Cases behandeln
   - Fallback States überall
   - Loading States konsistent
   - Error States user-friendly

4. Performance Deep-Dive:
   - Re-Render Patterns analysieren
   - Virtual Scrolling für große Listen?
   - Web Workers für heavy computations?
   - Service Worker für Caching?

STYLE: Analytisch, tiefgehend, keine Quick-Fixes mehr."

    # Late Loops (15-20): Focus auf Polish
    else
        echo "$base_context

FOCUS: POLISH & PERFECTION (Late Phase - Fine-Tuning)

PRIORITÄTEN:
1. React Micro-Optimizations:
   - Alle Components auf Re-Render geprüft?
   - Alle Callbacks mit useCallback?
   - Alle teuren Berechnungen mit useMemo?
   - Alle lazy-loadable Components lazy?

2. TypeScript Perfectionism:
   - Keine impliziten Types mehr
   - Alle Functions mit Return-Type
   - Alle Props mit JSDocs
   - Type Coverage 100%

3. Edge Cases & Polish:
   - Alle User Flows getestet
   - Alle Error States behandelt
   - Alle Loading States smooth
   - Alle Transitions polished

4. Final Performance Check:
   - Bundle Size minimal?
   - First Paint optimiert?
   - TTI (Time to Interactive) gut?
   - Core Web Vitals grün?

STYLE: Perfektionistisch, kein Detail übersehen, Production-Ready!"
    end
end

function get_adaptive_prompt_2
    set -l loop_num $argv[1]
    set -l phase_1_changes $argv[2]

    set -l base_context "Handle als Lead UI/UX Designer (Referenz: Linear, Vercel, Stripe).

KONTEXT: Phase 2 von 5 | Loop $loop_num/$MAX_LOOPS
LIES: $PWD/SCALESITE_AGENT.md

ÄNDERUNGEN IN PHASE 1:
$phase_1_changes"

    if test $loop_num -le 7
        echo "$base_context

FOCUS: FOUNDATION (Visual Basics)

AUFGABEN:
1. Spacing & Hierarchy Fundamentals:
   - Tailwind spacing consistency (4, 6, 8, 12, 16, 20, 24)
   - Font-Sizes Hierarchie: Hero (text-5xl/6xl) → H1 (text-4xl) → Body (text-base)
   - Line-Height: Überschriften (leading-tight/snug) → Body (leading-relaxed)
   - Padding/Margin: Mobile (p-4/6) → Desktop (p-8/12)

2. Interactive States (Basics):
   - Hover: scale-105 ODER brightness-110 (konsistent!)
   - Focus: ring-2 ring-primary/50
   - Active: scale-95
   - Disabled: opacity-50 + cursor-not-allowed

3. Responsive Essentials:
   - Mobile Breakpoints funktionieren? (sm, md, lg, xl)
   - Touch Targets min-h-11 auf Mobile
   - Horizontal Scroll bugs?
   - Font-Sizes reduziert auf Mobile?

4. Color Consistency:
   - Primary (#4B5AED) konsistent?
   - Secondary (#8B5CF6) wo nötig?
   - Text: white auf dark, gray-900 auf light

CONSTRAINTS: KEINE flashy effects, blue-violet theme fix, 0.2-0.5s animations"

    else if test $loop_num -le 14
        echo "$base_context

FOCUS: REFINEMENT (UX Polish)

AUFGABEN:
1. Micro-Interactions:
   - Hover Transitions smooth (200-300ms ease-out)
   - Loading States mit Skeletons (nicht nur Spinner)
   - Success/Error Feedback subtil
   - Page Transitions (falls framer-motion genutzt)

2. Accessibility Deep-Dive:
   - WCAG AA Contrast überall?
   - Focus Indicators sichtbar und schön
   - Alt-Texts für ALLE Bilder
   - ARIA-Labels für Icon-Buttons
   - Keyboard Navigation smooth
   - Screen Reader friendly?

3. Responsive Excellence:
   - Alle Breakpoints nochmal testen
   - Tablet-Ansicht (md) oft vernachlässigt
   - Landscape Mobile?
   - Ultra-wide Desktop (2xl)?
   - Print Styles (optional)?

4. Visual Consistency:
   - Button-Variants konsistent
   - Input-Styles konsistent
   - Card-Styles konsistent
   - Shadow-Styles konsistent

CONSTRAINTS: Design-System strikte einhalten, keine Experimente"

    else
        echo "$base_context

FOCUS: PERFECTION (Design Excellence)

AUFGABEN:
1. Visual Perfection:
   - Jede Pixel perfekt aligned?
   - Spacing überall harmonisch?
   - Font-Weights konsistent?
   - Color-Shades optimal?
   - Icons perfect aligned?

2. Advanced Interactions:
   - Gestures (swipe, drag) wo sinnvoll?
   - Scroll-Animations subtil (AOS, framer)?
   - Parallax wo passend?
   - 3D Transforms minimal (card flips)?

3. Performance vs. Beauty:
   - Animationen GPU-accelerated (transform, opacity)?
   - Images optimiert (webp, lazy)?
   - Fonts optimiert (font-display: swap)?
   - Critical CSS inline?

4. Final Polish:
   - Dark Mode perfekt?
   - Loading States polished?
   - Empty States designed?
   - Error States user-friendly?
   - 404 Page beautiful?

CONSTRAINTS: Production-ready, performance-optimiert, pixel-perfect"
    end
end

function get_adaptive_prompt_3
    set -l loop_num $argv[1]

    set -l base "Handle als Performance Engineer (Web Vitals Spezialist).

KONTEXT: Phase 3 von 5 | Loop $loop_num/$MAX_LOOPS
MISSION: Performance ohne Funktionalität zu ändern."

    if test $loop_num -le 7
        echo "$base

FOCUS: LOW-HANGING FRUITS (Quick Performance Wins)

AUDITS:
1. Bundle Basics:
   - Vite.config.ts manualChunks optimal?
   - Heavy Dependencies lazy loaded?
   - Unused Dependencies in package.json?

2. React Quick Wins:
   - React.memo für Listen-Components
   - useMemo für Sortierungen/Filterungen
   - useCallback für Event Handlers in Loops
   - Inline Functions eliminiert?

3. Asset Quick Fixes:
   - Images mit loading='lazy'
   - SVGs optimiert (SVGO)?
   - Fonts mit font-display: swap
   - CSS/JS minified?

4. API Efficiency:
   - Duplicate API Calls?
   - Missing Caching?
   - Debouncing bei Search?
   - Request Deduplication?

MESSE: Lighthouse Score vor/nach (optional)"

    else if test $loop_num -le 14
        echo "$base

FOCUS: ADVANCED OPTIMIZATION (Deep Performance)

AUDITS:
1. Code Splitting Excellence:
   - Dynamic Imports für Routes
   - Component-Level splitting
   - Vendor splitting optimal
   - Prefetching strategisch

2. React Performance Deep:
   - Context re-render Probleme?
   - Virtual Scrolling für große Listen
   - Web Workers für Calculations
   - Service Workers für Offline

3. Asset Excellence:
   - Image Formats (webp, avif)
   - Responsive Images (srcset)
   - Icon Sprites vs. Individual
   - CSS Critical Path

4. Network Optimization:
   - HTTP/2 Push
   - Compression (gzip, brotli)
   - CDN für Static Assets
   - API Response Caching

MESSE: Core Web Vitals (LCP, FID, CLS)"

    else
        echo "$base

FOCUS: MICRO-OPTIMIZATIONS (Last Mile)

AUDITS:
1. Bundle Perfection:
   - Tree-shaking maximal?
   - Dead Code eliminated?
   - Duplicate Code removed?
   - Size-Limit Budgets?

2. React Perfection:
   - Zero unnecessary re-renders
   - All memoization optimal
   - All lazy-loading maximal
   - All code-splitting perfect

3. Asset Perfection:
   - All images optimized
   - All fonts optimized
   - All CSS optimized
   - All JS optimized

4. Runtime Perfection:
   - Zero memory leaks
   - Zero performance warnings
   - Zero console errors
   - Zero layout shifts

TARGET: Lighthouse 95+, All Metrics Green!"
    end
end

function get_adaptive_prompt_4
    set -l loop_num $argv[1]

    set -l base "Handle als Security Engineer (OWASP Spezialist).

KONTEXT: Phase 4 von 5 | Loop $loop_num/$MAX_LOOPS"

    if test $loop_num -le 7
        echo "$base

FOCUS: CRITICAL SECURITY (Must-Haves)

AUDITS:
1. Input Validation (CRITICAL):
   - Alle Forms validiert?
   - Email-Validation proper
   - Number-Validation mit Min/Max
   - String-Length Limits
   - lib/validation.ts erweitern!

2. XSS Prevention:
   - dangerouslySetInnerHTML Nutzung?
   - User-Content sanitized?
   - URL-Validation vor href/src

3. Auth Basics:
   - Protected Routes wirklich geschützt?
   - Token Storage secure?
   - Session Timeout implementiert?

4. API Security Basics:
   - Error Messages sicher? (keine Info-Leaks)
   - Environment Variables korrekt?
   - Secrets niemals in Code?

FIX: Kritische Security-Lücken SOFORT!"

    else if test $loop_num -le 14
        echo "$base

FOCUS: SECURITY HARDENING (Defense in Depth)

AUDITS:
1. Advanced Input Validation:
   - Schema-Validation (Zod?)
   - Server-side Validation Mirror
   - File Upload Validation
   - SQL Injection Prevention (Supabase RLS?)

2. Advanced XSS/CSRF:
   - Content Security Policy (CSP)?
   - CSRF Tokens (Supabase handles?)
   - Subresource Integrity (SRI)
   - X-Frame-Options

3. Auth Hardening:
   - Password Strength enforcement
   - Rate Limiting Login attempts
   - 2FA Support (optional)
   - Session Management robust

4. Dependency Security:
   - npm audit --production
   - Outdated packages updated?
   - Known Vulnerabilities fixed?

AUDIT: Penetration Testing mindset"

    else
        echo "$base

FOCUS: SECURITY EXCELLENCE (Zero-Trust)

AUDITS:
1. Zero-Trust Validation:
   - Validate EVERYTHING user-controlled
   - Sanitize ALL outputs
   - Escape ALL user-content
   - Trust NOTHING from client

2. Advanced Attacks:
   - Prototype Pollution?
   - ReDoS (Regex DoS)?
   - Race Conditions?
   - Timing Attacks?

3. Privacy & Compliance:
   - PII minimal collected?
   - Data retention policies?
   - Cookie consent proper?
   - GDPR compliant?

4. Security Headers:
   - Strict-Transport-Security
   - X-Content-Type-Options
   - Referrer-Policy
   - Permissions-Policy

TARGET: Zero vulnerabilities, Production-hardened!"
    end
end

function get_adaptive_prompt_5
    set -l loop_num $argv[1]

    set -l base "Handle als Senior Software Architect.

KONTEXT: Phase 5 von 5 | Loop $loop_num/$MAX_LOOPS - CLEANUP TIME"

    if test $loop_num -le 7
        echo "$base

FOCUS: BASIC CLEANUP (Quick Wins)

TASKS:
1. Dead Code:
   - Ungenutzte Imports
   - Auskommentierte Blöcke
   - Unreachable Code
   - Unused Variables

2. DRY Basics:
   - Doppelte className-Patterns
   - Copy-Paste Code in Components
   - Wiederholte Logik → Utils

3. Import Organization:
   - Gruppierung: React → External → Internal → Types
   - Alphabetisch sortiert
   - Relative paths konsistent

4. Light Documentation:
   - Complex Functions mit JSDoc
   - Magic Numbers → Named Constants

CONSTRAINTS: NULL Breaking Changes!"

    else if test $loop_num -le 14
        echo "$base

FOCUS: STRUCTURAL IMPROVEMENTS (Architecture)

TASKS:
1. Component Structure:
   - Components >300 Zeilen splitten
   - Sub-Components extrahieren
   - Presentation vs. Container Separation
   - Props Interface optimization

2. Code Organization:
   - Helper Functions → lib/utils.ts
   - Constants → separate Files
   - Types → types/ Directory
   - Hooks → lib/hooks.ts

3. Readability:
   - Magic Numbers eliminieren
   - Boolean Flags → Enums
   - Long Functions aufbrechen
   - Nested Ternaries → if/else

4. Consistency:
   - Naming Conventions konsistent
   - Event Handler naming konsistent
   - Boolean Prefixes (is/has/should)
   - File naming konsistent

CONSTRAINTS: Keine Funktionsänderungen!"

    else
        echo "$base

FOCUS: ARCHITECTURAL EXCELLENCE (Final Pass)

TASKS:
1. Design Patterns:
   - Singleton wo sinnvoll?
   - Factory Pattern für Components?
   - Observer Pattern für Events?
   - Strategy Pattern für Varianten?

2. Advanced Organization:
   - Barrel Exports (index.ts)
   - Module Boundaries klar
   - Dependency Direction correct
   - Circular Dependencies vermieden

3. Code Excellence:
   - SOLID Principles befolgt?
   - Single Responsibility überall
   - Open/Closed Principle
   - Dependency Inversion

4. Final Documentation:
   - README sections für Features
   - Architecture Decision Records?
   - API Documentation
   - Component Storybook?

TARGET: Enterprise-Grade Code Quality!"
    end
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
        case 2
            set -g PHASE_2_SUCCESS (math $PHASE_2_SUCCESS + 1)
        case 3
            set -g PHASE_3_SUCCESS (math $PHASE_3_SUCCESS + 1)
        case 4
            set -g PHASE_4_SUCCESS (math $PHASE_4_SUCCESS + 1)
        case 5
            set -g PHASE_5_SUCCESS (math $PHASE_5_SUCCESS + 1)
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
    log_msg "📊 ROUND SUMMARY - Loop $loop_num/$MAX_LOOPS"
    log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_msg "📍 Progress: $progress_percent% complete"

    # Calculate success rate
    if test $TOTAL_PHASES -gt 0
        set -l success_rate (math "round($SUCCESSFUL_PHASES * 100 / $TOTAL_PHASES)")
        log_msg "✅ Success Rate: $success_rate% ($SUCCESSFUL_PHASES/$TOTAL_PHASES phases)"
    end

    # Phase breakdown
    log_msg "📦 Phase Success: QA=$PHASE_1_SUCCESS | Design=$PHASE_2_SUCCESS | Perf=$PHASE_3_SUCCESS | Sec=$PHASE_4_SUCCESS | Clean=$PHASE_5_SUCCESS"

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
    <title>Scalesite Agent Report</title>
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
        .phase-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-top: 20px; }
        .phase { background: #2a2a2a; border-radius: 8px; padding: 16px; text-align: center; }
        .phase .name { font-size: 12px; color: #888; margin-bottom: 8px; }
        .phase .count { font-size: 24px; font-weight: 700; }
        .footer { text-align: center; margin-top: 60px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🚀 Scalesite Agent Report</h1>
            <p>Autonomous Development Loop Results</p>
            <div class='status $status_type'>$status_type</div>
        </div>

        <div class='grid'>
            <div class='card'>
                <h3>Total Phases</h3>
                <div class='value'>$TOTAL_PHASES</div>
                <div class='subvalue'>Executed phases</div>
            </div>
            <div class='card'>
                <h3>Success Rate</h3>
                <div class='value'>$success_rate%</div>
                <div class='progress-bar'><div class='progress-fill' style='width: $success_rate%'></div></div>
                <div class='subvalue'>$SUCCESSFUL_PHASES successful</div>
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
            <h3>Phase Breakdown</h3>
            <div class='phase-grid'>
                <div class='phase'>
                    <div class='name'>🐞 QA</div>
                    <div class='count'>$PHASE_1_SUCCESS</div>
                </div>
                <div class='phase'>
                    <div class='name'>🎨 Design</div>
                    <div class='count'>$PHASE_2_SUCCESS</div>
                </div>
                <div class='phase'>
                    <div class='name'>⚡ Performance</div>
                    <div class='count'>$PHASE_3_SUCCESS</div>
                </div>
                <div class='phase'>
                    <div class='name'>🔒 Security</div>
                    <div class='count'>$PHASE_4_SUCCESS</div>
                </div>
                <div class='phase'>
                    <div class='name'>🧹 Cleanup</div>
                    <div class='count'>$PHASE_5_SUCCESS</div>
                </div>
            </div>
        </div>

        <div class='footer'>
            <p>Generated on $end_time</p>
            <p>Scalesite Autonomous Agent © 2026</p>
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
    log_msg "🎉 FINAL REPORT"
    log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_msg "🏁 End Time: $end_time"
    log_msg "🔄 Loops Completed: $MAX_LOOPS"
    log_msg "📦 Total Phases: $TOTAL_PHASES"
    log_msg "✅ Successful Phases: $SUCCESSFUL_PHASES"

    if test $TOTAL_PHASES -gt 0
        set -l final_success_rate (math "round($SUCCESSFUL_PHASES * 100 / $TOTAL_PHASES)")
        log_msg "📊 Final Success Rate: $final_success_rate%"
    end

    log_msg ""
    log_msg "📈 Phase Breakdown:"
    log_msg "   🐞 QA & Type Safety: $PHASE_1_SUCCESS"
    log_msg "   🎨 UI/UX Design: $PHASE_2_SUCCESS"
    log_msg "   ⚡ Performance: $PHASE_3_SUCCESS"
    log_msg "   🔒 Security: $PHASE_4_SUCCESS"
    log_msg "   🧹 Cleanup: $PHASE_5_SUCCESS"

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
log_msg "🚀 SCALESITE PRO-LOOP v2.0"
log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_msg "⚙️  Configuration:"
log_msg "   • Max Loops: $MAX_LOOPS"
log_msg "   • Phases per Loop: 5 (Adaptive Prompts)"
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

    # --- PHASE 1: QA & TYPE SAFETY (ADAPTIVE) ---
    log_msg "🐞 Phase 1/5: React QA & Type Safety (Adaptive)"
    set TOTAL_PHASES (math $TOTAL_PHASES + 1)
    set ADAPTIVE_PROMPT_1 (get_adaptive_prompt_1 $i)
    zclaude -p "$ADAPTIVE_PROMPT_1" --dangerously-skip-permissions

    if check_and_repair
        update_phase_stats 1
        git add .
        git commit -m "Loop $i/Phase 1: QA & Type Safety" --allow-empty
    else
        log_error "Phase 1 failed - skipping rest of loop $i"
        set SKIPPED_PHASES (math $SKIPPED_PHASES + 4)
        continue
    end

    # --- PHASE 2: UI/UX DESIGN (ADAPTIVE + CONTEXT) ---
    log_msg ""
    log_msg "🎨 Phase 2/5: UI/UX Design (Adaptive + Context)"
    set TOTAL_PHASES (math $TOTAL_PHASES + 1)
    set RECENT_CHANGES (git diff HEAD~1 HEAD --stat)
    set ADAPTIVE_PROMPT_2 (get_adaptive_prompt_2 $i "$RECENT_CHANGES")
    zclaude -p "$ADAPTIVE_PROMPT_2" --dangerously-skip-permissions

    if check_and_repair
        update_phase_stats 2
        git add .
        git commit -m "Loop $i/Phase 2: UI/UX Design" --allow-empty
    else
        log_error "Phase 2 failed - skipping rest of loop $i"
        set SKIPPED_PHASES (math $SKIPPED_PHASES + 3)
        continue
    end

    # --- PHASE 3: PERFORMANCE (ADAPTIVE) ---
    log_msg ""
    log_msg "⚡ Phase 3/5: Performance Optimization (Adaptive)"
    set TOTAL_PHASES (math $TOTAL_PHASES + 1)
    set ADAPTIVE_PROMPT_3 (get_adaptive_prompt_3 $i)
    zclaude -p "$ADAPTIVE_PROMPT_3" --dangerously-skip-permissions

    if check_and_repair
        update_phase_stats 3
        git add .
        git commit -m "Loop $i/Phase 3: Performance" --allow-empty
    else
        log_error "Phase 3 failed - skipping rest of loop $i"
        set SKIPPED_PHASES (math $SKIPPED_PHASES + 2)
        continue
    end

    # --- PHASE 4: SECURITY (ADAPTIVE) ---
    log_msg ""
    log_msg "🔒 Phase 4/5: Security & Validation (Adaptive)"
    set TOTAL_PHASES (math $TOTAL_PHASES + 1)
    set ADAPTIVE_PROMPT_4 (get_adaptive_prompt_4 $i)
    zclaude -p "$ADAPTIVE_PROMPT_4" --dangerously-skip-permissions

    if check_and_repair
        update_phase_stats 4
        git add .
        git commit -m "Loop $i/Phase 4: Security" --allow-empty
    else
        log_error "Phase 4 failed - skipping rest of loop $i"
        set SKIPPED_PHASES (math $SKIPPED_PHASES + 1)
        continue
    end

    # --- PHASE 5: ARCHITECTURE (ADAPTIVE) ---
    log_msg ""
    log_msg "🧹 Phase 5/5: Architecture Cleanup (Adaptive)"
    set TOTAL_PHASES (math $TOTAL_PHASES + 1)
    set ADAPTIVE_PROMPT_5 (get_adaptive_prompt_5 $i)
    zclaude -p "$ADAPTIVE_PROMPT_5" --dangerously-skip-permissions

    if check_and_repair
        update_phase_stats 5
        git add .
        git commit -m "Loop $i/Phase 5: Cleanup" --allow-empty
    else
        log_error "Phase 5 failed - continuing to next loop"
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
    log_success "Loop $i complete (5/5 phases)"
    if test $i -lt $MAX_LOOPS
        log_msg "☕ Pause for $PAUSE_SECONDS seconds..."
        log_msg ""
        sleep $PAUSE_SECONDS
    end
end

# Final Report
log_msg ""
final_report
log_success "🎉 PRO-LOOP COMPLETED!"
