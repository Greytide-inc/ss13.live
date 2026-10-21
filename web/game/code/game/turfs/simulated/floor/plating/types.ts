// Types declared in code/game/turfs/simulated/floor/plating that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";

rt.type(4510, "/turf/open/floor/plating/asteroid/basalt/lava", "/turf/open/floor/plating/asteroid/basalt", {
	baseturf: rt.typePath("/turf/open/floor/plating/lava/smooth"),
});
rt.type(4511, "/turf/open/floor/plating/asteroid/basalt/airless", "/turf/open/floor/plating/asteroid/basalt", {
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4512, "/turf/open/floor/plating/asteroid/basalt/lava_land_surface", "/turf/open/floor/plating/asteroid/basalt", {
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
	planetary_atmos: 1,
	baseturf: rt.typePath("/turf/open/floor/plating/lava/smooth/lava_land_surface"),
});
rt.type(4513, "/turf/open/floor/plating/asteroid/airless", "/turf/open/floor/plating/asteroid", {
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/airless"),
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4515, "/turf/open/floor/plating/asteroid/airless/cave/has_data", "/turf/open/floor/plating/asteroid/airless/cave", {
	has_data: 1,
});
rt.type(4517, "/turf/open/floor/plating/asteroid/airless/cave/volcanic/has_data", "/turf/open/floor/plating/asteroid/airless/cave/volcanic", {
	has_data: 1,
});
rt.type(4518, "/turf/open/floor/plating/asteroid/snow", "/turf/open/floor/plating/asteroid", {
	environment_type: "snow",
	name: "snow",
	desc: "Looks cold.",
	icon: rt.rsc("icons/turf/snow.dmi"),
	baseturf: rt.typePath("/turf/open/floor/plating/asteroid/snow"),
	icon_state: "snow",
	icon_plating: "snow",
	initial_gas_mix: "TEMP=180",
	slowdown: 2,
	sand_type: rt.typePath("/obj/item/stack/sheet/mineral/snow"),
	flags: 0,
});
rt.type(4519, "/turf/open/floor/plating/asteroid/snow/airless", "/turf/open/floor/plating/asteroid/snow", {
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4520, "/turf/open/floor/plating/asteroid/snow/temperatre", "/turf/open/floor/plating/asteroid/snow", {
	initial_gas_mix: "TEMP=255.37",
});
rt.type(4521, "/turf/open/floor/plating/asteroid/snow/atmosphere", "/turf/open/floor/plating/asteroid/snow", {
	initial_gas_mix: "o2=22;n2=82;TEMP=180",
});
rt.type(4527, "/turf/open/floor/plating/lava/airless", "/turf/open/floor/plating/lava", {
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4529, "/turf/open/floor/plating/lava/smooth/lava_land_surface", "/turf/open/floor/plating/lava/smooth", {
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
	planetary_atmos: 1,
	baseturf: rt.typePath("/turf/open/chasm/straight_down/lava_land_surface"),
});
rt.type(4530, "/turf/open/floor/plating/lava/smooth/airless", "/turf/open/floor/plating/lava/smooth", {
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4539, "/turf/open/floor/plating/beach/sand", "/turf/open/floor/plating/beach", {
	name: "sand",
	desc: "Surf's up.",
	icon_state: "sand",
	baseturf: rt.typePath("/turf/open/floor/plating/beach/sand"),
});
rt.type(4540, "/turf/open/floor/plating/beach/coastline_t", "/turf/open/floor/plating/beach", {
	name: "coastline",
	desc: "Tide's high tonight. Charge your batons.",
	icon_state: "sandwater_t",
	baseturf: rt.typePath("/turf/open/floor/plating/beach/coastline_t"),
});
rt.type(4541, "/turf/open/floor/plating/beach/coastline_b", "/turf/open/floor/plating/beach", {
	name: "coastline",
	icon_state: "sandwater_b",
	baseturf: rt.typePath("/turf/open/floor/plating/beach/coastline_b"),
});
rt.type(4542, "/turf/open/floor/plating/beach/water", "/turf/open/floor/plating/beach", {
	name: "water",
	desc: "You get the feeling that nobody's bothered to actually make this water functional...",
	icon_state: "water",
	baseturf: rt.typePath("/turf/open/floor/plating/beach/water"),
});
