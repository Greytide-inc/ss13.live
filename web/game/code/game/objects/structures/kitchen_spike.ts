// From code/game/objects/structures/kitchen_spike.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12789, "/obj/structure/kitchenspike_frame", "/obj/structure", {
	anchored: 0,
	name: "meatspike frame",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "spikeframe",
	desc: "The frame of a meat spike.",
	density: 1,
	obj_integrity: 200,
	max_integrity: 200,
});

// /obj/structure/kitchenspike_frame/proc/attackby  (code/game/objects/structures/kitchen_spike.dm:15)  may sleep
rt.def("/obj/structure/kitchenspike_frame/proc/attackby", function* attackby(f: Frame) {
	let R: Value = null, F: Value = null, WT: Value = null;
	f.vars = () => [R, F, WT];
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/rods")) ? 1 : 0))) {
			if (rt.ge((yield* g.callName(f, (R = live(f.args[0])), "get_amount", [])), 4)) {
				yield* g.callName(f, live(R), "use", [4]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add spikes to the frame.</span>"]);
				yield* g.srcCall(f, "transfer_fingerprints_to", (F = (yield* g.new_(f, T("/obj/structure/kitchenspike"), [rt.fv(f, "loc", live(f.src))]))));
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
				if (!truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin cutting ％！ apart...</span>", [live(f.src)])]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(WT)), 40, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(WT))), null, 1, "target", live(f.src)], rt.Args.Named)))) {
					if (!truthy((yield* g.callName(f, live(WT), "isOn", [])))) {
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(WT)), 50, 1]);
					yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ slices apart ％！.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You cut ％！ apart with ％！.</span>", [live(f.src), live(WT)]), "<span class='italics'>You hear welding.</span>");
					yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.fv(f, "loc", live(f.src)), 4]);
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				}
				return live(f.dot);
			} else {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(12790, "/obj/structure/kitchenspike", "/obj/structure", {
	anchored: 1,
	buckle_lying: 0,
	can_buckle: 1,
	name: "meat spike",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "spike",
	desc: "A spike for collecting meat from animals",
	density: 1,
	obj_integrity: 250,
	max_integrity: 250,
});

// /obj/structure/kitchenspike/proc/attack_paw  (code/game/objects/structures/kitchen_spike.dm:59)  may sleep
rt.def("/obj/structure/kitchenspike/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(f.usr)]));
}, true);

// /obj/structure/kitchenspike/proc/attackby  (code/game/objects/structures/kitchen_spike.dm:63)  may sleep
rt.def("/obj/structure/kitchenspike/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
		if (!truthy((yield* g.srcCall(f, "has_buckled_mobs")))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You pry the spikes out of the frame.</span>"]);
				yield* g.srcCall(f, "deconstruct", 1);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You can't do that while something's on the spike!</span>"]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/kitchenspike/proc/attack_hand  (code/game/objects/structures/kitchen_spike.dm:75)  may sleep
rt.def("/obj/structure/kitchenspike/proc/attack_hand", function* attack_hand(f: Frame) {
	let L: Value = null, m180: Value = null;
	let $e: any;
	f.vars = () => [L, m180, $e];
	if (((((truthy((rt.istype(rt.fv(f, "pulling", live(f.args[0])), T("/mob/living")) ? 1 : 0)) && !truthy((rt.istype(rt.fv(f, "pulling", live(f.args[0])), T("/mob/living/silicon")) ? 1 : 0))) && !truthy((rt.istype(rt.fv(f, "pulling", live(f.args[0])), T("/mob/living/simple_animal/bot")) ? 1 : 0))) && isEqual(rt.fv(f, "a_intent", live(f.args[0])), "grab")) && !truthy((yield* g.srcCall(f, "has_buckled_mobs"))))) {
		L = rt.fv(f, "pulling", live(f.args[0]));
		if (truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.args[0]), live(f.src), 120])))) {
			if (truthy((yield* g.srcCall(f, "has_buckled_mobs")))) {
				return live(f.dot);
			}
			if (truthy(rt.fv(f, "buckled", live(L)))) {
				return live(f.dot);
			}
			if (!isEqual(rt.fv(f, "pulling", live(f.args[0])), live(L))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/splat.ogg"), 25, 1]);
			yield* g.callName(f, live(L), "visible_message", [fmt("<span class='danger'>＀ slams ＀ onto the meat spike!</span>", [live(f.args[0]), live(L)]), fmt("<span class='userdanger'>＀ slams you onto the meat spike!</span>", [live(f.args[0])]), "<span class='italics'>You hear a squishy wet noise.</span>"]);
			rt.setFv(f, "loc", live(L), rt.fv(f, "loc", live(f.src)));
			yield* g.callName(f, live(L), "emote", ["scream"]);
			yield* g.callName(f, live(L), "add_splatter_floor", []);
			yield* g.callName(f, live(L), "adjustBruteLoss", [30]);
			yield* g.callName(f, live(L), "setDir", [2]);
			yield* g.callSrc(f, "buckle_mob", [null, live(L), "force", 1], rt.Args.Named);
			yield* g.callName(f, (m180 = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(L))]))), "Turn", [180]);
			rt.op(f, "Animate", [2, 6], [null, live(L), "transform", live(m180), "time", 3]);
			rt.setFv(f, "pixel_y", live(L), (yield* g.callName(f, live(L), "get_standard_pixel_y_offset", [180])));
		}
	} else {
		if (truthy((yield* g.srcCall(f, "has_buckled_mobs")))) {
			L = null;
			rt.forList(f, 0, rt.sv(f, "buckled_mobs"), T("/mob/living"));
			while (($e = rt.next(f, 0)) !== undefined) {
				L = $e;
				yield* g.srcCall(f, "user_unbuckle_mob", live(L), live(f.args[0]));
			}
			rt.endFor(f, 0);
		} else {
			yield* g.callSuper(f, [], rt.Args.Same);
		}
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/kitchenspike/proc/user_unbuckle_mob  (code/game/objects/structures/kitchen_spike.dm:109)  may sleep
rt.def("/obj/structure/kitchenspike/proc/user_unbuckle_mob", function* user_unbuckle_mob(f: Frame, buckled_mob: Value, user: Value) {
	let M: Value = null, m180: Value = null;
	f.vars = () => [buckled_mob, user, M, m180];
	if (!truthy(live(buckled_mob))) return f.dot;
	if (!isEqual((M = live(buckled_mob)), live(user))) {
		yield* g.callName(f, live(M), "visible_message", [fmt("＀ tries to pull ＀ free of the ＀!", [rt.fv(f, "name", live(user)), rt.fv(f, "name", live(M)), live(f.src)]), fmt("<span class='notice'>＀ is trying to pull you off the ＀, opening up fresh wounds!</span>", [rt.fv(f, "name", live(user)), live(f.src)]), "<span class='italics'>You hear a squishy wet noise.</span>"]);
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 300, "target", live(f.src)], rt.Args.Named)))) {
			if ((truthy(live(M)) && truthy(rt.fv(f, "buckled", live(M))))) {
				yield* g.callName(f, live(M), "visible_message", [fmt("＀ fails to free ＀!", [rt.fv(f, "name", live(user)), rt.fv(f, "name", live(M))]), fmt("<span class='notice'>＀ fails to pull you off of the ＀.</span>", [rt.fv(f, "name", live(user)), live(f.src)])]);
			}
			return live(f.dot);
		}
	} else {
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀ struggles to break free from the ＀!</span>", [rt.fv(f, "name", live(M)), live(f.src)]), fmt("<span class='notice'>You struggle to break free from the ＀, exacerbating your wounds! (Stay still for two minutes.)</span>", [live(f.src)]), "<span class='italics'>You hear a wet squishing noise..</span>"]);
		yield* g.callName(f, live(M), "adjustBruteLoss", [30]);
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(M), null, 1200, "target", live(f.src)], rt.Args.Named)))) {
			if ((truthy(live(M)) && truthy(rt.fv(f, "buckled", live(M))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>You fail to free yourself!</span>"]);
			}
			return live(f.dot);
		}
	}
	if (!truthy(rt.fv(f, "buckled", live(M)))) {
		return live(f.dot);
	}
	yield* g.callName(f, (m180 = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(M))]))), "Turn", [180]);
	rt.op(f, "Animate", [2, 6], [null, live(M), "transform", live(m180), "time", 3]);
	rt.setFv(f, "pixel_y", live(M), (yield* g.callName(f, live(M), "get_standard_pixel_y_offset", [180])));
	yield* g.callName(f, live(M), "adjustBruteLoss", [30]);
	yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='danger'>＀ falls free of the ＀!</span>", [live(M), live(f.src)])]);
	yield* g.callSrc(f, "unbuckle_mob", [null, live(M), "force", 1], rt.Args.Named);
	yield* g.callName(f, live(M), "emote", ["scream"]);
	yield* g.callName(f, live(M), "AdjustKnockdown", [20]);
	return f.dot;
}, true);

// /obj/structure/kitchenspike/proc/deconstruct  (code/game/objects/structures/kitchen_spike.dm:146)  may sleep
rt.def("/obj/structure/kitchenspike/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let F: Value = null;
	f.vars = () => [disassembled, F];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (truthy(live(disassembled))) {
		yield* g.srcCall(f, "transfer_fingerprints_to", (F = (yield* g.new_(f, T("/obj/structure/kitchenspike_frame"), [rt.fv(f, "loc", live(f.src))]))));
	} else {
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.fv(f, "loc", live(f.src)), 4]);
	}
	yield* g.new_(f, T("/obj/item/stack/rods"), [rt.sv(f, "loc"), 4]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
