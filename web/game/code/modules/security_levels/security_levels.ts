// From code/modules/security_levels/security_levels.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalsecurity_level  (code/modules/security_levels/security_levels.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalsecurity_level", function InitGlobalsecurity_level(f: Frame) {
	rt.setGl("security_level", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "security_level", add);
	return f.dot;
});

// /proc/set_security_level  (code/modules/security_levels/security_levels.dm:10)
rt.def("/proc/set_security_level", function set_security_level(f: Frame, level: Value) {
	let FA: Value = null, pod: Value = null;
	let $0: any, $e: any;
	f.vars = () => [level, FA, pod, $0, $e];
	$0 = live(level);
	if ($0 === "green") {
		level = 0;
	} else if ($0 === "blue") {
		level = 1;
	} else if ($0 === "red") {
		level = 2;
	} else if ($0 === "delta") {
		level = 3;
	}
	if (((rt.ge(live(level), 0) && rt.le(live(level), 3)) && !isEqual(live(level), rt.gl("security_level")))) {
		$0 = live(level);
		if ($0 === 0) {
			rt.call(f, P("/proc/minor_announce"), null, [rt.fv(f, "alert_desc_green", rt.gl("config")), "Attention! Security level lowered to green:"]);
			if ((isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "call") || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "recall"))) {
				if (rt.ge(rt.gl("security_level"), 2)) {
					rt.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "modTimer", [4]);
				} else {
					rt.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "modTimer", [2]);
				}
			}
			rt.setGl("security_level", 0);
			FA = null;
			rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/firealarm"));
			while (($e = rt.next(f, 0)) !== undefined) {
				FA = $e;
				if (isEqual(rt.fv(f, "z", live(FA)), 2)) {
					rt.callName(f, live(FA), "update_icon", []);
				}
			}
			rt.endFor(f, 0);
		} else if ($0 === 1) {
			if (rt.lt(rt.gl("security_level"), 1)) {
				rt.call(f, P("/proc/minor_announce"), null, [rt.fv(f, "alert_desc_blue_upto", rt.gl("config")), "Attention! Security level elevated to blue:", 1]);
				if ((isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "call") || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "recall"))) {
					rt.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "modTimer", [0.5]);
				}
			} else {
				rt.call(f, P("/proc/minor_announce"), null, [rt.fv(f, "alert_desc_blue_downto", rt.gl("config")), "Attention! Security level lowered to blue:"]);
				if ((isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "call") || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "recall"))) {
					rt.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "modTimer", [2]);
				}
			}
			rt.setGl("security_level", 1);
			FA = null;
			rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/firealarm"));
			while (($e = rt.next(f, 0)) !== undefined) {
				FA = $e;
				if (isEqual(rt.fv(f, "z", live(FA)), 2)) {
					rt.callName(f, live(FA), "update_icon", []);
				}
			}
			rt.endFor(f, 0);
		} else if ($0 === 2) {
			if (rt.lt(rt.gl("security_level"), 2)) {
				rt.call(f, P("/proc/minor_announce"), null, [rt.fv(f, "alert_desc_red_upto", rt.gl("config")), "Attention! Code red!", 1]);
				if ((isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "call") || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "recall"))) {
					if (isEqual(rt.gl("security_level"), 0)) {
						rt.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "modTimer", [0.25]);
					} else {
						rt.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "modTimer", [0.5]);
					}
				}
			} else {
				rt.call(f, P("/proc/minor_announce"), null, [rt.fv(f, "alert_desc_red_downto", rt.gl("config")), "Attention! Code red!"]);
			}
			rt.setGl("security_level", 2);
			FA = null;
			rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/firealarm"));
			while (($e = rt.next(f, 0)) !== undefined) {
				FA = $e;
				if (isEqual(rt.fv(f, "z", live(FA)), 2)) {
					rt.callName(f, live(FA), "update_icon", []);
				}
			}
			rt.endFor(f, 0);
			pod = null;
			rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/shuttle/pod"));
			while (($e = rt.next(f, 0)) !== undefined) {
				pod = $e;
				rt.setFv(f, "admin_controlled", live(pod), 0);
			}
			rt.endFor(f, 0);
		} else if ($0 === 3) {
			rt.call(f, P("/proc/minor_announce"), null, [rt.fv(f, "alert_desc_delta", rt.gl("config")), "Attention! Delta security level reached!", 1]);
			if ((isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "call") || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "recall"))) {
				if (isEqual(rt.gl("security_level"), 0)) {
					rt.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "modTimer", [0.25]);
				} else {
					if (isEqual(rt.gl("security_level"), 1)) {
						rt.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "modTimer", [0.5]);
					}
				}
			}
			rt.setGl("security_level", 3);
			FA = null;
			rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/firealarm"));
			while (($e = rt.next(f, 0)) !== undefined) {
				FA = $e;
				if (isEqual(rt.fv(f, "z", live(FA)), 2)) {
					rt.callName(f, live(FA), "update_icon", []);
				}
			}
			rt.endFor(f, 0);
			pod = null;
			rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/shuttle/pod"));
			while (($e = rt.next(f, 0)) !== undefined) {
				pod = $e;
				rt.setFv(f, "admin_controlled", live(pod), 0);
			}
			rt.endFor(f, 0);
		}
	} else {
		return live(f.dot);
	}
	return f.dot;
});

// /proc/get_security_level  (code/modules/security_levels/security_levels.dm:86)
rt.def("/proc/get_security_level", function get_security_level(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.gl("security_level");
	if ($0 === 0) {
		return "green";
	} else if ($0 === 1) {
		return "blue";
	} else if ($0 === 2) {
		return "red";
	} else if ($0 === 3) {
		return "delta";
	}
	return f.dot;
});

// /proc/num2seclevel  (code/modules/security_levels/security_levels.dm:97)
rt.def("/proc/num2seclevel", function num2seclevel(f: Frame, num: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(num);
	if ($0 === 0) {
		return "green";
	} else if ($0 === 1) {
		return "blue";
	} else if ($0 === 2) {
		return "red";
	} else if ($0 === 3) {
		return "delta";
	}
	return f.dot;
});

// /proc/seclevel2num  (code/modules/security_levels/security_levels.dm:108)
rt.def("/proc/seclevel2num", function seclevel2num(f: Frame, seclevel: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.call(f, P("/proc/lowertext"), null, [live(seclevel)]);
	if ($0 === "green") {
		return 0;
	} else if ($0 === "blue") {
		return 1;
	} else if ($0 === "red") {
		return 2;
	} else if ($0 === "delta") {
		return 3;
	}
	return f.dot;
});
