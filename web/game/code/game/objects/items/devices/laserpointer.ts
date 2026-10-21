// From code/game/objects/items/devices/laserpointer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9254, "/obj/item/device/laser_pointer", "/obj/item/device", {
	pointer_icon_state: null,
	pointer_loc: null,
	energy: 5,
	max_energy: 5,
	effectchance: 33,
	recharging: 0,
	recharge_locked: 0,
	diode: null,
	flags: 68,
	name: "laser pointer",
	desc: "Don't shine it in your eyes!",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "pointer",
	item_state: "pen",
	slot_flags: 512,
	materials: null,
	w_class: 2,
	origin_tech: "combat=1;magnets=2",
});

// /obj/item/device/laser_pointer/proc/<init>  (code/game/objects/items/devices/laserpointer.dm:10)
rt.def("/obj/item/device/laser_pointer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 500]));
	return f.dot;
});

// /obj/item/device/laser_pointer/proc/New  (code/game/objects/items/devices/laserpointer.dm:32)  may sleep
rt.def("/obj/item/device/laser_pointer/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "diode", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/micro_laser"), [live(f.src)])));
	if (truthy(rt.sv(f, "pointer_icon_state"))) return f.dot;
	rt.setSv(f, "pointer_icon_state", rt.op(f, "PickUnweighted", [4], ["red_laser", "green_laser", "blue_laser", "purple_laser"]));
	return f.dot;
}, true);

rt.type(9259, "/obj/item/device/laser_pointer/upgraded", "/obj/item/device/laser_pointer", {});

// /obj/item/device/laser_pointer/upgraded/proc/New  (code/game/objects/items/devices/laserpointer.dm:38)  may sleep
rt.def("/obj/item/device/laser_pointer/upgraded/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "diode", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/micro_laser/ultra"), [])));
	return f.dot;
}, true);

// /obj/item/device/laser_pointer/proc/attackby  (code/game/objects/items/devices/laserpointer.dm:42)  may sleep
rt.def("/obj/item/device/laser_pointer/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/stock_parts/micro_laser")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "diode"))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
				return live(f.dot);
			}
			rt.setSv(f, "diode", live(f.args[0]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You install a ＀ in ＀.</span>", [rt.fv(f, "name", rt.sv(f, "diode")), live(f.src)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ already has a diode installed.</span>", [live(f.src)])]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			if (truthy(rt.sv(f, "diode"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You remove the ＀ from ％！.</span>", [rt.fv(f, "name", rt.sv(f, "diode")), live(f.src)])]);
				rt.setFv(f, "loc", rt.sv(f, "diode"), rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0));
				rt.setSv(f, "diode", null);
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/device/laser_pointer/proc/afterattack  (code/game/objects/items/devices/laserpointer.dm:60)  may sleep
rt.def("/obj/item/device/laser_pointer/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value, params: Value) {
	f.vars = () => [target, user, flag, params];
	yield* g.srcCall(f, "laser_act", live(target), live(user), live(params));
	return f.dot;
}, true);

// /obj/item/device/laser_pointer/proc/laser_act  (code/game/objects/items/devices/laserpointer.dm:63)  may sleep
rt.def("/obj/item/device/laser_pointer/proc/laser_act", function* laser_act(f: Frame, target: Value, user: Value, params: Value) {
	let H: Value = null, outmsg: Value = null, targloc: Value = null, C: Value = null, severity: Value = null, S: Value = null, I: Value = null, click_params: Value = null;
	f.vars = () => [target, user, params, H, outmsg, targloc, C, severity, S, I, click_params];
	if (!truthy((rt.isIn(f, live(user), (yield* g.call(f, P("/proc/viewers"), null, [7, live(target)]))) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "diode"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You point ＀ at ＀, but nothing happens!</span>", [live(f.src), live(target)])]);
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(user), "IsAdvancedToolUser", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You don't have the dexterity to do this!</span>"]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if ((truthy((yield* g.callName(f, rt.gv(f, "dna", (H = live(user))), "check_mutation", ["Hulk"]))) || truthy((rt.isIn(f, 11, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Your fingers can't press the button!</span>"]);
			return live(f.dot);
		}
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if (truthy(rt.sv(f, "recharge_locked"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You point ＀ at ＀, but it's still charging.</span>", [live(f.src), live(target)])]);
		return live(f.dot);
	}
	outmsg = null;
	targloc = rt.getStep(f, live(target), 0);
	if (truthy((rt.istype(live(target), T("/mob/living/carbon")) ? 1 : 0))) {
		C = live(target);
		if (isEqual(rt.fv(f, "zone_selected", live(user)), "eyes")) {
			yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(C), "shone in the eyes", live(f.src)]);
			severity = 1;
			if (truthy(rt.op(f, "Prob", [], [33]))) {
				severity = 2;
			} else {
				if (truthy(rt.op(f, "Prob", [], [50]))) {
					severity = 0;
				}
			}
			if ((truthy(rt.op(f, "Prob", [], [multiply(rt.sv(f, "effectchance"), rt.fv(f, "rating", rt.sv(f, "diode")))])) && truthy((yield* g.callName(f, live(C), "flash_act", [live(severity)]))))) {
				outmsg = fmt("<span class='notice'>You blind ＀ by shining ＀ in their eyes.</span>", [live(C), live(f.src)]);
			} else {
				outmsg = fmt("<span class='warning'>You fail to blind ＀ by shining ＀ at their eyes!</span>", [live(C), live(f.src)]);
			}
		}
	} else {
		if (truthy((rt.istype(live(target), T("/mob/living/silicon/robot")) ? 1 : 0))) {
			S = live(target);
			if (truthy(rt.op(f, "Prob", [], [multiply(rt.sv(f, "effectchance"), rt.fv(f, "rating", rt.sv(f, "diode")))]))) {
				yield* g.callName(f, live(S), "flash_act", ["affect_silicon", 1], rt.Args.Named);
				yield* g.callName(f, live(S), "Knockdown", [(yield* g.call(f, P("/proc/rand"), null, [100, 200]))]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(S), "<span class='danger'>Your sensors were overloaded by a laser!</span>"]);
				outmsg = fmt("<span class='notice'>You overload ＀ by shining ＀ at their sensors.</span>", [live(S), live(f.src)]);
				yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(S), "shone in the sensors", live(f.src)]);
			} else {
				outmsg = fmt("<span class='warning'>You fail to overload ＀ by shining ＀ at their sensors!</span>", [live(S), live(f.src)]);
			}
		} else {
			if (truthy((rt.istype(live(target), T("/obj/machinery/camera")) ? 1 : 0))) {
				C = live(target);
				if (truthy(rt.op(f, "Prob", [], [multiply(rt.sv(f, "effectchance"), rt.fv(f, "rating", rt.sv(f, "diode")))]))) {
					yield* g.callName(f, live(C), "emp_act", [1]);
					outmsg = fmt("<span class='notice'>You hit the lens of ＀ with ＀, temporarily disabling the camera!</span>", [live(C), live(f.src)]);
					yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(C), "EMPed", live(f.src)]);
				} else {
					outmsg = fmt("<span class='warning'>You miss the lens of ＀ with ＀!</span>", [live(C), live(f.src)]);
				}
			}
		}
	}
	rt.setSv(f, "icon_state", fmt("pointer_＀", [rt.sv(f, "pointer_icon_state")]));
	I = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/obj/projectiles.dmi"), live(targloc), rt.sv(f, "pointer_icon_state"), 10]));
	if (truthy((click_params = (yield* g.call(f, P("/proc/params2list"), null, [live(params)]))))) {
		if (truthy(rt.at(live(click_params), "icon-x"))) {
			rt.setFv(f, "pixel_x", live(I), subtract((yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(click_params), "icon-x")])), 16));
		}
		if (truthy(rt.at(live(click_params), "icon-y"))) {
			rt.setFv(f, "pixel_y", live(I), subtract((yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(click_params), "icon-y")])), 16));
		}
	} else {
		rt.setFv(f, "pixel_x", live(I), add(rt.fv(f, "pixel_x", live(target)), (yield* g.call(f, P("/proc/rand"), null, [-5, 5]))));
		rt.setFv(f, "pixel_y", live(I), add(rt.fv(f, "pixel_y", live(target)), (yield* g.call(f, P("/proc/rand"), null, [-5, 5]))));
	}
	if (truthy(live(outmsg))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), live(outmsg)]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>You point ＀ at ＀.</span>", [live(f.src), live(target)])]);
	}
	(rt.modSrcVar(f, "energy", 1, subtract));
	if (rt.le(rt.sv(f, "energy"), rt.sv(f, "max_energy"))) {
		if (!truthy(rt.sv(f, "recharging"))) {
			rt.setSv(f, "recharging", 1);
			if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
				rt.setFv(f, "isprocessing", live(f.src), 1);
				rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
			}
		}
		if (rt.le(rt.sv(f, "energy"), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀'s battery is overused, it needs time to recharge!</span>", [live(f.src)])]);
			rt.setSv(f, "recharge_locked", 1);
		}
	}
	yield* g.call(f, P("/proc/flick_overlay_view"), null, [live(I), live(targloc), 10]);
	rt.setSv(f, "icon_state", "pointer");
	return f.dot;
}, true);

// /obj/item/device/laser_pointer/proc/process  (code/game/objects/items/devices/laserpointer.dm:159)
rt.def("/obj/item/device/laser_pointer/proc/process", function process(f: Frame) {
	if (!truthy(rt.op(f, "Prob", [], [subtract(20, multiply(rt.sv(f, "recharge_locked"), 5))]))) return f.dot;
	if (!rt.ge((rt.modSrcVar(f, "energy", 1, add)), rt.sv(f, "max_energy"))) return f.dot;
	rt.setSv(f, "energy", rt.sv(f, "max_energy"));
	rt.setSv(f, "recharging", 0);
	rt.setSv(f, "recharge_locked", 0);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { waitfor: false });
