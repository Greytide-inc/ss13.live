#!/bin/bash
# run-byond.sh - Boot the original game in BYOND 511 with lt1_probe.dm added and save the probe's lines.
#
# Throwaway copy in web/build/lt1/byond-run (tg_lt1.dme = tgstation.dme + lt1_probe.dm, the rest symlinked,
# config/ copied with GUEST_BAN off). No client needed: the probe turns world.sleep_offline off.
# Heavy job (~4-6 min): never alongside a VM boot.
# Output: web/build/lt1/byond-boot.log (world.log) and web/build/lt1/byond.txt (the [lt1] lines).
# Usage: web/reference/lighting-probe/run-byond.sh
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
source "$ROOT/env/activate"
set -u
HERE="$ROOT/web/reference/lighting-probe"
RUN="$ROOT/web/build/lt1/byond-run"
LOG="$ROOT/web/build/lt1/byond-boot.log"
PORT=25013

rm -rf "${RUN:?}"
mkdir -p "$RUN"
for f in "$ROOT"/*; do
	name="$(basename "$f")"
	case "$name" in config|data|web|env|tgstation.dmb|tgstation.rsc|tgstation.json) continue ;; esac
	ln -s "$f" "$RUN/$name"
done
cp -a "$ROOT/config" "$RUN/config"
sed -i 's/^GUEST_BAN/#GUEST_BAN/' "$RUN/config/config.txt"
cp "$HERE/lt1_probe.dm" "$RUN/lt1_probe.dm"
printf '#include "tgstation.dme"\n#include "lt1_probe.dm"\n' > "$RUN/tg_lt1.dme"
echo "[lt1] compiling tg_lt1.dme with DreamMaker"
(cd "$RUN" && DreamMaker tg_lt1.dme > dreammaker.log 2>&1) || { tail -20 "$RUN/dreammaker.log"; exit 1; }
tail -1 "$RUN/dreammaker.log"

cd "$RUN" || exit 1
t0=$(date +%s)
DreamDaemon tg_lt1.dmb $PORT -trusted > "$LOG" 2>&1 &
DD=$!
trap 'kill $DD 2>/dev/null; wait $DD 2>/dev/null' EXIT
end=$(( t0 + 500 ))
until grep -q '^\[lt1\] done' "$LOG"; do
	kill -0 $DD 2>/dev/null || { echo "DreamDaemon exited early; see $LOG" >&2; exit 1; }
	[ "$(date +%s)" -ge "$end" ] && { echo "timed out; see $LOG" >&2; exit 1; }
	sleep 2
done
kill $DD 2>/dev/null; wait $DD 2>/dev/null
trap - EXIT
grep '^\[lt1\]' "$LOG" > "$ROOT/web/build/lt1/byond.txt"
echo "[lt1] BYOND done after $(( $(date +%s) - t0 ))s: $(wc -l < "$ROOT/web/build/lt1/byond.txt") lines"
