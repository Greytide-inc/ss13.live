// Based on /tg/station's code/modules/admin/verbs/adminsay.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { fmt } = rt;


// adminsay.dm:5
rt.def("/client/proc/cmd_admin_say", function cmd_admin_say(f: Frame, msg: Value) {
	if (!check_rights(0)) {
		return f.dot;
	}
	if (!(msg = copytext(sanitize(msg), 1, 1024))) {
		return f.dot;
	}
	log_adminsay(`${key_name(this)} : ${msg}`);
	msg = keywords_lookup(msg);
	if (check_rights(2, 0)) {
		msg = fmt("<span class='admin'><span class='prefix'>ADMIN:</span> <EM>＀</EM> (<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</A>): <span class='message'>＀</span></span>", [key_name(f.usr, 1), this.mob, msg]);
		to_chat(GLOB.admins, msg);
	} else {
		msg = `<span class='adminobserver'><span class='prefix'>ADMIN:</span> <EM>${key_name(f.usr, 1)}:</EM> <span class='message'>${msg}</span></span>`;
		to_chat(GLOB.admins, msg);
	}
	return f.dot;
}, false, { hidden: true, verb: { name: "Asay", category: "Special Verbs" }, argTypes: [{ type: 2 }] });
