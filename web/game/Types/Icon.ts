// From Types/Icon.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /icon/proc/IconStates  (Types/Icon.dm:21)
rt.def("/icon/proc/IconStates", function IconStates(f: Frame, mode: Value) {
	f.vars = () => [mode];
	if (live(mode) === null) {
		mode = 0;
	}
	return rt.call(f, P("/proc/icon_states"), null, [live(f.src), live(mode)]);
});

// /proc/icon  (Types/Icon.dm:40)
rt.def("/proc/icon", function icon(f: Frame, icon: Value, icon_state: Value, dir: Value, frame: Value, moving: Value) {
	return rt.new_(f, T("/icon"), [live(icon), live(icon_state), live(dir), live(frame), live(moving)]);
});
