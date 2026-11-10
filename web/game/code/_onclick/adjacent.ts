// Based on /tg/station's code/_onclick/adjacent.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// adjacent.dm:18
rt.def("/area/proc/Adjacent", function Adjacent(f: Frame, neighbor: Value) {
	CRASH("Call to /area/Adjacent(), unimplemented proc");
	return f.dot;
});

// adjacent.dm:29
rt.def("/turf/proc/Adjacent", function Adjacent(f: Frame, neighbor: Value, target: Value) {
	let T0: Value = null, d: Value = null, T1: Value = null;
	if ((T0 = rt.getStep(f, neighbor, 0)) == this) {
		return 1;
	}
	if (get_dist(this, T0) > 1) {
		return 0;
	}
	if (T0.x == this.x || T0.y == this.y) {
		return (T0.ClickCross(rt.getDir(f, T0, this), { border_only: 1, target_atom: target }) && this.ClickCross(rt.getDir(f, this, T0), { border_only: 1, target_atom: target }));
	}
	let in_dir: Value = rt.getDir(f, T0, this);
	let d1: Value = rt.bitAnd(in_dir, 3);
	let d2: Value = rt.bitAnd(in_dir, 12);
	for (d of each(list(d1, d2))) {
		if (!T0.ClickCross(d, { border_only: 1, target_atom: target })) {
			continue;
		}
		if (!(T1 = rt.getStep(f, T0, d)) || T1.density || !T1.ClickCross(rt.bitOr(rt.getDir(f, T1, T0), rt.getDir(f, T1, this)), { border_only: 0, target_atom: target })) {
			continue;
		}
		if (!this.ClickCross(rt.getDir(f, this, T1), { border_only: 1, target_atom: target })) {
			continue;
		}
		return 1;
	}
	return 0;
});

// adjacent.dm:67
rt.def("/atom/movable/proc/Adjacent", function Adjacent(f: Frame, neighbor: Value) {
	if (neighbor == this.loc) {
		return 1;
	}
	if (!isturf(this.loc)) {
		return 0;
	}
	if (this.loc.Adjacent(neighbor, { target: neighbor })) {
		return 1;
	}
	return 0;
});

// adjacent.dm:77
rt.def("/obj/item/proc/Adjacent", function Adjacent(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[0] == this.loc) {
		return 1;
	}
	if (rt.istype(this.loc, T("/obj/item"))) {
		if (f.args[1] > 0) {
			return this.loc.Adjacent(f.args[0], f.args[1] - 1);
		}
		return 0;
	}
	return parent_proc();
}, false, { args: ["neighbor", "recurse"] });

// adjacent.dm:90
rt.def("/turf/proc/ClickCross", function ClickCross(f: Frame, target_dir: Value, border_only: Value, target_atom: Value) {
	let O: Value = null;
	for (O of each(this, T("/obj"))) {
		if (!O.density || O == target_atom || rt.bitAnd(O.pass_flags, 32)) {
			continue;
		}
		if (rt.bitAnd(O.flags, ON_BORDER)) {
			if (rt.bitAnd(O.dir, target_dir) || rt.bitAnd(O.dir, O.dir - 1)) {
				return 0;
			}
		} else if (!border_only) {
			return 0;
		}
	}
	return 1;
});
