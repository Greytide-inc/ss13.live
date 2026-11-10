// Based on /tg/station's code/modules/procedural_mapping/mapGenerators/cellular.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// cellular.dm:6
rt.def("/datum/mapGenerator/ca/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.b_rule = list();

	this.s_rule = list();

	this.type_map = list(T("/turf/open/floor/plating"), T("/turf/closed/wall"));
	return f.dot;
});

// cellular.dm:19
rt.def("/datum/mapGenerator/ca/proc/defineRegion", function defineRegion(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = parent_proc();
	let min_x: Value = min(f.args[0].x, f.args[1].x);
	let max_x: Value = max(f.args[0].x, f.args[1].x);
	let min_y: Value = min(f.args[0].y, f.args[1].y);
	let max_y: Value = max(f.args[0].y, f.args[1].y);
	this.width = max_x - min_x;
	this.height = max_y - min_y;
	this.start = rt.locate(min_x, min_y, f.args[0].z);
	return f.dot;
}, false, { args: ["Start", "End", "replace"] });

// cellular.dm:32
rt.def("/datum/mapGenerator/ca/proc/initialize", function initialize(f: Frame) {
	let j: Value = null;
	this.old_state = new_(T("/list"), this.width);
	let i: Value = 1;
	while (i <= this.width) {
		rt.setAt(this.old_state, i, new_(T("/list"), this.height));
		j = 1;
		while (j <= this.height) {
			rt.setAt(rt.index(this.old_state, i), j, rand(0, 1));
			j++;
		}
		i++;
	}
	this.current_state = this.old_state.Copy();
	return f.dot;
});

// cellular.dm:45
rt.def("/datum/mapGenerator/ca/proc/generate", function* generate(f: Frame) {
	let i: Value = null, j: Value = null, j_1: Value = null, _T: Value = null;
	this.initialize();
	let generation: Value = 0;
	while (generation < this.iterations) {
		i = 1;
		while (i <= this.width) {
			j = 1;
			while (j <= this.height) {
				rt.setAt(rt.index(this.current_state, i), j, this.apply_rule(i, j));
				j++;
				yield* sleep(-1);
			}
			i++;
			yield* sleep(-1);
		}
		this.old_state = (yield* this.current_state.Copy());
		generation++;
		yield* sleep(-1);
	}
	let i_0: Value = 1;
	while (i_0 <= this.width) {
		j_1 = 1;
		while (j_1 <= this.height) {
			if (_T = rt.locate(this.start.x + i_0 - 1, this.start.y + j_1 - 1, this.start.z)) {
				yield* _T.ChangeTurf(rt.index(this.type_map, rt.index(rt.index(this.current_state, i_0), j_1) + 1));
			}
			j_1++;
			yield* sleep(-1);
		}
		i_0++;
		yield* sleep(-1);
	}
	return f.dot;
}, true);

// cellular.dm:62
rt.def("/datum/mapGenerator/ca/proc/apply_rule", function apply_rule(f: Frame, i: Value, j: Value) {
	let dy: Value = null, n_x: Value = null, n_y: Value = null;
	let value: Value = 0;
	let dx: Value = -1;
	while (dx <= 1) {
		dy = -1;
		while (dy <= 1) {
			n_x = i + dx;
			n_y = j + dy;
			blk65: {
				if (n_x < 1 || n_x > this.width || n_y < 1 || n_y > this.height) {
					if (this.loop_edges) {
						if (n_x < 1) {
							n_x = this.width;
						} else if (n_x > this.width) {
							n_x = 1;
						}
						if (n_y < 1) {
							n_y = this.height;
						} else if (n_y > this.height) {
							n_y = 1;
						}
					} else {
						value += this.edge_value;
						break blk65;
					}
				}
				value += rt.index(rt.index(this.old_state, n_x), n_y);
			}
			dy++;
		}
		dx++;
	}
	value -= rt.index(rt.index(this.old_state, i), j);
	if (rt.isIn(f, value, this.b_rule)) {
		return 1;
	}
	if (rt.isIn(f, value, this.s_rule)) {
		return rt.index(rt.index(this.old_state, i), j);
	}
	return 0;
});

rt.type(1877, "/datum/mapGenerator/ca/caves", "/datum/mapGenerator/ca", {
	b_rule: null,
	s_rule: null,
	iterations: 5,
	type_map: null,
});

// cellular.dm:90
rt.def("/datum/mapGenerator/ca/caves/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.b_rule = list(5, 6, 7, 8);

	this.s_rule = list(4);

	this.type_map = list(T("/turf/open/floor/plating/asteroid/basalt"), T("/turf/closed/mineral/volcanic"));
	return f.dot;
});

rt.type(1878, "/datum/mapGenerator/ca/maze", "/datum/mapGenerator/ca", {
	b_rule: null,
	s_rule: null,
	iterations: 20,
	edge_value: 0,
});

// cellular.dm:95
rt.def("/datum/mapGenerator/ca/maze/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.b_rule = list(3);
	this.s_rule = list(1, 2, 3, 4, 5);
	return f.dot;
});
