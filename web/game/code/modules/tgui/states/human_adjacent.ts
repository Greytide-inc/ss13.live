// Based on /tg/station's code/modules/tgui/states/human_adjacent.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// human_adjacent.dm:9
rt.def("/datum/controller/global_vars/proc/InitGlobalhuman_adjacent_state", function InitGlobalhuman_adjacent_state(f: Frame) {
	GLOB.human_adjacent_state = new_(T("/datum/ui_state/human_adjacent_state"));
	this.gvars_datum_init_order += "human_adjacent_state";
	return f.dot;
});

rt.type(4233, "/datum/ui_state/human_adjacent_state", "/datum/ui_state", {});

// human_adjacent.dm:12
rt.def("/datum/ui_state/human_adjacent_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	let dist: Value = null;
	f.dot = user.default_can_use_topic(src_object);
	if (!((dist = get_dist(src_object, user)) > 1 || !rt.istype(user, T("/mob/living/carbon/human")))) return f.dot;
	f.dot = min(f.dot, UI_UPDATE);
	return f.dot;
});
