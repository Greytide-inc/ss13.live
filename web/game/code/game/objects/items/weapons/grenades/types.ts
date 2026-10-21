// Types declared in code/game/objects/items/weapons/grenades that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";

rt.type(6883, "/obj/item/weapon/grenade/chem_grenade/cryo", "/obj/item/weapon/grenade/chem_grenade", {
	affected_area: 2,
	ignition_temp: -100,
	name: "cryo grenade",
	desc: "A custom made cryogenic grenade. It rapidly cools its contents upon detonation.",
	icon_state: "cryog",
});
rt.type(6884, "/obj/item/weapon/grenade/chem_grenade/pyro", "/obj/item/weapon/grenade/chem_grenade", {
	affected_area: 3,
	ignition_temp: 500,
	name: "pyro grenade",
	desc: "A custom made pyrotechnical grenade. It heats up and ignites its contents upon detonation.",
	icon_state: "pyrog",
	origin_tech: "combat=4;engineering=4",
});
rt.type(6895, "/obj/item/weapon/grenade/chem_grenade/glitter/pink", "/obj/item/weapon/grenade/chem_grenade/glitter", {
	glitter_type: "pink_glitter",
	name: "pink glitter bomb",
	desc: "For that HOT glittery look.",
});
rt.type(6896, "/obj/item/weapon/grenade/chem_grenade/glitter/blue", "/obj/item/weapon/grenade/chem_grenade/glitter", {
	glitter_type: "blue_glitter",
	name: "blue glitter bomb",
	desc: "For that COOL glittery look.",
});
rt.type(6897, "/obj/item/weapon/grenade/chem_grenade/glitter/white", "/obj/item/weapon/grenade/chem_grenade/glitter", {
	glitter_type: "white_glitter",
	name: "white glitter bomb",
	desc: "For that somnolent glittery look.",
});
rt.type(6903, "/obj/item/weapon/grenade/clusterbuster/emp", "/obj/item/weapon/grenade/clusterbuster", {
	name: "Electromagnetic Storm",
	payload: rt.typePath("/obj/item/weapon/grenade/empgrenade"),
});
rt.type(6904, "/obj/item/weapon/grenade/clusterbuster/smoke", "/obj/item/weapon/grenade/clusterbuster", {
	name: "Ninja Vanish",
	payload: rt.typePath("/obj/item/weapon/grenade/smokebomb"),
});
rt.type(6905, "/obj/item/weapon/grenade/clusterbuster/metalfoam", "/obj/item/weapon/grenade/clusterbuster", {
	name: "Instant Concrete",
	payload: rt.typePath("/obj/item/weapon/grenade/chem_grenade/metalfoam"),
});
rt.type(6906, "/obj/item/weapon/grenade/clusterbuster/inferno", "/obj/item/weapon/grenade/clusterbuster", {
	name: "Inferno",
	payload: rt.typePath("/obj/item/weapon/grenade/chem_grenade/incendiary"),
});
rt.type(6907, "/obj/item/weapon/grenade/clusterbuster/antiweed", "/obj/item/weapon/grenade/clusterbuster", {
	name: "RoundDown",
	payload: rt.typePath("/obj/item/weapon/grenade/chem_grenade/antiweed"),
});
rt.type(6908, "/obj/item/weapon/grenade/clusterbuster/cleaner", "/obj/item/weapon/grenade/clusterbuster", {
	name: "Mr. Proper",
	payload: rt.typePath("/obj/item/weapon/grenade/chem_grenade/cleaner"),
});
rt.type(6909, "/obj/item/weapon/grenade/clusterbuster/teargas", "/obj/item/weapon/grenade/clusterbuster", {
	name: "Oignon Grenade",
	payload: rt.typePath("/obj/item/weapon/grenade/chem_grenade/teargas"),
});
rt.type(6910, "/obj/item/weapon/grenade/clusterbuster/facid", "/obj/item/weapon/grenade/clusterbuster", {
	name: "Aciding Rain",
	payload: rt.typePath("/obj/item/weapon/grenade/chem_grenade/facid"),
});
rt.type(6911, "/obj/item/weapon/grenade/clusterbuster/syndieminibomb", "/obj/item/weapon/grenade/clusterbuster", {
	name: "SyndiWrath",
	payload: rt.typePath("/obj/item/weapon/grenade/syndieminibomb"),
});
rt.type(6912, "/obj/item/weapon/grenade/clusterbuster/spawner_manhacks", "/obj/item/weapon/grenade/clusterbuster", {
	name: "iViscerator",
	payload: rt.typePath("/obj/item/weapon/grenade/spawnergrenade/manhacks"),
});
rt.type(6913, "/obj/item/weapon/grenade/clusterbuster/spawner_spesscarp", "/obj/item/weapon/grenade/clusterbuster", {
	name: "Invasion of the Space Carps",
	payload: rt.typePath("/obj/item/weapon/grenade/spawnergrenade/spesscarp"),
});
rt.type(6914, "/obj/item/weapon/grenade/clusterbuster/soap", "/obj/item/weapon/grenade/clusterbuster", {
	name: "Slipocalypse",
	payload: rt.typePath("/obj/item/weapon/grenade/spawnergrenade/syndiesoap"),
});
rt.type(6915, "/obj/item/weapon/grenade/clusterbuster/clf3", "/obj/item/weapon/grenade/clusterbuster", {
	name: "WELCOME TO HELL",
	payload: rt.typePath("/obj/item/weapon/grenade/chem_grenade/clf3"),
});
rt.type(6918, "/obj/item/weapon/grenade/flashbang/cluster", "/obj/item/weapon/grenade/flashbang", {
	icon_state: "flashbang_active",
});
rt.type(6923, "/obj/item/weapon/grenade/plastic/x4", "/obj/item/weapon/grenade/plastic", {
	directional: 1,
	boom_sizes: null,
	name: "X4",
	desc: "A shaped high-explosive breaching charge. Designed to ensure user safety and wall nonsafety.",
	icon_state: "plasticx40",
	item_state: "plasticx4",
});
rt.type(6926, "/obj/item/weapon/grenade/spawnergrenade/manhacks", "/obj/item/weapon/grenade/spawnergrenade", {
	spawner_type: rt.typePath("/mob/living/simple_animal/hostile/viscerator"),
	deliveryamt: 10,
	name: "viscerator delivery grenade",
	origin_tech: "materials=3;magnets=4;syndicate=3",
});
rt.type(6927, "/obj/item/weapon/grenade/spawnergrenade/spesscarp", "/obj/item/weapon/grenade/spawnergrenade", {
	spawner_type: rt.typePath("/mob/living/simple_animal/hostile/carp"),
	deliveryamt: 5,
	name: "carp delivery grenade",
	origin_tech: "materials=3;magnets=4;syndicate=3",
});
rt.type(6928, "/obj/item/weapon/grenade/spawnergrenade/syndiesoap", "/obj/item/weapon/grenade/spawnergrenade", {
	name: "Mister Scrubby",
	spawner_type: rt.typePath("/obj/item/weapon/soap/syndie"),
});
rt.type(6931, "/obj/item/weapon/grenade/syndieminibomb/concussion/frag", "/obj/item/weapon/grenade/syndieminibomb/concussion", {
	name: "frag grenade",
	desc: "Fire in the hole.",
	icon_state: "frag",
});
