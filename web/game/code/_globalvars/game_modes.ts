// Based on /tg/station's code/_globalvars/game_modes.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// game_modes.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalmaster_mode", function InitGlobalmaster_mode(f: Frame) {
	GLOB.master_mode = "traitor";
	this.gvars_datum_init_order += "master_mode";
	return f.dot;
});

// game_modes.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobalsecret_force_mode", function InitGlobalsecret_force_mode(f: Frame) {
	GLOB.secret_force_mode = "secret";
	this.gvars_datum_init_order += "secret_force_mode";
	return f.dot;
});

// game_modes.dm:4
rt.def("/datum/controller/global_vars/proc/InitGlobalwavesecret", function InitGlobalwavesecret(f: Frame) {
	GLOB.wavesecret = 0;
	this.gvars_datum_init_order += "wavesecret";
	return f.dot;
});

// game_modes.dm:5
rt.def("/datum/controller/global_vars/proc/InitGlobalstart_state", function InitGlobalstart_state(f: Frame) {
	GLOB.start_state = null;
	this.gvars_datum_init_order += "start_state";
	return f.dot;
});

// game_modes.dm:8
rt.def("/datum/controller/global_vars/proc/InitGlobalblood_target", function InitGlobalblood_target(f: Frame) {
	GLOB.blood_target = null;
	this.gvars_datum_init_order += "blood_target";
	return f.dot;
});

// game_modes.dm:9
rt.def("/datum/controller/global_vars/proc/InitGlobalblood_target_image", function InitGlobalblood_target_image(f: Frame) {
	GLOB.blood_target_image = null;
	this.gvars_datum_init_order += "blood_target_image";
	return f.dot;
});

// game_modes.dm:10
rt.def("/datum/controller/global_vars/proc/InitGlobalblood_target_reset_timer", function InitGlobalblood_target_reset_timer(f: Frame) {
	GLOB.blood_target_reset_timer = null;
	this.gvars_datum_init_order += "blood_target_reset_timer";
	return f.dot;
});

// game_modes.dm:11
rt.def("/datum/controller/global_vars/proc/InitGlobalsac_mind", function InitGlobalsac_mind(f: Frame) {
	GLOB.sac_mind = null;
	this.gvars_datum_init_order += "sac_mind";
	return f.dot;
});

// game_modes.dm:12
rt.def("/datum/controller/global_vars/proc/InitGlobalsac_image", function InitGlobalsac_image(f: Frame) {
	GLOB.sac_image = null;
	this.gvars_datum_init_order += "sac_image";
	return f.dot;
});

// game_modes.dm:13
rt.def("/datum/controller/global_vars/proc/InitGlobalcult_vote_called", function InitGlobalcult_vote_called(f: Frame) {
	GLOB.cult_vote_called = 0;
	this.gvars_datum_init_order += "cult_vote_called";
	return f.dot;
});

// game_modes.dm:14
rt.def("/datum/controller/global_vars/proc/InitGlobalcult_mastered", function InitGlobalcult_mastered(f: Frame) {
	GLOB.cult_mastered = 0;
	this.gvars_datum_init_order += "cult_mastered";
	return f.dot;
});

// game_modes.dm:15
rt.def("/datum/controller/global_vars/proc/InitGlobalreckoning_complete", function InitGlobalreckoning_complete(f: Frame) {
	GLOB.reckoning_complete = 0;
	this.gvars_datum_init_order += "reckoning_complete";
	return f.dot;
});

// game_modes.dm:16
rt.def("/datum/controller/global_vars/proc/InitGlobalsac_complete", function InitGlobalsac_complete(f: Frame) {
	GLOB.sac_complete = 0;
	this.gvars_datum_init_order += "sac_complete";
	return f.dot;
});

// game_modes.dm:17
rt.def("/datum/controller/global_vars/proc/InitGlobalcult_narsie", function InitGlobalcult_narsie(f: Frame) {
	GLOB.cult_narsie = null;
	this.gvars_datum_init_order += "cult_narsie";
	return f.dot;
});

// game_modes.dm:18
rt.def("/datum/controller/global_vars/proc/InitGlobalsummon_spots", function InitGlobalsummon_spots(f: Frame) {
	GLOB.summon_spots = list();
	this.gvars_datum_init_order += "summon_spots";
	return f.dot;
});
