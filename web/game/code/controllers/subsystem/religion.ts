// Based on /tg/station's code/controllers/subsystem/religion.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// religion.dm:1
rt.def("/datum/controller/subsystem/religion/proc/New", function* New(f: Frame) {
	if (GLOB.SSreligion != this) {
		if (rt.istype(GLOB.SSreligion, T("/datum/controller/subsystem/religion"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSreligion);
		}
		GLOB.SSreligion = this;
	}
	this.PreInit();
	return f.dot;
}, true);
