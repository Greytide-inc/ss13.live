// Based on /tg/station's code/modules/security_levels/security_levels.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// security_levels.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalsecurity_level", function InitGlobalsecurity_level(f: Frame) {
	GLOB.security_level = 0;
	this.gvars_datum_init_order += "security_level";
	return f.dot;
});

// security_levels.dm:10
rt.def("/proc/set_security_level", function set_security_level(f: Frame, level: Value) {
	let FA: Value = null, pod: Value = null;
	let $e: any;
	if (level === "green") {
		level = SEC_LEVEL_GREEN;
	} else if (level === "blue") {
		level = SEC_LEVEL_BLUE;
	} else if (level === "red") {
		level = SEC_LEVEL_RED;
	} else if (level === "delta") {
		level = SEC_LEVEL_DELTA;
	}
	if (((level >= SEC_LEVEL_GREEN && level <= SEC_LEVEL_DELTA) && level != GLOB.security_level)) {
		if (level === SEC_LEVEL_GREEN) {
			minor_announce(GLOB.config.alert_desc_green, "Attention! Security level lowered to green:");
			if ((GLOB.SSshuttle.emergency.mode == "call" || GLOB.SSshuttle.emergency.mode == "recall")) {
				if (GLOB.security_level >= SEC_LEVEL_RED) {
					GLOB.SSshuttle.emergency.modTimer(4);
				} else {
					GLOB.SSshuttle.emergency.modTimer(2);
				}
			}
			GLOB.security_level = SEC_LEVEL_GREEN;
			for (FA of each(GLOB.machines, T("/obj/machinery/firealarm"))) {
				if (FA.z == ZLEVEL_STATION) {
					FA.update_icon();
				}
			}
		} else if (level === SEC_LEVEL_BLUE) {
			if (GLOB.security_level < SEC_LEVEL_BLUE) {
				minor_announce(GLOB.config.alert_desc_blue_upto, "Attention! Security level elevated to blue:", 1);
				if ((GLOB.SSshuttle.emergency.mode == "call" || GLOB.SSshuttle.emergency.mode == "recall")) {
					GLOB.SSshuttle.emergency.modTimer(0.5);
				}
			} else {
				minor_announce(GLOB.config.alert_desc_blue_downto, "Attention! Security level lowered to blue:");
				if ((GLOB.SSshuttle.emergency.mode == "call" || GLOB.SSshuttle.emergency.mode == "recall")) {
					GLOB.SSshuttle.emergency.modTimer(2);
				}
			}
			GLOB.security_level = SEC_LEVEL_BLUE;
			FA = null;
			for (FA of each(GLOB.machines, T("/obj/machinery/firealarm"))) {
				if (FA.z == ZLEVEL_STATION) {
					FA.update_icon();
				}
			}
		} else if (level === SEC_LEVEL_RED) {
			if (GLOB.security_level < SEC_LEVEL_RED) {
				minor_announce(GLOB.config.alert_desc_red_upto, "Attention! Code red!", 1);
				if ((GLOB.SSshuttle.emergency.mode == "call" || GLOB.SSshuttle.emergency.mode == "recall")) {
					if (GLOB.security_level == SEC_LEVEL_GREEN) {
						GLOB.SSshuttle.emergency.modTimer(0.25);
					} else {
						GLOB.SSshuttle.emergency.modTimer(0.5);
					}
				}
			} else {
				minor_announce(GLOB.config.alert_desc_red_downto, "Attention! Code red!");
			}
			GLOB.security_level = SEC_LEVEL_RED;
			FA = null;
			for (FA of each(GLOB.machines, T("/obj/machinery/firealarm"))) {
				if (FA.z == ZLEVEL_STATION) {
					FA.update_icon();
				}
			}
			for (pod of each(GLOB.machines, T("/obj/machinery/computer/shuttle/pod"))) {
				pod.admin_controlled = 0;
			}
		} else if (level === SEC_LEVEL_DELTA) {
			minor_announce(GLOB.config.alert_desc_delta, "Attention! Delta security level reached!", 1);
			if ((GLOB.SSshuttle.emergency.mode == "call" || GLOB.SSshuttle.emergency.mode == "recall")) {
				if (GLOB.security_level == SEC_LEVEL_GREEN) {
					GLOB.SSshuttle.emergency.modTimer(0.25);
				} else if (GLOB.security_level == SEC_LEVEL_BLUE) {
					GLOB.SSshuttle.emergency.modTimer(0.5);
				}
			}
			GLOB.security_level = SEC_LEVEL_DELTA;
			FA = null;
			for (FA of each(GLOB.machines, T("/obj/machinery/firealarm"))) {
				if (FA.z == ZLEVEL_STATION) {
					FA.update_icon();
				}
			}
			pod = null;
			for (pod of each(GLOB.machines, T("/obj/machinery/computer/shuttle/pod"))) {
				pod.admin_controlled = 0;
			}
		}
	} else {
		return f.dot;
	}
	return f.dot;
});

// security_levels.dm:86
rt.def("/proc/get_security_level", function get_security_level(f: Frame) {
	if (GLOB.security_level === SEC_LEVEL_GREEN) {
		return "green";
	} else if (GLOB.security_level === SEC_LEVEL_BLUE) {
		return "blue";
	} else if (GLOB.security_level === SEC_LEVEL_RED) {
		return "red";
	} else if (GLOB.security_level === SEC_LEVEL_DELTA) {
		return "delta";
	}
	return f.dot;
});

// security_levels.dm:97
rt.def("/proc/num2seclevel", function num2seclevel(f: Frame, num: Value) {
	if (num === SEC_LEVEL_GREEN) {
		return "green";
	} else if (num === SEC_LEVEL_BLUE) {
		return "blue";
	} else if (num === SEC_LEVEL_RED) {
		return "red";
	} else if (num === SEC_LEVEL_DELTA) {
		return "delta";
	}
	return f.dot;
});

// security_levels.dm:108
rt.def("/proc/seclevel2num", function seclevel2num(f: Frame, seclevel: Value) {
	const lowertext_2 = lowertext(seclevel);
	if (lowertext_2 === "green") {
		return SEC_LEVEL_GREEN;
	} else if (lowertext_2 === "blue") {
		return SEC_LEVEL_BLUE;
	} else if (lowertext_2 === "red") {
		return SEC_LEVEL_RED;
	} else if (lowertext_2 === "delta") {
		return SEC_LEVEL_DELTA;
	}
	return f.dot;
});
