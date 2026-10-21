// From code/modules/admin/create_mob.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/admins/proc/create_mob  (code/modules/admin/create_mob.dm:4)
rt.def("/datum/admins/proc/create_mob", function create_mob(f: Frame, user: Value) {
	let mobjs: Value = null;
	f.vars = () => [mobjs];
	if (!truthy(rt.gl("create_mob_html"))) {
		mobjs = null;
		mobjs = rt.call(f, P("/proc/jointext"), null, [rt.call(f, P("/proc/typesof"), null, [T("/mob")]), ";"]);
		rt.setGl("create_mob_html", rt.call(f, P("/proc/file2text"), null, [rt.rsc("html/create_object.html")]));
		rt.setGl("create_mob_html", rt.call(f, P("/proc/replacetext"), null, [rt.gl("create_mob_html"), "null /* object types */", fmt("\"＀\"", [live(mobjs)])]));
	}
	rt.op(f, "Browse", [], [live(user), rt.call(f, P("/proc/replacetext"), null, [rt.gl("create_mob_html"), "/* ref src */", fmt("＃", [live(f.src)])]), "window=create_mob;size=425x475"], false);
	return f.dot;
});

// /proc/randomize_human  (code/modules/admin/create_mob.dm:13)  may sleep
rt.def("/proc/randomize_human", function* randomize_human(f: Frame, H: Value) {
	f.vars = () => [H];
	rt.setFv(f, "gender", live(H), rt.op(f, "PickUnweighted", [2], ["male", "female"]));
	rt.setFv(f, "real_name", live(H), (yield* g.call(f, P("/proc/random_unique_name"), null, [rt.fv(f, "gender", live(H))])));
	rt.setFv(f, "name", live(H), rt.fv(f, "real_name", live(H)));
	rt.setFv(f, "underwear", live(H), (yield* g.call(f, P("/proc/random_underwear"), null, [rt.fv(f, "gender", live(H))])));
	rt.setFv(f, "skin_tone", live(H), (yield* g.call(f, P("/proc/random_skin_tone"), null, [])));
	rt.setFv(f, "hair_style", live(H), (yield* g.call(f, P("/proc/random_hair_style"), null, [rt.fv(f, "gender", live(H))])));
	rt.setFv(f, "facial_hair_style", live(H), (yield* g.call(f, P("/proc/random_facial_hair_style"), null, [rt.fv(f, "gender", live(H))])));
	rt.setFv(f, "hair_color", live(H), (yield* g.call(f, P("/proc/random_short_color"), null, [])));
	rt.setFv(f, "facial_hair_color", live(H), rt.fv(f, "hair_color", live(H)));
	rt.setFv(f, "eye_color", live(H), (yield* g.call(f, P("/proc/random_eye_color"), null, [])));
	rt.setFv(f, "blood_type", rt.fv(f, "dna", live(H)), (yield* g.call(f, P("/proc/random_blood_type"), null, [])));
	yield* g.callName(f, live(H), "update_body", []);
	yield* g.callName(f, live(H), "update_hair", []);
	yield* g.callName(f, live(H), "update_body_parts", []);
	return f.dot;
}, true);
