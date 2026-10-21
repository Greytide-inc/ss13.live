// From code/modules/mob/living/carbon/alien/humanoid/caste/praetorian.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4827, "/mob/living/carbon/alien/humanoid/royal/praetorian", "/mob/living/carbon/alien/humanoid/royal", {
	name: "alien praetorian",
	caste: "p",
	maxHealth: 250,
	health: 250,
	icon_state: "alienp",
});

// /mob/living/carbon/alien/humanoid/royal/praetorian/proc/Initialize  (code/modules/mob/living/carbon/alien/humanoid/caste/praetorian.dm:12)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/royal/praetorian/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "real_name", rt.sv(f, "name"));
	yield* g.srcCall(f, "AddSpell", (yield* g.new_(f, T("/obj/effect/proc_holder/spell/aoe_turf/repulse/xeno"), [live(f.src)])));
	yield* g.srcCall(f, "AddAbility", (yield* g.new_(f, T("/obj/effect/proc_holder/alien/royal/praetorian/evolve"), [])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/royal/praetorian/proc/create_internal_organs  (code/modules/mob/living/carbon/alien/humanoid/caste/praetorian.dm:19)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/royal/praetorian/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/alien/plasmavessel/large"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/alien/resinspinner"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/alien/acid"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/alien/neurotoxin"), [])), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/royal/praetorian/proc/movement_delay  (code/modules/mob/living/carbon/alien/humanoid/caste/praetorian.dm:27)
rt.def("/mob/living/carbon/alien/humanoid/royal/praetorian/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	f.dot = rt.modify(live(f.dot), 1, add);
	return f.dot;
});

rt.type(11401, "/obj/effect/proc_holder/alien/royal/praetorian/evolve", "/obj/effect/proc_holder/alien/royal/praetorian", {
	plasma_cost: 500,
	action_icon_state: "alien_evolve_praetorian",
	name: "Evolve",
	desc: "Produce an interal egg sac capable of spawning children. Only one queen can exist at a time.",
});

// /obj/effect/proc_holder/alien/royal/praetorian/evolve/proc/fire  (code/modules/mob/living/carbon/alien/humanoid/caste/praetorian.dm:38)  may sleep
rt.def("/obj/effect/proc_holder/alien/royal/praetorian/evolve/proc/fire", function* fire(f: Frame, user: Value) {
	let node: Value = null, new_xeno: Value = null;
	f.vars = () => [user, node, new_xeno];
	if (!truthy((node = (yield* g.callName(f, live(user), "getorgan", [T("/obj/item/organ/alien/hivenode")]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Without the hivemind, you would be unfit to rule as queen!</span>"]);
		return 0;
	}
	if (truthy(rt.fv(f, "recent_queen_death", live(node)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>You are still too burdened with guilt to evolve into a queen.</span>"]);
		return 0;
	}
	if (!truthy((yield* g.call(f, P("/proc/get_alien_type"), null, [T("/mob/living/carbon/alien/humanoid/royal/queen")])))) {
		new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/royal/queen"), [rt.fv(f, "loc", live(user))]));
		yield* g.callName(f, live(user), "alien_evolve", [live(new_xeno)]);
		return 1;
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>We already have an alive queen.</span>"]);
		return 0;
	}
	return f.dot;
}, true);
