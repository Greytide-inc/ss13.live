// Based on /tg/station's code/datums/forced_movement.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(546, "/datum/forced_movement", "/datum", {
	victim: null,
	target: null,
	last_processed: null,
	steps_per_tick: null,
	allow_climbing: null,
	on_step: null,
	moved_at_all: 0,
});

// forced_movement.dm:12
rt.def("/datum/forced_movement/proc/New", function* New(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0.5;
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (f.args[4] === null) {
		f.args[4] = null;
	}
	this.victim = f.args[0];
	this.target = f.args[1];
	this.steps_per_tick = f.args[2];
	this.allow_climbing = f.args[3];
	this.on_step = f.args[4];
	f.dot = (yield* parent_proc());
	if (f.args[0] && f.args[1] && f.args[2] && !f.args[0].force_moving) {
		this.last_processed = rt.worldTime(f);
		f.args[0].force_moving = this;
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSfastprocess.processing += this;
		}
	} else {
		yield* qdel(this);
	}
	return f.dot;
}, true, { args: ["_victim", "_target", "_steps_per_tick", "_allow_climbing", "_on_step"] });

// forced_movement.dm:28
rt.def("/datum/forced_movement/proc/Destroy", function* Destroy(f: Frame) {
	if (this.victim.force_moving == this) {
		this.victim.force_moving = null;
		if (this.moved_at_all) {
			yield* this.victim.forceMove(this.victim.loc);
		}
		this.isprocessing = 0;
		GLOB.SSfastprocess.processing -= this;
	}
	this.victim = null;
	this.target = null;
	return (yield* parent_proc());
}, true);

// forced_movement.dm:38
rt.def("/datum/forced_movement/proc/process", function* process(f: Frame) {
	let steps_to_take: Value = null, i: Value = null;
	let $e: any;
	if (!this.victim || this.victim.gc_destroyed || !this.victim.loc || !this.target || this.target.gc_destroyed || !this.target.loc) {
		yield* qdel(this);
		return f.dot;
	}
	if (!(steps_to_take = round(this.steps_per_tick * (rt.worldTime(f) - this.last_processed)))) return f.dot;
	rt.forRange(f, 0, 1, steps_to_take, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (yield* this.TryMove()) {
			this.moved_at_all = 1;
			if (this.on_step) {
				yield* this.on_step.InvokeAsync();
			}
		} else {
			yield* qdel(this);
			return f.dot;
		}
	}
	rt.endFor(f, 0);
	this.last_processed = rt.worldTime(f);
	return f.dot;
}, true, { waitfor: false });

// forced_movement.dm:54
rt.def("/datum/forced_movement/proc/TryMove", function* TryMove(f: Frame, recursive: Value) {
	recursive ??= 0;
	let vic: Value = this.victim;
	let tar: Value = this.target;
	if (!recursive) {
		f.dot = (yield* step_towards(vic, tar));
	}
	if (!f.dot) {
		if (tar.x > vic.x) {
			if (yield* step(vic, 4)) {
				f.dot = 1;
			}
		} else if (tar.x < vic.x) {
			if (yield* step(vic, 8)) {
				f.dot = 1;
			}
		}
		if (!f.dot) {
			if (tar.y > vic.y) {
				if (yield* step(vic, 1)) {
					f.dot = 1;
				}
			} else if (tar.y < vic.y) {
				if (yield* step(vic, 2)) {
					f.dot = 1;
				}
			}
			if (!f.dot) {
				if (recursive) {
					return 0;
				} else {
					f.dot = (yield* this.TryMove(1));
				}
			}
		}
	}
	f.dot = (f.dot && (vic.loc != tar.loc ? 1 : 0));
	return f.dot;
}, true);

// forced_movement.dm:86
rt.def("/mob/proc/Bump", function* Bump(f: Frame, A: Value) {
	let S: Value = null;
	f.dot = (yield* parent_proc());
	if (!(this.force_moving && this.force_moving.allow_climbing && rt.istype(A, T("/obj/structure")))) return f.dot;
	if (!(S = A).climbable) return f.dot;
	yield* S.do_climb(this);
	return f.dot;
}, true);
