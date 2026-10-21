// From code/modules/mob/living/simple_animal/hostile/eyeballs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4908, "/mob/living/simple_animal/hostile/carp/eyeball", "/mob/living/simple_animal/hostile/carp", {
	name: "eyeball",
	desc: "An odd looking creature, it won't stop staring...",
	icon_state: "eyeball",
	icon_living: "eyeball",
	icon_gib: "",
	gender: "neuter",
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "hits",
	emote_taunt: null,
	taunt_chance: 25,
	maxHealth: 45,
	health: 45,
	speak_emote: null,
	harm_intent_damage: 15,
	obj_damage: 60,
	melee_damage_lower: 20,
	melee_damage_upper: 25,
	attacktext: "blinks at",
	attack_sound: rt.rsc("sound/weapons/pierce.ogg"),
	movement_type: 2,
	faction: null,
	del_on_death: 1,
});

// /mob/living/simple_animal/hostile/carp/eyeball/proc/<init>  (code/modules/mob/living/simple_animal/hostile/eyeballs.dm:13)
rt.def("/mob/living/simple_animal/hostile/carp/eyeball/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "emote_taunt", rt.list("glares"));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("telepathically cries"));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("spooky"));
	return f.dot;
});
