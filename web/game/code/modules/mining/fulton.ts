// From code/modules/mining/fulton.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobaltotal_extraction_beacons  (code/modules/mining/fulton.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobaltotal_extraction_beacons", function InitGlobaltotal_extraction_beacons(f: Frame) {
	rt.setGl("total_extraction_beacons", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "total_extraction_beacons", add);
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

// /obj/item/weapon/extraction_pack/proc/<init>  (code/modules/mining/fulton.dm:10)
rt.def("/obj/item/weapon/extraction_pack/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "beacon_networks", rt.list("station"));
	return f.dot;
});

// /obj/item/weapon/extraction_pack/proc/examine  (code/modules/mining/fulton.dm:16)
rt.def("/obj/item/weapon/extraction_pack/proc/examine", function examine(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.callName(f, live(f.usr), "show_message", [fmt("It has ＀ uses remaining.", [rt.sv(f, "uses_left")]), 1]);
	return f.dot;
});

// /obj/item/weapon/extraction_pack/proc/attack_self  (code/modules/mining/fulton.dm:20)  may sleep
rt.def("/obj/item/weapon/extraction_pack/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let possible_beacons: Value = null, B: Value = null, EP: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, possible_beacons, B, EP, A, $e];
	possible_beacons = rt.list();
	B = null;
	rt.forList(f, 0, rt.gl("total_extraction_beacons"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		if (truthy((rt.isIn(f, rt.gv(f, "beacon_network", (EP = live(B))), rt.sv(f, "beacon_networks")) ? 1 : 0))) {
			possible_beacons = rt.modify(live(possible_beacons), live(EP), add);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(possible_beacons)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "There are no extraction beacons in existence!"]);
		return live(f.dot);
	} else {
		A = null;
		if (!truthy((A = (yield* g.op(f, "Prompt", [1], [null, live(A), "Balloon Extraction Pack", "Select a beacon to connect to", live(possible_beacons)]))))) {
			return live(f.dot);
		}
		rt.setSv(f, "beacon", live(A));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You link the extraction pack to the beacon system."]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/extraction_pack/proc/afterattack  (code/modules/mining/fulton.dm:41)  may sleep
rt.def("/obj/item/weapon/extraction_pack/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, flag: Value, params: Value) {
	let area: Value = null, B: Value = null, balloon: Value = null, balloon2: Value = null, balloon3: Value = null, M: Value = null, holder_obj: Value = null, L: Value = null, flooring_near_beacon: Value = null, floor: Value = null;
	let $e: any;
	f.vars = () => [A, user, flag, params, area, B, balloon, balloon2, balloon3, M, holder_obj, L, flooring_near_beacon, floor, $e];
	if (!truthy(rt.sv(f, "beacon"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ is not linked to a beacon, and cannot be used.", [live(f.src)])]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "can_use_indoors"))) {
		if (!truthy(rt.gv(f, "outdoors", (area = (yield* g.call(f, P("/proc/get_area"), null, [live(A)])))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ can only be used on things that are outdoors!", [live(f.src)])]);
			return live(f.dot);
		}
	}
	if (!truthy(live(flag))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(A), T("/atom/movable")) ? 1 : 0))) {
		return live(f.dot);
	} else {
		if ((!truthy(rt.sv(f, "safe_for_living_creatures")) && truthy((yield* g.srcCall(f, "check_for_living_mobs", live(A)))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ is not safe for use with living creatures, they wouldn't survive the trip back!", [live(f.src)])]);
			return live(f.dot);
		}
		if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(A))])))) {
			return live(f.dot);
		}
		if (truthy(rt.fv(f, "anchored", live(A)))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You start attaching the pack to ＀...</span>", [live(A)])]);
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 50, "target", live(A)], rt.Args.Named)))) return f.dot;
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You attach the pack to ＀ and activate it.</span>", [live(A)])]);
		if ((isEqual(rt.sv(f, "loc"), live(user)) && truthy((rt.istype(rt.fv(f, "back", live(user)), T("/obj/item/weapon/storage/backpack")) ? 1 : 0)))) {
			if (truthy((yield* g.callName(f, (B = rt.fv(f, "back", live(user))), "can_be_inserted", [null, live(f.src), "stop_messages", 1], rt.Args.Named)))) {
				yield* g.callName(f, live(B), "handle_item_insertion", [live(f.src)]);
			}
		}
		rt.incSrcVar(f, "uses_left", -1, true);
		if (rt.le(rt.sv(f, "uses_left"), 0)) {
			yield* g.callName(f, live(user), "drop_item", [live(f.src)]);
			rt.setSv(f, "loc", live(A));
		}
		balloon = null;
		balloon2 = null;
		balloon3 = null;
		if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
			yield* g.callName(f, (M = live(A)), "Knockdown", [320]);
			rt.setFv(f, "buckled", live(M), 0);
		} else {
			rt.setFv(f, "anchored", live(A), 1);
			rt.setFv(f, "density", live(A), 0);
		}
		rt.setFv(f, "appearance", (holder_obj = (yield* g.new_(f, T("/obj/effect/extraction_holder"), [rt.fv(f, "loc", live(A))]))), rt.fv(f, "appearance", live(A)));
		rt.setFv(f, "loc", live(A), live(holder_obj));
		rt.setFv(f, "pixel_y", (balloon2 = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/fulton_balloon.dmi"), "fulton_expand"]))), 10);
		rt.setFv(f, "appearance_flags", live(balloon2), 14);
		yield* g.callName(f, live(holder_obj), "add_overlay", [live(balloon2)]);
		yield* g.call(f, P("/proc/sleep"), null, [4]);
		rt.setFv(f, "pixel_y", (balloon = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/fulton_balloon.dmi"), "fulton_balloon"]))), 10);
		rt.setFv(f, "appearance_flags", live(balloon), 14);
		yield* g.callName(f, live(holder_obj), "cut_overlay", [live(balloon2)]);
		yield* g.callName(f, live(holder_obj), "add_overlay", [live(balloon)]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(holder_obj)), rt.rsc("sound/items/fulext_deploy.wav"), 50, 1, -3]);
		rt.op(f, "Animate", [2, 6], [null, live(holder_obj), "pixel_z", 10, "time", 20]);
		yield* g.call(f, P("/proc/sleep"), null, [20]);
		rt.op(f, "Animate", [2, 6], [null, live(holder_obj), "pixel_z", 15, "time", 10]);
		yield* g.call(f, P("/proc/sleep"), null, [10]);
		rt.op(f, "Animate", [2, 6], [null, live(holder_obj), "pixel_z", 10, "time", 10]);
		yield* g.call(f, P("/proc/sleep"), null, [10]);
		rt.op(f, "Animate", [2, 6], [null, live(holder_obj), "pixel_z", 15, "time", 10]);
		yield* g.call(f, P("/proc/sleep"), null, [10]);
		rt.op(f, "Animate", [2, 6], [null, live(holder_obj), "pixel_z", 10, "time", 10]);
		yield* g.call(f, P("/proc/sleep"), null, [10]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(holder_obj)), rt.rsc("sound/items/fultext_launch.wav"), 50, 1, -3]);
		rt.op(f, "Animate", [2, 6], [null, live(holder_obj), "pixel_z", 1000, "time", 30]);
		if (truthy((rt.istype(live(A), T("/mob/living/carbon/human")) ? 1 : 0))) {
			yield* g.callName(f, (L = live(A)), "SetUnconscious", [0]);
			rt.setFv(f, "drowsyness", live(L), 0);
			yield* g.callName(f, live(L), "SetSleeping", [0]);
		}
		yield* g.call(f, P("/proc/sleep"), null, [30]);
		flooring_near_beacon = rt.list();
		floor = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [1, rt.sv(f, "beacon")])), T("/turf/open"));
		while (($e = rt.next(f, 0)) !== undefined) {
			floor = $e;
			flooring_near_beacon = rt.modify(live(flooring_near_beacon), live(floor), add);
		}
		rt.endFor(f, 0);
		rt.setFv(f, "loc", live(holder_obj), rt.op(f, "PickUnweighted", [1], [live(flooring_near_beacon)]));
		rt.op(f, "Animate", [2, 6], [null, live(holder_obj), "pixel_z", 10, "time", 50]);
		yield* g.call(f, P("/proc/sleep"), null, [50]);
		rt.op(f, "Animate", [2, 6], [null, live(holder_obj), "pixel_z", 15, "time", 10]);
		yield* g.call(f, P("/proc/sleep"), null, [10]);
		rt.op(f, "Animate", [2, 6], [null, live(holder_obj), "pixel_z", 10, "time", 10]);
		yield* g.call(f, P("/proc/sleep"), null, [10]);
		rt.setFv(f, "pixel_y", (balloon3 = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/fulton_balloon.dmi"), "fulton_retract"]))), 10);
		rt.setFv(f, "appearance_flags", live(balloon3), 14);
		yield* g.callName(f, live(holder_obj), "cut_overlay", [live(balloon)]);
		yield* g.callName(f, live(holder_obj), "add_overlay", [live(balloon3)]);
		yield* g.call(f, P("/proc/sleep"), null, [4]);
		yield* g.callName(f, live(holder_obj), "cut_overlay", [live(balloon3)]);
		rt.setFv(f, "anchored", live(A), 0);
		rt.setFv(f, "density", live(A), rt.initial(f, live(A), "density"));
		rt.op(f, "Animate", [2, 6], [null, live(holder_obj), "pixel_z", 0, "time", 5]);
		yield* g.call(f, P("/proc/sleep"), null, [5]);
		rt.setFv(f, "loc", live(A), rt.fv(f, "loc", live(holder_obj)));
		yield* g.call(f, P("/proc/qdel"), null, [live(holder_obj)]);
		if (!rt.le(rt.sv(f, "uses_left"), 0)) return f.dot;
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

rt.type(10092, "/obj/item/fulton_core", "/obj/item", {
	name: "extraction beacon signaller",
	desc: "Emits a signal which fulton recovery devices can lock onto. Activate in hand to create a beacon.",
	icon: rt.rsc("icons/obj/stock_parts.dmi"),
	icon_state: "subspace_amplifier",
});

// /obj/item/fulton_core/proc/attack_self  (code/modules/mining/fulton.dm:148)  may sleep
rt.def("/obj/item/fulton_core/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 15, "target", live(user)], rt.Args.Named))) && !(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))))) return f.dot;
	yield* g.new_(f, T("/obj/structure/extraction_point"), [rt.getStep(f, live(user), 0)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
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

// /obj/structure/extraction_point/proc/Initialize  (code/modules/mining/fulton.dm:162)
rt.def("/obj/structure/extraction_point/proc/Initialize", function Initialize(f: Frame) {
	let area_name: Value = null;
	f.vars = () => [area_name];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	area_name = rt.call(f, P("/proc/get_area"), null, [live(f.src)]);
	rt.modSrcVar(f, "name", fmt(" (＀) (＀)", [rt.call(f, P("/proc/rand"), null, [100, 999]), rt.fv(f, "name", live(area_name))]), add);
	rt.modGl("total_extraction_beacons", live(f.src), add);
	return f.dot;
});

// /obj/structure/extraction_point/proc/Destroy  (code/modules/mining/fulton.dm:168)  may sleep
rt.def("/obj/structure/extraction_point/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("total_extraction_beacons", live(f.src), subtract));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/weapon/extraction_pack/proc/check_for_living_mobs  (code/modules/mining/fulton.dm:177)
rt.def("/obj/item/weapon/extraction_pack/proc/check_for_living_mobs", function check_for_living_mobs(f: Frame, A: Value) {
	let L: Value = null, thing: Value = null, L_1: Value = null;
	let $e: any;
	f.vars = () => [L, thing, L_1, $e];
	if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
		if (!isEqual(rt.gv(f, "stat", (L = live(A))), 2)) {
			return 1;
		}
	}
	thing = null;
	rt.forList(f, 0, rt.callName(f, live(A), "GetAllContents", []));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
			if (!isEqual(rt.gv(f, "stat", (L_1 = live(A))), 2)) {
				return 1;
			}
		}
	}
	rt.endFor(f, 0);
	return 0;
});
