// From code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5025, "/mob/living/simple_animal/hostile/megafauna/dragon", "/mob/living/simple_animal/hostile/megafauna", {
	swooping: 0,
	swoop_cooldown: 0,
	move_to_delay: 10,
	ranged: 1,
	name: "ash drake",
	desc: "Guardians of the necropolis.",
	health: 2500,
	maxHealth: 2500,
	attacktext: "chomps",
	attack_sound: rt.rsc("sound/magic/demon_attack1.ogg"),
	icon_state: "dragon",
	icon_living: "dragon",
	icon_dead: "dragon_dead",
	friendly: "stares down",
	icon: rt.rsc("icons/mob/lavaland/64x64megafauna.dmi"),
	speak_emote: null,
	armour_penetration: 40,
	melee_damage_lower: 40,
	melee_damage_upper: 40,
	speed: 1,
	pixel_x: -16,
	crusher_loot: null,
	loot: null,
	butcher_results: null,
	medal_type: "Drake",
	score_type: "Drakes Killed",
	deathmessage: "collapses into a pile of bones, its flesh sloughing away.",
	death_sound: rt.rsc("sound/magic/demon_dies.ogg"),
});

// /mob/living/simple_animal/hostile/megafauna/dragon/proc/<init>  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:46)
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("roars"));
	$0 = $0;
	rt.setSv(f, "crusher_loot", rt.list(T("/obj/structure/closet/crate/necropolis/dragon/crusher")));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/structure/closet/crate/necropolis/dragon")));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/ore/diamond"), 5, T("/obj/item/stack/sheet/sinew"), 5, T("/obj/item/stack/sheet/animalhide/ashdrake"), 10, T("/obj/item/stack/sheet/bone"), 30]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/megafauna/dragon/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:65)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "internal", (yield* g.new_(f, T("/obj/item/device/gps/internal/dragon"), [live(f.src)])));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/dragon/proc/ex_act  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:69)
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/ex_act", function ex_act(f: Frame) {
	if (isEqual(live(f.args[0]), 3)) {
		return live(f.dot);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["severity", "target"], waitfor: false });

// /mob/living/simple_animal/hostile/megafauna/dragon/proc/adjustHealth  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:74)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if ((!truthy(live(f.args[2])) && truthy(rt.bitAnd(rt.sv(f, "swooping"), 2)))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["amount", "updating_health", "forced"] });

// /mob/living/simple_animal/hostile/megafauna/dragon/proc/visible_message  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:79)
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/visible_message", function visible_message(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "swooping"), 2))) {
		return live(f.dot);
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /mob/living/simple_animal/hostile/megafauna/dragon/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:84)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (truthy(rt.sv(f, "swooping"))) return f.dot;
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/megafauna/dragon/proc/DestroySurroundings  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:88)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/DestroySurroundings", function* DestroySurroundings(f: Frame) {
	if (truthy(rt.sv(f, "swooping"))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/dragon/proc/Move  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:92)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/Move", function* Move(f: Frame) {
	if (truthy(rt.sv(f, "swooping"))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/dragon/proc/Goto  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:96)
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/Goto", function Goto(f: Frame) {
	if (truthy(rt.sv(f, "swooping"))) return f.dot;
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["target", "delay", "minimum_distance"] });

// /mob/living/simple_animal/hostile/megafauna/dragon/proc/OpenFire  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:105)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/OpenFire", function* OpenFire(f: Frame) {
	if (truthy(rt.sv(f, "swooping"))) {
		return live(f.dot);
	}
	rt.setSv(f, "anger_modifier", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [divide(subtract(rt.sv(f, "maxHealth"), rt.sv(f, "health")), 50), 20]))])));
	rt.setSv(f, "ranged_cooldown", add(rt.worldTime(f), rt.sv(f, "ranged_cooldown_time")));
	if ((truthy(rt.op(f, "Prob", [], [add(15, rt.sv(f, "anger_modifier"))])) && !truthy(rt.sv(f, "client")))) {
		if (rt.lt(rt.sv(f, "health"), divide(rt.sv(f, "maxHealth"), 2))) {
			yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/dragon/proc/swoop_attack"), 1, null, 50]);
		} else {
			yield* g.srcCall(f, "fire_rain");
		}
	} else {
		if ((truthy(rt.op(f, "Prob", [], [add(10, rt.sv(f, "anger_modifier"))])) && !truthy(rt.sv(f, "client")))) {
			if (rt.gt(rt.sv(f, "health"), divide(rt.sv(f, "maxHealth"), 2))) {
				yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/dragon/proc/swoop_attack")]);
			} else {
				yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/dragon/proc/triple_swoop")]);
			}
		} else {
			yield* g.srcCall(f, "fire_walls");
		}
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/dragon/proc/fire_rain  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:123)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/fire_rain", function* fire_rain(f: Frame) {
	let turf: Value = null;
	let $e: any;
	f.vars = () => [turf, $e];
	if (!truthy(rt.sv(f, "target"))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "target"), "visible_message", ["<span class='boldwarning'>Fire rains from the sky!</span>"]);
	turf = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [9, rt.getStep(f, rt.sv(f, "target"), 0)])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		turf = $e;
		if (truthy(rt.op(f, "Prob", [], [11]))) {
			yield* g.new_(f, T("/obj/effect/temp_visual/target"), [live(turf)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/dragon/proc/fire_walls  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:131)
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/fire_walls", function fire_walls(f: Frame) {
	let d: Value = null;
	let $e: any;
	f.vars = () => [d, $e];
	rt.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/magic/fireball.ogg"), 200, 1]);
	d = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		d = $e;
		rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/dragon/proc/fire_wall"), live(d)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/simple_animal/hostile/megafauna/dragon/proc/fire_wall  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:137)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/fire_wall", function* fire_wall(f: Frame, dir: Value) {
	let hit_things: Value = null, E: Value = null, range: Value = null, previousturf: Value = null, J: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [dir, hit_things, E, range, previousturf, J, L, $e];
	hit_things = rt.list(live(f.src));
	E = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(f.src), live(dir)]));
	range = 10;
	previousturf = rt.getStep(f, live(f.src), 0);
	J = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/getline"), null, [live(f.src), live(E)])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		J = $e;
		if ((!truthy(live(range)) || (!isEqual(live(J), live(previousturf)) && (!truthy(rt.fv(f, "atmos_adjacent_turfs", live(previousturf))) || !truthy(rt.index(rt.fv(f, "atmos_adjacent_turfs", live(previousturf)), live(J))))))) {
			break;
		}
		range = rt.inc(live(range), -1);
		yield* g.new_(f, T("/obj/effect/hotspot"), [live(J)]);
		yield* g.callName(f, live(J), "hotspot_expose", [700, 50, 1]);
		L = null;
		rt.forList(f, 1, subtract(rt.fv(f, "contents", live(J)), live(hit_things)), T("/mob/living"));
		while (($e = rt.next(f, 1)) !== undefined) {
			L = $e;
			if (truthy((rt.istype(live(L), T("/mob/living/simple_animal/hostile/megafauna/dragon")) ? 1 : 0))) {
				continue;
			}
			yield* g.callName(f, live(L), "adjustFireLoss", [20]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='userdanger'>You're hit by the drake's fire breath!</span>"]);
			hit_things = rt.modify(live(hit_things), live(L), add);
		}
		rt.endFor(f, 1);
		previousturf = live(J);
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/dragon/proc/triple_swoop  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:157)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/triple_swoop", function* triple_swoop(f: Frame) {
	yield* g.callSrc(f, "swoop_attack", ["swoop_duration", 30], rt.Args.Named);
	yield* g.callSrc(f, "swoop_attack", ["swoop_duration", 30], rt.Args.Named);
	yield* g.callSrc(f, "swoop_attack", ["swoop_duration", 30], rt.Args.Named);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/dragon/proc/swoop_attack  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:162)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/swoop_attack", function* swoop_attack(f: Frame, fire_rain: Value, manual_target: Value, swoop_duration: Value) {
	let negative: Value = null, initial_x: Value = null, F: Value = null, oldtransform: Value = null, i: Value = null, flame_hit: Value = null, L: Value = null, swoop_speed: Value = null, throw_dir: Value = null, throwtarget: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [fire_rain, manual_target, swoop_duration, negative, initial_x, F, oldtransform, i, flame_hit, L, swoop_speed, throw_dir, throwtarget, M, $e];
	if (live(swoop_duration) === null) {
		swoop_duration = 40;
	}
	if ((truthy(rt.sv(f, "stat")) || truthy(rt.sv(f, "swooping")))) {
		return live(f.dot);
	}
	if (truthy(live(manual_target))) {
		rt.setSv(f, "target", live(manual_target));
	}
	if (!truthy(rt.sv(f, "target"))) {
		return live(f.dot);
	}
	rt.setSv(f, "swoop_cooldown", add(rt.worldTime(f), 200));
	rt.setSv(f, "stop_automated_movement", 1);
	(rt.modSrcVar(f, "swooping", 1, rt.bitOr));
	rt.setSv(f, "density", 0);
	rt.setSv(f, "icon_state", "shadow");
	yield* g.srcCall(f, "visible_message", fmt("<span class='boldwarning'>＀ swoops up high!</span>", [live(f.src)]));
	negative = null;
	initial_x = rt.sv(f, "x");
	if (rt.lt(rt.fv(f, "x", rt.sv(f, "target")), live(initial_x))) {
		negative = 1;
	} else {
		if (rt.gt(rt.fv(f, "x", rt.sv(f, "target")), live(initial_x))) {
			negative = 0;
		} else {
			if (isEqual(rt.fv(f, "x", rt.sv(f, "target")), live(initial_x))) {
				negative = rt.op(f, "Prob", [], [50]);
			}
		}
	}
	F = (yield* g.new_(f, T("/obj/effect/temp_visual/dragon_flight"), [rt.sv(f, "loc"), live(negative)]));
	negative = (!truthy(live(negative)) ? 1 : 0);
	oldtransform = rt.sv(f, "transform");
	rt.setSv(f, "alpha", 255);
	rt.op(f, "Animate", [2, 10], [null, live(f.src), "alpha", 204, "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 0.8999999761581421), "time", 3, "easing", 4]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.call(f, P("/proc/sleep"), null, [1]);
		if (((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || isEqual(rt.sv(f, "stat"), 2))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(F)]);
			(rt.modSrcVar(f, "swooping", 16777214, rt.bitAnd));
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "alpha", 100, "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 0.699999988079071), "time", 7]);
	(rt.modSrcVar(f, "swooping", 2, rt.bitOr));
	rt.setSv(f, "mouse_opacity", 0);
	yield* g.call(f, P("/proc/sleep"), null, [7]);
	flame_hit = rt.list();
	while (rt.gt(live(swoop_duration), 0)) {
		if ((!truthy(rt.sv(f, "target")) && !truthy((yield* g.srcCall(f, "FindTarget"))))) {
			break;
		}
		if (rt.lt(live(swoop_duration), 7)) {
			fire_rain = 0;
		}
		if (isEqual(rt.sv(f, "loc"), rt.getStep(f, rt.sv(f, "target"), 0))) {
			if (!truthy(live(fire_rain))) {
				break;
			}
			if (truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0))) {
				if (isEqual(rt.gv(f, "stat", (L = rt.sv(f, "target"))), 2)) {
					break;
				}
			}
		}
		if (truthy(live(fire_rain))) {
			yield* g.new_(f, T("/obj/effect/temp_visual/target"), [rt.sv(f, "loc"), live(flame_hit)]);
		}
		yield* g.srcCall(f, "forceMove", rt.getStep(f, live(f.src), rt.getDir(f, live(f.src), rt.sv(f, "target"))));
		if (isEqual(rt.sv(f, "loc"), rt.getStep(f, rt.sv(f, "target"), 0))) {
			if (!truthy(live(fire_rain))) {
				break;
			}
			if (truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0))) {
				if (isEqual(rt.gv(f, "stat", (L = rt.sv(f, "target"))), 2)) {
					break;
				}
			}
		}
		(swoop_duration = rt.modify(live(swoop_duration), (swoop_speed = 1.5), subtract));
		yield* g.call(f, P("/proc/sleep"), null, [live(swoop_speed)]);
	}
	if (truthy(live(negative))) {
		if (truthy((yield* g.call(f, P("/proc/IsInRange"), null, [rt.sv(f, "x"), add(live(initial_x), 1), add(live(initial_x), 5)])))) {
			negative = 0;
		}
	} else {
		if (truthy((yield* g.call(f, P("/proc/IsInRange"), null, [rt.sv(f, "x"), subtract(live(initial_x), 5), subtract(live(initial_x), 1)])))) {
			negative = 1;
		}
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/dragon_flight/end"), [rt.sv(f, "loc"), live(negative)]);
	yield* g.new_(f, T("/obj/effect/temp_visual/dragon_swoop"), [rt.sv(f, "loc")]);
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "alpha", 255, "transform", live(oldtransform), "time", 5]);
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	(rt.modSrcVar(f, "swooping", 16777213, rt.bitAnd));
	rt.setSv(f, "mouse_opacity", rt.initial(f, live(f.src), "mouse_opacity"));
	rt.setSv(f, "icon_state", "dragon");
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/meteorimpact.ogg"), 200, 1]);
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [1, live(f.src)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy(rt.fv(f, "stat", live(L)))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ slams down on ＀, crushing them!</span>", [live(f.src), live(L)]));
			yield* g.callName(f, live(L), "gib", []);
		} else {
			yield* g.callName(f, live(L), "adjustBruteLoss", [75]);
			if ((truthy(live(L)) && !(!truthy(live(L)) || truthy(rt.fv(f, "gc_destroyed", live(L)))))) {
				throw_dir = rt.getDir(f, live(f.src), live(L));
				if (isEqual(rt.fv(f, "loc", live(L)), rt.sv(f, "loc"))) {
					throw_dir = rt.op(f, "PickUnweighted", [1], [rt.gl("alldirs")]);
				}
				throwtarget = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(f.src), live(throw_dir)]));
				yield* g.callName(f, live(L), "throw_at", [live(throwtarget), 3]);
				yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ is thrown clear of ＀!</span>", [live(L), live(f.src)]));
			}
		}
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [7, live(f.src)])), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.call(f, P("/proc/shake_camera"), null, [live(M), 15, 1]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "density", 1);
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	(rt.modSrcVar(f, "swooping", 16777214, rt.bitAnd));
	yield* g.srcCall(f, "SetRecoveryTime", 5);
	return f.dot;
}, true, { argTypes: [{  }, { path: "/atom/movable" }, {  }] });

// /mob/living/simple_animal/hostile/megafauna/dragon/proc/AltClickOn  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:265)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/AltClickOn", function* AltClickOn(f: Frame, A: Value) {
	f.vars = () => [A];
	if (!truthy((rt.istype(live(A), T("/atom/movable")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (rt.ge(rt.sv(f, "swoop_cooldown"), rt.worldTime(f))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You need to wait 20 seconds between swoop attacks!</span>"]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "swoop_attack", 1, live(A), 25);
	return f.dot;
}, true);

rt.type(11687, "/obj/effect/temp_visual/fireball", "/obj/effect/temp_visual", {
	randomdir: 0,
	duration: 9,
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "fireball",
	name: "fireball",
	desc: "Get out of the way!",
	layer: 5,
	pixel_z: 270,
});

// /obj/effect/temp_visual/fireball/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:290)  may sleep
rt.def("/obj/effect/temp_visual/fireball/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "pixel_z", 0, "time", rt.sv(f, "duration")]);
	return f.dot;
}, true);

rt.type(11688, "/obj/effect/temp_visual/target", "/obj/effect/temp_visual", {
	light_range: 2,
	duration: 9,
	icon: rt.rsc("icons/mob/actions.dmi"),
	icon_state: "sniper_zoom",
	layer: 3.7,
});

// /obj/effect/temp_visual/target/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:304)  may sleep
rt.def("/obj/effect/temp_visual/target/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/effect/temp_visual/target/proc/fall"), live(f.args[1])]);
	return f.dot;
}, true, { args: ["mapload", "flame_hit"] });

// /obj/effect/temp_visual/target/proc/fall  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:308)  may sleep
rt.def("/obj/effect/temp_visual/target/proc/fall", function* fall(f: Frame, flame_hit: Value) {
	let _T: Value = null, M: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [flame_hit, _T, M, L, $e];
	yield* g.call(f, P("/proc/playsound"), null, [(_T = rt.getStep(f, live(f.src), 0)), rt.rsc("sound/magic/fleshtostone.ogg"), 80, 1]);
	yield* g.new_(f, T("/obj/effect/temp_visual/fireball"), [live(_T)]);
	yield* g.call(f, P("/proc/sleep"), null, [rt.sv(f, "duration")]);
	if (truthy((rt.istype(live(_T), T("/turf/closed/mineral")) ? 1 : 0))) {
		yield* g.callName(f, (M = live(_T)), "gets_drilled", []);
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), "explosion", 80, 1]);
	yield* g.new_(f, T("/obj/effect/hotspot"), [live(_T)]);
	yield* g.callName(f, live(_T), "hotspot_expose", [700, 50, 1]);
	L = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(_T)), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy((rt.istype(live(L), T("/mob/living/simple_animal/hostile/megafauna/dragon")) ? 1 : 0))) {
			continue;
		}
		if ((truthy((rt.istype(live(flame_hit), T("/list")) ? 1 : 0)) && !truthy(rt.index(live(flame_hit), live(L))))) {
			yield* g.callName(f, live(L), "adjustFireLoss", [40]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='userdanger'>You're hit by the drake's fire breath!</span>"]);
			rt.setAt(live(flame_hit), live(L), 1);
		} else {
			yield* g.callName(f, live(L), "adjustFireLoss", [10]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ path: "/list" }] });

rt.type(11689, "/obj/effect/temp_visual/dragon_flight", "/obj/effect/temp_visual", {
	duration: 10,
	randomdir: 0,
	icon: rt.rsc("icons/mob/lavaland/64x64megafauna.dmi"),
	icon_state: "dragon",
	layer: 4.5,
	pixel_x: -16,
});

// /obj/effect/temp_visual/dragon_flight/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:348)  may sleep
rt.def("/obj/effect/temp_visual/dragon_flight/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/effect/temp_visual/dragon_flight/proc/flight"), live(f.args[1])]);
	return f.dot;
}, true, { args: ["mapload", "negative"] });

// /obj/effect/temp_visual/dragon_flight/proc/flight  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:353)  may sleep
rt.def("/obj/effect/temp_visual/dragon_flight/proc/flight", function* flight(f: Frame, negative: Value) {
	f.vars = () => [negative];
	if (truthy(live(negative))) {
		rt.op(f, "Animate", [2, 10], [null, live(f.src), "pixel_x", -27, "pixel_z", 40.5, "time", 3, "easing", 4]);
	} else {
		rt.op(f, "Animate", [2, 10], [null, live(f.src), "pixel_x", 27, "pixel_z", 40.5, "time", 3, "easing", 4]);
	}
	yield* g.call(f, P("/proc/sleep"), null, [3]);
	rt.setSv(f, "icon_state", "swoop");
	if (truthy(live(negative))) {
		rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_x", -270, "pixel_z", 270, "time", 7]);
	} else {
		rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_x", 270, "pixel_z", 270, "time", 7]);
	}
	return f.dot;
}, true);

rt.type(11690, "/obj/effect/temp_visual/dragon_flight/end", "/obj/effect/temp_visual/dragon_flight", {
	duration: 5,
	pixel_x: 270,
	pixel_z: 270,
});

// /obj/effect/temp_visual/dragon_flight/end/proc/flight  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:371)
rt.def("/obj/effect/temp_visual/dragon_flight/end/proc/flight", function flight(f: Frame, negative: Value) {
	if (truthy(live(negative))) {
		rt.setSv(f, "pixel_x", -270);
		rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_x", -16, "pixel_z", 0, "time", 5]);
	} else {
		rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_x", -16, "pixel_z", 0, "time", 5]);
	}
	return f.dot;
});

rt.type(5026, "/mob/living/simple_animal/hostile/megafauna/dragon/lesser", "/mob/living/simple_animal/hostile/megafauna/dragon", {
	name: "lesser ash drake",
	maxHealth: 200,
	health: 200,
	faction: null,
	obj_damage: 80,
	melee_damage_upper: 30,
	melee_damage_lower: 30,
	damage_coeff: null,
	loot: null,
});

// /mob/living/simple_animal/hostile/megafauna/dragon/lesser/proc/<init>  (code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm:379)
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/lesser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("neutral"));
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 1, "fire", 1, "tox", 1, "clone", 1, "stamina", 0, "oxy", 1]));
	$0 = $0;
	rt.setSv(f, "loot", rt.list());
	return f.dot;
});
