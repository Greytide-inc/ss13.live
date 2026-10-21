// ws.ts - fixture for the widescreen section (runWidescreenCheck): the DM tests/dm/ws_helpers.dm.
import type { Frame, Value } from "./lib.js";
import { rt } from "./lib.js";
const { T, P, live, isEqual } = rt;

rt.type("/mob/ws_mob", "/mob", {});

rt.def("/proc/ws_setup", function ws_setup(f: Frame, C: Value) {
	rt.set(f, rt.world(), "maxx", 31);
	rt.set(f, rt.world(), "maxy", 21);
	for (let x = 1; x <= 31; x++) {
		for (let y = 1; y <= 21; y++) {
			const T_ = rt.locate(x, y, 1);
			rt.forList(f, 0, T_, T("/atom/movable"));
			for (let A = rt.next(f, 0); A !== undefined; A = rt.next(f, 0)) rt.set(f, live(A), "loc", null);
			rt.endFor(f, 0);
			if (!isEqual(rt.get(f, live(T_), "type"), T("/turf"))) rt.new_(f, T("/turf"), [T_]);
		}
	}
	const M = rt.new_(f, T("/mob/ws_mob"), [rt.locate(16, 11, 1)]);
	rt.set(f, live(C), "mob", M);
	rt.set(f, live(C), "eye", M);
	return M;
});

rt.def("/proc/ws_set_view", function ws_set_view(f: Frame, C: Value, v: Value) {
	rt.set(f, live(C), "view", v);
	return rt.get(f, live(C), "view");
});

// Turfs of view()/range()/oview() from M with the size d, as a list.
rt.def("/proc/ws_turfs", function ws_turfs(f: Frame, M: Value, d: Value, kind: Value) {
	const L = rt.list();
	if (!["view", "range", "oview"].includes(kind as string)) return L;
	rt.forList(f, 0, rt.call(f, P(`/proc/${kind as string}`), null, [live(d), live(M)]), T("/turf"));
	for (let t = rt.next(f, 0); t !== undefined; t = rt.next(f, 0)) L.push(t);
	rt.endFor(f, 0);
	return L;
});

rt.def("/proc/ws_end", function ws_end(f: Frame, M: Value) {
	rt.set(f, live(M), "loc", null);
	rt.set(f, rt.world(), "maxx", 5);
	rt.set(f, rt.world(), "maxy", 5);
	return f.dot;
});
