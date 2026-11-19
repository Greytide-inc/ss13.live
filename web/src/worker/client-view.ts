// client-view - What each connected player sees, sent to the page as changes once per tick (ViewDiffer,
// the ViewUpdate format) plus the icon sheets a z level uses (zIcons). What a client can see is worked
// out in view-sight.ts, what the page may predict in view-predict.ts; the full test dump (client.json)
// is client-view-dump.ts.

import type { VM } from "../vm/interpreter.js";
import { DMList, DMObject, live } from "../vm/objects.js";
import { stringify } from "../vm/value.js";
import { DMAtom, Kind, LOOK_VARS_SIG, registerViewMarks, unregisterViewMarks } from "../vm/world.js";
import { buildAppearance, type BuiltAppearance } from "../appearance/appearance.js";
import { CLIENT_ANIM_ID } from "../render/anim.js";
import { packLum, packOpacity, type Lum, type Opq } from "../render/sight-shadow.js";
import { inLobby, baseViewOf, type ClientSeen, type UnionCache, clientSeen, seenOn, type ClientSight, popInSight } from "./view-sight.js";
import { MOVER_ID, pullOf, carriedLightOf, predMover, predRunOf, predOf, swapOf, predTurnOf, pickOf, putOf, TILE_GLIDE, truthyVar, procFrom } from "./view-predict.js";

// --- Per-tick view updates -------------------------------------------------------------------
// The live page gets the first client's view as changes since the last update, once per tick, instead
// of buildClientView's full snapshot. Objects (turfs, areas, objs/mobs in view, screen objects) get a
// number id; an appearance is sent when the object first shows up or its look vars change, a tile's id
// list when what's on it changes (so a move is two small tile entries), and the screen list when it or a
// screen_loc changes. A `full` update resends everything (the first view, and after a page "resync").

/** One update, worker -> page. Tiles are [x, y, ids] (turf, area, then contents, as buildTile), tile
 *  coordinates are world coordinates; the page drops tiles outside eyeTile +- view itself. */
export interface ViewUpdate {
	seq: number;
	full: boolean;
	worldTime: number;
	key: unknown;
	view: unknown;
	/** client.default_view (what `view` is when not zoomed); the HUD is laid out against it. */
	baseView?: unknown;
	/** 1 while the mob is the lobby one (inLobby); left out otherwise */
	lobby?: 1;
	eyeTile: { x: number; y: number; z: number } | null;
	sight: Record<string, unknown> | null;
	/** New or changed appearances by id. */
	apps: [number, BuiltAppearance][];
	/** Ids no longer in view or on screen: forget their appearances. */
	gone: number[];
	tiles: [number, number, number[]][];
	/** Movable atoms that changed tile this update: [id, fromX, fromY, toX, toY, glide_size, animate_movement]. The page glides them. */
	moved: [number, number, number, number, number, number, number][];
	/** client.pixel_x/pixel_y (the view offset), sent when it changes (and on a full update if not 0,0). animate(client, ...) steps come in `anims` with id CLIENT_ANIM_ID. */
	off?: [number, number];
	/** animate() steps and flick()s since the last update, for objects in view or on screen. ["a", id, fresh (1 = starts a new animation, 0 = chains), time ds, loop, easing, flags, [name, before, after][]] or ["f", id, icon_state]. Absent when none. */
	anims?: (["a", number, number, number, number, number, number, [string, unknown, unknown][]] | ["f", number, string])[];
	/** lag-smoothing: set by tools/server.mjs when it folded this many ticks' updates into one (view-merge.mjs). */
	merged?: number;
	/** netcode 1: a view sent between ticks, straight after this player's click ran (boot-worker clickAtOnce); the page shows it without the jitter buffer's hold. */
	now?: 1;
	/** The whole client.screen, [id, type, screen_loc], when it (or a screen_loc) changed; else null. */
	screen: [number, string, unknown][] | null;
	/** lag-smoothing step 4: [own mob's id, free, ...image ids] for the page's movement prediction, or null (don't predict). free has a bit for
	 *  each tile of the 7x7 square around the mob that it could surely walk onto, bit (dy + 3) * 7 + (dx + 3) (see predOf; 49 bits, so not JS's 32-bit << maths). The image ids are the client.images whose loc is the mob (a speech bubble):
	 *  the page moves them with it. */
	pred?: number[] | null;
	/** netcode 5: what the mob is pulling, sent with pred: [its id, its tile's offset from the mob's (east+, north+; 0..1 either way), 1 if it blocks a step onto its tile]. Absent: nothing the page may move along. */
	pull?: [number, number, number, number];
	/** Mob swap, with pred (swapOf): per mob a straight step into would swap places with, [its id, its tile minus the mob's (east+, north+)], flat. Absent: none. */
	swap?: number[];
	/** With pred, for the AI eye: [sprint, acceleration] (predRunOf), so the page knows how many tiles each step moves it. */
	predRun?: [number, number];
	/** With pred: a key in a direction the mover doesn't face only turns it (a mech, not strafing: predTurnOf). */
	predTurn?: 1;
	/** Predicted pick-up, with pred: per item a plain left click would pick up (pickOf): [item id, its tile minus the mob's (east+, north+),
	 *  the in-hand icon and state your mob would show it with in the active hand]. Absent: none. */
	pick?: [number, number, number, string, string][];
	/** Predicted put-down, with pred (putOf): the held item's id, its layer and plane on the floor, the in-hand icon and state your mob shows it
	 *  with, the keys that drop it (none: the drop key isn't guessed) and the tables/racks a click puts it on: [id, tile minus the mob's, 1 = centred on the click]. Absent: none. */
	put?: { id: number; layer: number; plane: number; ih: [string, string]; keys: string[]; on: [number, number, number, number][] };
	/** how many of the page's step messages the server has finished (Clients.stepsDone); only once it sent one. */
	steps?: number;
	/** netcode 2: what the page needs to guess your HUD toggles (see predictClick in predict-hud.ts): the mob's possible_a_intents in order, and
	 *  iq 1 when the human intent icon picks by quarter (preference bit 32). Sent on a full update and when it changes. */
	hud?: { ia: string[]; iq: number };
	/** On a full update: the icon sheets the atoms on the eye's z level use, most used first (zIcons). The page downloads them in the
	 *  background, so a sheet is usually there before something that needs it comes into view. */
	icons?: string[];
	/** carried light (carriedLightOf): when it changed; [] = none now. Absent: as before. */
	light?: number[];
	/** sight-shadows: which tiles block sight in the box clientSight works out (the view plus its ring), packed (render/sight-shadow.ts
	 *  packOpacity), when it changed; [] = none now (a ghost, blind). Absent: as before. */
	opq?: Opq | [];
	/** the light of the opq box, for the page's own line of sight from the tile it has stepped to: sent only to a predicting page
	 *  with no x-ray sight, when it changes; [] = none now (the page then shows what the server sends, as before) */
	lum?: Lum | [];
}

/** The icon sheets of everything on z (turfs, areas, what lies on the turfs; their overlays too), most used first. One appearance is built
 *  per type + icon var, so a whole station costs a few thousand builds. Cached per z: a preload hint only, so a list a while old does. */
/** how long the last zIcons list took to make (the first view's log line). */
export let zIconsMs = 0;
const zIconsCache = new WeakMap<VM, Map<number, string[]>>();
export function zIcons(vm: VM, z: number): string[] {
	let byZ = zIconsCache.get(vm);
	if (!byZ) zIconsCache.set(vm, (byZ = new Map()));
	const hit = byZ.get(z);
	if (hit) return hit;
	const t0 = performance.now(), of = new Map<string, string[]>(), uses = new Map<string, number>();
	const add = (o: DMObject): void => {
		const k = `${o.type.path}|${stringify(live(o.getVar("icon")))}`;
		let paths = of.get(k);
		if (!paths) {
			const a = buildAppearance(o), s = new Set<string>();
			if (a.icon && !a.icon.startsWith("blob:")) s.add(a.icon);
			for (const l of a.overlays) if (l.icon && !l.icon.startsWith("blob:")) s.add(l.icon);
			of.set(k, (paths = [...s]));
		}
		for (const p of paths) uses.set(p, (uses.get(p) ?? 0) + 1);
	};
	const areas = new Set<DMObject>();
	for (let y = 1; y <= vm.map.maxy; y++) for (let x = 1; x <= vm.map.maxx; x++) {
		const turf = vm.map.turfAt(x, y, z);
		if (!turf) continue;
		add(turf);
		const area = live(vm.getField(turf, "loc"));
		if (area instanceof DMObject && !areas.has(area)) { areas.add(area); add(area); }
		for (const o of turf.contents) add(o);
	}
	const list = [...uses].sort((a, b) => b[1] - a[1]).map(([p]) => p);
	zIconsMs = Math.round(performance.now() - t0);
	byZ.set(z, list);
	return list;
}

// The look vars buildAppearance reads (appearance.ts rawVarsOf). An object whose values are all the same
// (===) as last tick, with the same overlay/underlay entries, has the same appearance. Overlay entries are
// frozen snapshots (vm/appearances.ts), so comparing them by identity is enough.
// ponytail: a /matrix or /icon datum edited in place after being assigned isn't seen until another look var
// changes (BYOND copies transform on assignment; tg assigns fresh matrices). A page resync picks it up.
/** whether `now` (null = none) holds the same values as held[i], the copy the last call kept; held[i] becomes a copy of now (its buffer reused when the size is the same) */
function keepSame(held: (Uint8Array | Int32Array | null)[], i: number, now: Uint8Array | Int32Array | null): boolean {
	const was = held[i];
	if (!now) { held[i] = null; return !was; }
	if (was && was.length === now.length && was.constructor === now.constructor) {
		let same = true;
		for (let k = 0; k < now.length; k++) if (was[k] !== now[k]) { same = false; was[k] = now[k]; }
		return same;
	}
	held[i] = now.slice();
	return false;
}
const sameList = (a: unknown[], b: unknown[]): boolean => {
	if (a.length !== b.length) return false;
	for (let k = 0; k < a.length; k++) if (a[k] !== b[k]) return false;
	return true;
};
const LOOK = LOOK_VARS_SIG;

interface Sent { id: number; gen: number; sig: unknown[]; n: number } // n: shown tiles the object is on (the dirty differ's "gone" test)

/** refreshSig sets this to the name of the first var that differed (the sweep's `unmarked change` log). */
let firstChanged = "";

/** Fills sig with o's look values (see LOOK); true if anything differs from what was there. getVar gives
 *  null for a var the type doesn't have, so no hasVar checks. */
function refreshSig(o: DMObject, sig: unknown[]): boolean {
	let changed = false, i = 0;
	for (; i < LOOK.length; i++) {
		const v = o.getVar(LOOK[i]);
		if (sig[i] !== v) { sig[i] = v; if (!changed) firstChanged = LOOK[i]; changed = true; }
	}
	for (const k of LISTS) {
		const l = o.getVar(k);
		const items = l instanceof DMList ? l.items : null;
		const n = items ? items.length : -1;
		if (sig[i] !== n) { sig[i] = n; if (!changed) firstChanged = k; changed = true; }
		i++;
		if (items) for (const x of items) { if (sig[i] !== x) { sig[i] = x; if (!changed) firstChanged = k; changed = true; } i++; }
	}
	if (sig.length !== i) { sig.length = i; if (!changed) firstChanged = "overlays"; changed = true; }
	return changed;
}
const SWEEP_EVERY = 64; // the safety sweep re-checks 1/64 of the box per update
const LISTS = ["underlays", "overlays"];

/** What the parts of one ViewDiffer update share: update makes it, each part reads it and adds to what is sent. */
interface UpdateRun {
	vm: VM; c: DMObject; cv: ClientSeen; full: boolean;
	/** visit every tile; else only the marked ones */
	scan: boolean;
	gen: number;
	apps: [number, BuiltAppearance][];
	/** the view id of o; sends its appearance when it is new or its look changed */
	idOf: (o: DMObject) => number;
	/** true while the safety sweep checks a tile nobody marked */
	sweeping: boolean;
	tiles: [number, number, number[]][]; moved: ViewUpdate["moved"]; gone: number[];
	/** objects that lost a tile: gone if they are on none now */
	cands: DMObject[];
}

export class ViewDiffer {
	private seq = 0;
	private gen = 0;
	private nextId = 1;
	private sent = new Map<DMObject, Sent>();
	private tiles = new Map<number, DMObject[]>(); // key x + y * 65536 (one z at a time; a z change resends all)
	private tileZ = 0;
	private pEye: { x: number; y: number; z: number } | null = null; // the eye's tile at the last update (MOVER_ID's step)
	private pos = new Map<DMObject, number>(); // movable atom -> its tile key when last seen in a changed tile
	private screen: unknown[] = [];
	/** the client.images entries drawn on tiles this update (not clickable, not glided). */
	private imgs = new Set<DMObject>();
	private off: [number, number] = [0, 0]; // client.pixel_x/y as last sent
	/** called once per new kind of animate()/flick() sent (the boot log names what animated). */
	logAnim: ((s: string) => void) | null = null;
	private animSeen = new Set<string>();

	/** view-dirty: false (`?dirty=0`) keeps the full scan every update. */
	dirty: boolean;
	/** Called once per `[view] unmarked change: ...` the safety sweep finds. */
	logView: ((s: string) => void) | null = (s) => console.log(s);
	private warned = new Set<string>();
	private warn(what: string): void { if (!this.warned.has(what)) { this.warned.add(what); this.logView?.(`[view] unmarked change: ${what}`); } }
	/** This differ's own marked turfs (the engine adds to every registered set; only this differ clears this one). */
	private readonly myMarks = new Set<DMAtom>();
	private registered = false;
	/** Stops collecting marks (the differ is done, or its client left). A later update registers again. */
	dispose(): void { unregisterViewMarks(this.myMarks); this.myMarks.clear(); this.registered = false; }
	private areas = new Set<DMObject>();
	private screenObjs = new Set<DMObject>();
	private sweepAt = 0;
	// What last update saw, to tell what changed.
	private pBox: [number, number, number, number] | null = null;
	private pVis: ClientSight | null = null;
	private pImgsAt = new Map<number, DMObject[]>();
	private pMob: unknown = null;
	private pSeeInv = 0;
	private pFlags = -1;
	private pSelf: DMObject | null = null;
	private pHud = "";
	private pLight = "";
	/** copies of what opq and lum were last made from (keepSame): the box's x0/y0/w, opaque, vis; lamp, areaLit */
	private held: (Uint8Array | Int32Array | null)[] = [null, null, null, null, null];
	private geo = new Int32Array(3);
	private union: UnionCache = { key: "", vis: new Uint8Array(0) };
	/** netcode 2: screen objects the next update sends again even if unchanged (a click on a toggle the page guessed at: the answer corrects a refused one). */
	private resendIf: ((o: DMObject) => boolean) | null = null;
	/** Predicted pick-up: map objects whose appearance the next update sends again (a pick-up click ran: the answer to the page's guess). */
	private resendObjs: DMObject[] = [];
	/** The items last sent in pick. */
	private picks = new Set<DMObject>();
	/** The item and the tables/racks last sent in put. */
	private putItem: DMObject | null = null;
	private putOn = new Set<DMObject>();
	constructor(opts: { dirty?: boolean } = {}) { this.dirty = opts.dirty !== false; }

	/** The object a view id (as sent in tiles/screen) stands for, for a click. Linear, clicks are rare. */
	objectOf(id: number): DMObject | null {
		for (const [o, s] of this.sent) if (s.id === id) return o;
		return null;
	}

	/** netcode 2: the next update sends the appearance of every screen object `which` accepts again. */
	resendScreen(which: (o: DMObject) => boolean): void { if (this.screenObjs.size) this.resendIf = which; }
	isScreen(o: DMObject): boolean { return this.screenObjs.has(o); }
	/** Predicted pick-up: whether `o` was in the last pick list; resendObj: the next update sends its appearance again. */
	isPick(o: DMObject): boolean { return this.picks.has(o); }
	/** Predicted put-down: the held item, if a click on `o` was in the last put list (the page may have put it there). */
	putFor(o: DMObject): DMObject | null { return this.putOn.has(o) ? this.putItem : null; }
	resendObj(o: DMObject): void { this.resendObjs.push(o); }

	/** what the client sees on a tile right now (turf, area, contents: as last sent to the page), for the right-click menu. */
	tileObjects(x: number, y: number): DMObject[] {
		return (this.tiles.get(x + y * 65536) ?? []).filter((o) => !this.imgs.has(o)); // an /image can't be clicked
	}

	/** The update for this tick, or the full view if `full` (or on the first call). */
	update(vm: VM, full = false, client?: DMObject): ViewUpdate {
		const c = client ?? vm.clients.list[0]; // one differ per player; no client = the first
		let scan = full || this.seq === 0 || !this.dirty; // scan: visit every tile (today's way); else only the changed ones
		if (this.dirty && !this.registered) { registerViewMarks(this.myMarks); this.registered = true; scan = true; } // marks on while a view is sent
		if (full || this.seq === 0) { this.sent.clear(); this.tiles.clear(); this.pos.clear(); this.screen = []; this.areas.clear(); this.screenObjs.clear(); full = true; }
		const gen = ++this.gen;
		const idOf = (o: DMObject): number => {
			let s = this.sent.get(o);
			let fresh = false;
			if (!s) { this.sent.set(o, (s = { id: this.nextId++, gen, sig: [], n: 0 })); fresh = true; if (o instanceof DMAtom && o.kind === Kind.Area) this.areas.add(o); }
			else if (s.gen === gen) return s.id; // an area on many tiles: checked once per update
			s.gen = gen;
			if (refreshSig(o, s.sig)) {
				if (u.sweeping && !fresh) this.warn(`${o.type.path} ${firstChanged}`);
				const ap = buildAppearance(o);
				if (this.imgs.has(o)) ap.mouseOpacity = 0;
				u.apps.push([s.id, ap]);
				if (this.logAnim && ap.overlays.some((l) => l.iconState === "opening" || l.iconState === "closing")) { // pt-d: airlocks animate through overlays, not flick()
					const key = `${o.type.path} overlay ${ap.overlays.map((l) => l.iconState).join("+")}`;
					if (!this.animSeen.has(key)) { this.animSeen.add(key); this.logAnim(`${key} (world.time ${vm.sched.time})`); }
				}
			}
			return s.id;
		};
		const cv = clientSeen(vm, c, this.union);
		const { view, sight, eyeTile } = cv;
		this.imgs = cv.imgs;
		const csFlags = cv.cs ? cv.cs.flags : -1, csSelf = cv.cs ? cv.cs.self : null;
		if (!scan && (!eyeTile || eyeTile.z !== this.tileZ || cv.mob !== this.pMob || cv.seeInv !== this.pSeeInv || csFlags !== this.pFlags || csSelf !== this.pSelf)) scan = true; // everything may differ
		const u: UpdateRun = { vm, c, cv, full, scan, gen, apps: [], idOf, sweeping: false, tiles: [], moved: [], gone: [], cands: [] }; // idOf uses u from the first call on
		const { apps, gone, tiles, moved, cands } = u;
		const newZ = this.mapTiles(u);
		this.pFlags = csFlags; this.pSelf = csSelf;
		const { entries, screenObjs, screenChanged } = this.screenPart(u);
		const { anims, off, offChanged } = this.animsAndOffset(u);

		if (scan) for (const [o, s] of this.sent) { if (s.gen !== gen) { gone.push(s.id); this.sent.delete(o); this.pos.delete(o); this.areas.delete(o); } }
		else for (const o of cands) { const s = this.sent.get(o); if (s && s.n <= 0 && s.gen !== gen) { gone.push(s.id); this.sent.delete(o); this.pos.delete(o); this.areas.delete(o); } }
		this.screenObjs = screenObjs;
		if (scan && this.dirty) { // counts and the area list from scratch
			for (const s of this.sent.values()) s.n = 0;
			for (const l of this.tiles.values()) for (const o of l) this.sent.get(o)!.n++;
			this.areas.clear();
			for (const o of this.sent.keys()) if (o instanceof DMAtom && o.kind === Kind.Area) this.areas.add(o);
			this.myMarks.clear();
			this.sweepAt = 0;
		}
		const { mover, free, run, mobId, predImgs, stepsDone, pl, plId, swap, pick, put, hud, hudChanged, light, lightChanged } = this.predictPart(u);
		const { opqChanged, opq, lumChanged, lum } = this.sightPacking(u);
		return {
			seq: ++this.seq, full, worldTime: vm.sched.time, key: c.getVar("key"), view, baseView: baseViewOf(vm, c), eyeTile, sight,
			apps, gone, tiles, moved, screen: full || screenChanged ? entries : null,
			...(inLobby(c) ? { lobby: 1 as const } : {}),
			pred: mobId !== undefined ? [mobId, free, ...predImgs] : null,
			...(run ? { predRun: run } : {}),
			...(free && predTurnOf(mover) ? { predTurn: 1 as const } : {}),
			...(pick.length ? { pick } : {}),
			...(put ? { put } : {}),
			...(swap.length ? { swap } : {}),
			...(pl && plId !== undefined ? { pull: [plId, pl.ox, pl.oy, pl.dense] as [number, number, number, number] } : {}),
			...(anims ? { anims } : {}),
			...(stepsDone ? { steps: stepsDone } : {}),
			...(offChanged ? { off } : {}),
			...(hudChanged ? { hud } : {}),
			...(lightChanged ? { light } : {}),
			...(opqChanged ? { opq } : {}),
			...(lumChanged ? { lum } : {}),
			...((full || newZ) && eyeTile ? { icons: zIcons(vm, eyeTile.z) } : {}),
		};
	}

	/** update's map tiles around the eye: what changed on them, what moved, what left (scan: every tile, else only marked ones); true on a new z. */
	private mapTiles(u: UpdateRun): boolean {
		const { vm, cv, scan, idOf, tiles, moved, cands } = u, { eyeTile } = cv;
		// Map tiles around the eye.
		const newZ = !!eyeTile && eyeTile.z !== this.tileZ;
		if (newZ) { this.tiles.clear(); this.tileZ = eyeTile!.z; }
		const keep = new Set<number>();
		const objs: DMObject[] = [];
		const doTile = (tx: number, ty: number): void => {
			const n = seenOn(vm, cv, tx, ty, objs);
			const k = tx + ty * 65536;
			const before = this.tiles.get(k);
			if (!n) {
				if (!scan && before) { this.tiles.delete(k); for (const o of before) { this.sent.get(o)!.n--; cands.push(o); } }
				return;
			}
			const { nFixed, nReal } = n;
			keep.add(k);
			const ids = objs.map(idOf);
			if (!before || before.length !== objs.length || before.some((o, i) => o !== objs[i])) {
				if (u.sweeping) this.warn(`${vm.map.turfAt(tx, ty, cv.eyeTile!.z)?.type.path} contents`);
				this.tiles.set(k, objs.slice());
				tiles.push([tx, ty, ids]);
				if (!scan) {
					for (const o of objs) this.sent.get(o)!.n++;
					if (before) for (const o of before) { this.sent.get(o)!.n--; cands.push(o); }
				}
				for (let i = nFixed; i < objs.length; i++) { // past the turf and area: movable atoms that arrived from another tile (and client.images, which glide with their loc atom)
					const o = objs[i], from = this.pos.get(o);
					if (from === k) continue;
					this.pos.set(o, k);
					if (from === undefined) continue;
					const la = i >= nReal && this.imgs.has(o) ? live(o.getVar("loc")) : o; // an image glides as its loc atom does
					const src = la instanceof DMObject ? la : o;
					const gs = src.getVar("glide_size"), am = src.getVar("animate_movement");
					moved.push([ids[i], from % 65536, Math.floor(from / 65536), tx, ty, typeof gs === "number" ? gs : 0, typeof am === "number" ? am : 1]);
				}
			}
		};
		let box: [number, number, number, number] | null = null; // x0, x1, y0, y1 of the shown tiles
		if (eyeTile) {
			const { x, y } = eyeTile;
			const rx = cv.vx + cv.ring, ry = cv.vy + cv.ring; // a ring beyond the view, so the page has the leading edge and the corners before a camera glide (or a predicted step) slides them in
			box = [Math.max(1, x - rx), Math.min(vm.map.maxx, x + rx), Math.max(1, y - ry), Math.min(vm.map.maxy, y + ry)];
		}
		if (scan) {
			if (box) for (let ty = box[2]; ty <= box[3]; ty++) for (let tx = box[0]; tx <= box[1]; tx++) doTile(tx, ty);
			for (const k of this.tiles.keys()) if (!keep.has(k)) this.tiles.delete(k);
		} else if (box) {
			const pb = this.pBox, dirty = new Set<number>();
			const inB = (b: number[], tx: number, ty: number) => tx >= b[0] && tx <= b[1] && ty >= b[2] && ty <= b[3];
			if (!pb || pb[0] !== box[0] || pb[1] !== box[1] || pb[2] !== box[2] || pb[3] !== box[3]) {
				if (pb) for (let ty = pb[2]; ty <= pb[3]; ty++) for (let tx = pb[0]; tx <= pb[1]; tx++) if (!inB(box, tx, ty)) { // left the box: dropped
					const k = tx + ty * 65536, before = this.tiles.get(k);
					if (before) { this.tiles.delete(k); for (const o of before) { this.sent.get(o)!.n--; cands.push(o); } }
				}
				for (let ty = box[2]; ty <= box[3]; ty++) for (let tx = box[0]; tx <= box[1]; tx++) if (!pb || !inB(pb, tx, ty)) dirty.add(tx + ty * 65536);
			}
			const marks = this.myMarks;
			for (const t of marks) if (t.z === eyeTile!.z && inB(box, t.x, t.y)) dirty.add(t.x + t.y * 65536);
			marks.clear();
			const cs = cv.cs, pv = this.pVis;
			if (cs && pv) { // LOS: tiles whose visibility flipped
				const h = cs.vis.length / cs.w, ph = pv.vis.length / pv.w;
				for (let ty = Math.max(cs.y0, pv.y0, box[2]); ty < Math.min(cs.y0 + h, pv.y0 + ph) && ty <= box[3]; ty++) for (let tx = Math.max(cs.x0, pv.x0, box[0]); tx < Math.min(cs.x0 + cs.w, pv.x0 + pv.w) && tx <= box[1]; tx++) {
					if (cs.vis[tx - cs.x0 + (ty - cs.y0) * cs.w] !== pv.vis[tx - pv.x0 + (ty - pv.y0) * pv.w]) dirty.add(tx + ty * 65536);
				}
			}
			const pi = this.pImgsAt; // images that appeared or left a tile
			cv.imgsAt.forEach((a, k) => { const b = pi.get(k); if (!b || !sameList(a, b)) dirty.add(k); });
			pi.forEach((_, k) => { if (!cv.imgsAt.has(k)) dirty.add(k); });
			for (const k of dirty) if (inB(box, k % 65536, Math.floor(k / 65536))) doTile(k % 65536, Math.floor(k / 65536)); // an image that left the box: its tile was dropped above
			// The safety sweep: a slice of the rest of the box, to catch a change nobody marked.
			const bw = box[1] - box[0] + 1, total = bw * (box[3] - box[2] + 1), cnt = Math.min(total, Math.ceil(total / SWEEP_EVERY));
			u.sweeping = true;
			for (let j = 0; j < cnt; j++) {
				const idx = (this.sweepAt + j) % total, k = box[0] + (idx % bw) + (box[2] + Math.floor(idx / bw)) * 65536;
				if (!dirty.has(k)) doTile(k % 65536, Math.floor(k / 65536));
			}
			u.sweeping = false;
			this.sweepAt = (this.sweepAt + cnt) % total;
			for (const a of this.areas) idOf(a); // an area's look marks no tile: re-checked every update
			for (const im of cv.imgs) { const s = this.sent.get(im); if (s && s.n > 0) idOf(im); } // /image datums aren't atoms: re-checked every update
		}
		this.pBox = box; this.pImgsAt = cv.imgsAt; this.pMob = cv.mob; this.pSeeInv = cv.seeInv;
		this.pVis = cv.cs;
		return newZ;
	}

	/** update's client.screen, in list order. */
	private screenPart(u: UpdateRun): { entries: [number, string, unknown][]; screenObjs: Set<DMObject>; screenChanged: boolean } {
		const { c, scan, gen, apps, idOf, cands } = u;
		// client.screen, in list order.
		const screenList = live(c.getVar("screen"));
		const now: unknown[] = [];
		const screenObjs = new Set<DMObject>();
		const entries: [number, string, unknown][] = [];
		if (screenList instanceof DMList) for (const x of screenList.items) {
			const o = live(x);
			if (!(o instanceof DMObject)) continue;
			const loc = o.hasVar("screen_loc") ? live(o.getVar("screen_loc")) : null;
			now.push(o, loc);
			if (this.resendIf && this.resendIf(o)) { const s0 = this.sent.get(o); if (s0) s0.sig.length = 0; }
			entries.push([idOf(o), o.type.path, loc]);
			screenObjs.add(o);
			this.pos.delete(o); // on the HUD (a held item): its old map tile is forgotten, so put down it shows there, not gliding from where it was picked up
		}
		this.resendIf = null;
		for (const o of this.resendObjs.splice(0)) { // still on a tile shown (a refused pick-up): its look again; one on the screen list was sent above
			const s0 = this.sent.get(o), k = this.pos.get(o);
			if (!s0 || screenObjs.has(o) || k === undefined || !this.tiles.get(k)?.includes(o)) continue;
			if (s0.gen === gen && apps.some((a) => a[0] === s0.id)) continue;
			s0.sig.length = 0; s0.gen = 0;
			idOf(o);
		}
		if (!scan) for (const o of this.screenObjs) if (!screenObjs.has(o)) cands.push(o); // left client.screen: gone if on no tile
		const screenChanged = now.length !== this.screen.length || now.some((v, i) => v !== this.screen[i]);
		if (screenChanged) this.screen = now;
		return { entries, screenObjs, screenChanged };
	}

	/** update's animations and flicks, and the client's pixel offset. */
	private animsAndOffset(u: UpdateRun): { anims: ViewUpdate["anims"]; off: [number, number]; offChanged: boolean } {
		const { vm, c, full } = u;
		// what the VM recorded (vm.animLog, on from the first update); events for objects the page holds an id for.
		let anims: ViewUpdate["anims"];
		const log = vm.animLog;
		if (log === null) vm.animLog = [];
		else if (log.length) {
			for (const e of log) {
				const sid = e.o === c ? CLIENT_ANIM_ID : this.sent.get(e.o)?.id; // animate(client, pixel_x/y) is the screen shake
				if (this.logAnim) {
					const k = e.flick !== undefined ? `flick ${e.flick}` : `animate ${e.vars!.map((v) => v[0]).join(",")} ${e.time}ds easing ${e.easing} loop ${e.loop} flags ${e.flags}`, key = `${e.o.type.path} ${k}${sid === undefined ? " (not in view)" : ""}`;
					if (!this.animSeen.has(key)) {
						this.animSeen.add(key);
						this.logAnim(`${key} (world.time ${vm.sched.time})`);
					}
				}
				if (sid === undefined) continue;
				(anims ??= []).push(e.flick !== undefined ? ["f", sid, e.flick] : ["a", sid, e.fresh ? 1 : 0, e.time!, e.loop!, e.easing!, e.flags!, e.vars as [string, unknown, unknown][]]);
			}
			log.length = 0;
		}

		// client.pixel_x/pixel_y (BYOND truncates them to ints already); animate(client) steps above run over this.
		const px = live(c.getVar("pixel_x")), py = live(c.getVar("pixel_y"));
		const off: [number, number] = [typeof px === "number" ? px : 0, typeof py === "number" ? py : 0];
		const offChanged = full ? off[0] !== 0 || off[1] !== 0 || this.off[0] !== 0 || this.off[1] !== 0 : off[0] !== this.off[0] || off[1] !== this.off[1];
		this.off = off;
		return { anims, off, offChanged };
	}

	/** update's prediction: what the movement keys move and where it may step, swaps, pick-up, put-down, the HUD's intents and carried light. */
	private predictPart(u: UpdateRun) {
		const { vm, c, cv, full, moved } = u, { eyeTile } = cv;
		// What the movement keys move (your mob, the AI's eye) and where it may step. One the client doesn't see (the AI eye is invisible) goes as
		// MOVER_ID, its step from the eye's last tile added to moved: the page glides it and the camera with it, predicted or not.
		const mover = predMover(vm, c), free = cv.free ?? predOf(vm, mover, eyeTile), run = free ? predRunOf(mover) : null;
		const mobId = free ? this.sent.get(mover as DMObject)?.id ?? MOVER_ID : undefined;
		if (mobId === MOVER_ID && eyeTile && this.pEye && this.pEye.z === eyeTile.z && (this.pEye.x !== eyeTile.x || this.pEye.y !== eyeTile.y))
			moved.push([MOVER_ID, this.pEye.x, this.pEye.y, eyeTile.x, eyeTile.y, run ? TILE_GLIDE : Number(live(mover!.getVar("glide_size"))) || 0, 1]);
		this.pEye = eyeTile;
		const stepsDone = vm.clients.stepsDone(c), predImgs: number[] = [];
		const pl = mobId !== undefined && mover === cv.mob ? pullOf(cv.mob) : null, plId = pl ? this.sent.get(pl.o)?.id : undefined;
		const mark = mobId !== undefined && mover!.hasVar("visible_icon") && truthyVar(mover!, "visible_icon") ? live(mover!.getVar("user_image")) : null; // a camera eye's marker (xenobio): an image on its tile, new each step
		if (mobId !== undefined) for (const im of cv.imgs) { const id = live(im.getVar("loc")) === mover || im === mark ? this.sent.get(im)?.id : undefined; if (id !== undefined) predImgs.push(id); }
		const riders = mobId !== undefined && mover!.hasVar("buckled_mobs") ? live(mover!.getVar("buckled_mobs")) : null; // a vehicle's riders (your mob): they move with it
		if (riders instanceof DMList) for (const r of riders.items) { const id = this.sent.get(live(r) as DMObject)?.id; if (id !== undefined) predImgs.push(id); }
		const swap: number[] = [];
		if (mobId !== undefined && mobId !== MOVER_ID && mover === cv.mob) for (const [o, dx, dy] of swapOf(vm, mover, free)) { const id = this.sent.get(o)?.id; if (id !== undefined) swap.push(id, dx, dy); }
		const picks = mobId !== undefined && mobId !== MOVER_ID && mover === cv.mob ? pickOf(vm, mover) : [], pick: [number, number, number, string, string][] = [];
		this.picks.clear();
		for (const [o, dx, dy, f, st] of picks) { const id = this.sent.get(o)?.id; if (id !== undefined) { pick.push([id, dx, dy, f, st]); this.picks.add(o); } }
		const po = mobId !== undefined && mobId !== MOVER_ID && mover === cv.mob ? putOf(vm, mover) : null, poId = po ? this.sent.get(po.item)?.id : undefined;
		let put: ViewUpdate["put"];
		this.putItem = null; this.putOn.clear();
		if (po && poId !== undefined) {
			const on: [number, number, number, number][] = [];
			for (const [o, dx, dy, ctr] of po.on) { const id = this.sent.get(o)?.id; if (id !== undefined) { on.push([id, dx, dy, ctr]); this.putOn.add(o); } }
			const keys = procFrom(c, "Northwest") === "/client" ? vm.clients.keysFor(c, ".northwest") : [];
			if (keys.length || on.length) { put = { id: poId, layer: po.layer, plane: po.plane, ih: [po.icon, po.state], keys, on }; this.putItem = po.item; }
		}
		const ia = live(cv.mob instanceof DMObject ? cv.mob.getVar("possible_a_intents") : null);
		const prefs = live(c.getVar("prefs")), tg = prefs instanceof DMObject ? live(prefs.getVar("toggles")) : 0;
		const hud = { ia: ia instanceof DMList ? ia.items.map((x) => String(live(x))) : [], iq: typeof tg === "number" && (tg & 32) !== 0 ? 1 : 0 };
		const hudKey = JSON.stringify(hud);
		const hudChanged = full || hudKey !== this.pHud;
		this.pHud = hudKey;
		const ownId = cv.mob instanceof DMObject ? this.sent.get(cv.mob)?.id : undefined;
		const light = ownId !== undefined ? carriedLightOf(cv.mob, ownId) : [], lightKey = light.join();
		const lightChanged = full ? light.length > 0 : lightKey !== this.pLight;
		this.pLight = lightKey;
		return { mover, free, run, mobId, predImgs, stepsDone, pl, plId, swap, pick, put, hud, hudChanged, light, lightChanged };
	}

	/** update's opq and lum, packed only when they changed (packing and joining them every update was most of a walking view's garbage: solo freezes). */
	private sightPacking(u: UpdateRun): { opqChanged: boolean; opq: Opq | []; lumChanged: boolean; lum: Lum | [] } {
		const { cv, full } = u;
		const cs = cv.cs, op = cs?.opaque ?? null, held = this.held, geo = this.geo;
		if (cs && op) { geo[0] = cs.x0; geo[1] = cs.y0; geo[2] = cs.w; }
		const sameOpq = Number(keepSame(held, 0, op ? geo : null)) & Number(keepSame(held, 1, op)) & Number(keepSame(held, 2, op ? cs!.own ?? cs!.vis : null));
		const opqChanged = full ? !!op : !sameOpq, opq: Opq | [] = !opqChanged ? [] : op ? packOpacity(cs!.x0, cs!.y0, cs!.w, op.length / cs!.w, op, cs!.own ?? cs!.vis) : [];
		const lb = popInSight(cv) ? cs!.box! : null;
		const sameLum = Number(keepSame(held, 3, lb ? lb.lamp : null)) & Number(keepSame(held, 4, lb ? lb.areaLit : null));
		const lumChanged = full ? !!lb : !sameLum, lum: Lum | [] = lumChanged && lb ? packLum(lb.lamp, lb.areaLit) : [];
		return { opqChanged, opq, lumChanged, lum };
	}
}

