// From code/modules/admin/create_turf.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/admins/proc/create_turf  (code/modules/admin/create_turf.dm:3)
rt.def("/datum/admins/proc/create_turf", function create_turf(f: Frame, user: Value) {
	let turfjs: Value = null;
	f.vars = () => [turfjs];
	if (!truthy(rt.gl("create_turf_html"))) {
		turfjs = null;
		turfjs = rt.call(f, P("/proc/jointext"), null, [rt.call(f, P("/proc/typesof"), null, [T("/turf")]), ";"]);
		rt.setGl("create_turf_html", rt.call(f, P("/proc/file2text"), null, [rt.rsc("html/create_object.html")]));
		rt.setGl("create_turf_html", rt.call(f, P("/proc/replacetext"), null, [rt.gl("create_turf_html"), "null /* object types */", fmt("\"＀\"", [live(turfjs)])]));
	}
	rt.op(f, "Browse", [], [live(user), rt.call(f, P("/proc/replacetext"), null, [rt.gl("create_turf_html"), "/* ref src */", fmt("＃", [live(f.src)])]), "window=create_turf;size=425x475"], false);
	return f.dot;
});
