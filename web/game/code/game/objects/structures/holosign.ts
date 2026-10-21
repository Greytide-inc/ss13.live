// From code/game/objects/structures/holosign.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12781, "/obj/structure/holosign", "/obj/structure", {
	projector: null,
	anchored: 1,
	name: "holo sign",
	icon: rt.rsc("icons/effects/effects.dmi"),
	obj_integrity: 1,
	max_integrity: 1,
	armor: null,
});

// /obj/structure/holosign/proc/<init>  (code/game/objects/structures/holosign.dm:10)
rt.def("/obj/structure/holosign/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 50, "laser", 50, "energy", 50, "bomb", 0, "bio", 0, "rad", 0, "fire", 20, "acid", 20]));
	return f.dot;
});

// /obj/structure/holosign/proc/New  (code/game/objects/structures/holosign.dm:15)  may sleep
rt.def("/obj/structure/holosign/proc/New", function* New(f: Frame) {
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "projector", live(f.args[1]));
		rt.modField(f, rt.sv(f, "projector"), "signs", live(f.src), add);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["loc", "source_projector"] });

// /obj/structure/holosign/proc/Destroy  (code/game/objects/structures/holosign.dm:21)  may sleep
rt.def("/obj/structure/holosign/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "projector"))) {
		(rt.modField(f, rt.sv(f, "projector"), "signs", live(f.src), subtract));
		rt.setSv(f, "projector", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/holosign/proc/attack_hand  (code/game/objects/structures/holosign.dm:26)  may sleep
rt.def("/obj/structure/holosign/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "do_attack_animation", [live(f.src), "punch"]);
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	yield* g.srcCall(f, "take_damage", 5, "brute", "melee", 1);
	return f.dot;
}, true);

// /obj/structure/holosign/proc/play_attack_sound  (code/game/objects/structures/holosign.dm:31)
rt.def("/obj/structure/holosign/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/egloves.ogg"), 80, 1]);
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/egloves.ogg"), 80, 1]);
	}
	return f.dot;
});

rt.type(12783, "/obj/structure/holosign/barrier", "/obj/structure/holosign", {
	allow_walk: 1,
	pass_flags: 32,
	name: "holo barrier",
	desc: "A short holographic barrier which can only be passed by walking.",
	icon_state: "holosign_sec",
	density: 1,
	obj_integrity: 20,
	max_integrity: 20,
});

// /obj/structure/holosign/barrier/proc/CanPass  (code/game/objects/structures/holosign.dm:54)
rt.def("/obj/structure/holosign/barrier/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value, air_group: Value) {
	let C: Value = null;
	f.vars = () => [height, air_group, C];
	if (live(height) === null) {
		height = 0;
	}
	if (live(air_group) === null) {
		air_group = 0;
	}
	if (!truthy(rt.sv(f, "density"))) {
		return 1;
	}
	if ((truthy(live(air_group)) || isEqual(live(height), 0))) {
		return 1;
	}
	if (truthy(rt.bitAnd(rt.fv(f, "pass_flags", live(mover)), 7))) {
		return 1;
	}
	if (!truthy((rt.istype(live(mover), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	C = live(mover);
	if (!(truthy(rt.sv(f, "allow_walk")) && isEqual(rt.fv(f, "m_intent", live(C)), "walk"))) return f.dot;
	return 1;
});

rt.type(12785, "/obj/structure/holosign/barrier/atmos", "/obj/structure/holosign/barrier", {
	anchored: 1,
	CanAtmosPass: 0,
	name: "holo firelock",
	desc: "A holographic barrier resembling a firelock. Though it does not prevent solid objects from passing through, gas is kept out.",
	icon_state: "holo_firelock",
	density: 0,
	layer: 4.1,
	alpha: 150,
});

// /obj/structure/holosign/barrier/atmos/proc/Initialize  (code/game/objects/structures/holosign.dm:80)
rt.def("/obj/structure/holosign/barrier/atmos/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "air_update_turf", [1]);
	return f.dot;
});

// /obj/structure/holosign/barrier/atmos/proc/Destroy  (code/game/objects/structures/holosign.dm:84)  may sleep
rt.def("/obj/structure/holosign/barrier/atmos/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	_T = rt.getStep(f, live(f.src), 0);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, live(_T), "air_update_turf", [1]);
	return f.dot;
}, true);

rt.type(12786, "/obj/structure/holosign/barrier/cyborg", "/obj/structure/holosign/barrier", {
	allow_walk: 0,
	name: "Energy Field",
	desc: "A fragile energy field that blocks movement. Excels at blocking lethal projectiles.",
	density: 1,
	obj_integrity: 10,
	max_integrity: 10,
});

// /obj/structure/holosign/barrier/cyborg/proc/bullet_act  (code/game/objects/structures/holosign.dm:97)  may sleep
rt.def("/obj/structure/holosign/barrier/cyborg/proc/bullet_act", function* bullet_act(f: Frame, _P: Value) {
	f.vars = () => [_P];
	yield* g.srcCall(f, "take_damage", divide(rt.fv(f, "damage", live(_P)), 5), "brute", "melee", 1);
	if (truthy((rt.istype(live(_P), T("/obj/item/projectile/energy/electrode")) ? 1 : 0))) {
		yield* g.srcCall(f, "take_damage", 10, "brute", "melee", 1);
	}
	if (!truthy((rt.istype(live(_P), T("/obj/item/projectile/beam/disabler")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "take_damage", 5, "brute", "melee", 1);
	return f.dot;
}, true);

rt.type(12787, "/obj/structure/holosign/barrier/cyborg/hacked", "/obj/structure/holosign/barrier/cyborg", {
	shockcd: 0,
	name: "Charged Energy Field",
	desc: "A powerful energy field that blocks movement. Energy arcs off it",
	obj_integrity: 20,
	max_integrity: 20,
});

// /obj/structure/holosign/barrier/cyborg/hacked/proc/bullet_act  (code/game/objects/structures/holosign.dm:111)  may sleep
rt.def("/obj/structure/holosign/barrier/cyborg/hacked/proc/bullet_act", function* bullet_act(f: Frame, _P: Value) {
	f.vars = () => [_P];
	yield* g.srcCall(f, "take_damage", rt.fv(f, "damage", live(_P)), "brute", "melee", 1);
	return f.dot;
}, true);

// /obj/structure/holosign/barrier/cyborg/hacked/proc/attack_hand  (code/game/objects/structures/holosign.dm:117)  may sleep
rt.def("/obj/structure/holosign/barrier/cyborg/hacked/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let M: Value = null;
	f.vars = () => [user, M];
	if (truthy(rt.sv(f, "shockcd"))) return f.dot;
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(user)])))) return f.dot;
	yield* g.callName(f, (M = live(user)), "electrocute_act", [null, 15, null, "Energy Barrier", "safety", 1], rt.Args.Named);
	rt.setSv(f, "shockcd", 1);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/holosign/barrier/cyborg/hacked/proc/cooldown")])), 5]);
	return f.dot;
}, true);

// /obj/structure/holosign/barrier/cyborg/hacked/proc/Bumped  (code/game/objects/structures/holosign.dm:125)  may sleep
rt.def("/obj/structure/holosign/barrier/cyborg/hacked/proc/Bumped", function* Bumped(f: Frame, user: Value) {
	let M: Value = null;
	f.vars = () => [user, M];
	if (truthy(rt.sv(f, "shockcd"))) return f.dot;
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(user)])))) return f.dot;
	yield* g.callName(f, (M = live(user)), "electrocute_act", [null, 15, null, "Energy Barrier", "safety", 1], rt.Args.Named);
	rt.setSv(f, "shockcd", 1);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/holosign/barrier/cyborg/hacked/proc/cooldown")])), 5]);
	return f.dot;
}, true);
