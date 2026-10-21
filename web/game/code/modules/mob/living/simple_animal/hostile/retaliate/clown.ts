// From code/modules/mob/living/simple_animal/hostile/retaliate/clown.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4936, "/mob/living/simple_animal/hostile/retaliate/clown", "/mob/living/simple_animal/hostile/retaliate", {
	name: "Clown",
	desc: "A denizen of clown planet",
	icon: rt.rsc("icons/mob/simple_human.dmi"),
	icon_state: "clown",
	icon_living: "clown",
	icon_dead: "clown_dead",
	icon_gib: "clown_gib",
	turns_per_move: 5,
	response_help: "pokes",
	response_disarm: "gently pushes aside",
	response_harm: "robusts",
	speak: null,
	emote_see: null,
	speak_chance: 1,
	a_intent: "harm",
	maxHealth: 75,
	health: 75,
	speed: 0,
	harm_intent_damage: 8,
	melee_damage_lower: 10,
	melee_damage_upper: 10,
	attacktext: "attacks",
	attack_sound: rt.rsc("sound/items/bikehorn.ogg"),
	obj_damage: 0,
	environment_smash: 0,
	del_on_death: 1,
	loot: null,
	atmos_requirements: null,
	minbodytemp: 270,
	maxbodytemp: 370,
	unsuitable_atmos_damage: 10,
});

// /mob/living/simple_animal/hostile/retaliate/clown/proc/<init>  (code/modules/mob/living/simple_animal/hostile/retaliate/clown.dm:28)
rt.def("/mob/living/simple_animal/hostile/retaliate/clown/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("HONK", "Honk!", "Welcome to clown planet!"));
	rt.setSv(f, "emote_see", rt.list("honks", "squeaks"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/effect/mob_spawn/human/clown/corpse")));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 5, "max_oxy", 0, "min_tox", 0, "max_tox", 1, "min_co2", 0, "max_co2", 5, "min_n2", 0, "max_n2", 0]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/retaliate/clown/proc/handle_temperature_damage  (code/modules/mob/living/simple_animal/hostile/retaliate/clown.dm:36)  may sleep
rt.def("/mob/living/simple_animal/hostile/retaliate/clown/proc/handle_temperature_damage", function* handle_temperature_damage(f: Frame) {
	if (rt.lt(rt.sv(f, "bodytemperature"), rt.sv(f, "minbodytemp"))) {
		yield* g.srcCall(f, "adjustBruteLoss", 10);
	} else {
		if (!rt.gt(rt.sv(f, "bodytemperature"), rt.sv(f, "maxbodytemp"))) return f.dot;
		yield* g.srcCall(f, "adjustBruteLoss", 15);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/retaliate/clown/proc/attack_hand  (code/modules/mob/living/simple_animal/hostile/retaliate/clown.dm:42)  may sleep
rt.def("/mob/living/simple_animal/hostile/retaliate/clown/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/bikehorn.ogg"), 50, 1]);
	return f.dot;
}, true, { args: ["M"] });
