// From code/modules/mining/aux_base.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10424, "/obj/machinery/computer/auxillary_base", "/obj/machinery/computer", {
	shuttleId: "colony_drop",
	launch_warning: 1,
	turrets: null,
	possible_destinations: null,
	locator: null,
	clockwork: 1,
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/auxillary_base"),
	name: "auxillary base management console",
	icon: rt.rsc("icons/obj/terminals.dmi"),
	icon_state: "dorm_available",
	desc: "Allows a deployable expedition base to be dropped from the station to a designated mining location. It can also interface with the mining shuttle at the landing site if a mobile beacon is also deployed.",
	req_one_access: null,
});

// /obj/machinery/computer/auxillary_base/proc/<init>  (code/modules/mining/aux_base.dm:21)
rt.def("/obj/machinery/computer/auxillary_base/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "turrets", rt.list());
	rt.setSv(f, "req_one_access", rt.list(31, 32, 19, 47));
	return f.dot;
});

// /obj/machinery/computer/auxillary_base/proc/New  (code/modules/mining/aux_base.dm:30)  may sleep
rt.def("/obj/machinery/computer/auxillary_base/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "locator", (yield* g.new_(f, T("/obj/item/device/gps/internal/base"), [live(f.src)])));
	return f.dot;
}, true, { args: ["location", "C"] });

// /obj/machinery/computer/auxillary_base/proc/attack_hand  (code/modules/mining/aux_base.dm:35)  may sleep
rt.def("/obj/machinery/computer/auxillary_base/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let options: Value = null, M: Value = null, dat: Value = null, destination_found: Value = null, S: Value = null, PDT: Value = null, _T: Value = null, integrity: Value = null, status: Value = null, popup: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, options, M, dat, destination_found, S, PDT, _T, integrity, status, popup, $0, $e];
	if (truthy((yield* g.callSuper(f, [live(user)])))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	options = (yield* g.call(f, P("/proc/params2list"), null, [rt.sv(f, "possible_destinations")]));
	M = (yield* g.callName(f, rt.gl("SSshuttle"), "getShuttle", [rt.sv(f, "shuttleId")]));
	if (isEqual(rt.sv(f, "z"), 2)) {
		$0 = "Docking clamps engaged. Standing by.";
	} else {
		if (truthy(live(M))) {
			$0 = (yield* g.callName(f, live(M), "getStatusText", []));
		} else {
			$0 = "*OFFLINE*";
		}
		$0 = fmt("Mining Shuttle Uplink: ＀", [$0]);
	}
	dat = fmt("＀<br>", [$0]);
	if (truthy(live(M))) {
		destination_found = null;
		S = null;
		rt.forList(f, 0, rt.fv(f, "stationary", rt.gl("SSshuttle")), T("/obj/docking_port/stationary"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			if (!truthy((yield* g.callName(f, live(options), "Find", [rt.fv(f, "id", live(S))])))) {
				continue;
			}
			if (!truthy((yield* g.callName(f, live(M), "check_dock", [live(S)])))) {
				continue;
			}
			destination_found = 1;
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;move=＀'>Send to ＀</A><br>", [live(f.src), rt.fv(f, "id", live(S)), rt.fv(f, "name", live(S))]), add);
		}
		rt.endFor(f, 0);
		if ((!truthy(live(destination_found)) && isEqual(rt.sv(f, "z"), 2))) {
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;random=1'>Prepare for blind drop? (Dangerous)</A><br>", [live(f.src)]), add);
		}
	}
	if (truthy(rt.length(rt.sv(f, "turrets")))) {
		dat = rt.modify(live(dat), fmt("<br><b>Perimeter Defense System:</b> <A href='?src=＃;turrets_power=on'>Enable All</A> / <A href='?src=＃;turrets_power=off'>Disable All</A><br> Units connected: ＀<br>Unit | Condition | Status | Direction | Distance<br>", [live(f.src), live(f.src), rt.length(rt.sv(f, "turrets"))]), add);
		PDT = null;
		rt.forList(f, 0, rt.sv(f, "turrets"));
		while (($e = rt.next(f, 0)) !== undefined) {
			PDT = $e;
			_T = live(PDT);
			integrity = (yield* g.call(f, P("/proc/max"), null, [multiply(divide(subtract(rt.fv(f, "obj_integrity", live(_T)), rt.fv(f, "integrity_failure", live(_T))), subtract(rt.fv(f, "max_integrity", live(_T)), rt.fv(f, "integrity_failure", live(_T)))), 100), 0]));
			status = null;
			if (truthy(rt.bitAnd(rt.fv(f, "stat", live(_T)), 1))) {
				status = "<span class='bad'>ERROR</span>";
			} else {
				if (!truthy(rt.fv(f, "on", live(_T)))) {
					status = "Disabled";
				} else {
					if (truthy(rt.fv(f, "raised", live(_T)))) {
						status = "<span class='average'><b>Firing</b></span>";
					} else {
						status = "<span class='good'>All Clear</span>";
					}
				}
			}
			dat = rt.modify(live(dat), fmt("＀ | ＀% | ＀ | ＀ | ＀m <A href='?src=＃;single_turret_power=＃'>Toggle Power</A><br>", [rt.fv(f, "name", live(_T)), live(integrity), live(status), (yield* g.call(f, P("/proc/dir2text"), null, [rt.getDir(f, live(f.src), live(_T))])), (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(_T)])), live(f.src), live(_T)]), add);
		}
		rt.endFor(f, 0);
	}
	dat = rt.modify(live(dat), fmt("<a href='?src=＃;mach_close=computer'>Close</a>", [live(user)]), add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "computer", "base management", 550, 300]))), "set_content", [fmt("<center>＀</center>", [live(dat)])]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(f.usr), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/auxillary_base/proc/Topic  (code/modules/mining/aux_base.dm:81)  may sleep
rt.def("/obj/machinery/computer/auxillary_base/proc/Topic", function* Topic(f: Frame) {
	let shuttle_error: Value = null, LZ: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [shuttle_error, LZ, _T, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	if (!truthy((yield* g.srcCall(f, "allowed", live(f.usr))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Access denied.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "move"))) {
		if ((!isEqual(rt.sv(f, "z"), 2) && isEqual(rt.sv(f, "shuttleId"), "colony_drop"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You can't move the base again!</span>"]);
			return live(f.dot);
		}
		shuttle_error = (yield* g.callName(f, rt.gl("SSshuttle"), "moveShuttle", [rt.sv(f, "shuttleId"), rt.at(live(f.args[1]), "move"), 1]));
		if (truthy(rt.sv(f, "launch_warning"))) {
			yield* g.srcCall(f, "say", "<span class='danger'>Launch sequence activated! Prepare for drop!!</span>");
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/warning-buzzer.ogg"), 70, 0]);
			rt.setSv(f, "launch_warning", 0);
		} else {
			if (!truthy(live(shuttle_error))) {
				yield* g.srcCall(f, "say", "Shuttle request uploaded. Please stand away from the doors.");
			} else {
				yield* g.srcCall(f, "say", "Shuttle interface failed.");
			}
		}
	}
	if ((truthy(rt.at(live(f.args[1]), "random")) && !truthy(rt.sv(f, "possible_destinations")))) {
		yield* g.callName(f, live(f.usr), "changeNext_move", [2]);
		if ((!truthy((rt.istype((LZ = (yield* g.call(f, P("/proc/safepick"), null, [(yield* g.call(f, P("/proc/block"), null, [rt.locate(1, 1, 5), rt.locate(rt.fv(f, "maxx", rt.world()), rt.fv(f, "maxy", rt.world()), 5)]))]))), T("/turf/closed/mineral")) ? 1 : 0)) && !truthy((rt.istype(live(LZ), T("/turf/open/floor/plating/asteroid")) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Landing zone scan failed. Please try again.</span>"]);
			yield* g.srcCall(f, "updateUsrDialog");
			return live(f.dot);
		}
		if (!isEqual((yield* g.srcCall(f, "set_landing_zone", live(LZ), live(f.usr))), 4)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Landing zone unsuitable. Please recalculate.</span>"]);
			yield* g.srcCall(f, "updateUsrDialog");
			return live(f.dot);
		}
	}
	if (truthy(rt.length(rt.sv(f, "turrets")))) {
		if (truthy(rt.at(live(f.args[1]), "turrets_power"))) {
			_T = null;
			rt.forList(f, 0, rt.sv(f, "turrets"), T("/obj/machinery/porta_turret/aux_base"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T = $e;
				if (isEqual(rt.at(live(f.args[1]), "turrets_power"), "on")) {
					rt.setFv(f, "on", live(_T), 1);
				} else {
					rt.setFv(f, "on", live(_T), 0);
				}
			}
			rt.endFor(f, 0);
		}
		if (truthy(rt.at(live(f.args[1]), "single_turret_power"))) {
			if (truthy((rt.istype((_T = rt.locateIn(f, rt.at(live(f.args[1]), "single_turret_power"), rt.sv(f, "turrets"))), T("/obj/machinery/porta_turret/aux_base")) ? 1 : 0))) {
				rt.setFv(f, "on", live(_T), (!truthy(rt.fv(f, "on", live(_T))) ? 1 : 0));
			}
		}
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/computer/auxillary_base/proc/onShuttleMove  (code/modules/mining/aux_base.dm:133)  may sleep
rt.def("/obj/machinery/computer/auxillary_base/proc/onShuttleMove", function* onShuttleMove(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.sv(f, "z"), 5)) return f.dot;
	return f.dot;
}, true, { args: ["T1", "rotation"] });

// /obj/machinery/computer/auxillary_base/proc/set_mining_mode  (code/modules/mining/aux_base.dm:138)
rt.def("/obj/machinery/computer/auxillary_base/proc/set_mining_mode", function set_mining_mode(f: Frame) {
	if (!isEqual(rt.sv(f, "z"), 5)) return f.dot;
	rt.setSv(f, "req_one_access", rt.list());
	rt.setSv(f, "shuttleId", "mining");
	rt.setSv(f, "possible_destinations", "mining_home;mining_away;landing_zone_dock;mining_public");
	return f.dot;
});

// /obj/machinery/computer/auxillary_base/proc/set_landing_zone  (code/modules/mining/aux_base.dm:145)  may sleep
rt.def("/obj/machinery/computer/auxillary_base/proc/set_landing_zone", function* set_landing_zone(f: Frame, _T: Value, user: Value, no_restrictions: Value) {
	let base_dock: Value = null, colony_radius: Value = null, area_counter: Value = null, A: Value = null, landing_zone: Value = null;
	f.vars = () => [_T, user, no_restrictions, base_dock, colony_radius, area_counter, A, landing_zone];
	if (!truthy((base_dock = rt.locateIn(f, T("/obj/docking_port/mobile/auxillary_base"), rt.fv(f, "mobile", rt.gl("SSshuttle")))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This station is not equipped with an auxillary base. Please contact your Nanotrasen contractor.</span>"]);
		return live(f.dot);
	}
	if (!truthy(live(no_restrictions))) {
		if (!isEqual(rt.fv(f, "z", live(_T)), 5)) {
			return 1;
		}
		colony_radius = multiply((yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "width", live(base_dock)), rt.fv(f, "height", live(base_dock))])), 0.5);
		if ((((rt.lt(subtract(rt.fv(f, "x", live(_T)), live(colony_radius)), 1) || rt.ge(add(rt.fv(f, "x", live(_T)), live(colony_radius)), rt.fv(f, "maxx", rt.world()))) || rt.lt(subtract(rt.fv(f, "y", live(_T)), live(colony_radius)), 1)) || rt.ge(add(rt.fv(f, "y", live(_T)), live(colony_radius)), rt.fv(f, "maxx", rt.world())))) {
			return 3;
		}
		if (rt.gt(rt.getLen(f, (area_counter = (yield* g.call(f, P("/proc/get_areas_in_range"), null, [live(colony_radius), live(_T)])))), 1)) {
			return 2;
		}
	}
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(_T)]));
	rt.setFv(f, "id", (landing_zone = (yield* g.new_(f, T("/obj/docking_port/stationary"), [live(_T)]))), fmt("colony_drop(＃)", [live(f.src)]));
	rt.setFv(f, "name", live(landing_zone), fmt("Landing Zone (＀, ＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T))]));
	rt.setFv(f, "dwidth", live(landing_zone), rt.fv(f, "dwidth", live(base_dock)));
	rt.setFv(f, "dheight", live(landing_zone), rt.fv(f, "dheight", live(base_dock)));
	rt.setFv(f, "width", live(landing_zone), rt.fv(f, "width", live(base_dock)));
	rt.setFv(f, "height", live(landing_zone), rt.fv(f, "height", live(base_dock)));
	yield* g.callName(f, live(landing_zone), "setDir", [rt.fv(f, "dir", live(base_dock))]);
	rt.setFv(f, "turf_type", live(landing_zone), rt.fv(f, "type", live(_T)));
	rt.setFv(f, "area_type", live(landing_zone), rt.fv(f, "type", live(A)));
	rt.modSrcVar(f, "possible_destinations", fmt("＀;", [rt.fv(f, "id", live(landing_zone))]), add);
	yield* g.call(f, P("/proc/minor_announce"), null, [fmt("Auxiliary base landing zone coordinates locked in for ＀. Launch command now available!", [live(A)])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Landing zone set.</span>"]);
	return 4;
}, true);

rt.type(9395, "/obj/item/device/assault_pod/mining", "/obj/item/device/assault_pod", {
	setting: 0,
	no_restrictions: 0,
	name: "Landing Field Designator",
	icon_state: "gangtool-purple",
	item_state: "electronic",
	icon: rt.rsc("icons/obj/device.dmi"),
	desc: "Deploy to designate the landing zone of the auxillary base.",
	w_class: 2,
	shuttle_id: "colony_drop",
});

// /obj/item/device/assault_pod/mining/proc/attack_self  (code/modules/mining/aux_base.dm:197)  may sleep
rt.def("/obj/item/device/assault_pod/mining/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let _T: Value = null, AB: Value = null, A: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, _T, AB, A, $0, $e];
	if (truthy(rt.sv(f, "setting"))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You begin setting the landing zone parameters...</span>"]);
	rt.setSv(f, "setting", 1);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 50, "target", live(user)], rt.Args.Named)))) {
		rt.setSv(f, "setting", 0);
		return live(f.dot);
	}
	rt.setSv(f, "setting", 0);
	_T = rt.getStep(f, live(user), 0);
	AB = null;
	A = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/auxillary_base"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(rt.fv(f, "z", live(A)), 2)) {
			AB = live(A);
			break;
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(AB))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>No auxillary base console detected.</span>"]);
		return live(f.dot);
	}
	$0 = (yield* g.callName(f, live(AB), "set_landing_zone", [live(_T), live(user), rt.sv(f, "no_restrictions")]));
	if ($0 === 1) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This uplink can only be used in a designed mining zone.</span>"]);
	} else if ($0 === 2) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Unable to acquire a targeting lock. Find an area clear of stuctures or entirely within one.</span>"]);
	} else if ($0 === 3) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Location is too close to the edge of the station's scanning range. Move several paces away and try again.</span>"]);
	} else if ($0 === 4) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

rt.type(13054, "/obj/docking_port/stationary/public_mining_dock", "/obj/docking_port/stationary", {
	name: "public mining base dock",
	id: "disabled",
	dwidth: 3,
	width: 7,
	height: 5,
});

// /obj/docking_port/stationary/public_mining_dock/proc/onShuttleMove  (code/modules/mining/aux_base.dm:249)
rt.def("/obj/docking_port/stationary/public_mining_dock/proc/onShuttleMove", function onShuttleMove(f: Frame) {
	rt.setSv(f, "id", "mining_public");
	return 0;
});

rt.type(12954, "/obj/structure/mining_shuttle_beacon", "/obj/structure", {
	shuttle_ID: "landing_zone_dock",
	Mport: null,
	anti_spam_cd: 0,
	console_range: 15,
	anchored: 0,
	pressure_resistance: 200,
	name: "mining shuttle beacon",
	desc: "A bluespace beacon calibrated to mark a landing spot for the mining shuttle when deployed near the auxillary mining base.",
	density: 0,
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "miningbeacon",
});

// /obj/structure/mining_shuttle_beacon/proc/attack_hand  (code/modules/mining/aux_base.dm:268)  may sleep
rt.def("/obj/structure/mining_shuttle_beacon/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let landing_spot: Value = null, aux_base_console: Value = null, ABC: Value = null, S: Value = null, SM: Value = null, A: Value = null, mining_shuttle: Value = null, landing_turfs: Value = null, S_4: Value = null, MS: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [user, landing_spot, aux_base_console, ABC, S, SM, A, mining_shuttle, landing_turfs, S_4, MS, L, $e];
	if (truthy(rt.sv(f, "anchored"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Landing zone already set.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "anti_spam_cd"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is currently recalibrating. Please wait.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	rt.setSv(f, "anti_spam_cd", 1);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/mining_shuttle_beacon/proc/clear_cooldown")])), 50]);
	if (!isEqual(rt.gv(f, "z", (landing_spot = rt.getStep(f, live(f.src), 0))), 5)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This device is only to be used in a mining zone.</span>"]);
		return live(f.dot);
	}
	aux_base_console = null;
	ABC = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/auxillary_base"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ABC = $e;
		if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(landing_spot), live(ABC)])), rt.sv(f, "console_range"))) {
			aux_base_console = live(ABC);
			break;
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(aux_base_console))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The auxillary base's console must be within ＀ meters in order to interface.</span>", [rt.sv(f, "console_range")])]);
		return live(f.dot);
	}
	S = null;
	rt.forList(f, 0, rt.fv(f, "stationary", rt.gl("SSshuttle")));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if ((isEqual(rt.gv(f, "id", (SM = live(S))), "mining_home") || isEqual(rt.fv(f, "id", live(SM)), "mining_away"))) {
			A = (yield* g.call(f, P("/proc/get_area"), null, [live(landing_spot)]));
			rt.setSv(f, "Mport", (yield* g.new_(f, T("/obj/docking_port/stationary"), [live(landing_spot)])));
			rt.setFv(f, "id", rt.sv(f, "Mport"), "landing_zone_dock");
			rt.setFv(f, "name", rt.sv(f, "Mport"), "auxillary base landing site");
			rt.setFv(f, "dwidth", rt.sv(f, "Mport"), rt.fv(f, "dwidth", live(SM)));
			rt.setFv(f, "dheight", rt.sv(f, "Mport"), rt.fv(f, "dheight", live(SM)));
			rt.setFv(f, "width", rt.sv(f, "Mport"), rt.fv(f, "width", live(SM)));
			rt.setFv(f, "height", rt.sv(f, "Mport"), rt.fv(f, "height", live(SM)));
			yield* g.callName(f, rt.sv(f, "Mport"), "setDir", [rt.sv(f, "dir")]);
			rt.setFv(f, "turf_type", rt.sv(f, "Mport"), rt.fv(f, "type", live(landing_spot)));
			rt.setFv(f, "area_type", rt.sv(f, "Mport"), rt.fv(f, "type", live(A)));
			break;
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.sv(f, "Mport"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This station is not equipped with an approprite mining shuttle. Please contact Nanotrasen Support.</span>"]);
		return live(f.dot);
	}
	mining_shuttle = null;
	landing_turfs = rt.list();
	S_4 = null;
	rt.forList(f, 0, rt.fv(f, "mobile", rt.gl("SSshuttle")));
	while (($e = rt.next(f, 0)) !== undefined) {
		S_4 = $e;
		if (!isEqual(rt.gv(f, "id", (MS = live(S_4))), "mining")) {
			continue;
		}
		landing_turfs = (yield* g.callName(f, (mining_shuttle = live(MS)), "return_ordered_turfs", [rt.sv(f, "x"), rt.sv(f, "y"), rt.sv(f, "z"), rt.sv(f, "dir")]));
		break;
	}
	rt.endFor(f, 0);
	if (!truthy(live(mining_shuttle))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>No mining shuttle signal detected. Please contact Nanotrasen Support.</span>"]);
		yield* g.callName(f, rt.fv(f, "stationary", rt.gl("SSshuttle")), "Remove", [rt.sv(f, "Mport")]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "Mport")]);
		return live(f.dot);
	}
	L = null;
	rt.forList(f, 0, live(landing_turfs));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy((rt.istype((yield* g.call(f, P("/proc/get_area"), null, [live(L)])), T("/area/shuttle/auxillary_base")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The mining shuttle must not land within the mining base itself.</span>"]);
			yield* g.callName(f, rt.fv(f, "stationary", rt.gl("SSshuttle")), "Remove", [rt.sv(f, "Mport")]);
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "Mport")]);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	if (!truthy((yield* g.callName(f, live(mining_shuttle), "canDock", [rt.sv(f, "Mport")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Unable to secure a valid docking zone. Please try again in an open area near, but not within the aux. mining base.</span>"]);
		yield* g.callName(f, rt.fv(f, "stationary", rt.gl("SSshuttle")), "Remove", [rt.sv(f, "Mport")]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "Mport")]);
		return live(f.dot);
	}
	yield* g.callName(f, live(aux_base_console), "set_mining_mode", []);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Mining shuttle calibration successful! Shuttle interface available at base console.</span>"]);
	rt.setSv(f, "anchored", 1);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/ping.ogg"), 50, 0]);
	return f.dot;
}, true);

// /obj/structure/mining_shuttle_beacon/proc/attack_robot  (code/modules/mining/aux_base.dm:353)  may sleep
rt.def("/obj/structure/mining_shuttle_beacon/proc/attack_robot", function* attack_robot(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);
