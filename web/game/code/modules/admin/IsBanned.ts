// Based on /tg/station's code/modules/admin/IsBanned.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { P } = rt;


// IsBanned.dm:10
rt.def("/world/proc/IsBanned", function IsBanned(f: Frame, key: Value, address: Value, computer_id: Value) {
	let ckey: Value = null, ckeytext: Value = null, msg: Value = null, ipquery: Value = null, cidquery: Value = null, query_ban_check: Value = null, pckey: Value = null, ackey: Value = null, reason: Value = null, expiration: Value = null, duration: Value = null, bantime: Value = null, bantype: Value = null, banid: Value = null, expires: Value = null, desc: Value = null, ban: Value = null, bannedckey: Value = null, newmatch: Value = null, C: Value = null, cachedban: Value = null, newmatches: Value = null, newmatches_connected: Value = null, newmatches_admin: Value = null, desc_7: Value = null;
	if (!key || !address || !computer_id) {
		log_access(`Failed Login (invalid data): ${key} ${address}-${computer_id}`);
		return rt.alist(f, ["reason", "invalid login data", "desc", `Error: Could not check ban status, Please try again. Error message: Your computer provided invalid or blank information to the server on connection (byond username, IP, and Computer ID.) Provided information for reference: Username:'${key}' IP:'${address}' Computer ID:'${computer_id}'. (If you continue to get this error, please restart byond or contact byond support.)`]);
	}
	if (text2num(computer_id) == 2147483648) {
		log_access(`Failed Login (invalid cid): ${key} ${address}-${computer_id}`);
		return rt.alist(f, ["reason", "invalid login data", "desc", "Error: Could not check ban status, Please try again. Error message: Your computer provided an invalid Computer ID.)"]);
	}
	let admin: Value = 0;
	if (rt.isIn(f, (ckey = rt.call(f, P("/proc/ckey"), null, [key])), GLOB.admin_datums) || rt.isIn(f, ckey, GLOB.deadmins)) {
		admin = 1;
	}
	if (IsGuestKey(key)) {
		if (!GLOB.guests_allowed) {
			log_access(`Failed Login: ${key} - Guests not allowed`);
			return rt.alist(f, ["reason", "guest", "desc", "\nReason: Guests not allowed. Please sign in with a byond account."]);
		}
	}
	if (GLOB.config.extreme_popcap && living_player_count() >= GLOB.config.extreme_popcap && !admin) {
		log_access(`Failed Login: ${key} - Population cap reached`);
		return rt.alist(f, ["reason", "popcap", "desc", `\nReason: ${GLOB.config.extreme_popcap_message}`]);
	}
	f.dot = CheckBan(rt.call(f, P("/proc/ckey"), null, [key]), computer_id, address);
	if (f.dot) {
		if (admin) {
			log_admin(`The admin ${key} has been allowed to bypass a matching ban on ${rt.at(f.dot, "key")}`);
			message_admins(`<span class='adminnotice'>The admin ${key} has been allowed to bypass a matching ban on ${rt.at(f.dot, "key")}</span>`);
			addclientmessage(ckey, `<span class='adminnotice'>You have been allowed to bypass a matching ban on ${rt.at(f.dot, "key")}</span>`);
		} else {
			log_access(`Failed Login: ${key} ${computer_id} ${address} - Banned ${rt.at(f.dot, "reason")}`);
			return f.dot;
		}
	}
	if (ban = parent_proc()) {
		bannedckey = "ERROR";
		if (rt.at(ban, "ckey")) {
			bannedckey = rt.at(ban, "ckey");
		}
		newmatch = 0;
		C = rt.index(GLOB.directory, ckey);
		if ((cachedban = rt.index(GLOB.SSstickyban.cache, bannedckey)) && rt.at(cachedban, "reverting")) {
			return null;
		}
		if (cachedban && ckey != bannedckey) {
			newmatch = 1;
			if (rt.at(cachedban, "keys")) {
				if (rt.index(rt.at(cachedban, "keys"), ckey)) {
					newmatch = 0;
				}
			}
			if (rt.index(rt.at(cachedban, "matches_this_round"), ckey)) {
				newmatch = 0;
			}
		}
		if (newmatch && cachedban) {
			newmatches = rt.at(cachedban, "matches_this_round");
			newmatches_connected = rt.at(cachedban, "existing_user_matches_this_round");
			newmatches_admin = rt.at(cachedban, "admin_matches_this_round");
			rt.setAt(newmatches, ckey, ckey);
			if (C) {
				rt.setAt(newmatches_connected, ckey, ckey);
			}
			if (admin) {
				rt.setAt(newmatches_admin, ckey, ckey);
			}
			if (rt.len(f, newmatches) > 20 || rt.len(f, newmatches_connected) > 5 || rt.len(f, newmatches_admin) > 2) {
				if (rt.at(cachedban, "reverting")) {
					return null;
				}
				rt.setAt(cachedban, "reverting", 1);
				rt.world().SetConfig("ban", bannedckey, null);
				log_game(`Stickyban on ${bannedckey} detected as rogue, reverting to it's roundstart state`);
				message_admins(`Stickyban on ${bannedckey} detected as rogue, reverting to it's roundstart state`);
				rt.spawnTail(f, 5, "/world/proc/IsBanned: spawn at modules/admin/IsBanned.dm:165", admin, ckey, ckeytext, msg, ipquery, cidquery, query_ban_check, pckey, ackey, reason, expiration, duration, bantime, bantype, banid, expires, desc, ban, bannedckey, newmatch, C, cachedban, newmatches, newmatches_connected, newmatches_admin, desc_7);
				return null;
			}
		}
		if (admin) {
			log_admin(`The admin ${key} has been allowed to bypass a matching host/sticky ban on ${bannedckey}`);
			message_admins(`<span class='adminnotice'>The admin ${key} has been allowed to bypass a matching host/sticky ban on ${bannedckey}</span>`);
			addclientmessage(ckey, `<span class='adminnotice'>You have been allowed to bypass a matching host/sticky ban on ${bannedckey}</span>`);
			return null;
		}
		if (C) {
			to_chat(C, "You are about to get disconnected for matching a sticky ban after you connected. If this turns out to be the ban evasion detection system going haywire, we will automatically detect this and revert the matches. if you feel that this is the case, please wait EXACTLY 6 seconds then reconnect using file -> reconnect to see if the match was reversed.");
		}
		desc_7 = `\nReason:(StickyBan) You, or another user of this computer or connection (${bannedckey}) is banned from playing here. The ban reason is:\n${rt.at(ban, "message")}\nThis ban was applied by ${rt.at(ban, "admin")}\nThis is a BanEvasion Detection System ban, if you think this ban is a mistake, please wait EXACTLY 6 seconds, then try again before filing an appeal.\n`;
		f.dot = rt.alist(f, ["reason", "Stickyban", "desc", desc_7]);
		log_access(`Failed Login: ${key} ${computer_id} ${address} - StickyBanned ${rt.at(ban, "message")} Target Username: ${bannedckey} Placed by ${rt.at(ban, "admin")}`);
	}
	return f.dot;
}, false);

// a spawn(5) body of /world/proc/IsBanned, a named tail so a world snapshot can hold it while it waits.
rt.tail("/world/proc/IsBanned: spawn at modules/admin/IsBanned.dm:165", function* (f: Frame, admin: Value, ckey: Value, ckeytext: Value, msg: Value, ipquery: Value, cidquery: Value, query_ban_check: Value, pckey: Value, ackey: Value, reason: Value, expiration: Value, duration: Value, bantime: Value, bantype: Value, banid: Value, expires: Value, desc: Value, ban: Value, bannedckey: Value, newmatch: Value, C: Value, cachedban: Value, newmatches: Value, newmatches_connected: Value, newmatches_admin: Value, desc_7: Value) {
	rt.world().SetConfig("ban", bannedckey, null);
	yield* sleep(1);
	rt.world().SetConfig("ban", bannedckey, null);
	rt.setAt(cachedban, "matches_this_round", list());
	rt.setAt(cachedban, "existing_user_matches_this_round", list());
	rt.setAt(cachedban, "admin_matches_this_round", list());
	cachedban -= "reverting";
	rt.world().SetConfig("ban", bannedckey, list2stickyban(cachedban));
	return null;
});
