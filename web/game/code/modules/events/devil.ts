// From code/modules/events/devil.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(281, "/datum/round_event/ghost_role/devil", "/datum/round_event/ghost_role", {
	success_spawn: 0,
	role_name: "devil",
});

// /datum/round_event/ghost_role/devil/proc/kill  (code/modules/events/devil.dm:11)
rt.def("/datum/round_event/ghost_role/devil/proc/kill", function kill(f: Frame) {
	if ((!truthy(rt.sv(f, "success_spawn")) && truthy(rt.sv(f, "control")))) {
		rt.incField(f, rt.sv(f, "control"), "occurrences", -1, true);
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /datum/round_event/ghost_role/devil/proc/spawn_role  (code/modules/events/devil.dm:17)  may sleep
rt.def("/datum/round_event/ghost_role/devil/proc/spawn_role", function* spawn_role(f: Frame) {
	let candidates: Value = null, selected_candidate: Value = null, key: Value = null, Mind: Value = null, devil: Value = null, jobdatum: Value = null;
	f.vars = () => [candidates, selected_candidate, key, Mind, devil, jobdatum];
	if (!truthy(rt.getLen(f, rt.fv(f, "latejoin_trackers", rt.gl("SSjob"))))) {
		return 4;
	}
	if (!truthy(rt.getLen(f, (candidates = (yield* g.srcCall(f, "get_candidates", "devil", null, "devil")))))) {
		return 3;
	}
	selected_candidate = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(candidates)]));
	key = rt.fv(f, "key", live(selected_candidate));
	rt.setFv(f, "active", (Mind = (yield* g.call(f, P("/proc/create_devil_mind"), null, [live(key)]))), 1);
	devil = (yield* g.call(f, P("/proc/create_event_devil"), null, []));
	yield* g.callName(f, live(Mind), "transfer_to", [live(devil)]);
	yield* g.call(f, P("/proc/add_devil"), null, [null, live(devil), "ascendable", 0], rt.Args.Named);
	rt.modSrcVar(f, "spawned_mobs", live(devil), add);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has been made into a devil by an event.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(devil)]))])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ was spawned as a devil by an event.", [(yield* g.call(f, P("/proc/key_name"), null, [live(devil)]))])]);
	jobdatum = (yield* g.callName(f, rt.gl("SSjob"), "GetJob", ["Assistant"]));
	rt.setFv(f, "job", live(devil), rt.fv(f, "title", live(jobdatum)));
	yield* g.callName(f, live(jobdatum), "equip", [live(devil)]);
	return 2;
}, true);

// /proc/create_event_devil  (code/modules/events/devil.dm:45)  may sleep
rt.def("/proc/create_event_devil", function* create_event_devil(f: Frame, spawn_loc: Value) {
	let new_devil: Value = null, A: Value = null;
	f.vars = () => [spawn_loc, new_devil, A];
	new_devil = (yield* g.new_(f, T("/mob/living/carbon/human"), [live(spawn_loc)]));
	if (!truthy(live(spawn_loc))) {
		yield* g.callName(f, rt.gl("SSjob"), "SendToLateJoin", [live(new_devil)]);
	}
	yield* g.callName(f, (A = (yield* g.new_(f, T("/datum/preferences"), []))), "copy_to", [live(new_devil)]);
	yield* g.callName(f, rt.fv(f, "dna", live(new_devil)), "update_dna_identity", []);
	return live(new_devil);
}, true);

// /proc/create_devil_mind  (code/modules/events/devil.dm:54)
rt.def("/proc/create_devil_mind", function create_devil_mind(f: Frame, key: Value) {
	let Mind: Value = null;
	f.vars = () => [Mind];
	rt.setFv(f, "assigned_role", (Mind = rt.new_(f, T("/datum/mind"), [live(key)])), "devil");
	rt.setFv(f, "special_role", live(Mind), "devil");
	(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "devils", live(Mind), rt.bitOr));
	return live(Mind);
});
