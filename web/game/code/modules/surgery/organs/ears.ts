// From code/modules/surgery/organs/ears.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9516, "/obj/item/organ/ears", "/obj/item/organ", {
	deaf: 0,
	ear_damage: 0,
	bang_protect: 0,
	name: "ears",
	icon_state: "ears",
	desc: "There are three parts to the ear. Inner, middle and outer. Only one of these parts should be normally visible.",
	zone: "head",
	slot: "ears",
	gender: "plural",
});

// /obj/item/organ/ears/proc/on_life  (code/modules/surgery/organs/ears.dm:21)
rt.def("/obj/item/organ/ears/proc/on_life", function on_life(f: Frame) {
	let C: Value = null;
	let $0: any;
	f.vars = () => [C, $0];
	if (!truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.gv(f, "disabilities", (C = rt.sv(f, "owner"))), 4))) {
		rt.setSv(f, "deaf", rt.call(f, P("/proc/max"), null, [rt.sv(f, "deaf"), 1]));
	} else {
		$0 = rt.fv(f, "ears", live(C));
		if (truthy($0)) {
			if (truthy(rt.gv(f, "secondary_flags", rt.fv(f, "ears", live(C))))) {
				$0 = rt.index(rt.gv(f, "secondary_flags", rt.fv(f, "ears", live(C))), "heals_ears");
			} else {
				$0 = 0;
			}
		}
		if (truthy($0)) {
			rt.setSv(f, "deaf", rt.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "deaf"), 1), 1]));
			rt.setSv(f, "ear_damage", rt.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "ear_damage"), 0.10000000149011612), 0]));
		}
		if (!rt.lt(rt.sv(f, "ear_damage"), 100)) return f.dot;
		rt.setSv(f, "ear_damage", rt.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "ear_damage"), 0.05000000074505806), 0]));
		rt.setSv(f, "deaf", rt.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "deaf"), 1), 0]));
	}
	return f.dot;
});

// /obj/item/organ/ears/proc/restoreEars  (code/modules/surgery/organs/ears.dm:40)
rt.def("/obj/item/organ/ears/proc/restoreEars", function restoreEars(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	rt.setSv(f, "deaf", 0);
	rt.setSv(f, "ear_damage", 0);
	C = rt.sv(f, "owner");
	if (!(truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon")) ? 1 : 0)) && truthy(rt.bitAnd(rt.fv(f, "disabilities", live(C)), 4)))) return f.dot;
	rt.setSv(f, "deaf", 1);
	return f.dot;
});

// /obj/item/organ/ears/proc/adjustEarDamage  (code/modules/surgery/organs/ears.dm:46)
rt.def("/obj/item/organ/ears/proc/adjustEarDamage", function adjustEarDamage(f: Frame, ddmg: Value, ddeaf: Value) {
	rt.setSv(f, "ear_damage", rt.call(f, P("/proc/max"), null, [add(rt.sv(f, "ear_damage"), live(ddmg)), 0]));
	rt.setSv(f, "deaf", rt.call(f, P("/proc/max"), null, [add(rt.sv(f, "deaf"), live(ddeaf)), 0]));
	return f.dot;
});

// /obj/item/organ/ears/proc/minimumDeafTicks  (code/modules/surgery/organs/ears.dm:50)
rt.def("/obj/item/organ/ears/proc/minimumDeafTicks", function minimumDeafTicks(f: Frame, value: Value) {
	rt.setSv(f, "deaf", rt.call(f, P("/proc/max"), null, [rt.sv(f, "deaf"), live(value)]));
	return f.dot;
});

// /mob/living/carbon/proc/restoreEars  (code/modules/surgery/organs/ears.dm:59)
rt.def("/mob/living/carbon/proc/restoreEars", function restoreEars(f: Frame) {
	let ears: Value = null;
	f.vars = () => [ears];
	if (!truthy((ears = rt.callSrc(f, "getorgan", [T("/obj/item/organ/ears")])))) return f.dot;
	rt.callName(f, live(ears), "restoreEars", []);
	return f.dot;
});

// /mob/living/carbon/proc/adjustEarDamage  (code/modules/surgery/organs/ears.dm:66)
rt.def("/mob/living/carbon/proc/adjustEarDamage", function adjustEarDamage(f: Frame, ddmg: Value, ddeaf: Value) {
	let ears: Value = null;
	f.vars = () => [ears];
	if (!truthy((ears = rt.callSrc(f, "getorgan", [T("/obj/item/organ/ears")])))) return f.dot;
	rt.callName(f, live(ears), "adjustEarDamage", [live(ddmg), live(ddeaf)]);
	return f.dot;
});

// /mob/living/carbon/proc/minimumDeafTicks  (code/modules/surgery/organs/ears.dm:73)
rt.def("/mob/living/carbon/proc/minimumDeafTicks", function minimumDeafTicks(f: Frame, value: Value) {
	let ears: Value = null;
	f.vars = () => [ears];
	if (!truthy((ears = rt.callSrc(f, "getorgan", [T("/obj/item/organ/ears")])))) return f.dot;
	rt.callName(f, live(ears), "minimumDeafTicks", [live(value)]);
	return f.dot;
});

rt.type(9518, "/obj/item/organ/ears/cat", "/obj/item/organ/ears", {
	name: "cat ears",
	icon: rt.rsc("icons/obj/clothing/hats.dmi"),
	icon_state: "kitty",
});

// /obj/item/organ/ears/cat/proc/adjustEarDamage  (code/modules/surgery/organs/ears.dm:84)
rt.def("/obj/item/organ/ears/cat/proc/adjustEarDamage", function adjustEarDamage(f: Frame, ddmg: Value, ddeaf: Value) {
	rt.callSuper(f, [multiply(live(ddmg), 2), multiply(live(ddeaf), 2)]);
	return f.dot;
});

// /obj/item/organ/ears/cat/proc/Insert  (code/modules/surgery/organs/ears.dm:87)  may sleep
rt.def("/obj/item/organ/ears/cat/proc/Insert", function* Insert(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "color", rt.fv(f, "hair_color", live(f.args[0])));
	rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(f.args[0]))), "ears", "Cat");
	yield* g.callName(f, live(f.args[0]), "update_body", []);
	return f.dot;
}, true, { args: ["H", "special", "drop_if_replaced"] });

// /obj/item/organ/ears/cat/proc/Remove  (code/modules/surgery/organs/ears.dm:93)  may sleep
rt.def("/obj/item/organ/ears/cat/proc/Remove", function* Remove(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "color", rt.fv(f, "hair_color", live(f.args[0])));
	rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(f.args[0]))), "ears", "None");
	yield* g.callName(f, live(f.args[0]), "update_body", []);
	return f.dot;
}, true, { args: ["H", "special"] });
