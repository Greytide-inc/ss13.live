// Types declared in code/modules/clothing/suits that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(7767, "/obj/item/clothing/suit/armor/plate", "/obj/item/clothing/suit/armor", {});
rt.type(7771, "/obj/item/clothing/suit/armor/vest", "/obj/item/clothing/suit/armor", {
	name: "armor vest",
	desc: "A slim Type I armored vest that provides decent protection against most types of damage.",
	icon_state: "armoralt",
	item_state: "armoralt",
	blood_overlay_type: "armor",
	dog_fashion: rt.typePath("/datum/dog_fashion/back"),
});
rt.type(7772, "/obj/item/clothing/suit/armor/vest/alt", "/obj/item/clothing/suit/armor/vest", {
	desc: "A Type I armored vest that provides decent protection against most types of damage.",
	icon_state: "armor",
	item_state: "armor",
});
rt.type(7773, "/obj/item/clothing/suit/armor/vest/old", "/obj/item/clothing/suit/armor/vest", {
	name: "degrading armor vest",
	desc: "Older generation Type 1 armored vest. Due to degradation over time the vest is far less maneuverable to move in.",
	icon_state: "armor",
	item_state: "armor",
	slowdown: 1,
});
rt.type(7774, "/obj/item/clothing/suit/armor/vest/blueshirt", "/obj/item/clothing/suit/armor/vest", {
	icon_state: "blueshift",
	item_state: "blueshift",
});
rt.type(7775, "/obj/item/clothing/suit/armor/vest/warden", "/obj/item/clothing/suit/armor/vest", {
	name: "warden's jacket",
	desc: "A navy-blue armored jacket with blue shoulder designations and '/Warden/' stitched into one of the chest pockets.",
	icon_state: "warden_alt",
	item_state: "armor",
	body_parts_covered: 390,
	cold_protection: 1926,
	heat_protection: 1926,
	strip_delay: 70,
	resistance_flags: 4,
	dog_fashion: null,
});
rt.type(7776, "/obj/item/clothing/suit/armor/vest/warden/alt", "/obj/item/clothing/suit/armor/vest/warden", {
	name: "warden's armored jacket",
	desc: "A red jacket with silver rank pips and body armor strapped on top.",
	icon_state: "warden_jacket",
});
rt.type(7777, "/obj/item/clothing/suit/armor/vest/leather", "/obj/item/clothing/suit/armor/vest", {
	name: "security overcoat",
	desc: "Lightly armored leather overcoat meant as casual wear for high-ranking officers. Bears the crest of Nanotrasen Security.",
	icon_state: "leathercoat-sec",
	item_state: "hostrench",
	body_parts_covered: 414,
	cold_protection: 414,
	heat_protection: 414,
	dog_fashion: null,
});
rt.type(7779, "/obj/item/clothing/suit/armor/vest/capcarapace/syndicate", "/obj/item/clothing/suit/armor/vest/capcarapace", {
	name: "syndicate captain's vest",
	desc: "A sinister looking vest of advanced armor worn over a black and red fireproof jacket. The gold collar and shoulders denote that this belongs to a high ranking syndicate officer.",
	icon_state: "syndievest",
});
rt.type(7780, "/obj/item/clothing/suit/armor/vest/capcarapace/alt", "/obj/item/clothing/suit/armor/vest/capcarapace", {
	name: "captain's parade jacket",
	desc: "For when an armoured vest isn't fashionable enough.",
	icon_state: "capformal",
	item_state: "capspacesuit",
});
rt.type(7783, "/obj/item/clothing/suit/armor/hos/trenchcoat", "/obj/item/clothing/suit/armor/hos", {
	name: "armored trenchoat",
	desc: "A trenchcoat enchanced with a special lightweight kevlar. The epitome of tactical plainclothes.",
	icon_state: "hostrench",
	item_state: "hostrench",
	flags_inv: 0,
	strip_delay: 80,
});
rt.type(7785, "/obj/item/clothing/suit/armor/riot/knight", "/obj/item/clothing/suit/armor/riot", {
	name: "plate armour",
	desc: "A classic suit of plate armour, highly effective at stopping melee attacks.",
	icon_state: "knight_green",
	item_state: "knight_green",
});
rt.type(7786, "/obj/item/clothing/suit/armor/riot/knight/yellow", "/obj/item/clothing/suit/armor/riot/knight", {
	icon_state: "knight_yellow",
	item_state: "knight_yellow",
});
rt.type(7787, "/obj/item/clothing/suit/armor/riot/knight/blue", "/obj/item/clothing/suit/armor/riot/knight", {
	icon_state: "knight_blue",
	item_state: "knight_blue",
});
rt.type(7788, "/obj/item/clothing/suit/armor/riot/knight/red", "/obj/item/clothing/suit/armor/riot/knight", {
	icon_state: "knight_red",
	item_state: "knight_red",
});
rt.type(7789, "/obj/item/clothing/suit/armor/riot/knight/templar", "/obj/item/clothing/suit/armor/riot/knight", {
	name: "crusader armour",
	desc: "God wills it!",
	icon_state: "knight_templar",
	item_state: "knight_templar",
});
rt.type(7802, "/obj/item/clothing/suit/armor/tdome/red", "/obj/item/clothing/suit/armor/tdome", {
	name: "thunderdome suit",
	desc: "Reddish armor.",
	icon_state: "tdred",
	item_state: "tdred",
});
rt.type(7803, "/obj/item/clothing/suit/armor/tdome/green", "/obj/item/clothing/suit/armor/tdome", {
	name: "thunderdome suit",
	desc: "Pukish armor.",
	icon_state: "tdgreen",
	item_state: "tdgreen",
});
rt.type(7810, "/obj/item/clothing/suit/hooded/cultrobes", "/obj/item/clothing/suit/hooded", {});
rt.type(7814, "/obj/item/clothing/suit/hooded/cloak", "/obj/item/clothing/suit/hooded", {});
rt.type(7819, "/obj/item/clothing/suit/hooded/bee_costume", "/obj/item/clothing/suit/hooded", {
	flags: 8192,
	name: "bee costume",
	desc: "Bee the true Queen!",
	icon_state: "bee",
	item_state: "labcoat",
	body_parts_covered: 390,
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/bee_hood"),
});
rt.type(7827, "/obj/item/clothing/suit/hooded/wintercoat/engineering/atmos", "/obj/item/clothing/suit/hooded/wintercoat/engineering", {
	name: "atmospherics winter coat",
	icon_state: "coatatmos",
	item_state: "coatatmos",
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/winterhood/engineering/atmos"),
});
rt.type(7829, "/obj/item/clothing/suit/hooded/wintercoat/cargo", "/obj/item/clothing/suit/hooded/wintercoat", {
	name: "cargo winter coat",
	icon_state: "coatcargo",
	item_state: "coatcargo",
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/winterhood/cargo"),
});
rt.type(7834, "/obj/item/clothing/suit/bio_suit/general", "/obj/item/clothing/suit/bio_suit", {
	icon_state: "bio_general",
});
rt.type(7835, "/obj/item/clothing/suit/bio_suit/virology", "/obj/item/clothing/suit/bio_suit", {
	icon_state: "bio_virology",
});
rt.type(7837, "/obj/item/clothing/suit/bio_suit/janitor", "/obj/item/clothing/suit/bio_suit", {
	icon_state: "bio_janitor",
});
rt.type(7838, "/obj/item/clothing/suit/bio_suit/scientist", "/obj/item/clothing/suit/bio_suit", {
	icon_state: "bio_scientist",
});
rt.type(7839, "/obj/item/clothing/suit/bio_suit/cmo", "/obj/item/clothing/suit/bio_suit", {
	icon_state: "bio_cmo",
});
rt.type(7840, "/obj/item/clothing/suit/bio_suit/plaguedoctorsuit", "/obj/item/clothing/suit/bio_suit", {
	name: "plague doctor suit",
	desc: "It protected doctors from the Black Death, back then. You bet your arse it's gonna help you against viruses.",
	icon_state: "plaguedoctor",
	item_state: "bio_suit",
	strip_delay: 40,
	equip_delay_other: 20,
});
rt.type(7844, "/obj/item/clothing/suit/apron/overalls", "/obj/item/clothing/suit/apron", {
	name: "coveralls",
	desc: "A set of denim overalls.",
	icon_state: "overalls",
	item_state: "overalls",
	body_parts_covered: 30,
});
rt.type(7851, "/obj/item/clothing/suit/toggle/lawyer", "/obj/item/clothing/suit/toggle", {
	blood_overlay_type: "coat",
	togglename: "buttons",
	name: "blue suit jacket",
	desc: "A snappy dress jacket.",
	icon_state: "suitjacket_blue",
	item_state: "suitjacket_blue",
	body_parts_covered: 386,
});
rt.type(7852, "/obj/item/clothing/suit/toggle/lawyer/purple", "/obj/item/clothing/suit/toggle/lawyer", {
	name: "purple suit jacket",
	desc: "A foppish dress jacket.",
	icon_state: "suitjacket_purp",
	item_state: "suitjacket_purp",
});
rt.type(7853, "/obj/item/clothing/suit/toggle/lawyer/black", "/obj/item/clothing/suit/toggle/lawyer", {
	name: "black suit jacket",
	desc: "A professional suit jacket.",
	icon_state: "suitjacket_black",
	item_state: "ro_suit",
});
rt.type(7855, "/obj/item/clothing/suit/toggle/labcoat/cmo", "/obj/item/clothing/suit/toggle/labcoat", {
	name: "chief medical officer's labcoat",
	desc: "Bluer than the standard model.",
	icon_state: "labcoat_cmo",
	item_state: "labcoat_cmo",
});
rt.type(7856, "/obj/item/clothing/suit/toggle/labcoat/emt", "/obj/item/clothing/suit/toggle/labcoat", {
	name: "EMT's jacket",
	desc: "A dark blue jacket with reflective strips for emergency medical technicians.",
	icon_state: "labcoat_emt",
	item_state: "labcoat_cmo",
});
rt.type(7857, "/obj/item/clothing/suit/toggle/labcoat/mad", "/obj/item/clothing/suit/toggle/labcoat", {
	name: "１The Mad's labcoat",
	desc: "It makes you look capable of konking someone on the noggin and shooting them into space.",
	icon_state: "labgreen",
	item_state: "labgreen",
});
rt.type(7858, "/obj/item/clothing/suit/toggle/labcoat/genetics", "/obj/item/clothing/suit/toggle/labcoat", {
	name: "geneticist labcoat",
	desc: "A suit that protects against minor chemical spills. Has a blue stripe on the shoulder.",
	icon_state: "labcoat_gen",
});
rt.type(7859, "/obj/item/clothing/suit/toggle/labcoat/chemist", "/obj/item/clothing/suit/toggle/labcoat", {
	name: "chemist labcoat",
	desc: "A suit that protects against minor chemical spills. Has an orange stripe on the shoulder.",
	icon_state: "labcoat_chem",
});
rt.type(7860, "/obj/item/clothing/suit/toggle/labcoat/virologist", "/obj/item/clothing/suit/toggle/labcoat", {
	name: "virologist labcoat",
	desc: "A suit that protects against minor chemical spills. Offers slightly more protection against biohazards than the standard model. Has a green stripe on the shoulder.",
	icon_state: "labcoat_vir",
});
rt.type(7861, "/obj/item/clothing/suit/toggle/labcoat/science", "/obj/item/clothing/suit/toggle/labcoat", {
	name: "scientist labcoat",
	desc: "A suit that protects against minor chemical spills. Has a purple stripe on the shoulder.",
	icon_state: "labcoat_tox",
});
rt.type(7863, "/obj/item/clothing/suit/toggle/owlwings/griffinwings", "/obj/item/clothing/suit/toggle/owlwings", {
	name: "griffon cloak",
	desc: "A plush white cloak made of synthetic feathers. Soft to the touch, stylish, and a 2 meter wing span that will drive your captives mad.",
	icon_state: "griffin_wings",
	item_state: "griffin_wings",
});
rt.type(7865, "/obj/item/clothing/suit/det_suit/grey", "/obj/item/clothing/suit/det_suit", {
	name: "noir trenchcoat",
	desc: "A hard-boiled private investigator's grey trenchcoat.",
	icon_state: "greydet",
	item_state: "greydet",
});
rt.type(7877, "/obj/item/clothing/suit/pirate/captain", "/obj/item/clothing/suit/pirate", {
	name: "pirate captain coat",
	desc: "Yarr.",
	icon_state: "hgpirate",
	item_state: "hgpirate",
});
rt.type(7900, "/obj/item/clothing/suit/jacket/leather/overcoat", "/obj/item/clothing/suit/jacket/leather", {
	name: "leather overcoat",
	desc: "That's a damn fine coat.",
	icon_state: "leathercoat",
	body_parts_covered: 414,
	cold_protection: 414,
});
rt.type(7904, "/obj/item/clothing/suit/jacket/letterman", "/obj/item/clothing/suit/jacket", {
	name: "letterman jacket",
	desc: "A classic brown letterman jacket. Looks pretty hot and heavy.",
	icon_state: "letterman",
	item_state: "letterman",
});
rt.type(7905, "/obj/item/clothing/suit/jacket/letterman_red", "/obj/item/clothing/suit/jacket", {
	name: "red letterman jacket",
	desc: "A letterman jacket in a sick red color. Radical.",
	icon_state: "letterman_red",
	item_state: "letterman_red",
});
rt.type(7906, "/obj/item/clothing/suit/jacket/letterman_syndie", "/obj/item/clothing/suit/jacket", {
	name: "blood-red letterman jacket",
	desc: "Oddly, this jacket seems to have a large S on the back...",
	icon_state: "letterman_s",
	item_state: "letterman_s",
});
rt.type(7907, "/obj/item/clothing/suit/jacket/letterman_nanotrasen", "/obj/item/clothing/suit/jacket", {
	name: "blue letterman jacket",
	desc: "A blue letterman jacket with a proud Nanotrasen N on the back. The tag says that it was made in Space China.",
	icon_state: "letterman_n",
	item_state: "letterman_n",
});
rt.type(7911, "/obj/item/clothing/suit/fire/firefighter", "/obj/item/clothing/suit/fire", {
	icon_state: "firesuit",
	item_state: "firefighter",
});
rt.type(7912, "/obj/item/clothing/suit/fire/heavy", "/obj/item/clothing/suit/fire", {
	name: "heavy firesuit",
	desc: "An old, bulky thermal protection suit.",
	icon_state: "thermal",
	item_state: "ro_suit",
	slowdown: 1.5,
});
rt.type(7913, "/obj/item/clothing/suit/fire/atmos", "/obj/item/clothing/suit/fire", {
	name: "firesuit",
	desc: "An expensive firesuit that protects against even the most deadly of station fires. Designed to protect even if the wearer is set aflame.",
	icon_state: "atmos_firesuit",
	item_state: "firesuit_atmos",
	max_heat_protection_temperature: 35000,
});
rt.type(7918, "/obj/item/clothing/suit/wizrobe/red", "/obj/item/clothing/suit/wizrobe", {
	name: "red wizard robe",
	desc: "A magnificent red gem-lined robe that seems to radiate power.",
	icon_state: "redwizard",
	item_state: "redwizrobe",
});
rt.type(7919, "/obj/item/clothing/suit/wizrobe/yellow", "/obj/item/clothing/suit/wizrobe", {
	name: "yellow wizard robe",
	desc: "A magnificant yellow gem-lined robe that seems to radiate power.",
	icon_state: "yellowwizard",
	item_state: "yellowwizrobe",
});
rt.type(7920, "/obj/item/clothing/suit/wizrobe/black", "/obj/item/clothing/suit/wizrobe", {
	name: "black wizard robe",
	desc: "An unnerving black gem-lined robe that reeks of death and decay.",
	icon_state: "blackwizard",
	item_state: "blackwizrobe",
});
rt.type(7921, "/obj/item/clothing/suit/wizrobe/marisa", "/obj/item/clothing/suit/wizrobe", {
	name: "witch robe",
	desc: "Magic is all about the spell power, ZE!",
	icon_state: "marisa",
	item_state: "marisarobe",
});
rt.type(7923, "/obj/item/clothing/suit/wizrobe/magusblue", "/obj/item/clothing/suit/wizrobe", {
	name: "１Magus robe",
	desc: "A set of armored robes that seem to radiate a dark power.",
	icon_state: "magusblue",
	item_state: "magusblue",
});
rt.type(7924, "/obj/item/clothing/suit/wizrobe/magusred", "/obj/item/clothing/suit/wizrobe", {
	name: "１Magus robe",
	desc: "A set of armored robes that seem to radiate a dark power.",
	icon_state: "magusred",
	item_state: "magusred",
});
rt.type(7925, "/obj/item/clothing/suit/wizrobe/santa", "/obj/item/clothing/suit/wizrobe", {
	name: "Santa's suit",
	desc: "Festive!",
	icon_state: "santa",
	item_state: "santa",
});
rt.type(8032, "/obj/item/clothing/head/hooded/cloakhood", "/obj/item/clothing/head/hooded", {});
rt.type(8035, "/obj/item/clothing/head/hooded/chaplain_hood", "/obj/item/clothing/head/hooded", {
	name: "chaplain hood",
	desc: "For protecting your identity when immolating demons.",
	icon_state: "chaplain_hood",
	body_parts_covered: 1,
	flags_inv: 416,
});
rt.type(8036, "/obj/item/clothing/head/hooded/carp_hood", "/obj/item/clothing/head/hooded", {
	name: "carp hood",
	desc: "A hood attached to a carp costume.",
	icon_state: "carp_casual",
	body_parts_covered: 1,
	cold_protection: 1,
	min_cold_protection_temperature: 60,
	flags_inv: 288,
});
rt.type(8037, "/obj/item/clothing/head/hooded/ian_hood", "/obj/item/clothing/head/hooded", {
	name: "corgi hood",
	desc: "A hood that looks just like a corgi's head, it won't guarantee dog biscuits.",
	icon_state: "ian",
	body_parts_covered: 1,
	flags_inv: 288,
});
rt.type(8038, "/obj/item/clothing/head/hooded/bee_hood", "/obj/item/clothing/head/hooded", {
	flags: 8192,
	name: "bee hood",
	desc: "A hood attached to a bee costume.",
	icon_state: "bee",
	body_parts_covered: 1,
	flags_inv: 288,
});
rt.type(8039, "/obj/item/clothing/head/hooded/human_head", "/obj/item/clothing/head/hooded", {
	name: "bloated human head",
	desc: "A horribly bloated and mismatched human head.",
	icon_state: "lingspacehelmet",
	body_parts_covered: 1,
	flags_cover: 4,
	flags_inv: 1008,
});
rt.type(8040, "/obj/item/clothing/head/hooded/winterhood", "/obj/item/clothing/head/hooded", {
	name: "winter hood",
	desc: "A hood attached to a heavy winter jacket.",
	icon_state: "winterhood",
	body_parts_covered: 1,
	cold_protection: 1,
	min_cold_protection_temperature: 60,
	flags_inv: 288,
});
rt.type(8041, "/obj/item/clothing/head/hooded/winterhood/captain", "/obj/item/clothing/head/hooded/winterhood", {
	icon_state: "winterhood_captain",
});
rt.type(8042, "/obj/item/clothing/head/hooded/winterhood/security", "/obj/item/clothing/head/hooded/winterhood", {
	icon_state: "winterhood_security",
});
rt.type(8043, "/obj/item/clothing/head/hooded/winterhood/medical", "/obj/item/clothing/head/hooded/winterhood", {
	icon_state: "winterhood_medical",
});
rt.type(8044, "/obj/item/clothing/head/hooded/winterhood/science", "/obj/item/clothing/head/hooded/winterhood", {
	icon_state: "winterhood_science",
});
rt.type(8045, "/obj/item/clothing/head/hooded/winterhood/engineering", "/obj/item/clothing/head/hooded/winterhood", {
	icon_state: "winterhood_engineer",
});
rt.type(8046, "/obj/item/clothing/head/hooded/winterhood/engineering/atmos", "/obj/item/clothing/head/hooded/winterhood/engineering", {
	icon_state: "winterhood_atmos",
});
rt.type(8047, "/obj/item/clothing/head/hooded/winterhood/hydro", "/obj/item/clothing/head/hooded/winterhood", {
	icon_state: "winterhood_hydro",
});
rt.type(8048, "/obj/item/clothing/head/hooded/winterhood/cargo", "/obj/item/clothing/head/hooded/winterhood", {
	icon_state: "winterhood_cargo",
});
rt.type(8049, "/obj/item/clothing/head/hooded/winterhood/miner", "/obj/item/clothing/head/hooded/winterhood", {
	icon_state: "winterhood_miner",
});
rt.type(8179, "/obj/item/clothing/head/bio_hood/general", "/obj/item/clothing/head/bio_hood", {
	icon_state: "bio_general",
});
rt.type(8180, "/obj/item/clothing/head/bio_hood/virology", "/obj/item/clothing/head/bio_hood", {
	icon_state: "bio_virology",
});
rt.type(8182, "/obj/item/clothing/head/bio_hood/janitor", "/obj/item/clothing/head/bio_hood", {
	icon_state: "bio_janitor",
});
rt.type(8183, "/obj/item/clothing/head/bio_hood/scientist", "/obj/item/clothing/head/bio_hood", {
	icon_state: "bio_scientist",
});
rt.type(8184, "/obj/item/clothing/head/bio_hood/cmo", "/obj/item/clothing/head/bio_hood", {
	icon_state: "bio_cmo",
});
rt.type(8187, "/obj/item/clothing/head/bomb_hood/security", "/obj/item/clothing/head/bomb_hood", {
	icon_state: "bombsuitsec",
	item_state: "bombsuitsec",
});
rt.type(8190, "/obj/item/clothing/head/wizard/red", "/obj/item/clothing/head/wizard", {
	name: "red wizard hat",
	desc: "Strange-looking red hat-wear that most certainly belongs to a real magic user.",
	icon_state: "redwizard",
	dog_fashion: rt.typePath("/datum/dog_fashion/head/red_wizard"),
});
rt.type(8191, "/obj/item/clothing/head/wizard/yellow", "/obj/item/clothing/head/wizard", {
	name: "yellow wizard hat",
	desc: "Strange-looking yellow hat-wear that most certainly belongs to a powerful magic user.",
	icon_state: "yellowwizard",
	dog_fashion: null,
});
rt.type(8192, "/obj/item/clothing/head/wizard/black", "/obj/item/clothing/head/wizard", {
	name: "black wizard hat",
	desc: "Strange-looking black hat-wear that most certainly belongs to a real skeleton. Spooky.",
	icon_state: "blackwizard",
	dog_fashion: null,
});
rt.type(8194, "/obj/item/clothing/head/wizard/marisa", "/obj/item/clothing/head/wizard", {
	name: "witch hat",
	desc: "Strange-looking hat-wear. Makes you want to cast fireballs.",
	icon_state: "marisa",
	dog_fashion: null,
});
rt.type(8196, "/obj/item/clothing/head/wizard/magus", "/obj/item/clothing/head/wizard", {
	name: "１Magus helm",
	desc: "A mysterious helmet that hums with an unearthly power.",
	icon_state: "magus",
	item_state: "magus",
	dog_fashion: null,
});
rt.type(8197, "/obj/item/clothing/head/wizard/santa", "/obj/item/clothing/head/wizard", {
	name: "Santa's hat",
	desc: "Ho ho ho. Merrry X-mas!",
	icon_state: "santahat",
	flags_inv: 768,
	dog_fashion: null,
});
rt.type(8619, "/obj/item/clothing/neck/cloak/hos", "/obj/item/clothing/neck/cloak", {
	name: "head of security's cloak",
	desc: "Worn by Securistan, ruling the station with an iron fist. It's slightly armored.",
	icon_state: "hoscloak",
});
rt.type(8620, "/obj/item/clothing/neck/cloak/qm", "/obj/item/clothing/neck/cloak", {
	name: "quartermaster's cloak",
	desc: "Worn by Cargonia, supplying the station with the necessary tools for survival.",
});
rt.type(8621, "/obj/item/clothing/neck/cloak/cmo", "/obj/item/clothing/neck/cloak", {
	name: "chief medical officer's cloak",
	desc: "Worn by Meditopia, the valiant men and women keeping pestilence at bay. It's slightly shielded from contaminants.",
	icon_state: "cmocloak",
});
rt.type(8622, "/obj/item/clothing/neck/cloak/ce", "/obj/item/clothing/neck/cloak", {
	name: "chief engineer's cloak",
	desc: "Worn by Engitopia, wielders of an unlimited power. It's slightly shielded against radiation.",
	icon_state: "cecloak",
});
rt.type(8623, "/obj/item/clothing/neck/cloak/rd", "/obj/item/clothing/neck/cloak", {
	name: "research director's cloak",
	desc: "Worn by Sciencia, thaumaturges and researchers of the universe. It's slightly shielded from contaminants.",
	icon_state: "rdcloak",
});
rt.type(8624, "/obj/item/clothing/neck/cloak/cap", "/obj/item/clothing/neck/cloak", {
	name: "captain's cloak",
	desc: "Worn by the commander of Space Station 13.",
	icon_state: "capcloak",
});
rt.type(8625, "/obj/item/clothing/neck/cloak/hop", "/obj/item/clothing/neck/cloak", {
	name: "head of personnel's cloak",
	desc: "Worn by the Head of Personnel. It smells faintly of bureaucracy.",
	icon_state: "hopcloak",
});
