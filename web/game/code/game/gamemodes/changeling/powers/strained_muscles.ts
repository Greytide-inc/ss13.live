// Based on /tg/station's code/game/gamemodes/changeling/powers/strained_muscles.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { P } = rt;


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

// strained_muscles.dm:15
rt.def("/obj/effect/proc_holder/changeling/strained_muscles/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	this.active = (!this.active ? 1 : 0);
	if (this.active) {
		to_chat(user, "<span class='notice'>Our muscles tense and strengthen.</span>");
	} else {
		(rt.modField(f, user, "status_flags", 16777183, rt.bitAnd));
		to_chat(user, "<span class='notice'>Our muscles relax.</span>");
		if (this.stacks >= 10) {
			to_chat(user, "<span class='danger'>We collapse in exhaustion.</span>");
			yield* user.Knockdown(60);
			yield* user.emote("gasp");
		}
	}
	yield* ImmediateInvokeAsync(this, P("/obj/effect/proc_holder/changeling/strained_muscles/proc/muscle_loop"), user);
	return 1;
}, true);

// strained_muscles.dm:32
rt.def("/obj/effect/proc_holder/changeling/strained_muscles/proc/muscle_loop", function* muscle_loop(f: Frame, user: Value) {
	while (this.active) {
		(rt.modField(f, user, "status_flags", 32, rt.bitOr));
		if (user.stat != 0 || user.staminaloss >= 90) {
			this.active = (!this.active ? 1 : 0);
			to_chat(user, "<span class='notice'>Our muscles relax without the energy to strengthen them.</span>");
			yield* user.Knockdown(40);
			(rt.modField(f, user, "status_flags", 16777183, rt.bitAnd));
			break;
		}
		this.stacks++;
		user.staminaloss += this.stacks * 1.3;
		if (this.stacks == 11) {
			to_chat(user, "<span class='warning'>Our legs are really starting to hurt...</span>");
		}
		yield* sleep(40);
	}
	while (!this.active && this.stacks) {
		this.stacks--;
		yield* sleep(20);
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon" }] });
