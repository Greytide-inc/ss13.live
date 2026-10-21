// Types declared in code/modules/mining/lavaland that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(6350, "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/shavings", "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora", {});
rt.type(6678, "/obj/item/weapon/disk/design_disk/modkit_disc/mob_and_turf_aoe", "/obj/item/weapon/disk/design_disk/modkit_disc", {
	modkit_design: rt.typePath("/datum/design/unique_modkit/offensive_turf_aoe"),
	name: "Offensive Mining Explosion Mod Disk",
});
rt.type(6679, "/obj/item/weapon/disk/design_disk/modkit_disc/rapid_repeater", "/obj/item/weapon/disk/design_disk/modkit_disc", {
	modkit_design: rt.typePath("/datum/design/unique_modkit/rapid_repeater"),
	name: "Rapid Repeater Mod Disk",
});
rt.type(6680, "/obj/item/weapon/disk/design_disk/modkit_disc/resonator_blast", "/obj/item/weapon/disk/design_disk/modkit_disc", {
	modkit_design: rt.typePath("/datum/design/unique_modkit/resonator_blast"),
	name: "Resonator Blast Mod Disk",
});
rt.type(6681, "/obj/item/weapon/disk/design_disk/modkit_disc/bounty", "/obj/item/weapon/disk/design_disk/modkit_disc", {
	modkit_design: rt.typePath("/datum/design/unique_modkit/bounty"),
	name: "Death Syphon Mod Disk",
});
rt.type(12512, "/obj/structure/flora/ash/tall_shroom", "/obj/structure/flora/ash", {
	regrowth_time_low: 4200,
});
rt.type(12513, "/obj/structure/flora/ash/leaf_shroom", "/obj/structure/flora/ash", {
	harvested_name: "leafless mushrooms",
	harvested_desc: "A bunch of formerly-leafed mushrooms, with their sporangiums exposed. Scandalous?",
	harvest: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_leaf"),
	needs_sharp_harvest: 0,
	harvest_amount_high: 4,
	harvest_time: 20,
	harvest_message_low: "You pluck a single, suitable leaf.",
	harvest_message_med: "You pluck a number of leaves, leaving a few unsuitable ones.",
	harvest_message_high: "You pluck quite a lot of suitable leaves.",
	regrowth_time_low: 2400,
	regrowth_time_high: 6000,
	icon_state: "s_mushroom",
	name: "leafy mushrooms",
	desc: "A number of mushrooms, each of which surrounds a greenish sporangium with a number of leaf-like structures.",
});
rt.type(12514, "/obj/structure/flora/ash/cap_shroom", "/obj/structure/flora/ash", {
	harvested_name: "small mushrooms",
	harvested_desc: "Several small mushrooms near the stumps of what likely were larger mushrooms.",
	harvest: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_cap"),
	harvest_amount_high: 4,
	harvest_time: 50,
	harvest_message_low: "You slice the cap off a mushroom.",
	harvest_message_med: "You slice off a few conks from the larger mushrooms.",
	harvest_message_high: "You slice off a number of caps and conks from these mushrooms.",
	regrowth_time_low: 3000,
	regrowth_time_high: 5400,
	icon_state: "r_mushroom",
	name: "tall mushrooms",
	desc: "Several mushrooms, the larger of which have a ring of conks at the midpoint of their stems.",
});
rt.type(12515, "/obj/structure/flora/ash/stem_shroom", "/obj/structure/flora/ash", {
	harvested_name: "tiny mushrooms",
	harvested_desc: "A few tiny mushrooms around larger stumps. You can already see them growing back.",
	harvest: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_stem"),
	harvest_amount_high: 4,
	harvest_time: 40,
	harvest_message_low: "You pick and slice the cap off a mushroom, leaving the stem.",
	harvest_message_med: "You pick and decapitate several mushrooms for their stems.",
	harvest_message_high: "You acquire a number of stems from these mushrooms.",
	regrowth_time_low: 3000,
	regrowth_time_high: 6000,
	icon_state: "t_mushroom",
	name: "numerous mushrooms",
	desc: "A large number of mushrooms, some of which have long, fleshy stems. They're radiating light!",
	luminosity: 1,
});
