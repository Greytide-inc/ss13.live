// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/bosses/paperwizard.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5019, "/mob/living/simple_animal/hostile/boss/paper_wizard", "/mob/living/simple_animal/hostile/boss", {
	copies: null,
	boss_abilities: null,
	ranged: 1,
	minimum_distance: 3,
	retreat_distance: 3,
	projectilesound: rt.rsc("sound/weapons/emitter.ogg"),
	name: "Mjor the Creative",
	desc: "A wizard with a taste for the arts.",
	faction: null,
	del_on_death: 1,
	icon: rt.rsc("icons/mob/simple_human.dmi"),
	icon_state: "paperwizard",
	environment_smash: 0,
	obj_damage: 0,
	melee_damage_lower: 10,
	melee_damage_upper: 20,
	health: 1000,
	maxHealth: 1000,
	loot: null,
	projectiletype: rt.typePath("/obj/item/projectile/temp"),
	attack_sound: rt.rsc("sound/hallucinations/growl1.ogg"),
});

// paperwizard.dm:5
rt.def("/mob/living/simple_animal/hostile/boss/paper_wizard/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.boss_abilities = list(T("/datum/action/boss/wizard_summon_minions"), T("/datum/action/boss/wizard_mimic"));

	this.copies = list();
	this.faction = list("hostile", "stickman");

	this.loot = list(T("/obj/effect/temp_visual/paperwiz_dying"));
	return f.dot;
});

rt.type(268, "/datum/action/boss/wizard_summon_minions", "/datum/action/boss", {
	name: "Summon Minions",
	button_icon_state: "art_summon",
	usage_probability: 40,
	boss_cost: 30,
	needs_target: 0,
	say_when_triggered: "Rise, my creations! Jump off your pages and into this realm!",
	boss_type: rt.typePath("/mob/living/simple_animal/hostile/boss/paper_wizard"),
}, { global: { summoned_minions: 628 } });

// paperwizard.dm:39
rt.def("/datum/action/boss/wizard_summon_minions/proc/Trigger", function* Trigger(f: Frame) {
	let i: Value = null, minions_chosen: Value = null;
	let $e: any;
	if (!(GLOB.summoned_minions <= 6 && (yield* parent_proc()))) return f.dot;
	let minions: Value = list(T("/mob/living/simple_animal/hostile/stickman"), T("/mob/living/simple_animal/hostile/stickman/ranged"), T("/mob/living/simple_animal/hostile/stickman/dog"));
	let directions: Value = (yield* GLOB.cardinal.Copy());
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		minions_chosen = pick_n_take(minions);
		yield* new_(minions_chosen, rt.getStep(f, this.boss, pick_n_take(directions)), 1);
	}
	rt.endFor(f, 0);
	GLOB.summoned_minions += 3;
	return f.dot;
}, true);

rt.type(269, "/datum/action/boss/wizard_mimic", "/datum/action/boss", {
	name: "Craft Mimicry",
	button_icon_state: "mimic_summon",
	usage_probability: 30,
	boss_cost: 40,
	say_when_triggered: "",
	boss_type: rt.typePath("/mob/living/simple_animal/hostile/boss/paper_wizard"),
});

// paperwizard.dm:64
rt.def("/datum/action/boss/wizard_mimic/proc/Trigger", function* Trigger(f: Frame) {
	let target: Value = null, threats: Value = null, wiz: Value = null, directions: Value = null, i: Value = null, C: Value = null;
	let $e: any;
	if (!(yield* parent_proc())) return f.dot;
	if (!this.boss.client) {
		target = this.boss.target;
	} else if (rt.len(f, (threats = this.boss.PossibleThreats()))) {
		target = pick(threats);
	}
	if (target) {
		wiz = this.boss;
		directions = (yield* GLOB.cardinal.Copy());
		rt.forRange(f, 0, 1, 3, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			C = (yield* new_(T("/mob/living/simple_animal/hostile/boss/paper_wizard/copy"), rt.getStep(f, target, pick_n_take(directions))));
			wiz.copies += C;
			C.original = wiz;
			yield* C.say("My craft defines me, you could even say it IS me!");
		}
		rt.endFor(f, 0);
		yield* wiz.say("My craft defines me, you could even say it IS me!");
		yield* wiz.forceMove(rt.getStep(f, target, pick_n_take(directions)));
		wiz.minimum_distance = 1;
		wiz.retreat_distance = 0;
	} else {
		this.boss.atb.refund(this.boss_cost);
	}
	return f.dot;
}, true);

rt.type(5020, "/mob/living/simple_animal/hostile/boss/paper_wizard/copy", "/mob/living/simple_animal/hostile/boss/paper_wizard", {
	original: null,
	boss_abilities: null,
	minimum_distance: 0,
	retreat_distance: 0,
	ranged: 0,
	desc: "tis a ruse!",
	health: 1,
	maxHealth: 1,
	alpha: 200,
	melee_damage_lower: 1,
	melee_damage_upper: 5,
	loot: null,
});

// paperwizard.dm:92
rt.def("/mob/living/simple_animal/hostile/boss/paper_wizard/copy/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.boss_abilities = list();

	this.loot = list();
	return f.dot;
});

// paperwizard.dm:103
rt.def("/mob/living/simple_animal/hostile/boss/paper_wizard/copy/proc/adjustHealth", function* adjustHealth(f: Frame) {
	let c: Value = null, L: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[0] > 0) {
		if (this.original) {
			this.original.minimum_distance = 3;
			this.original.retreat_distance = 3;
			this.original.copies -= this;
			for (c of each(this.original.copies)) {
				yield* qdel(c);
			}
		}
		for (L of each(range(5, this), T("/mob/living"))) {
			if (L == this.original || rt.op(f, "IsType", [], [L, this.type])) {
				continue;
			}
			yield* L.adjustBruteLoss(50);
		}
		yield* qdel(this);
	} else {
		f.dot = (yield* parent_proc());
	}
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// paperwizard.dm:120
rt.def("/mob/living/simple_animal/hostile/boss/paper_wizard/proc/adjustHealth", function* adjustHealth(f: Frame) {
	let copy: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!(f.dot > 0)) return f.dot;
	this.minimum_distance = 3;
	this.retreat_distance = 3;
	for (copy of each(this.copies)) {
		yield* qdel(copy);
	}
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// paperwizard.dm:128
rt.def("/mob/living/simple_animal/hostile/boss/paper_wizard/copy/proc/examine", function* examine(f: Frame, user: Value) {
	yield* parent_proc();
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11676, "/obj/effect/temp_visual/paperwiz_dying", "/obj/effect/temp_visual", {
	anchored: 1,
	duration: 18,
	randomdir: 0,
	name: "craft portal",
	desc: "A wormhole sucking the wizard into the void. Neat.",
	layer: 2.04,
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "paperwiz_poof",
});

// paperwizard.dm:153
rt.def("/obj/effect/temp_visual/paperwiz_dying/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.visible_message("<span class='boldannounce'>The wizard cries out in pain as a gate appears behind him, sucking him in!</span>");
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/magic/mandswap.ogg"), 50, 1, 1);
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/hallucinations/wail.ogg"), 50, 1, 1);
	return f.dot;
}, true);

// paperwizard.dm:159
rt.def("/obj/effect/temp_visual/paperwiz_dying/proc/Destroy", function* Destroy(f: Frame) {
	let M: Value = null, _T: Value = null;
	for (M of each(range(7, this), T("/mob"))) {
		shake_camera(M, 7, 1);
	}
	playsound((_T = rt.getStep(f, this, 0)), rt.rsc("sound/magic/summon_magic.ogg"), 50, 1, 1);
	yield* new_(T("/obj/effect/temp_visual/paper_scatter"), _T);
	yield* new_(T("/obj/item/clothing/suit/wizrobe/paper"), _T);
	yield* new_(T("/obj/item/clothing/head/collectable/paper"), _T);
	return (yield* parent_proc());
}, true);
