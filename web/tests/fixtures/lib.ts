// lib.ts - the fixture programs' glue. A fixture file is written like a web/game/ file: `rt.type(...)`, `rt.def(path, fn, gen, meta)`,
// `rt.globals([...])` and `rt.globalInit(fn)` statements, all through this `rt` (the real runtime plus a def that also declares the
// proc for the type tree, which tools/translate-tg.mjs does for the game files). Import order is declaration order: std.ts first.
import * as base from "../../src/translate/runtime.js";
import type { Frame, Value } from "../../src/translate/runtime.js";
import type { ProcMeta } from "../../src/vm/json.js";
import { ObjectTree } from "../../src/vm/objtree.js";
import { gameProgram } from "../../src/vm/typedefs.js";
import { VM } from "../../src/vm/interpreter.js";

export type { Frame, Value };

type Fn = (f: Frame, ...a: Value[]) => unknown;

/** The DM argument names of a proc: its JS parameters after `f` (a leading `_` on a reserved word is dropped, as in the bundler). */
function paramNames(fn: Fn): string[] {
	const m = /^[^(]*\(([^)]*)\)/.exec(fn.toString());
	if (!m) throw new Error(`can't read the parameters of ${fn.toString().slice(0, 60)}`);
	return m[1].split(",").map((s) => s.trim()).filter((s) => s.length > 0).slice(1).map((s) => (s.startsWith("_") ? s.slice(1) : s));
}

const globalNames: string[] = [];
const globalValues: [string, null | number | string][] = [];
/** The root type's `global` map (name -> index into the global table); std.ts gives it to rt.type("/") and it is filled in as files declare globals. */
const globalIndex: Record<string, number> = {};
const inits: ((f: Frame) => void)[] = [];
let initSet = false;

export const rt = {
	...base,
	def(path: string, fn?: Fn, gen = false, meta?: ProcMeta): void {
		const args = meta?.args ?? (fn ? paramNames(fn) : []);
		base.procDecls([[path, args, fn ? 1 : 0, meta]]);
		base.def(path, fn as never, gen, meta);
	},
	/** Declares globals (name, starting constant); the index is the position over all fixture files. */
	globals(entries: [string, null | number | string][]): void {
		for (const [name, v] of entries) {
			if (name in globalIndex) throw new Error(`global ${name} declared twice`);
			globalIndex[name] = globalNames.length;
			globalNames.push(name);
			globalValues.push([name, v]);
		}
		base.globals(globalValues as never);
	},
	globalIndex,
	/** A piece of the global init (`var/global x = expr`): all pieces run in declaration order. */
	globalInit(fn: (f: Frame) => void): void {
		inits.push(fn);
		if (initSet) return;
		initSet = true;
		base.globalInit(function (f: Frame) {
			for (const part of inits) part(f);
			return null;
		});
	},
};

/** The global called `name`, and setting it (what `var/global/name` compiles to in the game files). */
export const G = (name: string): Value => base.glob(globalIndex[name]);
export const setG = (name: string, v: Value): Value => base.setGlob(globalIndex[name], v);

export const MAP_PATH = "fixture/map.dmm";
/** The compile-time map: 5x5 of /turf in /area (what tests/dm/world_map.dmm gives the DM program). */
const MAP = `"a" = (/turf,/area)

(1,1,1) = {"
aaaaa
aaaaa
aaaaa
aaaaa
aaaaa
"}
`;

/** A fresh VM running the fixture program (the files the caller has imported). */
export function makeFixtureVm(): VM {
	const vm = new VM(new ObjectTree(gameProgram()));
	vm.vfs.writeText(MAP_PATH, MAP);
	base.install(vm);
	return vm;
}
