// Based on /tg/station's code/modules/lighting/lighting_corner.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// lighting_corner.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobalLIGHTING_CORNER_DIAGONAL", function InitGlobalLIGHTING_CORNER_DIAGONAL(f: Frame) {
	GLOB.LIGHTING_CORNER_DIAGONAL = list(5, 6, 10, 9);
	this.gvars_datum_init_order += "LIGHTING_CORNER_DIAGONAL";
	return f.dot;
});

rt.type(2802, "/datum/lighting_corner", "/datum", {
	masters: null,
	affecting: null,
	active: 0,
	x: 0,
	y: 0,
	z: 0,
	lum_r: 0,
	lum_g: 0,
	lum_b: 0,
	needs_update: 0,
	cache_r: 0,
	cache_g: 0,
	cache_b: 0,
	cache_mx: 0,
});

// lighting_corner.dm:29
rt.def("/datum/lighting_corner/proc/New", function New(f: Frame, new_turf: Value, diagonal: Value) {
	let _T: Value = null, i: Value = null;
	f.dot = parent_proc();
	this.masters = list();
	rt.setAt(this.masters, new_turf, turn(diagonal, 180));
	this.z = new_turf.z;
	let vertical: Value = rt.bitAnd(diagonal, rt.op(f, "BitNot", [], [diagonal - 1]));
	let horizontal: Value = rt.bitAnd(diagonal, rt.op(f, "BitNot", [], [vertical]));
	let $0: any = new_turf.x;
	this.x = $0 + (horizontal == 4 ? 0.5 : -0.5);
	this.y = new_turf.y + (vertical == 1 ? 0.5 : -0.5);
	if (_T = rt.getStep(f, new_turf, diagonal)) {
		if (!_T.corners) {
			_T.corners = list(null, null, null, null);
		}
		rt.setAt(this.masters, _T, diagonal);
		i = GLOB.LIGHTING_CORNER_DIAGONAL.Find(turn(diagonal, 180));
		rt.setAt(_T.corners, i, this);
	}
	if (_T = rt.getStep(f, new_turf, horizontal)) {
		if (!_T.corners) {
			_T.corners = list(null, null, null, null);
		}
		rt.setAt(this.masters, _T, rt.bitOr(_T.x > this.x ? 4 : 8, _T.y > this.y ? 1 : 2));
		i = GLOB.LIGHTING_CORNER_DIAGONAL.Find(turn(rt.index(this.masters, _T), 180));
		rt.setAt(_T.corners, i, this);
	}
	if (_T = rt.getStep(f, new_turf, vertical)) {
		if (!_T.corners) {
			_T.corners = list(null, null, null, null);
		}
		rt.setAt(this.masters, _T, rt.bitOr(_T.x > this.x ? 4 : 8, _T.y > this.y ? 1 : 2));
		i = GLOB.LIGHTING_CORNER_DIAGONAL.Find(turn(rt.index(this.masters, _T), 180));
		rt.setAt(_T.corners, i, this);
	}
	this.update_active();
	return f.dot;
}, false);

// lighting_corner.dm:82
rt.def("/datum/lighting_corner/proc/update_active", function update_active(f: Frame) {
	let _T: Value = null, thing: Value = null;
	this.active = 0;
	for (thing of each(this.masters)) {
		if ((_T = thing).lighting_object) {
			this.active = 1;
		}
	}
	return f.dot;
});

// lighting_corner.dm:89
rt.def("/datum/lighting_corner/proc/update_lumcount", function update_lumcount(f: Frame, delta_r: Value, delta_g: Value, delta_b: Value) {
	this.lum_r += delta_r;
	this.lum_g += delta_g;
	this.lum_b += delta_b;
	if (this.needs_update) return f.dot;
	this.needs_update = 1;
	GLOB.lighting_update_corners += this;
	return f.dot;
});

// lighting_corner.dm:102
rt.def("/datum/lighting_corner/proc/update_objects", function update_objects(f: Frame) {
	let TT: Value = null, _T: Value = null;
	let lum_r: Value = this.lum_r;
	let lum_g: Value = this.lum_g;
	let lum_b: Value = this.lum_b;
	let mx: Value = max(lum_r, lum_g, lum_b);
	f.dot = 1;
	if (mx > 1) {
		f.dot = 1 / mx;
	}
	this.cache_r = round(lum_r * f.dot, 0.015625);
	this.cache_g = round(lum_g * f.dot, 0.015625);
	this.cache_b = round(lum_b * f.dot, 0.015625);
	this.cache_mx = round(mx, 0.015625);
	for (TT of each(this.masters)) {
		if ((_T = TT).lighting_object) {
			if (!_T.lighting_object.needs_update) {
				_T.lighting_object.needs_update = 1;
				GLOB.lighting_update_objects += _T.lighting_object;
			}
		}
	}
	return f.dot;
});

// lighting_corner.dm:134
rt.def("/datum/lighting_corner/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	if (!force) {
		return QDEL_HINT_LETMELIVE;
	}
	stack_trace("Ok, Look, TG, I need you to find whatever fucker decided to call qdel on a fucking lighting corner, then tell him very nicely and politely that he is 100% retarded and needs his head checked. Thanks. Send them my regards by the way.");
	return (yield* parent_proc());
}, true);
