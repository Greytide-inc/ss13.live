// Based on /tg/station's code/modules/shuttle/manipulator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


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

// manipulator.dm:24
rt.def("/obj/machinery/shuttle_manipulator/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.update_icon();
	return f.dot;
}, true);

// manipulator.dm:28
rt.def("/obj/machinery/shuttle_manipulator/proc/update_icon", function update_icon(f: Frame) {
	let hologram_projection: Value = null, hologram_ship: Value = null;
	this.cut_overlays();
	(hologram_projection = mutable_appearance(this.icon, "hologram_on")).pixel_y = 22;
	(hologram_ship = mutable_appearance(this.icon, "hologram_whiteship")).pixel_y = 27;
	this.add_overlay(hologram_projection);
	this.add_overlay(hologram_ship);
	return f.dot;
});

// manipulator.dm:40
rt.def("/obj/machinery/shuttle_manipulator/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.admin_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "shuttle_manipulator", this.name, 800, 600, master_ui, state))).open();
	return f.dot;
}, true);

// manipulator.dm:47
rt.def("/proc/shuttlemode2str", function shuttlemode2str(f: Frame, mode: Value) {
	if (mode === "idle") {
		f.dot = "idle";
	} else if (mode === "igniting") {
		f.dot = "engines charging";
	} else if (mode === "recall") {
		f.dot = "recalled";
	} else if (mode === "call") {
		f.dot = "called";
	} else if (mode === "docked") {
		f.dot = "docked";
	} else if (mode === "stranded") {
		f.dot = "stranded";
	} else if (mode === "escape") {
		f.dot = "escape";
	} else if (mode === "endgame: game over") {
		f.dot = "endgame";
	}
	if (f.dot) return f.dot;
	rt.throw_(f, new_(T("/exception"), `shuttlemode2str(): invalid mode ${mode}`, "code/modules/shuttle/manipulator.dm", 65));
	return f.dot;
});

// manipulator.dm:69
rt.def("/obj/machinery/shuttle_manipulator/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let data: Value = null, shuttle_id: Value = null, S: Value = null, L: Value = null, i: Value = null, M: Value = null, can_fast_travel: Value = null;
	rt.setAt((data = list()), "tabs", list("Status", "Templates", "Modification"));
	rt.setAt(data, "templates", list());
	let templates: Value = rt.at(data, "templates");
	rt.setAt(data, "templates_tabs", list());
	rt.setAt(data, "selected", list());
	for (shuttle_id of each(GLOB.SSmapping.shuttle_templates)) {
		S = rt.index(GLOB.SSmapping.shuttle_templates, shuttle_id);
		if (!rt.index(templates, S.port_id)) {
			rt.modAt(data, "templates_tabs", S.port_id, add);
			rt.setAt(templates, S.port_id, rt.alist(f, ["port_id", S.port_id, "templates", list()]));
		}
		rt.setAt((L = list()), "name", S.name);
		rt.setAt(L, "shuttle_id", S.shuttle_id);
		rt.setAt(L, "port_id", S.port_id);
		rt.setAt(L, "description", S.description);
		rt.setAt(L, "admin_notes", S.admin_notes);
		if (this.selected == S) {
			rt.setAt(data, "selected", L);
		}
		rt.modAt(rt.index(templates, S.port_id), "templates", list(L), add);
	}
	rt.setAt(data, "templates_tabs", (yield* sortList(rt.at(data, "templates_tabs"))));
	rt.setAt(data, "existing_shuttle", null);
	rt.setAt(data, "shuttles", list());
	for (i of each(GLOB.SSshuttle.mobile)) {
		M = i;
		rt.setAt((L = list()), "name", M.name);
		rt.setAt(L, "id", M.id);
		rt.setAt(L, "timer", M.timer);
		rt.setAt(L, "timeleft", M.getTimerStr());
		can_fast_travel = 0;
		if (M.timer && M.timeLeft() >= 50) {
			can_fast_travel = 1;
		}
		rt.setAt(L, "can_fast_travel", can_fast_travel);
		rt.setAt(L, "mode", capitalize(shuttlemode2str(M.mode)));
		rt.setAt(L, "status", M.getStatusText());
		if (M == this.existing_shuttle) {
			rt.setAt(data, "existing_shuttle", L);
		}
		rt.modAt(data, "shuttles", list(L), add);
	}
	return data;
}, true);

// manipulator.dm:126
rt.def("/obj/machinery/shuttle_manipulator/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let i: Value = null, M: Value = null, mdp: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	let user: Value = f.usr;
	let shuttle_id: Value = rt.at(params, "shuttle_id");
	let S: Value = rt.index(GLOB.SSmapping.shuttle_templates, shuttle_id);
	if (action === "select_template") {
		if (S) {
			this.existing_shuttle = GLOB.SSshuttle.getShuttle(S.port_id);
			this.selected = S;
			f.dot = 1;
		}
	} else if (action === "jump_to") {
		if (rt.at(params, "type") == "mobile") {
			for (i of each(GLOB.SSshuttle.mobile)) {
				if ((M = i).id == rt.at(params, "id")) {
					yield* user.forceMove(rt.getStep(f, M, 0));
					f.dot = 1;
					break;
				}
			}
		}
	} else if (action === "fast_travel") {
		i = null;
		for (i of each(GLOB.SSshuttle.mobile)) {
			if ((M = i).id == rt.at(params, "id") && M.timer && M.timeLeft() >= 50) {
				M.setTimer(50);
				f.dot = 1;
				message_admins(`${key_name_admin(f.usr)} fast travelled ${M}`);
				log_admin(`${key_name(f.usr)} fast travelled ${M}`);
				break;
			}
		}
	} else if (action === "preview") {
		if (S) {
			f.dot = 1;
			yield* this.unload_preview();
			yield* this.load_template(S);
			if (this.preview_shuttle) {
				this.preview_template = S;
				yield* user.forceMove(rt.getStep(f, this.preview_shuttle, 0));
			}
		}
	} else if (action === "load") {
		if (this.existing_shuttle == GLOB.SSshuttle.backup_shuttle) {
			warning(`${"The shuttle that the selected shuttle will replace is the backup shuttle. Backup shuttle is required to be intact for round sanity."} in ${"code/modules/shuttle/manipulator.dm"} at line ${172} src: ${this} usr: ${f.usr}.`);
		} else if (S) {
			f.dot = 1;
			if (mdp = (yield* this.action_load(S))) {
				yield* user.forceMove(rt.getStep(f, mdp, 0));
				message_admins(`${key_name_admin(f.usr)} loaded ${mdp} with the shuttle manipulator.`);
				log_admin(`${key_name(f.usr)} loaded ${mdp} with the shuttle manipulator.</span>`);
			}
		}
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// manipulator.dm:192
rt.def("/obj/machinery/shuttle_manipulator/proc/action_load", function* action_load(f: Frame, loading_template: Value) {
	let D: Value = null, m: Value = null, result: Value = null, m_4: Value = null;
	if (this.preview_shuttle && loading_template != this.preview_template) {
		yield* this.preview_shuttle.jumpToNullSpace();
		this.preview_shuttle = null;
		this.preview_template = null;
	}
	if (!this.preview_shuttle) {
		yield* this.load_template(loading_template);
		this.preview_template = loading_template;
	}
	let timer: Value = 0;
	let mode: Value = "idle";
	if (this.existing_shuttle) {
		timer = this.existing_shuttle.timer;
		mode = this.existing_shuttle.mode;
		D = this.existing_shuttle.get_docked();
	} else {
		D = this.preview_shuttle.findRoundstartDock();
	}
	if (!D) {
		warning(`${(m = "No dock found for preview shuttle, aborting.")} in ${"code/modules/shuttle/manipulator.dm"} at line ${215} src: ${this} usr: ${f.usr}.`);
		rt.throw_(f, (yield* new_(T("/exception"), m, "code/modules/shuttle/manipulator.dm", 216)));
	}
	if ((result = this.preview_shuttle.canDock(D)) != "can_dock" && result != "someone_else_docked") {
		warning(`${(m_4 = `Unsuccessful dock of ${this.preview_shuttle} (${result}).`)} in ${"code/modules/shuttle/manipulator.dm"} at line ${224} src: ${this} usr: ${f.usr}.`);
		return f.dot;
	}
	yield* this.existing_shuttle.jumpToNullSpace();
	yield* this.preview_shuttle.dock(D);
	f.dot = this.preview_shuttle;
	this.preview_shuttle.timer = timer;
	this.preview_shuttle.mode = mode;
	yield* this.preview_shuttle.register();
	this.preview_shuttle = null;
	this.preview_template = null;
	this.existing_shuttle = null;
	this.selected = null;
	return f.dot;
}, true);

// manipulator.dm:249
rt.def("/obj/machinery/shuttle_manipulator/proc/load_template", function* load_template(f: Frame, S: Value) {
	let _T: Value = null, _P: Value = null, M: Value = null, m: Value = null, msg: Value = null, _T_4: Value = null, T0: Value = null;
	let landmark_turf: Value = rt.getStep(f, rt.locateIn(f, "landmark*Shuttle Import", rt.world()), 0);
	yield* S.load(landmark_turf, { centered: 1 });
	let affected: Value = (yield* S.get_affected_turfs(landmark_turf, { centered: 1 }));
	let found: Value = 0;
	for (_T of each(affected)) {
		_P = null;
		for (_P of each(_T, T("/obj/docking_port"))) {
			if (rt.istype(_P, T("/obj/docking_port/mobile"))) {
				M = _P;
				found++;
				if (found > 1) {
					yield* qdel(_P, { force: 1 });
					log_world(`Map warning: Shuttle Template ${S.mappath} has multiple mobile docking ports.`);
				} else if (!M.timid) {
					warning(`${(m = `Template ${S} is non-timid! Unloading.`)} in ${"code/modules/shuttle/manipulator.dm"} at line ${273} src: ${this} usr: ${f.usr}.`);
					yield* M.jumpToNullSpace();
					return f.dot;
				} else {
					this.preview_shuttle = _P;
				}
			}
			if (rt.istype(_P, T("/obj/docking_port/stationary"))) {
				log_world(`Map warning: Shuttle Template ${S.mappath} has a stationary docking port.`);
			}
		}
	}
	if (!found) {
		msg = `load_template(): Shuttle Template ${S.mappath} has no\tmobile docking port. Aborting import.`;
		for (_T_4 of each(affected)) {
			yield* (T0 = _T_4).empty();
		}
		message_admins(msg);
		warning(`${msg} in ${"code/modules/shuttle/manipulator.dm"} at line ${287} src: ${this} usr: ${f.usr}.`);
		return f.dot;
	}
	S.on_bought();
	return f.dot;
}, true);

// manipulator.dm:294
rt.def("/obj/machinery/shuttle_manipulator/proc/unload_preview", function* unload_preview(f: Frame) {
	if (this.preview_shuttle) {
		yield* this.preview_shuttle.jumpToNullSpace();
	}
	this.preview_shuttle = null;
	return f.dot;
}, true);
