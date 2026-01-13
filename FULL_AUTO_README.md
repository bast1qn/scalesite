# ScaleSite FULL AUTO-DEV

## 🚀 Das echte Auto-Skript!

Dieses Skript ruft **Claude automatisch auf** um Aufgaben zu erledigen - genau wie Claude.fish!

## 📋 Wie es funktioniert

### Automatischer Ablauf:

```
./auto-dev-full.fish
    ↓
1. Prüft aktuelle Woche (z.B. Woche 4)
2. Liest Aufgaben aus MASTER_PLAN.md
3. Ruft Claude auf für jede Aufgabe
4. Claude implementiert die Aufgabe
5. Speichert Fortschritt
6. Nächste Aufgabe...
7. Nach X Aufgaben → Pausiert
8. Neustart → Macht weiter!
```

### Du kannst:

✅ Skript starten
✅ 5 Stunden weggehen
✅ Zurückkommen → FERTIG!
✅ Oder Skript mehrmals starten bis Woche done

## 🎯 Voraussetzungen

### 1. Claude CLI installieren

```bash
# Claude CLI installieren (falls nicht vorhanden)
npm install -g @anthropic-ai/claude-cli

# Oder dein Pfad anpassen in auto-dev-full.fish:
set -g CLAUDE_CLI "/dein/pfad/zur/zclaude"
```

### 2. PATH anpassen

Falls zclaude woanders ist:

```fish
# In auto-dev-full.fish Zeile 23 ändern:
set -g CLAUDE_CLI "/home/basti/.local/bin/zclaude"

# Oder finde deinen Pfad:
which zclaude
```

## 🚀 Erste Nutzung

### 1. Start

```bash
./auto-dev-full.fish
```

### 2. Was passiert

Das Skript wird:
1. Prüfen: "Woche 4" ist aktuell
2. Aufgaben aus MASTER_PLAN.md auslesen
3. Claude rufen für Aufgabe 1
4. Claude schreibt Code
5. Aufgabe 1 ✅ → Aufgabe 2
6. ... bis Max-Tasks erreicht (5)
7. Pausieren

### 3. Nächster Start

```bash
./auto-dev-full.fish
```

- Fängt bei Aufgabe 6 an
- Wiederholt sich bis Woche 4 komplett

### 4. Woche fertig?

- Automatisch zu Woche 5 wechseln!
- Und so weiter bis Woche 32

## ⚙️ Konfiguration

### Max Aufgaben pro Durchlauf

Standard: **5 Aufgaben** (damit du zwischendurch checken kannst)

Ändern in `auto-dev-full.fish`:

```fish
set -g MAX_TASKS_PER_RUN 10  # Mehr Aufgaben
# oder
set -g MAX_TASKS_PER_RUN 999  # ALLE auf einmal
```

### Task Timeout

Standard: **10 Minuten** pro Aufgabe

Ändern in `auto-dev-full.fish`:

```fish
set -g TASK_TIMEOUT 1200  # 20 Minuten
```

## 📊 Status-Tracking

### Status prüfen

```bash
cat .autodev-status
```

Zeigt:
- `current_week=4` - Aktuelle Woche
- `current_task_index=5` - Nächste Aufgabe
- `last_updated=...` - Zuletzt aktualisiert

### Erledigte Aufgaben sehen

```bash
cat .week_4_tasks
```

Zeigt:
- `task_1=completed`
- `task_2=completed`
- etc.

## 🔄 Fortsetz-Modus

### STRG+C (Abbrechen)

Wenn du abbrichst:
- Aktueller Stand wird gespeichert
- Nächster Start macht genau dort weiter

### Beispiel

```
Start 1: Aufgaben 1-5 erledigt → STRG+C
Start 2: Aufgaben 6-10 erledigt → STRG+C
Start 3: Aufgaben 11-15 erledigt
```

## 🎯 Vollautomatischer Modus

Wenn du **wirklich** 5 Stunden weggehen willst:

### 1. Alle Aufgaben auf einmal

```fish
# In auto-dev-full.fish ändern:
set -g MAX_TASKS_PER_RUN 999
```

### 2. Loop-Skript

```bash
# auto-loop.sh - Skript das immer wieder neu startet
while true; do
    ./auto-dev-full.fish
    sleep 5  # Kurze Pause
    # Prüft ob alle Wochen done sind
    if [ (cat .autodev-status | grep current_week | cut -d= -f2) -gt 32 ]; then
        echo "ALLE WOCHEN FERTIG!"
        break
    fi
done
```

### 3. Oder einfach:

```bash
# Im Hintergrund laufen lassen
nohup ./auto-dev-full.fish > output.log 2>&1 &
```

## 📁 Dateien

| Datei | Zweck |
|-------|-------|
| `auto-dev-full.fish` | Hauptskript |
| `MASTER_PLAN.md` | Alle Aufgaben |
| `.autodev-status` | Fortschritt |
| `.week_X_tasks` | Erledigte Aufgaben |
| `.week_X_tasks_current` | Aktuelle Aufgabenliste |

## ⚠️ Wichtige Hinweise

### Claude API Limits

- Beachte deine Claude API Rate Limits
- Bei vielen Aufgaben: Pausen einbauen
- `MAX_TASKS_PER_RUN` nicht zu hoch setzen

### Fehlerbehandlung

Wenn Claude fehlschlägt:
- Aufgabe wird NICHT als completed markiert
- Nächster Start wiederholt Aufgabe

### Manuelles Eingreifen

Du kannst jederzeit:
- STRG+C drücken
- Code manuell prüfen/ändern
- Skript neu starten → macht weiter

## 🎉 Vollständiger Ablauf Beispiel

```
$ ./auto-dev-full.fish

═══════════════════════════════════════════════════════════════
  ScaleSite FULL AUTO-DEV - Automatische Claude Integration
═══════════════════════════════════════════════════════════════

ℹ Aktuelle Woche: 4
ℹ Projekt: /home/basti/projects/scalesite
ℹ Max Aufgaben pro Durchlauf: 5

═══════════════════════════════════════════════════════════════
  WOCHE 4: Configurator Integration & Polish
═══════════════════════════════════════════════════════════════

ℹ Gesamt: 20 Aufgaben
ℹ Max pro Durchlauf: 5

═══════════════════════════════════════════════════════════════
  Aufgabe 1/20
═══════════════════════════════════════════════════════════════

1. Route Integration
   [ ] Route in App.tsx: /konfigurator
   [ ] Route mit Project ID: /projects/:id/configure
   ...

─────────────────────────────────────────────────────────────

ℹ Rufe Claude auf für Woche 4, Aufgabe 1/20...
┌─────────────────────────────────────────────────────────────┐
│ Claude arbeitet daran...                               │
│ Dies kann einige Minuten daueren                         │
└─────────────────────────────────────────────────────────────┘

[Claude generiert Code...]

✓ Aufgabe 1 erledigt!

[... Aufgabe 2-5 ...]

⚠ Maximale Aufgabenanzahl (5) erreicht. Pausiere...

✓ Skript abgeschlossen

ℹ Nächster Start setzt bei Woche 4 fort

Neustart mit: ./auto-dev-full.fish
```

## 💡 Tipps

1. **Langsam starten**: Erste Woche mit `MAX_TASKS_PER_RUN 1` testen
2. **Output prüfen**: Regelmäßig Code checken
3. **Git Commits**: Nach jeder Woche ein Commit machen
4. **API Usage**: Auf Claude API Limits achten
5. **Pausen**: Skript macht automatisch Pausen zwischen Aufgaben

## 🔧 Troubleshooting

### Claude CLI nicht gefunden

```bash
# Pfad finden
which zclaude

# In Skript anpassen (Zeile 23)
set -g CLAUDE_CLI "/gefundener/pfad/zclaude"
```

### Skript hängt bei Aufgabe X

```bash
# STRG+C
# Prüfen was Claude erstellt hat
# Eventuell manuell korrigieren
# Neu starten → wiederholt Aufgabe
```

### Falsche Woche

```bash
# Woche manuell setzen
echo "current_week=5" > .autodev-status
```

## 🎯 Ziel

Nach 32 Wochen (oder früher, du bestimmst das Tempo):

```
✅ 11 Major Features implementiert
✅ 3 UI/UX Improvements
✅ Complete Application
✅ Production Ready
🎉 SCALESite FERTIG!
```

---

**Viel Erfolg! Lass Claude für dich arbeiten! 🚀**
