// Based on /tg/station's code/modules/lighting/lighting_atom.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// lighting_atom.dm:15
rt.def("/atom/proc/set_light", function set_light(f: Frame, l_range: Value, l_power: Value, l_color: Value) {
	l_color ??= NONSENSICAL_VALUE;
	if (l_range > 0 && l_range < MINIMUM_USEFUL_LIGHT_RANGE) {
		l_range = MINIMUM_USEFUL_LIGHT_RANGE;
	}
	if (l_power !== null) {
		this.light_power = l_power;
	}
	if (l_range !== null) {
		this.light_range = l_range;
	}
	if (l_color != -99999) {
		this.light_color = l_color;
	}
	this.update_light();
	return f.dot;
});

// lighting_atom.dm:34
rt.def("/atom/proc/update_light", function* update_light(f: Frame) {
	if (!this || this.gc_destroyed) {
		return f.dot;
	}
	if (!this.light_power || !this.light_range) {
		yield* qdel(this.light);
		this.light = null;
	} else {
		if (!rt.istype(this.loc, T("/atom/movable"))) {
			f.dot = this;
		} else {
			f.dot = this.loc;
		}
		if (this.light) {
			yield* this.light.update(f.dot);
		} else {
			this.light = (yield* new_(T("/datum/light_source"), this, f.dot));
		}
	}
	return f.dot;
}, true, { waitfor: false });

// lighting_atom.dm:52
rt.def("/atom/movable/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = this.loc;
	f.dot = (yield* parent_proc());
	if (!(this.opacity && rt.istype(_T, T("/turf")))) return f.dot;
	let old_has_opaque_atom: Value = _T.has_opaque_atom;
	_T.recalc_atom_opacity();
	if (old_has_opaque_atom == _T.has_opaque_atom) return f.dot;
	_T.reconsider_lights();
	return f.dot;
}, true);

// lighting_atom.dm:63
rt.def("/atom/proc/set_opacity", function set_opacity(f: Frame, new_opacity: Value) {
	let _T: Value = null, old_has_opaque_atom: Value = null;
	if (new_opacity == this.opacity) {
		return f.dot;
	}
	this.opacity = new_opacity;
	if (!isturf((_T = this.loc))) {
		return f.dot;
	}
	if (new_opacity == 1) {
		_T.has_opaque_atom = 1;
		_T.reconsider_lights();
	} else {
		old_has_opaque_atom = _T.has_opaque_atom;
		_T.recalc_atom_opacity();
		if (old_has_opaque_atom == _T.has_opaque_atom) return f.dot;
		_T.reconsider_lights();
	}
	return f.dot;
});

// lighting_atom.dm:82
rt.def("/atom/movable/proc/Moved", function* Moved(f: Frame, OldLoc: Value, Dir: Value) {
	let L: Value = null, thing: Value = null;
	f.dot = (yield* parent_proc());
	for (thing of each(this.light_sources)) {
		yield* (L = thing).source_atom.update_light();
	}
	return f.dot;
}, true);

// lighting_atom.dm:90
rt.def("/atom/proc/vv_edit_var", function vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	if (var_name === "light_range") {
		this.set_light({ l_range: var_value });
		return f.dot;
	} else if (var_name === "light_power") {
		this.set_light({ l_power: var_value });
		return f.dot;
	} else if (var_name === "light_color") {
		this.set_light({ l_color: var_value });
		return f.dot;
	}
	return parent_proc();
}, false);
