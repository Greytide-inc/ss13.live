// Based on /tg/station's code/_globalvars/logging.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// logging.dm:1
rt.def("/datum/controller/global_vars/proc/InitGloballog_directory", function InitGloballog_directory(f: Frame) {
	GLOB.log_directory = null;
	this.gvars_datum_init_order += "log_directory";
	return f.dot;
});

// logging.dm:2
rt.def("/datum/controller/global_vars/proc/InitGloballog_directory", function InitGloballog_directory(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "log_directory";
	return f.dot;
});

// logging.dm:3
rt.def("/datum/controller/global_vars/proc/InitGlobalworld_game_log", function InitGlobalworld_game_log(f: Frame) {
	GLOB.world_game_log = null;
	this.gvars_datum_init_order += "world_game_log";
	return f.dot;
});

// logging.dm:4
rt.def("/datum/controller/global_vars/proc/InitGlobalworld_game_log", function InitGlobalworld_game_log(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "world_game_log";
	return f.dot;
});

// logging.dm:5
rt.def("/datum/controller/global_vars/proc/InitGlobalworld_runtime_log", function InitGlobalworld_runtime_log(f: Frame) {
	GLOB.world_runtime_log = null;
	this.gvars_datum_init_order += "world_runtime_log";
	return f.dot;
});

// logging.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobalworld_runtime_log", function InitGlobalworld_runtime_log(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "world_runtime_log";
	return f.dot;
});

// logging.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalworld_attack_log", function InitGlobalworld_attack_log(f: Frame) {
	GLOB.world_attack_log = null;
	this.gvars_datum_init_order += "world_attack_log";
	return f.dot;
});

// logging.dm:8
rt.def("/datum/controller/global_vars/proc/InitGlobalworld_attack_log", function InitGlobalworld_attack_log(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "world_attack_log";
	return f.dot;
});

// logging.dm:9
rt.def("/datum/controller/global_vars/proc/InitGlobalworld_href_log", function InitGlobalworld_href_log(f: Frame) {
	GLOB.world_href_log = null;
	this.gvars_datum_init_order += "world_href_log";
	return f.dot;
});

// logging.dm:10
rt.def("/datum/controller/global_vars/proc/InitGlobalworld_href_log", function InitGlobalworld_href_log(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "world_href_log";
	return f.dot;
});

// logging.dm:13
rt.def("/datum/controller/global_vars/proc/InitGlobalconfig_error_log", function InitGlobalconfig_error_log(f: Frame) {
	GLOB.config_error_log = null;
	this.gvars_datum_init_order += "config_error_log";
	return f.dot;
});

// logging.dm:14
rt.def("/datum/controller/global_vars/proc/InitGlobalconfig_error_log", function InitGlobalconfig_error_log(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "config_error_log";
	return f.dot;
});

// logging.dm:16
rt.def("/datum/controller/global_vars/proc/InitGlobalbombers", function InitGlobalbombers(f: Frame) {
	GLOB.bombers = list();
	this.gvars_datum_init_order += "bombers";
	return f.dot;
});

// logging.dm:17
rt.def("/datum/controller/global_vars/proc/InitGlobalbombers", function InitGlobalbombers(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "bombers";
	return f.dot;
});

// logging.dm:18
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_log", function InitGlobaladmin_log(f: Frame) {
	GLOB.admin_log = list();
	this.gvars_datum_init_order += "admin_log";
	return f.dot;
});

// logging.dm:19
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_log", function InitGlobaladmin_log(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "admin_log";
	return f.dot;
});

// logging.dm:20
rt.def("/datum/controller/global_vars/proc/InitGloballastsignalers", function InitGloballastsignalers(f: Frame) {
	GLOB.lastsignalers = list();
	this.gvars_datum_init_order += "lastsignalers";
	return f.dot;
});

// logging.dm:21
rt.def("/datum/controller/global_vars/proc/InitGloballastsignalers", function InitGloballastsignalers(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "lastsignalers";
	return f.dot;
});

// logging.dm:22
rt.def("/datum/controller/global_vars/proc/InitGloballawchanges", function InitGloballawchanges(f: Frame) {
	GLOB.lawchanges = list();
	this.gvars_datum_init_order += "lawchanges";
	return f.dot;
});

// logging.dm:23
rt.def("/datum/controller/global_vars/proc/InitGloballawchanges", function InitGloballawchanges(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "lawchanges";
	return f.dot;
});

// logging.dm:25
rt.def("/datum/controller/global_vars/proc/InitGlobalcombatlog", function InitGlobalcombatlog(f: Frame) {
	GLOB.combatlog = list();
	this.gvars_datum_init_order += "combatlog";
	return f.dot;
});

// logging.dm:26
rt.def("/datum/controller/global_vars/proc/InitGlobalcombatlog", function InitGlobalcombatlog(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "combatlog";
	return f.dot;
});

// logging.dm:27
rt.def("/datum/controller/global_vars/proc/InitGlobalIClog", function InitGlobalIClog(f: Frame) {
	GLOB.IClog = list();
	this.gvars_datum_init_order += "IClog";
	return f.dot;
});

// logging.dm:28
rt.def("/datum/controller/global_vars/proc/InitGlobalIClog", function InitGlobalIClog(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "IClog";
	return f.dot;
});

// logging.dm:29
rt.def("/datum/controller/global_vars/proc/InitGlobalOOClog", function InitGlobalOOClog(f: Frame) {
	GLOB.OOClog = list();
	this.gvars_datum_init_order += "OOClog";
	return f.dot;
});

// logging.dm:30
rt.def("/datum/controller/global_vars/proc/InitGlobalOOClog", function InitGlobalOOClog(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "OOClog";
	return f.dot;
});

// logging.dm:31
rt.def("/datum/controller/global_vars/proc/InitGlobaladminlog", function InitGlobaladminlog(f: Frame) {
	GLOB.adminlog = list();
	this.gvars_datum_init_order += "adminlog";
	return f.dot;
});

// logging.dm:32
rt.def("/datum/controller/global_vars/proc/InitGlobaladminlog", function InitGlobaladminlog(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "adminlog";
	return f.dot;
});

// logging.dm:34
rt.def("/datum/controller/global_vars/proc/InitGlobalindividual_log_list", function InitGlobalindividual_log_list(f: Frame) {
	GLOB.individual_log_list = list();
	this.gvars_datum_init_order += "individual_log_list";
	return f.dot;
});

// logging.dm:36
rt.def("/datum/controller/global_vars/proc/InitGlobalactive_turfs_startlist", function InitGlobalactive_turfs_startlist(f: Frame) {
	GLOB.active_turfs_startlist = list();
	this.gvars_datum_init_order += "active_turfs_startlist";
	return f.dot;
});
