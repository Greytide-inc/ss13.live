// Types declared in code/game/objects/structures that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(625, "/datum/outfit/hotelstaff/security", "/datum/outfit/hotelstaff", {
	name: "Hotel Secuirty",
	uniform: rt.typePath("/obj/item/clothing/under/rank/security/blueshirt"),
	shoes: rt.typePath("/obj/item/clothing/shoes/jackboots"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/vest/blueshirt"),
	head: rt.typePath("/obj/item/clothing/head/helmet/blueshirt"),
	back: rt.typePath("/obj/item/weapon/storage/backpack/security"),
	belt: rt.typePath("/obj/item/weapon/storage/belt/security/full"),
});
rt.type(628, "/datum/outfit/syndicate_empty/SBC", "/datum/outfit/syndicate_empty", {
	name: "Syndicate Battlecruiser Ship Operative",
	l_pocket: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/pistol"),
	r_pocket: rt.typePath("/obj/item/weapon/kitchen/knife/combat/survival"),
	belt: rt.typePath("/obj/item/weapon/storage/belt/military/assault"),
});
rt.type(629, "/datum/outfit/syndicate_empty/SBC/assault", "/datum/outfit/syndicate_empty/SBC", {
	name: "Syndicate Battlecruiser Assault Operative",
	uniform: rt.typePath("/obj/item/clothing/under/syndicate/combat"),
	l_pocket: rt.typePath("/obj/item/ammo_box/magazine/m10mm"),
	r_pocket: rt.typePath("/obj/item/weapon/kitchen/knife/combat/survival"),
	belt: rt.typePath("/obj/item/weapon/storage/belt/military"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/vest"),
	suit_store: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/pistol"),
	back: rt.typePath("/obj/item/weapon/storage/backpack/security"),
	mask: rt.typePath("/obj/item/clothing/mask/gas/syndicate"),
});
rt.type(630, "/datum/outfit/syndicate_empty/SBC/assault/captain", "/datum/outfit/syndicate_empty/SBC/assault", {
	name: "Syndicate Battlecruiser Captain",
	l_pocket: rt.typePath("/obj/item/weapon/melee/energy/sword/saber/red"),
	r_pocket: rt.typePath("/obj/item/weapon/melee/classic_baton/telescopic"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/vest/capcarapace/syndicate"),
	suit_store: rt.typePath("/obj/item/weapon/gun/ballistic/revolver/mateba"),
	back: rt.typePath("/obj/item/weapon/storage/backpack/satchel/leather"),
	head: rt.typePath("/obj/item/clothing/head/HoS/syndicate"),
	mask: rt.typePath("/obj/item/clothing/mask/cigarette/cigar/havana"),
	glasses: rt.typePath("/obj/item/clothing/glasses/thermal/eyepatch"),
});
rt.type(5630, "/obj/item/weapon/twohanded/required/kirbyplants/dead", "/obj/item/weapon/twohanded/required/kirbyplants", {
	name: "RD's potted plant",
	desc: "A gift from the botanical staff, presented after the RD's reassignment. There's a tag on it that says \"Y'all come back now, y'hear?\"\nIt doesn't look very healthy...",
	icon_state: "plant-25",
});
rt.type(6952, "/obj/item/weapon/bedsheet/blue", "/obj/item/weapon/bedsheet", {
	icon_state: "sheetblue",
	item_color: "blue",
});
rt.type(6953, "/obj/item/weapon/bedsheet/green", "/obj/item/weapon/bedsheet", {
	icon_state: "sheetgreen",
	item_color: "green",
});
rt.type(6954, "/obj/item/weapon/bedsheet/grey", "/obj/item/weapon/bedsheet", {
	icon_state: "sheetgrey",
	item_color: "grey",
});
rt.type(6955, "/obj/item/weapon/bedsheet/orange", "/obj/item/weapon/bedsheet", {
	icon_state: "sheetorange",
	item_color: "orange",
});
rt.type(6956, "/obj/item/weapon/bedsheet/purple", "/obj/item/weapon/bedsheet", {
	icon_state: "sheetpurple",
	item_color: "purple",
});
rt.type(6957, "/obj/item/weapon/bedsheet/patriot", "/obj/item/weapon/bedsheet", {
	name: "patriotic bedsheet",
	desc: "You've never felt more free than when sleeping on this.",
	icon_state: "sheetUSA",
	item_color: "sheetUSA",
});
rt.type(6958, "/obj/item/weapon/bedsheet/rainbow", "/obj/item/weapon/bedsheet", {
	name: "rainbow bedsheet",
	desc: "A multicolored blanket. It's actually several different sheets cut up and sewn together.",
	icon_state: "sheetrainbow",
	item_color: "rainbow",
});
rt.type(6959, "/obj/item/weapon/bedsheet/red", "/obj/item/weapon/bedsheet", {
	icon_state: "sheetred",
	item_color: "red",
});
rt.type(6960, "/obj/item/weapon/bedsheet/yellow", "/obj/item/weapon/bedsheet", {
	icon_state: "sheetyellow",
	item_color: "yellow",
});
rt.type(6961, "/obj/item/weapon/bedsheet/mime", "/obj/item/weapon/bedsheet", {
	name: "mime's blanket",
	desc: "A very soothing striped blanket.  All the noise just seems to fade out when you're under the covers in this.",
	icon_state: "sheetmime",
	item_color: "mime",
});
rt.type(6962, "/obj/item/weapon/bedsheet/clown", "/obj/item/weapon/bedsheet", {
	name: "clown's blanket",
	desc: "A rainbow blanket with a clown mask woven in. It smells faintly of bananas.",
	icon_state: "sheetclown",
	item_color: "clown",
});
rt.type(6963, "/obj/item/weapon/bedsheet/captain", "/obj/item/weapon/bedsheet", {
	name: "captain's bedsheet",
	desc: "It has a Nanotrasen symbol on it, and was woven with a revolutionary new kind of thread guaranteed to have 0.01% permeability for most non-chemical substances, popular among most modern captains.",
	icon_state: "sheetcaptain",
	item_color: "captain",
});
rt.type(6964, "/obj/item/weapon/bedsheet/rd", "/obj/item/weapon/bedsheet", {
	name: "research director's bedsheet",
	desc: "It appears to have a beaker emblem, and is made out of fire-resistant material, although it probably won't protect you in the event of fires you're familiar with every day.",
	icon_state: "sheetrd",
	item_color: "director",
});
rt.type(6965, "/obj/item/weapon/bedsheet/rd/royal_cape", "/obj/item/weapon/bedsheet/rd", {
	name: "Royal Cape of the Liberator",
	desc: "Majestic.",
});
rt.type(6966, "/obj/item/weapon/bedsheet/medical", "/obj/item/weapon/bedsheet", {
	name: "medical blanket",
	desc: "It's a sterilized* blanket commonly used in the Medbay.  *Sterilization is voided if a virologist is present onboard the station.",
	icon_state: "sheetmedical",
	item_color: "medical",
});
rt.type(6967, "/obj/item/weapon/bedsheet/cmo", "/obj/item/weapon/bedsheet", {
	name: "chief medical officer's bedsheet",
	desc: "It's a sterilized blanket that has a cross emblem. There's some cat fur on it, likely from Runtime.",
	icon_state: "sheetcmo",
	item_color: "cmo",
});
rt.type(6968, "/obj/item/weapon/bedsheet/hos", "/obj/item/weapon/bedsheet", {
	name: "head of security's bedsheet",
	desc: "It is decorated with a shield emblem. While crime doesn't sleep, you do, but you are still THE LAW!",
	icon_state: "sheethos",
	item_color: "hosred",
});
rt.type(6969, "/obj/item/weapon/bedsheet/hop", "/obj/item/weapon/bedsheet", {
	name: "head of personnel's bedsheet",
	desc: "It is decorated with a key emblem. For those rare moments when you can rest and cuddle with Ian without someone screaming for you over the radio.",
	icon_state: "sheethop",
	item_color: "hop",
});
rt.type(6970, "/obj/item/weapon/bedsheet/ce", "/obj/item/weapon/bedsheet", {
	name: "chief engineer's bedsheet",
	desc: "It is decorated with a wrench emblem. It's highly reflective and stain resistant, so you don't need to worry about ruining it with oil.",
	icon_state: "sheetce",
	item_color: "chief",
});
rt.type(6971, "/obj/item/weapon/bedsheet/qm", "/obj/item/weapon/bedsheet", {
	name: "quartermaster's bedsheet",
	desc: "It is decorated with a crate emblem in silver lining.  It's rather tough, and just the thing to lie on after a hard day of pushing paper.",
	icon_state: "sheetqm",
	item_color: "qm",
});
rt.type(6972, "/obj/item/weapon/bedsheet/brown", "/obj/item/weapon/bedsheet", {
	icon_state: "sheetbrown",
	item_color: "cargo",
});
rt.type(6973, "/obj/item/weapon/bedsheet/black", "/obj/item/weapon/bedsheet", {
	icon_state: "sheetblack",
	item_color: "black",
});
rt.type(6974, "/obj/item/weapon/bedsheet/centcom", "/obj/item/weapon/bedsheet", {
	name: "１Centcom bedsheet",
	desc: "Woven with advanced nanothread for warmth as well as being very decorated, essential for all officials.",
	icon_state: "sheetcentcom",
	item_color: "centcom",
});
rt.type(6975, "/obj/item/weapon/bedsheet/syndie", "/obj/item/weapon/bedsheet", {
	name: "syndicate bedsheet",
	desc: "It has a syndicate emblem and it has an aura of evil.",
	icon_state: "sheetsyndie",
	item_color: "syndie",
});
rt.type(6976, "/obj/item/weapon/bedsheet/cult", "/obj/item/weapon/bedsheet", {
	name: "cultist's bedsheet",
	desc: "You might dream of Nar'Sie if you sleep with this. It seems rather tattered and glows of an eldritch presence.",
	icon_state: "sheetcult",
	item_color: "cult",
});
rt.type(6977, "/obj/item/weapon/bedsheet/wiz", "/obj/item/weapon/bedsheet", {
	name: "wizard's bedsheet",
	desc: "A special fabric enchanted with magic so you can have an enchanted night. It even glows!",
	icon_state: "sheetwiz",
	item_color: "wiz",
});
rt.type(6978, "/obj/item/weapon/bedsheet/nanotrasen", "/obj/item/weapon/bedsheet", {
	name: "nanotrasen bedsheet",
	desc: "It has the Nanotrasen logo on it and has an aura of duty.",
	icon_state: "sheetNT",
	item_color: "nanotrasen",
});
rt.type(6979, "/obj/item/weapon/bedsheet/ian", "/obj/item/weapon/bedsheet", {
	icon_state: "sheetian",
	item_color: "ian",
});
rt.type(7475, "/obj/item/weapon/canvas/nineteenXnineteen", "/obj/item/weapon/canvas", {
	whichGlobalBackup: 2,
	icon_state: "19x19",
});
rt.type(7476, "/obj/item/weapon/canvas/twentythreeXnineteen", "/obj/item/weapon/canvas", {
	whichGlobalBackup: 3,
	icon_state: "23x19",
});
rt.type(7477, "/obj/item/weapon/canvas/twentythreeXtwentythree", "/obj/item/weapon/canvas", {
	whichGlobalBackup: 4,
	icon_state: "23x23",
});
rt.type(11960, "/obj/effect/mob_spawn/human/golem/servant", "/obj/effect/mob_spawn/human/golem", {
	has_owner: 1,
	name: "inert servant golem shell",
});
rt.type(11961, "/obj/effect/mob_spawn/human/golem/adamantine", "/obj/effect/mob_spawn/human/golem", {
	can_transfer: 0,
	name: "dust-caked free golem shell",
	desc: "A humanoid shape, empty, lifeless, and full of potential.",
	mob_name: "a free golem",
	mob_species: rt.typePath("/datum/species/golem/adamantine"),
});
rt.type(11968, "/obj/effect/mob_spawn/human/hotel_staff/security", "/obj/effect/mob_spawn/human/hotel_staff", {
	name: "hotel security sleeper",
	mob_name: "hotel security memeber",
	outfit: rt.typePath("/datum/outfit/hotelstaff/security"),
	flavour_text: "You are a peacekeeper assigned to this hotel to protect the intrests of the company while keeping the peace between guests and the staff.Do <font size=6><b>NOT</b></font> leave the hotel, as that is grounds for contract termination.",
	objectives: "Do not leave your assigned hotel. Try and keep the peace between staff and guests, non-lethal force heavily advised if possible.",
});
rt.type(11971, "/obj/effect/mob_spawn/human/syndicate/battlecruiser", "/obj/effect/mob_spawn/human/syndicate", {
	name: "Syndicate Battlecruiser Ship Operative",
	flavour_text: "<font size=3>You are a crewmember aboard the syndicate flagship: the SBC Starfury. <span class='danger'><b>Your job is to follow your captain's orders, maintain the ship, and keep the engine running.</b></span> If you are not familiar with how the supermatter engine functions: <b>do not attempt to start it.</b><br><br><span class='danger'><b>The armory is not a candy store, and your role is not to assault the station directly, leave that work to the assault operatives.</b></span></font>",
	outfit: rt.typePath("/datum/outfit/syndicate_empty/SBC"),
});
rt.type(11972, "/obj/effect/mob_spawn/human/syndicate/battlecruiser/assault", "/obj/effect/mob_spawn/human/syndicate/battlecruiser", {
	name: "Syndicate Battlecruiser Assault Operative",
	flavour_text: "<font size=3>You are an assault operative aboard the syndicate flagship: the SBC Starfury. <span class='danger'><b>Your job is to follow your captain's orders, keep intruders out of the ship, and assault Space Station 13.</b></span> There is an armory, multiple assault ships, and beam cannons to attack the station with.<br><br><span class='danger'><b>Work as a team with your fellow operatives and work out a plan of attack. If you are overwhelmed, escape back to your ship!</b></span></font>",
	outfit: rt.typePath("/datum/outfit/syndicate_empty/SBC/assault"),
});
rt.type(11973, "/obj/effect/mob_spawn/human/syndicate/battlecruiser/captain", "/obj/effect/mob_spawn/human/syndicate/battlecruiser", {
	name: "Syndicate Battlecruiser Captain",
	flavour_text: "<font size=3>You are the captain aboard the syndicate flagship: the SBC Starfury. <span class='danger'><b>Your job is to oversee your crew, defend the ship, and destroy Space Station 13.</b></span> The ship has an armory, multiple ships, beam cannons, and multiple crewmembers to accomplish this goal.<br><br><span class='danger'><b>As the captain, this whole operation falls on your shoulders.</b></span> You do not need to nuke the station, causing sufficient damage and preventing your ship from being destroyed will be enough.</font>",
	outfit: rt.typePath("/datum/outfit/syndicate_empty/SBC/assault/captain"),
	id_access_list: null,
});
rt.type(12174, "/obj/structure/falsewall/reinforced", "/obj/structure/falsewall", {
	name: "reinforced wall",
	desc: "A huge chunk of reinforced metal used to separate rooms.",
	icon: rt.rsc("icons/turf/walls/reinforced_wall.dmi"),
	icon_state: "r_wall",
	walltype: rt.typePath("/turf/closed/wall/r_wall"),
	mineral: rt.typePath("/obj/item/stack/sheet/plasteel"),
});
rt.type(12186, "/obj/structure/falsewall/plastitanium", "/obj/structure/falsewall", {
	mineral: rt.typePath("/obj/item/stack/sheet/mineral/plastitanium"),
	walltype: rt.typePath("/turf/closed/wall/mineral/plastitanium"),
	smooth: 0,
	name: "wall",
	desc: "An evil wall of plasma and titanium.",
	icon: rt.rsc("icons/turf/shuttle.dmi"),
	icon_state: "wall3",
});
rt.type(12202, "/obj/structure/table/survival_pod", "/obj/structure/table", {
	smooth: 0,
	icon: rt.rsc("icons/obj/lavaland/survival_pod.dmi"),
	icon_state: "table",
});
rt.type(12210, "/obj/structure/window/reinforced/clockwork/unanchored", "/obj/structure/window/reinforced/clockwork", {
	anchored: 0,
});
rt.type(12211, "/obj/structure/window/reinforced/clockwork/fulltile", "/obj/structure/window/reinforced/clockwork", {
	smooth: 1,
	canSmoothWith: null,
	flags: 32768,
	level: 3,
	icon_state: "clockwork_window",
	fulltile: 1,
	dir: 5,
	max_integrity: 120,
	glass_amount: 2,
});
rt.type(12212, "/obj/structure/window/reinforced/clockwork/fulltile/unanchored", "/obj/structure/window/reinforced/clockwork/fulltile", {
	anchored: 0,
});
rt.type(12213, "/obj/structure/window/reinforced/unanchored", "/obj/structure/window/reinforced", {
	anchored: 0,
});
rt.type(12214, "/obj/structure/window/reinforced/tinted", "/obj/structure/window/reinforced", {
	name: "tinted window",
	icon_state: "twindow",
	opacity: 1,
});
rt.type(12215, "/obj/structure/window/reinforced/tinted/frosted", "/obj/structure/window/reinforced/tinted", {
	name: "frosted window",
	icon_state: "fwindow",
});
rt.type(12217, "/obj/structure/window/reinforced/highpressure", "/obj/structure/window/reinforced", {
	pressure_resistance: 405.3,
	name: "high pressure window",
	max_integrity: 1000,
	heat_resistance: 50000,
});
rt.type(12220, "/obj/structure/window/reinforced/fulltile/unanchored", "/obj/structure/window/reinforced/fulltile", {
	anchored: 0,
});
rt.type(12222, "/obj/structure/window/reinforced/survival_pod", "/obj/structure/window/reinforced", {
	name: "pod window",
	icon: rt.rsc("icons/obj/lavaland/survival_pod.dmi"),
	icon_state: "pwindow",
});
rt.type(12223, "/obj/structure/window/unanchored", "/obj/structure/window", {
	anchored: 0,
});
rt.type(12225, "/obj/structure/window/fulltile/unanchored", "/obj/structure/window/fulltile", {
	anchored: 0,
});
rt.type(12227, "/obj/structure/window/shuttle/tinted", "/obj/structure/window/shuttle", {
	opacity: 1,
});
rt.type(12232, "/obj/structure/grille/ratvar/broken", "/obj/structure/grille/ratvar", {
	icon_state: "brokenratvargrille",
	density: 0,
	obj_integrity: 20,
	broken: 1,
	rods_amount: 1,
	rods_broken: 0,
	grille_type: rt.typePath("/obj/structure/grille/ratvar"),
	broken_type: null,
});
rt.type(12233, "/obj/structure/grille/broken", "/obj/structure/grille", {
	rods_amount: 1,
	rods_broken: 0,
	grille_type: rt.typePath("/obj/structure/grille"),
	icon_state: "brokengrille",
	density: 0,
	obj_integrity: 20,
	broken: 1,
	broken_type: null,
});
rt.type(12239, "/obj/structure/lattice/catwalk/swarmer_catwalk", "/obj/structure/lattice/catwalk", {
	name: "swarmer catwalk",
	desc: "a catwalk-like mesh, produced by swarmers to allow them to navigate hostile terrain.",
	icon: rt.rsc("icons/obj/smooth_structures/swarmer_catwalk.dmi"),
	icon_state: "swarmer_catwalk",
});
rt.type(12241, "/obj/structure/girder/displaced", "/obj/structure/girder", {
	anchored: 0,
	state: 3,
	girderpasschance: 25,
	name: "displaced girder",
	icon_state: "displaced",
	obj_integrity: 120,
	max_integrity: 120,
});
rt.type(12242, "/obj/structure/girder/reinforced", "/obj/structure/girder", {
	state: 2,
	girderpasschance: 0,
	name: "reinforced girder",
	icon_state: "reinforced",
	obj_integrity: 350,
	max_integrity: 350,
});
rt.type(12412, "/obj/structure/door_assembly/door_assembly_0", "/obj/structure/door_assembly", {
	airlock_type: rt.typePath("/obj/machinery/door/airlock"),
	anchored: 1,
	state: 1,
	name: "airlock assembly",
});
rt.type(12413, "/obj/structure/door_assembly/door_assembly_com", "/obj/structure/door_assembly", {
	typetext: "command",
	icontext: "com",
	glass_type: rt.typePath("/obj/machinery/door/airlock/glass_command"),
	airlock_type: rt.typePath("/obj/machinery/door/airlock/command"),
	anchored: 1,
	state: 1,
	name: "command airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/command.dmi"),
});
rt.type(12414, "/obj/structure/door_assembly/door_assembly_com/glass", "/obj/structure/door_assembly/door_assembly_com", {
	mineral: "glass",
	material: "glass",
});
rt.type(12415, "/obj/structure/door_assembly/door_assembly_sec", "/obj/structure/door_assembly", {
	typetext: "security",
	icontext: "sec",
	glass_type: rt.typePath("/obj/machinery/door/airlock/glass_security"),
	airlock_type: rt.typePath("/obj/machinery/door/airlock/security"),
	anchored: 1,
	state: 1,
	name: "security airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/security.dmi"),
});
rt.type(12416, "/obj/structure/door_assembly/door_assembly_sec/glass", "/obj/structure/door_assembly/door_assembly_sec", {
	mineral: "glass",
	material: "glass",
});
rt.type(12417, "/obj/structure/door_assembly/door_assembly_eng", "/obj/structure/door_assembly", {
	typetext: "engineering",
	icontext: "eng",
	glass_type: rt.typePath("/obj/machinery/door/airlock/glass_engineering"),
	airlock_type: rt.typePath("/obj/machinery/door/airlock/engineering"),
	anchored: 1,
	state: 1,
	name: "engineering airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/engineering.dmi"),
});
rt.type(12418, "/obj/structure/door_assembly/door_assembly_eng/glass", "/obj/structure/door_assembly/door_assembly_eng", {
	mineral: "glass",
	material: "glass",
});
rt.type(12419, "/obj/structure/door_assembly/door_assembly_min", "/obj/structure/door_assembly", {
	typetext: "mining",
	icontext: "min",
	glass_type: rt.typePath("/obj/machinery/door/airlock/glass_mining"),
	airlock_type: rt.typePath("/obj/machinery/door/airlock/mining"),
	anchored: 1,
	state: 1,
	name: "mining airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/mining.dmi"),
});
rt.type(12420, "/obj/structure/door_assembly/door_assembly_min/glass", "/obj/structure/door_assembly/door_assembly_min", {
	mineral: "glass",
	material: "glass",
});
rt.type(12421, "/obj/structure/door_assembly/door_assembly_atmo", "/obj/structure/door_assembly", {
	typetext: "atmos",
	icontext: "atmo",
	glass_type: rt.typePath("/obj/machinery/door/airlock/glass_atmos"),
	airlock_type: rt.typePath("/obj/machinery/door/airlock/atmos"),
	anchored: 1,
	state: 1,
	name: "atmospherics airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/atmos.dmi"),
});
rt.type(12422, "/obj/structure/door_assembly/door_assembly_atmo/glass", "/obj/structure/door_assembly/door_assembly_atmo", {
	mineral: "glass",
	material: "glass",
});
rt.type(12423, "/obj/structure/door_assembly/door_assembly_research", "/obj/structure/door_assembly", {
	typetext: "research",
	icontext: "res",
	glass_type: rt.typePath("/obj/machinery/door/airlock/glass_research"),
	airlock_type: rt.typePath("/obj/machinery/door/airlock/research"),
	anchored: 1,
	state: 1,
	name: "research airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/research.dmi"),
});
rt.type(12424, "/obj/structure/door_assembly/door_assembly_research/glass", "/obj/structure/door_assembly/door_assembly_research", {
	mineral: "glass",
	material: "glass",
});
rt.type(12425, "/obj/structure/door_assembly/door_assembly_science", "/obj/structure/door_assembly", {
	typetext: "science",
	icontext: "sci",
	glass_type: rt.typePath("/obj/machinery/door/airlock/glass_science"),
	airlock_type: rt.typePath("/obj/machinery/door/airlock/science"),
	anchored: 1,
	state: 1,
	name: "science airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/science.dmi"),
});
rt.type(12426, "/obj/structure/door_assembly/door_assembly_science/glass", "/obj/structure/door_assembly/door_assembly_science", {
	mineral: "glass",
	material: "glass",
});
rt.type(12427, "/obj/structure/door_assembly/door_assembly_med", "/obj/structure/door_assembly", {
	typetext: "medical",
	icontext: "med",
	glass_type: rt.typePath("/obj/machinery/door/airlock/glass_medical"),
	airlock_type: rt.typePath("/obj/machinery/door/airlock/medical"),
	anchored: 1,
	state: 1,
	name: "medical airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/medical.dmi"),
});
rt.type(12428, "/obj/structure/door_assembly/door_assembly_med/glass", "/obj/structure/door_assembly/door_assembly_med", {
	mineral: "glass",
	material: "glass",
});
rt.type(12429, "/obj/structure/door_assembly/door_assembly_mai", "/obj/structure/door_assembly", {
	typetext: "maintenance",
	icontext: "mai",
	glass_type: rt.typePath("/obj/machinery/door/airlock/glass_maintenance"),
	airlock_type: rt.typePath("/obj/machinery/door/airlock/maintenance"),
	anchored: 1,
	state: 1,
	name: "maintenance airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/maintenance.dmi"),
});
rt.type(12430, "/obj/structure/door_assembly/door_assembly_mai/glass", "/obj/structure/door_assembly/door_assembly_mai", {
	mineral: "glass",
	material: "glass",
});
rt.type(12431, "/obj/structure/door_assembly/door_assembly_ext", "/obj/structure/door_assembly", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/external/overlays.dmi"),
	typetext: "external",
	icontext: "ext",
	glass_type: rt.typePath("/obj/machinery/door/airlock/glass_external"),
	airlock_type: rt.typePath("/obj/machinery/door/airlock/external"),
	anchored: 1,
	state: 1,
	name: "external airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/external/external.dmi"),
});
rt.type(12432, "/obj/structure/door_assembly/door_assembly_ext/glass", "/obj/structure/door_assembly/door_assembly_ext", {
	mineral: "glass",
	material: "glass",
});
rt.type(12433, "/obj/structure/door_assembly/door_assembly_fre", "/obj/structure/door_assembly", {
	typetext: "freezer",
	icontext: "fre",
	airlock_type: rt.typePath("/obj/machinery/door/airlock/freezer"),
	anchored: 1,
	state: 1,
	name: "freezer airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/freezer.dmi"),
});
rt.type(12434, "/obj/structure/door_assembly/door_assembly_hatch", "/obj/structure/door_assembly", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/hatch/overlays.dmi"),
	typetext: "hatch",
	icontext: "hatch",
	airlock_type: rt.typePath("/obj/machinery/door/airlock/hatch"),
	anchored: 1,
	state: 1,
	name: "airtight hatch assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/hatch/centcom.dmi"),
});
rt.type(12435, "/obj/structure/door_assembly/door_assembly_mhatch", "/obj/structure/door_assembly", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/hatch/overlays.dmi"),
	typetext: "maintenance_hatch",
	icontext: "mhatch",
	airlock_type: rt.typePath("/obj/machinery/door/airlock/maintenance_hatch"),
	anchored: 1,
	state: 1,
	name: "maintenance hatch assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/hatch/maintenance.dmi"),
});
rt.type(12436, "/obj/structure/door_assembly/door_assembly_glass", "/obj/structure/door_assembly", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/station2/overlays.dmi"),
	airlock_type: rt.typePath("/obj/machinery/door/airlock/glass"),
	anchored: 1,
	state: 1,
	mineral: "glass",
	material: "glass",
	name: "glass airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station2/glass.dmi"),
});
rt.type(12437, "/obj/structure/door_assembly/door_assembly_gold", "/obj/structure/door_assembly", {
	airlock_type: rt.typePath("/obj/machinery/door/airlock/gold"),
	anchored: 1,
	state: 1,
	mineral: "gold",
	name: "gold airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/gold.dmi"),
});
rt.type(12438, "/obj/structure/door_assembly/door_assembly_silver", "/obj/structure/door_assembly", {
	airlock_type: rt.typePath("/obj/machinery/door/airlock/silver"),
	anchored: 1,
	state: 1,
	mineral: "silver",
	name: "silver airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/silver.dmi"),
});
rt.type(12439, "/obj/structure/door_assembly/door_assembly_diamond", "/obj/structure/door_assembly", {
	airlock_type: rt.typePath("/obj/machinery/door/airlock/diamond"),
	anchored: 1,
	state: 1,
	mineral: "diamond",
	name: "diamond airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/diamond.dmi"),
});
rt.type(12440, "/obj/structure/door_assembly/door_assembly_uranium", "/obj/structure/door_assembly", {
	airlock_type: rt.typePath("/obj/machinery/door/airlock/uranium"),
	anchored: 1,
	state: 1,
	mineral: "uranium",
	name: "uranium airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/uranium.dmi"),
});
rt.type(12441, "/obj/structure/door_assembly/door_assembly_plasma", "/obj/structure/door_assembly", {
	airlock_type: rt.typePath("/obj/machinery/door/airlock/plasma"),
	anchored: 1,
	state: 1,
	mineral: "plasma",
	name: "plasma airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/plasma.dmi"),
});
rt.type(12442, "/obj/structure/door_assembly/door_assembly_clown", "/obj/structure/door_assembly", {
	airlock_type: rt.typePath("/obj/machinery/door/airlock/clown"),
	anchored: 1,
	state: 1,
	mineral: "bananium",
	name: "bananium airlock assembly",
	desc: "Honk",
	icon: rt.rsc("icons/obj/doors/airlocks/station/bananium.dmi"),
});
rt.type(12443, "/obj/structure/door_assembly/door_assembly_sandstone", "/obj/structure/door_assembly", {
	airlock_type: rt.typePath("/obj/machinery/door/airlock/sandstone"),
	anchored: 1,
	state: 1,
	mineral: "sandstone",
	name: "sandstone airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/sandstone.dmi"),
});
rt.type(12444, "/obj/structure/door_assembly/door_assembly_titanium", "/obj/structure/door_assembly", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/shuttle/overlays.dmi"),
	typetext: "titanium",
	icontext: "titanium",
	glass_type: rt.typePath("/obj/machinery/door/airlock/glass_titanium"),
	airlock_type: rt.typePath("/obj/machinery/door/airlock/titanium"),
	anchored: 1,
	state: 1,
	mineral: "titanium",
	name: "titanium airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/shuttle/shuttle.dmi"),
});
rt.type(12445, "/obj/structure/door_assembly/door_assembly_titanium/glass", "/obj/structure/door_assembly/door_assembly_titanium", {
	mineral: "glass",
	material: "glass",
});
rt.type(12446, "/obj/structure/door_assembly/door_assembly_highsecurity", "/obj/structure/door_assembly", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/highsec/overlays.dmi"),
	typetext: "highsecurity",
	icontext: "highsec",
	airlock_type: rt.typePath("/obj/machinery/door/airlock/highsecurity"),
	anchored: 1,
	state: 1,
	name: "high security airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/highsec/highsec.dmi"),
});
rt.type(12447, "/obj/structure/door_assembly/door_assembly_vault", "/obj/structure/door_assembly", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/vault/overlays.dmi"),
	typetext: "vault",
	icontext: "vault",
	airlock_type: rt.typePath("/obj/machinery/door/airlock/vault"),
	anchored: 1,
	state: 1,
	name: "vault door assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/vault/vault.dmi"),
});
rt.type(12448, "/obj/structure/door_assembly/door_assembly_shuttle", "/obj/structure/door_assembly", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/shuttle/overlays.dmi"),
	typetext: "shuttle",
	icontext: "shuttle",
	airlock_type: rt.typePath("/obj/machinery/door/airlock/shuttle"),
	anchored: 1,
	state: 1,
	name: "shuttle airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/shuttle/shuttle.dmi"),
});
rt.type(12449, "/obj/structure/door_assembly/door_assembly_cult", "/obj/structure/door_assembly", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/cult/runed/overlays.dmi"),
	typetext: "cult",
	icontext: "cult",
	airlock_type: rt.typePath("/obj/machinery/door/airlock/cult"),
	anchored: 1,
	state: 1,
	name: "cult airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/cult/runed/cult.dmi"),
});
rt.type(12450, "/obj/structure/door_assembly/door_assembly_cult/glass", "/obj/structure/door_assembly/door_assembly_cult", {
	mineral: "glass",
	material: "glass",
});
rt.type(12451, "/obj/structure/door_assembly/door_assembly_cult/unruned", "/obj/structure/door_assembly/door_assembly_cult", {
	overlays_file: rt.rsc("icons/obj/doors/airlocks/cult/unruned/overlays.dmi"),
	icon: rt.rsc("icons/obj/doors/airlocks/cult/unruned/cult.dmi"),
});
rt.type(12452, "/obj/structure/door_assembly/door_assembly_cult/unruned/glass", "/obj/structure/door_assembly/door_assembly_cult/unruned", {
	mineral: "glass",
	material: "glass",
});
rt.type(12453, "/obj/structure/door_assembly/door_assembly_wood", "/obj/structure/door_assembly", {
	airlock_type: rt.typePath("/obj/machinery/door/airlock/wood"),
	anchored: 1,
	state: 1,
	mineral: "wood",
	name: "wooden airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/wood.dmi"),
});
rt.type(12454, "/obj/structure/door_assembly/door_assembly_viro", "/obj/structure/door_assembly", {
	typetext: "virology",
	icontext: "viro",
	glass_type: rt.typePath("/obj/machinery/door/airlock/glass_virology"),
	airlock_type: rt.typePath("/obj/machinery/door/airlock/virology"),
	anchored: 1,
	state: 1,
	name: "virology airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/virology.dmi"),
});
rt.type(12455, "/obj/structure/door_assembly/door_assembly_viro/glass", "/obj/structure/door_assembly/door_assembly_viro", {
	mineral: "glass",
	material: "glass",
});
rt.type(12456, "/obj/structure/door_assembly/door_assembly_centcom", "/obj/structure/door_assembly", {
	typetext: "centcom",
	overlays_file: rt.rsc("icons/obj/doors/airlocks/centcom/overlays.dmi"),
	icontext: "ele",
	airlock_type: rt.typePath("/obj/machinery/door/airlock/centcom"),
	anchored: 1,
	state: 1,
	icon: rt.rsc("icons/obj/doors/airlocks/centcom/centcom.dmi"),
});
rt.type(12477, "/obj/structure/flora/tree/jungle/small", "/obj/structure/flora/tree/jungle", {
	pixel_y: 0,
	pixel_x: -32,
	icon: rt.rsc("icons/obj/flora/jungletreesmall.dmi"),
});
rt.type(12483, "/obj/structure/flora/grass/jungle/b", "/obj/structure/flora/grass/jungle", {
	icon_state: "grassb",
});
rt.type(12504, "/obj/structure/flora/rock/pile/icy", "/obj/structure/flora/rock/pile", {
	name: "icey rocks",
	color: "#72e4fa",
});
rt.type(12506, "/obj/structure/flora/rock/icy", "/obj/structure/flora/rock", {
	name: "icy rock",
	color: "#72e4fa",
});
rt.type(12508, "/obj/structure/flora/junglebush/b", "/obj/structure/flora/junglebush", {
	icon_state: "bushb",
});
rt.type(12509, "/obj/structure/flora/junglebush/c", "/obj/structure/flora/junglebush", {
	icon_state: "bushc",
});
rt.type(12510, "/obj/structure/flora/junglebush/large", "/obj/structure/flora/junglebush", {
	icon_state: "bush",
	icon: rt.rsc("icons/obj/flora/largejungleflora.dmi"),
	pixel_x: -16,
	pixel_y: -12,
	layer: 4.5,
});
rt.type(12659, "/obj/structure/sign/basic", "/obj/structure/sign", {
	name: "blank sign",
	desc: "How can signs be real if our eyes aren't real?",
	icon_state: "backing",
});
rt.type(12660, "/obj/structure/sign/map", "/obj/structure/sign", {
	name: "station map",
	desc: "A framed picture of the station.",
	obj_integrity: 500,
	max_integrity: 500,
});
rt.type(12661, "/obj/structure/sign/map/left", "/obj/structure/sign/map", {
	icon_state: "map-left",
});
rt.type(12662, "/obj/structure/sign/map/left/dream", "/obj/structure/sign/map/left", {
	icon_state: "map-left-DS",
	desc: "A framed picture of the station.\nClockwise from the top, you see Engineering(<b>yellow</b>), Arrivals(<b>blue and white</b>), Atmospherics(<b>yellow</b>), Security(<b>red</b>), Cargo(<b>brown</b>), Science(<b>purple</b>), Escape(<b>red and white</b>), and Medbay(<b>blue</b>).\nIn the center of the station, you see the Bridge(<b>dark blue</b>).\nAround those, you see Hallways/Entrances(<b>light grey</b>), Public Areas(<b>grey</b>), and Maintenance(<b>dark grey</b>).",
});
rt.type(12663, "/obj/structure/sign/map/left/ceres", "/obj/structure/sign/map/left", {
	icon_state: "map-CS",
	desc: "A framed picture of the station.\nClockwise from the top, you see Security (<b>red</b>), Dorms (<b>light-green</b>), Bridge (<b>dark-blue</b>), AI Core (<b>gray</b>), Cargo (<b>brown</b>), Medbay (<b>blue</b>), Arrivals/Departures(<b>orange/cyan</b>), Research (<b>purple</b>), Service (<b>dark-green</b>), and Engineering in the center (<b>yellow</b>).",
});
rt.type(12664, "/obj/structure/sign/map/right", "/obj/structure/sign/map", {
	icon_state: "map-right",
});
rt.type(12665, "/obj/structure/sign/map/right/dream", "/obj/structure/sign/map/right", {
	icon_state: "map-right-DS",
	desc: "A framed picture of the station.\nClockwise from the top, you see Engineering(<b>yellow</b>), Arrivals(<b>blue and white</b>), Atmospherics(<b>yellow</b>), Security(<b>red</b>), Cargo(<b>brown</b>), Science(<b>purple</b>), Escape(<b>red and white</b>), and Medbay(<b>blue</b>).\nIn the center of the station, you see the Bridge(<b>dark blue</b>).\nAround those, you see Hallways/Entrances(<b>light grey</b>), Public Areas(<b>grey</b>), and Maintenance(<b>dark grey</b>).",
});
rt.type(12666, "/obj/structure/sign/securearea", "/obj/structure/sign", {
	name: "１SECURE AREA",
	desc: "A warning sign which reads 'SECURE AREA'.",
	icon_state: "securearea",
});
rt.type(12667, "/obj/structure/sign/biohazard", "/obj/structure/sign", {
	name: "１BIOHAZARD",
	desc: "A warning sign which reads 'BIOHAZARD'.",
	icon_state: "bio",
});
rt.type(12668, "/obj/structure/sign/electricshock", "/obj/structure/sign", {
	name: "１HIGH VOLTAGE",
	desc: "A warning sign which reads 'HIGH VOLTAGE'.",
	icon_state: "shock",
});
rt.type(12669, "/obj/structure/sign/examroom", "/obj/structure/sign", {
	name: "１EXAM ROOM",
	desc: "A guidance sign which reads 'EXAM ROOM'.",
	icon_state: "examroom",
});
rt.type(12670, "/obj/structure/sign/vacuum", "/obj/structure/sign", {
	name: "１HARD VACUUM AHEAD",
	desc: "A warning sign which reads 'HARD VACUUM AHEAD'.",
	icon_state: "space",
});
rt.type(12671, "/obj/structure/sign/deathsposal", "/obj/structure/sign", {
	name: "１DISPOSAL: LEADS TO SPACE",
	desc: "A warning sign which reads 'DISPOSAL: LEADS TO SPACE'.",
	icon_state: "deathsposal",
});
rt.type(12672, "/obj/structure/sign/pods", "/obj/structure/sign", {
	name: "１ESCAPE PODS",
	desc: "A warning sign which reads 'ESCAPE PODS'.",
	icon_state: "pods",
});
rt.type(12673, "/obj/structure/sign/fire", "/obj/structure/sign", {
	name: "１DANGER: FIRE",
	desc: "A warning sign which reads 'DANGER: FIRE'.",
	icon_state: "fire",
});
rt.type(12674, "/obj/structure/sign/nosmoking_1", "/obj/structure/sign", {
	name: "１NO SMOKING",
	desc: "A warning sign which reads 'NO SMOKING'.",
	icon_state: "nosmoking",
});
rt.type(12675, "/obj/structure/sign/nosmoking_2", "/obj/structure/sign", {
	name: "１NO SMOKING",
	desc: "A warning sign which reads 'NO SMOKING'.",
	icon_state: "nosmoking2",
});
rt.type(12676, "/obj/structure/sign/radiation", "/obj/structure/sign", {
	name: "HAZARDOUS RADIATION",
	desc: "A warning sign alerting the user of potential radiation hazards.",
	icon_state: "radiation",
});
rt.type(12677, "/obj/structure/sign/bluecross", "/obj/structure/sign", {
	name: "medbay",
	desc: "The Intergalactic symbol of Medical institutions. You'll probably get help here.",
	icon_state: "bluecross",
});
rt.type(12678, "/obj/structure/sign/bluecross_2", "/obj/structure/sign", {
	name: "medbay",
	desc: "The Intergalactic symbol of Medical institutions. You'll probably get help here.",
	icon_state: "bluecross2",
});
rt.type(12679, "/obj/structure/sign/goldenplaque", "/obj/structure/sign", {
	name: "The Most Robust Men Award for Robustness",
	desc: "To be Robust is not an action or a way of life, but a mental state. Only those with the force of Will strong enough to act during a crisis, saving friend from foe, are truly Robust. Stay Robust my friends.",
	icon_state: "goldenplaque",
});
rt.type(12680, "/obj/structure/sign/kiddieplaque", "/obj/structure/sign", {
	name: "AI developers plaque",
	desc: "Next to the extremely long list of names and job titles, there is a drawing of a little child. The child appears to be retarded. Beneath the image, someone has scratched the word \"PACKETS\"",
	icon_state: "kiddieplaque",
});
rt.type(12681, "/obj/structure/sign/atmosplaque", "/obj/structure/sign", {
	name: "１FEA Atmospherics Division plaque",
	desc: "This plaque commemorates the fall of the Atmos FEA division. For all the charred, dizzy, and brittle men who have died in its hands.",
	icon_state: "atmosplaque",
});
rt.type(12682, "/obj/structure/sign/nanotrasen", "/obj/structure/sign", {
	name: "１NanoTrasen Logo ",
	desc: "A sign with the Nanotrasen Logo on it. Glory to Nanotrasen!",
	icon_state: "nanotrasen",
});
rt.type(12683, "/obj/structure/sign/science", "/obj/structure/sign", {
	name: "１SCIENCE",
	desc: "A sign labelling an area where research and science is performed.",
	icon_state: "science1",
});
rt.type(12684, "/obj/structure/sign/chemistry", "/obj/structure/sign", {
	name: "１CHEMISTRY",
	desc: "A sign labelling an area containing chemical equipment.",
	icon_state: "chemistry1",
});
rt.type(12685, "/obj/structure/sign/botany", "/obj/structure/sign", {
	name: "１HYDROPONICS",
	desc: "A sign labelling an area as a place where plants are grown.",
	icon_state: "hydro1",
});
rt.type(12686, "/obj/structure/sign/xenobio", "/obj/structure/sign", {
	name: "１XENOBIOLOGY",
	desc: "A sign labelling an area as a place where xenobiological entities are researched.",
	icon_state: "xenobio",
});
rt.type(12687, "/obj/structure/sign/xeno_warning_mining", "/obj/structure/sign", {
	name: "DANGEROUS ALIEN LIFE",
	desc: "A sign that warns would-be travellers of hostile alien life in the vicinity.",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "xeno_warning",
});
rt.type(12688, "/obj/structure/sign/enginesafety", "/obj/structure/sign", {
	name: "１ENGINEERING SAFETY",
	desc: "A sign detailing the various safety protocols when working on-site to ensure a safe shift.",
	icon_state: "safety",
});
rt.type(12689, "/obj/structure/sign/directions", "/obj/structure/sign", {});
rt.type(12690, "/obj/structure/sign/directions/science", "/obj/structure/sign/directions", {
	name: "science department",
	desc: "A direction sign, pointing out which way the Science department is.",
	icon_state: "direction_sci",
});
rt.type(12691, "/obj/structure/sign/directions/engineering", "/obj/structure/sign/directions", {
	name: "engineering department",
	desc: "A direction sign, pointing out which way the Engineering department is.",
	icon_state: "direction_eng",
});
rt.type(12692, "/obj/structure/sign/directions/security", "/obj/structure/sign/directions", {
	name: "security department",
	desc: "A direction sign, pointing out which way the Security department is.",
	icon_state: "direction_sec",
});
rt.type(12693, "/obj/structure/sign/directions/medical", "/obj/structure/sign/directions", {
	name: "medical bay",
	desc: "A direction sign, pointing out which way the Medical Bay is.",
	icon_state: "direction_med",
});
rt.type(12694, "/obj/structure/sign/directions/evac", "/obj/structure/sign/directions", {
	name: "escape arm",
	desc: "A direction sign, pointing out which way the escape shuttle dock is.",
	icon_state: "direction_evac",
});
rt.type(12695, "/obj/structure/sign/directions/supply", "/obj/structure/sign/directions", {
	name: "cargo bay",
	desc: "A direction sign, pointing out which way the Cargo Bay is.",
	icon_state: "direction_supply",
});
rt.type(12696, "/obj/structure/sign/directions/command", "/obj/structure/sign/directions", {
	name: "command department",
	desc: "A direction sign, pointing out which way the Command department is.",
	icon_state: "direction_bridge",
});
rt.type(12697, "/obj/structure/sign/mining", "/obj/structure/sign", {
	name: "nanotrasen mining corps sign",
	desc: "A sign of relief for weary miners, and a warning for would-be competitors to Nanotrasen's mining claims.",
	icon: rt.rsc("icons/turf/walls/survival_pod_walls.dmi"),
	icon_state: "ntpod",
});
rt.type(12698, "/obj/structure/sign/mining/survival", "/obj/structure/sign/mining", {
	name: "shelter sign",
	desc: "A high visibility sign designating a safe shelter.",
	icon: rt.rsc("icons/turf/walls/survival_pod_walls.dmi"),
	icon_state: "survival",
});
rt.type(12719, "/obj/structure/alien/egg/grown", "/obj/structure/alien/egg", {
	status: "grown",
	icon_state: "egg",
});
rt.type(12720, "/obj/structure/alien/egg/burst", "/obj/structure/alien/egg", {
	status: "burst",
	icon_state: "egg_hatched",
});
rt.type(12753, "/obj/structure/fluff/empty_terrarium", "/obj/structure/fluff", {
	name: "empty terrarium",
	desc: "An ancient machine that seems to be used for storing plant matter. Its hatch is ajar.",
	icon: rt.rsc("icons/obj/lavaland/spawners.dmi"),
	icon_state: "terrarium_open",
	density: 1,
});
rt.type(12754, "/obj/structure/fluff/empty_sleeper", "/obj/structure/fluff", {
	name: "empty sleeper",
	desc: "An open sleeper. It looks as though it would be awaiting another patient, were it not broken.",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper-open",
});
rt.type(12755, "/obj/structure/fluff/empty_sleeper/nanotrasen", "/obj/structure/fluff/empty_sleeper", {
	name: "broken hypersleep chamber",
	desc: "A Nanotrasen hypersleep chamber - this one appears broken. There are exposed bolts for easy disassembly using a wrench.",
	icon_state: "sleeper-o",
});
rt.type(12756, "/obj/structure/fluff/empty_sleeper/syndicate", "/obj/structure/fluff/empty_sleeper", {
	icon_state: "sleeper_s-open",
});
rt.type(12757, "/obj/structure/fluff/empty_cryostasis_sleeper", "/obj/structure/fluff", {
	name: "empty cryostasis sleeper",
	desc: "Although comfortable, this sleeper won't function as anything but a bed ever again.",
	icon: rt.rsc("icons/obj/lavaland/spawners.dmi"),
	icon_state: "cryostasis_sleeper_open",
});
rt.type(12758, "/obj/structure/fluff/broken_flooring", "/obj/structure/fluff", {
	name: "broken tiling",
	desc: "A segment of broken flooring.",
	icon: rt.rsc("icons/obj/brokentiling.dmi"),
	icon_state: "corner",
});
rt.type(12759, "/obj/structure/fluff/drake_statue", "/obj/structure/fluff", {
	deconstructible: 0,
	name: "drake statue",
	desc: "A towering basalt sculpture of a proud and regal drake. Its eyes are six glowing gemstones.",
	icon: rt.rsc("icons/effects/64x64.dmi"),
	icon_state: "drake_statue",
	pixel_x: -16,
	density: 1,
	layer: 4.3,
});
rt.type(12760, "/obj/structure/fluff/drake_statue/falling", "/obj/structure/fluff/drake_statue", {
	desc: "A towering basalt sculpture of a drake. Cracks run down its surface and parts of it have fallen off.",
	icon_state: "drake_statue_falling",
});
rt.type(12761, "/obj/structure/fluff/bus", "/obj/structure/fluff", {
	anchored: 1,
	deconstructible: 0,
	name: "bus",
	desc: "GO TO SCHOOL. READ A BOOK.",
	icon: rt.rsc("icons/obj/bus.dmi"),
	density: 1,
});
rt.type(12762, "/obj/structure/fluff/bus/dense", "/obj/structure/fluff/bus", {
	name: "bus",
	icon_state: "backwall",
});
rt.type(12763, "/obj/structure/fluff/bus/passable", "/obj/structure/fluff/bus", {
	name: "bus",
	icon_state: "frontwalltop",
	density: 0,
	layer: 4.5,
});
rt.type(12764, "/obj/structure/fluff/bus/passable/seat", "/obj/structure/fluff/bus/passable", {
	name: "seat",
	desc: "Buckle up! ...What do you mean, there's no seatbelts?!",
	icon_state: "backseat",
	pixel_y: 17,
	layer: 3,
});
rt.type(12766, "/obj/structure/fluff/paper", "/obj/structure/fluff", {
	deconstructible: 0,
	name: "dense lining of papers",
	desc: "A lining of paper scattered across the bottom of a wall.",
	icon: rt.rsc("icons/obj/fluff.dmi"),
	icon_state: "paper",
});
rt.type(12767, "/obj/structure/fluff/paper/corner", "/obj/structure/fluff/paper", {
	icon_state: "papercorner",
});
rt.type(12768, "/obj/structure/fluff/paper/stack", "/obj/structure/fluff/paper", {
	name: "dense stack of papers",
	desc: "A stack of various papers, childish scribbles scattered across each page.",
	icon_state: "paperstack",
});
rt.type(12769, "/obj/structure/fluff/divine", "/obj/structure/fluff", {
	anchored: 1,
	name: "Miracle",
	icon: rt.rsc("icons/obj/hand_of_god_structures.dmi"),
	density: 1,
});
rt.type(12770, "/obj/structure/fluff/divine/nexus", "/obj/structure/fluff/divine", {
	name: "nexus",
	desc: "It anchors a deity to this world. It radiates an unusual aura. It looks well protected from explosive shock.",
	icon_state: "nexus",
});
rt.type(12771, "/obj/structure/fluff/divine/conduit", "/obj/structure/fluff/divine", {
	name: "conduit",
	desc: "It allows a deity to extend their reach.  Their powers are just as potent near a conduit as a nexus.",
	icon_state: "conduit",
});
rt.type(12772, "/obj/structure/fluff/divine/convertaltar", "/obj/structure/fluff/divine", {
	can_buckle: 1,
	name: "conversion altar",
	desc: "An altar dedicated to a deity.",
	icon_state: "convertaltar",
	density: 0,
});
rt.type(12773, "/obj/structure/fluff/divine/powerpylon", "/obj/structure/fluff/divine", {
	can_buckle: 1,
	name: "power pylon",
	desc: "A pylon which increases the deity's rate it can influence the world.",
	icon_state: "powerpylon",
});
rt.type(12774, "/obj/structure/fluff/divine/defensepylon", "/obj/structure/fluff/divine", {
	name: "defense pylon",
	desc: "A pylon which is blessed to withstand many blows, and fire strong bolts at nonbelievers. A god can toggle it.",
	icon_state: "defensepylon",
});
rt.type(12775, "/obj/structure/fluff/divine/shrine", "/obj/structure/fluff/divine", {
	name: "shrine",
	desc: "A shrine dedicated to a deity.",
	icon_state: "shrine",
});
rt.type(12776, "/obj/structure/fluff/arc", "/obj/structure/fluff", {
	anchored: 1,
	name: "Tomb of the Unknown Employee",
	desc: "Here rests an unknown employee\nUnknown by name or rank\nWhose acts will not be forgotten",
	icon: rt.rsc("icons/obj/tomb.dmi"),
	icon_state: "memorial",
	density: 1,
});
rt.type(12778, "/obj/structure/guncase/shotgun", "/obj/structure/guncase", {
	case_type: "shotgun",
	gun_category: rt.typePath("/obj/item/weapon/gun/ballistic/shotgun"),
	name: "shotgun locker",
	desc: "A locker that holds shotguns.",
});
rt.type(12779, "/obj/structure/guncase/ecase", "/obj/structure/guncase", {
	case_type: "egun",
	gun_category: rt.typePath("/obj/item/weapon/gun/energy/e_gun"),
	name: "energy gun locker",
	desc: "A locker that holds energy guns.",
	icon_state: "ecase",
});
rt.type(12782, "/obj/structure/holosign/wetsign", "/obj/structure/holosign", {
	name: "wet floor sign",
	desc: "The words flicker as if they mean nothing.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "holosign",
});
rt.type(12784, "/obj/structure/holosign/barrier/engineering", "/obj/structure/holosign/barrier", {
	icon_state: "holosign_engi",
});
rt.type(12796, "/obj/structure/mineral_door/iron", "/obj/structure/mineral_door", {
	name: "iron door",
	obj_integrity: 300,
	max_integrity: 300,
});
rt.type(12797, "/obj/structure/mineral_door/silver", "/obj/structure/mineral_door", {
	sheetType: rt.typePath("/obj/item/stack/sheet/mineral/silver"),
	name: "silver door",
	icon_state: "silver",
	obj_integrity: 300,
	max_integrity: 300,
});
rt.type(12798, "/obj/structure/mineral_door/gold", "/obj/structure/mineral_door", {
	sheetType: rt.typePath("/obj/item/stack/sheet/mineral/gold"),
	name: "gold door",
	icon_state: "gold",
});
rt.type(12799, "/obj/structure/mineral_door/uranium", "/obj/structure/mineral_door", {
	sheetType: rt.typePath("/obj/item/stack/sheet/mineral/uranium"),
	light_range: 2,
	name: "uranium door",
	icon_state: "uranium",
	obj_integrity: 300,
	max_integrity: 300,
});
rt.type(12800, "/obj/structure/mineral_door/sandstone", "/obj/structure/mineral_door", {
	sheetType: rt.typePath("/obj/item/stack/sheet/mineral/sandstone"),
	name: "sandstone door",
	icon_state: "sandstone",
	obj_integrity: 100,
	max_integrity: 100,
});
rt.type(12803, "/obj/structure/mineral_door/transparent/diamond", "/obj/structure/mineral_door/transparent", {
	sheetType: rt.typePath("/obj/item/stack/sheet/mineral/diamond"),
	name: "diamond door",
	icon_state: "diamond",
	obj_integrity: 1000,
	max_integrity: 1000,
});
rt.type(12804, "/obj/structure/mineral_door/wood", "/obj/structure/mineral_door", {
	openSound: rt.rsc("sound/effects/doorcreaky.ogg"),
	closeSound: rt.rsc("sound/effects/doorcreaky.ogg"),
	sheetType: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	name: "wood door",
	icon_state: "wood",
	resistance_flags: 4,
	obj_integrity: 200,
	max_integrity: 200,
});
rt.type(12817, "/obj/structure/tray/c_tray", "/obj/structure/tray", {
	name: "crematorium tray",
	desc: "Apply body before burning.",
	icon_state: "cremat",
});
rt.type(12832, "/obj/structure/statue/uranium/nuke", "/obj/structure/statue/uranium", {
	name: "statue of a nuclear fission explosive",
	desc: "This is a grand statue of a Nuclear Explosive. It has a sickening green colour.",
	icon_state: "nuke",
});
rt.type(12833, "/obj/structure/statue/uranium/eng", "/obj/structure/statue/uranium", {
	name: "Statue of an engineer",
	desc: "This statue has a sickening green colour.",
	icon_state: "eng",
});
rt.type(12835, "/obj/structure/statue/plasma/scientist", "/obj/structure/statue/plasma", {
	name: "statue of a scientist",
	icon_state: "sci",
});
rt.type(12836, "/obj/structure/statue/gold", "/obj/structure/statue", {
	material_drop_type: rt.typePath("/obj/item/stack/sheet/mineral/gold"),
	obj_integrity: 300,
	desc: "This is a highly valuable statue made from gold.",
});
rt.type(12837, "/obj/structure/statue/gold/hos", "/obj/structure/statue/gold", {
	name: "statue of the head of security",
	icon_state: "hos",
});
rt.type(12838, "/obj/structure/statue/gold/hop", "/obj/structure/statue/gold", {
	name: "statue of the head of personnel",
	icon_state: "hop",
});
rt.type(12839, "/obj/structure/statue/gold/cmo", "/obj/structure/statue/gold", {
	name: "statue of the chief medical officer",
	icon_state: "cmo",
});
rt.type(12840, "/obj/structure/statue/gold/ce", "/obj/structure/statue/gold", {
	name: "statue of the chief engineer",
	icon_state: "ce",
});
rt.type(12841, "/obj/structure/statue/gold/rd", "/obj/structure/statue/gold", {
	name: "statue of the research director",
	icon_state: "rd",
});
rt.type(12842, "/obj/structure/statue/silver", "/obj/structure/statue", {
	material_drop_type: rt.typePath("/obj/item/stack/sheet/mineral/silver"),
	obj_integrity: 300,
	desc: "This is a valuable statue made from silver.",
});
rt.type(12843, "/obj/structure/statue/silver/md", "/obj/structure/statue/silver", {
	name: "statue of a medical officer",
	icon_state: "md",
});
rt.type(12844, "/obj/structure/statue/silver/janitor", "/obj/structure/statue/silver", {
	name: "statue of a janitor",
	icon_state: "jani",
});
rt.type(12845, "/obj/structure/statue/silver/sec", "/obj/structure/statue/silver", {
	name: "statue of a security officer",
	icon_state: "sec",
});
rt.type(12846, "/obj/structure/statue/silver/secborg", "/obj/structure/statue/silver", {
	name: "statue of a security cyborg",
	icon_state: "secborg",
});
rt.type(12847, "/obj/structure/statue/silver/medborg", "/obj/structure/statue/silver", {
	name: "statue of a medical cyborg",
	icon_state: "medborg",
});
rt.type(12848, "/obj/structure/statue/diamond", "/obj/structure/statue", {
	material_drop_type: rt.typePath("/obj/item/stack/sheet/mineral/diamond"),
	obj_integrity: 1000,
	desc: "This is a very expensive diamond statue",
});
rt.type(12849, "/obj/structure/statue/diamond/captain", "/obj/structure/statue/diamond", {
	name: "statue of THE captain.",
	icon_state: "cap",
});
rt.type(12850, "/obj/structure/statue/diamond/ai1", "/obj/structure/statue/diamond", {
	name: "statue of the AI hologram.",
	icon_state: "ai1",
});
rt.type(12851, "/obj/structure/statue/diamond/ai2", "/obj/structure/statue/diamond", {
	name: "statue of the AI core.",
	icon_state: "ai2",
});
rt.type(12853, "/obj/structure/statue/bananium/clown", "/obj/structure/statue/bananium", {
	name: "statue of a clown",
	icon_state: "clown",
});
rt.type(12854, "/obj/structure/statue/sandstone", "/obj/structure/statue", {
	material_drop_type: rt.typePath("/obj/item/stack/sheet/mineral/sandstone"),
	obj_integrity: 50,
});
rt.type(12855, "/obj/structure/statue/sandstone/assistant", "/obj/structure/statue/sandstone", {
	name: "statue of an assistant",
	desc: "A cheap statue of sandstone for a greyshirt.",
	icon_state: "assist",
});
rt.type(12856, "/obj/structure/statue/sandstone/venus", "/obj/structure/statue/sandstone", {
	name: "statue of a pure maiden",
	desc: "An ancient marble statue. The subject is depicted with a floor-length braid and is wielding a toolbox. By Jove, it's easily the most gorgeous depiction of a woman you've ever seen. The artist must truly be a master of his craft. Shame about the broken arm, though.",
	icon: rt.rsc("icons/obj/statuelarge.dmi"),
	icon_state: "venus",
});
rt.type(12857, "/obj/structure/statue/snow", "/obj/structure/statue", {
	material_drop_type: rt.typePath("/obj/item/stack/sheet/mineral/snow"),
	obj_integrity: 50,
});
rt.type(12858, "/obj/structure/statue/snow/snowman", "/obj/structure/statue/snow", {
	name: "snowman",
	desc: "Several lumps of snow put together to form a snowman.",
	icon_state: "snowman",
});
rt.type(12863, "/obj/structure/reflector/single/mapping", "/obj/structure/reflector/single", {
	admin: 1,
	anchored: 1,
});
rt.type(12865, "/obj/structure/reflector/double/mapping", "/obj/structure/reflector/double", {
	admin: 1,
	anchored: 1,
});
rt.type(12867, "/obj/structure/reflector/box/mapping", "/obj/structure/reflector/box", {
	admin: 1,
	anchored: 1,
});
rt.type(12873, "/obj/structure/showcase/horrific_experiment", "/obj/structure/showcase", {
	name: "horrific experiment",
	desc: "Some sort of pod filled with blood and viscera. You swear you can see it moving...",
	icon: rt.rsc("icons/obj/cloning.dmi"),
	icon_state: "pod_g",
});
rt.type(12874, "/obj/structure/showcase/oldpod", "/obj/structure/showcase", {
	name: "damage cyrogenic pod",
	desc: "A damage cyrogenic pod long since lost to time, including its former occupant...",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper-open",
});
rt.type(12878, "/obj/structure/tank_dispenser/oxygen", "/obj/structure/tank_dispenser", {
	plasmatanks: 0,
});
rt.type(12879, "/obj/structure/tank_dispenser/plasma", "/obj/structure/tank_dispenser", {
	oxygentanks: 0,
});
rt.type(12894, "/obj/structure/sink/kitchen", "/obj/structure/sink", {
	name: "kitchen sink",
	icon_state: "sink_alt",
});
