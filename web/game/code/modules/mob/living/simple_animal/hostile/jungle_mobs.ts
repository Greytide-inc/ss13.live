// From code/modules/mob/living/simple_animal/hostile/jungle_mobs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /mob/living/simple_animal/hostile/jungle/proc/<init>  (code/modules/mob/living/simple_animal/hostile/jungle_mobs.dm:3)
rt.def("/mob/living/simple_animal/hostile/jungle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("jungle"));
	$0 = $0;
	rt.setSv(f, "weather_immunities", rt.list("acid"));
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

// /mob/living/simple_animal/hostile/jungle/mega_arachnid/proc/<init>  (code/modules/mob/living/simple_animal/hostile/jungle_mobs.dm:35)
rt.def("/mob/living/simple_animal/hostile/jungle/mega_arachnid/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("chitters"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/jungle/mega_arachnid/proc/Life  (code/modules/mob/living/simple_animal/hostile/jungle_mobs.dm:47)
rt.def("/mob/living/simple_animal/hostile/jungle/mega_arachnid/proc/Life", function Life(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	rt.callSuper(f, [], rt.Args.Same);
	if (((truthy(rt.sv(f, "target")) && rt.gt(rt.sv(f, "ranged_cooldown"), rt.worldTime(f))) && truthy((rt.istype(rt.sv(f, "target"), T("/mob/living/carbon")) ? 1 : 0)))) {
		if ((!truthy(rt.gv(f, "legcuffed", (C = rt.sv(f, "target")))) && rt.lt(rt.fv(f, "health", live(C)), 50))) {
			rt.setSv(f, "retreat_distance", 9);
			rt.setSv(f, "minimum_distance", 9);
			rt.setSv(f, "alpha", 125);
			return live(f.dot);
		}
	}
	rt.setSv(f, "retreat_distance", 0);
	rt.setSv(f, "minimum_distance", 0);
	rt.setSv(f, "alpha", 255);
	return f.dot;
}, false, { waitfor: false });

// /mob/living/simple_animal/hostile/jungle/mega_arachnid/proc/Aggro  (code/modules/mob/living/simple_animal/hostile/jungle_mobs.dm:61)  may sleep
rt.def("/mob/living/simple_animal/hostile/jungle/mega_arachnid/proc/Aggro", function* Aggro(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "alpha", 255);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/jungle/mega_arachnid/proc/LoseAggro  (code/modules/mob/living/simple_animal/hostile/jungle_mobs.dm:65)
rt.def("/mob/living/simple_animal/hostile/jungle/mega_arachnid/proc/LoseAggro", function LoseAggro(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "alpha", 50);
	return f.dot;
});

rt.type(8895, "/obj/item/projectile/mega_arachnid", "/obj/item/projectile", {
	name: "flesh snare",
	nodamage: 1,
	damage: 0,
	icon_state: "tentacle_end",
});

// /obj/item/projectile/mega_arachnid/proc/on_hit  (code/modules/mob/living/simple_animal/hostile/jungle_mobs.dm:75)  may sleep
rt.def("/obj/item/projectile/mega_arachnid/proc/on_hit", function* on_hit(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0)) && rt.lt(live(f.args[1]), 100))) {
		yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/restraints/legcuffs/beartrap/mega_arachnid"), [rt.getStep(f, live(f.args[0]), 0)]))), "Crossed", [live(f.args[0])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "blocked"] });
