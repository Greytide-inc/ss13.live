// Based on /tg/station's code/controllers/subsystem/throwing.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;
// stress-throw: TG_STRESS_COUNTS=1 counts the ends of blast throws (throw_impact calls, whether on a thing or the landing turf)
function impactCount(f: Frame) { if (rt.sv(f, "blast_epi") !== null && rt.call(f, P("/proc/stress_counts_on"), null, [])) rt.call(f, P("/proc/stress_count"), null, ["blast_impacts", 1]); }


rt.type(45, "/datum/controller/subsystem/throwing", "/datum/controller/subsystem", {
	currentrun: null,
	processing: null,
	name: "Throwing",
	priority: 25,
	wait: 1,
	flags: 49,
	runlevels: 12,
});

// throwing.dm:4
rt.def("/datum/controller/subsystem/throwing/proc/New", function* New(f: Frame) {
	if (GLOB.SSthrowing != this) {
		if (rt.istype(GLOB.SSthrowing, T("/datum/controller/subsystem/throwing"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSthrowing);
		}
		GLOB.SSthrowing = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// throwing.dm:12
rt.def("/datum/controller/subsystem/throwing/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.processing = list();
	return f.dot;
});

// throwing.dm:15
rt.def("/datum/controller/subsystem/throwing/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* parent_proc(`P:${rt.len(f, this.processing)}`);
	return f.dot;
}, true);

// throwing.dm:19
rt.def("/datum/controller/subsystem/throwing/proc/fire", function* fire(f: Frame, resumed: Value) {
	let AM: Value = null, TT: Value = null;
	let $0: any;
	resumed ??= 0;
	if (!resumed) {
		this.currentrun = (yield* this.processing.Copy());
	}
	let currentrun: Value = this.currentrun;
	while (rt.length(currentrun)) {
		AM = rt.index(currentrun, rt.len(f, currentrun));
		TT = rt.index(currentrun, AM);
		currentrun.len--;
		if (!AM || !TT) {
			this.processing -= AM;
			if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2) {
				$0 = this.pause();
			} else {
				$0 = 0;
			}
			if ($0) {
				return f.dot;
			}
			continue;
		}
		yield* TT.tick();
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2) {
			$0 = this.pause();
		} else {
			$0 = 0;
		}
		if ($0) {
			return f.dot;
		}
	}
	currentrun = null;
	return f.dot;
}, true);

rt.type(360, "/datum/thrownthing", "/datum", {
	thrownthing: null,
	target: null,
	target_turf: null,
	init_dir: null,
	maxrange: null,
	speed: null,
	thrower: null,
	diagonals_first: null,
	dist_travelled: 0,
	start_time: null,
	dist_x: null,
	dist_y: null,
	dx: null,
	dy: null,
	pure_diagonal: null,
	diagonal_error: null,
	callback: null,
	start_loc: null,
	blast_epi: null,
});

// throwing.dm:62
rt.def("/datum/thrownthing/proc/tick", function* tick(f: Frame) {
	let AM: Value = null, step: Value = null;
	let $1: any, $t: any;
	if (!isturf((AM = this.thrownthing).loc) || !AM.throwing) {
		yield* this.finalize();
		return f.dot;
	}
	if (this.dist_travelled && this.hitcheck()) {
		yield* this.finalize();
		return f.dot;
	}
	let $0: any = (rt.worldTime(f) + rt.world().tick_lag - this.start_time) * this.speed;
	if (this.dist_travelled) {
		$1 = this.dist_travelled;
	} else {
		$1 = -1;
	}
	let tilestomove: Value = Ceiling(min($0 - $1, this.speed * MAX_TICKS_TO_MAKE_UP) * (rt.world().tick_lag * GLOB.SSthrowing.wait));
	while (($t = tilestomove, tilestomove = rt.inc($t, -1), $t) > 0) {
		if ((this.dist_travelled >= this.maxrange || AM.loc == this.target_turf) && AM.has_gravity(AM.loc)) {
			yield* this.finalize();
			return f.dot;
		}
		if (this.dist_travelled <= max(this.dist_x, this.dist_y)) {
			step = rt.getStep(f, AM, rt.getDir(f, AM, this.target_turf));
		} else {
			step = rt.getStep(f, AM, this.init_dir);
		}
		if (!this.pure_diagonal && !this.diagonals_first) {
			if (this.diagonal_error >= 0 && max(this.dist_x, this.dist_y) - this.dist_travelled != 1) {
				step = rt.getStep(f, AM, this.dx);
			}
			this.diagonal_error += this.diagonal_error < 0 ? this.dist_x / 2 : -this.dist_y;
		}
		if (!step) {
			yield* this.finalize();
			return f.dot;
		}
		yield* AM.Move(step, rt.getDir(f, AM, step));
		if (!AM.throwing) {
			yield* this.finalize({ hit: 1 });
			return f.dot;
		}
		this.dist_travelled++;
		if (this.dist_travelled > MAX_THROWING_DIST) {
			yield* this.finalize();
			return f.dot;
		}
	}
	return f.dot;
}, true);

// throwing.dm:108
rt.def("/datum/thrownthing/proc/finalize", function* finalize(f: Frame, hit: Value) {
	let thing: Value = null, A: Value = null;
	hit ??= 0;
	GLOB.SSthrowing.processing -= this.thrownthing;
	this.thrownthing.throwing = null;
	if (this.blast_epi !== null && rt.call(f, P("/proc/stress_counts_on"), null, [])) { // stress-throw: TG_STRESS_COUNTS=1 counts how blast throws end
		const end = this.thrownthing.loc;
		rt.call(f, P("/proc/stress_count"), null, ["blast_done", 1]);
		if (end != this.start_loc) rt.call(f, P("/proc/stress_count"), null, ["blast_moved", 1]);
		if (rt.call(f, P("/proc/get_dist"), null, [end, this.blast_epi]) <= 28) rt.call(f, P("/proc/stress_count"), null, ["blast_end_in_area", 1]);
		rt.call(f, P("/proc/stress_count"), null, ["blast_dist_sum", this.dist_travelled]);
		if (hit) rt.call(f, P("/proc/stress_count"), null, ["blast_hit_flag", 1]);
	}
	if (!hit) {
		for (thing of each(rt.getStep(f, this.thrownthing, 0))) {
			if ((A = thing) == this.target) {
				hit = 1;
				impactCount(f);
				yield* this.thrownthing.throw_impact(A, this);
				break;
			}
		}
		if (!hit) {
			impactCount(f);
			yield* this.thrownthing.throw_impact(rt.getStep(f, this.thrownthing, 0), this);
			yield* this.thrownthing.newtonian_move(this.init_dir);
		}
	} else {
		yield* this.thrownthing.newtonian_move(this.init_dir);
	}
	if (!this.callback) return f.dot;
	yield* this.callback.Invoke();
	return f.dot;
}, true, { waitfor: false });

// throwing.dm:127
rt.def("/datum/thrownthing/proc/hit_atom", function* hit_atom(f: Frame, A: Value) {
	impactCount(f);
	yield* this.thrownthing.throw_impact(A, this);
	yield* this.thrownthing.newtonian_move(this.init_dir);
	yield* this.finalize(1);
	return f.dot;
}, true);

// throwing.dm:132
rt.def("/datum/thrownthing/proc/hitcheck", function hitcheck(f: Frame) {
	let thing: Value = null, AM: Value = null;
	for (thing of each(rt.getStep(f, this.thrownthing, 0))) {
		if ((AM = thing) == this.thrownthing) {
			continue;
		}
		if (AM.density && !rt.bitAnd(AM.pass_flags, 32) && !rt.bitAnd(AM.flags, 512)) {
			this.thrownthing.throwing = null;
			impactCount(f);
			this.thrownthing.throw_impact(AM, this);
			return 1;
		}
	}
	return f.dot;
});
