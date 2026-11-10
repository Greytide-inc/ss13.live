// Based on /tg/station's code/game/gamemodes/changeling/powers/shriek.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11249, "/obj/effect/proc_holder/changeling/resonant_shriek", "/obj/effect/proc_holder/changeling", {
	helptext: "Emits a high-frequency sound that confuses and deafens humans, blows out nearby lights and overloads cyborg sensors.",
	chemical_cost: 20,
	dna_cost: 1,
	req_human: 1,
	name: "Resonant Shriek",
	desc: "Our lungs and vocal chords shift, allowing us to briefly emit a noise that deafens and confuses the weak-minded.",
});

// shriek.dm:11
rt.def("/obj/effect/proc_holder/changeling/resonant_shriek/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let M: Value = null, C: Value = null, L: Value = null;
	for (M of each(get_hearers_in_view(4, user), T("/mob/living"))) {
		if (rt.istype(M, T("/mob/living/carbon"))) {
			if (!(C = M).mind || !C.mind.changeling) {
				C.adjustEarDamage(0, 30);
				C.confused += 25;
				C.Jitter(50);
			} else {
				rt.op(f, "Output", [], [C, sound(rt.rsc("sound/effects/screech.ogg"))], false);
			}
		}
		if (rt.istype(M, T("/mob/living/silicon"))) {
			rt.op(f, "Output", [], [M, sound(rt.rsc("sound/weapons/flash.ogg"))], false);
			yield* M.Knockdown(rand(100, 200));
		}
	}
	for (L of each(range(4, user), T("/obj/machinery/light"))) {
		L.on = 1;
		yield* L.break_light_tube();
	}
	return 1;
}, true);

rt.type(11250, "/obj/effect/proc_holder/changeling/dissonant_shriek", "/obj/effect/proc_holder/changeling", {
	chemical_cost: 20,
	dna_cost: 1,
	name: "Dissonant Shriek",
	desc: "We shift our vocal cords to release a high-frequency sound that overloads nearby electronics.",
});

// shriek.dm:38
rt.def("/obj/effect/proc_holder/changeling/dissonant_shriek/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let L: Value = null;
	for (L of each(range(5, f.usr), T("/obj/machinery/light"))) {
		L.on = 1;
		yield* L.break_light_tube();
	}
	yield* empulse(rt.getStep(f, user, 0), 2, 5, 1);
	return 1;
}, true);
