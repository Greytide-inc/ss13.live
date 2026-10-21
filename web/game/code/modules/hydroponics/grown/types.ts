// Types declared in code/modules/hydroponics/grown that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(6269, "/obj/item/weapon/reagent_containers/food/snacks/grown/banana/mime", "/obj/item/weapon/reagent_containers/food/snacks/grown/banana", {
	filling_color: "#FFFFEE",
	seed: rt.typePath("/obj/item/seeds/banana/mime"),
	name: "mimana",
	desc: "It's an excellent prop for a mime.",
	icon_state: "mimana",
	trash: rt.typePath("/obj/item/weapon/grown/bananapeel/mimanapeel"),
});
rt.type(6270, "/obj/item/weapon/reagent_containers/food/snacks/grown/banana/bluespace", "/obj/item/weapon/reagent_containers/food/snacks/grown/banana", {
	filling_color: "#0000FF",
	seed: rt.typePath("/obj/item/seeds/banana/bluespace"),
	name: "bluespace banana",
	icon_state: "banana_blue",
	trash: rt.typePath("/obj/item/weapon/grown/bananapeel/bluespace"),
	origin_tech: "biotech=3;bluespace=5",
});
rt.type(6308, "/obj/item/weapon/reagent_containers/food/snacks/grown/grass/carpet", "/obj/item/weapon/reagent_containers/food/snacks/grown/grass", {
	seed: rt.typePath("/obj/item/seeds/grass/carpet"),
	name: "carpet",
	desc: "The textile industry's dark secret.",
	icon_state: "carpetclump",
	stacktype: rt.typePath("/obj/item/stack/tile/carpet"),
});
rt.type(6324, "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/glowshroom/glowcap", "/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom/glowshroom", {
	filling_color: "#00FA9A",
	seed: rt.typePath("/obj/item/seeds/glowshroom/glowcap"),
	name: "glowcap cluster",
	desc: "<I>Mycena Ruthenia</I>: This species of mushroom glows in the dark, but isn't actually bioluminescent. They're warm to the touch...",
	icon_state: "glowcap",
	effect_path: rt.typePath("/obj/structure/glowshroom/glowcap"),
	origin_tech: "biotech=4;powerstorage=6;plasmatech=4",
});
rt.type(6327, "/obj/item/weapon/reagent_containers/food/snacks/grown/onion/red", "/obj/item/weapon/reagent_containers/food/snacks/grown/onion", {
	filling_color: "#C29ACF",
	seed: rt.typePath("/obj/item/seeds/onion/red"),
	name: "red onion",
	desc: "Purple despite the name.",
	icon_state: "onion_red",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/onion_slice/red"),
});
rt.type(6329, "/obj/item/weapon/reagent_containers/food/snacks/grown/potato/wedges", "/obj/item/weapon/reagent_containers/food/snacks/grown/potato", {
	filling_color: "#E9967A",
	bitesize: 100,
	name: "potato wedges",
	desc: "Slices of neatly cut potato.",
	icon_state: "potato_wedges",
});
rt.type(6330, "/obj/item/weapon/reagent_containers/food/snacks/grown/potato/sweet", "/obj/item/weapon/reagent_containers/food/snacks/grown/potato", {
	seed: rt.typePath("/obj/item/seeds/potato/sweet"),
	name: "sweet potato",
	desc: "It's sweet.",
	icon_state: "sweetpotato",
});
rt.type(7494, "/obj/item/weapon/grown/bananapeel/mimanapeel", "/obj/item/weapon/grown/bananapeel", {
	seed: rt.typePath("/obj/item/seeds/banana/mime"),
	name: "mimana peel",
	desc: "A mimana peel.",
	icon_state: "mimana_peel",
});
rt.type(7495, "/obj/item/weapon/grown/bananapeel/bluespace", "/obj/item/weapon/grown/bananapeel", {
	seed: rt.typePath("/obj/item/seeds/banana/bluespace"),
	name: "bluespace banana peel",
	desc: "A peel from a bluespace banana.",
	icon_state: "banana_peel_blue",
});
rt.type(7505, "/obj/item/weapon/grown/log/tree", "/obj/item/weapon/grown/log", {
	seed: null,
	name: "wood log",
	desc: "TIMMMMM-BERRRRRRRRRRR!",
});
rt.type(10046, "/obj/item/seeds/lavaland/cactus", "/obj/item/seeds/lavaland", {
	species: "cactus",
	plantname: "Fruiting Cactus",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/cactus_fruit"),
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_fruits.dmi"),
	growthstages: 2,
	name: "pack of fruiting cactus seeds",
	desc: "These seeds grow into fruiting cacti.",
	icon_state: "seed-cactus",
});
