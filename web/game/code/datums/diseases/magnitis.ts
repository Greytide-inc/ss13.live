// From code/datums/diseases/magnitis.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(957, "/datum/disease/magnitis", "/datum/disease", {
	name: "Magnitis",
	max_stages: 4,
	spread_text: "Airborne",
	cure_text: "Iron",
	cures: null,
	agent: "Fukkos Miracos",
	disease_flags: 7,
	permeability_mod: 0.75,
	desc: "This disease disrupts the magnetic field of your body, making it act as if a powerful magnet. Injections of iron help stabilize the field.",
	severity: "Medium",
	viable_mobtypes: null,
});

// /datum/disease/magnitis/proc/<init>  (code/datums/diseases/magnitis.dm:6)
rt.def("/datum/disease/magnitis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("iron"));
	$0 = $0;
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human")));
	return f.dot;
});

// /datum/disease/magnitis/proc/stage_act  (code/datums/diseases/magnitis.dm:15)  may sleep
rt.def("/datum/disease/magnitis/proc/stage_act", function* stage_act(f: Frame) {
	let M: Value = null, S: Value = null, i: Value = null, iter: Value = null;
	let $0: any, $e: any;
	f.vars = () => [M, S, i, iter, $0, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel a slight shock course through your body.</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			M = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [2, rt.sv(f, "affected_mob")])), T("/obj"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				if ((!truthy(rt.fv(f, "anchored", live(M))) && truthy(rt.bitAnd(rt.fv(f, "flags", live(M)), 64)))) {
					yield* g.call(f, P("/proc/step_towards"), null, [live(M), rt.sv(f, "affected_mob")]);
				}
			}
			rt.endFor(f, 0);
			S = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [2, rt.sv(f, "affected_mob")])), T("/mob/living/silicon"));
			while (($e = rt.next(f, 0)) !== undefined) {
				S = $e;
				if (truthy((rt.istype(live(S), T("/mob/living/silicon/ai")) ? 1 : 0))) {
					continue;
				}
				yield* g.call(f, P("/proc/step_towards"), null, [live(S), rt.sv(f, "affected_mob")]);
			}
			rt.endFor(f, 0);
		}
	} else if ($0 === 3) {
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel a strong shock course through your body.</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel like clowning around.</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [4]))) {
			M = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [4, rt.sv(f, "affected_mob")])), T("/obj"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				if ((!truthy(rt.fv(f, "anchored", live(M))) && truthy(rt.bitAnd(rt.fv(f, "flags", live(M)), 64)))) {
					i = null;
					iter = (yield* g.call(f, P("/proc/rand"), null, [1, 2]));
					i = 0;
					while (rt.lt(live(i), live(iter))) {
						yield* g.call(f, P("/proc/step_towards"), null, [live(M), rt.sv(f, "affected_mob")]);
						i = rt.inc(live(i), 1);
					}
				}
			}
			rt.endFor(f, 0);
			S = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [4, rt.sv(f, "affected_mob")])), T("/mob/living/silicon"));
			while (($e = rt.next(f, 0)) !== undefined) {
				S = $e;
				if (truthy((rt.istype(live(S), T("/mob/living/silicon/ai")) ? 1 : 0))) {
					continue;
				}
				i = null;
				iter = (yield* g.call(f, P("/proc/rand"), null, [1, 2]));
				i = 0;
				while (rt.lt(live(i), live(iter))) {
					yield* g.call(f, P("/proc/step_towards"), null, [live(S), rt.sv(f, "affected_mob")]);
					i = rt.inc(live(i), 1);
				}
			}
			rt.endFor(f, 0);
		}
	} else if ($0 === 4) {
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel a powerful shock course through your body.</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You query upon the nature of miracles.</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [8]))) {
			M = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [6, rt.sv(f, "affected_mob")])), T("/obj"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				if ((!truthy(rt.fv(f, "anchored", live(M))) && truthy(rt.bitAnd(rt.fv(f, "flags", live(M)), 64)))) {
					i = null;
					iter = (yield* g.call(f, P("/proc/rand"), null, [1, 3]));
					i = 0;
					while (rt.lt(live(i), live(iter))) {
						yield* g.call(f, P("/proc/step_towards"), null, [live(M), rt.sv(f, "affected_mob")]);
						i = rt.inc(live(i), 1);
					}
				}
			}
			rt.endFor(f, 0);
			S = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [6, rt.sv(f, "affected_mob")])), T("/mob/living/silicon"));
			while (($e = rt.next(f, 0)) !== undefined) {
				S = $e;
				if (truthy((rt.istype(live(S), T("/mob/living/silicon/ai")) ? 1 : 0))) {
					continue;
				}
				i = null;
				iter = (yield* g.call(f, P("/proc/rand"), null, [1, 3]));
				i = 0;
				while (rt.lt(live(i), live(iter))) {
					yield* g.call(f, P("/proc/step_towards"), null, [live(S), rt.sv(f, "affected_mob")]);
					i = rt.inc(live(i), 1);
				}
			}
			rt.endFor(f, 0);
		}
	}
	return live(f.dot);
}, true);
