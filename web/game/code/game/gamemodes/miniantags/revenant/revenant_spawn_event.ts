// Based on /tg/station's code/game/gamemodes/miniantags/revenant/revenant_spawn_event.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(276, "/datum/round_event/ghost_role/revenant", "/datum/round_event/ghost_role", {
	ignore_mobcheck: 0,
	role_name: "revenant",
});

// revenant_spawn_event.dm:17
rt.def("/datum/round_event/ghost_role/revenant/proc/New", function New(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	parent_proc();
	this.ignore_mobcheck = f.args[1];
	return f.dot;
}, false, { args: ["my_processing", "new_ignore_mobcheck"] });

// revenant_spawn_event.dm:21
rt.def("/datum/round_event/ghost_role/revenant/proc/spawn_role", function* spawn_role(f: Frame) {
	let deadMobs: Value = null, M: Value = null, candidates: Value = null, L: Value = null, revvie: Value = null;
	let $e: any;
	if (!this.ignore_mobcheck) {
		deadMobs = 0;
		for (M of each(GLOB.dead_mob_list, T("/mob"))) {
			deadMobs++;
		}
		if (deadMobs < REVENANT_SPAWN_THRESHOLD) {
			message_admins(`Event attempted to spawn a revenant, but there were only ${deadMobs}/${REVENANT_SPAWN_THRESHOLD} dead mobs.`);
			return WAITING_FOR_SOMETHING;
		}
	}
	if (!rt.len(f, (candidates = (yield* this.get_candidates("revenant", null, "revenant"))))) {
		return NOT_ENOUGH_PLAYERS;
	}
	let selected: Value = pick_n_take(candidates);
	let spawn_locs: Value = list();
	for (L of each(GLOB.landmarks_list, T("/obj/effect/landmark"))) {
		if (isturf(L.loc)) {
			if (L.name === "revenantspawn") {
				spawn_locs += L.loc;
			}
		}
	}
	if (!rt.len(f, spawn_locs)) {
		L = null;
		for (L of each(GLOB.landmarks_list, T("/obj/effect/landmark"))) {
			if (isturf(L.loc)) {
				if (L.name === "carpspawn") {
					spawn_locs += L.loc;
				}
			}
		}
	}
	if (!rt.len(f, spawn_locs)) {
		spawn_locs += rt.getStep(f, selected, 0);
	}
	if (!rt.len(f, spawn_locs)) {
		return MAP_ERROR;
	}
	(revvie = (yield* new_(T("/mob/living/simple_animal/revenant"), pick(spawn_locs)))).key = selected.key;
	message_admins(`${key_name_admin(revvie)} has been made into a revenant by an event.`);
	log_game(`${key_name(revvie)} was spawned as a revenant by an event.`);
	this.spawned_mobs += revvie;
	return SUCCESSFUL_SPAWN;
}, true);
