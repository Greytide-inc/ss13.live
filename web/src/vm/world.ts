// The world model: atoms, the turf grid, areas, loc/contents, and the spatial helpers
// behind get_step/get_dir/locate/block/range/view/get_step_to. Movement itself (Move, Enter, Exit,
// Cross, Bump...) is DM code in the patched DMStandard (web/opendream-patches/0002), which calls
// into this through `loc` writes and the natives. BYOND 511 behaviour measured in
// web/tests/dm/world.dm; anything else is marked "unverified".
//
// Data structures:
//  - GameMap.grid: one slot per (x, y, z), index (x-1) + (y-1)*maxx + (z-1)*maxx*maxy. A turf keeps
//    its DMAtom object for its whole life: `new /turf/T(old)` re-types the same object in place
//    (measured: old references then see the new turf), so turf refs never go stale.
//  - DMAtom.contents: the movables directly inside an atom, in BYOND's order: objs (and plain
//    movables) in arrival order, then mobs in arrival order. `atom.contents` in DM is a ContentsList
//    sharing this array, so it's live.
//  - Area.areaTurfSet: the area's turfs; sortedAreaTurfs() gives them in map order (z, then y, then x). An area's `contents`
//    is built on read: each turf followed by that turf's contents (measured order).
//  - GameMap.atoms: every atom not deleted, in creation order (world enumeration, locate(T) in world).
//    BYOND's refcounting GC drops unreferenced atoms (e.g. a movable moved to null with no vars
//    pointing at it); we have no GC yet, so such atoms stay listed.

import { decRef, incRef } from "./gc.js";
import { DMList, DMObject, EMPTY_ITEMS, live, releaseRefs } from "./objects.js";
import type { DMType } from "./objtree.js";
import { DMRuntimeError, type Value } from "./value.js";
import { stress, stressNoteLos } from "./stress-log.js";
import { computeLos, newLosBox, scratchLosBox, type LosBox } from "./view-los.js";

/** mob.sight bits BYOND's view() looks at (los1, measured). */
export const SIGHT_BLIND = 1, SEE_MOBS = 4, SEE_OBJS = 8, SEE_TURFS = 16, SEE_THRU = 512;
const SIGHT_XRAY = SEE_MOBS | SEE_OBJS | SEE_TURFS;
const num0 = (v: Value): number => (typeof v === "number" ? v : 0);
// view() reads these for every atom in range: one Map lookup for the instance's own value, the type's from a cache.
const losInit = (ty: DMType): [number, number] => (ty.losInit ??= [num0(ty.vars.get("opacity") ?? null), num0(ty.vars.get("luminosity") ?? null)]);
function opacityOf(a: DMObject): number { const v = a.ownVar("opacity"); return v !== undefined ? num0(v) : losInit(a.type)[0]; }
function luminosityOf(a: DMObject): number { const v = a.ownVar("luminosity"); return v !== undefined ? num0(v) : losInit(a.type)[1]; }

export const enum Kind {
	Area = 1,
	Turf = 2,
	Obj = 3,
	Mob = 4,
	/** /atom/movable itself or another direct movable subtype */
	Movable = 5,
	/** /atom itself */
	Atom = 6,
}

export const NORTH = 1, SOUTH = 2, EAST = 4, WEST = 8, UP = 16, DOWN = 32;

/** The look vars the view update compares (the differ's signature, worker/client-view.ts) plus the two lists:
 *  a write to one of these on an atom changes its picture, so it marks the atom's turf (view-dirty). */
export const LOOK_VARS_SIG = ["icon", "icon_state", "dir", "layer", "plane", "color", "alpha", "transform", "pixel_x", "pixel_y", "pixel_z", "pixel_w", "invisibility",
	"blend_mode", "appearance_flags", "mouse_opacity", "maptext", "maptext_width", "maptext_height", "maptext_x", "maptext_y"];
const MARK_NAMES = new Set([...LOOK_VARS_SIG, "overlays", "underlays"]);

/** view-dirty: the turfs whose picture may have changed since the owner (the client view) last emptied this.
 *  null = off (boots, snapshots, the server). One set for the process: only one VM's view is sent at a time. */
const markSets: Set<DMAtom>[] = [];
/** What the choke points add to: null when no ViewDiffer is watching (the hot paths test only this), else an object
 *  that adds the turf to every registered set. */
let marks: { add(t: DMAtom): void } | null = null;
const markAll = { add(t: DMAtom): void { for (let i = 0; i < markSets.length; i++) markSets[i].add(t); } };
/** A ViewDiffer starts collecting marked turfs in its own set (it clears its set itself after each update). */
export function registerViewMarks(s: Set<DMAtom>): void {
	if (!markSets.includes(s)) markSets.push(s);
	marks = markAll;
}
export function unregisterViewMarks(s: Set<DMAtom>): void {
	const i = markSets.indexOf(s);
	if (i >= 0) markSets.splice(i, 1);
	if (markSets.length === 0) marks = null;
}
export function viewMarksOn(): boolean {
	return marks !== null;
}
/** Marks the turf a changed atom shows on: itself for a turf, its loc for something directly on a turf.
 *  An area, or something inside a container, marks nothing. Call only when `marks !== null`. */
export function markTurfOf(a: DMAtom): void {
	if (a.kind === Kind.Turf) marks!.add(a);
	else {
		const l = a.loc;
		if (l !== null && l.kind === Kind.Turf) marks!.add(l);
	}
}

export class DMAtom extends DMObject {
	override setVar(name: string, v: Value): void {
		if (marks !== null && MARK_NAMES.has(name)) markTurfOf(this);
		super.setVar(name, v);
	}
	loc: DMAtom | null = null;
	/** Movables directly inside: objs in arrival order, then mobs. Shared with the ContentsList view. */
	contents: DMAtom[] = EMPTY_ITEMS as DMAtom[];
	/** Turfs only: grid position. */
	x = 0;
	y = 0;
	z = 0;
	/** Areas only: their turfs in map order. */
	/** Areas only: the area's turfs. Unordered; `sortedAreaTurfs()` gives map order. */
	areaTurfSet: Set<DMAtom> | null = null;
	private sortedTurfs: DMAtom[] | null = null;
	/** Areas only: the turfs in map order (z, then y, then x), cached until the area changes. */
	sortedAreaTurfs(): DMAtom[] {
		return (this.sortedTurfs ??= [...this.areaTurfSet!].sort((a, b) => a.z - b.z || a.y - b.y || a.x - b.x));
	}
	private firstTurf: DMAtom | null | undefined = undefined;
	/** Areas only: the turf that gives the area its x/y/z, the first in map order (lowest z, then y, then x;
	 * measured, reference/byond-quirk-tests/q6-area), or null with no turfs. A linear scan, cached like sortedAreaTurfs. */
	firstAreaTurf(): DMAtom | null {
		if (this.firstTurf !== undefined) return this.firstTurf;
		if (this.sortedTurfs) return (this.firstTurf = this.sortedTurfs[0] ?? null);
		let f: DMAtom | null = null;
		for (const t of this.areaTurfSet!) if (!f || (t.z - f.z || t.y - f.y || t.x - f.x) < 0) f = t;
		return (this.firstTurf = f);
	}
	areaTurfsChanged(): void {
		this.sortedTurfs = null;
		this.firstTurf = undefined;
	}
	contentsView: ContentsList | null = null;

	constructor(type: DMType, readonly kind: Kind) {
		super(type);
		if (kind === Kind.Area) this.areaTurfSet = new Set();
	}

	get isMovable(): boolean {
		return this.kind === Kind.Obj || this.kind === Kind.Mob || this.kind === Kind.Movable;
	}
}

/** coords() of an area with no turfs: BYOND reads its x/y/z as null. */
const NO_COORDS: readonly Value[] = [null, null, null];

export function isAtom(v: Value): v is DMAtom {
	return v instanceof DMAtom && !v.deleted;
}

export function isTurf(v: Value): v is DMAtom {
	return v instanceof DMAtom && v.kind === Kind.Turf && !v.deleted;
}


/** rangeList's working array (see there). */
/** a view size (client.view, world.view, a view()/range() Dist) as half-sizes [x, y]: a number n is n both
 *  ways, "WxH" text is (W-1)/2 by (H-1)/2 (19x15 -> 9, 7). null if it is neither. */
export function viewHalfSize(v: unknown): [number, number] | null {
	if (typeof v === "number") { const n = Math.trunc(v); return [n, n]; }
	const m = typeof v === "string" ? /^(\d+)x(\d+)$/.exec(v) : null;
	return m ? [Math.floor((+m[1] - 1) / 2), Math.floor((+m[2] - 1) / 2)] : null;
}

/** a view size as BYOND keeps it (measured for world.view, interpreter.ts; tg #33324's config notes the same
 *  for client.view): a square odd "WxW" text size reads back as the number (W-1)/2 ("15x15" is 7); anything else is kept. */
export function normalizeViewSize(v: Value): Value {
	const m = typeof v === "string" ? /^(\d+)x(\d+)$/.exec(v) : null;
	return m && m[1] === m[2] && Number(m[1]) % 2 === 1 ? (Number(m[1]) - 1) / 2 : v;
}

const rangeScratch: Value[] = [];
const areaScratch: DMAtom[] = [];
function done(out: DMList, items: Value[], pick: ((a: DMAtom) => boolean) | null = null): DMList {
	out.adopt(pick ? items.filter((x) => x instanceof DMAtom && pick(x)) : items.slice());
	items.length = 0;
	return out;
}

/**
 * `atom.contents` for turfs, objs and mobs: a live view. Measured: `contents += A` and `-= A` move A
 * like a direct `loc` write (no Enter/Entered calls). Other writes are unverified.
 */
export class ContentsList extends DMList {
	constructor(readonly owner: DMAtom, readonly map: GameMap) {
		super(owner.contents, true);
		this.viewTarget = owner;
	}
	override add(v: Value): void {
		if (v instanceof DMList) {
			for (const x of v.items.slice()) this.add(live(x));
			return;
		}
		if (v instanceof DMAtom && v.isMovable && !v.deleted) this.map.setLoc(v, this.owner);
	}
	override push(v: Value): void {
		this.add(v);
	}
	override remove(v: Value): boolean {
		if (v instanceof DMList) {
			let any = false;
			for (const x of v.items.slice()) if (this.remove(live(x))) any = true;
			return any;
		}
		if (v instanceof DMAtom && v.loc === this.owner) {
			this.map.setLoc(v, null);
			return true;
		}
		return false;
	}
	override removeOne(v: Value): boolean {
		return this.remove(v);
	}
	override cut(from: number, to: number): void {
		for (const a of this.items.slice(from, to)) this.map.setLoc(a as DMAtom, null);
	}
	override insert(_at: number, vals: Value[]): void {
		for (const v of vals) this.add(v);
	}
	override set(_index: Value, _v: Value): void {
		throw new DMRuntimeError("cannot write to contents list"); // unverified wording
	}
	override setLen(_n: number): void {
		throw new DMRuntimeError("cannot change the length of a contents list"); // unverified wording
	}
}

/**
 * `area.contents`: built on read (not live). `+= turf` moves the turf into the area (measured);
 * `-= turf` does nothing (a turf is always in some area; unverified).
 */
export class AreaContentsList extends DMList {
	/** Built on first use: `area.contents += T` alone never needs the (possibly huge) list. */
	built: Value[] | null = null;
	constructor(readonly owner: DMAtom, readonly map: GameMap) {
		super([], true);
		this.viewTarget = owner;
		delete (this as { items?: Value[] }).items; // use the lazy accessor below
	}
	override add(v: Value): void {
		if (v instanceof DMList) {
			for (const x of v.items.slice()) this.add(live(x));
			return;
		}
		if (isTurf(v)) this.map.setArea(v, this.owner);
		else if (v instanceof DMAtom && v.isMovable) this.map.setLoc(v, this.owner);
		this.built = null;
	}
	override push(v: Value): void {
		this.add(v);
	}
	override remove(_v: Value): boolean {
		return false;
	}
	override removeOne(v: Value): boolean {
		return this.remove(v);
	}
}

Object.defineProperty(AreaContentsList.prototype, "items", {
	get(this: AreaContentsList) {
		return (this.built ??= this.map.areaContents(this.owner));
	},
	set(this: AreaContentsList, v: Value[]) {
		this.built = v;
	},
});

/** Hooks the map needs from the VM (object creation runs DM procs). */
export interface MapHost {
	/** Creates a turf object of `type` (no procs run). */
	allocAtom(type: DMType): DMAtom;
	/** Runs (init) and New() on a freshly placed atom, to completion. */
	initAtom(a: DMAtom, args: Value[]): void;
	/** Runs Del() on an atom that is about to be replaced (turf replacement). */
	delAtom(a: DMAtom): void;
	worldTurfType(): DMType | null;
	worldAreaType(): DMType | null;
}

export class GameMap {
	maxx = 0;
	maxy = 0;
	maxz = 0;
	private grid: (DMAtom | null)[] = [];
	/** Map-loader areas: one instance per type. */
	readonly areaByType = new Map<DMType, DMAtom>();
	/** Every atom not deleted, in creation order. Change it only through addAtom/removeAtom. */
	readonly atoms = new Set<DMAtom>();
	/** The same atoms split by kind (creation order within each), so `for(var/area/A in world)` doesn't walk every obj. */
	private readonly byKind = new Map<Kind, Set<DMAtom>>();

	/** Objs and direct /atom/movable instances together, in creation order (they share BYOND's obj id space). */
	private readonly objLike = new Set<DMAtom>();

	addAtom(a: DMAtom): void {
		this.atoms.add(a);
		let s = this.byKind.get(a.kind);
		if (!s) this.byKind.set(a.kind, (s = new Set()));
		s.add(a);
		if (a.kind === Kind.Obj || a.kind === Kind.Movable) this.objLike.add(a);
	}

	removeAtom(a: DMAtom): void {
		this.atoms.delete(a);
		this.byKind.get(a.kind)?.delete(a);
		this.objLike.delete(a);
	}

	/**
	 * The atoms a world loop filtered to `kind` can see: just that kind's set for areas, turfs, objs
	 * and mobs. Measured (BYOND 511): /atom and untyped loops go mobs, then objs and plain movables
	 * (interleaved, creation order), then areas, then turfs; /atom/movable is the first two. Creation
	 * order within each. This matters: SSatoms' `for(var/atom/A in world)` initializes an obj before
	 * the turf it sits on, whose Initialize() calls Entered() on it.
	 */
	atomsOfKind(kind: Kind | 0): Iterable<DMAtom> {
		if (kind === Kind.Area || kind === Kind.Turf || kind === Kind.Obj || kind === Kind.Mob) return this.byKind.get(kind) ?? [];
		const mobs = this.byKind.get(Kind.Mob) ?? [];
		if (kind === Kind.Movable) return chain(mobs, this.objLike);
		return chain(mobs, this.objLike, this.byKind.get(Kind.Area) ?? [], this.byKind.get(Kind.Turf) ?? []);
	}

	constructor(readonly host: MapHost) {}

	turfAt(x: number, y: number, z: number): DMAtom | null {
		x = Math.trunc(x);
		y = Math.trunc(y);
		z = Math.trunc(z);
		if (x < 1 || y < 1 || z < 1 || x > this.maxx || y > this.maxy || z > this.maxz) return null;
		return this.grid[x - 1 + (y - 1) * this.maxx + (z - 1) * this.maxx * this.maxy];
	}

	/** The area instance the map loader uses for `type` (created, with New(), on first use). */
	areaFor(type: DMType): DMAtom {
		let a = this.areaByType.get(type);
		if (!a) {
			a = this.host.allocAtom(type);
			this.areaByType.set(type, a);
			this.host.initAtom(a, []);
		}
		return a;
	}

	/**
	 * world.maxx/maxy/maxz writes. Measured: new cells get world.turf inside the world.area instance
	 * (the map's area of that type); shrinking drops the cells outside (their turfs and contents go).
	 * Existing turfs keep their identity.
	 */
	resize(nx: number, ny: number, nz: number, runNew = true): DMAtom[] {
		nx = Math.max(0, Math.trunc(nx));
		ny = Math.max(0, Math.trunc(ny));
		nz = Math.max(0, Math.trunc(nz));
		if (nx === this.maxx && ny === this.maxy && nz === this.maxz) return [];
		const old = this.grid;
		const ox = this.maxx, oy = this.maxy, oz = this.maxz;
		const grid: (DMAtom | null)[] = new Array(nx * ny * nz).fill(null);
		for (let z = 1; z <= oz; z++) {
			for (let y = 1; y <= oy; y++) {
				for (let x = 1; x <= ox; x++) {
					const t = old[x - 1 + (y - 1) * ox + (z - 1) * ox * oy];
					if (!t) continue;
					if (x <= nx && y <= ny && z <= nz) grid[x - 1 + (y - 1) * nx + (z - 1) * nx * ny] = t;
					else this.dropTurf(t);
				}
			}
		}
		this.grid = grid;
		this.maxx = nx;
		this.maxy = ny;
		this.maxz = nz;
		const turfType = this.host.worldTurfType();
		const areaType = this.host.worldAreaType();
		if (!turfType) return [];
		// New turfs in map order. Unverified: whether BYOND calls New() on them (we do).
		const created: DMAtom[] = [];
		for (let z = 1; z <= nz; z++) {
			for (let y = 1; y <= ny; y++) {
				for (let x = 1; x <= nx; x++) {
					const i = x - 1 + (y - 1) * nx + (z - 1) * nx * ny;
					if (grid[i]) continue;
					const t = this.host.allocAtom(turfType);
					t.x = x;
					t.y = y;
					t.z = z;
					grid[i] = t;
					if (marks !== null) marks.add(t);
					if (areaType) this.setArea(t, this.areaFor(areaType));
					created.push(t);
				}
			}
		}
		if (runNew) for (const t of created) this.host.initAtom(t, []);
		return created;
	}

	private dropTurf(t: DMAtom): void {
		if (marks !== null) marks.add(t);
		if (t.loc) this.removeTurfFromArea(t, t.loc);
		for (const a of t.contents.slice()) this.destroy(a);
		t.deleted = true;
		this.removeAtom(t);
		releaseRefs(t);
	}

	/**
	 * Places a new turf object at (x, y, z), or re-types the existing one there in place: measured,
	 * `new /turf/T(old)` calls old's Del(), then the same object becomes a fresh T (vars reset to T's
	 * defaults) that keeps its area and contents. The caller runs (init)/New() afterwards.
	 */
	prepareTurf(type: DMType, x: number, y: number, z: number): DMAtom | null {
		const old = this.turfAt(x, y, z);
		if (!old) return null;
		this.host.delAtom(old);
		if (marks !== null) marks.add(old);
		old.type = type;
		old.clearVars();
		return old;
	}

	setArea(t: DMAtom, area: DMAtom): void {
		if (t.loc === area) return;
		if (marks !== null) marks.add(t);
		if (t.loc) this.removeTurfFromArea(t, t.loc);
		t.loc = area;
		area.areaTurfSet!.add(t);
		area.areaTurfsChanged();
	}

	private removeTurfFromArea(t: DMAtom, area: DMAtom): void {
		if (area.areaTurfSet?.delete(t)) area.areaTurfsChanged();
	}

	/** Takes a turf out of its area: measured, `area.contents = L` leaves the turfs it drops with no area. */
	clearArea(t: DMAtom): void {
		if (marks !== null) marks.add(t);
		if (t.loc) this.removeTurfFromArea(t, t.loc);
		t.loc = null;
	}

	/**
	 * A direct `loc` write (also `new T(loc)` and `contents +=`). Measured: no Enter/Exit/Entered/
	 * Exited calls. Order in the new location: objs then mobs, each in arrival order.
	 */
	setLoc(m: DMAtom, dest: DMAtom | null): void {
		if (m.loc === dest) return;
		if (marks !== null) {
			markTurfOf(m);
			if (dest !== null && dest.kind === Kind.Turf) marks.add(dest);
		}
		// Refuse to put something inside itself (unverified: BYOND silently refuses too).
		for (let p = dest; p; p = p.loc) if (p === m) return;
		const old = m.loc;
		// Reference counts (measured): `loc` refers to the container and its `contents` to m, so a
		// movable inside another one in nullspace keeps both alive.
		if (old) {
			const i = old.contents.indexOf(m);
			if (i >= 0) {
				const c = old.contents; // no splice (it allocates the removed-items array); contents are short
				for (let j = i + 1; j < c.length; j++) c[j - 1] = c[j];
				c.pop();
				decRef(m);
			}
		}
		m.loc = dest;
		if (dest) {
			incRef(dest);
			incRef(m);
		}
		if (old) decRef(old);
		if (!dest) return;
		let c = dest.contents;
		if (c === EMPTY_ITEMS) {
			// first arrival; the atom's ContentsList view (if any) must follow to the new array
			c = dest.contents = [];
			if (dest.contentsView) dest.contentsView.items = c;
		}
		if (m.kind === Kind.Mob) {
			c.push(m);
		} else {
			let i = c.length;
			while (i > 0 && c[i - 1].kind === Kind.Mob) i--;
			c.push(m); // insert at i without splice (it allocates the removed-items array)
			for (let j = c.length - 1; j > i; j--) c[j] = c[j - 1];
			c[i] = m;
		}
	}

	/** Removes a deleted atom from the world: out of its loc, its contents deleted too (measured). */
	destroy(a: DMAtom): void {
		for (const c of a.contents.slice()) this.destroy(c);
		if (a.kind === Kind.Turf) {
			// Unverified: BYOND replaces a deleted turf with world.turf. We only take it off the map.
			if (marks !== null) marks.add(a);
			if (a.loc) this.removeTurfFromArea(a, a.loc);
			const at = this.turfAt(a.x, a.y, a.z);
			if (at === a) this.grid[a.x - 1 + (a.y - 1) * this.maxx + (a.z - 1) * this.maxx * this.maxy] = null;
		} else if (a.kind !== Kind.Area) {
			this.setLoc(a, null);
		}
		a.deleted = true;
		this.removeAtom(a);
		releaseRefs(a);
	}

	/** An area's `contents`: each of its turfs followed by that turf's contents, then anything placed in the area itself. */
	areaContents(area: DMAtom): Value[] {
		const out: Value[] = [];
		for (const t of area.sortedAreaTurfs()) {
			out.push(t);
			for (const m of t.contents) out.push(m);
		}
		for (const m of area.contents) out.push(m);
		return out;
	}

	/** `atom.contents` as DM sees it. */
	contentsList(a: DMAtom): DMList {
		if (a.kind === Kind.Area) return new AreaContentsList(a, this);
		return (a.contentsView ??= new ContentsList(a, this));
	}

	/** Items `for(x in atom)` / `x in atom` / `locate() in atom` look at. */
	contentsItems(a: DMAtom): Value[] {
		return a.kind === Kind.Area ? this.areaContents(a) : a.contents;
	}

	/** The turf an atom is on: itself for a turf, its loc for a movable directly on a turf. */
	turfOf(a: Value): DMAtom | null {
		if (!(a instanceof DMAtom) || a.deleted) return null;
		if (a.kind === Kind.Turf) return a;
		const l = a.loc;
		return l && l.kind === Kind.Turf ? l : null;
	}

	/** The turf an atom is ultimately inside (walking up locs), for view()/range() centres. */
	outerTurf(a: Value): DMAtom | null {
		if (!(a instanceof DMAtom) || a.deleted) return null;
		for (let p: DMAtom | null = a; p; p = p.loc) if (p.kind === Kind.Turf) return p;
		return null;
	}

	/** Atom coordinates as DM reads them: a turf's own, a movable's turf's, an area's first turf's (map order;
	 * null,null,null for an area with no turfs, measured in q6-area), otherwise 0,0,0. */
	coords(a: DMAtom): [number, number, number] {
		const t = this.turfOf(a);
		if (t) return [t.x, t.y, t.z];
		if (a.kind === Kind.Area) {
			const f = a.firstAreaTurf();
			return f ? [f.x, f.y, f.z] : (NO_COORDS as unknown as [number, number, number]);
		}
		return [0, 0, 0];
	}

	// ---- spatial helpers ---------------------------------------------------------------------

	/**
	 * get_step(). Measured: dir 0 (or N+S) is the turf the atom is on, even from inside other atoms
	 * (tg's get_turf(A) is get_step(A, 0)); off the map is null.
	 */
	getStep(a: Value, dir: Value): DMAtom | null {
		const t = this.outerTurf(a);
		if (!t) return null;
		if (dir !== null && typeof dir !== "number") return null;
		const d = dir === null ? 0 : Math.trunc(dir);
		let x = t.x, y = t.y, z = t.z;
		if (d & NORTH) y++;
		if (d & SOUTH) y--;
		if (d & EAST) x++;
		if (d & WEST) x--;
		if (d & UP) z++;
		if (d & DOWN) z--;
		return this.turfAt(x, y, z);
	}

	/** Coordinates of the turf an atom is ultimately on (0,0,0 when it's nowhere). */
	private outerCoords(a: DMAtom): [number, number, number] {
		const t = this.outerTurf(a);
		return t ? [t.x, t.y, t.z] : [0, 0, 0];
	}

	/**
	 * get_dir(). Measured: the signs of dx and dy only, between the turfs the atoms are on (also from
	 * inside other atoms); z is ignored (a z-only difference is 0).
	 */
	getDir(a: Value, b: Value): number {
		if (!(a instanceof DMAtom) || !(b instanceof DMAtom) || a.deleted || b.deleted) return 0;
		const [ax, ay] = this.outerCoords(a);
		const [bx, by] = this.outerCoords(b);
		let d = 0;
		if (by > ay) d |= NORTH;
		else if (by < ay) d |= SOUTH;
		if (bx > ax) d |= EAST;
		else if (bx < ax) d |= WEST;
		return d;
	}

	/**
	 * get_dist(). Measured: the same object (even null) is -1, a non-atom 127, otherwise the larger of
	 * the x and y distances between the turfs the atoms are on (from inside other atoms too); z is ignored.
	 */
	getDist(a: Value, b: Value): number {
		if (a === b) return -1;
		if (!(a instanceof DMAtom) || !(b instanceof DMAtom) || a.deleted || b.deleted) return 127;
		const [ax, ay] = this.outerCoords(a);
		const [bx, by] = this.outerCoords(b);
		return Math.max(Math.abs(ax - bx), Math.abs(ay - by));
	}

	/** block(Start, End). Measured: every turf in the box, x fastest, then y (then z); corners in either order. */
	block(a: Value, b: Value): DMList {
		const out = new DMList();
		const ta = this.turfOf(a), tb = this.turfOf(b);
		if (!ta || !tb) return out;
		const [x1, x2] = [Math.min(ta.x, tb.x), Math.max(ta.x, tb.x)];
		const [y1, y2] = [Math.min(ta.y, tb.y), Math.max(ta.y, tb.y)];
		const [z1, z2] = [Math.min(ta.z, tb.z), Math.max(ta.z, tb.z)];
		for (let z = z1; z <= z2; z++) for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) {
			const t = this.turfAt(x, y, z);
			if (t) out.push(t);
		}
		return out;
	}

	/**
	 * range()/orange()/view()/oview(). Measured order: the centre turf, then rings at distance 1, 2, ...,
	 * each ring x-major (x outer, y inner). Each turf is followed by its area (the first time that area
	 * shows up) and then its contents. The `o` forms leave out the centre object: for a turf centre that
	 * is the turf and its contents, for a movable centre just the movable.
	 * view(): BYOND's visibility (los1, vm/view-los.ts, measured against BYOND in tests/dm/zz_view_los.dm): line of
	 * sight, darkness (a mob centre's see_in_dark; any other centre sees only lit tiles), and a mob centre's
	 * sight: BLIND gives an empty list, SEE_MOBS|SEE_OBJS|SEE_TURFS together give everything in range (any one
	 * alone changes nothing), SEE_THRU ignores opacity. ignoreLight (hearers()): line of sight only, no sight flags.
	 * distY (from a "WxH" Dist) makes the box rectangular, dist wide and distY tall each way; the same ring order,
	 * rings cut to the box (unverified in BYOND: the order for a non-square box).
	 */
	rangeList(dist: number, center: DMAtom, exclusive: boolean, useView: boolean, ignoreLight = false, distY = dist, pick: ((a: DMAtom) => boolean) | null = null): DMList {
		const out = new DMList();
		// built in a reused array, then copied once at its final size (pushing onto the list's own array
		// regrew it several times: ~600 MB of garbage per snapshot run). Nothing here runs DM code.
		const items = rangeScratch;
		items.length = 0;
		let seeInDark = 0, seeThru = false;
		if (useView && !ignoreLight && center.kind === Kind.Mob) {
			const sight = center.getVar("sight");
			const f = typeof sight === "number" ? sight : 0;
			if (f & SIGHT_BLIND) return out;
			if ((f & SIGHT_XRAY) === SIGHT_XRAY) useView = false;
			seeThru = (f & SEE_THRU) !== 0;
			const sid = center.getVar("see_in_dark");
			seeInDark = typeof sid === "number" ? sid : 0;
		}
		// Measured: a movable centre's own contents come first (not in the o- forms). A centre that isn't
		// on a turf sees only its loc and the loc's contents; with no loc, just itself.
		if (center.kind !== Kind.Turf && center.kind !== Kind.Area) {
			if (!exclusive) for (const m of center.contents) items.push(m);
			const l = center.loc;
			if (!l) {
				if (!exclusive) items.push(center);
				return done(out, items, pick);
			}
			if (l.kind !== Kind.Turf) {
				items.push(l);
				for (const m of l.contents) if (!(exclusive && m === center)) items.push(m);
				return done(out, items, pick);
			}
		}
		const ct = this.outerTurf(center);
		if (!ct) return done(out, items);
		const seenAreas = areaScratch; // a few areas at most; a reused array instead of a new Set
		seenAreas.length = 0;
		const skipCentreTurf = exclusive && center.kind === Kind.Turf;
		// pick collects only the atoms it accepts, in the same order (hostile ListTargets wants mobs and a
		// few machine types, not the whole view list).
		const emit = pick ? (t: DMAtom) => {
			if (skipCentreTurf && t === ct) return;
			if (pick(t)) items.push(t);
			const area = t.loc;
			if (area && !seenAreas.includes(area)) {
				seenAreas.push(area);
				if (pick(area)) items.push(area);
			}
			for (const m of t.contents) if (!(exclusive && m === center) && pick(m)) items.push(m);
		} : (t: DMAtom) => {
			if (skipCentreTurf && t === ct) return;
			items.push(t);
			const area = t.loc;
			if (area && !seenAreas.includes(area)) {
				seenAreas.push(area);
				items.push(area);
			}
			for (const m of t.contents) if (!(exclusive && m === center)) items.push(m);
		};
		const rx = Math.max(0, Math.trunc(dist)), ry = Math.max(0, Math.trunc(distY)), r = Math.max(rx, ry);
		const box = useView ? this.viewBox(ct, rx, ry, seeInDark, seeThru, ignoreLight) : null;
		const visible = box ? (t: DMAtom) => box.vis[(t.x - box.x0) + (t.y - box.y0) * box.w] !== 0 : null;
		if (!visible || visible(ct)) emit(ct);
		for (let d = 1; d <= r; d++) {
			for (let x = ct.x - Math.min(d, rx); x <= ct.x + Math.min(d, rx); x++) {
				for (let y = ct.y - Math.min(d, ry); y <= ct.y + Math.min(d, ry); y++) {
					if (Math.max(Math.abs(x - ct.x), Math.abs(y - ct.y)) !== d) continue;
					const t = this.turfAt(x, y, ct.z);
					if (!t) continue;
					if (visible && !visible(t)) continue;
					emit(t);
				}
			}
		}
		return done(out, items);
	}

	isOpaque(t: DMAtom): boolean {
		if (t.getVar("opacity")) return true;
		for (const m of t.contents) if (m.getVar("opacity")) return true;
		return false;
	}

	/**
	 * BYOND's visibility for the (2rx+1) x (2ry+1) box centred on turf c (see vm/view-los.ts). vis is indexed
	 * (x - x0) + (y - y0) * w in world coordinates; nonzero = visible. Cells past the map edge must not be reported (they count as clear and lit).
	 */
	viewBox(c: DMAtom, rx: number, ry: number, seeInDark: number, seeThru: boolean, ignoreLight: boolean): { x0: number; y0: number; w: number; h: number; vis: Int32Array } {
		const { box, x0, y0 } = this.losBox(c, rx, ry, seeThru, ignoreLight, true);
		if (stress.on) { const t0 = performance.now(); const vis = computeLos(box, seeInDark, ignoreLight, true); stressNoteLos(performance.now() - t0, "stack"); return { x0, y0, w: box.w, h: box.h, vis }; }
		return { x0, y0, w: box.w, h: box.h, vis: computeLos(box, seeInDark, ignoreLight, true) }; // used at once (rangeList)
	}

	/** The input to computeLos for the box of half-size rx, ry around turf c (opacity, luminosity, lit areas). */
	losBox(c: DMAtom, rx: number, ry: number, seeThru: boolean, ignoreLight: boolean, reuse = false): { box: LosBox; x0: number; y0: number } {
		const w = 2 * rx + 1, h = 2 * ry + 1;
		const b = reuse ? scratchLosBox(w, h) : newLosBox(w, h);
		const x0 = c.x - rx, y0 = c.y - ry;
		for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
			const t = this.turfAt(x0 + i, y0 + j, c.z);
			const k = i + j * w;
			if (!t) { b.areaLit[k] = 1; continue; } // past the map edge: clear and lit (measured), never reported
			let o = opacityOf(t) !== 0;
			let lum = ignoreLight ? 0 : luminosityOf(t);
			for (const m of t.contents) {
				if (!o && opacityOf(m) !== 0) o = true;
				if (!ignoreLight) { const l = luminosityOf(m); if (l > lum) lum = l; }
			}
			if (o && !seeThru) b.opaque[k] = 1;
			b.lamp[k] = lum;
			if (!ignoreLight) { const a = t.loc; if (a && luminosityOf(a) !== 0) b.areaLit[k] = 1; }
		}
		return { box: b, x0, y0 };
	}

	/**
	 * get_step_to(Ref, Trg, Min): the next turf on a shortest path. Measured (open ground and a wall with
	 * one gap): the step goes to a neighbour on a shortest 8-way path, preferring the direction closest
	 * to get_dir(Ref, Trg); a turf blocks a dense Ref if it is dense or holds a dense movable (a non-dense
	 * Ref ignores everything); no step within Min. Unverified: tie-breaks between equally close
	 * directions, the search area (we search the box around Ref and Trg plus 16 turfs), and what
	 * happens when there's no path (null).
	 */
	getStepTo(ref: Value, trg: Value, min: number): DMAtom | null {
		if (!(ref instanceof DMAtom) || ref.deleted) return null;
		const from = this.turfOf(ref);
		const to = this.outerTurf(trg);
		if (!from || !to || from.z !== to.z) return null;
		if (this.getDist(ref, trg) <= min) return null;
		const dense = !!ref.getVar("density");
		const blocked = (t: DMAtom): boolean => {
			if (!dense) return false;
			if (t.getVar("density")) return true;
			for (const m of t.contents) if (m !== ref && m.getVar("density")) return true;
			return false;
		};
		const margin = 16;
		const x0 = Math.max(1, Math.min(from.x, to.x) - margin), x1 = Math.min(this.maxx, Math.max(from.x, to.x) + margin);
		const y0 = Math.max(1, Math.min(from.y, to.y) - margin), y1 = Math.min(this.maxy, Math.max(from.y, to.y) + margin);
		const w = x1 - x0 + 1, h = y1 - y0 + 1;
		const dist = new Int32Array(w * h).fill(-1);
		const idx = (x: number, y: number) => x - x0 + (y - y0) * w;
		// Breadth-first from the target, so dist[] is the number of steps left to reach it.
		const queue: number[] = [idx(to.x, to.y)];
		dist[queue[0]] = 0;
		const fromIdx = idx(from.x, from.y);
		for (let qi = 0; qi < queue.length && dist[fromIdx] < 0; qi++) {
			const cur = queue[qi];
			const cx = (cur % w) + x0, cy = Math.floor(cur / w) + y0;
			for (let ddx = -1; ddx <= 1; ddx++) for (let ddy = -1; ddy <= 1; ddy++) {
				if (!ddx && !ddy) continue;
				const nx = cx + ddx, ny = cy + ddy;
				if (nx < x0 || nx > x1 || ny < y0 || ny > y1) continue;
				const ni = idx(nx, ny);
				if (dist[ni] >= 0) continue;
				const t = this.turfAt(nx, ny, to.z);
				if (!t) continue;
				if (ni !== fromIdx && blocked(t)) continue;
				dist[ni] = dist[cur] + 1;
				queue.push(ni);
			}
		}
		const left = dist[fromIdx];
		if (left <= 0) return null;
		const want = dirAngle(this.getDir(from, to));
		let best: DMAtom | null = null;
		let bestDiff = 999;
		for (const d of [NORTH, SOUTH, EAST, WEST, NORTH | EAST, SOUTH | EAST, NORTH | WEST, SOUTH | WEST]) {
			const t = this.getStep(from, d);
			if (!t || t.x < x0 || t.x > x1 || t.y < y0 || t.y > y1) continue;
			if (dist[idx(t.x, t.y)] !== left - 1) continue;
			let diff = Math.abs(dirAngle(d) - want) % 360;
			if (diff > 180) diff = 360 - diff;
			if (diff < bestDiff) {
				bestDiff = diff;
				best = t;
			}
		}
		return best;
	}
}

/** Compass angle of a direction (north 0, east 90). */
function dirAngle(d: number): number {
	switch (d & 15) {
		case NORTH: return 0;
		case NORTH | EAST: return 45;
		case EAST: return 90;
		case SOUTH | EAST: return 135;
		case SOUTH: return 180;
		case SOUTH | WEST: return 225;
		case WEST: return 270;
		case NORTH | WEST: return 315;
		default: return 0;
	}
}

/** turn(Dir, Angle) for directions: rotates anticlockwise by Angle (a multiple of 45). */
export function turnDir(dir: number, angle: number): number {
	const order = [NORTH, NORTH | WEST, WEST, SOUTH | WEST, SOUTH, SOUTH | EAST, EAST, NORTH | EAST];
	const d = dir & 15;
	const i = order.indexOf(d);
	if (i < 0) return 0; // unverified: turn(0, x) and turn(N+S, x)
	const steps = Math.round(angle / 45);
	return order[(((i + steps) % 8) + 8) % 8];
}

function* chain<T>(...parts: Iterable<T>[]): Generator<T> {
	for (const p of parts) yield* p;
}
