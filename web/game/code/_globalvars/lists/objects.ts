// From code/_globalvars/lists/objects.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalcable_list  (code/_globalvars/lists/objects.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalcable_list", function InitGlobalcable_list(f: Frame) {
	rt.setGl("cable_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "cable_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalportals  (code/_globalvars/lists/objects.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobalportals", function InitGlobalportals(f: Frame) {
	rt.setGl("portals", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "portals", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalairlocks  (code/_globalvars/lists/objects.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGlobalairlocks", function InitGlobalairlocks(f: Frame) {
	rt.setGl("airlocks", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "airlocks", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalmechas_list  (code/_globalvars/lists/objects.dm:4)
rt.def("/datum/controller/global_vars/proc/InitGlobalmechas_list", function InitGlobalmechas_list(f: Frame) {
	rt.setGl("mechas_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "mechas_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalshuttle_caller_list  (code/_globalvars/lists/objects.dm:5)
rt.def("/datum/controller/global_vars/proc/InitGlobalshuttle_caller_list", function InitGlobalshuttle_caller_list(f: Frame) {
	rt.setGl("shuttle_caller_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "shuttle_caller_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalmachines  (code/_globalvars/lists/objects.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobalmachines", function InitGlobalmachines(f: Frame) {
	rt.setGl("machines", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "machines", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsyndicate_shuttle_boards  (code/_globalvars/lists/objects.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalsyndicate_shuttle_boards", function InitGlobalsyndicate_shuttle_boards(f: Frame) {
	rt.setGl("syndicate_shuttle_boards", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "syndicate_shuttle_boards", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalnavbeacons  (code/_globalvars/lists/objects.dm:8)
rt.def("/datum/controller/global_vars/proc/InitGlobalnavbeacons", function InitGlobalnavbeacons(f: Frame) {
	rt.setGl("navbeacons", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "navbeacons", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalteleportbeacons  (code/_globalvars/lists/objects.dm:9)
rt.def("/datum/controller/global_vars/proc/InitGlobalteleportbeacons", function InitGlobalteleportbeacons(f: Frame) {
	rt.setGl("teleportbeacons", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "teleportbeacons", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaldeliverybeacons  (code/_globalvars/lists/objects.dm:10)
rt.def("/datum/controller/global_vars/proc/InitGlobaldeliverybeacons", function InitGlobaldeliverybeacons(f: Frame) {
	rt.setGl("deliverybeacons", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "deliverybeacons", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaldeliverybeacontags  (code/_globalvars/lists/objects.dm:11)
rt.def("/datum/controller/global_vars/proc/InitGlobaldeliverybeacontags", function InitGlobaldeliverybeacontags(f: Frame) {
	rt.setGl("deliverybeacontags", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "deliverybeacontags", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalnuke_list  (code/_globalvars/lists/objects.dm:12)
rt.def("/datum/controller/global_vars/proc/InitGlobalnuke_list", function InitGlobalnuke_list(f: Frame) {
	rt.setGl("nuke_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "nuke_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalalarmdisplay  (code/_globalvars/lists/objects.dm:13)
rt.def("/datum/controller/global_vars/proc/InitGlobalalarmdisplay", function InitGlobalalarmdisplay(f: Frame) {
	rt.setGl("alarmdisplay", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "alarmdisplay", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsingularities  (code/_globalvars/lists/objects.dm:14)
rt.def("/datum/controller/global_vars/proc/InitGlobalsingularities", function InitGlobalsingularities(f: Frame) {
	rt.setGl("singularities", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "singularities", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalchemical_reactions_list  (code/_globalvars/lists/objects.dm:16)
rt.def("/datum/controller/global_vars/proc/InitGlobalchemical_reactions_list", function InitGlobalchemical_reactions_list(f: Frame) {
	rt.setGl("chemical_reactions_list", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "chemical_reactions_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalchemical_reagents_list  (code/_globalvars/lists/objects.dm:17)
rt.def("/datum/controller/global_vars/proc/InitGlobalchemical_reagents_list", function InitGlobalchemical_reagents_list(f: Frame) {
	rt.setGl("chemical_reagents_list", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "chemical_reagents_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalmaterials_list  (code/_globalvars/lists/objects.dm:18)
rt.def("/datum/controller/global_vars/proc/InitGlobalmaterials_list", function InitGlobalmaterials_list(f: Frame) {
	rt.setGl("materials_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "materials_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaltech_list  (code/_globalvars/lists/objects.dm:19)
rt.def("/datum/controller/global_vars/proc/InitGlobaltech_list", function InitGlobaltech_list(f: Frame) {
	rt.setGl("tech_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "tech_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsurgeries_list  (code/_globalvars/lists/objects.dm:20)
rt.def("/datum/controller/global_vars/proc/InitGlobalsurgeries_list", function InitGlobalsurgeries_list(f: Frame) {
	rt.setGl("surgeries_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "surgeries_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalcrafting_recipes  (code/_globalvars/lists/objects.dm:21)
rt.def("/datum/controller/global_vars/proc/InitGlobalcrafting_recipes", function InitGlobalcrafting_recipes(f: Frame) {
	rt.setGl("crafting_recipes", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "crafting_recipes", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalrcd_list  (code/_globalvars/lists/objects.dm:22)
rt.def("/datum/controller/global_vars/proc/InitGlobalrcd_list", function InitGlobalrcd_list(f: Frame) {
	rt.setGl("rcd_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "rcd_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalapcs_list  (code/_globalvars/lists/objects.dm:23)
rt.def("/datum/controller/global_vars/proc/InitGlobalapcs_list", function InitGlobalapcs_list(f: Frame) {
	rt.setGl("apcs_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "apcs_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaltracked_implants  (code/_globalvars/lists/objects.dm:24)
rt.def("/datum/controller/global_vars/proc/InitGlobaltracked_implants", function InitGlobaltracked_implants(f: Frame) {
	rt.setGl("tracked_implants", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "tracked_implants", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaltracked_chem_implants  (code/_globalvars/lists/objects.dm:25)
rt.def("/datum/controller/global_vars/proc/InitGlobaltracked_chem_implants", function InitGlobaltracked_chem_implants(f: Frame) {
	rt.setGl("tracked_chem_implants", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "tracked_chem_implants", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalpoi_list  (code/_globalvars/lists/objects.dm:26)
rt.def("/datum/controller/global_vars/proc/InitGlobalpoi_list", function InitGlobalpoi_list(f: Frame) {
	rt.setGl("poi_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "poi_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalpinpointer_list  (code/_globalvars/lists/objects.dm:27)
rt.def("/datum/controller/global_vars/proc/InitGlobalpinpointer_list", function InitGlobalpinpointer_list(f: Frame) {
	rt.setGl("pinpointer_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "pinpointer_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalzombie_infection_list  (code/_globalvars/lists/objects.dm:28)
rt.def("/datum/controller/global_vars/proc/InitGlobalzombie_infection_list", function InitGlobalzombie_infection_list(f: Frame) {
	rt.setGl("zombie_infection_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "zombie_infection_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalmeteor_list  (code/_globalvars/lists/objects.dm:29)
rt.def("/datum/controller/global_vars/proc/InitGlobalmeteor_list", function InitGlobalmeteor_list(f: Frame) {
	rt.setGl("meteor_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "meteor_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalactive_jammers  (code/_globalvars/lists/objects.dm:30)
rt.def("/datum/controller/global_vars/proc/InitGlobalactive_jammers", function InitGlobalactive_jammers(f: Frame) {
	rt.setGl("active_jammers", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "active_jammers", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGloballadders  (code/_globalvars/lists/objects.dm:31)
rt.def("/datum/controller/global_vars/proc/InitGloballadders", function InitGloballadders(f: Frame) {
	rt.setGl("ladders", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "ladders", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaltrophy_cases  (code/_globalvars/lists/objects.dm:32)
rt.def("/datum/controller/global_vars/proc/InitGlobaltrophy_cases", function InitGlobaltrophy_cases(f: Frame) {
	rt.setGl("trophy_cases", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "trophy_cases", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalwire_color_directory  (code/_globalvars/lists/objects.dm:34)
rt.def("/datum/controller/global_vars/proc/InitGlobalwire_color_directory", function InitGlobalwire_color_directory(f: Frame) {
	rt.setGl("wire_color_directory", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "wire_color_directory", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalwire_name_directory  (code/_globalvars/lists/objects.dm:35)
rt.def("/datum/controller/global_vars/proc/InitGlobalwire_name_directory", function InitGlobalwire_name_directory(f: Frame) {
	rt.setGl("wire_name_directory", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "wire_name_directory", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalai_status_displays  (code/_globalvars/lists/objects.dm:37)
rt.def("/datum/controller/global_vars/proc/InitGlobalai_status_displays", function InitGlobalai_status_displays(f: Frame) {
	rt.setGl("ai_status_displays", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "ai_status_displays", add);
	return f.dot;
});
