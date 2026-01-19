#!/usr/bin/env python3
"""
Scalesite Agent GUI - Web-based Control Panel
Provides a beautiful web interface to control the autonomous development loop
"""

import os
import sys
import json
import subprocess
import threading
import time
from datetime import datetime
from pathlib import Path
from flask import Flask, render_template_string, jsonify, request, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Global state
agent_process = None
agent_running = False
agent_paused = False
config = {
    "max_loops": 20,
    "pause_seconds": 240,
    "checkpoint_interval": 4,
    "milestone_interval": 5,
    "enable_html_report": True,
    "max_failed_repairs": 5
}

# Paths
LOG_FILE = "agent.log"
ERROR_LOG_FILE = "agent_errors.log"
METRICS_FILE = "agent_metrics.json"
CONFIG_FILE = "agent_config.json"

# Load config if exists
if os.path.exists(CONFIG_FILE):
    with open(CONFIG_FILE, 'r') as f:
        config = json.load(f)

def save_config():
    """Save current config to file"""
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config, f, indent=2)

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

def get_metrics():
    """Parse metrics from JSON file"""
    if not os.path.exists(METRICS_FILE):
        return {
            "total_phases": 0,
            "successful_phases": 0,
            "failed_repairs": 0,
            "phase_breakdown": {
                "qa": 0,
                "design": 0,
                "performance": 0,
                "security": 0,
                "cleanup": 0
            },
            "checkpoints": [],
            "milestones": []
        }

    try:
        # Parse agent.log for statistics
        stats = {
            "total_phases": 0,
            "successful_phases": 0,
            "failed_repairs": 0,
            "phase_breakdown": {
                "qa": 0,
                "design": 0,
                "performance": 0,
                "security": 0,
                "cleanup": 0
            },
            "checkpoints": [],
            "milestones": []
        }

        if os.path.exists(LOG_FILE):
            with open(LOG_FILE, 'r') as f:
                content = f.read()

                # Count successful phases
                stats["successful_phases"] = content.count("Build SUCCESS")

                # Count phase types (approximate)
                stats["phase_breakdown"]["qa"] = content.count("Phase 1: QA")
                stats["phase_breakdown"]["design"] = content.count("Phase 2: UI/UX")
                stats["phase_breakdown"]["performance"] = content.count("Phase 3: Performance")
                stats["phase_breakdown"]["security"] = content.count("Phase 4: Security")
                stats["phase_breakdown"]["cleanup"] = content.count("Phase 5: Cleanup")

                stats["total_phases"] = sum(stats["phase_breakdown"].values())

                # Count failures
                stats["failed_repairs"] = content.count("Repair FAILED")

        return stats
    except Exception as e:
        print(f"Error parsing metrics: {e}")
        return {"error": str(e)}

def generate_fish_script():
    """Generate Claude.fish with current config"""
    # Read the template
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

def run_agent():
    """Run the agent in a subprocess"""
    global agent_process, agent_running

    try:
        # Generate configured script
        script_path = generate_fish_script()

        # Run fish script
        agent_process = subprocess.Popen(
            ["fish", script_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )

        agent_running = True

        # Wait for completion
        agent_process.wait()
        agent_running = False
        agent_process = None

    except Exception as e:
        print(f"Error running agent: {e}")
        agent_running = False
        agent_process = None

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
        return jsonify({"status": "success", "config": config})

    return jsonify(config)

@app.route('/api/start', methods=['POST'])
def api_start():
    """Start the agent"""
    global agent_running, agent_process

    if agent_running:
        return jsonify({"status": "error", "message": "Agent already running"})

    # Start agent in thread
    thread = threading.Thread(target=run_agent, daemon=True)
    thread.start()

    return jsonify({"status": "success", "message": "Agent started"})

@app.route('/api/stop', methods=['POST'])
def api_stop():
    """Stop the agent"""
    global agent_running, agent_process

    if not agent_running or agent_process is None:
        return jsonify({"status": "error", "message": "Agent not running"})

    try:
        agent_process.terminate()
        agent_process.wait(timeout=5)
        agent_running = False
        agent_process = None
        return jsonify({"status": "success", "message": "Agent stopped"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route('/api/status')
def api_status():
    """Get current status"""
    return jsonify({
        "running": agent_running,
        "paused": agent_paused,
        "config": config
    })

@app.route('/api/logs')
def api_logs():
    """Get recent logs"""
    logs = tail_file(LOG_FILE, 100)
    errors = tail_file(ERROR_LOG_FILE, 50)

    return jsonify({
        "logs": logs,
        "errors": errors
    })

@app.route('/api/metrics')
def api_metrics():
    """Get current metrics"""
    return jsonify(get_metrics())

@app.route('/api/logs/stream')
def api_logs_stream():
    """Stream logs in real-time (SSE)"""
    def generate():
        last_position = 0
        while True:
            if os.path.exists(LOG_FILE):
                with open(LOG_FILE, 'r') as f:
                    f.seek(last_position)
                    new_lines = f.readlines()
                    last_position = f.tell()

                    for line in new_lines:
                        yield f"data: {json.dumps({'log': line})}\n\n"

            time.sleep(1)

    return Response(generate(), mimetype='text/event-stream')

# ==========================================
# HTML TEMPLATE
# ==========================================

HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scalesite Agent Control Panel</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: #0a0a0a;
            color: #fff;
            overflow-x: hidden;
        }

        .header {
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            border-bottom: 1px solid #333;
            padding: 24px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header h1 {
            font-size: 28px;
            background: linear-gradient(135deg, #4B5AED 0%, #8B5CF6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
        }

        .status-badge.running {
            background: rgba(16, 185, 129, 0.2);
            color: #10B981;
            border: 1px solid #10B981;
        }

        .status-badge.stopped {
            background: rgba(156, 163, 175, 0.2);
            color: #9CA3AF;
            border: 1px solid #9CA3AF;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
        }

        .status-badge.running .status-dot {
            background: #10B981;
        }

        .status-badge.stopped .status-dot {
            background: #9CA3AF;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .container {
            max-width: 1600px;
            margin: 0 auto;
            padding: 40px;
        }

        .grid {
            display: grid;
            grid-template-columns: 350px 1fr;
            gap: 24px;
            margin-bottom: 24px;
        }

        .card {
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 24px;
        }

        .card-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .config-group {
            margin-bottom: 20px;
        }

        .config-label {
            display: block;
            font-size: 14px;
            color: #888;
            margin-bottom: 8px;
        }

        .config-input {
            width: 100%;
            padding: 10px 12px;
            background: #0a0a0a;
            border: 1px solid #333;
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
        }

        .config-input:focus {
            outline: none;
            border-color: #4B5AED;
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
        }

        .btn {
            width: 100%;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .btn-primary {
            background: linear-gradient(135deg, #4B5AED 0%, #8B5CF6 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(75, 90, 237, 0.4);
        }

        .btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .btn-danger {
            background: #EF4444;
            color: white;
            margin-top: 12px;
        }

        .btn-danger:hover {
            background: #DC2626;
        }

        .btn-secondary {
            background: #2a2a2a;
            color: white;
            margin-top: 12px;
        }

        .btn-secondary:hover {
            background: #3a3a3a;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }

        .metric-card {
            background: #2a2a2a;
            border-radius: 8px;
            padding: 16px;
        }

        .metric-label {
            font-size: 12px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }

        .metric-value {
            font-size: 32px;
            font-weight: 700;
        }

        .metric-value.success {
            color: #10B981;
        }

        .metric-value.error {
            color: #EF4444;
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: #333;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 12px;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4B5AED 0%, #8B5CF6 100%);
            transition: width 0.3s ease;
        }

        .log-viewer {
            background: #0a0a0a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 16px;
            height: 500px;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.6;
        }

        .log-line {
            margin-bottom: 4px;
            white-space: pre-wrap;
            word-break: break-all;
        }

        .log-line.error {
            color: #EF4444;
        }

        .log-line.success {
            color: #10B981;
        }

        .log-line.info {
            color: #3B82F6;
        }

        .tabs {
            display: flex;
            gap: 4px;
            margin-bottom: 16px;
            border-bottom: 1px solid #333;
        }

        .tab {
            padding: 10px 20px;
            background: transparent;
            border: none;
            color: #888;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
        }

        .tab.active {
            color: #4B5AED;
            border-bottom-color: #4B5AED;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .phase-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 12px;
            margin-top: 16px;
        }

        .phase-card {
            background: #2a2a2a;
            border-radius: 8px;
            padding: 12px;
            text-align: center;
        }

        .phase-name {
            font-size: 12px;
            color: #888;
            margin-bottom: 8px;
        }

        .phase-count {
            font-size: 24px;
            font-weight: 700;
            color: #4B5AED;
        }

        .footer {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-top: 60px;
            padding: 20px;
        }

        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: #1a1a1a;
        }

        ::-webkit-scrollbar-thumb {
            background: #4B5AED;
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #5C6FFF;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Scalesite Agent Control Panel</h1>
        <div class="status-badge stopped" id="statusBadge">
            <div class="status-dot"></div>
            <span id="statusText">Stopped</span>
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
                        <label class="config-label" style="margin: 0">Enable HTML Report</label>
                    </div>
                </div>

                <button class="btn btn-secondary" onclick="saveConfig()">💾 Save Config</button>
                <button class="btn btn-primary" id="startBtn" onclick="startAgent()">▶️ Start Agent</button>
                <button class="btn btn-danger" id="stopBtn" onclick="stopAgent()" disabled>⏹️ Stop Agent</button>
            </div>

            <!-- Metrics Dashboard -->
            <div class="card">
                <div class="card-title">📊 Real-time Metrics</div>

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
                        <div class="progress-bar">
                            <div class="progress-fill" id="successProgress" style="width: 0%"></div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Failed Repairs</div>
                        <div class="metric-value error" id="failedRepairs">0</div>
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
                </div>
            </div>
        </div>

        <!-- Log Viewer -->
        <div class="card">
            <div class="tabs">
                <button class="tab active" onclick="switchTab('main-logs')">📄 Main Logs</button>
                <button class="tab" onclick="switchTab('error-logs')">❌ Error Logs</button>
            </div>

            <div class="tab-content active" id="main-logs">
                <div class="log-viewer" id="mainLogViewer"></div>
            </div>

            <div class="tab-content" id="error-logs">
                <div class="log-viewer" id="errorLogViewer"></div>
            </div>
        </div>

        <div class="footer">
            <p>Scalesite Agent Control Panel v2.0</p>
            <p>Autonomous Development Loop © 2026</p>
        </div>
    </div>

    <script>
        let updateInterval = null;

        // Load config on page load
        async function loadConfig() {
            const response = await fetch('/api/config');
            const config = await response.json();

            document.getElementById('maxLoops').value = config.max_loops;
            document.getElementById('pauseSeconds').value = config.pause_seconds;
            document.getElementById('checkpointInterval').value = config.checkpoint_interval;
            document.getElementById('milestoneInterval').value = config.milestone_interval;
            document.getElementById('maxFailedRepairs').value = config.max_failed_repairs;
            document.getElementById('enableHtmlReport').checked = config.enable_html_report;
        }

        // Save config
        async function saveConfig() {
            const config = {
                max_loops: parseInt(document.getElementById('maxLoops').value),
                pause_seconds: parseInt(document.getElementById('pauseSeconds').value),
                checkpoint_interval: parseInt(document.getElementById('checkpointInterval').value),
                milestone_interval: parseInt(document.getElementById('milestoneInterval').value),
                max_failed_repairs: parseInt(document.getElementById('maxFailedRepairs').value),
                enable_html_report: document.getElementById('enableHtmlReport').checked
            };

            await fetch('/api/config', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(config)
            });

            alert('✅ Configuration saved!');
        }

        // Start agent
        async function startAgent() {
            const response = await fetch('/api/start', {method: 'POST'});
            const result = await response.json();

            if (result.status === 'success') {
                document.getElementById('startBtn').disabled = true;
                document.getElementById('stopBtn').disabled = false;
                startUpdates();
            } else {
                alert('❌ ' + result.message);
            }
        }

        // Stop agent
        async function stopAgent() {
            if (!confirm('Are you sure you want to stop the agent?')) return;

            const response = await fetch('/api/stop', {method: 'POST'});
            const result = await response.json();

            if (result.status === 'success') {
                document.getElementById('startBtn').disabled = false;
                document.getElementById('stopBtn').disabled = true;
                stopUpdates();
            }
        }

        // Update status
        async function updateStatus() {
            const response = await fetch('/api/status');
            const status = await response.json();

            const badge = document.getElementById('statusBadge');
            const text = document.getElementById('statusText');

            if (status.running) {
                badge.className = 'status-badge running';
                text.textContent = 'Running';
                document.getElementById('startBtn').disabled = true;
                document.getElementById('stopBtn').disabled = false;
            } else {
                badge.className = 'status-badge stopped';
                text.textContent = 'Stopped';
                document.getElementById('startBtn').disabled = false;
                document.getElementById('stopBtn').disabled = true;
            }
        }

        // Update logs
        async function updateLogs() {
            const response = await fetch('/api/logs');
            const data = await response.json();

            const mainViewer = document.getElementById('mainLogViewer');
            const errorViewer = document.getElementById('errorLogViewer');

            mainViewer.innerHTML = data.logs.map(line => {
                let className = 'log-line';
                if (line.includes('ERROR')) className += ' error';
                else if (line.includes('SUCCESS')) className += ' success';
                else if (line.includes('INFO')) className += ' info';
                return `<div class="${className}">${escapeHtml(line)}</div>`;
            }).join('');

            errorViewer.innerHTML = data.errors.map(line => {
                return `<div class="log-line error">${escapeHtml(line)}</div>`;
            }).join('');

            // Auto-scroll to bottom
            mainViewer.scrollTop = mainViewer.scrollHeight;
            errorViewer.scrollTop = errorViewer.scrollHeight;
        }

        // Update metrics
        async function updateMetrics() {
            const response = await fetch('/api/metrics');
            const metrics = await response.json();

            document.getElementById('totalPhases').textContent = metrics.total_phases;
            document.getElementById('successfulPhases').textContent = metrics.successful_phases;
            document.getElementById('failedRepairs').textContent = metrics.failed_repairs;

            const successRate = metrics.total_phases > 0
                ? Math.round((metrics.successful_phases / metrics.total_phases) * 100)
                : 0;

            document.getElementById('successRate').textContent = successRate + '%';
            document.getElementById('successProgress').style.width = successRate + '%';

            document.getElementById('phaseQA').textContent = metrics.phase_breakdown.qa;
            document.getElementById('phaseDesign').textContent = metrics.phase_breakdown.design;
            document.getElementById('phasePerformance').textContent = metrics.phase_breakdown.performance;
            document.getElementById('phaseSecurity').textContent = metrics.phase_breakdown.security;
            document.getElementById('phaseCleanup').textContent = metrics.phase_breakdown.cleanup;
        }

        // Switch tabs
        function switchTab(tabId) {
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            event.target.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        }

        // Escape HTML
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Start periodic updates
        function startUpdates() {
            if (updateInterval) return;
            updateInterval = setInterval(() => {
                updateStatus();
                updateLogs();
                updateMetrics();
            }, 2000); // Update every 2 seconds
        }

        // Stop periodic updates
        function stopUpdates() {
            if (updateInterval) {
                clearInterval(updateInterval);
                updateInterval = null;
            }
        }

        // Initialize
        loadConfig();
        updateStatus();
        updateLogs();
        updateMetrics();
        startUpdates();
    </script>
</body>
</html>
'''

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Scalesite Agent GUI Starting...")
    print("=" * 60)
    print()
    print("📍 Control Panel: http://localhost:5000")
    print("⚙️  Configuration file: agent_config.json")
    print("📄 Logs: agent.log")
    print("❌ Error logs: agent_errors.log")
    print("📊 Metrics: agent_metrics.json")
    print()
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    print()

    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
