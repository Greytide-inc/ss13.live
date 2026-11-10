// Based on /tg/station's code/modules/admin/create_turf.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// create_turf.dm:3
rt.def("/datum/admins/proc/create_turf", function create_turf(f: Frame, user: Value) {
	let turfjs: Value = null;
	if (!GLOB.create_turf_html) {
		turfjs = jointext(typesof(T("/turf")), ";");
		GLOB.create_turf_html = file2text(rt.rsc("html/create_object.html"));
		GLOB.create_turf_html = replacetext(GLOB.create_turf_html, "null /* object types */", `"${turfjs}"`);
	}
	rt.op(f, "Browse", [], [user, replacetext(GLOB.create_turf_html, "/* ref src */", fmt("＃", [this])), "window=create_turf;size=425x475"], false);
	return f.dot;
});
