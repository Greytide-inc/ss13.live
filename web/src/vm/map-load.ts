// map-load - building the compile-time maps before world/New() (reading the .dmm files, creating the atoms, running their New()), moved out of interpreter.ts.

import { ListLiteral, type DMType } from "./objtree.js";
import type { DMObject } from "./objects.js";
import { LOOK_VARS, normLookVar } from "./look.js";
import { parseDmms, type CompiledMap } from "./dmm.js";
import { Thread } from "./scheduler.js";
import { DMAtom } from "./world.js";
import type { Value } from "./value.js";
import type { VM } from "./interpreter.js";

/** The compile-time maps: the .dmm files web/game/_maps.ts lists (read from the vfs), or the JSON's Maps (--json-types, tests). */
export function compiledMaps(vm: VM): CompiledMap[] {
	const files = vm.tree.json.MapFiles?.map((f) => vm.compiledMapSwaps?.[f] ?? f);
	if (!files) return (vm.tree.json.Maps ?? []) as CompiledMap[];
	const t0 = performance.now();
	const maps = parseDmms(files, (f) => vm.vfs.readText(f), (p) => vm.tree.getType(p));
	vm.mapReadMs = performance.now() - t0;
	return maps;
}

/**
 * Builds the compile-time maps (the .dmm files the program #includes), as BYOND does before world/New().
 * Checked only on the tests' 5x5 map of /turf in /area: the order BYOND
 * creates map atoms and calls New() in, and var overrides, are unverified (the map-loading chunk).
 */
export function loadCompiledMaps(vm: VM): void {
	const maps = compiledMaps(vm);
	if (maps.length === 0) return;
	let mx = 0, my = 0, mz = 0;
	for (const m of maps) {
		mx = Math.max(mx, m.MaxX);
		my = Math.max(my, m.MaxY);
		mz = Math.max(mz, m.MaxZ);
	}
	const world = vm.world;
	if (world) {
		// Unverified: world.maxx/maxy set in the /world type are a minimum size.
		mx = Math.max(mx, Number(world.getVar("maxx")) || 0);
		my = Math.max(my, Number(world.getVar("maxy")) || 0);
	}
	const created = vm.map.resize(mx, my, mz, false);
	const objects: [DMType, Record<string, unknown> | undefined, DMAtom, number][] = [];
	const turfOverrides = new Map<DMAtom, Record<string, unknown>>();
	for (const m of maps) {
		for (const block of m.Blocks) {
			let bx = 1, by = 1;
			for (const cellName of block.Cells) {
				const cell = m.CellDefinitions[cellName];
				const turf = vm.map.turfAt(block.X + bx - 1, block.Y + block.Height - by, block.Z);
				if (cell && turf) {
					if (cell.Area && vm.tree.types[cell.Area.Type]) vm.map.setArea(turf, vm.map.areaFor(vm.tree.types[cell.Area.Type]));
					if (cell.Turf && vm.tree.types[cell.Turf.Type]) {
						turf.type = vm.tree.types[cell.Turf.Type];
						turf.clearVars();
						vm.resetVars(turf);
						if (cell.Turf.VarOverrides) turfOverrides.set(turf, cell.Turf.VarOverrides);
					}
					const key = turf.x - 1 + (turf.y - 1) * mx + (turf.z - 1) * mx * my;
					for (const o of cell.Objects ?? []) if (vm.tree.types[o.Type]) objects.push([vm.tree.types[o.Type], o.VarOverrides, turf, key]);
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
	for (let i = created.length - 1; i >= 0; i--) initAtomNow(vm, created[i], [], turfOverrides.get(created[i]));
	objects.sort((p, q) => p[3] - q[3]); // stable: keeps each tile's own order
	for (const [type, ov, turf] of objects) {
		const a = vm.allocObject(type);
		if (!(a instanceof DMAtom)) continue;
		vm.map.setLoc(a, turf);
		initAtomNow(vm, a, [turf], ov);
	}
}

export function applyOverrides(vm: VM, a: DMObject, ov: Record<string, unknown> | undefined): void {
	if (!ov) return;
	for (const [k, v] of Object.entries(ov)) {
		const val = vm.tree.convertValue(v as never);
		const x = val instanceof ListLiteral ? vm.materialize(val) : val;
		a.setVar(k, a instanceof DMAtom && (a.isMovable || k[0] !== "s") && LOOK_VARS.has(k) ? normLookVar(k, x)! : x);
	}
}

/**
 * Runs an atom's (init) proc and New(args) to completion (a nested thread if it sleeps).
 * `overrides` (compile-time map var edits) go in between, as BYOND does (measured
 * probe `ov`): applied before (init), they were lost when (init) rebuilt a list default.
 */
export function initAtomNow(vm: VM, a: DMAtom, args: Value[], overrides?: Record<string, unknown>): void {
	if (overrides) {
		if (a.type.initProc) {
			// (init) only evaluates var defaults; it isn't expected to sleep.
			const t0 = new Thread();
			vm.enter(t0, a.type.initProc, [], a, null);
			vm.run(t0);
		}
		applyOverrides(vm, a, overrides);
		const thread = new Thread();
		const newProc = a.type.procs.get("New");
		if (newProc && !newProc.isNative) vm.enter(thread, newProc, args, a, null);
		if (thread.frames.length) vm.run(thread);
		return;
	}
	const thread = new Thread();
	const newProc = a.type.procs.get("New");
	if (newProc && !newProc.isNative) vm.enter(thread, newProc, args, a, null);
	if (a.type.initProc) vm.enter(thread, a.type.initProc, [], a, null);
	if (thread.frames.length) vm.run(thread);
}
