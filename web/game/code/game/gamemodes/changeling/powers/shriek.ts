// From code/game/gamemodes/changeling/powers/shriek.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11249, "/obj/effect/proc_holder/changeling/resonant_shriek", "/obj/effect/proc_holder/changeling", {
	helptext: "Emits a high-frequency sound that confuses and deafens humans, blows out nearby lights and overloads cyborg sensors.",
	chemical_cost: 20,
	dna_cost: 1,
	req_human: 1,
	name: "Resonant Shriek",
	desc: "Our lungs and vocal chords shift, allowing us to briefly emit a noise that deafens and confuses the weak-minded.",
});

// /obj/effect/proc_holder/changeling/resonant_shriek/proc/sting_action  (code/game/gamemodes/changeling/powers/shriek.dm:11)  may sleep
rt.def("/obj/effect/proc_holder/changeling/resonant_shriek/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let M: Value = null, C: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [user, M, C, L, $e];
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/get_hearers_in_view"), null, [4, live(user)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
			if ((!truthy(rt.gv(f, "mind", (C = live(M)))) || !truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(C)))))) {
				yield* g.callName(f, live(C), "adjustEarDamage", [0, 30]);
				rt.modField(f, live(C), "confused", 25, add);
				yield* g.callName(f, live(C), "Jitter", [50]);
			} else {
				rt.op(f, "Output", [], [live(C), (yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/effects/screech.ogg")]))], false);
			}
		}
		if (truthy((rt.istype(live(M), T("/mob/living/silicon")) ? 1 : 0))) {
			rt.op(f, "Output", [], [live(M), (yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/weapons/flash.ogg")]))], false);
			yield* g.callName(f, live(M), "Knockdown", [(yield* g.call(f, P("/proc/rand"), null, [100, 200]))]);
		}
	}
	rt.endFor(f, 0);
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [4, live(user)])), T("/obj/machinery/light"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		rt.setFv(f, "on", live(L), 1);
		yield* g.callName(f, live(L), "break_light_tube", []);
	}
	rt.endFor(f, 0);
	return 1;
}, true);

rt.type(11250, "/obj/effect/proc_holder/changeling/dissonant_shriek", "/obj/effect/proc_holder/changeling", {
	chemical_cost: 20,
	dna_cost: 1,
	name: "Dissonant Shriek",
	desc: "We shift our vocal cords to release a high-frequency sound that overloads nearby electronics.",
});

// /obj/effect/proc_holder/changeling/dissonant_shriek/proc/sting_action  (code/game/gamemodes/changeling/powers/shriek.dm:38)  may sleep
rt.def("/obj/effect/proc_holder/changeling/dissonant_shriek/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [user, L, $e];
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [5, live(f.usr)])), T("/obj/machinery/light"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		rt.setFv(f, "on", live(L), 1);
		yield* g.callName(f, live(L), "break_light_tube", []);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/empulse"), null, [rt.getStep(f, live(user), 0), 2, 5, 1]);
	return 1;
}, true);
