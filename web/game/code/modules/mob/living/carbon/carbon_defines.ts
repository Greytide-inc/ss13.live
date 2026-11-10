// Based on /tg/station's code/modules/mob/living/carbon/carbon_defines.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4810, "/mob/living/carbon", "/mob/living", {
	dreaming: 0,
	halimage: null,
	halbody: null,
	halitem: null,
	hal_screwyhud: 0,
	handling_hal: 0,
	stomach_contents: null,
	internal_organs: null,
	internal_organs_slot: null,
	silent: 0,
	handcuffed: null,
	legcuffed: null,
	back: null,
	wear_mask: null,
	wear_neck: null,
	internal: null,
	head: null,
	gloves: null,
	shoes: null,
	glasses: null,
	ears: null,
	dna: null,
	last_mind: null,
	failed_last_breath: 0,
	co2overloadtime: null,
	temperature_resistance: 348.15,
	abilities: null,
	rotate_on_lying: 1,
	tinttotal: 0,
	hand_bodyparts: null,
	icon_render_key: "",
	overlays_standing: null,
	type_of_meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"),
	gib_type: rt.typePath("/obj/effect/decal/cleanable/blood/gibs"),
	bodyparts: null,
	pressure_resistance: 15,
	blood_volume: 560,
	gender: "male",
	possible_a_intents: null,
	has_limbs: 1,
}, { global: { limb_icon_cache: 711 } });

// carbon_defines.dm:5
rt.def("/mob/living/carbon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.stomach_contents = list();

	this.internal_organs = list();

	this.internal_organs_slot = list();

	this.abilities = list();

	this.hand_bodyparts = list();

	this.overlays_standing = rt.op(f, "CreateMultidimensionalList", [1], [26]);
	this.possible_a_intents = list("help", "harm");

	this.bodyparts = list(T("/obj/item/bodypart/chest"), T("/obj/item/bodypart/head"), T("/obj/item/bodypart/l_arm"), T("/obj/item/bodypart/r_arm"), T("/obj/item/bodypart/r_leg"), T("/obj/item/bodypart/l_leg"));
	return f.dot;
});
