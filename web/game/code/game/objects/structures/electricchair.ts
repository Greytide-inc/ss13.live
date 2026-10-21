// From code/game/objects/structures/electricchair.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12732, "/obj/structure/chair/e_chair", "/obj/structure/chair", {
	part: null,
	last_time: 1,
	name: "electric chair",
	desc: "Looks absolutely SHOCKING!\n<span class='notice'>Alt-click to rotate it clockwise.</span>",
	icon_state: "echair0",
	item_chair: null,
});

// /obj/structure/chair/e_chair/proc/New  (code/game/objects/structures/electricchair.dm:10)  may sleep
rt.def("/obj/structure/chair/e_chair/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "add_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/chairs.dmi"), "echair_over", 5])));
	return f.dot;
}, true);

// /obj/structure/chair/e_chair/proc/attackby  (code/game/objects/structures/electricchair.dm:14)  may sleep
rt.def("/obj/structure/chair/e_chair/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let C: Value = null;
	f.vars = () => [W, user, params, C];
	if (!truthy((rt.istype(live(W), T("/obj/item/weapon/wrench")) ? 1 : 0))) return f.dot;
	C = (yield* g.new_(f, T("/obj/structure/chair"), [rt.sv(f, "loc")]));
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(W)), 50, 1]);
	yield* g.callName(f, live(C), "setDir", [rt.sv(f, "dir")]);
	rt.setFv(f, "loc", rt.sv(f, "part"), rt.sv(f, "loc"));
	rt.setFv(f, "master", rt.sv(f, "part"), null);
	rt.setSv(f, "part", null);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/chair/e_chair/proc/shock  (code/game/objects/structures/electricchair.dm:24)  may sleep
rt.def("/obj/structure/chair/e_chair/proc/shock", function* shock(f: Frame) {
	let A: Value = null, s: Value = null, m: Value = null, buckled_mob: Value = null;
	let $e: any;
	f.vars = () => [A, s, m, buckled_mob, $e];
	if (rt.gt(add(rt.sv(f, "last_time"), 50), rt.worldTime(f))) {
		return live(f.dot);
	}
	rt.setSv(f, "last_time", rt.worldTime(f));
	if (!truthy((yield* g.call(f, P("/proc/isarea"), null, [(A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])))])))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(A), "powered", [1])))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(A), "use_power", [1, 5000]);
	yield* g.call(f, P("/proc/flick"), null, ["echair_shock", live(f.src)]);
	yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [12, 1, live(f.src)]);
	yield* g.callName(f, live(s), "start", []);
	if (truthy((yield* g.srcCall(f, "has_buckled_mobs")))) {
		m = null;
		rt.forList(f, 0, rt.sv(f, "buckled_mobs"));
		while (($e = rt.next(f, 0)) !== undefined) {
			m = $e;
			yield* g.callName(f, (buckled_mob = live(m)), "electrocute_act", [85, live(f.src), 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(buckled_mob), "<span class='userdanger'>You feel a deep shock course through your body!</span>"]);
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(buckled_mob), P("/mob/living/proc/electrocute_act"), 85, live(f.src), 1])), 1]);
		}
		rt.endFor(f, 0);
	}
	yield* g.srcCall(f, "visible_message", "<span class='danger'>The electric chair went off!</span>", "<span class='italics'>You hear a deep sharp shock!</span>");
	return f.dot;
}, true);
