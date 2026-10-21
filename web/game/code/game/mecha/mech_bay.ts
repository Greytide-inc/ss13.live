// From code/game/mecha/mech_bay.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4551, "/turf/open/floor/mech_bay_recharge_floor", "/turf/open/floor", {
	name: "mech bay recharge station",
	icon: rt.rsc("icons/turf/floors.dmi"),
	icon_state: "recharge_floor",
});

// /turf/open/floor/mech_bay_recharge_floor/proc/break_tile  (code/game/mecha/mech_bay.dm:7)  may sleep
rt.def("/turf/open/floor/mech_bay_recharge_floor/proc/break_tile", function* break_tile(f: Frame) {
	yield* g.callName(f, live(f.src), "ChangeTurf", [T("/turf/open/floor/plating")]);
	return f.dot;
}, true);

rt.type(10872, "/obj/machinery/mech_bay_recharge_port", "/obj/machinery", {
	recharging_mech: null,
	recharge_console: null,
	max_charge: 50,
	on: 0,
	repairability: 0,
	recharging_turf: null,
	anchored: 1,
	name: "mech bay power port",
	density: 1,
	dir: 4,
	icon: rt.rsc("icons/mecha/mech_bay.dmi"),
	icon_state: "recharge_port",
});

// /obj/machinery/mech_bay_recharge_port/proc/New  (code/game/mecha/mech_bay.dm:28)  may sleep
rt.def("/obj/machinery/mech_bay_recharge_port/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/mech_recharger"), [null]))), "apply_default_parts", [live(f.src)]);
	rt.setSv(f, "recharging_turf", rt.getStep(f, rt.sv(f, "loc"), rt.sv(f, "dir")));
	return f.dot;
}, true);

rt.type(6742, "/obj/item/weapon/circuitboard/machine/mech_recharger", "/obj/item/weapon/circuitboard/machine", {
	name: "Mechbay Recharger (Machine Board)",
	build_path: rt.typePath("/obj/machinery/mech_bay_recharge_port"),
	origin_tech: "programming=3;powerstorage=3;engineering=3",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/mech_recharger/proc/<init>  (code/game/mecha/mech_bay.dm:37)
rt.def("/obj/item/weapon/circuitboard/machine/mech_recharger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/capacitor"), 5]));
	return f.dot;
});

// /obj/machinery/mech_bay_recharge_port/proc/RefreshParts  (code/game/mecha/mech_bay.dm:43)
rt.def("/obj/machinery/mech_bay_recharge_port/proc/RefreshParts", function RefreshParts(f: Frame) {
	let MC: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [MC, C, $e];
	MC = null;
	C = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/capacitor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		MC = rt.modify(live(MC), rt.fv(f, "rating", live(C)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "max_charge", multiply(live(MC), 25));
	return f.dot;
});

// /obj/machinery/mech_bay_recharge_port/proc/process  (code/game/mecha/mech_bay.dm:48)  may sleep
rt.def("/obj/machinery/mech_bay_recharge_port/proc/process", function* process(f: Frame) {
	let delta: Value = null;
	f.vars = () => [delta];
	if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 2)) || !truthy(rt.sv(f, "recharge_console")))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "recharging_mech"))) {
		rt.setSv(f, "recharging_mech", rt.locateIn(f, T("/obj/mecha"), rt.sv(f, "recharging_turf")));
		if (truthy(rt.sv(f, "recharging_mech"))) {
			yield* g.callName(f, rt.sv(f, "recharge_console"), "update_icon", []);
		}
	}
	if (!(truthy(rt.sv(f, "recharging_mech")) && truthy(rt.fv(f, "cell", rt.sv(f, "recharging_mech"))))) return f.dot;
	if (rt.lt(rt.gv(f, "charge", rt.fv(f, "cell", rt.sv(f, "recharging_mech"))), rt.gv(f, "maxcharge", rt.fv(f, "cell", rt.sv(f, "recharging_mech"))))) {
		delta = (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "max_charge"), subtract(rt.gv(f, "maxcharge", rt.fv(f, "cell", rt.sv(f, "recharging_mech"))), rt.gv(f, "charge", rt.fv(f, "cell", rt.sv(f, "recharging_mech"))))]));
		yield* g.callName(f, rt.sv(f, "recharging_mech"), "give_power", [live(delta)]);
		yield* g.srcCall(f, "use_power", multiply(live(delta), 150));
	} else {
		yield* g.callName(f, rt.sv(f, "recharge_console"), "update_icon", []);
	}
	if (isEqual(rt.fv(f, "loc", rt.sv(f, "recharging_mech")), rt.sv(f, "recharging_turf"))) return f.dot;
	rt.setSv(f, "recharging_mech", null);
	yield* g.callName(f, rt.sv(f, "recharge_console"), "update_icon", []);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/mech_bay_recharge_port/proc/attackby  (code/game/mecha/mech_bay.dm:67)  may sleep
rt.def("/obj/machinery/mech_bay_recharge_port/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "recharge_port-o", "recharge_port", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_change_direction_wrench", live(f.args[1]), live(f.args[0]))))) {
		rt.setSv(f, "recharging_turf", rt.getStep(f, rt.sv(f, "loc"), rt.sv(f, "dir")));
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

rt.type(10417, "/obj/machinery/computer/mech_bay_power_console", "/obj/machinery/computer", {
	recharge_port: null,
	icon_screen: "recharge_comp",
	icon_keyboard: "rd_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/mech_bay_power_console"),
	light_color: "#E17DE1",
	name: "mech bay power control console",
	desc: "Used to control mechbay power ports.",
});

// /obj/machinery/computer/mech_bay_power_console/proc/attack_ai  (code/game/mecha/mech_bay.dm:91)  may sleep
rt.def("/obj/machinery/computer/mech_bay_power_console/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "interact", live(user)));
}, true);

// /obj/machinery/computer/mech_bay_power_console/proc/attack_hand  (code/game/mecha/mech_bay.dm:94)  may sleep
rt.def("/obj/machinery/computer/mech_bay_power_console/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/mech_bay_power_console/proc/ui_interact  (code/game/mecha/mech_bay.dm:99)  may sleep
rt.def("/obj/machinery/computer/mech_bay_power_console/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("default_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "mech_bay_power_console", "Mech Bay Power Control Console", 400, 170, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/mech_bay_power_console/proc/ui_act  (code/game/mecha/mech_bay.dm:105)  may sleep
rt.def("/obj/machinery/computer/mech_bay_power_console/proc/ui_act", function* ui_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "reconnect") {
		yield* g.srcCall(f, "reconnect");
		f.dot = 1;
		yield* g.srcCall(f, "update_icon");
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/computer/mech_bay_power_console/proc/ui_data  (code/game/mecha/mech_bay.dm:114)
rt.def("/obj/machinery/computer/mech_bay_power_console/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	f.vars = () => [data];
	data = rt.list();
	if ((truthy(rt.sv(f, "recharge_port")) && !(!truthy(rt.sv(f, "recharge_port")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "recharge_port")))))) {
		rt.setAt(live(data), "recharge_port", rt.alist(f, ["mech", null]));
		if ((truthy(rt.fv(f, "recharging_mech", rt.sv(f, "recharge_port"))) && !(!truthy(rt.fv(f, "recharging_mech", rt.sv(f, "recharge_port"))) || truthy(rt.gv(f, "gc_destroyed", rt.fv(f, "recharging_mech", rt.sv(f, "recharge_port"))))))) {
			rt.setAt(rt.at(live(data), "recharge_port"), "mech", rt.alist(f, ["health", rt.gv(f, "obj_integrity", rt.fv(f, "recharging_mech", rt.sv(f, "recharge_port"))), "max_integrity", rt.gv(f, "max_integrity", rt.fv(f, "recharging_mech", rt.sv(f, "recharge_port"))), "cell", null]));
			if ((truthy(rt.gv(f, "cell", rt.fv(f, "recharging_mech", rt.sv(f, "recharge_port")))) && !(!truthy(rt.gv(f, "cell", rt.fv(f, "recharging_mech", rt.sv(f, "recharge_port")))) || truthy(rt.gv(f, "gc_destroyed", rt.gv(f, "cell", rt.fv(f, "recharging_mech", rt.sv(f, "recharge_port")))))))) {
				rt.setAt(rt.index(rt.at(live(data), "recharge_port"), "mech"), "cell", rt.alist(f, ["critfail", rt.gv(f, "crit_fail", rt.gv(f, "cell", rt.fv(f, "recharging_mech", rt.sv(f, "recharge_port")))), "charge", rt.gv(f, "charge", rt.gv(f, "cell", rt.fv(f, "recharging_mech", rt.sv(f, "recharge_port")))), "maxcharge", rt.gv(f, "maxcharge", rt.gv(f, "cell", rt.fv(f, "recharging_mech", rt.sv(f, "recharge_port"))))]));
			}
		}
	}
	return live(data);
});

// /obj/machinery/computer/mech_bay_power_console/proc/reconnect  (code/game/mecha/mech_bay.dm:131)
rt.def("/obj/machinery/computer/mech_bay_power_console/proc/reconnect", function reconnect(f: Frame) {
	let D: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [D, A, $e];
	if (truthy(rt.sv(f, "recharge_port"))) {
		return live(f.dot);
	}
	rt.setSv(f, "recharge_port", rt.locateIn(f, T("/obj/machinery/mech_bay_recharge_port"), rt.call(f, P("/proc/range"), null, [1])));
	if (!truthy(rt.sv(f, "recharge_port"))) {
		D = null;
		rt.forList(f, 0, rt.gl("cardinal"));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			A = rt.getStep(f, (A = rt.getStep(f, live(f.src), live(D))), live(D));
			rt.setSv(f, "recharge_port", rt.locateIn(f, T("/obj/machinery/mech_bay_recharge_port"), live(A)));
			if (truthy(rt.sv(f, "recharge_port"))) {
				break;
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.sv(f, "recharge_port"))) return f.dot;
	if (!truthy(rt.fv(f, "recharge_console", rt.sv(f, "recharge_port")))) {
		rt.setFv(f, "recharge_console", rt.sv(f, "recharge_port"), live(f.src));
	} else {
		rt.setSv(f, "recharge_port", null);
	}
	return f.dot;
});

// /obj/machinery/computer/mech_bay_power_console/proc/update_icon  (code/game/mecha/mech_bay.dm:146)
rt.def("/obj/machinery/computer/mech_bay_power_console/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (((((!truthy(rt.sv(f, "recharge_port")) || !truthy(rt.fv(f, "recharging_mech", rt.sv(f, "recharge_port")))) || !truthy(rt.gv(f, "cell", rt.fv(f, "recharging_mech", rt.sv(f, "recharge_port"))))) || !rt.lt(rt.gv(f, "charge", rt.gv(f, "cell", rt.fv(f, "recharging_mech", rt.sv(f, "recharge_port")))), rt.gv(f, "maxcharge", rt.gv(f, "cell", rt.fv(f, "recharging_mech", rt.sv(f, "recharge_port")))))) || truthy(rt.bitAnd(rt.sv(f, "stat"), 3)))) {
		return live(f.dot);
	}
	rt.callSrc(f, "add_overlay", ["recharge_comp_on"]);
	return f.dot;
});

// /obj/machinery/computer/mech_bay_power_console/proc/Initialize  (code/game/mecha/mech_bay.dm:152)  may sleep
rt.def("/obj/machinery/computer/mech_bay_power_console/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "reconnect");
	return f.dot;
}, true);
