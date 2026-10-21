// Types declared in code/modules/mining that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(6762, "/obj/item/weapon/circuitboard/machine/mining_equipment_vendor/golem", "/obj/item/weapon/circuitboard/machine/mining_equipment_vendor", {
	name: "Golem Ship Equipment Vendor (Machine Board)",
	build_path: rt.typePath("/obj/machinery/mineral/equipment_vendor/golem"),
});
rt.type(7043, "/obj/item/weapon/ore/glass/basalt", "/obj/item/weapon/ore/glass", {
	name: "volcanic ash",
	icon_state: "volcanic_sand",
});
rt.type(7050, "/obj/item/weapon/ore/slag", "/obj/item/weapon/ore", {
	name: "slag",
	desc: "Completely useless",
	icon_state: "slag",
});
rt.type(7524, "/obj/item/weapon/coin/adamantine", "/obj/item/weapon/coin", {
	cmineral: "adamantine",
	value: 1500,
	name: "adamantine coin",
	icon_state: "coin_adamantine_heads",
});
rt.type(7525, "/obj/item/weapon/coin/mythril", "/obj/item/weapon/coin", {
	cmineral: "mythril",
	value: 3000,
	name: "mythril coin",
	icon_state: "coin_mythril_heads",
});
rt.type(7527, "/obj/item/weapon/coin/antagtoken", "/obj/item/weapon/coin", {
	cmineral: "valid",
	sideslist: null,
	value: 0,
	name: "antag token",
	icon_state: "coin_valid_valid",
	desc: "A novelty coin that helps the heart know what hard evidence cannot prove.",
});
rt.type(9396, "/obj/item/device/assault_pod/mining/unrestricted", "/obj/item/device/assault_pod/mining", {
	no_restrictions: 1,
	name: "omni-locational landing field designator",
	desc: "Allows the deployment of the mining base ANYWHERE. Use with caution.",
});
rt.type(12082, "/obj/effect/light_emitter/tendril", "/obj/effect/light_emitter", {
	set_luminosity: 4,
	set_cap: 2.5,
	light_color: "#C48A18",
});
