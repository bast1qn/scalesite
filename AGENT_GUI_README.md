# 🚀 Scalesite Agent GUI

**Web-based Control Panel** für den autonomen Development Loop

![Control Panel](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-lightgrey)

---

## ✨ Features

### 🎛️ **Full Control Panel**
- ⚙️ **Live Configuration** - Ändere alle Parameter in der GUI
- ▶️ **Start/Stop Controls** - Volle Kontrolle über den Agent
- 📊 **Real-time Metrics** - Live Dashboard mit allen Stats
- 📄 **Log Viewer** - Scrollbare Logs mit Auto-Update
- 💾 **Config Persistence** - Einstellungen werden gespeichert

### 📊 **Live Metrics Dashboard**
- **Total Phases** - Anzahl ausgeführter Phasen
- **Success Rate** - Mit animierter Progress Bar
- **Failed Repairs** - Error Counter
- **Phase Breakdown** - 5 Karten für QA/Design/Perf/Security/Cleanup

### 📄 **Dual Log Viewer**
- **Main Logs** - Kompletter Agent-Output
- **Error Logs** - Nur Fehler und Warnings
- **Auto-Scroll** - Scrollt automatisch zu neuesten Logs
- **Syntax Highlighting** - Errors rot, Success grün

### 🎨 **Beautiful Design**
- **Scalesite Theme** - Blue-Violet Gradient Design
- **Dark Mode** - Professionelles Dark UI
- **Responsive** - Funktioniert auf allen Bildschirmgrößen
- **Smooth Animations** - Butter-smooth Transitions

---

## 🚀 Installation

### 1. **Python Dependencies installieren**

```bash
pip install -r requirements.txt
```

### 2. **GUI starten**

```bash
python3 agent_gui.py
```

### 3. **Browser öffnen**

```
http://localhost:5000
```

---

## 🎮 Verwendung

### **Konfiguration**

Passe die Parameter in der linken Sidebar an:

- **Max Loops** (1-50): Anzahl der Durchläufe
- **Pause Seconds** (30-600): Pause zwischen Loops
- **Checkpoint Interval** (1-10): Checkpoints alle X Loops
- **Milestone Interval** (1-10): Git Tags alle X Loops
- **Max Failed Repairs** (1-20): Emergency Stop Schwelle
- **Enable HTML Report**: HTML Report am Ende generieren

Klicke **💾 Save Config** um die Einstellungen zu speichern.

### **Agent starten**

1. Klicke **▶️ Start Agent**
2. Der Status Badge oben rechts wird grün: **Running**
3. Logs und Metrics updaten sich automatisch alle 2 Sekunden

### **Agent stoppen**

1. Klicke **⏹️ Stop Agent**
2. Bestätige die Warnung
3. Der Agent wird gracefully beendet

### **Logs ansehen**

Wechsle zwischen zwei Tabs:

- **📄 Main Logs** - Kompletter Output
- **❌ Error Logs** - Nur Errors

Die Logs scrollen automatisch mit und highlighten:
- 🟢 Grün = Success Messages
- 🔴 Rot = Error Messages
- 🔵 Blau = Info Messages

---

## 📁 Datei-Struktur

```
scalesite/
├── agent_gui.py              # Flask Web Server
├── requirements.txt          # Python Dependencies
├── Claude.fish               # Original Agent Script (Template)
├── Claude_configured.fish    # Auto-generiertes Script (von GUI)
├── agent_config.json         # Gespeicherte Config
├── agent.log                 # Haupt-Log
├── agent_errors.log          # Error-Log
├── agent_metrics.json        # Metriken
└── agent_report.html         # HTML Report (nach Completion)
```

---

## 🔧 Technische Details

### **Backend: Python Flask**
- REST API für alle Controls
- Real-time Log Streaming (Polling alle 2s)
- Subprocess Management für Fish Script
- Config Persistence via JSON

### **Frontend: Vanilla JS**
- Kein Framework-Overhead
- Fetch API für REST Calls
- Auto-Update Loop (2 Sekunden Interval)
- Responsive Grid Layout

### **Communication Flow**

```
Browser (GUI) ←→ Flask Server ←→ Fish Script ←→ Claude CLI
                                      ↓
                                 Log Files
                                      ↓
                                 Metrics JSON
```

---

## 🎯 API Endpoints

### **GET /api/config**
Returns current configuration

```json
{
  "max_loops": 20,
  "pause_seconds": 240,
  "checkpoint_interval": 4,
  "milestone_interval": 5,
  "enable_html_report": true,
  "max_failed_repairs": 5
}
```

### **POST /api/config**
Update configuration

### **POST /api/start**
Start the agent

### **POST /api/stop**
Stop the agent

### **GET /api/status**
Get running status

```json
{
  "running": true,
  "paused": false,
  "config": {...}
}
```

### **GET /api/logs**
Get recent logs (last 100 lines)

```json
{
  "logs": ["line1", "line2", ...],
  "errors": ["error1", "error2", ...]
}
```

### **GET /api/metrics**
Get current metrics

```json
{
  "total_phases": 25,
  "successful_phases": 24,
  "failed_repairs": 1,
  "phase_breakdown": {
    "qa": 5,
    "design": 5,
    "performance": 5,
    "security": 4,
    "cleanup": 5
  }
}
```

---

## 🔥 Pro Tips

### **Background Mode**
Du kannst die GUI starten und den Browser schließen - der Agent läuft weiter:

```bash
# Terminal 1
python3 agent_gui.py

# Browser öffnen, Agent starten, Browser schließen
# Agent läuft im Hintergrund weiter!

# Später: Browser wieder öffnen um Status zu checken
```

### **Remote Access**
Die GUI bindet an `0.0.0.0`, d.h. du kannst von anderen Geräten zugreifen:

```
http://YOUR_IP:5000
```

Perfekt für:
- Laptop GUI, Server führt Agent aus
- Monitoring von deinem Phone
- Team-Zugriff

### **Multiple Configs**
Erstelle mehrere Config-Dateien für verschiedene Szenarien:

```bash
# Quick Test Config
cp agent_config.json agent_config_quick.json
# Edit: max_loops=5, pause_seconds=60

# Full Production Config
cp agent_config.json agent_config_prod.json
# Edit: max_loops=30, pause_seconds=300
```

---

## 🐛 Troubleshooting

### **Port 5000 bereits belegt**
Ändere den Port in `agent_gui.py`:

```python
app.run(host='0.0.0.0', port=8080, debug=False)
```

### **Fish Script nicht gefunden**
Stelle sicher, dass `Claude.fish` im selben Verzeichnis ist.

### **zclaude command not found**
Der Agent benötigt `zclaude` in deinem PATH.

### **Logs werden nicht angezeigt**
Check ob `agent.log` existiert und lesbar ist:

```bash
ls -la agent.log
```

---

## 📊 Screenshots

### **Configuration Panel**
```
┌─────────────────────┐
│ ⚙️ Configuration    │
├─────────────────────┤
│ Max Loops: [20]     │
│ Pause: [240] sec    │
│ Checkpoints: [4]    │
│ Milestones: [5]     │
│ Failed Repairs: [5] │
│ ☑ HTML Report       │
│                     │
│ [💾 Save Config]    │
│ [▶️ Start Agent]    │
│ [⏹️ Stop Agent]     │
└─────────────────────┘
```

### **Metrics Dashboard**
```
┌──────────────────────────────────────┐
│ 📊 Real-time Metrics                 │
├──────────────────────────────────────┤
│ Total: 100  Success: 98  Rate: 98%  │
│ [████████████████████░░] 98%         │
│                                      │
│ 🐞 QA: 20  🎨 Design: 20  ⚡ Perf: 19│
│ 🔒 Sec: 19  🧹 Clean: 20             │
└──────────────────────────────────────┘
```

---

## 🎉 Conclusion

Die GUI macht die Steuerung des Agents **10x einfacher**:

- ✅ Keine Command Line nötig
- ✅ Visuelle Übersicht über alles
- ✅ Live Monitoring
- ✅ Easy Configuration
- ✅ Remote Access möglich

**Perfekt für längere Runs und Monitoring!** 🚀

---

## 📝 License

Part of Scalesite Project © 2026
