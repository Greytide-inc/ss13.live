// Based on /tg/station's code/game/gamemodes/miniantags/abduction/abduction_surgery.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1309, "/datum/surgery/organ_extraction", "/datum/surgery", {
	name: "experimental dissection",
	steps: null,
	possible_locs: null,
	ignore_clothes: 1,
});

// abduction_surgery.dm:3
rt.def("/datum/surgery/organ_extraction/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/incise"), T("/datum/surgery_step/extract_organ"), T("/datum/surgery_step/gland_insert"));

	this.possible_locs = list("chest");
	return f.dot;
});

// abduction_surgery.dm:8
rt.def("/datum/surgery/organ_extraction/proc/can_start", function can_start(f: Frame, user: Value, target: Value) {
	let H: Value = null, A: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return 0;
	}
	if ((H = user).dna.species.id == "abductor") {
		return 1;
	}
	for (A of each(H.implants, T("/obj/item/weapon/implant/abductor"))) {
		return 1;
	}
	return 0;
});

rt.type(1327, "/datum/surgery_step/extract_organ", "/datum/surgery_step", {
	IC: null,
	organ_types: null,
	name: "remove heart",
	accept_hand: 1,
	time: 32,
});

// abduction_surgery.dm:23
rt.def("/datum/surgery_step/extract_organ/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.organ_types = list(T("/obj/item/organ/heart"));
	return f.dot;
});

// abduction_surgery.dm:26
rt.def("/datum/surgery_step/extract_organ/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let A: Value = null;
	for (A of each(target.internal_organs, T("/atom"))) {
		if (rt.isIn(f, A.type, this.organ_types)) {
			this.IC = A;
			break;
		}
	}
	user.visible_message(`${user} starts to remove ${target}'s organs.`, `<span class='notice'>You start to remove ${target}'s organs...</span>`);
	return f.dot;
});

// abduction_surgery.dm:34
rt.def("/datum/surgery_step/extract_organ/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	if (this.IC) {
		user.visible_message(`${user} pulls ${this.IC} out of ${target}'s ${target_zone}!`, `<span class='notice'>You pull ${this.IC} out of ${target}'s ${target_zone}.</span>`);
		yield* user.put_in_hands(this.IC);
		yield* this.IC.Remove(target);
		return 1;
	} else {
		to_chat(user, `<span class='warning'>You don't find anything in ${target}'s ${target_zone}!</span>`);
		return 1;
	}
}, true);

rt.type(1328, "/datum/surgery_step/gland_insert", "/datum/surgery_step", {
	name: "insert gland",
	implements: null,
	time: 32,
});

// abduction_surgery.dm:44
rt.def("/datum/surgery_step/gland_insert/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/organ/heart/gland"), 100]);
	return f.dot;
});

// abduction_surgery.dm:48
rt.def("/datum/surgery_step/gland_insert/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} starts to insert ${tool} into ${target}.`, `<span class ='notice'>You start to insert ${tool} into ${target}...</span>`);
	return f.dot;
});

// abduction_surgery.dm:51
rt.def("/datum/surgery_step/gland_insert/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let gland: Value = null;
	user.visible_message(`${user} inserts ${tool} into ${target}.`, `<span class ='notice'>You insert ${tool} into ${target}.</span>`);
	yield* user.drop_item();
	yield* (gland = tool).Insert(target, 2);
	return 1;
}, true);
