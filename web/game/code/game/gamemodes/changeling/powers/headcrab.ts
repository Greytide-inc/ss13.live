// From code/game/gamemodes/changeling/powers/headcrab.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11231, "/obj/effect/proc_holder/changeling/headcrab", "/obj/effect/proc_holder/changeling", {
	helptext: "We will be placed in control of a small, fragile creature. We may attack a corpse like this to plant an egg which will slowly mature into a new form for us.",
	chemical_cost: 20,
	dna_cost: 1,
	req_human: 1,
	name: "Last Resort",
	desc: "We sacrifice our current body in a moment of need, placing us in control of a vessel.",
});

// /obj/effect/proc_holder/changeling/headcrab/proc/sting_action  (code/game/gamemodes/changeling/powers/headcrab.dm:12)  may sleep
rt.def("/obj/effect/proc_holder/changeling/headcrab/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let M: Value = null, organs: Value = null, I: Value = null, H: Value = null, S: Value = null, turf: Value = null, crab: Value = null, I_4: Value = null;
	let $e: any;
	f.vars = () => [user, M, organs, I, H, S, turf, crab, I_4, $e];
	M = rt.fv(f, "mind", live(user));
	organs = (yield* g.callName(f, live(user), "getorganszone", ["head", 1]));
	I = null;
	rt.forList(f, 0, live(organs), T("/obj/item/organ"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, live(I), "Remove", [live(user), 1]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/explosion"), null, [null, rt.getStep(f, live(user), 0), null, 0, null, 0, null, 2, null, 0, "silent", 1], rt.Args.Named);
	H = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [2, live(user)])), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='userdanger'>You are blinded by a shower of blood!</span>"]);
		yield* g.callName(f, live(H), "Stun", [20]);
		yield* g.callName(f, live(H), "blur_eyes", [20]);
		yield* g.callName(f, live(H), "adjust_eye_damage", [5]);
		rt.modField(f, live(H), "confused", 3, add);
	}
	rt.endFor(f, 0);
	S = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [2, live(user)])), T("/mob/living/silicon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		yield* g.call(f, P("/proc/to_chat"), null, [live(S), "<span class='userdanger'>Your sensors are disabled by a shower of blood!</span>"]);
		yield* g.callName(f, live(S), "Knockdown", [60]);
	}
	rt.endFor(f, 0);
	turf = rt.getStep(f, live(user), 0);
	yield* g.callName(f, live(user), "gib", []);
	f.dot = 1;
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	crab = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/headcrab"), [live(turf)]));
	I_4 = null;
	rt.forList(f, 0, live(organs), T("/obj/item/organ"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I_4 = $e;
		rt.setFv(f, "loc", live(I_4), live(crab));
	}
	rt.endFor(f, 0);
	rt.setFv(f, "origin", live(crab), live(M));
	if (!truthy(rt.fv(f, "origin", live(crab)))) return f.dot;
	rt.setFv(f, "active", rt.fv(f, "origin", live(crab)), 1);
	yield* g.callName(f, rt.fv(f, "origin", live(crab)), "transfer_to", [live(crab)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(crab), "<span class='warning'>You burst out of the remains of your former body in a shower of gore!</span>"]);
	return f.dot;
}, true, { waitfor: false });
