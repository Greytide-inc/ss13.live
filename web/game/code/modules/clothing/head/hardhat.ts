// From code/modules/clothing/head/hardhat.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8102, "/obj/item/clothing/head/hardhat", "/obj/item/clothing/head", {
	brightness_on: 4,
	on: 0,
	name: "hard hat",
	desc: "A piece of headgear used in dangerous working conditions to protect the head. Comes with a built-in flashlight.",
	icon_state: "hardhat0_yellow",
	item_state: "hardhat0_yellow",
	item_color: "yellow",
	armor: null,
	flags_inv: 0,
	actions_types: null,
	resistance_flags: 2,
	dog_fashion: rt.typePath("/datum/dog_fashion/head"),
});

// /obj/item/clothing/head/hardhat/proc/<init>  (code/modules/clothing/head/hardhat.dm:9)
rt.def("/obj/item/clothing/head/hardhat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 15, "bullet", 5, "laser", 20, "energy", 10, "bomb", 20, "bio", 10, "rad", 20, "fire", 100, "acid", 50]));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_helmet_light")));
	return f.dot;
});

// /obj/item/clothing/head/hardhat/proc/attack_self  (code/modules/clothing/head/hardhat.dm:17)  may sleep
rt.def("/obj/item/clothing/head/hardhat/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, X, A, $e];
	rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	rt.setSv(f, "icon_state", fmt("hardhat＀_＀", [rt.sv(f, "on"), rt.sv(f, "item_color")]));
	rt.setSv(f, "item_state", fmt("hardhat＀_＀", [rt.sv(f, "on"), rt.sv(f, "item_color")]));
	yield* g.callName(f, live(user), "update_inv_head", []);
	if (truthy(rt.sv(f, "on"))) {
		yield* g.srcCall(f, "turn_on", live(user));
	} else {
		yield* g.srcCall(f, "turn_off", live(user));
	}
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/clothing/head/hardhat/proc/turn_on  (code/modules/clothing/head/hardhat.dm:31)
rt.def("/obj/item/clothing/head/hardhat/proc/turn_on", function turn_on(f: Frame, user: Value) {
	rt.callSrc(f, "set_light", [rt.sv(f, "brightness_on")]);
	return f.dot;
});

// /obj/item/clothing/head/hardhat/proc/turn_off  (code/modules/clothing/head/hardhat.dm:34)
rt.def("/obj/item/clothing/head/hardhat/proc/turn_off", function turn_off(f: Frame, user: Value) {
	rt.callSrc(f, "set_light", [0]);
	return f.dot;
});
