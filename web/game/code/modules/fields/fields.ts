// From code/modules/fields/fields.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/make_field  (code/modules/fields/fields.dm:13)  may sleep
rt.def("/proc/make_field", function* make_field(f: Frame, field_type: Value, field_params: Value, override_checks: Value, start_field: Value) {
	let F: Value = null;
	f.vars = () => [field_type, field_params, override_checks, start_field, F];
	if (live(override_checks) === null) {
		override_checks = 0;
	}
	if (live(start_field) === null) {
		start_field = 1;
	}
	if ((!truthy((yield* g.callName(f, (F = (yield* g.new_(f, live(field_type), []))), "assume_params", [live(field_params)]))) && !truthy(live(override_checks)))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(F)]);
		F = null;
	}
	if ((!truthy((yield* g.callName(f, live(F), "check_variables", []))) && !truthy(live(override_checks)))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(F)]);
		F = null;
	}
	if ((truthy(live(start_field)) && (truthy(live(F)) || truthy(live(override_checks))))) {
		yield* g.callName(f, live(F), "Initialize", []);
	}
	return live(F);
}, true);

rt.type(1507, "/datum/proximity_monitor/advanced", "/datum/proximity_monitor", {
	name: "１Energy Field",
	field_shape: 0,
	square_height: 0,
	square_width: 0,
	square_depth_up: 0,
	square_depth_down: 0,
	process_inner_turfs: 0,
	process_edge_turfs: 0,
	setup_edge_turfs: 0,
	setup_field_turfs: 0,
	use_host_turf: 0,
	field_turfs: null,
	edge_turfs: null,
	field_turfs_new: null,
	edge_turfs_new: null,
});

// /datum/proximity_monitor/advanced/proc/<init>  (code/modules/fields/fields.dm:37)
rt.def("/datum/proximity_monitor/advanced/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "field_turfs", rt.list());
	$0 = $0;
	rt.setSv(f, "edge_turfs", rt.list());
	$0 = $0;
	rt.setSv(f, "field_turfs_new", rt.list());
	$0 = $0;
	rt.setSv(f, "edge_turfs_new", rt.list());
	return f.dot;
});

// /datum/proximity_monitor/advanced/proc/Destroy  (code/modules/fields/fields.dm:43)  may sleep
rt.def("/datum/proximity_monitor/advanced/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "full_cleanup");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/proximity_monitor/advanced/proc/assume_params  (code/modules/fields/fields.dm:48)
rt.def("/datum/proximity_monitor/advanced/proc/assume_params", function assume_params(f: Frame, field_params: Value) {
	let pass_check: Value = null, param: Value = null;
	let $e: any;
	f.vars = () => [pass_check, param, $e];
	pass_check = 1;
	param = null;
	rt.forList(f, 0, live(field_params));
	while (($e = rt.next(f, 0)) !== undefined) {
		param = $e;
		if (((truthy(rt.index(rt.sv(f, "vars"), live(param))) || rt.index(rt.sv(f, "vars"), live(param)) === null) || truthy((rt.isIn(f, live(param), rt.sv(f, "vars")) ? 1 : 0)))) {
			rt.setAt(rt.sv(f, "vars"), live(param), rt.index(live(field_params), live(param)));
		} else {
			pass_check = 0;
		}
	}
	rt.endFor(f, 0);
	return live(pass_check);
});

// /datum/proximity_monitor/advanced/proc/check_variables  (code/modules/fields/fields.dm:57)
rt.def("/datum/proximity_monitor/advanced/proc/check_variables", function check_variables(f: Frame) {
	let pass: Value = null;
	f.vars = () => [pass];
	pass = 1;
	if (isEqual(rt.sv(f, "field_shape"), 0)) {
		pass = 0;
	}
	if (((((rt.lt(rt.sv(f, "current_range"), 0) || rt.lt(rt.sv(f, "square_height"), 0)) || rt.lt(rt.sv(f, "square_width"), 0)) || rt.lt(rt.sv(f, "square_depth_up"), 0)) || rt.lt(rt.sv(f, "square_depth_down"), 0))) {
		pass = 0;
	}
	if (!truthy((rt.istype(rt.sv(f, "host"), T("/atom")) ? 1 : 0))) {
		pass = 0;
	}
	return live(pass);
});

// /datum/proximity_monitor/advanced/proc/process  (code/modules/fields/fields.dm:67)  may sleep
rt.def("/datum/proximity_monitor/advanced/proc/process", function* process(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	if (truthy(rt.sv(f, "process_inner_turfs"))) {
		_T = null;
		rt.forList(f, 0, rt.sv(f, "field_turfs"), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			yield* g.srcCall(f, "process_inner_turf", live(_T));
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.sv(f, "process_edge_turfs"))) return f.dot;
	_T = null;
	rt.forList(f, 0, rt.sv(f, "edge_turfs"), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.srcCall(f, "process_edge_turf", live(_T));
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /datum/proximity_monitor/advanced/proc/Initialize  (code/modules/fields/fields.dm:80)  may sleep
rt.def("/datum/proximity_monitor/advanced/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.srcCall(f, "setup_field");
	yield* g.srcCall(f, "post_setup_field");
	return f.dot;
}, true);

// /datum/proximity_monitor/advanced/proc/full_cleanup  (code/modules/fields/fields.dm:84)  may sleep
rt.def("/datum/proximity_monitor/advanced/proc/full_cleanup", function* full_cleanup(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	_T = null;
	rt.forList(f, 0, rt.sv(f, "edge_turfs"), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.srcCall(f, "cleanup_edge_turf", live(_T));
	}
	rt.endFor(f, 0);
	_T = null;
	rt.forList(f, 0, rt.sv(f, "field_turfs"), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.srcCall(f, "cleanup_field_turf", live(_T));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/proximity_monitor/advanced/proc/check_movement  (code/modules/fields/fields.dm:90)
rt.def("/datum/proximity_monitor/advanced/proc/check_movement", function check_movement(f: Frame) {
	if (!truthy(rt.sv(f, "use_host_turf"))) {
		if (!isEqual(rt.fv(f, "loc", rt.sv(f, "host")), rt.sv(f, "last_host_loc"))) {
			rt.setSv(f, "last_host_loc", rt.fv(f, "loc", rt.sv(f, "host")));
			return 1;
		}
	} else {
		if (!isEqual(rt.getStep(f, rt.sv(f, "host"), 0), rt.sv(f, "last_host_loc"))) {
			rt.setSv(f, "last_host_loc", rt.getStep(f, rt.sv(f, "host"), 0));
			return 1;
		}
	}
	return 0;
});

// /datum/proximity_monitor/advanced/proc/recalculate_field  (code/modules/fields/fields.dm:101)  may sleep
rt.def("/datum/proximity_monitor/advanced/proc/recalculate_field", function* recalculate_field(f: Frame, ignore_movement_check: Value) {
	let needs_setup: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [ignore_movement_check, needs_setup, _T, $e];
	if (live(ignore_movement_check) === null) {
		ignore_movement_check = 0;
	}
	if ((!(truthy(live(ignore_movement_check)) || truthy((yield* g.srcCall(f, "check_movement")))) && !isEqual(rt.sv(f, "field_shape"), 0))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "update_new_turfs");
	needs_setup = (yield* g.callName(f, rt.sv(f, "field_turfs_new"), "Copy", []));
	if (truthy(rt.sv(f, "setup_field_turfs"))) {
		_T = null;
		rt.forList(f, 0, rt.sv(f, "field_turfs"), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			if (!truthy((rt.isIn(f, live(_T), live(needs_setup)) ? 1 : 0))) {
				yield* g.srcCall(f, "cleanup_field_turf", live(_T));
			} else {
				(needs_setup = rt.modify(live(needs_setup), live(_T), subtract));
			}
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		rt.endFor(f, 0);
		_T = null;
		rt.forList(f, 0, live(needs_setup), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			yield* g.srcCall(f, "setup_field_turf", live(_T));
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.sv(f, "setup_edge_turfs"))) return f.dot;
	_T = null;
	rt.forList(f, 0, rt.sv(f, "edge_turfs"), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.srcCall(f, "cleanup_edge_turf", live(_T));
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	_T = null;
	rt.forList(f, 0, rt.sv(f, "edge_turfs_new"), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.srcCall(f, "setup_edge_turf", live(_T));
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/proximity_monitor/advanced/proc/HandleMove  (code/modules/fields/fields.dm:148)  may sleep
rt.def("/datum/proximity_monitor/advanced/proc/HandleMove", function* HandleMove(f: Frame) {
	let _host: Value = null, new_host_loc: Value = null;
	f.vars = () => [_host, new_host_loc];
	_host = rt.sv(f, "host");
	new_host_loc = rt.fv(f, "loc", live(_host));
	if (isEqual(rt.sv(f, "last_host_loc"), live(new_host_loc))) return f.dot;
	yield* g.srcCall(f, "recalculate_field");
	return f.dot;
}, true);

// /datum/proximity_monitor/advanced/proc/setup_field  (code/modules/fields/fields.dm:156)  may sleep
rt.def("/datum/proximity_monitor/advanced/proc/setup_field", function* setup_field(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	yield* g.srcCall(f, "update_new_turfs");
	if (truthy(rt.sv(f, "setup_field_turfs"))) {
		_T = null;
		rt.forList(f, 0, rt.sv(f, "field_turfs_new"), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			yield* g.srcCall(f, "setup_field_turf", live(_T));
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.sv(f, "setup_edge_turfs"))) return f.dot;
	_T = null;
	rt.forList(f, 0, rt.sv(f, "edge_turfs_new"), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.srcCall(f, "setup_edge_turf", live(_T));
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/proximity_monitor/advanced/proc/cleanup_field_turf  (code/modules/fields/fields.dm:167)  may sleep
rt.def("/datum/proximity_monitor/advanced/proc/cleanup_field_turf", function* cleanup_field_turf(f: Frame, _T: Value) {
	f.vars = () => [_T];
	yield* g.call(f, P("/proc/qdel"), null, [rt.index(rt.sv(f, "field_turfs"), live(_T))]);
	(rt.modSrcVar(f, "field_turfs", live(_T), subtract));
	return f.dot;
}, true);

// /datum/proximity_monitor/advanced/proc/cleanup_edge_turf  (code/modules/fields/fields.dm:171)  may sleep
rt.def("/datum/proximity_monitor/advanced/proc/cleanup_edge_turf", function* cleanup_edge_turf(f: Frame, _T: Value) {
	f.vars = () => [_T];
	yield* g.call(f, P("/proc/qdel"), null, [rt.index(rt.sv(f, "edge_turfs"), live(_T))]);
	(rt.modSrcVar(f, "edge_turfs", live(_T), subtract));
	return f.dot;
}, true);

// /datum/proximity_monitor/advanced/proc/setup_field_turf  (code/modules/fields/fields.dm:175)  may sleep
rt.def("/datum/proximity_monitor/advanced/proc/setup_field_turf", function* setup_field_turf(f: Frame, _T: Value) {
	f.vars = () => [_T];
	rt.setAt(rt.sv(f, "field_turfs"), live(_T), (yield* g.new_(f, T("/obj/effect/abstract/proximity_checker/advanced/field_turf"), [live(_T), live(f.src)])));
	return f.dot;
}, true);

// /datum/proximity_monitor/advanced/proc/setup_edge_turf  (code/modules/fields/fields.dm:178)  may sleep
rt.def("/datum/proximity_monitor/advanced/proc/setup_edge_turf", function* setup_edge_turf(f: Frame, _T: Value) {
	f.vars = () => [_T];
	rt.setAt(rt.sv(f, "edge_turfs"), live(_T), (yield* g.new_(f, T("/obj/effect/abstract/proximity_checker/advanced/field_edge"), [live(_T), live(f.src)])));
	return f.dot;
}, true);

// /datum/proximity_monitor/advanced/proc/update_new_turfs  (code/modules/fields/fields.dm:181)
rt.def("/datum/proximity_monitor/advanced/proc/update_new_turfs", function update_new_turfs(f: Frame) {
	let center: Value = null, _T: Value = null, center_turfs: Value = null, _T_2: Value = null;
	let $0: any, $e: any;
	f.vars = () => [center, _T, center_turfs, _T_2, $0, $e];
	if (!truthy((rt.istype(rt.sv(f, "host"), T("/atom")) ? 1 : 0))) {
		return 0;
	}
	center = rt.getStep(f, rt.sv(f, "host"), 0);
	rt.setSv(f, "field_turfs_new", rt.list());
	rt.setSv(f, "edge_turfs_new", rt.list());
	$0 = rt.sv(f, "field_shape");
	if ($0 === 0) {
		return 0;
	} else if ($0 === 1) {
		_T = null;
		rt.forList(f, 0, rt.call(f, P("/proc/block"), null, [rt.locate(subtract(rt.fv(f, "x", live(center)), rt.sv(f, "current_range")), subtract(rt.fv(f, "y", live(center)), rt.sv(f, "current_range")), subtract(rt.fv(f, "z", live(center)), rt.sv(f, "square_depth_down"))), rt.locate(add(rt.fv(f, "x", live(center)), rt.sv(f, "current_range")), add(rt.fv(f, "y", live(center)), rt.sv(f, "current_range")), add(rt.fv(f, "z", live(center)), rt.sv(f, "square_depth_up")))]), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			rt.modSrcVar(f, "field_turfs_new", live(_T), add);
		}
		rt.endFor(f, 0);
		rt.setSv(f, "edge_turfs_new", rt.callName(f, rt.sv(f, "field_turfs_new"), "Copy", []));
		if (rt.ge(rt.sv(f, "current_range"), 1)) {
			center_turfs = rt.list();
			_T_2 = null;
			rt.forList(f, 0, rt.call(f, P("/proc/block"), null, [rt.locate(add(subtract(rt.fv(f, "x", live(center)), rt.sv(f, "current_range")), 1), add(subtract(rt.fv(f, "y", live(center)), rt.sv(f, "current_range")), 1), subtract(rt.fv(f, "z", live(center)), rt.sv(f, "square_depth_down"))), rt.locate(subtract(add(rt.fv(f, "x", live(center)), rt.sv(f, "current_range")), 1), subtract(add(rt.fv(f, "y", live(center)), rt.sv(f, "current_range")), 1), add(rt.fv(f, "z", live(center)), rt.sv(f, "square_depth_up")))]), T("/turf"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T_2 = $e;
				center_turfs = rt.modify(live(center_turfs), live(_T_2), add);
			}
			rt.endFor(f, 0);
			_T_2 = null;
			rt.forList(f, 0, live(center_turfs), T("/turf"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T_2 = $e;
				(rt.modSrcVar(f, "edge_turfs_new", live(_T_2), subtract));
			}
			rt.endFor(f, 0);
		}
	} else if ($0 === 2) {
		_T = null;
		rt.forList(f, 0, rt.call(f, P("/proc/block"), null, [rt.locate(subtract(rt.fv(f, "x", live(center)), rt.sv(f, "square_width")), subtract(rt.fv(f, "y", live(center)), rt.sv(f, "square_height")), subtract(rt.fv(f, "z", live(center)), rt.sv(f, "square_depth_down"))), rt.locate(add(rt.fv(f, "x", live(center)), rt.sv(f, "square_width")), add(rt.fv(f, "y", live(center)), rt.sv(f, "square_height")), add(rt.fv(f, "z", live(center)), rt.sv(f, "square_depth_up")))]), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			rt.modSrcVar(f, "field_turfs_new", live(_T), add);
		}
		rt.endFor(f, 0);
		rt.setSv(f, "edge_turfs_new", rt.callName(f, rt.sv(f, "field_turfs_new"), "Copy", []));
		if (!(rt.ge(rt.sv(f, "square_height"), 1) && rt.ge(rt.sv(f, "square_width"), 1))) return f.dot;
		center_turfs = rt.list();
		_T_2 = null;
		rt.forList(f, 0, rt.call(f, P("/proc/block"), null, [rt.locate(add(subtract(rt.fv(f, "x", live(center)), rt.sv(f, "square_width")), 1), add(subtract(rt.fv(f, "y", live(center)), rt.sv(f, "square_height")), 1), subtract(rt.fv(f, "z", live(center)), rt.sv(f, "square_depth_down"))), rt.locate(subtract(add(rt.fv(f, "x", live(center)), rt.sv(f, "square_width")), 1), subtract(add(rt.fv(f, "y", live(center)), rt.sv(f, "square_height")), 1), add(rt.fv(f, "z", live(center)), rt.sv(f, "square_depth_up")))]), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T_2 = $e;
			center_turfs = rt.modify(live(center_turfs), live(_T_2), add);
		}
		rt.endFor(f, 0);
		_T_2 = null;
		rt.forList(f, 0, live(center_turfs), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T_2 = $e;
			(rt.modSrcVar(f, "edge_turfs_new", live(_T_2), subtract));
		}
		rt.endFor(f, 0);
	}
	return f.dot;
});

// /datum/proximity_monitor/advanced/proc/get_edgeturf_direction  (code/modules/fields/fields.dm:212)
rt.def("/datum/proximity_monitor/advanced/proc/get_edgeturf_direction", function get_edgeturf_direction(f: Frame, _T: Value, center_override: Value) {
	let checking_from: Value = null;
	let $0: any;
	f.vars = () => [center_override, checking_from, $0];
	if (live(center_override) === null) {
		center_override = null;
	}
	checking_from = rt.getStep(f, rt.sv(f, "host"), 0);
	if (truthy((rt.istype(live(center_override), T("/turf")) ? 1 : 0))) {
		checking_from = live(center_override);
	}
	if ((!isEqual(rt.sv(f, "field_shape"), 1) && !isEqual(rt.sv(f, "field_shape"), 2))) {
		return live(f.dot);
	}
	if (!truthy((rt.isIn(f, live(_T), rt.sv(f, "edge_turfs")) ? 1 : 0))) {
		return live(f.dot);
	}
	$0 = rt.sv(f, "field_shape");
	if ($0 === 1) {
		if (((isEqual(rt.fv(f, "x", live(_T)), add(rt.fv(f, "x", live(checking_from)), rt.sv(f, "current_range"))) || isEqual(rt.fv(f, "x", live(_T)), subtract(rt.fv(f, "x", live(checking_from)), rt.sv(f, "current_range")))) && (isEqual(rt.fv(f, "y", live(_T)), add(rt.fv(f, "y", live(checking_from)), rt.sv(f, "current_range"))) || isEqual(rt.fv(f, "y", live(_T)), subtract(rt.fv(f, "y", live(checking_from)), rt.sv(f, "current_range")))))) {
			return rt.getDir(f, live(checking_from), live(_T));
		}
		if (isEqual(rt.fv(f, "x", live(_T)), add(rt.fv(f, "x", live(checking_from)), rt.sv(f, "current_range")))) {
			return 4;
		}
		if (isEqual(rt.fv(f, "x", live(_T)), subtract(rt.fv(f, "x", live(checking_from)), rt.sv(f, "current_range")))) {
			return 8;
		}
		if (isEqual(rt.fv(f, "y", live(_T)), subtract(rt.fv(f, "y", live(checking_from)), rt.sv(f, "current_range")))) {
			return 2;
		}
		if (isEqual(rt.fv(f, "y", live(_T)), add(rt.fv(f, "y", live(checking_from)), rt.sv(f, "current_range")))) {
			return 1;
		}
	} else if ($0 === 2) {
		if (((isEqual(rt.fv(f, "x", live(_T)), add(rt.fv(f, "x", live(checking_from)), rt.sv(f, "square_width"))) || isEqual(rt.fv(f, "x", live(_T)), subtract(rt.fv(f, "x", live(checking_from)), rt.sv(f, "square_width")))) && (isEqual(rt.fv(f, "y", live(_T)), add(rt.fv(f, "y", live(checking_from)), rt.sv(f, "square_height"))) || isEqual(rt.fv(f, "y", live(_T)), subtract(rt.fv(f, "y", live(checking_from)), rt.sv(f, "square_height")))))) {
			return rt.getDir(f, live(checking_from), live(_T));
		}
		if (isEqual(rt.fv(f, "x", live(_T)), add(rt.fv(f, "x", live(checking_from)), rt.sv(f, "square_width")))) {
			return 4;
		}
		if (isEqual(rt.fv(f, "x", live(_T)), subtract(rt.fv(f, "x", live(checking_from)), rt.sv(f, "square_width")))) {
			return 8;
		}
		if (isEqual(rt.fv(f, "y", live(_T)), subtract(rt.fv(f, "y", live(checking_from)), rt.sv(f, "square_height")))) {
			return 2;
		}
		if (!isEqual(rt.fv(f, "y", live(_T)), add(rt.fv(f, "y", live(checking_from)), rt.sv(f, "square_height")))) return f.dot;
		return 1;
	}
	return f.dot;
});

rt.type(1508, "/datum/proximity_monitor/advanced/debug", "/datum/proximity_monitor/advanced", {
	set_fieldturf_color: "#aaffff",
	set_edgeturf_color: "#ffaaff",
	name: "１Color Matrix Field",
	field_shape: 1,
	current_range: 5,
	setup_field_turfs: 1,
	setup_edge_turfs: 1,
});

// /datum/proximity_monitor/advanced/debug/proc/recalculate_field  (code/modules/fields/fields.dm:254)  may sleep
rt.def("/datum/proximity_monitor/advanced/debug/proc/recalculate_field", function* recalculate_field(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/proximity_monitor/advanced/debug/proc/post_setup_field  (code/modules/fields/fields.dm:257)
rt.def("/datum/proximity_monitor/advanced/debug/proc/post_setup_field", function post_setup_field(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /datum/proximity_monitor/advanced/debug/proc/setup_edge_turf  (code/modules/fields/fields.dm:261)  may sleep
rt.def("/datum/proximity_monitor/advanced/debug/proc/setup_edge_turf", function* setup_edge_turf(f: Frame) {
	rt.setFv(f, "color", live(f.args[0]), rt.sv(f, "set_edgeturf_color"));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["T"] });

// /datum/proximity_monitor/advanced/debug/proc/cleanup_edge_turf  (code/modules/fields/fields.dm:264)  may sleep
rt.def("/datum/proximity_monitor/advanced/debug/proc/cleanup_edge_turf", function* cleanup_edge_turf(f: Frame) {
	rt.setFv(f, "color", live(f.args[0]), rt.initial(f, live(f.args[0]), "color"));
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.isIn(f, live(f.args[0]), rt.sv(f, "field_turfs")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "color", live(f.args[0]), rt.sv(f, "set_fieldturf_color"));
	return f.dot;
}, true, { args: ["T"] });

// /datum/proximity_monitor/advanced/debug/proc/setup_field_turf  (code/modules/fields/fields.dm:271)  may sleep
rt.def("/datum/proximity_monitor/advanced/debug/proc/setup_field_turf", function* setup_field_turf(f: Frame) {
	rt.setFv(f, "color", live(f.args[0]), rt.sv(f, "set_fieldturf_color"));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["T"] });

// /datum/proximity_monitor/advanced/debug/proc/cleanup_field_turf  (code/modules/fields/fields.dm:274)  may sleep
rt.def("/datum/proximity_monitor/advanced/debug/proc/cleanup_field_turf", function* cleanup_field_turf(f: Frame) {
	rt.setFv(f, "color", live(f.args[0]), rt.initial(f, live(f.args[0]), "color"));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["T"] });

rt.type(9273, "/obj/item/device/multitool/field_debug", "/obj/item/device/multitool", {
	field_params: null,
	field_type: rt.typePath("/datum/proximity_monitor/advanced/debug"),
	operating: 0,
	current: null,
	name: "strange multitool",
	desc: "Seems to project a colored field!",
});

// /obj/item/device/multitool/field_debug/proc/<init>  (code/modules/fields/fields.dm:281)
rt.def("/obj/item/device/multitool/field_debug/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "field_params", rt.alist(f, ["field_shape", 1, "current_range", 5, "set_fieldturf_color", "#aaffff", "set_edgeturf_color", "#ffaaff"]));
	return f.dot;
});

// /obj/item/device/multitool/field_debug/proc/New  (code/modules/fields/fields.dm:287)  may sleep
rt.def("/obj/item/device/multitool/field_debug/proc/New", function* New(f: Frame) {
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/device/multitool/field_debug/proc/Destroy  (code/modules/fields/fields.dm:291)  may sleep
rt.def("/obj/item/device/multitool/field_debug/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "current")]);
	rt.setSv(f, "current", null);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/device/multitool/field_debug/proc/setup_debug_field  (code/modules/fields/fields.dm:296)  may sleep
rt.def("/obj/item/device/multitool/field_debug/proc/setup_debug_field", function* setup_debug_field(f: Frame) {
	let new_params: Value = null;
	f.vars = () => [new_params];
	rt.setAt((new_params = (yield* g.callName(f, rt.sv(f, "field_params"), "Copy", []))), "host", live(f.src));
	rt.setSv(f, "current", (yield* g.call(f, P("/proc/make_field"), null, [rt.sv(f, "field_type"), live(new_params)])));
	return f.dot;
}, true);

// /obj/item/device/multitool/field_debug/proc/attack_self  (code/modules/fields/fields.dm:301)  may sleep
rt.def("/obj/item/device/multitool/field_debug/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [user, $0, $1, $2];
	rt.setSv(f, "operating", (!truthy(rt.sv(f, "operating")) ? 1 : 0));
	$0 = live(user);
	$1 = live(f.src);
	if (truthy(rt.sv(f, "operating"))) {
		$1 = $1;
		$2 = "on";
	} else {
		$2 = "off";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("You turn the ＀ ＀.", [$1, $2])]);
	if ((!truthy((rt.istype(rt.sv(f, "current"), T("/datum/proximity_monitor/advanced")) ? 1 : 0)) && truthy(rt.sv(f, "operating")))) {
		yield* g.srcCall(f, "setup_debug_field");
	} else {
		if (truthy(rt.sv(f, "operating"))) return f.dot;
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "current")]);
		rt.setSv(f, "current", null);
	}
	return f.dot;
}, true);

// /obj/item/device/multitool/field_debug/proc/on_mob_move  (code/modules/fields/fields.dm:309)  may sleep
rt.def("/obj/item/device/multitool/field_debug/proc/on_mob_move", function* on_mob_move(f: Frame) {
	yield* g.srcCall(f, "check_turf", rt.getStep(f, live(f.src), 0));
	return f.dot;
}, true);

// /obj/item/device/multitool/field_debug/proc/process  (code/modules/fields/fields.dm:312)  may sleep
rt.def("/obj/item/device/multitool/field_debug/proc/process", function* process(f: Frame) {
	yield* g.srcCall(f, "check_turf", rt.getStep(f, live(f.src), 0));
	return f.dot;
}, true, { waitfor: false });

// /obj/item/device/multitool/field_debug/proc/check_turf  (code/modules/fields/fields.dm:315)  may sleep
rt.def("/obj/item/device/multitool/field_debug/proc/check_turf", function* check_turf(f: Frame, _T: Value) {
	f.vars = () => [_T];
	yield* g.callName(f, rt.sv(f, "current"), "HandleMove", []);
	return f.dot;
}, true);
