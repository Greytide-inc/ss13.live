// Based on /tg/station's code/modules/mining/machine_input_output_plates.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(10927, "/obj/machinery/mineral/input", "/obj/machinery/mineral", {
	anchored: 1,
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x2",
	name: "Input area",
	density: 0,
});

// machine_input_output_plates.dm:11
rt.def("/obj/machinery/mineral/input/proc/New", function New(f: Frame) {
	this.icon_state = "blank";
	return f.dot;
});

rt.type(10928, "/obj/machinery/mineral/output", "/obj/machinery/mineral", {
	anchored: 1,
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x",
	name: "Output area",
	density: 0,
});

// machine_input_output_plates.dm:21
rt.def("/obj/machinery/mineral/output/proc/New", function New(f: Frame) {
	this.icon_state = "blank";
	return f.dot;
});

rt.type(10926, "/obj/machinery/mineral", "/obj/machinery", {
	input_dir: 1,
	output_dir: 2,
});

// machine_input_output_plates.dm:28
rt.def("/obj/machinery/mineral/proc/unload_mineral", function* unload_mineral(f: Frame, S: Value) {
	let _T: Value = null;
	yield* S.forceMove(this.loc);
	if (!(_T = rt.getStep(f, this, this.output_dir))) return f.dot;
	yield* S.forceMove(_T);
	return f.dot;
}, true);
