// Based on /tg/station's code/controllers/subsystem/lighting.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// lighting.dm:1
rt.def("/datum/controller/global_vars/proc/InitGloballighting_update_lights", function InitGloballighting_update_lights(f: Frame) {
	GLOB.lighting_update_lights = list();
	this.gvars_datum_init_order += "lighting_update_lights";
	return f.dot;
});

// lighting.dm:2
rt.def("/datum/controller/global_vars/proc/InitGloballighting_update_corners", function InitGloballighting_update_corners(f: Frame) {
	GLOB.lighting_update_corners = list();
	this.gvars_datum_init_order += "lighting_update_corners";
	return f.dot;
});

// lighting.dm:3
rt.def("/datum/controller/global_vars/proc/InitGloballighting_update_objects", function InitGloballighting_update_objects(f: Frame) {
	GLOB.lighting_update_objects = list();
	this.gvars_datum_init_order += "lighting_update_objects";
	return f.dot;
});

rt.type(26, "/datum/controller/subsystem/lighting", "/datum/controller/subsystem", {
	initialized: 0,
	name: "Lighting",
	wait: 2,
	init_order: -20,
	flags: 16,
});

// lighting.dm:5
rt.def("/datum/controller/subsystem/lighting/proc/New", function* New(f: Frame) {
	if (GLOB.SSlighting != this) {
		if (rt.istype(GLOB.SSlighting, T("/datum/controller/subsystem/lighting"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSlighting);
		}
		GLOB.SSlighting = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// lighting.dm:14
rt.def("/datum/controller/subsystem/lighting/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* parent_proc(`L:${rt.len(f, GLOB.lighting_update_lights)}|C:${rt.len(f, GLOB.lighting_update_corners)}|O:${rt.len(f, GLOB.lighting_update_objects)}`);
	return f.dot;
}, true);

// lighting.dm:18
rt.def("/datum/controller/subsystem/lighting/proc/Initialize", function* Initialize(f: Frame, timeofday: Value) {
	let I: Value = null, A: Value = null;
	if (!this.initialized) {
		if (GLOB.config.starlight) {
			for (I of each(GLOB.sortedAreas)) {
				if ((A = I).dynamic_lighting == DYNAMIC_LIGHTING_IFSTARLIGHT) {
					A.luminosity = 0;
				}
			}
		}
		yield* create_all_lighting_objects();
		this.initialized = 1;
	}
	yield* this.fire(0, 1);
	yield* parent_proc();
	return f.dot;
}, true);

// lighting.dm:33
rt.def("/datum/controller/subsystem/lighting/proc/fire", function* fire(f: Frame, resumed: Value, init_tick_checks: Value) {
	let L: Value = null, C: Value = null, O: Value = null;
	let $e: any;
	let original_tick_limit: Value = GLOB.current_ticklimit;
	let split_tick_phases: Value = 3;
	if (!init_tick_checks) {
		if (split_tick_phases > 1) {
			GLOB.current_ticklimit = (original_tick_limit - rt.tickUsage(f)) / split_tick_phases + rt.tickUsage(f);
			split_tick_phases--;
		} else {
			GLOB.current_ticklimit = original_tick_limit;
		}
	}
	let i: Value = 0;
	rt.forRange(f, 0, 1, rt.len(f, GLOB.lighting_update_lights), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* (L = rt.index(GLOB.lighting_update_lights, i)).update_corners();
		L.needs_update = LIGHTING_NO_UPDATE;
		if (init_tick_checks) {
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		} else {
			if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
				break;
			}
		}
	}
	rt.endFor(f, 0);
	if (i) {
		GLOB.lighting_update_lights.Cut(1, i + 1);
		i = 0;
	}
	if (!init_tick_checks) {
		if (split_tick_phases > 1) {
			GLOB.current_ticklimit = (original_tick_limit - rt.tickUsage(f)) / split_tick_phases + rt.tickUsage(f);
			split_tick_phases--;
		} else {
			GLOB.current_ticklimit = original_tick_limit;
		}
	}
	rt.forRange(f, 0, 1, rt.len(f, GLOB.lighting_update_corners), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		(C = rt.index(GLOB.lighting_update_corners, i)).update_objects();
		C.needs_update = 0;
		if (init_tick_checks) {
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		} else {
			if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
				break;
			}
		}
	}
	rt.endFor(f, 0);
	if (i) {
		GLOB.lighting_update_corners.Cut(1, i + 1);
		i = 0;
	}
	if (!init_tick_checks) {
		if (split_tick_phases > 1) {
			GLOB.current_ticklimit = (original_tick_limit - rt.tickUsage(f)) / split_tick_phases + rt.tickUsage(f);
			split_tick_phases--;
		} else {
			GLOB.current_ticklimit = original_tick_limit;
		}
	}
	rt.forRange(f, 0, 1, rt.len(f, GLOB.lighting_update_objects), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!(O = rt.index(GLOB.lighting_update_objects, i)) || O.gc_destroyed) {
			continue;
		}
		yield* O.update();
		O.needs_update = 0;
		if (init_tick_checks) {
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		} else {
			if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
				break;
			}
		}
	}
	rt.endFor(f, 0);
	if (!i) return f.dot;
	GLOB.lighting_update_objects.Cut(1, i + 1);
	return f.dot;
}, true);

// lighting.dm:90
rt.def("/datum/controller/subsystem/lighting/proc/Recover", function Recover(f: Frame) {
	this.initialized = GLOB.SSlighting.initialized;
	parent_proc();
	return f.dot;
});
