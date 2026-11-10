// Based on /tg/station's code/modules/client/message.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { P, add } = rt;


// message.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalclientmessages", function InitGlobalclientmessages(f: Frame) {
	GLOB.clientmessages = list();
	this.gvars_datum_init_order += "clientmessages";
	return f.dot;
});

// message.dm:4
rt.def("/proc/addclientmessage", function addclientmessage(f: Frame, ckey: Value, message: Value) {
	if (!(ckey = rt.call(f, P("/proc/ckey"), null, [ckey])) || !message) {
		return f.dot;
	}
	if (!rt.isIn(f, ckey, GLOB.clientmessages)) {
		rt.setAt(GLOB.clientmessages, ckey, list());
	}
	rt.modAt(GLOB.clientmessages, ckey, message, add);
	return f.dot;
});
