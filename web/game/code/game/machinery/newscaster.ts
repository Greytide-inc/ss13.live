// Based on /tg/station's code/game/machinery/newscaster.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


// newscaster.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalnews_network", function InitGlobalnews_network(f: Frame) {
	GLOB.news_network = new_(T("/datum/newscaster/feed_network"));
	this.gvars_datum_init_order += "news_network";
	return f.dot;
});

// newscaster.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobalallCasters", function InitGlobalallCasters(f: Frame) {
	GLOB.allCasters = list();
	this.gvars_datum_init_order += "allCasters";
	return f.dot;
});

rt.type(1494, "/datum/newscaster/feed_message", "/datum/newscaster", {
	author: "",
	body: "",
	authorCensorTime: null,
	bodyCensorTime: null,
	is_admin_message: 0,
	img: null,
	time_stamp: "",
	comments: null,
	locked: 0,
	caption: "",
	creationTime: null,
	authorCensor: null,
	bodyCensor: null,
});

// newscaster.dm:14
rt.def("/datum/newscaster/feed_message/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.authorCensorTime = list();

	this.bodyCensorTime = list();

	this.comments = list();
	return f.dot;
});

// newscaster.dm:27
rt.def("/datum/newscaster/feed_message/proc/returnAuthor", function returnAuthor(f: Frame, censor: Value) {
	if (censor == -1) {
		censor = this.authorCensor;
	}
	let txt: Value = `${GLOB.news_network.redactedText}`;
	if (!censor) {
		txt = this.author;
	}
	return txt;
});

// newscaster.dm:35
rt.def("/datum/newscaster/feed_message/proc/returnBody", function returnBody(f: Frame, censor: Value) {
	if (censor == -1) {
		censor = this.bodyCensor;
	}
	let txt: Value = `${GLOB.news_network.redactedText}`;
	if (!censor) {
		txt = this.body;
	}
	return txt;
});

// newscaster.dm:44
rt.def("/datum/newscaster/feed_message/proc/toggleCensorAuthor", function toggleCensorAuthor(f: Frame) {
	if (this.authorCensor) {
		this.authorCensorTime.Add(GLOB.news_network.lastAction * -1);
	} else {
		this.authorCensorTime.Add(GLOB.news_network.lastAction);
	}
	this.authorCensor = (!this.authorCensor ? 1 : 0);
	GLOB.news_network.lastAction++;
	return f.dot;
});

// newscaster.dm:52
rt.def("/datum/newscaster/feed_message/proc/toggleCensorBody", function toggleCensorBody(f: Frame) {
	if (this.bodyCensor) {
		this.bodyCensorTime.Add(GLOB.news_network.lastAction * -1);
	} else {
		this.bodyCensorTime.Add(GLOB.news_network.lastAction);
	}
	this.bodyCensor = (!this.bodyCensor ? 1 : 0);
	GLOB.news_network.lastAction++;
	return f.dot;
});

rt.type(1495, "/datum/newscaster/feed_channel", "/datum/newscaster", {
	channel_name: "",
	messages: null,
	locked: 0,
	author: "",
	censored: 0,
	authorCensorTime: null,
	DclassCensorTime: null,
	authorCensor: null,
	is_admin_channel: 0,
});

// newscaster.dm:60
rt.def("/datum/newscaster/feed_channel/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.messages = list();

	this.authorCensorTime = list();

	this.DclassCensorTime = list();
	return f.dot;
});

// newscaster.dm:70
rt.def("/datum/newscaster/feed_channel/proc/returnAuthor", function returnAuthor(f: Frame, censor: Value) {
	if (censor == -1) {
		censor = this.authorCensor;
	}
	let txt: Value = `${GLOB.news_network.redactedText}`;
	if (!censor) {
		txt = this.author;
	}
	return txt;
});

// newscaster.dm:79
rt.def("/datum/newscaster/feed_channel/proc/toggleCensorDclass", function toggleCensorDclass(f: Frame) {
	if (this.censored) {
		this.DclassCensorTime.Add(GLOB.news_network.lastAction * -1);
	} else {
		this.DclassCensorTime.Add(GLOB.news_network.lastAction);
	}
	this.censored = (!this.censored ? 1 : 0);
	GLOB.news_network.lastAction++;
	return f.dot;
});

// newscaster.dm:87
rt.def("/datum/newscaster/feed_channel/proc/toggleCensorAuthor", function toggleCensorAuthor(f: Frame) {
	if (this.authorCensor) {
		this.authorCensorTime.Add(GLOB.news_network.lastAction * -1);
	} else {
		this.authorCensorTime.Add(GLOB.news_network.lastAction);
	}
	this.authorCensor = (!this.authorCensor ? 1 : 0);
	GLOB.news_network.lastAction++;
	return f.dot;
});

rt.type(1497, "/datum/newscaster/feed_network", "/datum/newscaster", {
	network_channels: null,
	wanted_issue: null,
	lastAction: null,
	redactedText: "[REDACTED]",
});

// newscaster.dm:102
rt.def("/datum/newscaster/feed_network/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.network_channels = list();
	return f.dot;
});

// newscaster.dm:108
rt.def("/datum/newscaster/feed_network/proc/New", function New(f: Frame) {
	this.CreateFeedChannel("Station Announcements", "SS13", 1);
	this.wanted_issue = new_(T("/datum/newscaster/wanted_message"));
	return f.dot;
});

// newscaster.dm:112
rt.def("/datum/newscaster/feed_network/proc/CreateFeedChannel", function CreateFeedChannel(f: Frame, channel_name: Value, author: Value, locked: Value, adminChannel: Value) {
	let newChannel: Value = null;
	adminChannel ??= 0;
	(newChannel = new_(T("/datum/newscaster/feed_channel"))).channel_name = channel_name;
	newChannel.author = author;
	newChannel.locked = locked;
	newChannel.is_admin_channel = adminChannel;
	this.network_channels += newChannel;
	return f.dot;
});

// newscaster.dm:120
rt.def("/datum/newscaster/feed_network/proc/SubmitArticle", function* SubmitArticle(f: Frame, msg: Value, author: Value, channel_name: Value, photo: Value, adminMessage: Value, allow_comments: Value) {
	let newMsg: Value = null, FC: Value = null, NEWSCASTER: Value = null;
	adminMessage ??= 0;
	allow_comments ??= 1;
	(newMsg = (yield* new_(T("/datum/newscaster/feed_message")))).author = author;
	newMsg.body = msg;
	newMsg.time_stamp = `${worldtime2text()}`;
	newMsg.is_admin_message = adminMessage;
	newMsg.locked = (!allow_comments ? 1 : 0);
	if (photo) {
		newMsg.img = photo.img;
		newMsg.caption = photo.scribble;
	}
	for (FC of each(this.network_channels, T("/datum/newscaster/feed_channel"))) {
		if (FC.channel_name == channel_name) {
			FC.messages += newMsg;
			break;
		}
	}
	for (NEWSCASTER of each(GLOB.allCasters, T("/obj/machinery/newscaster"))) {
		yield* NEWSCASTER.newsAlert(channel_name);
	}
	this.lastAction++;
	newMsg.creationTime = this.lastAction;
	return f.dot;
}, true);

// newscaster.dm:139
rt.def("/datum/newscaster/feed_network/proc/submitWanted", function* submitWanted(f: Frame, criminal: Value, body: Value, scanned_user: Value, photo: Value, adminMsg: Value, newMessage: Value) {
	let N: Value = null;
	adminMsg ??= 0;
	newMessage ??= 0;
	this.wanted_issue.active = 1;
	this.wanted_issue.criminal = criminal;
	this.wanted_issue.body = body;
	this.wanted_issue.scannedUser = scanned_user;
	this.wanted_issue.isAdminMsg = adminMsg;
	if (photo) {
		this.wanted_issue.img = photo.img;
	}
	if (!newMessage) return f.dot;
	for (N of each(GLOB.allCasters, T("/obj/machinery/newscaster"))) {
		yield* N.newsAlert();
		yield* N.update_icon();
	}
	return f.dot;
}, true);

// newscaster.dm:152
rt.def("/datum/newscaster/feed_network/proc/deleteWanted", function deleteWanted(f: Frame) {
	let NEWSCASTER: Value = null;
	this.wanted_issue.active = 0;
	this.wanted_issue.criminal = null;
	this.wanted_issue.body = null;
	this.wanted_issue.scannedUser = null;
	this.wanted_issue.img = null;
	for (NEWSCASTER of each(GLOB.allCasters, T("/obj/machinery/newscaster"))) {
		NEWSCASTER.update_icon();
	}
	return f.dot;
});

rt.type(9543, "/obj/item/wallframe/newscaster", "/obj/item/wallframe", {
	name: "newscaster frame",
	desc: "Used to build newscasters, just secure to the wall.",
	icon_state: "newscaster",
	materials: null,
	result_path: rt.typePath("/obj/machinery/newscaster"),
});

// newscaster.dm:166
rt.def("/obj/item/wallframe/newscaster/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 14000, "$glass", 8000]);
	return f.dot;
});

rt.type(10808, "/obj/machinery/newscaster", "/obj/machinery", {
	screen: 0,
	paper_remaining: 15,
	securityCaster: 0,
	unit_no: 0,
	alert_delay: 500,
	alert: 0,
	scanned_user: "Unknown",
	msg: "",
	photo: null,
	channel_name: "",
	c_locked: 0,
	viewing_channel: null,
	allow_comments: 1,
	verb_say: "beeps",
	verb_ask: "beeps",
	verb_exclaim: "beeps",
	anchored: 1,
	name: "newscaster",
	desc: "A standard Nanotrasen-licensed newsfeed handler for use in commercial space stations. All the news you absolutely have no use for, in one place!",
	icon: rt.rsc("icons/obj/terminals.dmi"),
	icon_state: "newscaster_normal",
	armor: null,
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 50,
});

// newscaster.dm:178
rt.def("/obj/machinery/newscaster/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 30]);
	return f.dot;
});

// newscaster.dm:202
rt.def("/obj/machinery/newscaster/proc/New", function* New(f: Frame, loc: Value, ndir: Value, building: Value) {
	let NEWSCASTER: Value = null;
	let $0: any, $e: any;
	yield* parent_proc();
	if (building) {
		yield* this.setDir(ndir);
		if (rt.bitAnd(this.dir, 3)) {
			$0 = 0;
		} else if (this.dir == 4) {
			$0 = -32;
		} else {
			$0 = 32;
		}
		this.pixel_x = $0;
		if (rt.bitAnd(this.dir, 3)) {
			if (this.dir == 1) {
				$0 = -32;
			} else {
				$0 = 32;
			}
		} else {
			$0 = 0;
		}
		this.pixel_y = $0;
	}
	GLOB.allCasters += this;
	for (NEWSCASTER of each(GLOB.allCasters, T("/obj/machinery/newscaster"))) {
		this.unit_no++;
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// newscaster.dm:214
rt.def("/obj/machinery/newscaster/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.allCasters -= this;
	this.viewing_channel = null;
	this.photo = null;
	return (yield* parent_proc());
}, true);

// newscaster.dm:220
rt.def("/obj/machinery/newscaster/proc/update_icon", function update_icon(f: Frame) {
	let hp_percent: Value = null;
	this.cut_overlays();
	if (rt.bitAnd(this.stat, 3)) {
		this.icon_state = "newscaster_off";
	} else if (GLOB.news_network.wanted_issue.active) {
		this.icon_state = "newscaster_wanted";
	} else {
		this.icon_state = "newscaster_normal";
		if (this.alert) {
			this.add_overlay("newscaster_alert");
		}
	}
	const subject = (hp_percent = this.obj_integrity * 100 / this.max_integrity);
	if (rt.inRange(subject, 75, 100)) {
		return f.dot;
	} else if (rt.inRange(subject, 50, 75)) {
		this.add_overlay("crack1");
	} else if (rt.inRange(subject, 25, 50)) {
		this.add_overlay("crack2");
	} else {
		this.add_overlay("crack3");
	}
	return f.dot;
});

// newscaster.dm:243
rt.def("/obj/machinery/newscaster/proc/power_change", function power_change(f: Frame) {
	if (rt.bitAnd(this.stat, 1)) {
		return f.dot;
	}
	if (this.powered()) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
		this.update_icon();
	} else {
		rt.spawnTail(f, rand(0, 15), "/obj/machinery/newscaster/proc/power_change: spawn at game/machinery/newscaster.dm:247");
	}
	return f.dot;
});

// a spawn(rt.call(f, P("/proc/rand"), null, [0, 15])) body of /obj/machinery/newscaster/proc/power_change, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/newscaster/proc/power_change: spawn at game/machinery/newscaster.dm:247", function* (f: Frame) {
	if (this.powered()) { // power came back during the wait (tg: the screen then stayed dark)
		return null;
	}
	(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	yield* this.update_icon();
	return null;
});

// newscaster.dm:254
rt.def("/obj/machinery/newscaster/proc/take_damage", function* take_damage(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = "brute";
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* parent_proc());
	yield* this.update_icon();
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// newscaster.dm:258
rt.def("/obj/machinery/newscaster/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// newscaster.dm:261
rt.def("/obj/machinery/newscaster/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let dat: Value = null, wanted_already: Value = null, CHANNEL: Value = null, existing_authors: Value = null, FC: Value = null, check: Value = null, FC_4: Value = null, total_num: Value = null, active_num: Value = null, message_num: Value = null, FC_5: Value = null, i: Value = null, MESSAGE: Value = null, comment: Value = null, MESSAGE_2: Value = null, comment_3: Value = null, end_param: Value = null, popup: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $e: any;
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!(rt.istype(user, T("/mob/living/carbon/human")) || rt.istype(user, T("/mob/living/silicon")))) return f.dot;
	let human_or_robot_user: Value = user;
	this.scan_user(human_or_robot_user);
	if (this.screen === 0) {
		dat += `Welcome to Newscasting Unit #${this.unit_no}.<BR> Interface & News networks Operational.`;
		dat += "<BR><FONT SIZE=1>Property of Nanotrasen Inc</FONT>";
		if (GLOB.news_network.wanted_issue.active) {
			dat += fmt("<HR><A href='?src=＃;view_wanted=1'>Read Wanted Issue</A>", [this]);
		}
		dat += fmt("<HR><BR><A href='?src=＃;create_channel=1'>Create Feed Channel</A>", [this]);
		dat += fmt("<BR><A href='?src=＃;view=1'>View Feed Channels</A>", [this]);
		dat += fmt("<BR><A href='?src=＃;create_feed_story=1'>Submit new Feed story</A>", [this]);
		dat += fmt("<BR><A href='?src=＃;menu_paper=1'>Print newspaper</A>", [this]);
		dat += fmt("<BR><A href='?src=＃;refresh=1'>Re-scan User</A>", [this]);
		dat += fmt("<BR><BR><A href='?src=＃;mach_close=newscaster_main'>Exit</A>", [human_or_robot_user]);
		if (this.securityCaster) {
			wanted_already = 0;
			if (GLOB.news_network.wanted_issue.active) {
				wanted_already = 1;
			}
			dat += "<HR><B>Feed Security functions:</B><BR>";
			$0 = this;
			if (wanted_already) {
				$1 = "Manage";
			} else {
				$1 = "Publish";
			}
			dat += fmt("<BR><A href='?src=＃;menu_wanted=1'>＀ \"Wanted\" Issue</A>", [$0, $1]);
			dat += fmt("<BR><A href='?src=＃;menu_censor_story=1'>Censor Feed Stories</A>", [this]);
			dat += fmt("<BR><A href='?src=＃;menu_censor_channel=1'>Mark Feed Channel with Nanotrasen D-Notice</A>", [this]);
		}
		dat += `<BR><HR>The newscaster recognises you as: <FONT COLOR='green'>${this.scanned_user}</FONT>`;
	} else if (this.screen === 1) {
		dat += "Station Feed Channels<HR>";
		if (isemptylist(GLOB.news_network.network_channels)) {
			dat += "<I>No active channels found...</I>";
		} else {
			for (CHANNEL of each(GLOB.news_network.network_channels, T("/datum/newscaster/feed_channel"))) {
				if (CHANNEL.is_admin_channel) {
					dat += fmt("<B><FONT style='BACKGROUND-COLOR: LightGreen '><A href='?src=＃;show_channel=＃'>＀</A></FONT></B><BR>", [this, CHANNEL, CHANNEL.channel_name]);
				} else {
					$0 = this;
					$1 = CHANNEL;
					$2 = CHANNEL.channel_name;
					if (CHANNEL.censored) {
						$3 = "<FONT COLOR='red'>***</FONT>";
					} else {
						$3 = null;
					}
					dat += fmt("<B><A href='?src=＃;show_channel=＃'>＀</A> ＀<BR></B>", [$0, $1, $2, $3]);
				}
			}
		}
		dat += fmt("<BR><HR><A href='?src=＃;refresh=1'>Refresh</A>", [this]);
		dat += fmt("<BR><A href='?src=＃;setScreen=＀'>Back</A>", [this, 0]);
	} else if (this.screen === 2) {
		dat += "Creating new Feed Channel...";
		dat += fmt("<HR><B><A href='?src=＃;set_channel_name=1'>Channel Name</A>:</B> ＀<BR>", [this, this.channel_name]);
		dat += `<B>Channel Author:</B> <FONT COLOR='green'>${this.scanned_user}</FONT><BR>`;
		$0 = this;
		if (this.c_locked) {
			$1 = "NO";
		} else {
			$1 = "YES";
		}
		dat += fmt("<B><A href='?src=＃;set_channel_lock=1'>Will Accept Public Feeds</A>:</B> ＀<BR><BR>", [$0, $1]);
		dat += fmt("<BR><A href='?src=＃;submit_new_channel=1'>Submit</A><BR><BR><A href='?src=＃;setScreen=＀'>Cancel</A><BR>", [this, this, 0]);
	} else if (this.screen === 3) {
		dat += "Creating new Feed Message...";
		dat += fmt("<HR><B><A href='?src=＃;set_channel_receiving=1'>Receiving Channel</A>:</B> ＀<BR>", [this, this.channel_name]);
		dat += `<B>Message Author:</B> <FONT COLOR='green'>${this.scanned_user}</FONT><BR>`;
		dat += fmt("<B><A href='?src=＃;set_new_message=1'>Message Body</A>:</B> <BR><font face=\"＀\">＀</font><BR>", [this, "Verdana", parsepencode(this.msg, user, "Times New Roman")]);
		$0 = this;
		if (this.photo) {
			$1 = "Photo Attached";
		} else {
			$1 = "No Photo";
		}
		dat += fmt("<B><A href='?src=＃;set_attachment=1'>Attach Photo</A>:</B>  ＀</BR>", [$0, $1]);
		$0 = this;
		if (this.allow_comments) {
			$1 = "Enabled";
		} else {
			$1 = "Disabled";
		}
		dat += fmt("<B><A href='?src=＃;set_comment=1'>Comments ＀</A></B><BR>", [$0, $1]);
		dat += fmt("<BR><A href='?src=＃;submit_new_message=1'>Submit</A><BR><BR><A href='?src=＃;setScreen=＀'>Cancel</A><BR>", [this, this, 0]);
	} else if (this.screen === 4) {
		dat += `Feed story successfully submitted to ${this.channel_name}.<BR><BR>`;
		dat += fmt("<BR><A href='?src=＃;setScreen=＀'>Return</A><BR>", [this, 0]);
	} else if (this.screen === 5) {
		dat += `Feed Channel ${this.channel_name} created successfully.<BR><BR>`;
		dat += fmt("<BR><A href='?src=＃;setScreen=＀'>Return</A><BR>", [this, 0]);
	} else if (this.screen === 6) {
		dat += "<B><FONT COLOR='maroon'>ERROR: Could not submit Feed story to Network.</B></FONT><HR><BR>";
		if (this.channel_name == "") {
			dat += "<FONT COLOR='maroon'>Invalid receiving channel name.</FONT><BR>";
		}
		if (this.scanned_user == "Unknown") {
			dat += "<FONT COLOR='maroon'>Channel author unverified.</FONT><BR>";
		}
		if (this.msg == "" || this.msg == "[REDACTED]") {
			dat += "<FONT COLOR='maroon'>Invalid message body.</FONT><BR>";
		}
		dat += fmt("<BR><A href='?src=＃;setScreen=＀'>Return</A><BR>", [this, 3]);
	} else if (this.screen === 7) {
		dat += "<B><FONT COLOR='maroon'>ERROR: Could not submit Feed Channel to Network.</B></FONT><HR><BR>";
		existing_authors = list();
		for (FC of each(GLOB.news_network.network_channels, T("/datum/newscaster/feed_channel"))) {
			if (FC.authorCensor) {
				existing_authors += GLOB.news_network.redactedText;
			} else {
				existing_authors += FC.author;
			}
		}
		if (rt.isIn(f, this.scanned_user, existing_authors)) {
			dat += "<FONT COLOR='maroon'>There is already a Feed channel under your name.</FONT><BR>";
		}
		if (this.channel_name == "" || this.channel_name == "[REDACTED]") {
			dat += "<FONT COLOR='maroon'>Invalid channel name.</FONT><BR>";
		}
		check = 0;
		for (FC_4 of each(GLOB.news_network.network_channels, T("/datum/newscaster/feed_channel"))) {
			if (FC_4.channel_name == this.channel_name) {
				check = 1;
				break;
			}
		}
		if (check) {
			dat += "<FONT COLOR='maroon'>Channel name already in use.</FONT><BR>";
		}
		if (this.scanned_user == "Unknown") {
			dat += "<FONT COLOR='maroon'>Channel author unverified.</FONT><BR>";
		}
		dat += fmt("<BR><A href='?src=＃;setScreen=＀'>Return</A><BR>", [this, 2]);
	} else if (this.screen === 8) {
		total_num = rt.length(GLOB.news_network.network_channels);
		active_num = total_num;
		message_num = 0;
		for (FC_5 of each(GLOB.news_network.network_channels, T("/datum/newscaster/feed_channel"))) {
			if (!FC_5.censored) {
				message_num += rt.length(FC_5.messages);
			} else {
				active_num--;
			}
		}
		dat += `Network currently serves a total of ${total_num} Feed channels, ${active_num} of which are active, and a total of ${message_num} Feed Stories.`;
		dat += `<BR><BR><B>Liquid Paper remaining:</B> ${this.paper_remaining * 100} cm^3`;
		dat += fmt("<BR><BR><A href='?src=＃;print_paper=＀'>Print Paper</A>", [this, 0]);
		dat += fmt("<BR><A href='?src=＃;setScreen=＀'>Cancel</A>", [this, 0]);
	} else if (this.screen === 9) {
		dat += `<B>${this.viewing_channel.channel_name}: </B><FONT SIZE=1>[created by: <FONT COLOR='maroon'>${this.viewing_channel.returnAuthor(-1)}</FONT>]</FONT><HR>`;
		if (this.viewing_channel.censored) {
			dat += "<FONT COLOR='red'><B>ATTENTION: </B></FONT>This channel has been deemed as threatening to the welfare of the station, and marked with a Nanotrasen D-Notice.<BR>";
			dat += "No further feed story additions are allowed while the D-Notice is in effect.</FONT><BR><BR>";
		} else if (isemptylist(this.viewing_channel.messages)) {
			dat += "<I>No feed messages found in channel...</I><BR>";
		} else {
			i = 0;
			for (MESSAGE of each(this.viewing_channel.messages, T("/datum/newscaster/feed_message"))) {
				i++;
				dat += `-${MESSAGE.returnBody(-1)} <BR>`;
				if (MESSAGE.img) {
					rt.op(f, "BrowseResource", [], [f.usr, MESSAGE.img, `tmp_photo${i}.png`], false);
					dat += `<img src='tmp_photo${i}.png' width = '180'><BR>`;
					if (MESSAGE.caption) {
						dat += `${MESSAGE.caption}<BR>`;
					}
					dat += "<BR>";
				}
				dat += `<FONT SIZE=1>[Story by <FONT COLOR='maroon'>${MESSAGE.returnAuthor(-1)} </FONT>] - (${MESSAGE.time_stamp})</FONT><BR>`;
				$0 = rt.len(f, MESSAGE.comments);
				if (rt.len(f, MESSAGE.comments) > 1) {
					$1 = "s";
				} else {
					$1 = "";
				}
				dat += `<b><font size=1>${$0} comment${$1}</font></b><br>`;
				comment = null;
				for (comment of each(MESSAGE.comments, T("/datum/newscaster/feed_comment"))) {
					dat += `<font size=1><small>${comment.body}</font><br><font size=1><small><small><small>${comment.author} ${comment.time_stamp}</small></small></small></small></font><br>`;
				}
				if (MESSAGE.locked) {
					dat += "<b>Comments locked</b><br>";
				} else {
					dat += fmt("<a href='?src=＃;new_comment=＃'>Comment</a><br>", [this, MESSAGE]);
				}
			}
		}
		dat += fmt("<BR><HR><A href='?src=＃;refresh=1'>Refresh</A>", [this]);
		dat += fmt("<BR><A href='?src=＃;setScreen=＀'>Back</A>", [this, 1]);
	} else if (this.screen === 10) {
		dat += "<B>Nanotrasen Feed Censorship Tool</B><BR>";
		dat += "<FONT SIZE=1>NOTE: Due to the nature of news Feeds, total deletion of a Feed Story is not possible.<BR>";
		dat += "Keep in mind that users attempting to view a censored feed will instead see the [REDACTED] tag above it.</FONT>";
		dat += "<HR>Select Feed channel to get Stories from:<BR>";
		if (isemptylist(GLOB.news_network.network_channels)) {
			dat += "<I>No feed channels found active...</I><BR>";
		} else {
			CHANNEL = null;
			for (CHANNEL of each(GLOB.news_network.network_channels, T("/datum/newscaster/feed_channel"))) {
				$0 = this;
				$1 = CHANNEL;
				$2 = CHANNEL.channel_name;
				if (CHANNEL.censored) {
					$3 = "<FONT COLOR='red'>***</FONT>";
				} else {
					$3 = null;
				}
				dat += fmt("<A href='?src=＃;pick_censor_channel=＃'>＀</A> ＀<BR>", [$0, $1, $2, $3]);
			}
		}
		dat += fmt("<BR><A href='?src=＃;setScreen=＀'>Cancel</A>", [this, 0]);
	} else if (this.screen === 11) {
		dat += "<B>Nanotrasen D-Notice Handler</B><HR>";
		dat += "<FONT SIZE=1>A D-Notice is to be bestowed upon the channel if the handling Authority deems it as harmful for the station's";
		dat += "morale, integrity or disciplinary behaviour. A D-Notice will render a channel unable to be updated by anyone, without deleting any feed";
		dat += "stories it might contain at the time. You can lift a D-Notice if you have the required access at any time.</FONT><HR>";
		if (isemptylist(GLOB.news_network.network_channels)) {
			dat += "<I>No feed channels found active...</I><BR>";
		} else {
			CHANNEL = null;
			for (CHANNEL of each(GLOB.news_network.network_channels, T("/datum/newscaster/feed_channel"))) {
				$0 = this;
				$1 = CHANNEL;
				$2 = CHANNEL.channel_name;
				if (CHANNEL.censored) {
					$3 = "<FONT COLOR='red'>***</FONT>";
				} else {
					$3 = null;
				}
				dat += fmt("<A href='?src=＃;pick_d_notice=＃'>＀</A> ＀<BR>", [$0, $1, $2, $3]);
			}
		}
		dat += fmt("<BR><A href='?src=＃;setScreen=＀'>Back</A>", [this, 0]);
	} else if (this.screen === 12) {
		dat += `<B>${this.viewing_channel.channel_name}: </B><FONT SIZE=1>[ created by: <FONT COLOR='maroon'>${this.viewing_channel.returnAuthor(-1)}</FONT> ]</FONT><BR>`;
		$0 = this;
		$1 = this.viewing_channel;
		if (this.viewing_channel.authorCensor) {
			$2 = "Undo Author censorship";
		} else {
			$2 = "Censor channel Author";
		}
		dat += fmt("<FONT SIZE=2><A href='?src=＃;censor_channel_author=＃'>＀</A></FONT><HR>", [$0, $1, $2]);
		if (isemptylist(this.viewing_channel.messages)) {
			dat += "<I>No feed messages found in channel...</I><BR>";
		} else {
			for (MESSAGE_2 of each(this.viewing_channel.messages, T("/datum/newscaster/feed_message"))) {
				dat += `-${MESSAGE_2.returnBody(-1)} <BR><FONT SIZE=1>[Story by <FONT COLOR='maroon'>${MESSAGE_2.returnAuthor(-1)}</FONT>]</FONT><BR>`;
				$0 = this;
				$1 = MESSAGE_2;
				if (MESSAGE_2.bodyCensor) {
					$2 = "Undo story censorship";
				} else {
					$2 = "Censor story";
				}
				$3 = this;
				$4 = MESSAGE_2;
				if (MESSAGE_2.authorCensor) {
					$5 = "Undo Author Censorship";
				} else {
					$5 = "Censor message Author";
				}
				dat += fmt("<FONT SIZE=2><A href='?src=＃;censor_channel_story_body=＃'>＀</A>  -  <A href='?src=＃;censor_channel_story_author=＃'>＀</A></FONT><BR>", [$0, $1, $2, $3, $4, $5]);
				$0 = rt.len(f, MESSAGE_2.comments);
				if (rt.len(f, MESSAGE_2.comments) > 1) {
					$1 = "s";
				} else {
					$1 = "";
				}
				$2 = this;
				$3 = MESSAGE_2;
				if (MESSAGE_2.locked) {
					$4 = "Unlock";
				} else {
					$4 = "Lock";
				}
				dat += fmt("＀ comment＀: <a href='?src=＃;lock_comment=＃'>＀</a><br>", [$0, $1, $2, $3, $4]);
				comment_3 = null;
				for (comment_3 of each(MESSAGE_2.comments, T("/datum/newscaster/feed_comment"))) {
					dat += fmt("＀ <a href='?src=＃;del_comment=＃;del_comment_msg=＃'>X</a><br><font size=1>＀ ＀</font><br>", [comment_3.body, this, comment_3, MESSAGE_2, comment_3.author, comment_3.time_stamp]);
				}
			}
		}
		dat += fmt("<BR><A href='?src=＃;setScreen=＀'>Back</A>", [this, 10]);
	} else if (this.screen === 13) {
		dat += `<B>${this.viewing_channel.channel_name}: </B><FONT SIZE=1>[ created by: <FONT COLOR='maroon'>${this.viewing_channel.returnAuthor(-1)}</FONT> ]</FONT><BR>`;
		dat += fmt("Channel messages listed below. If you deem them dangerous to the station, you can <A href='?src=＃;toggle_d_notice=＃'>Bestow a D-Notice upon the channel</A>.<HR>", [this, this.viewing_channel]);
		if (this.viewing_channel.censored) {
			dat += "<FONT COLOR='red'><B>ATTENTION: </B></FONT>This channel has been deemed as threatening to the welfare of the station, and marked with a Nanotrasen D-Notice.<BR>";
			dat += "No further feed story additions are allowed while the D-Notice is in effect.</FONT><BR><BR>";
		} else if (isemptylist(this.viewing_channel.messages)) {
			dat += "<I>No feed messages found in channel...</I><BR>";
		} else {
			MESSAGE_2 = null;
			for (MESSAGE_2 of each(this.viewing_channel.messages, T("/datum/newscaster/feed_message"))) {
				dat += `-${MESSAGE_2.returnBody(-1)} <BR><FONT SIZE=1>[Story by <FONT COLOR='maroon'>${MESSAGE_2.returnAuthor(-1)}</FONT>]</FONT><BR>`;
			}
		}
		dat += fmt("<BR><A href='?src=＃;setScreen=＀'>Back</A>", [this, 11]);
	} else if (this.screen === 14) {
		dat += "<B>Wanted Issue Handler:</B>";
		wanted_already = 0;
		end_param = 1;
		if (GLOB.news_network.wanted_issue.active) {
			wanted_already = 1;
			end_param = 2;
		}
		if (wanted_already) {
			dat += "<FONT SIZE=2><BR><I>A wanted issue is already in Feed Circulation. You can edit or cancel it below.</FONT></I>";
		}
		dat += "<HR>";
		dat += fmt("<A href='?src=＃;set_wanted_name=1'>Criminal Name</A>: ＀ <BR>", [this, this.channel_name]);
		dat += fmt("<A href='?src=＃;set_wanted_desc=1'>Description</A>: ＀ <BR>", [this, this.msg]);
		$0 = this;
		if (this.photo) {
			$1 = "Photo Attached";
		} else {
			$1 = "No Photo";
		}
		dat += fmt("<A href='?src=＃;set_attachment=1'>Attach Photo</A>: ＀</BR>", [$0, $1]);
		if (wanted_already) {
			dat += `<B>Wanted Issue created by:</B><FONT COLOR='green'>${GLOB.news_network.wanted_issue.scannedUser}</FONT><BR>`;
		} else {
			dat += `<B>Wanted Issue will be created under prosecutor:</B><FONT COLOR='green'>${this.scanned_user}</FONT><BR>`;
		}
		$0 = this;
		$1 = end_param;
		if (wanted_already) {

			$2 = "Edit Issue";
		} else {
			$2 = "Submit";
		}
		dat += fmt("<BR><A href='?src=＃;submit_wanted=＀'>＀</A>", [$0, $1, $2]);
		if (wanted_already) {
			dat += fmt("<BR><A href='?src=＃;cancel_wanted=1'>Take down Issue</A>", [this]);
		}
		dat += fmt("<BR><A href='?src=＃;setScreen=＀'>Cancel</A>", [this, 0]);
	} else if (this.screen === 15) {
		dat += `<FONT COLOR='green'>Wanted issue for ${this.channel_name} is now in Network Circulation.</FONT><BR><BR>`;
		dat += fmt("<BR><A href='?src=＃;setScreen=＀'>Return</A><BR>", [this, 0]);
	} else if (this.screen === 16) {
		dat += "<B><FONT COLOR='maroon'>ERROR: Wanted Issue rejected by Network.</B></FONT><HR><BR>";
		if (this.channel_name == "" || this.channel_name == "[REDACTED]") {
			dat += "<FONT COLOR='maroon'>Invalid name for person wanted.</FONT><BR>";
		}
		if (this.scanned_user == "Unknown") {
			dat += "<FONT COLOR='maroon'>Issue author unverified.</FONT><BR>";
		}
		if (this.msg == "" || this.msg == "[REDACTED]") {
			dat += "<FONT COLOR='maroon'>Invalid description.</FONT><BR>";
		}
		dat += fmt("<BR><A href='?src=＃;setScreen=＀'>Return</A><BR>", [this, 0]);
	} else if (this.screen === 17) {
		dat += "<B>Wanted Issue successfully deleted from Circulation</B><BR>";
		dat += fmt("<BR><A href='?src=＃;setScreen=＀'>Return</A><BR>", [this, 0]);
	} else if (this.screen === 18) {
		if (GLOB.news_network.wanted_issue.active) {
			dat += `<B><FONT COLOR ='maroon'>-- STATIONWIDE WANTED ISSUE --</B></FONT><BR><FONT SIZE=2>[Submitted by: <FONT COLOR='green'>${GLOB.news_network.wanted_issue.scannedUser}</FONT>]</FONT><HR>`;
			dat += `<B>Criminal</B>: ${GLOB.news_network.wanted_issue.criminal}<BR>`;
			dat += `<B>Description</B>: ${GLOB.news_network.wanted_issue.body}<BR>`;
			dat += "<B>Photo:</B>: ";
			if (GLOB.news_network.wanted_issue.img) {
				rt.op(f, "BrowseResource", [], [f.usr, GLOB.news_network.wanted_issue.img, "tmp_photow.png"], false);
				dat += "<BR><img src='tmp_photow.png' width = '180'>";
			} else {
				dat += "None";
			}
		} else {
			dat += "No current wanted issue found.<BR><BR>";
		}
		dat += fmt("<BR><BR><A href='?src=＃;setScreen=＀'>Back</A><BR>", [this, 0]);
	} else if (this.screen === 19) {
		dat += `<FONT COLOR='green'>Wanted issue for ${this.channel_name} successfully edited.</FONT><BR><BR>`;
		dat += fmt("<BR><A href='?src=＃;setScreen=＀'>Return</A><BR>", [this, 0]);
	} else if (this.screen === 20) {
		dat += "<FONT COLOR='green'>Printing successful. Please receive your newspaper from the bottom of the machine.</FONT><BR><BR>";
		dat += fmt("<A href='?src=＃;setScreen=＀'>Return</A>", [this, 0]);
	} else if (this.screen === 21) {
		dat += "<FONT COLOR='maroon'>Unable to print newspaper. Insufficient paper. Please notify maintenance personnel to refill machine storage.</FONT><BR><BR>";
		dat += fmt("<A href='?src=＃;setScreen=＀'>Return</A>", [this, 0]);
	}
	(popup = (yield* new_(T("/datum/browser"), human_or_robot_user, "newscaster_main", `Newscaster Unit #${this.unit_no}`, 400, 600))).set_content(dat);
	popup.set_title_image(human_or_robot_user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// newscaster.dm:506
rt.def("/obj/machinery/newscaster/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let existing_authors: Value = null, FC: Value = null, check: Value = null, FC_2: Value = null, choice: Value = null, available_channels: Value = null, F: Value = null, temp_message: Value = null, already_wanted: Value = null, input_param: Value = null, choice_1: Value = null, choice_0: Value = null, FC_0: Value = null, MSG: Value = null, FM: Value = null, cominput: Value = null, FM_1: Value = null;
	let $0: any, $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!(f.usr.contents.Find(this) || get_dist(this, f.usr) <= 1 && isturf(this.loc) || rt.istype(f.usr, T("/mob/living/silicon")))) return f.dot;
	yield* f.usr.set_machine(this);
	this.scan_user(f.usr);
	if (rt.at(href_list, "set_channel_name")) {
		this.channel_name = (yield* stripped_input(f.usr, "Provide a Feed Channel Name", "Network Channel Handler", "", 42));
		while (findtext(this.channel_name, " ") == 1) {
			this.channel_name = copytext(this.channel_name, 2, lentext(this.channel_name) + 1);
		}
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "set_channel_lock")) {
		this.c_locked = (!this.c_locked ? 1 : 0);
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "submit_new_channel")) {
		existing_authors = list();
		for (FC of each(GLOB.news_network.network_channels, T("/datum/newscaster/feed_channel"))) {
			if (FC.authorCensor) {
				existing_authors += GLOB.news_network.redactedText;
			} else {
				existing_authors += FC.author;
			}
		}
		check = 0;
		for (FC_2 of each(GLOB.news_network.network_channels, T("/datum/newscaster/feed_channel"))) {
			if (FC_2.channel_name == this.channel_name) {
				check = 1;
				break;
			}
		}
		if (this.channel_name == "" || this.channel_name == "[REDACTED]" || this.scanned_user == "Unknown" || check || rt.isIn(f, this.scanned_user, existing_authors)) {
			this.screen = 7;
		} else if ((choice = (yield* alert("Please confirm Feed channel creation", "Network Channel Handler", "Confirm", "Cancel"))) == "Confirm") {
			this.scan_user(f.usr);
			GLOB.news_network.CreateFeedChannel(this.channel_name, this.scanned_user, this.c_locked);
			this.screen = 5;
		}
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "set_channel_receiving")) {
		available_channels = list();
		for (F of each(GLOB.news_network.network_channels, T("/datum/newscaster/feed_channel"))) {
			if ((!F.locked || F.author == this.scanned_user) && !F.censored) {
				available_channels += F.channel_name;
			}
		}
		this.channel_name = (yield* g.op(f, "Prompt", [0], [null, "Network Channel Handler", "Choose receiving Feed Channel", f.usr, available_channels]));
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "set_new_message")) {
		if (temp_message = trim((yield* stripped_multiline_input(f.usr, "Write your Feed story", "Network Channel Handler", this.msg)))) {
			this.msg = temp_message;
			yield* this.updateUsrDialog();
		}
	} else if (rt.at(href_list, "set_attachment")) {
		yield* this.AttachPhoto(f.usr);
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "submit_new_message")) {
		if (this.msg == "" || this.msg == "[REDACTED]" || this.scanned_user == "Unknown" || this.channel_name == "") {
			this.screen = 6;
		} else {
			yield* GLOB.news_network.SubmitArticle(`<font face="${"Verdana"}">${parsepencode(this.msg, f.usr, "Times New Roman")}</font>`, this.scanned_user, this.channel_name, this.photo, 0, this.allow_comments);
			this.screen = 4;
			this.msg = "";
		}
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "create_channel")) {
		this.screen = 2;
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "create_feed_story")) {
		this.screen = 3;
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "menu_paper")) {
		this.screen = 8;
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "print_paper")) {
		if (!this.paper_remaining) {
			this.screen = 21;
		} else {
			yield* this.print_paper();
			this.screen = 20;
		}
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "menu_censor_story")) {
		this.screen = 10;
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "menu_censor_channel")) {
		this.screen = 11;
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "menu_wanted")) {
		already_wanted = 0;
		if (GLOB.news_network.wanted_issue.active) {
			already_wanted = 1;
		}
		if (already_wanted) {
			this.channel_name = GLOB.news_network.wanted_issue.criminal;
			this.msg = GLOB.news_network.wanted_issue.body;
		}
		this.screen = 14;
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "set_wanted_name")) {
		this.channel_name = trim((yield* stripped_input(f.usr, "Provide the name of the Wanted person", "Network Security Handler")));
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "set_wanted_desc")) {
		this.msg = trim((yield* stripped_input(f.usr, "Provide a description of the Wanted person and any other details you deem important", "Network Security Handler")));
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "submit_wanted")) {
		input_param = text2num(rt.at(href_list, "submit_wanted"));
		if (this.msg == "" || this.channel_name == "" || this.scanned_user == "Unknown") {
			this.screen = 16;
		} else {
			if (input_param == 1) {
				$0 = "creation.";
			} else {
				$0 = "edit.";
			}
			if ((choice_1 = (yield* alert(`Please confirm Wanted Issue ${$0}`, "Network Security Handler", "Confirm", "Cancel"))) == "Confirm") {
				this.scan_user(f.usr);
				if (input_param == 1) {
					yield* GLOB.news_network.submitWanted(this.channel_name, this.msg, this.scanned_user, this.photo, 0, 1);
					this.screen = 15;
				} else {
					if (GLOB.news_network.wanted_issue.isAdminMsg) {
						yield* alert("The wanted issue has been distributed by a Nanotrasen higherup. You cannot edit it.", "Ok");
						return f.dot;
					}
					yield* GLOB.news_network.submitWanted(this.channel_name, this.msg, this.scanned_user, this.photo);
					this.screen = 19;
				}
			}
		}
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "cancel_wanted")) {
		if (GLOB.news_network.wanted_issue.isAdminMsg) {
			yield* alert("The wanted issue has been distributed by a Nanotrasen higherup. You cannot take it down.", "Ok");
			return f.dot;
		}
		if ((choice_0 = (yield* alert("Please confirm Wanted Issue removal", "Network Security Handler", "Confirm", "Cancel"))) == "Confirm") {
			GLOB.news_network.deleteWanted();
			this.screen = 17;
		}
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "view_wanted")) {
		this.screen = 18;
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "censor_channel_author")) {
		if ((FC_0 = rt.locateIn(f, rt.at(href_list, "censor_channel_author"), rt.world())).is_admin_channel) {
			yield* alert("This channel was created by a Nanotrasen Officer. You cannot censor it.", "Ok");
			return f.dot;
		}
		FC_0.toggleCensorAuthor();
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "censor_channel_story_author")) {
		if ((MSG = rt.locateIn(f, rt.at(href_list, "censor_channel_story_author"), rt.world())).is_admin_message) {
			yield* alert("This message was created by a Nanotrasen Officer. You cannot censor its author.", "Ok");
			return f.dot;
		}
		MSG.toggleCensorAuthor();
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "censor_channel_story_body")) {
		if ((MSG = rt.locateIn(f, rt.at(href_list, "censor_channel_story_body"), rt.world())).is_admin_message) {
			yield* alert("This channel was created by a Nanotrasen Officer. You cannot censor it.", "Ok");
			return f.dot;
		}
		MSG.toggleCensorBody();
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "pick_d_notice")) {
		this.viewing_channel = (FC_0 = rt.locateIn(f, rt.at(href_list, "pick_d_notice"), rt.world()));
		this.screen = 13;
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "toggle_d_notice")) {
		if ((FC_0 = rt.locateIn(f, rt.at(href_list, "toggle_d_notice"), rt.world())).is_admin_channel) {
			yield* alert("This channel was created by a Nanotrasen Officer. You cannot place a D-Notice upon it.", "Ok");
			return f.dot;
		}
		FC_0.toggleCensorDclass();
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "view")) {
		this.screen = 1;
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "setScreen")) {
		this.screen = text2num(rt.at(href_list, "setScreen"));
		if (this.screen == 0) {
			this.scanned_user = "Unknown";
			this.msg = "";
			this.c_locked = 0;
			this.channel_name = "";
			this.viewing_channel = null;
		}
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "show_channel")) {
		this.viewing_channel = (FC_0 = rt.locateIn(f, rt.at(href_list, "show_channel"), rt.world()));
		this.screen = 9;
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "pick_censor_channel")) {
		this.viewing_channel = (FC_0 = rt.locateIn(f, rt.at(href_list, "pick_censor_channel"), rt.world()));
		this.screen = 12;
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "new_comment")) {
		FM = rt.locateIn(f, rt.at(href_list, "new_comment"), rt.world());
		if (cominput = copytext((yield* stripped_input(f.usr, "Write your message:", "New comment", null)), 1, 141)) {
			this.scan_user(f.usr);
			(FC_2 = (yield* new_(T("/datum/newscaster/feed_comment")))).author = this.scanned_user;
			FC_2.body = cominput;
			FC_2.time_stamp = worldtime2text();
			FM.comments += FC_2;
			log_comment(`${f.usr}/(${f.usr.ckey}) as ${this.scanned_user} commented on message ${FM.returnBody(-1)} -- ${FC_2.body}`);
		}
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "del_comment")) {
		FC_0 = rt.locateIn(f, rt.at(href_list, "del_comment"), rt.world());
		(FM_1 = rt.locateIn(f, rt.at(href_list, "del_comment_msg"), rt.world())).comments -= FC_0;
		yield* qdel(FC_0);
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "lock_comment")) {
		(rt.modField(f, (FM = rt.locateIn(f, rt.at(href_list, "lock_comment"), rt.world())), "locked", 1, rt.bitXor));
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "set_comment")) {
		(rt.modSrcVar(f, "allow_comments", 1, rt.bitXor));
		yield* this.updateUsrDialog();
	} else {
		if (!rt.at(href_list, "refresh")) return f.dot;
		yield* this.updateUsrDialog();
	}
	return f.dot;
}, true);

// newscaster.dm:716
rt.def("/obj/machinery/newscaster/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let WT: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/wrench"))) {
		to_chat(user, `<span class='notice'>You start ${this.anchored ? "un" : ""}securing ${this.name}...</span>`);
		playsound(this.loc, I.usesound, 50, 1);
		if (yield* do_after(user, 60 * I.toolspeed, { target: this })) {
			playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			if (rt.bitAnd(this.stat, 1)) {
				to_chat(user, `<span class='warning'>The broken remains of ${this} fall on the ground.</span>`);
				yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 5);
				yield* new_(T("/obj/item/weapon/shard"), this.loc);
				yield* new_(T("/obj/item/weapon/shard"), this.loc);
			} else {
				to_chat(user, `<span class='notice'>You ${this.anchored ? "un" : ""}secure ${this.name}.</span>`);
				yield* new_(T("/obj/item/wallframe/newscaster"), this.loc);
			}
			yield* qdel(this);
		}
	} else if (rt.istype(I, T("/obj/item/weapon/weldingtool")) && user.a_intent != "harm") {
		WT = I;
		if (rt.bitAnd(this.stat, 1)) {
			if (yield* WT.remove_fuel(0, user)) {
				user.visible_message(`${user} is repairing ${this}.`, `<span class='notice'>You begin repairing ${this}...</span>`, "<span class='italics'>You hear welding.</span>");
				playsound(this.loc, WT.usesound, 40, 1);
				if (yield* do_after(user, 40 * WT.toolspeed, 1, { target: this })) {
					if (!WT.isOn() || !rt.bitAnd(this.stat, 1)) {
						return f.dot;
					}
					to_chat(user, `<span class='notice'>You repair ${this}.</span>`);
					playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 50, 1);
					this.obj_integrity = this.max_integrity;
					(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
					yield* this.update_icon();
				}
			}
		} else {
			to_chat(user, `<span class='notice'>${this} does not need repairs.</span>`);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// newscaster.dm:752
rt.def("/obj/machinery/newscaster/proc/play_attack_sound", function play_attack_sound(f: Frame, damage: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		if (rt.bitAnd(this.stat, 1)) {
			playsound(this.loc, rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 100, 1);
		} else {
			playsound(this.loc, rt.rsc("sound/effects/glasshit.ogg"), 90, 1);
		}
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	return f.dot;
});

// newscaster.dm:763
rt.def("/obj/machinery/newscaster/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 2);
		yield* new_(T("/obj/item/weapon/shard"), this.loc);
		yield* new_(T("/obj/item/weapon/shard"), this.loc);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// newscaster.dm:770
rt.def("/obj/machinery/newscaster/proc/obj_break", function obj_break(f: Frame) {
	if (!(!rt.bitAnd(this.stat, 1) && !rt.bitAnd(this.flags, NODECONSTRUCT))) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	playsound(this.loc, rt.rsc("sound/effects/glassbr3.ogg"), 100, 1);
	this.update_icon();
	return f.dot;
});

// newscaster.dm:777
rt.def("/obj/machinery/newscaster/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	if (user.a_intent != "harm") {
		to_chat(user, "<span class='warning'>The newscaster controls are far too complicated for your tiny brain!</span>");
	} else {
		yield* this.take_damage(5, "brute", "melee");
	}
	return f.dot;
}, true);

// newscaster.dm:784
rt.def("/obj/machinery/newscaster/proc/AttachPhoto", function* AttachPhoto(f: Frame, user: Value) {
	let selection: Value = null, targetcam: Value = null, R: Value = null, t: Value = null, q: Value = null;
	if (this.photo) {
		if (!this.photo.sillynewscastervar) {
			this.photo.loc = this.loc;
			if (!rt.istype(user, T("/mob/living/silicon"))) {
				yield* user.put_in_inactive_hand(this.photo);
			}
		} else {
			yield* qdel(this.photo);
		}
		this.photo = null;
	}
	if (rt.istype(user.get_active_held_item(), T("/obj/item/weapon/photo"))) {
		this.photo = user.get_active_held_item();
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		this.photo.loc = this;
	}
	if (!rt.istype(user, T("/mob/living/silicon"))) return f.dot;
	let nametemp: Value = list();
	if (rt.istype(user, T("/mob/living/silicon/ai"))) {
		targetcam = (R = user).aicamera;
	} else if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		if ((R = user).connected_ai) {
			targetcam = R.connected_ai.aicamera;
		} else {
			targetcam = R.aicamera;
		}
	} else {
		to_chat(user, "<span class='warning'>You cannot interface with silicon photo uploading!</span>");
	}
	if (rt.len(f, targetcam.aipictures) == 0) {
		to_chat(f.usr, "<span class='boldannounce'>No images saved</span>");
		return f.dot;
	}
	for (t of each(targetcam.aipictures, T("/datum/picture"))) {
		nametemp += rt.index(t.fields, "name");
	}
	let find: Value = (yield* g.op(f, "Prompt", [0], [null, null, null, "Select image (numbered in order taken)", nametemp]));
	let _P: Value = (yield* new_(T("/obj/item/weapon/photo")));
	for (q of each(targetcam.aipictures, T("/datum/picture"))) {
		if (rt.index(q.fields, "name") == find) {
			selection = q;
			break;
		}
	}
	_P.photocreate(rt.index(selection.fields, "icon"), rt.index(selection.fields, "img"), rt.index(selection.fields, "desc"));
	_P.sillynewscastervar = 1;
	this.photo = _P;
	yield* qdel(_P);
	return f.dot;
}, true);

// newscaster.dm:829
rt.def("/obj/machinery/newscaster/proc/scan_user", function scan_user(f: Frame, user: Value) {
	let human_user: Value = null, _P: Value = null, ID: Value = null, ai_user: Value = null;
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		if ((human_user = user).wear_id) {
			if (rt.istype(human_user.wear_id, T("/obj/item/device/pda"))) {
				if ((_P = human_user.wear_id).id) {
					this.scanned_user = `${_P.id.registered_name} (${_P.id.assignment})`;
				} else {
					this.scanned_user = "Unknown";
				}
			} else if (rt.istype(human_user.wear_id, T("/obj/item/weapon/card/id"))) {
				this.scanned_user = `${(ID = human_user.wear_id).registered_name} (${ID.assignment})`;
			} else {
				this.scanned_user = "Unknown";
			}
		} else {
			this.scanned_user = "Unknown";
		}
	} else if (rt.istype(user, T("/mob/living/silicon"))) {
		this.scanned_user = `${(ai_user = user).name} (${ai_user.job})`;
	} else {
		rt.throw_(f, new_(T("/exception"), "Invalid user for this proc", "code/game/machinery/newscaster.dm", 849));
		return f.dot;
	}
	return f.dot;
});

// newscaster.dm:853
rt.def("/obj/machinery/newscaster/proc/print_paper", function* print_paper(f: Frame) {
	let FC: Value = null;
	let NEWSPAPER: Value = (yield* new_(T("/obj/item/weapon/newspaper")));
	for (FC of each(GLOB.news_network.network_channels, T("/datum/newscaster/feed_channel"))) {
		NEWSPAPER.news_content += FC;
	}
	if (GLOB.news_network.wanted_issue.active) {
		NEWSPAPER.wantedAuthor = GLOB.news_network.wanted_issue.scannedUser;
		NEWSPAPER.wantedCriminal = GLOB.news_network.wanted_issue.criminal;
		NEWSPAPER.wantedBody = GLOB.news_network.wanted_issue.body;
		if (GLOB.news_network.wanted_issue.img) {
			NEWSPAPER.wantedPhoto = GLOB.news_network.wanted_issue.img;
		}
	}
	NEWSPAPER.loc = rt.getStep(f, this, 0);
	NEWSPAPER.creationTime = GLOB.news_network.lastAction;
	this.paper_remaining--;
	return f.dot;
}, true);

// newscaster.dm:869
rt.def("/obj/machinery/newscaster/proc/newsAlert", function* newsAlert(f: Frame, channel: Value) {
	if (channel) {
		yield* this.say(`Breaking news from ${channel}!`);
		this.alert++;
		yield* this.update_icon();
		rt.spawnTail(f, this.alert_delay, "/obj/machinery/newscaster/proc/newsAlert: spawn at game/machinery/newscaster.dm:872", channel);
		playsound(this.loc, rt.rsc("sound/machines/twobeep.ogg"), 75, 1);
	} else {
		yield* this.say("Attention! Wanted issue distributed!");
		playsound(this.loc, rt.rsc("sound/machines/warning-buzzer.ogg"), 75, 1);
	}
	return f.dot;
}, true);

// a spawn(rt.srcVarI(f, $ic[454])) body of /obj/machinery/newscaster/proc/newsAlert, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/newscaster/proc/newsAlert: spawn at game/machinery/newscaster.dm:872", function* (f: Frame, channel: Value) {
	this.alert--;
	yield* this.update_icon();
	return null;
});

rt.type(6940, "/obj/item/weapon/newspaper", "/obj/item/weapon", {
	screen: 0,
	pages: 0,
	curr_page: 0,
	news_content: null,
	scribble: "",
	scribble_page: null,
	wantedAuthor: null,
	wantedCriminal: null,
	wantedBody: null,
	wantedPhoto: null,
	creationTime: null,
	name: "newspaper",
	desc: "An issue of The Griffon, the newspaper circulating aboard Nanotrasen Space Stations.",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "newspaper",
	w_class: 2,
	attack_verb: null,
});

// newscaster.dm:891
rt.def("/obj/item/weapon/newspaper/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.news_content = list();

	this.attack_verb = list("bapped");
	return f.dot;
});

// newscaster.dm:901
rt.def("/obj/item/weapon/newspaper/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is focusing intently on ${this}! It looks like ${user.p_theyre()} trying to commit sudoku... until ${user.p_their()} eyes light up with realization!</span>`);
	yield* user.say(";JOURNALISM IS MY CALLING! EVERYBODY APPRECIATES UNBIASED REPORTI-GLORF");
	let H: Value = user;
	let W: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/bottle/whiskey"), H.loc));
	playsound(H.loc, rt.rsc("sound/items/drink.ogg"), rand(10, 50), 1);
	yield* W.reagents.trans_to(H, W.reagents.total_volume);
	user.visible_message(`<span class='suicide'>${user} downs the contents of ${W.name} in one gulp! Shoulda stuck to sudoku!</span>`);
	return 4;
}, true);

// newscaster.dm:912
rt.def("/obj/item/weapon/newspaper/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let human_user: Value = null, dat: Value = null, NP: Value = null, temp_page: Value = null, NP_3: Value = null, C: Value = null, i: Value = null, MESSAGE: Value = null;
	let $e: any;
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		human_user = user;
		this.pages = 0;
		if (this.screen === 0) {
			dat += "<DIV ALIGN='center'><B><FONT SIZE=6>The Griffon</FONT></B></div>";
			dat += "<DIV ALIGN='center'><FONT SIZE=2>Nanotrasen-standard newspaper, for use on Nanotrasen? Space Facilities</FONT></div><HR>";
			if (isemptylist(this.news_content)) {
				if (this.wantedAuthor) {
					dat += `Contents:<BR><ul><B><FONT COLOR='red'>**</FONT>Important Security Announcement<FONT COLOR='red'>**</FONT></B> <FONT SIZE=2>[page ${this.pages + 2}]</FONT><BR></ul>`;
				} else {
					dat += "<I>Other than the title, the rest of the newspaper is unprinted...</I>";
				}
			} else {
				dat += "Contents:<BR><ul>";
				for (NP of each(this.news_content, T("/datum/newscaster/feed_channel"))) {
					this.pages++;
				}
				if (this.wantedAuthor) {
					dat += `<B><FONT COLOR='red'>**</FONT>Important Security Announcement<FONT COLOR='red'>**</FONT></B> <FONT SIZE=2>[page ${this.pages + 2}]</FONT><BR>`;
				}
				temp_page = 0;
				for (NP_3 of each(this.news_content, T("/datum/newscaster/feed_channel"))) {
					temp_page++;
					dat += `<B>${NP_3.channel_name}</B> <FONT SIZE=2>[page ${temp_page + 1}]</FONT><BR>`;
				}
				dat += "</ul>";
			}
			if (this.scribble_page == this.curr_page) {
				dat += `<BR><I>There is a small scribble near the end of this page... It reads: "${this.scribble}"</I>`;
			}
			dat += fmt("<HR><DIV STYLE='float:right;'><A href='?src=＃;next_page=1'>Next Page</A></DIV> <div style='float:left;'><A href='?src=＃;mach_close=newspaper_main'>Done reading</A></DIV>", [this, human_user]);
		} else if (this.screen === 1) {
			NP = null;
			for (NP of each(this.news_content, T("/datum/newscaster/feed_channel"))) {
				this.pages++;
			}
			dat += `<FONT SIZE=4><B>${(C = rt.index(this.news_content, this.curr_page)).channel_name}</B></FONT><FONT SIZE=1> [created by: <FONT COLOR='maroon'>${C.returnAuthor(this.notContent(C.authorCensorTime))}</FONT>]</FONT><BR><BR>`;
			if (this.notContent(C.DclassCensorTime)) {
				dat += "This channel was deemed dangerous to the general welfare of the station and therefore marked with a <B><FONT COLOR='red'>D-Notice</B></FONT>. Its contents were not transferred to the newspaper at the time of printing.";
			} else if (isemptylist(C.messages)) {
				dat += "No Feed stories stem from this channel...";
			} else {
				i = 0;
				for (MESSAGE of each(C.messages, T("/datum/newscaster/feed_message"))) {
					if (MESSAGE.creationTime > this.creationTime) {
						if (i == 0) {
							dat += "No Feed stories stem from this channel...";
						}
						break;
					}
					if (i == 0) {
						dat += "<ul>";
					}
					i++;
					dat += `-${MESSAGE.returnBody(this.notContent(MESSAGE.bodyCensorTime))} <BR>`;
					if (MESSAGE.img) {
						rt.op(f, "BrowseResource", [], [user, MESSAGE.img, `tmp_photo${i}.png`], false);
						dat += `<img src='tmp_photo${i}.png' width = '180'><BR>`;
					}
					dat += `<FONT SIZE=1>[Story by <FONT COLOR='maroon'>${MESSAGE.returnAuthor(this.notContent(MESSAGE.authorCensorTime))}</FONT>]</FONT><BR><BR>`;
				}
				dat += "</ul>";
			}
			if (this.scribble_page == this.curr_page) {
				dat += `<BR><I>There is a small scribble near the end of this page... It reads: "${this.scribble}"</I>`;
			}
			dat += fmt("<BR><HR><DIV STYLE='float:left;'><A href='?src=＃;prev_page=1'>Previous Page</A></DIV> <DIV STYLE='float:right;'><A href='?src=＃;next_page=1'>Next Page</A></DIV>", [this, this]);
		} else if (this.screen === 2) {
			NP = null;
			for (NP of each(this.news_content, T("/datum/newscaster/feed_channel"))) {
				this.pages++;
			}
			if (this.wantedAuthor !== null) {
				dat += "<DIV STYLE='float:center;'><FONT SIZE=4><B>Wanted Issue:</B></FONT SIZE></DIV><BR><BR>";
				dat += `<B>Criminal name</B>: <FONT COLOR='maroon'>${this.wantedCriminal}</FONT><BR>`;
				dat += `<B>Description</B>: ${this.wantedBody}<BR>`;
				dat += "<B>Photo:</B>: ";
				if (this.wantedPhoto) {
					rt.op(f, "BrowseResource", [], [user, this.wantedPhoto, "tmp_photow.png"], false);
					dat += "<BR><img src='tmp_photow.png' width = '180'>";
				} else {
					dat += "None";
				}
			} else {
				dat += "<I>Apart from some uninteresting classified ads, there's nothing on this page...</I>";
			}
			if (this.scribble_page == this.curr_page) {
				dat += `<BR><I>There is a small scribble near the end of this page... It reads: "${this.scribble}"</I>`;
			}
			dat += fmt("<HR><DIV STYLE='float:left;'><A href='?src=＃;prev_page=1'>Previous Page</A></DIV>", [this]);
		}
		dat += `<BR><HR><div align='center'>${this.curr_page + 1}</div>`;
		rt.op(f, "Browse", [], [human_user, dat, "window=newspaper_main;size=300x400"], false);
		onclose(human_user, "newspaper_main");
	} else {
		to_chat(user, "The paper is full of unintelligible symbols!");
	}
	return f.dot;
});

// newscaster.dm:993
rt.def("/obj/item/weapon/newspaper/proc/notContent", function notContent(f: Frame, L: Value) {
	let num: Value = null;
	if (!rt.len(f, L)) {
		return 0;
	}
	let i: Value = rt.len(f, L);
	while (i > 0) {
		num = rt.op(f, "Abs", [], [rt.index(L, i)]);
		if (!(this.creationTime <= num)) {
			if (rt.index(L, i) > 0) {
				return 1;
			} else {
				return 0;
			}
		}
		i--;
	}
	return 0;
});

// newscaster.dm:1007
rt.def("/obj/item/weapon/newspaper/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let U: Value = f.usr;
	yield* parent_proc();
	if (!(rt.isIn(f, this, U.contents) || isturf(this.loc) && get_dist(this, U) <= 1)) return f.dot;
	yield* U.set_machine(this);
	if (rt.at(href_list, "next_page")) {
		if (this.curr_page == this.pages + 1) {
			return f.dot;
		}
		if (this.curr_page == this.pages) {
			this.screen = 2;
		} else if (this.curr_page == 0) {
			this.screen = 1;
		}
		this.curr_page++;
		playsound(this.loc, "pageturn", 50, 1);
	} else if (rt.at(href_list, "prev_page")) {
		if (this.curr_page == 0) {
			return f.dot;
		}
		if (this.curr_page == 1) {
			this.screen = 0;
		} else if (this.curr_page == this.pages + 1) {
			this.screen = 1;
		}
		this.curr_page--;
		playsound(this.loc, "pageturn", 50, 1);
	}
	if (!ismob(this.loc)) return f.dot;
	yield* this.attack_self(this.loc);
	return f.dot;
}, true);

// newscaster.dm:1035
rt.def("/obj/item/weapon/newspaper/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let s: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/pen"))) {
		if (this.scribble_page == this.curr_page) {
			to_chat(user, "<span class='notice'>There's already a scribble in this page... You wouldn't want to make things too cluttered, would you?</span>");
		} else {
			if (!(s = (yield* stripped_input(user, "Write something", "Newspaper")))) {
				return f.dot;
			}
			if (!(get_dist(this, f.usr) <= 1) && this.loc != f.usr) {
				return f.dot;
			}
			this.scribble_page = this.curr_page;
			this.scribble = s;
			yield* this.attack_self(user);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
