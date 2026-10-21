#!/bin/bash
# run.sh - Build screen_dup in BYOND, join with DreamSeeker on Xephyr, print the T lines.
HERE="$(cd "$(dirname "$0")" && pwd)"; ROOT="$HERE/../../.."
source "$ROOT/env/activate"
OUT="$ROOT/web/build/screen-dup"; rm -rf "$OUT"; mkdir -p "$OUT"
cp "$HERE"/*.dm "$HERE"/*.dme "$OUT"/; cd "$OUT"
DreamMaker screen_dup.dme > dm.log 2>&1; tail -n 1 dm.log
Xephyr :7 -screen 800x600 -ac > xephyr.log 2>&1 & XE=$!
sleep 2
DreamDaemon screen_dup.dmb 25778 -trusted > dd.log 2>&1 & DD=$!
sleep 3
DISPLAY=:7 dreamseeker byond://127.0.0.1:25778 > ds.log 2>&1 &
sleep 14
wineserver -k || true
kill $DD $XE 2>/dev/null || true
wait 2>/dev/null || true
grep -E "^(T |DONE)" dd.log || true
