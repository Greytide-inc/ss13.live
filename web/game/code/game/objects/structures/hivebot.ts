// From code/game/objects/structures/hivebot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12780, "/obj/structure/hivebot_beacon", "/obj/structure", {
	bot_type: "norm",
	bot_amt: 10,
	anchored: 1,
	name: "beacon",
	desc: "Some odd beacon thing.",
	icon: rt.rsc("icons/mob/hivebot.dmi"),
	icon_state: "def_radar-off",
	density: 1,
});

// /obj/structure/hivebot_beacon/proc/New  (code/game/objects/structures/hivebot.dm:12)  may sleep
rt.def("/obj/structure/hivebot_beacon/proc/New", function* New(f: Frame) {
	let smoke: Value = null;
	f.vars = () => [smoke];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread"), []))), "set_up", [2, rt.sv(f, "loc")]);
	yield* g.callName(f, live(smoke), "start", []);
	yield* g.srcCall(f, "visible_message", fmt("<span class='boldannounce'>The ＀ warps in!</span>", [live(f.src)]));
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/empulse.ogg"), 25, 1]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/hivebot_beacon/proc/warpbots")])), (yield* g.call(f, P("/proc/rand"), null, [10, 600]))]);
	return f.dot;
}, true);

// /obj/structure/hivebot_beacon/proc/warpbots  (code/game/objects/structures/hivebot.dm:21)  may sleep
rt.def("/obj/structure/hivebot_beacon/proc/warpbots", function* warpbots(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.setSv(f, "icon_state", "def_radar");
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>The ＀ turns on!</span>", [live(f.src)]));
	while (rt.gt(rt.sv(f, "bot_amt"), 0)) {
		rt.incSrcVar(f, "bot_amt", -1, true);
		$0 = rt.sv(f, "bot_type");
		if ($0 === "norm") {
			yield* g.new_(f, T("/mob/living/simple_animal/hostile/hivebot"), [rt.getStep(f, live(f.src), 0)]);
		} else if ($0 === "range") {
			yield* g.new_(f, T("/mob/living/simple_animal/hostile/hivebot/range"), [rt.getStep(f, live(f.src), 0)]);
		} else if ($0 === "rapid") {
			yield* g.new_(f, T("/mob/living/simple_animal/hostile/hivebot/rapid"), [rt.getStep(f, live(f.src), 0)]);
		}
	}
	yield* g.call(f, P("/proc/sleep"), null, [100]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='boldannounce'>The ＀ warps out!</span>", [live(f.src)]));
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/empulse.ogg"), 25, 1]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(f.dot);
}, true);
