// Types declared in code/modules/reagents/chemistry/machinery that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(6778, "/obj/item/weapon/circuitboard/machine/chem_master/condi", "/obj/item/weapon/circuitboard/machine/chem_master", {
	name: "CondiMaster 3000 (Machine Board)",
	build_path: rt.typePath("/obj/machinery/chem_master/condimaster"),
});
rt.type(10681, "/obj/machinery/chem_dispenser/drinks", "/obj/machinery/chem_dispenser", {
	anchored: 1,
	amount: 10,
	dispensable_reagents: null,
	emagged_reagents: null,
	name: "soda dispenser",
	desc: "Contains a large reservoir of soft drinks.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "soda_dispenser",
});
rt.type(10682, "/obj/machinery/chem_dispenser/drinks/beer", "/obj/machinery/chem_dispenser/drinks", {
	anchored: 1,
	dispensable_reagents: null,
	emagged_reagents: null,
	name: "booze dispenser",
	desc: "Contains a large reservoir of the good stuff.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "booze_dispenser",
});
rt.type(10684, "/obj/machinery/chem_dispenser/mutagensaltpeter", "/obj/machinery/chem_dispenser", {
	dispensable_reagents: null,
	name: "botanical chemical dispenser",
	desc: "Creates and dispenses chemicals useful for botany.",
});
rt.type(10980, "/obj/machinery/chem_master/condimaster", "/obj/machinery/chem_master", {
	condi: 1,
	name: "CondiMaster 3000",
	desc: "Used to create condiments and other cooking supplies.",
});
