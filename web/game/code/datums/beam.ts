// From code/datums/beam.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(387, "/datum/beam", "/datum", {
	origin: null,
	target: null,
	elements: null,
	base_icon: null,
	icon: null,
	icon_state: "",
	max_distance: 0,
	sleep_time: 3,
	finished: 0,
	target_oldloc: null,
	origin_oldloc: null,
	static_beam: 0,
	timing_id: null,
	recalculating: 0,
	beam_type: rt.typePath("/obj/effect/ebeam"),
});

// /datum/beam/proc/<init>  (code/datums/beam.dm:5)
rt.def("/datum/beam/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "elements", rt.list());
	return f.dot;
});

// /datum/beam/proc/New  (code/datums/beam.dm:20)  may sleep
rt.def("/datum/beam/proc/New", function* New(f: Frame, beam_origin: Value, beam_target: Value, beam_icon: Value, beam_icon_state: Value, time: Value, maxdistance: Value, btype: Value, beam_sleep_time: Value) {
	f.vars = () => [beam_origin, beam_target, beam_icon, beam_icon_state, time, maxdistance, btype, beam_sleep_time];
	if (live(beam_icon) === null) {
		beam_icon = rt.rsc("icons/effects/beam.dmi");
	}
	if (live(beam_icon_state) === null) {
		beam_icon_state = "b_beam";
	}
	if (live(time) === null) {
		time = 50;
	}
	if (live(maxdistance) === null) {
		maxdistance = 10;
	}
	if (live(btype) === null) {
		btype = T("/obj/effect/ebeam");
	}
	if (live(beam_sleep_time) === null) {
		beam_sleep_time = 3;
	}
	rt.setSv(f, "origin", live(beam_origin));
	rt.setSv(f, "origin_oldloc", rt.getStep(f, rt.sv(f, "origin"), 0));
	rt.setSv(f, "target", live(beam_target));
	rt.setSv(f, "target_oldloc", rt.getStep(f, rt.sv(f, "target"), 0));
	rt.setSv(f, "sleep_time", live(beam_sleep_time));
	if ((isEqual(rt.sv(f, "origin_oldloc"), rt.sv(f, "origin")) && isEqual(rt.sv(f, "target_oldloc"), rt.sv(f, "target")))) {
		rt.setSv(f, "static_beam", 1);
	}
	rt.setSv(f, "max_distance", live(maxdistance));
	rt.setSv(f, "base_icon", (yield* g.new_(f, T("/icon"), [live(beam_icon), live(beam_icon_state)])));
	rt.setSv(f, "icon", live(beam_icon));
	rt.setSv(f, "icon_state", live(beam_icon_state));
	rt.setSv(f, "beam_type", live(btype));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/beam/proc/End")])), live(time)]);
	return f.dot;
}, true);

// /datum/beam/proc/Start  (code/datums/beam.dm:35)  may sleep
rt.def("/datum/beam/proc/Start", function* Start(f: Frame) {
	yield* g.srcCall(f, "Draw");
	yield* g.srcCall(f, "recalculate_in", rt.sv(f, "sleep_time"));
	return f.dot;
}, true);

// /datum/beam/proc/recalculate  (code/datums/beam.dm:40)  may sleep
rt.def("/datum/beam/proc/recalculate", function* recalculate(f: Frame) {
	let origin_turf: Value = null, target_turf: Value = null;
	f.vars = () => [origin_turf, target_turf];
	if (truthy(rt.sv(f, "recalculating"))) {
		yield* g.srcCall(f, "recalculate_in", rt.sv(f, "sleep_time"));
		return live(f.dot);
	}
	rt.setSv(f, "recalculating", 1);
	rt.setSv(f, "timing_id", null);
	if ((((truthy(rt.sv(f, "origin")) && truthy(rt.sv(f, "target"))) && rt.lt((yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "origin"), rt.sv(f, "target")])), rt.sv(f, "max_distance"))) && isEqual(rt.fv(f, "z", rt.sv(f, "origin")), rt.fv(f, "z", rt.sv(f, "target"))))) {
		origin_turf = rt.getStep(f, rt.sv(f, "origin"), 0);
		target_turf = rt.getStep(f, rt.sv(f, "target"), 0);
		if ((!truthy(rt.sv(f, "static_beam")) && (!isEqual(live(origin_turf), rt.sv(f, "origin_oldloc")) || !isEqual(live(target_turf), rt.sv(f, "target_oldloc"))))) {
			rt.setSv(f, "origin_oldloc", live(origin_turf));
			rt.setSv(f, "target_oldloc", live(target_turf));
			yield* g.srcCall(f, "Reset");
			yield* g.srcCall(f, "Draw");
		}
		yield* g.srcCall(f, "after_calculate");
		rt.setSv(f, "recalculating", 0);
	} else {
		yield* g.srcCall(f, "End");
	}
	return f.dot;
}, true);

// /datum/beam/proc/recalculate_in  (code/datums/beam.dm:62)  may sleep
rt.def("/datum/beam/proc/recalculate_in", function* recalculate_in(f: Frame, time: Value) {
	f.vars = () => [time];
	if (truthy(rt.sv(f, "timing_id"))) {
		yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "timing_id")]);
	}
	rt.setSv(f, "timing_id", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/beam/proc/recalculate")])), live(time), 8])));
	return f.dot;
}, true);

// /datum/beam/proc/after_calculate  (code/datums/beam.dm:66)  may sleep
rt.def("/datum/beam/proc/after_calculate", function* after_calculate(f: Frame) {
	if ((rt.sv(f, "sleep_time") === null || truthy(rt.sv(f, "finished")))) {
		return live(f.dot);
	}
	if (rt.sv(f, "timing_id") !== null) return f.dot;
	rt.setSv(f, "timing_id", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/beam/proc/recalculate")])), rt.sv(f, "sleep_time"), 8])));
	return f.dot;
}, true);

// /datum/beam/proc/End  (code/datums/beam.dm:73)  may sleep
rt.def("/datum/beam/proc/End", function* End(f: Frame, destroy_self: Value) {
	f.vars = () => [destroy_self];
	if (live(destroy_self) === null) {
		destroy_self = 1;
	}
	rt.setSv(f, "finished", 1);
	if (rt.sv(f, "timing_id") !== null) {
		yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "timing_id")]);
	}
	if (!(!(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) && truthy(live(destroy_self)))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /datum/beam/proc/Reset  (code/datums/beam.dm:79)  may sleep
rt.def("/datum/beam/proc/Reset", function* Reset(f: Frame) {
	let B: Value = null;
	let $e: any;
	f.vars = () => [B, $e];
	B = null;
	rt.forList(f, 0, rt.sv(f, "elements"), T("/obj/effect/ebeam"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(B)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "elements"), "Cut", []);
	return f.dot;
}, true);

// /datum/beam/proc/Destroy  (code/datums/beam.dm:84)  may sleep
rt.def("/datum/beam/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "Reset");
	rt.setSv(f, "target", null);
	rt.setSv(f, "origin", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/beam/proc/Draw  (code/datums/beam.dm:90)  may sleep
rt.def("/datum/beam/proc/Draw", function* Draw(f: Frame) {
	let Angle: Value = null, rot_matrix: Value = null, DX: Value = null, DY: Value = null, N: Value = null, length: Value = null, X: Value = null, II: Value = null, Pixel_x: Value = null, Pixel_y: Value = null, a: Value = null;
	let $0: any, $e: any;
	f.vars = () => [Angle, rot_matrix, DX, DY, N, length, X, II, Pixel_x, Pixel_y, a, $0, $e];
	Angle = (yield* g.call(f, P("/proc/round"), null, [(yield* g.call(f, P("/proc/Get_Angle"), null, [rt.sv(f, "origin"), rt.sv(f, "target")]))]));
	yield* g.callName(f, (rot_matrix = (yield* g.call(f, P("/proc/matrix"), null, []))), "Turn", [live(Angle)]);
	DX = subtract(add(multiply(32, rt.fv(f, "x", rt.sv(f, "target"))), rt.fv(f, "pixel_x", rt.sv(f, "target"))), add(multiply(32, rt.fv(f, "x", rt.sv(f, "origin"))), rt.fv(f, "pixel_x", rt.sv(f, "origin"))));
	DY = subtract(add(multiply(32, rt.fv(f, "y", rt.sv(f, "target"))), rt.fv(f, "pixel_y", rt.sv(f, "target"))), add(multiply(32, rt.fv(f, "y", rt.sv(f, "origin"))), rt.fv(f, "pixel_y", rt.sv(f, "origin"))));
	N = 0;
	length = (yield* g.call(f, P("/proc/round"), null, [rt.op(f, "Sqrt", [], [add(rt.power(live(DX), 2), rt.power(live(DY), 2))])]));
	rt.forRange(f, 0, 0, subtract(live(length), 1), 32);
	while (($e = rt.next(f, 0)) !== undefined) {
		N = $e;
		rt.setFv(f, "owner", (X = (yield* g.new_(f, rt.sv(f, "beam_type"), [rt.sv(f, "origin_oldloc")]))), live(f.src));
		rt.modSrcVar(f, "elements", live(X), add);
		if (rt.gt(add(live(N), 32), live(length))) {
			yield* g.callName(f, (II = (yield* g.new_(f, T("/icon"), [rt.sv(f, "icon"), rt.sv(f, "icon_state")]))), "DrawBox", [null, 1, subtract(live(length), live(N)), 32, 32]);
			rt.setFv(f, "icon", live(X), live(II));
		} else {
			rt.setFv(f, "icon", live(X), rt.sv(f, "base_icon"));
		}
		rt.setFv(f, "transform", live(X), live(rot_matrix));
		Pixel_x = null;
		Pixel_y = null;
		if (isEqual(live(DX), 0)) {
			Pixel_x = 0;
		} else {
			Pixel_x = (yield* g.call(f, P("/proc/round"), null, [add(rt.op(f, "Sin", [], [live(Angle)]), divide(multiply(multiply(32, rt.op(f, "Sin", [], [live(Angle)])), add(live(N), 16)), 32))]));
		}
		if (isEqual(live(DY), 0)) {
			Pixel_y = 0;
		} else {
			Pixel_y = (yield* g.call(f, P("/proc/round"), null, [add(rt.op(f, "Cos", [], [live(Angle)]), divide(multiply(multiply(32, rt.op(f, "Cos", [], [live(Angle)])), add(live(N), 16)), 32))]));
		}
		a = null;
		if (rt.gt(rt.op(f, "Abs", [], [live(Pixel_x)]), 32)) {
			if (rt.gt(live(Pixel_x), 0)) {
				$0 = (yield* g.call(f, P("/proc/round"), null, [divide(live(Pixel_x), 32)]));
			} else {
				$0 = (yield* g.call(f, P("/proc/Ceiling"), null, [divide(live(Pixel_x), 32)]));
			}
			a = $0;
			rt.modField(f, live(X), "x", live(a), add);
			(Pixel_x = rt.modify(live(Pixel_x), 32, rt.modulus));
		}
		if (rt.gt(rt.op(f, "Abs", [], [live(Pixel_y)]), 32)) {
			if (rt.gt(live(Pixel_y), 0)) {
				$0 = (yield* g.call(f, P("/proc/round"), null, [divide(live(Pixel_y), 32)]));
			} else {
				$0 = (yield* g.call(f, P("/proc/Ceiling"), null, [divide(live(Pixel_y), 32)]));
			}
			a = $0;
			rt.modField(f, live(X), "y", live(a), add);
			(Pixel_y = rt.modify(live(Pixel_y), 32, rt.modulus));
		}
		rt.setFv(f, "pixel_x", live(X), live(Pixel_x));
		rt.setFv(f, "pixel_y", live(X), live(Pixel_y));
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "afterDraw");
	return f.dot;
}, true);

rt.type(11216, "/obj/effect/ebeam", "/obj/effect", {
	owner: null,
	anchored: 1,
	mouse_opacity: 0,
});

// /obj/effect/ebeam/proc/Destroy  (code/datums/beam.dm:150)  may sleep
rt.def("/obj/effect/ebeam/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "owner", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /atom/proc/Beam  (code/datums/beam.dm:153)  may sleep
rt.def("/atom/proc/Beam", function* Beam(f: Frame, BeamTarget: Value, icon_state: Value, icon: Value, time: Value, maxdistance: Value, beam_type: Value, beam_sleep_time: Value) {
	let newbeam: Value = null;
	f.vars = () => [BeamTarget, icon_state, icon, time, maxdistance, beam_type, beam_sleep_time, newbeam];
	if (live(icon_state) === null) {
		icon_state = "b_beam";
	}
	if (live(icon) === null) {
		icon = rt.rsc("icons/effects/beam.dmi");
	}
	if (live(time) === null) {
		time = 50;
	}
	if (live(maxdistance) === null) {
		maxdistance = 10;
	}
	if (live(beam_type) === null) {
		beam_type = T("/obj/effect/ebeam");
	}
	if (live(beam_sleep_time) === null) {
		beam_sleep_time = 3;
	}
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [(newbeam = (yield* g.new_(f, T("/datum/beam"), [live(f.src), live(BeamTarget), live(icon), live(icon_state), live(time), live(maxdistance), live(beam_type), live(beam_sleep_time)]))), P("/datum/beam/proc/Start")]);
	return live(newbeam);
}, true);
