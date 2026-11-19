// live-items - predicted pick-up and put-down for liveClientView: the item goes into the hand (or onto the table) at the click, the
// server's answer a ping later confirms or undoes it. makeItemPredict(ctx) returns what liveClientView calls.

import type { Appearance, BuiltAppearance } from "../appearance/appearance.js";
import type { ViewUpdate } from "../worker/client-view.js";
import type { viewStats as ViewStats } from "./client-scene.js";
import type { makeMovePredict } from "./live-move.js";
import { ease } from "./anim.js";
import { PREDICT_HIDE_MS } from "./predict-hud.js";
import { TILE_PX } from "./station-client.js";

/** What liveClientView shares with the item predictions. screen is a getter: liveClientView reassigns it. */
export interface ItemPredictCtx {
	apps: Map<number, BuiltAppearance>;
	tiles: Map<number, { x: number; y: number; ids: number[] }>;
	idx: Map<number, number | Set<number>>;
	dirty: Set<number>;
	hidden: Map<number, number>;
	readonly screen: [number, string, unknown][];
	mv: ReturnType<typeof makeMovePredict>;
	viewStats: typeof ViewStats;
	markId: (id: number) => void;
	schedule: () => void;
}

export function makeItemPredict(ctx: ItemPredictCtx) {
	const { apps, tiles, idx, dirty, hidden, mv, viewStats, markId, schedule } = ctx;
	const { predFree, predTimeout } = mv;
	// Predicted pick-up: the server lists the items a plain left click would pick up (u.pick: id, tile minus the mob's), and the page checks the
	// rest: the item within reach of where it draws the mob (a diagonal one past a free side tile, as Adjacent), throw mode off, the active hand
	// empty. It leaves the floor and shows in the hand slot (on the HUD plane, as put_in_hand) until the server sends the item's look again, which
	// it does after running such a click (input.ts): a pick-up comes with the item on the screen list, a refused one shows it back on the floor.
	let pick: NonNullable<ViewUpdate["pick"]> | null = null;
	const picked = new Map<number, { at: number; loc: unknown; mob: number; hand: Appearance | null }>();
	const HUD_PLANE = 20, HANDS_LAYER = 3; // ABOVE_HUD_PLANE and ABOVE_HUD_LAYER; the in-hand sprites' overlay layer
	const predictPick = (id: number): void => {
		if (!mv.predOn || !mv.pred || !pick || picked.has(id)) return;
		const pk = pick.find((p) => p[0] === id);
		if (!pk) return;
		let ax = 0, ay = 0;
		for (const q of mv.pending) if (q.drawn) { ax += q.dx; ay += q.dy; }
		const rx = pk[1] - ax, ry = pk[2] - ay;
		if (Math.abs(rx) > 1 || Math.abs(ry) > 1 || (rx && ry && !predFree(ax + rx, ay) && !predFree(ax, ay + ry))) return;
		const th = ctx.screen.find((s) => s[1] === "/obj/screen/throw_catch");
		if (th && apps.get(th[0])?.iconState === "act_throw_on") return;
		const hand = ctx.screen.find((s) => s[1].startsWith("/obj/screen/inventory/hand") && apps.get(s[0])?.overlays.some((o) => o.iconState === "hand_active"));
		if (!hand || hand[2] == null || ctx.screen.some((s) => s[2] === hand[2] && s[0] !== hand[0] && !s[1].startsWith("/obj/screen") && !hidden.has(s[0])) || [...picked.values()].some((p) => p.loc === hand[2])) return;
		const now = performance.now(), a = apps.get(id), t = [...tiles.values()].find((q) => q.ids.includes(id)), mob = mv.pred[0], ma = apps.get(mob);
		// update_inv_hands: the item's in-hand sprite as an overlay of your mob, at -HANDS_LAYER (a floating layer: just above the mob, as resolveOverlay places it)
		const inHand: Appearance | null = ma && pk[3] ? { icon: pk[3], iconState: pk[4], dir: ma.dir, layer: ma.layer + (1000 - HANDS_LAYER) / 1000, plane: ma.plane, color: null, alpha: 255, transform: null,
			pixelX: 0, pixelY: 0, invisibility: 0, blendMode: 0, maptext: null, maptextWidth: 32, maptextHeight: 32, maptextX: 0, maptextY: 0 } : null;
		picked.set(id, { at: now, loc: hand[2], mob, hand: inHand });
		if (inHand && ma) { apps.set(mob, { ...ma, overlays: [...ma.overlays, inHand].sort((p, q) => p.plane - q.plane || p.layer - q.layer) }); markId(mob); }
		if (a && t) flies.push({ id, key: t.x + t.y * 65536, a, at: now, tx: -rx * TILE_PX, ty: -ry * TILE_PX });
		viewStats.predPick++;
		markId(id);
		schedule();
	};
	// tg's do_pickup_animation, drawn by the page at the click: a copy of the item flies from its tile to the mob (pixel_x/y to the mob, scaled
	// to 0.65, alpha to 175, 3 ds cubic), then fades out (2 ds). The server's own copy (an /image of the same icon and state at
	// ABOVE_ALL_MOB_LAYER on that tile) comes a ping later: it isn't drawn for this player.
	const FLY_MS = 300, FADE_MS = 200, ABOVE_ALL_MOB_LAYER = 4.5;
	let flies: { id: number; key: number; a: BuiltAppearance; at: number; tx: number; ty: number }[] = [];
	const flyLook = (f: (typeof flies)[number], now: number): BuiltAppearance | null => {
		const t = now - f.at;
		if (t >= FLY_MS + FADE_MS) return null;
		const k = ease(3, Math.min(1, t / FLY_MS)), sc = 1 - 0.35 * k, a = f.a;
		return { ...a, layer: ABOVE_ALL_MOB_LAYER, pixelX: a.pixelX + (f.tx - a.pixelX) * k, pixelY: a.pixelY + (f.ty - a.pixelY) * k, transform: [sc, 0, 0, 0, sc, 0],
			alpha: t < FLY_MS ? a.alpha + (175 - a.alpha) * k : 175 * (1 - (t - FLY_MS) / FADE_MS), overlays: a.overlays.map((o) => ({ ...o, layer: o.layer === a.layer ? ABOVE_ALL_MOB_LAYER : o.layer })) };
	};
	const flyKeep = (): number => Math.max(PREDICT_HIDE_MS, predTimeout()) + 1000; // how long the server's copy may take to come
	/** the server's copy of a fly the page drew itself: same icon and state on that tile, not the item */
	const serverFly = (key: number, id: number, a: BuiltAppearance): boolean =>
		a.layer === ABOVE_ALL_MOB_LAYER && flies.some((f) => f.key === key && f.id !== id && f.a.icon === a.icon && f.a.iconState === a.iconState);
	/** a refused pick-up: the guessed in-hand sprite comes off your mob (unless the server's look of it replaced it already) */
	const unhand = (p: { mob: number; hand: Appearance | null }): void => {
		const ma = apps.get(p.mob);
		if (p.hand && ma?.overlays.includes(p.hand)) { apps.set(p.mob, { ...ma, overlays: ma.overlays.filter((o) => o !== p.hand) }); markId(p.mob); }
	};
	const heldLook = (a: BuiltAppearance): BuiltAppearance => ({ ...a, plane: HUD_PLANE, layer: HUD_PLANE, pixelX: 0, pixelY: 0, overlays: a.overlays.map((o) => ({ ...o, plane: o.plane === a.plane ? HUD_PLANE : o.plane, layer: o.layer === a.layer ? HUD_PLANE : o.layer })) });
	// Predicted put-down: the server lists, with the held item (u.put), the tables and racks a plain left click puts it on and the keys that drop it
	// (putOf, client-view.ts). The page checks reach (as predictPick) and throw mode, takes the item out of the hand slot and its in-hand sprite
	// off your mob, and draws it on the floor at its floor layer and plane: on a table centred on the click (table attackby), sliding there from
	// where your mob is drawn (do_drop_animation, 3 ds cubic); dropped, on the tile your mob is drawn on (the server runs the key after the steps
	// sent before it). The server's copy lands a ping later on the same tile with the same look; its own slide is not played again. A refused
	// click (the answer sends the item's look again, still in the hand) or no answer within the step timeout puts it back.
	let put: NonNullable<ViewUpdate["put"]> | null = null;
	const placed = new Map<number, { at: number; key: number; a: BuiltAppearance; ox: number; oy: number; mob: number; ih: [string, string]; ours: BuiltAppearance | null; server: BuiltAppearance | null; click: boolean; landed: boolean; handGone: boolean }>();
	const SLIDE_MS = 300;
	/** the item's look on the floor: its held look at the floor layer and plane, overlays that went with it too */
	const floorLook = (a: BuiltAppearance, layer: number, plane: number, px: number, py: number): BuiltAppearance =>
		({ ...a, plane, layer, pixelX: px, pixelY: py, overlays: a.overlays.map((o) => ({ ...o, plane: o.plane === a.plane ? plane : o.plane, layer: o.layer === a.layer ? layer : o.layer })) });
	const slideLook = (a: BuiltAppearance, p: { at: number; ox: number; oy: number }, now: number): { a: BuiltAppearance; dyn: boolean } => {
		if (!p.ox && !p.oy) return { a, dyn: false };
		const t = now - p.at;
		if (t >= SLIDE_MS) return { a, dyn: false };
		const k = 1 - ease(3, t / SLIDE_MS);
		return { a: { ...a, pixelX: a.pixelX + p.ox * k, pixelY: a.pixelY + p.oy * k }, dyn: true };
	};
	/** your mob's look without the put-down item's in-hand sprite (update_inv_hands); the server's look is kept to put back */
	const strip = (p: { mob: number; ih: [string, string]; ours: BuiltAppearance | null; server: BuiltAppearance | null; handGone: boolean }): void => {
		const ma = apps.get(p.mob);
		if (!ma || ma === p.ours) return;
		const o = ma.overlays.filter((x) => !(x.icon === p.ih[0] && x.iconState === p.ih[1]));
		if (o.length === ma.overlays.length) { p.handGone = true; return; } // the server's look has it off already
		p.server = ma; p.ours = { ...ma, overlays: o };
		apps.set(p.mob, p.ours); markId(p.mob);
	};
	const unstrip = (p: { mob: number; ours: BuiltAppearance | null; server: BuiltAppearance | null }): void => {
		if (p.ours && p.server && apps.get(p.mob) === p.ours) { apps.set(p.mob, p.server); markId(p.mob); }
	};
	const unput = (id: number, p: (typeof placed) extends Map<number, infer V> ? V : never): void => { placed.delete(id); if (!p.landed) unstrip(p); dirty.add(p.key); markId(id); };
	const predictPut = (id: number | null, params: string, key?: string): void => {
		if (!mv.predOn || !mv.pred || !put || picked.size || [...placed.values()].some((q) => !q.landed)) return;
		const it = put.id, a = apps.get(it), mob = mv.pred[0], mk = idx.get(mob);
		const old = placed.get(it);
		if (old) placed.delete(it); // the same item put down again (landed: its in-hand sprite stays off): the last one's slide is over
		if (!a || typeof mk !== "number" || hidden.has(it) || !ctx.screen.some((s) => s[0] === it)) return;
		let ax = 0, ay = 0;
		for (const q of mv.pending) if (q.drawn) { ax += q.dx; ay += q.dy; }
		let tk: number, ox = 0, oy = 0, fl: BuiltAppearance;
		if (key !== undefined) {
			if (!put.keys.includes(key)) return;
			tk = mk + ax + ay * 65536;
			fl = floorLook(a, put.layer, put.plane, a.pixelX, a.pixelY);
		} else {
			const on = put.on.find((o) => o[0] === id), t = id === null ? undefined : idx.get(id);
			if (!on || typeof t !== "number") return;
			const rx = on[1] - ax, ry = on[2] - ay;
			if (Math.abs(rx) > 1 || Math.abs(ry) > 1 || (rx && ry && !predFree(ax + rx, ay) && !predFree(ax, ay + ry))) return;
			const th = ctx.screen.find((s) => s[1] === "/obj/screen/throw_catch");
			if (th && apps.get(th[0])?.iconState === "act_throw_on") return;
			const ix = /(?:^|;)icon-x=(\d+)/.exec(params), iy = /(?:^|;)icon-y=(\d+)/.exec(params), c = (v: number) => Math.max(-TILE_PX / 2, Math.min(TILE_PX / 2, v - 16));
			if (on[3] && (!ix || !iy)) return; // no click position: tg leaves pixel_x/y as they were
			tk = t; ox = -rx * TILE_PX; oy = -ry * TILE_PX;
			fl = floorLook(a, put.layer, put.plane, on[3] ? c(+ix![1]) : a.pixelX, on[3] ? c(+iy![1]) : a.pixelY);
		}
		const p: (typeof placed) extends Map<number, infer V> ? V : never = { at: performance.now(), key: tk, a: fl, ox, oy, mob, ih: put.ih, ours: null, server: null, click: key === undefined, landed: false, handGone: false };
		placed.set(it, p);
		strip(p);
		dirty.add(tk); markId(it);
		viewStats.predPut++;
		schedule();
	};
	/** each frame while prediction is on: a guess the server never answered is undone, an old fly is let go */
	const expire = (now: number): void => {
		if (picked.size) for (const [id, p] of picked) if (now - p.at > Math.max(PREDICT_HIDE_MS, predTimeout())) { picked.delete(id); unhand(p); viewStats.predPickBack++; markId(id); schedule(); }
		if (flies.length && flies.some((f) => now - f.at > flyKeep())) flies = flies.filter((f) => now - f.at <= flyKeep());
		if (placed.size) for (const [id, p] of placed) {
			if (!p.landed && now - p.at > Math.max(PREDICT_HIDE_MS, predTimeout())) { unput(id, p); viewStats.predPutBack++; schedule(); }
			else if (p.landed && now - p.at > flyKeep()) { placed.delete(id); markId(id); schedule(); } // the server's slide and in-hand sprite had their time to come
		}
	};
	/** the server's lists: what a click would pick up, and where the held item would go */
	const lists = (u: ViewUpdate): void => {
		pick = u.pick ?? null;
		put = u.put ?? null;
	};
	/** an update came: the server answered a pick-up or put-down, or the item is gone */
	const answer = (u: ViewUpdate): void => {
		const screen = ctx.screen;
		if (picked.size) for (const [id] of picked) { // the server answered the pick-up click (the item's look came again) or the item is gone
			const back = u.apps.some((a) => a[0] === id);
			if (!back && !u.gone.includes(id) && !u.full) continue;
			const p = picked.get(id)!;
			picked.delete(id); markId(id);
			if (back && (u.screen ?? screen).some((s) => s[0] === id)) viewStats.predPickOk++; else { viewStats.predPickBack++; unhand(p); } // picked up: the guessed in-hand sprite stays till the mob's own look comes
		}
		if (placed.size) for (const [id, p] of placed) { // predicted put-down: the server's copy is on a tile (landed), the item is gone, or the click's answer still has it in the hand
			if (u.full || u.gone.includes(id)) { unput(id, p); continue; }
			const onScreen = (u.screen ?? screen).some((s) => s[0] === id);
			if (p.landed && onScreen) { placed.delete(id); markId(id); continue; } // picked up again
			if (!p.landed && !onScreen && idx.has(id)) { p.landed = true; viewStats.predPutOk++; dirty.add(p.key); markId(id); }
			else if (!p.landed && p.click && onScreen && u.apps.some((x) => x[0] === id)) { unput(id, p); viewStats.predPutBack++; continue; }
			if (!p.handGone && u.apps.some((x) => x[0] === p.mob)) { p.ours = null; strip(p); } // a new look of your mob before the server took the item out of the hand
		}
	};
	return {
		picked, placed, predictPick, predictPut, flyLook, serverFly, slideLook, heldLook, expire, lists, answer,
		get flies() { return flies; },
		get pick() { return pick; },
	};
}
