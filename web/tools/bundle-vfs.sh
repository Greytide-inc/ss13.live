#!/usr/bin/env bash
# bundle-vfs.sh - Build web/build/vfs-bundle.json (the VFS base layer: config/, _maps/, strings/, etc).
# Usage: web/tools/bundle-vfs.sh [outfile]
set -eo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT/web"
npm run bundle-vfs -- "$@"
