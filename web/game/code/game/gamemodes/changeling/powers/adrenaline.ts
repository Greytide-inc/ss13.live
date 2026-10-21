// From code/game/gamemodes/changeling/powers/adrenaline.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11224, "/obj/effect/proc_holder/changeling/adrenaline", "/obj/effect/proc_holder/changeling", {
	helptext: "Removes all stuns instantly and adds a short-term reduction in further stuns. Can be used while unconscious. Continued use poisons the body.",
	chemical_cost: 30,
	dna_cost: 2,
	req_human: 1,
	req_stat: 1,
	name: "Adrenaline Sacs",
	desc: "We evolve additional sacs of adrenaline throughout our body.",
});

// /obj/effect/proc_holder/changeling/adrenaline/proc/sting_action  (code/game/gamemodes/changeling/powers/adrenaline.dm:12)  may sleep
rt.def("/obj/effect/proc_holder/changeling/adrenaline/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [user, $0, $1];
	$0 = live(user);
	if (truthy(rt.fv(f, "lying", live(user)))) {
		$1 = " We arise.";
	} else {
		$1 = "";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>Energy rushes through us.＀</span>", [$1])]);
	yield* g.callName(f, live(user), "SetSleeping", [0]);
	yield* g.callName(f, live(user), "SetUnconscious", [0]);
	yield* g.callName(f, live(user), "SetStun", [0]);
	yield* g.callName(f, live(user), "SetKnockdown", [0]);
	yield* g.callName(f, rt.fv(f, "reagents", live(user)), "add_reagent", ["changelingAdrenaline", 10]);
	yield* g.callName(f, rt.fv(f, "reagents", live(user)), "add_reagent", ["changelingAdrenaline2", 2]);
	yield* g.callName(f, live(user), "adjustStaminaLoss", [-75]);
	return 1;
}, true);
