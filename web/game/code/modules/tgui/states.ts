// From code/modules/tgui/states.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/proc/ui_status  (code/modules/tgui/states.dm:18)
rt.def("/datum/proc/ui_status", function ui_status(f: Frame, user: Value, state: Value) {
	let src_object: Value = null, clientviewlist: Value = null, result: Value = null;
	f.vars = () => [src_object, clientviewlist, result];
	src_object = rt.callSrc(f, "ui_host", []);
	f.dot = -1;
	if (!truthy(live(state))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(user), T("/mob/dead/observer")) ? 1 : 0))) {
		if (truthy(rt.call(f, P("/proc/IsAdminGhost"), null, [live(user)]))) {
			f.dot = rt.call(f, P("/proc/max"), null, [live(f.dot), 2]);
		}
		clientviewlist = rt.call(f, P("/proc/getviewsize"), null, [rt.gv(f, "view", rt.fv(f, "client", live(user)))]);
		if (rt.lt(rt.call(f, P("/proc/get_dist"), null, [live(src_object), live(user)]), subtract(multiply(rt.call(f, P("/proc/max"), null, [rt.index(live(clientviewlist), 1), rt.index(live(clientviewlist), 2)]), 0.5), 0.5))) {
			f.dot = rt.call(f, P("/proc/max"), null, [live(f.dot), 1]);
		}
	}
	result = rt.callName(f, live(state), "can_use_topic", [live(src_object), live(user)]);
	f.dot = rt.call(f, P("/proc/max"), null, [live(f.dot), live(result)]);
	return f.dot;
});

// /mob/proc/shared_ui_interaction  (code/modules/tgui/states.dm:59)
rt.def("/mob/proc/shared_ui_interaction", function shared_ui_interaction(f: Frame, src_object: Value) {
	if (!truthy(rt.sv(f, "client"))) {
		return -1;
	} else {
		if (truthy(rt.sv(f, "stat"))) {
			return 0;
		} else {
			if ((truthy(rt.callSrc(f, "incapacitated", [])) || truthy(rt.sv(f, "lying")))) {
				return 1;
			}
		}
	}
	return 2;
});

// /mob/living/silicon/ai/proc/shared_ui_interaction  (code/modules/tgui/states.dm:68)
rt.def("/mob/living/silicon/ai/proc/shared_ui_interaction", function shared_ui_interaction(f: Frame) {
	if (truthy(rt.callSrc(f, "lacks_power", []))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["src_object"] });

// /mob/living/silicon/robot/proc/shared_ui_interaction  (code/modules/tgui/states.dm:73)
rt.def("/mob/living/silicon/robot/proc/shared_ui_interaction", function shared_ui_interaction(f: Frame) {
	if ((rt.le(rt.fv(f, "charge", rt.sv(f, "cell")), 0) || truthy(rt.sv(f, "lockcharge")))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["src_object"] });

// /atom/proc/contents_ui_distance  (code/modules/tgui/states.dm:90)
rt.def("/atom/proc/contents_ui_distance", function contents_ui_distance(f: Frame, src_object: Value, user: Value) {
	return rt.callName(f, live(user), "shared_living_ui_distance", [live(src_object)]);
});

// /mob/living/proc/shared_living_ui_distance  (code/modules/tgui/states.dm:102)
rt.def("/mob/living/proc/shared_living_ui_distance", function shared_living_ui_distance(f: Frame, src_object: Value) {
	let dist: Value = null;
	f.vars = () => [dist];
	if (!truthy((rt.isIn(f, live(src_object), rt.call(f, P("/proc/view"), null, [live(f.src)])) ? 1 : 0))) {
		return -1;
	}
	if (rt.le((dist = rt.call(f, P("/proc/get_dist"), null, [live(src_object), live(f.src)])), 1)) {
		return 2;
	} else {
		if (rt.le(live(dist), 2)) {
			return 1;
		} else {
			if (rt.le(live(dist), 5)) {
				return 0;
			}
		}
	}
	return -1;
});

// /mob/living/carbon/human/proc/shared_living_ui_distance  (code/modules/tgui/states.dm:115)
rt.def("/mob/living/carbon/human/proc/shared_living_ui_distance", function shared_living_ui_distance(f: Frame) {
	if ((truthy(rt.callName(f, rt.sv(f, "dna"), "check_mutation", ["Telekinesis"])) && truthy(rt.call(f, P("/proc/tkMaxRangeCheck"), null, [live(f.src), live(f.args[0])])))) {
		return 2;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["src_object"] });
