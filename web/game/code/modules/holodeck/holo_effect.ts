// Based on /tg/station's code/modules/holodeck/holo_effect.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12070, "/obj/effect/holodeck_effect", "/obj/effect", {
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x2",
	invisibility: 101,
});

// holo_effect.dm:16
rt.def("/obj/effect/holodeck_effect/proc/deactivate", function* deactivate(f: Frame, HC: Value) {
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12071, "/obj/effect/holodeck_effect/cards", "/obj/effect/holodeck_effect", {
	D: null,
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "deck_nanotrasen_full",
});

// holo_effect.dm:34
rt.def("/obj/effect/holodeck_effect/cards/proc/activate", function* activate(f: Frame, HC: Value) {
	this.D = (yield* new_(T("/obj/item/toy/cards/deck"), this.loc));
	this.safety((!HC.emagged ? 1 : 0));
	this.D.holo = HC;
	return this.D;
}, true);

// holo_effect.dm:40
rt.def("/obj/effect/holodeck_effect/cards/proc/safety", function safety(f: Frame, active: Value) {
	if (!this.D) {
		return f.dot;
	}
	if (active) {
		this.D.card_hitsound = null;
		this.D.card_force = 0;
		this.D.card_throwforce = 0;
		this.D.card_throw_speed = 3;
		this.D.card_throw_range = 7;
		this.D.card_attack_verb = list("attacked");
	} else {
		this.D.card_hitsound = rt.rsc("sound/weapons/bladeslice.ogg");
		this.D.card_force = 5;
		this.D.card_throwforce = 10;
		this.D.card_throw_speed = 3;
		this.D.card_throw_range = 7;
		this.D.card_attack_verb = list("attacked", "sliced", "diced", "slashed", "cut");
	}
	return f.dot;
});

rt.type(12072, "/obj/effect/holodeck_effect/sparks", "/obj/effect/holodeck_effect", {});

// holo_effect.dm:59
rt.def("/obj/effect/holodeck_effect/sparks/proc/activate", function* activate(f: Frame, HC: Value) {
	let _T: Value = null, s: Value = null;
	if (!(_T = rt.getStep(f, this, 0))) return f.dot;
	yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(3, 1, _T);
	yield* s.start();
	_T.temperature = 5000;
	yield* _T.hotspot_expose(50000, 50000, 1);
	return f.dot;
}, true);

rt.type(12073, "/obj/effect/holodeck_effect/mobspawner", "/obj/effect/holodeck_effect", {
	mobtype: rt.typePath("/mob/living/simple_animal/hostile/carp/holocarp"),
	mob: null,
});

// holo_effect.dm:74
rt.def("/obj/effect/holodeck_effect/mobspawner/proc/activate", function* activate(f: Frame, HC: Value) {
	let v: Value = null;
	if (rt.istype(this.mobtype, T("/list"))) {
		this.mobtype = pick(this.mobtype);
	}
	this.mob = (yield* new_(this.mobtype, this.loc));
	for (v of each(rt.bitAnd(list("butcher_results", "corpse", "weapon1", "weapon2", "blood_volume"), this.mob.vars))) {
		rt.setAt(this.mob.vars, v, null);
	}
	return this.mob;
}, true);

// holo_effect.dm:85
rt.def("/obj/effect/holodeck_effect/mobspawner/proc/deactivate", function* deactivate(f: Frame, HC: Value) {
	if (this.mob) {
		yield* HC.derez(this.mob);
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12074, "/obj/effect/holodeck_effect/mobspawner/pet", "/obj/effect/holodeck_effect/mobspawner", {
	mobtype: null,
});

// holo_effect.dm:89
rt.def("/obj/effect/holodeck_effect/mobspawner/pet/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mobtype = list(T("/mob/living/simple_animal/butterfly"), T("/mob/living/simple_animal/chick/holo"), T("/mob/living/simple_animal/pet/cat"), T("/mob/living/simple_animal/pet/cat/kitten"), T("/mob/living/simple_animal/pet/dog/corgi"), T("/mob/living/simple_animal/pet/dog/corgi/puppy"), T("/mob/living/simple_animal/pet/dog/pug"), T("/mob/living/simple_animal/pet/fox"));
	return f.dot;
});
