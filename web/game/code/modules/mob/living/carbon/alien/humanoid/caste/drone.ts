// From code/modules/mob/living/carbon/alien/humanoid/caste/drone.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4828, "/mob/living/carbon/alien/humanoid/drone", "/mob/living/carbon/alien/humanoid", {
	caste: "d",
	name: "alien drone",
	maxHealth: 125,
	health: 125,
	icon_state: "aliend",
});

// /mob/living/carbon/alien/humanoid/drone/proc/Initialize  (code/modules/mob/living/carbon/alien/humanoid/caste/drone.dm:10)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/drone/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.srcCall(f, "AddAbility", (yield* g.new_(f, T("/obj/effect/proc_holder/alien/evolve"), [null])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/drone/proc/create_internal_organs  (code/modules/mob/living/carbon/alien/humanoid/caste/drone.dm:15)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/drone/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/alien/plasmavessel/large"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/alien/resinspinner"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/alien/acid"), [])), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/drone/proc/movement_delay  (code/modules/mob/living/carbon/alien/humanoid/caste/drone.dm:21)
rt.def("/mob/living/carbon/alien/humanoid/drone/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(11402, "/obj/effect/proc_holder/alien/evolve", "/obj/effect/proc_holder/alien", {
	plasma_cost: 500,
	action_icon_state: "alien_evolve_drone",
	name: "Evolve to Praetorian",
	desc: "Praetorian",
});

// /obj/effect/proc_holder/alien/evolve/proc/fire  (code/modules/mob/living/carbon/alien/humanoid/caste/drone.dm:31)  may sleep
rt.def("/obj/effect/proc_holder/alien/evolve/proc/fire", function* fire(f: Frame, user: Value) {
	let node: Value = null, new_xeno: Value = null;
	f.vars = () => [user, node, new_xeno];
	if (!truthy((node = (yield* g.callName(f, live(user), "getorgan", [T("/obj/item/organ/alien/hivenode")]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Without the hivemind, you can't possibly hold the responsibility of leadership!</span>"]);
		return 0;
	}
	if (truthy(rt.fv(f, "recent_queen_death", live(node)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Your thoughts are still too scattered to take up the position of leadership.</span>"]);
		return 0;
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(user))])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You can't evolve here!</span>"]);
		return 0;
	}
	if (!truthy((yield* g.call(f, P("/proc/get_alien_type"), null, [T("/mob/living/carbon/alien/humanoid/royal")])))) {
		new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/royal/praetorian"), [rt.fv(f, "loc", live(user))]));
		yield* g.callName(f, live(user), "alien_evolve", [live(new_xeno)]);
		return 1;
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>We already have a living royal!</span>"]);
		return 0;
	}
	return f.dot;
}, true);
