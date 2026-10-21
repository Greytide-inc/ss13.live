// From code/game/gamemodes/miniantags/slaughter/slaughterevent.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(277, "/datum/round_event/ghost_role/slaughter", "/datum/round_event/ghost_role", {
	minimum_required: 1,
	role_name: "slaughter demon",
});

// /datum/round_event/ghost_role/slaughter/proc/spawn_role  (code/game/gamemodes/miniantags/slaughter/slaughterevent.dm:16)  may sleep
rt.def("/datum/round_event/ghost_role/slaughter/proc/spawn_role", function* spawn_role(f: Frame) {
	let candidates: Value = null, selected: Value = null, player_mind: Value = null, spawn_locs: Value = null, L: Value = null, holder: Value = null, S: Value = null;
	let $0: any, $e: any;
	f.vars = () => [candidates, selected, player_mind, spawn_locs, L, holder, S, $0, $e];
	if (!truthy(rt.getLen(f, (candidates = (yield* g.srcCall(f, "get_candidates", "alien", null, "xenomorph")))))) {
		return 3;
	}
	selected = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(candidates)]));
	rt.setFv(f, "active", (player_mind = (yield* g.new_(f, T("/datum/mind"), [rt.fv(f, "key", live(selected))]))), 1);
	spawn_locs = rt.list();
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
	if (!truthy(live(spawn_locs))) {
		yield* g.call(f, P("/proc/message_admins"), null, ["No valid spawn locations found, aborting..."]);
		return 4;
	}
	holder = (yield* g.new_(f, T("/obj/effect/dummy/slaughter"), [rt.op(f, "PickUnweighted", [1], [live(spawn_locs)])]));
	rt.setFv(f, "holder", (S = (yield* g.new_(f, T("/mob/living/simple_animal/slaughter"), [live(holder)]))), live(holder));
	yield* g.callName(f, live(player_mind), "transfer_to", [live(S)]);
	rt.setFv(f, "assigned_role", live(player_mind), "Slaughter Demon");
	rt.setFv(f, "special_role", live(player_mind), "Slaughter Demon");
	(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", live(player_mind), rt.bitOr));
	yield* g.call(f, P("/proc/to_chat"), null, [live(S), rt.fv(f, "playstyle_string", live(S))]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(S), "<B>You are currently not currently in the same plane of existence as the station. Blood Crawl near a blood pool to manifest.</B>"]);
	rt.op(f, "Output", [], [live(S), rt.rsc("sound/magic/demon_dies.ogg")], false);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has been made into a slaughter demon by an event.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(S)]))])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ was spawned as a slaughter demon by an event.", [(yield* g.call(f, P("/proc/key_name"), null, [live(S)]))])]);
	rt.modSrcVar(f, "spawned_mobs", live(S), add);
	return 2;
}, true);
