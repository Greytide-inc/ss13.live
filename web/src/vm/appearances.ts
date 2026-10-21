// Appearances: BYOND's frozen "look" values. Measured in BYOND 511.1385
// (web/tests/dm/appearance.dm):
//  - Reading `x.appearance` (atom, /image, /mutable_appearance) gives a snapshot of x's look: later
//    changes to x don't show in it. Snapshots are interned: two things that look the same give the
//    same (==) value, so `overlays -= thing` finds an entry made from an equal-looking thing.
//  - A snapshot is not an /image: istype(a, /image) and istype(a, /datum) are false, "[a]" is "",
//    but a:type is /image and its look vars read normally. Its overlays/underlays vars can't be read
//    ("undefined variable /var/overlays"), and writing any var is a runtime error.
//  - The look is: icon, icon_state, dir, layer, plane, color, alpha, blend_mode, transform (by
//    value), pixel offsets, invisibility, mouse_opacity, name, desc, suffix, text, gender, opacity,
//    luminosity, maptext*, appearance_flags, overlays, underlays. Not density, not screen_loc.
//  - Writing `x.appearance = v` copies a look in (v: a snapshot, an /image, a /mutable_appearance,
//    an atom or a type). From a plain /image, dir is NOT copied (it keeps x's own dir).
//  - An atom's or /image's overlays/underlays hold snapshots, made from what was added: text is an
//    icon_state (icon left null, layer FLOAT_LAYER, plane FLOAT_PLANE), an icon file or /icon sets
//    icon, a type path gives the type's initial look, an /image, /mutable_appearance or atom gives
//    its snapshot. A /mutable_appearance's own overlays list is a plain list (items kept raw).
//  - dir quirk: once `dir` has been assigned at run time (`x.dir = 2`, even to its current value),
//    the snapshot remembers it, and an overlay entry made from it reads dir 0 (follow the owner).
//    dir from a type default or image()'s dir argument is kept. The flag travels with the look.
//  - Drawing (ov1, tests/render-rules/nested.dm): an overlay whose dir is SOUTH follows its owner's
//    dir (a /mutable_appearance or image() with no dir argument), except when the SOUTH came from
//    image()'s dir argument: that one stays SOUTH (tg's pipe manifolds rely on it). It reads 2 either
//    way, so it is a hidden flag (`dirFixed`), copied with the look (`x.appearance = snapshot`).

import { DMList, DMObject, live } from "./objects.js";
import { DMType, ListLiteral, Resource } from "./objtree.js";
import { DMRuntimeError, type Value } from "./value.js";
import type { VM } from "./interpreter.js";
import { DMAtom, markTurfOf, viewMarksOn } from "./world.js";

/** One interned look. Its type is a stand-alone copy of /image's (path "/image", no parent). */
export class DMAppearance extends DMObject {
	declare key: string;
	/** dir was assigned at run time in the thing it was taken from (see the header). */
	declare dirSet: boolean;
	/** dir came from image()'s dir argument: drawn as it is even when SOUTH (see the header). */
	declare dirFixed: boolean;
	declare aid: number;
}

/** The look vars copied by a snapshot, in key order (overlays/underlays are handled apart). */
const FIELDS = [
	"icon", "icon_state", "dir", "layer", "plane", "color", "alpha", "blend_mode", "transform",
	"pixel_x", "pixel_y", "pixel_w", "pixel_z", "invisibility", "mouse_opacity", "name", "desc",
	"suffix", "text", "gender", "opacity", "luminosity", "infra_luminosity", "maptext",
	"maptext_width", "maptext_height", "maptext_x", "maptext_y", "appearance_flags",
] as const;
const DIR = FIELDS.indexOf("dir");
const ICON = FIELDS.indexOf("icon");
const ICON_STATE = FIELDS.indexOf("icon_state");
const TRANSFORM = FIELDS.indexOf("transform");
const COLOR = FIELDS.indexOf("color");
const MATRIX_VARS = ["a", "b", "c", "d", "e", "f"] as const;

/**
 * An atom's or /image's overlays/underlays: everything put in becomes a snapshot (see `entry`).
 * Removing converts the same way, so an equal look is found.
 */
export class OverlayList extends DMList {
	// The 5th field is the owner (an atom or /image), not Appearances (mem3 keeps lists at 5 fields): the
	// owner's type finds its Appearances in appearancesOf, and an atom owner is marked on every change (view-dirty).
	constructor(readonly owner: DMObject, items: readonly Value[] = []) {
		super();
		for (const v of items) this.push(v);
	}

	private get ap(): Appearances {
		return appearancesOf.get(this.owner.type)!;
	}

	/** view-dirty: the owner's turf changed picture. */
	touch(): void {
		const o = this.owner;
		if (viewMarksOn() && o instanceof DMAtom) markTurfOf(o);
	}

	override setLen(n: number): void {
		this.touch();
		super.setLen(n);
	}

	override cut(from: number, to: number): void {
		this.touch();
		super.cut(from, to);
	}

	override push(v: Value, _assocValue?: Value): void {
		this.touch();
		const e = this.ap.entry(v);
		if (e !== null) super.push(e);
	}

	override add(v: Value): void {
		if (v instanceof DMList) {
			for (const x of v.items.slice()) this.push(live(x));
		} else this.push(v);
	}

	override removeOne(v: Value): boolean {
		this.touch();
		const e = this.ap.entry(v);
		return e !== null && super.removeOne(e);
	}

	override insert(at: number, vals: Value[]): void {
		this.touch();
		const out: Value[] = [];
		for (const v of vals) {
			if (v instanceof DMList) {
				for (const x of v.items) {
					const e = this.ap.entry(live(x));
					if (e !== null) out.push(e);
				}
			} else {
				const e = this.ap.entry(v);
				if (e !== null) out.push(e);
			}
		}
		super.insert(at, out);
	}

	override setItem(i: number, v: Value): void {
		this.touch();
		super.setItem(i, this.ap.entry(v)); // unverified: an item that can't be an overlay reads null
	}
}

/** Each tree type's Appearances (OverlayList reaches it through its owner's type). */
const appearancesOf = new WeakMap<DMType, Appearances>();

export class Appearances {
	/** The stand-alone type every snapshot has. */
	readonly type: DMType;
	/** Objects whose dir was assigned at run time. */
	readonly dirSet = new WeakSet<DMObject>();
	/** /images whose dir came from image()'s dir argument (natives-misc.ts). */
	readonly dirFixed = new WeakSet<DMObject>();
	private readonly interned = new Map<string, DMAppearance>();
	private readonly imageType: DMType | null;
	private readonly maType: DMType | null;
	private readonly iconType: DMType | null;
	private readonly matrixType: DMType | null;
	/** A fresh /image's look vars (what a text or icon overlay starts from). */
	private readonly blank: Value[];
	private readonly objIds = new WeakMap<object, number>();
	private nextId = 1;
	private readonly byType = new Map<DMType, DMAppearance>();

	constructor(private readonly vm: VM) {
		const tree = vm.tree;
		for (const t of tree.types) appearancesOf.set(t, this);
		this.imageType = tree.getType("/image") ?? null;
		this.maType = tree.getType("/mutable_appearance") ?? null;
		this.iconType = tree.getType("/icon") ?? null;
		this.matrixType = tree.getType("/matrix") ?? null;
		const img = this.imageType;
		if (img) {
			// Measured /image defaults DMStandard gets wrong: name null (and "[I]" is ""), icon_state "",
			// dir SOUTH, invisibility 0. /mutable_appearance: plane 0 (FLOAT_PLANE only on /image).
			const dmsName = img.vars.get("name"), dmsPlane = img.vars.get("plane");
			for (const t of tree.types) {
				if (!t.isSubtypeOf(img)) continue;
				t.textEmpty = true;
				t.lookVars = true;
			}
			tree.addVarFixup((t) => {
				if (!t.isSubtypeOf(img)) return;
				if (t.vars.get("name") === dmsName) t.vars.set("name", null);
				if ((t.vars.get("icon_state") ?? null) === null) t.vars.set("icon_state", "");
				if ((t.vars.get("dir") ?? null) === null) t.vars.set("dir", 2);
				if ((t.vars.get("invisibility") ?? null) === null) t.vars.set("invisibility", 0);
				if (this.maType && t.isSubtypeOf(this.maType) && t.vars.get("plane") === dmsPlane) t.vars.set("plane", 0);
			});
		}
		const json = img?.json ?? ({ Path: "/image" } as unknown as DMType["json"]);
		this.type = new DMType(-1, "/image", json); // no tree: its vars start empty
		this.type.textEmpty = true;
		this.type.textNone = true;
		if (img) for (const [k, v] of img.vars) this.type.vars.set(k, v);
		this.blank = FIELDS.map((k) => this.type.vars.get(k) ?? null);
	}

	/** Atoms and /images (not /mutable_appearance) turn what goes into overlays/underlays into snapshots. */
	ownsOverlayLists(o: DMObject): boolean {
		if (o.type === this.type) return false;
		if (this.vm.atomKind(o.type) !== 0) return true;
		return this.imageType !== null && o.type.isSubtypeOf(this.imageType) && !(this.maType !== null && o.type.isSubtypeOf(this.maType));
	}

	/** `a:type` on a snapshot is /image. */
	imageTypeOr(t: DMType): DMType {
		return this.imageType ?? t;
	}

	isAppearance(v: Value): v is DMAppearance {
		return v instanceof DMAppearance;
	}

	/** `x.appearance` */
	read(o: DMObject): DMAppearance {
		return this.snapshot(o, false);
	}

	/** A GC'd snapshot leaves the intern table. */
	forget(a: DMAppearance): void {
		if (this.interned.get(a.key) === a) this.interned.delete(a.key);
	}

	/** What goes into an overlays/underlays list for v, or null for something that can't. */
	entry(v: Value): DMAppearance | null {
		if (v === null) return null; // unverified: skipped
		if (typeof v === "string") return this.fromBlank(ICON_STATE, v);
		if (v instanceof Resource) return this.fromBlank(ICON, v);
		if (v instanceof DMObject) {
			if (v instanceof DMAppearance) return v.dirSet ? this.withDir0(v) : v;
			if (this.iconType !== null && v.type.isSubtypeOf(this.iconType)) return this.fromBlank(ICON, v);
			if (v.hasVar("icon") && v.hasVar("icon_state")) return this.snapshot(v, true);
			return null; // unverified
		}
		if (v instanceof DMType) return this.ofType(v);
		return null; // unverified: numbers and the rest are skipped
	}

	/** `target.appearance = v` */
	write(target: DMObject, v: Value): void {
		let src: DMAppearance;
		let copyDir = true;
		if (v instanceof DMAppearance) src = v;
		else if (v instanceof DMType) src = this.ofType(v);
		else if (v instanceof DMObject && v.hasVar("icon") && v.hasVar("icon_state")) {
			src = this.snapshot(v, false);
			// Measured: from a plain /image the dir isn't copied.
			if (this.imageType !== null && v.type.isSubtypeOf(this.imageType) && !(this.maType !== null && v.type.isSubtypeOf(this.maType))) copyDir = false;
		} else return; // unverified: ignored
		for (let i = 0; i < FIELDS.length; i++) {
			const k = FIELDS[i];
			if (i === DIR && !copyDir) continue;
			if (!target.hasVar(k)) continue;
			let val = src.getVar(k);
			if (val instanceof DMObject || val instanceof DMList) val = this.copyValue(val);
			if (target.getVar(k) !== val) target.setVar(k, val);
		}
		const owns = this.ownsOverlayLists(target);
		for (const k of ["overlays", "underlays"] as const) {
			if (!target.hasVar(k)) continue;
			const l = src.getVar(k);
			if (l instanceof DMList && l.items.length > 0) target.setVar(k, owns ? new OverlayList(target, l.items) : new DMList(l.items.slice()));
			else if (target.getVar(k) !== null) target.setVar(k, null);
		}
		if (copyDir) {
			if (src.dirSet) this.dirSet.add(target);
			else this.dirSet.delete(target);
		}
		// pv1 (measured, tests/render-rules/pipes.dm row 8): the image()-dir-argument flag comes along
		// even from a plain /image whose dir itself isn't copied (tg's build_appearance_list relies on it).
		if (src.dirFixed) {
			this.dirFixed.add(target);
			this.dirSet.delete(target);
		} else this.dirFixed.delete(target);
	}

	/** A run-time `x.dir = d` (pv1, measured in tests/render-rules/pipes.dm rows 8-9): it makes x's
	 *  overlay entries read dir 0 (follow the owner), except on a thing whose dir came from image()'s
	 *  dir argument (a later assignment is kept, even to another dir), and on an obj or mob when the value
	 *  doesn't change (an obj of a type with dir EAST, set to EAST, keeps it). */
	noteDirWrite(o: DMObject, sameValue: boolean): void {
		if (this.dirFixed.has(o)) return;
		if (sameValue) return;
		this.dirSet.add(o);
	}

	/** A new overlays/underlays list for `x.overlays = v`. */
	newOverlayList(owner: DMObject, v: Value): OverlayList {
		const l = new OverlayList(owner);
		l.add(v);
		return l;
	}

	// ---- snapshots ----------------------------------------------------------------------------

	private snapshot(o: DMObject, forOverlay: boolean): DMAppearance {
		if (o instanceof DMAppearance) return forOverlay && o.dirSet ? this.withDir0(o) : o;
		const vals: Value[] = new Array(FIELDS.length);
		for (let i = 0; i < FIELDS.length; i++) {
			const k = FIELDS[i];
			vals[i] = o.hasVar(k) ? o.getVar(k) : this.blank[i];
		}
		let dirSet = this.dirSet.has(o);
		if (forOverlay && dirSet) {
			vals[DIR] = 0;
			dirSet = false;
		}
		return this.intern(vals, this.entries(o, "overlays"), this.entries(o, "underlays"), dirSet, !this.dirSet.has(o) && this.dirFixed.has(o));
	}

	private entries(o: DMObject, name: string): DMAppearance[] | null {
		if (!o.hasVar(name)) return null;
		const l = o.getVar(name);
		if (!(l instanceof DMList) || l.items.length === 0) return null;
		const out: DMAppearance[] = [];
		for (const x of l.items) {
			const e = this.entry(live(x));
			if (e !== null) out.push(e);
		}
		return out.length ? out : null;
	}

	private withDir0(a: DMAppearance): DMAppearance {
		const vals = FIELDS.map((k) => a.getVar(k));
		vals[DIR] = 0;
		return this.intern(vals, this.listOf(a, "overlays"), this.listOf(a, "underlays"), false);
	}

	private listOf(a: DMAppearance, name: string): DMAppearance[] | null {
		const l = a.getVar(name);
		return l instanceof DMList ? (l.items as DMAppearance[]) : null;
	}

	private fromBlank(i: number, v: Value): DMAppearance {
		const vals = this.blank.slice();
		vals[i] = v;
		return this.intern(vals, null, null, false);
	}

	/** A type path's initial look (overlays += /obj/foo). Unverified: list-literal overlays on the type. */
	private ofType(t: DMType): DMAppearance {
		let a = this.byType.get(t);
		if (a === undefined || a.key === undefined || this.interned.get(a.key) !== a) {
			const vals = FIELDS.map((k, i) => {
				if (!t.vars.has(k)) return this.blank[i];
				const v = t.vars.get(k) ?? null;
				return v instanceof ListLiteral ? null : v;
			});
			if (this.vm.atomKind(t) !== 0 && vals[FIELDS.indexOf("name")] === null) {
				vals[FIELDS.indexOf("name")] = t.path.slice(t.path.lastIndexOf("/") + 1).replace(/_/g, " ");
			}
			a = this.intern(vals, null, null, false);
			this.byType.set(t, a);
		}
		return a;
	}

	private idOf(o: object): number {
		let id = this.objIds.get(o);
		if (id === undefined) this.objIds.set(o, (id = this.nextId++));
		return id;
	}

	private keyOf(v: Value, i: number): string {
		if (v === null) return "";
		if (typeof v === "number") return "n" + v;
		if (typeof v === "string") return "s" + v;
		if (v instanceof Resource) return "r" + v.path;
		if (v instanceof DMAppearance) return "a" + v.aid;
		if (i === TRANSFORM && v instanceof DMObject && v.type === this.matrixType) {
			return "m" + MATRIX_VARS.map((k) => String(v.getVar(k))).join(",");
		}
		if (i === COLOR && v instanceof DMList) return "l" + v.items.map((x) => this.keyOf(live(x), -1)).join(",");
		if (v instanceof DMType) return "t" + v.path;
		return "o" + this.idOf(v as object);
	}

	private intern(vals: Value[], ov: DMAppearance[] | null, un: DMAppearance[] | null, dirSet: boolean, dirFixed = false): DMAppearance {
		let key = (dirSet ? "D" : "") + (dirFixed ? "F" : "");
		for (let i = 0; i < vals.length; i++) key += "\x01" + this.keyOf(vals[i], i);
		if (ov !== null) for (const e of ov) key += "\x02" + e.aid;
		if (un !== null) for (const e of un) key += "\x03" + e.aid;
		const hit = this.interned.get(key);
		if (hit !== undefined) return hit;
		const a = new DMAppearance(this.type);
		a.key = key;
		a.dirSet = dirSet;
		a.dirFixed = dirFixed;
		a.aid = this.nextId++;
		for (let i = 0; i < vals.length; i++) {
			let v = vals[i];
			if (v === this.blank[i]) continue;
			if (i === TRANSFORM || i === COLOR) v = this.copyValue(v);
			a.setVar(FIELDS[i], v);
		}
		if (ov !== null) a.setVar("overlays", new DMList(ov.slice()));
		if (un !== null) a.setVar("underlays", new DMList(un.slice()));
		this.interned.set(key, a);
		return a;
	}

	/** A matrix or color list is copied by value. */
	private copyValue(v: Value): Value {
		if (v instanceof DMList) return new DMList(v.items.slice());
		if (v instanceof DMObject && v.type === this.matrixType && this.matrixType !== null) {
			const m = this.vm.allocObject(this.matrixType);
			for (const k of MATRIX_VARS) m.setVar(k, v.getVar(k));
			return m;
		}
		return v;
	}

	/** Measured wording for a write to a snapshot's var. */
	static readOnly(name: string): DMRuntimeError {
		return new DMRuntimeError(`Images created at loc=null are not modifiable.  (Attempted to assign ${name}.)`);
	}
}
