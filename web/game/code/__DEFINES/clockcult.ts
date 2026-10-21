// From code/__DEFINES/clockcult.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalSYND_FREQ  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalSYND_FREQ");

// /datum/controller/global_vars/proc/InitGlobalSUPP_FREQ  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalSUPP_FREQ");

// /datum/controller/global_vars/proc/InitGlobalSERV_FREQ  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalSERV_FREQ");

// /datum/controller/global_vars/proc/InitGlobalSCI_FREQ  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalSCI_FREQ");

// /datum/controller/global_vars/proc/InitGlobalCOMM_FREQ  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalCOMM_FREQ");

// /datum/controller/global_vars/proc/InitGlobalMED_FREQ  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalMED_FREQ");

// /datum/controller/global_vars/proc/InitGlobalENG_FREQ  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalENG_FREQ");

// /datum/controller/global_vars/proc/InitGlobalSEC_FREQ  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalSEC_FREQ");

// /datum/controller/global_vars/proc/InitGlobalCENTCOM_FREQ  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalCENTCOM_FREQ");

// /datum/controller/global_vars/proc/InitGlobalAIPRIV_FREQ  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalAIPRIV_FREQ");

// /datum/controller/global_vars/proc/InitGlobalREDTEAM_FREQ  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalREDTEAM_FREQ");

// /datum/controller/global_vars/proc/InitGlobalBLUETEAM_FREQ  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalBLUETEAM_FREQ");

// /datum/controller/global_vars/proc/InitGlobalaccess_security  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_security");

// /datum/controller/global_vars/proc/InitGlobalaccess_brig  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_brig");

// /datum/controller/global_vars/proc/InitGlobalaccess_armory  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_armory");

// /datum/controller/global_vars/proc/InitGlobalaccess_forensics_lockers  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_forensics_lockers");

// /datum/controller/global_vars/proc/InitGlobalaccess_medical  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_medical");

// /datum/controller/global_vars/proc/InitGlobalaccess_morgue  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_morgue");

// /datum/controller/global_vars/proc/InitGlobalaccess_tox  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_tox");

// /datum/controller/global_vars/proc/InitGlobalaccess_tox_storage  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_tox_storage");

// /datum/controller/global_vars/proc/InitGlobalaccess_genetics  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_genetics");

// /datum/controller/global_vars/proc/InitGlobalaccess_engine  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_engine");

// /datum/controller/global_vars/proc/InitGlobalaccess_engine_equip  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_engine_equip");

// /datum/controller/global_vars/proc/InitGlobalaccess_maint_tunnels  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_maint_tunnels");

// /datum/controller/global_vars/proc/InitGlobalaccess_external_airlocks  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_external_airlocks");

// /datum/controller/global_vars/proc/InitGlobalaccess_emergency_storage  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_emergency_storage");

// /datum/controller/global_vars/proc/InitGlobalaccess_change_ids  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_change_ids");

// /datum/controller/global_vars/proc/InitGlobalaccess_ai_upload  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_ai_upload");

// /datum/controller/global_vars/proc/InitGlobalaccess_teleporter  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_teleporter");

// /datum/controller/global_vars/proc/InitGlobalaccess_eva  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_eva");

// /datum/controller/global_vars/proc/InitGlobalaccess_heads  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_heads");

// /datum/controller/global_vars/proc/InitGlobalaccess_captain  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_captain");

// /datum/controller/global_vars/proc/InitGlobalaccess_all_personal_lockers  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_all_personal_lockers");

// /datum/controller/global_vars/proc/InitGlobalaccess_chapel_office  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_chapel_office");

// /datum/controller/global_vars/proc/InitGlobalaccess_tech_storage  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_tech_storage");

// /datum/controller/global_vars/proc/InitGlobalaccess_atmospherics  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_atmospherics");

// /datum/controller/global_vars/proc/InitGlobalaccess_bar  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_bar");

// /datum/controller/global_vars/proc/InitGlobalaccess_janitor  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_janitor");

// /datum/controller/global_vars/proc/InitGlobalaccess_crematorium  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_crematorium");

// /datum/controller/global_vars/proc/InitGlobalaccess_kitchen  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_kitchen");

// /datum/controller/global_vars/proc/InitGlobalaccess_robotics  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_robotics");

// /datum/controller/global_vars/proc/InitGlobalaccess_rd  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_rd");

// /datum/controller/global_vars/proc/InitGlobalaccess_cargo  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_cargo");

// /datum/controller/global_vars/proc/InitGlobalaccess_construction  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_construction");

// /datum/controller/global_vars/proc/InitGlobalaccess_chemistry  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_chemistry");

// /datum/controller/global_vars/proc/InitGlobalaccess_cargo_bot  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_cargo_bot");

// /datum/controller/global_vars/proc/InitGlobalaccess_hydroponics  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_hydroponics");

// /datum/controller/global_vars/proc/InitGlobalaccess_manufacturing  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_manufacturing");

// /datum/controller/global_vars/proc/InitGlobalaccess_library  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_library");

// /datum/controller/global_vars/proc/InitGlobalaccess_lawyer  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_lawyer");

// /datum/controller/global_vars/proc/InitGlobalaccess_virology  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_virology");

// /datum/controller/global_vars/proc/InitGlobalaccess_cmo  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_cmo");

// /datum/controller/global_vars/proc/InitGlobalaccess_qm  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_qm");

// /datum/controller/global_vars/proc/InitGlobalaccess_court  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_court");

// /datum/controller/global_vars/proc/InitGlobalaccess_surgery  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_surgery");

// /datum/controller/global_vars/proc/InitGlobalaccess_theatre  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_theatre");

// /datum/controller/global_vars/proc/InitGlobalaccess_research  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_research");

// /datum/controller/global_vars/proc/InitGlobalaccess_mining  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_mining");

// /datum/controller/global_vars/proc/InitGlobalaccess_mining_office  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_mining_office");

// /datum/controller/global_vars/proc/InitGlobalaccess_mailsorting  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_mailsorting");

// /datum/controller/global_vars/proc/InitGlobalaccess_mint  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_mint");

// /datum/controller/global_vars/proc/InitGlobalaccess_mint_vault  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_mint_vault");

// /datum/controller/global_vars/proc/InitGlobalaccess_heads_vault  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_heads_vault");

// /datum/controller/global_vars/proc/InitGlobalaccess_mining_station  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_mining_station");

// /datum/controller/global_vars/proc/InitGlobalaccess_xenobiology  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_xenobiology");

// /datum/controller/global_vars/proc/InitGlobalaccess_ce  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_ce");

// /datum/controller/global_vars/proc/InitGlobalaccess_hop  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_hop");

// /datum/controller/global_vars/proc/InitGlobalaccess_hos  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_hos");

// /datum/controller/global_vars/proc/InitGlobalaccess_RC_announce  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_RC_announce");

// /datum/controller/global_vars/proc/InitGlobalaccess_keycard_auth  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_keycard_auth");

// /datum/controller/global_vars/proc/InitGlobalaccess_tcomsat  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_tcomsat");

// /datum/controller/global_vars/proc/InitGlobalaccess_gateway  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_gateway");

// /datum/controller/global_vars/proc/InitGlobalaccess_sec_doors  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_sec_doors");

// /datum/controller/global_vars/proc/InitGlobalaccess_mineral_storeroom  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_mineral_storeroom");

// /datum/controller/global_vars/proc/InitGlobalaccess_minisat  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_minisat");

// /datum/controller/global_vars/proc/InitGlobalaccess_weapons  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_weapons");

// /datum/controller/global_vars/proc/InitGlobalaccess_network  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_network");

// /datum/controller/global_vars/proc/InitGlobalaccess_cloning  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_cloning");

// /datum/controller/global_vars/proc/InitGlobalaccess_cent_general  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_cent_general");

// /datum/controller/global_vars/proc/InitGlobalaccess_cent_thunder  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_cent_thunder");

// /datum/controller/global_vars/proc/InitGlobalaccess_cent_specops  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_cent_specops");

// /datum/controller/global_vars/proc/InitGlobalaccess_cent_medical  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_cent_medical");

// /datum/controller/global_vars/proc/InitGlobalaccess_cent_living  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_cent_living");

// /datum/controller/global_vars/proc/InitGlobalaccess_cent_storage  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_cent_storage");

// /datum/controller/global_vars/proc/InitGlobalaccess_cent_teleporter  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_cent_teleporter");

// /datum/controller/global_vars/proc/InitGlobalaccess_cent_captain  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_cent_captain");

// /datum/controller/global_vars/proc/InitGlobalaccess_cent_bar  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_cent_bar");

// /datum/controller/global_vars/proc/InitGlobalaccess_syndicate  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_syndicate");

// /datum/controller/global_vars/proc/InitGlobalaccess_syndicate_leader  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_syndicate_leader");

// /datum/controller/global_vars/proc/InitGlobalaccess_away_general  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_away_general");

// /datum/controller/global_vars/proc/InitGlobalaccess_away_maint  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_away_maint");

// /datum/controller/global_vars/proc/InitGlobalaccess_away_med  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_away_med");

// /datum/controller/global_vars/proc/InitGlobalaccess_away_sec  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_away_sec");

// /datum/controller/global_vars/proc/InitGlobalaccess_away_engine  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_away_engine");

// /datum/controller/global_vars/proc/InitGlobalaccess_away_generic1  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_away_generic1");

// /datum/controller/global_vars/proc/InitGlobalaccess_away_generic2  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_away_generic2");

// /datum/controller/global_vars/proc/InitGlobalaccess_away_generic3  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_away_generic3");

// /datum/controller/global_vars/proc/InitGlobalaccess_away_generic4  empty
rt.def("/datum/controller/global_vars/proc/InitGlobalaccess_away_generic4");

// /datum/controller/global_vars/proc/InitGlobalclockwork_construction_value  (code/__DEFINES/clockcult.dm:8)
rt.def("/datum/controller/global_vars/proc/InitGlobalclockwork_construction_value", function InitGlobalclockwork_construction_value(f: Frame) {
	rt.setGl("clockwork_construction_value", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "clockwork_construction_value", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalclockwork_caches  (code/__DEFINES/clockcult.dm:9)
rt.def("/datum/controller/global_vars/proc/InitGlobalclockwork_caches", function InitGlobalclockwork_caches(f: Frame) {
	rt.setGl("clockwork_caches", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "clockwork_caches", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalactive_daemons  (code/__DEFINES/clockcult.dm:10)
rt.def("/datum/controller/global_vars/proc/InitGlobalactive_daemons", function InitGlobalactive_daemons(f: Frame) {
	rt.setGl("active_daemons", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "active_daemons", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalall_clockwork_objects  (code/__DEFINES/clockcult.dm:11)
rt.def("/datum/controller/global_vars/proc/InitGlobalall_clockwork_objects", function InitGlobalall_clockwork_objects(f: Frame) {
	rt.setGl("all_clockwork_objects", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "all_clockwork_objects", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalall_clockwork_mobs  (code/__DEFINES/clockcult.dm:12)
rt.def("/datum/controller/global_vars/proc/InitGlobalall_clockwork_mobs", function InitGlobalall_clockwork_mobs(f: Frame) {
	rt.setGl("all_clockwork_mobs", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "all_clockwork_mobs", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalclockwork_component_cache  (code/__DEFINES/clockcult.dm:13)
rt.def("/datum/controller/global_vars/proc/InitGlobalclockwork_component_cache", function InitGlobalclockwork_component_cache(f: Frame) {
	rt.setGl("clockwork_component_cache", rt.alist(f, ["belligerent_eye", 0, "vanguard_cogwheel", 0, "geis_capacitor", 0, "replicant_alloy", 0, "hierophant_ansible", 0]));
	rt.modSrcVar(f, "gvars_datum_init_order", "clockwork_component_cache", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalratvar_awakens  (code/__DEFINES/clockcult.dm:14)
rt.def("/datum/controller/global_vars/proc/InitGlobalratvar_awakens", function InitGlobalratvar_awakens(f: Frame) {
	rt.setGl("ratvar_awakens", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "ratvar_awakens", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalclockwork_gateway_activated  (code/__DEFINES/clockcult.dm:15)
rt.def("/datum/controller/global_vars/proc/InitGlobalclockwork_gateway_activated", function InitGlobalclockwork_gateway_activated(f: Frame) {
	rt.setGl("clockwork_gateway_activated", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "clockwork_gateway_activated", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalall_scripture  (code/__DEFINES/clockcult.dm:16)
rt.def("/datum/controller/global_vars/proc/InitGlobalall_scripture", function InitGlobalall_scripture(f: Frame) {
	rt.setGl("all_scripture", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "all_scripture", add);
	return f.dot;
});
