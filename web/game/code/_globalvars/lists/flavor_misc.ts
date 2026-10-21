// From code/_globalvars/lists/flavor_misc.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8, "/datum/controller/global_vars", "/datum/controller", {
	gvars_datum_protected_varlist: null,
	gvars_datum_in_built_vars: null,
	gvars_datum_init_order: null,
	name: "Global Variables",
}, { global: { clockwork_construction_value: 5, clockwork_caches: 6, active_daemons: 7, all_clockwork_objects: 8, all_clockwork_mobs: 9, clockwork_component_cache: 10, ratvar_awakens: 11, clockwork_gateway_activated: 12, all_scripture: 13, bitflags: 14, pointed_types: 15, bloody_footprints_cache: 16, ghost_accs_options: 17, ghost_others_options: 18, special_roles: 19, string_cache: 20, string_filename_current_key: 21, cmp_field: 22, friendly_animal_types: 23, E: 24, Sqrt2: 25, sqrtTable: 26, skin_tones: 27, species_list: 28, roundstart_species: 29, command_name: 30, syndicate_code_phrase: 31, syndicate_code_response: 32, zero_character_only: 33, hex_characters: 34, alphabet: 35, binary: 36, midnight_rollovers: 37, rollovercheck_last_timeofday: 38, can_embed_types: 39, WALLITEMS: 40, WALLITEMS_EXTERNAL: 41, WALLITEMS_INVERSE: 42, dview_mob: 43, valid_HTTPSGet: 44, sortInstance: 45, revdata: 46, host: 47, join_motd: 48, station_name: 49, game_version: 50, changelog_hash: 51, ooc_allowed: 52, dooc_allowed: 53, abandon_allowed: 54, enter_allowed: 55, guests_allowed: 56, shuttle_frozen: 57, shuttle_left: 58, tinted_weldhelh: 59, Debug: 60, Debug2: 61, MAX_EX_DEVESTATION_RANGE: 62, MAX_EX_HEAVY_RANGE: 63, MAX_EX_LIGHT_RANGE: 64, MAX_EX_FLASH_RANGE: 65, MAX_EX_FLAME_RANGE: 66, DYN_EX_SCALE: 67, master_mode: 68, secret_force_mode: 69, wavesecret: 70, start_state: 71, blood_target: 72, blood_target_image: 73, blood_target_reset_timer: 74, sac_mind: 75, sac_image: 76, cult_vote_called: 77, cult_mastered: 78, reckoning_complete: 79, sac_complete: 80, cult_narsie: 81, summon_spots: 82, NEARSIGHTBLOCK: 83, EPILEPSYBLOCK: 84, COUGHBLOCK: 85, TOURETTESBLOCK: 86, NERVOUSBLOCK: 87, BLINDBLOCK: 88, DEAFBLOCK: 89, HULKBLOCK: 90, TELEBLOCK: 91, FIREBLOCK: 92, XRAYBLOCK: 93, CLUMSYBLOCK: 94, STRANGEBLOCK: 95, RACEBLOCK: 96, bad_se_blocks: 97, good_se_blocks: 98, op_se_blocks: 99, NULLED_SE: 100, NULLED_UI: 101, global_mutations: 102, bad_mutations: 103, good_mutations: 104, not_good_mutations: 105, log_directory: 106, world_game_log: 107, world_runtime_log: 108, world_attack_log: 109, world_href_log: 110, round_id: 111, config_error_log: 112, bombers: 113, admin_log: 114, lastsignalers: 115, lawchanges: 116, combatlog: 117, IClog: 118, OOClog: 119, adminlog: 120, individual_log_list: 121, active_turfs_startlist: 122, admin_notice: 123, timezoneOffset: 124, fileaccess_timer: 125, TAB: 126, data_core: 127, CELLRATE: 128, CHARGELEVEL: 129, powernets: 130, bsa_unlock: 131, hair_styles_list: 132, hair_styles_male_list: 133, hair_styles_female_list: 134, facial_hair_styles_list: 135, facial_hair_styles_male_list: 136, facial_hair_styles_female_list: 137, underwear_list: 138, underwear_m: 139, underwear_f: 140, undershirt_list: 141, undershirt_m: 142, undershirt_f: 143, socks_list: 144, body_markings_list: 145, tails_list_lizard: 146, animated_tails_list_lizard: 147, snouts_list: 148, horns_list: 149, frills_list: 150, spines_list: 151, legs_list: 152, animated_spines_list: 153, tails_list_human: 154, animated_tails_list_human: 155, ears_list: 156, wings_list: 157, wings_open_list: 158, r_wings_list: 159, ghost_forms_with_directions_list: 160, ghost_forms_with_accessories_list: 161, security_depts_prefs: 162, backbaglist: 163, uplink_spawn_loc_list: 164, female_clothing_icons: 165, hit_appends: 166, scarySounds: 167, TAGGERLOCATIONS: 168, guitar_notes: 169, station_prefixes: 170, station_names: 171, station_suffixes: 172, greek_letters: 173, phonetic_alphabet: 174, numbers_as_words: 175, station_numerals: 176, admiral_messages: 177, maintenance_loot: 178, cardinal: 179, alldirs: 180, diagonals: 181, accessable_z_levels: 182, global_map: 183, landmarks_list: 184, start_landmarks_list: 185, department_security_spawns: 186, generic_event_spawns: 187, wizardstart: 188, newplayer_start: 189, prisonwarp: 190, holdingfacility: 191, xeno_spawn: 192, tdome1: 193, tdome2: 194, tdomeobserve: 195, tdomeadmin: 196, prisonwarped: 197, blobstart: 198, secequipment: 199, deathsquadspawn: 200, emergencyresponseteamspawn: 201, ruin_landmarks: 202, awaydestinations: 203, sortedAreas: 204, all_abstract_markers: 205, commendations: 206, clients: 207, admins: 208, deadmins: 209, directory: 210, stealthminID: 211, player_list: 212, mob_list: 213, mob_directory: 214, living_mob_list: 215, dead_mob_list: 216, joined_player_list: 217, silicon_mobs: 218, ai_list: 219, pai_list: 220, available_ai_shells: 221, simple_animals: 222, language_datum_instances: 223, all_languages: 224, ai_names: 225, wizard_first: 226, wizard_second: 227, ninja_titles: 228, ninja_names: 229, commando_names: 230, first_names_male: 231, first_names_female: 232, last_names: 233, lizard_names_male: 234, lizard_names_female: 235, clown_names: 236, mime_names: 237, carp_names: 238, golem_names: 239, plasmaman_names: 240, posibrain_names: 241, verbs: 242, adjectives: 243, cable_list: 244, portals: 245, airlocks: 246, mechas_list: 247, shuttle_caller_list: 248, machines: 249, syndicate_shuttle_boards: 250, navbeacons: 251, teleportbeacons: 252, deliverybeacons: 253, deliverybeacontags: 254, nuke_list: 255, alarmdisplay: 256, singularities: 257, chemical_reactions_list: 258, chemical_reagents_list: 259, materials_list: 260, tech_list: 261, surgeries_list: 262, crafting_recipes: 263, rcd_list: 264, apcs_list: 265, tracked_implants: 266, tracked_chem_implants: 267, poi_list: 268, pinpointer_list: 269, zombie_infection_list: 270, meteor_list: 271, active_jammers: 272, ladders: 273, trophy_cases: 274, wire_color_directory: 275, wire_name_directory: 276, ai_status_displays: 277, poll_ignore: 278, typecache_mob: 279, runechat_colors: 280, lighting_update_lights: 281, lighting_update_corners: 282, lighting_update_objects: 283, explosions: 284, huds: 285, mutations_list: 286, allDevils: 287, lawlorify: 288, devil_pre_title: 289, devil_title: 290, devil_syllable: 291, devil_suffix: 292, active_alternate_appearances: 293, blood_splatter_icons: 294, all_radios: 295, radiochannels: 296, reverseradiochannels: 297, SYND_FREQ: 298, SUPP_FREQ: 299, SERV_FREQ: 300, SCI_FREQ: 301, COMM_FREQ: 302, MED_FREQ: 303, ENG_FREQ: 304, SEC_FREQ: 305, CENTCOM_FREQ: 306, AIPRIV_FREQ: 307, REDTEAM_FREQ: 308, BLUETEAM_FREQ: 309, RADIO_TO_AIRALARM: 310, RADIO_FROM_AIRALARM: 311, RADIO_CHAT: 312, RADIO_ATMOSIA: 313, RADIO_NAVBEACONS: 314, RADIO_AIRLOCK: 315, RADIO_MAGNETS: 316, freqtospan: 317, teleportlocs: 318, the_station_areas: 319, possible_items: 320, possible_items_special: 321, blobs: 322, blob_cores: 323, overminds: 324, blob_nodes: 325, blobs_legit: 326, possible_changeling_IDs: 327, slots: 328, slot2slot: 329, slot2type: 330, hivemind_bank: 331, sacrificed: 332, rune_types: 333, teleport_runes: 334, wall_runes: 335, gang_name_pool: 336, gang_colors_pool: 337, gang_outfit_pool: 338, blacklisted_malf_machines: 339, meteor_wave_delay: 340, meteors_normal: 341, meteors_threatening: 342, meteors_catastrophic: 343, meteorsB: 344, meteorsC: 345, meteorsSPOOKY: 346, hsboxspawn: 347, announcement_systems: 348, doppler_arrays: 349, news_network: 350, allCasters: 351, req_console_assistance: 352, req_console_supplies: 353, req_console_information: 354, allConsoles: 355, time_last_changed_position: 356, crewmonitor: 357, possible_uplinker_IDs: 358, pipeID2State: 359, telecomms_list: 360, recentmessages: 361, message_delay: 362, year: 363, year_integer: 364, fire_overlay: 365, rpg_loot_items: 366, acid_overlay: 367, GPS_list: 368, PDAs: 369, rod_recipes: 370, glass_recipes: 371, reinforced_glass_recipes: 372, human_recipes: 373, corgi_recipes: 374, monkey_recipes: 375, xeno_recipes: 376, leather_recipes: 377, sinew_recipes: 378, sandstone_recipes: 379, sandbag_recipes: 380, diamond_recipes: 381, uranium_recipes: 382, plasma_recipes: 383, gold_recipes: 384, silver_recipes: 385, clown_recipes: 386, titanium_recipes: 387, plastitanium_recipes: 388, snow_recipes: 389, adamantine_recipes: 390, abductor_recipes: 391, metal_recipes: 392, plasteel_recipes: 393, wood_recipes: 394, cloth_recipes: 395, cardboard_recipes: 396, runed_metal_recipes: 397, brass_recipes: 398, plastic_recipes: 399, paperframe_recipes: 400, disposalpipeID2State: 401, RPD_recipes: 402, biblenames: 403, biblestates: 404, bibleitemstates: 405, globalBlankCanvases: 406, crematoriums: 407, admin_ranks: 408, admin_verbs_default: 409, admin_verbs_admin: 410, admin_verbs_ban: 411, admin_verbs_sounds: 412, admin_verbs_fun: 413, admin_verbs_spawn: 414, admin_verbs_server: 415, admin_verbs_debug: 416, admin_verbs_possess: 417, admin_verbs_permissions: 418, admin_verbs_poll: 419, admin_verbs_hideable: 420, admin_datums: 421, CMinutes: 422, Banlist: 423, whitelist: 424, ahelp_tickets: 425, AdminProcCaller: 426, AdminProcCallCount: 427, admin_verbs_debug_mapping: 428, say_disabled: 429, VVlocked: 430, VVicon_edit_lock: 431, VVckey_edit: 432, VVpixelmovement: 433, highlander: 434, custom_outfits: 435, meta_gas_info: 436, gaslist_cache: 437, hardcoded_gases: 438, the_gateway: 439, potentialRandomZlevels: 440, sc_safecode1: 441, sc_safecode2: 442, sc_safecode3: 443, sc_safecode4: 444, sc_safecode5: 445, exports_list: 446, asset_datums: 447, clientmessages: 448, preferences_datums: 449, ghost_forms: 450, ghost_orbits: 451, normal_ooc_colour: 452, total_runtimes: 453, total_runtimes_skipped: 454, error_cache: 455, iconCache: 456, debugFileOutput: 457, duplicate_forbidden_vars: 458, html_interfaces: 459, access_security: 460, access_brig: 461, access_armory: 462, access_forensics_lockers: 463, access_medical: 464, access_morgue: 465, access_tox: 466, access_tox_storage: 467, access_genetics: 468, access_engine: 469, access_engine_equip: 470, access_maint_tunnels: 471, access_external_airlocks: 472, access_emergency_storage: 473, access_change_ids: 474, access_ai_upload: 475, access_teleporter: 476, access_eva: 477, access_heads: 478, access_captain: 479, access_all_personal_lockers: 480, access_chapel_office: 481, access_tech_storage: 482, access_atmospherics: 483, access_bar: 484, access_janitor: 485, access_crematorium: 486, access_kitchen: 487, access_robotics: 488, access_rd: 489, access_cargo: 490, access_construction: 491, access_chemistry: 492, access_cargo_bot: 493, access_hydroponics: 494, access_manufacturing: 495, access_library: 496, access_lawyer: 497, access_virology: 498, access_cmo: 499, access_qm: 500, access_court: 501, access_surgery: 502, access_theatre: 503, access_research: 504, access_mining: 505, access_mining_office: 506, access_mailsorting: 507, access_mint: 508, access_mint_vault: 509, access_heads_vault: 510, access_mining_station: 511, access_xenobiology: 512, access_ce: 513, access_hop: 514, access_hos: 515, access_RC_announce: 516, access_keycard_auth: 517, access_tcomsat: 518, access_gateway: 519, access_sec_doors: 520, access_mineral_storeroom: 521, access_minisat: 522, access_weapons: 523, access_network: 524, access_cloning: 525, access_cent_general: 526, access_cent_thunder: 527, access_cent_specops: 528, access_cent_medical: 529, access_cent_living: 530, access_cent_storage: 531, access_cent_teleporter: 532, access_cent_captain: 533, access_cent_bar: 534, access_syndicate: 535, access_syndicate_leader: 536, access_away_general: 537, access_away_maint: 538, access_away_med: 539, access_away_sec: 540, access_away_engine: 541, access_away_generic1: 542, access_away_generic2: 543, access_away_generic3: 544, access_away_generic4: 545, command_positions: 546, engineering_positions: 547, medical_positions: 548, science_positions: 549, supply_positions: 550, civilian_positions: 551, security_positions: 552, nonhuman_positions: 553, available_depts: 554, cachedbooks: 555, LIGHTING_CORNER_DIAGONAL: 556, all_lighting_objects: 557, use_preloader: 558, _preloader: 559, total_extraction_beacons: 560, marker_beacon_colors: 561, ghost_images_default: 562, ghost_images_simple: 563, observer_default_invisibility: 564, department_radio_prefixes: 565, department_radio_keys: 566, ventcrawl_machinery: 567, posibrain_notify_cooldown: 568, vox_sounds: 569, cameranet: 570, parasites: 571, protected_objects: 572, AISwarmers: 573, AISwarmersByType: 574, AISwarmerCapsByType: 575, ntnet_global: 576, employmentCabinets: 577, cable_coil_recipes: 578, gravity_generators: 579, rad_collectors: 580, blacklisted_tesla_types: 581, message_servers: 582, necropolis_gate: 583, keycard_events: 584, emergency_access: 585, security_level: 586, reboot_mode: 587, blacklisted_cargo_types: 588, z_levels_list: 589, spells: 590, FrozenAccounts: 591, stockExchange: 592, admin_state: 593, always_state: 594, conscious_state: 595, contained_state: 596, deep_inventory_state: 597, default_state: 598, hands_state: 599, human_adjacent_state: 600, inventory_state: 601, language_menu_state: 602, not_incapacitated_state: 603, not_incapacitated_turf_state: 604, notcontained_state: 605, observer_state: 606, physical_state: 607, self_state: 608, z_state: 609, uplinks: 610, uplink_items: 611, menulist: 612 }, const: ["SYND_FREQ","SUPP_FREQ","SERV_FREQ","SCI_FREQ","COMM_FREQ","MED_FREQ","ENG_FREQ","SEC_FREQ","CENTCOM_FREQ","AIPRIV_FREQ","REDTEAM_FREQ","BLUETEAM_FREQ","access_security","access_brig","access_armory","access_forensics_lockers","access_medical","access_morgue","access_tox","access_tox_storage","access_genetics","access_engine","access_engine_equip","access_maint_tunnels","access_external_airlocks","access_emergency_storage","access_change_ids","access_ai_upload","access_teleporter","access_eva","access_heads","access_captain","access_all_personal_lockers","access_chapel_office","access_tech_storage","access_atmospherics","access_bar","access_janitor","access_crematorium","access_kitchen","access_robotics","access_rd","access_cargo","access_construction","access_chemistry","access_cargo_bot","access_hydroponics","access_manufacturing","access_library","access_lawyer","access_virology","access_cmo","access_qm","access_court","access_surgery","access_theatre","access_research","access_mining","access_mining_office","access_mailsorting","access_mint","access_mint_vault","access_heads_vault","access_mining_station","access_xenobiology","access_ce","access_hop","access_hos","access_RC_announce","access_keycard_auth","access_tcomsat","access_gateway","access_sec_doors","access_mineral_storeroom","access_minisat","access_weapons","access_network","access_cloning","access_cent_general","access_cent_thunder","access_cent_specops","access_cent_medical","access_cent_living","access_cent_storage","access_cent_teleporter","access_cent_captain","access_cent_bar","access_syndicate","access_syndicate_leader","access_away_general","access_away_maint","access_away_med","access_away_sec","access_away_engine","access_away_generic1","access_away_generic2","access_away_generic3","access_away_generic4"] });

// /datum/controller/global_vars/proc/InitGlobalhair_styles_list  (code/_globalvars/lists/flavor_misc.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGlobalhair_styles_list", function InitGlobalhair_styles_list(f: Frame) {
	rt.setGl("hair_styles_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "hair_styles_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalhair_styles_male_list  (code/_globalvars/lists/flavor_misc.dm:4)
rt.def("/datum/controller/global_vars/proc/InitGlobalhair_styles_male_list", function InitGlobalhair_styles_male_list(f: Frame) {
	rt.setGl("hair_styles_male_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "hair_styles_male_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalhair_styles_female_list  (code/_globalvars/lists/flavor_misc.dm:5)
rt.def("/datum/controller/global_vars/proc/InitGlobalhair_styles_female_list", function InitGlobalhair_styles_female_list(f: Frame) {
	rt.setGl("hair_styles_female_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "hair_styles_female_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalfacial_hair_styles_list  (code/_globalvars/lists/flavor_misc.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobalfacial_hair_styles_list", function InitGlobalfacial_hair_styles_list(f: Frame) {
	rt.setGl("facial_hair_styles_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "facial_hair_styles_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalfacial_hair_styles_male_list  (code/_globalvars/lists/flavor_misc.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalfacial_hair_styles_male_list", function InitGlobalfacial_hair_styles_male_list(f: Frame) {
	rt.setGl("facial_hair_styles_male_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "facial_hair_styles_male_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalfacial_hair_styles_female_list  (code/_globalvars/lists/flavor_misc.dm:8)
rt.def("/datum/controller/global_vars/proc/InitGlobalfacial_hair_styles_female_list", function InitGlobalfacial_hair_styles_female_list(f: Frame) {
	rt.setGl("facial_hair_styles_female_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "facial_hair_styles_female_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalunderwear_list  (code/_globalvars/lists/flavor_misc.dm:10)
rt.def("/datum/controller/global_vars/proc/InitGlobalunderwear_list", function InitGlobalunderwear_list(f: Frame) {
	rt.setGl("underwear_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "underwear_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalunderwear_m  (code/_globalvars/lists/flavor_misc.dm:11)
rt.def("/datum/controller/global_vars/proc/InitGlobalunderwear_m", function InitGlobalunderwear_m(f: Frame) {
	rt.setGl("underwear_m", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "underwear_m", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalunderwear_f  (code/_globalvars/lists/flavor_misc.dm:12)
rt.def("/datum/controller/global_vars/proc/InitGlobalunderwear_f", function InitGlobalunderwear_f(f: Frame) {
	rt.setGl("underwear_f", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "underwear_f", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalundershirt_list  (code/_globalvars/lists/flavor_misc.dm:14)
rt.def("/datum/controller/global_vars/proc/InitGlobalundershirt_list", function InitGlobalundershirt_list(f: Frame) {
	rt.setGl("undershirt_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "undershirt_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalundershirt_m  (code/_globalvars/lists/flavor_misc.dm:15)
rt.def("/datum/controller/global_vars/proc/InitGlobalundershirt_m", function InitGlobalundershirt_m(f: Frame) {
	rt.setGl("undershirt_m", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "undershirt_m", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalundershirt_f  (code/_globalvars/lists/flavor_misc.dm:16)
rt.def("/datum/controller/global_vars/proc/InitGlobalundershirt_f", function InitGlobalundershirt_f(f: Frame) {
	rt.setGl("undershirt_f", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "undershirt_f", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsocks_list  (code/_globalvars/lists/flavor_misc.dm:18)
rt.def("/datum/controller/global_vars/proc/InitGlobalsocks_list", function InitGlobalsocks_list(f: Frame) {
	rt.setGl("socks_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "socks_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalbody_markings_list  (code/_globalvars/lists/flavor_misc.dm:20)
rt.def("/datum/controller/global_vars/proc/InitGlobalbody_markings_list", function InitGlobalbody_markings_list(f: Frame) {
	rt.setGl("body_markings_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "body_markings_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaltails_list_lizard  (code/_globalvars/lists/flavor_misc.dm:21)
rt.def("/datum/controller/global_vars/proc/InitGlobaltails_list_lizard", function InitGlobaltails_list_lizard(f: Frame) {
	rt.setGl("tails_list_lizard", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "tails_list_lizard", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalanimated_tails_list_lizard  (code/_globalvars/lists/flavor_misc.dm:22)
rt.def("/datum/controller/global_vars/proc/InitGlobalanimated_tails_list_lizard", function InitGlobalanimated_tails_list_lizard(f: Frame) {
	rt.setGl("animated_tails_list_lizard", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "animated_tails_list_lizard", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsnouts_list  (code/_globalvars/lists/flavor_misc.dm:23)
rt.def("/datum/controller/global_vars/proc/InitGlobalsnouts_list", function InitGlobalsnouts_list(f: Frame) {
	rt.setGl("snouts_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "snouts_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalhorns_list  (code/_globalvars/lists/flavor_misc.dm:24)
rt.def("/datum/controller/global_vars/proc/InitGlobalhorns_list", function InitGlobalhorns_list(f: Frame) {
	rt.setGl("horns_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "horns_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalfrills_list  (code/_globalvars/lists/flavor_misc.dm:25)
rt.def("/datum/controller/global_vars/proc/InitGlobalfrills_list", function InitGlobalfrills_list(f: Frame) {
	rt.setGl("frills_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "frills_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalspines_list  (code/_globalvars/lists/flavor_misc.dm:26)
rt.def("/datum/controller/global_vars/proc/InitGlobalspines_list", function InitGlobalspines_list(f: Frame) {
	rt.setGl("spines_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "spines_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGloballegs_list  (code/_globalvars/lists/flavor_misc.dm:27)
rt.def("/datum/controller/global_vars/proc/InitGloballegs_list", function InitGloballegs_list(f: Frame) {
	rt.setGl("legs_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "legs_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalanimated_spines_list  (code/_globalvars/lists/flavor_misc.dm:28)
rt.def("/datum/controller/global_vars/proc/InitGlobalanimated_spines_list", function InitGlobalanimated_spines_list(f: Frame) {
	rt.setGl("animated_spines_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "animated_spines_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaltails_list_human  (code/_globalvars/lists/flavor_misc.dm:31)
rt.def("/datum/controller/global_vars/proc/InitGlobaltails_list_human", function InitGlobaltails_list_human(f: Frame) {
	rt.setGl("tails_list_human", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "tails_list_human", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalanimated_tails_list_human  (code/_globalvars/lists/flavor_misc.dm:32)
rt.def("/datum/controller/global_vars/proc/InitGlobalanimated_tails_list_human", function InitGlobalanimated_tails_list_human(f: Frame) {
	rt.setGl("animated_tails_list_human", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "animated_tails_list_human", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalears_list  (code/_globalvars/lists/flavor_misc.dm:33)
rt.def("/datum/controller/global_vars/proc/InitGlobalears_list", function InitGlobalears_list(f: Frame) {
	rt.setGl("ears_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "ears_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalwings_list  (code/_globalvars/lists/flavor_misc.dm:34)
rt.def("/datum/controller/global_vars/proc/InitGlobalwings_list", function InitGlobalwings_list(f: Frame) {
	rt.setGl("wings_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "wings_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalwings_open_list  (code/_globalvars/lists/flavor_misc.dm:35)
rt.def("/datum/controller/global_vars/proc/InitGlobalwings_open_list", function InitGlobalwings_open_list(f: Frame) {
	rt.setGl("wings_open_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "wings_open_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalr_wings_list  (code/_globalvars/lists/flavor_misc.dm:36)
rt.def("/datum/controller/global_vars/proc/InitGlobalr_wings_list", function InitGlobalr_wings_list(f: Frame) {
	rt.setGl("r_wings_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "r_wings_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalghost_forms_with_directions_list  (code/_globalvars/lists/flavor_misc.dm:38)
rt.def("/datum/controller/global_vars/proc/InitGlobalghost_forms_with_directions_list", function InitGlobalghost_forms_with_directions_list(f: Frame) {
	rt.setGl("ghost_forms_with_directions_list", rt.list("ghost"));
	rt.modSrcVar(f, "gvars_datum_init_order", "ghost_forms_with_directions_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalghost_forms_with_accessories_list  (code/_globalvars/lists/flavor_misc.dm:39)
rt.def("/datum/controller/global_vars/proc/InitGlobalghost_forms_with_accessories_list", function InitGlobalghost_forms_with_accessories_list(f: Frame) {
	rt.setGl("ghost_forms_with_accessories_list", rt.list("ghost"));
	rt.modSrcVar(f, "gvars_datum_init_order", "ghost_forms_with_accessories_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsecurity_depts_prefs  (code/_globalvars/lists/flavor_misc.dm:41)
rt.def("/datum/controller/global_vars/proc/InitGlobalsecurity_depts_prefs", function InitGlobalsecurity_depts_prefs(f: Frame) {
	rt.setGl("security_depts_prefs", rt.list("Random", "None", "Engineering", "Medical", "Science", "Supply"));
	rt.modSrcVar(f, "gvars_datum_init_order", "security_depts_prefs", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalbackbaglist  (code/_globalvars/lists/flavor_misc.dm:51)
rt.def("/datum/controller/global_vars/proc/InitGlobalbackbaglist", function InitGlobalbackbaglist(f: Frame) {
	rt.setGl("backbaglist", rt.list("Department Backpack", "Department Satchel", "Department Duffel Bag", "Grey Backpack", "Grey Satchel", "Grey Duffel Bag", "Leather Satchel"));
	rt.modSrcVar(f, "gvars_datum_init_order", "backbaglist", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaluplink_spawn_loc_list  (code/_globalvars/lists/flavor_misc.dm:57)
rt.def("/datum/controller/global_vars/proc/InitGlobaluplink_spawn_loc_list", function InitGlobaluplink_spawn_loc_list(f: Frame) {
	rt.setGl("uplink_spawn_loc_list", rt.list("PDA", "Radio", "Pen"));
	rt.modSrcVar(f, "gvars_datum_init_order", "uplink_spawn_loc_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalfemale_clothing_icons  (code/_globalvars/lists/flavor_misc.dm:60)
rt.def("/datum/controller/global_vars/proc/InitGlobalfemale_clothing_icons", function InitGlobalfemale_clothing_icons(f: Frame) {
	rt.setGl("female_clothing_icons", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "female_clothing_icons", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalhit_appends  (code/_globalvars/lists/flavor_misc.dm:63)
rt.def("/datum/controller/global_vars/proc/InitGlobalhit_appends", function InitGlobalhit_appends(f: Frame) {
	rt.setGl("hit_appends", rt.list("-OOF", "-ACK", "-UGH", "-HRNK", "-HURGH", "-GLORF"));
	rt.modSrcVar(f, "gvars_datum_init_order", "hit_appends", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalscarySounds  (code/_globalvars/lists/flavor_misc.dm:65)
rt.def("/datum/controller/global_vars/proc/InitGlobalscarySounds", function InitGlobalscarySounds(f: Frame) {
	rt.setGl("scarySounds", rt.list(rt.rsc("sound/weapons/thudswoosh.ogg"), rt.rsc("sound/weapons/taser.ogg"), rt.rsc("sound/weapons/armbomb.ogg"), rt.rsc("sound/voice/hiss1.ogg"), rt.rsc("sound/voice/hiss2.ogg"), rt.rsc("sound/voice/hiss3.ogg"), rt.rsc("sound/voice/hiss4.ogg"), rt.rsc("sound/voice/hiss5.ogg"), rt.rsc("sound/voice/hiss6.ogg"), rt.rsc("sound/effects/glassbr1.ogg"), rt.rsc("sound/effects/glassbr2.ogg"), rt.rsc("sound/effects/glassbr3.ogg"), rt.rsc("sound/items/welder.ogg"), rt.rsc("sound/items/welder2.ogg"), rt.rsc("sound/machines/airlock.ogg"), rt.rsc("sound/effects/clownstep1.ogg"), rt.rsc("sound/effects/clownstep2.ogg")));
	rt.modSrcVar(f, "gvars_datum_init_order", "scarySounds", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalTAGGERLOCATIONS  (code/_globalvars/lists/flavor_misc.dm:99)
rt.def("/datum/controller/global_vars/proc/InitGlobalTAGGERLOCATIONS", function InitGlobalTAGGERLOCATIONS(f: Frame) {
	rt.setGl("TAGGERLOCATIONS", rt.list("Disposals", "Cargo Bay", "QM Office", "Engineering", "CE Office", "Atmospherics", "Security", "HoS Office", "Medbay", "CMO Office", "Chemistry", "Research", "RD Office", "Robotics", "HoP Office", "Library", "Chapel", "Theatre", "Bar", "Kitchen", "Hydroponics", "Janitor Closet", "Genetics"));
	rt.modSrcVar(f, "gvars_datum_init_order", "TAGGERLOCATIONS", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalguitar_notes  (code/_globalvars/lists/flavor_misc.dm:106)
rt.def("/datum/controller/global_vars/proc/InitGlobalguitar_notes", function InitGlobalguitar_notes(f: Frame) {
	rt.setGl("guitar_notes", rt.call(f, P("/proc/flist"), null, ["sound/guitar/"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "guitar_notes", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalstation_prefixes  (code/_globalvars/lists/flavor_misc.dm:108)
rt.def("/datum/controller/global_vars/proc/InitGlobalstation_prefixes", function InitGlobalstation_prefixes(f: Frame) {
	rt.setGl("station_prefixes", rt.list("", "Imperium", "Heretical", "Cuban", "Psychic", "Elegant", "Common", "Uncommon", "Rare", "Unique", "Houseruled", "Religious", "Atheist", "Traditional", "Houseruled", "Mad", "Super", "Ultra", "Secret", "Top Secret", "Deep", "Death", "Zybourne", "Central", "Main", "Government", "Uoi", "Fat", "Automated", "Experimental", "Augmented"));
	rt.modSrcVar(f, "gvars_datum_init_order", "station_prefixes", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalstation_names  (code/_globalvars/lists/flavor_misc.dm:115)
rt.def("/datum/controller/global_vars/proc/InitGlobalstation_names", function InitGlobalstation_names(f: Frame) {
	rt.setGl("station_names", rt.list("", "Stanford", "Dorf", "Alium", "Prefix", "Clowning", "Aegis", "Ishimura", "Scaredy", "Death-World", "Mime", "Honk", "Rogue", "MacRagge", "Ultrameens", "Safety", "Paranoia", "Explosive", "Neckbear", "Donk", "Muppet", "North", "West", "East", "South", "Slant-ways", "Widdershins", "Rimward", "Expensive", "Procreatory", "Imperial", "Unidentified", "Immoral", "Carp", "Ork", "Pete", "Control", "Nettle", "Aspie", "Class", "Crab", "Fist", "Corrogated", "Skeleton", "Race", "Fatguy", "Gentleman", "Capitalist", "Communist", "Bear", "Beard", "Derp", "Space", "Spess", "Star", "Moon", "System", "Mining", "Neckbeard", "Research", "Supply", "Military", "Orbital", "Battle", "Science", "Asteroid", "Home", "Production", "Transport", "Delivery", "Extraplanetary", "Orbital", "Correctional", "Robot", "Hats", "Pizza"));
	rt.modSrcVar(f, "gvars_datum_init_order", "station_names", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalstation_suffixes  (code/_globalvars/lists/flavor_misc.dm:129)
rt.def("/datum/controller/global_vars/proc/InitGlobalstation_suffixes", function InitGlobalstation_suffixes(f: Frame) {
	rt.setGl("station_suffixes", rt.list("Station", "Frontier", "Suffix", "Death-trap", "Space-hulk", "Lab", "Hazard", "Spess Junk", "Fishery", "No-Moon", "Tomb", "Crypt", "Hut", "Monkey", "Bomb", "Trade Post", "Fortress", "Village", "Town", "City", "Edition", "Hive", "Complex", "Base", "Facility", "Depot", "Outpost", "Installation", "Drydock", "Observatory", "Array", "Relay", "Monitor", "Platform", "Construct", "Hangar", "Prison", "Center", "Port", "Waystation", "Factory", "Waypoint", "Stopover", "Hub", "HQ", "Office", "Object", "Fortification", "Colony", "Planet-Cracker", "Roost", "Fat Camp", "Airstrip"));
	rt.modSrcVar(f, "gvars_datum_init_order", "station_suffixes", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalgreek_letters  (code/_globalvars/lists/flavor_misc.dm:140)
rt.def("/datum/controller/global_vars/proc/InitGlobalgreek_letters", function InitGlobalgreek_letters(f: Frame) {
	rt.setGl("greek_letters", rt.list("Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi", "Rho", "Sigma", "Tau", "Upsilon", "Phi", "Chi", "Psi", "Omega"));
	rt.modSrcVar(f, "gvars_datum_init_order", "greek_letters", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalphonetic_alphabet  (code/_globalvars/lists/flavor_misc.dm:145)
rt.def("/datum/controller/global_vars/proc/InitGlobalphonetic_alphabet", function InitGlobalphonetic_alphabet(f: Frame) {
	rt.setGl("phonetic_alphabet", rt.list("Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey", "X-ray", "Yankee", "Zulu"));
	rt.modSrcVar(f, "gvars_datum_init_order", "phonetic_alphabet", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalnumbers_as_words  (code/_globalvars/lists/flavor_misc.dm:151)
rt.def("/datum/controller/global_vars/proc/InitGlobalnumbers_as_words", function InitGlobalnumbers_as_words(f: Frame) {
	rt.setGl("numbers_as_words", rt.list("One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"));
	rt.modSrcVar(f, "gvars_datum_init_order", "numbers_as_words", add);
	return f.dot;
});

// /proc/generate_number_strings  (code/_globalvars/lists/flavor_misc.dm:158)
rt.def("/proc/generate_number_strings", function generate_number_strings(f: Frame) {
	let L: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [L, i, $e];
	L = null;
	i = null;
	rt.forRange(f, 0, 1, 99, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		L = rt.modify(live(L), fmt("＀", [live(i)]), add);
		L = rt.modify(live(L), fmt("３！", [live(i)]), add);
	}
	rt.endFor(f, 0);
	return live(L);
});

// /datum/controller/global_vars/proc/InitGlobalstation_numerals  (code/_globalvars/lists/flavor_misc.dm:163)
rt.def("/datum/controller/global_vars/proc/InitGlobalstation_numerals", function InitGlobalstation_numerals(f: Frame) {
	rt.setGl("station_numerals", add(add(add(rt.gl("greek_letters"), rt.gl("phonetic_alphabet")), rt.gl("numbers_as_words")), rt.call(f, P("/proc/generate_number_strings"), null, [])));
	rt.modSrcVar(f, "gvars_datum_init_order", "station_numerals", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmiral_messages  (code/_globalvars/lists/flavor_misc.dm:165)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmiral_messages", function InitGlobaladmiral_messages(f: Frame) {
	rt.setGl("admiral_messages", rt.list("Do you know how expensive these stations are?", "Stop wasting my time.", "I was sleeping, thanks a lot.", "Stand and fight you cowards!", "You knew the risks coming in.", "Stop being paranoid.", "Whatever's broken just build a new one.", "No.", "<i>null</i>", "<i>Error: No comment given.</i>", "It's a good day to die!"));
	rt.modSrcVar(f, "gvars_datum_init_order", "admiral_messages", add);
	return f.dot;
});
