// From code/game/objects/effects/decals/cleanable/robots.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/effect/decal/cleanable/robot_debris/proc/streak  (code/game/objects/effects/decals/cleanable/robots.dm:16)  may sleep
rt.def("/obj/effect/decal/cleanable/robot_debris/proc/streak", function* streak(f: Frame, directions: Value) {
	let direction: Value = null, i: Value = null, s: Value = null;
	f.vars = () => [directions, direction, i, s];
	direction = rt.op(f, "PickUnweighted", [1], [live(directions)]);
	i = null;
	i = 0;
	while (rt.lt(live(i), rt.op(f, "PickWeighted", [4], [100, 1, 200, 2, 150, 3, 100, 50]))) {
		yield* g.call(f, P("/proc/sleep"), null, [2]);
		if (rt.gt(live(i), 0)) {
			if (truthy(rt.op(f, "Prob", [], [40]))) {
				yield* g.new_(f, T("/obj/effect/decal/cleanable/oil/streak"), [rt.fv(f, "loc", live(f.src))]);
			} else {
				if (truthy(rt.op(f, "Prob", [], [10]))) {
					yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [3, 1, live(f.src)]);
					yield* g.callName(f, live(s), "start", []);
				}
			}
		}
		if (!truthy((yield* g.call(f, P("/proc/step_to"), null, [live(f.src), rt.getStep(f, live(f.src), live(direction)), 0])))) {
			break;
		}
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(11761, "/obj/effect/decal/cleanable/oil", "/obj/effect/decal/cleanable", {
	viruses: null,
	random_icon_states: null,
	blood_state: "oil",
	bloodiness: 100,
	name: "motor oil",
	desc: "It's black and greasy. Looks like Beepsky made another mess.",
	icon: rt.rsc("icons/mob/robots.dmi"),
	icon_state: "floor1",
});

// /obj/effect/decal/cleanable/oil/proc/<init>  (code/game/objects/effects/decals/cleanable/robots.dm:46)
rt.def("/obj/effect/decal/cleanable/oil/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "viruses", rt.list());
	rt.setSv(f, "random_icon_states", rt.list("floor1", "floor2", "floor3", "floor4", "floor5", "floor6", "floor7"));
	return f.dot;
});

// /obj/effect/decal/cleanable/oil/proc/Initialize  (code/game/objects/effects/decals/cleanable/robots.dm:52)  may sleep
rt.def("/obj/effect/decal/cleanable/oil/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["oil", 30]);
	return f.dot;
}, true);

// /obj/effect/decal/cleanable/oil/proc/Destroy  (code/game/objects/effects/decals/cleanable/robots.dm:56)  may sleep
rt.def("/obj/effect/decal/cleanable/oil/proc/Destroy", function* Destroy(f: Frame) {
	let D: Value = null;
	let $e: any;
	f.vars = () => [D, $e];
	D = null;
	rt.forList(f, 0, rt.sv(f, "viruses"), T("/datum/disease"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		yield* g.callName(f, live(D), "cure", [0]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "viruses", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
