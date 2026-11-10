// Based on /tg/station's code/_globalvars/lists/objects.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// objects.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalcable_list", function InitGlobalcable_list(f: Frame) {
	GLOB.cable_list = list();
	this.gvars_datum_init_order += "cable_list";
	return f.dot;
});

// objects.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobalportals", function InitGlobalportals(f: Frame) {
	GLOB.portals = list();
	this.gvars_datum_init_order += "portals";
	return f.dot;
});

// objects.dm:3
rt.def("/datum/controller/global_vars/proc/InitGlobalairlocks", function InitGlobalairlocks(f: Frame) {
	GLOB.airlocks = list();
	this.gvars_datum_init_order += "airlocks";
	return f.dot;
});

// objects.dm:4
rt.def("/datum/controller/global_vars/proc/InitGlobalmechas_list", function InitGlobalmechas_list(f: Frame) {
	GLOB.mechas_list = list();
	this.gvars_datum_init_order += "mechas_list";
	return f.dot;
});

// objects.dm:5
rt.def("/datum/controller/global_vars/proc/InitGlobalshuttle_caller_list", function InitGlobalshuttle_caller_list(f: Frame) {
	GLOB.shuttle_caller_list = list();
	this.gvars_datum_init_order += "shuttle_caller_list";
	return f.dot;
});

// objects.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobalmachines", function InitGlobalmachines(f: Frame) {
	GLOB.machines = list();
	this.gvars_datum_init_order += "machines";
	return f.dot;
});

// objects.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalsyndicate_shuttle_boards", function InitGlobalsyndicate_shuttle_boards(f: Frame) {
	GLOB.syndicate_shuttle_boards = list();
	this.gvars_datum_init_order += "syndicate_shuttle_boards";
	return f.dot;
});

// objects.dm:8
rt.def("/datum/controller/global_vars/proc/InitGlobalnavbeacons", function InitGlobalnavbeacons(f: Frame) {
	GLOB.navbeacons = list();
	this.gvars_datum_init_order += "navbeacons";
	return f.dot;
});

// objects.dm:9
rt.def("/datum/controller/global_vars/proc/InitGlobalteleportbeacons", function InitGlobalteleportbeacons(f: Frame) {
	GLOB.teleportbeacons = list();
	this.gvars_datum_init_order += "teleportbeacons";
	return f.dot;
});

// objects.dm:10
rt.def("/datum/controller/global_vars/proc/InitGlobaldeliverybeacons", function InitGlobaldeliverybeacons(f: Frame) {
	GLOB.deliverybeacons = list();
	this.gvars_datum_init_order += "deliverybeacons";
	return f.dot;
});

// objects.dm:11
rt.def("/datum/controller/global_vars/proc/InitGlobaldeliverybeacontags", function InitGlobaldeliverybeacontags(f: Frame) {
	GLOB.deliverybeacontags = list();
	this.gvars_datum_init_order += "deliverybeacontags";
	return f.dot;
});

// objects.dm:12
rt.def("/datum/controller/global_vars/proc/InitGlobalnuke_list", function InitGlobalnuke_list(f: Frame) {
	GLOB.nuke_list = list();
	this.gvars_datum_init_order += "nuke_list";
	return f.dot;
});

// objects.dm:13
rt.def("/datum/controller/global_vars/proc/InitGlobalalarmdisplay", function InitGlobalalarmdisplay(f: Frame) {
	GLOB.alarmdisplay = list();
	this.gvars_datum_init_order += "alarmdisplay";
	return f.dot;
});

// objects.dm:14
rt.def("/datum/controller/global_vars/proc/InitGlobalsingularities", function InitGlobalsingularities(f: Frame) {
	GLOB.singularities = list();
	this.gvars_datum_init_order += "singularities";
	return f.dot;
});

// objects.dm:16
rt.def("/datum/controller/global_vars/proc/InitGlobalchemical_reactions_list", function InitGlobalchemical_reactions_list(f: Frame) {
	GLOB.chemical_reactions_list = null;
	this.gvars_datum_init_order += "chemical_reactions_list";
	return f.dot;
});

// objects.dm:17
rt.def("/datum/controller/global_vars/proc/InitGlobalchemical_reagents_list", function InitGlobalchemical_reagents_list(f: Frame) {
	GLOB.chemical_reagents_list = null;
	this.gvars_datum_init_order += "chemical_reagents_list";
	return f.dot;
});

// objects.dm:18
rt.def("/datum/controller/global_vars/proc/InitGlobalmaterials_list", function InitGlobalmaterials_list(f: Frame) {
	GLOB.materials_list = list();
	this.gvars_datum_init_order += "materials_list";
	return f.dot;
});

// objects.dm:19
rt.def("/datum/controller/global_vars/proc/InitGlobaltech_list", function InitGlobaltech_list(f: Frame) {
	GLOB.tech_list = list();
	this.gvars_datum_init_order += "tech_list";
	return f.dot;
});

// objects.dm:20
rt.def("/datum/controller/global_vars/proc/InitGlobalsurgeries_list", function InitGlobalsurgeries_list(f: Frame) {
	GLOB.surgeries_list = list();
	this.gvars_datum_init_order += "surgeries_list";
	return f.dot;
});

// objects.dm:21
rt.def("/datum/controller/global_vars/proc/InitGlobalcrafting_recipes", function InitGlobalcrafting_recipes(f: Frame) {
	GLOB.crafting_recipes = list();
	this.gvars_datum_init_order += "crafting_recipes";
	return f.dot;
});

// objects.dm:22
rt.def("/datum/controller/global_vars/proc/InitGlobalrcd_list", function InitGlobalrcd_list(f: Frame) {
	GLOB.rcd_list = list();
	this.gvars_datum_init_order += "rcd_list";
	return f.dot;
});

// objects.dm:23
rt.def("/datum/controller/global_vars/proc/InitGlobalapcs_list", function InitGlobalapcs_list(f: Frame) {
	GLOB.apcs_list = list();
	this.gvars_datum_init_order += "apcs_list";
	return f.dot;
});

// objects.dm:24
rt.def("/datum/controller/global_vars/proc/InitGlobaltracked_implants", function InitGlobaltracked_implants(f: Frame) {
	GLOB.tracked_implants = list();
	this.gvars_datum_init_order += "tracked_implants";
	return f.dot;
});

// objects.dm:25
rt.def("/datum/controller/global_vars/proc/InitGlobaltracked_chem_implants", function InitGlobaltracked_chem_implants(f: Frame) {
	GLOB.tracked_chem_implants = list();
	this.gvars_datum_init_order += "tracked_chem_implants";
	return f.dot;
});

// objects.dm:26
rt.def("/datum/controller/global_vars/proc/InitGlobalpoi_list", function InitGlobalpoi_list(f: Frame) {
	GLOB.poi_list = list();
	this.gvars_datum_init_order += "poi_list";
	return f.dot;
});

// objects.dm:27
rt.def("/datum/controller/global_vars/proc/InitGlobalpinpointer_list", function InitGlobalpinpointer_list(f: Frame) {
	GLOB.pinpointer_list = list();
	this.gvars_datum_init_order += "pinpointer_list";
	return f.dot;
});

// objects.dm:28
rt.def("/datum/controller/global_vars/proc/InitGlobalzombie_infection_list", function InitGlobalzombie_infection_list(f: Frame) {
	GLOB.zombie_infection_list = list();
	this.gvars_datum_init_order += "zombie_infection_list";
	return f.dot;
});

// objects.dm:29
rt.def("/datum/controller/global_vars/proc/InitGlobalmeteor_list", function InitGlobalmeteor_list(f: Frame) {
	GLOB.meteor_list = list();
	this.gvars_datum_init_order += "meteor_list";
	return f.dot;
});

// objects.dm:30
rt.def("/datum/controller/global_vars/proc/InitGlobalactive_jammers", function InitGlobalactive_jammers(f: Frame) {
	GLOB.active_jammers = list();
	this.gvars_datum_init_order += "active_jammers";
	return f.dot;
});

// objects.dm:31
rt.def("/datum/controller/global_vars/proc/InitGloballadders", function InitGloballadders(f: Frame) {
	GLOB.ladders = list();
	this.gvars_datum_init_order += "ladders";
	return f.dot;
});

// objects.dm:32
rt.def("/datum/controller/global_vars/proc/InitGlobaltrophy_cases", function InitGlobaltrophy_cases(f: Frame) {
	GLOB.trophy_cases = list();
	this.gvars_datum_init_order += "trophy_cases";
	return f.dot;
});

// objects.dm:34
rt.def("/datum/controller/global_vars/proc/InitGlobalwire_color_directory", function InitGlobalwire_color_directory(f: Frame) {
	GLOB.wire_color_directory = list();
	this.gvars_datum_init_order += "wire_color_directory";
	return f.dot;
});

// objects.dm:35
rt.def("/datum/controller/global_vars/proc/InitGlobalwire_name_directory", function InitGlobalwire_name_directory(f: Frame) {
	GLOB.wire_name_directory = list();
	this.gvars_datum_init_order += "wire_name_directory";
	return f.dot;
});

// objects.dm:37
rt.def("/datum/controller/global_vars/proc/InitGlobalai_status_displays", function InitGlobalai_status_displays(f: Frame) {
	GLOB.ai_status_displays = list();
	this.gvars_datum_init_order += "ai_status_displays";
	return f.dot;
});
