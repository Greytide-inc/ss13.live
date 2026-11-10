// Based on /tg/station's code/_globalvars/lists/mapping.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// mapping.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobalcardinal", function InitGlobalcardinal(f: Frame) {
	GLOB.cardinal = list(1, 2, 4, 8);
	this.gvars_datum_init_order += "cardinal";
	return f.dot;
});

// mapping.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalalldirs", function InitGlobalalldirs(f: Frame) {
	GLOB.alldirs = list(1, 2, 4, 8, 5, 9, 6, 10);
	this.gvars_datum_init_order += "alldirs";
	return f.dot;
});

// mapping.dm:8
rt.def("/datum/controller/global_vars/proc/InitGlobaldiagonals", function InitGlobaldiagonals(f: Frame) {
	GLOB.diagonals = list(5, 9, 6, 10);
	this.gvars_datum_init_order += "diagonals";
	return f.dot;
});

// mapping.dm:15
rt.def("/datum/controller/global_vars/proc/InitGlobalaccessable_z_levels", function InitGlobalaccessable_z_levels(f: Frame) {
	GLOB.accessable_z_levels = list(1, 3, 4, 5, 6, 7);
	this.gvars_datum_init_order += "accessable_z_levels";
	return f.dot;
});

// mapping.dm:17
rt.def("/datum/controller/global_vars/proc/InitGlobalglobal_map", function InitGlobalglobal_map(f: Frame) {
	GLOB.global_map = null;
	this.gvars_datum_init_order += "global_map";
	return f.dot;
});

// mapping.dm:28
rt.def("/datum/controller/global_vars/proc/InitGloballandmarks_list", function InitGloballandmarks_list(f: Frame) {
	GLOB.landmarks_list = list();
	this.gvars_datum_init_order += "landmarks_list";
	return f.dot;
});

// mapping.dm:29
rt.def("/datum/controller/global_vars/proc/InitGlobalstart_landmarks_list", function InitGlobalstart_landmarks_list(f: Frame) {
	GLOB.start_landmarks_list = list();
	this.gvars_datum_init_order += "start_landmarks_list";
	return f.dot;
});

// mapping.dm:30
rt.def("/datum/controller/global_vars/proc/InitGlobaldepartment_security_spawns", function InitGlobaldepartment_security_spawns(f: Frame) {
	GLOB.department_security_spawns = list();
	this.gvars_datum_init_order += "department_security_spawns";
	return f.dot;
});

// mapping.dm:31
rt.def("/datum/controller/global_vars/proc/InitGlobalgeneric_event_spawns", function InitGlobalgeneric_event_spawns(f: Frame) {
	GLOB.generic_event_spawns = list();
	this.gvars_datum_init_order += "generic_event_spawns";
	return f.dot;
});

// mapping.dm:33
rt.def("/datum/controller/global_vars/proc/InitGlobalwizardstart", function InitGlobalwizardstart(f: Frame) {
	GLOB.wizardstart = list();
	this.gvars_datum_init_order += "wizardstart";
	return f.dot;
});

// mapping.dm:34
rt.def("/datum/controller/global_vars/proc/InitGlobalnewplayer_start", function InitGlobalnewplayer_start(f: Frame) {
	GLOB.newplayer_start = list();
	this.gvars_datum_init_order += "newplayer_start";
	return f.dot;
});

// mapping.dm:35
rt.def("/datum/controller/global_vars/proc/InitGlobalprisonwarp", function InitGlobalprisonwarp(f: Frame) {
	GLOB.prisonwarp = list();
	this.gvars_datum_init_order += "prisonwarp";
	return f.dot;
});

// mapping.dm:36
rt.def("/datum/controller/global_vars/proc/InitGlobalholdingfacility", function InitGlobalholdingfacility(f: Frame) {
	GLOB.holdingfacility = list();
	this.gvars_datum_init_order += "holdingfacility";
	return f.dot;
});

// mapping.dm:37
rt.def("/datum/controller/global_vars/proc/InitGlobalxeno_spawn", function InitGlobalxeno_spawn(f: Frame) {
	GLOB.xeno_spawn = list();
	this.gvars_datum_init_order += "xeno_spawn";
	return f.dot;
});

// mapping.dm:38
rt.def("/datum/controller/global_vars/proc/InitGlobaltdome1", function InitGlobaltdome1(f: Frame) {
	GLOB.tdome1 = list();
	this.gvars_datum_init_order += "tdome1";
	return f.dot;
});

// mapping.dm:39
rt.def("/datum/controller/global_vars/proc/InitGlobaltdome2", function InitGlobaltdome2(f: Frame) {
	GLOB.tdome2 = list();
	this.gvars_datum_init_order += "tdome2";
	return f.dot;
});

// mapping.dm:40
rt.def("/datum/controller/global_vars/proc/InitGlobaltdomeobserve", function InitGlobaltdomeobserve(f: Frame) {
	GLOB.tdomeobserve = list();
	this.gvars_datum_init_order += "tdomeobserve";
	return f.dot;
});

// mapping.dm:41
rt.def("/datum/controller/global_vars/proc/InitGlobaltdomeadmin", function InitGlobaltdomeadmin(f: Frame) {
	GLOB.tdomeadmin = list();
	this.gvars_datum_init_order += "tdomeadmin";
	return f.dot;
});

// mapping.dm:42
rt.def("/datum/controller/global_vars/proc/InitGlobalprisonwarped", function InitGlobalprisonwarped(f: Frame) {
	GLOB.prisonwarped = list();
	this.gvars_datum_init_order += "prisonwarped";
	return f.dot;
});

// mapping.dm:43
rt.def("/datum/controller/global_vars/proc/InitGlobalblobstart", function InitGlobalblobstart(f: Frame) {
	GLOB.blobstart = list();
	this.gvars_datum_init_order += "blobstart";
	return f.dot;
});

// mapping.dm:44
rt.def("/datum/controller/global_vars/proc/InitGlobalsecequipment", function InitGlobalsecequipment(f: Frame) {
	GLOB.secequipment = list();
	this.gvars_datum_init_order += "secequipment";
	return f.dot;
});

// mapping.dm:45
rt.def("/datum/controller/global_vars/proc/InitGlobaldeathsquadspawn", function InitGlobaldeathsquadspawn(f: Frame) {
	GLOB.deathsquadspawn = list();
	this.gvars_datum_init_order += "deathsquadspawn";
	return f.dot;
});

// mapping.dm:46
rt.def("/datum/controller/global_vars/proc/InitGlobalemergencyresponseteamspawn", function InitGlobalemergencyresponseteamspawn(f: Frame) {
	GLOB.emergencyresponseteamspawn = list();
	this.gvars_datum_init_order += "emergencyresponseteamspawn";
	return f.dot;
});

// mapping.dm:47
rt.def("/datum/controller/global_vars/proc/InitGlobalruin_landmarks", function InitGlobalruin_landmarks(f: Frame) {
	GLOB.ruin_landmarks = list();
	this.gvars_datum_init_order += "ruin_landmarks";
	return f.dot;
});

// mapping.dm:50
rt.def("/datum/controller/global_vars/proc/InitGlobalawaydestinations", function InitGlobalawaydestinations(f: Frame) {
	GLOB.awaydestinations = list();
	this.gvars_datum_init_order += "awaydestinations";
	return f.dot;
});

// mapping.dm:53
rt.def("/datum/controller/global_vars/proc/InitGlobalsortedAreas", function InitGlobalsortedAreas(f: Frame) {
	GLOB.sortedAreas = list();
	this.gvars_datum_init_order += "sortedAreas";
	return f.dot;
});

// mapping.dm:55
rt.def("/datum/controller/global_vars/proc/InitGlobalall_abstract_markers", function InitGlobalall_abstract_markers(f: Frame) {
	GLOB.all_abstract_markers = list();
	this.gvars_datum_init_order += "all_abstract_markers";
	return f.dot;
});
