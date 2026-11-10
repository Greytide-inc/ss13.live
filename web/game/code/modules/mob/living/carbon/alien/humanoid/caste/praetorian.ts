// Based on /tg/station's code/modules/mob/living/carbon/alien/humanoid/caste/praetorian.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4827, "/mob/living/carbon/alien/humanoid/royal/praetorian", "/mob/living/carbon/alien/humanoid/royal", {
	name: "alien praetorian",
	caste: "p",
	maxHealth: 250,
	health: 250,
	icon_state: "alienp",
});

// praetorian.dm:12
rt.def("/mob/living/carbon/alien/humanoid/royal/praetorian/proc/Initialize", function* Initialize(f: Frame) {
	this.real_name = this.name;
	yield* this.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/aoe_turf/repulse/xeno"), this)));
	yield* this.AddAbility((yield* new_(T("/obj/effect/proc_holder/alien/royal/praetorian/evolve"))));
	yield* parent_proc();
	return f.dot;
}, true);

// praetorian.dm:19
rt.def("/mob/living/carbon/alien/humanoid/royal/praetorian/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	this.internal_organs += (yield* new_(T("/obj/item/organ/alien/plasmavessel/large")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/alien/resinspinner")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/alien/acid")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/alien/neurotoxin")));
	yield* parent_proc();
	return f.dot;
}, true);

// praetorian.dm:27
rt.def("/mob/living/carbon/alien/humanoid/royal/praetorian/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = parent_proc();
	f.dot += 1;
	return f.dot;
});

rt.type(11401, "/obj/effect/proc_holder/alien/royal/praetorian/evolve", "/obj/effect/proc_holder/alien/royal/praetorian", {
	plasma_cost: 500,
	action_icon_state: "alien_evolve_praetorian",
	name: "Evolve",
	desc: "Produce an interal egg sac capable of spawning children. Only one queen can exist at a time.",
});

// praetorian.dm:38
rt.def("/obj/effect/proc_holder/alien/royal/praetorian/evolve/proc/fire", function* fire(f: Frame, user: Value) {
	let node: Value = null, new_xeno: Value = null;
	if (!(node = user.getorgan(T("/obj/item/organ/alien/hivenode")))) {
		to_chat(user, "<span class='danger'>Without the hivemind, you would be unfit to rule as queen!</span>");
		return 0;
	}
	if (node.recent_queen_death) {
		to_chat(user, "<span class='danger'>You are still too burdened with guilt to evolve into a queen.</span>");
		return 0;
	}
	if (!get_alien_type(T("/mob/living/carbon/alien/humanoid/royal/queen"))) {
		new_xeno = (yield* new_(T("/mob/living/carbon/alien/humanoid/royal/queen"), user.loc));
		yield* user.alien_evolve(new_xeno);
		return 1;
	} else {
		to_chat(user, "<span class='notice'>We already have an alive queen.</span>");
		return 0;
	}
}, true);
