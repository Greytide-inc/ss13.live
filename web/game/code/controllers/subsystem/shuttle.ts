// Based on /tg/station's code/controllers/subsystem/shuttle.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// shuttle.dm:4
rt.def("/datum/controller/subsystem/shuttle/proc/New", function* New(f: Frame) {
	if (GLOB.SSshuttle != this) {
		if (rt.istype(GLOB.SSshuttle, T("/datum/controller/subsystem/shuttle"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSshuttle);
		}
		GLOB.SSshuttle = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// shuttle.dm:11
rt.def("/datum/controller/subsystem/shuttle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mobile = list();

	this.stationary = list();

	this.transit = list();

	this.transit_turfs = list();

	this.transit_requesters = list();

	this.transit_request_failures = list();

	this.transit_recolor = list();

	this.hostileEnvironments = list();

	this.discoveredPlants = list();

	this.supply_packs = list();

	this.shoppinglist = list();

	this.requestlist = list();

	this.orderhistory = list();

	this.shuttle_purchase_requirements_met = list();
	return f.dot;
});

// shuttle.dm:56
rt.def("/datum/controller/subsystem/shuttle/proc/Initialize", function* Initialize(f: Frame, timeofday: Value) {
	let pack: Value = null, _P: Value = null;
	if (!this.arrivals) {
		warning(`${"No /obj/docking_port/mobile/arrivals placed on the map!"} in ${"code/controllers/subsystem/shuttle.dm"} at line ${57} src: ${this} usr: ${f.usr}.`);
	}
	if (!this.emergency) {
		warning(`${"No /obj/docking_port/mobile/emergency placed on the map!"} in ${"code/controllers/subsystem/shuttle.dm"} at line ${59} src: ${this} usr: ${f.usr}.`);
	}
	if (!this.backup_shuttle) {
		warning(`${"No /obj/docking_port/mobile/emergency/backup placed on the map!"} in ${"code/controllers/subsystem/shuttle.dm"} at line ${61} src: ${this} usr: ${f.usr}.`);
	}
	if (!this.supply) {
		warning(`${"No /obj/docking_port/mobile/supply placed on the map!"} in ${"code/controllers/subsystem/shuttle.dm"} at line ${63} src: ${this} usr: ${f.usr}.`);
	}
	this.ordernum = rand(1, 9000);
	for (pack of each(typesof(T("/datum/supply_pack")) - T("/datum/supply_pack"))) {
		if (!(_P = (yield* new_(pack))).contains) {
			continue;
		}
		rt.setAt(this.supply_packs, _P.type, _P);
	}
	yield* this.setup_transit_zone();
	yield* this.initial_move();
	this.color_space();
	yield* parent_proc();
	return f.dot;
}, true);

// shuttle.dm:82
rt.def("/datum/controller/subsystem/shuttle/proc/setup_transit_zone", function* setup_transit_zone(f: Frame) {
	let i: Value = null, _T: Value = null;
	let A: Value = rt.getStep(f, rt.locate(SHUTTLE_TRANSIT_BORDER, SHUTTLE_TRANSIT_BORDER, ZLEVEL_TRANSIT), 0);
	let B: Value = rt.getStep(f, rt.locate(rt.world().maxx - SHUTTLE_TRANSIT_BORDER, rt.world().maxy - SHUTTLE_TRANSIT_BORDER, ZLEVEL_TRANSIT), 0);
	this.transit_recolor_all = HIGHLIGHT_DYNAMIC_TRANSIT;
	for (i of each(block(A, B))) {
		yield* (_T = i).ChangeTurf(T("/turf/open/space"));
		this.transit_turfs += _T;
		(rt.modField(f, _T, "flags", 2, rt.bitOr));
	}
	return f.dot;
}, true);

// shuttle.dm:93
rt.def("/datum/controller/subsystem/shuttle/proc/color_space", function color_space(f: Frame) {
	let i: Value = null, _T: Value = null;
	let A: Value = rt.getStep(f, rt.locate(SHUTTLE_TRANSIT_BORDER, SHUTTLE_TRANSIT_BORDER, ZLEVEL_TRANSIT), 0);
	let B: Value = rt.getStep(f, rt.locate(rt.world().maxx - SHUTTLE_TRANSIT_BORDER, rt.world().maxy - SHUTTLE_TRANSIT_BORDER, ZLEVEL_TRANSIT), 0);
	let todo: Value = this.transit_recolor;
	if (this.transit_recolor_all) {
		todo = block(A, B);
	}
	this.transit_recolor = list();
	this.transit_recolor_all = 0;
	for (i of each(todo)) {
		if (rt.istype((_T = i), T("/turf/open/space/transit")) || !rt.istype(_T, T("/turf/open/space"))) {
			continue;
		}
		if (_T.x == A.x || _T.x == B.x || _T.y == A.y || _T.y == B.y) {
			_T.color = "#ffff00";
		} else {
			_T.color = "#00ffff";
		}
	}
	return f.dot;
});

// shuttle.dm:115
rt.def("/datum/controller/subsystem/shuttle/proc/fire", function* fire(f: Frame) {
	let thing: Value = null, _P: Value = null, thing_1: Value = null, _T: Value = null, owner: Value = null, idle: Value = null, not_centcom_evac: Value = null, not_in_use: Value = null, i: Value = null, requester: Value = null, success: Value = null, M: Value = null;
	let $e: any;
	for (thing of each(this.mobile)) {
		if (!thing) {
			yield* this.mobile.Remove(thing);
			continue;
		}
		yield* (_P = thing).check();
	}
	let changed_transit: Value = 0;
	if (this.last_dock_time != rt.worldTime(f)) {
		for (thing_1 of each(this.transit)) {
			if (!(_T = thing_1).owner) {
				yield* qdel(_T, { force: 1 });
				changed_transit = 1;
			}
			if (owner = _T.owner) {
				idle = (owner.mode == "idle" ? 1 : 0);
				not_centcom_evac = (owner.launch_status == -1 ? 1 : 0);
				not_in_use = (!_T.get_docked() ? 1 : 0);
				// tg_js: the arrivals shuttle keeps its transit dock between flights: tearing the strip down and building it again on every departure cost ~150 ms in one tick (atmos-speed step 4).
				if (idle && not_centcom_evac && not_in_use && !rt.istype(owner, T("/obj/docking_port/mobile/arrivals"))) {
					yield* qdel(_T, { force: 1 });
					changed_transit = 1;
				}
			}
		}
	}
	if (this.clear_transit) {
		this.transit_requesters.Cut();
		for (i of each(this.transit)) {
			yield* qdel(i, { force: 1 });
		}
		yield* this.setup_transit_zone();
		this.clear_transit = 0;
		changed_transit = 1;
	}
	if (changed_transit) {
		this.color_space();
	}
	while (rt.len(f, this.transit_requesters)) {
		requester = popleft(this.transit_requesters);
		if (!(success = (yield* this.generate_transit_dock(requester)))) {
			rt.incAt(this.transit_request_failures, requester, 1, true);
			if (rt.index(this.transit_request_failures, requester) < 10) {
				this.transit_requesters += requester;
			} else {
				yield* (M = requester).transit_failure();
			}
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	return f.dot;
}, true);

// shuttle.dm:167
rt.def("/datum/controller/subsystem/shuttle/proc/getShuttle", function getShuttle(f: Frame, id: Value) {
	let M: Value = null;
	for (M of each(this.mobile, T("/obj/docking_port/mobile"))) {
		if (M.id == id) {
			return M;
		}
	}
	warning(`${`couldn't find shuttle with id: ${id}`} in ${"code/controllers/subsystem/shuttle.dm"} at line ${170} src: ${this} usr: ${f.usr}.`);
	return f.dot;
});

// shuttle.dm:173
rt.def("/datum/controller/subsystem/shuttle/proc/getDock", function getDock(f: Frame, id: Value) {
	let S: Value = null;
	for (S of each(this.stationary, T("/obj/docking_port/stationary"))) {
		if (S.id == id) {
			return S;
		}
	}
	warning(`${`couldn't find dock with id: ${id}`} in ${"code/controllers/subsystem/shuttle.dm"} at line ${176} src: ${this} usr: ${f.usr}.`);
	return f.dot;
});

// shuttle.dm:179
rt.def("/datum/controller/subsystem/shuttle/proc/requestEvac", function* requestEvac(f: Frame, user: Value, call_reason: Value) {
	let security_num: Value = null;
	if (!this.emergency) {
		warning(`${"requestEvac(): There is no emergency shuttle, but the shuttle was called. Using the backup shuttle instead."} in ${"code/controllers/subsystem/shuttle.dm"} at line ${180} src: ${this} usr: ${f.usr}.`);
		if (!this.backup_shuttle) {
			rt.throw_(f, (yield* new_(T("/exception"), "requestEvac(): There is no emergency shuttle, or backup shuttle! The game will be unresolvable. This is possibly a mapping error, more likely a bug with the shuttle manipulation system, or badminry. It is possible to manually resolve this problem by loading an emergency shuttle template manually, and then calling register() on the mobile docking port. Good luck.", "code/controllers/subsystem/shuttle.dm", 183)));
			return f.dot;
		}
		this.emergency = this.backup_shuttle;
	}
	if (rt.worldTime(f) - GLOB.SSticker.round_start_time < GLOB.config.shuttle_refuel_delay) {
		to_chat(user, `The emergency shuttle is refueling. Please wait another ${rt.op(f, "Abs", [], [round((rt.worldTime(f) - GLOB.SSticker.round_start_time - GLOB.config.shuttle_refuel_delay) / 600)])} minutes before trying again.`);
		return f.dot;
	}
	if (this.emergency.mode === "recall") {
		to_chat(user, "The emergency shuttle may not be called while returning to Centcom.");
		return f.dot;
	} else if (this.emergency.mode === "call") {
		to_chat(user, "The emergency shuttle is already on its way.");
		return f.dot;
	} else if (this.emergency.mode === "docked") {
		to_chat(user, "The emergency shuttle is already here.");
		return f.dot;
	} else if (this.emergency.mode === "igniting") {
		to_chat(user, "The emergency shuttle is firing its engines to leave.");
		return f.dot;
	} else if (this.emergency.mode === "escape") {
		to_chat(user, "The emergency shuttle is moving away to a safe distance.");
		return f.dot;
	} else if (this.emergency.mode === "stranded") {
		to_chat(user, "The emergency shuttle has been disabled by Centcom.");
		return f.dot;
	}
	if (rt.length((call_reason = trim(html_encode(call_reason)))) < CALL_SHUTTLE_REASON_LENGTH && seclevel2num(get_security_level()) > SEC_LEVEL_GREEN) {
		to_chat(user, "You must provide a reason.");
		return f.dot;
	}
	let signal_origin: Value = get_area(user);
	let emergency_reason: Value = `\nNature of emergency:\n\n${call_reason}`;
	const subject = (security_num = seclevel2num(get_security_level()));
	if (subject === SEC_LEVEL_RED || subject === SEC_LEVEL_DELTA) {
		yield* this.emergency.request(null, signal_origin, html_decode(emergency_reason), 1);
	} else {
		yield* this.emergency.request(null, signal_origin, html_decode(emergency_reason), 0);
	}
	log_game(`${key_name(user)} has called the shuttle.`);
	message_admins(`${key_name_admin(user)} has called the shuttle. (<A HREF='?_src_=holder;trigger_centcom_recall=1'>TRIGGER CENTCOM RECALL</A>)`);
	return f.dot;
}, true);

// shuttle.dm:236
rt.def("/datum/controller/subsystem/shuttle/proc/centcom_recall", function* centcom_recall(f: Frame, old_timer: Value, admiral_message: Value) {
	if (this.emergency.mode != "call" || this.emergency.timer != old_timer) {
		return f.dot;
	}
	yield* this.emergency.cancel();
	if (!admiral_message) {
		admiral_message = pick(GLOB.admiral_messages);
	}
	let intercepttext: Value = `<font size = 3><b>NanoTrasen Update</b>: Request For Shuttle.</font><hr>To whom it may concern:<br><br>We have taken note of the situation upon ${station_name()} and have come to the conclusion that it does not warrant the abandonment of the station.<br>If you do not agree with our opinion we suggest that you open a direct line with us and explain the nature of your crisis.<br><br><i>This message has been automatically generated based upon readings from long range diagnostic tools. To assure the quality of your request every finalized report is reviewed by an on-call rear admiral.<br><b>Rear Admiral's Notes:</b> ${admiral_message}`;
	yield* print_command_report(intercepttext, { announce: 1 });
	return f.dot;
}, true);

// shuttle.dm:260
rt.def("/datum/controller/subsystem/shuttle/proc/emergencyDeregister", function emergencyDeregister(f: Frame) {
	this.emergency = this.backup_shuttle;
	return f.dot;
});

// shuttle.dm:263
rt.def("/datum/controller/subsystem/shuttle/proc/cancelEvac", function* cancelEvac(f: Frame, user: Value) {
	if (!this.canRecall()) return f.dot;
	yield* this.emergency.cancel(get_area(user));
	log_game(`${key_name(user)} has recalled the shuttle.`);
	message_admins(`${key_name_admin(user)} has recalled the shuttle.`);
	return 1;
}, true);

// shuttle.dm:270
rt.def("/datum/controller/subsystem/shuttle/proc/canRecall", function canRecall(f: Frame) {
	let security_num: Value = null;
	if (!this.emergency || this.emergency.mode != "call") {
		return f.dot;
	}
	if (GLOB.SSticker.mode.name == "meteor") {
		return f.dot;
	}
	const subject = (security_num = seclevel2num(get_security_level()));
	if (subject === SEC_LEVEL_GREEN) {
		if (this.emergency.timeLeft(1) < this.emergencyCallTime) {
			return f.dot;
		}
	} else if (subject === SEC_LEVEL_BLUE) {
		if (this.emergency.timeLeft(1) < this.emergencyCallTime * 0.5) {
			return f.dot;
		}
	} else if (this.emergency.timeLeft(1) < this.emergencyCallTime * 0.25) {
		return f.dot;
	}
	return 1;
});

// shuttle.dm:290
rt.def("/datum/controller/subsystem/shuttle/proc/autoEvac", function* autoEvac(f: Frame) {
	let thing: Value = null, AI: Value = null, C: Value = null, _T: Value = null;
	let callShuttle: Value = 1;
	for (thing of each(GLOB.shuttle_caller_list)) {
		if (rt.istype(thing, T("/mob/living/silicon/ai"))) {
			if ((AI = thing).deployed_shell && !AI.deployed_shell.client) {
				continue;
			}
			if (AI.stat || !AI.client) {
				continue;
			}
		} else if (rt.istype(thing, T("/obj/machinery/computer/communications"))) {
			if (rt.bitAnd((C = thing).stat, 1)) {
				continue;
			}
		}
		if ((_T = rt.getStep(f, thing, 0)) && _T.z == ZLEVEL_STATION) {
			callShuttle = 0;
			break;
		}
	}
	if (!callShuttle) return f.dot;
	if (!(GLOB.SSshuttle.emergency && (GLOB.SSshuttle.emergency.mode == "idle" || GLOB.SSshuttle.emergency.mode == "recall"))) return f.dot;
	yield* this.emergency.request(null, { set_coefficient: 2.5 });
	log_game("There is no means of calling the shuttle anymore. Shuttle automatically called.");
	message_admins("All the communications consoles were destroyed and all AIs are inactive. Shuttle called.");
	return f.dot;
}, true);

// shuttle.dm:315
rt.def("/datum/controller/subsystem/shuttle/proc/registerHostileEnvironment", function* registerHostileEnvironment(f: Frame, bad: Value) {
	rt.setAt(this.hostileEnvironments, bad, 1);
	yield* this.checkHostileEnvironment();
	return f.dot;
}, true);

// shuttle.dm:318
rt.def("/datum/controller/subsystem/shuttle/proc/clearHostileEnvironment", function* clearHostileEnvironment(f: Frame, bad: Value) {
	this.hostileEnvironments -= bad;
	yield* this.checkHostileEnvironment();
	return f.dot;
}, true);

// shuttle.dm:322
rt.def("/datum/controller/subsystem/shuttle/proc/checkHostileEnvironment", function* checkHostileEnvironment(f: Frame) {
	let d: Value = null;
	for (d of each(this.hostileEnvironments, T("/datum"))) {
		if (!rt.istype(d, T("/datum")) || !d || d.gc_destroyed) {
			this.hostileEnvironments -= d;
		}
	}
	this.emergencyNoEscape = rt.len(f, this.hostileEnvironments);
	if (this.emergencyNoEscape && this.emergency.mode == "igniting") {
		this.emergency.mode = "stranded";
		this.emergency.timer = null;
		this.emergency.sound_played = 0;
		yield* priority_announce("Hostile environment detected. Departure has been postponed indefinitely pending conflict resolution.", null, rt.rsc("sound/misc/notice1.ogg"), "Priority");
	}
	if (!(!this.emergencyNoEscape && this.emergency.mode == "stranded")) return f.dot;
	this.emergency.mode = "docked";
	this.emergency.setTimer(this.emergencyDockTime);
	yield* priority_announce("Hostile environment resolved. You have 3 minutes to board the Emergency Shuttle.", null, rt.rsc("sound/ai/shuttledock.ogg"), "Priority");
	return f.dot;
}, true);

// shuttle.dm:343
rt.def("/datum/controller/subsystem/shuttle/proc/toggleShuttle", function* toggleShuttle(f: Frame, shuttleId: Value, dockHome: Value, dockAway: Value, timed: Value) {
	let M: Value = null;
	if (!(M = this.getShuttle(shuttleId))) {
		return 1;
	}
	let dockedAt: Value = M.get_docked();
	let destination: Value = dockHome;
	if (dockedAt && dockedAt.id == dockHome) {
		destination = dockAway;
	}
	if (timed) {
		if (yield* M.request(this.getDock(destination))) {
			return 2;
		}
	} else if (yield* M.dock(this.getDock(destination))) {
		return 2;
	}
	return 0;
}, true);

// shuttle.dm:360
rt.def("/datum/controller/subsystem/shuttle/proc/moveShuttle", function* moveShuttle(f: Frame, shuttleId: Value, dockId: Value, timed: Value) {
	let M: Value = this.getShuttle(shuttleId);
	let D: Value = this.getDock(dockId);
	if (!M) {
		return 1;
	}
	if (timed) {
		if (yield* M.request(D)) {
			return 2;
		}
	} else if (yield* M.dock(D)) {
		return 2;
	}
	return 0;
}, true);

// shuttle.dm:374
rt.def("/datum/controller/subsystem/shuttle/proc/request_transit_dock", function request_transit_dock(f: Frame, M: Value) {
	if (!rt.istype(M, T("/obj/docking_port/mobile"))) {
		rt.throw_(f, new_(T("/exception"), `${M} is not a mobile docking port`, "code/controllers/subsystem/shuttle.dm", 375));
	}
	if (M.assigned_transit) {
		return f.dot;
	} else {
		if (rt.isIn(f, M, this.transit_requesters)) return f.dot;
		this.transit_requesters += M;
	}
	return f.dot;
});

// shuttle.dm:390
rt.def("/datum/controller/subsystem/shuttle/proc/generate_transit_dock", function* generate_transit_dock(f: Frame, M: Value) {
	let proposed_zone: Value = null, i: Value = null, topleft: Value = null, bottomright: Value = null, j: Value = null, _T: Value = null, midpoint: Value = null, A: Value = null, new_transit_dock: Value = null, i_20: Value = null, _T_21: Value = null;
	let $e: any;
	let travel_dir: Value = M.preferred_direction;
	let dock_angle: Value = dir2angle(M.preferred_direction) + M.port_angle + 180;
	let dock_dir: Value = angle2dir(dock_angle);
	let transit_width: Value = 16;
	let transit_height: Value = 16;
	if (dock_dir === 1 || dock_dir === 2) {
		transit_width += M.width;
		transit_height += M.height;
	} else if (dock_dir === 4 || dock_dir === SHUTTLE_TRANSIT_BORDER) {
		transit_width += M.height;
		transit_height += M.width;
	}
	rt.forList(f, 0, this.transit_turfs);
	blk92: {
		loop34: while (true) {
			if (($e = rt.next(f, 0)) === undefined) break;
			i = $e;
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
			if (!rt.bitAnd((topleft = i).flags, 2)) {
				continue;
			}
			if (!(bottomright = rt.locate(topleft.x + transit_width, topleft.y + transit_height, topleft.z))) {
				continue;
			}
			if (!rt.bitAnd(bottomright.flags, 2)) {
				continue;
			}
			if (!(proposed_zone = block(topleft, bottomright))) {
				continue;
			}
			j = null;
			for (j of each(proposed_zone)) {
				if (!(_T = j)) {
					continue loop34;
				}
				if (!rt.bitAnd(_T.flags, 2)) {
					continue loop34;
				}
			}
			break blk92;
		}
		rt.endFor(f, 0);
	}
	if (!proposed_zone || !rt.len(f, proposed_zone)) {
		return 0;
	}
	let topleft_6: Value = rt.index(proposed_zone, 1);
	let coords: Value = M.return_coords(0, 0, dock_dir);
	let x0: Value = rt.index(coords, 1);
	let y0: Value = rt.index(coords, 2);
	let x1: Value = rt.index(coords, 3);
	let y1: Value = rt.index(coords, 4);
	let x2: Value = min(x0, x1);
	let y2: Value = min(y0, y1);
	let transit_x: Value = topleft_6.x + 8 + rt.op(f, "Abs", [], [x2]);
	let transit_y: Value = topleft_6.y + 8 + rt.op(f, "Abs", [], [y2]);
	let transit_path: Value = T("/turf/open/space/transit");
	if (travel_dir === 1) {
		transit_path = T("/turf/open/space/transit/north");
	} else if (travel_dir === 2) {
		transit_path = T("/turf/open/space/transit/south");
	} else if (travel_dir === 4) {
		transit_path = T("/turf/open/space/transit/east");
	} else if (travel_dir === 8) {
		transit_path = T("/turf/open/space/transit/west");
	}
	if (!(midpoint = rt.locate(transit_x, transit_y, topleft_6.z))) {
		return 0;
	}
	(A = (yield* new_(T("/area/shuttle/transit")))).parallax_movedir = travel_dir;
	A.contents = proposed_zone;
	(new_transit_dock = (yield* new_(T("/obj/docking_port/stationary/transit"), midpoint))).assigned_turfs = proposed_zone;
	new_transit_dock.name = `Transit for ${M.id}/${M.name}`;
	new_transit_dock.turf_type = transit_path;
	new_transit_dock.owner = M;
	new_transit_dock.assigned_area = A;
	yield* new_transit_dock.setDir(angle2dir(dock_angle));
	for (i_20 of each(new_transit_dock.assigned_turfs)) {
		yield* (_T_21 = i_20).ChangeTurf(transit_path);
		(rt.modField(f, _T_21, "flags", 16777213, rt.bitAnd));
	}
	M.assigned_transit = new_transit_dock;
	return 1;
}, true);

// shuttle.dm:512
rt.def("/datum/controller/subsystem/shuttle/proc/initial_move", function* initial_move(f: Frame) {
	let M: Value = null;
	for (M of each(this.mobile, T("/obj/docking_port/mobile"))) {
		if (!M.roundstart_move) {
			continue;
		}
		yield* M.dockRoundstart();
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);

// shuttle.dm:519
rt.def("/datum/controller/subsystem/shuttle/proc/Recover", function Recover(f: Frame) {
	if (rt.istype(GLOB.SSshuttle.mobile, T("/list"))) {
		this.mobile = GLOB.SSshuttle.mobile;
	}
	if (rt.istype(GLOB.SSshuttle.stationary, T("/list"))) {
		this.stationary = GLOB.SSshuttle.stationary;
	}
	if (rt.istype(GLOB.SSshuttle.transit, T("/list"))) {
		this.transit = GLOB.SSshuttle.transit;
	}
	if (rt.istype(GLOB.SSshuttle.discoveredPlants, T("/list"))) {
		this.discoveredPlants = GLOB.SSshuttle.discoveredPlants;
	}
	if (rt.istype(GLOB.SSshuttle.requestlist, T("/list"))) {
		this.requestlist = GLOB.SSshuttle.requestlist;
	}
	if (rt.istype(GLOB.SSshuttle.orderhistory, T("/list"))) {
		this.orderhistory = GLOB.SSshuttle.orderhistory;
	}
	if (rt.istype(GLOB.SSshuttle.emergency, T("/obj/docking_port/mobile/emergency"))) {
		this.emergency = GLOB.SSshuttle.emergency;
	}
	if (rt.istype(GLOB.SSshuttle.backup_shuttle, T("/obj/docking_port/mobile/emergency/backup"))) {
		this.backup_shuttle = GLOB.SSshuttle.backup_shuttle;
	}
	if (rt.istype(GLOB.SSshuttle.supply, T("/obj/docking_port/mobile/supply"))) {
		this.supply = GLOB.SSshuttle.supply;
	}
	if (rt.istype(GLOB.SSshuttle.transit_turfs, T("/list"))) {
		this.transit_turfs = GLOB.SSshuttle.transit_turfs;
	}
	this.centcom_message = GLOB.SSshuttle.centcom_message;
	this.ordernum = GLOB.SSshuttle.ordernum;
	this.points = GLOB.SSshuttle.points;
	return f.dot;
});

// shuttle.dm:546
rt.def("/datum/controller/subsystem/shuttle/proc/is_in_shuttle_bounds", function is_in_shuttle_bounds(f: Frame, A: Value) {
	let current: Value = null, M: Value = null;
	if (rt.istype((current = get_area(A)), T("/area/shuttle")) && !rt.istype(current, T("/area/shuttle/transit"))) {
		return 1;
	}
	for (M of each(this.mobile, T("/obj/docking_port/mobile"))) {
		if (M.is_in_shuttle_bounds(A)) {
			return 1;
		}
	}
	return f.dot;
});

// shuttle.dm:554
rt.def("/datum/controller/subsystem/shuttle/proc/get_containing_shuttle", function get_containing_shuttle(f: Frame, A: Value) {
	let M: Value = null;
	for (M of each(this.mobile, T("/obj/docking_port/mobile"))) {
		if (M.is_in_shuttle_bounds(A)) {
			return M;
		}
	}
	return f.dot;
});
