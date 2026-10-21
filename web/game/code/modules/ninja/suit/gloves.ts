// From code/modules/ninja/suit/gloves.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7697, "/obj/item/clothing/gloves/space_ninja", "/obj/item/clothing/gloves", {
	draining: 0,
	candrain: 0,
	mindrain: 200,
	maxdrain: 400,
	desc: "These nano-enhanced gloves insulate from electricity and provide fire resistance.",
	name: "ninja gloves",
	icon_state: "s-ninja",
	item_state: "s-ninja",
	siemens_coefficient: 0,
	cold_protection: 1536,
	min_cold_protection_temperature: 2,
	heat_protection: 1536,
	max_heat_protection_temperature: 1500,
	strip_delay: 120,
	resistance_flags: 35,
});

// /obj/item/clothing/gloves/space_ninja/proc/Touch  (code/modules/ninja/suit/gloves.dm:42)  may sleep
rt.def("/obj/item/clothing/gloves/space_ninja/proc/Touch", function* Touch(f: Frame, A: Value, proximity: Value) {
	let H: Value = null, suit: Value = null;
	f.vars = () => [A, proximity, H, suit];
	if ((!truthy(rt.sv(f, "candrain")) || truthy(rt.sv(f, "draining")))) {
		return 0;
	}
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return 0;
	}
	H = rt.sv(f, "loc");
	if (!truthy((rt.istype((suit = rt.fv(f, "wear_suit", live(H))), T("/obj/item/clothing/suit/space/space_ninja")) ? 1 : 0))) {
		return 0;
	}
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(A)])))) {
		return 0;
	}
	if (!truthy(live(proximity))) {
		return 0;
	}
	yield* g.callName(f, live(A), "add_fingerprint", [live(H)]);
	rt.setSv(f, "draining", 1);
	f.dot = (yield* g.callName(f, live(A), "ninjadrain_act", [live(suit), live(H), live(f.src)]));
	rt.setSv(f, "draining", 0);
	if (truthy((yield* g.call(f, P("/proc/isnum"), null, [live(f.dot)])))) {
		if (truthy(live(f.dot))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='notice'>Gained <B>＀</B> energy from ％！.</span>", [live(f.dot), live(A)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='danger'>＄！ has run dry of power, you must find another source!</span>", [live(A)])]);
		}
	} else {
		f.dot = 0;
	}
	return f.dot;
}, true);

// /obj/item/clothing/gloves/space_ninja/proc/toggledrain  (code/modules/ninja/suit/gloves.dm:74)
rt.def("/obj/item/clothing/gloves/space_ninja/proc/toggledrain", function toggledrain(f: Frame) {
	let U: Value = null;
	let $0: any, $1: any;
	f.vars = () => [U, $0, $1];
	$0 = (U = rt.sv(f, "loc"));
	if (truthy(rt.sv(f, "candrain"))) {
		$0 = $0;
		$1 = "disable";
	} else {
		$1 = "enable";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("You <b>＀</b> special interaction.", [$1])]);
	rt.setSv(f, "candrain", (!truthy(rt.sv(f, "candrain")) ? 1 : 0));
	return f.dot;
});

// /obj/item/clothing/gloves/space_ninja/proc/examine  (code/modules/ninja/suit/gloves.dm:79)
rt.def("/obj/item/clothing/gloves/space_ninja/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 2))) return f.dot;
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "candrain"))) {
		$1 = "active";
	} else {
		$1 = "inactive";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("The energy drain mechanism is: <B>＀</B>.", [$1])]);
	return f.dot;
}, false, { args: ["user"] });
