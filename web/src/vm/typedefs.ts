// the type tree, globals, global init and string table as game source (web/game/). tgstation.json is gone.
// The game files call these (through src/translate/runtime.ts, as `rt.type(...)` etc.) when the game bundle
// (build/translated-tg.js) is imported; `gameProgram()` then gives the program the ObjectTree is built from.
// the compile-time maps are the .dmm files game/_maps.ts lists (`rt.maps([...])`, read by src/vm/dmm.ts), not
// the JSON's Maps; the JSON's Resources list is dropped (nothing read it).
// each type's proc lists (override chains, <init>, verbs) and the global procs come from the game files' rt.def
// statements (`procDecls` below), not the JSON. so do the procs themselves (ids = rt.def order); tgstation.json is gone.
//
// A type entry:  rt.type(4567, "/obj/item/weapon/pickaxe", "/obj/item/weapon", { name: "pickaxe", icon: rt.rsc("icons/obj/mining.dmi") });
//   id: the type's number (snapshots name types by number). Leave it out for a new type: it gets the next free one.
//   values: strings, numbers, null, Infinity, rt.rsc("file"), rt.typePath("/type/path"), rt.procRef("/type/proc/name").
//   Anything else (lists, new objects, expressions on other vars) goes in the type's <init> proc.
//   extra (optional): { global: { name: globalIndex }, const: [names], tmp: [names] } for var/global, var/const, var/tmp.

import type { CompiledJson, GlobalInitSetup, JsonValue, ProcDecl, ProcMeta, TypeJson } from "./json.js";
import { JsonVarType } from "./json.js";
import { Resource } from "./objtree.js";

class TypePathRef {
	constructor(readonly path: string) {}
}
class ProcPathRef {
	constructor(readonly path: string) {}
}

export type TypeValue = null | number | string | Resource | TypePathRef | ProcPathRef;
export interface TypeExtra {
	global?: Record<string, number>;
	const?: string[];
	tmp?: string[];
}
interface TypeDef {
	id: number | null;
	path: string;
	parent: string | null;
	vars: Record<string, TypeValue>;
	extra?: TypeExtra;
}

const defs: TypeDef[] = [];
let globalTable: [string, TypeValue][] | null = null;
let globalInitSetup: GlobalInitSetup | null = null;
let mapFiles: string[] | null = null;
/** every rt.def(path, ...) of the game files, in bundle order (files sorted, then top to bottom). */
const declPaths: string[] = [];
const decls: ProcDecl[] = [];

/** Declares a type: `type(id, path, parent, vars, extra?)`, or `type(path, parent, vars, extra?)` for a new type. */
export function type(...a: unknown[]): void {
	if (typeof a[0] !== "number") a.unshift(null);
	const [id, path, parent, vars, extra] = a as [number | null, string, string | null, Record<string, TypeValue>, TypeExtra | undefined];
	defs.push({ id, path, parent, vars, extra });
}
/** A type as a var's value (`var/x = /obj/item`). */
export function typePath(path: string): TypePathRef {
	return new TypePathRef(path);
}
/** A proc as a var's value, by its rt.def path (the last rt.def of that path, like P("/path")). */
export function procRef(path: string): ProcPathRef {
	return new ProcPathRef(path);
}
/** The global variables in index order, with their starting values (game/_globals.ts). */
export function globals(g: [string, TypeValue][]): void {
	globalTable = g;
}
/** the global init (`var/global x = expr`, game/_globals.ts) as TS; runtime.globalInit wraps the function. */
export function setGlobalInit(setup: GlobalInitSetup): void {
	globalInitSetup = setup;
}

/** The .dmm files loaded before world/New(), in z order (game/_maps.ts; tgstation.dme's #include of _maps/basemap.dm). */
export function maps(files: string[]): void {
	mapFiles = files;
}

/**
 * The procs one game file defines, in order: tools/translate-tg.mjs collects each file's rt.def statements into
 * build/game-types.js, so the type tree knows its procs without loading the proc bundle (the page's worker builds the
 * tree while that downloads). The order is meaningful: a second rt.def of the same type and name overrides the first
 * (its `..()` calls the first), and a type's verbs are listed in this order.
 * an entry is the path alone (a proc with a body and no arguments or meta), or [path, argNames, body (1/0), meta?]
 * (the bundler takes the names from meta.args or the function's parameters, and copies the meta literal).
 */
export function procDecls(entries: (string | [string, string[], 0 | 1, ProcMeta?])[]): void {
	for (const e of entries) {
		if (typeof e === "string") {
			declPaths.push(e);
			decls.push({ path: e, args: [], body: true, meta: null });
		} else {
			declPaths.push(e[0]);
			decls.push({ path: e[0], args: e[1], body: e[2] === 1, meta: e[3] ?? null });
		}
	}
}
/** The rt.def paths in bundle order (runtime.install matches the proc bundle's rt.def calls to these one by one). */
export function declaredPaths(): readonly string[] {
	return declPaths;
}

import { parseProcPath } from "./proc-path.js";
export { parseProcPath };

/** True once the game bundle has declared its types. */
export function haveGameTypes(): boolean {
	return defs.length > 0 && globalTable !== null && mapFiles !== null && declPaths.length > 0;
}

/**
 * the program the ObjectTree is built from, all from the game files (build/game-types.js): types, procs, globals,
 * global init, strings and the map list. Proc ids are rt.def positions (bundle order); there is no tgstation.json any more.
 */
export function gameProgram(): CompiledJson {
	if (!haveGameTypes()) throw new Error("the game bundle (build/translated-tg.js) declares no types: import it first");
	// Ids: the declared ones must be 0..n-1 with no gaps or repeats; new types (no id) follow in declaration order.
	const byId: TypeDef[] = [];
	for (const d of defs) {
		if (d.id === null) continue;
		if (byId[d.id]) throw new Error(`type id ${d.id} declared twice (${byId[d.id].path}, ${d.path})`);
		byId[d.id] = d;
	}
	for (let i = 0; i < byId.length; i++) if (!byId[i]) throw new Error(`no type with id ${i} (was it deleted? ids are positions in the type list)`);
	for (const d of defs) if (d.id === null) byId.push(d);
	const idOf = new Map<string, number>();
	byId.forEach((d, i) => {
		if (idOf.has(d.path)) throw new Error(`type ${d.path} declared twice`);
		idOf.set(d.path, i);
	});
	const procIdOf = new Map<string, number>(); // path -> the last rt.def of it (rt.procRef)
	declPaths.forEach((path, i) => procIdOf.set(path, i));
	const value = (v: TypeValue, where: string): JsonValue => {
		if (v === null || typeof v === "string") return v;
		if (typeof v === "number") {
			if (v === Infinity) return { type: JsonVarType.PositiveInfinity };
			if (v === -Infinity) return { type: JsonVarType.NegativeInfinity };
			return v;
		}
		if (v instanceof Resource) return { type: JsonVarType.Resource, resourcePath: v.path };
		if (v instanceof TypePathRef) {
			const id = idOf.get(v.path);
			if (id === undefined) throw new Error(`${where}: no type ${v.path}`);
			return { type: JsonVarType.Type, value: id };
		}
		if (v instanceof ProcPathRef) {
			const id = procIdOf.get(v.path);
			if (id === undefined) throw new Error(`${where}: rt.procRef("${v.path}"): no rt.def has that path`);
			return { type: JsonVarType.Proc, value: id };
		}
		throw new Error(`${where}: a type's starting value must be a constant (put ${String(v)} in its <init> proc)`);
	};
	// Proc lists from the rt.def order: per type, its procs by name (each name's override chain in order), its <init>,
	// and the names of its verbs; the global procs. OpenDream (whose lists these replace) only lists verbs on atoms and
	// clients; a verb on anything else is a proc no `verbs` list ever shows.
	const chains: (Map<string, number[]> | undefined)[] = [];
	const inits: (number | undefined)[] = [];
	const verbs: (Set<string> | undefined)[] = [];
	const globalProcs: number[] = [];
	const verbHolder = new Uint8Array(byId.length); // the type is /atom, /client or under them
	byId.forEach((d, i) => {
		for (let p: string | null = d.path; p !== null; p = byId[idOf.get(p)!].parent) if (p === "/atom" || p === "/client") { verbHolder[i] = 1; break; }
	});
	declPaths.forEach((path, i) => {
		const id = i, { owner, name, verb } = parseProcPath(path);
		const o = idOf.get(owner);
		if (o === undefined) throw new Error(`rt.def("${path}"): no type ${owner}`);
		if (name === "<init>") {
			if (inits[o] !== undefined) throw new Error(`type ${owner} has two <init> procs`);
			inits[o] = id;
		} else if (o === 0) globalProcs.push(id);
		else {
			const c = (chains[o] ??= new Map());
			const l = c.get(name);
			if (l) l.push(id);
			else c.set(name, [id]);
			if (verb && verbHolder[o]) (verbs[o] ??= new Set()).add(name);
		}
	});
	const types: TypeJson[] = byId.map((d, i) => {
		const t: TypeJson = { Path: d.path };
		if (d.parent !== null) {
			const p = idOf.get(d.parent);
			if (p === undefined) throw new Error(`type ${d.path}: no parent type ${d.parent}`);
			t.Parent = p;
		}
		if (inits[i] !== undefined) t.InitProc = inits[i];
		if (chains[i]) t.Procs = [...chains[i]!.values()];
		if (verbs[i]) t.Verbs = [...verbs[i]!];
		const vars: Record<string, JsonValue> = {};
		let any = false;
		for (const k of Object.keys(d.vars)) {
			vars[k] = value(d.vars[k], `${d.path} var ${k}`);
			any = true;
		}
		if (any) t.Variables = vars;
		if (d.extra?.global) t.GlobalVariables = d.extra.global;
		if (d.extra?.const) t.ConstVariables = d.extra.const;
		if (d.extra?.tmp) t.TmpVariables = d.extra.tmp;
		return t;
	});
	const gl: Record<string, JsonValue> = {};
	globalTable!.forEach(([name, v], i) => {
		if (v !== null) gl[i] = value(v, `global ${name}`);
	});
	return {
		ProcDecls: decls,
		Types: types,
		GlobalProcs: globalProcs,
		Strings: [],
		Globals: { GlobalCount: globalTable!.length, Names: globalTable!.map((g) => g[0]), Globals: gl },
		GlobalInitSetup: globalInitSetup ?? undefined,
		MapFiles: mapFiles!,
	};
}
