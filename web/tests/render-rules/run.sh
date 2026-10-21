#!/bin/bash
# run.sh - Build render_rules in BYOND, show it in DreamSeeker on a nested Xephyr display, record it.
# Usage: run.sh [layers|nested|pipes]   (still.png only for these; pipes = pv1 Box cryo-room pipes)
# Output in web/build/render-rules/: still.png (after ~14 s) and cap.mkv (20 fps video of the run).
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"; ROOT="$HERE/../../.."
source "$ROOT/env/activate"
OUT="$ROOT/web/build/render-rules"; rm -rf "$OUT"; mkdir -p "$OUT"
cp "$HERE"/*.dm "$HERE"/*.dme "$HERE"/*.png "$HERE"/*.dmi "$OUT"/
cd "$OUT"
W=${1:-render_rules}
DreamMaker $W.dme > dm.log 2>&1; tail -n 1 dm.log
Xephyr :7 -screen 1200x1000 -ac > xephyr.log 2>&1 & XE=$!
sleep 2
DreamDaemon $W.dmb 25777 -trusted > dd.log 2>&1 & DD=$!
sleep 3
DISPLAY=:7 dreamseeker byond://127.0.0.1:25777 > ds.log 2>&1 &
sleep 4
if [ "$W" = layers ] || [ "$W" = nested ] || [ "$W" = pipes ]; then sleep 8; else
ffmpeg -hide_banner -loglevel error -f x11grab -framerate 20 -video_size 1200x1000 -i :7 -t 22 -c:v ffv1 cap.mkv
fi
DISPLAY=:7 import -window root still.png
wineserver -k || true
kill $DD $XE 2>/dev/null || true
wait 2>/dev/null || true
grep -E "^(T |ANIM|READY)" dd.log || true
echo done
