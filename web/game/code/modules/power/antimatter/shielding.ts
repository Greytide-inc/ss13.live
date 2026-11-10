// Based on /tg/station's code/modules/power/antimatter/shielding.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// shielding.dm:3
rt.def("/proc/cardinalrange", function cardinalrange(f: Frame, center: Value) {
	let direction: Value = null, _T: Value = null;
	let things: Value = list();
	for (direction of each(GLOB.cardinal)) {
		if (!(_T = rt.getStep(f, center, direction))) {
			continue;
		}
		things += _T.contents;
	}
	return things;
});

rt.type(10975, "/obj/machinery/am_shielding", "/obj/machinery", {
	control_unit: null,
	processing: 0,
	stability: 100,
	efficiency: 1,
	coredirs: 0,
	dirs: 0,
	anchored: 1,
	use_power: 0,
	idle_power_usage: 0,
	active_power_usage: 0,
	name: "antimatter reactor section",
	desc: "This device was built using a plasma life-form that seems to increase plasma's natural ability to react with neutrinos while reducing the combustibility.",
	icon: rt.rsc("icons/obj/machines/antimatter.dmi"),
	icon_state: "shield",
	density: 1,
	dir: 1,
});

// shielding.dm:32
rt.def("/obj/machinery/am_shielding/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/am_shielding/proc/controllerscan"))), 10);
	return f.dot;
}, true);

// shielding.dm:38
rt.def("/obj/machinery/am_shielding/proc/controllerscan", function* controllerscan(f: Frame, priorscan: Value) {
	let AMS: Value = null, direction: Value = null, AMC: Value = null;
	priorscan ??= 0;
	if (!rt.istype(this.loc, T("/turf"))) {
		yield* qdel(this);
		return f.dot;
	}
	for (AMS of each(this.loc.contents, T("/obj/machinery/am_shielding"))) {
		if (AMS == this) {
			continue;
		}
		yield* qdel(this);
		return f.dot;
	}
	AMS = null;
	for (AMS of each(cardinalrange(this), T("/obj/machinery/am_shielding"))) {
		if (AMS && AMS.control_unit && this.link_control(AMS.control_unit)) {
			break;
		}
	}
	if (!this.control_unit) {
		for (direction of each(GLOB.cardinal)) {
		}
		for (AMC of each(cardinalrange(this), T("/obj/machinery/power/am_control_unit"))) {
			if (AMC.add_shielding(this)) {
				break;
			}
		}
	}
	if (this.control_unit) return f.dot;
	if (!priorscan) {
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/am_shielding/proc/controllerscan"), 1)), 20);
		return f.dot;
	}
	yield* qdel(this);
	return f.dot;
}, true);

// shielding.dm:67
rt.def("/obj/machinery/am_shielding/proc/Destroy", function* Destroy(f: Frame) {
	if (this.control_unit) {
		this.control_unit.remove_shielding(this);
	}
	if (this.processing) {
		this.shutdown_core();
	}
	this.visible_message(`<span class='danger'>The ${this.name} melts!</span>`);
	return (yield* parent_proc());
}, true);

// shielding.dm:76
rt.def("/obj/machinery/am_shielding/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	height ??= 0;
	if (height == 0) {
		return 1;
	}
	return 0;
});

// shielding.dm:82
rt.def("/obj/machinery/am_shielding/proc/process", function process(f: Frame) {
	if (!this.processing) {
		f.dot = PROCESS_KILL;
	}
	return f.dot;
}, false, { waitfor: false });

// shielding.dm:93
rt.def("/obj/machinery/am_shielding/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	this.stability -= 80 - severity * 20;
	yield* this.check_stability();
	return f.dot;
}, true, { waitfor: false });

// shielding.dm:99
rt.def("/obj/machinery/am_shielding/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	f.dot = (yield* parent_proc());
	if (Proj.flag == "bullet") return f.dot;
	this.stability -= Proj.force / 2;
	yield* this.check_stability();
	return f.dot;
}, true);

// shielding.dm:108
rt.def("/obj/machinery/am_shielding/proc/update_icon", function update_icon(f: Frame) {
	let direction: Value = null, _T: Value = null, machine: Value = null, shield: Value = null, control: Value = null;
	this.dirs = 0;
	this.coredirs = 0;
	this.cut_overlays();
	for (direction of each(GLOB.alldirs)) {
		_T = rt.getStep(f, this.loc, direction);
		machine = null;
		for (machine of each(_T, T("/obj/machinery"))) {
			if (rt.istype(machine, T("/obj/machinery/am_shielding"))) {
				if ((shield = machine).control_unit == this.control_unit) {
					if (shield.processing) {
						(rt.modSrcVar(f, "coredirs", direction, rt.bitOr));
					}
					if (rt.isIn(f, direction, GLOB.cardinal)) {
						(rt.modSrcVar(f, "dirs", direction, rt.bitOr));
					}
				}
			} else if (rt.istype(machine, T("/obj/machinery/power/am_control_unit")) && rt.isIn(f, direction, GLOB.cardinal)) {
				if ((control = machine) == this.control_unit) {
					(rt.modSrcVar(f, "dirs", direction, rt.bitOr));
				}
			}
		}
	}
	let prefix: Value = "";
	let icondirs: Value = this.dirs;
	if (this.coredirs) {
		prefix = "core";
	}
	this.icon_state = `${prefix}shield_${icondirs}`;
	if (this.core_check()) {
		this.add_overlay(`core${(this.control_unit && this.control_unit.active)}`);
		if (!this.processing) {
			this.setup_core();
		}
	} else {
		if (!this.processing) return f.dot;
		this.shutdown_core();
	}
	return f.dot;
});

// shielding.dm:144
rt.def("/obj/machinery/am_shielding/proc/take_damage", function* take_damage(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value, sound_effect: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	sound_effect ??= 1;
	if (damage_type === "brute") {
		if (sound_effect) {
			if (damage_amount) {
				playsound(this.loc, rt.rsc("sound/weapons/smash.ogg"), 50, 1);
			} else {
				playsound(this.loc, rt.rsc("sound/weapons/tap.ogg"), 50, 1);
			}
		}
	} else if (damage_type === "fire") {
		if (sound_effect) {
			playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
		}
	} else {
		return f.dot;
	}
	if (!(damage_amount >= 10)) return f.dot;
	this.stability -= damage_amount / 2;
	yield* this.check_stability();
	return f.dot;
}, true);

// shielding.dm:163
rt.def("/obj/machinery/am_shielding/proc/link_control", function link_control(f: Frame, AMC: Value) {
	if (!rt.istype(AMC, T("/obj/machinery/power/am_control_unit"))) {
		return 0;
	}
	if (this.control_unit && this.control_unit != AMC) {
		return 0;
	}
	this.control_unit = AMC;
	this.control_unit.add_shielding(this, 1);
	return 1;
});

// shielding.dm:174
rt.def("/obj/machinery/am_shielding/proc/core_check", function core_check(f: Frame) {
	let direction: Value = null, found_am_device: Value = null, machine: Value = null;
	for (direction of each(GLOB.alldirs)) {
		found_am_device = 0;
		machine = null;
		for (machine of each(rt.getStep(f, this.loc, direction), T("/obj/machinery"))) {
			if (!machine) {
				continue;
			}
			if (rt.istype(machine, T("/obj/machinery/am_shielding")) || rt.istype(machine, T("/obj/machinery/power/am_control_unit"))) {
				found_am_device = 1;
				break;
			}
		}
		if (!found_am_device) {
			return 0;
		}
	}
	return 1;
});

// shielding.dm:190
rt.def("/obj/machinery/am_shielding/proc/setup_core", function setup_core(f: Frame) {
	this.processing = 1;
	(rt.modGl("machines", this, rt.bitOr));
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSmachines.processing += this;
	}
	if (!this.control_unit) {
		return f.dot;
	}
	this.control_unit.linked_cores.Add(this);
	this.control_unit.reported_core_efficiency += this.efficiency;
	return f.dot;
});

// shielding.dm:201
rt.def("/obj/machinery/am_shielding/proc/shutdown_core", function shutdown_core(f: Frame) {
	this.processing = 0;
	if (!this.control_unit) {
		return f.dot;
	}
	this.control_unit.linked_cores.Remove(this);
	this.control_unit.reported_core_efficiency -= this.efficiency;
	return f.dot;
});

// shielding.dm:209
rt.def("/obj/machinery/am_shielding/proc/check_stability", function* check_stability(f: Frame, injecting_fuel: Value) {
	injecting_fuel ??= 0;
	if (this.stability > 0) {
		return f.dot;
	}
	if (injecting_fuel && this.control_unit) {
		this.control_unit.exploding = 1;
	}
	if (this) {
		yield* qdel(this);
	}
	return f.dot;
}, true);

rt.type(9428, "/obj/item/device/am_shielding_container", "/obj/item/device", {
	flags: 64,
	throw_speed: 1,
	throw_range: 2,
	name: "packaged antimatter reactor section",
	desc: "A small storage unit containing an antimatter reactor section.  To use place near an antimatter control unit or deployed antimatter reactor section and use a multitool to activate this package.",
	icon: rt.rsc("icons/obj/machines/antimatter.dmi"),
	icon_state: "box",
	item_state: "electronic",
	w_class: 4,
	throwforce: 5,
	materials: null,
});

// shielding.dm:240
rt.def("/obj/item/device/am_shielding_container/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 100]);
	return f.dot;
});

// shielding.dm:243
rt.def("/obj/item/device/am_shielding_container/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/device/multitool")) && rt.istype(this.loc, T("/turf"))) {
		yield* new_(T("/obj/machinery/am_shielding"), this.loc);
		yield* qdel(this);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
