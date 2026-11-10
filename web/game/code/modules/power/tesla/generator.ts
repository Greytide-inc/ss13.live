// Based on /tg/station's code/modules/power/tesla/generator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(10977, "/obj/machinery/the_singularitygen/tesla", "/obj/machinery/the_singularitygen", {
	name: "energy ball generator",
	desc: "Makes the wardenclyffe look like a child's plaything when shot with a particle accelerator.",
	icon: rt.rsc("icons/obj/tesla_engine/tesla_generator.dmi"),
	icon_state: "TheSingGen",
	creation_type: rt.typePath("/obj/singularity/energy_ball"),
});

// generator.dm:10
rt.def("/obj/machinery/the_singularitygen/tesla/proc/tesla_act", function tesla_act(f: Frame, power: Value, explosive: Value) {
	explosive ??= 0;
	if (!explosive) return f.dot;
	this.energy += power;
	return f.dot;
});
