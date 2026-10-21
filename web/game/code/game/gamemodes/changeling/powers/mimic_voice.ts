// From code/game/gamemodes/changeling/powers/mimic_voice.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11238, "/obj/effect/proc_holder/changeling/mimicvoice", "/obj/effect/proc_holder/changeling", {
	helptext: "Will turn your voice into the name that you enter. We must constantly expend chemicals to maintain our form like this.",
	chemical_cost: 0,
	dna_cost: 1,
	req_human: 1,
	name: "Mimic Voice",
	desc: "We shape our vocal glands to sound like a desired voice.",
});

// /obj/effect/proc_holder/changeling/mimicvoice/proc/sting_action  (code/game/gamemodes/changeling/powers/mimic_voice.dm:12)  may sleep
rt.def("/obj/effect/proc_holder/changeling/mimicvoice/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let changeling: Value = null, mimic_voice: Value = null;
	f.vars = () => [user, changeling, mimic_voice];
	if (truthy(rt.gv(f, "mimicing", (changeling = rt.gv(f, "changeling", rt.fv(f, "mind", live(user))))))) {
		rt.setFv(f, "mimicing", live(changeling), "");
		(rt.modField(f, live(changeling), "chem_recharge_slowdown", 0.5, subtract));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>We return our vocal glands to their original position.</span>"]);
		return live(f.dot);
	}
	if (!truthy((mimic_voice = (yield* g.call(f, P("/proc/stripped_input"), null, [live(user), "Enter a name to mimic.", "Mimic Voice", null, 42]))))) {
		return live(f.dot);
	}
	rt.setFv(f, "mimicing", live(changeling), live(mimic_voice));
	rt.modField(f, live(changeling), "chem_recharge_slowdown", 0.5, add);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>We shape our glands to take the voice of <b>＀</b>, this will slow down regenerating chemicals while active.</span>", [live(mimic_voice)])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Use this power again to return to our original voice and return chemical production to normal levels.</span>"]);
	return 1;
}, true);
