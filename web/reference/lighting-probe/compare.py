#!/usr/bin/env python3
# compare.py - Compare lt1_probe.dm output from BYOND and the VM: per tile and per corner, which light sources differ.
# Usage: web/reference/lighting-probe/compare.py [byond.txt] [vm.txt]   (defaults: web/build/lt1/{byond,vm}.txt)
import re, sys, os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
a = sys.argv[1] if len(sys.argv) > 1 else f"{ROOT}/web/build/lt1/byond.txt"
b = sys.argv[2] if len(sys.argv) > 2 else f"{ROOT}/web/build/lt1/vm.txt"
def load(p):
    tiles, spots = {}, {}
    for line in open(p):
        m = re.match(r"\[lt1\] tile (\S+) (\S+) (\S+) (.*?) corners=(.*)", line)
        if m:
            tag, xy, typ, rest, cs = m.groups()
            corners = {}
            for cm in re.finditer(r"\(([^)]*)\)=(\S+?)\{([^}]*)\}", cs):
                srcs = {}
                for s in filter(None, cm.group(3).split(";")):
                    k, v = s.rsplit(":", 1)
                    srcs[k] = v
                corners[cm.group(1)] = (cm.group(2), srcs)
            tiles[(tag, xy)] = (typ, rest, corners)
        m = re.match(r"\[lt1\] spot (\S+) \S+ (\S+) affecting=\d+: (.*)", line)
        if m:
            spots[m.group(1)] = set(m.group(3).split())
    return tiles, spots
ta, sa = load(a); tb, sb = load(b)
bad = 0
for k in sorted(set(sa) | set(sb)):
    if sa.get(k) != sb.get(k):
        bad += 1
        print(f"spot {k}: view differs: byond-only {sorted(sa.get(k, set()) - sb.get(k, set()))} vm-only {sorted(sb.get(k, set()) - sa.get(k, set()))}")
srcdiff = {}
for k in sorted(set(ta) | set(tb)):
    if k not in ta or k not in tb:
        print("tile only on one side", k); bad += 1; continue
    (typa, resta, ca), (typb, restb, cb) = ta[k], tb[k]
    if (typa, resta) != (typb, restb):
        print(f"tile {k}: byond {resta}\n{' '*len(str(k))}        vm    {restb}")
        bad += 1
    for c in sorted(set(ca) | set(cb)):
        sa_, sb_ = ca.get(c, ("?", {}))[1], cb.get(c, ("?", {}))[1]
        for s in set(sa_) | set(sb_):
            if sa_.get(s) != sb_.get(s):
                srcdiff.setdefault(s, []).append((k, c, sa_.get(s), sb_.get(s)))
for s, l in sorted(srcdiff.items()):
    print(f"source {s}: differs on {len(l)} corners, e.g. {l[0]}")
print(f"{len(ta)} tiles, {bad} tile/view differences, {len(srcdiff)} sources with different effects")
