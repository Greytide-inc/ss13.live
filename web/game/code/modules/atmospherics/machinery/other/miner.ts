// Based on /tg/station's code/modules/atmospherics/machinery/other/miner.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10611, "/obj/machinery/atmospherics/miner", "/obj/machinery/atmospherics", {
	spawn_id: null,
	spawn_temp: 293.15,
	spawn_mol: 1039.8379,
	max_ext_mol: 1e+31,
	max_ext_kpa: 6500,
	overlay_color: "#FFFFFF",
	active: 1,
	power_draw: 0,
	power_draw_static: 2000,
	power_draw_dynamic_mol_coeff: 5,
	power_draw_dynamic_kpa_coeff: 0.5,
	broken: 0,
	broken_message: "ERROR",
	anchored: 1,
	name: "gas miner",
	desc: "Gasses mined from the gas giant below (above?) flow out through this massive vent.",
	icon: rt.rsc("icons/obj/atmospherics/components/miners.dmi"),
	icon_state: "miner",
	density: 0,
	resistance_flags: 98,
	idle_power_usage: 150,
	active_power_usage: 2000,
});

// miner.dm:33
rt.def("/obj/machinery/atmospherics/miner/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.set_active(this.active);
	return f.dot;
}, true);

// miner.dm:37
rt.def("/obj/machinery/atmospherics/miner/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.broken) return f.dot;
	to_chat(user, `Its debug output is printing "${this.broken_message}"`);
	return f.dot;
}, false);

// miner.dm:42
rt.def("/obj/machinery/atmospherics/miner/proc/check_operation", function check_operation(f: Frame) {
	let _T: Value = null, OT: Value = null, G: Value = null;
	if (!this.active) {
		return 0;
	}
	if (!rt.istype((_T = rt.getStep(f, this, 0)), T("/turf/open"))) {
		this.broken_message = "<span class='boldnotice'>VENT BLOCKED</span>";
		this.set_broken(1);
		return 0;
	}
	if ((OT = _T).planetary_atmos) {
		this.broken_message = "<span class='boldwarning'>DEVICE NOT ENCLOSED IN A PRESSURIZED ENVIRONMENT</span>";
		this.set_broken(1);
		return 0;
	}
	if (rt.istype(_T, T("/turf/open/space"))) {
		this.broken_message = "<span class='boldnotice'>AIR VENTING TO SPACE</span>";
		this.set_broken(1);
		return 0;
	}
	if ((G = OT.return_air()).return_pressure() > this.max_ext_kpa - this.spawn_mol * this.spawn_temp * R_IDEAL_GAS_EQUATION / CELL_VOLUME) {
		this.broken_message = "<span class='boldwarning'>EXTERNAL PRESSURE OVER THRESHOLD</span>";
		this.set_broken(1);
		return 0;
	}
	if (G.total_moles() > this.max_ext_mol) {
		this.broken_message = "<span class='boldwarning'>EXTERNAL AIR CONCENTRATION OVER THRESHOLD</span>";
		this.set_broken(1);
		return 0;
	}
	if (this.broken) {
		this.set_broken(0);
		this.broken_message = "";
	}
	return 1;
});

// miner.dm:73
rt.def("/obj/machinery/atmospherics/miner/proc/set_active", function set_active(f: Frame, setting: Value) {
	if (this.active == setting) return f.dot;
	this.active = setting;
	this.update_icon();
	return f.dot;
});

// miner.dm:78
rt.def("/obj/machinery/atmospherics/miner/proc/set_broken", function set_broken(f: Frame, setting: Value) {
	if (this.broken == setting) return f.dot;
	this.broken = setting;
	this.update_icon();
	return f.dot;
});

// miner.dm:83
rt.def("/obj/machinery/atmospherics/miner/proc/update_power", function update_power(f: Frame) {
	if (!this.active) {
		this.active_power_usage = this.idle_power_usage;
	}
	let _T: Value = rt.getStep(f, this, 0);
	let G: Value = _T.return_air();
	let _P: Value = G.return_pressure();
	if (this.power_draw === GASMINER_POWER_NONE) {
		this.active_power_usage = 0;
	} else if (this.power_draw === GASMINER_POWER_STATIC) {
		this.active_power_usage = this.power_draw_static;
	} else if (this.power_draw === GASMINER_POWER_MOLES) {
		this.active_power_usage = this.spawn_mol * this.power_draw_dynamic_mol_coeff;
	} else if (this.power_draw === GASMINER_POWER_KPA) {
		this.active_power_usage = _P * this.power_draw_dynamic_kpa_coeff;
	} else if (this.power_draw === GASMINER_POWER_FULLSCALE) {
		this.active_power_usage = this.spawn_mol * this.power_draw_dynamic_mol_coeff + _P * this.power_draw_dynamic_kpa_coeff;
	}
	return f.dot;
});

// miner.dm:101
rt.def("/obj/machinery/atmospherics/miner/proc/do_use_power", function do_use_power(f: Frame, amount: Value) {
	let _T: Value = null, C: Value = null;
	if ((_T = rt.getStep(f, this, 0)) && rt.istype(_T, T("/turf"))) {
		if ((C = _T.get_cable_node()) && C.powernet && C.powernet.avail > amount) {
			C.powernet.load += amount;
			return 1;
		}
	}
	if (this.powered()) {
		this.use_power(amount);
		return 1;
	}
	return 0;
});

// miner.dm:113
rt.def("/obj/machinery/atmospherics/miner/proc/update_icon", function update_icon(f: Frame) {
	let on_overlay: Value = null;
	this.cut_overlays();
	if (this.broken) {
		this.add_overlay("broken");
	} else {
		if (!this.active) return f.dot;
		(on_overlay = mutable_appearance(this.icon, "on")).color = this.overlay_color;
		this.add_overlay(on_overlay);
	}
	return f.dot;
});

// miner.dm:122
rt.def("/obj/machinery/atmospherics/miner/proc/process", function process(f: Frame) {
	this.update_power();
	this.check_operation();
	if (!(this.active && !this.broken)) return f.dot;
	if (this.spawn_id === null) {
		return 0;
	}
	if (!this.do_use_power(this.active_power_usage)) return f.dot;
	this.mine_gas();
	return f.dot;
}, false, { waitfor: false });

// miner.dm:131
rt.def("/obj/machinery/atmospherics/miner/proc/mine_gas", function mine_gas(f: Frame) {
	let O: Value = null, merger: Value = null;
	if (!rt.istype((O = rt.getStep(f, this, 0)), T("/turf/open"))) {
		return 0;
	}
	(merger = new_(T("/datum/gas_mixture"))).assert_gas(this.spawn_id);
	rt.setAt(rt.index(merger.gases, this.spawn_id), 1, this.spawn_mol);
	merger.temperature = this.spawn_temp;
	O.assume_air(merger);
	GLOB.SSair.add_to_active(O);
	return f.dot;
});

// miner.dm:143
rt.def("/obj/machinery/atmospherics/miner/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	if (this.broken) {
		to_chat(user, `${this} seems to be broken. Its debug interface outputs: ${this.broken_message}`);
	}
	yield* parent_proc();
	return f.dot;
}, true);
