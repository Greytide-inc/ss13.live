// client-view - What a connected player would see, as plain data (split out of client-dump.ts so
// the browser worker can build it too; no Node imports). For each client: its mob, eye (ref and x/y/z),
// view, client.screen (type, screen_loc and the appearance in station.json's format), client.images
// count, and the messages sent to it (counts by type, plus the first few of each type in full).
// Also eyeTile {x,y,z}: the turf client.eye is on, and viewTiles: every tile within `view`
// of it (a (2*view+1) square, clipped at the map edge) in station.json's tile format (tile-dump.ts).

import type { VM } from "../vm/interpreter.js";
import { DMList, DMObject, live } from "../vm/objects.js";
import { refOf } from "../vm/refs.js";
import { stringify } from "../vm/value.js";
import { DMType } from "../vm/objtree.js";
import { DMAtom, Kind, LOOK_VARS_SIG, registerViewMarks, unregisterViewMarks, SEE_MOBS, SEE_OBJS, SEE_THRU, SEE_TURFS, SIGHT_BLIND } from "../vm/world.js";
import { stress, stressNoteLos } from "../vm/stress-log.js";
import { computeLos, cropLosBox } from "../vm/view-los.js";
import { buildAppearance, resolveIconPath, type BuiltAppearance } from "../appearance/appearance.js";
import { CLIENT_ANIM_ID } from "../render/anim.js";
import { packOpacity, type Opq } from "../render/sight-shadow.js";
import type { OutMsg } from "../vm/clients.js";
import { SEE_INVISIBLE_LIVING, type Tile } from "../tools/tile-dump.js";

/** view as [half-width, half-height]: a number n is n both ways; "WxH" is a full size (per the BYOND
 *  docs client.view may be either; unverified in BYOND). */
function viewRadius(v: unknown): [number, number] {
	if (typeof v === "number") return [Math.trunc(v), Math.trunc(v)];
	const m = typeof v === "string" ? /^(\d+)x(\d+)$/.exec(v) : null;
	if (m) return [Math.floor((+m[1] - 1) / 2), Math.floor((+m[2] - 1) / 2)];
	return [7, 7];
}

/** the tile the client's view is centred on, as BYOND does: the turf of the eye's outermost container
 *  (a mob in a disposal holder in a pipe -> the pipe's turf). null if the eye is nowhere (loc null). */
export function eyeTileOf(vm: VM, eye: unknown): { x: number; y: number; z: number } | null {
	const t = vm.map.outerTurf(live(eye as never) as never);
	if (!t) return null;
	const x = vm.getField(t, "x"), y = vm.getField(t, "y"), z = vm.getField(t, "z");
	if (typeof x !== "number" || typeof y !== "number" || typeof z !== "number" || z < 1) return null;
	return { x, y, z };
}

/** the tiles within `view` of the eye as the client sees them, by the same rules as the per-tick updates
 *  (clientSeen/seenOn: line of sight, the mob's see_invisible, client.images), so the page's `?check=1` compares like with like. */
function viewAround(vm: VM, c: DMObject): { eyeTile: { x: number; y: number; z: number } | null; viewTiles: Tile[] } {
	const cv = clientSeen(vm, c);
	if (!cv.eyeTile) return { eyeTile: null, viewTiles: [] };
	const { x, y, z } = cv.eyeTile;
	const viewTiles: Tile[] = [];
	const objs: DMObject[] = [];
	for (let ty = Math.max(1, y - cv.vy); ty <= Math.min(vm.map.maxy, y + cv.vy); ty++) {
		for (let tx = Math.max(1, x - cv.vx); tx <= Math.min(vm.map.maxx, x + cv.vx); tx++) {
			const n = seenOn(vm, cv, tx, ty, objs);
			if (!n) continue;
			const appearances = objs.map((o) => { const ap = buildAppearance(o); if (cv.imgs.has(o)) ap.mouseOpacity = 0; return ap; });
			appearances.sort((a, b) => a.plane - b.plane || a.layer - b.layer); // as tile-dump.ts buildTile
			viewTiles.push({ x: tx, y: ty, appearances });
		}
	}
	return { eyeTile: { x, y, z }, viewTiles };
}

/** What decides which objects a client sees on a tile, worked out once per update (los1, pt-d, an1). */
export interface ClientSeen {
	eyeTile: { x: number; y: number; z: number } | null;
	view: unknown; vx: number; vy: number; mob: unknown;
	/** Tiles sent beyond the view on each side: 1 for the camera glide, 1 + PRED_R for a page that predicts (its camera runs up to PRED_R steps ahead). */
	ring: number;
	sight: Record<string, unknown> | null; seeInv: number;
	cs: ClientSight | null; // null = sees everything in range
	imgsAt: Map<number, DMObject[]>; // client.images drawn on a tile (key x + y * 65536): shown on tiles in sight
	imgs: Set<DMObject>;
}

let cfgVm: VM | null = null, cfgIdx = -1;
/** the view this client gets unzoomed (client.default_view): config's default_view when widescreen, else default_view_square. The page lays the HUD out against it. */
export function baseViewOf(vm: VM, c: DMObject): unknown {
	if (cfgVm !== vm) { cfgVm = vm; cfgIdx = vm.tree.globalNames.indexOf("config"); }
	const cfg = cfgIdx >= 0 ? live(vm.globals[cfgIdx]) : null;
	if (!(cfg instanceof DMObject)) return null;
	const m = live(c.getVar("mob")), prefs = live(c.getVar("prefs"));
	const wide = !(m instanceof DMObject && m.type.path === "/mob/dead/new_player") && (!(prefs instanceof DMObject) || !!live(prefs.getVar("widescreenpref")));
	return live(cfg.getVar(wide ? "default_view" : "default_view_square"));
}

export function clientSeen(vm: VM, c: DMObject): ClientSeen {
	const view = live(c.getVar("view"));
	const m = live(c.getVar("mob"));
	const sight = m instanceof DMObject ? Object.fromEntries(["see_invisible", "see_in_dark", "sight"].map((k) => [k, live(vm.getField(m, k))])) : null;
	const seeInv = typeof sight?.see_invisible === "number" ? sight.see_invisible : SEE_INVISIBLE_LIVING; // pt-d: the mob's own level (a ghost sees 60, so it sees itself)
	const eyeTile = eyeTileOf(vm, c.getVar("eye")); // the outermost container's turf
	const [vx, vy] = viewRadius(view);
	// client.images whose loc is an atom or turf shown this update, by the tile they are drawn on (the atom's outermost turf).
	const imgsAt = new Map<number, DMObject[]>();
	const imgs = new Set<DMObject>();
	const imgList = live(c.getVar("images"));
	if (eyeTile && imgList instanceof DMList && imgList.items.length) {
		for (const x of imgList.items) {
			const im = live(x);
			if (!(im instanceof DMObject) || !im.hasVar("loc") || invisible(im) > seeInv) continue;
			const l = live(im.getVar("loc"));
			const t = l instanceof DMAtom ? vm.map.outerTurf(l) : null;
			if (!t || vm.getField(t, "z") !== eyeTile.z) continue;
			const tx = vm.getField(t, "x"), ty = vm.getField(t, "y");
			if (typeof tx !== "number" || typeof ty !== "number") continue;
			const k = tx + ty * 65536;
			let arr = imgsAt.get(k);
			if (!arr) imgsAt.set(k, (arr = []));
			arr.push(im);
			imgs.add(im);
		}
	}
	const ring = vm.clients.predicts(c) ? 1 + PRED_R : 1;
	const cs = eyeTile ? clientSight(vm, eyeTile, vx, vy, m, ring) : null; // los1
	return { eyeTile, view, vx, vy, ring, mob: m, sight, seeInv, cs, imgsAt, imgs };
}

/** Fills objs with what the client sees on tile tx,ty of the eye's z: turf and area (nFixed), then contents
 *  (up to nReal), then client.images. Null if there is no turf there. */
export function seenOn(vm: VM, cv: ClientSeen, tx: number, ty: number, objs: DMObject[]): { nFixed: number; nReal: number } | null {
	objs.length = 0;
	const turf = cv.eyeTile ? vm.map.turfAt(tx, ty, cv.eyeTile.z) : null;
	if (!turf) return null;
	const cs = cv.cs, seeInv = cv.seeInv;
	const seen = !cs || cs.vis[tx - cs.x0 + (ty - cs.y0) * cs.w] === 1;
	const f = seen ? -1 : cs!.flags; // hidden: only what SEE_TURFS/OBJS/MOBS show through walls and dark
	if (f & SEE_TURFS) {
		objs.push(turf);
		const area = live(vm.getField(turf, "loc"));
		if (area instanceof DMObject && invisible(area) <= seeInv) objs.push(area);
	}
	const nFixed = objs.length;
	for (const o of turf.contents) {
		if (invisible(o) > seeInv) continue;
		if (seen || (o.kind === Kind.Mob ? (f & SEE_MOBS) !== 0 || o === cs!.self : (f & SEE_OBJS) !== 0)) objs.push(o);
	}
	const nReal = objs.length;
	const im = seen ? cv.imgsAt.get(tx + ty * 65536) : undefined;
	if (im) for (const o of im) objs.push(o);
	return { nFixed, nReal };
}

/** what the client can see in the box of half-size rx+ring, ry+ring around the eye turf, as BYOND's client does:
 *  the tiles view() from the eye would give with client.view and the mob's sight/see_in_dark (vm/view-los.ts),
 *  the outer ring (sent ahead for the camera glide, wider for a predicting page) from the ring-bigger box. Per tile: 1 = everything shows,
 *  0 = hidden (drawn black), except what the mob's SEE_TURFS/SEE_OBJS/SEE_MOBS flags show anyway. opaque: per tile of the same box, 1 = blocks
 *  sight (none with SEE_THRU; null when blind), for the page's sight shadows (render/sight-shadow.ts). */
export interface ClientSight { x0: number; y0: number; w: number; vis: Uint8Array; flags: number; self: DMObject | null; opaque: Uint8Array | null }

const SEE_SELF = 32, XRAY = SEE_MOBS | SEE_OBJS | SEE_TURFS;

export function clientSight(vm: VM, eyeTile: { x: number; y: number; z: number }, rx: number, ry: number, mob: unknown, ring = 1): ClientSight | null {
	const m = live(mob as never);
	const num = (k: string) => { const v = m instanceof DMAtom ? vm.getField(m, k) : null; return typeof v === "number" ? v : 0; };
	const flags = num("sight"), sid = num("see_in_dark");
	const self = m instanceof DMAtom && m.kind === Kind.Mob ? m : null;
	if ((flags & XRAY) === XRAY) return null; // sees everything in range (a ghost)
	const w = 2 * (rx + ring) + 1, h = 2 * (ry + ring) + 1, x0 = eyeTile.x - rx - ring, y0 = eyeTile.y - ry - ring;
	const vis = new Uint8Array(w * h);
	const ct = vm.map.turfAt(eyeTile.x, eyeTile.y, eyeTile.z);
	let opaque: Uint8Array | null = null;
	if (ct && !(flags & SIGHT_BLIND)) {
		const { box } = vm.map.losBox(ct, rx + ring, ry + ring, (flags & SEE_THRU) !== 0, false);
		const t0 = stress.on ? performance.now() : 0;
		opaque = box.opaque;
		const outer = computeLos(box, sid, false), inner = computeLos(cropLosBox(box, ring), sid, false);
		if (stress.on) { stressNoteLos(performance.now() - t0, "client-view.ts:143 (x2 computeLos)"); }
		for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
			const out = x < ring || y < ring || x >= w - ring || y >= h - ring;
			vis[x + y * w] = (out ? outer[x + y * w] : inner[x - ring + (y - ring) * (w - 2 * ring)]) !== 0 ? 1 : 0;
		}
	}
	return { x0, y0, w, vis, flags, self: flags & SEE_SELF ? self : null, opaque };
}

const FIRST_OF_EACH = 3;
const MAX_TEXT = 2000;

function trim(m: OutMsg): OutMsg {
	const out = { ...m };
	for (const k of ["text", "html", "params"]) {
		const v = out[k];
		if (typeof v === "string" && v.length > MAX_TEXT) out[k] = v.slice(0, MAX_TEXT) + `... (${v.length} chars)`;
	}
	return out;
}

function atomInfo(vm: VM, v: unknown) {
	const a = live(v as never);
	if (!(a instanceof DMObject)) return null;
	const info: Record<string, unknown> = { ref: refOf(a), type: a.type.path, name: stringify(a) };
	if (a instanceof DMAtom) {
		info.x = vm.getField(a, "x");
		info.y = vm.getField(a, "y");
		info.z = vm.getField(a, "z");
	}
	return info;
}

/** Every connected client's view, as client.json's data (JSON-safe, structured-clone-safe). Icon
 *  paths of runtime-built icons (vm.runtimeIcons keys) are left as they are; client-dump.ts turns them into files. */
export function buildClientView(vm: VM): { builtAt: string; worldTime: number; clients: Record<string, unknown>[] } {
	const clients = vm.clients.list.map((c) => {
		const ck = stringify(c.getVar("ckey"));
		const screen = live(c.getVar("screen"));
		const images = live(c.getVar("images"));
		const screenObjs = screen instanceof DMList
			? screen.items.map((x) => {
				const o = live(x);
				if (!(o instanceof DMObject)) return { value: String(o) };
				return { type: o.type.path, screen_loc: o.hasVar("screen_loc") ? live(o.getVar("screen_loc")) : null, appearance: buildAppearance(o) };
			})
			: [];
		const mine = vm.clients.outbox.filter((m) => m.client === ck);
		const counts: Record<string, number> = {};
		const firsts: OutMsg[] = [];
		for (const m of mine) {
			counts[m.type] = (counts[m.type] ?? 0) + 1;
			if (counts[m.type] <= FIRST_OF_EACH) firsts.push(trim(m));
		}
		const view = live(c.getVar("view"));
		// The mob's sight vars: which invisibility levels, and how far in the dark, it sees.
		const m = live(c.getVar("mob"));
		const sight = m instanceof DMObject
			? Object.fromEntries(["see_invisible", "see_in_dark", "sight"].map((k) => [k, live(vm.getField(m, k))]))
			: null;
		const { eyeTile, viewTiles } = viewAround(vm, c);
		return {
			key: c.getVar("key"),
			ckey: ck,
			mob: atomInfo(vm, c.getVar("mob")),
			eye: atomInfo(vm, c.getVar("eye")),
			view,
			baseView: baseViewOf(vm, c),
			eyeTile,
			perspective: live(c.getVar("perspective")),
			sight,
			holder: atomInfo(vm, c.hasVar("holder") ? c.getVar("holder") : null),
			screenCount: screenObjs.length,
			screen: screenObjs,
			imagesCount: images instanceof DMList ? images.len : 0,
			outbox: { total: mine.length, counts, first: firsts },
			viewTiles,
		};
	});
	return { builtAt: new Date().toISOString(), worldTime: vm.sched.time, clients };
}

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
	/** netcode 2: what the page needs to guess your HUD toggles (see predictClick in client-scene.ts): the mob's possible_a_intents in order, and
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

// lag-smoothing step 4: where the page may move the player's own mob before the server says so. Only the plain case: a living mob standing
// on a turf it is the eye of, free to walk (tg's client/Move checks, as far as vars show them). A tile counts as free when it isn't space and
// nothing there is dense (a lying mob isn't) or a dense border object (a directional window, which blocks some ways: never guessed). The mob's
// own tile must have no dense border object either, or nothing is free. The page walks only between free tiles, diagonals only when both
// straight steps are free too (up to three steps ahead, so the 7x7 square around the mob).
export const PRED_R = 3, PRED_W = 2 * PRED_R + 1;
/** The view id of a mover the client doesn't see (the AI eye), in pred and moved. TILE_GLIDE: its glide size, a tile a tick (AIMove runs every tick). */
export const MOVER_ID = -1, TILE_GLIDE = 32;
const ON_BORDER = 512;
const truthyVar = (o: DMObject, k: string): boolean => { const v = live(o.getVar(k)); return v !== null && v !== 0 && v !== "" && v !== undefined; };
function blocks(o: DMAtom, mob: DMAtom): boolean {
	if (o === mob || !truthyVar(o, "density")) return false;
	return !(o.kind === Kind.Mob && truthyVar(o, "lying"));
}
const borderDense = (t: DMAtom, mob: DMAtom): boolean => t.contents.some((o) => o !== mob && truthyVar(o, "density") && (Number(live(o.getVar("flags"))) & ON_BORDER) !== 0);
/** netcode 5: the pulled thing, when the page may move it along with predicted steps: on a turf of the mob's z within one tile of it, not anchored. */
export function pullOf(m: unknown): { o: DMAtom; ox: number; oy: number; dense: number } | null {
	if (!(m instanceof DMAtom) || !m.hasVar("pulling")) return null;
	const o = live(m.getVar("pulling")), t = m.loc;
	if (!(o instanceof DMAtom) || o.kind === Kind.Turf || !t || t.kind !== Kind.Turf || truthyVar(o, "anchored")) return null;
	const l = o.loc;
	if (!l || l.kind !== Kind.Turf || l.z !== t.z || Math.abs(l.x - t.x) > 1 || Math.abs(l.y - t.y) > 1) return null;
	return { o, ox: l.x - t.x, oy: l.y - t.y, dense: blocks(o, m) ? 1 : 0 };
}
/** Carried light: the mob's own light sources (a flashlight in hand, a lit PDA: tg moves them with their top_atom), as the page needs them
 *  to draw them where it draws the mob (client-scene.ts carried light). [mob id, the sources' applied turf minus the mob's (east+, north+),
 *  the number of sources and per source its light_power, light_range and applied_lum r, g, b (the page works out from those how strongly
 *  it lights a corner from where it draws the mob), then per corner they light: its offset from that turf in half tiles (odd) and r, g, b
 *  as it shows without them]; [] for none. That base is the corner's lum less effect_str[corner] * applied_lum per source (what
 *  update_lumcount added), scaled and rounded as update_objects does: a corner over 1 is scaled down, so the page can't work it out from
 *  what it shows. Sources applied on different turfs: none. */
export function carriedLightOf(m: unknown, mobId: number): number[] {
	if (!(m instanceof DMAtom) || m.kind !== Kind.Mob || !m.loc || m.loc.kind !== Kind.Turf) return [];
	const ls = live(m.getVar("light_sources"));
	if (!(ls instanceof DMList)) return [];
	let at: DMAtom | null = null;
	const sum = new Map<number, [number, number, number, number, number]>(), cornerOf = new Map<number, DMObject>(), srcs: number[] = [];
	for (const s of ls.items) {
		if (!(s instanceof DMObject) || live(s.getVar("top_atom")) !== m || !truthyVar(s, "applied")) continue;
		const pt = live(s.getVar("pixel_turf")), es = live(s.getVar("effect_str"));
		if (!(pt instanceof DMAtom) || !(es instanceof DMList) || !es.items.length) continue;
		if (at && at !== pt) return [];
		at = pt;
		const lr = Number(live(s.getVar("applied_lum_r"))) || 0, lg = Number(live(s.getVar("applied_lum_g"))) || 0, lb = Number(live(s.getVar("applied_lum_b"))) || 0;
		srcs.push(Number(live(s.getVar("light_power"))) || 0, Number(live(s.getVar("light_range"))) || 0, lr, lg, lb);
		for (const c of es.items) {
			if (!(c instanceof DMObject)) continue;
			const k = Number(live(es.assocOf(c) ?? null)) || 0;
			if (!k) continue;
			const cx = Math.round((Number(live(c.getVar("x"))) - pt.x) * 2), cy = Math.round((Number(live(c.getVar("y"))) - pt.y) * 2), key = cx * 1000 + cy;
			const e = sum.get(key) ?? [cx, cy, 0, 0, 0];
			cornerOf.set(key, c);
			e[2] += k * lr; e[3] += k * lg; e[4] += k * lb;
			sum.set(key, e);
		}
	}
	if (!at || at.z !== m.loc.z || !sum.size) return [];
	const out = [mobId, at.x - m.loc.x, at.y - m.loc.y, srcs.length / 5, ...srcs];
	const lum = (c: DMObject, k: string): number => Number(live(c.getVar(k))) || 0;
	for (const [key, e] of sum) {
		if (!(e[2] > 0 || e[3] > 0 || e[4] > 0)) continue;
		const c = cornerOf.get(key)!, br = Math.max(0, lum(c, "lum_r") - e[2]), bg = Math.max(0, lum(c, "lum_g") - e[3]), bb = Math.max(0, lum(c, "lum_b") - e[4]);
		const mx = Math.max(br, bg, bb), k = mx > 1 ? 1 / mx : 1, base = (v: number) => Math.round(v * k * 64) / 64; // update_objects: round(lum * k, 1/64)
		out.push(e[0], e[1], base(br), base(bg), base(bb));
	}
	return out.length > 4 + srcs.length ? out : [];
}
/** What a client's movement keys move, for the page to predict: its mob, the AI's eye while the AI looks through it (client/Move -> AIMove), or a
 *  camera console's eye while the client looks through it (remote_control -> relaymove). */
export function predMover(vm: VM, c: DMObject): DMAtom | null {
	const m = live(c.getVar("mob"));
	if (!(m instanceof DMAtom)) return null;
	const rc = m.hasVar("remote_control") ? live(m.getVar("remote_control")) : null;
	if (rc instanceof DMAtom && rc.type.path.startsWith("/mob/camera/aiEye/remote")) return live(c.getVar("eye")) === rc ? rc : null;
	if (m.loc && JAUNTS.some((p) => m.loc!.type.path.startsWith(p))) return m.loc; // a jaunt's dummy: client/Move -> relaymove moves it
	if (m.loc?.type.path.startsWith("/obj/mecha") && live(m.loc.getVar("occupant")) === m) return m.loc; // the mech you pilot: relaymove -> domove
	const b = m.hasVar("buckled") ? live(m.getVar("buckled")) : null;
	if (b instanceof DMAtom && b.type.path.startsWith("/obj/vehicle")) return b; // a vehicle you ride: relaymove -> its riding datum steps it
	if (!m.type.path.startsWith("/mob/living/silicon/ai")) return m;
	const eye = live(m.getVar("eyeobj"));
	return eye instanceof DMAtom && live(c.getVar("eye")) === eye ? eye : null;
}
/** The AI eye's run for the page: [sprint, acceleration] of its AI (AIMove moves the eye ceil(max(sprint, 10) / 20) tiles a step, sprint
 *  growing 0.5 a step up to 50 with acceleration on, back to 10 after half a second without a step); a camera console's eye keeps its own
 *  (remote relaymove, the same rule); null for anything else. */
export function predRunOf(mover: DMAtom | null): [number, number] | null {
	if (!mover?.type.path.startsWith("/mob/camera/aiEye")) return null;
	const ai = mover.type.path.startsWith("/mob/camera/aiEye/remote") ? mover : live(mover.getVar("ai")), s = ai instanceof DMObject ? live(ai.getVar("sprint")) : null;
	return ai instanceof DMObject && typeof s === "number" ? [s, truthyVar(ai, "acceleration") ? 1 : 0] : null;
}
/** The dummies a jaunting mob rides in (client/Move: the mob's loc is an obj -> its relaymove). spell_jaunt: the wizard's jaunt, onto any
 *  tile without NOJAUNT, then canmove off for 0.2 s (Clients.step waits for it: moverWait); slaughter: blood-crawl, forceMove anywhere. */
const JAUNTS = ["/obj/effect/dummy/spell_jaunt", "/obj/effect/dummy/slaughter"], NOJAUNT = 1;
/** client/Move's checks on the mob before it gets to relaymove (a dummy) or incorporeal_move: alive, not frozen, not held. */
const movesFree = (u: DMAtom, grab: boolean): boolean => live(u.getVar("stat")) !== 2 && ["notransform", "control_object", "force_moving", ...(grab ? ["pulledby", "buckled"] : [])].every((k) => !u.hasVar(k) || !truthyVar(u, k));
const areaIs = (vm: VM, t: DMAtom, path: string): boolean => { const a = live(vm.getField(t, "loc")); return a instanceof DMObject && a.type.path.startsWith(path); };
export function predOf(vm: VM, m: unknown, eyeTile: { x: number; y: number; z: number } | null): number {
	if (!(m instanceof DMAtom) || !eyeTile) return 0;
	const t = m.loc;
	if (!t || t.kind !== Kind.Turf || t.x !== eyeTile.x || t.y !== eyeTile.y || t.z !== eyeTile.z) return 0;
	const p = m.type.path;
	if (m.kind !== Kind.Mob && !JAUNTS.some((j) => p.startsWith(j)) && !p.startsWith("/obj/vehicle") && !p.startsWith("/obj/mecha")) return 0;
	const square = (ok: (n: DMAtom) => boolean): number => {
		let free = 0;
		for (let dy = -PRED_R; dy <= PRED_R; dy++) for (let dx = -PRED_R; dx <= PRED_R; dx++) { const n = vm.map.turfAt(t.x + dx, t.y + dy, t.z); if (n && ok(n)) free += 2 ** ((dy + PRED_R) * PRED_W + dx + PRED_R); }
		return free;
	};
	if (p.startsWith("/mob/dead/observer")) { // a ghost's Move never refuses a tile that exists; orbiting and following are moved by the server
		if (truthyVar(m, "orbiting")) return 0;
		return square(() => true);
	}
	if (p.startsWith("/mob/camera/aiEye/remote")) { // a camera console's eye: client/Move -> relaymove -> setLoc, while its user stands on a turf
		const u = live(m.getVar("eye_user"));
		if (!(u instanceof DMAtom) || u.kind !== Kind.Mob || !u.type.path.startsWith("/mob/living") || u.loc?.kind !== Kind.Turf || live(u.getVar("remote_control")) !== m || live(u.getVar("stat")) === 2) return 0;
		for (const k of ["notransform", "control_object", "force_moving", "incorporeal_move"]) if (u.hasVar(k) && truthyVar(u, k)) return 0;
		const setLoc = procFrom(m, "setLoc"), areaOk = (ok: (a: DMObject) => boolean) => (n: DMAtom): boolean => { const a = live(vm.getField(n, "loc")); return a instanceof DMObject && ok(a); };
		if (setLoc === "/mob/camera/aiEye/remote/xenobio") { // only in the area it was made in, or xenobiology
			const name = live(m.getVar("allowed_area"));
			return square(areaOk((a) => live(a.getVar("name")) === name || a.type.path.startsWith("/area/science/xenobiology")));
		}
		if (setLoc === "/mob/camera/aiEye/remote/base_construction") { // the aux base drone: its starting area, or the aux base itself
			const start = live(m.getVar("starting_area"));
			return square(areaOk((a) => a === start || a.type.path.startsWith("/area/shuttle/auxillary_base")));
		}
		return setLoc === "/mob/camera/aiEye/remote" || setLoc === "/mob/camera/aiEye/remote/holo" ? square(() => true) : 0; // holo: moves, then the hologram follows
	}
	if (p.startsWith("/mob/camera/aiEye")) { // AIMove: setLoc onto any tile that exists, while the AI is on a turf (not carded) and alive
		const ai = live(m.getVar("ai"));
		if (!(ai instanceof DMAtom) || ai.loc?.kind !== Kind.Turf || live(ai.getVar("stat")) === 2 || truthyVar(ai, "notransform")) return 0;
		return square(() => true);
	}
	if (p.startsWith("/mob/camera/blob")) { // /mob/camera/blob/Move: placed, only next to a blob (range 3x3); before that, anywhere but space and shuttles
		if (truthyVar(m, "notransform")) return 0;
		if (!truthyVar(m, "placed")) return square((n) => !n.type.path.startsWith("/turf/open/space") && !areaIs(vm, n, "/area/shuttle"));
		const blob = new Set<number>(); // tiles within PRED_R + 1 holding a blob
		for (let dy = -PRED_R - 1; dy <= PRED_R + 1; dy++) for (let dx = -PRED_R - 1; dx <= PRED_R + 1; dx++) {
			const n = vm.map.turfAt(t.x + dx, t.y + dy, t.z);
			if (n?.contents.some((o) => o.type.path.startsWith("/obj/structure/blob"))) blob.add(n.x + n.y * 65536);
		}
		return square((n) => { for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) if (blob.has(n.x + x + (n.y + y) * 65536)) return true; return false; });
	}
	if (p.startsWith("/obj/vehicle")) return vehicleFree(vm, m, t);
	if (p.startsWith("/obj/mecha")) return mechFree(vm, m, t);
	if (m.kind === Kind.Obj) { // a jaunt's dummy, with the mob inside
		const u = m.contents.find((o) => o.kind === Kind.Mob && o.type.path.startsWith("/mob/living"));
		if (!u || !movesFree(u, true) || !truthyVar(u, "canmove") || (u.hasVar("incorporeal_move") && truthyVar(u, "incorporeal_move")) || (u.hasVar("remote_control") && truthyVar(u, "remote_control"))) return 0;
		if (p.startsWith("/obj/effect/dummy/slaughter")) return square(() => true);
		return truthyVar(m, "reappearing") ? 0 : square((n) => !(Number(live(n.getVar("flags"))) & NOJAUNT));
	}
	if (p.startsWith("/mob/living/") && m.hasVar("incorporeal_move") && truthyVar(m, "incorporeal_move")) { // Process_Incorpmove: before the grab, buckle, canmove and space checks
		if (!movesFree(m, false)) return 0;
		const mode = live(m.getVar("incorporeal_move"));
		if (mode === 1) return square(() => true); // anywhere (Poly's ghost, the spooky ghost costume, a scouting guardian)
		if (mode === 3) return square((n) => !(Number(live(n.getVar("flags"))) & NOJAUNT) && !n.contents.some((o) => o.type.path.startsWith("/obj/effect/decal/cleanable/salt"))); // a revenant
		return 0; // 2, the ninja's: half its steps jump two tiles at random
	}
	if (!p.startsWith("/mob/living/") || p.startsWith("/mob/living/silicon/ai") || t.type.path.startsWith("/turf/open/space")) return 0;
	if (!truthyVar(m, "canmove") || live(m.getVar("stat")) === 2) return 0;
	for (const k of ["buckled", "notransform", "control_object", "remote_control", "pulledby", "incorporeal_move", "confused", "throwing", "force_moving"]) if (m.hasVar(k) && truthyVar(m, k)) return 0;
	return walkFree(vm, m, t, [m]);
}
/** The walking square: the tiles round t that mover m (riders `skip` too) could surely step onto, not space; 0 when none. */
function walkFree(vm: VM, m: DMAtom, t: DMAtom, skip: DMAtom[]): number {
	if (t.contents.some((o) => !skip.includes(o) && truthyVar(o, "density") && (Number(live(o.getVar("flags"))) & ON_BORDER) !== 0)) return 0;
	const self = 2 ** (PRED_R * PRED_W + PRED_R);
	let free = self;
	for (let dy = -PRED_R; dy <= PRED_R; dy++) for (let dx = -PRED_R; dx <= PRED_R; dx++) {
		if (!dx && !dy) continue;
		const n = vm.map.turfAt(t.x + dx, t.y + dy, t.z);
		if (!n || truthyVar(n, "density") || n.type.path.startsWith("/turf/open/space") || n.contents.some((o) => !skip.includes(o) && blocks(o, m)) || borderDense(n, m)) continue;
		free += 2 ** ((dy + PRED_R) * PRED_W + dx + PRED_R);
	}
	return free === self ? 0 : free;
}
/** A vehicle the client's mob rides (/obj/vehicle relaymove -> /datum/riding handle_ride): the rider not incapacitated (no stun, knockdown,
 *  sleep or restraints), its key in hand (keycheck), gravity where the vehicle is (Process_Spacemove), then step(): the walking square, the
 *  riders not in the way. Vehicles or riding datums with their own relaymove/handle_ride/keycheck (the lava boat) aren't guessed. */
function vehicleFree(vm: VM, v: DMAtom, t: DMAtom): number {
	const rd = live(v.getVar("riding_datum")), riders = live(v.getVar("buckled_mobs"));
	if (!(rd instanceof DMObject) || !(riders instanceof DMList) || procFrom(v, "relaymove") !== "/obj/vehicle") return 0;
	if (procFrom(rd, "handle_ride") !== "/datum/riding" || procFrom(rd, "keycheck") !== "/datum/riding" || procFrom(rd, "Process_Spacemove") !== "/datum/riding") return 0;
	const rs = riders.items.map((x) => live(x)).filter((x): x is DMAtom => x instanceof DMAtom);
	const u = rs.find((r) => r.type.path.startsWith("/mob/living/carbon/human"));
	if (!u || !movesFree(u, false) || live(u.getVar("stat")) !== 0 || truthyVar(u, "pulledby") || truthyVar(u, "handcuffed")) return 0;
	const se = live(u.getVar("status_effects")), suit = live(u.getVar("wear_suit"));
	if (se instanceof DMList && se.items.some((x) => { const e = live(x); return e instanceof DMObject && e.type.path.startsWith("/datum/status_effect/incapacitating"); })) return 0;
	if (suit instanceof DMObject && truthyVar(suit, "breakouttime")) return 0;
	const key = live(rd.getVar("keytype")), held = live(u.getVar("held_items"));
	if (key instanceof DMType && !(held instanceof DMList && held.items.some((x) => { const h = live(x); return h instanceof DMObject && h.type.isSubtypeOf(key); }))) return 0;
	if (!hasGravity(vm, t)) return 0;
	return walkFree(vm, v, t, rs);
}
/** A mech the client's mob pilots (/obj/mecha relaymove -> domove): the pilot free to move (canmove, as client/Move wants before relaymove),
 *  not connected to a port, not in maintenance, defence or zoom mode, its controls not lost (MECHA_INT_CONTROL_LOST: random steps), a cell
 *  with a step's charge, gravity where it stands (thrusters and push-offs not guessed), then step(): the walking square. Not phasing (a
 *  phazon walks through walls) and no bump-smashing: those tiles stay blocked. Mechs with their own relaymove/domove/mechstep aren't guessed. */
const MECHA_INT_CONTROL_LOST = 16;
function mechFree(vm: VM, me: DMAtom, t: DMAtom): number {
	const u = live(me.getVar("occupant")), cell = live(me.getVar("cell"));
	if (!(u instanceof DMAtom) || !movesFree(u, true) || !truthyVar(u, "canmove") || (u.hasVar("remote_control") && truthyVar(u, "remote_control"))) return 0;
	if (["relaymove", "domove", "mechstep", "mechturn"].some((k) => procFrom(me, k) !== "/obj/mecha")) return 0;
	for (const k of ["connected_port", "state", "defence_mode", "zoom_mode", "phasing"]) if (me.hasVar(k) && truthyVar(me, k)) return 0;
	if (Number(live(me.getVar("internal_damage"))) & MECHA_INT_CONTROL_LOST) return 0;
	if (!(cell instanceof DMObject) || !(Number(live(cell.getVar("charge"))) >= Number(live(me.getVar("step_energy_drain"))))) return 0;
	return hasGravity(vm, t) ? walkFree(vm, me, t, []) : 0;
}
/** With pred: 1 when a key in a direction the mover doesn't face only turns it (a mech that isn't strafing: domove -> mechturn), else 0. */
export function predTurnOf(mover: DMAtom | null): number {
	return mover?.type.path.startsWith("/obj/mecha") && !truthyVar(mover, "strafe") ? 1 : 0;
}
/** /atom/proc/has_gravity on a turf: not space, and its area has gravity or a gravity generator runs on its z. */
function hasGravity(vm: VM, t: DMAtom): boolean {
	if (t.type.path.startsWith("/turf/open/space")) return false;
	const a = live(vm.getField(t, "loc"));
	if (a instanceof DMObject && truthyVar(a, "has_gravity")) return true;
	const gi = vm.tree.globalNames.indexOf("gravity_generators"), gens = gi < 0 ? null : live(vm.globals[gi] as never) as unknown;
	const z = gens instanceof DMList ? live((gens.assocOf(String(t.z)) ?? null) as never) as unknown : null;
	return z instanceof DMList && z.len > 0;
}
const procFrom = (o: DMObject, name: string): string | undefined => o.type.procs.get(name)?.owner.path;
const PREVENT_CLICK_UNDER = 32768, ON_FIRE = 8;
/** Predicted pick-up: the items on turfs within PRED_R of mob `m` that a plain left click with the empty active hand would surely pick up,
 *  bar the reach (the page checks it from where it draws the mob) and next_move. As tg runs it: ClickOn (not incapacitated, restrained,
 *  in throw mode or in a locker) -> human UnarmedAttack (a hand there, no gloves' Touch or mutation taking over) -> /obj/item attack_hand (not
 *  anchored, burning, acid on it or flying) -> put_in_active_hand (not lying). Items with their own attack_hand (storage, two-handed...) aren't
 *  listed. [item, its tile minus the mob's (east+, north+), in-hand icon, state (update_inv_hands: lefthand_file for an odd hand index,
 *  righthand_file for an even one; item_state, else icon_state)][]. */
export function pickOf(vm: VM, m: unknown): [DMAtom, number, number, string, string][] {
	if (!(m instanceof DMAtom) || m.kind !== Kind.Mob || !m.type.path.startsWith("/mob/living/carbon/human")) return [];
	const t = m.loc;
	if (!t || t.kind !== Kind.Turf || procFrom(m, "ClickOn") !== "/mob" || procFrom(m, "UnarmedAttack") !== "/mob/living/carbon/human") return [];
	if (live(m.getVar("stat")) !== 0 || !truthyVar(m, "canmove") || truthyVar(m, "lying") || truthyVar(m, "handcuffed") || truthyVar(m, "in_throw_mode") || truthyVar(m, "pulledby")) return [];
	const suit = live(m.getVar("wear_suit")), gloves = live(m.getVar("gloves")), dna = live(m.getVar("dna"));
	if (suit instanceof DMObject && truthyVar(suit, "breakouttime")) return [];
	if (gloves instanceof DMObject && procFrom(gloves, "Touch") !== "/obj/item/clothing/gloves") return [];
	const muts = dna instanceof DMObject ? live(dna.getVar("mutations")) : null;
	if (muts instanceof DMList && muts.items.some((x) => { const u = live(x); return u instanceof DMObject && procFrom(u, "on_attack_hand") !== "/datum/mutation/human"; })) return [];
	const hand = Number(live(m.getVar("active_hand_index"))), held = live(m.getVar("held_items")), hands = live(m.getVar("hand_bodyparts"));
	if (!(held instanceof DMList) || !(hands instanceof DMList) || !(hand >= 1) || live(held.items[hand - 1] ?? null) !== null || !(live(hands.items[hand - 1] ?? null) instanceof DMObject)) return [];
	const out: [DMAtom, number, number, string, string][] = [];
	for (let dy = -PRED_R; dy <= PRED_R; dy++) for (let dx = -PRED_R; dx <= PRED_R; dx++) {
		const n = vm.map.turfAt(t.x + dx, t.y + dy, t.z);
		if (!n) continue;
		for (const o of n.contents) {
			if (o.kind !== Kind.Obj || !o.type.path.startsWith("/obj/item") || procFrom(o, "attack_hand") !== "/obj/item") continue;
			if (truthyVar(o, "anchored") || truthyVar(o, "throwing") || (Number(live(o.getVar("resistance_flags"))) & ON_FIRE) || Number(live(o.getVar("acid_level"))) > 20) continue;
			const layer = Number(live(o.getVar("layer"))); // IsObscured: a dense PREVENT_CLICK_UNDER thing above it (a door, a full-tile window)
			if (n.contents.some((b) => b !== o && (Number(live(b.getVar("flags"))) & PREVENT_CLICK_UNDER) && truthyVar(b, "density") && Number(live(b.getVar("layer"))) > layer)) continue;
			const file = resolveIconPath(o.getVar(hand % 2 === 0 ? "righthand_file" : "lefthand_file")), st = live(o.getVar("item_state")) || live(o.getVar("icon_state"));
			out.push([o, dx, dy, file ?? "", typeof st === "string" ? st : ""]);
		}
	}
	return out;
}
const NODROP = 2, ABSTRACT = 128, DROPDEL = 16384, NODECONSTRUCT = 128; // NODECONSTRUCT on structures, ABSTRACT on items: the same bit
/** Predicted put-down: what the item in the active hand of mob `m` would surely do, or null. drop: the drop key (client/Northwest -> drop_item:
 *  doUnEquip puts it on the mob's tile at its initial layer and plane). on: the tables and racks on turfs within PRED_R that a plain left click
 *  with it would put it on (ClickOn -> melee_attack_chain -> table/rack attackby: not harm intent, no tool that takes them apart, not a full tray),
 *  bar the reach (the page checks it) and next_move; a table centres it on the click (centre 1). As pickOf: storage, ABSTRACT, NODROP and DROPDEL
 *  items aren't guessed. */
export function putOf(vm: VM, m: unknown): { item: DMObject; layer: number; plane: number; icon: string; state: string; on: [DMAtom, number, number, number][] } | null {
	if (!(m instanceof DMAtom) || m.kind !== Kind.Mob || !m.type.path.startsWith("/mob/living/carbon/human")) return null;
	const t = m.loc;
	if (!t || t.kind !== Kind.Turf || procFrom(m, "ClickOn") !== "/mob" || procFrom(t, "allow_drop") !== "/atom") return null;
	if (live(m.getVar("stat")) !== 0 || !truthyVar(m, "canmove") || truthyVar(m, "handcuffed") || truthyVar(m, "in_throw_mode") || truthyVar(m, "pulledby")) return null;
	const suit = live(m.getVar("wear_suit"));
	if (suit instanceof DMObject && truthyVar(suit, "breakouttime")) return null;
	const hand = Number(live(m.getVar("active_hand_index"))), held = live(m.getVar("held_items")), I = held instanceof DMList && hand >= 1 ? live(held.items[hand - 1] ?? null) : null;
	if (!(I instanceof DMObject) || !I.type.path.startsWith("/obj/item") || I.type.path.startsWith("/obj/item/weapon/storage/bag/tray") || (Number(live(I.getVar("flags"))) & (NODROP | ABSTRACT | DROPDEL))) return null;
	const file = resolveIconPath(I.getVar(hand % 2 === 0 ? "righthand_file" : "lefthand_file")), st = live(I.getVar("item_state")) || live(I.getVar("icon_state"));
	const out = { item: I, layer: Number(vm.initialOf(I, "layer")), plane: Number(vm.initialOf(I, "plane")), icon: file ?? "", state: typeof st === "string" ? st : "", on: [] as [DMAtom, number, number, number][] };
	if (live(m.getVar("a_intent")) === "harm" || procFrom(I, "melee_attack_chain") !== "/obj/item" || procFrom(I, "pre_attackby") !== "/obj/item") return out;
	const p = I.type.path, isTool = p.startsWith("/obj/item/weapon/wrench") || p.startsWith("/obj/item/weapon/screwdriver");
	for (let dy = -PRED_R; dy <= PRED_R; dy++) for (let dx = -PRED_R; dx <= PRED_R; dx++) {
		const n = vm.map.turfAt(t.x + dx, t.y + dy, t.z);
		if (!n) continue;
		for (const o of n.contents) {
			const by = o.kind === Kind.Obj ? procFrom(o, "attackby") : undefined;
			let centre: number;
			if (by === "/obj/structure/table" || (by === "/obj/structure/table/reinforced" && !p.startsWith("/obj/item/weapon/weldingtool"))) {
				if (isTool && truthyVar(o, "deconstruction_ready") && !(Number(live(o.getVar("flags"))) & NODECONSTRUCT)) continue;
				centre = 1;
			} else if (by === "/obj/structure/rack") {
				if (p.startsWith("/obj/item/weapon/wrench") && !(Number(live(o.getVar("flags"))) & NODECONSTRUCT)) continue;
				centre = 0;
			} else continue;
			const layer = Number(live(o.getVar("layer"))); // IsObscured, as pickOf
			if (n.contents.some((b) => b !== o && (Number(live(b.getVar("flags"))) & PREVENT_CLICK_UNDER) && truthyVar(b, "density") && Number(live(b.getVar("layer"))) > layer)) continue;
			out.on.push([o, dx, dy, centre]);
		}
	}
	return out;
}

// The look vars buildAppearance reads (appearance.ts rawVarsOf). An object whose values are all the same
// (===) as last tick, with the same overlay/underlay entries, has the same appearance. Overlay entries are
// frozen snapshots (vm/appearances.ts), so comparing them by identity is enough.
// ponytail: a /matrix or /icon datum edited in place after being assigned isn't seen until another look var
// changes (BYOND copies transform on assignment; tg assigns fresh matrices). A page resync picks it up.
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
	private pOpq = "";
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
		const apps: [number, BuiltAppearance][] = [];
		let sweeping = false; // true while checking a tile nobody marked
		const idOf = (o: DMObject): number => {
			let s = this.sent.get(o);
			let fresh = false;
			if (!s) { this.sent.set(o, (s = { id: this.nextId++, gen, sig: [], n: 0 })); fresh = true; if (o instanceof DMAtom && o.kind === Kind.Area) this.areas.add(o); }
			else if (s.gen === gen) return s.id; // an area on many tiles: checked once per update
			s.gen = gen;
			if (refreshSig(o, s.sig)) {
				if (sweeping && !fresh) this.warn(`${o.type.path} ${firstChanged}`);
				const ap = buildAppearance(o);
				if (this.imgs.has(o)) ap.mouseOpacity = 0;
				apps.push([s.id, ap]);
				if (this.logAnim && ap.overlays.some((l) => l.iconState === "opening" || l.iconState === "closing")) { // pt-d: airlocks animate through overlays, not flick()
					const key = `${o.type.path} overlay ${ap.overlays.map((l) => l.iconState).join("+")}`;
					if (!this.animSeen.has(key)) { this.animSeen.add(key); this.logAnim(`${key} (world.time ${vm.sched.time})`); }
				}
			}
			return s.id;
		};
		const cv = clientSeen(vm, c);
		const { view, sight, eyeTile } = cv;
		this.imgs = cv.imgs;
		const csFlags = cv.cs ? cv.cs.flags : -1, csSelf = cv.cs ? cv.cs.self : null;
		if (!scan && (!eyeTile || eyeTile.z !== this.tileZ || cv.mob !== this.pMob || cv.seeInv !== this.pSeeInv || csFlags !== this.pFlags || csSelf !== this.pSelf)) scan = true; // everything may differ

		// Map tiles around the eye.
		const tiles: [number, number, number[]][] = [];
		const moved: ViewUpdate["moved"] = [];
		const newZ = !!eyeTile && eyeTile.z !== this.tileZ;
		if (newZ) { this.tiles.clear(); this.tileZ = eyeTile!.z; }
		const keep = new Set<number>();
		const objs: DMObject[] = [];
		const gone: number[] = [];
		const cands: DMObject[] = []; // objects that lost a tile: gone if they are on none now
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
				if (sweeping) this.warn(`${vm.map.turfAt(tx, ty, cv.eyeTile!.z)?.type.path} contents`);
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
			for (const [k, a] of cv.imgsAt) { const b = pi.get(k); if (!b || b.length !== a.length || a.some((o, i) => o !== b[i])) dirty.add(k); }
			for (const k of pi.keys()) if (!cv.imgsAt.has(k)) dirty.add(k);
			for (const k of dirty) doTile(k % 65536, Math.floor(k / 65536));
			// The safety sweep: a slice of the rest of the box, to catch a change nobody marked.
			const bw = box[1] - box[0] + 1, total = bw * (box[3] - box[2] + 1), cnt = Math.min(total, Math.ceil(total / SWEEP_EVERY));
			sweeping = true;
			for (let j = 0; j < cnt; j++) {
				const idx = (this.sweepAt + j) % total, k = box[0] + (idx % bw) + (box[2] + Math.floor(idx / bw)) * 65536;
				if (!dirty.has(k)) doTile(k % 65536, Math.floor(k / 65536));
			}
			sweeping = false;
			this.sweepAt = (this.sweepAt + cnt) % total;
			for (const a of this.areas) idOf(a); // an area's look marks no tile: re-checked every update
			for (const im of cv.imgs) { const s = this.sent.get(im); if (s && s.n > 0) idOf(im); } // /image datums aren't atoms: re-checked every update
		}
		this.pBox = box; this.pImgsAt = cv.imgsAt; this.pMob = cv.mob; this.pSeeInv = cv.seeInv; this.pFlags = csFlags; this.pSelf = csSelf;
		this.pVis = cv.cs;

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

		if (scan) for (const [o, s] of this.sent) { if (s.gen !== gen) { gone.push(s.id); this.sent.delete(o); this.pos.delete(o); this.areas.delete(o); } }
		else for (const o of cands) { const s = this.sent.get(o); if (s && s.n <= 0 && s.gen !== gen) { gone.push(s.id); this.sent.delete(o); this.pos.delete(o); this.areas.delete(o); } }
		this.screenObjs = screenObjs;
		// What the movement keys move (your mob, the AI's eye) and where it may step. One the client doesn't see (the AI eye is invisible) goes as
		// MOVER_ID, its step from the eye's last tile added to moved: the page glides it and the camera with it, predicted or not.
		const mover = predMover(vm, c), free = predOf(vm, mover, eyeTile), run = free ? predRunOf(mover) : null;
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
		if (scan && this.dirty) { // counts and the area list from scratch
			for (const s of this.sent.values()) s.n = 0;
			for (const l of this.tiles.values()) for (const o of l) this.sent.get(o)!.n++;
			this.areas.clear();
			for (const o of this.sent.keys()) if (o instanceof DMAtom && o.kind === Kind.Area) this.areas.add(o);
			this.myMarks.clear();
			this.sweepAt = 0;
		}
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
		const op = cv.cs?.opaque, opq: Opq | [] = op ? packOpacity(cv.cs!.x0, cv.cs!.y0, cv.cs!.w, op.length / cv.cs!.w, op, cv.cs!.vis) : [], opqKey = opq.join();
		const opqChanged = full ? opq.length > 0 : opqKey !== this.pOpq;
		this.pOpq = opqKey;
		return {
			seq: ++this.seq, full, worldTime: vm.sched.time, key: c.getVar("key"), view, baseView: baseViewOf(vm, c), eyeTile, sight,
			apps, gone, tiles, moved, screen: full || screenChanged ? entries : null,
			pred: mobId !== undefined ? [mobId, free, ...predImgs] : null,
			...(run ? { predRun: run } : {}),
			...(free && predTurnOf(mover) ? { predTurn: 1 as const } : {}),
			...(pick.length ? { pick } : {}),
			...(put ? { put } : {}),
			...(pl && plId !== undefined ? { pull: [plId, pl.ox, pl.oy, pl.dense] as [number, number, number, number] } : {}),
			...(anims ? { anims } : {}),
			...(stepsDone ? { steps: stepsDone } : {}),
			...(offChanged ? { off } : {}),
			...(hudChanged ? { hud } : {}),
			...(lightChanged ? { light } : {}),
			...(opqChanged ? { opq } : {}),
			...((full || newZ) && eyeTile ? { icons: zIcons(vm, eyeTile.z) } : {}),
		};
	}
}

const invisible = (a: DMObject): number => { const v = a.getVar("invisibility"); return typeof v === "number" ? v : 0; };
