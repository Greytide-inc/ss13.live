// From code/_globalvars/genetics.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalNEARSIGHTBLOCK  (code/_globalvars/genetics.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobalNEARSIGHTBLOCK", function InitGlobalNEARSIGHTBLOCK(f: Frame) {
	rt.setGl("NEARSIGHTBLOCK", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "NEARSIGHTBLOCK", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalEPILEPSYBLOCK  (code/_globalvars/genetics.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGlobalEPILEPSYBLOCK", function InitGlobalEPILEPSYBLOCK(f: Frame) {
	rt.setGl("EPILEPSYBLOCK", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "EPILEPSYBLOCK", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalCOUGHBLOCK  (code/_globalvars/genetics.dm:4)
rt.def("/datum/controller/global_vars/proc/InitGlobalCOUGHBLOCK", function InitGlobalCOUGHBLOCK(f: Frame) {
	rt.setGl("COUGHBLOCK", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "COUGHBLOCK", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalTOURETTESBLOCK  (code/_globalvars/genetics.dm:5)
rt.def("/datum/controller/global_vars/proc/InitGlobalTOURETTESBLOCK", function InitGlobalTOURETTESBLOCK(f: Frame) {
	rt.setGl("TOURETTESBLOCK", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "TOURETTESBLOCK", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalNERVOUSBLOCK  (code/_globalvars/genetics.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobalNERVOUSBLOCK", function InitGlobalNERVOUSBLOCK(f: Frame) {
	rt.setGl("NERVOUSBLOCK", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "NERVOUSBLOCK", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalBLINDBLOCK  (code/_globalvars/genetics.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalBLINDBLOCK", function InitGlobalBLINDBLOCK(f: Frame) {
	rt.setGl("BLINDBLOCK", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "BLINDBLOCK", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalDEAFBLOCK  (code/_globalvars/genetics.dm:8)
rt.def("/datum/controller/global_vars/proc/InitGlobalDEAFBLOCK", function InitGlobalDEAFBLOCK(f: Frame) {
	rt.setGl("DEAFBLOCK", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "DEAFBLOCK", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalHULKBLOCK  (code/_globalvars/genetics.dm:9)
rt.def("/datum/controller/global_vars/proc/InitGlobalHULKBLOCK", function InitGlobalHULKBLOCK(f: Frame) {
	rt.setGl("HULKBLOCK", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "HULKBLOCK", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalTELEBLOCK  (code/_globalvars/genetics.dm:10)
rt.def("/datum/controller/global_vars/proc/InitGlobalTELEBLOCK", function InitGlobalTELEBLOCK(f: Frame) {
	rt.setGl("TELEBLOCK", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "TELEBLOCK", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalFIREBLOCK  (code/_globalvars/genetics.dm:11)
rt.def("/datum/controller/global_vars/proc/InitGlobalFIREBLOCK", function InitGlobalFIREBLOCK(f: Frame) {
	rt.setGl("FIREBLOCK", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "FIREBLOCK", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalXRAYBLOCK  (code/_globalvars/genetics.dm:12)
rt.def("/datum/controller/global_vars/proc/InitGlobalXRAYBLOCK", function InitGlobalXRAYBLOCK(f: Frame) {
	rt.setGl("XRAYBLOCK", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "XRAYBLOCK", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalCLUMSYBLOCK  (code/_globalvars/genetics.dm:13)
rt.def("/datum/controller/global_vars/proc/InitGlobalCLUMSYBLOCK", function InitGlobalCLUMSYBLOCK(f: Frame) {
	rt.setGl("CLUMSYBLOCK", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "CLUMSYBLOCK", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalSTRANGEBLOCK  (code/_globalvars/genetics.dm:14)
rt.def("/datum/controller/global_vars/proc/InitGlobalSTRANGEBLOCK", function InitGlobalSTRANGEBLOCK(f: Frame) {
	rt.setGl("STRANGEBLOCK", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "STRANGEBLOCK", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalRACEBLOCK  (code/_globalvars/genetics.dm:15)
rt.def("/datum/controller/global_vars/proc/InitGlobalRACEBLOCK", function InitGlobalRACEBLOCK(f: Frame) {
	rt.setGl("RACEBLOCK", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "RACEBLOCK", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalbad_se_blocks  (code/_globalvars/genetics.dm:17)
rt.def("/datum/controller/global_vars/proc/InitGlobalbad_se_blocks", function InitGlobalbad_se_blocks(f: Frame) {
	rt.setGl("bad_se_blocks", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "bad_se_blocks", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalgood_se_blocks  (code/_globalvars/genetics.dm:18)
rt.def("/datum/controller/global_vars/proc/InitGlobalgood_se_blocks", function InitGlobalgood_se_blocks(f: Frame) {
	rt.setGl("good_se_blocks", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "good_se_blocks", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalop_se_blocks  (code/_globalvars/genetics.dm:19)
rt.def("/datum/controller/global_vars/proc/InitGlobalop_se_blocks", function InitGlobalop_se_blocks(f: Frame) {
	rt.setGl("op_se_blocks", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "op_se_blocks", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalNULLED_SE  (code/_globalvars/genetics.dm:21)
rt.def("/datum/controller/global_vars/proc/InitGlobalNULLED_SE", function InitGlobalNULLED_SE(f: Frame) {
	rt.setGl("NULLED_SE", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "NULLED_SE", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalNULLED_UI  (code/_globalvars/genetics.dm:22)
rt.def("/datum/controller/global_vars/proc/InitGlobalNULLED_UI", function InitGlobalNULLED_UI(f: Frame) {
	rt.setGl("NULLED_UI", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "NULLED_UI", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalglobal_mutations  (code/_globalvars/genetics.dm:24)
rt.def("/datum/controller/global_vars/proc/InitGlobalglobal_mutations", function InitGlobalglobal_mutations(f: Frame) {
	rt.setGl("global_mutations", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "global_mutations", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalbad_mutations  (code/_globalvars/genetics.dm:26)
rt.def("/datum/controller/global_vars/proc/InitGlobalbad_mutations", function InitGlobalbad_mutations(f: Frame) {
	rt.setGl("bad_mutations", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "bad_mutations", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalgood_mutations  (code/_globalvars/genetics.dm:27)
rt.def("/datum/controller/global_vars/proc/InitGlobalgood_mutations", function InitGlobalgood_mutations(f: Frame) {
	rt.setGl("good_mutations", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "good_mutations", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalnot_good_mutations  (code/_globalvars/genetics.dm:28)
rt.def("/datum/controller/global_vars/proc/InitGlobalnot_good_mutations", function InitGlobalnot_good_mutations(f: Frame) {
	rt.setGl("not_good_mutations", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "not_good_mutations", add);
	return f.dot;
});
