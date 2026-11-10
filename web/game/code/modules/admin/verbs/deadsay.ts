// Based on /tg/station's code/modules/admin/verbs/deadsay.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// deadsay.dm:5
rt.def("/client/proc/dsay", function dsay(f: Frame, msg: Value) {
	let M: Value = null;
	let $0: any, $e: any;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	if (!this.mob) {
		return f.dot;
	}
	if (rt.bitAnd(this.prefs.muted, 16)) {
		to_chat(this, "<span class='danger'>You cannot send DSAY messages (muted).</span>");
		return f.dot;
	}
	if (this.handle_spam_prevention(msg, 16)) {
		return f.dot;
	}
	msg = copytext(sanitize(msg), 1, 1024);
	log_dsay(`${key_name(this)} : ${msg}`);
	if (!msg) {
		return f.dot;
	}
	if (this.holder.fakekey) {
		$0 = pick(GLOB.nicknames);
	} else {
		$0 = this.key;
	}
	let rendered: Value = `<span class='game deadsay'><span class='prefix'>DEAD:</span> <span class='name'>ADMIN(${$0})</span> says, <span class='message'>"${msg}"</span></span>`;
	for (M of each(GLOB.player_list, T("/mob"))) {
		if (rt.istype(M, T("/mob/dead/new_player"))) {
			continue;
		}
		if (M.stat == 2 || M.client && M.client.holder && rt.bitAnd(M.client.prefs.chat_toggles, 2)) {
			M.show_message(rendered, 2);
		}
	}
	return f.dot;
}, false, { hidden: true, verb: { name: "Dsay", category: "Special Verbs" }, argTypes: [{ type: 2 }] });
