// Based on /tg/station's code/modules/tgui/states/zlevel.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// zlevel.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalz_state", function InitGlobalz_state(f: Frame) {
	GLOB.z_state = new_(T("/datum/ui_state/z_state"));
	this.gvars_datum_init_order += "z_state";
	return f.dot;
});

rt.type(4241, "/datum/ui_state/z_state", "/datum/ui_state", {});

// zlevel.dm:10
rt.def("/datum/ui_state/z_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	let turf_obj: Value = rt.getStep(f, src_object, 0);
	let turf_usr: Value = rt.getStep(f, user, 0);
	if (turf_obj && turf_usr && turf_obj.z == turf_usr.z) {
		return UI_INTERACTIVE;
	}
	return UI_CLOSE;
});
