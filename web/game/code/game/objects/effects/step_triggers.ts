// From code/game/objects/effects/step_triggers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11894, "/obj/effect/step_trigger", "/obj/effect", {
	affect_ghosts: 0,
	stopper: 1,
	mobs_only: 0,
	anchored: 1,
	invisibility: 101,
});

// /obj/effect/step_trigger/proc/Crossed  (code/game/objects/effects/step_triggers.dm:14)  may sleep
rt.def("/obj/effect/step_trigger/proc/Crossed", function* Crossed(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[0]))) {
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)) && !truthy(rt.sv(f, "affect_ghosts")))) {
		return live(f.dot);
	}
	if ((!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])]))) && truthy(rt.sv(f, "mobs_only")))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "Trigger", live(f.args[0]));
	return f.dot;
}, true, { args: ["H"] });

rt.type(11895, "/obj/effect/step_trigger/message", "/obj/effect/step_trigger", {
	message: null,
	once: 1,
	mobs_only: 1,
});

// /obj/effect/step_trigger/message/proc/Trigger  (code/game/objects/effects/step_triggers.dm:31)  may sleep
rt.def("/obj/effect/step_trigger/message/proc/Trigger", function* Trigger(f: Frame, M: Value) {
	f.vars = () => [M];
	if (!truthy(rt.fv(f, "client", live(M)))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='info'>＀</span>", [rt.sv(f, "message")])]);
	if (!truthy(rt.sv(f, "once"))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
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

// /obj/effect/step_trigger/thrower/proc/<init>  (code/game/objects/effects/step_triggers.dm:45)
rt.def("/obj/effect/step_trigger/thrower/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "affecting", rt.list());
	return f.dot;
});

// /obj/effect/step_trigger/thrower/proc/Trigger  (code/game/objects/effects/step_triggers.dm:48)  may sleep
rt.def("/obj/effect/step_trigger/thrower/proc/Trigger", function* Trigger(f: Frame, A: Value) {
	let AM: Value = null, curtiles: Value = null, stopthrow: Value = null, _T: Value = null, M: Value = null, predir: Value = null;
	let $e: any;
	f.vars = () => [A, AM, curtiles, stopthrow, _T, M, predir, $e];
	if ((!truthy(live(A)) || !truthy((rt.istype(live(A), T("/atom/movable")) ? 1 : 0)))) {
		return live(f.dot);
	}
	AM = live(A);
	curtiles = 0;
	stopthrow = 0;
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [2, live(f.src)])), T("/obj/effect/step_trigger/thrower"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy((rt.isIn(f, live(AM), rt.fv(f, "affecting", live(_T))) ? 1 : 0))) {
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) {
		M = live(AM);
		if (truthy(rt.sv(f, "immobilize"))) {
			rt.setFv(f, "canmove", live(M), 0);
		}
	}
	yield* g.callName(f, rt.sv(f, "affecting"), "Add", [live(AM)]);
	while (truthy(live(AM)) && !truthy(live(stopthrow))) {
		if (truthy(rt.sv(f, "tiles"))) {
			if (rt.ge(live(curtiles), rt.sv(f, "tiles"))) {
				break;
			}
		}
		if (!isEqual(rt.fv(f, "z", live(AM)), rt.fv(f, "z", live(f.src)))) {
			break;
		}
		curtiles = rt.inc(live(curtiles), 1);
		yield* g.call(f, P("/proc/sleep"), null, [rt.sv(f, "speed")]);
		if (!truthy(rt.sv(f, "nostop"))) {
			_T = null;
			rt.forList(f, 0, rt.getStep(f, live(AM), rt.sv(f, "direction")), T("/obj/effect/step_trigger"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T = $e;
				if ((truthy(rt.fv(f, "stopper", live(_T))) && !isEqual(live(_T), live(f.src)))) {
					stopthrow = 1;
				}
			}
			rt.endFor(f, 0);
		} else {
			_T = null;
			rt.forList(f, 0, rt.getStep(f, live(AM), rt.sv(f, "direction")), T("/obj/effect/step_trigger/teleporter"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T = $e;
				if (truthy(rt.fv(f, "stopper", live(_T)))) {
					stopthrow = 1;
				}
			}
			rt.endFor(f, 0);
		}
		if (truthy(live(AM))) {
			predir = rt.fv(f, "dir", live(AM));
			yield* g.call(f, P("/proc/step"), null, [live(AM), rt.sv(f, "direction")]);
			if (!truthy(rt.sv(f, "facedir"))) {
				yield* g.callName(f, live(AM), "setDir", [live(predir)]);
			}
		}
	}
	yield* g.callName(f, rt.sv(f, "affecting"), "Remove", [live(AM)]);
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) return f.dot;
	M = live(AM);
	if (!truthy(rt.sv(f, "immobilize"))) return f.dot;
	rt.setFv(f, "canmove", live(M), 1);
	return f.dot;
}, true);

rt.type(11898, "/obj/effect/step_trigger/teleporter", "/obj/effect/step_trigger", {
	teleport_x: 0,
	teleport_y: 0,
	teleport_z: 0,
});

// /obj/effect/step_trigger/teleporter/proc/Trigger  (code/game/objects/effects/step_triggers.dm:111)
rt.def("/obj/effect/step_trigger/teleporter/proc/Trigger", function Trigger(f: Frame, A: Value) {
	if (!((truthy(rt.sv(f, "teleport_x")) && truthy(rt.sv(f, "teleport_y"))) && truthy(rt.sv(f, "teleport_z")))) return f.dot;
	rt.setFv(f, "x", live(A), rt.sv(f, "teleport_x"));
	rt.setFv(f, "y", live(A), rt.sv(f, "teleport_y"));
	rt.setFv(f, "z", live(A), rt.sv(f, "teleport_z"));
	return f.dot;
});

rt.type(11899, "/obj/effect/step_trigger/teleporter/random", "/obj/effect/step_trigger/teleporter", {
	teleport_x_offset: 0,
	teleport_y_offset: 0,
	teleport_z_offset: 0,
});

// /obj/effect/step_trigger/teleporter/random/proc/Trigger  (code/game/objects/effects/step_triggers.dm:125)
rt.def("/obj/effect/step_trigger/teleporter/random/proc/Trigger", function Trigger(f: Frame, A: Value) {
	if (!((truthy(rt.sv(f, "teleport_x")) && truthy(rt.sv(f, "teleport_y"))) && truthy(rt.sv(f, "teleport_z")))) return f.dot;
	if (!((truthy(rt.sv(f, "teleport_x_offset")) && truthy(rt.sv(f, "teleport_y_offset"))) && truthy(rt.sv(f, "teleport_z_offset")))) return f.dot;
	rt.setFv(f, "x", live(A), rt.call(f, P("/proc/rand"), null, [rt.sv(f, "teleport_x"), rt.sv(f, "teleport_x_offset")]));
	rt.setFv(f, "y", live(A), rt.call(f, P("/proc/rand"), null, [rt.sv(f, "teleport_y"), rt.sv(f, "teleport_y_offset")]));
	rt.setFv(f, "z", live(A), rt.call(f, P("/proc/rand"), null, [rt.sv(f, "teleport_z"), rt.sv(f, "teleport_z_offset")]));
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

// /obj/effect/step_trigger/teleport_fancy/proc/Trigger  (code/game/objects/effects/step_triggers.dm:144)  may sleep
rt.def("/obj/effect/step_trigger/teleport_fancy/proc/Trigger", function* Trigger(f: Frame, M: Value) {
	let dest: Value = null, s: Value = null;
	f.vars = () => [M, dest, s];
	dest = rt.locate(rt.sv(f, "locationx"), rt.sv(f, "locationy"), rt.sv(f, "z"));
	yield* g.callName(f, live(M), "Move", [live(dest)]);
	if (truthy(rt.sv(f, "entersparks"))) {
		yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [4, 1, live(f.src)]);
		yield* g.callName(f, live(s), "start", []);
	}
	if (truthy(rt.sv(f, "exitsparks"))) {
		yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [4, 1, live(dest)]);
		yield* g.callName(f, live(s), "start", []);
	}
	if (truthy(rt.sv(f, "entersmoke"))) {
		yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/smoke_spread"), []))), "set_up", [4, 1, live(f.src), 0]);
		yield* g.callName(f, live(s), "start", []);
	}
	if (truthy(rt.sv(f, "exitsmoke"))) {
		yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/smoke_spread"), []))), "set_up", [4, 1, live(dest), 0]);
		yield* g.callName(f, live(s), "start", []);
	}
	rt.incSrcVar(f, "uses", -1, true);
	if (!isEqual(rt.sv(f, "uses"), 0)) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
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

// /obj/effect/step_trigger/sound_effect/proc/Trigger  (code/game/objects/effects/step_triggers.dm:181)  may sleep
rt.def("/obj/effect/step_trigger/sound_effect/proc/Trigger", function* Trigger(f: Frame, A: Value) {
	let _T: Value = null, B: Value = null;
	f.vars = () => [A, _T, B];
	if (!truthy((_T = rt.getStep(f, live(A), 0)))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "triggerer_only")) && truthy((yield* g.call(f, P("/proc/ismob"), null, [live(A)]))))) {
		yield* g.callName(f, (B = live(A)), "playsound_local", [live(_T), rt.sv(f, "sound"), rt.sv(f, "volume"), rt.sv(f, "freq_vary")]);
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.sv(f, "sound"), rt.sv(f, "volume"), rt.sv(f, "freq_vary"), rt.sv(f, "extra_range")]);
	}
	if (!truthy(rt.sv(f, "happens_once"))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
