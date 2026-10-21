// From code/modules/awaymissions/signpost.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12930, "/obj/structure/signpost", "/obj/structure", {
	question: "Travel back?",
	zlevels: null,
	anchored: 1,
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "signpost",
	density: 1,
});

// /obj/structure/signpost/proc/<init>  (code/modules/awaymissions/signpost.dm:8)
rt.def("/obj/structure/signpost/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "zlevels", rt.list(2));
	return f.dot;
});

// /obj/structure/signpost/proc/New  (code/modules/awaymissions/signpost.dm:11)  may sleep
rt.def("/obj/structure/signpost/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "set_light", 2);
	return f.dot;
}, true);

// /obj/structure/signpost/proc/attackby  (code/modules/awaymissions/signpost.dm:15)  may sleep
rt.def("/obj/structure/signpost/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	f.vars = () => [W, user, params];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/structure/signpost/proc/attack_hand  (code/modules/awaymissions/signpost.dm:18)  may sleep
rt.def("/obj/structure/signpost/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let _T: Value = null, A: Value = null;
	let $0: any;
	f.vars = () => [user, _T, A, $0];
	$0 = (yield* g.call(f, P("/proc/alert"), null, [rt.sv(f, "question"), rt.sv(f, "name"), "Yes", "No"]));
	if ($0 === "Yes") {
		if (truthy((_T = (yield* g.call(f, P("/proc/find_safe_turf"), null, ["zlevels", rt.sv(f, "zlevels")], rt.Args.Named))))) {
			A = (yield* g.call(f, P("/proc/get_area"), null, [live(_T)]));
			yield* g.callName(f, live(user), "forceMove", [live(_T)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You blink and find yourself in ＀.</span>", [rt.fv(f, "name", live(A))])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Nothing happens. You feel that this is a bad sign."]);
		}
	} else if ($0 === "No") {
		return live(f.dot);
	}
	return f.dot;
}, true);

rt.type(12932, "/obj/structure/signpost/exit", "/obj/structure/signpost", {
	question: "Leave? You might never come back.",
	name: "exit",
	desc: "Make sure to bring all your belongings with you when you exit the area.",
});

// /obj/structure/signpost/exit/proc/New  (code/modules/awaymissions/signpost.dm:42)  may sleep
rt.def("/obj/structure/signpost/exit/proc/New", function* New(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "zlevels", rt.list());
	i = null;
	rt.forRange(f, 0, 1, rt.fv(f, "maxz", rt.world()), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.modSrcVar(f, "zlevels", live(i), add);
	}
	rt.endFor(f, 0);
	(rt.modSrcVar(f, "zlevels", 1, subtract));
	return f.dot;
}, true);
