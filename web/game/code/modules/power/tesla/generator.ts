// From code/modules/power/tesla/generator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10977, "/obj/machinery/the_singularitygen/tesla", "/obj/machinery/the_singularitygen", {
	name: "energy ball generator",
	desc: "Makes the wardenclyffe look like a child's plaything when shot with a particle accelerator.",
	icon: rt.rsc("icons/obj/tesla_engine/tesla_generator.dmi"),
	icon_state: "TheSingGen",
	creation_type: rt.typePath("/obj/singularity/energy_ball"),
});

// /obj/machinery/the_singularitygen/tesla/proc/tesla_act  (code/modules/power/tesla/generator.dm:10)
rt.def("/obj/machinery/the_singularitygen/tesla/proc/tesla_act", function tesla_act(f: Frame, power: Value, explosive: Value) {
	f.vars = () => [explosive];
	if (live(explosive) === null) {
		explosive = 0;
	}
	if (!truthy(live(explosive))) return f.dot;
	rt.modSrcVar(f, "energy", live(power), add);
	return f.dot;
});
