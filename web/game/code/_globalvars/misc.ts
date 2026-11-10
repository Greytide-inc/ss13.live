// Based on /tg/station's code/_globalvars/misc.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// misc.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_notice", function InitGlobaladmin_notice(f: Frame) {
	GLOB.admin_notice = "";
	this.gvars_datum_init_order += "admin_notice";
	return f.dot;
});

// misc.dm:3
rt.def("/datum/controller/global_vars/proc/InitGlobaltimezoneOffset", function InitGlobaltimezoneOffset(f: Frame) {
	GLOB.timezoneOffset = 0;
	this.gvars_datum_init_order += "timezoneOffset";
	return f.dot;
});

// misc.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalfileaccess_timer", function InitGlobalfileaccess_timer(f: Frame) {
	GLOB.fileaccess_timer = 0;
	this.gvars_datum_init_order += "fileaccess_timer";
	return f.dot;
});

// misc.dm:9
rt.def("/datum/controller/global_vars/proc/InitGlobalTAB", function InitGlobalTAB(f: Frame) {
	GLOB.TAB = "&nbsp;&nbsp;&nbsp;&nbsp;";
	this.gvars_datum_init_order += "TAB";
	return f.dot;
});

// misc.dm:11
rt.def("/datum/controller/global_vars/proc/InitGlobaldata_core", function InitGlobaldata_core(f: Frame) {
	GLOB.data_core = new_(T("/datum/datacore"));
	this.gvars_datum_init_order += "data_core";
	return f.dot;
});

// misc.dm:13
rt.def("/datum/controller/global_vars/proc/InitGlobalCELLRATE", function InitGlobalCELLRATE(f: Frame) {
	GLOB.CELLRATE = 0.002;
	this.gvars_datum_init_order += "CELLRATE";
	return f.dot;
});

// misc.dm:14
rt.def("/datum/controller/global_vars/proc/InitGlobalCHARGELEVEL", function InitGlobalCHARGELEVEL(f: Frame) {
	GLOB.CHARGELEVEL = 0.001;
	this.gvars_datum_init_order += "CHARGELEVEL";
	return f.dot;
});

// misc.dm:16
rt.def("/datum/controller/global_vars/proc/InitGlobalpowernets", function InitGlobalpowernets(f: Frame) {
	GLOB.powernets = list();
	this.gvars_datum_init_order += "powernets";
	return f.dot;
});

// misc.dm:18
rt.def("/datum/controller/global_vars/proc/InitGlobalbsa_unlock", function InitGlobalbsa_unlock(f: Frame) {
	GLOB.bsa_unlock = 0;
	this.gvars_datum_init_order += "bsa_unlock";
	return f.dot;
});
