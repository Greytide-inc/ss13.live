// From code/modules/admin/verbs/adminsay.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/cmd_admin_say  (code/modules/admin/verbs/adminsay.dm:5)
rt.def("/client/proc/cmd_admin_say", function cmd_admin_say(f: Frame, msg: Value) {
	f.vars = () => [msg];
	if (!truthy(rt.call(f, P("/proc/check_rights"), null, [0]))) {
		return live(f.dot);
	}
	if (!truthy((msg = rt.call(f, P("/proc/copytext"), null, [rt.call(f, P("/proc/sanitize"), null, [live(msg)]), 1, 1024])))) {
		return live(f.dot);
	}
	rt.call(f, P("/proc/log_adminsay"), null, [fmt("＀ : ＀", [rt.call(f, P("/proc/key_name"), null, [live(f.src)]), live(msg)])]);
	msg = rt.call(f, P("/proc/keywords_lookup"), null, [live(msg)]);
	if (truthy(rt.call(f, P("/proc/check_rights"), null, [2, 0]))) {
		msg = fmt("<span class='admin'><span class='prefix'>ADMIN:</span> <EM>＀</EM> (<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</A>): <span class='message'>＀</span></span>", [rt.call(f, P("/proc/key_name"), null, [live(f.usr), 1]), rt.sv(f, "mob"), live(msg)]);
		rt.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), live(msg)]);
	} else {
		msg = fmt("<span class='adminobserver'><span class='prefix'>ADMIN:</span> <EM>＀:</EM> <span class='message'>＀</span></span>", [rt.call(f, P("/proc/key_name"), null, [live(f.usr), 1]), live(msg)]);
		rt.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), live(msg)]);
	}
	return f.dot;
}, false, { hidden: true, verb: { name: "Asay", category: "Special Verbs" }, argTypes: [{ type: 2 }] });
