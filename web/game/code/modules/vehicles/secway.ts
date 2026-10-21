// From code/modules/vehicles/secway.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13067, "/obj/vehicle/secway", "/obj/vehicle", {
	name: "secway",
	desc: "A brave security cyborg gave its life to help you look like a complete tool.",
	icon_state: "secway",
});

// /obj/vehicle/secway/proc/buckle_mob  (code/modules/vehicles/secway.dm:12)  may sleep
rt.def("/obj/vehicle/secway/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "riding_datum", (yield* g.new_(f, T("/datum/riding/secway"), [])));
	return f.dot;
}, true, { args: ["buckled_mob", "force", "check_loc"] });
