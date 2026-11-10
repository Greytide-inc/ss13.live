// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/hivebot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4958, "/mob/living/simple_animal/hostile/hivebot", "/mob/living/simple_animal/hostile", {
	name: "hivebot",
	desc: "A small robot.",
	icon: rt.rsc("icons/mob/hivebot.dmi"),
	icon_state: "basic",
	icon_living: "basic",
	icon_dead: "basic",
	gender: "neuter",
	health: 15,
	maxHealth: 15,
	healable: 0,
	melee_damage_lower: 2,
	melee_damage_upper: 3,
	attacktext: "claws",
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	projectilesound: rt.rsc("sound/weapons/gunshot.ogg"),
	projectiletype: rt.typePath("/obj/item/projectile/hivebotbullet"),
	faction: null,
	check_friendly_fire: 1,
	atmos_requirements: null,
	minbodytemp: 0,
	speak_emote: null,
	gold_core_spawnable: 1,
	del_on_death: 1,
	loot: null,
});

// hivebot.dm:22
rt.def("/mob/living/simple_animal/hostile/hivebot/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("hivebot");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);

	this.speak_emote = list("states");

	this.loot = list(T("/obj/effect/decal/cleanable/robot_debris"));
	return f.dot;
});

// hivebot.dm:32
rt.def("/mob/living/simple_animal/hostile/hivebot/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.deathmessage = `${this} blows apart!`;
	return f.dot;
}, true);

// hivebot.dm:65
rt.def("/mob/living/simple_animal/hostile/hivebot/proc/death", function* death(f: Frame, gibbed: Value) {
	yield* do_sparks(3, 1, this);
	yield* parent_proc(1);
	return f.dot;
}, true);
