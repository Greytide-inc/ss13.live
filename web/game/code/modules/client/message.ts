// From code/modules/client/message.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalclientmessages  (code/modules/client/message.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalclientmessages", function InitGlobalclientmessages(f: Frame) {
	rt.setGl("clientmessages", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "clientmessages", add);
	return f.dot;
});

// /proc/addclientmessage  (code/modules/client/message.dm:4)
rt.def("/proc/addclientmessage", function addclientmessage(f: Frame, ckey: Value, message: Value) {
	f.vars = () => [ckey];
	if ((!truthy((ckey = rt.call(f, P("/proc/ckey"), null, [live(ckey)]))) || !truthy(live(message)))) {
		return live(f.dot);
	}
	if (!truthy((rt.isIn(f, live(ckey), rt.gl("clientmessages")) ? 1 : 0))) {
		rt.setAt(rt.gl("clientmessages"), live(ckey), rt.list());
	}
	rt.modAt(rt.gl("clientmessages"), live(ckey), live(message), add);
	return f.dot;
});
