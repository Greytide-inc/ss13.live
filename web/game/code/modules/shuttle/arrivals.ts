// From code/modules/shuttle/arrivals.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13046, "/obj/docking_port/mobile/arrivals", "/obj/docking_port/mobile", {
	sound_played: null,
	damaged: null,
	areas: null,
	queued_announces: null,
	console: null,
	force_depart: 0,
	perma_docked: 0,
	name: "arrivals shuttle",
	id: "arrivals",
	dwidth: 3,
	width: 7,
	height: 15,
	dir: 8,
	port_angle: 180,
	callTime: 1e+31,
	ignitionTime: 50,
	roundstart_move: 1,
});

// /obj/docking_port/mobile/arrivals/proc/Initialize  (code/modules/shuttle/arrivals.dm:25)  may sleep
rt.def("/obj/docking_port/mobile/arrivals/proc/Initialize", function* Initialize(f: Frame) {
	if (truthy(rt.fv(f, "arrivals", rt.gl("SSshuttle")))) {
		yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", ["More than one arrivals docking_port placed on map!", "code/modules/shuttle/arrivals.dm", 26, live(f.src), live(f.usr)])]);
		return 2;
	}
	rt.setFv(f, "arrivals", rt.gl("SSshuttle"), live(f.src));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "preferred_direction", rt.sv(f, "dir"));
	return 1;
}, true, { args: ["mapload"] });

// /obj/docking_port/mobile/arrivals/proc/LateInitialize  (code/modules/shuttle/arrivals.dm:36)
rt.def("/obj/docking_port/mobile/arrivals/proc/LateInitialize", function LateInitialize(f: Frame) {
	let new_latejoin: Value = null, A: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [new_latejoin, A, C, $e];
	rt.setSv(f, "areas", rt.list());
	new_latejoin = rt.list();
	A = null;
	rt.forList(f, 0, rt.gl("sortedAreas"), T("/area/shuttle/arrival"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		C = null;
		rt.forList(f, 1, live(A), T("/obj/structure/chair"));
		while (($e = rt.next(f, 1)) !== undefined) {
			C = $e;
			new_latejoin = rt.modify(live(new_latejoin), live(C), add);
		}
		rt.endFor(f, 1);
		if (!truthy(rt.sv(f, "console"))) {
			rt.setSv(f, "console", rt.locateIn(f, T("/obj/machinery/requests_console"), live(A)));
		}
		rt.modSrcVar(f, "areas", live(A), add);
	}
	rt.endFor(f, 0);
	if (truthy(rt.getLen(f, rt.fv(f, "latejoin_trackers", rt.gl("SSjob"))))) {
		rt.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", ["Map contains predefined latejoin spawn points and an arrivals shuttle. Using the arrivals shuttle.", "code/modules/shuttle/arrivals.dm", 47, live(f.src), live(f.usr)])]);
	}
	if (!truthy(rt.len(f, live(new_latejoin)))) {
		rt.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", ["Arrivals shuttle contains no chairs for spawn points. Reverting to latejoin landmarks.", "code/modules/shuttle/arrivals.dm", 50, live(f.src), live(f.usr)])]);
		if (!truthy(rt.getLen(f, rt.fv(f, "latejoin_trackers", rt.gl("SSjob"))))) {
			rt.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", ["No latejoin landmarks exist. Players will spawn unbuckled on the shuttle.", "code/modules/shuttle/arrivals.dm", 52, live(f.src), live(f.usr)])]);
		}
		return live(f.dot);
	}
	rt.setFv(f, "latejoin_trackers", rt.gl("SSjob"), live(new_latejoin));
	return f.dot;
});

// /obj/docking_port/mobile/arrivals/proc/dockRoundstart  (code/modules/shuttle/arrivals.dm:58)  may sleep
rt.def("/obj/docking_port/mobile/arrivals/proc/dockRoundstart", function* dockRoundstart(f: Frame) {
	yield* g.callName(f, rt.gl("SSshuttle"), "generate_transit_dock", [live(f.src)]);
	yield* g.srcCall(f, "Launch");
	rt.setSv(f, "timer", rt.worldTime(f));
	yield* g.srcCall(f, "check");
	return 1;
}, true);

// /obj/docking_port/mobile/arrivals/proc/check  (code/modules/shuttle/arrivals.dm:65)  may sleep
rt.def("/obj/docking_port/mobile/arrivals/proc/check", function* check(f: Frame) {
	let announcer: Value = null, found_awake: Value = null;
	f.vars = () => [announcer, found_awake];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "perma_docked"))) {
		if (!isEqual(rt.sv(f, "mode"), "call")) {
			rt.setSv(f, "sound_played", 0);
			rt.setSv(f, "mode", "idle");
		} else {
			yield* g.srcCall(f, "SendToStation");
		}
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "damaged"))) {
		if (!truthy((yield* g.srcCall(f, "CheckTurfsPressure")))) {
			rt.setSv(f, "damaged", 0);
			if (truthy(rt.sv(f, "console"))) {
				yield* g.callName(f, rt.sv(f, "console"), "say", ["Repairs complete, launching soon."]);
			}
		}
		return live(f.dot);
	} else {
		if (truthy((yield* g.srcCall(f, "CheckTurfsPressure")))) {
			rt.setSv(f, "damaged", 1);
			if (truthy(rt.sv(f, "console"))) {
				yield* g.callName(f, rt.sv(f, "console"), "say", ["Alert, hull breach detected!"]);
			}
			yield* g.callName(f, (announcer = rt.op(f, "PickUnweighted", [1], [rt.gl("announcement_systems")])), "announce", [null, "ARRIVALS_BROKEN", "channels", rt.list()], rt.Args.Named);
			if (!isEqual(rt.sv(f, "mode"), "call")) {
				rt.setSv(f, "sound_played", 0);
				rt.setSv(f, "mode", "idle");
			} else {
				yield* g.srcCall(f, "SendToStation");
			}
			return live(f.dot);
		}
	}
	found_awake = ((yield* g.srcCall(f, "PersonCheck")) || (yield* g.srcCall(f, "NukeDiskCheck")));
	if (isEqual(rt.sv(f, "mode"), "call")) {
		if (truthy(live(found_awake))) {
			yield* g.srcCall(f, "SendToStation");
		}
	} else {
		if (isEqual(rt.sv(f, "mode"), "igniting")) {
			if ((truthy(live(found_awake)) && !truthy(rt.sv(f, "force_depart")))) {
				rt.setSv(f, "mode", "idle");
				rt.setSv(f, "sound_played", 0);
			} else {
				if (!truthy(rt.sv(f, "sound_played"))) {
					yield* g.srcCall(f, "hyperspace_sound", 1, rt.sv(f, "areas"));
					rt.setSv(f, "sound_played", 1);
				}
			}
		} else {
			if (truthy(live(found_awake))) return f.dot;
			yield* g.srcCall(f, "Launch", 0);
		}
	}
	return f.dot;
}, true);

// /obj/docking_port/mobile/arrivals/proc/CheckTurfsPressure  (code/modules/shuttle/arrivals.dm:112)
rt.def("/obj/docking_port/mobile/arrivals/proc/CheckTurfsPressure", function CheckTurfsPressure(f: Frame) {
	let I: Value = null, _T: Value = null, pressure: Value = null;
	let $e: any;
	f.vars = () => [I, _T, pressure, $e];
	I = null;
	rt.forList(f, 0, rt.fv(f, "latejoin_trackers", rt.gl("SSjob")));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		_T = rt.getStep(f, live(I), 0);
		if ((rt.lt((pressure = rt.callName(f, rt.fv(f, "air", live(_T)), "return_pressure", [])), 20) || rt.gt(live(pressure), 550))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /obj/docking_port/mobile/arrivals/proc/PersonCheck  (code/modules/shuttle/arrivals.dm:120)
rt.def("/obj/docking_port/mobile/arrivals/proc/PersonCheck", function PersonCheck(f: Frame) {
	let M: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [M, L, $e];
	M = null;
	rt.forList(f, 0, rt.bitAnd(rt.gl("living_mob_list"), rt.gl("player_list")));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		L = live(M);
		if ((truthy((rt.isIn(f, rt.call(f, P("/proc/get_area"), null, [live(M)]), rt.sv(f, "areas")) ? 1 : 0)) && !isEqual(rt.fv(f, "stat", live(L)), 2))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /obj/docking_port/mobile/arrivals/proc/NukeDiskCheck  (code/modules/shuttle/arrivals.dm:127)
rt.def("/obj/docking_port/mobile/arrivals/proc/NukeDiskCheck", function NukeDiskCheck(f: Frame) {
	let N: Value = null;
	let $e: any;
	f.vars = () => [N, $e];
	N = null;
	rt.forList(f, 0, rt.gl("poi_list"), T("/obj/item/weapon/disk/nuclear"));
	while (($e = rt.next(f, 0)) !== undefined) {
		N = $e;
		if (truthy((rt.isIn(f, rt.call(f, P("/proc/get_area"), null, [live(N)]), rt.sv(f, "areas")) ? 1 : 0))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /obj/docking_port/mobile/arrivals/proc/SendToStation  (code/modules/shuttle/arrivals.dm:134)  may sleep
rt.def("/obj/docking_port/mobile/arrivals/proc/SendToStation", function* SendToStation(f: Frame) {
	let dockTime: Value = null;
	let $0: any, $1: any;
	f.vars = () => [dockTime, $0, $1];
	dockTime = rt.fv(f, "arrivals_shuttle_dock_window", rt.gl("config"));
	if (!(isEqual(rt.sv(f, "mode"), "call") && rt.gt((yield* g.srcCall(f, "timeLeft", 1)), live(dockTime)))) return f.dot;
	if (truthy(rt.sv(f, "console"))) {
		$0 = rt.sv(f, "console");
		if (truthy(rt.sv(f, "damaged"))) {
			$1 = "Initiating emergency docking for repairs!";
		} else {
			$1 = fmt("Now approaching: ＀.", [(yield* g.call(f, P("/proc/station_name"), null, []))]);
		}
		yield* g.callName(f, $0, "say", [$1]);
	}
	yield* g.srcCall(f, "hyperspace_sound", 2, rt.sv(f, "areas"));
	yield* g.srcCall(f, "setTimer", live(dockTime));
	return f.dot;
}, true);

// /obj/docking_port/mobile/arrivals/proc/dock  (code/modules/shuttle/arrivals.dm:141)  may sleep
rt.def("/obj/docking_port/mobile/arrivals/proc/dock", function* dock(f: Frame) {
	let docked: Value = null, cancel_reason: Value = null, L: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [docked, cancel_reason, L, C, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	docked = (isEqual(live(f.args[0]), rt.sv(f, "assigned_transit")) ? 1 : 0);
	rt.setSv(f, "sound_played", 0);
	if (truthy(live(docked))) {
		if (!truthy(rt.sv(f, "force_depart"))) {
			cancel_reason = null;
			if (truthy((yield* g.srcCall(f, "PersonCheck")))) {
				cancel_reason = "lifeform dectected on board";
			} else {
				if (truthy((yield* g.srcCall(f, "NukeDiskCheck")))) {
					cancel_reason = "critical station device detected on board";
				}
			}
			if (truthy(live(cancel_reason))) {
				rt.setSv(f, "mode", "idle");
				if (truthy(rt.sv(f, "console"))) {
					yield* g.callName(f, rt.sv(f, "console"), "say", [fmt("Launch cancelled, ＀.", [live(cancel_reason)])]);
				}
				return live(f.dot);
			}
		}
		rt.setSv(f, "force_depart", 0);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!((!truthy(live(f.dot)) && !truthy(live(docked))) && !truthy(rt.sv(f, "damaged")))) return f.dot;
	if (truthy(rt.sv(f, "console"))) {
		yield* g.callName(f, rt.sv(f, "console"), "say", ["Welcome to your new life, employees!"]);
	}
	L = null;
	rt.forList(f, 0, rt.sv(f, "queued_announces"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		yield* g.callName(f, (C = live(L)), "Invoke", []);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.sv(f, "queued_announces"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "queued_announces"), "Cut", []);
	return f.dot;
}, true, { args: ["S1", "force"] });

// /obj/docking_port/mobile/arrivals/proc/check_effects  (code/modules/shuttle/arrivals.dm:166)  may sleep
rt.def("/obj/docking_port/mobile/arrivals/proc/check_effects", function* check_effects(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!((isEqual(rt.sv(f, "mode"), "call") && !truthy(rt.sv(f, "sound_played"))) && rt.le((yield* g.srcCall(f, "timeLeft", 1)), 5))) return f.dot;
	rt.setSv(f, "sound_played", 1);
	yield* g.srcCall(f, "hyperspace_sound", 3, rt.sv(f, "areas"));
	return f.dot;
}, true);

// /obj/docking_port/mobile/arrivals/proc/canDock  (code/modules/shuttle/arrivals.dm:172)
rt.def("/obj/docking_port/mobile/arrivals/proc/canDock", function canDock(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(live(f.dot), "we_are_already_docked")) return f.dot;
	f.dot = "can_dock";
	return f.dot;
}, false, { args: ["S"] });

// /obj/docking_port/mobile/arrivals/proc/Launch  (code/modules/shuttle/arrivals.dm:179)  may sleep
rt.def("/obj/docking_port/mobile/arrivals/proc/Launch", function* Launch(f: Frame, pickingup: Value) {
	let $0: any, $1: any;
	f.vars = () => [pickingup, $0, $1];
	if (truthy(live(pickingup))) {
		rt.setSv(f, "force_depart", 1);
	}
	if (!isEqual(rt.sv(f, "mode"), "idle")) return f.dot;
	if (truthy(rt.sv(f, "console"))) {
		$0 = rt.sv(f, "console");
		if (truthy(live(pickingup))) {
			$1 = "Departing immediately for new employee pickup.";
		} else {
			$1 = "Shuttle departing.";
		}
		yield* g.callName(f, $0, "say", [$1]);
	}
	yield* g.srcCall(f, "request", (yield* g.callName(f, rt.gl("SSshuttle"), "getDock", ["arrivals_stationary"])));
	return f.dot;
}, true);

// /obj/docking_port/mobile/arrivals/proc/RequireUndocked  (code/modules/shuttle/arrivals.dm:185)  may sleep
rt.def("/obj/docking_port/mobile/arrivals/proc/RequireUndocked", function* RequireUndocked(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((isEqual(rt.sv(f, "mode"), "call") || truthy(rt.sv(f, "damaged")))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "Launch", 1);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Calling your shuttle. One moment...</span>"]);
	while (!isEqual(rt.sv(f, "mode"), "call") && !truthy(rt.sv(f, "damaged"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	return f.dot;
}, true);

// /obj/docking_port/mobile/arrivals/proc/QueueAnnounce  (code/modules/shuttle/arrivals.dm:195)  may sleep
rt.def("/obj/docking_port/mobile/arrivals/proc/QueueAnnounce", function* QueueAnnounce(f: Frame, mob: Value, rank: Value) {
	f.vars = () => [mob, rank];
	if (!isEqual(rt.sv(f, "mode"), "call")) {
		yield* g.call(f, P("/proc/AnnounceArrival"), null, [live(mob), live(rank)]);
	} else {
		if (!truthy(rt.sv(f, "queued_announces"))) {
			rt.setSv(f, "queued_announces", rt.list());
		}
		rt.modSrcVar(f, "queued_announces", (yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/AnnounceArrival"), live(mob), live(rank)])), add);
	}
	return f.dot;
}, true);

// /obj/docking_port/mobile/arrivals/proc/vv_edit_var  (code/modules/shuttle/arrivals.dm:201)  may sleep
rt.def("/obj/docking_port/mobile/arrivals/proc/vv_edit_var", function* vv_edit_var(f: Frame) {
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["var_name", "var_value"] });
