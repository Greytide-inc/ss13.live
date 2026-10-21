// From code/modules/shuttle/shuttle.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13043, "/obj/docking_port", "/obj", {
	id: null,
	width: 0,
	height: 0,
	dwidth: 0,
	dheight: 0,
	resistance_flags: 115,
	anchored: 1,
	invisibility: 101,
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "pinonfar",
	dir: 1,
});

// /obj/docking_port/proc/Destroy  (code/modules/shuttle/shuttle.dm:29)  may sleep
rt.def("/obj/docking_port/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(live(f.args[0]))) {
		yield* g.callSuper(f, [], rt.Args.Same);
		f.dot = 4;
	} else {
		return 1;
	}
	return f.dot;
}, true, { args: ["force"] });

// /obj/docking_port/proc/return_coords  (code/modules/shuttle/shuttle.dm:46)
rt.def("/obj/docking_port/proc/return_coords", function return_coords(f: Frame, _x: Value, _y: Value, _dir: Value) {
	let cos: Value = null, sin: Value = null;
	let $0: any;
	f.vars = () => [_x, _y, _dir, cos, sin, $0];
	if (live(_dir) === null) {
		_dir = rt.sv(f, "dir");
	}
	if (live(_x) === null) {
		_x = rt.sv(f, "x");
	}
	if (live(_y) === null) {
		_y = rt.sv(f, "y");
	}
	cos = 1;
	sin = 0;
	$0 = live(_dir);
	if ($0 === 8) {
		cos = 0;
		sin = 1;
	} else if ($0 === 2) {
		cos = -1;
		sin = 0;
	} else if ($0 === 4) {
		cos = 0;
		sin = -1;
	}
	return rt.list(subtract(add(live(_x), multiply(rt.neg(rt.sv(f, "dwidth")), live(cos))), multiply(rt.neg(rt.sv(f, "dheight")), live(sin))), add(add(live(_y), multiply(rt.neg(rt.sv(f, "dwidth")), live(sin))), multiply(rt.neg(rt.sv(f, "dheight")), live(cos))), subtract(add(live(_x), multiply(subtract(add(rt.neg(rt.sv(f, "dwidth")), rt.sv(f, "width")), 1), live(cos))), multiply(subtract(add(rt.neg(rt.sv(f, "dheight")), rt.sv(f, "height")), 1), live(sin))), add(add(live(_y), multiply(subtract(add(rt.neg(rt.sv(f, "dwidth")), rt.sv(f, "width")), 1), live(sin))), multiply(subtract(add(rt.neg(rt.sv(f, "dheight")), rt.sv(f, "height")), 1), live(cos))));
});

// /obj/docking_port/proc/return_ordered_turfs  (code/modules/shuttle/shuttle.dm:78)
rt.def("/obj/docking_port/proc/return_ordered_turfs", function return_ordered_turfs(f: Frame, _x: Value, _y: Value, _z: Value, _dir: Value, A: Value) {
	let cos: Value = null, sin: Value = null, xi: Value = null, yi: Value = null, dx: Value = null, dy: Value = null, _T: Value = null;
	let $0: any;
	f.vars = () => [_x, _y, _z, _dir, cos, sin, xi, yi, dx, dy, _T, $0];
	if (!truthy(live(_dir))) {
		_dir = rt.sv(f, "dir");
	}
	if (!truthy(live(_x))) {
		_x = rt.sv(f, "x");
	}
	if (!truthy(live(_y))) {
		_y = rt.sv(f, "y");
	}
	if (!truthy(live(_z))) {
		_z = rt.sv(f, "z");
	}
	cos = 1;
	sin = 0;
	$0 = live(_dir);
	if ($0 === 8) {
		cos = 0;
		sin = 1;
	} else if ($0 === 2) {
		cos = -1;
		sin = 0;
	} else if ($0 === 4) {
		cos = 0;
		sin = -1;
	}
	f.dot = rt.list();
	xi = null;
	yi = null;
	dx = null;
	dx = 0;
	while (rt.lt(live(dx), rt.sv(f, "width"))) {
		dy = null;
		dy = 0;
		while (rt.lt(live(dy), rt.sv(f, "height"))) {
			xi = subtract(add(live(_x), multiply(subtract(live(dx), rt.sv(f, "dwidth")), live(cos))), multiply(subtract(live(dy), rt.sv(f, "dheight")), live(sin)));
			yi = add(add(live(_y), multiply(subtract(live(dy), rt.sv(f, "dheight")), live(cos))), multiply(subtract(live(dx), rt.sv(f, "dwidth")), live(sin)));
			_T = rt.locate(live(xi), live(yi), live(_z));
			if (truthy(live(A))) {
				if (isEqual(rt.call(f, P("/proc/get_area"), null, [live(_T)]), live(A))) {
					f.dot = rt.modify(live(f.dot), live(_T), add);
				} else {
					f.dot = rt.modify(live(f.dot), null, add);
				}
			} else {
				f.dot = rt.modify(live(f.dot), live(_T), add);
			}
			dy = rt.inc(live(dy), 1);
		}
		dx = rt.inc(live(dx), 1);
	}
	return f.dot;
});

// /obj/docking_port/proc/get_docked  (code/modules/shuttle/shuttle.dm:135)
rt.def("/obj/docking_port/proc/get_docked", function get_docked(f: Frame) {
	return rt.locateIn(f, T("/obj/docking_port/stationary"), rt.sv(f, "loc"));
});

// /obj/docking_port/proc/getDockedId  (code/modules/shuttle/shuttle.dm:138)
rt.def("/obj/docking_port/proc/getDockedId", function getDockedId(f: Frame) {
	let _P: Value = null;
	f.vars = () => [_P];
	if (!truthy((_P = rt.callSrc(f, "get_docked", [])))) return f.dot;
	return rt.fv(f, "id", live(_P));
});

rt.type(13053, "/obj/docking_port/stationary", "/obj/docking_port", {
	turf_type: rt.typePath("/turf/open/space"),
	last_dock_time: null,
	area_type: rt.typePath("/area/space"),
	name: "dock",
});

// /obj/docking_port/stationary/proc/Initialize  (code/modules/shuttle/shuttle.dm:149)
rt.def("/obj/docking_port/stationary/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.modField(f, rt.gl("SSshuttle"), "stationary", live(f.src), add);
	if (!truthy(rt.sv(f, "id"))) {
		rt.setSv(f, "id", fmt("＀", [rt.getLen(f, rt.fv(f, "stationary", rt.gl("SSshuttle")))]));
	}
	if (!isEqual(rt.sv(f, "name"), "dock")) return f.dot;
	rt.setSv(f, "name", fmt("dock＀", [rt.getLen(f, rt.fv(f, "stationary", rt.gl("SSshuttle")))]));
	return f.dot;
});

// /obj/docking_port/stationary/proc/get_docked  (code/modules/shuttle/shuttle.dm:162)
rt.def("/obj/docking_port/stationary/proc/get_docked", function get_docked(f: Frame) {
	f.dot = rt.locateIn(f, T("/obj/docking_port/mobile"), rt.sv(f, "loc"));
	return f.dot;
});

rt.type(13056, "/obj/docking_port/stationary/transit", "/obj/docking_port/stationary", {
	assigned_turfs: null,
	assigned_area: null,
	owner: null,
	turf_type: rt.typePath("/turf/open/space/transit"),
	name: "In Transit",
});

// /obj/docking_port/stationary/transit/proc/<init>  (code/modules/shuttle/shuttle.dm:167)
rt.def("/obj/docking_port/stationary/transit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "assigned_turfs", rt.list());
	return f.dot;
});

// /obj/docking_port/stationary/transit/proc/Initialize  (code/modules/shuttle/shuttle.dm:172)
rt.def("/obj/docking_port/stationary/transit/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.modField(f, rt.gl("SSshuttle"), "transit", live(f.src), add);
	return f.dot;
});

// /obj/docking_port/stationary/transit/proc/dezone  (code/modules/shuttle/shuttle.dm:176)  may sleep
rt.def("/obj/docking_port/stationary/transit/proc/dezone", function* dezone(f: Frame) {
	let i: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [i, _T, $e];
	i = null;
	rt.forList(f, 0, rt.sv(f, "assigned_turfs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (isEqual(rt.gv(f, "type", (_T = live(i))), rt.sv(f, "turf_type"))) {
			yield* g.callName(f, live(_T), "ChangeTurf", [T("/turf/open/space")]);
			(rt.modField(f, live(_T), "flags", 2, rt.bitOr));
			rt.modField(f, rt.gl("SSshuttle"), "transit_recolor", live(_T), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/docking_port/stationary/transit/proc/Destroy  (code/modules/shuttle/shuttle.dm:185)  may sleep
rt.def("/obj/docking_port/stationary/transit/proc/Destroy", function* Destroy(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (truthy(live(f.args[0]))) {
		(rt.modField(f, rt.gl("SSshuttle"), "transit", live(f.src), subtract));
		if (truthy(rt.sv(f, "owner"))) {
			rt.setSv(f, "owner", null);
		}
		if (truthy(rt.sv(f, "assigned_turfs"))) {
			yield* g.srcCall(f, "dezone");
			yield* g.callName(f, rt.sv(f, "assigned_turfs"), "Cut", []);
		}
		rt.setSv(f, "assigned_turfs", null);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["force"] });

rt.type(13044, "/obj/docking_port/mobile", "/obj/docking_port", {
	areaInstance: null,
	timer: null,
	last_timer_length: null,
	mode: "idle",
	callTime: 100,
	ignitionTime: 55,
	roundstart_move: null,
	preferred_direction: 1,
	port_angle: 0,
	destination: null,
	previous: null,
	assigned_transit: null,
	launch_status: -1,
	knockdown: 1,
	timid: 0,
	ripples: null,
	engine_coeff: 1,
	current_engines: 0,
	initial_engines: 0,
	name: "shuttle",
	icon_state: "pinonclose",
});

// /obj/docking_port/mobile/proc/<init>  (code/modules/shuttle/shuttle.dm:227)
rt.def("/obj/docking_port/mobile/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ripples", rt.list());
	return f.dot;
});

// /obj/docking_port/mobile/proc/Destroy  (code/modules/shuttle/shuttle.dm:237)  may sleep
rt.def("/obj/docking_port/mobile/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(live(f.args[0]))) {
		(rt.modField(f, rt.gl("SSshuttle"), "mobile", live(f.src), subtract));
		rt.setSv(f, "destination", null);
		rt.setSv(f, "previous", null);
		rt.setSv(f, "assigned_transit", null);
		rt.setSv(f, "areaInstance", null);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["force"] });

// /obj/docking_port/mobile/proc/Initialize  (code/modules/shuttle/shuttle.dm:245)  may sleep
rt.def("/obj/docking_port/mobile/proc/Initialize", function* Initialize(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "timid"))) {
		yield* g.srcCall(f, "register");
	}
	if (truthy((rt.istype((A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))), T("/area/shuttle")) ? 1 : 0))) {
		rt.setSv(f, "areaInstance", live(A));
	}
	if (!truthy(rt.sv(f, "id"))) {
		rt.setSv(f, "id", fmt("＀", [rt.getLen(f, rt.fv(f, "mobile", rt.gl("SSshuttle")))]));
	}
	if (isEqual(rt.sv(f, "name"), "shuttle")) {
		rt.setSv(f, "name", fmt("shuttle＀", [rt.getLen(f, rt.fv(f, "mobile", rt.gl("SSshuttle")))]));
	}
	if (!truthy(rt.sv(f, "areaInstance"))) {
		rt.setSv(f, "areaInstance", (yield* g.new_(f, T("/area/shuttle"), [])));
		rt.setFv(f, "name", rt.sv(f, "areaInstance"), rt.sv(f, "name"));
		rt.modField(f, rt.sv(f, "areaInstance"), "contents", (yield* g.srcCall(f, "return_ordered_turfs")), add);
	}
	rt.setSv(f, "initial_engines", (yield* g.srcCall(f, "count_engines")));
	rt.setSv(f, "current_engines", rt.sv(f, "initial_engines"));
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/docking_port/mobile/proc/canDock  (code/modules/shuttle/shuttle.dm:276)
rt.def("/obj/docking_port/mobile/proc/canDock", function canDock(f: Frame, S: Value) {
	let currently_docked: Value = null;
	f.vars = () => [currently_docked];
	if (!truthy((rt.istype(live(S), T("/obj/docking_port/stationary")) ? 1 : 0))) {
		return "not_a_docking_port";
	}
	if (truthy((rt.istype(live(S), T("/obj/docking_port/stationary/transit")) ? 1 : 0))) {
		return "can_dock";
	}
	if (rt.gt(rt.sv(f, "dwidth"), rt.fv(f, "dwidth", live(S)))) {
		return "docking_width_too_large";
	}
	if (rt.gt(subtract(rt.sv(f, "width"), rt.sv(f, "dwidth")), subtract(rt.fv(f, "width", live(S)), rt.fv(f, "dwidth", live(S))))) {
		return "width_too_large";
	}
	if (rt.gt(rt.sv(f, "dheight"), rt.fv(f, "dheight", live(S)))) {
		return "docking_height_too_large";
	}
	if (rt.gt(subtract(rt.sv(f, "height"), rt.sv(f, "dheight")), subtract(rt.fv(f, "height", live(S)), rt.fv(f, "dheight", live(S))))) {
		return "height_too_large";
	}
	if (truthy((currently_docked = rt.callName(f, live(S), "get_docked", [])))) {
		if (!isEqual(live(currently_docked), live(f.src))) {
			return "someone_else_docked";
		}
		return "we_are_already_docked";
	}
	return "can_dock";
});

// /obj/docking_port/mobile/proc/check_dock  (code/modules/shuttle/shuttle.dm:308)
rt.def("/obj/docking_port/mobile/proc/check_dock", function check_dock(f: Frame, S: Value) {
	let status: Value = null, msg: Value = null;
	f.vars = () => [status, msg];
	if (isEqual((status = rt.callSrc(f, "canDock", [live(S)])), "can_dock")) {
		return 1;
	} else {
		if (isEqual(live(status), "we_are_already_docked")) {
			return 0;
		} else {
			rt.call(f, P("/proc/message_admins"), null, [(msg = fmt("Shuttle ＀ cannot dock at ＀, error: ＀", [live(f.src), live(S), live(status)]))]);
			return 0;
		}
	}
	return f.dot;
});

// /obj/docking_port/mobile/proc/transit_failure  (code/modules/shuttle/shuttle.dm:321)
rt.def("/obj/docking_port/mobile/proc/transit_failure", function transit_failure(f: Frame) {
	rt.call(f, P("/proc/message_admins"), null, [fmt("Shuttle ＀ repeatedly failed to create transit zone.", [live(f.src)])]);
	return f.dot;
});

// /obj/docking_port/mobile/proc/request  (code/modules/shuttle/shuttle.dm:325)
rt.def("/obj/docking_port/mobile/proc/request", function request(f: Frame, S: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.callSrc(f, "check_dock", [live(S)]))) {
		return live(f.dot);
	}
	if ((isEqual(rt.sv(f, "mode"), "igniting") && isEqual(rt.sv(f, "destination"), live(S)))) {
		return live(f.dot);
	}
	$0 = rt.sv(f, "mode");
	if ($0 === "call") {
		if (isEqual(live(S), rt.sv(f, "destination"))) {
			if (rt.lt(rt.callSrc(f, "timeLeft", [1]), multiply(rt.sv(f, "callTime"), rt.sv(f, "engine_coeff")))) {
				rt.callSrc(f, "setTimer", [multiply(rt.sv(f, "callTime"), rt.sv(f, "engine_coeff"))]);
			}
		} else {
			rt.setSv(f, "destination", live(S));
			rt.callSrc(f, "setTimer", [multiply(rt.sv(f, "callTime"), rt.sv(f, "engine_coeff"))]);
		}
	} else if ($0 === "recall") {
		if (isEqual(live(S), rt.sv(f, "destination"))) {
			rt.callSrc(f, "setTimer", [subtract(multiply(rt.sv(f, "callTime"), rt.sv(f, "engine_coeff")), rt.callSrc(f, "timeLeft", [1]))]);
		} else {
			rt.setSv(f, "destination", live(S));
			rt.callSrc(f, "setTimer", [multiply(rt.sv(f, "callTime"), rt.sv(f, "engine_coeff"))]);
		}
		rt.setSv(f, "mode", "call");
	} else if ($0 === "idle" || $0 === "igniting") {
		rt.setSv(f, "destination", live(S));
		rt.setSv(f, "mode", "igniting");
		rt.callSrc(f, "setTimer", [rt.sv(f, "ignitionTime")]);
	}
	return f.dot;
});

// /obj/docking_port/mobile/proc/cancel  (code/modules/shuttle/shuttle.dm:354)  may sleep
rt.def("/obj/docking_port/mobile/proc/cancel", function* cancel(f: Frame) {
	if (!isEqual(rt.sv(f, "mode"), "call")) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "remove_ripples");
	yield* g.srcCall(f, "invertTimer");
	rt.setSv(f, "mode", "recall");
	return f.dot;
}, true);

// /obj/docking_port/mobile/proc/enterTransit  (code/modules/shuttle/shuttle.dm:363)  may sleep
rt.def("/obj/docking_port/mobile/proc/enterTransit", function* enterTransit(f: Frame) {
	let S0: Value = null, S1: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [S0, S1, $0, $1, $2];
	if ((truthy(rt.fv(f, "lockdown", rt.gl("SSshuttle"))) && isEqual(rt.sv(f, "z"), 2))) {
		return live(f.dot);
	}
	rt.setSv(f, "previous", null);
	S0 = (yield* g.srcCall(f, "get_docked"));
	if (truthy((S1 = rt.sv(f, "assigned_transit")))) {
		if (truthy((yield* g.srcCall(f, "dock", live(S1))))) {
			$0 = rt.sv(f, "id");
			if (truthy(live(S0))) {
				$1 = rt.fv(f, "id", live(S0));
			} else {
				$1 = "null";
			}
			if (truthy(live(S1))) {
				$2 = rt.fv(f, "id", live(S1));
			} else {
				$2 = "null";
			}
			yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [fmt("shuttle \"＀\" could not enter transit space. Docked at ＀. Transit dock ＀.", [$0, $1, $2]), "code/modules/shuttle/shuttle.dm", 372, live(f.src), live(f.usr)])]);
		} else {
			rt.setSv(f, "previous", live(S0));
		}
	} else {
		$0 = rt.sv(f, "id");
		if (truthy(live(S0))) {
			$1 = rt.fv(f, "id", live(S0));
		} else {
			$1 = "null";
		}
		if (truthy(live(S1))) {
			$2 = rt.fv(f, "id", live(S1));
		} else {
			$2 = "null";
		}
		yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [fmt("shuttle \"＀\" could not enter transit space. S0=＀ S1=＀", [$0, $1, $2]), "code/modules/shuttle/shuttle.dm", 376, live(f.src), live(f.usr)])]);
	}
	return f.dot;
}, true);

// /obj/docking_port/mobile/proc/jumpToNullSpace  (code/modules/shuttle/shuttle.dm:382)  may sleep
rt.def("/obj/docking_port/mobile/proc/jumpToNullSpace", function* jumpToNullSpace(f: Frame) {
	let S0: Value = null, turf_type: Value = null, area_type: Value = null, L0: Value = null, A0: Value = null, T0: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [S0, turf_type, area_type, L0, A0, T0, i, $e];
	S0 = (yield* g.srcCall(f, "get_docked"));
	turf_type = T("/turf/open/space");
	area_type = T("/area/space");
	if (truthy(live(S0))) {
		if (truthy(rt.fv(f, "turf_type", live(S0)))) {
			turf_type = rt.fv(f, "turf_type", live(S0));
		}
		if (truthy(rt.fv(f, "area_type", live(S0)))) {
			area_type = rt.fv(f, "area_type", live(S0));
		}
	}
	L0 = (yield* g.srcCall(f, "return_ordered_turfs", rt.sv(f, "x"), rt.sv(f, "y"), rt.sv(f, "z"), rt.sv(f, "dir"), rt.sv(f, "areaInstance")));
	if (truthy(rt.getLen(f, rt.fv(f, "contents", rt.sv(f, "areaInstance"))))) {
		if (!truthy((A0 = rt.locateIn(f, fmt("＀", [live(area_type)]), rt.world())))) {
			A0 = (yield* g.new_(f, live(area_type), [null]));
		}
		T0 = null;
		rt.forList(f, 0, live(L0), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			T0 = $e;
			rt.modField(f, live(A0), "contents", live(T0), add);
		}
		rt.endFor(f, 0);
	}
	i = null;
	rt.forList(f, 0, live(L0));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!truthy((T0 = live(i)))) {
			continue;
		}
		yield* g.callName(f, live(T0), "empty", [live(turf_type)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [null, live(f.src), "force", 1], rt.Args.Named);
	return f.dot;
}, true);

// /obj/docking_port/mobile/proc/create_ripples  (code/modules/shuttle/shuttle.dm:412)  may sleep
rt.def("/obj/docking_port/mobile/proc/create_ripples", function* create_ripples(f: Frame, S1: Value, animate_time: Value) {
	let turfs: Value = null, t: Value = null;
	let $e: any;
	f.vars = () => [S1, animate_time, turfs, t, $e];
	turfs = (yield* g.srcCall(f, "ripple_area", live(S1)));
	t = null;
	rt.forList(f, 0, live(turfs));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		rt.modSrcVar(f, "ripples", (yield* g.new_(f, T("/obj/effect/temp_visual/ripple"), [live(t), live(animate_time)])), add);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/docking_port/mobile/proc/remove_ripples  (code/modules/shuttle/shuttle.dm:417)  may sleep
rt.def("/obj/docking_port/mobile/proc/remove_ripples", function* remove_ripples(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	R = null;
	rt.forList(f, 0, rt.sv(f, "ripples"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(R)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "ripples"), "Cut", []);
	return f.dot;
}, true);

// /obj/docking_port/mobile/proc/ripple_area  (code/modules/shuttle/shuttle.dm:422)
rt.def("/obj/docking_port/mobile/proc/ripple_area", function ripple_area(f: Frame, S1: Value) {
	let L0: Value = null, L1: Value = null, ripple_turfs: Value = null, i: Value = null, T0: Value = null, T1: Value = null;
	let $e: any;
	f.vars = () => [L0, L1, ripple_turfs, i, T0, T1, $e];
	L0 = rt.callSrc(f, "return_ordered_turfs", [rt.sv(f, "x"), rt.sv(f, "y"), rt.sv(f, "z"), rt.sv(f, "dir"), rt.sv(f, "areaInstance")]);
	L1 = rt.callSrc(f, "return_ordered_turfs", [rt.fv(f, "x", live(S1)), rt.fv(f, "y", live(S1)), rt.fv(f, "z", live(S1)), rt.fv(f, "dir", live(S1))]);
	ripple_turfs = rt.list();
	i = null;
	rt.forRange(f, 0, 1, rt.len(f, live(L0)), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!truthy((T0 = rt.index(live(L0), live(i))))) {
			continue;
		}
		if (!truthy((T1 = rt.index(live(L1), live(i))))) {
			continue;
		}
		if (!isEqual(rt.fv(f, "type", live(T0)), rt.fv(f, "baseturf", live(T0)))) {
			ripple_turfs = rt.modify(live(ripple_turfs), live(T1), add);
		}
	}
	rt.endFor(f, 0);
	return live(ripple_turfs);
});

// /obj/docking_port/mobile/proc/check_poddoors  (code/modules/shuttle/shuttle.dm:440)
rt.def("/obj/docking_port/mobile/proc/check_poddoors", function check_poddoors(f: Frame) {
	let pod: Value = null;
	let $e: any;
	f.vars = () => [pod, $e];
	pod = null;
	rt.forList(f, 0, rt.gl("airlocks"), T("/obj/machinery/door/poddoor/shuttledock"));
	while (($e = rt.next(f, 0)) !== undefined) {
		pod = $e;
		rt.callName(f, live(pod), "check", []);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/docking_port/mobile/proc/dock  (code/modules/shuttle/shuttle.dm:446)  may sleep
rt.def("/obj/docking_port/mobile/proc/dock", function* dock(f: Frame, S1: Value, force: Value) {
	let S0: Value = null, turf_type: Value = null, area_type: Value = null, destination_turf_type: Value = null, L0: Value = null, L1: Value = null, rotation: Value = null, A0: Value = null, T0: Value = null, old: Value = null, i: Value = null, T1: Value = null, AM: Value = null, moved_atoms: Value = null, i_8: Value = null, T0_9: Value = null, T1_10: Value = null, old_11: Value = null, Ts1: Value = null, AM_12: Value = null, am: Value = null, AM_9: Value = null;
	let $e: any;
	f.vars = () => [S1, force, S0, turf_type, area_type, destination_turf_type, L0, L1, rotation, A0, T0, old, i, T1, AM, moved_atoms, i_8, T0_9, T1_10, old_11, Ts1, AM_12, am, AM_9, $e];
	if (live(force) === null) {
		force = 0;
	}
	if (isEqual((yield* g.callName(f, live(S1), "get_docked", [])), live(f.src))) {
		yield* g.srcCall(f, "remove_ripples");
		return live(f.dot);
	}
	if (!truthy(live(force))) {
		if (!truthy((yield* g.srcCall(f, "check_dock", live(S1))))) {
			return -1;
		}
		if (!truthy((yield* g.srcCall(f, "canMove")))) {
			return -1;
		}
	}
	rt.setFv(f, "last_dock_time", rt.gl("SSshuttle"), rt.worldTime(f));
	S0 = (yield* g.srcCall(f, "get_docked"));
	turf_type = T("/turf/open/space");
	area_type = T("/area/space");
	if (truthy(live(S0))) {
		if (truthy(rt.fv(f, "turf_type", live(S0)))) {
			turf_type = rt.fv(f, "turf_type", live(S0));
		}
		if (truthy(rt.fv(f, "area_type", live(S0)))) {
			area_type = rt.fv(f, "area_type", live(S0));
		}
	}
	destination_turf_type = rt.fv(f, "turf_type", live(S1));
	L0 = (yield* g.srcCall(f, "return_ordered_turfs", rt.sv(f, "x"), rt.sv(f, "y"), rt.sv(f, "z"), rt.sv(f, "dir"), rt.sv(f, "areaInstance")));
	L1 = (yield* g.srcCall(f, "return_ordered_turfs", rt.fv(f, "x", live(S1)), rt.fv(f, "y", live(S1)), rt.fv(f, "z", live(S1)), rt.fv(f, "dir", live(S1))));
	if (!isEqual(rt.modulus((rotation = subtract((yield* g.call(f, P("/proc/dir2angle"), null, [rt.fv(f, "dir", live(S1))])), (yield* g.call(f, P("/proc/dir2angle"), null, [rt.sv(f, "dir")])))), 90), 0)) {
		rotation = rt.modify(live(rotation), rt.modulus(live(rotation), 90), add);
	}
	rotation = (yield* g.call(f, P("/proc/SimplifyDegrees"), null, [live(rotation)]));
	if (truthy(rt.getLen(f, rt.fv(f, "contents", rt.sv(f, "areaInstance"))))) {
		if (!truthy((A0 = rt.locateIn(f, fmt("＀", [live(area_type)]), rt.world())))) {
			A0 = (yield* g.new_(f, live(area_type), [null]));
		}
		T0 = null;
		rt.forList(f, 0, live(L0), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			T0 = $e;
			old = rt.fv(f, "loc", live(T0));
			rt.modField(f, live(A0), "contents", live(T0), add);
			yield* g.callName(f, live(T0), "change_area", [live(old), live(A0)]);
		}
		rt.endFor(f, 0);
	}
	if (truthy((rt.istype(live(S1), T("/obj/docking_port/stationary/transit")) ? 1 : 0))) {
		rt.setFv(f, "parallax_movedir", rt.sv(f, "areaInstance"), rt.sv(f, "preferred_direction"));
	} else {
		rt.setFv(f, "parallax_movedir", rt.sv(f, "areaInstance"), 0);
	}
	yield* g.srcCall(f, "remove_ripples");
	yield* g.srcCall(f, "roadkill", live(L0), live(L1), rt.fv(f, "dir", live(S1)));
	i = null;
	rt.forRange(f, 0, 1, rt.len(f, live(L0)), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!truthy((T0 = rt.index(live(L0), live(i))))) {
			continue;
		}
		if (!truthy((T1 = rt.index(live(L1), live(i))))) {
			continue;
		}
		if (isEqual(rt.fv(f, "type", live(T0)), rt.fv(f, "baseturf", live(T0)))) {
			continue;
		}
		AM = null;
		rt.forList(f, 1, live(T0), T("/atom/movable"));
		while (($e = rt.next(f, 1)) !== undefined) {
			AM = $e;
			yield* g.callName(f, live(AM), "beforeShuttleMove", [live(T1), live(rotation)]);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	moved_atoms = rt.list();
	i_8 = null;
	rt.forRange(f, 0, 1, rt.len(f, live(L0)), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i_8 = $e;
		if (!truthy((T0_9 = rt.index(live(L0), live(i_8))))) {
			continue;
		}
		if (!truthy((T1_10 = rt.index(live(L1), live(i_8))))) {
			continue;
		}
		if (!isEqual(rt.fv(f, "type", live(T0_9)), rt.fv(f, "baseturf", live(T0_9)))) {
			yield* g.callName(f, live(T0_9), "copyTurf", [live(T1_10)]);
			rt.setFv(f, "baseturf", live(T1_10), live(destination_turf_type));
			old_11 = rt.fv(f, "loc", live(T1_10));
			rt.modField(f, rt.sv(f, "areaInstance"), "contents", live(T1_10), add);
			yield* g.callName(f, live(T1_10), "change_area", [live(old_11), rt.sv(f, "areaInstance")]);
			if (truthy((rt.istype(live(T1_10), T("/turf/open")) ? 1 : 0))) {
				yield* g.callName(f, (Ts1 = live(T1_10)), "copy_air_with_tile", [live(T0_9)]);
			}
			AM_12 = null;
			rt.forList(f, 1, live(T0_9), T("/atom/movable"));
			while (($e = rt.next(f, 1)) !== undefined) {
				AM_12 = $e;
				if (truthy((yield* g.callName(f, live(AM_12), "onShuttleMove", [live(T1_10), live(rotation), rt.sv(f, "knockdown")])))) {
					moved_atoms = rt.modify(live(moved_atoms), live(AM_12), add);
				}
			}
			rt.endFor(f, 1);
		}
		if (truthy(live(rotation))) {
			yield* g.callName(f, live(T1_10), "shuttleRotate", [live(rotation)]);
		}
		yield* g.callName(f, rt.gl("SSair"), "remove_from_active", [live(T1_10)]);
		yield* g.callName(f, live(T1_10), "CalculateAdjacentTurfs", []);
		yield* g.callName(f, rt.gl("SSair"), "add_to_active", [live(T1_10), 1]);
		yield* g.callName(f, live(T0_9), "ChangeTurf", [live(turf_type)]);
		yield* g.callName(f, rt.gl("SSair"), "remove_from_active", [live(T0_9)]);
		yield* g.callName(f, live(T0_9), "CalculateAdjacentTurfs", []);
		yield* g.callName(f, rt.gl("SSair"), "add_to_active", [live(T0_9), 1]);
	}
	rt.endFor(f, 0);
	am = null;
	rt.forList(f, 0, live(moved_atoms));
	while (($e = rt.next(f, 0)) !== undefined) {
		am = $e;
		yield* g.callName(f, (AM_9 = live(am)), "afterShuttleMove", []);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "check_poddoors");
	rt.setFv(f, "last_dock_time", live(S1), rt.worldTime(f));
	rt.setSv(f, "loc", rt.fv(f, "loc", live(S1)));
	yield* g.srcCall(f, "setDir", rt.fv(f, "dir", live(S1)));
	return f.dot;
}, true);

// /obj/docking_port/mobile/proc/findRoundstartDock  (code/modules/shuttle/shuttle.dm:557)
rt.def("/obj/docking_port/mobile/proc/findRoundstartDock", function findRoundstartDock(f: Frame) {
	return rt.callName(f, rt.gl("SSshuttle"), "getDock", [rt.sv(f, "roundstart_move")]);
});

// /obj/docking_port/mobile/proc/dockRoundstart  (code/modules/shuttle/shuttle.dm:560)  may sleep
rt.def("/obj/docking_port/mobile/proc/dockRoundstart", function* dockRoundstart(f: Frame) {
	f.dot = (yield* g.srcCall(f, "dock_id", rt.sv(f, "roundstart_move")));
	return f.dot;
}, true);

// /obj/docking_port/mobile/proc/dock_id  (code/modules/shuttle/shuttle.dm:563)  may sleep
rt.def("/obj/docking_port/mobile/proc/dock_id", function* dock_id(f: Frame, id: Value) {
	let port: Value = null;
	f.vars = () => [id, port];
	if (truthy((port = (yield* g.callName(f, rt.gl("SSshuttle"), "getDock", [live(id)]))))) {
		f.dot = (yield* g.srcCall(f, "dock", live(port)));
	} else {
		f.dot = null;
	}
	return f.dot;
}, true);

// /obj/docking_port/mobile/proc/roadkill  (code/modules/shuttle/shuttle.dm:573)  may sleep
rt.def("/obj/docking_port/mobile/proc/roadkill", function* roadkill(f: Frame, L0: Value, L1: Value, dir: Value) {
	let i: Value = null, T0: Value = null, T1: Value = null, AM: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [L0, L1, dir, i, T0, T1, AM, M, $e];
	i = null;
	rt.forRange(f, 0, 1, rt.len(f, live(L0)), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		T0 = rt.index(live(L0), live(i));
		T1 = rt.index(live(L1), live(i));
		if ((!truthy(live(T0)) || !truthy(live(T1)))) {
			continue;
		}
		if (isEqual(rt.fv(f, "type", live(T0)), rt.fv(f, "baseturf", live(T0)))) {
			continue;
		}
		AM = null;
		rt.forList(f, 1, live(T1), T("/atom/movable"));
		while (($e = rt.next(f, 1)) !== undefined) {
			AM = $e;
			if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) {
				if (truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) {
					if (truthy(rt.gv(f, "buckled", (M = live(AM))))) {
						yield* g.callName(f, rt.fv(f, "buckled", live(M)), "unbuckle_mob", [live(M), 1]);
					}
					if (truthy(rt.fv(f, "pulledby", live(M)))) {
						yield* g.callName(f, rt.fv(f, "pulledby", live(M)), "stop_pulling", []);
					}
					yield* g.callName(f, live(M), "stop_pulling", []);
					yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀ slams into ＀!</span>", [live(f.src), live(M)])]);
					yield* g.callName(f, live(M), "gib", []);
				}
			} else {
				if ((truthy((rt.istype(live(AM), T("/obj/singularity")) ? 1 : 0)) && !truthy((rt.istype(live(AM), T("/obj/singularity/narsie")) ? 1 : 0)))) {
					continue;
				}
				if (!truthy(rt.fv(f, "anchored", live(AM)))) {
					yield* g.call(f, P("/proc/step"), null, [live(AM), live(dir)]);
				} else {
					yield* g.call(f, P("/proc/qdel"), null, [live(AM)]);
				}
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/docking_port/mobile/proc/check  (code/modules/shuttle/shuttle.dm:608)  may sleep
rt.def("/obj/docking_port/mobile/proc/check", function* check(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.srcCall(f, "check_effects");
	if (isEqual(rt.sv(f, "mode"), "igniting")) {
		yield* g.srcCall(f, "check_transit_zone");
	}
	if (rt.gt((yield* g.srcCall(f, "timeLeft", 1)), 0)) {
		return live(f.dot);
	}
	$0 = rt.sv(f, "mode");
	if ($0 === "call") {
		if (truthy((yield* g.srcCall(f, "dock", rt.sv(f, "destination"))))) {
			yield* g.srcCall(f, "setTimer", 20);
			return live(f.dot);
		}
	} else if ($0 === "recall") {
		if (truthy((yield* g.srcCall(f, "dock", rt.sv(f, "previous"))))) {
			yield* g.srcCall(f, "setTimer", 20);
			return live(f.dot);
		}
	} else if ($0 === "igniting") {
		if (!isEqual((yield* g.srcCall(f, "check_transit_zone")), 2)) {
			yield* g.srcCall(f, "setTimer", 20);
			return live(f.dot);
		} else {
			rt.setSv(f, "mode", "call");
			yield* g.srcCall(f, "setTimer", multiply(rt.sv(f, "callTime"), rt.sv(f, "engine_coeff")));
			yield* g.srcCall(f, "enterTransit");
			return live(f.dot);
		}
	}
	rt.setSv(f, "mode", "idle");
	rt.setSv(f, "timer", 0);
	rt.setSv(f, "destination", null);
	return f.dot;
}, true);

// /obj/docking_port/mobile/proc/check_effects  (code/modules/shuttle/shuttle.dm:641)  may sleep
rt.def("/obj/docking_port/mobile/proc/check_effects", function* check_effects(f: Frame) {
	let tl: Value = null, S0: Value = null;
	f.vars = () => [tl, S0];
	if (!truthy(rt.len(f, rt.sv(f, "ripples")))) {
		if ((isEqual(rt.sv(f, "mode"), "call") || isEqual(rt.sv(f, "mode"), "recall"))) {
			if (rt.le((tl = (yield* g.srcCall(f, "timeLeft", 1))), 100)) {
				yield* g.srcCall(f, "create_ripples", rt.sv(f, "destination"), live(tl));
			}
		}
	}
	S0 = (yield* g.srcCall(f, "get_docked"));
	if (!((truthy(rt.fv(f, "parallax_movedir", rt.sv(f, "areaInstance"))) && truthy((rt.istype(live(S0), T("/obj/docking_port/stationary/transit")) ? 1 : 0))) && rt.le((yield* g.srcCall(f, "timeLeft", 1)), 25))) return f.dot;
	yield* g.srcCall(f, "parallax_slowdown");
	return f.dot;
}, true);

// /obj/docking_port/mobile/proc/parallax_slowdown  (code/modules/shuttle/shuttle.dm:652)  may sleep
rt.def("/obj/docking_port/mobile/proc/parallax_slowdown", function* parallax_slowdown(f: Frame) {
	let L0: Value = null, thing: Value = null, _T: Value = null, thing2: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [L0, thing, _T, thing2, AM, $e];
	rt.setFv(f, "parallax_movedir", rt.sv(f, "areaInstance"), 0);
	if ((truthy(rt.sv(f, "assigned_transit")) && truthy(rt.fv(f, "assigned_area", rt.sv(f, "assigned_transit"))))) {
		rt.setFv(f, "parallax_movedir", rt.fv(f, "assigned_area", rt.sv(f, "assigned_transit")), 0);
	}
	L0 = (yield* g.srcCall(f, "return_ordered_turfs", rt.sv(f, "x"), rt.sv(f, "y"), rt.sv(f, "z"), rt.sv(f, "dir"), rt.sv(f, "areaInstance")));
	thing = null;
	rt.forList(f, 0, live(L0));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		_T = live(thing);
		thing2 = null;
		rt.forList(f, 1, live(_T));
		while (($e = rt.next(f, 1)) !== undefined) {
			thing2 = $e;
			if (truthy(rt.length(rt.gv(f, "client_mobs_in_contents", (AM = live(thing2)))))) {
				yield* g.callName(f, live(AM), "update_parallax_contents", []);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/docking_port/mobile/proc/check_transit_zone  (code/modules/shuttle/shuttle.dm:665)
rt.def("/obj/docking_port/mobile/proc/check_transit_zone", function check_transit_zone(f: Frame) {
	if (truthy(rt.sv(f, "assigned_transit"))) {
		return 2;
	} else {
		rt.callName(f, rt.gl("SSshuttle"), "request_transit_dock", [live(f.src)]);
	}
	return f.dot;
});

// /obj/docking_port/mobile/proc/setTimer  (code/modules/shuttle/shuttle.dm:670)
rt.def("/obj/docking_port/mobile/proc/setTimer", function setTimer(f: Frame, wait: Value) {
	rt.setSv(f, "timer", add(rt.worldTime(f), live(wait)));
	rt.setSv(f, "last_timer_length", live(wait));
	return f.dot;
});

// /obj/docking_port/mobile/proc/modTimer  (code/modules/shuttle/shuttle.dm:674)
rt.def("/obj/docking_port/mobile/proc/modTimer", function modTimer(f: Frame, multiple: Value) {
	let time_remaining: Value = null;
	f.vars = () => [time_remaining];
	if ((rt.lt((time_remaining = subtract(rt.sv(f, "timer"), rt.worldTime(f))), 0) || !truthy(rt.sv(f, "last_timer_length")))) {
		return live(f.dot);
	}
	(time_remaining = rt.modify(live(time_remaining), live(multiple), multiply));
	(rt.modSrcVar(f, "last_timer_length", live(multiple), multiply));
	rt.callSrc(f, "setTimer", [live(time_remaining)]);
	return f.dot;
});

// /obj/docking_port/mobile/proc/invertTimer  (code/modules/shuttle/shuttle.dm:682)
rt.def("/obj/docking_port/mobile/proc/invertTimer", function invertTimer(f: Frame) {
	let time_remaining: Value = null, time_passed: Value = null;
	f.vars = () => [time_remaining, time_passed];
	if (!truthy(rt.sv(f, "last_timer_length"))) {
		return live(f.dot);
	}
	if (!rt.gt((time_remaining = subtract(rt.sv(f, "timer"), rt.worldTime(f))), 0)) return f.dot;
	rt.callSrc(f, "setTimer", [(time_passed = subtract(rt.sv(f, "last_timer_length"), live(time_remaining)))]);
	return f.dot;
});

// /obj/docking_port/mobile/proc/timeLeft  (code/modules/shuttle/shuttle.dm:691)
rt.def("/obj/docking_port/mobile/proc/timeLeft", function timeLeft(f: Frame, divisor: Value) {
	let ds_remaining: Value = null;
	f.vars = () => [divisor, ds_remaining];
	if (rt.le(live(divisor), 0)) {
		divisor = 10;
	}
	ds_remaining = null;
	if (!truthy(rt.sv(f, "timer"))) {
		ds_remaining = multiply(rt.sv(f, "callTime"), rt.sv(f, "engine_coeff"));
	} else {
		ds_remaining = rt.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "timer"), rt.worldTime(f))]);
	}
	f.dot = rt.call(f, P("/proc/round"), null, [divide(live(ds_remaining), live(divisor)), 1]);
	return f.dot;
});

// /obj/docking_port/mobile/proc/getModeStr  (code/modules/shuttle/shuttle.dm:704)
rt.def("/obj/docking_port/mobile/proc/getModeStr", function getModeStr(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "mode");
	if ($0 === "igniting") {
		return "IGN";
	} else if ($0 === "recall") {
		return "RCL";
	} else if ($0 === "call") {
		return "ETA";
	} else if ($0 === "docked") {
		return "ETD";
	} else if ($0 === "escape") {
		return "ESC";
	} else if ($0 === "stranded") {
		return "ERR";
	}
	return "";
});

// /obj/docking_port/mobile/proc/getTimerStr  (code/modules/shuttle/shuttle.dm:721)
rt.def("/obj/docking_port/mobile/proc/getTimerStr", function getTimerStr(f: Frame) {
	let timeleft: Value = null;
	f.vars = () => [timeleft];
	if (isEqual(rt.sv(f, "mode"), "stranded")) {
		return "--:--";
	}
	if (rt.gt((timeleft = rt.callSrc(f, "timeLeft", [])), 0)) {
		return fmt("＀:＀", [rt.call(f, P("/proc/add_zero"), null, [rt.call(f, P("/proc/num2text"), null, [rt.modulus(divide(live(timeleft), 60), 60)]), 2]), rt.call(f, P("/proc/add_zero"), null, [rt.call(f, P("/proc/num2text"), null, [rt.modulus(live(timeleft), 60)]), 2])]);
	}
	return "00:00";
});

// /obj/docking_port/mobile/proc/getStatusText  (code/modules/shuttle/shuttle.dm:732)
rt.def("/obj/docking_port/mobile/proc/getStatusText", function getStatusText(f: Frame) {
	let dockedAt: Value = null, dst: Value = null;
	let $0: any;
	f.vars = () => [dockedAt, dst, $0];
	if ((truthy((dockedAt = rt.callSrc(f, "get_docked", []))) && truthy(rt.fv(f, "name", live(dockedAt))))) {
		$0 = rt.fv(f, "name", live(dockedAt));
	} else {
		$0 = "unknown";
	}
	f.dot = $0;
	if (!truthy((rt.istype(live(dockedAt), T("/obj/docking_port/stationary/transit")) ? 1 : 0))) return f.dot;
	dst = null;
	if (isEqual(rt.sv(f, "mode"), "recall")) {
		dst = rt.sv(f, "previous");
	} else {
		dst = rt.sv(f, "destination");
	}
	if (truthy(live(dst))) {
		$0 = rt.fv(f, "name", live(dst));
	} else {
		$0 = "unknown location";
	}
	f.dot = rt.modify(live(f.dot), fmt(" towards ＀ (＀ minutes)", [$0, rt.callSrc(f, "timeLeft", [600])]), add);
	return f.dot;
});

// /obj/docking_port/mobile/proc/getControlConsole  (code/modules/shuttle/shuttle.dm:745)
rt.def("/obj/docking_port/mobile/proc/getControlConsole", function getControlConsole(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	S = null;
	rt.forList(f, 0, rt.sv(f, "areaInstance"), T("/obj/machinery/computer/shuttle"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (isEqual(rt.fv(f, "shuttleId", live(S)), rt.sv(f, "id"))) {
			return live(S);
		}
	}
	rt.endFor(f, 0);
	return null;
});

// /obj/docking_port/mobile/proc/hyperspace_sound  (code/modules/shuttle/shuttle.dm:752)
rt.def("/obj/docking_port/mobile/proc/hyperspace_sound", function hyperspace_sound(f: Frame, phase: Value, areas: Value) {
	let s: Value = null, A: Value = null, E: Value = null;
	let $0: any, $e: any;
	f.vars = () => [s, A, E, $0, $e];
	s = null;
	$0 = live(phase);
	if ($0 === 1) {
		s = rt.rsc("sound/effects/hyperspace_begin.ogg");
	} else if ($0 === 2) {
		s = rt.rsc("sound/effects/hyperspace_progress.ogg");
	} else if ($0 === 3) {
		s = rt.rsc("sound/effects/hyperspace_end.ogg");
	} else {
		rt.call(f, P("/proc/CRASH"), null, [fmt("Invalid hyperspace sound phase: ＀", [live(phase)])]);
	}
	A = null;
	rt.forList(f, 0, live(areas));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		E = null;
		rt.forList(f, 1, live(A), T("/obj/machinery/door"));
		while (($e = rt.next(f, 1)) !== undefined) {
			E = $e;
			rt.call(f, P("/proc/playsound"), null, [live(E), live(s), 100, 0, subtract(rt.call(f, P("/proc/max"), null, [rt.sv(f, "width"), rt.sv(f, "height")]), rt.fv(f, "view", rt.world()))]);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/docking_port/mobile/proc/is_in_shuttle_bounds  (code/modules/shuttle/shuttle.dm:766)
rt.def("/obj/docking_port/mobile/proc/is_in_shuttle_bounds", function is_in_shuttle_bounds(f: Frame, A: Value) {
	let _T: Value = null, bounds: Value = null, T0: Value = null, T1: Value = null;
	f.vars = () => [_T, bounds, T0, T1];
	if (!isEqual(rt.gv(f, "z", (_T = rt.getStep(f, live(A), 0))), rt.sv(f, "z"))) {
		return 0;
	}
	bounds = rt.callSrc(f, "return_coords", []);
	T0 = rt.locate(rt.index(live(bounds), 1), rt.index(live(bounds), 2), rt.sv(f, "z"));
	T1 = rt.locate(rt.index(live(bounds), 3), rt.index(live(bounds), 4), rt.sv(f, "z"));
	if (truthy((rt.isIn(f, live(_T), rt.call(f, P("/proc/block"), null, [live(T0), live(T1)])) ? 1 : 0))) {
		return 1;
	}
	return 0;
});

// /obj/docking_port/mobile/proc/alter_engines  (code/modules/shuttle/shuttle.dm:779)
rt.def("/obj/docking_port/mobile/proc/alter_engines", function alter_engines(f: Frame, mod: Value) {
	let old_coeff: Value = null, delta_coeff: Value = null;
	f.vars = () => [old_coeff, delta_coeff];
	if (isEqual(live(mod), 0)) {
		return live(f.dot);
	}
	old_coeff = rt.sv(f, "engine_coeff");
	rt.setSv(f, "engine_coeff", rt.callSrc(f, "get_engine_coeff", [rt.sv(f, "current_engines"), live(mod)]));
	rt.setSv(f, "current_engines", rt.call(f, P("/proc/max"), null, [0, add(rt.sv(f, "current_engines"), live(mod))]));
	if (!truthy(rt.callSrc(f, "in_flight", []))) return f.dot;
	rt.callSrc(f, "modTimer", [(delta_coeff = divide(rt.sv(f, "engine_coeff"), live(old_coeff)))]);
	return f.dot;
});

// /obj/docking_port/mobile/proc/count_engines  (code/modules/shuttle/shuttle.dm:790)
rt.def("/obj/docking_port/mobile/proc/count_engines", function count_engines(f: Frame) {
	let E: Value = null;
	let $e: any;
	f.vars = () => [E, $e];
	f.dot = 0;
	E = null;
	rt.forList(f, 0, rt.fv(f, "contents", rt.sv(f, "areaInstance")), T("/obj/structure/shuttle/engine"));
	while (($e = rt.next(f, 0)) !== undefined) {
		E = $e;
		if (!(!truthy(live(E)) || truthy(rt.fv(f, "gc_destroyed", live(E))))) {
			f.dot = rt.modify(live(f.dot), rt.fv(f, "engine_power", live(E)), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/docking_port/mobile/proc/get_engine_coeff  (code/modules/shuttle/shuttle.dm:798)
rt.def("/obj/docking_port/mobile/proc/get_engine_coeff", function get_engine_coeff(f: Frame, current: Value, engine_mod: Value) {
	let new_value: Value = null, delta: Value = null, change_per_engine: Value = null;
	f.vars = () => [new_value, delta, change_per_engine];
	if (isEqual((new_value = rt.call(f, P("/proc/max"), null, [0, add(live(current), live(engine_mod))])), rt.sv(f, "initial_engines"))) {
		return 1;
	}
	if (rt.gt(live(new_value), rt.sv(f, "initial_engines"))) {
		delta = subtract(live(new_value), rt.sv(f, "initial_engines"));
		change_per_engine = 0.10000000149011612;
		if (rt.gt(rt.sv(f, "initial_engines"), 0)) {
			change_per_engine = divide(0.5, rt.sv(f, "initial_engines"));
		}
		return rt.call(f, P("/proc/max"), null, [0.5, rt.call(f, P("/proc/min"), null, [subtract(1, multiply(live(delta), live(change_per_engine))), 2])]);
	}
	if (!rt.lt(live(new_value), rt.sv(f, "initial_engines"))) return f.dot;
	delta = subtract(rt.sv(f, "initial_engines"), live(new_value));
	change_per_engine = 1;
	if (rt.gt(rt.sv(f, "initial_engines"), 0)) {
		change_per_engine = divide(1, rt.sv(f, "initial_engines"));
	}
	return rt.call(f, P("/proc/max"), null, [0.5, rt.call(f, P("/proc/min"), null, [add(1, multiply(live(delta), live(change_per_engine))), 2])]);
});

// /obj/docking_port/mobile/proc/in_flight  (code/modules/shuttle/shuttle.dm:816)
rt.def("/obj/docking_port/mobile/proc/in_flight", function in_flight(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "mode");
	if ($0 === "call" || $0 === "recall") {
		return 1;
	} else if ($0 === "idle" || $0 === "igniting") {
		return 0;
	} else {
		return 0;
	}
	return f.dot;
});

// /obj/docking_port/mobile/emergency/proc/in_flight  (code/modules/shuttle/shuttle.dm:825)
rt.def("/obj/docking_port/mobile/emergency/proc/in_flight", function in_flight(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "mode");
	if ($0 === "escape") {
		return 1;
	} else if ($0 === "stranded" || $0 === "endgame: game over") {
		return 0;
	} else {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
});

// /obj/docking_port/mobile/proc/on_emergency_launch  (code/modules/shuttle/shuttle.dm:836)  may sleep
rt.def("/obj/docking_port/mobile/proc/on_emergency_launch", function* on_emergency_launch(f: Frame) {
	if (!isEqual(rt.sv(f, "launch_status"), 0)) return f.dot;
	rt.setSv(f, "launch_status", 1);
	yield* g.srcCall(f, "enterTransit");
	return f.dot;
}, true);

// /obj/docking_port/mobile/proc/on_emergency_dock  (code/modules/shuttle/shuttle.dm:846)
rt.def("/obj/docking_port/mobile/proc/on_emergency_dock", function on_emergency_dock(f: Frame) {
	if (!isEqual(rt.sv(f, "launch_status"), 1)) return f.dot;
	rt.setSv(f, "launch_status", 3);
	return f.dot;
});

// /obj/docking_port/mobile/pod/proc/on_emergency_dock  (code/modules/shuttle/shuttle.dm:850)  may sleep
rt.def("/obj/docking_port/mobile/pod/proc/on_emergency_dock", function* on_emergency_dock(f: Frame) {
	if (!isEqual(rt.sv(f, "launch_status"), 1)) return f.dot;
	yield* g.srcCall(f, "dock", (yield* g.callName(f, rt.gl("SSshuttle"), "getDock", [fmt("＀_away", [rt.sv(f, "id")])])));
	rt.setSv(f, "launch_status", "endgame: game over");
	return f.dot;
}, true);
