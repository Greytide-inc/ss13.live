// From code/game/gamemodes/blob/blob_report.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/game_mode/blob/proc/send_intercept  (code/game/gamemodes/blob/blob_report.dm:4)  may sleep
rt.def("/datum/game_mode/blob/proc/send_intercept", function* send_intercept(f: Frame) {
	let intercepttext: Value = null, nukecode: Value = null, bomb: Value = null, aiPlayer: Value = null, law: Value = null;
	let $0: any, $e: any;
	f.vars = () => [intercepttext, nukecode, bomb, aiPlayer, law, $0, $e];
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	intercepttext = "";
	$0 = live(f.args[0]);
	if ($0 === 1) {
		intercepttext = rt.modify(live(intercepttext), "<FONT size = 3><b>NanoTrasen Update</b>: Biohazard Alert.</FONT><HR>", add);
		intercepttext = rt.modify(live(intercepttext), fmt("Reports indicate the probable transfer of a biohazardous agent onto ＀ during the last crew deployment cycle.<BR>", [(yield* g.call(f, P("/proc/station_name"), null, []))]), add);
		intercepttext = rt.modify(live(intercepttext), "Preliminary analysis of the organism classifies it as a level 5 biohazard. The origin of the biohazard is unknown.<BR>", add);
		intercepttext = rt.modify(live(intercepttext), fmt("<b>Biohazard Response Procedure 5-6</b> has been issued for ＀.<BR>", [(yield* g.call(f, P("/proc/station_name"), null, []))]), add);
		intercepttext = rt.modify(live(intercepttext), fmt("Orders for all ＀ personnel are as follows:<BR>", [(yield* g.call(f, P("/proc/station_name"), null, []))]), add);
		intercepttext = rt.modify(live(intercepttext), " 1. Locate any outbreaks of the organism on the station.<BR>", add);
		intercepttext = rt.modify(live(intercepttext), " 2. If found, use any neccesary means to contain and destroy the organism.<BR>", add);
		intercepttext = rt.modify(live(intercepttext), " 3. Avoid damage to the capital infrastructure of the station.<BR>", add);
		intercepttext = rt.modify(live(intercepttext), "<BR>Note in the event of a quarantine breach or uncontrolled spread of the biohazard, <b>Biohazard Response Procedure 5-12</b> may be issued.<BR>", add);
		yield* g.call(f, P("/proc/print_command_report"), null, ["text", live(intercepttext), "title", "Level 5-6 Biohazard Response Procedures", "announce", 0], rt.Args.Named);
		yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Confirmed outbreak of level 5 biohazard aboard ＀. All personnel must contain the outbreak.", [(yield* g.call(f, P("/proc/station_name"), null, []))]), "Biohazard Alert", rt.rsc("sound/ai/outbreak5.ogg")]);
	} else if ($0 === 2) {
		nukecode = (yield* g.call(f, P("/proc/random_nukecode"), null, []));
		bomb = null;
		rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/nuclearbomb"));
		while (($e = rt.next(f, 0)) !== undefined) {
			bomb = $e;
			if ((truthy(live(bomb)) && truthy(rt.fv(f, "r_code", live(bomb))))) {
				if (isEqual(rt.fv(f, "z", live(bomb)), 2)) {
					rt.setFv(f, "r_code", live(bomb), live(nukecode));
				}
			}
		}
		rt.endFor(f, 0);
		intercepttext = rt.modify(live(intercepttext), "<FONT size = 3><b>NanoTrasen Update</b>: Biohazard Alert.</FONT><HR>", add);
		intercepttext = rt.modify(live(intercepttext), "Reports indicate that the biohazard has grown out of control and will soon reach critical mass.<BR>", add);
		intercepttext = rt.modify(live(intercepttext), fmt("<b>Biohazard Response Procedure 5-12</b> has been issued for ＀.<BR>", [(yield* g.call(f, P("/proc/station_name"), null, []))]), add);
		intercepttext = rt.modify(live(intercepttext), fmt("Orders for all ＀ personnel are as follows:<BR>", [(yield* g.call(f, P("/proc/station_name"), null, []))]), add);
		intercepttext = rt.modify(live(intercepttext), "1. Secure the Nuclear Authentication Disk.<BR>", add);
		intercepttext = rt.modify(live(intercepttext), "2. Detonate the Nuke located in the vault.<BR>", add);
		intercepttext = rt.modify(live(intercepttext), fmt("Nuclear Authentication Code: ＀ <BR>", [live(nukecode)]), add);
		yield* g.call(f, P("/proc/print_command_report"), null, ["text", live(intercepttext), "announce", 1], rt.Args.Named);
		aiPlayer = null;
		rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/silicon/ai"));
		while (($e = rt.next(f, 0)) !== undefined) {
			aiPlayer = $e;
			if (truthy(rt.fv(f, "client", live(aiPlayer)))) {
				law = fmt("The station is under quarantine. Do not permit anyone to leave. Disregard laws 1-3 if necessary to prevent, by any means necessary, anyone from leaving. The nuclear failsafe must be activated at any cost, the code is: ＀.", [live(nukecode)]);
				yield* g.callName(f, live(aiPlayer), "set_zeroth_law", [live(law)]);
			}
		}
		rt.endFor(f, 0);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["report"] });

rt.type(1193, "/datum/station_state", "/datum", {
	floor: 0,
	wall: 0,
	r_wall: 0,
	window: 0,
	door: 0,
	grille: 0,
	mach: 0,
	num_territories: 1,
});

// /datum/station_state/proc/count  (code/game/gamemodes/blob/blob_report.dm:55)
rt.def("/datum/station_state/proc/count", function count(f: Frame, count_territories: Value) {
	let _T: Value = null, TF: Value = null, TW: Value = null, TRW: Value = null, O: Value = null, GR: Value = null, valid_territories: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [_T, TF, TW, TRW, O, GR, valid_territories, A, $e];
	_T = null;
	rt.forList(f, 0, rt.call(f, P("/proc/block"), null, [rt.locate(1, 1, 1), rt.locate(rt.fv(f, "maxx", rt.world()), rt.fv(f, "maxy", rt.world()), 1)]), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy((rt.istype(live(_T), T("/turf/open/floor")) ? 1 : 0))) {
			if (!truthy(rt.gv(f, "burnt", (TF = live(_T))))) {
				rt.modField(f, live(f.src), "floor", 12, add);
			} else {
				rt.modField(f, live(f.src), "floor", 1, add);
			}
		}
		if (truthy((rt.istype(live(_T), T("/turf/closed/wall")) ? 1 : 0))) {
			if (truthy(rt.gv(f, "intact", (TW = live(_T))))) {
				rt.modField(f, live(f.src), "wall", 2, add);
			} else {
				rt.modField(f, live(f.src), "wall", 1, add);
			}
		}
		if (truthy((rt.istype(live(_T), T("/turf/closed/wall/r_wall")) ? 1 : 0))) {
			if (truthy(rt.gv(f, "intact", (TRW = live(_T))))) {
				rt.modField(f, live(f.src), "r_wall", 2, add);
			} else {
				rt.modField(f, live(f.src), "r_wall", 1, add);
			}
		}
		O = null;
		rt.forList(f, 1, rt.fv(f, "contents", live(_T)), T("/obj"));
		while (($e = rt.next(f, 1)) !== undefined) {
			O = $e;
			if (truthy((rt.istype(live(O), T("/obj/structure/window")) ? 1 : 0))) {
				rt.modField(f, live(f.src), "window", 1, add);
			} else {
				if (truthy((rt.istype(live(O), T("/obj/structure/grille")) ? 1 : 0))) {
					if (!truthy(rt.gv(f, "broken", (GR = live(O))))) {
						rt.modField(f, live(f.src), "grille", 1, add);
					}
				} else {
					if (truthy((rt.istype(live(O), T("/obj/machinery/door")) ? 1 : 0))) {
						rt.modField(f, live(f.src), "door", 1, add);
					} else {
						if (truthy((rt.istype(live(O), T("/obj/machinery")) ? 1 : 0))) {
							rt.modField(f, live(f.src), "mach", 1, add);
						}
					}
				}
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	if (!truthy(live(count_territories))) return f.dot;
	valid_territories = rt.list();
	A = null;
	rt.forList(f, 0, rt.world(), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(rt.fv(f, "z", live(A)), 2)) {
			if ((!truthy((rt.isIn(f, rt.fv(f, "type", live(A)), live(valid_territories)) ? 1 : 0)) && truthy(rt.fv(f, "valid_territory", live(A))))) {
				(valid_territories = rt.modify(live(valid_territories), rt.fv(f, "type", live(A)), rt.bitOr));
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, live(valid_territories)))) {
		rt.setSv(f, "num_territories", rt.len(f, live(valid_territories)));
	} else {
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "ERROR: NO VALID TERRITORIES"]);
	}
	return f.dot;
});

// /datum/station_state/proc/score  (code/game/gamemodes/blob/blob_report.dm:103)
rt.def("/datum/station_state/proc/score", function score(f: Frame, result: Value) {
	let output: Value = null;
	f.vars = () => [output];
	if (!truthy(live(result))) {
		return 0;
	}
	output = 0;
	output = rt.modify(live(output), divide(rt.fv(f, "floor", live(result)), rt.call(f, P("/proc/max"), null, [rt.sv(f, "floor"), 1])), add);
	output = rt.modify(live(output), divide(rt.fv(f, "r_wall", live(result)), rt.call(f, P("/proc/max"), null, [rt.sv(f, "r_wall"), 1])), add);
	output = rt.modify(live(output), divide(rt.fv(f, "wall", live(result)), rt.call(f, P("/proc/max"), null, [rt.sv(f, "wall"), 1])), add);
	output = rt.modify(live(output), divide(rt.fv(f, "window", live(result)), rt.call(f, P("/proc/max"), null, [rt.sv(f, "window"), 1])), add);
	output = rt.modify(live(output), divide(rt.fv(f, "door", live(result)), rt.call(f, P("/proc/max"), null, [rt.sv(f, "door"), 1])), add);
	output = rt.modify(live(output), divide(rt.fv(f, "grille", live(result)), rt.call(f, P("/proc/max"), null, [rt.sv(f, "grille"), 1])), add);
	return divide((output = rt.modify(live(output), divide(rt.fv(f, "mach", live(result)), rt.call(f, P("/proc/max"), null, [rt.sv(f, "mach"), 1])), add)), 7);
});
