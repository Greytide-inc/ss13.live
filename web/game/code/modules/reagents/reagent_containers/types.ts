// Types declared in code/modules/reagents/reagent_containers that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(6382, "/obj/item/weapon/reagent_containers/spray/medical", "/obj/item/weapon/reagent_containers/spray", {
	name: "medical spray",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "medspray",
	volume: 100,
});
rt.type(6399, "/obj/item/weapon/reagent_containers/glass/bottle/killer", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "bottle",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "bottle16",
	volume: 50,
	w_class: 1,
	amount_per_transfer_from_this: 10,
	possible_transfer_amounts: null,
});
rt.type(6437, "/obj/item/weapon/reagent_containers/glass/bottle/flu_virion", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Flu virion culture bottle",
	desc: "A small bottle. Contains H13N1 flu virion culture in synthblood medium.",
	icon_state: "bottle3",
	spawned_disease: rt.typePath("/datum/disease/advance/flu"),
});
rt.type(6438, "/obj/item/weapon/reagent_containers/glass/bottle/epiglottis_virion", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Epiglottis virion culture bottle",
	desc: "A small bottle. Contains Epiglottis virion culture in synthblood medium.",
	icon_state: "bottle3",
	spawned_disease: rt.typePath("/datum/disease/advance/voice_change"),
});
rt.type(6439, "/obj/item/weapon/reagent_containers/glass/bottle/liver_enhance_virion", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Liver enhancement virion culture bottle",
	desc: "A small bottle. Contains liver enhancement virion culture in synthblood medium.",
	icon_state: "bottle3",
	spawned_disease: rt.typePath("/datum/disease/advance/heal"),
});
rt.type(6440, "/obj/item/weapon/reagent_containers/glass/bottle/hullucigen_virion", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Hullucigen virion culture bottle",
	desc: "A small bottle. Contains hullucigen virion culture in synthblood medium.",
	icon_state: "bottle3",
	spawned_disease: rt.typePath("/datum/disease/advance/hullucigen"),
});
rt.type(6441, "/obj/item/weapon/reagent_containers/glass/bottle/pierrot_throat", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Pierrot's Throat culture bottle",
	desc: "A small bottle. Contains H0NI<42 virion culture in synthblood medium.",
	icon_state: "bottle3",
	spawned_disease: rt.typePath("/datum/disease/pierrot_throat"),
});
rt.type(6442, "/obj/item/weapon/reagent_containers/glass/bottle/cold", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Rhinovirus culture bottle",
	desc: "A small bottle. Contains XY-rhinovirus culture in synthblood medium.",
	icon_state: "bottle3",
	spawned_disease: rt.typePath("/datum/disease/advance/cold"),
});
rt.type(6443, "/obj/item/weapon/reagent_containers/glass/bottle/retrovirus", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Retrovirus culture bottle",
	desc: "A small bottle. Contains a retrovirus culture in a synthblood medium.",
	icon_state: "bottle3",
	spawned_disease: rt.typePath("/datum/disease/dna_retrovirus"),
});
rt.type(6444, "/obj/item/weapon/reagent_containers/glass/bottle/gbs", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "GBS culture bottle",
	desc: "A small bottle. Contains Gravitokinetic Bipotential SADS+ culture in synthblood medium.",
	icon_state: "bottle3",
	amount_per_transfer_from_this: 5,
	spawned_disease: rt.typePath("/datum/disease/gbs"),
});
rt.type(6445, "/obj/item/weapon/reagent_containers/glass/bottle/fake_gbs", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "GBS culture bottle",
	desc: "A small bottle. Contains Gravitokinetic Bipotential SADS- culture in synthblood medium.",
	icon_state: "bottle3",
	spawned_disease: rt.typePath("/datum/disease/fake_gbs"),
});
rt.type(6446, "/obj/item/weapon/reagent_containers/glass/bottle/brainrot", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Brainrot culture bottle",
	desc: "A small bottle. Contains Cryptococcus Cosmosis culture in synthblood medium.",
	icon_state: "bottle3",
	spawned_disease: rt.typePath("/datum/disease/brainrot"),
});
rt.type(6447, "/obj/item/weapon/reagent_containers/glass/bottle/magnitis", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Magnitis culture bottle",
	desc: "A small bottle. Contains a small dosage of Fukkos Miracos.",
	icon_state: "bottle3",
	spawned_disease: rt.typePath("/datum/disease/magnitis"),
});
rt.type(6448, "/obj/item/weapon/reagent_containers/glass/bottle/wizarditis", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Wizarditis culture bottle",
	desc: "A small bottle. Contains a sample of Rincewindus Vulgaris.",
	icon_state: "bottle3",
	spawned_disease: rt.typePath("/datum/disease/wizarditis"),
});
rt.type(6449, "/obj/item/weapon/reagent_containers/glass/bottle/anxiety", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Severe Anxiety culture bottle",
	desc: "A small bottle. Contains a sample of Lepidopticides.",
	icon_state: "bottle3",
	spawned_disease: rt.typePath("/datum/disease/anxiety"),
});
rt.type(6450, "/obj/item/weapon/reagent_containers/glass/bottle/beesease", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Beesease culture bottle",
	desc: "A small bottle. Contains a sample of invasive Apidae.",
	icon_state: "bottle3",
	spawned_disease: rt.typePath("/datum/disease/beesease"),
});
rt.type(6451, "/obj/item/weapon/reagent_containers/glass/bottle/fluspanish", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Spanish flu culture bottle",
	desc: "A small bottle. Contains a sample of Inquisitius.",
	icon_state: "bottle3",
	spawned_disease: rt.typePath("/datum/disease/fluspanish"),
});
rt.type(6452, "/obj/item/weapon/reagent_containers/glass/bottle/tuberculosis", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "Fungal Tuberculosis culture bottle",
	desc: "A small bottle. Contains a sample of Fungal Tubercle bacillus.",
	icon_state: "bottle3",
	spawned_disease: rt.typePath("/datum/disease/tuberculosis"),
});
rt.type(6455, "/obj/item/weapon/reagent_containers/glass/beaker/jar", "/obj/item/weapon/reagent_containers/glass/beaker", {
	name: "honey jar",
	desc: "A jar for honey. It can hold up to 50 units of sweet delight.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "vapour",
});
rt.type(6500, "/obj/item/weapon/reagent_containers/blood/APlus", "/obj/item/weapon/reagent_containers/blood", {
	blood_type: "A+",
});
rt.type(6501, "/obj/item/weapon/reagent_containers/blood/AMinus", "/obj/item/weapon/reagent_containers/blood", {
	blood_type: "A-",
});
rt.type(6502, "/obj/item/weapon/reagent_containers/blood/BPlus", "/obj/item/weapon/reagent_containers/blood", {
	blood_type: "B+",
});
rt.type(6503, "/obj/item/weapon/reagent_containers/blood/BMinus", "/obj/item/weapon/reagent_containers/blood", {
	blood_type: "B-",
});
rt.type(6504, "/obj/item/weapon/reagent_containers/blood/OPlus", "/obj/item/weapon/reagent_containers/blood", {
	blood_type: "O+",
});
rt.type(6505, "/obj/item/weapon/reagent_containers/blood/OMinus", "/obj/item/weapon/reagent_containers/blood", {
	blood_type: "O-",
});
rt.type(6506, "/obj/item/weapon/reagent_containers/blood/lizard", "/obj/item/weapon/reagent_containers/blood", {
	blood_type: "L",
});
rt.type(6507, "/obj/item/weapon/reagent_containers/blood/empty", "/obj/item/weapon/reagent_containers/blood", {
	name: "blood pack",
	icon_state: "empty",
});
rt.type(6509, "/obj/item/weapon/reagent_containers/borghypo/hacked", "/obj/item/weapon/reagent_containers/borghypo", {
	reagent_ids: null,
	accepts_reagent_upgrades: 0,
	icon_state: "borghypo_s",
});
rt.type(6510, "/obj/item/weapon/reagent_containers/borghypo/syndicate", "/obj/item/weapon/reagent_containers/borghypo", {
	charge_cost: 20,
	recharge_time: 2,
	reagent_ids: null,
	bypass_protection: 1,
	accepts_reagent_upgrades: 0,
	name: "syndicate cyborg hypospray",
	desc: "An experimental piece of Syndicate technology used to produce powerful restorative nanites used to very quickly restore injuries of all types. Also metabolizes potassium iodide, for radiation poisoning, and morphine, for offense.",
	icon_state: "borghypo_s",
});
rt.type(6513, "/obj/item/weapon/reagent_containers/borghypo/peace", "/obj/item/weapon/reagent_containers/borghypo", {
	reagent_ids: null,
	accepts_reagent_upgrades: 0,
	name: "Peace Hypospray",
});
rt.type(6514, "/obj/item/weapon/reagent_containers/borghypo/peace/hacked", "/obj/item/weapon/reagent_containers/borghypo/peace", {
	reagent_ids: null,
	accepts_reagent_upgrades: 0,
	desc: "Everything's peaceful in death!",
	icon_state: "borghypo_s",
});
rt.type(6553, "/obj/item/weapon/reagent_containers/syringe/lethal", "/obj/item/weapon/reagent_containers/syringe", {
	amount_per_transfer_from_this: 50,
	volume: 50,
	name: "lethal injection syringe",
	desc: "A syringe used for lethal injections. It can hold up to 50 units.",
});
rt.type(6558, "/obj/item/weapon/reagent_containers/syringe/bluespace", "/obj/item/weapon/reagent_containers/syringe", {
	amount_per_transfer_from_this: 20,
	volume: 60,
	name: "bluespace syringe",
	desc: "An advanced syringe that can hold 60 units of chemicals",
	origin_tech: "bluespace=4;materials=4;biotech=4",
});
rt.type(6560, "/obj/item/weapon/reagent_containers/syringe/piercing", "/obj/item/weapon/reagent_containers/syringe", {
	volume: 10,
	proj_piercing: 1,
	name: "piercing syringe",
	desc: "A diamond-tipped syringe that pierces armor when launched at high velocity. It can hold up to 10 units.",
	origin_tech: "combat=3;materials=4;engineering=5",
});
