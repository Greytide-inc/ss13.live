// From code/modules/admin/create_object.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/admins/proc/create_object  (code/modules/admin/create_object.dm:3)
rt.def("/datum/admins/proc/create_object", function create_object(f: Frame, user: Value) {
	let objectjs: Value = null;
	f.vars = () => [objectjs];
	if (!truthy(rt.gl("create_object_html"))) {
		objectjs = null;
		objectjs = rt.call(f, P("/proc/jointext"), null, [rt.call(f, P("/proc/typesof"), null, [T("/obj")]), ";"]);
		rt.setGl("create_object_html", rt.call(f, P("/proc/file2text"), null, [rt.rsc("html/create_object.html")]));
		rt.setGl("create_object_html", rt.call(f, P("/proc/replacetext"), null, [rt.gl("create_object_html"), "null /* object types */", fmt("\"＀\"", [live(objectjs)])]));
	}
	rt.op(f, "Browse", [], [live(user), rt.call(f, P("/proc/replacetext"), null, [rt.gl("create_object_html"), "/* ref src */", fmt("＃", [live(f.src)])]), "window=create_object;size=425x475"], false);
	return f.dot;
});

// /datum/admins/proc/quick_create_object  (code/modules/admin/create_object.dm:17)  may sleep
rt.def("/datum/admins/proc/quick_create_object", function* quick_create_object(f: Frame, user: Value) {
	let path: Value = null, html_form: Value = null, objectjs: Value = null;
	f.vars = () => [user, path, html_form, objectjs];
	path = (yield* g.op(f, "Prompt", [0], [null, T("/obj"), "Path", "Select the path of the object you wish to create.", rt.gl("create_object_forms")]));
	if (!truthy((html_form = rt.index(rt.gl("create_object_forms"), live(path))))) {
		objectjs = (yield* g.call(f, P("/proc/jointext"), null, [(yield* g.call(f, P("/proc/typesof"), null, [live(path)])), ";"]));
		html_form = (yield* g.call(f, P("/proc/replacetext"), null, [(html_form = (yield* g.call(f, P("/proc/file2text"), null, [rt.rsc("html/create_object.html")]))), "null /* object types */", fmt("\"＀\"", [live(objectjs)])]));
		rt.setAt(rt.gl("create_object_forms"), live(path), live(html_form));
	}
	rt.op(f, "Browse", [], [live(user), (yield* g.call(f, P("/proc/replacetext"), null, [live(html_form), "/* ref src */", fmt("＃", [live(f.src)])])), fmt("window=qco＀;size=425x475", [live(path)])], false);
	return f.dot;
}, true);
