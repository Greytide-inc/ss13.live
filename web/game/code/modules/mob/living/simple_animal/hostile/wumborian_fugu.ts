// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/wumborian_fugu.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(4999, "/mob/living/simple_animal/hostile/asteroid/fugu", "/mob/living/simple_animal/hostile/asteroid", {
	wumbo: 0,
	inflate_cooldown: 0,
	move_to_delay: 5,
	vision_range: 5,
	aggro_vision_range: 9,
	idle_vision_range: 5,
	name: "wumborian fugu",
	desc: "The wumborian fugu rapidly increases its body mass in order to ward off its prey. Great care should be taken to avoid it while it's in this state as it is nearly invincible, but it cannot maintain its form forever.",
	icon: rt.rsc("icons/mob/lavaland/lavaland_monsters.dmi"),
	icon_state: "Fugu",
	icon_living: "Fugu",
	icon_aggro: "Fugu",
	icon_dead: "Fugu_dead",
	icon_gib: "syndicate_gib",
	mouse_opacity: 2,
	friendly: "floats near",
	speak_emote: null,
	speed: 0,
	maxHealth: 50,
	health: 50,
	harm_intent_damage: 5,
	obj_damage: 0,
	melee_damage_lower: 0,
	melee_damage_upper: 0,
	attacktext: "chomps",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	throw_message: "is avoided by the",
	mob_size: 1,
	environment_smash: 0,
	loot: null,
});

// wumborian_fugu.dm:14
rt.def("/mob/living/simple_animal/hostile/asteroid/fugu/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("puffs");

	this.loot = list(T("/obj/item/asteroid/fugu_gland"));
	return f.dot;
});

// wumborian_fugu.dm:35
rt.def("/mob/living/simple_animal/hostile/asteroid/fugu/proc/Life", function* Life(f: Frame) {
	if (!this.wumbo) {
		this.inflate_cooldown = max(this.inflate_cooldown - 1, 0);
	}
	if (this.target && this.AIStatus == AI_ON) {
		yield* this.Inflate();
	}
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// wumborian_fugu.dm:42
rt.def("/mob/living/simple_animal/hostile/asteroid/fugu/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!f.args[2] && this.wumbo) {
		return 0;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// wumborian_fugu.dm:47
rt.def("/mob/living/simple_animal/hostile/asteroid/fugu/proc/Aggro", function* Aggro(f: Frame) {
	yield* parent_proc();
	yield* this.Inflate();
	return f.dot;
}, true);

// wumborian_fugu.dm:55
rt.def("/mob/living/simple_animal/hostile/asteroid/fugu/verb/Inflate", function* Inflate(f: Frame) {
	if (this.wumbo) {
		to_chat(this, "<span class='notice'>You're already inflated.</span>");
		return f.dot;
	}
	if (this.inflate_cooldown) {
		to_chat(this, "<span class='notice'>We need time to gather our strength.</span>");
		return f.dot;
	}
	if (this.buffed) {
		to_chat(this, "<span class='notice'>Something is interfering with our growth.</span>");
		return f.dot;
	}
	this.wumbo = 1;
	this.icon_state = "Fugu_big";
	this.obj_damage = 60;
	this.melee_damage_lower = 15;
	this.melee_damage_upper = 20;
	this.harm_intent_damage = 0;
	this.throw_message = "is absorbed by the girth of the";
	this.retreat_distance = null;
	this.minimum_distance = 1;
	this.move_to_delay = 6;
	this.transform *= 2;
	this.environment_smash = 2;
	this.mob_size = 3;
	this.speed = 1;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/hostile/asteroid/fugu/proc/Deflate"))), 100);
	return f.dot;
}, true, { verb: { name: "Inflate", category: "Fugu", desc: "Temporarily increases your size, and makes you significantly more dangerous and tough." } });

// wumborian_fugu.dm:81
rt.def("/mob/living/simple_animal/hostile/asteroid/fugu/proc/Deflate", function Deflate(f: Frame) {
	if (!this.wumbo) return f.dot;
	walk(this, 0);
	this.wumbo = 0;
	this.icon_state = "Fugu";
	this.obj_damage = 0;
	this.melee_damage_lower = 0;
	this.melee_damage_upper = 0;
	this.harm_intent_damage = 5;
	this.throw_message = "is avoided by the";
	this.retreat_distance = 9;
	this.minimum_distance = 9;
	this.move_to_delay = 2;
	this.transform /= 2;
	this.inflate_cooldown = 4;
	this.environment_smash = ENVIRONMENT_SMASH_NONE;
	this.mob_size = MOB_SIZE_SMALL;
	this.speed = 0;
	return f.dot;
});

// wumborian_fugu.dm:99
rt.def("/mob/living/simple_animal/hostile/asteroid/fugu/proc/death", function* death(f: Frame, gibbed: Value) {
	this.Deflate();
	yield* parent_proc(gibbed);
	return f.dot;
}, true);

rt.type(10132, "/obj/item/asteroid/fugu_gland", "/obj/item/asteroid", {
	banned_mobs: null,
	flags: 4,
	w_class: 3,
	origin_tech: "biotech=6",
	name: "wumborian fugu gland",
	desc: "The key to the wumborian fugu's ability to increase its mass arbitrarily, this disgusting remnant can apply the same effect to other creatures, giving them great strength.",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "fugu_gland",
	layer: 4,
});

// wumborian_fugu.dm:114
rt.def("/obj/item/asteroid/fugu_gland/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let A: Value = null;
	if (!(proximity_flag && rt.istype(target, T("/mob/living/simple_animal")))) return f.dot;
	if ((A = target).buffed || rt.isIn(f, A.type, this.banned_mobs) || A.stat) {
		to_chat(user, `<span class='warning'>Something's interfering with the ${this}'s effects. It's no use.</span>`);
		return f.dot;
	}
	A.buffed++;
	A.maxHealth *= 1.5;
	A.health = min(A.maxHealth, A.health * 1.5);
	A.melee_damage_lower = max(A.melee_damage_lower * 2, 10);
	A.melee_damage_upper = max(A.melee_damage_upper * 2, 10);
	A.transform *= 2;
	A.environment_smash += 2;
	to_chat(user, `<span class='info'>You increase the size of ${A}, giving it a surge of strength!</span>`);
	yield* qdel(this);
	return f.dot;
}, true);
