#!/bin/bash
# boot-byond-gc.sh - Boot the original game in BYOND with an SSgarbage probe, to compare its garbage collection with the VM's.
#
# Same as boot-byond.sh (read that first), except: it compiles a copy of the game with
# web/reference/byond-gc/gc_probe.dm added (tg_gc.dme in the run folder; the repo's code is untouched),
# which logs SSgarbage's counters every 30 s of game time as "[gc-probe] ..." lines. Output goes to
# web/reference/byond-gc/ (byond-gc-boot.log and data-logs/), not the main reference.
# Usage: web/reference/boot-byond-gc.sh [seconds-to-keep-running-after-round-start]   (default 60)
#
# STATUS: works, no fixes needed. `#include "tgstation.dme"` from a second .dme
# (tg_gc.dme) compiles with 0 errors, 0 warnings. Run twice with 400 s after round start (~14 min
# each): 17 [gc-probe] lines, totalgcs ~2800-3050, totaldels 0, no didntgc entries. The
# probe also prints, every 60 s of game time, what SSgarbage queued by type and which emitters fired.
# Each run overwrites byond-gc-boot.log and data-logs/; the first run is kept as *-run1. See
# Compiling tg is a heavy job: never run it alongside a VM boot.
#
# (Original notes from boot-byond.sh follow.)
#
# Why a guest client is needed: after init the Master Controller sets
# world.sleep_offline = 1, so BYOND freezes the world while nobody is connected
# and the lobby countdown never runs. This script connects DreamSeeker (under
# Wine) as a guest from 127.0.0.1, which tgstation auto-promotes to admin.
#
# Why a run folder: config/config.txt has GUEST_BAN, which refuses guests. To
# keep the real config/ untouched, the game runs from web/build/byond-run/,
# which links to everything in the repo except config/ (a patched copy) and
# data/ (fresh each run). The only config change is: GUEST_BAN commented out.
#
# Usage (from anywhere):  web/reference/boot-byond.sh [seconds-to-keep-running-after-round-start]
# Needs tgstation.dmb built first:  source env/activate && tools/travis/dm.sh tgstation.dme
# Output: web/reference/byond-boot.log (DreamDaemon's world.log) and
#         web/reference/byond-data-logs/ (the game's own data/logs/<round>/ files)

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
source "$ROOT/env/activate"
set -u
AFTER="${1:-60}"
PORT=25001

REF="$ROOT/web/reference"
RUN="$ROOT/web/build/byond-gc-run"
:

# Fresh run folder
rm -rf "${RUN:?}"
mkdir -p "$RUN"
for f in "$ROOT"/*; do
	name="$(basename "$f")"
	case "$name" in config|data|web|env) continue ;; esac
	ln -s "$f" "$RUN/$name"
done
cp -a "$ROOT/config" "$RUN/config"
sed -i 's/^GUEST_BAN/#GUEST_BAN/' "$RUN/config/config.txt"
cp "$REF/byond-gc/gc_probe.dm" "$RUN/gc_probe.dm"
printf '#include "tgstation.dme"\n#include "gc_probe.dm"\n' > "$RUN/tg_gc.dme"
echo "[boot-byond-gc] compiling tg_gc.dme"
(cd "$RUN" && DreamMaker tg_gc.dme > dreammaker.log 2>&1) || { tail -20 "$RUN/dreammaker.log"; exit 1; }
tail -1 "$RUN/dreammaker.log"

LOG="$REF/byond-gc/byond-gc-boot.log"
cd "$RUN" || exit 1
t0=$(date +%s)
echo "[boot-byond] $(date '+%F %T') starting DreamDaemon tgstation.dmb $PORT -trusted in $RUN"
DreamDaemon tg_gc.dmb $PORT -trusted > "$LOG" 2>&1 &
DD=$!

wait_for() { # pattern, timeout-seconds
	local end=$(( $(date +%s) + $2 ))
	until grep -q "$1" "$LOG"; do
		kill -0 $DD 2>/dev/null || return 1
		[ "$(date +%s)" -ge "$end" ] && return 1
		sleep 2
	done
}

cleanup() {
	kill $DD 2>/dev/null
	wineserver -k 2>/dev/null
	wait $DD 2>/dev/null
}
trap cleanup EXIT

if ! wait_for 'Initializations complete' 600; then
	echo "[boot-byond] MC init did not finish; see $LOG" >&2; exit 1
fi
t1=$(date +%s)
echo "[boot-byond] MC initialized after $((t1-t0))s; connecting guest DreamSeeker"
dreamseeker "byond://127.0.0.1:$PORT" > "$RUN/dreamseeker.log" 2>&1 &

if ! wait_for 'Game start took' 600; then
	echo "[boot-byond] round did not start; see $LOG" >&2; exit 1
fi
t2=$(date +%s)
echo "[boot-byond] round started after $((t2-t0))s total; keeping it running ${AFTER}s more"
sleep "$AFTER"
cleanup
trap - EXIT

# Save the game's own logs (newest round folder). BYOND follows the symlinked
# tgstation.dmb back to the repo root, so data/ may land there instead of $RUN.
round_dir="$(ls -td "$RUN"/data/logs/*/*/*/round-* "$ROOT"/data/logs/*/*/*/round-* 2>/dev/null | head -1)"
rm -rf "${REF:?}/byond-gc/data-logs"
[ -n "$round_dir" ] && cp -a "$round_dir" "$REF/byond-gc/data-logs"
echo "[boot-byond] boot->init $((t1-t0))s, boot->round start $((t2-t0))s" | tee -a "$LOG"
echo "[boot-byond] saved $LOG and $REF/byond-gc/data-logs/"
