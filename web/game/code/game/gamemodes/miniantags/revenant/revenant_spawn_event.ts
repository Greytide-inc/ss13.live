// From code/game/gamemodes/miniantags/revenant/revenant_spawn_event.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(276, "/datum/round_event/ghost_role/revenant", "/datum/round_event/ghost_role", {
	ignore_mobcheck: 0,
	role_name: "revenant",
});

// /datum/round_event/ghost_role/revenant/proc/New  (code/game/gamemodes/miniantags/revenant/revenant_spawn_event.dm:17)
rt.def("/datum/round_event/ghost_role/revenant/proc/New", function New(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "ignore_mobcheck", live(f.args[1]));
	return f.dot;
}, false, { args: ["my_processing", "new_ignore_mobcheck"] });

// /datum/round_event/ghost_role/revenant/proc/spawn_role  (code/game/gamemodes/miniantags/revenant/revenant_spawn_event.dm:21)  may sleep
rt.def("/datum/round_event/ghost_role/revenant/proc/spawn_role", function* spawn_role(f: Frame) {
	let deadMobs: Value = null, M: Value = null, candidates: Value = null, selected: Value = null, spawn_locs: Value = null, L: Value = null, revvie: Value = null;
	let $0: any, $e: any;
	f.vars = () => [deadMobs, M, candidates, selected, spawn_locs, L, revvie, $0, $e];
	if (!truthy(rt.sv(f, "ignore_mobcheck"))) {
		deadMobs = 0;
		M = null;
		rt.forList(f, 0, rt.gl("dead_mob_list"), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			deadMobs = rt.inc(live(deadMobs), 1);
		}
		rt.endFor(f, 0);
		if (rt.lt(live(deadMobs), 20)) {
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("Event attempted to spawn a revenant, but there were only ＀/＀ dead mobs.", [live(deadMobs), 20])]);
			return 5;
		}
	}
	if (!truthy(rt.getLen(f, (candidates = (yield* g.srcCall(f, "get_candidates", "revenant", null, "revenant")))))) {
		return 3;
	}
	selected = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(candidates)]));
	spawn_locs = rt.list();
	L = null;
	rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(L))])))) {
			$0 = rt.fv(f, "name", live(L));
			if ($0 === "revenantspawn") {
				spawn_locs = rt.modify(live(spawn_locs), rt.fv(f, "loc", live(L)), add);
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(spawn_locs)))) {
		L = null;
		rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(L))])))) {
				$0 = rt.fv(f, "name", live(L));
				if ($0 === "carpspawn") {
					spawn_locs = rt.modify(live(spawn_locs), rt.fv(f, "loc", live(L)), add);
				}
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.len(f, live(spawn_locs)))) {
		spawn_locs = rt.modify(live(spawn_locs), rt.getStep(f, live(selected), 0), add);
	}
	if (!truthy(rt.len(f, live(spawn_locs)))) {
		return 4;
	}
	rt.setFv(f, "key", (revvie = (yield* g.new_(f, T("/mob/living/simple_animal/revenant"), [rt.op(f, "PickUnweighted", [1], [live(spawn_locs)])]))), rt.fv(f, "key", live(selected)));
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has been made into a revenant by an event.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(revvie)]))])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ was spawned as a revenant by an event.", [(yield* g.call(f, P("/proc/key_name"), null, [live(revvie)]))])]);
	rt.modSrcVar(f, "spawned_mobs", live(revvie), add);
	return 2;
}, true);
