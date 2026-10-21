// From code/modules/atmospherics/machinery/pipes/pipes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10443, "/obj/machinery/atmospherics/pipe", "/obj/machinery/atmospherics", {
	air_temporary: null,
	volume: 0,
	parent: null,
	level: 1,
	can_unwrench: 1,
	can_buckle: 1,
	buckle_requires_restraints: 1,
	buckle_lying: -1,
	use_power: 0,
});

// /obj/machinery/atmospherics/pipe/proc/New  (code/modules/atmospherics/machinery/pipes/pipes.dm:17)  may sleep
rt.def("/obj/machinery/atmospherics/pipe/proc/New", function* New(f: Frame) {
	yield* g.srcCall(f, "add_atom_colour", rt.sv(f, "pipe_color"), 4);
	rt.setSv(f, "volume", multiply(35, rt.sv(f, "device_type")));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/pipe/proc/nullifyNode  (code/modules/atmospherics/machinery/pipes/pipes.dm:22)  may sleep
rt.def("/obj/machinery/atmospherics/pipe/proc/nullifyNode", function* nullifyNode(f: Frame) {
	let oldN: Value = null;
	f.vars = () => [oldN];
	oldN = rt.index(rt.sv(f, "nodes"), live(f.args[0]));
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(oldN))) return f.dot;
	// stress2c: while a singularity pass is ripping pipes, the neighbour's pipeline is rebuilt once at the end of the pass
	// (flush_pipe_rebuilds) instead of after every pipe: each rebuild walks the whole pipe network.
	if (rt.gl("pipe_rebuild_defer") !== null) {
		rt.modGl("pipe_rebuild_defer", live(oldN), add);
		return f.dot;
	}
	yield* g.callName(f, live(oldN), "build_network", []);
	return f.dot;
}, true, { args: ["I"] });

// stress2c: rebuild the pipelines of every pipe/component queued by pipe/nullifyNode (those still without one). The queue stays on
// (emptied) when it was on. Never sleeps, so nothing else can see a pipe without its pipeline.
rt.def("/proc/flush_pipe_rebuilds", function flush_pipe_rebuilds(f: Frame) {
	let q: Value = null, N: Value = null;
	let $e: any;
	f.vars = () => [q, N, $e];
	q = rt.gl("pipe_rebuild_defer");
	if (q === null || !truthy(rt.len(f, q))) return f.dot;
	rt.setGl("pipe_rebuild_defer", rt.list());
	rt.forList(f, 0, live(q));
	while (($e = rt.next(f, 0)) !== undefined) {
		N = $e;
		if (!truthy(live(N)) || truthy(rt.fv(f, "gc_destroyed", live(N)))) continue;
		rt.callName(f, live(N), "build_network", []);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/atmospherics/pipe/proc/update_icon  (code/modules/atmospherics/machinery/pipes/pipes.dm:28)
rt.def("/obj/machinery/atmospherics/pipe/proc/update_icon", function update_icon(f: Frame) {
	let have_node1: Value = null, have_node2: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [have_node1, have_node2, $0, $1, $2];
	if ((truthy(rt.index(rt.sv(f, "nodes"), 1)) && truthy(rt.index(rt.sv(f, "nodes"), 2)))) {
		if (truthy(rt.sv(f, "invisibility"))) {
			$0 = "-f";
		} else {
			$0 = "";
		}
		rt.setSv(f, "icon_state", fmt("intact＀", [$0]));
	} else {
		if (truthy(rt.index(rt.sv(f, "nodes"), 1))) {
			$0 = 1;
		} else {
			$0 = 0;
		}
		have_node1 = $0;
		if (truthy(rt.index(rt.sv(f, "nodes"), 2))) {
			$0 = 1;
		} else {
			$0 = 0;
		}
		have_node2 = $0;
		$0 = live(have_node1);
		$1 = live(have_node2);
		if (truthy(rt.sv(f, "invisibility"))) {
			$1 = $1;
			$2 = "-f";
		} else {
			$2 = "";
		}
		rt.setSv(f, "icon_state", fmt("exposed＀＀＀", [$0, $1, $2]));
	}
	return f.dot;
});

// /obj/machinery/atmospherics/pipe/proc/atmosinit  (code/modules/atmospherics/machinery/pipes/pipes.dm:36)  may sleep
rt.def("/obj/machinery/atmospherics/pipe/proc/atmosinit", function* atmosinit(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.srcCall(f, "hide", rt.gv(f, "intact", (_T = rt.sv(f, "loc"))));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/pipe/proc/hide  (code/modules/atmospherics/machinery/pipes/pipes.dm:41)
rt.def("/obj/machinery/atmospherics/pipe/proc/hide", function hide(f: Frame, i: Value) {
	let $0: any;
	f.vars = () => [$0];
	if ((isEqual(rt.sv(f, "level"), 1) && truthy(rt.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		if (truthy(live(i))) {
			$0 = 100;
		} else {
			$0 = 0;
		}
		rt.setSv(f, "invisibility", $0);
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/atmospherics/pipe/proc/releaseAirToTurf  (code/modules/atmospherics/machinery/pipes/pipes.dm:52)  may sleep
rt.def("/obj/machinery/atmospherics/pipe/proc/releaseAirToTurf", function* releaseAirToTurf(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy(rt.sv(f, "air_temporary"))) return f.dot;
	yield* g.callName(f, (_T = rt.sv(f, "loc")), "assume_air", [rt.sv(f, "air_temporary")]);
	yield* g.srcCall(f, "air_update_turf");
	return f.dot;
}, true);

// /obj/machinery/atmospherics/pipe/proc/return_air  (code/modules/atmospherics/machinery/pipes/pipes.dm:57)
rt.def("/obj/machinery/atmospherics/pipe/proc/return_air", function return_air(f: Frame) {
	if (!truthy(rt.sv(f, "parent"))) { if (rt.gl("pipe_rebuild_defer") !== null) rt.call(f, P("/proc/flush_pipe_rebuilds"), null, []); } // stress2c: a rebuild waiting for the end of a singularity pass
	return rt.fv(f, "air", rt.sv(f, "parent"));
});

// /obj/machinery/atmospherics/pipe/proc/build_network  (code/modules/atmospherics/machinery/pipes/pipes.dm:60)
rt.def("/obj/machinery/atmospherics/pipe/proc/build_network", function build_network(f: Frame) {
	if (truthy(rt.sv(f, "parent"))) return f.dot;
	rt.setSv(f, "parent", rt.new_(f, T("/datum/pipeline"), []));
	rt.callName(f, rt.sv(f, "parent"), "build_pipeline", [live(f.src)]);
	return f.dot;
});

// /obj/machinery/atmospherics/pipe/proc/attackby  (code/modules/atmospherics/machinery/pipes/pipes.dm:65)  may sleep
rt.def("/obj/machinery/atmospherics/pipe/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/analyzer")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "parent"))) { if (rt.gl("pipe_rebuild_defer") !== null) rt.call(f, P("/proc/flush_pipe_rebuilds"), null, []); } // stress2c
		yield* g.srcCall(f, "atmosanalyzer_scan", rt.fv(f, "air", rt.sv(f, "parent")), live(f.args[1]));
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/atmospherics/pipe/proc/setPipenet  (code/modules/atmospherics/machinery/pipes/pipes.dm:74)
rt.def("/obj/machinery/atmospherics/pipe/proc/setPipenet", function setPipenet(f: Frame, _P: Value) {
	rt.setSv(f, "parent", live(_P));
	return f.dot;
});

// /obj/machinery/atmospherics/pipe/proc/Destroy  (code/modules/atmospherics/machinery/pipes/pipes.dm:77)  may sleep
rt.def("/obj/machinery/atmospherics/pipe/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null, meter: Value = null, PM: Value = null;
	let $e: any;
	f.vars = () => [_T, meter, PM, $e];
	// stress2c: a pipe waiting for its rebuild (no pipeline, holding its share of the old one's gas) loses that share as it
	// did before, when the rebuild had already taken it and the pipeline's own teardown then dropped it. It isn't vented.
	if (!(rt.gl("pipe_rebuild_defer") !== null && !truthy(rt.sv(f, "parent")))) {
		yield* g.srcCall(f, "releaseAirToTurf");
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "air_temporary")]);
	rt.setSv(f, "air_temporary", null);
	_T = rt.sv(f, "loc");
	meter = null;
	rt.forList(f, 0, live(_T), T("/obj/machinery/meter"));
	while (($e = rt.next(f, 0)) !== undefined) {
		meter = $e;
		if (isEqual(rt.fv(f, "target", live(meter)), live(f.src))) {
			PM = (yield* g.new_(f, T("/obj/item/pipe_meter"), [live(_T)]));
			yield* g.callName(f, live(meter), "transfer_fingerprints_to", [live(PM)]);
			yield* g.call(f, P("/proc/qdel"), null, [live(meter)]);
		}
	}
	rt.endFor(f, 0);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if ((truthy(rt.sv(f, "parent")) && !(!truthy(rt.sv(f, "parent")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "parent")))))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "parent")]);
	}
	rt.setSv(f, "parent", null);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/pipe/proc/update_node_icon  (code/modules/atmospherics/machinery/pipes/pipes.dm:94)  may sleep
rt.def("/obj/machinery/atmospherics/pipe/proc/update_node_icon", function* update_node_icon(f: Frame) {
	let I: Value = null, N: Value = null;
	let $e: any;
	f.vars = () => [I, N, $e];
	I = null;
	rt.forRange(f, 0, 1, rt.sv(f, "device_type"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy(rt.index(rt.sv(f, "nodes"), live(I)))) {
			yield* g.callName(f, (N = rt.index(rt.sv(f, "nodes"), live(I))), "update_icon", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/pipe/proc/returnPipenets  (code/modules/atmospherics/machinery/pipes/pipes.dm:100)
rt.def("/obj/machinery/atmospherics/pipe/proc/returnPipenets", function returnPipenets(f: Frame) {
	if (!truthy(rt.sv(f, "parent"))) { if (rt.gl("pipe_rebuild_defer") !== null) rt.call(f, P("/proc/flush_pipe_rebuilds"), null, []); } // stress2c
	f.dot = rt.list(rt.sv(f, "parent"));
	return f.dot;
});

// /obj/machinery/atmospherics/pipe/proc/run_obj_armor  (code/modules/atmospherics/machinery/pipes/pipes.dm:103)
rt.def("/obj/machinery/atmospherics/pipe/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if ((isEqual(live(f.args[2]), "melee") && rt.lt(live(f.args[0]), 12))) {
		return 0;
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });
