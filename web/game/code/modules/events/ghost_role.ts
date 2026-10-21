// From code/modules/events/ghost_role.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(274, "/datum/round_event/ghost_role", "/datum/round_event", {
	priority_candidates: null,
	minimum_required: 1,
	role_name: "debug rat with cancer",
	spawned_mobs: null,
});

// /datum/round_event/ghost_role/proc/<init>  (code/modules/events/ghost_role.dm:6)
rt.def("/datum/round_event/ghost_role/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "priority_candidates", rt.list());
	$0 = $0;
	rt.setSv(f, "spawned_mobs", rt.list());
	return f.dot;
});

// /datum/round_event/ghost_role/proc/start  (code/modules/events/ghost_role.dm:12)  may sleep
rt.def("/datum/round_event/ghost_role/proc/start", function* start(f: Frame) {
	yield* g.srcCall(f, "try_spawning");
	return f.dot;
}, true);

// /datum/round_event/ghost_role/proc/try_spawning  (code/modules/events/ghost_role.dm:19)  may sleep
rt.def("/datum/round_event/ghost_role/proc/try_spawning", function* try_spawning(f: Frame, sanity: Value, retry: Value) {
	let status: Value = null, waittime: Value = null;
	f.vars = () => [sanity, retry, status, waittime];
	if (live(sanity) === null) {
		sanity = 0;
	}
	if (live(retry) === null) {
		retry = 0;
	}
	rt.setSv(f, "processing", 0);
	if (isEqual((status = (yield* g.srcCall(f, "spawn_role"))), 5)) {
		if (rt.ge(live(retry), 3)) {
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ event has exceeded maximum spawn attempts. Aborting and refunding.", [rt.sv(f, "role_name")])]);
			if ((truthy(rt.sv(f, "control")) && rt.gt(rt.fv(f, "occurrences", rt.sv(f, "control")), 0))) {
				rt.incField(f, rt.sv(f, "control"), "occurrences", -1, true);
			}
			return live(f.dot);
		}
		waittime = multiply(300, rt.bitXor(2, live(retry)));
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("The event will not spawn a ＀ until certain conditions are met. Waiting ＀s and then retrying.", [rt.sv(f, "role_name"), divide(live(waittime), 10)])]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/round_event/ghost_role/proc/try_spawning"), 0, (retry = rt.inc(live(retry), 1))])), live(waittime)]);
		return live(f.dot);
	}
	if (isEqual(live(status), 4)) {
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ cannot be spawned due to a map error.", [rt.sv(f, "role_name")])]);
	} else {
		if (isEqual(live(status), 3)) {
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ cannot be spawned due to lack of players signing up.", [rt.sv(f, "role_name")])]);
		} else {
			if (isEqual(live(status), 2)) {
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ spawned successfully.", [rt.sv(f, "role_name")])]);
				if (!truthy(rt.len(f, rt.sv(f, "spawned_mobs")))) {
					yield* g.call(f, P("/proc/message_admins"), null, ["No mobs found in the `spawned_mobs` list, this is a bug."]);
				}
			} else {
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("An attempt to spawn ＀ returned ＀, this is a bug.", [rt.sv(f, "role_name"), live(status)])]);
			}
		}
	}
	rt.setSv(f, "processing", 1);
	return f.dot;
}, true);

// /datum/round_event/ghost_role/proc/get_candidates  (code/modules/events/ghost_role.dm:59)  may sleep
rt.def("/datum/round_event/ghost_role/proc/get_candidates", function* get_candidates(f: Frame, jobban: Value, gametypecheck: Value, be_special: Value) {
	let regular_candidates: Value = null, candidates: Value = null;
	f.vars = () => [jobban, gametypecheck, be_special, regular_candidates, candidates];
	regular_candidates = null;
	if (rt.lt(rt.len(f, rt.sv(f, "priority_candidates")), rt.sv(f, "minimum_required"))) {
		regular_candidates = (yield* g.call(f, P("/proc/pollGhostCandidates"), null, [fmt("Do you wish to be considered for the special role of '＀'?", [rt.sv(f, "role_name")]), live(jobban), live(gametypecheck), live(be_special)]));
	} else {
		regular_candidates = rt.list();
	}
	yield* g.call(f, P("/proc/shuffle_inplace"), null, [live(regular_candidates)]);
	return (candidates = add(rt.sv(f, "priority_candidates"), live(regular_candidates)));
}, true);
