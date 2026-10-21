// From code/game/objects/effects/spawners/vaultspawner.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11946, "/obj/effect/vaultspawner", "/obj/effect", {
	maxX: 6,
	maxY: 6,
	minX: 2,
	minY: 2,
});

// /obj/effect/vaultspawner/proc/New  (code/game/objects/effects/spawners/vaultspawner.dm:8)  may sleep
rt.def("/obj/effect/vaultspawner/proc/New", function* New(f: Frame, location: Value, lX: Value, uX: Value, lY: Value, uY: Value, type: Value) {
	let lowBoundX: Value = null, lowBoundY: Value = null, hiBoundX: Value = null, hiBoundY: Value = null, z: Value = null, i: Value = null, j: Value = null, _T: Value = null;
	f.vars = () => [location, lX, uX, lY, uY, type, lowBoundX, lowBoundY, hiBoundX, hiBoundY, z, i, j, _T];
	if (live(lX) === null) {
		lX = rt.sv(f, "minX");
	}
	if (live(uX) === null) {
		uX = rt.sv(f, "maxX");
	}
	if (live(lY) === null) {
		lY = rt.sv(f, "minY");
	}
	if (live(uY) === null) {
		uY = rt.sv(f, "maxY");
	}
	if (live(type) === null) {
		type = null;
	}
	if (!truthy(live(type))) {
		type = rt.op(f, "PickUnweighted", [3], ["sandstone", "rock", "alien"]);
	}
	lowBoundX = rt.fv(f, "x", live(location));
	lowBoundY = rt.fv(f, "y", live(location));
	hiBoundX = add(rt.fv(f, "x", live(location)), (yield* g.call(f, P("/proc/rand"), null, [live(lX), live(uX)])));
	hiBoundY = add(rt.fv(f, "y", live(location)), (yield* g.call(f, P("/proc/rand"), null, [live(lY), live(uY)])));
	z = rt.fv(f, "z", live(location));
	i = null;
	i = live(lowBoundX);
	while (rt.le(live(i), live(hiBoundX))) {
		j = null;
		j = live(lowBoundY);
		while (rt.le(live(j), live(hiBoundY))) {
			_T = rt.locate(live(i), live(j), live(z));
			if ((((isEqual(live(i), live(lowBoundX)) || isEqual(live(i), live(hiBoundX))) || isEqual(live(j), live(lowBoundY))) || isEqual(live(j), live(hiBoundY)))) {
				yield* g.callName(f, live(_T), "ChangeTurf", [T("/turf/closed/wall/vault")]);
			} else {
				yield* g.callName(f, live(_T), "ChangeTurf", [T("/turf/open/floor/vault")]);
			}
			rt.setFv(f, "icon_state", live(_T), fmt("＀vault", [live(type)]));
			j = rt.inc(live(j), 1);
		}
		i = rt.inc(live(i), 1);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
