// From code/modules/clothing/head/helmet.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7932, "/obj/item/clothing/head/helmet", "/obj/item/clothing/head", {
	name: "helmet",
	desc: "Standard Security gear. Protects the head from impacts.",
	icon_state: "helmet",
	item_state: "helmet",
	armor: null,
	flags_inv: 32,
	cold_protection: 1,
	min_cold_protection_temperature: 160,
	heat_protection: 1,
	max_heat_protection_temperature: 600,
	strip_delay: 60,
	resistance_flags: 0,
	flags_cover: 4,
	dog_fashion: rt.typePath("/datum/dog_fashion/head/helmet"),
});

// /obj/item/clothing/head/helmet/proc/<init>  (code/modules/clothing/head/helmet.dm:6)
rt.def("/obj/item/clothing/head/helmet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 35, "bullet", 30, "laser", 30, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

// /obj/item/clothing/head/helmet/proc/Initialize  (code/modules/clothing/head/helmet.dm:20)  may sleep
rt.def("/obj/item/clothing/head/helmet/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		rt.setFv(f, "secondary_flags", live(f.src), rt.list());
	}
	rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "bang_protect", 1);
	return f.dot;
}, true);

rt.type(8004, "/obj/item/clothing/head/helmet/alt", "/obj/item/clothing/head/helmet", {
	name: "bulletproof helmet",
	desc: "A bulletproof combat helmet that excels in protecting the wearer against traditional projectile weaponry and explosives to a minor extent.",
	icon_state: "helmetalt",
	item_state: "helmetalt",
	armor: null,
	can_flashlight: 1,
	dog_fashion: null,
});

// /obj/item/clothing/head/helmet/alt/proc/<init>  (code/modules/clothing/head/helmet.dm:31)
rt.def("/obj/item/clothing/head/helmet/alt/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 15, "bullet", 60, "laser", 10, "energy", 10, "bomb", 40, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

rt.type(8007, "/obj/item/clothing/head/helmet/riot", "/obj/item/clothing/head/helmet", {
	name: "riot helmet",
	desc: "It's a helmet specifically designed to protect against close range attacks.",
	icon_state: "riot",
	item_state: "helmet",
	toggle_message: "You pull the visor down on",
	alt_toggle_message: "You push the visor up on",
	can_toggle: 1,
	armor: null,
	flags_inv: 160,
	strip_delay: 80,
	actions_types: null,
	visor_flags_inv: 128,
	toggle_cooldown: 0,
	flags_cover: 20,
	visor_flags_cover: 20,
	dog_fashion: null,
});

// /obj/item/clothing/head/helmet/riot/proc/<init>  (code/modules/clothing/head/helmet.dm:52)
rt.def("/obj/item/clothing/head/helmet/riot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 45, "bullet", 15, "laser", 5, "energy", 5, "bomb", 5, "bio", 2, "rad", 0, "fire", 50, "acid", 50]));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle")));
	return f.dot;
});

// /obj/item/clothing/head/helmet/proc/attack_self  (code/modules/clothing/head/helmet.dm:63)  may sleep
rt.def("/obj/item/clothing/head/helmet/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let C: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, C, $0, $1];
	if (!(truthy(rt.sv(f, "can_toggle")) && !truthy((yield* g.callName(f, live(user), "incapacitated", []))))) return f.dot;
	if (!rt.gt(rt.worldTime(f), add(rt.sv(f, "cooldown"), rt.sv(f, "toggle_cooldown")))) return f.dot;
	rt.setSv(f, "cooldown", rt.worldTime(f));
	rt.setSv(f, "up", (!truthy(rt.sv(f, "up")) ? 1 : 0));
	(rt.modSrcVar(f, "flags", rt.sv(f, "visor_flags"), rt.bitXor));
	(rt.modSrcVar(f, "flags_inv", rt.sv(f, "visor_flags_inv"), rt.bitXor));
	(rt.modSrcVar(f, "flags_cover", rt.sv(f, "visor_flags_cover"), rt.bitXor));
	$0 = rt.initial(f, live(f.src), "icon_state");
	if (truthy(rt.sv(f, "up"))) {
		$1 = "up";
	} else {
		$1 = "";
	}
	rt.setSv(f, "icon_state", fmt("＀＀", [$0, $1]));
	$0 = live(user);
	if (truthy(rt.sv(f, "up"))) {
		$1 = rt.sv(f, "alt_toggle_message");
	} else {
		$1 = rt.sv(f, "toggle_message");
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("＀ ％！", [$1, live(f.src)])]);
	yield* g.callName(f, live(user), "update_inv_head", []);
	if (truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, (C = live(user)), "head_update", [null, live(f.src), "forced", 1], rt.Args.Named);
	}
	if (!truthy(rt.sv(f, "active_sound"))) return f.dot;
	while (truthy(rt.sv(f, "up"))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), fmt("＀", [rt.sv(f, "active_sound")]), 100, 0, 4]);
		yield* g.call(f, P("/proc/sleep"), null, [15]);
	}
	return f.dot;
}, true);

rt.type(8008, "/obj/item/clothing/head/helmet/justice", "/obj/item/clothing/head/helmet", {
	name: "helmet of justice",
	desc: "WEEEEOOO. WEEEEEOOO. WEEEEOOOO.",
	icon_state: "justice",
	toggle_message: "You turn off the lights on",
	alt_toggle_message: "You turn on the lights on",
	actions_types: null,
	can_toggle: 1,
	toggle_cooldown: 20,
	active_sound: rt.rsc("sound/items/weeoo1.ogg"),
	dog_fashion: null,
});

// /obj/item/clothing/head/helmet/justice/proc/<init>  (code/modules/clothing/head/helmet.dm:89)
rt.def("/obj/item/clothing/head/helmet/justice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_helmet_light")));
	return f.dot;
});

rt.type(8010, "/obj/item/clothing/head/helmet/swat", "/obj/item/clothing/head/helmet", {
	flags: 1,
	name: "１SWAT helmet",
	desc: "An extremely robust, space-worthy helmet in a nefarious red and black stripe pattern.",
	icon_state: "swatsyndie",
	item_state: "swatsyndie",
	armor: null,
	cold_protection: 1,
	min_cold_protection_temperature: 2,
	heat_protection: 1,
	max_heat_protection_temperature: 1500,
	strip_delay: 80,
	dog_fashion: null,
});

// /obj/item/clothing/head/helmet/swat/proc/<init>  (code/modules/clothing/head/helmet.dm:107)
rt.def("/obj/item/clothing/head/helmet/swat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 30, "laser", 30, "energy", 30, "bomb", 50, "bio", 90, "rad", 20, "fire", 50, "acid", 50]));
	return f.dot;
});

rt.type(8012, "/obj/item/clothing/head/helmet/thunderdome", "/obj/item/clothing/head/helmet", {
	name: "１Thunderdome helmet",
	desc: "<i>'Let the battle commence!'</i>",
	flags_inv: 288,
	icon_state: "thunderdome",
	item_state: "thunderdome",
	armor: null,
	cold_protection: 1,
	min_cold_protection_temperature: 2,
	heat_protection: 1,
	max_heat_protection_temperature: 1500,
	strip_delay: 80,
	dog_fashion: null,
});

// /obj/item/clothing/head/helmet/thunderdome/proc/<init>  (code/modules/clothing/head/helmet.dm:128)
rt.def("/obj/item/clothing/head/helmet/thunderdome/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 30, "laser", 25, "energy", 10, "bomb", 25, "bio", 10, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

rt.type(8013, "/obj/item/clothing/head/helmet/roman", "/obj/item/clothing/head/helmet", {
	name: "roman helmet",
	desc: "An ancient helmet made of bronze and leather.",
	flags_inv: 288,
	flags_cover: 4,
	armor: null,
	resistance_flags: 2,
	icon_state: "roman",
	item_state: "roman",
	strip_delay: 100,
	dog_fashion: null,
});

// /obj/item/clothing/head/helmet/roman/proc/<init>  (code/modules/clothing/head/helmet.dm:141)
rt.def("/obj/item/clothing/head/helmet/roman/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 0, "laser", 25, "energy", 10, "bomb", 10, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

rt.type(8016, "/obj/item/clothing/head/helmet/redtaghelm", "/obj/item/clothing/head/helmet", {
	name: "red laser tag helmet",
	desc: "They have chosen their own end.",
	icon_state: "redtaghelm",
	flags_cover: 4,
	item_state: "redtaghelm",
	armor: null,
	dog_fashion: null,
});

// /obj/item/clothing/head/helmet/redtaghelm/proc/<init>  (code/modules/clothing/head/helmet.dm:169)
rt.def("/obj/item/clothing/head/helmet/redtaghelm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 15, "bullet", 10, "laser", 20, "energy", 10, "bomb", 20, "bio", 0, "rad", 0, "fire", 0, "acid", 50]));
	return f.dot;
});

rt.type(8017, "/obj/item/clothing/head/helmet/bluetaghelm", "/obj/item/clothing/head/helmet", {
	name: "blue laser tag helmet",
	desc: "They'll need more men.",
	icon_state: "bluetaghelm",
	flags_cover: 4,
	item_state: "bluetaghelm",
	armor: null,
	dog_fashion: null,
});

// /obj/item/clothing/head/helmet/bluetaghelm/proc/<init>  (code/modules/clothing/head/helmet.dm:179)
rt.def("/obj/item/clothing/head/helmet/bluetaghelm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 15, "bullet", 10, "laser", 20, "energy", 10, "bomb", 20, "bio", 0, "rad", 0, "fire", 0, "acid", 50]));
	return f.dot;
});

rt.type(8018, "/obj/item/clothing/head/helmet/knight", "/obj/item/clothing/head/helmet", {
	name: "medieval helmet",
	desc: "A classic metal helmet.",
	icon_state: "knight_green",
	item_state: "knight_green",
	armor: null,
	flags_inv: 496,
	flags_cover: 20,
	strip_delay: 80,
	dog_fashion: null,
});

// /obj/item/clothing/head/helmet/knight/proc/<init>  (code/modules/clothing/head/helmet.dm:188)
rt.def("/obj/item/clothing/head/helmet/knight/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 41, "bullet", 15, "laser", 5, "energy", 5, "bomb", 5, "bio", 2, "rad", 0, "fire", 0, "acid", 50]));
	return f.dot;
});

// /obj/item/clothing/head/helmet/knight/proc/Initialize  (code/modules/clothing/head/helmet.dm:195)  may sleep
rt.def("/obj/item/clothing/head/helmet/knight/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) return f.dot;
	rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "bang_protect", null);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(8023, "/obj/item/clothing/head/helmet/skull", "/obj/item/clothing/head/helmet", {
	name: "skull helmet",
	desc: "An intimidating tribal helmet, it doesn't look very comfortable.",
	flags_inv: 240,
	flags_cover: 4,
	armor: null,
	icon_state: "skull",
	item_state: "skull",
	strip_delay: 100,
});

// /obj/item/clothing/head/helmet/skull/proc/<init>  (code/modules/clothing/head/helmet.dm:222)
rt.def("/obj/item/clothing/head/helmet/skull/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 25, "laser", 25, "energy", 10, "bomb", 10, "bio", 5, "rad", 20, "fire", 40, "acid", 20]));
	return f.dot;
});

// /obj/item/clothing/head/helmet/proc/update_icon  (code/modules/clothing/head/helmet.dm:230)  may sleep
rt.def("/obj/item/clothing/head/helmet/proc/update_icon", function* update_icon(f: Frame) {
	let state: Value = null, H: Value = null;
	f.vars = () => [state, H];
	state = fmt("＀", [rt.initial(f, live(f.src), "icon_state")]);
	if (truthy(rt.sv(f, "F"))) {
		if (truthy(rt.fv(f, "on", rt.sv(f, "F")))) {
			state = rt.modify(live(state), "-flight-on", add);
		} else {
			state = rt.modify(live(state), "-flight", add);
		}
	}
	rt.setSv(f, "icon_state", live(state));
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (H = rt.sv(f, "loc")), "update_inv_head", []);
	return f.dot;
}, true);

// /obj/item/clothing/head/helmet/proc/ui_action_click  (code/modules/clothing/head/helmet.dm:244)  may sleep
rt.def("/obj/item/clothing/head/helmet/proc/ui_action_click", function* ui_action_click(f: Frame) {
	if (truthy((rt.istype(live(f.args[1]), T("/datum/action/item_action/toggle_helmet_flashlight")) ? 1 : 0))) {
		yield* g.srcCall(f, "toggle_helmlight");
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user", "action"] });

// /obj/item/clothing/head/helmet/proc/attackby  (code/modules/clothing/head/helmet.dm:250)  may sleep
rt.def("/obj/item/clothing/head/helmet/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null, A: Value = null, THL: Value = null;
	let $e: any;
	f.vars = () => [S, A, THL, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/flashlight/seclite")) ? 1 : 0))) {
		S = live(f.args[0]);
		if (truthy(rt.sv(f, "can_flashlight"))) {
			if (!truthy(rt.sv(f, "F"))) {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(S), live(f.src)])))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You click ＀ into place on ＀.</span>", [live(S), live(f.src)])]);
				if (truthy(rt.fv(f, "on", live(S)))) {
					yield* g.srcCall(f, "set_light", 0);
				}
				rt.setSv(f, "F", live(S));
				yield* g.srcCall(f, "update_icon");
				yield* g.srcCall(f, "update_helmlight", live(f.args[1]));
				rt.modSrcVar(f, "verbs", P("/obj/item/clothing/head/helmet/proc/toggle_helmlight"), add);
				A = (yield* g.new_(f, T("/datum/action/item_action/toggle_helmet_flashlight"), [live(f.src)]));
				if (isEqual(rt.sv(f, "loc"), live(f.args[1]))) {
					yield* g.callName(f, live(A), "Grant", [live(f.args[1])]);
				}
			}
		}
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "F"))) {
			S = null;
			rt.forList(f, 0, live(f.src), T("/obj/item/device/flashlight/seclite"));
			while (($e = rt.next(f, 0)) !== undefined) {
				S = $e;
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You unscrew the seclite from ＀.</span>", [live(f.src)])]);
				rt.setSv(f, "F", null);
				rt.setFv(f, "loc", live(S), rt.getStep(f, live(f.args[1]), 0));
				yield* g.srcCall(f, "update_helmlight", live(f.args[1]));
				yield* g.callName(f, live(S), "update_brightness", [live(f.args[1])]);
				yield* g.srcCall(f, "update_icon");
				yield* g.callName(f, live(f.usr), "update_inv_head", []);
				(rt.modSrcVar(f, "verbs", P("/obj/item/clothing/head/helmet/proc/toggle_helmlight"), subtract));
			}
			rt.endFor(f, 0);
			THL = null;
			rt.forList(f, 0, rt.sv(f, "actions"), T("/datum/action/item_action/toggle_helmet_flashlight"));
			while (($e = rt.next(f, 0)) !== undefined) {
				THL = $e;
				yield* g.call(f, P("/proc/qdel"), null, [live(THL)]);
			}
			rt.endFor(f, 0);
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/clothing/head/helmet/proc/toggle_helmlight  (code/modules/clothing/head/helmet.dm:290)  may sleep
rt.def("/obj/item/clothing/head/helmet/proc/toggle_helmlight", function* toggle_helmlight(f: Frame) {
	let user: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, $0, $1];
	if (!truthy(rt.sv(f, "F"))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, (user = live(f.usr)), "incapacitated", [])))) {
		return live(f.dot);
	}
	rt.setFv(f, "on", rt.sv(f, "F"), (!truthy(rt.fv(f, "on", rt.sv(f, "F"))) ? 1 : 0));
	$0 = live(user);
	if (truthy(rt.fv(f, "on", rt.sv(f, "F")))) {
		$1 = "on";
	} else {
		$1 = "off";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You toggle the helmetlight ＀.</span>", [$1])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/empty.ogg"), 100, 1]);
	yield* g.srcCall(f, "update_helmlight", live(user));
	return f.dot;
}, true, { verb: { name: "Toggle Helmetlight", category: "Object", desc: "Click to toggle your helmet's attached flashlight." } });

// /obj/item/clothing/head/helmet/proc/update_helmlight  (code/modules/clothing/head/helmet.dm:304)  may sleep
rt.def("/obj/item/clothing/head/helmet/proc/update_helmlight", function* update_helmlight(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, X, A, $e];
	if (live(user) === null) {
		user = null;
	}
	if (truthy(rt.sv(f, "F"))) {
		if (truthy(rt.fv(f, "on", rt.sv(f, "F")))) {
			yield* g.srcCall(f, "set_light", rt.fv(f, "brightness_on", rt.sv(f, "F")));
		} else {
			yield* g.srcCall(f, "set_light", 0);
		}
		yield* g.srcCall(f, "update_icon");
	} else {
		yield* g.srcCall(f, "set_light", 0);
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
