// From code/controllers/subsystem/throwing.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;
// stress-throw: TG_STRESS_COUNTS=1 counts the ends of blast throws (throw_impact calls, whether on a thing or the landing turf)
function impactCount(f: Frame) { if (rt.sv(f, "blast_epi") !== null && truthy(rt.call(f, P("/proc/stress_counts_on"), null, []))) rt.call(f, P("/proc/stress_count"), null, ["blast_impacts", 1]); }


rt.type(45, "/datum/controller/subsystem/throwing", "/datum/controller/subsystem", {
	currentrun: null,
	processing: null,
	name: "Throwing",
	priority: 25,
	wait: 1,
	flags: 49,
	runlevels: 12,
});

// /datum/controller/subsystem/throwing/proc/New  (code/controllers/subsystem/throwing.dm:4)  may sleep
rt.def("/datum/controller/subsystem/throwing/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSthrowing"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSthrowing"), T("/datum/controller/subsystem/throwing")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSthrowing")]);
		}
		rt.setGl("SSthrowing", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/throwing/proc/<init>  (code/controllers/subsystem/throwing.dm:12)
rt.def("/datum/controller/subsystem/throwing/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "processing", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/throwing/proc/stat_entry  (code/controllers/subsystem/throwing.dm:15)  may sleep
rt.def("/datum/controller/subsystem/throwing/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* g.callSuper(f, [fmt("P:＀", [rt.len(f, rt.sv(f, "processing"))])]);
	return f.dot;
}, true);

// /datum/controller/subsystem/throwing/proc/fire  (code/controllers/subsystem/throwing.dm:19)  may sleep
rt.def("/datum/controller/subsystem/throwing/proc/fire", function* fire(f: Frame, resumed: Value) {
	let currentrun: Value = null, AM: Value = null, TT: Value = null;
	let $0: any;
	f.vars = () => [resumed, currentrun, AM, TT, $0];
	if (live(resumed) === null) {
		resumed = 0;
	}
	if (!truthy(live(resumed))) {
		rt.setFv(f, "currentrun", live(f.src), (yield* g.callName(f, rt.sv(f, "processing"), "Copy", [])));
	}
	currentrun = rt.fv(f, "currentrun", live(f.src));
	while (truthy(rt.length(live(currentrun)))) {
		AM = rt.index(live(currentrun), rt.len(f, live(currentrun)));
		TT = rt.index(live(currentrun), live(AM));
		rt.incField(f, live(currentrun), "len", -1, true);
		if ((!truthy(live(AM)) || !truthy(live(TT)))) {
			(rt.modSrcVar(f, "processing", live(AM), subtract));
			if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
				$0 = (yield* g.srcCall(f, "pause"));
			} else {
				$0 = 0;
			}
			if (truthy($0)) {
				return live(f.dot);
			}
			continue;
		}
		yield* g.callName(f, live(TT), "tick", []);
		if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
			$0 = (yield* g.srcCall(f, "pause"));
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			return live(f.dot);
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

// /datum/thrownthing/proc/tick  (code/controllers/subsystem/throwing.dm:62)  may sleep
rt.def("/datum/thrownthing/proc/tick", function* tick(f: Frame) {
	let AM: Value = null, step: Value = null, tilestomove: Value = null;
	let $0: any, $1: any, $t: any;
	f.vars = () => [AM, step, tilestomove, $0, $1, $t];
	if ((!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.gv(f, "loc", (AM = rt.sv(f, "thrownthing")))]))) || !truthy(rt.fv(f, "throwing", live(AM))))) {
		yield* g.srcCall(f, "finalize");
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "dist_travelled")) && truthy((yield* g.srcCall(f, "hitcheck"))))) {
		yield* g.srcCall(f, "finalize");
		return live(f.dot);
	}
	step = null;
	$0 = multiply(subtract(add(rt.worldTime(f), rt.fv(f, "tick_lag", rt.world())), rt.sv(f, "start_time")), rt.sv(f, "speed"));
	if (truthy(rt.sv(f, "dist_travelled"))) {
		$1 = rt.sv(f, "dist_travelled");
	} else {
		$1 = -1;
	}
	tilestomove = (yield* g.call(f, P("/proc/Ceiling"), null, [multiply((yield* g.call(f, P("/proc/min"), null, [subtract($0, $1), multiply(rt.sv(f, "speed"), 3)])), multiply(rt.fv(f, "tick_lag", rt.world()), rt.fv(f, "wait", rt.gl("SSthrowing"))))]));
	while (rt.gt(($t = live(tilestomove), tilestomove = rt.inc($t, -1), $t), 0)) {
		if (((rt.ge(rt.sv(f, "dist_travelled"), rt.sv(f, "maxrange")) || isEqual(rt.fv(f, "loc", live(AM)), rt.sv(f, "target_turf"))) && truthy((yield* g.callName(f, live(AM), "has_gravity", [rt.fv(f, "loc", live(AM))]))))) {
			yield* g.srcCall(f, "finalize");
			return live(f.dot);
		}
		if (rt.le(rt.sv(f, "dist_travelled"), (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "dist_x"), rt.sv(f, "dist_y")])))) {
			step = rt.getStep(f, live(AM), rt.getDir(f, live(AM), rt.sv(f, "target_turf")));
		} else {
			step = rt.getStep(f, live(AM), rt.sv(f, "init_dir"));
		}
		if ((!truthy(rt.sv(f, "pure_diagonal")) && !truthy(rt.sv(f, "diagonals_first")))) {
			if ((rt.ge(rt.sv(f, "diagonal_error"), 0) && !isEqual(subtract((yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "dist_x"), rt.sv(f, "dist_y")])), rt.sv(f, "dist_travelled")), 1))) {
				step = rt.getStep(f, live(AM), rt.sv(f, "dx"));
			}
			if (rt.lt(rt.sv(f, "diagonal_error"), 0)) {
				$0 = divide(rt.sv(f, "dist_x"), 2);
			} else {
				$0 = rt.neg(rt.sv(f, "dist_y"));
			}
			rt.modSrcVar(f, "diagonal_error", $0, add);
		}
		if (!truthy(live(step))) {
			yield* g.srcCall(f, "finalize");
			return live(f.dot);
		}
		yield* g.callName(f, live(AM), "Move", [live(step), rt.getDir(f, live(AM), live(step))]);
		if (!truthy(rt.fv(f, "throwing", live(AM)))) {
			yield* g.callSrc(f, "finalize", ["hit", 1], rt.Args.Named);
			return live(f.dot);
		}
		rt.incSrcVar(f, "dist_travelled", 1, true);
		if (rt.gt(rt.sv(f, "dist_travelled"), 512)) {
			yield* g.srcCall(f, "finalize");
			return live(f.dot);
		}
	}
	return f.dot;
}, true);

// /datum/thrownthing/proc/finalize  (code/controllers/subsystem/throwing.dm:108)  may sleep
rt.def("/datum/thrownthing/proc/finalize", function* finalize(f: Frame, hit: Value) {
	let thing: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [hit, thing, A, $e];
	if (live(hit) === null) {
		hit = 0;
	}
	(rt.modField(f, rt.gl("SSthrowing"), "processing", rt.sv(f, "thrownthing"), subtract));
	rt.setFv(f, "throwing", rt.sv(f, "thrownthing"), null);
	if (rt.sv(f, "blast_epi") !== null && truthy(rt.call(f, P("/proc/stress_counts_on"), null, []))) { // stress-throw: TG_STRESS_COUNTS=1 counts how blast throws end
		const end = rt.fv(f, "loc", rt.sv(f, "thrownthing"));
		rt.call(f, P("/proc/stress_count"), null, ["blast_done", 1]);
		if (!isEqual(end, rt.sv(f, "start_loc"))) rt.call(f, P("/proc/stress_count"), null, ["blast_moved", 1]);
		if (truthy(rt.le(rt.call(f, P("/proc/get_dist"), null, [end, rt.sv(f, "blast_epi")]), 28))) rt.call(f, P("/proc/stress_count"), null, ["blast_end_in_area", 1]);
		rt.call(f, P("/proc/stress_count"), null, ["blast_dist_sum", rt.sv(f, "dist_travelled")]);
		if (truthy(live(hit))) rt.call(f, P("/proc/stress_count"), null, ["blast_hit_flag", 1]);
	}
	if (!truthy(live(hit))) {
		thing = null;
		rt.forList(f, 0, rt.getStep(f, rt.sv(f, "thrownthing"), 0));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing = $e;
			if (isEqual((A = live(thing)), rt.sv(f, "target"))) {
				hit = 1;
				impactCount(f);
				yield* g.callName(f, rt.sv(f, "thrownthing"), "throw_impact", [live(A), live(f.src)]);
				break;
			}
		}
		rt.endFor(f, 0);
		if (!truthy(live(hit))) {
			impactCount(f);
			yield* g.callName(f, rt.sv(f, "thrownthing"), "throw_impact", [rt.getStep(f, rt.sv(f, "thrownthing"), 0), live(f.src)]);
			yield* g.callName(f, rt.sv(f, "thrownthing"), "newtonian_move", [rt.sv(f, "init_dir")]);
		}
	} else {
		yield* g.callName(f, rt.sv(f, "thrownthing"), "newtonian_move", [rt.sv(f, "init_dir")]);
	}
	if (!truthy(rt.sv(f, "callback"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "callback"), "Invoke", []);
	return f.dot;
}, true, { waitfor: false });

// /datum/thrownthing/proc/hit_atom  (code/controllers/subsystem/throwing.dm:127)  may sleep
rt.def("/datum/thrownthing/proc/hit_atom", function* hit_atom(f: Frame, A: Value) {
	f.vars = () => [A];
	impactCount(f);
	yield* g.callName(f, rt.sv(f, "thrownthing"), "throw_impact", [live(A), live(f.src)]);
	yield* g.callName(f, rt.sv(f, "thrownthing"), "newtonian_move", [rt.sv(f, "init_dir")]);
	yield* g.srcCall(f, "finalize", 1);
	return f.dot;
}, true);

// /datum/thrownthing/proc/hitcheck  (code/controllers/subsystem/throwing.dm:132)
rt.def("/datum/thrownthing/proc/hitcheck", function hitcheck(f: Frame) {
	let thing: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [thing, AM, $e];
	thing = null;
	rt.forList(f, 0, rt.getStep(f, rt.sv(f, "thrownthing"), 0));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (isEqual((AM = live(thing)), rt.sv(f, "thrownthing"))) {
			continue;
		}
		if (((truthy(rt.fv(f, "density", live(AM))) && !truthy(rt.bitAnd(rt.fv(f, "pass_flags", live(AM)), 32))) && !truthy(rt.bitAnd(rt.fv(f, "flags", live(AM)), 512)))) {
			rt.setFv(f, "throwing", rt.sv(f, "thrownthing"), null);
			impactCount(f);
			rt.callName(f, rt.sv(f, "thrownthing"), "throw_impact", [live(AM), live(f.src)]);
			return 1;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
