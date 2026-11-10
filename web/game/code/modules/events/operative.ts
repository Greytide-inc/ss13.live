// Based on /tg/station's code/modules/events/operative.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(282, "/datum/round_event/ghost_role/operative", "/datum/round_event/ghost_role", {
	minimum_required: 1,
	role_name: "lone operative",
});

// operative.dm:12
rt.def("/datum/round_event/ghost_role/operative/proc/spawn_role", function* spawn_role(f: Frame) {
	let candidates: Value = null, L: Value = null, A: Value = null, Mind: Value = null, nuke: Value = null, nuke_code: Value = null, O: Value = null;
	if (!rt.len(f, (candidates = (yield* this.get_candidates("operative", null, "operative"))))) {
		return NOT_ENOUGH_PLAYERS;
	}
	let selected: Value = pick_n_take(candidates);
	let spawn_locs: Value = list();
	for (L of each(GLOB.landmarks_list, T("/obj/effect/landmark"))) {
		if (rt.isIn(f, L.name, list("ninjaspawn", "carpspawn"))) {
			spawn_locs += L.loc;
		}
	}
	if (!rt.len(f, spawn_locs)) {
		return MAP_ERROR;
	}
	let operative: Value = (yield* new_(T("/mob/living/carbon/human"), pick(spawn_locs)));
	yield* (A = (yield* new_(T("/datum/preferences")))).copy_to(operative);
	yield* operative.dna.update_dna_identity();
	yield* operative.equipOutfit(T("/datum/outfit/syndicate/full"));
	(Mind = (yield* new_(T("/datum/mind"), selected.key))).assigned_role = "Lone Operative";
	Mind.special_role = "Lone Operative";
	(rt.modField(f, GLOB.SSticker.mode, "traitors", Mind, rt.bitOr));
	Mind.active = 1;
	if (nuke = rt.locateIn(f, T("/obj/machinery/nuclearbomb/selfdestruct"), GLOB.machines)) {
		if (!nuke.r_code || nuke.r_code == "ADMIN") {
			nuke_code = random_nukecode();
			nuke.r_code = nuke_code;
		} else {
			nuke_code = nuke.r_code;
		}
		Mind.store_memory(`<B>Station Self-Destruct Device Code</B>: ${nuke_code}`, 0, 0);
		to_chat(Mind.current, `The nuclear authorization code is: <B>${nuke_code}</B>`);
		(O = (yield* new_(T("/datum/objective/nuclear")))).owner = Mind;
		Mind.objectives += O;
	}
	yield* Mind.transfer_to(operative);
	message_admins(`${key_name_admin(operative)} has been made into lone operative by an event.`);
	log_game(`${key_name(operative)} was spawned as a lone operative by an event.`);
	this.spawned_mobs += operative;
	return SUCCESSFUL_SPAWN;
}, true);
