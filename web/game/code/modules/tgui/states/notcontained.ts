// Based on /tg/station's code/modules/tgui/states/notcontained.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// notcontained.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalnotcontained_state", function InitGlobalnotcontained_state(f: Frame) {
	GLOB.notcontained_state = new_(T("/datum/ui_state/notcontained_state"));
	this.gvars_datum_init_order += "notcontained_state";
	return f.dot;
});

rt.type(4237, "/datum/ui_state/notcontained_state", "/datum/ui_state", {});

// notcontained.dm:10
rt.def("/datum/ui_state/notcontained_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	f.dot = user.shared_ui_interaction(src_object);
	if (!(f.dot > UI_CLOSE)) return f.dot;
	return min(f.dot, user.notcontained_can_use_topic(src_object));
});

// notcontained.dm:18
rt.def("/mob/living/proc/notcontained_can_use_topic", function notcontained_can_use_topic(f: Frame, src_object: Value) {
	if (src_object.contains(this)) {
		return UI_CLOSE;
	}
	return this.default_can_use_topic(src_object);
});

// notcontained.dm:23
rt.def("/mob/living/silicon/proc/notcontained_can_use_topic", function notcontained_can_use_topic(f: Frame, src_object: Value) {
	return this.default_can_use_topic(src_object);
});

// notcontained.dm:26
rt.def("/mob/living/simple_animal/drone/proc/notcontained_can_use_topic", function notcontained_can_use_topic(f: Frame, src_object: Value) {
	return this.default_can_use_topic(src_object);
});
