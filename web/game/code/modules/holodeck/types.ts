// Types declared in code/modules/holodeck that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(4769, "/turf/open/floor/holofloor/plating", "/turf/open/floor/holofloor", {
	name: "holodeck projector floor",
	icon_state: "engine",
});
rt.type(4770, "/turf/open/floor/holofloor/plating/burnmix", "/turf/open/floor/holofloor/plating", {
	name: "burn-mix floor",
	initial_gas_mix: "o2=2500;plasma=5000;TEMP=370",
});
rt.type(4771, "/turf/open/floor/holofloor/grass", "/turf/open/floor/holofloor", {
	gender: "plural",
	name: "lush grass",
	icon_state: "grass",
});
rt.type(4772, "/turf/open/floor/holofloor/beach", "/turf/open/floor/holofloor", {
	name: "sand",
	icon: rt.rsc("icons/misc/beach.dmi"),
	icon_state: "sand",
});
rt.type(4773, "/turf/open/floor/holofloor/beach/coast_t", "/turf/open/floor/holofloor/beach", {
	name: "coastline",
	icon_state: "sandwater_t",
});
rt.type(4774, "/turf/open/floor/holofloor/beach/coast_b", "/turf/open/floor/holofloor/beach", {
	name: "coastline",
	icon_state: "sandwater_b",
});
rt.type(4775, "/turf/open/floor/holofloor/beach/water", "/turf/open/floor/holofloor/beach", {
	name: "water",
	icon_state: "water",
});
rt.type(4782, "/turf/open/floor/holofloor/snow", "/turf/open/floor/holofloor", {
	name: "snow",
	desc: "Looks cold.",
	icon: rt.rsc("icons/turf/snow.dmi"),
	icon_state: "snow",
	slowdown: 2,
});
rt.type(4783, "/turf/open/floor/holofloor/snow/cold", "/turf/open/floor/holofloor/snow", {
	initial_gas_mix: "freon=7500;TEMP=0",
});
rt.type(12075, "/obj/effect/holodeck_effect/mobspawner/bee", "/obj/effect/holodeck_effect/mobspawner", {
	mobtype: rt.typePath("/mob/living/simple_animal/hostile/poison/bees/toxin"),
});
rt.type(12076, "/obj/effect/holodeck_effect/mobspawner/monkey", "/obj/effect/holodeck_effect/mobspawner", {
	mobtype: rt.typePath("/mob/living/simple_animal/holodeck_monkey"),
});
rt.type(12077, "/obj/effect/holodeck_effect/mobspawner/penguin", "/obj/effect/holodeck_effect/mobspawner", {
	mobtype: rt.typePath("/mob/living/simple_animal/pet/penguin/emperor"),
});
rt.type(12078, "/obj/effect/holodeck_effect/mobspawner/penguin_baby", "/obj/effect/holodeck_effect/mobspawner", {
	mobtype: rt.typePath("/mob/living/simple_animal/pet/penguin/baby"),
});
