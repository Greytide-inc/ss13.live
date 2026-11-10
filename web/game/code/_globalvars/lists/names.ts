// Based on /tg/station's code/_globalvars/lists/names.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// names.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalai_names", function InitGlobalai_names(f: Frame) {
	GLOB.ai_names = rt.world().file2list("strings/names/ai.txt");
	this.gvars_datum_init_order += "ai_names";
	return f.dot;
});

// names.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobalwizard_first", function InitGlobalwizard_first(f: Frame) {
	GLOB.wizard_first = rt.world().file2list("strings/names/wizardfirst.txt");
	this.gvars_datum_init_order += "wizard_first";
	return f.dot;
});

// names.dm:3
rt.def("/datum/controller/global_vars/proc/InitGlobalwizard_second", function InitGlobalwizard_second(f: Frame) {
	GLOB.wizard_second = rt.world().file2list("strings/names/wizardsecond.txt");
	this.gvars_datum_init_order += "wizard_second";
	return f.dot;
});

// names.dm:4
rt.def("/datum/controller/global_vars/proc/InitGlobalninja_titles", function InitGlobalninja_titles(f: Frame) {
	GLOB.ninja_titles = rt.world().file2list("strings/names/ninjatitle.txt");
	this.gvars_datum_init_order += "ninja_titles";
	return f.dot;
});

// names.dm:5
rt.def("/datum/controller/global_vars/proc/InitGlobalninja_names", function InitGlobalninja_names(f: Frame) {
	GLOB.ninja_names = rt.world().file2list("strings/names/ninjaname.txt");
	this.gvars_datum_init_order += "ninja_names";
	return f.dot;
});

// names.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobalcommando_names", function InitGlobalcommando_names(f: Frame) {
	GLOB.commando_names = rt.world().file2list("strings/names/death_commando.txt");
	this.gvars_datum_init_order += "commando_names";
	return f.dot;
});

// names.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalfirst_names_male", function InitGlobalfirst_names_male(f: Frame) {
	GLOB.first_names_male = rt.world().file2list("strings/names/first_male.txt");
	this.gvars_datum_init_order += "first_names_male";
	return f.dot;
});

// names.dm:8
rt.def("/datum/controller/global_vars/proc/InitGlobalfirst_names_female", function InitGlobalfirst_names_female(f: Frame) {
	GLOB.first_names_female = rt.world().file2list("strings/names/first_female.txt");
	this.gvars_datum_init_order += "first_names_female";
	return f.dot;
});

// names.dm:9
rt.def("/datum/controller/global_vars/proc/InitGloballast_names", function InitGloballast_names(f: Frame) {
	GLOB.last_names = rt.world().file2list("strings/names/last.txt");
	this.gvars_datum_init_order += "last_names";
	return f.dot;
});

// names.dm:10
rt.def("/datum/controller/global_vars/proc/InitGloballizard_names_male", function InitGloballizard_names_male(f: Frame) {
	GLOB.lizard_names_male = rt.world().file2list("strings/names/lizard_male.txt");
	this.gvars_datum_init_order += "lizard_names_male";
	return f.dot;
});

// names.dm:11
rt.def("/datum/controller/global_vars/proc/InitGloballizard_names_female", function InitGloballizard_names_female(f: Frame) {
	GLOB.lizard_names_female = rt.world().file2list("strings/names/lizard_female.txt");
	this.gvars_datum_init_order += "lizard_names_female";
	return f.dot;
});

// names.dm:12
rt.def("/datum/controller/global_vars/proc/InitGlobalclown_names", function InitGlobalclown_names(f: Frame) {
	GLOB.clown_names = rt.world().file2list("strings/names/clown.txt");
	this.gvars_datum_init_order += "clown_names";
	return f.dot;
});

// names.dm:13
rt.def("/datum/controller/global_vars/proc/InitGlobalmime_names", function InitGlobalmime_names(f: Frame) {
	GLOB.mime_names = rt.world().file2list("strings/names/mime.txt");
	this.gvars_datum_init_order += "mime_names";
	return f.dot;
});

// names.dm:14
rt.def("/datum/controller/global_vars/proc/InitGlobalcarp_names", function InitGlobalcarp_names(f: Frame) {
	GLOB.carp_names = rt.world().file2list("strings/names/carp.txt");
	this.gvars_datum_init_order += "carp_names";
	return f.dot;
});

// names.dm:15
rt.def("/datum/controller/global_vars/proc/InitGlobalgolem_names", function InitGlobalgolem_names(f: Frame) {
	GLOB.golem_names = rt.world().file2list("strings/names/golem.txt");
	this.gvars_datum_init_order += "golem_names";
	return f.dot;
});

// names.dm:16
rt.def("/datum/controller/global_vars/proc/InitGlobalplasmaman_names", function InitGlobalplasmaman_names(f: Frame) {
	GLOB.plasmaman_names = rt.world().file2list("strings/names/plasmaman.txt");
	this.gvars_datum_init_order += "plasmaman_names";
	return f.dot;
});

// names.dm:17
rt.def("/datum/controller/global_vars/proc/InitGlobalposibrain_names", function InitGlobalposibrain_names(f: Frame) {
	GLOB.posibrain_names = rt.world().file2list("strings/names/posibrain.txt");
	this.gvars_datum_init_order += "posibrain_names";
	return f.dot;
});

// names.dm:20
rt.def("/datum/controller/global_vars/proc/InitGlobalverbs", function InitGlobalverbs(f: Frame) {
	GLOB.verbs = rt.world().file2list("strings/names/verbs.txt");
	this.gvars_datum_init_order += "verbs";
	return f.dot;
});

// names.dm:21
rt.def("/datum/controller/global_vars/proc/InitGlobaladjectives", function InitGlobaladjectives(f: Frame) {
	GLOB.adjectives = rt.world().file2list("strings/names/adjectives.txt");
	this.gvars_datum_init_order += "adjectives";
	return f.dot;
});
