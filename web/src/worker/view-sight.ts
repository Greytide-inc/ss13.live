// view-sight - What a client can see: the eye's tile, the view box, line of sight (clientSight) and the
// wider union a predicting page gets (sight pop-in), plus which objects on a tile it sees (seenOn).
// Split out of client-view.ts; the view updates (ViewDiffer) and the test dump use it.

import type { VM } from "../vm/interpreter.js";
import { DMList, DMObject, live } from "../vm/objects.js";
import { DMAtom, Kind, SEE_MOBS, SEE_OBJS, SEE_THRU, SEE_TURFS, SIGHT_BLIND } from "../vm/world.js";
import { stress, stressNoteLos } from "../vm/stress-log.js";
import { computeLos, subLosBox, viewSight, type LosBox } from "../vm/view-los.js";
import { buildAppearance } from "../appearance/appearance.js";
import { PRED_R, PRED_W, predMover, predOf } from "./view-predict.js";
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
export function viewAround(vm: VM, c: DMObject): { eyeTile: { x: number; y: number; z: number } | null; viewTiles: Tile[] } {
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
	/** predOf's free square, when clientSeen worked it out for the union (else undefined) */
	free?: number;
}

/** the client's mob is tg's lobby mob (new_player): the page shows the lobby picture over the view */
export function inLobby(c: DMObject): boolean { const m = live(c.getVar("mob")); return m instanceof DMObject && m.type.path === "/mob/dead/new_player"; }

let cfgVm: VM | null = null, cfgIdx = -1;
/** the view this client gets unzoomed (client.default_view): config's default_view when widescreen, else default_view_square. The page lays the HUD out against it. */
export function baseViewOf(vm: VM, c: DMObject): unknown {
	if (cfgVm !== vm) { cfgVm = vm; cfgIdx = vm.tree.globalNames.indexOf("config"); }
	const cfg = cfgIdx >= 0 ? live(vm.globals[cfgIdx]) : null;
	if (!(cfg instanceof DMObject)) return null;
	const prefs = live(c.getVar("prefs"));
	const wide = !inLobby(c) && (!(prefs instanceof DMObject) || !!live(prefs.getVar("widescreenpref")));
	return live(cfg.getVar(wide ? "default_view" : "default_view_square"));
}

/** Sight pop-in: the last unionExtra per client, kept while nothing it was worked out from changes */
export interface UnionCache { key: string; vis: Uint8Array; at?: UnionAt }
/** per tile unionExtra looked from, by world tile (unionAtKey): its sub-box's opacity and the line of sight worked out from it. A step moves
 *  the eye one tile, so most of the up to 24 tiles were looked from last time: kept while their walls are the same, ~4x less work a step. */
export type UnionAt = Map<number, { opaque: Uint8Array; vis: Uint8Array }>;
const unionAtKey = (x: number, y: number, z: number) => x + 1024 * (y + 1024 * z);

/** union: a ViewDiffer's update for a predicting page (sight-pop-in step 3): cs.vis becomes the tiles seen from any tile the page may step to
 *  (own | unionExtra), cs.own the eye's own. Off for buildClientView, so `?check=1` compares what the page draws. */
export function clientSeen(vm: VM, c: DMObject, union?: UnionCache): ClientSeen {
	const view = live(c.getVar("view"));
	const m = live(c.getVar("mob"));
	const sight = m instanceof DMObject ? Object.fromEntries(["see_invisible", "see_in_dark", "sight"].map((k) => [k, live(vm.getField(m, k))])) : null;
	const seeInv = typeof sight?.see_invisible === "number" ? sight.see_invisible : SEE_INVISIBLE_LIVING; // pt-d: the mob's own level (a ghost sees 60, so it sees itself)
	const eyeTile = eyeTileOf(vm, c.getVar("eye")); // the outermost container's turf
	const [vx, vy] = viewRadius(view);
	const ring = vm.clients.predicts(c) ? 1 + PRED_R : 1;
	// client.images whose loc is an atom or turf shown this update, by the tile they are drawn on (the atom's outermost turf). Only those in the
	// box the update sends (the view plus its ring): an AI has thousands on its z level, and keeping them all made new garbage every update.
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
			if (typeof tx !== "number" || typeof ty !== "number" || Math.abs(tx - eyeTile.x) > vx + ring || Math.abs(ty - eyeTile.y) > vy + ring) continue;
			const k = tx + ty * 65536;
			let arr = imgsAt.get(k);
			if (!arr) imgsAt.set(k, (arr = []));
			arr.push(im);
			imgs.add(im);
		}
	}
	const cs = eyeTile ? clientSight(vm, eyeTile, vx, vy, m, ring) : null; // los1
	const cv: ClientSeen = { eyeTile, view, vx, vy, ring, mob: m, sight, seeInv, cs, imgsAt, imgs };
	if (union && popInSight(cv)) {
		const free = cv.free = predOf(vm, predMover(vm, c), eyeTile), b = cs!.box!;
		if (free) {
			const key = `${eyeTile!.x},${eyeTile!.y},${eyeTile!.z},${free},${vx},${vy},${hashOpaque(b.opaque)}`; // light isn't in it: a flickering lamp costs nothing
			if (union.key !== key) { union.key = key; const at: UnionAt = new Map(); union.vis = unionExtra(b, free, vx, vy, ring, eyeTile!, union.at, at); union.at = at; }
			cs!.own = cs!.vis; cs!.vis = cs!.vis.map((v, k) => v | union.vis[k]);
		}
	}
	return cv;
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
export interface ClientSight { x0: number; y0: number; w: number; vis: Uint8Array; flags: number; self: DMObject | null; opaque: Uint8Array | null; box: LosBox | null; own?: Uint8Array }

const SEE_SELF = 32, XRAY = SEE_MOBS | SEE_OBJS | SEE_TURFS;
/** Sight pop-in: the page works out sight itself from the tile it has stepped to: a predicting page, a box of opacity, no x-ray sight
 *  (with mesons or thermals the hidden tiles still show some things, which the page can't sort out) */
export const popInSight = (cv: ClientSeen): boolean => cv.ring > 1 && !!cv.cs?.box && (cv.cs.flags & XRAY) === 0;

/** How many steps ahead the union looks: the page draws up to PRED_R ahead, but a 3rd only when the ping is longer than two steps' time; each
 *  step out about doubles the cost (2 steps: ~0.4 ms when the eye moves, Box/Meta, sight-pop-in step 3). */
export const UNION_R = 2;
/** The tiles of box b (eye in the middle, `ring` = 1 + PRED_R tiles beyond the view) in line of sight from any tile the page may step
 *  to, the eye's own left out (its sight, light and all, is ClientSight.vis): reachable through predOf's free square in up to UNION_R steps, a
 *  diagonal only when both straight steps are free (live-move.ts drawNext). From each, line of sight over its view plus the 1-tile glide
 *  ring (light left out: ~2x faster, and the page applies it, sight-pop-in step 4). eye: b's eye in the world; a tile's sight found in `lastAt`
 *  with the same walls is reused, and every tile looked from goes into `nextAt` (UnionAt). */
export function unionExtra(b: LosBox, free: number, vx: number, vy: number, ring: number, eye?: { x: number; y: number; z: number }, lastAt?: UnionAt, nextAt?: UnionAt): Uint8Array {
	const ok = (dx: number, dy: number) => Math.abs(dx) <= PRED_R && Math.abs(dy) <= PRED_R && Math.floor(free / 2 ** ((dy + PRED_R) * PRED_W + dx + PRED_R)) % 2 === 1;
	const out = new Uint8Array(b.w * b.h), seen = new Set<number>([0]);
	let front: [number, number][] = [[0, 0]];
	for (let d = 0; d < UNION_R && front.length; d++) {
		const next: [number, number][] = [];
		for (const [x, y] of front) for (let sy = -1; sy <= 1; sy++) for (let sx = -1; sx <= 1; sx++) {
			const nx = x + sx, ny = y + sy, k = nx + ny * 64;
			if ((!sx && !sy) || seen.has(k) || !ok(nx, ny) || (sx && sy && !(ok(x + sx, y) && ok(x, y + sy)))) continue;
			seen.add(k); next.push([nx, ny]);
			const sub = subLosBox(b, b.ex + nx, b.ey + ny, vx + 1, vy + 1, true), vw = 2 * (vx + 1) + 1;
			const at = eye ? unionAtKey(eye.x + nx, eye.y + ny, eye.z) : 0, old = lastAt?.get(at);
			let v: Uint8Array;
			if (old && sameBytes(old.opaque, sub.opaque)) v = old.vis;
			else { const los = computeLos(sub, 0, true, true); v = new Uint8Array(los.length); for (let k = 0; k < los.length; k++) v[k] = los[k] ? 1 : 0; }
			nextAt?.set(at, old && v === old.vis ? old : { opaque: sub.opaque.slice(), vis: v });
			for (let j = 0; j < v.length / vw; j++) for (let i = 0; i < vw; i++) if (v[i + j * vw]) out[ring - 1 + nx + i + (ring - 1 + ny + j) * b.w] = 1;
		}
		front = next;
	}
	return out;
}
const sameBytes = (a: Uint8Array, b: Uint8Array): boolean => {
	if (a.length !== b.length) return false;
	for (let k = 0; k < a.length; k++) if (a[k] !== b[k]) return false;
	return true;
};
/** FNV-1a over a box's opacity */
function hashOpaque(o: Uint8Array): number {
	let h = 2166136261;
	for (let k = 0; k < o.length; k++) h = Math.imul(h ^ o[k], 16777619);
	return h >>> 0;
}

export function clientSight(vm: VM, eyeTile: { x: number; y: number; z: number }, rx: number, ry: number, mob: unknown, ring = 1): ClientSight | null {
	const m = live(mob as never);
	const num = (k: string) => { const v = m instanceof DMAtom ? vm.getField(m, k) : null; return typeof v === "number" ? v : 0; };
	const flags = num("sight"), sid = num("see_in_dark");
	const self = m instanceof DMAtom && m.kind === Kind.Mob ? m : null;
	if ((flags & XRAY) === XRAY) return null; // sees everything in range (a ghost)
	const w = 2 * (rx + ring) + 1, h = 2 * (ry + ring) + 1, x0 = eyeTile.x - rx - ring, y0 = eyeTile.y - ry - ring;
	let vis: Uint8Array = new Uint8Array(w * h);
	const ct = vm.map.turfAt(eyeTile.x, eyeTile.y, eyeTile.z);
	let opaque: Uint8Array | null = null, lbox: LosBox | null = null;
	if (ct && !(flags & SIGHT_BLIND)) {
		const { box } = vm.map.losBox(ct, rx + ring, ry + ring, (flags & SEE_THRU) !== 0, false);
		const t0 = stress.on ? performance.now() : 0;
		opaque = box.opaque; lbox = box;
		vis = viewSight(box, box.ex, box.ey, rx, ry, ring, sid);
		if (stress.on) { stressNoteLos(performance.now() - t0, "view-sight.ts clientSight (x2 computeLos)"); }
	}
	return { x0, y0, w, vis, flags, self: flags & SEE_SELF ? self : null, opaque, box: lbox };
}

export const invisible = (a: DMObject): number => { const v = a.getVar("invisibility"); return typeof v === "number" ? v : 0; };
