// Based on /tg/station's code/modules/power/power.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// power.dm:20
rt.def("/obj/machinery/power/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.disconnect_from_network();
	return (yield* parent_proc());
}, true);

// power.dm:38
rt.def("/obj/machinery/power/proc/surplus", function surplus(f: Frame) {
	if (this.powernet) {
		return this.powernet.avail - this.powernet.load;
	}
	return 0;
});

// power.dm:44
rt.def("/obj/machinery/power/proc/avail", function avail(f: Frame) {
	if (this.powernet) {
		return this.powernet.avail;
	}
	return 0;
});

// power.dm:54
rt.def("/obj/machinery/proc/powered", function powered(f: Frame, chan: Value) {
	let A: Value = null;
	chan ??= -1;
	if (!this.loc) {
		return 0;
	}
	if (!this.use_power) {
		return 1;
	}
	if (!(A = get_area(this))) {
		return 0;
	}
	if (chan == -1) {
		chan = this.power_channel;
	}
	return A.powered(chan);
});

// power.dm:68
rt.def("/obj/machinery/proc/use_power", function use_power(f: Frame, amount: Value, chan: Value) {
	let A: Value = null;
	chan ??= -1;
	if (!(A = get_area(this))) {
		return f.dot;
	}
	if (chan == -1) {
		chan = this.power_channel;
	}
	A.use_power(amount, chan);
	return f.dot;
});

// power.dm:76
rt.def("/obj/machinery/proc/addStaticPower", function addStaticPower(f: Frame, value: Value, powerchannel: Value) {
	let A: Value = null;
	if (!(A = get_area(this))) {
		return f.dot;
	}
	A.addStaticPower(value, powerchannel);
	return f.dot;
});

// power.dm:82
rt.def("/obj/machinery/proc/removeStaticPower", function removeStaticPower(f: Frame, value: Value, powerchannel: Value) {
	this.addStaticPower(-value, powerchannel);
	return f.dot;
});

// power.dm:87
rt.def("/obj/machinery/proc/power_change", function power_change(f: Frame) {
	if (this.powered(this.power_channel)) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
	} else {
		(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	}
	return f.dot;
});

// power.dm:97
rt.def("/obj/machinery/power/proc/connect_to_network", function* connect_to_network(f: Frame) {
	let _T: Value = null, C: Value = null;
	if (!(_T = this.loc) || !rt.istype(_T, T("/turf"))) {
		return 0;
	}
	if (!(C = _T.get_cable_node()) || !C.powernet) {
		return 0;
	}
	yield* C.powernet.add_machine(this);
	return 1;
}, true);

// power.dm:109
rt.def("/obj/machinery/power/proc/disconnect_from_network", function* disconnect_from_network(f: Frame) {
	if (!this.powernet) {
		return 0;
	}
	yield* this.powernet.remove_machine(this);
	return 1;
}, true);

// power.dm:117
rt.def("/obj/machinery/power/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let coil: Value = null, _T: Value = null;
	if (rt.istype(W, T("/obj/item/stack/cable_coil"))) {
		coil = W;
		if ((_T = user.loc).intact || !rt.istype(_T, T("/turf/open/floor"))) {
			return f.dot;
		}
		if (get_dist(this, user) > 1) {
			return f.dot;
		}
		yield* coil.place_turf(_T, user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// power.dm:137
rt.def("/obj/machinery/power/proc/get_connections", function get_connections(f: Frame) {
	let cdir: Value = null, _T: Value = null, card: Value = null, C: Value = null;
	f.dot = list();
	for (card of each(GLOB.cardinal)) {
		cdir = rt.getDir(f, (_T = rt.getStep(f, this.loc, card)), this.loc);
		C = null;
		for (C of each(_T, T("/obj/structure/cable"))) {
			if (C.powernet) {
				continue;
			}
			if (C.d1 == cdir || C.d2 == cdir) {
				f.dot += C;
			}
		}
	}
	return f.dot;
});

// power.dm:190
rt.def("/proc/power_list", function power_list(f: Frame, _T: Value, source: Value, d: Value, unmarked: Value, cable_only: Value) {
	let AM: Value = null, _P: Value = null, C: Value = null;
	unmarked ??= 0;
	cable_only ??= 0;
	f.dot = list();
	for (AM of each(_T)) {
		if (AM == source) {
			continue;
		}
		if (!cable_only && rt.istype(AM, T("/obj/machinery/power"))) {
			if ((_P = AM).powernet == 0) {
				continue;
			}
			if (!unmarked || !_P.powernet) {
				if (d == 0) {
					f.dot += _P;
				}
			}
		} else if (rt.istype(AM, T("/obj/structure/cable"))) {
			C = AM;
			if (!unmarked || !C.powernet) {
				if (C.d1 == d || C.d2 == d) {
					f.dot += C;
				}
			}
		}
	}
	return f.dot;
});

// power.dm:220
rt.def("/proc/propagate_network", function* propagate_network(f: Frame, O: Value, PN: Value) {
	let _P: Value = null, C: Value = null, A: Value = null, M: Value = null, PM: Value = null;
	let worklist: Value = list();
	let found_machines: Value = list();
	let visited: Value = list();
	let index: Value = 1;
	worklist += O;
	rt.setAt(visited, O, 1);
	while (index <= rt.len(f, worklist)) {
		_P = rt.index(worklist, index);
		index++;
		if (rt.istype(_P, T("/obj/structure/cable"))) {
			if ((C = _P).powernet != PN) {
				yield* PN.add_cable(C);
			}
			A = null;
			for (A of each(C.get_connections(), T("/obj"))) {
				if (!rt.index(visited, A)) {
					rt.setAt(visited, A, 1);
					worklist += A;
				}
			}
		} else if (_P.anchored && rt.istype(_P, T("/obj/machinery/power"))) {
			found_machines += (M = _P);
		} else {
			continue;
		}
	}
	for (PM of each(found_machines, T("/obj/machinery/power"))) {
		if (!(yield* PM.connect_to_network())) {
			yield* PM.disconnect_from_network();
		}
	}
	return f.dot;
}, true);

// power.dm:257
rt.def("/proc/merge_powernets", function* merge_powernets(f: Frame, net1: Value, net2: Value) {
	let temp: Value = null, Cable: Value = null, Node: Value = null;
	if (!net1 || !net2) {
		return f.dot;
	}
	if (net1 == net2) {
		return f.dot;
	}
	if (rt.len(f, net1.cables) < rt.len(f, net2.cables)) {
		temp = net1;
		net1 = net2;
		net2 = temp;
	}
	for (Cable of each(net2.cables, T("/obj/structure/cable"))) {
		yield* net1.add_cable(Cable);
	}
	for (Node of each(net2.nodes, T("/obj/machinery/power"))) {
		if (!(yield* Node.connect_to_network())) {
			yield* Node.disconnect_from_network();
		}
	}
	return net1;
}, true);

// power.dm:287
rt.def("/proc/electrocute_mob", function* electrocute_mob(f: Frame, M: Value, power_source: Value, source: Value, siemens_coeff: Value, dist_check: Value) {
	let H: Value = null, G: Value = null, source_area: Value = null, Cable: Value = null, PN: Value = null, cell: Value = null, apc: Value = null, drained_power: Value = null;
	siemens_coeff ??= 1;
	dist_check ??= 0;
	if (rt.istype(M.loc, T("/obj/mecha"))) {
		return 0;
	}
	if (dist_check) {
		if (!(get_dist(source, M) <= 1)) {
			return 0;
		}
	}
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		if ((H = M).gloves) {
			if ((G = H.gloves).siemens_coefficient == 0) {
				return 0;
			}
		}
	}
	if (rt.istype(power_source, T("/area"))) {
		power_source = (source_area = power_source).get_apc();
	}
	if (rt.istype(power_source, T("/obj/structure/cable"))) {
		power_source = (Cable = power_source).powernet;
	}
	if (rt.istype(power_source, T("/datum/powernet"))) {
		PN = power_source;
	} else if (rt.istype(power_source, T("/obj/item/weapon/stock_parts/cell"))) {
		cell = power_source;
	} else if (rt.istype(power_source, T("/obj/machinery/power/apc"))) {
		cell = (apc = power_source).cell;
		if (apc.terminal) {
			PN = apc.terminal.powernet;
		}
	} else if (!power_source) {
		return 0;
	} else {
		log_admin(`ERROR: /proc/electrocute_mob(${M}, ${power_source}, ${source}): wrong power_source`);
		return 0;
	}
	if (!cell && !PN) {
		return 0;
	}
	let PN_damage: Value = 0;
	let cell_damage: Value = 0;
	if (PN) {
		PN_damage = PN.get_electrocute_damage();
	}
	if (cell) {
		cell_damage = cell.get_electrocute_damage();
	}
	let shock_damage: Value = 0;
	if (PN_damage >= cell_damage) {
		power_source = PN;
		shock_damage = PN_damage;
	} else {
		power_source = cell;
		shock_damage = cell_damage;
	}
	let drained_hp: Value = (yield* M.electrocute_act(shock_damage, source, siemens_coeff));
	add_logs(source, M, "electrocuted");
	let drained_energy: Value = drained_hp * 20;
	if (source_area) {
		yield* source_area.use_power(drained_energy / GLOB.CELLRATE);
	} else if (rt.istype(power_source, T("/datum/powernet"))) {
		drained_power = drained_energy / GLOB.CELLRATE;
		PN.load += drained_power;
	} else if (rt.istype(power_source, T("/obj/item/weapon/stock_parts/cell"))) {
		yield* cell.use(drained_energy);
	}
	return drained_energy;
}, true);

// power.dm:361
rt.def("/turf/proc/get_cable_node", function get_cable_node(f: Frame) {
	let C: Value = null;
	if (!this.can_have_cabling()) {
		return null;
	}
	for (C of each(this, T("/obj/structure/cable"))) {
		if (C.d1 == 0) {
			return C;
		}
	}
	return null;
});

// power.dm:369
rt.def("/area/proc/get_apc", function get_apc(f: Frame) {
	let APC: Value = null;
	for (APC of each(GLOB.apcs_list, T("/obj/machinery/power/apc"))) {
		if (APC.area == this) {
			return APC;
		}
	}
	return f.dot;
});
