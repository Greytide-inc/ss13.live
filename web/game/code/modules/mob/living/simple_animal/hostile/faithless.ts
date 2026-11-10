// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/faithless.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(4956, "/mob/living/simple_animal/hostile/faithless", "/mob/living/simple_animal/hostile", {
	name: "The Faithless",
	desc: "The Wish Granter's faith in humanity, incarnate",
	icon_state: "faithless",
	icon_living: "faithless",
	icon_dead: "faithless_dead",
	gender: "male",
	speak_chance: 0,
	turns_per_move: 5,
	response_help: "passes through",
	response_disarm: "shoves",
	response_harm: "hits",
	emote_taunt: null,
	taunt_chance: 25,
	speed: 0,
	maxHealth: 80,
	health: 80,
	stat_attack: 1,
	robust_searching: 1,
	harm_intent_damage: 10,
	obj_damage: 50,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	attacktext: "grips",
	attack_sound: rt.rsc("sound/hallucinations/growl1.ogg"),
	speak_emote: null,
	atmos_requirements: null,
	minbodytemp: 0,
	faction: null,
	gold_core_spawnable: 1,
});

// faithless.dm:13
rt.def("/mob/living/simple_animal/hostile/faithless/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.emote_taunt = list("wails");

	this.speak_emote = list("growls");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);

	this.faction = list("faithless");
	return f.dot;
});

// faithless.dm:39
rt.def("/mob/living/simple_animal/hostile/faithless/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let C: Value = null;
	f.dot = (yield* parent_proc());
	if (!(f.dot && prob(12) && rt.istype(this.target, T("/mob/living/carbon")))) return f.dot;
	yield* (C = this.target).Knockdown(60);
	C.visible_message(fmt("<span class='danger'>＄！ knocks down ％！!</span>", [this, C]), fmt("<span class='userdanger'>＄！ knocks you down!</span>", [this]));
	return f.dot;
}, true);
