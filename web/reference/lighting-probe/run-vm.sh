#!/bin/bash
# run-vm.sh - Boot the VM with lt1_probe.dm added and save the probe's lines (compare with run-byond.sh's).
#
# Throwaway copy in web/build/lt1/vm-src (tg_lt1.dme = tgstation.dme + lt1_probe.dm), compiled to JSON with
# DMCompiler, booted until "[lt1] done". Needs web/build/vfs-bundle.json (npm run bundle-vfs).
# Heavy job: ~3 min, ~3 GB RAM.
# Output: web/build/lt1/vm-boot.log and web/build/lt1/vm.txt (the [lt1] lines).
# Usage: web/reference/lighting-probe/run-vm.sh
set -eo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
source "$ROOT/env/activate"
set -u
HERE="$ROOT/web/reference/lighting-probe"
SRC="$ROOT/web/build/lt1/vm-src"

rm -rf "${SRC:?}"
mkdir -p "$SRC"
for f in "$ROOT"/*; do
	name="$(basename "$f")"
	case "$name" in data|web|env|tgstation.json) continue ;; esac
	ln -s "$f" "$SRC/$name"
done
cp "$HERE/lt1_probe.dm" "$SRC/lt1_probe.dm"
printf '#include "tgstation.dme"\n#include "lt1_probe.dm"\n' > "$SRC/tg_lt1.dme"

echo "[lt1] compiling tg_lt1.dme with DMCompiler"
(cd "$SRC" && dotnet "$ROOT/env/src/OpenDream/bin/DMCompiler/DMCompiler.dll" --version=511.1385 tg_lt1.dme \
	> "$ROOT/web/build/lt1/dmcompiler.log" 2>&1) || true
tail -2 "$ROOT/web/build/lt1/dmcompiler.log"
[ -f "$SRC/tg_lt1.json" ] || { echo "no JSON produced" >&2; exit 1; }

cd "$ROOT/web"
npm run boot -- --json "$SRC/tg_lt1.json" --ticks 100000 --seconds 600 \
	--stop-at '^\[lt1\] done' --log "$ROOT/web/build/lt1/vm-boot.log" --data-out "$ROOT/web/build/lt1/vm-data" \
	> "$ROOT/web/build/lt1/vm-boot.stdout" 2>&1 || true
grep '^\[lt1\]' "$ROOT/web/build/lt1/vm-boot.log" > "$ROOT/web/build/lt1/vm.txt" || true
echo "[lt1] VM: $(wc -l < "$ROOT/web/build/lt1/vm.txt") lines"
grep -E "stopped after|FATAL" "$ROOT/web/build/lt1/vm-boot.log" | head -5
