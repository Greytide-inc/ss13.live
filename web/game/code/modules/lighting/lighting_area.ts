// Based on /tg/station's code/modules/lighting/lighting_area.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// lighting_area.dm:6
rt.def("/area/proc/set_dynamic_lighting", function* set_dynamic_lighting(f: Frame, new_dynamic_lighting: Value) {
	let _T: Value = null;
	new_dynamic_lighting ??= 1;
	if (new_dynamic_lighting == this.dynamic_lighting) {
		return 0;
	}
	this.dynamic_lighting = new_dynamic_lighting;
	if (this.dynamic_lighting) {
		this.cut_overlay(T("/obj/effect/fullbright"));
		for (_T of each(area_contents(this), T("/turf"))) {
			if (_T.dynamic_lighting) {
				yield* _T.lighting_build_overlay();
			}
		}
	} else {
		this.add_overlay(T("/obj/effect/fullbright"));
		_T = null;
		for (_T of each(area_contents(this), T("/turf"))) {
			if (_T.lighting_object) {
				yield* _T.lighting_clear_overlay();
			}
		}
	}
	return 1;
}, true);

// lighting_area.dm:26
rt.def("/area/proc/vv_edit_var", function* vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	if (var_name === "dynamic_lighting") {
		yield* this.set_dynamic_lighting(var_value);
		return 1;
	}
	return (yield* parent_proc());
}, true);
