// From code/game/area/areas.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalteleportlocs  (code/game/area/areas.dm:68)
rt.def("/datum/controller/global_vars/proc/InitGlobalteleportlocs", function InitGlobalteleportlocs(f: Frame) {
	rt.setGl("teleportlocs", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "teleportlocs", add);
	return f.dot;
});

// /proc/process_teleport_locs  (code/game/area/areas.dm:71)  may sleep
rt.def("/proc/process_teleport_locs", function* process_teleport_locs(f: Frame) {
	let V: Value = null, AR: Value = null, picked: Value = null;
	let $e: any;
	f.vars = () => [V, AR, picked, $e];
	V = null;
	rt.forList(f, 0, rt.gl("sortedAreas"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if ((truthy((rt.istype((AR = live(V)), T("/area/shuttle")) ? 1 : 0)) || truthy(rt.fv(f, "noteleport", live(AR))))) {
			continue;
		}
		if (truthy(rt.index(rt.gl("teleportlocs"), rt.fv(f, "name", live(AR))))) {
			continue;
		}
		if ((truthy((picked = (yield* g.call(f, P("/proc/safepick"), null, [(yield* g.call(f, P("/proc/get_area_turfs"), null, [rt.fv(f, "type", live(AR))]))])))) && isEqual(rt.fv(f, "z", live(picked)), 2))) {
			rt.setAt(rt.gl("teleportlocs"), rt.fv(f, "name", live(AR)), live(AR));
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sortTim"), null, [rt.gl("teleportlocs"), P("/proc/cmp_text_dsc")]);
	return f.dot;
}, true);

// /proc/area_contents  (code/game/area/areas.dm:92)
rt.def("/proc/area_contents", function area_contents(f: Frame, A: Value) {
	let contents: Value = null, LSA: Value = null;
	let $e: any;
	f.vars = () => [contents, LSA, $e];
	if (!truthy((rt.istype(live(A), T("/area")) ? 1 : 0))) {
		return null;
	}
	contents = rt.list();
	LSA = null;
	rt.forList(f, 0, rt.fv(f, "related", live(A)), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		LSA = $e;
		contents = rt.modify(live(contents), rt.fv(f, "contents", live(LSA)), add);
	}
	rt.endFor(f, 0);
	return live(contents);
});

// /area/proc/Initialize  (code/game/area/areas.dm:102)  may sleep
rt.def("/area/proc/Initialize", function* Initialize(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.setSv(f, "icon_state", "");
	rt.setSv(f, "layer", 10);
	rt.setSv(f, "uid", rt.incGl("global_uid", 1, false));
	rt.setSv(f, "related", rt.list(live(f.src)));
	rt.setSv(f, "map_name", rt.sv(f, "name"));
	if (truthy(rt.sv(f, "requires_power"))) {
		rt.setSv(f, "luminosity", 0);
	} else {
		rt.setSv(f, "power_light", 1);
		rt.setSv(f, "power_equip", 1);
		rt.setSv(f, "power_environ", 1);
		if (isEqual(rt.sv(f, "dynamic_lighting"), 2)) {
			rt.setSv(f, "dynamic_lighting", 1);
			rt.setSv(f, "luminosity", 0);
		} else {
			if (!isEqual(rt.sv(f, "dynamic_lighting"), 3)) {
				rt.setSv(f, "dynamic_lighting", 0);
			}
		}
	}
	if (isEqual(rt.sv(f, "dynamic_lighting"), 3)) {
		if (truthy(rt.fv(f, "starlight", rt.gl("config")))) {
			$0 = 1;
		} else {
			$0 = 0;
		}
		rt.setSv(f, "dynamic_lighting", $0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "power_change");
	rt.setSv(f, "blend_mode", 4);
	if (truthy(rt.fv(f, "dynamic_lighting", live(f.src)))) return f.dot;
	yield* g.srcCall(f, "add_overlay", T("/obj/effect/fullbright"));
	return f.dot;
}, true);

// /area/proc/Destroy  (code/game/area/areas.dm:133)  may sleep
rt.def("/area/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /area/proc/poweralert  (code/game/area/areas.dm:137)
rt.def("/area/proc/poweralert", function poweralert(f: Frame, state: Value, source: Value) {
	let cameras: Value = null, C: Value = null, aiPlayer: Value = null, a: Value = null, D: Value = null, p: Value = null;
	let $e: any;
	f.vars = () => [cameras, C, aiPlayer, a, D, p, $e];
	if (isEqual(live(state), rt.sv(f, "poweralm"))) return f.dot;
	rt.setSv(f, "poweralm", live(state));
	if (!truthy((rt.istype(live(source), T("/obj")) ? 1 : 0))) return f.dot;
	cameras = rt.list();
	C = null;
	rt.forList(f, 0, live(f.src), T("/obj/machinery/camera"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		cameras = rt.modify(live(cameras), live(C), add);
	}
	rt.endFor(f, 0);
	aiPlayer = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/silicon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		aiPlayer = $e;
		if (isEqual(live(state), 1)) {
			rt.callName(f, live(aiPlayer), "cancelAlarm", ["Power", live(f.src), live(source)]);
		} else {
			rt.callName(f, live(aiPlayer), "triggerAlarm", ["Power", live(f.src), live(cameras), live(source)]);
		}
	}
	rt.endFor(f, 0);
	a = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/station_alert"));
	while (($e = rt.next(f, 0)) !== undefined) {
		a = $e;
		if (isEqual(live(state), 1)) {
			rt.callName(f, live(a), "cancelAlarm", ["Power", live(f.src), live(source)]);
		} else {
			rt.callName(f, live(a), "triggerAlarm", ["Power", live(f.src), live(cameras), live(source)]);
		}
	}
	rt.endFor(f, 0);
	D = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/simple_animal/drone"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (isEqual(live(state), 1)) {
			rt.callName(f, live(D), "cancelAlarm", ["Power", live(f.src), live(source)]);
		} else {
			rt.callName(f, live(D), "triggerAlarm", ["Power", live(f.src), live(cameras), live(source)]);
		}
	}
	rt.endFor(f, 0);
	p = null;
	rt.forList(f, 0, rt.gl("alarmdisplay"), T("/datum/computer_file/program/alarm_monitor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		p = $e;
		if (isEqual(live(state), 1)) {
			rt.callName(f, live(p), "cancelAlarm", ["Power", live(f.src), live(source)]);
		} else {
			rt.callName(f, live(p), "triggerAlarm", ["Power", live(f.src), live(cameras), live(source)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /area/proc/atmosalert  (code/game/area/areas.dm:167)
rt.def("/area/proc/atmosalert", function atmosalert(f: Frame, danger_level: Value, source: Value) {
	let cameras: Value = null, RA: Value = null, C: Value = null, aiPlayer: Value = null, a: Value = null, D: Value = null, p: Value = null, aiPlayer_0: Value = null, a_0: Value = null, D_0: Value = null, p_0: Value = null;
	let $e: any;
	f.vars = () => [cameras, RA, C, aiPlayer, a, D, p, aiPlayer_0, a_0, D_0, p_0, $e];
	if (!isEqual(live(danger_level), rt.sv(f, "atmosalm"))) {
		if (isEqual(live(danger_level), 2)) {
			cameras = rt.list();
			RA = null;
			rt.forList(f, 0, rt.sv(f, "related"), T("/area"));
			while (($e = rt.next(f, 0)) !== undefined) {
				RA = $e;
				C = null;
				rt.forList(f, 1, live(RA), T("/obj/machinery/camera"));
				while (($e = rt.next(f, 1)) !== undefined) {
					C = $e;
					cameras = rt.modify(live(cameras), live(C), add);
				}
				rt.endFor(f, 1);
			}
			rt.endFor(f, 0);
			aiPlayer = null;
			rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/silicon"));
			while (($e = rt.next(f, 0)) !== undefined) {
				aiPlayer = $e;
				rt.callName(f, live(aiPlayer), "triggerAlarm", ["Atmosphere", live(f.src), live(cameras), live(source)]);
			}
			rt.endFor(f, 0);
			a = null;
			rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/station_alert"));
			while (($e = rt.next(f, 0)) !== undefined) {
				a = $e;
				rt.callName(f, live(a), "triggerAlarm", ["Atmosphere", live(f.src), live(cameras), live(source)]);
			}
			rt.endFor(f, 0);
			D = null;
			rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/simple_animal/drone"));
			while (($e = rt.next(f, 0)) !== undefined) {
				D = $e;
				rt.callName(f, live(D), "triggerAlarm", ["Atmosphere", live(f.src), live(cameras), live(source)]);
			}
			rt.endFor(f, 0);
			p = null;
			rt.forList(f, 0, rt.gl("alarmdisplay"), T("/datum/computer_file/program/alarm_monitor"));
			while (($e = rt.next(f, 0)) !== undefined) {
				p = $e;
				rt.callName(f, live(p), "triggerAlarm", ["Atmosphere", live(f.src), live(cameras), live(source)]);
			}
			rt.endFor(f, 0);
		} else {
			if (isEqual(rt.fv(f, "atmosalm", live(f.src)), 2)) {
				aiPlayer_0 = null;
				rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/silicon"));
				while (($e = rt.next(f, 0)) !== undefined) {
					aiPlayer_0 = $e;
					rt.callName(f, live(aiPlayer_0), "cancelAlarm", ["Atmosphere", live(f.src), live(source)]);
				}
				rt.endFor(f, 0);
				a_0 = null;
				rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/station_alert"));
				while (($e = rt.next(f, 0)) !== undefined) {
					a_0 = $e;
					rt.callName(f, live(a_0), "cancelAlarm", ["Atmosphere", live(f.src), live(source)]);
				}
				rt.endFor(f, 0);
				D_0 = null;
				rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/simple_animal/drone"));
				while (($e = rt.next(f, 0)) !== undefined) {
					D_0 = $e;
					rt.callName(f, live(D_0), "cancelAlarm", ["Atmosphere", live(f.src), live(source)]);
				}
				rt.endFor(f, 0);
				p_0 = null;
				rt.forList(f, 0, rt.gl("alarmdisplay"), T("/datum/computer_file/program/alarm_monitor"));
				while (($e = rt.next(f, 0)) !== undefined) {
					p_0 = $e;
					rt.callName(f, live(p_0), "cancelAlarm", ["Atmosphere", live(f.src), live(source)]);
				}
				rt.endFor(f, 0);
			}
		}
		rt.setFv(f, "atmosalm", live(f.src), live(danger_level));
		return 1;
	}
	return 0;
});

// /area/proc/ModifyFiredoors  (code/game/area/areas.dm:200)
rt.def("/area/proc/ModifyFiredoors", function ModifyFiredoors(f: Frame, opening: Value) {
	let FD: Value = null, D: Value = null, cont: Value = null, I: Value = null, A: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [FD, D, cont, I, A, $0, $1, $e];
	if (!truthy(rt.sv(f, "firedoors"))) return f.dot;
	rt.setSv(f, "firedoors_last_closed_on", rt.worldTime(f));
	FD = null;
	rt.forList(f, 0, rt.sv(f, "firedoors"));
	while (($e = rt.next(f, 0)) !== undefined) {
		FD = $e;
		D = live(FD);
		if ((truthy((cont = (!truthy(rt.fv(f, "welded", live(D))) ? 1 : 0))) && truthy(live(opening)))) {
			I = null;
			rt.forList(f, 1, rt.fv(f, "affecting_areas", live(D)));
			while (($e = rt.next(f, 1)) !== undefined) {
				I = $e;
				if (truthy(rt.gv(f, "fire", (A = live(I))))) {
					cont = 0;
					break;
				}
			}
			rt.endFor(f, 1);
		}
		if ((truthy(live(cont)) && truthy(rt.callName(f, live(D), "is_operational", [])))) {
			if (truthy(rt.fv(f, "operating", live(D)))) {
				$0 = live(D);
				if (truthy(live(opening))) {
					$1 = 1;
				} else {
					$1 = 2;
				}
				rt.setFv(f, "nextstate", $0, $1);
			} else {
				if (!truthy(rt.bitXor(rt.fv(f, "density", live(D)), live(opening)))) {
					$0 = live(D);
					if (truthy(live(opening))) {
						$1 = P("/obj/machinery/door/firedoor/proc/open");
					} else {
						$1 = P("/obj/machinery/door/firedoor/proc/close");
					}
					rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [$0, $1]);
				}
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /area/proc/firealert  (code/game/area/areas.dm:216)
rt.def("/area/proc/firealert", function firealert(f: Frame, source: Value) {
	let cameras: Value = null, RA: Value = null, F: Value = null, C: Value = null, a: Value = null, aiPlayer: Value = null, D: Value = null, p: Value = null;
	let $e: any;
	f.vars = () => [cameras, RA, F, C, a, aiPlayer, D, p, $e];
	if (isEqual(rt.sv(f, "always_unpowered"), 1)) {
		return live(f.dot);
	}
	cameras = rt.list();
	RA = null;
	rt.forList(f, 0, rt.sv(f, "related"), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		RA = $e;
		if (!truthy(rt.fv(f, "fire", live(RA)))) {
			rt.callName(f, live(RA), "set_fire_alarm_effect", []);
			rt.callName(f, live(RA), "ModifyFiredoors", [0]);
			F = null;
			rt.forList(f, 1, live(RA), T("/obj/machinery/firealarm"));
			while (($e = rt.next(f, 1)) !== undefined) {
				F = $e;
				rt.callName(f, live(F), "update_icon", []);
			}
			rt.endFor(f, 1);
		}
		C = null;
		rt.forList(f, 1, live(RA), T("/obj/machinery/camera"));
		while (($e = rt.next(f, 1)) !== undefined) {
			C = $e;
			cameras = rt.modify(live(cameras), live(C), add);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	a = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/station_alert"));
	while (($e = rt.next(f, 0)) !== undefined) {
		a = $e;
		rt.callName(f, live(a), "triggerAlarm", ["Fire", live(f.src), live(cameras), live(source)]);
	}
	rt.endFor(f, 0);
	aiPlayer = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/silicon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		aiPlayer = $e;
		rt.callName(f, live(aiPlayer), "triggerAlarm", ["Fire", live(f.src), live(cameras), live(source)]);
	}
	rt.endFor(f, 0);
	D = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/simple_animal/drone"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		rt.callName(f, live(D), "triggerAlarm", ["Fire", live(f.src), live(cameras), live(source)]);
	}
	rt.endFor(f, 0);
	p = null;
	rt.forList(f, 0, rt.gl("alarmdisplay"), T("/datum/computer_file/program/alarm_monitor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		p = $e;
		rt.callName(f, live(p), "triggerAlarm", ["Fire", live(f.src), live(cameras), live(source)]);
	}
	rt.endFor(f, 0);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
});

// /area/proc/firereset  (code/game/area/areas.dm:242)
rt.def("/area/proc/firereset", function firereset(f: Frame, source: Value) {
	let RA: Value = null, F: Value = null, aiPlayer: Value = null, a: Value = null, D: Value = null, p: Value = null;
	let $e: any;
	f.vars = () => [RA, F, aiPlayer, a, D, p, $e];
	RA = null;
	rt.forList(f, 0, rt.sv(f, "related"), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		RA = $e;
		if (truthy(rt.fv(f, "fire", live(RA)))) {
			rt.setFv(f, "fire", live(RA), 0);
			rt.setFv(f, "mouse_opacity", live(RA), 0);
			rt.callName(f, live(RA), "updateicon", []);
			rt.callName(f, live(RA), "ModifyFiredoors", [1]);
			F = null;
			rt.forList(f, 1, live(RA), T("/obj/machinery/firealarm"));
			while (($e = rt.next(f, 1)) !== undefined) {
				F = $e;
				rt.callName(f, live(F), "update_icon", []);
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	aiPlayer = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/silicon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		aiPlayer = $e;
		rt.callName(f, live(aiPlayer), "cancelAlarm", ["Fire", live(f.src), live(source)]);
	}
	rt.endFor(f, 0);
	a = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/station_alert"));
	while (($e = rt.next(f, 0)) !== undefined) {
		a = $e;
		rt.callName(f, live(a), "cancelAlarm", ["Fire", live(f.src), live(source)]);
	}
	rt.endFor(f, 0);
	D = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/simple_animal/drone"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		rt.callName(f, live(D), "cancelAlarm", ["Fire", live(f.src), live(source)]);
	}
	rt.endFor(f, 0);
	p = null;
	rt.forList(f, 0, rt.gl("alarmdisplay"), T("/datum/computer_file/program/alarm_monitor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		p = $e;
		rt.callName(f, live(p), "cancelAlarm", ["Fire", live(f.src), live(source)]);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return f.dot;
});

// /area/proc/process  (code/game/area/areas.dm:263)
rt.def("/area/proc/process", function process(f: Frame) {
	let RA: Value = null;
	let $e: any;
	f.vars = () => [RA, $e];
	if (!rt.lt(add(rt.sv(f, "firedoors_last_closed_on"), 100), rt.worldTime(f))) return f.dot;
	RA = null;
	rt.forList(f, 0, rt.sv(f, "related"), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		RA = $e;
		rt.callName(f, live(RA), "ModifyFiredoors", [0]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { waitfor: false });

// /area/proc/close_and_lock_door  (code/game/area/areas.dm:269)  may sleep
rt.def("/area/proc/close_and_lock_door", function* close_and_lock_door(f: Frame, DOOR: Value) {
	f.vars = () => [DOOR];
	yield* g.callName(f, live(DOOR), "close", []);
	if (!truthy(rt.fv(f, "density", live(DOOR)))) return f.dot;
	yield* g.callName(f, live(DOOR), "lock", []);
	return f.dot;
}, true, { waitfor: false });

// /area/proc/burglaralert  (code/game/area/areas.dm:274)  may sleep
rt.def("/area/proc/burglaralert", function* burglaralert(f: Frame, trigger: Value) {
	let cameras: Value = null, RA: Value = null, DOOR: Value = null, C: Value = null, SILICON: Value = null;
	let $e: any;
	f.vars = () => [trigger, cameras, RA, DOOR, C, SILICON, $e];
	if (isEqual(rt.sv(f, "always_unpowered"), 1)) {
		return live(f.dot);
	}
	cameras = rt.list();
	RA = null;
	rt.forList(f, 0, rt.sv(f, "related"), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		RA = $e;
		yield* g.callName(f, live(RA), "set_fire_alarm_effect", []);
		DOOR = null;
		rt.forList(f, 1, live(RA), T("/obj/machinery/door"));
		while (($e = rt.next(f, 1)) !== undefined) {
			DOOR = $e;
			yield* g.srcCall(f, "close_and_lock_door", live(DOOR));
		}
		rt.endFor(f, 1);
		C = null;
		rt.forList(f, 1, live(RA), T("/obj/machinery/camera"));
		while (($e = rt.next(f, 1)) !== undefined) {
			C = $e;
			cameras = rt.modify(live(cameras), live(C), add);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	SILICON = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/silicon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SILICON = $e;
		if (truthy((yield* g.callName(f, live(SILICON), "triggerAlarm", ["Burglar", live(f.src), live(cameras), live(trigger)])))) {
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(SILICON), P("/mob/living/silicon/proc/cancelAlarm"), "Burglar", live(f.src), live(trigger)])), 600]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /area/proc/set_fire_alarm_effect  (code/game/area/areas.dm:295)
rt.def("/area/proc/set_fire_alarm_effect", function set_fire_alarm_effect(f: Frame) {
	rt.setSv(f, "fire", 1);
	rt.callSrc(f, "updateicon", []);
	rt.setSv(f, "mouse_opacity", 0);
	return f.dot;
});

// /area/proc/readyalert  (code/game/area/areas.dm:299)
rt.def("/area/proc/readyalert", function readyalert(f: Frame) {
	if (isEqual(rt.sv(f, "name"), "Space")) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "eject"))) return f.dot;
	rt.setSv(f, "eject", 1);
	rt.callSrc(f, "updateicon", []);
	return f.dot;
});

// /area/proc/readyreset  (code/game/area/areas.dm:308)
rt.def("/area/proc/readyreset", function readyreset(f: Frame) {
	if (!truthy(rt.sv(f, "eject"))) return f.dot;
	rt.setSv(f, "eject", 0);
	rt.callSrc(f, "updateicon", []);
	return f.dot;
});

// /area/proc/partyalert  (code/game/area/areas.dm:311)
rt.def("/area/proc/partyalert", function partyalert(f: Frame) {
	if (isEqual(rt.fv(f, "name", live(f.src)), "Space")) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "party", live(f.src)))) return f.dot;
	rt.setFv(f, "party", live(f.src), 1);
	rt.callName(f, live(f.src), "updateicon", []);
	rt.setFv(f, "mouse_opacity", live(f.src), 0);
	return f.dot;
});

// /area/proc/partyreset  (code/game/area/areas.dm:319)
rt.def("/area/proc/partyreset", function partyreset(f: Frame) {
	let D: Value = null;
	let $e: any;
	f.vars = () => [D, $e];
	if (!truthy(rt.fv(f, "party", live(f.src)))) return f.dot;
	rt.setFv(f, "party", live(f.src), 0);
	rt.setFv(f, "mouse_opacity", live(f.src), 0);
	rt.callName(f, live(f.src), "updateicon", []);
	D = null;
	rt.forList(f, 0, live(f.src), T("/obj/machinery/door/firedoor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (!truthy(rt.fv(f, "welded", live(D)))) {
			if (truthy(rt.fv(f, "operating", live(D)))) {
				rt.setFv(f, "nextstate", live(D), 1);
			} else {
				if (truthy(rt.fv(f, "density", live(D)))) {
					rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(D), P("/obj/machinery/door/firedoor/proc/open")]);
				}
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /area/proc/updateicon  (code/game/area/areas.dm:331)
rt.def("/area/proc/updateicon", function updateicon(f: Frame) {
	if ((((truthy(rt.sv(f, "fire")) || truthy(rt.sv(f, "eject"))) || truthy(rt.sv(f, "party"))) && (!truthy(rt.sv(f, "requires_power")) || truthy(rt.sv(f, "power_environ"))))) {
		if (((truthy(rt.sv(f, "fire")) && !truthy(rt.sv(f, "eject"))) && !truthy(rt.sv(f, "party")))) {
			rt.setSv(f, "icon_state", "blue");
		} else {
			if (((!truthy(rt.sv(f, "fire")) && truthy(rt.sv(f, "eject"))) && !truthy(rt.sv(f, "party")))) {
				rt.setSv(f, "icon_state", "red");
			} else {
				if (((truthy(rt.sv(f, "party")) && !truthy(rt.sv(f, "fire"))) && !truthy(rt.sv(f, "eject")))) {
					rt.setSv(f, "icon_state", "party");
				} else {
					rt.setSv(f, "icon_state", "blue-red");
				}
			}
		}
	} else {
		rt.setSv(f, "icon_state", null);
	}
	return f.dot;
});

rt.type(13103, "/area/space", "/area", {
	requires_power: 1,
	always_unpowered: 1,
	power_light: 0,
	power_equip: 0,
	power_environ: 0,
	valid_territory: 0,
	outdoors: 1,
	ambientsounds: null,
	blob_allowed: 0,
	icon_state: "space",
	dynamic_lighting: 0,
});

// /area/space/proc/updateicon  (code/game/area/areas.dm:344)
rt.def("/area/space/proc/updateicon", function updateicon(f: Frame) {
	rt.setSv(f, "icon_state", null);
	return f.dot;
});

// /area/proc/powered  (code/game/area/areas.dm:354)
rt.def("/area/proc/powered", function powered(f: Frame, chan: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.sv(f, "requires_power"))) {
		return 1;
	}
	if (truthy(rt.sv(f, "always_unpowered"))) {
		return 0;
	}
	$0 = live(chan);
	if ($0 === 1) {
		return rt.sv(f, "power_equip");
	} else if ($0 === 2) {
		return rt.sv(f, "power_light");
	} else if ($0 === 3) {
		return rt.sv(f, "power_environ");
	}
	return 0;
});

// /area/proc/power_change  (code/game/area/areas.dm:374)  may sleep
rt.def("/area/proc/power_change", function* power_change(f: Frame) {
	let RA: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [RA, M, $e];
	RA = null;
	rt.forList(f, 0, rt.sv(f, "related"), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		RA = $e;
		M = null;
		rt.forList(f, 1, live(RA), T("/obj/machinery"));
		while (($e = rt.next(f, 1)) !== undefined) {
			M = $e;
			yield* g.callName(f, live(M), "power_change", []);
		}
		rt.endFor(f, 1);
		yield* g.callName(f, live(RA), "updateicon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /area/proc/usage  (code/game/area/areas.dm:381)
rt.def("/area/proc/usage", function usage(f: Frame, chan: Value) {
	let used: Value = null;
	let $0: any;
	f.vars = () => [used, $0];
	used = 0;
	$0 = live(chan);
	if ($0 === 2) {
		used = rt.modify(live(used), rt.sv(f, "used_light"), add);
	} else if ($0 === 1) {
		used = rt.modify(live(used), rt.sv(f, "used_equip"), add);
	} else if ($0 === 3) {
		used = rt.modify(live(used), rt.sv(f, "used_environ"), add);
	} else if ($0 === 4) {
		used = rt.modify(live(used), add(add(rt.sv(f, "used_light"), rt.sv(f, "used_equip")), rt.sv(f, "used_environ")), add);
	} else if ($0 === 5) {
		used = rt.modify(live(used), rt.sv(f, "static_equip"), add);
	} else if ($0 === 6) {
		used = rt.modify(live(used), rt.sv(f, "static_light"), add);
	} else if ($0 === 7) {
		used = rt.modify(live(used), rt.sv(f, "static_environ"), add);
	}
	return live(used);
});

// /area/proc/addStaticPower  (code/game/area/areas.dm:399)
rt.def("/area/proc/addStaticPower", function addStaticPower(f: Frame, value: Value, powerchannel: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(powerchannel);
	if ($0 === 5) {
		rt.modSrcVar(f, "static_equip", live(value), add);
	} else if ($0 === 6) {
		rt.modSrcVar(f, "static_light", live(value), add);
	} else if ($0 === 7) {
		rt.modSrcVar(f, "static_environ", live(value), add);
	}
	return f.dot;
});

// /area/proc/use_power  (code/game/area/areas.dm:414)
rt.def("/area/proc/use_power", function use_power(f: Frame, amount: Value, chan: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(chan);
	if ($0 === 1) {
		rt.modSrcVar(f, "used_equip", live(amount), add);
	} else if ($0 === 2) {
		rt.modSrcVar(f, "used_light", live(amount), add);
	} else if ($0 === 3) {
		rt.modSrcVar(f, "used_environ", live(amount), add);
	}
	return f.dot;
});

// /area/proc/Entered  (code/game/area/areas.dm:425)  may sleep
rt.def("/area/proc/Entered", function* Entered(f: Frame, A: Value) {
	let L: Value = null, sound: Value = null;
	f.vars = () => [A, L, sound];
	if (!truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy(rt.gv(f, "ckey", (L = live(A))))) {
		return live(f.dot);
	}
	if (((truthy(rt.fv(f, "client", live(L))) && !truthy(rt.gv(f, "ambience_playing", rt.fv(f, "client", live(L))))) && truthy(rt.bitAnd(rt.gv(f, "toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(L)))), 256)))) {
		rt.setFv(f, "ambience_playing", rt.fv(f, "client", live(L)), 1);
		rt.op(f, "Output", [], [live(L), (yield* g.call(f, P("/proc/sound"), null, [null, rt.rsc("sound/ambience/shipambience.ogg"), "repeat", 1, "wait", 0, "volume", 35, "channel", 2], rt.Args.Named))], false);
	}
	if (!(truthy(rt.fv(f, "client", live(L))) && truthy(rt.bitAnd(rt.gv(f, "toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(L)))), 4)))) {
		return live(f.dot);
	}
	if (!truthy(rt.op(f, "Prob", [], [35]))) return f.dot;
	sound = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "ambientsounds")]);
	if (truthy(rt.gv(f, "played", rt.fv(f, "client", live(L))))) return f.dot;
	rt.op(f, "Output", [], [live(L), (yield* g.call(f, P("/proc/sound"), null, [null, live(sound), "repeat", 0, "wait", 0, "volume", 25, "channel", 1], rt.Args.Named))], false);
	rt.setFv(f, "played", rt.fv(f, "client", live(L)), 1);
	yield* g.call(f, P("/proc/sleep"), null, [600]);
	if (!(truthy(live(L)) && truthy(rt.fv(f, "client", live(L))))) return f.dot;
	rt.setFv(f, "played", rt.fv(f, "client", live(L)), 0);
	return f.dot;
}, true, { waitfor: false });

// /atom/proc/has_gravity  (code/game/area/areas.dm:451)
rt.def("/atom/proc/has_gravity", function has_gravity(f: Frame, _T: Value) {
	let A: Value = null;
	f.vars = () => [_T, A];
	if ((!truthy(live(_T)) || !truthy(rt.call(f, P("/proc/isturf"), null, [live(_T)])))) {
		_T = rt.getStep(f, live(f.src), 0);
	}
	A = rt.call(f, P("/proc/get_area"), null, [live(_T)]);
	if (truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0))) {
		return 0;
	} else {
		if ((truthy(live(A)) && truthy(rt.fv(f, "has_gravity", live(A))))) {
			return 1;
		} else {
			if (((truthy(live(_T)) && truthy(rt.index(rt.gl("gravity_generators"), fmt("＀", [rt.fv(f, "z", live(_T))])))) && truthy(rt.length(rt.index(rt.gl("gravity_generators"), fmt("＀", [rt.fv(f, "z", live(_T))])))))) {
				return 1;
			}
		}
	}
	return 0;
});

// /area/proc/setup  (code/game/area/areas.dm:465)  may sleep
rt.def("/area/proc/setup", function* setup(f: Frame, a_name: Value) {
	f.vars = () => [a_name];
	rt.setSv(f, "name", live(a_name));
	rt.setSv(f, "power_equip", 0);
	rt.setSv(f, "power_light", 0);
	rt.setSv(f, "power_environ", 0);
	rt.setSv(f, "always_unpowered", 0);
	rt.setSv(f, "valid_territory", 0);
	rt.setSv(f, "blob_allowed", 0);
	yield* g.srcCall(f, "addSorted");
	return f.dot;
}, true);
