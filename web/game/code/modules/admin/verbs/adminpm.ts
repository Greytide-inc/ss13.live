// From code/modules/admin/verbs/adminpm.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/cmd_admin_pm_context  (code/modules/admin/verbs/adminpm.dm:8)  may sleep
rt.def("/client/proc/cmd_admin_pm_context", function* cmd_admin_pm_context(f: Frame, M: Value) {
	f.vars = () => [M];
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<font color='red'>Error: Admin-PM-Context: Only administrators may use this command.</font>"]);
		return live(f.dot);
	}
	if ((!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(M)]))) || !truthy(rt.fv(f, "client", live(M))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "cmd_admin_pm", rt.fv(f, "client", live(M)), null);
	return f.dot;
}, true, { verb: { name: "Admin PM Mob", category: "" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// /client/proc/cmd_admin_pm_panel  (code/modules/admin/verbs/adminpm.dm:20)  may sleep
rt.def("/client/proc/cmd_admin_pm_panel", function* cmd_admin_pm_panel(f: Frame) {
	let targets: Value = null, _T: Value = null, target: Value = null;
	let $e: any;
	f.vars = () => [targets, _T, target, $e];
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<font color='red'>Error: Admin-PM-Panel: Only administrators may use this command.</font>"]);
		return live(f.dot);
	}
	targets = rt.op(f, "CreateMultidimensionalList", [1], [0]);
	_T = null;
	rt.op(f, "CreateTypeEnumerator", [0], [T("/client")], false);
	live(_T);
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy(rt.fv(f, "mob", live(_T)))) {
			if (truthy((rt.istype(rt.fv(f, "mob", live(_T)), T("/mob/dead/new_player")) ? 1 : 0))) {
				rt.setAt(live(targets), fmt("(New Player) - ＀", [live(_T)]), live(_T));
			} else {
				if (truthy((rt.istype(rt.fv(f, "mob", live(_T)), T("/mob/dead/observer")) ? 1 : 0))) {
					rt.setAt(live(targets), fmt("＀(Ghost) - ＀", [rt.gv(f, "name", rt.fv(f, "mob", live(_T))), live(_T)]), live(_T));
				} else {
					rt.setAt(live(targets), fmt("＀(as ＀) - ＀", [rt.gv(f, "real_name", rt.fv(f, "mob", live(_T))), rt.gv(f, "name", rt.fv(f, "mob", live(_T))), live(_T)]), live(_T));
				}
			}
		} else {
			rt.setAt(live(targets), fmt("(No Mob) - ＀", [live(_T)]), live(_T));
		}
	}
	rt.endFor(f, 0);
	target = (yield* g.op(f, "Prompt", [1], [null, "Admin PM", "To whom shall we send a message?", live(f.src), (yield* g.call(f, P("/proc/sortList"), null, [live(targets)]))]));
	yield* g.srcCall(f, "cmd_admin_pm", rt.index(live(targets), live(target)), null);
	return f.dot;
}, true, { verb: { name: "Admin PM", category: "Admin" } });

// /client/proc/cmd_ahelp_reply  (code/modules/admin/verbs/adminpm.dm:39)  may sleep
rt.def("/client/proc/cmd_ahelp_reply", function* cmd_ahelp_reply(f: Frame, whom: Value) {
	let C: Value = null, AH: Value = null, msg: Value = null;
	f.vars = () => [whom, C, AH, msg];
	if (truthy(rt.bitAnd(rt.fv(f, "muted", rt.sv(f, "prefs")), 8))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<font color='red'>Error: Admin-PM: You are unable to use admin PM-s (muted).</font>"]);
		return live(f.dot);
	}
	C = null;
	if (truthy((yield* g.call(f, P("/proc/istext"), null, [live(whom)])))) {
		if (truthy((yield* g.call(f, P("/proc/cmptext"), null, [(yield* g.call(f, P("/proc/copytext"), null, [live(whom), 1, 2])), "@"])))) {
			whom = (yield* g.srcCall(f, "findStealthKey", live(whom)));
		}
		C = rt.index(rt.gl("directory"), live(whom));
	} else {
		if (truthy((rt.istype(live(whom), T("/client")) ? 1 : 0))) {
			C = live(whom);
		}
	}
	if (!truthy(live(C))) {
		if (truthy(rt.sv(f, "holder"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<font color='red'>Error: Admin-PM: Client not found.</font>"]);
		}
		return live(f.dot);
	}
	if (truthy((AH = rt.fv(f, "current_ticket", live(C))))) {
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has started replying to ＀'s admin help.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), (yield* g.call(f, P("/proc/key_name"), null, [live(C), 0, 0]))])]);
	}
	if (!truthy((msg = (yield* g.op(f, "Prompt", [3], [null, fmt("Private message to ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(C), 0, 0]))]), "Message:", live(f.src), null]))))) {
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has cancelled their reply to ＀'s admin help.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), (yield* g.call(f, P("/proc/key_name"), null, [live(C), 0, 0]))])]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "cmd_admin_pm", live(whom), live(msg));
	return f.dot;
}, true);

// /client/proc/cmd_admin_pm  (code/modules/admin/verbs/adminpm.dm:67)  may sleep
rt.def("/client/proc/cmd_admin_pm", function* cmd_admin_pm(f: Frame, whom: Value, msg: Value) {
	let recipient: Value = null, rawmsg: Value = null, keywordparsedmsg: Value = null, AH: Value = null, interaction_message: Value = null, replymsg: Value = null, sender: Value = null, sendername: Value = null, reply: Value = null, X: Value = null;
	let $0: any, $e: any;
	f.vars = () => [whom, msg, recipient, rawmsg, keywordparsedmsg, AH, interaction_message, replymsg, sender, sendername, reply, X, $0, $e];
	if (truthy(rt.bitAnd(rt.fv(f, "muted", rt.sv(f, "prefs")), 8))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<font color='red'>Error: Admin-PM: You are unable to use admin PM-s (muted).</font>"]);
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "holder")) && !truthy(rt.sv(f, "current_ticket")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<font color='red'>You can no longer reply to this ticket, please open another one by using the Adminhelp verb if need be.</font>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<font color='blue'>Message: ＀</font>", [live(msg)])]);
		return live(f.dot);
	}
	recipient = null;
	if (truthy((yield* g.call(f, P("/proc/istext"), null, [live(whom)])))) {
		if (truthy((yield* g.call(f, P("/proc/cmptext"), null, [(yield* g.call(f, P("/proc/copytext"), null, [live(whom), 1, 2])), "@"])))) {
			whom = (yield* g.srcCall(f, "findStealthKey", live(whom)));
		}
		recipient = rt.index(rt.gl("directory"), live(whom));
	} else {
		if (truthy((rt.istype(live(whom), T("/client")) ? 1 : 0))) {
			recipient = live(whom);
		}
	}
	{
		if (!truthy(live(recipient))) {
			if (truthy(rt.sv(f, "holder"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<font color='red'>Error: Admin-PM: Client not found.</font>"]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), live(msg)]);
			} else {
				yield* g.callName(f, rt.sv(f, "current_ticket"), "MessageNoRecipient", [live(msg)]);
			}
			return live(f.dot);
		}
		if (!truthy(live(msg))) {
			if (!truthy((msg = (yield* g.op(f, "Prompt", [3], [null, fmt("Private message to ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(recipient), 0, 0]))]), "Message:", live(f.src), null]))))) {
				return live(f.dot);
			}
			if (truthy(rt.bitAnd(rt.fv(f, "muted", rt.sv(f, "prefs")), 8))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<font color='red'>Error: Admin-PM: You are unable to use admin PM-s (muted).</font>"]);
				return live(f.dot);
			}
			if (!truthy(live(recipient))) {
				if (truthy(rt.sv(f, "holder"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<font color='red'>Error: Admin-PM: Client not found.</font>"]);
				} else {
					yield* g.callName(f, rt.sv(f, "current_ticket"), "MessageNoRecipient", [live(msg)]);
				}
				return live(f.dot);
			}
		}
	}
	if (truthy((yield* g.callName(f, live(f.src), "handle_spam_prevention", [live(msg), 8])))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [48, 0])))) {
		if (!truthy((msg = (yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.call(f, P("/proc/copytext"), null, [live(msg), 1, 1024]))]))))) {
			return live(f.dot);
		}
	}
	rawmsg = live(msg);
	if (truthy(rt.sv(f, "holder"))) {
		msg = (yield* g.call(f, P("/proc/emoji_parse"), null, [live(msg)]));
	}
	keywordparsedmsg = (yield* g.call(f, P("/proc/keywords_lookup"), null, [live(msg)]));
	{
		if (truthy(rt.fv(f, "holder", live(recipient)))) {
			if (truthy(rt.sv(f, "holder"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(recipient), fmt("<font color='red'>Admin PM from-<b>＀</b>: ＀</font>", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src), live(recipient), 1])), live(keywordparsedmsg)])]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<font color='blue'>Admin PM to-<b>＀</b>: ＀</font>", [(yield* g.call(f, P("/proc/key_name"), null, [live(recipient), live(f.src), 1])), live(keywordparsedmsg)])]);
				interaction_message = fmt("<font color='purple'>PM from-<b>＀</b> to-<b>＀</b>: ＀</font>", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src), live(recipient), 1])), (yield* g.call(f, P("/proc/key_name"), null, [live(recipient), live(f.src), 1])), live(keywordparsedmsg)]);
				yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(f.src), live(interaction_message)]);
				if (!isEqual(live(recipient), live(f.src))) {
					yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(recipient), live(interaction_message)]);
				}
			} else {
				replymsg = fmt("<font color='red'>Reply PM from-<b>＀</b>: ＀</font>", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src), live(recipient), 1])), live(keywordparsedmsg)]);
				yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(f.src), live(replymsg)]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(recipient), live(replymsg)]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<font color='blue'>PM to-<b>Admins</b>: ＀</font>", [live(msg)])]);
			}
			if (truthy(rt.bitAnd(rt.gv(f, "toggles", rt.fv(f, "prefs", live(recipient))), 1))) {
				rt.op(f, "Output", [], [live(recipient), rt.rsc("sound/effects/adminhelp.ogg")], false);
			}
		} else {
			if (truthy(rt.sv(f, "holder"))) {
				if (!truthy(rt.fv(f, "current_ticket", live(recipient)))) {
					yield* g.new_(f, T("/datum/admin_help"), [live(msg), live(recipient), 1]);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(recipient), "<font color='red' size='4'><b>-- Administrator private message --</b></font>"]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(recipient), fmt("<font color='red'>Admin PM from-<b>＀</b>: ＀</font>", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src), live(recipient), 0])), live(msg)])]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(recipient), "<font color='red'><i>Click on the administrator's name to reply.</i></font>"]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<font color='blue'>Admin PM to-<b>＀</b>: ＀</font>", [(yield* g.call(f, P("/proc/key_name"), null, [live(recipient), live(f.src), 1])), live(msg)])]);
				yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(recipient), fmt("<font color='blue'>PM From ＀: ＀</font>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), live(keywordparsedmsg)])]);
				rt.op(f, "Output", [], [live(recipient), rt.rsc("sound/effects/adminhelp.ogg")], false);
				if (truthy(rt.fv(f, "popup_admin_pm", rt.gl("config")))) {
					rt.spawnTail(f, 0, "/client/proc/cmd_admin_pm: spawn at modules/admin/verbs/adminpm.dm:189", whom, msg, recipient, rawmsg, keywordparsedmsg, AH, interaction_message, replymsg, sender, sendername, reply, X);
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<font color='red'>Error: Admin-PM: Non-admin to non-admin PM communication is forbidden.</font>"]);
				return live(f.dot);
			}
		}
	}
	{
		yield* g.call(f, P("/proc/window_flash"), null, [null, live(recipient), "ignorepref", 1], rt.Args.Named);
		yield* g.call(f, P("/proc/log_admin_private"), null, [fmt("PM: ＀->＀: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), (yield* g.call(f, P("/proc/key_name"), null, [live(recipient)])), live(rawmsg)])]);
		X = null;
		rt.forList(f, 0, rt.gl("admins"), T("/client"));
		while (($e = rt.next(f, 0)) !== undefined) {
			X = $e;
			if ((!isEqual(rt.fv(f, "key", live(X)), rt.sv(f, "key")) && !isEqual(rt.fv(f, "key", live(X)), rt.fv(f, "key", live(recipient))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(X), fmt("<font color='blue'><B>PM: ＀-&gt;＀:</B> ＀</font>", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src), live(X), 0])), (yield* g.call(f, P("/proc/key_name"), null, [live(recipient), live(X), 0])), live(keywordparsedmsg)])]);
			}
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);

// a spawn(0) body of /client/proc/cmd_admin_pm, a named tail so a world snapshot can hold it while it waits.
rt.tail("/client/proc/cmd_admin_pm: spawn at modules/admin/verbs/adminpm.dm:189", function* (f: Frame, whom: Value, msg: Value, recipient: Value, rawmsg: Value, keywordparsedmsg: Value, AH: Value, interaction_message: Value, replymsg: Value, sender: Value, sendername: Value, reply: Value, X: Value) {
	f.vars = () => [whom, msg, recipient, rawmsg, keywordparsedmsg, AH, interaction_message, replymsg, sender, sendername, reply, X];
	sender = live(f.src);
	sendername = rt.sv(f, "key");
	reply = (yield* g.op(f, "Prompt", [3], ["", fmt("Admin PM from-＀", [live(sendername)]), live(msg), live(recipient), null]));
	if ((truthy(live(recipient)) && truthy(live(reply)))) {
		if (truthy(live(sender))) {
			yield* g.callName(f, live(recipient), "cmd_admin_pm", [live(sender), live(reply)]);
		} else {
			yield* g.srcCall(f, "adminhelp", live(reply));
		}
	}
	return live(f.dot);
	return null;
});
