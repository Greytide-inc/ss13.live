// Based on /tg/station's code/modules/tgui/states/language_menu.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// language_menu.dm:5
rt.def("/datum/controller/global_vars/proc/InitGloballanguage_menu_state", function InitGloballanguage_menu_state(f: Frame) {
	GLOB.language_menu_state = new_(T("/datum/ui_state/language_menu"));
	this.gvars_datum_init_order += "language_menu_state";
	return f.dot;
});

rt.type(4235, "/datum/ui_state/language_menu", "/datum/ui_state", {});

// language_menu.dm:9
rt.def("/datum/ui_state/language_menu/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	let LM: Value = null;
	f.dot = UI_CLOSE;
	if (check_rights_for(user.client, 2)) {
		f.dot = 2;
	} else {
		if (!rt.istype(src_object, T("/datum/language_menu"))) return f.dot;
		if ((LM = src_object).language_holder.get_atom() != user) return f.dot;
		f.dot = 2;
	}
	return f.dot;
});
