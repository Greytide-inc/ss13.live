// From code/modules/surgery/organs/augments_chest.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9503, "/obj/item/organ/cyberimp/chest/nutriment", "/obj/item/organ/cyberimp/chest", {
	hunger_threshold: 150,
	synthesizing: 0,
	poison_amount: 5,
	name: "Nutriment pump implant",
	desc: "This implant with synthesize and pump into your bloodstream a small amount of nutriment when you are starving.",
	icon_state: "chest_implant",
	implant_color: "#00AA00",
	slot: "stomach",
	origin_tech: "materials=2;powerstorage=2;biotech=2",
});

// /obj/item/organ/cyberimp/chest/nutriment/proc/on_life  (code/modules/surgery/organs/augments_chest.dm:23)  may sleep
rt.def("/obj/item/organ/cyberimp/chest/nutriment/proc/on_life", function* on_life(f: Frame) {
	if (truthy(rt.sv(f, "synthesizing"))) {
		return live(f.dot);
	}
	if (!rt.le(rt.fv(f, "nutrition", rt.sv(f, "owner")), rt.sv(f, "hunger_threshold"))) return f.dot;
	rt.setSv(f, "synthesizing", 1);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>You feel less hungry...</span>"]);
	rt.modField(f, rt.sv(f, "owner"), "nutrition", 50, add);
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	rt.setSv(f, "synthesizing", 0);
	return f.dot;
}, true);

// /obj/item/organ/cyberimp/chest/nutriment/proc/emp_act  (code/modules/surgery/organs/augments_chest.dm:31)  may sleep
rt.def("/obj/item/organ/cyberimp/chest/nutriment/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	if (!truthy(rt.sv(f, "owner"))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "owner")), "add_reagent", ["bad_food", divide(rt.sv(f, "poison_amount"), live(severity))]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You feel like your insides are burning.</span>"]);
	return f.dot;
}, true);

rt.type(9505, "/obj/item/organ/cyberimp/chest/reviver", "/obj/item/organ/cyberimp/chest", {
	revive_cost: 0,
	reviving: 0,
	cooldown: 0,
	name: "Reviver implant",
	desc: "This implant will attempt to revive you if you lose consciousness. For the faint of heart!",
	icon_state: "chest_implant",
	implant_color: "#AD0000",
	origin_tech: "materials=5;programming=4;biotech=4",
	slot: "heartdrive",
});

// /obj/item/organ/cyberimp/chest/reviver/proc/on_life  (code/modules/surgery/organs/augments_chest.dm:59)  may sleep
rt.def("/obj/item/organ/cyberimp/chest/reviver/proc/on_life", function* on_life(f: Frame) {
	if (truthy(rt.sv(f, "reviving"))) {
		if (isEqual(rt.fv(f, "stat", rt.sv(f, "owner")), 1)) {
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/organ/cyberimp/chest/reviver/proc/heal")])), 30]);
		} else {
			rt.setSv(f, "cooldown", add(rt.sv(f, "revive_cost"), rt.worldTime(f)));
			rt.setSv(f, "reviving", 0);
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='notice'>Your reviver implant shuts down and starts recharging. It will be ready again in ＀ seconds.</span>", [divide(rt.sv(f, "revive_cost"), 10)])]);
		}
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "cooldown"), rt.worldTime(f))) {
		return live(f.dot);
	}
	if (!isEqual(rt.fv(f, "stat", rt.sv(f, "owner")), 1)) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "suiciding", rt.sv(f, "owner")))) {
		return live(f.dot);
	}
	rt.setSv(f, "revive_cost", 0);
	rt.setSv(f, "reviving", 1);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>You feel a faint buzzing as your reviver implant starts patching your wounds...</span>"]);
	return f.dot;
}, true);

// /obj/item/organ/cyberimp/chest/reviver/proc/heal  (code/modules/surgery/organs/augments_chest.dm:79)  may sleep
rt.def("/obj/item/organ/cyberimp/chest/reviver/proc/heal", function* heal(f: Frame) {
	if (truthy((yield* g.callName(f, rt.sv(f, "owner"), "getOxyLoss", [])))) {
		yield* g.callName(f, rt.sv(f, "owner"), "adjustOxyLoss", [-5]);
		rt.modSrcVar(f, "revive_cost", 5, add);
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "owner"), "getBruteLoss", [])))) {
		yield* g.callName(f, rt.sv(f, "owner"), "adjustBruteLoss", [-2]);
		rt.modSrcVar(f, "revive_cost", 40, add);
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "owner"), "getFireLoss", [])))) {
		yield* g.callName(f, rt.sv(f, "owner"), "adjustFireLoss", [-2]);
		rt.modSrcVar(f, "revive_cost", 40, add);
	}
	if (!truthy((yield* g.callName(f, rt.sv(f, "owner"), "getToxLoss", [])))) return f.dot;
	yield* g.callName(f, rt.sv(f, "owner"), "adjustToxLoss", [-1]);
	rt.modSrcVar(f, "revive_cost", 40, add);
	return f.dot;
}, true);

// /obj/item/organ/cyberimp/chest/reviver/proc/emp_act  (code/modules/surgery/organs/augments_chest.dm:93)  may sleep
rt.def("/obj/item/organ/cyberimp/chest/reviver/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let H: Value = null;
	f.vars = () => [severity, H];
	if (!truthy(rt.sv(f, "owner"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "reviving"))) {
		rt.modSrcVar(f, "revive_cost", 200, add);
	} else {
		rt.modSrcVar(f, "cooldown", 200, add);
	}
	if (!truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (!((!isEqual(rt.gv(f, "stat", (H = rt.sv(f, "owner"))), 2) && truthy(rt.op(f, "Prob", [], [divide(50, live(severity))]))) && truthy((yield* g.callName(f, live(H), "can_heartattack", []))))) return f.dot;
	yield* g.callName(f, live(H), "set_heartattack", [1]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='userdanger'>You feel a horrible agony in your chest!</span>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/organ/cyberimp/chest/reviver/proc/undo_heart_attack")])), divide(600, live(severity))]);
	return f.dot;
}, true);

// /obj/item/organ/cyberimp/chest/reviver/proc/undo_heart_attack  (code/modules/surgery/organs/augments_chest.dm:109)
rt.def("/obj/item/organ/cyberimp/chest/reviver/proc/undo_heart_attack", function undo_heart_attack(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy((rt.istype((H = rt.sv(f, "owner")), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.callName(f, live(H), "set_heartattack", [0]);
	if (!isEqual(rt.fv(f, "stat", live(H)), 0)) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You feel your heart beating again!</span>"]);
	return f.dot;
});

rt.type(9506, "/obj/item/organ/cyberimp/chest/thrusters", "/obj/item/organ/cyberimp/chest", {
	on: 0,
	ion_trail: null,
	name: "implantable thrusters set",
	desc: "An implantable set of thruster ports. They use the gas from environment or subject's internals for propulsion in zero-gravity areas. Unlike regular jetpack, this device has no stablilzation system.",
	slot: "thrusters",
	icon_state: "imp_jetpack",
	origin_tech: "materials=4;magnets=4;biotech=4;engineering=5",
	implant_overlay: null,
	implant_color: null,
	actions_types: null,
	w_class: 3,
});

// /obj/item/organ/cyberimp/chest/thrusters/proc/<init>  (code/modules/surgery/organs/augments_chest.dm:126)
rt.def("/obj/item/organ/cyberimp/chest/thrusters/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/organ_action/toggle")));
	return f.dot;
});

// /obj/item/organ/cyberimp/chest/thrusters/proc/Insert  (code/modules/surgery/organs/augments_chest.dm:132)  may sleep
rt.def("/obj/item/organ/cyberimp/chest/thrusters/proc/Insert", function* Insert(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "ion_trail"))) {
		rt.setSv(f, "ion_trail", (yield* g.new_(f, T("/datum/effect_system/trail_follow/ion"), [])));
	}
	yield* g.callName(f, rt.sv(f, "ion_trail"), "set_up", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/cyberimp/chest/thrusters/proc/Remove  (code/modules/surgery/organs/augments_chest.dm:139)  may sleep
rt.def("/obj/item/organ/cyberimp/chest/thrusters/proc/Remove", function* Remove(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (truthy(rt.sv(f, "on"))) {
		yield* g.callSrc(f, "toggle", ["silent", 1], rt.Args.Named);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/cyberimp/chest/thrusters/proc/ui_action_click  (code/modules/surgery/organs/augments_chest.dm:143)  may sleep
rt.def("/obj/item/organ/cyberimp/chest/thrusters/proc/ui_action_click", function* ui_action_click(f: Frame) {
	yield* g.srcCall(f, "toggle");
	return f.dot;
}, true);

// /obj/item/organ/cyberimp/chest/thrusters/proc/toggle  (code/modules/surgery/organs/augments_chest.dm:146)  may sleep
rt.def("/obj/item/organ/cyberimp/chest/thrusters/proc/toggle", function* toggle(f: Frame, silent: Value) {
	f.vars = () => [silent];
	if (live(silent) === null) {
		silent = 0;
	}
	if (!truthy(rt.sv(f, "on"))) {
		if (truthy(rt.sv(f, "crit_fail"))) {
			if (!truthy(live(silent))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>Your thrusters set seems to be broken!</span>"]);
			}
			return 0;
		}
		rt.setSv(f, "on", 1);
		if (truthy((yield* g.srcCall(f, "allow_thrust", 0.009999999776482582)))) {
			yield* g.callName(f, rt.sv(f, "ion_trail"), "start", []);
			if (!truthy(live(silent))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>You turn your thrusters set on.</span>"]);
			}
		}
	} else {
		yield* g.callName(f, rt.sv(f, "ion_trail"), "stop", []);
		if (!truthy(live(silent))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>You turn your thrusters set off.</span>"]);
		}
		rt.setSv(f, "on", 0);
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/organ/cyberimp/chest/thrusters/proc/update_icon  (code/modules/surgery/organs/augments_chest.dm:165)  may sleep
rt.def("/obj/item/organ/cyberimp/chest/thrusters/proc/update_icon", function* update_icon(f: Frame) {
	let X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [X, A, $e];
	if (truthy(rt.sv(f, "on"))) {
		rt.setSv(f, "icon_state", "imp_jetpack-on");
	} else {
		rt.setSv(f, "icon_state", "imp_jetpack");
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

// /obj/item/organ/cyberimp/chest/thrusters/proc/allow_thrust  (code/modules/surgery/organs/augments_chest.dm:173)  may sleep
rt.def("/obj/item/organ/cyberimp/chest/thrusters/proc/allow_thrust", function* allow_thrust(f: Frame, num: Value) {
	let _T: Value = null, environment: Value = null, I: Value = null, removed: Value = null;
	f.vars = () => [num, _T, environment, I, removed];
	if ((!truthy(rt.sv(f, "on")) || !truthy(rt.sv(f, "owner")))) {
		return 0;
	}
	if (!truthy((_T = rt.getStep(f, rt.sv(f, "owner"), 0)))) {
		return 0;
	}
	if ((truthy((environment = (yield* g.callName(f, live(_T), "return_air", [])))) && rt.gt((yield* g.callName(f, live(environment), "return_pressure", [])), 30))) {
		return 1;
	}
	if (rt.ge((yield* g.callName(f, rt.sv(f, "owner"), "getPlasma", [])), multiply(live(num), 100))) {
		yield* g.callName(f, rt.sv(f, "owner"), "adjustPlasma", [multiply(rt.neg(live(num)), 100)]);
		return 1;
	}
	if (((truthy((I = rt.fv(f, "internal", rt.sv(f, "owner")))) && truthy(rt.fv(f, "air_contents", live(I)))) && rt.gt((yield* g.callName(f, rt.fv(f, "air_contents", live(I)), "total_moles", [])), live(num)))) {
		if (rt.gt((yield* g.callName(f, (removed = (yield* g.callName(f, rt.fv(f, "air_contents", live(I)), "remove", [live(num)]))), "total_moles", [])), 0.004999999888241291)) {
			yield* g.callName(f, live(_T), "assume_air", [live(removed)]);
			return 1;
		} else {
			yield* g.callName(f, live(_T), "assume_air", [live(removed)]);
		}
	}
	yield* g.callSrc(f, "toggle", ["silent", 1], rt.Args.Named);
	return 0;
}, true);
