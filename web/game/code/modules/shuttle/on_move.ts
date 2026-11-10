// Based on /tg/station's code/modules/shuttle/on_move.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// on_move.dm:8
rt.def("/atom/movable/proc/onShuttleMove", function* onShuttleMove(f: Frame, T1: Value, rotation: Value, knockdown: Value) {
	knockdown ??= 1;
	if (rotation) {
		yield* this.shuttleRotate(rotation);
	}
	this.loc = T1;
	if (rt.length(this.client_mobs_in_contents)) {
		yield* this.update_parallax_contents();
	}
	return 1;
}, true);

// on_move.dm:20
rt.def("/obj/proc/onShuttleMove", function* onShuttleMove(f: Frame) {
	if (this.invisibility >= INVISIBILITY_ABSTRACT) {
		return 0;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// on_move.dm:30
rt.def("/obj/machinery/door/airlock/proc/onShuttleMove", function* onShuttleMove(f: Frame) {
	let A: Value = null;
	this.shuttledocked = 0;
	for (A of each(range(1, this), T("/obj/machinery/door/airlock"))) {
		A.shuttledocked = 0;
		A.air_tight = 1;
		yield* ImmediateInvokeAsync(A, P("/obj/machinery/door/proc/close"));
	}
	f.dot = (yield* parent_proc());
	this.shuttledocked = 1;
	A = null;
	for (A of each(range(1, this), T("/obj/machinery/door/airlock"))) {
		A.shuttledocked = 1;
	}
	return f.dot;
}, true);

// on_move.dm:39
rt.def("/mob/proc/onShuttleMove", function* onShuttleMove(f: Frame) {
	if (!this.move_on_shuttle) {
		return 0;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) {
		return f.dot;
	}
	if (!this.client) return f.dot;
	if (this.buckled) {
		shake_camera(this, 2, 1);
	} else {
		shake_camera(this, 7, 1);
	}
	return f.dot;
}, true);

// on_move.dm:51
rt.def("/mob/living/carbon/proc/onShuttleMove", function* onShuttleMove(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) {
		return f.dot;
	}
	if (!(!this.buckled && f.args[2])) return f.dot;
	yield* this.Knockdown(60);
	return f.dot;
}, true, { args: ["T1", "rotation", "knockdown"] });

// on_move.dm:59
rt.def("/obj/effect/abstract/proximity_checker/proc/onShuttleMove", function* onShuttleMove(f: Frame) {
	yield* addtimer((yield* new_(T("/datum/callback"), this.monitor, P("/datum/proximity_monitor/proc/SetRange"), this.monitor.current_range, 1)), 0, 1);
	return f.dot;
}, true);

// on_move.dm:65
rt.def("/atom/proc/shuttleRotate", function* shuttleRotate(f: Frame, rotation: Value) {
	let oldPX: Value = null, oldPY: Value = null;
	yield* this.setDir(angle2dir(rotation + dir2angle(this.dir)));
	if (this.smooth) {
		queue_smooth(this);
	}
	if (!(this.pixel_x || this.pixel_y)) return f.dot;
	if (rotation < 0) {
		rotation += 360;
	}
	let turntimes: Value = rotation / 90;
	while (turntimes > 0) {
		oldPX = this.pixel_x;
		this.pixel_x = (oldPY = this.pixel_y);
		this.pixel_y = oldPX * -1;
		turntimes--;
	}
	return f.dot;
}, true);
