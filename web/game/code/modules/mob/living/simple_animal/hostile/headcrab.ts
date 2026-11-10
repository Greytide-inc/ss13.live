// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/headcrab.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(4957, "/mob/living/simple_animal/hostile/headcrab", "/mob/living/simple_animal/hostile", {
	origin: null,
	egg_lain: 0,
	name: "headslug",
	desc: "Absolutely not de-beaked or harmless. Keep away from corpses.",
	icon_state: "headcrab",
	icon_living: "headcrab",
	icon_dead: "headcrab_dead",
	gender: "neuter",
	health: 50,
	maxHealth: 50,
	melee_damage_lower: 5,
	melee_damage_upper: 5,
	attacktext: "chomps",
	attack_sound: rt.rsc("sound/weapons/bite.ogg"),
	faction: null,
	robust_searching: 1,
	stat_attack: 2,
	obj_damage: 0,
	environment_smash: 0,
	speak_emote: null,
	ventcrawler: 2,
	gold_core_spawnable: 1,
});

// headcrab.dm:16
rt.def("/mob/living/simple_animal/hostile/headcrab/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("creature");

	this.speak_emote = list("squeaks");
	return f.dot;
});

// headcrab.dm:28
rt.def("/mob/living/simple_animal/hostile/headcrab/proc/Infect", function* Infect(f: Frame, victim: Value) {
	let egg: Value = null, I: Value = null;
	yield* (egg = (yield* new_(T("/obj/item/organ/body_egg/changeling_egg"), victim))).Insert(victim);
	if (this.origin) {
		egg.origin = this.origin;
	} else if (this.mind) {
		egg.origin = this.mind;
	}
	for (I of each(this, T("/obj/item/organ"))) {
		I.loc = egg;
	}
	this.visible_message(`<span class='warning'>${this} plants something in ${victim}'s flesh!</span>`, `<span class='danger'>We inject our egg into ${victim}'s body!</span>`);
	this.egg_lain = 1;
	return f.dot;
}, true);

// headcrab.dm:41
rt.def("/mob/living/simple_animal/hostile/headcrab/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let C: Value = null;
	f.dot = (yield* parent_proc());
	if (!(f.dot && !this.egg_lain && rt.istype(this.target, T("/mob/living/carbon")) && !rt.istype(this.target, T("/mob/living/carbon/monkey")))) return f.dot;
	if ((C = this.target).stat != 2) return f.dot;
	if (rt.bitAnd(C.status_flags, XENO_HOST)) {
		to_chat(this, "<span class='userdanger'>A foreign presence repels us from this body. Perhaps we should try to infest another?</span>");
		return f.dot;
	}
	yield* this.Infect(this.target);
	to_chat(this, "<span class='userdanger'>With our egg laid, our death approaches rapidly...</span>");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/hostile/proc/death"))), 100);
	return f.dot;
}, true);

rt.type(9459, "/obj/item/organ/body_egg/changeling_egg", "/obj/item/organ/body_egg", {
	origin: null,
	time: null,
	name: "changeling egg",
	desc: "Twitching and disgusting.",
	origin_tech: "biotech=7",
});

// headcrab.dm:62
rt.def("/obj/item/organ/body_egg/changeling_egg/proc/egg_process", function* egg_process(f: Frame) {
	this.time++;
	if (!(this.time >= EGG_INCUBATION_TIME)) return f.dot;
	yield* this.Pop();
	yield* this.Remove(this.owner);
	yield* qdel(this);
	return f.dot;
}, true);

// headcrab.dm:69
rt.def("/obj/item/organ/body_egg/changeling_egg/proc/Pop", function* Pop(f: Frame) {
	let I: Value = null;
	let M: Value = (yield* new_(T("/mob/living/carbon/monkey"), this.owner));
	this.owner.stomach_contents += M;
	for (I of each(this, T("/obj/item/organ"))) {
		yield* I.Insert(M, 1);
	}
	if (this.origin && this.origin.current && this.origin.current.stat == 2) {
		yield* this.origin.transfer_to(M);
		if (!this.origin.changeling) {
			yield* M.make_changeling();
		}
		if (this.origin.changeling.can_absorb_dna(M, this.owner)) {
			yield* this.origin.changeling.add_new_profile(this.owner, M);
		}
		this.origin.changeling.purchasedpowers += (yield* new_(T("/obj/effect/proc_holder/changeling/humanform"), null));
		M.key = this.origin.key;
	}
	yield* this.owner.gib();
	return f.dot;
}, true);
