// From code/datums/helper_datums/icon_snapshot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1046, "/datum/icon_snapshot", "/datum", {
	name: null,
	icon: null,
	icon_state: null,
	overlays: null,
});

// /datum/icon_snapshot/proc/makeImg  (code/datums/helper_datums/icon_snapshot.dm:8)  may sleep
rt.def("/datum/icon_snapshot/proc/makeImg", function* makeImg(f: Frame) {
	let temp: Value = null, tempicon: Value = null;
	f.vars = () => [temp, tempicon];
	if ((!truthy(rt.sv(f, "icon")) || !truthy(rt.sv(f, "icon_state")))) {
		return live(f.dot);
	}
	rt.setFv(f, "icon", (temp = (yield* g.new_(f, T("/obj"), []))), rt.sv(f, "icon"));
	rt.setFv(f, "icon_state", live(temp), rt.sv(f, "icon_state"));
	rt.setFv(f, "overlays", live(temp), (yield* g.callName(f, rt.sv(f, "overlays"), "Copy", [])));
	return (tempicon = (yield* g.call(f, P("/proc/getFlatIcon"), null, [live(temp)])));
}, true);
