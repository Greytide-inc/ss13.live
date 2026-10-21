// From code/game/gamemodes/changeling/powers/augmented_eyesight.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11225, "/obj/effect/proc_holder/changeling/augmented_eyesight", "/obj/effect/proc_holder/changeling", {
	helptext: "Grants us thermal vision or flash protection. We will become a lot more vulnerable to flash-based devices while thermal vision is active.",
	chemical_cost: 0,
	dna_cost: 2,
	name: "Augmented Eyesight",
	desc: "Creates heat receptors in our eyes and dramatically increases light sensing ability, or protects your vision from flashes.",
	active: 0,
});

// /obj/effect/proc_holder/changeling/augmented_eyesight/proc/sting_action  (code/game/gamemodes/changeling/powers/augmented_eyesight.dm:13)  may sleep
rt.def("/obj/effect/proc_holder/changeling/augmented_eyesight/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let E: Value = null;
	f.vars = () => [user, E];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((E = (yield* g.callName(f, live(user), "getorganslot", ["eye_sight"]))))) {
		if (truthy(rt.fv(f, "flash_protect", live(E)))) {
			(rt.modField(f, live(E), "sight_flags", 4, rt.bitOr));
			rt.setFv(f, "flash_protect", live(E), -1);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "We adjust our eyes to sense prey through walls."]);
		} else {
			(rt.modField(f, live(E), "sight_flags", 4, subtract));
			rt.setFv(f, "flash_protect", live(E), 2);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "We adjust our eyes to protect them from bright lights."]);
		}
		yield* g.callName(f, live(user), "update_sight", []);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "We can't adjust our eyes if we don't have any!"]);
	}
	return 1;
}, true);

// /obj/effect/proc_holder/changeling/augmented_eyesight/proc/on_refund  (code/game/gamemodes/changeling/powers/augmented_eyesight.dm:35)
rt.def("/obj/effect/proc_holder/changeling/augmented_eyesight/proc/on_refund", function on_refund(f: Frame, user: Value) {
	let E: Value = null;
	f.vars = () => [E];
	if (!truthy((E = rt.callName(f, live(user), "getorganslot", ["eye_sight"])))) return f.dot;
	(rt.modField(f, live(E), "sight_flags", 4, subtract));
	return f.dot;
});
