// Based on /tg/station's code/modules/atmospherics/environmental/LINDA_system.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// LINDA_system.dm:3
rt.def("/atom/proc/CanAtmosPass", function CanAtmosPass(f: Frame, _T: Value) {
	if (this.CanAtmosPass === -1) {
		return 1;
	} else if (this.CanAtmosPass === ATMOS_PASS_DENSITY) {
		return (!this.density ? 1 : 0);
	} else {
		return this.CanAtmosPass;
	}
});

// LINDA_system.dm:16
rt.def("/turf/open/proc/CanAtmosPass", function CanAtmosPass(f: Frame, _T: Value) {
	let R: Value = null, O: Value = null, other: Value = null, D: Value = null;
	let $0: any, $e: any;
	if (this.blocks_air || _T.blocks_air) {
		R = 1;
	}
	for (O of each(this.contents, T("/obj"))) {
		if (O.loc == this) {
			$0 = _T;
		} else {
			$0 = this;
		}
		other = $0;
		if (O.CanAtmosPass == -1) {
			$0 = O.CanAtmosPass(other);
		} else if (O.CanAtmosPass == -2) {
			$0 = (!O.density ? 1 : 0);
		} else {
			$0 = O.CanAtmosPass;
		}
		if (!$0) {
			R = 1;
			if (O.BlockSuperconductivity()) {
				(rt.modSrcVar(f, "atmos_supeconductivity", (D = rt.getDir(f, this, _T)), rt.bitOr));
				D = rt.getDir(f, _T, this);
				(rt.modField(f, _T, "atmos_supeconductivity", D, rt.bitOr));
				return 0;
			}
		}
	}
	O = null;
	for (O of each(_T.contents, T("/obj"))) {
		if (O.loc == this) {
			$0 = _T;
		} else {
			$0 = this;
		}
		other = $0;
		if (O.CanAtmosPass == -1) {
			$0 = O.CanAtmosPass(other);
		} else if (O.CanAtmosPass == -2) {
			$0 = (!O.density ? 1 : 0);
		} else {
			$0 = O.CanAtmosPass;
		}
		if (!$0) {
			R = 1;
			if (O.BlockSuperconductivity()) {
				(rt.modSrcVar(f, "atmos_supeconductivity", (D = rt.getDir(f, this, _T)), rt.bitOr));
				D = rt.getDir(f, _T, this);
				(rt.modField(f, _T, "atmos_supeconductivity", D, rt.bitOr));
				return 0;
			}
		}
	}
	(rt.modSrcVar(f, "atmos_supeconductivity", rt.op(f, "BitNot", [], [rt.getDir(f, this, _T)]), rt.bitAnd));
	(rt.modField(f, _T, "atmos_supeconductivity", rt.op(f, "BitNot", [], [rt.getDir(f, _T, this)]), rt.bitAnd));
	return (!R ? 1 : 0);
});

// LINDA_system.dm:53
rt.def("/turf/proc/CalculateAdjacentTurfs", function CalculateAdjacentTurfs(f: Frame) {
	let direction: Value = null, _T: Value = null;
	let $0: any, $e: any;
	let atmos_adjacent_turfs: Value = this.atmos_adjacent_turfs;
	for (direction of each(GLOB.cardinal)) {
		if (!(_T = rt.getStep(f, this, direction))) {
			continue;
		}
		if (_T.CanAtmosPass == -1) {
			$0 = _T.CanAtmosPass(this);
		} else if (_T.CanAtmosPass == -2) {
			$0 = (!_T.density ? 1 : 0);
		} else {
			$0 = _T.CanAtmosPass;
		}
		if ($0) {
			if (!atmos_adjacent_turfs) {
				atmos_adjacent_turfs = list();
			}
			if (!_T.atmos_adjacent_turfs) {
				_T.atmos_adjacent_turfs = list();
			}
			rt.setAt(atmos_adjacent_turfs, _T, 1);
			rt.setAt(_T.atmos_adjacent_turfs, this, 1);
		} else {
			if (atmos_adjacent_turfs) {
				atmos_adjacent_turfs -= _T;
			}
			if (_T.atmos_adjacent_turfs) {
				_T.atmos_adjacent_turfs -= this;
			}
			if (_T.atmos_adjacent_turfs && !rt.len(f, _T.atmos_adjacent_turfs)) {
				_T.atmos_adjacent_turfs = null;
			}
		}
	}
	if (atmos_adjacent_turfs && !rt.len(f, atmos_adjacent_turfs)) {
		atmos_adjacent_turfs = null;
	}
	this.atmos_adjacent_turfs = atmos_adjacent_turfs;
	return f.dot;
});

// LINDA_system.dm:77
rt.def("/turf/proc/GetAtmosAdjacentTurfs", function GetAtmosAdjacentTurfs(f: Frame, alldir: Value) {
	let adjacent_turfs: Value = null, direction: Value = null, matchingDirections: Value = null, S: Value = null, checkDirection: Value = null, checkTurf: Value = null;
	alldir ??= 0;
	if (this.atmos_adjacent_turfs) {
		adjacent_turfs = this.atmos_adjacent_turfs.Copy();
	} else {
		adjacent_turfs = list();
	}
	if (!alldir) {
		return adjacent_turfs;
	}
	let curloc: Value = this;
	for (direction of each(GLOB.diagonals)) {
		matchingDirections = 0;
		S = rt.getStep(f, curloc, direction);
		checkDirection = null;
		for (checkDirection of each(GLOB.cardinal)) {
			checkTurf = rt.getStep(f, S, checkDirection);
			if (!S.atmos_adjacent_turfs || !rt.index(S.atmos_adjacent_turfs, checkTurf)) {
				continue;
			}
			if (rt.index(adjacent_turfs, checkTurf)) {
				matchingDirections++;
			}
			if (matchingDirections >= 2) {
				adjacent_turfs += S;
				break;
			}
		}
	}
	return adjacent_turfs;
});

// LINDA_system.dm:105
rt.def("/atom/proc/air_update_turf", function air_update_turf(f: Frame, command: Value) {
	let _T: Value = null;
	command ??= 0;
	if (!isturf(this.loc) && command) {
		return f.dot;
	}
	(_T = rt.getStep(f, this.loc, 0)).air_update_turf(command);
	return f.dot;
});

// LINDA_system.dm:112
rt.def("/turf/proc/air_update_turf", function air_update_turf(f: Frame, command: Value) {
	command ??= 0;
	if (command) {
		this.CalculateAdjacentTurfs();
	}
	GLOB.SSair.add_to_active(this, command);
	return f.dot;
});

// LINDA_system.dm:116
rt.def("/atom/movable/proc/move_update_air", function move_update_air(f: Frame, _T: Value) {
	if (isturf(_T)) {
		_T.air_update_turf(1);
	}
	this.air_update_turf(1);
	return f.dot;
});

// LINDA_system.dm:121
rt.def("/atom/proc/atmos_spawn_air", function atmos_spawn_air(f: Frame, text: Value) {
	let _T: Value = null;
	if (!rt.istype((_T = rt.getStep(f, this, 0)), T("/turf/open"))) {
		return f.dot;
	}
	_T.atmos_spawn_air(text);
	return f.dot;
});

// LINDA_system.dm:127
rt.def("/turf/open/proc/atmos_spawn_air", function atmos_spawn_air(f: Frame, text: Value) {
	let G: Value = null;
	if (!text || !this.air) {
		return f.dot;
	}
	(G = new_(T("/datum/gas_mixture"))).parse_gas_string(text);
	this.air.merge(G);
	GLOB.SSair.add_to_active(this, 0);
	return f.dot;
});
