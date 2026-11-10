// Based on /tg/station's code/game/mecha/mech_bay.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4551, "/turf/open/floor/mech_bay_recharge_floor", "/turf/open/floor", {
	name: "mech bay recharge station",
	icon: rt.rsc("icons/turf/floors.dmi"),
	icon_state: "recharge_floor",
});

// mech_bay.dm:7
rt.def("/turf/open/floor/mech_bay_recharge_floor/proc/break_tile", function* break_tile(f: Frame) {
	yield* this.ChangeTurf(T("/turf/open/floor/plating"));
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

// mech_bay.dm:28
rt.def("/obj/machinery/mech_bay_recharge_port/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/mech_recharger"), null))).apply_default_parts(this);
	this.recharging_turf = rt.getStep(f, this.loc, this.dir);
	return f.dot;
}, true);

rt.type(6742, "/obj/item/weapon/circuitboard/machine/mech_recharger", "/obj/item/weapon/circuitboard/machine", {
	name: "Mechbay Recharger (Machine Board)",
	build_path: rt.typePath("/obj/machinery/mech_bay_recharge_port"),
	origin_tech: "programming=3;powerstorage=3;engineering=3",
	req_components: null,
});

// mech_bay.dm:37
rt.def("/obj/item/weapon/circuitboard/machine/mech_recharger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/capacitor"), 5]);
	return f.dot;
});

// mech_bay.dm:43
rt.def("/obj/machinery/mech_bay_recharge_port/proc/RefreshParts", function RefreshParts(f: Frame) {
	let MC: Value = null, C: Value = null;
	for (C of each(this.component_parts, T("/obj/item/weapon/stock_parts/capacitor"))) {
		MC += C.rating;
	}
	this.max_charge = MC * 25;
	return f.dot;
});

// mech_bay.dm:48
rt.def("/obj/machinery/mech_bay_recharge_port/proc/process", function* process(f: Frame) {
	let delta: Value = null;
	if (rt.bitAnd(this.stat, 2) || !this.recharge_console) {
		return f.dot;
	}
	if (!this.recharging_mech) {
		this.recharging_mech = rt.locateIn(f, T("/obj/mecha"), this.recharging_turf);
		if (this.recharging_mech) {
			yield* this.recharge_console.update_icon();
		}
	}
	if (!(this.recharging_mech && this.recharging_mech.cell)) return f.dot;
	if (this.recharging_mech.cell.charge < this.recharging_mech.cell.maxcharge) {
		delta = min(this.max_charge, this.recharging_mech.cell.maxcharge - this.recharging_mech.cell.charge);
		yield* this.recharging_mech.give_power(delta);
		yield* this.use_power(delta * 150);
	} else {
		yield* this.recharge_console.update_icon();
	}
	if (this.recharging_mech.loc == this.recharging_turf) return f.dot;
	this.recharging_mech = null;
	yield* this.recharge_console.update_icon();
	return f.dot;
}, true, { waitfor: false });

// mech_bay.dm:67
rt.def("/obj/machinery/mech_bay_recharge_port/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (this.default_deconstruction_screwdriver(user, "recharge_port-o", "recharge_port", I)) {
		return f.dot;
	}
	if (yield* this.default_change_direction_wrench(user, I)) {
		this.recharging_turf = rt.getStep(f, this.loc, this.dir);
		return f.dot;
	}
	if (yield* this.exchange_parts(user, I)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(I)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

rt.type(10417, "/obj/machinery/computer/mech_bay_power_console", "/obj/machinery/computer", {
	recharge_port: null,
	icon_screen: "recharge_comp",
	icon_keyboard: "rd_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/mech_bay_power_console"),
	light_color: "#E17DE1",
	name: "mech bay power control console",
	desc: "Used to control mechbay power ports.",
});

// mech_bay.dm:91
rt.def("/obj/machinery/computer/mech_bay_power_console/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	return (yield* this.interact(user));
}, true);

// mech_bay.dm:94
rt.def("/obj/machinery/computer/mech_bay_power_console/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// mech_bay.dm:99
rt.def("/obj/machinery/computer/mech_bay_power_console/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "mech_bay_power_console", "Mech Bay Power Control Console", 400, 170, master_ui, state))).open();
	return f.dot;
}, true);

// mech_bay.dm:105
rt.def("/obj/machinery/computer/mech_bay_power_console/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "reconnect") {
		yield* this.reconnect();
		f.dot = 1;
		yield* this.update_icon();
	}
	return f.dot;
}, true);

// mech_bay.dm:114
rt.def("/obj/machinery/computer/mech_bay_power_console/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = list();
	if (this.recharge_port && !(!this.recharge_port || this.recharge_port.gc_destroyed)) {
		rt.setAt(data, "recharge_port", rt.alist(f, ["mech", null]));
		if (this.recharge_port.recharging_mech && !(!this.recharge_port.recharging_mech || this.recharge_port.recharging_mech.gc_destroyed)) {
			rt.setAt(rt.at(data, "recharge_port"), "mech", rt.alist(f, ["health", this.recharge_port.recharging_mech.obj_integrity, "max_integrity", this.recharge_port.recharging_mech.max_integrity, "cell", null]));
			if (this.recharge_port.recharging_mech.cell && !(!this.recharge_port.recharging_mech.cell || this.recharge_port.recharging_mech.cell.gc_destroyed)) {
				rt.setAt(rt.index(rt.at(data, "recharge_port"), "mech"), "cell", rt.alist(f, ["critfail", this.recharge_port.recharging_mech.cell.crit_fail, "charge", this.recharge_port.recharging_mech.cell.charge, "maxcharge", this.recharge_port.recharging_mech.cell.maxcharge]));
			}
		}
	}
	return data;
});

// mech_bay.dm:131
rt.def("/obj/machinery/computer/mech_bay_power_console/proc/reconnect", function reconnect(f: Frame) {
	let D: Value = null, A: Value = null;
	if (this.recharge_port) {
		return f.dot;
	}
	this.recharge_port = rt.locateIn(f, T("/obj/machinery/mech_bay_recharge_port"), range(1));
	if (!this.recharge_port) {
		for (D of each(GLOB.cardinal)) {
			A = rt.getStep(f, (A = rt.getStep(f, this, D)), D);
			this.recharge_port = rt.locateIn(f, T("/obj/machinery/mech_bay_recharge_port"), A);
			if (this.recharge_port) {
				break;
			}
		}
	}
	if (!this.recharge_port) return f.dot;
	if (!this.recharge_port.recharge_console) {
		this.recharge_port.recharge_console = this;
	} else {
		this.recharge_port = null;
	}
	return f.dot;
});

// mech_bay.dm:146
rt.def("/obj/machinery/computer/mech_bay_power_console/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (!this.recharge_port || !this.recharge_port.recharging_mech || !this.recharge_port.recharging_mech.cell || !(this.recharge_port.recharging_mech.cell.charge < this.recharge_port.recharging_mech.cell.maxcharge) || rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	this.add_overlay("recharge_comp_on");
	return f.dot;
});

// mech_bay.dm:152
rt.def("/obj/machinery/computer/mech_bay_power_console/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.reconnect();
	return f.dot;
}, true);
