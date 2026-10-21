// From code/modules/client/client_procs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/Topic  (code/modules/client/client_procs.dm:29)  may sleep
rt.def("/client/proc/Topic", function* Topic(f: Frame) {
	let job: Value = null, minute: Value = null, msg: Value = null, second: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [job, minute, msg, second, $0, $1, $2, $3];
	if ((!truthy(live(f.usr)) || !isEqual(live(f.usr), rt.sv(f, "mob")))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "asset_cache_confirm_arrival"))) {
		if (((truthy((job = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "asset_cache_confirm_arrival")])))) && rt.le(live(job), rt.sv(f, "last_asset_job"))) && !truthy((rt.isIn(f, live(job), rt.sv(f, "completed_asset_jobs")) ? 1 : 0)))) {
			rt.modSrcVar(f, "completed_asset_jobs", live(job), add);
			return live(f.dot);
		} else {
			if (truthy((rt.isIn(f, live(job), rt.sv(f, "completed_asset_jobs")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>An error has been detected in how your client is receiving resources. Attempting to correct.... (If you keep seeing these messages you might want to close byond and reconnect)</span>"]);
				rt.op(f, "Browse", [], [live(f.src), "...", "window=asset_cache_browser"], false);
			}
		}
	}
	if ((!truthy(rt.sv(f, "holder")) && truthy(rt.fv(f, "minutetopiclimit", rt.gl("config"))))) {
		minute = (yield* g.call(f, P("/proc/round"), null, [rt.worldTime(f), 600]));
		if (!truthy(rt.sv(f, "topiclimiter"))) {
			rt.setSv(f, "topiclimiter", (yield* g.new_(f, T("/list"), [5])));
		}
		if (!isEqual(live(minute), rt.index(rt.sv(f, "topiclimiter"), 3))) {
			rt.setAt(rt.sv(f, "topiclimiter"), 3, live(minute));
			rt.setAt(rt.sv(f, "topiclimiter"), 4, 0);
		}
		rt.modAt(rt.sv(f, "topiclimiter"), 4, 1, add);
		if (rt.gt(rt.index(rt.sv(f, "topiclimiter"), 4), rt.fv(f, "minutetopiclimit", rt.gl("config")))) {
			msg = "Your previous action was ignored because you've done too many in a minute.";
			if (!isEqual(live(minute), rt.index(rt.sv(f, "topiclimiter"), 5))) {
				rt.setAt(rt.sv(f, "topiclimiter"), 5, live(minute));
				msg = rt.modify(live(msg), " Administrators have been informed.", add);
				yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ Has hit the per-minute topic limit of ＀ topic calls in a given game minute", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), rt.fv(f, "minutetopiclimit", rt.gl("config"))])]);
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ ＀ ＀ Has hit the per-minute topic limit of ＀ topic calls in a given game minute", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.usr)]), fmt("(<a href='?_src_=holder;boot2=＃'>KICK</a>)", [live(f.usr)]), rt.fv(f, "minutetopiclimit", rt.gl("config"))])]);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='danger'>＀</span>", [live(msg)])]);
			return live(f.dot);
		}
	}
	if ((!truthy(rt.sv(f, "holder")) && truthy(rt.fv(f, "secondtopiclimit", rt.gl("config"))))) {
		second = (yield* g.call(f, P("/proc/round"), null, [rt.worldTime(f), 10]));
		if (!truthy(rt.sv(f, "topiclimiter"))) {
			rt.setSv(f, "topiclimiter", (yield* g.new_(f, T("/list"), [5])));
		}
		if (!isEqual(live(second), rt.index(rt.sv(f, "topiclimiter"), 1))) {
			rt.setAt(rt.sv(f, "topiclimiter"), 1, live(second));
			rt.setAt(rt.sv(f, "topiclimiter"), 2, 0);
		}
		rt.modAt(rt.sv(f, "topiclimiter"), 2, 1, add);
		if (rt.gt(rt.index(rt.sv(f, "topiclimiter"), 2), rt.fv(f, "secondtopiclimit", rt.gl("config")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>Your previous action was ignored because you've done too many in a second</span>"]);
			return live(f.dot);
		}
	}
	$0 = (yield* g.call(f, P("/proc/time_stamp"), null, ["show_ds", 1], rt.Args.Named));
	$1 = live(f.src);
	$2 = live(f.usr);
	if (truthy(live(f.args[2]))) {
		$3 = fmt("＀ ", [live(f.args[2])]);
	} else {
		$3 = "";
	}
	rt.op(f, "OutputReference", [rt.R.glob(110)], [fmt("<small>＀ ＀ (usr:＀)</small> || ＀＀<br>", [$0, $1, $2, $3, live(f.args[0])])], false);
	if (truthy(rt.at(live(f.args[1]), "priv_msg"))) {
		yield* g.srcCall(f, "cmd_admin_pm", rt.at(live(f.args[1]), "priv_msg"), null);
		return live(f.dot);
	}
	$0 = rt.at(live(f.args[1]), "_src_");
	if ($0 === "holder") {
		f.args[2] = rt.sv(f, "holder");
	} else if ($0 === "usr") {
		f.args[2] = rt.sv(f, "mob");
	} else if ($0 === "prefs") {
		if (truthy(rt.sv(f, "inprefs"))) {
			return live(f.dot);
		}
		rt.setSv(f, "inprefs", 1);
		f.dot = (yield* g.callName(f, rt.sv(f, "prefs"), "process_link", [live(f.usr), live(f.args[1])]));
		rt.setSv(f, "inprefs", 0);
		return live(f.dot);
	} else if ($0 === "vars") {
		return (yield* g.srcCall(f, "view_var_Topic", live(f.args[0]), live(f.args[1]), live(f.args[2])));
	} else if ($0 === "chat") {
		return (yield* g.callName(f, rt.sv(f, "chatOutput"), "Topic", [live(f.args[0]), live(f.args[1])]));
	}
	$0 = rt.at(live(f.args[1]), "action");
	if ($0 === "openLink") {
		rt.op(f, "Link", [], [live(f.src), rt.at(live(f.args[1]), "link")], false);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["href", "href_list", "hsrc"] });

// /client/proc/is_content_unlocked  (code/modules/client/client_procs.dm:107)
rt.def("/client/proc/is_content_unlocked", function is_content_unlocked(f: Frame) {
	if (!truthy(rt.fv(f, "unlock_content", rt.sv(f, "prefs")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "Become a BYOND member to access member-perks and features, as well as support the engine that makes this game possible. Only 10 bucks for 3 months! <a href='http://www.byond.com/membership'>Click Here to find out more</a>."]);
		return 0;
	}
	return 1;
});

// /client/proc/handle_spam_prevention  (code/modules/client/client_procs.dm:113)
rt.def("/client/proc/handle_spam_prevention", function handle_spam_prevention(f: Frame, message: Value, mute_type: Value) {
	if (((truthy(rt.fv(f, "automute_on", rt.gl("config"))) && !truthy(rt.sv(f, "holder"))) && isEqual(rt.fv(f, "last_message", live(f.src)), live(message)))) {
		rt.incField(f, live(f.src), "last_message_count", 1, true);
		if (rt.ge(rt.fv(f, "last_message_count", live(f.src)), 10)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You have exceeded the spam filter limit for identical messages. An auto-mute was applied.</span>"]);
			rt.call(f, P("/proc/cmd_admin_mute"), null, [live(f.src), live(mute_type), 1]);
			return 1;
		}
		if (rt.ge(rt.fv(f, "last_message_count", live(f.src)), 5)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You are nearing the spam filter limit for identical messages.</span>"]);
			return 0;
		}
	} else {
		rt.setSv(f, "last_message", live(message));
		rt.setFv(f, "last_message_count", live(f.src), 0);
		return 0;
	}
	return f.dot;
});

// /client/proc/AllowUpload  (code/modules/client/client_procs.dm:129)
rt.def("/client/proc/AllowUpload", function AllowUpload(f: Frame, filename: Value, filelength: Value) {
	if (rt.gt(live(filelength), 1048576)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<font color='red'>Error: AllowUpload(): File Upload too large. Upload Limit: ＀KiB.</font>", [1024])]);
		return 0;
	}
	return 1;
});

// /client/proc/New  (code/modules/client/client_procs.dm:151)  may sleep
rt.def("/client/proc/New", function* New(f: Frame) {
	let tdata: Value = null, localhost_addresses: Value = null, localhost_rank: Value = null, localhost_holder: Value = null, autorank: Value = null, R: Value = null, D: Value = null, alert_mob_dupe_login: Value = null, I: Value = null, C: Value = null, matches: Value = null, cached_player_age: Value = null, message: Value = null, topmenus: Value = null, thing: Value = null, topmenu: Value = null, topmenuname: Value = null, tree: Value = null, entries: Value = null, child: Value = null, verbpath: Value = null, menuitem: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $e: any;
	f.vars = () => [tdata, localhost_addresses, localhost_rank, localhost_holder, autorank, R, D, alert_mob_dupe_login, I, C, matches, cached_player_age, message, topmenus, thing, topmenu, topmenuname, tree, entries, child, verbpath, menuitem, $0, $1, $2, $3, $4, $5, $e];
	tdata = live(f.args[0]);
	rt.setSv(f, "chatOutput", (yield* g.new_(f, T("/datum/chatOutput"), [live(f.src)])));
	f.args[0] = null;
	if ((!isEqual(rt.sv(f, "connection"), "seeker") && !isEqual(rt.sv(f, "connection"), "web"))) {
		return null;
	}
	rt.modGl("clients", live(f.src), add);
	rt.setAt(rt.gl("directory"), rt.sv(f, "ckey"), live(f.src));
	yield* g.callName(f, rt.gl("ahelp_tickets"), "ClientLogin", [live(f.src)]);
	localhost_addresses = rt.list("127.0.0.1", "::1"); // offline play is your own game; tools/server.mjs gives 127.0.0.1 only to admins (by secret key), everyone else their real address
	if ((truthy(rt.sv(f, "address")) && truthy((rt.isIn(f, rt.sv(f, "address"), live(localhost_addresses)) ? 1 : 0)))) {
		if (truthy((localhost_rank = (yield* g.new_(f, T("/datum/admin_rank"), ["!localhost!", 65535]))))) {
			yield* g.callName(f, (localhost_holder = (yield* g.new_(f, T("/datum/admins"), [live(localhost_rank), rt.sv(f, "ckey")]))), "associate", [live(f.src)]);
		}
	}
	if (truthy(rt.fv(f, "autoadmin", rt.gl("config")))) {
		if (!truthy(rt.index(rt.gl("admin_datums"), rt.sv(f, "ckey")))) {
			autorank = null;
			R = null;
			rt.forList(f, 0, rt.gl("admin_ranks"), T("/datum/admin_rank"));
			while (($e = rt.next(f, 0)) !== undefined) {
				R = $e;
				if (isEqual(rt.fv(f, "name", live(R)), rt.fv(f, "autoadmin_rank", rt.gl("config")))) {
					autorank = live(R);
					break;
				}
			}
			rt.endFor(f, 0);
			if (!truthy(live(autorank))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "Autoadmin rank not found"]);
			} else {
				D = (yield* g.new_(f, T("/datum/admins"), [live(autorank), rt.sv(f, "ckey")]));
				rt.setAt(rt.gl("admin_datums"), rt.sv(f, "ckey"), live(D));
			}
		}
	}
	rt.setSv(f, "holder", rt.index(rt.gl("admin_datums"), rt.sv(f, "ckey")));
	if (truthy(rt.sv(f, "holder"))) {
		(rt.modGl("admins", live(f.src), rt.bitOr));
		rt.setFv(f, "owner", rt.sv(f, "holder"), live(f.src));
	}
	rt.setSv(f, "prefs", rt.index(rt.gl("preferences_datums"), rt.sv(f, "ckey")));
	if (!truthy(rt.sv(f, "prefs"))) {
		rt.setSv(f, "prefs", (yield* g.new_(f, T("/datum/preferences"), [live(f.src)])));
		rt.setAt(rt.gl("preferences_datums"), rt.sv(f, "ckey"), rt.sv(f, "prefs"));
	}
	rt.setFv(f, "last_ip", rt.sv(f, "prefs"), rt.sv(f, "address"));
	rt.setFv(f, "last_id", rt.sv(f, "prefs"), rt.sv(f, "computer_id"));
	if (((rt.ge(rt.fv(f, "byond_version", rt.world()), 511) && rt.ge(rt.sv(f, "byond_version"), 511)) && truthy(rt.fv(f, "clientfps", rt.sv(f, "prefs"))))) {
		rt.setAt(rt.sv(f, "vars"), "fps", rt.fv(f, "clientfps", rt.sv(f, "prefs")));
	}
	yield* g.srcCall(f, "sethotkeys", 1);
	$0 = (yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]));
	if (truthy(rt.sv(f, "address"))) {
		$1 = rt.sv(f, "address");
	} else {
		$1 = "localhost";
	}
	yield* g.call(f, P("/proc/log_access"), null, [fmt("Login: ＀ from ＀-＀ || BYOND v＀", [$0, $1, rt.sv(f, "computer_id"), rt.sv(f, "byond_version")])]);
	alert_mob_dupe_login = 0;
	if (truthy(rt.fv(f, "log_access", rt.gl("config")))) {
		I = null;
		rt.forList(f, 0, rt.gl("clients"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if ((!truthy(live(I)) || isEqual(live(I), live(f.src)))) {
				continue;
			}
			if ((truthy(rt.gv(f, "key", (C = live(I)))) && !isEqual(rt.fv(f, "key", live(C)), rt.sv(f, "key")))) {
				matches = null;
				if (isEqual(rt.fv(f, "address", live(C)), rt.sv(f, "address"))) {
					matches = rt.modify(live(matches), fmt("IP (＀)", [rt.sv(f, "address")]), add);
				}
				if (isEqual(rt.fv(f, "computer_id", live(C)), rt.sv(f, "computer_id"))) {
					if (truthy(live(matches))) {
						matches = rt.modify(live(matches), " and ", add);
					}
					matches = rt.modify(live(matches), fmt("ID (＀)", [rt.sv(f, "computer_id")]), add);
					alert_mob_dupe_login = 1;
				}
				if (truthy(live(matches))) {
					if (truthy(live(C))) {
						yield* g.call(f, P("/proc/message_admins"), null, [fmt("<font color='red'><B>Notice: </B><font color='blue'>＀ has the same ＀ as ＀.</font>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), live(matches), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(C)]))])]);
						yield* g.call(f, P("/proc/log_access"), null, [fmt("Notice: ＀ has the same ＀ as ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), live(matches), (yield* g.call(f, P("/proc/key_name"), null, [live(C)]))])]);
					} else {
						yield* g.call(f, P("/proc/message_admins"), null, [fmt("<font color='red'><B>Notice: </B><font color='blue'>＀ has the same ＀ as ＀ (no longer logged in). </font>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), live(matches), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(C)]))])]);
						yield* g.call(f, P("/proc/log_access"), null, [fmt("Notice: ＀ has the same ＀ as ＀ (no longer logged in).", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), live(matches), (yield* g.call(f, P("/proc/key_name"), null, [live(C)]))])]);
					}
				}
			}
		}
		rt.endFor(f, 0);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, rt.sv(f, "chatOutput"), "start", []);
	if (truthy(live(alert_mob_dupe_login))) {
		yield* g.call(f, P("/proc/alert"), null, [rt.sv(f, "mob"), "You have logged in already with another key this round, please log out of this one NOW or risk being banned!"]);
	}
	rt.setSv(f, "connection_time", rt.worldTime(f));
	rt.setSv(f, "connection_realtime", rt.fv(f, "realtime", rt.world()));
	rt.setSv(f, "connection_timeofday", rt.fv(f, "timeofday", rt.world()));
	yield* g.call(f, P("/proc/winset"), null, [live(f.src), null, "command=\".configure graphics-hwmode on\""]);
	if (rt.lt(rt.sv(f, "byond_version"), rt.fv(f, "client_error_version", rt.gl("config")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><b>Your version of byond is too old:</b></span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), rt.fv(f, "client_error_message", rt.gl("config"))]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Your version: ＀", [rt.sv(f, "byond_version")])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Required version: ＀ or later", [rt.fv(f, "client_error_version", rt.gl("config"))])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Visit http://www.byond.com/download/ to get the latest version of byond."]);
		if (truthy(rt.sv(f, "holder"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Because you are an admin, you are being allowed to walk past this limitation, But it is still STRONGLY suggested you upgrade"]);
		} else {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return 0;
		}
	} else {
		if (rt.lt(rt.sv(f, "byond_version"), rt.fv(f, "client_warn_version", rt.gl("config")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><b>Your version of byond may be getting out of date:</b></span>"]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), rt.fv(f, "client_warn_message", rt.gl("config"))]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Your version: ＀", [rt.sv(f, "byond_version")])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Required version to remove this message: ＀ or later", [rt.fv(f, "client_warn_version", rt.gl("config"))])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Visit http://www.byond.com/download/ to get the latest version of byond."]);
		}
	}
	if ((isEqual(rt.sv(f, "connection"), "web") && !truthy(rt.sv(f, "holder")))) {
		if (!truthy(rt.fv(f, "allowwebclient", rt.gl("config")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Web client is disabled"]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return 0;
		}
		if ((truthy(rt.fv(f, "webclientmembersonly", rt.gl("config"))) && !truthy((yield* g.srcCall(f, "IsByondMember"))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Sorry, but the web client is restricted to byond members only."]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return 0;
		}
	}
	if (((isEqual(rt.fv(f, "address", rt.world()), rt.sv(f, "address")) || !truthy(rt.sv(f, "address"))) && !truthy(rt.gl("host")))) {
		rt.setGl("host", rt.sv(f, "key"));
		yield* g.callName(f, rt.world(), "update_status", []);
	}
	if (truthy(rt.sv(f, "holder"))) {
		yield* g.srcCall(f, "add_admin_verbs");
		yield* g.srcCall(f, "adminGreet");
	}
	yield* g.srcCall(f, "send_resources");
	if (!truthy(rt.gl("void"))) {
		rt.setGl("void", (yield* g.new_(f, T("/obj/screen/click_catcher"), [])));
	}
	rt.modSrcVar(f, "screen", rt.gl("void"), add);
	if (!isEqual(rt.fv(f, "lastchangelog", rt.sv(f, "prefs")), rt.gl("changelog_hash"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='info'>You have unread updates in the changelog.</span>"]);
		if (truthy(rt.fv(f, "aggressive_changelog", rt.gl("config")))) {
			yield* g.srcCall(f, "changelog");
		} else {
			yield* g.call(f, P("/proc/winset"), null, [live(f.src), "infowindow.changelog", "font-style=bold"]);
		}
	}
	if (truthy((rt.isIn(f, rt.sv(f, "ckey"), rt.gl("clientmessages")) ? 1 : 0))) {
		message = null;
		rt.forList(f, 0, rt.index(rt.gl("clientmessages"), rt.sv(f, "ckey")));
		while (($e = rt.next(f, 0)) !== undefined) {
			message = $e;
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), live(message)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.gl("clientmessages"), "Remove", [rt.sv(f, "ckey")]);
	}
	if (!truthy((yield* g.call(f, P("/proc/winexists"), null, [live(f.src), "asset_cache_browser"])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Unable to access asset cache browser, if you are using a custom skin file, please allow DS to download the updated version, if you are not, then make a bug report. This is not a critical issue but can cause issues with resource downloading, as it is impossible to know when extra resources arrived to you.</span>"]);
	}
	if (!truthy(rt.sv(f, "tooltips"))) {
		rt.setSv(f, "tooltips", (yield* g.new_(f, T("/datum/tooltip"), [live(f.src)])));
	}
	topmenus = rt.index(rt.gl("menulist"), T("/datum/verbs/menu"));
	thing = null;
	rt.forList(f, 0, live(topmenus));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		topmenu = live(thing);
		if (isEqual((topmenuname = fmt("＀", [live(topmenu)])), fmt("＀", [rt.fv(f, "type", live(topmenu))]))) {
			topmenuname = rt.index((tree = (yield* g.call(f, P("/proc/splittext"), null, [live(topmenuname), "/"]))), rt.len(f, live(tree)));
		}
		yield* g.call(f, P("/proc/winset"), null, [live(f.src), fmt("＀", [rt.fv(f, "type", live(topmenu))]), fmt("parent=menu;name=＀", [(yield* g.call(f, P("/proc/url_encode"), null, [live(topmenuname)]))])]);
		entries = (yield* g.callName(f, live(topmenu), "Generate_list", [live(f.src)]));
		child = null;
		rt.forList(f, 1, live(entries));
		while (($e = rt.next(f, 1)) !== undefined) {
			child = $e;
			yield* g.call(f, P("/proc/winset"), null, [live(f.src), fmt("＀", [(yield* g.call(f, P("/proc/url_encode"), null, [live(child)]))]), fmt("＀", [rt.index(live(entries), live(child))])]);
			if (!truthy((yield* g.call(f, P("/proc/ispath"), null, [live(child), T("/datum/verbs/menu")])))) {
				if (!isEqual((yield* g.call(f, P("/proc/copytext"), null, [rt.gv(f, "name", (verbpath = live(child))), 1, 2])), "@")) {
					yield* g.new_(f, live(child), [live(f.src)]);
				}
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	thing = null;
	rt.forList(f, 0, rt.fv(f, "menuoptions", rt.sv(f, "prefs")));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (truthy((menuitem = rt.index(rt.gl("menulist"), live(thing))))) {
			yield* g.callName(f, live(menuitem), "Load_checked", [live(f.src)]);
		}
	}
	rt.endFor(f, 0);
	$0 = live(f.src);
	$1 = "screentips";
	if (truthy(rt.fv(f, "screentip_pref", rt.sv(f, "prefs")))) {
		$2 = "true";
	} else {
		$2 = "false";
	}
	yield* g.call(f, P("/proc/winset"), null, [$0, $1, fmt("is-checked=＀", [$2])]);
	$0 = live(f.src);
	$1 = "runechat";
	if (truthy(rt.fv(f, "runechat_pref", rt.sv(f, "prefs")))) {
		$2 = "true";
	} else {
		$2 = "false";
	}
	yield* g.call(f, P("/proc/winset"), null, [$0, $1, fmt("is-checked=＀", [$2])]);
	$0 = live(f.src);
	$1 = "widescreen";
	if (truthy(rt.fv(f, "widescreenpref", rt.sv(f, "prefs")))) {
		$2 = "true";
	} else {
		$2 = "false";
	}
	yield* g.call(f, P("/proc/winset"), null, [$0, $1, fmt("is-checked=＀", [$2])]);
	return f.dot;
}, true, { args: ["TopicData"], waitfor: false });

// /client/proc/Del  built in (BYOND provides it)
rt.def("/client/proc/Del");

// /client/proc/Del  (code/modules/client/client_procs.dm:371)
rt.def("/client/proc/Del", function Del(f: Frame) {
	rt.call(f, P("/proc/log_access"), null, [fmt("Logout: ＀", [rt.call(f, P("/proc/key_name"), null, [live(f.src)])])]);
	if (truthy(rt.sv(f, "holder"))) {
		rt.callSrc(f, "adminGreet", [1]);
		rt.setFv(f, "owner", rt.sv(f, "holder"), null);
		(rt.modGl("admins", live(f.src), subtract));
	}
	rt.callName(f, rt.gl("ahelp_tickets"), "ClientLogout", [live(f.src)]);
	(rt.modGl("directory", rt.sv(f, "ckey"), subtract));
	(rt.modGl("clients", live(f.src), subtract));
	if (rt.sv(f, "movingmob") !== null) {
		(rt.modField(f, rt.sv(f, "movingmob"), "client_mobs_in_contents", rt.sv(f, "mob"), subtract));
		if ((truthy(rt.fv(f, "client_mobs_in_contents", rt.sv(f, "movingmob"))) && !truthy(rt.getLen(f, rt.fv(f, "client_mobs_in_contents", rt.sv(f, "movingmob")))))) {
			rt.setFv(f, "client_mobs_in_contents", rt.sv(f, "movingmob"), null);
		}
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /client/proc/check_randomizer  (code/modules/client/client_procs.dm:491)  may sleep
rt.def("/client/proc/check_randomizer", function* check_randomizer(f: Frame, topic: Value) {
	let oldcid: Value = null, sql_ckey: Value = null, query_cidcheck: Value = null, lastcid: Value = null;
	f.vars = () => [topic, oldcid, sql_ckey, query_cidcheck, lastcid];
	f.dot = 0;
	if (!isEqual(rt.sv(f, "connection"), "seeker")) {
		return live(f.dot);
	}
	topic = (yield* g.call(f, P("/proc/params2list"), null, [live(topic)]));
	if (!truthy(rt.fv(f, "check_randomizer", rt.gl("config")))) {
		return live(f.dot);
	}
	if (truthy((oldcid = rt.index(rt.gl("cidcheck"), rt.sv(f, "ckey"))))) {
		if ((((!truthy(live(topic)) || !truthy(rt.at(live(topic), "token"))) || !truthy(rt.index(rt.gl("tokens"), rt.sv(f, "ckey")))) || !isEqual(rt.at(live(topic), "token"), rt.index(rt.gl("tokens"), rt.sv(f, "ckey"))))) {
			if (!truthy(rt.index(rt.gl("cidcheck_spoofckeys"), rt.sv(f, "ckey")))) {
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ appears to have attempted to spoof a cid randomizer check.</span>", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
				rt.setAt(rt.gl("cidcheck_spoofckeys"), rt.sv(f, "ckey"), 1);
			}
			rt.setAt(rt.gl("cidcheck"), rt.sv(f, "ckey"), rt.sv(f, "computer_id"));
			rt.setAt(rt.gl("tokens"), rt.sv(f, "ckey"), (yield* g.srcCall(f, "cid_check_reconnect")));
			yield* g.call(f, P("/proc/sleep"), null, [10]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return 1;
		}
		if (!isEqual(live(oldcid), rt.sv(f, "computer_id"))) {
			(rt.modGl("cidcheck", rt.sv(f, "ckey"), subtract));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>Connection Error:</span>"]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>Invalid ComputerID(spoofed). Please remove the ComputerID spoofer from your byond installation and try again.</span>"]);
			if (!truthy(rt.index(rt.gl("cidcheck_failedckeys"), rt.sv(f, "ckey")))) {
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ has been detected as using a cid randomizer. Connection rejected.</span>", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
				rt.setAt(rt.gl("cidcheck_failedckeys"), rt.sv(f, "ckey"), 1);
			}
			yield* g.call(f, P("/proc/log_access"), null, [fmt("Failed Login: ＀ ＀ ＀ - CID randomizer confirmed (oldcid: ＀)", [rt.sv(f, "key"), rt.sv(f, "computer_id"), rt.sv(f, "address"), live(oldcid)])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return 1;
		} else {
			if (truthy(rt.index(rt.gl("cidcheck_failedckeys"), rt.sv(f, "ckey")))) {
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ has been allowed to connect after showing they removed their cid randomizer</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)]))])]);
				(rt.modGl("cidcheck_failedckeys", rt.sv(f, "ckey"), subtract));
			}
			if (truthy(rt.index(rt.gl("cidcheck_spoofckeys"), rt.sv(f, "ckey")))) {
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ has been allowed to connect after appearing to have attempted to spoof a cid randomizer check because it <i>appears</i> they aren't spoofing one this time</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)]))])]);
				(rt.modGl("cidcheck_spoofckeys", rt.sv(f, "ckey"), subtract));
			}
			(rt.modGl("cidcheck", rt.sv(f, "ckey"), subtract));
		}
	} else {
		lastcid = null;
		if (isEqual(rt.sv(f, "computer_id"), live(lastcid))) return f.dot;
		rt.setAt(rt.gl("cidcheck"), rt.sv(f, "ckey"), rt.sv(f, "computer_id"));
		rt.setAt(rt.gl("tokens"), rt.sv(f, "ckey"), (yield* g.srcCall(f, "cid_check_reconnect")));
		yield* g.call(f, P("/proc/sleep"), null, [10]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 1;
	}
	return f.dot;
}, true);

// /client/proc/cid_check_reconnect  (code/modules/client/client_procs.dm:558)  may sleep
rt.def("/client/proc/cid_check_reconnect", function* cid_check_reconnect(f: Frame) {
	let token: Value = null, url: Value = null;
	f.vars = () => [token, url];
	f.dot = (token = (yield* g.call(f, P("/proc/md5"), null, [fmt("＀＀＀＀＀＀＀＀＀", [(yield* g.call(f, P("/proc/rand"), null, [0, 9999])), rt.worldTime(f), (yield* g.call(f, P("/proc/rand"), null, [0, 9999])), rt.sv(f, "ckey"), (yield* g.call(f, P("/proc/rand"), null, [0, 9999])), rt.sv(f, "address"), (yield* g.call(f, P("/proc/rand"), null, [0, 9999])), rt.sv(f, "computer_id"), (yield* g.call(f, P("/proc/rand"), null, [0, 9999]))])])));
	yield* g.call(f, P("/proc/log_access"), null, [fmt("Failed Login: ＀ ＀ ＀ - CID randomizer check", [rt.sv(f, "key"), rt.sv(f, "computer_id"), rt.sv(f, "address")])]);
	url = (yield* g.call(f, P("/proc/winget"), null, [live(f.src), null, "url"]));
	rt.op(f, "Browse", [], [live(f.src), fmt("<a id='link' href=\"byond://＀?token=＀\">byond://＀?token=＀</a><script type=\"text/javascript\">document.getElementById(\"link\").click();window.location=\"byond://winset?command=.quit\"</script>", [live(url), live(token), live(url), live(token)]), "border=0;titlebar=0;size=1x1;window=redirect"], false);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<a href=\"byond://＀?token=＀\">You will be automatically taken to the game, if not, click here to be taken manually</a>", [live(url), live(token)])]);
	return f.dot;
}, true);

// /client/proc/is_afk  (code/modules/client/client_procs.dm:606)
rt.def("/client/proc/is_afk", function is_afk(f: Frame, duration: Value) {
	f.vars = () => [duration];
	if (live(duration) === null) {
		duration = rt.fv(f, "inactivity_period", rt.gl("config"));
	}
	if (rt.gt(rt.sv(f, "inactivity"), live(duration))) {
		return rt.sv(f, "inactivity");
	}
	return 0;
});

// /client/proc/Stat  (code/modules/client/client_procs.dm:615)  may sleep
rt.def("/client/proc/Stat", function* Stat(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	} else {
		yield* g.call(f, P("/proc/sleep"), null, [5]);
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	return f.dot;
}, true);

// /client/proc/send_resources  (code/modules/client/client_procs.dm:625)
rt.def("/client/proc/send_resources", function send_resources(f: Frame) {
	rt.callSrc(f, "getFiles", [rt.rsc("html/search.js"), rt.rsc("html/panels.css"), rt.rsc("html/browser/common.css"), rt.rsc("html/browser/scannernew.css"), rt.rsc("html/browser/playeroptions.css")]);
	rt.spawnTail(f, 10, "/client/proc/send_resources: spawn at modules/client/client_procs.dm:632");
	return f.dot;
});

// a spawn(10) body of /client/proc/send_resources, a named tail so a world snapshot can hold it while it waits.
rt.tail("/client/proc/send_resources: spawn at modules/client/client_procs.dm:632", function* (f: Frame) {
	yield* g.call(f, P("/proc/getFilesSlow"), null, [null, live(f.src), null, rt.fv(f, "cache", rt.gl("SSassets")), "register_asset", 0], rt.Args.Named);
	return null;
});

// /client/proc/setDir  (code/modules/client/client_procs.dm:640)
rt.def("/client/proc/setDir", function setDir(f: Frame, newdir: Value) {
	rt.setSv(f, "dir", live(newdir));
	return f.dot;
});

// /client/proc/vv_edit_var  (code/modules/client/client_procs.dm:643)  may sleep
rt.def("/client/proc/vv_edit_var", function* vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	let $0: any;
	f.vars = () => [var_name, var_value, $0];
	$0 = live(var_name);
	if ($0 === "holder") {
		return 0;
	} else if ($0 === "ckey") {
		return 0;
	} else if ($0 === "key") {
		return 0;
	} else if ($0 === "view") {
		yield* g.srcCall(f, "change_view", live(var_value));
		return 1;
	}
	return f.dot;
}, true);

// /client/proc/change_view  (code/modules/client/client_procs.dm:656)  may sleep
rt.def("/client/proc/change_view", function* change_view(f: Frame, new_size: Value) {
	f.vars = () => [new_size];
	if (live(new_size) === null) {
		yield* g.call(f, P("/proc/CRASH"), null, ["change_view called without argument."]);
	}
	rt.setSv(f, "view", live(new_size));
	if (!truthy(rt.sv(f, "mob"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "mob"), "reload_fullscreen", []);
	if (!(truthy(rt.fv(f, "hud_used", rt.sv(f, "mob"))) && truthy(rt.length(rt.sv(f, "parallax_layers"))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "hud_used", rt.sv(f, "mob")), "update_parallax", []);
	return f.dot;
}, true);

// /client/proc/rescale_view  (code/modules/client/client_procs.dm:667)  may sleep
rt.def("/client/proc/rescale_view", function* rescale_view(f: Frame, change: Value, min: Value, max: Value) {
	let viewscale: Value = null, x: Value = null, y: Value = null;
	f.vars = () => [change, min, max, viewscale, x, y];
	viewscale = (yield* g.call(f, P("/proc/getviewsize"), null, [rt.sv(f, "view")]));
	x = (yield* g.call(f, P("/proc/max"), null, [live(min), (yield* g.call(f, P("/proc/min"), null, [add(rt.index(live(viewscale), 1), live(change)), live(max)]))]));
	y = (yield* g.call(f, P("/proc/max"), null, [live(min), (yield* g.call(f, P("/proc/min"), null, [add(rt.index(live(viewscale), 2), live(change)), live(max)]))]));
	yield* g.srcCall(f, "change_view", fmt("＀x＀", [live(x), live(y)]));
	return f.dot;
}, true);

// /client/proc/default_view  (code/modules/client/client_procs.dm:675)
rt.def("/client/proc/default_view", function default_view(f: Frame) {
	if ((!truthy((rt.istype(rt.sv(f, "mob"), T("/mob/dead/new_player")) ? 1 : 0)) && (!truthy(rt.sv(f, "prefs")) || truthy(rt.fv(f, "widescreenpref", rt.sv(f, "prefs")))))) {
		return rt.fv(f, "default_view", rt.gl("config"));
	}
	return rt.fv(f, "default_view_square", rt.gl("config"));
});

// /client/verb/toggle_widescreen  (code/modules/client/client_procs.dm:684)  may sleep
rt.def("/client/verb/toggle_widescreen", function* toggle_widescreen(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	rt.setFv(f, "widescreenpref", rt.sv(f, "prefs"), (!truthy(rt.fv(f, "widescreenpref", rt.sv(f, "prefs"))) ? 1 : 0));
	yield* g.srcCall(f, "change_view", (yield* g.srcCall(f, "default_view")));
	$0 = live(f.src);
	$1 = "widescreen";
	if (truthy(rt.fv(f, "widescreenpref", rt.sv(f, "prefs")))) {
		$2 = "true";
	} else {
		$2 = "false";
	}
	yield* g.call(f, P("/proc/winset"), null, [$0, $1, fmt("is-checked=＀", [$2])]);
	$0 = live(f.src);
	if (truthy(rt.fv(f, "widescreenpref", rt.sv(f, "prefs")))) {
		$1 = "on";
	} else {
		$1 = "off";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("Widescreen is now ＀.", [$1])]);
	yield* g.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	return f.dot;
}, true, { hidden: true, verb: { name: "toggle-widescreen", category: "OOC" } });

// /client/proc/is_default_view  (code/modules/client/client_procs.dm:691)
rt.def("/client/proc/is_default_view", function is_default_view(f: Frame) {
	let now: Value = null, def: Value = null;
	f.vars = () => [now, def];
	now = rt.call(f, P("/proc/getviewsize"), null, [rt.sv(f, "view")]);
	def = rt.call(f, P("/proc/getviewsize"), null, [rt.callSrc(f, "default_view", [])]);
	return ((isEqual(rt.index(live(now), 1), rt.index(live(def), 1)) ? 1 : 0) && (isEqual(rt.index(live(now), 2), rt.index(live(def), 2)) ? 1 : 0));
});
