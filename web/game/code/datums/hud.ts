// Based on /tg/station's code/datums/hud.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// hud.dm:4
rt.def("/datum/controller/global_vars/proc/InitGlobalhuds", function InitGlobalhuds(f: Frame) {
	GLOB.huds = rt.alist(f, [1, new_(T("/datum/atom_hud/data/human/security/basic")), 2, new_(T("/datum/atom_hud/data/human/security/advanced")), 3, new_(T("/datum/atom_hud/data/human/medical/basic")), 4, new_(T("/datum/atom_hud/data/human/medical/advanced")), 5, new_(T("/datum/atom_hud/data/diagnostic")), 6, new_(T("/datum/atom_hud/antag")), 7, new_(T("/datum/atom_hud/antag")), 8, new_(T("/datum/atom_hud/antag")), 9, new_(T("/datum/atom_hud/antag")), 10, new_(T("/datum/atom_hud/antag")), 11, new_(T("/datum/atom_hud/antag/hidden")), 12, new_(T("/datum/atom_hud/antag/hidden")), 13, new_(T("/datum/atom_hud/antag/hidden")), 14, new_(T("/datum/atom_hud/antag/hidden")), 15, new_(T("/datum/atom_hud/antag")), 16, new_(T("/datum/atom_hud/antag/hidden")), 17, new_(T("/datum/atom_hud/antag/hidden")), 18, new_(T("/datum/atom_hud/antag"))]);
	this.gvars_datum_init_order += "huds";
	return f.dot;
});

rt.type(548, "/datum/atom_hud", "/datum", {
	hudatoms: null,
	hudusers: null,
	hud_icons: null,
});

// hud.dm:26
rt.def("/datum/atom_hud/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.hudatoms = list();

	this.hudusers = list();

	this.hud_icons = list();
	return f.dot;
});

// hud.dm:31
rt.def("/datum/atom_hud/proc/remove_hud_from", function remove_hud_from(f: Frame, M: Value) {
	let A: Value = null;
	if (!M) {
		return f.dot;
	}
	if (rt.isIn(f, this, M.permanent_huds)) {
		return f.dot;
	}
	for (A of each(this.hudatoms, T("/atom"))) {
		this.remove_from_single_hud(M, A);
	}
	this.hudusers -= M;
	return f.dot;
});

// hud.dm:40
rt.def("/datum/atom_hud/proc/remove_from_hud", function remove_from_hud(f: Frame, A: Value) {
	let M: Value = null;
	if (!A) {
		return 0;
	}
	for (M of each(this.hudusers, T("/mob"))) {
		this.remove_from_single_hud(M, A);
	}
	this.hudatoms -= A;
	return 1;
});

// hud.dm:48
rt.def("/datum/atom_hud/proc/remove_from_single_hud", function remove_from_single_hud(f: Frame, M: Value, A: Value) {
	let i: Value = null;
	if (!M || !M.client || !A) {
		return f.dot;
	}
	for (i of each(this.hud_icons)) {
		M.client.images -= rt.index(A.hud_list, i);
	}
	return f.dot;
});

// hud.dm:54
rt.def("/datum/atom_hud/proc/add_hud_to", function add_hud_to(f: Frame, M: Value) {
	let A: Value = null;
	if (!M) {
		return f.dot;
	}
	rt.setAt(this.hudusers, M, 1);
	for (A of each(this.hudatoms, T("/atom"))) {
		this.add_to_single_hud(M, A);
	}
	return f.dot;
});

// hud.dm:61
rt.def("/datum/atom_hud/proc/add_to_hud", function add_to_hud(f: Frame, A: Value) {
	let M: Value = null;
	if (!A) {
		return 0;
	}
	(rt.modSrcVar(f, "hudatoms", A, rt.bitOr));
	for (M of each(this.hudusers, T("/mob"))) {
		this.add_to_single_hud(M, A);
	}
	return 1;
});

// hud.dm:69
rt.def("/datum/atom_hud/proc/add_to_single_hud", function add_to_single_hud(f: Frame, M: Value, A: Value) {
	let i: Value = null;
	if (!M || !M.client || !A) {
		return f.dot;
	}
	for (i of each(this.hud_icons)) {
		if (rt.index(A.hud_list, i)) {
			(rt.modField(f, M.client, "images", rt.index(A.hud_list, i), rt.bitOr));
		}
	}
	return f.dot;
});

// hud.dm:77
rt.def("/mob/proc/reload_huds", function reload_huds(f: Frame) {
	let G: Value = null, hud: Value = null;
	let gang_huds: Value = list();
	if (GLOB.SSticker.mode) {
		for (G of each(GLOB.SSticker.mode.gangs, T("/datum/gang"))) {
			gang_huds += G.ganghud;
		}
	}
	for (hud of each(rt.bitOr(rt.bitOr(GLOB.huds, gang_huds), GLOB.active_alternate_appearances), T("/datum/atom_hud"))) {
		if (hud && rt.index(hud.hudusers, this)) {
			hud.add_hud_to(this);
		}
	}
	return f.dot;
});
