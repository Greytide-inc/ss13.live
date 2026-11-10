// Based on /tg/station's code/modules/tgui/states/admin.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// admin.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_state", function InitGlobaladmin_state(f: Frame) {
	GLOB.admin_state = new_(T("/datum/ui_state/admin_state"));
	this.gvars_datum_init_order += "admin_state";
	return f.dot;
});

rt.type(4226, "/datum/ui_state/admin_state", "/datum/ui_state", {});

// admin.dm:10
rt.def("/datum/ui_state/admin_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	if (check_rights_for(user.client, 2)) {
		return 2;
	}
	return UI_CLOSE;
});
