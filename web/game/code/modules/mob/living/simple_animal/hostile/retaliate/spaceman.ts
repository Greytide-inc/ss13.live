// From code/modules/mob/living/simple_animal/hostile/retaliate/spaceman.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4940, "/mob/living/simple_animal/hostile/retaliate/nanotrasenpeace", "/mob/living/simple_animal/hostile/retaliate", {
	name: "Nanotrasen Private Security Officer",
	desc: "An officer part of Nanotrasen's private security force.",
	icon: rt.rsc("icons/mob/simple_human.dmi"),
	icon_state: "nanotrasen",
	icon_living: "nanotrasen",
	icon_dead: null,
	icon_gib: "syndicate_gib",
	turns_per_move: 5,
	response_help: "pokes",
	response_disarm: "shoves",
	response_harm: "hits",
	speed: 0,
	stat_attack: 1,
	robust_searching: 1,
	vision_range: 3,
	maxHealth: 100,
	health: 100,
	harm_intent_damage: 5,
	melee_damage_lower: 10,
	melee_damage_upper: 15,
	attacktext: "punches",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	faction: null,
	a_intent: "harm",
	loot: null,
	atmos_requirements: null,
	unsuitable_atmos_damage: 15,
	status_flags: 8,
	search_objects: 1,
});

// /mob/living/simple_animal/hostile/retaliate/nanotrasenpeace/proc/<init>  (code/modules/mob/living/simple_animal/hostile/retaliate/spaceman.dm:49)
rt.def("/mob/living/simple_animal/hostile/retaliate/nanotrasenpeace/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("nanotrasenprivate"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/effect/mob_spawn/human/corpse/nanotrasensoldier")));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 5, "max_oxy", 0, "min_tox", 0, "max_tox", 1, "min_co2", 0, "max_co2", 5, "min_n2", 0, "max_n2", 0]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/retaliate/nanotrasenpeace/proc/Aggro  (code/modules/mob/living/simple_animal/hostile/retaliate/spaceman.dm:58)  may sleep
rt.def("/mob/living/simple_animal/hostile/retaliate/nanotrasenpeace/proc/Aggro", function* Aggro(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "summon_backup", 15);
	yield* g.srcCall(f, "say", "411 in progress, requesting backup!");
	return f.dot;
}, true);

rt.type(4941, "/mob/living/simple_animal/hostile/retaliate/nanotrasenpeace/ranged", "/mob/living/simple_animal/hostile/retaliate/nanotrasenpeace", {
	icon_state: "nanotrasenrangedsmg",
	icon_living: "nanotrasenrangedsmg",
	vision_range: 9,
	rapid: 1,
	ranged: 1,
	retreat_distance: 3,
	minimum_distance: 5,
	casingtype: rt.typePath("/obj/item/ammo_casing/c46x30mm"),
	projectilesound: rt.rsc("sound/weapons/gunshot_smg.ogg"),
	loot: null,
});

// /mob/living/simple_animal/hostile/retaliate/nanotrasenpeace/ranged/proc/<init>  (code/modules/mob/living/simple_animal/hostile/retaliate/spaceman.dm:72)
rt.def("/mob/living/simple_animal/hostile/retaliate/nanotrasenpeace/ranged/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.list(T("/obj/item/weapon/gun/ballistic/automatic/wt550"), T("/obj/effect/mob_spawn/human/corpse/nanotrasensoldier")));
	return f.dot;
});
