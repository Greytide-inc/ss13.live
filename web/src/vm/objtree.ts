// The program as typed structures: string table, type tree, procs, globals. built from the game files
// (typedefs.gameProgram, or a test fixture's rt.type/rt.def statements the same way).
// Every file path in the JSON is relative to the repo root.

import type { ObjectHooks } from "./savefile.js";
import type { CompiledJson, JsonValue, ProcArg, ProcDecl, ProcMeta, TypeJson } from "./json.js";
import { parseProcPath } from "./proc-path.js";
import { JsonVarType, ProcAttr } from "./json.js";
import { NATIVE_PROCS } from "./native-procs.js";
import type { Value } from "./value.js";
import type { Frame, GenRequest } from "./interpreter.js";
import { byondMarkers } from "./markers.js";
import { procStart } from "../translate/error-lines.js";

/** A 'file' literal such as 'icons/obj/foo.dmi'. Path is relative to the repo root.
 *  `compiled` marks a compile-time 'resource' literal (in BYOND, an .rsc cache entry), as opposed
 *  to a runtime file("path") value; file() accepts only the former (both measured). */
/** Base64 to bytes: Node's Buffer when there is one (fast), atob in the browser worker. */
export function fromBase64(s: string): Uint8Array {
	if (typeof Buffer !== "undefined") return Buffer.from(s, "base64");
	const bin = atob(s), out = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
	return out;
}

/** DMType.readCache's marker for a var name getField must take the full path for. */
export const NOT_PLAIN: unique symbol = Symbol("not plain");

export class Resource {
	constructor(readonly path: string, readonly compiled = false) {}
}

/** A list literal from a var initialiser, kept raw until lists exist in the VM. */
export class ListLiteral {
	constructor(readonly json: JsonValue, readonly assoc: boolean) {}
}

export class DMType {
	parent: DMType | null = null;
	initProc: DMProc | null = null;
	// procs, globalVars, constVars and tmpVars are the parent's own Map/Set when the type adds nothing to
	// them (most types: 8.9k of 13.8k for procs, nearly all for the rest), so never change them after
	// loading. Copying them into every type cost ~185 MB of heap (memory work). `vars` is always the
	// type's own (the VM fixes some defaults per type at startup).
	/** Most-derived proc for each name, including inherited ones. */
	procs = new Map<string, DMProc>();
	private _vars: Map<string, Value> | null = null;
	/** Initial var values, inherited ones merged in (own values override parent's). Built on first use (a
	 * type nobody reads never pays for its map), then the tree's fixups run on it (ObjectTree.addVarFixup). */
	get vars(): Map<string, Value> {
		return this._vars ?? this.buildVars();
	}
	private buildVars(): Map<string, Value> {
		const tree = this.tree, m = new Map<string, Value>();
		if (tree === null) return (this._vars = m);
		// The parent's map before fixups (keys a fixup added to it are left out, so the order is what a startup copy gave).
		if (this.parent) {
			const p = this.parent, pv = p.vars, add = p.fixAdded;
			for (const [k, v] of pv) if (add === null || !add.includes(k)) m.set(k, v);
		}
		for (const [k, v] of Object.entries(this.json.Variables ?? {})) m.set(k, tree.convertValue(v));
		this._vars = m;
		for (const fix of tree.varFixups) this.applyFix(fix);
		return m;
	}
	/** Keys a fixup added to `vars` (they were not declared by this type or inherited). */
	fixAdded: string[] | null = null;
	applyFix(fix: (t: DMType) => void): void {
		const m = this.vars, n = m.size;
		fix(this);
		if (m.size > n) {
			let i = 0;
			for (const k of m.keys()) if (i++ >= n) (this.fixAdded ??= []).push(k);
		}
	}
	/** True once `vars` has been built. */
	get varsBuilt(): boolean {
		return this._vars !== null;
	}
	/** Names declared `var/global/x` or `var/static/x` on this type: name -> index into the global table. */
	globalVars = new Map<string, number>();
	constVars = new Set<string>();
	tmpVars = new Set<string>();
	/** Engine-side behaviour for built-in types with hidden state (/savefile). */
	special: ObjectHooks | null = null;
	/** "[x]" with a null name prints "" instead of the type path (/image and its snapshots, measured). */
	textEmpty = false;
	/** initial opacity and luminosity as numbers, cached by view() (vm/world.ts losBox). */
	losInit: [number, number] | null = null;
	/** "[x]" is always "" (appearance snapshots, measured even with a name). */
	textNone = false;
	/** "[x]" with no `name` var prints this var instead (clients print their key). */
	textVar: string | null = null;
	/** Atom-style look vars (color, pixel_x, ...) are normalised on write: /image and its subtypes. */
	lookVars = false;
	/** Look-var defaults stored normalised in instances (filled lazily by the VM; vm/look.ts). */
	lookFix: [string, Value][] | null = null;
	/** VM.getField's per-name cache (filled lazily): the default of a var an instance reads with no special
	 * handling, or NOT_PLAIN. Not saved in snapshots (types are named by id). */
	readCache: Map<string, Value | typeof NOT_PLAIN> | null = null;
	/** VM.setField's per-name cache: true for a var an instance writes with no special handling. */
	writeCache: Map<string, boolean> | null = null;

	/** `tree` null: a free-standing type whose `vars` starts empty (the VM fills it). */
	constructor(readonly id: number, readonly path: string, readonly json: TypeJson, readonly tree: ObjectTree | null = null) {}

	private _listVars: string[] | null = null;

	/** Vars whose initial value is a list literal (each new object gets its own copy). */
	get listLiteralVars(): string[] {
		if (this._listVars === null) {
			this._listVars = [];
			for (const [k, v] of this.vars) if (v instanceof ListLiteral) this._listVars.push(k);
		}
		return this._listVars;
	}

	isSubtypeOf(other: DMType): boolean {
		for (let t: DMType | null = this; t; t = t.parent) if (t === other) return true;
		return false;
	}

	toString(): string {
		return this.path;
	}
}

type VerbInfo = NonNullable<ProcMeta["verb"]>;

export class DMProc {
	owner!: DMType;
	/** The definition this one overrides (what `..()` calls), or null. */
	superProc: DMProc | null = null;
	readonly name: string;
	/** Declared with `verb` (or a `/type/name` override of one), not `proc`. */
	readonly isVerb: boolean;
	readonly argNames: string[];
	/** ProcAttr bits: DisableWaitfor, Hidden, HidePopupMenu, and IsOverride on a verb. */
	readonly attributes: number;
	/** `set name/category/desc/src/invisibility`, or null. */
	readonly verb: VerbInfo | null;
	/** Each argument's name and DM type (Type/TypePath/Source), for parsing it as a verb's command line. */
	readonly argSpecs: ProcArg[];
	/** False for a proc with no body: a BYOND built-in (see isNative) or an empty proc. */
	readonly hasBody: boolean;
	/** A BYOND built-in (declared bodiless in OpenDream's DMStandard): implemented in TS by the VM. */
	isNative = false;
	/** set when a translated TS version of this proc is loaded (src/translate/runtime.ts): makes its frame's generator. */
	translated: ((f: Frame) => Generator<GenRequest, Value, Value>) | null = null;

	/** a proc comes from its rt.def statement (`decl`, typedefs.gameProgram): it runs as its translation (or a native). */
	constructor(readonly id: number, decl: ProcDecl) {
		const { name, verb } = parseProcPath(decl.path), m = decl.meta;
		this.name = name;
		this.isVerb = verb;
		this.argNames = decl.args;
		this.attributes = (verb && !/\/verb\/[^/]*$/.test(decl.path) ? ProcAttr.IsOverride : 0) | (m?.waitfor === false ? ProcAttr.DisableWaitfor : 0)
			| (m?.hidden ? ProcAttr.Hidden : 0) | (m?.hidePopup ? ProcAttr.HidePopupMenu : 0);
		this.verb = m?.verb ?? null;
		const t = m?.argTypes;
		this.argSpecs = decl.args.map((Name, i) => {
			const a: ProcArg = { Name };
			if (t?.[i]?.type !== undefined) a.Type = t[i].type;
			if (t?.[i]?.path !== undefined) a.TypePath = t[i].path;
			if (t?.[i]?.source !== undefined) a.Source = t[i].source;
			return a;
		});
		this.hasBody = decl.body;
	}

	/** Proc path as BYOND prints it: /proc/foo for globals, /datum/foo/proc/bar otherwise. */
	get path(): string {
		const owner = this.owner && this.owner.path !== "/" ? this.owner.path : "";
		// Measured: a verb prints as /verb/name, an override of it without the `verb` keyword as plain /name.
		return `${owner}/${this.isVerb ? (this.attributes & ProcAttr.IsOverride ? "" : "verb/") : "proc/"}${this.name}`;
	}

	/** "file:line" where the proc starts in the DM source (error-lines.procStart, from build/translated-tg.lines.json). */
	sourceStart(): string {
		return procStart(this.id);
	}

	toString(): string {
		return this.path;
	}
}

export class ObjectTree {
	readonly strings: string[];
	readonly types: DMType[];
	readonly procs: DMProc[];
	readonly typesByPath = new Map<string, DMType>();
	readonly globalProcs = new Map<string, DMProc>();
	readonly globalNames: string[];
	readonly globalInitial: Value[];
	readonly globalInitProc: DMProc | null;
	/** the global init is TypeScript (game/_globals.ts): points globalInitProc at it for a VM (VM.runGlobalInit). */
	readonly globalInitSetup: ((vm: unknown, proc: DMProc) => void) | null;
	readonly root: DMType;
	/** Edits applied to every type's `vars` map when it is built (and now, to the maps already built). */
	readonly varFixups: ((t: DMType) => void)[] = [];

	addVarFixup(fix: (t: DMType) => void): void {
		this.varFixups.push(fix);
		for (const t of this.types) if (t.varsBuilt) t.applyFix(fix);
	}

	constructor(readonly json: CompiledJson) {
		this.strings = json.Strings.map(byondMarkers);
		this.types = json.Types.map((t, i) => new DMType(i, t.Path, t, this));
		for (const t of this.types) this.typesByPath.set(t.path, t);
		this.root = this.types[0];
		// the program's procs are its rt.defs (ProcDecls, id = position).
		this.procs = json.ProcDecls.map((d, i) => {
			const p = new DMProc(i, d), owner = parseProcPath(d.path).owner;
			const t = this.typesByPath.get(owner);
			if (!t) throw new Error(`rt.def("${d.path}"): no type ${owner}`);
			p.owner = t;
			return p;
		});

		// Link types parent-first so inherited procs are ready when a child copies them.
		const done = new Uint8Array(this.types.length);
		const link = (t: DMType): void => {
			if (done[t.id]) return;
			done[t.id] = 1;
			const j = t.json;
			if (j.Parent !== undefined && j.Parent !== null && t.id !== 0) {
				t.parent = this.types[j.Parent];
				link(t.parent);
				const p = t.parent;
				// Shared with the parent unless the type adds to them (see the field comment).
				t.procs = j.Procs?.some((chain) => chain.length) ? new Map(p.procs) : p.procs;
				t.globalVars = j.GlobalVariables && Object.keys(j.GlobalVariables).length ? new Map(p.globalVars) : p.globalVars;
				t.constVars = j.ConstVariables?.length ? new Set(p.constVars) : p.constVars;
				t.tmpVars = j.TmpVariables?.length ? new Set(p.tmpVars) : p.tmpVars;
			}
			// Var initialisers that aren't constants live in the type's (init) proc, which starts
			// with `..()`, so it must chain to the nearest ancestor's (init) proc. A type without
			// its own inherits the parent's.
			if (j.InitProc !== undefined) {
				const init = this.procs[j.InitProc];
				init.superProc = t.parent?.initProc ?? null;
				t.initProc = init;
			} else {
				t.initProc = t.parent?.initProc ?? null;
			}
			for (const chain of j.Procs ?? []) {
				for (const pid of chain) {
					const p = this.procs[pid];
					p.superProc = t.procs.get(p.name) ?? null;
					t.procs.set(p.name, p);
				}
			}
			for (const [k, v] of Object.entries(j.GlobalVariables ?? {})) t.globalVars.set(k, v);
			for (const k of j.ConstVariables ?? []) t.constVars.add(k);
			for (const k of j.TmpVariables ?? []) t.tmpVars.add(k);
		};
		for (const t of this.types) link(t);

		for (const pid of json.GlobalProcs ?? []) {
			const p = this.procs[pid];
			this.globalProcs.set(p.name, p);
		}

		// Native procs: a proc DMStandard declares with no body, and the original declaration (not
		// an override). A user proc with an empty body also has empty bytecode, so the name list
		// (native-procs.ts, generated from DMStandard) is what tells them apart.
		const natives = new Set(NATIVE_PROCS);
		for (const p of this.procs) {
			// The first definition on its own type: DMStandard's bodiless /image/New overrides
			// /datum/New but is still the built-in; a later empty redefinition on the same type isn't.
			if (!p.hasBody && (p.superProc === null || p.superProc.owner !== p.owner) && natives.has(p.path)) p.isNative = true;
		}

		const g = json.Globals;
		this.globalNames = g?.Names ?? [];
		this.globalInitial = new Array(g?.GlobalCount ?? 0).fill(null);
		for (const [idx, v] of Object.entries(g?.Globals ?? {})) this.globalInitial[Number(idx)] = this.convertValue(v);

		this.globalInitSetup = json.GlobalInitSetup ?? null;
		this.globalInitProc = this.globalInitSetup ? new DMProc(-1, { path: "/proc/<init>", args: [], body: false, meta: null }) : null;
		if (this.globalInitProc) this.globalInitProc.owner = this.root;
	}

	getType(path: string): DMType | undefined {
		return this.typesByPath.get(path);
	}

	/** Converts a var initial value from the JSON into a VM value. Numbers are 32-bit floats. */
	convertValue(v: JsonValue): Value {
		if (v === null) return v;
		if (typeof v === "string") return byondMarkers(v);
		if (typeof v === "number") return Math.fround(v);
		switch (v.type) {
			case JsonVarType.Resource:
				return new Resource(v.resourcePath, true);
			case JsonVarType.Type:
				return this.types[v.value];
			case JsonVarType.Proc:
				return this.procs[v.value];
			case JsonVarType.List:
				return new ListLiteral(v, false);
			case JsonVarType.AList:
				return new ListLiteral(v, true);
			case JsonVarType.PositiveInfinity:
				return Infinity;
			case JsonVarType.NegativeInfinity:
				return -Infinity;
		}
		throw new Error(`unknown JSON value ${JSON.stringify(v)}`);
	}
}
