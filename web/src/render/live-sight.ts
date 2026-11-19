// live-sight - sight shadows and sight pop-in for liveClientView: what the page hides or shades from where it draws you.
// makeSight(ctx) returns what liveClientView calls.

import type { ViewUpdate } from "../worker/client-view.js";
import type { viewStats as ViewStats } from "./client-scene.js";
import type { makeMovePredict } from "./live-move.js";
import { shadowPainter, type ShadowPaint } from "./sight-shadow-paint.js";
import { shadowStrength, type Lum, type Opq, type ShadowMode } from "./sight-shadow.js";
import { pageSees, pageSight, withSight, type PageSight } from "./sight-pop-in.js";

/** What liveClientView shares with the sight code. viewHalf is passed in: client-scene.ts can't be imported for values (it touches the page). */
export interface SightCtx {
	tiles: Map<number, { x: number; y: number; ids: number[] }>;
	dirty: Set<number>;
	mv: ReturnType<typeof makeMovePredict>;
	viewStats: typeof ViewStats;
	viewHalf: (v: unknown) => [number, number];
	/** the player picked another shadow look: every plane and chunk is drawn again */
	redraw: () => void;
}

export function makeSight(ctx: SightCtx) {
	const { tiles, dirty, mv, viewStats, viewHalf } = ctx;
	// Sight shadows: soft shadows cast past walls from where the camera is drawn, over the box of opacity the server
	// sends (u.opq, only when it changes); dimmed with mesons/thermals, none for ghosts and the AI (shadowStrength). The look (ShadowMode) is
	// the player's pick in the ⚙ panel (localStorage "ss13-shadows", event "ss13-shadows" when it changes), tg's black squares by default;
	// ?shadows=0 / smooth / full overrides it.
	const shadowP = shadowPainter();
	const shadowQ = new URLSearchParams(location.search).get("shadows");
	const modeOf = (v: string | null): ShadowMode => (v === "smooth" || v === "full" ? v : "tg");
	const pickedMode = (): ShadowMode => { try { return modeOf(localStorage.getItem("ss13-shadows")); } catch { return "tg"; } };
	let shadowMode: ShadowMode = shadowQ !== null ? modeOf(shadowQ) : pickedMode();
	if (shadowQ === null) globalThis.addEventListener?.("ss13-shadows", () => { shadowMode = pickedMode(); ctx.redraw(); });
	let opqNow: Opq | null = null, shadowVersion = 0;
	// Sight pop-in: with prediction the server sends what could be seen a step or two ahead (u.lum then comes with the
	// box's light); the page shows only what is seen from the tile it has stepped you to (sightNow, worked out again when that tile or the box
	// changes). Tiles it doesn't see are left out of the scene: black and unclickable, as tiles the server doesn't send.
	let lumNow: Lum | null = null, sightNow: PageSight | null = null, sightOpq: Opq | null = null, sightFrom: unknown[] = [];
	const sightHides = (sg: PageSight | null, x: number, y: number): boolean => sg !== null && !pageSees(sg, x, y);
	const updateSight = (u: ViewUpdate): void => {
		let ax = 0, ay = 0;
		if (mv.pred) for (const q of mv.pending) if (q.drawn) { ax += q.dx; ay += q.dy; }
		const [hx, hy] = viewHalf(u.view), sid = Number((u.sight as { see_in_dark?: unknown } | null)?.see_in_dark ?? 0) || 0;
		const from = [opqNow, lumNow, ax, ay, hx, hy, sid];
		if (from.every((v, i) => v === sightFrom[i])) return;
		sightFrom = from;
		const next = opqNow && lumNow ? pageSight(opqNow, lumNow, ax, ay, hx, hy, sid) : null;
		for (const [k, t] of tiles) if (sightHides(sightNow, t.x, t.y) !== sightHides(next, t.x, t.y)) dirty.add(k);
		sightNow = next;
		sightOpq = next && opqNow ? withSight(opqNow, next) : null;
		viewStats.sightRuns++;
	};
	/** the box of opacity (u.opq) and its light (u.lum), when they come: whether either changed */
	const takeBoxes = (u: ViewUpdate): boolean => {
		let changed = false;
		if (u.opq !== undefined || u.full) { const o = u.opq && u.opq.length ? u.opq as Opq : null; changed ||= o !== opqNow; opqNow = o; }
		if (u.lum !== undefined || u.full) { const l = u.lum && u.lum.length ? u.lum as Lum : null; changed ||= l !== lumNow; lumNow = l; }
		return changed;
	};
	/** the sight shadow for this frame, cast from (cx, cy) in tiles: none in tg's look or for those who see past walls */
	const shadowAt = (sight: { sight: number } | null | undefined, cx: number, cy: number): { shadow: ShadowPaint | undefined; shadowA: number } => {
		const shadowA = shadowMode !== "tg" ? shadowStrength(Number(sight?.sight ?? 0), opqNow !== null) : 0;
		let shadow: ShadowPaint | undefined;
		if (shadowA > 0) {
			shadow = shadowP.paint(shadowMode === "smooth" && sightOpq ? sightOpq : opqNow!, cx, cy, shadowMode); // smoothed tg: the page's own sight
			if (shadow.version !== shadowVersion) { shadowVersion = shadow.version; viewStats.shadowPaints++; viewStats.shadowMs += shadow.ms; }
		}
		return { shadow, shadowA };
	};
	return { updateSight, takeBoxes, shadowAt, hides: (x: number, y: number): boolean => sightHides(sightNow, x, y) };
}
