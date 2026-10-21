// From code/modules/lighting/lighting_area.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /area/proc/set_dynamic_lighting  (code/modules/lighting/lighting_area.dm:6)  may sleep
rt.def("/area/proc/set_dynamic_lighting", function* set_dynamic_lighting(f: Frame, new_dynamic_lighting: Value) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [new_dynamic_lighting, _T, $e];
	if (live(new_dynamic_lighting) === null) {
		new_dynamic_lighting = 1;
	}
	if (isEqual(live(new_dynamic_lighting), rt.sv(f, "dynamic_lighting"))) {
		return 0;
	}
	rt.setSv(f, "dynamic_lighting", live(new_dynamic_lighting));
	if (truthy(rt.fv(f, "dynamic_lighting", live(f.src)))) {
		yield* g.srcCall(f, "cut_overlay", T("/obj/effect/fullbright"));
		_T = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/area_contents"), null, [live(f.src)])), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			if (truthy(rt.fv(f, "dynamic_lighting", live(_T)))) {
				yield* g.callName(f, live(_T), "lighting_build_overlay", []);
			}
		}
		rt.endFor(f, 0);
	} else {
		yield* g.srcCall(f, "add_overlay", T("/obj/effect/fullbright"));
		_T = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/area_contents"), null, [live(f.src)])), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			if (truthy(rt.fv(f, "lighting_object", live(_T)))) {
				yield* g.callName(f, live(_T), "lighting_clear_overlay", []);
			}
		}
		rt.endFor(f, 0);
	}
	return 1;
}, true);

// /area/proc/vv_edit_var  (code/modules/lighting/lighting_area.dm:26)  may sleep
rt.def("/area/proc/vv_edit_var", function* vv_edit_var(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(f.args[0]);
	if ($0 === "dynamic_lighting") {
		yield* g.srcCall(f, "set_dynamic_lighting", live(f.args[1]));
		return 1;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["var_name", "var_value"] });
