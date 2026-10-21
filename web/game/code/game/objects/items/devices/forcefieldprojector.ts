// From code/game/objects/items/devices/forcefieldprojector.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9230, "/obj/item/device/forcefield", "/obj/item/device", {
	max_shield_integrity: 250,
	shield_integrity: 250,
	max_fields: 3,
	current_fields: null,
	field_distance_limit: 7,
	flags: 4,
	name: "forcefield projector",
	desc: "An experimental device that can create several forcefields at a distance.",
	icon_state: "signmaker_engi",
	slot_flags: 512,
	w_class: 2,
	item_state: "electronic",
	materials: null,
	origin_tech: "magnets=5;engineering=5;powerstorage=4",
});

// /obj/item/device/forcefield/proc/<init>  (code/game/objects/items/devices/forcefieldprojector.dm:9)
rt.def("/obj/item/device/forcefield/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 250, "$glass", 500]));
	return f.dot;
});

// /obj/item/device/forcefield/proc/afterattack  (code/game/objects/items/devices/forcefieldprojector.dm:18)  may sleep
rt.def("/obj/item/device/forcefield/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let F: Value = null, _T: Value = null, F_1: Value = null;
	f.vars = () => [target, user, proximity_flag, F, _T, F_1];
	if (!truthy((yield* g.srcCall(f, "check_allowed_items", live(target), 1)))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(target), T("/obj/structure/projected_forcefield")) ? 1 : 0))) {
		if (isEqual(rt.gv(f, "generator", (F = live(target))), live(f.src))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You deactivate ＀.</span>", [live(F)])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(F)]);
			return live(f.dot);
		}
	}
	if (truthy(rt.gv(f, "density", (_T = rt.getStep(f, live(target), 0))))) {
		return live(f.dot);
	}
	if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(_T), live(f.src)])), rt.sv(f, "field_distance_limit"))) {
		return live(f.dot);
	}
	if (rt.ge(rt.length(rt.sv(f, "current_fields")), rt.sv(f, "max_fields"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ cannot sustain any more forcefields!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/resonator_fire.ogg"), 50, 1]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ projects a forcefield!</span>", [live(user)]), "<span class='notice'>You project a forcefield.</span>"]);
	rt.modSrcVar(f, "current_fields", (F_1 = (yield* g.new_(f, T("/obj/structure/projected_forcefield"), [live(_T), live(f.src)]))), add);
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	return f.dot;
}, true);

// /obj/item/device/forcefield/proc/attack_self  (code/game/objects/items/devices/forcefieldprojector.dm:42)  may sleep
rt.def("/obj/item/device/forcefield/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let F: Value = null;
	let $e: any;
	f.vars = () => [user, F, $e];
	if (!truthy(rt.length(rt.sv(f, "current_fields")))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You deactivate ＀, disabling all active forcefields.</span>", [live(f.src)])]);
	F = null;
	rt.forList(f, 0, rt.sv(f, "current_fields"), T("/obj/structure/projected_forcefield"));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(F)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/device/forcefield/proc/examine  (code/game/objects/items/devices/forcefieldprojector.dm:48)
rt.def("/obj/item/device/forcefield/proc/examine", function examine(f: Frame) {
	let percent_charge: Value = null;
	f.vars = () => [percent_charge];
	rt.callSuper(f, [], rt.Args.Same);
	percent_charge = rt.call(f, P("/proc/round"), null, [multiply(divide(rt.sv(f, "shield_integrity"), rt.sv(f, "max_shield_integrity")), 100)]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>It is currently sustaining ＀/＀ fields, and it's ＀% charged.</span>", [rt.length(rt.sv(f, "current_fields")), rt.sv(f, "max_fields"), live(percent_charge)])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/forcefield/proc/Initialize  (code/game/objects/items/devices/forcefieldprojector.dm:53)  may sleep
rt.def("/obj/item/device/forcefield/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "current_fields", rt.list());
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/device/forcefield/proc/Destroy  (code/game/objects/items/devices/forcefieldprojector.dm:58)  may sleep
rt.def("/obj/item/device/forcefield/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/forcefield/proc/process  (code/game/objects/items/devices/forcefieldprojector.dm:62)  may sleep
rt.def("/obj/item/device/forcefield/proc/process", function* process(f: Frame) {
	let F: Value = null;
	let $e: any;
	f.vars = () => [F, $e];
	if (!truthy(rt.length(rt.sv(f, "current_fields")))) {
		rt.setSv(f, "shield_integrity", (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "shield_integrity"), 4), rt.sv(f, "max_shield_integrity")])));
	} else {
		rt.setSv(f, "shield_integrity", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "shield_integrity"), rt.length(rt.sv(f, "current_fields"))), 0])));
	}
	F = null;
	rt.forList(f, 0, rt.sv(f, "current_fields"), T("/obj/structure/projected_forcefield"));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		if ((rt.le(rt.sv(f, "shield_integrity"), 0) || rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(F), live(f.src)])), rt.sv(f, "field_distance_limit")))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(F)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

rt.type(12707, "/obj/structure/projected_forcefield", "/obj/structure", {
	generator: null,
	anchored: 1,
	CanAtmosPass: -2,
	name: "forcefield",
	desc: "A glowing barrier, generated by a projector nearby. It could be overloaded if hit enough times.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "forcefield",
	layer: 4.5,
	density: 1,
	mouse_opacity: 2,
	obj_integrity: 1e+31,
	max_integrity: 1e+31,
	armor: null,
});

// /obj/structure/projected_forcefield/proc/<init>  (code/game/objects/items/devices/forcefieldprojector.dm:82)
rt.def("/obj/structure/projected_forcefield/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 25, "laser", 50, "energy", 50, "bomb", 25, "bio", 100, "rad", 100, "fire", 100, "acid", 100]));
	return f.dot;
});

// /obj/structure/projected_forcefield/proc/Initialize  (code/game/objects/items/devices/forcefieldprojector.dm:86)
rt.def("/obj/structure/projected_forcefield/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "generator", live(f.args[1]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["mapload", "origin"] });

// /obj/structure/projected_forcefield/proc/Destroy  (code/game/objects/items/devices/forcefieldprojector.dm:90)  may sleep
rt.def("/obj/structure/projected_forcefield/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ flickers and disappears!</span>", [live(f.src)]));
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/resonator_blast.ogg"), 25, 1]);
	(rt.modField(f, rt.sv(f, "generator"), "current_fields", live(f.src), subtract));
	rt.setSv(f, "generator", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/projected_forcefield/proc/CanPass  (code/game/objects/items/devices/forcefieldprojector.dm:97)
rt.def("/obj/structure/projected_forcefield/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	if ((truthy((rt.istype(live(mover), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(mover), "checkpass", [2])))) {
		return 1;
	}
	return (!truthy(rt.sv(f, "density")) ? 1 : 0);
});

// /obj/structure/projected_forcefield/proc/play_attack_sound  (code/game/objects/items/devices/forcefieldprojector.dm:102)
rt.def("/obj/structure/projected_forcefield/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	f.vars = () => [damage_type, damage_flag];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/egloves.ogg"), 80, 1]);
	return f.dot;
});

// /obj/structure/projected_forcefield/proc/take_damage  (code/game/objects/items/devices/forcefieldprojector.dm:106)
rt.def("/obj/structure/projected_forcefield/proc/take_damage", function take_damage(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value, sound_effect: Value, attack_dir: Value) {
	f.vars = () => [damage_type, damage_flag, sound_effect];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	if (live(sound_effect) === null) {
		sound_effect = 1;
	}
	if (truthy(live(sound_effect))) {
		rt.callSrc(f, "play_attack_sound", [live(damage_amount), live(damage_type), live(damage_flag)]);
	}
	rt.setFv(f, "shield_integrity", rt.sv(f, "generator"), rt.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "shield_integrity", rt.sv(f, "generator")), live(damage_amount)), 0]));
	return f.dot;
});
