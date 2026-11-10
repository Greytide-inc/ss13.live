// Based on /tg/station's code/game/machinery/doors/brigdoors.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(10859, "/obj/machinery/door_timer", "/obj/machinery", {
	id: null,
	activation_time: 0,
	timer_duration: 0,
	timing: 0,
	targets: null,
	Radio: null,
	anchored: 1,
	name: "door timer",
	icon: rt.rsc("icons/obj/status_display.dmi"),
	icon_state: "frame",
	desc: "A remote control for a door.",
	req_access: null,
	density: 0,
	maptext_height: 26,
	maptext_width: 32,
});

// brigdoors.dm:35
rt.def("/obj/machinery/door_timer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.targets = list();

	this.req_access = list(1);
	return f.dot;
});

// brigdoors.dm:42
rt.def("/obj/machinery/door_timer/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.Radio = (yield* new_(T("/obj/item/device/radio"), this));
	this.Radio.listening = 0;
	return f.dot;
}, true);

// brigdoors.dm:48
rt.def("/obj/machinery/door_timer/proc/Initialize", function* Initialize(f: Frame) {
	let M: Value = null, F: Value = null, C: Value = null;
	yield* parent_proc();
	if (this.id !== null) {
		for (M of each(urange(20, this), T("/obj/machinery/door/window/brigdoor"))) {
			if (M.id == this.id) {
				this.targets += M;
			}
		}
		for (F of each(urange(20, this), T("/obj/machinery/flasher"))) {
			if (F.id == this.id) {
				this.targets += F;
			}
		}
		for (C of each(urange(20, this), T("/obj/structure/closet/secure_closet/brig"))) {
			if (C.id == this.id) {
				this.targets += C;
			}
		}
	}
	if (!rt.len(f, this.targets)) {
		(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// brigdoors.dm:71
rt.def("/obj/machinery/door_timer/proc/process", function* process(f: Frame) {
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!this.timing) return f.dot;
	if (rt.worldTime(f) - this.activation_time >= this.timer_duration) {
		yield* this.timer_end();
	}
	yield* this.update_icon();
	return f.dot;
}, true, { waitfor: false });

// brigdoors.dm:81
rt.def("/obj/machinery/door_timer/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// brigdoors.dm:88
rt.def("/obj/machinery/door_timer/proc/timer_start", function* timer_start(f: Frame) {
	let door: Value = null, C: Value = null;
	if (rt.bitAnd(this.stat, 3)) {
		return 0;
	}
	this.activation_time = rt.worldTime(f);
	this.timing = 1;
	for (door of each(this.targets, T("/obj/machinery/door/window/brigdoor"))) {
		if (door.density) {
			continue;
		}
		yield* ImmediateInvokeAsync(door, P("/obj/machinery/door/window/proc/close"));
	}
	for (C of each(this.targets, T("/obj/structure/closet/secure_closet/brig"))) {
		if (C.broken) {
			continue;
		}
		if (C.opened && !(yield* C.close())) {
			continue;
		}
		C.locked = 1;
		yield* C.update_icon();
	}
	return 1;
}, true);

// brigdoors.dm:111
rt.def("/obj/machinery/door_timer/proc/timer_end", function* timer_end(f: Frame, forced: Value) {
	let door: Value = null, C: Value = null;
	forced ??= 0;
	if (rt.bitAnd(this.stat, 3)) {
		return 0;
	}
	if (!forced) {
		yield* this.Radio.set_frequency(1359);
		yield* this.Radio.talk_into(this, "Timer has expired. Releasing prisoner.", 1359, (yield* this.get_default_language()));
	}
	this.timing = 0;
	this.activation_time = null;
	this.set_timer(0);
	yield* this.update_icon();
	for (door of each(this.targets, T("/obj/machinery/door/window/brigdoor"))) {
		if (!door.density) {
			continue;
		}
		yield* ImmediateInvokeAsync(door, P("/obj/machinery/door/window/proc/open"));
	}
	for (C of each(this.targets, T("/obj/structure/closet/secure_closet/brig"))) {
		if (C.broken) {
			continue;
		}
		if (C.opened) {
			continue;
		}
		C.locked = 0;
		yield* C.update_icon();
	}
	return 1;
}, true);

// brigdoors.dm:140
rt.def("/obj/machinery/door_timer/proc/time_left", function time_left(f: Frame, seconds: Value) {
	seconds ??= 0;
	let $0: any = 0;
	let $1: any = this.timer_duration;
	f.dot = max($0, $1 - (this.activation_time ? rt.worldTime(f) - this.activation_time : 0));
	if (!seconds) return f.dot;
	f.dot /= 10;
	return f.dot;
});

// brigdoors.dm:145
rt.def("/obj/machinery/door_timer/proc/set_timer", function set_timer(f: Frame, value: Value) {
	let new_time: Value = null;
	f.dot = ((new_time = max(0, min(value, 9000))) == this.timer_duration ? 1 : 0);
	this.timer_duration = new_time;
	return f.dot;
});

// brigdoors.dm:151
rt.def("/obj/machinery/door_timer/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "brig_timer", this.name, 300, 200, master_ui, state))).open();
	return f.dot;
}, true);

// brigdoors.dm:161
rt.def("/obj/machinery/door_timer/proc/update_icon", function update_icon(f: Frame) {
	let disp1: Value = null, time_left: Value = null, disp2: Value = null;
	if (rt.bitAnd(this.stat, 2)) {
		this.icon_state = "frame";
		return f.dot;
	}
	if (rt.bitAnd(this.stat, 1)) {
		this.set_picture("ai_bsod");
		return f.dot;
	}
	if (this.timing) {
		disp1 = this.id;
		time_left = this.time_left({ seconds: 1 });
		if (rt.length((disp2 = `${add_zero(num2text(time_left / 60 % 60), 2)}~${add_zero(num2text(time_left % 60), 2)}`)) > 5) {
			disp2 = "Error";
		}
		this.update_display(disp1, disp2);
	} else if (this.maptext) {
		this.maptext = "";
	}
	return f.dot;
});

// brigdoors.dm:185
rt.def("/obj/machinery/door_timer/proc/set_picture", function set_picture(f: Frame, state: Value) {
	if (this.maptext) {
		this.maptext = "";
	}
	this.cut_overlays();
	this.add_overlay(mutable_appearance(rt.rsc("icons/obj/status_display.dmi"), state));
	return f.dot;
});

// brigdoors.dm:193
rt.def("/obj/machinery/door_timer/proc/update_display", function update_display(f: Frame, line1: Value, line2: Value) {
	let new_text: Value = `<div style="font-size:${"5pt"};color:${"#09f"};font:'${"Arial Black"}';text-align:center;" valign="top">${line1}<br>${line2}</div>`;
	if (this.maptext == new_text) return f.dot;
	this.maptext = new_text;
	return f.dot;
});

// brigdoors.dm:198
rt.def("/obj/machinery/door_timer/proc/ui_data", function ui_data(f: Frame) {
	let F: Value = null;
	let data: Value = list();
	let time_left: Value = this.time_left({ seconds: 1 });
	rt.setAt(data, "seconds", round(time_left % 60));
	rt.setAt(data, "minutes", round((time_left - rt.at(data, "seconds")) / 60));
	rt.setAt(data, "timing", this.timing);
	rt.setAt(data, "flash_charging", 0);
	for (F of each(this.targets, T("/obj/machinery/flasher"))) {
		if (F.last_flash && F.last_flash + 150 > rt.worldTime(f)) {
			rt.setAt(data, "flash_charging", 1);
			break;
		}
	}
	return data;
});

// brigdoors.dm:212
rt.def("/obj/machinery/door_timer/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let value: Value = null, F: Value = null, preset: Value = null, preset_time: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	f.dot = 1;
	if (!(yield* this.allowed(f.usr))) {
		to_chat(f.usr, "<span class='warning'>Access denied.</span>");
		return 0;
	}
	if (action === "time") {
		if (value = text2num(rt.at(params, "adjust"))) {
			f.dot = this.set_timer(this.time_left() + value);
		}
	} else if (action === "start") {
		yield* this.timer_start();
	} else if (action === "stop") {
		yield* this.timer_end({ forced: 1 });
	} else if (action === "flash") {
		for (F of each(this.targets, T("/obj/machinery/flasher"))) {
			yield* F.flash();
		}
	} else if (action === "preset") {
		preset = rt.at(params, "preset");
		preset_time = this.time_left();
		if (preset === "short") {
			preset_time = 1200;
		} else if (preset === "medium") {
			preset_time = 1800;
		} else if (preset === "long") {
			preset_time = 3000;
		}
		f.dot = this.set_timer(preset_time);
		if (!this.timing) return f.dot;
		this.activation_time = rt.worldTime(f);
	} else {
		f.dot = 0;
	}
	return f.dot;
}, true);
