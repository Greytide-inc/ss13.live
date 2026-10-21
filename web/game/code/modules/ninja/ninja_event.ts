// From code/modules/ninja/ninja_event.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(285, "/datum/round_event/ghost_role/ninja", "/datum/round_event/ghost_role", {
	success_spawn: 0,
	helping_station: null,
	spawn_loc: null,
	give_objectives: 1,
	role_name: "space ninja",
	minimum_required: 1,
});

// /datum/round_event/ghost_role/ninja/proc/setup  (code/modules/ninja/ninja_event.dm:29)
rt.def("/datum/round_event/ghost_role/ninja/proc/setup", function setup(f: Frame) {
	rt.setSv(f, "helping_station", rt.call(f, P("/proc/rand"), null, [0, 1]));
	return f.dot;
});

// /datum/round_event/ghost_role/ninja/proc/kill  (code/modules/ninja/ninja_event.dm:33)
rt.def("/datum/round_event/ghost_role/ninja/proc/kill", function kill(f: Frame) {
	if ((!truthy(rt.sv(f, "success_spawn")) && truthy(rt.sv(f, "control")))) {
		rt.incField(f, rt.sv(f, "control"), "occurrences", -1, true);
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /datum/round_event/ghost_role/ninja/proc/spawn_role  (code/modules/ninja/ninja_event.dm:40)  may sleep
rt.def("/datum/round_event/ghost_role/ninja/proc/spawn_role", function* spawn_role(f: Frame) {
	let spawn_locs: Value = null, L: Value = null, candidates: Value = null, selected_candidate: Value = null, key: Value = null, Mind: Value = null, Ninja: Value = null, ninjadatum: Value = null;
	let $0: any, $e: any;
	f.vars = () => [spawn_locs, L, candidates, selected_candidate, key, Mind, Ninja, ninjadatum, $0, $e];
	if (!truthy(rt.sv(f, "spawn_loc"))) {
		spawn_locs = rt.list();
		L = null;
		rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(L))])))) {
				$0 = rt.fv(f, "name", live(L));
				if ($0 === "ninjaspawn" || $0 === "carpspawn") {
					spawn_locs = rt.modify(live(spawn_locs), rt.fv(f, "loc", live(L)), add);
				}
			}
		}
		rt.endFor(f, 0);
		if (!truthy(rt.len(f, live(spawn_locs)))) {
			return (yield* g.srcCall(f, "kill"));
		}
		rt.setSv(f, "spawn_loc", rt.op(f, "PickUnweighted", [1], [live(spawn_locs)]));
	}
	if (!truthy(rt.sv(f, "spawn_loc"))) {
		return 4;
	}
	if (!truthy(rt.getLen(f, (candidates = (yield* g.srcCall(f, "get_candidates", "ninja", null, "space ninja")))))) {
		return 3;
	}
	selected_candidate = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(candidates)]));
	key = rt.fv(f, "key", live(selected_candidate));
	rt.setFv(f, "active", (Mind = (yield* g.call(f, P("/proc/create_ninja_mind"), null, [live(key)]))), 1);
	Ninja = (yield* g.call(f, P("/proc/create_space_ninja"), null, [rt.sv(f, "spawn_loc")]));
	yield* g.callName(f, live(Mind), "transfer_to", [live(Ninja)]);
	yield* g.callName(f, (ninjadatum = (yield* g.call(f, P("/proc/add_ninja"), null, [live(Ninja)]))), "equip_space_ninja", []);
	rt.setFv(f, "internal", live(Ninja), rt.fv(f, "s_store", live(Ninja)));
	yield* g.callName(f, live(Ninja), "update_internals_hud_icon", [1]);
	if (!isEqual(rt.fv(f, "mind", live(Ninja)), live(Mind))) {
		rt.throw_(f, (yield* g.new_(f, T("/exception"), ["Ninja created with incorrect mind", "code/modules/ninja/ninja_event.dm", 78])));
	}
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_ninja_icons_added", [live(Ninja)]);
	rt.modSrcVar(f, "spawned_mobs", live(Ninja), add);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has been made into a ninja by an event.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(Ninja)]))])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ was spawned as a ninja by an event.", [(yield* g.call(f, P("/proc/key_name"), null, [live(Ninja)]))])]);
	return 2;
}, true);

// /proc/create_space_ninja  (code/modules/ninja/ninja_event.dm:92)  may sleep
rt.def("/proc/create_space_ninja", function* create_space_ninja(f: Frame, spawn_loc: Value) {
	let new_ninja: Value = null, A: Value = null;
	f.vars = () => [spawn_loc, new_ninja, A];
	new_ninja = (yield* g.new_(f, T("/mob/living/carbon/human"), [live(spawn_loc)]));
	rt.setFv(f, "real_name", (A = (yield* g.new_(f, T("/datum/preferences"), []))), fmt("＀ ＀", [rt.op(f, "PickUnweighted", [1], [rt.gl("ninja_titles")]), rt.op(f, "PickUnweighted", [1], [rt.gl("ninja_names")])]));
	yield* g.callName(f, live(A), "copy_to", [live(new_ninja)]);
	yield* g.callName(f, rt.fv(f, "dna", live(new_ninja)), "update_dna_identity", []);
	return live(new_ninja);
}, true);

// /proc/create_ninja_mind  (code/modules/ninja/ninja_event.dm:101)
rt.def("/proc/create_ninja_mind", function create_ninja_mind(f: Frame, key: Value) {
	let Mind: Value = null;
	f.vars = () => [Mind];
	rt.setFv(f, "assigned_role", (Mind = rt.new_(f, T("/datum/mind"), [live(key)])), "Space Ninja");
	rt.setFv(f, "special_role", live(Mind), "Space Ninja");
	(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", live(Mind), rt.bitOr));
	return live(Mind);
});

// /datum/game_mode/proc/update_ninja_icons_added  (code/modules/ninja/ninja_event.dm:109)
rt.def("/datum/game_mode/proc/update_ninja_icons_added", function update_ninja_icons_added(f: Frame, ninja: Value) {
	let ninjahud: Value = null;
	f.vars = () => [ninjahud];
	rt.callName(f, (ninjahud = rt.index(rt.gl("huds"), 12)), "join_hud", [live(ninja)]);
	rt.callSrc(f, "set_antag_hud", [live(ninja), "ninja"]);
	return f.dot;
});

// /datum/game_mode/proc/update_ninja_icons_removed  (code/modules/ninja/ninja_event.dm:114)
rt.def("/datum/game_mode/proc/update_ninja_icons_removed", function update_ninja_icons_removed(f: Frame, ninja_mind: Value) {
	let ninjahud: Value = null;
	f.vars = () => [ninjahud];
	rt.callName(f, (ninjahud = rt.index(rt.gl("huds"), 12)), "leave_hud", [rt.fv(f, "current", live(ninja_mind))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(ninja_mind)), null]);
	return f.dot;
});
