// From code/modules/events/blob.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1387, "/datum/round_event_control/blob", "/datum/round_event_control", {
	name: "Blob",
	typepath: rt.typePath("/datum/round_event/ghost_role/blob"),
	weight: 5,
	max_occurrences: 1,
	min_players: 20,
	earliest_start: 18000,
	gamemode_blacklist: null,
});

// /datum/round_event_control/blob/proc/<init>  (code/modules/events/blob.dm:10)
rt.def("/datum/round_event_control/blob/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "gamemode_blacklist", rt.list("blob"));
	return f.dot;
});

rt.type(280, "/datum/round_event/ghost_role/blob", "/datum/round_event/ghost_role", {
	new_rate: 2,
	announceWhen: 12,
	role_name: "blob overmind",
});

// /datum/round_event/ghost_role/blob/proc/New  (code/modules/events/blob.dm:18)
rt.def("/datum/round_event/ghost_role/blob/proc/New", function New(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[1]))) return f.dot;
	rt.setSv(f, "new_rate", live(f.args[1]));
	return f.dot;
}, false, { args: ["my_processing", "set_point_rate"] });

// /datum/round_event/ghost_role/blob/proc/announce  (code/modules/events/blob.dm:23)  may sleep
rt.def("/datum/round_event/ghost_role/blob/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Confirmed outbreak of level 5 biohazard aboard ＀. All personnel must contain the outbreak.", [(yield* g.call(f, P("/proc/station_name"), null, []))]), "Biohazard Alert", rt.rsc("sound/ai/outbreak5.ogg")]);
	return f.dot;
}, true);

// /datum/round_event/ghost_role/blob/proc/spawn_role  (code/modules/events/blob.dm:27)  may sleep
rt.def("/datum/round_event/ghost_role/blob/proc/spawn_role", function* spawn_role(f: Frame) {
	let candidates: Value = null, new_blob: Value = null, BC: Value = null;
	f.vars = () => [candidates, new_blob, BC];
	if (!truthy(rt.len(f, rt.gl("blobstart")))) {
		return 4;
	}
	if (!truthy(rt.getLen(f, (candidates = (yield* g.srcCall(f, "get_candidates", "blob", null, "blob")))))) {
		return 3;
	}
	new_blob = rt.op(f, "PickUnweighted", [1], [live(candidates)]);
	rt.setFv(f, "blob_points", rt.gv(f, "overmind", (BC = (yield* g.new_(f, T("/obj/structure/blob/core"), [rt.op(f, "PickUnweighted", [1], [rt.gl("blobstart")]), rt.fv(f, "client", live(new_blob)), rt.sv(f, "new_rate")])))), (yield* g.call(f, P("/proc/min"), null, [add(20, rt.len(f, rt.gl("player_list"))), rt.gv(f, "max_blob_points", rt.fv(f, "overmind", live(BC)))])));
	rt.modSrcVar(f, "spawned_mobs", rt.fv(f, "overmind", live(BC)), add);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has been made into a blob overmind by an event.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [rt.fv(f, "overmind", live(BC))]))])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ was spawned as a blob overmind by an event.", [(yield* g.call(f, P("/proc/key_name"), null, [rt.fv(f, "overmind", live(BC))]))])]);
	return 2;
}, true);
