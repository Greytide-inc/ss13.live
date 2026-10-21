// From code/controllers/subsystem/shuttle.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(39, "/datum/controller/subsystem/shuttle", "/datum/controller/subsystem", {
	mobile: null,
	stationary: null,
	transit: null,
	transit_turfs: null,
	transit_requesters: null,
	transit_request_failures: null,
	clear_transit: 0,
	transit_recolor: null,
	last_dock_time: -1,
	transit_recolor_all: 1,
	emergency: null,
	arrivals: null,
	backup_shuttle: null,
	emergencyCallTime: 6000,
	emergencyDockTime: 1800,
	emergencyEscapeTime: 1200,
	emergencyLastCallLoc: null,
	emergencyCallAmount: 0,
	emergencyNoEscape: null,
	emergencyNoRecall: 0,
	hostileEnvironments: null,
	supply: null,
	ordernum: 1,
	points: 5000,
	centcom_message: "",
	discoveredPlants: null,
	supply_packs: null,
	shoppinglist: null,
	requestlist: null,
	orderhistory: null,
	shuttle_loan: null,
	shuttle_purchased: 0,
	shuttle_purchase_requirements_met: null,
	lockdown: 0,
	name: "Shuttle",
	wait: 10,
	init_order: 3,
	flags: 40,
	runlevels: 6,
});

// /datum/controller/subsystem/shuttle/proc/New  (code/controllers/subsystem/shuttle.dm:4)  may sleep
rt.def("/datum/controller/subsystem/shuttle/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSshuttle"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSshuttle"), T("/datum/controller/subsystem/shuttle")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSshuttle")]);
		}
		rt.setGl("SSshuttle", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/shuttle/proc/<init>  (code/controllers/subsystem/shuttle.dm:11)
rt.def("/datum/controller/subsystem/shuttle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mobile", rt.list());
	$0 = $0;
	rt.setSv(f, "stationary", rt.list());
	$0 = $0;
	rt.setSv(f, "transit", rt.list());
	$0 = $0;
	rt.setSv(f, "transit_turfs", rt.list());
	$0 = $0;
	rt.setSv(f, "transit_requesters", rt.list());
	$0 = $0;
	rt.setSv(f, "transit_request_failures", rt.list());
	$0 = $0;
	rt.setSv(f, "transit_recolor", rt.list());
	$0 = $0;
	rt.setSv(f, "hostileEnvironments", rt.list());
	$0 = $0;
	rt.setSv(f, "discoveredPlants", rt.list());
	$0 = $0;
	rt.setSv(f, "supply_packs", rt.list());
	$0 = $0;
	rt.setSv(f, "shoppinglist", rt.list());
	$0 = $0;
	rt.setSv(f, "requestlist", rt.list());
	$0 = $0;
	rt.setSv(f, "orderhistory", rt.list());
	$0 = $0;
	rt.setSv(f, "shuttle_purchase_requirements_met", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/shuttle/proc/Initialize  (code/controllers/subsystem/shuttle.dm:56)  may sleep
rt.def("/datum/controller/subsystem/shuttle/proc/Initialize", function* Initialize(f: Frame) {
	let pack: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [pack, _P, $e];
	if (!truthy(rt.sv(f, "arrivals"))) {
		yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", ["No /obj/docking_port/mobile/arrivals placed on the map!", "code/controllers/subsystem/shuttle.dm", 57, live(f.src), live(f.usr)])]);
	}
	if (!truthy(rt.sv(f, "emergency"))) {
		yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", ["No /obj/docking_port/mobile/emergency placed on the map!", "code/controllers/subsystem/shuttle.dm", 59, live(f.src), live(f.usr)])]);
	}
	if (!truthy(rt.sv(f, "backup_shuttle"))) {
		yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", ["No /obj/docking_port/mobile/emergency/backup placed on the map!", "code/controllers/subsystem/shuttle.dm", 61, live(f.src), live(f.usr)])]);
	}
	if (!truthy(rt.sv(f, "supply"))) {
		yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", ["No /obj/docking_port/mobile/supply placed on the map!", "code/controllers/subsystem/shuttle.dm", 63, live(f.src), live(f.usr)])]);
	}
	rt.setSv(f, "ordernum", (yield* g.call(f, P("/proc/rand"), null, [1, 9000])));
	pack = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/supply_pack")])), T("/datum/supply_pack")));
	while (($e = rt.next(f, 0)) !== undefined) {
		pack = $e;
		if (!truthy(rt.gv(f, "contains", (_P = (yield* g.new_(f, live(pack), [])))))) {
			continue;
		}
		rt.setAt(rt.sv(f, "supply_packs"), rt.fv(f, "type", live(_P)), live(_P));
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "setup_transit_zone");
	yield* g.srcCall(f, "initial_move");
	yield* g.srcCall(f, "color_space");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["timeofday"] });

// /datum/controller/subsystem/shuttle/proc/setup_transit_zone  (code/controllers/subsystem/shuttle.dm:82)  may sleep
rt.def("/datum/controller/subsystem/shuttle/proc/setup_transit_zone", function* setup_transit_zone(f: Frame) {
	let A: Value = null, B: Value = null, i: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [A, B, i, _T, $e];
	A = rt.getStep(f, rt.locate(8, 8, 11), 0);
	B = rt.getStep(f, rt.locate(subtract(rt.fv(f, "maxx", rt.world()), 8), subtract(rt.fv(f, "maxy", rt.world()), 8), 11), 0);
	rt.setSv(f, "transit_recolor_all", 1);
	i = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/block"), null, [live(A), live(B)])));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.callName(f, (_T = live(i)), "ChangeTurf", [T("/turf/open/space")]);
		rt.modSrcVar(f, "transit_turfs", live(_T), add);
		(rt.modField(f, live(_T), "flags", 2, rt.bitOr));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/shuttle/proc/color_space  (code/controllers/subsystem/shuttle.dm:93)
rt.def("/datum/controller/subsystem/shuttle/proc/color_space", function color_space(f: Frame) {
	let A: Value = null, B: Value = null, todo: Value = null, i: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [A, B, todo, i, _T, $e];
	A = rt.getStep(f, rt.locate(8, 8, 11), 0);
	B = rt.getStep(f, rt.locate(subtract(rt.fv(f, "maxx", rt.world()), 8), subtract(rt.fv(f, "maxy", rt.world()), 8), 11), 0);
	todo = rt.sv(f, "transit_recolor");
	if (truthy(rt.sv(f, "transit_recolor_all"))) {
		todo = rt.call(f, P("/proc/block"), null, [live(A), live(B)]);
	}
	rt.setSv(f, "transit_recolor", rt.list());
	rt.setSv(f, "transit_recolor_all", 0);
	i = null;
	rt.forList(f, 0, live(todo));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if ((truthy((rt.istype((_T = live(i)), T("/turf/open/space/transit")) ? 1 : 0)) || !truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0)))) {
			continue;
		}
		if ((((isEqual(rt.fv(f, "x", live(_T)), rt.fv(f, "x", live(A))) || isEqual(rt.fv(f, "x", live(_T)), rt.fv(f, "x", live(B)))) || isEqual(rt.fv(f, "y", live(_T)), rt.fv(f, "y", live(A)))) || isEqual(rt.fv(f, "y", live(_T)), rt.fv(f, "y", live(B))))) {
			rt.setFv(f, "color", live(_T), "#ffff00");
		} else {
			rt.setFv(f, "color", live(_T), "#00ffff");
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/controller/subsystem/shuttle/proc/fire  (code/controllers/subsystem/shuttle.dm:115)  may sleep
rt.def("/datum/controller/subsystem/shuttle/proc/fire", function* fire(f: Frame) {
	let thing: Value = null, _P: Value = null, changed_transit: Value = null, thing_1: Value = null, _T: Value = null, owner: Value = null, idle: Value = null, not_centcom_evac: Value = null, not_in_use: Value = null, i: Value = null, requester: Value = null, success: Value = null, M: Value = null;
	let $0: any, $e: any;
	f.vars = () => [thing, _P, changed_transit, thing_1, _T, owner, idle, not_centcom_evac, not_in_use, i, requester, success, M, $0, $e];
	thing = null;
	rt.forList(f, 0, rt.sv(f, "mobile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (!truthy(live(thing))) {
			yield* g.callName(f, rt.sv(f, "mobile"), "Remove", [live(thing)]);
			continue;
		}
		yield* g.callName(f, (_P = live(thing)), "check", []);
	}
	rt.endFor(f, 0);
	changed_transit = 0;
	if (!isEqual(rt.sv(f, "last_dock_time"), rt.worldTime(f))) {
		thing_1 = null;
		rt.forList(f, 0, rt.sv(f, "transit"));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing_1 = $e;
			if (!truthy(rt.gv(f, "owner", (_T = live(thing_1))))) {
				yield* g.call(f, P("/proc/qdel"), null, [null, live(_T), "force", 1], rt.Args.Named);
				changed_transit = 1;
			}
			if (truthy((owner = rt.fv(f, "owner", live(_T))))) {
				idle = (isEqual(rt.fv(f, "mode", live(owner)), "idle") ? 1 : 0);
				not_centcom_evac = (isEqual(rt.fv(f, "launch_status", live(owner)), -1) ? 1 : 0);
				not_in_use = (!truthy((yield* g.callName(f, live(_T), "get_docked", []))) ? 1 : 0);
				// tg_js: the arrivals shuttle keeps its transit dock between flights: tearing the strip down and building it again on every departure cost ~150 ms in one tick (atmos-speed step 4).
				if ((((truthy(live(idle)) && truthy(live(not_centcom_evac))) && truthy(live(not_in_use))) && !truthy((rt.istype(live(owner), T("/obj/docking_port/mobile/arrivals")) ? 1 : 0)))) {
					yield* g.call(f, P("/proc/qdel"), null, [null, live(_T), "force", 1], rt.Args.Named);
					changed_transit = 1;
				}
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.sv(f, "clear_transit"))) {
		yield* g.callName(f, rt.sv(f, "transit_requesters"), "Cut", []);
		i = null;
		rt.forList(f, 0, rt.sv(f, "transit"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* g.call(f, P("/proc/qdel"), null, [null, live(i), "force", 1], rt.Args.Named);
		}
		rt.endFor(f, 0);
		yield* g.srcCall(f, "setup_transit_zone");
		rt.setSv(f, "clear_transit", 0);
		changed_transit = 1;
	}
	if (truthy(live(changed_transit))) {
		yield* g.srcCall(f, "color_space");
	}
	while (truthy(rt.len(f, rt.sv(f, "transit_requesters")))) {
		requester = (yield* g.call(f, P("/proc/popleft"), null, [rt.sv(f, "transit_requesters")]));
		if (!truthy((success = (yield* g.srcCall(f, "generate_transit_dock", live(requester)))))) {
			rt.incAt(rt.sv(f, "transit_request_failures"), live(requester), 1, true);
			if (rt.lt(rt.index(rt.sv(f, "transit_request_failures"), live(requester)), 10)) {
				rt.modSrcVar(f, "transit_requesters", live(requester), add);
			} else {
				yield* g.callName(f, (M = live(requester)), "transit_failure", []);
			}
		}
		if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
			$0 = (yield* g.srcCall(f, "pause"));
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			return live(f.dot);
		}
	}
	return f.dot;
}, true);

// /datum/controller/subsystem/shuttle/proc/getShuttle  (code/controllers/subsystem/shuttle.dm:167)
rt.def("/datum/controller/subsystem/shuttle/proc/getShuttle", function getShuttle(f: Frame, id: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.sv(f, "mobile"), T("/obj/docking_port/mobile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "id", live(M)), live(id))) {
			return live(M);
		}
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [fmt("couldn't find shuttle with id: ＀", [live(id)]), "code/controllers/subsystem/shuttle.dm", 170, live(f.src), live(f.usr)])]);
	return f.dot;
});

// /datum/controller/subsystem/shuttle/proc/getDock  (code/controllers/subsystem/shuttle.dm:173)
rt.def("/datum/controller/subsystem/shuttle/proc/getDock", function getDock(f: Frame, id: Value) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	S = null;
	rt.forList(f, 0, rt.sv(f, "stationary"), T("/obj/docking_port/stationary"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (isEqual(rt.fv(f, "id", live(S)), live(id))) {
			return live(S);
		}
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [fmt("couldn't find dock with id: ＀", [live(id)]), "code/controllers/subsystem/shuttle.dm", 176, live(f.src), live(f.usr)])]);
	return f.dot;
});

// /datum/controller/subsystem/shuttle/proc/requestEvac  (code/controllers/subsystem/shuttle.dm:179)  may sleep
rt.def("/datum/controller/subsystem/shuttle/proc/requestEvac", function* requestEvac(f: Frame, user: Value, call_reason: Value) {
	let signal_origin: Value = null, emergency_reason: Value = null, security_num: Value = null;
	let $0: any;
	f.vars = () => [user, call_reason, signal_origin, emergency_reason, security_num, $0];
	if (!truthy(rt.sv(f, "emergency"))) {
		yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", ["requestEvac(): There is no emergency shuttle, but the shuttle was called. Using the backup shuttle instead.", "code/controllers/subsystem/shuttle.dm", 180, live(f.src), live(f.usr)])]);
		if (!truthy(rt.sv(f, "backup_shuttle"))) {
			rt.throw_(f, (yield* g.new_(f, T("/exception"), ["requestEvac(): There is no emergency shuttle, or backup shuttle! The game will be unresolvable. This is possibly a mapping error, more likely a bug with the shuttle manipulation system, or badminry. It is possible to manually resolve this problem by loading an emergency shuttle template manually, and then calling register() on the mobile docking port. Good luck.", "code/controllers/subsystem/shuttle.dm", 183])));
			return live(f.dot);
		}
		rt.setSv(f, "emergency", rt.sv(f, "backup_shuttle"));
	}
	if (rt.lt(subtract(rt.worldTime(f), rt.fv(f, "round_start_time", rt.gl("SSticker"))), rt.fv(f, "shuttle_refuel_delay", rt.gl("config")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("The emergency shuttle is refueling. Please wait another ＀ minutes before trying again.", [rt.op(f, "Abs", [], [(yield* g.call(f, P("/proc/round"), null, [divide(subtract(subtract(rt.worldTime(f), rt.fv(f, "round_start_time", rt.gl("SSticker"))), rt.fv(f, "shuttle_refuel_delay", rt.gl("config"))), 600)]))])])]);
		return live(f.dot);
	}
	$0 = rt.fv(f, "mode", rt.sv(f, "emergency"));
	if ($0 === "recall") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "The emergency shuttle may not be called while returning to Centcom."]);
		return live(f.dot);
	} else if ($0 === "call") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "The emergency shuttle is already on its way."]);
		return live(f.dot);
	} else if ($0 === "docked") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "The emergency shuttle is already here."]);
		return live(f.dot);
	} else if ($0 === "igniting") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "The emergency shuttle is firing its engines to leave."]);
		return live(f.dot);
	} else if ($0 === "escape") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "The emergency shuttle is moving away to a safe distance."]);
		return live(f.dot);
	} else if ($0 === "stranded") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "The emergency shuttle has been disabled by Centcom."]);
		return live(f.dot);
	}
	if ((rt.lt(rt.length((call_reason = (yield* g.call(f, P("/proc/trim"), null, [(yield* g.call(f, P("/proc/html_encode"), null, [live(call_reason)]))])))), 12) && rt.gt((yield* g.call(f, P("/proc/seclevel2num"), null, [(yield* g.call(f, P("/proc/get_security_level"), null, []))])), 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You must provide a reason."]);
		return live(f.dot);
	}
	signal_origin = (yield* g.call(f, P("/proc/get_area"), null, [live(user)]));
	emergency_reason = fmt("\nNature of emergency:\n\n＀", [live(call_reason)]);
	$0 = (security_num = (yield* g.call(f, P("/proc/seclevel2num"), null, [(yield* g.call(f, P("/proc/get_security_level"), null, []))])));
	if ($0 === 2 || $0 === 3) {
		yield* g.callName(f, rt.sv(f, "emergency"), "request", [null, live(signal_origin), (yield* g.call(f, P("/proc/html_decode"), null, [live(emergency_reason)])), 1]);
	} else {
		yield* g.callName(f, rt.sv(f, "emergency"), "request", [null, live(signal_origin), (yield* g.call(f, P("/proc/html_decode"), null, [live(emergency_reason)])), 0]);
	}
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has called the shuttle.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)]))])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has called the shuttle. (<A HREF='?_src_=holder;trigger_centcom_recall=1'>TRIGGER CENTCOM RECALL</A>)", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)]))])]);
	return f.dot;
}, true);

// /datum/controller/subsystem/shuttle/proc/centcom_recall  (code/controllers/subsystem/shuttle.dm:236)  may sleep
rt.def("/datum/controller/subsystem/shuttle/proc/centcom_recall", function* centcom_recall(f: Frame, old_timer: Value, admiral_message: Value) {
	let intercepttext: Value = null;
	f.vars = () => [old_timer, admiral_message, intercepttext];
	if ((!isEqual(rt.fv(f, "mode", rt.sv(f, "emergency")), "call") || !isEqual(rt.fv(f, "timer", rt.sv(f, "emergency")), live(old_timer)))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "emergency"), "cancel", []);
	if (!truthy(live(admiral_message))) {
		admiral_message = rt.op(f, "PickUnweighted", [1], [rt.gl("admiral_messages")]);
	}
	intercepttext = fmt("<font size = 3><b>NanoTrasen Update</b>: Request For Shuttle.</font><hr>To whom it may concern:<br><br>We have taken note of the situation upon ＀ and have come to the conclusion that it does not warrant the abandonment of the station.<br>If you do not agree with our opinion we suggest that you open a direct line with us and explain the nature of your crisis.<br><br><i>This message has been automatically generated based upon readings from long range diagnostic tools. To assure the quality of your request every finalized report is reviewed by an on-call rear admiral.<br><b>Rear Admiral's Notes:</b> ＀", [(yield* g.call(f, P("/proc/station_name"), null, [])), live(admiral_message)]);
	yield* g.call(f, P("/proc/print_command_report"), null, [null, live(intercepttext), "announce", 1], rt.Args.Named);
	return f.dot;
}, true);

// /datum/controller/subsystem/shuttle/proc/emergencyDeregister  (code/controllers/subsystem/shuttle.dm:260)
rt.def("/datum/controller/subsystem/shuttle/proc/emergencyDeregister", function emergencyDeregister(f: Frame) {
	rt.setFv(f, "emergency", live(f.src), rt.fv(f, "backup_shuttle", live(f.src)));
	return f.dot;
});

// /datum/controller/subsystem/shuttle/proc/cancelEvac  (code/controllers/subsystem/shuttle.dm:263)  may sleep
rt.def("/datum/controller/subsystem/shuttle/proc/cancelEvac", function* cancelEvac(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.srcCall(f, "canRecall")))) return f.dot;
	yield* g.callName(f, rt.sv(f, "emergency"), "cancel", [(yield* g.call(f, P("/proc/get_area"), null, [live(user)]))]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has recalled the shuttle.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)]))])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has recalled the shuttle.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)]))])]);
	return 1;
}, true);

// /datum/controller/subsystem/shuttle/proc/canRecall  (code/controllers/subsystem/shuttle.dm:270)
rt.def("/datum/controller/subsystem/shuttle/proc/canRecall", function canRecall(f: Frame) {
	let security_num: Value = null;
	let $0: any;
	f.vars = () => [security_num, $0];
	if ((!truthy(rt.sv(f, "emergency")) || !isEqual(rt.fv(f, "mode", rt.sv(f, "emergency")), "call"))) {
		return live(f.dot);
	}
	if (isEqual(rt.gv(f, "name", rt.fv(f, "mode", rt.gl("SSticker"))), "meteor")) {
		return live(f.dot);
	}
	$0 = (security_num = rt.call(f, P("/proc/seclevel2num"), null, [rt.call(f, P("/proc/get_security_level"), null, [])]));
	if ($0 === 0) {
		if (rt.lt(rt.callName(f, rt.sv(f, "emergency"), "timeLeft", [1]), rt.sv(f, "emergencyCallTime"))) {
			return live(f.dot);
		}
	} else if ($0 === 1) {
		if (rt.lt(rt.callName(f, rt.sv(f, "emergency"), "timeLeft", [1]), multiply(rt.sv(f, "emergencyCallTime"), 0.5))) {
			return live(f.dot);
		}
	} else {
		if (rt.lt(rt.callName(f, rt.sv(f, "emergency"), "timeLeft", [1]), multiply(rt.sv(f, "emergencyCallTime"), 0.25))) {
			return live(f.dot);
		}
	}
	return 1;
});

// /datum/controller/subsystem/shuttle/proc/autoEvac  (code/controllers/subsystem/shuttle.dm:290)  may sleep
rt.def("/datum/controller/subsystem/shuttle/proc/autoEvac", function* autoEvac(f: Frame) {
	let callShuttle: Value = null, thing: Value = null, AI: Value = null, C: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [callShuttle, thing, AI, C, _T, $e];
	callShuttle = 1;
	thing = null;
	rt.forList(f, 0, rt.gl("shuttle_caller_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (truthy((rt.istype(live(thing), T("/mob/living/silicon/ai")) ? 1 : 0))) {
			if ((truthy(rt.gv(f, "deployed_shell", (AI = live(thing)))) && !truthy(rt.gv(f, "client", rt.fv(f, "deployed_shell", live(AI)))))) {
				continue;
			}
			if ((truthy(rt.fv(f, "stat", live(AI))) || !truthy(rt.fv(f, "client", live(AI))))) {
				continue;
			}
		} else {
			if (truthy((rt.istype(live(thing), T("/obj/machinery/computer/communications")) ? 1 : 0))) {
				if (truthy(rt.bitAnd(rt.gv(f, "stat", (C = live(thing))), 1))) {
					continue;
				}
			}
		}
		if ((truthy((_T = rt.getStep(f, live(thing), 0))) && isEqual(rt.fv(f, "z", live(_T)), 2))) {
			callShuttle = 0;
			break;
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(callShuttle))) return f.dot;
	if (!(truthy(rt.fv(f, "emergency", rt.gl("SSshuttle"))) && (isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "idle") || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "recall")))) return f.dot;
	yield* g.callName(f, rt.sv(f, "emergency"), "request", [null, null, "set_coefficient", 2.5], rt.Args.Named);
	yield* g.call(f, P("/proc/log_game"), null, ["There is no means of calling the shuttle anymore. Shuttle automatically called."]);
	yield* g.call(f, P("/proc/message_admins"), null, ["All the communications consoles were destroyed and all AIs are inactive. Shuttle called."]);
	return f.dot;
}, true);

// /datum/controller/subsystem/shuttle/proc/registerHostileEnvironment  (code/controllers/subsystem/shuttle.dm:315)  may sleep
rt.def("/datum/controller/subsystem/shuttle/proc/registerHostileEnvironment", function* registerHostileEnvironment(f: Frame, bad: Value) {
	f.vars = () => [bad];
	rt.setAt(rt.sv(f, "hostileEnvironments"), live(bad), 1);
	yield* g.srcCall(f, "checkHostileEnvironment");
	return f.dot;
}, true);

// /datum/controller/subsystem/shuttle/proc/clearHostileEnvironment  (code/controllers/subsystem/shuttle.dm:318)  may sleep
rt.def("/datum/controller/subsystem/shuttle/proc/clearHostileEnvironment", function* clearHostileEnvironment(f: Frame, bad: Value) {
	f.vars = () => [bad];
	(rt.modSrcVar(f, "hostileEnvironments", live(bad), subtract));
	yield* g.srcCall(f, "checkHostileEnvironment");
	return f.dot;
}, true);

// /datum/controller/subsystem/shuttle/proc/checkHostileEnvironment  (code/controllers/subsystem/shuttle.dm:322)  may sleep
rt.def("/datum/controller/subsystem/shuttle/proc/checkHostileEnvironment", function* checkHostileEnvironment(f: Frame) {
	let d: Value = null;
	let $e: any;
	f.vars = () => [d, $e];
	d = null;
	rt.forList(f, 0, rt.sv(f, "hostileEnvironments"), T("/datum"));
	while (($e = rt.next(f, 0)) !== undefined) {
		d = $e;
		if ((!truthy((rt.istype(live(d), T("/datum")) ? 1 : 0)) || (!truthy(live(d)) || truthy(rt.fv(f, "gc_destroyed", live(d)))))) {
			(rt.modSrcVar(f, "hostileEnvironments", live(d), subtract));
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "emergencyNoEscape", rt.len(f, rt.sv(f, "hostileEnvironments")));
	if ((truthy(rt.sv(f, "emergencyNoEscape")) && isEqual(rt.fv(f, "mode", rt.sv(f, "emergency")), "igniting"))) {
		rt.setFv(f, "mode", rt.sv(f, "emergency"), "stranded");
		rt.setFv(f, "timer", rt.sv(f, "emergency"), null);
		rt.setFv(f, "sound_played", rt.sv(f, "emergency"), 0);
		yield* g.call(f, P("/proc/priority_announce"), null, ["Hostile environment detected. Departure has been postponed indefinitely pending conflict resolution.", null, rt.rsc("sound/misc/notice1.ogg"), "Priority"]);
	}
	if (!(!truthy(rt.sv(f, "emergencyNoEscape")) && isEqual(rt.fv(f, "mode", rt.sv(f, "emergency")), "stranded"))) return f.dot;
	rt.setFv(f, "mode", rt.sv(f, "emergency"), "docked");
	yield* g.callName(f, rt.sv(f, "emergency"), "setTimer", [rt.sv(f, "emergencyDockTime")]);
	yield* g.call(f, P("/proc/priority_announce"), null, ["Hostile environment resolved. You have 3 minutes to board the Emergency Shuttle.", null, rt.rsc("sound/ai/shuttledock.ogg"), "Priority"]);
	return f.dot;
}, true);

// /datum/controller/subsystem/shuttle/proc/toggleShuttle  (code/controllers/subsystem/shuttle.dm:343)  may sleep
rt.def("/datum/controller/subsystem/shuttle/proc/toggleShuttle", function* toggleShuttle(f: Frame, shuttleId: Value, dockHome: Value, dockAway: Value, timed: Value) {
	let M: Value = null, dockedAt: Value = null, destination: Value = null;
	f.vars = () => [shuttleId, dockHome, dockAway, timed, M, dockedAt, destination];
	if (!truthy((M = (yield* g.srcCall(f, "getShuttle", live(shuttleId)))))) {
		return 1;
	}
	dockedAt = (yield* g.callName(f, live(M), "get_docked", []));
	destination = live(dockHome);
	if ((truthy(live(dockedAt)) && isEqual(rt.fv(f, "id", live(dockedAt)), live(dockHome)))) {
		destination = live(dockAway);
	}
	if (truthy(live(timed))) {
		if (truthy((yield* g.callName(f, live(M), "request", [(yield* g.srcCall(f, "getDock", live(destination)))])))) {
			return 2;
		}
	} else {
		if (truthy((yield* g.callName(f, live(M), "dock", [(yield* g.srcCall(f, "getDock", live(destination)))])))) {
			return 2;
		}
	}
	return 0;
}, true);

// /datum/controller/subsystem/shuttle/proc/moveShuttle  (code/controllers/subsystem/shuttle.dm:360)  may sleep
rt.def("/datum/controller/subsystem/shuttle/proc/moveShuttle", function* moveShuttle(f: Frame, shuttleId: Value, dockId: Value, timed: Value) {
	let M: Value = null, D: Value = null;
	f.vars = () => [shuttleId, dockId, timed, M, D];
	M = (yield* g.srcCall(f, "getShuttle", live(shuttleId)));
	D = (yield* g.srcCall(f, "getDock", live(dockId)));
	if (!truthy(live(M))) {
		return 1;
	}
	if (truthy(live(timed))) {
		if (truthy((yield* g.callName(f, live(M), "request", [live(D)])))) {
			return 2;
		}
	} else {
		if (truthy((yield* g.callName(f, live(M), "dock", [live(D)])))) {
			return 2;
		}
	}
	return 0;
}, true);

// /datum/controller/subsystem/shuttle/proc/request_transit_dock  (code/controllers/subsystem/shuttle.dm:374)
rt.def("/datum/controller/subsystem/shuttle/proc/request_transit_dock", function request_transit_dock(f: Frame, M: Value) {
	if (!truthy((rt.istype(live(M), T("/obj/docking_port/mobile")) ? 1 : 0))) {
		rt.throw_(f, rt.new_(f, T("/exception"), [fmt("＀ is not a mobile docking port", [live(M)]), "code/controllers/subsystem/shuttle.dm", 375]));
	}
	if (truthy(rt.fv(f, "assigned_transit", live(M)))) {
		return live(f.dot);
	} else {
		if (truthy((rt.isIn(f, live(M), rt.sv(f, "transit_requesters")) ? 1 : 0))) return f.dot;
		rt.modSrcVar(f, "transit_requesters", live(M), add);
	}
	return f.dot;
});

// /datum/controller/subsystem/shuttle/proc/generate_transit_dock  (code/controllers/subsystem/shuttle.dm:390)  may sleep
rt.def("/datum/controller/subsystem/shuttle/proc/generate_transit_dock", function* generate_transit_dock(f: Frame, M: Value) {
	let travel_dir: Value = null, dock_angle: Value = null, dock_dir: Value = null, transit_width: Value = null, transit_height: Value = null, proposed_zone: Value = null, i: Value = null, topleft: Value = null, bottomright: Value = null, j: Value = null, _T: Value = null, topleft_6: Value = null, coords: Value = null, x0: Value = null, y0: Value = null, x1: Value = null, y1: Value = null, x2: Value = null, y2: Value = null, transit_x: Value = null, transit_y: Value = null, transit_path: Value = null, midpoint: Value = null, A: Value = null, new_transit_dock: Value = null, i_20: Value = null, _T_21: Value = null;
	let $0: any, $e: any;
	f.vars = () => [M, travel_dir, dock_angle, dock_dir, transit_width, transit_height, proposed_zone, i, topleft, bottomright, j, _T, topleft_6, coords, x0, y0, x1, y1, x2, y2, transit_x, transit_y, transit_path, midpoint, A, new_transit_dock, i_20, _T_21, $0, $e];
	travel_dir = rt.fv(f, "preferred_direction", live(M));
	dock_angle = add(add((yield* g.call(f, P("/proc/dir2angle"), null, [rt.fv(f, "preferred_direction", live(M))])), rt.fv(f, "port_angle", live(M))), 180);
	dock_dir = (yield* g.call(f, P("/proc/angle2dir"), null, [live(dock_angle)]));
	transit_width = 16;
	transit_height = 16;
	$0 = live(dock_dir);
	if ($0 === 1 || $0 === 2) {
		transit_width = rt.modify(live(transit_width), rt.fv(f, "width", live(M)), add);
		transit_height = rt.modify(live(transit_height), rt.fv(f, "height", live(M)), add);
	} else if ($0 === 4 || $0 === 8) {
		transit_width = rt.modify(live(transit_width), rt.fv(f, "height", live(M)), add);
		transit_height = rt.modify(live(transit_height), rt.fv(f, "width", live(M)), add);
	}
	proposed_zone = null;
	i = null;
	rt.forList(f, 0, rt.sv(f, "transit_turfs"));
	blk92: {
		loop34: while (true) {
			if (($e = rt.next(f, 0)) === undefined) break;
			i = $e;
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
			if (!truthy(rt.bitAnd(rt.gv(f, "flags", (topleft = live(i))), 2))) {
				continue;
			}
			if (!truthy((bottomright = rt.locate(add(rt.fv(f, "x", live(topleft)), live(transit_width)), add(rt.fv(f, "y", live(topleft)), live(transit_height)), rt.fv(f, "z", live(topleft)))))) {
				continue;
			}
			if (!truthy(rt.bitAnd(rt.fv(f, "flags", live(bottomright)), 2))) {
				continue;
			}
			if (!truthy((proposed_zone = (yield* g.call(f, P("/proc/block"), null, [live(topleft), live(bottomright)]))))) {
				continue;
			}
			j = null;
			rt.forList(f, 1, live(proposed_zone));
			while (($e = rt.next(f, 1)) !== undefined) {
				j = $e;
				if (!truthy((_T = live(j)))) {
					continue loop34;
				}
				if (!truthy(rt.bitAnd(rt.fv(f, "flags", live(_T)), 2))) {
					continue loop34;
				}
			}
			rt.endFor(f, 1);
			break blk92;
		}
		rt.endFor(f, 0);
	}
	if ((!truthy(live(proposed_zone)) || !truthy(rt.len(f, live(proposed_zone))))) {
		return 0;
	}
	topleft_6 = rt.index(live(proposed_zone), 1);
	coords = (yield* g.callName(f, live(M), "return_coords", [0, 0, live(dock_dir)]));
	x0 = rt.index(live(coords), 1);
	y0 = rt.index(live(coords), 2);
	x1 = rt.index(live(coords), 3);
	y1 = rt.index(live(coords), 4);
	x2 = (yield* g.call(f, P("/proc/min"), null, [live(x0), live(x1)]));
	y2 = (yield* g.call(f, P("/proc/min"), null, [live(y0), live(y1)]));
	transit_x = add(add(rt.fv(f, "x", live(topleft_6)), 8), rt.op(f, "Abs", [], [live(x2)]));
	transit_y = add(add(rt.fv(f, "y", live(topleft_6)), 8), rt.op(f, "Abs", [], [live(y2)]));
	transit_path = T("/turf/open/space/transit");
	$0 = live(travel_dir);
	if ($0 === 1) {
		transit_path = T("/turf/open/space/transit/north");
	} else if ($0 === 2) {
		transit_path = T("/turf/open/space/transit/south");
	} else if ($0 === 4) {
		transit_path = T("/turf/open/space/transit/east");
	} else if ($0 === 8) {
		transit_path = T("/turf/open/space/transit/west");
	}
	if (!truthy((midpoint = rt.locate(live(transit_x), live(transit_y), rt.fv(f, "z", live(topleft_6)))))) {
		return 0;
	}
	rt.setFv(f, "parallax_movedir", (A = (yield* g.new_(f, T("/area/shuttle/transit"), []))), live(travel_dir));
	rt.setFv(f, "contents", live(A), live(proposed_zone));
	rt.setFv(f, "assigned_turfs", (new_transit_dock = (yield* g.new_(f, T("/obj/docking_port/stationary/transit"), [live(midpoint)]))), live(proposed_zone));
	rt.setFv(f, "name", live(new_transit_dock), fmt("Transit for ＀/＀", [rt.fv(f, "id", live(M)), rt.fv(f, "name", live(M))]));
	rt.setFv(f, "turf_type", live(new_transit_dock), live(transit_path));
	rt.setFv(f, "owner", live(new_transit_dock), live(M));
	rt.setFv(f, "assigned_area", live(new_transit_dock), live(A));
	yield* g.callName(f, live(new_transit_dock), "setDir", [(yield* g.call(f, P("/proc/angle2dir"), null, [live(dock_angle)]))]);
	i_20 = null;
	rt.forList(f, 0, rt.fv(f, "assigned_turfs", live(new_transit_dock)));
	while (($e = rt.next(f, 0)) !== undefined) {
		i_20 = $e;
		yield* g.callName(f, (_T_21 = live(i_20)), "ChangeTurf", [live(transit_path)]);
		(rt.modField(f, live(_T_21), "flags", 16777213, rt.bitAnd));
	}
	rt.endFor(f, 0);
	rt.setFv(f, "assigned_transit", live(M), live(new_transit_dock));
	return 1;
}, true);

// /datum/controller/subsystem/shuttle/proc/initial_move  (code/controllers/subsystem/shuttle.dm:512)  may sleep
rt.def("/datum/controller/subsystem/shuttle/proc/initial_move", function* initial_move(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.sv(f, "mobile"), T("/obj/docking_port/mobile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (!truthy(rt.fv(f, "roundstart_move", live(M)))) {
			continue;
		}
		yield* g.callName(f, live(M), "dockRoundstart", []);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/shuttle/proc/Recover  (code/controllers/subsystem/shuttle.dm:519)
rt.def("/datum/controller/subsystem/shuttle/proc/Recover", function Recover(f: Frame) {
	if (truthy((rt.istype(rt.fv(f, "mobile", rt.gl("SSshuttle")), T("/list")) ? 1 : 0))) {
		rt.setSv(f, "mobile", rt.fv(f, "mobile", rt.gl("SSshuttle")));
	}
	if (truthy((rt.istype(rt.fv(f, "stationary", rt.gl("SSshuttle")), T("/list")) ? 1 : 0))) {
		rt.setSv(f, "stationary", rt.fv(f, "stationary", rt.gl("SSshuttle")));
	}
	if (truthy((rt.istype(rt.fv(f, "transit", rt.gl("SSshuttle")), T("/list")) ? 1 : 0))) {
		rt.setSv(f, "transit", rt.fv(f, "transit", rt.gl("SSshuttle")));
	}
	if (truthy((rt.istype(rt.fv(f, "discoveredPlants", rt.gl("SSshuttle")), T("/list")) ? 1 : 0))) {
		rt.setSv(f, "discoveredPlants", rt.fv(f, "discoveredPlants", rt.gl("SSshuttle")));
	}
	if (truthy((rt.istype(rt.fv(f, "requestlist", rt.gl("SSshuttle")), T("/list")) ? 1 : 0))) {
		rt.setSv(f, "requestlist", rt.fv(f, "requestlist", rt.gl("SSshuttle")));
	}
	if (truthy((rt.istype(rt.fv(f, "orderhistory", rt.gl("SSshuttle")), T("/list")) ? 1 : 0))) {
		rt.setSv(f, "orderhistory", rt.fv(f, "orderhistory", rt.gl("SSshuttle")));
	}
	if (truthy((rt.istype(rt.fv(f, "emergency", rt.gl("SSshuttle")), T("/obj/docking_port/mobile/emergency")) ? 1 : 0))) {
		rt.setSv(f, "emergency", rt.fv(f, "emergency", rt.gl("SSshuttle")));
	}
	if (truthy((rt.istype(rt.fv(f, "backup_shuttle", rt.gl("SSshuttle")), T("/obj/docking_port/mobile/emergency/backup")) ? 1 : 0))) {
		rt.setSv(f, "backup_shuttle", rt.fv(f, "backup_shuttle", rt.gl("SSshuttle")));
	}
	if (truthy((rt.istype(rt.fv(f, "supply", rt.gl("SSshuttle")), T("/obj/docking_port/mobile/supply")) ? 1 : 0))) {
		rt.setSv(f, "supply", rt.fv(f, "supply", rt.gl("SSshuttle")));
	}
	if (truthy((rt.istype(rt.fv(f, "transit_turfs", rt.gl("SSshuttle")), T("/list")) ? 1 : 0))) {
		rt.setSv(f, "transit_turfs", rt.fv(f, "transit_turfs", rt.gl("SSshuttle")));
	}
	rt.setSv(f, "centcom_message", rt.fv(f, "centcom_message", rt.gl("SSshuttle")));
	rt.setSv(f, "ordernum", rt.fv(f, "ordernum", rt.gl("SSshuttle")));
	rt.setSv(f, "points", rt.fv(f, "points", rt.gl("SSshuttle")));
	return f.dot;
});

// /datum/controller/subsystem/shuttle/proc/is_in_shuttle_bounds  (code/controllers/subsystem/shuttle.dm:546)
rt.def("/datum/controller/subsystem/shuttle/proc/is_in_shuttle_bounds", function is_in_shuttle_bounds(f: Frame, A: Value) {
	let current: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [current, M, $e];
	if ((truthy((rt.istype((current = rt.call(f, P("/proc/get_area"), null, [live(A)])), T("/area/shuttle")) ? 1 : 0)) && !truthy((rt.istype(live(current), T("/area/shuttle/transit")) ? 1 : 0)))) {
		return 1;
	}
	M = null;
	rt.forList(f, 0, rt.sv(f, "mobile"), T("/obj/docking_port/mobile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.callName(f, live(M), "is_in_shuttle_bounds", [live(A)]))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/controller/subsystem/shuttle/proc/get_containing_shuttle  (code/controllers/subsystem/shuttle.dm:554)
rt.def("/datum/controller/subsystem/shuttle/proc/get_containing_shuttle", function get_containing_shuttle(f: Frame, A: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.sv(f, "mobile"), T("/obj/docking_port/mobile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.callName(f, live(M), "is_in_shuttle_bounds", [live(A)]))) {
			return live(M);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
