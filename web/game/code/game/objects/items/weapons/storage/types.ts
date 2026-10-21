// Types declared in code/game/objects/items/weapons/storage that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";

rt.type(5290, "/obj/item/weapon/storage/belt/military", "/obj/item/weapon/storage/belt", {
	name: "chest rig",
	desc: "A set of tactical webbing worn by Syndicate boarding parties.",
	icon_state: "militarywebbing",
	item_state: "militarywebbing",
	max_w_class: 2,
});
rt.type(5291, "/obj/item/weapon/storage/belt/military/gang", "/obj/item/weapon/storage/belt/military", {
	name: "badass belt",
	icon_state: "gangbelt",
	item_state: "gang",
	desc: "The belt buckle simply reads 'BAMF'.",
	storage_slots: 1,
});
rt.type(5292, "/obj/item/weapon/storage/belt/military/abductor", "/obj/item/weapon/storage/belt/military", {
	name: "agent belt",
	desc: "A belt used by abductor agents.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "belt",
	item_state: "security",
});
rt.type(5294, "/obj/item/weapon/storage/belt/military/army", "/obj/item/weapon/storage/belt/military", {
	name: "army belt",
	desc: "A belt used by military forces.",
	icon_state: "grenadebeltold",
	item_state: "security",
});
rt.type(5295, "/obj/item/weapon/storage/belt/military/assault", "/obj/item/weapon/storage/belt/military", {
	name: "assault belt",
	desc: "A tactical assault belt.",
	icon_state: "assaultbelt",
	item_state: "security",
	storage_slots: 6,
});
rt.type(5297, "/obj/item/weapon/storage/belt/utility/chief", "/obj/item/weapon/storage/belt/utility", {
	name: "Chief Engineer's toolbelt",
	desc: "Holds tools, looks snazzy",
	icon_state: "utilitybelt_ce",
	item_state: "utility_ce",
});
rt.type(5307, "/obj/item/weapon/storage/belt/mining/alt", "/obj/item/weapon/storage/belt/mining", {
	icon_state: "explorer2",
	item_state: "explorer2",
});
rt.type(5308, "/obj/item/weapon/storage/belt/mining/primitive", "/obj/item/weapon/storage/belt/mining", {
	name: "hunter's belt",
	desc: "A versatile belt, woven from sinew.",
	storage_slots: 5,
	icon_state: "ebelt",
	item_state: "ebelt",
});
rt.type(5319, "/obj/item/weapon/storage/belt/fannypack", "/obj/item/weapon/storage/belt", {
	name: "fannypack",
	desc: "A dorky fannypack for keeping small items in.",
	icon_state: "fannypack_leather",
	item_state: "fannypack_leather",
	storage_slots: 3,
	max_w_class: 2,
});
rt.type(5320, "/obj/item/weapon/storage/belt/fannypack/black", "/obj/item/weapon/storage/belt/fannypack", {
	name: "black fannypack",
	icon_state: "fannypack_black",
	item_state: "fannypack_black",
});
rt.type(5321, "/obj/item/weapon/storage/belt/fannypack/red", "/obj/item/weapon/storage/belt/fannypack", {
	name: "red fannypack",
	icon_state: "fannypack_red",
	item_state: "fannypack_red",
});
rt.type(5322, "/obj/item/weapon/storage/belt/fannypack/purple", "/obj/item/weapon/storage/belt/fannypack", {
	name: "purple fannypack",
	icon_state: "fannypack_purple",
	item_state: "fannypack_purple",
});
rt.type(5323, "/obj/item/weapon/storage/belt/fannypack/blue", "/obj/item/weapon/storage/belt/fannypack", {
	name: "blue fannypack",
	icon_state: "fannypack_blue",
	item_state: "fannypack_blue",
});
rt.type(5324, "/obj/item/weapon/storage/belt/fannypack/orange", "/obj/item/weapon/storage/belt/fannypack", {
	name: "orange fannypack",
	icon_state: "fannypack_orange",
	item_state: "fannypack_orange",
});
rt.type(5325, "/obj/item/weapon/storage/belt/fannypack/white", "/obj/item/weapon/storage/belt/fannypack", {
	name: "white fannypack",
	icon_state: "fannypack_white",
	item_state: "fannypack_white",
});
rt.type(5326, "/obj/item/weapon/storage/belt/fannypack/green", "/obj/item/weapon/storage/belt/fannypack", {
	name: "green fannypack",
	icon_state: "fannypack_green",
	item_state: "fannypack_green",
});
rt.type(5327, "/obj/item/weapon/storage/belt/fannypack/pink", "/obj/item/weapon/storage/belt/fannypack", {
	name: "pink fannypack",
	icon_state: "fannypack_pink",
	item_state: "fannypack_pink",
});
rt.type(5328, "/obj/item/weapon/storage/belt/fannypack/cyan", "/obj/item/weapon/storage/belt/fannypack", {
	name: "cyan fannypack",
	icon_state: "fannypack_cyan",
	item_state: "fannypack_cyan",
});
rt.type(5329, "/obj/item/weapon/storage/belt/fannypack/yellow", "/obj/item/weapon/storage/belt/fannypack", {
	name: "yellow fannypack",
	icon_state: "fannypack_yellow",
	item_state: "fannypack_yellow",
});
rt.type(5334, "/obj/item/weapon/storage/box/itemset", "/obj/item/weapon/storage/box", {});
rt.type(5335, "/obj/item/weapon/storage/box/itemset/crusader", "/obj/item/weapon/storage/box/itemset", {
	name: "Crusader's Armour Set",
	desc: "This armour is said to be based on the armor of kings on another world thousands of years ago, who tended to assassinate, conspire, and plot against everyone who tried to do the same to them.  Some things never change.",
});
rt.type(5418, "/obj/item/weapon/storage/box/syndie_kit", "/obj/item/weapon/storage/box", {
	illustration: "writing_syndie",
	name: "box",
	desc: "A sleek, sturdy box.",
	icon_state: "syndiebox",
});
rt.type(5442, "/obj/item/weapon/storage/backpack", "/obj/item/weapon/storage", {
	name: "backpack",
	desc: "You wear this on your back and put items into it.",
	icon_state: "backpack",
	item_state: "backpack",
	w_class: 4,
	slot_flags: 1024,
	max_w_class: 3,
	max_combined_w_class: 21,
	storage_slots: 21,
	resistance_flags: 0,
	obj_integrity: 300,
	max_integrity: 300,
});
rt.type(5443, "/obj/item/weapon/storage/backpack/bannerpack", "/obj/item/weapon/storage/backpack", {
	name: "nanotrasen banner backpack",
	desc: "It's a backpack with lots of extra room.  A banner with Nanotrasen's logo is attached, that can't be removed.",
	max_combined_w_class: 27,
	icon_state: "bannerpack",
});
rt.type(5444, "/obj/item/weapon/storage/backpack/bannerpack/red", "/obj/item/weapon/storage/backpack/bannerpack", {
	name: "red banner backpack",
	desc: "It's a backpack with lots of extra room.  A red banner is attached, that can't be removed.",
	icon_state: "bannerpack-red",
});
rt.type(5445, "/obj/item/weapon/storage/backpack/bannerpack/blue", "/obj/item/weapon/storage/backpack/bannerpack", {
	name: "blue banner backpack",
	desc: "It's a backpack with lots of extra room.  A blue banner is attached, that can't be removed.",
	icon_state: "bannerpack-blue",
});
rt.type(5446, "/obj/item/weapon/storage/backpack/old", "/obj/item/weapon/storage/backpack", {
	max_combined_w_class: 12,
});
rt.type(5449, "/obj/item/weapon/storage/backpack/cultpack", "/obj/item/weapon/storage/backpack", {
	name: "trophy rack",
	desc: "It's useful for both carrying extra gear and proudly declaring your insanity.",
	icon_state: "cultpack",
	item_state: "backpack",
});
rt.type(5450, "/obj/item/weapon/storage/backpack/clown", "/obj/item/weapon/storage/backpack", {
	name: "Giggles von Honkerton",
	desc: "It's a backpack made by Honk! Co.",
	icon_state: "clownpack",
	item_state: "clownpack",
});
rt.type(5451, "/obj/item/weapon/storage/backpack/explorer", "/obj/item/weapon/storage/backpack", {
	name: "explorer bag",
	desc: "A robust backpack for stashing your loot.",
	icon_state: "explorerpack",
	item_state: "explorerpack",
});
rt.type(5452, "/obj/item/weapon/storage/backpack/mime", "/obj/item/weapon/storage/backpack", {
	name: "Parcel Parceaux",
	desc: "A silent backpack made for those silent workers. Silence Co.",
	icon_state: "mimepack",
	item_state: "mimepack",
});
rt.type(5453, "/obj/item/weapon/storage/backpack/medic", "/obj/item/weapon/storage/backpack", {
	name: "medical backpack",
	desc: "It's a backpack especially designed for use in a sterile environment.",
	icon_state: "medicalpack",
	item_state: "medicalpack",
});
rt.type(5454, "/obj/item/weapon/storage/backpack/security", "/obj/item/weapon/storage/backpack", {
	name: "security backpack",
	desc: "It's a very robust backpack.",
	icon_state: "securitypack",
	item_state: "securitypack",
});
rt.type(5455, "/obj/item/weapon/storage/backpack/captain", "/obj/item/weapon/storage/backpack", {
	name: "captain's backpack",
	desc: "It's a special backpack made exclusively for Nanotrasen officers.",
	icon_state: "captainpack",
	item_state: "captainpack",
	resistance_flags: 0,
});
rt.type(5456, "/obj/item/weapon/storage/backpack/industrial", "/obj/item/weapon/storage/backpack", {
	name: "industrial backpack",
	desc: "It's a tough backpack for the daily grind of station life.",
	icon_state: "engiepack",
	item_state: "engiepack",
	resistance_flags: 2,
});
rt.type(5457, "/obj/item/weapon/storage/backpack/botany", "/obj/item/weapon/storage/backpack", {
	name: "botany backpack",
	desc: "It's a backpack made of all-natural fibers.",
	icon_state: "botpack",
	item_state: "botpack",
});
rt.type(5458, "/obj/item/weapon/storage/backpack/chemistry", "/obj/item/weapon/storage/backpack", {
	name: "chemistry backpack",
	desc: "A backpack specially designed to repel stains and hazardous liquids.",
	icon_state: "chempack",
	item_state: "chempack",
});
rt.type(5459, "/obj/item/weapon/storage/backpack/genetics", "/obj/item/weapon/storage/backpack", {
	name: "genetics backpack",
	desc: "A bag designed to be super tough, just in case someone hulks out on you.",
	icon_state: "genepack",
	item_state: "genepack",
});
rt.type(5460, "/obj/item/weapon/storage/backpack/science", "/obj/item/weapon/storage/backpack", {
	name: "science backpack",
	desc: "A specially designed backpack. It's fire resistant and smells vaguely of plasma.",
	icon_state: "toxpack",
	item_state: "toxpack",
	resistance_flags: 0,
});
rt.type(5461, "/obj/item/weapon/storage/backpack/virology", "/obj/item/weapon/storage/backpack", {
	name: "virology backpack",
	desc: "A backpack made of hypo-allergenic fibers. It's designed to help prevent the spread of disease. Smells like monkey.",
	icon_state: "viropack",
	item_state: "viropack",
});
rt.type(5463, "/obj/item/weapon/storage/backpack/satchel/leather", "/obj/item/weapon/storage/backpack/satchel", {
	name: "leather satchel",
	desc: "It's a very fancy satchel made with fine leather.",
	icon_state: "satchel",
	resistance_flags: 0,
});
rt.type(5465, "/obj/item/weapon/storage/backpack/satchel/eng", "/obj/item/weapon/storage/backpack/satchel", {
	name: "industrial satchel",
	desc: "A tough satchel with extra pockets.",
	icon_state: "satchel-eng",
	item_state: "engiepack",
	resistance_flags: 0,
});
rt.type(5466, "/obj/item/weapon/storage/backpack/satchel/med", "/obj/item/weapon/storage/backpack/satchel", {
	name: "medical satchel",
	desc: "A sterile satchel used in medical departments.",
	icon_state: "satchel-med",
	item_state: "medicalpack",
});
rt.type(5467, "/obj/item/weapon/storage/backpack/satchel/vir", "/obj/item/weapon/storage/backpack/satchel", {
	name: "virologist satchel",
	desc: "A sterile satchel with virologist colours.",
	icon_state: "satchel-vir",
	item_state: "satchel-vir",
});
rt.type(5468, "/obj/item/weapon/storage/backpack/satchel/chem", "/obj/item/weapon/storage/backpack/satchel", {
	name: "chemist satchel",
	desc: "A sterile satchel with chemist colours.",
	icon_state: "satchel-chem",
	item_state: "satchel-chem",
});
rt.type(5469, "/obj/item/weapon/storage/backpack/satchel/gen", "/obj/item/weapon/storage/backpack/satchel", {
	name: "geneticist satchel",
	desc: "A sterile satchel with geneticist colours.",
	icon_state: "satchel-gen",
	item_state: "satchel-gen",
});
rt.type(5470, "/obj/item/weapon/storage/backpack/satchel/tox", "/obj/item/weapon/storage/backpack/satchel", {
	name: "scientist satchel",
	desc: "Useful for holding research materials.",
	icon_state: "satchel-tox",
	item_state: "satchel-tox",
	resistance_flags: 0,
});
rt.type(5471, "/obj/item/weapon/storage/backpack/satchel/hyd", "/obj/item/weapon/storage/backpack/satchel", {
	name: "botanist satchel",
	desc: "A satchel made of all natural fibers.",
	icon_state: "satchel-hyd",
	item_state: "satchel-hyd",
});
rt.type(5472, "/obj/item/weapon/storage/backpack/satchel/sec", "/obj/item/weapon/storage/backpack/satchel", {
	name: "security satchel",
	desc: "A robust satchel for security related needs.",
	icon_state: "satchel-sec",
	item_state: "securitypack",
});
rt.type(5473, "/obj/item/weapon/storage/backpack/satchel/explorer", "/obj/item/weapon/storage/backpack/satchel", {
	name: "explorer satchel",
	desc: "A robust satchel for stashing your loot.",
	icon_state: "satchel-explorer",
	item_state: "securitypack",
});
rt.type(5474, "/obj/item/weapon/storage/backpack/satchel/cap", "/obj/item/weapon/storage/backpack/satchel", {
	name: "captain's satchel",
	desc: "An exclusive satchel for Nanotrasen officers.",
	icon_state: "satchel-cap",
	item_state: "captainpack",
	resistance_flags: 0,
});
rt.type(5477, "/obj/item/weapon/storage/backpack/duffelbag", "/obj/item/weapon/storage/backpack", {
	name: "duffel bag",
	desc: "A large duffel bag for holding extra things.",
	icon_state: "duffel",
	item_state: "duffel",
	slowdown: 1,
	max_combined_w_class: 30,
});
rt.type(5478, "/obj/item/weapon/storage/backpack/duffelbag/captain", "/obj/item/weapon/storage/backpack/duffelbag", {
	name: "captain's duffel bag",
	desc: "A large duffel bag for holding extra captainly goods.",
	icon_state: "duffel-captain",
	item_state: "duffel-captain",
	resistance_flags: 0,
});
rt.type(5479, "/obj/item/weapon/storage/backpack/duffelbag/med", "/obj/item/weapon/storage/backpack/duffelbag", {
	name: "medical duffel bag",
	desc: "A large duffel bag for holding extra medical supplies.",
	icon_state: "duffel-med",
	item_state: "duffel-med",
});
rt.type(5481, "/obj/item/weapon/storage/backpack/duffelbag/sec", "/obj/item/weapon/storage/backpack/duffelbag", {
	name: "security duffel bag",
	desc: "A large duffel bag for holding extra security supplies and ammunition.",
	icon_state: "duffel-sec",
	item_state: "duffel-sec",
});
rt.type(5483, "/obj/item/weapon/storage/backpack/duffelbag/engineering", "/obj/item/weapon/storage/backpack/duffelbag", {
	name: "industrial duffel bag",
	desc: "A large duffel bag for holding extra tools and supplies.",
	icon_state: "duffel-eng",
	item_state: "duffel-eng",
	resistance_flags: 0,
});
rt.type(5485, "/obj/item/weapon/storage/backpack/duffelbag/clown", "/obj/item/weapon/storage/backpack/duffelbag", {
	name: "clown's duffel bag",
	desc: "A large duffel bag for holding lots of funny gags!",
	icon_state: "duffel-clown",
	item_state: "duffel-clown",
});
rt.type(5487, "/obj/item/weapon/storage/backpack/duffelbag/syndie", "/obj/item/weapon/storage/backpack/duffelbag", {
	name: "suspicious looking duffel bag",
	desc: "A large duffel bag for holding extra tactical supplies.",
	icon_state: "duffel-syndie",
	item_state: "duffel-syndie",
	origin_tech: "syndicate=1",
	silent: 1,
	slowdown: 0,
});
rt.type(5489, "/obj/item/weapon/storage/backpack/duffelbag/syndie/med", "/obj/item/weapon/storage/backpack/duffelbag/syndie", {
	name: "medical duffel bag",
	desc: "A large duffel bag for holding extra tactical medical supplies.",
	icon_state: "duffel-syndiemed",
	item_state: "duffel-syndiemed",
});
rt.type(5493, "/obj/item/weapon/storage/backpack/duffelbag/syndie/ammo", "/obj/item/weapon/storage/backpack/duffelbag/syndie", {
	name: "ammunition duffel bag",
	desc: "A large duffel bag for holding extra weapons ammunition and supplies.",
	icon_state: "duffel-syndieammo",
	item_state: "duffel-syndieammo",
});
rt.type(5503, "/obj/item/weapon/storage/backpack/shared", "/obj/item/weapon/storage/backpack", {
	name: "paradox bag",
	desc: "Somehow, it's in two places at once.",
	max_combined_w_class: 60,
	max_w_class: 3,
});
rt.type(5517, "/obj/item/weapon/storage/internal/pocket/big", "/obj/item/weapon/storage/internal/pocket", {
	max_w_class: 3,
});
rt.type(5518, "/obj/item/weapon/storage/internal/pocket/small", "/obj/item/weapon/storage/internal/pocket", {
	priority: 0,
	storage_slots: 1,
});
rt.type(5520, "/obj/item/weapon/storage/internal/pocket/tiny", "/obj/item/weapon/storage/internal/pocket", {
	priority: 0,
	storage_slots: 1,
	max_w_class: 1,
});
rt.type(5526, "/obj/item/weapon/storage/bag", "/obj/item/weapon/storage", {
	allow_quick_gather: 1,
	allow_quick_empty: 1,
	display_contents_with_number: 1,
	use_to_pickup: 1,
	slot_flags: 512,
});
rt.type(5528, "/obj/item/weapon/storage/bag/trash/cyborg", "/obj/item/weapon/storage/bag/trash", {});
rt.type(5529, "/obj/item/weapon/storage/bag/trash/bluespace", "/obj/item/weapon/storage/bag/trash", {
	name: "trash bag of holding",
	desc: "The latest and greatest in custodial convenience, a trashbag that is capable of holding vast quantities of garbage.",
	icon_state: "bluetrashbag",
	origin_tech: "materials=4;bluespace=4;engineering=4;plasmatech=3",
	max_combined_w_class: 60,
	storage_slots: 60,
});
rt.type(5531, "/obj/item/weapon/storage/bag/ore/cyborg", "/obj/item/weapon/storage/bag/ore", {
	name: "cyborg mining satchel",
});
rt.type(5532, "/obj/item/weapon/storage/bag/ore/holding", "/obj/item/weapon/storage/bag/ore", {
	name: "mining satchel of holding",
	desc: "A revolution in convenience, this satchel allows for huge amounts of ore storage. It's been outfitted with anti-malfunction safety measures.",
	storage_slots: 1e+31,
	max_combined_w_class: 1e+31,
	origin_tech: "bluespace=4;materials=3;engineering=3",
	icon_state: "satchel_bspace",
});
rt.type(5536, "/obj/item/weapon/storage/bag/sheetsnatcher/borg", "/obj/item/weapon/storage/bag/sheetsnatcher", {
	capacity: 500,
	name: "sheet snatcher 9000",
	desc: "",
});
rt.type(5554, "/obj/item/weapon/storage/fancy/candle_box", "/obj/item/weapon/storage/fancy", {
	icon_type: "candle",
	fancy_open: 1,
	name: "candle pack",
	desc: "A pack of red candles.",
	icon: rt.rsc("icons/obj/candle.dmi"),
	icon_state: "candlebox5",
	item_state: "candlebox5",
	storage_slots: 5,
	throwforce: 2,
	slot_flags: 512,
	spawn_type: rt.typePath("/obj/item/candle"),
});
rt.type(5556, "/obj/item/weapon/storage/fancy/cigarettes/dromedaryco", "/obj/item/weapon/storage/fancy/cigarettes", {
	name: "１DromedaryCo packet",
	desc: "A packet of six imported DromedaryCo cancer sticks. A label on the packaging reads, \"Wouldn't a slow death make a change?\"",
	icon_state: "dromedary",
	spawn_type: rt.typePath("/obj/item/clothing/mask/cigarette/dromedary"),
});
rt.type(5557, "/obj/item/weapon/storage/fancy/cigarettes/cigpack_uplift", "/obj/item/weapon/storage/fancy/cigarettes", {
	name: "１Uplift Smooth packet",
	desc: "Your favorite brand, now menthol flavored.",
	icon_state: "uplift",
	spawn_type: rt.typePath("/obj/item/clothing/mask/cigarette/uplift"),
});
rt.type(5558, "/obj/item/weapon/storage/fancy/cigarettes/cigpack_robust", "/obj/item/weapon/storage/fancy/cigarettes", {
	name: "１Robust packet",
	desc: "Smoked by the robust.",
	icon_state: "robust",
	spawn_type: rt.typePath("/obj/item/clothing/mask/cigarette/robust"),
});
rt.type(5559, "/obj/item/weapon/storage/fancy/cigarettes/cigpack_robustgold", "/obj/item/weapon/storage/fancy/cigarettes", {
	name: "１Robust Gold packet",
	desc: "Smoked by the truly robust.",
	icon_state: "robustg",
	spawn_type: rt.typePath("/obj/item/clothing/mask/cigarette/robustgold"),
});
rt.type(5560, "/obj/item/weapon/storage/fancy/cigarettes/cigpack_carp", "/obj/item/weapon/storage/fancy/cigarettes", {
	name: "１Carp Classic packet",
	desc: "Since 2313.",
	icon_state: "carp",
	spawn_type: rt.typePath("/obj/item/clothing/mask/cigarette/carp"),
});
rt.type(5561, "/obj/item/weapon/storage/fancy/cigarettes/cigpack_syndicate", "/obj/item/weapon/storage/fancy/cigarettes", {
	name: "cigarette packet",
	desc: "An obscure brand of cigarettes.",
	icon_state: "syndie",
	spawn_type: rt.typePath("/obj/item/clothing/mask/cigarette/syndicate"),
});
rt.type(5562, "/obj/item/weapon/storage/fancy/cigarettes/cigpack_midori", "/obj/item/weapon/storage/fancy/cigarettes", {
	name: "１Midori Tabako packet",
	desc: "You can't understand the runes, but the packet smells funny.",
	icon_state: "midori",
	spawn_type: rt.typePath("/obj/item/clothing/mask/cigarette/rollie"),
});
rt.type(5563, "/obj/item/weapon/storage/fancy/cigarettes/cigpack_shadyjims", "/obj/item/weapon/storage/fancy/cigarettes", {
	name: "１Shady Jim's Super Slims packet",
	desc: "Is your weight slowing you down? Having trouble running away from gravitational singularities? Can't stop stuffing your mouth? Smoke Shady Jim's Super Slims and watch all that fat burn away. Guaranteed results!",
	icon_state: "shadyjim",
	spawn_type: rt.typePath("/obj/item/clothing/mask/cigarette/shadyjims"),
});
rt.type(5565, "/obj/item/weapon/storage/fancy/cigarettes/cigars/cohiba", "/obj/item/weapon/storage/fancy/cigarettes/cigars", {
	name: "１cohiba robusto cigar case",
	desc: "A case of imported Cohiba cigars, renowned for their strong flavor.",
	spawn_type: rt.typePath("/obj/item/clothing/mask/cigarette/cigar/cohiba"),
});
rt.type(5566, "/obj/item/weapon/storage/fancy/cigarettes/cigars/havana", "/obj/item/weapon/storage/fancy/cigarettes/cigars", {
	name: "１premium havanian cigar case",
	desc: "A case of classy Havanian cigars.",
	spawn_type: rt.typePath("/obj/item/clothing/mask/cigarette/cigar/havana"),
});
rt.type(5586, "/obj/item/weapon/storage/secure/safe/HoS", "/obj/item/weapon/storage/secure/safe", {
	name: "head of security's safe",
});
rt.type(5590, "/obj/item/weapon/storage/toolbox/emergency/old", "/obj/item/weapon/storage/toolbox/emergency", {
	has_latches: 0,
	name: "rusty red toolbox",
	icon_state: "toolbox_red_old",
});
rt.type(5592, "/obj/item/weapon/storage/toolbox/mechanical/old", "/obj/item/weapon/storage/toolbox/mechanical", {
	has_latches: 0,
	name: "rusty blue toolbox",
	icon_state: "toolbox_blue_old",
});
rt.type(5596, "/obj/item/weapon/storage/toolbox/brass", "/obj/item/weapon/storage/toolbox", {
	fabricator_type: rt.typePath("/obj/item/clockwork/replica_fabricator/scarab"),
	has_latches: 0,
	max_w_class: 3,
	max_combined_w_class: 28,
	storage_slots: 28,
	name: "brass box",
	desc: "A huge brass box with several indentations in its surface.",
	icon_state: "brassbox",
	item_state: null,
	resistance_flags: 34,
	w_class: 5,
	attack_verb: null,
});
rt.type(5599, "/obj/item/weapon/storage/toolbox/brass/prefilled/ratvar/admin", "/obj/item/weapon/storage/toolbox/brass/prefilled/ratvar", {
	slab_type: rt.typePath("/obj/item/clockwork/slab/debug"),
	fabricator_type: rt.typePath("/obj/item/clockwork/replica_fabricator/scarab/debug"),
});
