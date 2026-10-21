// From code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5024, "/mob/living/simple_animal/hostile/megafauna/colossus", "/mob/living/simple_animal/hostile/megafauna", {
	move_to_delay: 10,
	ranged: 1,
	name: "colossus",
	desc: "A monstrous creature protected by heavy shielding.",
	health: 2500,
	maxHealth: 2500,
	attacktext: "judges",
	attack_sound: rt.rsc("sound/magic/clockwork/ratvar_attack.ogg"),
	icon_state: "eva",
	icon_living: "eva",
	icon_dead: "dragon_dead",
	friendly: "stares down",
	icon: rt.rsc("icons/mob/lavaland/96x96megafauna.dmi"),
	speak_emote: null,
	armour_penetration: 40,
	melee_damage_lower: 40,
	melee_damage_upper: 40,
	speed: 1,
	pixel_x: -32,
	del_on_death: 1,
	medal_type: "Colossus",
	score_type: "Colossus Killed",
	crusher_loot: null,
	loot: null,
	butcher_results: null,
	deathmessage: "disintegrates, leaving a glowing core in its wake.",
	death_sound: rt.rsc("sound/magic/demon_dies.ogg"),
});

// /mob/living/simple_animal/hostile/megafauna/colossus/proc/<init>  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:38)
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("roars"));
	$0 = $0;
	rt.setSv(f, "crusher_loot", rt.list(T("/obj/structure/closet/crate/necropolis/colossus/crusher")));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/structure/closet/crate/necropolis/colossus")));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/ore/diamond"), 5, T("/obj/item/stack/sheet/sinew"), 5, T("/obj/item/stack/sheet/animalhide/ashdrake"), 10, T("/obj/item/stack/sheet/bone"), 30]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/megafauna/colossus/proc/devour  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:56)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/devour", function* devour(f: Frame, L: Value) {
	f.vars = () => [L];
	yield* g.srcCall(f, "visible_message", fmt("<span class='colossus'>＀ disintegrates ＀!</span>", [live(f.src), live(L)]));
	yield* g.callName(f, live(L), "dust", []);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/colossus/proc/OpenFire  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:60)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/OpenFire", function* OpenFire(f: Frame) {
	rt.setSv(f, "anger_modifier", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [divide(subtract(rt.sv(f, "maxHealth"), rt.sv(f, "health")), 50), 20]))])));
	rt.setSv(f, "ranged_cooldown", add(rt.worldTime(f), 120));
	if (truthy((yield* g.srcCall(f, "enrage", rt.sv(f, "target"))))) {
		if (isEqual(rt.sv(f, "move_to_delay"), rt.initial(f, live(f.src), "move_to_delay"))) {
			yield* g.srcCall(f, "visible_message", "<span class='colossus'>\"<b>You can't dodge.</b>\"</span>");
		}
		rt.setSv(f, "ranged_cooldown", add(rt.worldTime(f), 30));
		yield* g.srcCall(f, "telegraph");
		yield* g.srcCall(f, "dir_shots", rt.gl("alldirs"));
		rt.setSv(f, "move_to_delay", 3);
		return live(f.dot);
	} else {
		rt.setSv(f, "move_to_delay", rt.initial(f, live(f.src), "move_to_delay"));
	}
	if (truthy(rt.op(f, "Prob", [], [add(20, rt.sv(f, "anger_modifier"))]))) {
		yield* g.srcCall(f, "telegraph");
		if (rt.lt(rt.sv(f, "health"), divide(rt.sv(f, "maxHealth"), 3))) {
			yield* g.srcCall(f, "double_spiral");
		} else {
			yield* g.srcCall(f, "visible_message", "<span class='colossus'>\"<b>Judgement.</b>\"</span>");
			yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/colossus/proc/spiral_shoot"), (yield* g.call(f, P("/proc/rand"), null, [0, 1]))]);
		}
	} else {
		if (truthy(rt.op(f, "Prob", [], [20]))) {
			rt.setSv(f, "ranged_cooldown", add(rt.worldTime(f), 30));
			yield* g.srcCall(f, "random_shots");
		} else {
			if (truthy(rt.op(f, "Prob", [], [70]))) {
				rt.setSv(f, "ranged_cooldown", add(rt.worldTime(f), 20));
				yield* g.srcCall(f, "blast");
			} else {
				rt.setSv(f, "ranged_cooldown", add(rt.worldTime(f), 40));
				yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/colossus/proc/alternating_dir_shots")]);
			}
		}
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/colossus/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:96)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "internal", (yield* g.new_(f, T("/obj/item/device/gps/internal/colossus"), [live(f.src)])));
	return f.dot;
}, true);

rt.type(11686, "/obj/effect/temp_visual/at_shield", "/obj/effect/temp_visual", {
	target: null,
	light_range: 2,
	duration: 8,
	name: "anti-toolbox field",
	desc: "A shimmering forcefield protecting the colossus.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "at_shield2",
	layer: 5,
});

// /obj/effect/temp_visual/at_shield/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:110)  may sleep
rt.def("/obj/effect/temp_visual/at_shield/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "target", live(f.args[1]));
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/atom/movable/proc/orbit"), rt.sv(f, "target"), 0, 0, 0, 0, 0, 1]);
	return f.dot;
}, true, { args: ["mapload", "new_target"] });

// /mob/living/simple_animal/hostile/megafauna/colossus/proc/bullet_act  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:115)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/bullet_act", function* bullet_act(f: Frame) {
	let AT: Value = null, random_x: Value = null, random_y: Value = null;
	f.vars = () => [AT, random_x, random_y];
	if (!truthy(rt.sv(f, "stat"))) {
		AT = (yield* g.new_(f, T("/obj/effect/temp_visual/at_shield"), [rt.fv(f, "loc", live(f.src)), live(f.src)]));
		random_x = (yield* g.call(f, P("/proc/rand"), null, [-32, 32]));
		rt.modField(f, live(AT), "pixel_x", live(random_x), add);
		random_y = (yield* g.call(f, P("/proc/rand"), null, [0, 72]));
		rt.modField(f, live(AT), "pixel_y", live(random_y), add);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["P"] });

// /mob/living/simple_animal/hostile/megafauna/colossus/proc/enrage  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:125)
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/enrage", function enrage(f: Frame, L: Value) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (!truthy(rt.gv(f, "mind", (H = live(L))))) return f.dot;
	if (!(truthy(rt.gv(f, "martial_art", rt.fv(f, "mind", live(H)))) && truthy(rt.op(f, "Prob", [], [rt.gv(f, "deflection_chance", rt.gv(f, "martial_art", rt.fv(f, "mind", live(H))))])))) return f.dot;
	f.dot = 1;
	return f.dot;
});

// /mob/living/simple_animal/hostile/megafauna/colossus/proc/alternating_dir_shots  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:132)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/alternating_dir_shots", function* alternating_dir_shots(f: Frame) {
	yield* g.srcCall(f, "dir_shots", rt.gl("diagonals"));
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	yield* g.srcCall(f, "dir_shots", rt.gl("cardinal"));
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	yield* g.srcCall(f, "dir_shots", rt.gl("diagonals"));
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	yield* g.srcCall(f, "dir_shots", rt.gl("cardinal"));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/colossus/proc/double_spiral  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:141)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/double_spiral", function* double_spiral(f: Frame) {
	yield* g.srcCall(f, "visible_message", "<span class='colossus'>\"<b>Die.</b>\"</span>");
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/colossus/proc/spiral_shoot")]);
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/colossus/proc/spiral_shoot"), 1]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/colossus/proc/spiral_shoot  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:148)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/spiral_shoot", function* spiral_shoot(f: Frame, negative: Value, counter_start: Value) {
	let counter: Value = null, marker: Value = null, i: Value = null;
	let $0: any, $e: any;
	f.vars = () => [negative, counter_start, counter, marker, i, $0, $e];
	if (live(negative) === null) {
		negative = 0;
	}
	if (live(counter_start) === null) {
		counter_start = 1;
	}
	counter = live(counter_start);
	marker = null;
	i = null;
	rt.forRange(f, 0, 1, 80, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		$0 = live(counter);
		if ($0 === 1) {
			marker = rt.locate(rt.sv(f, "x"), subtract(rt.sv(f, "y"), 2), rt.sv(f, "z"));
		} else if ($0 === 2) {
			marker = rt.locate(subtract(rt.sv(f, "x"), 1), subtract(rt.sv(f, "y"), 2), rt.sv(f, "z"));
		} else if ($0 === 3) {
			marker = rt.locate(subtract(rt.sv(f, "x"), 2), subtract(rt.sv(f, "y"), 2), rt.sv(f, "z"));
		} else if ($0 === 4) {
			marker = rt.locate(subtract(rt.sv(f, "x"), 2), subtract(rt.sv(f, "y"), 1), rt.sv(f, "z"));
		} else if ($0 === 5) {
			marker = rt.locate(subtract(rt.sv(f, "x"), 2), rt.sv(f, "y"), rt.sv(f, "z"));
		} else if ($0 === 6) {
			marker = rt.locate(subtract(rt.sv(f, "x"), 2), add(rt.sv(f, "y"), 1), rt.sv(f, "z"));
		} else if ($0 === 7) {
			marker = rt.locate(subtract(rt.sv(f, "x"), 2), add(rt.sv(f, "y"), 2), rt.sv(f, "z"));
		} else if ($0 === 8) {
			marker = rt.locate(subtract(rt.sv(f, "x"), 1), add(rt.sv(f, "y"), 2), rt.sv(f, "z"));
		} else if ($0 === 9) {
			marker = rt.locate(rt.sv(f, "x"), add(rt.sv(f, "y"), 2), rt.sv(f, "z"));
		} else if ($0 === 10) {
			marker = rt.locate(add(rt.sv(f, "x"), 1), add(rt.sv(f, "y"), 2), rt.sv(f, "z"));
		} else if ($0 === 11) {
			marker = rt.locate(add(rt.sv(f, "x"), 2), add(rt.sv(f, "y"), 2), rt.sv(f, "z"));
		} else if ($0 === 12) {
			marker = rt.locate(add(rt.sv(f, "x"), 2), add(rt.sv(f, "y"), 1), rt.sv(f, "z"));
		} else if ($0 === 13) {
			marker = rt.locate(add(rt.sv(f, "x"), 2), rt.sv(f, "y"), rt.sv(f, "z"));
		} else if ($0 === 14) {
			marker = rt.locate(add(rt.sv(f, "x"), 2), subtract(rt.sv(f, "y"), 1), rt.sv(f, "z"));
		} else if ($0 === 15) {
			marker = rt.locate(add(rt.sv(f, "x"), 2), subtract(rt.sv(f, "y"), 2), rt.sv(f, "z"));
		} else if ($0 === 16) {
			marker = rt.locate(add(rt.sv(f, "x"), 1), subtract(rt.sv(f, "y"), 2), rt.sv(f, "z"));
		}
		if (truthy(live(negative))) {
			counter = rt.inc(live(counter), -1);
		} else {
			counter = rt.inc(live(counter), 1);
		}
		if (rt.gt(live(counter), 16)) {
			counter = 1;
		}
		if (rt.lt(live(counter), 1)) {
			counter = 16;
		}
		yield* g.srcCall(f, "shoot_projectile", live(marker));
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 20, 1]);
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/colossus/proc/shoot_projectile  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:198)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/shoot_projectile", function* shoot_projectile(f: Frame, marker: Value) {
	let startloc: Value = null, _P: Value = null;
	f.vars = () => [marker, startloc, _P];
	if ((!truthy(live(marker)) || isEqual(live(marker), rt.sv(f, "loc")))) {
		return live(f.dot);
	}
	startloc = rt.getStep(f, live(f.src), 0);
	rt.setFv(f, "current", (_P = (yield* g.new_(f, T("/obj/item/projectile/colossus"), [live(startloc)]))), live(startloc));
	rt.setFv(f, "starting", live(_P), live(startloc));
	rt.setFv(f, "firer", live(_P), live(f.src));
	rt.setFv(f, "yo", live(_P), subtract(rt.fv(f, "y", live(marker)), rt.fv(f, "y", live(startloc))));
	rt.setFv(f, "xo", live(_P), subtract(rt.fv(f, "x", live(marker)), rt.fv(f, "x", live(startloc))));
	if (truthy(rt.sv(f, "target"))) {
		rt.setFv(f, "original", live(_P), rt.sv(f, "target"));
	} else {
		rt.setFv(f, "original", live(_P), live(marker));
	}
	yield* g.callName(f, live(_P), "fire", []);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/colossus/proc/random_shots  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:214)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/random_shots", function* random_shots(f: Frame) {
	let U: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [U, _T, $e];
	yield* g.call(f, P("/proc/playsound"), null, [(U = rt.getStep(f, live(f.src), 0)), rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 300, 1, 5]);
	_T = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(U)), 12), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(U)), 12), 1])), rt.fv(f, "z", live(U))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(U)), 12), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(U)), 12), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", live(U)))])), live(U)));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.srcCall(f, "shoot_projectile", live(_T));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/colossus/proc/blast  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:221)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/blast", function* blast(f: Frame) {
	let _T: Value = null, turf: Value = null;
	let $e: any;
	f.vars = () => [_T, turf, $e];
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 200, 1, 2]);
	yield* g.srcCall(f, "newtonian_move", rt.getDir(f, (_T = rt.getStep(f, rt.sv(f, "target"), 0)), rt.sv(f, "targets_from")));
	turf = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(_T)])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		turf = $e;
		yield* g.srcCall(f, "shoot_projectile", live(turf));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/colossus/proc/dir_shots  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:228)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/dir_shots", function* dir_shots(f: Frame, dirs: Value) {
	let d: Value = null, E: Value = null;
	let $e: any;
	f.vars = () => [dirs, d, E, $e];
	if (!truthy((rt.istype(live(dirs), T("/list")) ? 1 : 0))) {
		dirs = (yield* g.callName(f, rt.gl("alldirs"), "Copy", []));
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 200, 1, 2]);
	d = null;
	rt.forList(f, 0, live(dirs));
	while (($e = rt.next(f, 0)) !== undefined) {
		d = $e;
		yield* g.srcCall(f, "shoot_projectile", (E = rt.getStep(f, live(f.src), live(d))));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/colossus/proc/telegraph  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:236)
rt.def("/mob/living/simple_animal/hostile/megafauna/colossus/proc/telegraph", function telegraph(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.call(f, P("/proc/range"), null, [10, live(f.src)]), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.fv(f, "client", live(M)))) {
			rt.call(f, P("/proc/flash_color"), null, [rt.fv(f, "client", live(M)), "#c80000", 1]);
			rt.call(f, P("/proc/shake_camera"), null, [live(M), 4, 3]);
		}
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/magic/clockwork/narsie_attack.ogg"), 200, 1]);
	return f.dot;
});

rt.type(8898, "/obj/item/projectile/colossus", "/obj/item/projectile", {
	pass_flags: 1,
	name: "death bolt",
	icon_state: "chronobolt",
	damage: 25,
	armour_penetration: 100,
	speed: 2,
	eyeblur: 0,
	damage_type: "brute",
});

// /obj/item/projectile/colossus/proc/on_hit  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:255)  may sleep
rt.def("/obj/item/projectile/colossus/proc/on_hit", function* on_hit(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy((yield* g.call(f, P("/proc/isturf"), null, [live(f.args[0])]))) || truthy((rt.istype(live(f.args[0]), T("/obj")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "ex_act", [2]);
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(10914, "/obj/machinery/smartfridge/black_box", "/obj/machinery/smartfridge", {
	memory_saved: 0,
	stored_items: null,
	icon_on: "blackbox",
	icon_off: "blackbox",
	light_range: 8,
	max_n_of_items: 1e+31,
	use_power: 0,
	name: "black box",
	desc: "A completely indestructible chunk of crystal, rumoured to predate the start of this universe. It looks like you could store things inside it.",
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	icon_state: "blackbox",
	resistance_flags: 35,
	pixel_y: -4,
}, { global: { blacklist: 765 } });

// /obj/machinery/smartfridge/black_box/proc/<init>  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:283)
rt.def("/obj/machinery/smartfridge/black_box/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "stored_items", rt.list());
	return f.dot;
});

// /obj/machinery/smartfridge/black_box/proc/accept_check  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:290)
rt.def("/obj/machinery/smartfridge/black_box/proc/accept_check", function accept_check(f: Frame, O: Value) {
	if (!truthy((rt.istype(live(O), T("/obj/item")) ? 1 : 0))) {
		return 0;
	}
	if (truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(O), rt.gl("blacklist")]))) {
		return 0;
	}
	return 1;
});

// /obj/machinery/smartfridge/black_box/proc/New  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:298)  may sleep
rt.def("/obj/machinery/smartfridge/black_box/proc/New", function* New(f: Frame) {
	if ((truthy(rt.gl("current")) && !isEqual(rt.gl("current"), live(f.src)))) {
		yield* g.call(f, P("/proc/qdel"), null, [null, live(f.src), "force", 1], rt.Args.Named);
		return live(f.dot);
	}
	rt.setGl("current", live(f.src));
	yield* g.srcCall(f, "ReadMemory");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/machinery/smartfridge/black_box/proc/process  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:306)
rt.def("/obj/machinery/smartfridge/black_box/proc/process", function process(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!(!truthy(rt.sv(f, "memory_saved")) && isEqual(rt.fv(f, "current_state", rt.gl("SSticker")), 4))) return f.dot;
	rt.callSrc(f, "WriteMemory", []);
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/smartfridge/black_box/proc/WriteMemory  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:311)
rt.def("/obj/machinery/smartfridge/black_box/proc/WriteMemory", function WriteMemory(f: Frame) {
	let S: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [S, O, $e];
	S = rt.new_(f, T("/savefile"), ["data/npc_saves/Blackbox.sav"]);
	rt.setSv(f, "stored_items", rt.list());
	O = null;
	rt.forList(f, 0, subtract(rt.sv(f, "contents"), rt.sv(f, "component_parts")), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		rt.modSrcVar(f, "stored_items", rt.fv(f, "type", live(O)), add);
	}
	rt.endFor(f, 0);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "stored_items", rt.sv(f, "stored_items")], false);
	rt.setSv(f, "memory_saved", 1);
	return f.dot;
});

// /obj/machinery/smartfridge/black_box/proc/ReadMemory  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:321)  may sleep
rt.def("/obj/machinery/smartfridge/black_box/proc/ReadMemory", function* ReadMemory(f: Frame) {
	let S: Value = null, item: Value = null;
	let $e: any;
	f.vars = () => [S, item, $e];
	rt.setSv(f, "stored_items", rt.input(f, rt.R.index, null, [(S = (yield* g.new_(f, T("/savefile"), ["data/npc_saves/Blackbox.sav"]))), "stored_items"]));
	if (rt.sv(f, "stored_items") === null) {
		rt.setSv(f, "stored_items", rt.list());
	}
	item = null;
	rt.forList(f, 0, rt.sv(f, "stored_items"));
	while (($e = rt.next(f, 0)) !== undefined) {
		item = $e;
		yield* g.srcCall(f, "create_item", live(item));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/smartfridge/black_box/proc/create_item  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:333)  may sleep
rt.def("/obj/machinery/smartfridge/black_box/proc/create_item", function* create_item(f: Frame, item_type: Value) {
	f.vars = () => [item_type];
	yield* g.new_(f, live(item_type), [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/smartfridge/black_box/proc/Destroy  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:337)  may sleep
rt.def("/obj/machinery/smartfridge/black_box/proc/Destroy", function* Destroy(f: Frame) {
	let thing: Value = null;
	let $e: any;
	f.vars = () => [thing, $e];
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (truthy(live(f.args[0]))) {
		thing = null;
		rt.forList(f, 0, live(f.src));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(thing)]);
		}
		rt.endFor(f, 0);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return 1;
}, true, { args: ["force"] });

rt.type(10947, "/obj/machinery/anomalous_crystal", "/obj/machinery", {
	observer_desc: "Anomalous crystals have descriptions that only observers can see. But this one hasn't been changed from the default.",
	activation_method: null,
	possible_methods: null,
	activation_damage_type: null,
	last_use_timer: 0,
	cooldown_add: 30,
	affected_targets: null,
	activation_sound: rt.rsc("sound/effects/break_stone.ogg"),
	light_range: 8,
	use_power: 0,
	flags: 16,
	name: "anomalous crystal",
	desc: "A strange chunk of crystal, being in the presence of it fills you with equal parts excitement and dread.",
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	icon_state: "anomaly_crystal",
	resistance_flags: 99,
	density: 1,
});

// /obj/machinery/anomalous_crystal/proc/<init>  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:392)
rt.def("/obj/machinery/anomalous_crystal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_methods", rt.list("touch", "speech", "heat", "bullet", "energy", "bomb", "bumping", "weapon", "magic"));
	$0 = $0;
	rt.setSv(f, "affected_targets", rt.list());
	return f.dot;
});

// /obj/machinery/anomalous_crystal/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:396)  may sleep
rt.def("/obj/machinery/anomalous_crystal/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "activation_method"))) return f.dot;
	rt.setSv(f, "activation_method", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "possible_methods")]));
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/machinery/anomalous_crystal/proc/examine  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:401)
rt.def("/obj/machinery/anomalous_crystal/proc/examine", function examine(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), rt.sv(f, "observer_desc")]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("It is activated by ＀.", [rt.sv(f, "activation_method")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/anomalous_crystal/proc/Hear  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:407)  may sleep
rt.def("/obj/machinery/anomalous_crystal/proc/Hear", function* Hear(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[1]), T("/mob/living")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "ActivationReaction", live(f.args[1]), "speech");
	return f.dot;
}, true, { args: ["message", "speaker", "message_langs", "raw_message", "radio_freq", "spans", "message_mode"] });

// /obj/machinery/anomalous_crystal/proc/attack_hand  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:412)  may sleep
rt.def("/obj/machinery/anomalous_crystal/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "ActivationReaction", live(f.args[0]), "touch");
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/anomalous_crystal/proc/attackby  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:416)  may sleep
rt.def("/obj/machinery/anomalous_crystal/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.callName(f, live(f.args[0]), "is_hot", [])))) {
		yield* g.srcCall(f, "ActivationReaction", live(f.args[1]), "heat");
	} else {
		yield* g.srcCall(f, "ActivationReaction", live(f.args[1]), "weapon");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/anomalous_crystal/proc/bullet_act  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:423)  may sleep
rt.def("/obj/machinery/anomalous_crystal/proc/bullet_act", function* bullet_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile/magic")) ? 1 : 0))) {
		yield* g.srcCall(f, "ActivationReaction", rt.fv(f, "firer", live(f.args[0])), "magic", rt.fv(f, "damage_type", live(f.args[0])));
		return live(f.dot);
	}
	yield* g.srcCall(f, "ActivationReaction", rt.fv(f, "firer", live(f.args[0])), rt.fv(f, "flag", live(f.args[0])), rt.fv(f, "damage_type", live(f.args[0])));
	return f.dot;
}, true, { args: ["P", "def_zone"] });

// /obj/machinery/anomalous_crystal/proc/ActivationReaction  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:430)
rt.def("/obj/machinery/anomalous_crystal/proc/ActivationReaction", function ActivationReaction(f: Frame, user: Value, method: Value, damtype: Value) {
	if (rt.lt(rt.worldTime(f), rt.sv(f, "last_use_timer"))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "activation_damage_type")) && !isEqual(rt.sv(f, "activation_damage_type"), live(damtype)))) {
		return 0;
	}
	if (!isEqual(live(method), rt.sv(f, "activation_method"))) {
		return 0;
	}
	rt.setSv(f, "last_use_timer", add(rt.worldTime(f), rt.sv(f, "cooldown_add")));
	rt.call(f, P("/proc/playsound"), null, [live(user), rt.sv(f, "activation_sound"), 100, 1]);
	return 1;
});

// /obj/machinery/anomalous_crystal/proc/Bumped  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:441)  may sleep
rt.def("/obj/machinery/anomalous_crystal/proc/Bumped", function* Bumped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])])))) return f.dot;
	yield* g.srcCall(f, "ActivationReaction", live(f.args[0]), "bumping");
	return f.dot;
}, true, { args: ["AM"] });

// /obj/machinery/anomalous_crystal/proc/ex_act  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:446)  may sleep
rt.def("/obj/machinery/anomalous_crystal/proc/ex_act", function* ex_act(f: Frame) {
	yield* g.srcCall(f, "ActivationReaction", null, "bomb");
	return f.dot;
}, true, { waitfor: false });

rt.type(10948, "/obj/machinery/anomalous_crystal/honk", "/obj/machinery/anomalous_crystal", {
	observer_desc: "This crystal strips and equips its targets as clowns.",
	possible_methods: null,
	activation_sound: rt.rsc("sound/items/bikehorn.ogg"),
});

// /obj/machinery/anomalous_crystal/honk/proc/ActivationReaction  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:454)  may sleep
rt.def("/obj/machinery/anomalous_crystal/honk/proc/ActivationReaction", function* ActivationReaction(f: Frame) {
	let H: Value = null, W: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [H, W, C, $e];
	if (!((truthy((yield* g.callSuper(f, [], rt.Args.Same))) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) && !truthy((rt.isIn(f, live(f.args[0]), rt.sv(f, "affected_targets")) ? 1 : 0)))) return f.dot;
	H = live(f.args[0]);
	W = null;
	rt.forList(f, 0, live(H), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		yield* g.callName(f, live(H), "dropItemToGround", [live(W)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, (C = (yield* g.new_(f, T("/datum/job/clown"), []))), "equip", [live(H)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(C)]);
	yield* g.callName(f, rt.sv(f, "affected_targets"), "Add", [live(H)]);
	return f.dot;
}, true, { args: ["user"] });

rt.type(10949, "/obj/machinery/anomalous_crystal/theme_warp", "/obj/machinery/anomalous_crystal", {
	terrain_theme: "winter",
	NewTerrainFloors: null,
	NewTerrainWalls: null,
	NewTerrainChairs: null,
	NewTerrainTables: null,
	NewFlora: null,
	florachance: 8,
	observer_desc: "This crystal warps the area around it to a theme.",
	activation_method: "touch",
	cooldown_add: 200,
});

// /obj/machinery/anomalous_crystal/theme_warp/proc/<init>  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:472)
rt.def("/obj/machinery/anomalous_crystal/theme_warp/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "NewFlora", rt.list());
	return f.dot;
});

// /obj/machinery/anomalous_crystal/theme_warp/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:476)  may sleep
rt.def("/obj/machinery/anomalous_crystal/theme_warp/proc/Initialize", function* Initialize(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "terrain_theme", rt.op(f, "PickUnweighted", [4], ["lavaland", "winter", "jungle", "ayy lmao"]));
	rt.setSv(f, "observer_desc", fmt("This crystal changes the area around it to match the theme of \"＀\".", [rt.sv(f, "terrain_theme")]));
	$0 = rt.sv(f, "terrain_theme");
	if ($0 === "lavaland") {
		rt.setSv(f, "NewTerrainFloors", T("/turf/open/floor/grass/snow/basalt"));
		rt.setSv(f, "NewTerrainWalls", T("/turf/closed/wall/mineral/cult"));
		rt.setSv(f, "NewFlora", rt.list(T("/mob/living/simple_animal/hostile/asteroid/goldgrub")));
		rt.setSv(f, "florachance", 1);
	} else if ($0 === "winter") {
		rt.setSv(f, "NewTerrainFloors", T("/turf/open/floor/grass/snow"));
		rt.setSv(f, "NewTerrainWalls", T("/turf/closed/wall/mineral/wood"));
		rt.setSv(f, "NewTerrainChairs", T("/obj/structure/chair/wood/normal"));
		rt.setSv(f, "NewTerrainTables", T("/obj/structure/table/glass"));
		rt.setSv(f, "NewFlora", rt.list(T("/obj/structure/flora/grass/green"), T("/obj/structure/flora/grass/brown"), T("/obj/structure/flora/grass/both")));
	} else if ($0 === "jungle") {
		rt.setSv(f, "NewTerrainFloors", T("/turf/open/floor/grass"));
		rt.setSv(f, "NewTerrainWalls", T("/turf/closed/wall/mineral/sandstone"));
		rt.setSv(f, "NewTerrainChairs", T("/obj/structure/chair/wood"));
		rt.setSv(f, "NewTerrainTables", T("/obj/structure/table/wood"));
		rt.setSv(f, "NewFlora", rt.list(T("/obj/structure/flora/ausbushes/sparsegrass"), T("/obj/structure/flora/ausbushes/fernybush"), T("/obj/structure/flora/ausbushes/leafybush"), T("/obj/structure/flora/ausbushes/grassybush"), T("/obj/structure/flora/ausbushes/sunnybush"), T("/obj/structure/flora/tree/palm"), T("/mob/living/carbon/monkey"), T("/obj/item/weapon/gun/ballistic/bow"), T("/obj/item/weapon/storage/backpack/quiver/full")));
		rt.setSv(f, "florachance", 20);
	} else if ($0 === "ayy lmao") {
		rt.setSv(f, "NewTerrainFloors", T("/turf/open/floor/plating/abductor"));
		rt.setSv(f, "NewTerrainWalls", T("/turf/closed/wall/mineral/abductor"));
		rt.setSv(f, "NewTerrainChairs", T("/obj/structure/bed/abductor"));
		rt.setSv(f, "NewTerrainTables", T("/obj/structure/table/abductor"));
	}
	return f.dot;
}, true);

// /obj/machinery/anomalous_crystal/theme_warp/proc/ActivationReaction  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:508)  may sleep
rt.def("/obj/machinery/anomalous_crystal/theme_warp/proc/ActivationReaction", function* ActivationReaction(f: Frame) {
	let A: Value = null, Stuff: Value = null, _T: Value = null, O: Value = null, G: Value = null, Picked: Value = null, Original: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [A, Stuff, _T, O, G, Picked, Original, C, $e];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (!(!truthy(rt.gv(f, "outdoors", (A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))))) && !truthy((rt.isIn(f, live(A), rt.sv(f, "affected_targets")) ? 1 : 0)))) return f.dot;
	Stuff = null;
	rt.forList(f, 0, live(A), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Stuff = $e;
		if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(Stuff)])))) {
			if (((truthy((rt.istype((_T = live(Stuff)), T("/turf/open/space")) ? 1 : 0)) || truthy((rt.istype(live(_T), T("/turf/open/floor")) ? 1 : 0))) && truthy(rt.sv(f, "NewTerrainFloors")))) {
				if (truthy(rt.gv(f, "air", (O = (yield* g.callName(f, live(_T), "ChangeTurf", [rt.sv(f, "NewTerrainFloors")])))))) {
					yield* g.callName(f, (G = rt.fv(f, "air", live(O))), "copy_from_turf", [live(O)]);
				}
				if (((truthy(rt.op(f, "Prob", [], [rt.sv(f, "florachance")])) && truthy(rt.len(f, rt.sv(f, "NewFlora")))) && !truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [live(O), 1]))))) {
					Picked = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "NewFlora")]);
					yield* g.new_(f, live(Picked), [live(O)]);
				}
				continue;
			}
			if ((truthy((rt.istype(live(_T), T("/turf/closed/wall")) ? 1 : 0)) && truthy(rt.sv(f, "NewTerrainWalls")))) {
				yield* g.callName(f, live(_T), "ChangeTurf", [rt.sv(f, "NewTerrainWalls")]);
				continue;
			}
		}
		if ((truthy((rt.istype(live(Stuff), T("/obj/structure/chair")) ? 1 : 0)) && truthy(rt.sv(f, "NewTerrainChairs")))) {
			Original = live(Stuff);
			yield* g.callName(f, (C = (yield* g.new_(f, rt.sv(f, "NewTerrainChairs"), [rt.fv(f, "loc", live(Original))]))), "setDir", [rt.fv(f, "dir", live(Original))]);
			yield* g.call(f, P("/proc/qdel"), null, [live(Stuff)]);
			continue;
		}
		if ((truthy((rt.istype(live(Stuff), T("/obj/structure/table")) ? 1 : 0)) && truthy(rt.sv(f, "NewTerrainTables")))) {
			yield* g.new_(f, rt.sv(f, "NewTerrainTables"), [rt.fv(f, "loc", live(Stuff))]);
			continue;
		}
	}
	rt.endFor(f, 0);
	rt.modSrcVar(f, "affected_targets", live(A), add);
	return f.dot;
}, true, { args: ["user", "method"] });

rt.type(10950, "/obj/machinery/anomalous_crystal/emitter", "/obj/machinery/anomalous_crystal", {
	generated_projectile: rt.typePath("/obj/item/projectile/beam/emitter"),
	observer_desc: "This crystal generates a projectile when activated.",
	activation_method: "touch",
	cooldown_add: 50,
});

// /obj/machinery/anomalous_crystal/emitter/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:544)  may sleep
rt.def("/obj/machinery/anomalous_crystal/emitter/proc/Initialize", function* Initialize(f: Frame) {
	let proj_name: Value = null;
	f.vars = () => [proj_name];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "generated_projectile", rt.op(f, "PickUnweighted", [1], [T("/obj/item/projectile/colossus")]));
	rt.setSv(f, "observer_desc", fmt("This crystal generates ＇！ when activated.", [(proj_name = rt.initial(f, rt.sv(f, "generated_projectile"), "name"))]));
	return f.dot;
}, true);

// /obj/machinery/anomalous_crystal/emitter/proc/ActivationReaction  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:551)  may sleep
rt.def("/obj/machinery/anomalous_crystal/emitter/proc/ActivationReaction", function* ActivationReaction(f: Frame) {
	let _P: Value = null;
	let $0: any;
	f.vars = () => [_P, $0];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	yield* g.callName(f, (_P = (yield* g.new_(f, rt.sv(f, "generated_projectile"), [rt.getStep(f, live(f.src), 0)]))), "setDir", [rt.sv(f, "dir")]);
	$0 = rt.sv(f, "dir");
	if ($0 === 1) {
		rt.setFv(f, "yo", live(_P), 20);
		rt.setFv(f, "xo", live(_P), 0);
	} else if ($0 === 4) {
		rt.setFv(f, "yo", live(_P), 0);
		rt.setFv(f, "xo", live(_P), 20);
	} else if ($0 === 8) {
		rt.setFv(f, "yo", live(_P), 0);
		rt.setFv(f, "xo", live(_P), -20);
	} else {
		rt.setFv(f, "yo", live(_P), -20);
		rt.setFv(f, "xo", live(_P), 0);
	}
	yield* g.callName(f, live(_P), "fire", []);
	return f.dot;
}, true, { args: ["user", "method"] });

rt.type(10951, "/obj/machinery/anomalous_crystal/dark_reprise", "/obj/machinery/anomalous_crystal", {
	observer_desc: "When activated, this crystal revives anyone nearby, but turns them into Shadowpeople and makes them unclonable, making the crystal their only hope of getting up again.",
	activation_method: "touch",
	activation_sound: rt.rsc("sound/hallucinations/growl1.ogg"),
});

// /obj/machinery/anomalous_crystal/dark_reprise/proc/ActivationReaction  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:575)  may sleep
rt.def("/obj/machinery/anomalous_crystal/dark_reprise/proc/ActivationReaction", function* ActivationReaction(f: Frame) {
	let i: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [i, H, $e];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	i = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)])));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(i)])))) {
			yield* g.new_(f, T("/obj/effect/temp_visual/cult/sparks"), [live(i)]);
			continue;
		}
		if (truthy((rt.istype(live(i), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if (isEqual(rt.gv(f, "stat", (H = live(i))), 2)) {
				yield* g.callName(f, live(H), "set_species", [T("/datum/species/shadow"), 1]);
				yield* g.callName(f, live(H), "regenerate_limbs", []);
				yield* g.callName(f, live(H), "regenerate_organs", []);
				yield* g.callName(f, live(H), "revive", [1, 0]);
				(rt.modField(f, live(H), "disabilities", 128, rt.bitOr));
				yield* g.callName(f, live(H), "grab_ghost", ["force", 1], rt.Args.Named);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["user", "method"] });

rt.type(10952, "/obj/machinery/anomalous_crystal/helpers", "/obj/machinery/anomalous_crystal", {
	ready_to_deploy: 0,
	observer_desc: "This crystal allows ghosts to turn into a fragile creature that can heal people.",
	activation_method: "touch",
	activation_sound: rt.rsc("sound/effects/ghost2.ogg"),
});

// /obj/machinery/anomalous_crystal/helpers/proc/Destroy  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:597)  may sleep
rt.def("/obj/machinery/anomalous_crystal/helpers/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("poi_list", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/machinery/anomalous_crystal/helpers/proc/ActivationReaction  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:601)  may sleep
rt.def("/obj/machinery/anomalous_crystal/helpers/proc/ActivationReaction", function* ActivationReaction(f: Frame) {
	if (!(truthy((yield* g.callSuper(f, [], rt.Args.Same))) && !truthy(rt.sv(f, "ready_to_deploy")))) return f.dot;
	(rt.modGl("poi_list", live(f.src), rt.bitOr));
	rt.setSv(f, "ready_to_deploy", 1);
	yield* g.call(f, P("/proc/notify_ghosts"), null, [null, fmt("An anomalous crystal has been activated in ＀! This crystal can always be used by ghosts hereafter.", [(yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))]), "enter_link", fmt("<a href=?src=＃;ghostjoin=1>(Click to enter)</a>", [live(f.src)]), "ghost_sound", rt.rsc("sound/effects/ghost2.ogg"), "source", live(f.src), "action", "attack"], rt.Args.Named);
	return f.dot;
}, true, { args: ["user", "method"] });

// /obj/machinery/anomalous_crystal/helpers/proc/attack_ghost  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:607)  may sleep
rt.def("/obj/machinery/anomalous_crystal/helpers/proc/attack_ghost", function* attack_ghost(f: Frame) {
	let be_helper: Value = null, W: Value = null;
	f.vars = () => [be_helper, W];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "ready_to_deploy"))) return f.dot;
	if (!((isEqual((be_helper = (yield* g.call(f, P("/proc/alert"), null, ["Become a Lightgeist? (Warning, You can no longer be cloned!)", null, "Yes", "No"]))), "Yes") && !(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) && truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
	rt.setFv(f, "key", (W = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/lightgeist"), [rt.getStep(f, rt.sv(f, "loc"), 0)]))), rt.fv(f, "key", live(f.args[0])));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/anomalous_crystal/helpers/proc/Topic  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:616)  may sleep
rt.def("/obj/machinery/anomalous_crystal/helpers/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let ghost: Value = null;
	f.vars = () => [href, href_list, ghost];
	if (!truthy(rt.at(live(href_list), "ghostjoin"))) return f.dot;
	if (!truthy((rt.istype((ghost = live(f.usr)), T("/mob/dead/observer")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "attack_ghost", live(ghost));
	return f.dot;
}, true);

rt.type(5030, "/mob/living/simple_animal/hostile/lightgeist", "/mob/living/simple_animal/hostile", {
	heal_power: 5,
	pass_flags: 21,
	verb_say: "warps",
	verb_ask: "floats inquisitively",
	verb_exclaim: "zaps",
	verb_yell: "bangs",
	initial_language_holder: rt.typePath("/datum/language_holder/lightbringer"),
	light_range: 4,
	AIStatus: 3,
	name: "lightgeist",
	desc: "This small floating creature is a completely unknown form of life... being near it fills you with a sense of tranquility.",
	icon_state: "lightgeist",
	icon_living: "lightgeist",
	icon_dead: "butterfly_dead",
	turns_per_move: 1,
	response_help: "waves away",
	response_disarm: "brushes aside",
	response_harm: "disrupts",
	speak_emote: null,
	maxHealth: 2,
	health: 2,
	harm_intent_damage: 1,
	friendly: "mends",
	density: 0,
	movement_type: 2,
	ventcrawler: 2,
	mob_size: 0,
	gold_core_spawnable: 0,
	damage_coeff: null,
	faction: null,
	del_on_death: 1,
	unsuitable_atmos_damage: 0,
	minbodytemp: 0,
	maxbodytemp: 1500,
	obj_damage: 0,
	environment_smash: 0,
	stop_automated_movement: 1,
});

// /mob/living/simple_animal/hostile/lightgeist/proc/<init>  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:631)
rt.def("/mob/living/simple_animal/hostile/lightgeist/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("oscillates"));
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 1, "fire", 1, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("neutral"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/lightgeist/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:662)  may sleep
rt.def("/mob/living/simple_animal/hostile/lightgeist/proc/Initialize", function* Initialize(f: Frame) {
	let medsensor: Value = null;
	f.vars = () => [medsensor];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	(rt.modSrcVar(f, "verbs", P("/mob/living/verb/pulled"), subtract));
	(rt.modSrcVar(f, "verbs", P("/mob/verb/me_verb"), subtract));
	yield* g.callName(f, (medsensor = rt.index(rt.gl("huds"), 4)), "add_hud_to", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/lightgeist/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:669)  may sleep
rt.def("/mob/living/simple_animal/hostile/lightgeist/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0)) && !isEqual(rt.sv(f, "target"), live(f.src)))) return f.dot;
	if (isEqual(rt.gv(f, "stat", (L = rt.sv(f, "target"))), 2)) return f.dot;
	yield* g.callName(f, live(L), "heal_overall_damage", [rt.sv(f, "heal_power"), rt.sv(f, "heal_power")]);
	yield* g.new_(f, T("/obj/effect/temp_visual/heal"), [rt.getStep(f, rt.sv(f, "target"), 0), "#80F5FF"]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/lightgeist/proc/ghostize  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:677)  may sleep
rt.def("/mob/living/simple_animal/hostile/lightgeist/proc/ghostize", function* ghostize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "death");
	return f.dot;
}, true);

rt.type(10953, "/obj/machinery/anomalous_crystal/refresher", "/obj/machinery/anomalous_crystal", {
	banned_items_typecache: null,
	observer_desc: "This crystal \"refreshes\" items that it affects, rendering them as new.",
	activation_method: "touch",
	cooldown_add: 50,
	activation_sound: rt.rsc("sound/magic/timeparadox2.ogg"),
});

// /obj/machinery/anomalous_crystal/refresher/proc/<init>  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:687)
rt.def("/obj/machinery/anomalous_crystal/refresher/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "banned_items_typecache", rt.list(T("/obj/item/weapon/storage"), T("/obj/item/weapon/implant"), T("/obj/item/weapon/implanter"), T("/obj/item/weapon/disk/nuclear"), T("/obj/item/projectile"), T("/obj/item/weapon/spellbook")));
	return f.dot;
});

// /obj/machinery/anomalous_crystal/refresher/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:690)  may sleep
rt.def("/obj/machinery/anomalous_crystal/refresher/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "banned_items_typecache", (yield* g.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "banned_items_typecache")])));
	return f.dot;
}, true);

// /obj/machinery/anomalous_crystal/refresher/proc/ActivationReaction  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:695)  may sleep
rt.def("/obj/machinery/anomalous_crystal/refresher/proc/ActivationReaction", function* ActivationReaction(f: Frame) {
	let L: Value = null, _T: Value = null, i: Value = null, W: Value = null, CHOSEN: Value = null;
	let $e: any;
	f.vars = () => [L, _T, i, W, CHOSEN, $e];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	L = rt.list();
	yield* g.new_(f, T("/obj/effect/temp_visual/emp/pulse"), [(_T = rt.getStep(f, live(f.src), rt.sv(f, "dir")))]);
	i = null;
	rt.forList(f, 0, live(_T));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if ((truthy((rt.istype(live(i), T("/obj/item")) ? 1 : 0)) && !truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(i), rt.sv(f, "banned_items_typecache")]))))) {
			if (!truthy(rt.gv(f, "admin_spawned", (W = live(i))))) {
				L = rt.modify(live(L), live(W), add);
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(L)))) return f.dot;
	CHOSEN = rt.op(f, "PickUnweighted", [1], [live(L)]);
	yield* g.new_(f, rt.fv(f, "type", live(CHOSEN)), [live(_T)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(CHOSEN)]);
	return f.dot;
}, true, { args: ["user", "method"] });

rt.type(10954, "/obj/machinery/anomalous_crystal/possessor", "/obj/machinery/anomalous_crystal", {
	observer_desc: "When activated, this crystal allows you to take over small animals, and then exit them at the possessors leisure. Exiting the animal kills it, and if you die while possessing the animal, you die as well.",
	activation_method: "touch",
});

// /obj/machinery/anomalous_crystal/possessor/proc/ActivationReaction  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:714)  may sleep
rt.def("/obj/machinery/anomalous_crystal/possessor/proc/ActivationReaction", function* ActivationReaction(f: Frame) {
	let mobcheck: Value = null, A: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [mobcheck, A, S, $e];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	mobcheck = 0;
	A = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)])), T("/mob/living/simple_animal"));
	if (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (!(((rt.gt(rt.fv(f, "melee_damage_upper", live(A)), 5) || rt.ge(rt.fv(f, "mob_size", live(A)), 3)) || truthy(rt.fv(f, "ckey", live(A)))) || truthy(rt.fv(f, "stat", live(A))))) {
			S = (yield* g.new_(f, T("/obj/structure/closet/stasis"), [live(A)]));
			yield* g.callName(f, live(f.args[0]), "forceMove", [live(S)]);
			mobcheck = 1;
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(mobcheck))) return f.dot;
	yield* g.new_(f, T("/mob/living/simple_animal/cockroach"), [rt.getStep(f, live(f.src), rt.sv(f, "dir"))]);
	return f.dot;
}, true, { args: ["user", "method"] });

rt.type(12409, "/obj/structure/closet/stasis", "/obj/structure/closet", {
	holder_animal: null,
	anchored: 1,
	name: "quantum entanglement stasis warp field",
	desc: "You can hardly comprehend this thing... which is why you can't see it.",
	icon_state: null,
	density: 1,
	obj_integrity: 999,
});

// /obj/structure/closet/stasis/proc/process  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:738)  may sleep
rt.def("/obj/structure/closet/stasis/proc/process", function* process(f: Frame) {
	if (!truthy(rt.sv(f, "holder_animal"))) return f.dot;
	if (!isEqual(rt.fv(f, "stat", rt.sv(f, "holder_animal")), 2)) return f.dot;
	yield* g.srcCall(f, "dump_contents");
	yield* g.callName(f, rt.sv(f, "holder_animal"), "gib", []);
	return live(f.dot);
}, true, { waitfor: false });

// /obj/structure/closet/stasis/proc/New  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:744)  may sleep
rt.def("/obj/structure/closet/stasis/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/simple_animal")) ? 1 : 0))) {
		rt.setSv(f, "holder_animal", rt.sv(f, "loc"));
	}
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/structure/closet/stasis/proc/Entered  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:750)  may sleep
rt.def("/obj/structure/closet/stasis/proc/Entered", function* Entered(f: Frame, A: Value) {
	let L: Value = null, _P: Value = null;
	f.vars = () => [A, L, _P];
	if (!(truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0)) && truthy(rt.sv(f, "holder_animal")))) return f.dot;
	rt.setFv(f, "notransform", (L = live(A)), 1);
	(rt.modField(f, live(L), "disabilities", 2, rt.bitOr));
	(rt.modField(f, live(L), "status_flags", 4096, rt.bitOr));
	yield* g.callName(f, rt.fv(f, "mind", live(L)), "transfer_to", [rt.sv(f, "holder_animal")]);
	_P = (yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/exit_possession"), []));
	yield* g.callName(f, rt.fv(f, "mind", rt.sv(f, "holder_animal")), "AddSpell", [live(_P)]);
	(rt.modField(f, rt.sv(f, "holder_animal"), "verbs", P("/mob/living/verb/pulled"), subtract));
	return f.dot;
}, true);

// /obj/structure/closet/stasis/proc/dump_contents  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:761)  may sleep
rt.def("/obj/structure/closet/stasis/proc/dump_contents", function* dump_contents(f: Frame) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [L, $e];
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	L = null;
	rt.forList(f, 0, live(f.src), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		(rt.modField(f, live(L), "disabilities", 16777213, rt.bitAnd));
		(rt.modField(f, live(L), "status_flags", 16773119, rt.bitAnd));
		rt.setFv(f, "notransform", live(L), 0);
		if (truthy(rt.sv(f, "holder_animal"))) {
			yield* g.callName(f, rt.fv(f, "mind", rt.sv(f, "holder_animal")), "transfer_to", [live(L)]);
			yield* g.callName(f, rt.fv(f, "mind", live(L)), "RemoveSpell", [T("/obj/effect/proc_holder/spell/targeted/exit_possession")]);
		}
		if ((truthy(live(f.args[0])) || !truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/simple_animal")) ? 1 : 0)))) {
			yield* g.callName(f, live(L), "death", [0]);
		}
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["kill"] });

rt.type(11280, "/obj/effect/proc_holder/spell/targeted/exit_possession", "/obj/effect/proc_holder/spell/targeted", {
	name: "Exit Possession",
	desc: "Exits the body you are possessing",
	charge_max: 60,
	clothes_req: 0,
	invocation_type: "none",
	max_targets: 1,
	range: -1,
	include_user: 1,
	selection_type: "view",
	action_icon_state: "exit_possession",
	sound: null,
});

// /obj/effect/proc_holder/spell/targeted/exit_possession/proc/cast  (code/modules/mob/living/simple_animal/hostile/megafauna/colossus.dm:793)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/exit_possession/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let target_mind: Value = null, i: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [targets, user, target_mind, i, S, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (!truthy((rt.istype(rt.fv(f, "loc", live(user)), T("/turf/open/floor")) ? 1 : 0))) {
		return live(f.dot);
	}
	target_mind = rt.fv(f, "mind", live(user));
	i = null;
	rt.forList(f, 0, live(user));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy((rt.istype(live(i), T("/obj/structure/closet/stasis")) ? 1 : 0))) {
			yield* g.callName(f, (S = live(i)), "dump_contents", [0]);
			yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
			break;
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(user), "gib", []);
	yield* g.callName(f, live(target_mind), "RemoveSpell", [T("/obj/effect/proc_holder/spell/targeted/exit_possession")]);
	return f.dot;
}, true);
