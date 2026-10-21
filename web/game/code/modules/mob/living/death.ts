// From code/modules/mob/living/death.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/proc/gib  (code/modules/mob/living/death.dm:2)  may sleep
rt.def("/mob/living/proc/gib", function* gib(f: Frame, no_brain: Value, no_organs: Value, no_bodyparts: Value) {
	let prev_lying: Value = null;
	f.vars = () => [no_brain, no_organs, no_bodyparts, prev_lying];
	prev_lying = rt.sv(f, "lying");
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		yield* g.srcCall(f, "death", 1);
	}
	if (!truthy(live(prev_lying))) {
		yield* g.srcCall(f, "gib_animation");
	}
	yield* g.srcCall(f, "spill_organs", live(no_brain), live(no_organs), live(no_bodyparts));
	if (!truthy(live(no_bodyparts))) {
		yield* g.srcCall(f, "spread_bodyparts", live(no_brain), live(no_organs));
	}
	yield* g.srcCall(f, "spawn_gibs", live(no_bodyparts));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/proc/spawn_gibs  (code/modules/mob/living/death.dm:21)  may sleep
rt.def("/mob/living/proc/spawn_gibs", function* spawn_gibs(f: Frame) {
	yield* g.new_(f, T("/obj/effect/gibspawner/generic"), [rt.sv(f, "loc"), rt.sv(f, "viruses")]);
	return f.dot;
}, true);

// /mob/living/proc/dust  (code/modules/mob/living/death.dm:30)  may sleep
rt.def("/mob/living/proc/dust", function* dust(f: Frame, just_ash: Value) {
	f.vars = () => [just_ash];
	if (live(just_ash) === null) {
		just_ash = 0;
	}
	yield* g.srcCall(f, "death", 1);
	if (truthy(rt.sv(f, "buckled"))) {
		yield* g.callName(f, rt.sv(f, "buckled"), "unbuckle_mob", [null, live(f.src), "force", 1], rt.Args.Named);
	}
	yield* g.srcCall(f, "dust_animation");
	yield* g.srcCall(f, "spawn_dust", live(just_ash));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/proc/spawn_dust  (code/modules/mob/living/death.dm:43)  may sleep
rt.def("/mob/living/proc/spawn_dust", function* spawn_dust(f: Frame, just_ash: Value) {
	f.vars = () => [just_ash];
	if (live(just_ash) === null) {
		just_ash = 0;
	}
	yield* g.new_(f, T("/obj/effect/decal/cleanable/ash"), [rt.sv(f, "loc")]);
	return f.dot;
}, true);

// /mob/living/proc/death  (code/modules/mob/living/death.dm:48)  may sleep
rt.def("/mob/living/proc/death", function* death(f: Frame, gibbed: Value) {
	let _T: Value = null, A: Value = null, I: Value = null, rendered: Value = null, s: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [gibbed, _T, A, I, rendered, s, S, $e];
	rt.setSv(f, "stat", 2);
	yield* g.srcCall(f, "set_typing_indicator", 0);
	yield* g.srcCall(f, "unset_machine");
	rt.setSv(f, "timeofdeath", rt.worldTime(f));
	rt.setSv(f, "tod", (yield* g.call(f, P("/proc/worldtime2text"), null, [])));
	_T = rt.getStep(f, live(f.src), 0);
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(_T)]));
	I = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, live(I), "on_mob_death", [live(f.src), live(gibbed)]);
	}
	rt.endFor(f, 0);
	if ((((truthy(rt.sv(f, "mind")) && truthy(rt.fv(f, "name", rt.sv(f, "mind")))) && truthy(rt.fv(f, "active", rt.sv(f, "mind")))) && !truthy(rt.bitAnd(rt.fv(f, "flags", live(_T)), 16)))) {
		rendered = fmt("<span class='deadsay'><b>＀</b> has died at <b>＀</b>.</span>", [rt.fv(f, "name", rt.sv(f, "mind")), rt.fv(f, "name", live(A))]);
		yield* g.call(f, P("/proc/deadchat_broadcast"), null, [null, live(rendered), "follow_target", live(f.src), "turf_target", live(_T), "message_type", "deathrattle"], rt.Args.Named);
	}
	if (truthy(rt.sv(f, "mind"))) {
		yield* g.callName(f, rt.sv(f, "mind"), "store_memory", [fmt("Time of death: ＀", [rt.sv(f, "tod")]), 0]);
	}
	(rt.modGl("living_mob_list", live(f.src), subtract));
	if (!truthy(live(gibbed))) {
		rt.modGl("dead_mob_list", live(f.src), add);
	}
	yield* g.srcCall(f, "set_drugginess", 0);
	yield* g.srcCall(f, "SetSleeping", 0, 0);
	yield* g.srcCall(f, "blind_eyes", 1);
	yield* g.srcCall(f, "reset_perspective", null);
	yield* g.srcCall(f, "reload_fullscreen");
	yield* g.srcCall(f, "update_action_buttons_icon");
	yield* g.srcCall(f, "update_damage_hud");
	yield* g.srcCall(f, "update_health_hud");
	yield* g.srcCall(f, "update_canmove");
	yield* g.srcCall(f, "med_hud_set_health");
	yield* g.srcCall(f, "med_hud_set_status");
	s = null;
	rt.forList(f, 0, rt.sv(f, "ownedSoullinks"));
	while (($e = rt.next(f, 0)) !== undefined) {
		s = $e;
		yield* g.callName(f, (S = live(s)), "ownerDies", [live(gibbed)]);
	}
	rt.endFor(f, 0);
	s = null;
	rt.forList(f, 0, rt.sv(f, "sharedSoullinks"));
	while (($e = rt.next(f, 0)) !== undefined) {
		s = $e;
		yield* g.callName(f, (S = live(s)), "sharerDies", [live(gibbed)]);
	}
	rt.endFor(f, 0);
	return 1;
}, true);
