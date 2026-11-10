// Based on /tg/station's code/game/alternate_appearance.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


// alternate_appearance.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalactive_alternate_appearances", function InitGlobalactive_alternate_appearances(f: Frame) {
	GLOB.active_alternate_appearances = list();
	this.gvars_datum_init_order += "active_alternate_appearances";
	return f.dot;
});

// alternate_appearance.dm:9
rt.def("/atom/proc/remove_alt_appearance", function* remove_alt_appearance(f: Frame, key: Value) {
	let K: Value = null, AA: Value = null;
	if (!this.alternate_appearances) return f.dot;
	for (K of each(this.alternate_appearances)) {
		if ((AA = rt.index(this.alternate_appearances, K)).appearance_key == key) {
			yield* AA.remove_from_hud(this);
			break;
		}
	}
	return f.dot;
}, true);

// alternate_appearance.dm:16
rt.def("/atom/proc/add_alt_appearance", function* add_alt_appearance(f: Frame) {
	let _arguments: Value = null;
	if (!f.args[0] || !f.args[1]) {
		return f.dot;
	}
	if (this.alternate_appearances && rt.index(this.alternate_appearances, f.args[1])) {
		return f.dot;
	}
	yield* g.new_(f, f.args[0], [(_arguments = (yield* f.argsList.Copy(2)))], rt.Args.List);
	return f.dot;
}, true, { args: ["type", "key"] });

rt.type(549, "/datum/atom_hud/alternate_appearance", "/datum/atom_hud", {
	appearance_key: null,
});

// alternate_appearance.dm:28
rt.def("/datum/atom_hud/alternate_appearance/proc/New", function New(f: Frame, key: Value) {
	parent_proc();
	GLOB.active_alternate_appearances += this;
	this.appearance_key = key;
	return f.dot;
}, false);

// alternate_appearance.dm:33
rt.def("/datum/atom_hud/alternate_appearance/proc/Destroy", function* Destroy(f: Frame) {
	let v: Value = null;
	for (v of each(this.hudusers)) {
		this.remove_hud_from(v);
	}
	v = null;
	for (v of each(this.hudatoms)) {
		yield* this.remove_from_hud(v);
	}
	GLOB.active_alternate_appearances -= this;
	return (yield* parent_proc());
}, true);

// alternate_appearance.dm:41
rt.def("/datum/atom_hud/alternate_appearance/proc/onNewMob", function onNewMob(f: Frame, M: Value) {
	if (!this.mobShouldSee(M)) return f.dot;
	this.add_hud_to(M);
	return f.dot;
});

// alternate_appearance.dm:48
rt.def("/datum/atom_hud/alternate_appearance/proc/add_to_hud", function add_to_hud(f: Frame, A: Value, I: Value) {
	f.dot = parent_proc();
	if (!f.dot) return f.dot;
	if (!A.alternate_appearances) {
		A.alternate_appearances = list();
	}
	rt.setAt(A.alternate_appearances, this.appearance_key, this);
	return f.dot;
}, false);

// alternate_appearance.dm:54
rt.def("/datum/atom_hud/alternate_appearance/proc/remove_from_hud", function remove_from_hud(f: Frame, A: Value) {
	f.dot = parent_proc();
	if (!f.dot) return f.dot;
	if (!A.alternate_appearances) return f.dot;
	A.alternate_appearances -= this.appearance_key;
	if (rt.len(f, A.alternate_appearances)) return f.dot;
	A.alternate_appearances = null;
	return f.dot;
}, false);

rt.type(550, "/datum/atom_hud/alternate_appearance/basic", "/datum/atom_hud/alternate_appearance", {
	target: null,
	theImage: null,
	add_ghost_version: 0,
	ghost_appearance: null,
});

// alternate_appearance.dm:67
rt.def("/datum/atom_hud/alternate_appearance/basic/proc/New", function New(f: Frame) {
	let ghost_image: Value = null;
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	parent_proc();
	this.theImage = f.args[1];
	this.target = f.args[1].loc;
	this.hud_icons = list(this.appearance_key);
	this.add_to_hud(this.target, f.args[1]);
	if (f.args[2] && ismob(this.target)) {
		this.add_hud_to(this.target);
	}
	if (!this.add_ghost_version) return f.dot;
	(ghost_image = image({ icon: f.args[1].icon, icon_state: f.args[1].icon_state, loc: f.args[1].loc })).override = 0;
	ghost_image.alpha = 128;
	this.ghost_appearance = new_(T("/datum/atom_hud/alternate_appearance/basic/observers"), f.args[0] + "_observer", ghost_image, 0);
	return f.dot;
}, false, { args: ["key", "I", "target_sees_appearance"] });

// alternate_appearance.dm:81
rt.def("/datum/atom_hud/alternate_appearance/basic/proc/Destroy", function* Destroy(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.ghost_appearance) return f.dot;
	yield* qdel(this.ghost_appearance);
	this.ghost_appearance = null;
	return f.dot;
}, true);

// alternate_appearance.dm:87
rt.def("/datum/atom_hud/alternate_appearance/basic/proc/add_to_hud", function add_to_hud(f: Frame, A: Value) {
	rt.setAt(A.hud_list, this.appearance_key, this.theImage);
	f.dot = parent_proc();
	return f.dot;
}, false);

// alternate_appearance.dm:90
rt.def("/datum/atom_hud/alternate_appearance/basic/proc/remove_from_hud", function* remove_from_hud(f: Frame, A: Value) {
	f.dot = (yield* parent_proc());
	A.hud_list -= this.appearance_key;
	if (!(f.dot && !(!this || this.gc_destroyed))) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(551, "/datum/atom_hud/alternate_appearance/basic/everyone", "/datum/atom_hud/alternate_appearance/basic", {
	add_ghost_version: 1,
});

// alternate_appearance.dm:99
rt.def("/datum/atom_hud/alternate_appearance/basic/everyone/proc/New", function New(f: Frame) {
	let mob: Value = null;
	parent_proc();
	for (mob of each(GLOB.mob_list)) {
		if (this.mobShouldSee(mob)) {
			this.add_hud_to(mob);
		}
	}
	return f.dot;
});

// alternate_appearance.dm:105
rt.def("/datum/atom_hud/alternate_appearance/basic/everyone/proc/mobShouldSee", function mobShouldSee(f: Frame, M: Value) {
	return (!rt.istype(M, T("/mob/dead/observer")) ? 1 : 0);
});

rt.type(552, "/datum/atom_hud/alternate_appearance/basic/silicons", "/datum/atom_hud/alternate_appearance/basic", {});

// alternate_appearance.dm:110
rt.def("/datum/atom_hud/alternate_appearance/basic/silicons/proc/New", function New(f: Frame) {
	let mob: Value = null;
	parent_proc();
	for (mob of each(GLOB.silicon_mobs)) {
		if (this.mobShouldSee(mob)) {
			this.add_hud_to(mob);
		}
	}
	return f.dot;
});

// alternate_appearance.dm:116
rt.def("/datum/atom_hud/alternate_appearance/basic/silicons/proc/mobShouldSee", function mobShouldSee(f: Frame, M: Value) {
	if (rt.istype(M, T("/mob/living/silicon"))) {
		return 1;
	}
	return 0;
});

rt.type(553, "/datum/atom_hud/alternate_appearance/basic/observers", "/datum/atom_hud/alternate_appearance/basic", {
	add_ghost_version: 0,
});

// alternate_appearance.dm:124
rt.def("/datum/atom_hud/alternate_appearance/basic/observers/proc/New", function New(f: Frame) {
	let mob: Value = null;
	parent_proc();
	for (mob of each(GLOB.dead_mob_list)) {
		if (this.mobShouldSee(mob)) {
			this.add_hud_to(mob);
		}
	}
	return f.dot;
});

// alternate_appearance.dm:130
rt.def("/datum/atom_hud/alternate_appearance/basic/observers/proc/mobShouldSee", function mobShouldSee(f: Frame, M: Value) {
	return (rt.istype(M, T("/mob/dead/observer")) ? 1 : 0);
});
