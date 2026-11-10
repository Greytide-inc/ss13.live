// Based on /tg/station's code/game/gamemodes/changeling/powers/augmented_eyesight.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11225, "/obj/effect/proc_holder/changeling/augmented_eyesight", "/obj/effect/proc_holder/changeling", {
	helptext: "Grants us thermal vision or flash protection. We will become a lot more vulnerable to flash-based devices while thermal vision is active.",
	chemical_cost: 0,
	dna_cost: 2,
	name: "Augmented Eyesight",
	desc: "Creates heat receptors in our eyes and dramatically increases light sensing ability, or protects your vision from flashes.",
	active: 0,
});

// augmented_eyesight.dm:13
rt.def("/obj/effect/proc_holder/changeling/augmented_eyesight/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let E: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (E = user.getorganslot("eye_sight")) {
		if (E.flash_protect) {
			(rt.modField(f, E, "sight_flags", 4, rt.bitOr));
			E.flash_protect = -1;
			to_chat(user, "We adjust our eyes to sense prey through walls.");
		} else {
			E.sight_flags -= 4;
			E.flash_protect = 2;
			to_chat(user, "We adjust our eyes to protect them from bright lights.");
		}
		yield* user.update_sight();
	} else {
		to_chat(user, "We can't adjust our eyes if we don't have any!");
	}
	return 1;
}, true);

// augmented_eyesight.dm:35
rt.def("/obj/effect/proc_holder/changeling/augmented_eyesight/proc/on_refund", function on_refund(f: Frame, user: Value) {
	let E: Value = null;
	if (!(E = user.getorganslot("eye_sight"))) return f.dot;
	E.sight_flags -= 4;
	return f.dot;
});
