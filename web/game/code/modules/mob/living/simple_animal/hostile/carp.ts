// From code/modules/mob/living/simple_animal/hostile/carp.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4902, "/mob/living/simple_animal/hostile/carp", "/mob/living/simple_animal/hostile", {
	pressure_resistance: 200,
	name: "space carp",
	desc: "A ferocious, fang-bearing creature that resembles a fish.",
	icon_state: "carp",
	icon_living: "carp",
	icon_dead: "carp_dead",
	icon_gib: "carp_gib",
	speak_chance: 0,
	turns_per_move: 5,
	butcher_results: null,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "hits",
	emote_taunt: null,
	taunt_chance: 30,
	speed: 0,
	maxHealth: 25,
	health: 25,
	harm_intent_damage: 8,
	obj_damage: 50,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	attacktext: "bites",
	attack_sound: rt.rsc("sound/weapons/bite.ogg"),
	speak_emote: null,
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1500,
	faction: null,
	movement_type: 2,
	gold_core_spawnable: 1,
});

// /mob/living/simple_animal/hostile/carp/proc/<init>  (code/modules/mob/living/simple_animal/hostile/carp.dm:10)
rt.def("/mob/living/simple_animal/hostile/carp/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/carpmeat"), 2]));
	$0 = $0;
	rt.setSv(f, "emote_taunt", rt.list("gnashes"));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("gnashes"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("carp"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/carp/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/carp.dm:42)  may sleep
rt.def("/mob/living/simple_animal/hostile/carp/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && truthy((rt.istype(rt.sv(f, "target"), T("/mob/living/carbon/human")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, (H = rt.sv(f, "target")), "adjustStaminaLoss", [8]);
	return f.dot;
}, true);

rt.type(4907, "/mob/living/simple_animal/hostile/carp/cayenne", "/mob/living/simple_animal/hostile/carp", {
	name: "Cayenne",
	desc: "A failed Syndicate experiment in weaponized space carp technology, it now serves as a lovable mascot.",
	gender: "female",
	speak_emote: null,
	gold_core_spawnable: 0,
	faction: null,
	AIStatus: 3,
});

// /mob/living/simple_animal/hostile/carp/cayenne/proc/<init>  (code/modules/mob/living/simple_animal/hostile/carp.dm:76)
rt.def("/mob/living/simple_animal/hostile/carp/cayenne/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("squeaks"));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("syndicate"));
	return f.dot;
});
