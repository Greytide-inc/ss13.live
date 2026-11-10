// Based on /tg/station's code/game/gamemodes/blob/blobs/core.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12141, "/obj/structure/blob/core", "/obj/structure/blob", {
	core_regen: 2,
	overmind_get_delay: 0,
	resource_delay: 0,
	point_rate: 2,
	explosion_block: 6,
	point_return: -1,
	health_regen: 0,
	name: "blob core",
	icon: rt.rsc("icons/mob/blob.dmi"),
	icon_state: "blank_blob",
	desc: "A huge, pulsating yellow mass.",
	obj_integrity: 400,
	max_integrity: 400,
	armor: null,
});

// core.dm:8
rt.def("/obj/structure/blob/core/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 75, "acid", 90]);
	return f.dot;
});

// core.dm:19
rt.def("/obj/structure/blob/core/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = null;
	}
	if (f.args[2] === null) {
		f.args[2] = 2;
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	GLOB.blob_cores += this;
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	(rt.modGl("poi_list", this, rt.bitOr));
	yield* this.update_icon();
	if (!f.args[3] && !this.overmind) {
		yield* this.create_overmind(f.args[1]);
	}
	if (this.overmind) {
		yield* this.update_icon();
	}
	this.point_rate = f.args[2];
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["mapload", "new_overmind", "new_rate", "placed"] });

// core.dm:31
rt.def("/obj/structure/blob/core/proc/scannerreport", function scannerreport(f: Frame) {
	return "Directs the blob's expansion, gradually expands, and sustains nearby blob spores and blobbernauts.";
});

// core.dm:34
rt.def("/obj/structure/blob/core/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	this.color = null;
	let blob_overlay: Value = mutable_appearance(rt.rsc("icons/mob/blob.dmi"), "blob");
	if (this.overmind) {
		blob_overlay.color = this.overmind.blob_reagent_datum.color;
	}
	this.add_overlay(blob_overlay);
	this.add_overlay(mutable_appearance(rt.rsc("icons/mob/blob.dmi"), "blob_core_overlay"));
	return f.dot;
});

// core.dm:43
rt.def("/obj/structure/blob/core/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.blob_cores -= this;
	if (this.overmind) {
		this.overmind.blob_core = null;
	}
	this.overmind = null;
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	GLOB.poi_list -= this;
	return (yield* parent_proc());
}, true);

// core.dm:52
rt.def("/obj/structure/blob/core/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	let damage: Value = null;
	yield* this.take_damage((damage = 50 - 10 * severity), "brute", "bomb", 0);
	return f.dot;
}, true, { waitfor: false });

// core.dm:56
rt.def("/obj/structure/blob/core/proc/take_damage", function* take_damage(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = "brute";
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	if (f.args[5] === null) {
		f.args[5] = 1;
	}
	f.dot = (yield* parent_proc());
	if (!(this.obj_integrity > 0)) return f.dot;
	if (!this.overmind) return f.dot;
	this.overmind.update_health_hud();
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir", "overmind_reagent_trigger"] });

// core.dm:62
rt.def("/obj/structure/blob/core/proc/Life", function* Life(f: Frame) {
	let B: Value = null;
	if (!this || this.gc_destroyed) {
		return f.dot;
	}
	if (!this.overmind) {
		yield* this.create_overmind();
	} else if (this.resource_delay <= rt.worldTime(f)) {
		this.resource_delay = rt.worldTime(f) + 10;
		this.overmind.add_points(this.point_rate);
	}
	this.obj_integrity = min(this.max_integrity, this.obj_integrity + this.core_regen);
	if (this.overmind) {
		this.overmind.update_health_hud();
	}
	yield* this.Pulse_Area(this.overmind, 12, 4, 3);
	for (B of each(range(1, this), T("/obj/structure/blob/normal"))) {
		if (prob(5)) {
			yield* B.change_to(T("/obj/structure/blob/shield/core"), this.overmind);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// core.dm:81
rt.def("/obj/structure/blob/core/proc/create_overmind", function* create_overmind(f: Frame, new_overmind: Value, override_delay: Value) {
	let C: Value = null, B: Value = null;
	if (this.overmind_get_delay > rt.worldTime(f) && !override_delay) {
		return f.dot;
	}
	this.overmind_get_delay = rt.worldTime(f) + 150;
	if (this.overmind) {
		yield* qdel(this.overmind);
	}
	let candidates: Value = list();
	if (!new_overmind) {
		if (rt.len(f, (candidates = (yield* pollCandidatesForMob("Do you want to play as a blob overmind?", "blob", null, "blob", 50, this))))) {
			C = pick(candidates);
		}
	} else {
		C = new_overmind;
	}
	if (C) {
		(B = (yield* new_(T("/mob/camera/blob"), this.loc, 1))).key = C.key;
		B.blob_core = this;
		this.overmind = B;
		yield* this.update_icon();
		if (B.mind && !B.mind.special_role) {
			B.mind.special_role = "Blob Overmind";
		}
		return 1;
	}
	return 0;
}, true);
