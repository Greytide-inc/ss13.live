// Based on /tg/station's code/modules/lighting/lighting_source.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(2804, "/datum/light_source", "/datum", {
	top_atom: null,
	source_atom: null,
	source_turf: null,
	pixel_turf: null,
	light_power: null,
	light_range: null,
	light_color: null,
	lum_r: null,
	lum_g: null,
	lum_b: null,
	applied_lum_r: null,
	applied_lum_g: null,
	applied_lum_b: null,
	effect_str: null,
	affecting_turfs: null,
	applied: 0,
	needs_update: 0,
}, { tmp: ["applied_lum_r","applied_lum_g","applied_lum_b"] });

// lighting_source.dm:33
rt.def("/datum/light_source/proc/New", function New(f: Frame, owner: Value, top: Value) {
	this.source_atom = owner;
	if (!this.source_atom.light_sources) {
		this.source_atom.light_sources = list();
	}
	this.source_atom.light_sources += this;
	this.top_atom = top;
	if (this.top_atom != this.source_atom) {
		if (!this.top_atom.light_sources) {
			this.top_atom.light_sources = list();
		}
		this.top_atom.light_sources += this;
	}
	this.source_turf = this.top_atom;
	this.pixel_turf = (get_turf_pixel(this.top_atom) || this.source_turf);
	this.light_power = this.source_atom.light_power;
	this.light_range = this.source_atom.light_range;
	this.light_color = this.source_atom.light_color;
	this.parse_light_color();
	this.update();
	return parent_proc();
}, false);

// lighting_source.dm:53
rt.def("/datum/light_source/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	this.remove_lum();
	if (this.source_atom) {
		if (this.source_atom.light_sources) {
			this.source_atom.light_sources -= this;
			if (!rt.len(f, this.source_atom.light_sources)) {
				this.source_atom.light_sources = null;
			}
		}
	}
	if (this.top_atom) {
		if (this.top_atom.light_sources) {
			this.top_atom.light_sources -= this;
			if (!rt.len(f, this.top_atom.light_sources)) {
				this.top_atom.light_sources = null;
			}
		}
	}
	f.dot = (yield* parent_proc());
	if (force) return f.dot;
	return QDEL_HINT_IWILLGC;
}, true);

// lighting_source.dm:77
rt.def("/datum/light_source/proc/update", function update(f: Frame, new_top_atom: Value) {
	if (new_top_atom && new_top_atom != this.top_atom) {
		if (this.top_atom != this.source_atom && this.top_atom.light_sources) {
			if (this.top_atom.light_sources) {
				this.top_atom.light_sources -= this;
				if (!rt.len(f, this.top_atom.light_sources)) {
					this.top_atom.light_sources = null;
				}
			}
		}
		this.top_atom = new_top_atom;
		if (this.top_atom != this.source_atom) {
			if (!this.top_atom.light_sources) {
				this.top_atom.light_sources = list();
			}
			this.top_atom.light_sources += this;
		}
	}
	if (this.needs_update == 0) {
		GLOB.lighting_update_lights += this;
	}
	if (!(this.needs_update < 2)) return f.dot;
	this.needs_update = 2;
	return f.dot;
});

// lighting_source.dm:90
rt.def("/datum/light_source/proc/force_update", function force_update(f: Frame) {
	if (this.needs_update == 0) {
		GLOB.lighting_update_lights += this;
	}
	if (!(this.needs_update < 3)) return f.dot;
	this.needs_update = 3;
	return f.dot;
});

// lighting_source.dm:94
rt.def("/datum/light_source/proc/vis_update", function vis_update(f: Frame) {
	if (this.needs_update == 0) {
		GLOB.lighting_update_lights += this;
	}
	if (!(this.needs_update < 1)) return f.dot;
	this.needs_update = 1;
	return f.dot;
});

// lighting_source.dm:99
rt.def("/datum/light_source/proc/parse_light_color", function parse_light_color(f: Frame) {
	if (this.light_color) {
		this.lum_r = GetRedPart(this.light_color) / 255;
		this.lum_g = GetGreenPart(this.light_color) / 255;
		this.lum_b = GetBluePart(this.light_color) / 255;
	} else {
		this.lum_r = 1;
		this.lum_g = 1;
		this.lum_b = 1;
	}
	return f.dot;
});

// lighting_source.dm:179
rt.def("/datum/light_source/proc/remove_lum", function remove_lum(f: Frame) {
	let thing: Value = null, _T: Value = null, C: Value = null;
	this.applied = 0;
	for (thing of each(this.affecting_turfs)) {
		if ((_T = thing).affecting_lights) {
			_T.affecting_lights -= this;
			if (!rt.len(f, _T.affecting_lights)) {
				_T.affecting_lights = null;
			}
		}
	}
	this.affecting_turfs = null;
	for (thing of each(this.effect_str)) {
		C = thing;
		f.dot = -rt.index(this.effect_str, C);
		C.update_lumcount(f.dot * this.applied_lum_r, f.dot * this.applied_lum_g, f.dot * this.applied_lum_b);
		if (C.affecting) {
			C.affecting -= this;
			if (!rt.len(f, C.affecting)) {
				C.affecting = null;
			}
		}
	}
	this.effect_str = null;
	return f.dot;
});

// lighting_source.dm:195
rt.def("/datum/light_source/proc/recalc_corner", function recalc_corner(f: Frame, C: Value) {
	if (!this.effect_str) {
		this.effect_str = list();
	}
	if (rt.index(this.effect_str, C)) {
		f.dot = -rt.index(this.effect_str, C);
		C.update_lumcount(f.dot * this.applied_lum_r, f.dot * this.applied_lum_g, f.dot * this.applied_lum_b);
		rt.setAt(this.effect_str, C, 0);
	}
	f.dot = 1 - max(0, min(rt.op(f, "Sqrt", [], [(C.x - this.pixel_turf.x) ** 2 + (C.y - this.pixel_turf.y) ** 2 + 1]) / max(1, this.light_range), 1));
	f.dot *= this.light_power;
	let OLD: Value = rt.index(this.effect_str, C);
	rt.setAt(this.effect_str, C, f.dot);
	C.update_lumcount(f.dot * this.lum_r - OLD * this.applied_lum_r, f.dot * this.lum_g - OLD * this.applied_lum_g, f.dot * this.lum_b - OLD * this.applied_lum_b);
	if (!(this.effect_str && !rt.len(f, this.effect_str))) return f.dot;
	this.effect_str = null;
	return f.dot;
});

// lighting_source.dm:206
rt.def("/datum/light_source/proc/update_corners", function* update_corners(f: Frame) {
	let _P: Value = null, thing: Value = null, C: Value = null, _T: Value = null, oldlum: Value = null, L: Value = null, OLD: Value = null;
	let update: Value = 0;
	if (!this.source_atom || !this.source_atom || this.source_atom.gc_destroyed) {
		yield* qdel(this);
		return f.dot;
	}
	if (this.source_atom.light_power != this.light_power) {
		this.light_power = this.source_atom.light_power;
		update = 1;
	}
	if (this.source_atom.light_range != this.light_range) {
		this.light_range = this.source_atom.light_range;
		update = 1;
	}
	if (!this.top_atom) {
		this.top_atom = this.source_atom;
		update = 1;
	}
	if (!this.light_range || !this.light_power) {
		yield* qdel(this);
		return f.dot;
	}
	if (isturf(this.top_atom)) {
		if (this.source_turf != this.top_atom) {
			this.source_turf = this.top_atom;
			this.pixel_turf = this.source_turf;
			update = 1;
		}
	} else if (this.top_atom.loc != this.source_turf) {
		this.source_turf = this.top_atom.loc;
		this.pixel_turf = get_turf_pixel(this.top_atom);
		update = 1;
	} else if ((_P = get_turf_pixel(this.top_atom)) != this.pixel_turf) {
		this.pixel_turf = _P;
		update = 1;
	}
	if (!isturf(this.source_turf)) {
		if (this.applied) {
			this.remove_lum();
		}
		return f.dot;
	}
	if (this.light_range && this.light_power && !this.applied) {
		update = 1;
	}
	if (this.source_atom.light_color != this.light_color) {
		this.light_color = this.source_atom.light_color;
		this.parse_light_color();
		update = 1;
	} else if (this.applied_lum_r != this.lum_r || this.applied_lum_g != this.lum_g || this.applied_lum_b != this.lum_b) {
		update = 1;
	}
	if (update) {
		this.needs_update = 2;
		this.applied = 1;
	} else if (this.needs_update == 2) {
		return f.dot;
	}
	let corners: Value = list();
	let turfs: Value = list();
	if (this.source_turf) {
		oldlum = this.source_turf.luminosity;
		this.source_turf.luminosity = Ceiling(this.light_range);
		for (_T of each(view(Ceiling(this.light_range), this.source_turf), T("/turf"))) {
			for (thing of each(_T.get_corners(this.source_turf))) {
				if (!thing) {
					continue;
				}
				C = thing;
				rt.setAt(corners, C, 0);
			}
			turfs += _T;
		}
		this.source_turf.luminosity = oldlum;
	}
	if (!this.affecting_turfs) {
		this.affecting_turfs = list();
	}
	this.affecting_turfs += (L = turfs - this.affecting_turfs);
	for (thing of each(L)) {
		if (!(_T = thing).affecting_lights) {
			_T.affecting_lights = list();
		}
		_T.affecting_lights += this;
	}
	this.affecting_turfs -= (L = this.affecting_turfs - turfs);
	for (thing of each(L)) {
		if ((_T = thing).affecting_lights) {
			_T.affecting_lights -= this;
			if (!rt.len(f, _T.affecting_lights)) {
				_T.affecting_lights = null;
			}
		}
	}
	if (!this.effect_str) {
		this.effect_str = list();
	}
	if (this.needs_update == 1) {
		for (thing of each(corners - this.effect_str)) {
			if (!thing) {
				continue;
			}
			if (!(C = thing).affecting) {
				C.affecting = list();
			}
			C.affecting += this;
			if (!C.active) {
				rt.setAt(this.effect_str, C, 0);
				continue;
			}
			f.dot = 1 - max(0, min(rt.op(f, "Sqrt", [], [(C.x - this.pixel_turf.x) ** 2 + (C.y - this.pixel_turf.y) ** 2 + 1]) / max(1, this.light_range), 1));
			f.dot *= this.light_power;
			OLD = rt.index(this.effect_str, C);
			rt.setAt(this.effect_str, C, f.dot);
			C.update_lumcount(f.dot * this.lum_r - OLD * this.applied_lum_r, f.dot * this.lum_g - OLD * this.applied_lum_g, f.dot * this.lum_b - OLD * this.applied_lum_b);
		}
	} else {
		for (thing of each((L = corners - this.effect_str))) {
			if (!thing) {
				continue;
			}
			if (!(C = thing).affecting) {
				C.affecting = list();
			}
			C.affecting += this;
			if (!C.active) {
				rt.setAt(this.effect_str, C, 0);
				continue;
			}
			f.dot = 1 - max(0, min(rt.op(f, "Sqrt", [], [(C.x - this.pixel_turf.x) ** 2 + (C.y - this.pixel_turf.y) ** 2 + 1]) / max(1, this.light_range), 1));
			f.dot *= this.light_power;
			OLD = rt.index(this.effect_str, C);
			rt.setAt(this.effect_str, C, f.dot);
			C.update_lumcount(f.dot * this.lum_r - OLD * this.applied_lum_r, f.dot * this.lum_g - OLD * this.applied_lum_g, f.dot * this.lum_b - OLD * this.applied_lum_b);
		}
		for (thing of each(corners - L)) {
			if (!thing) {
				continue;
			}
			if (!(C = thing).active) {
				rt.setAt(this.effect_str, C, 0);
				continue;
			}
			f.dot = 1 - max(0, min(rt.op(f, "Sqrt", [], [(C.x - this.pixel_turf.x) ** 2 + (C.y - this.pixel_turf.y) ** 2 + 1]) / max(1, this.light_range), 1));
			f.dot *= this.light_power;
			OLD = rt.index(this.effect_str, C);
			rt.setAt(this.effect_str, C, f.dot);
			C.update_lumcount(f.dot * this.lum_r - OLD * this.applied_lum_r, f.dot * this.lum_g - OLD * this.applied_lum_g, f.dot * this.lum_b - OLD * this.applied_lum_b);
		}
	}
	for (thing of each((L = this.effect_str - corners))) {
		if (!thing) {
			continue;
		}
		C = thing;
		f.dot = -rt.index(this.effect_str, C);
		C.update_lumcount(f.dot * this.applied_lum_r, f.dot * this.applied_lum_g, f.dot * this.applied_lum_b);
		if (C.affecting) {
			C.affecting -= this;
			if (!rt.len(f, C.affecting)) {
				C.affecting = null;
			}
		}
	}
	this.effect_str -= L;
	this.applied_lum_r = this.lum_r;
	this.applied_lum_g = this.lum_g;
	this.applied_lum_b = this.lum_b;
	if (this.effect_str && !rt.len(f, this.effect_str)) {
		this.effect_str = null;
	}
	if (!(this.affecting_turfs && !rt.len(f, this.affecting_turfs))) return f.dot;
	this.affecting_turfs = null;
	return f.dot;
}, true);
