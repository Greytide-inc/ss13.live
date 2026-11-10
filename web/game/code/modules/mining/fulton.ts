// Based on /tg/station's code/modules/mining/fulton.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


// fulton.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobaltotal_extraction_beacons", function InitGlobaltotal_extraction_beacons(f: Frame) {
	GLOB.total_extraction_beacons = list();
	this.gvars_datum_init_order += "total_extraction_beacons";
	return f.dot;
});

rt.type(7514, "/obj/item/weapon/extraction_pack", "/obj/item/weapon", {
	beacon: null,
	beacon_networks: null,
	uses_left: 3,
	can_use_indoors: null,
	safe_for_living_creatures: 1,
	name: "fulton extraction pack",
	desc: "A balloon that can be used to extract equipment or personnel to a Fulton Recovery Beacon. Anything not bolted down can be moved. Link the pack to a beacon by using the pack in hand.",
	icon: rt.rsc("icons/obj/fulton.dmi"),
	icon_state: "extraction_pack",
	w_class: 3,
});

// fulton.dm:10
rt.def("/obj/item/weapon/extraction_pack/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.beacon_networks = list("station");
	return f.dot;
});

// fulton.dm:16
rt.def("/obj/item/weapon/extraction_pack/proc/examine", function examine(f: Frame) {
	f.dot = parent_proc();
	f.usr.show_message(`It has ${this.uses_left} uses remaining.`, 1);
	return f.dot;
});

// fulton.dm:20
rt.def("/obj/item/weapon/extraction_pack/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let B: Value = null, EP: Value = null, A: Value = null;
	let possible_beacons: Value = list();
	for (B of each(GLOB.total_extraction_beacons)) {
		if (rt.isIn(f, (EP = B).beacon_network, this.beacon_networks)) {
			possible_beacons += EP;
		}
	}
	if (!rt.len(f, possible_beacons)) {
		to_chat(user, "There are no extraction beacons in existence!");
		return f.dot;
	} else {
		if (!(A = (yield* g.op(f, "Prompt", [1], [null, A, "Balloon Extraction Pack", "Select a beacon to connect to", possible_beacons])))) {
			return f.dot;
		}
		this.beacon = A;
		to_chat(user, "You link the extraction pack to the beacon system.");
	}
	return f.dot;
}, true);

// fulton.dm:41
rt.def("/obj/item/weapon/extraction_pack/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, flag: Value, params: Value) {
	let area: Value = null, B: Value = null, balloon: Value = null, balloon2: Value = null, balloon3: Value = null, M: Value = null, holder_obj: Value = null, L: Value = null, flooring_near_beacon: Value = null, floor: Value = null;
	if (!this.beacon) {
		to_chat(user, `${this} is not linked to a beacon, and cannot be used.`);
		return f.dot;
	}
	if (!this.can_use_indoors) {
		if (!(area = get_area(A)).outdoors) {
			to_chat(user, `${this} can only be used on things that are outdoors!`);
			return f.dot;
		}
	}
	if (!flag) {
		return f.dot;
	}
	if (!rt.istype(A, T("/atom/movable"))) {
		return f.dot;
	} else {
		if (!this.safe_for_living_creatures && this.check_for_living_mobs(A)) {
			to_chat(user, `${this} is not safe for use with living creatures, they wouldn't survive the trip back!`);
			return f.dot;
		}
		if (!isturf(A.loc)) {
			return f.dot;
		}
		if (A.anchored) {
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You start attaching the pack to ${A}...</span>`);
		if (!(yield* do_after(user, 50, { target: A }))) return f.dot;
		to_chat(user, `<span class='notice'>You attach the pack to ${A} and activate it.</span>`);
		if (this.loc == user && rt.istype(user.back, T("/obj/item/weapon/storage/backpack"))) {
			if (yield* (B = user.back).can_be_inserted(this, { stop_messages: 1 })) {
				yield* B.handle_item_insertion(this);
			}
		}
		this.uses_left--;
		if (this.uses_left <= 0) {
			yield* user.drop_item(this);
			this.loc = A;
		}
		if (rt.istype(A, T("/mob/living"))) {
			yield* (M = A).Knockdown(320);
			M.buckled = 0;
		} else {
			A.anchored = 1;
			A.density = 0;
		}
		(holder_obj = (yield* new_(T("/obj/effect/extraction_holder"), A.loc))).appearance = A.appearance;
		A.loc = holder_obj;
		(balloon2 = mutable_appearance(rt.rsc("icons/obj/fulton_balloon.dmi"), "fulton_expand")).pixel_y = 10;
		balloon2.appearance_flags = 14;
		holder_obj.add_overlay(balloon2);
		yield* sleep(4);
		(balloon = mutable_appearance(rt.rsc("icons/obj/fulton_balloon.dmi"), "fulton_balloon")).pixel_y = 10;
		balloon.appearance_flags = 14;
		holder_obj.cut_overlay(balloon2);
		holder_obj.add_overlay(balloon);
		playsound(holder_obj.loc, rt.rsc("sound/items/fulext_deploy.wav"), 50, 1, -3);
		rt.op(f, "Animate", [2, 6], [null, holder_obj, "pixel_z", 10, "time", 20]);
		yield* sleep(20);
		rt.op(f, "Animate", [2, 6], [null, holder_obj, "pixel_z", 15, "time", 10]);
		yield* sleep(10);
		rt.op(f, "Animate", [2, 6], [null, holder_obj, "pixel_z", 10, "time", 10]);
		yield* sleep(10);
		rt.op(f, "Animate", [2, 6], [null, holder_obj, "pixel_z", 15, "time", 10]);
		yield* sleep(10);
		rt.op(f, "Animate", [2, 6], [null, holder_obj, "pixel_z", 10, "time", 10]);
		yield* sleep(10);
		playsound(holder_obj.loc, rt.rsc("sound/items/fultext_launch.wav"), 50, 1, -3);
		rt.op(f, "Animate", [2, 6], [null, holder_obj, "pixel_z", 1000, "time", 30]);
		if (rt.istype(A, T("/mob/living/carbon/human"))) {
			yield* (L = A).SetUnconscious(0);
			L.drowsyness = 0;
			yield* L.SetSleeping(0);
		}
		yield* sleep(30);
		flooring_near_beacon = list();
		for (floor of each(orange(1, this.beacon), T("/turf/open"))) {
			flooring_near_beacon += floor;
		}
		holder_obj.loc = pick(flooring_near_beacon);
		rt.op(f, "Animate", [2, 6], [null, holder_obj, "pixel_z", 10, "time", 50]);
		yield* sleep(50);
		rt.op(f, "Animate", [2, 6], [null, holder_obj, "pixel_z", 15, "time", 10]);
		yield* sleep(10);
		rt.op(f, "Animate", [2, 6], [null, holder_obj, "pixel_z", 10, "time", 10]);
		yield* sleep(10);
		(balloon3 = mutable_appearance(rt.rsc("icons/obj/fulton_balloon.dmi"), "fulton_retract")).pixel_y = 10;
		balloon3.appearance_flags = 14;
		holder_obj.cut_overlay(balloon);
		holder_obj.add_overlay(balloon3);
		yield* sleep(4);
		holder_obj.cut_overlay(balloon3);
		A.anchored = 0;
		A.density = rt.initial(f, A, "density");
		rt.op(f, "Animate", [2, 6], [null, holder_obj, "pixel_z", 0, "time", 5]);
		yield* sleep(5);
		A.loc = holder_obj.loc;
		yield* qdel(holder_obj);
		if (!(this.uses_left <= 0)) return f.dot;
		yield* qdel(this);
	}
	return f.dot;
}, true);

rt.type(10092, "/obj/item/fulton_core", "/obj/item", {
	name: "extraction beacon signaller",
	desc: "Emits a signal which fulton recovery devices can lock onto. Activate in hand to create a beacon.",
	icon: rt.rsc("icons/obj/stock_parts.dmi"),
	icon_state: "subspace_amplifier",
});

// fulton.dm:148
rt.def("/obj/item/fulton_core/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!((yield* do_after(user, 15, { target: user })) && !(!this || this.gc_destroyed))) return f.dot;
	yield* new_(T("/obj/structure/extraction_point"), rt.getStep(f, user, 0));
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12955, "/obj/structure/extraction_point", "/obj/structure", {
	beacon_network: "station",
	anchored: 1,
	name: "fulton recovery beacon",
	desc: "A beacon for the fulton recovery system. Activate a pack in your hand to link it to a beacon.",
	icon: rt.rsc("icons/obj/fulton.dmi"),
	icon_state: "extraction_point",
	density: 0,
});

// fulton.dm:162
rt.def("/obj/structure/extraction_point/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	let area_name: Value = get_area(this);
	this.name += ` (${rand(100, 999)}) (${area_name.name})`;
	GLOB.total_extraction_beacons += this;
	return f.dot;
});

// fulton.dm:168
rt.def("/obj/structure/extraction_point/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.total_extraction_beacons -= this;
	yield* parent_proc();
	return f.dot;
}, true);

// fulton.dm:177
rt.def("/obj/item/weapon/extraction_pack/proc/check_for_living_mobs", function check_for_living_mobs(f: Frame, A: Value) {
	let L: Value = null, thing: Value = null, L_1: Value = null;
	if (rt.istype(A, T("/mob/living"))) {
		if ((L = A).stat != 2) {
			return 1;
		}
	}
	for (thing of each(A.GetAllContents())) {
		if (rt.istype(A, T("/mob/living"))) {
			if ((L_1 = A).stat != 2) {
				return 1;
			}
		}
	}
	return 0;
});
