// From code/_globalvars/misc.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobaladmin_notice  (code/_globalvars/misc.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_notice", function InitGlobaladmin_notice(f: Frame) {
	rt.setGl("admin_notice", "");
	rt.modSrcVar(f, "gvars_datum_init_order", "admin_notice", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaltimezoneOffset  (code/_globalvars/misc.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGlobaltimezoneOffset", function InitGlobaltimezoneOffset(f: Frame) {
	rt.setGl("timezoneOffset", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "timezoneOffset", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalfileaccess_timer  (code/_globalvars/misc.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalfileaccess_timer", function InitGlobalfileaccess_timer(f: Frame) {
	rt.setGl("fileaccess_timer", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "fileaccess_timer", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalTAB  (code/_globalvars/misc.dm:9)
rt.def("/datum/controller/global_vars/proc/InitGlobalTAB", function InitGlobalTAB(f: Frame) {
	rt.setGl("TAB", "&nbsp;&nbsp;&nbsp;&nbsp;");
	rt.modSrcVar(f, "gvars_datum_init_order", "TAB", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaldata_core  (code/_globalvars/misc.dm:11)
rt.def("/datum/controller/global_vars/proc/InitGlobaldata_core", function InitGlobaldata_core(f: Frame) {
	rt.setGl("data_core", rt.new_(f, T("/datum/datacore"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "data_core", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalCELLRATE  (code/_globalvars/misc.dm:13)
rt.def("/datum/controller/global_vars/proc/InitGlobalCELLRATE", function InitGlobalCELLRATE(f: Frame) {
	rt.setGl("CELLRATE", 0.0020000000949949026);
	rt.modSrcVar(f, "gvars_datum_init_order", "CELLRATE", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalCHARGELEVEL  (code/_globalvars/misc.dm:14)
rt.def("/datum/controller/global_vars/proc/InitGlobalCHARGELEVEL", function InitGlobalCHARGELEVEL(f: Frame) {
	rt.setGl("CHARGELEVEL", 0.0010000000474974513);
	rt.modSrcVar(f, "gvars_datum_init_order", "CHARGELEVEL", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalpowernets  (code/_globalvars/misc.dm:16)
rt.def("/datum/controller/global_vars/proc/InitGlobalpowernets", function InitGlobalpowernets(f: Frame) {
	rt.setGl("powernets", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "powernets", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalbsa_unlock  (code/_globalvars/misc.dm:18)
rt.def("/datum/controller/global_vars/proc/InitGlobalbsa_unlock", function InitGlobalbsa_unlock(f: Frame) {
	rt.setGl("bsa_unlock", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "bsa_unlock", add);
	return f.dot;
});
