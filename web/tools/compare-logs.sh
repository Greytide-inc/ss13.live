#!/usr/bin/env bash
# compare-logs.sh - Compare a VM boot log against the BYOND reference log.
# Usage: web/tools/compare-logs.sh <vm-log> [--reference file] [--game-log file] [--runtime-log file]
# Defaults: reference=web/reference/byond-boot.log, game-log/runtime-log under web/reference/byond-data-logs/.
set -eo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT/web"
npm run compare-logs -- "$@"
