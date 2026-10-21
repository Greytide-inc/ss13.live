// From code/_globalvars/lists/names.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalai_names  (code/_globalvars/lists/names.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalai_names", function InitGlobalai_names(f: Frame) {
	rt.setGl("ai_names", rt.callName(f, rt.world(), "file2list", ["strings/names/ai.txt"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "ai_names", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalwizard_first  (code/_globalvars/lists/names.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobalwizard_first", function InitGlobalwizard_first(f: Frame) {
	rt.setGl("wizard_first", rt.callName(f, rt.world(), "file2list", ["strings/names/wizardfirst.txt"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "wizard_first", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalwizard_second  (code/_globalvars/lists/names.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGlobalwizard_second", function InitGlobalwizard_second(f: Frame) {
	rt.setGl("wizard_second", rt.callName(f, rt.world(), "file2list", ["strings/names/wizardsecond.txt"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "wizard_second", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalninja_titles  (code/_globalvars/lists/names.dm:4)
rt.def("/datum/controller/global_vars/proc/InitGlobalninja_titles", function InitGlobalninja_titles(f: Frame) {
	rt.setGl("ninja_titles", rt.callName(f, rt.world(), "file2list", ["strings/names/ninjatitle.txt"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "ninja_titles", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalninja_names  (code/_globalvars/lists/names.dm:5)
rt.def("/datum/controller/global_vars/proc/InitGlobalninja_names", function InitGlobalninja_names(f: Frame) {
	rt.setGl("ninja_names", rt.callName(f, rt.world(), "file2list", ["strings/names/ninjaname.txt"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "ninja_names", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalcommando_names  (code/_globalvars/lists/names.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobalcommando_names", function InitGlobalcommando_names(f: Frame) {
	rt.setGl("commando_names", rt.callName(f, rt.world(), "file2list", ["strings/names/death_commando.txt"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "commando_names", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalfirst_names_male  (code/_globalvars/lists/names.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalfirst_names_male", function InitGlobalfirst_names_male(f: Frame) {
	rt.setGl("first_names_male", rt.callName(f, rt.world(), "file2list", ["strings/names/first_male.txt"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "first_names_male", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalfirst_names_female  (code/_globalvars/lists/names.dm:8)
rt.def("/datum/controller/global_vars/proc/InitGlobalfirst_names_female", function InitGlobalfirst_names_female(f: Frame) {
	rt.setGl("first_names_female", rt.callName(f, rt.world(), "file2list", ["strings/names/first_female.txt"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "first_names_female", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGloballast_names  (code/_globalvars/lists/names.dm:9)
rt.def("/datum/controller/global_vars/proc/InitGloballast_names", function InitGloballast_names(f: Frame) {
	rt.setGl("last_names", rt.callName(f, rt.world(), "file2list", ["strings/names/last.txt"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "last_names", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGloballizard_names_male  (code/_globalvars/lists/names.dm:10)
rt.def("/datum/controller/global_vars/proc/InitGloballizard_names_male", function InitGloballizard_names_male(f: Frame) {
	rt.setGl("lizard_names_male", rt.callName(f, rt.world(), "file2list", ["strings/names/lizard_male.txt"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "lizard_names_male", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGloballizard_names_female  (code/_globalvars/lists/names.dm:11)
rt.def("/datum/controller/global_vars/proc/InitGloballizard_names_female", function InitGloballizard_names_female(f: Frame) {
	rt.setGl("lizard_names_female", rt.callName(f, rt.world(), "file2list", ["strings/names/lizard_female.txt"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "lizard_names_female", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalclown_names  (code/_globalvars/lists/names.dm:12)
rt.def("/datum/controller/global_vars/proc/InitGlobalclown_names", function InitGlobalclown_names(f: Frame) {
	rt.setGl("clown_names", rt.callName(f, rt.world(), "file2list", ["strings/names/clown.txt"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "clown_names", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalmime_names  (code/_globalvars/lists/names.dm:13)
rt.def("/datum/controller/global_vars/proc/InitGlobalmime_names", function InitGlobalmime_names(f: Frame) {
	rt.setGl("mime_names", rt.callName(f, rt.world(), "file2list", ["strings/names/mime.txt"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "mime_names", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalcarp_names  (code/_globalvars/lists/names.dm:14)
rt.def("/datum/controller/global_vars/proc/InitGlobalcarp_names", function InitGlobalcarp_names(f: Frame) {
	rt.setGl("carp_names", rt.callName(f, rt.world(), "file2list", ["strings/names/carp.txt"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "carp_names", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalgolem_names  (code/_globalvars/lists/names.dm:15)
rt.def("/datum/controller/global_vars/proc/InitGlobalgolem_names", function InitGlobalgolem_names(f: Frame) {
	rt.setGl("golem_names", rt.callName(f, rt.world(), "file2list", ["strings/names/golem.txt"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "golem_names", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalplasmaman_names  (code/_globalvars/lists/names.dm:16)
rt.def("/datum/controller/global_vars/proc/InitGlobalplasmaman_names", function InitGlobalplasmaman_names(f: Frame) {
	rt.setGl("plasmaman_names", rt.callName(f, rt.world(), "file2list", ["strings/names/plasmaman.txt"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "plasmaman_names", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalposibrain_names  (code/_globalvars/lists/names.dm:17)
rt.def("/datum/controller/global_vars/proc/InitGlobalposibrain_names", function InitGlobalposibrain_names(f: Frame) {
	rt.setGl("posibrain_names", rt.callName(f, rt.world(), "file2list", ["strings/names/posibrain.txt"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "posibrain_names", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalverbs  (code/_globalvars/lists/names.dm:20)
rt.def("/datum/controller/global_vars/proc/InitGlobalverbs", function InitGlobalverbs(f: Frame) {
	rt.setGl("verbs", rt.callName(f, rt.world(), "file2list", ["strings/names/verbs.txt"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "verbs", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladjectives  (code/_globalvars/lists/names.dm:21)
rt.def("/datum/controller/global_vars/proc/InitGlobaladjectives", function InitGlobaladjectives(f: Frame) {
	rt.setGl("adjectives", rt.callName(f, rt.world(), "file2list", ["strings/names/adjectives.txt"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "adjectives", add);
	return f.dot;
});
