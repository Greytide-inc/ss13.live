#!/usr/bin/env bash
# scenario-check.sh - Runs every scenario that has an expect: line (or only the named ones) and prints one ok/FAIL line each; exit 1 if any failed.
# Usage (from web/): tools/scenario-check.sh [NAME...]     (needs `npx tsc -p .` after editing src/; game/ edits need `node tools/translate-tg.mjs` first)
cd "$(dirname "$0")/.."
if [ $# -gt 0 ]; then names=("$@"); else names=($(grep -lE '^expect(-not)?:' scenarios/*.txt | xargs -n1 basename | sed 's/\.txt$//')); fi
bad=0
for n in "${names[@]}"; do
  tools/timed.sh "sc-$n" -- node build/dist/src/tools/boot.js --scenario "$n" --log "build/sc-$n.log" --data-out "build/sc-$n-data" > "build/sc-$n.out" 2>&1
  code=$?
  fails=$(grep -c 'expect.* FAIL' "build/sc-$n.log" 2>/dev/null)
  if [ $code -eq 0 ] && [ "${fails:-0}" -eq 0 ] && grep -q 'expect.* ok' "build/sc-$n.log"; then echo "ok   $n"
  else echo "FAIL $n (exit $code; build/sc-$n.log)"; grep 'expect.* FAIL' "build/sc-$n.log" | head -5; bad=1; fi
done
exit $bad
