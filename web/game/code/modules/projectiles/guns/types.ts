// Types declared in code/modules/projectiles/guns that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(5122, "/obj/item/weapon/gun/magic/hook", "/obj/item/weapon/gun/magic", {
	flags: 4,
	name: "meat hook",
	desc: "Mid or feed.",
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/hook"),
	icon_state: "hook",
	item_state: "chain",
	fire_sound: rt.rsc("sound/weapons/batonextend.ogg"),
	max_charges: 1,
	force: 18,
});
rt.type(5123, "/obj/item/weapon/gun/magic/staff", "/obj/item/weapon/gun/magic", {
	slot_flags: 1024,
});
rt.type(5124, "/obj/item/weapon/gun/magic/staff/change", "/obj/item/weapon/gun/magic/staff", {
	name: "staff of change",
	desc: "An artefact that spits bolts of coruscating energy which cause the target's very form to reshape itself",
	fire_sound: rt.rsc("sound/magic/staff_change.ogg"),
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/change"),
	icon_state: "staffofchange",
	item_state: "staffofchange",
});
rt.type(5125, "/obj/item/weapon/gun/magic/staff/animate", "/obj/item/weapon/gun/magic/staff", {
	name: "staff of animation",
	desc: "An artefact that spits bolts of life-force which causes objects which are hit by it to animate and come to life! This magic doesn't affect machines.",
	fire_sound: rt.rsc("sound/magic/staff_animation.ogg"),
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/animate"),
	icon_state: "staffofanimation",
	item_state: "staffofanimation",
});
rt.type(5126, "/obj/item/weapon/gun/magic/staff/healing", "/obj/item/weapon/gun/magic/staff", {
	name: "staff of healing",
	desc: "An artefact that spits bolts of restoring magic which can remove ailments of all kinds and even raise the dead.",
	fire_sound: rt.rsc("sound/magic/staff_healing.ogg"),
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/heal"),
	icon_state: "staffofhealing",
	item_state: "staffofhealing",
});
rt.type(5128, "/obj/item/weapon/gun/magic/staff/door", "/obj/item/weapon/gun/magic/staff", {
	max_charges: 10,
	recharge_rate: 2,
	no_den_usage: 1,
	name: "staff of door creation",
	desc: "An artefact that spits bolts of transformative magic that can create doors in walls.",
	fire_sound: rt.rsc("sound/magic/staff_door.ogg"),
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/door"),
	icon_state: "staffofdoor",
	item_state: "staffofdoor",
});
rt.type(5129, "/obj/item/weapon/gun/magic/staff/honk", "/obj/item/weapon/gun/magic/staff", {
	max_charges: 4,
	recharge_rate: 8,
	name: "staff of the honkmother",
	desc: "Honk",
	fire_sound: rt.rsc("sound/items/airhorn.ogg"),
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/honk"),
	icon_state: "honker",
	item_state: "honker",
});
rt.type(5166, "/obj/item/weapon/gun/energy/beam_rifle/debug", "/obj/item/weapon/gun/energy/beam_rifle", {
	delay: 0,
	aiming_time: 0,
	scoped_recoil: 0,
	hipfire_recoil: 0,
	hipfire_inaccuracy: 0,
	scoped_inaccuracy: 0,
	noscope: 1,
	recoil: 0,
	cell_type: rt.typePath("/obj/item/weapon/stock_parts/cell/infinite"),
});
rt.type(5282, "/obj/item/weapon/gun/syringe/rapidsyringe", "/obj/item/weapon/gun/syringe", {
	max_syringes: 6,
	name: "rapid syringe gun",
	desc: "A modification of the syringe gun design, using a rotating cylinder to store up to six syringes.",
	icon_state: "rapidsyringegun",
});
rt.type(5283, "/obj/item/weapon/gun/syringe/syndicate", "/obj/item/weapon/gun/syringe", {
	suppressed: 1,
	can_unsuppress: 0,
	name: "dart pistol",
	desc: "A small spring-loaded sidearm that functions identically to a syringe gun.",
	icon_state: "syringe_pistol",
	item_state: "gun",
	w_class: 2,
	origin_tech: "combat=2;syndicate=2;biotech=3",
	force: 2,
});
rt.type(8732, "/obj/item/ammo_casing/energy/beam_rifle/hitscan", "/obj/item/ammo_casing/energy/beam_rifle", {
	select_name: "beam",
	e_cost: 5000,
	projectile_type: rt.typePath("/obj/item/projectile/beam/beam_rifle/hitscan"),
	fire_sound: rt.rsc("sound/weapons/beam_sniper.ogg"),
});
rt.type(11692, "/obj/effect/temp_visual/projectile_beam/tracer", "/obj/effect/temp_visual/projectile_beam", {
	icon_state: "tracer_beam",
});
rt.type(11693, "/obj/effect/temp_visual/projectile_beam/tracer/aiming", "/obj/effect/temp_visual/projectile_beam/tracer", {
	duration: 1,
	icon_state: "gbeam",
});
