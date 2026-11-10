// Based on /tg/station's code/modules/admin/verbs/adminpm.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


// adminpm.dm:8
rt.def("/client/proc/cmd_admin_pm_context", function* cmd_admin_pm_context(f: Frame, M: Value) {
	if (!this.holder) {
		to_chat(this, "<font color='red'>Error: Admin-PM-Context: Only administrators may use this command.</font>");
		return f.dot;
	}
	if (!ismob(M) || !M.client) {
		return f.dot;
	}
	yield* this.cmd_admin_pm(M.client, null);
	return f.dot;
}, true, { verb: { name: "Admin PM Mob", category: "" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// adminpm.dm:20
rt.def("/client/proc/cmd_admin_pm_panel", function* cmd_admin_pm_panel(f: Frame) {
	let _T: Value = null;
	let $e: any;
	if (!this.holder) {
		to_chat(this, "<font color='red'>Error: Admin-PM-Panel: Only administrators may use this command.</font>");
		return f.dot;
	}
	let targets: Value = rt.op(f, "CreateMultidimensionalList", [1], [0]);
	rt.op(f, "CreateTypeEnumerator", [0], [T("/client")], false);
	_T;
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (_T.mob) {
			if (rt.istype(_T.mob, T("/mob/dead/new_player"))) {
				rt.setAt(targets, `(New Player) - ${_T}`, _T);
			} else if (rt.istype(_T.mob, T("/mob/dead/observer"))) {
				rt.setAt(targets, `${_T.mob.name}(Ghost) - ${_T}`, _T);
			} else {
				rt.setAt(targets, `${_T.mob.real_name}(as ${_T.mob.name}) - ${_T}`, _T);
			}
		} else {
			rt.setAt(targets, `(No Mob) - ${_T}`, _T);
		}
	}
	rt.endFor(f, 0);
	let target: Value = (yield* g.op(f, "Prompt", [1], [null, "Admin PM", "To whom shall we send a message?", this, (yield* sortList(targets))]));
	yield* this.cmd_admin_pm(rt.index(targets, target), null);
	return f.dot;
}, true, { verb: { name: "Admin PM", category: "Admin" } });

// adminpm.dm:39
rt.def("/client/proc/cmd_ahelp_reply", function* cmd_ahelp_reply(f: Frame, whom: Value) {
	let C: Value = null, AH: Value = null, msg: Value = null;
	if (rt.bitAnd(this.prefs.muted, 8)) {
		to_chat(this, "<font color='red'>Error: Admin-PM: You are unable to use admin PM-s (muted).</font>");
		return f.dot;
	}
	if (istext(whom)) {
		if (cmptext(copytext(whom, 1, 2), "@")) {
			whom = this.findStealthKey(whom);
		}
		C = rt.index(GLOB.directory, whom);
	} else if (rt.istype(whom, T("/client"))) {
		C = whom;
	}
	if (!C) {
		if (this.holder) {
			to_chat(this, "<font color='red'>Error: Admin-PM: Client not found.</font>");
		}
		return f.dot;
	}
	if (AH = C.current_ticket) {
		message_admins(`${key_name_admin(this)} has started replying to ${key_name(C, 0, 0)}'s admin help.`);
	}
	if (!(msg = (yield* g.op(f, "Prompt", [3], [null, `Private message to ${key_name(C, 0, 0)}`, "Message:", this, null])))) {
		message_admins(`${key_name_admin(this)} has cancelled their reply to ${key_name(C, 0, 0)}'s admin help.`);
		return f.dot;
	}
	yield* this.cmd_admin_pm(whom, msg);
	return f.dot;
}, true);

// adminpm.dm:67
rt.def("/client/proc/cmd_admin_pm", function* cmd_admin_pm(f: Frame, whom: Value, msg: Value) {
	let recipient: Value = null, AH: Value = null, interaction_message: Value = null, replymsg: Value = null, sender: Value = null, sendername: Value = null, reply: Value = null, X: Value = null;
	let $e: any;
	if (rt.bitAnd(this.prefs.muted, 8)) {
		to_chat(this, "<font color='red'>Error: Admin-PM: You are unable to use admin PM-s (muted).</font>");
		return f.dot;
	}
	if (!this.holder && !this.current_ticket) {
		to_chat(this, "<font color='red'>You can no longer reply to this ticket, please open another one by using the Adminhelp verb if need be.</font>");
		to_chat(this, `<font color='blue'>Message: ${msg}</font>`);
		return f.dot;
	}
	if (istext(whom)) {
		if (cmptext(copytext(whom, 1, 2), "@")) {
			whom = this.findStealthKey(whom);
		}
		recipient = rt.index(GLOB.directory, whom);
	} else if (rt.istype(whom, T("/client"))) {
		recipient = whom;
	}
	{
		if (!recipient) {
			if (this.holder) {
				to_chat(this, "<font color='red'>Error: Admin-PM: Client not found.</font>");
				to_chat(this, msg);
			} else {
				this.current_ticket.MessageNoRecipient(msg);
			}
			return f.dot;
		}
		if (!msg) {
			if (!(msg = (yield* g.op(f, "Prompt", [3], [null, `Private message to ${key_name(recipient, 0, 0)}`, "Message:", this, null])))) {
				return f.dot;
			}
			if (rt.bitAnd(this.prefs.muted, 8)) {
				to_chat(this, "<font color='red'>Error: Admin-PM: You are unable to use admin PM-s (muted).</font>");
				return f.dot;
			}
			if (!recipient) {
				if (this.holder) {
					to_chat(this, "<font color='red'>Error: Admin-PM: Client not found.</font>");
				} else {
					this.current_ticket.MessageNoRecipient(msg);
				}
				return f.dot;
			}
		}
	}
	if (this.handle_spam_prevention(msg, 8)) {
		return f.dot;
	}
	if (!check_rights(48, 0)) {
		if (!(msg = sanitize(copytext(msg, 1, 1024)))) {
			return f.dot;
		}
	}
	let rawmsg: Value = msg;
	if (this.holder) {
		msg = emoji_parse(msg);
	}
	let keywordparsedmsg: Value = keywords_lookup(msg);
	{
		if (recipient.holder) {
			if (this.holder) {
				to_chat(recipient, `<font color='red'>Admin PM from-<b>${key_name(this, recipient, 1)}</b>: ${keywordparsedmsg}</font>`);
				to_chat(this, `<font color='blue'>Admin PM to-<b>${key_name(recipient, this, 1)}</b>: ${keywordparsedmsg}</font>`);
				interaction_message = `<font color='purple'>PM from-<b>${key_name(this, recipient, 1)}</b> to-<b>${key_name(recipient, this, 1)}</b>: ${keywordparsedmsg}</font>`;
				admin_ticket_log(this, interaction_message);
				if (recipient != this) {
					admin_ticket_log(recipient, interaction_message);
				}
			} else {
				replymsg = `<font color='red'>Reply PM from-<b>${key_name(this, recipient, 1)}</b>: ${keywordparsedmsg}</font>`;
				admin_ticket_log(this, replymsg);
				to_chat(recipient, replymsg);
				to_chat(this, `<font color='blue'>PM to-<b>Admins</b>: ${msg}</font>`);
			}
			if (rt.bitAnd(recipient.prefs.toggles, 1)) {
				rt.op(f, "Output", [], [recipient, rt.rsc("sound/effects/adminhelp.ogg")], false);
			}
		} else if (this.holder) {
			if (!recipient.current_ticket) {
				yield* new_(T("/datum/admin_help"), msg, recipient, 1);
			}
			to_chat(recipient, "<font color='red' size='4'><b>-- Administrator private message --</b></font>");
			to_chat(recipient, `<font color='red'>Admin PM from-<b>${key_name(this, recipient, 0)}</b>: ${msg}</font>`);
			to_chat(recipient, "<font color='red'><i>Click on the administrator's name to reply.</i></font>");
			to_chat(this, `<font color='blue'>Admin PM to-<b>${key_name(recipient, this, 1)}</b>: ${msg}</font>`);
			admin_ticket_log(recipient, `<font color='blue'>PM From ${key_name_admin(this)}: ${keywordparsedmsg}</font>`);
			rt.op(f, "Output", [], [recipient, rt.rsc("sound/effects/adminhelp.ogg")], false);
			if (GLOB.config.popup_admin_pm) {
				rt.spawnTail(f, 0, "/client/proc/cmd_admin_pm: spawn at modules/admin/verbs/adminpm.dm:189", whom, msg, recipient, rawmsg, keywordparsedmsg, AH, interaction_message, replymsg, sender, sendername, reply, X);
			}
		} else {
			to_chat(this, "<font color='red'>Error: Admin-PM: Non-admin to non-admin PM communication is forbidden.</font>");
			return f.dot;
		}
	}
	{
		yield* window_flash(recipient, { ignorepref: 1 });
		log_admin_private(`PM: ${key_name(this)}->${key_name(recipient)}: ${rawmsg}`);
		for (X of each(GLOB.admins, T("/client"))) {
			if (X.key != this.key && X.key != recipient.key) {
				to_chat(X, `<font color='blue'><B>PM: ${key_name(this, X, 0)}-&gt;${key_name(recipient, X, 0)}:</B> ${keywordparsedmsg}</font>`);
			}
		}
	}
	return f.dot;
}, true);

// a spawn(0) body of /client/proc/cmd_admin_pm, a named tail so a world snapshot can hold it while it waits.
rt.tail("/client/proc/cmd_admin_pm: spawn at modules/admin/verbs/adminpm.dm:189", function* (f: Frame, whom: Value, msg: Value, recipient: Value, rawmsg: Value, keywordparsedmsg: Value, AH: Value, interaction_message: Value, replymsg: Value, sender: Value, sendername: Value, reply: Value, X: Value) {
	sender = this;
	sendername = this.key;
	reply = (yield* g.op(f, "Prompt", [3], ["", `Admin PM from-${sendername}`, msg, recipient, null]));
	if (recipient && reply) {
		if (sender) {
			yield* recipient.cmd_admin_pm(sender, reply);
		} else {
			yield* this.adminhelp(reply);
		}
	}
	return f.dot;
});
