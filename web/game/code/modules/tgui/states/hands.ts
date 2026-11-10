// Based on /tg/station's code/modules/tgui/states/hands.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// hands.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalhands_state", function InitGlobalhands_state(f: Frame) {
	GLOB.hands_state = new_(T("/datum/ui_state/hands_state"));
	this.gvars_datum_init_order += "hands_state";
	return f.dot;
});

rt.type(4232, "/datum/ui_state/hands_state", "/datum/ui_state", {});

// hands.dm:10
rt.def("/datum/ui_state/hands_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	f.dot = user.shared_ui_interaction(src_object);
	if (!(f.dot > UI_CLOSE)) return f.dot;
	return min(f.dot, user.hands_can_use_topic(src_object));
});

// hands.dm:18
rt.def("/mob/living/proc/hands_can_use_topic", function hands_can_use_topic(f: Frame, src_object: Value) {
	if (this.is_holding(src_object)) {
		return UI_INTERACTIVE;
	}
	return UI_CLOSE;
});

// hands.dm:23
rt.def("/mob/living/silicon/robot/proc/hands_can_use_topic", function hands_can_use_topic(f: Frame, src_object: Value) {
	if (this.activated(src_object)) {
		return UI_INTERACTIVE;
	}
	return UI_CLOSE;
});
