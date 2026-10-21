// From code/modules/shuttle/manipulator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10989, "/obj/machinery/shuttle_manipulator", "/obj/machinery", {
	selected: null,
	existing_shuttle: null,
	preview_shuttle: null,
	preview_template: null,
	anchored: 1,
	name: "shuttle manipulator",
	desc: "I shall be telling this with a sigh\nSomewhere ages and ages hence:\nTwo roads diverged in a wood, and I,\nI took the one less traveled by,\nAnd that has made all the difference.",
	icon: rt.rsc("icons/obj/machines/shuttle_manipulator.dmi"),
	icon_state: "holograph_on",
	density: 1,
});

// /obj/machinery/shuttle_manipulator/proc/Initialize  (code/modules/shuttle/manipulator.dm:24)  may sleep
rt.def("/obj/machinery/shuttle_manipulator/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/shuttle_manipulator/proc/update_icon  (code/modules/shuttle/manipulator.dm:28)
rt.def("/obj/machinery/shuttle_manipulator/proc/update_icon", function update_icon(f: Frame) {
	let hologram_projection: Value = null, hologram_ship: Value = null;
	f.vars = () => [hologram_projection, hologram_ship];
	rt.callSrc(f, "cut_overlays", []);
	rt.setFv(f, "pixel_y", (hologram_projection = rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "hologram_on"])), 22);
	rt.setFv(f, "pixel_y", (hologram_ship = rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "hologram_whiteship"])), 27);
	rt.callSrc(f, "add_overlay", [live(hologram_projection)]);
	rt.callSrc(f, "add_overlay", [live(hologram_ship)]);
	return f.dot;
});

// /obj/machinery/shuttle_manipulator/proc/ui_interact  (code/modules/shuttle/manipulator.dm:40)  may sleep
rt.def("/obj/machinery/shuttle_manipulator/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("admin_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "shuttle_manipulator", rt.sv(f, "name"), 800, 600, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /proc/shuttlemode2str  (code/modules/shuttle/manipulator.dm:47)
rt.def("/proc/shuttlemode2str", function shuttlemode2str(f: Frame, mode: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(mode);
	if ($0 === "idle") {
		f.dot = "idle";
	} else if ($0 === "igniting") {
		f.dot = "engines charging";
	} else if ($0 === "recall") {
		f.dot = "recalled";
	} else if ($0 === "call") {
		f.dot = "called";
	} else if ($0 === "docked") {
		f.dot = "docked";
	} else if ($0 === "stranded") {
		f.dot = "stranded";
	} else if ($0 === "escape") {
		f.dot = "escape";
	} else if ($0 === "endgame: game over") {
		f.dot = "endgame";
	}
	if (truthy(live(f.dot))) return f.dot;
	rt.throw_(f, rt.new_(f, T("/exception"), [fmt("shuttlemode2str(): invalid mode ＀", [live(mode)]), "code/modules/shuttle/manipulator.dm", 65]));
	return f.dot;
});

// /obj/machinery/shuttle_manipulator/proc/ui_data  (code/modules/shuttle/manipulator.dm:69)  may sleep
rt.def("/obj/machinery/shuttle_manipulator/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let data: Value = null, templates: Value = null, shuttle_id: Value = null, S: Value = null, L: Value = null, i: Value = null, M: Value = null, can_fast_travel: Value = null;
	let $e: any;
	f.vars = () => [user, data, templates, shuttle_id, S, L, i, M, can_fast_travel, $e];
	rt.setAt((data = rt.list()), "tabs", rt.list("Status", "Templates", "Modification"));
	rt.setAt(live(data), "templates", rt.list());
	templates = rt.at(live(data), "templates");
	rt.setAt(live(data), "templates_tabs", rt.list());
	rt.setAt(live(data), "selected", rt.list());
	shuttle_id = null;
	rt.forList(f, 0, rt.fv(f, "shuttle_templates", rt.gl("SSmapping")));
	while (($e = rt.next(f, 0)) !== undefined) {
		shuttle_id = $e;
		S = rt.index(rt.fv(f, "shuttle_templates", rt.gl("SSmapping")), live(shuttle_id));
		if (!truthy(rt.index(live(templates), rt.fv(f, "port_id", live(S))))) {
			rt.modAt(live(data), "templates_tabs", rt.fv(f, "port_id", live(S)), add);
			rt.setAt(live(templates), rt.fv(f, "port_id", live(S)), rt.alist(f, ["port_id", rt.fv(f, "port_id", live(S)), "templates", rt.list()]));
		}
		rt.setAt((L = rt.list()), "name", rt.fv(f, "name", live(S)));
		rt.setAt(live(L), "shuttle_id", rt.fv(f, "shuttle_id", live(S)));
		rt.setAt(live(L), "port_id", rt.fv(f, "port_id", live(S)));
		rt.setAt(live(L), "description", rt.fv(f, "description", live(S)));
		rt.setAt(live(L), "admin_notes", rt.fv(f, "admin_notes", live(S)));
		if (isEqual(rt.sv(f, "selected"), live(S))) {
			rt.setAt(live(data), "selected", live(L));
		}
		rt.modAt(rt.index(live(templates), rt.fv(f, "port_id", live(S))), "templates", rt.list(live(L)), add);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "templates_tabs", (yield* g.call(f, P("/proc/sortList"), null, [rt.at(live(data), "templates_tabs")])));
	rt.setAt(live(data), "existing_shuttle", null);
	rt.setAt(live(data), "shuttles", rt.list());
	i = null;
	rt.forList(f, 0, rt.fv(f, "mobile", rt.gl("SSshuttle")));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		M = live(i);
		rt.setAt((L = rt.list()), "name", rt.fv(f, "name", live(M)));
		rt.setAt(live(L), "id", rt.fv(f, "id", live(M)));
		rt.setAt(live(L), "timer", rt.fv(f, "timer", live(M)));
		rt.setAt(live(L), "timeleft", (yield* g.callName(f, live(M), "getTimerStr", [])));
		can_fast_travel = 0;
		if ((truthy(rt.fv(f, "timer", live(M))) && rt.ge((yield* g.callName(f, live(M), "timeLeft", [])), 50))) {
			can_fast_travel = 1;
		}
		rt.setAt(live(L), "can_fast_travel", live(can_fast_travel));
		rt.setAt(live(L), "mode", (yield* g.call(f, P("/proc/capitalize"), null, [(yield* g.call(f, P("/proc/shuttlemode2str"), null, [rt.fv(f, "mode", live(M))]))])));
		rt.setAt(live(L), "status", (yield* g.callName(f, live(M), "getStatusText", [])));
		if (isEqual(live(M), rt.sv(f, "existing_shuttle"))) {
			rt.setAt(live(data), "existing_shuttle", live(L));
		}
		rt.modAt(live(data), "shuttles", rt.list(live(L)), add);
	}
	rt.endFor(f, 0);
	return live(data);
}, true);

// /obj/machinery/shuttle_manipulator/proc/ui_act  (code/modules/shuttle/manipulator.dm:126)  may sleep
rt.def("/obj/machinery/shuttle_manipulator/proc/ui_act", function* ui_act(f: Frame) {
	let user: Value = null, shuttle_id: Value = null, S: Value = null, i: Value = null, M: Value = null, mdp: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, shuttle_id, S, i, M, mdp, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	user = live(f.usr);
	shuttle_id = rt.at(live(f.args[1]), "shuttle_id");
	S = rt.index(rt.fv(f, "shuttle_templates", rt.gl("SSmapping")), live(shuttle_id));
	$0 = live(f.args[0]);
	if ($0 === "select_template") {
		if (truthy(live(S))) {
			rt.setSv(f, "existing_shuttle", (yield* g.callName(f, rt.gl("SSshuttle"), "getShuttle", [rt.fv(f, "port_id", live(S))])));
			rt.setSv(f, "selected", live(S));
			f.dot = 1;
		}
	} else if ($0 === "jump_to") {
		if (isEqual(rt.at(live(f.args[1]), "type"), "mobile")) {
			i = null;
			rt.forList(f, 0, rt.fv(f, "mobile", rt.gl("SSshuttle")));
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				if (isEqual(rt.gv(f, "id", (M = live(i))), rt.at(live(f.args[1]), "id"))) {
					yield* g.callName(f, live(user), "forceMove", [rt.getStep(f, live(M), 0)]);
					f.dot = 1;
					break;
				}
			}
			rt.endFor(f, 0);
		}
	} else if ($0 === "fast_travel") {
		i = null;
		rt.forList(f, 0, rt.fv(f, "mobile", rt.gl("SSshuttle")));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (((isEqual(rt.gv(f, "id", (M = live(i))), rt.at(live(f.args[1]), "id")) && truthy(rt.fv(f, "timer", live(M)))) && rt.ge((yield* g.callName(f, live(M), "timeLeft", [])), 50))) {
				yield* g.callName(f, live(M), "setTimer", [50]);
				f.dot = 1;
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ fast travelled ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(M)])]);
				yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ fast travelled ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(M)])]);
				break;
			}
		}
		rt.endFor(f, 0);
	} else if ($0 === "preview") {
		if (truthy(live(S))) {
			f.dot = 1;
			yield* g.srcCall(f, "unload_preview");
			yield* g.srcCall(f, "load_template", live(S));
			if (truthy(rt.sv(f, "preview_shuttle"))) {
				rt.setSv(f, "preview_template", live(S));
				yield* g.callName(f, live(user), "forceMove", [rt.getStep(f, rt.sv(f, "preview_shuttle"), 0)]);
			}
		}
	} else if ($0 === "load") {
		if (isEqual(rt.sv(f, "existing_shuttle"), rt.fv(f, "backup_shuttle", rt.gl("SSshuttle")))) {
			yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", ["The shuttle that the selected shuttle will replace is the backup shuttle. Backup shuttle is required to be intact for round sanity.", "code/modules/shuttle/manipulator.dm", 172, live(f.src), live(f.usr)])]);
		} else {
			if (truthy(live(S))) {
				f.dot = 1;
				if (truthy((mdp = (yield* g.srcCall(f, "action_load", live(S)))))) {
					yield* g.callName(f, live(user), "forceMove", [rt.getStep(f, live(mdp), 0)]);
					yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ loaded ＀ with the shuttle manipulator.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(mdp)])]);
					yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ loaded ＀ with the shuttle manipulator.</span>", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(mdp)])]);
				}
			}
		}
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/shuttle_manipulator/proc/action_load  (code/modules/shuttle/manipulator.dm:192)  may sleep
rt.def("/obj/machinery/shuttle_manipulator/proc/action_load", function* action_load(f: Frame, loading_template: Value) {
	let timer: Value = null, mode: Value = null, D: Value = null, m: Value = null, result: Value = null, m_4: Value = null;
	f.vars = () => [loading_template, timer, mode, D, m, result, m_4];
	if ((truthy(rt.sv(f, "preview_shuttle")) && !isEqual(live(loading_template), rt.sv(f, "preview_template")))) {
		yield* g.callName(f, rt.sv(f, "preview_shuttle"), "jumpToNullSpace", []);
		rt.setSv(f, "preview_shuttle", null);
		rt.setSv(f, "preview_template", null);
	}
	if (!truthy(rt.sv(f, "preview_shuttle"))) {
		yield* g.srcCall(f, "load_template", live(loading_template));
		rt.setSv(f, "preview_template", live(loading_template));
	}
	timer = 0;
	mode = "idle";
	D = null;
	if (truthy(rt.sv(f, "existing_shuttle"))) {
		timer = rt.fv(f, "timer", rt.sv(f, "existing_shuttle"));
		mode = rt.fv(f, "mode", rt.sv(f, "existing_shuttle"));
		D = (yield* g.callName(f, rt.sv(f, "existing_shuttle"), "get_docked", []));
	} else {
		D = (yield* g.callName(f, rt.sv(f, "preview_shuttle"), "findRoundstartDock", []));
	}
	if (!truthy(live(D))) {
		yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [(m = "No dock found for preview shuttle, aborting."), "code/modules/shuttle/manipulator.dm", 215, live(f.src), live(f.usr)])]);
		rt.throw_(f, (yield* g.new_(f, T("/exception"), [live(m), "code/modules/shuttle/manipulator.dm", 216])));
	}
	if ((!isEqual((result = (yield* g.callName(f, rt.sv(f, "preview_shuttle"), "canDock", [live(D)]))), "can_dock") && !isEqual(live(result), "someone_else_docked"))) {
		yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [(m_4 = fmt("Unsuccessful dock of ＀ (＀).", [rt.sv(f, "preview_shuttle"), live(result)])), "code/modules/shuttle/manipulator.dm", 224, live(f.src), live(f.usr)])]);
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "existing_shuttle"), "jumpToNullSpace", []);
	yield* g.callName(f, rt.sv(f, "preview_shuttle"), "dock", [live(D)]);
	f.dot = rt.sv(f, "preview_shuttle");
	rt.setFv(f, "timer", rt.sv(f, "preview_shuttle"), live(timer));
	rt.setFv(f, "mode", rt.sv(f, "preview_shuttle"), live(mode));
	yield* g.callName(f, rt.sv(f, "preview_shuttle"), "register", []);
	rt.setSv(f, "preview_shuttle", null);
	rt.setSv(f, "preview_template", null);
	rt.setSv(f, "existing_shuttle", null);
	rt.setSv(f, "selected", null);
	return f.dot;
}, true);

// /obj/machinery/shuttle_manipulator/proc/load_template  (code/modules/shuttle/manipulator.dm:249)  may sleep
rt.def("/obj/machinery/shuttle_manipulator/proc/load_template", function* load_template(f: Frame, S: Value) {
	let landmark_turf: Value = null, affected: Value = null, found: Value = null, _T: Value = null, _P: Value = null, M: Value = null, m: Value = null, msg: Value = null, _T_4: Value = null, T0: Value = null;
	let $e: any;
	f.vars = () => [S, landmark_turf, affected, found, _T, _P, M, m, msg, _T_4, T0, $e];
	landmark_turf = rt.getStep(f, rt.locateIn(f, "landmark*Shuttle Import", rt.world()), 0);
	yield* g.callName(f, live(S), "load", [null, live(landmark_turf), "centered", 1], rt.Args.Named);
	affected = (yield* g.callName(f, live(S), "get_affected_turfs", [null, live(landmark_turf), "centered", 1], rt.Args.Named));
	found = 0;
	_T = null;
	rt.forList(f, 0, live(affected));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		_P = null;
		rt.forList(f, 1, live(_T), T("/obj/docking_port"));
		while (($e = rt.next(f, 1)) !== undefined) {
			_P = $e;
			if (truthy((rt.istype(live(_P), T("/obj/docking_port/mobile")) ? 1 : 0))) {
				M = live(_P);
				found = rt.inc(live(found), 1);
				if (rt.gt(live(found), 1)) {
					yield* g.call(f, P("/proc/qdel"), null, [null, live(_P), "force", 1], rt.Args.Named);
					yield* g.call(f, P("/proc/log_world"), null, [fmt("Map warning: Shuttle Template ＀ has multiple mobile docking ports.", [rt.fv(f, "mappath", live(S))])]);
				} else {
					if (!truthy(rt.fv(f, "timid", live(M)))) {
						yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [(m = fmt("Template ＀ is non-timid! Unloading.", [live(S)])), "code/modules/shuttle/manipulator.dm", 273, live(f.src), live(f.usr)])]);
						yield* g.callName(f, live(M), "jumpToNullSpace", []);
						return live(f.dot);
					} else {
						rt.setSv(f, "preview_shuttle", live(_P));
					}
				}
			}
			if (truthy((rt.istype(live(_P), T("/obj/docking_port/stationary")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/log_world"), null, [fmt("Map warning: Shuttle Template ＀ has a stationary docking port.", [rt.fv(f, "mappath", live(S))])]);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	if (!truthy(live(found))) {
		msg = fmt("load_template(): Shuttle Template ＀ has no\tmobile docking port. Aborting import.", [rt.fv(f, "mappath", live(S))]);
		_T_4 = null;
		rt.forList(f, 0, live(affected));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T_4 = $e;
			yield* g.callName(f, (T0 = live(_T_4)), "empty", []);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/message_admins"), null, [live(msg)]);
		yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [live(msg), "code/modules/shuttle/manipulator.dm", 287, live(f.src), live(f.usr)])]);
		return live(f.dot);
	}
	yield* g.callName(f, live(S), "on_bought", []);
	return f.dot;
}, true);

// /obj/machinery/shuttle_manipulator/proc/unload_preview  (code/modules/shuttle/manipulator.dm:294)  may sleep
rt.def("/obj/machinery/shuttle_manipulator/proc/unload_preview", function* unload_preview(f: Frame) {
	if (truthy(rt.sv(f, "preview_shuttle"))) {
		yield* g.callName(f, rt.sv(f, "preview_shuttle"), "jumpToNullSpace", []);
	}
	rt.setSv(f, "preview_shuttle", null);
	return f.dot;
}, true);
