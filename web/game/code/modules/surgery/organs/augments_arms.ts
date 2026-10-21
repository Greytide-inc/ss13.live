// From code/modules/surgery/organs/augments_arms.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9488, "/obj/item/organ/cyberimp/arm", "/obj/item/organ/cyberimp", {
	items_list: null,
	holder: null,
	name: "arm-mounted implant",
	desc: "You shouldn't see this! Adminhelp and report this as an issue on github!",
	zone: "r_arm",
	slot: "r_arm_device",
	icon_state: "implant-toolkit",
	w_class: 3,
	actions_types: null,
});

// /obj/item/organ/cyberimp/arm/proc/<init>  (code/modules/surgery/organs/augments_arms.dm:10)
rt.def("/obj/item/organ/cyberimp/arm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "items_list", rt.list());
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/organ_action/toggle")));
	return f.dot;
});

// /obj/item/organ/cyberimp/arm/proc/Initialize  (code/modules/surgery/organs/augments_arms.dm:18)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.sv(f, "holder")])))) {
		rt.setSv(f, "holder", (yield* g.new_(f, rt.sv(f, "holder"), [live(f.src)])));
	}
	yield* g.srcCall(f, "update_icon");
	rt.setSv(f, "slot", add(rt.sv(f, "zone"), "_device"));
	rt.setSv(f, "items_list", (yield* g.callName(f, rt.sv(f, "contents"), "Copy", [])));
	return f.dot;
}, true);

// /obj/item/organ/cyberimp/arm/proc/update_icon  (code/modules/surgery/organs/augments_arms.dm:27)
rt.def("/obj/item/organ/cyberimp/arm/proc/update_icon", function update_icon(f: Frame) {
	if (isEqual(rt.sv(f, "zone"), "r_arm")) {
		rt.setSv(f, "transform", null);
	} else {
		rt.setSv(f, "transform", rt.call(f, P("/proc/matrix"), null, [-1, 0, 0, 0, 1, 0]));
	}
	return f.dot;
});

// /obj/item/organ/cyberimp/arm/proc/examine  (code/modules/surgery/organs/augments_arms.dm:33)
rt.def("/obj/item/organ/cyberimp/arm/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	$1 = live(f.src);
	if (isEqual(rt.sv(f, "zone"), "r_arm")) {
		$2 = "right";
	} else {
		$2 = "left";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='info'>＀ is assembled in the ＀ arm configuration. You can use a screwdriver to reassemble it.</span>", [$1, $2])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/organ/cyberimp/arm/proc/attackby  (code/modules/surgery/organs/augments_arms.dm:37)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (isEqual(rt.sv(f, "zone"), "r_arm")) {
			rt.setSv(f, "zone", "l_arm");
		} else {
			rt.setSv(f, "zone", "r_arm");
		}
		rt.setSv(f, "slot", add(rt.sv(f, "zone"), "_device"));
		$0 = live(f.args[1]);
		$1 = live(f.src);
		if (isEqual(rt.sv(f, "zone"), "r_arm")) {
			$2 = "right";
		} else {
			$2 = "left";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You modify ＀ to be installed on the ＀ arm.</span>", [$1, $2])]);
		yield* g.srcCall(f, "update_icon");
	} else {
		if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/emag")) ? 1 : 0))) return f.dot;
		yield* g.srcCall(f, "emag_act");
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/organ/cyberimp/arm/proc/Remove  (code/modules/surgery/organs/augments_arms.dm:50)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/proc/Remove", function* Remove(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.srcCall(f, "Retract");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "special"] });

rt.type(9489, "/obj/item/organ/cyberimp/arm/gun", "/obj/item/organ/cyberimp/arm", {});

// /obj/item/organ/cyberimp/arm/gun/proc/emp_act  (code/modules/surgery/organs/augments_arms.dm:57)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/gun/proc/emp_act", function* emp_act(f: Frame) {
	if ((truthy(rt.op(f, "Prob", [], [divide(15, live(f.args[0]))])) && truthy(rt.sv(f, "owner")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='warning'>＀ is hit by EMP!</span>", [live(f.src)])]);
		yield* g.srcCall(f, "Retract");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/item/organ/cyberimp/arm/proc/Retract  (code/modules/surgery/organs/augments_arms.dm:64)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/proc/Retract", function* Retract(f: Frame) {
	let F: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any;
	f.vars = () => [F, $0, $1, $2, $3, $4];
	if ((!truthy(rt.sv(f, "holder")) || truthy((rt.isIn(f, rt.sv(f, "holder"), live(f.src)) ? 1 : 0)))) {
		return live(f.dot);
	}
	$0 = rt.sv(f, "owner");
	$1 = rt.sv(f, "owner");
	$2 = rt.sv(f, "holder");
	$3 = (yield* g.callName(f, rt.sv(f, "owner"), "p_their", []));
	if (isEqual(rt.sv(f, "zone"), "r_arm")) {
		$4 = "right";
	} else {
		$4 = "left";
	}
	$1 = fmt("<span class='notice'>＀ retracts ＀ back into ＀ ＀ arm.</span>", [$1, $2, $3, $4]);
	$2 = rt.sv(f, "holder");
	if (isEqual(rt.sv(f, "zone"), "r_arm")) {
		$3 = "right";
	} else {
		$3 = "left";
	}
	yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>＀ snaps back into your ＀ arm.</span>", [$2, $3]), "<span class='italics'>You hear a short mechanical noise.</span>"]);
	if (truthy((rt.istype(rt.sv(f, "holder"), T("/obj/item/device/assembly/flash/armimplant")) ? 1 : 0))) {
		yield* g.callName(f, (F = rt.sv(f, "holder")), "set_light", [0]);
	}
	yield* g.callName(f, rt.sv(f, "owner"), "transferItemToLoc", [rt.sv(f, "holder"), live(f.src), 1]);
	rt.setSv(f, "holder", null);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, rt.sv(f, "owner"), 0), rt.rsc("sound/mecha/mechmove03.ogg"), 50, 1]);
	return f.dot;
}, true);

// /obj/item/organ/cyberimp/arm/proc/Extend  (code/modules/surgery/organs/augments_arms.dm:80)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/proc/Extend", function* Extend(f: Frame, item: Value) {
	let F: Value = null, arm_item: Value = null, result: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any;
	f.vars = () => [item, F, arm_item, result, $0, $1, $2, $3, $4];
	if (!truthy((rt.isIn(f, live(item), live(f.src)) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.setSv(f, "holder", live(item));
	(rt.modField(f, rt.sv(f, "holder"), "flags", 2, rt.bitOr));
	rt.setFv(f, "resistance_flags", rt.sv(f, "holder"), 115);
	rt.setFv(f, "slot_flags", rt.sv(f, "holder"), null);
	rt.setFv(f, "w_class", rt.sv(f, "holder"), 5);
	rt.setFv(f, "materials", rt.sv(f, "holder"), null);
	if (truthy((rt.istype(rt.sv(f, "holder"), T("/obj/item/device/assembly/flash/armimplant")) ? 1 : 0))) {
		yield* g.callName(f, (F = rt.sv(f, "holder")), "set_light", [7]);
	}
	if (truthy((arm_item = (yield* g.callName(f, rt.sv(f, "owner"), "get_active_held_item", []))))) {
		if (!truthy((yield* g.callName(f, rt.sv(f, "owner"), "dropItemToGround", [live(arm_item)])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='warning'>Your ＀ interferes with ＀!</span>", [live(arm_item), live(f.src)])]);
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='notice'>You drop ＀ to activate ＀!</span>", [live(arm_item), live(f.src)])]);
		}
	}
	if (isEqual(rt.sv(f, "zone"), "r_arm")) {
		$0 = (yield* g.callName(f, rt.sv(f, "owner"), "put_in_r_hand", [rt.sv(f, "holder")]));
	} else {
		$0 = (yield* g.callName(f, rt.sv(f, "owner"), "put_in_l_hand", [rt.sv(f, "holder")]));
	}
	if (!truthy((result = $0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='warning'>Your ＀ fails to activate!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "owner"), "swap_hand", [live(result)]);
	$0 = rt.sv(f, "owner");
	$1 = rt.sv(f, "owner");
	$2 = rt.sv(f, "holder");
	$3 = (yield* g.callName(f, rt.sv(f, "owner"), "p_their", []));
	if (isEqual(rt.sv(f, "zone"), "r_arm")) {
		$4 = "right";
	} else {
		$4 = "left";
	}
	$1 = fmt("<span class='notice'>＀ extends ＀ from ＀ ＀ arm.</span>", [$1, $2, $3, $4]);
	$2 = rt.sv(f, "holder");
	if (isEqual(rt.sv(f, "zone"), "r_arm")) {
		$3 = "right";
	} else {
		$3 = "left";
	}
	yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You extend ＀ from your ＀ arm.</span>", [$2, $3]), "<span class='italics'>You hear a short mechanical noise.</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, rt.sv(f, "owner"), 0), rt.rsc("sound/mecha/mechmove03.ogg"), 50, 1]);
	return f.dot;
}, true);

// /obj/item/organ/cyberimp/arm/proc/ui_action_click  (code/modules/surgery/organs/augments_arms.dm:118)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/proc/ui_action_click", function* ui_action_click(f: Frame) {
	let choise: Value = null;
	f.vars = () => [choise];
	if ((truthy(rt.sv(f, "crit_fail")) || (!truthy(rt.sv(f, "holder")) && !truthy(rt.len(f, rt.sv(f, "contents")))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>The implant doesn't respond. It seems to be broken...</span>"]);
		return live(f.dot);
	}
	if ((truthy((rt.istype((yield* g.callName(f, rt.sv(f, "owner"), "get_active_held_item", [])), T("/obj/item/weapon/card/emag")) ? 1 : 0)) && truthy((yield* g.srcCall(f, "emag_act"))))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "holder")) || truthy((rt.isIn(f, rt.sv(f, "holder"), live(f.src)) ? 1 : 0)))) {
		rt.setSv(f, "holder", null);
		if (isEqual(rt.len(f, rt.sv(f, "contents")), 1)) {
			yield* g.srcCall(f, "Extend", rt.index(rt.sv(f, "contents"), 1));
		} else {
			choise = (yield* g.op(f, "Prompt", [1], [null, null, "Arm Implant", "Activate which item?", rt.sv(f, "items_list")]));
			if (((((((truthy(rt.sv(f, "owner")) && isEqual(rt.sv(f, "owner"), live(f.usr))) && !isEqual(rt.fv(f, "stat", rt.sv(f, "owner")), 2)) && truthy((rt.isIn(f, live(f.src), rt.fv(f, "internal_organs", rt.sv(f, "owner"))) ? 1 : 0))) && !truthy(rt.sv(f, "holder"))) && truthy((rt.istype(live(choise), T("/obj/item")) ? 1 : 0))) && truthy((rt.isIn(f, live(choise), rt.sv(f, "contents")) ? 1 : 0)))) {
				yield* g.srcCall(f, "Extend", live(choise));
			}
		}
	} else {
		yield* g.srcCall(f, "Retract");
	}
	return f.dot;
}, true);

// /obj/item/organ/cyberimp/arm/gun/proc/emp_act  (code/modules/surgery/organs/augments_arms.dm:140)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/gun/proc/emp_act", function* emp_act(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	if (((truthy(rt.op(f, "Prob", [], [divide(30, live(f.args[0]))])) && truthy(rt.sv(f, "owner"))) && !truthy(rt.sv(f, "crit_fail")))) {
		yield* g.srcCall(f, "Retract");
		$0 = rt.sv(f, "owner");
		$1 = rt.sv(f, "owner");
		if (isEqual(rt.sv(f, "zone"), "r_arm")) {
			$2 = "right";
		} else {
			$2 = "left";
		}
		yield* g.callName(f, $0, "visible_message", [fmt("<span class='danger'>A loud bang comes from ＀'s ＀ arm!</span>", [$1, $2])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, rt.sv(f, "owner"), 0), rt.rsc("sound/weapons/flashbang.ogg"), 100, 1]);
		$0 = rt.sv(f, "owner");
		if (isEqual(rt.sv(f, "zone"), "r_arm")) {
			$1 = "right";
		} else {
			$1 = "left";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='userdanger'>You feel an explosion erupt inside your ＀ arm as your implant breaks!</span>", [$1])]);
		yield* g.callName(f, rt.sv(f, "owner"), "adjust_fire_stacks", [20]);
		yield* g.callName(f, rt.sv(f, "owner"), "IgniteMob", []);
		yield* g.callName(f, rt.sv(f, "owner"), "adjustFireLoss", [25]);
		rt.setSv(f, "crit_fail", 1);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["severity"] });

rt.type(9490, "/obj/item/organ/cyberimp/arm/gun/laser", "/obj/item/organ/cyberimp/arm/gun", {
	name: "arm-mounted laser implant",
	desc: "A variant of the arm cannon implant that fires lethal laser beams. The cannon emerges from the subject's arm and remains inside when not in use.",
	icon_state: "arm_laser",
	origin_tech: "materials=4;combat=4;biotech=4;powerstorage=4;syndicate=3",
	contents: null,
});

// /obj/item/organ/cyberimp/arm/gun/laser/proc/<init>  (code/modules/surgery/organs/augments_arms.dm:158)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/gun/laser/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "contents", rt.list((yield* g.new_(f, T("/obj/item/weapon/gun/energy/laser/mounted"), []))));
	return f.dot;
}, true);

rt.type(9492, "/obj/item/organ/cyberimp/arm/gun/taser", "/obj/item/organ/cyberimp/arm/gun", {
	name: "arm-mounted taser implant",
	desc: "A variant of the arm cannon implant that fires electrodes and disabler shots. The cannon emerges from the subject's arm and remains inside when not in use.",
	icon_state: "arm_taser",
	origin_tech: "materials=5;combat=5;biotech=4;powerstorage=4",
	contents: null,
});

// /obj/item/organ/cyberimp/arm/gun/taser/proc/<init>  (code/modules/surgery/organs/augments_arms.dm:169)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/gun/taser/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "contents", rt.list((yield* g.new_(f, T("/obj/item/weapon/gun/energy/e_gun/advtaser/mounted"), []))));
	return f.dot;
}, true);

rt.type(9494, "/obj/item/organ/cyberimp/arm/toolset", "/obj/item/organ/cyberimp/arm", {
	name: "integrated toolset implant",
	desc: "A stripped-down version of engineering cyborg toolset, designed to be installed on subject's arm. Contains all neccessary tools.",
	origin_tech: "materials=3;engineering=4;biotech=3;powerstorage=4",
	contents: null,
});

// /obj/item/organ/cyberimp/arm/toolset/proc/<init>  (code/modules/surgery/organs/augments_arms.dm:179)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/toolset/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "contents", rt.list((yield* g.new_(f, T("/obj/item/weapon/screwdriver/cyborg"), [])), (yield* g.new_(f, T("/obj/item/weapon/wrench/cyborg"), [])), (yield* g.new_(f, T("/obj/item/weapon/weldingtool/largetank/cyborg"), [])), (yield* g.new_(f, T("/obj/item/weapon/crowbar/cyborg"), [])), (yield* g.new_(f, T("/obj/item/weapon/wirecutters/cyborg"), [])), (yield* g.new_(f, T("/obj/item/device/multitool/cyborg"), []))));
	return f.dot;
}, true);

// /obj/item/organ/cyberimp/arm/toolset/proc/emag_act  (code/modules/surgery/organs/augments_arms.dm:186)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/toolset/proc/emag_act", function* emag_act(f: Frame) {
	if (!truthy(rt.locateIn(f, T("/obj/item/weapon/kitchen/knife/combat/cyborg"), rt.sv(f, "items_list")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You unlock ＀'s integrated knife!</span>", [live(f.src)])]);
		rt.modSrcVar(f, "items_list", (yield* g.new_(f, T("/obj/item/weapon/kitchen/knife/combat/cyborg"), [live(f.src)])), add);
		return 1;
	}
	return 0;
}, true);

rt.type(9496, "/obj/item/organ/cyberimp/arm/esword", "/obj/item/organ/cyberimp/arm", {
	name: "arm-mounted energy blade",
	desc: "An illegal, and highly dangerous cybernetic implant that can project a deadly blade of concentrated enregy.",
	contents: null,
	origin_tech: "materials=4;combat=5;biotech=3;powerstorage=2;syndicate=5",
});

// /obj/item/organ/cyberimp/arm/esword/proc/<init>  (code/modules/surgery/organs/augments_arms.dm:195)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/esword/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "contents", rt.list((yield* g.new_(f, T("/obj/item/weapon/melee/energy/blade/hardlight"), []))));
	return f.dot;
}, true);

rt.type(9497, "/obj/item/organ/cyberimp/arm/medibeam", "/obj/item/organ/cyberimp/arm", {
	name: "integrated medical beamgun",
	desc: "A cybernetic implant that allows the user to project a healing beam from their hand.",
	contents: null,
	origin_tech: "materials=5;combat=2;biotech=5;powerstorage=4;syndicate=1",
});

// /obj/item/organ/cyberimp/arm/medibeam/proc/<init>  (code/modules/surgery/organs/augments_arms.dm:201)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/medibeam/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "contents", rt.list((yield* g.new_(f, T("/obj/item/weapon/gun/medbeam"), []))));
	return f.dot;
}, true);

rt.type(9498, "/obj/item/organ/cyberimp/arm/flash", "/obj/item/organ/cyberimp/arm", {
	name: "integrated high-intensity photon projector",
	desc: "An integrated projector mounted onto a user's arm, that is able to be used as a powerful flash.",
	contents: null,
	origin_tech: "materials=4;combat=3;biotech=4;magnets=4;powerstorage=3",
});

// /obj/item/organ/cyberimp/arm/flash/proc/<init>  (code/modules/surgery/organs/augments_arms.dm:207)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/flash/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "contents", rt.list((yield* g.new_(f, T("/obj/item/device/assembly/flash/armimplant"), []))));
	return f.dot;
}, true);

// /obj/item/organ/cyberimp/arm/flash/proc/Initialize  (code/modules/surgery/organs/augments_arms.dm:211)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/flash/proc/Initialize", function* Initialize(f: Frame) {
	let F: Value = null;
	f.vars = () => [F];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.locateIn(f, T("/obj/item/device/assembly/flash/armimplant"), rt.sv(f, "items_list")))) return f.dot;
	rt.setFv(f, "I", (F = rt.locateIn(f, T("/obj/item/device/assembly/flash/armimplant"), rt.sv(f, "items_list"))), live(f.src));
	return f.dot;
}, true);

rt.type(9499, "/obj/item/organ/cyberimp/arm/baton", "/obj/item/organ/cyberimp/arm", {
	name: "arm electrification implant",
	desc: "An illegal combat implant that allows the user to administer disabling shocks from their arm.",
	contents: null,
	origin_tech: "materials=3;combat=5;biotech=4;powerstorage=4;syndicate=3",
});

// /obj/item/organ/cyberimp/arm/baton/proc/<init>  (code/modules/surgery/organs/augments_arms.dm:219)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/baton/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "contents", rt.list((yield* g.new_(f, T("/obj/item/borg/stun"), []))));
	return f.dot;
}, true);

rt.type(9500, "/obj/item/organ/cyberimp/arm/combat", "/obj/item/organ/cyberimp/arm", {
	name: "combat cybernetics implant",
	desc: "A powerful cybernetic implant that contains combat modules built into the user's arm",
	contents: null,
	origin_tech: "materials=5;combat=7;biotech=5;powerstorage=5;syndicate=6;programming=5",
});

// /obj/item/organ/cyberimp/arm/combat/proc/<init>  (code/modules/surgery/organs/augments_arms.dm:225)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/combat/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "contents", rt.list((yield* g.new_(f, T("/obj/item/weapon/melee/energy/blade/hardlight"), [])), (yield* g.new_(f, T("/obj/item/weapon/gun/medbeam"), [])), (yield* g.new_(f, T("/obj/item/borg/stun"), [])), (yield* g.new_(f, T("/obj/item/device/assembly/flash/armimplant"), []))));
	return f.dot;
}, true);

// /obj/item/organ/cyberimp/arm/combat/proc/Initialize  (code/modules/surgery/organs/augments_arms.dm:229)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/combat/proc/Initialize", function* Initialize(f: Frame) {
	let F: Value = null;
	f.vars = () => [F];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.locateIn(f, T("/obj/item/device/assembly/flash/armimplant"), rt.sv(f, "items_list")))) return f.dot;
	rt.setFv(f, "I", (F = rt.locateIn(f, T("/obj/item/device/assembly/flash/armimplant"), rt.sv(f, "items_list"))), live(f.src));
	return f.dot;
}, true);

rt.type(9501, "/obj/item/organ/cyberimp/arm/surgery", "/obj/item/organ/cyberimp/arm", {
	name: "surgical toolset implant",
	desc: "A set of surgical tools hidden behind a concealed panel on the user's arm",
	contents: null,
	origin_tech: "materials=3;engineering=3;biotech=3;programming=2;magnets=3",
});

// /obj/item/organ/cyberimp/arm/surgery/proc/<init>  (code/modules/surgery/organs/augments_arms.dm:237)  may sleep
rt.def("/obj/item/organ/cyberimp/arm/surgery/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "contents", rt.list((yield* g.new_(f, T("/obj/item/weapon/retractor"), [])), (yield* g.new_(f, T("/obj/item/weapon/hemostat"), [])), (yield* g.new_(f, T("/obj/item/weapon/cautery"), [])), (yield* g.new_(f, T("/obj/item/weapon/surgicaldrill"), [])), (yield* g.new_(f, T("/obj/item/weapon/scalpel"), [])), (yield* g.new_(f, T("/obj/item/weapon/circular_saw"), [])), (yield* g.new_(f, T("/obj/item/weapon/surgical_drapes"), []))));
	return f.dot;
}, true);
