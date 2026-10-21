// From code/modules/clothing/masks/gasmask.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8545, "/obj/item/clothing/mask/gas/welding", "/obj/item/clothing/mask/gas", {
	name: "welding mask",
	desc: "A gas mask with built-in welding goggles and a face shield. Looks like a skull - clearly designed by a nerd.",
	icon_state: "weldingmask",
	materials: null,
	flash_protect: 2,
	tint: 2,
	armor: null,
	origin_tech: "materials=2;engineering=3",
	actions_types: null,
	flags_inv: 224,
	flags_cover: 2,
	visor_flags_inv: 64,
	visor_flags_cover: 2,
	resistance_flags: 2,
});

// /obj/item/clothing/mask/gas/welding/proc/<init>  (code/modules/clothing/masks/gasmask.dm:20)
rt.def("/obj/item/clothing/mask/gas/welding/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4000, "$glass", 2000]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 55]));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle")));
	return f.dot;
});

// /obj/item/clothing/mask/gas/welding/proc/attack_self  (code/modules/clothing/masks/gasmask.dm:33)  may sleep
rt.def("/obj/item/clothing/mask/gas/welding/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "weldingvisortoggle", live(user));
	return f.dot;
}, true);

rt.type(8546, "/obj/item/clothing/mask/gas/plaguedoctor", "/obj/item/clothing/mask/gas", {
	name: "plague doctor mask",
	desc: "A modernised version of the classic design, this mask will not only filter out toxins but it can also be connected to an air supply.",
	icon_state: "plaguedoctor",
	item_state: "gas_mask",
	armor: null,
});

// /obj/item/clothing/mask/gas/plaguedoctor/proc/<init>  (code/modules/clothing/masks/gasmask.dm:44)
rt.def("/obj/item/clothing/mask/gas/plaguedoctor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 2, "energy", 2, "bomb", 0, "bio", 75, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(8548, "/obj/item/clothing/mask/gas/clown_hat", "/obj/item/clothing/mask/gas", {
	flags: 8,
	name: "clown wig and mask",
	desc: "A true prankster's facial attire. A clown is incomplete without his wig and mask.",
	icon_state: "clown",
	item_state: "clown_hat",
	flags_cover: 2,
	resistance_flags: 4,
	actions_types: null,
	dog_fashion: rt.typePath("/datum/dog_fashion/head/clown"),
});

// /obj/item/clothing/mask/gas/clown_hat/proc/<init>  (code/modules/clothing/masks/gasmask.dm:60)
rt.def("/obj/item/clothing/mask/gas/clown_hat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/adjust")));
	return f.dot;
});

// /obj/item/clothing/mask/gas/clown_hat/proc/ui_action_click  (code/modules/clothing/masks/gasmask.dm:64)  may sleep
rt.def("/obj/item/clothing/mask/gas/clown_hat/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value) {
	let options: Value = null, choice: Value = null, X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, options, choice, X, A, $e];
	if ((!truthy((rt.istype(live(user), T("/mob")) ? 1 : 0)) || truthy((yield* g.callName(f, live(user), "incapacitated", []))))) {
		return live(f.dot);
	}
	rt.setAt((options = rt.list()), "True Form", "clown");
	rt.setAt(live(options), "The Feminist", "sexyclown");
	rt.setAt(live(options), "The Madman", "joker");
	rt.setAt(live(options), "The Rainbow Color", "rainbow");
	choice = (yield* g.op(f, "Prompt", [0], [null, "Morph Mask", "To what form do you wish to Morph this mask?", live(user), live(options)]));
	if (!(((truthy(live(f.src)) && truthy(live(choice))) && !truthy((yield* g.callName(f, live(user), "incapacitated", [])))) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(f.src)])), 1))) return f.dot;
	rt.setSv(f, "icon_state", rt.index(live(options), live(choice)));
	yield* g.callName(f, live(user), "update_inv_wear_mask", []);
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>Your Clown Mask has now morphed into ＀, all praise the Honkmother!</span>", [live(choice)])]);
	return 1;
}, true);

rt.type(8550, "/obj/item/clothing/mask/gas/mime", "/obj/item/clothing/mask/gas", {
	flags: 8,
	name: "mime mask",
	desc: "The traditional mime's mask. It has an eerie facial posture.",
	icon_state: "mime",
	item_state: "mime",
	flags_cover: 2,
	resistance_flags: 4,
	actions_types: null,
});

// /obj/item/clothing/mask/gas/mime/proc/<init>  (code/modules/clothing/masks/gasmask.dm:101)
rt.def("/obj/item/clothing/mask/gas/mime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/adjust")));
	return f.dot;
});

// /obj/item/clothing/mask/gas/mime/proc/ui_action_click  (code/modules/clothing/masks/gasmask.dm:105)  may sleep
rt.def("/obj/item/clothing/mask/gas/mime/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value) {
	let options: Value = null, choice: Value = null, X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, options, choice, X, A, $e];
	if ((!truthy((rt.istype(live(user), T("/mob")) ? 1 : 0)) || truthy((yield* g.callName(f, live(user), "incapacitated", []))))) {
		return live(f.dot);
	}
	rt.setAt((options = rt.list()), "Blanc", "mime");
	rt.setAt(live(options), "Triste", "sadmime");
	rt.setAt(live(options), "Effrayé", "scaredmime");
	rt.setAt(live(options), "Excité", "sexymime");
	choice = (yield* g.op(f, "Prompt", [0], [null, "Morph Mask", "To what form do you wish to Morph this mask?", live(user), live(options)]));
	if (!(((truthy(live(f.src)) && truthy(live(choice))) && !truthy((yield* g.callName(f, live(user), "incapacitated", [])))) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(f.src)])), 1))) return f.dot;
	rt.setSv(f, "icon_state", rt.index(live(options), live(choice)));
	yield* g.callName(f, live(user), "update_inv_wear_mask", []);
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>Your Mime Mask has now morphed into ＀!</span>", [live(choice)])]);
	return 1;
}, true);

rt.type(8557, "/obj/item/clothing/mask/gas/tiki_mask", "/obj/item/clothing/mask/gas", {
	name: "tiki mask",
	desc: "A creepy wooden mask. Surprisingly expressive for a poorly carved bit of wood.",
	icon_state: "tiki_eyebrow",
	item_state: "tiki_eyebrow",
	resistance_flags: 4,
	obj_integrity: 100,
	max_integrity: 100,
	actions_types: null,
	dog_fashion: null,
});

// /obj/item/clothing/mask/gas/tiki_mask/proc/<init>  (code/modules/clothing/masks/gasmask.dm:175)
rt.def("/obj/item/clothing/mask/gas/tiki_mask/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/adjust")));
	return f.dot;
});

// /obj/item/clothing/mask/gas/tiki_mask/proc/ui_action_click  (code/modules/clothing/masks/gasmask.dm:181)  may sleep
rt.def("/obj/item/clothing/mask/gas/tiki_mask/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value) {
	let M: Value = null, options: Value = null, choice: Value = null, X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, M, options, choice, X, A, $e];
	M = live(f.usr);
	rt.setAt((options = rt.list()), "Original Tiki", "tiki_eyebrow");
	rt.setAt(live(options), "Happy Tiki", "tiki_happy");
	rt.setAt(live(options), "Confused Tiki", "tiki_confused");
	rt.setAt(live(options), "Angry Tiki", "tiki_angry");
	choice = (yield* g.op(f, "Prompt", [0], [null, "Morph Mask", "To what form do you wish to change this mask?", live(M), live(options)]));
	if (!(((truthy(live(f.src)) && truthy(live(choice))) && !truthy(rt.fv(f, "stat", live(M)))) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(M), live(f.src)])), 1))) return f.dot;
	rt.setSv(f, "icon_state", rt.index(live(options), live(choice)));
	yield* g.callName(f, live(user), "update_inv_wear_mask", []);
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("The Tiki Mask has now changed into the ＀ Mask!", [live(choice)])]);
	return 1;
}, true);
