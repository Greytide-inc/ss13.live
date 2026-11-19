#!/usr/bin/env python3
# split-lines - Cuts a line range of a .ts file into a new file as an exact copy and fixes both files' imports.
# Usage: python3 tools/split-lines.py SRC START END DEST HEADERFILE  - cut lines START..END (1-based, inclusive) of SRC into DEST (exact copy),
# DEST gets HEADERFILE's text, then SRC's import lines (pruned to names DEST uses), then the lines.
# SRC gets `import { names } from "./DEST"` for DEST's exported names SRC still uses. Unused imports are pruned in both
# (a name only in a comment counts as used: `npx tsc --noEmit -p . --noUnusedLocals` lists those). Then tsc names the rest.
import re, sys, os
src, a, b, dest, hdr = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4], sys.argv[5]
L = open(src).read().split("\n")
moved = L[a-1:b]
rest = L[:a-1] + L[b:]
imp_re = re.compile(r'^import (type )?\{ (.*) \} from "(.*)";$')
imports = [l for l in L if imp_re.match(l)]

def body_text(lines):
    return "\n".join(l for l in lines if not imp_re.match(l))

def prune(lines_imports, body):
    out = []
    for l in lines_imports:
        m = imp_re.match(l)
        names = [n.strip() for n in m.group(2).split(",")]
        keep = []
        for n in names:
            local = n.replace("type ", "").split(" as ")[-1].strip()
            if re.search(r'(?<![\w$.])' + re.escape(local) + r'(?![\w$])', body): keep.append(n)
        if keep: out.append(f'import {m.group(1) or ""}{{ {", ".join(keep)} }} from "{m.group(3)}";')
    return out

dest_body = "\n".join(moved)
exported = re.findall(r'^export (?:const|let|function|class|interface|type|async function)\s+([\w$]+)', dest_body, re.M)
exported += [n for line in re.findall(r'^export const (.*?)=', dest_body, re.M) for n in re.findall(r'([\w$]+)\s*$', line)]
for m in re.finditer(r'^export const ([^;]*);', dest_body, re.M):
    for part in m.group(1).split(","):
        nm = part.split("=")[0].strip().split(":")[0].strip()
        if re.fullmatch(r'[\w$]+', nm): exported.append(nm)
exported = list(dict.fromkeys(exported))
typeish = set(re.findall(r'^export (?:interface|type)\s+([\w$]+)', dest_body, re.M))

dest_imports = prune(imports, dest_body)
header = open(hdr).read().rstrip("\n").split("\n")
open(dest, "w").write("\n".join(header + [""] + dest_imports + [""] + moved).rstrip("\n") + "\n")

rest_body = body_text(rest)
need = [n for n in exported if re.search(r'(?<![\w$.])' + re.escape(n) + r'(?![\w$])', rest_body)]
rel = "./" + os.path.basename(dest).replace(".ts", ".js")
# rebuild SRC: replace its import block with pruned imports + the new import
first = next(i for i, l in enumerate(rest) if imp_re.match(l))
non_imp = [l for l in rest if not imp_re.match(l)]
new_imps = prune([l for l in rest if imp_re.match(l)], rest_body)
if need:
    new_imps.append("import { " + ", ".join(("type " + n) if n in typeish else n for n in need) + f' }} from "{rel}";')
out = non_imp[:first] + new_imps + non_imp[first:]
open(src, "w").write("\n".join(out))
print("moved", b - a + 1, "lines; exported:", exported, "; src imports:", need)
