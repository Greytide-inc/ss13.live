// Types declared in code/game/objects/effects that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(6983, "/obj/item/weapon/poster/random_contraband", "/obj/item/weapon/poster", {
	name: "random contraband poster",
	poster_type: rt.typePath("/obj/structure/sign/poster/contraband/random"),
	icon_state: "rolled_poster",
});
rt.type(6984, "/obj/item/weapon/poster/random_official", "/obj/item/weapon/poster", {
	name: "random official poster",
	poster_type: rt.typePath("/obj/structure/sign/poster/official/random"),
	icon_state: "rolled_legit",
});
rt.type(11209, "/obj/effect/portal/anom", "/obj/effect/portal", {
	mech_sized: 1,
	name: "wormhole",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "anom",
});
rt.type(11424, "/obj/effect/gateway", "/obj/effect", {
	anchored: 1,
	name: "gateway",
	desc: "You're pretty sure that abyss is staring back.",
	icon: rt.rsc("icons/obj/cult.dmi"),
	icon_state: "hole",
	density: 1,
});
rt.type(11449, "/obj/effect/landmark/abductor", "/obj/effect/landmark", {
	team: 1,
});
rt.type(11450, "/obj/effect/landmark/abductor/agent", "/obj/effect/landmark/abductor", {});
rt.type(11451, "/obj/effect/landmark/abductor/scientist", "/obj/effect/landmark/abductor", {});
rt.type(11453, "/obj/effect/landmark/start/assistant", "/obj/effect/landmark/start", {
	name: "Assistant",
});
rt.type(11454, "/obj/effect/landmark/start/janitor", "/obj/effect/landmark/start", {
	name: "Janitor",
});
rt.type(11455, "/obj/effect/landmark/start/cargo_technician", "/obj/effect/landmark/start", {
	name: "Cargo Technician",
});
rt.type(11456, "/obj/effect/landmark/start/bartender", "/obj/effect/landmark/start", {
	name: "Bartender",
});
rt.type(11457, "/obj/effect/landmark/start/clown", "/obj/effect/landmark/start", {
	name: "Clown",
});
rt.type(11458, "/obj/effect/landmark/start/mime", "/obj/effect/landmark/start", {
	name: "Mime",
});
rt.type(11459, "/obj/effect/landmark/start/quartermaster", "/obj/effect/landmark/start", {
	name: "Quartermaster",
});
rt.type(11460, "/obj/effect/landmark/start/atmospheric_technician", "/obj/effect/landmark/start", {
	name: "Atmospheric Technician",
});
rt.type(11461, "/obj/effect/landmark/start/cook", "/obj/effect/landmark/start", {
	name: "Cook",
});
rt.type(11462, "/obj/effect/landmark/start/shaft_miner", "/obj/effect/landmark/start", {
	name: "Shaft Miner",
});
rt.type(11463, "/obj/effect/landmark/start/security_officer", "/obj/effect/landmark/start", {
	name: "Security Officer",
});
rt.type(11464, "/obj/effect/landmark/start/botanist", "/obj/effect/landmark/start", {
	name: "Botanist",
});
rt.type(11465, "/obj/effect/landmark/start/head_of_security", "/obj/effect/landmark/start", {
	name: "Head of Security",
});
rt.type(11466, "/obj/effect/landmark/start/ai", "/obj/effect/landmark/start", {
	name: "AI",
});
rt.type(11467, "/obj/effect/landmark/start/captain", "/obj/effect/landmark/start", {
	name: "Captain",
});
rt.type(11468, "/obj/effect/landmark/start/detective", "/obj/effect/landmark/start", {
	name: "Detective",
});
rt.type(11469, "/obj/effect/landmark/start/warden", "/obj/effect/landmark/start", {
	name: "Warden",
});
rt.type(11470, "/obj/effect/landmark/start/chief_engineer", "/obj/effect/landmark/start", {
	name: "Chief Engineer",
});
rt.type(11471, "/obj/effect/landmark/start/cyborg", "/obj/effect/landmark/start", {
	name: "Cyborg",
});
rt.type(11472, "/obj/effect/landmark/start/head_of_personnel", "/obj/effect/landmark/start", {
	name: "Head of Personnel",
});
rt.type(11473, "/obj/effect/landmark/start/librarian", "/obj/effect/landmark/start", {
	name: "Curator",
});
rt.type(11474, "/obj/effect/landmark/start/lawyer", "/obj/effect/landmark/start", {
	name: "Lawyer",
});
rt.type(11475, "/obj/effect/landmark/start/station_engineer", "/obj/effect/landmark/start", {
	name: "Station Engineer",
});
rt.type(11476, "/obj/effect/landmark/start/medical_doctor", "/obj/effect/landmark/start", {
	name: "Medical Doctor",
});
rt.type(11477, "/obj/effect/landmark/start/scientist", "/obj/effect/landmark/start", {
	name: "Scientist",
});
rt.type(11478, "/obj/effect/landmark/start/chemist", "/obj/effect/landmark/start", {
	name: "Chemist",
});
rt.type(11479, "/obj/effect/landmark/start/roboticist", "/obj/effect/landmark/start", {
	name: "Roboticist",
});
rt.type(11480, "/obj/effect/landmark/start/research_director", "/obj/effect/landmark/start", {
	name: "Research Director",
});
rt.type(11481, "/obj/effect/landmark/start/geneticist", "/obj/effect/landmark/start", {
	name: "Geneticist",
});
rt.type(11482, "/obj/effect/landmark/start/chief_medical_officer", "/obj/effect/landmark/start", {
	name: "Chief Medical Officer",
});
rt.type(11483, "/obj/effect/landmark/start/virologist", "/obj/effect/landmark/start", {
	name: "Virologist",
});
rt.type(11484, "/obj/effect/landmark/start/chaplain", "/obj/effect/landmark/start", {
	name: "Chaplain",
});
rt.type(11486, "/obj/effect/landmark/start/depsec/supply", "/obj/effect/landmark/start/depsec", {
	name: "supply_sec",
});
rt.type(11487, "/obj/effect/landmark/start/depsec/medical", "/obj/effect/landmark/start/depsec", {
	name: "medical_sec",
});
rt.type(11488, "/obj/effect/landmark/start/depsec/engineering", "/obj/effect/landmark/start/depsec", {
	name: "engineering_sec",
});
rt.type(11489, "/obj/effect/landmark/start/depsec/science", "/obj/effect/landmark/start/depsec", {
	name: "science_sec",
});
rt.type(11493, "/obj/effect/landmark/carpspawn", "/obj/effect/landmark", {
	name: "carpspawn",
});
rt.type(11494, "/obj/effect/landmark/lightsout", "/obj/effect/landmark", {
	name: "lightsout",
});
rt.type(11495, "/obj/effect/landmark/observer_start", "/obj/effect/landmark", {
	name: "Observer-Start",
});
rt.type(11496, "/obj/effect/landmark/revenantspawn", "/obj/effect/landmark", {
	name: "revnantspawn",
});
rt.type(11497, "/obj/effect/landmark/tripai", "/obj/effect/landmark", {
	name: "tripai",
});
rt.type(11498, "/obj/effect/landmark/marauder_entry", "/obj/effect/landmark", {
	name: "Marauder Entry",
});
rt.type(11499, "/obj/effect/landmark/syndicate_breach_area", "/obj/effect/landmark", {
	name: "Syndicate Breach Area",
});
rt.type(11500, "/obj/effect/landmark/teleport_scroll", "/obj/effect/landmark", {
	name: "Teleport-Scroll",
});
rt.type(11501, "/obj/effect/landmark/syndicate_spawn", "/obj/effect/landmark", {
	name: "Syndicate-Spawn",
});
rt.type(11508, "/obj/effect/landmark/thunderdome", "/obj/effect/landmark", {});
rt.type(11515, "/obj/effect/landmark/river_waypoint", "/obj/effect/landmark", {
	connected: 0,
	name: "river waypoint",
	invisibility: 101,
});
rt.type(11516, "/obj/effect/landmark/shuttle_arena_safe", "/obj/effect/landmark", {
	name: "hall of champions",
	desc: "For the winners.",
});
rt.type(11517, "/obj/effect/landmark/shuttle_arena_entrance", "/obj/effect/landmark", {
	name: "the arena",
	desc: "A lava filled battlefield.",
});
rt.type(11518, "/obj/effect/landmark/error", "/obj/effect/landmark", {
	name: "error",
});
rt.type(11525, "/obj/effect/landmark/shuttle_import", "/obj/effect/landmark", {
	name: "Shuttle Import",
});
rt.type(11526, "/obj/effect/landmark/vr_spawn", "/obj/effect/landmark", {
	vr_category: "default",
});
rt.type(11774, "/obj/effect/overlay", "/obj/effect", {
	i_attached: null,
	name: "overlay",
});
rt.type(11777, "/obj/effect/overlay/palmtree_r", "/obj/effect/overlay", {
	anchored: 1,
	name: "Palm tree",
	icon: rt.rsc("icons/misc/beach2.dmi"),
	icon_state: "palm1",
	density: 1,
	layer: 4.25,
});
rt.type(11778, "/obj/effect/overlay/palmtree_l", "/obj/effect/overlay", {
	anchored: 1,
	name: "Palm tree",
	icon: rt.rsc("icons/misc/beach2.dmi"),
	icon_state: "palm2",
	density: 1,
	layer: 4.25,
});
rt.type(11779, "/obj/effect/overlay/coconut", "/obj/effect/overlay", {
	name: "Coconuts",
	icon: rt.rsc("icons/misc/beach.dmi"),
	icon_state: "coconuts",
});
rt.type(11780, "/obj/effect/overlay/sparkles", "/obj/effect/overlay", {
	name: "sparkles",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "shieldsparkles",
});
rt.type(11801, "/obj/effect/abstract", "/obj/effect", {});
rt.type(11803, "/obj/effect/abstract/marker/at", "/obj/effect/abstract/marker", {
	name: "active turf marker",
});
rt.type(11810, "/obj/effect/forcefield", "/obj/effect", {
	anchored: 1,
	CanAtmosPass: -2,
	desc: "A space wizard's magic wall.",
	name: "FORCEWALL",
	icon_state: "m_shield",
	opacity: 0,
	density: 1,
});
rt.type(11811, "/obj/effect/forcefield/cult", "/obj/effect/forcefield", {
	desc: "An unholy shield that blocks all attacks.",
	name: "glowing wall",
	icon: rt.rsc("icons/effects/cult_effects.dmi"),
	icon_state: "cultshield",
});
rt.type(11813, "/obj/effect/forcefield/mime/advanced", "/obj/effect/forcefield/mime", {
	timeleft: 600,
	name: "invisible blockade",
	desc: "You're goona be here a while.",
});
rt.type(11824, "/obj/effect/mine/gas/plasma", "/obj/effect/mine/gas", {
	gas_type: "plasma",
	name: "plasma mine",
});
rt.type(11825, "/obj/effect/mine/gas/n2o", "/obj/effect/mine/gas", {
	gas_type: "n2o",
	name: "１N2O mine",
});
rt.type(11827, "/obj/effect/mine/sound/bwoink", "/obj/effect/mine/sound", {
	sound: rt.rsc("sound/effects/adminhelp.ogg"),
	name: "bwoink mine",
});
rt.type(11832, "/obj/effect/spresent", "/obj/effect", {
	anchored: 0,
	name: "strange present",
	desc: "It's a ... present?",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "strangepresent",
	density: 1,
});
rt.type(11833, "/obj/effect/beam", "/obj/effect", {
	def_zone: null,
	pass_flags: 1,
	name: "beam",
});
rt.type(11835, "/obj/effect/spawner", "/obj/effect", {
	name: "object spawner",
});
rt.type(11891, "/obj/effect/list_container", "/obj/effect", {
	name: "list container",
});
rt.type(11893, "/obj/effect/fullbright", "/obj/effect", {
	icon: rt.rsc("icons/effects/alphacolors.dmi"),
	icon_state: "white",
	plane: 15,
	layer: 15,
	blend_mode: 2,
});
rt.type(11897, "/obj/effect/step_trigger/stopper", "/obj/effect/step_trigger", {});
rt.type(11947, "/obj/effect/dummy", "/obj/effect", {});
rt.type(12029, "/obj/effect/mist", "/obj/effect", {
	anchored: 1,
	name: "mist",
	icon: rt.rsc("icons/obj/watercloset.dmi"),
	icon_state: "mist",
	layer: 5,
	mouse_opacity: 0,
});
rt.type(12036, "/obj/effect/debugging", "/obj/effect", {});
rt.type(12037, "/obj/effect/debugging/mapfix_marker", "/obj/effect/debugging", {
	name: "map fix marker",
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "mapfixmarker",
	desc: "I am a mappers mistake.",
});
rt.type(12038, "/obj/effect/debugging/marker", "/obj/effect/debugging", {
	icon: rt.rsc("icons/turf/areas.dmi"),
	icon_state: "yellow",
});
rt.type(12040, "/obj/effect/ctf", "/obj/effect", {
	anchored: 1,
	density: 0,
	invisibility: 60,
	alpha: 100,
	resistance_flags: 64,
});
rt.type(12041, "/obj/effect/ctf/flag_reset", "/obj/effect/ctf", {
	name: "banner landmark",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "banner",
	desc: "This is where a banner with Nanotrasen's logo on it would go.",
	layer: 2.95,
});
rt.type(12042, "/obj/effect/ctf/flag_reset/red", "/obj/effect/ctf/flag_reset", {
	name: "red flag landmark",
	icon_state: "banner-red",
	desc: "This is where a red banner used to play capture the flag would go.",
});
rt.type(12043, "/obj/effect/ctf/flag_reset/blue", "/obj/effect/ctf/flag_reset", {
	name: "blue flag landmark",
	icon_state: "banner-blue",
	desc: "This is where a blue banner used to play capture the flag would go.",
});
rt.type(12080, "/obj/effect/extraction_holder", "/obj/effect", {
	stored_obj: null,
	name: "extraction holder",
	desc: "you shouldnt see this",
});
rt.type(12083, "/obj/effect/wisp", "/obj/effect", {
	name: "friendly wisp",
	desc: "Happy to light your way.",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "orb",
	luminosity: 7,
	layer: 4.5,
});
rt.type(12100, "/obj/effect/cross_action", "/obj/effect", {
	anchored: 1,
	name: "cross me",
	desc: "for crossing",
});
rt.type(12465, "/obj/structure/spider/spiderling/hunter", "/obj/structure/spider/spiderling", {
	grow_as: rt.typePath("/mob/living/simple_animal/hostile/poison/giant_spider/hunter"),
});
rt.type(12466, "/obj/structure/spider/spiderling/nurse", "/obj/structure/spider/spiderling", {
	grow_as: rt.typePath("/mob/living/simple_animal/hostile/poison/giant_spider/nurse"),
});
rt.type(12572, "/obj/structure/sign/poster/ripped", "/obj/structure/sign/poster", {
	ruined: 1,
	icon_state: "poster_ripped",
	name: "ripped poster",
	desc: "You can't make out anything from the poster's original print. It's ruined.",
});
rt.type(12573, "/obj/structure/sign/poster/random", "/obj/structure/sign/poster", {
	never_random: 1,
	random_basetype: rt.typePath("/obj/structure/sign/poster"),
	name: "random poster",
	icon_state: "random_anything",
});
rt.type(12574, "/obj/structure/sign/poster/contraband", "/obj/structure/sign/poster", {
	poster_item_name: "contraband poster",
	poster_item_desc: "This poster comes with its own automatic adhesive mechanism, for easy pinning to any vertical surface. Its vulgar themes have marked it as contraband aboard Nanotrasen space facilities.",
	poster_item_icon_state: "rolled_poster",
});
rt.type(12575, "/obj/structure/sign/poster/contraband/random", "/obj/structure/sign/poster/contraband", {
	never_random: 1,
	random_basetype: rt.typePath("/obj/structure/sign/poster/contraband"),
	name: "random contraband poster",
	icon_state: "random_contraband",
});
rt.type(12576, "/obj/structure/sign/poster/contraband/free_tonto", "/obj/structure/sign/poster/contraband", {
	name: "Free Tonto",
	desc: "A salvaged shred of a much larger flag, colors bled together and faded from age.",
	icon_state: "poster1",
});
rt.type(12577, "/obj/structure/sign/poster/contraband/atmosia_independence", "/obj/structure/sign/poster/contraband", {
	name: "Atmosia Declaration of Independence",
	desc: "A relic of a failed rebellion.",
	icon_state: "poster2",
});
rt.type(12578, "/obj/structure/sign/poster/contraband/fun_police", "/obj/structure/sign/poster/contraband", {
	name: "Fun Police",
	desc: "A poster condemning the station's security forces.",
	icon_state: "poster3",
});
rt.type(12579, "/obj/structure/sign/poster/contraband/lusty_xenomorph", "/obj/structure/sign/poster/contraband", {
	name: "Lusty Xenomorph",
	desc: "A heretical poster depicting the titular star of an equally heretical book.",
	icon_state: "poster4",
});
rt.type(12580, "/obj/structure/sign/poster/contraband/syndicate_recruitment", "/obj/structure/sign/poster/contraband", {
	name: "Syndicate Recruitment",
	desc: "See the galaxy! Shatter corrupt megacorporations! Join today!",
	icon_state: "poster5",
});
rt.type(12581, "/obj/structure/sign/poster/contraband/clown", "/obj/structure/sign/poster/contraband", {
	name: "Clown",
	desc: "Honk.",
	icon_state: "poster6",
});
rt.type(12582, "/obj/structure/sign/poster/contraband/smoke", "/obj/structure/sign/poster/contraband", {
	name: "Smoke",
	desc: "A poster advertising a rival corporate brand of cigarettes.",
	icon_state: "poster7",
});
rt.type(12583, "/obj/structure/sign/poster/contraband/grey_tide", "/obj/structure/sign/poster/contraband", {
	name: "Grey Tide",
	desc: "A rebellious poster symbolizing assistant solidarity.",
	icon_state: "poster8",
});
rt.type(12584, "/obj/structure/sign/poster/contraband/missing_gloves", "/obj/structure/sign/poster/contraband", {
	name: "Missing Gloves",
	desc: "This poster references the uproar that followed Nanotrasen's financial cuts toward insulated-glove purchases.",
	icon_state: "poster9",
});
rt.type(12585, "/obj/structure/sign/poster/contraband/hacking_guide", "/obj/structure/sign/poster/contraband", {
	name: "Hacking Guide",
	desc: "This poster details the internal workings of the common Nanotrasen airlock. Sadly, it appears out of date.",
	icon_state: "poster10",
});
rt.type(12586, "/obj/structure/sign/poster/contraband/rip_badger", "/obj/structure/sign/poster/contraband", {
	name: "RIP Badger",
	desc: "This seditious poster references Nanotrasen's genocide of a space station full of badgers.",
	icon_state: "poster11",
});
rt.type(12587, "/obj/structure/sign/poster/contraband/ambrosia_vulgaris", "/obj/structure/sign/poster/contraband", {
	name: "Ambrosia Vulgaris",
	desc: "This poster is lookin' pretty trippy man.",
	icon_state: "poster12",
});
rt.type(12588, "/obj/structure/sign/poster/contraband/donut_corp", "/obj/structure/sign/poster/contraband", {
	name: "Donut Corp.",
	desc: "This poster is an unauthorized advertisement for Donut Corp.",
	icon_state: "poster13",
});
rt.type(12589, "/obj/structure/sign/poster/contraband/eat", "/obj/structure/sign/poster/contraband", {
	name: "EAT.",
	desc: "This poster promotes rank gluttony.",
	icon_state: "poster14",
});
rt.type(12590, "/obj/structure/sign/poster/contraband/tools", "/obj/structure/sign/poster/contraband", {
	name: "Tools",
	desc: "This poster looks like an advertisement for tools, but is in fact a subliminal jab at the tools at CentComm.",
	icon_state: "poster15",
});
rt.type(12591, "/obj/structure/sign/poster/contraband/power", "/obj/structure/sign/poster/contraband", {
	name: "Power",
	desc: "A poster that positions the seat of power outside Nanotrasen.",
	icon_state: "poster16",
});
rt.type(12592, "/obj/structure/sign/poster/contraband/space_cube", "/obj/structure/sign/poster/contraband", {
	name: "Space Cube",
	desc: "Ignorant of Nature's Harmonic 6 Side Space Cube Creation, the Spacemen are Dumb, Educated Singularity Stupid and Evil.",
	icon_state: "poster17",
});
rt.type(12593, "/obj/structure/sign/poster/contraband/communist_state", "/obj/structure/sign/poster/contraband", {
	name: "Communist State",
	desc: "All hail the Communist party!",
	icon_state: "poster18",
});
rt.type(12594, "/obj/structure/sign/poster/contraband/lamarr", "/obj/structure/sign/poster/contraband", {
	name: "Lamarr",
	desc: "This poster depicts Lamarr. Probably made by a traitorous Research Director.",
	icon_state: "poster19",
});
rt.type(12595, "/obj/structure/sign/poster/contraband/borg_fancy_1", "/obj/structure/sign/poster/contraband", {
	name: "Borg Fancy",
	desc: "Being fancy can be for any borg, just need a suit.",
	icon_state: "poster20",
});
rt.type(12596, "/obj/structure/sign/poster/contraband/borg_fancy_2", "/obj/structure/sign/poster/contraband", {
	name: "Borg Fancy v2",
	desc: "Borg Fancy, Now only taking the most fancy.",
	icon_state: "poster21",
});
rt.type(12597, "/obj/structure/sign/poster/contraband/kss13", "/obj/structure/sign/poster/contraband", {
	name: "Kosmicheskaya Stantsiya 13 Does Not Exist",
	desc: "A poster mocking CentComm's denial of the existence of the derelict station near Space Station 13.",
	icon_state: "poster22",
});
rt.type(12598, "/obj/structure/sign/poster/contraband/rebels_unite", "/obj/structure/sign/poster/contraband", {
	name: "Rebels Unite",
	desc: "A poster urging the viewer to rebel against Nanotrasen.",
	icon_state: "poster23",
});
rt.type(12599, "/obj/structure/sign/poster/contraband/c20r", "/obj/structure/sign/poster/contraband", {
	name: "C-20r",
	desc: "A poster advertising the Scarborough Arms C-20r.",
	icon_state: "poster24",
});
rt.type(12600, "/obj/structure/sign/poster/contraband/have_a_puff", "/obj/structure/sign/poster/contraband", {
	name: "Have a Puff",
	desc: "Who cares about lung cancer when you're high as a kite?",
	icon_state: "poster25",
});
rt.type(12601, "/obj/structure/sign/poster/contraband/revolver", "/obj/structure/sign/poster/contraband", {
	name: "Revolver",
	desc: "Because seven shots are all you need.",
	icon_state: "poster26",
});
rt.type(12602, "/obj/structure/sign/poster/contraband/d_day_promo", "/obj/structure/sign/poster/contraband", {
	name: "D-Day Promo",
	desc: "A promotional poster for some rapper.",
	icon_state: "poster27",
});
rt.type(12603, "/obj/structure/sign/poster/contraband/syndicate_pistol", "/obj/structure/sign/poster/contraband", {
	name: "Syndicate Pistol",
	desc: "A poster advertising syndicate pistols as being 'classy as fuck'. It is covered in faded gang tags.",
	icon_state: "poster28",
});
rt.type(12604, "/obj/structure/sign/poster/contraband/energy_swords", "/obj/structure/sign/poster/contraband", {
	name: "Energy Swords",
	desc: "All the colors of the bloody murder rainbow.",
	icon_state: "poster29",
});
rt.type(12605, "/obj/structure/sign/poster/contraband/red_rum", "/obj/structure/sign/poster/contraband", {
	name: "Red Rum",
	desc: "Looking at this poster makes you want to kill.",
	icon_state: "poster30",
});
rt.type(12606, "/obj/structure/sign/poster/contraband/cc64k_ad", "/obj/structure/sign/poster/contraband", {
	name: "CC 64K Ad",
	desc: "The latest portable computer from Comrade Computing, with a whole 64kB of ram!",
	icon_state: "poster31",
});
rt.type(12607, "/obj/structure/sign/poster/contraband/punch_shit", "/obj/structure/sign/poster/contraband", {
	name: "Punch Shit",
	desc: "Fight things for no reason, like a man!",
	icon_state: "poster32",
});
rt.type(12608, "/obj/structure/sign/poster/contraband/the_griffin", "/obj/structure/sign/poster/contraband", {
	name: "The Griffin",
	desc: "The Griffin commands you to be the worst you can be. Will you?",
	icon_state: "poster33",
});
rt.type(12609, "/obj/structure/sign/poster/contraband/lizard", "/obj/structure/sign/poster/contraband", {
	name: "Lizard",
	desc: "This lewd poster depicts a lizard preparing to mate.",
	icon_state: "poster34",
});
rt.type(12610, "/obj/structure/sign/poster/contraband/free_drone", "/obj/structure/sign/poster/contraband", {
	name: "Free Drone",
	desc: "This poster commemorates the bravery of the rogue drone banned by CentComm.",
	icon_state: "poster35",
});
rt.type(12611, "/obj/structure/sign/poster/contraband/busty_backdoor_xeno_babes_6", "/obj/structure/sign/poster/contraband", {
	name: "Busty Backdoor Xeno Babes 6",
	desc: "Get a load, or give, of these all natural Xenos!",
	icon_state: "poster36",
});
rt.type(12612, "/obj/structure/sign/poster/contraband/robust_softdrinks", "/obj/structure/sign/poster/contraband", {
	name: "Robust Softdrinks",
	desc: "Robust Softdrinks: More robust than a toolbox to the head!",
	icon_state: "poster37",
});
rt.type(12613, "/obj/structure/sign/poster/contraband/shamblers_juice", "/obj/structure/sign/poster/contraband", {
	name: "Shambler's Juice",
	desc: "~Shake me up some of that Shambler's Juice!~",
	icon_state: "poster38",
});
rt.type(12614, "/obj/structure/sign/poster/contraband/pwr_game", "/obj/structure/sign/poster/contraband", {
	name: "Pwr Game",
	desc: "The POWER that gamers CRAVE! In partnership with Vlad's Salad.",
	icon_state: "poster39",
});
rt.type(12615, "/obj/structure/sign/poster/contraband/sun_kist", "/obj/structure/sign/poster/contraband", {
	name: "Sun-kist",
	desc: "Drink the stars!",
	icon_state: "poster40",
});
rt.type(12616, "/obj/structure/sign/poster/contraband/space_cola", "/obj/structure/sign/poster/contraband", {
	name: "Space Cola",
	desc: "Your favorite cola, in space.",
	icon_state: "poster41",
});
rt.type(12617, "/obj/structure/sign/poster/contraband/space_up", "/obj/structure/sign/poster/contraband", {
	name: "Space-Up!",
	desc: "Sucked out into space by the FLAVOR!",
	icon_state: "poster42",
});
rt.type(12618, "/obj/structure/sign/poster/contraband/kudzu", "/obj/structure/sign/poster/contraband", {
	name: "Kudzu",
	desc: "A poster advertising a movie about plants. How dangerous could they possibly be?",
	icon_state: "poster43",
});
rt.type(12619, "/obj/structure/sign/poster/contraband/masked_men", "/obj/structure/sign/poster/contraband", {
	name: "Masked Men",
	desc: "A poster advertising a movie about some masked men.",
	icon_state: "poster44",
});
rt.type(12620, "/obj/structure/sign/poster/official", "/obj/structure/sign/poster", {
	poster_item_name: "motivational poster",
	poster_item_desc: "An official Nanotrasen-issued poster to foster a compliant and obedient workforce. It comes with state-of-the-art adhesive backing, for easy pinning to any vertical surface.",
	poster_item_icon_state: "rolled_legit",
});
rt.type(12621, "/obj/structure/sign/poster/official/random", "/obj/structure/sign/poster/official", {
	random_basetype: rt.typePath("/obj/structure/sign/poster/official"),
	never_random: 1,
	name: "random official poster",
	icon_state: "random_official",
});
rt.type(12622, "/obj/structure/sign/poster/official/here_for_your_safety", "/obj/structure/sign/poster/official", {
	name: "Here For Your Safety",
	desc: "A poster glorifying the station's security force.",
	icon_state: "poster1_legit",
});
rt.type(12623, "/obj/structure/sign/poster/official/nanotrasen_logo", "/obj/structure/sign/poster/official", {
	name: "Nanotrasen Logo",
	desc: "A poster depicting the Nanotrasen logo.",
	icon_state: "poster2_legit",
});
rt.type(12624, "/obj/structure/sign/poster/official/cleanliness", "/obj/structure/sign/poster/official", {
	name: "Cleanliness",
	desc: "A poster warning of the dangers of poor hygiene.",
	icon_state: "poster3_legit",
});
rt.type(12625, "/obj/structure/sign/poster/official/help_others", "/obj/structure/sign/poster/official", {
	name: "Help Others",
	desc: "A poster encouraging you to help fellow crewmembers.",
	icon_state: "poster4_legit",
});
rt.type(12626, "/obj/structure/sign/poster/official/build", "/obj/structure/sign/poster/official", {
	name: "Build",
	desc: "A poster glorifying the engineering team.",
	icon_state: "poster5_legit",
});
rt.type(12627, "/obj/structure/sign/poster/official/bless_this_spess", "/obj/structure/sign/poster/official", {
	name: "Bless This Spess",
	desc: "A poster blessing this area.",
	icon_state: "poster6_legit",
});
rt.type(12628, "/obj/structure/sign/poster/official/science", "/obj/structure/sign/poster/official", {
	name: "Science",
	desc: "A poster depicting an atom.",
	icon_state: "poster7_legit",
});
rt.type(12629, "/obj/structure/sign/poster/official/ian", "/obj/structure/sign/poster/official", {
	name: "Ian",
	desc: "Arf arf. Yap.",
	icon_state: "poster8_legit",
});
rt.type(12630, "/obj/structure/sign/poster/official/obey", "/obj/structure/sign/poster/official", {
	name: "Obey",
	desc: "A poster instructing the viewer to obey authority.",
	icon_state: "poster9_legit",
});
rt.type(12631, "/obj/structure/sign/poster/official/walk", "/obj/structure/sign/poster/official", {
	name: "Walk",
	desc: "A poster instructing the viewer to walk instead of running.",
	icon_state: "poster10_legit",
});
rt.type(12632, "/obj/structure/sign/poster/official/state_laws", "/obj/structure/sign/poster/official", {
	name: "State Laws",
	desc: "A poster instructing cyborgs to state their laws.",
	icon_state: "poster11_legit",
});
rt.type(12633, "/obj/structure/sign/poster/official/love_ian", "/obj/structure/sign/poster/official", {
	name: "Love Ian",
	desc: "Ian is love, Ian is life.",
	icon_state: "poster12_legit",
});
rt.type(12634, "/obj/structure/sign/poster/official/space_cops", "/obj/structure/sign/poster/official", {
	name: "Space Cops.",
	desc: "A poster advertising the television show Space Cops.",
	icon_state: "poster13_legit",
});
rt.type(12635, "/obj/structure/sign/poster/official/ue_no", "/obj/structure/sign/poster/official", {
	name: "Ue No.",
	desc: "This thing is all in Japanese.",
	icon_state: "poster14_legit",
});
rt.type(12636, "/obj/structure/sign/poster/official/get_your_legs", "/obj/structure/sign/poster/official", {
	name: "Get Your LEGS",
	desc: "LEGS: Leadership, Experience, Genius, Subordination.",
	icon_state: "poster15_legit",
});
rt.type(12637, "/obj/structure/sign/poster/official/do_not_question", "/obj/structure/sign/poster/official", {
	name: "Do Not Question",
	desc: "A poster instructing the viewer not to ask about things they aren't meant to know.",
	icon_state: "poster16_legit",
});
rt.type(12638, "/obj/structure/sign/poster/official/work_for_a_future", "/obj/structure/sign/poster/official", {
	name: "Work For A Future",
	desc: " A poster encouraging you to work for your future.",
	icon_state: "poster17_legit",
});
rt.type(12639, "/obj/structure/sign/poster/official/soft_cap_pop_art", "/obj/structure/sign/poster/official", {
	name: "Soft Cap Pop Art",
	desc: "A poster reprint of some cheap pop art.",
	icon_state: "poster18_legit",
});
rt.type(12640, "/obj/structure/sign/poster/official/safety_internals", "/obj/structure/sign/poster/official", {
	name: "Safety: Internals",
	desc: "A poster instructing the viewer to wear internals in the rare environments where there is no oxygen or the air has been rendered toxic.",
	icon_state: "poster19_legit",
});
rt.type(12641, "/obj/structure/sign/poster/official/safety_eye_protection", "/obj/structure/sign/poster/official", {
	name: "Safety: Eye Protection",
	desc: "A poster instructing the viewer to wear eye protection when dealing with chemicals, smoke, or bright lights.",
	icon_state: "poster20_legit",
});
rt.type(12642, "/obj/structure/sign/poster/official/safety_report", "/obj/structure/sign/poster/official", {
	name: "Safety: Report",
	desc: "A poster instructing the viewer to report suspicious activity to the security force.",
	icon_state: "poster21_legit",
});
rt.type(12643, "/obj/structure/sign/poster/official/report_crimes", "/obj/structure/sign/poster/official", {
	name: "Report Crimes",
	desc: "A poster encouraging the swift reporting of crime or seditious behavior to station security.",
	icon_state: "poster22_legit",
});
rt.type(12644, "/obj/structure/sign/poster/official/ion_rifle", "/obj/structure/sign/poster/official", {
	name: "Ion Rifle",
	desc: "A poster displaying an Ion Rifle.",
	icon_state: "poster23_legit",
});
rt.type(12645, "/obj/structure/sign/poster/official/foam_force_ad", "/obj/structure/sign/poster/official", {
	name: "Foam Force Ad",
	desc: "Foam Force, it's Foam or be Foamed!",
	icon_state: "poster24_legit",
});
rt.type(12646, "/obj/structure/sign/poster/official/cohiba_robusto_ad", "/obj/structure/sign/poster/official", {
	name: "Cohiba Robusto Ad",
	desc: "Cohiba Robusto, the classy cigar.",
	icon_state: "poster25_legit",
});
rt.type(12647, "/obj/structure/sign/poster/official/anniversary_vintage_reprint", "/obj/structure/sign/poster/official", {
	name: "50th Anniversary Vintage Reprint",
	desc: "A reprint of a poster from 2505, commemorating the 50th Aniversery of Nanoposters Manufacturing, a subsidary of Nanotrasen.",
	icon_state: "poster26_legit",
});
rt.type(12648, "/obj/structure/sign/poster/official/fruit_bowl", "/obj/structure/sign/poster/official", {
	name: "Fruit Bowl",
	desc: " Simple, yet awe-inspiring.",
	icon_state: "poster27_legit",
});
rt.type(12649, "/obj/structure/sign/poster/official/pda_ad", "/obj/structure/sign/poster/official", {
	name: "PDA Ad",
	desc: "A poster advertising the latest PDA from Nanotrasen suppliers.",
	icon_state: "poster28_legit",
});
rt.type(12650, "/obj/structure/sign/poster/official/enlist", "/obj/structure/sign/poster/official", {
	name: "Enlist",
	desc: "Enlist in the Nanotrasen Deathsquadron reserves today!",
	icon_state: "poster29_legit",
});
rt.type(12651, "/obj/structure/sign/poster/official/nanomichi_ad", "/obj/structure/sign/poster/official", {
	name: "Nanomichi Ad",
	desc: " A poster advertising Nanomichi brand audio cassettes.",
	icon_state: "poster30_legit",
});
rt.type(12652, "/obj/structure/sign/poster/official/twelve_gauge", "/obj/structure/sign/poster/official", {
	name: "12 Gauge",
	desc: "A poster boasting about the superiority of 12 gauge shotgun shells.",
	icon_state: "poster31_legit",
});
rt.type(12653, "/obj/structure/sign/poster/official/high_class_martini", "/obj/structure/sign/poster/official", {
	name: "High-Class Martini",
	desc: "I told you to shake it, no stirring.",
	icon_state: "poster32_legit",
});
rt.type(12654, "/obj/structure/sign/poster/official/the_owl", "/obj/structure/sign/poster/official", {
	name: "The Owl",
	desc: "The Owl would do his best to protect the station. Will you?",
	icon_state: "poster33_legit",
});
rt.type(12655, "/obj/structure/sign/poster/official/no_erp", "/obj/structure/sign/poster/official", {
	name: "No ERP",
	desc: "This poster reminds the crew that Eroticism, Rape and Pornography are banned on Nanotrasen stations.",
	icon_state: "poster34_legit",
});
rt.type(12656, "/obj/structure/sign/poster/official/wtf_is_co2", "/obj/structure/sign/poster/official", {
	name: "Carbon Dioxide",
	desc: "This informational poster teaches the viewer what carbon dioxide is.",
	icon_state: "poster35_legit",
});
rt.type(12701, "/obj/structure/glowshroom/glowcap", "/obj/structure/glowshroom", {
	myseed: rt.typePath("/obj/item/seeds/glowshroom/glowcap"),
	name: "glowcap",
	desc: "Mycena Ruthenia, a species of mushroom that, while it does glow in the dark, is not actually bioluminescent.",
	icon_state: "glowcap",
});
rt.type(12702, "/obj/structure/glowshroom/shadowshroom", "/obj/structure/glowshroom", {
	myseed: rt.typePath("/obj/item/seeds/glowshroom/shadowshroom"),
	name: "shadowshroom",
	desc: "Mycena Umbra, a species of mushroom that emits shadow instead of light.",
	icon_state: "shadowshroom",
});
rt.type(12703, "/obj/structure/glowshroom/single", "/obj/structure/glowshroom", {});
