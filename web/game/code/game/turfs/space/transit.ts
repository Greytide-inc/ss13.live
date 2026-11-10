// Based on /tg/station's code/game/turfs/space/transit.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4500, "/turf/open/space/transit", "/turf/open/space", {
	icon_state: "black",
	dir: 2,
	baseturf: rt.typePath("/turf/open/space/transit"),
	flags: 1,
});

// transit.dm:8
rt.def("/turf/open/space/transit/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	f.dot = parent_proc();
	underlay_appearance.icon_state = `speedspace_ns_${get_transit_state(asking_turf)}`;
	underlay_appearance.transform = turn(matrix(), get_transit_angle(asking_turf));
	return f.dot;
}, false);

// transit.dm:28
rt.def("/turf/open/space/transit/proc/Entered", function* Entered(f: Frame, AM: Value, OldLoc: Value) {
	yield* this.throw_atom(AM);
	return f.dot;
}, true);

// transit.dm:31
rt.def("/turf/open/space/transit/proc/throw_atom", function* throw_atom(f: Frame, AM: Value) {
	let a: Value = null, _x: Value = null, _y: Value = null;
	let $e: any;
	if (!AM || rt.istype(AM, T("/obj/docking_port"))) {
		return f.dot;
	}
	let max: Value = rt.world().maxx - 7;
	let min: Value = 8;
	let possible_transtitons: Value = list();
	let k: Value = 1;
	let config_list: Value = GLOB.SSmapping.config.transition_config;
	for (a of each(config_list)) {
		if (rt.index(config_list, a) == 2) {
			possible_transtitons += k;
		}
		k++;
	}
	let _z: Value = pick(possible_transtitons);
	if (this.dir === 2) {
		_x = rand(min, max);
		_y = max;
	} else if (this.dir === 8) {
		_x = max;
		_y = rand(min, max);
	} else if (this.dir === 4) {
		_x = min;
		_y = rand(min, max);
	} else {
		_x = rand(min, max);
		_y = min;
	}
	let _T: Value = rt.locate(_x, _y, _z);
	AM.loc = _T;
	yield* AM.newtonian_move(this.dir);
	return f.dot;
}, true);

// transit.dm:67
rt.def("/turf/open/space/transit/proc/CanBuildHere", function CanBuildHere(f: Frame) {
	return GLOB.SSshuttle.is_in_shuttle_bounds(this);
});

// transit.dm:71
rt.def("/turf/open/space/transit/proc/Initialize", function* Initialize(f: Frame) {
	let AM: Value = null;
	yield* parent_proc();
	yield* this.update_icon();
	for (AM of each(this, T("/atom/movable"))) {
		yield* this.throw_atom(AM);
	}
	return f.dot;
}, true);

// transit.dm:77
rt.def("/turf/open/space/transit/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `speedspace_ns_${get_transit_state(this)}`;
	this.transform = turn(matrix(), get_transit_angle(this));
	return f.dot;
});

// transit.dm:83
rt.def("/proc/get_transit_state", function get_transit_state(f: Frame, _T: Value) {
	let p: Value = 9;
	f.dot = 1;
	if (_T.dir === 1) {
		f.dot = (-p * _T.x + _T.y) % 15 + 1;
		if (f.dot < 1) {
			f.dot += 15;
		}
	} else if (_T.dir === 4) {
		f.dot = (_T.x + p * _T.y) % 15 + 1;
	} else if (_T.dir === 8) {
		f.dot = (_T.x - p * _T.y) % 15 + 1;
		if (!(f.dot < 1)) return f.dot;
		f.dot += 15;
	} else {
		f.dot = (p * _T.x + _T.y) % 15 + 1;
	}
	return f.dot;
});

// transit.dm:99
rt.def("/proc/get_transit_angle", function get_transit_angle(f: Frame, _T: Value) {
	f.dot = 0;
	if (_T.dir === 1) {
		f.dot = 180;
	} else if (_T.dir === 4) {
		f.dot = 90;
	} else if (_T.dir === 8) {
		f.dot = -90;
	}
	return f.dot;
});
