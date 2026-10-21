// From code/modules/mob/living/brain/life.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/brain/proc/Life  (code/modules/mob/living/brain/life.dm:8)
rt.def("/mob/living/brain/proc/Life", function Life(f: Frame) {
	if (truthy(rt.sv(f, "notransform"))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "loc"))) {
		return live(f.dot);
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "handle_emp_damage", []);
	return f.dot;
}, false, { waitfor: false });

// /mob/living/brain/proc/update_stat  (code/modules/mob/living/brain/life.dm:14)  may sleep
rt.def("/mob/living/brain/proc/update_stat", function* update_stat(f: Frame) {
	let BR: Value = null;
	f.vars = () => [BR];
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return live(f.dot);
	}
	if (!rt.le(rt.sv(f, "health"), -100)) return f.dot;
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		yield* g.srcCall(f, "death");
	}
	BR = null;
	if ((truthy(rt.sv(f, "container")) && truthy(rt.fv(f, "brain", rt.sv(f, "container"))))) {
		BR = rt.fv(f, "brain", rt.sv(f, "container"));
	} else {
		if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/organ/brain")) ? 1 : 0))) {
			BR = rt.sv(f, "loc");
		}
	}
	if (!truthy(live(BR))) return f.dot;
	rt.setFv(f, "damaged_brain", live(BR), 1);
	return f.dot;
}, true);

// /mob/living/brain/proc/handle_emp_damage  (code/modules/mob/living/brain/life.dm:37)
rt.def("/mob/living/brain/proc/handle_emp_damage", function handle_emp_damage(f: Frame) {
	if (!truthy(rt.sv(f, "emp_damage"))) return f.dot;
	if (isEqual(rt.sv(f, "stat"), 2)) {
		rt.setSv(f, "emp_damage", 0);
	} else {
		rt.setSv(f, "emp_damage", rt.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "emp_damage"), 1), 0]));
	}
	return f.dot;
});
