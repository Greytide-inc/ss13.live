// From code/game/gamemodes/clock_cult/clock_effect.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11405, "/obj/effect/clockwork", "/obj/effect", {
	clockwork_desc: "A fabled artifact from beyond the stars. Contains concentrated meme essence.",
	anchored: 1,
	name: "meme machine",
	desc: "Still don't know what it is.",
	icon: rt.rsc("icons/effects/clockwork_effects.dmi"),
	icon_state: "ratvars_flame",
	density: 0,
	opacity: 0,
	resistance_flags: 115,
});

// /obj/effect/clockwork/proc/Initialize  (code/game/gamemodes/clock_cult/clock_effect.dm:14)
rt.def("/obj/effect/clockwork/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.modGl("all_clockwork_objects", live(f.src), add);
	return f.dot;
});

// /obj/effect/clockwork/proc/Destroy  (code/game/gamemodes/clock_cult/clock_effect.dm:18)  may sleep
rt.def("/obj/effect/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("all_clockwork_objects", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/clockwork/proc/examine  (code/game/gamemodes/clock_cult/clock_effect.dm:22)
rt.def("/obj/effect/clockwork/proc/examine", function examine(f: Frame) {
	if (((truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0))) && truthy(rt.sv(f, "clockwork_desc")))) {
		rt.setSv(f, "desc", rt.sv(f, "clockwork_desc"));
	}
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
	return f.dot;
}, false, { args: ["user"] });
