// From code/modules/mob/living/carbon/monkey/inventory.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/monkey/proc/can_equip  (code/modules/mob/living/carbon/monkey/inventory.dm:2)
rt.def("/mob/living/carbon/monkey/proc/can_equip", function can_equip(f: Frame, I: Value, slot: Value, disable_warning: Value) {
	let $0: any;
	f.vars = () => [disable_warning, $0];
	if (live(disable_warning) === null) {
		disable_warning = 0;
	}
	$0 = live(slot);
	if ($0 === 4) {
		if (truthy(rt.callSrc(f, "get_empty_held_indexes", []))) {
			return 1;
		}
		return 0;
	} else if ($0 === 2) {
		if (truthy(rt.sv(f, "wear_mask"))) {
			return 0;
		}
		if (!truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 32))) {
			return 0;
		}
		return 1;
	} else if ($0 === 10) {
		if (truthy(rt.sv(f, "wear_neck"))) {
			return 0;
		}
		if (!truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 8192))) {
			return 0;
		}
		return 1;
	} else if ($0 === 11) {
		if (truthy(rt.sv(f, "head"))) {
			return 0;
		}
		if (!truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 64))) {
			return 0;
		}
		return 1;
	} else if ($0 === 1) {
		if (truthy(rt.sv(f, "back"))) {
			return 0;
		}
		if (!truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 1024))) {
			return 0;
		}
		return 1;
	}
	return 0;
});
