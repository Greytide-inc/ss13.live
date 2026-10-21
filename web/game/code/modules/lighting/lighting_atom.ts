// From code/modules/lighting/lighting_atom.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /atom/proc/set_light  (code/modules/lighting/lighting_atom.dm:15)
rt.def("/atom/proc/set_light", function set_light(f: Frame, l_range: Value, l_power: Value, l_color: Value) {
	f.vars = () => [l_range, l_color];
	if (live(l_color) === null) {
		l_color = -99999;
	}
	if ((rt.gt(live(l_range), 0) && rt.lt(live(l_range), 1.399999976158142))) {
		l_range = 1.399999976158142;
	}
	if (live(l_power) !== null) {
		rt.setSv(f, "light_power", live(l_power));
	}
	if (live(l_range) !== null) {
		rt.setSv(f, "light_range", live(l_range));
	}
	if (!isEqual(live(l_color), -99999)) {
		rt.setSv(f, "light_color", live(l_color));
	}
	rt.callSrc(f, "update_light", []);
	return f.dot;
});

// /atom/proc/update_light  (code/modules/lighting/lighting_atom.dm:34)  may sleep
rt.def("/atom/proc/update_light", function* update_light(f: Frame) {
	if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "light_power")) || !truthy(rt.sv(f, "light_range")))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "light")]);
		rt.setSv(f, "light", null);
	} else {
		if (!truthy((rt.istype(rt.sv(f, "loc"), T("/atom/movable")) ? 1 : 0))) {
			f.dot = live(f.src);
		} else {
			f.dot = rt.sv(f, "loc");
		}
		if (truthy(rt.sv(f, "light"))) {
			yield* g.callName(f, rt.sv(f, "light"), "update", [live(f.dot)]);
		} else {
			rt.setSv(f, "light", (yield* g.new_(f, T("/datum/light_source"), [live(f.src), live(f.dot)])));
		}
	}
	return f.dot;
}, true, { waitfor: false });

// /atom/movable/proc/Destroy  (code/modules/lighting/lighting_atom.dm:52)  may sleep
rt.def("/atom/movable/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null, old_has_opaque_atom: Value = null;
	f.vars = () => [_T, old_has_opaque_atom];
	_T = rt.sv(f, "loc");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(rt.sv(f, "opacity")) && truthy((rt.istype(live(_T), T("/turf")) ? 1 : 0)))) return f.dot;
	old_has_opaque_atom = rt.fv(f, "has_opaque_atom", live(_T));
	yield* g.callName(f, live(_T), "recalc_atom_opacity", []);
	if (isEqual(live(old_has_opaque_atom), rt.fv(f, "has_opaque_atom", live(_T)))) return f.dot;
	yield* g.callName(f, live(_T), "reconsider_lights", []);
	return f.dot;
}, true);

// /atom/proc/set_opacity  (code/modules/lighting/lighting_atom.dm:63)
rt.def("/atom/proc/set_opacity", function set_opacity(f: Frame, new_opacity: Value) {
	let _T: Value = null, old_has_opaque_atom: Value = null;
	f.vars = () => [_T, old_has_opaque_atom];
	if (isEqual(live(new_opacity), rt.sv(f, "opacity"))) {
		return live(f.dot);
	}
	rt.setSv(f, "opacity", live(new_opacity));
	if (!truthy(rt.call(f, P("/proc/isturf"), null, [(_T = rt.sv(f, "loc"))]))) {
		return live(f.dot);
	}
	if (isEqual(live(new_opacity), 1)) {
		rt.setFv(f, "has_opaque_atom", live(_T), 1);
		rt.callName(f, live(_T), "reconsider_lights", []);
	} else {
		old_has_opaque_atom = rt.fv(f, "has_opaque_atom", live(_T));
		rt.callName(f, live(_T), "recalc_atom_opacity", []);
		if (isEqual(live(old_has_opaque_atom), rt.fv(f, "has_opaque_atom", live(_T)))) return f.dot;
		rt.callName(f, live(_T), "reconsider_lights", []);
	}
	return f.dot;
});

// /atom/movable/proc/Moved  (code/modules/lighting/lighting_atom.dm:82)  may sleep
rt.def("/atom/movable/proc/Moved", function* Moved(f: Frame) {
	let L: Value = null, thing: Value = null;
	let $e: any;
	f.vars = () => [L, thing, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	L = null;
	thing = null;
	rt.forList(f, 0, rt.sv(f, "light_sources"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		yield* g.callName(f, rt.gv(f, "source_atom", (L = live(thing))), "update_light", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["OldLoc", "Dir"] });

// /atom/proc/vv_edit_var  (code/modules/lighting/lighting_atom.dm:90)
rt.def("/atom/proc/vv_edit_var", function vv_edit_var(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(f.args[0]);
	if ($0 === "light_range") {
		rt.callSrc(f, "set_light", ["l_range", live(f.args[1])], rt.Args.Named);
		return live(f.dot);
	} else if ($0 === "light_power") {
		rt.callSrc(f, "set_light", ["l_power", live(f.args[1])], rt.Args.Named);
		return live(f.dot);
	} else if ($0 === "light_color") {
		rt.callSrc(f, "set_light", ["l_color", live(f.args[1])], rt.Args.Named);
		return live(f.dot);
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["var_name", "var_value"] });
