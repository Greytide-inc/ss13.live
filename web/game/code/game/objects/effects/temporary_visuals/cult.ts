// From code/game/objects/effects/temporary_visuals/cult.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11578, "/obj/effect/temp_visual/cult/rune_spawn", "/obj/effect/temp_visual/cult", {
	turnedness: 179,
	icon_state: "runeouter",
	alpha: 0,
});

// /obj/effect/temp_visual/cult/rune_spawn/proc/Initialize  (code/game/objects/effects/temporary_visuals/cult.dm:58)  may sleep
rt.def("/obj/effect/temp_visual/cult/rune_spawn/proc/Initialize", function* Initialize(f: Frame) {
	let oldtransform: Value = null, M: Value = null;
	f.vars = () => [oldtransform, M];
	if (truthy((yield* g.call(f, P("/proc/isnum"), null, [live(f.args[1])])))) {
		rt.setSv(f, "duration", live(f.args[1]));
	}
	if (truthy(live(f.args[2]))) {
		yield* g.srcCall(f, "add_atom_colour", live(f.args[2]), 4);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	oldtransform = rt.sv(f, "transform");
	rt.setSv(f, "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 2));
	yield* g.callName(f, (M = rt.sv(f, "transform")), "Turn", [rt.sv(f, "turnedness")]);
	rt.setSv(f, "transform", live(M));
	rt.op(f, "Animate", [2, 10], [null, live(f.src), "alpha", 255, "time", rt.sv(f, "duration"), "easing", 4, "flags", 4]);
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "transform", live(oldtransform), "time", rt.sv(f, "duration"), "flags", 4]);
	return f.dot;
}, true, { args: ["mapload", "set_duration", "set_color"] });
