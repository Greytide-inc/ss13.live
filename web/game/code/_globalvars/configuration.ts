// Based on /tg/station's code/_globalvars/configuration.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// configuration.dm:5
rt.def("/datum/controller/global_vars/proc/InitGlobalhost", function InitGlobalhost(f: Frame) {
	GLOB.host = null;
	this.gvars_datum_init_order += "host";
	return f.dot;
});

// configuration.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobaljoin_motd", function InitGlobaljoin_motd(f: Frame) {
	GLOB.join_motd = null;
	this.gvars_datum_init_order += "join_motd";
	return f.dot;
});

// configuration.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalstation_name", function InitGlobalstation_name(f: Frame) {
	GLOB.station_name = null;
	this.gvars_datum_init_order += "station_name";
	return f.dot;
});

// configuration.dm:8
rt.def("/datum/controller/global_vars/proc/InitGlobalgame_version", function InitGlobalgame_version(f: Frame) {
	GLOB.game_version = "/tg/ Station 13";
	this.gvars_datum_init_order += "game_version";
	return f.dot;
});

// configuration.dm:9
rt.def("/datum/controller/global_vars/proc/InitGlobalchangelog_hash", function InitGlobalchangelog_hash(f: Frame) {
	GLOB.changelog_hash = "";
	this.gvars_datum_init_order += "changelog_hash";
	return f.dot;
});

// configuration.dm:11
rt.def("/datum/controller/global_vars/proc/InitGlobalooc_allowed", function InitGlobalooc_allowed(f: Frame) {
	GLOB.ooc_allowed = 1;
	this.gvars_datum_init_order += "ooc_allowed";
	return f.dot;
});

// configuration.dm:12
rt.def("/datum/controller/global_vars/proc/InitGlobaldooc_allowed", function InitGlobaldooc_allowed(f: Frame) {
	GLOB.dooc_allowed = 1;
	this.gvars_datum_init_order += "dooc_allowed";
	return f.dot;
});

// configuration.dm:13
rt.def("/datum/controller/global_vars/proc/InitGlobalabandon_allowed", function InitGlobalabandon_allowed(f: Frame) {
	GLOB.abandon_allowed = 1;
	this.gvars_datum_init_order += "abandon_allowed";
	return f.dot;
});

// configuration.dm:14
rt.def("/datum/controller/global_vars/proc/InitGlobalenter_allowed", function InitGlobalenter_allowed(f: Frame) {
	GLOB.enter_allowed = 1;
	this.gvars_datum_init_order += "enter_allowed";
	return f.dot;
});

// configuration.dm:15
rt.def("/datum/controller/global_vars/proc/InitGlobalguests_allowed", function InitGlobalguests_allowed(f: Frame) {
	GLOB.guests_allowed = 1;
	this.gvars_datum_init_order += "guests_allowed";
	return f.dot;
});

// configuration.dm:16
rt.def("/datum/controller/global_vars/proc/InitGlobalshuttle_frozen", function InitGlobalshuttle_frozen(f: Frame) {
	GLOB.shuttle_frozen = 0;
	this.gvars_datum_init_order += "shuttle_frozen";
	return f.dot;
});

// configuration.dm:17
rt.def("/datum/controller/global_vars/proc/InitGlobalshuttle_left", function InitGlobalshuttle_left(f: Frame) {
	GLOB.shuttle_left = 0;
	this.gvars_datum_init_order += "shuttle_left";
	return f.dot;
});

// configuration.dm:18
rt.def("/datum/controller/global_vars/proc/InitGlobaltinted_weldhelh", function InitGlobaltinted_weldhelh(f: Frame) {
	GLOB.tinted_weldhelh = 1;
	this.gvars_datum_init_order += "tinted_weldhelh";
	return f.dot;
});

// configuration.dm:23
rt.def("/datum/controller/global_vars/proc/InitGlobalDebug", function InitGlobalDebug(f: Frame) {
	GLOB.Debug = 0;
	this.gvars_datum_init_order += "Debug";
	return f.dot;
});

// configuration.dm:24
rt.def("/datum/controller/global_vars/proc/InitGlobalDebug2", function InitGlobalDebug2(f: Frame) {
	GLOB.Debug2 = 0;
	this.gvars_datum_init_order += "Debug2";
	return f.dot;
});

// configuration.dm:27
rt.def("/datum/controller/global_vars/proc/InitGlobalMAX_EX_DEVESTATION_RANGE", function InitGlobalMAX_EX_DEVESTATION_RANGE(f: Frame) {
	GLOB.MAX_EX_DEVESTATION_RANGE = 3;
	this.gvars_datum_init_order += "MAX_EX_DEVESTATION_RANGE";
	return f.dot;
});

// configuration.dm:28
rt.def("/datum/controller/global_vars/proc/InitGlobalMAX_EX_HEAVY_RANGE", function InitGlobalMAX_EX_HEAVY_RANGE(f: Frame) {
	GLOB.MAX_EX_HEAVY_RANGE = 7;
	this.gvars_datum_init_order += "MAX_EX_HEAVY_RANGE";
	return f.dot;
});

// configuration.dm:29
rt.def("/datum/controller/global_vars/proc/InitGlobalMAX_EX_LIGHT_RANGE", function InitGlobalMAX_EX_LIGHT_RANGE(f: Frame) {
	GLOB.MAX_EX_LIGHT_RANGE = 14;
	this.gvars_datum_init_order += "MAX_EX_LIGHT_RANGE";
	return f.dot;
});

// configuration.dm:30
rt.def("/datum/controller/global_vars/proc/InitGlobalMAX_EX_FLASH_RANGE", function InitGlobalMAX_EX_FLASH_RANGE(f: Frame) {
	GLOB.MAX_EX_FLASH_RANGE = 14;
	this.gvars_datum_init_order += "MAX_EX_FLASH_RANGE";
	return f.dot;
});

// configuration.dm:31
rt.def("/datum/controller/global_vars/proc/InitGlobalMAX_EX_FLAME_RANGE", function InitGlobalMAX_EX_FLAME_RANGE(f: Frame) {
	GLOB.MAX_EX_FLAME_RANGE = 14;
	this.gvars_datum_init_order += "MAX_EX_FLAME_RANGE";
	return f.dot;
});

// configuration.dm:32
rt.def("/datum/controller/global_vars/proc/InitGlobalDYN_EX_SCALE", function InitGlobalDYN_EX_SCALE(f: Frame) {
	GLOB.DYN_EX_SCALE = 0.5;
	this.gvars_datum_init_order += "DYN_EX_SCALE";
	return f.dot;
});
