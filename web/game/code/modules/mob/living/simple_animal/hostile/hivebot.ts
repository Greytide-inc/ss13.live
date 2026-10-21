// From code/modules/mob/living/simple_animal/hostile/hivebot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /mob/living/simple_animal/hostile/hivebot/proc/<init>  (code/modules/mob/living/simple_animal/hostile/hivebot.dm:22)
rt.def("/mob/living/simple_animal/hostile/hivebot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("hivebot"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("states"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/effect/decal/cleanable/robot_debris")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/hivebot/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/hivebot.dm:32)  may sleep
rt.def("/mob/living/simple_animal/hostile/hivebot/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "deathmessage", fmt("＀ blows apart!", [live(f.src)]));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/hivebot/proc/death  (code/modules/mob/living/simple_animal/hostile/hivebot.dm:65)  may sleep
rt.def("/mob/living/simple_animal/hostile/hivebot/proc/death", function* death(f: Frame, gibbed: Value) {
	f.vars = () => [gibbed];
	yield* g.call(f, P("/proc/do_sparks"), null, [3, 1, live(f.src)]);
	yield* g.callSuper(f, [1]);
	return f.dot;
}, true);
