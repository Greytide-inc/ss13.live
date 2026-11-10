// Based on /tg/station's code/modules/surgery/prosthetic_replacement.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1322, "/datum/surgery/prosthetic_replacement", "/datum/surgery", {
	name: "prosthetic replacement",
	steps: null,
	possible_locs: null,
	requires_bodypart: 0,
	species: null,
});

// prosthetic_replacement.dm:3
rt.def("/datum/surgery/prosthetic_replacement/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/add_prosthetic"));
	this.possible_locs = list("r_arm", "l_arm", "l_leg", "r_leg", "head");

	this.species = list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey"));
	return f.dot;
});

// prosthetic_replacement.dm:9
rt.def("/datum/surgery/prosthetic_replacement/proc/can_start", function can_start(f: Frame, user: Value, target: Value) {
	let C: Value = null;
	if (!rt.istype(target, T("/mob/living/carbon"))) {
		return 0;
	}
	if ((C = target).get_bodypart(user.zone_selected)) return f.dot;
	return 1;
});

rt.type(1347, "/datum/surgery_step/add_prosthetic", "/datum/surgery_step", {
	organ_rejection_dam: 0,
	name: "add prosthetic",
	implements: null,
	time: 32,
});

// prosthetic_replacement.dm:19
rt.def("/datum/surgery_step/add_prosthetic/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/bodypart"), 100, T("/obj/item/weapon/organ_storage"), 100, T("/obj/item/weapon/twohanded/required/chainsaw"), 100, T("/obj/item/weapon/melee/synthetic_arm_blade"), 100]);
	return f.dot;
});

// prosthetic_replacement.dm:24
rt.def("/datum/surgery_step/add_prosthetic/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let I: Value = null, BP: Value = null, H: Value = null;
	if (rt.istype(tool, T("/obj/item/weapon/organ_storage"))) {
		if (!rt.len(f, tool.contents)) {
			to_chat(user, `<span class='notice'>There is nothing inside ${tool}!</span>`);
			return -1;
		}
		if (!rt.istype((I = rt.index(tool.contents, 1)), T("/obj/item/bodypart"))) {
			to_chat(user, `<span class='notice'>${I} cannot be attached!</span>`);
			return -1;
		}
		tool = I;
	}
	if (rt.istype(tool, T("/obj/item/bodypart"))) {
		BP = tool;
		if (rt.istype(target, T("/mob/living/carbon/monkey"))) {
			if (BP.status == BODYPART_ROBOTIC || BP.animal_origin != "monkey") {
				to_chat(user, `<span class='warning'>${BP} doesn't match the patient's morphology.</span>`);
				return -1;
			}
		}
		if (BP.status != BODYPART_ROBOTIC) {
			this.organ_rejection_dam = 10;
			if (rt.istype(target, T("/mob/living/carbon/human"))) {
				if (BP.animal_origin) {
					to_chat(user, `<span class='warning'>${BP} doesn't match the patient's morphology.</span>`);
					return -1;
				}
				if ((H = target).dna.species.id != BP.species_id) {
					this.organ_rejection_dam = 30;
				}
			}
		}
		if (target_zone == BP.body_zone) {
			user.visible_message(`${user} begins to replace ${target}'s ${parse_zone(target_zone)}.`, `<span class ='notice'>You begin to replace ${target}'s ${parse_zone(target_zone)}...</span>`);
		} else {
			to_chat(user, `<span class='warning'>${tool} isn't the right type for ${parse_zone(target_zone)}.</span>`);
			return -1;
		}
	} else if (target_zone == "l_arm" || target_zone == "r_arm") {
		user.visible_message(`${user} begins to attach ${tool} onto ${target}.`, `<span class='notice'>You begin to attach ${tool} onto ${target}...</span>`);
	} else {
		to_chat(user, `<span class='warning'>${tool} must be installed onto an arm.</span>`);
		return -1;
	}
	return f.dot;
});

// prosthetic_replacement.dm:61
rt.def("/datum/surgery_step/add_prosthetic/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let L: Value = null, new_arm: Value = null;
	if (rt.istype(tool, T("/obj/item/weapon/organ_storage"))) {
		tool.icon_state = "evidenceobj";
		tool.desc = "A container for holding body parts.";
		tool.cut_overlays();
		tool = rt.index(tool.contents, 1);
	}
	if (rt.istype(tool, T("/obj/item/bodypart"))) {
		L = tool;
		yield* user.drop_item();
		yield* L.attach_limb(target);
		if (this.organ_rejection_dam) {
			yield* target.adjustToxLoss(this.organ_rejection_dam);
		}
		user.visible_message(`${user} successfully replaces ${target}'s ${parse_zone(target_zone)}!`, `<span class='notice'>You succeed in replacing ${target}'s ${parse_zone(target_zone)}.</span>`);
		return 1;
	} else {
		(L = (yield* target.newBodyPart(target_zone, 0, 0))).is_pseudopart = 1;
		yield* L.attach_limb(target);
		user.visible_message(`${user} finishes attaching ${tool}!`, `<span class='notice'>You attach ${tool}.</span>`);
		yield* qdel(tool);
		if (rt.istype(tool, T("/obj/item/weapon/twohanded/required/chainsaw"))) {
			new_arm = (yield* new_(T("/obj/item/weapon/mounted_chainsaw"), target));
			if (target_zone == "r_arm") {
				yield* target.put_in_r_hand(new_arm);
			} else {
				yield* target.put_in_l_hand(new_arm);
			}
			return 1;
		} else {
			if (!rt.istype(tool, T("/obj/item/weapon/melee/synthetic_arm_blade"))) return f.dot;
			new_arm = (yield* new_(T("/obj/item/weapon/melee/arm_blade"), target, 1, 1));
			if (target_zone == "r_arm") {
				yield* target.put_in_r_hand(new_arm);
			} else {
				yield* target.put_in_l_hand(new_arm);
			}
			return 1;
		}
	}
}, true);
