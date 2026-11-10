// Based on /tg/station's code/modules/events/blob.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1387, "/datum/round_event_control/blob", "/datum/round_event_control", {
	name: "Blob",
	typepath: rt.typePath("/datum/round_event/ghost_role/blob"),
	weight: 5,
	max_occurrences: 1,
	min_players: 20,
	earliest_start: 18000,
	gamemode_blacklist: null,
});

// blob.dm:10
rt.def("/datum/round_event_control/blob/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.gamemode_blacklist = list("blob");
	return f.dot;
});

rt.type(280, "/datum/round_event/ghost_role/blob", "/datum/round_event/ghost_role", {
	new_rate: 2,
	announceWhen: 12,
	role_name: "blob overmind",
});

// blob.dm:18
rt.def("/datum/round_event/ghost_role/blob/proc/New", function New(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	parent_proc();
	if (!f.args[1]) return f.dot;
	this.new_rate = f.args[1];
	return f.dot;
}, false, { args: ["my_processing", "set_point_rate"] });

// blob.dm:23
rt.def("/datum/round_event/ghost_role/blob/proc/announce", function* announce(f: Frame) {
	yield* priority_announce(`Confirmed outbreak of level 5 biohazard aboard ${station_name()}. All personnel must contain the outbreak.`, "Biohazard Alert", rt.rsc("sound/ai/outbreak5.ogg"));
	return f.dot;
}, true);

// blob.dm:27
rt.def("/datum/round_event/ghost_role/blob/proc/spawn_role", function* spawn_role(f: Frame) {
	let candidates: Value = null, BC: Value = null;
	if (!rt.len(f, GLOB.blobstart)) {
		return MAP_ERROR;
	}
	if (!rt.len(f, (candidates = (yield* this.get_candidates("blob", null, "blob"))))) {
		return NOT_ENOUGH_PLAYERS;
	}
	let new_blob: Value = pick(candidates);
	(BC = (yield* new_(T("/obj/structure/blob/core"), pick(GLOB.blobstart), new_blob.client, this.new_rate))).overmind.blob_points = min(20 + rt.len(f, GLOB.player_list), BC.overmind.max_blob_points);
	this.spawned_mobs += BC.overmind;
	message_admins(`${key_name_admin(BC.overmind)} has been made into a blob overmind by an event.`);
	log_game(`${key_name(BC.overmind)} was spawned as a blob overmind by an event.`);
	return SUCCESSFUL_SPAWN;
}, true);
