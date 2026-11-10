// Based on /tg/station's code/modules/tgui/states/physical.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// physical.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalphysical_state", function InitGlobalphysical_state(f: Frame) {
	GLOB.physical_state = new_(T("/datum/ui_state/physical"));
	this.gvars_datum_init_order += "physical_state";
	return f.dot;
});

rt.type(4239, "/datum/ui_state/physical", "/datum/ui_state", {});

// physical.dm:10
rt.def("/datum/ui_state/physical/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	f.dot = user.shared_ui_interaction(src_object);
	if (!(f.dot > UI_CLOSE)) return f.dot;
	return min(f.dot, user.physical_can_use_topic(src_object));
});

// physical.dm:18
rt.def("/mob/living/proc/physical_can_use_topic", function physical_can_use_topic(f: Frame, src_object: Value) {
	return this.shared_living_ui_distance(src_object);
});

// physical.dm:21
rt.def("/mob/living/silicon/proc/physical_can_use_topic", function physical_can_use_topic(f: Frame, src_object: Value) {
	return max(UI_UPDATE, this.shared_living_ui_distance(src_object));
});
