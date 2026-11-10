// Based on /tg/station's code/modules/events/devil.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(281, "/datum/round_event/ghost_role/devil", "/datum/round_event/ghost_role", {
	success_spawn: 0,
	role_name: "devil",
});

// devil.dm:11
rt.def("/datum/round_event/ghost_role/devil/proc/kill", function kill(f: Frame) {
	if (!this.success_spawn && this.control) {
		this.control.occurrences--;
	}
	return parent_proc();
});

// devil.dm:17
rt.def("/datum/round_event/ghost_role/devil/proc/spawn_role", function* spawn_role(f: Frame) {
	let candidates: Value = null, Mind: Value = null;
	if (!rt.len(f, GLOB.SSjob.latejoin_trackers)) {
		return MAP_ERROR;
	}
	if (!rt.len(f, (candidates = (yield* this.get_candidates("devil", null, "devil"))))) {
		return NOT_ENOUGH_PLAYERS;
	}
	let selected_candidate: Value = pick_n_take(candidates);
	let key: Value = selected_candidate.key;
	(Mind = create_devil_mind(key)).active = 1;
	let devil: Value = (yield* create_event_devil());
	yield* Mind.transfer_to(devil);
	yield* add_devil(devil, { ascendable: 0 });
	this.spawned_mobs += devil;
	message_admins(`${key_name_admin(devil)} has been made into a devil by an event.`);
	log_game(`${key_name(devil)} was spawned as a devil by an event.`);
	let jobdatum: Value = (yield* GLOB.SSjob.GetJob("Assistant"));
	devil.job = jobdatum.title;
	yield* jobdatum.equip(devil);
	return SUCCESSFUL_SPAWN;
}, true);

// devil.dm:45
rt.def("/proc/create_event_devil", function* create_event_devil(f: Frame, spawn_loc: Value) {
	let A: Value = null;
	let new_devil: Value = (yield* new_(T("/mob/living/carbon/human"), spawn_loc));
	if (!spawn_loc) {
		yield* GLOB.SSjob.SendToLateJoin(new_devil);
	}
	yield* (A = (yield* new_(T("/datum/preferences")))).copy_to(new_devil);
	yield* new_devil.dna.update_dna_identity();
	return new_devil;
}, true);

// devil.dm:54
rt.def("/proc/create_devil_mind", function create_devil_mind(f: Frame, key: Value) {
	let Mind: Value = null;
	(Mind = new_(T("/datum/mind"), key)).assigned_role = "devil";
	Mind.special_role = "devil";
	(rt.modField(f, GLOB.SSticker.mode, "devils", Mind, rt.bitOr));
	return Mind;
});
