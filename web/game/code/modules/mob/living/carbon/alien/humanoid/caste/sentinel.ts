// From code/modules/mob/living/carbon/alien/humanoid/caste/sentinel.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4830, "/mob/living/carbon/alien/humanoid/sentinel", "/mob/living/carbon/alien/humanoid", {
	caste: "s",
	name: "alien sentinel",
	maxHealth: 150,
	health: 150,
	icon_state: "aliens",
});

// /mob/living/carbon/alien/humanoid/sentinel/proc/Initialize  (code/modules/mob/living/carbon/alien/humanoid/caste/sentinel.dm:10)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/sentinel/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.srcCall(f, "AddAbility", (yield* g.new_(f, T("/obj/effect/proc_holder/alien/sneak"), [])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/sentinel/proc/create_internal_organs  (code/modules/mob/living/carbon/alien/humanoid/caste/sentinel.dm:14)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/sentinel/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/alien/plasmavessel"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/alien/acid"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/alien/neurotoxin"), [])), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/sentinel/proc/movement_delay  (code/modules/mob/living/carbon/alien/humanoid/caste/sentinel.dm:21)
rt.def("/mob/living/carbon/alien/humanoid/sentinel/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});
