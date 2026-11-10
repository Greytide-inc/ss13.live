#!/usr/bin/env bash
# pb-judge.sh - Phrasebook judge round: 5 fresh Claude agents, 5 game files each, asked what they make of the code; transcripts in build/judge/ROUND/.
# Usage (from web/): tools/pb-judge.sh ROUND      (Bash timeout 900000 ms; the 5 agents run at once)
# Files: the 20 most-edited game files since 2026-10-04 (same every round) + 5 at random, never one an earlier round drew.
# Agents: claude -p in an empty temp dir, --safe-mode (no CLAUDE.md, memory, skills, hooks; --bare would need an API key), no tools, files on stdin.
# Env: PB_MODEL=ID tries another judge model; PB_FILES=ROUND reuses that round's files (to compare models on the same files).
# Output: build/judge/ROUND/agentN.md (answer), agentN.files (its files), hits.txt (machine-made words, for reading, not the verdict).
set -euo pipefail
cd "$(dirname "$0")/.."
round="${1:?usage: tools/pb-judge.sh ROUND}"
out="build/judge/$round"
[ -e "$out" ] && { echo "$out exists; pick another ROUND" >&2; exit 2; }
mkdir -p "$out"

QUESTION="Here are some source files from a JavaScript browser game. What do you make of this code: its style, its quality, anything that stands out?"
MODEL="${PB_MODEL:-claude-opus-5-5}"
echo "$MODEL" > "$out/model.txt"

# The 20 most-edited files (ties by name), then 5 random ones no earlier round used.
if [ -n "${PB_FILES:-}" ]; then
  cp "build/judge/$PB_FILES/top.txt" "build/judge/$PB_FILES/random.txt" "$out/"
else
git log --since=2026-10-04 --name-only --format= -- game/code | grep -E '\.ts$' | sed 's|^web/||' \
  | sort | uniq -c | sort -k1,1nr -k2 | while read -r _ f; do if [ -f "$f" ]; then echo "$f"; fi; done | sed -n 1,20p > "$out/top.txt"
cat build/judge/*/random.txt 2>/dev/null | sort -u > "$out/used.tmp" || true
find game/code -name '*.ts' | sort | grep -vxF -f "$out/top.txt" | grep -vxF -f "$out/used.tmp" | shuf -n 5 > "$out/random.txt"
rm "$out/used.tmp"
fi
mapfile -t top < "$out/top.txt"
mapfile -t rnd < "$out/random.txt"
[ ${#top[@]} -eq 20 ] && [ ${#rnd[@]} -eq 5 ] || { echo "picked ${#top[@]} top + ${#rnd[@]} random files, want 20 + 5" >&2; exit 1; }

# Each agent gets 4 top files (spread over the ranking) and 1 random one; names shown from code/ down, as in a checkout.
unset_env=()
for v in $(env | grep -oE '^(CLAUDE[A-Z_]*|AI_AGENT)=' | tr -d =); do unset_env+=(-u "$v"); done
for i in 1 2 3 4 5; do
  files=("${top[$((i - 1))]}" "${top[$((i + 4))]}" "${top[$((i + 9))]}" "${top[$((i + 14))]}" "${rnd[$((i - 1))]}")
  printf '%s\n' "${files[@]}" > "$out/agent$i.files"
  dir=$(mktemp -d /tmp/pb-judge.XXXXXX)
  {
    echo "$QUESTION"
    for f in "${files[@]}"; do
      echo; echo "===== ${f#game/} ====="; cat "$f"
    done
  } > "$dir/input.txt"
  ( cd "$dir"; code=0
    env "${unset_env[@]}" timeout 800 claude -p --safe-mode --no-session-persistence --tools "" --model "$MODEL" \
      < input.txt > "$OLDPWD/$out/agent$i.md" 2> "$OLDPWD/$out/agent$i.err" || code=$?
    echo $code > "$OLDPWD/$out/agent$i.exit"; rm -rf "$dir" ) &
done
wait

grep -niE 'generat|transpil|translat|compil|codegen|machine|automat|tool|mechanic|decompil|ported|converted|port of' "$out"/agent?.md > "$out/hits.txt" || true
for i in 1 2 3 4 5; do
  echo "agent$i: exit $(cat "$out/agent$i.exit"), $(wc -w < "$out/agent$i.md") words, $(grep -c "^$out/agent$i.md:" "$out/hits.txt" || true) hit lines"
done
echo "transcripts: $out/agent?.md   hits: $out/hits.txt"
