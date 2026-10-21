// From code/modules/hydroponics/sample.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9985, "/obj/item/seeds/sample", "/obj/item/seeds", {
	sample_color: "#FFFFFF",
	name: "plant sample",
	icon_state: "sample-empty",
	potency: -1,
	yield: -1,
});

// /obj/item/seeds/sample/proc/New  (code/modules/hydroponics/sample.dm:9)  may sleep
rt.def("/obj/item/seeds/sample/proc/New", function* New(f: Frame) {
	let filling: Value = null;
	f.vars = () => [filling];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "sample_color"))) return f.dot;
	rt.setFv(f, "color", (filling = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "sample-filling"]))), rt.sv(f, "sample_color"));
	yield* g.srcCall(f, "add_overlay", live(filling));
	return f.dot;
}, true);

// /obj/item/seeds/sample/proc/get_analyzer_text  (code/modules/hydroponics/sample.dm:16)
rt.def("/obj/item/seeds/sample/proc/get_analyzer_text", function get_analyzer_text(f: Frame) {
	return " The DNA of this sample is damaged beyond recovery, it can't support life on its own.\n*---------*";
});
