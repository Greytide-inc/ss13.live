// From code/modules/power/power.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10300, "/obj/machinery/power", "/obj/machinery", {
	powernet: null,
	anchored: 1,
	name: null,
	icon: rt.rsc("icons/obj/power.dmi"),
	on_blueprints: 1,
	use_power: 0,
	idle_power_usage: 0,
	active_power_usage: 0,
});

// /obj/machinery/power/proc/Destroy  (code/modules/power/power.dm:20)  may sleep
rt.def("/obj/machinery/power/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "disconnect_from_network");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/power/proc/surplus  (code/modules/power/power.dm:38)
rt.def("/obj/machinery/power/proc/surplus", function surplus(f: Frame) {
	if (truthy(rt.sv(f, "powernet"))) {
		return subtract(rt.fv(f, "avail", rt.sv(f, "powernet")), rt.fv(f, "load", rt.sv(f, "powernet")));
	}
	return 0;
});

// /obj/machinery/power/proc/avail  (code/modules/power/power.dm:44)
rt.def("/obj/machinery/power/proc/avail", function avail(f: Frame) {
	if (truthy(rt.sv(f, "powernet"))) {
		return rt.fv(f, "avail", rt.sv(f, "powernet"));
	}
	return 0;
});

// /obj/machinery/proc/powered  (code/modules/power/power.dm:54)
rt.def("/obj/machinery/proc/powered", function powered(f: Frame, chan: Value) {
	let A: Value = null;
	f.vars = () => [chan, A];
	if (live(chan) === null) {
		chan = -1;
	}
	if (!truthy(rt.sv(f, "loc"))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "use_power"))) {
		return 1;
	}
	if (!truthy((A = rt.call(f, P("/proc/get_area"), null, [live(f.src)])))) {
		return 0;
	}
	if (isEqual(live(chan), -1)) {
		chan = rt.sv(f, "power_channel");
	}
	return rt.callName(f, live(A), "powered", [live(chan)]);
});

// /obj/machinery/proc/use_power  (code/modules/power/power.dm:68)
rt.def("/obj/machinery/proc/use_power", function use_power(f: Frame, amount: Value, chan: Value) {
	let A: Value = null;
	f.vars = () => [chan, A];
	if (live(chan) === null) {
		chan = -1;
	}
	if (!truthy((A = rt.call(f, P("/proc/get_area"), null, [live(f.src)])))) {
		return live(f.dot);
	}
	if (isEqual(live(chan), -1)) {
		chan = rt.sv(f, "power_channel");
	}
	rt.callName(f, live(A), "use_power", [live(amount), live(chan)]);
	return f.dot;
});

// /obj/machinery/proc/addStaticPower  (code/modules/power/power.dm:76)
rt.def("/obj/machinery/proc/addStaticPower", function addStaticPower(f: Frame, value: Value, powerchannel: Value) {
	let A: Value = null;
	f.vars = () => [A];
	if (!truthy((A = rt.call(f, P("/proc/get_area"), null, [live(f.src)])))) {
		return live(f.dot);
	}
	rt.callName(f, live(A), "addStaticPower", [live(value), live(powerchannel)]);
	return f.dot;
});

// /obj/machinery/proc/removeStaticPower  (code/modules/power/power.dm:82)
rt.def("/obj/machinery/proc/removeStaticPower", function removeStaticPower(f: Frame, value: Value, powerchannel: Value) {
	rt.callSrc(f, "addStaticPower", [rt.neg(live(value)), live(powerchannel)]);
	return f.dot;
});

// /obj/machinery/proc/power_change  (code/modules/power/power.dm:87)
rt.def("/obj/machinery/proc/power_change", function power_change(f: Frame) {
	if (truthy(rt.callSrc(f, "powered", [rt.sv(f, "power_channel")]))) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
	} else {
		(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	}
	return live(f.dot);
});

// /obj/machinery/power/proc/connect_to_network  (code/modules/power/power.dm:97)  may sleep
rt.def("/obj/machinery/power/proc/connect_to_network", function* connect_to_network(f: Frame) {
	let _T: Value = null, C: Value = null;
	f.vars = () => [_T, C];
	if ((!truthy((_T = rt.fv(f, "loc", live(f.src)))) || !truthy((rt.istype(live(_T), T("/turf")) ? 1 : 0)))) {
		return 0;
	}
	if ((!truthy((C = (yield* g.callName(f, live(_T), "get_cable_node", [])))) || !truthy(rt.fv(f, "powernet", live(C))))) {
		return 0;
	}
	yield* g.callName(f, rt.fv(f, "powernet", live(C)), "add_machine", [live(f.src)]);
	return 1;
}, true);

// /obj/machinery/power/proc/disconnect_from_network  (code/modules/power/power.dm:109)  may sleep
rt.def("/obj/machinery/power/proc/disconnect_from_network", function* disconnect_from_network(f: Frame) {
	if (!truthy(rt.sv(f, "powernet"))) {
		return 0;
	}
	yield* g.callName(f, rt.sv(f, "powernet"), "remove_machine", [live(f.src)]);
	return 1;
}, true);

// /obj/machinery/power/proc/attackby  (code/modules/power/power.dm:117)  may sleep
rt.def("/obj/machinery/power/proc/attackby", function* attackby(f: Frame) {
	let coil: Value = null, _T: Value = null;
	f.vars = () => [coil, _T];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
		coil = live(f.args[0]);
		if ((truthy(rt.gv(f, "intact", (_T = rt.fv(f, "loc", live(f.args[1]))))) || !truthy((rt.istype(live(_T), T("/turf/open/floor")) ? 1 : 0)))) {
			return live(f.dot);
		}
		if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[1])])), 1)) {
			return live(f.dot);
		}
		yield* g.callName(f, live(coil), "place_turf", [live(_T), live(f.args[1])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/power/proc/get_connections  (code/modules/power/power.dm:137)
rt.def("/obj/machinery/power/proc/get_connections", function get_connections(f: Frame) {
	let cdir: Value = null, _T: Value = null, card: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [cdir, _T, card, C, $e];
	f.dot = rt.list();
	cdir = null;
	_T = null;
	card = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		card = $e;
		cdir = rt.getDir(f, (_T = rt.getStep(f, rt.sv(f, "loc"), live(card))), rt.sv(f, "loc"));
		C = null;
		rt.forList(f, 1, live(_T), T("/obj/structure/cable"));
		while (($e = rt.next(f, 1)) !== undefined) {
			C = $e;
			if (truthy(rt.fv(f, "powernet", live(C)))) {
				continue;
			}
			if ((isEqual(rt.fv(f, "d1", live(C)), live(cdir)) || isEqual(rt.fv(f, "d2", live(C)), live(cdir)))) {
				f.dot = rt.modify(live(f.dot), live(C), add);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return live(f.dot);
});

// /obj/machinery/power/proc/get_marked_connections  (code/modules/power/power.dm:157)
rt.def("/obj/machinery/power/proc/get_marked_connections", function get_marked_connections(f: Frame) {
	let cdir: Value = null, _T: Value = null, card: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [cdir, _T, card, C, $e];
	f.dot = rt.list();
	cdir = null;
	_T = null;
	card = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		card = $e;
		cdir = rt.getDir(f, (_T = rt.getStep(f, rt.sv(f, "loc"), live(card))), rt.sv(f, "loc"));
		C = null;
		rt.forList(f, 1, live(_T), T("/obj/structure/cable"));
		while (($e = rt.next(f, 1)) !== undefined) {
			C = $e;
			if ((isEqual(rt.fv(f, "d1", live(C)), live(cdir)) || isEqual(rt.fv(f, "d2", live(C)), live(cdir)))) {
				f.dot = rt.modify(live(f.dot), live(C), add);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return live(f.dot);
});

// /obj/machinery/power/proc/get_indirect_connections  (code/modules/power/power.dm:173)
rt.def("/obj/machinery/power/proc/get_indirect_connections", function get_indirect_connections(f: Frame) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	f.dot = rt.list();
	C = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/structure/cable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (truthy(rt.fv(f, "powernet", live(C)))) {
			continue;
		}
		if (isEqual(rt.fv(f, "d1", live(C)), 0)) {
			f.dot = rt.modify(live(f.dot), live(C), add);
		}
	}
	rt.endFor(f, 0);
	return live(f.dot);
});

// /proc/power_list  (code/modules/power/power.dm:190)
rt.def("/proc/power_list", function power_list(f: Frame, _T: Value, source: Value, d: Value, unmarked: Value, cable_only: Value) {
	let AM: Value = null, _P: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [unmarked, cable_only, AM, _P, C, $e];
	if (live(unmarked) === null) {
		unmarked = 0;
	}
	if (live(cable_only) === null) {
		cable_only = 0;
	}
	f.dot = rt.list();
	AM = null;
	rt.forList(f, 0, live(_T));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		if (isEqual(live(AM), live(source))) {
			continue;
		}
		if ((!truthy(live(cable_only)) && truthy((rt.istype(live(AM), T("/obj/machinery/power")) ? 1 : 0)))) {
			if (isEqual(rt.gv(f, "powernet", (_P = live(AM))), 0)) {
				continue;
			}
			if ((!truthy(live(unmarked)) || !truthy(rt.fv(f, "powernet", live(_P))))) {
				if (isEqual(live(d), 0)) {
					f.dot = rt.modify(live(f.dot), live(_P), add);
				}
			}
		} else {
			if (truthy((rt.istype(live(AM), T("/obj/structure/cable")) ? 1 : 0))) {
				C = live(AM);
				if ((!truthy(live(unmarked)) || !truthy(rt.fv(f, "powernet", live(C))))) {
					if ((isEqual(rt.fv(f, "d1", live(C)), live(d)) || isEqual(rt.fv(f, "d2", live(C)), live(d)))) {
						f.dot = rt.modify(live(f.dot), live(C), add);
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	return live(f.dot);
});

// /proc/propagate_network  (code/modules/power/power.dm:220)  may sleep
rt.def("/proc/propagate_network", function* propagate_network(f: Frame, O: Value, PN: Value) {
	let worklist: Value = null, found_machines: Value = null, visited: Value = null, index: Value = null, _P: Value = null, C: Value = null, A: Value = null, M: Value = null, PM: Value = null;
	let $e: any;
	f.vars = () => [O, PN, worklist, found_machines, visited, index, _P, C, A, M, PM, $e];
	worklist = rt.list();
	found_machines = rt.list();
	visited = rt.list();
	index = 1;
	_P = null;
	worklist = rt.modify(live(worklist), live(O), add);
	rt.setAt(live(visited), live(O), 1);
	while (rt.le(live(index), rt.len(f, live(worklist)))) {
		_P = rt.index(live(worklist), live(index));
		index = rt.inc(live(index), 1);
		if (truthy((rt.istype(live(_P), T("/obj/structure/cable")) ? 1 : 0))) {
			if (!isEqual(rt.gv(f, "powernet", (C = live(_P))), live(PN))) {
				yield* g.callName(f, live(PN), "add_cable", [live(C)]);
			}
			A = null;
			rt.forList(f, 0, (yield* g.callName(f, live(C), "get_connections", [])), T("/obj"));
			while (($e = rt.next(f, 0)) !== undefined) {
				A = $e;
				if (!truthy(rt.index(live(visited), live(A)))) {
					rt.setAt(live(visited), live(A), 1);
					worklist = rt.modify(live(worklist), live(A), add);
				}
			}
			rt.endFor(f, 0);
		} else {
			if ((truthy(rt.fv(f, "anchored", live(_P))) && truthy((rt.istype(live(_P), T("/obj/machinery/power")) ? 1 : 0)))) {
				found_machines = rt.modify(live(found_machines), (M = live(_P)), add);
			} else {
				continue;
			}
		}
	}
	PM = null;
	rt.forList(f, 0, live(found_machines), T("/obj/machinery/power"));
	while (($e = rt.next(f, 0)) !== undefined) {
		PM = $e;
		if (!truthy((yield* g.callName(f, live(PM), "connect_to_network", [])))) {
			yield* g.callName(f, live(PM), "disconnect_from_network", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/merge_powernets  (code/modules/power/power.dm:257)  may sleep
rt.def("/proc/merge_powernets", function* merge_powernets(f: Frame, net1: Value, net2: Value) {
	let temp: Value = null, Cable: Value = null, Node: Value = null;
	let $e: any;
	f.vars = () => [net1, net2, temp, Cable, Node, $e];
	if ((!truthy(live(net1)) || !truthy(live(net2)))) {
		return live(f.dot);
	}
	if (isEqual(live(net1), live(net2))) {
		return live(f.dot);
	}
	if (rt.lt(rt.getLen(f, rt.fv(f, "cables", live(net1))), rt.getLen(f, rt.fv(f, "cables", live(net2))))) {
		temp = live(net1);
		net1 = live(net2);
		net2 = live(temp);
	}
	Cable = null;
	rt.forList(f, 0, rt.fv(f, "cables", live(net2)), T("/obj/structure/cable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Cable = $e;
		yield* g.callName(f, live(net1), "add_cable", [live(Cable)]);
	}
	rt.endFor(f, 0);
	Node = null;
	rt.forList(f, 0, rt.fv(f, "nodes", live(net2)), T("/obj/machinery/power"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Node = $e;
		if (!truthy((yield* g.callName(f, live(Node), "connect_to_network", [])))) {
			yield* g.callName(f, live(Node), "disconnect_from_network", []);
		}
	}
	rt.endFor(f, 0);
	return live(net1);
}, true);

// /proc/electrocute_mob  (code/modules/power/power.dm:287)  may sleep
rt.def("/proc/electrocute_mob", function* electrocute_mob(f: Frame, M: Value, power_source: Value, source: Value, siemens_coeff: Value, dist_check: Value) {
	let H: Value = null, G: Value = null, source_area: Value = null, Cable: Value = null, PN: Value = null, cell: Value = null, apc: Value = null, PN_damage: Value = null, cell_damage: Value = null, shock_damage: Value = null, drained_hp: Value = null, drained_energy: Value = null, drained_power: Value = null;
	f.vars = () => [M, power_source, source, siemens_coeff, dist_check, H, G, source_area, Cable, PN, cell, apc, PN_damage, cell_damage, shock_damage, drained_hp, drained_energy, drained_power];
	if (live(siemens_coeff) === null) {
		siemens_coeff = 1;
	}
	if (live(dist_check) === null) {
		dist_check = 0;
	}
	if (truthy((rt.istype(rt.fv(f, "loc", live(M)), T("/obj/mecha")) ? 1 : 0))) {
		return 0;
	}
	if (truthy(live(dist_check))) {
		if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(source), live(M)])), 1)) {
			return 0;
		}
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "gloves", (H = live(M))))) {
			if (isEqual(rt.gv(f, "siemens_coefficient", (G = rt.fv(f, "gloves", live(H)))), 0)) {
				return 0;
			}
		}
	}
	source_area = null;
	if (truthy((rt.istype(live(power_source), T("/area")) ? 1 : 0))) {
		power_source = (yield* g.callName(f, (source_area = live(power_source)), "get_apc", []));
	}
	if (truthy((rt.istype(live(power_source), T("/obj/structure/cable")) ? 1 : 0))) {
		power_source = rt.gv(f, "powernet", (Cable = live(power_source)));
	}
	PN = null;
	cell = null;
	if (truthy((rt.istype(live(power_source), T("/datum/powernet")) ? 1 : 0))) {
		PN = live(power_source);
	} else {
		if (truthy((rt.istype(live(power_source), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0))) {
			cell = live(power_source);
		} else {
			if (truthy((rt.istype(live(power_source), T("/obj/machinery/power/apc")) ? 1 : 0))) {
				cell = rt.gv(f, "cell", (apc = live(power_source)));
				if (truthy(rt.fv(f, "terminal", live(apc)))) {
					PN = rt.gv(f, "powernet", rt.fv(f, "terminal", live(apc)));
				}
			} else {
				if (!truthy(live(power_source))) {
					return 0;
				} else {
					yield* g.call(f, P("/proc/log_admin"), null, [fmt("ERROR: /proc/electrocute_mob(＀, ＀, ＀): wrong power_source", [live(M), live(power_source), live(source)])]);
					return 0;
				}
			}
		}
	}
	if ((!truthy(live(cell)) && !truthy(live(PN)))) {
		return 0;
	}
	PN_damage = 0;
	cell_damage = 0;
	if (truthy(live(PN))) {
		PN_damage = (yield* g.callName(f, live(PN), "get_electrocute_damage", []));
	}
	if (truthy(live(cell))) {
		cell_damage = (yield* g.callName(f, live(cell), "get_electrocute_damage", []));
	}
	shock_damage = 0;
	if (rt.ge(live(PN_damage), live(cell_damage))) {
		power_source = live(PN);
		shock_damage = live(PN_damage);
	} else {
		power_source = live(cell);
		shock_damage = live(cell_damage);
	}
	drained_hp = (yield* g.callName(f, live(M), "electrocute_act", [live(shock_damage), live(source), live(siemens_coeff)]));
	yield* g.call(f, P("/proc/add_logs"), null, [live(source), live(M), "electrocuted"]);
	drained_energy = multiply(live(drained_hp), 20);
	if (truthy(live(source_area))) {
		yield* g.callName(f, live(source_area), "use_power", [divide(live(drained_energy), rt.gl("CELLRATE"))]);
	} else {
		if (truthy((rt.istype(live(power_source), T("/datum/powernet")) ? 1 : 0))) {
			drained_power = divide(live(drained_energy), rt.gl("CELLRATE"));
			rt.modField(f, live(PN), "load", live(drained_power), add);
		} else {
			if (truthy((rt.istype(live(power_source), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0))) {
				yield* g.callName(f, live(cell), "use", [live(drained_energy)]);
			}
		}
	}
	return live(drained_energy);
}, true);

// /turf/proc/get_cable_node  (code/modules/power/power.dm:361)
rt.def("/turf/proc/get_cable_node", function get_cable_node(f: Frame) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	if (!truthy(rt.callSrc(f, "can_have_cabling", []))) {
		return null;
	}
	C = null;
	rt.forList(f, 0, live(f.src), T("/obj/structure/cable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (isEqual(rt.fv(f, "d1", live(C)), 0)) {
			return live(C);
		}
	}
	rt.endFor(f, 0);
	return null;
});

// /area/proc/get_apc  (code/modules/power/power.dm:369)
rt.def("/area/proc/get_apc", function get_apc(f: Frame) {
	let APC: Value = null;
	let $e: any;
	f.vars = () => [APC, $e];
	APC = null;
	rt.forList(f, 0, rt.gl("apcs_list"), T("/obj/machinery/power/apc"));
	while (($e = rt.next(f, 0)) !== undefined) {
		APC = $e;
		if (isEqual(rt.fv(f, "area", live(APC)), live(f.src))) {
			return live(APC);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
