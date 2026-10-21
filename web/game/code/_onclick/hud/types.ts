// Types declared in code/_onclick/hud that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(5098, "/mob/camera", "/mob", {
	anchored: 1,
	name: "camera mob",
	density: 0,
	status_flags: 4096,
	mouse_opacity: 0,
	see_in_dark: 7,
	invisibility: 101,
	sight: 32,
	move_on_shuttle: 0,
});
rt.type(11004, "/obj/screen/movable/snap", "/obj/screen/movable", {
	snap2grid: 1,
});
rt.type(11022, "/obj/screen/alert/oxy", "/obj/screen/alert", {
	name: "Choking (No O2)",
	desc: "You're not getting enough oxygen. Find some good air before you pass out! The box in your backpack has an oxygen tank and breath mask in it.",
	icon_state: "oxy",
});
rt.type(11023, "/obj/screen/alert/too_much_oxy", "/obj/screen/alert", {
	name: "Choking (O2)",
	desc: "There's too much oxygen in the air, and you're breathing it in! Find some good air before you pass out!",
	icon_state: "too_much_oxy",
});
rt.type(11024, "/obj/screen/alert/not_enough_co2", "/obj/screen/alert", {
	name: "Choking (No CO2)",
	desc: "You're not getting enough carbon dioxide. Find some good air before you pass out!",
	icon_state: "not_enough_co2",
});
rt.type(11025, "/obj/screen/alert/too_much_co2", "/obj/screen/alert", {
	name: "Choking (CO2)",
	desc: "There's too much carbon dioxide in the air, and you're breathing it in! Find some good air before you pass out!",
	icon_state: "too_much_co2",
});
rt.type(11026, "/obj/screen/alert/not_enough_tox", "/obj/screen/alert", {
	name: "Choking (No Plasma)",
	desc: "You're not getting enough plasma. Find some good air before you pass out!",
	icon_state: "not_enough_tox",
});
rt.type(11027, "/obj/screen/alert/tox_in_air", "/obj/screen/alert", {
	name: "Choking (Plasma)",
	desc: "There's highly flammable, toxic plasma in the air and you're breathing it in. Find some fresh air. The box in your backpack has an oxygen tank and gas mask in it.",
	icon_state: "tox_in_air",
});
rt.type(11028, "/obj/screen/alert/fat", "/obj/screen/alert", {
	name: "Fat",
	desc: "You ate too much food, lardass. Run around the station and lose some weight.",
	icon_state: "fat",
});
rt.type(11029, "/obj/screen/alert/hungry", "/obj/screen/alert", {
	name: "Hungry",
	desc: "Some food would be good right about now.",
	icon_state: "hungry",
});
rt.type(11030, "/obj/screen/alert/starving", "/obj/screen/alert", {
	name: "Starving",
	desc: "You're severely malnourished. The hunger pains make moving around a chore.",
	icon_state: "starving",
});
rt.type(11031, "/obj/screen/alert/hot", "/obj/screen/alert", {
	name: "Too Hot",
	desc: "You're flaming hot! Get somewhere cooler and take off any insulating clothing like a fire suit.",
	icon_state: "hot",
});
rt.type(11032, "/obj/screen/alert/cold", "/obj/screen/alert", {
	name: "Too Cold",
	desc: "You're freezing cold! Get somewhere warmer and take off any insulating clothing like a space suit.",
	icon_state: "cold",
});
rt.type(11033, "/obj/screen/alert/lowpressure", "/obj/screen/alert", {
	name: "Low Pressure",
	desc: "The air around you is hazardously thin. A space suit would protect you.",
	icon_state: "lowpressure",
});
rt.type(11034, "/obj/screen/alert/highpressure", "/obj/screen/alert", {
	name: "High Pressure",
	desc: "The air around you is hazardously thick. A fire suit would protect you.",
	icon_state: "highpressure",
});
rt.type(11035, "/obj/screen/alert/blind", "/obj/screen/alert", {
	name: "Blind",
	desc: "You can't see! This may be caused by a genetic defect, eye trauma, being unconscious, or something covering your eyes.",
	icon_state: "blind",
});
rt.type(11036, "/obj/screen/alert/high", "/obj/screen/alert", {
	name: "High",
	desc: "Whoa man, you're tripping balls! Careful you don't get addicted... if you aren't already.",
	icon_state: "high",
});
rt.type(11037, "/obj/screen/alert/drunk", "/obj/screen/alert", {
	name: "Drunk",
	desc: "All that alcohol you've been drinking is impairing your speech, motor skills, and mental cognition. Make sure to act like it.",
	icon_state: "drunk",
});
rt.type(11039, "/obj/screen/alert/weightless", "/obj/screen/alert", {
	name: "Weightless",
	desc: "Gravity has ceased affecting you, and you're floating around aimlessly. You'll need something large and heavy, like a wall or lattice, to push yourself off if you want to move. A jetpack would enable free range of motion. A pair of magboots would let you walk around normally on the floor. Barring those, you can throw things, use a fire extinguisher, or shoot a gun to move around via Newton's 3rd Law of Motion.",
	icon_state: "weightless",
});
rt.type(11041, "/obj/screen/alert/alien_tox", "/obj/screen/alert", {
	alerttooltipstyle: "alien",
	name: "Plasma",
	desc: "There's flammable plasma in the air. If it lights up, you'll be toast.",
	icon_state: "alien_tox",
});
rt.type(11042, "/obj/screen/alert/alien_fire", "/obj/screen/alert", {
	alerttooltipstyle: "alien",
	name: "Too Hot",
	desc: "It's too hot! Flee to space or at least away from the flames. Standing on weeds will heal you.",
	icon_state: "alien_fire",
});
rt.type(11043, "/obj/screen/alert/alien_vulnerable", "/obj/screen/alert", {
	alerttooltipstyle: "alien",
	name: "Severed Matriarchy",
	desc: "Your queen has been killed, you will suffer movement penalties and loss of hivemind. A new queen cannot be made until you recover.",
	icon_state: "alien_noqueen",
});
rt.type(11044, "/obj/screen/alert/nofactory", "/obj/screen/alert", {
	alerttooltipstyle: "blob",
	name: "No Factory",
	desc: "You have no factory, and are slowly dying!",
	icon_state: "blobbernaut_nofactory",
});
rt.type(11046, "/obj/screen/alert/clockwork", "/obj/screen/alert", {
	alerttooltipstyle: "clockcult",
});
rt.type(11049, "/obj/screen/alert/cancharge", "/obj/screen/alert", {
	alerttooltipstyle: "parasite",
	name: "Charge Ready",
	desc: "You are ready to charge at a location!",
	icon_state: "guardian_charge",
});
rt.type(11050, "/obj/screen/alert/canstealth", "/obj/screen/alert", {
	alerttooltipstyle: "parasite",
	name: "Stealth Ready",
	desc: "You are ready to enter stealth!",
	icon_state: "guardian_canstealth",
});
rt.type(11051, "/obj/screen/alert/instealth", "/obj/screen/alert", {
	alerttooltipstyle: "parasite",
	name: "In Stealth",
	desc: "You are in stealth and your next attack will do bonus damage!",
	icon_state: "guardian_instealth",
});
rt.type(11052, "/obj/screen/alert/nocell", "/obj/screen/alert", {
	name: "Missing Power Cell",
	desc: "Unit has no power cell. No modules available until a power cell is reinstalled. Robotics may provide assistance.",
	icon_state: "nocell",
});
rt.type(11053, "/obj/screen/alert/emptycell", "/obj/screen/alert", {
	name: "Out of Power",
	desc: "Unit's power cell has no charge remaining. No modules available until power cell is recharged. Recharging stations are available in robotics, the dormitory bathrooms, and the AI satellite.",
	icon_state: "emptycell",
});
rt.type(11054, "/obj/screen/alert/lowcell", "/obj/screen/alert", {
	name: "Low Charge",
	desc: "Unit's power cell is running low. Recharging stations are available in robotics, the dormitory bathrooms, and the AI satellite.",
	icon_state: "lowcell",
});
rt.type(11055, "/obj/screen/alert/hacked", "/obj/screen/alert", {
	name: "Hacked",
	desc: "Hazardous non-standard equipment detected. Please ensure any usage of this equipment is in line with unit's laws, if any.",
	icon_state: "hacked",
});
rt.type(11056, "/obj/screen/alert/locked", "/obj/screen/alert", {
	name: "Locked Down",
	desc: "Unit has been remotely locked down. Usage of a Robotics Control Console like the one in the Research Director's office by your AI master or any qualified human may resolve this matter. Robotics may provide further assistance if necessary.",
	icon_state: "locked",
});
rt.type(11057, "/obj/screen/alert/newlaw", "/obj/screen/alert", {
	timeout: 300,
	name: "Law Update",
	desc: "Laws have potentially been uploaded to or removed from this unit. Please be aware of any changes so as to remain in compliance with the most up-to-date laws.",
	icon_state: "newlaw",
});
rt.type(11059, "/obj/screen/alert/low_mech_integrity", "/obj/screen/alert", {
	name: "Mech Damaged",
	desc: "Mech integrity is low.",
	icon_state: "low_mech_integrity",
});
rt.type(11063, "/obj/screen/alert/restrained/buckled", "/obj/screen/alert/restrained", {
	name: "Buckled",
	desc: "You've been buckled to something. Click the alert to unbuckle unless you're handcuffed.",
});
rt.type(11064, "/obj/screen/alert/restrained/handcuffed", "/obj/screen/alert/restrained", {
	name: "Handcuffed",
	desc: "You're handcuffed and can't act. If anyone drags you, you won't be able to move. Click the alert to free yourself.",
});
rt.type(11065, "/obj/screen/alert/restrained/legcuffed", "/obj/screen/alert/restrained", {
	name: "Legcuffed",
	desc: "You're legcuffed, which slows you down considerably. Click the alert to free yourself.",
});
rt.type(11066, "/obj/screen/alert/status_effect", "/obj/screen/alert", {
	attached_effect: null,
	name: "Curse of Mundanity",
	desc: "You don't feel any different...",
});
rt.type(11067, "/obj/screen/alert/status_effect/agent_pinpointer", "/obj/screen/alert/status_effect", {
	name: "Internal Affairs Integrated Pinpointer",
	desc: "Even stealthier than a normal implant.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "pinon",
});
rt.type(11068, "/obj/screen/alert/status_effect/shadow_mend", "/obj/screen/alert/status_effect", {
	name: "Shadow Mend",
	desc: "Shadowy energies wrap around your wounds, sealing them at a price. After healing, you will slowly lose health every three seconds for thirty seconds.",
	icon_state: "shadow_mend",
});
rt.type(11069, "/obj/screen/alert/status_effect/void_price", "/obj/screen/alert/status_effect", {
	name: "Void Price",
	desc: "Black tendrils cinch tightly against you, digging wicked barbs into your flesh.",
	icon_state: "shadow_mend",
});
rt.type(11071, "/obj/screen/alert/status_effect/inathneqs_endowment", "/obj/screen/alert/status_effect", {
	alerttooltipstyle: "clockcult",
	name: "Inath-neq's Endowment",
	desc: "Adrenaline courses through you as the Resonant Cogwheel's energy shields you from all harm!",
	icon_state: "inathneqs_endowment",
});
rt.type(11072, "/obj/screen/alert/status_effect/power_regen", "/obj/screen/alert/status_effect", {
	name: "Power Regeneration",
	desc: "You are quickly regenerating power!",
	icon_state: "power_regen",
});
rt.type(11074, "/obj/screen/alert/status_effect/wish_granters_gift", "/obj/screen/alert/status_effect", {
	name: "Wish Granter's Immortality",
	desc: "You are being resurrected!",
	icon_state: "wish_granter",
});
rt.type(11075, "/obj/screen/alert/status_effect/blooddrunk", "/obj/screen/alert/status_effect", {
	name: "Blood-Drunk",
	desc: "You are drunk on blood! Your pulse thunders in your ears! Nothing can harm you!",
	icon_state: "blooddrunk",
});
rt.type(11076, "/obj/screen/alert/status_effect/asleep", "/obj/screen/alert/status_effect", {
	name: "Asleep",
	desc: "You've fallen asleep. Wait a bit and you should wake up. Unless you don't, considering how helpless you are.",
	icon_state: "asleep",
});
rt.type(11077, "/obj/screen/alert/status_effect/his_wrath", "/obj/screen/alert/status_effect", {
	alerttooltipstyle: "hisgrace",
	name: "His Wrath",
	desc: "You fled from His Grace instead of feeding Him, and now you suffer.",
	icon_state: "his_grace",
});
rt.type(11078, "/obj/screen/alert/status_effect/belligerent", "/obj/screen/alert/status_effect", {
	alerttooltipstyle: "clockcult",
	name: "Belligerent",
	desc: "<b><font color=#880020>Kneel, her-eti'c.</font></b>",
	icon_state: "belligerent",
});
rt.type(11079, "/obj/screen/alert/status_effect/freon", "/obj/screen/alert/status_effect", {
	name: "Frozen Solid",
	desc: "You're frozen inside of an ice cube, and cannot move! You can still do stuff, like shooting. Resist out of the cube!",
	icon_state: "frozen",
});
rt.type(11081, "/obj/screen/alien", "/obj/screen", {
	icon: rt.rsc("icons/mob/screen_alien.dmi"),
});
rt.type(11083, "/obj/screen/alien/plasma_display", "/obj/screen/alien", {
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "power_display2",
	name: "plasma stored",
	screen_loc: "EAST,CENTER-2:15",
});
rt.type(11084, "/obj/screen/alien/alien_queen_finder", "/obj/screen/alien", {
	icon: rt.rsc("icons/mob/screen_alien.dmi"),
	icon_state: "queen_finder",
	name: "queen sense",
	desc: "Allows you to sense the general direction of your Queen.",
	screen_loc: "EAST,CENTER-3:15",
});
rt.type(11095, "/obj/screen/marauder", "/obj/screen", {
	icon: rt.rsc("icons/mob/clockwork_mobs.dmi"),
});
rt.type(11098, "/obj/screen/fullscreen/brute", "/obj/screen/fullscreen", {
	icon_state: "brutedamageoverlay",
	layer: 18.2,
	plane: 18,
});
rt.type(11099, "/obj/screen/fullscreen/oxy", "/obj/screen/fullscreen", {
	icon_state: "oxydamageoverlay",
	layer: 18.2,
	plane: 18,
});
rt.type(11100, "/obj/screen/fullscreen/crit", "/obj/screen/fullscreen", {
	icon_state: "passage",
	layer: 18.4,
	plane: 18,
});
rt.type(11101, "/obj/screen/fullscreen/blind", "/obj/screen/fullscreen", {
	icon_state: "blackimageoverlay",
	layer: 18.3,
	plane: 18,
});
rt.type(11102, "/obj/screen/fullscreen/impaired", "/obj/screen/fullscreen", {
	icon_state: "impairedoverlay",
});
rt.type(11103, "/obj/screen/fullscreen/blurry", "/obj/screen/fullscreen", {
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	screen_loc: "WEST,SOUTH to EAST,NORTH",
	icon_state: "blurry",
});
rt.type(11104, "/obj/screen/fullscreen/flash", "/obj/screen/fullscreen", {
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	screen_loc: "WEST,SOUTH to EAST,NORTH",
	icon_state: "flash",
});
rt.type(11105, "/obj/screen/fullscreen/flash/static", "/obj/screen/fullscreen/flash", {
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	screen_loc: "WEST,SOUTH to EAST,NORTH",
	icon_state: "noise",
});
rt.type(11106, "/obj/screen/fullscreen/high", "/obj/screen/fullscreen", {
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	screen_loc: "WEST,SOUTH to EAST,NORTH",
	icon_state: "druggy",
});
rt.type(11107, "/obj/screen/fullscreen/color_vision", "/obj/screen/fullscreen", {
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	screen_loc: "WEST,SOUTH to EAST,NORTH",
	icon_state: "flash",
	alpha: 80,
});
rt.type(11108, "/obj/screen/fullscreen/color_vision/green", "/obj/screen/fullscreen/color_vision", {
	color: "#00ff00",
});
rt.type(11109, "/obj/screen/fullscreen/color_vision/red", "/obj/screen/fullscreen/color_vision", {
	color: "#ff0000",
});
rt.type(11110, "/obj/screen/fullscreen/color_vision/blue", "/obj/screen/fullscreen/color_vision", {
	color: "#0000ff",
});
rt.type(11112, "/obj/screen/fullscreen/lighting_backdrop/lit", "/obj/screen/fullscreen/lighting_backdrop", {
	show_when_dead: 1,
	invisibility: 20,
	layer: 20021,
	color: "#000",
});
rt.type(11113, "/obj/screen/fullscreen/lighting_backdrop/unlit", "/obj/screen/fullscreen/lighting_backdrop", {
	show_when_dead: 1,
	layer: 20020,
});
rt.type(11114, "/obj/screen/fullscreen/see_through_darkness", "/obj/screen/fullscreen", {
	show_when_dead: 1,
	icon_state: "nightvision",
	plane: 15,
	layer: 15,
	blend_mode: 2,
});
rt.type(11121, "/obj/screen/guardian", "/obj/screen", {
	icon: rt.rsc("icons/mob/guardian.dmi"),
});
rt.type(11125, "/obj/screen/guardian/ToggleMode/Inactive", "/obj/screen/guardian/ToggleMode", {
	icon_state: "notoggle",
});
rt.type(11126, "/obj/screen/guardian/ToggleMode/Assassin", "/obj/screen/guardian/ToggleMode", {
	icon_state: "stealth",
	name: "Toggle Stealth",
	desc: "Enter or exit stealth.",
});
rt.type(11129, "/obj/screen/human", "/obj/screen", {
	icon: rt.rsc("icons/mob/screen_midnight.dmi"),
});
rt.type(11132, "/obj/screen/devil", "/obj/screen", {
	invisibility: 101,
});
rt.type(11134, "/obj/screen/ling", "/obj/screen", {
	invisibility: 101,
});
rt.type(11136, "/obj/screen/ling/chems", "/obj/screen/ling", {
	name: "chemical storage",
	icon_state: "power_display",
	screen_loc: "WEST,CENTER-1:15",
});
rt.type(11138, "/obj/screen/parallax_layer/layer_1", "/obj/screen/parallax_layer", {
	speed: 0.6,
	icon_state: "layer1",
	layer: 1,
});
rt.type(11139, "/obj/screen/parallax_layer/layer_2", "/obj/screen/parallax_layer", {
	speed: 1,
	icon_state: "layer2",
	layer: 2,
});
rt.type(11140, "/obj/screen/parallax_layer/layer_3", "/obj/screen/parallax_layer", {
	speed: 1.4,
	icon_state: "layer3",
	layer: 3,
});
rt.type(11142, "/obj/screen/plane_master/game_world", "/obj/screen/plane_master", {
	name: "game world plane master",
	plane: 0,
	appearance_flags: 128,
	blend_mode: 1,
});
rt.type(11144, "/obj/screen/plane_master/parallax", "/obj/screen/plane_master", {
	name: "parallax plane master",
	plane: -90,
	blend_mode: 4,
	mouse_opacity: 0,
});
rt.type(11145, "/obj/screen/plane_master/parallax_white", "/obj/screen/plane_master", {
	name: "parallax whitifier plane master",
	plane: -95,
});
rt.type(11155, "/obj/screen/text", "/obj/screen", {
	icon: null,
	icon_state: null,
	mouse_opacity: 0,
	screen_loc: "CENTER-7,CENTER-7",
	maptext_height: 480,
	maptext_width: 480,
});
rt.type(11166, "/obj/screen/act_intent/alien", "/obj/screen/act_intent", {
	icon: rt.rsc("icons/mob/screen_alien.dmi"),
	screen_loc: "EAST-2:26,SOUTH:5",
});
rt.type(11167, "/obj/screen/act_intent/robot", "/obj/screen/act_intent", {
	icon: rt.rsc("icons/mob/screen_cyborg.dmi"),
	screen_loc: "EAST-2:26,SOUTH:5",
});
rt.type(11176, "/obj/screen/zone_sel/robot", "/obj/screen/zone_sel", {
	icon: rt.rsc("icons/mob/screen_cyborg.dmi"),
});
rt.type(11177, "/obj/screen/flash", "/obj/screen", {
	name: "flash",
	icon_state: "blank",
	blend_mode: 2,
	screen_loc: "WEST,SOUTH to EAST,NORTH",
	layer: 18,
	plane: 18,
});
rt.type(11178, "/obj/screen/damageoverlay", "/obj/screen", {
	icon: rt.rsc("icons/mob/screen_full.dmi"),
	icon_state: "oxydamageoverlay0",
	name: "dmg",
	blend_mode: 4,
	screen_loc: "CENTER-7,CENTER-7",
	mouse_opacity: 0,
	layer: 18.2,
	plane: 18,
});
rt.type(11179, "/obj/screen/healths", "/obj/screen", {
	name: "health",
	icon_state: "health0",
	screen_loc: "EAST-1:28,CENTER-1:15",
});
rt.type(11180, "/obj/screen/healths/alien", "/obj/screen/healths", {
	icon: rt.rsc("icons/mob/screen_alien.dmi"),
	screen_loc: "EAST,CENTER-1:15",
});
rt.type(11181, "/obj/screen/healths/robot", "/obj/screen/healths", {
	icon: rt.rsc("icons/mob/screen_cyborg.dmi"),
	screen_loc: "EAST-1:28,CENTER-1:15",
});
rt.type(11182, "/obj/screen/healths/deity", "/obj/screen/healths", {
	name: "Nexus Health",
	icon_state: "deity_nexus",
	screen_loc: "EAST-1:28,CENTER-2:13",
});
rt.type(11183, "/obj/screen/healths/blob", "/obj/screen/healths", {
	name: "blob health",
	icon_state: "block",
	screen_loc: "EAST-1:28,CENTER:17",
	mouse_opacity: 0,
});
rt.type(11184, "/obj/screen/healths/blob/naut", "/obj/screen/healths/blob", {
	name: "health",
	icon: rt.rsc("icons/mob/blob.dmi"),
	icon_state: "nauthealth",
});
rt.type(11185, "/obj/screen/healths/blob/naut/core", "/obj/screen/healths/blob/naut", {
	name: "overmind health",
	screen_loc: "EAST-1:28,CENTER-1:15",
	icon_state: "corehealth",
});
rt.type(11186, "/obj/screen/healths/guardian", "/obj/screen/healths", {
	name: "summoner health",
	icon: rt.rsc("icons/mob/guardian.dmi"),
	icon_state: "base",
	screen_loc: "EAST-1:28,CENTER-1:15",
	mouse_opacity: 0,
});
rt.type(11187, "/obj/screen/healths/clock", "/obj/screen/healths", {
	icon: rt.rsc("icons/mob/actions.dmi"),
	icon_state: "bg_clock",
	screen_loc: "EAST-1:28,CENTER-1:15",
	mouse_opacity: 0,
});
rt.type(11188, "/obj/screen/healths/clock/gear", "/obj/screen/healths/clock", {
	icon: rt.rsc("icons/mob/clockwork_mobs.dmi"),
	icon_state: "bg_gear",
	screen_loc: "EAST-1:28,CENTER:17",
});
rt.type(11189, "/obj/screen/healths/revenant", "/obj/screen/healths", {
	name: "essence",
	icon: rt.rsc("icons/mob/actions.dmi"),
	icon_state: "bg_revenant",
	screen_loc: "EAST-1:28,CENTER-1:15",
	mouse_opacity: 0,
});
rt.type(11190, "/obj/screen/healths/construct", "/obj/screen/healths", {
	icon: rt.rsc("icons/mob/screen_construct.dmi"),
	icon_state: "artificer_health0",
	screen_loc: "EAST,CENTER:15",
	mouse_opacity: 0,
});
rt.type(11191, "/obj/screen/healthdoll", "/obj/screen", {
	name: "health doll",
	screen_loc: "EAST-1:28,CENTER-2:13",
});
rt.type(11193, "/obj/screen/screentip", "/obj/screen", {
	icon: null,
	icon_state: null,
	mouse_opacity: 0,
	screen_loc: "CENTER-7,NORTH",
	maptext_height: 32,
	maptext_width: 480,
	maptext: "",
});
rt.type(11194, "/obj/screen/swarmer", "/obj/screen", {
	icon: rt.rsc("icons/mob/swarmer.dmi"),
});
