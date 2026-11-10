// Based on /tg/station's code/modules/lighting/lighting_turf.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// lighting_turf.dm:16
rt.def("/turf/proc/reconsider_lights", function reconsider_lights(f: Frame) {
	let L: Value = null, thing: Value = null;
	for (thing of each(this.affecting_lights)) {
		(L = thing).vis_update();
	}
	return f.dot;
});

// lighting_turf.dm:22
rt.def("/turf/proc/lighting_clear_overlay", function* lighting_clear_overlay(f: Frame) {
	let C: Value = null, thing: Value = null;
	if (this.lighting_object) {
		yield* qdel(this.lighting_object, 1);
	}
	for (thing of each(this.corners)) {
		if (!thing) {
			continue;
		}
		(C = thing).update_active();
	}
	return f.dot;
}, true);

// lighting_turf.dm:37
rt.def("/turf/proc/lighting_build_overlay", function* lighting_build_overlay(f: Frame) {
	let A: Value = null, thing: Value = null, C: Value = null, S: Value = null;
	if (this.lighting_object) {
		return f.dot;
	}
	if (!(A = this.loc).dynamic_lighting && !this.light_sources) {
		return f.dot;
	}
	if (!this.lighting_corners_initialised) {
		this.generate_missing_corners();
	}
	yield* new_(T("/atom/movable/lighting_object"), this);
	for (thing of each(this.corners)) {
		if (!thing) {
			continue;
		}
		if (!(C = thing).active) {
			for (thing of each(C.affecting)) {
				(S = thing).recalc_corner(C);
			}
			C.active = 1;
		}
	}
	return f.dot;
}, true);

// lighting_turf.dm:61
rt.def("/turf/proc/get_lumcount", function get_lumcount(f: Frame, minlum: Value, maxlum: Value) {
	let thing: Value = null, L: Value = null;
	minlum ??= 0;
	maxlum ??= 1;
	if (!this.lighting_object) {
		return 1;
	}
	let totallums: Value = 0;
	for (thing of each(this.corners)) {
		if (!thing) {
			continue;
		}
		totallums += (L = thing).lum_r + L.lum_b + L.lum_g;
	}
	totallums /= 12;
	totallums = (totallums - minlum) / (maxlum - minlum);
	return max(0, min(totallums, 1));
});

// lighting_turf.dm:84
rt.def("/turf/proc/is_softly_lit", function is_softly_lit(f: Frame) {
	if (!this.lighting_object) {
		return 0;
	}
	return (!this.lighting_object.luminosity ? 1 : 0);
});

// lighting_turf.dm:91
rt.def("/turf/proc/recalc_atom_opacity", function recalc_atom_opacity(f: Frame) {
	let A: Value = null;
	this.has_opaque_atom = this.opacity;
	if (this.has_opaque_atom) return f.dot;
	for (A of each(this.contents, T("/atom"))) {
		if (A.opacity) {
			this.has_opaque_atom = 1;
			break;
		}
	}
	return f.dot;
});

// lighting_turf.dm:100
rt.def("/turf/proc/Entered", function Entered(f: Frame, Obj: Value, OldLoc: Value) {
	f.dot = parent_proc();
	if (!(Obj && Obj.opacity)) return f.dot;
	this.has_opaque_atom = 1;
	this.reconsider_lights();
	return f.dot;
}, false);

// lighting_turf.dm:107
rt.def("/turf/proc/Exited", function Exited(f: Frame, Obj: Value, newloc: Value) {
	f.dot = parent_proc();
	if (!(Obj && Obj.opacity)) return f.dot;
	this.recalc_atom_opacity();
	this.reconsider_lights();
	return f.dot;
}, false);

// lighting_turf.dm:114
rt.def("/turf/proc/change_area", function* change_area(f: Frame, old_area: Value, new_area: Value) {
	if (new_area.dynamic_lighting == old_area.dynamic_lighting) return f.dot;
	if (new_area.dynamic_lighting) {
		yield* this.lighting_build_overlay();
	} else {
		yield* this.lighting_clear_overlay();
	}
	return f.dot;
}, true);

// lighting_turf.dm:122
rt.def("/turf/proc/get_corners", function get_corners(f: Frame) {
	// Turfs without dynamic lighting (space) hand out their corners too, so walls and doors next to space
	// get light from a source standing in space. Those turfs have no lighting object, so they stay fullbright.
	// (2017 tg returned null here for them; ported from tg-translated.)
	if (!this.lighting_corners_initialised) {
		this.generate_missing_corners();
	}
	if (this.has_opaque_atom) {
		return null;
	}
	return this.corners;
});

// lighting_turf.dm:132
rt.def("/turf/proc/generate_missing_corners", function generate_missing_corners(f: Frame) {
	let i: Value = null;
	let $e: any;
	// Corners are made for non-dynamic (space) turfs too; see get_corners.
	this.lighting_corners_initialised = 1;
	if (!this.corners) {
		this.corners = list(null, null, null, null);
	}
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (rt.index(this.corners, i)) {
			continue;
		}
		rt.setAt(this.corners, i, new_(T("/datum/lighting_corner"), this, rt.index(GLOB.LIGHTING_CORNER_DIAGONAL, i)));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// lighting_turf.dm:146
rt.def("/turf/proc/ChangeTurf", function* ChangeTurf(f: Frame, path: Value) {
	let S: Value = null;
	if (!path || !GLOB.use_preloader && path == this.type || !GLOB.SSlighting.initialized) {
		return (yield* parent_proc());
	}
	let old_opacity: Value = this.opacity;
	let old_dynamic_lighting: Value = this.dynamic_lighting;
	let old_affecting_lights: Value = this.affecting_lights;
	let old_lighting_object: Value = this.lighting_object;
	let old_corners: Value = this.corners;
	f.dot = (yield* parent_proc());
	this.recalc_atom_opacity();
	this.lighting_object = old_lighting_object;
	this.affecting_lights = old_affecting_lights;
	this.corners = old_corners;
	if (old_opacity != this.opacity || this.dynamic_lighting != old_dynamic_lighting) {
		this.reconsider_lights();
	}
	if (this.dynamic_lighting != old_dynamic_lighting) {
		if (this.dynamic_lighting) {
			yield* this.lighting_build_overlay();
		} else {
			yield* this.lighting_clear_overlay();
		}
	}
	for (S of each(block(rt.locate(max(this.x - 1, 1), max(this.y - 1, 1), this.z), rt.locate(min(this.x + 1, rt.world().maxx), min(this.y + 1, rt.world().maxy), this.z)), T("/turf/open/space"))) {
		S.update_starlight();
	}
	return f.dot;
}, true);
