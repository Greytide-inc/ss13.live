// From code/game/gamemodes/changeling/powers/fleshmend.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11230, "/obj/effect/proc_holder/changeling/fleshmend", "/obj/effect/proc_holder/changeling", {
	recent_uses: 1,
	healing_ticks: 10,
	total_healing: 100,
	helptext: "Heals a moderate amount of damage over a short period of time. Can be used while unconscious. Does not regrow limbs or restore lost blood.",
	chemical_cost: 20,
	dna_cost: 2,
	req_stat: 1,
	name: "Fleshmend",
	desc: "Our flesh rapidly regenerates, healing our burns, bruises and shortness of breath. Effectiveness decreases with quick, repeated use.",
});

// /obj/effect/proc_holder/changeling/fleshmend/proc/Initialize  (code/game/gamemodes/changeling/powers/fleshmend.dm:15)
rt.def("/obj/effect/proc_holder/changeling/fleshmend/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
});

// /obj/effect/proc_holder/changeling/fleshmend/proc/Destroy  (code/game/gamemodes/changeling/powers/fleshmend.dm:19)  may sleep
rt.def("/obj/effect/proc_holder/changeling/fleshmend/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/proc_holder/changeling/fleshmend/proc/process  (code/game/gamemodes/changeling/powers/fleshmend.dm:23)
rt.def("/obj/effect/proc_holder/changeling/fleshmend/proc/process", function process(f: Frame) {
	if (!rt.gt(rt.sv(f, "recent_uses"), 1)) return f.dot;
	rt.setSv(f, "recent_uses", rt.call(f, P("/proc/max"), null, [1, subtract(rt.sv(f, "recent_uses"), divide(1, rt.sv(f, "healing_ticks")))]));
	return f.dot;
}, false, { waitfor: false });

// /obj/effect/proc_holder/changeling/fleshmend/proc/sting_action  (code/game/gamemodes/changeling/powers/fleshmend.dm:29)
rt.def("/obj/effect/proc_holder/changeling/fleshmend/proc/sting_action", function sting_action(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>We begin to heal rapidly.</span>"]);
	if (rt.gt(rt.sv(f, "recent_uses"), 1)) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Our healing's effectiveness is reduced by quick repeated use!</span>"]);
	}
	rt.incSrcVar(f, "recent_uses", 1, true);
	rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/effect/proc_holder/changeling/fleshmend/proc/fleshmend"), live(user)]);
	return 1;
});

// /obj/effect/proc_holder/changeling/fleshmend/proc/fleshmend  (code/game/gamemodes/changeling/powers/fleshmend.dm:43)  may sleep
rt.def("/obj/effect/proc_holder/changeling/fleshmend/proc/fleshmend", function* fleshmend(f: Frame, user: Value) {
	let i: Value = null, healpertick: Value = null;
	let $e: any;
	f.vars = () => [user, i, healpertick, $e];
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "healing_ticks"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy(live(user))) {
			healpertick = rt.neg(divide(rt.sv(f, "total_healing"), rt.sv(f, "healing_ticks")));
			yield* g.callName(f, live(user), "adjustBruteLoss", [divide(live(healpertick), rt.sv(f, "recent_uses")), 0]);
			yield* g.callName(f, live(user), "adjustOxyLoss", [divide(live(healpertick), rt.sv(f, "recent_uses")), 0]);
			yield* g.callName(f, live(user), "adjustFireLoss", [divide(live(healpertick), rt.sv(f, "recent_uses")), 0]);
			yield* g.callName(f, live(user), "updatehealth", []);
		} else {
			break;
		}
		yield* g.call(f, P("/proc/sleep"), null, [10]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });
