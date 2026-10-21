// From code/modules/mob/living/simple_animal/hostile/retaliate/ghost.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4938, "/mob/living/simple_animal/hostile/retaliate/ghost", "/mob/living/simple_animal/hostile/retaliate", {
	ghost_hair_style: null,
	ghost_hair_color: null,
	ghost_hair: null,
	ghost_facial_hair_style: null,
	ghost_facial_hair_color: null,
	ghost_facial_hair: null,
	random: 1,
	pressure_resistance: 300,
	name: "ghost",
	desc: "A soul of the dead, spooky.",
	icon: rt.rsc("icons/mob/mob.dmi"),
	icon_state: "ghost",
	icon_living: "ghost",
	speak_chance: 0,
	turns_per_move: 5,
	response_help: "passes through",
	response_disarm: "shoves",
	response_harm: "hits",
	a_intent: "harm",
	healable: 0,
	speed: 0,
	maxHealth: 40,
	health: 40,
	harm_intent_damage: 10,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	del_on_death: 1,
	emote_see: null,
	attacktext: "grips",
	attack_sound: rt.rsc("sound/hallucinations/growl1.ogg"),
	speak_emote: null,
	deathmessage: "wails, disintegrating into a pile of ectoplasm!",
	loot: null,
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1500,
	movement_type: 2,
	gold_core_spawnable: 0,
});

// /mob/living/simple_animal/hostile/retaliate/ghost/proc/<init>  (code/modules/mob/living/simple_animal/hostile/retaliate/ghost.dm:24)
rt.def("/mob/living/simple_animal/hostile/retaliate/ghost/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "emote_see", rt.list("weeps silently", "groans", "mumbles"));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("weeps"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/item/weapon/ectoplasm")));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/retaliate/ghost/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/retaliate/ghost.dm:42)  may sleep
rt.def("/mob/living/simple_animal/hostile/retaliate/ghost/proc/Initialize", function* Initialize(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "give_hair");
	yield* g.srcCall(f, "set_light", 1, 2);
	if (!truthy(rt.sv(f, "random"))) return f.dot;
	$0 = (yield* g.call(f, P("/proc/rand"), null, [0, 1]));
	if ($0 === 0) {
		rt.setSv(f, "name", fmt("ghost of ＀ ＀", [rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_male")]), rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")])]));
	} else if ($0 === 1) {
		rt.setSv(f, "name", fmt("ghost of ＀ ＀", [rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_female")]), rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")])]));
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/retaliate/ghost/proc/give_hair  (code/modules/mob/living/simple_animal/hostile/retaliate/ghost.dm:54)
rt.def("/mob/living/simple_animal/hostile/retaliate/ghost/proc/give_hair", function give_hair(f: Frame) {
	if (rt.sv(f, "ghost_hair_style") !== null) {
		rt.setSv(f, "ghost_hair", rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/human_face.dmi"), fmt("hair_＀", [rt.sv(f, "ghost_hair_style")]), -8]));
		rt.setFv(f, "alpha", rt.sv(f, "ghost_hair"), 200);
		rt.setFv(f, "color", rt.sv(f, "ghost_hair"), rt.sv(f, "ghost_hair_color"));
		rt.callSrc(f, "add_overlay", [rt.sv(f, "ghost_hair")]);
	}
	if (rt.sv(f, "ghost_facial_hair_style") === null) return f.dot;
	rt.setSv(f, "ghost_facial_hair", rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/human_face.dmi"), fmt("facial_＀", [rt.sv(f, "ghost_facial_hair_style")]), -8]));
	rt.setFv(f, "alpha", rt.sv(f, "ghost_facial_hair"), 200);
	rt.setFv(f, "color", rt.sv(f, "ghost_facial_hair"), rt.sv(f, "ghost_facial_hair_color"));
	rt.callSrc(f, "add_overlay", [rt.sv(f, "ghost_facial_hair")]);
	return f.dot;
});
