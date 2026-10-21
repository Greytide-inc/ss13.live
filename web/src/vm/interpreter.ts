// The VM: objects, lists, field access, the GC, natives, and the thread driver that steps translated generator procs
// (src/translate/runtime.ts). the bytecode interpreter that started this file is gone; every proc is translated
// TypeScript (game/), a native, or has no body. A sleeping thread is its frames left in place on a Thread.

import type { IconImage, IconRecipe } from "../dmi/icon-ops.js";
import type { DmiState } from "../dmi/dmi.js";
import { stress } from "./stress-log.js";
import { installSavefile } from "./savefile.js";
import { orderedVarNames } from "./varnames.js";
import { LOOK_VARS, normColor, normLookVar } from "./look.js";
import { IMPROPER, PROPER } from "./markers.js";
import { Clients } from "./clients.js";
import { Appearances, DMAppearance, OverlayList } from "./appearances.js";
import { DMProc, DMType, ListLiteral, NOT_PLAIN, ObjectTree } from "./objtree.js";
import type { JsonValue } from "./json.js";
import { ArgsType } from "./args-type.js";
import {
	ArgsList,
	DMList,
	DMObject,
	VarsList,
	listAdd,
	listAnd,
	listOr,
	listSubtract,
	listXor,
	live,
	ScreenList,
	releaseRefs,
	ROOT_SHAPE,
	assocValues,
	taggedDatums,
	FieldIC,
} from "./objects.js";
import { decRef, GCFlag, GCNode, heap, incRef, markOf, pin, PERMANENT_RC, setMark } from "./gc.js";
import { installNatives } from "./natives.js";
import { installWorldNatives } from "./natives-world.js";
import { installIoNatives, WorldLogOut } from "./natives-io.js";
import { installTextNatives } from "./natives-text.js";
import { installMiscNatives } from "./natives-misc.js";
import { Random } from "./random.js";
import { forgetRef, fromRef, refOf } from "./refs.js";
import { Vfs } from "../vfs/vfs.js";
import { parseDmms, type CompiledMap } from "./dmm.js";
import { ProcAttr } from "./json.js";
import { Scheduler, Thread, realTime, timeOfDay } from "./scheduler.js";
import { diffHook } from "./clockhook.js";
import { DMAtom, GameMap, Kind, isAtom } from "./world.js";
import {
	DMRuntimeError,
	NotImplementedError,
	describe,
	formatNumber,
	fround,
	stringify,
	toInt,
	type Value,
} from "./value.js";

/** A BYOND built-in implemented in TS. `src` is the object for methods like /list/proc/Add. */
export type NativeProc = (vm: VM, args: Value[], src: Value, usr: Value) => Value;

/** An input()/alert() waiting for the page. `thread` is the parked thread once run() has parked it. */
export interface PromptReq { thread?: Thread }

/** `for(x in a to b step c)` */
export class RangeEnumerator {
	current: number;
	constructor(start: number, readonly end: number, readonly step: number) {
		this.current = fround(start - step);
	}
	next(): number | undefined {
		this.current = fround(this.current + this.step);
		const ok = this.step > 0 ? this.current <= this.end : this.current >= this.end;
		return ok ? this.current : undefined;
	}
}

/** `for(x in L)`: walks a snapshot of the list's items (changes during the loop aren't seen, as in BYOND). */
export class ListEnumerator {
	private i = 0;
	constructor(
		readonly items: Value[],
		readonly list: DMList | null,
		/** `for(var/T/x in L)` only yields objects of type T. */
		readonly filter: DMType | null,
		readonly vm: VM,
		/** An `in world` loop: its snapshot doesn't keep atoms alive, and atoms freed meanwhile are skipped. */
		readonly world = false,
	) {}
	private heapItems: GCNode[] | null = null;
	/** The snapshot's items the collector must see (not turfs or areas; found once, the snapshot never changes). */
	collectable(): GCNode[] {
		if (this.heapItems === null) {
			this.heapItems = [];
			if (!this.world) for (const v of this.items) if (v instanceof GCNode && v.rc < PERMANENT_RC) this.heapItems.push(v);
		}
		return this.heapItems;
	}
	/** makes this (finished) enumerator walk a new snapshot (a copy of `from`; runtime.ts pools enumerators). */
	refill(from: Value[] | null, list: DMList | null, filter: DMType | null): void {
		const w = this as unknown as { items: Value[]; list: DMList | null; filter: DMType | null };
		w.items = from === null ? [] : from.slice(); // a copy (slice is a memcpy; refilling one array element by element was slower)
		w.list = list;
		w.filter = filter;
		this.i = 0;
		this.heapItems = null;
	}
	/** done with (runtime.ts's pool): drops what it refers to. */
	release(): void {
		const w = this as unknown as { items: Value[]; list: DMList | null };
		w.list = null;
		w.items = NONE;
		this.heapItems = null;
	}
	next(): Value | undefined {
		while (this.i < this.items.length) {
			const v = live(this.items[this.i++]);
			if (this.world && ((v as DMAtom).gcFlags & GCFlag.Collected)) continue;
			if (this.filter === null) return v;
			const t = this.vm.typeOf(v);
			if (t !== null && t.isSubtypeOf(this.filter)) return v;
		}
		return undefined;
	}
}

type Enumerator = RangeEnumerator | ListEnumerator;

/** True when the frame's (current) src is an object that has been deleted. */
function srcDeleted(f: Frame): boolean {
	const s = f.src;
	return s !== null && typeof s === "object" && s instanceof DMObject && s.deleted;
}

/**
 * the one thing a translated generator proc yields to the thread driver: "suspend this thread here". A native it
 * called (sleep(), input()...) has set VM.yieldDelay (and yieldPrompt); `value` is what that call returns once the proc
 * resumes (an input() answer replaces it: answerPrompt). Calls, `new`, `del` and `waitfor = 0` callees never come here:
 * the runtime makes them itself (translate/runtime.ts), and a `waitfor = 0` callee that suspends moves to a thread of its
 * own there (VM.detach).
 */
export class GenRequest {
	constructor(readonly value: Value) {}
}

/** Hooks the built-in Move() calls: a sleep inside one doesn't hold Move() up. */

export const MOVE_HOOKS = new Set(["Bump", "Enter", "Exit", "Exited", "Entered", "Crossed", "Uncrossed", "Cross", "Uncross"]);

/** Thrown into (or by) a translated proc when its src was deleted under it: the proc ends, returning `.` (as VM.deliver does for bytecode). */
export class EndProc {
	constructor(readonly frame: Frame) {}
}

/** the shared empty array of frames that have no locals or enumerators yet (frozen: a write would be a bug). */
export const NONE: Value[] = Object.freeze([]) as unknown as Value[];
/** finished generator-proc frames nothing refers to any more, reused by enter() and runtime.ts callGen (filled by runtime.ts). */
export const genFramePool: Frame[] = [];

/**
 * A running proc: a translated plain proc's (runtime.ts callPlain: not on any thread), a translated generator proc's (on a
 * thread, `gen` set), or a stand-in for a plain caller at the bottom of a temporary thread (runtime.ts tempThread: `rethrow`).
 */
export class Frame {
	/** only a frame that waits to start a named tail ([TAIL_MARK, name, ...values], runtime.ts sleepThen/spawnTail),
	 * or holds an object being made (runtime.ts newHeld); NONE otherwise (translated procs keep their locals in JS). */
	locals: Value[] = NONE;
	/** `.`: the default return value. */
	dot: Value = null;
	/** for-loop enumerators (runtime.ts forList/forRange): NONE until the first loop. */
	enumerators: (Enumerator | null)[] = NONE as unknown as (Enumerator | null)[];
	/** False for `set waitfor = 0` procs: when something above them sleeps, their caller carries on. */
	waitfor: boolean;
	/** How many translated `try` blocks are open in this (generator or stand-in) frame (runtime.ts tryOpen/tryClose). */
	tries = 0;
	/**
	 * a generator frame that suspended: what it resumes with (a native's result, an input() answer). A stand-in: what its
	 * callee returned. undefined: nothing waiting (a generator frame that hasn't started, or waits on a frame above it).
	 */
	resume: Value | undefined = undefined;
	/** for a plain frame, vm.running.length when it was called (runtime.ts fullStack). */
	depth = 0;
	private argsView: ArgsList | null = null;
	/** The object bare var names (`n` for `src.n`) resolve on. Measured: bound at the first such access
	 * in the proc, so after `src = other` they follow `other` only if none was used before. */
	boundSrc: Value | undefined = undefined;
	/**
	 * Measured (gc.dm): a proc keeps a reference to the last object or list it read a var of, wrote a
	 * var of or called a proc on through `x.y` / `x:y`, until its next such access or until it returns
	 * (sleeping doesn't drop it). So `a.v = 1; a = null` doesn't free a yet.
	 */
	lastDeref: Value = null;
	/** a translated generator proc running in this frame, stepped by VM.stepGen. */
	gen: Generator<GenRequest, Value, Value> | null = null;
	/** the translated proc's JS locals, for the GC. */
	vars: (() => Value[]) | null = null;
	/** A stand-in frame of a temporary thread (runtime.ts tempThread): not shown in call stacks; an error a try of its caught
	 * is thrown on to the plain caller's JS (VM.handleError). */
	rethrow = false;
	/** an error caught by a translated `try` in this (gen) frame, thrown into the generator at its next step. */
	pendingError: DMRuntimeError | EndProc | null = null;
	fieldSrc(): Value {
		return this.boundSrc === undefined ? (this.boundSrc = this.src) : this.boundSrc;
	}

	constructor(
		readonly proc: DMProc,
		readonly args: Value[],
		/** Writable: `src = x` and `usr = x` just rebind them for the rest of the proc (measured). */
		public src: Value,
		public usr: Value,
	) {
		this.waitfor = (proc.attributes & ProcAttr.DisableWaitfor) === 0;
	}

	/** this finished frame, made as new for another call: same as `new Frame(proc, args, src, usr)` (runtime.ts keeps
	 * pools of them: callPlain's frames, generator frames, the stand-ins). */
	/** reuse() for a pooled callPlain frame: those never have a generator, tries, resume value, rethrow or pending error. */
	reusePlain(proc: DMProc, args: Value[], src: Value, usr: Value): this {
		const w = this as unknown as { proc: DMProc; args: Value[] };
		w.proc = proc;
		w.args = args;
		this.src = src;
		this.usr = usr;
		this.locals = NONE;
		this.dot = null;
		this.enumerators = NONE as unknown as (Enumerator | null)[];
		this.waitfor = (proc.attributes & ProcAttr.DisableWaitfor) === 0;
		this.argsView = null;
		this.boundSrc = undefined;
		this.lastDeref = null;
		this.vars = null;
		return this;
	}
	reuse(proc: DMProc, args: Value[], src: Value, usr: Value): this {
		const w = this as unknown as { proc: DMProc; args: Value[] };
		w.proc = proc;
		w.args = args;
		this.src = src;
		this.usr = usr;
		this.locals = NONE;
		this.dot = null;
		this.enumerators = NONE as unknown as (Enumerator | null)[];
		this.waitfor = (proc.attributes & ProcAttr.DisableWaitfor) === 0;
		this.tries = 0;
		this.resume = undefined;
		this.argsView = null;
		this.boundSrc = undefined;
		this.lastDeref = null;
		this.gen = null;
		this.vars = null;
		this.rethrow = false;
		this.pendingError = null;
		return this;
	}

	/**
	 * `spawn`: a copy of this frame for the new thread. Measured: args, locals and `.` are copied at the
	 * spawn (later changes on either side aren't seen by the other; lists are still shared), and open
	 * try blocks are copied too (a throw in the spawned code is caught by the enclosing try's catch).
	 */
	cloneForSpawn(): Frame {
		const c = new Frame(this.proc, this.args.slice(), this.src, this.usr);
		if (this.locals !== NONE) c.locals = this.locals.slice();
		c.dot = this.dot;
		c.waitfor = this.waitfor;
		c.enumerators = this.enumerators.slice();
		c.tries = this.tries;
		return c;
	}

	/** `args`: a list sharing this frame's argument array. */
	get argsList(): ArgsList {
		return (this.argsView ??= new ArgsList(this.args));
	}
}

export interface RuntimeErrorRecord {
	message: string;
	proc: string;
	/** DM file:line, as BYOND prints it (tg's /exception file and line; compare-logs matches these). */
	source: string;
	/** the game/ file:line, for an error in translated code (from the JS stack). */
	game?: string;
	/** Innermost first, as BYOND prints it. */
	callStack: string[];
}

/**
 * Proc display name as BYOND prints it in "proc name: ..." (underscores become spaces).
 * Unverified for verbs with `set name`.
 */
/** BYOND's proc path in runtime dumps: "/datum/browser/New" (no "/proc/"); global procs "/proc/name" (unverified). */
function byondProcPath(p: DMProc): string {
	return p.owner && p.owner.path !== "/" ? `${p.owner.path}/${p.name}` : `/proc/${p.name}`;
}

/** `verbs += x` puts a verb at the front and ignores one already there (measured: tests/dm/verbs.dm). */
export class VerbList extends DMList {
	override add(v: Value): void {
		for (const x of v instanceof DMList ? v.items.slice() : [v]) {
			const p = live(x);
			if (p instanceof DMProc && !this.items.includes(p)) this.insert(0, [p]);
		}
	}
}

/** The name BYOND gives an atom type with none of its own: the last path part, "_" as spaces. */
function implicitName(t: DMType): string {
	return t.path.slice(t.path.lastIndexOf("/") + 1).replace(/_/g, " ");
}

const SPECIAL_LISTS = new Set(["overlays", "underlays", "verbs", "screen", "images"]);
/** var names getField/setField always handle in full (atom built-ins, appearance and list vars; see
 * getFieldFull/setFieldFull). Any other declared var of a type with no `special` hooks is a plain read/write. */
const NOT_PLAIN_READ: ReadonlySet<string> = new Set([...SPECIAL_LISTS, "loc", "contents", "x", "y", "z", "type", "parent_type", "appearance", "vars", "transform"]);
const NOT_PLAIN_WRITE: ReadonlySet<string> = new Set([...NOT_PLAIN_READ, ...LOOK_VARS, "dir", "key", "ckey"]);

function procDisplayName(p: DMProc): string {
	return p.name.replace(/_/g, " ");
}

export class VM {
	readonly globals: Value[];
	/** The shared VarShape tree's root, here only so a world snapshot loads its shapes into the same tree. */
	readonly rootShape = ROOT_SHAPE;
	readonly natives = new Map<string, NativeProc>();
	readonly runtimeErrors: RuntimeErrorRecord[] = [];
	/** Called for each runtime error as it happens (default: print like BYOND's log). */
	onRuntimeError: (e: RuntimeErrorRecord) => void = (e) => {
		console.error(`runtime error: ${e.message}\nproc name: ${e.proc} (${e.source})`);
	};

	readonly datumType: DMType;
	readonly listType: DMType;
	readonly atomType: DMType | null;
	/** The world clock and sleeping threads. */
	readonly sched = new Scheduler();
	/** The `world` object (null if the program has no /world type). */
	readonly world: DMObject | null;
	/** turn(matrix, angle), set by natives-misc: undefined when the value isn't a matrix. */
	matrixTurn: (m: Value, angle: number) => DMObject | undefined = () => undefined;
	/** Set by the sleep native: the thread running it must suspend for this many deciseconds. */
	yieldDelay: number | null = null;
	/** set with yieldDelay = Infinity by an input()/alert() that waits for the page: the thread parks instead of sleeping. */
	yieldPrompt: PromptReq | null = null;
	/** The turf grid, areas and every atom. */
	readonly map: GameMap;
	/** `appearance` snapshots and overlay entries (vm/appearances.ts). */
	readonly appearances: Appearances;
	/** Connected players and everything sent to them (vm/clients.ts). */
	readonly clients: Clients;
	/** Active walk()/walk_to() walkers, in the order they were started. */
	private readonly walkers = new Map<DMAtom, { next: number; period: number; step: (ref: DMAtom) => void }>();
	private readonly kinds = new Map<DMType, Kind | 0>();
	private readonly kindRoots: [DMType | undefined, Kind][];
	/** Set while /world/Error runs: an error inside it is logged normally instead of recursing. */
	private inWorldError = false;
	/** The uncaught error /world/Error was called for; the built-in world/Error (`..()`) logs it. */
	pendingErrorLog: (() => void) | null = null;
	/** Files the world reads and writes (file2text, text2file, `file << x`...). Empty until the host mounts one. */
	vfs = new Vfs({ generatedAt: "", files: {}, dirs: [""] });
	/** Writes every savefile with unwritten changes to the VFS (installSavefile replaces this). The
	 * worker calls it before exporting the VFS overlay. */
	flushSavefiles: () => void = () => {};
	/** Where `world.log << x` goes while world.log is null (BYOND: DreamDaemon's output). One call per line. */
	worldLog: (text: string) => void = (text) => console.log(text);
	/** What reading `world.log` gives while it is null, so `world.log << x` reaches worldLog. */
	readonly worldLogOut = new WorldLogOut();
	/** The seedable generator behind rand/prob/pick (see random.ts). */
	readonly rng = new Random();
	/**
	 * Boot/discovery mode: a NotImplementedError aborts only the current proc (logged like a runtime
	 * error with a "not implemented:" message and recorded in notImplemented) instead of stopping the VM.
	 */
	lenient = false;
	readonly notImplemented: RuntimeErrorRecord[] = [];

	constructor(readonly tree: ObjectTree) {
		heap.zct = []; // one VM at a time: a previous VM's objects are its own business
		this.globals = tree.globalInitial.map((v) => (v instanceof ListLiteral ? this.materialize(v) : v));
		for (const v of this.globals) incRef(v);
		this.datumType = tree.getType("/datum")!;
		this.listType = tree.getType("/list")!;
		this.atomType = tree.getType("/atom") ?? null;
		this.kindRoots = [
			[tree.getType("/area"), Kind.Area],
			[tree.getType("/turf"), Kind.Turf],
			[tree.getType("/obj"), Kind.Obj],
			[tree.getType("/mob"), Kind.Mob],
			[tree.getType("/atom/movable"), Kind.Movable],
			[tree.getType("/atom"), Kind.Atom],
		];
		this.map = new GameMap({
			allocAtom: (t) => this.allocObject(t) as DMAtom,
			initAtom: (a, args) => this.initAtomNow(a, args),
			delAtom: (a) => {
				const del = a.type.procs.get("Del");
				if (del && !del.isNative) this.call(del, [], a);
			},
			worldTurfType: () => this.worldTypeVar("turf"),
			worldAreaType: () => this.worldTypeVar("area"),
		});
		const worldType = tree.getType("/world");
		this.world = worldType ? this.allocObject(worldType) : null;
		// Measured: a movable type declared with `dir = 0` reads (and initial()s) as SOUTH (2).
		const movable = tree.getType("/atom/movable");
		if (movable) tree.addVarFixup((t) => { if (t.vars.get("dir") === 0 && t.isSubtypeOf(movable)) t.vars.set("dir", 2); });
		// 511 has these on every atom/movable (DMStandard lacks them, or puts step_x/step_y on /atom with a null default).
		const atom = tree.getType("/atom");
		if (atom) {
			tree.addVarFixup((t) => {
				if (!t.isSubtypeOf(atom)) return;
				if (!t.vars.has("visibility")) t.vars.set("visibility", 1);
				if (!t.vars.has("override")) t.vars.set("override", 0);
				if (movable && t.isSubtypeOf(movable)) {
					if (!t.vars.has("pixel_step_size")) t.vars.set("pixel_step_size", 0);
					if (t.vars.get("step_x") === null) t.vars.set("step_x", 0);
					if (t.vars.get("step_y") === null) t.vars.set("step_y", 0);
				}
			});
		}
		this.appearances = new Appearances(this);
		if (this.world) {
			// Measured (511): world.view is compile-time only. A square, odd "WxW" text size reads back as
			// the number (W-1)/2 ("15x15" is 7, "1x1" is 0); any other "WxH" stays text.
			const v = this.world.getVar("view");
			const m = typeof v === "string" ? /^(\d+)x(\d+)$/.exec(v) : null;
			if (m && m[1] === m[2] && Number(m[1]) % 2 === 1) this.world.setVar("view", (Number(m[1]) - 1) / 2);
		}
		installNatives(this);
		installWorldNatives(this);
		installIoNatives(this);
		installTextNatives(this);
		installMiscNatives(this);
		installSavefile(this);
		this.clients = new Clients(this);
	}

	/** Makes a proc DMStandard gives a DM body run the TS native registered for its path instead. */
	overrideWithNative(path: string): void {
		const m = /^\/proc\/(.+)$/.exec(path);
		const p = m ? this.tree.globalProcs.get(m[1]) : undefined;
		if (p && this.natives.has(path)) p.isNative = true;
	}

	private readonly ownGlobals = new Map<DMType, string[]>();
	/** A type's global/static var names, minus the root-level globals every type inherits. */
	ownGlobalNames(t: DMType): string[] {
		let l = this.ownGlobals.get(t);
		if (!l) {
			const root = this.tree.root.globalVars;
			l = [...t.globalVars.keys()].filter((k) => t === this.tree.root || !root.has(k));
			this.ownGlobals.set(t, l);
		}
		return l;
	}

	/** The names `vars` lists for a type: BYOND's order and set for the atom/image/matrix types, else all vars then the type's statics/globals. */
	/** A fresh identity /matrix (a null `transform` reads as one, a new one each time). */
	identityMatrix(): Value {
		const m = this.tree.getType("/matrix");
		return m ? this.allocObject(m) : null;
	}

	private varNames(t: DMType): string[] | null {
		const own = this.ownGlobalNames(t);
		return orderedVarNames(t, own) ?? (own.length ? [...t.vars.keys(), ...own] : null);
	}

	private specialListTypes = new Map<DMType, boolean>();
	/** Atoms, images and clients always have overlays/underlays/verbs (and client screen/images) lists. */
	private hasSpecialLists(t: DMType): boolean {
		let b = this.specialListTypes.get(t);
		if (b === undefined) {
			b = this.atomKind(t) !== 0 || ["/image", "/client"].some((p) => {
				const pt = this.tree.getType(p);
				return pt !== undefined && t.isSubtypeOf(pt);
			});
			this.specialListTypes.set(t, b);
		}
		return b;
	}

	/**
	 * BYOND never lets these be null: reading one gives a list (verbs starts with the type's verbs).
	 * Unverified: what `overlays = null` does (here the next read makes a fresh empty list).
	 */
	/**
	 * A type's initial `verbs`: parents' verbs then its own (DMCompiler's Verbs holds proc names), then
	 * reversed: BYOND keeps the newest at the front (measured: tests/dm/verbs.dm). Each verb is the
	 * definition on the type that declared it, so a parent's and an override's both show.
	 * Runs once per verbs-list first read (a few dozen times per boot), not per tick.
	 */
	private typeVerbs(t: DMType): DMProc[] {
		const out: DMProc[] = [];
		for (let c: DMType | null = t; c; c = c.parent) {
			const own: DMProc[] = [];
			for (const name of (c.json.Verbs ?? []) as unknown as string[]) {
				for (const ids of c.json.Procs ?? []) {
					const p = this.tree.procs[ids[0]];
					if (p.name === name) own.push(p);
				}
			}
			own.sort((a, b) => (a.attributes & ProcAttr.IsOverride) - (b.attributes & ProcAttr.IsOverride)); // overrides go last
			out.push(...own.reverse());
		}
		return out;
	}

	private makeSpecialList(o: DMObject, name: string): DMList {
		const l = name === "verbs" ? new VerbList() : name === "screen" && o.type.path.startsWith("/client") ? new ScreenList() : (name === "overlays" || name === "underlays") && this.appearances.ownsOverlayLists(o) ? new OverlayList(o) : new DMList();
		if (name === "verbs") for (const v of this.typeVerbs(o.type)) l.push(v);
		o.setVar(name, l);
		return l;
	}

	/** Which kind of atom a type makes (0 for non-atoms). */
	atomKind(type: DMType): Kind | 0 {
		let k = this.kinds.get(type);
		if (k === undefined) {
			k = 0;
			for (const [root, kind] of this.kindRoots) {
				if (root && type.isSubtypeOf(root)) {
					k = kind;
					break;
				}
			}
			this.kinds.set(type, k);
		}
		return k;
	}

	private worldTypeVar(name: string): DMType | null {
		if (!this.world) return null;
		const v = this.world.getVar(name);
		return v instanceof DMType ? v : null;
	}

	/** How long compiledMaps() took to read the .dmm files (for the boot log); -1 when they came from the JSON. */
	mapReadMs = -1;

	/** The compile-time maps: the .dmm files web/game/_maps.ts lists (read from the vfs), or the JSON's Maps (--json-types, tests). */
	compiledMaps(): CompiledMap[] {
		const files = this.tree.json.MapFiles;
		if (!files) return (this.tree.json.Maps ?? []) as CompiledMap[];
		const t0 = performance.now();
		const maps = parseDmms(files, (f) => this.vfs.readText(f), (p) => this.tree.getType(p));
		this.mapReadMs = performance.now() - t0;
		return maps;
	}

	/**
	 * Builds the compile-time maps (the .dmm files the program #includes), as BYOND does before world/New().
	 * Checked only on the tests' 5x5 map of /turf in /area: the order BYOND
	 * creates map atoms and calls New() in, and var overrides, are unverified (the map-loading chunk).
	 */
	loadCompiledMaps(): void {
		const maps = this.compiledMaps();
		if (maps.length === 0) return;
		let mx = 0, my = 0, mz = 0;
		for (const m of maps) {
			mx = Math.max(mx, m.MaxX);
			my = Math.max(my, m.MaxY);
			mz = Math.max(mz, m.MaxZ);
		}
		const world = this.world;
		if (world) {
			// Unverified: world.maxx/maxy set in the /world type are a minimum size.
			mx = Math.max(mx, Number(world.getVar("maxx")) || 0);
			my = Math.max(my, Number(world.getVar("maxy")) || 0);
		}
		const created = this.map.resize(mx, my, mz, false);
		const objects: [DMType, Record<string, unknown> | undefined, DMAtom, number][] = [];
		const turfOverrides = new Map<DMAtom, Record<string, unknown>>();
		for (const m of maps) {
			for (const block of m.Blocks) {
				let bx = 1, by = 1;
				for (const cellName of block.Cells) {
					const cell = m.CellDefinitions[cellName];
					const turf = this.map.turfAt(block.X + bx - 1, block.Y + block.Height - by, block.Z);
					if (cell && turf) {
						if (cell.Area && this.tree.types[cell.Area.Type]) this.map.setArea(turf, this.map.areaFor(this.tree.types[cell.Area.Type]));
						if (cell.Turf && this.tree.types[cell.Turf.Type]) {
							turf.type = this.tree.types[cell.Turf.Type];
							turf.clearVars();
							this.resetVars(turf);
							if (cell.Turf.VarOverrides) turfOverrides.set(turf, cell.Turf.VarOverrides);
						}
						const key = turf.x - 1 + (turf.y - 1) * mx + (turf.z - 1) * mx * my;
						for (const o of cell.Objects ?? []) if (this.tree.types[o.Type]) objects.push([this.tree.types[o.Type], o.VarOverrides, turf, key]);
					}
					if (++bx > block.Width) {
						bx = 1;
						by++;
					}
				}
			}
		}
		// Measured in BYOND 511 (probe `ord`): turfs' New() run from the last turf back
		// (z, y, x all descending), then objects in z, y, x ascending order, each tile's in map order.
		for (let i = created.length - 1; i >= 0; i--) this.initAtomNow(created[i], [], turfOverrides.get(created[i]));
		objects.sort((p, q) => p[3] - q[3]); // stable: keeps each tile's own order
		for (const [type, ov, turf] of objects) {
			const a = this.allocObject(type);
			if (!(a instanceof DMAtom)) continue;
			this.map.setLoc(a, turf);
			this.initAtomNow(a, [turf], ov);
		}
	}

	private applyOverrides(a: DMObject, ov: Record<string, unknown> | undefined): void {
		if (!ov) return;
		for (const [k, v] of Object.entries(ov)) {
			const val = this.tree.convertValue(v as never);
			const x = val instanceof ListLiteral ? this.materialize(val) : val;
			a.setVar(k, a instanceof DMAtom && (a.isMovable || k[0] !== "s") && LOOK_VARS.has(k) ? normLookVar(k, x)! : x);
		}
	}

	/**
	 * Runs an atom's (init) proc and New(args) to completion (a nested thread if it sleeps).
	 * `overrides` (compile-time map var edits) go in between, as BYOND does (measured
	 * probe `ov`): applied before (init), they were lost when (init) rebuilt a list default.
	 */
	private initAtomNow(a: DMAtom, args: Value[], overrides?: Record<string, unknown>): void {
		if (overrides) {
			if (a.type.initProc) {
				// (init) only evaluates var defaults; it isn't expected to sleep.
				const t0 = new Thread();
				this.enter(t0, a.type.initProc, [], a, null);
				this.run(t0);
			}
			this.applyOverrides(a, overrides);
			const thread = new Thread();
			const newProc = a.type.procs.get("New");
			if (newProc && !newProc.isNative) this.enter(thread, newProc, args, a, null);
			if (thread.frames.length) this.run(thread);
			return;
		}
		const thread = new Thread();
		const newProc = a.type.procs.get("New");
		if (newProc && !newProc.isNative) this.enter(thread, newProc, args, a, null);
		if (a.type.initProc) this.enter(thread, a.type.initProc, [], a, null);
		if (thread.frames.length) this.run(thread);
	}

	/** Runs the compiler-generated global initialiser (var/global x = expr). */
	runGlobalInit(): void {
		const p = this.tree.globalInitProc;
		if (!p) return;
		this.tree.globalInitSetup?.(this, p); // TS (game/_globals.ts), not bytecode
		this.call(p, []);
	}

	/**
	 * Boots the world as BYOND does: the global initialiser, then the compile-time maps, then
	 * `world/New()` (src = world). Returns world/New's thread (it may sleep; drive the clock with
	 * runTick/runUntilIdle/runRealtime), or null if the program has no world/New of its own.
	 */
	boot(): Thread | null {
		this.runGlobalInit();
		this.loadCompiledMaps();
		const wn = this.world?.type.procs.get("New");
		if (!wn || wn.isNative) return null;
		return this.start(wn, [], this.world);
	}

	callGlobal(name: string, args: Value[] = []): Value {
		const p = this.tree.globalProcs.get(name);
		if (!p) throw new Error(`no global proc named ${name}`);
		return this.call(p, args);
	}

	/**
	 * Runs a proc on a fresh thread until it finishes or sleeps, and returns its result. If it sleeps,
	 * the caller gets the proc's current `.` (like a `set waitfor = 0` call) and the thread carries on
	 * in later ticks.
	 */
	call(proc: DMProc, args: Value[], src: Value = null, usr: Value = null): Value {
		const thread = this.start(proc, args, src, usr);
		return thread.done ? thread.result : thread.frames[0].dot;
	}

	/** Starts `proc` on a new thread and runs it until it finishes or first sleeps. */
	start(proc: DMProc, args: Value[], src: Value = null, usr: Value = null): Thread {
		const thread = new Thread();
		const r = this.enter(thread, proc, args, src, usr);
		this.yieldPrompt = null;
		this.yieldDelay = null; // a native sleep() called straight from the host doesn't sleep anything
		if (r !== undefined) {
			thread.result = r;
			thread.done = true;
			return thread;
		}
		this.run(thread);
		return thread;
	}

	/**
	 * Runs a global proc and keeps ticking (fast, skipping idle time) until its thread finishes.
	 * Other threads due meanwhile run too, as they would in BYOND. Used by the tests.
	 */
	callAndWait(name: string, args: Value[] = [], maxTicks = 100000): Value {
		const p = this.tree.globalProcs.get(name);
		if (!p) throw new Error(`no global proc named ${name}`);
		const thread = this.start(p, args);
		const limit = this.sched.tick + maxTicks;
		while (!thread.done) {
			this.finishTick();
			if (thread.done) break;
			const due = this.nextDue();
			if (due === null) throw new Error(`${name}() is asleep and nothing will wake it`);
			if (due > limit) throw new Error(`${name}() did not finish within ${maxTicks} ticks`);
			this.sched.skipTicks(due - this.sched.tick - 1);
			this.runTick();
		}
		return thread.result;
	}

	// ---- the tick loop ------------------------------------------------------------------------
	//
	// The host drives time. Code the host calls between ticks (world/New, and later client input)
	// runs in the current tick. runTick() first finishes the current tick (threads that host code
	// queued with sleep(0)/spawn(0)), then advances world.time by tick_lag and runs every thread due
	// in the new tick, including ones that sleep(0) or spawn(0) during it. So after runTick(),
	// world.time is the time of the tick that just ran.
	//
	// Headless fast mode (runUntilIdle, callAndWait) skips ticks where nothing is due. Real-time mode
	// (runRealtime) calls runTick() every tick_lag * 100 ms. There's no sleep_offline: time always
	// advances, with or without clients.

	// ---- walk() and friends ------------------------------------------------------------------------
	//
	// Measured (test_w_walk*): the first step comes one Lag after the call, then one every Lag (a Lag
	// of 0 is every tick). Walkers step at the start of a tick, before sleeping procs wake, in the
	// order the walks were started (a walker started earlier steps first even when a sleeper was
	// queued before it). A new walk on the same Ref replaces the old one.

	/** Starts (or replaces) the walker for `ref`; `step` makes one step. */
	startWalker(ref: DMAtom, lag: number, step: (ref: DMAtom) => void): void {
		const period = this.sched.ticksFor(Math.max(lag, this.sched.tickLag));
		this.walkers.delete(ref);
		this.walkers.set(ref, { next: this.sched.tick + period, period, step });
	}

	stopWalker(ref: DMAtom): void {
		this.walkers.delete(ref);
	}

	private runWalkers(): void {
		const tick = this.sched.tick;
		for (const [ref, w] of [...this.walkers]) {
			if (this.walkers.get(ref) !== w) continue;
			if (ref.deleted) {
				this.walkers.delete(ref);
				continue;
			}
			if (w.next > tick) continue;
			w.next = tick + w.period;
			w.step(ref);
		}
	}

	/** The next tick anything (a sleeping thread or a walker) is due in, or null. */
	nextDue(): number | null {
		let due = this.sched.nextDue();
		for (const w of this.walkers.values()) if (due === null || w.next < due) due = w.next;
		return due;
	}

	/** Runs every thread due in the current tick (or earlier), in order, without advancing the clock. */
	finishTick(): void {
		const sched = this.sched;
		for (let t = sched.takeDue(); t !== null; t = sched.takeDue()) this.run(t);
	}

	/** Finishes the current tick, advances the clock one tick, and runs the threads due in it. */
	runTick(): void {
		this.finishTick();
		if (diffHook.gcTickOnly) { diffHook.atTick = true; this.gcSafePoint(); diffHook.atTick = false; } // diff mode
		else this.gcSafePoint();
		this.sched.advance();
		if (this.walkers.size) this.runWalkers();
		this.finishTick();
	}

	/**
	 * Headless fast mode: runs ticks until no thread is sleeping or `maxTicks` ticks have passed,
	 * skipping idle ticks instantly. Returns the number of ticks that passed.
	 */
	runUntilIdle(maxTicks = Infinity): number {
		const start = this.sched.tick;
		const limit = start + maxTicks;
		this.finishTick();
		for (;;) {
			const due = this.nextDue();
			if (due === null || due > limit) break;
			this.sched.skipTicks(due - this.sched.tick - 1);
			this.runTick();
		}
		return this.sched.tick - start;
	}

	/**
	 * Real-time mode: runs one tick every tick_lag * 100 ms of wall-clock time until the returned
	 * stop() is called. Late ticks run back to back to catch up (up to 10 at once).
	 */
	runRealtime(): () => void {
		let stopped = false;
		let next = Date.now() + this.sched.tickLag * 100;
		const loop = () => {
			if (stopped) return;
			let n = 0;
			while (Date.now() >= next && n++ < 10) {
				this.runTick();
				next += this.sched.tickLag * 100;
			}
			if (n >= 10) next = Date.now();
			setTimeout(loop, Math.max(0, next - Date.now()));
		};
		loop();
		return () => {
			stopped = true;
		};
	}

	/** input()/alert() waiting for the page: the caller gets a null placeholder result and parks until `answerPrompt`. */
	park(req: PromptReq): void {
		this.yieldPrompt = req;
		this.yieldDelay = Infinity;
	}

	/** The page answered: the parked thread resumes with `value` as the result of its input()/alert(). */
	answerPrompt(req: PromptReq, value: Value): void {
		const t = req.thread;
		if (!t || !this.sched.parked.delete(t)) return;
		t.frames[t.frames.length - 1].resume = value;
		this.sched.schedule(t, 0);
	}

	/** `sleep(delay)`: called by the native. The thread suspends once the native returns. */
	requestSleep(delay: number): void {
		// Measured: sleep(-1) doesn't yield while the tick has time left. (BYOND backgrounds a
		// sleep(-1) when the tick is overrun; unverified, so here it never yields.)
		if (delay < 0) return;
		this.yieldDelay = delay;
	}

	/**
	 * Allocates the object for `new type(args)` and puts an atom in place; no procs run yet.
	 * Measured: a movable is already in its loc (args[1]) when New() runs, and no Enter/Entered are
	 * called. A turf needs a turf as its loc ("bad loc" otherwise) and re-types that turf in place.
	 */
	private makeObject(type: DMType, args: Value[]): DMObject {
		const kind = this.atomKind(type);
		if (kind === Kind.Turf) {
			const where = args.length > 0 ? args[0] : null;
			if (!(where instanceof DMAtom) || where.kind !== Kind.Turf || where.deleted) throw new DMRuntimeError("bad loc");
			const t = this.map.prepareTurf(type, where.x, where.y, where.z)!;
			this.resetVars(t);
			return t;
		}
		const obj = this.allocObject(type);
		if (kind && kind !== Kind.Area && args.length > 0 && isAtom(args[0])) this.map.setLoc(obj as DMAtom, args[0]);
		return obj;
	}

	private overrideCache = new Map<string, [string, JsonValue][]>();
	/** `new T{var = value}`: the compiler's JSON text ({"var": constant, ...}) set as the object's starting values, before New() and the (init) proc. */
	private applyVarOverrides(obj: DMObject, text: string): void {
		let list = this.overrideCache.get(text);
		if (list === undefined) {
			list = Object.entries(JSON.parse(text) as Record<string, JsonValue>);
			this.overrideCache.set(text, list);
		}
		for (const [k, jv] of list) {
			let v = this.tree.convertValue(jv);
			if (v instanceof ListLiteral) v = this.materialize(v);
			this.setField(obj, k, v);
		}
	}

	/** `new type(args...)` from TS: runs the (init) proc and New() to completion. */
	newObject(type: DMType, args: Value[] = [], usr: Value = null): DMObject {
		if (!type.isSubtypeOf(this.datumType) && !type.special) throw new NotImplementedError(`new ${type.path}`);
		const obj = this.makeObject(type, args);
		const thread = new Thread();
		const newProc = type.procs.get("New");
		if (newProc && !(newProc.isNative && newProc.path === "/datum/proc/New")) this.enter(thread, newProc, args, obj, usr);
		if (type.initProc) this.enter(thread, type.initProc, [], obj, usr);
		if (thread.frames.length) this.run(thread);
		return obj;
	}

	// ---- what the translated runtime calls for call(), new, initial(), locate() and throw ----

	/**
	 * Op.CallStatement's proc: `call(source, id)(args)` (source an object or list, `id` a proc name or a proc) or
	 * `call(source)(args)` (source a proc, id undefined). Its src is `source`, or the caller's src for a proc.
	 */
	callTarget(source: Value, id: Value | undefined): DMProc {
		if (source instanceof DMObject || source instanceof DMList) {
			if (typeof id === "string") return this.findMethod(source, id);
			if (id instanceof DMProc) {
				// BYOND looks the proc up by name on the object's own type, so overrides win
				// (and a proc path from an unrelated type, or a global proc, finds the object's
				// same-named proc or fails). Measured: test_call_path_* in tests/dm/objects.dm.
				const t = this.typeOf(source);
				const own = t === null ? undefined : t.procs.get(id.name);
				if (own === undefined) throw new DMRuntimeError(`undefined proc or verb ${t!.path}/${id.name.replace(/_/g, " ")}().`);
				return own;
			}
			throw new DMRuntimeError(`Invalid proc (${describe(id ?? null)} on ${describe(source)})`); // unverified
		}
		if (source instanceof DMProc) return source;
		if (source === null) throw new DMRuntimeError("Cannot execute null.()"); // unverified
		throw new NotImplementedError(`call() with source ${describe(source)}`);
	}

	/** `new` with `tv` a type or a type path: its type (BYOND's error for anything else). Op.CreateObject. */
	newType(tv: Value): DMType {
		let type: DMType | undefined;
		if (tv instanceof DMType) type = tv;
		else if (typeof tv === "string") type = this.tree.getType(tv);
		if (!type) throw new DMRuntimeError(`Cannot create objects of type ${describe(tv)}.`); // unverified wording
		return type;
	}
	/** `new T{...}(args)` for a type that isn't a list: the object, before its (init) proc and New() run. */
	newBare(type: DMType, args: Value[], overrides: Value): DMObject {
		if (overrides !== null && typeof overrides !== "string") throw new NotImplementedError("new T{var = value}");
		if (!type.isSubtypeOf(this.datumType) && !type.special) throw new NotImplementedError(`new ${type.path}`);
		const obj = this.makeObject(type, args);
		if (overrides !== null) this.applyVarOverrides(obj, overrides as string);
		return obj;
	}
	/** Whether objects of type t run a Del() of their own when freed (VM.delProcOf). */
	hasUserDel(t: DMType): boolean {
		return this.delProcOf(t) !== null;
	}

	/** `initial(owner.key)` (Op.Initial). */
	initialOf(ownerV: Value, key: Value): Value {
		const owner = live(ownerV);
		if (typeof key === "number") return this.getIndex(owner, key);
		if (typeof key !== "string") throw new DMRuntimeError(`Invalid var for initial() call: ${describe(key)}`);
		let t: DMType | null = null;
		if (owner instanceof VarsList) t = owner.obj.type;
		else if (owner instanceof DMObject) t = owner.type;
		else if (owner instanceof DMType) t = owner;
		if (t === null) return null;
		if (key === "type") return t;
		if (key === "parent_type") return t.parent;
		// Measured: initial() of a static/global var is its current value; of an atom type with no
		// name of its own, the name made from the type path; of transform, a fresh identity matrix.
		if (!t.vars.has(key)) {
			const g = t.globalVars.get(key);
			if (g !== undefined) return live(this.globals[g]);
		}
		const v = t.vars.get(key);
		if (v === null || v === undefined) {
			if (key === "name" && v === null && this.atomKind(t) !== 0) return implicitName(t);
			if (key === "transform" && v === null && t.vars.has(key)) return this.identityMatrix();
		}
		// Measured: initial() of animate_movement and override reads null, even where the type sets them.
		if ((key === "override" || key === "animate_movement") && t.vars.has(key) && t.isSubtypeOf(this.tree.getType("/atom")!)) return null;
		return v === undefined ? null : v instanceof ListLiteral ? this.materialize(v) : v;
	}

	/** `locate(what) in container` (Op.Locate): a type, a \ref or tag text, or a value. */
	locateIn(what: Value, containerV: Value): Value {
		const container = live(containerV);
		if (typeof what === "string") {
			// locate("[0x...]") (a \ref) or locate("tag"). Unverified: whether the container
			// limits a ref lookup; tags are searched among atoms only.
			let found: Value = /^\[0x[0-9a-f]+\]$/.test(what) ? fromRef(what) : null;
			if (found !== null && heap.zct.length > 0) {
				// It may have lost its last reference since the last safe point.
				this.gcSafePoint(container);
				if (found.gcFlags & GCFlag.Collected) found = null;
			}
			if (found === null) found = this.locateTag(what);
			return found;
		}
		let items: Iterable<Value>;
		if (container instanceof DMList) items = container.items;
		else if (container !== null && container === this.world) {
			const kind = what instanceof DMType ? this.atomKind(what) : 0;
			if (kind !== Kind.Turf && kind !== Kind.Area) this.gcSafePoint();
			items = this.map.atomsOfKind(kind);
		}
		else if (container instanceof DMAtom && !container.deleted) items = this.map.contentsItems(container);
		else return null;
		if (what instanceof DMType) {
			for (const x of items) {
				const item = live(x);
				const t = item instanceof DMType ? item : this.typeOf(item);
				if (t !== null && t.isSubtypeOf(what)) return item;
			}
			return null;
		}
		if (container instanceof DMList) return container.contains(what) ? what : null;
		for (const x of items) if (x === what) return what;
		return null;
	}

	/** `throw v` (Op.Throw). */
	throwValue(vv: Value): never {
		const v = live(vv);
		let msg = "";
		if (v instanceof DMObject && v.hasVar("name")) {
			const name = v.getVar("name");
			if (typeof name === "string") msg = name;
		}
		throw DMRuntimeError.throwing(v, msg);
	}

	/**
	 * Pushes a frame for `proc` (a translated proc: a generator proc, or a plain one wrapped as one, runtime.ts entryPlain),
	 * or runs it at once and returns its value (a native; a proc with no body returns null).
	 * Arguments are padded with nulls to the declared count (so `args.len` is max(passed, declared)).
	 * Only the first frame of a thread gets a value back: a frame entered above another (VM.newObject's (init) above New())
	 * returns into nothing (VM.deliver).
	 */
	private enter(thread: Thread, proc: DMProc, args: Value[], src: Value, usr: Value): Value | undefined {
		if (proc.isNative) {
			// Natives see exactly what was passed (not padded): Add() with no args must add nothing.
			const fn = this.natives.get(proc.path);
			if (!fn) throw new NotImplementedError(`native proc ${proc.path}()`);
			return fn(this, args, src, usr);
		}
		while (args.length < proc.argNames.length) args.push(null);
		const tr = proc.translated;
		if (tr === null) return null; // no body (every proc with one is translated): it returns its `.`
		const f = genFramePool.length !== 0 ? genFramePool.pop()!.reuse(proc, args, src, usr) : new Frame(proc, args, src, usr);
		f.gen = tr(f);
		// Measured (zhooksleep.dm, a DM test of the old project): the engine doesn't wait for the hooks it calls inside Move() to finish
		// sleeping (tg's doors sleep in Bump). Move() here is DM (DMStandard patch), so those calls detach like waitfor = 0.
		const caller = thread.frames[thread.frames.length - 1];
		if (caller && !caller.proc.superProc && caller.proc.name === "Move" && MOVE_HOOKS.has(proc.name)) f.waitfor = false;
		thread.frames.push(f);
		return undefined;
	}

	// ---- objects ------------------------------------------------------------------------------

	/** The type of an object or list, or null for anything else. */
	typeOf(v: Value): DMType | null {
		if (v instanceof DMObject) return v.type;
		if (v instanceof DMList) return this.listType;
		return null;
	}

	/** A fresh list from a list literal found in a var's initial value. */
	materialize(lit: ListLiteral): DMList {
		const out = new DMList();
		const json = lit.json as { values?: unknown[] };
		for (const e of json.values ?? []) {
			if (e !== null && typeof e === "object" && "key" in e && !("type" in e)) {
				const kv = e as { key: never; value: never };
				out.set(this.convertInitial(this.tree.convertValue(kv.key)), this.convertInitial(this.tree.convertValue(kv.value)));
			} else {
				out.push(this.convertInitial(this.tree.convertValue(e as never)));
			}
		}
		return out;
	}

	private convertInitial(v: Value): Value {
		return v instanceof ListLiteral ? this.materialize(v) : v;
	}

	/** Allocates an object with its default vars (list literals get their own copies). No procs run. */
	allocObject(type: DMType, pinned = false): DMObject {
		const kind = this.atomKind(type);
		const o = kind ? new DMAtom(type, kind) : new DMObject(type);
		// `pinned` is a connected client: never freed, and its Del() is never run by a free, so it must not turn on delWatch
		// (that makes every proc return scan its locals for Del candidates, ~2% of a game tick once anyone has joined)
		if (pinned || kind === Kind.Turf || kind === Kind.Area || type.path === "/world") pin(o); // never freed
		else if (!this.delWatch && this.delProcOf(type) !== null) this.delWatch = true;
		this.resetVars(o);
		if (kind) this.map.addAtom(o as DMAtom);
		return o;
	}

	/**
	 * Gives an object its type's defaults: own copies of list vars and, for atoms with no name set, the
	 * name BYOND derives from the type path (measured: /obj/wt_thing is "wt thing").
	 */
	private resetVars(o: DMObject): void {
		const look = o instanceof DMAtom || o.type.lookVars;
		for (const k of o.type.listLiteralVars) {
			const l = this.materialize(o.type.vars.get(k) as ListLiteral);
			o.setVar(k, look && k === "color" ? normColor(l) : l);
		}
		if (look) for (const [k, v] of this.lookDefaults(o.type)) o.setVar(k, v);
		if (o instanceof DMAtom && o.type.vars.get("name") === null) o.setVar("name", implicitName(o.type));
	}

	/** A type's look-var defaults that BYOND stores normalised in each instance (vm/look.ts). */
	private lookDefaults(t: DMType): [string, Value][] {
		if (t.lookFix === null) {
			t.lookFix = [];
			for (const k of LOOK_VARS) {
				const v = t.vars.get(k);
				// A null default is left alone: DMStandard's step_x/step_y are null on /atom where BYOND has
				// 0 on /atom/movable only (a vars/initial() difference, left for a later chunk).
				if (v === undefined || v === null || v instanceof ListLiteral) continue;
				const nv = normLookVar(k, v)!;
				if (nv !== v) t.lookFix.push([k, nv]);
			}
		}
		return t.lookFix;
	}

	/** `new /list(a, b, ...)`: no args is empty, one number is that many nulls, more nest (a lists of b). */
	newList(sizes: Value[]): DMList {
		const make = (d: number): DMList => {
			const n = d < sizes.length && typeof sizes[d] === "number" ? Math.max(0, Math.trunc(sizes[d] as number)) : 0;
			const l = new DMList(new Array(n).fill(null));
			if (d + 1 < sizes.length) for (let i = 0; i < n; i++) l.setItem(i, make(d + 1));
			return l;
		};
		return sizes.length === 0 ? new DMList() : make(0);
	}

	/** Whether some type has a non-null compile-time `tag` default (such objects aren't in taggedDatums). */
	private defaultTags: boolean | null = null;

	/**
	 * `locate("tag")`: the first atom (in world order) with that tag, else a datum with it. Every object
	 * whose tag was set at runtime is in taggedDatums, so that's searched instead of every atom (a
	 * failed `locate(ref)` for a freed object, as SSgarbage does all the time, would otherwise walk the
	 * whole world). Falls back to the full walk when several atoms match (to keep world order) or
	 * when some type has a default tag.
	 */
	private locateTag(what: string): DMObject | null {
		if (this.defaultTags === null) {
			this.defaultTags = false;
			for (const t of this.tree.types.values()) {
				const v = t.vars.get("tag");
				if (v !== undefined && v !== null) { this.defaultTags = true; break; }
			}
		}
		let atom: DMAtom | null = null, datum: DMObject | null = null, several = this.defaultTags;
		if (!several) {
			for (const d of taggedDatums) {
				if (d.deleted || d.getVar("tag") !== what) continue;
				if (d instanceof DMAtom) {
					if (atom !== null) { several = true; break; }
					atom = d;
				} else datum ??= d;
			}
		}
		if (several) {
			for (const a of this.map.atoms) if (!a.deleted && a.getVar("tag") === what) return a;
			for (const d of taggedDatums) if (!d.deleted && !(d instanceof DMAtom) && d.getVar("tag") === what) return d;
			return null;
		}
		return atom ?? datum;
	}

	/** VM_GC_CHECK=1: reports (once per type and var) a var access on an object the collector freed. */
	private readonly gcChecked = new Set<string>();
	private gcUseAfterFree(o: GCNode, what: string): void {
		const k = `${o instanceof DMObject ? o.type.path : "/list"} ${what}`;
		if (this.gcChecked.has(k)) return;
		this.gcChecked.add(k);
		const top = this.running[this.running.length - 1]?.frames;
		const where = top?.length ? top[top.length - 1].proc.path : "(host)";
		console.error(`[vm-gc] use after free: ${k} in ${where}`);
	}

	/** Reads `owner.name`. a datum var with no special handling (most reads) takes a short path through
	 * the type's readCache; everything else goes to getFieldFull. */
	getField(owner: Value, name: string): Value {
		if (owner instanceof DMObject && owner.deleted === false && owner !== this.world && !heap.check) {
			const t = owner.type;
			if (t.special === null) {
				const d = this.plainDefault(t, name);
				if (d !== NOT_PLAIN) {
					const i = owner.shape.index.get(name);
					return live(i === undefined ? d : owner.vals![i]);
				}
				// The two most read built-ins (istype() and typecaches read `type`; movement reads `loc`).
				if (name === "type" && t.vars.has("type") && !(owner instanceof DMAppearance)) return t;
				if (name === "loc" && owner instanceof DMAtom) return owner.loc;
			}
		} else if (owner instanceof DMList && !heap.check) {
			return name === "len" ? owner.len : name === "type" ? this.listType : null;
		}
		return this.getFieldFull(owner, name);
	}

	/**
	 * the default of `name` if an instance of `t` (not the world, not deleted, `t.special` null) reads it
	 * as a plain var: what getFieldFull would return when the instance hasn't written it. NOT_PLAIN otherwise.
	 */
	plainDefault(t: DMType, name: string): Value | typeof NOT_PLAIN {
		const c = t.readCache ?? (t.readCache = new Map());
		let d = c.get(name);
		if (d === undefined) {
			d = t.vars.has(name) && !NOT_PLAIN_READ.has(name) ? t.vars.get(name) ?? null : NOT_PLAIN;
			c.set(name, d);
		}
		return d;
	}

	/** `o.name` through a site's inline cache (FieldIC); the same value as getField(o, ic.name). Kept small
	 * so V8 inlines it: hits only, the rest is readICMiss. */
	readIC(o: Value, ic: FieldIC): Value {
		if (o instanceof DMObject && ic.kind === 0 && o.deleted === false) {
			const s = o.shape, t = o.type;
			let v: Value;
			if (s === ic.s0 && t === ic.t0) v = ic.i0 < 0 ? ic.d0 : o.vals![ic.i0];
			else if (s === ic.s1 && t === ic.t1) v = ic.i1 < 0 ? ic.d1 : o.vals![ic.i1];
			else if (s === ic.s2 && t === ic.t2) v = ic.i2 < 0 ? ic.d2 : o.vals![ic.i2];
			else if (s === ic.s3 && t === ic.t3) v = ic.i3 < 0 ? ic.d3 : o.vals![ic.i3];
			else return this.readICMiss(o, ic);
			return v !== null && typeof v === "object" && (v as DMObject).deleted === true ? null : v; // live(v)
		}
		return this.readICMiss(o, ic);
	}

	private readICMiss(o: Value, ic: FieldIC): Value {
		if (o instanceof DMObject && o.deleted === false) {
			const s = o.shape, t = o.type;
			// Only what getField's own short path handles: the cache then holds what it would return.
			if (t.special === null && o !== this.world && !heap.check) {
				if (ic.kind === 1) { if (!(o instanceof DMAppearance)) return t; }
				else if (ic.kind === 2) { if (o instanceof DMAtom) return o.loc; }
				else if (ic.kind !== 0) {
					// an atom's x/y/z/contents, as getFieldFull reads them (these never take the plain path: NOT_PLAIN_READ)
					if (o instanceof DMAtom) {
						switch (ic.kind) {
							case 3: return o.kind === Kind.Turf ? o.x : this.map.coords(o)[0];
							case 4: return o.kind === Kind.Turf ? o.y : this.map.coords(o)[1];
							case 5: return o.kind === Kind.Turf ? o.z : this.map.coords(o)[2];
							default: return this.map.contentsList(o);
						}
					}
				}
				else {
					const d = this.plainDefault(t, ic.name);
					if (d !== NOT_PLAIN) {
						const i = s.index.get(ic.name) ?? -1;
						switch (ic.n) {
							case 0: ic.t0 = t; ic.s0 = s; ic.i0 = i; ic.d0 = d; ic.n = 1; break;
							case 1: ic.t1 = t; ic.s1 = s; ic.i1 = i; ic.d1 = d; ic.n = 2; break;
							case 2: ic.t2 = t; ic.s2 = s; ic.i2 = i; ic.d2 = d; ic.n = 3; break;
							default: ic.t3 = t; ic.s3 = s; ic.i3 = i; ic.d3 = d; ic.n = 0; break;
						}
						return live(i < 0 ? d : o.vals![i]);
					}
				}
			}
		}
		return this.getField(o, ic.name);
	}

	/** `o.name = v` through a site's inline cache; the same as setField(o, ic.name, v). */
	writeIC(o: Value, ic: FieldIC, v: Value): void {
		if (o instanceof DMObject && o.deleted === false) {
			const t = o.type;
			if (t === ic.w) return o.setVar(ic.name, v);
			if (t.special === null && o !== this.world && !heap.check && this.plainWrite(t, ic.name)) {
				ic.w = t;
				return o.setVar(ic.name, v);
			}
		}
		this.setField(o, ic.name, v);
	}

	/** whether an instance of `t` (not the world, not deleted, `t.special` null) writes `name` with setVar. */
	plainWrite(t: DMType, name: string): boolean {
		const c = t.writeCache ?? (t.writeCache = new Map());
		let plain = c.get(name);
		if (plain === undefined) {
			plain = t.vars.has(name) && !NOT_PLAIN_WRITE.has(name) && t !== this.appearances.type;
			c.set(name, plain);
		}
		return plain;
	}

	private getFieldFull(owner: Value, name: string): Value {
		if (heap.check && owner instanceof GCNode && owner.gcFlags & GCFlag.Collected) this.gcUseAfterFree(owner, `read .${name}`);
		if (owner === this.world && owner !== null) {
			const sched = this.sched;
			switch (name) {
				case "time": return sched.time;
				case "tick_lag": return sched.tickLag;
				case "fps": return sched.fps;
				case "tick_usage": return sched.tickUsage();
				case "cpu": return sched.lastTickUsage;
				case "timeofday": return timeOfDay();
				case "realtime": return realTime();
				case "maxx": return this.map.maxx;
				case "maxy": return this.map.maxy;
				case "maxz": return this.map.maxz;
				// Every atom in the world, a new list each read (tg reads it once: the MC stat tab's "Instances:" count).
				case "contents": return new DMList([...this.map.atoms]);
				case "log": return owner.getVar("log") ?? this.worldLogOut;
				case "params": {
					// Measured (tg's server tools bridge): a list, empty without command-line params.
					let p = owner.getVar("params");
					if (!(p instanceof DMList)) owner.setVar("params", (p = new DMList()));
					return p;
				}
			}
		}
		if (owner instanceof DMAtom && !owner.deleted) {
			switch (name) {
				case "loc": return owner.loc;
				case "contents": return this.map.contentsList(owner);
				case "x": return owner.kind === Kind.Turf ? owner.x : this.map.coords(owner)[0];
				case "y": return owner.kind === Kind.Turf ? owner.y : this.map.coords(owner)[1];
				case "z": return owner.kind === Kind.Turf ? owner.z : this.map.coords(owner)[2];
			}
		}
		if (owner instanceof DMObject) {
			if (owner.deleted) throw new DMRuntimeError(`Cannot read null.${name}`);
			if (owner.type.special) {
				const r = owner.type.special.get(owner, name);
				if (r !== undefined) return r;
			}
			// An instance var wins over a global of the same name: tg's global `config` (declared at the
			// root, so every type inherits it) must not hide SSmapping's own `config` var.
			const g = owner.hasVar(name) ? undefined : owner.type.globalVars.get(name);
			if (g !== undefined) return live(this.globals[g]);
			if (owner.hasVar(name)) {
				switch (name) {
					case "type": return owner instanceof DMAppearance ? this.appearances.imageTypeOr(owner.type) : owner.type;
					case "parent_type": return owner.type.parent;
					case "appearance": return this.appearances.read(owner);
					case "overlays": case "underlays":
						// Measured: a snapshot has no readable overlays/underlays.
						if (owner instanceof DMAppearance) throw new DMRuntimeError(`undefined variable /var/${name}`);
						break;
					case "vars": return owner.varsViewWith(this.globals, this.varNames(owner.type), (n, v) => this.setField(owner, n, v), owner instanceof DMAtom || owner.type.lookVars ? () => this.identityMatrix() : null);
				}
				const v = owner.getVar(name);
				if (v === null) {
					if (SPECIAL_LISTS.has(name) && this.hasSpecialLists(owner.type)) return this.makeSpecialList(owner, name);
					// Measured: a null transform reads as a new identity matrix (mutating it changes nothing).
					if (name === "transform" && (owner instanceof DMAtom || owner.type.lookVars) && !(owner instanceof DMAppearance)) return this.identityMatrix();
				}
				return live(v);
			}
			throw new DMRuntimeError(`undefined variable ${owner.type.path}/var/${name}`);
		}
		if (owner instanceof DMList) {
			if (name === "len") return owner.len;
			if (name === "type") return this.listType;
			return null; // measured: any other var name on a list reads as null, without an error
		}
		if (owner === null) throw new DMRuntimeError(`Cannot read null.${name}`);
		if (owner instanceof DMType) {
			// `/type.var` (and initial()) reads the type's default. Unverified in 511.
			const v = owner.vars.get(name);
			return v === undefined ? null : v instanceof ListLiteral ? this.materialize(v) : v;
		}
		throw new DMRuntimeError(`Cannot read ${describe(owner)}.${name}`); // unverified wording
	}

	/** Writes `owner.name = v`. a datum var with no special handling takes a short path through the type's
	 * writeCache; everything else goes to setFieldFull. */
	setField(owner: Value, name: string, v: Value): void {
		if (owner instanceof DMObject && owner.deleted === false && owner !== this.world && !heap.check && owner.type.special === null && this.plainWrite(owner.type, name)) {
			owner.setVar(name, v);
			return;
		}
		this.setFieldFull(owner, name, v);
	}

	private setFieldFull(owner: Value, name: string, v: Value): void {
		if (heap.check && owner instanceof GCNode && owner.gcFlags & GCFlag.Collected) this.gcUseAfterFree(owner, `write .${name}`);
		if (owner === this.world && owner !== null) {
			// Measured: world.fps = 20 makes tick_lag 0.5, and tick_lag = 1 makes fps 10.
			// Unverified: values <= 0, and writes to the read-only clock vars.
			switch (name) {
				case "tick_lag":
					if (typeof v === "number" && v > 0) this.sched.tickLag = v;
					return;
				case "fps":
					if (typeof v === "number" && v > 0) this.sched.tickLag = fround(10 / v);
					return;
				case "time": case "tick_usage": case "cpu": case "timeofday": case "realtime":
					return;
				case "log":
					owner.setVar("log", v === this.worldLogOut ? null : v);
					return;
				// Measured: growing adds world.turf cells in world.area; shrinking drops cells.
				case "maxx": this.map.resize(typeof v === "number" ? v : 0, this.map.maxy, this.map.maxz); return;
				case "maxy": this.map.resize(this.map.maxx, typeof v === "number" ? v : 0, this.map.maxz); return;
				case "maxz": this.map.resize(this.map.maxx, this.map.maxy, typeof v === "number" ? v : 0); return;
			}
		}
		if (owner instanceof DMAtom && !owner.deleted) {
			switch (name) {
				case "loc":
					// Measured: a direct loc write calls no Enter/Exit/Entered/Exited. Turfs and areas
					// can't be moved this way (unverified: ignored).
					if (owner.isMovable) this.map.setLoc(owner, isAtom(v) ? v : null);
					return;
				case "x": case "y": case "z": {
					// Measured: on a movable, moves it to the turf at the new coordinates (a 0 coordinate
					// counts as 1: an off-map obj with x set to 4 lands on (4,1,1)). Turfs: ignored.
					// Measured (q6-area): on an area it's a runtime error.
					if (owner.kind === Kind.Area) throw new DMRuntimeError(`Cannot write to atom.${name}.`);
					if (!owner.isMovable || typeof v !== "number") return;
					const [cx, cy, cz] = this.map.coords(owner);
					const nx = name === "x" ? v : cx, ny = name === "y" ? v : cy, nz = name === "z" ? v : cz;
					const t = this.map.turfAt(nx || 1, ny || 1, nz || 1);
					if (t) this.map.setLoc(owner, t);
					return;
				}
				case "key": case "ckey":
					// Setting a mob's key moves the client with that key to it (vm/clients.ts).
					if (owner.kind === Kind.Mob && this.clients.setMobKey(owner, name, v)) return;
					break;
				case "dir": {
					// Measured: non-numbers are ignored, fractions truncate, above 255 clamps to 255. On objs
					// and mobs 0 and below are ignored; turfs and areas accept 0 (negatives: unverified).
					if (typeof v !== "number") return;
					const d = Math.min(255, Math.trunc(v));
					if (owner.isMovable ? d <= 0 : d < 0) return;
					const same = owner.getVar("dir") === d;
					owner.setVar("dir", d);
					this.appearances.noteDirWrite(owner, same && owner.isMovable); // turfs: unverified
					return;
				}
				case "contents": {
					// Measured: the old contents leave (loc null) and the list's items move in, in order,
					// with no Enter/Exit calls. null just empties it. The first item that isn't a movable
					// atom stops it with "cannot append to list" (items before it have moved in).
					// Areas (measured): turfs dropped this way are left with no area (loc null); turfs in
					// the list move in. Unverified for areas: movables, and the non-atom error.
					if (v !== null && !(v instanceof DMList)) throw new NotImplementedError(`contents = ${describe(v)}`);
					const items = v === null ? [] : v.items.slice();
					const area = owner.kind === Kind.Area;
					if (area) for (const t of [...owner.areaTurfSet!]) this.map.clearArea(t);
					for (const a of owner.contents.slice()) this.map.setLoc(a, null);
					for (const x of items) {
						const a = live(x);
						if (area && a instanceof DMAtom && a.kind === Kind.Turf) this.map.setArea(a, owner);
						else if (a instanceof DMAtom && a.isMovable) this.map.setLoc(a, owner);
						else throw new DMRuntimeError("cannot append to list");
					}
					return;
				}
			}
		}
		if (owner instanceof DMObject && !owner.deleted) {
			if (owner.type === this.appearances.type) throw Appearances.readOnly(name);
			if (owner.type.special?.set(owner, name, v)) return;
			const g = owner.hasVar(name) ? undefined : owner.type.globalVars.get(name);
			if (g !== undefined) {
				this.setGlobal(g, v);
				return;
			}
			if (!owner.hasVar(name)) throw new DMRuntimeError(`undefined variable ${owner.type.path}/var/${name}`);
			if (name === "type" || name === "parent_type" || name === "vars") throw new DMRuntimeError(`Cannot modify ${owner.type.path}.${name}.`); // unverified
			switch (name) {
				case "appearance": this.appearances.write(owner, v); return;
				case "overlays": case "underlays":
					if (this.appearances.ownsOverlayLists(owner)) {
						owner.setVar(name, v === null ? null : this.appearances.newOverlayList(owner, v));
						return;
					}
					break;
				case "dir": this.appearances.noteDirWrite(owner, false); break;
				case "transform":
					// Measured: the atom keeps a copy of the matrix (later changes to the original don't show).
					if ((owner instanceof DMAtom || owner.type.lookVars) && v instanceof DMObject && v.type.path === "/matrix") {
						const m = this.allocObject(v.type);
						for (const k of ["a", "b", "c", "d", "e", "f"]) m.setVar(k, v.getVar(k));
						v = m;
					}
					break;
			}
			// step_x/step_y: only movables have them in BYOND (DMStandard puts them on /atom; a turf's are left plain).
			if ((owner instanceof DMAtom ? owner.isMovable || name[0] !== "s" : owner.type.lookVars) && LOOK_VARS.has(name)) v = normLookVar(name, v)!;
			owner.setVar(name, v);
			return;
		}
		if (owner instanceof DMList) {
			if (name === "len") {
				owner.setLen(typeof v === "number" ? v : 0);
				return;
			}
			throw new DMRuntimeError(`Cannot write to list.${name}.`); // measured
		}
		if (owner === null || owner instanceof DMObject) throw new DMRuntimeError(`Cannot modify null.${name}.`);
		throw new DMRuntimeError(`Cannot modify ${describe(owner)}.${name}.`); // unverified wording
	}

	/** Reads `indexing[index]`. */
	getIndex(indexing: Value, index: Value): Value {
		if (indexing instanceof DMList) return indexing.get(index);
		if (indexing === null) throw new DMRuntimeError("cannot read from list");
		if (indexing instanceof DMObject) {
			if (indexing.type.special) return indexing.type.special.index(indexing, index);
			throw new NotImplementedError(`indexing ${indexing.type.path}`);
		}
		throw new DMRuntimeError("cannot read from list"); // unverified for non-null non-lists
	}

	setIndex(indexing: Value, index: Value, v: Value): void {
		if (indexing instanceof DMList) return indexing.set(index, v);
		if (indexing instanceof DMObject) {
			if (indexing.type.special) return indexing.type.special.setIndex(indexing, index, v);
			throw new NotImplementedError(`indexing ${indexing.type.path}`);
		}
		// Measured for a null list; other non-lists unverified.
		throw new DMRuntimeError("cannot write to indexed value in this type of list");
	}

	/** Finds `name` on an object or list for a method call, with BYOND's error wording. */
	findMethod(obj: Value, name: string): DMProc {
		const t = this.typeOf(obj);
		if (t === null) {
			if (obj === null) throw new DMRuntimeError(`Cannot execute null.${name}().`);
			throw new DMRuntimeError(`Cannot execute ${describe(obj)}.${name}().`); // unverified wording
		}
		const p = t.procs.get(name);
		if (!p) throw new DMRuntimeError(`undefined proc or verb ${t.path}/${name}().`);
		return p;
	}

	/**
	 * Runs `thread` until it finishes or sleeps. When a proc sleeps, the frames from the innermost
	 * `set waitfor = 0` frame up move to a new sleeping thread and that frame's caller carries on with
	 * its current `.` (OpenDream's DreamThread.HandleDefer). With no such frame the whole thread sleeps.
	 */
	run(thread: Thread): void {
		this.running.push(thread);
		if (stress.on) stress.runs++;
		try {
			this.runThread(thread);
		} finally {
			this.running.pop();
		}
	}

	/** Stop hook for tools: called about every 4096 generator steps (resumes of a sleeping/yielding frame) from inside any tick, so a long tick can still be stopped. It may throw to abort the run. */
	onStopCheck: (() => void) | null = null;
	private stopCountdown = 4096;

	private runThread(thread: Thread): void {
		const frames = thread.frames;
		while (frames.length > 0) {
			if (--this.stopCountdown <= 0) { this.stopCountdown = 4096; if (this.onStopCheck) this.onStopCheck(); }
			const top = frames[frames.length - 1];
			if (srcDeleted(top) && !(top.pendingError instanceof EndProc)) {
				// Woke up (or started) with its src deleted: the proc ends, returning `.` (see deliver).
				if (this.endTop(thread)) continue;
			}
			try {
				if (top.gen !== null) this.stepGen(thread, top);
				else this.finishStandIn(thread, top);
			} catch (e) {
				this.caught(thread, e);
				continue;
			}
			if (this.yieldDelay !== null) {
				const delay = this.yieldDelay;
				this.yieldDelay = null;
				if (!this.suspend(thread, delay)) return;
			}
		}
		thread.done = true;
	}

	/** An error out of a step of `thread`'s top frame: handled (the loop goes on), or thrown on (not a DM error; a stand-in's rethrow). */
	private caught(thread: Thread, e: unknown): void {
		const frames = thread.frames;
		if (e instanceof NotImplementedError && this.lenient && frames.length > 0) {
			this.yieldDelay = null;
			this.reportError(e.message, frames, this.notImplemented, e);
			this.endTop(thread);
			return;
		}
		if (!(e instanceof DMRuntimeError)) throw e;
		this.yieldDelay = null;
		this.handleError(thread, e);
	}

	/**
	 * runtime.ts callGenFromPlain: a temporary thread [stand-in, callee...] whose top frame's generator was stepped once
	 * by the runtime itself (not by stepGen) and asked to suspend (`req`), or threw `err` (req null). Carries on exactly as
	 * runThread would have after that step of stepGen: suspends (or handles the error), then runs the thread as usual.
	 */
	resumeTemp(thread: Thread, req: GenRequest | null, err: unknown): void {
		this.running.push(thread);
		try {
			let ok = false;
			try {
				if (req === null) throw err;
				thread.frames[thread.frames.length - 1].resume = req.value;
				ok = true;
			} catch (e) {
				this.caught(thread, e);
			}
			if (ok && this.yieldDelay !== null) {
				const delay = this.yieldDelay;
				this.yieldDelay = null;
				if (!this.suspend(thread, delay)) return;
			}
			this.runThread(thread);
		} finally {
			this.running.pop();
		}
	}

	/**
	 * runtime.ts callGenFromPlain: the callee on top of a temporary thread [stand-in, callee] returned `value` in its first
	 * step: what finishFrame (callee), deliver and the stand-in's Return + finishFrame would have done. The thread is left
	 * empty and done; returns its result (null if the callee's src was deleted: the stand-in shares it, see deliver).
	 */
	tempReturned(thread: Thread, value: Value): Value {
		const frames = thread.frames;
		const f = frames.pop()!;
		const standIn = frames[0];
		thread.done = true;
		if (srcDeleted(standIn)) {
			frames.pop();
			if (this.delWatch && this.holdsDelCandidate(f)) this.gcSafePoint(thread.rootsKnown ? value : undefined);
			return (thread.result = standIn.dot);
		}
		if (this.delWatch && this.holdsDelCandidate(f)) this.gcSafePoint(undefined);
		frames.pop();
		standIn.dot = value;
		if (this.delWatch && this.holdsDelCandidate(standIn)) this.gcSafePoint(thread.rootsKnown ? value : undefined);
		return (thread.result = value);
	}

	/**
	 * runs a translated generator proc until it finishes or suspends (it yields only to suspend, GenRequest).
	 * The value it resumes with waits on its top frame's stack (the frame that asked: an inline callee shares the
	 * generator, runtime.ts callGen); runThread then suspends the thread (VM.yieldDelay).
	 */
	private stepGen(thread: Thread, f: Frame): void {
		let r: IteratorResult<GenRequest, Value>;
		const err = f.pendingError;
		if (err !== null) {
			f.pendingError = null;
			r = f.gen!.throw(err);
		} else {
			const v = f.resume;
			f.resume = undefined;
			r = f.gen!.next(v === undefined ? null : v);
		}
		if (r.done) {
			this.finishFrame(thread, r.value);
			return;
		}
		thread.frames[thread.frames.length - 1].resume = r.value.value;
	}

	/**
	 * a stand-in (runtime.ts tempThread) on top of its temporary thread: its callee has finished (or gone to a thread of
	 * its own) and left what it returned in `resume`. The stand-in returns that: the thread's result.
	 */
	private finishStandIn(thread: Thread, f: Frame): void {
		const v = f.resume === undefined ? null : f.resume;
		f.resume = undefined;
		f.dot = v;
		this.finishFrame(thread, v);
	}

	/**
	 * runtime.ts: a `set waitfor = 0` proc (or a hook the built-in Move() called), frame `f` on `thread`, run in place
	 * by its translated caller, asked to suspend: `f` and the frames above it move to a new thread that suspends as the
	 * whole thread would have (sleep, or parked for input()), resuming with `value`. Its caller carries on with its `.`:
	 * what suspend() does for the innermost frame with waitfor = 0 (OpenDream's DreamThread.HandleDefer).
	 */
	detach(thread: Thread, f: Frame, value: Value): void {
		const frames = thread.frames;
		const k = frames.lastIndexOf(f);
		if (k < 0) throw new Error(`detach: ${f.proc.path} isn't on the running thread`);
		const sleeper = new Thread();
		for (const fr of frames.splice(k)) sleeper.frames.push(fr);
		sleeper.frames[sleeper.frames.length - 1].resume = value;
		const delay = this.yieldDelay ?? 0;
		this.yieldDelay = null;
		this.enqueue(sleeper, delay);
	}

	private enqueue(t: Thread, delay: number): void {
		const p = this.yieldPrompt;
		if (p) { this.yieldPrompt = null; p.thread = t; this.sched.parked.add(t); } else this.sched.schedule(t, delay);
	}

	/** Puts (part of) a thread to sleep. Returns true if the thread itself can carry on. */
	private suspend(thread: Thread, delay: number): boolean {
		const frames = thread.frames;
		let k = frames.length - 1;
		while (k >= 0 && frames[k].waitfor) k--;
		if (k < 0) {
			this.enqueue(thread, delay);
			return false;
		}
		const sleeper = new Thread();
		for (const f of frames.splice(k)) sleeper.frames.push(f);
		this.enqueue(sleeper, delay);
		const split = sleeper.frames[0];
		this.deliver(thread, split, split.dot);
		if (frames.length === 0) {
			thread.done = true;
			return false;
		}
		return true;
	}

	/**
	 * A runtime error or `throw`: the innermost open `try` in this thread catches it (the frames
	 * above it are dropped). Otherwise BYOND logs it and aborts only the current proc, which returns
	 * its `.` to the caller. (Measured: an uncaught `throw x` logs x.name if x is an object with a
	 * text name, else an empty message.)
	 */
	/** translate/runtime.ts: the whole call stack when nested threads run translated code (their
	 * callers sit on other threads and on extraFrames); used for error reports. */
	stackOf: (() => Frame[]) | null = null;
	reportFrames(frames: Frame[]): Frame[] {
		return this.stackOf !== null && this.running.length > 1 ? this.stackOf() : frames;
	}

	private handleError(thread: Thread, e: DMRuntimeError): void {
		const frames = thread.frames;
		let i = frames.length - 1;
		while (i >= 0 && frames[i].tries === 0) i--;
		if (i >= 0) {
			const value = e.isThrow ? e.thrown : this.makeException(e.message, (e.frames as Frame[] | undefined) ?? this.reportFrames(frames), e);
			frames.length = i + 1;
			const f = frames[i];
			f.tries--;
			if (f.gen !== null) {
				// the translated proc's own JS catch takes it.
				e.caught = value;
				f.pendingError = e;
				f.resume = undefined;
				return;
			}
			// A stand-in (runtime.ts tempThread): its plain caller's translated try takes it, as a fresh `throw value`
			// out of this run (the stand-in rethrows; that catch then closes its own try: tryCaught, e.caught unset).
			this.throwValue(value);
		}
		const f = frames[frames.length - 1];
		if (f.rethrow) throw e;
		this.logUncaught(e, (e.frames as Frame[] | undefined) ?? this.reportFrames(frames));
		this.endTop(thread);
	}

	/**
	 * ends the top frame, returning its `.`. A translated proc called inline by another (runtime.ts callGen:
	 * same generator as the frame below it) can't just be popped: its caller's JS is waiting on it, so it gets an
	 * EndProc thrown into it at its next step instead. Returns true if the frame is gone already.
	 */
	private endTop(thread: Thread): boolean {
		const frames = thread.frames;
		const f = frames[frames.length - 1];
		if (f.gen !== null && frames.length >= 2 && frames[frames.length - 2].gen === f.gen) {
			this.endInline(f);
			return false;
		}
		this.finishFrame(thread, f.dot);
		return true;
	}

	private endInline(f: Frame): void {
		f.pendingError = new EndProc(f);
		f.resume = undefined;
	}

	/** An error nothing caught: world.Error(E) if the game defines one, else the runtime log. */
	logUncaught(e: DMRuntimeError, frames: Frame[]): void {
		const worldError = this.world ? this.world.type.procs.get("Error") : undefined;
		if (worldError && !worldError.isNative && !this.inWorldError) {
			// Measured: an uncaught error calls world.Error(E) (E is the /exception, or the thrown value
			// itself), then the proc aborts as usual. The built-in world/Error that `..()` reaches logs
			// the error (not when its message is empty); an error inside world/Error is logged the
			// default way and doesn't recurse.
			const value = e.isThrow ? e.thrown : this.makeException(e.message, frames, e);
			const snapshot = frames.slice();
			const message = e.message;
			const prevLog = this.pendingErrorLog;
			this.pendingErrorLog = () => {
				if (message !== "") this.reportError(message, snapshot, undefined, e);
			};
			this.inWorldError = true;
			try {
				this.call(worldError, [value], this.world);
			} finally {
				this.inWorldError = false;
				this.pendingErrorLog = prevLog;
			}
		} else {
			this.reportError(e.message, frames, undefined, e);
		}
	}

	/**
	 * The /exception a `catch` gets for a runtime error. Measured: name is the message, desc is
	 * "proc name: <name with spaces> (<path>)\n", file and line are null (no debug info).
	 */
	makeException(message: string, frames: Frame[], err?: unknown): Value {
		const f = frames[frames.length - 1];
		const t = this.tree.getType("/exception");
		if (!t) return message;
		const e = this.allocObject(t);
		e.setVar("name", message);
		if (!this.debugInfo) {
			e.setVar("desc", `proc name: ${procDisplayName(f.proc)} (${f.proc.path})\n`);
			return e;
		}
		// With DEBUG (tg defines it): the shape of BYOND's reference boot log (web/reference/byond-boot.log).
		const src = this.sourceOf(f, err).source;
		const colon = src.lastIndexOf(":");
		const file = src.slice(0, colon);
		const line = Number(src.slice(colon + 1));
		e.setVar("file", file.slice(file.lastIndexOf("/") + 1));
		e.setVar("line", line);
		const lines = [
			`proc name: ${procDisplayName(f.proc)} (${byondProcPath(f.proc)})`,
			`  source file: ${file.slice(file.lastIndexOf("/") + 1)},${line}`,
			`  usr: ${this.debugDescribe(f.usr)}`,
			`  src: ${this.debugDescribe(f.src)}`,
			`  call stack:`,
		];
		for (let i = frames.length - 1; i >= 0; i--) {
			const fr = frames[i];
			const args = fr.args.slice(0, Math.max(fr.proc.argNames.length, 0)).map((a) => this.debugDescribe(a, true)).join(", ");
			if (fr.proc === this.tree.globalInitProc) lines.push(`world: ()`);
			else if (fr.src === null) lines.push(`${procDisplayName(fr.proc)}(${args})`); // unverified for global procs
			else lines.push(`${this.debugDescribe(fr.src)}: ${procDisplayName(fr.proc)}(${args})`);
		}
		e.setVar("desc", lines.join("\n"));
		return e;
	}

	/** Set when the program was compiled with DEBUG: exceptions get file/line and a full call stack. */
	debugInfo = false;
	/** Host hook: an icon file's frame size (see tools/dmi-size.ts). Unset: every icon is 32x32. */
	iconSize: ((path: string) => [number, number] | null) | null = null;
	/** Host hook: a whole icon file's pixels, for GetPixel on runtime icons (dmi-node.ts iconLoader). */
	loadIcon: ((path: string) => IconImage | null) | null = null;
	/** Host hook: an icon file's states (names, dirs, frames), for icon_states() (dmi-node.ts iconStatesReader). Unset: none. */
	iconStates: ((path: string) => readonly Omit<DmiState, "cells">[] | null) | null = null;
	/** Icons made at run time by fcopy_rsc(/icon): the Resource path it returned -> the icon's recipe.
	 *  Drawing tools turn these into real .dmi files (client-dump.ts). */
	readonly runtimeIcons = new Map<string, IconRecipe>();
	/** natives-misc's /icon recipes and savefile.ts's unwritten handles, reachable for vm/snapshot.ts. */
	iconRecipes: WeakMap<DMObject, IconRecipe> | null = null;
	savefileDirty: Set<unknown> | null = null;
	/** set by the built-in world.Reboot() (tg's `..()` in /world/Reboot). In BYOND the world shuts down there and
	 *  starts again from world/New; here the host sees this after the tick and starts the next world (boot-worker.ts). */
	rebootRequested: { reason: string; time: number } | null = null;

	/** How BYOND's DEBUG runtime dump shows a value: "name (type)", atoms on the map with "(x,y,z)". */
	private debugDescribe(v: Value, asArg = false): string {
		v = live(v);
		if (v === null) return "null";
		if (v === this.world) return "world";
		if (typeof v === "string") return asArg ? `"${v}"` : v;
		if (v instanceof DMAtom) {
			const [x, y, z] = v.kind === Kind.Turf ? [v.x, v.y, v.z] : this.map.coords(v);
			return `${stringify(v)}${x ? ` (${x},${y},${z})` : ""} (${v.type.path})`;
		}
		if (v instanceof DMObject) return `${stringify(v)} (${v.type.path})`;
		if (v instanceof DMList) return "/list (/list)";
		return stringify(v);
	}

	/**
	 * hook from src/translate/runtime.ts: where error `err` happened in translated proc frame `f` (game/ file:line from
	 * the JS stack, DM file:line from game/_dm-lines.json), or null if the stack doesn't show it.
	 */
	translatedSource: ((f: Frame, err: unknown) => { game: string; dm: string | null } | null) | null = null;

	/** Where frame f is: (translated) where `err` was thrown, else its proc's first line. */
	private sourceOf(f: Frame, err: unknown): { source: string; game?: string } {
		// the /exception (makeException) and the log line (reportError) ask for the same error: found once
		const key = err !== null && typeof err === "object" ? err : null;
		const known = key !== null ? this.errorSources.get(key) : undefined;
		if (known !== undefined && known.frame === f) return known.where;
		const t = this.translatedSource?.(f, err ?? new Error()) ?? null;
		const where = t === null ? { source: f.proc.sourceStart() } : { source: t.dm ?? f.proc.sourceStart(), game: t.game };
		if (key !== null) this.errorSources.set(key, { frame: f, where });
		return where;
	}
	private readonly errorSources = new WeakMap<object, { frame: Frame; where: { source: string; game?: string } }>();

	reportError(message: string, frames: Frame[], alsoInto?: RuntimeErrorRecord[], err?: unknown): void {
		const f = frames[frames.length - 1];
		const where = this.sourceOf(f, err);
		const rec: RuntimeErrorRecord = {
			message,
			proc: f.proc.path,
			source: where.source,
			callStack: frames.map((fr) => fr.proc.path).reverse(),
		};
		if (where.game !== undefined) rec.game = where.game;
		this.runtimeErrors.push(rec);
		alsoInto?.push(rec);
		if (this.dumpSrcOn && rec.proc.includes(this.dumpSrcOn)) this.dumpSrc(f.src);
		this.onRuntimeError(rec);
	}

	/** Debug aid: VM_DUMP_SRC=<text> prints src's written vars (and each atom var's position, pixel
	 * offsets, transform and icon) to stderr on any runtime in a proc whose path contains <text>. */
	private readonly dumpSrcOn = typeof process !== "undefined" ? process.env.VM_DUMP_SRC ?? "" : "";
	private dumpSrc(src: Value): void {
		src = live(src);
		if (!(src instanceof DMObject)) return;
		const d = (v: Value): string => {
			v = live(v);
			if (v instanceof DMObject && !(v instanceof DMAtom) && v.type.path === "/matrix")
				return `matrix(${["a", "b", "c", "d", "e", "f"].map((k) => String(v.getVar(k))).join(",")})`;
			return this.debugDescribe(v, true);
		};
		const parts = [...src.ownVars()].map(([k, v]) => `${k}=${d(v)}`);
		for (const [k, v0] of src.ownVars()) {
			const v = live(v0);
			if (v instanceof DMAtom)
				parts.push(`${k}{${["pixel_x", "pixel_y", "transform", "icon", "icon_state"].map((n) => `${n}=${d(v.getVar(n))}`).join(" ")}}`);
		}
		console.error(`[vm-dump] ${this.debugDescribe(src)}: ${parts.join(" | ")}`);
	}

	/** `del`: marks the object deleted. An atom also leaves the map, and its contents are deleted (measured). */
	markDeleted(o: DMObject): void {
		if (this.clients.list.includes(o)) this.clients.disconnect(o); // del(client) is tg's kick: the server closes that connection
		if (o instanceof DMAtom) this.map.destroy(o);
		o.deleted = true;
		o.type.special?.free?.(o);
		// Measured: what it referred to is freed now if nothing else refers to it.
		releaseRefs(o);
		forgetRef(o);
	}

	setGlobal(i: number, v: Value): void {
		const old = this.globals[i];
		this.globals[i] = v;
		incRef(v);
		decRef(old);
	}

	// ---- garbage collection (see gc.ts) -------------------------------------------------------

	/** Threads currently executing (a native can start a nested one: newObject, call). */
	readonly running: Thread[] = [];
	private gcEpoch = 0;
	/** Diff mode (diffHook.gcTickOnly): collect only at tick boundaries (runTick), so frees land on the same tick in every engine. */
	/** Collector stats for the boot log. */
	readonly gcStats = { safePoints: 0, ms: 0, freed: 0 };
	private readonly userDel = new Map<DMType, DMProc | null>();
	/** Set once an object with a user-defined Del() exists (see holdsDelCandidate). */
	delWatch = false;
	/**
	 * frames of translated plain procs (translate/runtime.ts), which aren't on any thread. They are
	 * GC roots like thread frames (their JS locals through Frame.vars). The runtime pushes and pops them.
	 */
	readonly extraFrames: Frame[] = [];
	private readonly extraThread = { frames: this.extraFrames } as unknown as Thread;

	/** The Del() a freed object of this type runs, or null when it's only the built-in one. */
	private delProcOf(t: DMType): DMProc | null {
		let p = this.userDel.get(t);
		if (p === undefined) {
			const d = t.procs.get("Del");
			p = d && !d.isNative && d.owner?.path !== "/datum" ? d : null;
			this.userDel.set(t, p);
		}
		return p;
	}

	/**
	 * A safe point: frees everything in the zero-count table that no proc frame refers to, and what
	 * that frees in turn. `extra` holds values the caller has popped off the operand stack but still
	 * uses. Does nothing while a native has started a nested thread (its JS locals can't be scanned).
	 */
	gcSafePoint(extra?: Value): void {
		if (heap.zct.length === 0) return;
		if (diffHook.gcTickOnly && !diffHook.atTick) return;
		if (this.running.length > 1) for (let i = 1; i < this.running.length; i++) if (!this.running[i].rootsKnown) return;
		if (heap.off) {
			for (const n of heap.zct) n.gcFlags &= ~GCFlag.InZct;
			heap.zct = [];
			return;
		}
		const t0 = performance.now();
		const epoch = (this.gcEpoch = (this.gcEpoch + 1) & 0x7ffffff) || (this.gcEpoch = 1);
		const mark = (v: Value | GCNode): void => {
			if (v instanceof GCNode) {
				setMark(v, epoch);
				if (v.gcFlags & GCFlag.View && v.viewTarget !== null) setMark(v.viewTarget, epoch);
			}
		};
		const markFrames = (th: Thread): void => {
			for (const f of th.frames) {
				mark(f.src);
				mark(f.usr);
				mark(f.dot);
				mark(f.lastDeref);
				if (f.boundSrc !== undefined) mark(f.boundSrc);
				for (const v of f.args) mark(v);
				for (const v of f.locals) mark(v);
				if (f.vars !== null) for (const v of f.vars()) mark(v);
				if (f.resume !== undefined) mark(f.resume);
				for (const en of f.enumerators) {
					if (!(en instanceof ListEnumerator)) continue;
					mark(en.list);
					for (const v of en.collectable()) mark(v);
				}
			}
		};
		for (const th of this.running) markFrames(th);
		for (const th of this.sched.sleepers()) markFrames(th);
		if (this.extraFrames.length) markFrames(this.extraThread);
		for (const a of this.walkers.keys()) mark(a);
		if (extra !== undefined) mark(extra);

		const keep: GCNode[] = [];
		let roots = heap.zct;
		heap.zct = [];
		while (roots.length) {
			const dels = this.freeFrom(roots, epoch, keep);
			// Del() procs run after the pass, each then releasing its object's references. What that
			// frees (and whatever the Del() procs made and dropped) is freed in the next pass. BYOND
			// runs each Del() at once instead; only the order of Del() calls can differ.
			for (const [o, del] of dels) {
				this.call(del, [], o);
				releaseRefs(o);
			}
			roots = heap.zct;
			heap.zct = [];
		}
		heap.zct = keep;
		this.gcStats.safePoints++;
		this.gcStats.ms += performance.now() - t0;
	}

	/** Frees what in `roots` has no references and isn't marked, and the cascade. Returns the pending Del() calls. */
	private freeFrom(roots: GCNode[], epoch: number, keep: GCNode[]): [DMObject, DMProc][] {
		const dels: [DMObject, DMProc][] = [];
		// Oldest first, and each one's cascade (depth first, parents before children) before the next.
		const stack: GCNode[] = [];
		for (const root of roots) {
			root.gcFlags &= ~GCFlag.InZct;
			stack.push(root);
			while (stack.length) {
				const o = stack.pop()!;
				if (o.rc > 0 || o.gcFlags & GCFlag.Collected) continue;
				if (markOf(o) === epoch) {
					// A proc still refers to it: check again at the next safe point.
					if (!(o.gcFlags & GCFlag.InZct)) {
						o.gcFlags |= GCFlag.InZct;
						keep.push(o);
					}
					continue;
				}
				o.gcFlags = (o.gcFlags & ~GCFlag.InZct) | GCFlag.Collected;
				this.gcStats.freed++;
				if (o instanceof DMObject) {
					if (o instanceof DMAtom) this.map.removeAtom(o);
					else if (o instanceof DMAppearance) this.appearances.forget(o);
					forgetRef(o);
					o.type.special?.free?.(o);
					const del = o.deleted ? null : this.delProcOf(o.type);
					if (del) {
						// Del() runs before what it refers to is released, so it can still read its vars.
						dels.push([o, del]);
						continue;
					}
				} else forgetRef(o as DMList);
				this.releaseInto(o, stack);
			}
		}
		return dels;
	}

	/**
	 * Debug check of the reference counts: walks everything reachable (globals, the map, tagged
	 * objects, proc frames, the ZCT) and counts the heap references to each object. A count below
	 * that is a missed incRef (the object could be freed while in use); above it is either a missed
	 * decRef or references from unreachable objects (cycles), so only the first kind is an error.
	 * Also reports reachable objects that were freed. Returns one line per problem type.
	 */
	gcVerify(): string[] {
		const count = new Map<GCNode, number>();
		const seen = new Set<GCNode>();
		const todo: GCNode[] = [];
		const visit = (v: Value | GCNode): void => {
			if (!(v instanceof GCNode)) return;
			if (v.gcFlags & GCFlag.View && v.viewTarget !== null) visit(v.viewTarget);
			if (v.gcFlags & GCFlag.View) return;
			if (!seen.has(v)) {
				seen.add(v);
				todo.push(v);
			}
		};
		const edge = (v: Value | GCNode): void => {
			if (!(v instanceof GCNode)) return;
			let t: GCNode | null = v;
			if (t.gcFlags & GCFlag.View) t = t.viewTarget;
			if (t === null) return;
			count.set(t, (count.get(t) ?? 0) + 1);
			visit(t);
		};
		for (const v of this.globals) edge(v);
		visit(this.world);
		for (const a of this.map.atoms) visit(a);
		for (const d of taggedDatums) visit(d);
		for (const n of heap.zct) visit(n);
		const frames = (th: Thread) => {
			for (const f of th.frames) {
				for (const v of [f.src, f.usr, f.dot, f.lastDeref, ...f.args, ...f.locals, f.resume ?? null, ...(f.vars?.() ?? [])]) visit(v);
				for (const en of f.enumerators) if (en instanceof ListEnumerator) { visit(en.list); if (!en.world) for (const v of en.items) visit(v); }
			}
		};
		for (const th of this.running) frames(th);
		for (const th of this.sched.sleepers()) frames(th);
		frames(this.extraThread);
		while (todo.length) {
			const n = todo.pop()!;
			if (n.gcFlags & GCFlag.Released) continue; // deleted: its references were released
			if (n instanceof DMObject) {
				if (n.vals) for (const v of n.vals) edge(v);
				if ((n.ownVar("tag") ?? null) !== null) count.set(n, (count.get(n) ?? 0) + 1);
				if (n instanceof DMAtom) {
					for (const c of n.contents) edge(c);
					if (n.loc && n.isMovable) edge(n.loc);
				}
			} else if (n instanceof DMList) {
				for (const v of n.items) edge(v);
				if (n.assoc) for (const v of assocValues(n.assoc)) edge(v);
			}
		}
		const problems = new Map<string, number>();
		const note = (k: string) => problems.set(k, (problems.get(k) ?? 0) + 1);
		const name = (n: GCNode) => (n instanceof DMObject ? n.type.path : "/list");
		for (const n of seen) {
			const rc = n.rc >= PERMANENT_RC ? n.rc - PERMANENT_RC : n.rc;
			const c = count.get(n) ?? 0;
			if (n.gcFlags & GCFlag.Collected && !(n instanceof DMObject && n.deleted)) note(`freed but reachable: ${name(n)}`);
			if (n instanceof DMObject && n.deleted) continue;
			if (rc < c) note(`count too low: ${name(n)}`);
		}
		return [...problems].map(([k, c]) => `${k} x${c}`);
	}

	/** Releases a freed object's references; those that reach 0 go on `stack` (children in order). */
	private releaseInto(o: GCNode, stack: GCNode[]): void {
		const before = heap.zct.length;
		releaseRefs(o);
		// releaseRefs queued what reached 0 on the ZCT; take them back to free them now.
		const z = heap.zct; // in place (splice allocated an array each time)
		for (let i = z.length - 1; i >= before; i--) {
			z[i].gcFlags &= ~GCFlag.InZct;
			stack.push(z[i]);
		}
		z.length = before;
	}

	/** Pops the top frame and hands `value` to whoever called it (VM.deliver). */
	private finishFrame(thread: Thread, value: Value): void {
		const f = thread.frames.pop()!;
		this.deliver(thread, f, value);
		// A translated proc's temporary thread (runtime.ts) hands its result to JS: keep that alive.
		if (this.delWatch && this.holdsDelCandidate(f)) this.gcSafePoint(thread.rootsKnown && thread.frames.length === 0 ? value : undefined);
	}

	/** finishFrame's release check for a frame that wasn't on a thread (a translated plain proc); `value` is its return value. */
	frameReturned(f: Frame, value: Value): void {
		if (this.delWatch && this.holdsDelCandidate(f)) this.gcSafePoint(value);
	}

	/**
	 * Measured: BYOND frees what a proc was the last to refer to when it returns, and runs its Del()
	 * then. Only a user-defined Del() can tell the difference from the next safe point, so this
	 * checks just for objects that have one (tg defines none; the tests do).
	 */
	private holdsDelCandidate(f: Frame): boolean {
		const c = (v: Value): boolean => v instanceof DMObject && v.rc === 0 && !(v.gcFlags & GCFlag.Collected) && this.delProcOf(v.type) !== null;
		if (c(f.lastDeref) || c(f.src) || c(f.dot)) return true;
		for (const v of f.locals) if (c(v)) return true;
		if (f.vars !== null) for (const v of f.vars()) if (c(v)) return true;
		for (const v of f.args) if (c(v)) return true;
		return false;
	}

	/** Hands a finished (already removed) frame's `value` to whoever called it. */
	private deliver(thread: Thread, f: Frame, value: Value): void {
		const caller = thread.frames[thread.frames.length - 1];
		if (caller && srcDeleted(caller)) {
			if (caller.gen !== null && thread.frames.length >= 2 && thread.frames[thread.frames.length - 2].gen === caller.gen) {
				this.endInline(caller); // see endTop
				return;
			}
			// Measured: deleting an object ends every proc whose src it is (a sleeping one, or one
			// waiting on a callee); each returns its `.` to its caller when control comes back to it.
			// Procs above it (other srcs) carry on normally. `src = null` beforehand escapes this.
			thread.frames.pop();
			this.deliver(thread, caller, caller.dot);
			return;
		}
		// only a stand-in takes a callee's value (a generator caller's own callees run inside its generator; the one other
		// frame below another is New() under an (init) proc, VM.newObject, whose value is thrown away).
		if (caller) { if (caller.gen === null) caller.resume = value; }
		else thread.result = value;
	}

	/** for(x in src): Op.CreateListEnumerator / CreateFilteredListEnumerator (also called directly by translated code). */
	listEnumerator(src: Value, filter: DMType | null): ListEnumerator {
		let list: DMList | null = null;
		let items: Value[] = [];
		if (src instanceof DMList) {
			list = src;
			items = src.items.slice();
		} else if (src !== null && src === this.world) {
			const kind = filter ? this.atomKind(filter) : 0;
			// Movables nothing refers to any more must not show up (turfs and areas are never freed).
			if (kind !== Kind.Turf && kind !== Kind.Area) this.gcSafePoint();
			return new ListEnumerator([...this.map.atomsOfKind(kind)], null, filter, this, true);
		} else if (src instanceof DMAtom && !src.deleted) {
			// Measured: a snapshot, like lists (things moved in or out during the loop don't change it).
			items = this.map.contentsItems(src).slice();
		}
		// Measured: null, numbers, text and plain datums just don't run the loop.
		return new ListEnumerator(items, list, filter, this);
	}

	/** listEnumerator(src, filter) made by refilling `en`, a finished enumerator that isn't a world loop (runtime.ts forList). */
	listEnumeratorReuse(en: ListEnumerator, src: Value, filter: DMType | null): ListEnumerator {
		if (src instanceof DMList) en.refill(src.items, src, filter);
		else if (src !== null && src === this.world) return this.listEnumerator(src, filter);
		else en.refill(src instanceof DMAtom && !src.deleted ? this.map.contentsItems(src) : null, null, filter);
		return en;
	}

	/** for(var/T/x) with no `in`: every atom of type T in the world (creation order; BYOND's order follows its object ids,
	 * unverified). Datum types would need every datum tracked. */
	typeEnumerator(t: Value): ListEnumerator {
		if (!(t instanceof DMType)) throw new DMRuntimeError(`Cannot create a type enumerator with type ${describe(t)}`);
		const kind = this.atomKind(t);
		if (!kind) throw new NotImplementedError(`for(var${t.path}/x) over non-atoms`);
		if (kind !== Kind.Turf && kind !== Kind.Area) this.gcSafePoint();
		return new ListEnumerator([...this.map.atomsOfKind(kind)], null, t, this, true);
	}

	/** `v in l` (Op.IsInList). */
	isInList(v: Value, l: Value): boolean {
		l = live(l);
		if (l !== null && l === this.world) return v instanceof DMAtom && this.map.atoms.has(v);
		if (l instanceof DMAtom) return v instanceof DMAtom && this.map.contentsItems(l).includes(v);
		return l instanceof DMList && l.contains(v);
	}

	isType(v: Value, t: Value): boolean {
		const want = t instanceof DMType ? t : this.typeOf(t);
		if (want === null) return false;
		const have = this.typeOf(v);
		return have !== null && have.isSubtypeOf(want);
	}

	/** client-side animation events (animate steps, flick) since the view differ last drained them. null = nobody is watching, nothing is recorded. */
	animLog: AnimEvent[] | null = null;

	/** The object the last animate() call named: a call with no object adds a step to it. */
	private lastAnimated: Value = null;

	/**
	 * animate(Object, var = value, ..., time, loop, easing, flags). each step is also recorded in animLog for the live page.
	 * Measured: each call sets the object's vars to that step's values at once (the client does the
	 * in-between), a call without an object applies to the last animated object, and animate(O) alone
	 * leaves the vars as they are. It returns null.
	 */
	animate(f: Frame, type: ArgsType, vals: Value[]): void {
		const positional: Value[] = [];
		const named: [string, Value][] = [];
		if (type === ArgsType.FromStack) positional.push(...vals);
		else if (type === ArgsType.FromStackKeyed) {
			for (let i = 0; i < vals.length; i += 2) {
				if (vals[i] === null) positional.push(vals[i + 1]);
				else named.push([stringify(vals[i]), vals[i + 1]]);
			}
		} else if (type === ArgsType.FromArgumentList) {
			const l = live(vals[vals.length - 1]);
			if (l instanceof DMList) {
				for (const x of l.items) {
					const a = l.assocOf(x);
					if (typeof x === "string" && a !== undefined) named.push([x, a]);
					else positional.push(live(x));
				}
			}
		} else if (type === ArgsType.FromProcArguments) positional.push(...f.args);
		let target = positional.length > 0 ? positional[0] : null;
		if (target !== null) this.lastAnimated = target;
		else target = this.lastAnimated;
		if (!(target instanceof DMObject) || target.deleted) return;
		const log = this.animLog;
		const vars: NonNullable<AnimEvent["vars"]> | null = log ? [] : null;
		let time = 0, loop = 1, easing = 0, flags = 0;
		for (const [k, v] of named) {
			if (k === "time") { time = num(v); continue; }
			if (k === "loop") { loop = num(v); continue; }
			if (k === "easing") { easing = num(v); continue; }
			if (k === "flags") { flags = num(v); continue; }
			if (k === "delay") continue;
			if (target.hasVar(k)) {
				if (vars) vars.push([k, animSnap(live(target.getVar(k))), animSnap(live(v))]);
				this.setField(target, k, v);
			}
		}
		// pt-orbit: unnamed arguments after the object fill the time, loop, easing, flags slots that no name set, in that order
		// (animate(src, transform = m, time = 5, -1) in SpinAnimation means loop -1; it was ignored, so a ghost's orbit circled once).
		if (positional.length > 1) {
			const slots: ("time" | "loop" | "easing" | "flags")[] = ["time", "loop", "easing", "flags"];
			const named_ = new Set(named.map(([k]) => k));
			let si = 0;
			for (let pi = 1; pi < positional.length; pi++) {
				while (si < slots.length && named_.has(slots[si])) si++;
				if (si >= slots.length) break;
				const v = num(positional[pi]);
				if (slots[si] === "time") time = v; else if (slots[si] === "loop") loop = v; else if (slots[si] === "easing") easing = v; else flags = v;
				si++;
			}
		}
		// a step for the client. `fresh` = the call named the object (a new animation); else it chains onto the last one.
		if (log && log.length < ANIM_LOG_MAX) log.push({ o: target, fresh: positional.length > 0, vars: vars!, time, loop, easing, flags });
	}

	/**
	 * The arguments `proc` gets from a call written as `type` (ArgsType), given the values the call evaluated (`vals`: the
	 * positional values, the [name or null, value] pairs, or [the arglist() list]) and the caller's own `callerArgs`.
	 */
	popArgs(vals: Value[], callerArgs: Value[], proc: DMProc | null, type: ArgsType): Value[] {
		const argNames = proc ? proc.argNames : [];
		switch (type) {
			case ArgsType.None:
				return [];
			case ArgsType.FromStack:
				return vals.slice();
			case ArgsType.FromProcArguments:
				return callerArgs.slice();
			case ArgsType.FromStackKeyed: {
				const count = vals.length / 2;
				const out: Value[] = new Array(Math.max(count, argNames.length)).fill(null);
				for (let i = 0; i < count; i++) {
					const key = vals[i * 2];
					const value = vals[i * 2 + 1];
					if (key === null) {
						out[i] = value;
					} else {
						const idx = argNames.indexOf(key as string);
						if (idx < 0) throw new DMRuntimeError(`bad arg name '${stringify(key)}'`);
						out[idx] = value;
					}
				}
				return out;
			}
			case ArgsType.FromArgumentList: {
				// arglist(L): plain items are positional; a text item with an associated value is named.
				const l = live(vals[vals.length - 1]);
				if (!(l instanceof DMList)) return l === null ? [] : [l];
				const out: Value[] = [];
				let pos = 0;
				for (const x of l.items) {
					const a = l.assocOf(x);
					if (typeof x === "string" && a !== undefined) {
						const idx = argNames.indexOf(x);
						if (idx < 0) throw new DMRuntimeError(`bad arg name '${x}'`);
						while (out.length <= idx) out.push(null);
						out[idx] = a;
					} else {
						while (out.length <= pos) out.push(null);
						out[pos++] = live(x);
					}
				}
				return out;
			}
		}
		throw new Error(`bad argument type ${type}`);
	}
}

/** One client-side animation event, for the live view. */
export interface AnimEvent {
	o: DMObject;
	/** flick: the icon_state to show once. */
	flick?: string;
	/** animate step: the call named its object (starts a new animation) rather than chaining; the vars it set as [name, before, after]; time in ds, loop, easing, flags as given. */
	fresh?: boolean;
	vars?: [string, Value | number[], Value | number[]][];
	time?: number; loop?: number; easing?: number; flags?: number;
}
export const ANIM_LOG_MAX = 500;

/** A var value as plain data for the client: matrices and color lists become number arrays (a snapshot, not a reference). */
export function animSnap(v: Value): Value | number[] {
	if (v instanceof DMObject) return v.hasVar("a") ? ["a", "b", "c", "d", "e", "f"].map((k, i) => { const x = live(v.getVar(k)); return typeof x === "number" ? x : i === 0 || i === 4 ? 1 : 0; }) : null;
	if (v instanceof DMList) return v.items.map((x) => (typeof x === "number" ? x : 0));
	return v;
}

// ---- primitive operators ----------------------------------------------------------------------

/** for(x in start to end step s) (Op.CreateRangeEnumerator; also called by translated code). */
export function rangeEnumerator(start: Value, end: Value, step: Value): RangeEnumerator {
	if (typeof step !== "number") throw new DMRuntimeError(`Invalid step ${describe(step)}, must be a number`);
	if (typeof end !== "number") throw new DMRuntimeError(`Invalid end ${describe(end)}, must be a number`);
	if (typeof start !== "number") throw new DMRuntimeError(`Invalid start ${describe(start)}, must be a number`);
	return new RangeEnumerator(start, end, step);
}

export function num(v: Value): number {
	return typeof v === "number" ? v : 0;
}

/**
 * Built-in operators on objects (matrices): set by natives-misc. Returns undefined when it doesn't
 * apply, and the operator then raises its usual error. Checked only after the number/list paths.
 */
export const objectOperators: { hook: ((op: "+" | "-" | "*" | "/", a: Value, b: Value) => Value | undefined) | null } = { hook: null };
function objectOp(op: "+" | "-" | "*" | "/", a: Value, b: Value): Value | undefined {
	return objectOperators.hook ? objectOperators.hook(op, a, b) : undefined;
}

// BYOND 511 wording, measured: + and - say "type mismatch", * and / say "Undefined operation".
function typeMismatch(a: Value, op: string, b: Value): DMRuntimeError {
	return new DMRuntimeError(`type mismatch: ${describe(a)} ${op} ${describe(b)}`);
}
function undefinedOp(a: Value, op: string, b: Value): DMRuntimeError {
	return new DMRuntimeError(`Undefined operation: ${describe(a)} ${op} ${describe(b)}`);
}

export function add(a: Value, b: Value): Value {
	if (typeof a === "number" && typeof b === "number") return fround(a + b);
	if (a instanceof DMList) return listAdd(a, b);
	if (typeof a === "string" && typeof b === "string") return a + b;
	if (a === null) return b;
	if (b === null) return a;
	const o = objectOp("+", a, b);
	if (o !== undefined) return o;
	throw typeMismatch(a, "+", b);
}

export function subtract(a: Value, b: Value): Value {
	if (typeof a === "number" && typeof b === "number") return fround(a - b);
	if (a instanceof DMList) return listSubtract(a, b);
	if (a === null && (typeof b === "number" || b === null)) return fround(-num(b));
	if (b === null && typeof a === "number") return a;
	const o = objectOp("-", a, b);
	if (o !== undefined) return o;
	throw typeMismatch(a, "-", b);
}

export function multiply(a: Value, b: Value): Value {
	if ((typeof a === "number" || a === null) && (typeof b === "number" || b === null)) {
		const x = num(a);
		const y = num(b);
		// Measured: BYOND 511 gives 0 (not NaN) for inf * 0.
		if (x === 0 || y === 0) return 0;
		return fround(x * y);
	}
	// Measured: an object operand says "type mismatch", while text and lists say "Undefined operation".
	if (a instanceof DMObject || b instanceof DMObject) {
		const o = objectOp("*", a, b);
		if (o !== undefined) return o;
		throw typeMismatch(a, "*", b);
	}
	throw undefinedOp(a, "*", b);
}

export function divide(a: Value, b: Value): Value {
	if (a === null) return 0;
	if (typeof a === "number" && (typeof b === "number" || b === null)) {
		const y = num(b);
		if (y === 0) throw new DMRuntimeError("Division by zero");
		return fround(a / y);
	}
	const o = objectOp("/", a, b);
	if (o !== undefined) return o;
	throw undefinedOp(a, "/", b);
}

/** `%` works on integers (C semantics: truncate both, result takes the dividend's sign). */
export function modulus(a: Value, b: Value): Value {
	if ((typeof a === "number" || a === null) && (typeof b === "number" || b === null)) {
		const y = toInt(b);
		if (y === 0) throw new DMRuntimeError("Division by zero");
		return toInt(a) % y;
	}
	throw typeMismatch(a, "%", b);
}

export function power(a: Value, b: Value): Value {
	if ((typeof a === "number" || a === null) && (typeof b === "number" || b === null)) return fround(Math.pow(num(a), num(b)));
	throw typeMismatch(a, "**", b);
}

// BYOND 511 bitwise operators work on the low 16 bits (measured: ~0 == 65535, 65536|0 == 0).
// On a list: intersection, union and symmetric difference (see objects.ts).
export function bitAnd(a: Value, b: Value): Value {
	if (a instanceof DMList) return listAnd(a, b);
	return toInt(a) & toInt(b) & 0xffff;
}
export function bitOr(a: Value, b: Value): Value {
	if (a instanceof DMList) return listOr(a, b);
	return (toInt(a) | toInt(b)) & 0xffff;
}
export function bitXor(a: Value, b: Value): Value {
	if (a instanceof DMList) return listXor(a, b);
	return (toInt(a) ^ toInt(b)) & 0xffff;
}
// Shifts: the left operand is cut to 16 bits, then shifted as a 32-bit signed int with the count
// taken mod 32 (x86); a count <= 0 leaves the 16-bit value unshifted. (All measured in 511.)
export function shiftLeft(a: Value, b: Value): Value {
	const x = toInt(a) & 0xffff;
	const c = toInt(b);
	return c <= 0 ? x : x << (c & 31);
}
export function shiftRight(a: Value, b: Value): Value {
	const x = toInt(a) & 0xffff;
	const c = toInt(b);
	return c <= 0 ? x : x >> (c & 31);
}

/** `<`. null acts as 0 against numbers and as "" against text. */
export function lessThan(a: Value, b: Value): boolean {
	if (typeof a === "number") {
		if (typeof b === "number") return a < b;
		if (b === null) return a < 0;
	} else if (typeof a === "string") {
		if (typeof b === "string") return a < b;
		if (b === null) return false;
	} else if (a === null) {
		if (typeof b === "number") return 0 < b;
		if (typeof b === "string") return b !== "";
		if (b === null) return false;
	}
	throw new DMRuntimeError(`type mismatch: cannot compare ${describe(a)} to ${describe(b)}`);
}

/**
 * The `<`, `>`, `<=`, `>=` operators (sd1). Measured in BYOND 511 (tests/dm/compare_null.dm):
 * a null left operand is "" against text and 0 otherwise; a null right operand is always 0, so
 * `"a" < null` is a type mismatch ("cannot compare "a" to 0") while `null < "a"` is true.
 * `null <= 0` is true (tg's shuttle timeLeft relies on it). Numbers take the fast path.
 * (lessThan above stays as min()/max()'s ordering.)
 */
function cmpSlow(a: Value, b: Value, op: number): boolean {
	if (a === null) a = typeof b === "string" ? "" : 0;
	if (b === null) b = 0;
	if ((typeof a === "number" && typeof b === "number") || (typeof a === "string" && typeof b === "string")) {
		switch (op) {
			case 0: return a < b;
			case 1: return a > b;
			case 2: return a <= b;
			default: return a >= b;
		}
	}
	throw new DMRuntimeError(`type mismatch: cannot compare ${describe(a)} to ${describe(b)}`);
}
export function cmpLt(a: Value, b: Value): boolean {
	return typeof a === "number" && typeof b === "number" ? a < b : cmpSlow(a, b, 0);
}
export function cmpGt(a: Value, b: Value): boolean {
	return typeof a === "number" && typeof b === "number" ? a > b : cmpSlow(a, b, 1);
}
export function cmpLe(a: Value, b: Value): boolean {
	return typeof a === "number" && typeof b === "number" ? a <= b : cmpSlow(a, b, 2);
}
export function cmpGe(a: Value, b: Value): boolean {
	return typeof a === "number" && typeof b === "number" ? a >= b : cmpSlow(a, b, 3);
}

// ---- string formatting ------------------------------------------------------------------------

// Format markers are 0xFF00 | suffix, see DMCompiler/Bytecode/StringFormatEncoder.cs.
const FMT_WITH_ARTICLE = 0, FMT_NO_ARTICLE = 1, FMT_NO_STRINGIFY = 2, FMT_REF = 3;
const FMT_ROMAN_LOWER = 18, FMT_ROMAN_UPPER = 19;
/** Roman numerals (unverified above 99 and for 0/negatives: 0 prints "", a minus sign is kept). */
function toRoman(n: number, upper: boolean): string {
	let v = Math.trunc(Math.abs(n));
	let s = n < 0 ? "-" : "";
	for (const [k, r] of [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]] as const) {
		while (v >= k) {
			s += r;
			v -= k;
		}
	}
	return upper ? s : s.toLowerCase();
}
const FMT_PROPER = 16, FMT_IMPROPER = 17, FMT_ORDINAL = 20, FMT_PLURAL = 21;
const FMT_THE_UPPER = 4, FMT_THE_LOWER = 5, FMT_A_UPPER = 6, FMT_A_LOWER = 7;

/**
 * The noun an embedded value names, for articles: an atom's name, or text. A name is proper if it
 * starts with a capital letter, unless it carries the \proper / \improper marker (vm/markers.ts;
 * the compiler's one-character markers are converted when the object tree loads).
 */
function nounOf(v: Value): { text: string; proper: boolean; plural: boolean } | null {
	let raw: string;
	let plural = false;
	if (v instanceof DMAtom && !v.deleted) {
		const n = v.getVar("name");
		raw = typeof n === "string" ? n : "";
		plural = v.getVar("gender") === "plural";
	} else if (typeof v === "string") {
		raw = v;
	} else {
		return null;
	}
	// Measured (web/tests/dm/look.dm): the marker stays in the output ("the \improper Yak").
	const proper = raw.includes(PROPER) ? true : raw.includes(IMPROPER) ? false : /^[A-Z]/.test(raw);
	return { text: raw, proper, plural };
}
const FMT_NAMES = [
	"[]", "[] (no article)", "no-stringify", "\\ref", "\\The", "\\the", "\\A", "\\a", "\\He", "\\he", "\\His", "\\his",
	"\\him", "\\himself", "\\His (pronoun)", "\\his (pronoun)", "\\proper", "\\improper", "\\i", "\\I", "\\th", "\\s",
	"\\icon", "\\red", "\\blue", "\\green", "\\black", "\\yellow", "\\navy", "\\teal", "\\cyan", "\\b", "\\italic",
];

export function formatString(template: string, vals: Value[]): string {
	let out = "";
	let next = 0;
	let prev = -1;
	let roman = 0;
	for (let i = 0; i < template.length; i++) {
		const c = template.charCodeAt(i);
		if ((c & 0xff00) !== 0xff00) {
			out += template[i];
			continue;
		}
		const kind = c & 0xff;
		switch (kind) {
			case FMT_WITH_ARTICLE: {
				// Measured: an atom with an improper name gets "the" ("The" at the very start of the text).
				const v = vals[next];
				const noun = nounOf(v);
				if (noun && v instanceof DMAtom) out += (noun.proper ? "" : out.length === 0 ? "The " : "the ") + noun.text;
				else out += stringify(v);
				prev = next++;
				break;
			}
			case FMT_NO_ARTICLE: {
				// Used right after a text macro like \the; objects print their name, text prints as-is.
				const v = vals[next];
				if (roman !== 0) {
					out += typeof v === "number" ? toRoman(v, roman === FMT_ROMAN_UPPER) : stringify(v);
					roman = 0;
					prev = next++;
					break;
				}
				const noun = nounOf(v);
				if (noun) out += noun.text;
				else if (v !== null && typeof v !== "number") throw new NotImplementedError(`[] after a text macro on ${describe(v)}`);
				else out += stringify(v);
				prev = next++;
				break;
			}
			case FMT_THE_UPPER:
			case FMT_THE_LOWER:
			case FMT_A_UPPER:
			case FMT_A_LOWER: {
				// \the, \The, \a, \an, \A: measured on atoms ("the apple", "an apple"). Proper nouns
				// (capitalised, or marked \proper) take no article; gender "plural" takes "some" (unverified).
				const noun = nounOf(vals[next]);
				if (!noun || noun.proper) break;
				let art: string;
				if (kind === FMT_THE_UPPER || kind === FMT_THE_LOWER) art = "the ";
				else if (noun.plural) art = "some ";
				else art = /^[aeiou]/i.test(noun.text) ? "an " : "a ";
				if (kind === FMT_THE_UPPER || kind === FMT_A_UPPER) art = art[0].toUpperCase() + art.slice(1);
				out += art;
				break;
			}
			case FMT_NO_STRINGIFY:
				prev = next++;
				break;
			case FMT_PROPER:
			case FMT_IMPROPER:
				break;
			case FMT_PLURAL: {
				const v = vals[prev];
				if (!(typeof v === "number" && v === 1)) out += "s";
				break;
			}
			case FMT_ORDINAL: {
				const v = vals[prev];
				if (typeof v === "number") {
					// Measured: the number is reprinted as an integer (2.5\th -> 2nd); 11-13 take "th".
					const n = Math.trunc(v);
					out = out.slice(0, out.length - formatNumber(v).length) + n;
					const m100 = Math.abs(n) % 100, m10 = Math.abs(n) % 10;
					out += m100 >= 11 && m100 <= 13 ? "th" : m10 === 1 ? "st" : m10 === 2 ? "nd" : m10 === 3 ? "rd" : "th";
				} else {
					throw new NotImplementedError(`\\th after ${describe(v)}`);
				}
				break;
			}
			case FMT_ROMAN_LOWER:
			case FMT_ROMAN_UPPER:
				// \roman[x] / \Roman[x]: the next [] prints x as a Roman numeral.
				roman = kind;
				break;
			case FMT_REF:
				out += refOf(vals[next]);
				prev = next++;
				break;
			default:
				throw new NotImplementedError(`text macro ${FMT_NAMES[kind] ?? kind}`);
		}
	}
	return out;
}


/** `list(k = v, ...)` from [k, v, k, v...] (Op.CreateAssociativeList; also the translated runtime's rt.alist). */
export function assocList(kv: Value[]): DMList {
	// Measured: a repeated key keeps its first position and takes the last value.
	const l = new DMList();
	for (let i = 0; i < kv.length; i += 2) {
		const k = kv[i];
		if (k === null) l.push(kv[i + 1]);
		else if (typeof k === "number") {
			// list(1 = x) (tg's GLOB.huds). Measured: sets that index, or appends when it is
			// one past the end; anything further is "list index out of bounds".
			const idx = Math.trunc(k);
			if (idx < 1 || idx > l.len + 1) throw new DMRuntimeError("list index out of bounds");
			if (idx === l.len + 1) l.push(kv[i + 1]);
			else l.setItem(idx - 1, kv[i + 1]);
		} else l.set(k, kv[i + 1]);
	}
	return l;
}
