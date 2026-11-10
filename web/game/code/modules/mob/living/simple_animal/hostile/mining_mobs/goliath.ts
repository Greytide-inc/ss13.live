// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/mining_mobs/goliath.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(5008, "/mob/living/simple_animal/hostile/asteroid/goliath", "/mob/living/simple_animal/hostile/asteroid", {
	pre_attack: 0,
	pre_attack_icon: "Goliath_preattack",
	move_to_delay: 40,
	ranged: 1,
	ranged_cooldown_time: 120,
	vision_range: 4,
	aggro_vision_range: 9,
	idle_vision_range: 5,
	anchored: 1,
	name: "goliath",
	desc: "A massive beast that uses long tentacles to ensare its prey, threatening them is not advised under any conditions.",
	icon: rt.rsc("icons/mob/lavaland/lavaland_monsters.dmi"),
	icon_state: "Goliath",
	icon_living: "Goliath",
	icon_aggro: "Goliath_alert",
	icon_dead: "Goliath_dead",
	icon_gib: "syndicate_gib",
	mouse_opacity: 2,
	friendly: "wails at",
	speak_emote: null,
	speed: 3,
	maxHealth: 300,
	health: 300,
	harm_intent_damage: 0,
	obj_damage: 100,
	melee_damage_lower: 25,
	melee_damage_upper: 25,
	attacktext: "pulverizes",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	throw_message: "does nothing to the rocky hide of the",
	loot: null,
});

// goliath.dm:16
rt.def("/mob/living/simple_animal/hostile/asteroid/goliath/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("bellows");

	this.loot = list(T("/obj/item/stack/sheet/animalhide/goliath_hide"));
	return f.dot;
});

// goliath.dm:36
rt.def("/mob/living/simple_animal/hostile/asteroid/goliath/proc/Life", function Life(f: Frame) {
	parent_proc();
	this.handle_preattack();
	return f.dot;
}, false, { waitfor: false });

// goliath.dm:40
rt.def("/mob/living/simple_animal/hostile/asteroid/goliath/proc/handle_preattack", function handle_preattack(f: Frame) {
	if (this.ranged_cooldown <= rt.worldTime(f) + this.ranged_cooldown_time * 0.25 && !this.pre_attack) {
		this.pre_attack++;
	}
	if (!this.pre_attack || this.stat || this.AIStatus == AI_IDLE) {
		return f.dot;
	}
	this.icon_state = this.pre_attack_icon;
	return f.dot;
});

// goliath.dm:47
rt.def("/mob/living/simple_animal/hostile/asteroid/goliath/proc/revive", function* revive(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!(yield* parent_proc())) return f.dot;
	this.anchored = 1;
	f.dot = 1;
	return f.dot;
}, true, { args: ["full_heal", "admin_revive"] });

// goliath.dm:53
rt.def("/mob/living/simple_animal/hostile/asteroid/goliath/proc/death", function* death(f: Frame, gibbed: Value) {
	this.anchored = 0;
	yield* parent_proc(gibbed);
	return f.dot;
}, true);

// goliath.dm:56
rt.def("/mob/living/simple_animal/hostile/asteroid/goliath/proc/OpenFire", function* OpenFire(f: Frame) {
	let tturf: Value = null;
	if (!isturf((tturf = rt.getStep(f, this.target, 0)))) {
		return f.dot;
	}
	if (!(get_dist(this, this.target) <= 7)) return f.dot;
	this.visible_message(`<span class='warning'>The ${this.name} digs its tentacles under ${this.target.name}!</span>`);
	yield* new_(T("/obj/effect/goliath_tentacle/original"), tturf);
	this.ranged_cooldown = rt.worldTime(f) + this.ranged_cooldown_time;
	this.icon_state = this.icon_aggro;
	this.pre_attack = 0;
	return f.dot;
}, true);

// goliath.dm:67
rt.def("/mob/living/simple_animal/hostile/asteroid/goliath/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	this.ranged_cooldown -= 10;
	this.handle_preattack();
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// goliath.dm:72
rt.def("/mob/living/simple_animal/hostile/asteroid/goliath/proc/Aggro", function Aggro(f: Frame) {
	this.vision_range = this.aggro_vision_range;
	this.handle_preattack();
	if (this.icon_state == this.icon_aggro) return f.dot;
	this.icon_state = this.icon_aggro;
	return f.dot;
});

rt.type(5009, "/mob/living/simple_animal/hostile/asteroid/goliath/beast", "/mob/living/simple_animal/hostile/asteroid/goliath", {
	pre_attack_icon: "goliath2",
	stat_attack: 1,
	robust_searching: 1,
	name: "goliath",
	desc: "A hulking, armor-plated beast with long tendrils arching from its back.",
	icon: rt.rsc("icons/mob/lavaland/lavaland_monsters.dmi"),
	icon_state: "goliath",
	icon_living: "goliath",
	icon_aggro: "goliath",
	icon_dead: "goliath_dead",
	throw_message: "does nothing to the tough hide of the",
	crusher_loot: rt.typePath("/obj/item/crusher_trophy/goliath_tentacle"),
	butcher_results: null,
	loot: null,
});

// goliath.dm:89
rt.def("/mob/living/simple_animal/hostile/asteroid/goliath/beast/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/goliath"), 2, T("/obj/item/stack/sheet/animalhide/goliath_hide"), 1, T("/obj/item/stack/sheet/bone"), 2]);

	this.loot = list();
	return f.dot;
});

rt.type(12087, "/obj/effect/goliath_tentacle", "/obj/effect", {
	latched: 0,
	anchored: 1,
	name: "Goliath tentacle",
	icon: rt.rsc("icons/mob/lavaland/lavaland_monsters.dmi"),
	icon_state: "Goliath_tentacle",
});

// goliath.dm:106
rt.def("/obj/effect/goliath_tentacle/proc/Initialize", function* Initialize(f: Frame) {
	let M: Value = null;
	f.dot = (yield* parent_proc());
	if (rt.istype(this.loc, T("/turf/closed/mineral"))) {
		yield* (M = this.loc).gets_drilled();
	}
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/goliath_tentacle/proc/Trip"))), 10);
	return f.dot;
}, true);

rt.type(12088, "/obj/effect/goliath_tentacle/original", "/obj/effect/goliath_tentacle", {});

// goliath.dm:113
rt.def("/obj/effect/goliath_tentacle/original/proc/Initialize", function* Initialize(f: Frame) {
	let O: Value = null, i: Value = null, spawndir: Value = null, _T: Value = null;
	let $e: any;
	f.dot = (yield* parent_proc());
	for (O of each(this.loc, T("/obj/effect/goliath_tentacle/original"))) {
		if (O != this) {
			yield* qdel(this);
		}
	}
	let directions: Value = (yield* GLOB.cardinal.Copy());
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		directions -= (spawndir = pick(directions));
		if (_T = rt.getStep(f, this, spawndir)) {
			yield* new_(T("/obj/effect/goliath_tentacle"), _T);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// goliath.dm:126
rt.def("/obj/effect/goliath_tentacle/proc/Trip", function* Trip(f: Frame) {
	let M: Value = null;
	for (M of each(this.loc, T("/mob/living"))) {
		this.visible_message(`<span class='danger'>The ${this.name} grabs hold of ${M.name}!</span>`);
		yield* M.Stun(100);
		yield* M.adjustBruteLoss(rand(10, 15));
		this.latched = 1;
	}
	if (!this.latched) {
		yield* qdel(this);
	} else {
		yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 50, 8);
	}
	return f.dot;
}, true);
