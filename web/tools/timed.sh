#!/usr/bin/env bash
# timed.sh - Run a test detached and wait up to 4 min: prints its result if it finishes, else "STILL RUNNING" so the teammate hands off while it carries on.
# Usage (from web/): tools/timed.sh NAME -- command args...     (give the Bash call a timeout of 300000 ms)
# Output: build/long/NAME.log, exit code in build/long/NAME.done. Check later: tools/timed.sh --status NAME
# Exit: the command's own exit code if it finished within 4 min; 99 = still running.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p build/long
LIMIT=${TIMED_LIMIT:-240}

if [ "${1:-}" = "--status" ]; then
  n="$2"
  if [ -f "build/long/$n.done" ]; then echo "done, exit $(cat "build/long/$n.done")"
  elif [ -f "build/long/$n.pid" ] && kill -0 "$(cat "build/long/$n.pid")" 2>/dev/null; then echo "running"
  else echo "unknown"; fi
  exit 0
fi

name="$1"; shift
[ "${1:-}" = "--" ] && shift
[ $# -gt 0 ] || { echo "usage: tools/timed.sh NAME -- command args..." >&2; exit 2; }
if [ -f "build/long/$name.pid" ] && [ ! -f "build/long/$name.done" ] && kill -0 "$(cat "build/long/$name.pid")" 2>/dev/null; then
  echo "NAME $name is already running; pick another name" >&2; exit 2
fi
rm -f "build/long/$name.done"
printf '%q ' "$@" > "build/long/$name.cmd"
setsid nohup bash -c 'source ../activate >/dev/null 2>&1; "$@"; echo $? > "build/long/'"$name"'.done"' _ "$@" \
  > "build/long/$name.log" 2>&1 < /dev/null &
echo $! > "build/long/$name.pid"

for ((s = 0; s < LIMIT; s += 2)); do
  if [ -f "build/long/$name.done" ]; then
    code=$(cat "build/long/$name.done")
    echo "finished in ~${s}s, exit $code; last lines of build/long/$name.log:"
    tail -20 "build/long/$name.log"
    exit "$code"
  fi
  sleep 2
done
echo "STILL RUNNING after ${LIMIT}s: $name (log build/long/$name.log, exit code will land in build/long/$name.done)."
echo "Don't wait: write your handoff now and finish with a status reply starting \"WAITING: $name\"."
exit 99
