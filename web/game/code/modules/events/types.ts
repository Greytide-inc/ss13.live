// Types declared in code/modules/events that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(284, "/datum/round_event/ghost_role/sentience/all", "/datum/round_event/ghost_role/sentience", {
	one: "all",
	animals: 1e+31,
});
rt.type(305, "/datum/round_event/ion_storm/add_law_only", "/datum/round_event/ion_storm", {
	replaceLawsetChance: 0,
	removeRandomLawChance: 0,
	removeDontImproveChance: 0,
	shuffleLawsChance: 0,
	botEmagChance: 0,
});
rt.type(309, "/datum/round_event/meteor_wave/threatening", "/datum/round_event/meteor_wave", {
	wave_name: "threatening",
});
rt.type(310, "/datum/round_event/meteor_wave/catastrophic", "/datum/round_event/meteor_wave", {
	wave_name: "catastrophic",
});
rt.type(332, "/datum/round_event/wizard", "/datum/round_event", {});
rt.type(350, "/datum/round_event/wizard/shuffle", "/datum/round_event/wizard", {});
rt.type(1352, "/datum/round_event_control/spawn_swarmer", "/datum/round_event_control", {
	name: "Spawn Swarmer Shell",
	typepath: rt.typePath("/datum/round_event/spawn_swarmer"),
	weight: 7,
	max_occurrences: 1,
	earliest_start: 18000,
	min_players: 15,
});
rt.type(1353, "/datum/round_event_control/morph", "/datum/round_event_control", {
	name: "Spawn Morph",
	typepath: rt.typePath("/datum/round_event/ghost_role/morph"),
	weight: 0,
	max_occurrences: 1,
});
rt.type(1354, "/datum/round_event_control/revenant", "/datum/round_event_control", {
	name: "Spawn Revenant",
	typepath: rt.typePath("/datum/round_event/ghost_role/revenant"),
	weight: 7,
	max_occurrences: 1,
	earliest_start: 12000,
	min_players: 5,
});
rt.type(1355, "/datum/round_event_control/slaughter", "/datum/round_event_control", {
	name: "Spawn Slaughter Demon",
	typepath: rt.typePath("/datum/round_event/ghost_role/slaughter"),
	weight: 1,
	max_occurrences: 1,
	earliest_start: 36000,
	min_players: 20,
});
rt.type(1356, "/datum/round_event_control/wizard", "/datum/round_event_control", {
	wizardevent: 1,
});
rt.type(1357, "/datum/round_event_control/wizard/darkness", "/datum/round_event_control/wizard", {
	name: "Advanced Darkness",
	weight: 2,
	typepath: rt.typePath("/datum/round_event/wizard/darkness"),
	max_occurrences: 2,
	earliest_start: 0,
});
rt.type(1358, "/datum/round_event_control/wizard/robelesscasting", "/datum/round_event_control/wizard", {
	name: "Robeless Casting",
	weight: 2,
	typepath: rt.typePath("/datum/round_event/wizard/robelesscasting"),
	max_occurrences: 1,
	earliest_start: 0,
});
rt.type(1359, "/datum/round_event_control/wizard/improvedcasting", "/datum/round_event_control/wizard", {
	name: "Improved Casting",
	weight: 3,
	typepath: rt.typePath("/datum/round_event/wizard/improvedcasting"),
	max_occurrences: 4,
	earliest_start: 0,
});
rt.type(1360, "/datum/round_event_control/wizard/blobies", "/datum/round_event_control/wizard", {
	name: "Zombie Outbreak",
	weight: 3,
	typepath: rt.typePath("/datum/round_event/wizard/blobies"),
	max_occurrences: 3,
	earliest_start: 12000,
});
rt.type(1361, "/datum/round_event_control/wizard/cursed_items", "/datum/round_event_control/wizard", {
	name: "Cursed Items",
	weight: 3,
	typepath: rt.typePath("/datum/round_event/wizard/cursed_items"),
	max_occurrences: 3,
	earliest_start: 0,
});
rt.type(1362, "/datum/round_event_control/wizard/deprevolt", "/datum/round_event_control/wizard", {
	name: "Departmental Uprising",
	weight: 0,
	typepath: rt.typePath("/datum/round_event/wizard/deprevolt"),
	max_occurrences: 1,
	earliest_start: 0,
});
rt.type(1363, "/datum/round_event_control/wizard/fake_explosion", "/datum/round_event_control/wizard", {
	name: "Fake Nuclear Explosion",
	weight: 0,
	typepath: rt.typePath("/datum/round_event/wizard/fake_explosion"),
	max_occurrences: 1,
	earliest_start: 0,
});
rt.type(1364, "/datum/round_event_control/wizard/ghost", "/datum/round_event_control/wizard", {
	name: "G-G-G-Ghosts!",
	weight: 3,
	typepath: rt.typePath("/datum/round_event/wizard/ghost"),
	max_occurrences: 1,
	earliest_start: 0,
});
rt.type(1365, "/datum/round_event_control/wizard/possession", "/datum/round_event_control/wizard", {
	name: "Possessing G-G-G-Ghosts!",
	weight: 2,
	typepath: rt.typePath("/datum/round_event/wizard/possession"),
	max_occurrences: 5,
	earliest_start: 0,
});
rt.type(1366, "/datum/round_event_control/wizard/greentext", "/datum/round_event_control/wizard", {
	name: "Greentext",
	weight: 4,
	typepath: rt.typePath("/datum/round_event/wizard/greentext"),
	max_occurrences: 1,
	earliest_start: 0,
});
rt.type(1367, "/datum/round_event_control/wizard/imposter", "/datum/round_event_control/wizard", {
	name: "Imposter Wizard",
	weight: 1,
	typepath: rt.typePath("/datum/round_event/wizard/imposter"),
	max_occurrences: 1,
	earliest_start: 0,
});
rt.type(1368, "/datum/round_event_control/wizard/invincible", "/datum/round_event_control/wizard", {
	name: "Invincibility",
	weight: 3,
	typepath: rt.typePath("/datum/round_event/wizard/invincible"),
	max_occurrences: 5,
	earliest_start: 0,
});
rt.type(1369, "/datum/round_event_control/wizard/lava", "/datum/round_event_control/wizard", {
	name: "The Floor Is LAVA!",
	weight: 2,
	typepath: rt.typePath("/datum/round_event/wizard/lava"),
	max_occurrences: 3,
	earliest_start: 0,
});
rt.type(1370, "/datum/round_event_control/wizard/magicarp", "/datum/round_event_control/wizard", {
	name: "Magicarp",
	weight: 1,
	typepath: rt.typePath("/datum/round_event/wizard/magicarp"),
	max_occurrences: 1,
	earliest_start: 0,
});
rt.type(1372, "/datum/round_event_control/wizard/race", "/datum/round_event_control/wizard", {
	name: "Race Swap",
	weight: 2,
	typepath: rt.typePath("/datum/round_event/wizard/race"),
	max_occurrences: 5,
	earliest_start: 0,
});
rt.type(1373, "/datum/round_event_control/wizard/rpgloot", "/datum/round_event_control/wizard", {
	name: "RPG Loot",
	weight: 3,
	typepath: rt.typePath("/datum/round_event/wizard/rpgloot"),
	max_occurrences: 1,
	earliest_start: 0,
});
rt.type(1374, "/datum/round_event_control/wizard/shuffleloc", "/datum/round_event_control/wizard", {
	name: "Change Places!",
	weight: 2,
	typepath: rt.typePath("/datum/round_event/wizard/shuffleloc"),
	max_occurrences: 5,
	earliest_start: 0,
});
rt.type(1375, "/datum/round_event_control/wizard/shufflenames", "/datum/round_event_control/wizard", {
	name: "Change Faces!",
	weight: 4,
	typepath: rt.typePath("/datum/round_event/wizard/shufflenames"),
	max_occurrences: 5,
	earliest_start: 0,
});
rt.type(1376, "/datum/round_event_control/wizard/shuffleminds", "/datum/round_event_control/wizard", {
	name: "Change Minds!",
	weight: 1,
	typepath: rt.typePath("/datum/round_event/wizard/shuffleminds"),
	max_occurrences: 3,
	earliest_start: 0,
});
rt.type(1379, "/datum/round_event_control/abductor", "/datum/round_event_control", {
	name: "Abductors",
	typepath: rt.typePath("/datum/round_event/ghost_role/abductor"),
	weight: 10,
	max_occurrences: 1,
	min_players: 20,
	gamemode_blacklist: null,
});
rt.type(1380, "/datum/round_event_control/alien_infestation", "/datum/round_event_control", {
	name: "Alien Infestation",
	typepath: rt.typePath("/datum/round_event/ghost_role/alien_infestation"),
	weight: 5,
	min_players: 10,
	max_occurrences: 1,
});
rt.type(1381, "/datum/round_event_control/anomaly", "/datum/round_event_control", {
	name: "Anomaly: Energetic Flux",
	typepath: rt.typePath("/datum/round_event/anomaly"),
	min_players: 1,
	max_occurrences: 0,
	weight: 15,
});
rt.type(1382, "/datum/round_event_control/anomaly/anomaly_bluespace", "/datum/round_event_control/anomaly", {
	name: "Anomaly: Bluespace",
	typepath: rt.typePath("/datum/round_event/anomaly/anomaly_bluespace"),
	max_occurrences: 1,
	weight: 5,
});
rt.type(1383, "/datum/round_event_control/anomaly/anomaly_flux", "/datum/round_event_control/anomaly", {
	name: "Anomaly: Hyper-Energetic Flux",
	typepath: rt.typePath("/datum/round_event/anomaly/anomaly_flux"),
	min_players: 10,
	max_occurrences: 5,
	weight: 20,
});
rt.type(1384, "/datum/round_event_control/anomaly/anomaly_grav", "/datum/round_event_control/anomaly", {
	name: "Anomaly: Gravitational",
	typepath: rt.typePath("/datum/round_event/anomaly/anomaly_grav"),
	max_occurrences: 5,
	weight: 20,
});
rt.type(1385, "/datum/round_event_control/anomaly/anomaly_pyro", "/datum/round_event_control/anomaly", {
	name: "Anomaly: Pyroclastic",
	typepath: rt.typePath("/datum/round_event/anomaly/anomaly_pyro"),
	max_occurrences: 5,
	weight: 20,
});
rt.type(1386, "/datum/round_event_control/anomaly/anomaly_vortex", "/datum/round_event_control/anomaly", {
	name: "Anomaly: Vortex",
	typepath: rt.typePath("/datum/round_event/anomaly/anomaly_vortex"),
	min_players: 20,
	max_occurrences: 2,
	weight: 5,
});
rt.type(1388, "/datum/round_event_control/brand_intelligence", "/datum/round_event_control", {
	name: "Brand Intelligence",
	typepath: rt.typePath("/datum/round_event/brand_intelligence"),
	weight: 5,
	min_players: 15,
	max_occurrences: 1,
});
rt.type(1389, "/datum/round_event_control/camera_failure", "/datum/round_event_control", {
	name: "Camera Failure",
	typepath: rt.typePath("/datum/round_event/camera_failure"),
	weight: 100,
	max_occurrences: 20,
	alertadmins: 0,
});
rt.type(1390, "/datum/round_event_control/carp_migration", "/datum/round_event_control", {
	name: "Carp Migration",
	typepath: rt.typePath("/datum/round_event/carp_migration"),
	weight: 15,
	min_players: 2,
	earliest_start: 6000,
	max_occurrences: 6,
});
rt.type(1391, "/datum/round_event_control/carp_migration/eyeballs", "/datum/round_event_control/carp_migration", {
	name: "Eyeball Migration",
	typepath: rt.typePath("/datum/round_event/carp_migration/eyeballs"),
	holidayID: "Halloween",
	weight: 25,
	earliest_start: 0,
});
rt.type(1392, "/datum/round_event_control/communications_blackout", "/datum/round_event_control", {
	name: "Communications Blackout",
	typepath: rt.typePath("/datum/round_event/communications_blackout"),
	weight: 30,
});
rt.type(1393, "/datum/round_event_control/devil", "/datum/round_event_control", {
	name: "Create Devil",
	typepath: rt.typePath("/datum/round_event/ghost_role/devil"),
	max_occurrences: 0,
});
rt.type(1394, "/datum/round_event_control/disease_outbreak", "/datum/round_event_control", {
	name: "Disease Outbreak",
	typepath: rt.typePath("/datum/round_event/disease_outbreak"),
	max_occurrences: 1,
	min_players: 10,
	weight: 5,
});
rt.type(1395, "/datum/round_event_control/space_dust", "/datum/round_event_control", {
	name: "Minor Space Dust",
	typepath: rt.typePath("/datum/round_event/space_dust"),
	weight: 200,
	max_occurrences: 1000,
	earliest_start: 0,
	alertadmins: 0,
});
rt.type(1396, "/datum/round_event_control/sandstorm", "/datum/round_event_control", {
	name: "Sandstorm",
	typepath: rt.typePath("/datum/round_event/sandstorm"),
	weight: 0,
	max_occurrences: 0,
	earliest_start: 0,
});
rt.type(1397, "/datum/round_event_control/electrical_storm", "/datum/round_event_control", {
	name: "Electrical Storm",
	typepath: rt.typePath("/datum/round_event/electrical_storm"),
	earliest_start: 6000,
	min_players: 5,
	weight: 40,
	alertadmins: 0,
});
rt.type(1399, "/datum/round_event_control/grid_check", "/datum/round_event_control", {
	name: "Grid Check",
	typepath: rt.typePath("/datum/round_event/grid_check"),
	weight: 10,
	max_occurrences: 3,
});
rt.type(1400, "/datum/round_event_control/immovable_rod", "/datum/round_event_control", {
	name: "Immovable Rod",
	typepath: rt.typePath("/datum/round_event/immovable_rod"),
	min_players: 15,
	max_occurrences: 5,
});
rt.type(1401, "/datum/round_event_control/ion_storm", "/datum/round_event_control", {
	name: "Ion Storm",
	typepath: rt.typePath("/datum/round_event/ion_storm"),
	weight: 15,
	min_players: 2,
});
rt.type(1402, "/datum/round_event_control/meteor_wave", "/datum/round_event_control", {
	name: "Meteor Wave: Normal",
	typepath: rt.typePath("/datum/round_event/meteor_wave"),
	weight: 4,
	min_players: 5,
	max_occurrences: 3,
});
rt.type(1403, "/datum/round_event_control/meteor_wave/major_dust", "/datum/round_event_control/meteor_wave", {
	name: "Major Space Dust",
	typepath: rt.typePath("/datum/round_event/meteor_wave/major_dust"),
	weight: 8,
});
rt.type(1404, "/datum/round_event_control/meteor_wave/meaty", "/datum/round_event_control/meteor_wave", {
	name: "Meteor Wave: Meaty",
	typepath: rt.typePath("/datum/round_event/meteor_wave/meaty"),
	weight: 2,
	max_occurrences: 1,
});
rt.type(1405, "/datum/round_event_control/meteor_wave/threatening", "/datum/round_event_control/meteor_wave", {
	name: "Meteor Wave: Threatening",
	typepath: rt.typePath("/datum/round_event/meteor_wave/threatening"),
	weight: 2,
	min_players: 5,
	max_occurrences: 3,
});
rt.type(1406, "/datum/round_event_control/meteor_wave/catastrophic", "/datum/round_event_control/meteor_wave", {
	name: "Meteor Wave: Catastrophic",
	typepath: rt.typePath("/datum/round_event/meteor_wave/catastrophic"),
	weight: 1,
	min_players: 5,
	max_occurrences: 3,
});
rt.type(1407, "/datum/round_event_control/meteor_wave/spooky", "/datum/round_event_control/meteor_wave", {
	name: "Pumpkin Wave",
	typepath: rt.typePath("/datum/round_event/meteor_wave/spooky"),
	holidayID: "Halloween",
	weight: 20,
	max_occurrences: 2,
});
rt.type(1408, "/datum/round_event_control/mass_hallucination", "/datum/round_event_control", {
	name: "Mass Hallucination",
	typepath: rt.typePath("/datum/round_event/mass_hallucination"),
	weight: 7,
	max_occurrences: 2,
	min_players: 1,
});
rt.type(1409, "/datum/round_event_control/mice_migration", "/datum/round_event_control", {
	name: "Mice Migration",
	typepath: rt.typePath("/datum/round_event/mice_migration"),
	weight: 10,
});
rt.type(1410, "/datum/round_event_control/operative", "/datum/round_event_control", {
	name: "Lone Operative",
	typepath: rt.typePath("/datum/round_event/ghost_role/operative"),
	weight: 0,
	max_occurrences: 1,
});
rt.type(1411, "/datum/round_event_control/portal_storm_syndicate", "/datum/round_event_control", {
	name: "Portal Storm: Syndicate Shocktroops",
	typepath: rt.typePath("/datum/round_event/portal_storm/syndicate_shocktroop"),
	weight: 2,
	min_players: 15,
	earliest_start: 18000,
});
rt.type(1412, "/datum/round_event_control/portal_storm_narsie", "/datum/round_event_control", {
	name: "Portal Storm: Constructs",
	typepath: rt.typePath("/datum/round_event/portal_storm/portal_storm_narsie"),
	weight: 0,
	max_occurrences: 0,
});
rt.type(1413, "/datum/round_event_control/grey_tide", "/datum/round_event_control", {
	name: "Grey Tide",
	typepath: rt.typePath("/datum/round_event/grey_tide"),
	max_occurrences: 2,
	min_players: 5,
});
rt.type(1414, "/datum/round_event_control/processor_overload", "/datum/round_event_control", {
	name: "Processor Overload",
	typepath: rt.typePath("/datum/round_event/processor_overload"),
	weight: 15,
	min_players: 20,
});
rt.type(1415, "/datum/round_event_control/radiation_storm", "/datum/round_event_control", {
	name: "Radiation Storm",
	typepath: rt.typePath("/datum/round_event/radiation_storm"),
	max_occurrences: 1,
});
rt.type(1416, "/datum/round_event_control/sentience", "/datum/round_event_control", {
	name: "Random Human-level Intelligence",
	typepath: rt.typePath("/datum/round_event/ghost_role/sentience"),
	weight: 10,
});
rt.type(1417, "/datum/round_event_control/sentience/all", "/datum/round_event_control/sentience", {
	name: "Station-wide Human-level Intelligence",
	typepath: rt.typePath("/datum/round_event/ghost_role/sentience/all"),
	weight: 0,
});
rt.type(1418, "/datum/round_event_control/shuttle_loan", "/datum/round_event_control", {
	name: "Shuttle Loan",
	typepath: rt.typePath("/datum/round_event/shuttle_loan"),
	max_occurrences: 1,
	earliest_start: 4000,
});
rt.type(1419, "/datum/round_event_control/spacevine", "/datum/round_event_control", {
	name: "Spacevine",
	typepath: rt.typePath("/datum/round_event/spacevine"),
	weight: 15,
	max_occurrences: 3,
	min_players: 10,
});
rt.type(1420, "/datum/round_event_control/spider_infestation", "/datum/round_event_control", {
	name: "Spider Infestation",
	typepath: rt.typePath("/datum/round_event/spider_infestation"),
	weight: 5,
	max_occurrences: 1,
	min_players: 15,
});
rt.type(1421, "/datum/round_event_control/spontaneous_appendicitis", "/datum/round_event_control", {
	name: "Spontaneous Appendicitis",
	typepath: rt.typePath("/datum/round_event/spontaneous_appendicitis"),
	weight: 20,
	max_occurrences: 4,
	earliest_start: 6000,
	min_players: 5,
});
rt.type(1422, "/datum/round_event_control/vent_clog", "/datum/round_event_control", {
	name: "Clogged Vents",
	typepath: rt.typePath("/datum/round_event/vent_clog"),
	weight: 35,
});
rt.type(1423, "/datum/round_event_control/wormholes", "/datum/round_event_control", {
	name: "Wormholes",
	typepath: rt.typePath("/datum/round_event/wormholes"),
	max_occurrences: 3,
	weight: 2,
	min_players: 2,
});
rt.type(1424, "/datum/round_event_control/spooky", "/datum/round_event_control", {
	name: "2 SPOOKY! (Halloween)",
	holidayID: "Halloween",
	typepath: rt.typePath("/datum/round_event/spooky"),
	weight: -1,
	max_occurrences: 1,
	earliest_start: 0,
});
rt.type(1425, "/datum/round_event_control/creepy_clowns", "/datum/round_event_control", {
	name: "Clowns",
	typepath: rt.typePath("/datum/round_event/creepy_clowns"),
	holidayID: "Halloween",
	weight: 20,
	earliest_start: 0,
});
rt.type(1426, "/datum/round_event_control/valentines", "/datum/round_event_control", {
	name: "Valentines!",
	holidayID: "Valentine's Day",
	typepath: rt.typePath("/datum/round_event/valentines"),
	weight: -1,
	max_occurrences: 1,
	earliest_start: 0,
});
rt.type(1427, "/datum/round_event_control/treevenge", "/datum/round_event_control", {
	name: "Treevenge (Christmas)",
	holidayID: "Christmas",
	typepath: rt.typePath("/datum/round_event/treevenge"),
	max_occurrences: 1,
	weight: 20,
});
rt.type(1428, "/datum/round_event_control/presents", "/datum/round_event_control", {
	name: "Presents under Trees (Christmas)",
	holidayID: "Christmas",
	typepath: rt.typePath("/datum/round_event/presents"),
	weight: -1,
	max_occurrences: 1,
	earliest_start: 0,
});
rt.type(1429, "/datum/round_event_control/santa", "/datum/round_event_control", {
	name: "Santa is coming to town! (Christmas)",
	holidayID: "Christmas",
	typepath: rt.typePath("/datum/round_event/santa"),
	weight: 150,
	max_occurrences: 1,
	earliest_start: 20000,
});
rt.type(1430, "/datum/round_event_control/easter", "/datum/round_event_control", {
	name: "Easter Eggselence",
	holidayID: "Easter",
	typepath: rt.typePath("/datum/round_event/easter"),
	weight: -1,
	max_occurrences: 1,
	earliest_start: 0,
});
rt.type(1431, "/datum/round_event_control/rabbitrelease", "/datum/round_event_control", {
	name: "Release the Rabbits!",
	holidayID: "Easter",
	typepath: rt.typePath("/datum/round_event/rabbitrelease"),
	weight: 5,
	max_occurrences: 10,
});
rt.type(1432, "/datum/round_event_control/ninja", "/datum/round_event_control", {
	name: "Space Ninja",
	typepath: rt.typePath("/datum/round_event/ghost_role/ninja"),
	max_occurrences: 1,
	earliest_start: 30000,
	min_players: 15,
});
