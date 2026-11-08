// snap-byz - A world snapshot's size by z-level and atom type: each atom claims the plain objects it reaches first (its vars,
// lists, datums), atoms go to their turf's z. Shared things land on the first atom that reaches them (a few odd big entries).
// Usage (from web/, after npm run build): node --max-old-space-size=8000 tools/snap-byz.mjs build/snapshot-cache/world-creative.snap.gz
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { pathToFileURL } from "node:url";
const S = pathToFileURL(process.cwd() + "/build/dist/src/").href;
const { snapshotObjects } = await import(S + "vm/snapshot.js");
async function typeNames() { // type id -> path, from the type tree (snapshots name types by id)
  const { gameProgram } = await import(S + "vm/typedefs.js"); const { ObjectTree } = await import(S + "vm/objtree.js");
  await import(pathToFileURL(process.cwd() + "/build/game-types.js").href);
  return new ObjectTree(gameProgram()).types.map((t) => t.path);
}
const bytes = gunzipSync(readFileSync(process.argv[2]));
const N = 9_000_000;
const w = new Uint32Array(N), start = new Uint32Array(N + 1), refs = new Int32Array(90_000_000);
const atom = new Uint8Array(N), typ = new Int32Array(N), loc = new Int32Array(N).fill(-1), zOf = new Int16Array(N), kind = new Int8Array(N), shapeOf = new Int32Array(N), valsOf = new Int32Array(N), namesOf = new Map();
let nr = 0, n = 0;
const ref = (v) => v && v.startsWith("o:#") ? Number(v.slice(3)) : -1;
for (const o of snapshotObjects(bytes)) {
  const id = o.id; n = Math.max(n, id + 1); start[id] = nr; w[id] = o.vals.length + 1;
  for (const v of o.vals) if (v.charCodeAt(0) === 111 && v.startsWith("o:#")) refs[nr++] = Number(v.slice(3));
  start[id + 1] = nr;
  if (o.cls === "DMAtom" || o.cls === "DMObject") {
    const g = (k) => o.vals[o.keys.indexOf(k)];
    atom[id] = o.cls === "DMAtom" ? 1 : 2; typ[id] = Number(g("type").slice(5)); shapeOf[id] = ref(g("shape")); valsOf[id] = ref(g("vals"));
    if (o.cls === "DMAtom") { loc[id] = ref(g("loc")); zOf[id] = Number(g("z").slice(2)); kind[id] = Number(g("kind").slice(2)); }
  }
  if (o.cls === "VarShape") namesOf.set(id, ref(o.vals[o.keys.indexOf("names")]));
}
// z of every atom: its own (turfs, areas 0), else its loc's
const zz = (id) => { let d = 0; while (id >= 0 && d++ < 50) { if (zOf[id] > 0) return zOf[id]; id = loc[id]; } return 0; };
// claim: each DM object (atoms first, then datums) takes the plain objects it reaches that nobody took
const owner = new Int32Array(n).fill(-1), q = new Int32Array(n);
const claim = (root) => { let h = 0, t = 0; q[t++] = root; owner[root] = root; let s = 0;
  while (h < t) { const id = q[h++]; s += w[id]; for (let r = start[id]; r < start[id + 1]; r++) { const c = refs[r]; if (c < n && owner[c] === -1 && !atom[c]) { owner[c] = root; q[t++] = c; } } } return s; };
const own = new Float64Array(n);
for (let id = 0; id < n; id++) if (atom[id] === 1) own[id] = claim(id);
for (let id = 0; id < n; id++) if (atom[id] === 2 && owner[id] === -1) own[id] = claim(id);
let tot = 0, un = 0; for (let i = 0; i < n; i++) { tot += w[i]; if (owner[i] === -1) un += w[i]; }
const T = await typeNames();
const tname = (t) => T[t] ?? "?";
const RAW = bytes.length / 1048576; const pct = (x) => (RAW * x / tot).toFixed(1) + "MB";
console.log(`raw ${RAW.toFixed(1)} MB`);
console.log(`objects ${n}, ${tot} value slots; nobody's (VM, appearances, shared): ${pct(un)}`);
const byZ = new Map(), byZT = new Map();
for (let id = 0; id < n; id++) if (atom[id]) { const z = atom[id] === 1 ? zz(id) : "datum"; byZ.set(z, (byZ.get(z) ?? 0) + own[id]); const k = z + "|" + typ[id] + "|" + kind[id]; const e = byZT.get(k) ?? [0, 0]; e[0]++; e[1] += own[id]; byZT.set(k, e); }
for (const [z, s] of [...byZ].sort((a, b) => b[1] - a[1])) {
  console.log(`\nz ${z}: ${pct(s)}`);
  console.log([...byZT].filter(([k]) => k.split("|")[0] === String(z)).sort((a, b) => b[1][1] - a[1][1]).slice(0, 10).map(([k, [c, s2]]) => `   ${pct(s2).padStart(6)} ${String(c).padStart(7)}x kind${k.split("|")[2]} ${tname(Number(k.split("|")[1]))}`).join("\n"));
}
