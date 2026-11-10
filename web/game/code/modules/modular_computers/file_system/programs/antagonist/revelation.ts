// Based on /tg/station's code/modules/modular_computers/file_system/programs/antagonist/revelation.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(4172, "/datum/computer_file/program/revelation", "/datum/computer_file/program", {
	armed: 0,
	filename: "revelation",
	filedesc: "Revelation",
	program_icon_state: "hostile",
	extended_desc: "This virus can destroy hard drive of system it is executed on. It may be obfuscated to look like another non-malicious program. Once armed, it will destroy the system upon next execution.",
	size: 13,
	requires_ntnet: 0,
	available_on_ntnet: 0,
	available_on_syndinet: 1,
	tgui_id: "ntos_revelation",
	ui_style: "syndicate",
	ui_x: 400,
	ui_y: 250,
});

// revelation.dm:18
rt.def("/datum/computer_file/program/revelation/proc/run_program", function* run_program(f: Frame, user: Value) {
	f.dot = (yield* parent_proc(user));
	if (!this.armed) return f.dot;
	yield* this.activate();
	return f.dot;
}, true);

// revelation.dm:24
rt.def("/datum/computer_file/program/revelation/proc/activate", function* activate(f: Frame) {
	let spark_system: Value = null;
	if (!this.computer) return f.dot;
	this.computer.visible_message(fmt("<span class='notice'>＄！'s screen brightly flashes and loud electrical buzzing is heard.</span>", [this.computer]));
	this.computer.enabled = 0;
	yield* this.computer.update_icon();
	let hard_drive: Value = rt.index(this.computer.all_components, "HDD");
	let battery_module: Value = rt.index(this.computer.all_components, "CELL");
	let recharger: Value = rt.index(this.computer.all_components, "CHARGE");
	yield* qdel(hard_drive);
	yield* this.computer.take_damage(25, "brute", 0, 0);
	if (battery_module && prob(25)) {
		yield* qdel(battery_module);
		this.computer.visible_message(fmt("<span class='notice'>＄！'s battery explodes in rain of sparks.</span>", [this.computer]));
		yield* (spark_system = (yield* new_(T("/datum/effect_system/spark_spread")))).start();
	}
	if (!(recharger && prob(50))) return f.dot;
	yield* qdel(recharger);
	this.computer.visible_message(fmt("<span class='notice'>＄！'s recharger explodes in rain of sparks.</span>", [this.computer]));
	yield* (spark_system = (yield* new_(T("/datum/effect_system/spark_spread")))).start();
	return f.dot;
}, true);

// revelation.dm:46
rt.def("/datum/computer_file/program/revelation/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let user: Value = null, newname: Value = null;
	if (yield* parent_proc()) {
		return 1;
	}
	if (action === "PRG_arm") {
		this.armed = (!this.armed ? 1 : 0);
	} else if (action === "PRG_activate") {
		yield* this.activate();
	} else if (action === "PRG_obfuscate") {
		user = f.usr;
		if (!(newname = sanitize((yield* g.op(f, "Prompt", [2], [null, null, "Enter new program name: ", user, null]))))) {
			return f.dot;
		}
		this.filedesc = newname;
	}
	return f.dot;
}, true);

// revelation.dm:62
rt.def("/datum/computer_file/program/revelation/proc/clone", function* clone(f: Frame) {
	let temp: Value = null;
	(temp = (yield* parent_proc())).armed = this.armed;
	return temp;
}, true);

// revelation.dm:67
rt.def("/datum/computer_file/program/revelation/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	rt.setAt((data = this.get_header_data()), "armed", this.armed);
	return data;
});
