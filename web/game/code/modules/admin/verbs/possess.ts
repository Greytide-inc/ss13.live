// From code/modules/admin/verbs/possess.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/possess  (code/modules/admin/verbs/possess.dm:5)
rt.def("/proc/possess", function possess(f: Frame, O: Value) {
	let _T: Value = null;
	f.vars = () => [_T];
	if ((truthy(rt.fv(f, "dangerous_possession", live(O))) && truthy(rt.fv(f, "forbid_singulo_possession", rt.gl("config"))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀ is too powerful for you to possess.", [live(O)])]);
		return live(f.dot);
	}
	if (truthy((_T = rt.getStep(f, live(O), 0)))) {
		rt.call(f, P("/proc/log_admin"), null, [fmt("＀ has possessed ＀ (＀) at (＀, ＀, ＀)", [rt.call(f, P("/proc/key_name"), null, [live(f.usr)]), live(O), rt.fv(f, "type", live(O)), rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
		rt.call(f, P("/proc/message_admins"), null, [fmt("＀ has possessed ＀ (＀) at (＀, ＀, ＀)", [rt.call(f, P("/proc/key_name"), null, [live(f.usr)]), live(O), rt.fv(f, "type", live(O)), rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
	} else {
		rt.call(f, P("/proc/log_admin"), null, [fmt("＀ has possessed ＀ (＀) at an unknown location", [rt.call(f, P("/proc/key_name"), null, [live(f.usr)]), live(O), rt.fv(f, "type", live(O))])]);
		rt.call(f, P("/proc/message_admins"), null, [fmt("＀ has possessed ＀ (＀) at an unknown location", [rt.call(f, P("/proc/key_name"), null, [live(f.usr)]), live(O), rt.fv(f, "type", live(O))])]);
	}
	if (!truthy(rt.fv(f, "control_object", live(f.usr)))) {
		rt.setFv(f, "name_archive", live(f.usr), rt.fv(f, "real_name", live(f.usr)));
	}
	rt.setFv(f, "loc", live(f.usr), live(O));
	rt.setFv(f, "real_name", live(f.usr), rt.fv(f, "name", live(O)));
	rt.setFv(f, "name", live(f.usr), rt.fv(f, "name", live(O)));
	rt.setFv(f, "eye", rt.fv(f, "client", live(f.usr)), live(O));
	rt.setFv(f, "control_object", live(f.usr), live(O));
	return f.dot;
}, false, { verb: { name: "Possess Obj", category: "Object" }, argTypes: [{ type: 4, path: "/obj", source: "world" }] });

// /proc/release  (code/modules/admin/verbs/possess.dm:33)
rt.def("/proc/release", function release(f: Frame, O: Value) {
	let H: Value = null;
	f.vars = () => [H];
	if ((truthy(rt.fv(f, "control_object", live(f.usr))) && truthy(rt.fv(f, "name_archive", live(f.usr))))) {
		rt.setFv(f, "real_name", live(f.usr), rt.fv(f, "name_archive", live(f.usr)));
		rt.setFv(f, "name", live(f.usr), rt.fv(f, "real_name", live(f.usr)));
		if (truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0))) {
			rt.setFv(f, "name", (H = live(f.usr)), rt.callName(f, live(H), "get_visible_name", []));
		}
	}
	rt.setFv(f, "loc", live(f.usr), rt.fv(f, "loc", live(O)));
	rt.setFv(f, "eye", rt.fv(f, "client", live(f.usr)), live(f.usr));
	rt.setFv(f, "control_object", live(f.usr), null);
	return f.dot;
}, false, { verb: { name: "Release Obj", category: "Object" }, argTypes: [{ type: 4, path: "/obj", source: "world" }] });
