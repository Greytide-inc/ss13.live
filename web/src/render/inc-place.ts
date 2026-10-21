// inc-place - the per-item part of redrawing a plane without placing everything again. Pure (no Pixi): pixi-view.ts gives it the real
// "place this item's sprites" and "move these sprites" calls; tests/draw/inc-place.test.ts gives it a fake pool and compares the result with
// a full re-place after every step.
//
// A plane keeps, per item, where its sprites end in the pool (`ends`) and two flags (ANIM: a sprite of it has more than one frame; CLOCK: that
// frame can change between whole deciseconds). A new item list is walked in order against the kept one; an item that is the same appearance
// at the same fit is only moved (its origin and the camera shift), unless it is animated and its frame may have changed; any other item is
// placed again in the slots it had. If an item needs a different number of sprites than it had, it and everything after it is placed again
// (slots after it no longer line up), so the result is always exactly what a full re-place gives.
import type { DrawItem, HudFit } from "./client-scene.js";

export const ANIM = 1, CLOCK = 2;
export const sameFit = (a?: HudFit, b?: HudFit): boolean => a === b || (!!a && !!b && a.k === b.k && a.dx === b.dx && a.dy === b.dy);

export interface Kept { items: DrawItem[]; ends: number[]; flags: number[] }
export interface IncOps {
	/** the plane's decisecond (floor of the frame time) differs from the one the kept sprites' frames were picked at */
	dsMoved: boolean;
	/** shift of the map grid since the kept draw (screen objects don't take it) */
	dmx: number; dmy: number;
	/** place this item's sprites from pool slot `start`; returns the slot after its last sprite and the ANIM/CLOCK flags it set */
	place(it: DrawItem, start: number, i: number): { end: number; flags: number };
	/** move pool slots k0..k1-1 by (dx, dy) */
	shift(k0: number, k1: number, dx: number, dy: number): void;
}
/** Updates `k` (items, ends, flags) to `next` and returns the number of pool slots in use. Counts: how many items were placed again. */
export function incPlace(k: Kept, next: DrawItem[], o: IncOps, stats?: { replaced: number; moved: number; kept: number }): number {
	const prev = k.items, ends = k.ends, fl = k.flags;
	let tail = false, s0 = 0;
	for (let i = 0; i < next.length; i++) {
		const it = next[i];
		if (!tail) {
			const pv = prev[i];
			if (pv && pv.appearance === it.appearance && pv.hud === it.hud && sameFit(pv.hk, it.hk)) {
				const f = fl[i];
				if (!(f & ANIM) || (!(f & CLOCK) && !o.dsMoved)) { // same picture: only moved
					const hk = it.hk?.k ?? 1, dx = (it.originX - pv.originX) * hk + (it.hud ? 0 : o.dmx), dy = (it.originY - pv.originY) * hk + (it.hud ? 0 : o.dmy);
					if (dx || dy) { o.shift(s0, ends[i], dx, dy); if (stats) stats.moved++; } else if (stats) stats.kept++;
					s0 = ends[i];
					continue;
				}
			}
			const e = ends[i], r = o.place(it, s0, i);
			if (stats) stats.replaced++;
			fl[i] = r.flags;
			if (r.end !== e) { tail = true; ends[i] = r.end; }
			s0 = r.end;
		} else {
			const r = o.place(it, s0, i);
			if (stats) stats.replaced++;
			ends[i] = r.end; fl[i] = r.flags;
			s0 = r.end;
		}
	}
	ends.length = fl.length = next.length;
	k.items = next;
	return s0;
}

/** the same for a chunk's sprites, which also keep lists of animated slots (each with its sprite's pool index `k`). Items placed again drop their old slots
 *  from `lists` (only the entries that existed before the call; the ones `placeItem` pushes meanwhile stay). No flags: frames of kept animated items are
 *  refreshed through the slots afterwards, so nothing here is ever "animated, place again". Returns the pool slots in use. */
export function incPlaceChunk<S extends { k: number }>(k: Kept, next: DrawItem[], prevUsed: number, poolLen: number, lists: S[][], o: {
	/** place this item from pool slot `start`; returns the slot after its last sprite */
	placeItem(it: DrawItem, start: number): number;
	shift(k0: number, k1: number, dx: number, dy: number): void;
}, stats?: { replaced: number; moved: number; kept: number }): number {
	const lens = lists.map((l) => l.length), prevN = k.items.length, ends = k.ends;
	const dirty = new Uint8Array(Math.max(poolLen, prevUsed) + 1);
	const used = incPlace(k, next, {
		dsMoved: false, dmx: 0, dmy: 0,
		place: (it, start, i) => {
			const oldEnd = i < prevN ? ends[i] : prevUsed, end = o.placeItem(it, start);
			for (let j = start, e = Math.max(end, oldEnd); j < e; j++) dirty[j] = 1;
			return { end, flags: 0 };
		},
		shift: o.shift,
	}, stats);
	lists.forEach((ls, n) => {
		let w = 0;
		for (let r = 0; r < ls.length; r++) if (r >= lens[n] || !dirty[ls[r].k]) ls[w++] = ls[r];
		ls.length = w;
	});
	return used;
}
