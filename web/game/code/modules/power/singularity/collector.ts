// Based on /tg/station's code/modules/power/singularity/collector.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, subtract, fmt } = rt;


// collector.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobalrad_collectors", function InitGlobalrad_collectors(f: Frame) {
	GLOB.rad_collectors = list();
	this.gvars_datum_init_order += "rad_collectors";
	return f.dot;
});

rt.type(10328, "/obj/machinery/power/rad_collector", "/obj/machinery/power", {
	loaded_tank: null,
	last_power: 0,
	active: 0,
	locked: 0,
	drainratio: 1,
	anchored: 0,
	name: "Radiation Collector Array",
	desc: "A device which uses Hawking Radiation and plasma to produce power.",
	icon: rt.rsc("icons/obj/singularity.dmi"),
	icon_state: "ca",
	density: 1,
	req_access: null,
	obj_integrity: 350,
	max_integrity: 350,
	integrity_failure: 80,
});

// collector.dm:11
rt.def("/obj/machinery/power/rad_collector/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(11);
	return f.dot;
});

// collector.dm:23
rt.def("/obj/machinery/power/rad_collector/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	GLOB.rad_collectors += this;
	return f.dot;
}, true);

// collector.dm:27
rt.def("/obj/machinery/power/rad_collector/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.rad_collectors -= this;
	return (yield* parent_proc());
}, true);

// collector.dm:32
rt.def("/obj/machinery/power/rad_collector/proc/process", function process(f: Frame) {
	if (this.loaded_tank) {
		if (!rt.index(this.loaded_tank.air_contents.gases, "plasma")) {
			this.investigate_log("<font color='red'>out of fuel</font>.", "singulo");
			this.eject();
		} else {
			(rt.modAt(rt.index(this.loaded_tank.air_contents.gases, "plasma"), 1, 0.001 * this.drainratio, subtract));
			this.loaded_tank.air_contents.garbage_collect();
		}
	}
	return f.dot;
}, false, { waitfor: false });

// collector.dm:42
rt.def("/obj/machinery/power/rad_collector/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let fuel: Value = null;
	let $0: any, $1: any, $2: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!this.anchored) return f.dot;
	if (!this.locked) {
		yield* this.toggle_power();
		$0 = user;
		$1 = user.name;
		$1 = `${$1} turns the ${this.name} ${this.active ? "on" : "off"}.`;
		$2 = this.name;
		$0.visible_message($1, `<span class='notice'>You turn the ${$2} ${this.active ? "on" : "off"}.</span>`);
		if (this.loaded_tank) {
			fuel = rt.index(this.loaded_tank.air_contents.gases, "plasma");
		}
		if (fuel) {
			$0 = rt.index(fuel, 1);
		} else {
			$0 = 0;
		}
		fuel = $0;
		if (this.active) {
			$0 = "<font color='green'>on</font>";
		} else {
			$0 = "<font color='red'>off</font>";
		}
		$1 = user.key;
		if (this.loaded_tank) {
			$2 = `Fuel: ${round(fuel / 0.29)}%`;
		} else {
			$2 = "<font color='red'>It is empty</font>";
		}
		this.investigate_log(`turned ${$0} by ${$1}. ${$2}.`, "singulo");
		return f.dot;
	} else {
		to_chat(user, "<span class='warning'>The controls are locked!</span>");
		return f.dot;
	}
}, true);

// collector.dm:62
rt.def("/obj/machinery/power/rad_collector/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame, user: Value, silent: Value) {
	if (this.loaded_tank) {
		if (!silent) {
			to_chat(user, "<span class='warning'>Remove the plasma tank first!</span>");
		}
		return FAILED_UNFASTEN;
	}
	return parent_proc();
}, false);

// collector.dm:68
rt.def("/obj/machinery/power/rad_collector/proc/default_unfasten_wrench", function* default_unfasten_wrench(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 20;
	}
	f.dot = (yield* parent_proc());
	if (f.dot != SUCCESSFUL_UNFASTEN) return f.dot;
	if (this.anchored) {
		yield* this.connect_to_network();
	} else {
		yield* this.disconnect_from_network();
	}
	return f.dot;
}, true, { args: ["user", "W", "time"] });

// collector.dm:76
rt.def("/obj/machinery/power/rad_collector/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/device/multitool"))) {
		to_chat(user, `<span class='notice'>The ${W.name} detects that ${this.last_power}W were recently produced.</span>`);
		return 1;
	} else if (rt.istype(W, T("/obj/item/device/analyzer")) && this.loaded_tank) {
		this.atmosanalyzer_scan(this.loaded_tank.air_contents, user);
	} else if (rt.istype(W, T("/obj/item/weapon/tank/internals/plasma"))) {
		if (!this.anchored) {
			to_chat(user, `<span class='warning'>The ${this} needs to be secured to the floor first!</span>`);
			return 1;
		}
		if (this.loaded_tank) {
			to_chat(user, "<span class='warning'>There's already a plasma tank loaded!</span>");
			return 1;
		}
		if (!(yield* user.drop_item())) {
			return 1;
		}
		this.loaded_tank = W;
		yield* W.forceMove(this);
		yield* this.update_icons();
	} else if (rt.istype(W, T("/obj/item/weapon/crowbar"))) {
		if (this.loaded_tank) {
			if (this.locked) {
				to_chat(user, "<span class='warning'>The controls are locked!</span>");
				return 1;
			}
			yield* this.eject();
			return 1;
		} else {
			to_chat(user, "<span class='warning'>There isn't a tank loaded!</span>");
			return 1;
		}
	} else if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		yield* this.default_unfasten_wrench(user, W, 0);
		return 1;
	} else if (W.GetID()) {
		if (yield* this.allowed(user)) {
			if (this.active) {
				this.locked = (!this.locked ? 1 : 0);
				to_chat(user, `<span class='notice'>You ${this.locked ? "lock" : "unlock"} the controls.</span>`);
			} else {
				to_chat(user, fmt("<span class='warning'>The controls can only be locked when ％！ is active!</span>", [this]));
			}
		} else {
			to_chat(user, "<span class='danger'>Access denied.</span>");
			return 1;
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// collector.dm:121
rt.def("/obj/machinery/power/rad_collector/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (!(!rt.bitAnd(this.stat, 1) && !rt.bitAnd(this.flags, NODECONSTRUCT))) return f.dot;
	this.eject();
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	return f.dot;
});

// collector.dm:128
rt.def("/obj/machinery/power/rad_collector/proc/eject", function eject(f: Frame) {
	let Z: Value = null;
	this.locked = 0;
	if (!(Z = this.loaded_tank)) {
		return f.dot;
	}
	Z.loc = rt.getStep(f, this, 0);
	Z.layer = rt.initial(f, Z, "layer");
	Z.plane = rt.initial(f, Z, "plane");
	this.loaded_tank = null;
	if (this.active) {
		this.toggle_power();
	} else {
		this.update_icons();
	}
	return f.dot;
});

// collector.dm:140
rt.def("/obj/machinery/power/rad_collector/proc/receive_pulse", function receive_pulse(f: Frame, pulse_strength: Value) {
	let power_produced: Value = null;
	let $0: any;
	if (this.loaded_tank && this.active) {
		if (rt.index(this.loaded_tank.air_contents.gases, "plasma")) {
			$0 = rt.index(rt.index(this.loaded_tank.air_contents.gases, "plasma"), 1);
		} else {
			$0 = 0;
		}
		power_produced = $0;
		power_produced *= pulse_strength * 10;
		this.add_avail(power_produced);
		this.last_power = power_produced;
		return f.dot;
	}
	return f.dot;
});

// collector.dm:150
rt.def("/obj/machinery/power/rad_collector/proc/update_icons", function update_icons(f: Frame) {
	this.cut_overlays();
	if (this.loaded_tank) {
		this.add_overlay("ptank");
	}
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!this.active) return f.dot;
	this.add_overlay("on");
	return f.dot;
});

// collector.dm:160
rt.def("/obj/machinery/power/rad_collector/proc/toggle_power", function toggle_power(f: Frame) {
	this.active = (!this.active ? 1 : 0);
	if (this.active) {
		this.icon_state = "ca_on";
		flick("ca_active", this);
	} else {
		this.icon_state = "ca";
		flick("ca_deactive", this);
	}
	this.update_icons();
	return f.dot;
});
