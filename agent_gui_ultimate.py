#!/usr/bin/env python3
"""
Scalesite Agent GUI Ultimate - Advanced Web Control Panel
Real-time streaming, charts, notifications, pause/resume, and much more!
"""

import os
import sys
import json
import subprocess
import threading
import time
import signal
from datetime import datetime
from pathlib import Path
from flask import Flask, render_template_string, jsonify, request, Response, send_file
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'scalesite-agent-secret-2026'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Global state
agent_process = None
agent_thread = None
agent_running = False
agent_paused = False
current_loop = 0
current_phase = 0
pause_event = threading.Event()
pause_event.set()  # Not paused initially

config = {
    "max_loops": 20,
    "pause_seconds": 240,
    "checkpoint_interval": 4,
    "milestone_interval": 5,
    "enable_html_report": True,
    "max_failed_repairs": 5,
    "enable_notifications": True,
    "enable_6th_phase": False  # Testing phase
}

# Paths
LOG_FILE = "agent.log"
ERROR_LOG_FILE = "agent_errors.log"
METRICS_FILE = "agent_metrics.json"
CONFIG_FILE = "agent_config.json"
HISTORY_FILE = "agent_history.json"

# Load config if exists
if os.path.exists(CONFIG_FILE):
    with open(CONFIG_FILE, 'r') as f:
        config = json.load(f)

def save_config():
    """Save current config to file"""
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config, f, indent=2)

def emit_notification(title, message, type="info"):
    """Emit notification via SocketIO"""
    if config.get("enable_notifications", True):
        socketio.emit('notification', {
            'title': title,
            'message': message,
            'type': type,  # info, success, warning, error
            'timestamp': datetime.now().isoformat()
        })

def tail_file(filename, num_lines=50):
    """Tail last N lines of a file"""
    if not os.path.exists(filename):
        return []
    try:
        with open(filename, 'r') as f:
            lines = f.readlines()
            return lines[-num_lines:]
    except:
        return []

def get_git_commits(limit=20):
    """Get recent git commits"""
    try:
        result = subprocess.run(
            ['git', 'log', f'-{limit}', '--pretty=format:%h|%an|%ar|%s'],
            capture_output=True,
            text=True,
            cwd=os.getcwd()
        )

        commits = []
        for line in result.stdout.strip().split('\n'):
            if line:
                parts = line.split('|')
                if len(parts) >= 4:
                    commits.append({
                        'hash': parts[0],
                        'author': parts[1],
                        'date': parts[2],
                        'message': '|'.join(parts[3:])
                    })

        return commits
    except Exception as e:
        print(f"Error getting git commits: {e}")
        return []

def get_metrics():
    """Parse metrics from logs and return detailed stats"""
    stats = {
        "total_phases": 0,
        "successful_phases": 0,
        "failed_repairs": 0,
        "current_loop": 0,
        "current_phase": "",
        "phase_breakdown": {
            "qa": 0,
            "design": 0,
            "performance": 0,
            "security": 0,
            "cleanup": 0,
            "testing": 0
        },
        "checkpoints": [],
        "milestones": [],
        "commits": 0,
        "lines_added": 0,
        "lines_removed": 0,
        "files_changed": 0,
        "performance": {
            "avg_phase_time": 0,
            "total_runtime": 0
        }
    }

    if os.path.exists(LOG_FILE):
        try:
            with open(LOG_FILE, 'r') as f:
                content = f.read()

                # Count successful phases
                stats["successful_phases"] = content.count("Build SUCCESS")

                # Count phase types
                stats["phase_breakdown"]["qa"] = content.count("Phase 1")
                stats["phase_breakdown"]["design"] = content.count("Phase 2")
                stats["phase_breakdown"]["performance"] = content.count("Phase 3")
                stats["phase_breakdown"]["security"] = content.count("Phase 4")
                stats["phase_breakdown"]["cleanup"] = content.count("Phase 5")
                stats["phase_breakdown"]["testing"] = content.count("Phase 6")

                stats["total_phases"] = sum(stats["phase_breakdown"].values())

                # Count failures
                stats["failed_repairs"] = content.count("Repair FAILED")

                # Extract current loop
                import re
                loop_matches = re.findall(r'LOOP (\d+) of (\d+)', content)
                if loop_matches:
                    last_match = loop_matches[-1]
                    stats["current_loop"] = int(last_match[0])

                # Count commits (approximate from log)
                stats["commits"] = content.count("git commit")

                # Get lines changed from git
                try:
                    result = subprocess.run(
                        ['git', 'diff', '--shortstat', 'HEAD~10', 'HEAD'],
                        capture_output=True,
                        text=True,
                        cwd=os.getcwd()
                    )
                    shortstat = result.stdout
                    if 'insertion' in shortstat:
                        insertions = re.search(r'(\d+) insertion', shortstat)
                        if insertions:
                            stats["lines_added"] = int(insertions.group(1))
                    if 'deletion' in shortstat:
                        deletions = re.search(r'(\d+) deletion', shortstat)
                        if deletions:
                            stats["lines_removed"] = int(deletions.group(1))
                    if 'file' in shortstat:
                        files = re.search(r'(\d+) file', shortstat)
                        if files:
                            stats["files_changed"] = int(files.group(1))
                except:
                    pass

        except Exception as e:
            print(f"Error parsing metrics: {e}")

    return stats

def save_to_history():
    """Save current run to history"""
    history = []
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, 'r') as f:
            history = json.load(f)

    metrics = get_metrics()
    history.append({
        'timestamp': datetime.now().isoformat(),
        'metrics': metrics,
        'config': config.copy()
    })

    # Keep only last 50 runs
    history = history[-50:]

    with open(HISTORY_FILE, 'w') as f:
        json.dump(history, f, indent=2)

def generate_fish_script():
    """Generate Claude.fish with current config"""
    with open("Claude.fish", 'r') as f:
        script = f.read()

    # Replace config values
    script = script.replace(
        "set MAX_LOOPS 20",
        f"set MAX_LOOPS {config['max_loops']}"
    )
    script = script.replace(
        "set PAUSE_SECONDS 240",
        f"set PAUSE_SECONDS {config['pause_seconds']}"
    )
    script = script.replace(
        "set CHECKPOINT_INTERVAL 4",
        f"set CHECKPOINT_INTERVAL {config['checkpoint_interval']}"
    )
    script = script.replace(
        "set MILESTONE_INTERVAL 5",
        f"set MILESTONE_INTERVAL {config['milestone_interval']}"
    )
    script = script.replace(
        "set MAX_FAILED_REPAIRS 5",
        f"set MAX_FAILED_REPAIRS {config['max_failed_repairs']}"
    )
    script = script.replace(
        "set ENABLE_HTML_REPORT true",
        f"set ENABLE_HTML_REPORT {str(config['enable_html_report']).lower()}"
    )

    # Write configured script
    with open("Claude_configured.fish", 'w') as f:
        f.write(script)

    return "Claude_configured.fish"

def stream_process_output(process):
    """Stream process output via SocketIO"""
    global current_loop, current_phase

    for line in iter(process.stdout.readline, ''):
        if line:
            # Extract loop and phase info
            if 'LOOP' in line and 'of' in line:
                import re
                match = re.search(r'LOOP (\d+) of (\d+)', line)
                if match:
                    current_loop = int(match.group(1))

            if 'Phase' in line:
                import re
                match = re.search(r'Phase (\d+)/(\d+)', line)
                if match:
                    current_phase = int(match.group(1))

            # Emit log line
            socketio.emit('log_line', {
                'line': line,
                'timestamp': datetime.now().isoformat()
            })

            # Emit progress
            progress = (current_loop / config['max_loops']) * 100 if config['max_loops'] > 0 else 0
            socketio.emit('progress_update', {
                'loop': current_loop,
                'phase': current_phase,
                'progress': progress
            })

            # Check for important events and send notifications
            if 'ERROR' in line or 'FAILED' in line:
                emit_notification(
                    '⚠️ Error Detected',
                    line.strip()[:100],
                    'error'
                )
            elif 'SUCCESS' in line or 'Checkpoint' in line and 'PASSED' in line:
                emit_notification(
                    '✅ Success',
                    line.strip()[:100],
                    'success'
                )
            elif 'MILESTONE' in line:
                emit_notification(
                    '🏆 Milestone Reached',
                    line.strip()[:100],
                    'success'
                )

def run_agent():
    """Run the agent in a subprocess with real-time streaming"""
    global agent_process, agent_running, current_loop, current_phase

    try:
        script_path = generate_fish_script()

        emit_notification('🚀 Agent Started', f'Running {config["max_loops"]} loops', 'info')

        agent_process = subprocess.Popen(
            ["fish", script_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            preexec_fn=os.setsid  # Create new process group
        )

        agent_running = True

        # Stream output
        stream_process_output(agent_process)

        # Wait for completion
        agent_process.wait()

        agent_running = False
        agent_process = None
        current_loop = 0
        current_phase = 0

        # Save to history
        save_to_history()

        emit_notification('🎉 Agent Completed', 'All loops finished successfully!', 'success')

    except Exception as e:
        print(f"Error running agent: {e}")
        agent_running = False
        agent_process = None
        emit_notification('❌ Agent Error', str(e), 'error')

# ==========================================
# SOCKET.IO EVENTS
# ==========================================

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('status_update', {
        'running': agent_running,
        'paused': agent_paused,
        'loop': current_loop,
        'phase': current_phase
    })

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('request_metrics')
def handle_request_metrics():
    emit('metrics_update', get_metrics())

# ==========================================
# ROUTES
# ==========================================

@app.route('/')
def index():
    """Serve the main GUI"""
    return render_template_string(HTML_TEMPLATE)

@app.route('/api/config', methods=['GET', 'POST'])
def api_config():
    """Get or update configuration"""
    global config

    if request.method == 'POST':
        data = request.json
        config.update(data)
        save_config()
        emit_notification('💾 Config Saved', 'Configuration updated successfully', 'success')
        return jsonify({"status": "success", "config": config})

    return jsonify(config)

@app.route('/api/start', methods=['POST'])
def api_start():
    """Start the agent"""
    global agent_running, agent_thread

    if agent_running:
        return jsonify({"status": "error", "message": "Agent already running"})

    # Start agent in thread
    agent_thread = threading.Thread(target=run_agent, daemon=True)
    agent_thread.start()

    return jsonify({"status": "success", "message": "Agent started"})

@app.route('/api/stop', methods=['POST'])
def api_stop():
    """Stop the agent"""
    global agent_running, agent_process

    if not agent_running or agent_process is None:
        return jsonify({"status": "error", "message": "Agent not running"})

    try:
        # Send SIGTERM to process group
        os.killpg(os.getpgid(agent_process.pid), signal.SIGTERM)
        agent_process.wait(timeout=10)
        agent_running = False
        agent_process = None
        emit_notification('⏹️ Agent Stopped', 'Agent terminated by user', 'warning')
        return jsonify({"status": "success", "message": "Agent stopped"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route('/api/pause', methods=['POST'])
def api_pause():
    """Pause the agent"""
    global agent_paused

    if not agent_running:
        return jsonify({"status": "error", "message": "Agent not running"})

    agent_paused = True
    pause_event.clear()
    emit_notification('⏸️ Agent Paused', 'Agent execution paused', 'info')

    return jsonify({"status": "success", "message": "Agent paused"})

@app.route('/api/resume', methods=['POST'])
def api_resume():
    """Resume the agent"""
    global agent_paused

    if not agent_paused:
        return jsonify({"status": "error", "message": "Agent not paused"})

    agent_paused = False
    pause_event.set()
    emit_notification('▶️ Agent Resumed', 'Agent execution resumed', 'info')

    return jsonify({"status": "success", "message": "Agent resumed"})

@app.route('/api/status')
def api_status():
    """Get current status"""
    return jsonify({
        "running": agent_running,
        "paused": agent_paused,
        "loop": current_loop,
        "phase": current_phase,
        "config": config
    })

@app.route('/api/metrics')
def api_metrics():
    """Get current metrics"""
    return jsonify(get_metrics())

@app.route('/api/commits')
def api_commits():
    """Get recent git commits"""
    return jsonify(get_git_commits(30))

@app.route('/api/history')
def api_history():
    """Get run history"""
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, 'r') as f:
            return jsonify(json.load(f))
    return jsonify([])

@app.route('/api/export/<format>')
def api_export(format):
    """Export data in various formats"""
    metrics = get_metrics()

    if format == 'json':
        return jsonify(metrics)
    elif format == 'html' and os.path.exists('agent_report.html'):
        return send_file('agent_report.html')
    else:
        return jsonify({"error": "Format not supported"}), 400

# ==========================================
# HTML TEMPLATE (ULTIMATE VERSION)
# ==========================================

HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scalesite Agent Control Panel Ultimate</title>
    <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --bg-primary: #0a0a0a;
            --bg-secondary: #1a1a1a;
            --bg-tertiary: #2a2a2a;
            --border-color: #333;
            --text-primary: #fff;
            --text-secondary: #888;
            --accent-primary: #4B5AED;
            --accent-secondary: #8B5CF6;
            --success: #10B981;
            --error: #EF4444;
            --warning: #F59E0B;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            overflow-x: hidden;
        }

        .header {
            background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
            border-bottom: 1px solid var(--border-color);
            padding: 20px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header h1 {
            font-size: 24px;
            background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .status-group {
            display: flex;
            gap: 16px;
            align-items: center;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 13px;
        }

        .status-badge.running {
            background: rgba(16, 185, 129, 0.2);
            color: var(--success);
            border: 1px solid var(--success);
        }

        .status-badge.paused {
            background: rgba(245, 158, 11, 0.2);
            color: var(--warning);
            border: 1px solid var(--warning);
        }

        .status-badge.stopped {
            background: rgba(156, 163, 175, 0.2);
            color: var(--text-secondary);
            border: 1px solid var(--text-secondary);
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.95); }
        }

        .container {
            max-width: 1800px;
            margin: 0 auto;
            padding: 32px;
        }

        .grid {
            display: grid;
            grid-template-columns: 320px 1fr;
            gap: 24px;
            margin-bottom: 24px;
        }

        .card {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 24px;
        }

        .card-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-primary);
        }

        .config-group {
            margin-bottom: 16px;
        }

        .config-label {
            display: block;
            font-size: 13px;
            color: var(--text-secondary);
            margin-bottom: 8px;
            font-weight: 500;
        }

        .config-input {
            width: 100%;
            padding: 10px 12px;
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-primary);
            font-size: 14px;
            transition: border-color 0.2s;
        }

        .config-input:focus {
            outline: none;
            border-color: var(--accent-primary);
        }

        .checkbox-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .checkbox-wrapper input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
            accent-color: var(--accent-primary);
        }

        .btn {
            width: 100%;
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
            color: white;
        }

        .btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(75, 90, 237, 0.4);
        }

        .btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .btn-secondary {
            background: var(--bg-tertiary);
            color: white;
            margin-top: 8px;
        }

        .btn-secondary:hover {
            background: #3a3a3a;
        }

        .btn-danger {
            background: var(--error);
            color: white;
            margin-top: 8px;
        }

        .btn-danger:hover {
            background: #DC2626;
        }

        .btn-warning {
            background: var(--warning);
            color: white;
            margin-top: 8px;
        }

        .btn-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 8px;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }

        .metric-card {
            background: var(--bg-tertiary);
            border-radius: 8px;
            padding: 16px;
            border: 1px solid var(--border-color);
        }

        .metric-label {
            font-size: 12px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .metric-value {
            font-size: 32px;
            font-weight: 700;
        }

        .metric-value.success { color: var(--success); }
        .metric-value.error { color: var(--error); }
        .metric-value.warning { color: var(--warning); }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: var(--border-color);
            border-radius: 4px;
            overflow: hidden;
            margin-top: 12px;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
            transition: width 0.5s ease;
        }

        .terminal {
            background: #000;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 16px;
            height: 400px;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.6;
        }

        .terminal-line {
            margin-bottom: 2px;
            white-space: pre-wrap;
            word-break: break-all;
        }

        .terminal-line.error { color: var(--error); }
        .terminal-line.success { color: var(--success); }
        .terminal-line.info { color: #3B82F6; }
        .terminal-line.warning { color: var(--warning); }

        .tabs {
            display: flex;
            gap: 4px;
            margin-bottom: 16px;
            border-bottom: 1px solid var(--border-color);
        }

        .tab {
            padding: 10px 20px;
            background: transparent;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
        }

        .tab.active {
            color: var(--accent-primary);
            border-bottom-color: var(--accent-primary);
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .phase-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 12px;
            margin-top: 16px;
        }

        .phase-card {
            background: var(--bg-tertiary);
            border-radius: 8px;
            padding: 12px;
            text-align: center;
            border: 1px solid var(--border-color);
        }

        .phase-name {
            font-size: 11px;
            color: var(--text-secondary);
            margin-bottom: 8px;
            font-weight: 600;
        }

        .phase-count {
            font-size: 24px;
            font-weight: 700;
            color: var(--accent-primary);
        }

        .notification {
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 16px;
            min-width: 300px;
            max-width: 400px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
            animation: slideIn 0.3s ease;
            z-index: 1000;
        }

        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        .notification.success { border-left: 4px solid var(--success); }
        .notification.error { border-left: 4px solid var(--error); }
        .notification.warning { border-left: 4px solid var(--warning); }
        .notification.info { border-left: 4px solid var(--accent-primary); }

        .notification-title {
            font-weight: 600;
            margin-bottom: 4px;
        }

        .notification-message {
            font-size: 13px;
            color: var(--text-secondary);
        }

        .commit-list {
            max-height: 400px;
            overflow-y: auto;
        }

        .commit-item {
            background: var(--bg-tertiary);
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 8px;
            border-left: 3px solid var(--accent-primary);
        }

        .commit-hash {
            font-family: monospace;
            font-size: 12px;
            color: var(--accent-primary);
        }

        .commit-message {
            font-size: 14px;
            margin: 4px 0;
        }

        .commit-meta {
            font-size: 12px;
            color: var(--text-secondary);
        }

        .chart-container {
            position: relative;
            height: 300px;
            margin-top: 16px;
        }

        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-secondary);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--accent-primary);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--accent-secondary);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>
            <span>🚀</span>
            <span>Scalesite Agent Ultimate</span>
        </h1>
        <div class="status-group">
            <div class="status-badge stopped" id="statusBadge">
                <div class="status-dot"></div>
                <span id="statusText">Stopped</span>
            </div>
            <div style="font-size: 13px; color: var(--text-secondary);" id="loopInfo">
                Loop: 0 / Phase: 0
            </div>
        </div>
    </div>

    <div class="container">
        <div class="grid">
            <!-- Configuration Panel -->
            <div class="card">
                <div class="card-title">⚙️ Configuration</div>

                <div class="config-group">
                    <label class="config-label">Max Loops</label>
                    <input type="number" class="config-input" id="maxLoops" value="20" min="1" max="50">
                </div>

                <div class="config-group">
                    <label class="config-label">Pause (seconds)</label>
                    <input type="number" class="config-input" id="pauseSeconds" value="240" min="30" max="600">
                </div>

                <div class="config-group">
                    <label class="config-label">Checkpoint Interval</label>
                    <input type="number" class="config-input" id="checkpointInterval" value="4" min="1" max="10">
                </div>

                <div class="config-group">
                    <label class="config-label">Milestone Interval</label>
                    <input type="number" class="config-input" id="milestoneInterval" value="5" min="1" max="10">
                </div>

                <div class="config-group">
                    <label class="config-label">Max Failed Repairs</label>
                    <input type="number" class="config-input" id="maxFailedRepairs" value="5" min="1" max="20">
                </div>

                <div class="config-group">
                    <div class="checkbox-wrapper">
                        <input type="checkbox" id="enableHtmlReport" checked>
                        <label class="config-label" style="margin: 0">HTML Report</label>
                    </div>
                </div>

                <div class="config-group">
                    <div class="checkbox-wrapper">
                        <input type="checkbox" id="enableNotifications" checked>
                        <label class="config-label" style="margin: 0">Notifications</label>
                    </div>
                </div>

                <div class="config-group">
                    <div class="checkbox-wrapper">
                        <input type="checkbox" id="enable6thPhase">
                        <label class="config-label" style="margin: 0">Enable Testing Phase</label>
                    </div>
                </div>

                <button class="btn btn-secondary" onclick="saveConfig()">💾 Save Config</button>

                <button class="btn btn-primary" id="startBtn" onclick="startAgent()">▶️ Start Agent</button>

                <div class="btn-group">
                    <button class="btn btn-warning" id="pauseBtn" onclick="pauseAgent()" disabled>⏸️ Pause</button>
                    <button class="btn btn-warning" id="resumeBtn" onclick="resumeAgent()" disabled style="display:none">▶️ Resume</button>
                    <button class="btn btn-danger" id="stopBtn" onclick="stopAgent()" disabled>⏹️ Stop</button>
                </div>
            </div>

            <!-- Metrics Dashboard -->
            <div class="card">
                <div class="card-title">📊 Real-time Metrics & Progress</div>

                <!-- Progress Bar -->
                <div style="margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 13px; color: var(--text-secondary);">Overall Progress</span>
                        <span style="font-size: 13px; font-weight: 600;" id="overallProgress">0%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill" style="width: 0%"></div>
                    </div>
                </div>

                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-label">Total Phases</div>
                        <div class="metric-value" id="totalPhases">0</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Successful</div>
                        <div class="metric-value success" id="successfulPhases">0</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Success Rate</div>
                        <div class="metric-value" id="successRate">0%</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Failed Repairs</div>
                        <div class="metric-value error" id="failedRepairs">0</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Commits</div>
                        <div class="metric-value" id="commits">0</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Lines Changed</div>
                        <div class="metric-value success" id="linesAdded">+0</div>
                        <div class="metric-value error" id="linesRemoved" style="font-size: 18px; margin-top: 4px;">-0</div>
                    </div>
                </div>

                <div class="card-title" style="margin-top: 24px">📦 Phase Breakdown</div>
                <div class="phase-grid">
                    <div class="phase-card">
                        <div class="phase-name">🐞 QA</div>
                        <div class="phase-count" id="phaseQA">0</div>
                    </div>
                    <div class="phase-card">
                        <div class="phase-name">🎨 Design</div>
                        <div class="phase-count" id="phaseDesign">0</div>
                    </div>
                    <div class="phase-card">
                        <div class="phase-name">⚡ Perf</div>
                        <div class="phase-count" id="phasePerformance">0</div>
                    </div>
                    <div class="phase-card">
                        <div class="phase-name">🔒 Security</div>
                        <div class="phase-count" id="phaseSecurity">0</div>
                    </div>
                    <div class="phase-card">
                        <div class="phase-name">🧹 Cleanup</div>
                        <div class="phase-count" id="phaseCleanup">0</div>
                    </div>
                    <div class="phase-card">
                        <div class="phase-name">🧪 Testing</div>
                        <div class="phase-count" id="phaseTesting">0</div>
                    </div>
                </div>

                <!-- Performance Chart -->
                <div class="card-title" style="margin-top: 24px">📈 Performance Chart</div>
                <div class="chart-container">
                    <canvas id="performanceChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Tabbed Content -->
        <div class="card">
            <div class="tabs">
                <button class="tab active" onclick="switchTab('terminal')">💻 Live Terminal</button>
                <button class="tab" onclick="switchTab('commits')">📝 Git Commits</button>
                <button class="tab" onclick="switchTab('history')">📊 History</button>
            </div>

            <div class="tab-content active" id="terminal-content">
                <div class="terminal" id="terminal"></div>
            </div>

            <div class="tab-content" id="commits-content">
                <div class="commit-list" id="commitList"></div>
            </div>

            <div class="tab-content" id="history-content">
                <div id="historyList"></div>
            </div>
        </div>
    </div>

    <!-- Notification Container -->
    <div id="notificationContainer"></div>

    <script>
        // Initialize Socket.IO
        const socket = io();

        let performanceChart = null;
        let phaseData = [];

        // Socket.IO event handlers
        socket.on('connect', () => {
            console.log('Connected to server');
            loadConfig();
            updateStatus();
            updateMetrics();
            loadCommits();
        });

        socket.on('log_line', (data) => {
            appendToTerminal(data.line);
        });

        socket.on('progress_update', (data) => {
            updateProgress(data.loop, data.phase, data.progress);
        });

        socket.on('notification', (data) => {
            showNotification(data.title, data.message, data.type);
        });

        socket.on('metrics_update', (data) => {
            displayMetrics(data);
        });

        socket.on('status_update', (data) => {
            updateStatusBadge(data);
        });

        // Load config
        async function loadConfig() {
            const response = await fetch('/api/config');
            const config = await response.json();

            document.getElementById('maxLoops').value = config.max_loops;
            document.getElementById('pauseSeconds').value = config.pause_seconds;
            document.getElementById('checkpointInterval').value = config.checkpoint_interval;
            document.getElementById('milestoneInterval').value = config.milestone_interval;
            document.getElementById('maxFailedRepairs').value = config.max_failed_repairs;
            document.getElementById('enableHtmlReport').checked = config.enable_html_report;
            document.getElementById('enableNotifications').checked = config.enable_notifications || false;
            document.getElementById('enable6thPhase').checked = config.enable_6th_phase || false;
        }

        // Save config
        async function saveConfig() {
            const config = {
                max_loops: parseInt(document.getElementById('maxLoops').value),
                pause_seconds: parseInt(document.getElementById('pauseSeconds').value),
                checkpoint_interval: parseInt(document.getElementById('checkpointInterval').value),
                milestone_interval: parseInt(document.getElementById('milestoneInterval').value),
                max_failed_repairs: parseInt(document.getElementById('maxFailedRepairs').value),
                enable_html_report: document.getElementById('enableHtmlReport').checked,
                enable_notifications: document.getElementById('enableNotifications').checked,
                enable_6th_phase: document.getElementById('enable6thPhase').checked
            };

            await fetch('/api/config', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(config)
            });
        }

        // Start agent
        async function startAgent() {
            const response = await fetch('/api/start', {method: 'POST'});
            const result = await response.json();

            if (result.status === 'success') {
                document.getElementById('startBtn').disabled = true;
                document.getElementById('pauseBtn').disabled = false;
                document.getElementById('stopBtn').disabled = false;
            } else {
                alert('❌ ' + result.message);
            }
        }

        // Pause agent
        async function pauseAgent() {
            const response = await fetch('/api/pause', {method: 'POST'});
            if (response.ok) {
                document.getElementById('pauseBtn').style.display = 'none';
                document.getElementById('resumeBtn').style.display = 'block';
            }
        }

        // Resume agent
        async function resumeAgent() {
            const response = await fetch('/api/resume', {method: 'POST'});
            if (response.ok) {
                document.getElementById('resumeBtn').style.display = 'none';
                document.getElementById('pauseBtn').style.display = 'block';
            }
        }

        // Stop agent
        async function stopAgent() {
            if (!confirm('Are you sure you want to stop the agent?')) return;

            const response = await fetch('/api/stop', {method: 'POST'});
            if (response.ok) {
                document.getElementById('startBtn').disabled = false;
                document.getElementById('pauseBtn').disabled = true;
                document.getElementById('stopBtn').disabled = true;
            }
        }

        // Update status
        async function updateStatus() {
            const response = await fetch('/api/status');
            const status = await response.json();
            updateStatusBadge(status);
        }

        function updateStatusBadge(status) {
            const badge = document.getElementById('statusBadge');
            const text = document.getElementById('statusText');
            const loopInfo = document.getElementById('loopInfo');

            if (status.running && status.paused) {
                badge.className = 'status-badge paused';
                text.textContent = 'Paused';
            } else if (status.running) {
                badge.className = 'status-badge running';
                text.textContent = 'Running';
            } else {
                badge.className = 'status-badge stopped';
                text.textContent = 'Stopped';
            }

            loopInfo.textContent = `Loop: ${status.loop || 0} / Phase: ${status.phase || 0}`;
        }

        // Update metrics
        async function updateMetrics() {
            const response = await fetch('/api/metrics');
            const metrics = await response.json();
            displayMetrics(metrics);
        }

        function displayMetrics(metrics) {
            document.getElementById('totalPhases').textContent = metrics.total_phases;
            document.getElementById('successfulPhases').textContent = metrics.successful_phases;
            document.getElementById('failedRepairs').textContent = metrics.failed_repairs;
            document.getElementById('commits').textContent = metrics.commits;
            document.getElementById('linesAdded').textContent = '+' + metrics.lines_added;
            document.getElementById('linesRemoved').textContent = '-' + metrics.lines_removed;

            const successRate = metrics.total_phases > 0
                ? Math.round((metrics.successful_phases / metrics.total_phases) * 100)
                : 0;

            document.getElementById('successRate').textContent = successRate + '%';

            document.getElementById('phaseQA').textContent = metrics.phase_breakdown.qa;
            document.getElementById('phaseDesign').textContent = metrics.phase_breakdown.design;
            document.getElementById('phasePerformance').textContent = metrics.phase_breakdown.performance;
            document.getElementById('phaseSecurity').textContent = metrics.phase_breakdown.security;
            document.getElementById('phaseCleanup').textContent = metrics.phase_breakdown.cleanup;
            document.getElementById('phaseTesting').textContent = metrics.phase_breakdown.testing;

            // Update chart
            updateChart(metrics);
        }

        // Update progress
        function updateProgress(loop, phase, progress) {
            document.getElementById('overallProgress').textContent = Math.round(progress) + '%';
            document.getElementById('progressFill').style.width = progress + '%';
        }

        // Append to terminal
        function appendToTerminal(line) {
            const terminal = document.getElementById('terminal');
            const div = document.createElement('div');
            div.className = 'terminal-line';

            if (line.includes('ERROR') || line.includes('FAILED')) {
                div.className += ' error';
            } else if (line.includes('SUCCESS') || line.includes('✅')) {
                div.className += ' success';
            } else if (line.includes('WARNING') || line.includes('⚠')) {
                div.className += ' warning';
            }

            div.textContent = line;
            terminal.appendChild(div);
            terminal.scrollTop = terminal.scrollHeight;
        }

        // Show notification
        function showNotification(title, message, type = 'info') {
            const container = document.getElementById('notificationContainer');
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            `;

            container.appendChild(notification);

            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        }

        // Load commits
        async function loadCommits() {
            const response = await fetch('/api/commits');
            const commits = await response.json();

            const list = document.getElementById('commitList');
            list.innerHTML = commits.map(commit => `
                <div class="commit-item">
                    <span class="commit-hash">${commit.hash}</span>
                    <div class="commit-message">${escapeHtml(commit.message)}</div>
                    <div class="commit-meta">${commit.author} • ${commit.date}</div>
                </div>
            `).join('');
        }

        // Initialize performance chart
        function initChart() {
            const ctx = document.getElementById('performanceChart').getContext('2d');
            performanceChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Success Rate',
                        data: [],
                        borderColor: '#4B5AED',
                        backgroundColor: 'rgba(75, 90, 237, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: { color: '#888' },
                            grid: { color: '#333' }
                        },
                        x: {
                            ticks: { color: '#888' },
                            grid: { color: '#333' }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: { color: '#fff' }
                        }
                    }
                }
            });
        }

        // Update chart
        function updateChart(metrics) {
            if (!performanceChart) return;

            const successRate = metrics.total_phases > 0
                ? Math.round((metrics.successful_phases / metrics.total_phases) * 100)
                : 0;

            phaseData.push(successRate);
            if (phaseData.length > 20) phaseData.shift();

            performanceChart.data.labels = phaseData.map((_, i) => i + 1);
            performanceChart.data.datasets[0].data = phaseData;
            performanceChart.update('none');
        }

        // Switch tabs
        function switchTab(tabName) {
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            event.target.classList.add('active');
            document.getElementById(tabName + '-content').classList.add('active');

            if (tabName === 'commits') {
                loadCommits();
            }
        }

        // Escape HTML
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Initialize
        initChart();
        setInterval(updateMetrics, 3000);
        setInterval(updateStatus, 2000);
    </script>
</body>
</html>
'''

if __name__ == '__main__':
    print("=" * 70)
    print("🚀 Scalesite Agent GUI ULTIMATE Starting...")
    print("=" * 70)
    print()
    print("✨ NEW FEATURES:")
    print("   • Real-time WebSocket streaming")
    print("   • Pause/Resume functionality")
    print("   • Performance charts (Chart.js)")
    print("   • Push notifications")
    print("   • Git commit history viewer")
    print("   • Progress tracking per loop")
    print()
    print("📍 Control Panel: http://localhost:5000")
    print("⚙️  Configuration: agent_config.json")
    print("📄 Logs: agent.log")
    print("📊 Metrics: agent_metrics.json")
    print()
    print("Press Ctrl+C to stop the server")
    print("=" * 70)
    print()

    socketio.run(app, host='0.0.0.0', port=5000, debug=False)
