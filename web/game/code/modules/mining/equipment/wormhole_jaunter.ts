// Based on /tg/station's code/modules/mining/equipment/wormhole_jaunter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(9402, "/obj/item/device/wormhole_jaunter", "/obj/item/device", {
	throw_speed: 3,
	throw_range: 5,
	name: "wormhole jaunter",
	desc: "A single use device harnessing outdated wormhole technology, Nanotrasen has since turned its eyes to blue space for more accurate teleportation. The wormholes it creates are unpleasant to travel through, to say the least.\nThanks to modifications provided by the Free Golems, this jaunter can be worn on the belt to provide protection from chasms.",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "Jaunter",
	item_state: "electronic",
	throwforce: 0,
	w_class: 2,
	origin_tech: "bluespace=2",
	slot_flags: 512,
});

// wormhole_jaunter.dm:16
rt.def("/obj/item/device/wormhole_jaunter/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	user.visible_message(`<span class='notice'>${user.name} activates the ${this.name}!</span>`);
	yield* this.activate(user);
	return f.dot;
}, true);

// wormhole_jaunter.dm:21
rt.def("/obj/item/device/wormhole_jaunter/proc/turf_check", function turf_check(f: Frame, user: Value) {
	let device_turf: Value = null;
	if (!(device_turf = rt.getStep(f, user, 0)) || device_turf.z == 2 || device_turf.z >= 7) {
		to_chat(user, `<span class='notice'>You're having difficulties getting the ${this.name} to work.</span>`);
		return 0;
	}
	return 1;
});

// wormhole_jaunter.dm:28
rt.def("/obj/item/device/wormhole_jaunter/proc/get_destinations", function get_destinations(f: Frame, user: Value) {
	let B: Value = null, _T: Value = null;
	let destinations: Value = list();
	if (is_species(user, T("/datum/species/golem"))) {
		for (B of each(GLOB.teleportbeacons, T("/obj/item/device/radio/beacon"))) {
			if (rt.istype((_T = rt.getStep(f, B, 0)).loc, T("/area/ruin/powered/golem_ship"))) {
				destinations += B;
			}
		}
	}
	if (rt.len(f, destinations)) {
		return destinations;
	}
	B = null;
	for (B of each(GLOB.teleportbeacons, T("/obj/item/device/radio/beacon"))) {
		if ((_T = rt.getStep(f, B, 0)).z == ZLEVEL_STATION) {
			destinations += B;
		}
	}
	return destinations;
});

// wormhole_jaunter.dm:48
rt.def("/obj/item/device/wormhole_jaunter/proc/activate", function* activate(f: Frame, user: Value) {
	let L: Value = null, J: Value = null;
	if (!this.turf_check(user)) {
		return f.dot;
	}
	if (!rt.len(f, (L = this.get_destinations(user)))) {
		to_chat(user, `<span class='notice'>The ${this.name} found no beacons in the world to anchor a wormhole to.</span>`);
		return f.dot;
	}
	let chosen_beacon: Value = pick(L);
	yield* try_move_adjacent((J = (yield* new_(T("/obj/effect/portal/wormhole/jaunt_tunnel"), rt.getStep(f, this, 0), this, 100, null, 0, rt.getStep(f, chosen_beacon, 0)))));
	playsound(this, rt.rsc("sound/effects/sparks4.ogg"), 50, 1);
	yield* qdel(this);
	return f.dot;
}, true);

// wormhole_jaunter.dm:64
rt.def("/obj/item/device/wormhole_jaunter/proc/emp_act", function* emp_act(f: Frame, power: Value) {
	let triggered: Value = 0;
	if (f.usr.get_item_by_slot(slot_belt) == this) {
		if (power == 1) {
			triggered = 1;
		} else if (power == 2 && prob(50)) {
			triggered = 1;
		}
	}
	if (!triggered) return f.dot;
	f.usr.visible_message(`<span class='warning'>The ${this} overloads and activates!</span>`);
	yield* this.activate(f.usr);
	return f.dot;
}, true);

// wormhole_jaunter.dm:76
rt.def("/obj/item/device/wormhole_jaunter/proc/chasm_react", function* chasm_react(f: Frame, user: Value) {
	if (user.get_item_by_slot(slot_belt) == this) {
		to_chat(user, `Your ${this} activates, saving you from the chasm!</span>`);
		yield* this.activate(user);
	} else {
		to_chat(user, `The ${this} is not attached to your belt, preventing it from saving you from the chasm. RIP.</span>`);
	}
	return f.dot;
}, true);

rt.type(11211, "/obj/effect/portal/wormhole/jaunt_tunnel", "/obj/effect/portal/wormhole", {
	mech_sized: 1,
	name: "jaunt tunnel",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "bhole3",
	desc: "A stable hole in the universe made by a wormhole jaunter. Turbulent doesn't even begin to describe how rough passage through one of these is, but at least it will always get you somewhere near a beacon.",
});

// wormhole_jaunter.dm:92
rt.def("/obj/effect/portal/wormhole/jaunt_tunnel/proc/teleport", function* teleport(f: Frame, M: Value) {
	let L: Value = null;
	if (rt.istype(M, T("/obj/effect"))) {
		return f.dot;
	}
	if (M.anchored) {
		if (!(rt.istype(M, T("/obj/mecha")) && this.mech_sized)) {
			return f.dot;
		}
	}
	if (!rt.istype(M, T("/atom/movable"))) return f.dot;
	if (!(yield* do_teleport(M, this.hard_target, 6))) return f.dot;
	playsound(M, rt.rsc("sound/weapons/resonator_blast.ogg"), 50, 1);
	if (!rt.istype(M, T("/mob/living/carbon"))) return f.dot;
	yield* (L = M).Knockdown(60);
	if (!rt.istype(L, T("/mob/living/carbon/human"))) return f.dot;
	shake_camera(L, 20, 1);
	yield* addtimer((yield* new_(T("/datum/callback"), L, P("/mob/living/carbon/proc/vomit"))), 20);
	return f.dot;
}, true);
