// Types declared in code/modules/clothing that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(7662, "/obj/item/clothing/gloves/gang", "/obj/item/clothing/gloves", {
	name: "braggadocio's brass knuckles",
	desc: "Purely decorative, don't find out the hard way.",
	icon_state: "knuckles",
	w_class: 3,
});
rt.type(7689, "/obj/item/clothing/gloves/plate", "/obj/item/clothing/gloves", {
	name: "Plate Gauntlets",
	icon_state: "crusader",
	desc: "They're like gloves, but made of metal.",
	siemens_coefficient: 0,
	cold_protection: 1536,
	min_cold_protection_temperature: 2,
	heat_protection: 1536,
	max_heat_protection_temperature: 1500,
});
rt.type(7690, "/obj/item/clothing/gloves/plate/red", "/obj/item/clothing/gloves/plate", {
	icon_state: "crusader-red",
});
rt.type(7691, "/obj/item/clothing/gloves/plate/blue", "/obj/item/clothing/gloves/plate", {
	icon_state: "crusader-blue",
});
rt.type(7693, "/obj/item/clothing/gloves/fingerless", "/obj/item/clothing/gloves", {
	transfer_prints: 1,
	name: "fingerless gloves",
	desc: "Plain black gloves without fingertips for the hard working.",
	icon_state: "fingerless",
	item_state: "fingerless",
	item_color: null,
	strip_delay: 40,
	equip_delay_other: 20,
	cold_protection: 1536,
	min_cold_protection_temperature: 2,
});
rt.type(7698, "/obj/item/clothing/gloves/golem", "/obj/item/clothing/gloves", {
	flags: 130,
	name: "golem's hands",
	desc: "strong adamantine hands",
	icon_state: "golem",
	item_state: null,
	siemens_coefficient: 0,
	resistance_flags: 51,
});
rt.type(7761, "/obj/item/clothing/suit/space/orange", "/obj/item/clothing/suit/space", {
	name: "emergency space suit",
	icon_state: "syndicate-orange",
	item_state: "syndicate-orange",
	slowdown: 3,
});
rt.type(7867, "/obj/item/clothing/suit/suspenders", "/obj/item/clothing/suit", {
	blood_overlay_type: "armor",
	name: "suspenders",
	desc: "They suspend the illusion of the mime's play.",
	icon: rt.rsc("icons/obj/clothing/belts.dmi"),
	icon_state: "suspenders",
});
rt.type(7868, "/obj/item/clothing/suit/security", "/obj/item/clothing/suit", {});
rt.type(7869, "/obj/item/clothing/suit/security/officer", "/obj/item/clothing/suit/security", {
	name: "security officer's jacket",
	desc: "This jacket is for those special occasions when a security officer isn't required to wear their armor.",
	icon_state: "officerbluejacket",
	item_state: "officerbluejacket",
	body_parts_covered: 386,
});
rt.type(7870, "/obj/item/clothing/suit/security/officer/russian", "/obj/item/clothing/suit/security/officer", {
	name: "russian officer's jacket",
	desc: "This jacket is for those special occasions when a russian officer isn't required to wear their armor.",
	icon_state: "officertanjacket",
	item_state: "officertanjacket",
	body_parts_covered: 386,
});
rt.type(7871, "/obj/item/clothing/suit/security/warden", "/obj/item/clothing/suit/security", {
	name: "warden's jacket",
	desc: "Perfectly suited for the warden that wants to leave an impression of style on those who visit the brig.",
	icon_state: "wardenbluejacket",
	item_state: "wardenbluejacket",
	body_parts_covered: 386,
});
rt.type(7872, "/obj/item/clothing/suit/security/hos", "/obj/item/clothing/suit/security", {
	name: "head of security's jacket",
	desc: "This piece of clothing was specifically designed for asserting superior authority.",
	icon_state: "hosbluejacket",
	item_state: "hosbluejacket",
	body_parts_covered: 386,
});
rt.type(7878, "/obj/item/clothing/suit/cyborg_suit", "/obj/item/clothing/suit", {
	flags: 64,
	fire_resist: 5473.15,
	name: "cyborg suit",
	desc: "Suit for a cyborg costume.",
	icon_state: "death",
	item_state: "death",
	flags_inv: 13,
});
rt.type(7879, "/obj/item/clothing/suit/justice", "/obj/item/clothing/suit", {
	name: "justice suit",
	desc: "this pretty much looks ridiculous",
	icon_state: "justice",
	item_state: "justice",
	flags_inv: 13,
});
rt.type(7882, "/obj/item/clothing/suit/hastur", "/obj/item/clothing/suit", {
	name: "１Hastur's robe",
	desc: "Robes not meant to be worn by man.",
	icon_state: "hastur",
	item_state: "hastur",
	body_parts_covered: 414,
	flags_inv: 13,
});
rt.type(7884, "/obj/item/clothing/suit/chickensuit", "/obj/item/clothing/suit", {
	name: "chicken suit",
	desc: "A suit made long ago by the ancient empire KFC.",
	icon_state: "chickensuit",
	item_state: "chickensuit",
	body_parts_covered: 510,
	flags_inv: 12,
});
rt.type(7885, "/obj/item/clothing/suit/monkeysuit", "/obj/item/clothing/suit", {
	name: "monkey suit",
	desc: "A suit that looks like a primate.",
	icon_state: "monkeysuit",
	item_state: "monkeysuit",
	body_parts_covered: 2046,
	flags_inv: 13,
});
rt.type(7888, "/obj/item/clothing/suit/snowman", "/obj/item/clothing/suit", {
	name: "snowman outfit",
	desc: "Two white spheres covered in white glitter. 'Tis the season.",
	icon_state: "snowman",
	item_state: "snowman",
	body_parts_covered: 6,
	flags_inv: 4,
});
rt.type(7889, "/obj/item/clothing/suit/poncho", "/obj/item/clothing/suit", {
	name: "poncho",
	desc: "Your classic, non-racist poncho.",
	icon_state: "classicponcho",
	item_state: "classicponcho",
});
rt.type(7890, "/obj/item/clothing/suit/poncho/green", "/obj/item/clothing/suit/poncho", {
	name: "green poncho",
	desc: "Your classic, non-racist poncho. This one is green.",
	icon_state: "greenponcho",
	item_state: "greenponcho",
});
rt.type(7891, "/obj/item/clothing/suit/poncho/red", "/obj/item/clothing/suit/poncho", {
	name: "red poncho",
	desc: "Your classic, non-racist poncho. This one is red.",
	icon_state: "redponcho",
	item_state: "redponcho",
});
rt.type(7892, "/obj/item/clothing/suit/poncho/ponchoshame", "/obj/item/clothing/suit/poncho", {
	flags: 2,
	name: "poncho of shame",
	desc: "Forced to live on your shameful acting as a fake Mexican, you and your poncho have grown inseperable. Literally.",
	icon_state: "ponchoshame",
	item_state: "ponchoshame",
});
rt.type(7893, "/obj/item/clothing/suit/whitedress", "/obj/item/clothing/suit", {
	name: "white dress",
	desc: "A fancy white dress.",
	icon_state: "white_dress",
	item_state: "w_suit",
	body_parts_covered: 126,
	flags_inv: 12,
});
rt.type(7894, "/obj/item/clothing/suit/straight_jacket", "/obj/item/clothing/suit", {
	name: "straight jacket",
	desc: "A suit that completely restrains the wearer. Manufactured by Antyphun Corp.",
	icon_state: "straight_jacket",
	item_state: "straight_jacket",
	body_parts_covered: 1950,
	flags_inv: 13,
	equip_delay_self: 50,
	strip_delay: 60,
	breakouttime: 3000,
});
rt.type(7895, "/obj/item/clothing/suit/ianshirt", "/obj/item/clothing/suit", {
	name: "worn shirt",
	desc: "A worn out, curiously comfortable t-shirt with a picture of Ian. You wouldn't go so far as to say it feels like being hugged when you wear it, but it's pretty close. Good for sleeping in.",
	icon_state: "ianshirt",
	item_state: "ianshirt",
});
rt.type(7896, "/obj/item/clothing/suit/nerdshirt", "/obj/item/clothing/suit", {
	name: "gamer shirt",
	desc: "A baggy shirt with vintage game character Phanic the Weasel. Why would anyone wear this?",
	icon_state: "nerdshirt",
	item_state: "nerdshirt",
});
rt.type(7897, "/obj/item/clothing/suit/vapeshirt", "/obj/item/clothing/suit", {
	name: "Vape Naysh shirt",
	desc: "A cheap white T-shirt with a big tacky \"VN\" on the front, Why would you wear this unironically?",
	icon_state: "vapeshirt",
	item_state: "vapeshirt",
});
rt.type(7928, "/obj/item/clothing/suit/bunnysuit", "/obj/item/clothing/suit", {
	name: "Easter Bunny Suit",
	desc: "Hop Hop Hop!",
	icon_state: "bunnysuit",
	item_state: "bunnysuit",
	slowdown: -1,
	body_parts_covered: 414,
	flags_inv: 13,
});
rt.type(7929, "/obj/item/clothing/suit/beekeeper_suit", "/obj/item/clothing/suit", {
	flags: 8192,
	name: "beekeeper suit",
	desc: "Keeps the lil buzzing buggers away from your squishy bits.",
	icon_state: "beekeeper",
	item_state: "beekeeper",
});
rt.type(7930, "/obj/item/clothing/suit/golem", "/obj/item/clothing/suit", {
	flags: 130,
	name: "adamantine shell",
	desc: "a golem's thick outter shell",
	icon_state: "golem",
	item_state: "golem",
	w_class: 4,
	gas_transfer_coefficient: 0.9,
	permeability_coefficient: 0.5,
	body_parts_covered: 4095,
	flags_inv: 13,
	resistance_flags: 51,
});
rt.type(7971, "/obj/item/clothing/head/helmet/space/nasavoid", "/obj/item/clothing/head/helmet/space", {
	name: "NASA Void Helmet",
	desc: "An old, NASA Centcom branch designed, dark red space suit helmet.",
	icon_state: "void",
	item_state: "void",
});
rt.type(7972, "/obj/item/clothing/head/helmet/space/nasavoid/old", "/obj/item/clothing/head/helmet/space/nasavoid", {
	name: "Engineering Void Helmet",
	desc: "A Centcom engineering dark red space suit helmet. While old and dusty, it still gets the job done.",
	icon_state: "void",
	item_state: "void",
});
rt.type(7973, "/obj/item/clothing/head/helmet/space/santahat", "/obj/item/clothing/head/helmet/space", {
	flags: 1,
	name: "Santa's hat",
	desc: "Ho ho ho. Merrry X-mas!",
	icon_state: "santahat",
	flags_cover: 4,
	dog_fashion: rt.typePath("/datum/dog_fashion/head/santa"),
});
rt.type(7992, "/obj/item/clothing/head/helmet/space/orange", "/obj/item/clothing/head/helmet/space", {
	name: "emergency space helmet",
	icon_state: "syndicate-helm-orange",
	item_state: "syndicate-helm-orange",
});
rt.type(8051, "/obj/item/clothing/head/collectable", "/obj/item/clothing/head", {
	name: "collectable hat",
	desc: "A rare collectable hat.",
});
rt.type(8052, "/obj/item/clothing/head/collectable/petehat", "/obj/item/clothing/head/collectable", {
	name: "ultra rare Pete's hat!",
	desc: "It smells faintly of plasma.",
	icon_state: "petehat",
});
rt.type(8053, "/obj/item/clothing/head/collectable/petehat/gang", "/obj/item/clothing/head/collectable/petehat", {
	name: "pimpin' hat",
	desc: "The undisputed king of style.",
});
rt.type(8054, "/obj/item/clothing/head/collectable/slime", "/obj/item/clothing/head/collectable", {
	name: "collectable slime hat",
	desc: "Just like a real brain slug!",
	icon_state: "headslime",
	item_state: "headslime",
});
rt.type(8055, "/obj/item/clothing/head/collectable/xenom", "/obj/item/clothing/head/collectable", {
	name: "collectable xenomorph helmet!",
	desc: "Hiss hiss hiss!",
	icon_state: "xenom",
});
rt.type(8056, "/obj/item/clothing/head/collectable/chef", "/obj/item/clothing/head/collectable", {
	name: "collectable chef's hat",
	desc: "A rare chef's hat meant for hat collectors!",
	icon_state: "chef",
	item_state: "chef",
	dog_fashion: rt.typePath("/datum/dog_fashion/head/chef"),
});
rt.type(8057, "/obj/item/clothing/head/collectable/paper", "/obj/item/clothing/head/collectable", {
	name: "collectable paper hat",
	desc: "What looks like an ordinary paper hat is actually a rare and valuable collector's edition paper hat. Keep away from water, fire, and Curators.",
	icon_state: "paper",
	dog_fashion: rt.typePath("/datum/dog_fashion/head"),
});
rt.type(8058, "/obj/item/clothing/head/collectable/tophat", "/obj/item/clothing/head/collectable", {
	name: "collectable top hat",
	desc: "A top hat worn by only the most prestigious hat collectors.",
	icon_state: "tophat",
	item_state: "that",
});
rt.type(8059, "/obj/item/clothing/head/collectable/captain", "/obj/item/clothing/head/collectable", {
	name: "collectable captain's hat",
	desc: "A collectable hat that'll make you look just like a real comdom!",
	icon_state: "captain",
	item_state: "caphat",
	dog_fashion: rt.typePath("/datum/dog_fashion/head/captain"),
});
rt.type(8060, "/obj/item/clothing/head/collectable/police", "/obj/item/clothing/head/collectable", {
	name: "collectable police officer's hat",
	desc: "A collectable police officer's Hat. This hat emphasizes that you are THE LAW.",
	icon_state: "policehelm",
	dog_fashion: rt.typePath("/datum/dog_fashion/head/warden"),
});
rt.type(8061, "/obj/item/clothing/head/collectable/beret", "/obj/item/clothing/head/collectable", {
	name: "collectable beret",
	desc: "A collectable red beret. It smells faintly of garlic.",
	icon_state: "beret",
	dog_fashion: rt.typePath("/datum/dog_fashion/head/beret"),
});
rt.type(8062, "/obj/item/clothing/head/collectable/welding", "/obj/item/clothing/head/collectable", {
	name: "collectable welding helmet",
	desc: "A collectable welding helmet. Now with 80% less lead! Not for actual welding. Any welding done while wearing this helmet is done so at the owner's own risk!",
	icon_state: "welding",
	item_state: "welding",
	resistance_flags: 0,
});
rt.type(8063, "/obj/item/clothing/head/collectable/flatcap", "/obj/item/clothing/head/collectable", {
	name: "collectable flat cap",
	desc: "A collectible farmer's flat cap!",
	icon_state: "flat_cap",
	item_state: "detective",
});
rt.type(8064, "/obj/item/clothing/head/collectable/pirate", "/obj/item/clothing/head/collectable", {
	name: "collectable pirate hat",
	desc: "You'd make a great Dread Syndie Roberts!",
	icon_state: "pirate",
	item_state: "pirate",
	dog_fashion: rt.typePath("/datum/dog_fashion/head/pirate"),
});
rt.type(8065, "/obj/item/clothing/head/collectable/kitty", "/obj/item/clothing/head/collectable", {
	name: "collectable kitty ears",
	desc: "The fur feels... a bit too realistic.",
	icon_state: "kitty",
	item_state: "kitty",
	dog_fashion: rt.typePath("/datum/dog_fashion/head/kitty"),
});
rt.type(8066, "/obj/item/clothing/head/collectable/rabbitears", "/obj/item/clothing/head/collectable", {
	name: "collectable rabbit ears",
	desc: "Not as lucky as the feet!",
	icon_state: "bunny",
	item_state: "bunny",
	dog_fashion: rt.typePath("/datum/dog_fashion/head/rabbit"),
});
rt.type(8067, "/obj/item/clothing/head/collectable/wizard", "/obj/item/clothing/head/collectable", {
	name: "collectable wizard's hat",
	desc: "NOTE: Any magical powers gained from wearing this hat are purely coincidental.",
	icon_state: "wizard",
	dog_fashion: rt.typePath("/datum/dog_fashion/head/blue_wizard"),
});
rt.type(8068, "/obj/item/clothing/head/collectable/hardhat", "/obj/item/clothing/head/collectable", {
	name: "collectable hard hat",
	desc: "WARNING! Offers no real protection, or luminosity, but damn, is it fancy!",
	icon_state: "hardhat0_yellow",
	item_state: "hardhat0_yellow",
	dog_fashion: rt.typePath("/datum/dog_fashion/head"),
});
rt.type(8069, "/obj/item/clothing/head/collectable/HoS", "/obj/item/clothing/head/collectable", {
	name: "collectable HoS hat",
	desc: "Now you too can beat prisoners, set silly sentences, and arrest for no reason!",
	icon_state: "hoscap",
});
rt.type(8070, "/obj/item/clothing/head/collectable/HoP", "/obj/item/clothing/head/collectable", {
	name: "collectable HoP hat",
	desc: "It's your turn to demand excessive paperwork, signatures, stamps, and hire more clowns! Papers, please!",
	icon_state: "hopcap",
	dog_fashion: rt.typePath("/datum/dog_fashion/head/hop"),
});
rt.type(8071, "/obj/item/clothing/head/collectable/thunderdome", "/obj/item/clothing/head/collectable", {
	name: "collectable Thunderdome helmet",
	desc: "Go Red! I mean Green! I mean Red! No Green!",
	icon_state: "thunderdome",
	item_state: "thunderdome",
	resistance_flags: 0,
});
rt.type(8072, "/obj/item/clothing/head/collectable/swat", "/obj/item/clothing/head/collectable", {
	name: "collectable SWAT helmet",
	desc: "That's not real blood. That's red paint.",
	icon_state: "swat",
	item_state: "swat",
	resistance_flags: 0,
});
rt.type(8088, "/obj/item/clothing/head/beanie", "/obj/item/clothing/head", {
	name: "white beanie",
	desc: "A stylish beanie. The perfect winter accessory for those with a keen fashion sense, and those who just can't handle a cold breeze on their heads.",
	icon_state: "beanie",
	item_color: "beanie",
});
rt.type(8089, "/obj/item/clothing/head/beanie/black", "/obj/item/clothing/head/beanie", {
	name: "black beanie",
	icon_state: "beanie",
	color: "#4A4A4B",
});
rt.type(8090, "/obj/item/clothing/head/beanie/red", "/obj/item/clothing/head/beanie", {
	name: "red beanie",
	icon_state: "beanie",
	color: "#D91414",
});
rt.type(8091, "/obj/item/clothing/head/beanie/green", "/obj/item/clothing/head/beanie", {
	name: "green beanie",
	icon_state: "beanie",
	color: "#5C9E54",
});
rt.type(8092, "/obj/item/clothing/head/beanie/darkblue", "/obj/item/clothing/head/beanie", {
	name: "dark blue beanie",
	icon_state: "beanie",
	color: "#1E85BC",
});
rt.type(8093, "/obj/item/clothing/head/beanie/purple", "/obj/item/clothing/head/beanie", {
	name: "purple beanie",
	icon_state: "beanie",
	color: "#9557C5",
});
rt.type(8094, "/obj/item/clothing/head/beanie/yellow", "/obj/item/clothing/head/beanie", {
	name: "yellow beanie",
	icon_state: "beanie",
	color: "#E0C14F",
});
rt.type(8095, "/obj/item/clothing/head/beanie/orange", "/obj/item/clothing/head/beanie", {
	name: "orange beanie",
	icon_state: "beanie",
	color: "#C67A4B",
});
rt.type(8096, "/obj/item/clothing/head/beanie/cyan", "/obj/item/clothing/head/beanie", {
	name: "cyan beanie",
	icon_state: "beanie",
	color: "#54A3CE",
});
rt.type(8097, "/obj/item/clothing/head/beanie/christmas", "/obj/item/clothing/head/beanie", {
	name: "christmas beanie",
	icon_state: "beaniechristmas",
	item_color: "beaniechristmas",
});
rt.type(8098, "/obj/item/clothing/head/beanie/striped", "/obj/item/clothing/head/beanie", {
	name: "striped beanie",
	icon_state: "beaniestriped",
	item_color: "beaniestriped",
});
rt.type(8099, "/obj/item/clothing/head/beanie/stripedred", "/obj/item/clothing/head/beanie", {
	name: "red striped beanie",
	icon_state: "beaniestripedred",
	item_color: "beaniestripedred",
});
rt.type(8100, "/obj/item/clothing/head/beanie/stripedblue", "/obj/item/clothing/head/beanie", {
	name: "blue striped beanie",
	icon_state: "beaniestripedblue",
	item_color: "beaniestripedblue",
});
rt.type(8101, "/obj/item/clothing/head/beanie/stripedgreen", "/obj/item/clothing/head/beanie", {
	name: "green striped beanie",
	icon_state: "beaniestripedgreen",
	item_color: "beaniestripedgreen",
});
rt.type(8115, "/obj/item/clothing/head/nun_hood", "/obj/item/clothing/head", {
	name: "nun hood",
	desc: "Maximum piety in this star system.",
	icon_state: "nun_hood",
	flags_inv: 256,
	flags_cover: 4,
});
rt.type(8116, "/obj/item/clothing/head/cage", "/obj/item/clothing/head", {
	name: "cage",
	desc: "A cage that restrains the will of the self, allowing one to see the profane world for what it is.",
	alternate_worn_icon: rt.rsc("icons/mob/large-worn-icons/64x64/head.dmi"),
	icon_state: "cage",
	item_state: "cage",
	worn_x_dimension: 64,
	worn_y_dimension: 64,
});
rt.type(8117, "/obj/item/clothing/head/witchunter_hat", "/obj/item/clothing/head", {
	name: "witchunter hat",
	desc: "This hat saw much use back in the day.",
	icon_state: "witchhunterhat",
	item_state: "witchhunterhat",
	flags_cover: 4,
});
rt.type(8121, "/obj/item/clothing/head/beret", "/obj/item/clothing/head", {
	name: "beret",
	desc: "A beret, a mime's favorite headwear.",
	icon_state: "beret",
	dog_fashion: rt.typePath("/datum/dog_fashion/head/beret"),
});
rt.type(8122, "/obj/item/clothing/head/beret/black", "/obj/item/clothing/head/beret", {
	name: "black beret",
	desc: "A black beret, perfect for war veterans and dark, brooding, anti-hero mimes.",
	icon_state: "beretblack",
});
rt.type(8123, "/obj/item/clothing/head/beret/highlander", "/obj/item/clothing/head/beret", {
	flags: 2,
	desc: "That was white fabric. <i>Was.</i>",
	dog_fashion: null,
});
rt.type(8134, "/obj/item/clothing/head/powdered_wig", "/obj/item/clothing/head", {
	name: "powdered wig",
	desc: "A powdered wig.",
	icon_state: "pwig",
	item_state: "pwig",
});
rt.type(8135, "/obj/item/clothing/head/that", "/obj/item/clothing/head", {
	name: "top-hat",
	desc: "It's an amish looking hat.",
	icon_state: "tophat",
	item_state: "that",
	dog_fashion: rt.typePath("/datum/dog_fashion/head"),
	throwforce: 1,
});
rt.type(8136, "/obj/item/clothing/head/canada", "/obj/item/clothing/head", {
	name: "striped red tophat",
	desc: "it smells like fresh donut holes / <i>il sent comme des trous de beignets frais</i>",
	icon_state: "canada",
	item_state: "canada",
});
rt.type(8137, "/obj/item/clothing/head/redcoat", "/obj/item/clothing/head", {
	name: "redcoat's hat",
	icon_state: "redcoat",
	desc: "<i>'I guess it's a redhead.'</i>",
});
rt.type(8138, "/obj/item/clothing/head/mailman", "/obj/item/clothing/head", {
	name: "mailman's hat",
	icon_state: "mailman",
	desc: "<i>'Right-on-time'</i> mail service head wear.",
});
rt.type(8139, "/obj/item/clothing/head/plaguedoctorhat", "/obj/item/clothing/head", {
	name: "plague doctor's hat",
	desc: "These were once used by plague doctors. They're pretty much useless.",
	icon_state: "plaguedoctor",
	permeability_coefficient: 0.01,
});
rt.type(8140, "/obj/item/clothing/head/hasturhood", "/obj/item/clothing/head", {
	name: "hastur's hood",
	desc: "It's <i>unspeakably</i> stylish.",
	icon_state: "hasturhood",
	flags_inv: 256,
	flags_cover: 4,
});
rt.type(8141, "/obj/item/clothing/head/nursehat", "/obj/item/clothing/head", {
	name: "nurse's hat",
	desc: "It allows quick identification of trained medical personnel.",
	icon_state: "nursehat",
	dog_fashion: rt.typePath("/datum/dog_fashion/head/nurse"),
});
rt.type(8142, "/obj/item/clothing/head/syndicatefake", "/obj/item/clothing/head", {
	name: "black space-helmet replica",
	icon_state: "syndicate-helm-black-red",
	item_state: "syndicate-helm-black-red",
	desc: "A plastic replica of a Syndicate agent's space helmet. You'll look just like a real murderous Syndicate agent in this! This is a toy, it is not made for use in space!",
	flags_inv: 1008,
});
rt.type(8143, "/obj/item/clothing/head/cueball", "/obj/item/clothing/head", {
	name: "cueball helmet",
	desc: "A large, featureless white orb meant to be worn on your head. How do you even see out of this thing?",
	icon_state: "cueball",
	item_state: "cueball",
	flags_cover: 20,
	flags_inv: 1008,
});
rt.type(8144, "/obj/item/clothing/head/snowman", "/obj/item/clothing/head", {
	name: "Snowman Head",
	desc: "A ball of white styrofoam. So festive.",
	icon_state: "snowman_h",
	item_state: "snowman_h",
	flags_cover: 4,
	flags_inv: 1008,
});
rt.type(8145, "/obj/item/clothing/head/justice", "/obj/item/clothing/head", {
	name: "justice hat",
	desc: "Fight for what's righteous!",
	icon_state: "justicered",
	item_state: "justicered",
	flags_inv: 992,
	flags_cover: 4,
});
rt.type(8146, "/obj/item/clothing/head/justice/blue", "/obj/item/clothing/head/justice", {
	icon_state: "justiceblue",
	item_state: "justiceblue",
});
rt.type(8147, "/obj/item/clothing/head/justice/yellow", "/obj/item/clothing/head/justice", {
	icon_state: "justiceyellow",
	item_state: "justiceyellow",
});
rt.type(8148, "/obj/item/clothing/head/justice/green", "/obj/item/clothing/head/justice", {
	icon_state: "justicegreen",
	item_state: "justicegreen",
});
rt.type(8149, "/obj/item/clothing/head/justice/pink", "/obj/item/clothing/head/justice", {
	icon_state: "justicepink",
	item_state: "justicepink",
});
rt.type(8150, "/obj/item/clothing/head/rabbitears", "/obj/item/clothing/head", {
	name: "rabbit ears",
	desc: "Wearing these makes you look useless, and only good for your sex appeal.",
	icon_state: "bunny",
	dog_fashion: rt.typePath("/datum/dog_fashion/head/rabbit"),
});
rt.type(8151, "/obj/item/clothing/head/flatcap", "/obj/item/clothing/head", {
	name: "flat cap",
	desc: "A working man's cap.",
	icon_state: "flat_cap",
	item_state: "detective",
});
rt.type(8152, "/obj/item/clothing/head/pirate", "/obj/item/clothing/head", {
	name: "pirate hat",
	desc: "Yarr.",
	icon_state: "pirate",
	item_state: "pirate",
	dog_fashion: rt.typePath("/datum/dog_fashion/head/pirate"),
});
rt.type(8153, "/obj/item/clothing/head/pirate/captain", "/obj/item/clothing/head/pirate", {
	icon_state: "hgpiratecap",
	item_state: "hgpiratecap",
});
rt.type(8154, "/obj/item/clothing/head/bandana", "/obj/item/clothing/head", {
	name: "pirate bandana",
	desc: "Yarr.",
	icon_state: "bandana",
	item_state: "bandana",
});
rt.type(8155, "/obj/item/clothing/head/bowler", "/obj/item/clothing/head", {
	name: "bowler-hat",
	desc: "Gentleman, elite aboard!",
	icon_state: "bowler",
	item_state: "bowler",
});
rt.type(8156, "/obj/item/clothing/head/witchwig", "/obj/item/clothing/head", {
	name: "witch costume wig",
	desc: "Eeeee~heheheheheheh!",
	icon_state: "witch",
	item_state: "witch",
	flags_inv: 256,
});
rt.type(8157, "/obj/item/clothing/head/chicken", "/obj/item/clothing/head", {
	name: "chicken suit head",
	desc: "Bkaw!",
	icon_state: "chickenhead",
	item_state: "chickensuit",
	flags_inv: 1008,
});
rt.type(8158, "/obj/item/clothing/head/griffin", "/obj/item/clothing/head", {
	name: "griffon head",
	desc: "Why not 'eagle head'? Who knows.",
	icon_state: "griffinhat",
	item_state: "griffinhat",
	flags_inv: 1008,
});
rt.type(8159, "/obj/item/clothing/head/bearpelt", "/obj/item/clothing/head", {
	name: "bear pelt hat",
	desc: "Fuzzy.",
	icon_state: "bearpelt",
	item_state: "bearpelt",
});
rt.type(8160, "/obj/item/clothing/head/xenos", "/obj/item/clothing/head", {
	name: "xenos helmet",
	icon_state: "xenos",
	item_state: "xenos_helm",
	desc: "A helmet made out of chitinous alien hide.",
	flags_inv: 1008,
});
rt.type(8161, "/obj/item/clothing/head/sombrero", "/obj/item/clothing/head", {
	name: "sombrero",
	icon_state: "sombrero",
	item_state: "sombrero",
	desc: "You can practically taste the fiesta.",
	flags_inv: 256,
	dog_fashion: rt.typePath("/datum/dog_fashion/head/sombrero"),
});
rt.type(8162, "/obj/item/clothing/head/sombrero/green", "/obj/item/clothing/head/sombrero", {
	name: "green sombrero",
	icon_state: "greensombrero",
	item_state: "greensombrero",
	desc: "As elegant as a dancing cactus.",
	flags_inv: 416,
	dog_fashion: null,
});
rt.type(8163, "/obj/item/clothing/head/sombrero/shamebrero", "/obj/item/clothing/head/sombrero", {
	flags: 2,
	name: "shamebrero",
	icon_state: "shamebrero",
	item_state: "shamebrero",
	desc: "Once it's on, it never comes off.",
	dog_fashion: null,
});
rt.type(8164, "/obj/item/clothing/head/cone", "/obj/item/clothing/head", {
	throw_speed: 2,
	throw_range: 5,
	desc: "This cone is trying to warn you of something!",
	name: "warning cone",
	icon: rt.rsc("icons/obj/janitor.dmi"),
	icon_state: "cone",
	item_state: "cone",
	force: 1,
	throwforce: 3,
	w_class: 2,
	attack_verb: null,
	resistance_flags: 0,
});
rt.type(8165, "/obj/item/clothing/head/santa", "/obj/item/clothing/head", {
	name: "santa hat",
	desc: "On the first day of christmas my employer gave to me!",
	icon_state: "santahatnorm",
	item_state: "that",
	cold_protection: 1,
	min_cold_protection_temperature: 60,
	dog_fashion: rt.typePath("/datum/dog_fashion/head/santa"),
});
rt.type(8166, "/obj/item/clothing/head/jester", "/obj/item/clothing/head", {
	name: "jester hat",
	desc: "A hat with bells, to add some merryness to the suit.",
	icon_state: "jester_hat",
});
rt.type(8167, "/obj/item/clothing/head/rice_hat", "/obj/item/clothing/head", {
	name: "rice hat",
	desc: "Welcome to the rice fields, motherfucker.",
	icon_state: "rice_hat",
});
rt.type(8168, "/obj/item/clothing/head/lizard", "/obj/item/clothing/head", {
	name: "lizardskin cloche hat",
	desc: "How many lizards died to make this hat? Not enough.",
	icon_state: "lizard",
});
rt.type(8169, "/obj/item/clothing/head/papersack", "/obj/item/clothing/head", {
	name: "paper sack hat",
	desc: "A paper sack with crude holes cut out for eyes. Useful for hiding one's identity or ugliness.",
	icon_state: "papersack",
	flags_inv: 416,
});
rt.type(8170, "/obj/item/clothing/head/papersack/smiley", "/obj/item/clothing/head/papersack", {
	name: "paper sack hat",
	desc: "A paper sack with crude holes cut out for eyes and a sketchy smile drawn on the front. Not creepy at all.",
	icon_state: "papersack_smile",
	flags_inv: 416,
});
rt.type(8185, "/obj/item/clothing/head/cloakhood", "/obj/item/clothing/head", {
	flags: 2,
	name: "cloak hood",
	icon: rt.rsc("icons/obj/clothing/hats.dmi"),
	icon_state: "golhood",
	desc: "A hood for a cloak",
	body_parts_covered: 1,
	flags_inv: 288,
});
rt.type(8199, "/obj/item/clothing/head/bunnyhead", "/obj/item/clothing/head", {
	name: "Easter Bunny Head",
	icon_state: "bunnyhead",
	item_state: "bunnyhead",
	desc: "Considerably more cute than 'Frank'",
	slowdown: -1,
	flags_inv: 1008,
});
rt.type(8200, "/obj/item/clothing/head/beekeeper_head", "/obj/item/clothing/head", {
	flags: 8192,
	name: "beekeeper hat",
	desc: "Keeps the lil buzzing buggers out of your eyes.",
	icon_state: "beekeeper",
	item_state: "beekeeper",
});
rt.type(8202, "/obj/item/clothing/head/space", "/obj/item/clothing/head", {});
rt.type(8203, "/obj/item/clothing/head/space/golem", "/obj/item/clothing/head/space", {
	flags: 130,
	icon_state: "golem",
	item_state: "dermal",
	item_color: "dermal",
	name: "golem's head",
	desc: "a golem's head",
	resistance_flags: 51,
});
rt.type(8208, "/obj/item/clothing/glasses/night", "/obj/item/clothing/glasses", {
	name: "night vision goggles",
	desc: "You can totally see in the dark now!",
	icon_state: "night",
	item_state: "glasses",
	origin_tech: "materials=4;magnets=4;plasmatech=4;engineering=4",
	darkness_view: 8,
	lighting_alpha: 128,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/green"),
});
rt.type(8210, "/obj/item/clothing/glasses/meson", "/obj/item/clothing/glasses", {
	name: "optical meson scanner",
	desc: "Used by engineering and mining staff to see basic structural and terrain layouts through walls, regardless of lighting conditions.",
	icon_state: "meson",
	item_state: "meson",
	origin_tech: "magnets=1;engineering=2",
	darkness_view: 2,
	vision_flags: 16,
	lighting_alpha: 192,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/lightgreen"),
});
rt.type(8211, "/obj/item/clothing/glasses/meson/truesight", "/obj/item/clothing/glasses/meson", {
	name: "The Lens of Truesight",
	desc: "I can see forever!",
	icon_state: "monocle",
	item_state: "headset",
});
rt.type(8214, "/obj/item/clothing/glasses/meson/night", "/obj/item/clothing/glasses/meson", {
	name: "night vision meson scanner",
	desc: "An optical meson scanner fitted with an amplified visible light spectrum overlay, providing greater visual clarity in darkness.",
	icon_state: "nvgmeson",
	item_state: "nvgmeson",
	origin_tech: "magnets=4;engineering=5;plasmatech=4",
	darkness_view: 8,
	lighting_alpha: 128,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/green"),
});
rt.type(8218, "/obj/item/clothing/glasses/eyepatch", "/obj/item/clothing/glasses", {
	name: "eyepatch",
	desc: "Yarr.",
	icon_state: "eyepatch",
	item_state: "eyepatch",
});
rt.type(8219, "/obj/item/clothing/glasses/monocle", "/obj/item/clothing/glasses", {
	name: "monocle",
	desc: "Such a dapper eyepiece!",
	icon_state: "monocle",
	item_state: "headset",
});
rt.type(8220, "/obj/item/clothing/glasses/material", "/obj/item/clothing/glasses", {
	vision_flags: 8,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/lightblue"),
	name: "optical material scanner",
	desc: "Very confusing glasses.",
	icon_state: "material",
	item_state: "glasses",
	origin_tech: "magnets=3;engineering=3",
});
rt.type(8221, "/obj/item/clothing/glasses/material/mining", "/obj/item/clothing/glasses/material", {
	darkness_view: 0,
	name: "optical material scanner",
	desc: "Used by miners to detect ores deep within the rock.",
	icon_state: "material",
	item_state: "glasses",
	origin_tech: "magnets=3;engineering=3",
});
rt.type(8223, "/obj/item/clothing/glasses/regular", "/obj/item/clothing/glasses", {
	vision_correction: 1,
	name: "prescription glasses",
	desc: "Made by Nerd. Co.",
	icon_state: "glasses",
	item_state: "glasses",
});
rt.type(8224, "/obj/item/clothing/glasses/regular/jamjar", "/obj/item/clothing/glasses/regular", {
	name: "jamjar glasses",
	desc: "Also known as Virginity Protectors.",
	icon_state: "jamjar_glasses",
	item_state: "jamjar_glasses",
});
rt.type(8225, "/obj/item/clothing/glasses/regular/hipster", "/obj/item/clothing/glasses/regular", {
	name: "prescription glasses",
	desc: "Made by Uncool. Co.",
	icon_state: "hipster_glasses",
	item_state: "hipster_glasses",
});
rt.type(8226, "/obj/item/clothing/glasses/sunglasses", "/obj/item/clothing/glasses", {
	darkness_view: 1,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/gray"),
	name: "sunglasses",
	desc: "Strangely ancient technology used to help provide rudimentary eye cover. Enhanced shielding blocks many flashes.",
	icon_state: "sun",
	item_state: "sunglasses",
	flash_protect: 1,
	tint: 1,
	dog_fashion: rt.typePath("/datum/dog_fashion/head"),
});
rt.type(8227, "/obj/item/clothing/glasses/sunglasses/reagent", "/obj/item/clothing/glasses/sunglasses", {
	name: "beer goggles",
	desc: "A pair of sunglasses outfitted with apparatus to scan reagents.",
	origin_tech: "magnets=2;engineering=2",
	scan_reagents: 1,
});
rt.type(8232, "/obj/item/clothing/glasses/sunglasses/blindfold", "/obj/item/clothing/glasses/sunglasses", {
	name: "blindfold",
	desc: "Covers the eyes, preventing sight.",
	icon_state: "blindfold",
	item_state: "blindfold",
	flash_protect: 2,
	tint: 3,
});
rt.type(8233, "/obj/item/clothing/glasses/sunglasses/big", "/obj/item/clothing/glasses/sunglasses", {
	desc: "Strangely ancient technology used to help provide rudimentary eye cover. Larger than average enhanced shielding blocks many flashes.",
	icon_state: "bigsunglasses",
	item_state: "bigsunglasses",
});
rt.type(8239, "/obj/item/clothing/glasses/cold", "/obj/item/clothing/glasses", {
	name: "cold goggles",
	desc: "A pair of goggles meant for low temperatures.",
	icon_state: "cold",
	item_state: "cold",
});
rt.type(8240, "/obj/item/clothing/glasses/heat", "/obj/item/clothing/glasses", {
	name: "heat goggles",
	desc: "A pair of goggles meant for high temperatures.",
	icon_state: "heat",
	item_state: "heat",
});
rt.type(8241, "/obj/item/clothing/glasses/orange", "/obj/item/clothing/glasses", {
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/lightorange"),
	name: "orange glasses",
	desc: "A sweet pair of orange shades.",
	icon_state: "orangeglasses",
	item_state: "orangeglasses",
});
rt.type(8242, "/obj/item/clothing/glasses/red", "/obj/item/clothing/glasses", {
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/red"),
	name: "red glasses",
	desc: "Hey, you're looking good, senpai!",
	icon_state: "redglasses",
	item_state: "redglasses",
});
rt.type(8344, "/obj/item/clothing/under/pj", "/obj/item/clothing/under", {});
rt.type(8345, "/obj/item/clothing/under/pj/red", "/obj/item/clothing/under/pj", {
	can_adjust: 0,
	name: "red pj's",
	desc: "Sleepwear.",
	icon_state: "red_pyjamas",
	item_color: "red_pyjamas",
	item_state: "w_suit",
});
rt.type(8346, "/obj/item/clothing/under/pj/blue", "/obj/item/clothing/under/pj", {
	can_adjust: 0,
	name: "blue pj's",
	desc: "Sleepwear.",
	icon_state: "blue_pyjamas",
	item_color: "blue_pyjamas",
	item_state: "w_suit",
});
rt.type(8347, "/obj/item/clothing/under/patriotsuit", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "Patriotic Suit",
	desc: "Motorcycle not included.",
	icon_state: "ek",
	item_state: "ek",
	item_color: "ek",
});
rt.type(8348, "/obj/item/clothing/under/scratch", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "white suit",
	desc: "A white suit, suitable for an excellent host",
	icon_state: "scratch",
	item_state: "scratch",
	item_color: "scratch",
});
rt.type(8349, "/obj/item/clothing/under/sl_suit", "/obj/item/clothing/under", {
	can_adjust: 0,
	desc: "It's a very amish looking suit.",
	name: "amish suit",
	icon_state: "sl_suit",
	item_color: "sl_suit",
});
rt.type(8350, "/obj/item/clothing/under/roman", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "roman armor",
	desc: "Ancient Roman armor. Made of metallic and leather straps.",
	icon_state: "roman",
	item_color: "roman",
	item_state: "armor",
	strip_delay: 100,
	resistance_flags: 0,
});
rt.type(8351, "/obj/item/clothing/under/waiter", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "waiter's outfit",
	desc: "It's a very smart uniform with a special pocket for tip.",
	icon_state: "waiter",
	item_state: "waiter",
	item_color: "waiter",
});
rt.type(8352, "/obj/item/clothing/under/jabroni", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "Jabroni Outfit",
	desc: "The leather club is two sectors down.",
	icon_state: "darkholme",
	item_state: "darkholme",
	item_color: "darkholme",
});
rt.type(8353, "/obj/item/clothing/under/space", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "１NASA jumpsuit",
	desc: "It has a NASA logo on it and is made of space-proofed materials.",
	icon_state: "black",
	item_state: "bl_suit",
	item_color: "black",
	w_class: 4,
	gas_transfer_coefficient: 0.01,
	permeability_coefficient: 0.02,
	body_parts_covered: 2046,
	cold_protection: 414,
	min_cold_protection_temperature: 2,
	heat_protection: 2046,
	max_heat_protection_temperature: 1500,
	resistance_flags: 0,
});
rt.type(8355, "/obj/item/clothing/under/owl", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "owl uniform",
	desc: "A soft brown jumpsuit made of synthetic feathers and strong conviction.",
	icon_state: "owl",
	item_color: "owl",
});
rt.type(8356, "/obj/item/clothing/under/griffin", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "griffon uniform",
	desc: "A soft brown jumpsuit with a white feather collar made of synthetic feathers and a lust for mayhem.",
	icon_state: "griffin",
	item_color: "griffin",
});
rt.type(8357, "/obj/item/clothing/under/cloud", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "cloud",
	desc: "cloud",
	icon_state: "cloud",
	item_color: "cloud",
});
rt.type(8358, "/obj/item/clothing/under/gimmick", "/obj/item/clothing/under", {});
rt.type(8359, "/obj/item/clothing/under/gimmick/rank", "/obj/item/clothing/under/gimmick", {});
rt.type(8360, "/obj/item/clothing/under/gimmick/rank/captain", "/obj/item/clothing/under/gimmick/rank", {});
rt.type(8361, "/obj/item/clothing/under/gimmick/rank/captain/suit", "/obj/item/clothing/under/gimmick/rank/captain", {
	can_adjust: 0,
	name: "captain's suit",
	desc: "A green suit and yellow necktie. Exemplifies authority.",
	icon_state: "green_suit",
	item_state: "dg_suit",
	item_color: "green_suit",
});
rt.type(8362, "/obj/item/clothing/under/gimmick/rank/head_of_personnel", "/obj/item/clothing/under/gimmick/rank", {});
rt.type(8363, "/obj/item/clothing/under/gimmick/rank/head_of_personnel/suit", "/obj/item/clothing/under/gimmick/rank/head_of_personnel", {
	can_adjust: 0,
	name: "head of personnel's suit",
	desc: "A teal suit and yellow necktie. An authoritative yet tacky ensemble.",
	icon_state: "teal_suit",
	item_state: "g_suit",
	item_color: "teal_suit",
});
rt.type(8364, "/obj/item/clothing/under/suit_jacket", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "black suit",
	desc: "A black suit and red tie. Very formal.",
	icon_state: "black_suit",
	item_state: "bl_suit",
	item_color: "black_suit",
});
rt.type(8365, "/obj/item/clothing/under/suit_jacket/really_black", "/obj/item/clothing/under/suit_jacket", {
	name: "executive suit",
	desc: "A formal black suit and red tie, intended for the station's finest.",
	icon_state: "really_black_suit",
	item_state: "bl_suit",
	item_color: "black_suit",
});
rt.type(8366, "/obj/item/clothing/under/suit_jacket/female", "/obj/item/clothing/under/suit_jacket", {
	name: "executive suit",
	desc: "A formal trouser suit for women, intended for the station's finest.",
	icon_state: "black_suit_fem",
	item_state: "black_suit_fem",
	item_color: "black_suit_fem",
});
rt.type(8367, "/obj/item/clothing/under/suit_jacket/green", "/obj/item/clothing/under/suit_jacket", {
	can_adjust: 0,
	name: "green suit",
	desc: "A green suit and yellow necktie. Baller.",
	icon_state: "green_suit",
	item_state: "dg_suit",
	item_color: "green_suit",
});
rt.type(8368, "/obj/item/clothing/under/suit_jacket/red", "/obj/item/clothing/under/suit_jacket", {
	name: "red suit",
	desc: "A red suit and blue tie. Somewhat formal.",
	icon_state: "red_suit",
	item_state: "r_suit",
	item_color: "red_suit",
});
rt.type(8369, "/obj/item/clothing/under/suit_jacket/charcoal", "/obj/item/clothing/under/suit_jacket", {
	name: "charcoal suit",
	desc: "A charcoal suit and red tie. Very professional.",
	icon_state: "charcoal_suit",
	item_state: "charcoal_suit",
	item_color: "charcoal_suit",
});
rt.type(8370, "/obj/item/clothing/under/suit_jacket/navy", "/obj/item/clothing/under/suit_jacket", {
	name: "navy suit",
	desc: "A navy suit and red tie, intended for the station's finest.",
	icon_state: "navy_suit",
	item_state: "navy_suit",
	item_color: "navy_suit",
});
rt.type(8371, "/obj/item/clothing/under/suit_jacket/burgundy", "/obj/item/clothing/under/suit_jacket", {
	name: "burgundy suit",
	desc: "A burgundy suit and black tie. Somewhat formal.",
	icon_state: "burgundy_suit",
	item_state: "burgundy_suit",
	item_color: "burgundy_suit",
});
rt.type(8372, "/obj/item/clothing/under/suit_jacket/checkered", "/obj/item/clothing/under/suit_jacket", {
	name: "checkered suit",
	desc: "That's a very nice suit you have there. Shame if something were to happen to it, eh?",
	icon_state: "checkered_suit",
	item_state: "checkered_suit",
	item_color: "checkered_suit",
});
rt.type(8373, "/obj/item/clothing/under/suit_jacket/tan", "/obj/item/clothing/under/suit_jacket", {
	name: "tan suit",
	desc: "A tan suit with a yellow tie. Smart, but casual.",
	icon_state: "tan_suit",
	item_state: "tan_suit",
	item_color: "tan_suit",
});
rt.type(8374, "/obj/item/clothing/under/suit_jacket/white", "/obj/item/clothing/under/suit_jacket", {
	name: "white suit",
	desc: "A white suit and jacket with a blue shirt. You wanna play rough? OKAY!.",
	icon_state: "white_suit",
	item_state: "white_suit",
	item_color: "white_suit",
});
rt.type(8375, "/obj/item/clothing/under/burial", "/obj/item/clothing/under", {
	name: "burial garments",
	desc: "Traditional burial garments from the early 22nd century.",
	icon_state: "burial",
	item_state: "burial",
	item_color: "burial",
});
rt.type(8376, "/obj/item/clothing/under/skirt", "/obj/item/clothing/under", {});
rt.type(8377, "/obj/item/clothing/under/skirt/black", "/obj/item/clothing/under/skirt", {
	fitted: 2,
	can_adjust: 0,
	name: "black skirt",
	desc: "A black skirt, very fancy!",
	icon_state: "blackskirt",
	item_color: "blackskirt",
	body_parts_covered: 390,
});
rt.type(8378, "/obj/item/clothing/under/skirt/blue", "/obj/item/clothing/under/skirt", {
	fitted: 2,
	can_adjust: 0,
	name: "blue skirt",
	desc: "A blue, casual skirt.",
	icon_state: "blueskirt",
	item_color: "blueskirt",
	item_state: "b_suit",
	body_parts_covered: 390,
});
rt.type(8379, "/obj/item/clothing/under/skirt/red", "/obj/item/clothing/under/skirt", {
	fitted: 2,
	can_adjust: 0,
	name: "red skirt",
	desc: "A red, casual skirt.",
	icon_state: "redskirt",
	item_color: "redskirt",
	item_state: "r_suit",
	body_parts_covered: 390,
});
rt.type(8380, "/obj/item/clothing/under/skirt/purple", "/obj/item/clothing/under/skirt", {
	fitted: 2,
	can_adjust: 0,
	name: "purple skirt",
	desc: "A purple, casual skirt.",
	icon_state: "purpleskirt",
	item_color: "purpleskirt",
	item_state: "p_suit",
	body_parts_covered: 390,
});
rt.type(8381, "/obj/item/clothing/under/schoolgirl", "/obj/item/clothing/under", {
	fitted: 2,
	can_adjust: 0,
	name: "blue schoolgirl uniform",
	desc: "It's just like one of my Japanese animes!",
	icon_state: "schoolgirl",
	item_state: "schoolgirl",
	item_color: "schoolgirl",
	body_parts_covered: 390,
});
rt.type(8382, "/obj/item/clothing/under/schoolgirl/red", "/obj/item/clothing/under/schoolgirl", {
	name: "red schoolgirl uniform",
	icon_state: "schoolgirlred",
	item_state: "schoolgirlred",
	item_color: "schoolgirlred",
});
rt.type(8383, "/obj/item/clothing/under/schoolgirl/green", "/obj/item/clothing/under/schoolgirl", {
	name: "green schoolgirl uniform",
	icon_state: "schoolgirlgreen",
	item_state: "schoolgirlgreen",
	item_color: "schoolgirlgreen",
});
rt.type(8384, "/obj/item/clothing/under/schoolgirl/orange", "/obj/item/clothing/under/schoolgirl", {
	name: "orange schoolgirl uniform",
	icon_state: "schoolgirlorange",
	item_state: "schoolgirlorange",
	item_color: "schoolgirlorange",
});
rt.type(8385, "/obj/item/clothing/under/overalls", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "laborer's overalls",
	desc: "A set of durable overalls for getting the job done.",
	icon_state: "overalls",
	item_state: "lb_suit",
	item_color: "overalls",
});
rt.type(8386, "/obj/item/clothing/under/pirate", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "pirate outfit",
	desc: "Yarr.",
	icon_state: "pirate",
	item_state: "pirate",
	item_color: "pirate",
});
rt.type(8387, "/obj/item/clothing/under/soviet", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "soviet uniform",
	desc: "For the Motherland!",
	icon_state: "soviet",
	item_state: "soviet",
	item_color: "soviet",
});
rt.type(8388, "/obj/item/clothing/under/redcoat", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "redcoat uniform",
	desc: "Looks old.",
	icon_state: "redcoat",
	item_state: "redcoat",
	item_color: "redcoat",
});
rt.type(8389, "/obj/item/clothing/under/kilt", "/obj/item/clothing/under", {
	fitted: 2,
	can_adjust: 0,
	name: "kilt",
	desc: "Includes shoes and plaid.",
	icon_state: "kilt",
	item_state: "kilt",
	item_color: "kilt",
	body_parts_covered: 102,
});
rt.type(8390, "/obj/item/clothing/under/kilt/highlander", "/obj/item/clothing/under/kilt", {
	flags: 2,
	desc: "You're the only one worthy of this kilt.",
});
rt.type(8391, "/obj/item/clothing/under/sexymime", "/obj/item/clothing/under", {
	fitted: 2,
	can_adjust: 0,
	name: "sexy mime outfit",
	desc: "The only time when you DON'T enjoy looking at someone's rack.",
	icon_state: "sexymime",
	item_state: "sexymime",
	item_color: "sexymime",
	body_parts_covered: 30,
});
rt.type(8392, "/obj/item/clothing/under/gladiator", "/obj/item/clothing/under", {
	fitted: 0,
	can_adjust: 0,
	name: "gladiator uniform",
	desc: "Are you not entertained? Is that not why you are here?",
	icon_state: "gladiator",
	item_state: "gladiator",
	item_color: "gladiator",
	body_parts_covered: 390,
	resistance_flags: 0,
});
rt.type(8393, "/obj/item/clothing/under/gladiator/ash_walker", "/obj/item/clothing/under/gladiator", {
	has_sensor: 0,
	desc: "This gladiator uniform appears to be covered in ash and fairly dated.",
});
rt.type(8394, "/obj/item/clothing/under/sundress", "/obj/item/clothing/under", {
	fitted: 2,
	can_adjust: 0,
	name: "sundress",
	desc: "Makes you want to frolic in a field of daisies.",
	icon_state: "sundress",
	item_state: "sundress",
	item_color: "sundress",
	body_parts_covered: 6,
});
rt.type(8395, "/obj/item/clothing/under/captainparade", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "captain's parade uniform",
	desc: "A captain's luxury-wear, for special occasions.",
	icon_state: "captain_parade",
	item_state: "by_suit",
	item_color: "captain_parade",
});
rt.type(8396, "/obj/item/clothing/under/hosparademale", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "head of security's parade uniform",
	desc: "A male head of security's luxury-wear, for special occasions.",
	icon_state: "hos_parade_male",
	item_state: "r_suit",
	item_color: "hos_parade_male",
});
rt.type(8397, "/obj/item/clothing/under/hosparadefem", "/obj/item/clothing/under", {
	fitted: 2,
	can_adjust: 0,
	name: "head of security's parade uniform",
	desc: "A female head of security's luxury-wear, for special occasions.",
	icon_state: "hos_parade_fem",
	item_state: "r_suit",
	item_color: "hos_parade_fem",
});
rt.type(8398, "/obj/item/clothing/under/assistantformal", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "assistant's formal uniform",
	desc: "An assistant's formal-wear. Why an assistant needs formal-wear is still unknown.",
	icon_state: "assistant_formal",
	item_state: "gy_suit",
	item_color: "assistant_formal",
});
rt.type(8399, "/obj/item/clothing/under/blacktango", "/obj/item/clothing/under", {
	fitted: 2,
	can_adjust: 0,
	name: "black tango dress",
	desc: "Filled with Latin fire.",
	icon_state: "black_tango",
	item_state: "wcoat",
	item_color: "black_tango",
});
rt.type(8400, "/obj/item/clothing/under/stripeddress", "/obj/item/clothing/under", {
	fitted: 1,
	can_adjust: 0,
	name: "striped dress",
	desc: "Fashion in space.",
	icon_state: "striped_dress",
	item_state: "stripeddress",
	item_color: "striped_dress",
});
rt.type(8401, "/obj/item/clothing/under/sailordress", "/obj/item/clothing/under", {
	fitted: 2,
	can_adjust: 0,
	name: "sailor dress",
	desc: "Formal wear for a leading lady.",
	icon_state: "sailor_dress",
	item_state: "sailordress",
	item_color: "sailor_dress",
});
rt.type(8402, "/obj/item/clothing/under/redeveninggown", "/obj/item/clothing/under", {
	fitted: 2,
	can_adjust: 0,
	name: "red evening gown",
	desc: "Fancy dress for space bar singers.",
	icon_state: "red_evening_gown",
	item_state: "redeveninggown",
	item_color: "red_evening_gown",
});
rt.type(8404, "/obj/item/clothing/under/janimaid", "/obj/item/clothing/under", {
	fitted: 2,
	can_adjust: 0,
	name: "maid uniform",
	desc: "A simple maid uniform for housekeeping.",
	icon_state: "janimaid",
	item_state: "janimaid",
	item_color: "janimaid",
	body_parts_covered: 6,
});
rt.type(8405, "/obj/item/clothing/under/plaid_skirt", "/obj/item/clothing/under", {
	fitted: 2,
	can_adjust: 1,
	alt_covers_chest: 1,
	name: "red plaid skirt",
	desc: "A preppy red skirt with a white blouse.",
	icon_state: "plaid_red",
	item_state: "plaid_red",
	item_color: "plaid_red",
});
rt.type(8406, "/obj/item/clothing/under/plaid_skirt/blue", "/obj/item/clothing/under/plaid_skirt", {
	fitted: 2,
	can_adjust: 1,
	alt_covers_chest: 1,
	name: "blue plaid skirt",
	desc: "A preppy blue skirt with a white blouse.",
	icon_state: "plaid_blue",
	item_state: "plaid_blue",
	item_color: "plaid_blue",
});
rt.type(8407, "/obj/item/clothing/under/plaid_skirt/purple", "/obj/item/clothing/under/plaid_skirt", {
	fitted: 2,
	can_adjust: 1,
	alt_covers_chest: 1,
	name: "purple plaid skirt",
	desc: "A preppy purple skirt with a white blouse.",
	icon_state: "plaid_purple",
	item_state: "plaid_purple",
	item_color: "plaid_purple",
});
rt.type(8408, "/obj/item/clothing/under/plaid_skirt/green", "/obj/item/clothing/under/plaid_skirt", {
	fitted: 2,
	can_adjust: 1,
	alt_covers_chest: 1,
	name: "green plaid skirt",
	desc: "A preppy green skirt with a white blouse.",
	icon_state: "plaid_green",
	item_state: "plaid_green",
	item_color: "plaid_green",
});
rt.type(8409, "/obj/item/clothing/under/singery", "/obj/item/clothing/under", {
	fitted: 0,
	can_adjust: 0,
	name: "yellow performer's outfit",
	desc: "Just looking at this makes you want to sing.",
	icon_state: "ysing",
	item_state: "ysing",
	item_color: "ysing",
	alternate_worn_layer: 16,
});
rt.type(8410, "/obj/item/clothing/under/singerb", "/obj/item/clothing/under", {
	fitted: 2,
	can_adjust: 0,
	name: "blue performer's outfit",
	desc: "Just looking at this makes you want to sing.",
	icon_state: "bsing",
	item_state: "bsing",
	item_color: "bsing",
	alternate_worn_layer: 16,
});
rt.type(8411, "/obj/item/clothing/under/jester", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "jester suit",
	desc: "A jolly dress, well suited to entertain your master, nuncle.",
	icon_state: "jester",
	item_color: "jester",
});
rt.type(8412, "/obj/item/clothing/under/geisha", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "geisha suit",
	desc: "Cute space ninja senpai not included.",
	icon_state: "geisha",
	item_color: "geisha",
});
rt.type(8413, "/obj/item/clothing/under/villain", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "villain suit",
	desc: "A change of wardrobe is necessary if you ever want to catch a real superhero.",
	icon_state: "villain",
	item_color: "villain",
});
rt.type(8414, "/obj/item/clothing/under/sailor", "/obj/item/clothing/under", {
	can_adjust: 0,
	name: "sailor suit",
	desc: "Skipper's in the wardroom drinkin gin'.",
	icon_state: "sailor",
	item_state: "b_suit",
	item_color: "sailor",
});
rt.type(8416, "/obj/item/clothing/under/pants", "/obj/item/clothing/under", {
	fitted: 0,
	can_adjust: 0,
	gender: "plural",
	body_parts_covered: 28,
});
rt.type(8417, "/obj/item/clothing/under/pants/classicjeans", "/obj/item/clothing/under/pants", {
	name: "classic jeans",
	desc: "You feel cooler already.",
	icon_state: "jeansclassic",
	item_color: "jeansclassic",
});
rt.type(8418, "/obj/item/clothing/under/pants/mustangjeans", "/obj/item/clothing/under/pants", {
	name: "Must Hang jeans",
	desc: "Made in the finest space jeans factory this side of Alpha Centauri.",
	icon_state: "jeansmustang",
	item_color: "jeansmustang",
});
rt.type(8419, "/obj/item/clothing/under/pants/blackjeans", "/obj/item/clothing/under/pants", {
	name: "black jeans",
	desc: "Only for those who can pull it off.",
	icon_state: "jeansblack",
	item_color: "jeansblack",
});
rt.type(8420, "/obj/item/clothing/under/pants/youngfolksjeans", "/obj/item/clothing/under/pants", {
	name: "Young Folks jeans",
	desc: "For those tired of boring old jeans. Relive the passion of your youth!",
	icon_state: "jeansyoungfolks",
	item_color: "jeansyoungfolks",
});
rt.type(8421, "/obj/item/clothing/under/pants/white", "/obj/item/clothing/under/pants", {
	name: "white pants",
	desc: "Plain white pants. Boring.",
	icon_state: "whitepants",
	item_color: "whitepants",
});
rt.type(8422, "/obj/item/clothing/under/pants/red", "/obj/item/clothing/under/pants", {
	name: "red pants",
	desc: "Bright red pants. Overflowing with personality.",
	icon_state: "redpants",
	item_color: "redpants",
});
rt.type(8423, "/obj/item/clothing/under/pants/black", "/obj/item/clothing/under/pants", {
	name: "black pants",
	desc: "These pants are dark, like your soul.",
	icon_state: "blackpants",
	item_color: "blackpants",
});
rt.type(8424, "/obj/item/clothing/under/pants/tan", "/obj/item/clothing/under/pants", {
	name: "tan pants",
	desc: "Some tan pants. You look like a white collar worker with these on.",
	icon_state: "tanpants",
	item_color: "tanpants",
});
rt.type(8425, "/obj/item/clothing/under/pants/track", "/obj/item/clothing/under/pants", {
	name: "track pants",
	desc: "A pair of track pants, for the athletic.",
	icon_state: "trackpants",
	item_color: "trackpants",
});
rt.type(8426, "/obj/item/clothing/under/pants/jeans", "/obj/item/clothing/under/pants", {
	name: "jeans",
	desc: "A nondescript pair of tough blue jeans.",
	icon_state: "jeans",
	item_color: "jeans",
});
rt.type(8427, "/obj/item/clothing/under/pants/khaki", "/obj/item/clothing/under/pants", {
	name: "khaki pants",
	desc: "A pair of dust beige khaki pants.",
	icon_state: "khaki",
	item_color: "khaki",
});
rt.type(8428, "/obj/item/clothing/under/pants/camo", "/obj/item/clothing/under/pants", {
	name: "camo pants",
	desc: "A pair of woodland camouflage pants. Probably not the best choice for a space station.",
	icon_state: "camopants",
	item_color: "camopants",
});
rt.type(8429, "/obj/item/clothing/under/shorts", "/obj/item/clothing/under", {
	fitted: 0,
	mutantrace_variation: 1,
	can_adjust: 0,
	name: "athletic shorts",
	desc: "95% Polyester, 5% Spandex!",
	gender: "plural",
	body_parts_covered: 4,
});
rt.type(8430, "/obj/item/clothing/under/shorts/red", "/obj/item/clothing/under/shorts", {
	name: "red athletic shorts",
	icon_state: "redshorts",
	item_color: "redshorts",
});
rt.type(8431, "/obj/item/clothing/under/shorts/green", "/obj/item/clothing/under/shorts", {
	name: "green athletic shorts",
	icon_state: "greenshorts",
	item_color: "greenshorts",
});
rt.type(8432, "/obj/item/clothing/under/shorts/blue", "/obj/item/clothing/under/shorts", {
	name: "blue athletic shorts",
	icon_state: "blueshorts",
	item_color: "blueshorts",
});
rt.type(8433, "/obj/item/clothing/under/shorts/black", "/obj/item/clothing/under/shorts", {
	name: "black athletic shorts",
	icon_state: "blackshorts",
	item_color: "blackshorts",
});
rt.type(8434, "/obj/item/clothing/under/shorts/grey", "/obj/item/clothing/under/shorts", {
	name: "grey athletic shorts",
	icon_state: "greyshorts",
	item_color: "greyshorts",
});
rt.type(8435, "/obj/item/clothing/under/shorts/purple", "/obj/item/clothing/under/shorts", {
	name: "purple athletic shorts",
	icon_state: "purpleshorts",
	item_color: "purpleshorts",
});
rt.type(8436, "/obj/item/clothing/under/trek", "/obj/item/clothing/under", {
	can_adjust: 0,
});
rt.type(8437, "/obj/item/clothing/under/trek/command", "/obj/item/clothing/under/trek", {
	name: "command uniform",
	desc: "The uniform worn by command officers",
	icon_state: "trek_command",
	item_color: "trek_command",
	item_state: "y_suit",
});
rt.type(8438, "/obj/item/clothing/under/trek/command/next", "/obj/item/clothing/under/trek/command", {
	icon_state: "trek_next_command",
	item_color: "trek_next_command",
	item_state: "r_suit",
});
rt.type(8439, "/obj/item/clothing/under/trek/command/ent", "/obj/item/clothing/under/trek/command", {
	icon_state: "trek_ent_command",
	item_color: "trek_ent_command",
	item_state: "bl_suit",
});
rt.type(8443, "/obj/item/clothing/under/trek/medsci", "/obj/item/clothing/under/trek", {
	name: "medsci uniform",
	desc: "The uniform worn by medical/science officers",
	icon_state: "trek_medsci",
	item_color: "trek_medsci",
	item_state: "b_suit",
});
rt.type(8444, "/obj/item/clothing/under/trek/medsci/next", "/obj/item/clothing/under/trek/medsci", {
	icon_state: "trek_next_medsci",
	item_color: "trek_next_medsci",
});
rt.type(8445, "/obj/item/clothing/under/trek/medsci/ent", "/obj/item/clothing/under/trek/medsci", {
	icon_state: "trek_ent_medsci",
	item_color: "trek_ent_medsci",
	item_state: "bl_suit",
});
rt.type(8446, "/obj/item/clothing/under/trek/Q", "/obj/item/clothing/under/trek", {
	name: "french marshall's uniform",
	desc: "something about it feels off...",
	icon_state: "trek_Q",
	item_color: "trek_Q",
	item_state: "r_suit",
});
rt.type(8447, "/obj/item/clothing/under/lawyer", "/obj/item/clothing/under", {
	can_adjust: 0,
	desc: "Slick threads.",
	name: "Lawyer suit",
});
rt.type(8448, "/obj/item/clothing/under/lawyer/black", "/obj/item/clothing/under/lawyer", {
	icon_state: "lawyer_black",
	item_state: "lawyer_black",
	item_color: "lawyer_black",
});
rt.type(8449, "/obj/item/clothing/under/lawyer/female", "/obj/item/clothing/under/lawyer", {
	icon_state: "black_suit_fem",
	item_state: "black_suit_fem",
	item_color: "black_suit_fem",
});
rt.type(8450, "/obj/item/clothing/under/lawyer/red", "/obj/item/clothing/under/lawyer", {
	icon_state: "lawyer_red",
	item_state: "lawyer_red",
	item_color: "lawyer_red",
});
rt.type(8451, "/obj/item/clothing/under/lawyer/blue", "/obj/item/clothing/under/lawyer", {
	icon_state: "lawyer_blue",
	item_state: "lawyer_blue",
	item_color: "lawyer_blue",
});
rt.type(8452, "/obj/item/clothing/under/lawyer/bluesuit", "/obj/item/clothing/under/lawyer", {
	can_adjust: 1,
	alt_covers_chest: 1,
	name: "blue suit",
	desc: "A classy suit and tie.",
	icon_state: "bluesuit",
	item_state: "bluesuit",
	item_color: "bluesuit",
});
rt.type(8453, "/obj/item/clothing/under/lawyer/purpsuit", "/obj/item/clothing/under/lawyer", {
	fitted: 0,
	can_adjust: 1,
	alt_covers_chest: 1,
	name: "purple suit",
	icon_state: "lawyer_purp",
	item_state: "lawyer_purp",
	item_color: "lawyer_purp",
});
rt.type(8454, "/obj/item/clothing/under/lawyer/blacksuit", "/obj/item/clothing/under/lawyer", {
	can_adjust: 1,
	alt_covers_chest: 1,
	name: "black suit",
	desc: "A professional black suit. Nanotrasen Investigation Bureau approved!",
	icon_state: "blacksuit",
	item_state: "bar_suit",
	item_color: "blacksuit",
});
rt.type(8455, "/obj/item/clothing/under/golem", "/obj/item/clothing/under", {
	flags: 130,
	has_sensor: 0,
	name: "adamantine skin",
	desc: "a golem's skin",
	icon_state: "golem",
	item_state: "golem",
	item_color: "golem",
	resistance_flags: 51,
});
rt.type(8459, "/obj/item/clothing/shoes/gang", "/obj/item/clothing/shoes", {
	name: "blinged-out boots",
	desc: "Stand aside peasants.",
	icon_state: "bling",
});
rt.type(8492, "/obj/item/clothing/shoes/sandal", "/obj/item/clothing/shoes", {
	desc: "A pair of rather plain, wooden sandals.",
	name: "sandals",
	icon_state: "wizard",
	strip_delay: 50,
	equip_delay_other: 50,
});
rt.type(8493, "/obj/item/clothing/shoes/sandal/marisa", "/obj/item/clothing/shoes/sandal", {
	desc: "A pair of magic black shoes.",
	name: "magic shoes",
	icon_state: "black",
	resistance_flags: 34,
});
rt.type(8494, "/obj/item/clothing/shoes/sandal/magic", "/obj/item/clothing/shoes/sandal", {
	name: "magical sandals",
	desc: "A pair of sandals imbued with magic",
	resistance_flags: 34,
});
rt.type(8497, "/obj/item/clothing/shoes/jackboots", "/obj/item/clothing/shoes", {
	name: "jackboots",
	desc: "Nanotrasen-issue Security combat boots for combat scenarios or combat situations. All combat, all the time.",
	icon_state: "jackboots",
	item_state: "jackboots",
	item_color: "hosred",
	strip_delay: 50,
	equip_delay_other: 50,
	resistance_flags: 0,
	pockets: rt.typePath("/obj/item/weapon/storage/internal/pocket/shoes"),
});
rt.type(8498, "/obj/item/clothing/shoes/jackboots/fast", "/obj/item/clothing/shoes/jackboots", {
	slowdown: -1,
});
rt.type(8499, "/obj/item/clothing/shoes/winterboots", "/obj/item/clothing/shoes", {
	name: "winter boots",
	desc: "Boots lined with 'synthetic' animal fur.",
	icon_state: "winterboots",
	item_state: "winterboots",
	cold_protection: 120,
	min_cold_protection_temperature: 2,
	heat_protection: 120,
	max_heat_protection_temperature: 1500,
	pockets: rt.typePath("/obj/item/weapon/storage/internal/pocket/shoes"),
});
rt.type(8500, "/obj/item/clothing/shoes/workboots", "/obj/item/clothing/shoes", {
	name: "work boots",
	desc: "Nanotrasen-issue Engineering lace-up work boots for the especially blue-collar.",
	icon_state: "workboots",
	item_state: "jackboots",
	strip_delay: 40,
	equip_delay_other: 40,
	pockets: rt.typePath("/obj/item/weapon/storage/internal/pocket/shoes"),
});
rt.type(8501, "/obj/item/clothing/shoes/workboots/mining", "/obj/item/clothing/shoes/workboots", {
	name: "mining boots",
	desc: "Steel-toed mining boots for mining in hazardous environments. Very good at keeping toes uncrushed.",
	icon_state: "explorer",
	resistance_flags: 2,
});
rt.type(8502, "/obj/item/clothing/shoes/cult", "/obj/item/clothing/shoes", {
	name: "nar-sian invoker boots",
	desc: "A pair of boots worn by the followers of Nar-Sie.",
	icon_state: "cult",
	item_state: "cult",
	item_color: "cult",
	cold_protection: 96,
	min_cold_protection_temperature: 2,
	heat_protection: 96,
	max_heat_protection_temperature: 1500,
});
rt.type(8503, "/obj/item/clothing/shoes/cult/alt", "/obj/item/clothing/shoes/cult", {
	name: "cultist boots",
	icon_state: "cultalt",
});
rt.type(8504, "/obj/item/clothing/shoes/cult/alt/ghost", "/obj/item/clothing/shoes/cult/alt", {
	flags: 16386,
});
rt.type(8505, "/obj/item/clothing/shoes/cyborg", "/obj/item/clothing/shoes", {
	name: "cyborg boots",
	desc: "Shoes for a cyborg costume.",
	icon_state: "boots",
});
rt.type(8506, "/obj/item/clothing/shoes/laceup", "/obj/item/clothing/shoes", {
	name: "laceup shoes",
	desc: "The height of fashion, and they're pre-polished!",
	icon_state: "laceups",
	equip_delay_other: 50,
});
rt.type(8507, "/obj/item/clothing/shoes/roman", "/obj/item/clothing/shoes", {
	name: "roman sandals",
	desc: "Sandals with buckled leather straps on it.",
	icon_state: "roman",
	item_state: "roman",
	strip_delay: 100,
	equip_delay_other: 100,
});
rt.type(8508, "/obj/item/clothing/shoes/griffin", "/obj/item/clothing/shoes", {
	name: "griffon boots",
	desc: "A pair of costume boots fashioned after bird talons.",
	icon_state: "griffinboots",
	item_state: "griffinboots",
	pockets: rt.typePath("/obj/item/weapon/storage/internal/pocket/shoes"),
});
rt.type(8510, "/obj/item/clothing/shoes/singery", "/obj/item/clothing/shoes", {
	name: "yellow performer's boots",
	desc: "These boots were made for dancing.",
	icon_state: "ysing",
	equip_delay_other: 50,
});
rt.type(8511, "/obj/item/clothing/shoes/singerb", "/obj/item/clothing/shoes", {
	name: "blue performer's boots",
	desc: "These boots were made for dancing.",
	icon_state: "bsing",
	equip_delay_other: 50,
});
rt.type(8514, "/obj/item/clothing/shoes/golem", "/obj/item/clothing/shoes", {
	flags: 1154,
	name: "golem's feet",
	desc: "sturdy adamantine feet",
	icon_state: "golem",
	item_state: null,
	resistance_flags: 51,
});
rt.type(8517, "/obj/item/clothing/mask/gskull", "/obj/item/clothing/mask", {
	name: "golden death mask",
	icon_state: "gskull",
	desc: "Strike terror, and envy, into the hearts of your enemies.",
});
rt.type(8544, "/obj/item/clothing/mask/gas", "/obj/item/clothing/mask", {
	flags: 4104,
	name: "gas mask",
	desc: "A face-covering mask that can be connected to an air supply. While good for concealing your identity, it isn't good for blocking gas flow.",
	icon_state: "gas_alt",
	flags_inv: 736,
	w_class: 3,
	item_state: "gas_alt",
	gas_transfer_coefficient: 0.01,
	permeability_coefficient: 0.01,
	flags_cover: 10,
	resistance_flags: 0,
});
rt.type(8547, "/obj/item/clothing/mask/gas/syndicate", "/obj/item/clothing/mask/gas", {
	name: "syndicate mask",
	desc: "A close-fitting tactical mask that can be connected to an air supply.",
	icon_state: "syndicate",
	strip_delay: 60,
});
rt.type(8549, "/obj/item/clothing/mask/gas/sexyclown", "/obj/item/clothing/mask/gas", {
	flags: 8,
	name: "sexy-clown wig and mask",
	desc: "A feminine clown mask for the dabbling crossdressers or female entertainers.",
	icon_state: "sexyclown",
	item_state: "sexyclown",
	flags_cover: 2,
	resistance_flags: 4,
});
rt.type(8551, "/obj/item/clothing/mask/gas/monkeymask", "/obj/item/clothing/mask/gas", {
	flags: 8,
	name: "monkey mask",
	desc: "A mask used when acting as a monkey.",
	icon_state: "monkeymask",
	item_state: "monkeymask",
	flags_cover: 2,
	resistance_flags: 4,
});
rt.type(8552, "/obj/item/clothing/mask/gas/sexymime", "/obj/item/clothing/mask/gas", {
	flags: 8,
	name: "sexy mime mask",
	desc: "A traditional female mime's mask.",
	icon_state: "sexymime",
	item_state: "sexymime",
	flags_cover: 2,
	resistance_flags: 4,
});
rt.type(8553, "/obj/item/clothing/mask/gas/death_commando", "/obj/item/clothing/mask/gas", {
	name: "Death Commando Mask",
	icon_state: "death_commando_mask",
	item_state: "death_commando_mask",
});
rt.type(8554, "/obj/item/clothing/mask/gas/cyborg", "/obj/item/clothing/mask/gas", {
	name: "cyborg visor",
	desc: "Beep boop.",
	icon_state: "death",
	resistance_flags: 4,
});
rt.type(8555, "/obj/item/clothing/mask/gas/owl_mask", "/obj/item/clothing/mask/gas", {
	flags: 8,
	name: "owl mask",
	desc: "Twoooo!",
	icon_state: "owl",
	flags_cover: 2,
	resistance_flags: 4,
});
rt.type(8556, "/obj/item/clothing/mask/gas/carp", "/obj/item/clothing/mask/gas", {
	name: "carp mask",
	desc: "Gnash gnash.",
	icon_state: "carp_mask",
});
rt.type(8563, "/obj/item/clothing/mask/gas/space_ninja", "/obj/item/clothing/mask/gas", {
	name: "ninja mask",
	desc: "A close-fitting mask that acts both as an air filter and a post-modern fashion statement.",
	icon_state: "s-ninja",
	item_state: "s-ninja_mask",
	strip_delay: 120,
	resistance_flags: 35,
});
rt.type(8566, "/obj/item/clothing/mask/fakemoustache", "/obj/item/clothing/mask", {
	name: "fake moustache",
	desc: "Warning: moustache is fake.",
	icon_state: "fake-moustache",
	flags_inv: 128,
});
rt.type(8567, "/obj/item/clothing/mask/joy", "/obj/item/clothing/mask", {
	name: "joy mask",
	desc: "Express your happiness or hide your sorrows with this laughing face with crying tears of joy cutout.",
	icon_state: "joy",
});
rt.type(8572, "/obj/item/clothing/mask/rat", "/obj/item/clothing/mask", {
	name: "rat mask",
	desc: "A mask made of soft vinyl and latex, representing the head of a rat.",
	icon_state: "rat",
	item_state: "rat",
	flags_inv: 128,
	flags_cover: 8,
});
rt.type(8573, "/obj/item/clothing/mask/rat/fox", "/obj/item/clothing/mask/rat", {
	name: "fox mask",
	desc: "A mask made of soft vinyl and latex, representing the head of a fox.",
	icon_state: "fox",
	item_state: "fox",
});
rt.type(8574, "/obj/item/clothing/mask/rat/bee", "/obj/item/clothing/mask/rat", {
	name: "bee mask",
	desc: "A mask made of soft vinyl and latex, representing the head of a bee.",
	icon_state: "bee",
	item_state: "bee",
});
rt.type(8575, "/obj/item/clothing/mask/rat/bear", "/obj/item/clothing/mask/rat", {
	name: "bear mask",
	desc: "A mask made of soft vinyl and latex, representing the head of a bear.",
	icon_state: "bear",
	item_state: "bear",
});
rt.type(8576, "/obj/item/clothing/mask/rat/bat", "/obj/item/clothing/mask/rat", {
	name: "bat mask",
	desc: "A mask made of soft vinyl and latex, representing the head of a bat.",
	icon_state: "bat",
	item_state: "bat",
});
rt.type(8577, "/obj/item/clothing/mask/rat/raven", "/obj/item/clothing/mask/rat", {
	name: "raven mask",
	desc: "A mask made of soft vinyl and latex, representing the head of a raven.",
	icon_state: "raven",
	item_state: "raven",
});
rt.type(8578, "/obj/item/clothing/mask/rat/jackal", "/obj/item/clothing/mask/rat", {
	name: "jackal mask",
	desc: "A mask made of soft vinyl and latex, representing the head of a jackal.",
	icon_state: "jackal",
	item_state: "jackal",
});
rt.type(8579, "/obj/item/clothing/mask/rat/tribal", "/obj/item/clothing/mask/rat", {
	name: "tribal mask",
	desc: "A mask carved out of wood, detailed carefully by hand.",
	icon_state: "bumba",
	item_state: "bumba",
});
rt.type(8592, "/obj/item/clothing/ears", "/obj/item/clothing", {
	name: "ears",
	w_class: 1,
	throwforce: 0,
	slot_flags: 16,
	resistance_flags: 0,
});
rt.type(8595, "/obj/item/clothing/neck/tie", "/obj/item/clothing/neck", {
	name: "tie",
	desc: "A neosilk clip-on tie.",
	icon: rt.rsc("icons/obj/clothing/neck.dmi"),
	icon_state: "bluetie",
	item_state: "",
	item_color: "bluetie",
	w_class: 2,
});
rt.type(8596, "/obj/item/clothing/neck/tie/blue", "/obj/item/clothing/neck/tie", {
	name: "blue tie",
	icon_state: "bluetie",
	item_color: "bluetie",
});
rt.type(8597, "/obj/item/clothing/neck/tie/red", "/obj/item/clothing/neck/tie", {
	name: "red tie",
	icon_state: "redtie",
	item_color: "redtie",
});
rt.type(8598, "/obj/item/clothing/neck/tie/black", "/obj/item/clothing/neck/tie", {
	name: "black tie",
	icon_state: "blacktie",
	item_color: "blacktie",
});
rt.type(8599, "/obj/item/clothing/neck/tie/horrible", "/obj/item/clothing/neck/tie", {
	name: "horrible tie",
	desc: "A neosilk clip-on tie. This one is disgusting.",
	icon_state: "horribletie",
	item_color: "horribletie",
});
rt.type(8601, "/obj/item/clothing/neck/scarf", "/obj/item/clothing/neck", {
	name: "white scarf",
	icon_state: "scarf",
	desc: "A stylish scarf. The perfect winter accessory for those with a keen fashion sense, and those who just can't handle a cold breeze on their necks.",
	item_color: "scarf",
	dog_fashion: rt.typePath("/datum/dog_fashion/head"),
});
rt.type(8602, "/obj/item/clothing/neck/scarf/black", "/obj/item/clothing/neck/scarf", {
	name: "black scarf",
	icon_state: "scarf",
	color: "#4A4A4B",
});
rt.type(8603, "/obj/item/clothing/neck/scarf/red", "/obj/item/clothing/neck/scarf", {
	name: "red scarf",
	icon_state: "scarf",
	color: "#D91414",
});
rt.type(8604, "/obj/item/clothing/neck/scarf/green", "/obj/item/clothing/neck/scarf", {
	name: "green scarf",
	icon_state: "scarf",
	color: "#5C9E54",
});
rt.type(8605, "/obj/item/clothing/neck/scarf/darkblue", "/obj/item/clothing/neck/scarf", {
	name: "dark blue scarf",
	icon_state: "scarf",
	color: "#1E85BC",
});
rt.type(8606, "/obj/item/clothing/neck/scarf/purple", "/obj/item/clothing/neck/scarf", {
	name: "purple scarf",
	icon_state: "scarf",
	color: "#9557C5",
});
rt.type(8607, "/obj/item/clothing/neck/scarf/yellow", "/obj/item/clothing/neck/scarf", {
	name: "yellow scarf",
	icon_state: "scarf",
	color: "#E0C14F",
});
rt.type(8608, "/obj/item/clothing/neck/scarf/orange", "/obj/item/clothing/neck/scarf", {
	name: "orange scarf",
	icon_state: "scarf",
	color: "#C67A4B",
});
rt.type(8609, "/obj/item/clothing/neck/scarf/cyan", "/obj/item/clothing/neck/scarf", {
	name: "cyan scarf",
	icon_state: "scarf",
	color: "#54A3CE",
});
rt.type(8610, "/obj/item/clothing/neck/scarf/zebra", "/obj/item/clothing/neck/scarf", {
	name: "zebra scarf",
	icon_state: "zebrascarf",
	item_color: "zebrascarf",
});
rt.type(8611, "/obj/item/clothing/neck/scarf/christmas", "/obj/item/clothing/neck/scarf", {
	name: "christmas scarf",
	icon_state: "christmasscarf",
	item_color: "christmasscarf",
});
rt.type(8612, "/obj/item/clothing/neck/stripedredscarf", "/obj/item/clothing/neck", {
	name: "striped red scarf",
	icon_state: "stripedredscarf",
	item_color: "stripedredscarf",
});
rt.type(8613, "/obj/item/clothing/neck/stripedgreenscarf", "/obj/item/clothing/neck", {
	name: "striped green scarf",
	icon_state: "stripedgreenscarf",
	item_color: "stripedgreenscarf",
});
rt.type(8614, "/obj/item/clothing/neck/stripedbluescarf", "/obj/item/clothing/neck", {
	name: "striped blue scarf",
	icon_state: "stripedbluescarf",
	item_color: "stripedbluescarf",
});
rt.type(8616, "/obj/item/clothing/neck/necklace", "/obj/item/clothing/neck", {});
rt.type(8617, "/obj/item/clothing/neck/necklace/dope", "/obj/item/clothing/neck/necklace", {
	name: "gold necklace",
	desc: "Damn, it feels good to be a gangster.",
	icon: rt.rsc("icons/obj/clothing/neck.dmi"),
	icon_state: "bling",
	item_color: "bling",
});
