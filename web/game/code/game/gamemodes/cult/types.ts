// Types declared in code/game/gamemodes/cult that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(99, "/datum/action/innate/cult/create_rune/tele", "/datum/action/innate/cult/create_rune", {
	rune_color: "#551A8B",
	button_icon_state: "telerune",
	rune_type: rt.typePath("/obj/effect/rune/teleport"),
	rune_word_type: rt.typePath("/obj/effect/temp_visual/cult/rune_spawn/rune2"),
	rune_innerring_type: rt.typePath("/obj/effect/temp_visual/cult/rune_spawn/rune2/inner"),
	rune_center_type: rt.typePath("/obj/effect/temp_visual/cult/rune_spawn/rune2/center"),
});
rt.type(5658, "/obj/item/weapon/melee/cultblade/ghost", "/obj/item/weapon/melee/cultblade", {
	flags: 16386,
	name: "eldritch sword",
	force: 19,
});
rt.type(7806, "/obj/item/clothing/suit/cultrobes/alt", "/obj/item/clothing/suit/cultrobes", {
	name: "cultist robes",
	desc: "An armored set of robes worn by the followers of Nar-Sie.",
	icon_state: "cultrobesalt",
	item_state: "cultrobesalt",
});
rt.type(7807, "/obj/item/clothing/suit/cultrobes/alt/ghost", "/obj/item/clothing/suit/cultrobes/alt", {
	flags: 16386,
});
rt.type(8026, "/obj/item/clothing/head/culthood/alt", "/obj/item/clothing/head/culthood", {
	name: "cultist hood",
	desc: "An armored hood worn by the followers of Nar-Sie.",
	icon_state: "cult_hoodalt",
	item_state: "cult_hoodalt",
});
rt.type(8027, "/obj/item/clothing/head/culthood/alt/ghost", "/obj/item/clothing/head/culthood/alt", {
	flags: 16386,
});
