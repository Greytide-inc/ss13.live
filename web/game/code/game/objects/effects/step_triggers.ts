// Based on /tg/station's code/game/objects/effects/step_triggers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11894, "/obj/effect/step_trigger", "/obj/effect", {
	affect_ghosts: 0,
	stopper: 1,
	mobs_only: 0,
	anchored: 1,
	invisibility: 101,
});

// step_triggers.dm:14
rt.def("/obj/effect/step_trigger/proc/Crossed", function* Crossed(f: Frame, H: Value) {
	yield* parent_proc();
	if (!H) {
		return f.dot;
	}
	if (rt.istype(H, T("/mob/dead/observer")) && !this.affect_ghosts) {
		return f.dot;
	}
	if (!ismob(H) && this.mobs_only) {
		return f.dot;
	}
	yield* this.Trigger(H);
	return f.dot;
}, true);

rt.type(11895, "/obj/effect/step_trigger/message", "/obj/effect/step_trigger", {
	message: null,
	once: 1,
	mobs_only: 1,
});

// step_triggers.dm:31
rt.def("/obj/effect/step_trigger/message/proc/Trigger", function* Trigger(f: Frame, M: Value) {
	if (!M.client) return f.dot;
	to_chat(M, `<span class='info'>${rt.sv(f, "message")}</span>`);
	if (!this.once) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11896, "/obj/effect/step_trigger/thrower", "/obj/effect/step_trigger", {
	direction: 2,
	tiles: 3,
	immobilize: 1,
	speed: 1,
	facedir: 0,
	nostop: 0,
	affecting: null,
});

// step_triggers.dm:45
rt.def("/obj/effect/step_trigger/thrower/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.affecting = list();
	return f.dot;
});

// step_triggers.dm:48
rt.def("/obj/effect/step_trigger/thrower/proc/Trigger", function* Trigger(f: Frame, A: Value) {
	let _T: Value = null, M: Value = null, predir: Value = null;
	if (!A || !rt.istype(A, T("/atom/movable"))) {
		return f.dot;
	}
	let AM: Value = A;
	let curtiles: Value = 0;
	let stopthrow: Value = 0;
	for (_T of each(orange(2, this), T("/obj/effect/step_trigger/thrower"))) {
		if (rt.isIn(f, AM, _T.affecting)) {
			return f.dot;
		}
	}
	if (ismob(AM)) {
		M = AM;
		if (this.immobilize) {
			M.canmove = 0;
		}
	}
	this.affecting.Add(AM);
	while (AM && !stopthrow) {
		if (this.tiles) {
			if (curtiles >= this.tiles) {
				break;
			}
		}
		if (AM.z != this.z) {
			break;
		}
		curtiles++;
		yield* sleep(this.speed);
		if (!this.nostop) {
			_T = null;
			for (_T of each(rt.getStep(f, AM, this.direction), T("/obj/effect/step_trigger"))) {
				if (_T.stopper && _T != this) {
					stopthrow = 1;
				}
			}
		} else {
			_T = null;
			for (_T of each(rt.getStep(f, AM, this.direction), T("/obj/effect/step_trigger/teleporter"))) {
				if (_T.stopper) {
					stopthrow = 1;
				}
			}
		}
		if (AM) {
			predir = AM.dir;
			yield* step(AM, this.direction);
			if (!this.facedir) {
				yield* AM.setDir(predir);
			}
		}
	}
	yield* this.affecting.Remove(AM);
	if (!ismob(AM)) return f.dot;
	M = AM;
	if (!this.immobilize) return f.dot;
	M.canmove = 1;
	return f.dot;
}, true);

rt.type(11898, "/obj/effect/step_trigger/teleporter", "/obj/effect/step_trigger", {
	teleport_x: 0,
	teleport_y: 0,
	teleport_z: 0,
});

// step_triggers.dm:111
rt.def("/obj/effect/step_trigger/teleporter/proc/Trigger", function Trigger(f: Frame, A: Value) {
	if (!(this.teleport_x && this.teleport_y && this.teleport_z)) return f.dot;
	A.x = this.teleport_x;
	A.y = this.teleport_y;
	A.z = this.teleport_z;
	return f.dot;
});

rt.type(11899, "/obj/effect/step_trigger/teleporter/random", "/obj/effect/step_trigger/teleporter", {
	teleport_x_offset: 0,
	teleport_y_offset: 0,
	teleport_z_offset: 0,
});

// step_triggers.dm:125
rt.def("/obj/effect/step_trigger/teleporter/random/proc/Trigger", function Trigger(f: Frame, A: Value) {
	if (!(this.teleport_x && this.teleport_y && this.teleport_z)) return f.dot;
	if (!(this.teleport_x_offset && this.teleport_y_offset && this.teleport_z_offset)) return f.dot;
	A.x = rand(this.teleport_x, this.teleport_x_offset);
	A.y = rand(this.teleport_y, this.teleport_y_offset);
	A.z = rand(this.teleport_z, this.teleport_z_offset);
	return f.dot;
});

rt.type(11900, "/obj/effect/step_trigger/teleport_fancy", "/obj/effect/step_trigger", {
	locationx: null,
	locationy: null,
	uses: 1,
	entersparks: 0,
	exitsparks: 0,
	entersmoke: 0,
	exitsmoke: 0,
});

// step_triggers.dm:144
rt.def("/obj/effect/step_trigger/teleport_fancy/proc/Trigger", function* Trigger(f: Frame, M: Value) {
	let s: Value = null;
	let dest: Value = rt.locate(this.locationx, this.locationy, this.z);
	yield* M.Move(dest);
	if (this.entersparks) {
		yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(4, 1, this);
		yield* s.start();
	}
	if (this.exitsparks) {
		yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(4, 1, dest);
		yield* s.start();
	}
	if (this.entersmoke) {
		yield* (s = (yield* new_(T("/datum/effect_system/smoke_spread")))).set_up(4, 1, this, 0);
		yield* s.start();
	}
	if (this.exitsmoke) {
		yield* (s = (yield* new_(T("/datum/effect_system/smoke_spread")))).set_up(4, 1, dest, 0);
		yield* s.start();
	}
	this.uses--;
	if (this.uses != 0) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11901, "/obj/effect/step_trigger/sound_effect", "/obj/effect/step_trigger", {
	sound: null,
	volume: 100,
	freq_vary: 1,
	extra_range: 0,
	happens_once: 0,
	triggerer_only: 0,
});

// step_triggers.dm:181
rt.def("/obj/effect/step_trigger/sound_effect/proc/Trigger", function* Trigger(f: Frame, A: Value) {
	let _T: Value = null, B: Value = null;
	if (!(_T = rt.getStep(f, A, 0))) {
		return f.dot;
	}
	if (this.triggerer_only && ismob(A)) {
		(B = A).playsound_local(_T, this.sound, this.volume, this.freq_vary);
	} else {
		playsound(_T, this.sound, this.volume, this.freq_vary, this.extra_range);
	}
	if (!this.happens_once) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);
