// Based on /tg/station's code/modules/tgui/subsystem.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// subsystem.dm:21
rt.def("/datum/controller/subsystem/tgui/proc/try_update_ui", function* try_update_ui(f: Frame, user: Value, src_object: Value, ui_key: Value, ui: Value, force_open: Value) {
	let data: Value = null;
	force_open ??= 0;
	if (ui === null) {
		ui = this.get_open_ui(user, src_object, ui_key);
	}
	if (ui !== null) {
		data = (yield* src_object.ui_data(user));
		if (!force_open) {
			yield* ui.push_data(data);
		} else {
			yield* ui.reinitialize(null, data);
		}
		return ui;
	} else {
		return null;
	}
}, true);

// subsystem.dm:46
rt.def("/datum/controller/subsystem/tgui/proc/get_open_ui", function get_open_ui(f: Frame, user: Value, src_object: Value, ui_key: Value) {
	let ui: Value = null;
	let src_object_key: Value = fmt("＃", [src_object]);
	if (rt.index(this.open_uis, src_object_key) === null || !rt.istype(rt.index(this.open_uis, src_object_key), T("/list"))) {
		return null;
	}
	if (rt.index(rt.index(this.open_uis, src_object_key), ui_key) === null || !rt.istype(rt.index(rt.index(this.open_uis, src_object_key), ui_key), T("/list"))) {
		return null;
	}
	for (ui of each(rt.index(rt.index(this.open_uis, src_object_key), ui_key), T("/datum/tgui"))) {
		if (ui.user == user) {
			return ui;
		}
	}
	return null;
});

// subsystem.dm:68
rt.def("/datum/controller/subsystem/tgui/proc/update_uis", function update_uis(f: Frame, src_object: Value) {
	let ui_key: Value = null, ui: Value = null;
	let src_object_key: Value = fmt("＃", [src_object]);
	if (rt.index(this.open_uis, src_object_key) === null || !rt.istype(rt.index(this.open_uis, src_object_key), T("/list"))) {
		return 0;
	}
	let update_count: Value = 0;
	for (ui_key of each(rt.index(this.open_uis, src_object_key))) {
		ui = null;
		for (ui of each(rt.index(rt.index(this.open_uis, src_object_key), ui_key), T("/datum/tgui"))) {
			if (ui && ui.src_object && ui.user && ui.src_object.ui_host()) {
				ui.process({ force: 1 });
				update_count++;
			}
		}
	}
	return update_count;
});

// subsystem.dm:90
rt.def("/datum/controller/subsystem/tgui/proc/close_uis", function* close_uis(f: Frame, src_object: Value) {
	let ui_key: Value = null, ui: Value = null;
	let src_object_key: Value = fmt("＃", [src_object]);
	if (rt.index(this.open_uis, src_object_key) === null || !rt.istype(rt.index(this.open_uis, src_object_key), T("/list"))) {
		return 0;
	}
	let close_count: Value = 0;
	for (ui_key of each(rt.index(this.open_uis, src_object_key))) {
		ui = null;
		for (ui of each(rt.index(rt.index(this.open_uis, src_object_key), ui_key), T("/datum/tgui"))) {
			if (ui && ui.src_object && ui.user && ui.src_object.ui_host()) {
				yield* ui.close();
				close_count++;
			}
		}
	}
	return close_count;
}, true);

// subsystem.dm:111
rt.def("/datum/controller/subsystem/tgui/proc/close_all_uis", function* close_all_uis(f: Frame) {
	let src_object_key: Value = null, ui_key: Value = null, ui: Value = null;
	let close_count: Value = 0;
	for (src_object_key of each(this.open_uis)) {
		ui_key = null;
		for (ui_key of each(rt.index(this.open_uis, src_object_key))) {
			ui = null;
			for (ui of each(rt.index(rt.index(this.open_uis, src_object_key), ui_key), T("/datum/tgui"))) {
				if (ui && ui.src_object && ui.user && ui.src_object.ui_host()) {
					yield* ui.close();
					close_count++;
				}
			}
		}
	}
	return close_count;
}, true);

// subsystem.dm:153
rt.def("/datum/controller/subsystem/tgui/proc/close_user_uis", function* close_user_uis(f: Frame, user: Value, src_object: Value, ui_key: Value) {
	let ui: Value = null;
	if (user.open_uis === null || !rt.istype(user.open_uis, T("/list")) || rt.len(f, this.open_uis) == 0) {
		return 0;
	}
	let close_count: Value = 0;
	for (ui of each(user.open_uis, T("/datum/tgui"))) {
		if ((src_object === null || src_object !== null && ui.src_object == src_object) && (ui_key === null || ui_key !== null && ui.ui_key == ui_key)) {
			yield* ui.close();
			close_count++;
		}
	}
	return close_count;
}, true);

// subsystem.dm:171
rt.def("/datum/controller/subsystem/tgui/proc/on_open", function on_open(f: Frame, ui: Value) {
	let src_object_key: Value = fmt("＃", [ui.src_object]);
	if (rt.index(this.open_uis, src_object_key) === null || !rt.istype(rt.index(this.open_uis, src_object_key), T("/list"))) {
		rt.setAt(this.open_uis, src_object_key, rt.alist(f, [ui.ui_key, list()]));
	} else if (rt.index(rt.index(this.open_uis, src_object_key), ui.ui_key) === null || !rt.istype(rt.index(rt.index(this.open_uis, src_object_key), ui.ui_key), T("/list"))) {
		rt.setAt(rt.index(this.open_uis, src_object_key), ui.ui_key, list());
	}
	(rt.modField(f, ui.user, "open_uis", ui, rt.bitOr));
	let uis: Value = rt.index(rt.index(this.open_uis, src_object_key), ui.ui_key);
	(uis = rt.modify(uis, ui, rt.bitOr));
	(rt.modSrcVar(f, "processing_uis", ui, rt.bitOr));
	return f.dot;
});

// subsystem.dm:193
rt.def("/datum/controller/subsystem/tgui/proc/on_close", function on_close(f: Frame, ui: Value) {
	let uis: Value = null, uiobj: Value = null;
	let src_object_key: Value = fmt("＃", [ui.src_object]);
	if (rt.index(this.open_uis, src_object_key) === null || !rt.istype(rt.index(this.open_uis, src_object_key), T("/list"))) {
		return 0;
	} else if (rt.index(rt.index(this.open_uis, src_object_key), ui.ui_key) === null || !rt.istype(rt.index(rt.index(this.open_uis, src_object_key), ui.ui_key), T("/list"))) {
		return 0;
	}
	this.processing_uis.Remove(ui);
	if (ui.user) {
		ui.user.open_uis.Remove(ui);
	}
	let Ukey: Value = ui.ui_key;
	(uis = rt.index(rt.index(this.open_uis, src_object_key), Ukey)).Remove(ui);
	if (!rt.len(f, uis)) {
		(uiobj = rt.index(this.open_uis, src_object_key)).Remove(Ukey);
		if (!rt.len(f, uiobj)) {
			this.open_uis.Remove(src_object_key);
		}
	}
	return 1;
});

// subsystem.dm:223
rt.def("/datum/controller/subsystem/tgui/proc/on_logout", function* on_logout(f: Frame, user: Value) {
	return (yield* this.close_user_uis(user));
}, true);

// subsystem.dm:236
rt.def("/datum/controller/subsystem/tgui/proc/on_transfer", function on_transfer(f: Frame, source: Value, target: Value) {
	let ui: Value = null;
	if (!source || source.open_uis === null || !rt.istype(source.open_uis, T("/list")) || rt.len(f, this.open_uis) == 0) {
		return 0;
	}
	if (target.open_uis === null || !rt.istype(target.open_uis, T("/list"))) {
		target.open_uis = list();
	}
	for (ui of each(source.open_uis, T("/datum/tgui"))) {
		ui.user = target;
		target.open_uis.Add(ui);
	}
	source.open_uis.Cut();
	return 1;
});
