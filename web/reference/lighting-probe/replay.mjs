// replay.mjs (lt1) - feed lt1_probe grids to computeLos and compare with the light views BYOND logged. Usage (from web/, after npm run build): node reference/lighting-probe/replay.mjs build/lt1/byond.txt
import { readFileSync } from "fs";
import { newLosBox, computeLos } from "../../build/dist/src/vm/view-los.js";
const lines = readFileSync(process.argv[2] ?? "build/lt1/byond.txt", "utf8").split("\n");
const grids = {}, spots = {};
for (const l of lines) {
  let m = l.match(/^\[lt1\] grid (\S+) (\d+) (.*)$/);
  if (m) { (grids[m[1]] ??= []).push({ y: +m[2], cells: m[3].match(/.../g) }); continue; }
  m = l.match(/^\[lt1\] spot (\S+) \S+ (\d+),(\d+) affecting=\d+: (.*)$/);
  if (m) spots[m[1]] = { x: +m[2], y: +m[3], set: new Set(m[4].split(" ")) };
}
const R = 4, W = 2 * R + 1;
let bad = 0, total = 0;
for (const [tag, g] of Object.entries(grids)) {
  const s = spots[tag];
  const b = newLosBox(W, W);
  const cell = (dx, dy) => g.find(r => r.y === s.y + dy).cells[dx + 5];
  for (let j = 0; j < W; j++) for (let i = 0; i < W; i++) {
    const dx = i - R, dy = j - R, c = cell(dx, dy), k = i + j * W;
    if (c.trim() === "x") { b.areaLit[k] = 1; continue; }
    b.opaque[k] = c[0] === "#" ? 1 : 0; b.lamp[k] = +c[1]; b.areaLit[k] = c[2] === "A" ? 1 : 0;
  }
  b.lamp[R + R * W] = Math.max(b.lamp[R + R * W], R); // source_turf.luminosity = Ceiling(light_range)
  const vis = computeLos(b, 0, false);
  const diffs = [];
  for (let j = 0; j < W; j++) for (let i = 0; i < W; i++) {
    const key = `${s.x + i - R},${s.y + j - R}`;
    const ours = vis[i + j * W] !== 0, byond = s.set.has(key);
    total++;
    if (ours !== byond) diffs.push(`${key}(${i - R},${j - R}) byond=${+byond}`);
  }
  if (diffs.length) { bad++; console.log(tag, diffs.join(" ")); }
}
console.log(`${Object.keys(grids).length} spots, ${bad} with differences, ${total} cells`);
