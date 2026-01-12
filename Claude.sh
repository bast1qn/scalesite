#!/bin/zsh
source ~/.zshrc

# KONFIGURATION
MAX_LOOPS=50
PROMPT="Analysiere die aktuelle Codebasis. Mache das Design der Website moderner, professioneller und ästhetisch ansprechender. Verbessere CSS/Tailwind, Typografie und Spacing. Sei mutig mit visuellen Verbesserungen. Und bevor du anfängst les dir bitte SCALESITE_AGENT.md durch."

# Check, ob wir in einem Git-Repo sind (Sicherheitsnetz!)
if [ ! -d ".git" ]; then
    echo "❌ Fehler: Kein Git-Repository gefunden. Bitte erst 'git init' ausführen."
    exit 1
fi

echo "🚀 Starte autonomen Improvement-Loop ($MAX_LOOPS Iterationen)..."

for ((i=1; i<=MAX_LOOPS; i++)); do
    echo "------------------------------------------------"
    echo "🔄 Iteration $i von $MAX_LOOPS"
    echo "------------------------------------------------"

    # Führe Claude im Headless-Mode aus (-p)
    # --danger oder --allowedTools verhindert interaktive Rückfragen für File-Edits
    # Falls dein CLI 'claude' heißt (prüfe mit 'which claude')
    cd /home/basti/projects/scalesite/
    zclaude -p "$PROMPT" --dangerously-skip-permissions

    # Alternative (falls --danger nicht existiert, nutze auto-approve flags):
    # claude -p "$PROMPT" --allowedTools "Edit,Bash,Read"

    # Exit-Code prüfen
    if [ $? -ne 0 ]; then
        echo "❌ Claude hatte einen Fehler. Stoppe Loop."
        break
    fi

    # Automatischer Git-Checkpoint (WICHTIG!)
    # Damit kannst du später mit 'git checkout' zu jeder Version zurückspringen
    git add .
    git commit -m "Auto-Improvement: Iteration $i" --allow-empty
    
    echo "✅ Änderungen gesichert (Commit: Iteration $i)"
    
    # Kurze Pause, um Rate-Limits zu vermeiden
    sleep 5
done

echo "🎉 Fertig! Prüfe die Ergebnisse mit 'git log' und starte den Dev-Server."
