// Based on /tg/station's code/game/objects/effects/temporary_visuals/miscellaneous.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(11604, "/obj/effect/temp_visual/dir_setting/bloodsplatter", "/obj/effect/temp_visual/dir_setting", {
	splatter_type: "splatter",
	icon: rt.rsc("icons/effects/blood.dmi"),
	duration: 5,
	randomdir: 0,
	layer: 3.7,
});

// miscellaneous.dm:10
rt.def("/obj/effect/temp_visual/dir_setting/bloodsplatter/proc/Initialize", function* Initialize(f: Frame, mapload: Value, set_dir: Value) {
	if (rt.isIn(f, set_dir, GLOB.diagonals)) {
		this.icon_state = `${this.splatter_type}${pick(1, 2, 6)}`;
	} else {
		this.icon_state = `${this.splatter_type}${pick(3, 4, 5)}`;
	}
	f.dot = (yield* parent_proc());
	let target_pixel_x: Value = 0;
	let target_pixel_y: Value = 0;
	if (set_dir === 1) {
		target_pixel_y = 16;
	} else if (set_dir === 2) {
		target_pixel_y = -16;
		this.layer = ABOVE_MOB_LAYER;
	} else if (set_dir === 4) {
		target_pixel_x = 16;
	} else if (set_dir === 8) {
		target_pixel_x = -16;
	} else if (set_dir === 5) {
		target_pixel_x = 16;
		target_pixel_y = 16;
	} else if (set_dir === 9) {
		target_pixel_x = -16;
		target_pixel_y = 16;
	} else if (set_dir === 6) {
		target_pixel_x = 16;
		target_pixel_y = -16;
		this.layer = ABOVE_MOB_LAYER;
	} else if (set_dir === 10) {
		target_pixel_x = -16;
		target_pixel_y = -16;
		this.layer = ABOVE_MOB_LAYER;
	}
	rt.op(f, "Animate", [2, 10], [null, this, "pixel_x", target_pixel_x, "pixel_y", target_pixel_y, "alpha", 0, "time", this.duration]);
	return f.dot;
}, true);

rt.type(11607, "/obj/effect/temp_visual/dir_setting/firing_effect", "/obj/effect/temp_visual/dir_setting", {
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "firing_effect",
	duration: 2,
});

// miscellaneous.dm:59
rt.def("/obj/effect/temp_visual/dir_setting/firing_effect/proc/setDir", function setDir(f: Frame, newdir: Value) {
	if (newdir === 1) {
		this.layer = BELOW_MOB_LAYER;
		this.pixel_x = rand(-3, 3);
		this.pixel_y = rand(4, 6);
	} else if (newdir === 2) {
		this.pixel_x = rand(-3, 3);
		this.pixel_y = rand(-1, 1);
	} else {
		this.pixel_x = rand(-1, 1);
		this.pixel_y = rand(-1, 1);
	}
	parent_proc();
	return f.dot;
}, false);

rt.type(11627, "/obj/effect/temp_visual/decoy", "/obj/effect/temp_visual", {
	desc: "It's a decoy!",
	duration: 15,
});

// miscellaneous.dm:150
rt.def("/obj/effect/temp_visual/decoy/proc/Initialize", function* Initialize(f: Frame, mapload: Value, mimiced_atom: Value) {
	f.dot = (yield* parent_proc());
	this.alpha = rt.initial(f, this, "alpha");
	if (!mimiced_atom) return f.dot;
	this.name = mimiced_atom.name;
	this.appearance = mimiced_atom.appearance;
	yield* this.setDir(mimiced_atom.dir);
	this.mouse_opacity = 0;
	return f.dot;
}, true);

rt.type(11628, "/obj/effect/temp_visual/decoy/fading", "/obj/effect/temp_visual/decoy", {});

// miscellaneous.dm:159
rt.def("/obj/effect/temp_visual/decoy/fading/proc/Initialize", function* Initialize(f: Frame, mapload: Value, mimiced_atom: Value) {
	f.dot = (yield* parent_proc());
	rt.op(f, "Animate", [2, 6], [null, this, "alpha", 0, "time", this.duration]);
	return f.dot;
}, true);

rt.type(11640, "/obj/effect/temp_visual/gib_animation", "/obj/effect/temp_visual", {
	icon: rt.rsc("icons/mob/mob.dmi"),
	duration: 15,
});

// miscellaneous.dm:216
rt.def("/obj/effect/temp_visual/gib_animation/proc/Initialize", function* Initialize(f: Frame, mapload: Value, gib_icon: Value) {
	this.icon_state = gib_icon;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(11642, "/obj/effect/temp_visual/dust_animation", "/obj/effect/temp_visual", {
	icon: rt.rsc("icons/mob/mob.dmi"),
	duration: 15,
});

// miscellaneous.dm:227
rt.def("/obj/effect/temp_visual/dust_animation/proc/Initialize", function* Initialize(f: Frame, mapload: Value, dust_icon: Value) {
	this.icon_state = dust_icon;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(11644, "/obj/effect/temp_visual/heal", "/obj/effect/temp_visual", {
	name: "healing glow",
	icon_state: "heal",
	duration: 15,
});

// miscellaneous.dm:242
rt.def("/obj/effect/temp_visual/heal/proc/Initialize", function* Initialize(f: Frame, mapload: Value, set_color: Value) {
	if (set_color) {
		this.add_atom_colour(set_color, FIXED_COLOUR_PRIORITY);
	}
	f.dot = (yield* parent_proc());
	this.pixel_x = rand(-12, 12);
	this.pixel_y = rand(-9, 0);
	return f.dot;
}, true);

rt.type(11649, "/obj/effect/temp_visual/impact_effect", "/obj/effect/temp_visual", {
	icon_state: "impact_bullet",
	duration: 5,
});

// miscellaneous.dm:278
rt.def("/obj/effect/temp_visual/impact_effect/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[1] == f.args[2].original) {
		this.pixel_x = f.args[2].p_x + f.args[1].pixel_x - 16 + rand(-4, 4);
		this.pixel_y = f.args[2].p_y + f.args[1].pixel_y - 16 + rand(-4, 4);
	} else {
		this.pixel_x = f.args[1].pixel_x + rand(-4, 4);
		this.pixel_y = f.args[1].pixel_y + rand(-4, 4);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["mapload", "target", "P"] });

rt.type(11656, "/obj/effect/temp_visual/heart", "/obj/effect/temp_visual", {
	name: "heart",
	icon: rt.rsc("icons/mob/animal.dmi"),
	icon_state: "heart",
	duration: 25,
});

// miscellaneous.dm:317
rt.def("/obj/effect/temp_visual/heart/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	this.pixel_x = rand(-4, 4);
	this.pixel_y = rand(-4, 4);
	rt.op(f, "Animate", [2, 8], [null, this, "pixel_y", this.pixel_y + 32, "alpha", 0, "time", 25]);
	return f.dot;
}, true);

rt.type(11657, "/obj/effect/temp_visual/bleed", "/obj/effect/temp_visual", {
	shrink: 1,
	name: "bleed",
	icon: rt.rsc("icons/effects/bleed.dmi"),
	icon_state: "bleed0",
	duration: 10,
});

// miscellaneous.dm:330
rt.def("/obj/effect/temp_visual/bleed/proc/Initialize", function* Initialize(f: Frame, mapload: Value, size_calc_target: Value) {
	let I: Value = null;
	f.dot = (yield* parent_proc());
	let size_matrix: Value = matrix();
	if (size_calc_target) {
		this.layer = size_calc_target.layer + 0.01;
		I = icon(size_calc_target.icon, size_calc_target.icon_state, size_calc_target.dir);
		this.transform = (size_matrix = matrix() * (I.Height() / rt.world().icon_size));
	}
	let M: Value = this.transform;
	if (this.shrink) {
		M = size_matrix * 0.1;
	} else {
		M = size_matrix * 2;
	}
	rt.op(f, "Animate", [2, 10], [null, this, "alpha", 20, "transform", M, "time", this.duration, "flags", 4]);
	return f.dot;
}, true);
