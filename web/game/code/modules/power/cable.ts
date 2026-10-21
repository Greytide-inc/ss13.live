// From code/modules/power/cable.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12532, "/obj/structure/cable", "/obj/structure", {
	powernet: null,
	d1: 0,
	d2: 1,
	cable_color: "red",
	stored: null,
	level: 1,
	anchored: 1,
	on_blueprints: 1,
	name: "power cable",
	desc: "A flexible, superconducting insulated cable for heavy-duty power transfer.",
	icon: rt.rsc("icons/obj/power_cond/power_cond_red.dmi"),
	icon_state: "0-1",
	layer: 2.4,
});

// /obj/structure/cable/proc/Initialize  (code/modules/power/cable.dm:70)  may sleep
rt.def("/obj/structure/cable/proc/Initialize", function* Initialize(f: Frame) {
	let dash: Value = null, _T: Value = null;
	f.vars = () => [dash, _T];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	dash = (yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "icon_state"), "-"]));
	rt.setSv(f, "d1", (yield* g.call(f, P("/proc/text2num"), null, [(yield* g.call(f, P("/proc/copytext"), null, [rt.sv(f, "icon_state"), 1, live(dash)]))])));
	rt.setSv(f, "d2", (yield* g.call(f, P("/proc/text2num"), null, [(yield* g.call(f, P("/proc/copytext"), null, [rt.sv(f, "icon_state"), add(live(dash), 1)]))])));
	_T = rt.fv(f, "loc", live(f.src));
	if (isEqual(rt.sv(f, "level"), 1)) {
		yield* g.srcCall(f, "hide", rt.fv(f, "intact", live(_T)));
	}
	rt.modGl("cable_list", live(f.src), add);
	if (truthy(rt.sv(f, "d1"))) {
		rt.setSv(f, "stored", (yield* g.new_(f, T("/obj/item/stack/cable_coil"), [null, 2, rt.sv(f, "cable_color")])));
	} else {
		rt.setSv(f, "stored", (yield* g.new_(f, T("/obj/item/stack/cable_coil"), [null, 1, rt.sv(f, "cable_color")])));
	}
	return f.dot;
}, true);

// /obj/structure/cable/proc/Destroy  (code/modules/power/cable.dm:91)  may sleep
rt.def("/obj/structure/cable/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "powernet"))) {
		yield* g.srcCall(f, "cut_cable_from_powernet");
	}
	(rt.modGl("cable_list", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/cable/proc/deconstruct  (code/modules/power/cable.dm:96)  may sleep
rt.def("/obj/structure/cable/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let _T: Value = null;
	f.vars = () => [disassembled, _T];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		_T = rt.sv(f, "loc");
		yield* g.callName(f, rt.sv(f, "stored"), "forceMove", [live(_T)]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/cable/proc/hide  (code/modules/power/cable.dm:108)
rt.def("/obj/structure/cable/proc/hide", function hide(f: Frame, i: Value) {
	let $0: any;
	f.vars = () => [$0];
	if ((isEqual(rt.sv(f, "level"), 1) && truthy(rt.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		if (truthy(live(i))) {
			$0 = 100;
		} else {
			$0 = 0;
		}
		rt.setSv(f, "invisibility", $0);
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/structure/cable/proc/update_icon  (code/modules/power/cable.dm:114)
rt.def("/obj/structure/cable/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "invisibility"))) {
		rt.setSv(f, "icon_state", fmt("＀-＀-f", [rt.sv(f, "d1"), rt.sv(f, "d2")]));
	} else {
		rt.setSv(f, "icon_state", fmt("＀-＀", [rt.sv(f, "d1"), rt.sv(f, "d2")]));
	}
	return f.dot;
});

// /obj/structure/cable/proc/attackby  (code/modules/power/cable.dm:126)  may sleep
rt.def("/obj/structure/cable/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null, coil: Value = null;
	f.vars = () => [W, user, params, _T, coil];
	if (truthy(rt.gv(f, "intact", (_T = rt.fv(f, "loc", live(f.src)))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(W), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
		if (truthy((yield* g.srcCall(f, "shock", live(user), 50)))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ cuts the cable.", [live(user)]), "<span class='notice'>You cut the cable.</span>"]);
		yield* g.callName(f, rt.sv(f, "stored"), "add_fingerprint", [live(user)]);
		yield* g.srcCall(f, "investigate_log", fmt("was cut by ＀ in ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr), rt.fv(f, "client", live(f.usr))])), (yield* g.call(f, P("/proc/get_area"), null, [live(_T)]))]), "wires");
		yield* g.srcCall(f, "deconstruct");
		return live(f.dot);
	} else {
		if (truthy((rt.istype(live(W), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
			if (rt.lt((yield* g.callName(f, (coil = live(W)), "get_amount", [])), 1)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Not enough cable!</span>"]);
				return live(f.dot);
			}
			yield* g.callName(f, live(coil), "cable_join", [live(f.src), live(user)]);
		} else {
			if (truthy((rt.istype(live(W), T("/obj/item/device/multitool")) ? 1 : 0))) {
				if ((truthy(rt.sv(f, "powernet")) && rt.gt(rt.fv(f, "avail", rt.sv(f, "powernet")), 0))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＀W in power network.</span>", [rt.fv(f, "avail", rt.sv(f, "powernet"))])]);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>The cable is not powered.</span>"]);
				}
				yield* g.srcCall(f, "shock", live(user), 5, 0.20000000298023224);
			}
		}
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(user)]);
	return f.dot;
}, true);

// /obj/structure/cable/proc/shock  (code/modules/power/cable.dm:155)  may sleep
rt.def("/obj/structure/cable/proc/shock", function* shock(f: Frame, user: Value, prb: Value, siemens_coeff: Value) {
	f.vars = () => [user, prb, siemens_coeff];
	if (live(siemens_coeff) === null) {
		siemens_coeff = 1;
	}
	if (!truthy(rt.op(f, "Prob", [], [live(prb)]))) {
		return 0;
	}
	if (truthy((yield* g.call(f, P("/proc/electrocute_mob"), null, [live(user), rt.sv(f, "powernet"), live(f.src), live(siemens_coeff)])))) {
		yield* g.call(f, P("/proc/do_sparks"), null, [5, 1, live(f.src)]);
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true);

// /obj/structure/cable/proc/singularity_pull  (code/modules/power/cable.dm:164)  may sleep
rt.def("/obj/structure/cable/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	f.vars = () => [S, current_size];
	if (!rt.ge(live(current_size), 9)) return f.dot;
	yield* g.srcCall(f, "deconstruct");
	return f.dot;
}, true);

// /obj/structure/cable/proc/cableColor  (code/modules/power/cable.dm:168)
rt.def("/obj/structure/cable/proc/cableColor", function cableColor(f: Frame, colorC: Value) {
	let $0: any;
	f.vars = () => [colorC, $0];
	if (live(colorC) === null) {
		colorC = "red";
	}
	rt.setSv(f, "cable_color", live(colorC));
	$0 = live(colorC);
	if ($0 === "red") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/power_cond/power_cond_red.dmi"));
	} else if ($0 === "yellow") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/power_cond/power_cond_yellow.dmi"));
	} else if ($0 === "green") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/power_cond/power_cond_green.dmi"));
	} else if ($0 === "blue") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/power_cond/power_cond_blue.dmi"));
	} else if ($0 === "pink") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/power_cond/power_cond_pink.dmi"));
	} else if ($0 === "orange") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/power_cond/power_cond_orange.dmi"));
	} else if ($0 === "cyan") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/power_cond/power_cond_cyan.dmi"));
	} else if ($0 === "white") {
		rt.setSv(f, "icon", rt.rsc("icons/obj/power_cond/power_cond_white.dmi"));
	}
	return f.dot;
});

// /obj/structure/cable/proc/update_stored  (code/modules/power/cable.dm:190)
rt.def("/obj/structure/cable/proc/update_stored", function update_stored(f: Frame, length: Value, colorC: Value) {
	f.vars = () => [length, colorC];
	if (live(length) === null) {
		length = 1;
	}
	if (live(colorC) === null) {
		colorC = "red";
	}
	rt.setFv(f, "amount", rt.sv(f, "stored"), live(length));
	rt.setFv(f, "item_color", rt.sv(f, "stored"), live(colorC));
	rt.callName(f, rt.sv(f, "stored"), "update_icon", []);
	return f.dot;
});

// /obj/structure/cable/proc/surplus  (code/modules/power/cable.dm:206)
rt.def("/obj/structure/cable/proc/surplus", function surplus(f: Frame) {
	if (truthy(rt.sv(f, "powernet"))) {
		return subtract(rt.fv(f, "avail", rt.sv(f, "powernet")), rt.fv(f, "load", rt.sv(f, "powernet")));
	}
	return 0;
});

// /obj/structure/cable/proc/avail  (code/modules/power/cable.dm:212)
rt.def("/obj/structure/cable/proc/avail", function avail(f: Frame) {
	if (truthy(rt.sv(f, "powernet"))) {
		return rt.fv(f, "avail", rt.sv(f, "powernet"));
	}
	return 0;
});

// /obj/structure/cable/proc/mergeDiagonalsNetworks  (code/modules/power/cable.dm:225)  may sleep
rt.def("/obj/structure/cable/proc/mergeDiagonalsNetworks", function* mergeDiagonalsNetworks(f: Frame, direction: Value) {
	let _T: Value = null, C: Value = null, newPN: Value = null;
	let $e: any;
	f.vars = () => [direction, _T, C, newPN, $e];
	_T = rt.getStep(f, live(f.src), rt.bitAnd(live(direction), 3));
	C = null;
	rt.forList(f, 0, live(_T), T("/obj/structure/cable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (!truthy(live(C))) {
			continue;
		}
		if (isEqual(live(f.src), live(C))) {
			continue;
		}
		if ((isEqual(rt.fv(f, "d1", live(C)), rt.bitXor(live(direction), 3)) || isEqual(rt.fv(f, "d2", live(C)), rt.bitXor(live(direction), 3)))) {
			if (!truthy(rt.fv(f, "powernet", live(C)))) {
				yield* g.callName(f, (newPN = (yield* g.new_(f, T("/datum/powernet"), []))), "add_cable", [live(C)]);
			}
			if (truthy(rt.sv(f, "powernet"))) {
				yield* g.call(f, P("/proc/merge_powernets"), null, [rt.sv(f, "powernet"), rt.fv(f, "powernet", live(C))]);
			} else {
				yield* g.callName(f, rt.fv(f, "powernet", live(C)), "add_cable", [live(f.src)]);
			}
		}
	}
	rt.endFor(f, 0);
	_T = rt.getStep(f, live(f.src), rt.bitAnd(live(direction), 12));
	C = null;
	rt.forList(f, 0, live(_T), T("/obj/structure/cable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (!truthy(live(C))) {
			continue;
		}
		if (isEqual(live(f.src), live(C))) {
			continue;
		}
		if ((isEqual(rt.fv(f, "d1", live(C)), rt.bitXor(live(direction), 12)) || isEqual(rt.fv(f, "d2", live(C)), rt.bitXor(live(direction), 12)))) {
			if (!truthy(rt.fv(f, "powernet", live(C)))) {
				yield* g.callName(f, (newPN = (yield* g.new_(f, T("/datum/powernet"), []))), "add_cable", [live(C)]);
			}
			if (truthy(rt.sv(f, "powernet"))) {
				yield* g.call(f, P("/proc/merge_powernets"), null, [rt.sv(f, "powernet"), rt.fv(f, "powernet", live(C))]);
			} else {
				yield* g.callName(f, rt.fv(f, "powernet", live(C)), "add_cable", [live(f.src)]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/cable/proc/mergeConnectedNetworks  (code/modules/power/cable.dm:268)  may sleep
rt.def("/obj/structure/cable/proc/mergeConnectedNetworks", function* mergeConnectedNetworks(f: Frame, direction: Value) {
	let fdir: Value = null, TB: Value = null, C: Value = null, newPN: Value = null;
	let $0: any, $e: any;
	f.vars = () => [direction, fdir, TB, C, newPN, $0, $e];
	if (!truthy(live(direction))) {
		$0 = 0;
	} else {
		$0 = (yield* g.call(f, P("/proc/turn"), null, [live(direction), 180]));
	}
	fdir = $0;
	if (!(isEqual(rt.sv(f, "d1"), live(direction)) || isEqual(rt.sv(f, "d2"), live(direction)))) {
		return live(f.dot);
	}
	TB = rt.getStep(f, live(f.src), live(direction));
	C = null;
	rt.forList(f, 0, live(TB), T("/obj/structure/cable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (!truthy(live(C))) {
			continue;
		}
		if (isEqual(live(f.src), live(C))) {
			continue;
		}
		if ((isEqual(rt.fv(f, "d1", live(C)), live(fdir)) || isEqual(rt.fv(f, "d2", live(C)), live(fdir)))) {
			if (!truthy(rt.fv(f, "powernet", live(C)))) {
				yield* g.callName(f, (newPN = (yield* g.new_(f, T("/datum/powernet"), []))), "add_cable", [live(C)]);
			}
			if (truthy(rt.sv(f, "powernet"))) {
				yield* g.call(f, P("/proc/merge_powernets"), null, [rt.sv(f, "powernet"), rt.fv(f, "powernet", live(C))]);
			} else {
				yield* g.callName(f, rt.fv(f, "powernet", live(C)), "add_cable", [live(f.src)]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/cable/proc/mergeConnectedNetworksOnTurf  (code/modules/power/cable.dm:295)  may sleep
rt.def("/obj/structure/cable/proc/mergeConnectedNetworksOnTurf", function* mergeConnectedNetworksOnTurf(f: Frame) {
	let to_connect: Value = null, newPN: Value = null, AM: Value = null, C: Value = null, N: Value = null, M: Value = null, PM: Value = null;
	let $e: any;
	f.vars = () => [to_connect, newPN, AM, C, N, M, PM, $e];
	to_connect = rt.list();
	if (!truthy(rt.sv(f, "powernet"))) {
		yield* g.callName(f, (newPN = (yield* g.new_(f, T("/datum/powernet"), []))), "add_cable", [live(f.src)]);
	}
	AM = null;
	rt.forList(f, 0, rt.sv(f, "loc"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		if (truthy((rt.istype(live(AM), T("/obj/structure/cable")) ? 1 : 0))) {
			if ((((isEqual(rt.gv(f, "d1", (C = live(AM))), rt.sv(f, "d1")) || isEqual(rt.fv(f, "d2", live(C)), rt.sv(f, "d1"))) || isEqual(rt.fv(f, "d1", live(C)), rt.sv(f, "d2"))) || isEqual(rt.fv(f, "d2", live(C)), rt.sv(f, "d2")))) {
				if (isEqual(rt.fv(f, "powernet", live(C)), rt.sv(f, "powernet"))) {
					continue;
				}
				if (truthy(rt.fv(f, "powernet", live(C)))) {
					yield* g.call(f, P("/proc/merge_powernets"), null, [rt.sv(f, "powernet"), rt.fv(f, "powernet", live(C))]);
				} else {
					yield* g.callName(f, rt.sv(f, "powernet"), "add_cable", [live(C)]);
				}
			}
		} else {
			if (truthy((rt.istype(live(AM), T("/obj/machinery/power/apc")) ? 1 : 0))) {
				if (!truthy(rt.gv(f, "terminal", (N = live(AM))))) {
					continue;
				}
				if (isEqual(rt.gv(f, "powernet", rt.fv(f, "terminal", live(N))), rt.sv(f, "powernet"))) {
					continue;
				}
				to_connect = rt.modify(live(to_connect), rt.fv(f, "terminal", live(N)), add);
			} else {
				if (truthy((rt.istype(live(AM), T("/obj/machinery/power")) ? 1 : 0))) {
					if (isEqual(rt.gv(f, "powernet", (M = live(AM))), rt.sv(f, "powernet"))) {
						continue;
					}
					to_connect = rt.modify(live(to_connect), live(M), add);
				}
			}
		}
	}
	rt.endFor(f, 0);
	PM = null;
	rt.forList(f, 0, live(to_connect), T("/obj/machinery/power"));
	while (($e = rt.next(f, 0)) !== undefined) {
		PM = $e;
		if (!truthy((yield* g.callName(f, live(PM), "connect_to_network", [])))) {
			yield* g.callName(f, live(PM), "disconnect_from_network", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/cable/proc/get_connections  (code/modules/power/cable.dm:343)
rt.def("/obj/structure/cable/proc/get_connections", function get_connections(f: Frame, powernetless_only: Value) {
	let _T: Value = null;
	f.vars = () => [powernetless_only, _T];
	if (live(powernetless_only) === null) {
		powernetless_only = 0;
	}
	f.dot = rt.list();
	_T = null;
	if (truthy(rt.sv(f, "d1"))) {
		if (truthy((_T = rt.getStep(f, live(f.src), rt.sv(f, "d1"))))) {
			f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/power_list"), null, [live(_T), live(f.src), rt.call(f, P("/proc/turn"), null, [rt.sv(f, "d1"), 180]), live(powernetless_only)]), add);
		}
	}
	if (truthy(rt.bitAnd(rt.sv(f, "d1"), subtract(rt.sv(f, "d1"), 1)))) {
		if (truthy((_T = rt.getStep(f, live(f.src), rt.bitAnd(rt.sv(f, "d1"), 3))))) {
			f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/power_list"), null, [live(_T), live(f.src), rt.bitXor(rt.sv(f, "d1"), 3), live(powernetless_only)]), add);
		}
		if (truthy((_T = rt.getStep(f, live(f.src), rt.bitAnd(rt.sv(f, "d1"), 12))))) {
			f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/power_list"), null, [live(_T), live(f.src), rt.bitXor(rt.sv(f, "d1"), 12), live(powernetless_only)]), add);
		}
	}
	f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/power_list"), null, [rt.sv(f, "loc"), live(f.src), rt.sv(f, "d1"), live(powernetless_only)]), add);
	if (truthy((_T = rt.getStep(f, live(f.src), rt.sv(f, "d2"))))) {
		f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/power_list"), null, [live(_T), live(f.src), rt.call(f, P("/proc/turn"), null, [rt.sv(f, "d2"), 180]), live(powernetless_only)]), add);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "d2"), subtract(rt.sv(f, "d2"), 1)))) {
		if (truthy((_T = rt.getStep(f, live(f.src), rt.bitAnd(rt.sv(f, "d2"), 3))))) {
			f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/power_list"), null, [live(_T), live(f.src), rt.bitXor(rt.sv(f, "d2"), 3), live(powernetless_only)]), add);
		}
		if (truthy((_T = rt.getStep(f, live(f.src), rt.bitAnd(rt.sv(f, "d2"), 12))))) {
			f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/power_list"), null, [live(_T), live(f.src), rt.bitXor(rt.sv(f, "d2"), 12), live(powernetless_only)]), add);
		}
	}
	return (f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/power_list"), null, [rt.sv(f, "loc"), live(f.src), rt.sv(f, "d2"), live(powernetless_only)]), add));
});

// /obj/structure/cable/proc/denode  (code/modules/power/cable.dm:381)  may sleep
rt.def("/obj/structure/cable/proc/denode", function* denode(f: Frame) {
	let T1: Value = null, powerlist: Value = null, PN: Value = null;
	f.vars = () => [T1, powerlist, PN];
	if (!truthy((T1 = rt.sv(f, "loc")))) {
		return live(f.dot);
	}
	if (!rt.gt(rt.getLen(f, (powerlist = (yield* g.call(f, P("/proc/power_list"), null, [live(T1), live(f.src), 0, 0])))), 0)) return f.dot;
	PN = (yield* g.new_(f, T("/datum/powernet"), []));
	yield* g.call(f, P("/proc/propagate_network"), null, [rt.index(live(powerlist), 1), live(PN)]);
	if (!truthy((yield* g.callName(f, live(PN), "is_empty", [])))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(PN)]);
	return f.dot;
}, true);

// /obj/structure/cable/proc/cut_cable_from_powernet  (code/modules/power/cable.dm:394)  may sleep
rt.def("/obj/structure/cable/proc/cut_cable_from_powernet", function* cut_cable_from_powernet(f: Frame) {
	let T1: Value = null, P_list: Value = null, _P: Value = null, O: Value = null, newPN: Value = null, _P_3: Value = null;
	let $e: any;
	f.vars = () => [T1, P_list, _P, O, newPN, _P_3, $e];
	T1 = rt.sv(f, "loc");
	P_list = null;
	if (!truthy(live(T1))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "d1"))) {
		T1 = rt.getStep(f, live(T1), rt.sv(f, "d1"));
		P_list = (yield* g.call(f, P("/proc/power_list"), null, [null, live(T1), null, live(f.src), null, (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "d1"), 180])), null, 0, "cable_only", 1], rt.Args.Named));
	}
	if (isEqual(rt.getLen(f, (P_list = rt.modify(live(P_list), (yield* g.call(f, P("/proc/power_list"), null, [null, rt.sv(f, "loc"), null, live(f.src), null, rt.sv(f, "d1"), null, 0, "cable_only", 1], rt.Args.Named)), add))), 0)) {
		yield* g.callName(f, rt.sv(f, "powernet"), "remove_cable", [live(f.src)]);
		_P = null;
		rt.forList(f, 0, live(T1), T("/obj/machinery/power"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_P = $e;
			if (!truthy((yield* g.callName(f, live(_P), "connect_to_network", [])))) {
				yield* g.callName(f, live(_P), "disconnect_from_network", []);
			}
		}
		rt.endFor(f, 0);
		return live(f.dot);
	}
	O = rt.index(live(P_list), 1);
	rt.setSv(f, "loc", null);
	yield* g.callName(f, rt.sv(f, "powernet"), "remove_cable", [live(f.src)]);
	rt.spawnTail(f, 0, "/obj/structure/cable/proc/cut_cable_from_powernet: spawn at modules/power/cable.dm:418", T1, P_list, _P, O, newPN, _P_3);
	if (!isEqual(rt.sv(f, "d1"), 0)) return f.dot;
	_P_3 = null;
	rt.forList(f, 0, live(T1), T("/obj/machinery/power"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P_3 = $e;
		if (!truthy((yield* g.callName(f, live(_P_3), "connect_to_network", [])))) {
			yield* g.callName(f, live(_P_3), "disconnect_from_network", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// a spawn(0) body of /obj/structure/cable/proc/cut_cable_from_powernet, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/cable/proc/cut_cable_from_powernet: spawn at modules/power/cable.dm:418", function* (f: Frame, T1: Value, P_list: Value, _P: Value, O: Value, newPN: Value, _P_3: Value) {
	f.vars = () => [T1, P_list, _P, O, newPN, _P_3];
	if ((truthy(live(O)) && !(!truthy(live(O)) || truthy(rt.fv(f, "gc_destroyed", live(O)))))) {
		newPN = (yield* g.new_(f, T("/datum/powernet"), []));
		yield* g.call(f, P("/proc/propagate_network"), null, [live(O), live(newPN)]);
	}
	return null;
});

// /obj/structure/cable/proc/beforeShuttleMove  (code/modules/power/cable.dm:432)  may sleep
rt.def("/obj/structure/cable/proc/beforeShuttleMove", function* beforeShuttleMove(f: Frame, T1: Value, rotation: Value) {
	let on_edge: Value = null, A: Value = null, D: Value = null, tmp_loc: Value = null;
	let $e: any;
	f.vars = () => [T1, rotation, on_edge, A, D, tmp_loc, $e];
	on_edge = 0;
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	D = null;
	rt.forList(f, 0, rt.gl("alldirs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (!isEqual(live(A), (yield* g.call(f, P("/proc/get_area"), null, [rt.getStep(f, live(f.src), live(D))])))) {
			on_edge = 1;
			break;
		}
	}
	rt.endFor(f, 0);
	if (!(truthy(live(on_edge)) && truthy(rt.sv(f, "powernet")))) return f.dot;
	tmp_loc = rt.sv(f, "loc");
	yield* g.srcCall(f, "cut_cable_from_powernet");
	rt.setSv(f, "loc", live(tmp_loc));
	return f.dot;
}, true);

// /obj/structure/cable/proc/afterShuttleMove  (code/modules/power/cable.dm:446)  may sleep
rt.def("/obj/structure/cable/proc/afterShuttleMove", function* afterShuttleMove(f: Frame) {
	let on_edge: Value = null, A: Value = null, D: Value = null, PN: Value = null;
	let $e: any;
	f.vars = () => [on_edge, A, D, PN, $e];
	on_edge = 0;
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	D = null;
	rt.forList(f, 0, rt.gl("alldirs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (!isEqual(live(A), (yield* g.call(f, P("/proc/get_area"), null, [rt.getStep(f, live(f.src), live(D))])))) {
			on_edge = 1;
			break;
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(on_edge))) return f.dot;
	yield* g.callName(f, (PN = (yield* g.new_(f, T("/datum/powernet"), []))), "add_cable", [live(f.src)]);
	yield* g.srcCall(f, "mergeConnectedNetworks", rt.sv(f, "d1"));
	yield* g.srcCall(f, "mergeConnectedNetworks", rt.sv(f, "d2"));
	yield* g.srcCall(f, "mergeConnectedNetworksOnTurf");
	if (truthy(rt.bitAnd(rt.sv(f, "d1"), subtract(rt.sv(f, "d1"), 1)))) {
		yield* g.srcCall(f, "mergeDiagonalsNetworks", rt.sv(f, "d1"));
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "d2"), subtract(rt.sv(f, "d2"), 1)))) return f.dot;
	yield* g.srcCall(f, "mergeDiagonalsNetworks", rt.sv(f, "d2"));
	return f.dot;
}, true);

// /obj/structure/cable/proc/shuttleRotate  (code/modules/power/cable.dm:470)
rt.def("/obj/structure/cable/proc/shuttleRotate", function shuttleRotate(f: Frame, rotation: Value) {
	let temp: Value = null;
	f.vars = () => [temp];
	if (truthy(rt.sv(f, "d1"))) {
		rt.setSv(f, "d1", rt.call(f, P("/proc/angle2dir"), null, [add(live(rotation), rt.call(f, P("/proc/dir2angle"), null, [rt.sv(f, "d1")]))]));
	}
	if (truthy(rt.sv(f, "d2"))) {
		rt.setSv(f, "d2", rt.call(f, P("/proc/angle2dir"), null, [add(live(rotation), rt.call(f, P("/proc/dir2angle"), null, [rt.sv(f, "d2")]))]));
	}
	if (rt.gt(rt.sv(f, "d1"), rt.sv(f, "d2"))) {
		temp = rt.sv(f, "d1");
		rt.setSv(f, "d1", rt.sv(f, "d2"));
		rt.setSv(f, "d2", live(temp));
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalcable_coil_recipes  (code/modules/power/cable.dm:490)
rt.def("/datum/controller/global_vars/proc/InitGlobalcable_coil_recipes", function InitGlobalcable_coil_recipes(f: Frame) {
	rt.setGl("cable_coil_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), ["cable restraints", T("/obj/item/weapon/restraints/handcuffs/cable"), 15])));
	rt.modSrcVar(f, "gvars_datum_init_order", "cable_coil_recipes", add);
	return f.dot;
});

rt.type(9077, "/obj/item/stack/cable_coil", "/obj/item/stack", {
	throw_speed: 3,
	throw_range: 5,
	flags: 64,
	name: "cable coil",
	gender: "neuter",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "coil_red",
	item_state: "coil_red",
	max_amount: 30,
	amount: 30,
	merge_type: rt.typePath("/obj/item/stack/cable_coil"),
	item_color: "red",
	desc: "A coil of insulated power cable.",
	throwforce: 0,
	w_class: 2,
	materials: null,
	slot_flags: 512,
	attack_verb: null,
	singular_name: "cable piece",
	full_w_class: 2,
});

// /obj/item/stack/cable_coil/proc/<init>  (code/modules/power/cable.dm:507)
rt.def("/obj/item/stack/cable_coil/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10, "$glass", 5]));
	rt.setSv(f, "attack_verb", rt.list("whipped", "lashed", "disciplined", "flogged"));
	return f.dot;
});

rt.type(9078, "/obj/item/stack/cable_coil/cyborg", "/obj/item/stack/cable_coil", {
	is_cyborg: 1,
	materials: null,
	cost: 1,
});

// /obj/item/stack/cable_coil/cyborg/proc/<init>  (code/modules/power/cable.dm:516)
rt.def("/obj/item/stack/cable_coil/cyborg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	return f.dot;
});

// /obj/item/stack/cable_coil/cyborg/proc/attack_self  (code/modules/power/cable.dm:520)  may sleep
rt.def("/obj/item/stack/cable_coil/cyborg/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let cable_color: Value = null;
	f.vars = () => [user, cable_color];
	rt.setSv(f, "item_color", (cable_color = (yield* g.op(f, "Prompt", [0], [null, "Cable Color", "Pick a cable color.", live(user), rt.list("red", "yellow", "green", "blue", "pink", "orange", "cyan", "white")]))));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/stack/cable_coil/proc/suicide_act  (code/modules/power/cable.dm:525)
rt.def("/obj/item/stack/cable_coil/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	if (truthy(rt.locateIn(f, T("/obj/structure/chair/stool"), rt.getStep(f, live(user), 0)))) {
		rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is making a noose with ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	} else {
		rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is strangling ＀self with ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_them", []), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	}
	return 8;
});

// /obj/item/stack/cable_coil/proc/Initialize  (code/modules/power/cable.dm:532)  may sleep
rt.def("/obj/item/stack/cable_coil/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = null;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = null;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "amount", live(f.args[1]));
	}
	if (truthy(live(f.args[2]))) {
		rt.setSv(f, "item_color", live(f.args[2]));
	}
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-2, 2])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-2, 2])));
	yield* g.srcCall(f, "update_icon");
	rt.setSv(f, "recipes", rt.gl("cable_coil_recipes"));
	return f.dot;
}, true, { args: ["mapload", "new_amount", "param_color"] });

// /obj/item/stack/cable_coil/proc/attack  (code/modules/power/cable.dm:548)  may sleep
rt.def("/obj/item/stack/cable_coil/proc/attack", function* attack(f: Frame) {
	let affecting: Value = null;
	f.vars = () => [affecting];
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if ((truthy((affecting = (yield* g.callName(f, live(f.args[0]), "get_bodypart", [(yield* g.call(f, P("/proc/check_zone"), null, [rt.fv(f, "zone_selected", live(f.args[1]))]))])))) && isEqual(rt.fv(f, "status", live(affecting)), 2))) {
		if (isEqual(live(f.args[1]), live(f.args[0]))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ starts to fix some of the wires in ＀'s ＀.</span>", [live(f.args[1]), live(f.args[0]), rt.fv(f, "name", live(affecting))]), fmt("<span class='notice'>You start fixing some of the wires in ＀'s ＀.</span>", [live(f.args[0]), rt.fv(f, "name", live(affecting))])]);
			if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.args[1]), live(f.args[0]), 50])))) {
				return live(f.dot);
			}
		}
		if (truthy((yield* g.call(f, P("/proc/item_heal_robotic"), null, [live(f.args[0]), live(f.args[1]), 0, 15])))) {
			yield* g.srcCall(f, "use", 1);
		}
		return live(f.dot);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["H", "user"] });

// /obj/item/stack/cable_coil/proc/update_icon  (code/modules/power/cable.dm:565)
rt.def("/obj/item/stack/cable_coil/proc/update_icon", function update_icon(f: Frame) {
	if (!truthy(rt.sv(f, "item_color"))) {
		rt.setSv(f, "item_color", rt.op(f, "PickUnweighted", [4], ["red", "yellow", "blue", "green"]));
	}
	rt.setSv(f, "item_state", fmt("coil_＀", [rt.sv(f, "item_color")]));
	if (isEqual(rt.sv(f, "amount"), 1)) {
		rt.setSv(f, "icon_state", fmt("coil_＀1", [rt.sv(f, "item_color")]));
		rt.setSv(f, "name", "cable piece");
	} else {
		if (isEqual(rt.sv(f, "amount"), 2)) {
			rt.setSv(f, "icon_state", fmt("coil_＀2", [rt.sv(f, "item_color")]));
			rt.setSv(f, "name", "cable piece");
		} else {
			rt.setSv(f, "icon_state", fmt("coil_＀", [rt.sv(f, "item_color")]));
			rt.setSv(f, "name", "cable coil");
		}
	}
	return f.dot;
});

// /obj/item/stack/cable_coil/proc/attack_hand  (code/modules/power/cable.dm:579)  may sleep
rt.def("/obj/item/stack/cable_coil/proc/attack_hand", function* attack_hand(f: Frame) {
	let new_cable: Value = null;
	f.vars = () => [new_cable];
	if (!truthy((rt.istype((new_cable = (yield* g.callSuper(f, [], rt.Args.Same))), T("/obj/item/stack/cable_coil")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "item_color", live(new_cable), rt.sv(f, "item_color"));
	yield* g.callName(f, live(new_cable), "update_icon", []);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/stack/cable_coil/proc/give  (code/modules/power/cable.dm:586)
rt.def("/obj/item/stack/cable_coil/proc/give", function give(f: Frame, extra: Value) {
	if (rt.gt(add(rt.sv(f, "amount"), live(extra)), rt.sv(f, "max_amount"))) {
		rt.setSv(f, "amount", rt.sv(f, "max_amount"));
	} else {
		rt.modSrcVar(f, "amount", live(extra), add);
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/stack/cable_coil/proc/get_new_cable  (code/modules/power/cable.dm:599)  may sleep
rt.def("/obj/item/stack/cable_coil/proc/get_new_cable", function* get_new_cable(f: Frame, location: Value) {
	let path: Value = null;
	let $0: any, $1: any;
	f.vars = () => [location, path, $0, $1];
	$0 = "/obj/structure/cable";
	if (isEqual(rt.sv(f, "item_color"), "red")) {
		$1 = "";
	} else {
		$1 = add("/", rt.sv(f, "item_color"));
	}
	path = add($0, $1);
	return (yield* g.new_(f, live(path), [live(location)]));
}, true);

// /obj/item/stack/cable_coil/proc/place_turf  (code/modules/power/cable.dm:604)  may sleep
rt.def("/obj/item/stack/cable_coil/proc/place_turf", function* place_turf(f: Frame, _T: Value, user: Value) {
	let dirn: Value = null, LC: Value = null, C: Value = null, PN: Value = null;
	let $e: any;
	f.vars = () => [_T, user, dirn, LC, C, PN, $e];
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(user))])))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(_T), "can_have_cabling", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You can only lay cables on catwalks and plating!</span>"]);
		return live(f.dot);
	}
	if (rt.lt((yield* g.srcCall(f, "get_amount")), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There is no cable left!</span>"]);
		return live(f.dot);
	}
	if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(_T), live(user)])), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You can't lay cable at a place that far away!</span>"]);
		return live(f.dot);
	} else {
		dirn = null;
		if (isEqual(rt.fv(f, "loc", live(user)), live(_T))) {
			dirn = rt.fv(f, "dir", live(user));
		} else {
			dirn = rt.getDir(f, live(_T), live(user));
		}
		LC = null;
		rt.forList(f, 0, live(_T), T("/obj/structure/cable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			LC = $e;
			if ((isEqual(rt.fv(f, "d2", live(LC)), live(dirn)) && isEqual(rt.fv(f, "d1", live(LC)), 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There's already a cable at that position!</span>"]);
				return live(f.dot);
			}
		}
		rt.endFor(f, 0);
		rt.setFv(f, "d1", (C = (yield* g.srcCall(f, "get_new_cable", live(_T)))), 0);
		rt.setFv(f, "d2", live(C), live(dirn));
		yield* g.callName(f, live(C), "add_fingerprint", [live(user)]);
		yield* g.callName(f, live(C), "update_icon", []);
		yield* g.callName(f, (PN = (yield* g.new_(f, T("/datum/powernet"), []))), "add_cable", [live(C)]);
		yield* g.callName(f, live(C), "mergeConnectedNetworks", [rt.fv(f, "d2", live(C))]);
		yield* g.callName(f, live(C), "mergeConnectedNetworksOnTurf", []);
		if (truthy(rt.bitAnd(rt.fv(f, "d2", live(C)), subtract(rt.fv(f, "d2", live(C)), 1)))) {
			yield* g.callName(f, live(C), "mergeDiagonalsNetworks", [rt.fv(f, "d2", live(C))]);
		}
		yield* g.srcCall(f, "use", 1);
		if (!truthy((yield* g.callName(f, live(C), "shock", [live(user), 50])))) return f.dot;
		if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
		yield* g.callName(f, live(C), "deconstruct", []);
	}
	return f.dot;
}, true);

// /obj/item/stack/cable_coil/proc/cable_join  (code/modules/power/cable.dm:661)  may sleep
rt.def("/obj/item/stack/cable_coil/proc/cable_join", function* cable_join(f: Frame, C: Value, user: Value) {
	let U: Value = null, _T: Value = null, dirn: Value = null, fdirn: Value = null, LC: Value = null, NC: Value = null, newPN: Value = null, nd1: Value = null, nd2: Value = null, LC_5: Value = null;
	let $e: any;
	f.vars = () => [C, user, U, _T, dirn, fdirn, LC, NC, newPN, nd1, nd2, LC_5, $e];
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(U = rt.fv(f, "loc", live(user)))])))) {
		return live(f.dot);
	}
	if ((!truthy((yield* g.call(f, P("/proc/isturf"), null, [(_T = rt.fv(f, "loc", live(C)))]))) || truthy(rt.fv(f, "intact", live(_T))))) {
		return live(f.dot);
	}
	if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(C), live(user)])), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You can't lay cable at a place that far away!</span>"]);
		return live(f.dot);
	}
	if (isEqual(live(U), live(_T))) {
		yield* g.srcCall(f, "place_turf", live(_T), live(user));
		return live(f.dot);
	}
	dirn = rt.getDir(f, live(C), live(user));
	if ((isEqual(rt.fv(f, "d1", live(C)), live(dirn)) || isEqual(rt.fv(f, "d2", live(C)), live(dirn)))) {
		if (!truthy((yield* g.callName(f, live(U), "can_have_cabling", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You can only lay cables on catwalks and plating!</span>"]);
			return live(f.dot);
		}
		if (truthy(rt.fv(f, "intact", live(U)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You can't lay cable there unless the floor tiles are removed!</span>"]);
			return live(f.dot);
		} else {
			fdirn = (yield* g.call(f, P("/proc/turn"), null, [live(dirn), 180]));
			LC = null;
			rt.forList(f, 0, live(U), T("/obj/structure/cable"));
			while (($e = rt.next(f, 0)) !== undefined) {
				LC = $e;
				if ((isEqual(rt.fv(f, "d1", live(LC)), live(fdirn)) || isEqual(rt.fv(f, "d2", live(LC)), live(fdirn)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There's already a cable at that position!</span>"]);
					return live(f.dot);
				}
			}
			rt.endFor(f, 0);
			rt.setFv(f, "d1", (NC = (yield* g.srcCall(f, "get_new_cable", live(U)))), 0);
			rt.setFv(f, "d2", live(NC), live(fdirn));
			yield* g.callName(f, live(NC), "add_fingerprint", []);
			yield* g.callName(f, live(NC), "update_icon", []);
			yield* g.callName(f, (newPN = (yield* g.new_(f, T("/datum/powernet"), []))), "add_cable", [live(NC)]);
			yield* g.callName(f, live(NC), "mergeConnectedNetworks", [rt.fv(f, "d2", live(NC))]);
			yield* g.callName(f, live(NC), "mergeConnectedNetworksOnTurf", []);
			if (truthy(rt.bitAnd(rt.fv(f, "d2", live(NC)), subtract(rt.fv(f, "d2", live(NC)), 1)))) {
				yield* g.callName(f, live(NC), "mergeDiagonalsNetworks", [rt.fv(f, "d2", live(NC))]);
			}
			yield* g.srcCall(f, "use", 1);
			if (truthy((yield* g.callName(f, live(NC), "shock", [live(user), 50])))) {
				if (truthy(rt.op(f, "Prob", [], [50]))) {
					yield* g.callName(f, live(NC), "deconstruct", []);
				}
			}
			return live(f.dot);
		}
	} else {
		if (!isEqual(rt.fv(f, "d1", live(C)), 0)) return f.dot;
		nd1 = rt.fv(f, "d2", live(C));
		nd2 = live(dirn);
		if (rt.gt(live(nd1), live(nd2))) {
			nd1 = live(dirn);
			nd2 = rt.fv(f, "d2", live(C));
		}
		LC_5 = null;
		rt.forList(f, 0, live(_T), T("/obj/structure/cable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			LC_5 = $e;
			if (isEqual(live(LC_5), live(C))) {
				continue;
			}
			if (((isEqual(rt.fv(f, "d1", live(LC_5)), live(nd1)) && isEqual(rt.fv(f, "d2", live(LC_5)), live(nd2))) || (isEqual(rt.fv(f, "d1", live(LC_5)), live(nd2)) && isEqual(rt.fv(f, "d2", live(LC_5)), live(nd1))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There's already a cable at that position!</span>"]);
				return live(f.dot);
			}
		}
		rt.endFor(f, 0);
		yield* g.callName(f, live(C), "cableColor", [rt.sv(f, "item_color")]);
		rt.setFv(f, "d1", live(C), live(nd1));
		rt.setFv(f, "d2", live(C), live(nd2));
		yield* g.callName(f, live(C), "update_stored", [2, rt.sv(f, "item_color")]);
		yield* g.callName(f, live(C), "add_fingerprint", []);
		yield* g.callName(f, live(C), "update_icon", []);
		yield* g.callName(f, live(C), "mergeConnectedNetworks", [rt.fv(f, "d1", live(C))]);
		yield* g.callName(f, live(C), "mergeConnectedNetworks", [rt.fv(f, "d2", live(C))]);
		yield* g.callName(f, live(C), "mergeConnectedNetworksOnTurf", []);
		if (truthy(rt.bitAnd(rt.fv(f, "d1", live(C)), subtract(rt.fv(f, "d1", live(C)), 1)))) {
			yield* g.callName(f, live(C), "mergeDiagonalsNetworks", [rt.fv(f, "d1", live(C))]);
		}
		if (truthy(rt.bitAnd(rt.fv(f, "d2", live(C)), subtract(rt.fv(f, "d2", live(C)), 1)))) {
			yield* g.callName(f, live(C), "mergeDiagonalsNetworks", [rt.fv(f, "d2", live(C))]);
		}
		yield* g.srcCall(f, "use", 1);
		if (truthy((yield* g.callName(f, live(C), "shock", [live(user), 50])))) {
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				yield* g.callName(f, live(C), "deconstruct", []);
				return live(f.dot);
			}
		}
		yield* g.callName(f, live(C), "denode", []);
		return live(f.dot);
	}
	return f.dot;
}, true);

rt.type(9079, "/obj/item/stack/cable_coil/cut", "/obj/item/stack/cable_coil", {
	item_state: "coil_red2",
});

// /obj/item/stack/cable_coil/cut/proc/Initialize  (code/modules/power/cable.dm:784)  may sleep
rt.def("/obj/item/stack/cable_coil/cut/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "amount", (yield* g.call(f, P("/proc/rand"), null, [1, 2])));
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-2, 2])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-2, 2])));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(9088, "/obj/item/stack/cable_coil/random", "/obj/item/stack/cable_coil", {});

// /obj/item/stack/cable_coil/random/proc/Initialize  (code/modules/power/cable.dm:824)  may sleep
rt.def("/obj/item/stack/cable_coil/random/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "item_color", rt.op(f, "PickUnweighted", [8], ["red", "orange", "yellow", "green", "cyan", "blue", "pink", "white"]));
	rt.setSv(f, "icon_state", fmt("coil_＀", [rt.sv(f, "item_color")]));
	return f.dot;
}, true, { args: ["mapload"] });
