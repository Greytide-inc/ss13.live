// Based on /tg/station's code/modules/admin/stickyban.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, subtract } = rt;


// stickyban.dm:2
rt.def("/datum/admins/proc/stickyban", function* stickyban(f: Frame, action: Value, data: Value) {
	let ban: Value = null, ckey: Value = null, reason: Value = null, ckey_0: Value = null, ban_1: Value = null, alt: Value = null, ban_2: Value = null, found: Value = null, key: Value = null, oldreason: Value = null, reason_3: Value = null, cached_ban: Value = null;
	let $e: any;
	if (!check_rights(4)) {
		return f.dot;
	}
	if (action === "show") {
		yield* this.stickyban_show();
	} else if (action === "add") {
		ban = list();
		rt.setAt(ban, "admin", f.usr.key);
		rt.setAt(ban, "type", list("sticky"));
		rt.setAt(ban, "reason", `(InGameBan)(${f.usr.key})`);
		if (rt.at(data, "ckey")) {
			ckey = (yield* g.call(f, P("/proc/ckey"), null, [rt.at(data, "ckey")]));
		} else {
			if (!(ckey = (yield* g.op(f, "Prompt", [3], ["", "Ckey", "Ckey", f.usr, null])))) {
				return f.dot;
			}
			ckey = (yield* g.call(f, P("/proc/ckey"), null, [ckey]));
		}
		rt.setAt(ban, "ckey", ckey);
		if (get_stickyban_from_ckey(ckey)) {
			to_chat(f.usr, "<span class='adminnotice'>Error: Can not add a stickyban: User already has a current sticky ban</span>");
		}
		if (rt.at(data, "reason")) {
			rt.setAt(ban, "message", rt.at(data, "reason"));
		} else {
			if (!(reason = (yield* g.op(f, "Prompt", [3], ["Ban Evasion", "Reason", "Reason", f.usr, null])))) {
				return f.dot;
			}
			rt.setAt(ban, "message", `${reason}`);
		}
		rt.world().SetConfig("ban", ckey, list2stickyban(ban));
		log_admin_private(`${key_name(f.usr)} has stickybanned ${ckey}.\nReason: ${rt.at(ban, "message")}`);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} has stickybanned ${ckey}.\nReason: ${rt.at(ban, "message")}</span>`);
	} else if (action === "remove") {
		if (!rt.at(data, "ckey")) {
			return f.dot;
		}
		ckey_0 = rt.at(data, "ckey");
		if (!(ban_1 = get_stickyban_from_ckey(ckey_0))) {
			to_chat(f.usr, `<span class='adminnotice'>Error: No sticky ban for ${ckey_0} found!</span>`);
			return f.dot;
		}
		if ((yield* alert(`Are you sure you want to remove the sticky ban on ${ckey_0}?`, "Are you sure", "Yes", "No")) == "No") {
			return f.dot;
		}
		if (!get_stickyban_from_ckey(ckey_0)) {
			to_chat(f.usr, "<span class='adminnotice'>Error: The ban disappeared.</span>");
			return f.dot;
		}
		rt.world().SetConfig("ban", ckey_0, null);
		log_admin_private(`${key_name(f.usr)} removed ${ckey_0}'s stickyban`);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} removed ${ckey_0}'s stickyban</span>`);
	} else if (action === "remove_alt") {
		if (!rt.at(data, "ckey")) {
			return f.dot;
		}
		ckey_0 = rt.at(data, "ckey");
		if (!rt.at(data, "alt")) {
			return f.dot;
		}
		alt = (yield* g.call(f, P("/proc/ckey"), null, [rt.at(data, "alt")]));
		if (!(ban_2 = get_stickyban_from_ckey(ckey_0))) {
			to_chat(f.usr, `<span class='adminnotice'>Error: No sticky ban for ${ckey_0} found!</span>`);
			return f.dot;
		}
		found = 0;
		for (key of each(rt.at(ban_2, "keys"))) {
			if ((yield* g.call(f, P("/proc/ckey"), null, [key])) == alt) {
				found = 1;
				break;
			}
		}
		if (!found) {
			to_chat(f.usr, `<span class='adminnotice'>Error: ${alt} is not linked to ${ckey_0}'s sticky ban!</span>`);
			return f.dot;
		}
		if ((yield* alert(`Are you sure you want to disassociate ${alt} from ${ckey_0}'s sticky ban? \nNote: Nothing stops byond from re-linking them`, "Are you sure", "Yes", "No")) == "No") {
			return f.dot;
		}
		if (!(ban_2 = get_stickyban_from_ckey(ckey_0))) {
			to_chat(f.usr, "<span class='adminnotice'>Error: The ban disappeared.</span>");
			return f.dot;
		}
		found = 0;
		key = null;
		for (key of each(rt.at(ban_2, "keys"))) {
			if ((yield* g.call(f, P("/proc/ckey"), null, [key])) == alt) {
				(rt.modAt(ban_2, "keys", key, subtract));
				found = 1;
				break;
			}
		}
		if (!found) {
			to_chat(f.usr, `<span class='adminnotice'>Error: ${alt} link to ${ckey_0}'s sticky ban disappeared.</span>`);
			return f.dot;
		}
		rt.world().SetConfig("ban", ckey_0, list2stickyban(ban_2));
		log_admin_private(`${key_name(f.usr)} has disassociated ${alt} from ${ckey_0}'s sticky ban`);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} has disassociated ${alt} from ${ckey_0}'s sticky ban</span>`);
	} else if (action === "edit") {
		if (!rt.at(data, "ckey")) {
			return f.dot;
		}
		ckey_0 = rt.at(data, "ckey");
		if (!(ban_1 = get_stickyban_from_ckey(ckey_0))) {
			to_chat(f.usr, `<span class='adminnotice'>Error: No sticky ban for ${ckey_0} found!`);
			return f.dot;
		}
		oldreason = rt.at(ban_1, "message");
		if (!(reason_3 = (yield* g.op(f, "Prompt", [3], [`${rt.at(ban_1, "message")}`, "Reason", "Reason", f.usr, null]))) || reason_3 == oldreason) {
			return f.dot;
		}
		if (!(ban_1 = get_stickyban_from_ckey(ckey_0))) {
			to_chat(f.usr, "<span class='adminnotice'>Error: The ban disappeared.</span>");
			return f.dot;
		}
		rt.setAt(ban_1, "message", `${reason_3}`);
		rt.world().SetConfig("ban", ckey_0, list2stickyban(ban_1));
		log_admin_private(`${key_name(f.usr)} has edited ${ckey_0}'s sticky ban reason from ${oldreason} to ${reason_3}`);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} has edited ${ckey_0}'s sticky ban reason from ${oldreason} to ${reason_3}</span>`);
	} else if (action === "revert") {
		if (!rt.at(data, "ckey")) {
			return f.dot;
		}
		if ((yield* alert(`Are you sure you want to revert the sticky ban on ${(ckey_0 = rt.at(data, "ckey"))} to its state at round start?`, "Are you sure", "Yes", "No")) == "No") {
			return f.dot;
		}
		if (!(ban_1 = get_stickyban_from_ckey(ckey_0))) {
			to_chat(f.usr, `<span class='adminnotice'>Error: No sticky ban for ${ckey_0} found!`);
			return f.dot;
		}
		if (!(cached_ban = rt.index(GLOB.SSstickyban.cache, ckey_0))) {
			to_chat(f.usr, `<span class='adminnotice'>Error: No cached sticky ban for ${ckey_0} found!`);
		}
		rt.world().SetConfig("ban", ckey_0, null);
		log_admin_private(`${key_name(f.usr)} has reverted ${ckey_0}'s sticky ban to it's state at round start.`);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} has reverted ${ckey_0}'s sticky ban to it's state at round start.</span>`);
		yield* sleep(rt.world().tick_lag);
		rt.world().SetConfig("ban", ckey_0, list2stickyban(cached_ban));
	}
	return f.dot;
}, true);

// stickyban.dm:154
rt.def("/datum/admins/proc/stickyban_gethtml", function stickyban_gethtml(f: Frame, ckey: Value, ban: Value) {
	let key: Value = null;
	f.dot = `\n\t\t<a href='?_src_=holder;stickyban=remove&ckey=${ckey}'>[-]</a>\n\t\t<a href='?_src_=holder;stickyban=revert&ckey=${ckey}'>[revert]</a>\n\t\t<b>${ckey}</b>\n\t\t<br />"\n\t\t${rt.at(ban, "message")} <b><a href='?_src_=holder;stickyban=edit&ckey=${ckey}'>[Edit]</a></b><br />\n\t`;
	if (rt.at(ban, "admin")) {
		f.dot += `${rt.at(ban, "admin")}<br />`;
	} else {
		f.dot += "LEGACY<br />";
	}
	f.dot += "Caught keys<br />\n<ol>";
	for (key of each(rt.at(ban, "keys"))) {
		if (rt.call(f, P("/proc/ckey"), null, [key]) == ckey) {
			continue;
		}
		f.dot += `<li><a href='?_src_=holder;stickyban=remove_alt&ckey=${ckey}&alt=${rt.call(f, P("/proc/ckey"), null, [key])}'>[-]</a>${key}</li>`;
	}
	f.dot += "</ol>\n";
	return f.dot;
});

// stickyban.dm:173
rt.def("/datum/admins/proc/stickyban_show", function* stickyban_show(f: Frame) {
	let key: Value = null, ckey: Value = null, ban: Value = null;
	if (!check_rights(4)) {
		return f.dot;
	}
	let bans: Value = (yield* sortList(rt.world().GetConfig("ban")));
	let banhtml: Value = "";
	for (key of each(bans)) {
		ckey = (yield* g.call(f, P("/proc/ckey"), null, [key]));
		ban = stickyban2list(rt.world().GetConfig("ban", key));
		banhtml += "<br /><hr />\n";
		banhtml += this.stickyban_gethtml(ckey, ban);
	}
	let html: Value = `\n\t<head>\n\t\t<title>Sticky Bans</title>\n\t</head>\n\t<body>\n\t\t<h2>All Sticky Bans:</h2> <a href='?_src_=holder;stickyban=add'>[+]</a><br>\n\t\t${banhtml}\n\t</body>\n\t`;
	rt.op(f, "Browse", [], [f.usr, html, "window=stickybans;size=700x400"], false);
	return f.dot;
}, true);

// stickyban.dm:195
rt.def("/proc/get_stickyban_from_ckey", function get_stickyban_from_ckey(f: Frame, ckey: Value) {
	let key: Value = null;
	if (!ckey) {
		return null;
	}
	ckey = rt.call(f, P("/proc/ckey"), null, [ckey]);
	f.dot = null;
	for (key of each(rt.world().GetConfig("ban"))) {
		if (rt.call(f, P("/proc/ckey"), null, [key]) == ckey) {
			f.dot = stickyban2list(rt.world().GetConfig("ban", key));
			break;
		}
	}
	return f.dot;
});

// stickyban.dm:205
rt.def("/proc/stickyban2list", function stickyban2list(f: Frame, ban: Value) {
	let keys: Value = null, ckeys: Value = null, key: Value = null, ckey: Value = null;
	if (!ban) {
		return null;
	}
	f.dot = params2list(ban);
	if (rt.at(f.dot, "keys")) {
		keys = splittext(rt.at(f.dot, "keys"), ",");
		ckeys = list();
		for (key of each(keys)) {
			ckey = rt.call(f, P("/proc/ckey"), null, [key]);
			rt.setAt(ckeys, ckey, ckey);
		}
		rt.setAt(f.dot, "keys", ckeys);
	}
	rt.setAt(f.dot, "type", splittext(rt.at(f.dot, "type"), ","));
	rt.setAt(f.dot, "IP", splittext(rt.at(f.dot, "IP"), ","));
	rt.setAt(f.dot, "computer_id", splittext(rt.at(f.dot, "computer_id"), ","));
	return f.dot;
});

// stickyban.dm:221
rt.def("/proc/list2stickyban", function list2stickyban(f: Frame, ban: Value) {
	if (!ban || !rt.istype(ban, T("/list"))) {
		return null;
	}
	f.dot = ban.Copy();
	if (rt.at(f.dot, "keys")) {
		rt.setAt(f.dot, "keys", jointext(rt.at(f.dot, "keys"), ","));
	}
	if (rt.at(f.dot, "type")) {
		rt.setAt(f.dot, "type", jointext(rt.at(f.dot, "type"), ","));
	}
	f.dot -= "existing_user_matches_this_round";
	f.dot -= "admin_matches_this_round";
	f.dot -= "matches_this_round";
	f.dot -= "reverting";
	f.dot -= "IP";
	f.dot -= "computer_id";
	f.dot = list2params(f.dot);
	return f.dot;
});

// stickyban.dm:246
rt.def("/client/proc/stickybanpanel", function* stickybanpanel(f: Frame) {
	if (!this.holder) {
		return f.dot;
	}
	yield* this.holder.stickyban_show();
	return f.dot;
}, true, { verb: { name: "Sticky Ban Panel", category: "Admin" } });
