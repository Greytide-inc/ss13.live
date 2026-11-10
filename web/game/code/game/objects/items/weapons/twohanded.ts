// Based on /tg/station's code/game/objects/items/weapons/twohanded.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(5611, "/obj/item/weapon/twohanded", "/obj/item/weapon", {
	wielded: 0,
	force_unwielded: 0,
	force_wielded: 0,
	wieldsound: null,
	unwieldsound: null,
});

// twohanded.dm:33
rt.def("/obj/item/weapon/twohanded/proc/unwield", function* unwield(f: Frame, user: Value, show_message: Value) {
	let sf: Value = null, O: Value = null;
	show_message ??= 1;
	if (!this.wielded || !user) {
		return f.dot;
	}
	this.wielded = 0;
	if (this.force_unwielded) {
		this.force = this.force_unwielded;
	}
	if (sf = findtext(this.name, " (Wielded)")) {
		this.name = copytext(this.name, 1, sf);
	} else {
		this.name = `${rt.initial(f, this, "name")}`;
	}
	yield* this.update_icon();
	if (show_message) {
		if (rt.istype(user, T("/mob/living/silicon/robot"))) {
			to_chat(user, "<span class='notice'>You free up your module.</span>");
		} else {
			to_chat(user, `<span class='notice'>You are now carrying ${this} with one hand.</span>`);
		}
	}
	if (this.unwieldsound) {
		playsound(this.loc, this.unwieldsound, 50, 1);
	}
	if ((O = user.get_inactive_held_item()) && rt.istype(O, T("/obj/item/weapon/twohanded/offhand"))) {
		yield* O.unwield();
	}
	return f.dot;
}, true);

// twohanded.dm:59
rt.def("/obj/item/weapon/twohanded/proc/wield", function* wield(f: Frame, user: Value) {
	let O: Value = null;
	if (this.wielded) {
		return f.dot;
	}
	if (rt.istype(user, T("/mob/living/carbon/monkey"))) {
		to_chat(user, "<span class='warning'>It's too heavy for you to wield fully.</span>");
		return f.dot;
	}
	if (user.get_inactive_held_item()) {
		to_chat(user, "<span class='warning'>You need your other hand to be empty!</span>");
		return f.dot;
	}
	if (user.get_num_arms() < 2) {
		to_chat(user, "<span class='warning'>You don't have enough hands.</span>");
		return f.dot;
	}
	this.wielded = 1;
	if (this.force_wielded) {
		this.force = this.force_wielded;
	}
	this.name = `${this.name} (Wielded)`;
	yield* this.update_icon();
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		to_chat(user, `<span class='notice'>You dedicate your module to ${this}.</span>`);
	} else {
		to_chat(user, `<span class='notice'>You grab ${this} with both hands.</span>`);
	}
	if (this.wieldsound) {
		playsound(this.loc, this.wieldsound, 50, 1);
	}
	(O = (yield* new_(T("/obj/item/weapon/twohanded/offhand"), user))).name = `${this.name} - offhand`;
	O.desc = `Your second grip on ${this}.`;
	O.wielded = 1;
	yield* user.put_in_inactive_hand(O);
	return f.dot;
}, true);

// twohanded.dm:87
rt.def("/obj/item/weapon/twohanded/proc/dropped", function* dropped(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	if (!this.wielded) {
		return f.dot;
	}
	yield* this.unwield(user);
	return f.dot;
}, true);

// twohanded.dm:97
rt.def("/obj/item/weapon/twohanded/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	if (this.wielded) {
		yield* this.unwield(user);
	} else {
		yield* this.wield(user);
	}
	return f.dot;
}, true);

// twohanded.dm:104
rt.def("/obj/item/weapon/twohanded/proc/equip_to_best_slot", function* equip_to_best_slot(f: Frame, M: Value) {
	if (!(yield* parent_proc())) return f.dot;
	if (rt.istype(this, T("/obj/item/weapon/twohanded/required"))) {
		return f.dot;
	}
	yield* this.unwield(M);
	return f.dot;
}, true);

// twohanded.dm:111
rt.def("/obj/item/weapon/twohanded/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	yield* parent_proc();
	if (!(!user.is_holding(this) && this.wielded && !rt.istype(this, T("/obj/item/weapon/twohanded/required")))) return f.dot;
	yield* this.unwield(user);
	return f.dot;
}, true);

rt.type(5624, "/obj/item/weapon/twohanded/offhand", "/obj/item/weapon/twohanded", {
	flags: 130,
	name: "offhand",
	icon_state: "offhand",
	w_class: 5,
	resistance_flags: 115,
});

// twohanded.dm:126
rt.def("/obj/item/weapon/twohanded/offhand/proc/unwield", function* unwield(f: Frame) {
	if (!this.wielded) return f.dot;
	this.wielded = 0;
	yield* qdel(this);
	return f.dot;
}, true);

// twohanded.dm:131
rt.def("/obj/item/weapon/twohanded/offhand/proc/wield", function* wield(f: Frame) {
	if (!this.wielded) return f.dot;
	this.wielded = 0;
	yield* qdel(this);
	return f.dot;
}, true);

// twohanded.dm:134
rt.def("/obj/item/weapon/twohanded/offhand/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let O: Value = null;
	if (rt.istype((O = user.get_inactive_held_item()), T("/obj/item/weapon/twohanded")) && !rt.istype(O, T("/obj/item/weapon/twohanded/offhand"))) {
		return f.dot;
	}
	if (!this || this.gc_destroyed) {
		return f.dot;
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(5625, "/obj/item/weapon/twohanded/required", "/obj/item/weapon/twohanded", {
	w_class: 5,
});

// twohanded.dm:150
rt.def("/obj/item/weapon/twohanded/required/proc/mob_can_equip", function* mob_can_equip(f: Frame) {
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (this.wielded && !this.slot_flags) {
		to_chat(f.args[0], `<span class='warning'>${this} is too cumbersome to carry with anything but your hands!</span>`);
		return 0;
	}
	return (yield* parent_proc());
}, true, { args: ["M", "equipper", "slot", "disable_warning"] });

// twohanded.dm:156
rt.def("/obj/item/weapon/twohanded/required/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let H: Value = user.get_inactive_held_item();
	if (get_dist(this, user) > 1) {
		return f.dot;
	}
	if (H !== null) {
		to_chat(user, `<span class='notice'>${this} is too cumbersome to carry in one hand!</span>`);
		return f.dot;
	}
	if (this.loc != user) {
		yield* this.wield(user);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// twohanded.dm:167
rt.def("/obj/item/weapon/twohanded/required/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	let O: Value = null;
	yield* parent_proc();
	let slotbit: Value = slotdefine2slotbit(slot);
	if (rt.bitAnd(this.slot_flags, slotbit)) {
		if (!(O = user.is_holding_item_of_type(T("/obj/item/weapon/twohanded/offhand"))) || !O || O.gc_destroyed) {
			return f.dot;
		}
		yield* qdel(O);
		return f.dot;
	}
	if (slot == slot_hands) {
		yield* this.wield(user);
	} else {
		yield* this.unwield(user);
	}
	return f.dot;
}, true);

// twohanded.dm:181
rt.def("/obj/item/weapon/twohanded/required/proc/wield", function* wield(f: Frame, user: Value) {
	yield* parent_proc();
	if (this.wielded) return f.dot;
	yield* user.dropItemToGround(this);
	return f.dot;
}, true);

// twohanded.dm:187
rt.def("/obj/item/weapon/twohanded/required/proc/unwield", function* unwield(f: Frame, user: Value, show_message: Value) {
	show_message ??= 1;
	if (show_message) {
		to_chat(user, `<span class='notice'>You drop ${this}.</span>`);
	}
	yield* parent_proc(user, 0);
	yield* user.dropItemToGround(this);
	return f.dot;
}, true);

rt.type(5633, "/obj/item/weapon/twohanded/fireaxe", "/obj/item/weapon/twohanded", {
	force_unwielded: 5,
	force_wielded: 24,
	icon_state: "fireaxe0",
	name: "fire axe",
	desc: "Truly, the weapon of a madman. Who would think to fight fire with an axe?",
	force: 5,
	throwforce: 15,
	w_class: 4,
	slot_flags: 1024,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	sharpness: 1,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	resistance_flags: 2,
});

// twohanded.dm:209
rt.def("/obj/item/weapon/twohanded/fireaxe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("attacked", "chopped", "cleaved", "torn", "cut");
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 30]);
	return f.dot;
});

// twohanded.dm:213
rt.def("/obj/item/weapon/twohanded/fireaxe/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `fireaxe${this.wielded}`;
	return f.dot;
});

// twohanded.dm:217
rt.def("/obj/item/weapon/twohanded/fireaxe/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} axes ${user.p_them()}self from head to toe! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 1;
});

// twohanded.dm:221
rt.def("/obj/item/weapon/twohanded/fireaxe/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let W: Value = null, G: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (!this.wielded) return f.dot;
	if (rt.istype(A, T("/obj/structure/window"))) {
		yield* (W = A).take_damage(200, "brute", "melee", 0);
	} else {
		if (!rt.istype(A, T("/obj/structure/grille"))) return f.dot;
		yield* (G = A).take_damage(40, "brute", "melee", 0);
	}
	return f.dot;
}, true);

rt.type(5613, "/obj/item/weapon/twohanded/dualsaber", "/obj/item/weapon/twohanded", {
	w_class_on: 4,
	hacked: 0,
	brightness_on: 6,
	possible_colors: null,
	throw_speed: 3,
	throw_range: 5,
	light_color: "#00ff00",
	icon_state: "dualsaber0",
	name: "double-bladed energy sword",
	desc: "Handle with care.",
	force: 3,
	throwforce: 5,
	w_class: 2,
	force_unwielded: 3,
	force_wielded: 34,
	wieldsound: rt.rsc("sound/weapons/saberon.ogg"),
	unwieldsound: rt.rsc("sound/weapons/saberoff.ogg"),
	hitsound: "swing_hit",
	armour_penetration: 35,
	origin_tech: "magnets=4;syndicate=5",
	item_color: "green",
	attack_verb: null,
	block_chance: 75,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	resistance_flags: 2,
});

// twohanded.dm:258
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_colors = list("red", "blue", "green", "purple");
	this.attack_verb = list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut");
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 70]);
	return f.dot;
});

// twohanded.dm:265
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!rt.length(this.possible_colors)) return f.dot;
	this.item_color = pick(this.possible_colors);
	if (this.item_color === "red") {
		this.light_color = "#FA8282";
	} else if (this.item_color === "green") {
		this.light_color = "#64C864";
	} else if (this.item_color === "blue") {
		this.light_color = "#40CEFF";
	} else if (this.item_color === "purple") {
		this.light_color = "#9B51FF";
	}
	return f.dot;
}, true);

// twohanded.dm:279
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// twohanded.dm:284
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/update_icon", function update_icon(f: Frame) {
	if (this.wielded) {
		this.icon_state = `dualsaber${this.item_color}${this.wielded}`;
	} else {
		this.icon_state = "dualsaber0";
	}
	this.clean_blood();
	return f.dot;
});

// twohanded.dm:290
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	if (user.has_dna()) {
		if (user.dna.check_mutation("Hulk")) {
			to_chat(user, "<span class='warning'>You grip the blade too hard and accidentally close it!</span>");
			yield* this.unwield();
			return f.dot;
		}
	}
	yield* parent_proc();
	if (rt.bitAnd(user.disabilities, 256) && this.wielded && prob(40)) {
		yield* this.impale(user);
		return f.dot;
	}
	if (!(this.wielded && prob(50))) return f.dot;
	yield* ImmediateInvokeAsync(this, P("/obj/item/weapon/twohanded/dualsaber/proc/jedi_spin"), user);
	return f.dot;
}, true);

// twohanded.dm:303
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/jedi_spin", function* jedi_spin(f: Frame, user: Value) {
	let i: Value = null;
	for (i of each(list(1, 2, 4, 8, 4, 2, 1, 2, 4, 8, 4, 2))) {
		yield* user.setDir(i);
		if (i == 8) {
			yield* user.emote("flip");
		}
		yield* sleep(1);
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });

// twohanded.dm:310
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/impale", function* impale(f: Frame, user: Value) {
	to_chat(user, `<span class='warning'>You twirl around a bit before losing your balance and impaling yourself on ${this}.</span>`);
	if (this.force_wielded) {
		yield* user.take_bodypart_damage(20, 25);
	} else {
		yield* user.adjustStaminaLoss(25);
	}
	return f.dot;
}, true);

// twohanded.dm:318
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/hit_reaction", function hit_reaction(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = "the attack";
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (f.args[4] === null) {
		f.args[4] = 0;
	}
	if (f.args[5] === null) {
		f.args[5] = 1;
	}
	if (this.wielded) {
		return parent_proc();
	}
	return 0;
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });

// twohanded.dm:323
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/attack_hulk", function attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	does_attack_animation ??= 0;
	if (!this.wielded) return f.dot;
	to_chat(user, "<span class='warning'>You can't pick up such dangerous item with your meaty hands without losing fingers, better not to!</span>");
	return 1;
});

// twohanded.dm:327
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/wield", function* wield(f: Frame, M: Value) {
	if (M.has_dna()) {
		if (M.dna.check_mutation("Hulk")) {
			to_chat(M, "<span class='warning'>You lack the grace to wield this!</span>");
			return f.dot;
		}
	}
	yield* parent_proc();
	if (!this.wielded) return f.dot;
	this.sharpness = 1;
	this.w_class = this.w_class_on;
	this.hitsound = rt.rsc("sound/weapons/blade1.ogg");
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	this.set_light(this.brightness_on);
	return f.dot;
}, true);

// twohanded.dm:340
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/unwield", function* unwield(f: Frame) {
	this.sharpness = rt.initial(f, this, "sharpness");
	this.w_class = rt.initial(f, this, "w_class");
	yield* parent_proc();
	this.hitsound = "swing_hit";
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	this.set_light(0);
	return f.dot;
}, true);

// twohanded.dm:350
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/process", function* process(f: Frame) {
	if (this.wielded) {
		if (this.hacked) {
			this.light_color = pick("#FA8282", "#64C864", "#40CEFF", "#9B51FF");
		}
		yield* this.open_flame();
	} else {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
	}
	return f.dot;
}, true, { waitfor: false });

// twohanded.dm:361
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/ignition_effect", function* ignition_effect(f: Frame, A: Value, user: Value) {
	let C: Value = null;
	if (!this.wielded) {
		return "";
	}
	let in_mouth: Value = "";
	if (rt.istype(user, T("/mob/living/carbon"))) {
		if ((C = user).wear_mask == this) {
			in_mouth = ", barely missing their nose";
		}
	}
	f.dot = `<span class='warning'>${user} swings ${user.p_their()} ${this}${in_mouth}. ${user.p_they()} light${user.p_s()} ${A} in the process.</span>`;
	playsound(this.loc, this.hitsound, this.get_clamped_volume(), 1, -1);
	yield* this.add_fingerprint(user);
	yield* ImmediateInvokeAsync(this, P("/obj/item/weapon/twohanded/dualsaber/proc/jedi_spin"), user);
	return f.dot;
}, true);

rt.type(5615, "/obj/item/weapon/twohanded/dualsaber/green", "/obj/item/weapon/twohanded/dualsaber", {
	possible_colors: null,
});

// twohanded.dm:375
rt.def("/obj/item/weapon/twohanded/dualsaber/green/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_colors = list("green");
	return f.dot;
});

rt.type(5616, "/obj/item/weapon/twohanded/dualsaber/red", "/obj/item/weapon/twohanded/dualsaber", {
	possible_colors: null,
});

// twohanded.dm:378
rt.def("/obj/item/weapon/twohanded/dualsaber/red/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_colors = list("red");
	return f.dot;
});

rt.type(5617, "/obj/item/weapon/twohanded/dualsaber/blue", "/obj/item/weapon/twohanded/dualsaber", {
	possible_colors: null,
});

// twohanded.dm:381
rt.def("/obj/item/weapon/twohanded/dualsaber/blue/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_colors = list("blue");
	return f.dot;
});

rt.type(5618, "/obj/item/weapon/twohanded/dualsaber/purple", "/obj/item/weapon/twohanded/dualsaber", {
	possible_colors: null,
});

// twohanded.dm:384
rt.def("/obj/item/weapon/twohanded/dualsaber/purple/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_colors = list("purple");
	return f.dot;
});

// twohanded.dm:387
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/device/multitool"))) {
		if (this.hacked == 0) {
			this.hacked = 1;
			to_chat(user, "<span class='warning'>2XRNBW_ENGAGE</span>");
			this.item_color = "rainbow";
			yield* this.update_icon();
		} else {
			to_chat(user, "<span class='warning'>It's starting to look like a triple rainbow - no, nevermind.</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(5635, "/obj/item/weapon/twohanded/spear", "/obj/item/weapon/twohanded", {
	explosive: null,
	war_cry: "AAAAARGH!!!",
	force_unwielded: 10,
	force_wielded: 18,
	throw_speed: 4,
	icon_state: "spearglass0",
	name: "spear",
	desc: "A haphazardly-constructed yet still deadly weapon of ancient design.",
	force: 10,
	w_class: 4,
	slot_flags: 1024,
	throwforce: 20,
	embedded_impact_pain_multiplier: 3,
	armour_penetration: 10,
	materials: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	attack_verb: null,
	sharpness: 1,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
});

// twohanded.dm:412
rt.def("/obj/item/weapon/twohanded/spear/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 1150, "$glass", 2075]);
	this.attack_verb = list("attacked", "poked", "jabbed", "torn", "gored");
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 30]);
	return f.dot;
});

// twohanded.dm:424
rt.def("/obj/item/weapon/twohanded/spear/proc/update_icon", function update_icon(f: Frame) {
	if (this.explosive) {
		this.icon_state = `spearbomb${this.wielded}`;
	} else {
		this.icon_state = `spearglass${this.wielded}`;
	}
	return f.dot;
});

// twohanded.dm:429
rt.def("/obj/item/weapon/twohanded/spear/proc/afterattack", function* afterattack(f: Frame, AM: Value, user: Value, proximity: Value) {
	if (!proximity) {
		return f.dot;
	}
	if (rt.istype(AM, T("/turf/open"))) {
		return f.dot;
	}
	if (!(this.explosive && this.wielded)) return f.dot;
	yield* user.say(`${this.war_cry}`);
	this.explosive.loc = AM;
	yield* this.explosive.prime();
	yield* qdel(this);
	return f.dot;
}, true);

// twohanded.dm:441
rt.def("/obj/item/weapon/twohanded/spear/proc/throw_impact", function* throw_impact(f: Frame, target: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot) return f.dot;
	if (!this.explosive) return f.dot;
	yield* this.explosive.prime();
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

// twohanded.dm:448
rt.def("/obj/item/weapon/twohanded/spear/proc/AltClick", function* AltClick(f: Frame) {
	let input: Value = null;
	yield* parent_proc();
	if (!this.explosive) {
		return f.dot;
	}
	if (!ismob(this.loc)) return f.dot;
	let M: Value = this.loc;
	if (!(input = (yield* stripped_input(M, "What do you want your war cry to be? You will shout it when you hit someone in melee.", null, "", 50)))) return f.dot;
	this.war_cry = input;
	return f.dot;
}, true);

// twohanded.dm:458
rt.def("/obj/item/weapon/twohanded/spear/proc/CheckParts", function* CheckParts(f: Frame) {
	let S: Value = null, G: Value = null;
	if (S = rt.locateIn(f, T("/obj/item/weapon/twohanded/spear"), f.args[0])) {
		if (S.explosive) {
			yield* S.explosive.forceMove(rt.getStep(f, this, 0));
			S.explosive = null;
		}
		f.args[0] -= S;
		yield* qdel(S);
	}
	yield* parent_proc();
	if (G = rt.locateIn(f, T("/obj/item/weapon/grenade"), this.contents)) {
		this.explosive = G;
		this.name = "explosive lance";
		this.desc = `A makeshift spear with ${G} attached to it. Alt+click on the spear to set your war cry!`;
	}
	yield* this.update_icon();
	return f.dot;
}, true, { args: ["parts_list"] });

rt.type(5626, "/obj/item/weapon/twohanded/required/chainsaw", "/obj/item/weapon/twohanded/required", {
	force_on: 21,
	on: 0,
	flags: 64,
	throw_speed: 2,
	throw_range: 4,
	name: "chainsaw",
	desc: "A versatile power tool. Useful for limbing trees and delimbing humans.",
	icon_state: "chainsaw_off",
	force: 13,
	w_class: 5,
	throwforce: 13,
	materials: null,
	origin_tech: "materials=3;engineering=4;combat=2",
	attack_verb: null,
	hitsound: "swing_hit",
	sharpness: 1,
	actions_types: null,
});

// twohanded.dm:485
rt.def("/obj/item/weapon/twohanded/required/chainsaw/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 13000]);
	this.attack_verb = list("sawed", "torn", "cut", "chopped", "diced");

	this.actions_types = list(T("/datum/action/item_action/startchainsaw"));
	return f.dot;
});

// twohanded.dm:494
rt.def("/obj/item/weapon/twohanded/required/chainsaw/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	let $2: any, $e: any;
	this.on = (!this.on ? 1 : 0);
	let $0: any = user;
	let $1: any = this;
	if (this.on) {

		$2 = "it begins to whirr.";
	} else {
		$2 = "the chain stops moving.";
	}
	to_chat($0, `As you pull the starting cord dangling from ${$1}, ${$2}`);
	this.force = this.on ? this.force_on : rt.initial(f, this, "force");
	this.throwforce = this.on ? this.force_on : rt.initial(f, this, "force");
	this.icon_state = `chainsaw_${this.on ? "on" : "off"}`;
	if (this.hitsound == "swing_hit") {
		this.hitsound = rt.rsc("sound/weapons/chainsawhit.ogg");
	} else {
		this.hitsound = "swing_hit";
	}
	if (this == user.get_active_held_item()) {
		yield* user.update_inv_hands();
	}
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return f.dot;
}, true);

// twohanded.dm:513
rt.def("/obj/item/weapon/twohanded/required/chainsaw/proc/get_dismemberment_chance", function get_dismemberment_chance(f: Frame) {
	if (!this.wielded) return f.dot;
	f.dot = parent_proc();
	return f.dot;
});

rt.type(5627, "/obj/item/weapon/twohanded/required/chainsaw/doomslayer", "/obj/item/weapon/twohanded/required/chainsaw", {
	force_on: 30,
	name: "THE GREAT COMMUNICATOR",
	desc: "<span class='warning'>VRRRRRRR!!!</span>",
	armour_penetration: 100,
});

// twohanded.dm:522
rt.def("/obj/item/weapon/twohanded/required/chainsaw/doomslayer/proc/hit_reaction", function hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	attack_text ??= "the attack";
	final_block_chance ??= 0;
	damage ??= 0;
	attack_type ??= 1;
	if (attack_type == 3) {
		owner.visible_message(`<span class='danger'>Ranged attacks just make ${owner} angrier!</span>`);
		playsound(this, pick(rt.rsc("sound/weapons/bulletflyby.ogg"), rt.rsc("sound/weapons/bulletflyby2.ogg"), rt.rsc("sound/weapons/bulletflyby3.ogg")), 75, 1);
		return 1;
	}
	return 0;
});

rt.type(5636, "/obj/item/weapon/twohanded/spear/grey_tide", "/obj/item/weapon/twohanded/spear", {
	force_unwielded: 15,
	force_wielded: 25,
	throw_speed: 4,
	icon_state: "spearglass0",
	name: "１Grey Tide",
	desc: "Recovered from the aftermath of a revolt aboard Defense Outpost Theta Aegis, in which a seemingly endless tide of Assistants caused heavy casualities among Nanotrasen military forces.",
	throwforce: 20,
	attack_verb: null,
});

// twohanded.dm:537
rt.def("/obj/item/weapon/twohanded/spear/grey_tide/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("gored");
	return f.dot;
});

// twohanded.dm:540
rt.def("/obj/item/weapon/twohanded/spear/grey_tide/proc/afterattack", function* afterattack(f: Frame, AM: Value, user: Value, proximity: Value) {
	let L: Value = null, M: Value = null;
	yield* parent_proc();
	if (!proximity) {
		return f.dot;
	}
	(rt.modField(f, user, "faction", fmt("greytide(＃)", [user]), rt.bitOr));
	if (!rt.istype(AM, T("/mob/living"))) return f.dot;
	if (rt.istype((L = AM), T("/mob/living/simple_animal/hostile/illusion"))) {
		return f.dot;
	}
	if (!(!L.stat && prob(50))) return f.dot;
	(M = (yield* new_(T("/mob/living/simple_animal/hostile/illusion"), user.loc))).faction = (yield* user.faction.Copy());
	yield* M.Copy_Parent(user, 100, user.health / 2.5, 12, 30);
	yield* M.GiveTarget(L);
	return f.dot;
}, true);

rt.type(5637, "/obj/item/weapon/twohanded/pitchfork", "/obj/item/weapon/twohanded", {
	force_unwielded: 7,
	force_wielded: 15,
	icon_state: "pitchfork0",
	name: "pitchfork",
	desc: "A simple tool used for moving hay.",
	force: 7,
	throwforce: 15,
	w_class: 4,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	sharpness: 1,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	resistance_flags: 2,
});

// twohanded.dm:568
rt.def("/obj/item/weapon/twohanded/pitchfork/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("attacked", "impaled", "pierced");
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 30]);
	return f.dot;
});

rt.type(5638, "/obj/item/weapon/twohanded/pitchfork/demonic", "/obj/item/weapon/twohanded/pitchfork", {
	force_unwielded: 19,
	force_wielded: 25,
	name: "demonic pitchfork",
	desc: "A red pitchfork, it looks like the work of the devil.",
	force: 19,
	throwforce: 24,
});

// twohanded.dm:580
rt.def("/obj/item/weapon/twohanded/pitchfork/demonic/proc/Initialize", function Initialize(f: Frame) {
	this.set_light(3, 6, "#FA8282");
	return f.dot;
});

// twohanded.dm:595
rt.def("/obj/item/weapon/twohanded/pitchfork/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `pitchfork${this.wielded}`;
	return f.dot;
});

// twohanded.dm:598
rt.def("/obj/item/weapon/twohanded/pitchfork/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} impales ${user.p_them()}self in ${user.p_their()} abdomen with ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 1;
});

// twohanded.dm:602
rt.def("/obj/item/weapon/twohanded/pitchfork/demonic/proc/pickup", function* pickup(f: Frame, user: Value) {
	let U: Value = null, H: Value = null;
	if (!(rt.istype(user, T("/mob/living")) && user.mind && user.owns_soul() && !is_devil(user))) return f.dot;
	(U = user).visible_message(`<span class='warning'>As ${U} picks ${this} up, ${U}'s arms briefly catch fire.</span>`, `<span class='warning'>"As you pick up ${this} your arms ignite, reminding you of all your past sins."</span>`);
	if (rt.istype(U, T("/mob/living/carbon/human"))) {
		yield* (H = U).apply_damage(rand(this.force / 2, this.force), "fire", pick("l_arm", "r_arm"));
	} else {
		yield* U.adjustFireLoss(rand(this.force / 2, this.force));
	}
	return f.dot;
}, true);

// twohanded.dm:613
rt.def("/obj/item/weapon/twohanded/pitchfork/demonic/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	if (user.mind && user.owns_soul() && !is_devil(user)) {
		to_chat(user, `<span class ='warning'>${this} burns in your hands.</span>`);
		yield* user.apply_damage(rand(this.force / 2, this.force), "fire", pick("l_arm", "r_arm"));
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(5640, "/obj/item/weapon/twohanded/pitchfork/demonic/ascended", "/obj/item/weapon/twohanded/pitchfork/demonic", {
	force_unwielded: 100,
	force_wielded: 500000,
	force: 100,
	throwforce: 100,
});

// twohanded.dm:619
rt.def("/obj/item/weapon/twohanded/pitchfork/demonic/ascended/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let W: Value = null;
	if (!proximity || !this.wielded) {
		return f.dot;
	}
	if (rt.istype(target, T("/turf/closed/wall"))) {
		W = target;
		user.visible_message(fmt("<span class='danger'>＀ blasts ％！ with ％！!</span>", [user, target, this]));
		playsound(target, rt.rsc("sound/magic/disintegrate.ogg"), 100, 1);
		yield* W.break_wall();
		return 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(5641, "/obj/item/weapon/twohanded/vibro_weapon", "/obj/item/weapon/twohanded", {
	force_unwielded: 20,
	force_wielded: 40,
	throw_speed: 4,
	icon_state: "hfrequency0",
	name: "vibro sword",
	desc: "A potent weapon capable of cutting through nearly anything. Wielding it in two hands will allow you to deflect gunfire.",
	armour_penetration: 100,
	block_chance: 40,
	throwforce: 20,
	sharpness: 1,
	attack_verb: null,
	w_class: 4,
	slot_flags: 1024,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
});

// twohanded.dm:649
rt.def("/obj/item/weapon/twohanded/vibro_weapon/proc/hit_reaction", function hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	attack_text ??= "the attack";
	final_block_chance ??= 0;
	damage ??= 0;
	attack_type ??= 1;
	if (this.wielded) {
		final_block_chance *= 2;
	}
	if (this.wielded || attack_type != 3) {
		if (prob(final_block_chance)) {
			if (attack_type == 3) {
				owner.visible_message(`<span class='danger'>${owner} deflects ${attack_text} with ${this}!</span>`);
				playsound(this, pick(rt.rsc("sound/weapons/bulletflyby.ogg"), rt.rsc("sound/weapons/bulletflyby2.ogg"), rt.rsc("sound/weapons/bulletflyby3.ogg")), 75, 1);
				return 1;
			} else {
				owner.visible_message(`<span class='danger'>${owner} parries ${attack_text} with ${this}!</span>`);
				return 1;
			}
		}
	}
	return 0;
});

// twohanded.dm:662
rt.def("/obj/item/weapon/twohanded/vibro_weapon/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `hfrequency${this.wielded}`;
	return f.dot;
});

rt.type(5634, "/obj/item/weapon/twohanded/fireaxe/boneaxe", "/obj/item/weapon/twohanded/fireaxe", {
	force_wielded: 23,
	icon_state: "bone_axe0",
	name: "bone axe",
	desc: "A large, vicious axe crafted out of several sharpened bone plates and crudely tied together. Made of monsters, by killing monsters, for killing monsters.",
});

// twohanded.dm:674
rt.def("/obj/item/weapon/twohanded/fireaxe/boneaxe/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `bone_axe${this.wielded}`;
	return f.dot;
});

rt.type(5642, "/obj/item/weapon/twohanded/bonespear", "/obj/item/weapon/twohanded", {
	force_unwielded: 11,
	force_wielded: 20,
	throw_speed: 4,
	icon_state: "bone_spear0",
	name: "bone spear",
	desc: "A haphazardly-constructed yet still deadly weapon. The pinnacle of modern technology.",
	force: 11,
	w_class: 4,
	slot_flags: 1024,
	throwforce: 22,
	embedded_impact_pain_multiplier: 3,
	armour_penetration: 15,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	attack_verb: null,
	sharpness: 1,
});

// twohanded.dm:697
rt.def("/obj/item/weapon/twohanded/bonespear/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `bone_spear${this.wielded}`;
	return f.dot;
});
