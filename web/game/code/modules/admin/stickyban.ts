// From code/modules/admin/stickyban.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/admins/proc/stickyban  (code/modules/admin/stickyban.dm:2)  may sleep
rt.def("/datum/admins/proc/stickyban", function* stickyban(f: Frame, action: Value, data: Value) {
	let ban: Value = null, ckey: Value = null, reason: Value = null, ckey_0: Value = null, ban_1: Value = null, alt: Value = null, ban_2: Value = null, found: Value = null, key: Value = null, oldreason: Value = null, reason_3: Value = null, cached_ban: Value = null;
	let $0: any, $e: any;
	f.vars = () => [action, data, ban, ckey, reason, ckey_0, ban_1, alt, ban_2, found, key, oldreason, reason_3, cached_ban, $0, $e];
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4])))) {
		return live(f.dot);
	}
	$0 = live(action);
	if ($0 === "show") {
		yield* g.srcCall(f, "stickyban_show");
	} else if ($0 === "add") {
		ban = rt.list();
		ckey = null;
		rt.setAt(live(ban), "admin", rt.fv(f, "key", live(f.usr)));
		rt.setAt(live(ban), "type", rt.list("sticky"));
		rt.setAt(live(ban), "reason", fmt("(InGameBan)(＀)", [rt.fv(f, "key", live(f.usr))]));
		if (truthy(rt.at(live(data), "ckey"))) {
			ckey = (yield* g.call(f, P("/proc/ckey"), null, [rt.at(live(data), "ckey")]));
		} else {
			if (!truthy((ckey = (yield* g.op(f, "Prompt", [3], ["", "Ckey", "Ckey", live(f.usr), null]))))) {
				return live(f.dot);
			}
			ckey = (yield* g.call(f, P("/proc/ckey"), null, [live(ckey)]));
		}
		rt.setAt(live(ban), "ckey", live(ckey));
		if (truthy((yield* g.call(f, P("/proc/get_stickyban_from_ckey"), null, [live(ckey)])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='adminnotice'>Error: Can not add a stickyban: User already has a current sticky ban</span>"]);
		}
		if (truthy(rt.at(live(data), "reason"))) {
			rt.setAt(live(ban), "message", rt.at(live(data), "reason"));
		} else {
			if (!truthy((reason = (yield* g.op(f, "Prompt", [3], ["Ban Evasion", "Reason", "Reason", live(f.usr), null]))))) {
				return live(f.dot);
			}
			rt.setAt(live(ban), "message", fmt("＀", [live(reason)]));
		}
		yield* g.callName(f, rt.world(), "SetConfig", ["ban", live(ckey), (yield* g.call(f, P("/proc/list2stickyban"), null, [live(ban)]))]);
		yield* g.call(f, P("/proc/log_admin_private"), null, [fmt("＀ has stickybanned ＀.\nReason: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(ckey), rt.at(live(ban), "message")])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ has stickybanned ＀.\nReason: ＀</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(ckey), rt.at(live(ban), "message")])]);
	} else if ($0 === "remove") {
		if (!truthy(rt.at(live(data), "ckey"))) {
			return live(f.dot);
		}
		ckey_0 = rt.at(live(data), "ckey");
		if (!truthy((ban_1 = (yield* g.call(f, P("/proc/get_stickyban_from_ckey"), null, [live(ckey_0)]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='adminnotice'>Error: No sticky ban for ＀ found!</span>", [live(ckey_0)])]);
			return live(f.dot);
		}
		if (isEqual((yield* g.call(f, P("/proc/alert"), null, [fmt("Are you sure you want to remove the sticky ban on ＀?", [live(ckey_0)]), "Are you sure", "Yes", "No"])), "No")) {
			return live(f.dot);
		}
		if (!truthy((yield* g.call(f, P("/proc/get_stickyban_from_ckey"), null, [live(ckey_0)])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='adminnotice'>Error: The ban disappeared.</span>"]);
			return live(f.dot);
		}
		yield* g.callName(f, rt.world(), "SetConfig", ["ban", live(ckey_0), null]);
		yield* g.call(f, P("/proc/log_admin_private"), null, [fmt("＀ removed ＀'s stickyban", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(ckey_0)])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ removed ＀'s stickyban</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(ckey_0)])]);
	} else if ($0 === "remove_alt") {
		if (!truthy(rt.at(live(data), "ckey"))) {
			return live(f.dot);
		}
		ckey_0 = rt.at(live(data), "ckey");
		if (!truthy(rt.at(live(data), "alt"))) {
			return live(f.dot);
		}
		alt = (yield* g.call(f, P("/proc/ckey"), null, [rt.at(live(data), "alt")]));
		if (!truthy((ban_2 = (yield* g.call(f, P("/proc/get_stickyban_from_ckey"), null, [live(ckey_0)]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='adminnotice'>Error: No sticky ban for ＀ found!</span>", [live(ckey_0)])]);
			return live(f.dot);
		}
		found = 0;
		key = null;
		rt.forList(f, 0, rt.at(live(ban_2), "keys"));
		while (($e = rt.next(f, 0)) !== undefined) {
			key = $e;
			if (isEqual((yield* g.call(f, P("/proc/ckey"), null, [live(key)])), live(alt))) {
				found = 1;
				break;
			}
		}
		rt.endFor(f, 0);
		if (!truthy(live(found))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='adminnotice'>Error: ＀ is not linked to ＀'s sticky ban!</span>", [live(alt), live(ckey_0)])]);
			return live(f.dot);
		}
		if (isEqual((yield* g.call(f, P("/proc/alert"), null, [fmt("Are you sure you want to disassociate ＀ from ＀'s sticky ban? \nNote: Nothing stops byond from re-linking them", [live(alt), live(ckey_0)]), "Are you sure", "Yes", "No"])), "No")) {
			return live(f.dot);
		}
		if (!truthy((ban_2 = (yield* g.call(f, P("/proc/get_stickyban_from_ckey"), null, [live(ckey_0)]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='adminnotice'>Error: The ban disappeared.</span>"]);
			return live(f.dot);
		}
		found = 0;
		key = null;
		rt.forList(f, 0, rt.at(live(ban_2), "keys"));
		while (($e = rt.next(f, 0)) !== undefined) {
			key = $e;
			if (isEqual((yield* g.call(f, P("/proc/ckey"), null, [live(key)])), live(alt))) {
				(rt.modAt(live(ban_2), "keys", live(key), subtract));
				found = 1;
				break;
			}
		}
		rt.endFor(f, 0);
		if (!truthy(live(found))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='adminnotice'>Error: ＀ link to ＀'s sticky ban disappeared.</span>", [live(alt), live(ckey_0)])]);
			return live(f.dot);
		}
		yield* g.callName(f, rt.world(), "SetConfig", ["ban", live(ckey_0), (yield* g.call(f, P("/proc/list2stickyban"), null, [live(ban_2)]))]);
		yield* g.call(f, P("/proc/log_admin_private"), null, [fmt("＀ has disassociated ＀ from ＀'s sticky ban", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(alt), live(ckey_0)])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ has disassociated ＀ from ＀'s sticky ban</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(alt), live(ckey_0)])]);
	} else if ($0 === "edit") {
		if (!truthy(rt.at(live(data), "ckey"))) {
			return live(f.dot);
		}
		ckey_0 = rt.at(live(data), "ckey");
		if (!truthy((ban_1 = (yield* g.call(f, P("/proc/get_stickyban_from_ckey"), null, [live(ckey_0)]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='adminnotice'>Error: No sticky ban for ＀ found!", [live(ckey_0)])]);
			return live(f.dot);
		}
		oldreason = rt.at(live(ban_1), "message");
		if ((!truthy((reason_3 = (yield* g.op(f, "Prompt", [3], [fmt("＀", [rt.at(live(ban_1), "message")]), "Reason", "Reason", live(f.usr), null])))) || isEqual(live(reason_3), live(oldreason)))) {
			return live(f.dot);
		}
		if (!truthy((ban_1 = (yield* g.call(f, P("/proc/get_stickyban_from_ckey"), null, [live(ckey_0)]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='adminnotice'>Error: The ban disappeared.</span>"]);
			return live(f.dot);
		}
		rt.setAt(live(ban_1), "message", fmt("＀", [live(reason_3)]));
		yield* g.callName(f, rt.world(), "SetConfig", ["ban", live(ckey_0), (yield* g.call(f, P("/proc/list2stickyban"), null, [live(ban_1)]))]);
		yield* g.call(f, P("/proc/log_admin_private"), null, [fmt("＀ has edited ＀'s sticky ban reason from ＀ to ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(ckey_0), live(oldreason), live(reason_3)])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ has edited ＀'s sticky ban reason from ＀ to ＀</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(ckey_0), live(oldreason), live(reason_3)])]);
	} else if ($0 === "revert") {
		if (!truthy(rt.at(live(data), "ckey"))) {
			return live(f.dot);
		}
		if (isEqual((yield* g.call(f, P("/proc/alert"), null, [fmt("Are you sure you want to revert the sticky ban on ＀ to its state at round start?", [(ckey_0 = rt.at(live(data), "ckey"))]), "Are you sure", "Yes", "No"])), "No")) {
			return live(f.dot);
		}
		if (!truthy((ban_1 = (yield* g.call(f, P("/proc/get_stickyban_from_ckey"), null, [live(ckey_0)]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='adminnotice'>Error: No sticky ban for ＀ found!", [live(ckey_0)])]);
			return live(f.dot);
		}
		if (!truthy((cached_ban = rt.index(rt.fv(f, "cache", rt.gl("SSstickyban")), live(ckey_0))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='adminnotice'>Error: No cached sticky ban for ＀ found!", [live(ckey_0)])]);
		}
		yield* g.callName(f, rt.world(), "SetConfig", ["ban", live(ckey_0), null]);
		yield* g.call(f, P("/proc/log_admin_private"), null, [fmt("＀ has reverted ＀'s sticky ban to it's state at round start.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(ckey_0)])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ has reverted ＀'s sticky ban to it's state at round start.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(ckey_0)])]);
		yield* g.call(f, P("/proc/sleep"), null, [rt.fv(f, "tick_lag", rt.world())]);
		yield* g.callName(f, rt.world(), "SetConfig", ["ban", live(ckey_0), (yield* g.call(f, P("/proc/list2stickyban"), null, [live(cached_ban)]))]);
	}
	return f.dot;
}, true);

// /datum/admins/proc/stickyban_gethtml  (code/modules/admin/stickyban.dm:154)
rt.def("/datum/admins/proc/stickyban_gethtml", function stickyban_gethtml(f: Frame, ckey: Value, ban: Value) {
	let key: Value = null;
	let $e: any;
	f.vars = () => [key, $e];
	f.dot = fmt("\n\t\t<a href='?_src_=holder;stickyban=remove&ckey=＀'>[-]</a>\n\t\t<a href='?_src_=holder;stickyban=revert&ckey=＀'>[revert]</a>\n\t\t<b>＀</b>\n\t\t<br />\"\n\t\t＀ <b><a href='?_src_=holder;stickyban=edit&ckey=＀'>[Edit]</a></b><br />\n\t", [live(ckey), live(ckey), live(ckey), rt.at(live(ban), "message"), live(ckey)]);
	if (truthy(rt.at(live(ban), "admin"))) {
		f.dot = rt.modify(live(f.dot), fmt("＀<br />", [rt.at(live(ban), "admin")]), add);
	} else {
		f.dot = rt.modify(live(f.dot), "LEGACY<br />", add);
	}
	f.dot = rt.modify(live(f.dot), "Caught keys<br />\n<ol>", add);
	key = null;
	rt.forList(f, 0, rt.at(live(ban), "keys"));
	while (($e = rt.next(f, 0)) !== undefined) {
		key = $e;
		if (isEqual(rt.call(f, P("/proc/ckey"), null, [live(key)]), live(ckey))) {
			continue;
		}
		f.dot = rt.modify(live(f.dot), fmt("<li><a href='?_src_=holder;stickyban=remove_alt&ckey=＀&alt=＀'>[-]</a>＀</li>", [live(ckey), rt.call(f, P("/proc/ckey"), null, [live(key)]), live(key)]), add);
	}
	rt.endFor(f, 0);
	f.dot = rt.modify(live(f.dot), "</ol>\n", add);
	return f.dot;
});

// /datum/admins/proc/stickyban_show  (code/modules/admin/stickyban.dm:173)  may sleep
rt.def("/datum/admins/proc/stickyban_show", function* stickyban_show(f: Frame) {
	let bans: Value = null, banhtml: Value = null, key: Value = null, ckey: Value = null, ban: Value = null, html: Value = null;
	let $e: any;
	f.vars = () => [bans, banhtml, key, ckey, ban, html, $e];
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4])))) {
		return live(f.dot);
	}
	bans = (yield* g.call(f, P("/proc/sortList"), null, [(yield* g.callName(f, rt.world(), "GetConfig", ["ban"]))]));
	banhtml = "";
	key = null;
	rt.forList(f, 0, live(bans));
	while (($e = rt.next(f, 0)) !== undefined) {
		key = $e;
		ckey = (yield* g.call(f, P("/proc/ckey"), null, [live(key)]));
		ban = (yield* g.call(f, P("/proc/stickyban2list"), null, [(yield* g.callName(f, rt.world(), "GetConfig", ["ban", live(key)]))]));
		banhtml = rt.modify(live(banhtml), "<br /><hr />\n", add);
		banhtml = rt.modify(live(banhtml), (yield* g.srcCall(f, "stickyban_gethtml", live(ckey), live(ban))), add);
	}
	rt.endFor(f, 0);
	html = fmt("\n\t<head>\n\t\t<title>Sticky Bans</title>\n\t</head>\n\t<body>\n\t\t<h2>All Sticky Bans:</h2> <a href='?_src_=holder;stickyban=add'>[+]</a><br>\n\t\t＀\n\t</body>\n\t", [live(banhtml)]);
	rt.op(f, "Browse", [], [live(f.usr), live(html), "window=stickybans;size=700x400"], false);
	return f.dot;
}, true);

// /proc/get_stickyban_from_ckey  (code/modules/admin/stickyban.dm:195)
rt.def("/proc/get_stickyban_from_ckey", function get_stickyban_from_ckey(f: Frame, ckey: Value) {
	let key: Value = null;
	let $e: any;
	f.vars = () => [ckey, key, $e];
	if (!truthy(live(ckey))) {
		return null;
	}
	ckey = rt.call(f, P("/proc/ckey"), null, [live(ckey)]);
	f.dot = null;
	key = null;
	rt.forList(f, 0, rt.callName(f, rt.world(), "GetConfig", ["ban"]));
	while (($e = rt.next(f, 0)) !== undefined) {
		key = $e;
		if (isEqual(rt.call(f, P("/proc/ckey"), null, [live(key)]), live(ckey))) {
			f.dot = rt.call(f, P("/proc/stickyban2list"), null, [rt.callName(f, rt.world(), "GetConfig", ["ban", live(key)])]);
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/stickyban2list  (code/modules/admin/stickyban.dm:205)
rt.def("/proc/stickyban2list", function stickyban2list(f: Frame, ban: Value) {
	let keys: Value = null, ckeys: Value = null, key: Value = null, ckey: Value = null;
	let $e: any;
	f.vars = () => [keys, ckeys, key, ckey, $e];
	if (!truthy(live(ban))) {
		return null;
	}
	f.dot = rt.call(f, P("/proc/params2list"), null, [live(ban)]);
	if (truthy(rt.at(live(f.dot), "keys"))) {
		keys = rt.call(f, P("/proc/splittext"), null, [rt.at(live(f.dot), "keys"), ","]);
		ckeys = rt.list();
		key = null;
		rt.forList(f, 0, live(keys));
		while (($e = rt.next(f, 0)) !== undefined) {
			key = $e;
			ckey = rt.call(f, P("/proc/ckey"), null, [live(key)]);
			rt.setAt(live(ckeys), live(ckey), live(ckey));
		}
		rt.endFor(f, 0);
		rt.setAt(live(f.dot), "keys", live(ckeys));
	}
	rt.setAt(live(f.dot), "type", rt.call(f, P("/proc/splittext"), null, [rt.at(live(f.dot), "type"), ","]));
	rt.setAt(live(f.dot), "IP", rt.call(f, P("/proc/splittext"), null, [rt.at(live(f.dot), "IP"), ","]));
	rt.setAt(live(f.dot), "computer_id", rt.call(f, P("/proc/splittext"), null, [rt.at(live(f.dot), "computer_id"), ","]));
	return f.dot;
});

// /proc/list2stickyban  (code/modules/admin/stickyban.dm:221)
rt.def("/proc/list2stickyban", function list2stickyban(f: Frame, ban: Value) {
	if ((!truthy(live(ban)) || !truthy((rt.istype(live(ban), T("/list")) ? 1 : 0)))) {
		return null;
	}
	f.dot = rt.callName(f, live(ban), "Copy", []);
	if (truthy(rt.at(live(f.dot), "keys"))) {
		rt.setAt(live(f.dot), "keys", rt.call(f, P("/proc/jointext"), null, [rt.at(live(f.dot), "keys"), ","]));
	}
	if (truthy(rt.at(live(f.dot), "type"))) {
		rt.setAt(live(f.dot), "type", rt.call(f, P("/proc/jointext"), null, [rt.at(live(f.dot), "type"), ","]));
	}
	(f.dot = rt.modify(live(f.dot), "existing_user_matches_this_round", subtract));
	(f.dot = rt.modify(live(f.dot), "admin_matches_this_round", subtract));
	(f.dot = rt.modify(live(f.dot), "matches_this_round", subtract));
	(f.dot = rt.modify(live(f.dot), "reverting", subtract));
	(f.dot = rt.modify(live(f.dot), "IP", subtract));
	(f.dot = rt.modify(live(f.dot), "computer_id", subtract));
	f.dot = rt.call(f, P("/proc/list2params"), null, [live(f.dot)]);
	return f.dot;
});

// /client/proc/stickybanpanel  (code/modules/admin/stickyban.dm:246)  may sleep
rt.def("/client/proc/stickybanpanel", function* stickybanpanel(f: Frame) {
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "holder"), "stickyban_show", []);
	return f.dot;
}, true, { verb: { name: "Sticky Ban Panel", category: "Admin" } });
