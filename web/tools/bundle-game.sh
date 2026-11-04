#!/bin/bash
# bundle-game - Re-bundles web/game when something in it changed since the last bundle; does nothing otherwise. Used by boot-check and npm test.
cd "$(dirname "$0")/.."
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
