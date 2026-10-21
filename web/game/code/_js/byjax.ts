// From code/_js/byjax.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/send_byjax  (code/_js/byjax.dm:38)
rt.def("/proc/send_byjax", function send_byjax(f: Frame, receiver: Value, control_id: Value, target_element: Value, new_content: Value, callback: Value, callback_args: Value) {
	let argums: Value = null;
	f.vars = () => [new_content, callback, callback_args, argums];
	if (live(new_content) === null) {
		new_content = null;
	}
	if (live(callback) === null) {
		callback = null;
	}
	if (live(callback_args) === null) {
		callback_args = null;
	}
	if (((truthy(live(receiver)) && truthy(live(target_element))) && truthy(live(control_id)))) {
		argums = rt.list(live(target_element), live(new_content));
		if (truthy(live(callback))) {
			argums = rt.modify(live(argums), live(callback), add);
			if (truthy(live(callback_args))) {
				argums = rt.modify(live(argums), live(callback_args), add);
			}
		}
		argums = rt.call(f, P("/proc/list2params"), null, [live(argums)]);
		rt.op(f, "OutputControl", [], [live(receiver), live(argums), fmt("＀:replaceContent", [live(control_id)])], false);
	}
	return live(f.dot);
});
