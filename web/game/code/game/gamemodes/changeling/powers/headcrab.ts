// Based on /tg/station's code/game/gamemodes/changeling/powers/headcrab.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11231, "/obj/effect/proc_holder/changeling/headcrab", "/obj/effect/proc_holder/changeling", {
	helptext: "We will be placed in control of a small, fragile creature. We may attack a corpse like this to plant an egg which will slowly mature into a new form for us.",
	chemical_cost: 20,
	dna_cost: 1,
	req_human: 1,
	name: "Last Resort",
	desc: "We sacrifice our current body in a moment of need, placing us in control of a vessel.",
});

// headcrab.dm:12
rt.def("/obj/effect/proc_holder/changeling/headcrab/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let I: Value = null, H: Value = null, S: Value = null, I_4: Value = null;
	let M: Value = user.mind;
	let organs: Value = user.getorganszone("head", 1);
	for (I of each(organs, T("/obj/item/organ"))) {
		yield* I.Remove(user, 1);
	}
	yield* explosion(rt.getStep(f, user, 0), 0, 0, 2, 0, { silent: 1 });
	for (H of each(range(2, user), T("/mob/living/carbon/human"))) {
		to_chat(H, "<span class='userdanger'>You are blinded by a shower of blood!</span>");
		yield* H.Stun(20);
		yield* H.blur_eyes(20);
		yield* H.adjust_eye_damage(5);
		H.confused += 3;
	}
	for (S of each(range(2, user), T("/mob/living/silicon"))) {
		to_chat(S, "<span class='userdanger'>Your sensors are disabled by a shower of blood!</span>");
		yield* S.Knockdown(60);
	}
	let turf: Value = rt.getStep(f, user, 0);
	yield* user.gib();
	f.dot = 1;
	yield* sleep(5);
	let crab: Value = (yield* new_(T("/mob/living/simple_animal/hostile/headcrab"), turf));
	for (I_4 of each(organs, T("/obj/item/organ"))) {
		I_4.loc = crab;
	}
	crab.origin = M;
	if (!crab.origin) return f.dot;
	crab.origin.active = 1;
	yield* crab.origin.transfer_to(crab);
	to_chat(crab, "<span class='warning'>You burst out of the remains of your former body in a shower of gore!</span>");
	return f.dot;
}, true, { waitfor: false });
