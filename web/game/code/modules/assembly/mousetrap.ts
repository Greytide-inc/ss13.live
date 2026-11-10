// Based on /tg/station's code/modules/assembly/mousetrap.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9377, "/obj/item/device/assembly/mousetrap", "/obj/item/device/assembly", {
	armed: 0,
	attachable: 1,
	name: "mousetrap",
	desc: "A handy little spring-loaded trap for catching pesty rodents.",
	icon_state: "mousetrap",
	materials: null,
	origin_tech: "combat=1;materials=2;engineering=1",
});

// mousetrap.dm:5
rt.def("/obj/item/device/assembly/mousetrap/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 100]);
	return f.dot;
});

// mousetrap.dm:12
rt.def("/obj/item/device/assembly/mousetrap/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.armed) {
		to_chat(user, "The mousetrap is armed!");
	} else {
		to_chat(user, "The mousetrap is not armed.");
	}
	return f.dot;
}, false);

// mousetrap.dm:19
rt.def("/obj/item/device/assembly/mousetrap/proc/activate", function* activate(f: Frame) {
	let user: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	this.armed = (!this.armed ? 1 : 0);
	if (!this.armed) {
		if (rt.istype(f.usr, T("/mob/living/carbon/human"))) {
			if ((user = f.usr).getBrainLoss() >= 60 || rt.bitAnd(user.disabilities, 256) && prob(50)) {
				to_chat(user, "<span class='warning'>Your hand slips, setting off the trigger!</span>");
				yield* this.pulse(0);
			}
		}
	}
	yield* this.update_icon();
	if (!f.usr) return f.dot;
	playsound(f.usr.loc, rt.rsc("sound/weapons/handcuffs.ogg"), 30, 1, -3);
	return f.dot;
}, true);

// mousetrap.dm:32
rt.def("/obj/item/device/assembly/mousetrap/proc/describe", function describe(f: Frame) {
	return `The pressure switch is ${this.armed ? "primed" : "safe"}.`;
});

// mousetrap.dm:36
rt.def("/obj/item/device/assembly/mousetrap/proc/update_icon", function* update_icon(f: Frame) {
	if (this.armed) {
		this.icon_state = "mousetraparmed";
	} else {
		this.icon_state = "mousetrap";
	}
	if (!this.holder) return f.dot;
	yield* this.holder.update_icon();
	return f.dot;
}, true);

// mousetrap.dm:43
rt.def("/obj/item/device/assembly/mousetrap/proc/triggered", function* triggered(f: Frame, target: Value, type: Value) {
	let affecting: Value = null, H: Value = null, M: Value = null;
	type ??= "feet";
	if (!this.armed) {
		return f.dot;
	}
	if (rt.istype(target, T("/mob/living/carbon/human"))) {
		H = target;
		if (rt.isIn(f, PIERCEIMMUNE, H.dna.species.species_traits)) {
			playsound(this.loc, rt.rsc("sound/effects/snap.ogg"), 50, 1);
			this.armed = 0;
			yield* this.update_icon();
			yield* this.pulse(0);
			return 0;
		}
		if (type === "feet") {
			if (!H.shoes) {
				affecting = H.get_bodypart(pick("l_leg", "r_leg"));
				yield* H.Knockdown(60);
			}
		} else if (type === "l_hand" || type === "r_hand") {
			if (!H.gloves) {
				affecting = H.get_bodypart(type);
				yield* H.Stun(60);
			}
		}
		if (affecting) {
			if (yield* affecting.receive_damage(1, 0)) {
				H.update_damage_overlays();
			}
		}
	} else if (rt.istype(target, T("/mob/living/simple_animal/mouse"))) {
		M = target;
		this.visible_message("<span class='boldannounce'>SPLAT!</span>");
		yield* M.splat();
	}
	playsound(this.loc, rt.rsc("sound/effects/snap.ogg"), 50, 1);
	this.armed = 0;
	yield* this.update_icon();
	yield* this.pulse(0);
	return f.dot;
}, true);

// mousetrap.dm:77
rt.def("/obj/item/device/assembly/mousetrap/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let which_hand: Value = null;
	if (!this.armed) {
		to_chat(user, `<span class='notice'>You arm ${this}.</span>`);
	} else {
		if ((user.getBrainLoss() >= 60 || rt.bitAnd(user.disabilities, 256)) && prob(50)) {
			which_hand = "l_hand";
			if (!(user.active_hand_index % 2)) {
				which_hand = "r_hand";
			}
			yield* this.triggered(user, which_hand);
			user.visible_message(`<span class='warning'>${user} accidentally sets off ${this}, breaking their fingers.</span>`, `<span class='warning'>You accidentally trigger ${this}!</span>`);
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You disarm ${this}.</span>`);
	}
	this.armed = (!this.armed ? 1 : 0);
	yield* this.update_icon();
	playsound(user.loc, rt.rsc("sound/weapons/handcuffs.ogg"), 30, 1, -3);
	return f.dot;
}, true);

// mousetrap.dm:96
rt.def("/obj/item/device/assembly/mousetrap/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let which_hand: Value = null;
	if (this.armed) {
		if ((user.getBrainLoss() >= 60 || rt.bitAnd(user.disabilities, 256)) && prob(50)) {
			which_hand = "l_hand";
			if (!(user.active_hand_index % 2)) {
				which_hand = "r_hand";
			}
			yield* this.triggered(user, which_hand);
			user.visible_message(`<span class='warning'>${user} accidentally sets off ${this}, breaking their fingers.</span>`, `<span class='warning'>You accidentally trigger ${this}!</span>`);
			return f.dot;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// mousetrap.dm:109
rt.def("/obj/item/device/assembly/mousetrap/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let MM: Value = null, H: Value = null;
	if (this.armed) {
		if (ismob(AM)) {
			if (!rt.bitAnd((MM = AM).movement_type, 2)) {
				if (rt.istype(AM, T("/mob/living/carbon/human"))) {
					if ((H = AM).m_intent == "run") {
						yield* this.triggered(H);
						H.visible_message(`<span class='warning'>${H} accidentally steps on ${this}.</span>`, `<span class='warning'>You accidentally step on ${this}</span>`);
					}
				} else if (rt.istype(MM, T("/mob/living/simple_animal/mouse"))) {
					yield* this.triggered(MM);
				}
			}
		} else if (AM.density) {
			yield* this.triggered(AM);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// mousetrap.dm:127
rt.def("/obj/item/device/assembly/mousetrap/proc/on_found", function* on_found(f: Frame, finder: Value) {
	let $0: any, $1: any;
	if (this.armed) {
		finder.visible_message(`<span class='warning'>${finder} accidentally sets off ${this}, breaking their fingers.</span>`, `<span class='warning'>You accidentally trigger ${this}!</span>`);
		$0 = finder;
		if (finder.active_hand_index % 2 == 0) {
			$1 = "r_hand";
		} else {
			$1 = "l_hand";
		}
		yield* this.triggered($0, $1);
		return 1;
	}
	return 0;
}, true);

// mousetrap.dm:135
rt.def("/obj/item/device/assembly/mousetrap/proc/hitby", function* hitby(f: Frame, A: Value) {
	if (!this.armed) {
		return (yield* parent_proc());
	}
	this.visible_message(`<span class='warning'>${this} is triggered by ${A}.</span>`);
	yield* this.triggered(null);
	return f.dot;
}, true);
