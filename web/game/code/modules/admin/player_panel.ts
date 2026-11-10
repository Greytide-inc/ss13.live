// Based on /tg/station's code/modules/admin/player_panel.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// player_panel.dm:2
rt.def("/datum/admins/proc/player_panel_new", function* player_panel_new(f: Frame) {
	let M: Value = null, color: Value = null, is_antagonist: Value = null, M_job: Value = null, O: Value = null, M_name: Value = null, M_rname: Value = null, M_key: Value = null;
	if (!check_rights()) {
		return f.dot;
	}
	let dat: Value = "<html><head><title>Player Panel</title></head>";
	dat += "\n\n\t\t<head>\n\t\t\t<script type='text/javascript'>\n\n\t\t\t\tvar locked_tabs = new Array();\n\n\t\t\t\tfunction updateSearch(){\n\n\n\t\t\t\t\tvar filter_text = document.getElementById('filter');\n\t\t\t\t\tvar filter = filter_text.value.toLowerCase();\n\n\t\t\t\t\tif(complete_list != null && complete_list != \"\"){\n\t\t\t\t\t\tvar mtbl = document.getElementById(\"maintable_data_archive\");\n\t\t\t\t\t\tmtbl.innerHTML = complete_list;\n\t\t\t\t\t}\n\n\t\t\t\t\tif(filter.value == \"\"){\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}else{\n\n\t\t\t\t\t\tvar maintable_data = document.getElementById('maintable_data');\n\t\t\t\t\t\tvar ltr = maintable_data.getElementsByTagName(\"tr\");\n\t\t\t\t\t\tfor ( var i = 0; i < ltr.length; ++i )\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttry{\n\t\t\t\t\t\t\t\tvar tr = ltr[i];\n\t\t\t\t\t\t\t\tif(tr.getAttribute(\"id\").indexOf(\"data\") != 0){\n\t\t\t\t\t\t\t\t\tcontinue;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tvar ltd = tr.getElementsByTagName(\"td\");\n\t\t\t\t\t\t\t\tvar td = ltd[0];\n\t\t\t\t\t\t\t\tvar lsearch = td.getElementsByTagName(\"b\");\n\t\t\t\t\t\t\t\tvar search = lsearch[0];\n\t\t\t\t\t\t\t\t//var inner_span = li.getElementsByTagName(\"span\")[1] //Should only ever contain one element.\n\t\t\t\t\t\t\t\t//document.write(\"<p>\"+search.innerText+\"<br>\"+filter+\"<br>\"+search.innerText.indexOf(filter))\n\t\t\t\t\t\t\t\tif ( search.innerText.toLowerCase().indexOf(filter) == -1 )\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t//document.write(\"a\");\n\t\t\t\t\t\t\t\t\t//ltr.removeChild(tr);\n\t\t\t\t\t\t\t\t\ttd.innerHTML = \"\";\n\t\t\t\t\t\t\t\t\ti--;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}catch(err) {   }\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\n\t\t\t\t\tvar count = 0;\n\t\t\t\t\tvar index = -1;\n\t\t\t\t\tvar debug = document.getElementById(\"debug\");\n\n\t\t\t\t\tlocked_tabs = new Array();\n\n\t\t\t\t}\n\n\t\t\t\tfunction expand(id,job,name,real_name,image,key,ip,antagonist,ref){\n\n\t\t\t\t\tclearAll();\n\n\t\t\t\t\tvar span = document.getElementById(id);\n\t\t\t\t\tvar ckey = key.toLowerCase().replace(/[^a-z@0-9]+/g,\"\");\n\n\t\t\t\t\tbody = \"<table><tr><td>\";\n\n\t\t\t\t\tbody += \"</td><td align='center'>\";\n\n\t\t\t\t\tbody += \"<font size='2'><b>\"+job+\" \"+name+\"</b><br><b>Real name \"+real_name+\"</b><br><b>Played by \"+key+\" (\"+ip+\")</b></font>\"\n\n\t\t\t\t\tbody += \"</td><td align='center'>\";\n\n\t\t\t\t\tbody += \"<a href='?_src_=holder;adminplayeropts=\"+ref+\"'>PP</a> - \"\n\t\t\t\t\tbody += \"<a href='?_src_=holder;showmessageckey=\"+ckey+\"'>N</a> - \"\n\t\t\t\t\tbody += \"<a href='?_src_=vars;Vars=\"+ref+\"'>VV</a> - \"\n\t\t\t\t\tbody += \"<a href='?_src_=holder;traitor=\"+ref+\"'>TP</a> - \"\n\t\t\t\t\tbody += \"<a href='?priv_msg=\"+ckey+\"'>PM</a> - \"\n\t\t\t\t\tbody += \"<a href='?_src_=holder;subtlemessage=\"+ref+\"'>SM</a> - \"\n\t\t\t\t\tbody += \"<a href='?_src_=holder;adminplayerobservefollow=\"+ref+\"'>FLW</a> - \"\n\t\t\t\t\tbody += \"<a href='?_src_=holder;individuallog=\"+ref+\"'>LOGS</a><br>\"\n\t\t\t\t\tif(antagonist > 0)\n\t\t\t\t\t\tbody += \"<font size='2'><a href='?_src_=holder;secrets=check_antagonist'><font color='red'><b>Antagonist</b></font></a></font>\";\n\n\t\t\t\t\tbody += \"</td></tr></table>\";\n\n\n\t\t\t\t\tspan.innerHTML = body\n\t\t\t\t}\n\n\t\t\t\tfunction clearAll(){\n\t\t\t\t\tvar spans = document.getElementsByTagName('span');\n\t\t\t\t\tfor(var i = 0; i < spans.length; i++){\n\t\t\t\t\t\tvar span = spans[i];\n\n\t\t\t\t\t\tvar id = span.getAttribute(\"id\");\n\n\t\t\t\t\t\tif(!(id.indexOf(\"item\")==0))\n\t\t\t\t\t\t\tcontinue;\n\n\t\t\t\t\t\tvar pass = 1;\n\n\t\t\t\t\t\tfor(var j = 0; j < locked_tabs.length; j++){\n\t\t\t\t\t\t\tif(locked_tabs[j]==id){\n\t\t\t\t\t\t\t\tpass = 0;\n\t\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tif(pass != 1)\n\t\t\t\t\t\t\tcontinue;\n\n\n\n\n\t\t\t\t\t\tspan.innerHTML = \"\";\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tfunction addToLocked(id,link_id,notice_span_id){\n\t\t\t\t\tvar link = document.getElementById(link_id);\n\t\t\t\t\tvar decision = link.getAttribute(\"name\");\n\t\t\t\t\tif(decision == \"1\"){\n\t\t\t\t\t\tlink.setAttribute(\"name\",\"2\");\n\t\t\t\t\t}else{\n\t\t\t\t\t\tlink.setAttribute(\"name\",\"1\");\n\t\t\t\t\t\tremoveFromLocked(id,link_id,notice_span_id);\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\n\t\t\t\t\tvar pass = 1;\n\t\t\t\t\tfor(var j = 0; j < locked_tabs.length; j++){\n\t\t\t\t\t\tif(locked_tabs[j]==id){\n\t\t\t\t\t\t\tpass = 0;\n\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tif(!pass)\n\t\t\t\t\t\treturn;\n\t\t\t\t\tlocked_tabs.push(id);\n\t\t\t\t\tvar notice_span = document.getElementById(notice_span_id);\n\t\t\t\t\tnotice_span.innerHTML = \"<font color='red'>Locked</font> \";\n\t\t\t\t\t//link.setAttribute(\"onClick\",\"attempt('\"+id+\"','\"+link_id+\"','\"+notice_span_id+\"');\");\n\t\t\t\t\t//document.write(\"removeFromLocked('\"+id+\"','\"+link_id+\"','\"+notice_span_id+\"')\");\n\t\t\t\t\t//document.write(\"aa - \"+link.getAttribute(\"onClick\"));\n\t\t\t\t}\n\n\t\t\t\tfunction attempt(ab){\n\t\t\t\t\treturn ab;\n\t\t\t\t}\n\n\t\t\t\tfunction removeFromLocked(id,link_id,notice_span_id){\n\t\t\t\t\t//document.write(\"a\");\n\t\t\t\t\tvar index = 0;\n\t\t\t\t\tvar pass = 0;\n\t\t\t\t\tfor(var j = 0; j < locked_tabs.length; j++){\n\t\t\t\t\t\tif(locked_tabs[j]==id){\n\t\t\t\t\t\t\tpass = 1;\n\t\t\t\t\t\t\tindex = j;\n\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tif(!pass)\n\t\t\t\t\t\treturn;\n\t\t\t\t\tlocked_tabs[index] = \"\";\n\t\t\t\t\tvar notice_span = document.getElementById(notice_span_id);\n\t\t\t\t\tnotice_span.innerHTML = \"\";\n\t\t\t\t\t//var link = document.getElementById(link_id);\n\t\t\t\t\t//link.setAttribute(\"onClick\",\"addToLocked('\"+id+\"','\"+link_id+\"','\"+notice_span_id+\"')\");\n\t\t\t\t}\n\n\t\t\t\tfunction selectTextField(){\n\t\t\t\t\tvar filter_text = document.getElementById('filter');\n\t\t\t\t\tfilter_text.focus();\n\t\t\t\t\tfilter_text.select();\n\t\t\t\t}\n\n\t\t\t</script>\n\t\t</head>\n\n\n\t";
	dat += "<body onload='selectTextField(); updateSearch();' onkeyup='updateSearch();'>";
	dat += "\n\n\t\t<table width='560' align='center' cellspacing='0' cellpadding='5' id='maintable'>\n\t\t\t<tr id='title_tr'>\n\t\t\t\t<td align='center'>\n\t\t\t\t\t<font size='5'><b>Player panel</b></font><br>\n\t\t\t\t\tHover over a line to see more information - <a href='?_src_=holder;check_antagonist=1'>Check antagonists</a> - Kick <a href='?_src_=holder;kick_all_from_lobby=1;afkonly=0'>everyone</a>/<a href='?_src_=holder;kick_all_from_lobby=1;afkonly=1'>AFKers</a> in lobby\n\t\t\t\t\t<p>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr id='search_tr'>\n\t\t\t\t<td align='center'>\n\t\t\t\t\t<b>Search:</b> <input type='text' id='filter' value='' style='width:300px;'>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t</table>\n\n\t";
	dat += "\n\t\t<span id='maintable_data_archive'>\n\t\t<table width='560' align='center' cellspacing='0' cellpadding='5' id='maintable_data'>";
	let mobs: Value = (yield* sortmobs());
	let i: Value = 1;
	for (M of each(mobs, T("/mob"))) {
		if (M.ckey) {
			color = "#e6e6e6";
			if (i % 2 == 0) {
				color = "#f2f2f2";
			}
			is_antagonist = is_special_character(M);
			M_job = "";
			if (rt.istype(M, T("/mob/living"))) {
				if (rt.istype(M, T("/mob/living/carbon"))) {
					if (rt.istype(M, T("/mob/living/carbon/human"))) {
						M_job = M.job;
					} else if (rt.istype(M, T("/mob/living/carbon/monkey"))) {
						M_job = "Monkey";
					} else if (rt.istype(M, T("/mob/living/carbon/alien"))) {
						if (rt.istype(M, T("/mob/living/carbon/alien/larva"))) {
							M_job = "Alien larva";
						} else {
							M_job = "Alien";
						}
					} else {
						M_job = "Carbon-based";
					}
				} else if (rt.istype(M, T("/mob/living/silicon"))) {
					if (rt.istype(M, T("/mob/living/silicon/ai"))) {
						M_job = "AI";
					} else if (rt.istype(M, T("/mob/living/silicon/pai"))) {
						M_job = "pAI";
					} else if (rt.istype(M, T("/mob/living/silicon/robot"))) {
						M_job = "Cyborg";
					} else {
						M_job = "Silicon-based";
					}
				} else if (rt.istype(M, T("/mob/living/simple_animal"))) {
					if (rt.istype(M, T("/mob/living/simple_animal/pet/dog/corgi"))) {
						M_job = "Corgi";
					} else if (rt.istype(M, T("/mob/living/simple_animal/slime"))) {
						M_job = "slime";
					} else {
						M_job = "Animal";
					}
				} else {
					M_job = "Living";
				}
			} else if (rt.istype(M, T("/mob/dead/new_player"))) {
				M_job = "New player";
			} else if (rt.istype(M, T("/mob/dead/observer"))) {
				if ((O = M).started_as_observer) {
					M_job = "Observer";
				} else {
					M_job = "Ghost";
				}
			}
			M_name = html_encode(M.name);
			M_rname = html_encode(M.real_name);
			M_key = html_encode(M.key);
			dat += fmt("\n\n\t\t\t\t<tr id='data＀' name='＀' onClick=\"addToLocked('item＀','data＀','notice_span＀')\">\n\t\t\t\t\t<td align='center' bgcolor='＀'>\n\t\t\t\t\t\t<span id='notice_span＀'></span>\n\t\t\t\t\t\t<a id='link＀'\n\t\t\t\t\t\tonmouseover='expand(\"item＀\",\"＀\",\"＀\",\"＀\",\"--unused--\",\"＀\",\"＀\",＀,\"＃\")'\n\t\t\t\t\t\t>\n\t\t\t\t\t\t<b id='search＀'>＀ - ＀ - ＀ (＀)</b>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<br><span id='item＀'></span>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\n\t\t\t", [i, i, i, i, i, color, i, i, i, M_job, M_name, M_rname, M_key, M.lastKnownIP, is_antagonist, M, i, M_name, M_rname, M_key, M_job, i]);
			i++;
		}
	}
	dat += "\n\t\t</table>\n\t\t</span>\n\n\t\t<script type='text/javascript'>\n\t\t\tvar maintable = document.getElementById(\"maintable_data_archive\");\n\t\t\tvar complete_list = maintable.innerHTML;\n\t\t</script>\n\t</body></html>\n\t";
	rt.op(f, "Browse", [], [f.usr, dat, "window=players;size=600x480"], false);
	return f.dot;
}, true);

// player_panel.dm:313
rt.def("/datum/admins/proc/check_antagonists", function* check_antagonists(f: Frame) {
	let dat: Value = null, timeleft: Value = null, connected_players: Value = null, lobby_players: Value = null, observers: Value = null, observers_connected: Value = null, living_players: Value = null, living_players_connected: Value = null, living_players_antagonist: Value = null, brains: Value = null, other_players: Value = null, living_skipped: Value = null, drones: Value = null, M: Value = null, N: Value = null, M_13: Value = null, disk_loc: Value = null, M_14: Value = null, O: Value = null, mob_loc: Value = null, G: Value = null, N_13: Value = null, changeling: Value = null, wizard: Value = null, apprentice: Value = null, traitor: Value = null, abductor: Value = null, E: Value = null, abductee: Value = null, X: Value = null, devil: Value = null, devilinfo: Value = null, sintouched: Value = null, blob_minds: Value = null, B: Value = null, mode: Value = null, blob: Value = null, eek: Value = null, M_15: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $e: any;
	if (GLOB.SSticker.HasRoundStarted()) {
		dat = "<html><head><title>Round Status</title></head><body><h1><B>Round Status</B></h1>";
		if (GLOB.SSticker.mode.replacementmode) {
			dat += `Former Game Mode: <B>${GLOB.SSticker.mode.name}</B><BR>`;
			dat += `Replacement Game Mode: <B>${GLOB.SSticker.mode.replacementmode.name}</B><BR>`;
		} else {
			dat += `Current Game Mode: <B>${GLOB.SSticker.mode.name}</B><BR>`;
		}
		dat += `Round Duration: <B>${round(rt.worldTime(f) / 36000)}:${add_zero(`${rt.worldTime(f) / 600 % 60}`, 2)}:${rt.worldTime(f) / 100 % 6}${rt.worldTime(f) / 100 % 10}</B><BR>`;
		dat += "<B>Emergency shuttle</B><BR>";
		if (GLOB.SSshuttle.emergency && (GLOB.SSshuttle.emergency.mode == "idle" || GLOB.SSshuttle.emergency.mode == "recall")) {
			dat += "<a href='?_src_=holder;call_shuttle=1'>Call Shuttle</a><br>";
		} else {
			timeleft = GLOB.SSshuttle.emergency.timeLeft();
			if (GLOB.SSshuttle.emergency.mode == "call") {
				dat += `ETA: <a href='?_src_=holder;edit_shuttle_time=1'>${timeleft / 60 % 60}:${add_zero(num2text(timeleft % 60), 2)}</a><BR>`;
				dat += "<a href='?_src_=holder;call_shuttle=2'>Send Back</a><br>";
			} else {
				dat += `ETA: <a href='?_src_=holder;edit_shuttle_time=1'>${timeleft / 60 % 60}:${add_zero(num2text(timeleft % 60), 2)}</a><BR>`;
			}
		}
		dat += "<B>Continuous Round Status</B><BR>";
		if (rt.index(GLOB.config.continuous, GLOB.SSticker.mode.config_tag)) {
			$0 = "Continue if antagonists die";
		} else {
			$0 = "End on antagonist death";
		}
		dat += `<a href='?_src_=holder;toggle_continuous=1'>${$0}</a>`;
		if (rt.index(GLOB.config.continuous, GLOB.SSticker.mode.config_tag)) {
			if (rt.index(GLOB.config.midround_antag, GLOB.SSticker.mode.config_tag)) {
				$0 = "creating replacement antagonists";
			} else {
				$0 = "not creating new antagonists";
			}
			dat += `, <a href='?_src_=holder;toggle_midround_antag=1'>${$0}</a><BR>`;
		} else {
			dat += "<BR>";
		}
		if (rt.index(GLOB.config.midround_antag, GLOB.SSticker.mode.config_tag)) {
			dat += `Time limit: <a href='?_src_=holder;alter_midround_time_limit=1'>${GLOB.config.midround_antag_time_check} minutes into round</a><BR>`;
			dat += `Living crew limit: <a href='?_src_=holder;alter_midround_life_limit=1'>${GLOB.config.midround_antag_life_check * 100}% of crew alive</a><BR>`;
			if (GLOB.SSticker.mode.round_ends_with_antag_death) {
				$0 = "End The Round";
			} else {
				$0 = "Continue As Extended";
			}
			dat += `If limits past: <a href='?_src_=holder;toggle_noncontinuous_behavior=1'>${$0}</a><BR>`;
		}
		dat += fmt("<a href='?_src_=holder;end_round=＃'>End Round Now</a><br>", [f.usr]);
		if (GLOB.SSticker.delay_end) {
			$0 = "End Round Normally";
		} else {
			$0 = "Delay Round End";
		}
		dat += `<a href='?_src_=holder;delay_round_end=1'>${$0}</a>`;
		connected_players = rt.len(f, GLOB.clients);
		lobby_players = 0;
		observers = 0;
		observers_connected = 0;
		living_players = 0;
		living_players_connected = 0;
		living_players_antagonist = 0;
		brains = 0;
		other_players = 0;
		living_skipped = 0;
		drones = 0;
		for (M of each(GLOB.mob_list, T("/mob"))) {
			if (M.ckey) {
				if (rt.istype(M, T("/mob/dead/new_player"))) {
					lobby_players++;
					continue;
				}
				if (M.stat != 2 && M.mind && !rt.istype(M, T("/mob/living/brain"))) {
					if (rt.istype(M, T("/mob/living/simple_animal/drone"))) {
						drones++;
						continue;
					}
					if (M.z == ZLEVEL_CENTCOM) {
						living_skipped++;
						continue;
					}
					living_players++;
					if (M.mind.special_role) {
						living_players_antagonist++;
					}
					if (M.client) {
						living_players_connected++;
					}
				} else if (M.stat == 2 || rt.istype(M, T("/mob/dead/observer"))) {
					observers++;
					if (M.client) {
						observers_connected++;
					}
				} else if (rt.istype(M, T("/mob/living/brain"))) {
					brains++;
				} else {
					other_players++;
				}
			}
		}
		dat += `<BR><b><font color='blue' size='3'>Players:|${connected_players - lobby_players} ingame|${connected_players} connected|${lobby_players} lobby|</font></b>`;
		dat += `<BR><b><font color='green'>Living Players:|${living_players_connected} active|${living_players - living_players_connected} disconnected|${living_players_antagonist} antagonists|</font></b>`;
		dat += `<BR><b><font color='#bf42f4'>SKIPPED [On centcom Z-level]: ${living_skipped} living players|${drones} living drones|</font></b>`;
		dat += `<BR><b><font color='red'>Dead/Observing players:|${observers_connected} active|${observers - observers_connected} disconnected|${brains} brains|</font></b>`;
		if (other_players) {
			dat += `<BR><span class='userdanger'>${other_players} players in invalid state or the statistics code is bugged!</span>`;
		}
		dat += "<BR>";
		if (rt.len(f, GLOB.SSticker.mode.syndicates)) {
			dat += "<br><table cellspacing=5><tr><td><B>Syndicates</B></td><td></td></tr>";
			for (N of each(GLOB.SSticker.mode.syndicates, T("/datum/mind"))) {
				if (M_13 = N.current) {
					$0 = M_13;
					$1 = M_13.real_name;
					if (M_13.client) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (M_13.stat == 2) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat += fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]);
					dat += `<td><A href='?priv_msg=${M_13.ckey}'>PM</A></td>`;
					dat += fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td></tr>", [M_13]);
				} else {
					dat += fmt("<tr><td><i><a href='?_src_=vars;Vars=＃'>＀(＀)</a> Nuclear Operative Body destroyed!</i></td>", [N, N.name, N.key]);
					dat += `<td><A href='?priv_msg=${N.key}'>PM</A></td></tr>`;
				}
			}
			dat += "</table><br><table><tr><td><B>Nuclear Disk(s)</B></td></tr>";
			N = null;
			for (N of each(GLOB.poi_list, T("/obj/item/weapon/disk/nuclear"))) {
				dat += `<tr><td>${N.name}, `;
				disk_loc = N.loc;
				while (!isturf(disk_loc)) {
					if (ismob(disk_loc)) {
						dat += fmt("carried by <a href='?_src_=holder;adminplayeropts=＃'>＀</a> ", [(M_14 = disk_loc), M_14.real_name]);
					}
					if (rt.istype(disk_loc, T("/obj"))) {
						dat += fmt("in ＇！ ", [(O = disk_loc).name]);
					}
					disk_loc = disk_loc.loc;
				}
				dat += `in ${disk_loc.loc} at (${disk_loc.x}, ${disk_loc.y}, ${disk_loc.z})</td></tr>`;
			}
			dat += "</table>";
		}
		if (rt.len(f, GLOB.SSticker.mode.head_revolutionaries) || rt.len(f, GLOB.SSticker.mode.revolutionaries)) {
			dat += "<br><table cellspacing=5><tr><td><B>Revolutionaries</B></td><td></td></tr>";
			N = null;
			for (N of each(GLOB.SSticker.mode.head_revolutionaries, T("/datum/mind"))) {
				if (!(M_13 = N.current)) {
					dat += fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Head Revolutionary body destroyed!</i></td>", [N, N.name, N.key]);
					dat += `<td><A href='?priv_msg=${N.key}'>PM</A></td></tr>`;
				} else {
					$0 = M_13;
					$1 = M_13.real_name;
					if (M_13.client) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (M_13.stat == 2) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat += fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a> <b>(Leader)</b>＀＀</td>", [$0, $1, $2, $3]);
					dat += `<td><A href='?priv_msg=${M_13.ckey}'>PM</A></td>`;
					dat += fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td></tr>", [M_13]);
				}
			}
			N = null;
			for (N of each(GLOB.SSticker.mode.revolutionaries, T("/datum/mind"))) {
				if (M_13 = N.current) {
					$0 = M_13;
					$1 = M_13.real_name;
					if (M_13.client) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (M_13.stat == 2) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat += fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]);
					dat += `<td><A href='?priv_msg=${M_13.ckey}'>PM</A></td>`;
					dat += fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td></tr>", [M_13]);
				}
			}
			dat += "</table><table cellspacing=5><tr><td><B>Target(s)</B></td><td></td><td><B>Location</B></td></tr>";
			N = null;
			for (N of each(GLOB.SSticker.mode.get_living_heads(), T("/datum/mind"))) {
				if (M_13 = N.current) {
					$0 = M_13;
					$1 = M_13.real_name;
					if (M_13.client) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (M_13.stat == 2) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat += fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]);
					dat += `<td><A href='?priv_msg=${M_13.ckey}'>PM</A></td>`;
					dat += fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td>", [M_13]);
					dat += `<td>${(mob_loc = rt.getStep(f, M_13, 0)).loc}</td></tr>`;
				} else {
					dat += fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Head body destroyed!</i></td>", [N, N.name, N.key]);
					dat += `<td><A href='?priv_msg=${N.key}'>PM</A></td></tr>`;
				}
			}
			dat += "</table>";
		}
		for (G of each(GLOB.SSticker.mode.gangs, T("/datum/gang"))) {
			dat += `<br><table cellspacing=5><tr><td><B>${G.name} Gang: ${round(rt.len(f, G.territory) / GLOB.start_state.num_territories * 100, 1)}% Control</B></td><td></td></tr>`;
			N_13 = null;
			for (N_13 of each(G.bosses, T("/datum/mind"))) {
				if (!(M_14 = N_13.current)) {
					dat += fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Gang Boss body destroyed!</i></td>", [N_13, N_13.name, N_13.key]);
					dat += `<td><A href='?priv_msg=${N_13.key}'>PM</A></td></tr>`;
				} else {
					$0 = M_14;
					$1 = M_14.real_name;
					if (M_14.client) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (M_14.stat == 2) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat += fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a> <b>(Boss)</b>＀＀</td>", [$0, $1, $2, $3]);
					dat += `<td><A href='?priv_msg=${M_14.ckey}'>PM</A></td>`;
					dat += fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td></tr>", [M_14]);
				}
			}
			N_13 = null;
			for (N_13 of each(G.gangsters, T("/datum/mind"))) {
				if (M_14 = N_13.current) {
					$0 = M_14;
					$1 = M_14.real_name;
					if (M_14.client) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (M_14.stat == 2) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat += fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]);
					dat += `<td><A href='?priv_msg=${M_14.ckey}'>PM</A></td></tr>`;
				}
			}
			dat += "</table>";
		}
		if (rt.len(f, GLOB.SSticker.mode.changelings) > 0) {
			dat += "<br><table cellspacing=5><tr><td><B>Changelings</B></td><td></td><td></td></tr>";
			for (changeling of each(GLOB.SSticker.mode.changelings, T("/datum/mind"))) {
				if (M_13 = changeling.current) {
					$0 = M_13.mind.changeling.changelingID;
					$1 = M_13;
					$2 = M_13.real_name;
					if (M_13.client) {
						$3 = "";
					} else {
						$3 = " <i>(No Client)</i>";
					}
					if (M_13.stat == 2) {
						$4 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$4 = "";
					}
					dat += fmt("<tr><td>＀ as <a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3, $4]);
					dat += `<td><A href='?priv_msg=${M_13.ckey}'>PM</A></td>`;
					dat += fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td>", [M_13]);
					dat += fmt("<td><A HREF='?_src_=holder;traitor=＃'>Show Objective</A></td></tr>", [M_13]);
				} else {
					dat += fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Changeling body destroyed!</i></td>", [changeling, changeling.name, changeling.key]);
					dat += `<td><A href='?priv_msg=${changeling.key}'>PM</A></td></tr>`;
				}
			}
			dat += "</table>";
		}
		if (rt.len(f, GLOB.SSticker.mode.wizards) > 0) {
			dat += "<br><table cellspacing=5><tr><td><B>Wizards</B></td><td></td><td></td></tr>";
			for (wizard of each(GLOB.SSticker.mode.wizards, T("/datum/mind"))) {
				if (M_13 = wizard.current) {
					$0 = M_13;
					$1 = M_13.real_name;
					if (M_13.client) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (M_13.stat == 2) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat += fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]);
					dat += `<td><A href='?priv_msg=${M_13.ckey}'>PM</A></td>`;
					dat += fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td>", [M_13]);
					dat += fmt("<td><A HREF='?_src_=holder;traitor=＃'>Show Objective</A></td></tr>", [M_13]);
				} else {
					dat += fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Wizard body destroyed!</i></td></tr>", [wizard, wizard.name, wizard.key]);
					dat += `<td><A href='?priv_msg=${wizard.key}'>PM</A></td></tr>`;
				}
			}
			dat += "</table>";
		}
		if (rt.len(f, GLOB.SSticker.mode.apprentices) > 0) {
			dat += "<br><table cellspacing=5><tr><td><B>Apprentice</B></td><td></td><td></td></tr>";
			for (apprentice of each(GLOB.SSticker.mode.apprentices, T("/datum/mind"))) {
				if (M_13 = apprentice.current) {
					$0 = M_13;
					$1 = M_13.real_name;
					if (M_13.client) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (M_13.stat == 2) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat += fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]);
					dat += `<td><A href='?priv_msg=${M_13.ckey}'>PM</A></td>`;
					dat += fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td>", [M_13]);
					dat += fmt("<td><A HREF='?_src_=holder;traitor=＃'>Show Objective</A></td></tr>", [M_13]);
				} else {
					dat += fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Apprentice body destroyed!!</i></td></tr>", [apprentice, apprentice.name, apprentice.key]);
					dat += `<td><A href='?priv_msg=${apprentice.key}'>PM</A></td></tr>`;
				}
			}
			dat += "</table>";
		}
		if (rt.len(f, GLOB.SSticker.mode.cult)) {
			dat += "<br><table cellspacing=5><tr><td><B>Cultists</B></td><td></td></tr>";
			N = null;
			for (N of each(GLOB.SSticker.mode.cult, T("/datum/mind"))) {
				if (M_13 = N.current) {
					$0 = M_13;
					$1 = M_13.real_name;
					if (N.has_antag_datum(T("/datum/antagonist/cult/master"))) {
						$2 = "<i><font color=red> [Master]</font></i>";
					} else {
						$2 = "";
					}
					if (M_13.client) {
						$3 = "";
					} else {
						$3 = " <i>(No Client)</i>";
					}
					if (M_13.stat == 2) {
						$4 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$4 = "";
					}
					dat += fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀＀</td>", [$0, $1, $2, $3, $4]);
					dat += `<td><A href='?priv_msg=${M_13.ckey}'>PM</A></td>`;
					dat += fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td></tr>", [M_13]);
				}
			}
			dat += "</table>";
		}
		if (rt.len(f, GLOB.SSticker.mode.servants_of_ratvar)) {
			dat += "<br><table cellspacing=5><tr><td><B>Servants of Ratvar</B></td><td></td></tr>";
			N = null;
			for (N of each(GLOB.SSticker.mode.servants_of_ratvar, T("/datum/mind"))) {
				if (M_13 = N.current) {
					$0 = M_13;
					$1 = M_13.real_name;
					if (M_13.client) {
						$2 = "";
					} else {
						$2 = " <i>(ghost)</i>";
					}
					if (M_13.stat == 2) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat += fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]);
					dat += `<td><A href='?priv_msg=${M_13.ckey}'>PM</A></td>`;
					dat += fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td></tr>", [M_13]);
				}
			}
			dat += "</table>";
		}
		if (rt.len(f, GLOB.SSticker.mode.traitors) > 0) {
			dat += "<br><table cellspacing=5><tr><td><B>Traitors</B></td><td></td><td></td></tr>";
			for (traitor of each(GLOB.SSticker.mode.traitors, T("/datum/mind"))) {
				if (M_13 = traitor.current) {
					$0 = M_13;
					$1 = M_13.real_name;
					if (M_13.client) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (M_13.stat == 2) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat += fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]);
					dat += `<td><A href='?priv_msg=${M_13.ckey}'>PM</A></td>`;
					dat += fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td>", [M_13]);
					dat += fmt("<td><A HREF='?_src_=holder;traitor=＃'>Show Objective</A></td></tr>", [M_13]);
				} else {
					dat += fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Traitor body destroyed!</i></td>", [traitor, traitor.name, traitor.key]);
					dat += `<td><A href='?priv_msg=${traitor.key}'>PM</A></td></tr>`;
				}
			}
			dat += "</table>";
		}
		if (rt.len(f, GLOB.SSticker.mode.abductors)) {
			dat += "<br><table cellspacing=5><tr><td><B>Abductors</B></td><td></td><td></td></tr>";
			for (abductor of each(GLOB.SSticker.mode.abductors, T("/datum/mind"))) {
				if (M_13 = abductor.current) {
					$0 = M_13;
					$1 = M_13.real_name;
					if (M_13.client) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (M_13.stat == 2) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat += fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]);
					dat += `<td><A href='?priv_msg=${M_13.ckey}'>PM</A></td>`;
					dat += fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td>", [M_13]);
					dat += fmt("<td><A HREF='?_src_=holder;traitor=＃'>Show Objective</A></td></tr>", [M_13]);
				} else {
					dat += fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Abductor body destroyed!</i></td></tr>", [abductor, abductor.name, abductor.key]);
					dat += `<td><A href='?priv_msg=${abductor.key}'>PM</A></td>`;
				}
			}
			dat += "</table>";
			dat += "<br><table cellspacing=5><tr><td><B>Abductees</B></td><td></td><td></td></tr>";
			for (E of each(GLOB.machines, T("/obj/machinery/abductor/experiment"))) {
				abductee = null;
				for (abductee of each(E.abductee_minds, T("/datum/mind"))) {
					if (M_14 = abductee.current) {
						$0 = M_14;
						$1 = M_14.real_name;
						if (M_14.client) {
							$2 = "";
						} else {
							$2 = " <i>(No Client)</i>";
						}
						if (M_14.stat == 2) {
							$3 = " <b><font color=red>(DEAD)</font></b>";
						} else {
							$3 = "";
						}
						dat += fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]);
						dat += `<td><A href='?priv_msg=${M_14.ckey}'>PM</A></td>`;
						dat += fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td>", [M_14]);
						dat += fmt("<td><A HREF='?_src_=holder;traitor=＃'>Show Objective</A></td></tr>", [M_14]);
					} else {
						dat += fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Abductee body destroyed!</i></td>", [abductee, abductee.name, abductee.key]);
						dat += `<td><A href='?priv_msg=${abductee.key}'>PM</A></td></tr>`;
					}
				}
			}
			dat += "</table>";
		}
		if (rt.len(f, GLOB.SSticker.mode.devils)) {
			dat += "<br><table cellspacing=5><tr><td><B>devils</B></td><td></td><td></td></tr>";
			for (X of each(GLOB.SSticker.mode.devils)) {
				devil = X;
				M_14 = devil.current;
				devilinfo = devil.has_antag_datum(T("/datum/antagonist/devil"));
				if (M_14) {
					$0 = M_14;
					$1 = M_14.real_name;
					$2 = devilinfo.truename;
					if (M_14.client) {
						$3 = "";
					} else {
						$3 = " <i>(No Client)</i>";
					}
					if (M_14.stat == 2) {
						$4 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$4 = "";
					}
					dat += fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀ : ＀</a>＀＀</td>", [$0, $1, $2, $3, $4]);
					dat += `<td><A href='?priv_msg=${M_14.ckey}'>PM</A></td>`;
					dat += fmt("<td><A HREF='?_src_=holder;traitor=＃'>Show Objective</A></td></tr>", [M_14]);
					dat += fmt("<td><A HREF='?_src_=holder;admincheckdevilinfo=＃'>Show all devil info</A></td></tr>", [M_14]);
				} else {
					dat += fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀ :  ＀ (＀)</a><i>devil body destroyed!</i></td></tr>", [devil, devil.name, devilinfo.truename, devil.key]);
					dat += `<td><A href='?priv_msg=${devil.key}'>PM</A></td>`;
				}
			}
			dat += "</table>";
		}
		if (rt.len(f, GLOB.SSticker.mode.sintouched)) {
			dat += "<br><table cellspacing=5><tr><td><B>sintouched</B></td><td></td><td></td></tr>";
			X = null;
			for (X of each(GLOB.SSticker.mode.sintouched)) {
				sintouched = X;
				if (M_14 = sintouched.current) {
					$0 = M_14;
					$1 = M_14.real_name;
					if (M_14.client) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (M_14.stat == 2) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat += fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]);
					dat += `<td><A href='?priv_msg=${M_14.ckey}'>PM</A></td>`;
					dat += fmt("<td><A HREF='?_src_=holder;traitor=＃'>Show Objective</A></td></tr>", [M_14]);
				} else {
					dat += fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>sintouched body destroyed!</i></td></tr>", [sintouched, sintouched.name, sintouched.key]);
					dat += `<td><A href='?priv_msg=${sintouched.key}'>PM</A></td>`;
				}
			}
			dat += "</table>";
		}
		blob_minds = list();
		for (B of each(GLOB.mob_list, T("/mob/camera/blob"))) {
			(blob_minds = rt.modify(blob_minds, B.mind, rt.bitOr));
		}
		if (rt.istype(GLOB.SSticker.mode, T("/datum/game_mode/blob")) || rt.len(f, blob_minds)) {
			dat += "<br><table cellspacing=5><tr><td><B>Blob</B></td><td></td><td></td></tr>";
			if (rt.istype(GLOB.SSticker.mode, T("/datum/game_mode/blob"))) {
				(blob_minds = rt.modify(blob_minds, (mode = GLOB.SSticker.mode).blob_overminds, rt.bitOr));
				dat += `<tr><td><i>Progress: ${rt.len(f, GLOB.blobs_legit)}/${mode.blobwincount}</i></td></tr>`;
			}
			for (blob of each(blob_minds, T("/datum/mind"))) {
				if (M_14 = blob.current) {
					$0 = M_14;
					$1 = M_14.real_name;
					if (M_14.client) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (M_14.stat == 2) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat += fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]);
					dat += `<td><A href='?priv_msg=${M_14.ckey}'>PM</A></td>`;
					dat += fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td></tr>", [M_14]);
				} else {
					dat += fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Blob not found!</i></td>", [blob, blob.name, blob.key]);
					dat += `<td><A href='?priv_msg=${blob.key}'>PM</A></td></tr>`;
				}
			}
			dat += "</table>";
		}
		if (rt.istype(GLOB.SSticker.mode, T("/datum/game_mode/monkey"))) {
			mode = GLOB.SSticker.mode;
			dat += "<br><table cellspacing=5><tr><td><B>Monkey</B></td><td></td><td></td></tr>";
			for (eek of each(mode.ape_infectees, T("/datum/mind"))) {
				if (M_15 = eek.current) {
					$0 = M_15;
					$1 = M_15.real_name;
					if (M_15.client) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (M_15.stat == 2) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat += fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]);
					dat += `<td><A href='?priv_msg=${M_15.ckey}'>PM</A></td>`;
					dat += fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td></tr>", [M_15]);
				} else {
					dat += fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Monkey not found!</i></td>", [eek, eek.name, eek.key]);
					dat += `<td><A href='?priv_msg=${eek.key}'>PM</A></td></tr>`;
				}
			}
			dat += "</table>";
		}
		dat += "</body></html>";
		rt.op(f, "Browse", [], [f.usr, dat, "window=roundstatus;size=420x500"], false);
	} else {
		yield* alert("The game hasn't started yet!");
	}
	return f.dot;
}, true);
