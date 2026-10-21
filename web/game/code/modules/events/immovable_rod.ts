// From code/modules/events/immovable_rod.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(303, "/datum/round_event/immovable_rod", "/datum/round_event", {
	announceWhen: 5,
});

// /datum/round_event/immovable_rod/proc/announce  (code/modules/events/immovable_rod.dm:20)  may sleep
rt.def("/datum/round_event/immovable_rod/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, ["What the fuck was that?!", "General Alert"]);
	return f.dot;
}, true);

// /datum/round_event/immovable_rod/proc/start  (code/modules/events/immovable_rod.dm:23)  may sleep
rt.def("/datum/round_event/immovable_rod/proc/start", function* start(f: Frame) {
	let startside: Value = null, startT: Value = null, endT: Value = null;
	f.vars = () => [startside, startT, endT];
	startside = rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")]);
	startT = (yield* g.call(f, P("/proc/spaceDebrisStartLoc"), null, [live(startside), 2]));
	endT = (yield* g.call(f, P("/proc/spaceDebrisFinishLoc"), null, [live(startside), 2]));
	yield* g.new_(f, T("/obj/effect/immovablerod"), [live(startT), live(endT)]);
	return f.dot;
}, true);

rt.type(12048, "/obj/effect/immovablerod", "/obj/effect", {
	z_original: 0,
	destination: null,
	notify: 1,
	anchored: 1,
	name: "immovable rod",
	desc: "What the fuck is that?",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "immrod",
	throwforce: 100,
	density: 1,
});

// /obj/effect/immovablerod/proc/New  (code/modules/events/immovable_rod.dm:41)  may sleep
rt.def("/obj/effect/immovablerod/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.gl("SSaugury"))) {
		yield* g.callName(f, rt.gl("SSaugury"), "register_doom", [live(f.src), 2000]);
	}
	rt.setSv(f, "z_original", rt.sv(f, "z"));
	rt.setSv(f, "destination", live(f.args[1]));
	if (truthy(rt.sv(f, "notify"))) {
		yield* g.call(f, P("/proc/notify_ghosts"), null, [null, fmt("＆！ is inbound!", [live(f.src)]), "enter_link", fmt("<a href=?src=＃;orbit=1>(Click to orbit)</a>", [live(f.src)]), "source", live(f.src), "action", "orbit"], rt.Args.Named);
	}
	rt.modGl("poi_list", live(f.src), add);
	if (!(truthy(live(f.args[1])) && isEqual(rt.fv(f, "z", live(f.args[1])), rt.sv(f, "z_original")))) return f.dot;
	yield* g.call(f, P("/proc/walk_towards"), null, [live(f.src), rt.sv(f, "destination"), 1]);
	return f.dot;
}, true, { args: ["start", "end"] });

// /obj/effect/immovablerod/proc/Topic  (code/modules/events/immovable_rod.dm:55)  may sleep
rt.def("/obj/effect/immovablerod/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let ghost: Value = null;
	f.vars = () => [href, href_list, ghost];
	if (!truthy(rt.at(live(href_list), "orbit"))) return f.dot;
	if (!truthy((rt.istype((ghost = live(f.usr)), T("/mob/dead/observer")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, live(ghost), "ManualFollow", [live(f.src)]);
	return f.dot;
}, true);

// /obj/effect/immovablerod/proc/Destroy  (code/modules/events/immovable_rod.dm:61)  may sleep
rt.def("/obj/effect/immovablerod/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("poi_list", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/effect/immovablerod/proc/Move  (code/modules/events/immovable_rod.dm:65)  may sleep
rt.def("/obj/effect/immovablerod/proc/Move", function* Move(f: Frame) {
	if ((!isEqual(rt.sv(f, "z"), rt.sv(f, "z_original")) || isEqual(rt.sv(f, "loc"), rt.sv(f, "destination")))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/immovablerod/proc/Bump  (code/modules/events/immovable_rod.dm:73)  may sleep
rt.def("/obj/effect/immovablerod/proc/Bump", function* Bump(f: Frame, clong: Value) {
	let other: Value = null, smoke: Value = null;
	f.vars = () => [clong, other, smoke];
	if (truthy(rt.op(f, "Prob", [], [10]))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/bang.ogg"), 50, 1]);
		yield* g.srcCall(f, "audible_message", "<span class='danger'>You hear a CLANG!</span>");
	}
	if ((truthy(live(clong)) && truthy(rt.op(f, "Prob", [], [25])))) {
		rt.setSv(f, "x", rt.fv(f, "x", live(clong)));
		rt.setSv(f, "y", rt.fv(f, "y", live(clong)));
	}
	if ((truthy((yield* g.call(f, P("/proc/isturf"), null, [live(clong)]))) || truthy((rt.istype(live(clong), T("/obj")) ? 1 : 0)))) {
		if (truthy(rt.fv(f, "density", live(clong)))) {
			yield* g.callName(f, live(clong), "ex_act", [2]);
		}
	} else {
		if (truthy((rt.istype(live(clong), T("/mob/living")) ? 1 : 0))) {
			yield* g.srcCall(f, "penetrate", live(clong));
		} else {
			if (!truthy(rt.op(f, "IsType", [], [live(clong), rt.sv(f, "type")]))) return f.dot;
			other = live(clong);
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ collides with ＀!</span>", [live(f.src), live(other)]));
			yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread"), []))), "set_up", [2, rt.getStep(f, live(f.src), 0)]);
			yield* g.callName(f, live(smoke), "start", []);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			yield* g.call(f, P("/proc/qdel"), null, [live(other)]);
		}
	}
	return f.dot;
}, true);

// /obj/effect/immovablerod/proc/penetrate  (code/modules/events/immovable_rod.dm:98)  may sleep
rt.def("/obj/effect/immovablerod/proc/penetrate", function* penetrate(f: Frame, L: Value) {
	let H: Value = null;
	f.vars = () => [L, H];
	yield* g.callName(f, live(L), "visible_message", [fmt("<span class='danger'>＀ is penetrated by an immovable rod!</span>", [live(L)]), "<span class='userdanger'>The rod penetrates you!</span>", "<span class ='danger'>You hear a CLANG!</span>"]);
	if (truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.callName(f, (H = live(L)), "adjustBruteLoss", [160]);
	}
	if (!(truthy(live(L)) && (truthy(rt.fv(f, "density", live(L))) || truthy(rt.op(f, "Prob", [], [10]))))) return f.dot;
	yield* g.callName(f, live(L), "ex_act", [2]);
	return f.dot;
}, true);
