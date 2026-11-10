// Based on /tg/station's code/modules/surgery/cavity_implant.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1311, "/datum/surgery/cavity_implant", "/datum/surgery", {
	name: "cavity implant",
	steps: null,
	possible_locs: null,
	species: null,
});

// cavity_implant.dm:3
rt.def("/datum/surgery/cavity_implant/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/incise"), T("/datum/surgery_step/handle_cavity"), T("/datum/surgery_step/close"));

	this.possible_locs = list("chest");

	this.species = list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey"));
	return f.dot;
});

rt.type(1330, "/datum/surgery_step/handle_cavity", "/datum/surgery_step", {
	IC: null,
	name: "implant item",
	accept_hand: 1,
	accept_any_item: 1,
	time: 32,
});

// cavity_implant.dm:17
rt.def("/datum/surgery_step/handle_cavity/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let CH: Value = null;
	this.IC = (CH = target.get_bodypart("chest")).cavity_item;
	if (tool) {
		user.visible_message(`${user} begins to insert ${tool} into ${target}'s ${target_zone}.`, `<span class='notice'>You begin to insert ${tool} into ${target}'s ${target_zone}...</span>`);
	} else {
		user.visible_message(`${user} checks for items in ${target}'s ${target_zone}.`, `<span class='notice'>You check for items in ${target}'s ${target_zone}...</span>`);
	}
	return f.dot;
});

// cavity_implant.dm:25
rt.def("/datum/surgery_step/handle_cavity/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let CH: Value = target.get_bodypart("chest");
	if (tool) {
		if (this.IC || tool.w_class > WEIGHT_CLASS_NORMAL || rt.isIn(f, NODROP, tool.flags) || rt.istype(tool, T("/obj/item/organ"))) {
			to_chat(user, `<span class='warning'>You can't seem to fit ${tool} in ${target}'s ${target_zone}!</span>`);
			return 0;
		} else {
			user.visible_message(`${user} stuffs ${tool} into ${target}'s ${target_zone}!`, `<span class='notice'>You stuff ${tool} into ${target}'s ${target_zone}.</span>`);
			yield* user.drop_item();
			CH.cavity_item = tool;
			tool.loc = target;
			return 1;
		}
	} else if (this.IC) {
		user.visible_message(`${user} pulls ${this.IC} out of ${target}'s ${target_zone}!`, `<span class='notice'>You pull ${this.IC} out of ${target}'s ${target_zone}.</span>`);
		yield* user.put_in_hands(this.IC);
		CH.cavity_item = null;
		return 1;
	} else {
		to_chat(user, `<span class='warning'>You don't find anything in ${target}'s ${target_zone}.</span>`);
		return 0;
	}
}, true);
