// Types declared in code/game/turfs/simulated that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(4444, "/turf/closed/wall/vault", "/turf/closed/wall", {
	icon: rt.rsc("icons/turf/walls.dmi"),
	icon_state: "rockvault",
});
rt.type(4446, "/turf/closed/wall/rust", "/turf/closed/wall", {
	hardness: 45,
	name: "rusted wall",
	desc: "A rusted metal wall.",
	icon: rt.rsc("icons/turf/walls/rusty_wall.dmi"),
});
rt.type(4467, "/turf/closed/mineral/canSmoothWith", "/turf/closed/mineral", {});
rt.type(4475, "/turf/closed/mineral/iron", "/turf/closed/mineral", {
	spreadChance: 20,
	spread: 1,
	scan_state: "rock_Iron",
	mineralType: rt.typePath("/obj/item/weapon/ore/iron"),
});
rt.type(4476, "/turf/closed/mineral/iron/volcanic", "/turf/closed/mineral/iron", {
	environment_type: "basalt",
	defer_change: 1,
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	baseturf: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
});
rt.type(4477, "/turf/closed/mineral/uranium", "/turf/closed/mineral", {
	spreadChance: 5,
	spread: 1,
	scan_state: "rock_Uranium",
	mineralType: rt.typePath("/obj/item/weapon/ore/uranium"),
});
rt.type(4478, "/turf/closed/mineral/uranium/volcanic", "/turf/closed/mineral/uranium", {
	environment_type: "basalt",
	defer_change: 1,
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	baseturf: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
});
rt.type(4479, "/turf/closed/mineral/diamond", "/turf/closed/mineral", {
	spreadChance: 0,
	spread: 1,
	scan_state: "rock_Diamond",
	mineralType: rt.typePath("/obj/item/weapon/ore/diamond"),
});
rt.type(4480, "/turf/closed/mineral/diamond/volcanic", "/turf/closed/mineral/diamond", {
	environment_type: "basalt",
	defer_change: 1,
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	baseturf: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
});
rt.type(4481, "/turf/closed/mineral/gold", "/turf/closed/mineral", {
	spreadChance: 5,
	spread: 1,
	scan_state: "rock_Gold",
	mineralType: rt.typePath("/obj/item/weapon/ore/gold"),
});
rt.type(4482, "/turf/closed/mineral/gold/volcanic", "/turf/closed/mineral/gold", {
	environment_type: "basalt",
	defer_change: 1,
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	baseturf: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
});
rt.type(4483, "/turf/closed/mineral/silver", "/turf/closed/mineral", {
	spreadChance: 5,
	spread: 1,
	scan_state: "rock_Silver",
	mineralType: rt.typePath("/obj/item/weapon/ore/silver"),
});
rt.type(4484, "/turf/closed/mineral/silver/volcanic", "/turf/closed/mineral/silver", {
	environment_type: "basalt",
	defer_change: 1,
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	baseturf: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
});
rt.type(4485, "/turf/closed/mineral/titanium", "/turf/closed/mineral", {
	spreadChance: 5,
	spread: 1,
	scan_state: "rock_Titanium",
	mineralType: rt.typePath("/obj/item/weapon/ore/titanium"),
});
rt.type(4486, "/turf/closed/mineral/titanium/volcanic", "/turf/closed/mineral/titanium", {
	environment_type: "basalt",
	defer_change: 1,
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	baseturf: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
});
rt.type(4487, "/turf/closed/mineral/plasma", "/turf/closed/mineral", {
	spreadChance: 8,
	spread: 1,
	scan_state: "rock_Plasma",
	mineralType: rt.typePath("/obj/item/weapon/ore/plasma"),
});
rt.type(4488, "/turf/closed/mineral/plasma/volcanic", "/turf/closed/mineral/plasma", {
	environment_type: "basalt",
	defer_change: 1,
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	baseturf: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
});
rt.type(4489, "/turf/closed/mineral/clown", "/turf/closed/mineral", {
	mineralAmt: 3,
	spreadChance: 0,
	spread: 0,
	scan_state: "rock_Clown",
	mineralType: rt.typePath("/obj/item/weapon/ore/bananium"),
});
rt.type(4490, "/turf/closed/mineral/bscrystal", "/turf/closed/mineral", {
	mineralAmt: 1,
	spreadChance: 0,
	spread: 0,
	scan_state: "rock_BScrystal",
	mineralType: rt.typePath("/obj/item/weapon/ore/bluespace_crystal"),
});
rt.type(4491, "/turf/closed/mineral/bscrystal/volcanic", "/turf/closed/mineral/bscrystal", {
	environment_type: "basalt",
	defer_change: 1,
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	baseturf: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
});
rt.type(4492, "/turf/closed/mineral/volcanic", "/turf/closed/mineral", {
	environment_type: "basalt",
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt"),
	baseturf: rt.typePath("/turf/open/floor/plating/asteroid/basalt"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
});
rt.type(4493, "/turf/closed/mineral/volcanic/lava_land_surface", "/turf/closed/mineral/volcanic", {
	environment_type: "basalt",
	defer_change: 1,
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	baseturf: rt.typePath("/turf/open/floor/plating/lava/smooth/lava_land_surface"),
});
rt.type(4496, "/turf/closed/mineral/gibtonite/volcanic", "/turf/closed/mineral/gibtonite", {
	environment_type: "basalt",
	defer_change: 1,
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	baseturf: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
});
rt.type(4588, "/turf/open/floor/goonplaque", "/turf/open/floor", {
	name: "commemorative plaque",
	icon_state: "plaque",
	desc: "\"This is a plaque in honour of our comrades on the G4407 Stations. Hopefully TG4407 model can live up to your fame and fortune.\" Scratched in beneath that is a crude image of a meteor and a spaceman. The spaceman is laughing. The meteor is exploding.",
	floor_tile: rt.typePath("/obj/item/stack/tile/plasteel"),
});
rt.type(4589, "/turf/open/floor/vault", "/turf/open/floor", {
	icon_state: "rockvault",
	floor_tile: rt.typePath("/obj/item/stack/tile/plasteel"),
});
rt.type(4604, "/turf/open/floor/pod", "/turf/open/floor", {
	icon_regular_floor: "podfloor",
	name: "pod floor",
	icon_state: "podfloor",
	floor_tile: rt.typePath("/obj/item/stack/tile/pod"),
});
rt.type(4605, "/turf/open/floor/pod/light", "/turf/open/floor/pod", {
	icon_regular_floor: "podfloor_light",
	icon_state: "podfloor_light",
	floor_tile: rt.typePath("/obj/item/stack/tile/pod/light"),
});
rt.type(4606, "/turf/open/floor/pod/dark", "/turf/open/floor/pod", {
	icon_regular_floor: "podfloor_dark",
	icon_state: "podfloor_dark",
	floor_tile: rt.typePath("/obj/item/stack/tile/pod/dark"),
});
rt.type(4607, "/turf/open/floor/noslip", "/turf/open/floor", {
	broken_states: null,
	burnt_states: null,
	name: "high-traction floor",
	icon_state: "noslip",
	floor_tile: rt.typePath("/obj/item/stack/tile/noslip"),
	slowdown: -0.3,
});
rt.type(4608, "/turf/open/floor/oldshuttle", "/turf/open/floor", {
	icon: rt.rsc("icons/turf/shuttleold.dmi"),
	icon_state: "floor",
	floor_tile: rt.typePath("/obj/item/stack/tile/plasteel"),
});
rt.type(4609, "/turf/open/floor/bluespace", "/turf/open/floor", {
	slowdown: -1,
	icon_state: "bluespace",
	desc: "Through a series of micro-teleports these tiles let people move at incredible speeds",
	floor_tile: rt.typePath("/obj/item/stack/tile/bluespace"),
});
rt.type(4610, "/turf/open/floor/sepia", "/turf/open/floor", {
	slowdown: 2,
	icon_state: "sepia",
	desc: "Time seems to flow very slowly around these tiles",
	floor_tile: rt.typePath("/obj/item/stack/tile/sepia"),
});
rt.type(4796, "/turf/open/chasm/straight_down/lava_land_surface/normal_air", "/turf/open/chasm/straight_down/lava_land_surface", {
	initial_gas_mix: "o2=22;n2=82;TEMP=293.15",
});
rt.type(4797, "/turf/open/chasm/straight_down/jungle", "/turf/open/chasm/straight_down", {
	icon: rt.rsc("icons/turf/floors/junglechasm.dmi"),
	planetary_atmos: 1,
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
});
