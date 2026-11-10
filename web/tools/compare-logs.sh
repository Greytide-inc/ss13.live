#!/usr/bin/env bash
# compare-logs.sh - Check a VM boot log: every boot milestone in order, and no runtime.
# Usage: web/tools/compare-logs.sh <vm-log> (world.log then game.log, as boot-check joins them)
set -eo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT/web"
npm run compare-logs -- "$@"
