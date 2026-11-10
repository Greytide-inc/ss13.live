// Based on /tg/station's code/game/gamemodes/miniantags/slaughter/slaughterevent.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(277, "/datum/round_event/ghost_role/slaughter", "/datum/round_event/ghost_role", {
	minimum_required: 1,
	role_name: "slaughter demon",
});

// slaughterevent.dm:16
rt.def("/datum/round_event/ghost_role/slaughter/proc/spawn_role", function* spawn_role(f: Frame) {
	let candidates: Value = null, player_mind: Value = null, L: Value = null, S: Value = null;
	let $e: any;
	if (!rt.len(f, (candidates = (yield* this.get_candidates("alien", null, "xenomorph"))))) {
		return NOT_ENOUGH_PLAYERS;
	}
	let selected: Value = pick_n_take(candidates);
	(player_mind = (yield* new_(T("/datum/mind"), selected.key))).active = 1;
	let spawn_locs: Value = list();
	for (L of each(GLOB.landmarks_list, T("/obj/effect/landmark"))) {
		if (isturf(L.loc)) {
			if (L.name === "carpspawn") {
				spawn_locs += L.loc;
			}
		}
	}
	if (!spawn_locs) {
		message_admins("No valid spawn locations found, aborting...");
		return MAP_ERROR;
	}
	let holder: Value = (yield* new_(T("/obj/effect/dummy/slaughter"), pick(spawn_locs)));
	(S = (yield* new_(T("/mob/living/simple_animal/slaughter"), holder))).holder = holder;
	yield* player_mind.transfer_to(S);
	player_mind.assigned_role = "Slaughter Demon";
	player_mind.special_role = "Slaughter Demon";
	(rt.modField(f, GLOB.SSticker.mode, "traitors", player_mind, rt.bitOr));
	to_chat(S, S.playstyle_string);
	to_chat(S, "<B>You are currently not currently in the same plane of existence as the station. Blood Crawl near a blood pool to manifest.</B>");
	rt.op(f, "Output", [], [S, rt.rsc("sound/magic/demon_dies.ogg")], false);
	message_admins(`${key_name_admin(S)} has been made into a slaughter demon by an event.`);
	log_game(`${key_name(S)} was spawned as a slaughter demon by an event.`);
	this.spawned_mobs += S;
	return SUCCESSFUL_SPAWN;
}, true);
