// From code/modules/admin/IsBanned.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /world/proc/IsBanned  (code/modules/admin/IsBanned.dm:10)
rt.def("/world/proc/IsBanned", function IsBanned(f: Frame) {
	let admin: Value = null, ckey: Value = null, ckeytext: Value = null, msg: Value = null, ipquery: Value = null, cidquery: Value = null, query_ban_check: Value = null, pckey: Value = null, ackey: Value = null, reason: Value = null, expiration: Value = null, duration: Value = null, bantime: Value = null, bantype: Value = null, banid: Value = null, expires: Value = null, desc: Value = null, ban: Value = null, bannedckey: Value = null, newmatch: Value = null, C: Value = null, cachedban: Value = null, newmatches: Value = null, newmatches_connected: Value = null, newmatches_admin: Value = null, desc_7: Value = null;
	f.vars = () => [admin, ckey, ckeytext, msg, ipquery, cidquery, query_ban_check, pckey, ackey, reason, expiration, duration, bantime, bantype, banid, expires, desc, ban, bannedckey, newmatch, C, cachedban, newmatches, newmatches_connected, newmatches_admin, desc_7];
	if (((!truthy(live(f.args[0])) || !truthy(live(f.args[1]))) || !truthy(live(f.args[2])))) {
		rt.call(f, P("/proc/log_access"), null, [fmt("Failed Login (invalid data): ＀ ＀-＀", [live(f.args[0]), live(f.args[1]), live(f.args[2])])]);
		return rt.alist(f, ["reason", "invalid login data", "desc", fmt("Error: Could not check ban status, Please try again. Error message: Your computer provided invalid or blank information to the server on connection (byond username, IP, and Computer ID.) Provided information for reference: Username:'＀' IP:'＀' Computer ID:'＀'. (If you continue to get this error, please restart byond or contact byond support.)", [live(f.args[0]), live(f.args[1]), live(f.args[2])])]);
	}
	if (isEqual(rt.call(f, P("/proc/text2num"), null, [live(f.args[2])]), 2147483648)) {
		rt.call(f, P("/proc/log_access"), null, [fmt("Failed Login (invalid cid): ＀ ＀-＀", [live(f.args[0]), live(f.args[1]), live(f.args[2])])]);
		return rt.alist(f, ["reason", "invalid login data", "desc", "Error: Could not check ban status, Please try again. Error message: Your computer provided an invalid Computer ID.)"]);
	}
	admin = 0;
	if ((truthy((rt.isIn(f, (ckey = rt.call(f, P("/proc/ckey"), null, [live(f.args[0])])), rt.gl("admin_datums")) ? 1 : 0)) || truthy((rt.isIn(f, live(ckey), rt.gl("deadmins")) ? 1 : 0)))) {
		admin = 1;
	}
	if (truthy(rt.call(f, P("/proc/IsGuestKey"), null, [live(f.args[0])]))) {
		if (!truthy(rt.gl("guests_allowed"))) {
			rt.call(f, P("/proc/log_access"), null, [fmt("Failed Login: ＀ - Guests not allowed", [live(f.args[0])])]);
			return rt.alist(f, ["reason", "guest", "desc", "\nReason: Guests not allowed. Please sign in with a byond account."]);
		}
	}
	if (((truthy(rt.fv(f, "extreme_popcap", rt.gl("config"))) && rt.ge(rt.call(f, P("/proc/living_player_count"), null, []), rt.fv(f, "extreme_popcap", rt.gl("config")))) && !truthy(live(admin)))) {
		rt.call(f, P("/proc/log_access"), null, [fmt("Failed Login: ＀ - Population cap reached", [live(f.args[0])])]);
		return rt.alist(f, ["reason", "popcap", "desc", fmt("\nReason: ＀", [rt.fv(f, "extreme_popcap_message", rt.gl("config"))])]);
	}
	f.dot = rt.call(f, P("/proc/CheckBan"), null, [rt.call(f, P("/proc/ckey"), null, [live(f.args[0])]), live(f.args[2]), live(f.args[1])]);
	if (truthy(live(f.dot))) {
		if (truthy(live(admin))) {
			rt.call(f, P("/proc/log_admin"), null, [fmt("The admin ＀ has been allowed to bypass a matching ban on ＀", [live(f.args[0]), rt.at(live(f.dot), "key")])]);
			rt.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>The admin ＀ has been allowed to bypass a matching ban on ＀</span>", [live(f.args[0]), rt.at(live(f.dot), "key")])]);
			rt.call(f, P("/proc/addclientmessage"), null, [live(ckey), fmt("<span class='adminnotice'>You have been allowed to bypass a matching ban on ＀</span>", [rt.at(live(f.dot), "key")])]);
		} else {
			rt.call(f, P("/proc/log_access"), null, [fmt("Failed Login: ＀ ＀ ＀ - Banned ＀", [live(f.args[0]), live(f.args[2]), live(f.args[1]), rt.at(live(f.dot), "reason")])]);
			return live(f.dot);
		}
	}
	if (truthy((ban = rt.callSuper(f, [], rt.Args.Same)))) {
		bannedckey = "ERROR";
		if (truthy(rt.at(live(ban), "ckey"))) {
			bannedckey = rt.at(live(ban), "ckey");
		}
		newmatch = 0;
		C = rt.index(rt.gl("directory"), live(ckey));
		if ((truthy((cachedban = rt.index(rt.fv(f, "cache", rt.gl("SSstickyban")), live(bannedckey)))) && truthy(rt.at(live(cachedban), "reverting")))) {
			return null;
		}
		if ((truthy(live(cachedban)) && !isEqual(live(ckey), live(bannedckey)))) {
			newmatch = 1;
			if (truthy(rt.at(live(cachedban), "keys"))) {
				if (truthy(rt.index(rt.at(live(cachedban), "keys"), live(ckey)))) {
					newmatch = 0;
				}
			}
			if (truthy(rt.index(rt.at(live(cachedban), "matches_this_round"), live(ckey)))) {
				newmatch = 0;
			}
		}
		if ((truthy(live(newmatch)) && truthy(live(cachedban)))) {
			newmatches = rt.at(live(cachedban), "matches_this_round");
			newmatches_connected = rt.at(live(cachedban), "existing_user_matches_this_round");
			newmatches_admin = rt.at(live(cachedban), "admin_matches_this_round");
			rt.setAt(live(newmatches), live(ckey), live(ckey));
			if (truthy(live(C))) {
				rt.setAt(live(newmatches_connected), live(ckey), live(ckey));
			}
			if (truthy(live(admin))) {
				rt.setAt(live(newmatches_admin), live(ckey), live(ckey));
			}
			if (((rt.gt(rt.len(f, live(newmatches)), 20) || rt.gt(rt.len(f, live(newmatches_connected)), 5)) || rt.gt(rt.len(f, live(newmatches_admin)), 2))) {
				if (truthy(rt.at(live(cachedban), "reverting"))) {
					return null;
				}
				rt.setAt(live(cachedban), "reverting", 1);
				rt.callName(f, rt.world(), "SetConfig", ["ban", live(bannedckey), null]);
				rt.call(f, P("/proc/log_game"), null, [fmt("Stickyban on ＀ detected as rogue, reverting to it's roundstart state", [live(bannedckey)])]);
				rt.call(f, P("/proc/message_admins"), null, [fmt("Stickyban on ＀ detected as rogue, reverting to it's roundstart state", [live(bannedckey)])]);
				rt.spawnTail(f, 5, "/world/proc/IsBanned: spawn at modules/admin/IsBanned.dm:165", admin, ckey, ckeytext, msg, ipquery, cidquery, query_ban_check, pckey, ackey, reason, expiration, duration, bantime, bantype, banid, expires, desc, ban, bannedckey, newmatch, C, cachedban, newmatches, newmatches_connected, newmatches_admin, desc_7);
				return null;
			}
		}
		if (truthy(live(admin))) {
			rt.call(f, P("/proc/log_admin"), null, [fmt("The admin ＀ has been allowed to bypass a matching host/sticky ban on ＀", [live(f.args[0]), live(bannedckey)])]);
			rt.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>The admin ＀ has been allowed to bypass a matching host/sticky ban on ＀</span>", [live(f.args[0]), live(bannedckey)])]);
			rt.call(f, P("/proc/addclientmessage"), null, [live(ckey), fmt("<span class='adminnotice'>You have been allowed to bypass a matching host/sticky ban on ＀</span>", [live(bannedckey)])]);
			return null;
		}
		if (truthy(live(C))) {
			rt.call(f, P("/proc/to_chat"), null, [live(C), "You are about to get disconnected for matching a sticky ban after you connected. If this turns out to be the ban evasion detection system going haywire, we will automatically detect this and revert the matches. if you feel that this is the case, please wait EXACTLY 6 seconds then reconnect using file -> reconnect to see if the match was reversed."]);
		}
		desc_7 = fmt("\nReason:(StickyBan) You, or another user of this computer or connection (＀) is banned from playing here. The ban reason is:\n＀\nThis ban was applied by ＀\nThis is a BanEvasion Detection System ban, if you think this ban is a mistake, please wait EXACTLY 6 seconds, then try again before filing an appeal.\n", [live(bannedckey), rt.at(live(ban), "message"), rt.at(live(ban), "admin")]);
		f.dot = rt.alist(f, ["reason", "Stickyban", "desc", live(desc_7)]);
		rt.call(f, P("/proc/log_access"), null, [fmt("Failed Login: ＀ ＀ ＀ - StickyBanned ＀ Target Username: ＀ Placed by ＀", [live(f.args[0]), live(f.args[2]), live(f.args[1]), rt.at(live(ban), "message"), live(bannedckey), rt.at(live(ban), "admin")])]);
	}
	return live(f.dot);
}, false, { args: ["key", "address", "computer_id"] });

// a spawn(5) body of /world/proc/IsBanned, a named tail so a world snapshot can hold it while it waits.
rt.tail("/world/proc/IsBanned: spawn at modules/admin/IsBanned.dm:165", function* (f: Frame, admin: Value, ckey: Value, ckeytext: Value, msg: Value, ipquery: Value, cidquery: Value, query_ban_check: Value, pckey: Value, ackey: Value, reason: Value, expiration: Value, duration: Value, bantime: Value, bantype: Value, banid: Value, expires: Value, desc: Value, ban: Value, bannedckey: Value, newmatch: Value, C: Value, cachedban: Value, newmatches: Value, newmatches_connected: Value, newmatches_admin: Value, desc_7: Value) {
	f.vars = () => [admin, ckey, ckeytext, msg, ipquery, cidquery, query_ban_check, pckey, ackey, reason, expiration, duration, bantime, bantype, banid, expires, desc, ban, bannedckey, newmatch, C, cachedban, newmatches, newmatches_connected, newmatches_admin, desc_7];
	yield* g.callName(f, rt.world(), "SetConfig", ["ban", live(bannedckey), null]);
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	yield* g.callName(f, rt.world(), "SetConfig", ["ban", live(bannedckey), null]);
	rt.setAt(live(cachedban), "matches_this_round", rt.list());
	rt.setAt(live(cachedban), "existing_user_matches_this_round", rt.list());
	rt.setAt(live(cachedban), "admin_matches_this_round", rt.list());
	(cachedban = rt.modify(live(cachedban), "reverting", subtract));
	yield* g.callName(f, rt.world(), "SetConfig", ["ban", live(bannedckey), (yield* g.call(f, P("/proc/list2stickyban"), null, [live(cachedban)]))]);
	return null;
});
