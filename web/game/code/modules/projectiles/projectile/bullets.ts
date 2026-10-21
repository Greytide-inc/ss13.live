// From code/modules/projectiles/projectile/bullets.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8808, "/obj/item/projectile/bullet/pellet", "/obj/item/projectile/bullet", {
	name: "pellet",
	damage: 12.5,
});

// /obj/item/projectile/bullet/pellet/proc/Range  (code/modules/projectiles/projectile/bullets.dm:39)  may sleep
rt.def("/obj/item/projectile/bullet/pellet/proc/Range", function* Range(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!rt.lt((rt.modSrcVar(f, "damage", -0.75, add)), 0)) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(8809, "/obj/item/projectile/bullet/pellet/weak", "/obj/item/projectile/bullet/pellet", {
	damage: 6,
});

// /obj/item/projectile/bullet/pellet/weak/proc/New  (code/modules/projectiles/projectile/bullets.dm:48)  may sleep
rt.def("/obj/item/projectile/bullet/pellet/weak/proc/New", function* New(f: Frame) {
	rt.setSv(f, "range", (yield* g.call(f, P("/proc/rand"), null, [1, 8])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/projectile/bullet/pellet/weak/proc/on_range  (code/modules/projectiles/projectile/bullets.dm:52)  may sleep
rt.def("/obj/item/projectile/bullet/pellet/weak/proc/on_range", function* on_range(f: Frame) {
	yield* g.call(f, P("/proc/do_sparks"), null, [1, 1, live(f.src)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(8810, "/obj/item/projectile/bullet/pellet/overload", "/obj/item/projectile/bullet/pellet", {
	damage: 3,
});

// /obj/item/projectile/bullet/pellet/overload/proc/New  (code/modules/projectiles/projectile/bullets.dm:59)  may sleep
rt.def("/obj/item/projectile/bullet/pellet/overload/proc/New", function* New(f: Frame) {
	rt.setSv(f, "range", (yield* g.call(f, P("/proc/rand"), null, [1, 10])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/projectile/bullet/pellet/overload/proc/on_hit  (code/modules/projectiles/projectile/bullets.dm:63)  may sleep
rt.def("/obj/item/projectile/bullet/pellet/overload/proc/on_hit", function* on_hit(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/explosion"), null, [live(f.args[0]), 0, 0, 2]);
	return f.dot;
}, true, { args: ["target", "blocked"] });

// /obj/item/projectile/bullet/pellet/overload/proc/on_range  (code/modules/projectiles/projectile/bullets.dm:67)  may sleep
rt.def("/obj/item/projectile/bullet/pellet/overload/proc/on_range", function* on_range(f: Frame) {
	yield* g.call(f, P("/proc/explosion"), null, [live(f.src), 0, 0, 2]);
	yield* g.call(f, P("/proc/do_sparks"), null, [3, 1, live(f.src)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(8816, "/obj/item/projectile/bullet/midbullet3/fire", "/obj/item/projectile/bullet/midbullet3", {});

// /obj/item/projectile/bullet/midbullet3/fire/proc/on_hit  (code/modules/projectiles/projectile/bullets.dm:91)  may sleep
rt.def("/obj/item/projectile/bullet/midbullet3/fire/proc/on_hit", function* on_hit(f: Frame, target: Value, blocked: Value) {
	let M: Value = null;
	f.vars = () => [target, blocked, M];
	if (live(blocked) === null) {
		blocked = 0;
	}
	if (!truthy((yield* g.callSuper(f, [live(target), live(blocked)])))) return f.dot;
	yield* g.callName(f, (M = live(target)), "adjust_fire_stacks", [1]);
	yield* g.callName(f, live(M), "IgniteMob", []);
	return f.dot;
}, true);

rt.type(8803, "/obj/item/projectile/bullet/incendiary", "/obj/item/projectile/bullet", {});

// /obj/item/projectile/bullet/incendiary/proc/on_hit  (code/modules/projectiles/projectile/bullets.dm:114)  may sleep
rt.def("/obj/item/projectile/bullet/incendiary/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (M = live(f.args[0])), "adjust_fire_stacks", [4]);
	yield* g.callName(f, live(M), "IgniteMob", []);
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8805, "/obj/item/projectile/bullet/incendiary/shell", "/obj/item/projectile/bullet/incendiary", {
	name: "incendiary slug",
	damage: 20,
});

// /obj/item/projectile/bullet/incendiary/shell/proc/Move  (code/modules/projectiles/projectile/bullets.dm:126)  may sleep
rt.def("/obj/item/projectile/bullet/incendiary/shell/proc/Move", function* Move(f: Frame) {
	let location: Value = null;
	f.vars = () => [location];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((location = rt.getStep(f, live(f.src), 0)))) return f.dot;
	yield* g.new_(f, T("/obj/effect/hotspot"), [live(location)]);
	yield* g.callName(f, live(location), "hotspot_expose", [700, 50, 1]);
	return f.dot;
}, true);

rt.type(8822, "/obj/item/projectile/bullet/honker", "/obj/item/projectile/bullet", {
	damage: 0,
	knockdown: 60,
	forcedodge: 1,
	nodamage: 1,
	hitsound: rt.rsc("sound/items/bikehorn.ogg"),
	icon: rt.rsc("icons/obj/hydroponics/harvest.dmi"),
	icon_state: "banana",
	range: 200,
});

// /obj/item/projectile/bullet/honker/proc/New  (code/modules/projectiles/projectile/bullets.dm:160)  may sleep
rt.def("/obj/item/projectile/bullet/honker/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "SpinAnimation");
	return f.dot;
}, true);

rt.type(8820, "/obj/item/projectile/bullet/meteorshot", "/obj/item/projectile/bullet", {
	name: "meteor",
	icon: rt.rsc("icons/obj/meteor.dmi"),
	icon_state: "dust",
	damage: 30,
	knockdown: 160,
	hitsound: rt.rsc("sound/effects/meteorimpact.ogg"),
});

// /obj/item/projectile/bullet/meteorshot/proc/on_hit  (code/modules/projectiles/projectile/bullets.dm:164)  may sleep
rt.def("/obj/item/projectile/bullet/meteorshot/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null, throw_target: Value = null;
	f.vars = () => [M, throw_target];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.args[0]), T("/atom/movable")) ? 1 : 0))) return f.dot;
	M = live(f.args[0]);
	throw_target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(M), rt.getDir(f, live(f.src), (yield* g.call(f, P("/proc/get_step_away"), null, [live(M), live(f.src)])))]));
	yield* g.callName(f, live(M), "throw_at", [live(throw_target), 3, 2]);
	return f.dot;
}, true, { args: ["target", "blocked"] });

// /obj/item/projectile/bullet/meteorshot/proc/New  (code/modules/projectiles/projectile/bullets.dm:171)  may sleep
rt.def("/obj/item/projectile/bullet/meteorshot/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "SpinAnimation");
	return f.dot;
}, true);

rt.type(8823, "/obj/item/projectile/bullet/mime", "/obj/item/projectile/bullet", {
	damage: 20,
});

// /obj/item/projectile/bullet/mime/proc/on_hit  (code/modules/projectiles/projectile/bullets.dm:179)  may sleep
rt.def("/obj/item/projectile/bullet/mime/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "silent", (M = live(f.args[0])), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "silent", live(M)), 10])));
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8824, "/obj/item/projectile/bullet/dart", "/obj/item/projectile/bullet", {
	piercing: 0,
	name: "dart",
	icon_state: "cbbolt",
	damage: 6,
});

// /obj/item/projectile/bullet/dart/proc/New  (code/modules/projectiles/projectile/bullets.dm:192)  may sleep
rt.def("/obj/item/projectile/bullet/dart/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "create_reagents", 50);
	yield* g.callName(f, rt.sv(f, "reagents"), "set_reacting", [0]);
	return f.dot;
}, true);

// /obj/item/projectile/bullet/dart/proc/on_hit  (code/modules/projectiles/projectile/bullets.dm:197)  may sleep
rt.def("/obj/item/projectile/bullet/dart/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		M = live(f.args[0]);
		if (!isEqual(live(f.args[1]), 100)) {
			if (truthy((yield* g.callName(f, live(M), "can_inject", [null, 0, rt.sv(f, "def_zone"), rt.sv(f, "piercing")])))) {
				yield* g.callSuper(f, [], rt.Args.Same);
				yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(M), 5]);
				yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(M), rt.fv(f, "total_volume", rt.sv(f, "reagents"))]);
				return 1;
			} else {
				f.args[1] = 100;
				yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＄！ was deflected!</span>", [live(f.src)]), fmt("<span class='userdanger'>You were protected against ％！!</span>", [live(f.src)])]);
			}
		}
	}
	yield* g.callSuper(f, [live(f.args[0]), live(f.args[1])]);
	yield* g.callName(f, rt.sv(f, "reagents"), "set_reacting", [1]);
	yield* g.callName(f, rt.sv(f, "reagents"), "handle_reactions", []);
	return 1;
}, true, { args: ["target", "blocked"] });

rt.type(8825, "/obj/item/projectile/bullet/dart/metalfoam", "/obj/item/projectile/bullet/dart", {});

// /obj/item/projectile/bullet/dart/metalfoam/proc/New  (code/modules/projectiles/projectile/bullets.dm:216)  may sleep
rt.def("/obj/item/projectile/bullet/dart/metalfoam/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["aluminium", 15]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["foaming_agent", 5]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["facid", 5]);
	return f.dot;
}, true);

rt.type(8827, "/obj/item/projectile/bullet/neurotoxin", "/obj/item/projectile/bullet", {
	name: "neurotoxin spit",
	icon_state: "neurotoxin",
	damage: 5,
	damage_type: "tox",
	knockdown: 100,
});

// /obj/item/projectile/bullet/neurotoxin/proc/on_hit  (code/modules/projectiles/projectile/bullets.dm:234)  may sleep
rt.def("/obj/item/projectile/bullet/neurotoxin/proc/on_hit", function* on_hit(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/alien")) ? 1 : 0))) {
		rt.setSv(f, "knockdown", 0);
		rt.setSv(f, "nodamage", 1);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8828, "/obj/item/projectile/bullet/dnainjector", "/obj/item/projectile/bullet", {
	injector: null,
	name: "１DNA injector",
	icon_state: "syringeproj",
});

// /obj/item/projectile/bullet/dnainjector/proc/on_hit  (code/modules/projectiles/projectile/bullets.dm:245)  may sleep
rt.def("/obj/item/projectile/bullet/dnainjector/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		M = live(f.args[0]);
		if (!isEqual(live(f.args[1]), 100)) {
			if (truthy((yield* g.callName(f, live(M), "can_inject", [null, 0, rt.sv(f, "def_zone"), 0])))) {
				if (truthy((yield* g.callName(f, rt.sv(f, "injector"), "inject", [live(M), rt.sv(f, "firer")])))) {
					yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "injector")]);
					rt.setSv(f, "injector", null);
					return 1;
				}
			} else {
				f.args[1] = 100;
				yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＄！ was deflected!</span>", [live(f.src)]), fmt("<span class='userdanger'>You were protected against ％！!</span>", [live(f.src)])]);
			}
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["target", "blocked"] });

// /obj/item/projectile/bullet/dnainjector/proc/Destroy  (code/modules/projectiles/projectile/bullets.dm:259)  may sleep
rt.def("/obj/item/projectile/bullet/dnainjector/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "injector")]);
	rt.setSv(f, "injector", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(8829, "/obj/item/projectile/bullet/sniper", "/obj/item/projectile/bullet", {
	breakthings: 1,
	speed: 0,
	damage: 70,
	knockdown: 100,
	dismemberment: 50,
	armour_penetration: 50,
});

// /obj/item/projectile/bullet/sniper/proc/on_hit  (code/modules/projectiles/projectile/bullets.dm:273)  may sleep
rt.def("/obj/item/projectile/bullet/sniper/proc/on_hit", function* on_hit(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if ((!isEqual(live(f.args[1]), 100) && (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])]))) && truthy(rt.sv(f, "breakthings"))))) {
		yield* g.callName(f, live(f.args[0]), "ex_act", [(yield* g.call(f, P("/proc/rand"), null, [1, 2]))]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["target", "blocked"] });

rt.type(8831, "/obj/item/projectile/bullet/sniper/gang/sleeper", "/obj/item/projectile/bullet/sniper/gang", {
	breakthings: 0,
	nodamage: 1,
	knockdown: 0,
	dismemberment: 0,
});

// /obj/item/projectile/bullet/sniper/gang/sleeper/proc/on_hit  (code/modules/projectiles/projectile/bullets.dm:290)  may sleep
rt.def("/obj/item/projectile/bullet/sniper/gang/sleeper/proc/on_hit", function* on_hit(f: Frame, target: Value, blocked: Value) {
	let L: Value = null;
	f.vars = () => [target, blocked, L];
	if (live(blocked) === null) {
		blocked = 0;
	}
	if ((!isEqual(live(blocked), 100) && truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0)))) {
		yield* g.callName(f, (L = live(target)), "blur_eyes", [8]);
		if (rt.ge(rt.fv(f, "staminaloss", live(L)), 40)) {
			yield* g.callName(f, live(L), "Sleeping", [400]);
		} else {
			yield* g.callName(f, live(L), "adjustStaminaLoss", [55]);
		}
	}
	return 1;
}, true);

rt.type(8832, "/obj/item/projectile/bullet/sniper/soporific", "/obj/item/projectile/bullet/sniper", {
	breakthings: 0,
	armour_penetration: 0,
	nodamage: 1,
	dismemberment: 0,
	knockdown: 0,
});

// /obj/item/projectile/bullet/sniper/soporific/proc/on_hit  (code/modules/projectiles/projectile/bullets.dm:307)  may sleep
rt.def("/obj/item/projectile/bullet/sniper/soporific/proc/on_hit", function* on_hit(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if ((!isEqual(live(f.args[1]), 100) && truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)))) {
		yield* g.callName(f, (L = live(f.args[0])), "Sleeping", [400]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["target", "blocked"] });

rt.type(8833, "/obj/item/projectile/bullet/sniper/haemorrhage", "/obj/item/projectile/bullet/sniper", {
	breakthings: 0,
	armour_penetration: 15,
	damage: 15,
	dismemberment: 0,
	knockdown: 0,
});

// /obj/item/projectile/bullet/sniper/haemorrhage/proc/on_hit  (code/modules/projectiles/projectile/bullets.dm:321)  may sleep
rt.def("/obj/item/projectile/bullet/sniper/haemorrhage/proc/on_hit", function* on_hit(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if ((!isEqual(live(f.args[1]), 100) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0)))) {
		yield* g.callName(f, (C = live(f.args[0])), "bleed", [100]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["target", "blocked"] });

rt.type(8836, "/obj/item/projectile/bullet/saw/bleeding", "/obj/item/projectile/bullet/saw", {
	damage: 20,
	armour_penetration: 0,
});

// /obj/item/projectile/bullet/saw/bleeding/proc/on_hit  (code/modules/projectiles/projectile/bullets.dm:350)  may sleep
rt.def("/obj/item/projectile/bullet/saw/bleeding/proc/on_hit", function* on_hit(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(!isEqual(live(f.args[1]), 100) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, (C = live(f.args[0])), "bleed", [35]);
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8839, "/obj/item/projectile/bullet/saw/incen", "/obj/item/projectile/bullet/saw", {
	damage: 7,
	armour_penetration: 0,
});

// /obj/item/projectile/bullet/saw/incen/proc/Move  (code/modules/projectiles/projectile/bullets.dm:368)  may sleep
rt.def("/obj/item/projectile/bullet/saw/incen/proc/Move", function* Move(f: Frame) {
	let location: Value = null;
	f.vars = () => [location];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((location = rt.getStep(f, live(f.src), 0)))) return f.dot;
	yield* g.new_(f, T("/obj/effect/hotspot"), [live(location)]);
	yield* g.callName(f, live(location), "hotspot_expose", [700, 50, 1]);
	return f.dot;
}, true);

// /obj/item/projectile/bullet/saw/incen/proc/on_hit  (code/modules/projectiles/projectile/bullets.dm:375)  may sleep
rt.def("/obj/item/projectile/bullet/saw/incen/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (M = live(f.args[0])), "adjust_fire_stacks", [3]);
	yield* g.callName(f, live(M), "IgniteMob", []);
	return f.dot;
}, true, { args: ["target", "blocked"] });
