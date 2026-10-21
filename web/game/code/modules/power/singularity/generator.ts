// From code/modules/power/singularity/generator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10976, "/obj/machinery/the_singularitygen", "/obj/machinery", {
	energy: 0,
	creation_type: rt.typePath("/obj/singularity"),
	anchored: 0,
	use_power: 0,
	can_buckle: 1,
	buckle_lying: 0,
	buckle_requires_restraints: 1,
	name: "Gravitational Singularity Generator",
	desc: "An odd device which produces a Gravitational Singularity when set up.",
	icon: rt.rsc("icons/obj/singularity.dmi"),
	icon_state: "TheSingGen",
	density: 1,
	resistance_flags: 2,
});

// /obj/machinery/the_singularitygen/proc/attack_hand  (code/modules/power/singularity/generator.dm:21)  may sleep
rt.def("/obj/machinery/the_singularitygen/proc/attack_hand", function* attack_hand(f: Frame) {
	if ((isEqual(rt.fv(f, "a_intent", live(f.args[0])), "grab") && truthy((yield* g.callSrc(f, "user_buckle_mob", [null, rt.fv(f, "pulling", live(f.args[0])), null, live(f.args[0]), "check_loc", 0], rt.Args.Named))))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/the_singularitygen/proc/attackby  (code/modules/power/singularity/generator.dm:26)  may sleep
rt.def("/obj/machinery/the_singularitygen/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]), 0);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/the_singularitygen/proc/process  (code/modules/power/singularity/generator.dm:32)  may sleep
rt.def("/obj/machinery/the_singularitygen/proc/process", function* process(f: Frame) {
	let _T: Value = null, S: Value = null;
	f.vars = () => [_T, S];
	if (!rt.gt(rt.sv(f, "energy"), 0)) return f.dot;
	if (rt.ge(rt.sv(f, "energy"), 200)) {
		_T = rt.getStep(f, live(f.src), 0);
		yield* g.srcCall(f, "transfer_fingerprints_to", (S = (yield* g.new_(f, rt.sv(f, "creation_type"), [live(_T), 50]))));
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		(rt.modSrcVar(f, "energy", 1, subtract));
	}
	return f.dot;
}, true, { waitfor: false });
