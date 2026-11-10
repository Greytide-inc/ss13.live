// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/creature.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(4955, "/mob/living/simple_animal/hostile/creature", "/mob/living/simple_animal/hostile", {
	name: "creature",
	desc: "A sanity-destroying otherthing.",
	icon_state: "otherthing",
	icon_living: "otherthing",
	icon_dead: "otherthing-dead",
	health: 80,
	maxHealth: 80,
	obj_damage: 100,
	melee_damage_lower: 25,
	melee_damage_upper: 50,
	attacktext: "chomps",
	attack_sound: rt.rsc("sound/weapons/bite.ogg"),
	faction: null,
	speak_emote: null,
	gold_core_spawnable: 1,
	atmos_requirements: null,
	minbodytemp: 0,
});

// creature.dm:14
rt.def("/mob/living/simple_animal/hostile/creature/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("creature");

	this.speak_emote = list("screams");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);
	return f.dot;
});
