// From code/game/machinery/recharger.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10812, "/obj/machinery/recharger", "/obj/machinery", {
	charging: null,
	recharge_coeff: 1,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 4,
	active_power_usage: 250,
	name: "recharger",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "recharger0",
	desc: "A charging dock for energy based weaponry.",
}, { global: { allowed_devices: 760 } });

// /obj/machinery/recharger/proc/Initialize  (code/game/machinery/recharger.dm:15)  may sleep
rt.def("/obj/machinery/recharger/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/recharger"), []))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6726, "/obj/item/weapon/circuitboard/machine/recharger", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Weapon Recharger (Machine Board)",
	build_path: rt.typePath("/obj/machinery/recharger"),
	origin_tech: "powerstorage=4;engineering=3;materials=4",
});

// /obj/item/weapon/circuitboard/machine/recharger/proc/<init>  (code/game/machinery/recharger.dm:23)
rt.def("/obj/item/weapon/circuitboard/machine/recharger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/capacitor"), 1]));
	return f.dot;
});

// /obj/machinery/recharger/proc/RefreshParts  (code/game/machinery/recharger.dm:26)
rt.def("/obj/machinery/recharger/proc/RefreshParts", function RefreshParts(f: Frame) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	C = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/capacitor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		rt.setSv(f, "recharge_coeff", rt.fv(f, "rating", live(C)));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/recharger/proc/attackby  (code/game/machinery/recharger.dm:30)  may sleep
rt.def("/obj/machinery/recharger/proc/attackby", function* attackby(f: Frame) {
	let allowed: Value = null, a: Value = null, E: Value = null;
	let $0: any, $1: any;
	f.vars = () => [allowed, a, E, $0, $1];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "charging"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Remove the charging item first!</span>"]);
			return live(f.dot);
		}
		rt.setSv(f, "anchored", (!truthy(rt.sv(f, "anchored")) ? 1 : 0));
		yield* g.srcCall(f, "power_change");
		$0 = live(f.args[1]);
		if (truthy(rt.sv(f, "anchored"))) {
			$1 = "attached";
		} else {
			$1 = "detached";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ ＀.</span>", [$1, live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
		return live(f.dot);
	}
	if (truthy((allowed = (yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(f.args[0]), rt.gl("allowed_devices")]))))) {
		if (truthy(rt.sv(f, "anchored"))) {
			if ((truthy(rt.sv(f, "charging")) || truthy(rt.sv(f, "panel_open")))) {
				return 1;
			}
			if ((!truthy((yield* g.call(f, P("/proc/isarea"), null, [(a = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])))]))) || isEqual(rt.fv(f, "power_equip", live(a)), 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ blinks red as you try to insert ＀.</span>", [live(f.src), live(f.args[0])])]);
				return 1;
			}
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/gun/energy")) ? 1 : 0))) {
				if (!truthy(rt.gv(f, "can_charge", (E = live(f.args[0]))))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Your gun has no external power connector.</span>"]);
					return 1;
				}
			}
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return 1;
			}
			rt.setFv(f, "loc", live(f.args[0]), live(f.src));
			rt.setSv(f, "charging", live(f.args[0]));
			rt.setSv(f, "use_power", 2);
			yield* g.callSrc(f, "update_icon", ["scan", 1], rt.Args.Named);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ isn't connected to anything!</span>", [live(f.src)])]);
		}
		return 1;
	}
	if ((truthy(rt.sv(f, "anchored")) && !truthy(rt.sv(f, "charging")))) {
		if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "rechargeropen", "recharger0", live(f.args[0]))))) {
			return live(f.dot);
		}
		if ((truthy(rt.sv(f, "panel_open")) && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0)))) {
			yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]));
			return live(f.dot);
		}
		if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
			return live(f.dot);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["G", "user", "params"] });

// /obj/machinery/recharger/proc/attack_hand  (code/game/machinery/recharger.dm:82)  may sleep
rt.def("/obj/machinery/recharger/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if (!truthy(rt.sv(f, "charging"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "charging"), "update_icon", []);
	rt.setFv(f, "loc", rt.sv(f, "charging"), rt.sv(f, "loc"));
	yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "charging")]);
	rt.setSv(f, "charging", null);
	rt.setSv(f, "use_power", 1);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/recharger/proc/attack_paw  (code/game/machinery/recharger.dm:95)  may sleep
rt.def("/obj/machinery/recharger/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/machinery/recharger/proc/attack_tk  (code/game/machinery/recharger.dm:99)  may sleep
rt.def("/obj/machinery/recharger/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "charging"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "charging"), "update_icon", []);
	rt.setFv(f, "loc", rt.sv(f, "charging"), rt.sv(f, "loc"));
	rt.setSv(f, "charging", null);
	rt.setSv(f, "use_power", 1);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/recharger/proc/process  (code/game/machinery/recharger.dm:106)  may sleep
rt.def("/obj/machinery/recharger/proc/process", function* process(f: Frame) {
	let using_power: Value = null, C: Value = null, E: Value = null, R: Value = null;
	f.vars = () => [using_power, C, E, R];
	if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 3)) || !truthy(rt.sv(f, "anchored")))) {
		return live(f.dot);
	}
	using_power = 0;
	if (!truthy(rt.sv(f, "charging"))) return f.dot;
	if (truthy((C = (yield* g.callName(f, rt.sv(f, "charging"), "get_cell", []))))) {
		if (rt.lt(rt.fv(f, "charge", live(C)), rt.fv(f, "maxcharge", live(C)))) {
			yield* g.callName(f, live(C), "give", [multiply(rt.fv(f, "chargerate", live(C)), rt.sv(f, "recharge_coeff"))]);
			yield* g.srcCall(f, "use_power", multiply(250, rt.sv(f, "recharge_coeff")));
			using_power = 1;
		}
		yield* g.srcCall(f, "update_icon", live(using_power));
	}
	if (truthy((rt.istype(rt.sv(f, "charging"), T("/obj/item/weapon/gun/energy")) ? 1 : 0))) {
		yield* g.callName(f, (E = rt.sv(f, "charging")), "recharge_newshot", []);
		return live(f.dot);
	}
	if (!truthy((rt.istype(rt.sv(f, "charging"), T("/obj/item/ammo_box/magazine/recharge")) ? 1 : 0))) return f.dot;
	if (rt.lt(rt.getLen(f, rt.gv(f, "stored_ammo", (R = rt.sv(f, "charging")))), rt.fv(f, "max_ammo", live(R)))) {
		rt.modField(f, live(R), "stored_ammo", (yield* g.new_(f, rt.fv(f, "ammo_type", live(R)), [live(R)])), add);
		yield* g.srcCall(f, "use_power", multiply(200, rt.sv(f, "recharge_coeff")));
		using_power = 1;
	}
	yield* g.srcCall(f, "update_icon", live(using_power));
	return live(f.dot);
}, true, { waitfor: false });

// /obj/machinery/recharger/proc/power_change  (code/game/machinery/recharger.dm:132)
rt.def("/obj/machinery/recharger/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/recharger/proc/emp_act  (code/game/machinery/recharger.dm:136)  may sleep
rt.def("/obj/machinery/recharger/proc/emp_act", function* emp_act(f: Frame) {
	let E: Value = null, B: Value = null;
	f.vars = () => [E, B];
	if ((!truthy(rt.bitAnd(rt.sv(f, "stat"), 3)) && truthy(rt.sv(f, "anchored")))) {
		if (truthy((rt.istype(rt.sv(f, "charging"), T("/obj/item/weapon/gun/energy")) ? 1 : 0))) {
			if (truthy(rt.gv(f, "cell", (E = rt.sv(f, "charging"))))) {
				yield* g.callName(f, rt.fv(f, "cell", live(E)), "emp_act", [live(f.args[0])]);
			}
		} else {
			if (truthy((rt.istype(rt.sv(f, "charging"), T("/obj/item/weapon/melee/baton")) ? 1 : 0))) {
				if (truthy(rt.gv(f, "cell", (B = rt.sv(f, "charging"))))) {
					rt.setFv(f, "charge", rt.fv(f, "cell", live(B)), 0);
				}
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/machinery/recharger/proc/update_icon  (code/game/machinery/recharger.dm:150)
rt.def("/obj/machinery/recharger/proc/update_icon", function update_icon(f: Frame, using_power: Value, scan: Value) {
	f.vars = () => [using_power];
	if (live(using_power) === null) {
		using_power = 0;
	}
	if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 3)) || !truthy(rt.sv(f, "anchored")))) {
		rt.setSv(f, "icon_state", "rechargeroff");
		return live(f.dot);
	}
	if (truthy(live(scan))) {
		rt.setSv(f, "icon_state", "rechargeroff");
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "panel_open"))) {
		rt.setSv(f, "icon_state", "rechargeropen");
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "charging"))) {
		if (truthy(live(using_power))) {
			rt.setSv(f, "icon_state", "recharger1");
		} else {
			rt.setSv(f, "icon_state", "recharger2");
		}
		return live(f.dot);
	}
	rt.setSv(f, "icon_state", "recharger0");
	return f.dot;
});
