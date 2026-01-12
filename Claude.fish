#!/usr/bin/env fish

# KONFIGURATION
set MAX_LOOPS 2
set PROMPT "Analysiere die aktuelle Codebasis. Mache das Design der Website moderner, professioneller und ästhetisch ansprechender. Verbessere CSS/Tailwind, Typografie und Spacing. Sei mutig mit visuellen Verbesserungen. Und bevor du anfängst lies dir bitte SCALESITE_AGENT.md durch."

# Check, ob wir in einem Git-Repo sind
if not test -d .git
    echo "❌ Fehler: Kein Git-Repository gefunden."
    exit 1
end

echo "🚀 Starte autonomen Improvement-Loop ($MAX_LOOPS Iterationen) mit zclaude..."

for i in (seq 1 $MAX_LOOPS)
    echo "------------------------------------------------"
    echo "🔄 Iteration $i von $MAX_LOOPS"
    echo "------------------------------------------------"

    # Jetzt können wir dein zclaude direkt nutzen!
    zclaude -p "$PROMPT" --dangerously-skip-permissions

    # Status prüfen (in Fish ist $status der Exit-Code)
    if test $status -ne 0
        echo "❌ Fehler bei zclaude. Stoppe Loop."
        break
    end

    git add .
    git commit -m "Auto-Improvement: Iteration $i" --allow-empty
    
    echo "✅ Commit erstellt: Iteration $i"
    sleep 5
end

echo "🎉 Fertig! Prüfe 'git log'."
