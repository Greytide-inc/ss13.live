// Based on /tg/station's code/modules/admin/admin.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, truthy, fmt } = rt;


// admin.dm:4
rt.def("/proc/message_admins", function message_admins(f: Frame, msg: Value) {
	msg = `<span class="admin"><span class="prefix">ADMIN LOG:</span> <span class="message">${msg}</span></span>`;
	to_chat(GLOB.admins, msg);
	return f.dot;
});

// admin.dm:19
rt.def("/datum/admins/proc/show_player_panel", function show_player_panel(f: Frame, M: Value) {
	let muted: Value = null;
	let $0: any, $1: any, $2: any;
	if (!check_rights()) {
		return f.dot;
	}
	if (!rt.istype(f.usr, T("/mob/dead/observer"))) {
		log_game(`${key_name_admin(f.usr)} checked the player panel while in game.`);
	}
	if (!M) {
		to_chat(f.usr, "You seem to be selecting a mob that doesn't exist anymore.");
		return f.dot;
	}
	let body: Value = `<html><head><title>Options for ${M.key}</title></head>`;
	body += `<body>Options panel for <b>${M}</b>`;
	if (M.client) {
		body += ` played by <b>${M.client}</b> `;
		body += `[${M.client.holder ? M.client.holder.rank : "Player"}]`;
	}
	if (rt.istype(M, T("/mob/dead/new_player"))) {
		body += " <B>Hasn't Entered Game</B> ";
	} else {
		body += fmt(" [<A href='?_src_=holder;revive=＃'>Heal</A>] ", [M]);
	}
	if (M.client) {
		body += `<br>[<b>First Seen:</b> ${M.client.player_join_date}][<b>Byond account registered on:</b> ${M.client.account_join_date}]`;
		body += "<br><br><b>Show related accounts by:</b> ";
		body += fmt("[ <a href='?_src_=holder;showrelatedacc=cid;client=＃'>CID</a> | ", [M.client]);
		body += fmt("<a href='?_src_=holder;showrelatedacc=ip;client=＃'>IP</a> ]", [M.client]);
	}
	body += "<br><br>[ ";
	body += fmt("<a href='?_src_=vars;Vars=＃'>VV</a> - ", [M]);
	body += fmt("<a href='?_src_=holder;traitor=＃'>TP</a> - ", [M]);
	body += `<a href='?priv_msg=${M.ckey}'>PM</a> - `;
	body += fmt("<a href='?_src_=holder;subtlemessage=＃'>SM</a> - ", [M]);
	body += fmt("<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a> - ", [M]);
	body += fmt("<a href='?_src_=holder;individuallog=＃'>LOGS</a>] <br>", [M]);
	body += `<b>Mob type</b> = ${M.type}<br><br>`;
	body += fmt("<A href='?_src_=holder;boot2=＃'>Kick</A> | ", [M]);
	body += fmt("<A href='?_src_=holder;newban=＃'>Ban</A> | ", [M]);
	if (M.client) {
		body += fmt("| <A href='?_src_=holder;sendtoprison=＃'>Prison</A> | ", [M]);
		body += fmt(" <A href='?_src_=holder;sendbacktolobby=＃'>Send back to Lobby</A> | ", [M]);
		muted = M.client.prefs.muted;
		body += "<br><b>Mute: </b> ";
		$0 = M.ckey;
		$1 = 1;
		if (rt.bitAnd(muted, 1)) {
			$2 = "red";
		} else {
			$2 = "blue";
		}
		body += `[<A href='?_src_=holder;mute=${$0};mute_type=${$1}'><font color='${$2}'>IC</font></a> | `;
		$0 = M.ckey;
		$1 = 2;
		if (rt.bitAnd(muted, 2)) {
			$2 = "red";
		} else {
			$2 = "blue";
		}
		body += `<A href='?_src_=holder;mute=${$0};mute_type=${$1}'><font color='${$2}'>OOC</font></a> | `;
		$0 = M.ckey;
		$1 = 4;
		if (rt.bitAnd(muted, 4)) {
			$2 = "red";
		} else {
			$2 = "blue";
		}
		body += `<A href='?_src_=holder;mute=${$0};mute_type=${$1}'><font color='${$2}'>PRAY</font></a> | `;
		$0 = M.ckey;
		$1 = 8;
		if (rt.bitAnd(muted, 8)) {
			$2 = "red";
		} else {
			$2 = "blue";
		}
		body += `<A href='?_src_=holder;mute=${$0};mute_type=${$1}'><font color='${$2}'>ADMINHELP</font></a> | `;
		$0 = M.ckey;
		$1 = 16;
		if (rt.bitAnd(muted, 16)) {
			$2 = "red";
		} else {
			$2 = "blue";
		}
		body += `<A href='?_src_=holder;mute=${$0};mute_type=${$1}'><font color='${$2}'>DEADCHAT</font></a>]`;
		$0 = M.ckey;
		$1 = 31;
		if (rt.bitAnd(muted, 31)) {
			$2 = "red";
		} else {
			$2 = "blue";
		}
		body += `(<A href='?_src_=holder;mute=${$0};mute_type=${$1}'><font color='${$2}'>toggle all</font></a>)`;
	}
	body += "<br><br>";
	body += fmt("<A href='?_src_=holder;jumpto=＃'><b>Jump to</b></A> | ", [M]);
	body += fmt("<A href='?_src_=holder;getmob=＃'>Get</A> | ", [M]);
	body += fmt("<A href='?_src_=holder;sendmob=＃'>Send To</A>", [M]);
	body += "<br><br>";
	body += fmt("<A href='?_src_=holder;traitor=＃'>Traitor panel</A> | ", [M]);
	body += fmt("<A href='?_src_=holder;narrateto=＃'>Narrate to</A> | ", [M]);
	body += fmt("<A href='?_src_=holder;subtlemessage=＃'>Subtle message</A> | ", [M]);
	body += fmt("<A href='?_src_=holder;languagemenu=＃'>Language Menu</A>", [M]);
	if (M.client) {
		if (!rt.istype(M, T("/mob/dead/new_player"))) {
			body += "<br><br>";
			body += "<b>Transformation:</b>";
			body += "<br>";
			if (rt.istype(M, T("/mob/living/carbon/human"))) {
				body += "<B>Human</B> | ";
			} else {
				body += fmt("<A href='?_src_=holder;humanone=＃'>Humanize</A> | ", [M]);
			}
			if (rt.istype(M, T("/mob/living/carbon/monkey"))) {
				body += "<B>Monkeyized</B> | ";
			} else {
				body += fmt("<A href='?_src_=holder;monkeyone=＃'>Monkeyize</A> | ", [M]);
			}
			if (rt.istype(M, T("/mob/living/simple_animal/pet/dog/corgi"))) {
				body += "<B>Corgized</B> | ";
			} else {
				body += fmt("<A href='?_src_=holder;corgione=＃'>Corgize</A> | ", [M]);
			}
			if (rt.istype(M, T("/mob/living/silicon/ai"))) {
				body += "<B>Is an AI</B> ";
			} else if (rt.istype(M, T("/mob/living/carbon/human"))) {
				body += fmt("<A href='?_src_=holder;makeai=＃'>Make AI</A> | ", [M]);
				body += fmt("<A href='?_src_=holder;makerobot=＃'>Make Robot</A> | ", [M]);
				body += fmt("<A href='?_src_=holder;makealien=＃'>Make Alien</A> | ", [M]);
				body += fmt("<A href='?_src_=holder;makeslime=＃'>Make Slime</A> | ", [M]);
				body += fmt("<A href='?_src_=holder;makeblob=＃'>Make Blob</A> | ", [M]);
			}
			if (rt.istype(M, T("/mob/living/simple_animal"))) {
				body += fmt("<A href='?_src_=holder;makeanimal=＃'>Re-Animalize</A> | ", [M]);
			} else {
				body += fmt("<A href='?_src_=holder;makeanimal=＃'>Animalize</A> | ", [M]);
			}
			body += "<br><br>";
			body += "<b>Rudimentary transformation:</b><font size=2><br>These transformations only create a new mob type and copy stuff over. They do not take into account MMIs and similar mob-specific things. The buttons in 'Transformations' are preferred, when possible.</font><br>";
			body += fmt("<A href='?_src_=holder;simplemake=observer;mob=＃'>Observer</A> | ", [M]);
			body += fmt("[ Alien: <A href='?_src_=holder;simplemake=drone;mob=＃'>Drone</A>, ", [M]);
			body += fmt("<A href='?_src_=holder;simplemake=hunter;mob=＃'>Hunter</A>, ", [M]);
			body += fmt("<A href='?_src_=holder;simplemake=sentinel;mob=＃'>Sentinel</A>, ", [M]);
			body += fmt("<A href='?_src_=holder;simplemake=praetorian;mob=＃'>Praetorian</A>, ", [M]);
			body += fmt("<A href='?_src_=holder;simplemake=queen;mob=＃'>Queen</A>, ", [M]);
			body += fmt("<A href='?_src_=holder;simplemake=larva;mob=＃'>Larva</A> ] ", [M]);
			body += fmt("<A href='?_src_=holder;simplemake=human;mob=＃'>Human</A> ", [M]);
			body += fmt("[ slime: <A href='?_src_=holder;simplemake=slime;mob=＃'>Baby</A>, ", [M]);
			body += fmt("<A href='?_src_=holder;simplemake=adultslime;mob=＃'>Adult</A> ] ", [M]);
			body += fmt("<A href='?_src_=holder;simplemake=monkey;mob=＃'>Monkey</A> | ", [M]);
			body += fmt("<A href='?_src_=holder;simplemake=robot;mob=＃'>Cyborg</A> | ", [M]);
			body += fmt("<A href='?_src_=holder;simplemake=cat;mob=＃'>Cat</A> | ", [M]);
			body += fmt("<A href='?_src_=holder;simplemake=runtime;mob=＃'>Runtime</A> | ", [M]);
			body += fmt("<A href='?_src_=holder;simplemake=corgi;mob=＃'>Corgi</A> | ", [M]);
			body += fmt("<A href='?_src_=holder;simplemake=ian;mob=＃'>Ian</A> | ", [M]);
			body += fmt("<A href='?_src_=holder;simplemake=crab;mob=＃'>Crab</A> | ", [M]);
			body += fmt("<A href='?_src_=holder;simplemake=coffee;mob=＃'>Coffee</A> | ", [M]);
			body += fmt("[ Construct: <A href='?_src_=holder;simplemake=constructarmored;mob=＃'>Juggernaut</A> , ", [M]);
			body += fmt("<A href='?_src_=holder;simplemake=constructbuilder;mob=＃'>Artificer</A> , ", [M]);
			body += fmt("<A href='?_src_=holder;simplemake=constructwraith;mob=＃'>Wraith</A> ] ", [M]);
			body += fmt("<A href='?_src_=holder;simplemake=shade;mob=＃'>Shade</A>", [M]);
			body += "<br>";
		}
	}
	if (M.client) {
		body += "<br><br>";
		body += "<b>Other actions:</b>";
		body += "<br>";
		body += fmt("<A href='?_src_=holder;forcespeech=＃'>Forcesay</A> | ", [M]);
		body += fmt("<A href='?_src_=holder;tdome1=＃'>Thunderdome 1</A> | ", [M]);
		body += fmt("<A href='?_src_=holder;tdome2=＃'>Thunderdome 2</A> | ", [M]);
		body += fmt("<A href='?_src_=holder;tdomeadmin=＃'>Thunderdome Admin</A> | ", [M]);
		body += fmt("<A href='?_src_=holder;tdomeobserve=＃'>Thunderdome Observer</A> | ", [M]);
	}
	body += "<br>";
	body += "</body></html>";
	rt.op(f, "Browse", [], [f.usr, body, fmt("window=adminplayeropts-＃;size=550x515", [M])], false);
	return f.dot;
}, false, { verb: { name: "Show Player Panel", category: "Admin", desc: "Edit player (respawn, ban, heal, etc)" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// admin.dm:184
rt.def("/datum/admins/proc/access_news_network", function access_news_network(f: Frame) {
	let wanted_already: Value = null, CHANNEL: Value = null, check: Value = null, FC: Value = null, i: Value = null, MESSAGE: Value = null, comment: Value = null, MESSAGE_1: Value = null, comment_2: Value = null, end_param: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $e: any;
	if (!rt.istype(f.src, T("/datum/admins"))) {
		f.src = f.usr.client.holder;
	}
	if (!rt.istype(f.src, T("/datum/admins"))) {
		to_chat(f.usr, "Error: you are not an admin!");
		return f.dot;
	}
	let dat: Value = "<HEAD><TITLE>Admin Newscaster</TITLE></HEAD><H3>Admin Newscaster Unit</H3>";
	const sv_2 = rt.sv(f, "admincaster_screen");
	if (sv_2 === 0) {
		dat += "Welcome to the admin newscaster.<BR> Here you can add, edit and censor every newspiece on the network.";
		dat += "<BR>Feed channels and stories entered through here will be uneditable and handled as official news by the rest of the units.";
		dat += "<BR>Note that this panel allows full freedom over the news network, there are no constrictions except the few basic ones. Don't break things!</FONT>";
		if (GLOB.news_network.wanted_issue.active) {
			dat += fmt("<HR><A href='?src=＃;ac_view_wanted=1'>Read Wanted Issue</A>", [f.src]);
		}
		dat += fmt("<HR><BR><A href='?src=＃;ac_create_channel=1'>Create Feed Channel</A>", [f.src]);
		dat += fmt("<BR><A href='?src=＃;ac_view=1'>View Feed Channels</A>", [f.src]);
		dat += fmt("<BR><A href='?src=＃;ac_create_feed_story=1'>Submit new Feed story</A>", [f.src]);
		dat += fmt("<BR><BR><A href='?src=＃;mach_close=newscaster_main'>Exit</A>", [f.usr]);
		wanted_already = 0;
		if (GLOB.news_network.wanted_issue.active) {
			wanted_already = 1;
		}
		dat += "<HR><B>Feed Security functions:</B><BR>";
		$0 = f.src;
		if (wanted_already) {
			$1 = "Manage";
		} else {
			$1 = "Publish";
		}
		dat += fmt("<BR><A href='?src=＃;ac_menu_wanted=1'>＀ \"Wanted\" Issue</A>", [$0, $1]);
		dat += fmt("<BR><A href='?src=＃;ac_menu_censor_story=1'>Censor Feed Stories</A>", [f.src]);
		dat += fmt("<BR><A href='?src=＃;ac_menu_censor_channel=1'>Mark Feed Channel with Nanotrasen D-Notice (disables and locks the channel).</A>", [f.src]);
		dat += fmt("<BR><HR><A href='?src=＃;ac_set_signature=1'>The newscaster recognises you as:<BR> <FONT COLOR='green'>＀</FONT></A>", [f.src, f.src.admin_signature]);
	} else if (sv_2 === 1) {
		dat += "Station Feed Channels<HR>";
		if (isemptylist(GLOB.news_network.network_channels)) {
			dat += "<I>No active channels found...</I>";
		} else {
			for (CHANNEL of each(GLOB.news_network.network_channels, T("/datum/newscaster/feed_channel"))) {
				if (CHANNEL.is_admin_channel) {
					dat += fmt("<B><FONT style='BACKGROUND-COLOR: LightGreen'><A href='?src=＃;ac_show_channel=＃'>＀</A></FONT></B><BR>", [f.src, CHANNEL, CHANNEL.channel_name]);
				} else {
					$0 = f.src;
					$1 = CHANNEL;
					$2 = CHANNEL.channel_name;
					if (CHANNEL.censored) {
						$3 = "<FONT COLOR='red'>***</FONT>";
					} else {
						$3 = null;
					}
					dat += fmt("<B><A href='?src=＃;ac_show_channel=＃'>＀</A> ＀<BR></B>", [$0, $1, $2, $3]);
				}
			}
		}
		dat += fmt("<BR><HR><A href='?src=＃;ac_refresh=1'>Refresh</A>", [f.src]);
		dat += fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Back</A>", [f.src, 0]);
	} else if (sv_2 === 2) {
		dat += "Creating new Feed Channel...";
		dat += fmt("<HR><B><A href='?src=＃;ac_set_channel_name=1'>Channel Name</A>:</B> ＀<BR>", [f.src, f.src.admincaster_feed_channel.channel_name]);
		dat += fmt("<B><A href='?src=＃;ac_set_signature=1'>Channel Author</A>:</B> <FONT COLOR='green'>＀</FONT><BR>", [f.src, f.src.admin_signature]);
		$0 = f.src;
		if (f.src.admincaster_feed_channel.locked) {
			$1 = "NO";
		} else {
			$1 = "YES";
		}
		dat += fmt("<B><A href='?src=＃;ac_set_channel_lock=1'>Will Accept Public Feeds</A>:</B> ＀<BR><BR>", [$0, $1]);
		dat += fmt("<BR><A href='?src=＃;ac_submit_new_channel=1'>Submit</A><BR><BR><A href='?src=＃;ac_setScreen=＀'>Cancel</A><BR>", [f.src, f.src, 0]);
	} else if (sv_2 === 3) {
		dat += "Creating new Feed Message...";
		dat += fmt("<HR><B><A href='?src=＃;ac_set_channel_receiving=1'>Receiving Channel</A>:</B> ＀<BR>", [f.src, f.src.admincaster_feed_channel.channel_name]);
		dat += `<B>Message Author:</B> <FONT COLOR='green'>${f.src.admin_signature}</FONT><BR>`;
		dat += fmt("<B><A href='?src=＃;ac_set_new_message=1'>Message Body</A>:</B> ＀ <BR>", [f.src, f.src.admincaster_feed_message.returnBody(-1)]);
		dat += fmt("<BR><A href='?src=＃;ac_submit_new_message=1'>Submit</A><BR><BR><A href='?src=＃;ac_setScreen=＀'>Cancel</A><BR>", [f.src, f.src, 0]);
	} else if (sv_2 === 4) {
		dat += `Feed story successfully submitted to ${f.src.admincaster_feed_channel.channel_name}.<BR><BR>`;
		dat += fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Return</A><BR>", [f.src, 0]);
	} else if (sv_2 === 5) {
		dat += `Feed Channel ${f.src.admincaster_feed_channel.channel_name} created successfully.<BR><BR>`;
		dat += fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Return</A><BR>", [f.src, 0]);
	} else if (sv_2 === 6) {
		dat += "<B><FONT COLOR='maroon'>ERROR: Could not submit Feed story to Network.</B></FONT><HR><BR>";
		if (f.src.admincaster_feed_channel.channel_name == "") {
			dat += "<FONT COLOR='maroon'>Invalid receiving channel name.</FONT><BR>";
		}
		if (f.src.admincaster_feed_message.returnBody(-1) == "" || f.src.admincaster_feed_message.returnBody(-1) == "[REDACTED]") {
			dat += "<FONT COLOR='maroon'>Invalid message body.</FONT><BR>";
		}
		dat += fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Return</A><BR>", [f.src, 3]);
	} else if (sv_2 === 7) {
		dat += "<B><FONT COLOR='maroon'>ERROR: Could not submit Feed Channel to Network.</B></FONT><HR><BR>";
		if (f.src.admincaster_feed_channel.channel_name == "" || f.src.admincaster_feed_channel.channel_name == "[REDACTED]") {
			dat += "<FONT COLOR='maroon'>Invalid channel name.</FONT><BR>";
		}
		check = 0;
		for (FC of each(GLOB.news_network.network_channels, T("/datum/newscaster/feed_channel"))) {
			if (FC.channel_name == f.src.admincaster_feed_channel.channel_name) {
				check = 1;
				break;
			}
		}
		if (check) {
			dat += "<FONT COLOR='maroon'>Channel name already in use.</FONT><BR>";
		}
		dat += fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Return</A><BR>", [f.src, 2]);
	} else if (sv_2 === 9) {
		dat += `<B>${rt.sv(f, "admincaster_feed_channel").channel_name}: </B><FONT SIZE=1>[created by: <FONT COLOR='maroon'>${rt.sv(f, "admincaster_feed_channel").returnAuthor(-1)}</FONT>]</FONT><HR>`;
		if (f.src.admincaster_feed_channel.censored) {
			dat += "<FONT COLOR='red'><B>ATTENTION: </B></FONT>This channel has been deemed as threatening to the welfare of the station, and marked with a Nanotrasen D-Notice.<BR>";
			dat += "No further feed story additions are allowed while the D-Notice is in effect.</FONT><BR><BR>";
		} else if (isemptylist(f.src.admincaster_feed_channel.messages)) {
			dat += "<I>No feed messages found in channel...</I><BR>";
		} else {
			i = 0;
			for (MESSAGE of each(f.src.admincaster_feed_channel.messages, T("/datum/newscaster/feed_message"))) {
				i++;
				dat += `-${MESSAGE.returnBody(-1)} <BR>`;
				if (MESSAGE.img) {
					rt.op(f, "BrowseResource", [], [f.usr, MESSAGE.img, `tmp_photo${i}.png`], false);
					dat += `<img src='tmp_photo${i}.png' width = '180'><BR><BR>`;
				}
				dat += `<FONT SIZE=1>[Story by <FONT COLOR='maroon'>${MESSAGE.returnAuthor(-1)}</FONT>]</FONT><BR>`;
				dat += `${rt.len(f, MESSAGE.comments)} comment${rt.len(f, MESSAGE.comments) > 1 ? "s" : ""}:<br>`;
				comment = null;
				for (comment of each(MESSAGE.comments, T("/datum/newscaster/feed_comment"))) {
					dat += `${comment.body}<br><font size=1>${comment.author} ${comment.time_stamp}</font><br>`;
				}
				dat += "<br>";
			}
		}
		dat += fmt("<BR><HR><A href='?src=＃;ac_refresh=1'>Refresh</A>", [f.src]);
		dat += fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Back</A>", [f.src, 1]);
	} else if (sv_2 === 10) {
		dat += "<B>Nanotrasen Feed Censorship Tool</B><BR>";
		dat += "<FONT SIZE=1>NOTE: Due to the nature of news Feeds, total deletion of a Feed Story is not possible.<BR>";
		dat += "Keep in mind that users attempting to view a censored feed will instead see the [REDACTED] tag above it.</FONT>";
		dat += "<HR>Select Feed channel to get Stories from:<BR>";
		if (isemptylist(GLOB.news_network.network_channels)) {
			dat += "<I>No feed channels found active...</I><BR>";
		} else {
			CHANNEL = null;
			for (CHANNEL of each(GLOB.news_network.network_channels, T("/datum/newscaster/feed_channel"))) {
				$0 = f.src;
				$1 = CHANNEL;
				$2 = CHANNEL.channel_name;
				if (CHANNEL.censored) {
					$3 = "<FONT COLOR='red'>***</FONT>";
				} else {
					$3 = null;
				}
				dat += fmt("<A href='?src=＃;ac_pick_censor_channel=＃'>＀</A> ＀<BR>", [$0, $1, $2, $3]);
			}
		}
		dat += fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Cancel</A>", [f.src, 0]);
	} else if (sv_2 === 11) {
		dat += "<B>Nanotrasen D-Notice Handler</B><HR>";
		dat += "<FONT SIZE=1>A D-Notice is to be bestowed upon the channel if the handling Authority deems it as harmful for the station's";
		dat += "morale, integrity or disciplinary behaviour. A D-Notice will render a channel unable to be updated by anyone, without deleting any feed";
		dat += "stories it might contain at the time. You can lift a D-Notice if you have the required access at any time.</FONT><HR>";
		if (isemptylist(GLOB.news_network.network_channels)) {
			dat += "<I>No feed channels found active...</I><BR>";
		} else {
			CHANNEL = null;
			for (CHANNEL of each(GLOB.news_network.network_channels, T("/datum/newscaster/feed_channel"))) {
				$0 = f.src;
				$1 = CHANNEL;
				$2 = CHANNEL.channel_name;
				if (CHANNEL.censored) {
					$3 = "<FONT COLOR='red'>***</FONT>";
				} else {
					$3 = null;
				}
				dat += fmt("<A href='?src=＃;ac_pick_d_notice=＃'>＀</A> ＀<BR>", [$0, $1, $2, $3]);
			}
		}
		dat += fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Back</A>", [f.src, 0]);
	} else if (sv_2 === 12) {
		dat += `<B>${f.src.admincaster_feed_channel.channel_name}: </B><FONT SIZE=1>[ created by: <FONT COLOR='maroon'>${f.src.admincaster_feed_channel.returnAuthor(-1)}</FONT> ]</FONT><BR>`;
		$0 = f.src;
		$1 = f.src.admincaster_feed_channel;
		if (f.src.admincaster_feed_channel.authorCensor) {
			$2 = "Undo Author censorship";
		} else {
			$2 = "Censor channel Author";
		}
		dat += fmt("<FONT SIZE=2><A href='?src=＃;ac_censor_channel_author=＃'>＀</A></FONT><HR>", [$0, $1, $2]);
		if (isemptylist(f.src.admincaster_feed_channel.messages)) {
			dat += "<I>No feed messages found in channel...</I><BR>";
		} else {
			for (MESSAGE_1 of each(f.src.admincaster_feed_channel.messages, T("/datum/newscaster/feed_message"))) {
				dat += `-${MESSAGE_1.returnBody(-1)} <BR><FONT SIZE=1>[Story by <FONT COLOR='maroon'>${MESSAGE_1.returnAuthor(-1)}</FONT>]</FONT><BR>`;
				$0 = f.src;
				$1 = MESSAGE_1;
				if (MESSAGE_1.bodyCensor) {
					$2 = "Undo story censorship";
				} else {
					$2 = "Censor story";
				}
				$3 = f.src;
				$4 = MESSAGE_1;
				if (MESSAGE_1.authorCensor) {
					$5 = "Undo Author Censorship";
				} else {
					$5 = "Censor message Author";
				}
				dat += fmt("<FONT SIZE=2><A href='?src=＃;ac_censor_channel_story_body=＃'>＀</A>  -  <A href='?src=＃;ac_censor_channel_story_author=＃'>＀</A></FONT><BR>", [$0, $1, $2, $3, $4, $5]);
				$0 = rt.len(f, MESSAGE_1.comments);
				if (rt.len(f, MESSAGE_1.comments) > 1) {
					$1 = "s";
				} else {
					$1 = "";
				}
				$2 = f.src;
				$3 = MESSAGE_1;
				if (MESSAGE_1.locked) {
					$4 = "Unlock";
				} else {
					$4 = "Lock";
				}
				dat += fmt("＀ comment＀: <a href='?src=＃;ac_lock_comment=＃'>＀</a><br>", [$0, $1, $2, $3, $4]);
				comment_2 = null;
				for (comment_2 of each(MESSAGE_1.comments, T("/datum/newscaster/feed_comment"))) {
					dat += fmt("＀ <a href='?src=＃;ac_del_comment=＃;ac_del_comment_msg=＃'>X</a><br><font size=1>＀ ＀</font><br>", [comment_2.body, f.src, comment_2, MESSAGE_1, comment_2.author, comment_2.time_stamp]);
				}
			}
		}
		dat += fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Back</A>", [f.src, 10]);
	} else if (sv_2 === 13) {
		dat += `<B>${f.src.admincaster_feed_channel.channel_name}: </B><FONT SIZE=1>[ created by: <FONT COLOR='maroon'>${f.src.admincaster_feed_channel.returnAuthor(-1)}</FONT> ]</FONT><BR>`;
		dat += fmt("Channel messages listed below. If you deem them dangerous to the station, you can <A href='?src=＃;ac_toggle_d_notice=＃'>Bestow a D-Notice upon the channel</A>.<HR>", [f.src, f.src.admincaster_feed_channel]);
		if (f.src.admincaster_feed_channel.censored) {
			dat += "<FONT COLOR='red'><B>ATTENTION: </B></FONT>This channel has been deemed as threatening to the welfare of the station, and marked with a Nanotrasen D-Notice.<BR>";
			dat += "No further feed story additions are allowed while the D-Notice is in effect.</FONT><BR><BR>";
		} else if (isemptylist(f.src.admincaster_feed_channel.messages)) {
			dat += "<I>No feed messages found in channel...</I><BR>";
		} else {
			MESSAGE_1 = null;
			for (MESSAGE_1 of each(f.src.admincaster_feed_channel.messages, T("/datum/newscaster/feed_message"))) {
				dat += `-${MESSAGE_1.returnBody(-1)} <BR><FONT SIZE=1>[Story by <FONT COLOR='maroon'>${MESSAGE_1.returnAuthor(-1)}</FONT>]</FONT><BR>`;
			}
		}
		dat += fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Back</A>", [f.src, 11]);
	} else if (sv_2 === 14) {
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
		dat += fmt("<A href='?src=＃;ac_set_wanted_name=1'>Criminal Name</A>: ＀ <BR>", [f.src, f.src.admincaster_wanted_message.criminal]);
		dat += fmt("<A href='?src=＃;ac_set_wanted_desc=1'>Description</A>: ＀ <BR>", [f.src, f.src.admincaster_wanted_message.body]);
		if (wanted_already) {
			dat += `<B>Wanted Issue created by:</B><FONT COLOR='green'>${GLOB.news_network.wanted_issue.scannedUser}</FONT><BR>`;
		} else {
			dat += `<B>Wanted Issue will be created under prosecutor:</B><FONT COLOR='green'>${f.src.admin_signature}</FONT><BR>`;
		}
		$0 = f.src;
		$1 = end_param;
		if (wanted_already) {

			$2 = "Edit Issue";
		} else {
			$2 = "Submit";
		}
		dat += fmt("<BR><A href='?src=＃;ac_submit_wanted=＀'>＀</A>", [$0, $1, $2]);
		if (wanted_already) {
			dat += fmt("<BR><A href='?src=＃;ac_cancel_wanted=1'>Take down Issue</A>", [f.src]);
		}
		dat += fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Cancel</A>", [f.src, 0]);
	} else if (sv_2 === 15) {
		dat += `<FONT COLOR='green'>Wanted issue for ${f.src.admincaster_wanted_message.criminal} is now in Network Circulation.</FONT><BR><BR>`;
		dat += fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Return</A><BR>", [f.src, 0]);
	} else if (sv_2 === 16) {
		dat += "<B><FONT COLOR='maroon'>ERROR: Wanted Issue rejected by Network.</B></FONT><HR><BR>";
		if (f.src.admincaster_wanted_message.criminal == "" || f.src.admincaster_wanted_message.criminal == "[REDACTED]") {
			dat += "<FONT COLOR='maroon'>Invalid name for person wanted.</FONT><BR>";
		}
		if (f.src.admincaster_wanted_message.body == "" || f.src.admincaster_wanted_message.body == "[REDACTED]") {
			dat += "<FONT COLOR='maroon'>Invalid description.</FONT><BR>";
		}
		dat += fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Return</A><BR>", [f.src, 0]);
	} else if (sv_2 === 17) {
		dat += "<B>Wanted Issue successfully deleted from Circulation</B><BR>";
		dat += fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Return</A><BR>", [f.src, 0]);
	} else if (sv_2 === 18) {
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
		dat += fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Back</A><BR>", [f.src, 0]);
	} else if (sv_2 === 19) {
		dat += `<FONT COLOR='green'>Wanted issue for ${f.src.admincaster_wanted_message.criminal} successfully edited.</FONT><BR><BR>`;
		dat += fmt("<BR><A href='?src=＃;ac_setScreen=＀'>Return</A><BR>", [f.src, 0]);
	} else {
		dat += "I'm sorry to break your immersion. This shit's bugged. Please report it.";
	}
	rt.op(f, "Browse", [], [f.usr, dat, "window=admincaster_main;size=400x600"], false);
	onclose(f.usr, "admincaster_main");
	return f.dot;
}, false, { verb: { name: "Access Newscaster Network", category: "Fun", desc: "Allows you to view, add and edit news feeds." } });

// admin.dm:390
rt.def("/datum/admins/proc/Game", function Game(f: Frame) {
	if (!check_rights(0)) {
		return f.dot;
	}
	let dat: Value = fmt("\n\t\t<center><B>Game Panel</B></center><hr>\n\n\t\t<A href='?src=＃;c_mode=1'>Change Game Mode</A><br>\n\t\t", [f.src]);
	if (GLOB.master_mode == "secret") {
		dat += fmt("<A href='?src=＃;f_secret=1'>(Force Secret Mode)</A><br>", [f.src]);
	}
	dat += fmt("\n\t\t<BR>\n\t\t<A href='?src=＃;create_object=1'>Create Object</A><br>\n\t\t<A href='?src=＃;quick_create_object=1'>Quick Create Object</A><br>\n\t\t<A href='?src=＃;create_turf=1'>Create Turf</A><br>\n\t\t<A href='?src=＃;create_mob=1'>Create Mob</A><br>\n\t\t", [f.src, f.src, f.src, f.src]);
	if (this.marked_datum && rt.istype(this.marked_datum, T("/atom"))) {
		dat += fmt("<A href='?src=＃;dupe_marked_datum=1'>Duplicate Marked Datum</A><br>", [f.src]);
	}
	rt.op(f, "Browse", [], [f.usr, dat, "window=admin2;size=210x200"], false);
	return f.dot;
});

// admin.dm:422
rt.def("/datum/admins/proc/restart", function* restart(f: Frame) {
	let result: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	if (!f.usr.client.holder) {
		return f.dot;
	}
	let options: Value = list("Regular Restart", "Hard Restart (No Delay/Feeback Reason)", "Hardest Restart (No actions, just reboot)");
	if (!(result = (yield* g.op(f, "Prompt", [1], [rt.index(options, 1), "World Reboot", "Select reboot method", f.usr, options])))) return f.dot;
	if (result === "Regular Restart") {
		$0 = GLOB.SSticker;
		if (f.usr.client.holder.fakekey) {
			$1 = "Admin";
		} else {
			$1 = f.usr.key;
		}
		$1 = `Initiated by ${$1}.`;
		$2 = f.usr.key;
		if (f.usr.client.holder.fakekey) {
			$3 = "(stealth)";
		} else {
			$3 = "";
		}
		yield* $0.Reboot($1, `admin reboot - by ${$2} ${$3}`, 10);
	} else if (result === "Hard Restart (No Delay, No Feeback Reason)") {
		yield* rt.world().Reboot();
	} else if (result === "Hardest Restart (No actions, just reboot)") {
		yield* rt.world().Reboot({ fast_track: 1 });
	}
	return f.dot;
}, true, { verb: { name: "Reboot World", category: "Server", desc: "Restarts the world immediately" } });

// admin.dm:447
rt.def("/datum/admins/proc/end_round", function* end_round(f: Frame) {
	let confirm: Value = null;
	if (!f.usr.client.holder) {
		return f.dot;
	}
	if ((confirm = (yield* alert("End the round and  restart the game world?", "End Round", "Yes", "Cancel"))) == "Cancel") {
		return f.dot;
	}
	if (confirm != "Yes") return f.dot;
	GLOB.SSticker.force_ending = 1;
	return f.dot;
}, true, { verb: { name: "End Round", category: "Server", desc: "Attempts to produce a round end report and then restart the server organically." } });

// admin.dm:461
rt.def("/datum/admins/proc/announce", function* announce(f: Frame) {
	let message: Value = null;
	let $0: any, $1: any;
	if (!check_rights(0)) {
		return f.dot;
	}
	if (message = (yield* g.op(f, "Prompt", [64], [null, null, "Admin Announce", "Global message to send:", null]))) {
		if (!check_rights(16, 0)) {
			message = adminscrub(message, 500);
		}
		$0 = rt.world();
		if (f.usr.client.holder.fakekey) {
			$1 = "Administrator";
		} else {
			$1 = f.usr.key;
		}
		to_chat($0, `<span class='adminnotice'><b>${$1} Announces:</b></span>\n \t ${message}`);
		log_admin(`Announce: ${key_name(f.usr)} : ${message}`);
	}
	return f.dot;
}, true, { verb: { name: "Announce", category: "Special Verbs", desc: "Announce your desires to the world" } });

// admin.dm:476
rt.def("/datum/admins/proc/set_admin_notice", function* set_admin_notice(f: Frame) {
	let new_admin_notice: Value = null;
	if (!check_rights(0)) {
		return f.dot;
	}
	if ((new_admin_notice = (yield* g.op(f, "Prompt", [65], [GLOB.admin_notice, "Set Notice", "Set a public notice for this round. Everyone who joins the server will see it.\n(Leaving it blank will delete the current notice):", f.src, null]))) === null) {
		return f.dot;
	}
	if (new_admin_notice == GLOB.admin_notice) {
		return f.dot;
	}
	if (new_admin_notice == "") {
		message_admins(`${key_name(f.usr)} removed the admin notice.`);
		log_admin(`${key_name(f.usr)} removed the admin notice:\n${GLOB.admin_notice}`);
	} else {
		message_admins(`${key_name(f.usr)} set the admin notice.`);
		log_admin(`${key_name(f.usr)} set the admin notice:\n${new_admin_notice}`);
		to_chat(rt.world(), `<span class ='adminnotice'><b>Admin Notice:</b>\n \t ${new_admin_notice}</span>`);
	}
	GLOB.admin_notice = new_admin_notice;
	return f.dot;
}, true, { verb: { name: "Set Admin Notice", category: "Special Verbs", desc: "Set an announcement that appears to everyone who joins the server. Only lasts this round" } });

// admin.dm:499
rt.def("/datum/admins/proc/toggleooc", function toggleooc(f: Frame) {
	toggle_ooc();
	log_admin(`${key_name(f.usr)} toggled OOC.`);
	message_admins(`${key_name_admin(f.usr)} toggled OOC.`);
	return f.dot;
}, false, { verb: { name: "Toggle OOC", category: "Server", desc: "Toggle dis bitch" } });

// admin.dm:508
rt.def("/datum/admins/proc/toggleoocdead", function toggleoocdead(f: Frame) {
	GLOB.dooc_allowed = (!GLOB.dooc_allowed ? 1 : 0);
	log_admin(`${key_name(f.usr)} toggled OOC.`);
	message_admins(`${key_name_admin(f.usr)} toggled Dead OOC.`);
	return f.dot;
}, false, { verb: { name: "Toggle Dead OOC", category: "Server", desc: "Toggle dis bitch" } });

// admin.dm:518
rt.def("/datum/admins/proc/startnow", function startnow(f: Frame) {
	let msg: Value = null;
	if (GLOB.SSticker.current_state == GAME_STATE_PREGAME || GLOB.SSticker.current_state == GAME_STATE_STARTUP) {
		GLOB.SSticker.start_immediately = GAME_STATE_PREGAME;
		log_admin(`${f.usr.key} has started the game.`);
		msg = "";
		if (GLOB.SSticker.current_state == GAME_STATE_STARTUP) {
			msg = " (The server is still setting up, but the round will be started as soon as possible.)";
		}
		message_admins(`<font color='blue'>${f.usr.key} has started the game.${msg}</font>`);
		return 1;
	} else {
		to_chat(f.usr, "<font color='red'>Error: Start Now: Game has already started.</font>");
	}
	return 0;
}, false, { verb: { name: "Start Now", category: "Server", desc: "Start the round RIGHT NOW" } });

// admin.dm:538
rt.def("/datum/admins/proc/toggleenter", function toggleenter(f: Frame) {
	GLOB.enter_allowed = (!GLOB.enter_allowed ? 1 : 0);
	if (!GLOB.enter_allowed) {
		to_chat(rt.world(), "<B>New players may no longer enter the game.</B>");
	} else {
		to_chat(rt.world(), "<B>New players may now enter the game.</B>");
	}
	log_admin(`${key_name(f.usr)} toggled new player game entering.`);
	message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} toggled new player game entering.</span>`);
	rt.world().update_status();
	return f.dot;
}, false, { verb: { name: "Toggle Entering", category: "Server", desc: "People can't enter" } });

// admin.dm:552
rt.def("/datum/admins/proc/toggleAI", function toggleAI(f: Frame) {
	GLOB.config.allow_ai = (!GLOB.config.allow_ai ? 1 : 0);
	if (!GLOB.config.allow_ai) {
		to_chat(rt.world(), "<B>The AI job is no longer chooseable.</B>");
	} else {
		to_chat(rt.world(), "<B>The AI job is chooseable now.</B>");
	}
	log_admin(`${key_name(f.usr)} toggled AI allowed.`);
	rt.world().update_status();
	return f.dot;
}, false, { verb: { name: "Toggle AI", category: "Server", desc: "People can't be AI" } });

// admin.dm:565
rt.def("/datum/admins/proc/toggleaban", function toggleaban(f: Frame) {
	GLOB.abandon_allowed = (!GLOB.abandon_allowed ? 1 : 0);
	if (GLOB.abandon_allowed) {
		to_chat(rt.world(), "<B>You may now respawn.</B>");
	} else {
		to_chat(rt.world(), "<B>You may no longer respawn :(</B>");
	}
	let $0: any = key_name_admin(f.usr);
	message_admins(`<span class='adminnotice'>${$0} toggled respawn to ${GLOB.abandon_allowed ? "On" : "Off"}.</span>`);
	log_admin(`${key_name(f.usr)} toggled respawn to ${GLOB.abandon_allowed ? "On" : "Off"}.`);
	rt.world().update_status();
	return f.dot;
}, false, { verb: { name: "Toggle Respawn", category: "Server", desc: "Respawn basically" } });

// admin.dm:580
rt.def("/datum/admins/proc/delay", function* delay(f: Frame) {
	let newtime: Value = (yield* g.op(f, "Prompt", [33], [null, round(GLOB.SSticker.GetTimeLeft() / 10), "Set Delay", "Set a new time in seconds. Set -1 for indefinite delay.", null]));
	if (GLOB.SSticker.current_state > GAME_STATE_PREGAME) {
		return (yield* alert("Too late... The game has already started!"));
	}
	if (!newtime) return f.dot;
	GLOB.SSticker.SetTimeLeft(newtime * 10);
	if (newtime < 0) {
		to_chat(rt.world(), "<b>The game start has been delayed.</b>");
		log_admin(`${key_name(f.usr)} delayed the round start.`);
	} else {
		to_chat(rt.world(), `<b>The game will start in ${newtime} seconds.</b>`);
		rt.op(f, "OutputReference", [rt.R.world], [rt.rsc("sound/ai/attention.ogg")], false);
		log_admin(`${key_name(f.usr)} set the pre-game delay to ${newtime} seconds.`);
	}
	return f.dot;
}, true, { verb: { name: "Delay pre-game", category: "Server", desc: "Delay the game start" } });

// admin.dm:597
rt.def("/datum/admins/proc/unprison", function* unprison(f: Frame, M: Value) {
	if (M.z == ZLEVEL_CENTCOM) {
		yield* GLOB.SSjob.SendToLateJoin(M);
		message_admins(`${key_name_admin(f.usr)} has unprisoned ${key_name_admin(M)}`);
		log_admin(`${key_name(f.usr)} has unprisoned ${key_name(M)}`);
	} else {
		yield* alert(`${M.name} is not prisoned.`);
	}
	return f.dot;
}, true, { verb: { name: "Unprison", category: "Admin" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// admin.dm:630
rt.def("/datum/admins/proc/spawn_atom", function* spawn_atom(f: Frame, object: Value) {
	let chosen: Value = null, _T: Value = null, A: Value = null;
	if (!check_rights(4096)) {
		return f.dot;
	}
	if (!(chosen = (yield* pick_closest_path(object)))) {
		return f.dot;
	}
	if (ispath(chosen, T("/turf"))) {
		yield* (_T = rt.getStep(f, f.usr.loc, 0)).ChangeTurf(chosen);
	} else {
		(A = (yield* new_(chosen, f.usr.loc))).admin_spawned = 1;
	}
	log_admin(`${key_name(f.usr)} spawned ${chosen} at (${f.usr.x},${f.usr.y},${f.usr.z})`);
	return f.dot;
}, true, { verb: { name: "Spawn", category: "Debug", desc: "(atom path) Spawn an atom" }, argTypes: [{ type: 2 }] });

// tg_js: Spawn, then asks how many (1-100). A turf is changed once.
rt.def("/datum/admins/proc/spawn_many", function* spawn_many(f: Frame, object: Value) {
	let chosen: Value = null, amount: Value = null, A: Value = null;
	if (!check_rights(4096)) {
		return f.dot;
	}
	if (!(chosen = (yield* pick_closest_path(object)))) {
		return f.dot;
	}
	if (ispath(chosen, T("/turf"))) {
		yield* rt.getStep(f, f.usr.loc, 0).ChangeTurf(chosen);
		amount = 1;
	} else {
		amount = (yield* g.op(f, "Prompt", [33], [null, 5, "Spawn Many", "How many?", null]));
		if (typeof amount !== "number" || amount < 1) {
			return f.dot;
		}
		amount = Math.min(Math.floor(amount), 100);
		for (let i = 0; i < amount; i++) {
			(A = (yield* new_(chosen, f.usr.loc))).admin_spawned = 1;
		}
	}
	log_admin(`${key_name(f.usr)} spawned ${chosen} x ${amount} at (${f.usr.x},${f.usr.y},${f.usr.z})`);
	return f.dot;
}, true, { verb: { name: "Spawn Many", category: "Debug", desc: "(atom path) Spawn several of an atom" }, argTypes: [{ type: 2 }] });

// tg_js: Spawn, then asks for a number of rings N (1-128: from the middle, 128 covers the whole z-level): one on every tile of the square reaching N-1 tiles out from
// the user in every direction (1 = their own tile, 2 = that plus the 8 tiles touching it, 3 = 5x5, ...).
// Walls and other dense turfs are skipped, unless a turf is being spawned (then every tile is changed).
rt.def("/datum/admins/proc/spawn_grid", function* spawn_grid(f: Frame, object: Value) {
	let chosen: Value = null, _T: Value = null, A: Value = null;
	if (!check_rights(4096)) {
		return f.dot;
	}
	if (!(chosen = (yield* pick_closest_path(object)))) {
		return f.dot;
	}
	let size: Value = (yield* g.op(f, "Prompt", [33], [null, 4, "Spawn Rings", "How many rings? (1 = your tile, 2 = 3x3, 3 = 5x5)", null]));
	if (typeof size !== "number" || size < 1 || !f.usr.loc) {
		return f.dot;
	}
	size = Math.min(Math.floor(size), 128) * 2 - 1;
	const is_turf = truthy(ispath(chosen, T("/turf")));
	const ux = f.usr.x, uy = f.usr.y, uz = f.usr.z;
	const x0 = ux - Math.floor(size / 2), y0 = uy - Math.floor(size / 2);
	let amount: Value = 0;
	for (let x = x0; x < x0 + size; x++) {
		for (let y = y0; y < y0 + size; y++) {
			if (!(_T = rt.locate(x, y, uz))) continue;
			if (is_turf) {
				yield* _T.ChangeTurf(chosen);
			} else {
				if (_T.density) continue;
				(A = (yield* new_(chosen, _T))).admin_spawned = 1;
			}
			amount++;
		}
	}
	log_admin(`${key_name(f.usr)} spawned ${chosen} on ${amount} tiles (${size}x${size} square) around (${ux},${uy},${uz})`);
	return f.dot;
}, true, { verb: { name: "Spawn Rings", category: "Debug", desc: "(atom path) Spawn an atom on your tile and the rings of tiles around it" }, argTypes: [{ type: 2 }] });

// admin.dm:652
rt.def("/datum/admins/proc/show_traitor_panel", function* show_traitor_panel(f: Frame, M: Value) {
	if (!rt.istype(M, T("/mob"))) {
		to_chat(f.usr, "This can only be used on instances of type /mob");
		return f.dot;
	}
	if (!M.mind) {
		to_chat(f.usr, "This mob has no mind!");
		return f.dot;
	}
	yield* M.mind.edit_memory();
	return f.dot;
}, true, { verb: { name: "Show Traitor Panel", category: "Admin", desc: "Edit mobs's memory and role" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// admin.dm:667
rt.def("/datum/admins/proc/toggletintedweldhelmets", function toggletintedweldhelmets(f: Frame) {
	GLOB.tinted_weldhelh = (!GLOB.tinted_weldhelh ? 1 : 0);
	if (GLOB.tinted_weldhelh) {
		to_chat(rt.world(), "<B>The tinted_weldhelh has been enabled!</B>");
	} else {
		to_chat(rt.world(), "<B>The tinted_weldhelh has been disabled!</B>");
	}
	log_admin(`${key_name(f.usr)} toggled tinted_weldhelh.`);
	message_admins(`${key_name_admin(f.usr)} toggled tinted_weldhelh.`);
	return f.dot;
}, false, { verb: { name: "Toggle tinted welding helmes", category: "Debug", desc: "Reduces view range when wearing welding helmets" } });

// admin.dm:680
rt.def("/datum/admins/proc/toggleguests", function toggleguests(f: Frame) {
	let $1: any;
	GLOB.guests_allowed = (!GLOB.guests_allowed ? 1 : 0);
	if (!GLOB.guests_allowed) {
		to_chat(rt.world(), "<B>Guests may no longer enter the game.</B>");
	} else {
		to_chat(rt.world(), "<B>Guests may now enter the game.</B>");
	}
	let $0: any = key_name(f.usr);
	if (GLOB.guests_allowed) {
		$1 = "";
	} else {
		$1 = "dis";
	}
	log_admin(`${$0} toggled guests game entering ${$1}allowed.`);
	$0 = key_name_admin(f.usr);
	if (GLOB.guests_allowed) {
		$1 = "";
	} else {
		$1 = "dis";
	}
	message_admins(`<span class='adminnotice'>${$0} toggled guests game entering ${$1}allowed.</span>`);
	return f.dot;
}, false, { verb: { name: "Toggle guests", category: "Server", desc: "Guests can't enter" } });

// admin.dm:691
rt.def("/datum/admins/proc/output_ai_laws", function output_ai_laws(f: Frame) {
	let S: Value = null, R: Value = null;
	let $e: any;
	let ai_number: Value = 0;
	for (S of each(GLOB.mob_list, T("/mob/living/silicon"))) {
		ai_number++;
		if (rt.istype(S, T("/mob/living/silicon/ai"))) {
			to_chat(f.usr, `<b>AI ${key_name(S, f.usr)}'s laws:</b>`);
		} else if (rt.istype(S, T("/mob/living/silicon/robot"))) {
			R = S;
			to_chat(f.usr, `<b>CYBORG ${key_name(S, f.usr)} ${R.connected_ai ? `(Slaved to: ${R.connected_ai})` : "(Independent)"}: laws:</b>`);
		} else if (rt.istype(S, T("/mob/living/silicon/pai"))) {
			to_chat(f.usr, `<b>pAI ${key_name(S, f.usr)}'s laws:</b>`);
		} else {
			to_chat(f.usr, `<b>SOMETHING SILICON ${key_name(S, f.usr)}'s laws:</b>`);
		}
		if (S.laws === null) {
			to_chat(f.usr, `${key_name(S, f.usr)}'s laws are null?? Contact a coder.`);
		} else {
			S.laws.show_laws(f.usr);
		}
	}
	if (ai_number) return f.dot;
	to_chat(f.usr, "<b>No AIs located</b>");
	return f.dot;
});

// admin.dm:719
rt.def("/datum/admins/proc/output_devil_info", function output_devil_info(f: Frame, M: Value) {
	if (is_devil(M)) {
		to_chat(f.usr, GLOB.SSticker.mode.printdevilinfo(M.mind));
	} else {
		to_chat(f.usr, `<b>${M} is not a devil.`);
	}
	return f.dot;
});

// admin.dm:725
rt.def("/datum/admins/proc/manage_free_slots", function* manage_free_slots(f: Frame) {
	let job: Value = null, J_title: Value = null, J_opPos: Value = null, J_totPos: Value = null, winheight: Value = null;
	if (!check_rights()) {
		return f.dot;
	}
	let dat: Value = "<html><head><title>Manage Free Slots</title></head><body>";
	let count: Value = 0;
	if (GLOB.SSticker && !GLOB.SSticker.mode) {
		yield* alert(f.usr, "You cannot manage jobs before the round starts!");
		return f.dot;
	}
	if (GLOB.SSjob) {
		for (job of each(GLOB.SSjob.occupations, T("/datum/job"))) {
			count++;
			J_title = html_encode(job.title);
			J_opPos = html_encode(job.total_positions - (job.total_positions - job.current_positions));
			J_totPos = html_encode(job.total_positions);
			if (job.total_positions < 0) {
				dat += `${J_title}: ${J_opPos}   (unlimited)`;
			} else {
				dat += `${J_title}: ${J_opPos}/${J_totPos}`;
			}
			if (job.title == "AI" || job.title == "Cyborg") {
				dat += "   (Cannot Late Join)<br>";
				continue;
			}
			if (job.total_positions >= 0) {
				dat += fmt("   <A href='?src=＃;addjobslot=＀'>Add</A>  |  ", [f.src, job.title]);
				if (job.total_positions > job.current_positions) {
					dat += fmt("<A href='?src=＃;removejobslot=＀'>Remove</A>  |  ", [f.src, job.title]);
				} else {
					dat += "Remove  |  ";
				}
				dat += fmt("<A href='?src=＃;unlimitjobslot=＀'>Unlimit</A>", [f.src, job.title]);
			} else {
				dat += fmt("   <A href='?src=＃;limitjobslot=＀'>Limit</A>", [f.src, job.title]);
			}
			dat += "<br>";
		}
	}
	dat += "</body>";
	winheight = min((winheight = 100 + count * 20), 690);
	rt.op(f, "Browse", [], [f.usr, dat, `window=players;size=375x${winheight}`], false);
	return f.dot;
}, true);

// admin.dm:778
rt.def("/proc/kick_clients_in_lobby", function* kick_clients_in_lobby(f: Frame, message: Value, kick_only_afk: Value) {
	let C: Value = null;
	kick_only_afk ??= 0;
	let kicked_client_names: Value = list();
	for (C of each(GLOB.clients, T("/client"))) {
		if (rt.istype(C.mob, T("/mob/dead/new_player"))) {
			if (kick_only_afk && !C.is_afk()) {
				continue;
			}
			if (message) {
				to_chat(C, message);
			}
			kicked_client_names.Add(`${C.ckey}`);
			yield* qdel(C);
		}
	}
	return kicked_client_names;
}, true);

// admin.dm:794
rt.def("/datum/admins/proc/cmd_ghost_drag", function* cmd_ghost_drag(f: Frame, frommob: Value, tomob: Value) {
	let ask: Value = null;
	if (!check_rights(1024, 0) || !check_rights(4128, 0)) {
		return 0;
	}
	if (!frommob.ckey) {
		return 0;
	}
	let question: Value = "";
	if (tomob.ckey) {
		question = `This mob already has a user (${tomob.key}) in control of it! `;
	}
	question += `Are you sure you want to place ${frommob.name}(${frommob.key}) in control of ${tomob.name}?`;
	if ((ask = (yield* alert(question, "Place ghost in control of mob?", "Yes", "No"))) != "Yes") {
		return 1;
	}
	if (!frommob || !tomob) {
		return 1;
	}
	yield* tomob.ghostize(0);
	message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} has put ${frommob.ckey} in control of ${tomob.name}.</span>`);
	log_admin(`${key_name(f.usr)} stuffed ${frommob.ckey} into ${tomob.name}.`);
	tomob.ckey = frommob.ckey;
	yield* qdel(frommob);
	return 1;
}, true);

// admin.dm:824
rt.def("/client/proc/adminGreet", function adminGreet(f: Frame, logout: Value) {
	let string: Value = null;
	if (!GLOB.SSticker.HasRoundStarted()) return f.dot;
	if (logout && GLOB.config && GLOB.config.announce_admin_logout) {
		string = pick(`Admin logout: ${key_name(f.src)}`);
	} else if (!logout && GLOB.config && GLOB.config.announce_admin_login && rt.bitAnd(this.prefs.toggles, 1024)) {
		string = pick(`Admin login: ${key_name(f.src)}`);
	}
	if (!string) return f.dot;
	message_admins(`${string}`);
	return f.dot;
});
