// Based on /tg/station's code/__HELPERS/AStar.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


rt.type(4411, "/PathNode", "/datum", {
	source: null,
	prevNode: null,
	f: null,
	g: null,
	h: null,
	nt: null,
});

// AStar.dm:41
rt.def("/PathNode/proc/New", function New(f: Frame, s: Value, p: Value, pg: Value, ph: Value, pnt: Value) {
	this.source = s;
	this.prevNode = p;
	this.g = pg;
	this.h = ph;
	this.f = this.g + this.h;
	this.nt = pnt;
	return f.dot;
});

// AStar.dm:49
rt.def("/PathNode/proc/calc_f", function calc_f(f: Frame) {
	this.f = this.g + this.h;
	return f.dot;
});

// AStar.dm:61
rt.def("/proc/HeapPathWeightCompare", function HeapPathWeightCompare(f: Frame, a: Value, b: Value) {
	return b.f - a.f;
}, false, { argTypes: [{ path: "/PathNode" }, { path: "/PathNode" }] });

// AStar.dm:65
rt.def("/proc/get_path_to", function* get_path_to(f: Frame, caller: Value, end: Value, dist: Value, maxnodes: Value, maxnodedepth: Value, mintargetdist: Value, adjacent: Value, id: Value, exclude: Value, simulated_only: Value) {
	let path: Value = null;
	maxnodedepth ??= 30;
	adjacent ??= P("/turf/proc/reachableAdjacentTurfs");
	simulated_only ??= 1;
	if (!(path = (yield* AStar(caller, end, dist, maxnodes, maxnodedepth, mintargetdist, adjacent, id, exclude, simulated_only)))) {
		path = list();
	}
	return path;
}, true);

// AStar.dm:72
rt.def("/proc/AStar", function* AStar(f: Frame, caller: Value, end: Value, dist: Value, maxnodes: Value, maxnodedepth: Value, mintargetdist: Value, adjacent: Value, id: Value, exclude: Value, simulated_only: Value) {
	let start: Value = null, path: Value = null, cur: Value = null, closeenough: Value = null, L: Value = null, _T: Value = null, newg: Value = null, _P: Value = null, newnode: Value = null, i: Value = null;
	maxnodedepth ??= 30;
	adjacent ??= P("/turf/proc/reachableAdjacentTurfs");
	simulated_only ??= 1;
	let pnodelist: Value = list();
	if (!(start = rt.getStep(f, caller, 0))) {
		return 0;
	}
	if (maxnodes) {
		if ((yield* g.callDyn(f, start, dist, [end])) > maxnodes) {
			return 0;
		}
		maxnodedepth = maxnodes;
	}
	let open: Value = (yield* new_(T("/Heap"), P("/proc/HeapPathWeightCompare")));
	let closed: Value = (yield* new_(T("/list")));
	yield* open.Insert((yield* new_(T("/PathNode"), start, null, 0, (yield* g.callDyn(f, start, dist, [end])), 0)));
	while (!open.IsEmpty() && !path) {
		cur = (yield* open.Pop());
		closed.Add(cur.source);
		closeenough = null;
		if (mintargetdist) {
			closeenough = ((yield* g.callDyn(f, cur.source, dist, [end])) <= mintargetdist ? 1 : 0);
		}
		if (maxnodedepth && cur.nt > maxnodedepth) {
			continue;
		}
		if (cur.source == end || closeenough) {
			(path = (yield* new_(T("/list")))).Add(cur.source);
			while (cur.prevNode) {
				cur = cur.prevNode;
				path.Add(cur.source);
			}
			break;
		}
		L = (yield* g.callDyn(f, cur.source, adjacent, [caller, id, simulated_only]));
		_T = null;
		for (_T of each(L, T("/turf"))) {
			if (_T == exclude || rt.isIn(f, _T, closed)) {
				continue;
			}
			newg = cur.g + (yield* g.callDyn(f, cur.source, dist, [_T]));
			if (!(_P = rt.index(pnodelist, _T))) {
				newnode = (yield* new_(T("/PathNode"), _T, cur, newg, (yield* g.callDyn(f, _T, dist, [end])), cur.nt + 1));
				yield* open.Insert(newnode);
				rt.setAt(pnodelist, _T, newnode);
			} else if (newg < _P.g) {
				_P.prevNode = cur;
				_P.g = newg * rt.len(f, L) / 9;
				_P.calc_f();
				_P.nt = cur.nt + 1;
				yield* open.ReSort(_P);
			}
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	pnodelist = null;
	if (path) {
		i = 1;
		while (i <= rt.len(f, path) / 2) {
			path.Swap(i, rt.len(f, path) - i + 1);
			i++;
		}
	}
	return path;
}, true);

// AStar.dm:155
rt.def("/turf/proc/reachableAdjacentTurfs", function reachableAdjacentTurfs(f: Frame, caller: Value, ID: Value, simulated_only: Value) {
	let _T: Value = null, dir: Value = null;
	let L: Value = new_(T("/list"));
	for (dir of each(GLOB.cardinal)) {
		_T = rt.getStep(f, this, dir);
		if (simulated_only && !rt.istype(_T, T("/turf"))) {
			continue;
		}
		if (!_T.density && !this.LinkBlockedWithAccess(_T, caller, ID)) {
			L.Add(_T);
		}
	}
	return L;
});

// AStar.dm:171
rt.def("/turf/proc/LinkBlockedWithAccess", function LinkBlockedWithAccess(f: Frame, _T: Value, caller: Value, ID: Value) {
	let W: Value = null, O: Value = null;
	let adir: Value = rt.getDir(f, this, _T);
	let rdir: Value = rt.getDir(f, _T, this);
	for (W of each(this, T("/obj/structure/window"))) {
		if (!W.CanAStarPass(ID, adir)) {
			return 1;
		}
	}
	for (O of each(_T, T("/obj"))) {
		if (!O.CanAStarPass(ID, rdir, caller)) {
			return 1;
		}
	}
	return 0;
});
