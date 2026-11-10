// Based on BYOND's Types/Icon.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// Icon.dm:21
rt.def("/icon/proc/IconStates", function IconStates(f: Frame, mode: Value) {
	mode ??= 0;
	return icon_states(this, mode);
});

// Icon.dm:40
rt.def("/proc/icon", function icon(f: Frame, icon: Value, icon_state: Value, dir: Value, frame: Value, moving: Value) {
	return new_(T("/icon"), icon, icon_state, dir, frame, moving);
});
