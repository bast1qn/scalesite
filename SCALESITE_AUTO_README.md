# ScaleSite Auto-Loop Skript - README

## 🚀 Das echte Loop-Skript wie Claude.fish!

Endlich! Ein Skript das:
- ✅ Wochen-Anzahl fragt
- ✅ Automatisch Woche für Woche durchläuft
- ✅ Für jede Woche eine neue Claude-Session öffnet
- ✅ Ich erledige ALLE Aufgaben der Woche
- ✅ Zur nächsten Woche automatisch geht

## 🎯 So einfach ist es:

```bash
./scalesite-auto.fish
```

### Dialog:

```
═══════════════════════════════════════════════════════════════
  ScaleSite Auto-Loop - Automatische Woche-für-Woche Entwicklung
═══════════════════════════════════════════════════════════════

✓ Claude CLI gefunden: /home/basti/.local/bin/zclaude

═══════════════════════════════════════════════════════════════
  Wie viele Wochen soll ich machen?
═══════════════════════════════════════════════════════════════

  Aktuelle Woche: 4

Optionen:
  1     = Nur diese Woche
  5     = 5 Wochen auf einmal
  10    = 10 Wochen auf einmal
  32    = ALLE remaining Wochen

Deine Wahl (1-32): 5

═══════════════════════════════════════════════════════════════
  VORSCHAU
═══════════════════════════════════════════════════════════════

  Start Woche:   4
  Anzahl Wochen: 5
  Geplant bis:    Woche 8

  Wochen die bearbeitet werden:

  ⏳ Woche 4: Configurator Integration & Polish
  ⏳ Woche 5: Multi-Step Onboarding Wizard - Foundation
  ⏳ Woche 6: Multi-Step Onboarding Wizard - Completion
  ⏳ Woche 7: Intelligent Pricing System - Foundation
  ⏳ Woche 8: Intelligent Pricing System - Advanced

  BEREIT? (j/N): j

═══════════════════════════════════════════════════════════════
  START! 5 Woche(n) von Woche 4 bis 8
═══════════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════════
  WOCHE 4 von 32: Configurator Integration & Polish
═══════════════════════════════════════════════════════════════

ℹ Starte Woche 4...

┌─────────────────────────────────────────────────────────────┐
│ Claude führt Woche 4 aus...                               │
│                                                            │
│ Dies kann 10-30 Minuten dauern                           │
│ Bitte das Skript NICHT unterbrechen!                     │
└─────────────────────────────────────────────────────────────┘

[Hier wird Claude aufgerufen mit zclaude und macht Woche 4...]

✓ Woche 4 fertig! (Dauer: 15.3 Minuten)
✓ Status gespeichert - Nächste Woche: 5

[Kurze Pause... (3 Sekunden)]

═══════════════════════════════════════════════════════════════
  WOCHE 5 von 32: Multi-Step Onboarding Wizard - Foundation
═══════════════════════════════════════════════════════════════
...

[Und so weiter bis Woche 8 fertig]

═══════════════════════════════════════════════════════════════
  ZUSAMMENFASSUNG
═══════════════════════════════════════════════════════════════

✓ 5 Woche(n) erledigt!

Nächste Woche beim nächsten Start: Woche 9
```

## 📋 Was passiert bei STRG+C?

### Während einer Woche:
- **Abbrechen!** Nicht unterbrechen während Claude arbeitet!
- Warten bis die Woche fertig ist
- Danach kannst du STRG+C drücken

### Zwischen Wochen:
- Fortschritt ist gespeichert
- Nächster Start macht bei der nächsten Woche weiter

### Beispiel:

```
Start: Woche 4-5 geplant
STRG+C nach Woche 4
Neustart → Fragt wieder "Wie viele Wochen?"
→ Jetzt Woche 5-9 machen
```

## ⚙️ Wie funktioniert das Skript?

### 1. Start
```bash
./scalesite-auto.fish
```

### 2. Eingabe
- Frage: "Wie viele Wochen?"
- Du z.B. "5" eingeben

### 3. Preview
- Zeigt welche Wochen bearbeitet werden
- Zeigt Status (⏳ = Pending, ✅ = Done)

### 4. Bestätigung
- "BEREIT? (j/N)"
- Du bestätigst mit "j"

### 5. Loop
```
Für Woche 4 bis 8:
  ├─ Woche 4: Claude aufrufen → Fertig ✅
  ├─ Pause (3 Sekunden)
  ├─ Woche 5: Claude aufrufen → Fertig ✅
  ├─ Pause (3 Sekunden)
  ├─ Woche 6: Claude aufrufen → Fertig ✅
  ├─ Pause (3 Sekunden)
  ├─ Woche 7: Claude aufrufen → Fertig ✅
  └─ Woche 8: Claude aufrufen → Fertig ✅

Zusammenfassung anzeigen
```

## 🎯 Szenarien

### Szenario 1: Eine Woche machen
```bash
./scalesite-auto.fish
# Eingabe: 1
# Resultat: Nur Woche 4 wird erledigt
```

### Szenario 2: 5 Stunden arbeiten lassen
```bash
./scalesite-auto.fish
# Eingabe: 32 (oder 10 für 10 Wochen)
# Resultat: 10 Wochen hintereinander, 5h später fertig
```

### Szenario 3: Nach 3 Wochen abbrechen
```bash
./scalesite-auto.fish
# Eingabe: 10
# Nach Woche 6: STRG+C (zwischen Wochen!)
# Neustart → Woche 7-16 machen
```

### Szenario 4: Alle Wochen auf einmal
```bash
./scalesite-auto.fish
# Eingabe: 32
# Resultat: Alle remaining Wochen bis fertig
# (Das wird SEHR lange dauern! 🚀)
```

## 📊 Status-Tracking

### Status prüfen
```bash
cat .autoloop-status
```

Ausgabe:
```
current_week=9
last_updated=2026-01-13
last_claude_call=1768305123
```

### Woche markieren
Erledigte Wochen werden mit `.week_X_done` markiert:
```bash
ls -la .week_*_done
```

### MASTER_PLAN.md wird automatisch aktualisiert
```markdown
## WOCHE 4: Configurator Integration & Polish

### Status
- **Status**: ✅ COMPLETED  # ← Automatisch geändert!
- **Abgeschlossen**: 2026-01-13
```

## 🔧 Konfiguration

### Claude CLI Pfad anpassen

Falls zclaude woanders ist:

```fish
# In scalesite-auto.fish Zeile 23 ändern:
set -g CLAUDE_CLI "/dein/pfad/zur/zclaude"

# Pfad finden:
which zclaude
```

### Pause zwischen Wochen ändern

Standard: 3 Sekunden

Ändern in scalesite-auto.fish:

```fish
# Zeile ~368 suchen:
sleep 3  # ← Andere Zahl eintragen
```

## ⚠️ WICHTIGE HINWEISE

### 1. Nicht unterbrechen während Claude arbeitet!

**GEFÄHRLICH:**
```
Woche 4 läuft...
Claude schreibt Code...
STRG+C  ← NEIN! Code ist unvollständig!
```

**SICHER:**
```
Woche 4 fertig ✓
Pause (3 Sekunden)
STRG+C  ← OK! Woche 4 gespeichert
```

### 2. Claude API Limits

- Beachte deine Rate Limits
- 10 Wochen = 10 Claude Calls
- Pausiere zwischen Sessions wenn nötig

### 3. Speicherplatz

- Jede Woche = ~10-30 Minuten Claude Output
- Terminal Buffer limitieren (scrollback)
- Ggf. Output in Datei umleiten:
  ```bash
  ./scalesite-auto.fish > output.log 2>&1
  ```

### 4. Git Commits

Nach mehreren Wochen:
```bash
git add .
git commit -m "Weeks 4-8: Completed"
git push
```

## 🐛 Troubleshooting

### Skript startet nicht ("Permission denied")

```bash
chmod +x scalesite-auto.fish
```

### Claude CLI nicht gefunden

```bash
# Pfad prüfen
which zclaude

# In Skript anpassen (Zeile 23)
nano scalesite-auto.fish
```

### Skript hängt

- Warten! Claude braucht Zeit für große Wochen
- Wenn > 1 Stunde: Etwas ist falsch → STRG+C nicht drücken!
- Terminal offen lassen, prüfen ob noch Activity

### Falsche Woche angezeigt

```bash
# Status zurücksetzen
rm .autoloop-status

# Neu starten
./scalesite-auto.fish
```

### Woche als completed markiert obwohl nicht fertig

```bash
# Markierung entfernen
rm .week_4_done

# MASTER_PLAN.md zurücksetzen
# Von Hand auf "⏳ PENDING" ändern

# Neu starten
./scalesite-auto.fish
```

## 💡 Tipps für beste Ergebnisse

### 1. Langsam starten
```bash
# Erste Woche mit 1 testen:
./scalesite-auto.fish
# Eingabe: 1
# Resultat prüfen, dann hochzählen
```

### 2. In Schritten arbeiten
```bash
# Woche 4-5  (Morgens)
./scalesite-auto.fish
# Eingabe: 2

# Woche 6-10 (Nachmittags)
./scalesite-auto.fish
# Eingabe: 5
```

### 3. Output loggen
```bash
# Output speichern für später
./scalesite-auto.fish 2>&1 | tee week_4_5.log
```

### 4. Zwischen commits
Nach 2-3 Wochen:
```bash
git status
git add .
git commit -m "Weeks 4-6 implemented"
```

## 🎉 Vollständiger Ablauf Beispiel

### Tag 1: 5 Stunden Arbeit

```bash
# Morgens starten
./scalesite-auto.fish

# Dialog:
Wie viele Wochen? 10
Vorschau anzeigen lassen
Bestätigen mit "j"

# 5 Stunden weggehen
# Zurückkommen:
✓ 10 Wochen erledigt!

# Commit
git add .
git commit -m "Weeks 4-13: Completed"
```

### Tag 2: Weiter machen

```bash
./scalesite-auto.fish

# Dialog:
Wie viele Wochen? 15
# Macht Woche 14-28
```

### Tag 3: Fertig!

```bash
./scalesite-auto.fish

# Dialog:
Wie viele Wochen? 32
# Macht Woche 29-32

🎉 ALLE WOCHEN FERTIG! 🎉
```

## 📁 Dateien

| Datei | Zweck |
|-------|-------|
| `scalesite-auto.fish` | Hauptskript (LOOP) |
| `MASTER_PLAN.md` | Alle Wochen Details |
| `.autoloop-status` | Status (auto-erstellt) |
| `.week_X_done` | Woche X fertig Marker |
| `.week_X_prompt.txt` | Prompt für Woche X (temp) |

## 🚀 Quick Start

```bash
# 1. In Projekt-Verzeichnis
cd /home/basti/projects/scalesite

# 2. Skript starten
./scalesite-auto.fish

# 3. Anzahl Wochen eingeben
#    1, 5, 10, oder 32

# 4. Preview prüfen

# 5. Bestätigen mit "j"

# 6. Zurücklehnen und Kaffee trinken ☕

# 7. Fertig! ✅
```

---

**Viel Erfolg! Lass Claude für dich arbeiten! 🚀**

PS: Das ist wie Claude.fish - nur für ScaleSite! 😊
