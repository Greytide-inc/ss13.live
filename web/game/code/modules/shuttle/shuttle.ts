// Based on /tg/station's code/modules/shuttle/shuttle.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(13043, "/obj/docking_port", "/obj", {
	id: null,
	width: 0,
	height: 0,
	dwidth: 0,
	dheight: 0,
	resistance_flags: 115,
	anchored: 1,
	invisibility: 101,
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "pinonfar",
	dir: 1,
});

// shuttle.dm:29
rt.def("/obj/docking_port/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	if (force) {
		yield* parent_proc();
		f.dot = QDEL_HINT_HARDDEL_NOW;
	} else {
		return 1;
	}
	return f.dot;
}, true);

// shuttle.dm:46
rt.def("/obj/docking_port/proc/return_coords", function return_coords(f: Frame, _x: Value, _y: Value, _dir: Value) {
	if (_dir === null) {
		_dir = this.dir;
	}
	if (_x === null) {
		_x = this.x;
	}
	if (_y === null) {
		_y = this.y;
	}
	let cos: Value = 1;
	let sin: Value = 0;
	if (_dir === 8) {
		cos = 0;
		sin = 1;
	} else if (_dir === 2) {
		cos = -1;
		sin = 0;
	} else if (_dir === 4) {
		cos = 0;
		sin = -1;
	}
	return list(_x + -this.dwidth * cos - -this.dheight * sin, _y + -this.dwidth * sin + -this.dheight * cos, _x + (-this.dwidth + this.width - 1) * cos - (-this.dheight + this.height - 1) * sin, _y + (-this.dwidth + this.width - 1) * sin + (-this.dheight + this.height - 1) * cos);
});

// shuttle.dm:78
rt.def("/obj/docking_port/proc/return_ordered_turfs", function return_ordered_turfs(f: Frame, _x: Value, _y: Value, _z: Value, _dir: Value, A: Value) {
	let xi: Value = null, yi: Value = null, dy: Value = null, _T: Value = null;
	if (!_dir) {
		_dir = this.dir;
	}
	if (!_x) {
		_x = this.x;
	}
	if (!_y) {
		_y = this.y;
	}
	if (!_z) {
		_z = this.z;
	}
	let cos: Value = 1;
	let sin: Value = 0;
	if (_dir === 8) {
		cos = 0;
		sin = 1;
	} else if (_dir === 2) {
		cos = -1;
		sin = 0;
	} else if (_dir === 4) {
		cos = 0;
		sin = -1;
	}
	f.dot = list();
	let dx: Value = 0;
	while (dx < this.width) {
		dy = 0;
		while (dy < this.height) {
			xi = _x + (dx - this.dwidth) * cos - (dy - this.dheight) * sin;
			yi = _y + (dy - this.dheight) * cos + (dx - this.dwidth) * sin;
			_T = rt.locate(xi, yi, _z);
			if (A) {
				if (get_area(_T) == A) {
					f.dot += _T;
				} else {
					f.dot += null;
				}
			} else {
				f.dot += _T;
			}
			dy++;
		}
		dx++;
	}
	return f.dot;
});

// shuttle.dm:135
rt.def("/obj/docking_port/proc/get_docked", function get_docked(f: Frame) {
	return rt.locateIn(f, T("/obj/docking_port/stationary"), this.loc);
});

// shuttle.dm:138
rt.def("/obj/docking_port/proc/getDockedId", function getDockedId(f: Frame) {
	let _P: Value = null;
	if (!(_P = this.get_docked())) return f.dot;
	return _P.id;
});

rt.type(13053, "/obj/docking_port/stationary", "/obj/docking_port", {
	turf_type: rt.typePath("/turf/open/space"),
	last_dock_time: null,
	area_type: rt.typePath("/area/space"),
	name: "dock",
});

// shuttle.dm:149
rt.def("/obj/docking_port/stationary/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	GLOB.SSshuttle.stationary += this;
	if (!this.id) {
		this.id = `${rt.len(f, GLOB.SSshuttle.stationary)}`;
	}
	if (this.name != "dock") return f.dot;
	this.name = `dock${rt.len(f, GLOB.SSshuttle.stationary)}`;
	return f.dot;
});

// shuttle.dm:162
rt.def("/obj/docking_port/stationary/proc/get_docked", function get_docked(f: Frame) {
	f.dot = rt.locateIn(f, T("/obj/docking_port/mobile"), this.loc);
	return f.dot;
});

rt.type(13056, "/obj/docking_port/stationary/transit", "/obj/docking_port/stationary", {
	assigned_turfs: null,
	assigned_area: null,
	owner: null,
	turf_type: rt.typePath("/turf/open/space/transit"),
	name: "In Transit",
});

// shuttle.dm:167
rt.def("/obj/docking_port/stationary/transit/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.assigned_turfs = list();
	return f.dot;
});

// shuttle.dm:172
rt.def("/obj/docking_port/stationary/transit/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	GLOB.SSshuttle.transit += this;
	return f.dot;
});

// shuttle.dm:176
rt.def("/obj/docking_port/stationary/transit/proc/dezone", function* dezone(f: Frame) {
	let i: Value = null, _T: Value = null;
	for (i of each(this.assigned_turfs)) {
		if ((_T = i).type == this.turf_type) {
			yield* _T.ChangeTurf(T("/turf/open/space"));
			(rt.modField(f, _T, "flags", 2, rt.bitOr));
			GLOB.SSshuttle.transit_recolor += _T;
		}
	}
	return f.dot;
}, true);

// shuttle.dm:185
rt.def("/obj/docking_port/stationary/transit/proc/Destroy", function* Destroy(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (f.args[0]) {
		GLOB.SSshuttle.transit -= this;
		if (this.owner) {
			this.owner = null;
		}
		if (this.assigned_turfs) {
			yield* this.dezone();
			this.assigned_turfs.Cut();
		}
		this.assigned_turfs = null;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["force"] });

rt.type(13044, "/obj/docking_port/mobile", "/obj/docking_port", {
	areaInstance: null,
	timer: null,
	last_timer_length: null,
	mode: "idle",
	callTime: 100,
	ignitionTime: 55,
	roundstart_move: null,
	preferred_direction: 1,
	port_angle: 0,
	destination: null,
	previous: null,
	assigned_transit: null,
	launch_status: -1,
	knockdown: 1,
	timid: 0,
	ripples: null,
	engine_coeff: 1,
	current_engines: 0,
	initial_engines: 0,
	name: "shuttle",
	icon_state: "pinonclose",
});

// shuttle.dm:227
rt.def("/obj/docking_port/mobile/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ripples = list();
	return f.dot;
});

// shuttle.dm:237
rt.def("/obj/docking_port/mobile/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	if (force) {
		GLOB.SSshuttle.mobile -= this;
		this.destination = null;
		this.previous = null;
		this.assigned_transit = null;
		this.areaInstance = null;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// shuttle.dm:245
rt.def("/obj/docking_port/mobile/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let A: Value = null;
	f.dot = (yield* parent_proc());
	if (!this.timid) {
		yield* this.register();
	}
	if (rt.istype((A = get_area(this)), T("/area/shuttle"))) {
		this.areaInstance = A;
	}
	if (!this.id) {
		this.id = `${rt.len(f, GLOB.SSshuttle.mobile)}`;
	}
	if (this.name == "shuttle") {
		this.name = `shuttle${rt.len(f, GLOB.SSshuttle.mobile)}`;
	}
	if (!this.areaInstance) {
		this.areaInstance = (yield* new_(T("/area/shuttle")));
		this.areaInstance.name = this.name;
		this.areaInstance.contents += this.return_ordered_turfs();
	}
	this.initial_engines = this.count_engines();
	this.current_engines = this.initial_engines;
	return f.dot;
}, true);

// shuttle.dm:276
rt.def("/obj/docking_port/mobile/proc/canDock", function canDock(f: Frame, S: Value) {
	let currently_docked: Value = null;
	if (!rt.istype(S, T("/obj/docking_port/stationary"))) {
		return "not_a_docking_port";
	}
	if (rt.istype(S, T("/obj/docking_port/stationary/transit"))) {
		return "can_dock";
	}
	if (this.dwidth > S.dwidth) {
		return "docking_width_too_large";
	}
	if (this.width - this.dwidth > S.width - S.dwidth) {
		return "width_too_large";
	}
	if (this.dheight > S.dheight) {
		return "docking_height_too_large";
	}
	if (this.height - this.dheight > S.height - S.dheight) {
		return "height_too_large";
	}
	if (currently_docked = S.get_docked()) {
		if (currently_docked != this) {
			return "someone_else_docked";
		}
		return "we_are_already_docked";
	}
	return "can_dock";
});

// shuttle.dm:308
rt.def("/obj/docking_port/mobile/proc/check_dock", function check_dock(f: Frame, S: Value) {
	let status: Value = null, msg: Value = null;
	if ((status = this.canDock(S)) == "can_dock") {
		return 1;
	} else if (status == "we_are_already_docked") {
		return 0;
	} else {
		message_admins((msg = `Shuttle ${this} cannot dock at ${S}, error: ${status}`));
		return 0;
	}
});

// shuttle.dm:321
rt.def("/obj/docking_port/mobile/proc/transit_failure", function transit_failure(f: Frame) {
	message_admins(`Shuttle ${this} repeatedly failed to create transit zone.`);
	return f.dot;
});

// shuttle.dm:325
rt.def("/obj/docking_port/mobile/proc/request", function request(f: Frame, S: Value) {
	if (!this.check_dock(S)) {
		return f.dot;
	}
	if (this.mode == "igniting" && this.destination == S) {
		return f.dot;
	}
	if (this.mode === "call") {
		if (S == this.destination) {
			if (this.timeLeft(1) < this.callTime * this.engine_coeff) {
				this.setTimer(this.callTime * this.engine_coeff);
			}
		} else {
			this.destination = S;
			this.setTimer(this.callTime * this.engine_coeff);
		}
	} else if (this.mode === "recall") {
		if (S == this.destination) {
			this.setTimer(this.callTime * this.engine_coeff - this.timeLeft(1));
		} else {
			this.destination = S;
			this.setTimer(this.callTime * this.engine_coeff);
		}
		this.mode = "call";
	} else if (this.mode === "idle" || this.mode === "igniting") {
		this.destination = S;
		this.mode = "igniting";
		this.setTimer(this.ignitionTime);
	}
	return f.dot;
});

// shuttle.dm:354
rt.def("/obj/docking_port/mobile/proc/cancel", function* cancel(f: Frame) {
	if (this.mode != "call") {
		return f.dot;
	}
	yield* this.remove_ripples();
	this.invertTimer();
	this.mode = "recall";
	return f.dot;
}, true);

// shuttle.dm:363
rt.def("/obj/docking_port/mobile/proc/enterTransit", function* enterTransit(f: Frame) {
	let S1: Value = null;
	let $0: any, $1: any, $2: any;
	if (GLOB.SSshuttle.lockdown && this.z == ZLEVEL_STATION) {
		return f.dot;
	}
	this.previous = null;
	let S0: Value = this.get_docked();
	if (S1 = this.assigned_transit) {
		if (yield* this.dock(S1)) {
			$0 = this.id;
			if (S0) {
				$1 = S0.id;
			} else {
				$1 = "null";
			}
			if (S1) {
				$2 = S1.id;
			} else {
				$2 = "null";
			}
			warning(`${`shuttle "${$0}" could not enter transit space. Docked at ${$1}. Transit dock ${$2}.`} in ${"code/modules/shuttle/shuttle.dm"} at line ${372} src: ${this} usr: ${f.usr}.`);
		} else {
			this.previous = S0;
		}
	} else {
		$0 = this.id;
		if (S0) {
			$1 = S0.id;
		} else {
			$1 = "null";
		}
		if (S1) {
			$2 = S1.id;
		} else {
			$2 = "null";
		}
		warning(`${`shuttle "${$0}" could not enter transit space. S0=${$1} S1=${$2}`} in ${"code/modules/shuttle/shuttle.dm"} at line ${376} src: ${this} usr: ${f.usr}.`);
	}
	return f.dot;
}, true);

// shuttle.dm:382
rt.def("/obj/docking_port/mobile/proc/jumpToNullSpace", function* jumpToNullSpace(f: Frame) {
	let A0: Value = null, T0: Value = null, i: Value = null;
	let S0: Value = this.get_docked();
	let turf_type: Value = T("/turf/open/space");
	let area_type: Value = T("/area/space");
	if (S0) {
		if (S0.turf_type) {
			turf_type = S0.turf_type;
		}
		if (S0.area_type) {
			area_type = S0.area_type;
		}
	}
	let L0: Value = this.return_ordered_turfs(this.x, this.y, this.z, this.dir, this.areaInstance);
	if (rt.len(f, this.areaInstance.contents)) {
		if (!(A0 = rt.locateIn(f, `${area_type}`, rt.world()))) {
			A0 = (yield* new_(area_type, null));
		}
		for (T0 of each(L0, T("/turf"))) {
			A0.contents += T0;
		}
	}
	for (i of each(L0)) {
		if (!(T0 = i)) {
			continue;
		}
		yield* T0.empty(turf_type);
	}
	yield* qdel(this, { force: 1 });
	return f.dot;
}, true);

// shuttle.dm:412
rt.def("/obj/docking_port/mobile/proc/create_ripples", function* create_ripples(f: Frame, S1: Value, animate_time: Value) {
	let t: Value = null;
	let turfs: Value = this.ripple_area(S1);
	for (t of each(turfs)) {
		this.ripples += (yield* new_(T("/obj/effect/temp_visual/ripple"), t, animate_time));
	}
	return f.dot;
}, true);

// shuttle.dm:417
rt.def("/obj/docking_port/mobile/proc/remove_ripples", function* remove_ripples(f: Frame) {
	let R: Value = null;
	for (R of each(this.ripples)) {
		yield* qdel(R);
	}
	this.ripples.Cut();
	return f.dot;
}, true);

// shuttle.dm:422
rt.def("/obj/docking_port/mobile/proc/ripple_area", function ripple_area(f: Frame, S1: Value) {
	let i: Value = null, T0: Value = null, T1: Value = null;
	let $e: any;
	let L0: Value = this.return_ordered_turfs(this.x, this.y, this.z, this.dir, this.areaInstance);
	let L1: Value = this.return_ordered_turfs(S1.x, S1.y, S1.z, S1.dir);
	let ripple_turfs: Value = list();
	rt.forRange(f, 0, 1, rt.len(f, L0), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!(T0 = rt.index(L0, i))) {
			continue;
		}
		if (!(T1 = rt.index(L1, i))) {
			continue;
		}
		if (T0.type != T0.baseturf) {
			ripple_turfs += T1;
		}
	}
	rt.endFor(f, 0);
	return ripple_turfs;
});

// shuttle.dm:440
rt.def("/obj/docking_port/mobile/proc/check_poddoors", function check_poddoors(f: Frame) {
	let pod: Value = null;
	for (pod of each(GLOB.airlocks, T("/obj/machinery/door/poddoor/shuttledock"))) {
		pod.check();
	}
	return f.dot;
});

// shuttle.dm:446
rt.def("/obj/docking_port/mobile/proc/dock", function* dock(f: Frame, S1: Value, force: Value) {
	let rotation: Value = null, A0: Value = null, T0: Value = null, old: Value = null, i: Value = null, T1: Value = null, AM: Value = null, i_8: Value = null, T0_9: Value = null, T1_10: Value = null, old_11: Value = null, Ts1: Value = null, AM_12: Value = null, am: Value = null, AM_9: Value = null;
	let $e: any;
	force ??= 0;
	if (S1.get_docked() == this) {
		yield* this.remove_ripples();
		return f.dot;
	}
	if (!force) {
		if (!this.check_dock(S1)) {
			return -1;
		}
		if (!this.canMove()) {
			return -1;
		}
	}
	GLOB.SSshuttle.last_dock_time = rt.worldTime(f);
	let S0: Value = this.get_docked();
	let turf_type: Value = T("/turf/open/space");
	let area_type: Value = T("/area/space");
	if (S0) {
		if (S0.turf_type) {
			turf_type = S0.turf_type;
		}
		if (S0.area_type) {
			area_type = S0.area_type;
		}
	}
	let destination_turf_type: Value = S1.turf_type;
	let L0: Value = this.return_ordered_turfs(this.x, this.y, this.z, this.dir, this.areaInstance);
	let L1: Value = this.return_ordered_turfs(S1.x, S1.y, S1.z, S1.dir);
	if ((rotation = dir2angle(S1.dir) - dir2angle(this.dir)) % 90 != 0) {
		rotation += rotation % 90;
	}
	rotation = SimplifyDegrees(rotation);
	if (rt.len(f, this.areaInstance.contents)) {
		if (!(A0 = rt.locateIn(f, `${area_type}`, rt.world()))) {
			A0 = (yield* new_(area_type, null));
		}
		for (T0 of each(L0, T("/turf"))) {
			old = T0.loc;
			A0.contents += T0;
			yield* T0.change_area(old, A0);
		}
	}
	if (rt.istype(S1, T("/obj/docking_port/stationary/transit"))) {
		this.areaInstance.parallax_movedir = this.preferred_direction;
	} else {
		this.areaInstance.parallax_movedir = 0;
	}
	yield* this.remove_ripples();
	yield* this.roadkill(L0, L1, S1.dir);
	rt.forRange(f, 0, 1, rt.len(f, L0), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!(T0 = rt.index(L0, i))) {
			continue;
		}
		if (!(T1 = rt.index(L1, i))) {
			continue;
		}
		if (T0.type == T0.baseturf) {
			continue;
		}
		AM = null;
		for (AM of each(T0, T("/atom/movable"))) {
			yield* AM.beforeShuttleMove(T1, rotation);
		}
	}
	rt.endFor(f, 0);
	let moved_atoms: Value = list();
	rt.forRange(f, 0, 1, rt.len(f, L0), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i_8 = $e;
		if (!(T0_9 = rt.index(L0, i_8))) {
			continue;
		}
		if (!(T1_10 = rt.index(L1, i_8))) {
			continue;
		}
		if (T0_9.type != T0_9.baseturf) {
			yield* T0_9.copyTurf(T1_10);
			T1_10.baseturf = destination_turf_type;
			old_11 = T1_10.loc;
			this.areaInstance.contents += T1_10;
			yield* T1_10.change_area(old_11, this.areaInstance);
			if (rt.istype(T1_10, T("/turf/open"))) {
				(Ts1 = T1_10).copy_air_with_tile(T0_9);
			}
			AM_12 = null;
			for (AM_12 of each(T0_9, T("/atom/movable"))) {
				if (yield* AM_12.onShuttleMove(T1_10, rotation, this.knockdown)) {
					moved_atoms += AM_12;
				}
			}
		}
		if (rotation) {
			yield* T1_10.shuttleRotate(rotation);
		}
		GLOB.SSair.remove_from_active(T1_10);
		T1_10.CalculateAdjacentTurfs();
		GLOB.SSair.add_to_active(T1_10, 1);
		yield* T0_9.ChangeTurf(turf_type);
		GLOB.SSair.remove_from_active(T0_9);
		T0_9.CalculateAdjacentTurfs();
		GLOB.SSair.add_to_active(T0_9, 1);
	}
	rt.endFor(f, 0);
	for (am of each(moved_atoms)) {
		yield* (AM_9 = am).afterShuttleMove();
	}
	this.check_poddoors();
	S1.last_dock_time = rt.worldTime(f);
	this.loc = S1.loc;
	yield* this.setDir(S1.dir);
	return f.dot;
}, true);

// shuttle.dm:557
rt.def("/obj/docking_port/mobile/proc/findRoundstartDock", function findRoundstartDock(f: Frame) {
	return GLOB.SSshuttle.getDock(this.roundstart_move);
});

// shuttle.dm:560
rt.def("/obj/docking_port/mobile/proc/dockRoundstart", function* dockRoundstart(f: Frame) {
	f.dot = (yield* this.dock_id(this.roundstart_move));
	return f.dot;
}, true);

// shuttle.dm:563
rt.def("/obj/docking_port/mobile/proc/dock_id", function* dock_id(f: Frame, id: Value) {
	let port: Value = null;
	if (port = GLOB.SSshuttle.getDock(id)) {
		f.dot = (yield* this.dock(port));
	} else {
		f.dot = null;
	}
	return f.dot;
}, true);

// shuttle.dm:573
rt.def("/obj/docking_port/mobile/proc/roadkill", function* roadkill(f: Frame, L0: Value, L1: Value, dir: Value) {
	let i: Value = null, T0: Value = null, T1: Value = null, AM: Value = null, M: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, rt.len(f, L0), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		T0 = rt.index(L0, i);
		T1 = rt.index(L1, i);
		if (!T0 || !T1) {
			continue;
		}
		if (T0.type == T0.baseturf) {
			continue;
		}
		AM = null;
		for (AM of each(T1, T("/atom/movable"))) {
			if (ismob(AM)) {
				if (rt.istype(AM, T("/mob/living"))) {
					if ((M = AM).buckled) {
						yield* M.buckled.unbuckle_mob(M, 1);
					}
					if (M.pulledby) {
						yield* M.pulledby.stop_pulling();
					}
					yield* M.stop_pulling();
					M.visible_message(`<span class='warning'>${this} slams into ${M}!</span>`);
					yield* M.gib();
				}
			} else {
				if (rt.istype(AM, T("/obj/singularity")) && !rt.istype(AM, T("/obj/singularity/narsie"))) {
					continue;
				}
				if (!AM.anchored) {
					yield* step(AM, dir);
				} else {
					yield* qdel(AM);
				}
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// shuttle.dm:608
rt.def("/obj/docking_port/mobile/proc/check", function* check(f: Frame) {
	yield* this.check_effects();
	if (this.mode == "igniting") {
		this.check_transit_zone();
	}
	if (this.timeLeft(1) > 0) {
		return f.dot;
	}
	if (this.mode === "call") {
		if (yield* this.dock(this.destination)) {
			this.setTimer(20);
			return f.dot;
		}
	} else if (this.mode === "recall") {
		if (yield* this.dock(this.previous)) {
			this.setTimer(20);
			return f.dot;
		}
	} else if (this.mode === "igniting") {
		if (this.check_transit_zone() != TRANSIT_READY) {
			this.setTimer(20);
			return f.dot;
		} else {
			this.mode = "call";
			this.setTimer(this.callTime * this.engine_coeff);
			yield* this.enterTransit();
			return f.dot;
		}
	}
	this.mode = "idle";
	this.timer = 0;
	this.destination = null;
	return f.dot;
}, true);

// shuttle.dm:641
rt.def("/obj/docking_port/mobile/proc/check_effects", function* check_effects(f: Frame) {
	let tl: Value = null;
	if (!rt.len(f, this.ripples)) {
		if (this.mode == "call" || this.mode == "recall") {
			if ((tl = this.timeLeft(1)) <= SHUTTLE_RIPPLE_TIME) {
				yield* this.create_ripples(this.destination, tl);
			}
		}
	}
	let S0: Value = this.get_docked();
	if (!(this.areaInstance.parallax_movedir && rt.istype(S0, T("/obj/docking_port/stationary/transit")) && this.timeLeft(1) <= PARALLAX_LOOP_TIME)) return f.dot;
	yield* this.parallax_slowdown();
	return f.dot;
}, true);

// shuttle.dm:652
rt.def("/obj/docking_port/mobile/proc/parallax_slowdown", function* parallax_slowdown(f: Frame) {
	let thing: Value = null, _T: Value = null, thing2: Value = null, AM: Value = null;
	this.areaInstance.parallax_movedir = 0;
	if (this.assigned_transit && this.assigned_transit.assigned_area) {
		this.assigned_transit.assigned_area.parallax_movedir = 0;
	}
	let L0: Value = this.return_ordered_turfs(this.x, this.y, this.z, this.dir, this.areaInstance);
	for (thing of each(L0)) {
		_T = thing;
		thing2 = null;
		for (thing2 of each(_T)) {
			if (rt.length((AM = thing2).client_mobs_in_contents)) {
				yield* AM.update_parallax_contents();
			}
		}
	}
	return f.dot;
}, true);

// shuttle.dm:665
rt.def("/obj/docking_port/mobile/proc/check_transit_zone", function check_transit_zone(f: Frame) {
	if (this.assigned_transit) {
		return TRANSIT_READY;
	} else {
		GLOB.SSshuttle.request_transit_dock(this);
	}
	return f.dot;
});

// shuttle.dm:670
rt.def("/obj/docking_port/mobile/proc/setTimer", function setTimer(f: Frame, wait: Value) {
	this.timer = rt.worldTime(f) + wait;
	this.last_timer_length = wait;
	return f.dot;
});

// shuttle.dm:674
rt.def("/obj/docking_port/mobile/proc/modTimer", function modTimer(f: Frame, multiple: Value) {
	let time_remaining: Value = null;
	if ((time_remaining = this.timer - rt.worldTime(f)) < 0 || !this.last_timer_length) {
		return f.dot;
	}
	time_remaining *= multiple;
	this.last_timer_length *= multiple;
	this.setTimer(time_remaining);
	return f.dot;
});

// shuttle.dm:682
rt.def("/obj/docking_port/mobile/proc/invertTimer", function invertTimer(f: Frame) {
	let time_remaining: Value = null, time_passed: Value = null;
	if (!this.last_timer_length) {
		return f.dot;
	}
	if (!((time_remaining = this.timer - rt.worldTime(f)) > 0)) return f.dot;
	this.setTimer((time_passed = this.last_timer_length - time_remaining));
	return f.dot;
});

// shuttle.dm:691
rt.def("/obj/docking_port/mobile/proc/timeLeft", function timeLeft(f: Frame, divisor: Value) {
	let ds_remaining: Value = null;
	if (divisor <= 0) {
		divisor = 10;
	}
	if (!this.timer) {
		ds_remaining = this.callTime * this.engine_coeff;
	} else {
		ds_remaining = max(0, this.timer - rt.worldTime(f));
	}
	f.dot = round(ds_remaining / divisor, 1);
	return f.dot;
});

// shuttle.dm:704
rt.def("/obj/docking_port/mobile/proc/getModeStr", function getModeStr(f: Frame) {
	if (this.mode === "igniting") {
		return "IGN";
	} else if (this.mode === "recall") {
		return "RCL";
	} else if (this.mode === "call") {
		return "ETA";
	} else if (this.mode === "docked") {
		return "ETD";
	} else if (this.mode === "escape") {
		return "ESC";
	} else if (this.mode === "stranded") {
		return "ERR";
	}
	return "";
});

// shuttle.dm:721
rt.def("/obj/docking_port/mobile/proc/getTimerStr", function getTimerStr(f: Frame) {
	let timeleft: Value = null;
	if (this.mode == "stranded") {
		return "--:--";
	}
	if ((timeleft = this.timeLeft()) > 0) {
		return `${add_zero(num2text(timeleft / 60 % 60), 2)}:${add_zero(num2text(timeleft % 60), 2)}`;
	}
	return "00:00";
});

// shuttle.dm:732
rt.def("/obj/docking_port/mobile/proc/getStatusText", function getStatusText(f: Frame) {
	let dockedAt: Value = null, dst: Value = null;
	f.dot = (dockedAt = this.get_docked()) && dockedAt.name ? dockedAt.name : "unknown";
	if (!rt.istype(dockedAt, T("/obj/docking_port/stationary/transit"))) return f.dot;
	if (this.mode == "recall") {
		dst = this.previous;
	} else {
		dst = this.destination;
	}
	f.dot += ` towards ${dst ? dst.name : "unknown location"} (${this.timeLeft(600)} minutes)`;
	return f.dot;
});

// shuttle.dm:745
rt.def("/obj/docking_port/mobile/proc/getControlConsole", function getControlConsole(f: Frame) {
	let S: Value = null;
	for (S of each(this.areaInstance, T("/obj/machinery/computer/shuttle"))) {
		if (S.shuttleId == this.id) {
			return S;
		}
	}
	return null;
});

// shuttle.dm:752
rt.def("/obj/docking_port/mobile/proc/hyperspace_sound", function hyperspace_sound(f: Frame, phase: Value, areas: Value) {
	let s: Value = null, A: Value = null, E: Value = null;
	let $e: any;
	if (phase === HYPERSPACE_WARMUP) {
		s = rt.rsc("sound/effects/hyperspace_begin.ogg");
	} else if (phase === HYPERSPACE_LAUNCH) {
		s = rt.rsc("sound/effects/hyperspace_progress.ogg");
	} else if (phase === HYPERSPACE_END) {
		s = rt.rsc("sound/effects/hyperspace_end.ogg");
	} else {
		CRASH(`Invalid hyperspace sound phase: ${phase}`);
	}
	for (A of each(areas)) {
		E = null;
		for (E of each(A, T("/obj/machinery/door"))) {
			playsound(E, s, 100, 0, max(this.width, this.height) - rt.world().view);
		}
	}
	return f.dot;
});

// shuttle.dm:766
rt.def("/obj/docking_port/mobile/proc/is_in_shuttle_bounds", function is_in_shuttle_bounds(f: Frame, A: Value) {
	let _T: Value = null;
	if ((_T = rt.getStep(f, A, 0)).z != this.z) {
		return 0;
	}
	let bounds: Value = this.return_coords();
	let T0: Value = rt.locate(rt.index(bounds, 1), rt.index(bounds, 2), this.z);
	let T1: Value = rt.locate(rt.index(bounds, 3), rt.index(bounds, 4), this.z);
	if (rt.isIn(f, _T, block(T0, T1))) {
		return 1;
	}
	return 0;
});

// shuttle.dm:779
rt.def("/obj/docking_port/mobile/proc/alter_engines", function alter_engines(f: Frame, mod: Value) {
	let delta_coeff: Value = null;
	if (mod == 0) {
		return f.dot;
	}
	let old_coeff: Value = this.engine_coeff;
	this.engine_coeff = this.get_engine_coeff(this.current_engines, mod);
	this.current_engines = max(0, this.current_engines + mod);
	if (!this.in_flight()) return f.dot;
	this.modTimer((delta_coeff = this.engine_coeff / old_coeff));
	return f.dot;
});

// shuttle.dm:790
rt.def("/obj/docking_port/mobile/proc/count_engines", function count_engines(f: Frame) {
	let E: Value = null;
	f.dot = 0;
	for (E of each(this.areaInstance.contents, T("/obj/structure/shuttle/engine"))) {
		if (!(!E || E.gc_destroyed)) {
			f.dot += E.engine_power;
		}
	}
	return f.dot;
});

// shuttle.dm:798
rt.def("/obj/docking_port/mobile/proc/get_engine_coeff", function get_engine_coeff(f: Frame, current: Value, engine_mod: Value) {
	let new_value: Value = null, delta: Value = null, change_per_engine: Value = null;
	if ((new_value = max(0, current + engine_mod)) == this.initial_engines) {
		return 1;
	}
	if (new_value > this.initial_engines) {
		delta = new_value - this.initial_engines;
		change_per_engine = 0.1;
		if (this.initial_engines > 0) {
			change_per_engine = 0.5 / this.initial_engines;
		}
		return max(0.5, min(1 - delta * change_per_engine, ENGINE_COEFF_MAX));
	}
	if (!(new_value < this.initial_engines)) return f.dot;
	delta = this.initial_engines - new_value;
	change_per_engine = 1;
	if (this.initial_engines > 0) {
		change_per_engine = 1 / this.initial_engines;
	}
	return max(ENGINE_COEFF_MIN, min(1 + delta * change_per_engine, ENGINE_COEFF_MAX));
});

// shuttle.dm:816
rt.def("/obj/docking_port/mobile/proc/in_flight", function in_flight(f: Frame) {
	if (this.mode === "call" || this.mode === "recall") {
		return 1;
	} else if (this.mode === "idle" || this.mode === "igniting") {
		return 0;
	} else {
		return 0;
	}
});

// shuttle.dm:825
rt.def("/obj/docking_port/mobile/emergency/proc/in_flight", function in_flight(f: Frame) {
	if (this.mode === "escape") {
		return 1;
	} else if (this.mode === "stranded" || this.mode === "endgame: game over") {
		return 0;
	} else {
		return parent_proc();
	}
});

// shuttle.dm:836
rt.def("/obj/docking_port/mobile/proc/on_emergency_launch", function* on_emergency_launch(f: Frame) {
	if (this.launch_status != UNLAUNCHED) return f.dot;
	this.launch_status = ENDGAME_LAUNCHED;
	yield* this.enterTransit();
	return f.dot;
}, true);

// shuttle.dm:846
rt.def("/obj/docking_port/mobile/proc/on_emergency_dock", function on_emergency_dock(f: Frame) {
	if (this.launch_status != ENDGAME_LAUNCHED) return f.dot;
	this.launch_status = ENDGAME_TRANSIT;
	return f.dot;
});

// shuttle.dm:850
rt.def("/obj/docking_port/mobile/pod/proc/on_emergency_dock", function* on_emergency_dock(f: Frame) {
	if (this.launch_status != ENDGAME_LAUNCHED) return f.dot;
	yield* this.dock(GLOB.SSshuttle.getDock(`${this.id}_away`));
	this.launch_status = "endgame: game over";
	return f.dot;
}, true);
