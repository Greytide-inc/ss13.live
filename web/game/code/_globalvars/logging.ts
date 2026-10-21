// From code/_globalvars/logging.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGloballog_directory  (code/_globalvars/logging.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGloballog_directory", function InitGloballog_directory(f: Frame) {
	rt.setGl("log_directory", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "log_directory", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGloballog_directory  (code/_globalvars/logging.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGloballog_directory", function InitGloballog_directory(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "log_directory", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalworld_game_log  (code/_globalvars/logging.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGlobalworld_game_log", function InitGlobalworld_game_log(f: Frame) {
	rt.setGl("world_game_log", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "world_game_log", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalworld_game_log  (code/_globalvars/logging.dm:4)
rt.def("/datum/controller/global_vars/proc/InitGlobalworld_game_log", function InitGlobalworld_game_log(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "world_game_log", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalworld_runtime_log  (code/_globalvars/logging.dm:5)
rt.def("/datum/controller/global_vars/proc/InitGlobalworld_runtime_log", function InitGlobalworld_runtime_log(f: Frame) {
	rt.setGl("world_runtime_log", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "world_runtime_log", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalworld_runtime_log  (code/_globalvars/logging.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobalworld_runtime_log", function InitGlobalworld_runtime_log(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "world_runtime_log", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalworld_attack_log  (code/_globalvars/logging.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalworld_attack_log", function InitGlobalworld_attack_log(f: Frame) {
	rt.setGl("world_attack_log", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "world_attack_log", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalworld_attack_log  (code/_globalvars/logging.dm:8)
rt.def("/datum/controller/global_vars/proc/InitGlobalworld_attack_log", function InitGlobalworld_attack_log(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "world_attack_log", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalworld_href_log  (code/_globalvars/logging.dm:9)
rt.def("/datum/controller/global_vars/proc/InitGlobalworld_href_log", function InitGlobalworld_href_log(f: Frame) {
	rt.setGl("world_href_log", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "world_href_log", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalworld_href_log  (code/_globalvars/logging.dm:10)
rt.def("/datum/controller/global_vars/proc/InitGlobalworld_href_log", function InitGlobalworld_href_log(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "world_href_log", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalconfig_error_log  (code/_globalvars/logging.dm:13)
rt.def("/datum/controller/global_vars/proc/InitGlobalconfig_error_log", function InitGlobalconfig_error_log(f: Frame) {
	rt.setGl("config_error_log", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "config_error_log", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalconfig_error_log  (code/_globalvars/logging.dm:14)
rt.def("/datum/controller/global_vars/proc/InitGlobalconfig_error_log", function InitGlobalconfig_error_log(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "config_error_log", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalbombers  (code/_globalvars/logging.dm:16)
rt.def("/datum/controller/global_vars/proc/InitGlobalbombers", function InitGlobalbombers(f: Frame) {
	rt.setGl("bombers", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "bombers", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalbombers  (code/_globalvars/logging.dm:17)
rt.def("/datum/controller/global_vars/proc/InitGlobalbombers", function InitGlobalbombers(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "bombers", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_log  (code/_globalvars/logging.dm:18)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_log", function InitGlobaladmin_log(f: Frame) {
	rt.setGl("admin_log", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "admin_log", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_log  (code/_globalvars/logging.dm:19)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_log", function InitGlobaladmin_log(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "admin_log", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGloballastsignalers  (code/_globalvars/logging.dm:20)
rt.def("/datum/controller/global_vars/proc/InitGloballastsignalers", function InitGloballastsignalers(f: Frame) {
	rt.setGl("lastsignalers", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "lastsignalers", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGloballastsignalers  (code/_globalvars/logging.dm:21)
rt.def("/datum/controller/global_vars/proc/InitGloballastsignalers", function InitGloballastsignalers(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "lastsignalers", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGloballawchanges  (code/_globalvars/logging.dm:22)
rt.def("/datum/controller/global_vars/proc/InitGloballawchanges", function InitGloballawchanges(f: Frame) {
	rt.setGl("lawchanges", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "lawchanges", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGloballawchanges  (code/_globalvars/logging.dm:23)
rt.def("/datum/controller/global_vars/proc/InitGloballawchanges", function InitGloballawchanges(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "lawchanges", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalcombatlog  (code/_globalvars/logging.dm:25)
rt.def("/datum/controller/global_vars/proc/InitGlobalcombatlog", function InitGlobalcombatlog(f: Frame) {
	rt.setGl("combatlog", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "combatlog", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalcombatlog  (code/_globalvars/logging.dm:26)
rt.def("/datum/controller/global_vars/proc/InitGlobalcombatlog", function InitGlobalcombatlog(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "combatlog", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalIClog  (code/_globalvars/logging.dm:27)
rt.def("/datum/controller/global_vars/proc/InitGlobalIClog", function InitGlobalIClog(f: Frame) {
	rt.setGl("IClog", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "IClog", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalIClog  (code/_globalvars/logging.dm:28)
rt.def("/datum/controller/global_vars/proc/InitGlobalIClog", function InitGlobalIClog(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "IClog", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalOOClog  (code/_globalvars/logging.dm:29)
rt.def("/datum/controller/global_vars/proc/InitGlobalOOClog", function InitGlobalOOClog(f: Frame) {
	rt.setGl("OOClog", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "OOClog", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalOOClog  (code/_globalvars/logging.dm:30)
rt.def("/datum/controller/global_vars/proc/InitGlobalOOClog", function InitGlobalOOClog(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "OOClog", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladminlog  (code/_globalvars/logging.dm:31)
rt.def("/datum/controller/global_vars/proc/InitGlobaladminlog", function InitGlobaladminlog(f: Frame) {
	rt.setGl("adminlog", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "adminlog", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladminlog  (code/_globalvars/logging.dm:32)
rt.def("/datum/controller/global_vars/proc/InitGlobaladminlog", function InitGlobaladminlog(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "adminlog", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalindividual_log_list  (code/_globalvars/logging.dm:34)
rt.def("/datum/controller/global_vars/proc/InitGlobalindividual_log_list", function InitGlobalindividual_log_list(f: Frame) {
	rt.setGl("individual_log_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "individual_log_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalactive_turfs_startlist  (code/_globalvars/logging.dm:36)
rt.def("/datum/controller/global_vars/proc/InitGlobalactive_turfs_startlist", function InitGlobalactive_turfs_startlist(f: Frame) {
	rt.setGl("active_turfs_startlist", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "active_turfs_startlist", add);
	return f.dot;
});
