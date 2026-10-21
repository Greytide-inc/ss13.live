// inc-chunk (draw1b): a changed chunk keeps the sprites of items that did not change and places again only the rest (incPlaceChunk), dropping the
// animated slots of re-placed items and adding the new ones; then the slots re-pick frames (refreshSlots). After any sequence of changes the sprites
// (texture, position, alpha, visibility, order) and the slot lists equal a full re-place of the chunk. Fake sprite pool, as inc-place.test.ts.
import assert from "node:assert";
(globalThis as Record<string, unknown>).document = new Proxy({}, { get: () => () => new Proxy(function () {}, { get: () => () => {}, set: () => true }) });
(globalThis as Record<string, unknown>).window = globalThis;
const { incPlaceChunk } = await import("../../src/render/inc-place.js");

interface Sp { tex: string; x: number; y: number; alpha: number; visible: boolean }
interface Slot { k: number; a: any; kk: number }
const mk = (name: string, n: number, anim: number, alpha = 255) => ({ name, n, anim, alpha });
let seed = 777;
const rnd = (n: number) => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n; };
const frameOf = (a: any, ft: number): number => (a.anim === 0 ? 0 : a.anim === 1 ? Math.floor(ft) % 4 : Math.floor(ft * 3) % 4);

class Chunk {
	pool: Sp[] = []; used = 0; slotsA: Slot[] = []; slotsB: Slot[] = [];
	sp(i: number): Sp { return (this.pool[i] ??= { tex: "", x: 0, y: 0, alpha: 0, visible: false }); }
	placeItem(it: any, start: number, ft: number): number {
		const a = it.appearance;
		this.used = start;
		for (let k = 0; k < a.n; k++) {
			const s = this.sp(this.used++);
			s.tex = `${a.name}:${k}:${frameOf(a, ft)}`; s.x = it.originX + k; s.y = it.originY; s.alpha = a.alpha; s.visible = true;
			if (a.anim) (a.anim === 1 ? this.slotsA : this.slotsB).push({ k: this.used - 1, a, kk: k });
		}
		return this.used;
	}
	refresh(ft: number, doA: boolean): void {
		for (const sl of doA ? this.slotsA : []) this.pool[sl.k].tex = `${sl.a.name}:${sl.kk}:${frameOf(sl.a, ft)}`;
		for (const sl of this.slotsB) this.pool[sl.k].tex = `${sl.a.name}:${sl.kk}:${frameOf(sl.a, ft)}`;
	}
	snapshot(): string {
		const slots = (l: Slot[]) => l.map((s) => `${s.k}/${s.a.name}/${s.kk}`).sort().join(",");
		return JSON.stringify(this.pool.slice(0, this.used).map((s) => [s.tex, s.x, s.y, s.alpha, s.visible])) + "|hidden:" + this.pool.slice(this.used).filter((s) => s.visible).length + "|A:" + slots(this.slotsA) + "|B:" + slots(this.slotsB);
	}
}
const full = (items: any[], ft: number): string => {
	const c = new Chunk(); let u = 0;
	for (const it of items) u = c.placeItem(it, u, ft);
	return c.snapshot();
};
const kinds = [mk("floor", 1, 0), mk("wall", 2, 0), mk("door", 1, 1), mk("fire", 3, 2), mk("blob", 1, 0, 128), mk("pile", 4, 0), mk("wind", 2, 1), mk("none", 0, 0)];
const mkItem = () => ({ appearance: kinds[rnd(kinds.length)], originX: rnd(20) * 32, originY: rnd(15) * 32, layer: 0, plane: 0 });
let items: any[] = Array.from({ length: 30 }, mkItem);
let ft = 10, lastDs = 10;
const c = new Chunk();
let kept = { items: [] as any[], ends: [] as number[], flags: [] as number[] };
const st = { replaced: 0, moved: 0, kept: 0 };
const fullDraw = (): void => {
	c.slotsA.length = c.slotsB.length = 0; let u = 0; kept = { items, ends: [], flags: [] };
	items.forEach((it, i) => { u = c.placeItem(it, u, ft); kept.ends[i] = u; kept.flags[i] = 0; });
	c.used = u; for (let i = u; i < c.pool.length; i++) c.pool[i].visible = false;
	lastDs = Math.floor(ft);
};
fullDraw();
for (let step = 0; step < 4000; step++) {
	const op = rnd(11);
	items = items.slice(); if (!items.length) items.push(mkItem(), mkItem());
	if (op === 0) items.splice(rnd(items.length + 1), 0, mkItem());
	else if (op === 1 && items.length > 2) items.splice(rnd(items.length), 1);
	else if (op === 2) { const i = rnd(items.length); items[i] = { ...items[i], originX: items[i].originX + rnd(5) * 4 - 8 }; }
	else if (op === 3) { const i = rnd(items.length); items[i] = { ...items[i], appearance: kinds[rnd(kinds.length)] }; }
	else if (op === 4) { const i = rnd(items.length), j = rnd(items.length); [items[i], items[j]] = [items[j], items[i]]; }
	else if (op === 5) { items.splice(0, rnd(items.length)); items.push(...Array.from({ length: rnd(8) }, mkItem)); }
	else if (op <= 8) ft += rnd(3) === 0 ? 1.25 : 0.0625;
	if (op >= 9) items = items.map((it) => ({ ...it }));
	if (op === 10 && step % 7 === 0) items = [];
	const changed = items.length !== kept.items.length || items.some((it, i) => it.appearance !== kept.items[i].appearance || it.originX !== kept.items[i].originX || it.originY !== kept.items[i].originY);
	const ds = Math.floor(ft);
	if (changed && items.length > 0 && kept.items.length > 0) {
		c.used = incPlaceChunk(kept, items, c.used, c.pool.length, [c.slotsA, c.slotsB], {
			placeItem: (it, start) => c.placeItem(it, start, ft),
			shift: (k0, k1, dx, dy) => { for (let i = k0; i < k1; i++) { c.pool[i].x += dx; c.pool[i].y += dy; } },
		}, st);
		for (let i = c.used; i < c.pool.length; i++) c.pool[i].visible = false;
		c.refresh(ft, ds !== lastDs);
	} else if (changed) fullDraw();
	else c.refresh(ft, ds !== lastDs);
	lastDs = ds;
	assert.equal(c.snapshot(), full(items, ft), `step ${step} op ${op}`);
}
assert.ok(st.replaced > 300 && st.moved > 200 && st.kept > 500, `fuzz covered ${JSON.stringify(st)}`);
console.log(`inc-chunk: 4000 steps equal to a full re-place of the chunk (${st.replaced} items placed, ${st.moved} moved, ${st.kept} untouched)`);
