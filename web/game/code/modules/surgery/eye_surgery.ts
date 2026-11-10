// Based on /tg/station's code/modules/surgery/eye_surgery.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1314, "/datum/surgery/eye_surgery", "/datum/surgery", {
	name: "eye surgery",
	steps: null,
	possible_locs: null,
	requires_organic_bodypart: 0,
	species: null,
});

// eye_surgery.dm:3
rt.def("/datum/surgery/eye_surgery/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/fix_eyes"), T("/datum/surgery_step/close"));

	this.possible_locs = list("eyes");

	this.species = list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey"));
	return f.dot;
});

rt.type(1333, "/datum/surgery_step/fix_eyes", "/datum/surgery_step", {
	name: "fix eyes",
	implements: null,
	time: 64,
});

// eye_surgery.dm:11
rt.def("/datum/surgery_step/fix_eyes/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/weapon/hemostat"), 100, T("/obj/item/weapon/screwdriver"), 45, T("/obj/item/weapon/pen"), 25]);
	return f.dot;
});

// eye_surgery.dm:15
rt.def("/datum/surgery/eye_surgery/proc/can_start", function can_start(f: Frame, user: Value, target: Value) {
	let E: Value = null;
	if (E = target.getorganslot("eye_sight")) return f.dot;
	to_chat(user, "It's hard to do surgery on someones eyes when they don't have any.");
	return 0;
});

// eye_surgery.dm:21
rt.def("/datum/surgery_step/fix_eyes/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} begins to fix ${target}'s eyes.`, `<span class='notice'>You begin to fix ${target}'s eyes...</span>`);
	return f.dot;
});

// eye_surgery.dm:24
rt.def("/datum/surgery_step/fix_eyes/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} successfully fixes ${target}'s eyes!`, `<span class='notice'>You succeed in fixing ${target}'s eyes.</span>`);
	yield* target.cure_blind();
	yield* target.set_blindness(0);
	yield* target.cure_nearsighted();
	yield* target.blur_eyes(35);
	yield* target.set_eye_damage(0);
	return 1;
}, true);

// eye_surgery.dm:33
rt.def("/datum/surgery_step/fix_eyes/proc/failure", function failure(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	if (target.getorgan(T("/obj/item/organ/brain"))) {
		user.visible_message(`<span class='warning'>${user} accidentally stabs ${target} right in the brain!</span>`, `<span class='warning'>You accidentally stab ${target} right in the brain!</span>`);
		target.adjustBrainLoss(100);
	} else {
		user.visible_message(`<span class='warning'>${user} accidentally stabs ${target} right in the brain! Or would have, if ${target} had a brain.</span>`, `<span class='warning'>You accidentally stab ${target} right in the brain! Or would have, if ${target} had a brain.</span>`);
	}
	return 0;
});
