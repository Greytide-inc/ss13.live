// Based on /tg/station's code/modules/tgui/states.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// states.dm:18
rt.def("/datum/proc/ui_status", function ui_status(f: Frame, user: Value, state: Value) {
	let clientviewlist: Value = null;
	let src_object: Value = this.ui_host();
	f.dot = UI_CLOSE;
	if (!state) {
		return f.dot;
	}
	if (rt.istype(user, T("/mob/dead/observer"))) {
		if (IsAdminGhost(user)) {
			f.dot = max(f.dot, UI_INTERACTIVE);
		}
		clientviewlist = getviewsize(user.client.view);
		if (get_dist(src_object, user) < max(rt.index(clientviewlist, 1), rt.index(clientviewlist, 2)) * 0.5 - 0.5) {
			f.dot = max(f.dot, UI_UPDATE);
		}
	}
	let result: Value = state.can_use_topic(src_object, user);
	f.dot = max(f.dot, result);
	return f.dot;
});

// states.dm:59
rt.def("/mob/proc/shared_ui_interaction", function shared_ui_interaction(f: Frame, src_object: Value) {
	if (!this.client) {
		return UI_CLOSE;
	} else if (this.stat) {
		return UI_DISABLED;
	} else if (this.incapacitated() || this.lying) {
		return UI_UPDATE;
	}
	return UI_INTERACTIVE;
});

// states.dm:68
rt.def("/mob/living/silicon/ai/proc/shared_ui_interaction", function shared_ui_interaction(f: Frame, src_object: Value) {
	if (this.lacks_power()) {
		return UI_DISABLED;
	}
	return parent_proc();
}, false);

// states.dm:73
rt.def("/mob/living/silicon/robot/proc/shared_ui_interaction", function shared_ui_interaction(f: Frame, src_object: Value) {
	if (this.cell.charge <= 0 || this.lockcharge) {
		return UI_DISABLED;
	}
	return parent_proc();
}, false);

// states.dm:90
rt.def("/atom/proc/contents_ui_distance", function contents_ui_distance(f: Frame, src_object: Value, user: Value) {
	return user.shared_living_ui_distance(src_object);
});

// states.dm:102
rt.def("/mob/living/proc/shared_living_ui_distance", function shared_living_ui_distance(f: Frame, src_object: Value) {
	let dist: Value = null;
	if (!rt.isIn(f, src_object, view(this))) {
		return UI_CLOSE;
	}
	if ((dist = get_dist(src_object, this)) <= 1) {
		return UI_INTERACTIVE;
	} else if (dist <= 2) {
		return UI_UPDATE;
	} else if (dist <= 5) {
		return UI_DISABLED;
	}
	return UI_CLOSE;
});

// states.dm:115
rt.def("/mob/living/carbon/human/proc/shared_living_ui_distance", function shared_living_ui_distance(f: Frame, src_object: Value) {
	if (this.dna.check_mutation("Telekinesis") && tkMaxRangeCheck(this, src_object)) {
		return UI_INTERACTIVE;
	}
	return parent_proc();
}, false);
