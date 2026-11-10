// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/mining_mobs/basilisk.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// basilisk.dm:28
rt.def("/mob/living/simple_animal/hostile/asteroid/basilisk/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("chitters");

	this.loot = list(T("/obj/item/weapon/ore/diamond"), T("/obj/item/weapon/ore/diamond"));
	return f.dot;
});

// basilisk.dm:46
rt.def("/mob/living/simple_animal/hostile/asteroid/basilisk/proc/GiveTarget", function* GiveTarget(f: Frame, new_target: Value) {
	if (!(yield* parent_proc())) return f.dot;
	if (!(rt.istype(this.target, T("/mob/living")) && !this.target.Adjacent(this.targets_from) && this.ranged_cooldown <= rt.worldTime(f))) return f.dot;
	yield* this.OpenFire(this.target);
	return f.dot;
}, true);

// basilisk.dm:51
rt.def("/mob/living/simple_animal/hostile/asteroid/basilisk/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	if (severity === 1) {
		yield* this.gib();
	} else if (severity === 2) {
		yield* this.adjustBruteLoss(140);
	} else if (severity === 3) {
		yield* this.adjustBruteLoss(110);
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

// basilisk.dm:74
rt.def("/mob/living/simple_animal/hostile/asteroid/basilisk/watcher/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("telepathically cries");

	this.loot = list();

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/ore/diamond"), 2, T("/obj/item/stack/sheet/sinew"), 2, T("/obj/item/stack/sheet/bone"), 1]);
	return f.dot;
});
