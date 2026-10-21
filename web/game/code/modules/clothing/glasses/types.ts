// Types declared in code/modules/clothing/glasses that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(8229, "/obj/item/clothing/glasses/sunglasses/garb/supergarb", "/obj/item/clothing/glasses/sunglasses/garb", {
	name: "black giga gar glasses",
	desc: "Believe in us humans.",
	icon_state: "supergarb",
	item_state: "garb",
	force: 12,
	throwforce: 12,
});
rt.type(8231, "/obj/item/clothing/glasses/sunglasses/gar/supergar", "/obj/item/clothing/glasses/sunglasses/gar", {
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/red"),
	name: "giga gar glasses",
	desc: "We evolve past the person we were a minute before. Little by little we advance with each turn. That's how a drill works!",
	icon_state: "supergar",
	item_state: "gar",
	force: 12,
	throwforce: 12,
});
rt.type(8238, "/obj/item/clothing/glasses/thermal/eyepatch", "/obj/item/clothing/glasses/thermal", {
	name: "optical thermal eyepatch",
	desc: "An eyepatch with built-in thermal optics.",
	icon_state: "eyepatch",
	item_state: "eyepatch",
});
rt.type(8245, "/obj/item/clothing/glasses/hud/health", "/obj/item/clothing/glasses/hud", {
	hud_type: 4,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/lightblue"),
	name: "health scanner HUD",
	desc: "A heads-up display that scans the humans in view and provides accurate data about their health status.",
	icon_state: "healthhud",
	origin_tech: "magnets=3;biotech=2",
});
rt.type(8246, "/obj/item/clothing/glasses/hud/health/night", "/obj/item/clothing/glasses/hud/health", {
	darkness_view: 8,
	lighting_alpha: 192,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/green"),
	name: "night vision health scanner HUD",
	desc: "An advanced medical head-up display that allows doctors to find patients in complete darkness.",
	icon_state: "healthhudnight",
	item_state: "glasses",
	origin_tech: "magnets=4;biotech=4;plasmatech=4;engineering=5",
});
rt.type(8247, "/obj/item/clothing/glasses/hud/health/sunglasses", "/obj/item/clothing/glasses/hud/health", {
	darkness_view: 1,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/blue"),
	name: "medical HUDSunglasses",
	desc: "Sunglasses with a medical HUD.",
	icon_state: "sunhudmed",
	origin_tech: "magnets=3;biotech=3;engineering=3",
	flash_protect: 1,
	tint: 1,
});
rt.type(8248, "/obj/item/clothing/glasses/hud/diagnostic", "/obj/item/clothing/glasses/hud", {
	hud_type: 5,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/lightorange"),
	name: "diagnostic HUD",
	desc: "A heads-up display capable of analyzing the integrity and status of robotics and exosuits.",
	icon_state: "diagnostichud",
	origin_tech: "magnets=2;engineering=2",
});
rt.type(8249, "/obj/item/clothing/glasses/hud/diagnostic/night", "/obj/item/clothing/glasses/hud/diagnostic", {
	darkness_view: 8,
	lighting_alpha: 192,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/green"),
	name: "night vision diagnostic HUD",
	desc: "A robotics diagnostic HUD fitted with a light amplifier.",
	icon_state: "diagnostichudnight",
	item_state: "glasses",
	origin_tech: "magnets=4;powerstorage=4;plasmatech=4;engineering=5",
});
rt.type(8250, "/obj/item/clothing/glasses/hud/security", "/obj/item/clothing/glasses/hud", {
	hud_type: 2,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/red"),
	name: "security HUD",
	desc: "A heads-up display that scans the humans in view and provides accurate data about their ID status and security records.",
	icon_state: "securityhud",
	origin_tech: "magnets=3;combat=2",
});
rt.type(8252, "/obj/item/clothing/glasses/hud/security/sunglasses", "/obj/item/clothing/glasses/hud/security", {
	darkness_view: 1,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/darkred"),
	name: "security HUDSunglasses",
	desc: "Sunglasses with a security HUD.",
	icon_state: "sunhudsec",
	origin_tech: "magnets=3;combat=3;engineering=3",
	flash_protect: 1,
	tint: 1,
});
rt.type(8253, "/obj/item/clothing/glasses/hud/security/sunglasses/eyepatch", "/obj/item/clothing/glasses/hud/security/sunglasses", {
	name: "eyepatch HUD",
	desc: "A heads-up display that connects directly to the optical nerve of the user, replacing the need for that useless eyeball.",
	icon_state: "hudpatch",
});
rt.type(8255, "/obj/item/clothing/glasses/hud/security/sunglasses/gars/supergars", "/obj/item/clothing/glasses/hud/security/sunglasses/gars", {
	name: "giga HUD gar glasses",
	desc: "GIGA GAR glasses with a HUD.",
	icon_state: "supergars",
	item_state: "garb",
	force: 12,
	throwforce: 12,
});
rt.type(8256, "/obj/item/clothing/glasses/hud/security/night", "/obj/item/clothing/glasses/hud/security", {
	darkness_view: 8,
	lighting_alpha: 192,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/green"),
	name: "night vision security HUD",
	desc: "An advanced heads-up display which provides id data and vision in complete darkness.",
	icon_state: "securityhudnight",
	origin_tech: "magnets=4;combat=4;plasmatech=4;engineering=5",
});
