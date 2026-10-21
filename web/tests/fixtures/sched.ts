// sched.ts - fixture for the real-time pacing section (tests/engine-sections.ts runRealtimeCheck): the DM test_world_time.
import { rt, setG, G } from "./lib.js";
import type { Frame, Value } from "./lib.js";
const { P, g, add, subtract } = rt;

rt.globals([["slog", null]]);
rt.globalInit(function (f: Frame) {
	setG("slog", "");
});

rt.def("/proc/L", function L(f: Frame, x: Value) {
	setG("slog", add(G("slog"), rt.fmt("\uff00;", [x])));
	return f.dot;
});

rt.def("/proc/test_world_time", function* test_world_time(f: Frame) {
	let t0: Value = null, i: Value = null;
	setG("slog", "");
	t0 = rt.get(f, rt.world(), "time");
	rt.spawn(f, 3, function* (f: Frame) {
		yield* g.call(f, P("/proc/L"), null, [rt.fmt("spawn3 at \uff00", [subtract(rt.get(f, rt.world(), "time"), t0)])]);
		return null;
	});
	for (i = 1; rt.le(i, 3); i = add(i, 1)) {
		yield* g.call(f, P("/proc/sleep"), null, [1]);
		yield* g.call(f, P("/proc/L"), null, [rt.fmt("tick \uff00", [subtract(rt.get(f, rt.world(), "time"), t0)])]);
	}
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	return G("slog");
}, true);
