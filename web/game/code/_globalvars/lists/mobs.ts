// From code/_globalvars/lists/mobs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalclients  (code/_globalvars/lists/mobs.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalclients", function InitGlobalclients(f: Frame) {
	rt.setGl("clients", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "clients", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmins  (code/_globalvars/lists/mobs.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmins", function InitGlobaladmins(f: Frame) {
	rt.setGl("admins", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "admins", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmins  (code/_globalvars/lists/mobs.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmins", function InitGlobaladmins(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "admins", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaldeadmins  (code/_globalvars/lists/mobs.dm:4)
rt.def("/datum/controller/global_vars/proc/InitGlobaldeadmins", function InitGlobaldeadmins(f: Frame) {
	rt.setGl("deadmins", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "deadmins", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaldeadmins  (code/_globalvars/lists/mobs.dm:5)
rt.def("/datum/controller/global_vars/proc/InitGlobaldeadmins", function InitGlobaldeadmins(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "deadmins", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaldirectory  (code/_globalvars/lists/mobs.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobaldirectory", function InitGlobaldirectory(f: Frame) {
	rt.setGl("directory", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "directory", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalstealthminID  (code/_globalvars/lists/mobs.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalstealthminID", function InitGlobalstealthminID(f: Frame) {
	rt.setGl("stealthminID", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "stealthminID", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalplayer_list  (code/_globalvars/lists/mobs.dm:12)
rt.def("/datum/controller/global_vars/proc/InitGlobalplayer_list", function InitGlobalplayer_list(f: Frame) {
	rt.setGl("player_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "player_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalmob_list  (code/_globalvars/lists/mobs.dm:13)
rt.def("/datum/controller/global_vars/proc/InitGlobalmob_list", function InitGlobalmob_list(f: Frame) {
	rt.setGl("mob_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "mob_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalmob_directory  (code/_globalvars/lists/mobs.dm:14)
rt.def("/datum/controller/global_vars/proc/InitGlobalmob_directory", function InitGlobalmob_directory(f: Frame) {
	rt.setGl("mob_directory", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "mob_directory", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGloballiving_mob_list  (code/_globalvars/lists/mobs.dm:15)
rt.def("/datum/controller/global_vars/proc/InitGloballiving_mob_list", function InitGloballiving_mob_list(f: Frame) {
	rt.setGl("living_mob_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "living_mob_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaldead_mob_list  (code/_globalvars/lists/mobs.dm:16)
rt.def("/datum/controller/global_vars/proc/InitGlobaldead_mob_list", function InitGlobaldead_mob_list(f: Frame) {
	rt.setGl("dead_mob_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "dead_mob_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaljoined_player_list  (code/_globalvars/lists/mobs.dm:17)
rt.def("/datum/controller/global_vars/proc/InitGlobaljoined_player_list", function InitGlobaljoined_player_list(f: Frame) {
	rt.setGl("joined_player_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "joined_player_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsilicon_mobs  (code/_globalvars/lists/mobs.dm:18)
rt.def("/datum/controller/global_vars/proc/InitGlobalsilicon_mobs", function InitGlobalsilicon_mobs(f: Frame) {
	rt.setGl("silicon_mobs", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "silicon_mobs", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalai_list  (code/_globalvars/lists/mobs.dm:19)
rt.def("/datum/controller/global_vars/proc/InitGlobalai_list", function InitGlobalai_list(f: Frame) {
	rt.setGl("ai_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "ai_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalpai_list  (code/_globalvars/lists/mobs.dm:20)
rt.def("/datum/controller/global_vars/proc/InitGlobalpai_list", function InitGlobalpai_list(f: Frame) {
	rt.setGl("pai_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "pai_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalavailable_ai_shells  (code/_globalvars/lists/mobs.dm:21)
rt.def("/datum/controller/global_vars/proc/InitGlobalavailable_ai_shells", function InitGlobalavailable_ai_shells(f: Frame) {
	rt.setGl("available_ai_shells", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "available_ai_shells", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsimple_animals  (code/_globalvars/lists/mobs.dm:22)
rt.def("/datum/controller/global_vars/proc/InitGlobalsimple_animals", function InitGlobalsimple_animals(f: Frame) {
	rt.setGl("simple_animals", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "simple_animals", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGloballanguage_datum_instances  (code/_globalvars/lists/mobs.dm:24)
rt.def("/datum/controller/global_vars/proc/InitGloballanguage_datum_instances", function InitGloballanguage_datum_instances(f: Frame) {
	rt.setGl("language_datum_instances", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "language_datum_instances", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalall_languages  (code/_globalvars/lists/mobs.dm:25)
rt.def("/datum/controller/global_vars/proc/InitGlobalall_languages", function InitGlobalall_languages(f: Frame) {
	rt.setGl("all_languages", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "all_languages", add);
	return f.dot;
});
