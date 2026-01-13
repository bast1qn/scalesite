# 🚀 Scalesite Agent - Quick Start Guide

## ✅ Installation Complete!

Virtual environment erstellt und alle Dependencies installiert!

---

## 🎮 Starten der GUI

### **Option 1: Start Script (Einfach)**

```bash
./start_gui.sh
```

### **Option 2: Manuell**

```bash
source venv/bin/activate
python3 agent_gui_ultimate.py
```

---

## 🌐 Browser öffnen

Nach dem Start öffne:

```
http://localhost:5000
```

---

## 🎯 Was du dann siehst:

1. **Configuration Panel** (links)
   - Stelle Max Loops, Pause, etc. ein
   - Klicke "💾 Save Config"

2. **Metrics Dashboard** (rechts)
   - Live Metrics
   - Performance Chart
   - Phase Breakdown

3. **Live Terminal** (unten)
   - Real-time Log Streaming
   - Git Commits Tab
   - History Tab

---

## ▶️ Agent starten

1. Konfiguriere die Einstellungen
2. Klicke **▶️ Start Agent**
3. Watch the magic! ✨

### Controls:
- **⏸️ Pause** - Agent pausieren
- **▶️ Resume** - Fortsetzen
- **⏹️ Stop** - Agent beenden

---

## 📊 Features

✅ **Real-time WebSocket Streaming** - Live logs, zero delay
✅ **Performance Charts** - Visual analytics
✅ **Pause/Resume** - Full control
✅ **Push Notifications** - Important events
✅ **Git History** - Last 30 commits
✅ **Progress Tracking** - Per loop & phase
✅ **Remote Access** - Monitor from anywhere

---

## 🔥 Quick Configs

### **Test Run (30 Min)**
- Max Loops: 5
- Pause: 60s
- Good for testing

### **Production Run (5-6 Hours)**
- Max Loops: 20
- Pause: 240s (4 Min)
- Full optimization

### **Overnight Run (8+ Hours)**
- Max Loops: 30
- Pause: 300s (5 Min)
- Maximum quality

---

## 💡 Pro Tips

### **Background Mode**
GUI läuft im Server, Browser kannst du schließen:
```bash
./start_gui.sh &
```

### **Remote Access**
Von anderem Gerät zugreifen:
```
http://YOUR_IP:5000
```

### **Stop GUI**
```
Ctrl + C
```

---

## 📁 Output Files

Nach dem Run findest du:

- `agent.log` - Haupt-Log
- `agent_errors.log` - Error-Log
- `agent_metrics.json` - Metriken
- `agent_report.html` - Schöner Report
- `agent_config.json` - Gespeicherte Config

---

## 🐛 Troubleshooting

### **Port 5000 bereits belegt?**

Edit `agent_gui_ultimate.py`:
```python
socketio.run(app, host='0.0.0.0', port=8080)  # Ändere Port
```

### **Virtual Environment aktivieren**

Wenn Commands nicht funktionieren:
```bash
source venv/bin/activate
```

### **Dependencies neu installieren**

```bash
source venv/bin/activate
pip install -r requirements.txt --force-reinstall
```

---

## 🎉 Ready!

Starte jetzt mit:

```bash
./start_gui.sh
```

Und öffne: **http://localhost:5000** 🚀
