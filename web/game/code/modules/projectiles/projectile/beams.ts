// Based on /tg/station's code/modules/projectiles/projectile/beams.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(8869, "/obj/item/projectile/beam/laser", "/obj/item/projectile/beam", {});

// beams.dm:25
rt.def("/obj/item/projectile/beam/laser/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* parent_proc());
	if (rt.istype(f.args[0], T("/mob/living/carbon"))) {
		yield* (M = f.args[0]).IgniteMob();
	} else {
		if (!isturf(f.args[0])) return f.dot;
		this.impact_effect_type = T("/obj/effect/temp_visual/impact_effect/red_laser/wall");
	}
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8877, "/obj/item/projectile/beam/pulse", "/obj/item/projectile/beam", {
	light_color: "#6496FA",
	name: "pulse",
	icon_state: "u_laser",
	damage: 50,
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/blue_laser"),
});

// beams.dm:75
rt.def("/obj/item/projectile/beam/pulse/proc/on_hit", function* on_hit(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!(isturf(f.args[0]) || rt.istype(f.args[0], T("/obj/structure")))) return f.dot;
	yield* f.args[0].ex_act(2);
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8879, "/obj/item/projectile/beam/pulse/heavy", "/obj/item/projectile/beam/pulse", {
	life: 20,
	name: "heavy pulse laser",
	icon_state: "pulse1_bl",
});

// beams.dm:88
rt.def("/obj/item/projectile/beam/pulse/heavy/proc/on_hit", function* on_hit(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	this.life -= 10;
	if (this.life > 0) {
		f.dot = -1;
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8881, "/obj/item/projectile/beam/lasertag", "/obj/item/projectile/beam", {
	suit_types: null,
	light_color: "#6496FA",
	name: "laser tag beam",
	icon_state: "omnilaser",
	hitsound: null,
	damage: 0,
	damage_type: "stamina",
	flag: "laser",
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/blue_laser"),
});

// beams.dm:112
rt.def("/obj/item/projectile/beam/lasertag/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.suit_types = list(T("/obj/item/clothing/suit/redtag"), T("/obj/item/clothing/suit/bluetag"));
	return f.dot;
});

// beams.dm:117
rt.def("/obj/item/projectile/beam/lasertag/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!rt.istype(f.args[0], T("/mob/living/carbon/human"))) return f.dot;
	if (!rt.istype((M = f.args[0]).wear_suit, T("/obj/item"))) return f.dot;
	if (!rt.isIn(f, M.wear_suit.type, this.suit_types)) return f.dot;
	yield* M.adjustStaminaLoss(34);
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8882, "/obj/item/projectile/beam/lasertag/redtag", "/obj/item/projectile/beam/lasertag", {
	suit_types: null,
	light_color: "#FA8282",
	icon_state: "laser",
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/red_laser"),
});

// beams.dm:126
rt.def("/obj/item/projectile/beam/lasertag/redtag/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.suit_types = list(T("/obj/item/clothing/suit/bluetag"));
	return f.dot;
});

rt.type(8883, "/obj/item/projectile/beam/lasertag/bluetag", "/obj/item/projectile/beam/lasertag", {
	suit_types: null,
	icon_state: "bluelaser",
});

// beams.dm:132
rt.def("/obj/item/projectile/beam/lasertag/bluetag/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.suit_types = list(T("/obj/item/clothing/suit/redtag"));
	return f.dot;
});

rt.type(8884, "/obj/item/projectile/beam/instakill", "/obj/item/projectile/beam", {
	light_color: "#952CF4",
	name: "instagib laser",
	icon_state: "purple_laser",
	damage: 200,
	damage_type: "fire",
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/purple_laser"),
});

// beams.dm:153
rt.def("/obj/item/projectile/beam/instakill/proc/on_hit", function* on_hit(f: Frame, target: Value) {
	let M: Value = null;
	f.dot = (yield* parent_proc());
	if (!rt.istype(target, T("/mob/living/carbon"))) return f.dot;
	(M = target).visible_message(`<span class='danger'>${M} explodes into a shower of gibs!</span>`);
	yield* M.gib();
	return f.dot;
}, true);
