// From code/modules/mining/machine_input_output_plates.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10927, "/obj/machinery/mineral/input", "/obj/machinery/mineral", {
	anchored: 1,
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x2",
	name: "Input area",
	density: 0,
});

// /obj/machinery/mineral/input/proc/New  (code/modules/mining/machine_input_output_plates.dm:11)
rt.def("/obj/machinery/mineral/input/proc/New", function New(f: Frame) {
	rt.setSv(f, "icon_state", "blank");
	return f.dot;
});

rt.type(10928, "/obj/machinery/mineral/output", "/obj/machinery/mineral", {
	anchored: 1,
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x",
	name: "Output area",
	density: 0,
});

// /obj/machinery/mineral/output/proc/New  (code/modules/mining/machine_input_output_plates.dm:21)
rt.def("/obj/machinery/mineral/output/proc/New", function New(f: Frame) {
	rt.setSv(f, "icon_state", "blank");
	return f.dot;
});

rt.type(10926, "/obj/machinery/mineral", "/obj/machinery", {
	input_dir: 1,
	output_dir: 2,
});

// /obj/machinery/mineral/proc/unload_mineral  (code/modules/mining/machine_input_output_plates.dm:28)  may sleep
rt.def("/obj/machinery/mineral/proc/unload_mineral", function* unload_mineral(f: Frame, S: Value) {
	let _T: Value = null;
	f.vars = () => [S, _T];
	yield* g.callName(f, live(S), "forceMove", [rt.sv(f, "loc")]);
	if (!truthy((_T = rt.getStep(f, live(f.src), rt.sv(f, "output_dir"))))) return f.dot;
	yield* g.callName(f, live(S), "forceMove", [live(_T)]);
	return f.dot;
}, true);
