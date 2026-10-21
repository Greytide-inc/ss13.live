// From code/game/objects/effects/alien_acid.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11782, "/obj/effect/acid", "/obj/effect", {
	target: null,
	anchored: 1,
	gender: "plural",
	name: "acid",
	desc: "Burbling corrossive stuff.",
	icon_state: "acid",
	density: 0,
	opacity: 0,
	resistance_flags: 50,
	layer: 2.08,
});

// /obj/effect/acid/proc/New  (code/game/objects/effects/alien_acid.dm:24)  may sleep
rt.def("/obj/effect/acid/proc/New", function* New(f: Frame, loc: Value, acid_pwr: Value, acid_amt: Value) {
	f.vars = () => [loc, acid_pwr, acid_amt];
	yield* g.callSuper(f, [live(loc)]);
	rt.setSv(f, "target", rt.getStep(f, live(f.src), 0));
	if (truthy(live(acid_amt))) {
		rt.setSv(f, "acid_level", (yield* g.call(f, P("/proc/min"), null, [multiply(live(acid_amt), live(acid_pwr)), 12000])));
	}
	rt.setSv(f, "pixel_x", add(rt.fv(f, "pixel_x", rt.sv(f, "target")), (yield* g.call(f, P("/proc/rand"), null, [-4, 4]))));
	rt.setSv(f, "pixel_y", add(rt.fv(f, "pixel_y", rt.sv(f, "target")), (yield* g.call(f, P("/proc/rand"), null, [-4, 4]))));
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/effect/acid/proc/Destroy  (code/game/objects/effects/alien_acid.dm:39)  may sleep
rt.def("/obj/effect/acid/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	rt.setSv(f, "target", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/acid/proc/process  (code/game/objects/effects/alien_acid.dm:45)  may sleep
rt.def("/obj/effect/acid/proc/process", function* process(f: Frame) {
	let O: Value = null, acid_used: Value = null;
	let $e: any;
	f.vars = () => [O, acid_used, $e];
	f.dot = 1;
	if (!truthy(rt.sv(f, "target"))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 0;
	}
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	O = null;
	rt.forList(f, 0, rt.sv(f, "target"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if ((truthy(rt.op(f, "Prob", [], [20])) && !truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 16)))) {
			if (rt.lt(rt.fv(f, "acid_level", live(O)), multiply(rt.sv(f, "acid_level"), 0.30000001192092896))) {
				acid_used = (yield* g.call(f, P("/proc/min"), null, [multiply(rt.sv(f, "acid_level"), 0.05000000074505806), 20]));
				yield* g.callName(f, live(O), "acid_act", [10, live(acid_used)]);
				rt.setSv(f, "acid_level", (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "acid_level"), multiply(live(acid_used), 10))])));
			}
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "acid_level", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "acid_level"), add(5, multiply(2, (yield* g.call(f, P("/proc/round"), null, [rt.op(f, "Sqrt", [], [rt.sv(f, "acid_level")])]))))), 0])));
	if (!rt.le(rt.sv(f, "acid_level"), 0)) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return 0;
}, true, { waitfor: false });

// /obj/effect/acid/proc/Crossed  (code/game/objects/effects/alien_acid.dm:65)  may sleep
rt.def("/obj/effect/acid/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let L: Value = null, acid_used: Value = null;
	f.vars = () => [AM, L, acid_used];
	if (!truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) return f.dot;
	if (truthy(rt.bitAnd(rt.gv(f, "movement_type", (L = live(AM))), 2))) {
		return live(f.dot);
	}
	if (!(!isEqual(rt.fv(f, "m_intent", live(L)), "walk") && truthy(rt.op(f, "Prob", [], [40])))) return f.dot;
	acid_used = (yield* g.call(f, P("/proc/min"), null, [multiply(rt.sv(f, "acid_level"), 0.05000000074505806), 20]));
	if (!truthy((yield* g.callName(f, live(L), "acid_act", [10, live(acid_used), "feet"])))) return f.dot;
	rt.setSv(f, "acid_level", (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "acid_level"), multiply(live(acid_used), 10))])));
	yield* g.call(f, P("/proc/playsound"), null, [live(L), rt.rsc("sound/weapons/sear.ogg"), 50, 1]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='userdanger'>＀ burns you!</span>", [live(f.src)])]);
	return f.dot;
}, true);

rt.type(11783, "/obj/effect/acid/alien", "/obj/effect/acid", {
	target_strength: 30,
});

// /obj/effect/acid/alien/proc/process  (code/game/objects/effects/alien_acid.dm:82)  may sleep
rt.def("/obj/effect/acid/alien/proc/process", function* process(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	if (truthy(rt.op(f, "Prob", [], [45]))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	rt.incSrcVar(f, "target_strength", -1, true);
	if (rt.le(rt.sv(f, "target_strength"), 0)) {
		yield* g.callName(f, rt.sv(f, "target"), "visible_message", [fmt("<span class='warning'>＀ collapses under its own weight into a puddle of goop and undigested debris!</span>", [rt.sv(f, "target")])]);
		yield* g.callName(f, rt.sv(f, "target"), "acid_melt", []);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		$0 = rt.sv(f, "target_strength");
		if ($0 === 24) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ is holding up against the acid!</span>", [rt.sv(f, "target")]));
		} else if ($0 === 16) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ is being melted by the acid!</span>", [rt.sv(f, "target")]));
		} else if ($0 === 8) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ is struggling to withstand the acid!</span>", [rt.sv(f, "target")]));
		} else if ($0 === 4) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ begins to crumble under the acid!</span>", [rt.sv(f, "target")]));
		}
	}
	return f.dot;
}, true, { waitfor: false });
