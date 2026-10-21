// From code/modules/mining/equipment/wormhole_jaunter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/device/wormhole_jaunter/proc/attack_self  (code/modules/mining/equipment/wormhole_jaunter.dm:16)  may sleep
rt.def("/obj/item/device/wormhole_jaunter/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ activates the ＀!</span>", [rt.fv(f, "name", live(user)), rt.fv(f, "name", live(f.src))])]);
	yield* g.srcCall(f, "activate", live(user));
	return f.dot;
}, true);

// /obj/item/device/wormhole_jaunter/proc/turf_check  (code/modules/mining/equipment/wormhole_jaunter.dm:21)
rt.def("/obj/item/device/wormhole_jaunter/proc/turf_check", function turf_check(f: Frame, user: Value) {
	let device_turf: Value = null;
	f.vars = () => [device_turf];
	if (((!truthy((device_turf = rt.getStep(f, live(user), 0))) || isEqual(rt.fv(f, "z", live(device_turf)), 2)) || rt.ge(rt.fv(f, "z", live(device_turf)), 7))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You're having difficulties getting the ＀ to work.</span>", [rt.fv(f, "name", live(f.src))])]);
		return 0;
	}
	return 1;
});

// /obj/item/device/wormhole_jaunter/proc/get_destinations  (code/modules/mining/equipment/wormhole_jaunter.dm:28)
rt.def("/obj/item/device/wormhole_jaunter/proc/get_destinations", function get_destinations(f: Frame, user: Value) {
	let destinations: Value = null, B: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [destinations, B, _T, $e];
	destinations = rt.list();
	if (truthy(rt.call(f, P("/proc/is_species"), null, [live(user), T("/datum/species/golem")]))) {
		B = null;
		rt.forList(f, 0, rt.gl("teleportbeacons"), T("/obj/item/device/radio/beacon"));
		while (($e = rt.next(f, 0)) !== undefined) {
			B = $e;
			if (truthy((rt.istype(rt.gv(f, "loc", (_T = rt.getStep(f, live(B), 0))), T("/area/ruin/powered/golem_ship")) ? 1 : 0))) {
				destinations = rt.modify(live(destinations), live(B), add);
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.len(f, live(destinations)))) {
		return live(destinations);
	}
	B = null;
	rt.forList(f, 0, rt.gl("teleportbeacons"), T("/obj/item/device/radio/beacon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		if (isEqual(rt.gv(f, "z", (_T = rt.getStep(f, live(B), 0))), 2)) {
			destinations = rt.modify(live(destinations), live(B), add);
		}
	}
	rt.endFor(f, 0);
	return live(destinations);
});

// /obj/item/device/wormhole_jaunter/proc/activate  (code/modules/mining/equipment/wormhole_jaunter.dm:48)  may sleep
rt.def("/obj/item/device/wormhole_jaunter/proc/activate", function* activate(f: Frame, user: Value) {
	let L: Value = null, chosen_beacon: Value = null, J: Value = null;
	f.vars = () => [user, L, chosen_beacon, J];
	if (!truthy((yield* g.srcCall(f, "turf_check", live(user))))) {
		return live(f.dot);
	}
	if (!truthy(rt.getLen(f, (L = (yield* g.srcCall(f, "get_destinations", live(user))))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>The ＀ found no beacons in the world to anchor a wormhole to.</span>", [rt.fv(f, "name", live(f.src))])]);
		return live(f.dot);
	}
	chosen_beacon = rt.op(f, "PickUnweighted", [1], [live(L)]);
	yield* g.call(f, P("/proc/try_move_adjacent"), null, [(J = (yield* g.new_(f, T("/obj/effect/portal/wormhole/jaunt_tunnel"), [rt.getStep(f, live(f.src), 0), live(f.src), 100, null, 0, rt.getStep(f, live(chosen_beacon), 0)])))]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/sparks4.ogg"), 50, 1]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/device/wormhole_jaunter/proc/emp_act  (code/modules/mining/equipment/wormhole_jaunter.dm:64)  may sleep
rt.def("/obj/item/device/wormhole_jaunter/proc/emp_act", function* emp_act(f: Frame, power: Value) {
	let triggered: Value = null;
	f.vars = () => [power, triggered];
	triggered = 0;
	if (isEqual((yield* g.callName(f, live(f.usr), "get_item_by_slot", [5])), live(f.src))) {
		if (isEqual(live(power), 1)) {
			triggered = 1;
		} else {
			if ((isEqual(live(power), 2) && truthy(rt.op(f, "Prob", [], [50])))) {
				triggered = 1;
			}
		}
	}
	if (!truthy(live(triggered))) return f.dot;
	yield* g.callName(f, live(f.usr), "visible_message", [fmt("<span class='warning'>The ＀ overloads and activates!</span>", [live(f.src)])]);
	yield* g.srcCall(f, "activate", live(f.usr));
	return f.dot;
}, true);

// /obj/item/device/wormhole_jaunter/proc/chasm_react  (code/modules/mining/equipment/wormhole_jaunter.dm:76)  may sleep
rt.def("/obj/item/device/wormhole_jaunter/proc/chasm_react", function* chasm_react(f: Frame, user: Value) {
	f.vars = () => [user];
	if (isEqual((yield* g.callName(f, live(user), "get_item_by_slot", [5])), live(f.src))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("Your ＀ activates, saving you from the chasm!</span>", [live(f.src)])]);
		yield* g.srcCall(f, "activate", live(user));
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("The ＀ is not attached to your belt, preventing it from saving you from the chasm. RIP.</span>", [live(f.src)])]);
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

// /obj/effect/portal/wormhole/jaunt_tunnel/proc/teleport  (code/modules/mining/equipment/wormhole_jaunter.dm:92)  may sleep
rt.def("/obj/effect/portal/wormhole/jaunt_tunnel/proc/teleport", function* teleport(f: Frame, M: Value) {
	let L: Value = null;
	f.vars = () => [M, L];
	if (truthy((rt.istype(live(M), T("/obj/effect")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "anchored", live(M)))) {
		if (!(truthy((rt.istype(live(M), T("/obj/mecha")) ? 1 : 0)) && truthy(rt.sv(f, "mech_sized")))) {
			return live(f.dot);
		}
	}
	if (!truthy((rt.istype(live(M), T("/atom/movable")) ? 1 : 0))) return f.dot;
	if (!truthy((yield* g.call(f, P("/proc/do_teleport"), null, [live(M), rt.sv(f, "hard_target"), 6])))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [live(M), rt.rsc("sound/weapons/resonator_blast.ogg"), 50, 1]);
	if (!truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (L = live(M)), "Knockdown", [60]);
	if (!truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	yield* g.call(f, P("/proc/shake_camera"), null, [live(L), 20, 1]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(L), P("/mob/living/carbon/proc/vomit")])), 20]);
	return f.dot;
}, true);
