// Datum instances and lists. Semantics measured against BYOND 511.1385 (web/tests/dm/objects.dm,
// lists.dm); anything not covered by a test is marked "unverified".

import { decRef, GCFlag, GCNode, heap, incRef } from "./gc.js";
import { DMType, Resource } from "./objtree.js";
import { DMRuntimeError, isEqual, type Value } from "./value.js";

/**
 * The names of an object's written vars, in write order, shared by every object that wrote the same vars
 * in the same order (a JS engine's hidden class, for DM vars); the object keeps only the values. Measured
 * at the lobby: a Map per object took 1.1 GB of Firefox's 3.4 GB (Chrome less), and the 1.12M objects use
 * 3304 distinct orders (23k shapes counting the prefixes). Never changes, apart from the transition cache.
 */
export class VarShape {
	/** Name -> index in DMObject.vals. */
	readonly index: Map<string, number>;
	readonly names: string[];
	/** The shapes one more write leads to (made on first use). */
	next: Map<string, VarShape> | null;

	constructor(names: string[]) {
		this.names = names;
		this.index = new Map(names.map((n, i) => [n, i]));
		this.next = null;
	}

	/** The shape after also writing `name`. */
	with(name: string): VarShape {
		const next = (this.next ??= new Map());
		let s = next.get(name);
		if (s === undefined) {
			s = new VarShape([...this.names, name]);
			next.set(name, s);
		}
		return s;
	}
}

/**
 * one field-access site's inline cache (translated code: translate.ts siteIC; interpreter: on the Ref or
 * instruction): up to four (type, var shape) pairs a plain read there saw, each with the var's index in that
 * shape (-1: unwritten, read the type's default `d`). A read that matches skips getField's lookups; others go
 * through VM.readIC's fill or getField. `w` is the last type a plain write there saw. Not saved in snapshots.
 */
export class FieldIC {
	t0: DMType | null = null; s0: VarShape | null = null; i0 = -1; d0: Value = null;
	t1: DMType | null = null; s1: VarShape | null = null; i1 = -1; d1: Value = null;
	t2: DMType | null = null; s2: VarShape | null = null; i2 = -1; d2: Value = null;
	t3: DMType | null = null; s3: VarShape | null = null; i3 = -1; d3: Value = null;
	/** The slot the next fill goes to (round-robin). */
	n = 0;
	w: DMType | null = null;
	/** `type`, `loc`, 3/4/5: `x`/`y`/`z`, `contents` (built-ins read straight off the object), any other var. */
	readonly kind: number;
	constructor(readonly name: string) {
		this.kind = name === "type" ? 1 : name === "loc" ? 2 : name === "x" ? 3 : name === "y" ? 4 : name === "z" ? 5 : name === "contents" ? 6 : 0;
	}
}

/** No vars written. Also reachable as VM.rootShape, so a world snapshot loads its shapes into this tree. */
export const ROOT_SHAPE = new VarShape([]);

/** An instance of /datum or a subtype. Only vars that were written are stored; the rest read the type's defaults. */
export class DMObject extends GCNode {
	/** Written vars: their names (shared, see VarShape) and values in the same order (null: none yet).
	 * Change them only through setVar/clearVars, which keep the reference counts. */
	shape: VarShape = ROOT_SHAPE;
	vals: Value[] | null = null;
	/** Set by `del`. Every read of a reference to a deleted object yields null (see `live`). */
	deleted = false;
	private varsList: VarsList | null = null;

	/** Mutable only for turfs, which BYOND re-types in place (`new /turf/T(old_turf)`). */
	constructor(public type: DMType) {
		super(false);
	}

	hasVar(name: string): boolean {
		return this.type.vars.has(name);
	}

	/** Raw read; the caller has checked hasVar (or wants null for unknown names). Special vars excluded. */
	getVar(name: string): Value {
		const i = this.shape.index.get(name);
		if (i !== undefined) return this.vals![i];
		return this.type.vars.get(name) ?? null;
	}

	/** The written value of `name`, or undefined if it was never written. */
	ownVar(name: string): Value | undefined {
		const i = this.shape.index.get(name);
		return i === undefined ? undefined : this.vals![i];
	}

	/** The written vars as [name, value], in write order. */
	*ownVars(): Generator<[string, Value]> {
		const names = this.shape.names;
		for (let i = 0; i < names.length; i++) yield [names[i], this.vals![i]];
	}

	setVar(name: string, v: Value): void {
		const i = this.shape.index.get(name);
		let old: Value | undefined;
		if (i !== undefined) {
			old = this.vals![i];
			this.vals![i] = v;
		} else {
			this.shape = this.shape.with(name);
			if (this.vals === null) this.vals = [v];
			else this.vals.push(v);
		}
		if (this.gcFlags & GCFlag.Released) return;
		incRef(v);
		if (old !== undefined) decRef(old);
		// Measured: a non-null tag keeps an object alive (it can still be found with locate(tag)).
		if (name === "tag" && (old ?? null) === null !== (v === null)) {
			if (v !== null) {
				this.rc++;
				taggedDatums.add(this);
			} else {
				taggedDatums.delete(this);
				decRef(this);
			}
		}
	}

	/** Forgets every written var (a turf re-typed in place), releasing their references. */
	clearVars(): void {
		const tagged = (this.ownVar("tag") ?? null) !== null;
		if (!(this.gcFlags & GCFlag.Released) && this.vals) for (const v of this.vals) decRef(v);
		this.shape = ROOT_SHAPE;
		this.vals = null;
		if (tagged) {
			taggedDatums.delete(this);
			if (!(this.gcFlags & GCFlag.Released)) decRef(this);
		}
	}

	get varsView(): VarsList {
		return (this.varsList ??= new VarsList(this, null, null));
	}

	/** `vars` with the type's own global/static vars included (read and written through `globals`). */
	varsViewWith(globals: Value[], names: string[] | null, writer: ((name: string, v: Value) => void) | null = null, identity: (() => Value) | null = null): VarsList {
		return (this.varsList ??= new VarsList(this, globals, names, writer, identity));
	}

	override toString(): string {
		return `[object ${this.type.path}]`;
	}
}

/** Every object with a non-null tag, for `locate(tag)` (atoms are also found through the map). */
export const taggedDatums = new Set<DMObject>();

/**
 * Releases the references an object or list holds (it was freed, or `del`eted). Later writes to it
 * don't count. Its tag stays (a deleted object can't be located anyway).
 */
export function releaseRefs(n: GCNode): void {
	if (n.gcFlags & GCFlag.Released) return;
	n.gcFlags |= GCFlag.Released;
	if (n instanceof DMObject) {
		if (n.vals) for (const v of n.vals) decRef(v);
		if ((n.ownVar("tag") ?? null) !== null) taggedDatums.delete(n);
	} else if (n instanceof DMList) {
		for (const v of n.items) decRef(v);
		const a = n.assoc;
		if (a !== null) {
			if (Array.isArray(a)) for (let i = 1; i < a.length; i += 2) decRef(a[i]); // no temporary array (assocValues)
			else for (const v of a.values()) decRef(v);
		}
	}
}

/** Reads through a reference: a deleted object reads as null, as in BYOND where `del` nulls every reference. */
export function live(v: Value): Value {
	if (v !== null && typeof v === "object" && (v as DMObject).deleted === true) return null;
	return v;
}

/**
 * Up to this many associated values a list keeps them in a flat [key, value, key, value...] array,
 * searched by scanning; more go to a Map. Measured in Firefox (memory work): a Map costs ~300 bytes
 * with 3 entries and ~750 with 13, the array about a third of that; the world holds ~400k of them
 * (armor, atmos_adjacent_turfs, gases...).
 */
const SMALL_ASSOC_MAX = 16;

/** Position of key k in a small assoc array, or -1. Same keys as a Map's (SameValueZero), as no NaN key
 * can get a value: a number index is always positional. */
function pairOf(a: Value[], k: Value): number {
	for (let i = 0; i < a.length; i += 2) if (a[i] === k) return i;
	return -1;
}

/** Every associated value (for code that walks references). */
export function assocValues(a: Value[] | Map<Value, Value>): Iterable<Value> {
	if (!Array.isArray(a)) return a.values();
	const out: Value[] = [];
	for (let i = 1; i < a.length; i += 2) out.push(a[i]);
	return out;
}

/** the contents of a list whose assoc storage is shared copy-on-write (DMList.shareAssoc). Never written. */
export interface SharedAssoc {
	readonly items: readonly Value[];
	readonly assoc: Value[] | Map<Value, Value>;
}

/** a big list's search state (DMList.index); a list with an index has GCFlag.Indexed. */
interface ListSearch {
	index: Map<Value, number> | null;
	/** Items scanned by searches so far; the index is built once this passes INDEX_BUILD_SCANS lengths. */
	scanWork: number;
	/** Where findOnly starts looking. */
	searchHint: number;
}
/** Saved in world snapshots (snapshot.ts SIDE_TABLES). */
export const listSearch = new WeakMap<DMList, ListSearch>();

/** Lists shorter than this are always searched by scanning. */
const INDEX_MIN_LEN = 512;
/** Build a list's index once its searches have scanned this many times its length (a Map build costs
 * about this many native scans). */
const INDEX_BUILD_SCANS = 32;

/**
 * True when `isEqual(live(x), v)` is just `x === v`, so the native Array search gives the same answer
 * (much faster on the big lists tg keeps, like SSair.active_turfs): numbers, text, lists, live objects,
 * and the values compared by identity (type paths, procs, list literals; see isEqual).
 * Not for null (a deleted object reads as null) or file resources (compared by path).
 */
function strictEqualIsEnough(v: Value): boolean {
	if (v === null || v instanceof Resource) return false;
	return !(v instanceof DMObject) || !v.deleted;
}

function indexOutOfBounds(): DMRuntimeError {
	return new DMRuntimeError("list index out of bounds");
}

/**
 * A DM list: ordered items plus an optional association map. Keys of the map are items (text,
 * objects, types); a number index is always positional. Measured in 511:
 *  - `L[k] = v` for a key not in the list appends k; a key listed twice shares one value.
 *  - Remove/`-=` drop the LAST occurrence, and the key's associated value goes with it (even if
 *    another copy of the key remains).
 *  - Reading a missing key gives null (no error); a bad number index is "list index out of bounds";
 *    a fractional index is truncated.
 */
/** the one array every empty list (and atom `contents`) shares until its first item arrives. Not frozen: frozen cost ~5% speed (measured A/B), and with it on, npm test and test:translated found no write site missing own(). */
export const EMPTY_ITEMS: Value[] = [] as Value[];

export class DMList extends GCNode {
	/** Items. Change them only through the methods below, which keep the reference counts. */
	declare items: Value[];
	/** Associated values: none (null), a flat [key, value...] array while small (SMALL_ASSOC_MAX), else a Map. */
	declare assoc: Value[] | Map<Value, Value> | null;
	// a list has only rc, gcFlags, items and assoc as fields. SpiderMonkey gives objects made by a class
	// constructor 4 inline slots and puts the rest in a separate 64-byte buffer (measured, Firefox 156: 1M objects
	// with 8 fields 120 MB, with 4 fields 56 MB); with 1.57M lists in the world that buffer was ~100 MB. The search
	// state of the few big searched lists lives in `listSearch` instead.

	/** `view`: a live view over someone else's array (args, contents, vars) whose items it doesn't count. */
	constructor(items: Value[] = EMPTY_ITEMS, view = false) {
		super(view);
		this.items = items;
		// Plain stores, not field initializers (see GCNode's constructor).
		this.assoc = null;
		if (!view) for (const v of items) incRef(v);
	}

	/**
	 * How many times each item occurs (by ===), so a search for something that isn't there costs one
	 * Map lookup instead of a scan. Built only for big lists that get searched a lot (see `mayContain`),
	 * never for views (their arrays change behind their back). tg's hot case: `SSair.setup_allturfs`
	 * does `active_turfs -= T` for all ~800k turfs while active_turfs holds ~60k, nearly all misses.
	 */
	get index(): Map<Value, number> | null {
		return this.gcFlags & GCFlag.Indexed ? listSearch.get(this)!.index : null;
	}

	/** Item v now occurs once more in `items` (keeps the index). */
	private indexIn(v: Value): void {
		if (!(this.gcFlags & GCFlag.Indexed)) return;
		const m = listSearch.get(this)!.index!;
		m.set(v, (m.get(v) ?? 0) + 1);
	}

	/** One occurrence of item v has left `items`. */
	private indexOut(v: Value): void {
		if (!(this.gcFlags & GCFlag.Indexed)) return;
		const m = listSearch.get(this)!.index!;
		const c = m.get(v)!;
		if (c <= 1) m.delete(v);
		else m.set(v, c - 1);
	}

	/** Forget the index (for code that rewrites `items` directly). */
	dropIndex(): void {
		this.gcFlags &= ~GCFlag.Indexed;
		listSearch.delete(this);
	}

	/**
	 * For a search for v (already known to satisfy strictEqualIsEnough): false when v is certainly
	 * not an item. Builds the index once scanning has cost enough to pay for it.
	 */
	private mayContain(v: Value): boolean {
		if (v !== v) return false; // NaN: the native search never finds it either
		if (this.gcFlags & GCFlag.Indexed) return listSearch.get(this)!.index!.has(v);
		const n = this.items.length;
		if (n < INDEX_MIN_LEN || this.gcFlags & GCFlag.View) return true;
		let s = listSearch.get(this);
		if (s === undefined) listSearch.set(this, (s = { index: null, scanWork: 0, searchHint: 0 }));
		s.scanWork += n;
		if (s.scanWork < n * INDEX_BUILD_SCANS) return true;
		const m = (s.index = new Map());
		for (const x of this.items) m.set(x, (m.get(x) ?? 0) + 1);
		this.gcFlags |= GCFlag.Indexed;
		return m.has(v);
	}

	/** Counts a reference this list now holds (not for views, or once released). */
	protected hold(v: Value): void {
		if (!(this.gcFlags & GCFlag.Released)) incRef(v);
	}

	protected drop(v: Value): void {
		if (!(this.gcFlags & GCFlag.Released)) decRef(v);
	}

	/**
	 * before an assoc write, takes a private copy of shared assoc storage (GCFlag.AssocShared). The
	 * reference counts don't change: every list sharing storage already counts its values as its own.
	 */
	private ownAssoc(): void {
		this.gcFlags &= ~GCFlag.AssocShared;
		const a = this.assoc;
		if (a !== null) this.assoc = Array.isArray(a) ? a.slice() : new Map(a);
	}

	/**
	 * this list's items and assoc storage, to give later lists the same contents (withSharedAssoc).
	 * From now on this list copies its assoc storage before writing to it. Null when it has no assoc values.
	 */
	shareAssoc(): SharedAssoc | null {
		const a = this.assoc;
		if (a === null) return null;
		this.gcFlags |= GCFlag.AssocShared;
		return { items: this.items.slice(), assoc: a };
	}

	/** a new list with these items, sharing the assoc storage (copy-on-write) with every other such list. */
	static withSharedAssoc(s: SharedAssoc): DMList {
		const l = new DMList(s.items.slice());
		const a = s.assoc;
		l.assoc = a;
		l.gcFlags |= GCFlag.AssocShared;
		if (Array.isArray(a)) for (let i = 1; i < a.length; i += 2) l.hold(a[i]);
		else for (const v of a.values()) l.hold(v);
		return l;
	}

	/** Sets an associated value (the key must already be an item). */
	setAssoc(k: Value, v: Value): void {
		if (this.gcFlags & GCFlag.AssocShared) this.ownAssoc();
		const a = this.assoc;
		let old: Value | undefined;
		if (a === null) this.assoc = [k, v];
		else if (Array.isArray(a)) {
			const i = pairOf(a, k);
			if (i >= 0) {
				old = a[i + 1];
				a[i + 1] = v;
			} else if (a.length < SMALL_ASSOC_MAX * 2) a.push(k, v);
			else {
				const m = new Map<Value, Value>();
				for (let j = 0; j < a.length; j += 2) m.set(a[j], a[j + 1]);
				m.set(k, v);
				this.assoc = m;
			}
		} else {
			old = a.get(k);
			a.set(k, v);
		}
		this.hold(v);
		if (old !== undefined) this.drop(old);
	}

	private deleteAssoc(k: Value): void {
		let a = this.assoc;
		if (a === null) return;
		if (this.gcFlags & GCFlag.AssocShared) {
			if (this.assocOf(k) === undefined) return;
			this.ownAssoc();
			a = this.assoc!;
		}
		let old: Value | undefined;
		if (Array.isArray(a)) {
			const i = pairOf(a, k);
			if (i < 0) return;
			old = a[i + 1];
			if (a.length === 2) this.assoc = null;
			else a.splice(i, 2);
		} else {
			old = a.get(k);
			if (old === undefined) return;
			a.delete(k);
		}
		this.drop(old);
	}

	/** True when some item has an associated value. */
	get hasAssoc(): boolean {
		const a = this.assoc;
		return a !== null && (Array.isArray(a) || a.size > 0);
	}

	/** Replaces item i (0-based) in place. */
	setItem(i: number, v: Value): void {
		const old = this.items[i];
		this.items[i] = v;
		if (this.gcFlags & GCFlag.Indexed) {
			this.indexIn(v);
			this.indexOut(old);
		}
		this.hold(v);
		this.drop(old);
	}

	/** the list's own array, made on the first write when it still shares EMPTY_ITEMS. */
	protected own(): Value[] {
		const a = this.items;
		return a === EMPTY_ITEMS ? (this.items = []) : a;
	}

	/** Removes items [from, to) (0-based) with their associated values, returning them. */
	private spliceOut(from: number, to: number): Value[] {
		if (this.items === EMPTY_ITEMS) return [];
		const removed = this.items.splice(from, to - from);
		for (const k of removed) {
			this.indexOut(k);
			if (this.assoc) this.deleteAssoc(k);
			this.drop(k);
		}
		return removed;
	}

	get len(): number {
		return this.items.length;
	}

	setLen(n: number): void {
		// Measured: a negative length becomes 0, no error.
		n = Math.max(0, Math.trunc(n));
		if (n < this.items.length) {
			this.spliceOut(n, this.items.length);
		} else {
			while (this.items.length < n) {
				this.own().push(null);
				this.indexIn(null);
			}
		}
	}

	/** `L[index]` */
	get(index: Value): Value {
		if (typeof index === "number") {
			const i = Math.trunc(index);
			if (i < 1 || i > this.items.length) throw indexOutOfBounds();
			return live(this.items[i - 1]);
		}
		const v = this.assocOf(index);
		return v === undefined ? null : live(v);
	}

	/** `L[index] = v` */
	set(index: Value, v: Value): void {
		if (typeof index === "number") {
			const i = Math.trunc(index);
			if (i < 1 || i > this.items.length) throw indexOutOfBounds();
			this.setItem(i - 1, v);
			return;
		}
		if (!this.contains(index)) {
			this.own().push(index);
			this.indexIn(index);
			this.hold(index);
		}
		this.setAssoc(index, v);
	}

	/** Associated value of an item, or undefined when it has none (used when copying items between lists). */
	assocOf(key: Value): Value | undefined {
		const a = this.assoc;
		if (a === null) return undefined;
		if (Array.isArray(a)) {
			const i = pairOf(a, key);
			return i < 0 ? undefined : a[i + 1];
		}
		return a.get(key);
	}

	contains(v: Value): boolean {
		if (strictEqualIsEnough(v)) {
			if (!this.mayContain(v)) return false;
			if (this.gcFlags & GCFlag.Indexed) return true; // the index is exact once built
			return this.items.indexOf(v) >= 0;
		}
		return this.indexOf(v) >= 0;
	}

	/** 0-based index of the first occurrence in [from, to), or -1. */
	indexOf(v: Value, from = 0, to = this.items.length): number {
		if (strictEqualIsEnough(v)) {
			if (!this.mayContain(v)) return -1;
			const i = this.items.indexOf(v, from);
			return i >= 0 && i < to ? i : -1;
		}
		for (let i = from; i < to; i++) if (isEqual(live(this.items[i]), v)) return i;
		return -1;
	}

	lastIndexOf(v: Value): number {
		if (strictEqualIsEnough(v)) {
			if (!this.mayContain(v)) return -1;
			if (this.gcFlags & GCFlag.Indexed && listSearch.get(this)!.index!.get(v) === 1) return this.findOnly(v);
			return this.items.lastIndexOf(v);
		}
		for (let i = this.items.length - 1; i >= 0; i--) if (isEqual(live(this.items[i]), v)) return i;
		return -1;
	}

	/**
	 * Position of an item that occurs exactly once, searching outward from where the last such search
	 * found one: tg tends to remove neighbouring items one after another (setup_allturfs removes
	 * active_turfs from the front, in the order they were added).
	 */
	private findOnly(v: Value): number {
		const a = this.items;
		const n = a.length;
		const s = listSearch.get(this)!;
		let lo = Math.min(s.searchHint, n - 1);
		let hi = lo + 1;
		while (lo >= 0 || hi < n) {
			if (lo >= 0) {
				if (a[lo] === v) return (s.searchHint = lo);
				lo--;
			}
			if (hi < n) {
				if (a[hi] === v) return (s.searchHint = hi);
				hi++;
			}
		}
		return -1;
	}

	/** gives a new, empty list these items (the array is taken, not copied). */
	adopt(items: Value[]): void {
		this.items = items;
		for (const v of items) this.hold(v);
	}

	/** Appends one item (not flattened), carrying an associated value if given. */
	push(v: Value, assocValue?: Value): void {
		this.own().push(v);
		this.indexIn(v);
		this.hold(v);
		if (assocValue !== undefined) this.setAssoc(v, assocValue);
	}

	/** `L += x` / Add(): a list argument is flattened (its items and their values appended). */
	add(v: Value): void {
		if (v instanceof DMList) {
			for (const x of v.items.slice()) this.push(x, v.assocOf(x));
		} else {
			this.own().push(v);
			this.indexIn(v);
			this.hold(v);
		}
	}

	/** Removes the last occurrence; returns whether anything was removed. */
	removeOne(v: Value): boolean {
		const i = this.lastIndexOf(v);
		if (i < 0) return false;
		const a = this.items;
		const old = a[i];
		// Near the front, shift the few items before i up one and drop the first slot: V8's shift()
		// moves the array's start instead of copying the rest, which splice would do (measured: this
		// is most of what's left of SSair's init once searches are cheap).
		if (i < a.length >> 2) {
			a.copyWithin(1, 0, i);
			a.shift();
		} else {
			if (i === a.length - 1) a.pop(); // splice would allocate the removed-items array
			else a.splice(i, 1);
		}
		this.indexOut(old);
		this.deleteAssoc(v);
		this.drop(old);
		return true;
	}

	/** `L -= x` / Remove(): a list argument removes each of its items once. */
	remove(v: Value): boolean {
		if (v instanceof DMList) {
			let any = false;
			for (const x of v.items.slice()) if (this.removeOne(live(x))) any = true;
			return any;
		}
		return this.removeOne(v);
	}

	/**
	 * Converts BYOND (Start, End) arguments to a 0-based [from, to) slice. End 0 means "to the end".
	 * Measured: Start < 1 or End past len+1 is "list index out of bounds". (Start > End: unverified, empty.)
	 */
	range(start: Value, end: Value): [number, number] {
		let s = typeof start === "number" ? Math.trunc(start) : 1;
		let e = typeof end === "number" ? Math.trunc(end) : 0;
		const n = this.items.length;
		if (e === 0) e = n + 1;
		if (s < 1 || s > n + 1 || e < 1 || e > n + 1) throw indexOutOfBounds();
		if (e < s) e = s;
		return [s - 1, e - 1];
	}

	copy(from = 0, to = this.items.length): DMList {
		const out = new DMList(this.items.slice(from, to));
		if (this.assoc) {
			for (const k of out.items) {
				const v = this.assocOf(k);
				if (v !== undefined) out.setAssoc(k, v);
			}
		}
		return out;
	}

	cut(from: number, to: number): void {
		this.spliceOut(from, to);
	}

	/**
	 * Inserts before 0-based position `at` (flattening lists). Measured (tests/dm/cow.dm, test_cow_cut_insert_swap):
	 * a list argument's items go in without their associated values.
	 */
	insert(at: number, vals: Value[]): void {
		const ins: Value[] = [];
		for (const v of vals) {
			if (v instanceof DMList) for (const x of v.items) ins.push(x);
			else ins.push(v);
		}
		if (ins.length === 0) return;
		this.own().splice(at, 0, ...ins);
		for (const x of ins) {
			this.indexIn(x);
			this.hold(x);
		}
	}

	override toString(): string {
		return "/list";
	}
}

/**
 * `args`: a list view over the frame's argument array (the same array, so `args[1] = x` changes
 * the first argument). Measured: its length is max(passed, declared) arguments.
 */
export class ArgsList extends DMList {
	constructor(items: Value[]) {
		super(items, true);
	}
}

/** `datum.vars`: item names are the object's var names; `vars["x"]` reads and writes the var. */
export class VarsList extends DMList {
	/**
	 * Measured (tg boot: "607 global variables"): BYOND's `vars` also lists the type's global and
	 * static vars (not the root-level globals every type inherits). Their order in the list: unverified.
	 */
	constructor(
		readonly obj: DMObject,
		private readonly globals: Value[] | null,
		/** Every name in BYOND's order, or null for the type's vars in map order. */
		names: string[] | null,
		/** Writes go through the VM's var write (so `vars["dir"] = 0` follows the same rules as `dir = 0`). */
		private readonly writer: ((name: string, v: Value) => void) | null = null,
		/** A fresh identity matrix: a null `transform` reads as one. */
		private readonly identity: (() => Value) | null = null,
	) {
		super(names ? names.slice() : [...obj.type.vars.keys()], true);
		this.viewTarget = obj;
	}

	private globalIndex(name: Value): number | undefined {
		if (this.globals === null || typeof name !== "string" || this.obj.hasVar(name)) return undefined;
		return this.obj.type.globalVars.get(name);
	}

	override get(index: Value): Value {
		const g = this.globalIndex(index);
		if (g !== undefined) return live(this.globals![g]);
		if (typeof index === "string") {
			if (!this.obj.hasVar(index)) return null;
			const v = live(this.obj.getVar(index));
			return v === null && index === "transform" && this.identity ? this.identity() : v;
		}
		return super.get(index);
	}

	override set(index: Value, v: Value): void {
		const g = this.globalIndex(index);
		if (g !== undefined) {
			const old = this.globals![g];
			this.globals![g] = v;
			incRef(v);
			decRef(old);
			return;
		}
		if (typeof index === "string" && this.obj.hasVar(index)) {
			if (this.writer) this.writer(index, v);
			else this.obj.setVar(index, v);
			return;
		}
		throw new DMRuntimeError("bad index"); // unverified wording
	}

	override assocOf(key: Value): Value | undefined {
		const g = this.globalIndex(key);
		if (g !== undefined) return this.globals![g];
		return typeof key === "string" && this.obj.hasVar(key) ? this.obj.getVar(key) : undefined;
	}
}

// ---- list operators (all measured in 511 with duplicate items, see test_list_ops_dupes) -------

/** `A + B`: a copy of A with B (or B's items) appended. `L + null` appends a null. */
export function listAdd(a: DMList, b: Value): DMList {
	const out = a.copy();
	out.add(b);
	return out;
}

/** `A - B`: a copy of A with the last occurrence of B (or of each of B's items) removed. */
export function listSubtract(a: DMList, b: Value): DMList {
	const out = a.copy();
	out.remove(b);
	return out;
}

/** `A | B` = A + (B - A) */
export function listOr(a: DMList, b: Value): DMList {
	const out = a.copy();
	out.add(b instanceof DMList ? listSubtract(b, a) : a.contains(b) ? new DMList() : new DMList([b]));
	return out;
}

/** `A & B` = A - (A - B) */
export function listAnd(a: DMList, b: Value): DMList {
	const bl = b instanceof DMList ? b : new DMList([b]);
	return listSubtract(a, listSubtract(a, bl));
}

/** `A ^ B` = (A - B) + (B - A) */
export function listXor(a: DMList, b: Value): DMList {
	const bl = b instanceof DMList ? b : new DMList([b]);
	const out = listSubtract(a, bl);
	out.add(listSubtract(bl, a));
	return out;
}

/** Longest left side `listAndInPlace` handles without the temp lists (its duplicate check is quadratic). */
const AND_IN_PLACE_MAX = 32;

/**
 * `A &= B`, the same result as listAssignFrom(A, listAnd(A, B)) without its temp lists or the
 * cut-and-repush (gas_mixture/copy_from does `cached_gases &= sample_gases` for every pipeline each
 * SSair tick: 40% of what outlived the nursery in gc4). When A is a plain list of distinct, non-null,
 * non-deleted, non-resource items, A - (A - B) is "A without the items B lacks": each such item goes
 * with its associated value, the rest keep their order and values. Anything else takes the old path.
 */
export function listAndInPlace(a: DMList, b: Value): DMList {
	const items = a.items;
	const n = items.length;
	if (!(b instanceof DMList) || Object.getPrototypeOf(a) !== DMList.prototype || n > AND_IN_PLACE_MAX) {
		return listAssignFrom(a, listAnd(a, b));
	}
	for (let i = 0; i < n; i++) {
		const x = items[i];
		if (!strictEqualIsEnough(x)) return listAssignFrom(a, listAnd(a, b));
		for (let j = 0; j < i; j++) if (items[j] === x) return listAssignFrom(a, listAnd(a, b));
	}
	const plainB = Object.getPrototypeOf(b) === DMList.prototype;
	for (let i = n - 1; i >= 0; i--) {
		const x = a.items[i];
		if (!(plainB ? b.contains(x) : b.items.indexOf(x) >= 0)) a.removeOne(x);
	}
	return a;
}

/** In-place versions (`+=` etc.): the list itself changes, so every reference to it sees the result. */
export function listAssignFrom(a: DMList, result: DMList): DMList {
	a.cut(0, a.items.length);
	for (const x of result.items) a.push(x, result.assocOf(x));
	return a;
}

/**
 * client.screen: `+=` of something already in the list leaves it once (measured on BYOND 511:
 * tests/screen-dup). tg does plain `client.screen += I` in places, and its later `-=` must clear it.
 */
export class ScreenList extends DMList {
	override add(v: Value): void {
		for (const x of v instanceof DMList ? v.items.slice() : [v]) {
			const p = live(x);
			if (!this.items.some((y) => live(y) === p)) this.push(x);
		}
	}
}

