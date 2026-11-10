// Based on /tg/station's code/modules/atmospherics/machinery/components/components_base.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10560, "/obj/machinery/atmospherics/components", "/obj/machinery/atmospherics", {
	welded: 0,
	showpipe: 0,
	parents: null,
	airs: null,
});

// components_base.dm:14
rt.def("/obj/machinery/atmospherics/components/proc/New", function* New(f: Frame) {
	let I: Value = null, A: Value = null;
	let $e: any;
	this.parents = (yield* new_(T("/list"), this.device_type));
	this.airs = (yield* new_(T("/list"), this.device_type));
	yield* parent_proc();
	rt.forRange(f, 0, 1, this.device_type, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		(A = (yield* new_(T("/datum/gas_mixture")))).volume = 200;
		rt.setAt(this.airs, I, A);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// components_base.dm:27
rt.def("/obj/machinery/atmospherics/components/proc/icon_addintact", function icon_addintact(f: Frame, node: Value) {
	let img: Value = null;
	this.underlays += (img = this.getpipeimage(rt.rsc("icons/obj/atmospherics/components/binary_devices.dmi"), "pipe_intact", rt.getDir(f, this, node), node.pipe_color));
	return img.dir;
});

// components_base.dm:33
rt.def("/obj/machinery/atmospherics/components/proc/icon_addbroken", function icon_addbroken(f: Frame, connected: Value) {
	let direction: Value = null;
	connected ??= 0;
	let unconnected: Value = rt.bitAnd(rt.op(f, "BitNot", [], [connected]), this.initialize_directions);
	for (direction of each(GLOB.cardinal)) {
		if (rt.bitAnd(unconnected, direction)) {
			this.underlays += this.getpipeimage(rt.rsc("icons/obj/atmospherics/components/binary_devices.dmi"), "pipe_exposed", direction);
		}
	}
	return f.dot;
});

// components_base.dm:42
rt.def("/obj/machinery/atmospherics/components/proc/update_icon", function update_icon(f: Frame) {
	let I: Value = null;
	let $e: any;
	this.update_icon_nopipes();
	this.underlays.Cut();
	let _T: Value = this.loc;
	if (this.level == 2 || !_T.intact) {
		this.showpipe = 1;
	} else {
		this.showpipe = 0;
	}
	if (!this.showpipe) {
		return f.dot;
	}
	let connected: Value = 0;
	rt.forRange(f, 0, 1, this.device_type, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (rt.index(this.nodes, I)) {
			(connected = rt.modify(connected, this.icon_addintact(rt.index(this.nodes, I)), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	this.icon_addbroken(connected);
	return f.dot;
});

// components_base.dm:69
rt.def("/obj/machinery/atmospherics/components/proc/nullifyNode", function* nullifyNode(f: Frame, I: Value) {
	yield* parent_proc();
	if (!rt.index(this.nodes, I)) return f.dot;
	this.nullifyPipenet(rt.index(this.parents, I));
	yield* qdel(rt.index(this.airs, I));
	rt.setAt(this.airs, I, null);
	return f.dot;
}, true);

// components_base.dm:76
rt.def("/obj/machinery/atmospherics/components/proc/on_construction", function* on_construction(f: Frame) {
	yield* parent_proc();
	this.update_parents();
	return f.dot;
}, true);

// components_base.dm:80
rt.def("/obj/machinery/atmospherics/components/proc/build_network", function build_network(f: Frame) {
	let I: Value = null, _P: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, this.device_type, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!rt.index(this.parents, I)) {
			rt.setAt(this.parents, I, new_(T("/datum/pipeline")));
			(_P = rt.index(this.parents, I)).build_pipeline(this);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// components_base.dm:87
rt.def("/obj/machinery/atmospherics/components/proc/nullifyPipenet", function nullifyPipenet(f: Frame, reference: Value) {
	let I: Value = this.parents.Find(reference);
	reference.other_airs -= rt.index(this.airs, I);
	reference.other_atmosmch -= this;
	rt.setAt(this.parents, I, null);
	return f.dot;
});

// components_base.dm:93
rt.def("/obj/machinery/atmospherics/components/proc/returnPipenetAir", function returnPipenetAir(f: Frame, reference: Value) {
	let I: Value = this.parents.Find(reference);
	return rt.index(this.airs, I);
});

// components_base.dm:98
rt.def("/obj/machinery/atmospherics/components/proc/pipeline_expansion", function pipeline_expansion(f: Frame, reference: Value) {
	let I: Value = null;
	if (reference) {
		I = this.parents.Find(reference);
		return list(rt.index(this.nodes, I));
	} else {
		return parent_proc();
	}
}, false);

// components_base.dm:104
rt.def("/obj/machinery/atmospherics/components/proc/setPipenet", function setPipenet(f: Frame, reference: Value, A: Value) {
	let I: Value = this.nodes.Find(A);
	rt.setAt(this.parents, I, reference);
	return f.dot;
});

// components_base.dm:108
rt.def("/obj/machinery/atmospherics/components/proc/returnPipenet", function returnPipenet(f: Frame, A: Value) {
	A ??= rt.index(this.nodes, 1);
	if (GLOB.pipe_rebuild_defer !== null) flush_pipe_rebuilds(); // stress2c
	let I: Value = this.nodes.Find(A);
	return rt.index(this.parents, I);
});

// components_base.dm:112
rt.def("/obj/machinery/atmospherics/components/proc/replacePipenet", function replacePipenet(f: Frame, Old: Value, New: Value) {
	let I: Value = this.parents.Find(Old);
	rt.setAt(this.parents, I, New);
	return f.dot;
});

// components_base.dm:116
rt.def("/obj/machinery/atmospherics/components/proc/unsafe_pressure_release", function* unsafe_pressure_release(f: Frame, user: Value, pressures: Value) {
	let _T: Value = null, lost: Value = null, I: Value = null, air: Value = null, to_release: Value = null, I_6: Value = null, air_7: Value = null;
	let $e: any;
	yield* parent_proc();
	if (!(_T = rt.getStep(f, this, 0))) return f.dot;
	let environment: Value = _T.return_air();
	let times_lost: Value = 0;
	rt.forRange(f, 0, 1, this.device_type, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		air = rt.index(this.airs, I);
		lost += pressures * environment.volume / (air.temperature * R_IDEAL_GAS_EQUATION);
		times_lost++;
	}
	rt.endFor(f, 0);
	let shared_loss: Value = lost / times_lost;
	rt.forRange(f, 0, 1, this.device_type, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I_6 = $e;
		air_7 = rt.index(this.airs, I_6);
		if (!to_release) {
			to_release = (yield* air_7.remove(shared_loss));
			continue;
		}
		yield* to_release.merge((yield* air_7.remove(shared_loss)));
	}
	rt.endFor(f, 0);
	yield* _T.assume_air(to_release);
	this.air_update_turf(1);
	return f.dot;
}, true);

// components_base.dm:151
rt.def("/obj/machinery/atmospherics/components/proc/update_parents", function update_parents(f: Frame) {
	let I: Value = null, parent: Value = null;
	let $e: any;
	if (GLOB.pipe_rebuild_defer !== null) flush_pipe_rebuilds(); // stress2c: rebuilds waiting for the end of a singularity pass
	rt.forRange(f, 0, 1, this.device_type, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!(parent = rt.index(this.parents, I))) {
			rt.throw_(f, new_(T("/exception"), "Component is missing a pipenet! Rebuilding...", "code/modules/atmospherics/machinery/components/components_base.dm", 154));
			this.build_network();
		}
		parent.update = 1;
	}
	rt.endFor(f, 0);
	return f.dot;
});

// components_base.dm:159
rt.def("/obj/machinery/atmospherics/components/proc/returnPipenets", function returnPipenets(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.dot = list();
	rt.forRange(f, 0, 1, this.device_type, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		f.dot += this.returnPipenet(rt.index(this.nodes, I));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// components_base.dm:168
rt.def("/obj/machinery/atmospherics/components/proc/ui_status", function ui_status(f: Frame, user: Value) {
	if (this.allowed(user)) {
		return parent_proc();
	}
	to_chat(user, "<span class='danger'>Access denied.</span>");
	return UI_CLOSE;
}, false);
