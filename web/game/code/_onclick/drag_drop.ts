// Based on /tg/station's code/_onclick/drag_drop.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// BYOND built-in.
rt.def("/atom/proc/MouseDrop", undefined, false, { args: ["over_object", "src_location", "over_location", "src_control", "over_control", "params"] });

// drag_drop.dm:9
rt.def("/atom/proc/MouseDrop", function* MouseDrop(f: Frame, over: Value, src_location: Value, over_location: Value, src_control: Value, over_control: Value, params: Value) {
	if (!f.usr || !over) {
		return f.dot;
	}
	if (over == this) {
		return (yield* f.usr.client.Click(this, src_location, src_control, params));
	}
	if (!this.Adjacent(f.usr) || !over.Adjacent(f.usr)) {
		return f.dot;
	}
	yield* over.MouseDrop_T(this, f.usr);
	return f.dot;
}, true);
