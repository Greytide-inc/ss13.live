#!/usr/bin/env bash
# timed.sh - Run a test detached and wait up to 4 min: prints its result if it finishes, else "STILL RUNNING" so the teammate hands off while it carries on.
# Usage (from web/): tools/timed.sh NAME -- command args...     (give the Bash call a timeout of 300000 ms)
# Output: build/long/NAME.log, exit code in build/long/NAME.done. Check later: tools/timed.sh --status NAME
# Wait for a run that is still going: tools/timed.sh --wait NAME (as a background Bash call: it prints the same result when the run ends).
# A run known to pass 4 min: TIMED_LIMIT=900 tools/timed.sh NAME -- ... as a background Bash call.
# The result: exit code, the log's failure lines when the run failed, the log's last 20 lines, and a "left running:" line
# (boots, servers, headless Firefox, wrangler still alive on this machine: no separate pgrep step needed).
# Exit: the command's own exit code if it finished within the limit; 99 = still running.
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

# report NAME HOW: print a finished run's result and exit with its exit code.
FAIL_RE='^FAIL|^not ok|^NEW|^\[fail|FAILED|FATAL|runtime error|[Uu]ncaught|[Ee]xception|Error:|error TS[0-9]|npm ERR'
report() {
  local n="$1" log="build/long/$1.log" code; code=$(cat "build/long/$1.done")
  echo "$2, exit $code"
  if [ "$code" != 0 ]; then
    local hits; hits=$(grep -acE "$FAIL_RE" "$log" || true)
    if [ "$hits" -gt 0 ]; then
      echo "failure lines in $log (first 15 of $hits):"
      grep -anE "$FAIL_RE" "$log" | head -15 | cut -c1-300
    fi
  fi
  echo "last lines of $log:"
  tail -20 "$log"
  local left; left=$(pgrep -af '[b]oot\.js|[s]erver\.mjs|[f]irefox.*-headless|[w]rangler' | grep -v -e 'timed\.sh' -e "^$(cat "build/long/$n.pid") " | cut -c1-160 | head -6 || true)
  echo "left running: ${left:-nothing}"
  exit "$code"
}

if [ "${1:-}" = "--wait" ]; then
  n="$2"
  [ -f "build/long/$n.pid" ] || { echo "no run named $n" >&2; exit 2; }
  while [ ! -f "build/long/$n.done" ]; do
    kill -0 "$(cat "build/long/$n.pid")" 2>/dev/null || { sleep 2; [ -f "build/long/$n.done" ] || { echo "$n died without an exit code; last lines of build/long/$n.log:"; tail -20 "build/long/$n.log"; exit 98; }; }
    sleep 2
  done
  report "$n" "finished"
fi

name="$1"; shift
[ "${1:-}" = "--" ] && shift
[ $# -gt 0 ] || { echo "usage: tools/timed.sh NAME -- command args..." >&2; exit 2; }
if [ -f "build/long/$name.pid" ] && [ ! -f "build/long/$name.done" ] && kill -0 "$(cat "build/long/$name.pid")" 2>/dev/null; then
  echo "NAME $name is already running; pick another name" >&2; exit 2
fi
rm -f "build/long/$name.done"
printf '%q ' "$@" > "build/long/$name.cmd"
setsid nohup bash -c '"$@"; echo $? > "build/long/'"$name"'.done"' _ "$@" \
  > "build/long/$name.log" 2>&1 < /dev/null &
echo $! > "build/long/$name.pid"

for ((s = 0; s < LIMIT; s += 2)); do
  [ -f "build/long/$name.done" ] && report "$name" "finished in ~${s}s"
  sleep 2
done
echo "STILL RUNNING after ${LIMIT}s: $name (log build/long/$name.log, exit code will land in build/long/$name.done)."
echo "Teammate: don't wait: write your handoff now and finish with a status reply starting \"WAITING: $name\"."
echo "Main session: run 'tools/timed.sh --wait $name' as a background Bash call; it prints the result when the run ends."
exit 99
