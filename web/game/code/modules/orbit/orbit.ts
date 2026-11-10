// Based on /tg/station's code/modules/orbit/orbit.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4175, "/datum/orbit", "/datum", {
	orbiter: null,
	orbiting: null,
	lock: 1,
	lastloc: null,
	lastprocess: null,
});

// orbit.dm:9
rt.def("/datum/orbit/proc/New", function* New(f: Frame, _orbiter: Value, _orbiting: Value, _lock: Value) {
	this.orbiter = _orbiter;
	this.orbiting = _orbiting;
	GLOB.SSorbit.processing += this;
	if (!this.orbiting.orbiters) {
		this.orbiting.orbiters = list();
	}
	this.orbiting.orbiters += this;
	if (this.orbiter.orbiting) {
		yield* this.orbiter.stop_orbit();
	}
	this.orbiter.orbiting = this;
	yield* this.Check();
	this.lock = _lock;
	return f.dot;
}, true);

// orbit.dm:26
rt.def("/datum/orbit/proc/Destroy", function* Destroy(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	GLOB.SSorbit.processing -= this;
	if (this.orbiter) {
		this.orbiter.orbiting = null;
		this.orbiter = null;
	}
	if (this.orbiting) {
		if (this.orbiting.orbiters) {
			this.orbiting.orbiters -= this;
			if (!rt.len(f, this.orbiting.orbiters)) {
				this.orbiting.orbiters = null;
			}
		}
		this.orbiting = null;
	}
	return (yield* parent_proc());
}, true, { args: ["force"] });

// orbit.dm:39
rt.def("/datum/orbit/proc/Check", function* Check(f: Frame, targetloc: Value) {
	if (!this.orbiter) {
		yield* qdel(this);
		return f.dot;
	}
	if (!this.orbiting) {
		yield* this.orbiter.stop_orbit();
		return f.dot;
	}
	if (!this.orbiter.orbiting) {
		this.orbiter.orbiting = this;
		yield* this.orbiter.stop_orbit();
	}
	this.lastprocess = rt.worldTime(f);
	if (!targetloc) {
		targetloc = rt.getStep(f, this.orbiting, 0);
	}
	if (!targetloc || !this.lock && this.orbiter.loc != this.lastloc && this.orbiter.loc != targetloc) {
		yield* this.orbiter.stop_orbit();
		return f.dot;
	}
	this.orbiter.loc = targetloc;
	yield* this.orbiter.update_parallax_contents();
	this.lastloc = this.orbiter.loc;
	return f.dot;
}, true);

// orbit.dm:71
rt.def("/atom/movable/proc/orbit", function* orbit(f: Frame, A: Value, radius: Value, clockwise: Value, rotation_speed: Value, rotation_segments: Value, pre_rotation: Value, lockinorbit: Value) {
	let M: Value = null, pre_rot: Value = null, shift: Value = null;
	radius ??= 10;
	clockwise ??= 0;
	rotation_speed ??= 20;
	rotation_segments ??= 36;
	pre_rotation ??= 1;
	lockinorbit ??= 0;
	if (!rt.istype(A, T("/atom"))) {
		return f.dot;
	}
	yield* new_(T("/datum/orbit"), this, A, lockinorbit);
	if (!this.orbiting) {
		return f.dot;
	}
	let initial_transform: Value = matrix(this.transform);
	if (pre_rotation) {
		M = matrix(this.transform);
		pre_rot = 90;
		if (!clockwise || rt.istype(this, T("/mob/dead/observer"))) { // tg_js: ghosts keep tg's -90 lean while orbiting clockwise
			pre_rot = -90;
		}
		M.Turn(pre_rot);
		this.transform = M;
	}
	(shift = matrix(this.transform)).Translate(0, radius);
	this.transform = shift;
	this.SpinAnimation(rotation_speed, -1, clockwise, rotation_segments);
	this.transform = initial_transform;
	return f.dot;
}, true, { argTypes: [{ path: "/atom" }, {  }, {  }, {  }, {  }, {  }, {  }] });

// orbit.dm:98
rt.def("/atom/movable/proc/stop_orbit", function* stop_orbit(f: Frame) {
	this.SpinAnimation(0, 0);
	yield* qdel(this.orbiting);
	return f.dot;
}, true);

// orbit.dm:102
rt.def("/atom/proc/Destroy", function* Destroy(f: Frame) {
	let thing: Value = null, O: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!this.orbiters) return f.dot;
	for (thing of each(this.orbiters)) {
		if ((O = thing).orbiter) {
			yield* O.orbiter.stop_orbit();
		}
	}
	return f.dot;
}, true, { args: ["force"] });

// orbit.dm:110
rt.def("/atom/movable/proc/Destroy", function* Destroy(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!this.orbiting) return f.dot;
	yield* this.stop_orbit();
	return f.dot;
}, true, { args: ["force"] });
