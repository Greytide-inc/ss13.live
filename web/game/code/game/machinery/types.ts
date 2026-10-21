// Types declared in code/game/machinery that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(6717, "/obj/item/weapon/circuitboard/machine/abductor", "/obj/item/weapon/circuitboard/machine", {
	name: "alien board (Report This)",
	icon_state: "abductor_mod",
	origin_tech: "programming=5;abductor=3",
});
rt.type(6719, "/obj/item/weapon/circuitboard/machine/clockwork", "/obj/item/weapon/circuitboard/machine", {
	name: "clockwork board (Report This)",
	icon_state: "clock_mod",
});
rt.type(6734, "/obj/item/weapon/circuitboard/machine/telecomms", "/obj/item/weapon/circuitboard/machine", {});
rt.type(6784, "/obj/item/weapon/circuitboard/machine/bsa", "/obj/item/weapon/circuitboard/machine", {});
rt.type(6789, "/obj/item/weapon/circuitboard/machine/computer", "/obj/item/weapon/circuitboard/machine", {});
rt.type(6790, "/obj/item/weapon/circuitboard/machine/computer/sat_control", "/obj/item/weapon/circuitboard/machine/computer", {
	name: "Satellite Network Control (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/sat_control"),
	origin_tech: "engineering=3",
});
rt.type(6946, "/obj/item/weapon/bombcore/large", "/obj/item/weapon/bombcore", {
	range_heavy: 5,
	range_medium: 10,
	range_light: 20,
	range_flame: 20,
	name: "large bomb payload",
});
rt.type(6947, "/obj/item/weapon/bombcore/large/underwall", "/obj/item/weapon/bombcore/large", {
	layer: 2.04,
});
rt.type(6948, "/obj/item/weapon/bombcore/miniature", "/obj/item/weapon/bombcore", {
	range_heavy: 1,
	range_medium: 2,
	range_light: 4,
	range_flame: 2,
	name: "small bomb core",
	w_class: 2,
});
rt.type(6950, "/obj/item/weapon/bombcore/pizza", "/obj/item/weapon/bombcore/miniature", {
	name: "pizza bomb",
	desc: "Special delivery!",
	icon_state: "pizzabomb_inactive",
	item_state: "eshield0",
	origin_tech: "syndicate=3;engineering=3",
});
rt.type(7664, "/obj/item/clothing/gloves/color/yellow", "/obj/item/clothing/gloves/color", {
	desc: "These gloves will protect the wearer from electric shock.",
	name: "insulated gloves",
	icon_state: "yellow",
	item_state: "ygloves",
	siemens_coefficient: 0,
	permeability_coefficient: 0.05,
	item_color: "yellow",
	resistance_flags: 0,
});
rt.type(7669, "/obj/item/clothing/gloves/color/orange", "/obj/item/clothing/gloves/color", {
	name: "orange gloves",
	desc: "A pair of gloves, they don't look special in any way.",
	icon_state: "orange",
	item_state: "orangegloves",
	item_color: "orange",
});
rt.type(7670, "/obj/item/clothing/gloves/color/red", "/obj/item/clothing/gloves/color", {
	name: "red gloves",
	desc: "A pair of gloves, they don't look special in any way.",
	icon_state: "red",
	item_state: "redgloves",
	item_color: "red",
});
rt.type(7671, "/obj/item/clothing/gloves/color/red/insulated", "/obj/item/clothing/gloves/color/red", {
	name: "insulated gloves",
	desc: "These gloves will protect the wearer from electric shock.",
	siemens_coefficient: 0,
	permeability_coefficient: 0.05,
	resistance_flags: 0,
});
rt.type(7672, "/obj/item/clothing/gloves/color/rainbow", "/obj/item/clothing/gloves/color", {
	name: "rainbow gloves",
	desc: "A pair of gloves, they don't look special in any way.",
	icon_state: "rainbow",
	item_state: "rainbowgloves",
	item_color: "rainbow",
});
rt.type(7673, "/obj/item/clothing/gloves/color/rainbow/clown", "/obj/item/clothing/gloves/color/rainbow", {
	item_color: "clown",
});
rt.type(7674, "/obj/item/clothing/gloves/color/blue", "/obj/item/clothing/gloves/color", {
	name: "blue gloves",
	desc: "A pair of gloves, they don't look special in any way.",
	icon_state: "blue",
	item_state: "bluegloves",
	item_color: "blue",
});
rt.type(7675, "/obj/item/clothing/gloves/color/purple", "/obj/item/clothing/gloves/color", {
	name: "purple gloves",
	desc: "A pair of gloves, they don't look special in any way.",
	icon_state: "purple",
	item_state: "purplegloves",
	item_color: "purple",
});
rt.type(7676, "/obj/item/clothing/gloves/color/green", "/obj/item/clothing/gloves/color", {
	name: "green gloves",
	desc: "A pair of gloves, they don't look special in any way.",
	icon_state: "green",
	item_state: "greengloves",
	item_color: "green",
});
rt.type(7677, "/obj/item/clothing/gloves/color/grey", "/obj/item/clothing/gloves/color", {
	name: "grey gloves",
	desc: "A pair of gloves, they don't look special in any way.",
	icon_state: "gray",
	item_state: "graygloves",
	item_color: "grey",
});
rt.type(7678, "/obj/item/clothing/gloves/color/grey/rd", "/obj/item/clothing/gloves/color/grey", {
	item_color: "director",
});
rt.type(7679, "/obj/item/clothing/gloves/color/grey/hop", "/obj/item/clothing/gloves/color/grey", {
	item_color: "hop",
});
rt.type(7680, "/obj/item/clothing/gloves/color/light_brown", "/obj/item/clothing/gloves/color", {
	name: "light brown gloves",
	desc: "A pair of gloves, they don't look special in any way.",
	icon_state: "lightbrown",
	item_state: "lightbrowngloves",
	item_color: "light brown",
});
rt.type(7681, "/obj/item/clothing/gloves/color/brown", "/obj/item/clothing/gloves/color", {
	name: "brown gloves",
	desc: "A pair of gloves, they don't look special in any way.",
	icon_state: "brown",
	item_state: "browngloves",
	item_color: "brown",
});
rt.type(7682, "/obj/item/clothing/gloves/color/brown/cargo", "/obj/item/clothing/gloves/color/brown", {
	item_color: "cargo",
});
rt.type(7684, "/obj/item/clothing/gloves/color/latex", "/obj/item/clothing/gloves/color", {
	name: "latex gloves",
	desc: "Cheap sterile gloves made from latex.",
	icon_state: "latex",
	item_state: "lgloves",
	siemens_coefficient: 0.3,
	permeability_coefficient: 0.01,
	item_color: "white",
	transfer_prints: 1,
	resistance_flags: 0,
});
rt.type(7685, "/obj/item/clothing/gloves/color/latex/nitrile", "/obj/item/clothing/gloves/color/latex", {
	name: "nitrile gloves",
	desc: "Pricy sterile gloves that are stronger than latex.",
	icon_state: "nitrile",
	item_state: "nitrilegloves",
	item_color: "cmo",
	transfer_prints: 0,
});
rt.type(7686, "/obj/item/clothing/gloves/color/white", "/obj/item/clothing/gloves/color", {
	name: "white gloves",
	desc: "These look pretty fancy.",
	icon_state: "white",
	item_state: "wgloves",
	item_color: "mime",
});
rt.type(7687, "/obj/item/clothing/gloves/color/white/redcoat", "/obj/item/clothing/gloves/color/white", {
	item_color: "redcoat",
});
rt.type(8263, "/obj/item/clothing/under/color/black", "/obj/item/clothing/under/color", {
	name: "black jumpsuit",
	icon_state: "black",
	item_state: "bl_suit",
	item_color: "black",
	resistance_flags: 0,
});
rt.type(8264, "/obj/item/clothing/under/color/black/ghost", "/obj/item/clothing/under/color/black", {
	flags: 16386,
});
rt.type(8265, "/obj/item/clothing/under/color/grey", "/obj/item/clothing/under/color", {
	name: "grey jumpsuit",
	desc: "A tasteful grey jumpsuit that reminds you of the good old days.",
	icon_state: "grey",
	item_state: "gy_suit",
	item_color: "grey",
});
rt.type(8267, "/obj/item/clothing/under/color/blue", "/obj/item/clothing/under/color", {
	name: "blue jumpsuit",
	icon_state: "blue",
	item_state: "b_suit",
	item_color: "blue",
});
rt.type(8268, "/obj/item/clothing/under/color/green", "/obj/item/clothing/under/color", {
	name: "green jumpsuit",
	icon_state: "green",
	item_state: "g_suit",
	item_color: "green",
});
rt.type(8269, "/obj/item/clothing/under/color/orange", "/obj/item/clothing/under/color", {
	name: "orange jumpsuit",
	desc: "Don't wear this near paranoid security officers.",
	icon_state: "orange",
	item_state: "o_suit",
	item_color: "orange",
});
rt.type(8270, "/obj/item/clothing/under/color/pink", "/obj/item/clothing/under/color", {
	name: "pink jumpsuit",
	icon_state: "pink",
	desc: "Just looking at this makes you feel <i>fabulous</i>.",
	item_state: "p_suit",
	item_color: "pink",
});
rt.type(8271, "/obj/item/clothing/under/color/red", "/obj/item/clothing/under/color", {
	name: "red jumpsuit",
	icon_state: "red",
	item_state: "r_suit",
	item_color: "red",
});
rt.type(8272, "/obj/item/clothing/under/color/white", "/obj/item/clothing/under/color", {
	name: "white jumpsuit",
	icon_state: "white",
	item_state: "w_suit",
	item_color: "white",
});
rt.type(8273, "/obj/item/clothing/under/color/yellow", "/obj/item/clothing/under/color", {
	name: "yellow jumpsuit",
	icon_state: "yellow",
	item_state: "y_suit",
	item_color: "yellow",
});
rt.type(8274, "/obj/item/clothing/under/color/darkblue", "/obj/item/clothing/under/color", {
	name: "darkblue jumpsuit",
	icon_state: "darkblue",
	item_state: "b_suit",
	item_color: "darkblue",
});
rt.type(8275, "/obj/item/clothing/under/color/teal", "/obj/item/clothing/under/color", {
	name: "teal jumpsuit",
	icon_state: "teal",
	item_state: "b_suit",
	item_color: "teal",
});
rt.type(8276, "/obj/item/clothing/under/color/lightpurple", "/obj/item/clothing/under/color", {
	name: "purple jumpsuit",
	icon_state: "lightpurple",
	item_state: "p_suit",
	item_color: "lightpurple",
});
rt.type(8277, "/obj/item/clothing/under/color/darkgreen", "/obj/item/clothing/under/color", {
	name: "darkgreen jumpsuit",
	icon_state: "darkgreen",
	item_state: "g_suit",
	item_color: "darkgreen",
});
rt.type(8278, "/obj/item/clothing/under/color/lightbrown", "/obj/item/clothing/under/color", {
	name: "lightbrown jumpsuit",
	icon_state: "lightbrown",
	item_state: "lb_suit",
	item_color: "lightbrown",
});
rt.type(8279, "/obj/item/clothing/under/color/brown", "/obj/item/clothing/under/color", {
	name: "brown jumpsuit",
	icon_state: "brown",
	item_state: "lb_suit",
	item_color: "brown",
});
rt.type(8280, "/obj/item/clothing/under/color/maroon", "/obj/item/clothing/under/color", {
	name: "maroon jumpsuit",
	icon_state: "maroon",
	item_state: "r_suit",
	item_color: "maroon",
});
rt.type(8281, "/obj/item/clothing/under/color/rainbow", "/obj/item/clothing/under/color", {
	name: "rainbow jumpsuit",
	desc: "A multi-colored jumpsuit!",
	icon_state: "rainbow",
	item_state: "rainbow",
	item_color: "rainbow",
	can_adjust: 0,
});
rt.type(8283, "/obj/item/clothing/under/rank/prisoner", "/obj/item/clothing/under/rank", {
	name: "prison jumpsuit",
	desc: "It's standardised Nanotrasen prisoner-wear. Its suit sensors are stuck in the \"Fully On\" position.",
	icon_state: "prisoner",
	item_state: "o_suit",
	item_color: "prisoner",
	has_sensor: 2,
	sensor_mode: 3,
	random_sensor: 0,
});
rt.type(8284, "/obj/item/clothing/under/rank/mailman", "/obj/item/clothing/under/rank", {
	name: "mailman's jumpsuit",
	desc: "<i>'Special delivery!'</i>",
	icon_state: "mailman",
	item_state: "b_suit",
	item_color: "mailman",
});
rt.type(8285, "/obj/item/clothing/under/rank/psyche", "/obj/item/clothing/under/rank", {
	name: "psychedelic jumpsuit",
	desc: "Groovy!",
	icon_state: "psyche",
	item_state: "p_suit",
	item_color: "psyche",
});
rt.type(8288, "/obj/item/clothing/under/rank/vice", "/obj/item/clothing/under/rank", {
	name: "vice officer's jumpsuit",
	desc: "It's the standard issue pretty-boy outfit, as seen on Holo-Vision.",
	icon_state: "vice",
	item_state: "gy_suit",
	item_color: "vice",
	can_adjust: 0,
});
rt.type(8289, "/obj/item/clothing/under/rank/centcom_officer", "/obj/item/clothing/under/rank", {
	desc: "It's a jumpsuit worn by Centcom Officers.",
	name: "１Centcom officer's jumpsuit",
	icon_state: "officer",
	item_state: "g_suit",
	item_color: "officer",
	alt_covers_chest: 1,
});
rt.type(8290, "/obj/item/clothing/under/rank/centcom_commander", "/obj/item/clothing/under/rank", {
	desc: "It's a jumpsuit worn by Centcom's highest-tier Commanders.",
	name: "１Centcom officer's jumpsuit",
	icon_state: "centcom",
	item_state: "dg_suit",
	item_color: "centcom",
});
rt.type(8296, "/obj/item/clothing/under/rank/bartender", "/obj/item/clothing/under/rank", {
	desc: "It looks like it could use some more flair.",
	name: "bartender's uniform",
	icon_state: "barman",
	item_state: "bar_suit",
	item_color: "barman",
	alt_covers_chest: 1,
});
rt.type(8297, "/obj/item/clothing/under/rank/captain", "/obj/item/clothing/under/rank", {
	desc: "It's a blue jumpsuit with some gold markings denoting the rank of \"Captain\".",
	name: "captain's jumpsuit",
	icon_state: "captain",
	item_state: "b_suit",
	item_color: "captain",
	sensor_mode: 3,
	random_sensor: 0,
});
rt.type(8298, "/obj/item/clothing/under/rank/cargo", "/obj/item/clothing/under/rank", {
	name: "quartermaster's jumpsuit",
	desc: "It's a jumpsuit worn by the quartermaster. It's specially designed to prevent back injuries caused by pushing paper.",
	icon_state: "qm",
	item_state: "lb_suit",
	item_color: "qm",
});
rt.type(8299, "/obj/item/clothing/under/rank/cargotech", "/obj/item/clothing/under/rank", {
	name: "cargo technician's jumpsuit",
	desc: "Shooooorts! They're comfy and easy to wear!",
	icon_state: "cargotech",
	item_state: "lb_suit",
	item_color: "cargo",
	body_parts_covered: 390,
	mutantrace_variation: 1,
});
rt.type(8300, "/obj/item/clothing/under/rank/chaplain", "/obj/item/clothing/under/rank", {
	desc: "It's a black jumpsuit, often worn by religious folk.",
	name: "chaplain's jumpsuit",
	icon_state: "chaplain",
	item_state: "bl_suit",
	item_color: "chapblack",
	can_adjust: 0,
});
rt.type(8301, "/obj/item/clothing/under/rank/chef", "/obj/item/clothing/under/rank", {
	name: "cook's suit",
	desc: "A suit which is given only to the most <b>hardcore</b> cooks in space.",
	icon_state: "chef",
	item_color: "chef",
	alt_covers_chest: 1,
});
rt.type(8302, "/obj/item/clothing/under/rank/head_of_personnel", "/obj/item/clothing/under/rank", {
	desc: "It's a jumpsuit worn by someone who works in the position of \"Head of Personnel\".",
	name: "head of personnel's jumpsuit",
	icon_state: "hop",
	item_state: "b_suit",
	item_color: "hop",
	can_adjust: 0,
});
rt.type(8303, "/obj/item/clothing/under/rank/hydroponics", "/obj/item/clothing/under/rank", {
	desc: "It's a jumpsuit designed to protect against minor plant-related hazards.",
	name: "botanist's jumpsuit",
	icon_state: "hydroponics",
	item_state: "g_suit",
	item_color: "hydroponics",
	permeability_coefficient: 0.5,
});
rt.type(8305, "/obj/item/clothing/under/rank/curator", "/obj/item/clothing/under/rank", {
	name: "sensible suit",
	desc: "It's very... sensible.",
	icon_state: "red_suit",
	item_state: "red_suit",
	item_color: "red_suit",
	can_adjust: 0,
});
rt.type(8306, "/obj/item/clothing/under/rank/curator/treasure_hunter", "/obj/item/clothing/under/rank/curator", {
	name: "treasure hunter uniform",
	desc: "A rugged uniform suitable for treasure hunting.",
	icon_state: "curator",
	item_state: "curator",
	item_color: "curator",
});
rt.type(8307, "/obj/item/clothing/under/rank/mime", "/obj/item/clothing/under/rank", {
	name: "mime's outfit",
	desc: "It's not very colourful.",
	icon_state: "mime",
	item_state: "mime",
	item_color: "mime",
});
rt.type(8308, "/obj/item/clothing/under/rank/miner", "/obj/item/clothing/under/rank", {
	desc: "It's a snappy jumpsuit with a sturdy set of overalls. It is very dirty.",
	name: "shaft miner's jumpsuit",
	icon_state: "miner",
	item_state: "miner",
	item_color: "miner",
});
rt.type(8309, "/obj/item/clothing/under/rank/miner/lavaland", "/obj/item/clothing/under/rank/miner", {
	desc: "A green uniform for operating in hazardous environments.",
	name: "shaft miner's jumpsuit",
	icon_state: "explorer",
	item_state: "explorer",
	item_color: "explorer",
	can_adjust: 0,
});
rt.type(8311, "/obj/item/clothing/under/rank/atmospheric_technician", "/obj/item/clothing/under/rank", {
	desc: "It's a jumpsuit worn by atmospheric technicians.",
	name: "atmospheric technician's jumpsuit",
	icon_state: "atmos",
	item_state: "atmos_suit",
	item_color: "atmos",
	resistance_flags: 0,
});
rt.type(8313, "/obj/item/clothing/under/rank/roboticist", "/obj/item/clothing/under/rank", {
	desc: "It's a slimming black with reinforced seams; great for industrial work.",
	name: "roboticist's jumpsuit",
	icon_state: "robotics",
	item_state: "robotics",
	item_color: "robotics",
	resistance_flags: 0,
});
rt.type(8465, "/obj/item/clothing/shoes/sneakers/black", "/obj/item/clothing/shoes/sneakers", {
	name: "black shoes",
	icon_state: "black",
	item_color: "black",
	desc: "A pair of black shoes.",
	cold_protection: 96,
	min_cold_protection_temperature: 2,
	heat_protection: 96,
	max_heat_protection_temperature: 1500,
});
rt.type(8466, "/obj/item/clothing/shoes/sneakers/black/redcoat", "/obj/item/clothing/shoes/sneakers/black", {
	item_color: "redcoat",
});
rt.type(8467, "/obj/item/clothing/shoes/sneakers/brown", "/obj/item/clothing/shoes/sneakers", {
	name: "brown shoes",
	desc: "A pair of brown shoes.",
	icon_state: "brown",
	item_color: "brown",
});
rt.type(8468, "/obj/item/clothing/shoes/sneakers/brown/captain", "/obj/item/clothing/shoes/sneakers/brown", {
	item_color: "captain",
});
rt.type(8469, "/obj/item/clothing/shoes/sneakers/brown/hop", "/obj/item/clothing/shoes/sneakers/brown", {
	item_color: "hop",
});
rt.type(8470, "/obj/item/clothing/shoes/sneakers/brown/ce", "/obj/item/clothing/shoes/sneakers/brown", {
	item_color: "chief",
});
rt.type(8471, "/obj/item/clothing/shoes/sneakers/brown/rd", "/obj/item/clothing/shoes/sneakers/brown", {
	item_color: "director",
});
rt.type(8472, "/obj/item/clothing/shoes/sneakers/brown/cmo", "/obj/item/clothing/shoes/sneakers/brown", {
	item_color: "medical",
});
rt.type(8473, "/obj/item/clothing/shoes/sneakers/brown/qm", "/obj/item/clothing/shoes/sneakers/brown", {
	item_color: "cargo",
});
rt.type(8474, "/obj/item/clothing/shoes/sneakers/blue", "/obj/item/clothing/shoes/sneakers", {
	name: "blue shoes",
	icon_state: "blue",
	item_color: "blue",
});
rt.type(8475, "/obj/item/clothing/shoes/sneakers/green", "/obj/item/clothing/shoes/sneakers", {
	name: "green shoes",
	icon_state: "green",
	item_color: "green",
});
rt.type(8476, "/obj/item/clothing/shoes/sneakers/yellow", "/obj/item/clothing/shoes/sneakers", {
	name: "yellow shoes",
	icon_state: "yellow",
	item_color: "yellow",
});
rt.type(8477, "/obj/item/clothing/shoes/sneakers/purple", "/obj/item/clothing/shoes/sneakers", {
	name: "purple shoes",
	icon_state: "purple",
	item_color: "purple",
});
rt.type(8478, "/obj/item/clothing/shoes/sneakers/red", "/obj/item/clothing/shoes/sneakers", {
	name: "red shoes",
	desc: "Stylish red shoes.",
	icon_state: "red",
	item_color: "red",
});
rt.type(8479, "/obj/item/clothing/shoes/sneakers/white", "/obj/item/clothing/shoes/sneakers", {
	name: "white shoes",
	icon_state: "white",
	permeability_coefficient: 0.01,
	item_color: "white",
});
rt.type(8480, "/obj/item/clothing/shoes/sneakers/rainbow", "/obj/item/clothing/shoes/sneakers", {
	name: "rainbow shoes",
	desc: "Very gay shoes.",
	icon_state: "rain_bow",
	item_color: "rainbow",
});
rt.type(8482, "/obj/item/clothing/shoes/sneakers/mime", "/obj/item/clothing/shoes/sneakers", {
	name: "mime shoes",
	icon_state: "mime",
	item_color: "mime",
});
rt.type(9223, "/obj/item/device/sbeacondrop/bomb", "/obj/item/device/sbeacondrop", {
	desc: "A label on it reads: <i>Warning: Activating this device will send a high-ordinance explosive to your location</i>.",
	droptype: rt.typePath("/obj/machinery/syndicatebomb"),
	origin_tech: "bluespace=5;syndicate=5",
});
rt.type(9224, "/obj/item/device/sbeacondrop/powersink", "/obj/item/device/sbeacondrop", {
	desc: "A label on it reads: <i>Warning: Activating this device will send a power draining device to your location</i>.",
	droptype: rt.typePath("/obj/item/device/powersink"),
	origin_tech: "bluespace=4;syndicate=5",
});
rt.type(10306, "/obj/machinery/power/singularity_beacon/syndicate", "/obj/machinery/power/singularity_beacon", {
	icontype: "beaconsynd",
	icon_state: "beaconsynd0",
});
rt.type(10335, "/obj/machinery/teleport", "/obj/machinery", {
	anchored: 1,
	name: "teleport",
	icon: rt.rsc("icons/obj/machines/teleporter.dmi"),
	density: 1,
});
rt.type(10437, "/obj/machinery/abductor", "/obj/machinery", {
	team: 0,
	resistance_flags: 99,
});
rt.type(10629, "/obj/machinery/particle_accelerator", "/obj/machinery", {});
rt.type(10642, "/obj/machinery/vending/snack/blue", "/obj/machinery/vending/snack", {
	icon_state: "snackblue",
});
rt.type(10643, "/obj/machinery/vending/snack/orange", "/obj/machinery/vending/snack", {
	icon_state: "snackorange",
});
rt.type(10644, "/obj/machinery/vending/snack/green", "/obj/machinery/vending/snack", {
	icon_state: "snackgreen",
});
rt.type(10645, "/obj/machinery/vending/snack/teal", "/obj/machinery/vending/snack", {
	icon_state: "snackteal",
});
rt.type(10652, "/obj/machinery/vending/cola/blue", "/obj/machinery/vending/cola", {
	icon_state: "Cola_Machine",
});
rt.type(10653, "/obj/machinery/vending/cola/black", "/obj/machinery/vending/cola", {
	icon_state: "cola_black",
});
rt.type(10654, "/obj/machinery/vending/cola/red", "/obj/machinery/vending/cola", {
	product_slogans: "Cola in space!",
	icon_state: "red_cola",
	name: "１Space Cola Vendor",
	desc: "It vends cola, in space.",
});
rt.type(10655, "/obj/machinery/vending/cola/space_up", "/obj/machinery/vending/cola", {
	product_slogans: "Space-up! Like a hull breach in your mouth.",
	icon_state: "space_up",
	name: "１Space-up! Vendor",
	desc: "Indulge in an explosion of flavor.",
});
rt.type(10656, "/obj/machinery/vending/cola/starkist", "/obj/machinery/vending/cola", {
	product_slogans: "Drink the stars! Star-kist!",
	icon_state: "starkist",
	name: "１Star-kist Vendor",
	desc: "The taste of a star in liquid form.",
});
rt.type(10657, "/obj/machinery/vending/cola/sodie", "/obj/machinery/vending/cola", {
	icon_state: "soda",
});
rt.type(10658, "/obj/machinery/vending/cola/pwr_game", "/obj/machinery/vending/cola", {
	product_slogans: "The POWER that gamers crave! PWR GAME!",
	icon_state: "pwr_game",
	name: "１Pwr Game Vendor",
	desc: "You want it, we got it. Brought to you in partnership with Vlad's Salads.",
});
rt.type(10766, "/obj/machinery/droneDispenser/syndrone/badass", "/obj/machinery/droneDispenser/syndrone", {
	dispense_type: rt.typePath("/obj/item/drone_shell/syndrone/badass"),
	end_create_message: "dispenses a ominous suspicious drone shell.",
	name: "badass syndrone shell dispenser",
	desc: "A suspicious machine that will create Syndicate exterminator drones when supplied with metal and glass. Disgusting. This one seems ominous.",
});
rt.type(10767, "/obj/machinery/droneDispenser/snowflake", "/obj/machinery/droneDispenser", {
	dispense_type: rt.typePath("/obj/item/drone_shell/snowflake"),
	end_create_message: "dispenses a snowflake drone shell.",
	metal_cost: 2000,
	glass_cost: 2000,
	power_used: 2000,
	name: "snowflake drone shell dispenser",
	desc: "A hefty machine that, when supplied with metal and glass, will periodically create a snowflake drone shell. Does not need to be manually operated.",
});
rt.type(10769, "/obj/machinery/droneDispenser/hivebot", "/obj/machinery/droneDispenser", {
	icon_off: "hivebot_fab",
	icon_on: "hivebot_fab",
	icon_recharging: "hivebot_fab",
	icon_creating: "hivebot_fab_on",
	metal_cost: 0,
	glass_cost: 0,
	power_used: 0,
	cooldownTime: 10,
	dispense_type: rt.typePath("/mob/living/simple_animal/hostile/hivebot"),
	begin_create_message: "closes and begins fabricating something within.",
	end_create_message: "slams open, revealing out a hivebot!",
	recharge_sound: null,
	recharge_message: null,
	name: "hivebot fabricator",
	desc: "A large, bulky machine that whirs with activity, steam hissing from vents in its sides.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "hivebot_fab",
});
rt.type(10780, "/obj/machinery/button/massdriver", "/obj/machinery/button", {
	skin: "launcher",
	device_type: rt.typePath("/obj/item/device/assembly/control/massdriver"),
	name: "mass driver button",
	desc: "A remote control switch for a mass driver.",
	icon_state: "launcher",
});
rt.type(10781, "/obj/machinery/button/ignition", "/obj/machinery/button", {
	skin: "launcher",
	device_type: rt.typePath("/obj/item/device/assembly/control/igniter"),
	name: "ignition switch",
	desc: "A remote control switch for a mounted igniter.",
	icon_state: "launcher",
});
rt.type(10782, "/obj/machinery/button/flasher", "/obj/machinery/button", {
	skin: "launcher",
	device_type: rt.typePath("/obj/item/device/assembly/control/flasher"),
	name: "flasher button",
	desc: "A remote control switch for a mounted flasher.",
	icon_state: "launcher",
});
rt.type(10789, "/obj/machinery/doppler_array/integrated", "/obj/machinery/doppler_array", {
	integrated: 1,
	max_dist: 21,
	name: "integrated tachyon-doppler module",
	use_power: 0,
});
rt.type(10809, "/obj/machinery/newscaster/security_unit", "/obj/machinery/newscaster", {
	securityCaster: 1,
	name: "security newscaster",
});
rt.type(10815, "/obj/machinery/recycler/deathtrap", "/obj/machinery/recycler", {
	emagged: 1,
	crush_damage: 120,
	flags: 128,
	name: "dangerous old crusher",
});
rt.type(10823, "/obj/machinery/sleep_console", "/obj/machinery", {
	anchored: 1,
	name: "sleeper console",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "console",
	density: 0,
});
rt.type(10825, "/obj/machinery/sleeper/syndie", "/obj/machinery/sleeper", {
	controls_inside: 1,
	icon_state: "sleeper_s",
});
rt.type(10826, "/obj/machinery/sleeper/old", "/obj/machinery/sleeper", {
	icon_state: "oldpod",
});
rt.type(10832, "/obj/machinery/suit_storage_unit/standard_unit", "/obj/machinery/suit_storage_unit", {
	suit_type: rt.typePath("/obj/item/clothing/suit/space/eva"),
	helmet_type: rt.typePath("/obj/item/clothing/head/helmet/space/eva"),
	mask_type: rt.typePath("/obj/item/clothing/mask/breath"),
});
rt.type(10833, "/obj/machinery/suit_storage_unit/captain", "/obj/machinery/suit_storage_unit", {
	suit_type: rt.typePath("/obj/item/clothing/suit/space/hardsuit/captain"),
	mask_type: rt.typePath("/obj/item/clothing/mask/gas/sechailer"),
	storage_type: rt.typePath("/obj/item/weapon/tank/jetpack/oxygen/captain"),
});
rt.type(10834, "/obj/machinery/suit_storage_unit/engine", "/obj/machinery/suit_storage_unit", {
	suit_type: rt.typePath("/obj/item/clothing/suit/space/hardsuit/engine"),
	mask_type: rt.typePath("/obj/item/clothing/mask/breath"),
});
rt.type(10835, "/obj/machinery/suit_storage_unit/ce", "/obj/machinery/suit_storage_unit", {
	suit_type: rt.typePath("/obj/item/clothing/suit/space/hardsuit/engine/elite"),
	mask_type: rt.typePath("/obj/item/clothing/mask/breath"),
	storage_type: rt.typePath("/obj/item/clothing/shoes/magboots/advance"),
});
rt.type(10836, "/obj/machinery/suit_storage_unit/security", "/obj/machinery/suit_storage_unit", {
	suit_type: rt.typePath("/obj/item/clothing/suit/space/hardsuit/security"),
	mask_type: rt.typePath("/obj/item/clothing/mask/gas/sechailer"),
});
rt.type(10837, "/obj/machinery/suit_storage_unit/hos", "/obj/machinery/suit_storage_unit", {
	suit_type: rt.typePath("/obj/item/clothing/suit/space/hardsuit/security/hos"),
	mask_type: rt.typePath("/obj/item/clothing/mask/gas/sechailer"),
	storage_type: rt.typePath("/obj/item/weapon/tank/internals/oxygen"),
});
rt.type(10838, "/obj/machinery/suit_storage_unit/atmos", "/obj/machinery/suit_storage_unit", {
	suit_type: rt.typePath("/obj/item/clothing/suit/space/hardsuit/engine/atmos"),
	mask_type: rt.typePath("/obj/item/clothing/mask/gas"),
	storage_type: rt.typePath("/obj/item/weapon/watertank/atmos"),
});
rt.type(10839, "/obj/machinery/suit_storage_unit/mining", "/obj/machinery/suit_storage_unit", {
	suit_type: rt.typePath("/obj/item/clothing/suit/hooded/explorer"),
	mask_type: rt.typePath("/obj/item/clothing/mask/gas/explorer"),
});
rt.type(10840, "/obj/machinery/suit_storage_unit/mining/eva", "/obj/machinery/suit_storage_unit/mining", {
	suit_type: rt.typePath("/obj/item/clothing/suit/space/hardsuit/mining"),
	mask_type: rt.typePath("/obj/item/clothing/mask/breath"),
});
rt.type(10841, "/obj/machinery/suit_storage_unit/cmo", "/obj/machinery/suit_storage_unit", {
	suit_type: rt.typePath("/obj/item/clothing/suit/space/hardsuit/medical"),
	mask_type: rt.typePath("/obj/item/clothing/mask/breath"),
});
rt.type(10842, "/obj/machinery/suit_storage_unit/rd", "/obj/machinery/suit_storage_unit", {
	suit_type: rt.typePath("/obj/item/clothing/suit/space/hardsuit/rd"),
	mask_type: rt.typePath("/obj/item/clothing/mask/breath"),
});
rt.type(10843, "/obj/machinery/suit_storage_unit/syndicate", "/obj/machinery/suit_storage_unit", {
	suit_type: rt.typePath("/obj/item/clothing/suit/space/hardsuit/syndi"),
	mask_type: rt.typePath("/obj/item/clothing/mask/gas/syndicate"),
	storage_type: rt.typePath("/obj/item/weapon/tank/jetpack/oxygen/harness"),
});
rt.type(10844, "/obj/machinery/suit_storage_unit/ert", "/obj/machinery/suit_storage_unit", {});
rt.type(10845, "/obj/machinery/suit_storage_unit/ert/command", "/obj/machinery/suit_storage_unit/ert", {
	suit_type: rt.typePath("/obj/item/clothing/suit/space/hardsuit/ert"),
	mask_type: rt.typePath("/obj/item/clothing/mask/breath"),
	storage_type: rt.typePath("/obj/item/weapon/tank/internals/emergency_oxygen/double"),
});
rt.type(10846, "/obj/machinery/suit_storage_unit/ert/security", "/obj/machinery/suit_storage_unit/ert", {
	suit_type: rt.typePath("/obj/item/clothing/suit/space/hardsuit/ert/sec"),
	mask_type: rt.typePath("/obj/item/clothing/mask/breath"),
	storage_type: rt.typePath("/obj/item/weapon/tank/internals/emergency_oxygen/double"),
});
rt.type(10847, "/obj/machinery/suit_storage_unit/ert/engineer", "/obj/machinery/suit_storage_unit/ert", {
	suit_type: rt.typePath("/obj/item/clothing/suit/space/hardsuit/ert/engi"),
	mask_type: rt.typePath("/obj/item/clothing/mask/breath"),
	storage_type: rt.typePath("/obj/item/weapon/tank/internals/emergency_oxygen/double"),
});
rt.type(10848, "/obj/machinery/suit_storage_unit/ert/medical", "/obj/machinery/suit_storage_unit/ert", {
	suit_type: rt.typePath("/obj/item/clothing/suit/space/hardsuit/ert/med"),
	mask_type: rt.typePath("/obj/item/clothing/mask/breath"),
	storage_type: rt.typePath("/obj/item/weapon/tank/internals/emergency_oxygen/double"),
});
rt.type(10850, "/obj/machinery/syndicatebomb/training", "/obj/machinery/syndicatebomb", {
	payload: rt.typePath("/obj/item/weapon/bombcore/training"),
	name: "training bomb",
	icon_state: "training-bomb",
	desc: "A salvaged syndicate device gutted of its explosives to be used as a training aid for aspiring bomb defusers.",
});
rt.type(10851, "/obj/machinery/syndicatebomb/badmin", "/obj/machinery/syndicatebomb", {
	payload: rt.typePath("/obj/item/weapon/bombcore/badmin/summon"),
	name: "generic summoning badmin bomb",
	desc: "Oh god what is in this thing?",
});
rt.type(10852, "/obj/machinery/syndicatebomb/badmin/clown", "/obj/machinery/syndicatebomb/badmin", {
	payload: rt.typePath("/obj/item/weapon/bombcore/badmin/summon/clown"),
	beepsound: rt.rsc("sound/items/bikehorn.ogg"),
	name: "clown bomb",
	icon_state: "clown-bomb",
	desc: "HONK.",
});
rt.type(10854, "/obj/machinery/syndicatebomb/self_destruct", "/obj/machinery/syndicatebomb", {
	payload: rt.typePath("/obj/item/weapon/bombcore/large"),
	can_unanchor: 0,
	name: "self destruct device",
	desc: "Do not taunt. Warranty invalid if exposed to high temperature. Not suitable for agents under 3 years of age.",
});
rt.type(10990, "/obj/machinery/bsa", "/obj/machinery", {
	anchored: 1,
	icon: rt.rsc("icons/obj/machines/particle_accelerator.dmi"),
	density: 1,
});
rt.type(12551, "/obj/structure/emergency_shield/sanguine", "/obj/structure/emergency_shield", {
	name: "sanguine barrier",
	desc: "A potent shield summoned by cultists to defend their rites.",
	icon_state: "shield-red",
	obj_integrity: 60,
	max_integrity: 60,
});
rt.type(12552, "/obj/structure/emergency_shield/invoker", "/obj/structure/emergency_shield", {
	name: "Invoker's Shield",
	desc: "A weak shield summoned by cultists to protect them while they carry out delicate rituals",
	color: "#FF0000",
	obj_integrity: 20,
	max_integrity: 20,
	mouse_opacity: 0,
});
