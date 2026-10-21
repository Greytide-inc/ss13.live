// From code/modules/ninja/suit/n_suit_verbs/ninja_stealth.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/clothing/suit/space/space_ninja/proc/toggle_stealth  (code/modules/ninja/suit/n_suit_verbs/ninja_stealth.dm:11)
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/toggle_stealth", function toggle_stealth(f: Frame) {
	let U: Value = null;
	f.vars = () => [U];
	if (!truthy((U = rt.sv(f, "affecting")))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "s_active"))) {
		rt.callSrc(f, "cancel_stealth", []);
	} else {
		if (rt.le(rt.fv(f, "charge", rt.sv(f, "cell")), 0)) {
			rt.call(f, P("/proc/to_chat"), null, [live(U), "<span class='warning'>You don't have enough power to enable Stealth!</span>"]);
			return live(f.dot);
		}
		rt.setSv(f, "s_active", (!truthy(rt.sv(f, "s_active")) ? 1 : 0));
		rt.op(f, "Animate", [2, 6], [null, live(U), "alpha", 50, "time", 15]);
		rt.callName(f, live(U), "visible_message", [fmt("<span class='warning'>＀ vanishes into thin air!</span>", [rt.fv(f, "name", live(U))]), "<span class='notice'>You are now mostly invisible to normal detection.</span>"]);
	}
	return f.dot;
});

// /obj/item/clothing/suit/space/space_ninja/proc/cancel_stealth  (code/modules/ninja/suit/n_suit_verbs/ninja_stealth.dm:27)
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/cancel_stealth", function cancel_stealth(f: Frame) {
	let U: Value = null;
	f.vars = () => [U];
	if (!truthy((U = rt.sv(f, "affecting")))) {
		return 0;
	}
	if (truthy(rt.sv(f, "s_active"))) {
		rt.setSv(f, "s_active", (!truthy(rt.sv(f, "s_active")) ? 1 : 0));
		rt.op(f, "Animate", [2, 6], [null, live(U), "alpha", 255, "time", 15]);
		rt.callName(f, live(U), "visible_message", [fmt("<span class='warning'>＀ appears from thin air!</span>", [rt.fv(f, "name", live(U))]), "<span class='notice'>You are now visible.</span>"]);
		return 1;
	}
	return 0;
});

// /obj/item/clothing/suit/space/space_ninja/proc/stealth  (code/modules/ninja/suit/n_suit_verbs/ninja_stealth.dm:40)
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/stealth", function stealth(f: Frame) {
	if (!truthy(rt.sv(f, "s_busy"))) {
		rt.callSrc(f, "toggle_stealth", []);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affecting"), "<span class='danger'>Stealth does not appear to work!</span>"]);
	}
	return f.dot;
});
