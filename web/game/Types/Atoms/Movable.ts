// From Types/Atoms/Movable.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /atom/movable/proc/get_alt_name  empty
rt.def("/atom/movable/proc/get_alt_name");

// /atom/movable/proc/GetJob  empty
rt.def("/atom/movable/proc/GetJob");

// /atom/movable/proc/GetSource  empty
rt.def("/atom/movable/proc/GetSource");

// /atom/movable/proc/GetRadio  empty
rt.def("/atom/movable/proc/GetRadio");

// /atom/movable/proc/Move  (Types/Atoms/Movable.dm:25)
rt.def("/atom/movable/proc/Move", function Move(f: Frame, NewLoc: Value, Dir: Value) {
	let oldloc: Value = null, d: Value = null, oldarea: Value = null, newarea: Value = null, areachange: Value = null, entered: Value = null, areaentered: Value = null, obstacle: Value = null, uncrossed: Value = null, crossed: Value = null;
	let $0: any, $e: any;
	let L: Value = null, sk: Value = null;
	f.vars = () => [Dir, oldloc, d, oldarea, newarea, areachange, entered, areaentered, obstacle, uncrossed, crossed, L, sk, $0, $e];
	if (live(Dir) === null) {
		Dir = 0;
	}
	if (live(NewLoc) === null) {
		return 0;
	}
	oldloc = rt.sv(f, "loc");
	if (truthy(live(Dir))) {
		rt.setSv(f, "dir", live(Dir));
	} else {
		if (truthy(live(oldloc))) {
			if (truthy((d = rt.getDir(f, live(oldloc), live(NewLoc))))) {
				rt.setSv(f, "dir", live(d));
			}
		}
	}
	if (isEqual(live(oldloc), live(NewLoc))) {
		return 1;
	}
	if (truthy(rt.call(f, P("/proc/isturf"), null, [live(oldloc)]))) {
		$0 = rt.fv(f, "loc", live(oldloc));
	} else {
		$0 = null;
	}
	oldarea = $0;
	if (truthy(rt.call(f, P("/proc/isturf"), null, [live(NewLoc)]))) {
		$0 = rt.fv(f, "loc", live(NewLoc));
	} else {
		$0 = null;
	}
	newarea = $0;
	areachange = (!isEqual(live(oldarea), live(newarea)) ? 1 : 0);
	if (truthy(live(oldloc))) {
		if (!truthy(rt.callName(f, live(oldloc), "Exit", [live(f.src), live(NewLoc)]))) {
			return 0;
		}
		if (((truthy(live(areachange)) && truthy(live(oldarea))) && !truthy(rt.callName(f, live(oldarea), "Exit", [live(f.src), live(NewLoc)])))) {
			return 0;
		}
	}
	entered = rt.callName(f, live(NewLoc), "Enter", [live(f.src), live(oldloc)]);
	if ((!truthy(live(areachange)) || !truthy(live(newarea)))) {
		$0 = 1;
	} else {
		$0 = rt.callName(f, live(newarea), "Enter", [live(f.src), live(oldloc)]);
	}
	areaentered = $0;
	if ((!truthy(live(entered)) || !truthy(live(areaentered)))) {
		if (!truthy(live(entered))) {
			if (truthy(rt.fv(f, "density", live(NewLoc)))) {
				rt.callSrc(f, "Bump", [live(NewLoc)]);
			} else {
				obstacle = null;
				rt.forList(f, 0, live(NewLoc), T("/atom/movable"));
				while (($e = rt.next(f, 0)) !== undefined) {
					obstacle = $e;
					if ((!isEqual(live(obstacle), live(f.src)) && truthy(rt.fv(f, "density", live(obstacle))))) {
						rt.callSrc(f, "Bump", [live(obstacle)]);
						break;
					}
				}
				rt.endFor(f, 0);
			}
		}
		if (!truthy(live(areaentered))) {
			rt.callSrc(f, "Bump", [live(newarea)]);
		}
		return 0;
	}
	rt.setSv(f, "loc", live(NewLoc));
	if (truthy(live(oldloc))) {
		rt.callName(f, live(oldloc), "Exited", [live(f.src), live(NewLoc)]);
		// stress2c: Uncrossed and (below) Crossed only for the neighbours that define one (hook_list, src/vm/natives-world.ts)
		if (truthy(rt.call(f, P("/proc/isturf"), null, [live(oldloc)])) && (L = rt.call(f, P("/proc/hook_list"), null, [live(oldloc), 2])) !== null) {
			const chk = truthy(rt.call(f, P("/proc/hook_check_mode"), null, []));
			uncrossed = null;
			rt.forList(f, 0, live(L), T("/atom/movable"));
			while (($e = rt.next(f, 0)) !== undefined) {
				uncrossed = $e;
				if (!isEqual(live(uncrossed), live(f.src))) {
					sk = (chk ? rt.call(f, P("/proc/hook_skips"), null, [live(uncrossed), 2]) : 0);
					const r = rt.callName(f, live(uncrossed), "Uncrossed", [live(f.src)]);
					if (chk) rt.call(f, P("/proc/hook_check"), null, [sk, r, 2]);
				}
			}
			rt.endFor(f, 0);
		}
	}
	if ((truthy(live(areachange)) && truthy(live(oldarea)))) {
		rt.callName(f, live(oldarea), "Exited", [live(f.src), live(NewLoc)]);
	}
	rt.callName(f, live(NewLoc), "Entered", [live(f.src), live(oldloc)]);
	if (truthy(rt.call(f, P("/proc/isturf"), null, [live(NewLoc)])) && (L = rt.call(f, P("/proc/hook_list"), null, [live(NewLoc), 3])) !== null) {
		const chk = truthy(rt.call(f, P("/proc/hook_check_mode"), null, []));
		crossed = null;
		rt.forList(f, 0, live(L), T("/atom/movable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			crossed = $e;
			if (!isEqual(live(crossed), live(f.src))) {
				sk = (chk ? rt.call(f, P("/proc/hook_skips"), null, [live(crossed), 3]) : 0);
				const r = rt.callName(f, live(crossed), "Crossed", [live(f.src)]);
				if (chk) rt.call(f, P("/proc/hook_check"), null, [sk, r, 3]);
			}
		}
		rt.endFor(f, 0);
	}
	if ((truthy(live(areachange)) && truthy(live(newarea)))) {
		rt.callName(f, live(newarea), "Entered", [live(f.src), live(oldloc)]);
	}
	if ((((truthy(rt.call(f, P("/proc/isturf"), null, [live(oldloc)])) && truthy(rt.call(f, P("/proc/isturf"), null, [live(NewLoc)]))) && isEqual(rt.fv(f, "z", live(oldloc)), rt.fv(f, "z", live(NewLoc)))) && isEqual(rt.call(f, P("/proc/get_dist"), null, [live(oldloc), live(NewLoc)]), 1))) {
		return 32;
	}
	return 1;
});
