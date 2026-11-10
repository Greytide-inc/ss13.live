// Based on /tg/station's code/game/objects/effects/effect_system/effects_foam.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11919, "/obj/effect/particle_effect/foam", "/obj/effect/particle_effect", {
	amount: 3,
	metal: 0,
	lifetime: 40,
	reagent_divisor: 7,
	anchored: 1,
	name: "foam",
	icon_state: "foam",
	opacity: 0,
	density: 0,
	layer: 4.25,
	mouse_opacity: 0,
	animate_movement: 0,
}, { global: { blacklisted_turfs: 781 } });

// effects_foam.dm:42
rt.def("/obj/effect/particle_effect/foam/proc/New", function* New(f: Frame, loc: Value) {
	yield* parent_proc(loc);
	yield* this.create_reagents(1000);
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSfastprocess.processing += this;
	}
	playsound(this, rt.rsc("sound/effects/bubbles2.ogg"), 80, 1, -3);
	return f.dot;
}, true);

// effects_foam.dm:48
rt.def("/obj/effect/particle_effect/foam/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSfastprocess.processing -= this;
	return (yield* parent_proc());
}, true);

// effects_foam.dm:53
rt.def("/obj/effect/particle_effect/foam/proc/kill_foam", function* kill_foam(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSfastprocess.processing -= this;
	if (this.metal === ALUMINUM_FOAM) {
		yield* new_(T("/obj/structure/foamedmetal"), rt.getStep(f, this, 0));
	} else if (this.metal === IRON_FOAM) {
		yield* new_(T("/obj/structure/foamedmetal/iron"), rt.getStep(f, this, 0));
	} else if (this.metal === 3) {
		yield* new_(T("/obj/structure/foamedmetal/resin"), rt.getStep(f, this, 0));
	}
	flick(`${this.icon_state}-disolve`, this);
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 5, 8);
	return f.dot;
}, true);

// effects_foam.dm:65
rt.def("/obj/effect/particle_effect/foam/proc/process", function* process(f: Frame) {
	let O: Value = null, _T: Value = null, L: Value = null;
	this.lifetime--;
	if (this.lifetime < 1) {
		yield* this.kill_foam();
		return f.dot;
	}
	let fraction: Value = 1 / rt.initial(f, this, "reagent_divisor");
	for (O of each(range(0, this), T("/obj"))) {
		if (O.type == this.type) {
			continue;
		}
		if (isturf(O.loc)) {
			if ((_T = O.loc).intact && O.level == 1) {
				continue;
			}
		}
		if (this.lifetime % this.reagent_divisor) {
			yield* this.reagents.reaction(O, VAPOR, fraction);
		}
	}
	let hit: Value = 0;
	for (L of each(range(0, this), T("/mob/living"))) {
		hit += (yield* this.foam_mob(L));
	}
	if (hit) {
		this.lifetime++;
	}
	_T = rt.getStep(f, this, 0);
	if (this.lifetime % this.reagent_divisor) {
		yield* this.reagents.reaction(_T, VAPOR, fraction);
	}
	if (--this.amount < 0) {
		return f.dot;
	}
	yield* this.spread_foam();
	return f.dot;
}, true, { waitfor: false });

// effects_foam.dm:94
rt.def("/obj/effect/particle_effect/foam/proc/foam_mob", function* foam_mob(f: Frame, L: Value) {
	if (this.lifetime < 1) {
		return 0;
	}
	if (!rt.istype(L, T("/mob/living"))) {
		return 0;
	}
	let fraction: Value = 1 / rt.initial(f, this, "reagent_divisor");
	if (this.lifetime % this.reagent_divisor) {
		yield* this.reagents.reaction(L, VAPOR, fraction);
	}
	this.lifetime--;
	return 1;
}, true);

// effects_foam.dm:105
rt.def("/obj/effect/particle_effect/foam/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let M: Value = null;
	if (!rt.istype(AM, T("/mob/living/carbon"))) return f.dot;
	yield* (M = AM).slip(100, this);
	return f.dot;
}, true);

// effects_foam.dm:114
rt.def("/obj/effect/particle_effect/foam/proc/spread_foam", function* spread_foam(f: Frame) {
	let _T: Value = null, foundfoam: Value = null, L: Value = null, F: Value = null;
	let t_loc: Value = rt.getStep(f, this, 0);
	for (_T of each(t_loc.GetAtmosAdjacentTurfs(), T("/turf"))) {
		if (foundfoam = rt.locateIn(f, T("/obj/effect/particle_effect/foam"), _T)) {
			continue;
		}
		if (is_type_in_typecache(_T, GLOB.blacklisted_turfs)) {
			continue;
		}
		L = null;
		for (L of each(_T, T("/mob/living"))) {
			yield* this.foam_mob(L);
		}
		(F = (yield* new_(this.type, _T))).amount = this.amount;
		yield* this.reagents.copy_to(F, this.reagents.total_volume);
		F.add_atom_colour(this.color, FIXED_COLOUR_PRIORITY);
		F.metal = this.metal;
	}
	return f.dot;
}, true);

// effects_foam.dm:133
rt.def("/obj/effect/particle_effect/foam/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	if (!prob(max(0, exposed_temperature - 475))) return f.dot;
	yield* this.kill_foam();
	return f.dot;
}, true);

rt.type(1514, "/datum/effect_system/foam_spread", "/datum/effect_system", {
	amount: 10,
	chemholder: null,
	metal: 0,
	effect_type: rt.typePath("/obj/effect/particle_effect/foam"),
});

// effects_foam.dm:155
rt.def("/datum/effect_system/foam_spread/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.chemholder = (yield* new_(T("/obj")));
	let R: Value = (yield* new_(T("/datum/reagents"), 1000));
	this.chemholder.reagents = R;
	R.my_atom = this.chemholder;
	return f.dot;
}, true);

// effects_foam.dm:162
rt.def("/datum/effect_system/foam_spread/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.chemholder);
	this.chemholder = null;
	return (yield* parent_proc());
}, true);

// effects_foam.dm:167
rt.def("/datum/effect_system/foam_spread/proc/set_up", function* set_up(f: Frame, amt: Value, loca: Value, carry: Value) {
	amt ??= 5;
	if (isturf(loca)) {
		this.location = loca;
	} else {
		this.location = rt.getStep(f, loca, 0);
	}
	this.amount = round(rt.op(f, "Sqrt", [], [amt / 2]), 1);
	yield* carry.copy_to(this.chemholder, 4 * carry.total_volume);
	return f.dot;
}, true);

rt.type(1515, "/datum/effect_system/foam_spread/metal", "/datum/effect_system/foam_spread", {
	effect_type: rt.typePath("/obj/effect/particle_effect/foam/metal"),
});

// effects_foam.dm:176
rt.def("/datum/effect_system/foam_spread/metal/proc/set_up", function* set_up(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 5;
	}
	if (f.args[2] === null) {
		f.args[2] = null;
	}
	yield* parent_proc();
	this.metal = f.args[3];
	return f.dot;
}, true, { args: ["amt", "loca", "carry", "metaltype"] });

// effects_foam.dm:180
rt.def("/datum/effect_system/foam_spread/proc/start", function* start(f: Frame) {
	let foundfoam: Value = null, F: Value = null, foamcolor: Value = null;
	if (foundfoam = rt.locateIn(f, T("/obj/effect/particle_effect/foam"), this.location)) {
		foundfoam.amount += this.amount;
	} else {
		F = (yield* new_(this.effect_type, this.location));
		foamcolor = mix_color_from_reagents(this.chemholder.reagents.reagent_list);
		yield* this.chemholder.reagents.copy_to(F, this.chemholder.reagents.total_volume / this.amount);
		F.add_atom_colour(foamcolor, FIXED_COLOUR_PRIORITY);
		F.amount = this.amount;
		F.metal = this.metal;
	}
	return f.dot;
}, true);

rt.type(12704, "/obj/structure/foamedmetal", "/obj/structure", {
	anchored: 1,
	CanAtmosPass: -2,
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "metalfoam",
	density: 1,
	opacity: 1,
	resistance_flags: 34,
	name: "foamed metal",
	desc: "A lightweight foamed metal wall.",
	gender: "plural",
	obj_integrity: 20,
	max_integrity: 20,
});

// effects_foam.dm:209
rt.def("/obj/structure/foamedmetal/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.air_update_turf(1);
	return f.dot;
}, true);

// effects_foam.dm:215
rt.def("/obj/structure/foamedmetal/proc/Destroy", function* Destroy(f: Frame) {
	this.density = 0;
	this.air_update_turf(1);
	return (yield* parent_proc());
}, true);

// effects_foam.dm:219
rt.def("/obj/structure/foamedmetal/proc/Move", function* Move(f: Frame) {
	let _T: Value = this.loc;
	yield* parent_proc();
	this.move_update_air(_T);
	return f.dot;
}, true);

// effects_foam.dm:224
rt.def("/obj/structure/foamedmetal/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	yield* this.attack_hand(user);
	return f.dot;
}, true);

// effects_foam.dm:227
rt.def("/obj/structure/foamedmetal/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	playsound(this.loc, rt.rsc("sound/weapons/tap.ogg"), 100, 1);
	return f.dot;
});

// effects_foam.dm:230
rt.def("/obj/structure/foamedmetal/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	user.changeNext_move(8);
	yield* user.do_attack_animation(this, "punch");
	to_chat(user, `<span class='warning'>You hit ${this} but bounce off it!</span>`);
	playsound(this.loc, rt.rsc("sound/weapons/tap.ogg"), 100, 1);
	return f.dot;
}, true);

// effects_foam.dm:236
rt.def("/obj/structure/foamedmetal/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	height ??= 1.5;
	return (!this.density ? 1 : 0);
});

rt.type(12706, "/obj/structure/foamedmetal/resin", "/obj/structure/foamedmetal", {
	name: "ATMOS Resin",
	desc: "A lightweight, transparent resin used to suffocate fires, scrub the air of toxins, and restore the air to a safe temperature",
	opacity: 0,
	icon_state: "atmos_resin",
	alpha: 120,
	obj_integrity: 10,
	max_integrity: 10,
	layer: 4.3,
});

// effects_foam.dm:255
rt.def("/obj/structure/foamedmetal/resin/proc/Initialize", function* Initialize(f: Frame) {
	let O: Value = null, G: Value = null, H: Value = null, G_gases: Value = null, I: Value = null, U: Value = null, L: Value = null, Item: Value = null;
	f.dot = (yield* parent_proc());
	if (!rt.istype(this.loc, T("/turf/open"))) return f.dot;
	if ((O = this.loc).air) {
		(G = O.air).temperature = 293.15;
		for (H of each(O, T("/obj/effect/hotspot"))) {
			yield* qdel(H);
		}
		G_gases = G.gases;
		for (I of each(G_gases)) {
			if (I != "o2" && I != "n2") {
				rt.setAt(rt.index(G.gases, I), 1, 0);
			}
		}
		G.garbage_collect();
		O.air_update_turf();
	}
	for (U of each(O, T("/obj/machinery/atmospherics/components/unary"))) {
		if (!U.welded) {
			U.welded = 1;
			yield* U.update_icon();
			U.visible_message(`<span class='danger'>${U} sealed shut!</span>`);
		}
	}
	for (L of each(O, T("/mob/living"))) {
		yield* L.ExtinguishMob();
	}
	for (Item of each(O, T("/obj/item"))) {
		yield* Item.extinguish();
	}
	return f.dot;
}, true);

// effects_foam.dm:280
rt.def("/obj/structure/foamedmetal/resin/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	if (rt.istype(mover, T("/atom/movable")) && mover.checkpass(IRON_FOAM)) {
		return ALUMINUM_FOAM;
	}
	f.dot = parent_proc();
	return f.dot;
}, false);
