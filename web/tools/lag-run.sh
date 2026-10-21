#!/bin/bash
# lag-run - Starts a server from build/lag-dist, then walks one player through netem-proxy under seven network conditions (from web/: tools/timed.sh NAME -- tools/lag-run.sh, ~6 min; runs differ from each other: the world runs on the real clock. For old-vs-new use tools/lag-replay.mjs).
cd "$(dirname "$0")/.."
node tools/server.mjs --dist build/lag-dist --port 8790 --spawn-near --roundstart --seed 1 --seconds 440 --log build/lag-server.log > build/lag-server.out 2>&1 &
SP=$!
for i in $(seq 1 60); do grep -q "ws on port" build/lag-server.out 2>/dev/null && break; sleep 1; done
node tools/lag-probe.mjs 8790 1 Walker >/dev/null 2>&1 &
sleep 90
run() { # label proxy-args...
  local L=$1; shift
  node tools/netem-proxy.mjs 8791 8790 "$@" > /dev/null & local PP=$!
  sleep 0.5
  echo "== $L"; node tools/lag-probe.mjs 8791 30 Walker
  kill $PP; sleep 0.5
}
echo "== direct"; node tools/lag-probe.mjs 8790 30 Walker
run "ping 40ms (delay 20)" --delay 20
run "ping 100ms jitter 30" --delay 50 --jitter 30
run "ping 200ms jitter 60" --delay 100 --jitter 60
run "ping 80ms + 1 loss-stall 250ms per 5s" --delay 40 --stall-every 5 --stall-ms 250
run "ping 60ms, 800 kbps cap (bad hotspot)" --delay 30 --kbps 800
run "ping 60ms, 150 kbps cap (less than the game sends)" --delay 30 --kbps 150
kill $SP
