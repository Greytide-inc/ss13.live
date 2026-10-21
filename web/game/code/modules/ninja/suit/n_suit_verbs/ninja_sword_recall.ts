// From code/modules/ninja/suit/n_suit_verbs/ninja_sword_recall.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/clothing/suit/space/space_ninja/proc/ninja_sword_recall  (code/modules/ninja/suit/n_suit_verbs/ninja_sword_recall.dm:3)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninja_sword_recall", function* ninja_sword_recall(f: Frame) {
	let H: Value = null, cost: Value = null, inview: Value = null, distance: Value = null, C: Value = null;
	f.vars = () => [H, cost, inview, distance, C];
	H = rt.sv(f, "affecting");
	cost = 0;
	inview = 1;
	if (!truthy(rt.sv(f, "energyKatana"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>Could not locate Energy Katana!</span>"]);
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, rt.sv(f, "energyKatana"), live(H)) ? 1 : 0))) {
		return live(f.dot);
	}
	distance = (yield* g.call(f, P("/proc/get_dist"), null, [live(H), rt.sv(f, "energyKatana")]));
	if (!truthy((rt.isIn(f, rt.sv(f, "energyKatana"), (yield* g.call(f, P("/proc/view"), null, [live(H)]))) ? 1 : 0))) {
		cost = live(distance);
		inview = 0;
	}
	if (truthy((yield* g.srcCall(f, "ninjacost", live(cost))))) return f.dot;
	if (truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "energyKatana")), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, (C = rt.fv(f, "loc", rt.sv(f, "energyKatana"))), "transferItemToLoc", [rt.sv(f, "energyKatana"), rt.getStep(f, rt.sv(f, "energyKatana"), 0), 1]);
		if (truthy((rt.isIn(f, rt.sv(f, "energyKatana"), rt.fv(f, "stomach_contents", live(C))) ? 1 : 0))) {
			(rt.modField(f, live(C), "stomach_contents", rt.sv(f, "energyKatana"), subtract));
		}
	} else {
		yield* g.callName(f, rt.sv(f, "energyKatana"), "forceMove", [rt.getStep(f, rt.sv(f, "energyKatana"), 0)]);
	}
	if (truthy(live(inview))) {
		yield* g.callName(f, rt.fv(f, "spark_system", rt.sv(f, "energyKatana")), "start", []);
		yield* g.call(f, P("/proc/playsound"), null, [live(H), "sparks", 50, 1]);
		yield* g.callName(f, live(H), "visible_message", [fmt("<span class='danger'>％！ flies towards ＀!</span>", [rt.sv(f, "energyKatana"), live(H)]), fmt("<span class='warning'>You hold out your hand and ％！ flies towards you!</span>", [rt.sv(f, "energyKatana")])]);
		yield* g.callName(f, rt.sv(f, "energyKatana"), "throw_at", [live(H), add(live(distance), 1), rt.fv(f, "throw_speed", rt.sv(f, "energyKatana")), live(H)]);
	} else {
		yield* g.callName(f, rt.sv(f, "energyKatana"), "returnToOwner", [live(H), 1]);
	}
	return f.dot;
}, true);
