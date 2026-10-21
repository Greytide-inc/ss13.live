// From code/modules/clothing/masks/miscellaneous.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/clothing/mask/muzzle/proc/attack_paw  (code/modules/clothing/masks/miscellaneous.dm:12)  may sleep
rt.def("/obj/item/clothing/mask/muzzle/proc/attack_paw", function* attack_paw(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		C = live(f.args[0]);
		if (isEqual(live(f.src), rt.fv(f, "wear_mask", live(C)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You need help taking this off!</span>"]);
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

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

// /obj/item/clothing/mask/surgical/proc/<init>  (code/modules/clothing/masks/miscellaneous.dm:31)
rt.def("/obj/item/clothing/mask/surgical/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 25, "rad", 0, "fire", 0, "acid", 0]));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/adjust")));
	return f.dot;
});

// /obj/item/clothing/mask/surgical/proc/attack_self  (code/modules/clothing/masks/miscellaneous.dm:35)  may sleep
rt.def("/obj/item/clothing/mask/surgical/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "adjustmask", live(user));
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

// /obj/item/clothing/mask/pig/proc/<init>  (code/modules/clothing/masks/miscellaneous.dm:55)
rt.def("/obj/item/clothing/mask/pig/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_voice_box")));
	return f.dot;
});

// /obj/item/clothing/mask/pig/proc/attack_self  (code/modules/clothing/masks/miscellaneous.dm:59)
rt.def("/obj/item/clothing/mask/pig/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.setSv(f, "voicechange", (!truthy(rt.sv(f, "voicechange")) ? 1 : 0));
	$0 = live(user);
	if (truthy(rt.sv(f, "voicechange"))) {
		$1 = "on";
	} else {
		$1 = "off";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You turn the voice box ＀!</span>", [$1])]);
	return f.dot;
});

// /obj/item/clothing/mask/pig/proc/speechModification  (code/modules/clothing/masks/miscellaneous.dm:64)
rt.def("/obj/item/clothing/mask/pig/proc/speechModification", function speechModification(f: Frame, message: Value) {
	f.vars = () => [message];
	if (truthy(rt.sv(f, "voicechange"))) {
		message = rt.op(f, "PickUnweighted", [3], ["Oink!", "Squeeeeeeee!", "Oink Oink!"]);
	}
	return live(message);
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

// /obj/item/clothing/mask/spig/proc/speechModification  (code/modules/clothing/masks/miscellaneous.dm:78)
rt.def("/obj/item/clothing/mask/spig/proc/speechModification", function speechModification(f: Frame, message: Value) {
	f.vars = () => [message];
	if (truthy(rt.sv(f, "voicechange"))) {
		message = rt.op(f, "PickUnweighted", [3], ["Oink!", "Squeeeeeeee!", "Oink Oink!"]);
	}
	return live(message);
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

// /obj/item/clothing/mask/cowmask/proc/speechModification  (code/modules/clothing/masks/miscellaneous.dm:93)
rt.def("/obj/item/clothing/mask/cowmask/proc/speechModification", function speechModification(f: Frame, message: Value) {
	f.vars = () => [message];
	if (truthy(rt.sv(f, "voicechange"))) {
		message = rt.op(f, "PickUnweighted", [3], ["Moooooooo!", "Moo!", "Moooo!"]);
	}
	return live(message);
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

// /obj/item/clothing/mask/horsehead/proc/speechModification  (code/modules/clothing/masks/miscellaneous.dm:107)
rt.def("/obj/item/clothing/mask/horsehead/proc/speechModification", function speechModification(f: Frame, message: Value) {
	f.vars = () => [message];
	if (truthy(rt.sv(f, "voicechange"))) {
		message = rt.op(f, "PickUnweighted", [5], ["NEEIIGGGHHHH!", "NEEEIIIIGHH!", "NEIIIGGHH!", "HAAWWWWW!", "HAAAWWW!"]);
	}
	return live(message);
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

// /obj/item/clothing/mask/bandana/proc/attack_self  (code/modules/clothing/masks/miscellaneous.dm:173)  may sleep
rt.def("/obj/item/clothing/mask/bandana/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "adjustmask", live(user));
	return f.dot;
}, true);
