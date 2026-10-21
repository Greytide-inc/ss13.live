// From code/modules/ninja/suit/n_suit_verbs/ninja_cost_check.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/clothing/suit/space/space_ninja/proc/ninjacost  (code/modules/ninja/suit/n_suit_verbs/ninja_cost_check.dm:5)
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninjacost", function ninjacost(f: Frame, cost: Value, specificCheck: Value) {
	let H: Value = null, actualCost: Value = null;
	let $0: any;
	f.vars = () => [cost, specificCheck, H, actualCost, $0];
	if (live(cost) === null) {
		cost = 0;
	}
	if (live(specificCheck) === null) {
		specificCheck = 0;
	}
	if (((truthy(rt.gv(f, "stat", (H = rt.sv(f, "affecting")))) || truthy(rt.fv(f, "incorporeal_move", live(H)))) && !isEqual(live(specificCheck), 3))) {
		rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='danger'>You must be conscious and solid to do this.</span>"]);
		return 1;
	}
	actualCost = multiply(live(cost), 10);
	if ((truthy(live(cost)) && rt.lt(rt.fv(f, "charge", rt.sv(f, "cell")), live(actualCost)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='danger'>Not enough energy.</span>"]);
		return 1;
	} else {
		(rt.modField(f, rt.sv(f, "cell"), "charge", live(actualCost), subtract));
	}
	$0 = live(specificCheck);
	if ($0 === 1) {
		rt.callSrc(f, "cancel_stealth", []);
	} else if ($0 === 2) {
		if (!truthy(rt.sv(f, "s_bombs"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='danger'>There are no more smoke bombs remaining.</span>"]);
			return 1;
		}
	} else if ($0 === 3) {
		if (!truthy(rt.sv(f, "a_boost"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='danger'>You do not have any more adrenaline boosters.</span>"]);
			return 1;
		}
	}
	return rt.sv(f, "s_coold");
});
