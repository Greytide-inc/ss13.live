// From code/modules/power/turbine.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10325, "/obj/machinery/power/compressor", "/obj/machinery/power", {
	turbine: null,
	gas_contained: null,
	inturf: null,
	starter: 0,
	rpm: 0,
	rpmtarget: 0,
	capacity: 1000000,
	comp_id: 0,
	efficiency: null,
	anchored: 1,
	CanAtmosPass: -2,
	name: "compressor",
	desc: "The compressor stage of a gas turbine generator.",
	icon: rt.rsc("icons/obj/atmospherics/pipes/simple.dmi"),
	icon_state: "compressor",
	density: 1,
	resistance_flags: 2,
});

// /obj/machinery/power/compressor/proc/New  (code/modules/power/turbine.dm:72)  may sleep
rt.def("/obj/machinery/power/compressor/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/power_compressor"), [null]))), "apply_default_parts", [live(f.src)]);
	rt.setSv(f, "gas_contained", (yield* g.new_(f, T("/datum/gas_mixture"), [])));
	rt.setSv(f, "inturf", rt.getStep(f, live(f.src), rt.sv(f, "dir")));
	return f.dot;
}, true);

rt.type(6770, "/obj/item/weapon/circuitboard/machine/power_compressor", "/obj/item/weapon/circuitboard/machine", {
	name: "Power Compressor (Machine Board)",
	build_path: rt.typePath("/obj/machinery/power/compressor"),
	origin_tech: "programming=4;powerstorage=4;engineering=4",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/power_compressor/proc/<init>  (code/modules/power/turbine.dm:84)
rt.def("/obj/item/weapon/circuitboard/machine/power_compressor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/stack/cable_coil"), 5, T("/obj/item/weapon/stock_parts/manipulator"), 6]));
	return f.dot;
});

// /obj/machinery/power/compressor/proc/Initialize  (code/modules/power/turbine.dm:89)  may sleep
rt.def("/obj/machinery/power/compressor/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "locate_machinery");
	if (truthy(rt.sv(f, "turbine"))) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	return f.dot;
}, true);

// /obj/machinery/power/compressor/proc/locate_machinery  (code/modules/power/turbine.dm:107)
rt.def("/obj/machinery/power/compressor/proc/locate_machinery", function locate_machinery(f: Frame) {
	if (truthy(rt.sv(f, "turbine"))) {
		return live(f.dot);
	}
	rt.setSv(f, "turbine", rt.locateIn(f, T("/obj/machinery/power/turbine"), rt.getStep(f, live(f.src), rt.getDir(f, rt.sv(f, "inturf"), live(f.src)))));
	if (!truthy(rt.sv(f, "turbine"))) return f.dot;
	rt.callName(f, rt.sv(f, "turbine"), "locate_machinery", []);
	return f.dot;
});

// /obj/machinery/power/compressor/proc/RefreshParts  (code/modules/power/turbine.dm:113)
rt.def("/obj/machinery/power/compressor/proc/RefreshParts", function RefreshParts(f: Frame) {
	let E: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [E, M, $e];
	E = 0;
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		E = rt.modify(live(E), rt.fv(f, "rating", live(M)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "efficiency", divide(live(E), 6));
	return f.dot;
});

// /obj/machinery/power/compressor/proc/attackby  (code/modules/power/turbine.dm:118)  may sleep
rt.def("/obj/machinery/power/compressor/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	f.vars = () => [I, user, params];
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(user), rt.initial(f, live(f.src), "icon_state"), rt.initial(f, live(f.src), "icon_state"), live(I))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_change_direction_wrench", live(user), live(I))))) {
		rt.setSv(f, "turbine", null);
		rt.setSv(f, "inturf", rt.getStep(f, live(f.src), rt.sv(f, "dir")));
		yield* g.srcCall(f, "locate_machinery");
		if (truthy(rt.sv(f, "turbine"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Turbine connected.</span>"]);
			(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='alert'>Turbine not connected.</span>"]);
			(rt.modSrcVar(f, "stat", 1, rt.bitOr));
		}
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(user), live(I))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "default_deconstruction_crowbar", live(I));
	return f.dot;
}, true);

// /obj/machinery/power/compressor/proc/process  (code/modules/power/turbine.dm:139)  may sleep
rt.def("/obj/machinery/power/compressor/proc/process", function* process(f: Frame) {
	let environment: Value = null, transfer_moles: Value = null, removed: Value = null;
	f.vars = () => [environment, transfer_moles, removed];
	if (!truthy(rt.sv(f, "turbine"))) {
		rt.setSv(f, "stat", 1);
	}
	if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 1)) || truthy(rt.sv(f, "panel_open")))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "starter"))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "cut_overlays");
	rt.setSv(f, "rpm", add(multiply(0.8999999761581421, rt.sv(f, "rpm")), multiply(0.10000000149011612, rt.sv(f, "rpmtarget"))));
	environment = (yield* g.callName(f, rt.sv(f, "inturf"), "return_air", []));
	transfer_moles = divide((yield* g.callName(f, live(environment), "total_moles", [])), 10);
	removed = (yield* g.callName(f, rt.sv(f, "inturf"), "remove_air", [live(transfer_moles)]));
	yield* g.callName(f, rt.sv(f, "gas_contained"), "merge", [live(removed)]);
	rt.setSv(f, "rpm", (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "rpm"), divide(multiply(rt.sv(f, "rpm"), rt.sv(f, "rpm")), multiply(500000, rt.sv(f, "efficiency"))))])));
	if ((truthy(rt.sv(f, "starter")) && !truthy(rt.bitAnd(rt.sv(f, "stat"), 2)))) {
		yield* g.srcCall(f, "use_power", 2800);
		if (rt.lt(rt.sv(f, "rpm"), 1000)) {
			rt.setSv(f, "rpmtarget", 1000);
		}
	} else {
		if (rt.lt(rt.sv(f, "rpm"), 1000)) {
			rt.setSv(f, "rpmtarget", 0);
		}
	}
	if (rt.gt(rt.sv(f, "rpm"), 50000)) {
		yield* g.srcCall(f, "add_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "comp-o4", 5])));
	} else {
		if (rt.gt(rt.sv(f, "rpm"), 10000)) {
			yield* g.srcCall(f, "add_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "comp-o3", 5])));
		} else {
			if (rt.gt(rt.sv(f, "rpm"), 2000)) {
				yield* g.srcCall(f, "add_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "comp-o2", 5])));
			} else {
				if (!rt.gt(rt.sv(f, "rpm"), 500)) return f.dot;
				yield* g.srcCall(f, "add_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "comp-o1", 5])));
			}
		}
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(10326, "/obj/machinery/power/turbine", "/obj/machinery/power", {
	opened: 0,
	compressor: null,
	outturf: null,
	lastgen: null,
	productivity: 1,
	anchored: 1,
	CanAtmosPass: -2,
	name: "gas turbine generator",
	desc: "A gas turbine used for backup power generation.",
	icon: rt.rsc("icons/obj/atmospherics/pipes/simple.dmi"),
	icon_state: "turbine",
	density: 1,
	resistance_flags: 2,
});

// /obj/machinery/power/turbine/proc/New  (code/modules/power/turbine.dm:190)  may sleep
rt.def("/obj/machinery/power/turbine/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/power_turbine"), [null]))), "apply_default_parts", [live(f.src)]);
	rt.setSv(f, "outturf", rt.getStep(f, live(f.src), rt.sv(f, "dir")));
	return f.dot;
}, true);

rt.type(6771, "/obj/item/weapon/circuitboard/machine/power_turbine", "/obj/item/weapon/circuitboard/machine", {
	name: "Power Turbine (Machine Board)",
	build_path: rt.typePath("/obj/machinery/power/turbine"),
	origin_tech: "programming=4;powerstorage=4;engineering=4",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/power_turbine/proc/<init>  (code/modules/power/turbine.dm:200)
rt.def("/obj/item/weapon/circuitboard/machine/power_turbine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/stack/cable_coil"), 5, T("/obj/item/weapon/stock_parts/capacitor"), 6]));
	return f.dot;
});

// /obj/machinery/power/turbine/proc/Initialize  (code/modules/power/turbine.dm:205)  may sleep
rt.def("/obj/machinery/power/turbine/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "locate_machinery");
	if (truthy(rt.sv(f, "compressor"))) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	return f.dot;
}, true);

// /obj/machinery/power/turbine/proc/RefreshParts  (code/modules/power/turbine.dm:212)
rt.def("/obj/machinery/power/turbine/proc/RefreshParts", function RefreshParts(f: Frame) {
	let _P: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [_P, C, $e];
	_P = 0;
	C = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/capacitor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		_P = rt.modify(live(_P), rt.fv(f, "rating", live(C)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "productivity", divide(live(_P), 6));
	return f.dot;
});

// /obj/machinery/power/turbine/proc/locate_machinery  (code/modules/power/turbine.dm:219)
rt.def("/obj/machinery/power/turbine/proc/locate_machinery", function locate_machinery(f: Frame) {
	if (truthy(rt.sv(f, "compressor"))) {
		return live(f.dot);
	}
	rt.setSv(f, "compressor", rt.locateIn(f, T("/obj/machinery/power/compressor"), rt.getStep(f, live(f.src), rt.getDir(f, rt.sv(f, "outturf"), live(f.src)))));
	if (!truthy(rt.sv(f, "compressor"))) return f.dot;
	rt.callName(f, rt.sv(f, "compressor"), "locate_machinery", []);
	return f.dot;
});

// /obj/machinery/power/turbine/proc/process  (code/modules/power/turbine.dm:225)  may sleep
rt.def("/obj/machinery/power/turbine/proc/process", function* process(f: Frame) {
	let newrpm: Value = null, oamount: Value = null, removed: Value = null;
	f.vars = () => [newrpm, oamount, removed];
	if (!truthy(rt.sv(f, "compressor"))) {
		rt.setSv(f, "stat", 1);
	}
	if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 1)) || truthy(rt.sv(f, "panel_open")))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "starter", rt.sv(f, "compressor")))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "cut_overlays");
	rt.setSv(f, "lastgen", multiply(multiply(rt.power(divide(rt.fv(f, "rpm", rt.sv(f, "compressor")), 100000), 0.5), 100000), rt.sv(f, "productivity")));
	yield* g.srcCall(f, "add_avail", rt.sv(f, "lastgen"));
	newrpm = divide(multiply(rt.gv(f, "temperature", rt.fv(f, "gas_contained", rt.sv(f, "compressor"))), (yield* g.callName(f, rt.fv(f, "gas_contained", rt.sv(f, "compressor")), "total_moles", []))), 4);
	newrpm = (yield* g.call(f, P("/proc/max"), null, [0, live(newrpm)]));
	if ((!truthy(rt.fv(f, "starter", rt.sv(f, "compressor"))) || rt.gt(live(newrpm), 1000))) {
		rt.setFv(f, "rpmtarget", rt.sv(f, "compressor"), live(newrpm));
	}
	if (rt.gt((yield* g.callName(f, rt.fv(f, "gas_contained", rt.sv(f, "compressor")), "total_moles", [])), 0)) {
		oamount = (yield* g.call(f, P("/proc/min"), null, [(yield* g.callName(f, rt.fv(f, "gas_contained", rt.sv(f, "compressor")), "total_moles", [])), multiply(divide(add(rt.fv(f, "rpm", rt.sv(f, "compressor")), 100), 35000), rt.fv(f, "capacity", rt.sv(f, "compressor")))]));
		removed = (yield* g.callName(f, rt.fv(f, "gas_contained", rt.sv(f, "compressor")), "remove", [live(oamount)]));
		yield* g.callName(f, rt.sv(f, "outturf"), "assume_air", [live(removed)]);
	}
	if (rt.gt(rt.sv(f, "lastgen"), 100)) {
		yield* g.srcCall(f, "add_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "turb-o", 5])));
	}
	yield* g.srcCall(f, "updateDialog");
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/power/turbine/proc/attack_hand  (code/modules/power/turbine.dm:264)  may sleep
rt.def("/obj/machinery/power/turbine/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/power/turbine/proc/attackby  (code/modules/power/turbine.dm:270)  may sleep
rt.def("/obj/machinery/power/turbine/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	f.vars = () => [I, user, params];
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(user), rt.initial(f, live(f.src), "icon_state"), rt.initial(f, live(f.src), "icon_state"), live(I))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_change_direction_wrench", live(user), live(I))))) {
		rt.setSv(f, "compressor", null);
		rt.setSv(f, "outturf", rt.getStep(f, live(f.src), rt.sv(f, "dir")));
		yield* g.srcCall(f, "locate_machinery");
		if (truthy(rt.sv(f, "compressor"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Compressor connected.</span>"]);
			(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='alert'>Compressor not connected.</span>"]);
			(rt.modSrcVar(f, "stat", 1, rt.bitOr));
		}
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(user), live(I))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "default_deconstruction_crowbar", live(I));
	return f.dot;
}, true);

// /obj/machinery/power/turbine/proc/interact  (code/modules/power/turbine.dm:292)  may sleep
rt.def("/obj/machinery/power/turbine/proc/interact", function* interact(f: Frame, user: Value) {
	let t: Value = null, popup: Value = null;
	let $0: any;
	f.vars = () => [user, t, popup, $0];
	if ((!truthy((yield* g.srcCall(f, "Adjacent", live(user)))) || (truthy(rt.bitAnd(rt.sv(f, "stat"), 3)) && !truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))))) {
		yield* g.callName(f, live(user), "unset_machine", [live(f.src)]);
		rt.op(f, "Browse", [], [live(user), null, "window=turbine"], false);
		return live(f.dot);
	}
	t = "<TT><B>Gas Turbine Generator</B><HR><PRE>";
	t = rt.modify(live(t), fmt("Generated power : ＀ W<BR><BR>", [(yield* g.call(f, P("/proc/round"), null, [rt.sv(f, "lastgen")]))]), add);
	t = rt.modify(live(t), fmt("Turbine: ＀ RPM<BR>", [(yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "rpm", rt.sv(f, "compressor"))]))]), add);
	if (truthy(rt.fv(f, "starter", rt.sv(f, "compressor")))) {
		$0 = fmt("<A href='?src=＃;str=1'>Off</A> <B>On</B>", [live(f.src)]);
	} else {
		$0 = fmt("<B>Off</B> <A href='?src=＃;str=1'>On</A>", [live(f.src)]);
	}
	t = rt.modify(live(t), fmt("Starter: ＀", [$0]), add);
	t = rt.modify(live(t), fmt("</PRE><HR><A href='?src=＃;close=1'>Close</A>", [live(f.src)]), add);
	t = rt.modify(live(t), "</TT>", add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "turbine", rt.sv(f, "name")]))), "set_content", [live(t)]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true);

// /obj/machinery/power/turbine/proc/Topic  (code/modules/power/turbine.dm:315)  may sleep
rt.def("/obj/machinery/power/turbine/proc/Topic", function* Topic(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "close"))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=turbine"], false);
		yield* g.callName(f, live(f.usr), "unset_machine", [live(f.src)]);
		return live(f.dot);
	} else {
		if (truthy(rt.at(live(f.args[1]), "str"))) {
			if (truthy(rt.sv(f, "compressor"))) {
				rt.setFv(f, "starter", rt.sv(f, "compressor"), (!truthy(rt.fv(f, "starter", rt.sv(f, "compressor"))) ? 1 : 0));
			}
		}
	}
	yield* g.srcCall(f, "updateDialog");
	return f.dot;
}, true, { args: ["href", "href_list"] });

rt.type(10430, "/obj/machinery/computer/turbine_computer", "/obj/machinery/computer", {
	compressor: null,
	id: 0,
	icon_screen: "turbinecomp",
	icon_keyboard: "tech_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/turbine_computer"),
	name: "gas turbine control computer",
	desc: "A computer to remotely control a gas turbine.",
});

// /obj/machinery/computer/turbine_computer/proc/Initialize  (code/modules/power/turbine.dm:341)  may sleep
rt.def("/obj/machinery/computer/turbine_computer/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "locate_machinery");
	return f.dot;
}, true);

// /obj/machinery/computer/turbine_computer/proc/locate_machinery  (code/modules/power/turbine.dm:345)
rt.def("/obj/machinery/computer/turbine_computer/proc/locate_machinery", function locate_machinery(f: Frame) {
	rt.setSv(f, "compressor", rt.locateIn(f, T("/obj/machinery/power/compressor"), rt.call(f, P("/proc/range"), null, [5, live(f.src)])));
	return f.dot;
});

// /obj/machinery/computer/turbine_computer/proc/attack_hand  (code/modules/power/turbine.dm:348)  may sleep
rt.def("/obj/machinery/computer/turbine_computer/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/turbine_computer/proc/interact  (code/modules/power/turbine.dm:356)  may sleep
rt.def("/obj/machinery/computer/turbine_computer/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, popup: Value = null;
	let $0: any;
	f.vars = () => [user, dat, popup, $0];
	dat = null;
	if ((truthy(rt.sv(f, "compressor")) && truthy(rt.fv(f, "turbine", rt.sv(f, "compressor"))))) {
		dat = rt.modify(live(dat), "<BR><B>Gas turbine remote control system</B><HR>", add);
		if ((truthy(rt.fv(f, "stat", rt.sv(f, "compressor"))) || truthy(rt.gv(f, "stat", rt.fv(f, "turbine", rt.sv(f, "compressor")))))) {
			if (truthy(rt.fv(f, "stat", rt.sv(f, "compressor")))) {
				$0 = "<B>Compressor is inoperable</B><BR>";
			} else {
				$0 = "<B>Turbine is inoperable</B>";
			}
			dat = rt.modify(live(dat), fmt("＀", [$0]), add);
		} else {
			if (truthy(rt.gv(f, "starter", rt.fv(f, "compressor", live(f.src))))) {
				$0 = fmt("<A href='?src=＃;str=1'>Off</A> <B>On</B>", [live(f.src)]);
			} else {
				$0 = fmt("<B>Off</B> <A href='?src=＃;str=1'>On</A>", [live(f.src)]);
			}
			dat = rt.modify(live(dat), fmt("Turbine status: ＀\n\t\t\t\n<BR>\n\t\t\t\nTurbine speed: ＀rpm<BR>\n\t\t\t\nPower currently being generated: ＀W<BR>\n\t\t\t\nInternal gas temperature: ＀K<BR>\n\t\t\t\n</PRE><HR><A href='?src=＃;close=1'>Close</A>\n\t\t\t\n<BR>\n\t\t\t\n", [$0, rt.gv(f, "rpm", rt.fv(f, "compressor", live(f.src))), rt.gv(f, "lastgen", rt.gv(f, "turbine", rt.fv(f, "compressor", live(f.src)))), rt.gv(f, "temperature", rt.gv(f, "gas_contained", rt.fv(f, "compressor", live(f.src)))), live(f.src)]), add);
		}
	} else {
		if (!truthy(rt.sv(f, "compressor"))) {
			$0 = "no compressor";
		} else {
			if (!truthy(rt.fv(f, "turbine", rt.sv(f, "compressor")))) {
				$0 = " but no turbine";
			} else {
				$0 = "";
			}
			$0 = fmt(" compressor＀", [$0]);
		}
		dat = rt.modify(live(dat), fmt("<B>There is ＀.</B><BR>", [$0]), add);
		if (!truthy(rt.sv(f, "compressor"))) {
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;search=1'>Search for compressor</A>", [live(f.src)]), add);
		}
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "turbinecomputer", rt.sv(f, "name")]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true);

// /obj/machinery/computer/turbine_computer/proc/Topic  (code/modules/power/turbine.dm:380)  may sleep
rt.def("/obj/machinery/computer/turbine_computer/proc/Topic", function* Topic(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	} else {
		if (truthy(rt.at(live(f.args[1]), "str"))) {
			if ((truthy(rt.sv(f, "compressor")) && truthy(rt.fv(f, "turbine", rt.sv(f, "compressor"))))) {
				rt.setFv(f, "starter", rt.sv(f, "compressor"), (!truthy(rt.fv(f, "starter", rt.sv(f, "compressor"))) ? 1 : 0));
			}
		} else {
			if (truthy(rt.at(live(f.args[1]), "close"))) {
				rt.op(f, "Browse", [], [live(f.usr), null, "window=turbinecomputer"], false);
				yield* g.callName(f, live(f.usr), "unset_machine", [live(f.src)]);
				return live(f.dot);
			} else {
				if (truthy(rt.at(live(f.args[1]), "search"))) {
					yield* g.srcCall(f, "locate_machinery");
				}
			}
		}
	}
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/machinery/computer/turbine_computer/proc/process  (code/modules/power/turbine.dm:397)  may sleep
rt.def("/obj/machinery/computer/turbine_computer/proc/process", function* process(f: Frame) {
	yield* g.callName(f, live(f.src), "updateDialog", []);
	return live(f.dot);
}, true, { waitfor: false });
