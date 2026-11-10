// Based on /tg/station's code/modules/vehicles/secway.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(13067, "/obj/vehicle/secway", "/obj/vehicle", {
	name: "secway",
	desc: "A brave security cyborg gave its life to help you look like a complete tool.",
	icon_state: "secway",
});

// secway.dm:12
rt.def("/obj/vehicle/secway/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* parent_proc());
	this.riding_datum = (yield* new_(T("/datum/riding/secway")));
	return f.dot;
}, true, { args: ["buckled_mob", "force", "check_loc"] });
