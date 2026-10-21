// From code/modules/mob/living/carbon/alien/larva/update_icons.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/alien/larva/proc/regenerate_icons  (code/modules/mob/living/carbon/alien/larva/update_icons.dm:3)
rt.def("/mob/living/carbon/alien/larva/proc/regenerate_icons", function regenerate_icons(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	rt.callSrc(f, "update_icons", []);
	return f.dot;
});

// /mob/living/carbon/alien/larva/proc/update_icons  (code/modules/mob/living/carbon/alien/larva/update_icons.dm:8)
rt.def("/mob/living/carbon/alien/larva/proc/update_icons", function update_icons(f: Frame) {
	let state: Value = null;
	f.vars = () => [state];
	state = 0;
	if (rt.gt(rt.sv(f, "amount_grown"), 80)) {
		state = 2;
	} else {
		if (rt.gt(rt.sv(f, "amount_grown"), 50)) {
			state = 1;
		}
	}
	if (isEqual(rt.sv(f, "stat"), 2)) {
		rt.setSv(f, "icon_state", fmt("larva＀_dead", [live(state)]));
	} else {
		if ((truthy(rt.sv(f, "handcuffed")) || truthy(rt.sv(f, "legcuffed")))) {
			rt.setSv(f, "icon_state", fmt("larva＀_cuff", [live(state)]));
		} else {
			if (((isEqual(rt.sv(f, "stat"), 1) || truthy(rt.sv(f, "lying"))) || truthy(rt.sv(f, "resting")))) {
				rt.setSv(f, "icon_state", fmt("larva＀_sleep", [live(state)]));
			} else {
				if (truthy(rt.callSrc(f, "IsStun", []))) {
					rt.setSv(f, "icon_state", fmt("larva＀_stun", [live(state)]));
				} else {
					rt.setSv(f, "icon_state", fmt("larva＀", [live(state)]));
				}
			}
		}
	}
	return f.dot;
});

// /mob/living/carbon/alien/larva/proc/update_transform  (code/modules/mob/living/carbon/alien/larva/update_icons.dm:25)
rt.def("/mob/living/carbon/alien/larva/proc/update_transform", function update_transform(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	return rt.callSrc(f, "update_icons", []);
});

// /mob/living/carbon/alien/larva/proc/update_inv_handcuffed  (code/modules/mob/living/carbon/alien/larva/update_icons.dm:29)
rt.def("/mob/living/carbon/alien/larva/proc/update_inv_handcuffed", function update_inv_handcuffed(f: Frame) {
	rt.callSrc(f, "update_icons", []);
	return f.dot;
});
