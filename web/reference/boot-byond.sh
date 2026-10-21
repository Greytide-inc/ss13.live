#!/bin/bash
# boot-byond.sh - Boot the original game in BYOND until a round starts, and save the logs as the reference.
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
RUN="$ROOT/web/build/byond-run"
[ -f "$ROOT/tgstation.dmb" ] || { echo "tgstation.dmb not found; compile first" >&2; exit 1; }

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

LOG="$REF/byond-boot.log"
cd "$RUN" || exit 1
t0=$(date +%s)
echo "[boot-byond] $(date '+%F %T') starting DreamDaemon tgstation.dmb $PORT -trusted in $RUN"
DreamDaemon tgstation.dmb $PORT -trusted > "$LOG" 2>&1 &
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
rm -rf "${REF:?}/byond-data-logs"
[ -n "$round_dir" ] && cp -a "$round_dir" "$REF/byond-data-logs"
echo "[boot-byond] boot->init $((t1-t0))s, boot->round start $((t2-t0))s" | tee -a "$LOG"
echo "[boot-byond] saved $LOG and $REF/byond-data-logs/"
