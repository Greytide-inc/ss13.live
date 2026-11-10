// Based on /tg/station's code/game/objects/items/weapons/shields.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(5699, "/obj/item/weapon/shield", "/obj/item/weapon", {
	name: "shield",
	block_chance: 50,
	armor: null,
});

// shields.dm:4
rt.def("/obj/item/weapon/shield/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 50, "laser", 50, "energy", 0, "bomb", 30, "bio", 0, "rad", 0, "fire", 80, "acid", 70]);
	return f.dot;
});

rt.type(5701, "/obj/item/weapon/shield/riot", "/obj/item/weapon/shield", {
	cooldown: 0,
	throw_speed: 2,
	throw_range: 3,
	name: "riot shield",
	desc: "A shield adept at blocking blunt objects from connecting with the torso of the shield wielder.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "riot",
	slot_flags: 1024,
	force: 10,
	throwforce: 5,
	w_class: 4,
	materials: null,
	origin_tech: "materials=3;combat=4",
	attack_verb: null,
});

// shields.dm:17
rt.def("/obj/item/weapon/shield/riot/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 7500, "$metal", 1000]);
	this.attack_verb = list("shoved", "bashed");
	return f.dot;
});

// shields.dm:24
rt.def("/obj/item/weapon/shield/riot/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/melee/baton"))) {
		if (this.cooldown < rt.worldTime(f) - 25) {
			user.visible_message(`<span class='warning'>${user} bashes ${this} with ${W}!</span>`);
			playsound(user.loc, rt.rsc("sound/effects/shieldbash.ogg"), 50, 1);
			this.cooldown = rt.worldTime(f);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// shields.dm:33
rt.def("/obj/item/weapon/shield/proc/hit_reaction", function hit_reaction(f: Frame) {
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
	if (f.args[5] == 4) {
		f.args[3] += 30;
	}
	if (f.args[5] == 5) {
		f.args[3] = 100;
	}
	return parent_proc();
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });

rt.type(5703, "/obj/item/weapon/shield/riot/buckler", "/obj/item/weapon/shield/riot", {
	name: "wooden buckler",
	desc: "A medieval wooden buckler.",
	icon_state: "buckler",
	item_state: "buckler",
	materials: null,
	origin_tech: "materials=1;combat=3;biotech=2",
	resistance_flags: 4,
	block_chance: 30,
});

// shields.dm:50
rt.def("/obj/item/weapon/shield/riot/buckler/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	return f.dot;
});

rt.type(5705, "/obj/item/weapon/shield/energy", "/obj/item/weapon/shield", {
	active: 0,
	throw_speed: 3,
	throw_range: 5,
	name: "energy combat shield",
	desc: "A shield capable of stopping most melee attacks. Protects user from almost all energy projectiles. It can be retracted, expanded, and stored anywhere.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "eshield0",
	force: 3,
	throwforce: 3,
	w_class: 1,
	origin_tech: "materials=4;magnets=5;syndicate=6",
	attack_verb: null,
});

// shields.dm:76
rt.def("/obj/item/weapon/shield/energy/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (rt.bitAnd(user.disabilities, 256) && prob(50)) {
		to_chat(user, `<span class='warning'>You beat yourself in the head with ${this}.</span>`);
		yield* user.take_bodypart_damage(5);
	}
	this.active = (!this.active ? 1 : 0);
	this.icon_state = `eshield${this.active}`;
	if (this.active) {
		this.force = 10;
		this.throwforce = 8;
		this.throw_speed = 2;
		this.w_class = WEIGHT_CLASS_BULKY;
		playsound(user, rt.rsc("sound/weapons/saberon.ogg"), 35, 1);
		to_chat(user, `<span class='notice'>${this} is now active.</span>`);
	} else {
		this.force = 3;
		this.throwforce = 3;
		this.throw_speed = 3;
		this.w_class = WEIGHT_CLASS_TINY;
		playsound(user, rt.rsc("sound/weapons/saberoff.ogg"), 35, 1);
		to_chat(user, `<span class='notice'>${this} can now be concealed.</span>`);
	}
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

rt.type(5704, "/obj/item/weapon/shield/riot/tele", "/obj/item/weapon/shield/riot", {
	active: 0,
	throw_speed: 3,
	throw_range: 4,
	name: "telescopic shield",
	desc: "An advanced riot shield made of lightweight materials that collapses for easy storage.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "teleriot0",
	origin_tech: "materials=3;combat=4;engineering=4",
	slot_flags: null,
	force: 3,
	throwforce: 3,
	w_class: 3,
});

// shields.dm:114
rt.def("/obj/item/weapon/shield/riot/tele/proc/hit_reaction", function hit_reaction(f: Frame) {
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
	if (this.active) {
		return parent_proc();
	}
	return 0;
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });

// shields.dm:118
rt.def("/obj/item/weapon/shield/riot/tele/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	this.active = (!this.active ? 1 : 0);
	this.icon_state = `teleriot${this.active}`;
	playsound(this.loc, rt.rsc("sound/weapons/batonextend.ogg"), 50, 1);
	if (this.active) {
		this.force = 8;
		this.throwforce = 5;
		this.throw_speed = 2;
		this.w_class = WEIGHT_CLASS_BULKY;
		this.slot_flags = SLOT_BACK;
		to_chat(user, fmt("<span class='notice'>You extend ％！.</span>", [this]));
	} else {
		this.force = 3;
		this.throwforce = 3;
		this.throw_speed = 3;
		this.w_class = WEIGHT_CLASS_NORMAL;
		this.slot_flags = null;
		to_chat(user, `<span class='notice'>${this} can now be concealed.</span>`);
	}
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);
