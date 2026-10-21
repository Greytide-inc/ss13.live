// World snapshot: save a running VM's whole state to bytes, and load it into a fresh VM, so a
// page can skip tg's ~65 s of world init by starting from a world saved at the lobby.
//
// How it works: a generic walk of the JS object graph from `vm` (plus the few module-level tables
// the VM keeps outside itself: gc.heap.zct, the ref table, tagged datums). Every object reached is
// written once, by class, with its own enumerable properties; references between objects become ids.
// Things that come from the compiled program are not copied but named: DMType and DMProc by id, a
// proc's decoded code by its proc. So loading needs the same game build (build/game-types.js; proc ids are rt.def
// positions, tgstation.json is gone) and vfs bundle as saving.
//
// Loading doesn't run any constructor: objects are made with Object.create(prototype) and filled in.
// Objects the fresh VM already has at the same property path from `vm` (vm.map, vm.clients,
// vm.sched, vm.vfs, vm.map.host...) are reused and overwritten instead, so closures the fresh VM
// made in its constructor (natives, map hooks, the host's worldLog...) stay wired to the live
// objects. A function value is never saved: it's "keep the fresh one" (KEEP), which is only legal on
// such a reused object; a function anywhere else is a blocker and the save fails with its path.
//
// WeakMaps/WeakSets can't be walked, so the ones that hold real state are "side tables": for every
// DMObject/DMList written, each table's entry for it is written too (ref texts, savefile handles,
// /icon recipes, appearance dir flags, per-client engine state).
//
// Format (all little-endian): "SS13SNAP" + u32 version + u32 metaLength + meta JSON (strings, shapes,
// host data) + u32 headLength + head bytes (one record per object: kind, shape or length, optional
// path) + body bytes (the values). Values are tagged (see T_*), numbers and ids are LEB128 varints.

import { heap } from "./gc.js";
import { ArgsList, DMList, EMPTY_ITEMS, DMObject, ScreenList, VarShape, VarsList, listSearch, taggedDatums } from "./objects.js";
import { DMProc, DMType, ListLiteral, ObjectTree, Resource } from "./objtree.js";
import { Frame, ListEnumerator, RangeEnumerator, VerbList, VM } from "./interpreter.js";
import { Scheduler, TAIL_MARK, Thread, timeOfDay } from "./scheduler.js";
import { AreaContentsList, ContentsList, DMAtom, GameMap, type Kind } from "./world.js";
import { Appearances, DMAppearance, OverlayList } from "./appearances.js";
import { Clients } from "./clients.js";
import { WorldLogOut } from "./natives-io.js";
import { Random } from "./random.js";
import { Vfs } from "../vfs/vfs.js";
import { SaveDirList, SaveNode, SavedList, SavedObject, SaveState, savefileStates } from "./savefile.js";
import { peekRef, refNext, refTable, restoreRef, setRefNext } from "./refs.js";
import { DMRuntimeError, type Value } from "./value.js";

const MAGIC = "SS13SNAP";
/** The compiled program and the VFS bundle's base files, in short: a snapshot only loads on the same ones. */
function programPrint(vm: VM): string {
	const t = vm.tree;
	const base = priv(vm.vfs).baseFiles as Map<string, string>;
	let chars = 0;
	for (const v of base.values()) chars += v.length;
	// proc ids are rt.def positions, so a moved or renamed rt.def changes what an id means: hash the paths in order (FNV-1a).
	let h = 0x811c9dc5;
	for (const p of t.procs) {
		const s = p.path;
		for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
		h = Math.imul(h ^ 10, 0x01000193);
	}
	return `types ${t.types.length}, procs ${t.procs.length} (paths ${(h >>> 0).toString(16)}), strings ${t.strings.length}, globals ${t.globalNames.length}, vfs ${base.size} files ${chars} chars`;
}
/** Arrays up to this length are loaded at their exact size (see loadSnapshot). */
const EXACT_ARRAY_MAX = 4096;
const VERSION = 5; // 5 (view-dirty): an OverlayList's 5th field is its owner, not Appearances; 4: no bytecode (Frame without code/pc/stack, no T_CODE/T_NOCODE values); DMObject vars as VarShape + vals (was a Map per object); 3 (mem3): gcFlags has AssocShared and Indexed (the mark moved up 2 bits), a list's search index is a side table

// Every class an object in the VM's state may have. Anything else is a blocker (the save names it).
const CLASSES: Function[] = [
	Object, DMObject, DMList, ArgsList, VarsList, ScreenList, DMAtom, ContentsList, AreaContentsList, GameMap,
	DMAppearance, OverlayList, Appearances, Clients, WorldLogOut, Resource, ListLiteral, Thread, Scheduler, Frame, VM,
	Random, Vfs, RangeEnumerator, ListEnumerator, VerbList, SaveNode, SavedObject, SavedList, SaveState, SaveDirList,
	DMRuntimeError, VarShape,
];
const TYPED: Function[] = [Uint8Array, Int8Array, Uint16Array, Int16Array, Uint32Array, Int32Array, Float32Array, Float64Array, Uint8ClampedArray];

/** Properties never saved: the fresh VM's own value is kept (static program data and host wiring). */
const KEEP_KEYS = new Map<Function, Set<string>>([
	[VM, new Set(["tree", "natives"])],
	[Vfs, new Set(["baseFiles", "baseDirs"])],
]);

/** Classes holding closures the VM makes per object: which function-valued keys are allowed, and how
 * loading rebuilds them (T_FN marks "was a function" in the file). */
interface Fixup { fns: Set<string>; load(vm: VM, o: Record<string, unknown>): void }
const FIXUPS = new Map<Function, Fixup>([
	// `x.vars` (interpreter.ts varsViewWith): writes go through the VM's var write; `transform` reads
	// as a fresh identity matrix.
	[VarsList, {
		fns: new Set(["writer", "identity"]),
		load: (vm, o) => {
			const obj = o.obj as DMObject;
			if (o.writer !== null) o.writer = (n: string, v: Value) => (vm as unknown as { setField(o: DMObject, n: string, v: Value): void }).setField(obj, n, v);
			if (o.identity !== null) o.identity = () => vm.identityMatrix();
		},
	}],
]);

// Value tags.
const T_NULL = 0, T_UNDEF = 1, T_TRUE = 2, T_FALSE = 3, T_INT = 4, T_F64 = 5, T_STR = 6, T_OBJ = 7, T_TYPE = 8, T_PROC = 9, T_KEEP = 12, T_FN = 13; // 10 and 11 were the bytecode's, now gone
// Object kinds (head records); +16 = has a path.
const K_PLAIN = 0, K_ARRAY = 1, K_MAP = 2, K_SET = 3, K_TYPED = 4, K_EMPTY = 5, K_PATH = 16; // K_EMPTY (mem4c): the shared frozen EMPTY_ITEMS

interface SideTable {
	name: string;
	get(vm: VM, o: object): unknown;
	set(vm: VM, o: object, v: unknown): void;
}
const priv = (x: unknown) => x as Record<string, unknown>;
const weakMapTable = (name: string, of: (vm: VM) => WeakMap<object, unknown> | null | undefined): SideTable => ({
	name,
	get: (vm, o) => of(vm)?.get(o),
	set: (vm, o, v) => void of(vm)!.set(o, v),
});
const weakSetTable = (name: string, of: (vm: VM) => WeakSet<object>): SideTable => ({
	name,
	get: (vm, o) => (of(vm).has(o) ? true : undefined),
	set: (vm, o) => void of(vm).add(o),
});
const SIDE_TABLES: SideTable[] = [
	{ name: "ref", get: (_vm, o) => peekRef(o), set: (_vm, o, v) => restoreRef(o, v as string) },
	weakMapTable("savefile", () => savefileStates as WeakMap<object, unknown>),
	weakMapTable("iconRecipe", (vm) => vm.iconRecipes as WeakMap<object, unknown> | null),
	weakSetTable("dirSet", (vm) => vm.appearances.dirSet),
	weakSetTable("dirFixed", (vm) => vm.appearances.dirFixed),
	weakMapTable("clientSkin", (vm) => priv(vm.clients).skins as WeakMap<object, unknown>),
	weakMapTable("statState", (vm) => priv(vm.clients).statState as WeakMap<object, unknown>),
	weakMapTable("menus", (vm) => priv(vm.clients).menus as WeakMap<object, unknown>),
	weakMapTable("clientInput", (vm) => priv(vm.clients).input as WeakMap<object, unknown>),
	weakMapTable("listSearch", () => listSearch as WeakMap<object, unknown>), // big lists' search index (last: v2 files number the tables)
];

class Writer {
	buf = new Uint8Array(1 << 20);
	n = 0;
	private f64 = new Float64Array(1);
	private f64b = new Uint8Array(this.f64.buffer);
	private grow(k: number): void {
		if (this.n + k <= this.buf.length) return;
		let len = this.buf.length * 2;
		while (len < this.n + k) len *= 2;
		const b = new Uint8Array(len);
		b.set(this.buf.subarray(0, this.n));
		this.buf = b;
	}
	u8(x: number): void {
		if (this.n >= this.buf.length) this.grow(1);
		this.buf[this.n++] = x;
	}
	uv(x: number): void {
		this.grow(10);
		while (x >= 128) {
			this.buf[this.n++] = (x % 128) | 128;
			x = Math.floor(x / 128);
		}
		this.buf[this.n++] = x;
	}
	/** zigzag signed varint (int32 range) */
	sv(x: number): void {
		this.uv(x >= 0 ? x * 2 : -x * 2 - 1);
	}
	d(x: number): void {
		this.grow(8);
		this.f64[0] = x;
		this.buf.set(this.f64b, this.n);
		this.n += 8;
	}
	bytes(b: Uint8Array): void {
		this.grow(b.length);
		this.buf.set(b, this.n);
		this.n += b.length;
	}
	get out(): Uint8Array {
		return this.buf.subarray(0, this.n);
	}
}

class Reader {
	n = 0;
	private f64 = new Float64Array(1);
	private f64b = new Uint8Array(this.f64.buffer);
	constructor(readonly buf: Uint8Array) {}
	u8(): number {
		return this.buf[this.n++];
	}
	uv(): number {
		let x = 0, mul = 1, b: number;
		do {
			b = this.buf[this.n++];
			x += (b & 127) * mul;
			mul *= 128;
		} while (b & 128);
		return x;
	}
	sv(): number {
		const u = this.uv();
		return u % 2 === 0 ? u / 2 : -(u + 1) / 2;
	}
	d(): number {
		for (let i = 0; i < 8; i++) this.f64b[i] = this.buf[this.n + i];
		this.n += 8;
		return this.f64[0];
	}
	bytes(k: number): Uint8Array {
		const b = this.buf.slice(this.n, this.n + k);
		this.n += k;
		return b;
	}
}

export interface SnapshotStats {
	objects: number;
	bytes: number;
	ms: number;
	/** Objects per class name, largest first. */
	byClass: [string, number][];
	strings: number;
	shapes: number;
	sideEntries: Record<string, number>;
}

/** Thrown by saveSnapshot when the state holds something it can't save; the message lists every one. */
export class SnapshotBlocked extends Error {
	constructor(readonly blockers: string[]) {
		super(`world snapshot blocked (${blockers.length}):\n  ${blockers.slice(0, 40).join("\n  ")}`);
	}
}

interface Meta {
	version: number;
	/** What the snapshot was made from (compiled program and VFS bundle); loading checks it matches. */
	program: string;
	strings: string[];
	shapes: [number, string[]][];
	classes: string[];
	objects: number;
	host: unknown;
}

/**
 * Saves the VM's whole state. Call it between ticks (no proc running on the JS stack). `host` is any
 * JSON the host wants back on load (e.g. its log so far). Throws SnapshotBlocked listing every
 * closure, unknown class or weak collection it met that it can't save.
 */
export function saveSnapshot(vm: VM, host: unknown = null): { bytes: Uint8Array; stats: SnapshotStats } {
	// sleeping frames waiting to start a named tail lose their generator for the save (it's re-made from the frame's data
	// afterwards, so the running VM goes on exactly as a loaded one would).
	const tails: Frame[] = [];
	for (const t of vm.sched.sleepers()) {
		const fr = t.frames;
		for (let i = 0; i < fr.length; i++) {
			const f = fr[i];
			if (f.gen === null || f.pendingError !== null || f.locals[0] !== TAIL_MARK || (i > 0 && fr[i - 1].gen === f.gen)) continue;
			f.gen = null;
			f.vars = null;
			f.resume = undefined;
			tails.push(f);
		}
	}
	try {
		return save(vm, host);
	} finally {
		for (const f of tails) startTail(f);
	}
}

/** makes a frame waiting to start a tail (locals [TAIL_MARK, name, ...values]) runnable; set by translate/runtime.ts install. */
let tailStarter: ((f: Frame) => void) | null = null;
export function setTailStarter(fn: (f: Frame) => void): void {
	tailStarter = fn;
}
function startTail(f: Frame): void {
	if (tailStarter === null) throw new Error(`${f.proc.path}: a sleeping frame waits to start tail ${String(f.locals[1])}, but no translated game code is installed`);
	tailStarter(f);
}

function save(vm: VM, host: unknown): { bytes: Uint8Array; stats: SnapshotStats } {
	const t0 = Date.now();
	const tree = vm.tree;
	const classIndex = new Map<object, number>(CLASSES.map((c, i) => [c.prototype as object, i]));
	const typedIndex = new Map<object, number>(TYPED.map((c, i) => [c.prototype as object, i]));

	const ids = new Map<object, number>();
	const queue: object[] = [];
	const paths: (string | null)[] = [];
	const parent: number[] = [];
	const parentKey: string[] = [];
	const blockers: string[] = [];
	const strings: string[] = [];
	const stringIds = new Map<string, number>();
	const shapes: [number, string[]][] = [];
	const shapeCache = new Map<number, number[]>(); // class -> shape ids seen for it
	const byClass = new Map<string, number>();
	const sideCount: Record<string, number> = {};
	const head = new Writer();
	const body = new Writer();
	const side = new Writer();
	let sideN = 0;

	const pathOf = (id: number): string => {
		const parts: string[] = [];
		for (let i = id; i > 0 && parts.length < 30; i = parent[i]) parts.push(parentKey[i]);
		return "vm" + parts.reverse().join("");
	};
	const str = (s: string): number => {
		let i = stringIds.get(s);
		if (i === undefined) {
			i = strings.length;
			strings.push(s);
			stringIds.set(s, i);
		}
		return i;
	};
	/** Blockers grouped by kind and path pattern (indexes and ref texts replaced by *), with a count and one example. */
	const blockerGroups = new Map<string, { n: number; example: string }>();
	const block = (from: number, key: string, what: string) => {
		const path = `${pathOf(from)}${key}`;
		const pattern = `${what} at ${path.replace(/\[\d+\]/g, "[*]").replace(/\.get\([^)]*\)/g, ".get(*)").replace(/\.(key|item)\d+/g, ".$1*")}`;
		const g = blockerGroups.get(pattern);
		if (g) g.n++;
		else blockerGroups.set(pattern, { n: 1, example: path });
	};
	const idOf = (o: object, from: number, key: string, path: string | null): number => {
		let id = ids.get(o);
		if (id === undefined) {
			id = queue.length;
			ids.set(o, id);
			queue.push(o);
			paths.push(path);
			parent.push(from);
			parentKey.push(key);
		}
		return id;
	};

	/** Writes one value. `from`/`key` name where it sits (for paths and blocker messages); `owner` is
	 * the path of the object holding it as a named property, or null (array/map/set items). */
	const value = (w: Writer, v: unknown, from: number, key: string, ownerPath: string | null, propName: string | null): void => {
		switch (typeof v) {
			case "number":
				if ((v | 0) === v && !Object.is(v, -0)) {
					w.u8(T_INT);
					w.sv(v);
				} else {
					w.u8(T_F64);
					w.d(v);
				}
				return;
			case "string":
				w.u8(T_STR);
				w.uv(str(v));
				return;
			case "boolean":
				w.u8(v ? T_TRUE : T_FALSE);
				return;
			case "undefined":
				w.u8(T_UNDEF);
				return;
			case "function":
				if (ownerPath === null) block(from, key, "a function (closure) in an object the fresh VM doesn't have");
				w.u8(T_KEEP);
				return;
			case "object":
				break;
			default:
				block(from, key, `a ${typeof v}`);
				w.u8(T_UNDEF);
				return;
		}
		if (v === null) {
			w.u8(T_NULL);
			return;
		}
		if (v instanceof DMType) {
			if (v.id < 0 && v !== vm.appearances.type) block(from, key, `an unknown DMType ${v.path}`);
			w.u8(T_TYPE);
			w.sv(v.id);
			return;
		}
		if (v instanceof DMProc) {
			if (v.id < 0 && v !== tree.globalInitProc) block(from, key, `an unknown DMProc ${v.path}`);
			w.u8(T_PROC);
			w.sv(v.id);
			return;
		}
		if (v instanceof ObjectTree) {
			block(from, key, "the ObjectTree");
			w.u8(T_NULL);
			return;
		}
		if (v instanceof WeakMap || v instanceof WeakSet) {
			if (ownerPath === null) block(from, key, "a WeakMap/WeakSet the fresh VM doesn't have");
			w.u8(T_KEEP);
			return;
		}
		w.u8(T_OBJ);
		w.uv(idOf(v, from, key, ownerPath !== null && propName !== null ? `${ownerPath}.${propName}` : null));
	};

	idOf(vm, 0, "", "");
	parent[0] = -1;
	// Module-level state: containers the VM keeps outside itself. Queued right after vm (their items
	// are only met when they're processed, after vm's own properties, so those keep their paths).
	const roots = new Writer();
	const rootVals: [string, unknown][] = [
		["zct", heap.zct],
		["byRef", refTable()],
		["refNext", refNext()],
		["tagged", taggedDatums],
		["freed", heap.freed],
	];
	for (const [k, v] of rootVals) value(roots, v, 0, `{root ${k}}`, null, null);
	for (let id = 0; id < queue.length; id++) {
		const o = queue[id] as Record<string, unknown>;
		const path = paths[id];
		const pflag = path !== null ? K_PATH : 0;
		const writePath = () => {
			if (path !== null) head.uv(str(path));
		};
		const proto = Object.getPrototypeOf(o);
		if ((o as unknown) === EMPTY_ITEMS) {
			head.u8(K_EMPTY | pflag);
			head.uv(0);
			writePath();
			byClass.set("Array", (byClass.get("Array") ?? 0) + 1);
			continue;
		}
		if (Array.isArray(o)) {
			if (proto !== Array.prototype) block(id, "", "an Array subclass");
			head.u8(K_ARRAY | pflag);
			head.uv(o.length);
			writePath();
			const a = o as unknown[];
			for (let i = 0; i < a.length; i++) value(body, a[i], id, `[${i}]`, null, null);
			byClass.set("Array", (byClass.get("Array") ?? 0) + 1);
			continue;
		}
		if (o instanceof Map) {
			head.u8(K_MAP | pflag);
			head.uv(o.size);
			writePath();
			let i = 0;
			for (const [k, v] of o) {
				value(body, k, id, `.key${i}`, null, null);
				value(body, v, id, `.get(${typeof k === "string" ? JSON.stringify(k) : "#" + i})`, null, null);
				i++;
			}
			byClass.set("Map", (byClass.get("Map") ?? 0) + 1);
			continue;
		}
		if (o instanceof Set) {
			head.u8(K_SET | pflag);
			head.uv(o.size);
			writePath();
			let i = 0;
			for (const v of o) value(body, v, id, `.item${i++}`, null, null);
			byClass.set("Set", (byClass.get("Set") ?? 0) + 1);
			continue;
		}
		if (ArrayBuffer.isView(o)) {
			const ti = typedIndex.get(proto);
			if (ti === undefined) {
				block(id, "", `an unknown typed array ${proto?.constructor?.name}`);
				head.u8(K_ARRAY | pflag);
				head.uv(0);
				writePath();
				continue;
			}
			const b = new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
			head.u8(K_TYPED | pflag);
			head.uv(ti);
			head.uv(b.length);
			writePath();
			head.bytes(b);
			byClass.set("TypedArray", (byClass.get("TypedArray") ?? 0) + 1);
			continue;
		}
		let ci = classIndex.get(proto ?? Object.prototype);
		if (proto === null) ci = 0;
		if (ci === undefined) {
			block(id, "", `an object of unknown class ${proto?.constructor?.name ?? "?"}`);
			ci = 0;
		}
		const cls = CLASSES[ci];
		byClass.set(cls.name, (byClass.get(cls.name) ?? 0) + 1);
		const keys = Object.keys(o);
		// shape lookup
		let list = shapeCache.get(ci);
		if (!list) shapeCache.set(ci, (list = []));
		let shape = -1;
		outer: for (const s of list) {
			const sk = shapes[s][1];
			if (sk.length !== keys.length) continue;
			for (let i = 0; i < sk.length; i++) if (sk[i] !== keys[i]) continue outer;
			shape = s;
			break;
		}
		if (shape < 0) {
			shape = shapes.length;
			shapes.push([ci, keys]);
			list.push(shape);
		}
		head.u8(K_PLAIN | pflag);
		head.uv(shape);
		writePath();
		const keep = KEEP_KEYS.get(cls);
		const fix = FIXUPS.get(cls);
		for (const k of keys) {
			if (fix?.fns.has(k) && typeof o[k] === "function") {
				body.u8(T_FN);
				continue;
			}
			if (keep?.has(k)) {
				if (path === null) block(id, `.${k}`, "a kept property on an object the fresh VM doesn't have");
				body.u8(T_KEEP);
				continue;
			}
			value(body, o[k], id, `.${k}`, path, k);
		}
		if (o instanceof DMObject || o instanceof DMList) {
			for (let t = 0; t < SIDE_TABLES.length; t++) {
				const v = SIDE_TABLES[t].get(vm, o);
				if (v === undefined) continue;
				side.uv(t);
				side.uv(id);
				value(side, v, id, `{${SIDE_TABLES[t].name}}`, null, null);
				sideN++;
				sideCount[SIDE_TABLES[t].name] = (sideCount[SIDE_TABLES[t].name] ?? 0) + 1;
			}
		}
	}
	for (const [pattern, g] of blockerGroups) blockers.push(`${g.n} x ${pattern}   (e.g. ${g.example})`);
	if (blockers.length) throw new SnapshotBlocked(blockers);

	const meta: Meta = { version: VERSION, program: programPrint(vm), strings, shapes, classes: CLASSES.map((c) => c.name), objects: queue.length, host };
	const metaBytes = new TextEncoder().encode(JSON.stringify(meta));
	const parts = [metaBytes, head.out, body.out, roots.out, side.out];
	const total = 8 + 4 + parts.length * 4 + parts.reduce((s, p) => s + p.length, 0) + 4;
	const out = new Uint8Array(total);
	const dv = new DataView(out.buffer);
	let at = 0;
	for (let i = 0; i < 8; i++) out[at++] = MAGIC.charCodeAt(i);
	dv.setUint32(at, VERSION, true);
	at += 4;
	for (const p of parts) {
		dv.setUint32(at, p.length, true);
		at += 4;
		out.set(p, at);
		at += p.length;
	}
	dv.setUint32(at, sideN, true);
	return {
		bytes: out,
		stats: {
			objects: queue.length,
			bytes: out.length,
			ms: Date.now() - t0,
			byClass: [...byClass].sort((a, b) => b[1] - a[1]),
			strings: strings.length,
			shapes: shapes.length,
			sideEntries: sideCount,
		},
	};
}

/**
 * Loads a snapshot into `vm`, a freshly constructed VM on the same ObjectTree (its host hooks, vfs
 * bundle, icon readers etc. set up as for a normal boot, but vm.boot() NOT called). Returns the host
 * data given to saveSnapshot. Afterwards the VM continues exactly where the saved one stopped: call
 * vm.runTick() as usual.
 */
export function loadSnapshot(vm: VM, bytes: Uint8Array): { host: unknown; ms: number; objects: number; deletes: number } {
	const t0 = Date.now();
	const stackOf = vm.stackOf; // a host hook (translate/runtime.ts install, which runs before the load), not world state
	for (let i = 0; i < 8; i++) if (bytes[i] !== MAGIC.charCodeAt(i)) throw new Error("not a world snapshot");
	const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	let at = 8;
	const version = dv.getUint32(at, true);
	at += 4;
	if (version !== VERSION) throw new Error(`snapshot version ${version}, this build reads ${VERSION}`);
	const part = (): Uint8Array => {
		const len = dv.getUint32(at, true);
		at += 4;
		const p = bytes.subarray(at, at + len);
		at += len;
		return p;
	};
	const meta = JSON.parse(new TextDecoder().decode(part())) as Meta;
	const head = new Reader(part());
	const body = new Reader(part());
	const roots = new Reader(part());
	const side = new Reader(part());
	const sideN = dv.getUint32(at, true);

	const tree = vm.tree;
	const print = programPrint(vm);
	if (meta.program !== print) throw new Error(`snapshot made from a different build (${meta.program}; this one: ${print}): rebuild the snapshot`);
	const protos = meta.classes.map((name) => {
		const c = CLASSES.find((k) => k.name === name);
		if (!c) throw new Error(`snapshot has class ${name}, unknown to this build`);
		return c.prototype as object;
	});
	const { strings, shapes } = meta;
	const n = meta.objects;
	const objs: unknown[] = []; // filled in id order by push (a 7M-long new Array(n) is a slow, big dictionary array in V8)
	const kinds = new Uint8Array(n);
	const merged = new Uint8Array(n);
	const sizes = new Uint32Array(n);
	const resolve = (path: string): unknown => {
		if (path === "") return vm;
		let o: unknown = vm;
		for (const k of path.slice(1).split(".")) {
			if (o === null || typeof o !== "object") return undefined;
			o = (o as Record<string, unknown>)[k];
		}
		return o;
	};
	const TYPED_CTORS = TYPED as unknown as (new (b: ArrayBuffer) => ArrayBufferView)[];
	// Objects are made with their real constructor (dummy arguments, fields overwritten below), not
	// Object.create: V8 gives constructor-made objects their own hidden classes, and mixing in a
	// second set would make the interpreter's property accesses polymorphic (measured: ~25% slower).
	const dummyType = tree.root;
	const dummyProc = tree.procs[0];
	const dummyAtom = new DMAtom(dummyType, 0 as Kind);
	const factories = new Map<Function, () => object>([
		[Object, () => ({})],
		[DMObject, () => new DMObject(dummyType)],
		[DMAtom, () => new DMAtom(dummyType, 0 as Kind)],
		[DMList, () => new DMList()],
		[ArgsList, () => new ArgsList([])],
		[VarsList, () => new VarsList(dummyAtom, null, [])],
		[ScreenList, () => new ScreenList()],
		[VerbList, () => new VerbList()],
		[ContentsList, () => new ContentsList(dummyAtom, vm.map)],
		[AreaContentsList, () => new AreaContentsList(dummyAtom, vm.map)],
		[OverlayList, () => new OverlayList(dummyAtom)],
		[DMAppearance, () => new DMAppearance(dummyType)],
		[Resource, () => new Resource("")],
		[VarShape, () => new VarShape([])],
		[ListLiteral, () => new ListLiteral(null, false)],
		[Thread, () => new Thread()],
		[Frame, () => new Frame(dummyProc, [], null, null)],
		[RangeEnumerator, () => new RangeEnumerator(0, 0, 1)],
		[ListEnumerator, () => new ListEnumerator([], null, null, vm)],
	]);
	const makers = protos.map((p) => factories.get(p.constructor as Function) ?? (() => Object.create(p)));
	const zctBefore = heap.zct;
	let deletes = 0;
	const extraKeys: (string[] | undefined)[] = [];
	// Pass 1: make every object (or pick the fresh VM's one at the same path).
	for (let id = 0; id < n; id++) {
		// Every constructor above pushes the new object on heap.zct, which is replaced by the saved table below anyway:
		// keep it from growing to millions of entries.
		if ((id & 0xffff) === 0) zctBefore.length = 0;
		const k = head.u8();
		const kind = k & 15;
		kinds[id] = kind;
		const a = head.uv();
		sizes[id] = a;
		let b = 0;
		if (kind === K_TYPED) b = head.uv();
		const fresh = k & K_PATH ? resolve(strings[head.uv()]) : undefined;
		if (kind === K_TYPED) {
			objs.push(new TYPED_CTORS[a](head.bytes(b).buffer as ArrayBuffer));
			continue;
		}
		let o: unknown;
		switch (kind) {
			case K_PLAIN: {
				const ci = shapes[a][0];
				if (fresh !== undefined && fresh !== null && typeof fresh === "object" && Object.getPrototypeOf(fresh) === protos[ci]) {
					o = fresh;
					merged[id] = 1;
				} else o = makers[ci]();
				break;
			}
			case K_EMPTY:
				o = EMPTY_ITEMS;
				break;
			case K_ARRAY:
				// Made at its exact size and filled by index in pass 2: push would leave growth slack, which on
				// 3.7M arrays cost Firefox ~0.3 GB (a 7-item array: 255 bytes pushed, 125 exact). That makes it
				// HOLEY in V8, which measured no slower (memory work). Big ones are pushed: V8 makes a huge
				// new Array(n) a slow dictionary array.
				if (Array.isArray(fresh) && fresh !== EMPTY_ITEMS) {
					o = fresh;
					fresh.length = 0;
					merged[id] = 1;
				} else o = a > 0 && a <= EXACT_ARRAY_MAX ? new Array(a) : [];
				break;
			case K_MAP:
				if (fresh instanceof Map) {
					fresh.clear();
					o = fresh;
					merged[id] = 1;
				} else o = new Map();
				break;
			case K_SET:
				if (fresh instanceof Set) {
					fresh.clear();
					o = fresh;
					merged[id] = 1;
				} else o = new Set();
				break;
			default:
				throw new Error(`bad snapshot record ${k}`);
		}
		objs.push(o);
	}
	if (objs[0] !== vm) throw new Error("snapshot root isn't the VM");

	const KEEP = Symbol("keep");
	const val = (r: Reader): unknown => {
		switch (r.u8()) {
			case T_NULL: return null;
			case T_UNDEF: return undefined;
			case T_TRUE: return true;
			case T_FALSE: return false;
			case T_INT: return r.sv();
			case T_F64: return r.d();
			case T_STR: return strings[r.uv()];
			case T_OBJ: return objs[r.uv()];
			case T_TYPE: {
				const i = r.sv();
				return i < 0 ? vm.appearances.type : tree.types[i];
			}
			case T_PROC: {
				const i = r.sv();
				return i < 0 ? tree.globalInitProc : tree.procs[i];
			}
			case T_KEEP: return KEEP;
			case T_FN: return true; // rebuilt by the class's fixup
			default: throw new Error(`bad snapshot value tag at ${r.n - 1}`);
		}
	};
	// Pass 2: fill them in. The body is read through local state (B, P) instead of a Reader, and each plain shape gets a
	// generated filler with constant-key property stores instead of `t[k] = v` with a variable key.
	const B = body.buf;
	let P = 0;
	const uvB = (): number => {
		let b = B[P++];
		if (b < 128) return b;
		let x = b & 127, mul = 128;
		do {
			b = B[P++];
			x += (b & 127) * mul;
			mul *= 128;
		} while (b & 128);
		return x;
	};
	const f64 = new Float64Array(1), f64b = new Uint8Array(f64.buffer);
	const f64Cache = new Map<number, number>();
	const zz = (i: number): number => (i % 2 === 0 ? i / 2 : -(i + 1) / 2);
	const valB = (): unknown => {
		switch (B[P++]) {
			case T_NULL: return null;
			case T_UNDEF: return undefined;
			case T_TRUE: return true;
			case T_FALSE: return false;
			case T_INT: return zz(uvB());
			case T_F64: {
				for (let i = 0; i < 8; i++) f64b[i] = B[P + i];
				P += 8;
				// Repeated decimals share one heap number. -0 skips the cache: a Map treats it as 0.
				const x = f64[0];
				if (x === 0) return x;
				const c = f64Cache.get(x);
				if (c !== undefined) return c;
				f64Cache.set(x, x);
				return x;
			}
			case T_STR: return strings[uvB()];
			case T_OBJ: return objs[uvB()];
			case T_TYPE: {
				const i = zz(uvB());
				return i < 0 ? vm.appearances.type : tree.types[i];
			}
			case T_PROC: {
				const i = zz(uvB());
				return i < 0 ? tree.globalInitProc : tree.procs[i];
			}
			case T_KEEP: return KEEP;
			case T_FN: return true; // rebuilt by the class's fixup
			default: throw new Error(`bad snapshot value tag at ${P - 1}`);
		}
	};
	const fillers: (((t: object) => void) | undefined)[] = [];
	const fillerFor = (si: number) => {
		const src = shapes[si][1].map((k) => `t[${JSON.stringify(k)}]=val();`).join("");
		return (fillers[si] = new Function("val", `return function(t){${src}}`)(valB) as (t: object) => void);
	};
	for (let id = 0; id < n; id++) {
		const o = objs[id];
		switch (kinds[id]) {
			case K_PLAIN: {
				if (!merged[id]) { // (a KEEP value is only legal on merged objects, which take the generic path below)
					const si = sizes[id];
					(fillers[si] ?? fillerFor(si))(o as object);
					if (extraKeys[si] === undefined) {
						const keys = shapes[si][1];
						const extra = (extraKeys[si] = Object.keys(o as object).filter((k) => !keys.includes(k)));
						if (extra.length) throw new Error(`snapshot made by a different VM build: ${(o as object).constructor.name} now has ${extra.join(", ")}; rebuild the snapshot`);
					}
					break;
				}
				const keys = shapes[sizes[id]][1];
				const t = o as Record<string, unknown>;
				for (const k of keys) {
					const v = valB();
					if (v === KEEP) continue;
					t[k] = v;
				}
				// Keys the saved object didn't have: the fresh VM's (merged).
				for (const k of Object.keys(t).filter((k) => !keys.includes(k))) {
					delete t[k];
					deletes++;
				}
				break;
			}
			case K_ARRAY: {
				const a = o as unknown[];
				const len = sizes[id];
				if (a.length === len && len > 0) for (let i = 0; i < len; i++) a[i] = valB();
				else for (let i = len; i > 0; i--) a.push(valB());
				break;
			}
			case K_MAP: {
				const m = o as Map<unknown, unknown>;
				for (let i = sizes[id]; i > 0; i--) {
					const k = valB();
					m.set(k, valB());
				}
				break;
			}
			case K_SET: {
				const s = o as Set<unknown>;
				for (let i = sizes[id]; i > 0; i--) s.add(valB());
				break;
			}
		}
	}
	for (let id = 0; id < n; id++) {
		if (kinds[id] !== K_PLAIN) continue;
		const fix = FIXUPS.get(protos[shapes[sizes[id]][0]].constructor as Function);
		if (fix) fix.load(vm, objs[id] as Record<string, unknown>);
	}
	// Module-level state.
	const zct = val(roots) as typeof heap.zct;
	const byRef = val(roots) as Map<string, DMObject | DMList>;
	const next = val(roots) as number;
	const tagged = val(roots) as Set<DMObject>;
	const freed = val(roots) as number;
	if (heap.zct !== zctBefore) throw new Error("snapshot: heap.zct replaced during load");
	heap.zct = zct; // (the dummy-constructed objects' zct pushes went to the old table)
	heap.freed = freed;
	const table = refTable();
	table.clear();
	for (const [k, v] of byRef) table.set(k, v);
	setRefNext(next);
	taggedDatums.clear();
	for (const d of tagged) taggedDatums.add(d);
	for (let i = 0; i < sideN; i++) {
		const t = side.uv();
		const id = side.uv();
		SIDE_TABLES[t].set(vm, objs[id] as object, val(side));
	}
	vm.stackOf = stackOf;
	for (const t of vm.sched.sleepers()) for (const f of t.frames) if (f.gen === null && f.locals[0] === TAIL_MARK) startTail(f);
	return { host: meta.host, ms: Date.now() - t0, objects: n, deletes };
}

/**
 * Test aid (tools/snapshot-diff): walks a snapshot's objects in id order, giving each one's class
 * (or Array/Map/Set/typed), its keys (plain objects), and its values as comparable text ("s:..",
 * "i:3", "o:#12", "type:7"...). Used to check that load-then-save reproduces the saved graph.
 */
export function* snapshotObjects(bytes: Uint8Array): Generator<{ id: number; cls: string; keys: string[] | null; path: string | null; vals: string[] }> {
	const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	let at = 12;
	const part = (): Uint8Array => {
		const len = dv.getUint32(at, true);
		at += 4;
		const p = bytes.subarray(at, at + len);
		at += len;
		return p;
	};
	const meta = JSON.parse(new TextDecoder().decode(part())) as Meta;
	const head = new Reader(part());
	const body = new Reader(part());
	const val = (r: Reader): string => {
		const t = r.u8();
		switch (t) {
			case T_NULL: return "null";
			case T_UNDEF: return "undef";
			case T_TRUE: return "true";
			case T_FALSE: return "false";
			case T_INT: return `i:${r.sv()}`;
			case T_F64: return `f:${r.d()}`;
			case T_STR: return `s:${meta.strings[r.uv()]}`;
			case T_OBJ: return `o:#${r.uv()}`;
			case T_TYPE: return `type:${r.sv()}`;
			case T_PROC: return `proc:${r.sv()}`;
			case T_KEEP: return "keep";
			case T_FN: return "fn";
			default: throw new Error(`bad tag ${t}`);
		}
	};
	for (let id = 0; id < meta.objects; id++) {
		const k = head.u8();
		const kind = k & 15;
		const a = head.uv();
		let b = 0;
		if (kind === K_TYPED) b = head.uv();
		const path = k & K_PATH ? meta.strings[head.uv()] : null;
		const vals: string[] = [];
		let cls: string, keys: string[] | null = null;
		if (kind === K_TYPED) {
			cls = TYPED[a].name;
			vals.push(Array.from(head.bytes(b)).join(","));
		} else if (kind === K_PLAIN) {
			cls = meta.classes[meta.shapes[a][0]];
			keys = meta.shapes[a][1];
			for (let i = 0; i < keys.length; i++) vals.push(val(body));
		} else {
			cls = kind === K_ARRAY || kind === K_EMPTY ? "Array" : kind === K_MAP ? "Map" : "Set";
			for (let i = kind === K_MAP ? a * 2 : a; i > 0; i--) vals.push(val(body));
		}
		yield { id, cls, keys, path, vals };
	}
}

/**
 * What a loaded world needs before it runs on: a fresh RNG seed (each load plays a different round;
 * the map, ruins and caves were already made before the save, so those are the same every load), the
 * tick clock restarted, and tg's two wall-clock bookkeepers reset, since the real time of day jumped
 * between save and load: GLOB.rollovercheck_last_timeofday (else a load at an earlier time of day
 * than the save counts a false midnight rollover, and REALTIMEOFDAY jumps a day) and SStime_track
 * (else its first fire sees the jump as time dilation). world.timeofday/realtime themselves are read
 * live from the host clock, as in a normal boot.
 */
export function resumeWorld(vm: VM, seed: number | null): string[] {
	const done: string[] = [];
	if (seed !== null) vm.rng.seed(seed);
	vm.sched.tickStart = typeof performance !== "undefined" ? performance.now() : Date.now();
	const global = (name: string) => {
		const i = vm.tree.globalNames.indexOf(name);
		const o = i >= 0 ? vm.globals[i] : null;
		return o instanceof DMObject ? o : null;
	};
	// GLOBAL_VAR_INIT makes a `var/global` on /datum/controller/global_vars: a global slot, not an object var.
	const gi = vm.tree.getType("/datum/controller/global_vars")?.globalVars.get("rollovercheck_last_timeofday");
	if (gi !== undefined && typeof vm.globals[gi] === "number") {
		vm.globals[gi] = timeOfDay();
		done.push("GLOB.rollovercheck_last_timeofday");
	}
	const tt = global("SStime_track");
	if (tt?.hasVar("first_run")) {
		tt.setVar("first_run", 1);
		done.push("SStime_track.first_run");
	}
	return done;
}
