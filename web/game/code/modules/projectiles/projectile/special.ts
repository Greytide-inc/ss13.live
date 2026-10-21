// From code/modules/projectiles/projectile/special.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8916, "/obj/item/projectile/ion", "/obj/item/projectile", {
	damage: 0,
	damage_type: "fire",
	nodamage: 1,
	flag: "energy",
	name: "ion bolt",
	icon_state: "ion",
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/ion"),
});

// /obj/item/projectile/ion/proc/on_hit  (code/modules/projectiles/projectile/special.dm:12)  may sleep
rt.def("/obj/item/projectile/ion/proc/on_hit", function* on_hit(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/empulse"), null, [live(f.args[0]), 1, 1]);
	return 1;
}, true, { args: ["target", "blocked"] });

rt.type(8917, "/obj/item/projectile/ion/weak", "/obj/item/projectile/ion", {});

// /obj/item/projectile/ion/weak/proc/on_hit  (code/modules/projectiles/projectile/special.dm:20)  may sleep
rt.def("/obj/item/projectile/ion/weak/proc/on_hit", function* on_hit(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/empulse"), null, [live(f.args[0]), 0, 0]);
	return 1;
}, true, { args: ["target", "blocked"] });

rt.type(8840, "/obj/item/projectile/bullet/gyro", "/obj/item/projectile/bullet", {
	name: "explosive bolt",
	icon_state: "bolter",
	damage: 50,
});

// /obj/item/projectile/bullet/gyro/proc/on_hit  (code/modules/projectiles/projectile/special.dm:31)  may sleep
rt.def("/obj/item/projectile/bullet/gyro/proc/on_hit", function* on_hit(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/explosion"), null, [live(f.args[0]), -1, 0, 2]);
	return 1;
}, true, { args: ["target", "blocked"] });

rt.type(8841, "/obj/item/projectile/bullet/a40mm", "/obj/item/projectile/bullet", {
	name: "40mm grenade",
	desc: "USE A WEEL GUN",
	icon_state: "bolter",
	damage: 60,
});

// /obj/item/projectile/bullet/a40mm/proc/on_hit  (code/modules/projectiles/projectile/special.dm:42)  may sleep
rt.def("/obj/item/projectile/bullet/a40mm/proc/on_hit", function* on_hit(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/explosion"), null, [null, live(f.args[0]), null, -1, null, 0, null, 2, null, 1, null, 0, "flame_range", 3], rt.Args.Named);
	return 1;
}, true, { args: ["target", "blocked"] });

rt.type(8842, "/obj/item/projectile/bullet/a84mm", "/obj/item/projectile/bullet", {
	anti_armour_damage: 200,
	name: "anti-armour rocket",
	desc: "USE A WEEL GUN",
	icon_state: "atrocket",
	damage: 80,
	armour_penetration: 100,
	dismemberment: 100,
});

// /obj/item/projectile/bullet/a84mm/proc/on_hit  (code/modules/projectiles/projectile/special.dm:56)  may sleep
rt.def("/obj/item/projectile/bullet/a84mm/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null, S: Value = null;
	f.vars = () => [M, S];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/explosion"), null, [null, live(f.args[0]), null, -1, null, 1, null, 3, null, 1, null, 0, "flame_range", 4], rt.Args.Named);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/mecha")) ? 1 : 0))) {
		yield* g.callName(f, (M = live(f.args[0])), "take_damage", [rt.sv(f, "anti_armour_damage")]);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon")) ? 1 : 0))) {
		yield* g.callName(f, (S = live(f.args[0])), "take_overall_damage", [multiply(rt.sv(f, "anti_armour_damage"), 0.75), multiply(rt.sv(f, "anti_armour_damage"), 0.25)]);
	}
	return 1;
}, true, { args: ["target", "blocked"] });

rt.type(8843, "/obj/item/projectile/bullet/srmrocket", "/obj/item/projectile/bullet", {
	name: "SRM-8 Rocket",
	desc: "Boom",
	icon_state: "missile",
	damage: 30,
});

// /obj/item/projectile/bullet/srmrocket/proc/on_hit  (code/modules/projectiles/projectile/special.dm:74)  may sleep
rt.def("/obj/item/projectile/bullet/srmrocket/proc/on_hit", function* on_hit(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/explosion"), null, [live(f.args[0]), 0, 1, 2, 4]);
	} else {
		yield* g.call(f, P("/proc/explosion"), null, [live(f.args[0]), 0, 0, 2, 4]);
	}
	return 1;
}, true, { args: ["target", "blocked"] });

rt.type(8899, "/obj/item/projectile/temp", "/obj/item/projectile", {
	temperature: 100,
	name: "freeze beam",
	icon_state: "ice_2",
	damage: 0,
	damage_type: "fire",
	nodamage: 1,
	flag: "energy",
});

// /obj/item/projectile/temp/proc/on_hit  (code/modules/projectiles/projectile/special.dm:92)  may sleep
rt.def("/obj/item/projectile/temp/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		rt.setFv(f, "bodytemperature", (M = live(f.args[0])), rt.sv(f, "temperature"));
	}
	return 1;
}, true, { args: ["target", "blocked"] });

rt.type(8918, "/obj/item/projectile/meteor", "/obj/item/projectile", {
	damage: 0,
	damage_type: "brute",
	nodamage: 1,
	flag: "bullet",
	name: "meteor",
	icon: rt.rsc("icons/obj/meteor.dmi"),
	icon_state: "small1",
});

// /obj/item/projectile/meteor/proc/Bump  (code/modules/projectiles/projectile/special.dm:112)  may sleep
rt.def("/obj/item/projectile/meteor/proc/Bump", function* Bump(f: Frame, A: Value, yes: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [A, yes, M, $e];
	if (!truthy(live(yes))) {
		return live(f.dot);
	}
	if (isEqual(live(A), rt.sv(f, "firer"))) {
		rt.setSv(f, "loc", rt.fv(f, "loc", live(A)));
		return live(f.dot);
	}
	yield* g.callName(f, live(A), "ex_act", [2]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/meteorimpact.ogg"), 40, 1]);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/urange"), null, [10, live(f.src)])), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (!truthy(rt.fv(f, "stat", live(M)))) {
			yield* g.call(f, P("/proc/shake_camera"), null, [live(M), 3, 1]);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(8860, "/obj/item/projectile/energy/floramut", "/obj/item/projectile/energy", {
	name: "alpha somatoray",
	icon_state: "energy",
	damage: 0,
	damage_type: "tox",
	nodamage: 1,
	flag: "energy",
});

// /obj/item/projectile/energy/floramut/proc/on_hit  (code/modules/projectiles/projectile/special.dm:133)  may sleep
rt.def("/obj/item/projectile/energy/floramut/proc/on_hit", function* on_hit(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	if (!isEqual(rt.gv(f, "id", rt.gv(f, "species", rt.gv(f, "dna", (C = live(f.args[0]))))), "pod")) return f.dot;
	yield* g.callName(f, live(C), "randmuti", []);
	yield* g.callName(f, live(C), "randmut", []);
	yield* g.callName(f, live(C), "updateappearance", []);
	yield* g.callName(f, live(C), "domutcheck", []);
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8887, "/obj/item/projectile/beam/mindflayer", "/obj/item/projectile/beam", {
	name: "flayer ray",
});

// /obj/item/projectile/beam/mindflayer/proc/on_hit  (code/modules/projectiles/projectile/special.dm:154)  may sleep
rt.def("/obj/item/projectile/beam/mindflayer/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (M = live(f.args[0])), "adjustBrainLoss", [20]);
	rt.modField(f, live(M), "hallucination", 20, add);
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8716, "/obj/item/ammo_casing/energy/wormhole", "/obj/item/ammo_casing/energy", {
	gun: null,
	e_cost: 0,
	select_name: "blue",
	projectile_type: rt.typePath("/obj/item/projectile/beam/wormhole"),
	fire_sound: rt.rsc("sound/weapons/pulse3.ogg"),
});

// /obj/item/ammo_casing/energy/wormhole/proc/New  (code/modules/projectiles/projectile/special.dm:177)
rt.def("/obj/item/ammo_casing/energy/wormhole/proc/New", function New(f: Frame, wh: Value) {
	rt.setSv(f, "gun", live(wh));
	return f.dot;
});

rt.type(8888, "/obj/item/projectile/beam/wormhole", "/obj/item/projectile/beam", {
	gun: null,
	name: "bluespace beam",
	icon_state: "spark",
	hitsound: "sparks",
	damage: 3,
	color: "#33CCFF",
});

// /obj/item/projectile/beam/wormhole/proc/on_hit  (code/modules/projectiles/projectile/special.dm:180)  may sleep
rt.def("/obj/item/projectile/beam/wormhole/proc/on_hit", function* on_hit(f: Frame) {
	let portal_destination: Value = null;
	f.vars = () => [portal_destination];
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])])))) {
		portal_destination = rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/orange"), null, [6, live(f.src)]))]);
		yield* g.call(f, P("/proc/do_teleport"), null, [live(f.args[0]), live(portal_destination)]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (!truthy(rt.sv(f, "gun"))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	yield* g.callName(f, rt.sv(f, "gun"), "create_portal", [live(f.src), rt.getStep(f, live(f.src), 0)]);
	return f.dot;
}, true, { args: ["target"] });

rt.type(8844, "/obj/item/projectile/bullet/frag12", "/obj/item/projectile/bullet", {
	name: "explosive slug",
	damage: 25,
	knockdown: 50,
});

// /obj/item/projectile/bullet/frag12/proc/on_hit  (code/modules/projectiles/projectile/special.dm:194)  may sleep
rt.def("/obj/item/projectile/bullet/frag12/proc/on_hit", function* on_hit(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/explosion"), null, [live(f.args[0]), -1, 0, 1]);
	return 1;
}, true, { args: ["target", "blocked"] });

rt.type(8919, "/obj/item/projectile/plasma", "/obj/item/projectile", {
	mine_range: 3,
	damage_type: "brute",
	damage: 5,
	range: 4,
	dismemberment: 20,
	name: "plasma blast",
	icon_state: "plasmacutter",
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/purple_laser"),
});

// /obj/item/projectile/plasma/proc/Initialize  (code/modules/projectiles/projectile/special.dm:209)  may sleep
rt.def("/obj/item/projectile/plasma/proc/Initialize", function* Initialize(f: Frame) {
	let proj_turf: Value = null, environment: Value = null, pressure: Value = null;
	f.vars = () => [proj_turf, environment, pressure];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(proj_turf = rt.getStep(f, live(f.src), 0))])))) {
		return live(f.dot);
	}
	if (!truthy((environment = (yield* g.callName(f, live(proj_turf), "return_air", []))))) return f.dot;
	if (!rt.lt((pressure = (yield* g.callName(f, live(environment), "return_pressure", []))), 60)) return f.dot;
	rt.setSv(f, "name", fmt("full strength ＀", [rt.sv(f, "name")]));
	(rt.modSrcVar(f, "damage", 4, multiply));
	return f.dot;
}, true);

// /obj/item/projectile/plasma/proc/on_hit  (code/modules/projectiles/projectile/special.dm:221)  may sleep
rt.def("/obj/item/projectile/plasma/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.args[0]), T("/turf/closed/mineral")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (M = live(f.args[0])), "gets_drilled", [rt.sv(f, "firer")]);
	if (truthy(rt.sv(f, "mine_range"))) {
		rt.incSrcVar(f, "mine_range", -1, true);
		rt.incSrcVar(f, "range", 1, true);
	}
	if (!rt.gt(rt.sv(f, "range"), 0)) return f.dot;
	return -1;
}, true, { args: ["target"] });

rt.type(8923, "/obj/item/projectile/gravityrepulse", "/obj/item/projectile", {
	T: null,
	power: 4,
	thrown_items: null,
	damage: 0,
	damage_type: "brute",
	nodamage: 1,
	name: "repulsion bolt",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "chronofield",
	hitsound: rt.rsc("sound/weapons/wave.ogg"),
	color: "#33CCFF",
});

// /obj/item/projectile/gravityrepulse/proc/<init>  (code/modules/projectiles/projectile/special.dm:260)
rt.def("/obj/item/projectile/gravityrepulse/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "thrown_items", rt.list());
	return f.dot;
});

// /obj/item/projectile/gravityrepulse/proc/Initialize  (code/modules/projectiles/projectile/special.dm:263)  may sleep
rt.def("/obj/item/projectile/gravityrepulse/proc/Initialize", function* Initialize(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype((C = rt.sv(f, "loc")), T("/obj/item/ammo_casing/energy/gravityrepulse")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "power", (yield* g.call(f, P("/proc/min"), null, [rt.gv(f, "power", rt.fv(f, "gun", live(C))), 15])));
	return f.dot;
}, true);

// /obj/item/projectile/gravityrepulse/proc/on_hit  (code/modules/projectiles/projectile/special.dm:269)  may sleep
rt.def("/obj/item/projectile/gravityrepulse/proc/on_hit", function* on_hit(f: Frame) {
	let A: Value = null, throwtarget: Value = null, F: Value = null;
	let $e: any;
	f.vars = () => [A, throwtarget, F, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "T", rt.getStep(f, live(f.src), 0));
	A = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "T"), rt.sv(f, "power")])), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if ((((isEqual(live(A), live(f.src)) || (truthy(rt.sv(f, "firer")) && isEqual(live(A), rt.fv(f, "firer", live(f.src))))) || truthy(rt.fv(f, "anchored", live(A)))) || truthy(rt.index(rt.sv(f, "thrown_items"), live(A))))) {
			continue;
		}
		throwtarget = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(f.src), rt.getDir(f, live(f.src), (yield* g.call(f, P("/proc/get_step_away"), null, [live(A), live(f.src)])))]));
		yield* g.callName(f, live(A), "throw_at", [live(throwtarget), add(rt.sv(f, "power"), 1), 1]);
		rt.setAt(rt.sv(f, "thrown_items"), live(A), live(A));
	}
	rt.endFor(f, 0);
	F = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "T"), rt.sv(f, "power")])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		yield* g.new_(f, T("/obj/effect/temp_visual/gravpush"), [live(F)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(8924, "/obj/item/projectile/gravityattract", "/obj/item/projectile", {
	T: null,
	power: 4,
	thrown_items: null,
	damage: 0,
	damage_type: "brute",
	nodamage: 1,
	name: "attraction bolt",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "chronofield",
	hitsound: rt.rsc("sound/weapons/wave.ogg"),
	color: "#FF6600",
});

// /obj/item/projectile/gravityattract/proc/<init>  (code/modules/projectiles/projectile/special.dm:291)
rt.def("/obj/item/projectile/gravityattract/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "thrown_items", rt.list());
	return f.dot;
});

// /obj/item/projectile/gravityattract/proc/Initialize  (code/modules/projectiles/projectile/special.dm:294)  may sleep
rt.def("/obj/item/projectile/gravityattract/proc/Initialize", function* Initialize(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype((C = rt.sv(f, "loc")), T("/obj/item/ammo_casing/energy/gravityattract")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "power", (yield* g.call(f, P("/proc/min"), null, [rt.gv(f, "power", rt.fv(f, "gun", live(C))), 15])));
	return f.dot;
}, true);

// /obj/item/projectile/gravityattract/proc/on_hit  (code/modules/projectiles/projectile/special.dm:300)  may sleep
rt.def("/obj/item/projectile/gravityattract/proc/on_hit", function* on_hit(f: Frame) {
	let A: Value = null, F: Value = null;
	let $e: any;
	f.vars = () => [A, F, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "T", rt.getStep(f, live(f.src), 0));
	A = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "T"), rt.sv(f, "power")])), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if ((((isEqual(live(A), live(f.src)) || (truthy(rt.sv(f, "firer")) && isEqual(live(A), rt.fv(f, "firer", live(f.src))))) || truthy(rt.fv(f, "anchored", live(A)))) || truthy(rt.index(rt.sv(f, "thrown_items"), live(A))))) {
			continue;
		}
		yield* g.callName(f, live(A), "throw_at", [rt.sv(f, "T"), add(rt.sv(f, "power"), 1), 1]);
		rt.setAt(rt.sv(f, "thrown_items"), live(A), live(A));
	}
	rt.endFor(f, 0);
	F = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "T"), rt.sv(f, "power")])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		yield* g.new_(f, T("/obj/effect/temp_visual/gravpush"), [live(F)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(8925, "/obj/item/projectile/gravitychaos", "/obj/item/projectile", {
	T: null,
	power: 4,
	thrown_items: null,
	damage: 0,
	damage_type: "brute",
	nodamage: 1,
	name: "gravitational blast",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "chronofield",
	hitsound: rt.rsc("sound/weapons/wave.ogg"),
	color: "#101010",
});

// /obj/item/projectile/gravitychaos/proc/<init>  (code/modules/projectiles/projectile/special.dm:321)
rt.def("/obj/item/projectile/gravitychaos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "thrown_items", rt.list());
	return f.dot;
});

// /obj/item/projectile/gravitychaos/proc/Initialize  (code/modules/projectiles/projectile/special.dm:324)  may sleep
rt.def("/obj/item/projectile/gravitychaos/proc/Initialize", function* Initialize(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype((C = rt.sv(f, "loc")), T("/obj/item/ammo_casing/energy/gravitychaos")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "power", (yield* g.call(f, P("/proc/min"), null, [rt.gv(f, "power", rt.fv(f, "gun", live(C))), 15])));
	return f.dot;
}, true);

// /obj/item/projectile/gravitychaos/proc/on_hit  (code/modules/projectiles/projectile/special.dm:330)  may sleep
rt.def("/obj/item/projectile/gravitychaos/proc/on_hit", function* on_hit(f: Frame) {
	let A: Value = null, Z: Value = null;
	let $e: any;
	f.vars = () => [A, Z, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "T", rt.getStep(f, live(f.src), 0));
	A = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "T"), rt.sv(f, "power")])), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if ((((isEqual(live(A), live(f.src)) || (truthy(rt.sv(f, "firer")) && isEqual(live(A), rt.fv(f, "firer", live(f.src))))) || truthy(rt.fv(f, "anchored", live(A)))) || truthy(rt.index(rt.sv(f, "thrown_items"), live(A))))) {
			continue;
		}
		yield* g.callName(f, live(A), "throw_at", [(yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(A), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])])), add(rt.sv(f, "power"), 1), 1]);
		rt.setAt(rt.sv(f, "thrown_items"), live(A), live(A));
	}
	rt.endFor(f, 0);
	Z = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "T"), rt.sv(f, "power")])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Z = $e;
		yield* g.new_(f, T("/obj/effect/temp_visual/gravpush"), [live(Z)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
