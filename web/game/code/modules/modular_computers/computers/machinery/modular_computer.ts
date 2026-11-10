// Based on /tg/station's code/modules/modular_computers/computers/machinery/modular_computer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10956, "/obj/machinery/modular_computer", "/obj/machinery", {
	hardware_flag: 0,
	last_power_usage: 0,
	icon_state_unpowered: null,
	icon_state_powered: null,
	screen_icon_state_menu: "menu",
	screen_icon_screensaver: "standby",
	max_hardware_size: 0,
	steel_sheet_cost: 10,
	light_strength: 0,
	base_active_power_usage: 100,
	base_idle_power_usage: 10,
	cpu: null,
	use_power: 1,
	idle_power_usage: 5,
	name: "modular computer",
	desc: "An advanced computer.",
	icon: null,
	icon_state: null,
});

// modular_computer.dm:31
rt.def("/obj/machinery/modular_computer/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.cpu = (yield* new_(T("/obj/item/device/modular_computer/processor"), this));
	this.cpu.physical = this;
	return f.dot;
}, true);

// modular_computer.dm:36
rt.def("/obj/machinery/modular_computer/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.cpu);
	this.cpu = null;
	return (yield* parent_proc());
}, true);

// modular_computer.dm:41
rt.def("/obj/machinery/modular_computer/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	if (!this.cpu) return f.dot;
	yield* this.cpu.attack_ghost(user);
	return f.dot;
}, true);

// modular_computer.dm:44
rt.def("/obj/machinery/modular_computer/proc/emag_act", function emag_act(f: Frame, user: Value) {
	return this.cpu ? this.cpu.emag_act(user) : 1;
});

// modular_computer.dm:47
rt.def("/obj/machinery/modular_computer/proc/update_icon", function* update_icon(f: Frame) {
	let $0: any;
	this.cut_overlays();
	this.icon_state = this.icon_state_powered;
	if (!this.cpu || !this.cpu.enabled) {
		if (!rt.bitAnd(this.stat, 2) && this.cpu && (yield* this.cpu.use_power())) {
			this.add_overlay(this.screen_icon_screensaver);
		} else {
			this.icon_state = this.icon_state_unpowered;
		}
		this.set_light(0);
	} else {
		this.set_light(this.light_strength);
		if (this.cpu.active_program) {
			if (this.cpu.active_program.program_icon_state) {
				$0 = this.cpu.active_program.program_icon_state;
			} else {
				$0 = this.screen_icon_state_menu;
			}
			this.add_overlay($0);
		} else {
			this.add_overlay(this.screen_icon_state_menu);
		}
	}
	if (!(this.cpu && this.cpu.obj_integrity <= this.cpu.integrity_failure)) return f.dot;
	this.add_overlay("bsod");
	this.add_overlay("broken");
	return f.dot;
}, true);

// modular_computer.dm:73
rt.def("/obj/machinery/modular_computer/proc/eject_id", function* eject_id(f: Frame) {
	if (!this.cpu) return f.dot;
	yield* this.cpu.eject_id();
	return f.dot;
}, true, { verb: { name: "Eject ID", category: "Object" } });

// modular_computer.dm:81
rt.def("/obj/machinery/modular_computer/proc/eject_disk", function* eject_disk(f: Frame) {
	if (!this.cpu) return f.dot;
	yield* this.cpu.eject_disk();
	return f.dot;
}, true, { verb: { name: "Eject Data Disk", category: "Object" } });

// modular_computer.dm:89
rt.def("/obj/machinery/modular_computer/proc/eject_card", function* eject_card(f: Frame) {
	if (!this.cpu) return f.dot;
	yield* this.cpu.eject_card();
	return f.dot;
}, true, { verb: { name: "Eject Intellicard", category: "Object", src: 1, range: 1 } });

// modular_computer.dm:93
rt.def("/obj/machinery/modular_computer/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	if (!this.cpu) return f.dot;
	yield* this.cpu.AltClick(user);
	return f.dot;
}, true);

// modular_computer.dm:98
rt.def("/obj/machinery/modular_computer/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!this.cpu) return f.dot;
	yield* this.cpu.attack_self(user);
	return f.dot;
}, true);

// modular_computer.dm:104
rt.def("/obj/machinery/modular_computer/proc/process", function process(f: Frame) {
	if (!this.cpu) return f.dot;
	this.cpu.name = this.name;
	this.cpu.process();
	return f.dot;
}, false, { waitfor: false });

// modular_computer.dm:109
rt.def("/obj/machinery/modular_computer/proc/power_failure", function* power_failure(f: Frame, malfunction: Value) {
	let $0: any, $1: any;
	malfunction ??= 0;
	let battery_module: Value = rt.index(this.cpu.all_components, "CELL");
	if (this.cpu && this.cpu.enabled) {
		$0 = this;
		if (battery_module) {
			if (malfunction) {
				$1 = "MALFUNCTION";
			} else {
				$1 = "CRITICAL";
			}
			$1 = `"BATTERY ${$1}"`;
		} else {
			$1 = "\"EXTERNAL POWER LOSS\"";
		}
		this.visible_message(fmt("<span class='danger'>＄！'s screen flickers ＀ warning as it shuts down unexpectedly.</span>", [$0, $1]));
		if (this.cpu) {
			yield* this.cpu.shutdown_computer(0);
		}
	}
	(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	yield* this.update_icon();
	return f.dot;
}, true);

// modular_computer.dm:120
rt.def("/obj/machinery/modular_computer/proc/power_change", function* power_change(f: Frame) {
	if (this.cpu && (yield* this.cpu.use_power())) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
		yield* this.update_icon();
		return f.dot;
	}
	yield* parent_proc();
	yield* this.update_icon();
	return f.dot;
}, true);

// modular_computer.dm:128
rt.def("/obj/machinery/modular_computer/proc/attackby", function* attackby(f: Frame, W: Value, user: Value) {
	if (this.cpu && !rt.bitAnd(this.flags, NODECONSTRUCT)) {
		return (yield* this.cpu.attackby(W, user));
	}
	return (yield* parent_proc());
}, true);

// modular_computer.dm:137
rt.def("/obj/machinery/modular_computer/proc/ex_act", function ex_act(f: Frame, severity: Value) {
	if (this.cpu) {
		this.cpu.ex_act(severity);
	}
	parent_proc();
	return f.dot;
}, false, { waitfor: false });

// modular_computer.dm:143
rt.def("/obj/machinery/modular_computer/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (!this.cpu) return f.dot;
	yield* this.cpu.emp_act(severity);
	return f.dot;
}, true);

// modular_computer.dm:150
rt.def("/obj/machinery/modular_computer/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	if (!this.cpu) return f.dot;
	yield* this.cpu.bullet_act(Proj);
	return f.dot;
}, true);
