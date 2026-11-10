// Based on /tg/station's code/modules/tgui/states/default.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// default.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobaldefault_state", function InitGlobaldefault_state(f: Frame) {
	GLOB.default_state = new_(T("/datum/ui_state/default"));
	this.gvars_datum_init_order += "default_state";
	return f.dot;
});

rt.type(4231, "/datum/ui_state/default", "/datum/ui_state", {});

// default.dm:10
rt.def("/datum/ui_state/default/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	return user.default_can_use_topic(src_object);
});

// default.dm:16
rt.def("/mob/living/proc/default_can_use_topic", function default_can_use_topic(f: Frame, src_object: Value) {
	f.dot = this.shared_ui_interaction(src_object);
	if (f.dot > UI_CLOSE && this.loc) {
		f.dot = min(f.dot, this.loc.contents_ui_distance(src_object, this));
	}
	if (f.dot != UI_INTERACTIVE) return f.dot;
	return UI_UPDATE;
});

// default.dm:23
rt.def("/mob/living/carbon/human/proc/default_can_use_topic", function default_can_use_topic(f: Frame, src_object: Value) {
	f.dot = this.shared_ui_interaction(src_object);
	if (!(f.dot > UI_CLOSE)) return f.dot;
	f.dot = min(f.dot, this.shared_living_ui_distance(src_object));
	if (!prob(this.getBrainLoss())) return f.dot;
	return UI_UPDATE;
});

// default.dm:31
rt.def("/mob/living/silicon/robot/proc/default_can_use_topic", function default_can_use_topic(f: Frame, src_object: Value) {
	f.dot = this.shared_ui_interaction(src_object);
	if (f.dot <= UI_DISABLED) {
		return f.dot;
	}
	let clientviewlist: Value = getviewsize(this.client.view);
	if (get_dist(this, src_object) <= min(rt.index(clientviewlist, 1), rt.index(clientviewlist, 2)) * 0.5 - 0.5) {
		return UI_INTERACTIVE;
	}
	return UI_DISABLED;
});

// default.dm:42
rt.def("/mob/living/silicon/ai/proc/default_can_use_topic", function default_can_use_topic(f: Frame, src_object: Value) {
	f.dot = this.shared_ui_interaction(src_object);
	if (f.dot < UI_INTERACTIVE) {
		return f.dot;
	}
	let viewscale: Value = getviewsize(this.client.view);
	if (get_dist(this, src_object) <= max(rt.index(viewscale, 1), rt.index(viewscale, 2)) * 0.5 - 0.5 || GLOB.cameranet.checkTurfVis(get_turf_pixel(src_object))) {
		return UI_INTERACTIVE;
	}
	return UI_CLOSE;
});

// default.dm:53
rt.def("/mob/living/simple_animal/proc/default_can_use_topic", function default_can_use_topic(f: Frame, src_object: Value) {
	f.dot = this.shared_ui_interaction(src_object);
	if (!(f.dot > UI_CLOSE)) return f.dot;
	f.dot = min(f.dot, this.shared_living_ui_distance(src_object));
	return f.dot;
});

// default.dm:59
rt.def("/mob/living/silicon/pai/proc/default_can_use_topic", function default_can_use_topic(f: Frame, src_object: Value) {
	if ((src_object == this || src_object == this.radio) && !this.stat) {
		return UI_INTERACTIVE;
	} else {
		return parent_proc();
	}
}, false);
