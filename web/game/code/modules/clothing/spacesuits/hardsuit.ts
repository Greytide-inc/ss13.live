// From code/modules/clothing/spacesuits/hardsuit.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7935, "/obj/item/clothing/head/helmet/space/hardsuit", "/obj/item/clothing/head/helmet/space", {
	basestate: "hardsuit",
	brightness_on: 4,
	on: 0,
	suit: null,
	name: "hardsuit helmet",
	desc: "A special helmet designed for work in a hazardous, low-pressure environment. Has radiation shielding.",
	icon_state: "hardsuit0-engineering",
	item_state: "eng_helm",
	obj_integrity: 300,
	max_integrity: 300,
	armor: null,
	item_color: "engineering",
	actions_types: null,
});

// /obj/item/clothing/head/helmet/space/hardsuit/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:9)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 75, "fire", 50, "acid", 75]));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_helmet_light")));
	return f.dot;
});

// /obj/item/clothing/head/helmet/space/hardsuit/proc/attack_self  (code/modules/clothing/spacesuits/hardsuit.dm:19)  may sleep
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, X, A, $e];
	rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	rt.setSv(f, "icon_state", fmt("＀＀-＀", [rt.sv(f, "basestate"), rt.sv(f, "on"), rt.sv(f, "item_color")]));
	yield* g.callName(f, live(user), "update_inv_head", []);
	if (truthy(rt.sv(f, "on"))) {
		yield* g.srcCall(f, "set_light", rt.sv(f, "brightness_on"));
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

// /obj/item/clothing/head/helmet/space/hardsuit/proc/dropped  (code/modules/clothing/spacesuits/hardsuit.dm:32)  may sleep
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "suit"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "suit"), "RemoveHelmet", []);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/head/helmet/space/hardsuit/proc/item_action_slot_check  (code/modules/clothing/spacesuits/hardsuit.dm:37)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value) {
	if (!isEqual(live(slot), 11)) return f.dot;
	return 1;
});

// /obj/item/clothing/head/helmet/space/hardsuit/proc/equipped  (code/modules/clothing/spacesuits/hardsuit.dm:41)  may sleep
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/proc/equipped", function* equipped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (isEqual(live(f.args[1]), 11)) return f.dot;
	if (truthy(rt.sv(f, "suit"))) {
		yield* g.callName(f, rt.sv(f, "suit"), "RemoveHelmet", []);
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/clothing/head/helmet/space/hardsuit/proc/display_visor_message  (code/modules/clothing/spacesuits/hardsuit.dm:49)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/proc/display_visor_message", function display_visor_message(f: Frame, msg: Value) {
	let wearer: Value = null;
	f.vars = () => [wearer];
	wearer = rt.sv(f, "loc");
	if (!(truthy(live(msg)) && truthy((rt.istype(live(wearer), T("/mob/living/carbon/human")) ? 1 : 0)))) return f.dot;
	rt.callName(f, live(wearer), "show_message", [fmt("＀<b><span class='robot'>＀</span></b>", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(msg)]), 1]);
	return f.dot;
});

// /obj/item/clothing/head/helmet/space/hardsuit/proc/rad_act  (code/modules/clothing/spacesuits/hardsuit.dm:54)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/proc/rad_act", function rad_act(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "display_visor_message", [fmt("Radiation pulse detected! Magnitude: <span class='green'>＀</span> RADs.", [live(f.args[0])])]);
	return f.dot;
}, false, { args: ["severity"] });

// /obj/item/clothing/head/helmet/space/hardsuit/proc/emp_act  (code/modules/clothing/spacesuits/hardsuit.dm:58)  may sleep
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/proc/emp_act", function* emp_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (rt.gt(live(f.args[0]), 1)) {
		$0 = "Light";
	} else {
		$0 = "Strong";
	}
	yield* g.srcCall(f, "display_visor_message", fmt("＀ electromagnetic pulse detected!", [$0]));
	return f.dot;
}, true, { args: ["severity"] });

rt.type(7702, "/obj/item/clothing/suit/space/hardsuit", "/obj/item/clothing/suit/space", {
	helmet: null,
	jetpack: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit"),
	name: "hardsuit",
	desc: "A special suit that protects against hazardous, low pressure environments. Has radiation shielding.",
	icon_state: "hardsuit-engineering",
	item_state: "eng_hardsuit",
	obj_integrity: 300,
	max_integrity: 300,
	armor: null,
	allowed: null,
	siemens_coefficient: 0,
	actions_types: null,
});

// /obj/item/clothing/suit/space/hardsuit/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:69)
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 75, "fire", 50, "acid", 75]));
	$0 = $0;
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/device/t_scanner"), T("/obj/item/weapon/construction/rcd"), T("/obj/item/weapon/pipe_dispenser")));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_helmet")));
	return f.dot;
});

// /obj/item/clothing/suit/space/hardsuit/proc/New  (code/modules/clothing/spacesuits/hardsuit.dm:79)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/New", function* New(f: Frame) {
	if ((truthy(rt.sv(f, "jetpack")) && truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.sv(f, "jetpack")]))))) {
		rt.setSv(f, "jetpack", (yield* g.new_(f, rt.sv(f, "jetpack"), [live(f.src)])));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/proc/attack_self  (code/modules/clothing/spacesuits/hardsuit.dm:84)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/attack_self", function* attack_self(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "changeNext_move", [8]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/suit/space/hardsuit/proc/attackby  (code/modules/clothing/spacesuits/hardsuit.dm:88)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	f.vars = () => [I, user, params];
	if (truthy((rt.istype(live(I), T("/obj/item/weapon/tank/jetpack/suit")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "jetpack"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ already has a jetpack installed.</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (isEqual(live(f.src), (yield* g.callName(f, live(user), "get_item_by_slot", [13])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You cannot install the upgrade to ＀ while wearing it.</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(I), live(f.src)])))) {
			rt.setSv(f, "jetpack", live(I));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You successfully install the jetpack into ＀.</span>", [live(f.src)])]);
		}
	} else {
		if (!truthy((rt.istype(live(I), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) return f.dot;
		if (!truthy(rt.sv(f, "jetpack"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ has no jetpack installed.</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (isEqual(live(f.src), (yield* g.callName(f, live(user), "get_item_by_slot", [13])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You cannot remove the jetpack from ＀ while wearing it.</span>", [live(f.src)])]);
			return live(f.dot);
		}
		yield* g.callName(f, rt.sv(f, "jetpack"), "turn_off", []);
		rt.setFv(f, "loc", rt.sv(f, "jetpack"), rt.getStep(f, live(f.src), 0));
		rt.setSv(f, "jetpack", null);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You successfully remove the jetpack from ＀.</span>", [live(f.src)])]);
	}
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/proc/equipped  (code/modules/clothing/spacesuits/hardsuit.dm:115)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/equipped", function* equipped(f: Frame) {
	let X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [X, A, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "jetpack"))) return f.dot;
	if (!isEqual(live(f.args[1]), 13)) return f.dot;
	X = null;
	rt.forList(f, 0, rt.fv(f, "actions", rt.sv(f, "jetpack")));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "Grant", [live(f.args[0])]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/clothing/suit/space/hardsuit/proc/dropped  (code/modules/clothing/spacesuits/hardsuit.dm:123)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/dropped", function* dropped(f: Frame) {
	let X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [X, A, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "jetpack"))) return f.dot;
	X = null;
	rt.forList(f, 0, rt.fv(f, "actions", rt.sv(f, "jetpack")));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "Remove", [live(f.args[0])]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/suit/space/hardsuit/proc/item_action_slot_check  (code/modules/clothing/spacesuits/hardsuit.dm:130)
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value) {
	if (!isEqual(live(slot), 13)) return f.dot;
	return 1;
});

rt.type(7938, "/obj/item/clothing/head/helmet/space/hardsuit/engine", "/obj/item/clothing/head/helmet/space/hardsuit", {
	name: "engineering hardsuit helmet",
	desc: "A special helmet designed for work in a hazardous, low-pressure environment. Has radiation shielding.",
	icon_state: "hardsuit0-engineering",
	item_state: "eng_helm",
	armor: null,
	item_color: "engineering",
	resistance_flags: 2,
});

// /obj/item/clothing/head/helmet/space/hardsuit/engine/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:139)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/engine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 75, "fire", 100, "acid", 75]));
	return f.dot;
});

rt.type(7706, "/obj/item/clothing/suit/space/hardsuit/engine", "/obj/item/clothing/suit/space/hardsuit", {
	name: "engineering hardsuit",
	desc: "A special suit that protects against hazardous, low pressure environments. Has radiation shielding.",
	icon_state: "hardsuit-engineering",
	item_state: "eng_hardsuit",
	armor: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/engine"),
	resistance_flags: 2,
});

// /obj/item/clothing/suit/space/hardsuit/engine/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:148)
rt.def("/obj/item/clothing/suit/space/hardsuit/engine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 75, "fire", 100, "acid", 75]));
	return f.dot;
});

rt.type(7939, "/obj/item/clothing/head/helmet/space/hardsuit/engine/atmos", "/obj/item/clothing/head/helmet/space/hardsuit/engine", {
	name: "atmospherics hardsuit helmet",
	desc: "A special helmet designed for work in a hazardous, low-pressure environment. Has thermal shielding.",
	icon_state: "hardsuit0-atmospherics",
	item_state: "atmo_helm",
	item_color: "atmospherics",
	armor: null,
	heat_protection: 1,
	max_heat_protection_temperature: 35000,
});

// /obj/item/clothing/head/helmet/space/hardsuit/engine/atmos/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:159)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/engine/atmos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 0, "fire", 100, "acid", 75]));
	return f.dot;
});

rt.type(7707, "/obj/item/clothing/suit/space/hardsuit/engine/atmos", "/obj/item/clothing/suit/space/hardsuit/engine", {
	name: "atmospherics hardsuit",
	desc: "A special suit that protects against hazardous, low pressure environments. Has thermal shielding.",
	icon_state: "hardsuit-atmospherics",
	item_state: "atmo_hardsuit",
	armor: null,
	heat_protection: 2046,
	max_heat_protection_temperature: 35000,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/engine/atmos"),
});

// /obj/item/clothing/suit/space/hardsuit/engine/atmos/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:168)
rt.def("/obj/item/clothing/suit/space/hardsuit/engine/atmos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 0, "fire", 100, "acid", 75]));
	return f.dot;
});

rt.type(7940, "/obj/item/clothing/head/helmet/space/hardsuit/engine/elite", "/obj/item/clothing/head/helmet/space/hardsuit/engine", {
	name: "advanced hardsuit helmet",
	desc: "An advanced helmet designed for work in a hazardous, low pressure environment. Shines with a high polish.",
	icon_state: "hardsuit0-white",
	item_state: "ce_helm",
	item_color: "white",
	armor: null,
	heat_protection: 1,
	max_heat_protection_temperature: 35000,
});

// /obj/item/clothing/head/helmet/space/hardsuit/engine/elite/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:181)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/engine/elite/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 5, "laser", 10, "energy", 5, "bomb", 50, "bio", 100, "rad", 90, "fire", 100, "acid", 90]));
	return f.dot;
});

rt.type(7708, "/obj/item/clothing/suit/space/hardsuit/engine/elite", "/obj/item/clothing/suit/space/hardsuit/engine", {
	jetpack: rt.typePath("/obj/item/weapon/tank/jetpack/suit"),
	icon_state: "hardsuit-white",
	name: "advanced hardsuit",
	desc: "An advanced suit that protects against hazardous, low pressure environments. Shines with a high polish.",
	item_state: "ce_hardsuit",
	armor: null,
	heat_protection: 2046,
	max_heat_protection_temperature: 35000,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/engine/elite"),
});

// /obj/item/clothing/suit/space/hardsuit/engine/elite/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:190)
rt.def("/obj/item/clothing/suit/space/hardsuit/engine/elite/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 5, "laser", 10, "energy", 5, "bomb", 50, "bio", 100, "rad", 90, "fire", 100, "acid", 90]));
	return f.dot;
});

rt.type(7941, "/obj/item/clothing/head/helmet/space/hardsuit/mining", "/obj/item/clothing/head/helmet/space/hardsuit", {
	brightness_on: 7,
	name: "mining hardsuit helmet",
	desc: "A special helmet designed for work in a hazardous, low pressure environment. Has reinforced plating for wildlife encounters and dual floodlights.",
	icon_state: "hardsuit0-mining",
	item_state: "mining_helm",
	item_color: "mining",
	max_heat_protection_temperature: 30000,
	resistance_flags: 2,
	heat_protection: 414,
	armor: null,
	allowed: null,
});

// /obj/item/clothing/head/helmet/space/hardsuit/mining/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:206)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/mining/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 50, "bio", 100, "rad", 50, "fire", 50, "acid", 75]));
	$0 = $0;
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/resonator"), T("/obj/item/device/mining_scanner"), T("/obj/item/device/t_scanner/adv_mining_scanner"), T("/obj/item/weapon/gun/energy/kinetic_accelerator")));
	return f.dot;
});

rt.type(7709, "/obj/item/clothing/suit/space/hardsuit/mining", "/obj/item/clothing/suit/space/hardsuit", {
	icon_state: "hardsuit-mining",
	name: "mining hardsuit",
	desc: "A special suit that protects against hazardous, low pressure environments. Has reinforced plating for wildlife encounters.",
	item_state: "mining_hardsuit",
	max_heat_protection_temperature: 30000,
	resistance_flags: 2,
	armor: null,
	allowed: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/mining"),
});

// /obj/item/clothing/suit/space/hardsuit/mining/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:218)
rt.def("/obj/item/clothing/suit/space/hardsuit/mining/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 50, "bio", 100, "rad", 50, "fire", 50, "acid", 75]));
	$0 = $0;
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/storage/bag/ore"), T("/obj/item/weapon/pickaxe")));
	return f.dot;
});

rt.type(7942, "/obj/item/clothing/head/helmet/space/hardsuit/syndi", "/obj/item/clothing/head/helmet/space/hardsuit", {
	linkedsuit: null,
	on: 1,
	name: "blood-red hardsuit helmet",
	desc: "A dual-mode advanced helmet designed for work in special operations. It is in EVA mode. Property of Gorlex Marauders.",
	alt_desc: "A dual-mode advanced helmet designed for work in special operations. It is in combat mode. Property of Gorlex Marauders.",
	icon_state: "hardsuit1-syndi",
	item_state: "syndie_helm",
	item_color: "syndi",
	armor: null,
	actions_types: null,
	visor_flags_inv: 720,
	visor_flags: 1,
});

// /obj/item/clothing/head/helmet/space/hardsuit/syndi/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:230)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/syndi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 50, "laser", 30, "energy", 15, "bomb", 35, "bio", 100, "rad", 50, "fire", 50, "acid", 90]));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_helmet_mode")));
	return f.dot;
});

// /obj/item/clothing/head/helmet/space/hardsuit/syndi/proc/update_icon  (code/modules/clothing/spacesuits/hardsuit.dm:238)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/syndi/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("hardsuit＀-＀", [rt.sv(f, "on"), rt.sv(f, "item_color")]));
	return f.dot;
});

// /obj/item/clothing/head/helmet/space/hardsuit/syndi/proc/New  (code/modules/clothing/spacesuits/hardsuit.dm:241)  may sleep
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/syndi/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/clothing/suit/space/hardsuit/syndi")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "linkedsuit", rt.sv(f, "loc"));
	return f.dot;
}, true);

// /obj/item/clothing/head/helmet/space/hardsuit/syndi/proc/attack_self  (code/modules/clothing/spacesuits/hardsuit.dm:246)  may sleep
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/syndi/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let C: Value = null, X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, C, X, A, $e];
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(user))])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You cannot toggle your helmet while in this ＀!</span>", [rt.fv(f, "loc", live(user))])]);
		return live(f.dot);
	}
	rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	if ((truthy(rt.sv(f, "on")) || truthy(rt.sv(f, "force")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You switch your hardsuit to EVA mode, sacrificing speed for space protection.</span>"]);
		rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
		rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
		yield* g.srcCall(f, "set_light", rt.sv(f, "brightness_on"));
		(rt.modSrcVar(f, "flags", rt.sv(f, "visor_flags"), rt.bitOr));
		(rt.modSrcVar(f, "flags_cover", 20, rt.bitOr));
		(rt.modSrcVar(f, "flags_inv", rt.sv(f, "visor_flags_inv"), rt.bitOr));
		(rt.modSrcVar(f, "cold_protection", 1, rt.bitOr));
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You switch your hardsuit to combat mode and can now run at full speed.</span>"]);
		rt.modSrcVar(f, "name", " (combat)", add);
		rt.setSv(f, "desc", rt.sv(f, "alt_desc"));
		yield* g.srcCall(f, "set_light", 0);
		(rt.modSrcVar(f, "flags", rt.op(f, "BitNot", [], [rt.sv(f, "visor_flags")]), rt.bitAnd));
		(rt.modSrcVar(f, "flags_cover", 16777195, rt.bitAnd));
		(rt.modSrcVar(f, "flags_inv", rt.op(f, "BitNot", [], [rt.sv(f, "visor_flags_inv")]), rt.bitAnd));
		(rt.modSrcVar(f, "cold_protection", 16777214, rt.bitAnd));
	}
	yield* g.srcCall(f, "update_icon");
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/mecha/mechmove03.ogg"), 50, 1]);
	yield* g.srcCall(f, "toggle_hardsuit_mode", live(user));
	yield* g.callName(f, live(user), "update_inv_head", []);
	if (truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, (C = live(user)), "head_update", [null, live(f.src), "forced", 1], rt.Args.Named);
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

// /obj/item/clothing/head/helmet/space/hardsuit/syndi/proc/toggle_hardsuit_mode  (code/modules/clothing/spacesuits/hardsuit.dm:282)  may sleep
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/syndi/proc/toggle_hardsuit_mode", function* toggle_hardsuit_mode(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "linkedsuit"))) return f.dot;
	if (truthy(rt.sv(f, "on"))) {
		rt.setFv(f, "name", rt.sv(f, "linkedsuit"), rt.initial(f, rt.sv(f, "linkedsuit"), "name"));
		rt.setFv(f, "desc", rt.sv(f, "linkedsuit"), rt.initial(f, rt.sv(f, "linkedsuit"), "desc"));
		rt.setFv(f, "slowdown", rt.sv(f, "linkedsuit"), 1);
		(rt.modField(f, rt.sv(f, "linkedsuit"), "flags", 1, rt.bitOr));
		(rt.modField(f, rt.sv(f, "linkedsuit"), "cold_protection", 2046, rt.bitOr));
	} else {
		rt.modField(f, rt.sv(f, "linkedsuit"), "name", " (combat)", add);
		rt.setFv(f, "desc", rt.sv(f, "linkedsuit"), rt.fv(f, "alt_desc", rt.sv(f, "linkedsuit")));
		rt.setFv(f, "slowdown", rt.sv(f, "linkedsuit"), 0);
		(rt.modField(f, rt.sv(f, "linkedsuit"), "flags", 16777214, rt.bitAnd));
		(rt.modField(f, rt.sv(f, "linkedsuit"), "cold_protection", 16775169, rt.bitAnd));
	}
	rt.setFv(f, "icon_state", rt.sv(f, "linkedsuit"), fmt("hardsuit＀-＀", [rt.sv(f, "on"), rt.sv(f, "item_color")]));
	yield* g.callName(f, rt.sv(f, "linkedsuit"), "update_icon", []);
	yield* g.callName(f, live(user), "update_inv_wear_suit", []);
	yield* g.callName(f, live(user), "update_inv_w_uniform", []);
	return f.dot;
}, true);

rt.type(7710, "/obj/item/clothing/suit/space/hardsuit/syndi", "/obj/item/clothing/suit/space/hardsuit", {
	jetpack: rt.typePath("/obj/item/weapon/tank/jetpack/suit"),
	name: "blood-red hardsuit",
	desc: "A dual-mode advanced hardsuit designed for work in special operations. It is in EVA mode. Property of Gorlex Marauders.",
	alt_desc: "A dual-mode advanced hardsuit designed for work in special operations. It is in combat mode. Property of Gorlex Marauders.",
	icon_state: "hardsuit1-syndi",
	item_state: "syndie_hardsuit",
	item_color: "syndi",
	w_class: 3,
	armor: null,
	allowed: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/syndi"),
});

// /obj/item/clothing/suit/space/hardsuit/syndi/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:308)
rt.def("/obj/item/clothing/suit/space/hardsuit/syndi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 50, "laser", 30, "energy", 15, "bomb", 35, "bio", 100, "rad", 50, "fire", 50, "acid", 90]));
	$0 = $0;
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/gun"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/melee/energy/sword/saber"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/tank/internals")));
	return f.dot;
});

rt.type(7943, "/obj/item/clothing/head/helmet/space/hardsuit/syndi/elite", "/obj/item/clothing/head/helmet/space/hardsuit/syndi", {
	on: 0,
	name: "elite syndicate hardsuit helmet",
	desc: "An elite version of the syndicate helmet, with improved armour and fireproofing. It is in EVA mode. Property of Gorlex Marauders.",
	alt_desc: "An elite version of the syndicate helmet, with improved armour and fireproofing. It is in combat mode. Property of Gorlex Marauders.",
	icon_state: "hardsuit0-syndielite",
	item_color: "syndielite",
	armor: null,
	heat_protection: 1,
	max_heat_protection_temperature: 35000,
	visor_flags_inv: 0,
	visor_flags: 0,
	resistance_flags: 34,
});

// /obj/item/clothing/head/helmet/space/hardsuit/syndi/elite/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:320)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/syndi/elite/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 60, "bullet", 60, "laser", 50, "energy", 25, "bomb", 55, "bio", 100, "rad", 70, "fire", 100, "acid", 100]));
	return f.dot;
});

rt.type(7711, "/obj/item/clothing/suit/space/hardsuit/syndi/elite", "/obj/item/clothing/suit/space/hardsuit/syndi", {
	name: "elite syndicate hardsuit",
	desc: "An elite version of the syndicate hardsuit, with improved armour and fireproofing. It is in travel mode.",
	alt_desc: "An elite version of the syndicate hardsuit, with improved armour and fireproofing. It is in combat mode.",
	icon_state: "hardsuit0-syndielite",
	item_color: "syndielite",
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/syndi/elite"),
	armor: null,
	heat_protection: 2046,
	max_heat_protection_temperature: 35000,
	resistance_flags: 34,
});

// /obj/item/clothing/suit/space/hardsuit/syndi/elite/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:336)
rt.def("/obj/item/clothing/suit/space/hardsuit/syndi/elite/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 60, "bullet", 60, "laser", 50, "energy", 25, "bomb", 55, "bio", 100, "rad", 70, "fire", 100, "acid", 100]));
	return f.dot;
});

rt.type(7945, "/obj/item/clothing/head/helmet/space/hardsuit/wizard", "/obj/item/clothing/head/helmet/space/hardsuit", {
	name: "gem-encrusted hardsuit helmet",
	desc: "A bizarre gem-encrusted helmet that radiates magical energies.",
	icon_state: "hardsuit0-wiz",
	item_state: "wiz_helm",
	item_color: "wiz",
	resistance_flags: 34,
	armor: null,
	heat_protection: 1,
	max_heat_protection_temperature: 35000,
});

// /obj/item/clothing/head/helmet/space/hardsuit/wizard/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:371)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/wizard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 40, "laser", 40, "energy", 20, "bomb", 35, "bio", 100, "rad", 50, "fire", 100, "acid", 100]));
	return f.dot;
});

rt.type(7713, "/obj/item/clothing/suit/space/hardsuit/wizard", "/obj/item/clothing/suit/space/hardsuit", {
	icon_state: "hardsuit-wiz",
	name: "gem-encrusted hardsuit",
	desc: "A bizarre gem-encrusted suit that radiates magical energies.",
	item_state: "wiz_hardsuit",
	w_class: 3,
	resistance_flags: 34,
	armor: null,
	allowed: null,
	heat_protection: 2046,
	max_heat_protection_temperature: 35000,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/wizard"),
});

// /obj/item/clothing/suit/space/hardsuit/wizard/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:382)
rt.def("/obj/item/clothing/suit/space/hardsuit/wizard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 40, "laser", 40, "energy", 20, "bomb", 35, "bio", 100, "rad", 50, "fire", 100, "acid", 100]));
	$0 = $0;
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/teleportation_scroll"), T("/obj/item/weapon/tank/internals")));
	return f.dot;
});

rt.type(7946, "/obj/item/clothing/head/helmet/space/hardsuit/medical", "/obj/item/clothing/head/helmet/space/hardsuit", {
	name: "medical hardsuit helmet",
	desc: "A special helmet designed for work in a hazardous, low pressure environment. Built with lightweight materials for extra comfort, but does not protect the eyes from intense light.",
	icon_state: "hardsuit0-medical",
	item_state: "medical_helm",
	item_color: "medical",
	flash_protect: 0,
	armor: null,
	scan_reagents: 1,
});

// /obj/item/clothing/head/helmet/space/hardsuit/medical/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:397)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/medical/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 50, "fire", 75, "acid", 75]));
	return f.dot;
});

rt.type(7714, "/obj/item/clothing/suit/space/hardsuit/medical", "/obj/item/clothing/suit/space/hardsuit", {
	icon_state: "hardsuit-medical",
	name: "medical hardsuit",
	desc: "A special suit that protects against hazardous, low pressure environments. Built with lightweight materials for easier movement.",
	item_state: "medical_hardsuit",
	allowed: null,
	armor: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/medical"),
});

// /obj/item/clothing/suit/space/hardsuit/medical/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:405)
rt.def("/obj/item/clothing/suit/space/hardsuit/medical/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/storage/firstaid"), T("/obj/item/device/healthanalyzer"), T("/obj/item/stack/medical")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 50, "fire", 75, "acid", 75]));
	return f.dot;
});

rt.type(7947, "/obj/item/clothing/head/helmet/space/hardsuit/rd", "/obj/item/clothing/head/helmet/space/hardsuit", {
	onboard_hud_enabled: 0,
	bomb_radar: null,
	name: "prototype hardsuit helmet",
	desc: "A prototype helmet designed for research in a hazardous, low pressure environment. Scientific data flashes across the visor.",
	icon_state: "hardsuit0-rd",
	item_color: "rd",
	resistance_flags: 34,
	max_heat_protection_temperature: 30000,
	armor: null,
	scan_reagents: 1,
	actions_types: null,
});

// /obj/item/clothing/head/helmet/space/hardsuit/rd/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:418)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/rd/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 100, "bio", 100, "rad", 60, "fire", 60, "acid", 80]));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_helmet_light"), T("/datum/action/item_action/toggle_research_scanner")));
	return f.dot;
});

// /obj/item/clothing/head/helmet/space/hardsuit/rd/proc/New  (code/modules/clothing/spacesuits/hardsuit.dm:424)  may sleep
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/rd/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "bomb_radar", (yield* g.new_(f, T("/obj/machinery/doppler_array/integrated"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/item/clothing/head/helmet/space/hardsuit/rd/proc/equipped  (code/modules/clothing/spacesuits/hardsuit.dm:428)  may sleep
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/rd/proc/equipped", function* equipped(f: Frame) {
	let DHUD: Value = null;
	f.vars = () => [DHUD];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.fv(f, "glasses", live(f.args[0]))) && truthy((rt.istype(rt.fv(f, "glasses", live(f.args[0])), T("/obj/item/clothing/glasses/hud/diagnostic")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>Your ＀ prevents you using ＀'s diagnostic visor HUD.</span>", [rt.fv(f, "glasses", live(f.args[0])), live(f.src)])]);
	} else {
		rt.setSv(f, "onboard_hud_enabled", 1);
		yield* g.callName(f, (DHUD = rt.index(rt.gl("huds"), 5)), "add_hud_to", [live(f.args[0])]);
	}
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/clothing/head/helmet/space/hardsuit/rd/proc/dropped  (code/modules/clothing/spacesuits/hardsuit.dm:437)  may sleep
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/rd/proc/dropped", function* dropped(f: Frame) {
	let DHUD: Value = null;
	f.vars = () => [DHUD];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.sv(f, "onboard_hud_enabled")) && !(truthy(rt.fv(f, "glasses", live(f.args[0]))) && truthy((rt.istype(rt.fv(f, "glasses", live(f.args[0])), T("/obj/item/clothing/glasses/hud/diagnostic")) ? 1 : 0))))) return f.dot;
	yield* g.callName(f, (DHUD = rt.index(rt.gl("huds"), 5)), "remove_hud_from", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["user"] });

rt.type(7715, "/obj/item/clothing/suit/space/hardsuit/rd", "/obj/item/clothing/suit/space/hardsuit", {
	icon_state: "hardsuit-rd",
	name: "prototype hardsuit",
	desc: "A prototype suit that protects against hazardous, low pressure environments. Fitted with extensive plating for handling explosives and dangerous research materials.",
	item_state: "hardsuit-rd",
	resistance_flags: 34,
	max_heat_protection_temperature: 30000,
	allowed: null,
	armor: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/rd"),
});

// /obj/item/clothing/suit/space/hardsuit/rd/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:449)
rt.def("/obj/item/clothing/suit/space/hardsuit/rd/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/gun/energy/wormhole_projector"), T("/obj/item/weapon/hand_tele"), T("/obj/item/device/aicard")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 100, "bio", 100, "rad", 60, "fire", 60, "acid", 80]));
	return f.dot;
});

rt.type(7948, "/obj/item/clothing/head/helmet/space/hardsuit/security", "/obj/item/clothing/head/helmet/space/hardsuit", {
	name: "security hardsuit helmet",
	desc: "A special helmet designed for work in a hazardous, low pressure environment. Has an additional layer of armor.",
	icon_state: "hardsuit0-sec",
	item_state: "sec_helm",
	item_color: "sec",
	armor: null,
});

// /obj/item/clothing/head/helmet/space/hardsuit/security/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:463)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/security/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 15, "laser", 30, "energy", 10, "bomb", 10, "bio", 100, "rad", 50, "fire", 75, "acid", 75]));
	return f.dot;
});

rt.type(7716, "/obj/item/clothing/suit/space/hardsuit/security", "/obj/item/clothing/suit/space/hardsuit", {
	icon_state: "hardsuit-sec",
	name: "security hardsuit",
	desc: "A special suit that protects against hazardous, low pressure environments. Has an additional layer of armor.",
	item_state: "sec_hardsuit",
	allowed: null,
	armor: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/security"),
});

// /obj/item/clothing/suit/space/hardsuit/security/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:471)
rt.def("/obj/item/clothing/suit/space/hardsuit/security/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/gun/energy"), T("/obj/item/weapon/reagent_containers/spray/pepper"), T("/obj/item/weapon/gun/ballistic"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 15, "laser", 30, "energy", 10, "bomb", 10, "bio", 100, "rad", 50, "fire", 75, "acid", 75]));
	return f.dot;
});

rt.type(7949, "/obj/item/clothing/head/helmet/space/hardsuit/security/hos", "/obj/item/clothing/head/helmet/space/hardsuit/security", {
	name: "head of security's hardsuit helmet",
	desc: "a special bulky helmet designed for work in a hazardous, low pressure environment. Has an additional layer of armor.",
	icon_state: "hardsuit0-hos",
	item_color: "hos",
	armor: null,
});

// /obj/item/clothing/head/helmet/space/hardsuit/security/hos/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:481)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/security/hos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 45, "bullet", 25, "laser", 30, "energy", 10, "bomb", 25, "bio", 100, "rad", 50, "fire", 95, "acid", 95]));
	return f.dot;
});

rt.type(7717, "/obj/item/clothing/suit/space/hardsuit/security/hos", "/obj/item/clothing/suit/space/hardsuit/security", {
	jetpack: rt.typePath("/obj/item/weapon/tank/jetpack/suit"),
	icon_state: "hardsuit-hos",
	name: "head of security's hardsuit",
	desc: "A special bulky suit that protects against hazardous, low pressure environments. Has an additional layer of armor.",
	armor: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/security/hos"),
});

// /obj/item/clothing/suit/space/hardsuit/security/hos/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:488)
rt.def("/obj/item/clothing/suit/space/hardsuit/security/hos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 45, "bullet", 25, "laser", 30, "energy", 10, "bomb", 25, "bio", 100, "rad", 50, "fire", 95, "acid", 95]));
	return f.dot;
});

rt.type(7950, "/obj/item/clothing/head/helmet/space/hardsuit/captain", "/obj/item/clothing/head/helmet/space/hardsuit", {
	name: "captain's hardsuit helmet",
	icon_state: "capspace",
	item_state: "capspacehelmet",
	desc: "A tactical SWAT helmet MK.II boasting better protection and a horrible fashion sense.",
	armor: null,
	resistance_flags: 34,
	flags_inv: 480,
	heat_protection: 1,
	max_heat_protection_temperature: 35000,
	actions_types: null,
});

// /obj/item/clothing/head/helmet/space/hardsuit/captain/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:498)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/captain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 50, "laser", 50, "energy", 25, "bomb", 50, "bio", 100, "rad", 50, "fire", 100, "acid", 100]));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list());
	return f.dot;
});

rt.type(7718, "/obj/item/clothing/suit/space/hardsuit/captain", "/obj/item/clothing/suit/space/hardsuit", {
	name: "captain's SWAT suit",
	desc: "A MK.II SWAT suit with streamlined joints and armor made out of superior materials, insulated against intense heat. The most advanced tactical armor available Usually reserved for heavy hitter corporate security, this one has a regal finish in Nanotrasen company colors. Better not let the assistants get a hold of it.",
	icon_state: "caparmor",
	item_state: "capspacesuit",
	allowed: null,
	armor: null,
	resistance_flags: 34,
	heat_protection: 2046,
	max_heat_protection_temperature: 35000,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/captain"),
});

// /obj/item/clothing/suit/space/hardsuit/captain/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:513)
rt.def("/obj/item/clothing/suit/space/hardsuit/captain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/tank/internals"), T("/obj/item/device/flashlight"), T("/obj/item/weapon/gun/energy"), T("/obj/item/weapon/gun/ballistic"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 50, "laser", 50, "energy", 25, "bomb", 50, "bio", 100, "rad", 50, "fire", 100, "acid", 100]));
	return f.dot;
});

rt.type(7951, "/obj/item/clothing/head/helmet/space/hardsuit/clown", "/obj/item/clothing/head/helmet/space/hardsuit", {
	name: "cosmohonk hardsuit helmet",
	desc: "A special helmet designed for work in a hazardous, low-humor environment. Has radiation shielding.",
	icon_state: "hardsuit0-clown",
	item_state: "hardsuit0-clown",
	armor: null,
	item_color: "clown",
});

// /obj/item/clothing/head/helmet/space/hardsuit/clown/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:526)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/clown/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 75, "fire", 60, "acid", 30]));
	return f.dot;
});

rt.type(7719, "/obj/item/clothing/suit/space/hardsuit/clown", "/obj/item/clothing/suit/space/hardsuit", {
	name: "cosmohonk hardsuit",
	desc: "A special suit that protects against hazardous, low humor environments. Has radiation shielding. Only a true clown can wear it.",
	icon_state: "hardsuit-clown",
	item_state: "clown_hardsuit",
	armor: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/clown"),
});

// /obj/item/clothing/suit/space/hardsuit/clown/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:534)
rt.def("/obj/item/clothing/suit/space/hardsuit/clown/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 5, "laser", 10, "energy", 5, "bomb", 10, "bio", 100, "rad", 75, "fire", 60, "acid", 30]));
	return f.dot;
});

// /obj/item/clothing/suit/space/hardsuit/clown/proc/mob_can_equip  (code/modules/clothing/spacesuits/hardsuit.dm:538)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/clown/proc/mob_can_equip", function* mob_can_equip(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if ((!truthy((yield* g.callSuper(f, [], rt.Args.Same))) || !truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		return 0;
	}
	if (isEqual(rt.gv(f, "assigned_role", rt.gv(f, "mind", (H = live(f.args[0])))), "Clown")) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true, { args: ["M", "slot"] });

rt.type(7952, "/obj/item/clothing/head/helmet/space/hardsuit/ancient", "/obj/item/clothing/head/helmet/space/hardsuit", {
	name: "prototype RIG hardsuit helmet",
	desc: "Early prototype RIG hardsuit helmet, designed to quickly shift over a user's head. Design constraints of the helmet mean it has no inbuilt cameras, thus it restricts the users visability.",
	icon_state: "hardsuit0-ancient",
	item_state: "anc_helm",
	armor: null,
	tint: 2,
	item_color: "ancient",
	resistance_flags: 2,
});

// /obj/item/clothing/head/helmet/space/hardsuit/ancient/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:552)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/ancient/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 5, "laser", 5, "energy", 0, "bomb", 50, "bio", 100, "rad", 100, "fire", 100, "acid", 75]));
	return f.dot;
});

rt.type(7720, "/obj/item/clothing/suit/space/hardsuit/ancient", "/obj/item/clothing/suit/space/hardsuit", {
	footstep: 1,
	name: "prototype RIG hardsuit",
	desc: "Prototype powered RIG hardsuit. Provides excellent protection from the elements of space while being comfortable to move around in, thanks to the powered locomotives. Remains very bulky however.",
	icon_state: "hardsuit-ancient",
	item_state: "anc_hardsuit",
	armor: null,
	slowdown: 3,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/ancient"),
	resistance_flags: 2,
});

// /obj/item/clothing/suit/space/hardsuit/ancient/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:562)
rt.def("/obj/item/clothing/suit/space/hardsuit/ancient/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 5, "laser", 5, "energy", 0, "bomb", 50, "bio", 100, "rad", 100, "fire", 100, "acid", 75]));
	return f.dot;
});

// /obj/item/clothing/suit/space/hardsuit/ancient/proc/on_mob_move  (code/modules/clothing/spacesuits/hardsuit.dm:569)
rt.def("/obj/item/clothing/suit/space/hardsuit/ancient/proc/on_mob_move", function on_mob_move(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if ((!truthy((rt.istype((H = rt.sv(f, "loc")), T("/mob/living/carbon/human")) ? 1 : 0)) || !isEqual(rt.fv(f, "wear_suit", live(H)), live(f.src)))) {
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "footstep"), 1)) {
		rt.call(f, P("/proc/playsound"), null, [live(f.src), "suitstep", 50, 1]);
		rt.setSv(f, "footstep", 0);
	} else {
		rt.incSrcVar(f, "footstep", 1, true);
	}
	return f.dot;
});

rt.type(7721, "/obj/item/clothing/suit/space/hardsuit/shielded", "/obj/item/clothing/suit/space/hardsuit", {
	current_charges: 3,
	max_charges: 3,
	recharge_delay: 200,
	recharge_cooldown: 0,
	recharge_rate: 1,
	shield_state: "shield-old",
	shield_on: "shield-old",
	name: "shielded hardsuit",
	desc: "A hardsuit with built in energy shielding. Will rapidly recharge when not under fire.",
	icon_state: "hardsuit-hos",
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/security/hos"),
	allowed: null,
	armor: null,
	resistance_flags: 34,
});

// /obj/item/clothing/suit/space/hardsuit/shielded/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:585)
rt.def("/obj/item/clothing/suit/space/hardsuit/shielded/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/gun"), T("/obj/item/weapon/reagent_containers/spray/pepper"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 15, "laser", 30, "energy", 10, "bomb", 10, "bio", 100, "rad", 50, "fire", 100, "acid", 100]));
	return f.dot;
});

// /obj/item/clothing/suit/space/hardsuit/shielded/proc/hit_reaction  (code/modules/clothing/spacesuits/hardsuit.dm:597)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/shielded/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	let s: Value = null;
	f.vars = () => [owner, hitby, attack_text, final_block_chance, damage, attack_type, s];
	if (live(attack_text) === null) {
		attack_text = "the attack";
	}
	if (live(final_block_chance) === null) {
		final_block_chance = 0;
	}
	if (live(damage) === null) {
		damage = 0;
	}
	if (live(attack_type) === null) {
		attack_type = 1;
	}
	rt.setSv(f, "recharge_cooldown", add(rt.worldTime(f), rt.sv(f, "recharge_delay")));
	if (rt.gt(rt.sv(f, "current_charges"), 0)) {
		yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [2, 1, live(f.src)]);
		yield* g.callName(f, live(s), "start", []);
		yield* g.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>＀'s shields deflect ＀ in a shower of sparks!</span>", [live(owner), live(attack_text)])]);
		rt.incSrcVar(f, "current_charges", -1, true);
		if (truthy(rt.sv(f, "recharge_rate"))) {
			if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
				rt.setFv(f, "isprocessing", live(f.src), 1);
				rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
			}
		}
		if (rt.le(rt.sv(f, "current_charges"), 0)) {
			yield* g.callName(f, live(owner), "visible_message", [fmt("＀'s shield overloads!", [live(owner)])]);
			rt.setSv(f, "shield_state", "broken");
			yield* g.callName(f, live(owner), "update_inv_wear_suit", []);
		}
		return 1;
	}
	return 0;
}, true);

// /obj/item/clothing/suit/space/hardsuit/shielded/proc/Destroy  (code/modules/clothing/spacesuits/hardsuit.dm:615)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/shielded/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/clothing/suit/space/hardsuit/shielded/proc/process  (code/modules/clothing/spacesuits/hardsuit.dm:619)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/shielded/proc/process", function* process(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (!(rt.gt(rt.worldTime(f), rt.sv(f, "recharge_cooldown")) && rt.lt(rt.sv(f, "current_charges"), rt.sv(f, "max_charges")))) return f.dot;
	rt.setSv(f, "current_charges", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "current_charges"), rt.sv(f, "recharge_rate")), rt.sv(f, "max_charges")]))])));
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/magic/charge.ogg"), 50, 1]);
	if (isEqual(rt.sv(f, "current_charges"), rt.sv(f, "max_charges"))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/ding.ogg"), 50, 1]);
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	}
	rt.setSv(f, "shield_state", fmt("＀", [rt.sv(f, "shield_on")]));
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (C = rt.sv(f, "loc")), "update_inv_wear_suit", []);
	return f.dot;
}, true, { waitfor: false });

// /obj/item/clothing/suit/space/hardsuit/shielded/proc/worn_overlays  (code/modules/clothing/spacesuits/hardsuit.dm:631)
rt.def("/obj/item/clothing/suit/space/hardsuit/shielded/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	f.dot = rt.list();
	if (truthy(live(isinhands))) return f.dot;
	f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/effects.dmi"), rt.sv(f, "shield_state"), 4.010000228881836]), add);
	return f.dot;
});

rt.type(7722, "/obj/item/clothing/suit/space/hardsuit/shielded/ctf", "/obj/item/clothing/suit/space/hardsuit/shielded", {
	flags: 8195,
	max_charges: 5,
	name: "white shielded hardsuit",
	desc: "Standard issue hardsuit for playing capture the flag.",
	icon_state: "ert_medical",
	item_state: "ert_medical",
	item_color: "ert_medical",
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/shielded/ctf"),
	armor: null,
	slowdown: 0,
});

// /obj/item/clothing/suit/space/hardsuit/shielded/ctf/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:648)
rt.def("/obj/item/clothing/suit/space/hardsuit/shielded/ctf/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 30, "laser", 30, "energy", 30, "bomb", 50, "bio", 100, "rad", 100, "fire", 95, "acid", 95]));
	return f.dot;
});

rt.type(7954, "/obj/item/clothing/head/helmet/space/hardsuit/shielded/ctf", "/obj/item/clothing/head/helmet/space/hardsuit/shielded", {
	name: "shielded hardsuit helmet",
	desc: "Standard issue hardsuit helmet for playing capture the flag.",
	icon_state: "hardsuit0-ert_medical",
	item_state: "hardsuit0-ert_medical",
	item_color: "ert_medical",
	armor: null,
});

// /obj/item/clothing/head/helmet/space/hardsuit/shielded/ctf/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:676)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/shielded/ctf/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 30, "laser", 30, "energy", 30, "bomb", 50, "bio", 100, "rad", 100, "fire", 95, "acid", 95]));
	return f.dot;
});

rt.type(7725, "/obj/item/clothing/suit/space/hardsuit/shielded/syndi", "/obj/item/clothing/suit/space/hardsuit/shielded", {
	name: "blood-red hardsuit",
	desc: "An advanced hardsuit with built in energy shielding.",
	icon_state: "hardsuit1-syndi",
	item_state: "syndie_hardsuit",
	item_color: "syndi",
	armor: null,
	allowed: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/shielded/syndi"),
	slowdown: 0,
});

// /obj/item/clothing/suit/space/hardsuit/shielded/syndi/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:703)
rt.def("/obj/item/clothing/suit/space/hardsuit/shielded/syndi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 50, "laser", 30, "energy", 15, "bomb", 35, "bio", 100, "rad", 50, "fire", 100, "acid", 100]));
	$0 = $0;
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/gun"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/melee/energy/sword/saber"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/tank/internals")));
	return f.dot;
});

// /obj/item/clothing/suit/space/hardsuit/shielded/syndi/proc/New  (code/modules/clothing/spacesuits/hardsuit.dm:710)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/shielded/syndi/proc/New", function* New(f: Frame) {
	rt.setSv(f, "jetpack", (yield* g.new_(f, T("/obj/item/weapon/tank/jetpack/suit"), [live(f.src)])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(7957, "/obj/item/clothing/head/helmet/space/hardsuit/shielded/syndi", "/obj/item/clothing/head/helmet/space/hardsuit/shielded", {
	name: "blood-red hardsuit helmet",
	desc: "An advanced hardsuit helmet with built in energy shielding.",
	icon_state: "hardsuit1-syndi",
	item_state: "syndie_helm",
	item_color: "syndi",
	armor: null,
});

// /obj/item/clothing/head/helmet/space/hardsuit/shielded/syndi/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:719)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/shielded/syndi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 50, "laser", 30, "energy", 15, "bomb", 35, "bio", 100, "rad", 50, "fire", 100, "acid", 100]));
	return f.dot;
});

rt.type(7726, "/obj/item/clothing/suit/space/hardsuit/shielded/swat", "/obj/item/clothing/suit/space/hardsuit/shielded", {
	max_charges: 4,
	current_charges: 4,
	recharge_delay: 15,
	name: "death commando spacesuit",
	desc: "an advanced hardsuit favored by commandos for use in special operations.",
	icon_state: "deathsquad",
	item_state: "swat_suit",
	item_color: "syndi",
	armor: null,
	strip_delay: 130,
	max_heat_protection_temperature: 35000,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/shielded/swat"),
	dog_fashion: rt.typePath("/datum/dog_fashion/back/deathsquad"),
});

// /obj/item/clothing/suit/space/hardsuit/shielded/swat/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:731)
rt.def("/obj/item/clothing/suit/space/hardsuit/shielded/swat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 80, "bullet", 80, "laser", 50, "energy", 50, "bomb", 100, "bio", 100, "rad", 100, "fire", 100, "acid", 100]));
	return f.dot;
});

rt.type(7958, "/obj/item/clothing/head/helmet/space/hardsuit/shielded/swat", "/obj/item/clothing/head/helmet/space/hardsuit/shielded", {
	name: "death commando helmet",
	desc: "A tactical helmet with built in energy shielding.",
	icon_state: "deathsquad",
	item_state: "deathsquad",
	item_color: "syndi",
	armor: null,
	strip_delay: 130,
	max_heat_protection_temperature: 35000,
	actions_types: null,
});

// /obj/item/clothing/head/helmet/space/hardsuit/shielded/swat/proc/<init>  (code/modules/clothing/spacesuits/hardsuit.dm:743)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/shielded/swat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 80, "bullet", 80, "laser", 50, "energy", 50, "bomb", 100, "bio", 100, "rad", 100, "fire", 100, "acid", 100]));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list());
	return f.dot;
});
