// snap-census - What a world snapshot holds: objects per class, and Arrays/Maps/Sets by the field that holds them
// (count, total entries, empty). Usage (from web/, after npm run build): node --max-old-space-size=6000 tools/snap-census.mjs dist/web/build/world.snap.gz
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { snapshotObjects } from "../build/dist/src/vm/snapshot.js";
const bytes = gunzipSync(readFileSync(process.argv[2]));
const N = 8_000_000;
const kind = new Uint8Array(N), size = new Uint32Array(N); // 1 array 2 map 3 set
const cls = new Map(), owner = new Map(); let n = 0;
const ownerOf = new Int32Array(N).fill(-1); const ownerKeys = [];
const ownerKeyIdx = new Map();
for (const o of snapshotObjects(bytes)) {
	n++;
	cls.set(o.cls, (cls.get(o.cls) ?? 0) + 1);
	if (o.cls === "Array") { kind[o.id] = 1; size[o.id] = o.vals.length; }
	else if (o.cls === "Map") { kind[o.id] = 2; size[o.id] = o.vals.length / 2; }
	else if (o.cls === "Set") { kind[o.id] = 3; size[o.id] = o.vals.length; }
	const keys = o.keys;
	for (let i = 0; i < o.vals.length; i++) {
		const v = o.vals[i];
		if (v.charCodeAt(0) !== 111 || !v.startsWith("o:#")) continue;
		const id = Number(v.slice(3));
		if (ownerOf[id] !== -1) continue;
		const k = `${o.cls}.${keys ? keys[i] : (o.cls === "Map" ? (i % 2 ? "value" : "key") : "item")}`;
		let ki = ownerKeyIdx.get(k); if (ki === undefined) { ki = ownerKeys.length; ownerKeys.push(k); ownerKeyIdx.set(k, ki); }
		ownerOf[id] = ki;
	}
}
console.log(`objects ${n}`);
console.log([...cls].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([c, k]) => `${String(k).padStart(9)} ${c}`).join("\n"));
const agg = new Map();
for (let id = 0; id < n; id++) if (kind[id]) {
	const k = `${["", "Array", "Map", "Set"][kind[id]]} <- ${ownerOf[id] >= 0 ? ownerKeys[ownerOf[id]] : "?"}`;
	const a = agg.get(k) ?? [0, 0, 0]; a[0]++; a[1] += size[id]; if (size[id] === 0) a[2]++; agg.set(k, a);
}
console.log("\ncontainers by owner: count, total entries, empty");
console.log([...agg].sort((a, b) => b[1][1] + b[1][0] * 4 - (a[1][1] + a[1][0] * 4)).slice(0, 40).map(([k, [c, s, e]]) => `${String(c).padStart(9)} ${String(s).padStart(10)} ${String(e).padStart(8)}  ${k}`).join("\n"));
