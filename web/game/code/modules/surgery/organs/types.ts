// Types declared in code/modules/surgery/organs that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(9432, "/obj/item/device/autosurgeon/cmo", "/obj/item/device/autosurgeon", {
	uses: 1,
	desc: "A single use autosurgeon that contains a medical heads-up display augment. A screwdriver can be used to remove it, but implants can't be placed back in.",
	starting_organ: rt.typePath("/obj/item/organ/cyberimp/eyes/hud/medical"),
});
rt.type(9433, "/obj/item/device/autosurgeon/thermal_eyes", "/obj/item/device/autosurgeon", {
	starting_organ: rt.typePath("/obj/item/organ/eyes/robotic/thermals"),
});
rt.type(9434, "/obj/item/device/autosurgeon/xray_eyes", "/obj/item/device/autosurgeon", {
	starting_organ: rt.typePath("/obj/item/organ/eyes/robotic/xray"),
});
rt.type(9435, "/obj/item/device/autosurgeon/anti_stun", "/obj/item/device/autosurgeon", {
	starting_organ: rt.typePath("/obj/item/organ/cyberimp/brain/anti_stun"),
});
rt.type(9436, "/obj/item/device/autosurgeon/reviver", "/obj/item/device/autosurgeon", {
	starting_organ: rt.typePath("/obj/item/organ/cyberimp/chest/reviver"),
});
rt.type(9456, "/obj/item/organ/heart/cursed/wizard", "/obj/item/organ/heart/cursed", {
	pump_delay: 60,
	heal_brute: 25,
	heal_burn: 25,
	heal_oxy: 25,
});
rt.type(9478, "/obj/item/organ/eyes/night_vision/alien", "/obj/item/organ/eyes/night_vision", {
	see_in_dark: 8,
	lighting_alpha: 192,
	sight_flags: 4,
	name: "alien eyes",
	desc: "It turned out they had them after all!",
});
rt.type(9479, "/obj/item/organ/eyes/night_vision/zombie", "/obj/item/organ/eyes/night_vision", {
	name: "undead eyes",
	desc: "Somewhat counterintuitively, these half rotten eyes actually have superior vision to those of a living human.",
});
rt.type(9481, "/obj/item/organ/eyes/robotic/xray", "/obj/item/organ/eyes/robotic", {
	eye_color: "000",
	see_in_dark: 8,
	sight_flags: 28,
	name: "X-ray eyes",
	desc: "These cybernetic eyes will give you X-ray vision. Blinking is futile.",
});
rt.type(9482, "/obj/item/organ/eyes/robotic/thermals", "/obj/item/organ/eyes/robotic", {
	eye_color: "FC0",
	sight_flags: 4,
	lighting_alpha: 192,
	flash_protect: -1,
	see_in_dark: 8,
	name: "Thermals eyes",
	desc: "These cybernetic eye implants will give you Thermal vision. Vertical slit pupil included.",
	origin_tech: "materials=5;programming=4;biotech=4;magnets=4;syndicate=1",
});
rt.type(9484, "/obj/item/organ/eyes/robotic/shield", "/obj/item/organ/eyes/robotic", {
	flash_protect: 2,
	name: "shielded robotic eyes",
	desc: "These reactive micro-shields will protect you from welders and flashes without obscuring your vision.",
	origin_tech: "materials=4;biotech=3;engineering=4;plasmatech=3",
});
rt.type(9491, "/obj/item/organ/cyberimp/arm/gun/laser/l", "/obj/item/organ/cyberimp/arm/gun/laser", {
	zone: "l_arm",
});
rt.type(9493, "/obj/item/organ/cyberimp/arm/gun/taser/l", "/obj/item/organ/cyberimp/arm/gun/taser", {
	zone: "l_arm",
});
rt.type(9495, "/obj/item/organ/cyberimp/arm/toolset/l", "/obj/item/organ/cyberimp/arm/toolset", {
	zone: "l_arm",
});
rt.type(9502, "/obj/item/organ/cyberimp/chest", "/obj/item/organ/cyberimp", {
	name: "cybernetic torso implant",
	desc: "implants for the organs in your torso",
	icon_state: "chest_implant",
	implant_overlay: "chest_implant_overlay",
	zone: "chest",
});
rt.type(9504, "/obj/item/organ/cyberimp/chest/nutriment/plus", "/obj/item/organ/cyberimp/chest/nutriment", {
	hunger_threshold: 250,
	poison_amount: 10,
	name: "Nutriment pump implant PLUS",
	desc: "This implant will synthesize and pump into your bloodstream a small amount of nutriment when you are hungry.",
	icon_state: "chest_implant",
	implant_color: "#006607",
	origin_tech: "materials=4;powerstorage=3;biotech=3",
});
rt.type(9507, "/obj/item/organ/cyberimp/eyes", "/obj/item/organ/cyberimp", {});
rt.type(9509, "/obj/item/organ/cyberimp/eyes/hud/medical", "/obj/item/organ/cyberimp/eyes/hud", {
	HUD_type: 4,
	name: "Medical HUD implant",
	desc: "These cybernetic eye implants will display a medical HUD over everything you see.",
	origin_tech: "materials=4;programming=4;biotech=4",
});
rt.type(9510, "/obj/item/organ/cyberimp/eyes/hud/security", "/obj/item/organ/cyberimp/eyes/hud", {
	HUD_type: 2,
	name: "Security HUD implant",
	desc: "These cybernetic eye implants will display a security HUD over everything you see.",
	origin_tech: "materials=4;programming=4;biotech=3;combat=3",
});
rt.type(9514, "/obj/item/organ/cyberimp/mouth", "/obj/item/organ/cyberimp", {
	zone: "mouth",
});
rt.type(9517, "/obj/item/organ/ears/invincible", "/obj/item/organ/ears", {});
rt.type(9520, "/obj/item/organ/lungs/plasmaman", "/obj/item/organ/lungs", {
	safe_oxygen_min: 0,
	safe_toxins_min: 16,
	safe_toxins_max: 0,
	name: "plasma filter",
	desc: "A spongy rib-shaped mass for filtering plasma from the air.",
	icon_state: "lungs-plasma",
});
rt.type(9521, "/obj/item/organ/tail", "/obj/item/organ", {
	zone: "groin",
	slot: "tail",
	name: "tail",
	desc: "What did you cut this off of?",
});
rt.type(9530, "/obj/item/organ/tongue/bone/plasmaman", "/obj/item/organ/tongue/bone", {
	name: "plasma bone \"tongue\"",
	desc: "Like animated skeletons, Plasmamen vibrate their teeth in order to produce speech.",
	icon_state: "tongueplasma",
});
rt.type(9535, "/obj/item/organ/adamantine_resonator", "/obj/item/organ", {
	zone: "head",
	slot: "adamantine_resonator",
	name: "adamantine resonator",
	desc: "Fragments of adamantine exists in all golems, stemming from their origins as purely magical constructs. These are used to \"hear\" messages from their leaders.",
	icon_state: "adamantine_resonator",
});
