// Types declared in code/game/objects/items that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(6934, "/obj/item/weapon/electronics/firealarm", "/obj/item/weapon/electronics", {
	name: "fire alarm electronics",
	desc: "A fire alarm circuit. Can handle heat levels up to 40 degrees celsius.",
});
rt.type(6936, "/obj/item/weapon/electronics/firelock", "/obj/item/weapon/electronics", {
	name: "firelock circuitry",
	desc: "A circuit board used in construction of firelocks.",
	icon_state: "mainboard",
});
rt.type(6937, "/obj/item/weapon/electronics/airalarm", "/obj/item/weapon/electronics", {
	name: "air alarm electronics",
	icon_state: "airalarm_electronics",
});
rt.type(6938, "/obj/item/weapon/electronics/apc", "/obj/item/weapon/electronics", {
	name: "power control module",
	icon_state: "power_mod",
	desc: "Heavy-duty switching circuits for power control.",
});
rt.type(6939, "/obj/item/weapon/electronics/tracker", "/obj/item/weapon/electronics", {
	name: "tracker electronics",
});
rt.type(6987, "/obj/item/weapon/door_remote/omni", "/obj/item/weapon/door_remote", {
	region_access: 0,
	name: "omni door remote",
	desc: "This control wand can access any door on the station.",
	icon_state: "gangtool-yellow",
});
rt.type(6988, "/obj/item/weapon/door_remote/captain", "/obj/item/weapon/door_remote", {
	region_access: 7,
	name: "command door remote",
	icon_state: "gangtool-yellow",
});
rt.type(6989, "/obj/item/weapon/door_remote/chief_engineer", "/obj/item/weapon/door_remote", {
	region_access: 5,
	name: "engineering door remote",
	icon_state: "gangtool-orange",
});
rt.type(6990, "/obj/item/weapon/door_remote/research_director", "/obj/item/weapon/door_remote", {
	region_access: 4,
	name: "research door remote",
	icon_state: "gangtool-purple",
});
rt.type(6991, "/obj/item/weapon/door_remote/head_of_security", "/obj/item/weapon/door_remote", {
	region_access: 2,
	name: "security door remote",
	icon_state: "gangtool-red",
});
rt.type(6992, "/obj/item/weapon/door_remote/quartermaster", "/obj/item/weapon/door_remote", {
	region_access: 6,
	name: "supply door remote",
	icon_state: "gangtool-green",
});
rt.type(6993, "/obj/item/weapon/door_remote/chief_medical_officer", "/obj/item/weapon/door_remote", {
	region_access: 3,
	name: "medical door remote",
	icon_state: "gangtool-blue",
});
rt.type(6994, "/obj/item/weapon/door_remote/civillian", "/obj/item/weapon/door_remote", {
	region_access: 1,
	name: "civillian door remote",
	icon_state: "gangtool-white",
});
rt.type(6996, "/obj/item/weapon/banner/red", "/obj/item/weapon/banner", {
	name: "red banner",
	icon_state: "banner-red",
	item_state: "banner-red",
	desc: "A banner with the logo of the red deity.",
});
rt.type(6997, "/obj/item/weapon/banner/blue", "/obj/item/weapon/banner", {
	name: "blue banner",
	icon_state: "banner-blue",
	item_state: "banner-blue",
	desc: "A banner with the logo of the blue deity",
});
rt.type(6999, "/obj/item/weapon/godstaff/red", "/obj/item/weapon/godstaff", {
	conversion_color: "#ff0000",
	icon_state: "godstaff-red",
});
rt.type(7000, "/obj/item/weapon/godstaff/blue", "/obj/item/weapon/godstaff", {
	conversion_color: "#0000ff",
	icon_state: "godstaff-blue",
});
rt.type(7769, "/obj/item/clothing/suit/armor/plate/crusader/red", "/obj/item/clothing/suit/armor/plate/crusader", {
	icon_state: "crusader-red",
});
rt.type(7770, "/obj/item/clothing/suit/armor/plate/crusader/blue", "/obj/item/clothing/suit/armor/plate/crusader", {
	icon_state: "crusader-blue",
});
rt.type(7998, "/obj/item/clothing/head/helmet/plate/crusader/blue", "/obj/item/clothing/head/helmet/plate/crusader", {
	icon_state: "crusader-blue",
});
rt.type(7999, "/obj/item/clothing/head/helmet/plate/crusader/red", "/obj/item/clothing/head/helmet/plate/crusader", {
	icon_state: "crusader-red",
});
rt.type(8001, "/obj/item/clothing/head/helmet/plate/crusader/prophet/red", "/obj/item/clothing/head/helmet/plate/crusader/prophet", {
	icon_state: "prophet-red",
});
rt.type(8002, "/obj/item/clothing/head/helmet/plate/crusader/prophet/blue", "/obj/item/clothing/head/helmet/plate/crusader/prophet", {
	icon_state: "prophet-blue",
});
rt.type(8484, "/obj/item/clothing/shoes/plate/red", "/obj/item/clothing/shoes/plate", {
	icon_state: "crusader-red",
});
rt.type(8485, "/obj/item/clothing/shoes/plate/blue", "/obj/item/clothing/shoes/plate", {
	icon_state: "crusader-blue",
});
rt.type(9541, "/obj/item/wallframe/firealarm", "/obj/item/wallframe", {
	name: "fire alarm frame",
	desc: "Used for building fire alarms",
	icon: rt.rsc("icons/obj/monitors.dmi"),
	icon_state: "fire_bitem",
	result_path: rt.typePath("/obj/machinery/firealarm"),
});
rt.type(9548, "/obj/item/wallframe/extinguisher_cabinet", "/obj/item/wallframe", {
	name: "extinguisher cabinet frame",
	desc: "Used for building wall-mounted extinguisher cabinets.",
	icon_state: "extinguisher",
	result_path: rt.typePath("/obj/structure/extinguisher_cabinet"),
});
rt.type(9549, "/obj/item/wallframe/airalarm", "/obj/item/wallframe", {
	name: "air alarm frame",
	desc: "Used for building Air Alarms",
	icon: rt.rsc("icons/obj/monitors.dmi"),
	icon_state: "alarm_bitem",
	result_path: rt.typePath("/obj/machinery/airalarm"),
});
rt.type(9653, "/obj/item/areaeditor/blueprints/cyborg", "/obj/item/areaeditor/blueprints", {
	fluffnotice: "Intellectual Property of Nanotrasen. For use in engineering cyborgs only. Wipe from memory upon departure from the station.",
	name: "station schematics",
	desc: "A digital copy of the station blueprints stored in your memory.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "blueprints",
});
rt.type(9658, "/obj/item/candle/infinite", "/obj/item/candle", {
	infinite: 1,
	start_lit: 1,
});
rt.type(9660, "/obj/item/cardboard_cutout/adaptive", "/obj/item/cardboard_cutout", {
	deceptive: 1,
});
rt.type(9695, "/obj/item/toy/snappop/phoenix", "/obj/item/toy/snappop", {
	name: "phoenix snap pop",
	desc: "Wow! And wow! And wow!",
	ash_type: rt.typePath("/obj/effect/decal/cleanable/ash/snappop_phoenix"),
});
rt.type(9697, "/obj/item/toy/prize/ripley", "/obj/item/toy/prize", {
	name: "toy Ripley",
	desc: "Mini-Mecha action figure! Collect them all! 1/12.",
});
rt.type(9698, "/obj/item/toy/prize/fireripley", "/obj/item/toy/prize", {
	name: "toy firefighting Ripley",
	desc: "Mini-Mecha action figure! Collect them all! 2/12.",
	icon_state: "fireripleytoy",
});
rt.type(9699, "/obj/item/toy/prize/deathripley", "/obj/item/toy/prize", {
	name: "toy deathsquad Ripley",
	desc: "Mini-Mecha action figure! Collect them all! 3/12.",
	icon_state: "deathripleytoy",
});
rt.type(9700, "/obj/item/toy/prize/gygax", "/obj/item/toy/prize", {
	name: "toy Gygax",
	desc: "Mini-Mecha action figure! Collect them all! 4/12.",
	icon_state: "gygaxtoy",
});
rt.type(9701, "/obj/item/toy/prize/durand", "/obj/item/toy/prize", {
	name: "toy Durand",
	desc: "Mini-Mecha action figure! Collect them all! 5/12.",
	icon_state: "durandprize",
});
rt.type(9702, "/obj/item/toy/prize/honk", "/obj/item/toy/prize", {
	name: "toy H.O.N.K.",
	desc: "Mini-Mecha action figure! Collect them all! 6/12.",
	icon_state: "honkprize",
});
rt.type(9703, "/obj/item/toy/prize/marauder", "/obj/item/toy/prize", {
	name: "toy Marauder",
	desc: "Mini-Mecha action figure! Collect them all! 7/12.",
	icon_state: "marauderprize",
});
rt.type(9704, "/obj/item/toy/prize/seraph", "/obj/item/toy/prize", {
	name: "toy Seraph",
	desc: "Mini-Mecha action figure! Collect them all! 8/12.",
	icon_state: "seraphprize",
});
rt.type(9705, "/obj/item/toy/prize/mauler", "/obj/item/toy/prize", {
	name: "toy Mauler",
	desc: "Mini-Mecha action figure! Collect them all! 9/12.",
	icon_state: "maulerprize",
});
rt.type(9706, "/obj/item/toy/prize/odysseus", "/obj/item/toy/prize", {
	name: "toy Odysseus",
	desc: "Mini-Mecha action figure! Collect them all! 10/12.",
	icon_state: "odysseusprize",
});
rt.type(9707, "/obj/item/toy/prize/phazon", "/obj/item/toy/prize", {
	name: "toy Phazon",
	desc: "Mini-Mecha action figure! Collect them all! 11/12.",
	icon_state: "phazonprize",
});
rt.type(9708, "/obj/item/toy/prize/reticence", "/obj/item/toy/prize", {
	quiet: 1,
	name: "toy Reticence",
	desc: "Mini-Mecha action figure! Collect them all! 12/12.",
	icon_state: "reticenceprize",
});
rt.type(9712, "/obj/item/toy/talking/owl", "/obj/item/toy/talking", {
	messages: null,
	chattering: 1,
	phomeme: "owl",
	name: "owl action figure",
	desc: "An action figure modeled after 'The Owl', defender of justice.",
	icon_state: "owlprize",
});
rt.type(9713, "/obj/item/toy/talking/griffin", "/obj/item/toy/talking", {
	messages: null,
	chattering: 1,
	phomeme: "griffin",
	name: "griffin action figure",
	desc: "An action figure modeled after 'The Griffin', criminal mastermind.",
	icon_state: "griffinprize",
});
rt.type(9716, "/obj/item/toy/cards/deck/syndicate", "/obj/item/toy/cards/deck", {
	deckstyle: "syndicate",
	card_hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	card_force: 5,
	card_throwforce: 10,
	card_throw_speed: 3,
	card_throw_range: 7,
	card_attack_verb: null,
	name: "suspicious looking deck of cards",
	desc: "A deck of space-grade playing cards. They seem unusually rigid.",
	resistance_flags: 0,
});
rt.type(9727, "/obj/item/toy/beach_ball/holoball", "/obj/item/toy/beach_ball", {
	item_state: "basketball",
	w_class: 4,
	name: "basketball",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "basketball",
	desc: "Here's your chance, do your dance at the Space Jam.",
});
rt.type(9732, "/obj/item/toy/figure/cmo", "/obj/item/toy/figure", {
	toysay: "Suit sensors!",
	name: "Chief Medical Officer action figure",
	icon_state: "cmo",
});
rt.type(9733, "/obj/item/toy/figure/assistant", "/obj/item/toy/figure", {
	toysay: "Grey tide world wide!",
	name: "Assistant action figure",
	icon_state: "assistant",
});
rt.type(9734, "/obj/item/toy/figure/atmos", "/obj/item/toy/figure", {
	toysay: "Glory to Atmosia!",
	name: "Atmospheric Technician action figure",
	icon_state: "atmos",
});
rt.type(9735, "/obj/item/toy/figure/bartender", "/obj/item/toy/figure", {
	toysay: "Where is Pun Pun?",
	name: "Bartender action figure",
	icon_state: "bartender",
});
rt.type(9736, "/obj/item/toy/figure/borg", "/obj/item/toy/figure", {
	toysay: "I. LIVE. AGAIN.",
	toysound: rt.rsc("sound/voice/liveagain.ogg"),
	name: "Cyborg action figure",
	icon_state: "borg",
});
rt.type(9737, "/obj/item/toy/figure/botanist", "/obj/item/toy/figure", {
	toysay: "Blaze it!",
	name: "Botanist action figure",
	icon_state: "botanist",
});
rt.type(9738, "/obj/item/toy/figure/captain", "/obj/item/toy/figure", {
	toysay: "Any heads of staff?",
	name: "Captain action figure",
	icon_state: "captain",
});
rt.type(9739, "/obj/item/toy/figure/cargotech", "/obj/item/toy/figure", {
	toysay: "For Cargonia!",
	name: "Cargo Technician action figure",
	icon_state: "cargotech",
});
rt.type(9740, "/obj/item/toy/figure/ce", "/obj/item/toy/figure", {
	toysay: "Wire the solars!",
	name: "Chief Engineer action figure",
	icon_state: "ce",
});
rt.type(9741, "/obj/item/toy/figure/chaplain", "/obj/item/toy/figure", {
	toysay: "Praise Space Jesus!",
	name: "Chaplain action figure",
	icon_state: "chaplain",
});
rt.type(9742, "/obj/item/toy/figure/chef", "/obj/item/toy/figure", {
	toysay: " I'll make you into a burger!",
	name: "Chef action figure",
	icon_state: "chef",
});
rt.type(9743, "/obj/item/toy/figure/chemist", "/obj/item/toy/figure", {
	toysay: "Get your pills!",
	name: "Chemist action figure",
	icon_state: "chemist",
});
rt.type(9744, "/obj/item/toy/figure/clown", "/obj/item/toy/figure", {
	toysay: "Honk!",
	toysound: rt.rsc("sound/items/bikehorn.ogg"),
	name: "Clown action figure",
	icon_state: "clown",
});
rt.type(9745, "/obj/item/toy/figure/ian", "/obj/item/toy/figure", {
	toysay: "Arf!",
	name: "Ian action figure",
	icon_state: "ian",
});
rt.type(9746, "/obj/item/toy/figure/detective", "/obj/item/toy/figure", {
	toysay: "This airlock has grey jumpsuit and insulated glove fibers on it.",
	name: "Detective action figure",
	icon_state: "detective",
});
rt.type(9747, "/obj/item/toy/figure/dsquad", "/obj/item/toy/figure", {
	toysay: "Kill em all!",
	name: "Death Squad Officer action figure",
	icon_state: "dsquad",
});
rt.type(9748, "/obj/item/toy/figure/engineer", "/obj/item/toy/figure", {
	toysay: "Oh god, the singularity is loose!",
	name: "Engineer action figure",
	icon_state: "engineer",
});
rt.type(9749, "/obj/item/toy/figure/geneticist", "/obj/item/toy/figure", {
	toysay: "Smash!",
	name: "Geneticist action figure",
	icon_state: "geneticist",
});
rt.type(9750, "/obj/item/toy/figure/hop", "/obj/item/toy/figure", {
	toysay: "Giving out all access!",
	name: "Head of Personnel action figure",
	icon_state: "hop",
});
rt.type(9751, "/obj/item/toy/figure/hos", "/obj/item/toy/figure", {
	toysay: "Go ahead, make my day.",
	name: "Head of Security action figure",
	icon_state: "hos",
});
rt.type(9752, "/obj/item/toy/figure/qm", "/obj/item/toy/figure", {
	toysay: "Please sign this form in triplicate and we will see about geting you a welding mask within 3 business days.",
	name: "Quartermaster action figure",
	icon_state: "qm",
});
rt.type(9753, "/obj/item/toy/figure/janitor", "/obj/item/toy/figure", {
	toysay: "Look at the signs, you idiot.",
	name: "Janitor action figure",
	icon_state: "janitor",
});
rt.type(9754, "/obj/item/toy/figure/lawyer", "/obj/item/toy/figure", {
	toysay: "My client is a dirty traitor!",
	name: "Lawyer action figure",
	icon_state: "lawyer",
});
rt.type(9755, "/obj/item/toy/figure/curator", "/obj/item/toy/figure", {
	toysay: "One day while...",
	name: "Curator action figure",
	icon_state: "curator",
});
rt.type(9756, "/obj/item/toy/figure/md", "/obj/item/toy/figure", {
	toysay: "The patient is already dead!",
	name: "Medical Doctor action figure",
	icon_state: "md",
});
rt.type(9757, "/obj/item/toy/figure/mime", "/obj/item/toy/figure", {
	toysay: "...",
	toysound: null,
	name: "Mime action figure",
	icon_state: "mime",
});
rt.type(9758, "/obj/item/toy/figure/miner", "/obj/item/toy/figure", {
	toysay: "COLOSSUS RIGHT OUTSIDE THE BASE!",
	name: "Shaft Miner action figure",
	icon_state: "miner",
});
rt.type(9759, "/obj/item/toy/figure/ninja", "/obj/item/toy/figure", {
	toysay: "Oh god! Stop shooting, I'm friendly!",
	name: "Ninja action figure",
	icon_state: "ninja",
});
rt.type(9760, "/obj/item/toy/figure/wizard", "/obj/item/toy/figure", {
	toysay: "Ei Nath!",
	toysound: rt.rsc("sound/magic/disintegrate.ogg"),
	name: "Wizard action figure",
	icon_state: "wizard",
});
rt.type(9761, "/obj/item/toy/figure/rd", "/obj/item/toy/figure", {
	toysay: "Blowing all of the borgs!",
	name: "Research Director action figure",
	icon_state: "rd",
});
rt.type(9762, "/obj/item/toy/figure/roboticist", "/obj/item/toy/figure", {
	toysay: "Big stompy mechs!",
	toysound: rt.rsc("sound/mecha/mechstep.ogg"),
	name: "Roboticist action figure",
	icon_state: "roboticist",
});
rt.type(9763, "/obj/item/toy/figure/scientist", "/obj/item/toy/figure", {
	toysay: "I call toxins.",
	toysound: rt.rsc("sound/effects/explosionfar.ogg"),
	name: "Scientist action figure",
	icon_state: "scientist",
});
rt.type(9764, "/obj/item/toy/figure/syndie", "/obj/item/toy/figure", {
	toysay: "Get that fucking disk!",
	name: "Nuclear Operative action figure",
	icon_state: "syndie",
});
rt.type(9765, "/obj/item/toy/figure/secofficer", "/obj/item/toy/figure", {
	toysay: "I am the law!",
	toysound: rt.rsc("sound/voice/complionator/dredd.ogg"),
	name: "Security Officer action figure",
	icon_state: "secofficer",
});
rt.type(9766, "/obj/item/toy/figure/virologist", "/obj/item/toy/figure", {
	toysay: "The cure is potassium!",
	name: "Virologist action figure",
	icon_state: "virologist",
});
rt.type(9767, "/obj/item/toy/figure/warden", "/obj/item/toy/figure", {
	toysay: "Seventeen minutes for coughing at an officer!",
	name: "Warden action figure",
	icon_state: "warden",
});
rt.type(9778, "/obj/item/target/syndicate", "/obj/item/target", {
	hp: 2600,
	icon_state: "target_s",
	desc: "A shooting target that looks like a syndicate scum.",
});
rt.type(9779, "/obj/item/target/alien", "/obj/item/target", {
	hp: 2350,
	icon_state: "target_q",
	desc: "A shooting target that looks like a xenomorphic alien.",
});
