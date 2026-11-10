// Based on /tg/station's code/modules/surgery/limb_augmentation.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1341, "/datum/surgery_step/replace", "/datum/surgery_step", {
	name: "sever muscles",
	implements: null,
	time: 32,
});

// limb_augmentation.dm:9
rt.def("/datum/surgery_step/replace/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/weapon/scalpel"), 100, T("/obj/item/weapon/wirecutters"), 55]);
	return f.dot;
});

// limb_augmentation.dm:14
rt.def("/datum/surgery_step/replace/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} begins to sever the muscles on ${target}'s ${parse_zone(user.zone_selected)}.`, `<span class ='notice'>You begin to sever the muscles on ${target}'s ${parse_zone(user.zone_selected)}...</span>`);
	return f.dot;
});

rt.type(1342, "/datum/surgery_step/add_limb", "/datum/surgery_step", {
	L: null,
	name: "replace limb",
	implements: null,
	time: 32,
});

// limb_augmentation.dm:19
rt.def("/datum/surgery_step/add_limb/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/bodypart"), 100]);
	return f.dot;
});

// limb_augmentation.dm:25
rt.def("/datum/surgery_step/add_limb/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let aug: Value = null;
	if ((aug = tool).status != BODYPART_ROBOTIC) {
		to_chat(user, "<span class='warning'>that's not an augment silly!</span>");
		return -1;
	}
	if (aug.body_zone != target_zone) {
		to_chat(user, `<span class='warning'>${tool} isn't the right type for ${parse_zone(target_zone)}.</span>`);
		return -1;
	}
	this.L = surgery.operated_bodypart;
	if (this.L) {
		user.visible_message(`${user} begins to augment ${target}'s ${parse_zone(user.zone_selected)}.`, `<span class ='notice'>You begin to augment ${target}'s ${parse_zone(user.zone_selected)}...</span>`);
	} else {
		user.visible_message(`${user} looks for ${target}'s ${parse_zone(user.zone_selected)}.`, `<span class ='notice'>You look for ${target}'s ${parse_zone(user.zone_selected)}...</span>`);
	}
	return f.dot;
});

rt.type(1316, "/datum/surgery/augmentation", "/datum/surgery", {
	name: "augmentation",
	steps: null,
	possible_locs: null,
	requires_real_bodypart: 1,
	species: null,
});

// limb_augmentation.dm:43
rt.def("/datum/surgery/augmentation/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/replace"), T("/datum/surgery_step/saw"), T("/datum/surgery_step/add_limb"));
	this.possible_locs = list("r_arm", "l_arm", "r_leg", "l_leg", "chest", "head");

	this.species = list(T("/mob/living/carbon/human"));
	return f.dot;
});

// limb_augmentation.dm:52
rt.def("/datum/surgery_step/add_limb/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	if (this.L) {
		user.visible_message(`${user} successfully augments ${target}'s ${parse_zone(target_zone)}!`, `<span class='notice'>You successfully augment ${target}'s ${parse_zone(target_zone)}.</span>`);
		yield* this.L.change_bodypart_status(BODYPART_ROBOTIC, 1);
		this.L.icon = tool.icon;
		this.L.max_damage = tool.max_damage;
		yield* user.drop_item();
		yield* qdel(tool);
		yield* target.update_body_parts();
		yield* target.updatehealth();
		yield* add_logs(user, target, "augmented", { addition: `by giving him new ${parse_zone(target_zone)} INTENT: ${uppertext(user.a_intent)}` });
	} else {
		to_chat(user, `<span class='warning'>${target} has no organic ${parse_zone(target_zone)} there!</span>`);
	}
	return 1;
}, true);
