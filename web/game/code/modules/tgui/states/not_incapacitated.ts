// Based on /tg/station's code/modules/tgui/states/not_incapacitated.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// not_incapacitated.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalnot_incapacitated_state", function InitGlobalnot_incapacitated_state(f: Frame) {
	GLOB.not_incapacitated_state = new_(T("/datum/ui_state/not_incapacitated_state"));
	this.gvars_datum_init_order += "not_incapacitated_state";
	return f.dot;
});

// not_incapacitated.dm:15
rt.def("/datum/controller/global_vars/proc/InitGlobalnot_incapacitated_turf_state", function InitGlobalnot_incapacitated_turf_state(f: Frame) {
	GLOB.not_incapacitated_turf_state = new_(T("/datum/ui_state/not_incapacitated_state"), { no_turfs: 1 });
	this.gvars_datum_init_order += "not_incapacitated_turf_state";
	return f.dot;
});

rt.type(4236, "/datum/ui_state/not_incapacitated_state", "/datum/ui_state", {
	turf_check: 0,
});

// not_incapacitated.dm:21
rt.def("/datum/ui_state/not_incapacitated_state/proc/New", function New(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	parent_proc();
	this.turf_check = f.args[1];
	return f.dot;
}, false, { args: ["loc", "no_turfs"] });

// not_incapacitated.dm:25
rt.def("/datum/ui_state/not_incapacitated_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	if (user.stat) {
		return UI_CLOSE;
	}
	if (user.incapacitated() || user.lying || this.turf_check && !isturf(user.loc)) {
		return UI_DISABLED;
	}
	return UI_INTERACTIVE;
});
