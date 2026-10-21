// From code/modules/power/singularity/particle_accelerator/particle.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12090, "/obj/effect/accelerated_particle", "/obj/effect", {
	movement_range: 10,
	energy: 10,
	speed: 1,
	anchored: 1,
	name: "Accelerated Particles",
	desc: "Small things moving very fast.",
	icon: rt.rsc("icons/obj/machines/particle_accelerator.dmi"),
	icon_state: "particle",
	density: 0,
});

// /obj/effect/accelerated_particle/proc/New  (code/modules/power/singularity/particle_accelerator/particle.dm:26)  may sleep
rt.def("/obj/effect/accelerated_particle/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/accelerated_particle/proc/move")])), 1]);
	return f.dot;
}, true, { args: ["loc"] });

// /obj/effect/accelerated_particle/proc/Bump  (code/modules/power/singularity/particle_accelerator/particle.dm:33)  may sleep
rt.def("/obj/effect/accelerated_particle/proc/Bump", function* Bump(f: Frame, A: Value) {
	let S: Value = null;
	f.vars = () => [A, S];
	if (!truthy(live(A))) return f.dot;
	if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
		yield* g.srcCall(f, "toxmob", live(A));
	} else {
		if (truthy((rt.istype(live(A), T("/obj/machinery/the_singularitygen")) ? 1 : 0))) {
			rt.modField(f, (S = live(A)), "energy", rt.sv(f, "energy"), add);
		} else {
			if (!truthy((rt.istype(live(A), T("/obj/singularity")) ? 1 : 0))) return f.dot;
			rt.modField(f, (S = live(A)), "energy", rt.sv(f, "energy"), add);
		}
	}
	return f.dot;
}, true);

// /obj/effect/accelerated_particle/proc/Crossed  (code/modules/power/singularity/particle_accelerator/particle.dm:44)  may sleep
rt.def("/obj/effect/accelerated_particle/proc/Crossed", function* Crossed(f: Frame, A: Value) {
	f.vars = () => [A];
	if (!truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "toxmob", live(A));
	return f.dot;
}, true);

// /obj/effect/accelerated_particle/proc/ex_act  (code/modules/power/singularity/particle_accelerator/particle.dm:49)  may sleep
rt.def("/obj/effect/accelerated_particle/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	f.vars = () => [severity, target];
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

// /obj/effect/accelerated_particle/proc/toxmob  (code/modules/power/singularity/particle_accelerator/particle.dm:52)  may sleep
rt.def("/obj/effect/accelerated_particle/proc/toxmob", function* toxmob(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.callName(f, live(M), "rad_act", [multiply(rt.sv(f, "energy"), 6)]);
	return f.dot;
}, true);

// /obj/effect/accelerated_particle/proc/move  (code/modules/power/singularity/particle_accelerator/particle.dm:55)  may sleep
rt.def("/obj/effect/accelerated_particle/proc/move", function* move(f: Frame) {
	if (!truthy((yield* g.call(f, P("/proc/step"), null, [live(f.src), rt.sv(f, "dir")])))) {
		yield* g.srcCall(f, "forceMove", rt.getStep(f, live(f.src), rt.sv(f, "dir")));
	}
	rt.incSrcVar(f, "movement_range", -1, true);
	if (isEqual(rt.sv(f, "movement_range"), 0)) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		yield* g.call(f, P("/proc/sleep"), null, [rt.sv(f, "speed")]);
		yield* g.srcCall(f, "move");
	}
	return f.dot;
}, true);
