// Based on /tg/station's code/modules/lighting/lighting_object.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


// lighting_object.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalall_lighting_objects", function InitGlobalall_lighting_objects(f: Frame) {
	GLOB.all_lighting_objects = list();
	this.gvars_datum_init_order += "all_lighting_objects";
	return f.dot;
});

rt.type(4805, "/atom/movable/lighting_object", "/atom/movable", {
	needs_update: 0,
	anchored: 1,
	name: "",
	icon: rt.rsc("icons/effects/lighting_object.dmi"),
	icon_state: "transparent",
	color: null,
	plane: 15,
	mouse_opacity: 0,
	layer: 15,
	invisibility: 20,
	blend_mode: 2,
});

// lighting_object.dm:21
rt.def("/atom/movable/lighting_object/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	let _T: Value = null, S: Value = null;
	f.dot = parent_proc();
	this.verbs.Cut();
	(_T = this.loc).lighting_object = this;
	_T.luminosity = 0;
	for (S of each(block(rt.locate(max(this.x - 1, 1), max(this.y - 1, 1), this.z), rt.locate(min(this.x + 1, rt.world().maxx), min(this.y + 1, rt.world().maxy), this.z)), T("/turf/open/space"))) {
		S.update_starlight();
	}
	this.needs_update = 1;
	GLOB.lighting_update_objects += this;
	return f.dot;
}, false);

// lighting_object.dm:37
rt.def("/atom/movable/lighting_object/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	let _T: Value = null;
	if (force) {
		GLOB.lighting_update_objects -= this;
		if (rt.istype((_T = this.loc), T("/turf"))) {
			_T.lighting_object = null;
			_T.luminosity = 1;
		}
		return (yield* parent_proc());
	} else {
		return 1;
	}
}, true);

// lighting_object.dm:50
rt.def("/atom/movable/lighting_object/proc/update", function* update(f: Frame) {
	let _T: Value = null;
	if (!rt.istype((_T = this.loc), T("/turf"))) {
		if (this.loc) {
			warning(`A lighting object realised its loc was NOT a turf (actual loc: ${this.loc}, ${this.loc.type}) in update()!`);
		} else {
			warning("A lighting object realised it was in nullspace in update()!");
		}
		yield* qdel(this, 1);
		return f.dot;
	}
	let corners: Value = _T.corners;
	let cr: Value = GLOB.dummy_lighting_corner;
	let cg: Value = GLOB.dummy_lighting_corner;
	let cb: Value = GLOB.dummy_lighting_corner;
	let ca: Value = GLOB.dummy_lighting_corner;
	if (corners) {
		cr = (rt.index(corners, 3) || GLOB.dummy_lighting_corner);
		cg = (rt.index(corners, 2) || GLOB.dummy_lighting_corner);
		cb = (rt.index(corners, 4) || GLOB.dummy_lighting_corner);
		ca = (rt.index(corners, 1) || GLOB.dummy_lighting_corner);
	}
	let max: Value = (yield* g.call(f, P("/proc/max"), null, [cr.cache_mx, cg.cache_mx, cb.cache_mx, ca.cache_mx]));
	let rr: Value = cr.cache_r;
	let rg: Value = cr.cache_g;
	let rb: Value = cr.cache_b;
	let gr: Value = cg.cache_r;
	let gg: Value = cg.cache_g;
	let gb: Value = cg.cache_b;
	let br: Value = cb.cache_r;
	let bg: Value = cb.cache_g;
	let bb: Value = cb.cache_b;
	let ar: Value = ca.cache_r;
	let ag: Value = ca.cache_g;
	let ab: Value = ca.cache_b;
	let set_luminosity: Value = (max > 0.000001 ? 1 : 0);
	if (rt.bitAnd(rt.bitAnd(rt.bitAnd(rr, gr), br), ar) && rg + gg + bg + ag + rb + gb + bb + ab == 8) {
		this.icon_state = "transparent";
		this.color = null;
	} else if (!set_luminosity) {
		this.icon_state = "dark";
		this.color = null;
	} else {
		this.icon_state = null;
		this.color = list(rr, rg, rb, 0, gr, gg, gb, 0, br, bg, bb, 0, ar, ag, ab, 0, 0, 0, 0, 1);
	}
	this.luminosity = set_luminosity;
	return f.dot;
}, true);

// lighting_object.dm:149
rt.def("/atom/movable/lighting_object/proc/forceMove", function* forceMove(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!f.args[2]) return f.dot;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["destination", "no_tp", "harderforce"] });
