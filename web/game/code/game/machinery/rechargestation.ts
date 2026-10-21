// From code/game/machinery/rechargestation.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10813, "/obj/machinery/recharge_station", "/obj/machinery", {
	recharge_speed: null,
	repairs: null,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 1000,
	state_open: 1,
	name: "cyborg recharging station",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "borgcharger0",
	density: 0,
	req_access: null,
});

// /obj/machinery/recharge_station/proc/<init>  (code/game/machinery/rechargestation.dm:10)
rt.def("/obj/machinery/recharge_station/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(29));
	return f.dot;
});

// /obj/machinery/recharge_station/proc/New  (code/game/machinery/rechargestation.dm:16)  may sleep
rt.def("/obj/machinery/recharge_station/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/cyborgrecharger"), [null]))), "apply_default_parts", [live(f.src)]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(6727, "/obj/item/weapon/circuitboard/machine/cyborgrecharger", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	def_components: null,
	name: "Cyborg Recharger (Machine Board)",
	build_path: rt.typePath("/obj/machinery/recharge_station"),
	origin_tech: "powerstorage=3;engineering=3",
});

// /obj/item/weapon/circuitboard/machine/cyborgrecharger/proc/<init>  (code/game/machinery/rechargestation.dm:25)
rt.def("/obj/item/weapon/circuitboard/machine/cyborgrecharger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/capacitor"), 2, T("/obj/item/weapon/stock_parts/cell"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1]));
	$0 = $0;
	rt.setSv(f, "def_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/cell"), T("/obj/item/weapon/stock_parts/cell/high")]));
	return f.dot;
});

// /obj/machinery/recharge_station/proc/RefreshParts  (code/game/machinery/rechargestation.dm:35)
rt.def("/obj/machinery/recharge_station/proc/RefreshParts", function RefreshParts(f: Frame) {
	let C: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [C, M, $e];
	rt.setSv(f, "recharge_speed", 0);
	rt.setSv(f, "repairs", 0);
	C = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/capacitor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		rt.modSrcVar(f, "recharge_speed", multiply(rt.fv(f, "rating", live(C)), 100), add);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.modSrcVar(f, "repairs", subtract(rt.fv(f, "rating", live(M)), 1), add);
	}
	rt.endFor(f, 0);
	C = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/cell"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		(rt.modSrcVar(f, "recharge_speed", divide(rt.fv(f, "maxcharge", live(C)), 10000), multiply));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/recharge_station/proc/process  (code/game/machinery/rechargestation.dm:43)  may sleep
rt.def("/obj/machinery/recharge_station/proc/process", function* process(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "is_operational")))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "occupant"))) {
		yield* g.srcCall(f, "process_occupant");
	}
	return 1;
}, true, { waitfor: false });

// /obj/machinery/recharge_station/proc/relaymove  (code/game/machinery/rechargestation.dm:51)  may sleep
rt.def("/obj/machinery/recharge_station/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.fv(f, "stat", live(user)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "open_machine");
	return f.dot;
}, true);

// /obj/machinery/recharge_station/proc/emp_act  (code/game/machinery/rechargestation.dm:56)  may sleep
rt.def("/obj/machinery/recharge_station/proc/emp_act", function* emp_act(f: Frame) {
	if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		if (truthy(rt.sv(f, "occupant"))) {
			yield* g.callName(f, rt.sv(f, "occupant"), "emp_act", [live(f.args[0])]);
		}
		yield* g.srcCall(f, "open_machine");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/machinery/recharge_station/proc/attack_paw  (code/game/machinery/rechargestation.dm:63)  may sleep
rt.def("/obj/machinery/recharge_station/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/machinery/recharge_station/proc/attack_ai  (code/game/machinery/rechargestation.dm:66)  may sleep
rt.def("/obj/machinery/recharge_station/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/machinery/recharge_station/proc/attackby  (code/game/machinery/rechargestation.dm:70)  may sleep
rt.def("/obj/machinery/recharge_station/proc/attackby", function* attackby(f: Frame) {
	if (truthy(rt.sv(f, "state_open"))) {
		if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "borgdecon2", "borgcharger0", live(f.args[0]))))) {
			return live(f.dot);
		}
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_pry_open", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["P", "user", "params"] });

// /obj/machinery/recharge_station/proc/attack_hand  (code/game/machinery/rechargestation.dm:84)  may sleep
rt.def("/obj/machinery/recharge_station/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy((yield* g.callSuper(f, [null, live(user), null, 1, "set_machine", 0], rt.Args.Named)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "toggle_open");
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

// /obj/machinery/recharge_station/proc/toggle_open  (code/game/machinery/rechargestation.dm:92)  may sleep
rt.def("/obj/machinery/recharge_station/proc/toggle_open", function* toggle_open(f: Frame) {
	if (truthy(rt.sv(f, "state_open"))) {
		yield* g.srcCall(f, "close_machine");
	} else {
		yield* g.srcCall(f, "open_machine");
	}
	return f.dot;
}, true);

// /obj/machinery/recharge_station/proc/open_machine  (code/game/machinery/rechargestation.dm:97)  may sleep
rt.def("/obj/machinery/recharge_station/proc/open_machine", function* open_machine(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "use_power", 1);
	return f.dot;
}, true);

// /obj/machinery/recharge_station/proc/close_machine  (code/game/machinery/rechargestation.dm:101)  may sleep
rt.def("/obj/machinery/recharge_station/proc/close_machine", function* close_machine(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	if (truthy(rt.sv(f, "panel_open"))) return f.dot;
	R = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/mob/living/silicon/robot"));
	if (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		yield* g.callName(f, live(R), "forceMove", [live(f.src)]);
		rt.setSv(f, "occupant", live(R));
		rt.setSv(f, "use_power", 2);
		yield* g.srcCall(f, "add_fingerprint", live(R));
	}
	rt.endFor(f, 0);
	rt.setSv(f, "state_open", 0);
	rt.setSv(f, "density", 1);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/recharge_station/proc/update_icon  (code/game/machinery/rechargestation.dm:113)
rt.def("/obj/machinery/recharge_station/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.callSrc(f, "is_operational", []))) {
		if (truthy(rt.sv(f, "state_open"))) {
			rt.setSv(f, "icon_state", "borgcharger0");
		} else {
			if (truthy(rt.sv(f, "occupant"))) {
				$0 = "borgcharger1";
			} else {
				$0 = "borgcharger2";
			}
			rt.setSv(f, "icon_state", $0);
		}
	} else {
		if (truthy(rt.sv(f, "state_open"))) {
			$0 = "borgcharger-u0";
		} else {
			$0 = "borgcharger-u1";
		}
		rt.setSv(f, "icon_state", $0);
	}
	return f.dot;
});

// /obj/machinery/recharge_station/proc/power_change  (code/game/machinery/rechargestation.dm:122)
rt.def("/obj/machinery/recharge_station/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/recharge_station/proc/process_occupant  (code/game/machinery/rechargestation.dm:127)  may sleep
rt.def("/obj/machinery/recharge_station/proc/process_occupant", function* process_occupant(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (!truthy(rt.sv(f, "occupant"))) return f.dot;
	R = rt.sv(f, "occupant");
	yield* g.srcCall(f, "restock_modules");
	if (truthy(rt.sv(f, "repairs"))) {
		yield* g.callName(f, live(R), "heal_bodypart_damage", [rt.sv(f, "repairs"), subtract(rt.sv(f, "repairs"), 1)]);
	}
	if (!truthy(rt.fv(f, "cell", live(R)))) return f.dot;
	rt.setFv(f, "charge", rt.fv(f, "cell", live(R)), (yield* g.call(f, P("/proc/min"), null, [add(rt.gv(f, "charge", rt.fv(f, "cell", live(R))), rt.sv(f, "recharge_speed")), rt.gv(f, "maxcharge", rt.fv(f, "cell", live(R)))])));
	return f.dot;
}, true);

// /obj/machinery/recharge_station/proc/restock_modules  (code/game/machinery/rechargestation.dm:136)  may sleep
rt.def("/obj/machinery/recharge_station/proc/restock_modules", function* restock_modules(f: Frame) {
	let R: Value = null, coeff: Value = null;
	f.vars = () => [R, coeff];
	if (!truthy(rt.sv(f, "occupant"))) return f.dot;
	if (!(truthy((R = rt.sv(f, "occupant"))) && truthy(rt.fv(f, "module", live(R))))) return f.dot;
	coeff = multiply(rt.sv(f, "recharge_speed"), 0.004999999888241291);
	yield* g.callName(f, rt.fv(f, "module", live(R)), "respawn_consumable", [live(R), live(coeff)]);
	return f.dot;
}, true);
