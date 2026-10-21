// From code/game/objects/items/weapons/tanks/jetpack.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7447, "/obj/item/weapon/tank/jetpack", "/obj/item/weapon/tank", {
	gas_type: "o2",
	on: 0,
	stabilizers: 0,
	full_speed: 1,
	ion_trail: null,
	name: "jetpack (empty)",
	desc: "A tank of compressed gas for use as propulsion in zero-gravity areas. Use with caution.",
	icon_state: "jetpack",
	item_state: "jetpack",
	w_class: 4,
	distribute_pressure: 21.278248,
	actions_types: null,
});

// /obj/item/weapon/tank/jetpack/proc/<init>  (code/game/objects/items/weapons/tanks/jetpack.dm:8)
rt.def("/obj/item/weapon/tank/jetpack/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/set_internals"), T("/datum/action/item_action/toggle_jetpack"), T("/datum/action/item_action/jetpack_stabilization")));
	return f.dot;
});

// /obj/item/weapon/tank/jetpack/proc/New  (code/game/objects/items/weapons/tanks/jetpack.dm:16)  may sleep
rt.def("/obj/item/weapon/tank/jetpack/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "gas_type"))) {
		yield* g.callName(f, rt.sv(f, "air_contents"), "assert_gas", [rt.sv(f, "gas_type")]);
		rt.setAt(rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), rt.sv(f, "gas_type")), 1, divide(multiply(607.949951171875, rt.sv(f, "volume")), 2436.07666015625));
	}
	rt.setSv(f, "ion_trail", (yield* g.new_(f, T("/datum/effect_system/trail_follow/ion"), [])));
	yield* g.callName(f, rt.sv(f, "ion_trail"), "set_up", [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/tank/jetpack/proc/ui_action_click  (code/game/objects/items/weapons/tanks/jetpack.dm:25)  may sleep
rt.def("/obj/item/weapon/tank/jetpack/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value, action: Value) {
	let $0: any, $1: any;
	f.vars = () => [user, action, $0, $1];
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/toggle_jetpack")) ? 1 : 0))) {
		yield* g.srcCall(f, "cycle", live(user));
	} else {
		if (truthy((rt.istype(live(action), T("/datum/action/item_action/jetpack_stabilization")) ? 1 : 0))) {
			if (truthy(rt.sv(f, "on"))) {
				rt.setSv(f, "stabilizers", (!truthy(rt.sv(f, "stabilizers")) ? 1 : 0));
				$0 = live(user);
				if (truthy(rt.sv(f, "stabilizers"))) {
					$1 = "on";
				} else {
					$1 = "off";
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You turn the jetpack stabilization ＀.</span>", [$1])]);
			}
		} else {
			yield* g.srcCall(f, "toggle_internals", live(user));
		}
	}
	return f.dot;
}, true);

// /obj/item/weapon/tank/jetpack/proc/cycle  (code/game/objects/items/weapons/tanks/jetpack.dm:36)  may sleep
rt.def("/obj/item/weapon/tank/jetpack/proc/cycle", function* cycle(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, X, A, $e];
	if (truthy((yield* g.callName(f, live(user), "incapacitated", [])))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "on"))) {
		yield* g.srcCall(f, "turn_on");
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You turn the jetpack on.</span>"]);
	} else {
		yield* g.srcCall(f, "turn_off");
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You turn the jetpack off.</span>"]);
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

// /obj/item/weapon/tank/jetpack/proc/turn_on  (code/game/objects/items/weapons/tanks/jetpack.dm:52)  may sleep
rt.def("/obj/item/weapon/tank/jetpack/proc/turn_on", function* turn_on(f: Frame) {
	rt.setSv(f, "on", 1);
	rt.setSv(f, "icon_state", fmt("＀-on", [rt.initial(f, live(f.src), "icon_state")]));
	yield* g.callName(f, rt.sv(f, "ion_trail"), "start", []);
	return f.dot;
}, true);

// /obj/item/weapon/tank/jetpack/proc/turn_off  (code/game/objects/items/weapons/tanks/jetpack.dm:58)
rt.def("/obj/item/weapon/tank/jetpack/proc/turn_off", function turn_off(f: Frame) {
	rt.setSv(f, "on", 0);
	rt.setSv(f, "stabilizers", 0);
	rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	rt.callName(f, rt.sv(f, "ion_trail"), "stop", []);
	return f.dot;
});

// /obj/item/weapon/tank/jetpack/proc/allow_thrust  (code/game/objects/items/weapons/tanks/jetpack.dm:62)  may sleep
rt.def("/obj/item/weapon/tank/jetpack/proc/allow_thrust", function* allow_thrust(f: Frame, num: Value, user: Value) {
	let removed: Value = null, _T: Value = null;
	f.vars = () => [num, user, removed, _T];
	if (!truthy(rt.sv(f, "on"))) {
		return live(f.dot);
	}
	if ((rt.lt(live(num), 0.004999999888241291) || rt.lt((yield* g.callName(f, rt.sv(f, "air_contents"), "total_moles", [])), live(num)))) {
		yield* g.srcCall(f, "turn_off");
		return live(f.dot);
	}
	if (rt.lt((yield* g.callName(f, (removed = (yield* g.callName(f, rt.sv(f, "air_contents"), "remove", [live(num)]))), "total_moles", [])), 0.004999999888241291)) {
		yield* g.srcCall(f, "turn_off");
		return live(f.dot);
	}
	yield* g.callName(f, (_T = rt.getStep(f, live(user), 0)), "assume_air", [live(removed)]);
	return 1;
}, true);

// /obj/item/weapon/tank/jetpack/proc/suicide_act  (code/game/objects/items/weapons/tanks/jetpack.dm:79)  may sleep
rt.def("/obj/item/weapon/tank/jetpack/proc/suicide_act", function* suicide_act(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.callName(f, (H = live(f.args[0])), "forcesay", ["WHAT THE FUCK IS CARBON DIOXIDE?"]);
		yield* g.callName(f, live(H), "visible_message", [fmt("<span class='suicide'>＀ is suffocating ＀self with ＀! It looks like ＀ didn't read what that jetpack says!</span>", [live(f.args[0]), (yield* g.callName(f, live(f.args[0]), "p_them", [])), live(f.src), (yield* g.callName(f, live(f.args[0]), "p_they", []))])]);
		return 8;
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });

rt.type(7454, "/obj/item/weapon/tank/jetpack/suit", "/obj/item/weapon/tank/jetpack", {
	temp_air_contents: null,
	tank: null,
	gas_type: null,
	full_speed: 0,
	name: "hardsuit jetpack upgrade",
	desc: "A modular, compact set of thrusters designed to integrate with a hardsuit. It is fueled by a tank inserted into the suit's storage compartment.",
	origin_tech: "materials=4;magnets=4;engineering=5",
	icon_state: "jetpack-mining",
	item_state: "jetpack-black",
	w_class: 3,
	actions_types: null,
	volume: 1,
	slot_flags: null,
});

// /obj/item/weapon/tank/jetpack/suit/proc/<init>  (code/game/objects/items/weapons/tanks/jetpack.dm:139)
rt.def("/obj/item/weapon/tank/jetpack/suit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_jetpack"), T("/datum/action/item_action/jetpack_stabilization")));
	return f.dot;
});

// /obj/item/weapon/tank/jetpack/suit/proc/New  (code/game/objects/items/weapons/tanks/jetpack.dm:148)  may sleep
rt.def("/obj/item/weapon/tank/jetpack/suit/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	rt.setSv(f, "temp_air_contents", rt.sv(f, "air_contents"));
	return f.dot;
}, true);

// /obj/item/weapon/tank/jetpack/suit/proc/cycle  (code/game/objects/items/weapons/tanks/jetpack.dm:156)  may sleep
rt.def("/obj/item/weapon/tank/jetpack/suit/proc/cycle", function* cycle(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/clothing/suit/space/hardsuit")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>＄！ must be connected to a hardsuit!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (!truthy((rt.istype(rt.gv(f, "s_store", (H = live(f.args[0]))), T("/obj/item/weapon/tank/internals")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You need a tank in your suit storage!</span>"]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/tank/jetpack/suit/proc/turn_on  (code/game/objects/items/weapons/tanks/jetpack.dm:167)  may sleep
rt.def("/obj/item/weapon/tank/jetpack/suit/proc/turn_on", function* turn_on(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if ((!truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/clothing/suit/space/hardsuit")) ? 1 : 0)) || !truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "loc")), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		return live(f.dot);
	}
	rt.setSv(f, "tank", rt.gv(f, "s_store", (H = rt.fv(f, "loc", rt.sv(f, "loc")))));
	rt.setSv(f, "air_contents", rt.fv(f, "air_contents", rt.sv(f, "tank")));
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/weapon/tank/jetpack/suit/proc/turn_off  (code/game/objects/items/weapons/tanks/jetpack.dm:177)
rt.def("/obj/item/weapon/tank/jetpack/suit/proc/turn_off", function turn_off(f: Frame) {
	rt.setSv(f, "tank", null);
	rt.setSv(f, "air_contents", rt.sv(f, "temp_air_contents"));
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/item/weapon/tank/jetpack/suit/proc/process  (code/game/objects/items/weapons/tanks/jetpack.dm:182)
rt.def("/obj/item/weapon/tank/jetpack/suit/proc/process", function process(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if ((!truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/clothing/suit/space/hardsuit")) ? 1 : 0)) || !truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "loc")), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		rt.callSrc(f, "turn_off", []);
		return live(f.dot);
	}
	H = rt.fv(f, "loc", rt.sv(f, "loc"));
	if ((!truthy(rt.sv(f, "tank")) || !isEqual(rt.sv(f, "tank"), rt.fv(f, "s_store", live(H))))) {
		rt.callSrc(f, "turn_off", []);
		return live(f.dot);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { waitfor: false });

// /mob/living/carbon/proc/get_jetpack  (code/game/objects/items/weapons/tanks/jetpack.dm:200)
rt.def("/mob/living/carbon/proc/get_jetpack", function get_jetpack(f: Frame) {
	let J: Value = null;
	f.vars = () => [J];
	if (!truthy((rt.istype((J = rt.sv(f, "back")), T("/obj/item/weapon/tank/jetpack")) ? 1 : 0))) return f.dot;
	return live(J);
});

// /mob/living/carbon/human/proc/get_jetpack  (code/game/objects/items/weapons/tanks/jetpack.dm:205)
rt.def("/mob/living/carbon/human/proc/get_jetpack", function get_jetpack(f: Frame) {
	let J: Value = null, C: Value = null;
	f.vars = () => [J, C];
	if ((!truthy((rt.istype((J = rt.callSuper(f, [], rt.Args.Same)), T("/obj/item/weapon/tank/jetpack")) ? 1 : 0)) && truthy((rt.istype(rt.sv(f, "wear_suit"), T("/obj/item/clothing/suit/space/hardsuit")) ? 1 : 0)))) {
		J = rt.gv(f, "jetpack", (C = rt.sv(f, "wear_suit")));
	}
	return live(J);
});
