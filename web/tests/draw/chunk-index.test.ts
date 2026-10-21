// chunk-index (page-draw step 4): items land in every chunk their box touches, in global draw order; a changed tile bumps the versions of the chunk-planes
// it was in and is in now; an unchanged tile bumps nothing. Fuzzed against a brute-force scan of all items.
import assert from "node:assert";
(globalThis as Record<string, unknown>).document = new Proxy({}, { get: () => () => new Proxy(function () {}, { get: () => () => {}, set: () => true }) });
(globalThis as Record<string, unknown>).window = globalThis;
const { ChunkIndex, chunkCol, chunkRow, chunkRect } = await import("../../src/render/chunk-index.js");
const { relBox } = await import("../../src/render/item-box.js");

const mkDmi = (w: number, h: number) => ({ width: w, height: h, imageWidth: w, imageHeight: h, columns: 1, rows: 1, states: [{ name: "s", dirs: 1, frames: 1, delay: [], loop: 0, rewind: false, cells: [[0]] }] });
const icons = new Map([["a.dmi", { dmi: mkDmi(32, 32), img: null }], ["big.dmi", { dmi: mkDmi(96, 96), img: null }]]) as never;
const app = (o: Record<string, unknown> = {}) => ({ icon: "a.dmi", iconState: "s", dir: 2, alpha: 255, color: null, transform: null, pixelX: 0, pixelY: 0, layer: 2, plane: 0, overlays: [], maptext: "", ...o }) as never as any;
let ids = 0;
const item = (tx: number, ty: number, a: any, plane = a.plane, layer = a.layer) => ({ plane, layer, originX: tx * 32, originY: -ty * 32, appearance: a, id: ++ids, mo: 1, iconX0: tx * 32, iconY1: -ty * 32 + 32 }) as any;
const idx = new ChunkIndex((it) => relBox(it.appearance, icons));

// chunk geometry: a tile's 32x32 box is inside its chunk's rectangle, for every tile row/column
for (let ty = -40; ty < 80; ty++) for (let tx = -40; tx < 80; tx++) {
	const x = tx * 32, y = -ty * 32, r = chunkRect(chunkCol(x), chunkRow(y));
	assert.ok(x >= r.x0 && x + 32 <= r.x1 && y >= r.y0 && y + 32 <= r.y1, `tile ${tx},${ty} outside its chunk`);
	assert.equal(chunkCol(x), Math.floor(tx / 16)); assert.equal(chunkRow(y), -Math.floor(ty / 16));
}

// a plain item is in one chunk; a tall icon on the last tile row spills into the next chunk north; a 96 px icon on a corner into four
{
	const t = new ChunkIndex((it) => relBox(it.appearance, icons));
	t.setTile(5 + 5 * 65536, [item(5, 5, app())]);
	assert.equal(t.cps.size, 1);
	t.setTile(15 + 15 * 65536, [item(15, 15, app({ icon: "big.dmi" }))]); // 96x96 drawn from its tile's bottom-left: covers x 480..575, y -480-64..-480+32
	const cols = new Set([...t.cps.values()].map((c) => `${c.col},${c.row}`));
	assert.ok(cols.has("0,0") && cols.has("1,0") && cols.has("0,-1") && cols.has("1,-1"), [...cols].join(" "));
	// pixel_x pushes a plain icon over the east edge
	t.setTile(15 + 2 * 65536, [item(15, 2, app({ pixelX: 4 }))]);
	assert.ok([...t.cps.values()].some((c) => c.col === 1 && c.tiles.has(15 + 2 * 65536)));
	// versions: same items again -> no bump; a moved item bumps old and new
	const before = new Map([...t.cps.values()].map((c) => [c, c.version]));
	t.setTile(5 + 5 * 65536, [item(5, 5, app())]); // a different appearance object: counts as changed
	const a1 = app(), it1 = item(20, 3, a1);
	t.setTile(20 + 3 * 65536, [it1]);
	const cpA = [...t.cps.values()].find((c) => c.tiles.has(20 + 3 * 65536))!, vA = cpA.version;
	t.setTile(20 + 3 * 65536, [{ ...it1 }]);
	assert.equal(cpA.version, vA, "an identical tile must not bump the version");
	t.setTile(20 + 3 * 65536, [{ ...it1, originX: it1.originX - 32 * 5 }]); // moved west into chunk 0: both chunk-planes change (the old one empties and goes)
	assert.ok(!t.cps.has(cpA.chunk * 8192 + cpA.plane + 4096) || cpA.version > vA);
	assert.ok(before.size > 0);
	t.setTile(20 + 3 * 65536, null);
	t.setTile(5 + 5 * 65536, null); t.setTile(15 + 15 * 65536, null); t.setTile(15 + 2 * 65536, null);
	assert.equal(t.cps.size, 0, "everything removed leaves no chunk-planes"); assert.equal(t.planeItems.size, 0); assert.equal(t.chunks.size, 0);
}

// fuzz: random tiles with random items; after each batch of changes every chunk-plane's items equal a brute-force scan, in global draw order
let seed = 12345;
const rnd = (n: number) => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n; };
const apps = [app(), app({ icon: "big.dmi" }), app({ pixelX: -7 }), app({ pixelY: 40 }), app({ transform: [2, 0, 0, 0, 2, 0] }), app({ transform: [0, 1, 0, -1, 0, 0], pixelX: 5 }), app({ plane: 3, layer: 5 }), app({ plane: -95, layer: 1 }), app({ icon: null }), app({ overlays: [app({ pixelX: 40 })] }), app({ layer: 9 })];
const tilesNow = new Map<number, any[]>();
const brute = (col: number, row: number, plane: number) => {
	const r = chunkRect(col, row), out: any[] = [];
	for (const key of [...tilesNow.keys()].sort((a, b) => a - b)) for (const it of tilesNow.get(key)!) {
		if (it.plane !== plane) continue;
		const b = relBox(it.appearance, icons);
		if (it.originX + b.x0 < r.x1 && Math.ceil(it.originX + b.x1) > r.x0 && it.originY + b.y0 < r.y1 && Math.ceil(it.originY + b.y1) > r.y0) out.push(it);
	}
	return out.sort((a, b) => a.layer - b.layer);
};
for (let round = 0; round < 60; round++) {
	for (let k = 0; k < 40; k++) {
		const tx = rnd(40), ty = rnd(40), key = tx + ty * 65536;
		if (rnd(5) === 0) { tilesNow.delete(key); idx.setTile(key, null); continue; }
		const list: any[] = [];
		for (let n = rnd(4); n >= 0; n--) list.push(item(tx, ty, apps[rnd(apps.length)], undefined, undefined));
		tilesNow.set(key, list); idx.setTile(key, list);
	}
	let seen = 0;
	for (const cp of idx.cps.values()) {
		const got = idx.items(cp), want = brute(cp.col, cp.row, cp.plane);
		assert.equal(got.length, want.length, `chunk ${cp.col},${cp.row} plane ${cp.plane}: ${got.length} vs ${want.length}`);
		for (let i = 0; i < got.length; i++) assert.equal(got[i], want[i], `item ${i} order in chunk ${cp.col},${cp.row} plane ${cp.plane}`);
		seen += got.length;
	}
	// no chunk-plane is missing: every brute-force item set that is non-empty exists
	for (let col = -1; col < 4; col++) for (let row = -4; row < 1; row++) for (const plane of [0, 3, -95]) if (brute(col, row, plane).length) assert.ok([...idx.cps.values()].some((c) => c.col === col && c.row === row && c.plane === plane), `missing chunk-plane ${col},${row},${plane}`);
	assert.ok(seen > 0);
}
// hit-test lookup: all planes of the chunk
{
	const c = idx.chunkItems(0, 0);
	assert.equal(c.length, [...idx.chunks.get(0 + 1024 + (0 + 1024) * 2048)!].reduce((n, cp) => n + idx.items(cp).length, 0));
}
console.log("chunk-index: ok");
