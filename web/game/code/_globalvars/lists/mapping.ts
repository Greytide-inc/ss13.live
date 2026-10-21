// From code/_globalvars/lists/mapping.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalcardinal  (code/_globalvars/lists/mapping.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobalcardinal", function InitGlobalcardinal(f: Frame) {
	rt.setGl("cardinal", rt.list(1, 2, 4, 8));
	rt.modSrcVar(f, "gvars_datum_init_order", "cardinal", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalalldirs  (code/_globalvars/lists/mapping.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalalldirs", function InitGlobalalldirs(f: Frame) {
	rt.setGl("alldirs", rt.list(1, 2, 4, 8, 5, 9, 6, 10));
	rt.modSrcVar(f, "gvars_datum_init_order", "alldirs", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaldiagonals  (code/_globalvars/lists/mapping.dm:8)
rt.def("/datum/controller/global_vars/proc/InitGlobaldiagonals", function InitGlobaldiagonals(f: Frame) {
	rt.setGl("diagonals", rt.list(5, 9, 6, 10));
	rt.modSrcVar(f, "gvars_datum_init_order", "diagonals", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalaccessable_z_levels  (code/_globalvars/lists/mapping.dm:15)
rt.def("/datum/controller/global_vars/proc/InitGlobalaccessable_z_levels", function InitGlobalaccessable_z_levels(f: Frame) {
	rt.setGl("accessable_z_levels", rt.list(1, 3, 4, 5, 6, 7));
	rt.modSrcVar(f, "gvars_datum_init_order", "accessable_z_levels", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalglobal_map  (code/_globalvars/lists/mapping.dm:17)
rt.def("/datum/controller/global_vars/proc/InitGlobalglobal_map", function InitGlobalglobal_map(f: Frame) {
	rt.setGl("global_map", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "global_map", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGloballandmarks_list  (code/_globalvars/lists/mapping.dm:28)
rt.def("/datum/controller/global_vars/proc/InitGloballandmarks_list", function InitGloballandmarks_list(f: Frame) {
	rt.setGl("landmarks_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "landmarks_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalstart_landmarks_list  (code/_globalvars/lists/mapping.dm:29)
rt.def("/datum/controller/global_vars/proc/InitGlobalstart_landmarks_list", function InitGlobalstart_landmarks_list(f: Frame) {
	rt.setGl("start_landmarks_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "start_landmarks_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaldepartment_security_spawns  (code/_globalvars/lists/mapping.dm:30)
rt.def("/datum/controller/global_vars/proc/InitGlobaldepartment_security_spawns", function InitGlobaldepartment_security_spawns(f: Frame) {
	rt.setGl("department_security_spawns", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "department_security_spawns", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalgeneric_event_spawns  (code/_globalvars/lists/mapping.dm:31)
rt.def("/datum/controller/global_vars/proc/InitGlobalgeneric_event_spawns", function InitGlobalgeneric_event_spawns(f: Frame) {
	rt.setGl("generic_event_spawns", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "generic_event_spawns", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalwizardstart  (code/_globalvars/lists/mapping.dm:33)
rt.def("/datum/controller/global_vars/proc/InitGlobalwizardstart", function InitGlobalwizardstart(f: Frame) {
	rt.setGl("wizardstart", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "wizardstart", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalnewplayer_start  (code/_globalvars/lists/mapping.dm:34)
rt.def("/datum/controller/global_vars/proc/InitGlobalnewplayer_start", function InitGlobalnewplayer_start(f: Frame) {
	rt.setGl("newplayer_start", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "newplayer_start", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalprisonwarp  (code/_globalvars/lists/mapping.dm:35)
rt.def("/datum/controller/global_vars/proc/InitGlobalprisonwarp", function InitGlobalprisonwarp(f: Frame) {
	rt.setGl("prisonwarp", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "prisonwarp", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalholdingfacility  (code/_globalvars/lists/mapping.dm:36)
rt.def("/datum/controller/global_vars/proc/InitGlobalholdingfacility", function InitGlobalholdingfacility(f: Frame) {
	rt.setGl("holdingfacility", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "holdingfacility", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalxeno_spawn  (code/_globalvars/lists/mapping.dm:37)
rt.def("/datum/controller/global_vars/proc/InitGlobalxeno_spawn", function InitGlobalxeno_spawn(f: Frame) {
	rt.setGl("xeno_spawn", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "xeno_spawn", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaltdome1  (code/_globalvars/lists/mapping.dm:38)
rt.def("/datum/controller/global_vars/proc/InitGlobaltdome1", function InitGlobaltdome1(f: Frame) {
	rt.setGl("tdome1", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "tdome1", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaltdome2  (code/_globalvars/lists/mapping.dm:39)
rt.def("/datum/controller/global_vars/proc/InitGlobaltdome2", function InitGlobaltdome2(f: Frame) {
	rt.setGl("tdome2", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "tdome2", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaltdomeobserve  (code/_globalvars/lists/mapping.dm:40)
rt.def("/datum/controller/global_vars/proc/InitGlobaltdomeobserve", function InitGlobaltdomeobserve(f: Frame) {
	rt.setGl("tdomeobserve", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "tdomeobserve", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaltdomeadmin  (code/_globalvars/lists/mapping.dm:41)
rt.def("/datum/controller/global_vars/proc/InitGlobaltdomeadmin", function InitGlobaltdomeadmin(f: Frame) {
	rt.setGl("tdomeadmin", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "tdomeadmin", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalprisonwarped  (code/_globalvars/lists/mapping.dm:42)
rt.def("/datum/controller/global_vars/proc/InitGlobalprisonwarped", function InitGlobalprisonwarped(f: Frame) {
	rt.setGl("prisonwarped", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "prisonwarped", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalblobstart  (code/_globalvars/lists/mapping.dm:43)
rt.def("/datum/controller/global_vars/proc/InitGlobalblobstart", function InitGlobalblobstart(f: Frame) {
	rt.setGl("blobstart", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "blobstart", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsecequipment  (code/_globalvars/lists/mapping.dm:44)
rt.def("/datum/controller/global_vars/proc/InitGlobalsecequipment", function InitGlobalsecequipment(f: Frame) {
	rt.setGl("secequipment", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "secequipment", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaldeathsquadspawn  (code/_globalvars/lists/mapping.dm:45)
rt.def("/datum/controller/global_vars/proc/InitGlobaldeathsquadspawn", function InitGlobaldeathsquadspawn(f: Frame) {
	rt.setGl("deathsquadspawn", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "deathsquadspawn", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalemergencyresponseteamspawn  (code/_globalvars/lists/mapping.dm:46)
rt.def("/datum/controller/global_vars/proc/InitGlobalemergencyresponseteamspawn", function InitGlobalemergencyresponseteamspawn(f: Frame) {
	rt.setGl("emergencyresponseteamspawn", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "emergencyresponseteamspawn", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalruin_landmarks  (code/_globalvars/lists/mapping.dm:47)
rt.def("/datum/controller/global_vars/proc/InitGlobalruin_landmarks", function InitGlobalruin_landmarks(f: Frame) {
	rt.setGl("ruin_landmarks", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "ruin_landmarks", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalawaydestinations  (code/_globalvars/lists/mapping.dm:50)
rt.def("/datum/controller/global_vars/proc/InitGlobalawaydestinations", function InitGlobalawaydestinations(f: Frame) {
	rt.setGl("awaydestinations", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "awaydestinations", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsortedAreas  (code/_globalvars/lists/mapping.dm:53)
rt.def("/datum/controller/global_vars/proc/InitGlobalsortedAreas", function InitGlobalsortedAreas(f: Frame) {
	rt.setGl("sortedAreas", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "sortedAreas", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalall_abstract_markers  (code/_globalvars/lists/mapping.dm:55)
rt.def("/datum/controller/global_vars/proc/InitGlobalall_abstract_markers", function InitGlobalall_abstract_markers(f: Frame) {
	rt.setGl("all_abstract_markers", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "all_abstract_markers", add);
	return f.dot;
});
