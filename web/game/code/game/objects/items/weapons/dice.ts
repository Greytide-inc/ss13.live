// Based on /tg/station's code/game/objects/items/weapons/dice.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5507, "/obj/item/weapon/storage/pill_bottle/dice", "/obj/item/weapon/storage/pill_bottle", {
	name: "bag of dice",
	desc: "Contains all the luck you'll ever need.",
	icon: rt.rsc("icons/obj/dice.dmi"),
	icon_state: "dicebag",
});

// dice.dm:8
rt.def("/obj/item/weapon/storage/pill_bottle/dice/proc/New", function* New(f: Frame) {
	let special_die: Value = null;
	yield* parent_proc();
	if ((special_die = pick("1", "2", "fudge", "space", "00", "8bd20", "4dd6", "100")) == "1") {
		yield* new_(T("/obj/item/weapon/dice/d1"), this);
	}
	if (special_die == "2") {
		yield* new_(T("/obj/item/weapon/dice/d2"), this);
	}
	yield* new_(T("/obj/item/weapon/dice/d4"), this);
	yield* new_(T("/obj/item/weapon/dice/d6"), this);
	if (special_die == "fudge") {
		yield* new_(T("/obj/item/weapon/dice/fudge"), this);
	}
	if (special_die == "space") {
		yield* new_(T("/obj/item/weapon/dice/d6/space"), this);
	}
	yield* new_(T("/obj/item/weapon/dice/d8"), this);
	yield* new_(T("/obj/item/weapon/dice/d10"), this);
	if (special_die == "00") {
		yield* new_(T("/obj/item/weapon/dice/d00"), this);
	}
	yield* new_(T("/obj/item/weapon/dice/d12"), this);
	yield* new_(T("/obj/item/weapon/dice/d20"), this);
	if (special_die == "8bd20") {
		yield* new_(T("/obj/item/weapon/dice/eightbd20"), this);
	}
	if (special_die == "4dd6") {
		yield* new_(T("/obj/item/weapon/dice/fourdd6"), this);
	}
	if (special_die != "100") return f.dot;
	yield* new_(T("/obj/item/weapon/dice/d100"), this);
	return f.dot;
}, true);

rt.type(7158, "/obj/item/weapon/dice", "/obj/item/weapon", {
	sides: 6,
	result: null,
	special_faces: null,
	can_be_rigged: 1,
	rigged: 0,
	name: "die",
	desc: "A die with six sides. Basic and servicable.",
	icon: rt.rsc("icons/obj/dice.dmi"),
	icon_state: "d6",
	w_class: 1,
});

// dice.dm:41
rt.def("/obj/item/weapon/dice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.special_faces = list();
	return f.dot;
});

// dice.dm:46
rt.def("/obj/item/weapon/dice/proc/New", function* New(f: Frame) {
	this.result = rand(1, this.sides);
	yield* this.update_icon();
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(7163, "/obj/item/weapon/dice/d6/space", "/obj/item/weapon/dice/d6", {
	name: "space cube",
	desc: "A die with six sides. 6 TIMES 255 TIMES 255 TILE TOTAL EXISTENCE, SQUARE YOUR MIND OF EDUCATED STUPID: 2 DOES NOT EXIST.",
	icon_state: "spaced6",
});

// dice.dm:77
rt.def("/obj/item/weapon/dice/d6/space/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (!prob(10)) return f.dot;
	this.name = "spess cube";
	return f.dot;
}, true);

// dice.dm:148
rt.def("/obj/item/weapon/dice/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.diceroll(user);
	return f.dot;
}, true);

// dice.dm:151
rt.def("/obj/item/weapon/dice/proc/throw_at", function* throw_at(f: Frame) {
	if (f.args[4] === null) {
		f.args[4] = 1;
	}
	if (f.args[5] === null) {
		f.args[5] = 0;
	}
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	yield* this.diceroll(f.args[3]);
	return f.dot;
}, true, { args: ["target", "range", "speed", "thrower", "spin", "diagonals_first", "callback"] });

// dice.dm:156
rt.def("/obj/item/weapon/dice/proc/diceroll", function diceroll(f: Frame, user: Value) {
	this.result = rand(1, this.sides);
	if (this.rigged && this.result != this.rigged) {
		if (prob(max(25, min(1 / (this.sides - 1) * 100, 80)))) {
			this.result = this.rigged;
		}
	}
	let fake_result: Value = rand(1, this.sides);
	let comment: Value = "";
	if (this.sides == 20 && this.result == 20) {
		comment = "Nat 20!";
	} else if (this.sides == 20 && this.result == 1) {
		comment = "Ouch, bad luck.";
	}
	this.update_icon();
	if (rt.initial(f, this, "icon_state") == "d00") {
		this.result = (this.result - 1) * 10;
	}
	if (rt.len(f, this.special_faces) == this.sides) {
		this.result = rt.index(this.special_faces, this.result);
	}
	if (user !== null) {
		user.visible_message(`${user} has thrown ${this}. It lands on ${this.result}. ${comment}`, `<span class='notice'>You throw ${this}. It lands on ${this.result}. ${comment}</span>`, `<span class='italics'>You hear ${this} rolling, it sounds like a ${fake_result}.</span>`);
	} else {
		if (this.throwing) return f.dot;
		this.visible_message(`<span class='notice'>${this} rolls to a stop, landing on ${this.result}. ${comment}</span>`);
	}
	return f.dot;
});

rt.type(7161, "/obj/item/weapon/dice/d4", "/obj/item/weapon/dice", {
	sides: 4,
	name: "d4",
	desc: "A die with four sides. The nerd's caltrop.",
	icon_state: "d4",
});

// dice.dm:179
rt.def("/obj/item/weapon/dice/d4/proc/Crossed", function* Crossed(f: Frame, H: Value) {
	if (!(rt.istype(H, T("/mob/living/carbon/human")) && !H.shoes)) return f.dot;
	if (rt.isIn(f, PIERCEIMMUNE, H.dna.species.species_traits)) {
		return 0;
	}
	to_chat(H, "<span class='userdanger'>You step on the D4!</span>");
	yield* H.apply_damage(4, "brute", pick("l_leg", "r_leg"));
	yield* H.Knockdown(60);
	return f.dot;
}, true);

// dice.dm:187
rt.def("/obj/item/weapon/dice/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	this.add_overlay(`${this.icon_state}${this.result}`);
	return f.dot;
});

// dice.dm:192
rt.def("/obj/item/weapon/dice/proc/microwave_act", function microwave_act(f: Frame, M: Value) {
	if (this.can_be_rigged) {
		this.rigged = this.result;
	}
	parent_proc(M);
	return f.dot;
});
