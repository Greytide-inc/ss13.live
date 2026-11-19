// live-light - the light your mob carries, drawn by the page for liveClientView: it moves with the mob as drawn instead of a tile per server step.
// makeCarriedLight(ctx) returns what liveClientView calls.

import type { BuiltAppearance } from "../appearance/appearance.js";
import type { viewStats as ViewStats } from "./client-scene.js";
import type { makeMovePredict } from "./live-move.js";
import { cornersOf, lessLight, parseLight, strengthAt, type CarriedLight } from "./carried-light.js";
import { glideAt, type Glide } from "./glide.js";
import { isLighting, TILE_PX } from "./station-client.js";

/** What liveClientView shares with the carried light. */
export interface CarriedLightCtx {
	apps: Map<number, BuiltAppearance>;
	tiles: Map<number, { x: number; y: number; ids: number[] }>;
	idx: Map<number, number | Set<number>>;
	idxAdd: (id: number, key: number) => void;
	idxDel: (id: number, key: number) => void;
	dirty: Set<number>;
	glides: Map<number, Glide>;
	lightFades: Map<number, { a: BuiltAppearance; t0: number; ms: number }[]>;
	lightFadeOn: boolean;
	mv: ReturnType<typeof makeMovePredict>;
	viewStats: typeof ViewStats;
	markId: (id: number) => void;
}

// Carried light (carried-light.ts; ?carrylight=0 off): the light your mob carries is taken out of the server's lighting tiles and drawn as
// lighting tiles of the page's own (ids CARRIED_ID0 down), redone on every update (applyCarried): the server's tiles and looks may have changed under it.
// They stay put in the world, on the tiles round the corners the server's shape lights (the mask): walls cut the light off per tile, and a shape that
// glided with the mob lit wall corners mid-step, then snapped back when the next shape came (the seclite flicker round corners in dark maint).
// What moves with the mob as it is drawn (predicted steps too) is how strongly each corner is lit (strengthAt); a new mask fades in over the old one.
// Each tile is drawn as one item per corner (that corner's row of the matrix, in the light's colour) at an alpha for its strength: alphas change
// every frame, the four looks only when the light does.
export const CARRIED_ID0 = -1000000;

export function makeCarriedLight(ctx: CarriedLightCtx) {
	const { apps, tiles, idx, idxAdd, idxDel, dirty, glides, lightFades, lightFadeOn, mv, viewStats, markId } = ctx;
	const carryOn = new URLSearchParams(location.search).get("carrylight") !== "0";
	let carried: CarriedLight | null = null, carriedN = 0;
	const carriedTiles = new Map<number, number>(); // our id -> the tile key it was put on
	const lessened = new Map<number, { server: BuiltAppearance; ours: BuiltAppearance }>(); // real lighting objects drawn with the light taken out
	const wck = (wcx: number, wcy: number): number => wcx * 8192 + wcy; // a corner in world half tiles (odd)
	let mask = new Set<number>(), maskOld: Set<number> | null = null, maskFade = { t0: 0, ms: 1 }, appliedAt = { x: 0, y: 0 }; // appliedAt: the sources' applied turf
	let cornerLooks: BuiltAppearance[] = [], cornerKey = ""; // per matrix row (SW, SE, NW, NE): the light's look on that corner alone
	/** Our tile's draw looks at `now`: per corner the light reaches, its look at the alpha for the light there. dyn: it changes while the mob glides or the mask fades. */
	const carriedLooksAt = (id: number, now: number): { looks: BuiltAppearance[]; dyn: boolean } => {
		const key = carriedTiles.get(id), l = carried, at = l && idx.get(l.mob);
		if (key === undefined || !l || typeof at !== "number") return { looks: [], dyn: false };
		const g = glides.size ? glides.get(l.mob) : undefined, gv = (g && glideAt(g, now)) ?? [0, 0];
		const px = at % 65536 + gv[0] / TILE_PX - appliedAt.x, py = Math.floor(at / 65536) + gv[1] / TILE_PX - appliedAt.y; // the source as drawn, from the applied turf
		const k = maskOld ? Math.max(0, Math.min(1, (now - maskFade.t0) / maskFade.ms)) : 1, tx = key % 65536 - appliedAt.x, ty = Math.floor(key / 65536) - appliedAt.y;
		const looks: BuiltAppearance[] = [];
		cornersOf(tx, ty).forEach(([cx, cy], row) => {
			const w = 2 * appliedAt.x + cx, h = 2 * appliedAt.y + cy, wk = wck(w, h), m = (mask.has(wk) ? k : 0) + (maskOld?.has(wk) ? 1 - k : 0);
			const a = m > 0 ? 255 * Math.min(1, m * strengthAt(l, cx, cy, px, py)) : 0;
			if (a >= 0.5) looks.push({ ...cornerLooks[row], alpha: a });
		});
		return { looks, dyn: !!g || k < 1 };
	};
	const applyCarried = (fresh: number[] | undefined): void => {
		for (const [id, key] of carriedTiles) {
			const t = tiles.get(key);
			if (t && t.ids.includes(id)) { t.ids = t.ids.filter((i) => i !== id); idxDel(id, key); dirty.add(key); }
			apps.delete(id);
		}
		carriedTiles.clear(); carriedN = 0;
		for (const [id, e] of lessened) if (apps.get(id) === e.ours) { apps.set(id, e.server); markId(id); }
		lessened.clear();
		const was = carried;
		if (fresh) carried = carryOn ? parseLight(fresh) : null;
		if (!carried) { mask = new Set(); maskOld = null; return; }
		const l = carried, at = idx.get(l.mob);
		if (typeof at !== "number") return;
		const mx = at % 65536, my = Math.floor(at / 65536), now = performance.now();
		if (fresh) {
			const old = mask;
			appliedAt = { x: mx + l.ax, y: my + l.ay };
			mask = new Set([...l.bases.keys()].map((c) => { const cx = Math.floor(c / 8192) - 4096, cy = c % 8192 - 4096; return wck(2 * appliedAt.x + cx, 2 * appliedAt.y + cy); }));
			const going = maskOld && now < maskFade.t0 + maskFade.ms ? maskOld : null; // mid-fade: what the old mask still shows goes on fading out with it
			if (lightFadeOn && was && was.mob === l.mob && old.size) {
				maskOld = going ? new Set([...old, ...going]) : old;
				maskFade = { t0: now, ms: now - mv.lastGlide.at < 500 ? Math.max(50, Math.min(400, mv.lastGlide.ms)) : 100 };
			} else maskOld = null;
		}
		if (maskOld && now >= maskFade.t0 + maskFade.ms) maskOld = null;
		const ck = l.colour.join(",");
		const lightingOf = (key: number): number | undefined => tiles.get(key)?.ids.find((i) => { const a = apps.get(i); return i > CARRIED_ID0 && !!a && isLighting(a); });
		for (const [tx, ty] of l.tiles) { // the server's tiles under the light: the light taken out
			const rk = appliedAt.x + tx + (appliedAt.y + ty) * 65536, rid = lightingOf(rk);
			if (rid === undefined) continue;
			const server = apps.get(rid)!, m = lessLight(server.iconState, server.color, l, tx, ty);
			if (!m) continue;
			const ours = { ...server, iconState: "", color: m }; lessened.set(rid, { server, ours }); apps.set(rid, ours); markId(rid);
			for (const e of lightFades.get(rid) ?? []) if (e.a === server) e.a = ours; // a fade under way keeps it as a look to come: once the next update makes it an older look, it is drawn as it is (light doubled)
		}
		const ours = new Set<number>(); // the tiles round every corner the mask (old or new) lights
		for (const set of maskOld ? [mask, maskOld] : [mask]) for (const c of set) {
			const w = Math.floor(c / 8192), h = c % 8192;
			for (const x of [(w - 1) / 2, (w + 1) / 2]) for (const y of [(h - 1) / 2, (h + 1) / 2]) ours.add(x + y * 65536);
		}
		for (const ok of ours) {
			const oid = lightingOf(ok);
			if (oid === undefined) continue; // no lighting object there (space, an always-lit area): nothing to light
			if (cornerKey !== ck || !cornerLooks.length) {
				cornerKey = ck;
				cornerLooks = [0, 1, 2, 3].map((row) => { const m = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]; for (let k = 0; k < 3; k++) m[row * 4 + k] = l.colour[k]; return { ...apps.get(oid)!, iconState: "", color: m, alpha: 255, overlays: [] }; });
			}
			const id = CARRIED_ID0 - carriedN++, t = tiles.get(ok)!;
			apps.set(id, { ...cornerLooks[0], alpha: 0 }); // a stand-in (nothing) for the paths that take one look per id: carriedLooksAt draws it
			t.ids = [...t.ids, id];
			idxAdd(id, ok);
			dirty.add(ok);
			carriedTiles.set(id, ok);
		}
		viewStats.carriedTiles = carriedN; viewStats.lessenedTiles = lessened.size;
	};
	return {
		lessened, carriedLooksAt, applyCarried,
		get carried() { return carried; },
		get carriedN() { return carriedN; },
	};
}
