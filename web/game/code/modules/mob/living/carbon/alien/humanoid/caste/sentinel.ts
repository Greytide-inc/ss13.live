// Based on /tg/station's code/modules/mob/living/carbon/alien/humanoid/caste/sentinel.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4830, "/mob/living/carbon/alien/humanoid/sentinel", "/mob/living/carbon/alien/humanoid", {
	caste: "s",
	name: "alien sentinel",
	maxHealth: 150,
	health: 150,
	icon_state: "aliens",
});

// sentinel.dm:10
rt.def("/mob/living/carbon/alien/humanoid/sentinel/proc/Initialize", function* Initialize(f: Frame) {
	yield* this.AddAbility((yield* new_(T("/obj/effect/proc_holder/alien/sneak"))));
	yield* parent_proc();
	return f.dot;
}, true);

// sentinel.dm:14
rt.def("/mob/living/carbon/alien/humanoid/sentinel/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	this.internal_organs += (yield* new_(T("/obj/item/organ/alien/plasmavessel")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/alien/acid")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/alien/neurotoxin")));
	yield* parent_proc();
	return f.dot;
}, true);

// sentinel.dm:21
rt.def("/mob/living/carbon/alien/humanoid/sentinel/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = parent_proc();
	return f.dot;
});
