// Types declared in code/datums that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../build/dist/src/translate/runtime.js";

rt.type(145, "/datum/action/innate/minedrone", "/datum/action/innate", {
	check_flags: 8,
	background_icon_state: "bg_default",
});
rt.type(177, "/datum/action/item_action/toggle_light", "/datum/action/item_action", {
	name: "Toggle Light",
});
rt.type(178, "/datum/action/item_action/toggle_hood", "/datum/action/item_action", {
	name: "Toggle Hood",
});
rt.type(179, "/datum/action/item_action/toggle_firemode", "/datum/action/item_action", {
	name: "Toggle Firemode",
});
rt.type(180, "/datum/action/item_action/startchainsaw", "/datum/action/item_action", {
	name: "Pull The Starting Cord",
});
rt.type(181, "/datum/action/item_action/toggle_gunlight", "/datum/action/item_action", {
	name: "Toggle Gunlight",
});
rt.type(182, "/datum/action/item_action/toggle_mode", "/datum/action/item_action", {
	name: "Toggle Mode",
});
rt.type(183, "/datum/action/item_action/toggle_barrier_spread", "/datum/action/item_action", {
	name: "Toggle Barrier Spread",
});
rt.type(184, "/datum/action/item_action/equip_unequip_TED_Gun", "/datum/action/item_action", {
	name: "Equip/Unequip TED Gun",
});
rt.type(185, "/datum/action/item_action/toggle_paddles", "/datum/action/item_action", {
	name: "Toggle Paddles",
});
rt.type(187, "/datum/action/item_action/pick_color", "/datum/action/item_action", {
	name: "Choose A Color",
});
rt.type(188, "/datum/action/item_action/toggle_mister", "/datum/action/item_action", {
	name: "Toggle Mister",
});
rt.type(189, "/datum/action/item_action/activate_injector", "/datum/action/item_action", {
	name: "Activate Injector",
});
rt.type(190, "/datum/action/item_action/toggle_helmet_light", "/datum/action/item_action", {
	name: "Toggle Helmet Light",
});
rt.type(195, "/datum/action/item_action/clock/hierophant", "/datum/action/item_action/clock", {
	name: "Hierophant Network",
	desc: "Allows you to communicate with other Servants.",
	button_icon_state: "hierophant_slab",
});
rt.type(196, "/datum/action/item_action/clock/quickbind", "/datum/action/item_action/clock", {
	scripture_index: 0,
	name: "Quickbind",
	desc: "If you're seeing this, file a bug report.",
});
rt.type(197, "/datum/action/item_action/toggle_helmet_flashlight", "/datum/action/item_action", {
	name: "Toggle Helmet Flashlight",
});
rt.type(198, "/datum/action/item_action/toggle_helmet_mode", "/datum/action/item_action", {
	name: "Toggle Helmet Mode",
});
rt.type(200, "/datum/action/item_action/halt", "/datum/action/item_action", {
	name: "HALT!",
});
rt.type(201, "/datum/action/item_action/toggle_voice_box", "/datum/action/item_action", {
	name: "Toggle Voice Box",
});
rt.type(202, "/datum/action/item_action/change", "/datum/action/item_action", {
	name: "Change",
});
rt.type(204, "/datum/action/item_action/switch_hud", "/datum/action/item_action", {
	name: "Switch HUD",
});
rt.type(205, "/datum/action/item_action/toggle_wings", "/datum/action/item_action", {
	name: "Toggle Wings",
});
rt.type(206, "/datum/action/item_action/toggle_human_head", "/datum/action/item_action", {
	name: "Toggle Human Head",
});
rt.type(207, "/datum/action/item_action/toggle_helmet", "/datum/action/item_action", {
	name: "Toggle Helmet",
});
rt.type(208, "/datum/action/item_action/toggle_jetpack", "/datum/action/item_action", {
	name: "Toggle Jetpack",
});
rt.type(210, "/datum/action/item_action/hands_free", "/datum/action/item_action", {
	check_flags: 8,
});
rt.type(211, "/datum/action/item_action/hands_free/activate", "/datum/action/item_action/hands_free", {
	name: "Activate",
});
rt.type(212, "/datum/action/item_action/hands_free/shift_nerves", "/datum/action/item_action/hands_free", {
	name: "Shift Nerves",
});
rt.type(214, "/datum/action/item_action/explosive_implant", "/datum/action/item_action", {
	check_flags: 0,
	name: "Activate Explosive Implant",
});
rt.type(216, "/datum/action/item_action/initialize_ninja_suit", "/datum/action/item_action", {
	name: "Toggle ninja suit",
});
rt.type(217, "/datum/action/item_action/ninjajaunt", "/datum/action/item_action", {
	name: "Phase Jaunt (10E)",
	desc: "Utilizes the internal VOID-shift device to rapidly transit in direction facing.",
	button_icon_state: "ninja_phase",
});
rt.type(218, "/datum/action/item_action/ninjasmoke", "/datum/action/item_action", {
	name: "Smoke Bomb",
	desc: "Blind your enemies momentarily with a well-placed smoke bomb.",
	button_icon_state: "smoke",
});
rt.type(219, "/datum/action/item_action/ninjaboost", "/datum/action/item_action", {
	name: "Adrenaline Boost",
	desc: "Inject a secret chemical that will counteract all movement-impairing effect.",
	button_icon_state: "repulse",
});
rt.type(220, "/datum/action/item_action/ninjapulse", "/datum/action/item_action", {
	name: "EM Burst (25E)",
	desc: "Disable any nearby technology with a electro-magnetic pulse.",
	button_icon_state: "emp",
});
rt.type(221, "/datum/action/item_action/ninjastar", "/datum/action/item_action", {
	name: "Create Throwing Stars (1E)",
	desc: "Creates some throwing stars",
	button_icon_state: "throwingstar",
	icon_icon: rt.rsc("icons/obj/weapons.dmi"),
});
rt.type(222, "/datum/action/item_action/ninjanet", "/datum/action/item_action", {
	name: "Energy Net (20E)",
	desc: "Captures a fallen opponent in a net of energy. Will teleport them to a holding facility after 30 seconds.",
	button_icon_state: "energynet",
	icon_icon: rt.rsc("icons/effects/effects.dmi"),
});
rt.type(223, "/datum/action/item_action/ninja_sword_recall", "/datum/action/item_action", {
	name: "Recall Energy Katana (Variable Cost)",
	desc: "Teleports the Energy Katana linked to this suit to its wearer, cost based on distance.",
	button_icon_state: "energy_katana",
	icon_icon: rt.rsc("icons/obj/weapons.dmi"),
});
rt.type(224, "/datum/action/item_action/ninja_stealth", "/datum/action/item_action", {
	name: "Toggle Stealth",
	desc: "Toggles stealth mode on and off.",
	button_icon_state: "ninja_cloak",
});
rt.type(225, "/datum/action/item_action/toggle_glove", "/datum/action/item_action", {
	name: "Toggle interaction",
	desc: "Switch between normal interaction and drain mode.",
	button_icon_state: "s-ninjan",
	icon_icon: rt.rsc("icons/obj/clothing/gloves.dmi"),
});
rt.type(232, "/datum/action/item_action/stickmen", "/datum/action/item_action", {
	name: "Summon Stick Minions",
	desc: "Allows you to summon faithful stickmen allies to aide you in battle.",
	button_icon_state: "art_summon",
});
rt.type(233, "/datum/action/item_action/bhop", "/datum/action/item_action", {
	name: "Activate Jump Boots",
	desc: "Activates the jump boot's internal propulsion system, allowing the user to dash over 4-wide gaps.",
	button_icon_state: "jetboot",
});
rt.type(234, "/datum/action/item_action/chameleon", "/datum/action/item_action", {});
rt.type(235, "/datum/action/item_action/chameleon/drone", "/datum/action/item_action/chameleon", {});
rt.type(239, "/datum/action/item_action/flightsuit", "/datum/action/item_action", {});
rt.type(240, "/datum/action/item_action/flightsuit/toggle_boots", "/datum/action/item_action/flightsuit", {
	name: "Toggle Boots",
	button_icon_state: "flightsuit_shoes",
	background_icon_state: "bg_tech",
});
rt.type(241, "/datum/action/item_action/flightsuit/toggle_helmet", "/datum/action/item_action/flightsuit", {
	name: "Toggle Helmet",
	button_icon_state: "flightsuit_helmet",
	background_icon_state: "bg_tech",
});
rt.type(242, "/datum/action/item_action/flightsuit/toggle_flightpack", "/datum/action/item_action/flightsuit", {
	name: "Toggle Flightpack",
	button_icon_state: "flightsuit_pack",
	background_icon_state: "bg_tech",
});
rt.type(243, "/datum/action/item_action/flightsuit/lock_suit", "/datum/action/item_action/flightsuit", {
	name: "Lock Suit",
	button_icon_state: "flightsuit_lock",
	background_icon_state: "bg_tech",
});
rt.type(244, "/datum/action/item_action/flightpack", "/datum/action/item_action", {});
rt.type(245, "/datum/action/item_action/flightpack/toggle_flight", "/datum/action/item_action/flightpack", {
	name: "Toggle Flight",
	button_icon_state: "flightpack_fly",
	background_icon_state: "bg_tech_blue",
});
rt.type(246, "/datum/action/item_action/flightpack/engage_boosters", "/datum/action/item_action/flightpack", {
	name: "Toggle Boosters",
	button_icon_state: "flightpack_boost",
	background_icon_state: "bg_tech_blue",
});
rt.type(247, "/datum/action/item_action/flightpack/toggle_stabilizers", "/datum/action/item_action/flightpack", {
	name: "Toggle Stabilizers",
	button_icon_state: "flightpack_stabilizer",
	background_icon_state: "bg_tech_blue",
});
rt.type(248, "/datum/action/item_action/flightpack/change_power", "/datum/action/item_action/flightpack", {
	name: "Flight Power Setting",
	button_icon_state: "flightpack_power",
	background_icon_state: "bg_tech_blue",
});
rt.type(249, "/datum/action/item_action/flightpack/toggle_airbrake", "/datum/action/item_action/flightpack", {
	name: "Toggle Airbrake",
	button_icon_state: "flightpack_airbrake",
	background_icon_state: "bg_tech_blue",
});
rt.type(250, "/datum/action/item_action/flightpack/zoom", "/datum/action/item_action/flightpack", {
	name: "Helmet Smart Zoom",
	background_icon_state: "bg_tech_blue",
	button_icon_state: "sniper_zoom",
});
rt.type(251, "/datum/action/item_action/immortality", "/datum/action/item_action", {
	name: "Immortality",
});
rt.type(255, "/datum/action/generic/drone", "/datum/action/generic", {});
rt.type(256, "/datum/action/generic/drone/select_filter", "/datum/action/generic/drone", {
	name: "Select Vision Filter",
	button_icon_state: "drone_vision",
	procname: rt.procRef("/mob/living/simple_animal/drone/verb/toggle_statics"),
});
rt.type(363, "/datum/ai_laws/default", "/datum/ai_laws", {});
rt.type(364, "/datum/ai_laws/default/asimov", "/datum/ai_laws/default", {
	name: "Three Laws of Robotics",
	id: "asimov",
	inherent: null,
});
rt.type(365, "/datum/ai_laws/default/paladin", "/datum/ai_laws/default", {
	name: "Personality Test",
	id: "paladin",
	inherent: null,
});
rt.type(366, "/datum/ai_laws/default/corporate", "/datum/ai_laws/default", {
	name: "Bankruptcy Advoidance Plan",
	id: "corporate",
	inherent: null,
});
rt.type(367, "/datum/ai_laws/paladin5", "/datum/ai_laws", {
	name: "Paladin 5th Edition",
	id: "paladin5",
	inherent: null,
});
rt.type(368, "/datum/ai_laws/tyrant", "/datum/ai_laws", {
	name: "Loyalty Test",
	id: "tyrant",
	inherent: null,
});
rt.type(369, "/datum/ai_laws/robocop", "/datum/ai_laws", {
	name: "Prime Directives",
	id: "robocop",
	inherent: null,
});
rt.type(371, "/datum/ai_laws/syndicate_override", "/datum/ai_laws", {
	name: "SyndOS 3.1",
	id: "syndie",
	inherent: null,
});
rt.type(372, "/datum/ai_laws/ninja_override", "/datum/ai_laws", {
	name: "SpiderOS 3.1",
	id: "ninja",
	inherent: null,
});
rt.type(373, "/datum/ai_laws/antimov", "/datum/ai_laws", {
	name: "Primary Mission Objectives",
	id: "antimov",
	inherent: null,
});
rt.type(374, "/datum/ai_laws/asimovpp", "/datum/ai_laws", {
	name: "Asimov++",
	id: "asimovpp",
	inherent: null,
});
rt.type(375, "/datum/ai_laws/thermodynamic", "/datum/ai_laws", {
	name: "Thermodynamic",
	id: "thermodynamic",
	inherent: null,
});
rt.type(376, "/datum/ai_laws/hippocratic", "/datum/ai_laws", {
	name: "Robodoctor 2556",
	id: "hippocratic",
	inherent: null,
});
rt.type(377, "/datum/ai_laws/maintain", "/datum/ai_laws", {
	name: "Station Efficiency",
	id: "maintain",
	inherent: null,
});
rt.type(378, "/datum/ai_laws/drone", "/datum/ai_laws", {
	name: "Mother Drone",
	id: "drone",
	inherent: null,
});
rt.type(379, "/datum/ai_laws/liveandletlive", "/datum/ai_laws", {
	name: "Live and Let Live",
	id: "liveandletlive",
	inherent: null,
});
rt.type(380, "/datum/ai_laws/peacekeeper", "/datum/ai_laws", {
	name: "UN-2000",
	id: "peacekeeper",
	inherent: null,
});
rt.type(381, "/datum/ai_laws/reporter", "/datum/ai_laws", {
	name: "CCTV",
	id: "reporter",
	inherent: null,
});
rt.type(382, "/datum/ai_laws/balance", "/datum/ai_laws", {
	name: "Guardian of Balance",
	id: "balance",
	inherent: null,
});
rt.type(398, "/datum/dna/stored", "/datum/dna", {});
rt.type(400, "/datum/dog_fashion/head", "/datum/dog_fashion", {
	icon_file: rt.rsc("icons/mob/corgi_head.dmi"),
});
rt.type(401, "/datum/dog_fashion/head/helmet", "/datum/dog_fashion/head", {
	name: "Sergeant REAL_NAME",
	desc: "The ever-loyal, the ever-vigilant.",
});
rt.type(402, "/datum/dog_fashion/head/chef", "/datum/dog_fashion/head", {
	name: "Sous chef REAL_NAME",
	desc: "Your food will be taste-tested.  All of it.",
});
rt.type(403, "/datum/dog_fashion/head/captain", "/datum/dog_fashion/head", {
	name: "Captain REAL_NAME",
	desc: "Probably better than the last captain.",
});
rt.type(405, "/datum/dog_fashion/head/rabbit", "/datum/dog_fashion/head", {
	name: "Hoppy",
	emote_see: null,
	desc: "This is Hoppy. It's a corgi-...urmm... bunny rabbit.",
});
rt.type(406, "/datum/dog_fashion/head/beret", "/datum/dog_fashion/head", {
	name: "Yann",
	desc: "Mon dieu! C'est un chien!",
	speak: null,
	emote_see: null,
});
rt.type(407, "/datum/dog_fashion/head/detective", "/datum/dog_fashion/head", {
	name: "Detective REAL_NAME",
	desc: "NAME sees through your lies...",
	emote_see: null,
});
rt.type(408, "/datum/dog_fashion/head/nurse", "/datum/dog_fashion/head", {
	name: "Nurse REAL_NAME",
	desc: "NAME needs 100cc of beef jerky... STAT!",
});
rt.type(411, "/datum/dog_fashion/head/warden", "/datum/dog_fashion/head", {
	name: "Officer REAL_NAME",
	emote_see: null,
	desc: "Stop right there criminal scum!",
});
rt.type(412, "/datum/dog_fashion/head/blue_wizard", "/datum/dog_fashion/head", {
	name: "Grandwizard REAL_NAME",
	speak: null,
});
rt.type(413, "/datum/dog_fashion/head/red_wizard", "/datum/dog_fashion/head", {
	name: "Pyromancer REAL_NAME",
	speak: null,
});
rt.type(414, "/datum/dog_fashion/head/cardborg", "/datum/dog_fashion/head", {
	name: "Borgi",
	speak: null,
	emote_see: null,
	desc: "Result of robotics budget cuts.",
});
rt.type(415, "/datum/dog_fashion/head/ghost", "/datum/dog_fashion/head", {
	name: "１Ghost",
	speak: null,
	emote_see: null,
	emote_hear: null,
	desc: "Spooky!",
	obj_icon_state: "sheet",
});
rt.type(416, "/datum/dog_fashion/head/santa", "/datum/dog_fashion/head", {
	name: "Santa's Corgi Helper",
	emote_hear: null,
	emote_see: null,
	desc: "He's very fond of milk and cookies.",
});
rt.type(417, "/datum/dog_fashion/head/cargo_tech", "/datum/dog_fashion/head", {
	name: "Corgi Tech REAL_NAME",
	desc: "The reason your yellow gloves have chew-marks.",
});
rt.type(418, "/datum/dog_fashion/head/reindeer", "/datum/dog_fashion/head", {
	name: "REAL_NAME the red-nosed Corgi",
	emote_hear: null,
	desc: "He has a very shiny nose.",
});
rt.type(420, "/datum/dog_fashion/head/hop", "/datum/dog_fashion/head", {
	name: "Lieutenant REAL_NAME",
	desc: "Can actually be trusted to not run off on his own.",
});
rt.type(421, "/datum/dog_fashion/head/deathsquad", "/datum/dog_fashion/head", {
	name: "Trooper REAL_NAME",
	desc: "That's not red paint. That's real corgi blood.",
});
rt.type(422, "/datum/dog_fashion/head/clown", "/datum/dog_fashion/head", {
	name: "REAL_NAME the Clown",
	desc: "Honkman's best friend.",
	speak: null,
	emote_see: null,
});
rt.type(423, "/datum/dog_fashion/back", "/datum/dog_fashion", {
	icon_file: rt.rsc("icons/mob/corgi_back.dmi"),
});
rt.type(424, "/datum/dog_fashion/back/deathsquad", "/datum/dog_fashion/back", {
	name: "Trooper REAL_NAME",
	desc: "That's not red paint. That's real corgi blood.",
});
rt.type(427, "/datum/emote/sound/beep", "/datum/emote/sound", {
	key: "beep",
	key_third_person: "beeps",
	message: "beeps.",
	message_param: "beeps at %t.",
	sound: rt.rsc("sound/machines/twobeep.ogg"),
});
rt.type(554, "/datum/atom_hud/data", "/datum/atom_hud", {});
rt.type(555, "/datum/atom_hud/data/human", "/datum/atom_hud/data", {});
rt.type(556, "/datum/atom_hud/data/human/medical", "/datum/atom_hud/data/human", {
	hud_icons: null,
});
rt.type(558, "/datum/atom_hud/data/human/medical/advanced", "/datum/atom_hud/data/human/medical", {});
rt.type(559, "/datum/atom_hud/data/human/security", "/datum/atom_hud/data/human", {});
rt.type(561, "/datum/atom_hud/data/human/security/advanced", "/datum/atom_hud/data/human/security", {
	hud_icons: null,
});
rt.type(562, "/datum/atom_hud/data/diagnostic", "/datum/atom_hud/data", {
	hud_icons: null,
});
rt.type(622, "/datum/outfit/ashwalker", "/datum/outfit", {
	name: "Ashwalker",
	head: rt.typePath("/obj/item/clothing/head/helmet/gladiator"),
	uniform: rt.typePath("/obj/item/clothing/under/gladiator/ash_walker"),
});
rt.type(623, "/datum/outfit/lavalandprisoner", "/datum/outfit", {
	name: "Lavaland Prisoner",
	uniform: rt.typePath("/obj/item/clothing/under/rank/prisoner"),
	mask: rt.typePath("/obj/item/clothing/mask/breath"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/orange"),
	r_pocket: rt.typePath("/obj/item/weapon/tank/internals/emergency_oxygen"),
});
rt.type(637, "/datum/outfit/spacebartender", "/datum/outfit", {
	name: "Space Bartender",
	uniform: rt.typePath("/obj/item/clothing/under/rank/bartender"),
	back: rt.typePath("/obj/item/weapon/storage/backpack"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/black"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/vest"),
	glasses: rt.typePath("/obj/item/clothing/glasses/sunglasses/reagent"),
	id: rt.typePath("/obj/item/weapon/card/id"),
});
rt.type(639, "/datum/outfit/nanotrasenbridgeofficercorpse", "/datum/outfit", {
	name: "Bridge Officer Corpse",
	ears: rt.typePath("/obj/item/device/radio/headset/heads/hop"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/centcom_officer"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/bulletproof"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/black"),
	glasses: rt.typePath("/obj/item/clothing/glasses/sunglasses"),
	id: rt.typePath("/obj/item/weapon/card/id"),
});
rt.type(640, "/datum/outfit/nanotrasencommandercorpse", "/datum/outfit", {
	name: "Nanotrasen Private Security Commander",
	uniform: rt.typePath("/obj/item/clothing/under/rank/centcom_commander"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/bulletproof"),
	ears: rt.typePath("/obj/item/device/radio/headset/heads/captain"),
	glasses: rt.typePath("/obj/item/clothing/glasses/eyepatch"),
	mask: rt.typePath("/obj/item/clothing/mask/cigarette/cigar/cohiba"),
	head: rt.typePath("/obj/item/clothing/head/centhat"),
	gloves: rt.typePath("/obj/item/clothing/gloves/combat"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat/swat"),
	r_pocket: rt.typePath("/obj/item/weapon/lighter"),
	id: rt.typePath("/obj/item/weapon/card/id"),
});
rt.type(641, "/datum/outfit/nanotrasensoldiercorpse", "/datum/outfit", {
	name: "NT Private Security Officer Corpse",
	uniform: rt.typePath("/obj/item/clothing/under/rank/security"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/vest"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat"),
	gloves: rt.typePath("/obj/item/clothing/gloves/combat"),
	mask: rt.typePath("/obj/item/clothing/mask/gas/sechailer/swat"),
	head: rt.typePath("/obj/item/clothing/head/helmet/swat/nanotrasen"),
	back: rt.typePath("/obj/item/weapon/storage/backpack/security"),
	id: rt.typePath("/obj/item/weapon/card/id"),
});
rt.type(642, "/datum/outfit/abductorcorpse", "/datum/outfit", {
	name: "Abductor Corpse",
	uniform: rt.typePath("/obj/item/clothing/under/color/grey"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat"),
});
rt.type(643, "/datum/outfit/cryobartender", "/datum/outfit", {
	name: "Cryogenic Bartender",
	uniform: rt.typePath("/obj/item/clothing/under/rank/bartender"),
	back: rt.typePath("/obj/item/weapon/storage/backpack"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/black"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/vest"),
	glasses: rt.typePath("/obj/item/clothing/glasses/sunglasses/reagent"),
});
rt.type(648, "/datum/outfit/butler", "/datum/outfit", {
	name: "Butler",
	uniform: rt.typePath("/obj/item/clothing/under/suit_jacket/really_black"),
	shoes: rt.typePath("/obj/item/clothing/shoes/laceup"),
	head: rt.typePath("/obj/item/clothing/head/bowler"),
	glasses: rt.typePath("/obj/item/clothing/glasses/monocle"),
	gloves: rt.typePath("/obj/item/clothing/gloves/color/white"),
});
rt.type(661, "/datum/outfit/space", "/datum/outfit", {
	name: "Standard Space Gear",
	uniform: rt.typePath("/obj/item/clothing/under/color/grey"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/black"),
	suit: rt.typePath("/obj/item/clothing/suit/space"),
	head: rt.typePath("/obj/item/clothing/head/helmet/space"),
	back: rt.typePath("/obj/item/weapon/tank/jetpack/oxygen"),
	mask: rt.typePath("/obj/item/clothing/mask/breath"),
});
rt.type(662, "/datum/outfit/tournament", "/datum/outfit", {
	name: "tournament standard red",
	uniform: rt.typePath("/obj/item/clothing/under/color/red"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/black"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/vest"),
	head: rt.typePath("/obj/item/clothing/head/helmet/thunderdome"),
	r_hand: rt.typePath("/obj/item/weapon/gun/energy/pulse/destroyer"),
	l_hand: rt.typePath("/obj/item/weapon/kitchen/knife"),
	r_pocket: rt.typePath("/obj/item/weapon/grenade/smokebomb"),
});
rt.type(663, "/datum/outfit/tournament/green", "/datum/outfit/tournament", {
	name: "tournament standard green",
	uniform: rt.typePath("/obj/item/clothing/under/color/green"),
});
rt.type(664, "/datum/outfit/tournament/gangster", "/datum/outfit/tournament", {
	name: "tournament gangster",
	l_hand: null,
	uniform: rt.typePath("/obj/item/clothing/under/rank/det"),
	suit: rt.typePath("/obj/item/clothing/suit/det_suit"),
	glasses: rt.typePath("/obj/item/clothing/glasses/thermal/monocle"),
	head: rt.typePath("/obj/item/clothing/head/fedora/det_hat"),
	r_hand: rt.typePath("/obj/item/weapon/gun/ballistic"),
	r_pocket: rt.typePath("/obj/item/ammo_box/c10mm"),
});
rt.type(668, "/datum/outfit/pirate", "/datum/outfit", {
	name: "Pirate",
	uniform: rt.typePath("/obj/item/clothing/under/pirate"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/brown"),
	head: rt.typePath("/obj/item/clothing/head/bandana"),
	glasses: rt.typePath("/obj/item/clothing/glasses/eyepatch"),
	r_hand: rt.typePath("/obj/item/weapon/melee/energy/sword/pirate"),
});
rt.type(669, "/datum/outfit/pirate/space", "/datum/outfit/pirate", {
	name: "Space Pirate",
	suit: rt.typePath("/obj/item/clothing/suit/space/pirate"),
	head: rt.typePath("/obj/item/clothing/head/helmet/space/pirate"),
});
rt.type(675, "/datum/outfit/ghost_cultist", "/datum/outfit", {
	name: "Cultist Ghost",
	uniform: rt.typePath("/obj/item/clothing/under/color/black/ghost"),
	suit: rt.typePath("/obj/item/clothing/suit/cultrobes/alt/ghost"),
	shoes: rt.typePath("/obj/item/clothing/shoes/cult/alt/ghost"),
	head: rt.typePath("/obj/item/clothing/head/culthood/alt/ghost"),
	r_hand: rt.typePath("/obj/item/weapon/melee/cultblade/ghost"),
});
rt.type(678, "/datum/outfit/plasmaman", "/datum/outfit", {
	name: "Plasmaman",
	head: rt.typePath("/obj/item/clothing/head/helmet/space/plasmaman"),
	uniform: rt.typePath("/obj/item/clothing/under/plasmaman"),
	r_hand: rt.typePath("/obj/item/weapon/tank/internals/plasmaman/belt/full"),
	mask: rt.typePath("/obj/item/clothing/mask/breath"),
});
rt.type(681, "/datum/outfit/chrono_agent", "/datum/outfit", {
	name: "Timeline Eradication Agent",
	uniform: rt.typePath("/obj/item/clothing/under/color/white"),
	suit: rt.typePath("/obj/item/clothing/suit/space/chronos"),
	back: rt.typePath("/obj/item/weapon/chrono_eraser"),
	head: rt.typePath("/obj/item/clothing/head/helmet/space/chronos"),
	mask: rt.typePath("/obj/item/clothing/mask/breath"),
	suit_store: rt.typePath("/obj/item/weapon/tank/internals/oxygen"),
});
rt.type(723, "/datum/outfit/syndicatesoldiercorpse", "/datum/outfit", {
	name: "Syndicate Operative Corpse",
	uniform: rt.typePath("/obj/item/clothing/under/syndicate"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/vest"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat"),
	gloves: rt.typePath("/obj/item/clothing/gloves/combat"),
	ears: rt.typePath("/obj/item/device/radio/headset"),
	mask: rt.typePath("/obj/item/clothing/mask/gas"),
	head: rt.typePath("/obj/item/clothing/head/helmet/swat"),
	back: rt.typePath("/obj/item/weapon/storage/backpack"),
	id: rt.typePath("/obj/item/weapon/card/id"),
});
rt.type(724, "/datum/outfit/syndicatecommandocorpse", "/datum/outfit", {
	name: "Syndicate Commando Corpse",
	uniform: rt.typePath("/obj/item/clothing/under/syndicate"),
	suit: rt.typePath("/obj/item/clothing/suit/space/hardsuit/syndi"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat"),
	gloves: rt.typePath("/obj/item/clothing/gloves/combat"),
	ears: rt.typePath("/obj/item/device/radio/headset"),
	mask: rt.typePath("/obj/item/clothing/mask/gas/syndicate"),
	back: rt.typePath("/obj/item/weapon/tank/jetpack/oxygen"),
	r_pocket: rt.typePath("/obj/item/weapon/tank/internals/emergency_oxygen"),
	id: rt.typePath("/obj/item/weapon/card/id"),
});
rt.type(725, "/datum/outfit/syndicatestormtroopercorpse", "/datum/outfit", {
	name: "Syndicate Stormtrooper Corpse",
	uniform: rt.typePath("/obj/item/clothing/under/syndicate"),
	suit: rt.typePath("/obj/item/clothing/suit/space/hardsuit/syndi/elite"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat"),
	gloves: rt.typePath("/obj/item/clothing/gloves/combat"),
	ears: rt.typePath("/obj/item/device/radio/headset"),
	mask: rt.typePath("/obj/item/clothing/mask/gas/syndicate"),
	back: rt.typePath("/obj/item/weapon/tank/jetpack/oxygen/harness"),
	id: rt.typePath("/obj/item/weapon/card/id"),
});
rt.type(726, "/datum/outfit/piratecorpse", "/datum/outfit", {
	name: "Pirate Corpse",
	uniform: rt.typePath("/obj/item/clothing/under/pirate"),
	shoes: rt.typePath("/obj/item/clothing/shoes/jackboots"),
	glasses: rt.typePath("/obj/item/clothing/glasses/eyepatch"),
	head: rt.typePath("/obj/item/clothing/head/bandana"),
});
rt.type(727, "/datum/outfit/piratecorpse/ranged", "/datum/outfit/piratecorpse", {
	name: "Pirate Gunner Corpse",
	suit: rt.typePath("/obj/item/clothing/suit/pirate"),
	head: rt.typePath("/obj/item/clothing/head/pirate"),
});
rt.type(728, "/datum/outfit/russiancorpse", "/datum/outfit", {
	name: "Russian Corpse",
	uniform: rt.typePath("/obj/item/clothing/under/soviet"),
	shoes: rt.typePath("/obj/item/clothing/shoes/jackboots"),
	head: rt.typePath("/obj/item/clothing/head/bearpelt"),
});
rt.type(729, "/datum/outfit/russiancorpse/ranged", "/datum/outfit/russiancorpse", {
	name: "Ranged Russian Corpse",
	head: rt.typePath("/obj/item/clothing/head/ushanka"),
});
rt.type(730, "/datum/outfit/russiancorpse/ranged/trooper", "/datum/outfit/russiancorpse/ranged", {
	name: "Ranged Russian Trooper Corpse",
	uniform: rt.typePath("/obj/item/clothing/under/syndicate/camo"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/bulletproof"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat"),
	gloves: rt.typePath("/obj/item/clothing/gloves/combat"),
	ears: rt.typePath("/obj/item/device/radio/headset"),
	mask: rt.typePath("/obj/item/clothing/mask/balaclava"),
	head: rt.typePath("/obj/item/clothing/head/helmet/alt"),
});
rt.type(731, "/datum/outfit/russiancorpse/officer", "/datum/outfit/russiancorpse", {
	name: "Russian Officer Corpse",
	uniform: rt.typePath("/obj/item/clothing/under/rank/security/navyblue/russian"),
	suit: rt.typePath("/obj/item/clothing/suit/security/officer/russian"),
	shoes: rt.typePath("/obj/item/clothing/shoes/laceup"),
	ears: rt.typePath("/obj/item/device/radio/headset"),
	head: rt.typePath("/obj/item/clothing/head/ushanka"),
});
rt.type(732, "/datum/outfit/wizardcorpse", "/datum/outfit", {
	name: "Space Wizard Corpse",
	uniform: rt.typePath("/obj/item/clothing/under/color/lightpurple"),
	suit: rt.typePath("/obj/item/clothing/suit/wizrobe"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sandal/magic"),
	head: rt.typePath("/obj/item/clothing/head/wizard"),
});
rt.type(733, "/datum/outfit/nanotrasensoldiercorpse2", "/datum/outfit", {
	name: "NT Private Security Officer Corpse",
	uniform: rt.typePath("/obj/item/clothing/under/rank/security"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/vest"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat"),
	gloves: rt.typePath("/obj/item/clothing/gloves/combat"),
	ears: rt.typePath("/obj/item/device/radio/headset"),
	mask: rt.typePath("/obj/item/clothing/mask/gas/sechailer/swat"),
	head: rt.typePath("/obj/item/clothing/head/helmet/swat/nanotrasen"),
	back: rt.typePath("/obj/item/weapon/storage/backpack/security"),
	id: rt.typePath("/obj/item/weapon/card/id"),
});
rt.type(736, "/datum/outfit/vr_basic", "/datum/outfit", {
	name: "basic vr",
	uniform: rt.typePath("/obj/item/clothing/under/color/random"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/black"),
});
rt.type(740, "/datum/riding/space", "/datum/riding", {});
rt.type(747, "/datum/riding/scooter/skateboard", "/datum/riding/scooter", {
	vehicle_move_delay: 0,
});
rt.type(757, "/datum/map_template/ruin/lavaland", "/datum/map_template/ruin", {
	prefix: "_maps/RandomRuins/LavaRuins/",
});
rt.type(758, "/datum/map_template/ruin/lavaland/biodome", "/datum/map_template/ruin/lavaland", {
	cost: 5,
	allow_duplicates: 0,
});
rt.type(759, "/datum/map_template/ruin/lavaland/biodome/beach", "/datum/map_template/ruin/lavaland/biodome", {
	id: "biodome-beach",
	description: "Seemingly plucked from a tropical destination, this beach is calm and cool, with the salty waves roaring softly in the background. Comes with a rustic wooden bar and suicidal bartender.",
	suffix: "lavaland_biodome_beach.dmm",
	name: "Biodome Beach",
});
rt.type(760, "/datum/map_template/ruin/lavaland/biodome/winter", "/datum/map_template/ruin/lavaland/biodome", {
	id: "biodome-winter",
	description: "For those getaways where you want to get back to nature, but you don't want to leave the fortified military compound where you spend your days. Includes a unique(*) laser pistol display case, and the recently introduced I.C.E(tm).",
	suffix: "lavaland_surface_biodome_winter.dmm",
	name: "Biodome Winter",
});
rt.type(761, "/datum/map_template/ruin/lavaland/biodome/clown", "/datum/map_template/ruin/lavaland/biodome", {
	id: "biodome-clown",
	description: "WELCOME TO CLOWN PLANET! HONK HONK HONK etc.!",
	suffix: "lavaland_biodome_clown_planet.dmm",
	name: "Biodome Clown Planet",
});
rt.type(762, "/datum/map_template/ruin/lavaland/cube", "/datum/map_template/ruin/lavaland", {
	id: "wishgranter-cube",
	description: "Nothing good can come from this. Learn from their mistakes and turn around.",
	suffix: "lavaland_surface_cube.dmm",
	cost: 10,
	allow_duplicates: 0,
	name: "The Wishgranter Cube",
});
rt.type(763, "/datum/map_template/ruin/lavaland/seed_vault", "/datum/map_template/ruin/lavaland", {
	id: "seed-vault",
	description: "The creators of these vaults were a highly advanced and benevolent race, and launched many into the stars, hoping to aid fledgling civilizations. However, all the inhabitants seem to do is grow drugs and guns.",
	suffix: "lavaland_surface_seed_vault.dmm",
	cost: 10,
	allow_duplicates: 0,
	name: "Seed Vault",
});
rt.type(764, "/datum/map_template/ruin/lavaland/ash_walker", "/datum/map_template/ruin/lavaland", {
	id: "ash-walker",
	description: "A race of unbreathing lizards live here, that run faster than a human can, worship a broken dead city, and are capable of reproducing by something involving tentacles? Probably best to stay clear.",
	suffix: "lavaland_surface_ash_walker1.dmm",
	cost: 20,
	allow_duplicates: 0,
	name: "Ash Walker Nest",
});
rt.type(765, "/datum/map_template/ruin/lavaland/syndicate_base", "/datum/map_template/ruin/lavaland", {
	id: "lava-base",
	description: "A secret base researching illegal bioweapons, it is closely guarded by an elite team of syndicate agents.",
	suffix: "lavaland_surface_syndicate_base1.dmm",
	cost: 20,
	allow_duplicates: 0,
	name: "Syndicate Lava Base",
});
rt.type(766, "/datum/map_template/ruin/lavaland/free_golem", "/datum/map_template/ruin/lavaland", {
	id: "golem-ship",
	description: "Lumbering humanoids, made out of precious metals, move inside this ship. They frequently leave to mine more minerals, which they somehow turn into more of them. Seem very intent on research and individual liberty, and also geology based naming?",
	cost: 20,
	suffix: "lavaland_surface_golem_ship.dmm",
	allow_duplicates: 0,
	name: "Free Golem Ship",
});
rt.type(767, "/datum/map_template/ruin/lavaland/animal_hospital", "/datum/map_template/ruin/lavaland", {
	id: "animal-hospital",
	description: "Rats with cancer do not live very long. And the ones that wake up from cryostasis seem to commit suicide out of boredom.",
	cost: 5,
	suffix: "lavaland_surface_animal_hospital.dmm",
	allow_duplicates: 0,
	name: "Animal Hospital",
});
rt.type(768, "/datum/map_template/ruin/lavaland/sin", "/datum/map_template/ruin/lavaland", {
	cost: 10,
	allow_duplicates: 0,
});
rt.type(769, "/datum/map_template/ruin/lavaland/sin/envy", "/datum/map_template/ruin/lavaland/sin", {
	id: "envy",
	description: "When you get what they have, then you'll finally be happy.",
	suffix: "lavaland_surface_envy.dmm",
	name: "Ruin of Envy",
});
rt.type(770, "/datum/map_template/ruin/lavaland/sin/gluttony", "/datum/map_template/ruin/lavaland/sin", {
	id: "gluttony",
	description: "If you eat enough, then eating will be all that you do.",
	suffix: "lavaland_surface_gluttony.dmm",
	name: "Ruin of Gluttony",
});
rt.type(771, "/datum/map_template/ruin/lavaland/sin/greed", "/datum/map_template/ruin/lavaland/sin", {
	id: "greed",
	description: "Sure you don't need magical powers, but you WANT them, and that's what's important.",
	suffix: "lavaland_surface_greed.dmm",
	name: "Ruin of Greed",
});
rt.type(772, "/datum/map_template/ruin/lavaland/sin/pride", "/datum/map_template/ruin/lavaland/sin", {
	id: "pride",
	description: "Wormhole lifebelts are for LOSERS, who you are better than.",
	suffix: "lavaland_surface_pride.dmm",
	name: "Ruin of Pride",
});
rt.type(773, "/datum/map_template/ruin/lavaland/sin/sloth", "/datum/map_template/ruin/lavaland/sin", {
	id: "sloth",
	description: "...",
	suffix: "lavaland_surface_sloth.dmm",
	cost: 0,
	name: "Ruin of Sloth",
});
rt.type(774, "/datum/map_template/ruin/lavaland/hierophant", "/datum/map_template/ruin/lavaland", {
	id: "hierophant",
	description: "A strange, square chunk of metal of massive size. Inside awaits only death and many, many squares.",
	suffix: "lavaland_surface_hierophant.dmm",
	cost: 0,
	allow_duplicates: 0,
	name: "Hierophant's Arena",
});
rt.type(775, "/datum/map_template/ruin/lavaland/ufo_crash", "/datum/map_template/ruin/lavaland", {
	id: "ufo-crash",
	description: "Turns out that keeping your abductees unconcious is really important. Who knew?",
	suffix: "lavaland_surface_ufo_crash.dmm",
	cost: 5,
	name: "UFO Crash",
});
rt.type(776, "/datum/map_template/ruin/lavaland/xeno_nest", "/datum/map_template/ruin/lavaland", {
	id: "xeno-nest",
	description: "These xenomorphs got bored of horrifically slaughtering people on space stations, and have settled down on a nice lava filled hellscape to focus on what's really important in life. Quality memes.",
	suffix: "lavaland_surface_xeno_nest.dmm",
	cost: 20,
	name: "Xenomorph Nest",
});
rt.type(777, "/datum/map_template/ruin/lavaland/fountain", "/datum/map_template/ruin/lavaland", {
	id: "fountain",
	description: "The fountain has a warning on the side. DANGER: May have undeclared side effects that only become obvious when implemented.",
	suffix: "lavaland_surface_fountain_hall.dmm",
	cost: 5,
	name: "Fountain Hall",
});
rt.type(778, "/datum/map_template/ruin/lavaland/survivalcapsule", "/datum/map_template/ruin/lavaland", {
	id: "survivalcapsule",
	description: "What was once sanctuary to the common miner, is now their tomb.",
	suffix: "lavaland_surface_survivalpod.dmm",
	cost: 5,
	name: "Survival Capsule Ruins",
});
rt.type(779, "/datum/map_template/ruin/lavaland/pizza", "/datum/map_template/ruin/lavaland", {
	id: "pizza",
	description: "Little Timmy's birthday pizza-bash took a turn for the worse when a bluespace anomaly passed by.",
	suffix: "lavaland_surface_pizzaparty.dmm",
	allow_duplicates: 0,
	cost: 5,
	name: "Ruined Pizza Party",
});
rt.type(780, "/datum/map_template/ruin/lavaland/cultaltar", "/datum/map_template/ruin/lavaland", {
	id: "cultaltar",
	description: "A place of vile worship, the scrawling of blood in the middle glowing eerily. A demonic laugh echoes throughout the caverns",
	suffix: "lavaland_surface_cultaltar.dmm",
	allow_duplicates: 0,
	cost: 10,
	name: "Summoning Ritual",
});
rt.type(781, "/datum/map_template/ruin/lavaland/hermit", "/datum/map_template/ruin/lavaland", {
	id: "hermitcave",
	description: "A place of shelter for a lone hermit, scraping by to live another day.",
	suffix: "lavaland_surface_hermit.dmm",
	allow_duplicates: 0,
	cost: 10,
	name: "Makeshift Shelter",
});
rt.type(782, "/datum/map_template/ruin/lavaland/swarmer_boss", "/datum/map_template/ruin/lavaland", {
	id: "swarmerboss",
	description: "A Syndicate shuttle had an unfortunate stowaway...",
	suffix: "lavaland_surface_swarmer_crash.dmm",
	allow_duplicates: 0,
	cost: 20,
	name: "Crashed Shuttle",
});
rt.type(783, "/datum/map_template/ruin/lavaland/miningripley", "/datum/map_template/ruin/lavaland", {
	id: "ripley",
	description: "A heavily-damaged mining ripley, property of a very unfortunate miner. You might have to do a bit of work to fix this thing up.",
	suffix: "lavaland_surface_random_ripley.dmm",
	allow_duplicates: 0,
	cost: 5,
	name: "Ripley",
});
rt.type(784, "/datum/map_template/ruin/space", "/datum/map_template/ruin", {
	prefix: "_maps/RandomRuins/SpaceRuins/",
	cost: 1,
	allow_duplicates: 0,
});
rt.type(785, "/datum/map_template/ruin/space/zoo", "/datum/map_template/ruin/space", {
	id: "zoo",
	suffix: "abandonedzoo.dmm",
	description: "In case society crumbles, we will be able to restore our zoos to working order with the breeding stock kept in these 100% secure and unbreachable storage facilities. At no point has anything escaped. That's our story, and we're sticking to it.",
	name: "Biological Storage Facility",
});
rt.type(786, "/datum/map_template/ruin/space/asteroid1", "/datum/map_template/ruin/space", {
	id: "asteroid1",
	suffix: "asteroid1.dmm",
	description: "I-spy with my little eye, something beginning with R.",
	name: "Asteroid 1",
});
rt.type(787, "/datum/map_template/ruin/space/asteroid2", "/datum/map_template/ruin/space", {
	id: "asteroid2",
	suffix: "asteroid2.dmm",
	description: "Oh my god, a giant rock!",
	name: "Asteroid 2",
});
rt.type(788, "/datum/map_template/ruin/space/asteroid3", "/datum/map_template/ruin/space", {
	id: "asteroid3",
	suffix: "asteroid3.dmm",
	description: "This asteroid floating in space has no official designation, because the scientist that discovered it deemed it 'super dull'.",
	name: "Asteroid 3",
});
rt.type(789, "/datum/map_template/ruin/space/asteroid4", "/datum/map_template/ruin/space", {
	id: "asteroid4",
	suffix: "asteroid4.dmm",
	description: "Nanotrasen Escape Pods have a 100%* success rate, and a 99%* customer satisfaction rate. *Please note that these statistics, are taken from pods that have successfully docked with a recovery vessel.",
	name: "Asteroid 4",
});
rt.type(790, "/datum/map_template/ruin/space/asteroid5", "/datum/map_template/ruin/space", {
	id: "asteroid5",
	suffix: "asteroid5.dmm",
	description: "Oh my god, another giant rock!",
	name: "Asteroid 5",
});
rt.type(791, "/datum/map_template/ruin/space/deep_storage", "/datum/map_template/ruin/space", {
	id: "deep-storage",
	suffix: "deepstorage.dmm",
	description: "Assume the best, prepare for the worst. Generally, you should do so by digging a three man heavily fortified bunker into a giant unused asteroid. Then make it self sufficient, mask any evidence of construction, hook it covertly into the telecommunications network and hope for the best.",
	name: "Survivalist Bunker",
});
rt.type(792, "/datum/map_template/ruin/space/bigderelict1", "/datum/map_template/ruin/space", {
	id: "bigderelict1",
	suffix: "bigderelict1.dmm",
	description: "A once-bustling tradestation that handled imports and exports from nearby stations now lays eerily dormant. The last received message was a distress call from one of the on-board officers, but we had no success in making contact again.",
	name: "Derelict Tradepost",
});
rt.type(793, "/datum/map_template/ruin/space/derelict1", "/datum/map_template/ruin/space", {
	id: "derelict1",
	suffix: "derelict1.dmm",
	description: "Nothing to see here citizen, move along, certainly no xeno outbreaks on this piece of station debris. That purple stuff? It's uh... station nectar. It's a top secret research installation.",
	name: "Derelict 1",
});
rt.type(794, "/datum/map_template/ruin/space/derelict2", "/datum/map_template/ruin/space", {
	id: "derelict2",
	suffix: "derelict2.dmm",
	description: "Oh this is the night\nIt's a beautiful night\nAnd we call it bella notte",
	name: "Dinner for Two",
});
rt.type(795, "/datum/map_template/ruin/space/derelict3", "/datum/map_template/ruin/space", {
	id: "derelict3",
	suffix: "derelict3.dmm",
	description: "These hulks were once part of a larger structure, where the three great [REDACTED] were forged.",
	name: "Derelict 3",
});
rt.type(796, "/datum/map_template/ruin/space/derelict4", "/datum/map_template/ruin/space", {
	id: "derelict4",
	suffix: "derelict4.dmm",
	description: "Centcom ferries have never crashed, will never crash, there is no current investigation into a crashed ferry, and we will not let Internal Affairs trample over high security information in the name of this baseless witchhunt.",
	name: "Derelict 4",
});
rt.type(797, "/datum/map_template/ruin/space/derelict5", "/datum/map_template/ruin/space", {
	id: "derelict5",
	suffix: "derelict5.dmm",
	description: "The plan is, we put a whole bunch of crates full of treasure in this disused warehouse, launch it into space, and then ignore it. Forever.",
	name: "Derelict 5",
});
rt.type(798, "/datum/map_template/ruin/space/derelict6", "/datum/map_template/ruin/space", {
	id: "derelict6",
	suffix: "derelict6.dmm",
	description: "The hush-hush of Nanotrasen when it comes to stations seemingly vanishing off the radar is an interesting topic, theories of nuclear destruction float about while Nanotrasen flat-out denies said stations ever existing.",
	name: "Derelict 6",
});
rt.type(799, "/datum/map_template/ruin/space/empty_shell", "/datum/map_template/ruin/space", {
	id: "empty-shell",
	suffix: "emptyshell.dmm",
	description: "Cosy, rural property availible for young professional couple. Only twelve parsecs from the nearest hyperspace lane!",
	name: "Empty Shell",
});
rt.type(800, "/datum/map_template/ruin/space/gas_the_lizards", "/datum/map_template/ruin/space", {
	id: "gas-the-lizards",
	suffix: "gasthelizards.dmm",
	description: "Gas efficiency at 95.6%, fluid elimination at 96.2%. Will require renewed supplies of 'carpet' before the end of the quarter.",
	name: "Disposal Facility 17",
});
rt.type(801, "/datum/map_template/ruin/space/intact_empty_ship", "/datum/map_template/ruin/space", {
	id: "intact-empty-ship",
	suffix: "intactemptyship.dmm",
	description: "Just somewhere quiet, where I can focus on my work with no interruptions.",
	name: "Authorship",
});
rt.type(802, "/datum/map_template/ruin/space/caravanambush", "/datum/map_template/ruin/space", {
	id: "space/caravanambush",
	suffix: "caravanambush.dmm",
	description: "A caravan route used by passing cargo freights has been ambushed by a salvage team manned by the syndicate. The caravan managed to send off a distress message before being surrounded, their video feed cutting off as the sound of gunfire and a parrot was heard.",
	name: "Syndicate Ambush",
});
rt.type(803, "/datum/map_template/ruin/space/originalcontent", "/datum/map_template/ruin/space", {
	id: "paperwizard",
	suffix: "originalcontent.dmm",
	description: "Sightings of a giant wad of paper hurling through the depths of space have been recently reported by multiple outposts near this sector. A giant wad of paper, really? Damn prank callers.",
	name: "A Giant Ball of Paper in Space",
});
rt.type(804, "/datum/map_template/ruin/space/mech_transport", "/datum/map_template/ruin/space", {
	id: "mech-transport",
	suffix: "mechtransport.dmm",
	description: "Well, when is it getting here? I have bills to pay; very well-armed clients who want their shipments as soon as possible! I don't care, just find it!",
	name: "CF Corsair",
});
rt.type(805, "/datum/map_template/ruin/space/onehalf", "/datum/map_template/ruin/space", {
	id: "onehalf",
	suffix: "onehalf.dmm",
	description: "Based on the trace elements we've detected on the gutted asteroids, we suspect that a mining ship using a restricted engine is somewhere in the area. We'd like to request a patrol vessel to investigate.",
	name: "DK Excavator 453",
});
rt.type(806, "/datum/map_template/ruin/space/spacehotel", "/datum/map_template/ruin/space", {
	id: "spacehotel",
	suffix: "spacehotel.dmm",
	description: "A interstellar hotel, where the weary spaceman can rest their head and relax, assured that the residental staff will not murder them in their sleep. Probably.",
	name: "The Twin-Nexus Hotel",
});
rt.type(807, "/datum/map_template/ruin/space/turreted_outpost", "/datum/map_template/ruin/space", {
	id: "turreted-outpost",
	suffix: "turretedoutpost.dmm",
	description: "We'd ask them to stop blaring that ruskiepop music, but none of us are brave enough to go near those death turrets they have.",
	name: "Unnamed Turreted Outpost",
});
rt.type(808, "/datum/map_template/ruin/space/oldshuttle", "/datum/map_template/ruin/space", {
	id: "spaceman-origins",
	suffix: "shuttlerelic.dmm",
	description: "A ship seemingly lost, drifting along the stars. This thing looks like it belongs in ancient times.",
	name: "Strange Ship",
});
rt.type(809, "/datum/map_template/ruin/space/way_home", "/datum/map_template/ruin/space", {
	id: "way-home",
	suffix: "way_home.dmm",
	description: "In the darkest times, we will find our way home.",
	name: "Salvation",
});
rt.type(810, "/datum/map_template/ruin/space/djstation", "/datum/map_template/ruin/space", {
	id: "djstation",
	suffix: "djstation.dmm",
	description: "Until very recently this pirate radio station was used to harangue local space stations over a variety of perceived \"ethics violations\". It seems like someone finally got sick of it, but the equipment still works.",
	name: "DJ Station",
});
rt.type(811, "/datum/map_template/ruin/space/thederelict", "/datum/map_template/ruin/space", {
	id: "thederelict",
	suffix: "thederelict.dmm",
	description: "The true fate of Kosmicheskaya Stantsiya 13 is an open question to this day. Most corporations deny its existence, for fear of questioning on what became of its crew.",
	name: "Kosmicheskaya Stantsiya 13",
});
rt.type(812, "/datum/map_template/ruin/space/abandonedteleporter", "/datum/map_template/ruin/space", {
	id: "abandonedteleporter",
	suffix: "abandonedteleporter.dmm",
	description: "In space construction the teleporter is often the first system brought online. This lonely half built teleporter is a sign of a proposed structure that for one reason or another just never got built.",
	name: "Abandoned Teleporter",
});
rt.type(813, "/datum/map_template/ruin/space/crashedclownship", "/datum/map_template/ruin/space", {
	id: "crashedclownship",
	suffix: "crashedclownship.dmm",
	description: "For centuries the promise of a new clown homeworld has been the siren call for countless clown vessels. Alas the clown's lust for shinanagans means that successful voyages are almost unheard of, with most vessels falling to hilarious consequences almost immediately.",
	name: "Crashed Clown Ship",
});
rt.type(814, "/datum/map_template/ruin/space/crashedship", "/datum/map_template/ruin/space", {
	id: "crashedship",
	suffix: "crashedship.dmm",
	description: "Among civilian vessels the most common cause of tragedy is lack of food. This ship was outfited with a multitude of food generating features, then summarily ran into an asteroid shortly after takeoff.",
	name: "Crashed Ship",
});
rt.type(815, "/datum/map_template/ruin/space/listeningstation", "/datum/map_template/ruin/space", {
	id: "listeningstation",
	suffix: "listeningstation.dmm",
	description: "Listening stations form the backbone of the syndicate's information gathering operations. Assignment to these stations is dreaded by most agents, as it entails long and lonely shifts listening to nearby stations chatter incessently about the most meaningless things.",
	name: "Syndicate Listening Station",
});
rt.type(816, "/datum/map_template/ruin/space/oldAIsat", "/datum/map_template/ruin/space", {
	id: "oldAIsat",
	suffix: "oldAIsat.dmm",
	description: "When the inspector told the employees that they were all fired, and that their jobs \"could be done by trained lizards anyway\", they reacted badly. This event and others is the reason why Central always sends an ERT squad with their competent inspectors. Incompetent inspectors are told they can \"do it alone\" because they're \"that pro\". Incompetent inspectors believe this.",
	name: "Abandoned Telecommunications Satellite",
});
rt.type(817, "/datum/map_template/ruin/space/oldteleporter", "/datum/map_template/ruin/space", {
	id: "oldteleporter",
	suffix: "oldteleporter.dmm",
	description: "The structure of this surprisingly intact teleporter suggests that it was once part of a larger structure, but what remains of said structure, if anything, can only be guessed at.",
	name: "Detached Teleporter",
});
rt.type(818, "/datum/map_template/ruin/space/vaporwave", "/datum/map_template/ruin/space", {
	id: "vaporwave",
	suffix: "vaporwave.dmm",
	description: "Pause and remember-- You are unique.You are special. Every mistake, trial, and hardship has helped to sculpt your real beauty. Stop hating yourself and start appreciating and loving yourself!",
	name: "Aesthetic Outpost",
});
rt.type(819, "/datum/map_template/ruin/space/bus", "/datum/map_template/ruin/space", {
	id: "bus",
	suffix: "bus.dmm",
	description: "There seems to be a pair of buses that pulled over for repairs. What were they doing..? Their shipment sure  seems to be filled with a strange mix. Anyway, it looks like some people tried to fix it up for a long time but didn't really get anywhere...",
	name: "Waylaid Buses",
});
rt.type(820, "/datum/map_template/ruin/space/oldstation", "/datum/map_template/ruin/space", {
	id: "oldstation",
	suffix: "oldstation.dmm",
	description: "The crew of a space station awaken one hundred years after a crisis. Awaking to a derelict space station on the verge of collapse, and a hostile force of invading hivebots. Can the surviving crew overcome the odds and survive and rebuild, or will the cold embrace of the stars become their new home?",
	name: "Ancient Space Station",
});
rt.type(821, "/datum/map_template/ruin/space/miracle", "/datum/map_template/ruin/space", {
	id: "miracle",
	suffix: "miracle.dmm",
	description: "Absolutely nothing strange going on here please move along, plenty more space to see right this way!",
	name: "Ordinary Space Tile",
});
rt.type(823, "/datum/map_template/shuttle/emergency", "/datum/map_template/shuttle", {
	port_id: "emergency",
	name: "Base Shuttle Template (Emergency)",
});
rt.type(825, "/datum/map_template/shuttle/emergency/asteroid", "/datum/map_template/shuttle/emergency", {
	suffix: "asteroid",
	description: "A respectable mid-sized shuttle that first saw service shuttling Nanotrasen crew to and from their asteroid belt embedded facilities.",
	credit_cost: 3000,
	name: "Asteroid Station Emergency Shuttle",
});
rt.type(826, "/datum/map_template/shuttle/emergency/bar", "/datum/map_template/shuttle/emergency", {
	suffix: "bar",
	description: "Features include sentient bar staff (a Bardrone and a Barmaid), bathroom, a quality lounge for the heads, and a large gathering table.",
	admin_notes: "Bardrone and Barmaid are GODMODE, will be automatically sentienced by the fun balloon at 60 seconds before arrival. Has medical facilities.",
	credit_cost: 5000,
	name: "The Emergency Escape Bar",
});
rt.type(827, "/datum/map_template/shuttle/emergency/russiafightpit", "/datum/map_template/shuttle/emergency", {
	suffix: "russiafightpit",
	description: "Dis is a high-quality shuttle, da. Many seats, lots of space, all equipment! Even includes entertainment! Such as lots to drink, and a fighting arena for drunk crew to have fun! If arena not fun enough, simply press button of releasing bears. Do not worry, bears trained not to break out of fighting pit, so totally safe so long as nobody stupid or drunk enough to leave door open. Try not to let asimov babycons ruin fun!",
	admin_notes: "Includes a small variety of weapons. And bears. Only captain-access can release the bears. Bears won't smash the windows themselves, but they can escape if someone lets them.",
	credit_cost: 5000,
	name: "Mother Russia Bleeds",
});
rt.type(828, "/datum/map_template/shuttle/emergency/meteor", "/datum/map_template/shuttle/emergency", {
	suffix: "meteor",
	description: "A hollowed out asteroid with engines strapped to it. Due to its size and difficulty in steering it, this shuttle may damage the docking area.",
	admin_notes: "This shuttle will likely crush escape, killing anyone there.",
	credit_cost: -5000,
	name: "Asteroid With Engines Strapped To It",
});
rt.type(829, "/datum/map_template/shuttle/emergency/luxury", "/datum/map_template/shuttle/emergency", {
	suffix: "luxury",
	description: "A luxurious golden shuttle complete with an indoor swimming pool. Each crewmember wishing to board must bring 500 credits, payable in cash and mineral coin.",
	admin_notes: "Due to the limited space for non paying crew, this shuttle may cause a riot.",
	credit_cost: 10000,
	name: "Luxury Shuttle",
});
rt.type(831, "/datum/map_template/shuttle/emergency/birdboat", "/datum/map_template/shuttle/emergency", {
	suffix: "birdboat",
	description: "Though a little on the small side, this shuttle is feature complete, which is more than can be said for the pattern of station it was commissioned for.",
	credit_cost: 1000,
	name: "Birdboat Station Emergency Shuttle",
});
rt.type(832, "/datum/map_template/shuttle/emergency/box", "/datum/map_template/shuttle/emergency", {
	suffix: "box",
	credit_cost: 2000,
	description: "The gold standard in emergency exfiltration, this tried and true design is equipped with everything the crew needs for a safe flight home.",
	name: "Box Station Emergency Shuttle",
});
rt.type(833, "/datum/map_template/shuttle/emergency/clown", "/datum/map_template/shuttle/emergency", {
	suffix: "clown",
	description: "Hey kids and grownups! Are you bored of DULL and TEDIOUS shuttle journeys after you're evacuating for probably BORING reasons. Well then order the Snappop(tm) today! We've got fun activities for everyone, an all access cockpit, and no boring security brig! Boo! Play dress up with your friends! Collect all the bedsheets before your neighbour does! Check if the AI is watching you with our patent pending \"Peeping Tom AI Multitool Detector\" or PEEEEEETUR for short. Have a fun ride!",
	admin_notes: "Brig is replaced by anchored greentext book surrounded by lavaland chasms, stationside door has been removed to prevent accidental dropping. No brig.",
	credit_cost: 8000,
	name: "Snappop(tm)!",
});
rt.type(834, "/datum/map_template/shuttle/emergency/cramped", "/datum/map_template/shuttle/emergency", {
	suffix: "cramped",
	description: "Well, looks like Centcomm only had this ship in the area, they probably weren't expecting you to need evac for a while. Probably best if you don't rifle around in whatever equipment they were transporting. I hope you're friendly with your coworkers, because there is very little space in this thing.\n\nContains contraband armory guns, maintenance loot, and abandoned crates!",
	admin_notes: "Due to origin as a solo piloted secure vessel, has an active GPS onboard labeled STV5.",
	name: "Secure Transport Vessel 5 (STV5)",
});
rt.type(835, "/datum/map_template/shuttle/emergency/meta", "/datum/map_template/shuttle/emergency", {
	suffix: "meta",
	credit_cost: 4000,
	description: "A fairly standard shuttle, though larger and slightly better equipped than the Box Station variant.",
	name: "Meta Station Emergency Shuttle",
});
rt.type(836, "/datum/map_template/shuttle/emergency/mini", "/datum/map_template/shuttle/emergency", {
	suffix: "mini",
	credit_cost: 1000,
	description: "Despite it's namesake, this shuttle is actually only slightly smaller than standard, and still complete with a brig and medbay.",
	name: "Ministation emergency shuttle",
});
rt.type(837, "/datum/map_template/shuttle/emergency/scrapheap", "/datum/map_template/shuttle/emergency", {
	suffix: "scrapheap",
	credit_cost: -1000,
	description: "Due to a lack of functional emergency shuttles, we bought this second hand from a scrapyard and pressed it into service. Please do not lean to heavily on the exterior windows, they are fragile.",
	admin_notes: "An abomination with no functional medbay, sections missing, and some very fragile windows. Surprisingly airtight.",
	name: "Standby Evacuation Vessel \"Scrapheap Challenge\"",
});
rt.type(838, "/datum/map_template/shuttle/emergency/narnar", "/datum/map_template/shuttle/emergency", {
	suffix: "narnar",
	description: "Looks like this shuttle may have wandered into the darkness between the stars on route to the station. Let's not think too hard about where all the bodies came from.",
	admin_notes: "Contains real cult ruins, mob eyeballs, and inactive constructs. Cult mobs will automatically be sentienced by fun balloon. Cloning pods in 'medbay' area are showcases and nonfunctional.",
	name: "Shuttle 667",
});
rt.type(839, "/datum/map_template/shuttle/emergency/pubby", "/datum/map_template/shuttle/emergency", {
	suffix: "pubby",
	description: "A small, but feature complete shuttle. It boasts a card table to keep crew members occupied on the long flight home.",
	credit_cost: 1000,
	name: "Pubby Station Emergency Shuttle",
});
rt.type(840, "/datum/map_template/shuttle/emergency/cere", "/datum/map_template/shuttle/emergency", {
	suffix: "cere",
	description: "The large, beefed-up version of the box-standard shuttle. Includes an expanded brig, fully stocked medbay, enhanced cargo storage with mech chargers, an engine room stocked with various supplies, and a crew capacity of 80+ to top it all off. Live large, live Cere.",
	name: "Cere Station Emergency Shuttle",
});
rt.type(841, "/datum/map_template/shuttle/emergency/supermatter", "/datum/map_template/shuttle/emergency", {
	suffix: "supermatter",
	description: "\"I dunno, this seems kinda needlessly complicated.\"\n\"This shuttle has very a very high safety record, according to Centcom Officer Cadet Yins.\"\n\"Are you sure?\"\n\"Yes, it has a safety record of N-A-N, which is apparently larger than 100%.\"",
	admin_notes: "Supermatter that spawns on shuttle is special anchored 'hugbox' supermatter that cannot take damage and does not take in or emit gas. Outside of admin intervention, it cannot explode. It does, however, still dust anything on contact, emits high levels of radiation, and induce hallucinations in anyone looking at it without protective goggles. Emitters spawn powered on, expect admin notices, they are harmless.",
	credit_cost: 100000,
	name: "Hyperfractal Gigashuttle",
});
rt.type(842, "/datum/map_template/shuttle/emergency/imfedupwiththisworld", "/datum/map_template/shuttle/emergency", {
	suffix: "imfedupwiththisworld",
	description: "How was space work today? Oh, pretty good. We got a new space station and the company will make a lot of money. What space station? I cannot tell you; it's space confidential. Aw, come space on. Why not? No, I can't. Anyway, how is your space roleplay life?",
	credit_cost: -5000,
	name: "Oh, Hi Daniel",
});
rt.type(843, "/datum/map_template/shuttle/emergency/goon", "/datum/map_template/shuttle/emergency", {
	suffix: "goon",
	description: "The Nanotrasen Emergency Shuttle Port(NES Port for short) is a shuttle used at other less known Nanotrasen facilities and has a more open inside for larger crowds, but fewer onboard shuttle facilities.",
	credit_cost: 500,
	name: "NES Port",
});
rt.type(844, "/datum/map_template/shuttle/emergency/wabbajack", "/datum/map_template/shuttle/emergency", {
	suffix: "wabbajack",
	description: "The research team based on this vessel went missing one day, and no amount of investigation could discover what happened to them. The only occupants were a number of dead rodents, who appeared to have clawed each other to death. Needless to say, no engineering team wanted to go near the thing, and it's only being used as an Emergency Escape Shuttle because there is literally nothing else available.",
	admin_notes: "If the crew can solve the puzzle, they will wake the wabbajack statue. It will likely not end well. There's a reason it's boarded up. Maybe they should have just left it alone.",
	credit_cost: 15000,
	name: "NT Lepton Violet",
});
rt.type(845, "/datum/map_template/shuttle/emergency/delta", "/datum/map_template/shuttle/emergency", {
	suffix: "delta",
	description: "A large shuttle for a large station, this shuttle can comfortably fit all your overpopulation and crowding needs. Complete with all facilities plus additional equipment.",
	admin_notes: "Go big or go home.",
	credit_cost: 7500,
	name: "Delta Station Emergency Shuttle",
});
rt.type(846, "/datum/map_template/shuttle/emergency/raven", "/datum/map_template/shuttle/emergency", {
	suffix: "raven",
	description: "The Centcomm Raven Battlecruiser is currently docked at the Centcomm ship bay awaiting a mission, this Battlecruiser has been reassigned as an emergency escape shuttle for currently unknown reasons. The Centcomm Raven Battlecruiser should comfortably fit a medium to large crew size crew and is complete with all required facitlities including a top of the range Centcomm Medical Bay.",
	admin_notes: "The long way home",
	credit_cost: 12500,
	name: "Centcomm Raven Battlecruiser",
});
rt.type(847, "/datum/map_template/shuttle/cargo", "/datum/map_template/shuttle", {
	port_id: "cargo",
	name: "Base Shuttle Template (Cargo)",
});
rt.type(848, "/datum/map_template/shuttle/cargo/box", "/datum/map_template/shuttle/cargo", {
	suffix: "box",
	name: "supply shuttle (Box)",
});
rt.type(849, "/datum/map_template/shuttle/cargo/birdboat", "/datum/map_template/shuttle/cargo", {
	suffix: "birdboat",
	name: "supply shuttle (Birdboat)",
});
rt.type(850, "/datum/map_template/shuttle/ferry", "/datum/map_template/shuttle", {
	port_id: "ferry",
	name: "Base Shuttle Template (Ferry)",
});
rt.type(851, "/datum/map_template/shuttle/ferry/base", "/datum/map_template/shuttle/ferry", {
	suffix: "base",
	description: "Standard issue Box/Metastation Centcom ferry.",
	name: "transport ferry",
});
rt.type(852, "/datum/map_template/shuttle/ferry/meat", "/datum/map_template/shuttle/ferry", {
	suffix: "meat",
	description: "Ahoy! We got all kinds o' meat aft here. Meat from plant people, people who be dark, not in a racist way, just they're dark black. Oh and lizard meat too,mighty popular that is. Definitely 100% fresh, just ask this guy here. *person on meatspike moans* See? Definitely high quality meat, nothin' wrong with it, nothin' added, definitely no zombifyin' reagents!",
	admin_notes: "Meat currently contains no zombifying reagents, lizard on meatspike must be spawned in.",
	name: "\"meat\" ferry",
});
rt.type(853, "/datum/map_template/shuttle/ferry/lighthouse", "/datum/map_template/shuttle/ferry", {
	suffix: "lighthouse",
	description: "*static*... part of a much larger vessel, possibly military in origin. The weapon markings aren't anything we've seen ...static... by almost never the same person twice, possible use of unknown storage ...static... seeing ERT officers onboard, but no missions are on file for ...static...static...annoying jingle... only at The LIGHTHOUSE! Fulfilling needs you didn't even know you had. We've got EVERYTHING, and something else!",
	admin_notes: "Currently larger than ferry docking port on Box, will not hit anything, but must be force docked. Trader and ERT bodyguards are not included.",
	name: "The Lighthouse(?)",
});
rt.type(854, "/datum/map_template/shuttle/whiteship", "/datum/map_template/shuttle", {
	port_id: "whiteship",
});
rt.type(855, "/datum/map_template/shuttle/whiteship/box", "/datum/map_template/shuttle/whiteship", {
	suffix: "box",
	name: "NT Medical Ship",
});
rt.type(856, "/datum/map_template/shuttle/whiteship/meta", "/datum/map_template/shuttle/whiteship", {
	suffix: "meta",
	name: "NT Recovery White-ship",
});
rt.type(857, "/datum/map_template/shuttle/whiteship/pubby", "/datum/map_template/shuttle/whiteship", {
	suffix: "pubby",
	name: "NT White UFO",
});
rt.type(858, "/datum/map_template/shuttle/whiteship/cere", "/datum/map_template/shuttle/whiteship", {
	suffix: "cere",
	name: "NT Construction Vessel",
});
rt.type(11217, "/obj/effect/ebeam/volt_ray", "/obj/effect/ebeam", {
	name: "volt_ray",
	layer: 3.8,
});
rt.type(11218, "/obj/effect/ebeam/chain", "/obj/effect/ebeam", {
	name: "lightning chain",
	layer: 3.8,
});
rt.type(11220, "/obj/effect/ebeam/medical", "/obj/effect/ebeam", {
	name: "medical beam",
});
