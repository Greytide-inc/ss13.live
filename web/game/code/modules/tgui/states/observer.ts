// Based on /tg/station's code/modules/tgui/states/observer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// observer.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalobserver_state", function InitGlobalobserver_state(f: Frame) {
	GLOB.observer_state = new_(T("/datum/ui_state/observer_state"));
	this.gvars_datum_init_order += "observer_state";
	return f.dot;
});

rt.type(4238, "/datum/ui_state/observer_state", "/datum/ui_state", {});

// observer.dm:10
rt.def("/datum/ui_state/observer_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	if (rt.istype(user, T("/mob/dead/observer"))) {
		return UI_INTERACTIVE;
	}
	return UI_CLOSE;
});
