// Types declared in code/modules/clothing/outfits that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(646, "/datum/outfit/wizard/red", "/datum/outfit/wizard", {
	name: "Red Wizard",
	suit: rt.typePath("/obj/item/clothing/suit/wizrobe/red"),
	head: rt.typePath("/obj/item/clothing/head/wizard/red"),
});
rt.type(647, "/datum/outfit/wizard/weeb", "/datum/outfit/wizard", {
	name: "Marisa Wizard",
	suit: rt.typePath("/obj/item/clothing/suit/wizrobe/marisa"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sandal/marisa"),
	head: rt.typePath("/obj/item/clothing/head/wizard/marisa"),
});
rt.type(667, "/datum/outfit/laser_tag/blue", "/datum/outfit/laser_tag", {
	name: "Laser Tag Blue",
	uniform: rt.typePath("/obj/item/clothing/under/color/blue"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/blue"),
	head: rt.typePath("/obj/item/clothing/head/helmet/bluetaghelm"),
	gloves: rt.typePath("/obj/item/clothing/gloves/color/blue"),
	suit: rt.typePath("/obj/item/clothing/suit/bluetag"),
	suit_store: rt.typePath("/obj/item/weapon/gun/energy/laser/bluetag"),
});
rt.type(680, "/datum/outfit/death_commando/officer", "/datum/outfit/death_commando", {
	name: "Death Commando Officer",
	head: rt.typePath("/obj/item/clothing/head/helmet/space/beret"),
});
