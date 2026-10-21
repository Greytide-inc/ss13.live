// From code/modules/mob/living/carbon/alien/humanoid/update_icons.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/alien/humanoid/proc/update_icons  (code/modules/mob/living/carbon/alien/humanoid/update_icons.dm:3)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/proc/update_icons", function* update_icons(f: Frame) {
	let I: Value = null, asleep: Value = null, old_icon: Value = null;
	let $e: any;
	f.vars = () => [I, asleep, old_icon, $e];
	yield* g.srcCall(f, "cut_overlays");
	I = null;
	rt.forList(f, 0, rt.sv(f, "overlays_standing"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.srcCall(f, "add_overlay", live(I));
	}
	rt.endFor(f, 0);
	asleep = (yield* g.srcCall(f, "IsSleeping"));
	if (isEqual(rt.sv(f, "stat"), 2)) {
		if (rt.gt(rt.sv(f, "fireloss"), 125)) {
			rt.setSv(f, "icon_state", fmt("alien＀_husked", [rt.sv(f, "caste")]));
		} else {
			rt.setSv(f, "icon_state", fmt("alien＀_dead", [rt.sv(f, "caste")]));
		}
	} else {
		if (((isEqual(rt.sv(f, "stat"), 1) && !truthy(live(asleep))) || truthy((yield* g.srcCall(f, "IsKnockdown"))))) {
			rt.setSv(f, "icon_state", fmt("alien＀_unconscious", [rt.sv(f, "caste")]));
		} else {
			if (truthy(rt.sv(f, "leap_on_click"))) {
				rt.setSv(f, "icon_state", fmt("alien＀_pounce", [rt.sv(f, "caste")]));
			} else {
				if (((truthy(rt.sv(f, "lying")) || truthy(rt.sv(f, "resting"))) || truthy(live(asleep)))) {
					rt.setSv(f, "icon_state", fmt("alien＀_sleep", [rt.sv(f, "caste")]));
				} else {
					if (isEqual(rt.sv(f, "mob_size"), 3)) {
						rt.setSv(f, "icon_state", fmt("alien＀", [rt.sv(f, "caste")]));
						if (truthy(rt.sv(f, "drooling"))) {
							yield* g.srcCall(f, "add_overlay", fmt("alienspit_＀", [rt.sv(f, "caste")]));
						}
					} else {
						rt.setSv(f, "icon_state", fmt("alien＀", [rt.sv(f, "caste")]));
						if (truthy(rt.sv(f, "drooling"))) {
							yield* g.srcCall(f, "add_overlay", "alienspit");
						}
					}
				}
			}
		}
	}
	if (truthy(rt.sv(f, "leaping"))) {
		if (isEqual(rt.sv(f, "alt_icon"), rt.initial(f, live(f.src), "alt_icon"))) {
			old_icon = rt.sv(f, "icon");
			rt.setSv(f, "icon", rt.sv(f, "alt_icon"));
			rt.setSv(f, "alt_icon", live(old_icon));
		}
		rt.setSv(f, "icon_state", fmt("alien＀_leap", [rt.sv(f, "caste")]));
		rt.setSv(f, "pixel_x", -32);
		rt.setSv(f, "pixel_y", -32);
	} else {
		if (!isEqual(rt.sv(f, "alt_icon"), rt.initial(f, live(f.src), "alt_icon"))) {
			old_icon = rt.sv(f, "icon");
			rt.setSv(f, "icon", rt.sv(f, "alt_icon"));
			rt.setSv(f, "alt_icon", live(old_icon));
		}
		rt.setSv(f, "pixel_x", (yield* g.srcCall(f, "get_standard_pixel_x_offset", rt.sv(f, "lying"))));
		rt.setSv(f, "pixel_y", (yield* g.srcCall(f, "get_standard_pixel_y_offset", rt.sv(f, "lying"))));
	}
	yield* g.srcCall(f, "update_inv_hands");
	yield* g.srcCall(f, "update_inv_handcuffed");
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/proc/regenerate_icons  (code/modules/mob/living/carbon/alien/humanoid/update_icons.dm:50)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/proc/regenerate_icons", function* regenerate_icons(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	yield* g.srcCall(f, "update_transform");
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/proc/update_transform  (code/modules/mob/living/carbon/alien/humanoid/update_icons.dm:55)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/proc/update_transform", function* update_transform(f: Frame) {
	if (rt.gt(rt.sv(f, "lying"), 0)) {
		rt.setSv(f, "lying", 90);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icons");
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/proc/update_inv_handcuffed  (code/modules/mob/living/carbon/alien/humanoid/update_icons.dm:61)
rt.def("/mob/living/carbon/alien/humanoid/proc/update_inv_handcuffed", function update_inv_handcuffed(f: Frame) {
	let cuff_icon: Value = null, dmi_file: Value = null;
	f.vars = () => [cuff_icon, dmi_file];
	rt.callSrc(f, "remove_overlay", [5]);
	cuff_icon = "aliencuff";
	dmi_file = rt.rsc("icons/mob/alien.dmi");
	if (isEqual(rt.sv(f, "mob_size"), 3)) {
		cuff_icon = fmt("aliencuff_＀", [rt.sv(f, "caste")]);
		dmi_file = rt.rsc("icons/mob/alienqueen.dmi");
	}
	if (!truthy(rt.sv(f, "handcuffed"))) return f.dot;
	rt.setAt(rt.sv(f, "overlays_standing"), 5, rt.call(f, P("/proc/mutable_appearance"), null, [live(dmi_file), live(cuff_icon), -5]));
	rt.callSrc(f, "apply_overlay", [5]);
	return f.dot;
});

// /mob/living/carbon/alien/humanoid/royal/proc/update_inv_hands  (code/modules/mob/living/carbon/alien/humanoid/update_icons.dm:75)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/royal/proc/update_inv_hands", function* update_inv_hands(f: Frame) {
	let hands: Value = null, l_hand: Value = null, itm_state: Value = null, r_hand: Value = null, itm_state_3: Value = null;
	f.vars = () => [hands, l_hand, itm_state, r_hand, itm_state_3];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "remove_overlay", 3);
	hands = rt.list();
	if (truthy((l_hand = (yield* g.srcCall(f, "get_item_for_held_index", 1))))) {
		if (!truthy((itm_state = rt.fv(f, "item_state", live(l_hand))))) {
			itm_state = rt.fv(f, "icon_state", live(l_hand));
		}
		hands = rt.modify(live(hands), (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "alt_inhands_file"), fmt("＀＀_l", [live(itm_state), rt.sv(f, "caste")]), -3])), add);
	}
	if (truthy((r_hand = (yield* g.srcCall(f, "get_item_for_held_index", 2))))) {
		if (!truthy((itm_state_3 = rt.fv(f, "item_state", live(r_hand))))) {
			itm_state_3 = rt.fv(f, "icon_state", live(r_hand));
		}
		hands = rt.modify(live(hands), (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "alt_inhands_file"), fmt("＀＀_r", [live(itm_state_3), rt.sv(f, "caste")]), -3])), add);
	}
	rt.setAt(rt.sv(f, "overlays_standing"), 3, live(hands));
	yield* g.srcCall(f, "apply_overlay", 3);
	return f.dot;
}, true);
