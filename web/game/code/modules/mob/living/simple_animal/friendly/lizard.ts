// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/lizard.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(4942, "/mob/living/simple_animal/hostile/lizard", "/mob/living/simple_animal/hostile", {
	pass_flags: 17,
	name: "Lizard",
	desc: "A cute tiny lizard.",
	icon_state: "lizard",
	icon_living: "lizard",
	icon_dead: "lizard_dead",
	speak_emote: null,
	health: 5,
	maxHealth: 5,
	faction: null,
	attacktext: "bites",
	melee_damage_lower: 1,
	melee_damage_upper: 2,
	response_help: "pets",
	response_disarm: "shoos",
	response_harm: "stomps on",
	ventcrawler: 2,
	density: 0,
	mob_size: 1,
	gold_core_spawnable: 2,
	obj_damage: 0,
	environment_smash: 0,
}, { global: { edibles: 1046 } });

// lizard.dm:7
rt.def("/mob/living/simple_animal/hostile/lizard/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("hisses");

	this.faction = list("Lizard");
	return f.dot;
});

// lizard.dm:27
rt.def("/mob/living/simple_animal/hostile/lizard/proc/CanAttack", function CanAttack(f: Frame, the_target: Value) {
	if (this.see_invisible < the_target.invisibility) {
		return 0;
	}
	if (is_type_in_typecache(the_target, GLOB.edibles)) {
		return 1;
	}
	return 0;
});

// lizard.dm:34
rt.def("/mob/living/simple_animal/hostile/lizard/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (is_type_in_typecache(this.target, GLOB.edibles)) {
		this.visible_message(`${this.name} consumes ${this.target} in a single gulp`, `<span class='notice'>You consume ${this.target} in a single gulp</span>`);
		yield* qdel(this.target);
		this.target = null;
		yield* this.adjustBruteLoss(-2);
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);
