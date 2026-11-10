// Based on /tg/station's code/game/objects/items/weapons/kitchen.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7270, "/obj/item/weapon/kitchen/fork", "/obj/item/weapon/kitchen", {
	forkload: null,
	throw_speed: 3,
	throw_range: 5,
	flags: 64,
	name: "fork",
	desc: "Pointy.",
	icon_state: "fork",
	force: 5,
	w_class: 1,
	throwforce: 0,
	materials: null,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	armor: null,
});

// kitchen.dm:24
rt.def("/obj/item/weapon/kitchen/fork/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 80]);
	this.attack_verb = list("attacked", "stabbed", "poked");
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 30]);
	return f.dot;
});

// kitchen.dm:32
rt.def("/obj/item/weapon/kitchen/fork/proc/attack", function* attack(f: Frame) {
	if (!rt.istype(f.args[0], T("/mob/living/carbon"))) {
		return (yield* parent_proc());
	}
	if (this.forkload) {
		if (f.args[0] == f.args[1]) {
			f.args[0].visible_message(`<span class='notice'>${f.args[1]} eats a delicious forkful of omelette!</span>`);
			yield* f.args[0].reagents.add_reagent(this.forkload.id, 1);
		} else {
			f.args[0].visible_message(`<span class='notice'>${f.args[1]} feeds ${f.args[0]} a delicious forkful of omelette!</span>`);
			yield* f.args[0].reagents.add_reagent(this.forkload.id, 1);
		}
		this.icon_state = "fork";
		this.forkload = null;
	} else {
		if (f.args[1].zone_selected == "eyes") {
			if (rt.bitAnd(f.args[1].disabilities, 256) && prob(50)) {
				f.args[0] = f.args[1];
			}
			return (yield* this.eyestab(f.args[0], f.args[1]));
		}
		return (yield* parent_proc());
	}
	return f.dot;
}, true, { args: ["M", "user"] });

rt.type(7271, "/obj/item/weapon/kitchen/knife", "/obj/item/weapon/kitchen", {
	bayonet: 0,
	flags: 64,
	throw_speed: 3,
	throw_range: 6,
	name: "kitchen knife",
	icon_state: "knife",
	desc: "A general purpose Chef's Knife made by SpaceCook Incorporated. Guaranteed to stay sharp for years to come.",
	force: 10,
	w_class: 2,
	throwforce: 10,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	materials: null,
	attack_verb: null,
	sharpness: 2,
	armor: null,
});

// kitchen.dm:64
rt.def("/obj/item/weapon/kitchen/knife/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 12000]);
	this.attack_verb = list("slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut");
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});

// kitchen.dm:71
rt.def("/obj/item/weapon/kitchen/knife/proc/attack", function* attack(f: Frame) {
	if (f.args[1].zone_selected == "eyes") {
		if (rt.bitAnd(f.args[1].disabilities, 256) && prob(50)) {
			f.args[0] = f.args[1];
		}
		return (yield* this.eyestab(f.args[0], f.args[1]));
	}
	return (yield* parent_proc());
}, true, { args: ["M", "user"] });

// kitchen.dm:79
rt.def("/obj/item/weapon/kitchen/knife/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(pick(`<span class='suicide'>${user} is slitting ${user.p_their()} wrists with the ${this.name}! It looks like ${user.p_theyre()} trying to commit suicide.</span>`, `<span class='suicide'>${user} is slitting ${user.p_their()} throat with the ${this.name}! It looks like ${user.p_theyre()} trying to commit suicide.</span>`, `<span class='suicide'>${user} is slitting ${user.p_their()} stomach open with the ${this.name}! It looks like ${user.p_theyre()} trying to commit seppuku.</span>`));
	return 1;
});

rt.type(7273, "/obj/item/weapon/kitchen/knife/butcher", "/obj/item/weapon/kitchen/knife", {
	flags: 64,
	name: "butcher's cleaver",
	icon_state: "butch",
	desc: "A huge thing used for chopping and chopping up meat. This includes clowns and clown by-products.",
	force: 15,
	throwforce: 10,
	materials: null,
	attack_verb: null,
	w_class: 3,
});

// kitchen.dm:98
rt.def("/obj/item/weapon/kitchen/knife/butcher/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 18000]);
	this.attack_verb = list("cleaved", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut");
	return f.dot;
});

rt.type(7276, "/obj/item/weapon/kitchen/knife/combat/bone", "/obj/item/weapon/kitchen/knife/combat", {
	name: "bone dagger",
	item_state: "bone_dagger",
	icon_state: "bone_dagger",
	desc: "A sharpened bone. The bare mimimum in survival.",
	force: 15,
	throwforce: 15,
	materials: null,
});

// kitchen.dm:128
rt.def("/obj/item/weapon/kitchen/knife/combat/bone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	return f.dot;
});

rt.type(7278, "/obj/item/weapon/kitchen/knife/carrotshiv", "/obj/item/weapon/kitchen/knife", {
	name: "carrot shiv",
	icon_state: "carrotshiv",
	item_state: "carrotshiv",
	desc: "Unlike other carrots, you should probably keep this far away from your eyes.",
	force: 8,
	throwforce: 12,
	materials: null,
	origin_tech: "biotech=3;combat=2",
	attack_verb: null,
	armor: null,
});

// kitchen.dm:144
rt.def("/obj/item/weapon/kitchen/knife/carrotshiv/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	this.attack_verb = list("shanked", "shivved");
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]);
	return f.dot;
});
