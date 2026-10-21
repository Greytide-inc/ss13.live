// From code/modules/mob/living/silicon/ai/life.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/ai/proc/Life  (code/modules/mob/living/silicon/ai/life.dm:7)  may sleep
rt.def("/mob/living/silicon/ai/proc/Life", function* Life(f: Frame) {
	let home: Value = null;
	f.vars = () => [home];
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	} else {
		yield* g.srcCall(f, "update_gravity", (yield* g.srcCall(f, "mob_has_gravity")));
		yield* g.srcCall(f, "handle_status_effects");
		if ((truthy(rt.sv(f, "malfhack")) && truthy(rt.fv(f, "aidisabled", rt.sv(f, "malfhack"))))) {
			yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "malfhacking")]);
			yield* g.srcCall(f, "malfhacked", rt.sv(f, "malfhack"));
		}
		if (((!truthy(rt.sv(f, "eyeobj")) || (!truthy(rt.sv(f, "eyeobj")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "eyeobj"))))) || !truthy(rt.fv(f, "loc", rt.sv(f, "eyeobj"))))) {
			yield* g.srcCall(f, "view_core");
		}
		if (truthy(rt.sv(f, "machine"))) {
			yield* g.callName(f, rt.sv(f, "machine"), "check_eye", [live(f.src)]);
		}
		if (truthy(rt.sv(f, "aiRestorePowerRoutine"))) {
			yield* g.srcCall(f, "adjustOxyLoss", 1);
		} else {
			if (truthy((yield* g.srcCall(f, "getOxyLoss")))) {
				yield* g.srcCall(f, "adjustOxyLoss", -1);
			}
		}
		if (!truthy((yield* g.srcCall(f, "lacks_power")))) {
			if (truthy((yield* g.callName(f, (home = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))), "powered", [1])))) {
				yield* g.callName(f, live(home), "use_power", [1000, 1]);
			}
			if (rt.ge(rt.sv(f, "aiRestorePowerRoutine"), 2)) {
				yield* g.srcCall(f, "ai_restore_power");
				return live(f.dot);
			}
		} else {
			if (truthy(rt.sv(f, "aiRestorePowerRoutine"))) return f.dot;
			yield* g.srcCall(f, "ai_lose_power");
		}
	}
	return f.dot;
}, true, { waitfor: false });

// /mob/living/silicon/ai/proc/lacks_power  (code/modules/mob/living/silicon/ai/life.dm:50)
rt.def("/mob/living/silicon/ai/proc/lacks_power", function lacks_power(f: Frame) {
	let _T: Value = null, A: Value = null, ST: Value = null;
	let $0: any, $e: any;
	f.vars = () => [_T, A, ST, $0, $e];
	_T = rt.getStep(f, live(f.src), 0);
	A = rt.call(f, P("/proc/get_area"), null, [live(f.src)]);
	$0 = rt.sv(f, "requires_power");
	if ($0 === 0) {
		return 0;
	} else if ($0 === 1) {
		return (((!truthy(live(_T)) ? 1 : 0) || (!truthy(live(A)) ? 1 : 0)) || (((!truthy(rt.fv(f, "power_equip", live(A))) ? 1 : 0) || (rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0)) && (!truthy(rt.call(f, P("/proc/is_type_in_list"), null, [rt.sv(f, "loc"), rt.list(T("/obj/item"), T("/obj/mecha"))])) ? 1 : 0)));
	} else if ($0 === 2) {
		ST = null;
		rt.forList(f, 0, rt.call(f, P("/proc/range"), null, [live(f.src), 2]), T("/obj/effect/clockwork/sigil/transmission"));
		while (($e = rt.next(f, 0)) !== undefined) {
			ST = $e;
			return 0;
		}
		rt.endFor(f, 0);
		return (((!truthy(live(_T)) ? 1 : 0) || (!truthy(live(A)) ? 1 : 0)) || (((!truthy((rt.istype(live(_T), T("/turf/open/floor/clockwork")) ? 1 : 0)) ? 1 : 0) && ((!truthy(rt.fv(f, "power_equip", live(A))) ? 1 : 0) || (rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0))) && (!truthy(rt.call(f, P("/proc/is_type_in_list"), null, [rt.sv(f, "loc"), rt.list(T("/obj/item"), T("/obj/mecha"))])) ? 1 : 0)));
	}
	return f.dot;
});

// /mob/living/silicon/ai/proc/updatehealth  (code/modules/mob/living/silicon/ai/life.dm:63)  may sleep
rt.def("/mob/living/silicon/ai/proc/updatehealth", function* updatehealth(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return live(f.dot);
	}
	rt.setSv(f, "health", subtract(subtract(subtract(subtract(rt.sv(f, "maxHealth"), (yield* g.srcCall(f, "getOxyLoss"))), (yield* g.srcCall(f, "getToxLoss"))), (yield* g.srcCall(f, "getBruteLoss"))), (yield* g.srcCall(f, "getFireLoss"))));
	yield* g.srcCall(f, "update_stat");
	yield* g.srcCall(f, "diag_hud_set_health");
	yield* g.srcCall(f, "disconnect_shell");
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/update_stat  (code/modules/mob/living/silicon/ai/life.dm:71)  may sleep
rt.def("/mob/living/silicon/ai/proc/update_stat", function* update_stat(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return live(f.dot);
	}
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		if (rt.le(rt.sv(f, "health"), -100)) {
			yield* g.srcCall(f, "death");
			return live(f.dot);
		} else {
			if (isEqual(rt.sv(f, "stat"), 1)) {
				rt.setSv(f, "stat", 0);
				yield* g.srcCall(f, "adjust_blindness", -1);
			}
		}
	}
	yield* g.srcCall(f, "diag_hud_set_status");
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/update_sight  (code/modules/mob/living/silicon/ai/life.dm:83)
rt.def("/mob/living/silicon/ai/proc/update_sight", function update_sight(f: Frame) {
	rt.setSv(f, "see_invisible", rt.initial(f, live(f.src), "see_invisible"));
	rt.setSv(f, "see_in_dark", rt.initial(f, live(f.src), "see_in_dark"));
	rt.setSv(f, "sight", rt.initial(f, live(f.src), "sight"));
	if (truthy(rt.sv(f, "aiRestorePowerRoutine"))) {
		rt.setSv(f, "sight", rt.bitAnd(rt.sv(f, "sight"), 16777199));
		rt.setSv(f, "sight", rt.bitAnd(rt.sv(f, "sight"), 16777211));
		rt.setSv(f, "sight", rt.bitAnd(rt.sv(f, "sight"), 16777207));
		rt.setSv(f, "see_in_dark", 0);
	}
	if (truthy(rt.sv(f, "see_override"))) {
		rt.setSv(f, "see_invisible", rt.sv(f, "see_override"));
	}
	rt.callSrc(f, "sync_lighting_plane_alpha", []);
	return f.dot;
});

// /mob/living/silicon/ai/proc/start_RestorePowerRoutine  (code/modules/mob/living/silicon/ai/life.dm:98)  may sleep
rt.def("/mob/living/silicon/ai/proc/start_RestorePowerRoutine", function* start_RestorePowerRoutine(f: Frame) {
	let _T: Value = null, AIarea: Value = null, theAPC: Value = null, PRP: Value = null, A: Value = null, APC: Value = null;
	let $0: any, $e: any;
	f.vars = () => [_T, AIarea, theAPC, PRP, A, APC, $0, $e];
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Backup battery online. Scanners, camera, and radio interface offline. Beginning fault-detection."]);
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	_T = rt.getStep(f, live(f.src), 0);
	if ((truthy((AIarea = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])))) && truthy(rt.fv(f, "power_equip", live(AIarea))))) {
		if (!truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0))) {
			yield* g.srcCall(f, "ai_restore_power");
			return live(f.dot);
		}
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Fault confirmed: missing external power. Shutting down main control system to save power."]);
	yield* g.call(f, P("/proc/sleep"), null, [20]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Emergency control system online. Verifying connection to power network."]);
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	if (truthy((rt.istype((_T = rt.getStep(f, live(f.src), 0)), T("/turf/open/space")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Unable to verify! No power connection detected!"]);
		rt.setSv(f, "aiRestorePowerRoutine", 2);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Connection verified. Searching for APC in power network."]);
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	theAPC = null;
	PRP = null;
	PRP = 1;
	while (rt.le(live(PRP), 4)) {
		_T = rt.getStep(f, live(f.src), 0);
		if (truthy((AIarea = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))))) {
			A = null;
			rt.forList(f, 0, rt.fv(f, "related", live(AIarea)), T("/area"));
			while (($e = rt.next(f, 0)) !== undefined) {
				A = $e;
				APC = null;
				rt.forList(f, 1, live(A), T("/obj/machinery/power/apc"));
				while (($e = rt.next(f, 1)) !== undefined) {
					APC = $e;
					if (!truthy(rt.bitAnd(rt.fv(f, "stat", live(APC)), 1))) {
						theAPC = live(APC);
						break;
					}
				}
				rt.endFor(f, 1);
			}
			rt.endFor(f, 0);
		}
		if (!truthy(live(theAPC))) {
			$0 = live(PRP);
			if ($0 === 1) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Unable to locate APC!"]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Lost connection with the APC!"]);
			}
			rt.setSv(f, "aiRestorePowerRoutine", 2);
			return live(f.dot);
		}
		if (truthy(rt.fv(f, "power_equip", live(AIarea)))) {
			if (!truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0))) {
				yield* g.srcCall(f, "ai_restore_power");
				return live(f.dot);
			}
		}
		$0 = live(PRP);
		if ($0 === 1) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "APC located. Optimizing route to APC to avoid needless power waste."]);
		} else if ($0 === 2) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Best route identified. Hacking offline APC power port."]);
		} else if ($0 === 3) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Power port upload access confirmed. Loading control program into APC power port software."]);
		} else if ($0 === 4) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Transfer complete. Forcing APC to execute program."]);
			yield* g.call(f, P("/proc/sleep"), null, [50]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Receiving control information from APC."]);
			yield* g.call(f, P("/proc/sleep"), null, [2]);
			rt.setSv(f, "apc_override", 1);
			yield* g.callName(f, live(theAPC), "ui_interact", [null, live(f.src), "state", rt.gl("conscious_state")], rt.Args.Named);
			rt.setSv(f, "apc_override", 0);
			rt.setSv(f, "aiRestorePowerRoutine", 3);
		}
		yield* g.call(f, P("/proc/sleep"), null, [50]);
		theAPC = null;
		PRP = rt.inc(live(PRP), 1);
	}
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/ai_restore_power  (code/modules/mob/living/silicon/ai/life.dm:159)  may sleep
rt.def("/mob/living/silicon/ai/proc/ai_restore_power", function* ai_restore_power(f: Frame) {
	if (!truthy(rt.sv(f, "aiRestorePowerRoutine"))) return f.dot;
	if (isEqual(rt.sv(f, "aiRestorePowerRoutine"), 3)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Alert cancelled. Power has been restored."]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Alert cancelled. Power has been restored without our assistance."]);
	}
	rt.setSv(f, "aiRestorePowerRoutine", 0);
	yield* g.srcCall(f, "set_blindness", 0);
	yield* g.srcCall(f, "update_sight");
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/ai_lose_power  (code/modules/mob/living/silicon/ai/life.dm:168)  may sleep
rt.def("/mob/living/silicon/ai/proc/ai_lose_power", function* ai_lose_power(f: Frame) {
	yield* g.srcCall(f, "disconnect_shell");
	rt.setSv(f, "aiRestorePowerRoutine", 1);
	yield* g.srcCall(f, "blind_eyes", 1);
	yield* g.srcCall(f, "update_sight");
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "You've lost power!"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/silicon/ai/proc/start_RestorePowerRoutine")])), 20]);
	return f.dot;
}, true);
