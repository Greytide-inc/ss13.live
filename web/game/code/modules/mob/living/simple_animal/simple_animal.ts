// From code/modules/mob/living/simple_animal/simple_animal.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4840, "/mob/living/simple_animal", "/mob/living", {
	icon_living: "",
	icon_dead: "",
	icon_gib: null,
	speak: null,
	speak_emote: null,
	speak_chance: 0,
	emote_hear: null,
	emote_see: null,
	turns_per_move: 1,
	turns_since_move: 0,
	stop_automated_movement: 0,
	wander: 1,
	stop_automated_movement_when_pulled: 1,
	response_help: "pokes",
	response_disarm: "shoves",
	response_harm: "hits",
	harm_intent_damage: 3,
	force_threshold: 0,
	minbodytemp: 250,
	maxbodytemp: 350,
	healable: 1,
	atmos_requirements: null,
	unsuitable_atmos_damage: 2,
	melee_damage_lower: 0,
	melee_damage_upper: 0,
	obj_damage: 0,
	armour_penetration: 0,
	melee_damage_type: "brute",
	damage_coeff: null,
	attacktext: "attacks",
	attack_sound: null,
	friendly: "nuzzles",
	environment_smash: 0,
	speed: 1,
	childtype: null,
	next_scan_time: 0,
	animal_species: null,
	access_card: null,
	buffed: 0,
	gold_core_spawnable: 0,
	nest: null,
	sentience_type: 1,
	loot: null,
	del_on_death: 0,
	deathmessage: "",
	death_sound: null,
	allow_movement_on_non_turfs: 0,
	attacked_sound: "punch",
	dextrous: 0,
	dextrous_hud_type: rt.typePath("/datum/hud/dextrous"),
	handcrafting: null,
	tame: 0,
	name: "animal",
	icon: rt.rsc("icons/mob/animal.dmi"),
	health: 20,
	maxHealth: 20,
	gender: "plural",
	status_flags: 8,
});

// /mob/living/simple_animal/proc/<init>  (code/modules/mob/living/simple_animal/simple_animal.dm:14)
rt.def("/mob/living/simple_animal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list());
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list());
	$0 = $0;
	rt.setSv(f, "emote_hear", rt.list());
	$0 = $0;
	rt.setSv(f, "emote_see", rt.list());
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 5, "max_oxy", 0, "min_tox", 0, "max_tox", 1, "min_co2", 0, "max_co2", 5, "min_n2", 0, "max_n2", 0]));
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 1, "fire", 1, "tox", 1, "clone", 1, "stamina", 0, "oxy", 1]));
	$0 = $0;
	rt.setSv(f, "loot", rt.list());
	return f.dot;
});

// /mob/living/simple_animal/proc/Initialize  (code/modules/mob/living/simple_animal/simple_animal.dm:89)  may sleep
rt.def("/mob/living/simple_animal/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.modGl("simple_animals", live(f.src), add);
	rt.setSv(f, "handcrafting", (yield* g.new_(f, T("/datum/personal_crafting"), [])));
	if (isEqual(rt.sv(f, "gender"), "plural")) {
		rt.setSv(f, "gender", rt.op(f, "PickUnweighted", [2], ["male", "female"]));
	}
	if (!truthy(rt.sv(f, "real_name"))) {
		rt.setSv(f, "real_name", rt.sv(f, "name"));
	}
	if (truthy(rt.sv(f, "loc"))) return f.dot;
	yield* g.call(f, P("/proc/stack_trace"), null, ["Simple animal being instantiated in nullspace"]);
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/Login  (code/modules/mob/living/simple_animal/simple_animal.dm:101)  may sleep
rt.def("/mob/living/simple_animal/proc/Login", function* Login(f: Frame) {
	if ((truthy(live(f.src)) && truthy(rt.fv(f, "client", live(f.src))))) {
		rt.setFv(f, "screen", rt.fv(f, "client", live(f.src)), rt.list());
		rt.modField(f, rt.sv(f, "client"), "screen", rt.gl("void"), add);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/updatehealth  (code/modules/mob/living/simple_animal/simple_animal.dm:107)  may sleep
rt.def("/mob/living/simple_animal/proc/updatehealth", function* updatehealth(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "health", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "health"), rt.sv(f, "maxHealth")]))])));
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/update_stat  (code/modules/mob/living/simple_animal/simple_animal.dm:111)  may sleep
rt.def("/mob/living/simple_animal/proc/update_stat", function* update_stat(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return live(f.dot);
	}
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		if (rt.le(rt.sv(f, "health"), 0)) {
			yield* g.srcCall(f, "death");
		} else {
			rt.setSv(f, "stat", 0);
		}
	}
	yield* g.srcCall(f, "med_hud_set_status");
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/handle_status_effects  (code/modules/mob/living/simple_animal/simple_animal.dm:122)
rt.def("/mob/living/simple_animal/proc/handle_status_effects", function handle_status_effects(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "stuttering"))) return f.dot;
	rt.setSv(f, "stuttering", 0);
	return f.dot;
});

// /mob/living/simple_animal/proc/handle_automated_movement  (code/modules/mob/living/simple_animal/simple_animal.dm:132)  may sleep
rt.def("/mob/living/simple_animal/proc/handle_automated_movement", function* handle_automated_movement(f: Frame) {
	let anydir: Value = null;
	f.vars = () => [anydir];
	if (!(!truthy(rt.sv(f, "stop_automated_movement")) && truthy(rt.sv(f, "wander")))) return f.dot;
	if (!((((truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.src))]))) || truthy(rt.sv(f, "allow_movement_on_non_turfs"))) && !truthy(rt.sv(f, "resting"))) && !truthy(rt.sv(f, "buckled"))) && truthy(rt.sv(f, "canmove")))) return f.dot;
	rt.incSrcVar(f, "turns_since_move", 1, true);
	if (rt.ge(rt.sv(f, "turns_since_move"), rt.sv(f, "turns_per_move"))) {
		if (!(truthy(rt.sv(f, "stop_automated_movement_when_pulled")) && truthy(rt.sv(f, "pulledby")))) {
			if (truthy((yield* g.srcCall(f, "Process_Spacemove", (anydir = rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])))))) {
				yield* g.srcCall(f, "Move", rt.getStep(f, live(f.src), live(anydir)), live(anydir));
				rt.setSv(f, "turns_since_move", 0);
			}
		}
	}
	return 1;
}, true, { waitfor: false });

// /mob/living/simple_animal/proc/handle_automated_speech  (code/modules/mob/living/simple_animal/simple_animal.dm:146)  may sleep
rt.def("/mob/living/simple_animal/proc/handle_automated_speech", function* handle_automated_speech(f: Frame, override: Value) {
	let length: Value = null, randomValue: Value = null, pick: Value = null;
	f.vars = () => [override, length, randomValue, pick];
	if (!truthy(rt.sv(f, "speak_chance"))) return f.dot;
	if (!(truthy(rt.op(f, "Prob", [], [rt.sv(f, "speak_chance")])) || truthy(live(override)))) return f.dot;
	if ((truthy(rt.sv(f, "speak")) && truthy(rt.len(f, rt.sv(f, "speak"))))) {
		if (((truthy(rt.sv(f, "emote_hear")) && truthy(rt.len(f, rt.sv(f, "emote_hear")))) || (truthy(rt.sv(f, "emote_see")) && truthy(rt.len(f, rt.sv(f, "emote_see")))))) {
			length = rt.len(f, rt.sv(f, "speak"));
			if ((truthy(rt.sv(f, "emote_hear")) && truthy(rt.len(f, rt.sv(f, "emote_hear"))))) {
				length = rt.modify(live(length), rt.len(f, rt.sv(f, "emote_hear")), add);
			}
			if ((truthy(rt.sv(f, "emote_see")) && truthy(rt.len(f, rt.sv(f, "emote_see"))))) {
				length = rt.modify(live(length), rt.len(f, rt.sv(f, "emote_see")), add);
			}
			if (rt.le((randomValue = (yield* g.call(f, P("/proc/rand"), null, [1, live(length)]))), rt.len(f, rt.sv(f, "speak")))) {
				yield* g.srcCall(f, "say", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "speak")]));
			} else {
				(randomValue = rt.modify(live(randomValue), rt.len(f, rt.sv(f, "speak")), subtract));
				if ((truthy(rt.sv(f, "emote_see")) && rt.le(live(randomValue), rt.len(f, rt.sv(f, "emote_see"))))) {
					yield* g.srcCall(f, "emote", fmt("me ＀", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "emote_see")])]), 1);
				} else {
					yield* g.srcCall(f, "emote", fmt("me ＀", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "emote_hear")])]), 2);
				}
			}
		} else {
			yield* g.srcCall(f, "say", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "speak")]));
		}
	} else {
		if ((!(truthy(rt.sv(f, "emote_hear")) && truthy(rt.len(f, rt.sv(f, "emote_hear")))) && (truthy(rt.sv(f, "emote_see")) && truthy(rt.len(f, rt.sv(f, "emote_see")))))) {
			yield* g.srcCall(f, "emote", "me", 1, rt.op(f, "PickUnweighted", [1], [rt.sv(f, "emote_see")]));
		}
		if (((truthy(rt.sv(f, "emote_hear")) && truthy(rt.len(f, rt.sv(f, "emote_hear")))) && !(truthy(rt.sv(f, "emote_see")) && truthy(rt.len(f, rt.sv(f, "emote_see")))))) {
			yield* g.srcCall(f, "emote", "me", 2, rt.op(f, "PickUnweighted", [1], [rt.sv(f, "emote_hear")]));
		}
		if (!((truthy(rt.sv(f, "emote_hear")) && truthy(rt.len(f, rt.sv(f, "emote_hear")))) && (truthy(rt.sv(f, "emote_see")) && truthy(rt.len(f, rt.sv(f, "emote_see")))))) return f.dot;
		length = add(rt.len(f, rt.sv(f, "emote_hear")), rt.len(f, rt.sv(f, "emote_see")));
		if (rt.le((pick = (yield* g.call(f, P("/proc/rand"), null, [1, live(length)]))), rt.len(f, rt.sv(f, "emote_see")))) {
			yield* g.srcCall(f, "emote", "me", 1, rt.op(f, "PickUnweighted", [1], [rt.sv(f, "emote_see")]));
		} else {
			yield* g.srcCall(f, "emote", "me", 2, rt.op(f, "PickUnweighted", [1], [rt.sv(f, "emote_hear")]));
		}
	}
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/proc/environment_is_safe  (code/modules/mob/living/simple_animal/simple_animal.dm:182)
rt.def("/mob/living/simple_animal/proc/environment_is_safe", function environment_is_safe(f: Frame, environment: Value, check_temp: Value) {
	let ST: Value = null, ST_gases: Value = null, tox: Value = null, oxy: Value = null, n2: Value = null, co2: Value = null, areatemp: Value = null;
	f.vars = () => [check_temp, ST, ST_gases, tox, oxy, n2, co2, areatemp];
	if (live(check_temp) === null) {
		check_temp = 0;
	}
	f.dot = 1;
	if (((truthy(rt.sv(f, "pulledby")) && rt.ge(rt.fv(f, "grab_state", rt.sv(f, "pulledby")), 3)) && truthy(rt.at(rt.sv(f, "atmos_requirements"), "min_oxy")))) {
		f.dot = 0;
	}
	if ((truthy(rt.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.src))])) && truthy((rt.istype(rt.fv(f, "loc", live(f.src)), T("/turf/open")) ? 1 : 0)))) {
		if (truthy(rt.gv(f, "air", (ST = rt.fv(f, "loc", live(f.src)))))) {
			ST_gases = rt.gv(f, "gases", rt.fv(f, "air", live(ST)));
			rt.callName(f, rt.fv(f, "air", live(ST)), "assert_gases", [rt.gl("hardcoded_gases")], rt.Args.List);
			tox = rt.index(rt.at(live(ST_gases), "plasma"), 1);
			oxy = rt.index(rt.at(live(ST_gases), "o2"), 1);
			n2 = rt.index(rt.at(live(ST_gases), "n2"), 1);
			co2 = rt.index(rt.at(live(ST_gases), "co2"), 1);
			rt.callName(f, rt.fv(f, "air", live(ST)), "garbage_collect", []);
			if ((truthy(rt.at(rt.sv(f, "atmos_requirements"), "min_oxy")) && rt.lt(live(oxy), rt.at(rt.sv(f, "atmos_requirements"), "min_oxy")))) {
				f.dot = 0;
			} else {
				if ((truthy(rt.at(rt.sv(f, "atmos_requirements"), "max_oxy")) && rt.gt(live(oxy), rt.at(rt.sv(f, "atmos_requirements"), "max_oxy")))) {
					f.dot = 0;
				} else {
					if ((truthy(rt.at(rt.sv(f, "atmos_requirements"), "min_tox")) && rt.lt(live(tox), rt.at(rt.sv(f, "atmos_requirements"), "min_tox")))) {
						f.dot = 0;
					} else {
						if ((truthy(rt.at(rt.sv(f, "atmos_requirements"), "max_tox")) && rt.gt(live(tox), rt.at(rt.sv(f, "atmos_requirements"), "max_tox")))) {
							f.dot = 0;
						} else {
							if ((truthy(rt.at(rt.sv(f, "atmos_requirements"), "min_n2")) && rt.lt(live(n2), rt.at(rt.sv(f, "atmos_requirements"), "min_n2")))) {
								f.dot = 0;
							} else {
								if ((truthy(rt.at(rt.sv(f, "atmos_requirements"), "max_n2")) && rt.gt(live(n2), rt.at(rt.sv(f, "atmos_requirements"), "max_n2")))) {
									f.dot = 0;
								} else {
									if ((truthy(rt.at(rt.sv(f, "atmos_requirements"), "min_co2")) && rt.lt(live(co2), rt.at(rt.sv(f, "atmos_requirements"), "min_co2")))) {
										f.dot = 0;
									} else {
										if ((truthy(rt.at(rt.sv(f, "atmos_requirements"), "max_co2")) && rt.gt(live(co2), rt.at(rt.sv(f, "atmos_requirements"), "max_co2")))) {
											f.dot = 0;
										}
									}
								}
							}
						}
					}
				}
			}
		} else {
			if ((((truthy(rt.at(rt.sv(f, "atmos_requirements"), "min_oxy")) || truthy(rt.at(rt.sv(f, "atmos_requirements"), "min_tox"))) || truthy(rt.at(rt.sv(f, "atmos_requirements"), "min_n2"))) || truthy(rt.at(rt.sv(f, "atmos_requirements"), "min_co2")))) {
				f.dot = 0;
			}
		}
	}
	if (!truthy(live(check_temp))) return f.dot;
	if (!(rt.lt((areatemp = rt.callSrc(f, "get_temperature", [live(environment)])), rt.sv(f, "minbodytemp")) || rt.gt(live(areatemp), rt.sv(f, "maxbodytemp")))) return f.dot;
	f.dot = 0;
	return f.dot;
});

// /mob/living/simple_animal/proc/handle_environment  (code/modules/mob/living/simple_animal/simple_animal.dm:226)  may sleep
rt.def("/mob/living/simple_animal/proc/handle_environment", function* handle_environment(f: Frame, environment: Value) {
	let A: Value = null, areatemp: Value = null, diff: Value = null;
	f.vars = () => [environment, A, areatemp, diff];
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [(A = rt.fv(f, "loc", live(f.src)))])))) {
		if (rt.gt(rt.op(f, "Abs", [], [subtract((areatemp = (yield* g.srcCall(f, "get_temperature", live(environment)))), rt.sv(f, "bodytemperature"))]), 40)) {
			rt.modSrcVar(f, "bodytemperature", (diff = divide((diff = subtract(live(areatemp), rt.sv(f, "bodytemperature"))), 5)), add);
		}
	}
	if (!truthy((yield* g.srcCall(f, "environment_is_safe", live(environment))))) {
		yield* g.srcCall(f, "adjustHealth", rt.sv(f, "unsuitable_atmos_damage"));
	}
	yield* g.srcCall(f, "handle_temperature_damage");
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/handle_temperature_damage  (code/modules/mob/living/simple_animal/simple_animal.dm:240)  may sleep
rt.def("/mob/living/simple_animal/proc/handle_temperature_damage", function* handle_temperature_damage(f: Frame) {
	if (!(rt.lt(rt.sv(f, "bodytemperature"), rt.sv(f, "minbodytemp")) || rt.gt(rt.sv(f, "bodytemperature"), rt.sv(f, "maxbodytemp")))) return f.dot;
	yield* g.srcCall(f, "adjustHealth", rt.sv(f, "unsuitable_atmos_damage"));
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/gib  (code/modules/mob/living/simple_animal/simple_animal.dm:245)  may sleep
rt.def("/mob/living/simple_animal/proc/gib", function* gib(f: Frame) {
	let path: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [path, i, $e];
	if (truthy(rt.sv(f, "butcher_results"))) {
		path = null;
		rt.forList(f, 0, rt.sv(f, "butcher_results"));
		while (($e = rt.next(f, 0)) !== undefined) {
			path = $e;
			i = null;
			i = 1;
			while (rt.le(live(i), rt.index(rt.sv(f, "butcher_results"), live(path)))) {
				yield* g.new_(f, live(path), [rt.fv(f, "loc", live(f.src))]);
				i = rt.inc(live(i), 1);
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/gib_animation  (code/modules/mob/living/simple_animal/simple_animal.dm:252)  may sleep
rt.def("/mob/living/simple_animal/proc/gib_animation", function* gib_animation(f: Frame) {
	if (!truthy(rt.sv(f, "icon_gib"))) return f.dot;
	yield* g.new_(f, T("/obj/effect/temp_visual/gib_animation/animal"), [rt.sv(f, "loc"), rt.sv(f, "icon_gib")]);
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/say_mod  (code/modules/mob/living/simple_animal/simple_animal.dm:255)
rt.def("/mob/living/simple_animal/proc/say_mod", function say_mod(f: Frame) {
	if ((truthy(rt.sv(f, "speak_emote")) && truthy(rt.len(f, rt.sv(f, "speak_emote"))))) {
		rt.setSv(f, "verb_say", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "speak_emote")]));
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["input", "message_mode"] });

// /mob/living/simple_animal/proc/emote  (code/modules/mob/living/simple_animal/simple_animal.dm:262)  may sleep
rt.def("/mob/living/simple_animal/proc/emote", function* emote(f: Frame, act: Value, m_type: Value, message: Value) {
	f.vars = () => [act, m_type, message];
	if (live(m_type) === null) {
		m_type = 1;
	}
	if (live(message) === null) {
		message = null;
	}
	if (truthy(rt.sv(f, "stat"))) {
		return live(f.dot);
	}
	if (isEqual(live(act), "scream")) {
		message = "makes a loud and pained whimper.";
		act = "me";
	}
	yield* g.callSuper(f, [live(act), live(m_type), live(message)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/movement_delay  (code/modules/mob/living/simple_animal/simple_animal.dm:270)
rt.def("/mob/living/simple_animal/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	f.dot = rt.sv(f, "speed");
	f.dot = rt.modify(live(f.dot), rt.fv(f, "animal_delay", rt.gl("config")), add);
	return f.dot;
});

// /mob/living/simple_animal/proc/Stat  (code/modules/mob/living/simple_animal/simple_animal.dm:277)  may sleep
rt.def("/mob/living/simple_animal/proc/Stat", function* Stat(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) return f.dot;
	yield* g.call(f, P("/proc/stat"), null, [null, fmt("Health: ＀%", [(yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.sv(f, "health"), rt.sv(f, "maxHealth")), 100)]))])]);
	return 1;
}, true);

// /mob/living/simple_animal/proc/death  (code/modules/mob/living/simple_animal/simple_animal.dm:284)  may sleep
rt.def("/mob/living/simple_animal/proc/death", function* death(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	if (truthy(rt.sv(f, "nest"))) {
		(rt.modField(f, rt.sv(f, "nest"), "spawned_mobs", live(f.src), subtract));
		rt.setSv(f, "nest", null);
	}
	if (truthy(rt.len(f, rt.sv(f, "loot")))) {
		i = null;
		rt.forList(f, 0, rt.sv(f, "loot"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* g.new_(f, live(i), [rt.sv(f, "loc")]);
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.sv(f, "dextrous"))) {
		yield* g.srcCall(f, "drop_all_held_items");
	}
	if (!truthy(live(f.args[0]))) {
		if (truthy(rt.sv(f, "death_sound"))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.sv(f, "death_sound"), 200, 1]);
		}
		if ((truthy(rt.sv(f, "deathmessage")) || !truthy(rt.sv(f, "del_on_death")))) {
			yield* g.srcCall(f, "emote", "deathgasp");
		}
	}
	if (truthy(rt.sv(f, "del_on_death"))) {
		yield* g.callSuper(f, [], rt.Args.Same);
		rt.setSv(f, "del_on_death", 0);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		rt.setSv(f, "health", 0);
		rt.setSv(f, "icon_state", rt.sv(f, "icon_dead"));
		rt.setSv(f, "density", 0);
		rt.setSv(f, "lying", 1);
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["gibbed"] });

// /mob/living/simple_animal/proc/CanAttack  (code/modules/mob/living/simple_animal/simple_animal.dm:310)
rt.def("/mob/living/simple_animal/proc/CanAttack", function CanAttack(f: Frame, the_target: Value) {
	let L: Value = null, M: Value = null;
	f.vars = () => [L, M];
	if (rt.lt(rt.sv(f, "see_invisible"), rt.fv(f, "invisibility", live(the_target)))) {
		return 0;
	}
	if (truthy((rt.istype(live(the_target), T("/mob/living")) ? 1 : 0))) {
		if (!isEqual(rt.gv(f, "stat", (L = live(the_target))), 0)) {
			return 0;
		}
	}
	if (truthy((rt.istype(live(the_target), T("/obj/mecha")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "occupant", (M = live(the_target))))) {
			return 0;
		}
	}
	return 1;
});

// /mob/living/simple_animal/proc/revive  (code/modules/mob/living/simple_animal/simple_animal.dm:332)  may sleep
rt.def("/mob/living/simple_animal/proc/revive", function* revive(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	rt.setSv(f, "icon", rt.initial(f, live(f.src), "icon"));
	rt.setSv(f, "icon_state", rt.sv(f, "icon_living"));
	rt.setSv(f, "density", rt.initial(f, live(f.src), "density"));
	rt.setSv(f, "lying", 0);
	f.dot = 1;
	return f.dot;
}, true, { args: ["full_heal", "admin_revive"] });

// /mob/living/simple_animal/proc/make_babies  (code/modules/mob/living/simple_animal/simple_animal.dm:340)  may sleep
rt.def("/mob/living/simple_animal/proc/make_babies", function* make_babies(f: Frame) {
	let alone: Value = null, partner: Value = null, children: Value = null, M: Value = null, childspawn: Value = null, target: Value = null;
	let $e: any;
	f.vars = () => [alone, partner, children, M, childspawn, target, $e];
	if ((((((!isEqual(rt.sv(f, "gender"), "female") || truthy(rt.sv(f, "stat"))) || rt.gt(rt.sv(f, "next_scan_time"), rt.worldTime(f))) || !truthy(rt.sv(f, "childtype"))) || !truthy(rt.sv(f, "animal_species"))) || !truthy((yield* g.callName(f, rt.gl("SSticker"), "IsRoundInProgress", []))))) {
		return live(f.dot);
	}
	rt.setSv(f, "next_scan_time", add(rt.worldTime(f), 400));
	alone = 1;
	partner = null;
	children = 0;
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [7, live(f.src)])), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (!isEqual(rt.fv(f, "stat", live(M)), 0)) {
			continue;
		}
		if (truthy(rt.op(f, "IsType", [], [live(M), rt.sv(f, "childtype")]))) {
			children = rt.inc(live(children), 1);
		} else {
			if (truthy(rt.op(f, "IsType", [], [live(M), rt.sv(f, "animal_species")]))) {
				if (truthy(rt.fv(f, "ckey", live(M)))) {
					continue;
				}
				if ((!truthy(rt.op(f, "IsType", [], [live(M), rt.sv(f, "childtype")])) && isEqual(rt.fv(f, "gender", live(M)), "male"))) {
					partner = live(M);
				}
			} else {
				if ((truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0)) && !truthy((yield* g.srcCall(f, "faction_check_mob", live(M)))))) {
					return live(f.dot);
				}
			}
		}
	}
	rt.endFor(f, 0);
	if (!((truthy(live(alone)) && truthy(live(partner))) && rt.lt(live(children), 3))) return f.dot;
	childspawn = (yield* g.call(f, P("/proc/pickweight"), null, [rt.sv(f, "childtype")]));
	if (!truthy((target = rt.getStep(f, rt.sv(f, "loc"), 0)))) return f.dot;
	return (yield* g.new_(f, live(childspawn), [live(target)]));
}, true);

// /mob/living/simple_animal/proc/canUseTopic  (code/modules/mob/living/simple_animal/simple_animal.dm:367)
rt.def("/mob/living/simple_animal/proc/canUseTopic", function canUseTopic(f: Frame, M: Value, be_close: Value, no_dextery: Value) {
	f.vars = () => [be_close, no_dextery];
	if (live(be_close) === null) {
		be_close = 0;
	}
	if (live(no_dextery) === null) {
		no_dextery = 0;
	}
	if (truthy(rt.callSrc(f, "incapacitated", []))) {
		return 0;
	}
	if ((truthy(live(no_dextery)) || truthy(rt.sv(f, "dextrous")))) {
		if ((truthy(live(be_close)) && !rt.le(rt.call(f, P("/proc/get_dist"), null, [live(M), live(f.src)]), 1))) {
			return 0;
		}
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You don't have the dexterity to do this!</span>"]);
		return 0;
	}
	return 1;
});

// /mob/living/simple_animal/proc/stripPanelUnequip  (code/modules/mob/living/simple_animal/simple_animal.dm:378)  may sleep
rt.def("/mob/living/simple_animal/proc/stripPanelUnequip", function* stripPanelUnequip(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "canUseTopic", live(f.args[1]), 1)))) {
		return live(f.dot);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["what", "who", "where"] });

// /mob/living/simple_animal/proc/stripPanelEquip  (code/modules/mob/living/simple_animal/simple_animal.dm:384)  may sleep
rt.def("/mob/living/simple_animal/proc/stripPanelEquip", function* stripPanelEquip(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "canUseTopic", live(f.args[1]), 1)))) {
		return live(f.dot);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["what", "who", "where"] });

// /mob/living/simple_animal/proc/update_canmove  (code/modules/mob/living/simple_animal/simple_animal.dm:390)  may sleep
rt.def("/mob/living/simple_animal/proc/update_canmove", function* update_canmove(f: Frame) {
	if (((((truthy((yield* g.srcCall(f, "IsUnconscious"))) || truthy((yield* g.srcCall(f, "IsStun")))) || truthy((yield* g.srcCall(f, "IsKnockdown")))) || truthy(rt.sv(f, "stat"))) || truthy(rt.sv(f, "resting")))) {
		yield* g.srcCall(f, "drop_all_held_items");
		rt.setSv(f, "canmove", 0);
	} else {
		if (truthy(rt.sv(f, "buckled"))) {
			rt.setSv(f, "canmove", 0);
		} else {
			rt.setSv(f, "canmove", 1);
		}
	}
	yield* g.srcCall(f, "update_transform");
	yield* g.srcCall(f, "update_action_buttons_icon");
	return rt.sv(f, "canmove");
}, true);

// /mob/living/simple_animal/proc/update_transform  (code/modules/mob/living/simple_animal/simple_animal.dm:402)
rt.def("/mob/living/simple_animal/proc/update_transform", function update_transform(f: Frame) {
	let ntransform: Value = null, changed: Value = null;
	f.vars = () => [ntransform, changed];
	ntransform = rt.call(f, P("/proc/matrix"), null, [rt.sv(f, "transform")]);
	changed = 0;
	if (!isEqual(rt.sv(f, "resize"), 1)) {
		changed = rt.inc(live(changed), 1);
		rt.callName(f, live(ntransform), "Scale", [rt.sv(f, "resize")]);
		rt.setSv(f, "resize", 1);
	}
	if (!truthy(live(changed))) return f.dot;
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "transform", live(ntransform), "time", 2, "easing", 192]);
	return f.dot;
});

// /mob/living/simple_animal/proc/Destroy  (code/modules/mob/living/simple_animal/simple_animal.dm:417)  may sleep
rt.def("/mob/living/simple_animal/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "nest"))) {
		(rt.modField(f, rt.sv(f, "nest"), "spawned_mobs", live(f.src), subtract));
	}
	rt.setSv(f, "nest", null);
	(rt.modGl("simple_animals", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/proc/update_sight  (code/modules/mob/living/simple_animal/simple_animal.dm:427)
rt.def("/mob/living/simple_animal/proc/update_sight", function update_sight(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (!truthy(rt.sv(f, "client"))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "stat"), 2)) {
		rt.setSv(f, "sight", 28);
		rt.setSv(f, "see_in_dark", 8);
		rt.setSv(f, "see_invisible", 60);
		return live(f.dot);
	}
	rt.setSv(f, "see_invisible", rt.initial(f, live(f.src), "see_invisible"));
	rt.setSv(f, "see_in_dark", rt.initial(f, live(f.src), "see_in_dark"));
	rt.setSv(f, "sight", rt.initial(f, live(f.src), "sight"));
	if (!isEqual(rt.fv(f, "eye", rt.sv(f, "client")), live(f.src))) {
		if (truthy(rt.callName(f, (A = rt.fv(f, "eye", rt.sv(f, "client"))), "update_remote_sight", [live(f.src)]))) {
			return live(f.dot);
		}
	}
	rt.callSrc(f, "sync_lighting_plane_alpha", []);
	return f.dot;
});

// /mob/living/simple_animal/proc/OpenCraftingMenu  (code/modules/mob/living/simple_animal/simple_animal.dm:450)  may sleep
rt.def("/mob/living/simple_animal/proc/OpenCraftingMenu", function* OpenCraftingMenu(f: Frame) {
	if (!truthy(rt.sv(f, "dextrous"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "handcrafting"), "ui_interact", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/activate_hand  (code/modules/mob/living/simple_animal/simple_animal.dm:459)  may sleep
rt.def("/mob/living/simple_animal/proc/activate_hand", function* activate_hand(f: Frame) {
	if (!truthy(rt.sv(f, "dextrous"))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (!truthy(live(f.args[0]))) {
		f.args[0] = add(rt.modulus(rt.sv(f, "active_hand_index"), rt.len(f, rt.sv(f, "held_items"))), 1);
	}
	if (truthy((yield* g.call(f, P("/proc/istext"), null, [live(f.args[0])])))) {
		if ((isEqual((f.args[0] = (yield* g.call(f, P("/proc/lowertext"), null, [live(f.args[0])]))), "right") || isEqual(live(f.args[0]), "r"))) {
			f.args[0] = 2;
		}
		if ((isEqual(live(f.args[0]), "left") || isEqual(live(f.args[0]), "l"))) {
			f.args[0] = 1;
		}
	}
	if (!isEqual(live(f.args[0]), rt.sv(f, "active_hand_index"))) {
		yield* g.srcCall(f, "swap_hand", live(f.args[0]));
	} else {
		yield* g.srcCall(f, "mode");
	}
	return f.dot;
}, true, { args: ["selhand"] });

// /mob/living/simple_animal/proc/swap_hand  (code/modules/mob/living/simple_animal/simple_animal.dm:475)
rt.def("/mob/living/simple_animal/proc/swap_hand", function swap_hand(f: Frame) {
	let held_item: Value = null, _T: Value = null, oindex: Value = null, H: Value = null;
	f.vars = () => [held_item, _T, oindex, H];
	if (!truthy(rt.sv(f, "dextrous"))) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	if (!truthy(live(f.args[0]))) {
		f.args[0] = add(rt.modulus(rt.sv(f, "active_hand_index"), rt.len(f, rt.sv(f, "held_items"))), 1);
	}
	if (truthy((held_item = rt.callSrc(f, "get_active_held_item", [])))) {
		if (truthy((rt.istype(live(held_item), T("/obj/item/weapon/twohanded")) ? 1 : 0))) {
			if (isEqual(rt.gv(f, "wielded", (_T = live(held_item))), 1)) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>Your other hand is too busy holding the ＀.</span>", [rt.fv(f, "name", live(_T))])]);
				return live(f.dot);
			}
		}
	}
	oindex = rt.sv(f, "active_hand_index");
	rt.setSv(f, "active_hand_index", live(f.args[0]));
	if (!truthy(rt.sv(f, "hud_used"))) return f.dot;
	H = null;
	if (truthy((H = rt.index(rt.fv(f, "hand_slots", rt.sv(f, "hud_used")), fmt("＀", [live(f.args[0])]))))) {
		rt.callName(f, live(H), "update_icon", []);
	}
	if (!truthy((H = rt.index(rt.fv(f, "hand_slots", rt.sv(f, "hud_used")), fmt("＀", [live(oindex)]))))) return f.dot;
	rt.callName(f, live(H), "update_icon", []);
	return f.dot;
}, false, { args: ["hand_index"] });

// /mob/living/simple_animal/proc/put_in_hands  (code/modules/mob/living/simple_animal/simple_animal.dm:498)  may sleep
rt.def("/mob/living/simple_animal/proc/put_in_hands", function* put_in_hands(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_inv_hands");
	return f.dot;
}, true, { args: ["I"] });

// /mob/living/simple_animal/proc/update_inv_hands  (code/modules/mob/living/simple_animal/simple_animal.dm:502)
rt.def("/mob/living/simple_animal/proc/update_inv_hands", function update_inv_hands(f: Frame) {
	let l_hand: Value = null, r_hand: Value = null;
	f.vars = () => [l_hand, r_hand];
	if (!((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && !isEqual(rt.fv(f, "hud_version", rt.sv(f, "hud_used")), 3))) return f.dot;
	l_hand = rt.callSrc(f, "get_item_for_held_index", [1]);
	if (truthy((r_hand = rt.callSrc(f, "get_item_for_held_index", [2])))) {
		rt.setFv(f, "layer", live(r_hand), 20);
		rt.setFv(f, "plane", live(r_hand), 20);
		rt.setFv(f, "screen_loc", live(r_hand), rt.call(f, P("/proc/ui_hand_position"), null, [rt.callSrc(f, "get_held_index_of_item", [live(r_hand)])]));
		(rt.modField(f, rt.sv(f, "client"), "screen", live(r_hand), rt.bitOr));
	}
	if (!truthy(live(l_hand))) return f.dot;
	rt.setFv(f, "layer", live(l_hand), 20);
	rt.setFv(f, "plane", live(l_hand), 20);
	rt.setFv(f, "screen_loc", live(l_hand), rt.call(f, P("/proc/ui_hand_position"), null, [rt.callSrc(f, "get_held_index_of_item", [live(l_hand)])]));
	(rt.modField(f, rt.sv(f, "client"), "screen", live(l_hand), rt.bitOr));
	return f.dot;
});

// /mob/living/simple_animal/proc/unbuckle_mob  (code/modules/mob/living/simple_animal/simple_animal.dm:519)  may sleep
rt.def("/mob/living/simple_animal/proc/unbuckle_mob", function* unbuckle_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	if (truthy(rt.sv(f, "riding_datum"))) {
		yield* g.callName(f, rt.sv(f, "riding_datum"), "restore_position", [live(f.args[0])]);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["buckled_mob", "force", "check_loc"] });

// /mob/living/simple_animal/proc/user_buckle_mob  (code/modules/mob/living/simple_animal/simple_animal.dm:525)  may sleep
rt.def("/mob/living/simple_animal/proc/user_buckle_mob", function* user_buckle_mob(f: Frame, M: Value, user: Value) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [M, user, A, $e];
	if (!truthy(rt.sv(f, "riding_datum"))) return f.dot;
	if (truthy((yield* g.callName(f, live(user), "incapacitated", [])))) {
		return live(f.dot);
	}
	A = null;
	rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (((!isEqual(live(A), live(f.src)) && !isEqual(live(A), live(M))) && truthy(rt.fv(f, "density", live(A))))) {
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "loc", live(M), rt.getStep(f, live(f.src), 0));
	yield* g.callName(f, rt.sv(f, "riding_datum"), "handle_vehicle_offsets", []);
	rt.setFv(f, "ridden", rt.sv(f, "riding_datum"), live(f.src));
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/relaymove  (code/modules/mob/living/simple_animal/simple_animal.dm:535)  may sleep
rt.def("/mob/living/simple_animal/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	f.vars = () => [user, direction];
	if (!(truthy(rt.sv(f, "tame")) && truthy(rt.sv(f, "riding_datum")))) return f.dot;
	yield* g.callName(f, rt.sv(f, "riding_datum"), "handle_ride", [live(user), live(direction)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/Moved  (code/modules/mob/living/simple_animal/simple_animal.dm:539)  may sleep
rt.def("/mob/living/simple_animal/proc/Moved", function* Moved(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "riding_datum"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "riding_datum"), "on_vehicle_move", []);
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/buckle_mob  (code/modules/mob/living/simple_animal/simple_animal.dm:545)  may sleep
rt.def("/mob/living/simple_animal/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "riding_datum", (yield* g.new_(f, T("/datum/riding/animal"), [])));
	return f.dot;
}, true, { args: ["buckled_mob", "force", "check_loc"] });
