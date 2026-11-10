// Based on /tg/station's code/game/gamemodes/changeling/powers/adrenaline.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(11224, "/obj/effect/proc_holder/changeling/adrenaline", "/obj/effect/proc_holder/changeling", {
	helptext: "Removes all stuns instantly and adds a short-term reduction in further stuns. Can be used while unconscious. Continued use poisons the body.",
	chemical_cost: 30,
	dna_cost: 2,
	req_human: 1,
	req_stat: 1,
	name: "Adrenaline Sacs",
	desc: "We evolve additional sacs of adrenaline throughout our body.",
});

// adrenaline.dm:12
rt.def("/obj/effect/proc_holder/changeling/adrenaline/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let $0: any = user;
	to_chat($0, `<span class='notice'>Energy rushes through us.${user.lying ? " We arise." : ""}</span>`);
	yield* user.SetSleeping(0);
	yield* user.SetUnconscious(0);
	yield* user.SetStun(0);
	yield* user.SetKnockdown(0);
	yield* user.reagents.add_reagent("changelingAdrenaline", 10);
	yield* user.reagents.add_reagent("changelingAdrenaline2", 2);
	yield* user.adjustStaminaLoss(-75);
	return 1;
}, true);
