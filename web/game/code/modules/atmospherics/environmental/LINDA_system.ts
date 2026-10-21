// From code/modules/atmospherics/environmental/LINDA_system.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /atom/proc/CanAtmosPass  (code/modules/atmospherics/environmental/LINDA_system.dm:3)
rt.def("/atom/proc/CanAtmosPass", function CanAtmosPass(f: Frame, _T: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "CanAtmosPass");
	if ($0 === -1) {
		return 1;
	} else if ($0 === -2) {
		return (!truthy(rt.sv(f, "density")) ? 1 : 0);
	} else {
		return rt.sv(f, "CanAtmosPass");
	}
	return f.dot;
});

// /turf/open/proc/CanAtmosPass  (code/modules/atmospherics/environmental/LINDA_system.dm:16)
rt.def("/turf/open/proc/CanAtmosPass", function CanAtmosPass(f: Frame, _T: Value) {
	let R: Value = null, O: Value = null, other: Value = null, D: Value = null;
	let $0: any, $e: any;
	f.vars = () => [R, O, other, D, $0, $e];
	R = null;
	if ((truthy(rt.sv(f, "blocks_air")) || truthy(rt.fv(f, "blocks_air", live(_T))))) {
		R = 1;
	}
	O = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (isEqual(rt.fv(f, "loc", live(O)), live(f.src))) {
			$0 = live(_T);
		} else {
			$0 = live(f.src);
		}
		other = $0;
		if (isEqual(rt.fv(f, "CanAtmosPass", live(O)), -1)) {
			$0 = rt.callName(f, live(O), "CanAtmosPass", [live(other)]);
		} else {
			if (isEqual(rt.fv(f, "CanAtmosPass", live(O)), -2)) {
				$0 = (!truthy(rt.fv(f, "density", live(O))) ? 1 : 0);
			} else {
				$0 = rt.fv(f, "CanAtmosPass", live(O));
			}
		}
		if (!truthy($0)) {
			R = 1;
			if (truthy(rt.callName(f, live(O), "BlockSuperconductivity", []))) {
				(rt.modSrcVar(f, "atmos_supeconductivity", (D = rt.getDir(f, live(f.src), live(_T))), rt.bitOr));
				D = rt.getDir(f, live(_T), live(f.src));
				(rt.modField(f, live(_T), "atmos_supeconductivity", live(D), rt.bitOr));
				return 0;
			}
		}
	}
	rt.endFor(f, 0);
	O = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(_T)), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (isEqual(rt.fv(f, "loc", live(O)), live(f.src))) {
			$0 = live(_T);
		} else {
			$0 = live(f.src);
		}
		other = $0;
		if (isEqual(rt.fv(f, "CanAtmosPass", live(O)), -1)) {
			$0 = rt.callName(f, live(O), "CanAtmosPass", [live(other)]);
		} else {
			if (isEqual(rt.fv(f, "CanAtmosPass", live(O)), -2)) {
				$0 = (!truthy(rt.fv(f, "density", live(O))) ? 1 : 0);
			} else {
				$0 = rt.fv(f, "CanAtmosPass", live(O));
			}
		}
		if (!truthy($0)) {
			R = 1;
			if (truthy(rt.callName(f, live(O), "BlockSuperconductivity", []))) {
				(rt.modSrcVar(f, "atmos_supeconductivity", (D = rt.getDir(f, live(f.src), live(_T))), rt.bitOr));
				D = rt.getDir(f, live(_T), live(f.src));
				(rt.modField(f, live(_T), "atmos_supeconductivity", live(D), rt.bitOr));
				return 0;
			}
		}
	}
	rt.endFor(f, 0);
	(rt.modSrcVar(f, "atmos_supeconductivity", rt.op(f, "BitNot", [], [rt.getDir(f, live(f.src), live(_T))]), rt.bitAnd));
	(rt.modField(f, live(_T), "atmos_supeconductivity", rt.op(f, "BitNot", [], [rt.getDir(f, live(_T), live(f.src))]), rt.bitAnd));
	return (!truthy(live(R)) ? 1 : 0);
});

// /turf/proc/CalculateAdjacentTurfs  (code/modules/atmospherics/environmental/LINDA_system.dm:53)
rt.def("/turf/proc/CalculateAdjacentTurfs", function CalculateAdjacentTurfs(f: Frame) {
	let atmos_adjacent_turfs: Value = null, direction: Value = null, _T: Value = null;
	let $0: any, $e: any;
	f.vars = () => [atmos_adjacent_turfs, direction, _T, $0, $e];
	atmos_adjacent_turfs = rt.fv(f, "atmos_adjacent_turfs", live(f.src));
	direction = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		direction = $e;
		if (!truthy((_T = rt.getStep(f, live(f.src), live(direction))))) {
			continue;
		}
		if (isEqual(rt.fv(f, "CanAtmosPass", live(_T)), -1)) {
			$0 = rt.callName(f, live(_T), "CanAtmosPass", [live(f.src)]);
		} else {
			if (isEqual(rt.fv(f, "CanAtmosPass", live(_T)), -2)) {
				$0 = (!truthy(rt.fv(f, "density", live(_T))) ? 1 : 0);
			} else {
				$0 = rt.fv(f, "CanAtmosPass", live(_T));
			}
		}
		if (truthy($0)) {
			if (!truthy(live(atmos_adjacent_turfs))) {
				atmos_adjacent_turfs = rt.list();
			}
			if (!truthy(rt.fv(f, "atmos_adjacent_turfs", live(_T)))) {
				rt.setFv(f, "atmos_adjacent_turfs", live(_T), rt.list());
			}
			rt.setAt(live(atmos_adjacent_turfs), live(_T), 1);
			rt.setAt(rt.fv(f, "atmos_adjacent_turfs", live(_T)), live(f.src), 1);
		} else {
			if (truthy(live(atmos_adjacent_turfs))) {
				(atmos_adjacent_turfs = rt.modify(live(atmos_adjacent_turfs), live(_T), subtract));
			}
			if (truthy(rt.fv(f, "atmos_adjacent_turfs", live(_T)))) {
				(rt.modField(f, live(_T), "atmos_adjacent_turfs", live(f.src), subtract));
			}
			if ((truthy(rt.fv(f, "atmos_adjacent_turfs", live(_T))) && !truthy(rt.getLen(f, rt.fv(f, "atmos_adjacent_turfs", live(_T)))))) {
				rt.setFv(f, "atmos_adjacent_turfs", live(_T), null);
			}
		}
	}
	rt.endFor(f, 0);
	if ((truthy(live(atmos_adjacent_turfs)) && !truthy(rt.len(f, live(atmos_adjacent_turfs))))) {
		atmos_adjacent_turfs = null;
	}
	rt.setFv(f, "atmos_adjacent_turfs", live(f.src), live(atmos_adjacent_turfs));
	return f.dot;
});

// /turf/proc/GetAtmosAdjacentTurfs  (code/modules/atmospherics/environmental/LINDA_system.dm:77)
rt.def("/turf/proc/GetAtmosAdjacentTurfs", function GetAtmosAdjacentTurfs(f: Frame, alldir: Value) {
	let adjacent_turfs: Value = null, curloc: Value = null, direction: Value = null, matchingDirections: Value = null, S: Value = null, checkDirection: Value = null, checkTurf: Value = null;
	let $e: any;
	f.vars = () => [alldir, adjacent_turfs, curloc, direction, matchingDirections, S, checkDirection, checkTurf, $e];
	if (live(alldir) === null) {
		alldir = 0;
	}
	adjacent_turfs = null;
	if (truthy(rt.sv(f, "atmos_adjacent_turfs"))) {
		adjacent_turfs = rt.callName(f, rt.sv(f, "atmos_adjacent_turfs"), "Copy", []);
	} else {
		adjacent_turfs = rt.list();
	}
	if (!truthy(live(alldir))) {
		return live(adjacent_turfs);
	}
	curloc = live(f.src);
	direction = null;
	rt.forList(f, 0, rt.gl("diagonals"));
	while (($e = rt.next(f, 0)) !== undefined) {
		direction = $e;
		matchingDirections = 0;
		S = rt.getStep(f, live(curloc), live(direction));
		checkDirection = null;
		rt.forList(f, 1, rt.gl("cardinal"));
		while (($e = rt.next(f, 1)) !== undefined) {
			checkDirection = $e;
			checkTurf = rt.getStep(f, live(S), live(checkDirection));
			if ((!truthy(rt.fv(f, "atmos_adjacent_turfs", live(S))) || !truthy(rt.index(rt.fv(f, "atmos_adjacent_turfs", live(S)), live(checkTurf))))) {
				continue;
			}
			if (truthy(rt.index(live(adjacent_turfs), live(checkTurf)))) {
				matchingDirections = rt.inc(live(matchingDirections), 1);
			}
			if (rt.ge(live(matchingDirections), 2)) {
				adjacent_turfs = rt.modify(live(adjacent_turfs), live(S), add);
				break;
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return live(adjacent_turfs);
});

// /atom/proc/air_update_turf  (code/modules/atmospherics/environmental/LINDA_system.dm:105)
rt.def("/atom/proc/air_update_turf", function air_update_turf(f: Frame, command: Value) {
	let _T: Value = null;
	f.vars = () => [command, _T];
	if (live(command) === null) {
		command = 0;
	}
	if ((!truthy(rt.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])) && truthy(live(command)))) {
		return live(f.dot);
	}
	rt.callName(f, (_T = rt.getStep(f, rt.sv(f, "loc"), 0)), "air_update_turf", [live(command)]);
	return f.dot;
});

// /turf/proc/air_update_turf  (code/modules/atmospherics/environmental/LINDA_system.dm:112)
rt.def("/turf/proc/air_update_turf", function air_update_turf(f: Frame, command: Value) {
	f.vars = () => [command];
	if (live(command) === null) {
		command = 0;
	}
	if (truthy(live(command))) {
		rt.callSrc(f, "CalculateAdjacentTurfs", []);
	}
	rt.callName(f, rt.gl("SSair"), "add_to_active", [live(f.src), live(command)]);
	return f.dot;
});

// /atom/movable/proc/move_update_air  (code/modules/atmospherics/environmental/LINDA_system.dm:116)
rt.def("/atom/movable/proc/move_update_air", function move_update_air(f: Frame, _T: Value) {
	if (truthy(rt.call(f, P("/proc/isturf"), null, [live(_T)]))) {
		rt.callName(f, live(_T), "air_update_turf", [1]);
	}
	rt.callSrc(f, "air_update_turf", [1]);
	return f.dot;
});

// /atom/proc/atmos_spawn_air  (code/modules/atmospherics/environmental/LINDA_system.dm:121)
rt.def("/atom/proc/atmos_spawn_air", function atmos_spawn_air(f: Frame, text: Value) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy((rt.istype((_T = rt.getStep(f, live(f.src), 0)), T("/turf/open")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.callName(f, live(_T), "atmos_spawn_air", [live(text)]);
	return f.dot;
});

// /turf/open/proc/atmos_spawn_air  (code/modules/atmospherics/environmental/LINDA_system.dm:127)
rt.def("/turf/open/proc/atmos_spawn_air", function atmos_spawn_air(f: Frame, text: Value) {
	let G: Value = null;
	f.vars = () => [G];
	if ((!truthy(live(text)) || !truthy(rt.sv(f, "air")))) {
		return live(f.dot);
	}
	rt.callName(f, (G = rt.new_(f, T("/datum/gas_mixture"), [])), "parse_gas_string", [live(text)]);
	rt.callName(f, rt.sv(f, "air"), "merge", [live(G)]);
	rt.callName(f, rt.gl("SSair"), "add_to_active", [live(f.src), 0]);
	return f.dot;
});
