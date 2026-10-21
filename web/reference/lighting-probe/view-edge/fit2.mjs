// fit2.mjs (lt1) - try view() darkness models against BYOND exp.log (gunzip exp.log.gz first). Usage: node fit2.mjs exp.log current 3 [JSON list of option sets]
// fit2.mjs - darkness models with lamps over the whole 15x15 map; LOS in the view box.
import { readFileSync } from "fs";
import { newLosBox, computeLos } from "./vlos.mjs";
const file = process.argv[2] ?? new URL("./exp.log", import.meta.url);
const txt = readFileSync(file, "utf8");
const maps = [];
for (const blk of txt.split(/^R /m).slice(1)) {
  const ls = blk.trim().split("\n");
  const [, p, mode, sid] = ls[0].match(/(\d+) mode=(\d) sid=(\d+)/);
  const rows = ls.slice(1, 16).map(r => [...r.matchAll(/([#.])(\d)(\d+)([S-])/g)].map(m => ({ o: m[1], tl: +m[2], ol: +m[3], s: m[4] })));
  maps.push({ p: +p, mode: +mode, sid: +mode ? +sid : 0, cell: (x, y) => rows[15 - y][x - 1] });
}
const N = 15;
// Models: given full-map opaque O[], lamp Lm[] (index (x-1)+(y-1)*N), the eye (8,8), sid, and a function
// inLos(x,y) (box LOS vis after the shadow passes), return lit(x,y).
export const models = {
  // current: max-spread, L-1 steps through clear tiles, opaque lit from a visible tile with lamp >= 2
  current(O, Lm, sid, inLos, opts = {}) {
    const lamp = Int32Array.from(Lm), src = Lm.map(v => v > 0 ? 1 : 0), litO = new Uint8Array(N * N);
    const e = 7 + 7 * N; if (sid > lamp[e]) { lamp[e] = sid; src[e] = 1; }
    if (opts.quad) { // each lamp (or only the eye's, quad=1) also sits on its +x, +y and +x+y neighbours
      for (let k = N * N - 1; k >= 0; k--) {
        if (Lm[k] <= 0 && k !== e) continue;
        if (opts.quad === 1 && k !== e) continue;
        if (opts.quad === 3 && !opts.mode0) continue;
        if (opts.quad === 4 && (k !== e || !opts.mode0)) continue;
        const x = k % N, y = (k - x) / N, L = k === e ? Math.max(lamp[e], 0) : Lm[k];
        for (const [ax, ay] of [[1, 0], [0, 1], [1, 1]]) {
          const m = x + ax + (y + ay) * N; if (x + ax >= N || y + ay >= N || O[m]) continue;
          if (lamp[m] < L) { lamp[m] = L; }
        }
      }
    }
    for (let L = 40; L >= 2; L--) for (let k = 0; k < N * N; k++) {
      if (lamp[k] !== L || (O[k] && !src[k])) continue;
      const x = k % N, y = (k - x) / N;
      for (let ny = Math.max(y - 1, 0); ny <= Math.min(y + 1, N - 1); ny++) for (let nx = Math.max(x - 1, 0); nx <= Math.min(x + 1, N - 1); nx++) {
        const m = nx + ny * N; if (m === k) continue;
        if (O[m]) { if (inLos(x, y)) litO[m] = 1; } else if (lamp[m] < L - 1) lamp[m] = L - 1;
      }
    }
    return (x, y) => lamp[x + y * N] > 0 || litO[x + y * N] === 1;
  },
};
export function score(name, verbose = 0, opts = {}) {
  const model = models[name];
  let bad = 0, badMaps = 0; const byMode = [0, 0, 0];
  for (const m of maps) {
    const R = m.mode === 0 ? 4 : 7, W = 2 * R + 1, off = 7 - R;
    const O = new Uint8Array(N * N), Lm = new Int32Array(N * N);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const c = m.cell(1 + i, 1 + j); O[i + j * N] = c.o === "#" ? 1 : 0; Lm[i + j * N] = opts.sum ? c.tl + c.ol : Math.max(c.tl, c.ol); if (opts.box !== undefined && Math.max(Math.abs(i - 7), Math.abs(j - 7)) > R + opts.box) Lm[i + j * N] = 0; if (opts.asym && (i - 7 < -R || j - 7 < -R)) Lm[i + j * N] = 0;
      if (opts.ext) { const [a, bb, cst] = opts.ext; const dx = i - 7, dy = j - 7; const inside = Math.abs(dx) <= R && Math.abs(dy) <= R;
        const inExt = dx >= -R - a && dy >= -R - a && dx <= R + bb && dy <= R + bb;
        if (!inExt) Lm[i + j * N] = 0; else if (!inside && Lm[i + j * N] > 0) Lm[i + j * N] += cst; } }
    const b = newLosBox(W, W);
    for (let j = 0; j < W; j++) for (let i = 0; i < W; i++) { const k = i + j * W; b.opaque[k] = O[i + off + (j + off) * N]; }
    b.darkFn = (vis) => {
      const inLos = (x, y) => { const i = x - off, j = y - off; return i >= 0 && j >= 0 && i < W && j < W && vis[i + j * W] !== 0; };
      const lit = model(O, Lm, m.sid, inLos, { ...opts, mode0: m.mode === 0 });
      const out = new Uint8Array(W * W);
      for (let j = 0; j < W; j++) for (let i = 0; i < W; i++) out[i + j * W] = lit(i + off, j + off) ? 1 : 0;
      return out;
    };
    const vis = computeLos(b, 0, false);
    let mb = 0; const out = [];
    for (let j = N - 1; j >= 0; j--) {
      let row = "";
      for (let i = 0; i < N; i++) {
        const bi = i - off, bj = j - off, inR = bi >= 0 && bj >= 0 && bi < W && bj < W;
        const c = m.cell(1 + i, 1 + j), ours = inR && vis[bi + bj * W] !== 0, by = c.s === "S";
        if (ours !== by) { bad++; mb++; if (opts.collect) opts.collect.push({ p: m.p, mode: m.mode, sid: m.sid, dx: i - 7, dy: j - 7, by, c }); }
        row += c.o + (c.tl + c.ol) + (ours === by ? (by ? "S" : "-") : (by ? "B" : "V")) + (inR ? " " : "'");
      }
      out.push(row);
    }
    if (mb) { badMaps++; byMode[m.mode]++; if (verbose-- > 0) console.log(`map ${m.p} mode ${m.mode} sid ${m.sid}: ${mb} off\n` + out.join("\n")); }
  }
  console.log(`${name}: ${maps.length} maps, ${badMaps} off (by mode ${byMode}), ${bad} cells off`);
}
if (process.argv[1].endsWith("fit2.mjs")) for (const n of (process.argv[3] ?? "current").split(",")) { for (const o of JSON.parse(process.argv[5] ?? '[{"box":0}]')) { process.stdout.write(JSON.stringify(o) + ' '); score(n, +(process.argv[4] ?? 0), o); } }
