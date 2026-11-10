// Based on /tg/station's code/game/objects/items/weapons/singularityhammer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5622, "/obj/item/weapon/twohanded/singularityhammer", "/obj/item/weapon/twohanded", {
	charged: 5,
	flags: 64,
	throw_range: 1,
	name: "singularity hammer",
	desc: "The pinnacle of close combat technology, the hammer harnesses the power of a miniaturized singularity to deal crushing blows.",
	icon_state: "mjollnir0",
	slot_flags: 1024,
	force: 5,
	force_unwielded: 5,
	force_wielded: 20,
	throwforce: 15,
	w_class: 5,
	origin_tech: "combat=4;bluespace=4;plasmatech=7",
	armor: null,
	resistance_flags: 34,
	force_string: "LORD SINGULOTH HIMSELF",
});

// singularityhammer.dm:15
rt.def("/obj/item/weapon/twohanded/singularityhammer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 50, "laser", 50, "energy", 0, "bomb", 50, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);
	return f.dot;
});

// singularityhammer.dm:20
rt.def("/obj/item/weapon/twohanded/singularityhammer/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// singularityhammer.dm:24
rt.def("/obj/item/weapon/twohanded/singularityhammer/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// singularityhammer.dm:28
rt.def("/obj/item/weapon/twohanded/singularityhammer/proc/process", function process(f: Frame) {
	if (this.charged < 5) {
		this.charged++;
	}
	return f.dot;
}, false, { waitfor: false });

// singularityhammer.dm:33
rt.def("/obj/item/weapon/twohanded/singularityhammer/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `mjollnir${this.wielded}`;
	return f.dot;
});

// singularityhammer.dm:37
rt.def("/obj/item/weapon/twohanded/singularityhammer/proc/vortex", function* vortex(f: Frame, pull: Value, wielder: Value) {
	let X: Value = null, A: Value = null, H: Value = null, M: Value = null;
	for (X of each(orange(5, pull), T("/atom"))) {
		if (rt.istype(X, T("/atom/movable"))) {
			if ((A = X) == wielder) {
				continue;
			}
			if (A && !A.anchored && !rt.istype(X, T("/mob/living/carbon/human"))) {
				yield* step_towards(A, pull);
				yield* step_towards(A, pull);
				yield* step_towards(A, pull);
			} else if (rt.istype(X, T("/mob/living/carbon/human"))) {
				if (rt.istype((H = X).shoes, T("/obj/item/clothing/shoes/magboots"))) {
					if ((M = H.shoes).magpulse) {
						continue;
					}
				}
				yield* H.apply_effect(20, "knockdown", 0);
				yield* step_towards(H, pull);
				yield* step_towards(H, pull);
				yield* step_towards(H, pull);
			}
		}
	}
	return f.dot;
}, true);

// singularityhammer.dm:59
rt.def("/obj/item/weapon/twohanded/singularityhammer/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let Z: Value = null, target: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (!this.wielded) return f.dot;
	if (this.charged != 5) return f.dot;
	this.charged = 0;
	if (rt.istype(A, T("/mob/living"))) {
		yield* (Z = A).take_bodypart_damage(20, 0);
	}
	playsound(user, rt.rsc("sound/weapons/marauder.ogg"), 50, 1);
	yield* this.vortex((target = rt.getStep(f, A, 0)), user);
	return f.dot;
}, true);

rt.type(5623, "/obj/item/weapon/twohanded/mjollnir", "/obj/item/weapon/twohanded", {
	flags: 64,
	throw_range: 7,
	name: "Mjolnir",
	desc: "A weapon worthy of a god, able to strike with the force of a lightning bolt. It crackles with barely contained energy.",
	icon_state: "mjollnir0",
	slot_flags: 1024,
	force: 5,
	force_unwielded: 5,
	force_wielded: 25,
	throwforce: 30,
	w_class: 5,
	origin_tech: "combat=4;powerstorage=7",
});

// singularityhammer.dm:85
rt.def("/obj/item/weapon/twohanded/mjollnir/proc/shock", function* shock(f: Frame, target: Value) {
	let s: Value = null;
	yield* target.Stun(60);
	yield* (s = (yield* new_(T("/datum/effect_system/lightning_spread")))).set_up(5, 1, target.loc);
	yield* s.start();
	target.visible_message(`<span class='danger'>${target.name} was shocked by ${this}!</span>`, "<span class='userdanger'>You feel a powerful shock course through your body sending you flying!</span>", "<span class='italics'>You hear a heavy electrical crack!</span>");
	let throw_target: Value = get_edge_target_turf(target, rt.getDir(f, this, get_step_away(target, this)));
	yield* target.throw_at(throw_target, 200, 4);
	return f.dot;
}, true);

// singularityhammer.dm:97
rt.def("/obj/item/weapon/twohanded/mjollnir/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	yield* parent_proc();
	if (!this.wielded) return f.dot;
	playsound(this.loc, "sparks", 50, 1);
	yield* this.shock(M);
	return f.dot;
}, true);

// singularityhammer.dm:103
rt.def("/obj/item/weapon/twohanded/mjollnir/proc/throw_impact", function* throw_impact(f: Frame, target: Value) {
	f.dot = (yield* parent_proc());
	if (!rt.istype(target, T("/mob/living"))) return f.dot;
	yield* this.shock(target);
	return f.dot;
}, true, { waitfor: false });

// singularityhammer.dm:108
rt.def("/obj/item/weapon/twohanded/mjollnir/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `mjollnir${this.wielded}`;
	return f.dot;
});
