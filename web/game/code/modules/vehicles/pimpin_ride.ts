// From code/modules/vehicles/pimpin_ride.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13063, "/obj/vehicle/janicart", "/obj/vehicle", {
	mybag: null,
	floorbuffer: 0,
	name: "janicart (pimpin' ride)",
	desc: "A brave janitor cyborg gave its life to produce such an amazing combination of speed and utility.",
	icon_state: "pussywagon",
});

// /obj/vehicle/janicart/proc/Initialize  (code/modules/vehicles/pimpin_ride.dm:11)
rt.def("/obj/vehicle/janicart/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
}, false, { args: ["mapload"] });

// /obj/vehicle/janicart/proc/Destroy  (code/modules/vehicles/pimpin_ride.dm:16)  may sleep
rt.def("/obj/vehicle/janicart/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "mybag"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "mybag")]);
		rt.setSv(f, "mybag", null);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/vehicle/janicart/proc/buckle_mob  (code/modules/vehicles/pimpin_ride.dm:21)  may sleep
rt.def("/obj/vehicle/janicart/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "riding_datum", (yield* g.new_(f, T("/datum/riding/janicart"), [])));
	return f.dot;
}, true, { args: ["buckled_mob", "force", "check_loc"] });

// /obj/vehicle/janicart/proc/examine  (code/modules/vehicles/pimpin_ride.dm:40)
rt.def("/obj/vehicle/janicart/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "floorbuffer"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It has been upgraded with a floor buffer."]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/vehicle/janicart/proc/attackby  (code/modules/vehicles/pimpin_ride.dm:46)  may sleep
rt.def("/obj/vehicle/janicart/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage/bag/trash")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "mybag"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ already has a trashbag hooked!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You hook the trashbag onto ＀.</span>", [live(f.src)])]);
		rt.setFv(f, "loc", live(f.args[0]), live(f.src));
		rt.setSv(f, "mybag", live(f.args[0]));
		yield* g.srcCall(f, "update_icon");
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/janiupgrade")) ? 1 : 0))) {
			if (truthy(rt.sv(f, "floorbuffer"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ already has a floor buffer!</span>", [live(f.src)])]);
				return live(f.dot);
			}
			rt.setSv(f, "floorbuffer", 1);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You upgrade ＀ with the floor buffer.</span>", [live(f.src)])]);
			(rt.modSrcVar(f, "flags", 2048, rt.bitOr));
			yield* g.srcCall(f, "update_icon");
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/vehicle/janicart/proc/update_icon  (code/modules/vehicles/pimpin_ride.dm:70)
rt.def("/obj/vehicle/janicart/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "mybag"))) {
		rt.callSrc(f, "add_overlay", ["cart_garbage"]);
	}
	if (!truthy(rt.sv(f, "floorbuffer"))) return f.dot;
	rt.callSrc(f, "add_overlay", ["cart_buffer"]);
	return f.dot;
});

// /obj/vehicle/janicart/proc/attack_hand  (code/modules/vehicles/pimpin_ride.dm:78)  may sleep
rt.def("/obj/vehicle/janicart/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	} else {
		if (!truthy(rt.sv(f, "mybag"))) return f.dot;
		rt.setFv(f, "loc", rt.sv(f, "mybag"), rt.getStep(f, live(f.args[0]), 0));
		yield* g.callName(f, live(f.args[0]), "put_in_hands", [rt.sv(f, "mybag")]);
		rt.setSv(f, "mybag", null);
		yield* g.srcCall(f, "update_icon");
	}
	return f.dot;
}, true, { args: ["user"] });
