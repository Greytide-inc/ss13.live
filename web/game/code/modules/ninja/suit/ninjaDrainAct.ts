// From code/modules/ninja/suit/ninjaDrainAct.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /atom/proc/ninjadrain_act  (code/modules/ninja/suit/ninjaDrainAct.dm:15)
rt.def("/atom/proc/ninjadrain_act", function ninjadrain_act(f: Frame) {
	return "INVALID";
});

// /obj/machinery/power/apc/proc/ninjadrain_act  (code/modules/ninja/suit/ninjaDrainAct.dm:22)  may sleep
rt.def("/obj/machinery/power/apc/proc/ninjadrain_act", function* ninjadrain_act(f: Frame, S: Value, H: Value, G: Value) {
	let maxcapacity: Value = null, drain: Value = null, spark_system: Value = null;
	f.vars = () => [S, H, G, maxcapacity, drain, spark_system];
	if (((!truthy(live(S)) || !truthy(live(H))) || !truthy(live(G)))) {
		return "INVALID";
	}
	maxcapacity = 0;
	drain = 0;
	f.dot = 0;
	if (!(truthy(rt.sv(f, "cell")) && truthy(rt.fv(f, "charge", rt.sv(f, "cell"))))) return f.dot;
	yield* g.callName(f, (spark_system = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [5, 0, rt.sv(f, "loc")]);
	while ((truthy(rt.fv(f, "candrain", live(G))) && rt.gt(rt.fv(f, "charge", rt.sv(f, "cell")), 0)) && !truthy(live(maxcapacity))) {
		drain = (yield* g.call(f, P("/proc/rand"), null, [rt.fv(f, "mindrain", live(G)), rt.fv(f, "maxdrain", live(G))]));
		if (rt.lt(rt.fv(f, "charge", rt.sv(f, "cell")), live(drain))) {
			drain = rt.fv(f, "charge", rt.sv(f, "cell"));
		}
		if (rt.gt(add(rt.gv(f, "charge", rt.fv(f, "cell", live(S))), live(drain)), rt.gv(f, "maxcharge", rt.fv(f, "cell", live(S))))) {
			drain = subtract(rt.gv(f, "maxcharge", rt.fv(f, "cell", live(S))), rt.gv(f, "charge", rt.fv(f, "cell", live(S))));
			maxcapacity = 1;
		}
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(H), null, 10, "target", live(f.src)], rt.Args.Named)))) {
			yield* g.callName(f, live(spark_system), "start", []);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "sparks", 50, 1]);
			(rt.modField(f, rt.sv(f, "cell"), "charge", live(drain), subtract));
			rt.modField(f, rt.fv(f, "cell", live(S)), "charge", live(drain), add);
			f.dot = rt.modify(live(f.dot), live(drain), add);
		} else {
			break;
		}
	}
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	yield* g.call(f, P("/proc/flick"), null, ["apc-spark", live(G)]);
	rt.setSv(f, "emagged", 1);
	rt.setSv(f, "locked", 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/power/smes/proc/ninjadrain_act  (code/modules/ninja/suit/ninjaDrainAct.dm:65)  may sleep
rt.def("/obj/machinery/power/smes/proc/ninjadrain_act", function* ninjadrain_act(f: Frame, S: Value, H: Value, G: Value) {
	let maxcapacity: Value = null, drain: Value = null, spark_system: Value = null;
	f.vars = () => [S, H, G, maxcapacity, drain, spark_system];
	if (((!truthy(live(S)) || !truthy(live(H))) || !truthy(live(G)))) {
		return "INVALID";
	}
	maxcapacity = 0;
	drain = 0;
	f.dot = 0;
	if (!truthy(rt.sv(f, "charge"))) return f.dot;
	yield* g.callName(f, (spark_system = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [5, 0, rt.sv(f, "loc")]);
	while ((truthy(rt.fv(f, "candrain", live(G))) && rt.gt(rt.sv(f, "charge"), 0)) && !truthy(live(maxcapacity))) {
		drain = (yield* g.call(f, P("/proc/rand"), null, [rt.fv(f, "mindrain", live(G)), rt.fv(f, "maxdrain", live(G))]));
		if (rt.lt(rt.sv(f, "charge"), live(drain))) {
			drain = rt.sv(f, "charge");
		}
		if (rt.gt(add(rt.gv(f, "charge", rt.fv(f, "cell", live(S))), live(drain)), rt.gv(f, "maxcharge", rt.fv(f, "cell", live(S))))) {
			drain = subtract(rt.gv(f, "maxcharge", rt.fv(f, "cell", live(S))), rt.gv(f, "charge", rt.fv(f, "cell", live(S))));
			maxcapacity = 1;
		}
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(H), null, 10, "target", live(f.src)], rt.Args.Named)))) {
			yield* g.callName(f, live(spark_system), "start", []);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "sparks", 50, 1]);
			(rt.modSrcVar(f, "charge", live(drain), subtract));
			rt.modField(f, rt.fv(f, "cell", live(S)), "charge", live(drain), add);
			f.dot = rt.modify(live(f.dot), live(drain), add);
		} else {
			break;
		}
	}
	return f.dot;
}, true);

// /obj/item/weapon/stock_parts/cell/proc/ninjadrain_act  (code/modules/ninja/suit/ninjaDrainAct.dm:100)  may sleep
rt.def("/obj/item/weapon/stock_parts/cell/proc/ninjadrain_act", function* ninjadrain_act(f: Frame, S: Value, H: Value, G: Value) {
	f.vars = () => [S, H, G];
	if (((!truthy(live(S)) || !truthy(live(H))) || !truthy(live(G)))) {
		return "INVALID";
	}
	f.dot = 0;
	if (!truthy(rt.sv(f, "charge"))) return f.dot;
	if (!(truthy(rt.fv(f, "candrain", live(G))) && truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(H), null, 30, "target", live(f.src)], rt.Args.Named))))) return f.dot;
	f.dot = rt.sv(f, "charge");
	if (rt.gt(add(rt.gv(f, "charge", rt.fv(f, "cell", live(S))), rt.sv(f, "charge")), rt.gv(f, "maxcharge", rt.fv(f, "cell", live(S))))) {
		rt.setFv(f, "charge", rt.fv(f, "cell", live(S)), rt.gv(f, "maxcharge", rt.fv(f, "cell", live(S))));
	} else {
		rt.modField(f, rt.fv(f, "cell", live(S)), "charge", rt.sv(f, "charge"), add);
	}
	rt.setSv(f, "charge", 0);
	yield* g.srcCall(f, "corrupt");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/computer/rdconsole/proc/ninjadrain_act  (code/modules/ninja/suit/ninjaDrainAct.dm:119)  may sleep
rt.def("/obj/machinery/computer/rdconsole/proc/ninjadrain_act", function* ninjadrain_act(f: Frame, S: Value, H: Value, G: Value) {
	let location: Value = null, AI: Value = null, current_data: Value = null, id: Value = null, analyzing_data: Value = null;
	let $e: any;
	f.vars = () => [S, H, G, location, AI, current_data, id, analyzing_data, $e];
	if (((!truthy(live(S)) || !truthy(live(H))) || !truthy(live(G)))) {
		return "INVALID";
	}
	f.dot = "RDHACKFAIL";
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='notice'>Hacking ％！...</span>", [live(f.src)])]);
	rt.spawnTail(f, 0, "/obj/machinery/computer/rdconsole/proc/ninjadrain_act: spawn at modules/ninja/suit/ninjaDrainAct.dm:125", S, H, G, location, AI, current_data, id, analyzing_data);
	if ((truthy(rt.sv(f, "files")) && truthy(rt.getLen(f, rt.fv(f, "known_tech", rt.sv(f, "files")))))) {
		current_data = null;
		rt.forList(f, 0, rt.fv(f, "stored_research", live(S)), T("/datum/tech"));
		while (($e = rt.next(f, 0)) !== undefined) {
			current_data = $e;
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='notice'>Checking ％！ database.</span>", [rt.fv(f, "name", live(current_data))])]);
			if (((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(H), null, rt.fv(f, "s_delay", live(S)), "target", live(f.src)], rt.Args.Named))) && truthy(rt.fv(f, "candrain", live(G)))) && truthy(live(f.src)))) {
				id = null;
				rt.forList(f, 1, rt.fv(f, "known_tech", rt.sv(f, "files")));
				while (($e = rt.next(f, 1)) !== undefined) {
					id = $e;
					analyzing_data = rt.index(rt.fv(f, "known_tech", rt.sv(f, "files")), live(id));
					if (isEqual(rt.fv(f, "id", live(current_data)), rt.fv(f, "id", live(analyzing_data)))) {
						if (rt.gt(rt.fv(f, "level", live(analyzing_data)), rt.fv(f, "level", live(current_data)))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>Database:</span> <b>UPDATED</b>."]);
							rt.setFv(f, "level", live(current_data), rt.fv(f, "level", live(analyzing_data)));
							f.dot = "RDHACK";
						}
						break;
					}
				}
				rt.endFor(f, 1);
			} else {
				break;
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>Data analyzed. Process finished.</span>"]);
	return f.dot;
}, true);

// a spawn(0) body of /obj/machinery/computer/rdconsole/proc/ninjadrain_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/rdconsole/proc/ninjadrain_act: spawn at modules/ninja/suit/ninjaDrainAct.dm:125", function* (f: Frame, S: Value, H: Value, G: Value, location: Value, AI: Value, current_data: Value, id: Value, analyzing_data: Value) {
	let $0: any, $1: any, $e: any;
	f.vars = () => [S, H, G, location, AI, current_data, id, analyzing_data, $0, $1, $e];
	location = rt.getStep(f, live(H), 0);
	AI = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/silicon/ai"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AI = $e;
		$0 = live(AI);
		if (truthy(live(location))) {
			$1 = fmt(" in ＀", [live(location)]);
		} else {
			$1 = ". Unable to pinpoint location";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='userdanger'>Network Alert: Hacking attempt detected＀</span>.", [$1])]);
	}
	rt.endFor(f, 0);
	return null;
});

// /obj/machinery/r_n_d/server/proc/ninjadrain_act  (code/modules/ninja/suit/ninjaDrainAct.dm:151)  may sleep
rt.def("/obj/machinery/r_n_d/server/proc/ninjadrain_act", function* ninjadrain_act(f: Frame, S: Value, H: Value, G: Value) {
	let location: Value = null, AI: Value = null, current_data: Value = null, id: Value = null, analyzing_data: Value = null;
	let $e: any;
	f.vars = () => [S, H, G, location, AI, current_data, id, analyzing_data, $e];
	if (((!truthy(live(S)) || !truthy(live(H))) || !truthy(live(G)))) {
		return "INVALID";
	}
	f.dot = "RDHACKFAIL";
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='notice'>Hacking ％！...</span>", [live(f.src)])]);
	rt.spawnTail(f, 0, "/obj/machinery/r_n_d/server/proc/ninjadrain_act: spawn at modules/ninja/suit/ninjaDrainAct.dm:157", S, H, G, location, AI, current_data, id, analyzing_data);
	if ((truthy(rt.sv(f, "files")) && truthy(rt.getLen(f, rt.fv(f, "known_tech", rt.sv(f, "files")))))) {
		current_data = null;
		rt.forList(f, 0, rt.fv(f, "stored_research", live(S)), T("/datum/tech"));
		while (($e = rt.next(f, 0)) !== undefined) {
			current_data = $e;
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='notice'>Checking ％！ database.</span>", [rt.fv(f, "name", live(current_data))])]);
			if (((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(H), null, rt.fv(f, "s_delay", live(S)), "target", live(f.src)], rt.Args.Named))) && truthy(rt.fv(f, "candrain", live(G)))) && truthy(live(f.src)))) {
				id = null;
				rt.forList(f, 1, rt.fv(f, "known_tech", rt.sv(f, "files")));
				while (($e = rt.next(f, 1)) !== undefined) {
					id = $e;
					analyzing_data = rt.index(rt.fv(f, "known_tech", rt.sv(f, "files")), live(id));
					if (isEqual(rt.fv(f, "id", live(current_data)), rt.fv(f, "id", live(analyzing_data)))) {
						if (rt.gt(rt.fv(f, "level", live(analyzing_data)), rt.fv(f, "level", live(current_data)))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>Database:</span> <b>UPDATED</b>."]);
							rt.setFv(f, "level", live(current_data), rt.fv(f, "level", live(analyzing_data)));
							f.dot = "RDHACK";
						}
						break;
					}
				}
				rt.endFor(f, 1);
			} else {
				break;
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>Data analyzed. Process finished.</span>"]);
	return f.dot;
}, true);

// a spawn(0) body of /obj/machinery/r_n_d/server/proc/ninjadrain_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/r_n_d/server/proc/ninjadrain_act: spawn at modules/ninja/suit/ninjaDrainAct.dm:157", function* (f: Frame, S: Value, H: Value, G: Value, location: Value, AI: Value, current_data: Value, id: Value, analyzing_data: Value) {
	let $0: any, $1: any, $e: any;
	f.vars = () => [S, H, G, location, AI, current_data, id, analyzing_data, $0, $1, $e];
	location = rt.getStep(f, live(H), 0);
	AI = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/silicon/ai"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AI = $e;
		$0 = live(AI);
		if (truthy(live(location))) {
			$1 = fmt(" in ＀", [live(location)]);
		} else {
			$1 = ". Unable to pinpoint location";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='userdanger'>Network Alert: Hacking attempt detected＀</span>.", [$1])]);
	}
	rt.endFor(f, 0);
	return null;
});

// /obj/structure/cable/proc/ninjadrain_act  (code/modules/ninja/suit/ninjaDrainAct.dm:182)  may sleep
rt.def("/obj/structure/cable/proc/ninjadrain_act", function* ninjadrain_act(f: Frame, S: Value, H: Value, G: Value) {
	let maxcapacity: Value = null, drain: Value = null, PN: Value = null, drained: Value = null, _T: Value = null, AP: Value = null;
	let $e: any;
	f.vars = () => [S, H, G, maxcapacity, drain, PN, drained, _T, AP, $e];
	if (((!truthy(live(S)) || !truthy(live(H))) || !truthy(live(G)))) {
		return "INVALID";
	}
	maxcapacity = 0;
	drain = 0;
	f.dot = 0;
	PN = rt.sv(f, "powernet");
	while ((truthy(rt.fv(f, "candrain", live(G))) && !truthy(live(maxcapacity))) && truthy(live(f.src))) {
		drain = (yield* g.call(f, P("/proc/round"), null, [divide((yield* g.call(f, P("/proc/rand"), null, [rt.fv(f, "mindrain", live(G)), rt.fv(f, "maxdrain", live(G))])), 2)]));
		drained = 0;
		if ((truthy(live(PN)) && truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(H), null, 10, "target", live(f.src)], rt.Args.Named))))) {
			drained = (yield* g.call(f, P("/proc/min"), null, [live(drain), rt.fv(f, "avail", live(PN))]));
			rt.modField(f, live(PN), "load", live(drained), add);
			if (rt.lt(live(drained), live(drain))) {
				_T = null;
				rt.forList(f, 0, rt.fv(f, "nodes", live(PN)), T("/obj/machinery/power/terminal"));
				while (($e = rt.next(f, 0)) !== undefined) {
					_T = $e;
					if (truthy((rt.istype(rt.fv(f, "master", live(_T)), T("/obj/machinery/power/apc")) ? 1 : 0))) {
						if (((truthy(rt.gv(f, "operating", (AP = rt.fv(f, "master", live(_T))))) && truthy(rt.fv(f, "cell", live(AP)))) && rt.gt(rt.gv(f, "charge", rt.fv(f, "cell", live(AP))), 0))) {
							rt.setFv(f, "charge", rt.fv(f, "cell", live(AP)), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.gv(f, "charge", rt.fv(f, "cell", live(AP))), 5)])));
							drained = rt.modify(live(drained), 5, add);
						}
					}
				}
				rt.endFor(f, 0);
			}
		} else {
			break;
		}
		rt.modField(f, rt.fv(f, "cell", live(S)), "charge", live(drained), add);
		if (rt.gt(rt.gv(f, "charge", rt.fv(f, "cell", live(S))), rt.gv(f, "maxcharge", rt.fv(f, "cell", live(S))))) {
			f.dot = rt.modify(live(f.dot), subtract(live(drained), subtract(rt.gv(f, "charge", rt.fv(f, "cell", live(S))), rt.gv(f, "maxcharge", rt.fv(f, "cell", live(S))))), add);
			rt.setFv(f, "charge", rt.fv(f, "cell", live(S)), rt.gv(f, "maxcharge", rt.fv(f, "cell", live(S))));
			maxcapacity = 1;
		} else {
			f.dot = rt.modify(live(f.dot), live(drained), add);
		}
		yield* g.callName(f, rt.fv(f, "spark_system", live(S)), "start", []);
	}
	return f.dot;
}, true);

// /obj/mecha/proc/ninjadrain_act  (code/modules/ninja/suit/ninjaDrainAct.dm:218)  may sleep
rt.def("/obj/mecha/proc/ninjadrain_act", function* ninjadrain_act(f: Frame, S: Value, H: Value, G: Value) {
	let maxcapacity: Value = null, drain: Value = null;
	f.vars = () => [S, H, G, maxcapacity, drain];
	if (((!truthy(live(S)) || !truthy(live(H))) || !truthy(live(G)))) {
		return "INVALID";
	}
	maxcapacity = 0;
	drain = 0;
	f.dot = 0;
	yield* g.srcCall(f, "occupant_message", "<span class='danger'>Warning: Unauthorized access through sub-route 4, block H, detected.</span>");
	if (!truthy((yield* g.srcCall(f, "get_charge")))) return f.dot;
	while ((truthy(rt.fv(f, "candrain", live(G))) && rt.gt(rt.fv(f, "charge", rt.sv(f, "cell")), 0)) && !truthy(live(maxcapacity))) {
		drain = (yield* g.call(f, P("/proc/rand"), null, [rt.fv(f, "mindrain", live(G)), rt.fv(f, "maxdrain", live(G))]));
		if (rt.lt(rt.fv(f, "charge", rt.sv(f, "cell")), live(drain))) {
			drain = rt.fv(f, "charge", rt.sv(f, "cell"));
		}
		if (rt.gt(add(rt.gv(f, "charge", rt.fv(f, "cell", live(S))), live(drain)), rt.gv(f, "maxcharge", rt.fv(f, "cell", live(S))))) {
			drain = subtract(rt.gv(f, "maxcharge", rt.fv(f, "cell", live(S))), rt.gv(f, "charge", rt.fv(f, "cell", live(S))));
			maxcapacity = 1;
		}
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(H), null, 10, "target", live(f.src)], rt.Args.Named)))) {
			yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "sparks", 50, 1]);
			yield* g.callName(f, rt.sv(f, "cell"), "use", [live(drain)]);
			rt.modField(f, rt.fv(f, "cell", live(S)), "charge", live(drain), add);
			f.dot = rt.modify(live(f.dot), live(drain), add);
		} else {
			break;
		}
	}
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/ninjadrain_act  (code/modules/ninja/suit/ninjaDrainAct.dm:245)  may sleep
rt.def("/mob/living/silicon/robot/proc/ninjadrain_act", function* ninjadrain_act(f: Frame, S: Value, H: Value, G: Value) {
	let maxcapacity: Value = null, drain: Value = null;
	f.vars = () => [S, H, G, maxcapacity, drain];
	if (((!truthy(live(S)) || !truthy(live(H))) || !truthy(live(G)))) {
		return "INVALID";
	}
	maxcapacity = 0;
	drain = 0;
	f.dot = 0;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>Warning: Unauthorized access through sub-route 12, block C, detected.</span>"]);
	if (!(truthy(rt.sv(f, "cell")) && truthy(rt.fv(f, "charge", rt.sv(f, "cell"))))) return f.dot;
	while ((truthy(rt.fv(f, "candrain", live(G))) && rt.gt(rt.fv(f, "charge", rt.sv(f, "cell")), 0)) && !truthy(live(maxcapacity))) {
		drain = (yield* g.call(f, P("/proc/rand"), null, [rt.fv(f, "mindrain", live(G)), rt.fv(f, "maxdrain", live(G))]));
		if (rt.lt(rt.fv(f, "charge", rt.sv(f, "cell")), live(drain))) {
			drain = rt.fv(f, "charge", rt.sv(f, "cell"));
		}
		if (rt.gt(add(rt.gv(f, "charge", rt.fv(f, "cell", live(S))), live(drain)), rt.gv(f, "maxcharge", rt.fv(f, "cell", live(S))))) {
			drain = subtract(rt.gv(f, "maxcharge", rt.fv(f, "cell", live(S))), rt.gv(f, "charge", rt.fv(f, "cell", live(S))));
			maxcapacity = 1;
		}
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [live(H), 10])))) {
			yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "sparks", 50, 1]);
			(rt.modField(f, rt.sv(f, "cell"), "charge", live(drain), subtract));
			rt.modField(f, rt.fv(f, "cell", live(S)), "charge", live(drain), add);
			f.dot = rt.modify(live(f.dot), live(drain), add);
		} else {
			break;
		}
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/ninjadrain_act  (code/modules/ninja/suit/ninjaDrainAct.dm:274)  may sleep
rt.def("/mob/living/carbon/proc/ninjadrain_act", function* ninjadrain_act(f: Frame, S: Value, H: Value, G: Value) {
	let spark_system: Value = null;
	f.vars = () => [S, H, G, spark_system];
	if (((!truthy(live(S)) || !truthy(live(H))) || !truthy(live(G)))) {
		return "INVALID";
	}
	f.dot = "MOBSHOCKFAIL";
	if (!((truthy(rt.fv(f, "cell", live(S))) && truthy(rt.gv(f, "charge", rt.fv(f, "cell", live(S))))) && truthy((yield* g.callName(f, rt.fv(f, "cell", live(S)), "use", [1000]))))) return f.dot;
	f.dot = "MOBSHOCK";
	yield* g.callName(f, (spark_system = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [5, 0, rt.sv(f, "loc")]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "sparks", 50, 1]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ electrocutes ＀ with ＀ touch!</span>", [live(H), live(f.src), (yield* g.callName(f, live(H), "p_their", []))]), fmt("<span class='userdanger'>＀ electrocutes you with ＀ touch!</span>", [live(H), (yield* g.callName(f, live(H), "p_their", []))]));
	yield* g.srcCall(f, "electrocute_act", 25, live(H));
	return f.dot;
}, true);
