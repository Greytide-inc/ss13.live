// From code/datums/martial/plasma_fist.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(571, "/datum/martial_art/plasma_fist", "/datum/martial_art", {
	name: "Plasma Fist",
	help_verb: rt.procRef("/mob/living/carbon/human/proc/plasma_fist_help"),
});

// /datum/martial_art/plasma_fist/proc/check_streak  (code/datums/martial/plasma_fist.dm:11)  may sleep
rt.def("/datum/martial_art/plasma_fist/proc/check_streak", function* check_streak(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "streak"), "HHD"])))) {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "Tornado", live(A), live(D));
		return 1;
	}
	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "streak"), "DHD"])))) {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "Throwback", live(A), live(D));
		return 1;
	}
	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "streak"), "HDDDH"])))) {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "Plasma", live(A), live(D));
		return 1;
	}
	return 0;
}, true);

// /datum/martial_art/plasma_fist/proc/TornadoAnimate  (code/datums/martial/plasma_fist.dm:27)  may sleep
rt.def("/datum/martial_art/plasma_fist/proc/TornadoAnimate", function* TornadoAnimate(f: Frame, A: Value) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [A, i, $e];
	i = null;
	rt.forList(f, 0, rt.list(1, 2, 4, 8, 4, 2, 1, 2, 4, 8, 4, 2));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!truthy(live(A))) {
			break;
		}
		yield* g.callName(f, live(A), "setDir", [live(i)]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(A)), rt.rsc("sound/weapons/punch1.ogg"), 15, 1, -1]);
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /datum/martial_art/plasma_fist/proc/Tornado  (code/datums/martial/plasma_fist.dm:35)  may sleep
rt.def("/datum/martial_art/plasma_fist/proc/Tornado", function* Tornado(f: Frame, A: Value, D: Value) {
	let R: Value = null, turfs: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [A, D, R, turfs, _T, $e];
	yield* g.callName(f, live(A), "say", ["TORNADO SWEEP!"]);
	yield* g.srcCall(f, "TornadoAnimate", live(A));
	R = (yield* g.new_(f, T("/obj/effect/proc_holder/spell/aoe_turf/repulse"), [null]));
	turfs = rt.list();
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(A)])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.callName(f, live(turfs), "Add", [live(_T)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(R), "cast", [live(turfs)]);
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "tornado sweeped(Plasma Fist)"]);
	return live(f.dot);
}, true);

// /datum/martial_art/plasma_fist/proc/Throwback  (code/datums/martial/plasma_fist.dm:46)  may sleep
rt.def("/datum/martial_art/plasma_fist/proc/Throwback", function* Throwback(f: Frame, A: Value, D: Value) {
	let throw_target: Value = null;
	f.vars = () => [A, D, throw_target];
	yield* g.callName(f, live(D), "visible_message", [fmt("<span class='danger'>＀ has hit ＀ with Plasma Punch!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ has hit ＀ with Plasma Punch!</span>", [live(A), live(D)])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(D)), rt.rsc("sound/weapons/punch1.ogg"), 50, 1, -1]);
	throw_target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(D), rt.getDir(f, live(D), (yield* g.call(f, P("/proc/get_step_away"), null, [live(D), live(A)])))]));
	yield* g.callName(f, live(D), "throw_at", [live(throw_target), 200, 4, live(A)]);
	yield* g.callName(f, live(A), "say", ["HYAH!"]);
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "threw back (Plasma Fist)"]);
	return live(f.dot);
}, true);

// /datum/martial_art/plasma_fist/proc/Plasma  (code/datums/martial/plasma_fist.dm:56)  may sleep
rt.def("/datum/martial_art/plasma_fist/proc/Plasma", function* Plasma(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	yield* g.callName(f, live(A), "do_attack_animation", [live(D), "punch"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(D)), rt.rsc("sound/weapons/punch1.ogg"), 50, 1, -1]);
	yield* g.callName(f, live(A), "say", ["PLASMA FIST!"]);
	yield* g.callName(f, live(D), "visible_message", [fmt("<span class='danger'>＀ has hit ＀ with THE PLASMA FIST TECHNIQUE!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ has hit ＀ with THE PLASMA FIST TECHNIQUE!</span>", [live(A), live(D)])]);
	yield* g.callName(f, live(D), "gib", []);
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "gibbed (Plasma Fist)"]);
	return live(f.dot);
}, true);

// /datum/martial_art/plasma_fist/proc/harm_act  (code/datums/martial/plasma_fist.dm:66)  may sleep
rt.def("/datum/martial_art/plasma_fist/proc/harm_act", function* harm_act(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	yield* g.srcCall(f, "add_to_streak", "H", live(D));
	if (truthy((yield* g.srcCall(f, "check_streak", live(A), live(D))))) {
		return 1;
	}
	yield* g.srcCall(f, "basic_hit", live(A), live(D));
	return 1;
}, true);

// /datum/martial_art/plasma_fist/proc/disarm_act  (code/datums/martial/plasma_fist.dm:73)  may sleep
rt.def("/datum/martial_art/plasma_fist/proc/disarm_act", function* disarm_act(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	yield* g.srcCall(f, "add_to_streak", "D", live(D));
	if (truthy((yield* g.srcCall(f, "check_streak", live(A), live(D))))) {
		return 1;
	}
	yield* g.srcCall(f, "basic_hit", live(A), live(D));
	return 1;
}, true);

// /datum/martial_art/plasma_fist/proc/grab_act  (code/datums/martial/plasma_fist.dm:80)  may sleep
rt.def("/datum/martial_art/plasma_fist/proc/grab_act", function* grab_act(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	yield* g.srcCall(f, "add_to_streak", "G", live(D));
	if (truthy((yield* g.srcCall(f, "check_streak", live(A), live(D))))) {
		return 1;
	}
	yield* g.srcCall(f, "basic_hit", live(A), live(D));
	return 1;
}, true);

// /mob/living/carbon/human/proc/plasma_fist_help  (code/datums/martial/plasma_fist.dm:91)
rt.def("/mob/living/carbon/human/proc/plasma_fist_help", function plasma_fist_help(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<b><i>You clench your fists and have a flashback of knowledge...</i></b>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Tornado Sweep</span>: Harm Harm Disarm. Repulses target and everyone back."]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Throwback</span>: Disarm Harm Disarm. Throws the target and an item at them."]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>The Plasma Fist</span>: Harm Disarm Disarm Disarm Harm. Knocks the brain out of the opponent and gibs their body."]);
	return f.dot;
}, false, { verb: { name: "Recall Teachings", category: "Plasma Fist", desc: "Remember the martial techniques of the Plasma Fist." } });

rt.type(5609, "/obj/item/weapon/plasma_fist_scroll", "/obj/item/weapon", {
	used: 0,
	name: "frayed scroll",
	desc: "An aged and frayed scrap of paper written in shifting runes. There are hand-drawn illustrations of pugilism.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "scroll2",
});

// /obj/item/weapon/plasma_fist_scroll/proc/attack_self  (code/datums/martial/plasma_fist.dm:104)
rt.def("/obj/item/weapon/plasma_fist_scroll/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let H: Value = null, F: Value = null;
	f.vars = () => [H, F];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "used"))) return f.dot;
	H = live(user);
	rt.callName(f, (F = rt.new_(f, T("/datum/martial_art/plasma_fist"), [null])), "teach", [live(H)]);
	rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='boldannounce'>You have learned the ancient martial art of Plasma Fist.</span>"]);
	rt.setSv(f, "used", 1);
	rt.setSv(f, "desc", "It's completely blank.");
	rt.setSv(f, "name", "empty scroll");
	rt.setSv(f, "icon_state", "blankscroll");
	return f.dot;
});
