// Types declared in code/modules/food_and_drinks/kitchen_machinery that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(2317, "/datum/food_processor_process/meat", "/datum/food_processor_process", {
	input: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"),
	output: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/faggot"),
});
rt.type(2318, "/datum/food_processor_process/bacon", "/datum/food_processor_process", {
	input: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet"),
	output: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/rawbacon"),
});
rt.type(2319, "/datum/food_processor_process/potatowedges", "/datum/food_processor_process", {
	input: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/potato/wedges"),
	output: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/fries"),
});
rt.type(2320, "/datum/food_processor_process/sweetpotato", "/datum/food_processor_process", {
	input: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/potato/sweet"),
	output: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/yakiimo"),
});
rt.type(2321, "/datum/food_processor_process/potato", "/datum/food_processor_process", {
	input: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/potato"),
	output: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/tatortot"),
});
rt.type(2322, "/datum/food_processor_process/carrot", "/datum/food_processor_process", {
	input: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"),
	output: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/carrotfries"),
});
rt.type(2323, "/datum/food_processor_process/soybeans", "/datum/food_processor_process", {
	input: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/soybeans"),
	output: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/soydope"),
});
rt.type(2324, "/datum/food_processor_process/spaghetti", "/datum/food_processor_process", {
	input: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/doughslice"),
	output: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/spaghetti"),
});
rt.type(2325, "/datum/food_processor_process/corn", "/datum/food_processor_process", {
	input: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/corn"),
	output: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/tortilla"),
});
rt.type(2326, "/datum/food_processor_process/parsnip", "/datum/food_processor_process", {
	input: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/parsnip"),
	output: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/roastparsnip"),
});
rt.type(6753, "/obj/item/weapon/circuitboard/machine/processor/slime", "/obj/item/weapon/circuitboard/machine/processor", {
	name: "Slime Processor (Machine Board)",
	build_path: rt.typePath("/obj/machinery/processor/slime"),
});
rt.type(10909, "/obj/machinery/smartfridge/chemistry/virology", "/obj/machinery/smartfridge/chemistry", {
	name: "smart virus storage",
	desc: "A refrigerated storage unit for volatile sample storage.",
});
