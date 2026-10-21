// From code/modules/admin/admin.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/message_admins  (code/modules/admin/admin.dm:4)
rt.def("/proc/message_admins", function message_admins(f: Frame, msg: Value) {
	f.vars = () => [msg];
	msg = fmt("<span class=\"admin\"><span class=\"prefix\">ADMIN LOG:</span> <span class=\"message\">＀</span></span>", [live(msg)]);
	rt.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), live(msg)]);
	return f.dot;
});

// /datum/admins/proc/show_player_panel  (code/modules/admin/admin.dm:19)
rt.def("/datum/admins/proc/show_player_panel", function show_player_panel(f: Frame, M: Value) {
	let body: Value = null, muted: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [body, muted, $0, $1, $2];
	if (!truthy(rt.call(f, P("/proc/check_rights"), null, []))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.usr), T("/mob/dead/observer")) ? 1 : 0))) {
		rt.call(f, P("/proc/log_game"), null, [fmt("＀ checked the player panel while in game.", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])])]);
	}
	if (!truthy(live(M))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "You seem to be selecting a mob that doesn't exist anymore."]);
		return live(f.dot);
	}
	body = fmt("<html><head><title>Options for ＀</title></head>", [rt.fv(f, "key", live(M))]);
	body = rt.modify(live(body), fmt("<body>Options panel for <b>＀</b>", [live(M)]), add);
	if (truthy(rt.fv(f, "client", live(M)))) {
		body = rt.modify(live(body), fmt(" played by <b>＀</b> ", [rt.fv(f, "client", live(M))]), add);
		$0 = rt.fv(f, "ckey", live(M));
		if (truthy(rt.gv(f, "holder", rt.fv(f, "client", live(M))))) {
			$1 = rt.gv(f, "rank", rt.gv(f, "holder", rt.fv(f, "client", live(M))));
		} else {
			$1 = "Player";
		}
		body = rt.modify(live(body), fmt("[＀]", [$1]), add);
	}
	if (truthy((rt.istype(live(M), T("/mob/dead/new_player")) ? 1 : 0))) {
		body = rt.modify(live(body), " <B>Hasn't Entered Game</B> ", add);
	} else {
		body = rt.modify(live(body), fmt(" [<A href='?_src_=holder;revive=＃'>Heal</A>] ", [live(M)]), add);
	}
	if (truthy(rt.fv(f, "client", live(M)))) {
		body = rt.modify(live(body), fmt("<br>[<b>First Seen:</b> ＀][<b>Byond account registered on:</b> ＀]", [rt.gv(f, "player_join_date", rt.fv(f, "client", live(M))), rt.gv(f, "account_join_date", rt.fv(f, "client", live(M)))]), add);
		body = rt.modify(live(body), "<br><br><b>Show related accounts by:</b> ", add);
		body = rt.modify(live(body), fmt("[ <a href='?_src_=holder;showrelatedacc=cid;client=＃'>CID</a> | ", [rt.fv(f, "client", live(M))]), add);
		body = rt.modify(live(body), fmt("<a href='?_src_=holder;showrelatedacc=ip;client=＃'>IP</a> ]", [rt.fv(f, "client", live(M))]), add);
	}
	body = rt.modify(live(body), "<br><br>[ ", add);
	body = rt.modify(live(body), fmt("<a href='?_src_=vars;Vars=＃'>VV</a> - ", [live(M)]), add);
	body = rt.modify(live(body), fmt("<a href='?_src_=holder;traitor=＃'>TP</a> - ", [live(M)]), add);
	body = rt.modify(live(body), fmt("<a href='?priv_msg=＀'>PM</a> - ", [rt.fv(f, "ckey", live(M))]), add);
	body = rt.modify(live(body), fmt("<a href='?_src_=holder;subtlemessage=＃'>SM</a> - ", [live(M)]), add);
	body = rt.modify(live(body), fmt("<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a> - ", [live(M)]), add);
	body = rt.modify(live(body), fmt("<a href='?_src_=holder;individuallog=＃'>LOGS</a>] <br>", [live(M)]), add);
	body = rt.modify(live(body), fmt("<b>Mob type</b> = ＀<br><br>", [rt.fv(f, "type", live(M))]), add);
	body = rt.modify(live(body), fmt("<A href='?_src_=holder;boot2=＃'>Kick</A> | ", [live(M)]), add);
	body = rt.modify(live(body), fmt("<A href='?_src_=holder;newban=＃'>Ban</A> | ", [live(M)]), add);
	if (truthy(rt.fv(f, "client", live(M)))) {
		body = rt.modify(live(body), fmt("| <A href='?_src_=holder;sendtoprison=＃'>Prison</A> | ", [live(M)]), add);
		body = rt.modify(live(body), fmt(" <A href='?_src_=holder;sendbacktolobby=＃'>Send back to Lobby</A> | ", [live(M)]), add);
		muted = rt.gv(f, "muted", rt.gv(f, "prefs", rt.fv(f, "client", live(M))));
		body = rt.modify(live(body), "<br><b>Mute: </b> ", add);
		$0 = rt.fv(f, "ckey", live(M));
		$1 = 1;
		if (truthy(rt.bitAnd(live(muted), 1))) {
			$2 = "red";
		} else {
			$2 = "blue";
		}
		body = rt.modify(live(body), fmt("[<A href='?_src_=holder;mute=＀;mute_type=＀'><font color='＀'>IC</font></a> | ", [$0, $1, $2]), add);
		$0 = rt.fv(f, "ckey", live(M));
		$1 = 2;
		if (truthy(rt.bitAnd(live(muted), 2))) {
			$2 = "red";
		} else {
			$2 = "blue";
		}
		body = rt.modify(live(body), fmt("<A href='?_src_=holder;mute=＀;mute_type=＀'><font color='＀'>OOC</font></a> | ", [$0, $1, $2]), add);
		$0 = rt.fv(f, "ckey", live(M));
		$1 = 4;
		if (truthy(rt.bitAnd(live(muted), 4))) {
			$2 = "red";
		} else {
			$2 = "blue";
		}
		body = rt.modify(live(body), fmt("<A href='?_src_=holder;mute=＀;mute_type=＀'><font color='＀'>PRAY</font></a> | ", [$0, $1, $2]), add);
		$0 = rt.fv(f, "ckey", live(M));
		$1 = 8;
		if (truthy(rt.bitAnd(live(muted), 8))) {
			$2 = "red";
		} else {
			$2 = "blue";
		}
		body = rt.modify(live(body), fmt("<A href='?_src_=holder;mute=＀;mute_type=＀'><font color='＀'>ADMINHELP</font></a> | ", [$0, $1, $2]), add);
		$0 = rt.fv(f, "ckey", live(M));
		$1 = 16;
		if (truthy(rt.bitAnd(live(muted), 16))) {
			$2 = "red";
		} else {
			$2 = "blue";
		}
		body = rt.modify(live(body), fmt("<A href='?_src_=holder;mute=＀;mute_type=＀'><font color='＀'>DEADCHAT</font></a>]", [$0, $1, $2]), add);
		$0 = rt.fv(f, "ckey", live(M));
		$1 = 31;
		if (truthy(rt.bitAnd(live(muted), 31))) {
			$2 = "red";
		} else {
			$2 = "blue";
		}
		body = rt.modify(live(body), fmt("(<A href='?_src_=holder;mute=＀;mute_type=＀'><font color='＀'>toggle all</font></a>)", [$0, $1, $2]), add);
	}
	body = rt.modify(live(body), "<br><br>", add);
	body = rt.modify(live(body), fmt("<A href='?_src_=holder;jumpto=＃'><b>Jump to</b></A> | ", [live(M)]), add);
	body = rt.modify(live(body), fmt("<A href='?_src_=holder;getmob=＃'>Get</A> | ", [live(M)]), add);
	body = rt.modify(live(body), fmt("<A href='?_src_=holder;sendmob=＃'>Send To</A>", [live(M)]), add);
	body = rt.modify(live(body), "<br><br>", add);
	body = rt.modify(live(body), fmt("<A href='?_src_=holder;traitor=＃'>Traitor panel</A> | ", [live(M)]), add);
	body = rt.modify(live(body), fmt("<A href='?_src_=holder;narrateto=＃'>Narrate to</A> | ", [live(M)]), add);
	body = rt.modify(live(body), fmt("<A href='?_src_=holder;subtlemessage=＃'>Subtle message</A> | ", [live(M)]), add);
	body = rt.modify(live(body), fmt("<A href='?_src_=holder;languagemenu=＃'>Language Menu</A>", [live(M)]), add);
	if (truthy(rt.fv(f, "client", live(M)))) {
		if (!truthy((rt.istype(live(M), T("/mob/dead/new_player")) ? 1 : 0))) {
			body = rt.modify(live(body), "<br><br>", add);
			body = rt.modify(live(body), "<b>Transformation:</b>", add);
			body = rt.modify(live(body), "<br>", add);
			if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
				body = rt.modify(live(body), "<B>Human</B> | ", add);
			} else {
				body = rt.modify(live(body), fmt("<A href='?_src_=holder;humanone=＃'>Humanize</A> | ", [live(M)]), add);
			}
			if (truthy((rt.istype(live(M), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
				body = rt.modify(live(body), "<B>Monkeyized</B> | ", add);
			} else {
				body = rt.modify(live(body), fmt("<A href='?_src_=holder;monkeyone=＃'>Monkeyize</A> | ", [live(M)]), add);
			}
			if (truthy((rt.istype(live(M), T("/mob/living/simple_animal/pet/dog/corgi")) ? 1 : 0))) {
				body = rt.modify(live(body), "<B>Corgized</B> | ", add);
			} else {
				body = rt.modify(live(body), fmt("<A href='?_src_=holder;corgione=＃'>Corgize</A> | ", [live(M)]), add);
			}
			if (truthy((rt.istype(live(M), T("/mob/living/silicon/ai")) ? 1 : 0))) {
				body = rt.modify(live(body), "<B>Is an AI</B> ", add);
			} else {
				if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
					body = rt.modify(live(body), fmt("<A href='?_src_=holder;makeai=＃'>Make AI</A> | ", [live(M)]), add);
					body = rt.modify(live(body), fmt("<A href='?_src_=holder;makerobot=＃'>Make Robot</A> | ", [live(M)]), add);
					body = rt.modify(live(body), fmt("<A href='?_src_=holder;makealien=＃'>Make Alien</A> | ", [live(M)]), add);
					body = rt.modify(live(body), fmt("<A href='?_src_=holder;makeslime=＃'>Make Slime</A> | ", [live(M)]), add);
					body = rt.modify(live(body), fmt("<A href='?_src_=holder;makeblob=＃'>Make Blob</A> | ", [live(M)]), add);
				}
			}
			if (truthy((rt.istype(live(M), T("/mob/living/simple_animal")) ? 1 : 0))) {
				body = rt.modify(live(body), fmt("<A href='?_src_=holder;makeanimal=＃'>Re-Animalize</A> | ", [live(M)]), add);
			} else {
				body = rt.modify(live(body), fmt("<A href='?_src_=holder;makeanimal=＃'>Animalize</A> | ", [live(M)]), add);
			}
			body = rt.modify(live(body), "<br><br>", add);
			body = rt.modify(live(body), "<b>Rudimentary transformation:</b><font size=2><br>These transformations only create a new mob type and copy stuff over. They do not take into account MMIs and similar mob-specific things. The buttons in 'Transformations' are preferred, when possible.</font><br>", add);
			body = rt.modify(live(body), fmt("<A href='?_src_=holder;simplemake=observer;mob=＃'>Observer</A> | ", [live(M)]), add);
			body = rt.modify(live(body), fmt("[ Alien: <A href='?_src_=holder;simplemake=drone;mob=＃'>Drone</A>, ", [live(M)]), add);
			body = rt.modify(live(body), fmt("<A href='?_src_=holder;simplemake=hunter;mob=＃'>Hunter</A>, ", [live(M)]), add);
			body = rt.modify(live(body), fmt("<A href='?_src_=holder;simplemake=sentinel;mob=＃'>Sentinel</A>, ", [live(M)]), add);
			body = rt.modify(live(body), fmt("<A href='?_src_=holder;simplemake=praetorian;mob=＃'>Praetorian</A>, ", [live(M)]), add);
			body = rt.modify(live(body), fmt("<A href='?_src_=holder;simplemake=queen;mob=＃'>Queen</A>, ", [live(M)]), add);
			body = rt.modify(live(body), fmt("<A href='?_src_=holder;simplemake=larva;mob=＃'>Larva</A> ] ", [live(M)]), add);
			body = rt.modify(live(body), fmt("<A href='?_src_=holder;simplemake=human;mob=＃'>Human</A> ", [live(M)]), add);
			body = rt.modify(live(body), fmt("[ slime: <A href='?_src_=holder;simplemake=slime;mob=＃'>Baby</A>, ", [live(M)]), add);
			body = rt.modify(live(body), fmt("<A href='?_src_=holder;simplemake=adultslime;mob=＃'>Adult</A> ] ", [live(M)]), add);
			body = rt.modify(live(body), fmt("<A href='?_src_=holder;simplemake=monkey;mob=＃'>Monkey</A> | ", [live(M)]), add);
			body = rt.modify(live(body), fmt("<A href='?_src_=holder;simplemake=robot;mob=＃'>Cyborg</A> | ", [live(M)]), add);
			body = rt.modify(live(body), fmt("<A href='?_src_=holder;simplemake=cat;mob=＃'>Cat</A> | ", [live(M)]), add);
			body = rt.modify(live(body), fmt("<A href='?_src_=holder;simplemake=runtime;mob=＃'>Runtime</A> | ", [live(M)]), add);
			body = rt.modify(live(body), fmt("<A href='?_src_=holder;simplemake=corgi;mob=＃'>Corgi</A> | ", [live(M)]), add);
			body = rt.modify(live(body), fmt("<A href='?_src_=holder;simplemake=ian;mob=＃'>Ian</A> | ", [live(M)]), add);
			body = rt.modify(live(body), fmt("<A href='?_src_=holder;simplemake=crab;mob=＃'>Crab</A> | ", [live(M)]), add);
			body = rt.modify(live(body), fmt("<A href='?_src_=holder;simplemake=coffee;mob=＃'>Coffee</A> | ", [live(M)]), add);
			body = rt.modify(live(body), fmt("[ Construct: <A href='?_src_=holder;simplemake=constructarmored;mob=＃'>Juggernaut</A> , ", [live(M)]), add);
			body = rt.modify(live(body), fmt("<A href='?_src_=holder;simplemake=constructbuilder;mob=＃'>Artificer</A> , ", [live(M)]), add);
			body = rt.modify(live(body), fmt("<A href='?_src_=holder;simplemake=constructwraith;mob=＃'>Wraith</A> ] ", [live(M)]), add);
			body = rt.modify(live(body), fmt("<A href='?_src_=holder;simplemake=shade;mob=＃'>Shade</A>", [live(M)]), add);
			body = rt.modify(live(body), "<br>", add);
		}
	}
	if (truthy(rt.fv(f, "client", live(M)))) {
		body = rt.modify(live(body), "<br><br>", add);
		body = rt.modify(live(body), "<b>Other actions:</b>", add);
		body = rt.modify(live(body), "<br>", add);
		body = rt.modify(live(body), fmt("<A href='?_src_=holder;forcespeech=＃'>Forcesay</A> | ", [live(M)]), add);
		body = rt.modify(live(body), fmt("<A href='?_src_=holder;tdome1=＃'>Thunderdome 1</A> | ", [live(M)]), add);
		body = rt.modify(live(body), fmt("<A href='?_src_=holder;tdome2=＃'>Thunderdome 2</A> | ", [live(M)]), add);
		body = rt.modify(live(body), fmt("<A href='?_src_=holder;tdomeadmin=＃'>Thunderdome Admin</A> | ", [live(M)]), add);
		body = rt.modify(live(body), fmt("<A href='?_src_=holder;tdomeobserve=＃'>Thunderdome Observer</A> | ", [live(M)]), add);
	}
	body = rt.modify(live(body), "<br>", add);
	body = rt.modify(live(body), "</body></html>", add);
	rt.op(f, "Browse", [], [live(f.usr), live(body), fmt("window=adminplayeropts-＃;size=550x515", [live(M)])], false);
	return f.dot;
}, false, { verb: { name: "Show Player Panel", category: "Admin", desc: "Edit player (respawn, ban, heal, etc)" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// /datum/admins/proc/access_news_network  (code/modules/admin/admin.dm:184)
rt.def("/datum/admins/proc/access_news_network", function access_news_network(f: Frame) {
	let dat: Value = null, wanted_already: Value = null, CHANNEL: Value = null, check: Value = null, FC: Value = null, i: Value = null, MESSAGE: Value = null, comment: Value = null, MESSAGE_1: Value = null, comment_2: Value = null, end_param: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $e: any;
	f.vars = () => [dat, wanted_already, CHANNEL, check, FC, i, MESSAGE, comment, MESSAGE_1, comment_2, end_param, $0, $1, $2, $3, $4, $5, $e];
	if (!truthy((rt.istype(live(f.src), T("/datum/admins")) ? 1 : 0))) {
		f.src = rt.gv(f, "holder", rt.fv(f, "client", live(f.usr)));
	}
	if (!truthy((rt.istype(live(f.src), T("/datum/admins")) ? 1 : 0))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "Error: you are not an admin!"]);
		return live(f.dot);
	}
	dat = null;
	dat = "<HEAD><TITLE>Admin Newscaster</TITLE></HEAD><H3>Admin Newscaster Unit</H3>";
	$0 = rt.sv(f, "admincaster_screen");
	if ($0 === 0) {
		dat = rt.modify(live(dat), "Welcome to the admin newscaster.<BR> Here you can add, edit and censor every newspiece on the network.", add);
		dat = rt.modify(live(dat), "<BR>Feed channels and stories entered through here will be uneditable and handled as official news by the rest of the units.", add);
		dat = rt.modify(live(dat), "<BR>Note that this panel allows full freedom over the news network, there are no constrictions except the few basic ones. Don't break things!</FONT>", add);
		if (truthy(rt.gv(f, "active", rt.fv(f, "wanted_issue", rt.gl("news_network"))))) {
			dat = rt.modify(live(dat), fmt("<HR><A href='?src=＃;ac_view_wanted=1'>Read Wanted Issue</A>", [live(f.src)]), add);
		}
		dat = rt.modify(live(dat), fmt("<HR><BR><A href='?src=＃;ac_create_channel=1'>Create Feed Channel</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_view=1'>View Feed Channels</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_create_feed_story=1'>Submit new Feed story</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<BR><BR><A href='?src=＃;mach_close=newscaster_main'>Exit</A>", [live(f.usr)]), add);
		wanted_already = 0;
		if (truthy(rt.gv(f, "active", rt.fv(f, "wanted_issue", rt.gl("news_network"))))) {
			wanted_already = 1;
		}
		dat = rt.modify(live(dat), "<HR><B>Feed Security functions:</B><BR>", add);
		$0 = live(f.src);
		if (truthy(live(wanted_already))) {
			$1 = "Manage";
		} else {
			$1 = "Publish";
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_menu_wanted=1'>＀ \"Wanted\" Issue</A>", [$0, $1]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_menu_censor_story=1'>Censor Feed Stories</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_menu_censor_channel=1'>Mark Feed Channel with Nanotrasen D-Notice (disables and locks the channel).</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<BR><HR><A href='?src=＃;ac_set_signature=1'>The newscaster recognises you as:<BR> <FONT COLOR='green'>＀</FONT></A>", [live(f.src), rt.fv(f, "admin_signature", live(f.src))]), add);
	} else if ($0 === 1) {
		dat = rt.modify(live(dat), "Station Feed Channels<HR>", add);
		if (truthy(rt.call(f, P("/proc/isemptylist"), null, [rt.fv(f, "network_channels", rt.gl("news_network"))]))) {
			dat = rt.modify(live(dat), "<I>No active channels found...</I>", add);
		} else {
			CHANNEL = null;
			rt.forList(f, 0, rt.fv(f, "network_channels", rt.gl("news_network")), T("/datum/newscaster/feed_channel"));
			while (($e = rt.next(f, 0)) !== undefined) {
				CHANNEL = $e;
				if (truthy(rt.fv(f, "is_admin_channel", live(CHANNEL)))) {
					dat = rt.modify(live(dat), fmt("<B><FONT style='BACKGROUND-COLOR: LightGreen'><A href='?src=＃;ac_show_channel=＃'>＀</A></FONT></B><BR>", [live(f.src), live(CHANNEL), rt.fv(f, "channel_name", live(CHANNEL))]), add);
				} else {
					$0 = live(f.src);
					$1 = live(CHANNEL);
					$2 = rt.fv(f, "channel_name", live(CHANNEL));
					if (truthy(rt.fv(f, "censored", live(CHANNEL)))) {
						$3 = "<FONT COLOR='red'>***</FONT>";
					} else {
						$3 = null;
					}
					dat = rt.modify(live(dat), fmt("<B><A href='?src=＃;ac_show_channel=＃'>＀</A> ＀<BR></B>", [$0, $1, $2, $3]), add);
				}
			}
			rt.endFor(f, 0);
		}
		dat = rt.modify(live(dat), fmt("<BR><HR><A href='?src=＃;ac_refresh=1'>Refresh</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Back</A>", [live(f.src), 0]), add);
	} else if ($0 === 2) {
		dat = rt.modify(live(dat), "Creating new Feed Channel...", add);
		dat = rt.modify(live(dat), fmt("<HR><B><A href='?src=＃;ac_set_channel_name=1'>Channel Name</A>:</B> ＀<BR>", [live(f.src), rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src)))]), add);
		dat = rt.modify(live(dat), fmt("<B><A href='?src=＃;ac_set_signature=1'>Channel Author</A>:</B> <FONT COLOR='green'>＀</FONT><BR>", [live(f.src), rt.fv(f, "admin_signature", live(f.src))]), add);
		$0 = live(f.src);
		if (truthy(rt.gv(f, "locked", rt.fv(f, "admincaster_feed_channel", live(f.src))))) {
			$1 = "NO";
		} else {
			$1 = "YES";
		}
		dat = rt.modify(live(dat), fmt("<B><A href='?src=＃;ac_set_channel_lock=1'>Will Accept Public Feeds</A>:</B> ＀<BR><BR>", [$0, $1]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_submit_new_channel=1'>Submit</A><BR><BR><A href='?src=＃;ac_setScreen=＀'>Cancel</A><BR>", [live(f.src), live(f.src), 0]), add);
	} else if ($0 === 3) {
		dat = rt.modify(live(dat), "Creating new Feed Message...", add);
		dat = rt.modify(live(dat), fmt("<HR><B><A href='?src=＃;ac_set_channel_receiving=1'>Receiving Channel</A>:</B> ＀<BR>", [live(f.src), rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src)))]), add);
		dat = rt.modify(live(dat), fmt("<B>Message Author:</B> <FONT COLOR='green'>＀</FONT><BR>", [rt.fv(f, "admin_signature", live(f.src))]), add);
		dat = rt.modify(live(dat), fmt("<B><A href='?src=＃;ac_set_new_message=1'>Message Body</A>:</B> ＀ <BR>", [live(f.src), rt.callName(f, rt.fv(f, "admincaster_feed_message", live(f.src)), "returnBody", [-1])]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_submit_new_message=1'>Submit</A><BR><BR><A href='?src=＃;ac_setScreen=＀'>Cancel</A><BR>", [live(f.src), live(f.src), 0]), add);
	} else if ($0 === 4) {
		dat = rt.modify(live(dat), fmt("Feed story successfully submitted to ＀.<BR><BR>", [rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src)))]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Return</A><BR>", [live(f.src), 0]), add);
	} else if ($0 === 5) {
		dat = rt.modify(live(dat), fmt("Feed Channel ＀ created successfully.<BR><BR>", [rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src)))]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Return</A><BR>", [live(f.src), 0]), add);
	} else if ($0 === 6) {
		dat = rt.modify(live(dat), "<B><FONT COLOR='maroon'>ERROR: Could not submit Feed story to Network.</B></FONT><HR><BR>", add);
		if (isEqual(rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src))), "")) {
			dat = rt.modify(live(dat), "<FONT COLOR='maroon'>Invalid receiving channel name.</FONT><BR>", add);
		}
		if ((isEqual(rt.callName(f, rt.fv(f, "admincaster_feed_message", live(f.src)), "returnBody", [-1]), "") || isEqual(rt.callName(f, rt.fv(f, "admincaster_feed_message", live(f.src)), "returnBody", [-1]), "[REDACTED]"))) {
			dat = rt.modify(live(dat), "<FONT COLOR='maroon'>Invalid message body.</FONT><BR>", add);
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Return</A><BR>", [live(f.src), 3]), add);
	} else if ($0 === 7) {
		dat = rt.modify(live(dat), "<B><FONT COLOR='maroon'>ERROR: Could not submit Feed Channel to Network.</B></FONT><HR><BR>", add);
		if ((isEqual(rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src))), "") || isEqual(rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src))), "[REDACTED]"))) {
			dat = rt.modify(live(dat), "<FONT COLOR='maroon'>Invalid channel name.</FONT><BR>", add);
		}
		check = 0;
		FC = null;
		rt.forList(f, 0, rt.fv(f, "network_channels", rt.gl("news_network")), T("/datum/newscaster/feed_channel"));
		while (($e = rt.next(f, 0)) !== undefined) {
			FC = $e;
			if (isEqual(rt.fv(f, "channel_name", live(FC)), rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src))))) {
				check = 1;
				break;
			}
		}
		rt.endFor(f, 0);
		if (truthy(live(check))) {
			dat = rt.modify(live(dat), "<FONT COLOR='maroon'>Channel name already in use.</FONT><BR>", add);
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Return</A><BR>", [live(f.src), 2]), add);
	} else if ($0 === 9) {
		dat = rt.modify(live(dat), fmt("<B>＀: </B><FONT SIZE=1>[created by: <FONT COLOR='maroon'>＀</FONT>]</FONT><HR>", [rt.fv(f, "channel_name", rt.sv(f, "admincaster_feed_channel")), rt.callName(f, rt.sv(f, "admincaster_feed_channel"), "returnAuthor", [-1])]), add);
		if (truthy(rt.gv(f, "censored", rt.fv(f, "admincaster_feed_channel", live(f.src))))) {
			dat = rt.modify(live(dat), "<FONT COLOR='red'><B>ATTENTION: </B></FONT>This channel has been deemed as threatening to the welfare of the station, and marked with a Nanotrasen D-Notice.<BR>", add);
			dat = rt.modify(live(dat), "No further feed story additions are allowed while the D-Notice is in effect.</FONT><BR><BR>", add);
		} else {
			if (truthy(rt.call(f, P("/proc/isemptylist"), null, [rt.gv(f, "messages", rt.fv(f, "admincaster_feed_channel", live(f.src)))]))) {
				dat = rt.modify(live(dat), "<I>No feed messages found in channel...</I><BR>", add);
			} else {
				i = 0;
				MESSAGE = null;
				rt.forList(f, 0, rt.gv(f, "messages", rt.fv(f, "admincaster_feed_channel", live(f.src))), T("/datum/newscaster/feed_message"));
				while (($e = rt.next(f, 0)) !== undefined) {
					MESSAGE = $e;
					i = rt.inc(live(i), 1);
					dat = rt.modify(live(dat), fmt("-＀ <BR>", [rt.callName(f, live(MESSAGE), "returnBody", [-1])]), add);
					if (truthy(rt.fv(f, "img", live(MESSAGE)))) {
						rt.op(f, "BrowseResource", [], [live(f.usr), rt.fv(f, "img", live(MESSAGE)), fmt("tmp_photo＀.png", [live(i)])], false);
						dat = rt.modify(live(dat), fmt("<img src='tmp_photo＀.png' width = '180'><BR><BR>", [live(i)]), add);
					}
					dat = rt.modify(live(dat), fmt("<FONT SIZE=1>[Story by <FONT COLOR='maroon'>＀</FONT>]</FONT><BR>", [rt.callName(f, live(MESSAGE), "returnAuthor", [-1])]), add);
					$0 = rt.getLen(f, rt.fv(f, "comments", live(MESSAGE)));
					if (rt.gt(rt.getLen(f, rt.fv(f, "comments", live(MESSAGE))), 1)) {
						$1 = "s";
					} else {
						$1 = "";
					}
					dat = rt.modify(live(dat), fmt("＀ comment＀:<br>", [$0, $1]), add);
					comment = null;
					rt.forList(f, 1, rt.fv(f, "comments", live(MESSAGE)), T("/datum/newscaster/feed_comment"));
					while (($e = rt.next(f, 1)) !== undefined) {
						comment = $e;
						dat = rt.modify(live(dat), fmt("＀<br><font size=1>＀ ＀</font><br>", [rt.fv(f, "body", live(comment)), rt.fv(f, "author", live(comment)), rt.fv(f, "time_stamp", live(comment))]), add);
					}
					rt.endFor(f, 1);
					dat = rt.modify(live(dat), "<br>", add);
				}
				rt.endFor(f, 0);
			}
		}
		dat = rt.modify(live(dat), fmt("<BR><HR><A href='?src=＃;ac_refresh=1'>Refresh</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Back</A>", [live(f.src), 1]), add);
	} else if ($0 === 10) {
		dat = rt.modify(live(dat), "<B>Nanotrasen Feed Censorship Tool</B><BR>", add);
		dat = rt.modify(live(dat), "<FONT SIZE=1>NOTE: Due to the nature of news Feeds, total deletion of a Feed Story is not possible.<BR>", add);
		dat = rt.modify(live(dat), "Keep in mind that users attempting to view a censored feed will instead see the [REDACTED] tag above it.</FONT>", add);
		dat = rt.modify(live(dat), "<HR>Select Feed channel to get Stories from:<BR>", add);
		if (truthy(rt.call(f, P("/proc/isemptylist"), null, [rt.fv(f, "network_channels", rt.gl("news_network"))]))) {
			dat = rt.modify(live(dat), "<I>No feed channels found active...</I><BR>", add);
		} else {
			CHANNEL = null;
			rt.forList(f, 0, rt.fv(f, "network_channels", rt.gl("news_network")), T("/datum/newscaster/feed_channel"));
			while (($e = rt.next(f, 0)) !== undefined) {
				CHANNEL = $e;
				$0 = live(f.src);
				$1 = live(CHANNEL);
				$2 = rt.fv(f, "channel_name", live(CHANNEL));
				if (truthy(rt.fv(f, "censored", live(CHANNEL)))) {
					$3 = "<FONT COLOR='red'>***</FONT>";
				} else {
					$3 = null;
				}
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;ac_pick_censor_channel=＃'>＀</A> ＀<BR>", [$0, $1, $2, $3]), add);
			}
			rt.endFor(f, 0);
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Cancel</A>", [live(f.src), 0]), add);
	} else if ($0 === 11) {
		dat = rt.modify(live(dat), "<B>Nanotrasen D-Notice Handler</B><HR>", add);
		dat = rt.modify(live(dat), "<FONT SIZE=1>A D-Notice is to be bestowed upon the channel if the handling Authority deems it as harmful for the station's", add);
		dat = rt.modify(live(dat), "morale, integrity or disciplinary behaviour. A D-Notice will render a channel unable to be updated by anyone, without deleting any feed", add);
		dat = rt.modify(live(dat), "stories it might contain at the time. You can lift a D-Notice if you have the required access at any time.</FONT><HR>", add);
		if (truthy(rt.call(f, P("/proc/isemptylist"), null, [rt.fv(f, "network_channels", rt.gl("news_network"))]))) {
			dat = rt.modify(live(dat), "<I>No feed channels found active...</I><BR>", add);
		} else {
			CHANNEL = null;
			rt.forList(f, 0, rt.fv(f, "network_channels", rt.gl("news_network")), T("/datum/newscaster/feed_channel"));
			while (($e = rt.next(f, 0)) !== undefined) {
				CHANNEL = $e;
				$0 = live(f.src);
				$1 = live(CHANNEL);
				$2 = rt.fv(f, "channel_name", live(CHANNEL));
				if (truthy(rt.fv(f, "censored", live(CHANNEL)))) {
					$3 = "<FONT COLOR='red'>***</FONT>";
				} else {
					$3 = null;
				}
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;ac_pick_d_notice=＃'>＀</A> ＀<BR>", [$0, $1, $2, $3]), add);
			}
			rt.endFor(f, 0);
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Back</A>", [live(f.src), 0]), add);
	} else if ($0 === 12) {
		dat = rt.modify(live(dat), fmt("<B>＀: </B><FONT SIZE=1>[ created by: <FONT COLOR='maroon'>＀</FONT> ]</FONT><BR>", [rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src))), rt.callName(f, rt.fv(f, "admincaster_feed_channel", live(f.src)), "returnAuthor", [-1])]), add);
		$0 = live(f.src);
		$1 = rt.fv(f, "admincaster_feed_channel", live(f.src));
		if (truthy(rt.gv(f, "authorCensor", rt.fv(f, "admincaster_feed_channel", live(f.src))))) {
			$2 = "Undo Author censorship";
		} else {
			$2 = "Censor channel Author";
		}
		dat = rt.modify(live(dat), fmt("<FONT SIZE=2><A href='?src=＃;ac_censor_channel_author=＃'>＀</A></FONT><HR>", [$0, $1, $2]), add);
		if (truthy(rt.call(f, P("/proc/isemptylist"), null, [rt.gv(f, "messages", rt.fv(f, "admincaster_feed_channel", live(f.src)))]))) {
			dat = rt.modify(live(dat), "<I>No feed messages found in channel...</I><BR>", add);
		} else {
			MESSAGE_1 = null;
			rt.forList(f, 0, rt.gv(f, "messages", rt.fv(f, "admincaster_feed_channel", live(f.src))), T("/datum/newscaster/feed_message"));
			while (($e = rt.next(f, 0)) !== undefined) {
				MESSAGE_1 = $e;
				dat = rt.modify(live(dat), fmt("-＀ <BR><FONT SIZE=1>[Story by <FONT COLOR='maroon'>＀</FONT>]</FONT><BR>", [rt.callName(f, live(MESSAGE_1), "returnBody", [-1]), rt.callName(f, live(MESSAGE_1), "returnAuthor", [-1])]), add);
				$0 = live(f.src);
				$1 = live(MESSAGE_1);
				if (truthy(rt.fv(f, "bodyCensor", live(MESSAGE_1)))) {
					$2 = "Undo story censorship";
				} else {
					$2 = "Censor story";
				}
				$3 = live(f.src);
				$4 = live(MESSAGE_1);
				if (truthy(rt.fv(f, "authorCensor", live(MESSAGE_1)))) {
					$5 = "Undo Author Censorship";
				} else {
					$5 = "Censor message Author";
				}
				dat = rt.modify(live(dat), fmt("<FONT SIZE=2><A href='?src=＃;ac_censor_channel_story_body=＃'>＀</A>  -  <A href='?src=＃;ac_censor_channel_story_author=＃'>＀</A></FONT><BR>", [$0, $1, $2, $3, $4, $5]), add);
				$0 = rt.getLen(f, rt.fv(f, "comments", live(MESSAGE_1)));
				if (rt.gt(rt.getLen(f, rt.fv(f, "comments", live(MESSAGE_1))), 1)) {
					$1 = "s";
				} else {
					$1 = "";
				}
				$2 = live(f.src);
				$3 = live(MESSAGE_1);
				if (truthy(rt.fv(f, "locked", live(MESSAGE_1)))) {
					$4 = "Unlock";
				} else {
					$4 = "Lock";
				}
				dat = rt.modify(live(dat), fmt("＀ comment＀: <a href='?src=＃;ac_lock_comment=＃'>＀</a><br>", [$0, $1, $2, $3, $4]), add);
				comment_2 = null;
				rt.forList(f, 1, rt.fv(f, "comments", live(MESSAGE_1)), T("/datum/newscaster/feed_comment"));
				while (($e = rt.next(f, 1)) !== undefined) {
					comment_2 = $e;
					dat = rt.modify(live(dat), fmt("＀ <a href='?src=＃;ac_del_comment=＃;ac_del_comment_msg=＃'>X</a><br><font size=1>＀ ＀</font><br>", [rt.fv(f, "body", live(comment_2)), live(f.src), live(comment_2), live(MESSAGE_1), rt.fv(f, "author", live(comment_2)), rt.fv(f, "time_stamp", live(comment_2))]), add);
				}
				rt.endFor(f, 1);
			}
			rt.endFor(f, 0);
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Back</A>", [live(f.src), 10]), add);
	} else if ($0 === 13) {
		dat = rt.modify(live(dat), fmt("<B>＀: </B><FONT SIZE=1>[ created by: <FONT COLOR='maroon'>＀</FONT> ]</FONT><BR>", [rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src))), rt.callName(f, rt.fv(f, "admincaster_feed_channel", live(f.src)), "returnAuthor", [-1])]), add);
		dat = rt.modify(live(dat), fmt("Channel messages listed below. If you deem them dangerous to the station, you can <A href='?src=＃;ac_toggle_d_notice=＃'>Bestow a D-Notice upon the channel</A>.<HR>", [live(f.src), rt.fv(f, "admincaster_feed_channel", live(f.src))]), add);
		if (truthy(rt.gv(f, "censored", rt.fv(f, "admincaster_feed_channel", live(f.src))))) {
			dat = rt.modify(live(dat), "<FONT COLOR='red'><B>ATTENTION: </B></FONT>This channel has been deemed as threatening to the welfare of the station, and marked with a Nanotrasen D-Notice.<BR>", add);
			dat = rt.modify(live(dat), "No further feed story additions are allowed while the D-Notice is in effect.</FONT><BR><BR>", add);
		} else {
			if (truthy(rt.call(f, P("/proc/isemptylist"), null, [rt.gv(f, "messages", rt.fv(f, "admincaster_feed_channel", live(f.src)))]))) {
				dat = rt.modify(live(dat), "<I>No feed messages found in channel...</I><BR>", add);
			} else {
				MESSAGE_1 = null;
				rt.forList(f, 0, rt.gv(f, "messages", rt.fv(f, "admincaster_feed_channel", live(f.src))), T("/datum/newscaster/feed_message"));
				while (($e = rt.next(f, 0)) !== undefined) {
					MESSAGE_1 = $e;
					dat = rt.modify(live(dat), fmt("-＀ <BR><FONT SIZE=1>[Story by <FONT COLOR='maroon'>＀</FONT>]</FONT><BR>", [rt.callName(f, live(MESSAGE_1), "returnBody", [-1]), rt.callName(f, live(MESSAGE_1), "returnAuthor", [-1])]), add);
				}
				rt.endFor(f, 0);
			}
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Back</A>", [live(f.src), 11]), add);
	} else if ($0 === 14) {
		dat = rt.modify(live(dat), "<B>Wanted Issue Handler:</B>", add);
		wanted_already = 0;
		end_param = 1;
		if (truthy(rt.gv(f, "active", rt.fv(f, "wanted_issue", rt.gl("news_network"))))) {
			wanted_already = 1;
			end_param = 2;
		}
		if (truthy(live(wanted_already))) {
			dat = rt.modify(live(dat), "<FONT SIZE=2><BR><I>A wanted issue is already in Feed Circulation. You can edit or cancel it below.</FONT></I>", add);
		}
		dat = rt.modify(live(dat), "<HR>", add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;ac_set_wanted_name=1'>Criminal Name</A>: ＀ <BR>", [live(f.src), rt.gv(f, "criminal", rt.fv(f, "admincaster_wanted_message", live(f.src)))]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;ac_set_wanted_desc=1'>Description</A>: ＀ <BR>", [live(f.src), rt.gv(f, "body", rt.fv(f, "admincaster_wanted_message", live(f.src)))]), add);
		if (truthy(live(wanted_already))) {
			dat = rt.modify(live(dat), fmt("<B>Wanted Issue created by:</B><FONT COLOR='green'>＀</FONT><BR>", [rt.gv(f, "scannedUser", rt.fv(f, "wanted_issue", rt.gl("news_network")))]), add);
		} else {
			dat = rt.modify(live(dat), fmt("<B>Wanted Issue will be created under prosecutor:</B><FONT COLOR='green'>＀</FONT><BR>", [rt.fv(f, "admin_signature", live(f.src))]), add);
		}
		$0 = live(f.src);
		$1 = live(end_param);
		if (truthy(live(wanted_already))) {
			$1 = $1;
			$2 = "Edit Issue";
		} else {
			$2 = "Submit";
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_submit_wanted=＀'>＀</A>", [$0, $1, $2]), add);
		if (truthy(live(wanted_already))) {
			dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_cancel_wanted=1'>Take down Issue</A>", [live(f.src)]), add);
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Cancel</A>", [live(f.src), 0]), add);
	} else if ($0 === 15) {
		dat = rt.modify(live(dat), fmt("<FONT COLOR='green'>Wanted issue for ＀ is now in Network Circulation.</FONT><BR><BR>", [rt.gv(f, "criminal", rt.fv(f, "admincaster_wanted_message", live(f.src)))]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Return</A><BR>", [live(f.src), 0]), add);
	} else if ($0 === 16) {
		dat = rt.modify(live(dat), "<B><FONT COLOR='maroon'>ERROR: Wanted Issue rejected by Network.</B></FONT><HR><BR>", add);
		if ((isEqual(rt.gv(f, "criminal", rt.fv(f, "admincaster_wanted_message", live(f.src))), "") || isEqual(rt.gv(f, "criminal", rt.fv(f, "admincaster_wanted_message", live(f.src))), "[REDACTED]"))) {
			dat = rt.modify(live(dat), "<FONT COLOR='maroon'>Invalid name for person wanted.</FONT><BR>", add);
		}
		if ((isEqual(rt.gv(f, "body", rt.fv(f, "admincaster_wanted_message", live(f.src))), "") || isEqual(rt.gv(f, "body", rt.fv(f, "admincaster_wanted_message", live(f.src))), "[REDACTED]"))) {
			dat = rt.modify(live(dat), "<FONT COLOR='maroon'>Invalid description.</FONT><BR>", add);
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Return</A><BR>", [live(f.src), 0]), add);
	} else if ($0 === 17) {
		dat = rt.modify(live(dat), "<B>Wanted Issue successfully deleted from Circulation</B><BR>", add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Return</A><BR>", [live(f.src), 0]), add);
	} else if ($0 === 18) {
		dat = rt.modify(live(dat), fmt("<B><FONT COLOR ='maroon'>-- STATIONWIDE WANTED ISSUE --</B></FONT><BR><FONT SIZE=2>[Submitted by: <FONT COLOR='green'>＀</FONT>]</FONT><HR>", [rt.gv(f, "scannedUser", rt.fv(f, "wanted_issue", rt.gl("news_network")))]), add);
		dat = rt.modify(live(dat), fmt("<B>Criminal</B>: ＀<BR>", [rt.gv(f, "criminal", rt.fv(f, "wanted_issue", rt.gl("news_network")))]), add);
		dat = rt.modify(live(dat), fmt("<B>Description</B>: ＀<BR>", [rt.gv(f, "body", rt.fv(f, "wanted_issue", rt.gl("news_network")))]), add);
		dat = rt.modify(live(dat), "<B>Photo:</B>: ", add);
		if (truthy(rt.gv(f, "img", rt.fv(f, "wanted_issue", rt.gl("news_network"))))) {
			rt.op(f, "BrowseResource", [], [live(f.usr), rt.gv(f, "img", rt.fv(f, "wanted_issue", rt.gl("news_network"))), "tmp_photow.png"], false);
			dat = rt.modify(live(dat), "<BR><img src='tmp_photow.png' width = '180'>", add);
		} else {
			dat = rt.modify(live(dat), "None", add);
		}
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Back</A><BR>", [live(f.src), 0]), add);
	} else if ($0 === 19) {
		dat = rt.modify(live(dat), fmt("<FONT COLOR='green'>Wanted issue for ＀ successfully edited.</FONT><BR><BR>", [rt.gv(f, "criminal", rt.fv(f, "admincaster_wanted_message", live(f.src)))]), add);
		dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Return</A><BR>", [live(f.src), 0]), add);
	} else {
		dat = rt.modify(live(dat), "I'm sorry to break your immersion. This shit's bugged. Please report it.", add);
	}
	rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=admincaster_main;size=400x600"], false);
	rt.call(f, P("/proc/onclose"), null, [live(f.usr), "admincaster_main"]);
	return f.dot;
}, false, { verb: { name: "Access Newscaster Network", category: "Fun", desc: "Allows you to view, add and edit news feeds." } });

// /datum/admins/proc/Game  (code/modules/admin/admin.dm:390)
rt.def("/datum/admins/proc/Game", function Game(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	if (!truthy(rt.call(f, P("/proc/check_rights"), null, [0]))) {
		return live(f.dot);
	}
	dat = fmt("\n\t\t<center><B>Game Panel</B></center><hr>\n\n\t\t<A href='?src=＃;c_mode=1'>Change Game Mode</A><br>\n\t\t", [live(f.src)]);
	if (isEqual(rt.gl("master_mode"), "secret")) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;f_secret=1'>(Force Secret Mode)</A><br>", [live(f.src)]), add);
	}
	dat = rt.modify(live(dat), fmt("\n\t\t<BR>\n\t\t<A href='?src=＃;create_object=1'>Create Object</A><br>\n\t\t<A href='?src=＃;quick_create_object=1'>Quick Create Object</A><br>\n\t\t<A href='?src=＃;create_turf=1'>Create Turf</A><br>\n\t\t<A href='?src=＃;create_mob=1'>Create Mob</A><br>\n\t\t", [live(f.src), live(f.src), live(f.src), live(f.src)]), add);
	if ((truthy(rt.sv(f, "marked_datum")) && truthy((rt.istype(rt.sv(f, "marked_datum"), T("/atom")) ? 1 : 0)))) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;dupe_marked_datum=1'>Duplicate Marked Datum</A><br>", [live(f.src)]), add);
	}
	rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=admin2;size=210x200"], false);
	return live(f.dot);
});

// /datum/admins/proc/restart  (code/modules/admin/admin.dm:422)  may sleep
rt.def("/datum/admins/proc/restart", function* restart(f: Frame) {
	let options: Value = null, result: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [options, result, $0, $1, $2, $3];
	if (!truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr))))) {
		return live(f.dot);
	}
	options = rt.list("Regular Restart", "Hard Restart (No Delay/Feeback Reason)", "Hardest Restart (No actions, just reboot)");
	if (!truthy((result = (yield* g.op(f, "Prompt", [1], [rt.index(live(options), 1), "World Reboot", "Select reboot method", live(f.usr), live(options)]))))) return f.dot;
	$0 = live(result);
	if ($0 === "Regular Restart") {
		$0 = rt.gl("SSticker");
		if (truthy(rt.gv(f, "fakekey", rt.gv(f, "holder", rt.fv(f, "client", live(f.usr)))))) {
			$1 = "Admin";
		} else {
			$1 = rt.fv(f, "key", live(f.usr));
		}
		$1 = fmt("Initiated by ＀.", [$1]);
		$2 = rt.fv(f, "key", live(f.usr));
		if (truthy(rt.gv(f, "fakekey", rt.gv(f, "holder", rt.fv(f, "client", live(f.usr)))))) {
			$3 = "(stealth)";
		} else {
			$3 = "";
		}
		yield* g.callName(f, $0, "Reboot", [$1, fmt("admin reboot - by ＀ ＀", [$2, $3]), 10]);
	} else if ($0 === "Hard Restart (No Delay, No Feeback Reason)") {
		yield* g.callName(f, rt.world(), "Reboot", []);
	} else if ($0 === "Hardest Restart (No actions, just reboot)") {
		yield* g.callName(f, rt.world(), "Reboot", ["fast_track", 1], rt.Args.Named);
	}
	return f.dot;
}, true, { verb: { name: "Reboot World", category: "Server", desc: "Restarts the world immediately" } });

// /datum/admins/proc/end_round  (code/modules/admin/admin.dm:447)  may sleep
rt.def("/datum/admins/proc/end_round", function* end_round(f: Frame) {
	let confirm: Value = null;
	f.vars = () => [confirm];
	if (!truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr))))) {
		return live(f.dot);
	}
	if (isEqual((confirm = (yield* g.call(f, P("/proc/alert"), null, ["End the round and  restart the game world?", "End Round", "Yes", "Cancel"]))), "Cancel")) {
		return live(f.dot);
	}
	if (!isEqual(live(confirm), "Yes")) return f.dot;
	rt.setFv(f, "force_ending", rt.gl("SSticker"), 1);
	return f.dot;
}, true, { verb: { name: "End Round", category: "Server", desc: "Attempts to produce a round end report and then restart the server organically." } });

// /datum/admins/proc/announce  (code/modules/admin/admin.dm:461)  may sleep
rt.def("/datum/admins/proc/announce", function* announce(f: Frame) {
	let message: Value = null;
	let $0: any, $1: any;
	f.vars = () => [message, $0, $1];
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
		return live(f.dot);
	}
	if (truthy((message = (yield* g.op(f, "Prompt", [64], [null, null, "Admin Announce", "Global message to send:", null]))))) {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [16, 0])))) {
			message = (yield* g.call(f, P("/proc/adminscrub"), null, [live(message), 500]));
		}
		$0 = rt.world();
		if (truthy(rt.gv(f, "fakekey", rt.gv(f, "holder", rt.fv(f, "client", live(f.usr)))))) {
			$1 = "Administrator";
		} else {
			$1 = rt.fv(f, "key", live(f.usr));
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='adminnotice'><b>＀ Announces:</b></span>\n \t ＀", [$1, live(message)])]);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("Announce: ＀ : ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(message)])]);
	}
	return f.dot;
}, true, { verb: { name: "Announce", category: "Special Verbs", desc: "Announce your desires to the world" } });

// /datum/admins/proc/set_admin_notice  (code/modules/admin/admin.dm:476)  may sleep
rt.def("/datum/admins/proc/set_admin_notice", function* set_admin_notice(f: Frame) {
	let new_admin_notice: Value = null;
	f.vars = () => [new_admin_notice];
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
		return live(f.dot);
	}
	if ((new_admin_notice = (yield* g.op(f, "Prompt", [65], [rt.gl("admin_notice"), "Set Notice", "Set a public notice for this round. Everyone who joins the server will see it.\n(Leaving it blank will delete the current notice):", live(f.src), null]))) === null) {
		return live(f.dot);
	}
	if (isEqual(live(new_admin_notice), rt.gl("admin_notice"))) {
		return live(f.dot);
	}
	if (isEqual(live(new_admin_notice), "")) {
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ removed the admin notice.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ removed the admin notice:\n＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.gl("admin_notice")])]);
	} else {
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ set the admin notice.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ set the admin notice:\n＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(new_admin_notice)])]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class ='adminnotice'><b>Admin Notice:</b>\n \t ＀</span>", [live(new_admin_notice)])]);
	}
	rt.setGl("admin_notice", live(new_admin_notice));
	return live(f.dot);
}, true, { verb: { name: "Set Admin Notice", category: "Special Verbs", desc: "Set an announcement that appears to everyone who joins the server. Only lasts this round" } });

// /datum/admins/proc/toggleooc  (code/modules/admin/admin.dm:499)
rt.def("/datum/admins/proc/toggleooc", function toggleooc(f: Frame) {
	rt.call(f, P("/proc/toggle_ooc"), null, []);
	rt.call(f, P("/proc/log_admin"), null, [fmt("＀ toggled OOC.", [rt.call(f, P("/proc/key_name"), null, [live(f.usr)])])]);
	rt.call(f, P("/proc/message_admins"), null, [fmt("＀ toggled OOC.", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])])]);
	return f.dot;
}, false, { verb: { name: "Toggle OOC", category: "Server", desc: "Toggle dis bitch" } });

// /datum/admins/proc/toggleoocdead  (code/modules/admin/admin.dm:508)
rt.def("/datum/admins/proc/toggleoocdead", function toggleoocdead(f: Frame) {
	rt.setGl("dooc_allowed", (!truthy(rt.gl("dooc_allowed")) ? 1 : 0));
	rt.call(f, P("/proc/log_admin"), null, [fmt("＀ toggled OOC.", [rt.call(f, P("/proc/key_name"), null, [live(f.usr)])])]);
	rt.call(f, P("/proc/message_admins"), null, [fmt("＀ toggled Dead OOC.", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])])]);
	return f.dot;
}, false, { verb: { name: "Toggle Dead OOC", category: "Server", desc: "Toggle dis bitch" } });

// /datum/admins/proc/startnow  (code/modules/admin/admin.dm:518)
rt.def("/datum/admins/proc/startnow", function startnow(f: Frame) {
	let msg: Value = null;
	f.vars = () => [msg];
	if ((isEqual(rt.fv(f, "current_state", rt.gl("SSticker")), 1) || isEqual(rt.fv(f, "current_state", rt.gl("SSticker")), 0))) {
		rt.setFv(f, "start_immediately", rt.gl("SSticker"), 1);
		rt.call(f, P("/proc/log_admin"), null, [fmt("＀ has started the game.", [rt.fv(f, "key", live(f.usr))])]);
		msg = "";
		if (isEqual(rt.fv(f, "current_state", rt.gl("SSticker")), 0)) {
			msg = " (The server is still setting up, but the round will be started as soon as possible.)";
		}
		rt.call(f, P("/proc/message_admins"), null, [fmt("<font color='blue'>＀ has started the game.＀</font>", [rt.fv(f, "key", live(f.usr)), live(msg)])]);
		return 1;
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<font color='red'>Error: Start Now: Game has already started.</font>"]);
	}
	return 0;
}, false, { verb: { name: "Start Now", category: "Server", desc: "Start the round RIGHT NOW" } });

// /datum/admins/proc/toggleenter  (code/modules/admin/admin.dm:538)
rt.def("/datum/admins/proc/toggleenter", function toggleenter(f: Frame) {
	rt.setGl("enter_allowed", (!truthy(rt.gl("enter_allowed")) ? 1 : 0));
	if (!truthy(rt.gl("enter_allowed"))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>New players may no longer enter the game.</B>"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>New players may now enter the game.</B>"]);
	}
	rt.call(f, P("/proc/log_admin"), null, [fmt("＀ toggled new player game entering.", [rt.call(f, P("/proc/key_name"), null, [live(f.usr)])])]);
	rt.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ toggled new player game entering.</span>", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])])]);
	rt.callName(f, rt.world(), "update_status", []);
	return f.dot;
}, false, { verb: { name: "Toggle Entering", category: "Server", desc: "People can't enter" } });

// /datum/admins/proc/toggleAI  (code/modules/admin/admin.dm:552)
rt.def("/datum/admins/proc/toggleAI", function toggleAI(f: Frame) {
	rt.setFv(f, "allow_ai", rt.gl("config"), (!truthy(rt.fv(f, "allow_ai", rt.gl("config"))) ? 1 : 0));
	if (!truthy(rt.fv(f, "allow_ai", rt.gl("config")))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>The AI job is no longer chooseable.</B>"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>The AI job is chooseable now.</B>"]);
	}
	rt.call(f, P("/proc/log_admin"), null, [fmt("＀ toggled AI allowed.", [rt.call(f, P("/proc/key_name"), null, [live(f.usr)])])]);
	rt.callName(f, rt.world(), "update_status", []);
	return f.dot;
}, false, { verb: { name: "Toggle AI", category: "Server", desc: "People can't be AI" } });

// /datum/admins/proc/toggleaban  (code/modules/admin/admin.dm:565)
rt.def("/datum/admins/proc/toggleaban", function toggleaban(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.setGl("abandon_allowed", (!truthy(rt.gl("abandon_allowed")) ? 1 : 0));
	if (truthy(rt.gl("abandon_allowed"))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>You may now respawn.</B>"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>You may no longer respawn :(</B>"]);
	}
	$0 = rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]);
	if (truthy(rt.gl("abandon_allowed"))) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	rt.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ toggled respawn to ＀.</span>", [$0, $1])]);
	$0 = rt.call(f, P("/proc/key_name"), null, [live(f.usr)]);
	if (truthy(rt.gl("abandon_allowed"))) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	rt.call(f, P("/proc/log_admin"), null, [fmt("＀ toggled respawn to ＀.", [$0, $1])]);
	rt.callName(f, rt.world(), "update_status", []);
	return f.dot;
}, false, { verb: { name: "Toggle Respawn", category: "Server", desc: "Respawn basically" } });

// /datum/admins/proc/delay  (code/modules/admin/admin.dm:580)  may sleep
rt.def("/datum/admins/proc/delay", function* delay(f: Frame) {
	let newtime: Value = null;
	f.vars = () => [newtime];
	newtime = (yield* g.op(f, "Prompt", [33], [null, (yield* g.call(f, P("/proc/round"), null, [divide((yield* g.callName(f, rt.gl("SSticker"), "GetTimeLeft", [])), 10)])), "Set Delay", "Set a new time in seconds. Set -1 for indefinite delay.", null]));
	if (rt.gt(rt.fv(f, "current_state", rt.gl("SSticker")), 1)) {
		return (yield* g.call(f, P("/proc/alert"), null, ["Too late... The game has already started!"]));
	}
	if (!truthy(live(newtime))) return f.dot;
	yield* g.callName(f, rt.gl("SSticker"), "SetTimeLeft", [multiply(live(newtime), 10)]);
	if (rt.lt(live(newtime), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<b>The game start has been delayed.</b>"]);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ delayed the round start.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<b>The game will start in ＀ seconds.</b>", [live(newtime)])]);
		rt.op(f, "OutputReference", [rt.R.world], [rt.rsc("sound/ai/attention.ogg")], false);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ set the pre-game delay to ＀ seconds.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(newtime)])]);
	}
	return f.dot;
}, true, { verb: { name: "Delay pre-game", category: "Server", desc: "Delay the game start" } });

// /datum/admins/proc/unprison  (code/modules/admin/admin.dm:597)  may sleep
rt.def("/datum/admins/proc/unprison", function* unprison(f: Frame, M: Value) {
	f.vars = () => [M];
	if (isEqual(rt.fv(f, "z", live(M)), 1)) {
		yield* g.callName(f, rt.gl("SSjob"), "SendToLateJoin", [live(M)]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has unprisoned ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M)]))])]);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has unprisoned ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M)]))])]);
	} else {
		yield* g.call(f, P("/proc/alert"), null, [fmt("＀ is not prisoned.", [rt.fv(f, "name", live(M))])]);
	}
	return f.dot;
}, true, { verb: { name: "Unprison", category: "Admin" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// /datum/admins/proc/spawn_atom  (code/modules/admin/admin.dm:630)  may sleep
rt.def("/datum/admins/proc/spawn_atom", function* spawn_atom(f: Frame, object: Value) {
	let chosen: Value = null, _T: Value = null, A: Value = null;
	f.vars = () => [object, chosen, _T, A];
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
		return live(f.dot);
	}
	if (!truthy((chosen = (yield* g.call(f, P("/proc/pick_closest_path"), null, [live(object)]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(chosen), T("/turf")])))) {
		yield* g.callName(f, (_T = rt.getStep(f, rt.fv(f, "loc", live(f.usr)), 0)), "ChangeTurf", [live(chosen)]);
	} else {
		rt.setFv(f, "admin_spawned", (A = (yield* g.new_(f, live(chosen), [rt.fv(f, "loc", live(f.usr))]))), 1);
	}
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ spawned ＀ at (＀,＀,＀)", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(chosen), rt.fv(f, "x", live(f.usr)), rt.fv(f, "y", live(f.usr)), rt.fv(f, "z", live(f.usr))])]);
	return f.dot;
}, true, { verb: { name: "Spawn", category: "Debug", desc: "(atom path) Spawn an atom" }, argTypes: [{ type: 2 }] });

// tg_js: Spawn, then asks how many (1-100). A turf is changed once.
rt.def("/datum/admins/proc/spawn_many", function* spawn_many(f: Frame, object: Value) {
	let chosen: Value = null, amount: Value = null, A: Value = null;
	f.vars = () => [object, chosen, amount, A];
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
		return live(f.dot);
	}
	if (!truthy((chosen = (yield* g.call(f, P("/proc/pick_closest_path"), null, [live(object)]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(chosen), T("/turf")])))) {
		yield* g.callName(f, rt.getStep(f, rt.fv(f, "loc", live(f.usr)), 0), "ChangeTurf", [live(chosen)]);
		amount = 1;
	} else {
		amount = (yield* g.op(f, "Prompt", [33], [null, 5, "Spawn Many", "How many?", null]));
		if (typeof amount !== "number" || amount < 1) {
			return live(f.dot);
		}
		amount = Math.min(Math.floor(amount), 100);
		for (let i = 0; i < amount; i++) {
			rt.setFv(f, "admin_spawned", (A = (yield* g.new_(f, live(chosen), [rt.fv(f, "loc", live(f.usr))]))), 1);
		}
	}
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ spawned ＀ x ＀ at (＀,＀,＀)", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(chosen), live(amount), rt.fv(f, "x", live(f.usr)), rt.fv(f, "y", live(f.usr)), rt.fv(f, "z", live(f.usr))])]);
	return f.dot;
}, true, { verb: { name: "Spawn Many", category: "Debug", desc: "(atom path) Spawn several of an atom" }, argTypes: [{ type: 2 }] });

// tg_js: Spawn, then asks for a number of rings N (1-10): one on every tile of the square reaching N-1 tiles out from
// the user in every direction (1 = their own tile, 2 = that plus the 8 tiles touching it, 3 = 5x5, ...).
// Walls and other dense turfs are skipped, unless a turf is being spawned (then every tile is changed).
rt.def("/datum/admins/proc/spawn_grid", function* spawn_grid(f: Frame, object: Value) {
	let chosen: Value = null, size: Value = null, _T: Value = null, A: Value = null, amount: Value = null;
	f.vars = () => [object, chosen, size, _T, A, amount];
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
		return live(f.dot);
	}
	if (!truthy((chosen = (yield* g.call(f, P("/proc/pick_closest_path"), null, [live(object)]))))) {
		return live(f.dot);
	}
	size = (yield* g.op(f, "Prompt", [33], [null, 4, "Spawn Rings", "How many rings? (1 = your tile, 2 = 3x3, 3 = 5x5)", null]));
	if (typeof size !== "number" || size < 1 || !truthy(rt.fv(f, "loc", live(f.usr)))) {
		return live(f.dot);
	}
	size = Math.min(Math.floor(size), 10) * 2 - 1;
	const is_turf = truthy((yield* g.call(f, P("/proc/ispath"), null, [live(chosen), T("/turf")])));
	const ux = rt.fv(f, "x", live(f.usr)), uy = rt.fv(f, "y", live(f.usr)), uz = rt.fv(f, "z", live(f.usr));
	const x0 = ux - Math.floor(size / 2), y0 = uy - Math.floor(size / 2);
	amount = 0;
	for (let x = x0; x < x0 + size; x++) {
		for (let y = y0; y < y0 + size; y++) {
			if (!truthy((_T = rt.locate(x, y, uz)))) continue;
			if (is_turf) {
				yield* g.callName(f, live(_T), "ChangeTurf", [live(chosen)]);
			} else {
				if (truthy(rt.fv(f, "density", live(_T)))) continue;
				rt.setFv(f, "admin_spawned", (A = (yield* g.new_(f, live(chosen), [live(_T)]))), 1);
			}
			amount++;
		}
	}
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ spawned ＀ on ＀ tiles (＀x＀ square) around (＀,＀,＀)", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(chosen), live(amount), live(size), live(size), ux, uy, uz])]);
	return f.dot;
}, true, { verb: { name: "Spawn Rings", category: "Debug", desc: "(atom path) Spawn an atom on your tile and the rings of tiles around it" }, argTypes: [{ type: 2 }] });

// /datum/admins/proc/show_traitor_panel  (code/modules/admin/admin.dm:652)  may sleep
rt.def("/datum/admins/proc/show_traitor_panel", function* show_traitor_panel(f: Frame, M: Value) {
	f.vars = () => [M];
	if (!truthy((rt.istype(live(M), T("/mob")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob"]);
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "mind", live(M)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This mob has no mind!"]);
		return live(f.dot);
	}
	yield* g.callName(f, rt.fv(f, "mind", live(M)), "edit_memory", []);
	return f.dot;
}, true, { verb: { name: "Show Traitor Panel", category: "Admin", desc: "Edit mobs's memory and role" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// /datum/admins/proc/toggletintedweldhelmets  (code/modules/admin/admin.dm:667)
rt.def("/datum/admins/proc/toggletintedweldhelmets", function toggletintedweldhelmets(f: Frame) {
	rt.setGl("tinted_weldhelh", (!truthy(rt.gl("tinted_weldhelh")) ? 1 : 0));
	if (truthy(rt.gl("tinted_weldhelh"))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>The tinted_weldhelh has been enabled!</B>"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>The tinted_weldhelh has been disabled!</B>"]);
	}
	rt.call(f, P("/proc/log_admin"), null, [fmt("＀ toggled tinted_weldhelh.", [rt.call(f, P("/proc/key_name"), null, [live(f.usr)])])]);
	rt.call(f, P("/proc/message_admins"), null, [fmt("＀ toggled tinted_weldhelh.", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])])]);
	return f.dot;
}, false, { verb: { name: "Toggle tinted welding helmes", category: "Debug", desc: "Reduces view range when wearing welding helmets" } });

// /datum/admins/proc/toggleguests  (code/modules/admin/admin.dm:680)
rt.def("/datum/admins/proc/toggleguests", function toggleguests(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.setGl("guests_allowed", (!truthy(rt.gl("guests_allowed")) ? 1 : 0));
	if (!truthy(rt.gl("guests_allowed"))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>Guests may no longer enter the game.</B>"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>Guests may now enter the game.</B>"]);
	}
	$0 = rt.call(f, P("/proc/key_name"), null, [live(f.usr)]);
	if (truthy(rt.gl("guests_allowed"))) {
		$1 = "";
	} else {
		$1 = "dis";
	}
	rt.call(f, P("/proc/log_admin"), null, [fmt("＀ toggled guests game entering ＀allowed.", [$0, $1])]);
	$0 = rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]);
	if (truthy(rt.gl("guests_allowed"))) {
		$1 = "";
	} else {
		$1 = "dis";
	}
	rt.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ toggled guests game entering ＀allowed.</span>", [$0, $1])]);
	return f.dot;
}, false, { verb: { name: "Toggle guests", category: "Server", desc: "Guests can't enter" } });

// /datum/admins/proc/output_ai_laws  (code/modules/admin/admin.dm:691)
rt.def("/datum/admins/proc/output_ai_laws", function output_ai_laws(f: Frame) {
	let ai_number: Value = null, S: Value = null, R: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [ai_number, S, R, $0, $1, $2, $e];
	ai_number = 0;
	S = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/silicon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		ai_number = rt.inc(live(ai_number), 1);
		if (truthy((rt.istype(live(S), T("/mob/living/silicon/ai")) ? 1 : 0))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<b>AI ＀'s laws:</b>", [rt.call(f, P("/proc/key_name"), null, [live(S), live(f.usr)])])]);
		} else {
			if (truthy((rt.istype(live(S), T("/mob/living/silicon/robot")) ? 1 : 0))) {
				R = live(S);
				$0 = live(f.usr);
				$1 = rt.call(f, P("/proc/key_name"), null, [live(S), live(f.usr)]);
				if (truthy(rt.fv(f, "connected_ai", live(R)))) {
					$2 = fmt("(Slaved to: ＀)", [rt.fv(f, "connected_ai", live(R))]);
				} else {
					$2 = "(Independent)";
				}
				rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<b>CYBORG ＀ ＀: laws:</b>", [$1, $2])]);
			} else {
				if (truthy((rt.istype(live(S), T("/mob/living/silicon/pai")) ? 1 : 0))) {
					rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<b>pAI ＀'s laws:</b>", [rt.call(f, P("/proc/key_name"), null, [live(S), live(f.usr)])])]);
				} else {
					rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<b>SOMETHING SILICON ＀'s laws:</b>", [rt.call(f, P("/proc/key_name"), null, [live(S), live(f.usr)])])]);
				}
			}
		}
		if (rt.fv(f, "laws", live(S)) === null) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀'s laws are null?? Contact a coder.", [rt.call(f, P("/proc/key_name"), null, [live(S), live(f.usr)])])]);
		} else {
			rt.callName(f, rt.fv(f, "laws", live(S)), "show_laws", [live(f.usr)]);
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(ai_number))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<b>No AIs located</b>"]);
	return f.dot;
});

// /datum/admins/proc/output_all_devil_info  (code/modules/admin/admin.dm:712)
rt.def("/datum/admins/proc/output_all_devil_info", function output_all_devil_info(f: Frame) {
	let devil_number: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [devil_number, D, $e];
	devil_number = 0;
	D = null;
	rt.forList(f, 0, rt.gv(f, "devils", rt.fv(f, "mode", rt.gl("SSticker"))));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		devil_number = rt.inc(live(devil_number), 1);
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), add(fmt("Devil #＀:<br><br>", [live(devil_number)]), rt.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "printdevilinfo", [live(D)]))]);
	}
	rt.endFor(f, 0);
	if (truthy(live(devil_number))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<b>No Devils located</b>"]);
	return f.dot;
});

// /datum/admins/proc/output_devil_info  (code/modules/admin/admin.dm:719)
rt.def("/datum/admins/proc/output_devil_info", function output_devil_info(f: Frame, M: Value) {
	if (truthy(rt.call(f, P("/proc/is_devil"), null, [live(M)]))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), rt.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "printdevilinfo", [rt.fv(f, "mind", live(M))])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<b>＀ is not a devil.", [live(M)])]);
	}
	return f.dot;
});

// /datum/admins/proc/manage_free_slots  (code/modules/admin/admin.dm:725)  may sleep
rt.def("/datum/admins/proc/manage_free_slots", function* manage_free_slots(f: Frame) {
	let dat: Value = null, count: Value = null, job: Value = null, J_title: Value = null, J_opPos: Value = null, J_totPos: Value = null, winheight: Value = null;
	let $e: any;
	f.vars = () => [dat, count, job, J_title, J_opPos, J_totPos, winheight, $e];
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [])))) {
		return live(f.dot);
	}
	dat = "<html><head><title>Manage Free Slots</title></head><body>";
	count = 0;
	if ((truthy(rt.gl("SSticker")) && !truthy(rt.fv(f, "mode", rt.gl("SSticker"))))) {
		yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "You cannot manage jobs before the round starts!"]);
		return live(f.dot);
	}
	if (truthy(rt.gl("SSjob"))) {
		job = null;
		rt.forList(f, 0, rt.fv(f, "occupations", rt.gl("SSjob")), T("/datum/job"));
		while (($e = rt.next(f, 0)) !== undefined) {
			job = $e;
			count = rt.inc(live(count), 1);
			J_title = (yield* g.call(f, P("/proc/html_encode"), null, [rt.fv(f, "title", live(job))]));
			J_opPos = (yield* g.call(f, P("/proc/html_encode"), null, [subtract(rt.fv(f, "total_positions", live(job)), subtract(rt.fv(f, "total_positions", live(job)), rt.fv(f, "current_positions", live(job))))]));
			J_totPos = (yield* g.call(f, P("/proc/html_encode"), null, [rt.fv(f, "total_positions", live(job))]));
			if (rt.lt(rt.fv(f, "total_positions", live(job)), 0)) {
				dat = rt.modify(live(dat), fmt("＀: ＀   (unlimited)", [live(J_title), live(J_opPos)]), add);
			} else {
				dat = rt.modify(live(dat), fmt("＀: ＀/＀", [live(J_title), live(J_opPos), live(J_totPos)]), add);
			}
			if ((isEqual(rt.fv(f, "title", live(job)), "AI") || isEqual(rt.fv(f, "title", live(job)), "Cyborg"))) {
				dat = rt.modify(live(dat), "   (Cannot Late Join)<br>", add);
				continue;
			}
			if (rt.ge(rt.fv(f, "total_positions", live(job)), 0)) {
				dat = rt.modify(live(dat), fmt("   <A href='?src=＃;addjobslot=＀'>Add</A>  |  ", [live(f.src), rt.fv(f, "title", live(job))]), add);
				if (rt.gt(rt.fv(f, "total_positions", live(job)), rt.fv(f, "current_positions", live(job)))) {
					dat = rt.modify(live(dat), fmt("<A href='?src=＃;removejobslot=＀'>Remove</A>  |  ", [live(f.src), rt.fv(f, "title", live(job))]), add);
				} else {
					dat = rt.modify(live(dat), "Remove  |  ", add);
				}
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;unlimitjobslot=＀'>Unlimit</A>", [live(f.src), rt.fv(f, "title", live(job))]), add);
			} else {
				dat = rt.modify(live(dat), fmt("   <A href='?src=＃;limitjobslot=＀'>Limit</A>", [live(f.src), rt.fv(f, "title", live(job))]), add);
			}
			dat = rt.modify(live(dat), "<br>", add);
		}
		rt.endFor(f, 0);
	}
	dat = rt.modify(live(dat), "</body>", add);
	winheight = (yield* g.call(f, P("/proc/min"), null, [(winheight = add(100, multiply(live(count), 20))), 690]));
	rt.op(f, "Browse", [], [live(f.usr), live(dat), fmt("window=players;size=375x＀", [live(winheight)])], false);
	return f.dot;
}, true);

// /proc/kick_clients_in_lobby  (code/modules/admin/admin.dm:778)  may sleep
rt.def("/proc/kick_clients_in_lobby", function* kick_clients_in_lobby(f: Frame, message: Value, kick_only_afk: Value) {
	let kicked_client_names: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [message, kick_only_afk, kicked_client_names, C, $e];
	if (live(kick_only_afk) === null) {
		kick_only_afk = 0;
	}
	kicked_client_names = rt.list();
	C = null;
	rt.forList(f, 0, rt.gl("clients"), T("/client"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (truthy((rt.istype(rt.fv(f, "mob", live(C)), T("/mob/dead/new_player")) ? 1 : 0))) {
			if ((truthy(live(kick_only_afk)) && !truthy((yield* g.callName(f, live(C), "is_afk", []))))) {
				continue;
			}
			if (truthy(live(message))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(C), live(message)]);
			}
			yield* g.callName(f, live(kicked_client_names), "Add", [fmt("＀", [rt.fv(f, "ckey", live(C))])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(C)]);
		}
	}
	rt.endFor(f, 0);
	return live(kicked_client_names);
}, true);

// /datum/admins/proc/cmd_ghost_drag  (code/modules/admin/admin.dm:794)  may sleep
rt.def("/datum/admins/proc/cmd_ghost_drag", function* cmd_ghost_drag(f: Frame, frommob: Value, tomob: Value) {
	let question: Value = null, ask: Value = null;
	f.vars = () => [frommob, tomob, question, ask];
	if ((!truthy((yield* g.call(f, P("/proc/check_rights"), null, [1024, 0]))) || !truthy((yield* g.call(f, P("/proc/check_rights"), null, [4128, 0]))))) {
		return 0;
	}
	if (!truthy(rt.fv(f, "ckey", live(frommob)))) {
		return 0;
	}
	question = "";
	if (truthy(rt.fv(f, "ckey", live(tomob)))) {
		question = fmt("This mob already has a user (＀) in control of it! ", [rt.fv(f, "key", live(tomob))]);
	}
	question = rt.modify(live(question), fmt("Are you sure you want to place ＀(＀) in control of ＀?", [rt.fv(f, "name", live(frommob)), rt.fv(f, "key", live(frommob)), rt.fv(f, "name", live(tomob))]), add);
	if (!isEqual((ask = (yield* g.call(f, P("/proc/alert"), null, [live(question), "Place ghost in control of mob?", "Yes", "No"]))), "Yes")) {
		return 1;
	}
	if ((!truthy(live(frommob)) || !truthy(live(tomob)))) {
		return 1;
	}
	yield* g.callName(f, live(tomob), "ghostize", [0]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ has put ＀ in control of ＀.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.fv(f, "ckey", live(frommob)), rt.fv(f, "name", live(tomob))])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ stuffed ＀ into ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.fv(f, "ckey", live(frommob)), rt.fv(f, "name", live(tomob))])]);
	rt.setFv(f, "ckey", live(tomob), rt.fv(f, "ckey", live(frommob)));
	yield* g.call(f, P("/proc/qdel"), null, [live(frommob)]);
	return 1;
}, true);

// /client/proc/adminGreet  (code/modules/admin/admin.dm:824)
rt.def("/client/proc/adminGreet", function adminGreet(f: Frame, logout: Value) {
	let string: Value = null;
	f.vars = () => [string];
	if (!truthy(rt.callName(f, rt.gl("SSticker"), "HasRoundStarted", []))) return f.dot;
	string = null;
	if (((truthy(live(logout)) && truthy(rt.gl("config"))) && truthy(rt.fv(f, "announce_admin_logout", rt.gl("config"))))) {
		string = rt.op(f, "PickUnweighted", [1], [fmt("Admin logout: ＀", [rt.call(f, P("/proc/key_name"), null, [live(f.src)])])]);
	} else {
		if ((((!truthy(live(logout)) && truthy(rt.gl("config"))) && truthy(rt.fv(f, "announce_admin_login", rt.gl("config")))) && truthy(rt.bitAnd(rt.fv(f, "toggles", rt.sv(f, "prefs")), 1024)))) {
			string = rt.op(f, "PickUnweighted", [1], [fmt("Admin login: ＀", [rt.call(f, P("/proc/key_name"), null, [live(f.src)])])]);
		}
	}
	if (!truthy(live(string))) return f.dot;
	rt.call(f, P("/proc/message_admins"), null, [fmt("＀", [live(string)])]);
	return f.dot;
});
