// Based on /tg/station's code/_globalvars/lists/mobs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// mobs.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalclients", function InitGlobalclients(f: Frame) {
	GLOB.clients = list();
	this.gvars_datum_init_order += "clients";
	return f.dot;
});

// mobs.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobaladmins", function InitGlobaladmins(f: Frame) {
	GLOB.admins = list();
	this.gvars_datum_init_order += "admins";
	return f.dot;
});

// mobs.dm:3
rt.def("/datum/controller/global_vars/proc/InitGlobaladmins", function InitGlobaladmins(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "admins";
	return f.dot;
});

// mobs.dm:4
rt.def("/datum/controller/global_vars/proc/InitGlobaldeadmins", function InitGlobaldeadmins(f: Frame) {
	GLOB.deadmins = list();
	this.gvars_datum_init_order += "deadmins";
	return f.dot;
});

// mobs.dm:5
rt.def("/datum/controller/global_vars/proc/InitGlobaldeadmins", function InitGlobaldeadmins(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "deadmins";
	return f.dot;
});

// mobs.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobaldirectory", function InitGlobaldirectory(f: Frame) {
	GLOB.directory = list();
	this.gvars_datum_init_order += "directory";
	return f.dot;
});

// mobs.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalstealthminID", function InitGlobalstealthminID(f: Frame) {
	GLOB.stealthminID = list();
	this.gvars_datum_init_order += "stealthminID";
	return f.dot;
});

// mobs.dm:12
rt.def("/datum/controller/global_vars/proc/InitGlobalplayer_list", function InitGlobalplayer_list(f: Frame) {
	GLOB.player_list = list();
	this.gvars_datum_init_order += "player_list";
	return f.dot;
});

// mobs.dm:13
rt.def("/datum/controller/global_vars/proc/InitGlobalmob_list", function InitGlobalmob_list(f: Frame) {
	GLOB.mob_list = list();
	this.gvars_datum_init_order += "mob_list";
	return f.dot;
});

// mobs.dm:14
rt.def("/datum/controller/global_vars/proc/InitGlobalmob_directory", function InitGlobalmob_directory(f: Frame) {
	GLOB.mob_directory = list();
	this.gvars_datum_init_order += "mob_directory";
	return f.dot;
});

// mobs.dm:15
rt.def("/datum/controller/global_vars/proc/InitGloballiving_mob_list", function InitGloballiving_mob_list(f: Frame) {
	GLOB.living_mob_list = list();
	this.gvars_datum_init_order += "living_mob_list";
	return f.dot;
});

// mobs.dm:16
rt.def("/datum/controller/global_vars/proc/InitGlobaldead_mob_list", function InitGlobaldead_mob_list(f: Frame) {
	GLOB.dead_mob_list = list();
	this.gvars_datum_init_order += "dead_mob_list";
	return f.dot;
});

// mobs.dm:17
rt.def("/datum/controller/global_vars/proc/InitGlobaljoined_player_list", function InitGlobaljoined_player_list(f: Frame) {
	GLOB.joined_player_list = list();
	this.gvars_datum_init_order += "joined_player_list";
	return f.dot;
});

// mobs.dm:18
rt.def("/datum/controller/global_vars/proc/InitGlobalsilicon_mobs", function InitGlobalsilicon_mobs(f: Frame) {
	GLOB.silicon_mobs = list();
	this.gvars_datum_init_order += "silicon_mobs";
	return f.dot;
});

// mobs.dm:19
rt.def("/datum/controller/global_vars/proc/InitGlobalai_list", function InitGlobalai_list(f: Frame) {
	GLOB.ai_list = list();
	this.gvars_datum_init_order += "ai_list";
	return f.dot;
});

// mobs.dm:20
rt.def("/datum/controller/global_vars/proc/InitGlobalpai_list", function InitGlobalpai_list(f: Frame) {
	GLOB.pai_list = list();
	this.gvars_datum_init_order += "pai_list";
	return f.dot;
});

// mobs.dm:21
rt.def("/datum/controller/global_vars/proc/InitGlobalavailable_ai_shells", function InitGlobalavailable_ai_shells(f: Frame) {
	GLOB.available_ai_shells = list();
	this.gvars_datum_init_order += "available_ai_shells";
	return f.dot;
});

// mobs.dm:22
rt.def("/datum/controller/global_vars/proc/InitGlobalsimple_animals", function InitGlobalsimple_animals(f: Frame) {
	GLOB.simple_animals = list();
	this.gvars_datum_init_order += "simple_animals";
	return f.dot;
});

// mobs.dm:24
rt.def("/datum/controller/global_vars/proc/InitGloballanguage_datum_instances", function InitGloballanguage_datum_instances(f: Frame) {
	GLOB.language_datum_instances = list();
	this.gvars_datum_init_order += "language_datum_instances";
	return f.dot;
});

// mobs.dm:25
rt.def("/datum/controller/global_vars/proc/InitGlobalall_languages", function InitGlobalall_languages(f: Frame) {
	GLOB.all_languages = list();
	this.gvars_datum_init_order += "all_languages";
	return f.dot;
});
