// Types declared in code/modules/mob/living/carbon/human/species_types that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";

rt.type(4085, "/datum/species/golem/gold", "/datum/species/golem", {
	name: "Gold Golem",
	id: "gold golem",
	fixed_mut_color: "cc0",
	speedmod: 1,
	armor: 25,
	info_text: "As a <span class='danger'>Gold Golem</span>, you are faster but less resistant than the average golem.",
	prefix: "Golden",
	meat: rt.typePath("/obj/item/weapon/ore/gold"),
});
rt.type(4086, "/datum/species/golem/silver", "/datum/species/golem", {
	name: "Silver Golem",
	id: "silver golem",
	fixed_mut_color: "ddd",
	punchstunthreshold: 9,
	info_text: "As a <span class='danger'>Silver Golem</span>, your attacks are heavier and have a higher chance of stunning.",
	prefix: "Silver",
	special_names: null,
	meat: rt.typePath("/obj/item/weapon/ore/silver"),
});
rt.type(4087, "/datum/species/golem/plasteel", "/datum/species/golem", {
	name: "Plasteel Golem",
	id: "plasteel golem",
	fixed_mut_color: "bbb",
	stunmod: 0.4,
	punchdamagelow: 12,
	punchdamagehigh: 21,
	punchstunthreshold: 18,
	speedmod: 4,
	info_text: "As a <span class='danger'>Plasteel Golem</span>, you are slower, but harder to stun, and hit very hard when punching.",
	attack_verb: "smash",
	attack_sound: rt.rsc("sound/effects/meteorimpact.ogg"),
	prefix: "Plasteel",
	meat: rt.typePath("/obj/item/weapon/ore/iron"),
});
rt.type(4104, "/datum/species/lizard/ashwalker", "/datum/species/lizard", {
	name: "Ash Walker",
	id: "ashlizard",
	limbs_id: "lizard",
	species_traits: null,
});
rt.type(4110, "/datum/species/synth/military", "/datum/species/synth", {
	name: "Military Synth",
	id: "military_synth",
	armor: 25,
	punchdamagelow: 10,
	punchdamagehigh: 19,
	punchstunthreshold: 14,
	disguise_fail_health: 50,
});
