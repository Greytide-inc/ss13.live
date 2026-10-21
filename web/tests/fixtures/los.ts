// los.ts - fixture for the line-of-sight section (runLosCheck) and the images section (runImagesCheck, which reuses vlc_*):
// the DM tests/dm/los_helpers.dm and /turf/vl_opq from zz_view_los.dm.
import type { Frame, Value } from "./lib.js";
import { rt } from "./lib.js";
const { T, P, live, truthy, isEqual } = rt;

rt.type("/turf/vl_opq", "/turf", { opacity: 1 });
rt.type("/obj/vlc_door", "/obj", { opacity: 1 });
rt.type("/obj/vlc_thing", "/obj", {});
rt.type("/mob/vlc_mob", "/mob", {});
rt.type("/obj/vlc_box", "/obj", {});

rt.def("/proc/vlc_setup", function vlc_setup(f: Frame, C: Value) {
	let M: Value = null;
	rt.set(f, rt.world(), "maxx", 15);
	rt.set(f, rt.world(), "maxy", 15);
	for (let x = 1; x <= 15; x++) {
		for (let y = 1; y <= 15; y++) {
			const T_ = rt.locate(x, y, 1);
			rt.forList(f, 0, T_, T("/atom/movable"));
			for (let A = rt.next(f, 0); A !== undefined; A = rt.next(f, 0)) rt.set(f, live(A), "loc", null);
			rt.endFor(f, 0);
			if (x === 10 && y >= 3 && y <= 13 && y !== 8) {
				rt.new_(f, T("/turf/vl_opq"), [T_]);
			} else if (!isEqual(rt.get(f, live(T_), "type"), T("/turf"))) {
				rt.new_(f, T("/turf"), [T_]);
			}
		}
	}
	rt.new_(f, T("/obj/vlc_door"), [rt.locate(10, 8, 1)]);
	rt.new_(f, T("/obj/vlc_thing"), [rt.locate(12, 8, 1)]);
	rt.new_(f, T("/obj/vlc_thing"), [rt.locate(13, 11, 1)]);
	M = rt.new_(f, T("/mob/vlc_mob"), [rt.locate(8, 8, 1)]);
	rt.set(f, live(C), "mob", M);
	rt.set(f, live(C), "eye", M);
	rt.set(f, live(C), "view", 7);
	return M;
});

rt.def("/proc/vlc_door", function vlc_door(f: Frame, open: Value) {
	const D = rt.locateIn(f, T("/obj/vlc_door"), rt.locate(10, 8, 1));
	rt.set(f, live(D), "opacity", truthy(open) ? 0 : 1);
	return f.dot;
});

rt.def("/proc/vlc_view", function vlc_view(f: Frame, M: Value) {
	const L = rt.list();
	rt.forList(f, 0, rt.call(f, P("/proc/view"), null, [7, live(M)]), T("/turf"));
	for (let t = rt.next(f, 0); t !== undefined; t = rt.next(f, 0)) L.push(t);
	rt.endFor(f, 0);
	return L;
});

rt.def("/proc/vlc_end", function vlc_end(f: Frame, M: Value) {
	rt.set(f, live(M), "loc", null);
	rt.set(f, rt.world(), "maxx", 5);
	rt.set(f, rt.world(), "maxy", 5);
	return f.dot;
});

// eye/view centre = the outermost container's turf (mob in an obj in another obj on a turf).
rt.def("/proc/vlc_nest", function vlc_nest(f: Frame, C: Value) {
	const M = rt.get(f, live(C), "mob");
	const outer = rt.new_(f, T("/obj/vlc_box"), [rt.locate(4, 5, 1)]);
	const inner = rt.new_(f, T("/obj/vlc_box"), [outer]);
	rt.set(f, live(M), "loc", inner);
	rt.set(f, live(C), "eye", M);
	return M;
});

rt.def("/proc/vlc_nest_undo", function vlc_nest_undo(f: Frame, M: Value) {
	rt.set(f, live(M), "loc", rt.locate(8, 8, 1));
	return f.dot;
});
