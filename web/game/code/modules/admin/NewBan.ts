// From code/modules/admin/NewBan.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalCMinutes  (code/modules/admin/NewBan.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalCMinutes", function InitGlobalCMinutes(f: Frame) {
	rt.setGl("CMinutes", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "CMinutes", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalBanlist  (code/modules/admin/NewBan.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobalBanlist", function InitGlobalBanlist(f: Frame) {
	rt.setGl("Banlist", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "Banlist", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalBanlist  (code/modules/admin/NewBan.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGlobalBanlist", function InitGlobalBanlist(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "Banlist", add);
	return f.dot;
});

// /proc/CheckBan  (code/modules/admin/NewBan.dm:7)
rt.def("/proc/CheckBan", function CheckBan(f: Frame, ckey: Value, id: Value, address: Value) {
	let appeal: Value = null, A: Value = null, matches: Value = null;
	let $e: any;
	f.vars = () => [appeal, A, matches, $e];
	if (!truthy(rt.gl("Banlist"))) {
		rt.call(f, P("/proc/LoadBans"), null, []);
		if (!truthy(rt.gl("Banlist"))) {
			return 0;
		}
	}
	f.dot = rt.list();
	appeal = null;
	if ((truthy(rt.gl("config")) && truthy(rt.fv(f, "banappeals", rt.gl("config"))))) {
		appeal = fmt("\nFor more information on your ban, or to appeal, head to <a href='＀'>＀</a>", [rt.fv(f, "banappeals", rt.gl("config")), rt.fv(f, "banappeals", rt.gl("config"))]);
	}
	rt.setFv(f, "cd", rt.gl("Banlist"), "/base");
	if (truthy((rt.isIn(f, fmt("＀＀", [live(ckey), live(id)]), rt.fv(f, "dir", rt.gl("Banlist"))) ? 1 : 0))) {
		rt.setFv(f, "cd", rt.gl("Banlist"), fmt("＀＀", [live(ckey), live(id)]));
		if (truthy(rt.at(rt.gl("Banlist"), "temp"))) {
			if (!truthy(rt.call(f, P("/proc/GetExp"), null, [rt.at(rt.gl("Banlist"), "minutes")]))) {
				rt.call(f, P("/proc/ClearTempbans"), null, []);
				return 0;
			} else {
				rt.setAt(live(f.dot), "desc", fmt("\nReason: ＀\nExpires: ＀\nBy: ＀＀", [rt.at(rt.gl("Banlist"), "reason"), rt.call(f, P("/proc/GetExp"), null, [rt.at(rt.gl("Banlist"), "minutes")]), rt.at(rt.gl("Banlist"), "bannedby"), live(appeal)]));
			}
		} else {
			rt.setFv(f, "cd", rt.gl("Banlist"), fmt("/base/＀＀", [live(ckey), live(id)]));
			rt.setAt(live(f.dot), "desc", fmt("\nReason: ＀\nExpires: <B>PERMENANT</B>\nBy: ＀＀", [rt.at(rt.gl("Banlist"), "reason"), rt.at(rt.gl("Banlist"), "bannedby"), live(appeal)]));
		}
		rt.setAt(live(f.dot), "reason", "ckey/id");
		return live(f.dot);
	} else {
		A = null;
		rt.forList(f, 0, rt.fv(f, "dir", rt.gl("Banlist")));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			rt.setFv(f, "cd", rt.gl("Banlist"), fmt("/base/＀", [live(A)]));
			matches = null;
			if (isEqual(live(ckey), rt.at(rt.gl("Banlist"), "key"))) {
				matches = rt.modify(live(matches), "ckey", add);
			}
			if (isEqual(live(id), rt.at(rt.gl("Banlist"), "id"))) {
				if (truthy(live(matches))) {
					matches = rt.modify(live(matches), "/", add);
				}
				matches = rt.modify(live(matches), "id", add);
			}
			if (isEqual(live(address), rt.at(rt.gl("Banlist"), "ip"))) {
				if (truthy(live(matches))) {
					matches = rt.modify(live(matches), "/", add);
				}
				matches = rt.modify(live(matches), "ip", add);
			}
			if (truthy(live(matches))) {
				if (truthy(rt.at(rt.gl("Banlist"), "temp"))) {
					if (!truthy(rt.call(f, P("/proc/GetExp"), null, [rt.at(rt.gl("Banlist"), "minutes")]))) {
						rt.call(f, P("/proc/ClearTempbans"), null, []);
						return 0;
					} else {
						rt.setAt(live(f.dot), "desc", fmt("\nReason: ＀\nExpires: ＀\nBy: ＀＀", [rt.at(rt.gl("Banlist"), "reason"), rt.call(f, P("/proc/GetExp"), null, [rt.at(rt.gl("Banlist"), "minutes")]), rt.at(rt.gl("Banlist"), "bannedby"), live(appeal)]));
					}
				} else {
					rt.setAt(live(f.dot), "desc", fmt("\nReason: ＀\nExpires: <B>PERMENANT</B>\nBy: ＀＀", [rt.at(rt.gl("Banlist"), "reason"), rt.at(rt.gl("Banlist"), "bannedby"), live(appeal)]));
				}
				rt.setAt(live(f.dot), "reason", live(matches));
				return live(f.dot);
			}
		}
		rt.endFor(f, 0);
	}
	return 0;
});

// /proc/UpdateTime  (code/modules/admin/NewBan.dm:59)
rt.def("/proc/UpdateTime", function UpdateTime(f: Frame) {
	rt.setGl("CMinutes", divide(divide(rt.fv(f, "realtime", rt.world()), 10), 60));
	return 1;
});

// /proc/LoadBans  (code/modules/admin/NewBan.dm:64)
rt.def("/proc/LoadBans", function LoadBans(f: Frame) {
	rt.setGl("Banlist", rt.new_(f, T("/savefile"), ["data/banlist.bdb"]));
	rt.call(f, P("/proc/log_admin"), null, ["Loading Banlist"]);
	if (!truthy(rt.length(rt.fv(f, "dir", rt.gl("Banlist"))))) {
		rt.call(f, P("/proc/log_admin"), null, ["Banlist is empty."]);
	}
	if (!truthy(rt.callName(f, rt.fv(f, "dir", rt.gl("Banlist")), "Find", ["base"]))) {
		rt.call(f, P("/proc/log_admin"), null, ["Banlist missing base dir."]);
		rt.callName(f, rt.fv(f, "dir", rt.gl("Banlist")), "Add", ["base"]);
		rt.setFv(f, "cd", rt.gl("Banlist"), "/base");
	} else {
		if (truthy(rt.callName(f, rt.fv(f, "dir", rt.gl("Banlist")), "Find", ["base"]))) {
			rt.setFv(f, "cd", rt.gl("Banlist"), "/base");
		}
	}
	rt.call(f, P("/proc/ClearTempbans"), null, []);
	return 1;
});

// /proc/ClearTempbans  (code/modules/admin/NewBan.dm:80)
rt.def("/proc/ClearTempbans", function ClearTempbans(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	rt.call(f, P("/proc/UpdateTime"), null, []);
	rt.setFv(f, "cd", rt.gl("Banlist"), "/base");
	A = null;
	rt.forList(f, 0, rt.fv(f, "dir", rt.gl("Banlist")));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		rt.setFv(f, "cd", rt.gl("Banlist"), fmt("/base/＀", [live(A)]));
		if ((!truthy(rt.at(rt.gl("Banlist"), "key")) || !truthy(rt.at(rt.gl("Banlist"), "id")))) {
			rt.call(f, P("/proc/RemoveBan"), null, [live(A)]);
			rt.call(f, P("/proc/log_admin"), null, ["Invalid Ban."]);
			rt.call(f, P("/proc/message_admins"), null, ["Invalid Ban."]);
			continue;
		}
		if (!truthy(rt.at(rt.gl("Banlist"), "temp"))) {
			continue;
		}
		if (rt.ge(rt.gl("CMinutes"), rt.at(rt.gl("Banlist"), "minutes"))) {
			rt.call(f, P("/proc/RemoveBan"), null, [live(A)]);
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /proc/AddBan  (code/modules/admin/NewBan.dm:102)  may sleep
rt.def("/proc/AddBan", function* AddBan(f: Frame, ckey: Value, computerid: Value, reason: Value, bannedby: Value, temp: Value, minutes: Value, address: Value) {
	let bantimestamp: Value = null;
	f.vars = () => [ckey, computerid, reason, bannedby, temp, minutes, address, bantimestamp];
	bantimestamp = null;
	if (truthy(live(temp))) {
		yield* g.call(f, P("/proc/UpdateTime"), null, []);
		bantimestamp = add(rt.gl("CMinutes"), live(minutes));
	}
	rt.setFv(f, "cd", rt.gl("Banlist"), "/base");
	if (truthy((yield* g.callName(f, rt.fv(f, "dir", rt.gl("Banlist")), "Find", [fmt("＀＀", [live(ckey), live(computerid)])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Ban already exists.</span>"]);
		return 0;
	} else {
		yield* g.callName(f, rt.fv(f, "dir", rt.gl("Banlist")), "Add", [fmt("＀＀", [live(ckey), live(computerid)])]);
		rt.setFv(f, "cd", rt.gl("Banlist"), fmt("/base/＀＀", [live(ckey), live(computerid)]));
		rt.op(f, "OutputReference", [rt.R.index], [rt.gl("Banlist"), "key", live(ckey)], false);
		rt.op(f, "OutputReference", [rt.R.index], [rt.gl("Banlist"), "id", live(computerid)], false);
		rt.op(f, "OutputReference", [rt.R.index], [rt.gl("Banlist"), "ip", live(address)], false);
		rt.op(f, "OutputReference", [rt.R.index], [rt.gl("Banlist"), "reason", live(reason)], false);
		rt.op(f, "OutputReference", [rt.R.index], [rt.gl("Banlist"), "bannedby", live(bannedby)], false);
		rt.op(f, "OutputReference", [rt.R.index], [rt.gl("Banlist"), "temp", live(temp)], false);
		if (truthy(live(temp))) {
			rt.op(f, "OutputReference", [rt.R.index], [rt.gl("Banlist"), "minutes", live(bantimestamp)], false);
		}
		if (!truthy(live(temp))) {
			yield* g.call(f, P("/proc/log_world"), null, [fmt("[server-ban] ＀ ＀", [live(ckey), truthy(live(address)) ? live(address) : "-"])]); // tools/server.mjs saves permanent bans to its own file
		} else {
		}
	}
	return 1;
}, true);

// /proc/RemoveBan  (code/modules/admin/NewBan.dm:130)
rt.def("/proc/RemoveBan", function RemoveBan(f: Frame, foldername: Value) {
	let key: Value = null, id: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [key, id, A, $e];
	key = null;
	id = null;
	rt.setFv(f, "cd", rt.gl("Banlist"), fmt("/base/＀", [live(foldername)]));
	key = rt.input(f, rt.R.index, null, [rt.gl("Banlist"), "key"]);
	id = rt.input(f, rt.R.index, null, [rt.gl("Banlist"), "id"]);
	rt.setFv(f, "cd", rt.gl("Banlist"), "/base");
	if (!truthy(rt.callName(f, rt.fv(f, "dir", rt.gl("Banlist")), "Remove", [live(foldername)]))) {
		return 0;
	}
	rt.call(f, P("/proc/log_world"), null, [fmt("[server-unban] ＀", [live(key)])]); // tools/server.mjs drops the key (and the addresses banned with it) from its own file
	if (!truthy(live(f.usr))) {
		rt.call(f, P("/proc/log_admin_private"), null, [fmt("Ban Expired: ＀", [live(key)])]);
		rt.call(f, P("/proc/message_admins"), null, [fmt("Ban Expired: ＀", [live(key)])]);
	} else {
		rt.call(f, P("/proc/ban_unban_log_save"), null, [fmt("＀ unbanned ＀", [rt.call(f, P("/proc/key_name"), null, [live(f.usr)]), live(key)])]);
		rt.call(f, P("/proc/log_admin_private"), null, [fmt("＀ unbanned ＀", [rt.call(f, P("/proc/key_name"), null, [live(f.usr)]), live(key)])]);
		rt.call(f, P("/proc/message_admins"), null, [fmt("＀ unbanned: ＀", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]), live(key)])]);
	}
	A = null;
	rt.forList(f, 0, rt.fv(f, "dir", rt.gl("Banlist")));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		rt.setFv(f, "cd", rt.gl("Banlist"), fmt("/base/＀", [live(A)]));
		if (isEqual(live(key), rt.at(rt.gl("Banlist"), "key"))) {
			rt.setFv(f, "cd", rt.gl("Banlist"), "/base");
			rt.callName(f, rt.fv(f, "dir", rt.gl("Banlist")), "Remove", [live(A)]);
			continue;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /proc/GetExp  (code/modules/admin/NewBan.dm:156)
rt.def("/proc/GetExp", function GetExp(f: Frame, minutes: Value) {
	let exp: Value = null, timeleftstring: Value = null;
	f.vars = () => [exp, timeleftstring];
	rt.call(f, P("/proc/UpdateTime"), null, []);
	if (rt.le((exp = subtract(live(minutes), rt.gl("CMinutes"))), 0)) {
		return 0;
	} else {
		timeleftstring = null;
		if (rt.ge(live(exp), 1440)) {
			timeleftstring = fmt("＀ Days", [rt.call(f, P("/proc/round"), null, [divide(live(exp), 1440), 0.10000000149011612])]);
		} else {
			if (rt.ge(live(exp), 60)) {
				timeleftstring = fmt("＀ Hours", [rt.call(f, P("/proc/round"), null, [divide(live(exp), 60), 0.10000000149011612])]);
			} else {
				timeleftstring = fmt("＀ Minutes", [live(exp)]);
			}
		}
		return live(timeleftstring);
	}
	return f.dot;
});

// /datum/admins/proc/unbanpanel  (code/modules/admin/NewBan.dm:174)
rt.def("/datum/admins/proc/unbanpanel", function unbanpanel(f: Frame) {
	let count: Value = null, dat: Value = null, A: Value = null, ref: Value = null, key: Value = null, id: Value = null, ip: Value = null, reason: Value = null, by: Value = null, expiry: Value = null;
	let $e: any;
	f.vars = () => [count, dat, A, ref, key, id, ip, reason, by, expiry, $e];
	count = 0;
	dat = null;
	rt.setFv(f, "cd", rt.gl("Banlist"), "/base");
	A = null;
	rt.forList(f, 0, rt.fv(f, "dir", rt.gl("Banlist")));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		count = rt.inc(live(count), 1);
		rt.setFv(f, "cd", rt.gl("Banlist"), fmt("/base/＀", [live(A)]));
		ref = fmt("＃", [live(f.src)]);
		key = rt.at(rt.gl("Banlist"), "key");
		id = rt.at(rt.gl("Banlist"), "id");
		ip = rt.at(rt.gl("Banlist"), "ip");
		reason = rt.at(rt.gl("Banlist"), "reason");
		by = rt.at(rt.gl("Banlist"), "bannedby");
		expiry = null;
		if (truthy(rt.at(rt.gl("Banlist"), "temp"))) {
			if (!truthy((expiry = rt.call(f, P("/proc/GetExp"), null, [rt.at(rt.gl("Banlist"), "minutes")])))) {
				expiry = "Removal Pending";
			}
		} else {
			expiry = "Permaban";
		}
		dat = rt.modify(live(dat), fmt("<tr><td><A href='?src=＀;unbanf=＀＀'>(U)</A><A href='?src=＀;unbane=＀＀'>(E)</A> Key: <B>＀</B></td><td>ComputerID: <B>＀</B></td><td>IP: <B>＀</B></td><td> ＀</td><td>(By: ＀)</td><td>(Reason: ＀)</td></tr>", [live(ref), live(key), live(id), live(ref), live(key), live(id), live(key), live(id), live(ip), live(expiry), live(by), live(reason)]), add);
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), "</table>", add);
	dat = fmt("<HR><B>Bans:</B> <FONT COLOR=blue>(U) = Unban , (E) = Edit Ban</FONT> - <FONT COLOR=green>(＀ Bans)</FONT><HR><table border=1 rules=all frame=void cellspacing=0 cellpadding=3 >＀", [live(count), live(dat)]);
	rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=unbanp;size=875x400"], false);
	return f.dot;
});
