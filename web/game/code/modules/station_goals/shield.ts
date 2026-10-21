// From code/modules/station_goals/shield.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4204, "/datum/station_goal/station_shield", "/datum/station_goal", {
	coverage_goal: 500,
	name: "Station Shield",
});

// /datum/station_goal/station_shield/proc/get_report  (code/modules/station_goals/shield.dm:9)
rt.def("/datum/station_goal/station_shield/proc/get_report", function get_report(f: Frame) {
	return "The station is located in a zone full of space debris.\n\t\t\t We have a prototype shielding system you must deploy to reduce collision-related accidents.\n\n\t\t\t You can order the satellites and control systems at cargo.\n\t\t\t ";
});

// /datum/station_goal/station_shield/proc/on_report  (code/modules/station_goals/shield.dm:18)
rt.def("/datum/station_goal/station_shield/proc/on_report", function on_report(f: Frame) {
	let _P: Value = null;
	f.vars = () => [_P];
	rt.setFv(f, "special_enabled", (_P = rt.index(rt.fv(f, "supply_packs", rt.gl("SSshuttle")), T("/datum/supply_pack/misc/shield_sat"))), 1);
	rt.setFv(f, "special_enabled", (_P = rt.index(rt.fv(f, "supply_packs", rt.gl("SSshuttle")), T("/datum/supply_pack/misc/shield_sat_control"))), 1);
	return f.dot;
});

// /datum/station_goal/station_shield/proc/check_completion  (code/modules/station_goals/shield.dm:25)
rt.def("/datum/station_goal/station_shield/proc/check_completion", function check_completion(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 1;
	}
	if (rt.ge(rt.callSrc(f, "get_coverage", []), rt.sv(f, "coverage_goal"))) {
		return 1;
	}
	return 0;
});

// /datum/station_goal/proc/get_coverage  (code/modules/station_goals/shield.dm:32)
rt.def("/datum/station_goal/proc/get_coverage", function get_coverage(f: Frame) {
	let coverage: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [coverage, A, $e];
	coverage = rt.list();
	A = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/satellite/meteor_shield"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if ((!truthy(rt.fv(f, "active", live(A))) || !isEqual(rt.fv(f, "z", live(A)), 2))) {
			continue;
		}
		(coverage = rt.modify(live(coverage), rt.call(f, P("/proc/view"), null, [rt.fv(f, "kill_range", live(A)), live(A)]), rt.bitOr));
	}
	rt.endFor(f, 0);
	return rt.len(f, live(coverage));
});

rt.type(10435, "/obj/machinery/computer/sat_control", "/obj/machinery/computer", {
	notice: null,
	circuit: rt.typePath("/obj/item/weapon/circuitboard/machine/computer/sat_control"),
	name: "Satellite control",
	desc: "Used to control the satellite network.",
});

// /obj/machinery/computer/sat_control/proc/ui_interact  (code/modules/station_goals/shield.dm:51)  may sleep
rt.def("/obj/machinery/computer/sat_control/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
		state = rt.gl("default_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "sat_control", rt.sv(f, "name"), 400, 305, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/sat_control/proc/ui_act  (code/modules/station_goals/shield.dm:57)  may sleep
rt.def("/obj/machinery/computer/sat_control/proc/ui_act", function* ui_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "toggle") {
		yield* g.srcCall(f, "toggle", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "id")])));
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/computer/sat_control/proc/toggle  (code/modules/station_goals/shield.dm:65)
rt.def("/obj/machinery/computer/sat_control/proc/toggle", function toggle(f: Frame, id: Value) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	S = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/satellite"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if ((isEqual(rt.fv(f, "id", live(S)), live(id)) && isEqual(rt.fv(f, "z", live(S)), rt.sv(f, "z")))) {
			rt.callName(f, live(S), "toggle", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/computer/sat_control/proc/ui_data  (code/modules/station_goals/shield.dm:70)
rt.def("/obj/machinery/computer/sat_control/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, S: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [data, S, G, $e];
	rt.setAt((data = rt.list()), "satellites", rt.list());
	S = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/satellite"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		rt.modAt(live(data), "satellites", rt.list(rt.alist(f, ["id", rt.fv(f, "id", live(S)), "active", rt.fv(f, "active", live(S)), "mode", rt.fv(f, "mode", live(S))])), add);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "notice", rt.sv(f, "notice"));
	if (truthy((G = rt.locateIn(f, T("/datum/station_goal/station_shield"), rt.gv(f, "station_goals", rt.fv(f, "mode", rt.gl("SSticker"))))))) {
		rt.setAt(live(data), "meteor_shield", 1);
		rt.setAt(live(data), "meteor_shield_coverage", rt.callName(f, live(G), "get_coverage", []));
		rt.setAt(live(data), "meteor_shield_coverage_max", rt.fv(f, "coverage_goal", live(G)));
	}
	return live(data);
});

rt.type(10996, "/obj/machinery/satellite", "/obj/machinery", {
	mode: "NTPROBEV0.8",
	active: 0,
	id: 0,
	use_power: 0,
	name: "Defunct Satellite",
	desc: "",
	icon: rt.rsc("icons/obj/machines/satellite.dmi"),
	icon_state: "sat_inactive",
	density: 1,
}, { global: { gid: 771 } });

// /obj/machinery/satellite/proc/Initialize  (code/modules/station_goals/shield.dm:103)  may sleep
rt.def("/obj/machinery/satellite/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "id", rt.incGl("gid", 1, true));
	return f.dot;
}, true);

// /obj/machinery/satellite/proc/interact  (code/modules/station_goals/shield.dm:107)
rt.def("/obj/machinery/satellite/proc/interact", function interact(f: Frame, user: Value) {
	rt.callSrc(f, "toggle", [live(user)]);
	return f.dot;
});

// /obj/machinery/satellite/proc/toggle  (code/modules/station_goals/shield.dm:110)
rt.def("/obj/machinery/satellite/proc/toggle", function toggle(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if ((!truthy(rt.sv(f, "active")) && !truthy(rt.callSrc(f, "isinspace", [])))) {
		if (truthy(live(user))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You can only active the ＀ in space.</span>", [live(f.src)])]);
		}
		return 0;
	}
	if (truthy(live(user))) {
		$0 = live(user);
		if (truthy(rt.sv(f, "active"))) {
			$1 = "deactivate";
		} else {
			$1 = "activate";
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the ＀</span>", [$1, live(f.src)])]);
	}
	rt.setSv(f, "active", (!truthy(rt.sv(f, "active")) ? 1 : 0));
	if (truthy(rt.sv(f, "active"))) {
		rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_y", 2, "time", 10, "loop", -1]);
		rt.setSv(f, "anchored", 1);
	} else {
		rt.op(f, "Animate", [2, 6], [null, live(f.src), "pixel_y", 0, "time", 10]);
		rt.setSv(f, "anchored", 0);
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/satellite/proc/update_icon  (code/modules/station_goals/shield.dm:126)
rt.def("/obj/machinery/satellite/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.sv(f, "active"))) {
		$0 = "sat_active";
	} else {
		$0 = "sat_inactive";
	}
	rt.setSv(f, "icon_state", $0);
	return f.dot;
});

// /obj/machinery/satellite/proc/attackby  (code/modules/station_goals/shield.dm:129)  may sleep
rt.def("/obj/machinery/satellite/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [$0, $1, $2, $3];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
		$0 = live(f.args[1]);
		$1 = rt.sv(f, "id");
		if (truthy(rt.sv(f, "active"))) {
			$1 = $1;
			$2 = "PRIMARY";
		} else {
			$2 = "STANDBY";
		}
		if (truthy(rt.sv(f, "emagged"))) {
			$3 = "DEBUG_MODE //";
		} else {
			$3 = "";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>// NTSAT-＀ // Mode : ＀ //＀</span>", [$1, $2, $3])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(10997, "/obj/machinery/satellite/meteor_shield", "/obj/machinery/satellite", {
	kill_range: 14,
	mode: "M-SHIELD",
	speed_process: 1,
	name: "Meteor Shield Satellite",
	desc: "Meteor Point Defense Satellite",
});

// /obj/machinery/satellite/meteor_shield/proc/space_los  (code/modules/station_goals/shield.dm:142)
rt.def("/obj/machinery/satellite/meteor_shield/proc/space_los", function space_los(f: Frame, meteor: Value) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	_T = null;
	rt.forList(f, 0, rt.call(f, P("/proc/getline"), null, [live(f.src), live(meteor)]), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (!truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /obj/machinery/satellite/meteor_shield/proc/process  (code/modules/station_goals/shield.dm:148)  may sleep
rt.def("/obj/machinery/satellite/meteor_shield/proc/process", function* process(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	if (!truthy(rt.sv(f, "active"))) {
		return live(f.dot);
	}
	M = null;
	rt.forList(f, 0, rt.gl("meteor_list"), T("/obj/effect/meteor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (!isEqual(rt.fv(f, "z", live(M)), rt.sv(f, "z"))) {
			continue;
		}
		if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(M), live(f.src)])), rt.sv(f, "kill_range"))) {
			continue;
		}
		if ((!truthy(rt.sv(f, "emagged")) && truthy((yield* g.srcCall(f, "space_los", live(M)))))) {
			yield* g.callSrc(f, "Beam", [null, rt.getStep(f, live(M), 0), "icon_state", "sat_beam", "time", 5, "maxdistance", rt.sv(f, "kill_range")], rt.Args.Named);
			yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/satellite/meteor_shield/proc/toggle  (code/modules/station_goals/shield.dm:160)
rt.def("/obj/machinery/satellite/meteor_shield/proc/toggle", function toggle(f: Frame, user: Value) {
	if (!truthy(rt.callSuper(f, [live(user)]))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "emagged"))) return f.dot;
	if (truthy(rt.sv(f, "active"))) {
		rt.callSrc(f, "change_meteor_chance", [2]);
	} else {
		rt.callSrc(f, "change_meteor_chance", [0.5]);
	}
	return f.dot;
});

// /obj/machinery/satellite/meteor_shield/proc/change_meteor_chance  (code/modules/station_goals/shield.dm:169)
rt.def("/obj/machinery/satellite/meteor_shield/proc/change_meteor_chance", function change_meteor_chance(f: Frame, mod: Value) {
	let E: Value = null;
	f.vars = () => [E];
	if (!truthy((E = rt.locateIn(f, T("/datum/round_event_control/meteor_wave"), rt.fv(f, "control", rt.gl("SSevents")))))) return f.dot;
	(rt.modField(f, live(E), "weight", live(mod), multiply));
	return f.dot;
});

// /obj/machinery/satellite/meteor_shield/proc/Destroy  (code/modules/station_goals/shield.dm:174)  may sleep
rt.def("/obj/machinery/satellite/meteor_shield/proc/Destroy", function* Destroy(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(rt.sv(f, "active")) && truthy(rt.sv(f, "emagged")))) return f.dot;
	yield* g.srcCall(f, "change_meteor_chance", 0.5);
	return f.dot;
}, true);

// /obj/machinery/satellite/meteor_shield/proc/emag_act  (code/modules/station_goals/shield.dm:179)
rt.def("/obj/machinery/satellite/meteor_shield/proc/emag_act", function emag_act(f: Frame) {
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.setSv(f, "emagged", 1);
	if (!truthy(rt.sv(f, "active"))) return f.dot;
	rt.callSrc(f, "change_meteor_chance", [2]);
	return f.dot;
});
