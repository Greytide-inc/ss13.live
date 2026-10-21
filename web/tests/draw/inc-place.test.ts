// inc-place (draw1a): redrawing a plane item by item (keep sprites, move the moved, place again the changed and the animated) leaves exactly the
// sprite list a full re-place gives: same slots, textures, positions, alpha. Fuzzed over added / removed / moved / changed / reordered / animated items
// and camera shifts, with a fake sprite pool. Also: sortPrepared with the kept-scene cache equals sorting the joined list.
import assert from "node:assert";
(globalThis as Record<string, unknown>).document = new Proxy({}, { get: () => () => new Proxy(function () {}, { get: () => () => {}, set: () => true }) });
(globalThis as Record<string, unknown>).window = globalThis;
const { incPlace, ANIM, CLOCK } = await import("../../src/render/inc-place.js");
const { sortPrepared, viewStats } = await import("../../src/render/client-scene.js");

interface Sp { tex: string; x: number; y: number; alpha: number; visible: boolean }
// a fake appearance: n sprites; anim 0 = still, 1 = frame on the decisecond, 2 = frame on its own clock (between deciseconds)
const mk = (name: string, n: number, anim: number, alpha = 255) => ({ name, n, anim, alpha });
type FA = ReturnType<typeof mk>;
let seed = 12345;
const rnd = (n: number) => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n; };

class Plane {
	pool: Sp[] = []; used = 0; emx = 0; emy = 0;
	sp(i: number): Sp { return (this.pool[i] ??= { tex: "", x: 0, y: 0, alpha: 0, visible: false }); }
	placeItem(it: any, start: number, ft: number): { end: number; flags: number } {
		const a = it.appearance as FA;
		let flags = 0;
		for (let k = 0; k < a.n; k++) {
			const s = this.sp(start + k);
			const fr = a.anim === 0 ? 0 : a.anim === 1 ? Math.floor(ft) % 4 : Math.floor(ft * 3) % 4;
			s.tex = `${a.name}:${k}:${fr}`; s.x = it.originX + (it.hud ? 0 : this.emx) + k; s.y = it.originY + (it.hud ? 0 : this.emy); s.alpha = a.alpha; s.visible = true;
			if (a.anim) flags |= ANIM | (a.anim === 2 ? CLOCK : 0);
		}
		return { end: start + a.n, flags };
	}
	snapshot(used: number): string { return JSON.stringify(this.pool.slice(0, used).map((s) => [s.tex, s.x, s.y, s.alpha, s.visible])) + "|hidden:" + this.pool.slice(used).filter((s) => s.visible).length; }
}
const full = (items: any[], ft: number, emx: number, emy: number): string => {
	const pl = new Plane(); pl.emx = emx; pl.emy = emy;
	let used = 0;
	for (const it of items) used = pl.placeItem(it, used, ft).end;
	return pl.snapshot(used);
};

const kinds = [mk("floor", 1, 0), mk("wall", 2, 0), mk("door", 1, 1), mk("fire", 3, 2), mk("blob", 1, 0, 128), mk("pile", 4, 0)];
const mkItem = (hud = false) => ({ appearance: kinds[rnd(kinds.length)], originX: rnd(20) * 32, originY: rnd(15) * 32, hud, layer: 0, plane: 0 });
let items: any[] = Array.from({ length: 40 }, () => mkItem(false));
items.push(...Array.from({ length: 4 }, () => mkItem(true)));
const pl = new Plane();
let kept = { items: [] as any[], ends: [] as number[], flags: [] as number[] };
let ft = 10, emx = 0, emy = 0, used = 0, moved = 0, replaced = 0, kept0 = 0;
const draw = (inc: boolean): void => {
	const dsMoved = Math.floor(ft) !== lastDs;
	if (!inc) { pl.emx = emx; pl.emy = emy; used = 0; kept = { items, ends: [], flags: [] }; items.forEach((it, i) => { const r = pl.placeItem(it, used, ft); used = r.end; kept.ends[i] = r.end; kept.flags[i] = r.flags; }); }
	else {
		const dmx = emx - pl.emx, dmy = emy - pl.emy; pl.emx = emx; pl.emy = emy;
		const st = { replaced: 0, moved: 0, kept: 0 };
		used = incPlace(kept, items, { dsMoved, dmx, dmy, place: (it, start) => pl.placeItem(it, start, ft), shift: (k0, k1, dx, dy) => { for (let i = k0; i < k1; i++) { pl.pool[i].x += dx; pl.pool[i].y += dy; } } }, st);
		moved += st.moved; replaced += st.replaced; kept0 += st.kept;
		for (let i = used; i < pl.pool.length; i++) pl.pool[i].visible = false;
	}
	lastDs = Math.floor(ft);
};
let lastDs = Math.floor(ft);
draw(false);
for (let step = 0; step < 3000; step++) {
	const op = rnd(12);
	items = items.slice(); // a new list each frame, as a new Prepared
	if (op === 0) items.splice(rnd(items.length + 1), 0, mkItem(rnd(5) === 0));
	else if (op === 1 && items.length > 3) items.splice(rnd(items.length), 1);
	else if (op === 2) { const i = rnd(items.length); items[i] = { ...items[i], originX: items[i].originX + rnd(5) * 4 - 8 }; } // moved (new object, same appearance)
	else if (op === 3) { const i = rnd(items.length); items[i] = { ...items[i], appearance: kinds[rnd(kinds.length)] }; } // appearance changed (maybe other sprite count)
	else if (op === 4) { const i = rnd(items.length), j = rnd(items.length); [items[i], items[j]] = [items[j], items[i]]; } // reordered
	else if (op === 5) emx += rnd(9) * 0.25 - 1;
	else if (op === 6) { emy += rnd(9) * 0.25 - 1; for (let k = 0; k < 3; k++) { const i = rnd(items.length); items[i] = { ...items[i], originY: items[i].originY + 2 }; } }
	else if (op <= 9) ft += rnd(3) === 0 ? 1.25 : 0.0625; // time passes: within a decisecond, or over one
	// ops 10, nothing changed but new item objects
	if (op >= 10) items = items.map((it) => ({ ...it }));
	draw(true);
	assert.equal(pl.snapshot(used), full(items, ft, emx, emy), `step ${step} op ${op}`);
}
assert.ok(moved > 500 && replaced > 500 && kept0 > 500, `fuzz covered ${moved} moved, ${replaced} replaced, ${kept0} kept`);
console.log(`inc-place: 3000 steps equal to a full re-place (${replaced} items placed, ${moved} moved, ${kept0} untouched)`);

// sortPrepared: the scene cache + joined screen objects give what sorting the joined list gives
{
	const it = (plane: number, layer: number, id: number) => ({ plane, layer, originX: id, originY: 0, appearance: { icon: null, iconState: "", overlays: [] } as never, id });
	const flat = Array.from({ length: 60 }, (_, i) => it(i % 3, (i * 7) % 5, i));
	const hud = Array.from({ length: 8 }, (_, i) => it(i % 2 ? 1 : 20, (i * 3) % 4, 100 + i));
	const masters = new Map([[5, {} as never]]);
	const mkP = (h: any[]): any => ({ mapItems: [], hudItems: h, masters, canvasW: 0, canvasH: 0, animated: false, scene: { items: () => flat, cx: 0, cy: 0 } });
	for (const showHud of [true, false, true]) {
		const got = sortPrepared(mkP(hud), showHud, true);
		const ref = new Map<number, any[]>();
		for (const x of showHud ? flat.concat(hud) : flat) { if (!ref.has(x.plane)) ref.set(x.plane, []); ref.get(x.plane)!.push(x); }
		for (const a of ref.values()) a.sort((p, q) => p.layer - q.layer);
		assert.deepEqual([...got.byPlane.keys()].sort(), [...ref.keys()].sort());
		for (const [pl2, a] of ref) assert.deepEqual(got.byPlane.get(pl2)!.map((x: any) => x.id), a.map((x) => x.id), `plane ${pl2} hud ${showHud}`);
		assert.deepEqual(got.planes, [...new Set([...ref.keys(), ...(showHud ? [5] : [])])].sort((a, b) => a - b));
	}
	// a flat list that changed only by swapping items for ones of the same plane and layer (the player's gliding tile rebuilt): patched, still equal to a full sort
	let cur = flat;
	for (let r = 0; r < 200; r++) {
		cur = cur.slice();
		for (let n = 0; n < 1 + rnd(4); n++) { const j = rnd(cur.length); cur[j] = { ...cur[j], originX: cur[j].originX + 1 }; }
		if (r % 50 === 49) cur = cur.concat(it(2, 1, 900 + r)); // a longer list: full sort again
		const pp: any = mkP(hud); pp.scene = { items: () => cur, cx: 0, cy: 0 };
		const got = sortPrepared(pp, true, true);
		const ref = new Map<number, any[]>();
		for (const x of cur.concat(hud)) { if (!ref.has(x.plane)) ref.set(x.plane, []); ref.get(x.plane)!.push(x); }
		for (const [pl2, a] of ref) { a.sort((p, q) => p.layer - q.layer); assert.deepEqual(got.byPlane.get(pl2), a, `patched, round ${r} plane ${pl2}`); }
	}
	assert.ok(viewStats.sPatch > 100 && viewStats.sFull >= 4, `${viewStats.sPatch} patched, ${viewStats.sFull} full`);
	const a = sortPrepared(mkP([]), false, true), b = sortPrepared(mkP([]), false, true);
	assert.equal(a.byPlane.get(0), b.byPlane.get(0), "the cached per-plane array is reused");
	console.log("inc-place: sortPrepared scene cache equals the joined sort");
}
