// Based on /tg/station's code/modules/fields/peaceborg_dampener.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1509, "/datum/proximity_monitor/advanced/peaceborg_dampener", "/datum/proximity_monitor/advanced", {
	projector: null,
	tracked: null,
	staging: null,
	name: "１Hyperkinetic Dampener Field",
	setup_edge_turfs: 1,
	setup_field_turfs: 1,
	field_shape: 1,
	use_host_turf: 1,
}, { global: { edgeturf_south: 962, edgeturf_north: 963, edgeturf_west: 964, edgeturf_east: 965, northwest_corner: 966, southwest_corner: 967, northeast_corner: 968, southeast_corner: 969, generic_edge: 970 } });

// peaceborg_dampener.dm:24
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/New", function* New(f: Frame) {
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSfields.processing += this;
	}
	this.tracked = list();
	this.staging = list();
	yield* parent_proc();
	return f.dot;
}, true);

// peaceborg_dampener.dm:30
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSfields.processing -= this;
	return (yield* parent_proc());
}, true);

// peaceborg_dampener.dm:34
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/process", function* process(f: Frame) {
	let _P: Value = null, R: Value = null, L: Value = null;
	if (!rt.istype(this.projector, T("/obj/item/borg/projectile_dampen"))) {
		yield* qdel(this);
	}
	let ranged: Value = list();
	for (_P of each(range(this.current_range, rt.getStep(f, this.host, 0)), T("/obj/item/projectile"))) {
		ranged += _P;
	}
	_P = null;
	for (_P of each(this.tracked, T("/obj/item/projectile"))) {
		if (!rt.isIn(f, _P, ranged) || !_P.loc) {
			this.release_projectile(_P);
		}
	}
	for (R of each(range(this.current_range, rt.getStep(f, this.host, 0)), T("/mob/living/silicon/robot"))) {
		if (R.has_buckled_mobs()) {
			L = null;
			for (L of each(R.buckled_mobs, T("/mob/living"))) {
				L.visible_message(`<span class='warning'>${L} is knocked off of ${R} by the charge in ${R}'s chassis induced by ${this.name}!</span>`);
				yield* L.Knockdown(60);
				yield* R.unbuckle_mob(L);
				yield* do_sparks(5, 0, L);
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// peaceborg_dampener.dm:52
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/setup_edge_turf", function* setup_edge_turf(f: Frame, T: Value) {
	let F: Value = null;
	yield* parent_proc();
	let I: Value = this.get_edgeturf_overlay(this.get_edgeturf_direction(T));
	(F = rt.index(this.edge_turfs, T)).appearance = I.appearance;
	F.invisibility = 0;
	F.mouse_opacity = 0;
	F.layer = 5;
	return f.dot;
}, true);

// peaceborg_dampener.dm:61
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/cleanup_edge_turf", function* cleanup_edge_turf(f: Frame, T: Value) {
	yield* parent_proc();
	return f.dot;
}, true);

// peaceborg_dampener.dm:64
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/get_edgeturf_overlay", function get_edgeturf_overlay(f: Frame, direction: Value) {
	if (direction === 1) {
		return GLOB.edgeturf_north;
	} else if (direction === 2) {
		return GLOB.edgeturf_south;
	} else if (direction === 4) {
		return GLOB.edgeturf_east;
	} else if (direction === 8) {
		return GLOB.edgeturf_west;
	} else if (direction === 5) {
		return GLOB.northeast_corner;
	} else if (direction === 9) {
		return GLOB.northwest_corner;
	} else if (direction === 6) {
		return GLOB.southeast_corner;
	} else if (direction === 10) {
		return GLOB.southwest_corner;
	} else {
		return GLOB.generic_edge;
	}
});

// peaceborg_dampener.dm:85
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/capture_projectile", function capture_projectile(f: Frame, _P: Value, track_projectile: Value) {
	track_projectile ??= 1;
	if (rt.isIn(f, _P, this.tracked)) {
		return f.dot;
	}
	this.projector.dampen_projectile(_P, track_projectile);
	if (!track_projectile) return f.dot;
	this.tracked += _P;
	return f.dot;
});

// peaceborg_dampener.dm:92
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/release_projectile", function release_projectile(f: Frame, _P: Value) {
	this.projector.restore_projectile(_P);
	this.tracked -= _P;
	return f.dot;
});

// peaceborg_dampener.dm:96
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/field_edge_uncrossed", function field_edge_uncrossed(f: Frame, AM: Value, F: Value) {
	if (!is_turf_in_field(rt.getStep(f, AM, 0), this)) {
		if (rt.istype(AM, T("/obj/item/projectile"))) {
			if (rt.isIn(f, AM, this.tracked)) {
				this.release_projectile(AM);
			} else {
				this.capture_projectile(AM, 0);
			}
		}
	}
	return parent_proc();
}, false);

// peaceborg_dampener.dm:105
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/field_edge_crossed", function field_edge_crossed(f: Frame, AM: Value, F: Value) {
	if (rt.istype(AM, T("/obj/item/projectile")) && !rt.isIn(f, AM, this.tracked) && rt.index(this.staging, AM) && !is_turf_in_field(rt.index(this.staging, AM), this)) {
		this.capture_projectile(AM);
	}
	this.staging -= AM;
	return parent_proc();
}, false);

// peaceborg_dampener.dm:111
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/field_edge_canpass", function field_edge_canpass(f: Frame, AM: Value, F: Value, entering: Value) {
	if (rt.istype(AM, T("/obj/item/projectile"))) {
		rt.setAt(this.staging, AM, rt.getStep(f, AM, 0));
	}
	f.dot = parent_proc();
	if (f.dot) return f.dot;
	this.staging -= AM;
	return f.dot;
}, false);
