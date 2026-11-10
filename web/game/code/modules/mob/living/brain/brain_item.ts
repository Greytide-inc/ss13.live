// Based on /tg/station's code/modules/mob/living/brain/brain_item.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9462, "/obj/item/organ/brain", "/obj/item/organ", {
	brainmob: null,
	damaged_brain: 0,
	decoy_override: 0,
	throw_speed: 3,
	throw_range: 5,
	name: "brain",
	desc: "A piece of juicy meat found in a person's head.",
	icon_state: "brain",
	layer: 4.1,
	zone: "head",
	slot: "brain",
	vital: 1,
	origin_tech: "biotech=5",
	attack_verb: null,
});

// brain_item.dm:22
rt.def("/obj/item/organ/brain/proc/Insert", function* Insert(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	this.name = "brain";
	if (f.args[0].mind && f.args[0].mind.changeling) {
		if (this.brainmob && !(f.args[0].stat == 2 || rt.bitAnd(f.args[0].status_flags, FAKEDEATH))) {
			to_chat(this.brainmob, "<span class = danger>You can't feel your body! You're still just a brain!</span>");
		}
		this.loc = f.args[0];
		yield* f.args[0].update_hair();
		return f.dot;
	}
	if (this.brainmob) {
		if (f.args[0].key) {
			yield* f.args[0].ghostize();
		}
		if (this.brainmob.mind) {
			yield* this.brainmob.mind.transfer_to(f.args[0]);
		} else {
			f.args[0].key = this.brainmob.key;
		}
		yield* qdel(this.brainmob);
		this.brainmob = null;
	}
	yield* f.args[0].update_hair();
	return f.dot;
}, true, { args: ["C", "special"] });

// brain_item.dm:48
rt.def("/obj/item/organ/brain/proc/Remove", function* Remove(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (!this.gc_destroyed || this.owner && !this.owner.gc_destroyed) {
		yield* this.transfer_identity(f.args[0]);
	}
	yield* f.args[0].update_hair();
	return f.dot;
}, true, { args: ["C", "special"] });

// brain_item.dm:57
rt.def("/obj/item/organ/brain/proc/transfer_identity", function* transfer_identity(f: Frame, L: Value) {
	let C: Value = null, ZI: Value = null;
	this.name = `${L.name}'s brain`;
	if (this.brainmob || this.decoy_override) {
		return f.dot;
	}
	if (!L.mind) {
		return f.dot;
	}
	this.brainmob = (yield* new_(T("/mob/living/brain"), this));
	this.brainmob.name = L.real_name;
	this.brainmob.real_name = L.real_name;
	this.brainmob.timeofhostdeath = L.timeofdeath;
	if (L.has_dna()) {
		C = L;
		if (!this.brainmob.stored_dna) {
			this.brainmob.stored_dna = (yield* new_(T("/datum/dna/stored"), this.brainmob));
		}
		yield* C.dna.copy_dna(this.brainmob.stored_dna);
		if (rt.bitAnd(L.disabilities, 128)) {
			(rt.modField(f, this.brainmob, "disabilities", 128, rt.bitOr));
		}
		if (ZI = L.getorganslot("zombie_infection")) {
			yield* this.brainmob.set_species(ZI.old_species);
		}
	}
	if (L.mind && L.mind.current) {
		yield* L.mind.transfer_to(this.brainmob);
	}
	to_chat(this.brainmob, "<span class='notice'>You feel slightly disoriented. That's normal when you're just a brain.</span>");
	return f.dot;
}, true);

// brain_item.dm:81
rt.def("/obj/item/organ/brain/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	user.changeNext_move(8);
	if (!this.brainmob) return f.dot;
	yield* O.attack(this.brainmob, user);
	return f.dot;
}, true);

// brain_item.dm:86
rt.def("/obj/item/organ/brain/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.brainmob) {
		if (this.brainmob.client) {
			if (this.brainmob.health <= -100) {
				to_chat(user, "It's lifeless and severely damaged.");
			} else {
				to_chat(user, "You can feel the small spark of life still left in this one.");
			}
		} else {
			to_chat(user, "This one seems particularly lifeless. Perhaps it will regain some of its luster later.");
		}
	} else if (this.decoy_override) {
		to_chat(user, "This one seems particularly lifeless. Perhaps it will regain some of its luster later.");
	} else {
		to_chat(user, "This one is completely devoid of life.");
	}
	return f.dot;
}, false);

// brain_item.dm:103
rt.def("/obj/item/organ/brain/proc/attack", function* attack(f: Frame, C: Value, user: Value) {
	let msg: Value = null;
	if (!rt.istype(C, T("/mob/living/carbon"))) {
		return (yield* parent_proc());
	}
	yield* this.add_fingerprint(user);
	if (user.zone_selected != "head") {
		return (yield* parent_proc());
	}
	if (C.head && rt.bitAnd(C.head.flags_cover, HEADCOVERSEYES) || C.wear_mask && rt.bitAnd(C.wear_mask.flags_cover, MASKCOVERSEYES) || C.glasses && rt.bitAnd(C.glasses.flags, GLASSESCOVERSEYES)) {
		to_chat(user, "<span class='warning'>You're going to need to remove their head cover first!</span>");
		return f.dot;
	}
	if (!C.getorgan(T("/obj/item/organ/brain"))) {
		if (!C.get_bodypart("head")) {
			return f.dot;
		}
		yield* user.drop_item();
		msg = `${C} has ${this} inserted into ${C.p_their()} head by ${user}.`;
		if (C == user) {
			msg = `${user} inserts ${this} into ${user.p_their()} head!`;
		}
		C.visible_message(`<span class='danger'>${msg}</span>`, `<span class='userdanger'>${msg}</span>`);
		if (C != user) {
			to_chat(C, `<span class='notice'>${user} inserts ${this} into your head.</span>`);
			to_chat(user, `<span class='notice'>You insert ${this} into ${C}'s head.</span>`);
		} else {
			to_chat(user, `<span class='notice'>You insert ${this} into your head.</span>`);
		}
		yield* this.Insert(C);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// brain_item.dm:140
rt.def("/obj/item/organ/brain/proc/Destroy", function* Destroy(f: Frame) {
	if (this.brainmob) {
		yield* qdel(this.brainmob);
		this.brainmob = null;
	}
	return (yield* parent_proc());
}, true);
