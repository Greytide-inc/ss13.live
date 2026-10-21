// From code/controllers/subsystem/air.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13, "/datum/controller/subsystem/air", "/datum/controller/subsystem", {
	cost_turfs: 0,
	cost_groups: 0,
	cost_highpressure: 0,
	cost_hotspots: 0,
	cost_superconductivity: 0,
	cost_pipenets: 0,
	cost_atmos_machinery: 0,
	excited_groups: null,
	active_turfs: null,
	hotspots: null,
	networks: null,
	atmos_machinery: null,
	active_super_conductivity: null,
	high_pressure_delta: null,
	currentrun: null,
	currentpart: 1,
	map_loading: 1,
	queued_for_activation: null,
	gas_reactions: null,
	name: "Atmospherics",
	init_order: -1,
	priority: 20,
	wait: 5,
	flags: 4,
	runlevels: 12,
});

// /datum/controller/subsystem/air/proc/New  (code/controllers/subsystem/air.dm:9)  may sleep
rt.def("/datum/controller/subsystem/air/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSair"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSair"), T("/datum/controller/subsystem/air")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSair")]);
		}
		rt.setGl("SSair", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/air/proc/<init>  (code/controllers/subsystem/air.dm:25)
rt.def("/datum/controller/subsystem/air/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "excited_groups", rt.list());
	$0 = $0;
	rt.setSv(f, "active_turfs", rt.list());
	$0 = $0;
	rt.setSv(f, "hotspots", rt.list());
	$0 = $0;
	rt.setSv(f, "networks", rt.list());
	$0 = $0;
	rt.setSv(f, "atmos_machinery", rt.list());
	$0 = $0;
	rt.setSv(f, "active_super_conductivity", rt.list());
	$0 = $0;
	rt.setSv(f, "high_pressure_delta", rt.list());
	$0 = $0;
	rt.setSv(f, "currentrun", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/air/proc/stat_entry  (code/controllers/subsystem/air.dm:45)  may sleep
rt.def("/datum/controller/subsystem/air/proc/stat_entry", function* stat_entry(f: Frame, msg: Value) {
	let $0: any;
	f.vars = () => [msg, $0];
	msg = rt.modify(live(msg), "C:{", add);
	msg = rt.modify(live(msg), fmt("AT:＀|", [(yield* g.call(f, P("/proc/round"), null, [rt.sv(f, "cost_turfs"), 1]))]), add);
	msg = rt.modify(live(msg), fmt("EG:＀|", [(yield* g.call(f, P("/proc/round"), null, [rt.sv(f, "cost_groups"), 1]))]), add);
	msg = rt.modify(live(msg), fmt("HP:＀|", [(yield* g.call(f, P("/proc/round"), null, [rt.sv(f, "cost_highpressure"), 1]))]), add);
	msg = rt.modify(live(msg), fmt("HS:＀|", [(yield* g.call(f, P("/proc/round"), null, [rt.sv(f, "cost_hotspots"), 1]))]), add);
	msg = rt.modify(live(msg), fmt("SC:＀|", [(yield* g.call(f, P("/proc/round"), null, [rt.sv(f, "cost_superconductivity"), 1]))]), add);
	msg = rt.modify(live(msg), fmt("PN:＀|", [(yield* g.call(f, P("/proc/round"), null, [rt.sv(f, "cost_pipenets"), 1]))]), add);
	msg = rt.modify(live(msg), fmt("AM:＀", [(yield* g.call(f, P("/proc/round"), null, [rt.sv(f, "cost_atmos_machinery"), 1]))]), add);
	msg = rt.modify(live(msg), "} ", add);
	msg = rt.modify(live(msg), fmt("AT:＀|", [rt.len(f, rt.sv(f, "active_turfs"))]), add);
	msg = rt.modify(live(msg), fmt("EG:＀|", [rt.len(f, rt.sv(f, "excited_groups"))]), add);
	msg = rt.modify(live(msg), fmt("HS:＀|", [rt.len(f, rt.sv(f, "hotspots"))]), add);
	msg = rt.modify(live(msg), fmt("PN:＀|", [rt.len(f, rt.sv(f, "networks"))]), add);
	msg = rt.modify(live(msg), fmt("HP:＀|", [rt.len(f, rt.sv(f, "high_pressure_delta"))]), add);
	msg = rt.modify(live(msg), fmt("AS:＀|", [rt.len(f, rt.sv(f, "active_super_conductivity"))]), add);
	if (truthy(rt.sv(f, "cost"))) {
		$0 = divide(rt.len(f, rt.sv(f, "active_turfs")), rt.sv(f, "cost"));
	} else {
		$0 = 0;
	}
	yield* g.callSuper(f, [(msg = rt.modify(live(msg), fmt("AT/MS:＀", [(yield* g.call(f, P("/proc/round"), null, [$0, 0.10000000149011612]))]), add))]);
	return f.dot;
}, true);

// /datum/controller/subsystem/air/proc/Initialize  (code/controllers/subsystem/air.dm:66)  may sleep
rt.def("/datum/controller/subsystem/air/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "map_loading", 0);
	yield* g.srcCall(f, "setup_allturfs");
	yield* g.srcCall(f, "setup_atmos_machinery");
	yield* g.srcCall(f, "setup_pipenets");
	rt.setSv(f, "gas_reactions", (yield* g.call(f, P("/proc/init_gas_reactions"), null, [])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["timeofday"] });

// /datum/controller/subsystem/air/proc/fire  (code/controllers/subsystem/air.dm:76)  may sleep
rt.def("/datum/controller/subsystem/air/proc/fire", function* fire(f: Frame, resumed: Value) {
	let timer: Value = null;
	f.vars = () => [resumed, timer];
	if (live(resumed) === null) {
		resumed = 0;
	}
	// stress2c: no pipe may be without its pipeline when the pipenets and atmos machines run (a singularity pass that slept
	// somewhere unexpected with its rebuilds still waiting)
	if (rt.gl("pipe_rebuild_defer") !== null) rt.call(f, P("/proc/flush_pipe_rebuilds"), null, []);
	if (!truthy(live(resumed)) && truthy(rt.call(f, P("/proc/stress_counts_on"), null, []))) {
		let moles = 0, nopipes = 0, members = 0, machines = 0, net: Value = null, $e: any;
		rt.forList(f, 0, rt.sv(f, "networks"));
		while (($e = rt.next(f, 0)) !== undefined) {
			net = $e;
			if (truthy(rt.fv(f, "air", live(net)))) moles += Number(rt.callName(f, rt.fv(f, "air", live(net)), "total_moles", []));
			const m = Number(rt.len(f, rt.fv(f, "members", live(net))));
			members += m; if (!m) nopipes++;
			machines += Number(rt.len(f, rt.fv(f, "other_atmosmch", live(net))));
		}
		rt.endFor(f, 0);
		rt.call(f, P("/proc/stress_set"), null, ["pipelines_without_pipes", nopipes]);
		rt.call(f, P("/proc/stress_set"), null, ["pipeline_pipes", members]);
		rt.call(f, P("/proc/stress_set"), null, ["pipeline_machines", machines]);
		rt.call(f, P("/proc/stress_set"), null, ["pipelines", rt.len(f, rt.sv(f, "networks"))]);
		rt.call(f, P("/proc/stress_set"), null, ["pipeline_moles", moles]);
	}
	timer = rt.tickUsage(f);
	if ((isEqual(rt.sv(f, "currentpart"), 1) || !truthy(live(resumed)))) {
		yield* g.srcCall(f, "process_pipenets", live(resumed));
		rt.setSv(f, "cost_pipenets", add(multiply(0.800000011920929, rt.sv(f, "cost_pipenets")), multiply(0.20000000298023224, multiply(subtract(rt.tickUsage(f), live(timer)), rt.fv(f, "tick_lag", rt.world())))));
		if (!isEqual(rt.sv(f, "state"), 2)) {
			return live(f.dot);
		}
		resumed = 0;
		rt.setSv(f, "currentpart", 2);
	}
	if (isEqual(rt.sv(f, "currentpart"), 2)) {
		timer = rt.tickUsage(f);
		yield* g.srcCall(f, "process_atmos_machinery", live(resumed));
		rt.setSv(f, "cost_atmos_machinery", add(multiply(0.800000011920929, rt.sv(f, "cost_atmos_machinery")), multiply(0.20000000298023224, multiply(subtract(rt.tickUsage(f), live(timer)), rt.fv(f, "tick_lag", rt.world())))));
		if (!isEqual(rt.sv(f, "state"), 2)) {
			return live(f.dot);
		}
		resumed = 0;
		rt.setSv(f, "currentpart", 3);
	}
	if (isEqual(rt.sv(f, "currentpart"), 3)) {
		timer = rt.tickUsage(f);
		yield* g.srcCall(f, "process_active_turfs", live(resumed));
		rt.setSv(f, "cost_turfs", add(multiply(0.800000011920929, rt.sv(f, "cost_turfs")), multiply(0.20000000298023224, multiply(subtract(rt.tickUsage(f), live(timer)), rt.fv(f, "tick_lag", rt.world())))));
		if (!isEqual(rt.sv(f, "state"), 2)) {
			return live(f.dot);
		}
		resumed = 0;
		rt.setSv(f, "currentpart", 4);
	}
	if (isEqual(rt.sv(f, "currentpart"), 4)) {
		timer = rt.tickUsage(f);
		yield* g.srcCall(f, "process_excited_groups", live(resumed));
		rt.setSv(f, "cost_groups", add(multiply(0.800000011920929, rt.sv(f, "cost_groups")), multiply(0.20000000298023224, multiply(subtract(rt.tickUsage(f), live(timer)), rt.fv(f, "tick_lag", rt.world())))));
		if (!isEqual(rt.sv(f, "state"), 2)) {
			return live(f.dot);
		}
		resumed = 0;
		rt.setSv(f, "currentpart", 5);
	}
	if (isEqual(rt.sv(f, "currentpart"), 5)) {
		timer = rt.tickUsage(f);
		yield* g.srcCall(f, "process_high_pressure_delta", live(resumed));
		rt.setSv(f, "cost_highpressure", add(multiply(0.800000011920929, rt.sv(f, "cost_highpressure")), multiply(0.20000000298023224, multiply(subtract(rt.tickUsage(f), live(timer)), rt.fv(f, "tick_lag", rt.world())))));
		if (!isEqual(rt.sv(f, "state"), 2)) {
			return live(f.dot);
		}
		resumed = 0;
		rt.setSv(f, "currentpart", 6);
	}
	if (isEqual(rt.sv(f, "currentpart"), 6)) {
		timer = rt.tickUsage(f);
		yield* g.srcCall(f, "process_hotspots", live(resumed));
		rt.setSv(f, "cost_hotspots", add(multiply(0.800000011920929, rt.sv(f, "cost_hotspots")), multiply(0.20000000298023224, multiply(subtract(rt.tickUsage(f), live(timer)), rt.fv(f, "tick_lag", rt.world())))));
		if (!isEqual(rt.sv(f, "state"), 2)) {
			return live(f.dot);
		}
		resumed = 0;
		rt.setSv(f, "currentpart", 7);
	}
	if (isEqual(rt.sv(f, "currentpart"), 7)) {
		timer = rt.tickUsage(f);
		yield* g.srcCall(f, "process_super_conductivity", live(resumed));
		rt.setSv(f, "cost_superconductivity", add(multiply(0.800000011920929, rt.sv(f, "cost_superconductivity")), multiply(0.20000000298023224, multiply(subtract(rt.tickUsage(f), live(timer)), rt.fv(f, "tick_lag", rt.world())))));
		if (!isEqual(rt.sv(f, "state"), 2)) {
			return live(f.dot);
		}
		resumed = 0;
	}
	rt.setSv(f, "currentpart", 1);
	return f.dot;
}, true);

// /datum/controller/subsystem/air/proc/process_pipenets  (code/controllers/subsystem/air.dm:141)
rt.def("/datum/controller/subsystem/air/proc/process_pipenets", function process_pipenets(f: Frame, resumed: Value) {
	let currentrun: Value = null, thing: Value = null;
	let $0: any;
	f.vars = () => [resumed, currentrun, thing, $0];
	if (live(resumed) === null) {
		resumed = 0;
	}
	if (!truthy(live(resumed))) {
		rt.setFv(f, "currentrun", live(f.src), rt.callName(f, rt.sv(f, "networks"), "Copy", []));
	}
	currentrun = rt.fv(f, "currentrun", live(f.src));
	while (truthy(rt.len(f, live(currentrun)))) {
		thing = rt.index(live(currentrun), rt.len(f, live(currentrun)));
		rt.incField(f, live(currentrun), "len", -1, true);
		if (truthy(live(thing))) {
			rt.callName(f, live(thing), "process", []);
		} else {
			rt.callName(f, rt.sv(f, "networks"), "Remove", [live(thing)]);
		}
		if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
			$0 = rt.callSrc(f, "pause", []);
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			return live(f.dot);
		}
	}
	return f.dot;
});

// /datum/controller/subsystem/air/proc/process_atmos_machinery  (code/controllers/subsystem/air.dm:157)  may sleep
rt.def("/datum/controller/subsystem/air/proc/process_atmos_machinery", function* process_atmos_machinery(f: Frame, resumed: Value) {
	let seconds: Value = null, currentrun: Value = null, M: Value = null;
	let $0: any;
	f.vars = () => [resumed, seconds, currentrun, M, $0];
	if (live(resumed) === null) {
		resumed = 0;
	}
	seconds = multiply(rt.sv(f, "wait"), 0.10000000149011612);
	if (!truthy(live(resumed))) {
		rt.setFv(f, "currentrun", live(f.src), (yield* g.callName(f, rt.sv(f, "atmos_machinery"), "Copy", [])));
	}
	currentrun = rt.fv(f, "currentrun", live(f.src));
	while (truthy(rt.len(f, live(currentrun)))) {
		M = rt.index(live(currentrun), rt.len(f, live(currentrun)));
		rt.incField(f, live(currentrun), "len", -1, true);
		if ((!truthy(live(M)) || isEqual((yield* g.callName(f, live(M), "process_atmos", [live(seconds)])), 26))) {
			yield* g.callName(f, rt.sv(f, "atmos_machinery"), "Remove", [live(M)]);
		}
		if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
			$0 = (yield* g.srcCall(f, "pause"));
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			return live(f.dot);
		}
	}
	return f.dot;
}, true);

// /datum/controller/subsystem/air/proc/process_super_conductivity  (code/controllers/subsystem/air.dm:172)  may sleep
rt.def("/datum/controller/subsystem/air/proc/process_super_conductivity", function* process_super_conductivity(f: Frame, resumed: Value) {
	let currentrun: Value = null, _T: Value = null;
	let $0: any;
	f.vars = () => [resumed, currentrun, _T, $0];
	if (live(resumed) === null) {
		resumed = 0;
	}
	if (!truthy(live(resumed))) {
		rt.setFv(f, "currentrun", live(f.src), (yield* g.callName(f, rt.sv(f, "active_super_conductivity"), "Copy", [])));
	}
	currentrun = rt.fv(f, "currentrun", live(f.src));
	while (truthy(rt.len(f, live(currentrun)))) {
		_T = rt.index(live(currentrun), rt.len(f, live(currentrun)));
		rt.incField(f, live(currentrun), "len", -1, true);
		yield* g.callName(f, live(_T), "super_conduct", []);
		if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
			$0 = (yield* g.srcCall(f, "pause"));
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			return live(f.dot);
		}
	}
	return f.dot;
}, true);

// /datum/controller/subsystem/air/proc/process_hotspots  (code/controllers/subsystem/air.dm:184)
rt.def("/datum/controller/subsystem/air/proc/process_hotspots", function process_hotspots(f: Frame, resumed: Value) {
	let currentrun: Value = null, H: Value = null;
	let $0: any;
	f.vars = () => [resumed, currentrun, H, $0];
	if (live(resumed) === null) {
		resumed = 0;
	}
	if (!truthy(live(resumed))) {
		rt.setFv(f, "currentrun", live(f.src), rt.callName(f, rt.sv(f, "hotspots"), "Copy", []));
	}
	currentrun = rt.fv(f, "currentrun", live(f.src));
	while (truthy(rt.len(f, live(currentrun)))) {
		H = rt.index(live(currentrun), rt.len(f, live(currentrun)));
		rt.incField(f, live(currentrun), "len", -1, true);
		if (truthy(live(H))) {
			rt.callName(f, live(H), "process", []);
		} else {
			(rt.modSrcVar(f, "hotspots", live(H), subtract));
		}
		if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
			$0 = rt.callSrc(f, "pause", []);
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			return live(f.dot);
		}
	}
	return f.dot;
});

// /datum/controller/subsystem/air/proc/process_high_pressure_delta  (code/controllers/subsystem/air.dm:200)
rt.def("/datum/controller/subsystem/air/proc/process_high_pressure_delta", function process_high_pressure_delta(f: Frame, resumed: Value) {
	let _T: Value = null;
	let $0: any;
	f.vars = () => [resumed, _T, $0];
	if (live(resumed) === null) {
		resumed = 0;
	}
	while (truthy(rt.len(f, rt.sv(f, "high_pressure_delta")))) {
		_T = rt.index(rt.sv(f, "high_pressure_delta"), rt.len(f, rt.sv(f, "high_pressure_delta")));
		rt.incField(f, rt.sv(f, "high_pressure_delta"), "len", -1, true);
		rt.callName(f, live(_T), "high_pressure_movements", []);
		rt.setFv(f, "pressure_difference", live(_T), 0);
		if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
			$0 = rt.callSrc(f, "pause", []);
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			return live(f.dot);
		}
	}
	return f.dot;
});

// /datum/controller/subsystem/air/proc/process_active_turfs  (code/controllers/subsystem/air.dm:210)  may sleep
rt.def("/datum/controller/subsystem/air/proc/process_active_turfs", function* process_active_turfs(f: Frame, resumed: Value) {
	let fire_count: Value = null, currentrun: Value = null, _T: Value = null;
	let $0: any;
	f.vars = () => [resumed, fire_count, currentrun, _T, $0];
	if (live(resumed) === null) {
		resumed = 0;
	}
	fire_count = rt.sv(f, "times_fired");
	if (!truthy(live(resumed))) {
		rt.setFv(f, "currentrun", live(f.src), (yield* g.callName(f, rt.sv(f, "active_turfs"), "Copy", [])));
	}
	currentrun = rt.fv(f, "currentrun", live(f.src));
	while (truthy(rt.len(f, live(currentrun)))) {
		_T = rt.index(live(currentrun), rt.len(f, live(currentrun)));
		rt.incField(f, live(currentrun), "len", -1, true);
		if (truthy(live(_T))) {
			yield* g.callName(f, live(_T), "process_cell", [live(fire_count)]);
		}
		if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
			$0 = (yield* g.srcCall(f, "pause"));
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			return live(f.dot);
		}
	}
	return f.dot;
}, true);

// /datum/controller/subsystem/air/proc/process_excited_groups  (code/controllers/subsystem/air.dm:224)  may sleep
rt.def("/datum/controller/subsystem/air/proc/process_excited_groups", function* process_excited_groups(f: Frame, resumed: Value) {
	let currentrun: Value = null, EG: Value = null;
	let $0: any;
	f.vars = () => [resumed, currentrun, EG, $0];
	if (live(resumed) === null) {
		resumed = 0;
	}
	if (!truthy(live(resumed))) {
		rt.setFv(f, "currentrun", live(f.src), (yield* g.callName(f, rt.sv(f, "excited_groups"), "Copy", [])));
	}
	currentrun = rt.fv(f, "currentrun", live(f.src));
	while (truthy(rt.len(f, live(currentrun)))) {
		EG = rt.index(live(currentrun), rt.len(f, live(currentrun)));
		rt.incField(f, live(currentrun), "len", -1, true);
		rt.incField(f, live(EG), "breakdown_cooldown", 1, true);
		rt.incField(f, live(EG), "dismantle_cooldown", 1, true);
		if (rt.ge(rt.fv(f, "breakdown_cooldown", live(EG)), 4)) {
			yield* g.callName(f, live(EG), "self_breakdown", []);
		} else {
			if (rt.ge(rt.fv(f, "dismantle_cooldown", live(EG)), 16)) {
				yield* g.callName(f, live(EG), "dismantle", []);
			}
		}
		if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
			$0 = (yield* g.srcCall(f, "pause"));
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			return live(f.dot);
		}
	}
	return f.dot;
}, true);

// /datum/controller/subsystem/air/proc/remove_from_active  (code/controllers/subsystem/air.dm:242)
rt.def("/datum/controller/subsystem/air/proc/remove_from_active", function remove_from_active(f: Frame, _T: Value) {
	(rt.modSrcVar(f, "active_turfs", live(_T), subtract));
	if (isEqual(rt.sv(f, "currentpart"), 3)) {
		(rt.modSrcVar(f, "currentrun", live(_T), subtract));
	}
	if (!truthy((rt.istype(live(_T), T("/turf/open")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "excited", live(_T), 0);
	if (!truthy(rt.fv(f, "excited_group", live(_T)))) return f.dot;
	rt.callName(f, rt.fv(f, "excited_group", live(_T)), "garbage_collect", []);
	return f.dot;
});

// /datum/controller/subsystem/air/proc/add_to_active  (code/controllers/subsystem/air.dm:254)
rt.def("/datum/controller/subsystem/air/proc/add_to_active", function add_to_active(f: Frame, _T: Value, blockchanges: Value) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [blockchanges, S, $e];
	if (live(blockchanges) === null) {
		blockchanges = 1;
	}
	if ((truthy((rt.istype(live(_T), T("/turf/open")) ? 1 : 0)) && truthy(rt.fv(f, "air", live(_T))))) {
		rt.setFv(f, "excited", live(_T), 1);
		(rt.modSrcVar(f, "active_turfs", live(_T), rt.bitOr));
		if (isEqual(rt.sv(f, "currentpart"), 3)) {
			(rt.modSrcVar(f, "currentrun", live(_T), rt.bitOr));
		}
		if ((truthy(live(blockchanges)) && truthy(rt.fv(f, "excited_group", live(_T))))) {
			rt.callName(f, rt.fv(f, "excited_group", live(_T)), "garbage_collect", []);
		}
	} else {
		if (truthy(rt.fv(f, "initialized", live(_T)))) {
			S = null;
			rt.forList(f, 0, rt.fv(f, "atmos_adjacent_turfs", live(_T)), T("/turf"));
			while (($e = rt.next(f, 0)) !== undefined) {
				S = $e;
				rt.callSrc(f, "add_to_active", [live(S)]);
			}
			rt.endFor(f, 0);
		} else {
			if (truthy(rt.sv(f, "map_loading"))) {
				if (truthy(rt.sv(f, "queued_for_activation"))) {
					rt.setAt(rt.sv(f, "queued_for_activation"), live(_T), live(_T));
				}
				return live(f.dot);
			} else {
				rt.setFv(f, "requires_activation", live(_T), 1);
			}
		}
	}
	return f.dot;
});

// /datum/controller/subsystem/air/proc/StartLoadingMap  (code/controllers/subsystem/air.dm:275)
rt.def("/datum/controller/subsystem/air/proc/StartLoadingMap", function StartLoadingMap(f: Frame) {
	if (!truthy(rt.sv(f, "queued_for_activation"))) {
		rt.setSv(f, "queued_for_activation", rt.list());
	}
	rt.setSv(f, "map_loading", 1);
	return f.dot;
});

// /datum/controller/subsystem/air/proc/StopLoadingMap  (code/controllers/subsystem/air.dm:280)
rt.def("/datum/controller/subsystem/air/proc/StopLoadingMap", function StopLoadingMap(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	rt.setSv(f, "map_loading", 0);
	_T = null;
	rt.forList(f, 0, rt.sv(f, "queued_for_activation"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		rt.callSrc(f, "add_to_active", [live(_T)]);
	}
	rt.endFor(f, 0);
	rt.callName(f, rt.sv(f, "queued_for_activation"), "Cut", []);
	return f.dot;
});

// /datum/controller/subsystem/air/proc/setup_allturfs  (code/controllers/subsystem/air.dm:285)  may sleep
rt.def("/datum/controller/subsystem/air/proc/setup_allturfs", function* setup_allturfs(f: Frame) {
	let turfs_to_init: Value = null, active_turfs: Value = null, times_fired: Value = null, thing: Value = null, _T: Value = null, starting_ats: Value = null, timer: Value = null, _T_5: Value = null, turfs_to_check: Value = null, new_turfs_to_check: Value = null, _T_7: Value = null, ending_ats: Value = null, thing_7: Value = null, EG: Value = null, msg: Value = null;
	let $e: any;
	f.vars = () => [turfs_to_init, active_turfs, times_fired, thing, _T, starting_ats, timer, _T_5, turfs_to_check, new_turfs_to_check, _T_7, ending_ats, thing_7, EG, msg, $e];
	turfs_to_init = (yield* g.call(f, P("/proc/block"), null, [rt.locate(1, 1, 1), rt.locate(rt.fv(f, "maxx", rt.world()), rt.fv(f, "maxy", rt.world()), rt.fv(f, "maxz", rt.world()))]));
	active_turfs = rt.fv(f, "active_turfs", live(f.src));
	times_fired = rt.incField(f, live(f.src), "times_fired", 1, false);
	thing = null;
	rt.forList(f, 0, live(turfs_to_init));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		(active_turfs = rt.modify(live(active_turfs), (_T = live(thing)), subtract));
		if (truthy(rt.fv(f, "blocks_air", live(_T)))) {
			continue;
		}
		yield* g.callName(f, live(_T), "Initalize_Atmos", [live(times_fired)]);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(active_turfs)))) return f.dot;
	starting_ats = rt.len(f, live(active_turfs));
	yield* g.call(f, P("/proc/sleep"), null, [rt.fv(f, "tick_lag", rt.world())]);
	timer = rt.fv(f, "timeofday", rt.world());
	yield* g.call(f, P("/proc/warning"), null, [fmt("There are ＀ active turfs at roundstart, this is a mapping error caused by a difference of the air between the adjacent turfs. You can see its coordinates using \"Mapping -> Show roundstart AT list\" verb (debug verbs required)", [live(starting_ats)])]);
	_T_5 = null;
	rt.forList(f, 0, live(active_turfs), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T_5 = $e;
		rt.modGl("active_turfs_startlist", live(_T_5), add);
	}
	rt.endFor(f, 0);
	turfs_to_check = (yield* g.callName(f, live(active_turfs), "Copy", []));
	while (true) {
		new_turfs_to_check = rt.list();
		_T_7 = null;
		rt.forList(f, 0, live(turfs_to_check), T("/turf/open"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T_7 = $e;
			new_turfs_to_check = rt.modify(live(new_turfs_to_check), (yield* g.callName(f, live(_T_7), "resolve_active_graph", [])), add);
		}
		rt.endFor(f, 0);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
		active_turfs = rt.modify(live(active_turfs), live(new_turfs_to_check), add);
		if (!truthy(rt.getLen(f, (turfs_to_check = live(new_turfs_to_check))))) break;
	}
	ending_ats = rt.len(f, live(active_turfs));
	thing_7 = null;
	rt.forList(f, 0, rt.sv(f, "excited_groups"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing_7 = $e;
		yield* g.callName(f, (EG = live(thing_7)), "self_breakdown", ["space_is_all_consuming", 1], rt.Args.Named);
		yield* g.callName(f, live(EG), "dismantle", []);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	msg = fmt("HEY! LISTEN! ＀ Seconds were wasted processing ＀ turf(s) (connected to ＀ other turfs) with atmos differences at round start.", [divide(subtract(rt.fv(f, "timeofday", rt.world()), live(timer)), 10), live(starting_ats), live(ending_ats)]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='boldannounce'>＀</span>", [live(msg)])]);
	yield* g.call(f, P("/proc/warning"), null, [live(msg)]);
	return f.dot;
}, true);

// /turf/open/proc/resolve_active_graph  (code/controllers/subsystem/air.dm:329)
rt.def("/turf/open/proc/resolve_active_graph", function resolve_active_graph(f: Frame) {
	let EG: Value = null, ET: Value = null, ET_EG: Value = null;
	let $e: any;
	f.vars = () => [EG, ET, ET_EG, $e];
	f.dot = rt.list();
	EG = rt.sv(f, "excited_group");
	if ((truthy(rt.sv(f, "blocks_air")) || !truthy(rt.sv(f, "air")))) {
		return live(f.dot);
	}
	if (!truthy(live(EG))) {
		rt.callName(f, (EG = rt.new_(f, T("/datum/excited_group"), [])), "add_turf", [live(f.src)]);
	}
	ET = null;
	rt.forList(f, 0, rt.sv(f, "atmos_adjacent_turfs"), T("/turf/open"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ET = $e;
		if ((truthy(rt.fv(f, "blocks_air", live(ET))) || !truthy(rt.fv(f, "air", live(ET))))) {
			continue;
		}
		if (truthy((ET_EG = rt.fv(f, "excited_group", live(ET))))) {
			if (!isEqual(live(ET_EG), live(EG))) {
				rt.callName(f, live(EG), "merge_groups", [live(ET_EG)]);
				EG = rt.sv(f, "excited_group");
			}
		} else {
			rt.callName(f, live(EG), "add_turf", [live(ET)]);
		}
		if (!truthy(rt.fv(f, "excited", live(ET)))) {
			rt.setFv(f, "excited", live(ET), 1);
			f.dot = rt.modify(live(f.dot), live(ET), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /turf/open/space/proc/resolve_active_graph  (code/controllers/subsystem/air.dm:352)
rt.def("/turf/open/space/proc/resolve_active_graph", function resolve_active_graph(f: Frame) {
	return rt.list();
});

// /datum/controller/subsystem/air/proc/setup_atmos_machinery  (code/controllers/subsystem/air.dm:355)  may sleep
rt.def("/datum/controller/subsystem/air/proc/setup_atmos_machinery", function* setup_atmos_machinery(f: Frame) {
	let AM: Value = null;
	let $e: any;
	f.vars = () => [AM, $e];
	AM = null;
	rt.forList(f, 0, rt.sv(f, "atmos_machinery"), T("/obj/machinery/atmospherics"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		yield* g.callName(f, live(AM), "atmosinit", []);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/air/proc/setup_pipenets  (code/controllers/subsystem/air.dm:363)  may sleep
rt.def("/datum/controller/subsystem/air/proc/setup_pipenets", function* setup_pipenets(f: Frame) {
	let AM: Value = null;
	let $e: any;
	f.vars = () => [AM, $e];
	AM = null;
	rt.forList(f, 0, rt.sv(f, "atmos_machinery"), T("/obj/machinery/atmospherics"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		yield* g.callName(f, live(AM), "build_network", []);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/air/proc/setup_template_machinery  (code/controllers/subsystem/air.dm:368)  may sleep
rt.def("/datum/controller/subsystem/air/proc/setup_template_machinery", function* setup_template_machinery(f: Frame, atmos_machines: Value) {
	let A: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [atmos_machines, A, AM, $e];
	A = null;
	rt.forList(f, 0, live(atmos_machines));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, (AM = live(A)), "atmosinit", []);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	A = null;
	rt.forList(f, 0, live(atmos_machines));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, (AM = live(A)), "build_network", []);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
