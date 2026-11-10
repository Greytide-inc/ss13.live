// Based on /tg/station's code/modules/mob/living/carbon/alien/organs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(9465, "/obj/item/organ/alien", "/obj/item/organ", {
	alien_powers: null,
	origin_tech: "biotech=5",
	icon_state: "xgibmid2",
});

// organs.dm:4
rt.def("/obj/item/organ/alien/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.alien_powers = list();
	return f.dot;
});

// organs.dm:7
rt.def("/obj/item/organ/alien/proc/New", function* New(f: Frame) {
	let A: Value = null;
	for (A of each(this.alien_powers)) {
		if (ispath(A)) {
			this.alien_powers -= A;
			this.alien_powers += (yield* new_(A, this));
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// organs.dm:14
rt.def("/obj/item/organ/alien/proc/Insert", function* Insert(f: Frame) {
	let _P: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	for (_P of each(this.alien_powers, T("/obj/effect/proc_holder/alien"))) {
		yield* f.args[0].AddAbility(_P);
	}
	return f.dot;
}, true, { args: ["M", "special"] });

// organs.dm:20
rt.def("/obj/item/organ/alien/proc/Remove", function* Remove(f: Frame) {
	let _P: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	for (_P of each(this.alien_powers, T("/obj/effect/proc_holder/alien"))) {
		yield* f.args[0].RemoveAbility(_P);
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "special"] });

// organs.dm:25
rt.def("/obj/item/organ/alien/proc/prepare_eat", function* prepare_eat(f: Frame) {
	let S: Value = null;
	yield* (S = (yield* parent_proc())).reagents.add_reagent("sacid", 10);
	return S;
}, true);

rt.type(9466, "/obj/item/organ/alien/plasmavessel", "/obj/item/organ/alien", {
	storedPlasma: 100,
	max_plasma: 250,
	heal_rate: 5,
	plasma_rate: 10,
	name: "plasma vessel",
	icon_state: "plasma",
	origin_tech: "biotech=5;plasmatech=4",
	w_class: 3,
	zone: "chest",
	slot: "plasmavessel",
	alien_powers: null,
});

// organs.dm:37
rt.def("/obj/item/organ/alien/plasmavessel/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.alien_powers = list(T("/obj/effect/proc_holder/alien/plant"), T("/obj/effect/proc_holder/alien/transfer"));
	return f.dot;
});

// organs.dm:45
rt.def("/obj/item/organ/alien/plasmavessel/proc/prepare_eat", function* prepare_eat(f: Frame) {
	let S: Value = null;
	yield* (S = (yield* parent_proc())).reagents.add_reagent("plasma", this.storedPlasma / 10);
	return S;
}, true);

rt.type(9470, "/obj/item/organ/alien/plasmavessel/small/tiny", "/obj/item/organ/alien/plasmavessel/small", {
	max_plasma: 100,
	name: "tiny plasma vessel",
	icon_state: "plasma_tiny",
	w_class: 1,
	alien_powers: null,
});

// organs.dm:74
rt.def("/obj/item/organ/alien/plasmavessel/small/tiny/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.alien_powers = list(T("/obj/effect/proc_holder/alien/transfer"));
	return f.dot;
});

// organs.dm:78
rt.def("/obj/item/organ/alien/plasmavessel/proc/on_life", function* on_life(f: Frame) {
	let heal_amt: Value = null;
	if (rt.locateIn(f, T("/obj/structure/alien/weeds"), this.owner.loc)) {
		if (this.owner.health >= this.owner.maxHealth) {
			yield* this.owner.adjustPlasma(this.plasma_rate);
		} else {
			heal_amt = this.heal_rate;
			if (!rt.istype(this.owner, T("/mob/living/carbon/alien"))) {
				heal_amt *= 0.2;
			}
			yield* this.owner.adjustPlasma(this.plasma_rate * 0.5);
			yield* this.owner.adjustBruteLoss(-heal_amt);
			yield* this.owner.adjustFireLoss(-heal_amt);
			yield* this.owner.adjustOxyLoss(-heal_amt);
			yield* this.owner.adjustCloneLoss(-heal_amt);
		}
	} else {
		yield* this.owner.adjustPlasma(this.plasma_rate * 0.1);
	}
	return f.dot;
}, true);

// organs.dm:94
rt.def("/obj/item/organ/alien/plasmavessel/proc/Insert", function* Insert(f: Frame) {
	let A: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (!rt.istype(f.args[0], T("/mob/living/carbon/alien"))) return f.dot;
	(A = f.args[0]).updatePlasmaDisplay();
	return f.dot;
}, true, { args: ["M", "special"] });

// organs.dm:100
rt.def("/obj/item/organ/alien/plasmavessel/proc/Remove", function* Remove(f: Frame) {
	let A: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (!rt.istype(f.args[0], T("/mob/living/carbon/alien"))) return f.dot;
	(A = f.args[0]).updatePlasmaDisplay();
	return f.dot;
}, true, { args: ["M", "special"] });

rt.type(9471, "/obj/item/organ/alien/hivenode", "/obj/item/organ/alien", {
	recent_queen_death: 0,
	name: "hive node",
	icon_state: "hivenode",
	zone: "head",
	slot: "hivenode",
	origin_tech: "biotech=5;magnets=4;bluespace=3",
	w_class: 1,
	alien_powers: null,
});

// organs.dm:115
rt.def("/obj/item/organ/alien/hivenode/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.alien_powers = list(T("/obj/effect/proc_holder/alien/whisper"));
	return f.dot;
});

// organs.dm:118
rt.def("/obj/item/organ/alien/hivenode/proc/Insert", function* Insert(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	(rt.modField(f, f.args[0], "faction", "alien", rt.bitOr));
	return f.dot;
}, true, { args: ["M", "special"] });

// organs.dm:122
rt.def("/obj/item/organ/alien/hivenode/proc/Remove", function* Remove(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.args[0].faction -= "alien";
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "special"] });

// organs.dm:127
rt.def("/obj/item/organ/alien/hivenode/proc/queen_death", function* queen_death(f: Frame) {
	if (!this.owner || this.owner.stat == 2) {
		return f.dot;
	}
	if (rt.istype(this.owner, T("/mob/living/carbon/alien"))) {
		to_chat(this.owner, "<span class='userdanger'>Your Queen has been struck down!</span>");
		to_chat(this.owner, "<span class='danger'>You are struck with overwhelming agony! You feel confused, and your connection to the hivemind is severed.");
		yield* this.owner.emote("roar");
		yield* this.owner.Stun(200);
	} else if (rt.istype(this.owner, T("/mob/living/carbon/human"))) {
		to_chat(this.owner, "<span class='danger'>You feel a splitting pain in your head, and are struck with a wave of nausea. You cannot hear the hivemind anymore!");
		yield* this.owner.emote("scream");
		yield* this.owner.Knockdown(100);
	}
	this.owner.jitteriness += 30;
	this.owner.confused += 30;
	this.owner.stuttering += 30;
	this.recent_queen_death = 1;
	yield* this.owner.throw_alert("alien_noqueen", T("/obj/screen/alert/alien_vulnerable"));
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/organ/alien/hivenode/proc/clear_queen_death"))), QUEEN_DEATH_DEBUFF_DURATION);
	return f.dot;
}, true);

// organs.dm:150
rt.def("/obj/item/organ/alien/hivenode/proc/clear_queen_death", function* clear_queen_death(f: Frame) {
	if (!this || this.gc_destroyed) {
		return f.dot;
	}
	this.recent_queen_death = 0;
	if (!this.owner) {
		return f.dot;
	}
	to_chat(this.owner, "<span class='noticealien'>The pain of the queen's death is easing. You begin to hear the hivemind again.</span>");
	yield* this.owner.clear_alert("alien_noqueen");
	return f.dot;
}, true);

rt.type(9472, "/obj/item/organ/alien/resinspinner", "/obj/item/organ/alien", {
	name: "resin spinner",
	icon_state: "stomach-x",
	zone: "mouth",
	slot: "resinspinner",
	origin_tech: "biotech=5;materials=4",
	alien_powers: null,
});

// organs.dm:166
rt.def("/obj/item/organ/alien/resinspinner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.alien_powers = list(T("/obj/effect/proc_holder/alien/resin"));
	return f.dot;
});

rt.type(9473, "/obj/item/organ/alien/acid", "/obj/item/organ/alien", {
	name: "acid gland",
	icon_state: "acid",
	zone: "mouth",
	slot: "acidgland",
	origin_tech: "biotech=5;materials=2;combat=2",
	alien_powers: null,
});

// organs.dm:175
rt.def("/obj/item/organ/alien/acid/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.alien_powers = list(T("/obj/effect/proc_holder/alien/acid"));
	return f.dot;
});

rt.type(9474, "/obj/item/organ/alien/neurotoxin", "/obj/item/organ/alien", {
	name: "neurotoxin gland",
	icon_state: "neurotox",
	zone: "mouth",
	slot: "neurotoxingland",
	origin_tech: "biotech=5;combat=5",
	alien_powers: null,
});

// organs.dm:184
rt.def("/obj/item/organ/alien/neurotoxin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.alien_powers = list(T("/obj/effect/proc_holder/alien/neurotoxin"));
	return f.dot;
});

rt.type(9475, "/obj/item/organ/alien/eggsac", "/obj/item/organ/alien", {
	name: "egg sac",
	icon_state: "eggsac",
	zone: "groin",
	slot: "eggsac",
	w_class: 4,
	origin_tech: "biotech=6",
	alien_powers: null,
});

// organs.dm:194
rt.def("/obj/item/organ/alien/eggsac/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.alien_powers = list(T("/obj/effect/proc_holder/alien/lay_egg"));
	return f.dot;
});
