// From code/modules/shuttle/emergency.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10433, "/obj/machinery/computer/emergency_shuttle", "/obj/machinery/computer", {
	auth_need: 3,
	authorized: null,
	icon_screen: "shuttle",
	icon_keyboard: "tech_key",
	name: "emergency shuttle console",
	desc: "For shuttle control.",
});

// /obj/machinery/computer/emergency_shuttle/proc/<init>  (code/modules/shuttle/emergency.dm:12)
rt.def("/obj/machinery/computer/emergency_shuttle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "authorized", rt.list());
	return f.dot;
});

// /obj/machinery/computer/emergency_shuttle/proc/attackby  (code/modules/shuttle/emergency.dm:15)  may sleep
rt.def("/obj/machinery/computer/emergency_shuttle/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
		yield* g.srcCall(f, "say", "Please equip your ID card into your ID slot to authenticate.");
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/computer/emergency_shuttle/proc/ui_interact  (code/modules/shuttle/emergency.dm:21)  may sleep
rt.def("/obj/machinery/computer/emergency_shuttle/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
		state = rt.gl("human_adjacent_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "emergency_shuttle_console", rt.sv(f, "name"), 400, 400, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/emergency_shuttle/proc/ui_data  (code/modules/shuttle/emergency.dm:28)
rt.def("/obj/machinery/computer/emergency_shuttle/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, A: Value = null, i: Value = null, ID: Value = null, name: Value = null, job: Value = null;
	let $e: any;
	f.vars = () => [data, A, i, ID, name, job, $e];
	rt.setAt((data = rt.list()), "timer_str", rt.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "getTimerStr", []));
	rt.setAt(live(data), "engines_started", (isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "igniting") ? 1 : 0));
	rt.setAt(live(data), "authorizations_remaining", rt.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "auth_need"), rt.len(f, rt.sv(f, "authorized"))), 0]));
	A = rt.list();
	i = null;
	rt.forList(f, 0, rt.sv(f, "authorized"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		ID = live(i);
		name = rt.fv(f, "registered_name", live(ID));
		job = rt.fv(f, "assignment", live(ID));
		if (truthy(rt.sv(f, "emagged"))) {
			name = rt.call(f, P("/proc/Gibberish"), null, [live(name), 0]);
			job = rt.call(f, P("/proc/Gibberish"), null, [live(job), 0]);
		}
		A = rt.modify(live(A), rt.list(rt.alist(f, ["name", live(name), "job", live(job)])), add);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "authorizations", live(A));
	rt.setAt(live(data), "enabled", (((isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "docked") ? 1 : 0) || (isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "igniting") ? 1 : 0)) && (!isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "igniting") ? 1 : 0)));
	rt.setAt(live(data), "emagged", rt.sv(f, "emagged"));
	return live(data);
});

// /obj/machinery/computer/emergency_shuttle/proc/ui_act  (code/modules/shuttle/emergency.dm:50)  may sleep
rt.def("/obj/machinery/computer/emergency_shuttle/proc/ui_act", function* ui_act(f: Frame) {
	let user: Value = null, ID: Value = null, old_len: Value = null, alert: Value = null, repeal: Value = null, remaining: Value = null;
	let $0: any;
	f.vars = () => [user, ID, old_len, alert, repeal, remaining, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "igniting")) {
		return live(f.dot);
	}
	if (!(isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "docked") || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "igniting"))) {
		return live(f.dot);
	}
	user = live(f.usr);
	f.dot = 0;
	if (!truthy((ID = (yield* g.callName(f, live(user), "get_idcard", []))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You don't have an ID.</span>"]);
		return live(f.dot);
	}
	if (!truthy((rt.isIn(f, 19, rt.fv(f, "access", live(ID))) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The access level of your card is not high enough.</span>"]);
		return live(f.dot);
	}
	old_len = rt.len(f, rt.sv(f, "authorized"));
	$0 = live(f.args[0]);
	if ($0 === "authorize") {
		f.dot = (yield* g.srcCall(f, "authorize", live(user)));
	} else if ($0 === "repeal") {
		(rt.modSrcVar(f, "authorized", live(ID), subtract));
	} else if ($0 === "abort") {
		if (truthy(rt.len(f, rt.sv(f, "authorized")))) {
			yield* g.callName(f, rt.sv(f, "authorized"), "Cut", []);
			f.dot = 1;
		}
	}
	if (!(!isEqual(live(old_len), rt.len(f, rt.sv(f, "authorized"))) && !isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "igniting"))) return f.dot;
	alert = (rt.gt(rt.len(f, rt.sv(f, "authorized")), live(old_len)) ? 1 : 0);
	repeal = (rt.lt(rt.len(f, rt.sv(f, "authorized")), live(old_len)) ? 1 : 0);
	remaining = subtract(rt.sv(f, "auth_need"), rt.len(f, rt.sv(f, "authorized")));
	if ((truthy(rt.len(f, rt.sv(f, "authorized"))) && truthy(live(remaining)))) {
		yield* g.call(f, P("/proc/minor_announce"), null, [fmt("＀ authorizations needed until shuttle is launched early", [live(remaining)]), null, live(alert)]);
	}
	if (!truthy(live(repeal))) return f.dot;
	yield* g.call(f, P("/proc/minor_announce"), null, [fmt("Early launch authorization revoked, ＀ authorizations needed", [live(remaining)])]);
	return f.dot;
}, true, { args: ["action", "params", "ui"] });

// /obj/machinery/computer/emergency_shuttle/proc/authorize  (code/modules/shuttle/emergency.dm:96)
rt.def("/obj/machinery/computer/emergency_shuttle/proc/authorize", function authorize(f: Frame, user: Value, source: Value) {
	let ID: Value = null, i: Value = null, other: Value = null;
	let $e: any;
	f.vars = () => [ID, i, other, $e];
	if (truthy((rt.isIn(f, (ID = rt.callName(f, live(user), "get_idcard", [])), rt.sv(f, "authorized")) ? 1 : 0))) {
		return 0;
	}
	i = null;
	rt.forList(f, 0, rt.sv(f, "authorized"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (isEqual(rt.gv(f, "registered_name", (other = live(i))), rt.fv(f, "registered_name", live(ID)))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	rt.modSrcVar(f, "authorized", live(ID), add);
	rt.call(f, P("/proc/message_admins"), null, [fmt("＀ has authorized early shuttle launch", [fmt("＀＀ ＀", [rt.call(f, P("/proc/key_name_admin"), null, [live(user)]), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])])]), 0, 1]);
	rt.call(f, P("/proc/log_game"), null, [fmt("＀ has authorized early shuttle launch in ＀", [rt.call(f, P("/proc/key_name"), null, [live(user)]), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])])]);
	f.dot = 1;
	rt.callSrc(f, "process", []);
	return f.dot;
});

// /obj/machinery/computer/emergency_shuttle/proc/process  (code/modules/shuttle/emergency.dm:117)
rt.def("/obj/machinery/computer/emergency_shuttle/proc/process", function process(f: Frame) {
	let system_error: Value = null;
	let $0: any;
	f.vars = () => [system_error, $0];
	f.dot = 0;
	if (!truthy(rt.fv(f, "emergency", rt.gl("SSshuttle")))) {
		return live(f.dot);
	}
	if (isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "stranded")) {
		rt.callName(f, rt.sv(f, "authorized"), "Cut", []);
		rt.setSv(f, "emagged", 0);
	}
	if ((isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "igniting") || !(isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "docked") || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "igniting")))) {
		return live(f.dot);
	}
	if (!(rt.ge(rt.len(f, rt.sv(f, "authorized")), rt.sv(f, "auth_need")) || truthy(rt.sv(f, "emagged")))) return f.dot;
	rt.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "setTimer", [100]);
	if (truthy(rt.sv(f, "emagged"))) {
		$0 = "SYSTEM ERROR:";
	} else {
		$0 = null;
	}
	system_error = $0;
	rt.call(f, P("/proc/minor_announce"), null, [null, fmt("The emergency shuttle will launch in ＀ seconds", [rt.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "timeLeft", [])]), null, live(system_error), "alert", 1], rt.Args.Named);
	f.dot = 1;
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/computer/emergency_shuttle/proc/emag_act  (code/modules/shuttle/emergency.dm:138)  may sleep
rt.def("/obj/machinery/computer/emergency_shuttle/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	let time: Value = null, S: Value = null, i: Value = null, ID: Value = null, J: Value = null;
	let $e: any;
	f.vars = () => [user, time, S, i, ID, J, $e];
	if (!(isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "docked") || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "igniting"))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "emagged")) || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "igniting"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The shuttle is already about to launch!</span>"]);
		return live(f.dot);
	}
	time = (yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "timeLeft", []));
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ (<A HREF='?_src_=holder;adminmoreinfo=＃'>?</A>) (<A HREF='?_src_=holder;adminplayerobservefollow=＃'>FLW</A>) has emagged the emergency shuttle ＀ seconds before launch.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [rt.fv(f, "client", live(user))])), live(user), live(user), live(time)]), 0, 1]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has emagged the emergency shuttle in ＀ ＀ seconds before launch.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))]), live(time)])]);
	rt.setSv(f, "emagged", 1);
	S = (yield* g.new_(f, T("/datum/species"), []));
	i = null;
	rt.forRange(f, 0, 1, 10, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		ID = (yield* g.new_(f, T("/obj/item/weapon/card/id"), [live(f.src)]));
		J = rt.op(f, "PickUnweighted", [1], [rt.fv(f, "occupations", rt.gl("SSjob"))]);
		rt.setFv(f, "registered_name", live(ID), (yield* g.callName(f, live(S), "random_name", [rt.op(f, "PickUnweighted", [2], ["male", "female"])])));
		rt.setFv(f, "assignment", live(ID), rt.fv(f, "title", live(J)));
		rt.modSrcVar(f, "authorized", live(ID), add);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "process");
	return f.dot;
}, true);

// /obj/machinery/computer/emergency_shuttle/proc/Destroy  (code/modules/shuttle/emergency.dm:170)  may sleep
rt.def("/obj/machinery/computer/emergency_shuttle/proc/Destroy", function* Destroy(f: Frame) {
	let ID: Value = null;
	let $e: any;
	f.vars = () => [ID, $e];
	ID = null;
	rt.forList(f, 0, live(f.src), T("/obj/item/weapon/card/id"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ID = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(ID)]);
	}
	rt.endFor(f, 0);
	if ((truthy(rt.sv(f, "authorized")) && truthy(rt.len(f, rt.sv(f, "authorized"))))) {
		yield* g.callName(f, rt.sv(f, "authorized"), "Cut", []);
	}
	rt.setSv(f, "authorized", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

rt.type(13049, "/obj/docking_port/mobile/emergency", "/obj/docking_port/mobile", {
	sound_played: 0,
	name: "emergency shuttle",
	id: "emergency",
	dwidth: 9,
	width: 22,
	height: 11,
	dir: 4,
	port_angle: -90,
	roundstart_move: "emergency_away",
});

// /obj/docking_port/mobile/emergency/proc/canDock  (code/modules/shuttle/emergency.dm:191)
rt.def("/obj/docking_port/mobile/emergency/proc/canDock", function canDock(f: Frame, S: Value) {
	return "can_dock";
});

// /obj/docking_port/mobile/emergency/proc/register  (code/modules/shuttle/emergency.dm:194)
rt.def("/obj/docking_port/mobile/emergency/proc/register", function register(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "emergency", rt.gl("SSshuttle"), live(f.src));
	return f.dot;
});

// /obj/docking_port/mobile/emergency/proc/Destroy  (code/modules/shuttle/emergency.dm:200)  may sleep
rt.def("/obj/docking_port/mobile/emergency/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(live(f.args[0]))) {
		if (isEqual(live(f.src), rt.fv(f, "emergency", rt.gl("SSshuttle")))) {
			yield* g.callName(f, rt.gl("SSshuttle"), "emergencyDeregister", []);
		}
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["force"] });

// /obj/docking_port/mobile/emergency/proc/request  (code/modules/shuttle/emergency.dm:207)  may sleep
rt.def("/obj/docking_port/mobile/emergency/proc/request", function* request(f: Frame, S: Value, signalOrigin: Value, reason: Value, redAlert: Value, set_coefficient: Value) {
	let security_num: Value = null, call_time: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [S, signalOrigin, reason, redAlert, set_coefficient, security_num, call_time, $0, $1, $2, $3];
	if (live(set_coefficient) === null) {
		set_coefficient = null;
	}
	if (!truthy((yield* g.call(f, P("/proc/isnum"), null, [live(set_coefficient)])))) {
		$0 = (security_num = (yield* g.call(f, P("/proc/seclevel2num"), null, [(yield* g.call(f, P("/proc/get_security_level"), null, []))])));
		if ($0 === 0) {
			set_coefficient = 2;
		} else if ($0 === 1) {
			set_coefficient = 1;
		} else {
			set_coefficient = 0.5;
		}
	}
	call_time = multiply(multiply(rt.fv(f, "emergencyCallTime", rt.gl("SSshuttle")), live(set_coefficient)), rt.sv(f, "engine_coeff"));
	$0 = rt.sv(f, "mode");
	if ($0 === "recall" || $0 === "idle" || $0 === "call") {
		rt.setSv(f, "mode", "call");
		yield* g.srcCall(f, "setTimer", live(call_time));
	} else {
		return live(f.dot);
	}
	rt.incField(f, rt.gl("SSshuttle"), "emergencyCallAmount", 1, true);
	if (truthy(rt.op(f, "Prob", [], [70]))) {
		rt.setFv(f, "emergencyLastCallLoc", rt.gl("SSshuttle"), live(signalOrigin));
	} else {
		rt.setFv(f, "emergencyLastCallLoc", rt.gl("SSshuttle"), null);
	}
	if (truthy(live(redAlert))) {
		$0 = "Red Alert state confirmed: Dispatching priority shuttle. ";
	} else {
		$0 = "";
	}
	$1 = (yield* g.srcCall(f, "timeLeft", 600));
	$2 = live(reason);
	if (truthy(rt.fv(f, "emergencyLastCallLoc", rt.gl("SSshuttle")))) {
		$3 = "\n\nCall signal traced. Results can be viewed on any communications console.";
	} else {
		$3 = "";
	}
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("The emergency shuttle has been called. ＀It will arrive in ＀ minutes.＀＀", [$0, $1, $2, $3]), null, rt.rsc("sound/ai/shuttlecalled.ogg"), "Priority"]);
	return f.dot;
}, true, { argTypes: [{ type: 4, path: "/obj/docking_port/stationary" }, { type: 128, path: "/area" }, {  }, {  }, {  }] });

// /obj/docking_port/mobile/emergency/proc/cancel  (code/modules/shuttle/emergency.dm:236)  may sleep
rt.def("/obj/docking_port/mobile/emergency/proc/cancel", function* cancel(f: Frame, signalOrigin: Value) {
	let $0: any;
	f.vars = () => [signalOrigin, $0];
	if (!isEqual(rt.sv(f, "mode"), "call")) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "emergencyNoRecall", rt.gl("SSshuttle")))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "invertTimer");
	rt.setSv(f, "mode", "recall");
	if (truthy(rt.op(f, "Prob", [], [70]))) {
		rt.setFv(f, "emergencyLastCallLoc", rt.gl("SSshuttle"), live(signalOrigin));
	} else {
		rt.setFv(f, "emergencyLastCallLoc", rt.gl("SSshuttle"), null);
	}
	if (truthy(rt.fv(f, "emergencyLastCallLoc", rt.gl("SSshuttle")))) {
		$0 = " Recall signal traced. Results can be viewed on any communications console.";
	} else {
		$0 = "";
	}
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("The emergency shuttle has been recalled.＀", [$0]), null, rt.rsc("sound/ai/shuttlerecalled.ogg"), "Priority"]);
	return f.dot;
}, true);

// /obj/docking_port/mobile/emergency/proc/is_hijacked  (code/modules/shuttle/emergency.dm:253)
rt.def("/obj/docking_port/mobile/emergency/proc/is_hijacked", function is_hijacked(f: Frame) {
	let has_people: Value = null, player: Value = null, location: Value = null;
	let $e: any;
	f.vars = () => [has_people, player, location, $e];
	has_people = 0;
	player = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if (truthy(rt.fv(f, "mind", live(player)))) {
			if (!isEqual(rt.fv(f, "stat", live(player)), 2)) {
				if (truthy((rt.istype(live(player), T("/mob/living/silicon")) ? 1 : 0))) {
					continue;
				}
				if (truthy((rt.istype(live(player), T("/mob/living/simple_animal")) ? 1 : 0))) {
					continue;
				}
				if (truthy((rt.istype(live(player), T("/mob/living/brain")) ? 1 : 0))) {
					continue;
				}
				if (isEqual(rt.call(f, P("/proc/get_area"), null, [live(player)]), rt.sv(f, "areaInstance"))) {
					has_people = 1;
					location = rt.getStep(f, rt.gv(f, "current", rt.fv(f, "mind", live(player))), 0);
					if (((!(isEqual(rt.gv(f, "special_role", rt.fv(f, "mind", live(player))), "traitor") || isEqual(rt.gv(f, "special_role", rt.fv(f, "mind", live(player))), "Syndicate")) && !truthy((rt.istype(live(location), T("/turf/open/floor/plasteel/shuttle/red")) ? 1 : 0))) && !truthy((rt.istype(live(location), T("/turf/open/floor/mineral/plastitanium/brig")) ? 1 : 0)))) {
						return 0;
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	return live(has_people);
});

// /obj/docking_port/mobile/emergency/proc/check  (code/modules/shuttle/emergency.dm:271)  may sleep
rt.def("/obj/docking_port/mobile/emergency/proc/check", function* check(f: Frame) {
	let time_left: Value = null, destination: Value = null, query_round_shuttle_name: Value = null, G: Value = null, A: Value = null, M: Value = null, success: Value = null, A_2: Value = null, M_3: Value = null, areas: Value = null, E: Value = null, areas_1: Value = null, E_2: Value = null, destination_dock: Value = null;
	let $0: any, $e: any;
	f.vars = () => [time_left, destination, query_round_shuttle_name, G, A, M, success, A_2, M_3, areas, E, areas_1, E_2, destination_dock, $0, $e];
	if (!truthy(rt.sv(f, "timer"))) {
		return live(f.dot);
	}
	time_left = (yield* g.srcCall(f, "timeLeft", 1));
	if (((!truthy(rt.len(f, rt.sv(f, "ripples"))) && rt.le(live(time_left), 100)) && (isEqual(rt.sv(f, "mode"), "call") || isEqual(rt.sv(f, "mode"), "escape")))) {
		destination = null;
		if (isEqual(rt.sv(f, "mode"), "call")) {
			destination = (yield* g.callName(f, rt.gl("SSshuttle"), "getDock", ["emergency_home"]));
		} else {
			if (isEqual(rt.sv(f, "mode"), "escape")) {
				destination = (yield* g.callName(f, rt.gl("SSshuttle"), "getDock", ["emergency_away"]));
			}
		}
		yield* g.srcCall(f, "create_ripples", live(destination));
	}
	$0 = rt.sv(f, "mode");
	if ($0 === "recall") {
		if (rt.le(live(time_left), 0)) {
			rt.setSv(f, "mode", "idle");
			rt.setSv(f, "timer", 0);
		}
	} else if ($0 === "call") {
		if (rt.le(live(time_left), 0)) {
			if (truthy((yield* g.srcCall(f, "dock", (yield* g.callName(f, rt.gl("SSshuttle"), "getDock", ["emergency_home"])))))) {
				yield* g.srcCall(f, "setTimer", 20);
				return live(f.dot);
			}
			rt.setSv(f, "mode", "docked");
			yield* g.srcCall(f, "setTimer", rt.fv(f, "emergencyDockTime", rt.gl("SSshuttle")));
			yield* g.call(f, P("/proc/priority_announce"), null, [fmt("The Emergency Shuttle has docked with the station. You have ＀ minutes to board the Emergency Shuttle.", [(yield* g.srcCall(f, "timeLeft", 600))]), null, rt.rsc("sound/ai/shuttledock.ogg"), "Priority"]);
			G = null;
			rt.forList(f, 0, rt.gv(f, "gangs", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/gang"));
			while (($e = rt.next(f, 0)) !== undefined) {
				G = $e;
				if (truthy(rt.fv(f, "is_dominating", live(G)))) {
					rt.setFv(f, "dom_attempts", live(G), 0);
				} else {
					rt.setFv(f, "dom_attempts", live(G), (yield* g.call(f, P("/proc/min"), null, [1, rt.fv(f, "dom_attempts", live(G))])));
				}
			}
			rt.endFor(f, 0);
		}
	} else if ($0 === "docked") {
		if (rt.le(live(time_left), 100)) {
			rt.setSv(f, "mode", "igniting");
			yield* g.callName(f, rt.gl("SSshuttle"), "checkHostileEnvironment", []);
			if (isEqual(rt.sv(f, "mode"), "stranded")) {
				return live(f.dot);
			}
			A = null;
			rt.forList(f, 0, rt.fv(f, "mobile", rt.gl("SSshuttle")));
			while (($e = rt.next(f, 0)) !== undefined) {
				A = $e;
				if (isEqual(rt.gv(f, "launch_status", (M = live(A))), 0)) {
					yield* g.callName(f, live(M), "check_transit_zone", []);
				}
			}
			rt.endFor(f, 0);
		}
	} else if ($0 === "igniting") {
		success = 1;
		yield* g.callName(f, rt.gl("SSshuttle"), "checkHostileEnvironment", []);
		if (isEqual(rt.sv(f, "mode"), "stranded")) {
			return live(f.dot);
		}
		(success = rt.modify(live(success), (isEqual((yield* g.srcCall(f, "check_transit_zone")), 2) ? 1 : 0), rt.bitAnd));
		A_2 = null;
		rt.forList(f, 0, rt.fv(f, "mobile", rt.gl("SSshuttle")));
		while (($e = rt.next(f, 0)) !== undefined) {
			A_2 = $e;
			if (isEqual(rt.gv(f, "launch_status", (M_3 = live(A_2))), 0)) {
				(success = rt.modify(live(success), (isEqual((yield* g.callName(f, live(M_3), "check_transit_zone", [])), 2) ? 1 : 0), rt.bitAnd));
			}
		}
		rt.endFor(f, 0);
		if (!truthy(live(success))) {
			yield* g.srcCall(f, "setTimer", 100);
		}
		if ((rt.le(live(time_left), 50) && !truthy(rt.sv(f, "sound_played")))) {
			rt.setSv(f, "sound_played", 1);
			areas = rt.list();
			E = null;
			rt.forList(f, 0, rt.gl("sortedAreas"), T("/area/shuttle/escape"));
			while (($e = rt.next(f, 0)) !== undefined) {
				E = $e;
				areas = rt.modify(live(areas), live(E), add);
			}
			rt.endFor(f, 0);
			yield* g.srcCall(f, "hyperspace_sound", 1, live(areas));
		}
		if ((rt.le(live(time_left), 0) && !truthy(rt.fv(f, "emergencyNoEscape", rt.gl("SSshuttle"))))) {
			A_2 = null;
			rt.forList(f, 0, rt.fv(f, "mobile", rt.gl("SSshuttle")));
			while (($e = rt.next(f, 0)) !== undefined) {
				A_2 = $e;
				yield* g.callName(f, (M_3 = live(A_2)), "on_emergency_launch", []);
			}
			rt.endFor(f, 0);
			areas = rt.list();
			E = null;
			rt.forList(f, 0, rt.gl("sortedAreas"), T("/area/shuttle/escape"));
			while (($e = rt.next(f, 0)) !== undefined) {
				E = $e;
				areas = rt.modify(live(areas), live(E), add);
			}
			rt.endFor(f, 0);
			yield* g.srcCall(f, "hyperspace_sound", 2, live(areas));
			yield* g.srcCall(f, "enterTransit");
			rt.setSv(f, "mode", "escape");
			rt.setSv(f, "launch_status", 1);
			yield* g.srcCall(f, "setTimer", multiply(rt.fv(f, "emergencyEscapeTime", rt.gl("SSshuttle")), rt.sv(f, "engine_coeff")));
			yield* g.call(f, P("/proc/priority_announce"), null, [fmt("The Emergency Shuttle has left the station. Estimate ＀ minutes until the shuttle docks at Central Command.", [(yield* g.srcCall(f, "timeLeft", 600))]), null, null, "Priority"]);
		}
	} else if ($0 === "stranded") {
		yield* g.callName(f, rt.gl("SSshuttle"), "checkHostileEnvironment", []);
	} else if ($0 === "escape") {
		if ((truthy(rt.sv(f, "sound_played")) && rt.le(live(time_left), 5))) {
			areas_1 = rt.list();
			E_2 = null;
			rt.forList(f, 0, rt.gl("sortedAreas"), T("/area/shuttle/escape"));
			while (($e = rt.next(f, 0)) !== undefined) {
				E_2 = $e;
				areas_1 = rt.modify(live(areas_1), live(E_2), add);
			}
			rt.endFor(f, 0);
			yield* g.srcCall(f, "hyperspace_sound", 3, live(areas_1));
		}
		if ((truthy(rt.fv(f, "parallax_movedir", rt.sv(f, "areaInstance"))) && rt.le(live(time_left), 25))) {
			yield* g.srcCall(f, "parallax_slowdown");
			A = null;
			rt.forList(f, 0, rt.fv(f, "mobile", rt.gl("SSshuttle")));
			while (($e = rt.next(f, 0)) !== undefined) {
				A = $e;
				if (isEqual(rt.gv(f, "launch_status", (M = live(A))), 1)) {
					if (truthy((rt.istype(live(M), T("/obj/docking_port/mobile/pod")) ? 1 : 0))) {
						yield* g.callName(f, live(M), "parallax_slowdown", []);
					}
				}
			}
			rt.endFor(f, 0);
		}
		if (!rt.le(live(time_left), 0)) return f.dot;
		A = null;
		rt.forList(f, 0, rt.fv(f, "mobile", rt.gl("SSshuttle")));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			yield* g.callName(f, (M = live(A)), "on_emergency_dock", []);
		}
		rt.endFor(f, 0);
		destination_dock = "emergency_away";
		if (truthy((yield* g.srcCall(f, "is_hijacked")))) {
			destination_dock = "emergency_syndicate";
			yield* g.call(f, P("/proc/minor_announce"), null, [null, "Corruption detected in shuttle navigation protocols. Please contact your supervisor.", null, "SYSTEM ERROR:", "alert", 1], rt.Args.Named);
		}
		yield* g.srcCall(f, "dock_id", live(destination_dock));
		rt.setSv(f, "mode", "endgame: game over");
		rt.setSv(f, "timer", 0);
	}
	return f.dot;
}, true);

// /obj/docking_port/mobile/emergency/proc/transit_failure  (code/modules/shuttle/emergency.dm:400)  may sleep
rt.def("/obj/docking_port/mobile/emergency/proc/transit_failure", function* transit_failure(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/message_admins"), null, ["Moving emergency shuttle directly to centcom dock to prevent deadlock."]);
	rt.setSv(f, "mode", "escape");
	rt.setSv(f, "launch_status", 1);
	yield* g.srcCall(f, "setTimer", rt.fv(f, "emergencyEscapeTime", rt.gl("SSshuttle")));
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("The Emergency Shuttle preparing for direct jump. Estimate ＀ minutes until the shuttle docks at Central Command.", [(yield* g.srcCall(f, "timeLeft", 600))]), null, null, "Priority"]);
	return f.dot;
}, true);

rt.type(13051, "/obj/docking_port/mobile/pod", "/obj/docking_port/mobile", {
	name: "escape pod",
	id: "pod",
	dwidth: 1,
	width: 3,
	height: 4,
	launch_status: 0,
});

// /obj/docking_port/mobile/pod/proc/request  (code/modules/shuttle/emergency.dm:418)
rt.def("/obj/docking_port/mobile/pod/proc/request", function request(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	S = rt.callSrc(f, "getControlConsole", []);
	if (((isEqual(rt.gl("security_level"), 2) || isEqual(rt.gl("security_level"), 3)) || (truthy(live(S)) && truthy(rt.fv(f, "emagged", live(S)))))) {
		if (isEqual(rt.sv(f, "launch_status"), 0)) {
			rt.setSv(f, "launch_status", 2);
			return rt.callSuper(f, [], rt.Args.Same);
		}
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Escape pods will only launch during \"Code Red\" security alert.</span>"]);
		return 1;
	}
	return f.dot;
});

// /obj/docking_port/mobile/pod/proc/Initialize  (code/modules/shuttle/emergency.dm:429)  may sleep
rt.def("/obj/docking_port/mobile/pod/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!isEqual(rt.sv(f, "id"), "pod")) return f.dot;
	yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [fmt("＀ id has not been changed from the default. Use the id convention \"pod1\" \"pod2\" etc.", [rt.sv(f, "type")]), "code/modules/shuttle/emergency.dm", 431, live(f.src), live(f.usr)])]);
	return f.dot;
}, true);

rt.type(10394, "/obj/machinery/computer/shuttle/pod", "/obj/machinery/computer/shuttle", {
	admin_controlled: 1,
	shuttleId: "pod",
	possible_destinations: "pod_asteroid",
	light_color: "#6496FA",
	clockwork: 1,
	name: "pod control computer",
	icon: rt.rsc("icons/obj/terminals.dmi"),
	icon_state: "dorm_available",
	density: 0,
});

// /obj/machinery/computer/shuttle/pod/proc/emag_act  (code/modules/shuttle/emergency.dm:451)
rt.def("/obj/machinery/computer/shuttle/pod/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.setSv(f, "emagged", 1);
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You fry the pod's alert level checking system.</span>"]);
	return f.dot;
});

rt.type(13055, "/obj/docking_port/stationary/random", "/obj/docking_port/stationary", {
	edge_distance: 16,
	target_area: rt.typePath("/area/lavaland/surface/outdoors"),
	name: "escape pod",
	id: "pod",
	dwidth: 1,
	width: 3,
	height: 4,
});

// /obj/docking_port/stationary/random/proc/Initialize  (code/modules/shuttle/emergency.dm:466)
rt.def("/obj/docking_port/stationary/random/proc/Initialize", function Initialize(f: Frame) {
	let turfs: Value = null, _T: Value = null;
	f.vars = () => [turfs, _T];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[0]))) {
		return live(f.dot);
	}
	turfs = rt.call(f, P("/proc/get_area_turfs"), null, [rt.sv(f, "target_area")]);
	_T = rt.op(f, "PickUnweighted", [1], [live(turfs)]);
	while (truthy(rt.len(f, live(turfs)))) {
		if ((((rt.lt(rt.fv(f, "x", live(_T)), rt.sv(f, "edge_distance")) || rt.lt(rt.fv(f, "y", live(_T)), rt.sv(f, "edge_distance"))) || rt.lt(subtract(add(rt.fv(f, "maxx", rt.world()), 1), rt.fv(f, "x", live(_T))), rt.sv(f, "edge_distance"))) || rt.lt(subtract(add(rt.fv(f, "maxy", rt.world()), 1), rt.fv(f, "y", live(_T))), rt.sv(f, "edge_distance")))) {
			(turfs = rt.modify(live(turfs), live(_T), subtract));
			_T = rt.op(f, "PickUnweighted", [1], [live(turfs)]);
		} else {
			rt.setFv(f, "loc", live(f.src), live(_T));
			break;
		}
	}
	return f.dot;
}, false, { args: ["mapload"] });

rt.type(5607, "/obj/item/weapon/storage/pod", "/obj/item/weapon/storage", {
	unlocked: 0,
	anchored: 1,
	name: "emergency space suits",
	desc: "A wall mounted safe containing space suits. Will only open in emergencies.",
	density: 0,
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "safe",
});

// /obj/item/weapon/storage/pod/proc/PopulateContents  (code/modules/shuttle/emergency.dm:509)  may sleep
rt.def("/obj/item/weapon/storage/pod/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/clothing/head/helmet/space/orange"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/helmet/space/orange"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/space/orange"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/space/orange"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/gas"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/gas"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/tank/internals/oxygen/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/tank/internals/oxygen/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/pickaxe/emergency"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/pickaxe/emergency"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/survivalcapsule"), [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/storage/pod/proc/MouseDrop  (code/modules/shuttle/emergency.dm:525)  may sleep
rt.def("/obj/item/weapon/storage/pod/proc/MouseDrop", function* MouseDrop(f: Frame) {
	if (((isEqual(rt.gl("security_level"), 2) || isEqual(rt.gl("security_level"), 3)) || truthy(rt.sv(f, "unlocked")))) {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The storage unit will only unlock during a Red or Delta security alert."]);
	}
	return f.dot;
}, true, { args: ["over_object", "src_location", "over_location"] });

// /obj/item/weapon/storage/pod/proc/attack_hand  (code/modules/shuttle/emergency.dm:531)  may sleep
rt.def("/obj/item/weapon/storage/pod/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "MouseDrop", live(user)));
}, true);

// /obj/item/weapon/storage/pod/proc/onShuttleMove  (code/modules/shuttle/emergency.dm:536)  may sleep
rt.def("/obj/item/weapon/storage/pod/proc/onShuttleMove", function* onShuttleMove(f: Frame) {
	rt.setSv(f, "unlocked", 1);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(13050, "/obj/docking_port/mobile/emergency/backup", "/obj/docking_port/mobile/emergency", {
	name: "backup shuttle",
	id: "backup",
	dwidth: 2,
	width: 8,
	height: 8,
	dir: 4,
	roundstart_move: "backup_away",
});

// /obj/docking_port/mobile/emergency/backup/proc/Initialize  (code/modules/shuttle/emergency.dm:554)  may sleep
rt.def("/obj/docking_port/mobile/emergency/backup/proc/Initialize", function* Initialize(f: Frame) {
	let current_emergency: Value = null;
	f.vars = () => [current_emergency];
	current_emergency = rt.fv(f, "emergency", rt.gl("SSshuttle"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "emergency", rt.gl("SSshuttle"), live(current_emergency));
	rt.setFv(f, "backup_shuttle", rt.gl("SSshuttle"), live(f.src));
	return f.dot;
}, true);
