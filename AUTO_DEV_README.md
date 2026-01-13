# ScaleSite Auto-Dev Skript

## 🚀 Was ist das Auto-Dev Skript?

Das `auto-dev.fish` Skript automatisiert den Entwicklungsprozess für ScaleSite. Es:

- ✅ Erkennt automatisch welche Wochen abgeschlossen sind
- ✅ Springt zur nächsten offenen Woche
- ✅ Zeigt detaillierte Aufgaben für jede Woche
- ✅ Speichert Fortschritt zwischen Durchläufen
- ✅ Kann jederzeit mit STRG+C abgebrochen werden
- ✅ Setzt beim nächsten Start automatisch fort

## 📋 Wie funktioniert es?

### 1. Start

```bash
./auto-dev.fish
```

Das Skript wird:
1. Prüfen welche Wochen schon erledigt sind (durch Dateien überprüfen)
2. Zur aktuellen Woche springen
3. Aufgaben für diese Woche anzeigen
4. Auf Bestätigung warten (für Wochen 4+)
5. Zur nächsten Woche weiterschalten

### 2. STRG+C (Abbrechen)

Wenn du das Skript mit STRG+C abbrichst:
- Der aktuelle Stand wird gespeichert
- Beim nächsten Start macht es genau dort weiter

### 3. Status Prüfen

```bash
cat .autodev-status
```

Zeigt:
- Aktuelle Woche
- Zuletzt aktualisiert
- Gestartet am

## 📁 Dateien

- **auto-dev.fish** - Das Hauptskript
- **MASTER_PLAN.md** - Vollständiger Plan aller 32 Wochen
- **.autodev-status** - Fortschritts-Datei (automatisch erstellt)

## 🔄 Woche-für-Woche Ablauf

### Automatische Wochen (1-3)

Das Skript erkennt automatisch ob diese Wochen erledigt sind durch Datei-Check:

- **Woche 1**: `supabase_schema.sql` + `WOCHE_1_DATABASE.md`
- **Woche 2**: `lib/api.ts` + `lib/storage.ts`
- **Woche 3**: `components/configurator/` Verzeichnis

### Manuelle Wochen (4-32)

Für Woche 4+ zeigt das Skript alle Aufgaben aus dem MASTER_PLAN.md und fragt nach Bestätigung:

```
Woche 4 abgeschlossen? (j/N):
```

- `j` oder `y` = Ja, weiter zur nächsten Woche
- `N` oder Enter = Nein, beim nächsten Mal diese Woche wiederholen

## 📊 MASTER PLAN Struktur

Jede Woche im MASTER_PLAN.md hat:

```markdown
## WOCHE X: [NAME]

### Status
- **Status**: ✅ COMPLETED / ⏳ PENDING
- **Abgeschlossen**: YYYY-MM-DD

### Aufgaben
- [ ] Aufgabe 1
- [ ] Aufgabe 2
- ...

### Auslieferung
- [ ] Datei 1
- [ ] Datei 2
```

## 🎯 Aktuelle Woche ändern

### Manuelles Setzen

```bash
echo "current_week=5" > .autodev-status
```

### Wochen Überspringen

Wenn du z.B. direkt zu Woche 10 willst:

```bash
echo "current_week=10" > .autodev-status
```

## 🔍 Troubleshooting

### Skript startet nicht bei Woche 1

```bash
# .autodev-status löschen
rm .autodev-status

# Skript neu starten
./auto-dev.fish
```

### Falsche Woche erkannt

Prüfe ob die Dateien existieren:

```bash
# Woche 1
ls -la supabase_schema.sql WOCHE_1_DATABASE.md

# Woche 2
ls -la lib/api.ts lib/storage.ts

# Woche 3
ls -la components/configurator/
```

### awk Warnung ignorieren

Die Warnung:
```
awk: Kommandozeile:15: Fehler: Gegenstück zu ( oder \( fehlt
```

Kann ignoriert werden - das Skript funktioniert trotzdem korrekt.

## 📝 Workflow

### Empfohlener Workflow

1. **Skript starten**
   ```bash
   ./auto-dev.fish
   ```

2. **Aufgaben der aktuellen Woche anzeigen lassen**

3. **Aufgaben erledigen**
   - Für Wochen 1-3: Automatisch erledigt ✅
   - Für Woche 4+: Manuelles Implementieren

4. **Wenn alle Aufgaben erledigt:**
   - Aufgaben in MASTER_PLAN.md abhaken
   - Skript neu starten: `./auto-dev.fish`
   - Mit `j` bestätigen

5. **Wiederholen bis alle 32 Wochen done!** 🎉

## 🎉 Ziel

Nach 32 Wochen (oder schneller, wenn du schneller arbeitest) ist die komplette ScaleSite Anwendung fertiggestellt!

**Inklusive:**
- ✅ 11 Major Features
- ✅ 3 UI/UX Improvements
- ✅ Complete Deployment
- ✅ Production Ready

## 💡 Tipps

- **Regelmäßig ausführen**: Jeden Tag einmal `./auto-dev.fish` starten um zu sehen wo du stehst
- **MASTER_PLAN.md lesen**: Für Details zu jeder Woche
- **Git Commits**: Nach jeder Woche einen Commit machen
- **Backup**: Regelmäßig Commits in Git pushen

---

**Viel Erfolg beim Bauen! 🚀**
