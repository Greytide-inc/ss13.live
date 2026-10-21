// From code/controllers/subsystem/religion.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(37, "/datum/controller/subsystem/religion", "/datum/controller/subsystem", {
	religion: null,
	deity: null,
	bible_name: null,
	bible_icon_state: null,
	bible_item_state: null,
	holy_weapon_type: null,
	name: "Religion",
	flags: 3,
});

// /datum/controller/subsystem/religion/proc/New  (code/controllers/subsystem/religion.dm:1)  may sleep
rt.def("/datum/controller/subsystem/religion/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSreligion"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSreligion"), T("/datum/controller/subsystem/religion")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSreligion")]);
		}
		rt.setGl("SSreligion", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);
