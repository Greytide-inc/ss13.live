// Types declared in code/modules/modular_computers/computers/item that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(9411, "/obj/item/device/modular_computer/laptop/buildable", "/obj/item/device/modular_computer/laptop", {
	start_open: 0,
});
rt.type(9415, "/obj/item/device/modular_computer/tablet", "/obj/item/device/modular_computer", {
	icon_state_unpowered: "tablet",
	icon_state_powered: "tablet",
	icon_state_menu: "menu",
	hardware_flag: 4,
	max_hardware_size: 1,
	steel_sheet_cost: 1,
	has_light: 1,
	comp_light_luminosity: 2.3,
	name: "tablet computer",
	icon: rt.rsc("icons/obj/modular_tablet.dmi"),
	icon_state: "tablet",
	w_class: 2,
	slot_flags: 768,
});
rt.type(9416, "/obj/item/device/modular_computer/tablet/preset", "/obj/item/device/modular_computer/tablet", {});
