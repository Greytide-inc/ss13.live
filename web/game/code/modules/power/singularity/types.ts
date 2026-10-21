// Types declared in code/modules/power/singularity that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(10308, "/obj/machinery/power/emitter/energycannon", "/obj/machinery/power/emitter", {
	anchored: 1,
	name: "Energy Cannon",
	desc: "A heavy duty industrial laser",
	icon: rt.rsc("icons/obj/singularity.dmi"),
	icon_state: "emitter",
	density: 1,
	resistance_flags: 98,
	use_power: 0,
	idle_power_usage: 0,
	active_power_usage: 0,
	active: 1,
	locked: 1,
	state: 2,
});
