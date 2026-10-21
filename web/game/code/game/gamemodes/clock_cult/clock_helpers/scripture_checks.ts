// From code/game/gamemodes/clock_cult/clock_helpers/scripture_checks.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/scripture_unlock_check  (code/game/gamemodes/clock_cult/clock_helpers/scripture_checks.dm:4)
rt.def("/proc/scripture_unlock_check", function scripture_unlock_check(f: Frame) {
	let servants: Value = null, unconverted_ai_exists: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [servants, unconverted_ai_exists, M, $e];
	servants = 0;
	unconverted_ai_exists = rt.call(f, P("/proc/get_unconverted_ais"), null, []);
	M = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(M)])) && (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(M), T("/mob/living/silicon")) ? 1 : 0))))) {
			servants = rt.inc(live(servants), 1);
		}
	}
	rt.endFor(f, 0);
	f.dot = rt.alist(f, ["Driver", 1, "Script", 0, "Application", 0, "Judgement", 0]);
	rt.setAt(live(f.dot), "Script", (rt.index(rt.fv(f, "scripture_states", rt.gl("SSticker")), "Script") || ((rt.ge(live(servants), 6) ? 1 : 0) && (rt.ge(rt.gl("clockwork_caches"), 1) ? 1 : 0))));
	rt.setAt(live(f.dot), "Application", (rt.index(rt.fv(f, "scripture_states", rt.gl("SSticker")), "Application") || (((rt.ge(live(servants), 9) ? 1 : 0) && (rt.ge(rt.gl("clockwork_caches"), 3) ? 1 : 0)) && (rt.ge(rt.gl("clockwork_construction_value"), 100) ? 1 : 0))));
	rt.setAt(live(f.dot), "Judgement", (rt.index(rt.fv(f, "scripture_states", rt.gl("SSticker")), "Judgement") || ((((rt.ge(live(servants), 12) ? 1 : 0) && (rt.ge(rt.gl("clockwork_caches"), 5) ? 1 : 0)) && (rt.ge(rt.gl("clockwork_construction_value"), 300) ? 1 : 0)) && (!truthy(live(unconverted_ai_exists)) ? 1 : 0))));
	return f.dot;
});

// /proc/scripture_unlock_alert  (code/game/gamemodes/clock_cult/clock_helpers/scripture_checks.dm:22)  may sleep
rt.def("/proc/scripture_unlock_alert", function* scripture_unlock_alert(f: Frame, previous_states: Value) {
	let i: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [previous_states, i, $0, $1, $e];
	f.dot = (yield* g.call(f, P("/proc/scripture_unlock_check"), null, []));
	i = null;
	rt.forList(f, 0, live(f.dot));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!isEqual(rt.index(live(f.dot), live(i)), rt.index(live(previous_states), live(i)))) {
			$0 = live(i);
			if (truthy(rt.index(live(f.dot), live(i)))) {
				$1 = "un";
			} else {
				$1 = "";
			}
			yield* g.call(f, P("/proc/hierophant_message"), null, [fmt("<span class='large_brass'><i>Hierophant Network:</i> <b>＀ Scripture has been ＀locked.</b></span>", [$0, $1])]);
			yield* g.call(f, P("/proc/update_slab_info"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/get_unconverted_ais  (code/game/gamemodes/clock_cult/clock_helpers/scripture_checks.dm:30)
rt.def("/proc/get_unconverted_ais", function get_unconverted_ais(f: Frame) {
	let ai: Value = null, AI: Value = null;
	let $e: any;
	f.vars = () => [ai, AI, $e];
	f.dot = 0;
	ai = null;
	rt.forList(f, 0, rt.gl("ai_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ai = $e;
		if ((truthy(rt.gv(f, "deployed_shell", (AI = live(ai)))) && truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.fv(f, "deployed_shell", live(AI))])))) {
			continue;
		}
		if ((((truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(AI)])) || !truthy(rt.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(AI))]))) || !isEqual(rt.fv(f, "z", live(AI)), 2)) || isEqual(rt.fv(f, "stat", live(AI)), 2))) {
			continue;
		}
		f.dot = rt.inc(live(f.dot), 1);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/update_slab_info  (code/game/gamemodes/clock_cult/clock_helpers/scripture_checks.dm:39)  may sleep
rt.def("/proc/update_slab_info", function* update_slab_info(f: Frame, set_slab: Value) {
	let needs_update: Value = null, s: Value = null, S: Value = null, S_1: Value = null;
	let $e: any;
	f.vars = () => [set_slab, needs_update, s, S, S_1, $e];
	yield* g.call(f, P("/proc/generate_all_scripture"), null, []);
	needs_update = 0;
	s = null;
	rt.forList(f, 0, rt.gl("all_scripture"));
	while (($e = rt.next(f, 0)) !== undefined) {
		s = $e;
		if (truthy((yield* g.callName(f, (S = rt.index(rt.gl("all_scripture"), live(s))), "creation_update", [])))) {
			needs_update = 1;
		}
	}
	rt.endFor(f, 0);
	if ((!truthy(live(set_slab)) || truthy(live(needs_update)))) {
		S_1 = null;
		rt.forList(f, 0, rt.gl("all_clockwork_objects"), T("/obj/item/clockwork/slab"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S_1 = $e;
			yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(S_1)]);
			if (truthy(live(needs_update))) {
				yield* g.callName(f, live(S_1), "update_quickbind", []);
			}
		}
		rt.endFor(f, 0);
	} else {
		yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(set_slab)]);
		yield* g.callName(f, live(set_slab), "update_quickbind", []);
	}
	return f.dot;
}, true);

// /proc/generate_all_scripture  (code/game/gamemodes/clock_cult/clock_helpers/scripture_checks.dm:55)  may sleep
rt.def("/proc/generate_all_scripture", function* generate_all_scripture(f: Frame) {
	let V: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [V, S, $e];
	if (truthy(rt.len(f, rt.gl("all_scripture")))) return f.dot;
	V = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/sortList"), null, [subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/clockwork_scripture")])), T("/datum/clockwork_scripture")), P("/proc/cmp_clockscripture_priority")])));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		S = (yield* g.new_(f, live(V), []));
		rt.setAt(rt.gl("all_scripture"), rt.fv(f, "type", live(S)), live(S));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/change_construction_value  (code/game/gamemodes/clock_cult/clock_helpers/scripture_checks.dm:62)
rt.def("/proc/change_construction_value", function change_construction_value(f: Frame, amount: Value) {
	rt.modGl("clockwork_construction_value", live(amount), add);
	return f.dot;
});

// /proc/can_recite_scripture  (code/game/gamemodes/clock_cult/clock_helpers/scripture_checks.dm:65)
rt.def("/proc/can_recite_scripture", function can_recite_scripture(f: Frame, L: Value, can_potentially: Value) {
	return ((rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)]) && (live(can_potentially) || ((isEqual(rt.fv(f, "stat", live(L)), 0) ? 1 : 0) && rt.callName(f, live(L), "can_speak_vocal", [])))) && (rt.gl("ratvar_awakens") || ((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0) || (rt.istype(live(L), T("/mob/living/silicon")) ? 1 : 0))));
});
