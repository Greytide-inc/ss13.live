// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/tree.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, subtract, fmt } = rt;


rt.type(4994, "/mob/living/simple_animal/hostile/tree", "/mob/living/simple_animal/hostile", {
	emote_taunt: null,
	taunt_chance: 20,
	name: "pine tree",
	desc: "A pissed off tree-like alien. It seems annoyed with the festivities...",
	icon: rt.rsc("icons/obj/flora/pinetrees.dmi"),
	icon_state: "pine_1",
	icon_living: "pine_1",
	icon_dead: "pine_1",
	icon_gib: "pine_1",
	gender: "neuter",
	speak_chance: 0,
	turns_per_move: 5,
	response_help: "brushes",
	response_disarm: "pushes",
	response_harm: "hits",
	speed: 1,
	maxHealth: 250,
	health: 250,
	mob_size: 3,
	pixel_x: -16,
	harm_intent_damage: 5,
	melee_damage_lower: 8,
	melee_damage_upper: 12,
	attacktext: "bites",
	attack_sound: rt.rsc("sound/weapons/bite.ogg"),
	speak_emote: null,
	atmos_requirements: null,
	unsuitable_atmos_damage: 5,
	minbodytemp: 0,
	maxbodytemp: 1200,
	faction: null,
	deathmessage: "is hacked into pieces!",
	loot: null,
	gold_core_spawnable: 1,
	del_on_death: 1,
});

// tree.dm:28
rt.def("/mob/living/simple_animal/hostile/tree/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.emote_taunt = list("growls");

	this.speak_emote = list("pines");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 2, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);

	this.faction = list("hostile");

	this.loot = list(T("/obj/item/stack/sheet/mineral/wood"));
	return f.dot;
});

// tree.dm:43
rt.def("/mob/living/simple_animal/hostile/tree/proc/Life", function Life(f: Frame) {
	let _T: Value = null, co2: Value = null;
	parent_proc();
	if (!rt.istype(this.loc, T("/turf/open"))) return f.dot;
	if (!((_T = this.loc).air && rt.index(_T.air.gases, "co2"))) return f.dot;
	if (!((co2 = rt.index(rt.index(_T.air.gases, "co2"), 1)) > 0)) return f.dot;
	if (!prob(25)) return f.dot;
	let amt: Value = min(co2, 9);
	(rt.modAt(rt.index(_T.air.gases, "co2"), 1, amt, subtract));
	_T.atmos_spawn_air(`o2=${amt}`);
	return f.dot;
}, false, { waitfor: false });

// tree.dm:55
rt.def("/mob/living/simple_animal/hostile/tree/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!rt.istype(this.target, T("/mob/living/carbon"))) return f.dot;
	let C: Value = this.target;
	if (!prob(15)) return f.dot;
	yield* C.Knockdown(60);
	C.visible_message(fmt("<span class='danger'>＄！ knocks down ％！!</span>", [this, C]), fmt("<span class='userdanger'>＄！ knocks you down!</span>", [this]));
	return f.dot;
}, true);

rt.type(4995, "/mob/living/simple_animal/hostile/tree/festivus", "/mob/living/simple_animal/hostile/tree", {
	name: "festivus pole",
	desc: "serenity now... SERENITY NOW!",
	icon_state: "festivus_pole",
	icon_living: "festivus_pole",
	icon_dead: "festivus_pole",
	icon_gib: "festivus_pole",
	loot: null,
	speak_emote: null,
});

// tree.dm:70
rt.def("/mob/living/simple_animal/hostile/tree/festivus/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.loot = list(T("/obj/item/stack/rods"));

	this.speak_emote = list("polls");
	return f.dot;
});
