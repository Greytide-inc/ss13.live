// From code/modules/mob/living/carbon/alien/larva/life.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/alien/larva/proc/Life  (code/modules/mob/living/carbon/alien/larva/life.dm:9)
rt.def("/mob/living/carbon/alien/larva/proc/Life", function Life(f: Frame) {
	if (truthy(rt.sv(f, "notransform"))) {
		return live(f.dot);
	}
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) return f.dot;
	if (!rt.lt(rt.sv(f, "amount_grown"), rt.sv(f, "max_grown"))) return f.dot;
	rt.incSrcVar(f, "amount_grown", 1, true);
	rt.callSrc(f, "update_icons", []);
	return f.dot;
}, false, { waitfor: false });

// /mob/living/carbon/alien/larva/proc/update_stat  (code/modules/mob/living/carbon/alien/larva/life.dm:17)  may sleep
rt.def("/mob/living/carbon/alien/larva/proc/update_stat", function* update_stat(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return live(f.dot);
	}
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		if ((rt.le(rt.sv(f, "health"), rt.neg(rt.sv(f, "maxHealth"))) || !truthy((yield* g.srcCall(f, "getorgan", T("/obj/item/organ/brain")))))) {
			yield* g.srcCall(f, "death");
			return live(f.dot);
		}
		if (((((truthy((yield* g.srcCall(f, "IsUnconscious"))) || truthy((yield* g.srcCall(f, "IsSleeping")))) || rt.gt((yield* g.srcCall(f, "getOxyLoss")), 50)) || truthy(rt.bitAnd(rt.sv(f, "status_flags"), 8192))) || rt.le(rt.sv(f, "health"), 0))) {
			if (isEqual(rt.sv(f, "stat"), 0)) {
				rt.setSv(f, "stat", 1);
				yield* g.srcCall(f, "blind_eyes", 1);
				yield* g.srcCall(f, "update_canmove");
			}
		} else {
			if (isEqual(rt.sv(f, "stat"), 1)) {
				rt.setSv(f, "stat", 0);
				rt.setSv(f, "resting", 0);
				yield* g.srcCall(f, "adjust_blindness", -1);
				yield* g.srcCall(f, "update_canmove");
			}
		}
	}
	yield* g.srcCall(f, "update_damage_hud");
	yield* g.srcCall(f, "update_health_hud");
	return f.dot;
}, true);
