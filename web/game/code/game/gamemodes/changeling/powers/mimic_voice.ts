// Based on /tg/station's code/game/gamemodes/changeling/powers/mimic_voice.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(11238, "/obj/effect/proc_holder/changeling/mimicvoice", "/obj/effect/proc_holder/changeling", {
	helptext: "Will turn your voice into the name that you enter. We must constantly expend chemicals to maintain our form like this.",
	chemical_cost: 0,
	dna_cost: 1,
	req_human: 1,
	name: "Mimic Voice",
	desc: "We shape our vocal glands to sound like a desired voice.",
});

// mimic_voice.dm:12
rt.def("/obj/effect/proc_holder/changeling/mimicvoice/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let changeling: Value = null, mimic_voice: Value = null;
	if ((changeling = user.mind.changeling).mimicing) {
		changeling.mimicing = "";
		changeling.chem_recharge_slowdown -= 0.5;
		to_chat(user, "<span class='notice'>We return our vocal glands to their original position.</span>");
		return f.dot;
	}
	if (!(mimic_voice = (yield* stripped_input(user, "Enter a name to mimic.", "Mimic Voice", null, 42)))) {
		return f.dot;
	}
	changeling.mimicing = mimic_voice;
	changeling.chem_recharge_slowdown += 0.5;
	to_chat(user, `<span class='notice'>We shape our glands to take the voice of <b>${mimic_voice}</b>, this will slow down regenerating chemicals while active.</span>`);
	to_chat(user, "<span class='notice'>Use this power again to return to our original voice and return chemical production to normal levels.</span>");
	return 1;
}, true);
