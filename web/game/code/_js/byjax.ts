// Based on /tg/station's code/_js/byjax.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// byjax.dm:38
rt.def("/proc/send_byjax", function send_byjax(f: Frame, receiver: Value, control_id: Value, target_element: Value, new_content: Value, callback: Value, callback_args: Value) {
	let argums: Value = null;
	if (receiver && target_element && control_id) {
		argums = list(target_element, new_content);
		if (callback) {
			argums += callback;
			if (callback_args) {
				argums += callback_args;
			}
		}
		argums = list2params(argums);
		rt.op(f, "OutputControl", [], [receiver, argums, `${control_id}:replaceContent`], false);
	}
	return f.dot;
});
