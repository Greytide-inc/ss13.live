// From code/modules/mob/living/simple_animal/hostile/mining_mobs/basilisk.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5004, "/mob/living/simple_animal/hostile/asteroid/basilisk", "/mob/living/simple_animal/hostile/asteroid", {
	move_to_delay: 20,
	projectilesound: rt.rsc("sound/weapons/pierce.ogg"),
	ranged: 1,
	ranged_message: "stares",
	ranged_cooldown_time: 30,
	vision_range: 2,
	aggro_vision_range: 9,
	idle_vision_range: 2,
	name: "basilisk",
	desc: "A territorial beast, covered in a thick shell that absorbs energy. Its stare causes victims to freeze from the inside.",
	icon: rt.rsc("icons/mob/lavaland/lavaland_monsters.dmi"),
	icon_state: "Basilisk",
	icon_living: "Basilisk",
	icon_aggro: "Basilisk_alert",
	icon_dead: "Basilisk_dead",
	icon_gib: "syndicate_gib",
	projectiletype: rt.typePath("/obj/item/projectile/temp/basilisk"),
	throw_message: "does nothing against the hard shell of",
	speed: 3,
	maxHealth: 200,
	health: 200,
	harm_intent_damage: 5,
	obj_damage: 60,
	melee_damage_lower: 12,
	melee_damage_upper: 12,
	attacktext: "bites into",
	a_intent: "harm",
	speak_emote: null,
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	turns_per_move: 5,
	loot: null,
});

// /mob/living/simple_animal/hostile/asteroid/basilisk/proc/<init>  (code/modules/mob/living/simple_animal/hostile/mining_mobs/basilisk.dm:28)
rt.def("/mob/living/simple_animal/hostile/asteroid/basilisk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("chitters"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/item/weapon/ore/diamond"), T("/obj/item/weapon/ore/diamond")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/asteroid/basilisk/proc/GiveTarget  (code/modules/mob/living/simple_animal/hostile/mining_mobs/basilisk.dm:46)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/basilisk/proc/GiveTarget", function* GiveTarget(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (!((truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0)) && !truthy((yield* g.callName(f, rt.sv(f, "target"), "Adjacent", [rt.sv(f, "targets_from")])))) && rt.le(rt.sv(f, "ranged_cooldown"), rt.worldTime(f)))) return f.dot;
	yield* g.srcCall(f, "OpenFire", rt.sv(f, "target"));
	return f.dot;
}, true, { args: ["new_target"] });

// /mob/living/simple_animal/hostile/asteroid/basilisk/proc/ex_act  (code/modules/mob/living/simple_animal/hostile/mining_mobs/basilisk.dm:51)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/basilisk/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	let $0: any;
	f.vars = () => [severity, target, $0];
	$0 = live(severity);
	if ($0 === 1) {
		yield* g.srcCall(f, "gib");
	} else if ($0 === 2) {
		yield* g.srcCall(f, "adjustBruteLoss", 140);
	} else if ($0 === 3) {
		yield* g.srcCall(f, "adjustBruteLoss", 110);
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(5005, "/mob/living/simple_animal/hostile/asteroid/basilisk/watcher", "/mob/living/simple_animal/hostile/asteroid/basilisk", {
	stat_attack: 1,
	robust_searching: 1,
	name: "watcher",
	desc: "A levitating, eye-like creature held aloft by winglike formations of sinew. A sharp spine of crystal protrudes from its body.",
	icon: rt.rsc("icons/mob/lavaland/watcher.dmi"),
	icon_state: "watcher",
	icon_living: "watcher",
	icon_aggro: "watcher",
	icon_dead: "watcher_dead",
	pixel_x: -10,
	throw_message: "bounces harmlessly off of",
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	attacktext: "impales",
	a_intent: "harm",
	speak_emote: null,
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	movement_type: 2,
	crusher_loot: rt.typePath("/obj/item/crusher_trophy/watcher_wing"),
	loot: null,
	butcher_results: null,
});

// /mob/living/simple_animal/hostile/asteroid/basilisk/watcher/proc/<init>  (code/modules/mob/living/simple_animal/hostile/mining_mobs/basilisk.dm:74)
rt.def("/mob/living/simple_animal/hostile/asteroid/basilisk/watcher/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("telepathically cries"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list());
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/ore/diamond"), 2, T("/obj/item/stack/sheet/sinew"), 2, T("/obj/item/stack/sheet/bone"), 1]));
	return f.dot;
});
