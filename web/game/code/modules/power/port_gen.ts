// From code/modules/power/port_gen.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10313, "/obj/machinery/power/port_gen", "/obj/machinery/power", {
	active: 0,
	power_gen: 5000,
	recent_fault: 0,
	power_output: 1,
	consumption: 0,
	anchored: 0,
	name: "portable generator",
	desc: "A portable generator for emergency backup power.",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "portgen0",
	density: 1,
	use_power: 0,
});

// /obj/machinery/power/port_gen/proc/process  (code/modules/power/port_gen.dm:31)  may sleep
rt.def("/obj/machinery/power/port_gen/proc/process", function* process(f: Frame) {
	if (((((truthy(rt.sv(f, "active")) && truthy((yield* g.srcCall(f, "HasFuel")))) && !truthy(rt.sv(f, "crit_fail"))) && truthy(rt.sv(f, "anchored"))) && truthy(rt.sv(f, "powernet")))) {
		yield* g.srcCall(f, "add_avail", multiply(rt.sv(f, "power_gen"), rt.sv(f, "power_output")));
		yield* g.srcCall(f, "UseFuel");
		yield* g.callName(f, live(f.src), "updateDialog", []);
	} else {
		rt.setSv(f, "active", 0);
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
		yield* g.srcCall(f, "handleInactive");
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/power/port_gen/proc/attack_hand  (code/modules/power/port_gen.dm:42)  may sleep
rt.def("/obj/machinery/power/port_gen/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "anchored"))) return f.dot;
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/power/port_gen/proc/examine  (code/modules/power/port_gen.dm:48)
rt.def("/obj/machinery/power/port_gen/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (!truthy(rt.sv(f, "active"))) {
		$1 = "n't";
	} else {
		$1 = "";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("It is＀ running.", [$1])]);
	return f.dot;
}, false, { args: ["user"] });

rt.type(10314, "/obj/machinery/power/port_gen/pacman", "/obj/machinery/power/port_gen", {
	sheets: 0,
	max_sheets: 100,
	sheet_name: "",
	sheet_path: rt.typePath("/obj/item/stack/sheet/mineral/plasma"),
	board_path: rt.typePath("/obj/item/weapon/circuitboard/machine/pacman"),
	sheet_left: 0,
	time_per_sheet: 260,
	current_heat: 0,
	name: "１P.A.C.M.A.N.-type portable generator",
});

// /obj/machinery/power/port_gen/pacman/proc/Initialize  (code/modules/power/port_gen.dm:63)  may sleep
rt.def("/obj/machinery/power/port_gen/pacman/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "anchored"))) return f.dot;
	yield* g.srcCall(f, "connect_to_network");
	return f.dot;
}, true);

// /obj/machinery/power/port_gen/pacman/proc/New  (code/modules/power/port_gen.dm:68)  may sleep
rt.def("/obj/machinery/power/port_gen/pacman/proc/New", function* New(f: Frame) {
	let B: Value = null, sheet: Value = null;
	f.vars = () => [B, sheet];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, rt.sv(f, "board_path"), [null]))), "apply_default_parts", [live(f.src)]);
	rt.setSv(f, "sheet_name", rt.gv(f, "name", (sheet = (yield* g.new_(f, rt.sv(f, "sheet_path"), [null])))));
	return f.dot;
}, true);

rt.type(6764, "/obj/item/weapon/circuitboard/machine/pacman", "/obj/item/weapon/circuitboard/machine", {
	name: "PACMAN-type Generator (Machine Board)",
	build_path: rt.typePath("/obj/machinery/power/port_gen/pacman"),
	origin_tech: "programming=2;powerstorage=3;plasmatech=3;engineering=3",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/pacman/proc/<init>  (code/modules/power/port_gen.dm:79)
rt.def("/obj/item/weapon/circuitboard/machine/pacman/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/capacitor"), 1]));
	return f.dot;
});

// /obj/machinery/power/port_gen/pacman/proc/Destroy  (code/modules/power/port_gen.dm:96)  may sleep
rt.def("/obj/machinery/power/port_gen/pacman/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "DropFuel");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/power/port_gen/pacman/proc/RefreshParts  (code/modules/power/port_gen.dm:102)
rt.def("/obj/machinery/power/port_gen/pacman/proc/RefreshParts", function RefreshParts(f: Frame) {
	let temp_rating: Value = null, consumption_coeff: Value = null, SP: Value = null;
	let $e: any;
	f.vars = () => [temp_rating, consumption_coeff, SP, $e];
	temp_rating = 0;
	consumption_coeff = 0;
	SP = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SP = $e;
		if (truthy((rt.istype(live(SP), T("/obj/item/weapon/stock_parts/matter_bin")) ? 1 : 0))) {
			rt.setSv(f, "max_sheets", multiply(multiply(rt.fv(f, "rating", live(SP)), rt.fv(f, "rating", live(SP))), 50));
		} else {
			if (truthy((rt.istype(live(SP), T("/obj/item/weapon/stock_parts/capacitor")) ? 1 : 0))) {
				temp_rating = rt.modify(live(temp_rating), rt.fv(f, "rating", live(SP)), add);
			} else {
				consumption_coeff = rt.modify(live(consumption_coeff), rt.fv(f, "rating", live(SP)), add);
			}
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "power_gen", rt.call(f, P("/proc/round"), null, [multiply(multiply(rt.initial(f, live(f.src), "power_gen"), live(temp_rating)), 2)]));
	rt.setSv(f, "consumption", live(consumption_coeff));
	return f.dot;
});

// /obj/machinery/power/port_gen/pacman/proc/examine  (code/modules/power/port_gen.dm:113)
rt.def("/obj/machinery/power/port_gen/pacman/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>The generator has ＀ units of ＀ fuel left, producing ＀ per cycle.</span>", [rt.sv(f, "sheets"), rt.sv(f, "sheet_name"), rt.sv(f, "power_gen")])]);
	if (!truthy(rt.sv(f, "crit_fail"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>The generator seems to have broken down.</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/power/port_gen/pacman/proc/HasFuel  (code/modules/power/port_gen.dm:118)
rt.def("/obj/machinery/power/port_gen/pacman/proc/HasFuel", function HasFuel(f: Frame) {
	if (rt.ge(rt.sv(f, "sheets"), subtract(divide(1, divide(rt.sv(f, "time_per_sheet"), rt.sv(f, "power_output"))), rt.sv(f, "sheet_left")))) {
		return 1;
	}
	return 0;
});

// /obj/machinery/power/port_gen/pacman/proc/DropFuel  (code/modules/power/port_gen.dm:125)  may sleep
rt.def("/obj/machinery/power/port_gen/pacman/proc/DropFuel", function* DropFuel(f: Frame) {
	let fail_safe: Value = null, S: Value = null, amount: Value = null;
	f.vars = () => [fail_safe, S, amount];
	if (!truthy(rt.sv(f, "sheets"))) return f.dot;
	fail_safe = 0;
	while (rt.gt(rt.sv(f, "sheets"), 0) && rt.lt(live(fail_safe), 100)) {
		fail_safe = rt.modify(live(fail_safe), 1, add);
		S = (yield* g.new_(f, rt.sv(f, "sheet_path"), [rt.sv(f, "loc")]));
		amount = (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "sheets"), rt.fv(f, "max_amount", live(S))]));
		rt.setFv(f, "amount", live(S), live(amount));
		(rt.modSrcVar(f, "sheets", live(amount), subtract));
	}
	return f.dot;
}, true);

// /obj/machinery/power/port_gen/pacman/proc/UseFuel  (code/modules/power/port_gen.dm:133)  may sleep
rt.def("/obj/machinery/power/port_gen/pacman/proc/UseFuel", function* UseFuel(f: Frame) {
	let needed_sheets: Value = null, temp: Value = null, lower_limit: Value = null, upper_limit: Value = null, bias: Value = null;
	f.vars = () => [needed_sheets, temp, lower_limit, upper_limit, bias];
	needed_sheets = divide(1, divide(multiply(rt.sv(f, "time_per_sheet"), rt.sv(f, "consumption")), rt.sv(f, "power_output")));
	(needed_sheets = rt.modify(live(needed_sheets), (temp = (yield* g.call(f, P("/proc/min"), null, [live(needed_sheets), rt.sv(f, "sheet_left")]))), subtract));
	(rt.modSrcVar(f, "sheet_left", live(temp), subtract));
	(rt.modSrcVar(f, "sheets", (yield* g.call(f, P("/proc/round"), null, [live(needed_sheets)])), subtract));
	(needed_sheets = rt.modify(live(needed_sheets), (yield* g.call(f, P("/proc/round"), null, [live(needed_sheets)])), subtract));
	if ((rt.le(rt.sv(f, "sheet_left"), 0) && rt.gt(rt.sv(f, "sheets"), 0))) {
		rt.setSv(f, "sheet_left", subtract(1, live(needed_sheets)));
		rt.incSrcVar(f, "sheets", -1, true);
	}
	lower_limit = add(56, multiply(rt.sv(f, "power_output"), 10));
	upper_limit = add(76, multiply(rt.sv(f, "power_output"), 10));
	bias = 0;
	if (rt.gt(rt.sv(f, "power_output"), 4)) {
		upper_limit = 400;
		bias = subtract(rt.sv(f, "power_output"), multiply(rt.sv(f, "consumption"), subtract(4, rt.sv(f, "consumption"))));
	}
	if (rt.lt(rt.sv(f, "current_heat"), live(lower_limit))) {
		rt.modSrcVar(f, "current_heat", subtract(4, rt.sv(f, "consumption")), add);
	} else {
		if (rt.lt((rt.modSrcVar(f, "current_heat", (yield* g.call(f, P("/proc/rand"), null, [add(-7, live(bias)), add(7, live(bias))])), add)), live(lower_limit))) {
			rt.setSv(f, "current_heat", live(lower_limit));
		}
		if (rt.gt(rt.sv(f, "current_heat"), live(upper_limit))) {
			rt.setSv(f, "current_heat", live(upper_limit));
		}
	}
	if (rt.gt(rt.sv(f, "current_heat"), 300)) {
		yield* g.srcCall(f, "overheat");
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return live(f.dot);
}, true);

// /obj/machinery/power/port_gen/pacman/proc/handleInactive  (code/modules/power/port_gen.dm:165)  may sleep
rt.def("/obj/machinery/power/port_gen/pacman/proc/handleInactive", function* handleInactive(f: Frame) {
	if (!rt.gt(rt.sv(f, "current_heat"), 0)) return f.dot;
	rt.setSv(f, "current_heat", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "current_heat"), 2), 0])));
	yield* g.callName(f, live(f.src), "updateDialog", []);
	return f.dot;
}, true);

// /obj/machinery/power/port_gen/pacman/proc/overheat  (code/modules/power/port_gen.dm:170)
rt.def("/obj/machinery/power/port_gen/pacman/proc/overheat", function overheat(f: Frame) {
	rt.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(f.src)), 2, 5, 2, -1]);
	return f.dot;
});

// /obj/machinery/power/port_gen/pacman/proc/attackby  (code/modules/power/port_gen.dm:173)  may sleep
rt.def("/obj/machinery/power/port_gen/pacman/proc/attackby", function* attackby(f: Frame) {
	let addstack: Value = null, amount: Value = null;
	f.vars = () => [addstack, amount];
	if (truthy(rt.op(f, "IsType", [], [live(f.args[0]), rt.sv(f, "sheet_path")]))) {
		addstack = live(f.args[0]);
		if (rt.lt((amount = (yield* g.call(f, P("/proc/min"), null, [subtract(rt.sv(f, "max_sheets"), rt.sv(f, "sheets")), rt.fv(f, "amount", live(addstack))]))), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>The ＀ is full!</span>", [rt.fv(f, "name", live(f.src))])]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ sheets to the ＀.</span>", [live(amount), rt.fv(f, "name", live(f.src))])]);
		rt.modSrcVar(f, "sheets", live(amount), add);
		yield* g.callName(f, live(addstack), "use", [live(amount)]);
		yield* g.srcCall(f, "updateUsrDialog");
		return live(f.dot);
	} else {
		if (!truthy(rt.sv(f, "active"))) {
			if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
				return live(f.dot);
			}
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
				if ((!truthy(rt.sv(f, "anchored")) && !truthy((yield* g.srcCall(f, "isinspace"))))) {
					yield* g.srcCall(f, "connect_to_network");
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You secure the generator to the floor.</span>"]);
					rt.setSv(f, "anchored", 1);
				} else {
					if (truthy(rt.sv(f, "anchored"))) {
						yield* g.srcCall(f, "disconnect_from_network");
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unsecure the generator from the floor.</span>"]);
						rt.setSv(f, "anchored", 0);
					}
				}
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
				return live(f.dot);
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
					rt.setSv(f, "panel_open", (!truthy(rt.sv(f, "panel_open")) ? 1 : 0));
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
					if (truthy(rt.sv(f, "panel_open"))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You open the access panel.</span>"]);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You close the access panel.</span>"]);
					}
					return live(f.dot);
				} else {
					if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
						return live(f.dot);
					}
				}
			}
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/power/port_gen/pacman/proc/emag_act  (code/modules/power/port_gen.dm:215)  may sleep
rt.def("/obj/machinery/power/port_gen/pacman/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.setSv(f, "emagged", 1);
	yield* g.srcCall(f, "emp_act", 1);
	return f.dot;
}, true);

// /obj/machinery/power/port_gen/pacman/proc/attack_hand  (code/modules/power/port_gen.dm:220)  may sleep
rt.def("/obj/machinery/power/port_gen/pacman/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "anchored"))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/power/port_gen/pacman/proc/attack_ai  (code/modules/power/port_gen.dm:227)  may sleep
rt.def("/obj/machinery/power/port_gen/pacman/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/machinery/power/port_gen/pacman/proc/attack_paw  (code/modules/power/port_gen.dm:230)  may sleep
rt.def("/obj/machinery/power/port_gen/pacman/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/machinery/power/port_gen/pacman/proc/interact  (code/modules/power/port_gen.dm:233)  may sleep
rt.def("/obj/machinery/power/port_gen/pacman/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, stack_percent: Value = null;
	let $0: any;
	f.vars = () => [user, dat, stack_percent, $0];
	if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1)) {
		if (!truthy((rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0))) {
			yield* g.callName(f, live(user), "unset_machine", []);
			rt.op(f, "Browse", [], [live(user), null, "window=port_gen"], false);
			return live(f.dot);
		}
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = fmt("<b>＀</b><br>", [rt.sv(f, "name")]);
	if (truthy(rt.sv(f, "active"))) {
		dat = rt.modify(live(dat), fmt("Generator: <A href='?src=＃;action=disable'>On</A><br>", [live(f.src)]), add);
	} else {
		dat = rt.modify(live(dat), fmt("Generator: <A href='?src=＃;action=enable'>Off</A><br>", [live(f.src)]), add);
	}
	dat = rt.modify(live(dat), fmt("＀: ＀ - <A href='?src=＃;action=eject'>Eject</A><br>", [(yield* g.call(f, P("/proc/capitalize"), null, [rt.sv(f, "sheet_name")])), rt.sv(f, "sheets"), live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("Current stack: ＀% <br>", [(stack_percent = (yield* g.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "sheet_left"), 100), 1])))]), add);
	dat = rt.modify(live(dat), fmt("Power output: <A href='?src=＃;action=lower_power'>-</A> ＀ <A href='?src=＃;action=higher_power'>+</A><br>", [live(f.src), multiply(rt.sv(f, "power_gen"), rt.sv(f, "power_output")), live(f.src)]), add);
	if (rt.sv(f, "powernet") === null) {
		$0 = "Unconnected";
	} else {
		$0 = fmt("＀", [(yield* g.srcCall(f, "avail"))]);
	}
	dat = rt.modify(live(dat), fmt("Power current: ＀<br>", [$0]), add);
	dat = rt.modify(live(dat), fmt("Heat: ＀<br>", [rt.sv(f, "current_heat")]), add);
	dat = rt.modify(live(dat), fmt("<br><A href='?src=＃;action=close'>Close</A>", [live(f.src)]), add);
	rt.op(f, "Browse", [], [live(user), live(dat), "window=port_gen"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(user), "port_gen"]);
	return f.dot;
}, true);

// /obj/machinery/power/port_gen/pacman/proc/Topic  (code/modules/power/port_gen.dm:257)  may sleep
rt.def("/obj/machinery/power/port_gen/pacman/proc/Topic", function* Topic(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
	if (!truthy(rt.at(live(f.args[1]), "action"))) return f.dot;
	if (isEqual(rt.at(live(f.args[1]), "action"), "enable")) {
		if (((!truthy(rt.sv(f, "active")) && truthy((yield* g.srcCall(f, "HasFuel")))) && !truthy(rt.sv(f, "crit_fail")))) {
			rt.setSv(f, "active", 1);
			rt.setSv(f, "icon_state", "portgen1");
			yield* g.callName(f, live(f.src), "updateUsrDialog", []);
		}
	}
	if (isEqual(rt.at(live(f.args[1]), "action"), "disable")) {
		if (truthy(rt.sv(f, "active"))) {
			rt.setSv(f, "active", 0);
			rt.setSv(f, "icon_state", "portgen0");
			yield* g.callName(f, live(f.src), "updateUsrDialog", []);
		}
	}
	if (isEqual(rt.at(live(f.args[1]), "action"), "eject")) {
		if (!truthy(rt.sv(f, "active"))) {
			yield* g.srcCall(f, "DropFuel");
			yield* g.callName(f, live(f.src), "updateUsrDialog", []);
		}
	}
	if (isEqual(rt.at(live(f.args[1]), "action"), "lower_power")) {
		if (rt.gt(rt.sv(f, "power_output"), 1)) {
			rt.incSrcVar(f, "power_output", -1, true);
			yield* g.callName(f, live(f.src), "updateUsrDialog", []);
		}
	}
	if (isEqual(rt.at(live(f.args[1]), "action"), "higher_power")) {
		if ((rt.lt(rt.sv(f, "power_output"), 4) || truthy(rt.sv(f, "emagged")))) {
			rt.incSrcVar(f, "power_output", 1, true);
			yield* g.callName(f, live(f.src), "updateUsrDialog", []);
		}
	}
	if (!isEqual(rt.at(live(f.args[1]), "action"), "close")) return f.dot;
	rt.op(f, "Browse", [], [live(f.usr), null, "window=port_gen"], false);
	yield* g.callName(f, live(f.usr), "unset_machine", []);
	return f.dot;
}, true, { args: ["href", "href_list"] });

rt.type(10315, "/obj/machinery/power/port_gen/pacman/super", "/obj/machinery/power/port_gen/pacman", {
	sheet_path: rt.typePath("/obj/item/stack/sheet/mineral/uranium"),
	power_gen: 15000,
	time_per_sheet: 85,
	board_path: rt.typePath("/obj/item/weapon/circuitboard/machine/pacman/super"),
	name: "１S.U.P.E.R.P.A.C.M.A.N.-type portable generator",
	icon_state: "portgen1",
});

// /obj/machinery/power/port_gen/pacman/super/proc/overheat  (code/modules/power/port_gen.dm:297)
rt.def("/obj/machinery/power/port_gen/pacman/super/proc/overheat", function overheat(f: Frame) {
	rt.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(f.src)), 3, 3, 3, -1]);
	return f.dot;
});

rt.type(10316, "/obj/machinery/power/port_gen/pacman/mrs", "/obj/machinery/power/port_gen/pacman", {
	sheet_path: rt.typePath("/obj/item/stack/sheet/mineral/diamond"),
	power_gen: 40000,
	time_per_sheet: 80,
	board_path: rt.typePath("/obj/item/weapon/circuitboard/machine/pacman/mrs"),
	name: "１M.R.S.P.A.C.M.A.N.-type portable generator",
	icon_state: "portgen2",
});

// /obj/machinery/power/port_gen/pacman/mrs/proc/overheat  (code/modules/power/port_gen.dm:308)
rt.def("/obj/machinery/power/port_gen/pacman/mrs/proc/overheat", function overheat(f: Frame) {
	rt.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(f.src)), 4, 4, 4, -1]);
	return f.dot;
});
