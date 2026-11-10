// Based on /tg/station's code/game/gamemodes/clock_cult/clock_helpers/scripture_checks.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// scripture_checks.dm:4
rt.def("/proc/scripture_unlock_check", function scripture_unlock_check(f: Frame) {
	let M: Value = null;
	let servants: Value = 0;
	let unconverted_ai_exists: Value = get_unconverted_ais();
	for (M of each(GLOB.living_mob_list, T("/mob/living"))) {
		if (is_servant_of_ratvar(M) && (rt.istype(M, T("/mob/living/carbon/human")) || rt.istype(M, T("/mob/living/silicon")))) {
			servants++;
		}
	}
	f.dot = rt.alist(f, ["Driver", 1, "Script", 0, "Application", 0, "Judgement", 0]);
	rt.setAt(f.dot, "Script", (rt.index(GLOB.SSticker.scripture_states, "Script") || ((servants >= SCRIPT_SERVANT_REQ ? 1 : 0) && (GLOB.clockwork_caches >= 1 ? 1 : 0))));
	rt.setAt(f.dot, "Application", (rt.index(GLOB.SSticker.scripture_states, "Application") || (((servants >= APPLICATION_SERVANT_REQ ? 1 : 0) && (GLOB.clockwork_caches >= APPLICATION_CACHE_REQ ? 1 : 0)) && (GLOB.clockwork_construction_value >= APPLICATION_CV_REQ ? 1 : 0))));
	rt.setAt(f.dot, "Judgement", (rt.index(GLOB.SSticker.scripture_states, "Judgement") || ((((servants >= JUDGEMENT_SERVANT_REQ ? 1 : 0) && (GLOB.clockwork_caches >= JUDGEMENT_CACHE_REQ ? 1 : 0)) && (GLOB.clockwork_construction_value >= JUDGEMENT_CV_REQ ? 1 : 0)) && (!unconverted_ai_exists ? 1 : 0))));
	return f.dot;
});

// scripture_checks.dm:22
rt.def("/proc/scripture_unlock_alert", function* scripture_unlock_alert(f: Frame, previous_states: Value) {
	let i: Value = null;
	let $0: any, $1: any, $e: any;
	f.dot = scripture_unlock_check();
	for (i of each(f.dot)) {
		if (rt.index(f.dot, i) != rt.index(previous_states, i)) {
			$0 = i;
			if (rt.index(f.dot, i)) {
				$1 = "un";
			} else {
				$1 = "";
			}
			hierophant_message(`<span class='large_brass'><i>Hierophant Network:</i> <b>${$0} Scripture has been ${$1}locked.</b></span>`);
			yield* update_slab_info();
		}
	}
	return f.dot;
}, true);

// scripture_checks.dm:30
rt.def("/proc/get_unconverted_ais", function get_unconverted_ais(f: Frame) {
	let ai: Value = null, AI: Value = null;
	f.dot = 0;
	for (ai of each(GLOB.ai_list)) {
		if ((AI = ai).deployed_shell && is_servant_of_ratvar(AI.deployed_shell)) {
			continue;
		}
		if (is_servant_of_ratvar(AI) || !isturf(AI.loc) || AI.z != 2 || AI.stat == 2) {
			continue;
		}
		f.dot++;
	}
	return f.dot;
});

// scripture_checks.dm:39
rt.def("/proc/update_slab_info", function* update_slab_info(f: Frame, set_slab: Value) {
	let s: Value = null, S: Value = null, S_1: Value = null;
	yield* generate_all_scripture();
	let needs_update: Value = 0;
	for (s of each(GLOB.all_scripture)) {
		if ((S = rt.index(GLOB.all_scripture, s)).creation_update()) {
			needs_update = 1;
		}
	}
	if (!set_slab || needs_update) {
		for (S_1 of each(GLOB.all_clockwork_objects, T("/obj/item/clockwork/slab"))) {
			GLOB.SStgui.update_uis(S_1);
			if (needs_update) {
				yield* S_1.update_quickbind();
			}
		}
	} else {
		GLOB.SStgui.update_uis(set_slab);
		yield* set_slab.update_quickbind();
	}
	return f.dot;
}, true);

// scripture_checks.dm:55
rt.def("/proc/generate_all_scripture", function* generate_all_scripture(f: Frame) {
	let V: Value = null, S: Value = null;
	if (rt.len(f, GLOB.all_scripture)) return f.dot;
	for (V of each((yield* sortList(typesof(T("/datum/clockwork_scripture")) - T("/datum/clockwork_scripture"), P("/proc/cmp_clockscripture_priority"))))) {
		S = (yield* new_(V));
		rt.setAt(GLOB.all_scripture, S.type, S);
	}
	return f.dot;
}, true);

// scripture_checks.dm:62
rt.def("/proc/change_construction_value", function change_construction_value(f: Frame, amount: Value) {
	GLOB.clockwork_construction_value += amount;
	return f.dot;
});

// scripture_checks.dm:65
rt.def("/proc/can_recite_scripture", function can_recite_scripture(f: Frame, L: Value, can_potentially: Value) {
	return ((is_servant_of_ratvar(L) && (can_potentially || ((L.stat == 0 ? 1 : 0) && L.can_speak_vocal()))) && (GLOB.ratvar_awakens || ((rt.istype(L, T("/mob/living/carbon/human")) ? 1 : 0) || (rt.istype(L, T("/mob/living/silicon")) ? 1 : 0))));
});
