// From code/_onclick/drag_drop.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /atom/proc/MouseDrop  built in (BYOND provides it)
rt.def("/atom/proc/MouseDrop", undefined, false, { args: ["over_object", "src_location", "over_location", "src_control", "over_control", "params"] });

// /atom/proc/MouseDrop  (code/_onclick/drag_drop.dm:9)  may sleep
rt.def("/atom/proc/MouseDrop", function* MouseDrop(f: Frame, over: Value, src_location: Value, over_location: Value, src_control: Value, over_control: Value, params: Value) {
	f.vars = () => [over, src_location, over_location, src_control, over_control, params];
	if ((!truthy(live(f.usr)) || !truthy(live(over)))) {
		return live(f.dot);
	}
	if (isEqual(live(over), live(f.src))) {
		return (yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "Click", [live(f.src), live(src_location), live(src_control), live(params)]));
	}
	if ((!truthy((yield* g.srcCall(f, "Adjacent", live(f.usr)))) || !truthy((yield* g.callName(f, live(over), "Adjacent", [live(f.usr)]))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(over), "MouseDrop_T", [live(f.src), live(f.usr)]);
	return live(f.dot);
}, true);
