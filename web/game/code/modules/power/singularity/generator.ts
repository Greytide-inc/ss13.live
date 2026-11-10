// Based on /tg/station's code/modules/power/singularity/generator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// generator.dm:21
rt.def("/obj/machinery/the_singularitygen/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (user.a_intent == "grab" && (yield* this.user_buckle_mob(user.pulling, user, { check_loc: 0 }))) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// generator.dm:26
rt.def("/obj/machinery/the_singularitygen/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		yield* this.default_unfasten_wrench(user, W, 0);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// generator.dm:32
rt.def("/obj/machinery/the_singularitygen/proc/process", function* process(f: Frame) {
	let _T: Value = null, S: Value = null;
	if (!(this.energy > 0)) return f.dot;
	if (this.energy >= 200) {
		_T = rt.getStep(f, this, 0);
		this.transfer_fingerprints_to((S = (yield* new_(this.creation_type, _T, 50))));
		yield* qdel(this);
	} else {
		this.energy -= 1;
	}
	return f.dot;
}, true, { waitfor: false });
