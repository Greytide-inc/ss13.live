// Based on /tg/station's code/modules/clothing/masks/miscellaneous.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(8564, "/obj/item/clothing/mask/muzzle", "/obj/item/clothing/mask", {
	name: "muzzle",
	desc: "To stop that awful noise.",
	icon_state: "muzzle",
	item_state: "blindfold",
	flags_cover: 8,
	w_class: 2,
	gas_transfer_coefficient: 0.9,
	equip_delay_other: 20,
});

// miscellaneous.dm:12
rt.def("/obj/item/clothing/mask/muzzle/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	let C: Value = null;
	if (rt.istype(user, T("/mob/living/carbon"))) {
		C = user;
		if (this == C.wear_mask) {
			to_chat(user, "<span class='warning'>You need help taking this off!</span>");
			return f.dot;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(8565, "/obj/item/clothing/mask/surgical", "/obj/item/clothing/mask", {
	name: "sterile mask",
	desc: "A sterile mask designed to help prevent the spread of diseases.",
	icon_state: "sterile",
	item_state: "sterile",
	w_class: 1,
	flags_inv: 128,
	flags_cover: 8,
	visor_flags_inv: 128,
	visor_flags_cover: 8,
	gas_transfer_coefficient: 0.9,
	permeability_coefficient: 0.01,
	armor: null,
	actions_types: null,
});

// miscellaneous.dm:31
rt.def("/obj/item/clothing/mask/surgical/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 25, "rad", 0, "fire", 0, "acid", 0]);

	this.actions_types = list(T("/datum/action/item_action/adjust"));
	return f.dot;
});

// miscellaneous.dm:35
rt.def("/obj/item/clothing/mask/surgical/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.adjustmask(user);
	return f.dot;
}, true);

rt.type(8568, "/obj/item/clothing/mask/pig", "/obj/item/clothing/mask", {
	voicechange: 0,
	name: "pig mask",
	desc: "A rubber pig mask.",
	icon_state: "pig",
	item_state: "pig",
	flags_inv: 896,
	w_class: 2,
	actions_types: null,
});

// miscellaneous.dm:55
rt.def("/obj/item/clothing/mask/pig/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/toggle_voice_box"));
	return f.dot;
});

// miscellaneous.dm:59
rt.def("/obj/item/clothing/mask/pig/proc/attack_self", function attack_self(f: Frame, user: Value) {
	this.voicechange = (!this.voicechange ? 1 : 0);
	let $0: any = user;
	to_chat($0, `<span class='notice'>You turn the voice box ${this.voicechange ? "on" : "off"}!</span>`);
	return f.dot;
});

// miscellaneous.dm:64
rt.def("/obj/item/clothing/mask/pig/proc/speechModification", function speechModification(f: Frame, message: Value) {
	if (this.voicechange) {
		message = pick("Oink!", "Squeeeeeeee!", "Oink Oink!");
	}
	return message;
});

rt.type(8569, "/obj/item/clothing/mask/spig", "/obj/item/clothing/mask", {
	voicechange: 1,
	name: "Pig face",
	desc: "It looks like a mask, but closer inspection reveals it's melded onto this persons face!",
	icon_state: "pig",
	item_state: "pig",
	flags_inv: 896,
	w_class: 2,
});

// miscellaneous.dm:78
rt.def("/obj/item/clothing/mask/spig/proc/speechModification", function speechModification(f: Frame, message: Value) {
	if (this.voicechange) {
		message = pick("Oink!", "Squeeeeeeee!", "Oink Oink!");
	}
	return message;
});

rt.type(8570, "/obj/item/clothing/mask/cowmask", "/obj/item/clothing/mask", {
	voicechange: 1,
	name: "Cowface",
	desc: "It looks like a mask, but closer inspection reveals it's melded onto this persons face!",
	icon: rt.rsc("icons/mob/mask.dmi"),
	icon_state: "cowmask",
	item_state: "cowmask",
	flags_inv: 896,
	w_class: 2,
});

// miscellaneous.dm:93
rt.def("/obj/item/clothing/mask/cowmask/proc/speechModification", function speechModification(f: Frame, message: Value) {
	if (this.voicechange) {
		message = pick("Moooooooo!", "Moo!", "Moooo!");
	}
	return message;
});

rt.type(8571, "/obj/item/clothing/mask/horsehead", "/obj/item/clothing/mask", {
	voicechange: 1,
	name: "horse head mask",
	desc: "A mask made of soft vinyl and latex, representing the head of a horse.",
	icon_state: "horsehead",
	item_state: "horsehead",
	flags_inv: 992,
	w_class: 2,
});

// miscellaneous.dm:107
rt.def("/obj/item/clothing/mask/horsehead/proc/speechModification", function speechModification(f: Frame, message: Value) {
	if (this.voicechange) {
		message = pick("NEEIIGGGHHHH!", "NEEEIIIIGHH!", "NEIIIGGHH!", "HAAWWWWW!", "HAAAWWW!");
	}
	return message;
});

rt.type(8580, "/obj/item/clothing/mask/bandana", "/obj/item/clothing/mask", {
	adjusted_flags: 64,
	name: "botany bandana",
	desc: "A fine bandana with nanotech lining and a hydroponics pattern.",
	w_class: 1,
	flags_cover: 8,
	flags_inv: 640,
	visor_flags_inv: 640,
	visor_flags_cover: 8,
	slot_flags: 32,
	icon_state: "bandbotany",
});

// miscellaneous.dm:173
rt.def("/obj/item/clothing/mask/bandana/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.adjustmask(user);
	return f.dot;
}, true);
