// From code/modules/ninja/suit/n_suit_verbs/ninja_adrenaline.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/clothing/suit/space/space_ninja/proc/ninjaboost  (code/modules/ninja/suit/n_suit_verbs/ninja_adrenaline.dm:5)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninjaboost", function* ninjaboost(f: Frame) {
	let H: Value = null, fraction: Value = null;
	f.vars = () => [H, fraction];
	if (truthy((yield* g.srcCall(f, "ninjacost", 0, 3)))) return f.dot;
	yield* g.callName(f, (H = rt.sv(f, "affecting")), "SetUnconscious", [0]);
	yield* g.callName(f, live(H), "SetStun", [0]);
	yield* g.callName(f, live(H), "SetKnockdown", [0]);
	rt.spawnTail(f, 30, "/obj/item/clothing/suit/space/space_ninja/proc/ninjaboost: spawn at modules/ninja/suit/n_suit_verbs/ninja_adrenaline.dm:11", H, fraction);
	rt.spawnTail(f, 70, "/obj/item/clothing/suit/space/space_ninja/proc/ninjaboost: spawn at modules/ninja/suit/n_suit_verbs/ninja_adrenaline.dm:13", H, fraction);
	rt.incSrcVar(f, "a_boost", -1, true);
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='notice'>There are <B>＀</B> adrenaline boosts remaining.</span>", [rt.sv(f, "a_boost")])]);
	rt.setSv(f, "s_coold", 3);
	return f.dot;
}, true);

// a spawn(70) body of /obj/item/clothing/suit/space/space_ninja/proc/ninjaboost, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/clothing/suit/space/space_ninja/proc/ninjaboost: spawn at modules/ninja/suit/n_suit_verbs/ninja_adrenaline.dm:13", function* (f: Frame, H: Value, fraction: Value) {
	f.vars = () => [H, fraction];
	if (truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
		fraction = (yield* g.call(f, P("/proc/min"), null, [divide(rt.sv(f, "a_transfer"), rt.fv(f, "total_volume", rt.sv(f, "reagents"))), 1]));
		yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(H), 5, live(fraction)]);
	}
	yield* g.callName(f, rt.sv(f, "reagents"), "trans_id_to", [live(H), "radium", rt.sv(f, "a_transfer")]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='danger'>You are beginning to feel the after-effect of the injection.</span>"]);
	return null;
});

// a spawn(30) body of /obj/item/clothing/suit/space/space_ninja/proc/ninjaboost, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/clothing/suit/space/space_ninja/proc/ninjaboost: spawn at modules/ninja/suit/n_suit_verbs/ninja_adrenaline.dm:11", function* (f: Frame, H: Value, fraction: Value) {
	f.vars = () => [H, fraction];
	yield* g.callName(f, live(H), "say", [rt.op(f, "PickUnweighted", [3], ["A CORNERED FOX IS MORE DANGEROUS THAN A JACKAL!", "HURT ME MOOORRREEE!", "IMPRESSIVE!"])]);
	return null;
});
