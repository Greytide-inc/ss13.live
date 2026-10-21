// From code/game/objects/structures/transit_tubes/transit_tube_construction.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12914, "/obj/structure/c_transit_tube", "/obj/structure", {
	flipped: 0,
	build_type: rt.typePath("/obj/structure/transit_tube"),
	flipped_build_type: null,
	base_icon: null,
	anchored: 0,
	name: "unattached transit tube",
	icon: rt.rsc("icons/obj/atmospherics/pipes/transit_tube.dmi"),
	icon_state: "straight",
	density: 0,
	layer: 2.95,
});

// /obj/structure/c_transit_tube/proc/examine  (code/game/objects/structures/transit_tubes/transit_tube_construction.dm:17)
rt.def("/obj/structure/c_transit_tube/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Alt-click to rotate it clockwise.</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/c_transit_tube/proc/tube_rotate  (code/game/objects/structures/transit_tubes/transit_tube_construction.dm:21)
rt.def("/obj/structure/c_transit_tube/proc/tube_rotate", function tube_rotate(f: Frame) {
	rt.callSrc(f, "setDir", [rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), -90])]);
	return f.dot;
});

// /obj/structure/c_transit_tube/proc/tube_flip  (code/game/objects/structures/transit_tubes/transit_tube_construction.dm:25)
rt.def("/obj/structure/c_transit_tube/proc/tube_flip", function tube_flip(f: Frame) {
	let cur_flip: Value = null;
	let $0: any;
	f.vars = () => [cur_flip, $0];
	if (truthy(rt.sv(f, "flipped_build_type"))) {
		rt.setSv(f, "flipped", (!truthy(rt.sv(f, "flipped")) ? 1 : 0));
		if (truthy(rt.initial(f, live(f.src), "flipped"))) {
			$0 = (!truthy(rt.sv(f, "flipped")) ? 1 : 0);
		} else {
			$0 = rt.sv(f, "flipped");
		}
		if (truthy((cur_flip = $0))) {
			rt.setSv(f, "build_type", rt.sv(f, "flipped_build_type"));
		} else {
			rt.setSv(f, "build_type", rt.initial(f, live(f.src), "build_type"));
		}
		rt.setSv(f, "icon_state", fmt("＀＀", [rt.sv(f, "base_icon"), rt.sv(f, "flipped")]));
	} else {
		rt.callSrc(f, "setDir", [rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 180])]);
	}
	return f.dot;
});

// /obj/structure/c_transit_tube/verb/rotate  (code/game/objects/structures/transit_tubes/transit_tube_construction.dm:41)
rt.def("/obj/structure/c_transit_tube/verb/rotate", function rotate(f: Frame) {
	if (truthy(rt.callName(f, live(f.usr), "incapacitated", []))) {
		return live(f.dot);
	}
	rt.callSrc(f, "tube_rotate", []);
	return f.dot;
}, false, { verb: { name: "Rotate Tube", category: "Object", src: 1, range: 1 } });

// /obj/structure/c_transit_tube/proc/AltClick  (code/game/objects/structures/transit_tubes/transit_tube_construction.dm:47)  may sleep
rt.def("/obj/structure/c_transit_tube/proc/AltClick", function* AltClick(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.callName(f, live(f.args[0]), "incapacitated", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	}
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[0])])), 1)) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "tube_rotate");
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/c_transit_tube/verb/flip  (code/game/objects/structures/transit_tubes/transit_tube_construction.dm:60)
rt.def("/obj/structure/c_transit_tube/verb/flip", function flip(f: Frame) {
	if (truthy(rt.callName(f, live(f.usr), "incapacitated", []))) {
		return live(f.dot);
	}
	rt.callSrc(f, "tube_flip", []);
	return f.dot;
}, false, { verb: { name: "Flip", category: "Object", src: 1, range: 1 } });

// /obj/structure/c_transit_tube/proc/attackby  (code/game/objects/structures/transit_tubes/transit_tube_construction.dm:66)  may sleep
rt.def("/obj/structure/c_transit_tube/proc/attackby", function* attackby(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start attaching the ＀...</span>", [rt.sv(f, "name")])]);
		yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
			if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You attach the ＀.</span>", [rt.sv(f, "name")])]);
			yield* g.srcCall(f, "transfer_fingerprints_to", (R = (yield* g.new_(f, rt.sv(f, "build_type"), [rt.sv(f, "loc"), rt.sv(f, "dir")]))));
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });
