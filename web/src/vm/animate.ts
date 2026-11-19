// animate - the animate() built-in and the animation events the live view plays, moved out of interpreter.ts.

import { ArgsType } from "./args-type.js";
import { DMList, DMObject, live } from "./objects.js";
import { stringify, type Value } from "./value.js";
import { num, type Frame, type VM } from "./interpreter.js";

/**
 * animate(Object, var = value, ..., time, loop, easing, flags). each step is also recorded in animLog for the live page.
 * Measured: each call sets the object's vars to that step's values at once (the client does the
 * in-between), a call without an object applies to the last animated object, and animate(O) alone
 * leaves the vars as they are. It returns null.
 */
export function animate(vm: VM, f: Frame, type: ArgsType, vals: Value[]): void {
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
	if (target !== null) vm.lastAnimated = target;
	else target = vm.lastAnimated;
	if (!(target instanceof DMObject) || target.deleted) return;
	const log = vm.animLog;
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
			vm.setField(target, k, v);
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
