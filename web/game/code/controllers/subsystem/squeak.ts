// From code/controllers/subsystem/squeak.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(41, "/datum/controller/subsystem/squeak", "/datum/controller/subsystem", {
	exposed_wires: null,
	name: "Squeak",
	init_order: -40,
	flags: 2,
});

// /datum/controller/subsystem/squeak/proc/New  (code/controllers/subsystem/squeak.dm:5)  may sleep
rt.def("/datum/controller/subsystem/squeak/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSsqueak"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSsqueak"), T("/datum/controller/subsystem/squeak")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSsqueak")]);
		}
		rt.setGl("SSsqueak", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/squeak/proc/<init>  (code/controllers/subsystem/squeak.dm:10)
rt.def("/datum/controller/subsystem/squeak/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "exposed_wires", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/squeak/proc/Initialize  (code/controllers/subsystem/squeak.dm:13)  may sleep
rt.def("/datum/controller/subsystem/squeak/proc/Initialize", function* Initialize(f: Frame, timeofday: Value) {
	f.vars = () => [timeofday];
	yield* g.srcCall(f, "trigger_migration", rt.fv(f, "mice_roundstart", rt.gl("config")));
	return f.dot;
}, true);

// /datum/controller/subsystem/squeak/proc/trigger_migration  (code/controllers/subsystem/squeak.dm:16)  may sleep
rt.def("/datum/controller/subsystem/squeak/proc/trigger_migration", function* trigger_migration(f: Frame, num_mice: Value) {
	let M: Value = null, proposed_turf: Value = null;
	f.vars = () => [num_mice, M, proposed_turf];
	if (live(num_mice) === null) {
		num_mice = 10;
	}
	if (!truthy(live(num_mice))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "find_exposed_wires");
	M = null;
	proposed_turf = null;
	while (rt.gt(live(num_mice), 0) && truthy(rt.len(f, rt.sv(f, "exposed_wires")))) {
		proposed_turf = (yield* g.call(f, P("/proc/pick_n_take"), null, [rt.sv(f, "exposed_wires")]));
		if (!truthy(live(M))) {
			M = (yield* g.new_(f, T("/mob/living/simple_animal/mouse"), [live(proposed_turf)]));
		} else {
			yield* g.callName(f, live(M), "forceMove", [live(proposed_turf)]);
		}
		if (truthy((yield* g.callName(f, live(M), "environment_is_safe", [])))) {
			(num_mice = rt.modify(live(num_mice), 1, subtract));
			M = null;
		}
	}
	return f.dot;
}, true);

// /datum/controller/subsystem/squeak/proc/find_exposed_wires  (code/controllers/subsystem/squeak.dm:34)
rt.def("/datum/controller/subsystem/squeak/proc/find_exposed_wires", function find_exposed_wires(f: Frame) {
	let all_turfs: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [all_turfs, _T, $e];
	rt.callName(f, rt.sv(f, "exposed_wires"), "Cut", []);
	all_turfs = rt.call(f, P("/proc/block"), null, [rt.locate(1, 1, 1), rt.locate(rt.fv(f, "maxx", rt.world()), rt.fv(f, "maxy", rt.world()), 1)]);
	_T = null;
	rt.forList(f, 0, live(all_turfs), T("/turf/open/floor/plating"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy(rt.call(f, P("/proc/is_blocked_turf"), null, [live(_T)]))) {
			continue;
		}
		if (truthy(rt.locateIn(f, T("/obj/structure/cable"), live(_T)))) {
			rt.modSrcVar(f, "exposed_wires", live(_T), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
