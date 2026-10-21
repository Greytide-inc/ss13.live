// Types declared in code/game/objects/items/weapons that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(5614, "/obj/item/weapon/twohanded/dualsaber/toy", "/obj/item/weapon/twohanded/dualsaber", {
	throw_speed: 3,
	throw_range: 5,
	name: "double-bladed toy sword",
	desc: "A cheap, plastic replica of TWO energy swords.  Double the fun!",
	force: 0,
	throwforce: 0,
	force_unwielded: 0,
	force_wielded: 0,
	origin_tech: null,
	attack_verb: null,
});
rt.type(5621, "/obj/item/weapon/twohanded/shockpaddles/syndicate", "/obj/item/weapon/twohanded/shockpaddles", {
	combat: 1,
	req_defib: 0,
	name: "syndicate defibrillator paddles",
	desc: "A pair of paddles used to revive deceased operatives. It possesses both the ability to penetrate armor and to deliver powerful shocks offensively.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "defibpaddles0",
	item_state: "defibpaddles0",
});
rt.type(5639, "/obj/item/weapon/twohanded/pitchfork/demonic/greater", "/obj/item/weapon/twohanded/pitchfork/demonic", {
	force_unwielded: 24,
	force_wielded: 34,
	force: 24,
	throwforce: 50,
});
rt.type(5670, "/obj/item/weapon/melee/baseball_bat/homerun", "/obj/item/weapon/melee/baseball_bat", {
	homerun_able: 1,
	name: "home run bat",
	desc: "This thing looks dangerous... Dangerously good at baseball, that is.",
});
rt.type(5702, "/obj/item/weapon/shield/riot/roman", "/obj/item/weapon/shield/riot", {
	name: "roman shield",
	desc: "Bears an inscription on the inside: <i>\"Romanes venio domus\"</i>.",
	icon_state: "roman_shield",
	item_state: "roman_shield",
});
rt.type(5768, "/obj/item/weapon/restraints/legcuffs/bola/cult", "/obj/item/weapon/restraints/legcuffs/bola", {
	name: "nar'sien bola",
	desc: "A strong bola, bound with dark magic. Throw it to trip and slow your victim.",
	icon_state: "bola_cult",
	breakouttime: 45,
	knockdown: 10,
});
rt.type(5769, "/obj/item/weapon/restraints/legcuffs/bola/tactical", "/obj/item/weapon/restraints/legcuffs/bola", {
	knockdown: 20,
	name: "reinforced bola",
	desc: "A strong bola, made with a long steel chain. It looks heavy, enough so that it could trip somebody.",
	icon_state: "bola_r",
	breakouttime: 70,
	origin_tech: "engineering=4;combat=3",
});
rt.type(5773, "/obj/item/weapon/restraints/legcuffs/beartrap/energy/cyborg", "/obj/item/weapon/restraints/legcuffs/beartrap/energy", {
	breakouttime: 20,
});
rt.type(5774, "/obj/item/weapon/restraints/legcuffs/beartrap/mega_arachnid", "/obj/item/weapon/restraints/legcuffs/beartrap", {
	flags: 16384,
	name: "fleshy restraints",
	desc: "Used by mega arachnids to immobilize their prey.",
	icon_state: "tentacle_end",
	icon: rt.rsc("icons/obj/projectiles.dmi"),
});
rt.type(5776, "/obj/item/weapon/restraints/handcuffs/energy", "/obj/item/weapon/restraints/handcuffs", {
	name: "hard-light energy field",
	desc: "A hard-light field restraining the hands.",
	icon_state: "cuff_white",
	breakouttime: 450,
	trashtype: rt.typePath("/obj/item/weapon/restraints/handcuffs/energy/used"),
	origin_tech: "materials=4;magnets=5;abductor=2",
});
rt.type(5777, "/obj/item/weapon/restraints/handcuffs/energy/cult", "/obj/item/weapon/restraints/handcuffs/energy", {
	flags: 16384,
	name: "cult shackles",
	desc: "Shackles that bind the wrists with sinister magic.",
	trashtype: rt.typePath("/obj/item/weapon/restraints/handcuffs/energy/used"),
	origin_tech: "materials=2;magnets=5",
});
rt.type(5780, "/obj/item/weapon/restraints/handcuffs/sinew", "/obj/item/weapon/restraints/handcuffs", {
	cuffsound: rt.rsc("sound/weapons/cablecuff.ogg"),
	name: "sinew restraints",
	desc: "A pair of restraints fashioned from long strands of flesh.",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "sinewcuff",
	item_state: "sinewcuff",
	breakouttime: 300,
});
rt.type(5782, "/obj/item/weapon/restraints/handcuffs/cable/red", "/obj/item/weapon/restraints/handcuffs/cable", {
	icon_state: "cuff_red",
	item_state: "coil_red",
});
rt.type(5783, "/obj/item/weapon/restraints/handcuffs/cable/yellow", "/obj/item/weapon/restraints/handcuffs/cable", {
	icon_state: "cuff_yellow",
	item_state: "coil_yellow",
});
rt.type(5784, "/obj/item/weapon/restraints/handcuffs/cable/blue", "/obj/item/weapon/restraints/handcuffs/cable", {
	icon_state: "cuff_blue",
	item_state: "coil_blue",
});
rt.type(5785, "/obj/item/weapon/restraints/handcuffs/cable/green", "/obj/item/weapon/restraints/handcuffs/cable", {
	icon_state: "cuff_green",
	item_state: "coil_green",
});
rt.type(5786, "/obj/item/weapon/restraints/handcuffs/cable/pink", "/obj/item/weapon/restraints/handcuffs/cable", {
	icon_state: "cuff_pink",
	item_state: "coil_pink",
});
rt.type(5787, "/obj/item/weapon/restraints/handcuffs/cable/orange", "/obj/item/weapon/restraints/handcuffs/cable", {
	icon_state: "cuff_orange",
	item_state: "coil_orange",
});
rt.type(5788, "/obj/item/weapon/restraints/handcuffs/cable/cyan", "/obj/item/weapon/restraints/handcuffs/cable", {
	icon_state: "cuff_cyan",
	item_state: "coil_cyan",
});
rt.type(5789, "/obj/item/weapon/restraints/handcuffs/cable/white", "/obj/item/weapon/restraints/handcuffs/cable", {
	icon_state: "cuff_white",
	item_state: "coil_white",
});
rt.type(5792, "/obj/item/weapon/restraints/handcuffs/cable/zipties/used", "/obj/item/weapon/restraints/handcuffs/cable/zipties", {
	desc: "A pair of broken zipties.",
	icon_state: "cuff_white_used",
});
rt.type(5793, "/obj/item/weapon/restraints/handcuffs/alien", "/obj/item/weapon/restraints/handcuffs", {
	icon_state: "handcuffAlien",
});
rt.type(5794, "/obj/item/weapon/restraints/handcuffs/fake", "/obj/item/weapon/restraints/handcuffs", {
	name: "fake handcuffs",
	desc: "Fake handcuffs meant for gag purposes.",
	breakouttime: 10,
});
rt.type(5795, "/obj/item/weapon/restraints/handcuffs/fake/kinky", "/obj/item/weapon/restraints/handcuffs/fake", {
	name: "kinky handcuffs",
	desc: "Fake handcuffs meant for erotic roleplay.",
	icon_state: "handcuffGag",
});
rt.type(5797, "/obj/item/weapon/sharpener/cult", "/obj/item/weapon/sharpener", {
	name: "eldritch whetstone",
	desc: "A block, empowered by dark magic. Sharp weapons will be enhanced when used on the stone.",
	used: 0,
	increment: 5,
	max: 40,
	prefix: "darkened",
});
rt.type(5798, "/obj/item/weapon/sharpener/super", "/obj/item/weapon/sharpener", {
	increment: 200,
	max: 200,
	prefix: "super-sharpened",
	requires_sharpness: 0,
	name: "super whetstone",
	desc: "A block that will make your weapon sharper than Einstein on adderall.",
});
rt.type(7002, "/obj/item/weapon/claymore/weak", "/obj/item/weapon/claymore", {
	desc: "This one is rusted.",
	force: 30,
	armour_penetration: 15,
});
rt.type(7005, "/obj/item/weapon/screwdriver/nuke", "/obj/item/weapon/screwdriver", {
	name: "screwdriver",
	desc: "A screwdriver with an ultra thin tip.",
	icon: rt.rsc("icons/obj/nuke_tools.dmi"),
	icon_state: "screwdriver_nuke",
	toolspeed: 0.5,
});
rt.type(7006, "/obj/item/weapon/screwdriver/brass", "/obj/item/weapon/screwdriver", {
	name: "brass screwdriver",
	desc: "A screwdriver made of brass. The handle feels freezing cold.",
	resistance_flags: 34,
	icon_state: "screwdriver_brass",
	toolspeed: 0.5,
});
rt.type(7007, "/obj/item/weapon/screwdriver/abductor", "/obj/item/weapon/screwdriver", {
	name: "alien screwdriver",
	desc: "An ultrasonic screwdriver.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "screwdriver",
	usesound: rt.rsc("sound/items/pshoom.ogg"),
	toolspeed: 0.1,
});
rt.type(7009, "/obj/item/weapon/screwdriver/cyborg", "/obj/item/weapon/screwdriver", {
	name: "powered screwdriver",
	desc: "An electrical screwdriver, designed to be both precise and quick.",
	usesound: rt.rsc("sound/items/drill_use.ogg"),
	toolspeed: 0.5,
});
rt.type(7064, "/obj/item/weapon/aiModule/core/full/asimovpp", "/obj/item/weapon/aiModule/core/full", {
	law_id: "asimovpp",
	name: "'Asimov++' Core AI Module",
});
rt.type(7065, "/obj/item/weapon/aiModule/core/full/corp", "/obj/item/weapon/aiModule/core/full", {
	law_id: "corporate",
	name: "'Corporate' Core AI Module",
});
rt.type(7066, "/obj/item/weapon/aiModule/core/full/paladin", "/obj/item/weapon/aiModule/core/full", {
	law_id: "paladin",
	name: "'P.A.L.A.D.I.N. version 3.5e' Core AI Module",
});
rt.type(7067, "/obj/item/weapon/aiModule/core/full/paladin_devotion", "/obj/item/weapon/aiModule/core/full", {
	law_id: "paladin5",
	name: "'P.A.L.A.D.I.N. version 5e' Core AI Module",
});
rt.type(7069, "/obj/item/weapon/aiModule/core/full/tyrant", "/obj/item/weapon/aiModule/core/full", {
	law_id: "tyrant",
	name: "'T.Y.R.A.N.T.' Core AI Module",
	origin_tech: "programming=3;materials=4;syndicate=1",
});
rt.type(7070, "/obj/item/weapon/aiModule/core/full/robocop", "/obj/item/weapon/aiModule/core/full", {
	law_id: "robocop",
	name: "'Robo-Officer' Core AI Module",
	origin_tech: "programming=4",
});
rt.type(7071, "/obj/item/weapon/aiModule/core/full/antimov", "/obj/item/weapon/aiModule/core/full", {
	law_id: "antimov",
	name: "'Antimov' Core AI Module",
	origin_tech: "programming=4",
});
rt.type(7072, "/obj/item/weapon/aiModule/core/full/drone", "/obj/item/weapon/aiModule/core/full", {
	law_id: "drone",
	name: "'Mother Drone' Core AI Module",
});
rt.type(7073, "/obj/item/weapon/aiModule/core/full/hippocratic", "/obj/item/weapon/aiModule/core/full", {
	law_id: "hippocratic",
	name: "'Robodoctor' Core AI Module",
});
rt.type(7074, "/obj/item/weapon/aiModule/core/full/reporter", "/obj/item/weapon/aiModule/core/full", {
	law_id: "reporter",
	name: "'Reportertron' Core AI Module",
});
rt.type(7075, "/obj/item/weapon/aiModule/core/full/thermurderdynamic", "/obj/item/weapon/aiModule/core/full", {
	law_id: "thermodynamic",
	name: "'Thermodynamic' Core AI Module",
	origin_tech: "programming = 4;syndicate = 2",
});
rt.type(7076, "/obj/item/weapon/aiModule/core/full/liveandletlive", "/obj/item/weapon/aiModule/core/full", {
	law_id: "liveandletlive",
	name: "'Live And Let Live' Core AI Module",
});
rt.type(7077, "/obj/item/weapon/aiModule/core/full/balance", "/obj/item/weapon/aiModule/core/full", {
	law_id: "balance",
	name: "'Guardian of Balance' Core AI Module",
});
rt.type(7091, "/obj/item/weapon/card/emag/bluespace", "/obj/item/weapon/card/emag", {
	prox_check: 0,
	name: "bluespace cryptographic sequencer",
	desc: "It's a blue card with a magnetic strip attached to some circuitry. It appears to have some sort of transmitter attached to it.",
	color: "#2882ff",
	origin_tech: "bluespace=4;magnets=4;syndicate=5",
});
rt.type(7092, "/obj/item/weapon/card/emag/halloween", "/obj/item/weapon/card/emag", {
	name: "hack-o'-lantern",
	desc: "It's a pumpkin with a cryptographic sequencer sticking out.",
	icon_state: "hack_o_lantern",
});
rt.type(7094, "/obj/item/weapon/card/id/silver", "/obj/item/weapon/card/id", {
	name: "silver identification card",
	desc: "A silver card which shows honour and dedication.",
	icon_state: "silver",
	item_state: "silver_id",
});
rt.type(7095, "/obj/item/weapon/card/id/gold", "/obj/item/weapon/card/id", {
	name: "gold identification card",
	desc: "A golden card which shows power and might.",
	icon_state: "gold",
	item_state: "gold_id",
});
rt.type(7097, "/obj/item/weapon/card/id/syndicate/anyone", "/obj/item/weapon/card/id/syndicate", {
	anyone: 1,
});
rt.type(7106, "/obj/item/weapon/card/id/prisoner/one", "/obj/item/weapon/card/id/prisoner", {
	registered_name: "Prisoner #13-001",
	name: "Prisoner #13-001",
});
rt.type(7107, "/obj/item/weapon/card/id/prisoner/two", "/obj/item/weapon/card/id/prisoner", {
	registered_name: "Prisoner #13-002",
	name: "Prisoner #13-002",
});
rt.type(7108, "/obj/item/weapon/card/id/prisoner/three", "/obj/item/weapon/card/id/prisoner", {
	registered_name: "Prisoner #13-003",
	name: "Prisoner #13-003",
});
rt.type(7109, "/obj/item/weapon/card/id/prisoner/four", "/obj/item/weapon/card/id/prisoner", {
	registered_name: "Prisoner #13-004",
	name: "Prisoner #13-004",
});
rt.type(7110, "/obj/item/weapon/card/id/prisoner/five", "/obj/item/weapon/card/id/prisoner", {
	registered_name: "Prisoner #13-005",
	name: "Prisoner #13-005",
});
rt.type(7111, "/obj/item/weapon/card/id/prisoner/six", "/obj/item/weapon/card/id/prisoner", {
	registered_name: "Prisoner #13-006",
	name: "Prisoner #13-006",
});
rt.type(7112, "/obj/item/weapon/card/id/prisoner/seven", "/obj/item/weapon/card/id/prisoner", {
	registered_name: "Prisoner #13-007",
	name: "Prisoner #13-007",
});
rt.type(7113, "/obj/item/weapon/card/id/mining", "/obj/item/weapon/card/id", {
	name: "mining ID",
	access: null,
});
rt.type(7115, "/obj/item/weapon/card/id/away/hotel", "/obj/item/weapon/card/id/away", {
	name: "Staff ID",
	desc: "A staff ID used to access the hotel's doors.",
	access: null,
});
rt.type(7116, "/obj/item/weapon/card/id/away/hotel/securty", "/obj/item/weapon/card/id/away/hotel", {
	name: "Officer ID",
	access: null,
});
rt.type(7118, "/obj/item/weapon/card/id/away/old/sec", "/obj/item/weapon/card/id/away/old", {
	name: "Security Officer ID",
	desc: "Security officers ID card.",
	icon_state: "centcom",
});
rt.type(7119, "/obj/item/weapon/card/id/away/old/sci", "/obj/item/weapon/card/id/away/old", {
	name: "Scientist ID",
	desc: "Scientists ID card.",
	icon_state: "centcom",
});
rt.type(7120, "/obj/item/weapon/card/id/away/old/eng", "/obj/item/weapon/card/id/away/old", {
	name: "Engineer ID",
	desc: "Engineers ID card.",
	icon_state: "centcom",
});
rt.type(7125, "/obj/item/weapon/station_charter/admin", "/obj/item/weapon/station_charter", {
	unlimited_uses: 1,
	ignores_timeout: 1,
});
rt.type(7136, "/obj/item/weapon/soap/nanotrasen", "/obj/item/weapon/soap", {
	desc: "A Nanotrasen brand bar of soap. Smells of plasma.",
	icon_state: "soapnt",
});
rt.type(7137, "/obj/item/weapon/soap/homemade", "/obj/item/weapon/soap", {
	cleanspeed: 45,
	desc: "A homemade bar of soap. Smells of... well....",
	icon_state: "soapgibs",
});
rt.type(7138, "/obj/item/weapon/soap/deluxe", "/obj/item/weapon/soap", {
	cleanspeed: 40,
	desc: "A deluxe Waffle Co. brand bar of soap. Smells of high-class luxury.",
	icon_state: "soapdeluxe",
});
rt.type(7139, "/obj/item/weapon/soap/syndie", "/obj/item/weapon/soap", {
	cleanspeed: 10,
	desc: "An untrustworthy bar of soap made of strong chemical agents that dissolve blood faster.",
	icon_state: "soapsyndie",
});
rt.type(7141, "/obj/item/weapon/bikehorn/airhorn", "/obj/item/weapon/bikehorn", {
	honksound: rt.rsc("sound/items/airhorn2.ogg"),
	cooldowntime: 50,
	name: "air horn",
	desc: "Damn son, where'd you find this?",
	icon_state: "air_horn",
	origin_tech: "materials=4;engineering=4",
});
rt.type(7143, "/obj/item/weapon/bikehorn/rubberducky", "/obj/item/weapon/bikehorn", {
	name: "rubber ducky",
	desc: "Rubber ducky you're so fine, you make bathtime lots of fuuun. Rubber ducky I'm awfully fooooond of yooooouuuu~",
	icon: rt.rsc("icons/obj/watercloset.dmi"),
	icon_state: "rubberducky",
	item_state: "rubberducky",
});
rt.type(7145, "/obj/item/weapon/lipstick/purple", "/obj/item/weapon/lipstick", {
	colour: "purple",
	name: "purple lipstick",
});
rt.type(7146, "/obj/item/weapon/lipstick/jade", "/obj/item/weapon/lipstick", {
	colour: "lime",
	name: "jade lipstick",
});
rt.type(7147, "/obj/item/weapon/lipstick/black", "/obj/item/weapon/lipstick", {
	colour: "black",
	name: "black lipstick",
});
rt.type(7156, "/obj/item/weapon/defibrillator/compact/combat", "/obj/item/weapon/defibrillator/compact", {
	combat: 1,
	safety: 0,
	name: "combat defibrillator",
	desc: "A belt-equipped blood-red defibrillator that can be rapidly deployed. Does not have the restrictions or safeties of conventional defibrillators and can revive through space suits.",
});
rt.type(7159, "/obj/item/weapon/dice/d1", "/obj/item/weapon/dice", {
	sides: 1,
	name: "d1",
	desc: "A die with one side. Deterministic!",
	icon_state: "d1",
});
rt.type(7160, "/obj/item/weapon/dice/d2", "/obj/item/weapon/dice", {
	sides: 2,
	name: "d2",
	desc: "A die with two sides. Coins are undignified!",
	icon_state: "d2",
});
rt.type(7162, "/obj/item/weapon/dice/d6", "/obj/item/weapon/dice", {
	name: "d6",
});
rt.type(7164, "/obj/item/weapon/dice/fudge", "/obj/item/weapon/dice", {
	sides: 3,
	special_faces: null,
	name: "fudge die",
	desc: "A die with six sides but only three results. Is this a plus or a minus? Your mind is drawing a blank...",
	icon_state: "fudge",
});
rt.type(7165, "/obj/item/weapon/dice/d8", "/obj/item/weapon/dice", {
	sides: 8,
	name: "d8",
	desc: "A die with eight sides. It feels... lucky.",
	icon_state: "d8",
});
rt.type(7166, "/obj/item/weapon/dice/d10", "/obj/item/weapon/dice", {
	sides: 10,
	name: "d10",
	desc: "A die with ten sides. Useful for percentages.",
	icon_state: "d10",
});
rt.type(7167, "/obj/item/weapon/dice/d00", "/obj/item/weapon/dice", {
	sides: 10,
	name: "d00",
	desc: "A die with ten sides. Works better for d100 rolls than a golfball.",
	icon_state: "d00",
});
rt.type(7168, "/obj/item/weapon/dice/d12", "/obj/item/weapon/dice", {
	sides: 12,
	name: "d12",
	desc: "A die with twelve sides. There's an air of neglect about it.",
	icon_state: "d12",
});
rt.type(7169, "/obj/item/weapon/dice/d20", "/obj/item/weapon/dice", {
	sides: 20,
	name: "d20",
	desc: "A die with twenty sides. The prefered die to throw at the GM.",
	icon_state: "d20",
});
rt.type(7172, "/obj/item/weapon/dice/d100", "/obj/item/weapon/dice", {
	sides: 100,
	name: "d100",
	desc: "A die with one hundred sides! Probably not fairly weighted...",
	icon_state: "d100",
});
rt.type(7173, "/obj/item/weapon/dice/eightbd20", "/obj/item/weapon/dice", {
	sides: 20,
	special_faces: null,
	name: "strange d20",
	desc: "A weird die with raised text printed on the faces. Everything's white on white so reading it is a struggle. What poor design!",
	icon_state: "8bd20",
});
rt.type(7174, "/obj/item/weapon/dice/fourdd6", "/obj/item/weapon/dice", {
	sides: 48,
	special_faces: null,
	name: "4d d6",
	desc: "A die that exists in four dimensional space. Properly interpreting them can only be properly done with the help of a mathematician, a physicist, and a priest.",
	icon_state: "4dd6",
});
rt.type(7200, "/obj/item/weapon/dnainjector/telemut/darkbundle", "/obj/item/weapon/dnainjector/telemut", {
	name: "１DNA injector",
	desc: "Good. Let the hate flow through you.",
});
rt.type(7230, "/obj/item/weapon/flamethrower/full", "/obj/item/weapon/flamethrower", {});
rt.type(7231, "/obj/item/weapon/flamethrower/full/tank", "/obj/item/weapon/flamethrower/full", {
	create_full: 1,
	create_with_tank: 1,
});
rt.type(7235, "/obj/item/weapon/holosign_creator/security", "/obj/item/weapon/holosign_creator", {
	creation_time: 30,
	max_signs: 6,
	name: "security holobarrier projector",
	desc: "A holographic projector that creates holographic security barriers.",
	icon_state: "signmaker_sec",
	holosign_type: rt.typePath("/obj/structure/holosign/barrier"),
});
rt.type(7236, "/obj/item/weapon/holosign_creator/engineering", "/obj/item/weapon/holosign_creator", {
	creation_time: 30,
	max_signs: 6,
	name: "engineering holobarrier projector",
	desc: "A holographic projector that creates holographic engineering barriers.",
	icon_state: "signmaker_engi",
	holosign_type: rt.typePath("/obj/structure/holosign/barrier/engineering"),
});
rt.type(7237, "/obj/item/weapon/holosign_creator/atmos", "/obj/item/weapon/holosign_creator", {
	creation_time: 0,
	max_signs: 3,
	name: "ATMOS holofan projector",
	desc: "A holographic projector that creates holographic barriers that prevent changes in atmosphere conditions.",
	icon_state: "signmaker_engi",
	holosign_type: rt.typePath("/obj/structure/holosign/barrier/atmos"),
});
rt.type(7240, "/obj/item/weapon/nullrod/godhand", "/obj/item/weapon/nullrod", {
	flags: 16514,
	icon_state: "disintegrate",
	item_state: "disintegrate",
	name: "god hand",
	desc: "This hand of yours glows with an awesome power!",
	w_class: 5,
	hitsound: rt.rsc("sound/weapons/sear.ogg"),
	damtype: "fire",
	attack_verb: null,
});
rt.type(7242, "/obj/item/weapon/nullrod/staff/blue", "/obj/item/weapon/nullrod/staff", {
	shield_icon: "shield-old",
	name: "blue holy staff",
	icon_state: "godstaff-blue",
	item_state: "godstaff-blue",
});
rt.type(7244, "/obj/item/weapon/nullrod/claymore/darkblade", "/obj/item/weapon/nullrod/claymore", {
	icon_state: "cultblade",
	item_state: "cultblade",
	name: "dark blade",
	desc: "Spread the glory of the dark gods!",
	slot_flags: 512,
	hitsound: rt.rsc("sound/hallucinations/growl1.ogg"),
});
rt.type(7245, "/obj/item/weapon/nullrod/claymore/chainsaw_sword", "/obj/item/weapon/nullrod/claymore", {
	icon_state: "chainswordon",
	item_state: "chainswordon",
	name: "sacred chainsaw sword",
	desc: "Suffer not a heretic to live.",
	slot_flags: 512,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/chainsawhit.ogg"),
});
rt.type(7246, "/obj/item/weapon/nullrod/claymore/glowing", "/obj/item/weapon/nullrod/claymore", {
	icon_state: "swordon",
	item_state: "swordon",
	name: "force weapon",
	desc: "The blade glows with the power of faith. Or possibly a battery.",
	slot_flags: 512,
});
rt.type(7247, "/obj/item/weapon/nullrod/claymore/katana", "/obj/item/weapon/nullrod/claymore", {
	name: "hanzo steel",
	desc: "Capable of cutting clean through a holy claymore.",
	icon_state: "katana",
	item_state: "katana",
	slot_flags: 1536,
});
rt.type(7249, "/obj/item/weapon/nullrod/claymore/saber", "/obj/item/weapon/nullrod/claymore", {
	name: "light energy sword",
	hitsound: rt.rsc("sound/weapons/blade1.ogg"),
	icon_state: "swordblue",
	item_state: "swordblue",
	desc: "If you strike me down, I shall become more robust than you can possibly imagine.",
	slot_flags: 512,
});
rt.type(7250, "/obj/item/weapon/nullrod/claymore/saber/red", "/obj/item/weapon/nullrod/claymore/saber", {
	name: "dark energy sword",
	icon_state: "swordred",
	item_state: "swordred",
	desc: "Woefully ineffective when used on steep terrain.",
});
rt.type(7251, "/obj/item/weapon/nullrod/claymore/saber/pirate", "/obj/item/weapon/nullrod/claymore/saber", {
	name: "nautical energy sword",
	icon_state: "cutlass1",
	item_state: "cutlass1",
	desc: "Convincing HR that your religion involved piracy was no mean feat.",
});
rt.type(7252, "/obj/item/weapon/nullrod/claymore/bostaff", "/obj/item/weapon/nullrod/claymore", {
	name: "monk's staff",
	desc: "A long, tall staff made of polished wood. Traditionally used in ancient old-Earth martial arts, it is now used to harass the clown.",
	w_class: 4,
	force: 15,
	block_chance: 40,
	slot_flags: 1024,
	sharpness: 0,
	hitsound: "swing_hit",
	attack_verb: null,
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "bostaff0",
	item_state: "bostaff0",
});
rt.type(7253, "/obj/item/weapon/nullrod/sord", "/obj/item/weapon/nullrod", {
	name: "１UNREAL SORD",
	desc: "This thing is so unspeakably HOLY you are having a hard time even holding it.",
	icon_state: "sord",
	item_state: "sord",
	slot_flags: 512,
	force: 4.13,
	throwforce: 1,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	attack_verb: null,
});
rt.type(7254, "/obj/item/weapon/nullrod/scythe", "/obj/item/weapon/nullrod", {
	icon_state: "scythe1",
	item_state: "scythe1",
	name: "reaper scythe",
	desc: "Ask not for whom the bell tolls...",
	w_class: 4,
	armour_penetration: 35,
	slot_flags: 1024,
	sharpness: 1,
	attack_verb: null,
});
rt.type(7255, "/obj/item/weapon/nullrod/scythe/vibro", "/obj/item/weapon/nullrod/scythe", {
	icon_state: "hfrequency0",
	item_state: "hfrequency1",
	name: "high frequency blade",
	desc: "Bad references are the DNA of the soul.",
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/rapierhit.ogg"),
});
rt.type(7256, "/obj/item/weapon/nullrod/scythe/spellblade", "/obj/item/weapon/nullrod/scythe", {
	icon_state: "spellblade",
	item_state: "spellblade",
	icon: rt.rsc("icons/obj/guns/magic.dmi"),
	name: "dormant spellblade",
	desc: "The blade grants the wielder nearly limitless power...if they can figure out how to turn it on, that is.",
	hitsound: rt.rsc("sound/weapons/rapierhit.ogg"),
});
rt.type(7258, "/obj/item/weapon/nullrod/hammmer", "/obj/item/weapon/nullrod", {
	icon_state: "hammeron",
	item_state: "hammeron",
	name: "relic war hammer",
	desc: "This war hammer cost the chaplain forty thousand space dollars.",
	slot_flags: 512,
	w_class: 5,
	attack_verb: null,
});
rt.type(7259, "/obj/item/weapon/nullrod/chainsaw", "/obj/item/weapon/nullrod", {
	flags: 130,
	name: "chainsaw hand",
	desc: "Good? Bad? You're the guy with the chainsaw hand.",
	icon_state: "chainsaw_on",
	item_state: "mounted_chainsaw",
	w_class: 5,
	sharpness: 1,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/chainsawhit.ogg"),
});
rt.type(7260, "/obj/item/weapon/nullrod/clown", "/obj/item/weapon/nullrod", {
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "clownrender",
	item_state: "render",
	name: "clown dagger",
	desc: "Used for absolutely hilarious sacrifices.",
	hitsound: rt.rsc("sound/items/bikehorn.ogg"),
	sharpness: 1,
	attack_verb: null,
});
rt.type(7261, "/obj/item/weapon/nullrod/whip", "/obj/item/weapon/nullrod", {
	name: "holy whip",
	desc: "What a terrible night to be on Space Station 13.",
	icon_state: "chain",
	item_state: "chain",
	slot_flags: 512,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/chainhit.ogg"),
});
rt.type(7262, "/obj/item/weapon/nullrod/fedora", "/obj/item/weapon/nullrod", {
	throw_speed: 4,
	throw_range: 7,
	name: "atheist's fedora",
	desc: "The brim of the hat is as sharp as your wit. The edge would hurt almost as much as disproving the existence of God.",
	icon_state: "fedora",
	item_state: "fedora",
	slot_flags: 64,
	icon: rt.rsc("icons/obj/clothing/hats.dmi"),
	force: 0,
	throwforce: 30,
	sharpness: 1,
	attack_verb: null,
});
rt.type(7263, "/obj/item/weapon/nullrod/armblade", "/obj/item/weapon/nullrod", {
	flags: 130,
	name: "dark blessing",
	desc: "Particularly twisted dieties grant gifts of dubious value.",
	icon_state: "arm_blade",
	item_state: "arm_blade",
	w_class: 5,
	sharpness: 1,
});
rt.type(7266, "/obj/item/weapon/nullrod/pitchfork", "/obj/item/weapon/nullrod", {
	icon_state: "pitchfork0",
	name: "unholy pitchfork",
	w_class: 3,
	desc: "Holding this makes you look absolutely devilish.",
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	sharpness: 1,
});
rt.type(7272, "/obj/item/weapon/kitchen/knife/ritual", "/obj/item/weapon/kitchen/knife", {
	name: "ritual knife",
	desc: "The unearthly energies that once powered this blade are now dormant.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "render",
	w_class: 3,
});
rt.type(7274, "/obj/item/weapon/kitchen/knife/combat", "/obj/item/weapon/kitchen/knife", {
	bayonet: 1,
	name: "combat knife",
	icon_state: "buckknife",
	item_state: "knife",
	desc: "A military combat utility survival knife.",
	force: 20,
	throwforce: 20,
	origin_tech: "materials=3;combat=4",
	attack_verb: null,
});
rt.type(7275, "/obj/item/weapon/kitchen/knife/combat/survival", "/obj/item/weapon/kitchen/knife/combat", {
	bayonet: 1,
	name: "survival knife",
	icon_state: "survivalknife",
	desc: "A hunting grade survival knife.",
	force: 15,
	throwforce: 15,
});
rt.type(7277, "/obj/item/weapon/kitchen/knife/combat/cyborg", "/obj/item/weapon/kitchen/knife/combat", {
	name: "cyborg knife",
	icon: rt.rsc("icons/obj/items_cyborg.dmi"),
	icon_state: "knife",
	desc: "A cyborg-mounted plasteel knife. Extremely sharp and durable.",
	origin_tech: null,
});
rt.type(7296, "/obj/item/weapon/book/manual/wiki/chemistry", "/obj/item/weapon/book/manual/wiki", {
	page_link: "Guide_to_chemistry",
	name: "Chemistry Textbook",
	icon_state: "chemistrybook",
	author: "Nanotrasen",
	title: "Chemistry Textbook",
});
rt.type(7297, "/obj/item/weapon/book/manual/wiki/engineering_construction", "/obj/item/weapon/book/manual/wiki", {
	page_link: "Guide_to_construction",
	name: "Station Repairs and Construction",
	icon_state: "bookEngineering",
	author: "Engineering Encyclopedia",
	title: "Station Repairs and Construction",
});
rt.type(7298, "/obj/item/weapon/book/manual/wiki/engineering_guide", "/obj/item/weapon/book/manual/wiki", {
	page_link: "Guide_to_engineering",
	name: "Engineering Textbook",
	icon_state: "bookEngineering2",
	author: "Engineering Encyclopedia",
	title: "Engineering Textbook",
});
rt.type(7299, "/obj/item/weapon/book/manual/wiki/security_space_law", "/obj/item/weapon/book/manual/wiki", {
	page_link: "Space_Law",
	name: "Space Law",
	desc: "A set of Nanotrasen guidelines for keeping law and order on their space stations.",
	icon_state: "bookSpaceLaw",
	author: "Nanotrasen",
	title: "Space Law",
});
rt.type(7300, "/obj/item/weapon/book/manual/wiki/infections", "/obj/item/weapon/book/manual/wiki", {
	page_link: "Infections",
	name: "Infections - Making your own pandemic!",
	icon_state: "bookInfections",
	author: "Infections Encyclopedia",
	title: "Infections - Making your own pandemic!",
});
rt.type(7301, "/obj/item/weapon/book/manual/wiki/telescience", "/obj/item/weapon/book/manual/wiki", {
	page_link: "Guide_to_telescience",
	name: "Teleportation Science - Bluespace for dummies!",
	icon_state: "book7",
	author: "University of Bluespace",
	title: "Teleportation Science - Bluespace for dummies!",
});
rt.type(7302, "/obj/item/weapon/book/manual/wiki/engineering_hacking", "/obj/item/weapon/book/manual/wiki", {
	page_link: "Hacking",
	name: "Hacking",
	icon_state: "bookHacking",
	author: "Engineering Encyclopedia",
	title: "Hacking",
});
rt.type(7310, "/obj/item/weapon/mop/cyborg", "/obj/item/weapon/mop", {});
rt.type(7313, "/obj/item/weapon/paint/red", "/obj/item/weapon/paint", {
	name: "red paint",
	item_color: "C73232",
	icon_state: "paint_red",
});
rt.type(7314, "/obj/item/weapon/paint/green", "/obj/item/weapon/paint", {
	name: "green paint",
	item_color: "2A9C3B",
	icon_state: "paint_green",
});
rt.type(7315, "/obj/item/weapon/paint/blue", "/obj/item/weapon/paint", {
	name: "blue paint",
	item_color: "5998FF",
	icon_state: "paint_blue",
});
rt.type(7316, "/obj/item/weapon/paint/yellow", "/obj/item/weapon/paint", {
	name: "yellow paint",
	item_color: "CFB52B",
	icon_state: "paint_yellow",
});
rt.type(7317, "/obj/item/weapon/paint/violet", "/obj/item/weapon/paint", {
	name: "violet paint",
	item_color: "AE4CCD",
	icon_state: "paint_violet",
});
rt.type(7318, "/obj/item/weapon/paint/black", "/obj/item/weapon/paint", {
	name: "black paint",
	item_color: "333333",
	icon_state: "paint_black",
});
rt.type(7319, "/obj/item/weapon/paint/white", "/obj/item/weapon/paint", {
	name: "white paint",
	item_color: "FFFFFF",
	icon_state: "paint_white",
});
rt.type(7324, "/obj/item/weapon/pneumatic_cannon/ghetto", "/obj/item/weapon/pneumatic_cannon", {
	maxWeightClass: 7,
	gasPerThrow: 5,
	name: "improvised pneumatic cannon",
	desc: "A gas-powered, object-firing cannon made out of common parts.",
	force: 5,
	w_class: 3,
});
rt.type(7330, "/obj/item/weapon/construction/rcd/loaded", "/obj/item/weapon/construction/rcd", {
	matter: 160,
});
rt.type(7331, "/obj/item/weapon/construction/rcd/combat", "/obj/item/weapon/construction/rcd", {
	max_matter: 500,
	matter: 500,
	name: "industrial RCD",
});
rt.type(7332, "/obj/item/weapon/construction/rcd/admin", "/obj/item/weapon/construction/rcd", {
	max_matter: 1e+31,
	matter: 1e+31,
	name: "admin RCD",
});
rt.type(7334, "/obj/item/weapon/construction/rcd/internal", "/obj/item/weapon/construction/rcd", {
	max_matter: 600,
	no_ammo_message: "<span class='warning'>Internal matter exhausted. Please add additional materials.</span>",
	delay_mod: 0.5,
	name: "internal RCD",
});
rt.type(7340, "/obj/item/weapon/rsf/cyborg", "/obj/item/weapon/rsf", {
	matter: 30,
});
rt.type(7343, "/obj/item/weapon/teleportation_scroll/apprentice", "/obj/item/weapon/teleportation_scroll", {
	uses: 1,
	name: "lesser scroll of teleportation",
	origin_tech: "bluespace=5",
});
rt.type(7348, "/obj/item/weapon/wrench/cyborg", "/obj/item/weapon/wrench", {
	name: "automatic wrench",
	desc: "An advanced robotic wrench. Can be found in construction cyborgs.",
	toolspeed: 0.5,
});
rt.type(7349, "/obj/item/weapon/wrench/brass", "/obj/item/weapon/wrench", {
	name: "brass wrench",
	desc: "A brass wrench. It's faintly warm to the touch.",
	resistance_flags: 34,
	icon_state: "wrench_brass",
	toolspeed: 0.5,
});
rt.type(7350, "/obj/item/weapon/wrench/abductor", "/obj/item/weapon/wrench", {
	name: "alien wrench",
	desc: "A polarized wrench. It causes anything placed between the jaws to turn.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "wrench",
	usesound: rt.rsc("sound/effects/empulse.ogg"),
	toolspeed: 0.1,
	origin_tech: "materials=5;engineering=5;abductor=3",
});
rt.type(7354, "/obj/item/weapon/wirecutters/brass", "/obj/item/weapon/wirecutters", {
	name: "brass wirecutters",
	desc: "A pair of wirecutters made of brass. The handle feels freezing cold to the touch.",
	resistance_flags: 34,
	icon_state: "cutters_brass",
	toolspeed: 0.5,
});
rt.type(7355, "/obj/item/weapon/wirecutters/abductor", "/obj/item/weapon/wirecutters", {
	name: "alien wirecutters",
	desc: "Extremely sharp wirecutters, made out of a silvery-green metal.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "cutters",
	toolspeed: 0.1,
	origin_tech: "materials=5;engineering=4;abductor=3",
});
rt.type(7356, "/obj/item/weapon/wirecutters/cyborg", "/obj/item/weapon/wirecutters", {
	name: "wirecutters",
	desc: "This cuts wires.",
	toolspeed: 0.5,
});
rt.type(7360, "/obj/item/weapon/weldingtool/largetank/cyborg", "/obj/item/weapon/weldingtool/largetank", {
	name: "integrated welding tool",
	desc: "An advanced welder designed to be used in robotic systems.",
	toolspeed: 0.5,
});
rt.type(7365, "/obj/item/weapon/weldingtool/experimental/brass", "/obj/item/weapon/weldingtool/experimental", {
	name: "brass welding tool",
	desc: "A brass welder that seems to constantly refuel itself. It is faintly warm to the touch.",
	resistance_flags: 34,
	icon_state: "brasswelder",
	item_state: "brasswelder",
});
rt.type(7367, "/obj/item/weapon/crowbar/red", "/obj/item/weapon/crowbar", {
	icon_state: "crowbar_red",
	force: 8,
});
rt.type(7368, "/obj/item/weapon/crowbar/brass", "/obj/item/weapon/crowbar", {
	name: "brass crowbar",
	desc: "A brass crowbar. It feels faintly warm to the touch.",
	resistance_flags: 34,
	icon_state: "crowbar_brass",
	toolspeed: 0.5,
});
rt.type(7369, "/obj/item/weapon/crowbar/abductor", "/obj/item/weapon/crowbar", {
	name: "alien crowbar",
	desc: "A hard-light crowbar. It appears to pry by itself, without any effort required.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	usesound: rt.rsc("sound/weapons/sonic_jackhammer.ogg"),
	icon_state: "crowbar",
	toolspeed: 0.1,
	origin_tech: "combat=4;engineering=4;abductor=3",
});
rt.type(7371, "/obj/item/weapon/crowbar/cyborg", "/obj/item/weapon/crowbar", {
	name: "hydraulic crowbar",
	desc: "A hydraulic prying tool, compact but powerful. Designed to replace crowbar in construction cyborgs.",
	usesound: rt.rsc("sound/items/jaws_pry.ogg"),
	force: 10,
	toolspeed: 0.5,
});
rt.type(7374, "/obj/item/weapon/vending_refill/boozeomat", "/obj/item/weapon/vending_refill", {
	machine_name: "Booze-O-Mat",
	charges: null,
	init_charges: null,
	icon_state: "refill_booze",
});
rt.type(7375, "/obj/item/weapon/vending_refill/coffee", "/obj/item/weapon/vending_refill", {
	machine_name: "Solar's Best Hot Drinks",
	charges: null,
	init_charges: null,
	icon_state: "refill_joe",
});
rt.type(7376, "/obj/item/weapon/vending_refill/snack", "/obj/item/weapon/vending_refill", {
	machine_name: "Getmore Chocolate Corp",
	charges: null,
	init_charges: null,
});
rt.type(7377, "/obj/item/weapon/vending_refill/cola", "/obj/item/weapon/vending_refill", {
	machine_name: "Robust Softdrinks",
	charges: null,
	init_charges: null,
	icon_state: "refill_cola",
});
rt.type(7378, "/obj/item/weapon/vending_refill/cigarette", "/obj/item/weapon/vending_refill", {
	machine_name: "ShadyCigs Deluxe",
	charges: null,
	init_charges: null,
	icon_state: "refill_smoke",
});
rt.type(7379, "/obj/item/weapon/vending_refill/autodrobe", "/obj/item/weapon/vending_refill", {
	machine_name: "AutoDrobe",
	charges: null,
	init_charges: null,
	icon_state: "refill_costume",
});
rt.type(7380, "/obj/item/weapon/vending_refill/clothing", "/obj/item/weapon/vending_refill", {
	machine_name: "ClothesMate",
	charges: null,
	init_charges: null,
	icon_state: "refill_clothes",
});
rt.type(7381, "/obj/item/weapon/vending_refill/medical", "/obj/item/weapon/vending_refill", {
	machine_name: "NanoMed",
	charges: null,
	init_charges: null,
	icon_state: "refill_medical",
});
rt.type(7385, "/obj/item/weapon/katana/cursed", "/obj/item/weapon/katana", {
	slot_flags: null,
});
rt.type(7388, "/obj/item/weapon/throwing_star/ninja", "/obj/item/weapon/throwing_star", {
	name: "ninja throwing star",
	throwforce: 30,
	embedded_pain_multiplier: 6,
});
rt.type(8519, "/obj/item/clothing/mask/cigarette/space_cigarette", "/obj/item/clothing/mask/cigarette", {
	desc: "A Space Cigarette brand cigarette.",
});
rt.type(8520, "/obj/item/clothing/mask/cigarette/dromedary", "/obj/item/clothing/mask/cigarette", {
	desc: "A DromedaryCo brand cigarette.",
});
rt.type(8522, "/obj/item/clothing/mask/cigarette/robust", "/obj/item/clothing/mask/cigarette", {
	desc: "A Robust brand cigarette.",
});
rt.type(8524, "/obj/item/clothing/mask/cigarette/carp", "/obj/item/clothing/mask/cigarette", {
	desc: "A Carp Classic brand cigarette.",
});
rt.type(8529, "/obj/item/clothing/mask/cigarette/cigar", "/obj/item/clothing/mask/cigarette", {
	icon_on: "cigaron",
	icon_off: "cigaroff",
	type_butt: rt.typePath("/obj/item/weapon/cigbutt/cigarbutt"),
	throw_speed: 0.5,
	smoketime: 1500,
	chem_volume: 40,
	name: "premium cigar",
	desc: "A brown roll of tobacco and... well, you're not quite sure. This thing's huge!",
	icon_state: "cigaroff",
	item_state: "cigaroff",
});
rt.type(8530, "/obj/item/clothing/mask/cigarette/cigar/cohiba", "/obj/item/clothing/mask/cigarette/cigar", {
	icon_on: "cigar2on",
	icon_off: "cigar2off",
	smoketime: 2000,
	chem_volume: 80,
	name: "１Cohiba Robusto cigar",
	desc: "There's little more you could want from a cigar.",
	icon_state: "cigar2off",
});
rt.type(8531, "/obj/item/clothing/mask/cigarette/cigar/havana", "/obj/item/clothing/mask/cigarette/cigar", {
	icon_on: "cigar2on",
	icon_off: "cigar2off",
	smoketime: 7200,
	chem_volume: 50,
	name: "premium Havanian cigar",
	desc: "A cigar fit for only the best of the best.",
	icon_state: "cigar2off",
});
rt.type(8533, "/obj/item/clothing/mask/cigarette/pipe/cobpipe", "/obj/item/clothing/mask/cigarette/pipe", {
	icon_on: "cobpipeon",
	icon_off: "cobpipeoff",
	smoketime: 0,
	name: "corn cob pipe",
	desc: "A nicotine delivery system popularized by folksy backwoodsmen and kept popular in the modern age and beyond by space hipsters. Can be loaded with objects.",
	icon_state: "cobpipeoff",
	item_state: "cobpipeoff",
});
