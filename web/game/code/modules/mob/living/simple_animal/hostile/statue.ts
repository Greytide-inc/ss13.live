// From code/modules/mob/living/simple_animal/hostile/statue.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4989, "/mob/living/simple_animal/hostile/statue", "/mob/living/simple_animal/hostile", {
	cannot_be_seen: 1,
	creator: null,
	move_to_delay: 0,
	hud_possible: null,
	vision_range: 12,
	aggro_vision_range: 12,
	idle_vision_range: 12,
	search_objects: 1,
	anchored: 1,
	name: "statue",
	desc: "An incredibly lifelike marble carving. Its eyes seems to follow you..",
	icon: rt.rsc("icons/obj/statue.dmi"),
	icon_state: "human_male",
	icon_living: "human_male",
	icon_dead: "human_male",
	gender: "neuter",
	a_intent: "harm",
	response_help: "touches",
	response_disarm: "pushes",
	speed: -1,
	maxHealth: 50000,
	health: 50000,
	healable: 0,
	harm_intent_damage: 10,
	obj_damage: 100,
	melee_damage_lower: 68,
	melee_damage_upper: 83,
	attacktext: "claws",
	attack_sound: rt.rsc("sound/hallucinations/growl1.ogg"),
	atmos_requirements: null,
	minbodytemp: 0,
	faction: null,
	animate_movement: 0,
	see_in_dark: 13,
	lighting_alpha: 192,
	sight: 60,
	gold_core_spawnable: 1,
});

// /mob/living/simple_animal/hostile/statue/proc/<init>  (code/modules/mob/living/simple_animal/hostile/statue.dm:35)
rt.def("/mob/living/simple_animal/hostile/statue/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "hud_possible", rt.list("15"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("statue"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/statue/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/statue.dm:58)  may sleep
rt.def("/mob/living/simple_animal/hostile/statue/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "mob_spell_list", (yield* g.new_(f, T("/obj/effect/proc_holder/spell/aoe_turf/flicker_lights"), [live(f.src)])), add);
	rt.modSrcVar(f, "mob_spell_list", (yield* g.new_(f, T("/obj/effect/proc_holder/spell/aoe_turf/blindness"), [live(f.src)])), add);
	rt.modSrcVar(f, "mob_spell_list", (yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/night_vision"), [live(f.src)])), add);
	if (!truthy(live(f.args[1]))) return f.dot;
	rt.setFv(f, "creator", live(f.src), live(f.args[1]));
	return f.dot;
}, true, { args: ["mapload", "creator"] });

// /mob/living/simple_animal/hostile/statue/proc/Move  (code/modules/mob/living/simple_animal/hostile/statue.dm:75)  may sleep
rt.def("/mob/living/simple_animal/hostile/statue/proc/Move", function* Move(f: Frame) {
	if (truthy((yield* g.srcCall(f, "can_be_seen", live(f.args[0]))))) {
		if (truthy(rt.sv(f, "client"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You cannot move, there are eyes on you!</span>"]);
		}
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["NewLoc"] });

// /mob/living/simple_animal/hostile/statue/proc/Life  (code/modules/mob/living/simple_animal/hostile/statue.dm:82)  may sleep
rt.def("/mob/living/simple_animal/hostile/statue/proc/Life", function* Life(f: Frame) {
	let watching: Value = null;
	f.vars = () => [watching];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(!truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "target")))) return f.dot;
	if (!(truthy((watching = (yield* g.srcCall(f, "can_be_seen")))) && !isEqual(live(watching), rt.sv(f, "target")))) return f.dot;
	if (!rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(watching), live(f.src)])), (yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "target"), live(f.src)])))) return f.dot;
	yield* g.srcCall(f, "LoseTarget");
	yield* g.srcCall(f, "GiveTarget", live(watching));
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/statue/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/statue.dm:93)  may sleep
rt.def("/mob/living/simple_animal/hostile/statue/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (truthy((yield* g.srcCall(f, "can_be_seen", rt.getStep(f, rt.sv(f, "loc"), 0))))) {
		if (truthy(rt.sv(f, "client"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You cannot attack, there are eyes on you!</span>"]);
		}
		return 0;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/statue/proc/DestroySurroundings  (code/modules/mob/living/simple_animal/hostile/statue.dm:101)  may sleep
rt.def("/mob/living/simple_animal/hostile/statue/proc/DestroySurroundings", function* DestroySurroundings(f: Frame) {
	if (truthy((yield* g.srcCall(f, "can_be_seen", rt.getStep(f, rt.sv(f, "loc"), 0))))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/statue/proc/face_atom  (code/modules/mob/living/simple_animal/hostile/statue.dm:105)  may sleep
rt.def("/mob/living/simple_animal/hostile/statue/proc/face_atom", function* face_atom(f: Frame) {
	if (truthy((yield* g.srcCall(f, "can_be_seen", rt.getStep(f, rt.sv(f, "loc"), 0))))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/statue/proc/can_be_seen  (code/modules/mob/living/simple_animal/hostile/statue.dm:109)
rt.def("/mob/living/simple_animal/hostile/statue/proc/can_be_seen", function can_be_seen(f: Frame, destination: Value) {
	let _T: Value = null, check_list: Value = null, check: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [destination, _T, check_list, check, M, $e];
	if (!truthy(rt.sv(f, "cannot_be_seen"))) {
		return null;
	}
	if (((truthy((_T = rt.getStep(f, rt.sv(f, "loc"), 0))) && truthy(live(destination))) && truthy(rt.fv(f, "lighting_object", live(_T))))) {
		if ((rt.lt(rt.callName(f, live(_T), "get_lumcount", []), 0.10000000149011612) && rt.lt(rt.callName(f, live(destination), "get_lumcount", []), 0.10000000149011612))) {
			return null;
		}
		if (isEqual(live(_T), live(destination))) {
			destination = null;
		}
	}
	check_list = rt.list(live(f.src));
	if (truthy(live(destination))) {
		check_list = rt.modify(live(check_list), live(destination), add);
	}
	check = null;
	rt.forList(f, 0, live(check_list), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		check = $e;
		M = null;
		rt.forList(f, 1, subtract(rt.call(f, P("/proc/viewers"), null, [add(rt.fv(f, "view", rt.world()), 1), live(check)]), live(f.src)), T("/mob/living"));
		while (($e = rt.next(f, 1)) !== undefined) {
			M = $e;
			if (((truthy(rt.fv(f, "client", live(M))) && truthy(rt.callSrc(f, "CanAttack", [live(M)]))) && !truthy(rt.fv(f, "has_unlimited_silicon_privilege", live(M))))) {
				if (!truthy(rt.fv(f, "eye_blind", live(M)))) {
					return live(M);
				}
			}
		}
		rt.endFor(f, 1);
		M = null;
		rt.forList(f, 1, rt.call(f, P("/proc/view"), null, [add(rt.fv(f, "view", rt.world()), 1), live(check)]), T("/obj/mecha"));
		while (($e = rt.next(f, 1)) !== undefined) {
			M = $e;
			if ((truthy(rt.fv(f, "occupant", live(M))) && truthy(rt.gv(f, "client", rt.fv(f, "occupant", live(M)))))) {
				if (!truthy(rt.gv(f, "eye_blind", rt.fv(f, "occupant", live(M))))) {
					return rt.fv(f, "occupant", live(M));
				}
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return null;
});

// /mob/living/simple_animal/hostile/statue/proc/gib  (code/modules/mob/living/simple_animal/hostile/statue.dm:144)  may sleep
rt.def("/mob/living/simple_animal/hostile/statue/proc/gib", function* gib(f: Frame) {
	yield* g.srcCall(f, "dust");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/statue/proc/CanAttack  (code/modules/mob/living/simple_animal/hostile/statue.dm:150)
rt.def("/mob/living/simple_animal/hostile/statue/proc/CanAttack", function CanAttack(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		if ((!truthy(rt.gv(f, "client", (L = live(f.args[0])))) && !truthy(rt.fv(f, "ckey", live(L))))) {
			return 0;
		}
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["the_target"] });

// /mob/living/simple_animal/hostile/statue/proc/ListTargets  (code/modules/mob/living/simple_animal/hostile/statue.dm:159)
rt.def("/mob/living/simple_animal/hostile/statue/proc/ListTargets", function ListTargets(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return subtract(live(f.dot), rt.sv(f, "creator"));
});

rt.type(11350, "/obj/effect/proc_holder/spell/aoe_turf/flicker_lights", "/obj/effect/proc_holder/spell/aoe_turf", {
	name: "Flicker Lights",
	desc: "You will trigger a large amount of lights around you to flicker.",
	charge_max: 300,
	clothes_req: 0,
	range: 14,
});

// /obj/effect/proc_holder/spell/aoe_turf/flicker_lights/proc/cast  (code/modules/mob/living/simple_animal/hostile/statue.dm:174)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/flicker_lights/proc/cast", function cast(f: Frame, targets: Value, user: Value) {
	let _T: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [user, _T, L, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	_T = null;
	rt.forList(f, 0, live(targets), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		L = null;
		rt.forList(f, 1, live(_T), T("/obj/machinery/light"));
		while (($e = rt.next(f, 1)) !== undefined) {
			L = $e;
			rt.callName(f, live(L), "flicker", []);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return live(f.dot);
});

rt.type(11351, "/obj/effect/proc_holder/spell/aoe_turf/blindness", "/obj/effect/proc_holder/spell/aoe_turf", {
	name: "Blindness",
	desc: "Your prey will be momentarily blind for you to advance on them.",
	message: "<span class='notice'>You glare your eyes.</span>",
	charge_max: 600,
	clothes_req: 0,
	range: 10,
});

// /obj/effect/proc_holder/spell/aoe_turf/blindness/proc/cast  (code/modules/mob/living/simple_animal/hostile/statue.dm:190)  may sleep
rt.def("/obj/effect/proc_holder/spell/aoe_turf/blindness/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let L: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [targets, user, L, _T, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	L = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy((rt.isIn(f, ((_T = rt.getStep(f, rt.fv(f, "loc", live(L)), 0)) && live(_T)), live(targets)) ? 1 : 0))) {
			yield* g.callName(f, live(L), "blind_eyes", [4]);
		}
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true);

rt.type(11276, "/obj/effect/proc_holder/spell/targeted/night_vision", "/obj/effect/proc_holder/spell/targeted", {
	name: "Toggle Nightvision [ON]",
	desc: "Toggle your nightvision mode.",
	charge_max: 10,
	clothes_req: 0,
	message: "<span class='notice'>You toggle your night vision!</span>",
	range: -1,
	include_user: 1,
});

// /obj/effect/proc_holder/spell/targeted/night_vision/proc/cast  (code/modules/mob/living/simple_animal/hostile/statue.dm:209)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/night_vision/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null;
	let $0: any, $e: any;
	f.vars = () => [targets, user, target, $0, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	target = null;
	rt.forList(f, 0, live(targets), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target = $e;
		$0 = rt.fv(f, "lighting_alpha", live(target));
		if ($0 === 255) {
			rt.setFv(f, "lighting_alpha", live(target), 192);
			rt.setSv(f, "name", "Toggle Nightvision [More]");
		} else if ($0 === 192) {
			rt.setFv(f, "lighting_alpha", live(target), 128);
			rt.setSv(f, "name", "Toggle Nightvision [Full]");
		} else if ($0 === 128) {
			rt.setFv(f, "lighting_alpha", live(target), 0);
			rt.setSv(f, "name", "Toggle Nightvision [OFF]");
		} else {
			rt.setFv(f, "lighting_alpha", live(target), 255);
			rt.setSv(f, "name", "Toggle Nightvision [ON]");
		}
		yield* g.callName(f, live(target), "update_sight", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/statue/proc/sentience_act  (code/modules/mob/living/simple_animal/hostile/statue.dm:226)
rt.def("/mob/living/simple_animal/hostile/statue/proc/sentience_act", function sentience_act(f: Frame) {
	(rt.modSrcVar(f, "faction", "neutral", subtract));
	return f.dot;
});

// /mob/living/simple_animal/hostile/statue/proc/restrained  (code/modules/mob/living/simple_animal/hostile/statue.dm:229)
rt.def("/mob/living/simple_animal/hostile/statue/proc/restrained", function restrained(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.callSrc(f, "can_be_seen", [rt.sv(f, "loc")]))) return f.dot;
	return 1;
}, false, { args: ["ignore_grab"] });
