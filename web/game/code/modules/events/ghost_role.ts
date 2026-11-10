// Based on /tg/station's code/modules/events/ghost_role.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(274, "/datum/round_event/ghost_role", "/datum/round_event", {
	priority_candidates: null,
	minimum_required: 1,
	role_name: "debug rat with cancer",
	spawned_mobs: null,
});

// ghost_role.dm:6
rt.def("/datum/round_event/ghost_role/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.priority_candidates = list();

	this.spawned_mobs = list();
	return f.dot;
});

// ghost_role.dm:12
rt.def("/datum/round_event/ghost_role/proc/start", function* start(f: Frame) {
	yield* this.try_spawning();
	return f.dot;
}, true);

// ghost_role.dm:19
rt.def("/datum/round_event/ghost_role/proc/try_spawning", function* try_spawning(f: Frame, sanity: Value, retry: Value) {
	let status: Value = null, waittime: Value = null;
	sanity ??= 0;
	retry ??= 0;
	this.processing = 0;
	if ((status = (yield* this.spawn_role())) == WAITING_FOR_SOMETHING) {
		if (retry >= MAX_SPAWN_ATTEMPT) {
			message_admins(`${this.role_name} event has exceeded maximum spawn attempts. Aborting and refunding.`);
			if (this.control && this.control.occurrences > 0) {
				this.control.occurrences--;
			}
			return f.dot;
		}
		waittime = 300 * rt.bitXor(2, retry);
		message_admins(`The event will not spawn a ${this.role_name} until certain conditions are met. Waiting ${waittime / 10}s and then retrying.`);
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/round_event/ghost_role/proc/try_spawning"), 0, ++retry)), waittime);
		return f.dot;
	}
	if (status == MAP_ERROR) {
		message_admins(`${this.role_name} cannot be spawned due to a map error.`);
	} else if (status == NOT_ENOUGH_PLAYERS) {
		message_admins(`${this.role_name} cannot be spawned due to lack of players signing up.`);
	} else if (status == SUCCESSFUL_SPAWN) {
		message_admins(`${this.role_name} spawned successfully.`);
		if (!rt.len(f, this.spawned_mobs)) {
			message_admins("No mobs found in the `spawned_mobs` list, this is a bug.");
		}
	} else {
		message_admins(`An attempt to spawn ${this.role_name} returned ${status}, this is a bug.`);
	}
	this.processing = 1;
	return f.dot;
}, true);

// ghost_role.dm:59
rt.def("/datum/round_event/ghost_role/proc/get_candidates", function* get_candidates(f: Frame, jobban: Value, gametypecheck: Value, be_special: Value) {
	let regular_candidates: Value = null, candidates: Value = null;
	if (rt.len(f, this.priority_candidates) < this.minimum_required) {
		regular_candidates = (yield* pollGhostCandidates(`Do you wish to be considered for the special role of '${this.role_name}'?`, jobban, gametypecheck, be_special));
	} else {
		regular_candidates = list();
	}
	shuffle_inplace(regular_candidates);
	return (candidates = this.priority_candidates + regular_candidates);
}, true);
