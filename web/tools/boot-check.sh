#!/bin/bash
# boot-check - Short boot + compare-logs in one go, with its own log and data folder so parallel boots can't mix them up.
# Usage (from web/, env loaded):  npm run boot-check -- [--twice] [NAME] [extra boot args, e.g. --map runtime]
#   NAME (default boot-check) names build/NAME.log, build/NAME-data/ and build/NAME-combined.log.
#   --twice runs two boots side by side (NAME-1 and NAME-2) after one shared bundle: the same ~3.5 min as one boot
#   (measured 2026-09-29: 8.5M instr/s each, init ~5 s slower). Exit 0 only if every boot's compare-logs is clean.
#   Default boot args: --ticks 100000 --after-start 120 (about 3.5 min). Giving --after-start or --seconds replaces
#   the default stop (full boot: --seconds 600). Exit code is compare-logs' (0 = clean).
#   web/game is bundled by tools/translate-tg.mjs (rerun when game/ changed) for every boot. (--translated in the extra args is an old flag that does nothing now.)
cd "$(dirname "$0")/.."
twice=""; [ "$1" = "--twice" ] && { twice=1; shift; }
name=boot-check
if [ -n "$1" ] && [[ "$1" != --* ]]; then name="$1"; shift; fi
npm run --silent bundle-vfs >/dev/null || exit 1
npx tsc -p . || exit 1
# Re-bundle web/game when a file in it is newer than the last bundle. Every boot needs it (step 3: it declares the type tree);
# and its procs are what the boot runs.
# A deleted or added file changes the sorted file list kept next to the stamp (.files), which -newer alone misses.
stamp=build/game-js/.stamp
filelist=build/game-js/.files
cur_files="$(find game -name '*.ts' | LC_ALL=C sort)"
files_changed=""; [ -f $filelist ] && [ "$cur_files" = "$(cat $filelist)" ] || files_changed=1
[ -n "$STALE_DEBUG" ] && echo "[boot-check] stale-decision: files_changed=${files_changed:-0}"
if [ -n "$files_changed" ] || [ ! -f $stamp ] || [ ! -f build/translated-tg.js ] || [ ! -f build/game-types.js ] || [ tools/translate-tg.mjs -nt $stamp ] || [ -n "$(find game -name '*.ts' -newer $stamp -print -quit)" ]; then
	node tools/translate-tg.mjs > build/translate-tg.log 2>&1 || { tail -5 build/translate-tg.log; exit 1; }
	tail -1 build/translate-tg.log; touch $stamp; echo "$cur_files" > $filelist
fi

one() { # one NAME ARGS...: boot + compare-logs, output to build/NAME.out
	local n="$1"; shift
	local log="build/$n.log" data="build/$n-data" combined="build/$n-combined.log"
	{
		echo "[boot-check] booting ($n, started $(date +%H:%M:%S)) ..."
		local stop="--after-start 120"; [[ " $* " == *" --after-start "* || " $* " == *" --seconds "* ]] && stop=""
		node --max-old-space-size=3072 build/dist/src/tools/boot.js --ticks 100000 $stop "$@" --log "$log" --data-out "$data" | tail -5
		local round; round=$(ls -td "$data"/logs/*/*/*/round-* 2>/dev/null | head -1)
		if [ -z "$round" ]; then echo "[boot-check] no round folder in $data: the round never started (see $log)"; return 1; fi
		cat "$log" "$round/game.log" > "$combined"
		echo "[boot-check] compare-logs on $combined (round $round)"
		node build/dist/src/tools/compare-logs.js "$combined"
		local rc=$?
		echo "[boot-check] done $n $(date +%H:%M:%S), compare-logs exit $rc"
		return $rc
	} > "build/$n.out" 2>&1
}

if [ -z "$twice" ]; then
	one "$name" "$@"; rc=$?; cat "build/$name.out"; exit $rc
fi
echo "[boot-check] two boots side by side: $name-1 and $name-2 (started $(date +%H:%M:%S), about 3.5 min)"
one "$name-1" "$@" & p1=$!
one "$name-2" "$@" & p2=$!
wait $p1; r1=$?; wait $p2; r2=$?
for n in 1 2; do echo; echo "===== $name-$n ====="; sed -n '/=== Runtimes ===/,$p' "build/$name-$n.out"; grep -h 'instructions =' "build/$name-$n.log"; done
echo; echo "[boot-check] $name-1 exit $r1, $name-2 exit $r2"
[ $r1 -eq 0 ] && [ $r2 -eq 0 ]
