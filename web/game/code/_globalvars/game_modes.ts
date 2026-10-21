// From code/_globalvars/game_modes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalmaster_mode  (code/_globalvars/game_modes.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalmaster_mode", function InitGlobalmaster_mode(f: Frame) {
	rt.setGl("master_mode", "traitor");
	rt.modSrcVar(f, "gvars_datum_init_order", "master_mode", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsecret_force_mode  (code/_globalvars/game_modes.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobalsecret_force_mode", function InitGlobalsecret_force_mode(f: Frame) {
	rt.setGl("secret_force_mode", "secret");
	rt.modSrcVar(f, "gvars_datum_init_order", "secret_force_mode", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalwavesecret  (code/_globalvars/game_modes.dm:4)
rt.def("/datum/controller/global_vars/proc/InitGlobalwavesecret", function InitGlobalwavesecret(f: Frame) {
	rt.setGl("wavesecret", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "wavesecret", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalstart_state  (code/_globalvars/game_modes.dm:5)
rt.def("/datum/controller/global_vars/proc/InitGlobalstart_state", function InitGlobalstart_state(f: Frame) {
	rt.setGl("start_state", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "start_state", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalblood_target  (code/_globalvars/game_modes.dm:8)
rt.def("/datum/controller/global_vars/proc/InitGlobalblood_target", function InitGlobalblood_target(f: Frame) {
	rt.setGl("blood_target", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "blood_target", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalblood_target_image  (code/_globalvars/game_modes.dm:9)
rt.def("/datum/controller/global_vars/proc/InitGlobalblood_target_image", function InitGlobalblood_target_image(f: Frame) {
	rt.setGl("blood_target_image", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "blood_target_image", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalblood_target_reset_timer  (code/_globalvars/game_modes.dm:10)
rt.def("/datum/controller/global_vars/proc/InitGlobalblood_target_reset_timer", function InitGlobalblood_target_reset_timer(f: Frame) {
	rt.setGl("blood_target_reset_timer", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "blood_target_reset_timer", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsac_mind  (code/_globalvars/game_modes.dm:11)
rt.def("/datum/controller/global_vars/proc/InitGlobalsac_mind", function InitGlobalsac_mind(f: Frame) {
	rt.setGl("sac_mind", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "sac_mind", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsac_image  (code/_globalvars/game_modes.dm:12)
rt.def("/datum/controller/global_vars/proc/InitGlobalsac_image", function InitGlobalsac_image(f: Frame) {
	rt.setGl("sac_image", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "sac_image", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalcult_vote_called  (code/_globalvars/game_modes.dm:13)
rt.def("/datum/controller/global_vars/proc/InitGlobalcult_vote_called", function InitGlobalcult_vote_called(f: Frame) {
	rt.setGl("cult_vote_called", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "cult_vote_called", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalcult_mastered  (code/_globalvars/game_modes.dm:14)
rt.def("/datum/controller/global_vars/proc/InitGlobalcult_mastered", function InitGlobalcult_mastered(f: Frame) {
	rt.setGl("cult_mastered", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "cult_mastered", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalreckoning_complete  (code/_globalvars/game_modes.dm:15)
rt.def("/datum/controller/global_vars/proc/InitGlobalreckoning_complete", function InitGlobalreckoning_complete(f: Frame) {
	rt.setGl("reckoning_complete", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "reckoning_complete", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsac_complete  (code/_globalvars/game_modes.dm:16)
rt.def("/datum/controller/global_vars/proc/InitGlobalsac_complete", function InitGlobalsac_complete(f: Frame) {
	rt.setGl("sac_complete", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "sac_complete", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalcult_narsie  (code/_globalvars/game_modes.dm:17)
rt.def("/datum/controller/global_vars/proc/InitGlobalcult_narsie", function InitGlobalcult_narsie(f: Frame) {
	rt.setGl("cult_narsie", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "cult_narsie", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsummon_spots  (code/_globalvars/game_modes.dm:18)
rt.def("/datum/controller/global_vars/proc/InitGlobalsummon_spots", function InitGlobalsummon_spots(f: Frame) {
	rt.setGl("summon_spots", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "summon_spots", add);
	return f.dot;
});
