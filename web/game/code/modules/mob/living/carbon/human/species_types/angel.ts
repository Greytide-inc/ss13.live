// Based on /tg/station's code/modules/mob/living/carbon/human/species_types/angel.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4077, "/datum/species/angel", "/datum/species", {
	fly: null,
	name: "Angel",
	id: "angel",
	default_color: "FFFFFF",
	species_traits: null,
	mutant_bodyparts: null,
	default_features: null,
	use_skintones: 1,
	no_equip: null,
	blacklisted: 1,
	limbs_id: "human",
	skinned_type: rt.typePath("/obj/item/stack/sheet/animalhide/human"),
});

// angel.dm:7
rt.def("/datum/species/angel/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.species_traits = list(4, 2, 3, 5);
	this.mutant_bodyparts = list("tail_human", "ears", "wings");
	this.default_features = rt.alist(f, ["mcolor", "FFF", "tail_human", "None", "ears", "None", "wings", "Angel"]);

	this.no_equip = list(1);
	return f.dot;
});

// angel.dm:17
rt.def("/datum/species/angel/proc/on_species_gain", function* on_species_gain(f: Frame, H: Value, old_species: Value) {
	yield* parent_proc();
	if (H.dna && H.dna.species && rt.index(H.dna.features, "wings") != "Angel" && rt.isIn(f, "wings", H.dna.species.mutant_bodyparts)) {
		rt.setAt(H.dna.features, "wings", "Angel");
		yield* H.update_body();
	}
	if (!(rt.istype(H, T("/mob/living/carbon/human")) && !this.fly)) return f.dot;
	this.fly = (yield* new_(T("/datum/action/innate/flight")));
	yield* this.fly.Grant(H);
	return f.dot;
}, true);

// angel.dm:28
rt.def("/datum/species/angel/proc/on_species_loss", function* on_species_loss(f: Frame, H: Value) {
	if (this.fly) {
		yield* this.fly.Remove(H);
	}
	if (rt.bitAnd(H.movement_type, 2)) {
		(rt.modField(f, H, "movement_type", 16777213, rt.bitAnd));
	}
	yield* this.ToggleFlight(H, 0);
	if (H.dna && H.dna.species && rt.index(H.dna.features, "wings") != "None" && rt.isIn(f, "wings", H.dna.species.mutant_bodyparts)) {
		rt.setAt(H.dna.features, "wings", "None");
		yield* H.update_body();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// angel.dm:38
rt.def("/datum/species/angel/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	yield* this.HandleFlight(H);
	return f.dot;
}, true);

// angel.dm:41
rt.def("/datum/species/angel/proc/HandleFlight", function* HandleFlight(f: Frame, H: Value) {
	if (rt.bitAnd(H.movement_type, 2)) {
		if (!this.CanFly(H)) {
			yield* this.ToggleFlight(H, 0);
			return 0;
		}
		return 1;
	} else {
		return 0;
	}
}, true);

// angel.dm:50
rt.def("/datum/species/angel/proc/CanFly", function CanFly(f: Frame, H: Value) {
	let _T: Value = null, environment: Value = null;
	if (H.stat || H.IsStun() || H.IsKnockdown()) {
		return 0;
	}
	if (H.wear_suit && rt.bitAnd(H.wear_suit.flags_inv, HIDEJUMPSUIT) && (!H.wear_suit.species_exception || !is_type_in_list(this, H.wear_suit.species_exception))) {
		to_chat(H, "Your suit blocks your wings from extending!");
		return 0;
	}
	if (!(_T = rt.getStep(f, H, 0))) {
		return 0;
	}
	if ((environment = _T.return_air()) && !(environment.return_pressure() > 30)) {
		to_chat(H, "<span class='warning'>The atmosphere is too thin for you to fly!</span>");
		return 0;
	} else {
		return 1;
	}
});

rt.type(149, "/datum/action/innate/flight", "/datum/action/innate", {
	name: "Toggle Flight",
	check_flags: 10,
	button_icon_state: "flight",
});

// angel.dm:72
rt.def("/datum/action/innate/flight/proc/Activate", function* Activate(f: Frame) {
	let A: Value = null;
	let H: Value = this.owner;
	if (!(A = H.dna.species).CanFly(H)) return f.dot;
	if (rt.bitAnd(H.movement_type, 2)) {
		to_chat(H, "<span class='notice'>You settle gently back onto the ground...</span>");
		yield* A.ToggleFlight(H, 0);
		yield* H.update_canmove();
	} else {
		to_chat(H, "<span class='notice'>You beat your wings and begin to hover gently above the ground...</span>");
		H.resting = 0;
		yield* A.ToggleFlight(H, 1);
		yield* H.update_canmove();
	}
	return f.dot;
}, true);

// angel.dm:87
rt.def("/datum/species/angel/proc/flyslip", function* flyslip(f: Frame, H: Value) {
	let buckled_obj: Value = null, I: Value = null, i: Value = null;
	if (H.buckled) {
		buckled_obj = H.buckled;
	}
	to_chat(H, "<span class='notice'>Your wings spazz out and launch you!</span>");
	playsound(H.loc, rt.rsc("sound/misc/slip.ogg"), 50, 1, -3);
	for (I of each(H.held_items, T("/obj/item"))) {
		yield* H.accident(I);
	}
	let olddir: Value = H.dir;
	yield* H.stop_pulling();
	if (buckled_obj) {
		yield* buckled_obj.unbuckle_mob(H);
		yield* step(buckled_obj, olddir);
	} else {
		i = 1;
		while (i < 5) {
			rt.spawnTail(f, i, "/datum/species/angel/proc/flyslip: spawn at modules/mob/living/carbon/human/species_types/angel.dm:105", H, buckled_obj, I, olddir, i);
			i++;
		}
	}
	return 1;
}, true);

// a spawn(live(i)) body of /datum/species/angel/proc/flyslip, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/species/angel/proc/flyslip: spawn at modules/mob/living/carbon/human/species_types/angel.dm:105", function* (f: Frame, H: Value, buckled_obj: Value, I: Value, olddir: Value, i: Value) {
	yield* step(H, olddir);
	yield* H.spin(1, 1);
	return null;
});

// angel.dm:112
rt.def("/datum/species/angel/proc/spec_stun", function* spec_stun(f: Frame, H: Value, amount: Value) {
	if (rt.bitAnd(H.movement_type, 2)) {
		yield* this.ToggleFlight(H, 0);
		yield* this.flyslip(H);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// angel.dm:118
rt.def("/datum/species/angel/proc/negates_gravity", function negates_gravity(f: Frame, H: Value) {
	if (!rt.bitAnd(H.movement_type, 2)) return f.dot;
	return 1;
});

// angel.dm:122
rt.def("/datum/species/angel/proc/space_move", function space_move(f: Frame, H: Value) {
	if (!rt.bitAnd(H.movement_type, 2)) return f.dot;
	return 1;
});

// angel.dm:126
rt.def("/datum/species/angel/proc/ToggleFlight", function* ToggleFlight(f: Frame, H: Value, flight: Value) {
	if (flight && this.CanFly(H)) {
		this.stunmod = 2;
		this.speedmod = -1;
		(rt.modField(f, H, "movement_type", 2, rt.bitOr));
		this.override_float = 1;
		(rt.modField(f, H, "pass_flags", 1, rt.bitOr));
		yield* H.OpenWings();
	} else {
		this.stunmod = 1;
		this.speedmod = 0;
		(rt.modField(f, H, "movement_type", 16777213, rt.bitAnd));
		this.override_float = 0;
		(rt.modField(f, H, "pass_flags", 16777214, rt.bitAnd));
		yield* H.CloseWings();
	}
	return f.dot;
}, true);
