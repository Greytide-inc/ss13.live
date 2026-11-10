// Based on /tg/station's code/datums/beam.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


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

// beam.dm:5
rt.def("/datum/beam/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.elements = list();
	return f.dot;
});

// beam.dm:20
rt.def("/datum/beam/proc/New", function* New(f: Frame, beam_origin: Value, beam_target: Value, beam_icon: Value, beam_icon_state: Value, time: Value, maxdistance: Value, btype: Value, beam_sleep_time: Value) {
	beam_icon ??= rt.rsc("icons/effects/beam.dmi");
	beam_icon_state ??= "b_beam";
	time ??= 50;
	maxdistance ??= 10;
	btype ??= T("/obj/effect/ebeam");
	beam_sleep_time ??= 3;
	this.origin = beam_origin;
	this.origin_oldloc = rt.getStep(f, this.origin, 0);
	this.target = beam_target;
	this.target_oldloc = rt.getStep(f, this.target, 0);
	this.sleep_time = beam_sleep_time;
	if (this.origin_oldloc == this.origin && this.target_oldloc == this.target) {
		this.static_beam = 1;
	}
	this.max_distance = maxdistance;
	this.base_icon = (yield* new_(T("/icon"), beam_icon, beam_icon_state));
	this.icon = beam_icon;
	this.icon_state = beam_icon_state;
	this.beam_type = btype;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/beam/proc/End"))), time);
	return f.dot;
}, true);

// beam.dm:35
rt.def("/datum/beam/proc/Start", function* Start(f: Frame) {
	yield* this.Draw();
	yield* this.recalculate_in(this.sleep_time);
	return f.dot;
}, true);

// beam.dm:40
rt.def("/datum/beam/proc/recalculate", function* recalculate(f: Frame) {
	let origin_turf: Value = null, target_turf: Value = null;
	if (this.recalculating) {
		yield* this.recalculate_in(this.sleep_time);
		return f.dot;
	}
	this.recalculating = 1;
	this.timing_id = null;
	if (this.origin && this.target && get_dist(this.origin, this.target) < this.max_distance && this.origin.z == this.target.z) {
		origin_turf = rt.getStep(f, this.origin, 0);
		target_turf = rt.getStep(f, this.target, 0);
		if (!this.static_beam && (origin_turf != this.origin_oldloc || target_turf != this.target_oldloc)) {
			this.origin_oldloc = origin_turf;
			this.target_oldloc = target_turf;
			yield* this.Reset();
			yield* this.Draw();
		}
		yield* this.after_calculate();
		this.recalculating = 0;
	} else {
		yield* this.End();
	}
	return f.dot;
}, true);

// beam.dm:62
rt.def("/datum/beam/proc/recalculate_in", function* recalculate_in(f: Frame, time: Value) {
	if (this.timing_id) {
		yield* deltimer(this.timing_id);
	}
	this.timing_id = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/beam/proc/recalculate"))), time, 8));
	return f.dot;
}, true);

// beam.dm:66
rt.def("/datum/beam/proc/after_calculate", function* after_calculate(f: Frame) {
	if (this.sleep_time === null || this.finished) {
		return f.dot;
	}
	if (this.timing_id !== null) return f.dot;
	this.timing_id = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/beam/proc/recalculate"))), this.sleep_time, 8));
	return f.dot;
}, true);

// beam.dm:73
rt.def("/datum/beam/proc/End", function* End(f: Frame, destroy_self: Value) {
	destroy_self ??= 1;
	this.finished = 1;
	if (this.timing_id !== null) {
		yield* deltimer(this.timing_id);
	}
	if (!(!(!this || this.gc_destroyed) && destroy_self)) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// beam.dm:79
rt.def("/datum/beam/proc/Reset", function* Reset(f: Frame) {
	let B: Value = null;
	for (B of each(this.elements, T("/obj/effect/ebeam"))) {
		yield* qdel(B);
	}
	this.elements.Cut();
	return f.dot;
}, true);

// beam.dm:84
rt.def("/datum/beam/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.Reset();
	this.target = null;
	this.origin = null;
	return (yield* parent_proc());
}, true);

// beam.dm:90
rt.def("/datum/beam/proc/Draw", function* Draw(f: Frame) {
	let rot_matrix: Value = null, X: Value = null, II: Value = null, Pixel_x: Value = null, Pixel_y: Value = null, a: Value = null;
	let $0: any, $e: any;
	let Angle: Value = round(Get_Angle(this.origin, this.target));
	(rot_matrix = matrix()).Turn(Angle);
	let DX: Value = 32 * this.target.x + this.target.pixel_x - (32 * this.origin.x + this.origin.pixel_x);
	let DY: Value = 32 * this.target.y + this.target.pixel_y - (32 * this.origin.y + this.origin.pixel_y);
	let N: Value = 0;
	let length: Value = round(rt.op(f, "Sqrt", [], [DX ** 2 + DY ** 2]));
	rt.forRange(f, 0, 0, length - 1, 32);
	while (($e = rt.next(f, 0)) !== undefined) {
		N = $e;
		(X = (yield* new_(this.beam_type, this.origin_oldloc))).owner = this;
		this.elements += X;
		if (N + 32 > length) {
			(II = (yield* new_(T("/icon"), this.icon, this.icon_state))).DrawBox(null, 1, length - N, 32, 32);
			X.icon = II;
		} else {
			X.icon = this.base_icon;
		}
		X.transform = rot_matrix;
		Pixel_x = null;
		Pixel_y = null;
		if (DX == 0) {
			Pixel_x = 0;
		} else {
			Pixel_x = round(rt.op(f, "Sin", [], [Angle]) + 32 * rt.op(f, "Sin", [], [Angle]) * (N + 16) / 32);
		}
		if (DY == 0) {
			Pixel_y = 0;
		} else {
			Pixel_y = round(rt.op(f, "Cos", [], [Angle]) + 32 * rt.op(f, "Cos", [], [Angle]) * (N + 16) / 32);
		}
		a = null;
		if (rt.op(f, "Abs", [], [Pixel_x]) > 32) {
			if (Pixel_x > 0) {
				$0 = round(Pixel_x / 32);
			} else {
				$0 = Ceiling(Pixel_x / 32);
			}
			a = $0;
			X.x += a;
			Pixel_x %= 32;
		}
		if (rt.op(f, "Abs", [], [Pixel_y]) > 32) {
			if (Pixel_y > 0) {
				$0 = round(Pixel_y / 32);
			} else {
				$0 = Ceiling(Pixel_y / 32);
			}
			a = $0;
			X.y += a;
			Pixel_y %= 32;
		}
		X.pixel_x = Pixel_x;
		X.pixel_y = Pixel_y;
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	rt.endFor(f, 0);
	this.afterDraw();
	return f.dot;
}, true);

rt.type(11216, "/obj/effect/ebeam", "/obj/effect", {
	owner: null,
	anchored: 1,
	mouse_opacity: 0,
});

// beam.dm:150
rt.def("/obj/effect/ebeam/proc/Destroy", function* Destroy(f: Frame) {
	this.owner = null;
	return (yield* parent_proc());
}, true);

// beam.dm:153
rt.def("/atom/proc/Beam", function* Beam(f: Frame, BeamTarget: Value, icon_state: Value, icon: Value, time: Value, maxdistance: Value, beam_type: Value, beam_sleep_time: Value) {
	let newbeam: Value = null;
	icon_state ??= "b_beam";
	icon ??= rt.rsc("icons/effects/beam.dmi");
	time ??= 50;
	maxdistance ??= 10;
	beam_type ??= T("/obj/effect/ebeam");
	beam_sleep_time ??= 3;
	yield* ImmediateInvokeAsync((newbeam = (yield* new_(T("/datum/beam"), this, BeamTarget, icon, icon_state, time, maxdistance, beam_type, beam_sleep_time))), P("/datum/beam/proc/Start"));
	return newbeam;
}, true);
