// Based on /tg/station's code/modules/client/client_procs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, add, fmt } = rt;


// client_procs.dm:29
rt.def("/client/proc/Topic", function* Topic(f: Frame) {
	let job: Value = null, minute: Value = null, msg: Value = null, second: Value = null;
	let $3: any;
	if (!f.usr || f.usr != this.mob) {
		return f.dot;
	}
	if (rt.at(f.args[1], "asset_cache_confirm_arrival")) {
		if ((job = text2num(rt.at(f.args[1], "asset_cache_confirm_arrival"))) && job <= this.last_asset_job && !rt.isIn(f, job, this.completed_asset_jobs)) {
			this.completed_asset_jobs += job;
			return f.dot;
		} else if (rt.isIn(f, job, this.completed_asset_jobs)) {
			to_chat(this, "<span class='danger'>An error has been detected in how your client is receiving resources. Attempting to correct.... (If you keep seeing these messages you might want to close byond and reconnect)</span>");
			rt.op(f, "Browse", [], [this, "...", "window=asset_cache_browser"], false);
		}
	}
	if (!this.holder && GLOB.config.minutetopiclimit) {
		minute = round(rt.worldTime(f), 600);
		if (!this.topiclimiter) {
			this.topiclimiter = (yield* new_(T("/list"), LIMITER_SIZE));
		}
		if (minute != rt.index(this.topiclimiter, CURRENT_MINUTE)) {
			rt.setAt(this.topiclimiter, CURRENT_MINUTE, minute);
			rt.setAt(this.topiclimiter, MINUTE_COUNT, 0);
		}
		rt.modAt(this.topiclimiter, MINUTE_COUNT, 1, add);
		if (rt.index(this.topiclimiter, MINUTE_COUNT) > GLOB.config.minutetopiclimit) {
			msg = "Your previous action was ignored because you've done too many in a minute.";
			if (minute != rt.index(this.topiclimiter, ADMINSWARNED_AT)) {
				rt.setAt(this.topiclimiter, ADMINSWARNED_AT, minute);
				msg += " Administrators have been informed.";
				log_game(`${key_name(this)} Has hit the per-minute topic limit of ${GLOB.config.minutetopiclimit} topic calls in a given game minute`);
				message_admins(`${key_name_admin(this)} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [f.usr])} ${fmt("(<a href='?_src_=holder;boot2=＃'>KICK</a>)", [f.usr])} Has hit the per-minute topic limit of ${GLOB.config.minutetopiclimit} topic calls in a given game minute`);
			}
			to_chat(this, `<span class='danger'>${msg}</span>`);
			return f.dot;
		}
	}
	if (!this.holder && GLOB.config.secondtopiclimit) {
		second = round(rt.worldTime(f), 10);
		if (!this.topiclimiter) {
			this.topiclimiter = (yield* new_(T("/list"), LIMITER_SIZE));
		}
		if (second != rt.index(this.topiclimiter, CURRENT_SECOND)) {
			rt.setAt(this.topiclimiter, CURRENT_SECOND, second);
			rt.setAt(this.topiclimiter, SECOND_COUNT, 0);
		}
		rt.modAt(this.topiclimiter, SECOND_COUNT, 1, add);
		if (rt.index(this.topiclimiter, SECOND_COUNT) > GLOB.config.secondtopiclimit) {
			to_chat(this, "<span class='danger'>Your previous action was ignored because you've done too many in a second</span>");
			return f.dot;
		}
	}
	let $0: any = (yield* time_stamp({ show_ds: 1 }));
	let $1: any = this;
	let $2: any = f.usr;
	if (f.args[2]) {
		$3 = `${f.args[2]} `;
	} else {
		$3 = "";
	}
	rt.op(f, "OutputReference", [rt.R.glob(110)], [`<small>${$0} ${$1} (usr:${$2})</small> || ${$3}${f.args[0]}<br>`], false);
	if (rt.at(f.args[1], "priv_msg")) {
		yield* this.cmd_admin_pm(rt.at(f.args[1], "priv_msg"), null);
		return f.dot;
	}
	const item = rt.at(f.args[1], "_src_");
	if (item === "holder") {
		f.args[2] = this.holder;
	} else if (item === "usr") {
		f.args[2] = this.mob;
	} else if (item === "prefs") {
		if (this.inprefs) {
			return f.dot;
		}
		this.inprefs = 1;
		f.dot = (yield* this.prefs.process_link(f.usr, f.args[1]));
		this.inprefs = 0;
		return f.dot;
	} else if (item === "vars") {
		return (yield* this.view_var_Topic(f.args[0], f.args[1], f.args[2]));
	} else if (item === "chat") {
		return (yield* this.chatOutput.Topic(f.args[0], f.args[1]));
	}
	if (rt.at(f.args[1], "action") === "openLink") {
		rt.op(f, "Link", [], [this, rt.at(f.args[1], "link")], false);
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["href", "href_list", "hsrc"] });

// client_procs.dm:107
rt.def("/client/proc/is_content_unlocked", function is_content_unlocked(f: Frame) {
	if (!this.prefs.unlock_content) {
		to_chat(this, "Become a BYOND member to access member-perks and features, as well as support the engine that makes this game possible. Only 10 bucks for 3 months! <a href='http://www.byond.com/membership'>Click Here to find out more</a>.");
		return 0;
	}
	return 1;
});

// client_procs.dm:113
rt.def("/client/proc/handle_spam_prevention", function handle_spam_prevention(f: Frame, message: Value, mute_type: Value) {
	if (GLOB.config.automute_on && !this.holder && this.last_message == message) {
		rt.incField(f, this, "last_message_count", 1, true);
		if (this.last_message_count >= SPAM_TRIGGER_AUTOMUTE) {
			to_chat(this, "<span class='danger'>You have exceeded the spam filter limit for identical messages. An auto-mute was applied.</span>");
			cmd_admin_mute(this, mute_type, 1);
			return 1;
		}
		if (this.last_message_count >= SPAM_TRIGGER_WARNING) {
			to_chat(this, "<span class='danger'>You are nearing the spam filter limit for identical messages.</span>");
			return 0;
		}
	} else {
		this.last_message = message;
		this.last_message_count = 0;
		return 0;
	}
	return f.dot;
});

// client_procs.dm:129
rt.def("/client/proc/AllowUpload", function AllowUpload(f: Frame, filename: Value, filelength: Value) {
	if (filelength > 1048576) {
		to_chat(this, `<font color='red'>Error: AllowUpload(): File Upload too large. Upload Limit: ${1024}KiB.</font>`);
		return 0;
	}
	return 1;
});

// client_procs.dm:151
rt.def("/client/proc/New", function* New(f: Frame) {
	let localhost_rank: Value = null, localhost_holder: Value = null, autorank: Value = null, R: Value = null, D: Value = null, I: Value = null, C: Value = null, matches: Value = null, message: Value = null, thing: Value = null, topmenu: Value = null, topmenuname: Value = null, tree: Value = null, entries: Value = null, child: Value = null, verbpath: Value = null, menuitem: Value = null;
	let $1: any, $e: any;
	let tdata: Value = f.args[0];
	this.chatOutput = (yield* new_(T("/datum/chatOutput"), this));
	f.args[0] = null;
	if (this.connection != "seeker" && this.connection != "web") {
		return null;
	}
	GLOB.clients += this;
	rt.setAt(GLOB.directory, this.ckey, this);
	GLOB.ahelp_tickets.ClientLogin(this);
	let localhost_addresses: Value = list("127.0.0.1", "::1"); // offline play is your own game; tools/server.mjs gives 127.0.0.1 only to admins (by secret key), everyone else their real address
	if (this.address && rt.isIn(f, this.address, localhost_addresses)) {
		if (localhost_rank = (yield* new_(T("/datum/admin_rank"), "!localhost!", 65535))) {
			(localhost_holder = (yield* new_(T("/datum/admins"), localhost_rank, this.ckey))).associate(this);
		}
	}
	if (GLOB.config.autoadmin) {
		if (!rt.index(GLOB.admin_datums, this.ckey)) {
			for (R of each(GLOB.admin_ranks, T("/datum/admin_rank"))) {
				if (R.name == GLOB.config.autoadmin_rank) {
					autorank = R;
					break;
				}
			}
			if (!autorank) {
				to_chat(rt.world(), "Autoadmin rank not found");
			} else {
				D = (yield* new_(T("/datum/admins"), autorank, this.ckey));
				rt.setAt(GLOB.admin_datums, this.ckey, D);
			}
		}
	}
	this.holder = rt.index(GLOB.admin_datums, this.ckey);
	if (this.holder) {
		(rt.modGl("admins", this, rt.bitOr));
		this.holder.owner = this;
	}
	this.prefs = rt.index(GLOB.preferences_datums, this.ckey);
	if (!this.prefs) {
		this.prefs = (yield* new_(T("/datum/preferences"), this));
		rt.setAt(GLOB.preferences_datums, this.ckey, this.prefs);
	}
	this.prefs.last_ip = this.address;
	if (GLOB.SSvote) GLOB.SSvote.note_arrival(this); // ss13.live: the newcomer wait (plans/server-rules.md step 4)
	this.prefs.last_id = this.computer_id;
	if (rt.world().byond_version >= 511 && this.byond_version >= 511 && this.prefs.clientfps) {
		rt.setAt(this.vars, "fps", this.prefs.clientfps);
	}
	this.sethotkeys(1);
	let $0: any = key_name(this);
	if (this.address) {
		$1 = this.address;
	} else {
		$1 = "localhost";
	}
	log_access(`Login: ${$0} from ${$1}-${this.computer_id} || BYOND v${this.byond_version}`);
	let alert_mob_dupe_login: Value = 0;
	if (GLOB.config.log_access) {
		for (I of each(GLOB.clients)) {
			if (!I || I == this) {
				continue;
			}
			if ((C = I).key && C.key != this.key) {
				matches = null;
				if (C.address == this.address) {
					matches += `IP (${this.address})`;
				}
				if (C.computer_id == this.computer_id) {
					if (matches) {
						matches += " and ";
					}
					matches += `ID (${this.computer_id})`;
					alert_mob_dupe_login = 1;
				}
				if (matches) {
					if (C) {
						message_admins(`<font color='red'><B>Notice: </B><font color='blue'>${key_name_admin(this)} has the same ${matches} as ${key_name_admin(C)}.</font>`);
						log_access(`Notice: ${key_name(this)} has the same ${matches} as ${key_name(C)}.`);
					} else {
						message_admins(`<font color='red'><B>Notice: </B><font color='blue'>${key_name_admin(this)} has the same ${matches} as ${key_name_admin(C)} (no longer logged in). </font>`);
						log_access(`Notice: ${key_name(this)} has the same ${matches} as ${key_name(C)} (no longer logged in).`);
					}
				}
			}
		}
	}
	f.dot = (yield* parent_proc());
	yield* this.chatOutput.start();
	if (alert_mob_dupe_login) {
		yield* alert(this.mob, "You have logged in already with another key this round, please log out of this one NOW or risk being banned!");
	}
	this.connection_time = rt.worldTime(f);
	this.connection_realtime = rt.world().realtime;
	this.connection_timeofday = rt.world().timeofday;
	winset(this, null, "command=\".configure graphics-hwmode on\"");
	if (this.byond_version < GLOB.config.client_error_version) {
		to_chat(this, "<span class='danger'><b>Your version of byond is too old:</b></span>");
		to_chat(this, GLOB.config.client_error_message);
		to_chat(this, `Your version: ${this.byond_version}`);
		to_chat(this, `Required version: ${GLOB.config.client_error_version} or later`);
		to_chat(this, "Visit http://www.byond.com/download/ to get the latest version of byond.");
		if (this.holder) {
			to_chat(this, "Because you are an admin, you are being allowed to walk past this limitation, But it is still STRONGLY suggested you upgrade");
		} else {
			yield* qdel(this);
			return 0;
		}
	} else if (this.byond_version < GLOB.config.client_warn_version) {
		to_chat(this, "<span class='danger'><b>Your version of byond may be getting out of date:</b></span>");
		to_chat(this, GLOB.config.client_warn_message);
		to_chat(this, `Your version: ${this.byond_version}`);
		to_chat(this, `Required version to remove this message: ${GLOB.config.client_warn_version} or later`);
		to_chat(this, "Visit http://www.byond.com/download/ to get the latest version of byond.");
	}
	if (this.connection == "web" && !this.holder) {
		if (!GLOB.config.allowwebclient) {
			to_chat(this, "Web client is disabled");
			yield* qdel(this);
			return 0;
		}
		if (GLOB.config.webclientmembersonly && !this.IsByondMember()) {
			to_chat(this, "Sorry, but the web client is restricted to byond members only.");
			yield* qdel(this);
			return 0;
		}
	}
	if ((rt.world().address == this.address || !this.address) && !GLOB.host) {
		GLOB.host = this.key;
		yield* rt.world().update_status();
	}
	if (this.holder) {
		this.add_admin_verbs();
		this.adminGreet();
	}
	this.send_resources();
	if (!GLOB.void) {
		GLOB.void = (yield* new_(T("/obj/screen/click_catcher")));
	}
	this.screen += GLOB.void;
	if (this.prefs.lastchangelog != GLOB.changelog_hash && !is_creative()) { // tg_js: Creative starts quietly
		to_chat(this, "<span class='info'>You have unread updates in the changelog.</span>");
		if (GLOB.config.aggressive_changelog) {
			yield* this.changelog();
		} else {
			winset(this, "infowindow.changelog", "font-style=bold");
		}
	}
	if (rt.isIn(f, this.ckey, GLOB.clientmessages)) {
		for (message of each(rt.index(GLOB.clientmessages, this.ckey))) {
			to_chat(this, message);
		}
		yield* GLOB.clientmessages.Remove(this.ckey);
	}
	if (!(yield* winexists(this, "asset_cache_browser"))) {
		to_chat(this, "<span class='warning'>Unable to access asset cache browser, if you are using a custom skin file, please allow DS to download the updated version, if you are not, then make a bug report. This is not a critical issue but can cause issues with resource downloading, as it is impossible to know when extra resources arrived to you.</span>");
	}
	if (!this.tooltips) {
		this.tooltips = (yield* new_(T("/datum/tooltip"), this));
	}
	let topmenus: Value = rt.index(GLOB.menulist, T("/datum/verbs/menu"));
	for (thing of each(topmenus)) {
		topmenu = thing;
		if ((topmenuname = `${topmenu}`) == `${topmenu.type}`) {
			topmenuname = rt.index((tree = splittext(topmenuname, "/")), rt.len(f, tree));
		}
		winset(this, `${topmenu.type}`, `parent=menu;name=${url_encode(topmenuname)}`);
		entries = topmenu.Generate_list(this);
		child = null;
		for (child of each(entries)) {
			winset(this, `${url_encode(child)}`, `${rt.index(entries, child)}`);
			if (!ispath(child, T("/datum/verbs/menu"))) {
				if (copytext((verbpath = child).name, 1, 2) != "@") {
					yield* new_(child, this);
				}
			}
		}
	}
	thing = null;
	for (thing of each(this.prefs.menuoptions)) {
		if (menuitem = rt.index(GLOB.menulist, thing)) {
			menuitem.Load_checked(this);
		}
	}
	winset(this, "screentips", `is-checked=${this.prefs.screentip_pref ? "true" : "false"}`);
	winset(this, "runechat", `is-checked=${this.prefs.runechat_pref ? "true" : "false"}`);
	winset(this, "widescreen", `is-checked=${this.prefs.widescreenpref ? "true" : "false"}`);
	return f.dot;
}, true, { args: ["TopicData"], waitfor: false });

// BYOND built-in.
rt.def("/client/proc/Del");

// client_procs.dm:371
rt.def("/client/proc/Del", function Del(f: Frame) {
	log_access(`Logout: ${key_name(this)}`);
	if (this.holder) {
		this.adminGreet(1);
		this.holder.owner = null;
		GLOB.admins -= this;
	}
	GLOB.ahelp_tickets.ClientLogout(this);
	GLOB.directory -= this.ckey;
	GLOB.clients -= this;
	if (this.movingmob !== null) {
		this.movingmob.client_mobs_in_contents -= this.mob;
		if (this.movingmob.client_mobs_in_contents && !rt.len(f, this.movingmob.client_mobs_in_contents)) {
			this.movingmob.client_mobs_in_contents = null;
		}
	}
	return parent_proc();
});

// client_procs.dm:491
rt.def("/client/proc/check_randomizer", function* check_randomizer(f: Frame, topic: Value) {
	let oldcid: Value = null, lastcid: Value = null;
	f.dot = 0;
	if (this.connection != "seeker") {
		return f.dot;
	}
	topic = params2list(topic);
	if (!GLOB.config.check_randomizer) {
		return f.dot;
	}
	if (oldcid = rt.index(GLOB.cidcheck, this.ckey)) {
		if (!topic || !rt.at(topic, "token") || !rt.index(GLOB.tokens, this.ckey) || rt.at(topic, "token") != rt.index(GLOB.tokens, this.ckey)) {
			if (!rt.index(GLOB.cidcheck_spoofckeys, this.ckey)) {
				message_admins(`<span class='adminnotice'>${key_name(this)} appears to have attempted to spoof a cid randomizer check.</span>`);
				rt.setAt(GLOB.cidcheck_spoofckeys, this.ckey, 1);
			}
			rt.setAt(GLOB.cidcheck, this.ckey, this.computer_id);
			rt.setAt(GLOB.tokens, this.ckey, (yield* this.cid_check_reconnect()));
			yield* sleep(10);
			yield* qdel(this);
			return 1;
		}
		if (oldcid != this.computer_id) {
			GLOB.cidcheck -= this.ckey;
			to_chat(this, "<span class='userdanger'>Connection Error:</span>");
			to_chat(this, "<span class='danger'>Invalid ComputerID(spoofed). Please remove the ComputerID spoofer from your byond installation and try again.</span>");
			if (!rt.index(GLOB.cidcheck_failedckeys, this.ckey)) {
				message_admins(`<span class='adminnotice'>${key_name(this)} has been detected as using a cid randomizer. Connection rejected.</span>`);
				rt.setAt(GLOB.cidcheck_failedckeys, this.ckey, 1);
			}
			log_access(`Failed Login: ${this.key} ${this.computer_id} ${this.address} - CID randomizer confirmed (oldcid: ${oldcid})`);
			yield* qdel(this);
			return 1;
		} else {
			if (rt.index(GLOB.cidcheck_failedckeys, this.ckey)) {
				message_admins(`<span class='adminnotice'>${key_name_admin(this)} has been allowed to connect after showing they removed their cid randomizer</span>`);
				GLOB.cidcheck_failedckeys -= this.ckey;
			}
			if (rt.index(GLOB.cidcheck_spoofckeys, this.ckey)) {
				message_admins(`<span class='adminnotice'>${key_name_admin(this)} has been allowed to connect after appearing to have attempted to spoof a cid randomizer check because it <i>appears</i> they aren't spoofing one this time</span>`);
				GLOB.cidcheck_spoofckeys -= this.ckey;
			}
			GLOB.cidcheck -= this.ckey;
		}
	} else {
		if (this.computer_id == lastcid) return f.dot;
		rt.setAt(GLOB.cidcheck, this.ckey, this.computer_id);
		rt.setAt(GLOB.tokens, this.ckey, (yield* this.cid_check_reconnect()));
		yield* sleep(10);
		yield* qdel(this);
		return 1;
	}
	return f.dot;
}, true);

// client_procs.dm:558
rt.def("/client/proc/cid_check_reconnect", function* cid_check_reconnect(f: Frame) {
	let token: Value = null;
	f.dot = (token = md5(`${rand(0, 9999)}${rt.worldTime(f)}${rand(0, 9999)}${this.ckey}${rand(0, 9999)}${this.address}${rand(0, 9999)}${this.computer_id}${rand(0, 9999)}`));
	log_access(`Failed Login: ${this.key} ${this.computer_id} ${this.address} - CID randomizer check`);
	let url: Value = (yield* winget(this, null, "url"));
	rt.op(f, "Browse", [], [this, fmt("<a id='link' href=\"byond://＀?token=＀\">byond://＀?token=＀</a><script type=\"text/javascript\">document.getElementById(\"link\").click();window.location=\"byond://winset?command=.quit\"</script>", [url, token, url, token]), "border=0;titlebar=0;size=1x1;window=redirect"], false);
	to_chat(this, fmt("<a href=\"byond://＀?token=＀\">You will be automatically taken to the game, if not, click here to be taken manually</a>", [url, token]));
	return f.dot;
}, true);

// client_procs.dm:606
rt.def("/client/proc/is_afk", function is_afk(f: Frame, duration: Value) {
	duration ??= GLOB.config.inactivity_period;
	if (this.inactivity > duration) {
		return this.inactivity;
	}
	return 0;
});

// client_procs.dm:615
rt.def("/client/proc/Stat", function* Stat(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.holder) {
		yield* sleep(1);
	} else {
		yield* sleep(5);
		yield* stoplag();
	}
	return f.dot;
}, true);

// client_procs.dm:625
rt.def("/client/proc/send_resources", function send_resources(f: Frame) {
	this.getFiles(rt.rsc("html/search.js"), rt.rsc("html/panels.css"), rt.rsc("html/browser/common.css"), rt.rsc("html/browser/scannernew.css"), rt.rsc("html/browser/playeroptions.css"));
	rt.spawnTail(f, 10, "/client/proc/send_resources: spawn at modules/client/client_procs.dm:632");
	return f.dot;
});

// a spawn(10) body of /client/proc/send_resources, a named tail so a world snapshot can hold it while it waits.
rt.tail("/client/proc/send_resources: spawn at modules/client/client_procs.dm:632", function* (f: Frame) {
	yield* getFilesSlow(this, GLOB.SSassets.cache, { register_asset: 0 });
	return null;
});

// client_procs.dm:640
rt.def("/client/proc/setDir", function setDir(f: Frame, newdir: Value) {
	this.dir = newdir;
	return f.dot;
});

// client_procs.dm:643
rt.def("/client/proc/vv_edit_var", function* vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	if (var_name === "holder") {
		return 0;
	} else if (var_name === "ckey") {
		return 0;
	} else if (var_name === "key") {
		return 0;
	} else if (var_name === "view") {
		yield* this.change_view(var_value);
		return 1;
	}
	return f.dot;
}, true);

// client_procs.dm:656
rt.def("/client/proc/change_view", function* change_view(f: Frame, new_size: Value) {
	if (new_size === null) {
		CRASH("change_view called without argument.");
	}
	this.view = new_size;
	if (!this.mob) return f.dot;
	this.mob.reload_fullscreen();
	if (!(this.mob.hud_used && rt.length(this.parallax_layers))) return f.dot;
	yield* this.mob.hud_used.update_parallax();
	return f.dot;
}, true);

// client_procs.dm:667
rt.def("/client/proc/rescale_view", function* rescale_view(f: Frame, change: Value, min: Value, max: Value) {
	let viewscale: Value = getviewsize(this.view);
	let x: Value = (yield* g.call(f, P("/proc/max"), null, [min, (yield* g.call(f, P("/proc/min"), null, [rt.index(viewscale, 1) + change, max]))]));
	let y: Value = (yield* g.call(f, P("/proc/max"), null, [min, (yield* g.call(f, P("/proc/min"), null, [rt.index(viewscale, 2) + change, max]))]));
	yield* this.change_view(`${x}x${y}`);
	return f.dot;
}, true);

// client_procs.dm:675
rt.def("/client/proc/default_view", function default_view(f: Frame) {
	if (!rt.istype(this.mob, T("/mob/dead/new_player")) && (!this.prefs || this.prefs.widescreenpref)) {
		return GLOB.config.default_view;
	}
	return GLOB.config.default_view_square;
});

// client_procs.dm:684
rt.def("/client/verb/toggle_widescreen", function* toggle_widescreen(f: Frame) {
	this.prefs.widescreenpref = (!this.prefs.widescreenpref ? 1 : 0);
	yield* this.change_view(this.default_view());
	let $0: any = this;
	let $1: any = "widescreen";
	winset($0, $1, `is-checked=${this.prefs.widescreenpref ? "true" : "false"}`);
	to_chat(this, `Widescreen is now ${this.prefs.widescreenpref ? "on" : "off"}.`);
	this.prefs.save_preferences();
	return f.dot;
}, true, { hidden: true, verb: { name: "toggle-widescreen", category: "OOC" } });

// client_procs.dm:691
rt.def("/client/proc/is_default_view", function is_default_view(f: Frame) {
	let now: Value = getviewsize(this.view);
	let def: Value = getviewsize(this.default_view());
	return ((rt.index(now, 1) == rt.index(def, 1) ? 1 : 0) && (rt.index(now, 2) == rt.index(def, 2) ? 1 : 0));
});
