// From code/modules/procedural_mapping/mapGenerators/cellular.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1876, "/datum/mapGenerator/ca", "/datum/mapGenerator", {
	b_rule: null,
	s_rule: null,
	iterations: 1,
	loop_edges: 0,
	edge_value: 1,
	old_state: null,
	current_state: null,
	width: 10,
	height: 10,
	start: null,
	type_map: null,
});

// /datum/mapGenerator/ca/proc/<init>  (code/modules/procedural_mapping/mapGenerators/cellular.dm:6)
rt.def("/datum/mapGenerator/ca/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "b_rule", rt.list());
	$0 = $0;
	rt.setSv(f, "s_rule", rt.list());
	$0 = $0;
	rt.setSv(f, "type_map", rt.list(T("/turf/open/floor/plating"), T("/turf/closed/wall")));
	return f.dot;
});

// /datum/mapGenerator/ca/proc/defineRegion  (code/modules/procedural_mapping/mapGenerators/cellular.dm:19)
rt.def("/datum/mapGenerator/ca/proc/defineRegion", function defineRegion(f: Frame) {
	let min_x: Value = null, max_x: Value = null, min_y: Value = null, max_y: Value = null;
	f.vars = () => [min_x, max_x, min_y, max_y];
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	min_x = rt.call(f, P("/proc/min"), null, [rt.fv(f, "x", live(f.args[0])), rt.fv(f, "x", live(f.args[1]))]);
	max_x = rt.call(f, P("/proc/max"), null, [rt.fv(f, "x", live(f.args[0])), rt.fv(f, "x", live(f.args[1]))]);
	min_y = rt.call(f, P("/proc/min"), null, [rt.fv(f, "y", live(f.args[0])), rt.fv(f, "y", live(f.args[1]))]);
	max_y = rt.call(f, P("/proc/max"), null, [rt.fv(f, "y", live(f.args[0])), rt.fv(f, "y", live(f.args[1]))]);
	rt.setSv(f, "width", subtract(live(max_x), live(min_x)));
	rt.setSv(f, "height", subtract(live(max_y), live(min_y)));
	rt.setSv(f, "start", rt.locate(live(min_x), live(min_y), rt.fv(f, "z", live(f.args[0]))));
	return f.dot;
}, false, { args: ["Start", "End", "replace"] });

// /datum/mapGenerator/ca/proc/initialize  (code/modules/procedural_mapping/mapGenerators/cellular.dm:32)
rt.def("/datum/mapGenerator/ca/proc/initialize", function initialize(f: Frame) {
	let i: Value = null, j: Value = null;
	f.vars = () => [i, j];
	rt.setSv(f, "old_state", rt.new_(f, T("/list"), [rt.sv(f, "width")]));
	i = null;
	i = 1;
	while (rt.le(live(i), rt.sv(f, "width"))) {
		rt.setAt(rt.sv(f, "old_state"), live(i), rt.new_(f, T("/list"), [rt.sv(f, "height")]));
		j = null;
		j = 1;
		while (rt.le(live(j), rt.sv(f, "height"))) {
			rt.setAt(rt.index(rt.sv(f, "old_state"), live(i)), live(j), rt.call(f, P("/proc/rand"), null, [0, 1]));
			j = rt.inc(live(j), 1);
		}
		i = rt.inc(live(i), 1);
	}
	rt.setSv(f, "current_state", rt.callName(f, rt.sv(f, "old_state"), "Copy", []));
	return f.dot;
});

// /datum/mapGenerator/ca/proc/generate  (code/modules/procedural_mapping/mapGenerators/cellular.dm:45)  may sleep
rt.def("/datum/mapGenerator/ca/proc/generate", function* generate(f: Frame) {
	let generation: Value = null, i: Value = null, j: Value = null, i_0: Value = null, j_1: Value = null, _T: Value = null;
	f.vars = () => [generation, i, j, i_0, j_1, _T];
	yield* g.srcCall(f, "initialize");
	generation = null;
	generation = 0;
	while (rt.lt(live(generation), rt.sv(f, "iterations"))) {
		i = null;
		i = 1;
		while (rt.le(live(i), rt.sv(f, "width"))) {
			j = null;
			j = 1;
			while (rt.le(live(j), rt.sv(f, "height"))) {
				rt.setAt(rt.index(rt.sv(f, "current_state"), live(i)), live(j), (yield* g.srcCall(f, "apply_rule", live(i), live(j))));
				j = rt.inc(live(j), 1);
				yield* g.call(f, P("/proc/sleep"), null, [-1]);
			}
			i = rt.inc(live(i), 1);
			yield* g.call(f, P("/proc/sleep"), null, [-1]);
		}
		rt.setSv(f, "old_state", (yield* g.callName(f, rt.sv(f, "current_state"), "Copy", [])));
		generation = rt.inc(live(generation), 1);
		yield* g.call(f, P("/proc/sleep"), null, [-1]);
	}
	i_0 = null;
	i_0 = 1;
	while (rt.le(live(i_0), rt.sv(f, "width"))) {
		j_1 = null;
		j_1 = 1;
		while (rt.le(live(j_1), rt.sv(f, "height"))) {
			if (truthy((_T = rt.locate(subtract(add(rt.fv(f, "x", rt.sv(f, "start")), live(i_0)), 1), subtract(add(rt.fv(f, "y", rt.sv(f, "start")), live(j_1)), 1), rt.fv(f, "z", rt.sv(f, "start")))))) {
				yield* g.callName(f, live(_T), "ChangeTurf", [rt.index(rt.sv(f, "type_map"), add(rt.index(rt.index(rt.sv(f, "current_state"), live(i_0)), live(j_1)), 1))]);
			}
			j_1 = rt.inc(live(j_1), 1);
			yield* g.call(f, P("/proc/sleep"), null, [-1]);
		}
		i_0 = rt.inc(live(i_0), 1);
		yield* g.call(f, P("/proc/sleep"), null, [-1]);
	}
	return f.dot;
}, true);

// /datum/mapGenerator/ca/proc/apply_rule  (code/modules/procedural_mapping/mapGenerators/cellular.dm:62)
rt.def("/datum/mapGenerator/ca/proc/apply_rule", function apply_rule(f: Frame, i: Value, j: Value) {
	let value: Value = null, dx: Value = null, dy: Value = null, n_x: Value = null, n_y: Value = null;
	f.vars = () => [value, dx, dy, n_x, n_y];
	value = 0;
	dx = null;
	dx = -1;
	while (rt.le(live(dx), 1)) {
		dy = null;
		dy = -1;
		while (rt.le(live(dy), 1)) {
			n_x = add(live(i), live(dx));
			n_y = add(live(j), live(dy));
			blk65: {
				if ((((rt.lt(live(n_x), 1) || rt.gt(live(n_x), rt.sv(f, "width"))) || rt.lt(live(n_y), 1)) || rt.gt(live(n_y), rt.sv(f, "height")))) {
					if (truthy(rt.sv(f, "loop_edges"))) {
						if (rt.lt(live(n_x), 1)) {
							n_x = rt.sv(f, "width");
						} else {
							if (rt.gt(live(n_x), rt.sv(f, "width"))) {
								n_x = 1;
							}
						}
						if (rt.lt(live(n_y), 1)) {
							n_y = rt.sv(f, "height");
						} else {
							if (rt.gt(live(n_y), rt.sv(f, "height"))) {
								n_y = 1;
							}
						}
					} else {
						value = rt.modify(live(value), rt.sv(f, "edge_value"), add);
						break blk65;
					}
				}
				value = rt.modify(live(value), rt.index(rt.index(rt.sv(f, "old_state"), live(n_x)), live(n_y)), add);
			}
			dy = rt.inc(live(dy), 1);
		}
		dx = rt.inc(live(dx), 1);
	}
	(value = rt.modify(live(value), rt.index(rt.index(rt.sv(f, "old_state"), live(i)), live(j)), subtract));
	if (truthy((rt.isIn(f, live(value), rt.sv(f, "b_rule")) ? 1 : 0))) {
		return 1;
	}
	if (truthy((rt.isIn(f, live(value), rt.sv(f, "s_rule")) ? 1 : 0))) {
		return rt.index(rt.index(rt.sv(f, "old_state"), live(i)), live(j));
	}
	return 0;
});

rt.type(1877, "/datum/mapGenerator/ca/caves", "/datum/mapGenerator/ca", {
	b_rule: null,
	s_rule: null,
	iterations: 5,
	type_map: null,
});

// /datum/mapGenerator/ca/caves/proc/<init>  (code/modules/procedural_mapping/mapGenerators/cellular.dm:90)
rt.def("/datum/mapGenerator/ca/caves/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "b_rule", rt.list(5, 6, 7, 8));
	$0 = $0;
	rt.setSv(f, "s_rule", rt.list(4));
	$0 = $0;
	rt.setSv(f, "type_map", rt.list(T("/turf/open/floor/plating/asteroid/basalt"), T("/turf/closed/mineral/volcanic")));
	return f.dot;
});

rt.type(1878, "/datum/mapGenerator/ca/maze", "/datum/mapGenerator/ca", {
	b_rule: null,
	s_rule: null,
	iterations: 20,
	edge_value: 0,
});

// /datum/mapGenerator/ca/maze/proc/<init>  (code/modules/procedural_mapping/mapGenerators/cellular.dm:95)
rt.def("/datum/mapGenerator/ca/maze/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "b_rule", rt.list(3));
	rt.setSv(f, "s_rule", rt.list(1, 2, 3, 4, 5));
	return f.dot;
});
