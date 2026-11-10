// Based on /tg/station's code/controllers/subsystem/language.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(25, "/datum/controller/subsystem/language", "/datum/controller/subsystem", {
	name: "Language",
	init_order: 10,
	flags: 2,
});

// language.dm:1
rt.def("/datum/controller/subsystem/language/proc/New", function* New(f: Frame) {
	if (GLOB.SSlanguage != this) {
		if (rt.istype(GLOB.SSlanguage, T("/datum/controller/subsystem/language"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSlanguage);
		}
		GLOB.SSlanguage = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// language.dm:7
rt.def("/datum/controller/subsystem/language/proc/Initialize", function* Initialize(f: Frame, timeofday: Value) {
	let L: Value = null, language: Value = null, instance: Value = null;
	for (L of each(typesof(T("/datum/language")) - T("/datum/language"))) {
		if (!rt.initial(f, (language = L), "key")) {
			continue;
		}
		GLOB.all_languages += language;
		instance = (yield* new_(language));
		rt.setAt(GLOB.language_datum_instances, language, instance);
	}
	return (yield* parent_proc());
}, true);
