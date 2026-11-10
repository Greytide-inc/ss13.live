// Based on /tg/station's code/modules/shuttle/arrivals.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


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

// arrivals.dm:25
rt.def("/obj/docking_port/mobile/arrivals/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	if (GLOB.SSshuttle.arrivals) {
		warning(`${"More than one arrivals docking_port placed on map!"} in ${"code/modules/shuttle/arrivals.dm"} at line ${26} src: ${this} usr: ${f.usr}.`);
		return INITIALIZE_HINT_QDEL;
	}
	GLOB.SSshuttle.arrivals = this;
	f.dot = (yield* parent_proc());
	this.preferred_direction = this.dir;
	return INITIALIZE_HINT_LATELOAD;
}, true);

// arrivals.dm:36
rt.def("/obj/docking_port/mobile/arrivals/proc/LateInitialize", function LateInitialize(f: Frame) {
	let A: Value = null, C: Value = null;
	this.areas = list();
	let new_latejoin: Value = list();
	for (A of each(GLOB.sortedAreas, T("/area/shuttle/arrival"))) {
		C = null;
		for (C of each(A, T("/obj/structure/chair"))) {
			new_latejoin += C;
		}
		if (!this.console) {
			this.console = rt.locateIn(f, T("/obj/machinery/requests_console"), A);
		}
		this.areas += A;
	}
	if (rt.len(f, GLOB.SSjob.latejoin_trackers)) {
		warning(`${"Map contains predefined latejoin spawn points and an arrivals shuttle. Using the arrivals shuttle."} in ${"code/modules/shuttle/arrivals.dm"} at line ${47} src: ${this} usr: ${f.usr}.`);
	}
	if (!rt.len(f, new_latejoin)) {
		warning(`${"Arrivals shuttle contains no chairs for spawn points. Reverting to latejoin landmarks."} in ${"code/modules/shuttle/arrivals.dm"} at line ${50} src: ${this} usr: ${f.usr}.`);
		if (!rt.len(f, GLOB.SSjob.latejoin_trackers)) {
			warning(`${"No latejoin landmarks exist. Players will spawn unbuckled on the shuttle."} in ${"code/modules/shuttle/arrivals.dm"} at line ${52} src: ${this} usr: ${f.usr}.`);
		}
		return f.dot;
	}
	GLOB.SSjob.latejoin_trackers = new_latejoin;
	return f.dot;
});

// arrivals.dm:58
rt.def("/obj/docking_port/mobile/arrivals/proc/dockRoundstart", function* dockRoundstart(f: Frame) {
	yield* GLOB.SSshuttle.generate_transit_dock(this);
	yield* this.Launch();
	this.timer = rt.worldTime(f);
	yield* this.check();
	return 1;
}, true);

// arrivals.dm:65
rt.def("/obj/docking_port/mobile/arrivals/proc/check", function* check(f: Frame) {
	let announcer: Value = null;
	f.dot = (yield* parent_proc());
	if (this.perma_docked) {
		if (this.mode != "call") {
			this.sound_played = 0;
			this.mode = "idle";
		} else {
			yield* this.SendToStation();
		}
		return f.dot;
	}
	if (this.damaged) {
		if (!this.CheckTurfsPressure()) {
			this.damaged = 0;
			if (this.console) {
				yield* this.console.say("Repairs complete, launching soon.");
			}
		}
		return f.dot;
	} else if (this.CheckTurfsPressure()) {
		this.damaged = 1;
		if (this.console) {
			yield* this.console.say("Alert, hull breach detected!");
		}
		yield* (announcer = pick(GLOB.announcement_systems)).announce("ARRIVALS_BROKEN", { channels: list() });
		if (this.mode != "call") {
			this.sound_played = 0;
			this.mode = "idle";
		} else {
			yield* this.SendToStation();
		}
		return f.dot;
	}
	let found_awake: Value = (this.PersonCheck() || this.NukeDiskCheck());
	if (this.mode == "call") {
		if (found_awake) {
			yield* this.SendToStation();
		}
	} else if (this.mode == "igniting") {
		if (found_awake && !this.force_depart) {
			this.mode = "idle";
			this.sound_played = 0;
		} else if (!this.sound_played) {
			this.hyperspace_sound(1, this.areas);
			this.sound_played = 1;
		}
	} else {
		if (found_awake) return f.dot;
		yield* this.Launch(0);
	}
	return f.dot;
}, true);

// arrivals.dm:112
rt.def("/obj/docking_port/mobile/arrivals/proc/CheckTurfsPressure", function CheckTurfsPressure(f: Frame) {
	let I: Value = null, _T: Value = null, pressure: Value = null;
	for (I of each(GLOB.SSjob.latejoin_trackers)) {
		_T = rt.getStep(f, I, 0);
		if ((pressure = _T.air.return_pressure()) < HAZARD_LOW_PRESSURE || pressure > HAZARD_HIGH_PRESSURE) {
			return 1;
		}
	}
	return 0;
});

// arrivals.dm:120
rt.def("/obj/docking_port/mobile/arrivals/proc/PersonCheck", function PersonCheck(f: Frame) {
	let M: Value = null, L: Value = null;
	for (M of each(rt.bitAnd(GLOB.living_mob_list, GLOB.player_list))) {
		L = M;
		if (rt.isIn(f, get_area(M), this.areas) && L.stat != 2) {
			return 1;
		}
	}
	return 0;
});

// arrivals.dm:127
rt.def("/obj/docking_port/mobile/arrivals/proc/NukeDiskCheck", function NukeDiskCheck(f: Frame) {
	let N: Value = null;
	for (N of each(GLOB.poi_list, T("/obj/item/weapon/disk/nuclear"))) {
		if (rt.isIn(f, get_area(N), this.areas)) {
			return 1;
		}
	}
	return 0;
});

// arrivals.dm:134
rt.def("/obj/docking_port/mobile/arrivals/proc/SendToStation", function* SendToStation(f: Frame) {
	let $0: any, $1: any;
	let dockTime: Value = GLOB.config.arrivals_shuttle_dock_window;
	if (!(this.mode == "call" && this.timeLeft(1) > dockTime)) return f.dot;
	if (this.console) {
		$0 = this.console;
		if (this.damaged) {
			$1 = "Initiating emergency docking for repairs!";
		} else {
			$1 = `Now approaching: ${station_name()}.`;
		}
		yield* $0.say($1);
	}
	this.hyperspace_sound(HYPERSPACE_LAUNCH, this.areas);
	this.setTimer(dockTime);
	return f.dot;
}, true);

// arrivals.dm:141
rt.def("/obj/docking_port/mobile/arrivals/proc/dock", function* dock(f: Frame) {
	let cancel_reason: Value = null, L: Value = null, C: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	let docked: Value = (f.args[0] == this.assigned_transit ? 1 : 0);
	this.sound_played = 0;
	if (docked) {
		if (!this.force_depart) {
			if (this.PersonCheck()) {
				cancel_reason = "lifeform dectected on board";
			} else if (this.NukeDiskCheck()) {
				cancel_reason = "critical station device detected on board";
			}
			if (cancel_reason) {
				this.mode = "idle";
				if (this.console) {
					yield* this.console.say(`Launch cancelled, ${cancel_reason}.`);
				}
				return f.dot;
			}
		}
		this.force_depart = 0;
	}
	f.dot = (yield* parent_proc());
	if (!(!f.dot && !docked && !this.damaged)) return f.dot;
	if (this.console) {
		yield* this.console.say("Welcome to your new life, employees!");
	}
	for (L of each(this.queued_announces)) {
		yield* (C = L).Invoke();
	}
	if (!this.queued_announces) return f.dot;
	this.queued_announces.Cut();
	return f.dot;
}, true, { args: ["S1", "force"] });

// arrivals.dm:166
rt.def("/obj/docking_port/mobile/arrivals/proc/check_effects", function* check_effects(f: Frame) {
	yield* parent_proc();
	if (!(this.mode == "call" && !this.sound_played && this.timeLeft(1) <= HYPERSPACE_END_TIME)) return f.dot;
	this.sound_played = 1;
	this.hyperspace_sound(HYPERSPACE_END, this.areas);
	return f.dot;
}, true);

// arrivals.dm:172
rt.def("/obj/docking_port/mobile/arrivals/proc/canDock", function canDock(f: Frame, S: Value) {
	f.dot = parent_proc();
	if (f.dot != "we_are_already_docked") return f.dot;
	f.dot = "can_dock";
	return f.dot;
}, false);

// arrivals.dm:179
rt.def("/obj/docking_port/mobile/arrivals/proc/Launch", function* Launch(f: Frame, pickingup: Value) {
	let $0: any, $1: any;
	if (pickingup) {
		this.force_depart = 1;
	}
	if (this.mode != "idle") return f.dot;
	if (this.console) {
		$0 = this.console;
		if (pickingup) {
			$1 = "Departing immediately for new employee pickup.";
		} else {
			$1 = "Shuttle departing.";
		}
		yield* $0.say($1);
	}
	yield* this.request(GLOB.SSshuttle.getDock("arrivals_stationary"));
	return f.dot;
}, true);

// arrivals.dm:195
rt.def("/obj/docking_port/mobile/arrivals/proc/QueueAnnounce", function* QueueAnnounce(f: Frame, mob: Value, rank: Value) {
	if (this.mode != "call") {
		yield* AnnounceArrival(mob, rank);
	} else {
		if (!this.queued_announces) {
			this.queued_announces = list();
		}
		this.queued_announces += (yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/AnnounceArrival"), mob, rank));
	}
	return f.dot;
}, true);

// arrivals.dm:201
rt.def("/obj/docking_port/mobile/arrivals/proc/vv_edit_var", function* vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	return (yield* parent_proc());
}, true);
