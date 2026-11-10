// Based on /tg/station's code/modules/mob/living/carbon/alien/humanoid/caste/drone.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4828, "/mob/living/carbon/alien/humanoid/drone", "/mob/living/carbon/alien/humanoid", {
	caste: "d",
	name: "alien drone",
	maxHealth: 125,
	health: 125,
	icon_state: "aliend",
});

// drone.dm:10
rt.def("/mob/living/carbon/alien/humanoid/drone/proc/Initialize", function* Initialize(f: Frame) {
	yield* this.AddAbility((yield* new_(T("/obj/effect/proc_holder/alien/evolve"), null)));
	yield* parent_proc();
	return f.dot;
}, true);

// drone.dm:15
rt.def("/mob/living/carbon/alien/humanoid/drone/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	this.internal_organs += (yield* new_(T("/obj/item/organ/alien/plasmavessel/large")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/alien/resinspinner")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/alien/acid")));
	yield* parent_proc();
	return f.dot;
}, true);

// drone.dm:21
rt.def("/mob/living/carbon/alien/humanoid/drone/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = parent_proc();
	return f.dot;
});

rt.type(11402, "/obj/effect/proc_holder/alien/evolve", "/obj/effect/proc_holder/alien", {
	plasma_cost: 500,
	action_icon_state: "alien_evolve_drone",
	name: "Evolve to Praetorian",
	desc: "Praetorian",
});

// drone.dm:31
rt.def("/obj/effect/proc_holder/alien/evolve/proc/fire", function* fire(f: Frame, user: Value) {
	let node: Value = null, new_xeno: Value = null;
	if (!(node = user.getorgan(T("/obj/item/organ/alien/hivenode")))) {
		to_chat(user, "<span class='danger'>Without the hivemind, you can't possibly hold the responsibility of leadership!</span>");
		return 0;
	}
	if (node.recent_queen_death) {
		to_chat(user, "<span class='danger'>Your thoughts are still too scattered to take up the position of leadership.</span>");
		return 0;
	}
	if (!isturf(user.loc)) {
		to_chat(user, "<span class='notice'>You can't evolve here!</span>");
		return 0;
	}
	if (!get_alien_type(T("/mob/living/carbon/alien/humanoid/royal"))) {
		new_xeno = (yield* new_(T("/mob/living/carbon/alien/humanoid/royal/praetorian"), user.loc));
		yield* user.alien_evolve(new_xeno);
		return 1;
	} else {
		to_chat(user, "<span class='notice'>We already have a living royal!</span>");
		return 0;
	}
}, true);
