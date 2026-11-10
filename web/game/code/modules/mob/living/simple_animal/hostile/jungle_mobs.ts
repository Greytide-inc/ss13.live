// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/jungle_mobs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4964, "/mob/living/simple_animal/hostile/jungle", "/mob/living/simple_animal/hostile", {
	vision_range: 5,
	atmos_requirements: null,
	faction: null,
	weather_immunities: null,
	obj_damage: 30,
	environment_smash: 2,
	minbodytemp: 0,
	maxbodytemp: 450,
	response_help: "pokes",
	response_disarm: "shoves",
	response_harm: "strikes",
	status_flags: 0,
	a_intent: "harm",
	see_in_dark: 4,
	lighting_alpha: 128,
	mob_size: 3,
});

// jungle_mobs.dm:3
rt.def("/mob/living/simple_animal/hostile/jungle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);

	this.faction = list("jungle");

	this.weather_immunities = list("acid");
	return f.dot;
});

rt.type(4965, "/mob/living/simple_animal/hostile/jungle/mega_arachnid", "/mob/living/simple_animal/hostile/jungle", {
	ranged: 1,
	move_to_delay: 10,
	aggro_vision_range: 9,
	ranged_cooldown_time: 60,
	projectilesound: rt.rsc("sound/weapons/pierce.ogg"),
	name: "mega arachnid",
	desc: "Though physically imposing, it prefers to ambush its prey, and it will only engage with an already crippled opponent.",
	melee_damage_lower: 30,
	melee_damage_upper: 30,
	maxHealth: 300,
	health: 300,
	speed: 1,
	pixel_x: -16,
	speak_emote: null,
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	projectiletype: rt.typePath("/obj/item/projectile/mega_arachnid"),
	icon: rt.rsc("icons/mob/jungle/arachnid.dmi"),
	icon_state: "arachnid",
	icon_living: "arachnid",
	icon_dead: "dead_purple",
	alpha: 50,
});

// jungle_mobs.dm:35
rt.def("/mob/living/simple_animal/hostile/jungle/mega_arachnid/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("chitters");
	return f.dot;
});

// jungle_mobs.dm:47
rt.def("/mob/living/simple_animal/hostile/jungle/mega_arachnid/proc/Life", function Life(f: Frame) {
	let C: Value = null;
	parent_proc();
	if (this.target && this.ranged_cooldown > rt.worldTime(f) && rt.istype(this.target, T("/mob/living/carbon"))) {
		if (!(C = this.target).legcuffed && C.health < 50) {
			this.retreat_distance = 9;
			this.minimum_distance = 9;
			this.alpha = 125;
			return f.dot;
		}
	}
	this.retreat_distance = 0;
	this.minimum_distance = 0;
	this.alpha = 255;
	return f.dot;
}, false, { waitfor: false });

// jungle_mobs.dm:61
rt.def("/mob/living/simple_animal/hostile/jungle/mega_arachnid/proc/Aggro", function* Aggro(f: Frame) {
	yield* parent_proc();
	this.alpha = 255;
	return f.dot;
}, true);

// jungle_mobs.dm:65
rt.def("/mob/living/simple_animal/hostile/jungle/mega_arachnid/proc/LoseAggro", function LoseAggro(f: Frame) {
	parent_proc();
	this.alpha = 50;
	return f.dot;
});

rt.type(8895, "/obj/item/projectile/mega_arachnid", "/obj/item/projectile", {
	name: "flesh snare",
	nodamage: 1,
	damage: 0,
	icon_state: "tentacle_end",
});

// jungle_mobs.dm:75
rt.def("/obj/item/projectile/mega_arachnid/proc/on_hit", function* on_hit(f: Frame) {
	let B: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (rt.istype(f.args[0], T("/mob/living/carbon")) && f.args[1] < 100) {
		yield* (B = (yield* new_(T("/obj/item/weapon/restraints/legcuffs/beartrap/mega_arachnid"), rt.getStep(f, f.args[0], 0)))).Crossed(f.args[0]);
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["target", "blocked"] });
