// Based on /tg/station's code/game/gamemodes/antag_hud.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(563, "/datum/atom_hud/antag", "/datum/atom_hud", {
	self_visible: 1,
	hud_icons: null,
});

// antag_hud.dm:2
rt.def("/datum/atom_hud/antag/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.hud_icons = list("15");
	return f.dot;
});

// antag_hud.dm:10
rt.def("/datum/atom_hud/antag/proc/join_hud", function join_hud(f: Frame, M: Value) {
	if (!rt.istype(M, T("/mob"))) {
		CRASH(`join_hud(): ${M} (${M.type}) is not a mob!`);
	}
	if (M.mind.antag_hud) {
		M.mind.antag_hud.leave_hud(M);
	}
	this.add_to_hud(M);
	if (this.self_visible) {
		this.add_hud_to(M);
	}
	M.mind.antag_hud = this;
	return f.dot;
});

// antag_hud.dm:20
rt.def("/datum/atom_hud/antag/proc/leave_hud", function leave_hud(f: Frame, M: Value) {
	if (!M) {
		return f.dot;
	}
	if (!rt.istype(M, T("/mob"))) {
		CRASH(`leave_hud(): ${M} (${M.type}) is not a mob!`);
	}
	this.remove_from_hud(M);
	this.remove_hud_from(M);
	if (!M.mind) return f.dot;
	M.mind.antag_hud = null;
	return f.dot;
});

// antag_hud.dm:33
rt.def("/datum/game_mode/proc/set_antag_hud", function set_antag_hud(f: Frame, M: Value, new_icon_state: Value) {
	let holder: Value = null;
	if (!rt.istype(M, T("/mob"))) {
		CRASH(`set_antag_hud(): ${M} (${M.type}) is not a mob!`);
	}
	if (holder = rt.index(M.hud_list, "15")) {
		holder.icon_state = new_icon_state;
	}
	if (!(M.mind || new_icon_state)) return f.dot;
	M.mind.antag_hud_icon_state = new_icon_state;
	return f.dot;
});

// antag_hud.dm:45
rt.def("/datum/mind/proc/transfer_antag_huds", function transfer_antag_huds(f: Frame, newhud: Value) {
	this.leave_all_antag_huds();
	GLOB.SSticker.mode.set_antag_hud(this.current, this.antag_hud_icon_state);
	if (!newhud) return f.dot;
	newhud.join_hud(this.current);
	return f.dot;
});

// antag_hud.dm:51
rt.def("/datum/mind/proc/leave_all_antag_huds", function leave_all_antag_huds(f: Frame) {
	let hud: Value = null;
	for (hud of each(GLOB.huds, T("/datum/atom_hud/antag"))) {
		if (rt.index(hud.hudusers, this.current)) {
			hud.leave_hud(this.current);
		}
	}
	return f.dot;
});

rt.type(565, "/datum/atom_hud/antag/gang", "/datum/atom_hud/antag", {
	color: null,
});

// antag_hud.dm:59
rt.def("/datum/atom_hud/antag/gang/proc/add_to_hud", function add_to_hud(f: Frame, A: Value) {
	let holder: Value = null;
	if (!A) {
		return f.dot;
	}
	if (holder = rt.index(A.hud_list, "15")) {
		holder.color = this.color;
	}
	parent_proc();
	return f.dot;
}, false);

// antag_hud.dm:67
rt.def("/datum/atom_hud/antag/gang/proc/remove_from_hud", function remove_from_hud(f: Frame, A: Value) {
	let holder: Value = null;
	if (!A) {
		return f.dot;
	}
	if (holder = rt.index(A.hud_list, "15")) {
		holder.color = null;
	}
	parent_proc();
	return f.dot;
}, false);

// antag_hud.dm:75
rt.def("/datum/atom_hud/antag/gang/proc/join_hud", function join_hud(f: Frame, M: Value) {
	let holder: Value = null;
	if (!rt.istype(M, T("/mob"))) {
		CRASH(`join_hud(): ${M} (${M.type}) is not a mob!`);
	}
	if (holder = rt.index(M.hud_list, "15")) {
		holder.color = this.color;
	}
	parent_proc();
	return f.dot;
}, false);

// antag_hud.dm:83
rt.def("/datum/atom_hud/antag/gang/proc/leave_hud", function leave_hud(f: Frame, M: Value) {
	let holder: Value = null;
	if (!rt.istype(M, T("/mob"))) {
		CRASH(`leave_hud(): ${M} (${M.type}) is not a mob!`);
	}
	if (holder = rt.index(M.hud_list, "15")) {
		holder.color = null;
	}
	parent_proc();
	return f.dot;
}, false);
