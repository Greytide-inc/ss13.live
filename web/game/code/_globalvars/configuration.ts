// From code/_globalvars/configuration.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalhost  (code/_globalvars/configuration.dm:5)
rt.def("/datum/controller/global_vars/proc/InitGlobalhost", function InitGlobalhost(f: Frame) {
	rt.setGl("host", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "host", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaljoin_motd  (code/_globalvars/configuration.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobaljoin_motd", function InitGlobaljoin_motd(f: Frame) {
	rt.setGl("join_motd", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "join_motd", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalstation_name  (code/_globalvars/configuration.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalstation_name", function InitGlobalstation_name(f: Frame) {
	rt.setGl("station_name", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "station_name", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalgame_version  (code/_globalvars/configuration.dm:8)
rt.def("/datum/controller/global_vars/proc/InitGlobalgame_version", function InitGlobalgame_version(f: Frame) {
	rt.setGl("game_version", "/tg/ Station 13");
	rt.modSrcVar(f, "gvars_datum_init_order", "game_version", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalchangelog_hash  (code/_globalvars/configuration.dm:9)
rt.def("/datum/controller/global_vars/proc/InitGlobalchangelog_hash", function InitGlobalchangelog_hash(f: Frame) {
	rt.setGl("changelog_hash", "");
	rt.modSrcVar(f, "gvars_datum_init_order", "changelog_hash", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalooc_allowed  (code/_globalvars/configuration.dm:11)
rt.def("/datum/controller/global_vars/proc/InitGlobalooc_allowed", function InitGlobalooc_allowed(f: Frame) {
	rt.setGl("ooc_allowed", 1);
	rt.modSrcVar(f, "gvars_datum_init_order", "ooc_allowed", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaldooc_allowed  (code/_globalvars/configuration.dm:12)
rt.def("/datum/controller/global_vars/proc/InitGlobaldooc_allowed", function InitGlobaldooc_allowed(f: Frame) {
	rt.setGl("dooc_allowed", 1);
	rt.modSrcVar(f, "gvars_datum_init_order", "dooc_allowed", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalabandon_allowed  (code/_globalvars/configuration.dm:13)
rt.def("/datum/controller/global_vars/proc/InitGlobalabandon_allowed", function InitGlobalabandon_allowed(f: Frame) {
	rt.setGl("abandon_allowed", 1);
	rt.modSrcVar(f, "gvars_datum_init_order", "abandon_allowed", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalenter_allowed  (code/_globalvars/configuration.dm:14)
rt.def("/datum/controller/global_vars/proc/InitGlobalenter_allowed", function InitGlobalenter_allowed(f: Frame) {
	rt.setGl("enter_allowed", 1);
	rt.modSrcVar(f, "gvars_datum_init_order", "enter_allowed", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalguests_allowed  (code/_globalvars/configuration.dm:15)
rt.def("/datum/controller/global_vars/proc/InitGlobalguests_allowed", function InitGlobalguests_allowed(f: Frame) {
	rt.setGl("guests_allowed", 1);
	rt.modSrcVar(f, "gvars_datum_init_order", "guests_allowed", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalshuttle_frozen  (code/_globalvars/configuration.dm:16)
rt.def("/datum/controller/global_vars/proc/InitGlobalshuttle_frozen", function InitGlobalshuttle_frozen(f: Frame) {
	rt.setGl("shuttle_frozen", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "shuttle_frozen", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalshuttle_left  (code/_globalvars/configuration.dm:17)
rt.def("/datum/controller/global_vars/proc/InitGlobalshuttle_left", function InitGlobalshuttle_left(f: Frame) {
	rt.setGl("shuttle_left", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "shuttle_left", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaltinted_weldhelh  (code/_globalvars/configuration.dm:18)
rt.def("/datum/controller/global_vars/proc/InitGlobaltinted_weldhelh", function InitGlobaltinted_weldhelh(f: Frame) {
	rt.setGl("tinted_weldhelh", 1);
	rt.modSrcVar(f, "gvars_datum_init_order", "tinted_weldhelh", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalDebug  (code/_globalvars/configuration.dm:23)
rt.def("/datum/controller/global_vars/proc/InitGlobalDebug", function InitGlobalDebug(f: Frame) {
	rt.setGl("Debug", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "Debug", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalDebug2  (code/_globalvars/configuration.dm:24)
rt.def("/datum/controller/global_vars/proc/InitGlobalDebug2", function InitGlobalDebug2(f: Frame) {
	rt.setGl("Debug2", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "Debug2", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalMAX_EX_DEVESTATION_RANGE  (code/_globalvars/configuration.dm:27)
rt.def("/datum/controller/global_vars/proc/InitGlobalMAX_EX_DEVESTATION_RANGE", function InitGlobalMAX_EX_DEVESTATION_RANGE(f: Frame) {
	rt.setGl("MAX_EX_DEVESTATION_RANGE", 3);
	rt.modSrcVar(f, "gvars_datum_init_order", "MAX_EX_DEVESTATION_RANGE", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalMAX_EX_HEAVY_RANGE  (code/_globalvars/configuration.dm:28)
rt.def("/datum/controller/global_vars/proc/InitGlobalMAX_EX_HEAVY_RANGE", function InitGlobalMAX_EX_HEAVY_RANGE(f: Frame) {
	rt.setGl("MAX_EX_HEAVY_RANGE", 7);
	rt.modSrcVar(f, "gvars_datum_init_order", "MAX_EX_HEAVY_RANGE", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalMAX_EX_LIGHT_RANGE  (code/_globalvars/configuration.dm:29)
rt.def("/datum/controller/global_vars/proc/InitGlobalMAX_EX_LIGHT_RANGE", function InitGlobalMAX_EX_LIGHT_RANGE(f: Frame) {
	rt.setGl("MAX_EX_LIGHT_RANGE", 14);
	rt.modSrcVar(f, "gvars_datum_init_order", "MAX_EX_LIGHT_RANGE", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalMAX_EX_FLASH_RANGE  (code/_globalvars/configuration.dm:30)
rt.def("/datum/controller/global_vars/proc/InitGlobalMAX_EX_FLASH_RANGE", function InitGlobalMAX_EX_FLASH_RANGE(f: Frame) {
	rt.setGl("MAX_EX_FLASH_RANGE", 14);
	rt.modSrcVar(f, "gvars_datum_init_order", "MAX_EX_FLASH_RANGE", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalMAX_EX_FLAME_RANGE  (code/_globalvars/configuration.dm:31)
rt.def("/datum/controller/global_vars/proc/InitGlobalMAX_EX_FLAME_RANGE", function InitGlobalMAX_EX_FLAME_RANGE(f: Frame) {
	rt.setGl("MAX_EX_FLAME_RANGE", 14);
	rt.modSrcVar(f, "gvars_datum_init_order", "MAX_EX_FLAME_RANGE", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalDYN_EX_SCALE  (code/_globalvars/configuration.dm:32)
rt.def("/datum/controller/global_vars/proc/InitGlobalDYN_EX_SCALE", function InitGlobalDYN_EX_SCALE(f: Frame) {
	rt.setGl("DYN_EX_SCALE", 0.5);
	rt.modSrcVar(f, "gvars_datum_init_order", "DYN_EX_SCALE", add);
	return f.dot;
});
