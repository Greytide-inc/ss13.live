// From code/modules/tgui/states/language_menu.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGloballanguage_menu_state  (code/modules/tgui/states/language_menu.dm:5)
rt.def("/datum/controller/global_vars/proc/InitGloballanguage_menu_state", function InitGloballanguage_menu_state(f: Frame) {
	rt.setGl("language_menu_state", rt.new_(f, T("/datum/ui_state/language_menu"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "language_menu_state", add);
	return f.dot;
});

rt.type(4235, "/datum/ui_state/language_menu", "/datum/ui_state", {});

// /datum/ui_state/language_menu/proc/can_use_topic  (code/modules/tgui/states/language_menu.dm:9)
rt.def("/datum/ui_state/language_menu/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	let LM: Value = null;
	f.vars = () => [LM];
	f.dot = -1;
	if (truthy(rt.call(f, P("/proc/check_rights_for"), null, [rt.fv(f, "client", live(user)), 2]))) {
		f.dot = 2;
	} else {
		if (!truthy((rt.istype(live(src_object), T("/datum/language_menu")) ? 1 : 0))) return f.dot;
		if (!isEqual(rt.callName(f, rt.gv(f, "language_holder", (LM = live(src_object))), "get_atom", []), live(user))) return f.dot;
		f.dot = 2;
	}
	return f.dot;
});
