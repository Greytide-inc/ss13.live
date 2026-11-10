// Based on /tg/station's code/modules/station_goals/shield.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, fmt } = rt;


rt.type(4204, "/datum/station_goal/station_shield", "/datum/station_goal", {
	coverage_goal: 500,
	name: "Station Shield",
});

// shield.dm:9
rt.def("/datum/station_goal/station_shield/proc/get_report", function get_report(f: Frame) {
	return "The station is located in a zone full of space debris.\n\t\t\t We have a prototype shielding system you must deploy to reduce collision-related accidents.\n\n\t\t\t You can order the satellites and control systems at cargo.\n\t\t\t ";
});

// shield.dm:18
rt.def("/datum/station_goal/station_shield/proc/on_report", function on_report(f: Frame) {
	let _P: Value = null;
	(_P = rt.index(GLOB.SSshuttle.supply_packs, T("/datum/supply_pack/misc/shield_sat"))).special_enabled = 1;
	(_P = rt.index(GLOB.SSshuttle.supply_packs, T("/datum/supply_pack/misc/shield_sat_control"))).special_enabled = 1;
	return f.dot;
});

// shield.dm:25
rt.def("/datum/station_goal/station_shield/proc/check_completion", function check_completion(f: Frame) {
	if (parent_proc()) {
		return 1;
	}
	if (this.get_coverage() >= this.coverage_goal) {
		return 1;
	}
	return 0;
});

// shield.dm:32
rt.def("/datum/station_goal/proc/get_coverage", function get_coverage(f: Frame) {
	let A: Value = null;
	let coverage: Value = list();
	for (A of each(GLOB.machines, T("/obj/machinery/satellite/meteor_shield"))) {
		if (!A.active || A.z != ZLEVEL_STATION) {
			continue;
		}
		(coverage = rt.modify(coverage, view(A.kill_range, A), rt.bitOr));
	}
	return rt.len(f, coverage);
});

rt.type(10435, "/obj/machinery/computer/sat_control", "/obj/machinery/computer", {
	notice: null,
	circuit: rt.typePath("/obj/item/weapon/circuitboard/machine/computer/sat_control"),
	name: "Satellite control",
	desc: "Used to control the satellite network.",
});

// shield.dm:51
rt.def("/obj/machinery/computer/sat_control/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "sat_control", this.name, 400, 305, master_ui, state))).open();
	return f.dot;
}, true);

// shield.dm:57
rt.def("/obj/machinery/computer/sat_control/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "toggle") {
		yield* this.toggle(text2num(rt.at(params, "id")));
		f.dot = 1;
	}
	return f.dot;
}, true);

// shield.dm:65
rt.def("/obj/machinery/computer/sat_control/proc/toggle", function toggle(f: Frame, id: Value) {
	let S: Value = null;
	for (S of each(GLOB.machines, T("/obj/machinery/satellite"))) {
		if (S.id == id && S.z == this.z) {
			S.toggle();
		}
	}
	return f.dot;
});

// shield.dm:70
rt.def("/obj/machinery/computer/sat_control/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, S: Value = null, G: Value = null;
	rt.setAt((data = list()), "satellites", list());
	for (S of each(GLOB.machines, T("/obj/machinery/satellite"))) {
		rt.modAt(data, "satellites", list(rt.alist(f, ["id", S.id, "active", S.active, "mode", S.mode])), add);
	}
	rt.setAt(data, "notice", this.notice);
	if (G = rt.locateIn(f, T("/datum/station_goal/station_shield"), GLOB.SSticker.mode.station_goals)) {
		rt.setAt(data, "meteor_shield", 1);
		rt.setAt(data, "meteor_shield_coverage", G.get_coverage());
		rt.setAt(data, "meteor_shield_coverage_max", G.coverage_goal);
	}
	return data;
});

rt.type(10996, "/obj/machinery/satellite", "/obj/machinery", {
	mode: "NTPROBEV0.8",
	active: 0,
	id: 0,
	use_power: 0,
	name: "Defunct Satellite",
	desc: "",
	icon: rt.rsc("icons/obj/machines/satellite.dmi"),
	icon_state: "sat_inactive",
	density: 1,
}, { global: { gid: 771 } });

// shield.dm:103
rt.def("/obj/machinery/satellite/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.id = rt.incGl("gid", 1, true);
	return f.dot;
}, true);

// shield.dm:107
rt.def("/obj/machinery/satellite/proc/interact", function interact(f: Frame, user: Value) {
	this.toggle(user);
	return f.dot;
});

// shield.dm:110
rt.def("/obj/machinery/satellite/proc/toggle", function toggle(f: Frame, user: Value) {
	if (!this.active && !this.isinspace()) {
		if (user) {
			to_chat(user, `<span class='warning'>You can only active the ${this} in space.</span>`);
		}
		return 0;
	}
	if (user) {
		to_chat(user, `<span class='notice'>You ${this.active ? "deactivate" : "activate"} the ${this}</span>`);
	}
	this.active = (!this.active ? 1 : 0);
	if (this.active) {
		rt.op(f, "Animate", [2, 8], [null, this, "pixel_y", 2, "time", 10, "loop", -1]);
		this.anchored = 1;
	} else {
		rt.op(f, "Animate", [2, 6], [null, this, "pixel_y", 0, "time", 10]);
		this.anchored = 0;
	}
	this.update_icon();
	return f.dot;
});

// shield.dm:126
rt.def("/obj/machinery/satellite/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = this.active ? "sat_active" : "sat_inactive";
	return f.dot;
});

// shield.dm:129
rt.def("/obj/machinery/satellite/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let $0: any, $1: any, $2: any, $3: any;
	if (rt.istype(I, T("/obj/item/device/multitool"))) {
		$0 = user;
		$1 = this.id;
		if (this.active) {

			$2 = "PRIMARY";
		} else {
			$2 = "STANDBY";
		}
		if (this.emagged) {
			$3 = "DEBUG_MODE //";
		} else {
			$3 = "";
		}
		to_chat($0, fmt("<span class='notice'>// NTSAT-＀ // Mode : ＀ //＀</span>", [$1, $2, $3]));
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(10997, "/obj/machinery/satellite/meteor_shield", "/obj/machinery/satellite", {
	kill_range: 14,
	mode: "M-SHIELD",
	speed_process: 1,
	name: "Meteor Shield Satellite",
	desc: "Meteor Point Defense Satellite",
});

// shield.dm:142
rt.def("/obj/machinery/satellite/meteor_shield/proc/space_los", function space_los(f: Frame, meteor: Value) {
	let _T: Value = null;
	for (_T of each(getline(this, meteor), T("/turf"))) {
		if (!rt.istype(_T, T("/turf/open/space"))) {
			return 0;
		}
	}
	return 1;
});

// shield.dm:148
rt.def("/obj/machinery/satellite/meteor_shield/proc/process", function* process(f: Frame) {
	let M: Value = null;
	if (!this.active) {
		return f.dot;
	}
	for (M of each(GLOB.meteor_list, T("/obj/effect/meteor"))) {
		if (M.z != this.z) {
			continue;
		}
		if (get_dist(M, this) > this.kill_range) {
			continue;
		}
		if (!this.emagged && this.space_los(M)) {
			yield* this.Beam(rt.getStep(f, M, 0), { icon_state: "sat_beam", time: 5, maxdistance: this.kill_range });
			yield* qdel(M);
		}
	}
	return f.dot;
}, true, { waitfor: false });

// shield.dm:160
rt.def("/obj/machinery/satellite/meteor_shield/proc/toggle", function toggle(f: Frame, user: Value) {
	if (!parent_proc(user)) {
		return 0;
	}
	if (!this.emagged) return f.dot;
	if (this.active) {
		this.change_meteor_chance(2);
	} else {
		this.change_meteor_chance(0.5);
	}
	return f.dot;
});

// shield.dm:169
rt.def("/obj/machinery/satellite/meteor_shield/proc/change_meteor_chance", function change_meteor_chance(f: Frame, mod: Value) {
	let E: Value = null;
	if (!(E = rt.locateIn(f, T("/datum/round_event_control/meteor_wave"), GLOB.SSevents.control))) return f.dot;
	E.weight *= mod;
	return f.dot;
});

// shield.dm:174
rt.def("/obj/machinery/satellite/meteor_shield/proc/Destroy", function* Destroy(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!(this.active && this.emagged)) return f.dot;
	this.change_meteor_chance(0.5);
	return f.dot;
}, true);

// shield.dm:179
rt.def("/obj/machinery/satellite/meteor_shield/proc/emag_act", function emag_act(f: Frame) {
	if (this.emagged) return f.dot;
	this.emagged = 1;
	if (!this.active) return f.dot;
	this.change_meteor_chance(2);
	return f.dot;
});
