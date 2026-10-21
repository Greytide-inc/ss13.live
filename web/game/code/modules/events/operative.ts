// From code/modules/events/operative.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(282, "/datum/round_event/ghost_role/operative", "/datum/round_event/ghost_role", {
	minimum_required: 1,
	role_name: "lone operative",
});

// /datum/round_event/ghost_role/operative/proc/spawn_role  (code/modules/events/operative.dm:12)  may sleep
rt.def("/datum/round_event/ghost_role/operative/proc/spawn_role", function* spawn_role(f: Frame) {
	let candidates: Value = null, selected: Value = null, spawn_locs: Value = null, L: Value = null, operative: Value = null, A: Value = null, Mind: Value = null, nuke: Value = null, nuke_code: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [candidates, selected, spawn_locs, L, operative, A, Mind, nuke, nuke_code, O, $e];
	if (!truthy(rt.getLen(f, (candidates = (yield* g.srcCall(f, "get_candidates", "operative", null, "operative")))))) {
		return 3;
	}
	selected = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(candidates)]));
	spawn_locs = rt.list();
	L = null;
	rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy((rt.isIn(f, rt.fv(f, "name", live(L)), rt.list("ninjaspawn", "carpspawn")) ? 1 : 0))) {
			spawn_locs = rt.modify(live(spawn_locs), rt.fv(f, "loc", live(L)), add);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(spawn_locs)))) {
		return 4;
	}
	operative = (yield* g.new_(f, T("/mob/living/carbon/human"), [rt.op(f, "PickUnweighted", [1], [live(spawn_locs)])]));
	yield* g.callName(f, (A = (yield* g.new_(f, T("/datum/preferences"), []))), "copy_to", [live(operative)]);
	yield* g.callName(f, rt.fv(f, "dna", live(operative)), "update_dna_identity", []);
	yield* g.callName(f, live(operative), "equipOutfit", [T("/datum/outfit/syndicate/full")]);
	rt.setFv(f, "assigned_role", (Mind = (yield* g.new_(f, T("/datum/mind"), [rt.fv(f, "key", live(selected))]))), "Lone Operative");
	rt.setFv(f, "special_role", live(Mind), "Lone Operative");
	(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", live(Mind), rt.bitOr));
	rt.setFv(f, "active", live(Mind), 1);
	if (truthy((nuke = rt.locateIn(f, T("/obj/machinery/nuclearbomb/selfdestruct"), rt.gl("machines"))))) {
		nuke_code = null;
		if ((!truthy(rt.fv(f, "r_code", live(nuke))) || isEqual(rt.fv(f, "r_code", live(nuke)), "ADMIN"))) {
			nuke_code = (yield* g.call(f, P("/proc/random_nukecode"), null, []));
			rt.setFv(f, "r_code", live(nuke), live(nuke_code));
		} else {
			nuke_code = rt.fv(f, "r_code", live(nuke));
		}
		yield* g.callName(f, live(Mind), "store_memory", [fmt("<B>Station Self-Destruct Device Code</B>: ＀", [live(nuke_code)]), 0, 0]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(Mind)), fmt("The nuclear authorization code is: <B>＀</B>", [live(nuke_code)])]);
		rt.setFv(f, "owner", (O = (yield* g.new_(f, T("/datum/objective/nuclear"), []))), live(Mind));
		rt.modField(f, live(Mind), "objectives", live(O), add);
	}
	yield* g.callName(f, live(Mind), "transfer_to", [live(operative)]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has been made into lone operative by an event.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(operative)]))])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ was spawned as a lone operative by an event.", [(yield* g.call(f, P("/proc/key_name"), null, [live(operative)]))])]);
	rt.modSrcVar(f, "spawned_mobs", live(operative), add);
	return 2;
}, true);
