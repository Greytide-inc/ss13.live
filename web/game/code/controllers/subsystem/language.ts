// From code/controllers/subsystem/language.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(25, "/datum/controller/subsystem/language", "/datum/controller/subsystem", {
	name: "Language",
	init_order: 10,
	flags: 2,
});

// /datum/controller/subsystem/language/proc/New  (code/controllers/subsystem/language.dm:1)  may sleep
rt.def("/datum/controller/subsystem/language/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSlanguage"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSlanguage"), T("/datum/controller/subsystem/language")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSlanguage")]);
		}
		rt.setGl("SSlanguage", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/language/proc/Initialize  (code/controllers/subsystem/language.dm:7)  may sleep
rt.def("/datum/controller/subsystem/language/proc/Initialize", function* Initialize(f: Frame) {
	let L: Value = null, language: Value = null, instance: Value = null;
	let $e: any;
	f.vars = () => [L, language, instance, $e];
	L = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/language")])), T("/datum/language")));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (!truthy(rt.initial(f, (language = live(L)), "key"))) {
			continue;
		}
		rt.modGl("all_languages", live(language), add);
		instance = (yield* g.new_(f, live(language), []));
		rt.setAt(rt.gl("language_datum_instances"), live(language), live(instance));
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["timeofday"] });
