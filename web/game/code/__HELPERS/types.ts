// Types declared in code/__HELPERS that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../build/dist/src/translate/runtime.js";

rt.type(5, "/datum/linked_node", "/datum", {
	value: null,
	linked_list: null,
	next_node: null,
	previous_node: null,
});
rt.type(7, "/datum/controller", "/datum", {
	name: null,
	statclick: null,
});
rt.type(58, "/datum/projectile_data", "/datum", {
	src_x: null,
	src_y: null,
	time: null,
	distance: null,
	power_x: null,
	power_y: null,
	dest_x: null,
	dest_y: null,
});
rt.type(392, "/datum/data", "/datum", {
	name: "data",
});
rt.type(394, "/datum/data/crime", "/datum/data", {
	crimeName: "",
	crimeDetails: "",
	author: "",
	time: "",
	dataId: 0,
	name: "crime",
});
rt.type(395, "/datum/data/vending_product", "/datum/data", {
	product_name: "generic",
	product_path: null,
	amount: 0,
	max_amount: 0,
	display_color: "blue",
});
rt.type(396, "/datum/data/mining_equipment", "/datum/data", {
	equipment_name: "generic",
	equipment_path: null,
	cost: 0,
});
rt.type(575, "/datum/material", "/datum", {
	name: null,
	amount: 0,
	id: null,
	sheet_type: null,
	coin_type: null,
});
rt.type(576, "/datum/material/metal", "/datum/material", {
	name: "Metal",
	id: "$metal",
	sheet_type: rt.typePath("/obj/item/stack/sheet/metal"),
	coin_type: rt.typePath("/obj/item/weapon/coin/iron"),
});
rt.type(577, "/datum/material/glass", "/datum/material", {
	name: "Glass",
	id: "$glass",
	sheet_type: rt.typePath("/obj/item/stack/sheet/glass"),
});
rt.type(578, "/datum/material/silver", "/datum/material", {
	name: "Silver",
	id: "$silver",
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/silver"),
	coin_type: rt.typePath("/obj/item/weapon/coin/silver"),
});
rt.type(579, "/datum/material/gold", "/datum/material", {
	name: "Gold",
	id: "$gold",
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/gold"),
	coin_type: rt.typePath("/obj/item/weapon/coin/gold"),
});
rt.type(580, "/datum/material/diamond", "/datum/material", {
	name: "Diamond",
	id: "$diamond",
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/diamond"),
	coin_type: rt.typePath("/obj/item/weapon/coin/diamond"),
});
rt.type(581, "/datum/material/uranium", "/datum/material", {
	name: "Uranium",
	id: "$uranium",
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/uranium"),
	coin_type: rt.typePath("/obj/item/weapon/coin/uranium"),
});
rt.type(582, "/datum/material/plasma", "/datum/material", {
	name: "Solid Plasma",
	id: "$plasma",
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/plasma"),
	coin_type: rt.typePath("/obj/item/weapon/coin/plasma"),
});
rt.type(583, "/datum/material/bluespace", "/datum/material", {
	name: "Bluespace Mesh",
	id: "$bluespace",
	sheet_type: rt.typePath("/obj/item/stack/sheet/bluespace_crystal"),
});
rt.type(584, "/datum/material/bananium", "/datum/material", {
	name: "Bananium",
	id: "$bananium",
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/bananium"),
	coin_type: rt.typePath("/obj/item/weapon/coin/clown"),
});
rt.type(585, "/datum/material/titanium", "/datum/material", {
	name: "Titanium",
	id: "$titanium",
	sheet_type: rt.typePath("/obj/item/stack/sheet/mineral/titanium"),
});
rt.type(586, "/datum/material/biomass", "/datum/material", {
	name: "Biomass",
	id: "$biomass",
});
rt.type(588, "/datum/mutation", "/datum", {
	name: null,
});
rt.type(1236, "/datum/cult_supply", "/datum", {
	id: "used_popcorn",
	invocation: "Pla'ceho'lder.",
	desc: "Summons a generic supply item, to aid the cult.",
	summon_type: rt.typePath("/obj/item/trash/popcorn"),
});
rt.type(1237, "/datum/cult_supply/tome", "/datum/cult_supply", {
	id: "arcane_tome",
	invocation: "N'ath reth sh'yro eth d'raggathnor!",
	desc: "Summons an arcane tome, used to scribe runes.",
	summon_type: rt.typePath("/obj/item/weapon/tome"),
});
rt.type(1238, "/datum/cult_supply/metal", "/datum/cult_supply", {
	id: "runed_metal",
	invocation: "Bar'tea eas!",
	desc: "Provides 5 runed metal, which can build a variety of cult structures.",
	summon_type: rt.typePath("/obj/item/stack/sheet/runed_metal/five"),
});
rt.type(1239, "/datum/cult_supply/talisman", "/datum/cult_supply", {});
rt.type(1240, "/datum/cult_supply/talisman/teleport", "/datum/cult_supply/talisman", {
	id: "teleport_talisman",
	invocation: "Sas'so c'arta forbici!",
	desc: "Allows you to move to a selected teleportation rune.",
	summon_type: rt.typePath("/obj/item/weapon/paper/talisman/teleport"),
});
rt.type(1241, "/datum/cult_supply/talisman/emp", "/datum/cult_supply/talisman", {
	id: "emp_talisman",
	invocation: "Ta'gh fara'qha fel d'amar det!",
	desc: "Allows you to destroy technology in a short range.",
	summon_type: rt.typePath("/obj/item/weapon/paper/talisman/emp"),
});
rt.type(1242, "/datum/cult_supply/talisman/stun", "/datum/cult_supply/talisman", {
	id: "stun_talisman",
	invocation: "Fuu ma'jin!",
	desc: "Allows you to stun a person by attacking them with the talisman. Does not work on people holding a holy weapon!",
	summon_type: rt.typePath("/obj/item/weapon/paper/talisman/stun"),
});
rt.type(1243, "/datum/cult_supply/talisman/veil", "/datum/cult_supply/talisman", {
	id: "veil_talisman",
	invocation: "Kla'atu barada nikt'o!",
	desc: "Two use talisman, first use makes all nearby runes invisible, secnd use reveals nearby hidden runes.",
	summon_type: rt.typePath("/obj/item/weapon/paper/talisman/true_sight"),
});
rt.type(1244, "/datum/cult_supply/soulstone", "/datum/cult_supply", {
	id: "soulstone",
	invocation: "Kal'om neth!",
	desc: "Summons a soul stone, used to capture the spirits of dead or dying humans.",
	summon_type: rt.typePath("/obj/item/device/soulstone"),
});
rt.type(1245, "/datum/cult_supply/construct_shell", "/datum/cult_supply", {
	id: "construct_shell",
	invocation: "Daa'ig osk!",
	desc: "Summons a construct shell for use with soulstone-captured souls. It is too large to carry on your person.",
	summon_type: rt.typePath("/obj/structure/constructshell"),
});
rt.type(1291, "/datum/AI_Module", "/datum", {
	module_name: null,
	mod_pick_name: null,
	description: "",
	engaged: 0,
	cost: 5,
	one_purchase: 0,
	power_type: rt.typePath("/datum/action/innate/ai"),
	upgrade: null,
	unlock_text: "<span class='notice'>Hello World!</span>",
	unlock_sound: null,
});
rt.type(1292, "/datum/AI_Module/large", "/datum/AI_Module", {});
rt.type(1293, "/datum/AI_Module/large/nuke_station", "/datum/AI_Module/large", {
	module_name: "Doomsday Device",
	mod_pick_name: "nukestation",
	description: "Activate a weapon that will disintegrate all organic life on the station after a 450 second delay. Can only be used while on the station, will fail if your core is moved off station or destroyed.",
	cost: 130,
	one_purchase: 1,
	power_type: rt.typePath("/datum/action/innate/ai/nuke_station"),
	unlock_text: "<span class='notice'>You slowly, carefully, establish a connection with the on-station self-destruct. You can now activate it at any time.</span>",
});
rt.type(1295, "/datum/AI_Module/large/lockdown", "/datum/AI_Module/large", {
	module_name: "Hostile Station Lockdown",
	mod_pick_name: "lockdown",
	description: "Overload the airlock, blast door and fire control networks, locking them down. Caution! This command also electrifies all airlocks. The networks will automatically reset after 90 seconds, briefly opening all doors on the station.",
	cost: 30,
	one_purchase: 1,
	power_type: rt.typePath("/datum/action/innate/ai/lockdown"),
	unlock_text: "<span class='notice'>You upload a sleeper trojan into the door control systems. You can send a signal to set it off at any time.</span>",
	unlock_sound: rt.rsc("sound/machines/boltsdown.ogg"),
});
rt.type(1296, "/datum/AI_Module/large/destroy_rcd", "/datum/AI_Module/large", {
	module_name: "Destroy RCDs",
	mod_pick_name: "rcd",
	description: "Send a specialised pulse to detonate all hand-held and exosuit Rapid Construction Devices on the station.",
	cost: 25,
	one_purchase: 1,
	power_type: rt.typePath("/datum/action/innate/ai/destroy_rcds"),
	unlock_text: "<span class='notice'>After some improvisation, you rig your onboard radio to be able to send a signal to detonate all RCDs.</span>",
	unlock_sound: rt.rsc("sound/items/timer.ogg"),
});
rt.type(1298, "/datum/AI_Module/large/break_fire_alarms", "/datum/AI_Module/large", {
	module_name: "Thermal Sensor Override",
	mod_pick_name: "burnpigs",
	description: "Gives you the ability to override the thermal sensors on all fire alarms. This will remove their ability to scan for fire and thus their ability to alert. Anyone can check the fire alarm's interface and may be tipped off by its status.",
	one_purchase: 1,
	cost: 25,
	power_type: rt.typePath("/datum/action/innate/ai/break_fire_alarms"),
	unlock_text: "<span class='notice'>You replace the thermal sensing capabilities of all fire alarms with a manual override, allowing you to turn them off at will.</span>",
	unlock_sound: rt.rsc("sound/machines/FireAlarm.ogg"),
});
rt.type(1299, "/datum/AI_Module/large/break_air_alarms", "/datum/AI_Module/large", {
	module_name: "Air Alarm Safety Override",
	mod_pick_name: "allow_flooding",
	description: "Gives you the ability to disable safeties on all air alarms. This will allow you to use the environmental mode Flood, which disables scrubbers as well as pressure checks on vents. Anyone can check the air alarm's interface and may be tipped off by their nonfunctionality.",
	one_purchase: 1,
	cost: 50,
	power_type: rt.typePath("/datum/action/innate/ai/break_air_alarms"),
	unlock_text: "<span class='notice'>You remove the safety overrides on all air alarms, but you leave the confirm prompts open. You can hit 'Yes' at any time... you bastard.</span>",
	unlock_sound: rt.rsc("sound/effects/space_wind.ogg"),
});
rt.type(1300, "/datum/AI_Module/large/place_cyborg_transformer", "/datum/AI_Module/large", {
	module_name: "Robotic Factory (Removes Shunting)",
	mod_pick_name: "cyborgtransformer",
	description: "Build a machine anywhere, using expensive nanomachines, that can convert a living human into a loyal cyborg slave when placed inside.",
	cost: 100,
	one_purchase: 1,
	power_type: rt.typePath("/datum/action/innate/ai/place_transformer"),
	unlock_text: "<span class='notice'>You make contact with Space Amazon and request a robotics factory for delivery.</span>",
	unlock_sound: rt.rsc("sound/machines/ping.ogg"),
});
rt.type(1303, "/datum/AI_Module/small", "/datum/AI_Module", {});
rt.type(1304, "/datum/AI_Module/small/overload_machine", "/datum/AI_Module/small", {
	module_name: "Machine Overload",
	mod_pick_name: "overload",
	description: "Overheats an electrical machine, causing a small explosion and destroying it. Two uses per purchase.",
	cost: 20,
	power_type: rt.typePath("/datum/action/innate/ai/ranged/overload_machine"),
	unlock_text: "<span class='notice'>You enable the ability for the station's APCs to direct intense energy into machinery.</span>",
	unlock_sound: rt.rsc("sound/effects/comfyfire.ogg"),
});
rt.type(1305, "/datum/AI_Module/small/override_machine", "/datum/AI_Module/small", {
	module_name: "Machine Override",
	mod_pick_name: "override",
	description: "Overrides a machine's programming, causing it to rise up and attack everyone except other machines. Four uses.",
	cost: 30,
	power_type: rt.typePath("/datum/action/innate/ai/ranged/override_machine"),
	unlock_text: "<span class='notice'>You procure a virus from the Space Dark Web and distribute it to the station's machines.</span>",
	unlock_sound: rt.rsc("sound/machines/airlock_alien_prying.ogg"),
});
rt.type(1306, "/datum/AI_Module/small/blackout", "/datum/AI_Module/small", {
	module_name: "Blackout",
	mod_pick_name: "blackout",
	description: "Attempts to overload the lighting circuits on the station, destroying some bulbs. Three uses.",
	cost: 15,
	power_type: rt.typePath("/datum/action/innate/ai/blackout"),
	unlock_text: "<span class='notice'>You hook into the powernet and route bonus power towards the station's lighting.</span>",
	unlock_sound: "sparks",
});
rt.type(1307, "/datum/AI_Module/small/reactivate_cameras", "/datum/AI_Module/small", {
	module_name: "Reactivate Camera Network",
	mod_pick_name: "recam",
	description: "Runs a network-wide diagnostic on the camera network, resetting focus and re-routing power to failed cameras. Can be used to repair up to 30 cameras.",
	cost: 10,
	one_purchase: 1,
	power_type: rt.typePath("/datum/action/innate/ai/reactivate_cameras"),
	unlock_text: "<span class='notice'>You deploy nanomachines to the cameranet.</span>",
	unlock_sound: rt.rsc("sound/items/wirecutter.ogg"),
});
rt.type(1492, "/datum/newscaster", "/datum", {});
rt.type(1493, "/datum/newscaster/feed_comment", "/datum/newscaster", {
	author: "",
	body: "",
	time_stamp: "",
});
rt.type(1496, "/datum/newscaster/wanted_message", "/datum/newscaster", {
	active: null,
	criminal: null,
	body: null,
	scannedUser: null,
	isAdminMsg: null,
	img: null,
});
rt.type(1500, "/datum/computer", "/datum", {});
rt.type(1501, "/datum/computer/file", "/datum/computer", {});
rt.type(1531, "/datum/stack_recipe", "/datum", {
	title: "ERROR",
	result_type: null,
	req_amount: 1,
	res_amount: 1,
	max_res_amount: 1,
	time: 0,
	one_per_turf: 0,
	on_floor: 0,
	window_checks: 0,
});
rt.type(1805, "/datum/barsign", "/datum", {
	name: "Name",
	icon: "Icon",
	desc: "desc",
	hidden: 0,
});
rt.type(1806, "/datum/barsign/maltesefalcon", "/datum/barsign", {
	name: "Maltese Falcon",
	icon: "maltesefalcon",
	desc: "The Maltese Falcon, Space Bar and Grill.",
});
rt.type(1807, "/datum/barsign/thebark", "/datum/barsign", {
	name: "The Bark",
	icon: "thebark",
	desc: "Ian's bar of choice.",
});
rt.type(1808, "/datum/barsign/harmbaton", "/datum/barsign", {
	name: "The Harmbaton",
	icon: "theharmbaton",
	desc: "A great dining experience for both security members and assistants.",
});
rt.type(1809, "/datum/barsign/thesingulo", "/datum/barsign", {
	name: "The Singulo",
	icon: "thesingulo",
	desc: "Where people go that'd rather not be called by their name.",
});
rt.type(1810, "/datum/barsign/thedrunkcarp", "/datum/barsign", {
	name: "The Drunk Carp",
	icon: "thedrunkcarp",
	desc: "Don't drink and swim.",
});
rt.type(1811, "/datum/barsign/scotchservinwill", "/datum/barsign", {
	name: "Scotch Servin Willy's",
	icon: "scotchservinwill",
	desc: "Willy sure moved up in the world from clown to bartender.",
});
rt.type(1812, "/datum/barsign/officerbeersky", "/datum/barsign", {
	name: "Officer Beersky's",
	icon: "officerbeersky",
	desc: "Man eat a dong, these drinks are great.",
});
rt.type(1813, "/datum/barsign/thecavern", "/datum/barsign", {
	name: "The Cavern",
	icon: "thecavern",
	desc: "Fine drinks while listening to some fine tunes.",
});
rt.type(1814, "/datum/barsign/theouterspess", "/datum/barsign", {
	name: "The Outer Spess",
	icon: "theouterspess",
	desc: "This bar isn't actually located in outer space.",
});
rt.type(1815, "/datum/barsign/slipperyshots", "/datum/barsign", {
	name: "Slippery Shots",
	icon: "slipperyshots",
	desc: "Slippery slope to drunkeness with our shots!",
});
rt.type(1816, "/datum/barsign/thegreytide", "/datum/barsign", {
	name: "The Grey Tide",
	icon: "thegreytide",
	desc: "Abandon your toolboxing ways and enjoy a lazy beer!",
});
rt.type(1817, "/datum/barsign/honkednloaded", "/datum/barsign", {
	name: "Honked 'n' Loaded",
	icon: "honkednloaded",
	desc: "Honk.",
});
rt.type(1818, "/datum/barsign/thenest", "/datum/barsign", {
	name: "The Nest",
	icon: "thenest",
	desc: "A good place to retire for a drink after a long night of crime fighting.",
});
rt.type(1819, "/datum/barsign/thecoderbus", "/datum/barsign", {
	name: "The Coderbus",
	icon: "thecoderbus",
	desc: "A very controversial bar known for its wide variety of constantly-changing drinks.",
});
rt.type(1820, "/datum/barsign/theadminbus", "/datum/barsign", {
	name: "The Adminbus",
	icon: "theadminbus",
	desc: "An establishment visited mainly by space-judges. It isn't bombed nearly as much as court hearings.",
});
rt.type(1821, "/datum/barsign/oldcockinn", "/datum/barsign", {
	name: "The Old Cock Inn",
	icon: "oldcockinn",
	desc: "Something about this sign fills you with despair.",
});
rt.type(1822, "/datum/barsign/thewretchedhive", "/datum/barsign", {
	name: "The Wretched Hive",
	icon: "thewretchedhive",
	desc: "Legally obligated to instruct you to check your drinks for acid before consumption.",
});
rt.type(1823, "/datum/barsign/robustacafe", "/datum/barsign", {
	name: "The Robusta Cafe",
	icon: "robustacafe",
	desc: "Holder of the 'Most Lethal Barfights' record 5 years uncontested.",
});
rt.type(1824, "/datum/barsign/emergencyrumparty", "/datum/barsign", {
	name: "The Emergency Rum Party",
	icon: "emergencyrumparty",
	desc: "Recently relicensed after a long closure.",
});
rt.type(1825, "/datum/barsign/combocafe", "/datum/barsign", {
	name: "The Combo Cafe",
	icon: "combocafe",
	desc: "Renowned system-wide for their utterly uncreative drink combinations.",
});
rt.type(1826, "/datum/barsign/vladssaladbar", "/datum/barsign", {
	name: "Vlad's Salad Bar",
	icon: "vladssaladbar",
	desc: "Under new management. Vlad was always a bit too trigger happy with that shotgun.",
});
rt.type(1827, "/datum/barsign/theshaken", "/datum/barsign", {
	name: "The Shaken",
	icon: "theshaken",
	desc: "This establishment does not serve stirred drinks.",
});
rt.type(1828, "/datum/barsign/thealenath", "/datum/barsign", {
	name: "The Ale' Nath",
	icon: "thealenath",
	desc: "All right, buddy. I think you've had EI NATH. Time to get a cab.",
});
rt.type(1829, "/datum/barsign/thealohasnackbar", "/datum/barsign", {
	name: "The Aloha Snackbar",
	icon: "alohasnackbar",
	desc: "A tasteful, inoffensive tiki bar sign.",
});
rt.type(1830, "/datum/barsign/thenet", "/datum/barsign", {
	name: "The Net",
	icon: "thenet",
	desc: "You just seem to get caught up in it for hours.",
});
rt.type(1831, "/datum/barsign/maidcafe", "/datum/barsign", {
	name: "Maid Cafe",
	icon: "maidcafe",
	desc: "Welcome back, master!",
});
rt.type(1832, "/datum/barsign/hiddensigns", "/datum/barsign", {
	hidden: 1,
});
rt.type(1833, "/datum/barsign/hiddensigns/empbarsign", "/datum/barsign/hiddensigns", {
	name: "Haywire Barsign",
	icon: "empbarsign",
	desc: "Something has gone very wrong.",
});
rt.type(1834, "/datum/barsign/hiddensigns/syndibarsign", "/datum/barsign/hiddensigns", {
	name: "Syndi Cat Takeover",
	icon: "syndibarsign",
	desc: "Syndicate or die.",
});
rt.type(1835, "/datum/barsign/hiddensigns/signoff", "/datum/barsign/hiddensigns", {
	name: "Bar Sign",
	icon: "empty",
	desc: "This sign doesn't seem to be on.",
});
rt.type(1848, "/datum/gas", "/datum", {
	id: "",
	specific_heat: 0,
	name: "",
	gas_overlay: "",
	moles_visible: null,
	dangerous: 0,
});
rt.type(1849, "/datum/gas/oxygen", "/datum/gas", {
	id: "o2",
	specific_heat: 20,
	name: "Oxygen",
});
rt.type(1850, "/datum/gas/nitrogen", "/datum/gas", {
	id: "n2",
	specific_heat: 20,
	name: "Nitrogen",
});
rt.type(1851, "/datum/gas/carbon_dioxide", "/datum/gas", {
	id: "co2",
	specific_heat: 30,
	name: "Carbon Dioxide",
});
rt.type(1852, "/datum/gas/plasma", "/datum/gas", {
	id: "plasma",
	specific_heat: 200,
	name: "Plasma",
	gas_overlay: "plasma",
	moles_visible: 0.5,
	dangerous: 1,
});
rt.type(1853, "/datum/gas/water_vapor", "/datum/gas", {
	id: "water_vapor",
	specific_heat: 40,
	name: "Water Vapor",
	gas_overlay: "water_vapor",
	moles_visible: 0.5,
});
rt.type(1854, "/datum/gas/freon", "/datum/gas", {
	id: "freon",
	specific_heat: 2000,
	name: "Freon",
	gas_overlay: "freon",
	moles_visible: 0.5,
	dangerous: 1,
});
rt.type(1855, "/datum/gas/nitrous_oxide", "/datum/gas", {
	id: "n2o",
	specific_heat: 40,
	name: "Nitrous Oxide",
	gas_overlay: "nitrous_oxide",
	moles_visible: 1,
	dangerous: 1,
});
rt.type(1856, "/datum/gas/oxygen_agent_b", "/datum/gas", {
	id: "agent_b",
	specific_heat: 300,
	name: "Oxygen Agent B",
});
rt.type(1857, "/datum/gas/volatile_fuel", "/datum/gas", {
	id: "v_fuel",
	specific_heat: 30,
	name: "Volatile Fuel",
});
rt.type(1858, "/datum/gas/bz", "/datum/gas", {
	id: "bz",
	specific_heat: 20,
	name: "BZ",
	dangerous: 1,
});
rt.type(2267, "/datum/asset", "/datum", {});
rt.type(2277, "/datum/client_colour", "/datum", {
	colour: "",
	priority: 1,
});
rt.type(2278, "/datum/client_colour/glass_colour", "/datum/client_colour", {
	priority: 0,
	colour: "red",
});
rt.type(2279, "/datum/client_colour/glass_colour/green", "/datum/client_colour/glass_colour", {
	colour: "#aaffaa",
});
rt.type(2280, "/datum/client_colour/glass_colour/lightgreen", "/datum/client_colour/glass_colour", {
	colour: "#ccffcc",
});
rt.type(2281, "/datum/client_colour/glass_colour/blue", "/datum/client_colour/glass_colour", {
	colour: "#aaaaff",
});
rt.type(2282, "/datum/client_colour/glass_colour/lightblue", "/datum/client_colour/glass_colour", {
	colour: "#ccccff",
});
rt.type(2283, "/datum/client_colour/glass_colour/yellow", "/datum/client_colour/glass_colour", {
	colour: "#ffff66",
});
rt.type(2284, "/datum/client_colour/glass_colour/red", "/datum/client_colour/glass_colour", {
	colour: "#ffaaaa",
});
rt.type(2285, "/datum/client_colour/glass_colour/darkred", "/datum/client_colour/glass_colour", {
	colour: "#bb5555",
});
rt.type(2286, "/datum/client_colour/glass_colour/orange", "/datum/client_colour/glass_colour", {
	colour: "#ffbb99",
});
rt.type(2287, "/datum/client_colour/glass_colour/lightorange", "/datum/client_colour/glass_colour", {
	colour: "#ffddaa",
});
rt.type(2288, "/datum/client_colour/glass_colour/purple", "/datum/client_colour/glass_colour", {
	colour: "#ff99ff",
});
rt.type(2289, "/datum/client_colour/glass_colour/gray", "/datum/client_colour/glass_colour", {
	colour: "#cccccc",
});
rt.type(2290, "/datum/client_colour/cursed_heart_blood", "/datum/client_colour", {
	priority: 100,
	colour: "red",
});
rt.type(2658, "/datum/playingcard", "/datum", {
	name: "playing card",
	card_icon: "card_back",
	suit: null,
	number: null,
});
rt.type(2741, "/datum/seed_pile", "/datum", {
	name: "",
	lifespan: 0,
	endurance: 0,
	maturation: 0,
	production: 0,
	yield: 0,
	potency: 0,
	amount: 0,
});
rt.type(2801, "/datum/borrowbook", "/datum", {
	bookname: null,
	mobname: null,
	getdate: null,
	duedate: null,
});
rt.type(3773, "/datum/sprite_accessory", "/datum", {
	icon: null,
	icon_state: null,
	name: null,
	gender: "neuter",
	gender_specific: null,
	color_src: 1,
	hasinner: null,
	locked: 0,
	dimension_x: 32,
	dimension_y: 32,
	center: 0,
});
rt.type(3774, "/datum/sprite_accessory/hair", "/datum/sprite_accessory", {
	icon: rt.rsc("icons/mob/human_face.dmi"),
});
rt.type(3775, "/datum/sprite_accessory/hair/short", "/datum/sprite_accessory/hair", {
	name: "Short Hair",
	icon_state: "hair_a",
});
rt.type(3776, "/datum/sprite_accessory/hair/shorthair2", "/datum/sprite_accessory/hair", {
	name: "Short Hair 2",
	icon_state: "hair_shorthair2",
});
rt.type(3777, "/datum/sprite_accessory/hair/shorthair3", "/datum/sprite_accessory/hair", {
	name: "Short Hair 3",
	icon_state: "hair_shorthair3",
});
rt.type(3778, "/datum/sprite_accessory/hair/cut", "/datum/sprite_accessory/hair", {
	name: "Cut Hair",
	icon_state: "hair_c",
});
rt.type(3779, "/datum/sprite_accessory/hair/long", "/datum/sprite_accessory/hair", {
	name: "Long Hair 1",
	icon_state: "hair_long",
});
rt.type(3780, "/datum/sprite_accessory/hair/longer", "/datum/sprite_accessory/hair", {
	name: "Long Hair",
	icon_state: "hair_vlong",
});
rt.type(3781, "/datum/sprite_accessory/hair/over_eye", "/datum/sprite_accessory/hair", {
	name: "Over Eye",
	icon_state: "hair_shortovereye",
});
rt.type(3782, "/datum/sprite_accessory/hair/long_over_eye", "/datum/sprite_accessory/hair", {
	name: "Long Over Eye",
	icon_state: "hair_longovereye",
});
rt.type(3783, "/datum/sprite_accessory/hair/longest2", "/datum/sprite_accessory/hair", {
	name: "Very Long Over Eye",
	icon_state: "hair_longest2",
});
rt.type(3784, "/datum/sprite_accessory/hair/longest", "/datum/sprite_accessory/hair", {
	name: "Very Long Hair",
	icon_state: "hair_longest",
});
rt.type(3785, "/datum/sprite_accessory/hair/longfringe", "/datum/sprite_accessory/hair", {
	name: "Long Fringe",
	icon_state: "hair_longfringe",
});
rt.type(3786, "/datum/sprite_accessory/hair/longestalt", "/datum/sprite_accessory/hair", {
	name: "Longer Fringe",
	icon_state: "hair_vlongfringe",
});
rt.type(3787, "/datum/sprite_accessory/hair/gentle", "/datum/sprite_accessory/hair", {
	name: "Gentle",
	icon_state: "hair_gentle",
});
rt.type(3788, "/datum/sprite_accessory/hair/halfbang", "/datum/sprite_accessory/hair", {
	name: "Half-banged Hair",
	icon_state: "hair_halfbang",
});
rt.type(3789, "/datum/sprite_accessory/hair/halfbang2", "/datum/sprite_accessory/hair", {
	name: "Half-banged Hair 2",
	icon_state: "hair_halfbang2",
});
rt.type(3790, "/datum/sprite_accessory/hair/ponytail1", "/datum/sprite_accessory/hair", {
	name: "Ponytail",
	icon_state: "hair_ponytail",
});
rt.type(3791, "/datum/sprite_accessory/hair/ponytail2", "/datum/sprite_accessory/hair", {
	name: "Ponytail 2",
	icon_state: "hair_ponytail2",
});
rt.type(3792, "/datum/sprite_accessory/hair/ponytail3", "/datum/sprite_accessory/hair", {
	name: "Ponytail 3",
	icon_state: "hair_ponytail3",
});
rt.type(3793, "/datum/sprite_accessory/hair/ponytail4", "/datum/sprite_accessory/hair", {
	name: "Ponytail 4",
	icon_state: "hair_ponytail4",
});
rt.type(3794, "/datum/sprite_accessory/hair/ponytail5", "/datum/sprite_accessory/hair", {
	name: "Ponytail 5",
	icon_state: "hair_ponytail5",
});
rt.type(3795, "/datum/sprite_accessory/hair/sidetail", "/datum/sprite_accessory/hair", {
	name: "Side Pony",
	icon_state: "hair_sidetail",
});
rt.type(3796, "/datum/sprite_accessory/hair/sidetail2", "/datum/sprite_accessory/hair", {
	name: "Side Pony 2",
	icon_state: "hair_sidetail2",
});
rt.type(3797, "/datum/sprite_accessory/hair/sidetail3", "/datum/sprite_accessory/hair", {
	name: "Side Pony 3",
	icon_state: "hair_sidetail3",
});
rt.type(3798, "/datum/sprite_accessory/hair/sidetail4", "/datum/sprite_accessory/hair", {
	name: "Side Pony 4",
	icon_state: "hair_sidetail4",
});
rt.type(3799, "/datum/sprite_accessory/hair/oneshoulder", "/datum/sprite_accessory/hair", {
	name: "One Shoulder",
	icon_state: "hair_oneshoulder",
});
rt.type(3800, "/datum/sprite_accessory/hair/tressshoulder", "/datum/sprite_accessory/hair", {
	name: "Tress Shoulder",
	icon_state: "hair_tressshoulder",
});
rt.type(3801, "/datum/sprite_accessory/hair/parted", "/datum/sprite_accessory/hair", {
	name: "Side Part",
	icon_state: "hair_part",
});
rt.type(3802, "/datum/sprite_accessory/hair/pompadour", "/datum/sprite_accessory/hair", {
	name: "Pompadour",
	icon_state: "hair_pompadour",
});
rt.type(3803, "/datum/sprite_accessory/hair/bigpompadour", "/datum/sprite_accessory/hair", {
	name: "Big Pompadour",
	icon_state: "hair_bigpompadour",
});
rt.type(3804, "/datum/sprite_accessory/hair/quiff", "/datum/sprite_accessory/hair", {
	name: "Quiff",
	icon_state: "hair_quiff",
});
rt.type(3805, "/datum/sprite_accessory/hair/bedhead", "/datum/sprite_accessory/hair", {
	name: "Bedhead",
	icon_state: "hair_bedhead",
});
rt.type(3806, "/datum/sprite_accessory/hair/bedhead2", "/datum/sprite_accessory/hair", {
	name: "Bedhead 2",
	icon_state: "hair_bedheadv2",
});
rt.type(3807, "/datum/sprite_accessory/hair/bedhead3", "/datum/sprite_accessory/hair", {
	name: "Bedhead 3",
	icon_state: "hair_bedheadv3",
});
rt.type(3808, "/datum/sprite_accessory/hair/messy", "/datum/sprite_accessory/hair", {
	name: "Messy",
	icon_state: "hair_messy",
});
rt.type(3809, "/datum/sprite_accessory/hair/beehive", "/datum/sprite_accessory/hair", {
	name: "Beehive",
	icon_state: "hair_beehive",
});
rt.type(3810, "/datum/sprite_accessory/hair/beehive2", "/datum/sprite_accessory/hair", {
	name: "Beehive 2",
	icon_state: "hair_beehivev2",
});
rt.type(3811, "/datum/sprite_accessory/hair/bobcurl", "/datum/sprite_accessory/hair", {
	name: "Bobcurl",
	icon_state: "hair_bobcurl",
});
rt.type(3812, "/datum/sprite_accessory/hair/bob", "/datum/sprite_accessory/hair", {
	name: "Bob Hair",
	icon_state: "hair_bob",
});
rt.type(3813, "/datum/sprite_accessory/hair/bowl", "/datum/sprite_accessory/hair", {
	name: "Bowl",
	icon_state: "hair_bowlcut",
});
rt.type(3814, "/datum/sprite_accessory/hair/buzz", "/datum/sprite_accessory/hair", {
	name: "Buzzcut",
	icon_state: "hair_buzzcut",
});
rt.type(3815, "/datum/sprite_accessory/hair/crew", "/datum/sprite_accessory/hair", {
	name: "Crewcut",
	icon_state: "hair_crewcut",
});
rt.type(3816, "/datum/sprite_accessory/hair/combover", "/datum/sprite_accessory/hair", {
	name: "Combover",
	icon_state: "hair_combover",
});
rt.type(3817, "/datum/sprite_accessory/hair/devillock", "/datum/sprite_accessory/hair", {
	name: "Devil Lock",
	icon_state: "hair_devilock",
});
rt.type(3818, "/datum/sprite_accessory/hair/dreadlocks", "/datum/sprite_accessory/hair", {
	name: "Dreadlocks",
	icon_state: "hair_dreads",
});
rt.type(3819, "/datum/sprite_accessory/hair/curls", "/datum/sprite_accessory/hair", {
	name: "Curls",
	icon_state: "hair_curls",
});
rt.type(3820, "/datum/sprite_accessory/hair/afro", "/datum/sprite_accessory/hair", {
	name: "Afro",
	icon_state: "hair_afro",
});
rt.type(3821, "/datum/sprite_accessory/hair/afro2", "/datum/sprite_accessory/hair", {
	name: "Afro 2",
	icon_state: "hair_afro2",
});
rt.type(3822, "/datum/sprite_accessory/hair/afro_large", "/datum/sprite_accessory/hair", {
	name: "Big Afro",
	icon_state: "hair_bigafro",
});
rt.type(3823, "/datum/sprite_accessory/hair/sargeant", "/datum/sprite_accessory/hair", {
	name: "Flat Top",
	icon_state: "hair_sargeant",
});
rt.type(3824, "/datum/sprite_accessory/hair/emo", "/datum/sprite_accessory/hair", {
	name: "Emo",
	icon_state: "hair_emo",
});
rt.type(3825, "/datum/sprite_accessory/hair/longemo", "/datum/sprite_accessory/hair", {
	name: "Long Emo",
	icon_state: "hair_longemo",
});
rt.type(3826, "/datum/sprite_accessory/hair/fag", "/datum/sprite_accessory/hair", {
	name: "Flow Hair",
	icon_state: "hair_f",
});
rt.type(3827, "/datum/sprite_accessory/hair/feather", "/datum/sprite_accessory/hair", {
	name: "Feather",
	icon_state: "hair_feather",
});
rt.type(3828, "/datum/sprite_accessory/hair/hitop", "/datum/sprite_accessory/hair", {
	name: "Hitop",
	icon_state: "hair_hitop",
});
rt.type(3829, "/datum/sprite_accessory/hair/mohawk", "/datum/sprite_accessory/hair", {
	name: "Mohawk",
	icon_state: "hair_d",
});
rt.type(3830, "/datum/sprite_accessory/hair/reversemohawk", "/datum/sprite_accessory/hair", {
	name: "Reverse Mohawk",
	icon_state: "hair_reversemohawk",
});
rt.type(3831, "/datum/sprite_accessory/hair/jensen", "/datum/sprite_accessory/hair", {
	name: "Jensen Hair",
	icon_state: "hair_jensen",
});
rt.type(3832, "/datum/sprite_accessory/hair/gelled", "/datum/sprite_accessory/hair", {
	name: "Gelled Back",
	icon_state: "hair_gelled",
});
rt.type(3833, "/datum/sprite_accessory/hair/spiky", "/datum/sprite_accessory/hair", {
	name: "Spiky",
	icon_state: "hair_spikey",
});
rt.type(3834, "/datum/sprite_accessory/hair/spiky2", "/datum/sprite_accessory/hair", {
	name: "Spiky 2",
	icon_state: "hair_spiky",
});
rt.type(3835, "/datum/sprite_accessory/hair/spiky3", "/datum/sprite_accessory/hair", {
	name: "Spiky 3",
	icon_state: "hair_spiky2",
});
rt.type(3836, "/datum/sprite_accessory/hair/protagonist", "/datum/sprite_accessory/hair", {
	name: "Slightly Long",
	icon_state: "hair_protagonist",
});
rt.type(3837, "/datum/sprite_accessory/hair/kusangi", "/datum/sprite_accessory/hair", {
	name: "Kusanagi Hair",
	icon_state: "hair_kusanagi",
});
rt.type(3838, "/datum/sprite_accessory/hair/kagami", "/datum/sprite_accessory/hair", {
	name: "Pigtails",
	icon_state: "hair_kagami",
});
rt.type(3839, "/datum/sprite_accessory/hair/pigtail", "/datum/sprite_accessory/hair", {
	name: "Pigtails 3",
	icon_state: "hair_pigtails2",
});
rt.type(3840, "/datum/sprite_accessory/hair/himecut", "/datum/sprite_accessory/hair", {
	name: "Hime Cut",
	icon_state: "hair_himecut",
});
rt.type(3841, "/datum/sprite_accessory/hair/himecut2", "/datum/sprite_accessory/hair", {
	name: "Hime Cut 2",
	icon_state: "hair_himecut2",
});
rt.type(3842, "/datum/sprite_accessory/hair/himeup", "/datum/sprite_accessory/hair", {
	name: "Hime Updo",
	icon_state: "hair_himeup",
});
rt.type(3843, "/datum/sprite_accessory/hair/antenna", "/datum/sprite_accessory/hair", {
	name: "Ahoge",
	icon_state: "hair_antenna",
});
rt.type(3844, "/datum/sprite_accessory/hair/front_braid", "/datum/sprite_accessory/hair", {
	name: "Braided front",
	icon_state: "hair_braidfront",
});
rt.type(3845, "/datum/sprite_accessory/hair/lowbraid", "/datum/sprite_accessory/hair", {
	name: "Low Braid",
	icon_state: "hair_hbraid",
});
rt.type(3846, "/datum/sprite_accessory/hair/not_floorlength_braid", "/datum/sprite_accessory/hair", {
	name: "High Braid",
	icon_state: "hair_braid2",
});
rt.type(3847, "/datum/sprite_accessory/hair/shortbraid", "/datum/sprite_accessory/hair", {
	name: "Short Braid",
	icon_state: "hair_shortbraid",
});
rt.type(3848, "/datum/sprite_accessory/hair/braid", "/datum/sprite_accessory/hair", {
	name: "Floorlength Braid",
	icon_state: "hair_braid",
});
rt.type(3849, "/datum/sprite_accessory/hair/odango", "/datum/sprite_accessory/hair", {
	name: "Odango",
	icon_state: "hair_odango",
});
rt.type(3850, "/datum/sprite_accessory/hair/ombre", "/datum/sprite_accessory/hair", {
	name: "Ombre",
	icon_state: "hair_ombre",
});
rt.type(3851, "/datum/sprite_accessory/hair/updo", "/datum/sprite_accessory/hair", {
	name: "Updo",
	icon_state: "hair_updo",
});
rt.type(3852, "/datum/sprite_accessory/hair/skinhead", "/datum/sprite_accessory/hair", {
	name: "Skinhead",
	icon_state: "hair_skinhead",
});
rt.type(3853, "/datum/sprite_accessory/hair/longbangs", "/datum/sprite_accessory/hair", {
	name: "Long Bangs",
	icon_state: "hair_lbangs",
});
rt.type(3854, "/datum/sprite_accessory/hair/balding", "/datum/sprite_accessory/hair", {
	name: "Balding Hair",
	icon_state: "hair_e",
});
rt.type(3855, "/datum/sprite_accessory/hair/bald", "/datum/sprite_accessory/hair", {
	name: "Bald",
	icon_state: null,
});
rt.type(3856, "/datum/sprite_accessory/hair/braided", "/datum/sprite_accessory/hair", {
	name: "Braided",
	icon_state: "hair_braided",
});
rt.type(3857, "/datum/sprite_accessory/hair/bun", "/datum/sprite_accessory/hair", {
	name: "Bun Head",
	icon_state: "hair_bun",
});
rt.type(3858, "/datum/sprite_accessory/hair/bun2", "/datum/sprite_accessory/hair", {
	name: "Bun Head 2",
	icon_state: "hair_bunhead2",
});
rt.type(3859, "/datum/sprite_accessory/hair/braidtail", "/datum/sprite_accessory/hair", {
	name: "Braided Tail",
	icon_state: "hair_braidtail",
});
rt.type(3860, "/datum/sprite_accessory/hair/bigflattop", "/datum/sprite_accessory/hair", {
	name: "Big Flat Top",
	icon_state: "hair_bigflattop",
});
rt.type(3861, "/datum/sprite_accessory/hair/drillhair", "/datum/sprite_accessory/hair", {
	name: "Drill Hair",
	icon_state: "hair_drillhair",
});
rt.type(3862, "/datum/sprite_accessory/hair/keanu", "/datum/sprite_accessory/hair", {
	name: "Keanu Hair",
	icon_state: "hair_keanu",
});
rt.type(3863, "/datum/sprite_accessory/hair/swept", "/datum/sprite_accessory/hair", {
	name: "Swept Back Hair",
	icon_state: "hair_swept",
});
rt.type(3864, "/datum/sprite_accessory/hair/swept2", "/datum/sprite_accessory/hair", {
	name: "Swept Back Hair 2",
	icon_state: "hair_swept2",
});
rt.type(3865, "/datum/sprite_accessory/hair/business", "/datum/sprite_accessory/hair", {
	name: "Business Hair",
	icon_state: "hair_business",
});
rt.type(3866, "/datum/sprite_accessory/hair/business2", "/datum/sprite_accessory/hair", {
	name: "Business Hair 2",
	icon_state: "hair_business2",
});
rt.type(3867, "/datum/sprite_accessory/hair/business3", "/datum/sprite_accessory/hair", {
	name: "Business Hair 3",
	icon_state: "hair_business3",
});
rt.type(3868, "/datum/sprite_accessory/hair/business4", "/datum/sprite_accessory/hair", {
	name: "Business Hair 4",
	icon_state: "hair_business4",
});
rt.type(3869, "/datum/sprite_accessory/hair/hedgehog", "/datum/sprite_accessory/hair", {
	name: "Hedgehog Hair",
	icon_state: "hair_hedgehog",
});
rt.type(3870, "/datum/sprite_accessory/hair/bob2", "/datum/sprite_accessory/hair", {
	name: "Bob Hair 2",
	icon_state: "hair_bob2",
});
rt.type(3871, "/datum/sprite_accessory/hair/boddicker", "/datum/sprite_accessory/hair", {
	name: "Boddicker",
	icon_state: "hair_boddicker",
});
rt.type(3872, "/datum/sprite_accessory/hair/long2", "/datum/sprite_accessory/hair", {
	name: "Long Hair 2",
	icon_state: "hair_long2",
});
rt.type(3873, "/datum/sprite_accessory/hair/pixie", "/datum/sprite_accessory/hair", {
	name: "Pixie Cut",
	icon_state: "hair_pixie",
});
rt.type(3874, "/datum/sprite_accessory/hair/megaeyebrows", "/datum/sprite_accessory/hair", {
	name: "Mega Eyebrows",
	icon_state: "hair_megaeyebrows",
});
rt.type(3875, "/datum/sprite_accessory/hair/highponytail", "/datum/sprite_accessory/hair", {
	name: "High Ponytail",
	icon_state: "hair_highponytail",
});
rt.type(3876, "/datum/sprite_accessory/hair/longponytail", "/datum/sprite_accessory/hair", {
	name: "Long Ponytail",
	icon_state: "hair_longstraightponytail",
});
rt.type(3877, "/datum/sprite_accessory/hair/sidepartlongalt", "/datum/sprite_accessory/hair", {
	name: "Long Side Part",
	icon_state: "hair_longsidepart",
});
rt.type(3878, "/datum/sprite_accessory/hair/sidecut", "/datum/sprite_accessory/hair", {
	name: "Sidecut",
	icon_state: "hair_sidecut",
});
rt.type(3879, "/datum/sprite_accessory/facial_hair", "/datum/sprite_accessory", {
	icon: rt.rsc("icons/mob/human_face.dmi"),
	gender: "male",
});
rt.type(3880, "/datum/sprite_accessory/facial_hair/shaved", "/datum/sprite_accessory/facial_hair", {
	name: "Shaved",
	icon_state: null,
	gender: "neuter",
});
rt.type(3881, "/datum/sprite_accessory/facial_hair/watson", "/datum/sprite_accessory/facial_hair", {
	name: "Watson Mustache",
	icon_state: "facial_watson",
});
rt.type(3882, "/datum/sprite_accessory/facial_hair/hogan", "/datum/sprite_accessory/facial_hair", {
	name: "Hulk Hogan Mustache",
	icon_state: "facial_hogan",
});
rt.type(3883, "/datum/sprite_accessory/facial_hair/vandyke", "/datum/sprite_accessory/facial_hair", {
	name: "Van Dyke Mustache",
	icon_state: "facial_vandyke",
});
rt.type(3884, "/datum/sprite_accessory/facial_hair/chaplin", "/datum/sprite_accessory/facial_hair", {
	name: "Square Mustache",
	icon_state: "facial_chaplin",
});
rt.type(3885, "/datum/sprite_accessory/facial_hair/selleck", "/datum/sprite_accessory/facial_hair", {
	name: "Selleck Mustache",
	icon_state: "facial_selleck",
});
rt.type(3886, "/datum/sprite_accessory/facial_hair/neckbeard", "/datum/sprite_accessory/facial_hair", {
	name: "Neckbeard",
	icon_state: "facial_neckbeard",
});
rt.type(3887, "/datum/sprite_accessory/facial_hair/fullbeard", "/datum/sprite_accessory/facial_hair", {
	name: "Full Beard",
	icon_state: "facial_fullbeard",
});
rt.type(3888, "/datum/sprite_accessory/facial_hair/longbeard", "/datum/sprite_accessory/facial_hair", {
	name: "Long Beard",
	icon_state: "facial_longbeard",
});
rt.type(3889, "/datum/sprite_accessory/facial_hair/vlongbeard", "/datum/sprite_accessory/facial_hair", {
	name: "Very Long Beard",
	icon_state: "facial_wise",
});
rt.type(3890, "/datum/sprite_accessory/facial_hair/elvis", "/datum/sprite_accessory/facial_hair", {
	name: "Elvis Sideburns",
	icon_state: "facial_elvis",
});
rt.type(3891, "/datum/sprite_accessory/facial_hair/abe", "/datum/sprite_accessory/facial_hair", {
	name: "Abraham Lincoln Beard",
	icon_state: "facial_abe",
});
rt.type(3892, "/datum/sprite_accessory/facial_hair/chinstrap", "/datum/sprite_accessory/facial_hair", {
	name: "Chinstrap",
	icon_state: "facial_chin",
});
rt.type(3893, "/datum/sprite_accessory/facial_hair/hip", "/datum/sprite_accessory/facial_hair", {
	name: "Hipster Beard",
	icon_state: "facial_hip",
});
rt.type(3894, "/datum/sprite_accessory/facial_hair/gt", "/datum/sprite_accessory/facial_hair", {
	name: "Goatee",
	icon_state: "facial_gt",
});
rt.type(3895, "/datum/sprite_accessory/facial_hair/jensen", "/datum/sprite_accessory/facial_hair", {
	name: "Jensen Beard",
	icon_state: "facial_jensen",
});
rt.type(3896, "/datum/sprite_accessory/facial_hair/dwarf", "/datum/sprite_accessory/facial_hair", {
	name: "Dwarf Beard",
	icon_state: "facial_dwarf",
});
rt.type(3897, "/datum/sprite_accessory/facial_hair/fiveoclock", "/datum/sprite_accessory/facial_hair", {
	name: "Five o Clock Shadow",
	icon_state: "facial_fiveoclock",
});
rt.type(3898, "/datum/sprite_accessory/facial_hair/fu", "/datum/sprite_accessory/facial_hair", {
	name: "Fu Manchu",
	icon_state: "facial_fumanchu",
});
rt.type(3899, "/datum/sprite_accessory/facial_hair/brokenman", "/datum/sprite_accessory/facial_hair", {
	name: "Broken Man",
	icon_state: "facial_brokenman",
});
rt.type(3900, "/datum/sprite_accessory/underwear", "/datum/sprite_accessory", {
	icon: rt.rsc("icons/mob/underwear.dmi"),
});
rt.type(3901, "/datum/sprite_accessory/underwear/nude", "/datum/sprite_accessory/underwear", {
	name: "Nude",
	icon_state: null,
	gender: "neuter",
});
rt.type(3902, "/datum/sprite_accessory/underwear/male_white", "/datum/sprite_accessory/underwear", {
	name: "Mens White",
	icon_state: "male_white",
	gender: "male",
});
rt.type(3903, "/datum/sprite_accessory/underwear/male_grey", "/datum/sprite_accessory/underwear", {
	name: "Mens Grey",
	icon_state: "male_grey",
	gender: "male",
});
rt.type(3904, "/datum/sprite_accessory/underwear/male_green", "/datum/sprite_accessory/underwear", {
	name: "Mens Green",
	icon_state: "male_green",
	gender: "male",
});
rt.type(3905, "/datum/sprite_accessory/underwear/male_blue", "/datum/sprite_accessory/underwear", {
	name: "Mens Blue",
	icon_state: "male_blue",
	gender: "male",
});
rt.type(3906, "/datum/sprite_accessory/underwear/male_black", "/datum/sprite_accessory/underwear", {
	name: "Mens Black",
	icon_state: "male_black",
	gender: "male",
});
rt.type(3907, "/datum/sprite_accessory/underwear/male_mankini", "/datum/sprite_accessory/underwear", {
	name: "Mankini",
	icon_state: "male_mankini",
	gender: "male",
});
rt.type(3908, "/datum/sprite_accessory/underwear/male_hearts", "/datum/sprite_accessory/underwear", {
	name: "Mens Hearts Boxer",
	icon_state: "male_hearts",
	gender: "male",
});
rt.type(3909, "/datum/sprite_accessory/underwear/male_blackalt", "/datum/sprite_accessory/underwear", {
	name: "Mens Black Boxer",
	icon_state: "male_blackalt",
	gender: "male",
});
rt.type(3910, "/datum/sprite_accessory/underwear/male_greyalt", "/datum/sprite_accessory/underwear", {
	name: "Mens Grey Boxer",
	icon_state: "male_greyalt",
	gender: "male",
});
rt.type(3911, "/datum/sprite_accessory/underwear/male_stripe", "/datum/sprite_accessory/underwear", {
	name: "Mens Striped Boxer",
	icon_state: "male_stripe",
	gender: "male",
});
rt.type(3912, "/datum/sprite_accessory/underwear/male_commie", "/datum/sprite_accessory/underwear", {
	name: "Mens Striped Commie Boxer",
	icon_state: "male_commie",
	gender: "male",
});
rt.type(3913, "/datum/sprite_accessory/underwear/male_uk", "/datum/sprite_accessory/underwear", {
	name: "Mens Striped UK Boxer",
	icon_state: "male_uk",
	gender: "male",
});
rt.type(3914, "/datum/sprite_accessory/underwear/male_usastripe", "/datum/sprite_accessory/underwear", {
	name: "Mens Striped Freedom Boxer",
	icon_state: "male_assblastusa",
	gender: "male",
});
rt.type(3915, "/datum/sprite_accessory/underwear/male_kinky", "/datum/sprite_accessory/underwear", {
	name: "Mens Kinky",
	icon_state: "male_kinky",
	gender: "male",
});
rt.type(3916, "/datum/sprite_accessory/underwear/male_red", "/datum/sprite_accessory/underwear", {
	name: "Mens Red",
	icon_state: "male_red",
	gender: "male",
});
rt.type(3917, "/datum/sprite_accessory/underwear/female_red", "/datum/sprite_accessory/underwear", {
	name: "Ladies Red",
	icon_state: "female_red",
	gender: "female",
});
rt.type(3918, "/datum/sprite_accessory/underwear/female_white", "/datum/sprite_accessory/underwear", {
	name: "Ladies White",
	icon_state: "female_white",
	gender: "female",
});
rt.type(3919, "/datum/sprite_accessory/underwear/female_yellow", "/datum/sprite_accessory/underwear", {
	name: "Ladies Yellow",
	icon_state: "female_yellow",
	gender: "female",
});
rt.type(3920, "/datum/sprite_accessory/underwear/female_blue", "/datum/sprite_accessory/underwear", {
	name: "Ladies Blue",
	icon_state: "female_blue",
	gender: "female",
});
rt.type(3921, "/datum/sprite_accessory/underwear/female_black", "/datum/sprite_accessory/underwear", {
	name: "Ladies Black",
	icon_state: "female_black",
	gender: "female",
});
rt.type(3922, "/datum/sprite_accessory/underwear/female_thong", "/datum/sprite_accessory/underwear", {
	name: "Ladies Thong",
	icon_state: "female_thong",
	gender: "female",
});
rt.type(3923, "/datum/sprite_accessory/underwear/female_babydoll", "/datum/sprite_accessory/underwear", {
	name: "Babydoll",
	icon_state: "female_babydoll",
	gender: "female",
});
rt.type(3924, "/datum/sprite_accessory/underwear/female_babyblue", "/datum/sprite_accessory/underwear", {
	name: "Ladies Baby-Blue",
	icon_state: "female_babyblue",
	gender: "female",
});
rt.type(3925, "/datum/sprite_accessory/underwear/female_green", "/datum/sprite_accessory/underwear", {
	name: "Ladies Green",
	icon_state: "female_green",
	gender: "female",
});
rt.type(3926, "/datum/sprite_accessory/underwear/female_pink", "/datum/sprite_accessory/underwear", {
	name: "Ladies Pink",
	icon_state: "female_pink",
	gender: "female",
});
rt.type(3927, "/datum/sprite_accessory/underwear/female_kinky", "/datum/sprite_accessory/underwear", {
	name: "Ladies Kinky",
	icon_state: "female_kinky",
	gender: "female",
});
rt.type(3928, "/datum/sprite_accessory/underwear/female_whitealt", "/datum/sprite_accessory/underwear", {
	name: "Ladies White Sport",
	icon_state: "female_whitealt",
	gender: "female",
});
rt.type(3929, "/datum/sprite_accessory/underwear/female_blackalt", "/datum/sprite_accessory/underwear", {
	name: "Ladies Black Sport",
	icon_state: "female_blackalt",
	gender: "female",
});
rt.type(3930, "/datum/sprite_accessory/underwear/female_white_neko", "/datum/sprite_accessory/underwear", {
	name: "Ladies White Neko",
	icon_state: "female_neko_white",
	gender: "female",
});
rt.type(3931, "/datum/sprite_accessory/underwear/female_black_neko", "/datum/sprite_accessory/underwear", {
	name: "Ladies Black Neko",
	icon_state: "female_neko_black",
	gender: "female",
});
rt.type(3932, "/datum/sprite_accessory/underwear/female_usastripe", "/datum/sprite_accessory/underwear", {
	name: "Ladies Freedom",
	icon_state: "female_assblastusa",
	gender: "female",
});
rt.type(3933, "/datum/sprite_accessory/underwear/female_uk", "/datum/sprite_accessory/underwear", {
	name: "Ladies UK",
	icon_state: "female_uk",
	gender: "female",
});
rt.type(3934, "/datum/sprite_accessory/underwear/female_commie", "/datum/sprite_accessory/underwear", {
	name: "Ladies Commie",
	icon_state: "female_commie",
	gender: "female",
});
rt.type(3935, "/datum/sprite_accessory/undershirt", "/datum/sprite_accessory", {
	icon: rt.rsc("icons/mob/underwear.dmi"),
});
rt.type(3936, "/datum/sprite_accessory/undershirt/nude", "/datum/sprite_accessory/undershirt", {
	name: "Nude",
	icon_state: null,
	gender: "neuter",
});
rt.type(3937, "/datum/sprite_accessory/undershirt/shirt_white", "/datum/sprite_accessory/undershirt", {
	name: "White Shirt",
	icon_state: "shirt_white",
	gender: "neuter",
});
rt.type(3938, "/datum/sprite_accessory/undershirt/shirt_black", "/datum/sprite_accessory/undershirt", {
	name: "Black Shirt",
	icon_state: "shirt_black",
	gender: "neuter",
});
rt.type(3939, "/datum/sprite_accessory/undershirt/shirt_grey", "/datum/sprite_accessory/undershirt", {
	name: "Grey Shirt",
	icon_state: "shirt_grey",
	gender: "neuter",
});
rt.type(3940, "/datum/sprite_accessory/undershirt/tank_white", "/datum/sprite_accessory/undershirt", {
	name: "White Tank Top",
	icon_state: "tank_white",
	gender: "neuter",
});
rt.type(3941, "/datum/sprite_accessory/undershirt/tank_black", "/datum/sprite_accessory/undershirt", {
	name: "Black Tank Top",
	icon_state: "tank_black",
	gender: "neuter",
});
rt.type(3942, "/datum/sprite_accessory/undershirt/tank_grey", "/datum/sprite_accessory/undershirt", {
	name: "Grey Tank Top",
	icon_state: "tank_grey",
	gender: "neuter",
});
rt.type(3943, "/datum/sprite_accessory/undershirt/female_midriff", "/datum/sprite_accessory/undershirt", {
	name: "Midriff Tank Top",
	icon_state: "tank_midriff",
	gender: "female",
});
rt.type(3944, "/datum/sprite_accessory/undershirt/lover", "/datum/sprite_accessory/undershirt", {
	name: "Lover Shirt",
	icon_state: "lover",
	gender: "neuter",
});
rt.type(3945, "/datum/sprite_accessory/undershirt/ian", "/datum/sprite_accessory/undershirt", {
	name: "Blue Ian Shirt",
	icon_state: "ian",
	gender: "neuter",
});
rt.type(3946, "/datum/sprite_accessory/undershirt/uk", "/datum/sprite_accessory/undershirt", {
	name: "UK Shirt",
	icon_state: "uk",
	gender: "neuter",
});
rt.type(3947, "/datum/sprite_accessory/undershirt/usa", "/datum/sprite_accessory/undershirt", {
	name: "USA Shirt",
	icon_state: "shirt_assblastusa",
	gender: "neuter",
});
rt.type(3948, "/datum/sprite_accessory/undershirt/ilovent", "/datum/sprite_accessory/undershirt", {
	name: "I Love NT Shirt",
	icon_state: "ilovent",
	gender: "neuter",
});
rt.type(3949, "/datum/sprite_accessory/undershirt/peace", "/datum/sprite_accessory/undershirt", {
	name: "Peace Shirt",
	icon_state: "peace",
	gender: "neuter",
});
rt.type(3950, "/datum/sprite_accessory/undershirt/mondmondjaja", "/datum/sprite_accessory/undershirt", {
	name: "Band Shirt",
	icon_state: "band",
	gender: "neuter",
});
rt.type(3951, "/datum/sprite_accessory/undershirt/pacman", "/datum/sprite_accessory/undershirt", {
	name: "Pogoman Shirt",
	icon_state: "pogoman",
	gender: "neuter",
});
rt.type(3952, "/datum/sprite_accessory/undershirt/matroska", "/datum/sprite_accessory/undershirt", {
	name: "Matroska Shirt",
	icon_state: "matroska",
	gender: "neuter",
});
rt.type(3953, "/datum/sprite_accessory/undershirt/whiteshortsleeve", "/datum/sprite_accessory/undershirt", {
	name: "White Short-sleeved Shirt",
	icon_state: "whiteshortsleeve",
	gender: "neuter",
});
rt.type(3954, "/datum/sprite_accessory/undershirt/purpleshortsleeve", "/datum/sprite_accessory/undershirt", {
	name: "Purple Short-sleeved Shirt",
	icon_state: "purpleshortsleeve",
	gender: "neuter",
});
rt.type(3955, "/datum/sprite_accessory/undershirt/blueshortsleeve", "/datum/sprite_accessory/undershirt", {
	name: "Blue Short-sleeved Shirt",
	icon_state: "blueshortsleeve",
	gender: "neuter",
});
rt.type(3956, "/datum/sprite_accessory/undershirt/greenshortsleeve", "/datum/sprite_accessory/undershirt", {
	name: "Green Short-sleeved Shirt",
	icon_state: "greenshortsleeve",
	gender: "neuter",
});
rt.type(3957, "/datum/sprite_accessory/undershirt/blackshortsleeve", "/datum/sprite_accessory/undershirt", {
	name: "Black Short-sleeved Shirt",
	icon_state: "blackshortsleeve",
	gender: "neuter",
});
rt.type(3958, "/datum/sprite_accessory/undershirt/blueshirt", "/datum/sprite_accessory/undershirt", {
	name: "Blue Shirt",
	icon_state: "shirt_blue",
	gender: "neuter",
});
rt.type(3959, "/datum/sprite_accessory/undershirt/redshirt", "/datum/sprite_accessory/undershirt", {
	name: "Red Shirt",
	icon_state: "shirt_red",
	gender: "neuter",
});
rt.type(3960, "/datum/sprite_accessory/undershirt/yellowshirt", "/datum/sprite_accessory/undershirt", {
	name: "Yellow T-Shirt",
	icon_state: "yellowshirt",
	gender: "neuter",
});
rt.type(3961, "/datum/sprite_accessory/undershirt/greenshirt", "/datum/sprite_accessory/undershirt", {
	name: "Green Shirt",
	icon_state: "shirt_green",
	gender: "neuter",
});
rt.type(3962, "/datum/sprite_accessory/undershirt/bluepolo", "/datum/sprite_accessory/undershirt", {
	name: "Blue Polo Shirt",
	icon_state: "bluepolo",
	gender: "neuter",
});
rt.type(3963, "/datum/sprite_accessory/undershirt/redpolo", "/datum/sprite_accessory/undershirt", {
	name: "Red Polo Shirt",
	icon_state: "redpolo",
	gender: "neuter",
});
rt.type(3964, "/datum/sprite_accessory/undershirt/whitepolo", "/datum/sprite_accessory/undershirt", {
	name: "White Polo Shirt",
	icon_state: "whitepolo",
	gender: "neuter",
});
rt.type(3965, "/datum/sprite_accessory/undershirt/grayyellowpolo", "/datum/sprite_accessory/undershirt", {
	name: "Gray-Yellow Polo Shirt",
	icon_state: "grayyellowpolo",
	gender: "neuter",
});
rt.type(3966, "/datum/sprite_accessory/undershirt/redtop", "/datum/sprite_accessory/undershirt", {
	name: "Red Top",
	icon_state: "redtop",
	gender: "female",
});
rt.type(3967, "/datum/sprite_accessory/undershirt/whitetop", "/datum/sprite_accessory/undershirt", {
	name: "White Top",
	icon_state: "whitetop",
	gender: "female",
});
rt.type(3968, "/datum/sprite_accessory/undershirt/greenshirtsport", "/datum/sprite_accessory/undershirt", {
	name: "Green Sports Shirt",
	icon_state: "greenshirtsport",
	gender: "neuter",
});
rt.type(3969, "/datum/sprite_accessory/undershirt/redshirtsport", "/datum/sprite_accessory/undershirt", {
	name: "Red Sports Shirt",
	icon_state: "redshirtsport",
	gender: "neuter",
});
rt.type(3970, "/datum/sprite_accessory/undershirt/blueshirtsport", "/datum/sprite_accessory/undershirt", {
	name: "Blue Sports Shirt",
	icon_state: "blueshirtsport",
	gender: "neuter",
});
rt.type(3971, "/datum/sprite_accessory/undershirt/ss13", "/datum/sprite_accessory/undershirt", {
	name: "SS13 Shirt",
	icon_state: "shirt_ss13",
	gender: "neuter",
});
rt.type(3972, "/datum/sprite_accessory/undershirt/tankfire", "/datum/sprite_accessory/undershirt", {
	name: "Fire Tank Top",
	icon_state: "tank_fire",
	gender: "neuter",
});
rt.type(3973, "/datum/sprite_accessory/undershirt/question", "/datum/sprite_accessory/undershirt", {
	name: "Question Shirt",
	icon_state: "shirt_question",
	gender: "neuter",
});
rt.type(3974, "/datum/sprite_accessory/undershirt/skull", "/datum/sprite_accessory/undershirt", {
	name: "Skull Shirt",
	icon_state: "shirt_skull",
	gender: "neuter",
});
rt.type(3975, "/datum/sprite_accessory/undershirt/commie", "/datum/sprite_accessory/undershirt", {
	name: "Commie Shirt",
	icon_state: "shirt_commie",
	gender: "neuter",
});
rt.type(3976, "/datum/sprite_accessory/undershirt/nano", "/datum/sprite_accessory/undershirt", {
	name: "Nanotrasen Shirt",
	icon_state: "shirt_nano",
	gender: "neuter",
});
rt.type(3977, "/datum/sprite_accessory/undershirt/stripe", "/datum/sprite_accessory/undershirt", {
	name: "Striped Shirt",
	icon_state: "shirt_stripes",
	gender: "neuter",
});
rt.type(3978, "/datum/sprite_accessory/undershirt/tank_red", "/datum/sprite_accessory/undershirt", {
	name: "Red Tank Top",
	icon_state: "tank_red",
	gender: "neuter",
});
rt.type(3979, "/datum/sprite_accessory/undershirt/meat", "/datum/sprite_accessory/undershirt", {
	name: "Meat Shirt",
	icon_state: "shirt_meat",
	gender: "neuter",
});
rt.type(3980, "/datum/sprite_accessory/undershirt/tiedye", "/datum/sprite_accessory/undershirt", {
	name: "Tie-dye Shirt",
	icon_state: "shirt_tiedye",
	gender: "neuter",
});
rt.type(3981, "/datum/sprite_accessory/undershirt/redjersey", "/datum/sprite_accessory/undershirt", {
	name: "Red Jersey",
	icon_state: "shirt_redjersey",
	gender: "neuter",
});
rt.type(3982, "/datum/sprite_accessory/undershirt/bluejersey", "/datum/sprite_accessory/undershirt", {
	name: "Blue Jersey",
	icon_state: "shirt_bluejersey",
	gender: "neuter",
});
rt.type(3983, "/datum/sprite_accessory/undershirt/tankstripe", "/datum/sprite_accessory/undershirt", {
	name: "Striped Tank Top",
	icon_state: "tank_stripes",
	gender: "neuter",
});
rt.type(3984, "/datum/sprite_accessory/undershirt/clownshirt", "/datum/sprite_accessory/undershirt", {
	name: "Clown Shirt",
	icon_state: "shirt_clown",
	gender: "neuter",
});
rt.type(3985, "/datum/sprite_accessory/undershirt/alienshirt", "/datum/sprite_accessory/undershirt", {
	name: "Alien Shirt",
	icon_state: "shirt_alien",
	gender: "neuter",
});
rt.type(3986, "/datum/sprite_accessory/socks", "/datum/sprite_accessory", {
	icon: rt.rsc("icons/mob/underwear.dmi"),
});
rt.type(3987, "/datum/sprite_accessory/socks/nude", "/datum/sprite_accessory/socks", {
	name: "Nude",
	icon_state: null,
});
rt.type(3988, "/datum/sprite_accessory/socks/white_norm", "/datum/sprite_accessory/socks", {
	name: "Normal White",
	icon_state: "white_norm",
});
rt.type(3989, "/datum/sprite_accessory/socks/black_norm", "/datum/sprite_accessory/socks", {
	name: "Normal Black",
	icon_state: "black_norm",
});
rt.type(3990, "/datum/sprite_accessory/socks/white_short", "/datum/sprite_accessory/socks", {
	name: "Short White",
	icon_state: "white_short",
});
rt.type(3991, "/datum/sprite_accessory/socks/black_short", "/datum/sprite_accessory/socks", {
	name: "Short Black",
	icon_state: "black_short",
});
rt.type(3992, "/datum/sprite_accessory/socks/white_knee", "/datum/sprite_accessory/socks", {
	name: "Knee-high White",
	icon_state: "white_knee",
});
rt.type(3993, "/datum/sprite_accessory/socks/black_knee", "/datum/sprite_accessory/socks", {
	name: "Knee-high Black",
	icon_state: "black_knee",
});
rt.type(3994, "/datum/sprite_accessory/socks/thin_knee", "/datum/sprite_accessory/socks", {
	name: "Knee-high Thin",
	icon_state: "thin_knee",
});
rt.type(3995, "/datum/sprite_accessory/socks/striped_knee", "/datum/sprite_accessory/socks", {
	name: "Knee-high Striped",
	icon_state: "striped_knee",
});
rt.type(3996, "/datum/sprite_accessory/socks/rainbow_knee", "/datum/sprite_accessory/socks", {
	name: "Knee-high Rainbow",
	icon_state: "rainbow_knee",
});
rt.type(3997, "/datum/sprite_accessory/socks/white_thigh", "/datum/sprite_accessory/socks", {
	name: "Thigh-high White",
	icon_state: "white_thigh",
});
rt.type(3998, "/datum/sprite_accessory/socks/black_thigh", "/datum/sprite_accessory/socks", {
	name: "Thigh-high Black",
	icon_state: "black_thigh",
});
rt.type(3999, "/datum/sprite_accessory/socks/thin_thigh", "/datum/sprite_accessory/socks", {
	name: "Thigh-high Thin",
	icon_state: "thin_thigh",
});
rt.type(4000, "/datum/sprite_accessory/socks/striped_thigh", "/datum/sprite_accessory/socks", {
	name: "Thigh-high Striped",
	icon_state: "striped_thigh",
});
rt.type(4001, "/datum/sprite_accessory/socks/rainbow_thigh", "/datum/sprite_accessory/socks", {
	name: "Thigh-high Rainbow",
	icon_state: "rainbow_thigh",
});
rt.type(4002, "/datum/sprite_accessory/socks/usa_knee", "/datum/sprite_accessory/socks", {
	name: "Knee-High Freedom Stripes",
	icon_state: "assblastusa_knee",
});
rt.type(4003, "/datum/sprite_accessory/socks/usa_thigh", "/datum/sprite_accessory/socks", {
	name: "Thigh-high Freedom Stripes",
	icon_state: "assblastusa_thigh",
});
rt.type(4004, "/datum/sprite_accessory/socks/uk_knee", "/datum/sprite_accessory/socks", {
	name: "Knee-High UK Stripes",
	icon_state: "uk_knee",
});
rt.type(4005, "/datum/sprite_accessory/socks/uk_thigh", "/datum/sprite_accessory/socks", {
	name: "Thigh-high UK Stripes",
	icon_state: "uk_thigh",
});
rt.type(4006, "/datum/sprite_accessory/socks/commie_knee", "/datum/sprite_accessory/socks", {
	name: "Knee-High Commie Stripes",
	icon_state: "commie_knee",
});
rt.type(4007, "/datum/sprite_accessory/socks/commie_thigh", "/datum/sprite_accessory/socks", {
	name: "Thigh-high Commie Stripes",
	icon_state: "commie_thigh",
});
rt.type(4008, "/datum/sprite_accessory/socks/pantyhose", "/datum/sprite_accessory/socks", {
	name: "Pantyhose",
	icon_state: "pantyhose",
});
rt.type(4009, "/datum/sprite_accessory/body_markings", "/datum/sprite_accessory", {
	icon: rt.rsc("icons/mob/mutant_bodyparts.dmi"),
});
rt.type(4010, "/datum/sprite_accessory/body_markings/none", "/datum/sprite_accessory/body_markings", {
	name: "None",
	icon_state: "none",
});
rt.type(4011, "/datum/sprite_accessory/body_markings/dtiger", "/datum/sprite_accessory/body_markings", {
	name: "Dark Tiger Body",
	icon_state: "dtiger",
	gender_specific: 1,
});
rt.type(4012, "/datum/sprite_accessory/body_markings/ltiger", "/datum/sprite_accessory/body_markings", {
	name: "Light Tiger Body",
	icon_state: "ltiger",
	gender_specific: 1,
});
rt.type(4013, "/datum/sprite_accessory/body_markings/lbelly", "/datum/sprite_accessory/body_markings", {
	name: "Light Belly",
	icon_state: "lbelly",
	gender_specific: 1,
});
rt.type(4014, "/datum/sprite_accessory/tails", "/datum/sprite_accessory", {
	icon: rt.rsc("icons/mob/mutant_bodyparts.dmi"),
});
rt.type(4015, "/datum/sprite_accessory/tails/lizard", "/datum/sprite_accessory/tails", {});
rt.type(4016, "/datum/sprite_accessory/tails/lizard/smooth", "/datum/sprite_accessory/tails/lizard", {
	name: "Smooth",
	icon_state: "smooth",
});
rt.type(4017, "/datum/sprite_accessory/tails/lizard/dtiger", "/datum/sprite_accessory/tails/lizard", {
	name: "Dark Tiger",
	icon_state: "dtiger",
});
rt.type(4018, "/datum/sprite_accessory/tails/lizard/ltiger", "/datum/sprite_accessory/tails/lizard", {
	name: "Light Tiger",
	icon_state: "ltiger",
});
rt.type(4019, "/datum/sprite_accessory/tails/lizard/spikes", "/datum/sprite_accessory/tails/lizard", {
	name: "Spikes",
	icon_state: "spikes",
});
rt.type(4020, "/datum/sprite_accessory/tails/human", "/datum/sprite_accessory/tails", {});
rt.type(4021, "/datum/sprite_accessory/tails/human/none", "/datum/sprite_accessory/tails/human", {
	name: "None",
	icon_state: "none",
});
rt.type(4022, "/datum/sprite_accessory/tails/human/cat", "/datum/sprite_accessory/tails/human", {
	name: "Cat",
	icon_state: "cat",
	color_src: 2,
});
rt.type(4023, "/datum/sprite_accessory/tails_animated", "/datum/sprite_accessory", {
	icon: rt.rsc("icons/mob/mutant_bodyparts.dmi"),
});
rt.type(4024, "/datum/sprite_accessory/tails_animated/lizard", "/datum/sprite_accessory/tails_animated", {});
rt.type(4025, "/datum/sprite_accessory/tails_animated/lizard/smooth", "/datum/sprite_accessory/tails_animated/lizard", {
	name: "Smooth",
	icon_state: "smooth",
});
rt.type(4026, "/datum/sprite_accessory/tails_animated/lizard/dtiger", "/datum/sprite_accessory/tails_animated/lizard", {
	name: "Dark Tiger",
	icon_state: "dtiger",
});
rt.type(4027, "/datum/sprite_accessory/tails_animated/lizard/ltiger", "/datum/sprite_accessory/tails_animated/lizard", {
	name: "Light Tiger",
	icon_state: "ltiger",
});
rt.type(4028, "/datum/sprite_accessory/tails_animated/lizard/spikes", "/datum/sprite_accessory/tails_animated/lizard", {
	name: "Spikes",
	icon_state: "spikes",
});
rt.type(4029, "/datum/sprite_accessory/tails_animated/human", "/datum/sprite_accessory/tails_animated", {});
rt.type(4030, "/datum/sprite_accessory/tails_animated/human/none", "/datum/sprite_accessory/tails_animated/human", {
	name: "None",
	icon_state: "none",
});
rt.type(4031, "/datum/sprite_accessory/tails_animated/human/cat", "/datum/sprite_accessory/tails_animated/human", {
	name: "Cat",
	icon_state: "cat",
	color_src: 2,
});
rt.type(4032, "/datum/sprite_accessory/snouts", "/datum/sprite_accessory", {
	icon: rt.rsc("icons/mob/mutant_bodyparts.dmi"),
});
rt.type(4033, "/datum/sprite_accessory/snouts/sharp", "/datum/sprite_accessory/snouts", {
	name: "Sharp",
	icon_state: "sharp",
});
rt.type(4034, "/datum/sprite_accessory/snouts/round", "/datum/sprite_accessory/snouts", {
	name: "Round",
	icon_state: "round",
});
rt.type(4035, "/datum/sprite_accessory/snouts/sharplight", "/datum/sprite_accessory/snouts", {
	name: "Sharp + Light",
	icon_state: "sharplight",
});
rt.type(4036, "/datum/sprite_accessory/snouts/roundlight", "/datum/sprite_accessory/snouts", {
	name: "Round + Light",
	icon_state: "roundlight",
});
rt.type(4037, "/datum/sprite_accessory/horns", "/datum/sprite_accessory", {
	icon: rt.rsc("icons/mob/mutant_bodyparts.dmi"),
});
rt.type(4038, "/datum/sprite_accessory/horns/none", "/datum/sprite_accessory/horns", {
	name: "None",
	icon_state: "none",
});
rt.type(4039, "/datum/sprite_accessory/horns/simple", "/datum/sprite_accessory/horns", {
	name: "Simple",
	icon_state: "simple",
});
rt.type(4040, "/datum/sprite_accessory/horns/short", "/datum/sprite_accessory/horns", {
	name: "Short",
	icon_state: "short",
});
rt.type(4041, "/datum/sprite_accessory/horns/curled", "/datum/sprite_accessory/horns", {
	name: "Curled",
	icon_state: "curled",
});
rt.type(4042, "/datum/sprite_accessory/horns/ram", "/datum/sprite_accessory/horns", {
	name: "Ram",
	icon_state: "ram",
});
rt.type(4043, "/datum/sprite_accessory/horns/angler", "/datum/sprite_accessory/horns", {
	name: "Angeler",
	icon_state: "angler",
});
rt.type(4044, "/datum/sprite_accessory/ears", "/datum/sprite_accessory", {
	icon: rt.rsc("icons/mob/mutant_bodyparts.dmi"),
});
rt.type(4045, "/datum/sprite_accessory/ears/none", "/datum/sprite_accessory/ears", {
	name: "None",
	icon_state: "none",
});
rt.type(4046, "/datum/sprite_accessory/ears/cat", "/datum/sprite_accessory/ears", {
	name: "Cat",
	icon_state: "cat",
	hasinner: 1,
	color_src: 2,
});
rt.type(4047, "/datum/sprite_accessory/wings", "/datum/sprite_accessory", {
	icon: rt.rsc("icons/mob/wings.dmi"),
});
rt.type(4048, "/datum/sprite_accessory/wings/none", "/datum/sprite_accessory/wings", {
	name: "None",
	icon_state: "none",
});
rt.type(4049, "/datum/sprite_accessory/wings/angel", "/datum/sprite_accessory/wings", {
	name: "Angel",
	icon_state: "angel",
	color_src: 0,
	dimension_x: 46,
	center: 1,
	dimension_y: 34,
	locked: 1,
});
rt.type(4050, "/datum/sprite_accessory/wings_open", "/datum/sprite_accessory", {
	icon: rt.rsc("icons/mob/wings.dmi"),
});
rt.type(4051, "/datum/sprite_accessory/wings_open/angel", "/datum/sprite_accessory/wings_open", {
	name: "Angel",
	icon_state: "angel",
	color_src: 0,
	dimension_x: 46,
	center: 1,
	dimension_y: 34,
});
rt.type(4052, "/datum/sprite_accessory/frills", "/datum/sprite_accessory", {
	icon: rt.rsc("icons/mob/mutant_bodyparts.dmi"),
});
rt.type(4053, "/datum/sprite_accessory/frills/none", "/datum/sprite_accessory/frills", {
	name: "None",
	icon_state: "none",
});
rt.type(4054, "/datum/sprite_accessory/frills/simple", "/datum/sprite_accessory/frills", {
	name: "Simple",
	icon_state: "simple",
});
rt.type(4055, "/datum/sprite_accessory/frills/short", "/datum/sprite_accessory/frills", {
	name: "Short",
	icon_state: "short",
});
rt.type(4056, "/datum/sprite_accessory/frills/aquatic", "/datum/sprite_accessory/frills", {
	name: "Aquatic",
	icon_state: "aqua",
});
rt.type(4057, "/datum/sprite_accessory/spines", "/datum/sprite_accessory", {
	icon: rt.rsc("icons/mob/mutant_bodyparts.dmi"),
});
rt.type(4058, "/datum/sprite_accessory/spines/none", "/datum/sprite_accessory/spines", {
	name: "None",
	icon_state: "none",
});
rt.type(4059, "/datum/sprite_accessory/spines/short", "/datum/sprite_accessory/spines", {
	name: "Short",
	icon_state: "short",
});
rt.type(4060, "/datum/sprite_accessory/spines/shortmeme", "/datum/sprite_accessory/spines", {
	name: "Short + Membrane",
	icon_state: "shortmeme",
});
rt.type(4061, "/datum/sprite_accessory/spines/long", "/datum/sprite_accessory/spines", {
	name: "Long",
	icon_state: "long",
});
rt.type(4062, "/datum/sprite_accessory/spines/longmeme", "/datum/sprite_accessory/spines", {
	name: "Long + Membrane",
	icon_state: "longmeme",
});
rt.type(4063, "/datum/sprite_accessory/spines/aqautic", "/datum/sprite_accessory/spines", {
	name: "Aquatic",
	icon_state: "aqua",
});
rt.type(4064, "/datum/sprite_accessory/spines_animated", "/datum/sprite_accessory", {
	icon: rt.rsc("icons/mob/mutant_bodyparts.dmi"),
});
rt.type(4065, "/datum/sprite_accessory/spines_animated/none", "/datum/sprite_accessory/spines_animated", {
	name: "None",
	icon_state: "none",
});
rt.type(4066, "/datum/sprite_accessory/spines_animated/short", "/datum/sprite_accessory/spines_animated", {
	name: "Short",
	icon_state: "short",
});
rt.type(4067, "/datum/sprite_accessory/spines_animated/shortmeme", "/datum/sprite_accessory/spines_animated", {
	name: "Short + Membrane",
	icon_state: "shortmeme",
});
rt.type(4068, "/datum/sprite_accessory/spines_animated/long", "/datum/sprite_accessory/spines_animated", {
	name: "Long",
	icon_state: "long",
});
rt.type(4069, "/datum/sprite_accessory/spines_animated/longmeme", "/datum/sprite_accessory/spines_animated", {
	name: "Long + Membrane",
	icon_state: "longmeme",
});
rt.type(4070, "/datum/sprite_accessory/spines_animated/aqautic", "/datum/sprite_accessory/spines_animated", {
	name: "Aquatic",
	icon_state: "aqua",
});
rt.type(4071, "/datum/sprite_accessory/legs", "/datum/sprite_accessory", {
	icon: null,
});
rt.type(4072, "/datum/sprite_accessory/legs/none", "/datum/sprite_accessory/legs", {
	name: "Normal Legs",
});
rt.type(4073, "/datum/sprite_accessory/legs/digitigrade_lizard", "/datum/sprite_accessory/legs", {
	name: "Digitigrade Legs",
});
rt.type(4122, "/datum/guardianname", "/datum", {
	prefixname: "Default",
	suffixcolour: "Name",
	parasiteicon: "techbase",
	bubbleicon: "holo",
	theme: "tech",
	colour: "#C3C3C3",
	stainself: 0,
});
rt.type(4218, "/datum/stock_log", "/datum", {
	user_name: "",
	company_name: "",
	shareprice: null,
	money: null,
	stocks: null,
	time: null,
});
rt.type(4219, "/datum/stock_log/buy", "/datum/stock_log", {});
rt.type(4220, "/datum/stock_log/sell", "/datum/stock_log", {});
rt.type(4221, "/datum/stock_log/borrow", "/datum/stock_log", {});
rt.type(4223, "/datum/borrow", "/datum", {
	broker: "",
	borrower: "",
	stock: null,
	lease_expires: 0,
	lease_time: 0,
	grace_time: 0,
	grace_expires: 0,
	share_amount: 0,
	share_debt: 0,
	deposit: 0,
	offer_expires: 0,
});
rt.type(4225, "/datum/ui_state", "/datum", {});
rt.type(4227, "/datum/ui_state/always_state", "/datum/ui_state", {});
rt.type(13804, "/database", "/datum", {});
rt.type(13805, "/database/query", "/database", {
	_binobj: null,
});
rt.type(13807, "/dm_filter", "/datum", {
	x: null,
	y: null,
	icon: null,
	render_source: null,
	flags: null,
	size: null,
	threshold: null,
	offset: null,
	alpha: null,
	color: null,
	space: null,
	transform: null,
	blend_mode: null,
	factor: null,
	density: null,
	repeat: null,
	radius: null,
	falloff: null,
});
rt.type(13808, "/generator", "/datum", {
	_binobj: null,
});
rt.type(13810, "/particles", "/datum", {
	width: 100,
	height: 100,
	count: 100,
	spawning: 1,
	bound1: -1000,
	bound2: 1000,
	gravity: null,
	gradient: null,
	transform: null,
	lifespan: null,
	fade: null,
	fadein: null,
	icon: null,
	icon_state: null,
	color: null,
	color_change: null,
	position: null,
	velocity: null,
	scale: null,
	grow: null,
	rotation: null,
	spin: null,
	friction: null,
	drift: null,
});
rt.type(13811, "/pixloc", "/datum", {
	loc: null,
	step_x: null,
	step_y: null,
	x: null,
	y: null,
	z: null,
});
