// Based on /tg/station's code/modules/atmospherics/machinery/pipes/pipes.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


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

// pipes.dm:17
rt.def("/obj/machinery/atmospherics/pipe/proc/New", function* New(f: Frame) {
	this.add_atom_colour(this.pipe_color, FIXED_COLOUR_PRIORITY);
	this.volume = 35 * this.device_type;
	yield* parent_proc();
	return f.dot;
}, true);

// pipes.dm:22
rt.def("/obj/machinery/atmospherics/pipe/proc/nullifyNode", function* nullifyNode(f: Frame, I: Value) {
	let oldN: Value = rt.index(this.nodes, I);
	yield* parent_proc();
	if (!oldN) return f.dot;
	// stress2c: while a singularity pass is ripping pipes, the neighbour's pipeline is rebuilt once at the end of the pass
	// (flush_pipe_rebuilds) instead of after every pipe: each rebuild walks the whole pipe network.
	if (GLOB.pipe_rebuild_defer !== null) {
		GLOB.pipe_rebuild_defer += oldN;
		return f.dot;
	}
	oldN.build_network();
	return f.dot;
}, true);

// stress2c: rebuild the pipelines of every pipe/component queued by pipe/nullifyNode (those still without one). The queue stays on
// (emptied) when it was on. Never sleeps, so nothing else can see a pipe without its pipeline.
rt.def("/proc/flush_pipe_rebuilds", function flush_pipe_rebuilds(f: Frame) {
	let N: Value = null;
	let q: Value = GLOB.pipe_rebuild_defer;
	if (q === null || !rt.len(f, q)) return f.dot;
	GLOB.pipe_rebuild_defer = list();
	for (N of each(q)) {
		if (!N || N.gc_destroyed) continue;
		N.build_network();
	}
	return f.dot;
});

// pipes.dm:28
rt.def("/obj/machinery/atmospherics/pipe/proc/update_icon", function update_icon(f: Frame) {
	let have_node1: Value = null, have_node2: Value = null;
	let $0: any, $1: any, $2: any;
	if (rt.index(this.nodes, 1) && rt.index(this.nodes, 2)) {
		this.icon_state = `intact${this.invisibility ? "-f" : ""}`;
	} else {
		have_node1 = rt.index(this.nodes, 1) ? 1 : 0;
		have_node2 = rt.index(this.nodes, 2) ? 1 : 0;
		$0 = have_node1;
		$1 = have_node2;
		if (this.invisibility) {

			$2 = "-f";
		} else {
			$2 = "";
		}
		this.icon_state = `exposed${$0}${$1}${$2}`;
	}
	return f.dot;
});

// pipes.dm:36
rt.def("/obj/machinery/atmospherics/pipe/proc/atmosinit", function* atmosinit(f: Frame) {
	let _T: Value = null;
	yield* this.hide((_T = this.loc).intact);
	yield* parent_proc();
	return f.dot;
}, true);

// pipes.dm:41
rt.def("/obj/machinery/atmospherics/pipe/proc/hide", function hide(f: Frame, i: Value) {
	if (this.level == 1 && isturf(this.loc)) {
		this.invisibility = i ? INVISIBILITY_MAXIMUM : 0;
	}
	this.update_icon();
	return f.dot;
});

// pipes.dm:52
rt.def("/obj/machinery/atmospherics/pipe/proc/releaseAirToTurf", function* releaseAirToTurf(f: Frame) {
	let _T: Value = null;
	if (!this.air_temporary) return f.dot;
	yield* (_T = this.loc).assume_air(this.air_temporary);
	this.air_update_turf();
	return f.dot;
}, true);

// pipes.dm:57
rt.def("/obj/machinery/atmospherics/pipe/proc/return_air", function return_air(f: Frame) {
	if (!this.parent) { if (GLOB.pipe_rebuild_defer !== null) flush_pipe_rebuilds(); } // stress2c: a rebuild waiting for the end of a singularity pass
	return this.parent.air;
});

// pipes.dm:60
rt.def("/obj/machinery/atmospherics/pipe/proc/build_network", function build_network(f: Frame) {
	if (this.parent) return f.dot;
	this.parent = new_(T("/datum/pipeline"));
	this.parent.build_pipeline(this);
	return f.dot;
});

// pipes.dm:65
rt.def("/obj/machinery/atmospherics/pipe/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/device/analyzer"))) {
		if (!this.parent) { if (GLOB.pipe_rebuild_defer !== null) rt.call(f, P("/proc/flush_pipe_rebuilds"), null, []); } // stress2c
		this.atmosanalyzer_scan(this.parent.air, user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// pipes.dm:74
rt.def("/obj/machinery/atmospherics/pipe/proc/setPipenet", function setPipenet(f: Frame, _P: Value) {
	this.parent = _P;
	return f.dot;
});

// pipes.dm:77
rt.def("/obj/machinery/atmospherics/pipe/proc/Destroy", function* Destroy(f: Frame) {
	let meter: Value = null, PM: Value = null;
	// stress2c: a pipe waiting for its rebuild (no pipeline, holding its share of the old one's gas) loses that share as it
	// did before, when the rebuild had already taken it and the pipeline's own teardown then dropped it. It isn't vented.
	if (!(GLOB.pipe_rebuild_defer !== null && !this.parent)) {
		yield* this.releaseAirToTurf();
	}
	yield* qdel(this.air_temporary);
	this.air_temporary = null;
	let _T: Value = this.loc;
	for (meter of each(_T, T("/obj/machinery/meter"))) {
		if (meter.target == this) {
			PM = (yield* new_(T("/obj/item/pipe_meter"), _T));
			meter.transfer_fingerprints_to(PM);
			yield* qdel(meter);
		}
	}
	f.dot = (yield* parent_proc());
	if (this.parent && !(!this.parent || this.parent.gc_destroyed)) {
		yield* qdel(this.parent);
	}
	this.parent = null;
	return f.dot;
}, true);

// pipes.dm:94
rt.def("/obj/machinery/atmospherics/pipe/proc/update_node_icon", function* update_node_icon(f: Frame) {
	let I: Value = null, N: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, this.device_type, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (rt.index(this.nodes, I)) {
			yield* (N = rt.index(this.nodes, I)).update_icon();
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// pipes.dm:100
rt.def("/obj/machinery/atmospherics/pipe/proc/returnPipenets", function returnPipenets(f: Frame) {
	if (!this.parent) { if (GLOB.pipe_rebuild_defer !== null) flush_pipe_rebuilds(); } // stress2c
	f.dot = list(this.parent);
	return f.dot;
});

// pipes.dm:103
rt.def("/obj/machinery/atmospherics/pipe/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[2] == "melee" && f.args[0] < 12) {
		return 0;
	}
	f.dot = parent_proc();
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });
