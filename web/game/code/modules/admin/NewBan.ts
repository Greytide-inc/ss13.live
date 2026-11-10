// Based on /tg/station's code/modules/admin/NewBan.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// NewBan.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalCMinutes", function InitGlobalCMinutes(f: Frame) {
	GLOB.CMinutes = null;
	this.gvars_datum_init_order += "CMinutes";
	return f.dot;
});

// NewBan.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobalBanlist", function InitGlobalBanlist(f: Frame) {
	GLOB.Banlist = null;
	this.gvars_datum_init_order += "Banlist";
	return f.dot;
});

// NewBan.dm:3
rt.def("/datum/controller/global_vars/proc/InitGlobalBanlist", function InitGlobalBanlist(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "Banlist";
	return f.dot;
});

// NewBan.dm:7
rt.def("/proc/CheckBan", function CheckBan(f: Frame, ckey: Value, id: Value, address: Value) {
	let appeal: Value = null, A: Value = null, matches: Value = null;
	if (!GLOB.Banlist) {
		LoadBans();
		if (!GLOB.Banlist) {
			return 0;
		}
	}
	f.dot = list();
	if (GLOB.config && GLOB.config.banappeals) {
		appeal = `\nFor more information on your ban, or to appeal, head to <a href='${GLOB.config.banappeals}'>${GLOB.config.banappeals}</a>`;
	}
	GLOB.Banlist.cd = "/base";
	if (rt.isIn(f, `${ckey}${id}`, GLOB.Banlist.dir)) {
		GLOB.Banlist.cd = `${ckey}${id}`;
		if (rt.at(GLOB.Banlist, "temp")) {
			if (!GetExp(rt.at(GLOB.Banlist, "minutes"))) {
				ClearTempbans();
				return 0;
			} else {
				rt.setAt(f.dot, "desc", `\nReason: ${rt.at(GLOB.Banlist, "reason")}\nExpires: ${GetExp(rt.at(GLOB.Banlist, "minutes"))}\nBy: ${rt.at(GLOB.Banlist, "bannedby")}${appeal}`);
			}
		} else {
			GLOB.Banlist.cd = `/base/${ckey}${id}`;
			rt.setAt(f.dot, "desc", `\nReason: ${rt.at(GLOB.Banlist, "reason")}\nExpires: <B>PERMENANT</B>\nBy: ${rt.at(GLOB.Banlist, "bannedby")}${appeal}`);
		}
		rt.setAt(f.dot, "reason", "ckey/id");
		return f.dot;
	} else {
		for (A of each(GLOB.Banlist.dir)) {
			GLOB.Banlist.cd = `/base/${A}`;
			matches = null;
			if (ckey == rt.at(GLOB.Banlist, "key")) {
				matches += "ckey";
			}
			if (id == rt.at(GLOB.Banlist, "id")) {
				if (matches) {
					matches += "/";
				}
				matches += "id";
			}
			if (address == rt.at(GLOB.Banlist, "ip")) {
				if (matches) {
					matches += "/";
				}
				matches += "ip";
			}
			if (matches) {
				if (rt.at(GLOB.Banlist, "temp")) {
					if (!GetExp(rt.at(GLOB.Banlist, "minutes"))) {
						ClearTempbans();
						return 0;
					} else {
						rt.setAt(f.dot, "desc", `\nReason: ${rt.at(GLOB.Banlist, "reason")}\nExpires: ${GetExp(rt.at(GLOB.Banlist, "minutes"))}\nBy: ${rt.at(GLOB.Banlist, "bannedby")}${appeal}`);
					}
				} else {
					rt.setAt(f.dot, "desc", `\nReason: ${rt.at(GLOB.Banlist, "reason")}\nExpires: <B>PERMENANT</B>\nBy: ${rt.at(GLOB.Banlist, "bannedby")}${appeal}`);
				}
				rt.setAt(f.dot, "reason", matches);
				return f.dot;
			}
		}
	}
	return 0;
});

// NewBan.dm:59
rt.def("/proc/UpdateTime", function UpdateTime(f: Frame) {
	GLOB.CMinutes = rt.world().realtime / 10 / 60;
	return 1;
});

// NewBan.dm:64
rt.def("/proc/LoadBans", function LoadBans(f: Frame) {
	GLOB.Banlist = new_(T("/savefile"), "data/banlist.bdb");
	log_admin("Loading Banlist");
	if (!rt.length(GLOB.Banlist.dir)) {
		log_admin("Banlist is empty.");
	}
	if (!GLOB.Banlist.dir.Find("base")) {
		log_admin("Banlist missing base dir.");
		GLOB.Banlist.dir.Add("base");
		GLOB.Banlist.cd = "/base";
	} else if (GLOB.Banlist.dir.Find("base")) {
		GLOB.Banlist.cd = "/base";
	}
	ClearTempbans();
	return 1;
});

// NewBan.dm:80
rt.def("/proc/ClearTempbans", function ClearTempbans(f: Frame) {
	let A: Value = null;
	UpdateTime();
	GLOB.Banlist.cd = "/base";
	for (A of each(GLOB.Banlist.dir)) {
		GLOB.Banlist.cd = `/base/${A}`;
		if (!rt.at(GLOB.Banlist, "key") || !rt.at(GLOB.Banlist, "id")) {
			RemoveBan(A);
			log_admin("Invalid Ban.");
			message_admins("Invalid Ban.");
			continue;
		}
		if (!rt.at(GLOB.Banlist, "temp")) {
			continue;
		}
		if (GLOB.CMinutes >= rt.at(GLOB.Banlist, "minutes")) {
			RemoveBan(A);
		}
	}
	return 1;
});

// NewBan.dm:102
rt.def("/proc/AddBan", function* AddBan(f: Frame, ckey: Value, computerid: Value, reason: Value, bannedby: Value, temp: Value, minutes: Value, address: Value) {
	let bantimestamp: Value = null;
	if (temp) {
		UpdateTime();
		bantimestamp = GLOB.CMinutes + minutes;
	}
	GLOB.Banlist.cd = "/base";
	if (GLOB.Banlist.dir.Find(`${ckey}${computerid}`)) {
		to_chat(f.usr, "<span class='danger'>Ban already exists.</span>");
		return 0;
	} else {
		GLOB.Banlist.dir.Add(`${ckey}${computerid}`);
		GLOB.Banlist.cd = `/base/${ckey}${computerid}`;
		rt.op(f, "OutputReference", [rt.R.index], [GLOB.Banlist, "key", ckey], false);
		rt.op(f, "OutputReference", [rt.R.index], [GLOB.Banlist, "id", computerid], false);
		rt.op(f, "OutputReference", [rt.R.index], [GLOB.Banlist, "ip", address], false);
		rt.op(f, "OutputReference", [rt.R.index], [GLOB.Banlist, "reason", reason], false);
		rt.op(f, "OutputReference", [rt.R.index], [GLOB.Banlist, "bannedby", bannedby], false);
		rt.op(f, "OutputReference", [rt.R.index], [GLOB.Banlist, "temp", temp], false);
		if (temp) {
			rt.op(f, "OutputReference", [rt.R.index], [GLOB.Banlist, "minutes", bantimestamp], false);
		}
		if (!temp) {
			log_world(`[server-ban] ${ckey} ${address ? address : "-"}`); // tools/server.mjs saves permanent bans to its own file
		} else {
		}
	}
	return 1;
}, true);

// NewBan.dm:130
rt.def("/proc/RemoveBan", function RemoveBan(f: Frame, foldername: Value) {
	let A: Value = null;
	GLOB.Banlist.cd = `/base/${foldername}`;
	let key: Value = rt.input(f, rt.R.index, null, [GLOB.Banlist, "key"]);
	let id: Value = rt.input(f, rt.R.index, null, [GLOB.Banlist, "id"]);
	GLOB.Banlist.cd = "/base";
	if (!GLOB.Banlist.dir.Remove(foldername)) {
		return 0;
	}
	log_world(`[server-unban] ${key}`); // tools/server.mjs drops the key (and the addresses banned with it) from its own file
	if (!f.usr) {
		log_admin_private(`Ban Expired: ${key}`);
		message_admins(`Ban Expired: ${key}`);
	} else {
		ban_unban_log_save(`${key_name(f.usr)} unbanned ${key}`);
		log_admin_private(`${key_name(f.usr)} unbanned ${key}`);
		message_admins(`${key_name_admin(f.usr)} unbanned: ${key}`);
	}
	for (A of each(GLOB.Banlist.dir)) {
		GLOB.Banlist.cd = `/base/${A}`;
		if (key == rt.at(GLOB.Banlist, "key")) {
			GLOB.Banlist.cd = "/base";
			GLOB.Banlist.dir.Remove(A);
			continue;
		}
	}
	return 1;
});

// NewBan.dm:156
rt.def("/proc/GetExp", function GetExp(f: Frame, minutes: Value) {
	let exp: Value = null, timeleftstring: Value = null;
	UpdateTime();
	if ((exp = minutes - GLOB.CMinutes) <= 0) {
		return 0;
	} else {
		if (exp >= 1440) {
			timeleftstring = `${round(exp / 1440, 0.1)} Days`;
		} else if (exp >= 60) {
			timeleftstring = `${round(exp / 60, 0.1)} Hours`;
		} else {
			timeleftstring = `${exp} Minutes`;
		}
		return timeleftstring;
	}
});

// NewBan.dm:174
rt.def("/datum/admins/proc/unbanpanel", function unbanpanel(f: Frame) {
	let dat: Value = null, A: Value = null, ref: Value = null, key: Value = null, id: Value = null, ip: Value = null, reason: Value = null, by: Value = null, expiry: Value = null;
	let count: Value = 0;
	GLOB.Banlist.cd = "/base";
	for (A of each(GLOB.Banlist.dir)) {
		count++;
		GLOB.Banlist.cd = `/base/${A}`;
		ref = fmt("＃", [this]);
		key = rt.at(GLOB.Banlist, "key");
		id = rt.at(GLOB.Banlist, "id");
		ip = rt.at(GLOB.Banlist, "ip");
		reason = rt.at(GLOB.Banlist, "reason");
		by = rt.at(GLOB.Banlist, "bannedby");
		expiry = null;
		if (rt.at(GLOB.Banlist, "temp")) {
			if (!(expiry = GetExp(rt.at(GLOB.Banlist, "minutes")))) {
				expiry = "Removal Pending";
			}
		} else {
			expiry = "Permaban";
		}
		dat += `<tr><td><A href='?src=${ref};unbanf=${key}${id}'>(U)</A><A href='?src=${ref};unbane=${key}${id}'>(E)</A> Key: <B>${key}</B></td><td>ComputerID: <B>${id}</B></td><td>IP: <B>${ip}</B></td><td> ${expiry}</td><td>(By: ${by})</td><td>(Reason: ${reason})</td></tr>`;
	}
	dat += "</table>";
	dat = `<HR><B>Bans:</B> <FONT COLOR=blue>(U) = Unban , (E) = Edit Ban</FONT> - <FONT COLOR=green>(${count} Bans)</FONT><HR><table border=1 rules=all frame=void cellspacing=0 cellpadding=3 >${dat}`;
	rt.op(f, "Browse", [], [f.usr, dat, "window=unbanp;size=875x400"], false);
	return f.dot;
});
