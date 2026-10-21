// From code/modules/tgui/subsystem.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/subsystem/tgui/proc/try_update_ui  (code/modules/tgui/subsystem.dm:21)  may sleep
rt.def("/datum/controller/subsystem/tgui/proc/try_update_ui", function* try_update_ui(f: Frame, user: Value, src_object: Value, ui_key: Value, ui: Value, force_open: Value) {
	let data: Value = null;
	f.vars = () => [user, src_object, ui_key, ui, force_open, data];
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(ui) === null) {
		ui = (yield* g.srcCall(f, "get_open_ui", live(user), live(src_object), live(ui_key)));
	}
	if (live(ui) !== null) {
		data = (yield* g.callName(f, live(src_object), "ui_data", [live(user)]));
		if (!truthy(live(force_open))) {
			yield* g.callName(f, live(ui), "push_data", [live(data)]);
		} else {
			yield* g.callName(f, live(ui), "reinitialize", [null, live(data)]);
		}
		return live(ui);
	} else {
		return null;
	}
	return f.dot;
}, true);

// /datum/controller/subsystem/tgui/proc/get_open_ui  (code/modules/tgui/subsystem.dm:46)
rt.def("/datum/controller/subsystem/tgui/proc/get_open_ui", function get_open_ui(f: Frame, user: Value, src_object: Value, ui_key: Value) {
	let src_object_key: Value = null, ui: Value = null;
	let $e: any;
	f.vars = () => [src_object_key, ui, $e];
	src_object_key = fmt("＃", [live(src_object)]);
	if ((rt.index(rt.sv(f, "open_uis"), live(src_object_key)) === null || !truthy((rt.istype(rt.index(rt.sv(f, "open_uis"), live(src_object_key)), T("/list")) ? 1 : 0)))) {
		return null;
	}
	if ((rt.index(rt.index(rt.sv(f, "open_uis"), live(src_object_key)), live(ui_key)) === null || !truthy((rt.istype(rt.index(rt.index(rt.sv(f, "open_uis"), live(src_object_key)), live(ui_key)), T("/list")) ? 1 : 0)))) {
		return null;
	}
	ui = null;
	rt.forList(f, 0, rt.index(rt.index(rt.sv(f, "open_uis"), live(src_object_key)), live(ui_key)), T("/datum/tgui"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ui = $e;
		if (isEqual(rt.fv(f, "user", live(ui)), live(user))) {
			return live(ui);
		}
	}
	rt.endFor(f, 0);
	return null;
});

// /datum/controller/subsystem/tgui/proc/update_uis  (code/modules/tgui/subsystem.dm:68)
rt.def("/datum/controller/subsystem/tgui/proc/update_uis", function update_uis(f: Frame, src_object: Value) {
	let src_object_key: Value = null, update_count: Value = null, ui_key: Value = null, ui: Value = null;
	let $e: any;
	f.vars = () => [src_object_key, update_count, ui_key, ui, $e];
	src_object_key = fmt("＃", [live(src_object)]);
	if ((rt.index(rt.sv(f, "open_uis"), live(src_object_key)) === null || !truthy((rt.istype(rt.index(rt.sv(f, "open_uis"), live(src_object_key)), T("/list")) ? 1 : 0)))) {
		return 0;
	}
	update_count = 0;
	ui_key = null;
	rt.forList(f, 0, rt.index(rt.sv(f, "open_uis"), live(src_object_key)));
	while (($e = rt.next(f, 0)) !== undefined) {
		ui_key = $e;
		ui = null;
		rt.forList(f, 1, rt.index(rt.index(rt.sv(f, "open_uis"), live(src_object_key)), live(ui_key)), T("/datum/tgui"));
		while (($e = rt.next(f, 1)) !== undefined) {
			ui = $e;
			if ((((truthy(live(ui)) && truthy(rt.fv(f, "src_object", live(ui)))) && truthy(rt.fv(f, "user", live(ui)))) && truthy(rt.callName(f, rt.fv(f, "src_object", live(ui)), "ui_host", [])))) {
				rt.callName(f, live(ui), "process", ["force", 1], rt.Args.Named);
				update_count = rt.inc(live(update_count), 1);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return live(update_count);
});

// /datum/controller/subsystem/tgui/proc/close_uis  (code/modules/tgui/subsystem.dm:90)  may sleep
rt.def("/datum/controller/subsystem/tgui/proc/close_uis", function* close_uis(f: Frame, src_object: Value) {
	let src_object_key: Value = null, close_count: Value = null, ui_key: Value = null, ui: Value = null;
	let $e: any;
	f.vars = () => [src_object, src_object_key, close_count, ui_key, ui, $e];
	src_object_key = fmt("＃", [live(src_object)]);
	if ((rt.index(rt.sv(f, "open_uis"), live(src_object_key)) === null || !truthy((rt.istype(rt.index(rt.sv(f, "open_uis"), live(src_object_key)), T("/list")) ? 1 : 0)))) {
		return 0;
	}
	close_count = 0;
	ui_key = null;
	rt.forList(f, 0, rt.index(rt.sv(f, "open_uis"), live(src_object_key)));
	while (($e = rt.next(f, 0)) !== undefined) {
		ui_key = $e;
		ui = null;
		rt.forList(f, 1, rt.index(rt.index(rt.sv(f, "open_uis"), live(src_object_key)), live(ui_key)), T("/datum/tgui"));
		while (($e = rt.next(f, 1)) !== undefined) {
			ui = $e;
			if ((((truthy(live(ui)) && truthy(rt.fv(f, "src_object", live(ui)))) && truthy(rt.fv(f, "user", live(ui)))) && truthy((yield* g.callName(f, rt.fv(f, "src_object", live(ui)), "ui_host", []))))) {
				yield* g.callName(f, live(ui), "close", []);
				close_count = rt.inc(live(close_count), 1);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return live(close_count);
}, true);

// /datum/controller/subsystem/tgui/proc/close_all_uis  (code/modules/tgui/subsystem.dm:111)  may sleep
rt.def("/datum/controller/subsystem/tgui/proc/close_all_uis", function* close_all_uis(f: Frame) {
	let close_count: Value = null, src_object_key: Value = null, ui_key: Value = null, ui: Value = null;
	let $e: any;
	f.vars = () => [close_count, src_object_key, ui_key, ui, $e];
	close_count = 0;
	src_object_key = null;
	rt.forList(f, 0, rt.sv(f, "open_uis"));
	while (($e = rt.next(f, 0)) !== undefined) {
		src_object_key = $e;
		ui_key = null;
		rt.forList(f, 1, rt.index(rt.sv(f, "open_uis"), live(src_object_key)));
		while (($e = rt.next(f, 1)) !== undefined) {
			ui_key = $e;
			ui = null;
			rt.forList(f, 2, rt.index(rt.index(rt.sv(f, "open_uis"), live(src_object_key)), live(ui_key)), T("/datum/tgui"));
			while (($e = rt.next(f, 2)) !== undefined) {
				ui = $e;
				if ((((truthy(live(ui)) && truthy(rt.fv(f, "src_object", live(ui)))) && truthy(rt.fv(f, "user", live(ui)))) && truthy((yield* g.callName(f, rt.fv(f, "src_object", live(ui)), "ui_host", []))))) {
					yield* g.callName(f, live(ui), "close", []);
					close_count = rt.inc(live(close_count), 1);
				}
			}
			rt.endFor(f, 2);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return live(close_count);
}, true);

// /datum/controller/subsystem/tgui/proc/update_user_uis  (code/modules/tgui/subsystem.dm:131)
rt.def("/datum/controller/subsystem/tgui/proc/update_user_uis", function update_user_uis(f: Frame, user: Value, src_object: Value, ui_key: Value) {
	let update_count: Value = null, ui: Value = null;
	let $e: any;
	f.vars = () => [src_object, ui_key, update_count, ui, $e];
	if (live(src_object) === null) {
		src_object = null;
	}
	if (live(ui_key) === null) {
		ui_key = null;
	}
	if (((rt.fv(f, "open_uis", live(user)) === null || !truthy((rt.istype(rt.fv(f, "open_uis", live(user)), T("/list")) ? 1 : 0))) || isEqual(rt.len(f, rt.sv(f, "open_uis")), 0))) {
		return 0;
	}
	update_count = 0;
	ui = null;
	rt.forList(f, 0, rt.fv(f, "open_uis", live(user)), T("/datum/tgui"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ui = $e;
		if (((live(src_object) === null || (live(src_object) !== null && isEqual(rt.fv(f, "src_object", live(ui)), live(src_object)))) && (live(ui_key) === null || (live(ui_key) !== null && isEqual(rt.fv(f, "ui_key", live(ui)), live(ui_key)))))) {
			rt.callName(f, live(ui), "process", ["force", 1], rt.Args.Named);
			update_count = rt.inc(live(update_count), 1);
		}
	}
	rt.endFor(f, 0);
	return live(update_count);
});

// /datum/controller/subsystem/tgui/proc/close_user_uis  (code/modules/tgui/subsystem.dm:153)  may sleep
rt.def("/datum/controller/subsystem/tgui/proc/close_user_uis", function* close_user_uis(f: Frame, user: Value, src_object: Value, ui_key: Value) {
	let close_count: Value = null, ui: Value = null;
	let $e: any;
	f.vars = () => [user, src_object, ui_key, close_count, ui, $e];
	if (live(src_object) === null) {
		src_object = null;
	}
	if (live(ui_key) === null) {
		ui_key = null;
	}
	if (((rt.fv(f, "open_uis", live(user)) === null || !truthy((rt.istype(rt.fv(f, "open_uis", live(user)), T("/list")) ? 1 : 0))) || isEqual(rt.len(f, rt.sv(f, "open_uis")), 0))) {
		return 0;
	}
	close_count = 0;
	ui = null;
	rt.forList(f, 0, rt.fv(f, "open_uis", live(user)), T("/datum/tgui"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ui = $e;
		if (((live(src_object) === null || (live(src_object) !== null && isEqual(rt.fv(f, "src_object", live(ui)), live(src_object)))) && (live(ui_key) === null || (live(ui_key) !== null && isEqual(rt.fv(f, "ui_key", live(ui)), live(ui_key)))))) {
			yield* g.callName(f, live(ui), "close", []);
			close_count = rt.inc(live(close_count), 1);
		}
	}
	rt.endFor(f, 0);
	return live(close_count);
}, true);

// /datum/controller/subsystem/tgui/proc/on_open  (code/modules/tgui/subsystem.dm:171)
rt.def("/datum/controller/subsystem/tgui/proc/on_open", function on_open(f: Frame, ui: Value) {
	let src_object_key: Value = null, uis: Value = null;
	f.vars = () => [src_object_key, uis];
	src_object_key = fmt("＃", [rt.fv(f, "src_object", live(ui))]);
	if ((rt.index(rt.sv(f, "open_uis"), live(src_object_key)) === null || !truthy((rt.istype(rt.index(rt.sv(f, "open_uis"), live(src_object_key)), T("/list")) ? 1 : 0)))) {
		rt.setAt(rt.sv(f, "open_uis"), live(src_object_key), rt.alist(f, [rt.fv(f, "ui_key", live(ui)), rt.list()]));
	} else {
		if ((rt.index(rt.index(rt.sv(f, "open_uis"), live(src_object_key)), rt.fv(f, "ui_key", live(ui))) === null || !truthy((rt.istype(rt.index(rt.index(rt.sv(f, "open_uis"), live(src_object_key)), rt.fv(f, "ui_key", live(ui))), T("/list")) ? 1 : 0)))) {
			rt.setAt(rt.index(rt.sv(f, "open_uis"), live(src_object_key)), rt.fv(f, "ui_key", live(ui)), rt.list());
		}
	}
	(rt.modField(f, rt.fv(f, "user", live(ui)), "open_uis", live(ui), rt.bitOr));
	uis = rt.index(rt.index(rt.sv(f, "open_uis"), live(src_object_key)), rt.fv(f, "ui_key", live(ui)));
	(uis = rt.modify(live(uis), live(ui), rt.bitOr));
	(rt.modSrcVar(f, "processing_uis", live(ui), rt.bitOr));
	return f.dot;
});

// /datum/controller/subsystem/tgui/proc/on_close  (code/modules/tgui/subsystem.dm:193)
rt.def("/datum/controller/subsystem/tgui/proc/on_close", function on_close(f: Frame, ui: Value) {
	let src_object_key: Value = null, Ukey: Value = null, uis: Value = null, uiobj: Value = null;
	f.vars = () => [src_object_key, Ukey, uis, uiobj];
	src_object_key = fmt("＃", [rt.fv(f, "src_object", live(ui))]);
	if ((rt.index(rt.sv(f, "open_uis"), live(src_object_key)) === null || !truthy((rt.istype(rt.index(rt.sv(f, "open_uis"), live(src_object_key)), T("/list")) ? 1 : 0)))) {
		return 0;
	} else {
		if ((rt.index(rt.index(rt.sv(f, "open_uis"), live(src_object_key)), rt.fv(f, "ui_key", live(ui))) === null || !truthy((rt.istype(rt.index(rt.index(rt.sv(f, "open_uis"), live(src_object_key)), rt.fv(f, "ui_key", live(ui))), T("/list")) ? 1 : 0)))) {
			return 0;
		}
	}
	rt.callName(f, rt.sv(f, "processing_uis"), "Remove", [live(ui)]);
	if (truthy(rt.fv(f, "user", live(ui)))) {
		rt.callName(f, rt.gv(f, "open_uis", rt.fv(f, "user", live(ui))), "Remove", [live(ui)]);
	}
	Ukey = rt.fv(f, "ui_key", live(ui));
	rt.callName(f, (uis = rt.index(rt.index(rt.sv(f, "open_uis"), live(src_object_key)), live(Ukey))), "Remove", [live(ui)]);
	if (!truthy(rt.len(f, live(uis)))) {
		rt.callName(f, (uiobj = rt.index(rt.sv(f, "open_uis"), live(src_object_key))), "Remove", [live(Ukey)]);
		if (!truthy(rt.len(f, live(uiobj)))) {
			rt.callName(f, rt.sv(f, "open_uis"), "Remove", [live(src_object_key)]);
		}
	}
	return 1;
});

// /datum/controller/subsystem/tgui/proc/on_logout  (code/modules/tgui/subsystem.dm:223)  may sleep
rt.def("/datum/controller/subsystem/tgui/proc/on_logout", function* on_logout(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "close_user_uis", live(user)));
}, true);

// /datum/controller/subsystem/tgui/proc/on_transfer  (code/modules/tgui/subsystem.dm:236)
rt.def("/datum/controller/subsystem/tgui/proc/on_transfer", function on_transfer(f: Frame, source: Value, target: Value) {
	let ui: Value = null;
	let $e: any;
	f.vars = () => [ui, $e];
	if ((((!truthy(live(source)) || rt.fv(f, "open_uis", live(source)) === null) || !truthy((rt.istype(rt.fv(f, "open_uis", live(source)), T("/list")) ? 1 : 0))) || isEqual(rt.len(f, rt.sv(f, "open_uis")), 0))) {
		return 0;
	}
	if ((rt.fv(f, "open_uis", live(target)) === null || !truthy((rt.istype(rt.fv(f, "open_uis", live(target)), T("/list")) ? 1 : 0)))) {
		rt.setFv(f, "open_uis", live(target), rt.list());
	}
	ui = null;
	rt.forList(f, 0, rt.fv(f, "open_uis", live(source)), T("/datum/tgui"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ui = $e;
		rt.setFv(f, "user", live(ui), live(target));
		rt.callName(f, rt.fv(f, "open_uis", live(target)), "Add", [live(ui)]);
	}
	rt.endFor(f, 0);
	rt.callName(f, rt.fv(f, "open_uis", live(source)), "Cut", []);
	return 1;
});
