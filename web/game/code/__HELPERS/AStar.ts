// From code/__HELPERS/AStar.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4411, "/PathNode", "/datum", {
	source: null,
	prevNode: null,
	f: null,
	g: null,
	h: null,
	nt: null,
});

// /PathNode/proc/New  (code/__HELPERS/AStar.dm:41)
rt.def("/PathNode/proc/New", function New(f: Frame, s: Value, p: Value, pg: Value, ph: Value, pnt: Value) {
	rt.setSv(f, "source", live(s));
	rt.setSv(f, "prevNode", live(p));
	rt.setSv(f, "g", live(pg));
	rt.setSv(f, "h", live(ph));
	rt.setSv(f, "f", add(rt.sv(f, "g"), rt.sv(f, "h")));
	rt.setSv(f, "nt", live(pnt));
	return f.dot;
});

// /PathNode/proc/calc_f  (code/__HELPERS/AStar.dm:49)
rt.def("/PathNode/proc/calc_f", function calc_f(f: Frame) {
	rt.setSv(f, "f", add(rt.sv(f, "g"), rt.sv(f, "h")));
	return f.dot;
});

// /proc/PathWeightCompare  (code/__HELPERS/AStar.dm:57)
rt.def("/proc/PathWeightCompare", function PathWeightCompare(f: Frame, a: Value, b: Value) {
	return subtract(rt.fv(f, "f", live(a)), rt.fv(f, "f", live(b)));
});

// /proc/HeapPathWeightCompare  (code/__HELPERS/AStar.dm:61)
rt.def("/proc/HeapPathWeightCompare", function HeapPathWeightCompare(f: Frame, a: Value, b: Value) {
	return subtract(rt.fv(f, "f", live(b)), rt.fv(f, "f", live(a)));
}, false, { argTypes: [{ path: "/PathNode" }, { path: "/PathNode" }] });

// /proc/get_path_to  (code/__HELPERS/AStar.dm:65)  may sleep
rt.def("/proc/get_path_to", function* get_path_to(f: Frame, caller: Value, end: Value, dist: Value, maxnodes: Value, maxnodedepth: Value, mintargetdist: Value, adjacent: Value, id: Value, exclude: Value, simulated_only: Value) {
	let path: Value = null;
	f.vars = () => [caller, end, dist, maxnodes, maxnodedepth, mintargetdist, adjacent, id, exclude, simulated_only, path];
	if (live(maxnodedepth) === null) {
		maxnodedepth = 30;
	}
	if (live(adjacent) === null) {
		adjacent = P("/turf/proc/reachableAdjacentTurfs");
	}
	if (live(id) === null) {
		id = null;
	}
	if (live(exclude) === null) {
		exclude = null;
	}
	if (live(simulated_only) === null) {
		simulated_only = 1;
	}
	if (!truthy((path = (yield* g.call(f, P("/proc/AStar"), null, [live(caller), live(end), live(dist), live(maxnodes), live(maxnodedepth), live(mintargetdist), live(adjacent), live(id), live(exclude), live(simulated_only)]))))) {
		path = rt.list();
	}
	return live(path);
}, true);

// /proc/AStar  (code/__HELPERS/AStar.dm:72)  may sleep
rt.def("/proc/AStar", function* AStar(f: Frame, caller: Value, end: Value, dist: Value, maxnodes: Value, maxnodedepth: Value, mintargetdist: Value, adjacent: Value, id: Value, exclude: Value, simulated_only: Value) {
	let pnodelist: Value = null, start: Value = null, open: Value = null, closed: Value = null, path: Value = null, cur: Value = null, closeenough: Value = null, L: Value = null, _T: Value = null, newg: Value = null, _P: Value = null, newnode: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [caller, end, dist, maxnodes, maxnodedepth, mintargetdist, adjacent, id, exclude, simulated_only, pnodelist, start, open, closed, path, cur, closeenough, L, _T, newg, _P, newnode, i, $e];
	if (live(maxnodedepth) === null) {
		maxnodedepth = 30;
	}
	if (live(adjacent) === null) {
		adjacent = P("/turf/proc/reachableAdjacentTurfs");
	}
	if (live(id) === null) {
		id = null;
	}
	if (live(exclude) === null) {
		exclude = null;
	}
	if (live(simulated_only) === null) {
		simulated_only = 1;
	}
	pnodelist = rt.list();
	if (!truthy((start = rt.getStep(f, live(caller), 0)))) {
		return 0;
	}
	if (truthy(live(maxnodes))) {
		if (rt.gt((yield* g.callDyn(f, live(start), live(dist), [live(end)])), live(maxnodes))) {
			return 0;
		}
		maxnodedepth = live(maxnodes);
	}
	open = (yield* g.new_(f, T("/Heap"), [P("/proc/HeapPathWeightCompare")]));
	closed = (yield* g.new_(f, T("/list"), []));
	path = null;
	cur = null;
	yield* g.callName(f, live(open), "Insert", [(yield* g.new_(f, T("/PathNode"), [live(start), null, 0, (yield* g.callDyn(f, live(start), live(dist), [live(end)])), 0]))]);
	while (!truthy((yield* g.callName(f, live(open), "IsEmpty", []))) && !truthy(live(path))) {
		cur = (yield* g.callName(f, live(open), "Pop", []));
		yield* g.callName(f, live(closed), "Add", [rt.fv(f, "source", live(cur))]);
		closeenough = null;
		if (truthy(live(mintargetdist))) {
			closeenough = (rt.le((yield* g.callDyn(f, rt.fv(f, "source", live(cur)), live(dist), [live(end)])), live(mintargetdist)) ? 1 : 0);
		}
		if ((truthy(live(maxnodedepth)) && rt.gt(rt.fv(f, "nt", live(cur)), live(maxnodedepth)))) {
			continue;
		}
		if ((isEqual(rt.fv(f, "source", live(cur)), live(end)) || truthy(live(closeenough)))) {
			yield* g.callName(f, (path = (yield* g.new_(f, T("/list"), []))), "Add", [rt.fv(f, "source", live(cur))]);
			while (truthy(rt.fv(f, "prevNode", live(cur)))) {
				cur = rt.fv(f, "prevNode", live(cur));
				yield* g.callName(f, live(path), "Add", [rt.fv(f, "source", live(cur))]);
			}
			break;
		}
		L = (yield* g.callDyn(f, rt.fv(f, "source", live(cur)), live(adjacent), [live(caller), live(id), live(simulated_only)]));
		_T = null;
		rt.forList(f, 0, live(L), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			if ((isEqual(live(_T), live(exclude)) || truthy((rt.isIn(f, live(_T), live(closed)) ? 1 : 0)))) {
				continue;
			}
			newg = add(rt.fv(f, "g", live(cur)), (yield* g.callDyn(f, rt.fv(f, "source", live(cur)), live(dist), [live(_T)])));
			if (!truthy((_P = rt.index(live(pnodelist), live(_T))))) {
				newnode = (yield* g.new_(f, T("/PathNode"), [live(_T), live(cur), live(newg), (yield* g.callDyn(f, live(_T), live(dist), [live(end)])), add(rt.fv(f, "nt", live(cur)), 1)]));
				yield* g.callName(f, live(open), "Insert", [live(newnode)]);
				rt.setAt(live(pnodelist), live(_T), live(newnode));
			} else {
				if (rt.lt(live(newg), rt.fv(f, "g", live(_P)))) {
					rt.setFv(f, "prevNode", live(_P), live(cur));
					rt.setFv(f, "g", live(_P), divide(multiply(live(newg), rt.len(f, live(L))), 9));
					yield* g.callName(f, live(_P), "calc_f", []);
					rt.setFv(f, "nt", live(_P), add(rt.fv(f, "nt", live(cur)), 1));
					yield* g.callName(f, live(open), "ReSort", [live(_P)]);
				}
			}
		}
		rt.endFor(f, 0);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	pnodelist = null;
	if (truthy(live(path))) {
		i = null;
		i = 1;
		while (rt.le(live(i), divide(rt.len(f, live(path)), 2))) {
			yield* g.callName(f, live(path), "Swap", [live(i), add(subtract(rt.len(f, live(path)), live(i)), 1)]);
			i = rt.inc(live(i), 1);
		}
	}
	return live(path);
}, true);

// /turf/proc/reachableAdjacentTurfs  (code/__HELPERS/AStar.dm:155)
rt.def("/turf/proc/reachableAdjacentTurfs", function reachableAdjacentTurfs(f: Frame, caller: Value, ID: Value, simulated_only: Value) {
	let L: Value = null, _T: Value = null, dir: Value = null;
	let $e: any;
	f.vars = () => [L, _T, dir, $e];
	L = rt.new_(f, T("/list"), []);
	_T = null;
	dir = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		dir = $e;
		_T = rt.getStep(f, live(f.src), live(dir));
		if ((truthy(live(simulated_only)) && !truthy((rt.istype(live(_T), T("/turf")) ? 1 : 0)))) {
			continue;
		}
		if ((!truthy(rt.fv(f, "density", live(_T))) && !truthy(rt.callSrc(f, "LinkBlockedWithAccess", [live(_T), live(caller), live(ID)])))) {
			rt.callName(f, live(L), "Add", [live(_T)]);
		}
	}
	rt.endFor(f, 0);
	return live(L);
});

// /turf/proc/LinkBlockedWithAccess  (code/__HELPERS/AStar.dm:171)
rt.def("/turf/proc/LinkBlockedWithAccess", function LinkBlockedWithAccess(f: Frame, _T: Value, caller: Value, ID: Value) {
	let adir: Value = null, rdir: Value = null, W: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [adir, rdir, W, O, $e];
	adir = rt.getDir(f, live(f.src), live(_T));
	rdir = rt.getDir(f, live(_T), live(f.src));
	W = null;
	rt.forList(f, 0, live(f.src), T("/obj/structure/window"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		if (!truthy(rt.callName(f, live(W), "CanAStarPass", [live(ID), live(adir)]))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	O = null;
	rt.forList(f, 0, live(_T), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (!truthy(rt.callName(f, live(O), "CanAStarPass", [live(ID), live(rdir), live(caller)]))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});
