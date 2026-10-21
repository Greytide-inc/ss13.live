// Types declared in code/modules/power/supermatter that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(10330, "/obj/machinery/power/supermatter_shard/hugbox", "/obj/machinery/power/supermatter_shard", {
	takes_damage: 0,
	produces_gas: 0,
});
rt.type(10331, "/obj/machinery/power/supermatter_shard/crystal", "/obj/machinery/power/supermatter_shard", {
	base_icon_state: "darkmatter",
	anchored: 1,
	gasefficency: 0.15,
	explosion_power: 35,
	name: "supermatter crystal",
	desc: "A strangely translucent and iridescent crystal.",
	icon_state: "darkmatter",
});
