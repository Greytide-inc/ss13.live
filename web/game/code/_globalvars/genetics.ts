// Based on /tg/station's code/_globalvars/genetics.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// genetics.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobalNEARSIGHTBLOCK", function InitGlobalNEARSIGHTBLOCK(f: Frame) {
	GLOB.NEARSIGHTBLOCK = 0;
	this.gvars_datum_init_order += "NEARSIGHTBLOCK";
	return f.dot;
});

// genetics.dm:3
rt.def("/datum/controller/global_vars/proc/InitGlobalEPILEPSYBLOCK", function InitGlobalEPILEPSYBLOCK(f: Frame) {
	GLOB.EPILEPSYBLOCK = 0;
	this.gvars_datum_init_order += "EPILEPSYBLOCK";
	return f.dot;
});

// genetics.dm:4
rt.def("/datum/controller/global_vars/proc/InitGlobalCOUGHBLOCK", function InitGlobalCOUGHBLOCK(f: Frame) {
	GLOB.COUGHBLOCK = 0;
	this.gvars_datum_init_order += "COUGHBLOCK";
	return f.dot;
});

// genetics.dm:5
rt.def("/datum/controller/global_vars/proc/InitGlobalTOURETTESBLOCK", function InitGlobalTOURETTESBLOCK(f: Frame) {
	GLOB.TOURETTESBLOCK = 0;
	this.gvars_datum_init_order += "TOURETTESBLOCK";
	return f.dot;
});

// genetics.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobalNERVOUSBLOCK", function InitGlobalNERVOUSBLOCK(f: Frame) {
	GLOB.NERVOUSBLOCK = 0;
	this.gvars_datum_init_order += "NERVOUSBLOCK";
	return f.dot;
});

// genetics.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalBLINDBLOCK", function InitGlobalBLINDBLOCK(f: Frame) {
	GLOB.BLINDBLOCK = 0;
	this.gvars_datum_init_order += "BLINDBLOCK";
	return f.dot;
});

// genetics.dm:8
rt.def("/datum/controller/global_vars/proc/InitGlobalDEAFBLOCK", function InitGlobalDEAFBLOCK(f: Frame) {
	GLOB.DEAFBLOCK = 0;
	this.gvars_datum_init_order += "DEAFBLOCK";
	return f.dot;
});

// genetics.dm:9
rt.def("/datum/controller/global_vars/proc/InitGlobalHULKBLOCK", function InitGlobalHULKBLOCK(f: Frame) {
	GLOB.HULKBLOCK = 0;
	this.gvars_datum_init_order += "HULKBLOCK";
	return f.dot;
});

// genetics.dm:10
rt.def("/datum/controller/global_vars/proc/InitGlobalTELEBLOCK", function InitGlobalTELEBLOCK(f: Frame) {
	GLOB.TELEBLOCK = 0;
	this.gvars_datum_init_order += "TELEBLOCK";
	return f.dot;
});

// genetics.dm:11
rt.def("/datum/controller/global_vars/proc/InitGlobalFIREBLOCK", function InitGlobalFIREBLOCK(f: Frame) {
	GLOB.FIREBLOCK = 0;
	this.gvars_datum_init_order += "FIREBLOCK";
	return f.dot;
});

// genetics.dm:12
rt.def("/datum/controller/global_vars/proc/InitGlobalXRAYBLOCK", function InitGlobalXRAYBLOCK(f: Frame) {
	GLOB.XRAYBLOCK = 0;
	this.gvars_datum_init_order += "XRAYBLOCK";
	return f.dot;
});

// genetics.dm:13
rt.def("/datum/controller/global_vars/proc/InitGlobalCLUMSYBLOCK", function InitGlobalCLUMSYBLOCK(f: Frame) {
	GLOB.CLUMSYBLOCK = 0;
	this.gvars_datum_init_order += "CLUMSYBLOCK";
	return f.dot;
});

// genetics.dm:14
rt.def("/datum/controller/global_vars/proc/InitGlobalSTRANGEBLOCK", function InitGlobalSTRANGEBLOCK(f: Frame) {
	GLOB.STRANGEBLOCK = 0;
	this.gvars_datum_init_order += "STRANGEBLOCK";
	return f.dot;
});

// genetics.dm:15
rt.def("/datum/controller/global_vars/proc/InitGlobalRACEBLOCK", function InitGlobalRACEBLOCK(f: Frame) {
	GLOB.RACEBLOCK = 0;
	this.gvars_datum_init_order += "RACEBLOCK";
	return f.dot;
});

// genetics.dm:17
rt.def("/datum/controller/global_vars/proc/InitGlobalbad_se_blocks", function InitGlobalbad_se_blocks(f: Frame) {
	GLOB.bad_se_blocks = null;
	this.gvars_datum_init_order += "bad_se_blocks";
	return f.dot;
});

// genetics.dm:18
rt.def("/datum/controller/global_vars/proc/InitGlobalgood_se_blocks", function InitGlobalgood_se_blocks(f: Frame) {
	GLOB.good_se_blocks = null;
	this.gvars_datum_init_order += "good_se_blocks";
	return f.dot;
});

// genetics.dm:19
rt.def("/datum/controller/global_vars/proc/InitGlobalop_se_blocks", function InitGlobalop_se_blocks(f: Frame) {
	GLOB.op_se_blocks = null;
	this.gvars_datum_init_order += "op_se_blocks";
	return f.dot;
});

// genetics.dm:21
rt.def("/datum/controller/global_vars/proc/InitGlobalNULLED_SE", function InitGlobalNULLED_SE(f: Frame) {
	GLOB.NULLED_SE = null;
	this.gvars_datum_init_order += "NULLED_SE";
	return f.dot;
});

// genetics.dm:22
rt.def("/datum/controller/global_vars/proc/InitGlobalNULLED_UI", function InitGlobalNULLED_UI(f: Frame) {
	GLOB.NULLED_UI = null;
	this.gvars_datum_init_order += "NULLED_UI";
	return f.dot;
});

// genetics.dm:24
rt.def("/datum/controller/global_vars/proc/InitGlobalglobal_mutations", function InitGlobalglobal_mutations(f: Frame) {
	GLOB.global_mutations = list();
	this.gvars_datum_init_order += "global_mutations";
	return f.dot;
});

// genetics.dm:26
rt.def("/datum/controller/global_vars/proc/InitGlobalbad_mutations", function InitGlobalbad_mutations(f: Frame) {
	GLOB.bad_mutations = list();
	this.gvars_datum_init_order += "bad_mutations";
	return f.dot;
});

// genetics.dm:27
rt.def("/datum/controller/global_vars/proc/InitGlobalgood_mutations", function InitGlobalgood_mutations(f: Frame) {
	GLOB.good_mutations = list();
	this.gvars_datum_init_order += "good_mutations";
	return f.dot;
});

// genetics.dm:28
rt.def("/datum/controller/global_vars/proc/InitGlobalnot_good_mutations", function InitGlobalnot_good_mutations(f: Frame) {
	GLOB.not_good_mutations = list();
	this.gvars_datum_init_order += "not_good_mutations";
	return f.dot;
});
