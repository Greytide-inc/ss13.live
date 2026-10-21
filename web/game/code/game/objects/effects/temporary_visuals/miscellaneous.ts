// From code/game/objects/effects/temporary_visuals/miscellaneous.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11604, "/obj/effect/temp_visual/dir_setting/bloodsplatter", "/obj/effect/temp_visual/dir_setting", {
	splatter_type: "splatter",
	icon: rt.rsc("icons/effects/blood.dmi"),
	duration: 5,
	randomdir: 0,
	layer: 3.7,
});

// /obj/effect/temp_visual/dir_setting/bloodsplatter/proc/Initialize  (code/game/objects/effects/temporary_visuals/miscellaneous.dm:10)  may sleep
rt.def("/obj/effect/temp_visual/dir_setting/bloodsplatter/proc/Initialize", function* Initialize(f: Frame) {
	let target_pixel_x: Value = null, target_pixel_y: Value = null;
	let $0: any;
	f.vars = () => [target_pixel_x, target_pixel_y, $0];
	if (truthy((rt.isIn(f, live(f.args[1]), rt.gl("diagonals")) ? 1 : 0))) {
		rt.setSv(f, "icon_state", fmt("＀＀", [rt.sv(f, "splatter_type"), rt.op(f, "PickUnweighted", [3], [1, 2, 6])]));
	} else {
		rt.setSv(f, "icon_state", fmt("＀＀", [rt.sv(f, "splatter_type"), rt.op(f, "PickUnweighted", [3], [3, 4, 5])]));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	target_pixel_x = 0;
	target_pixel_y = 0;
	$0 = live(f.args[1]);
	if ($0 === 1) {
		target_pixel_y = 16;
	} else if ($0 === 2) {
		target_pixel_y = -16;
		rt.setSv(f, "layer", 4.099999904632568);
	} else if ($0 === 4) {
		target_pixel_x = 16;
	} else if ($0 === 8) {
		target_pixel_x = -16;
	} else if ($0 === 5) {
		target_pixel_x = 16;
		target_pixel_y = 16;
	} else if ($0 === 9) {
		target_pixel_x = -16;
		target_pixel_y = 16;
	} else if ($0 === 6) {
		target_pixel_x = 16;
		target_pixel_y = -16;
		rt.setSv(f, "layer", 4.099999904632568);
	} else if ($0 === 10) {
		target_pixel_x = -16;
		target_pixel_y = -16;
		rt.setSv(f, "layer", 4.099999904632568);
	}
	rt.op(f, "Animate", [2, 10], [null, live(f.src), "pixel_x", live(target_pixel_x), "pixel_y", live(target_pixel_y), "alpha", 0, "time", rt.sv(f, "duration")]);
	return f.dot;
}, true, { args: ["mapload", "set_dir"] });

rt.type(11607, "/obj/effect/temp_visual/dir_setting/firing_effect", "/obj/effect/temp_visual/dir_setting", {
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "firing_effect",
	duration: 2,
});

// /obj/effect/temp_visual/dir_setting/firing_effect/proc/setDir  (code/game/objects/effects/temporary_visuals/miscellaneous.dm:59)
rt.def("/obj/effect/temp_visual/dir_setting/firing_effect/proc/setDir", function setDir(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(f.args[0]);
	if ($0 === 1) {
		rt.setSv(f, "layer", 3.700000047683716);
		rt.setSv(f, "pixel_x", rt.call(f, P("/proc/rand"), null, [-3, 3]));
		rt.setSv(f, "pixel_y", rt.call(f, P("/proc/rand"), null, [4, 6]));
	} else if ($0 === 2) {
		rt.setSv(f, "pixel_x", rt.call(f, P("/proc/rand"), null, [-3, 3]));
		rt.setSv(f, "pixel_y", rt.call(f, P("/proc/rand"), null, [-1, 1]));
	} else {
		rt.setSv(f, "pixel_x", rt.call(f, P("/proc/rand"), null, [-1, 1]));
		rt.setSv(f, "pixel_y", rt.call(f, P("/proc/rand"), null, [-1, 1]));
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["newdir"] });

rt.type(11627, "/obj/effect/temp_visual/decoy", "/obj/effect/temp_visual", {
	desc: "It's a decoy!",
	duration: 15,
});

// /obj/effect/temp_visual/decoy/proc/Initialize  (code/game/objects/effects/temporary_visuals/miscellaneous.dm:150)  may sleep
rt.def("/obj/effect/temp_visual/decoy/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "alpha", rt.initial(f, live(f.src), "alpha"));
	if (!truthy(live(f.args[1]))) return f.dot;
	rt.setSv(f, "name", rt.fv(f, "name", live(f.args[1])));
	rt.setSv(f, "appearance", rt.fv(f, "appearance", live(f.args[1])));
	yield* g.srcCall(f, "setDir", rt.fv(f, "dir", live(f.args[1])));
	rt.setSv(f, "mouse_opacity", 0);
	return f.dot;
}, true, { args: ["mapload", "mimiced_atom"] });

rt.type(11628, "/obj/effect/temp_visual/decoy/fading", "/obj/effect/temp_visual/decoy", {});

// /obj/effect/temp_visual/decoy/fading/proc/Initialize  (code/game/objects/effects/temporary_visuals/miscellaneous.dm:159)  may sleep
rt.def("/obj/effect/temp_visual/decoy/fading/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "alpha", 0, "time", rt.sv(f, "duration")]);
	return f.dot;
}, true, { args: ["mapload", "mimiced_atom"] });

rt.type(11640, "/obj/effect/temp_visual/gib_animation", "/obj/effect/temp_visual", {
	icon: rt.rsc("icons/mob/mob.dmi"),
	duration: 15,
});

// /obj/effect/temp_visual/gib_animation/proc/Initialize  (code/game/objects/effects/temporary_visuals/miscellaneous.dm:216)  may sleep
rt.def("/obj/effect/temp_visual/gib_animation/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "icon_state", live(f.args[1]));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["mapload", "gib_icon"] });

rt.type(11642, "/obj/effect/temp_visual/dust_animation", "/obj/effect/temp_visual", {
	icon: rt.rsc("icons/mob/mob.dmi"),
	duration: 15,
});

// /obj/effect/temp_visual/dust_animation/proc/Initialize  (code/game/objects/effects/temporary_visuals/miscellaneous.dm:227)  may sleep
rt.def("/obj/effect/temp_visual/dust_animation/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "icon_state", live(f.args[1]));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["mapload", "dust_icon"] });

rt.type(11644, "/obj/effect/temp_visual/heal", "/obj/effect/temp_visual", {
	name: "healing glow",
	icon_state: "heal",
	duration: 15,
});

// /obj/effect/temp_visual/heal/proc/Initialize  (code/game/objects/effects/temporary_visuals/miscellaneous.dm:242)  may sleep
rt.def("/obj/effect/temp_visual/heal/proc/Initialize", function* Initialize(f: Frame) {
	if (truthy(live(f.args[1]))) {
		yield* g.srcCall(f, "add_atom_colour", live(f.args[1]), 4);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-12, 12])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-9, 0])));
	return f.dot;
}, true, { args: ["mapload", "set_color"] });

rt.type(11649, "/obj/effect/temp_visual/impact_effect", "/obj/effect/temp_visual", {
	icon_state: "impact_bullet",
	duration: 5,
});

// /obj/effect/temp_visual/impact_effect/proc/Initialize  (code/game/objects/effects/temporary_visuals/miscellaneous.dm:278)  may sleep
rt.def("/obj/effect/temp_visual/impact_effect/proc/Initialize", function* Initialize(f: Frame) {
	if (isEqual(live(f.args[1]), rt.fv(f, "original", live(f.args[2])))) {
		rt.setSv(f, "pixel_x", add(subtract(add(rt.fv(f, "p_x", live(f.args[2])), rt.fv(f, "pixel_x", live(f.args[1]))), 16), (yield* g.call(f, P("/proc/rand"), null, [-4, 4]))));
		rt.setSv(f, "pixel_y", add(subtract(add(rt.fv(f, "p_y", live(f.args[2])), rt.fv(f, "pixel_y", live(f.args[1]))), 16), (yield* g.call(f, P("/proc/rand"), null, [-4, 4]))));
	} else {
		rt.setSv(f, "pixel_x", add(rt.fv(f, "pixel_x", live(f.args[1])), (yield* g.call(f, P("/proc/rand"), null, [-4, 4]))));
		rt.setSv(f, "pixel_y", add(rt.fv(f, "pixel_y", live(f.args[1])), (yield* g.call(f, P("/proc/rand"), null, [-4, 4]))));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["mapload", "target", "P"] });

rt.type(11656, "/obj/effect/temp_visual/heart", "/obj/effect/temp_visual", {
	name: "heart",
	icon: rt.rsc("icons/mob/animal.dmi"),
	icon_state: "heart",
	duration: 25,
});

// /obj/effect/temp_visual/heart/proc/Initialize  (code/game/objects/effects/temporary_visuals/miscellaneous.dm:317)  may sleep
rt.def("/obj/effect/temp_visual/heart/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-4, 4])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-4, 4])));
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_y", add(rt.sv(f, "pixel_y"), 32), "alpha", 0, "time", 25]);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11657, "/obj/effect/temp_visual/bleed", "/obj/effect/temp_visual", {
	shrink: 1,
	name: "bleed",
	icon: rt.rsc("icons/effects/bleed.dmi"),
	icon_state: "bleed0",
	duration: 10,
});

// /obj/effect/temp_visual/bleed/proc/Initialize  (code/game/objects/effects/temporary_visuals/miscellaneous.dm:330)  may sleep
rt.def("/obj/effect/temp_visual/bleed/proc/Initialize", function* Initialize(f: Frame) {
	let size_matrix: Value = null, I: Value = null, M: Value = null;
	f.vars = () => [size_matrix, I, M];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	size_matrix = (yield* g.call(f, P("/proc/matrix"), null, []));
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "layer", add(rt.fv(f, "layer", live(f.args[1])), 0.009999999776482582));
		I = (yield* g.call(f, P("/proc/icon"), null, [rt.fv(f, "icon", live(f.args[1])), rt.fv(f, "icon_state", live(f.args[1])), rt.fv(f, "dir", live(f.args[1]))]));
		rt.setSv(f, "transform", (size_matrix = multiply((yield* g.call(f, P("/proc/matrix"), null, [])), divide((yield* g.callName(f, live(I), "Height", [])), rt.fv(f, "icon_size", rt.world())))));
	}
	M = rt.sv(f, "transform");
	if (truthy(rt.sv(f, "shrink"))) {
		M = multiply(live(size_matrix), 0.10000000149011612);
	} else {
		M = multiply(live(size_matrix), 2);
	}
	rt.op(f, "Animate", [2, 10], [null, live(f.src), "alpha", 20, "transform", live(M), "time", rt.sv(f, "duration"), "flags", 4]);
	return f.dot;
}, true, { args: ["mapload", "size_calc_target"] });
