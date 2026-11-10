// Based on /tg/station's code/game/objects/effects/proximity.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1506, "/datum/proximity_monitor", "/datum", {
	host: null,
	last_host_loc: null,
	checkers: null,
	current_range: null,
	ignore_if_not_on_turf: null,
});

// proximity.dm:9
rt.def("/datum/proximity_monitor/proc/New", function* New(f: Frame, _host: Value, range: Value, _ignore_if_not_on_turf: Value) {
	_ignore_if_not_on_turf ??= 1;
	this.host = _host;
	this.last_host_loc = _host.loc;
	this.ignore_if_not_on_turf = _ignore_if_not_on_turf;
	this.checkers = list();
	yield* this.SetRange(range);
	return f.dot;
}, true);

// proximity.dm:18
rt.def("/datum/proximity_monitor/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null;
	this.host = null;
	this.last_host_loc = null;
	if (this.checkers) {
		for (I of each(this.checkers)) {
			yield* qdel(I);
		}
		this.checkers.Cut();
	}
	return (yield* parent_proc());
}, true);

// proximity.dm:22
rt.def("/datum/proximity_monitor/proc/HandleMove", function* HandleMove(f: Frame) {
	let curr_range: Value = null;
	let _host: Value = this.host;
	let new_host_loc: Value = _host.loc;
	if (this.last_host_loc == new_host_loc) return f.dot;
	this.last_host_loc = new_host_loc;
	yield* this.SetRange((curr_range = this.current_range), 1);
	if (!curr_range) return f.dot;
	yield* _host.HasProximity(this.host);
	return f.dot;
}, true);

// proximity.dm:33
rt.def("/datum/proximity_monitor/proc/SetRange", function* SetRange(f: Frame, range: Value, force_rebuild: Value) {
	let loc_to_use: Value = null, pc: Value = null, I: Value = null, I_7: Value = null, pc_8: Value = null;
	let $e: any;
	force_rebuild ??= 0;
	if (!force_rebuild && range == this.current_range) {
		return 0;
	}
	f.dot = 1;
	this.current_range = range;
	let checkers_local: Value = this.checkers;
	let old_checkers_len: Value = rt.len(f, checkers_local);
	let _host: Value = this.host;
	if (!isturf((loc_to_use = this.ignore_if_not_on_turf ? _host.loc : rt.getStep(f, _host, 0)))) {
		if (range) {
			if (old_checkers_len) {
				pc = rt.index(checkers_local, old_checkers_len);
				--checkers_local.len;
				if (checkers_local) {
					for (I of each(checkers_local)) {
						yield* qdel(I);
					}
					checkers_local.Cut();
				}
			} else {
				pc = (yield* new_(T("/obj/effect/abstract/proximity_checker"), loc_to_use, this));
			}
			checkers_local += pc;
		}
		return f.dot;
	}
	let turfs: Value = block(rt.locate(max(loc_to_use.x - range, 1), max(loc_to_use.y - range, 1), loc_to_use.z), rt.locate(min(loc_to_use.x + range, rt.world().maxx), min(loc_to_use.y + range, rt.world().maxy), loc_to_use.z));
	let turfs_len: Value = rt.len(f, turfs);
	let old_checkers_used: Value = min(turfs_len, old_checkers_len);
	rt.forRange(f, 0, 1, old_checkers_len, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I_7 = $e;
		if (I_7 <= old_checkers_used) {
			(pc_8 = rt.index(checkers_local, I_7)).loc = rt.index(turfs, I_7);
		} else {
			yield* qdel(rt.index(checkers_local, I_7));
		}
	}
	rt.endFor(f, 0);
	if (old_checkers_len < turfs_len) {
		I_7 = null;
		rt.forRange(f, 0, old_checkers_used + 1, turfs_len, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			I_7 = $e;
			checkers_local += (yield* new_(T("/obj/effect/abstract/proximity_checker"), rt.index(turfs, I_7), this));
		}
		rt.endFor(f, 0);
	} else {
		checkers_local.Cut(old_checkers_used + 1, old_checkers_len);
	}
	return f.dot;
}, true);

rt.type(11804, "/obj/effect/abstract/proximity_checker", "/obj/effect/abstract", {
	monitor: null,
	anchored: 1,
	invisibility: 101,
});

// proximity.dm:83
rt.def("/obj/effect/abstract/proximity_checker/proc/Initialize", function Initialize(f: Frame, mapload: Value, _monitor: Value) {
	f.dot = parent_proc();
	if (_monitor) {
		this.monitor = _monitor;
	} else {
		stack_trace("proximity_checker created without host");
		return INITIALIZE_HINT_QDEL;
	}
	return f.dot;
}, false);

// proximity.dm:92
rt.def("/obj/effect/abstract/proximity_checker/proc/Destroy", function* Destroy(f: Frame) {
	this.monitor = null;
	return (yield* parent_proc());
}, true);

// proximity.dm:96
rt.def("/obj/effect/abstract/proximity_checker/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	yield* this.monitor.host.HasProximity(AM);
	return f.dot;
}, true, { waitfor: false });
