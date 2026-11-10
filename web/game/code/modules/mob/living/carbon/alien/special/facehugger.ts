// Based on /tg/station's code/modules/mob/living/carbon/alien/special/facehugger.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(8587, "/obj/item/clothing/mask/facehugger", "/obj/item/clothing/mask", {
	stat: 0,
	sterile: 0,
	real: 1,
	strength: 5,
	attached: 0,
	flags: 8,
	throw_range: 5,
	name: "alien",
	desc: "It has some sort of a tube at the end of its tail.",
	icon: rt.rsc("icons/mob/alien.dmi"),
	icon_state: "facehugger",
	item_state: "facehugger",
	w_class: 1,
	tint: 3,
	flags_cover: 10,
	layer: 4,
	obj_integrity: 100,
	max_integrity: 100,
});

// facehugger.dm:49
rt.def("/obj/item/clothing/mask/facehugger/proc/take_damage", function* take_damage(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = "brute";
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	yield* parent_proc();
	if (!(this.obj_integrity < 90)) return f.dot;
	this.Die();
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// facehugger.dm:54
rt.def("/obj/item/clothing/mask/facehugger/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	return (yield* O.attack_obj(this, user));
}, true);

// facehugger.dm:57
rt.def("/obj/item/clothing/mask/facehugger/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	yield* this.attack_hand(user);
	return f.dot;
}, true);

// facehugger.dm:61
rt.def("/obj/item/clothing/mask/facehugger/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.stat == 0 && !this.sterile && !rt.istype(user, T("/mob/living/carbon/alien"))) {
		if (yield* this.Leap(user)) {
			return f.dot;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// facehugger.dm:67
rt.def("/obj/item/clothing/mask/facehugger/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	yield* parent_proc();
	if (!(yield* user.transferItemToLoc(this, rt.getStep(f, M, 0)))) return f.dot;
	yield* this.Leap(M);
	return f.dot;
}, true);

// facehugger.dm:72
rt.def("/obj/item/clothing/mask/facehugger/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.real) {
		return f.dot;
	}
	if (this.stat === 2 || this.stat === 1) {
		to_chat(user, `<span class='boldannounce'>${this} is not moving.</span>`);
	} else if (this.stat === 0) {
		to_chat(user, `<span class='boldannounce'>${this} seems to be active!</span>`);
	}
	if (!this.sterile) return f.dot;
	to_chat(user, "<span class='boldannounce'>It looks like the proboscis has been removed.</span>");
	return f.dot;
}, false);

// facehugger.dm:85
rt.def("/obj/item/clothing/mask/facehugger/proc/temperature_expose", function temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	if (!(exposed_temperature > 300)) return f.dot;
	this.Die();
	return f.dot;
});

// facehugger.dm:89
rt.def("/obj/item/clothing/mask/facehugger/proc/equipped", function* equipped(f: Frame, M: Value) {
	yield* this.Attach(M);
	return f.dot;
}, true);

// facehugger.dm:92
rt.def("/obj/item/clothing/mask/facehugger/proc/Crossed", function* Crossed(f: Frame, target: Value) {
	yield* this.HasProximity(target);
	return f.dot;
}, true);

// facehugger.dm:96
rt.def("/obj/item/clothing/mask/facehugger/proc/on_found", function* on_found(f: Frame, finder: Value) {
	if (this.stat == 0) {
		return (yield* this.HasProximity(finder));
	}
	return 0;
}, true);

// facehugger.dm:101
rt.def("/obj/item/clothing/mask/facehugger/proc/HasProximity", function* HasProximity(f: Frame, AM: Value) {
	if (CanHug(AM) && this.Adjacent(AM)) {
		return (yield* this.Leap(AM));
	}
	return 0;
}, true);

// facehugger.dm:106
rt.def("/obj/item/clothing/mask/facehugger/proc/throw_at", function* throw_at(f: Frame) {
	if (f.args[4] === null) {
		f.args[4] = 1;
	}
	if (f.args[5] === null) {
		f.args[5] = 0;
	}
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	if (this.stat != 0) return f.dot;
	this.icon_state = `${rt.initial(f, this, "icon_state")}_thrown`;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/mask/facehugger/proc/clear_throw_icon_state"))), 15);
	return f.dot;
}, true, { args: ["target", "range", "speed", "thrower", "spin", "diagonals_first", "callback"] });

// facehugger.dm:113
rt.def("/obj/item/clothing/mask/facehugger/proc/clear_throw_icon_state", function clear_throw_icon_state(f: Frame) {
	if (this.icon_state != `${rt.initial(f, this, "icon_state")}_thrown`) return f.dot;
	this.icon_state = `${rt.initial(f, this, "icon_state")}`;
	return f.dot;
});

// facehugger.dm:117
rt.def("/obj/item/clothing/mask/facehugger/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	yield* parent_proc();
	if (this.stat != 0) return f.dot;
	this.icon_state = `${rt.initial(f, this, "icon_state")}`;
	yield* this.Leap(hit_atom);
	return f.dot;
}, true, { waitfor: false });

// facehugger.dm:125
rt.def("/obj/item/clothing/mask/facehugger/proc/valid_to_attach", function valid_to_attach(f: Frame, M: Value) {
	let target: Value = null;
	if (this.stat != 0) {
		return 0;
	}
	if (this.attached) {
		return 0;
	}
	if (!rt.istype(M, T("/mob/living/simple_animal/pet/dog/corgi")) && !rt.istype(M, T("/mob/living/carbon"))) {
		return 0;
	}
	if (rt.istype(M, T("/mob/living/carbon"))) {
		if (rt.istype(M, T("/mob/living/carbon/alien")) || rt.istype(M, T("/mob/living/carbon/true_devil"))) {
			return 0;
		}
		if (!(target = M).get_bodypart("head")) {
			return 0;
		}
		if (target.getorgan(T("/obj/item/organ/alien/hivenode")) || target.getorgan(T("/obj/item/organ/body_egg/alien_embryo"))) {
			return 0;
		}
		return 1;
	} else {
		if (!rt.istype(M, T("/mob/living/simple_animal/pet/dog/corgi"))) return f.dot;
		return 1;
	}
});

// facehugger.dm:149
rt.def("/obj/item/clothing/mask/facehugger/proc/Leap", function* Leap(f: Frame, M: Value) {
	let target: Value = null, H: Value = null, W: Value = null;
	if (!this.valid_to_attach(M)) {
		return 0;
	}
	if (rt.istype(M, T("/mob/living/carbon"))) {
		if ((target = M).wear_mask && rt.istype(target.wear_mask, T("/obj/item/clothing/mask/facehugger"))) {
			return 0;
		}
	}
	M.visible_message(`<span class='danger'>${this} leaps at ${M}'s face!</span>`, `<span class='userdanger'>${this} leaps at ${M}'s face!</span>`);
	if (rt.istype(M, T("/mob/living/carbon"))) {
		target = M;
		if (rt.istype(M, T("/mob/living/carbon/human"))) {
			if (yield* (H = M).is_mouth_covered({ head_only: 1 })) {
				H.visible_message(`<span class='danger'>${this} smashes against ${H}'s ${H.head}!</span>`, `<span class='userdanger'>${this} smashes against ${H}'s ${H.head}!</span>`);
				this.Die();
				return 0;
			}
		}
		if (target.wear_mask) {
			W = target.wear_mask;
			if (yield* target.dropItemToGround(W)) {
				target.visible_message(`<span class='danger'>${this} tears ${W} off of ${target}'s face!</span>`, `<span class='userdanger'>${this} tears ${W} off of ${target}'s face!</span>`);
			}
		}
		yield* target.equip_to_slot_if_possible(this, slot_wear_mask, 0, 1, 1);
	}
	return 1;
}, true);

// facehugger.dm:180
rt.def("/obj/item/clothing/mask/facehugger/proc/Attach", function* Attach(f: Frame, M: Value) {
	let C: Value = null;
	if (!this.valid_to_attach(M)) {
		return f.dot;
	}
	this.attached++;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/mask/facehugger/proc/detach"))), 150);
	if (rt.istype(M, T("/mob/living/simple_animal/pet/dog/corgi"))) {
		this.loc = (C = M);
		C.facehugger = this;
		yield* C.regenerate_icons();
	}
	if (!this.sterile) {
		yield* M.take_bodypart_damage(this.strength, 0);
		yield* M.Unconscious(499.99997);
	}
	yield* this.GoIdle();
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/mask/facehugger/proc/Impregnate"), M)), rand(MIN_IMPREGNATION_TIME, 150));
	return f.dot;
}, true);

// facehugger.dm:205
rt.def("/obj/item/clothing/mask/facehugger/proc/Impregnate", function* Impregnate(f: Frame, target: Value) {
	let C: Value = null, LC: Value = null, C_1: Value = null;
	if (!target || target.stat == 2) {
		return f.dot;
	}
	if (rt.istype(target, T("/mob/living/carbon"))) {
		if ((C = target).wear_mask != this) {
			return f.dot;
		}
	}
	if (!this.sterile) {
		target.visible_message(`<span class='danger'>${this} falls limp after violating ${target}'s face!</span>`, `<span class='userdanger'>${this} falls limp after violating ${target}'s face!</span>`);
		this.Die();
		this.icon_state = `${rt.initial(f, this, "icon_state")}_impregnated`;
		if ((!(LC = target.get_bodypart("chest")) || LC.status != 2) && !target.getorgan(T("/obj/item/organ/body_egg/alien_embryo"))) {
			yield* new_(T("/obj/item/organ/body_egg/alien_embryo"), target);
		}
		if (rt.istype(target, T("/mob/living/simple_animal/pet/dog/corgi"))) {
			C_1 = target;
			this.loc = rt.getStep(f, C_1, 0);
			C_1.facehugger = null;
		}
	} else {
		target.visible_message(`<span class='danger'>${this} violates ${target}'s face!</span>`, `<span class='userdanger'>${this} violates ${target}'s face!</span>`);
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });

// facehugger.dm:234
rt.def("/obj/item/clothing/mask/facehugger/proc/GoActive", function GoActive(f: Frame) {
	if (this.stat == 2 || this.stat == 0) {
		return f.dot;
	}
	this.stat = 0;
	this.icon_state = `${rt.initial(f, this, "icon_state")}`;
	return f.dot;
});

// facehugger.dm:241
rt.def("/obj/item/clothing/mask/facehugger/proc/GoIdle", function* GoIdle(f: Frame) {
	if (this.stat == 2 || this.stat == 1) {
		return f.dot;
	}
	this.stat = 1;
	this.icon_state = `${rt.initial(f, this, "icon_state")}_inactive`;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/mask/facehugger/proc/GoActive"))), rand(MIN_ACTIVE_TIME, 400));
	return f.dot;
}, true);

// facehugger.dm:250
rt.def("/obj/item/clothing/mask/facehugger/proc/Die", function Die(f: Frame) {
	if (this.stat == 2) {
		return f.dot;
	}
	this.icon_state = `${rt.initial(f, this, "icon_state")}_dead`;
	this.item_state = "facehugger_inactive";
	this.stat = 2;
	this.visible_message(`<span class='danger'>${this} curls up into a ball!</span>`);
	return f.dot;
});

// facehugger.dm:260
rt.def("/proc/CanHug", function CanHug(f: Frame, M: Value) {
	let C: Value = null, H: Value = null;
	if (!rt.istype(M, T("/mob/living"))) {
		return 0;
	}
	if (M.stat == 2) {
		return 0;
	}
	if (M.getorgan(T("/obj/item/organ/alien/hivenode"))) {
		return 0;
	}
	if (rt.istype(M, T("/mob/living/simple_animal/pet/dog/corgi")) || rt.istype(M, T("/mob/living/carbon/monkey"))) {
		return 1;
	}
	if (rt.istype((C = M), T("/mob/living/carbon/human")) && !rt.isIn(f, slot_wear_mask, C.dna.species.no_equip)) {
		if ((H = C).is_mouth_covered({ head_only: 1 })) {
			return 0;
		}
		return 1;
	}
	return 0;
});
