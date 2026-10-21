// From code/game/gamemodes/changeling/powers/strained_muscles.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11252, "/obj/effect/proc_holder/changeling/strained_muscles", "/obj/effect/proc_holder/changeling", {
	stacks: 0,
	helptext: "The strain will make us tired, and we will rapidly become fatigued. Standard weight restrictions, like hardsuits, still apply. Cannot be used in lesser form.",
	chemical_cost: 0,
	dna_cost: 1,
	req_human: 1,
	name: "Strained Muscles",
	desc: "We evolve the ability to reduce the acid buildup in our muscles, allowing us to move much faster.",
	active: 0,
});

// /obj/effect/proc_holder/changeling/strained_muscles/proc/sting_action  (code/game/gamemodes/changeling/powers/strained_muscles.dm:15)  may sleep
rt.def("/obj/effect/proc_holder/changeling/strained_muscles/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setSv(f, "active", (!truthy(rt.sv(f, "active")) ? 1 : 0));
	if (truthy(rt.sv(f, "active"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Our muscles tense and strengthen.</span>"]);
	} else {
		(rt.modField(f, live(user), "status_flags", 16777183, rt.bitAnd));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Our muscles relax.</span>"]);
		if (rt.ge(rt.sv(f, "stacks"), 10)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>We collapse in exhaustion.</span>"]);
			yield* g.callName(f, live(user), "Knockdown", [60]);
			yield* g.callName(f, live(user), "emote", ["gasp"]);
		}
	}
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/effect/proc_holder/changeling/strained_muscles/proc/muscle_loop"), live(user)]);
	return 1;
}, true);

// /obj/effect/proc_holder/changeling/strained_muscles/proc/muscle_loop  (code/game/gamemodes/changeling/powers/strained_muscles.dm:32)  may sleep
rt.def("/obj/effect/proc_holder/changeling/strained_muscles/proc/muscle_loop", function* muscle_loop(f: Frame, user: Value) {
	f.vars = () => [user];
	while (truthy(rt.sv(f, "active"))) {
		(rt.modField(f, live(user), "status_flags", 32, rt.bitOr));
		if ((!isEqual(rt.fv(f, "stat", live(user)), 0) || rt.ge(rt.fv(f, "staminaloss", live(user)), 90))) {
			rt.setSv(f, "active", (!truthy(rt.sv(f, "active")) ? 1 : 0));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Our muscles relax without the energy to strengthen them.</span>"]);
			yield* g.callName(f, live(user), "Knockdown", [40]);
			(rt.modField(f, live(user), "status_flags", 16777183, rt.bitAnd));
			break;
		}
		rt.incSrcVar(f, "stacks", 1, true);
		rt.modField(f, live(user), "staminaloss", multiply(rt.sv(f, "stacks"), 1.2999999523162842), add);
		if (isEqual(rt.sv(f, "stacks"), 11)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Our legs are really starting to hurt...</span>"]);
		}
		yield* g.call(f, P("/proc/sleep"), null, [40]);
	}
	while (!truthy(rt.sv(f, "active")) && truthy(rt.sv(f, "stacks"))) {
		rt.incSrcVar(f, "stacks", -1, true);
		yield* g.call(f, P("/proc/sleep"), null, [20]);
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon" }] });
