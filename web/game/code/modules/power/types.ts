// Types declared in code/modules/power that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(5708, "/obj/item/weapon/stock_parts/cell/computer", "/obj/item/weapon/stock_parts/cell", {
	name: "standard battery",
	desc: "A standard power cell, commonly seen in high-end portable microcomputers or low-end laptops.",
	icon: rt.rsc("icons/obj/module.dmi"),
	icon_state: "cell_mini",
	origin_tech: "powerstorage=2;engineering=1",
	w_class: 1,
	maxcharge: 750,
});
rt.type(5709, "/obj/item/weapon/stock_parts/cell/computer/advanced", "/obj/item/weapon/stock_parts/cell/computer", {
	name: "advanced battery",
	desc: "An advanced power cell, often used in most laptops. It is too large to be fitted into smaller devices.",
	icon_state: "cell",
	origin_tech: "powerstorage=2;engineering=2",
	w_class: 2,
	maxcharge: 1500,
});
rt.type(5710, "/obj/item/weapon/stock_parts/cell/computer/super", "/obj/item/weapon/stock_parts/cell/computer", {
	name: "super battery",
	desc: "An advanced power cell, often used in high-end laptops.",
	icon_state: "cell",
	origin_tech: "powerstorage=3;engineering=3",
	w_class: 2,
	maxcharge: 2000,
});
rt.type(5711, "/obj/item/weapon/stock_parts/cell/computer/micro", "/obj/item/weapon/stock_parts/cell/computer", {
	name: "micro battery",
	desc: "A small power cell, commonly seen in most portable microcomputers.",
	icon_state: "cell_micro",
	maxcharge: 500,
});
rt.type(5712, "/obj/item/weapon/stock_parts/cell/computer/nano", "/obj/item/weapon/stock_parts/cell/computer", {
	name: "nano battery",
	desc: "A tiny power cell, commonly seen in low-end portable microcomputers.",
	icon_state: "cell_micro",
	maxcharge: 300,
});
rt.type(5717, "/obj/item/weapon/stock_parts/cell/pulse", "/obj/item/weapon/stock_parts/cell", {
	maxcharge: 40000,
	chargerate: 1500,
	name: "pulse rifle power cell",
	rating: 3,
});
rt.type(5718, "/obj/item/weapon/stock_parts/cell/pulse/carbine", "/obj/item/weapon/stock_parts/cell/pulse", {
	maxcharge: 5000,
	name: "pulse carbine power cell",
});
rt.type(5719, "/obj/item/weapon/stock_parts/cell/pulse/pistol", "/obj/item/weapon/stock_parts/cell/pulse", {
	maxcharge: 2000,
	name: "pulse pistol power cell",
});
rt.type(5721, "/obj/item/weapon/stock_parts/cell/high/plus", "/obj/item/weapon/stock_parts/cell/high", {
	maxcharge: 15000,
	chargerate: 2250,
	name: "high-capacity power cell+",
	desc: "Where did these come from?",
	icon_state: "h+cell",
});
rt.type(5731, "/obj/item/weapon/stock_parts/cell/infinite/abductor", "/obj/item/weapon/stock_parts/cell/infinite", {
	maxcharge: 50000,
	ratingdesc: 0,
	name: "void core",
	desc: "An alien power cell that produces energy seemingly out of nowhere.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "cell",
	origin_tech: "abductor=5;powerstorage=8;engineering=6",
	rating: 12,
});
rt.type(5733, "/obj/item/weapon/stock_parts/cell/emproof", "/obj/item/weapon/stock_parts/cell", {
	maxcharge: 500,
	name: "１EMP-proof cell",
	desc: "An EMP-proof cell.",
	rating: 2,
});
rt.type(6765, "/obj/item/weapon/circuitboard/machine/pacman/super", "/obj/item/weapon/circuitboard/machine/pacman", {
	name: "SUPERPACMAN-type Generator (Machine Board)",
	build_path: rt.typePath("/obj/machinery/power/port_gen/pacman/super"),
	origin_tech: "programming=3;powerstorage=4;engineering=4",
});
rt.type(6766, "/obj/item/weapon/circuitboard/machine/pacman/mrs", "/obj/item/weapon/circuitboard/machine/pacman", {
	name: "MRSPACMAN-type Generator (Machine Board)",
	build_path: "/obj/machinery/power/port_gen/pacman/mrs",
	origin_tech: "programming=3;powerstorage=4;engineering=4;plasmatech=4",
});
rt.type(7639, "/obj/item/weapon/light/tube", "/obj/item/weapon/light", {
	base_state: "ltube",
	brightness: 8,
	name: "light tube",
	desc: "A replacement light tube.",
	icon_state: "ltube",
	item_state: "c_tube",
});
rt.type(7640, "/obj/item/weapon/light/bulb", "/obj/item/weapon/light", {
	base_state: "lbulb",
	brightness: 4,
	name: "light bulb",
	desc: "A replacement light bulb.",
	icon_state: "lbulb",
	item_state: "contvapour",
});
rt.type(9080, "/obj/item/stack/cable_coil/red", "/obj/item/stack/cable_coil", {
	item_color: "red",
	icon_state: "coil_red",
});
rt.type(9081, "/obj/item/stack/cable_coil/yellow", "/obj/item/stack/cable_coil", {
	item_color: "yellow",
	icon_state: "coil_yellow",
});
rt.type(9082, "/obj/item/stack/cable_coil/blue", "/obj/item/stack/cable_coil", {
	item_color: "blue",
	icon_state: "coil_blue",
	item_state: "coil_blue",
});
rt.type(9083, "/obj/item/stack/cable_coil/green", "/obj/item/stack/cable_coil", {
	item_color: "green",
	icon_state: "coil_green",
});
rt.type(9084, "/obj/item/stack/cable_coil/pink", "/obj/item/stack/cable_coil", {
	item_color: "pink",
	icon_state: "coil_pink",
});
rt.type(9085, "/obj/item/stack/cable_coil/orange", "/obj/item/stack/cable_coil", {
	item_color: "orange",
	icon_state: "coil_orange",
});
rt.type(9086, "/obj/item/stack/cable_coil/cyan", "/obj/item/stack/cable_coil", {
	item_color: "cyan",
	icon_state: "coil_cyan",
});
rt.type(9087, "/obj/item/stack/cable_coil/white", "/obj/item/stack/cable_coil", {
	item_color: "white",
	icon_state: "coil_white",
});
rt.type(9089, "/obj/item/stack/cable_coil/random/five", "/obj/item/stack/cable_coil/random", {
	amount: 5,
});
rt.type(10303, "/obj/machinery/power/smes/engineering", "/obj/machinery/power/smes", {
	charge: 1500000,
});
rt.type(10318, "/obj/machinery/power/rtg/advanced", "/obj/machinery/power/rtg", {
	power_gen: 1250,
	board_path: rt.typePath("/obj/item/weapon/circuitboard/machine/rtg/advanced"),
	desc: "An advanced RTG capable of moderating isotope decay, increasing power output but reducing lifetime. It uses plasma-fueled radiation collectors to increase output even further.",
});
rt.type(10343, "/obj/machinery/light/small", "/obj/machinery/light", {
	base_state: "bulb",
	fitting: "bulb",
	brightness: 4,
	light_type: rt.typePath("/obj/item/weapon/light/bulb"),
	icon_state: "bulb1",
	desc: "A small lighting fixture.",
});
rt.type(10346, "/obj/machinery/light/floor", "/obj/machinery/light", {
	base_state: "floor",
	brightness: 4,
	light_type: rt.typePath("/obj/item/weapon/light/bulb"),
	fitting: "bulb",
	name: "floor light",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "floor1",
	layer: 2.5,
});
rt.type(10638, "/obj/machinery/gravity_generator/main/station/admin", "/obj/machinery/gravity_generator/main/station", {
	use_power: 0,
});
rt.type(12533, "/obj/structure/cable/yellow", "/obj/structure/cable", {
	cable_color: "yellow",
	icon: rt.rsc("icons/obj/power_cond/power_cond_yellow.dmi"),
});
rt.type(12534, "/obj/structure/cable/green", "/obj/structure/cable", {
	cable_color: "green",
	icon: rt.rsc("icons/obj/power_cond/power_cond_green.dmi"),
});
rt.type(12535, "/obj/structure/cable/blue", "/obj/structure/cable", {
	cable_color: "blue",
	icon: rt.rsc("icons/obj/power_cond/power_cond_blue.dmi"),
});
rt.type(12536, "/obj/structure/cable/pink", "/obj/structure/cable", {
	cable_color: "pink",
	icon: rt.rsc("icons/obj/power_cond/power_cond_pink.dmi"),
});
rt.type(12537, "/obj/structure/cable/orange", "/obj/structure/cable", {
	cable_color: "orange",
	icon: rt.rsc("icons/obj/power_cond/power_cond_orange.dmi"),
});
rt.type(12538, "/obj/structure/cable/cyan", "/obj/structure/cable", {
	cable_color: "cyan",
	icon: rt.rsc("icons/obj/power_cond/power_cond_cyan.dmi"),
});
rt.type(12539, "/obj/structure/cable/white", "/obj/structure/cable", {
	cable_color: "white",
	icon: rt.rsc("icons/obj/power_cond/power_cond_white.dmi"),
});
rt.type(12977, "/obj/structure/light_construct/small", "/obj/structure/light_construct", {
	fixture_type: "bulb",
	sheets_refunded: 1,
	name: "small light fixture frame",
	icon_state: "bulb-construct-stage1",
});
