// Based on /tg/station's code/modules/mob/living/simple_animal/guardian/types/explosive.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(4876, "/mob/living/simple_animal/hostile/guardian/bomb", "/mob/living/simple_animal/hostile/guardian", {
	bomb_cooldown: 0,
	range: 13,
	playstyle_string: "<span class='holoparasite'>As an <b>explosive</b> type, you have moderate close combat abilities, may explosively teleport targets on attack, and are capable of converting nearby items and objects into disguised bombs via alt click.</span>",
	magic_fluff_string: "<span class='holoparasite'>..And draw the Scientist, master of explosive death.</span>",
	tech_fluff_string: "<span class='holoparasite'>Boot sequence complete. Explosive modules active. Holoparasite swarm online.</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP! Caught one! It's an explosive carp! Boom goes the fishy.</span>",
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	damage_coeff: null,
});

// explosive.dm:5
rt.def("/mob/living/simple_animal/hostile/guardian/bomb/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.damage_coeff = rt.alist(f, ["brute", 0.6, "fire", 0.6, "tox", 0.6, "clone", 0.6, "stamina", 0, "oxy", 0.6]);
	return f.dot;
});

// explosive.dm:14
rt.def("/mob/living/simple_animal/hostile/guardian/bomb/proc/Stat", function* Stat(f: Frame) {
	yield* parent_proc();
	if (!statpanel("Status")) return f.dot;
	if (!(this.bomb_cooldown >= rt.worldTime(f))) return f.dot;
	stat(null, `Bomb Cooldown Remaining: ${max(round((this.bomb_cooldown - rt.worldTime(f)) * 0.1, 0.1), 0)} seconds`);
	return f.dot;
}, true);

// explosive.dm:20
rt.def("/mob/living/simple_animal/hostile/guardian/bomb/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let M: Value = null, L: Value = null;
	f.dot = (yield* parent_proc());
	if (!(f.dot && prob(40) && rt.istype(this.target, T("/mob/living")))) return f.dot;
	if (!(!(M = this.target).anchored && M != this.summoner && !this.hasmatchingsummoner(M))) return f.dot;
	yield* new_(T("/obj/effect/temp_visual/guardian/phase/out"), rt.getStep(f, M, 0));
	yield* do_teleport(M, M, 10);
	for (L of each(range(1, M), T("/mob/living"))) {
		if (this.hasmatchingsummoner(L)) {
			continue;
		}
		if (L != this && L != this.summoner) {
			yield* L.apply_damage(15, "brute");
		}
	}
	yield* new_(T("/obj/effect/temp_visual/explosion"), rt.getStep(f, M, 0));
	return f.dot;
}, true);

// explosive.dm:34
rt.def("/mob/living/simple_animal/hostile/guardian/bomb/proc/AltClickOn", function* AltClickOn(f: Frame, A: Value) {
	let B: Value = null;
	if (!rt.istype(A, T("/atom/movable"))) {
		return f.dot;
	}
	if (this.loc == this.summoner) {
		to_chat(this, "<span class='danger'><B>You must be manifested to create bombs!</span></B>");
		return f.dot;
	}
	if (!rt.istype(A, T("/obj"))) return f.dot;
	if (this.bomb_cooldown <= rt.worldTime(f) && !this.stat) {
		B = (yield* new_(T("/obj/guardian_bomb"), rt.getStep(f, A, 0)));
		to_chat(this, "<span class='danger'><B>Success! Bomb armed!</span></B>");
		this.bomb_cooldown = rt.worldTime(f) + 200;
		B.spawner = this;
		yield* B.disguise(A);
	} else {
		to_chat(this, "<span class='danger'><B>Your powers are on cooldown! You must wait 20 seconds between bombs.</span></B>");
	}
	return f.dot;
}, true);

rt.type(13072, "/obj/guardian_bomb", "/obj", {
	stored_obj: null,
	spawner: null,
	name: "bomb",
	desc: "You shouldn't be seeing this!",
});

// explosive.dm:58
rt.def("/obj/guardian_bomb/proc/disguise", function* disguise(f: Frame, A: Value) {
	A.loc = this;
	this.stored_obj = A;
	this.opacity = A.opacity;
	this.anchored = A.anchored;
	this.density = A.density;
	this.appearance = A.appearance;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/guardian_bomb/proc/disable"))), 600);
	return f.dot;
}, true);

// explosive.dm:66
rt.def("/obj/guardian_bomb/proc/disable", function* disable(f: Frame) {
	yield* this.stored_obj.forceMove(rt.getStep(f, this, 0));
	to_chat(this.spawner, "<span class='danger'><B>Failure! Your trap didn't catch anyone this time.</span></B>");
	yield* qdel(this);
	return f.dot;
}, true);

// explosive.dm:71
rt.def("/obj/guardian_bomb/proc/detonate", function* detonate(f: Frame, user: Value) {
	let _T: Value = null;
	if (!rt.istype(user, T("/mob/living"))) return f.dot;
	if (user != this.spawner && user != this.spawner.summoner && !this.spawner.hasmatchingsummoner(user)) {
		to_chat(user, `<span class='danger'><B>The ${this} was boobytrapped!</span></B>`);
		to_chat(this.spawner, `<span class='danger'><B>Success! Your trap caught ${user}</span></B>`);
		_T = rt.getStep(f, this, 0);
		yield* this.stored_obj.forceMove(_T);
		playsound(_T, rt.rsc("sound/effects/explosion2.ogg"), 200, 1);
		yield* new_(T("/obj/effect/temp_visual/explosion"), _T);
		yield* user.ex_act(2);
		yield* qdel(this);
	} else {
		to_chat(user, `<span class='holoparasite'>${this} glows with a strange <font color="${this.spawner.namedatum.colour}">light</font>, and you don't touch it.</span>`);
	}
	return f.dot;
}, true);

// explosive.dm:85
rt.def("/obj/guardian_bomb/proc/Bump", function* Bump(f: Frame, A: Value) {
	yield* this.detonate(A);
	yield* parent_proc();
	return f.dot;
}, true);

// explosive.dm:89
rt.def("/obj/guardian_bomb/proc/attackby", function* attackby(f: Frame, user: Value) {
	yield* this.detonate(user);
	return f.dot;
}, true);

// explosive.dm:92
rt.def("/obj/guardian_bomb/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.detonate(user);
	return f.dot;
}, true);

// explosive.dm:95
rt.def("/obj/guardian_bomb/proc/examine", function* examine(f: Frame, user: Value) {
	yield* this.stored_obj.examine(user);
	if (!(get_dist(user, this) <= 2)) return f.dot;
	to_chat(user, `<span class='holoparasite'>It glows with a strange <font color="${this.spawner.namedatum.colour}">light</font>!</span>`);
	return f.dot;
}, true);
