// From code/controllers/subsystem/npcpool.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(31, "/datum/controller/subsystem/npcpool", "/datum/controller/subsystem", {
	canBeUsed: null,
	needsDelegate: null,
	needsAssistant: null,
	processing: null,
	currentrun: null,
	stage: null,
	z_has_client: null,
	name: "NPC Pool",
	flags: 69,
	priority: 20,
	runlevels: 12,
});

// /datum/controller/subsystem/npcpool/proc/New  (code/controllers/subsystem/npcpool.dm:6)  may sleep
rt.def("/datum/controller/subsystem/npcpool/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSnpcpool"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSnpcpool"), T("/datum/controller/subsystem/npcpool")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSnpcpool")]);
		}
		rt.setGl("SSnpcpool", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/npcpool/proc/<init>  (code/controllers/subsystem/npcpool.dm:12)
rt.def("/datum/controller/subsystem/npcpool/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canBeUsed", rt.list());
	$0 = $0;
	rt.setSv(f, "needsDelegate", rt.list());
	$0 = $0;
	rt.setSv(f, "needsAssistant", rt.list());
	$0 = $0;
	rt.setSv(f, "processing", rt.list());
	$0 = $0;
	rt.setSv(f, "currentrun", rt.list());
	$0 = $0;
	rt.setSv(f, "z_has_client", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/npcpool/proc/stat_entry  (code/controllers/subsystem/npcpool.dm:22)  may sleep
rt.def("/datum/controller/subsystem/npcpool/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* g.callSuper(f, [fmt("NPCS:＀|D:＀|A:＀|U:＀", [rt.len(f, rt.sv(f, "processing")), rt.len(f, rt.sv(f, "needsDelegate")), rt.len(f, rt.sv(f, "needsAssistant")), rt.len(f, rt.sv(f, "canBeUsed"))])]);
	return f.dot;
}, true);

// /datum/controller/subsystem/npcpool/proc/stop_processing  (code/controllers/subsystem/npcpool.dm:25)
rt.def("/datum/controller/subsystem/npcpool/proc/stop_processing", function stop_processing(f: Frame, I: Value) {
	(rt.modSrcVar(f, "processing", live(I), subtract));
	(rt.modSrcVar(f, "currentrun", live(I), subtract));
	(rt.modSrcVar(f, "needsDelegate", live(I), subtract));
	(rt.modSrcVar(f, "canBeUsed", live(I), subtract));
	(rt.modSrcVar(f, "needsAssistant", live(I), subtract));
	return f.dot;
});

// /datum/controller/subsystem/npcpool/proc/npc_z_asleep  (code/controllers/subsystem/npcpool.dm:32)
rt.def("/datum/controller/subsystem/npcpool/proc/npc_z_asleep", function npc_z_asleep(f: Frame, H: Value) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (truthy(rt.fv(f, "target", live(H)))) {
		return 0;
	}
	if (!truthy((_T = rt.getStep(f, live(H), 0)))) {
		return 0;
	}
	return (!truthy(rt.index(rt.sv(f, "z_has_client"), fmt("＀", [rt.fv(f, "z", live(_T))]))) ? 1 : 0);
});

// /datum/controller/subsystem/npcpool/proc/fire  (code/controllers/subsystem/npcpool.dm:48)
rt.def("/datum/controller/subsystem/npcpool/proc/fire", function fire(f: Frame, resumed: Value) {
	let C: Value = null, _T: Value = null, currentrun: Value = null, SA: Value = null, canBeUsed: Value = null, thing: Value = null, checkInRange: Value = null, check: Value = null, candidate: Value = null, helpProb: Value = null, chfac: Value = null, canfac: Value = null, facCount: Value = null, C_8: Value = null;
	let $0: any, $e: any;
	f.vars = () => [resumed, C, _T, currentrun, SA, canBeUsed, thing, checkInRange, check, candidate, helpProb, chfac, canfac, facCount, C_8, $0, $e];
	if (live(resumed) === null) {
		resumed = 0;
	}
	if (!truthy(live(resumed))) {
		rt.setFv(f, "currentrun", live(f.src), rt.callName(f, rt.gl("simple_animals"), "Copy", []));
		rt.setSv(f, "stage", 0);
		rt.setFv(f, "len", rt.sv(f, "z_has_client"), 0);
		C = null;
		rt.forList(f, 0, rt.gl("clients"), T("/client"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if (truthy((_T = rt.getStep(f, rt.fv(f, "mob", live(C)), 0)))) {
				rt.setAt(rt.sv(f, "z_has_client"), fmt("＀", [rt.fv(f, "z", live(_T))]), 1);
			}
			if ((truthy(rt.fv(f, "eye", live(C))) && !isEqual(rt.fv(f, "eye", live(C)), rt.fv(f, "mob", live(C))))) {
				if (truthy((_T = rt.getStep(f, rt.fv(f, "eye", live(C)), 0)))) {
					rt.setAt(rt.sv(f, "z_has_client"), fmt("＀", [rt.fv(f, "z", live(_T))]), 1);
				}
			}
		}
		rt.endFor(f, 0);
	}
	currentrun = rt.fv(f, "currentrun", live(f.src));
	if (isEqual(rt.sv(f, "stage"), 0)) {
		while (truthy(rt.len(f, live(currentrun)))) {
			SA = rt.index(live(currentrun), rt.len(f, live(currentrun)));
			rt.incField(f, live(currentrun), "len", -1, false);
			if ((!truthy(rt.fv(f, "ckey", live(SA))) && !(truthy((rt.istype(live(SA), T("/mob/living/simple_animal/hostile")) ? 1 : 0)) && truthy(rt.callSrc(f, "npc_z_asleep", [live(SA)]))))) {
				if (!isEqual(rt.fv(f, "stat", live(SA)), 2)) {
					rt.callName(f, live(SA), "handle_automated_movement", []);
				}
				if (!isEqual(rt.fv(f, "stat", live(SA)), 2)) {
					rt.callName(f, live(SA), "handle_automated_action", []);
				}
				if (!isEqual(rt.fv(f, "stat", live(SA)), 2)) {
					rt.callName(f, live(SA), "handle_automated_speech", []);
				}
			}
			if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
				$0 = rt.callSrc(f, "pause", []);
			} else {
				$0 = 0;
			}
			if (truthy($0)) {
				return live(f.dot);
			}
		}
		rt.setSv(f, "stage", 1);
		currentrun = rt.callName(f, rt.sv(f, "processing"), "Copy", []);
		rt.setFv(f, "currentrun", live(f.src), live(currentrun));
	}
	canBeUsed = rt.fv(f, "canBeUsed", live(f.src));
	if (isEqual(rt.sv(f, "stage"), 1)) {
		while (truthy(rt.len(f, live(currentrun)))) {
			thing = rt.index(live(currentrun), rt.len(f, live(currentrun)));
			rt.incField(f, live(currentrun), "len", -1, false);
			rt.callName(f, live(thing), "InteractiveProcess", []);
			checkInRange = rt.call(f, P("/proc/view"), null, [32, live(thing)]);
			if ((truthy(rt.callName(f, live(thing), "IsDeadOrIncap", [0])) || !truthy(rt.locateIn(f, rt.fv(f, "TARGET", live(thing)), live(checkInRange))))) {
				rt.modSrcVar(f, "needsDelegate", live(thing), add);
			} else {
				if (truthy(rt.bitAnd(rt.fv(f, "doing", live(thing)), 8))) {
					rt.modSrcVar(f, "needsAssistant", live(thing), add);
				} else {
					canBeUsed = rt.modify(live(canBeUsed), live(thing), add);
				}
			}
			if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
				$0 = rt.callSrc(f, "pause", []);
			} else {
				$0 = 0;
			}
			if (truthy($0)) {
				return live(f.dot);
			}
		}
		rt.setSv(f, "stage", 2);
		currentrun = rt.sv(f, "needsDelegate");
		rt.setFv(f, "currentrun", live(f.src), live(currentrun));
	}
	if (isEqual(rt.sv(f, "stage"), 2)) {
		while (truthy(rt.len(f, live(currentrun))) && truthy(rt.len(f, live(canBeUsed)))) {
			check = rt.index(live(currentrun), rt.len(f, live(currentrun)));
			candidate = rt.index(live(canBeUsed), rt.len(f, live(canBeUsed)));
			rt.incField(f, live(currentrun), "len", -1, false);
			helpProb = 0;
			chfac = rt.fv(f, "faction", live(check));
			canfac = rt.fv(f, "faction", live(candidate));
			facCount = multiply(rt.length(live(chfac)), rt.length(live(canfac)));
			C_8 = null;
			rt.forList(f, 0, live(chfac));
			while (($e = rt.next(f, 0)) !== undefined) {
				C_8 = $e;
				if (truthy((rt.isIn(f, live(C_8), live(canfac)) ? 1 : 0))) {
					if (rt.ge((helpProb = rt.call(f, P("/proc/min"), null, [100, add(live(helpProb), 25)])), 100)) {
						break;
					}
				}
			}
			rt.endFor(f, 0);
			if ((isEqual(live(facCount), 1) && truthy(live(helpProb)))) {
				helpProb = 100;
			}
			if ((truthy(rt.op(f, "Prob", [], [live(helpProb)])) && truthy(rt.callName(f, live(candidate), "takeDelegate", [live(check)])))) {
				rt.incField(f, live(canBeUsed), "len", -1, false);
				rt.setFv(f, "eye_color", live(candidate), "red");
				rt.callName(f, live(candidate), "update_icons", []);
			}
			if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
				$0 = rt.callSrc(f, "pause", []);
			} else {
				$0 = 0;
			}
			if (truthy($0)) {
				return live(f.dot);
			}
		}
		rt.setSv(f, "stage", 3);
		currentrun = rt.sv(f, "needsAssistant");
		rt.setFv(f, "currentrun", live(f.src), live(currentrun));
	}
	while (truthy(rt.len(f, live(currentrun))) && truthy(rt.len(f, live(canBeUsed)))) {
		check = rt.index(live(currentrun), rt.len(f, live(currentrun)));
		candidate = rt.index(live(canBeUsed), rt.len(f, live(canBeUsed)));
		rt.incField(f, live(currentrun), "len", -1, false);
		helpProb = 0;
		chfac = rt.fv(f, "faction", live(check));
		canfac = rt.fv(f, "faction", live(candidate));
		facCount = multiply(rt.length(live(chfac)), rt.length(live(canfac)));
		C_8 = null;
		rt.forList(f, 0, live(chfac));
		while (($e = rt.next(f, 0)) !== undefined) {
			C_8 = $e;
			if (truthy((rt.isIn(f, live(C_8), live(canfac)) ? 1 : 0))) {
				if (rt.ge((helpProb = rt.call(f, P("/proc/min"), null, [100, add(live(helpProb), 25)])), 100)) {
					break;
				}
			}
		}
		rt.endFor(f, 0);
		if ((isEqual(live(facCount), 1) && truthy(live(helpProb)))) {
			helpProb = 100;
		}
		if ((truthy(rt.op(f, "Prob", [], [live(helpProb)])) && truthy(rt.callName(f, live(candidate), "takeDelegate", [live(check), 0])))) {
			rt.incField(f, live(canBeUsed), "len", -1, false);
			rt.setFv(f, "eye_color", live(candidate), "yellow");
			rt.callName(f, live(candidate), "update_icons", []);
		}
		$0 = (!truthy(rt.len(f, live(currentrun))) ? 1 : 0);
		if (!truthy($0)) {
			if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
				$0 = rt.callSrc(f, "pause", []);
			} else {
				$0 = 0;
			}
		}
		if (truthy($0)) {
			return live(f.dot);
		}
	}
	return f.dot;
});
