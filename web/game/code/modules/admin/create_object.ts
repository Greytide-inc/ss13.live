// Based on /tg/station's code/modules/admin/create_object.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


// create_object.dm:3
rt.def("/datum/admins/proc/create_object", function create_object(f: Frame, user: Value) {
	let objectjs: Value = null;
	if (!GLOB.create_object_html) {
		objectjs = jointext(typesof(T("/obj")), ";");
		GLOB.create_object_html = file2text(rt.rsc("html/create_object.html"));
		GLOB.create_object_html = replacetext(GLOB.create_object_html, "null /* object types */", `"${objectjs}"`);
	}
	rt.op(f, "Browse", [], [user, replacetext(GLOB.create_object_html, "/* ref src */", fmt("＃", [this])), "window=create_object;size=425x475"], false);
	return f.dot;
});

// create_object.dm:17
rt.def("/datum/admins/proc/quick_create_object", function* quick_create_object(f: Frame, user: Value) {
	let html_form: Value = null, objectjs: Value = null;
	let path: Value = (yield* g.op(f, "Prompt", [0], [null, T("/obj"), "Path", "Select the path of the object you wish to create.", GLOB.create_object_forms]));
	if (!(html_form = rt.index(GLOB.create_object_forms, path))) {
		objectjs = jointext(typesof(path), ";");
		html_form = replacetext((html_form = file2text(rt.rsc("html/create_object.html"))), "null /* object types */", `"${objectjs}"`);
		rt.setAt(GLOB.create_object_forms, path, html_form);
	}
	rt.op(f, "Browse", [], [user, replacetext(html_form, "/* ref src */", fmt("＃", [this])), `window=qco${path};size=425x475`], false);
	return f.dot;
}, true);
