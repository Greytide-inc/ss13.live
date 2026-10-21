// From code/modules/admin/player_panel.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/admins/proc/player_panel_new  (code/modules/admin/player_panel.dm:2)  may sleep
rt.def("/datum/admins/proc/player_panel_new", function* player_panel_new(f: Frame) {
	let dat: Value = null, mobs: Value = null, i: Value = null, M: Value = null, color: Value = null, is_antagonist: Value = null, M_job: Value = null, O: Value = null, M_name: Value = null, M_rname: Value = null, M_key: Value = null;
	let $e: any;
	f.vars = () => [dat, mobs, i, M, color, is_antagonist, M_job, O, M_name, M_rname, M_key, $e];
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [])))) {
		return live(f.dot);
	}
	dat = "<html><head><title>Player Panel</title></head>";
	dat = rt.modify(live(dat), "\n\n\t\t<head>\n\t\t\t<script type='text/javascript'>\n\n\t\t\t\tvar locked_tabs = new Array();\n\n\t\t\t\tfunction updateSearch(){\n\n\n\t\t\t\t\tvar filter_text = document.getElementById('filter');\n\t\t\t\t\tvar filter = filter_text.value.toLowerCase();\n\n\t\t\t\t\tif(complete_list != null && complete_list != \"\"){\n\t\t\t\t\t\tvar mtbl = document.getElementById(\"maintable_data_archive\");\n\t\t\t\t\t\tmtbl.innerHTML = complete_list;\n\t\t\t\t\t}\n\n\t\t\t\t\tif(filter.value == \"\"){\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}else{\n\n\t\t\t\t\t\tvar maintable_data = document.getElementById('maintable_data');\n\t\t\t\t\t\tvar ltr = maintable_data.getElementsByTagName(\"tr\");\n\t\t\t\t\t\tfor ( var i = 0; i < ltr.length; ++i )\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttry{\n\t\t\t\t\t\t\t\tvar tr = ltr[i];\n\t\t\t\t\t\t\t\tif(tr.getAttribute(\"id\").indexOf(\"data\") != 0){\n\t\t\t\t\t\t\t\t\tcontinue;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tvar ltd = tr.getElementsByTagName(\"td\");\n\t\t\t\t\t\t\t\tvar td = ltd[0];\n\t\t\t\t\t\t\t\tvar lsearch = td.getElementsByTagName(\"b\");\n\t\t\t\t\t\t\t\tvar search = lsearch[0];\n\t\t\t\t\t\t\t\t//var inner_span = li.getElementsByTagName(\"span\")[1] //Should only ever contain one element.\n\t\t\t\t\t\t\t\t//document.write(\"<p>\"+search.innerText+\"<br>\"+filter+\"<br>\"+search.innerText.indexOf(filter))\n\t\t\t\t\t\t\t\tif ( search.innerText.toLowerCase().indexOf(filter) == -1 )\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t//document.write(\"a\");\n\t\t\t\t\t\t\t\t\t//ltr.removeChild(tr);\n\t\t\t\t\t\t\t\t\ttd.innerHTML = \"\";\n\t\t\t\t\t\t\t\t\ti--;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}catch(err) {   }\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\n\t\t\t\t\tvar count = 0;\n\t\t\t\t\tvar index = -1;\n\t\t\t\t\tvar debug = document.getElementById(\"debug\");\n\n\t\t\t\t\tlocked_tabs = new Array();\n\n\t\t\t\t}\n\n\t\t\t\tfunction expand(id,job,name,real_name,image,key,ip,antagonist,ref){\n\n\t\t\t\t\tclearAll();\n\n\t\t\t\t\tvar span = document.getElementById(id);\n\t\t\t\t\tvar ckey = key.toLowerCase().replace(/[^a-z@0-9]+/g,\"\");\n\n\t\t\t\t\tbody = \"<table><tr><td>\";\n\n\t\t\t\t\tbody += \"</td><td align='center'>\";\n\n\t\t\t\t\tbody += \"<font size='2'><b>\"+job+\" \"+name+\"</b><br><b>Real name \"+real_name+\"</b><br><b>Played by \"+key+\" (\"+ip+\")</b></font>\"\n\n\t\t\t\t\tbody += \"</td><td align='center'>\";\n\n\t\t\t\t\tbody += \"<a href='?_src_=holder;adminplayeropts=\"+ref+\"'>PP</a> - \"\n\t\t\t\t\tbody += \"<a href='?_src_=holder;showmessageckey=\"+ckey+\"'>N</a> - \"\n\t\t\t\t\tbody += \"<a href='?_src_=vars;Vars=\"+ref+\"'>VV</a> - \"\n\t\t\t\t\tbody += \"<a href='?_src_=holder;traitor=\"+ref+\"'>TP</a> - \"\n\t\t\t\t\tbody += \"<a href='?priv_msg=\"+ckey+\"'>PM</a> - \"\n\t\t\t\t\tbody += \"<a href='?_src_=holder;subtlemessage=\"+ref+\"'>SM</a> - \"\n\t\t\t\t\tbody += \"<a href='?_src_=holder;adminplayerobservefollow=\"+ref+\"'>FLW</a> - \"\n\t\t\t\t\tbody += \"<a href='?_src_=holder;individuallog=\"+ref+\"'>LOGS</a><br>\"\n\t\t\t\t\tif(antagonist > 0)\n\t\t\t\t\t\tbody += \"<font size='2'><a href='?_src_=holder;secrets=check_antagonist'><font color='red'><b>Antagonist</b></font></a></font>\";\n\n\t\t\t\t\tbody += \"</td></tr></table>\";\n\n\n\t\t\t\t\tspan.innerHTML = body\n\t\t\t\t}\n\n\t\t\t\tfunction clearAll(){\n\t\t\t\t\tvar spans = document.getElementsByTagName('span');\n\t\t\t\t\tfor(var i = 0; i < spans.length; i++){\n\t\t\t\t\t\tvar span = spans[i];\n\n\t\t\t\t\t\tvar id = span.getAttribute(\"id\");\n\n\t\t\t\t\t\tif(!(id.indexOf(\"item\")==0))\n\t\t\t\t\t\t\tcontinue;\n\n\t\t\t\t\t\tvar pass = 1;\n\n\t\t\t\t\t\tfor(var j = 0; j < locked_tabs.length; j++){\n\t\t\t\t\t\t\tif(locked_tabs[j]==id){\n\t\t\t\t\t\t\t\tpass = 0;\n\t\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tif(pass != 1)\n\t\t\t\t\t\t\tcontinue;\n\n\n\n\n\t\t\t\t\t\tspan.innerHTML = \"\";\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tfunction addToLocked(id,link_id,notice_span_id){\n\t\t\t\t\tvar link = document.getElementById(link_id);\n\t\t\t\t\tvar decision = link.getAttribute(\"name\");\n\t\t\t\t\tif(decision == \"1\"){\n\t\t\t\t\t\tlink.setAttribute(\"name\",\"2\");\n\t\t\t\t\t}else{\n\t\t\t\t\t\tlink.setAttribute(\"name\",\"1\");\n\t\t\t\t\t\tremoveFromLocked(id,link_id,notice_span_id);\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\n\t\t\t\t\tvar pass = 1;\n\t\t\t\t\tfor(var j = 0; j < locked_tabs.length; j++){\n\t\t\t\t\t\tif(locked_tabs[j]==id){\n\t\t\t\t\t\t\tpass = 0;\n\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tif(!pass)\n\t\t\t\t\t\treturn;\n\t\t\t\t\tlocked_tabs.push(id);\n\t\t\t\t\tvar notice_span = document.getElementById(notice_span_id);\n\t\t\t\t\tnotice_span.innerHTML = \"<font color='red'>Locked</font> \";\n\t\t\t\t\t//link.setAttribute(\"onClick\",\"attempt('\"+id+\"','\"+link_id+\"','\"+notice_span_id+\"');\");\n\t\t\t\t\t//document.write(\"removeFromLocked('\"+id+\"','\"+link_id+\"','\"+notice_span_id+\"')\");\n\t\t\t\t\t//document.write(\"aa - \"+link.getAttribute(\"onClick\"));\n\t\t\t\t}\n\n\t\t\t\tfunction attempt(ab){\n\t\t\t\t\treturn ab;\n\t\t\t\t}\n\n\t\t\t\tfunction removeFromLocked(id,link_id,notice_span_id){\n\t\t\t\t\t//document.write(\"a\");\n\t\t\t\t\tvar index = 0;\n\t\t\t\t\tvar pass = 0;\n\t\t\t\t\tfor(var j = 0; j < locked_tabs.length; j++){\n\t\t\t\t\t\tif(locked_tabs[j]==id){\n\t\t\t\t\t\t\tpass = 1;\n\t\t\t\t\t\t\tindex = j;\n\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tif(!pass)\n\t\t\t\t\t\treturn;\n\t\t\t\t\tlocked_tabs[index] = \"\";\n\t\t\t\t\tvar notice_span = document.getElementById(notice_span_id);\n\t\t\t\t\tnotice_span.innerHTML = \"\";\n\t\t\t\t\t//var link = document.getElementById(link_id);\n\t\t\t\t\t//link.setAttribute(\"onClick\",\"addToLocked('\"+id+\"','\"+link_id+\"','\"+notice_span_id+\"')\");\n\t\t\t\t}\n\n\t\t\t\tfunction selectTextField(){\n\t\t\t\t\tvar filter_text = document.getElementById('filter');\n\t\t\t\t\tfilter_text.focus();\n\t\t\t\t\tfilter_text.select();\n\t\t\t\t}\n\n\t\t\t</script>\n\t\t</head>\n\n\n\t", add);
	dat = rt.modify(live(dat), "<body onload='selectTextField(); updateSearch();' onkeyup='updateSearch();'>", add);
	dat = rt.modify(live(dat), "\n\n\t\t<table width='560' align='center' cellspacing='0' cellpadding='5' id='maintable'>\n\t\t\t<tr id='title_tr'>\n\t\t\t\t<td align='center'>\n\t\t\t\t\t<font size='5'><b>Player panel</b></font><br>\n\t\t\t\t\tHover over a line to see more information - <a href='?_src_=holder;check_antagonist=1'>Check antagonists</a> - Kick <a href='?_src_=holder;kick_all_from_lobby=1;afkonly=0'>everyone</a>/<a href='?_src_=holder;kick_all_from_lobby=1;afkonly=1'>AFKers</a> in lobby\n\t\t\t\t\t<p>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr id='search_tr'>\n\t\t\t\t<td align='center'>\n\t\t\t\t\t<b>Search:</b> <input type='text' id='filter' value='' style='width:300px;'>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t</table>\n\n\t", add);
	dat = rt.modify(live(dat), "\n\t\t<span id='maintable_data_archive'>\n\t\t<table width='560' align='center' cellspacing='0' cellpadding='5' id='maintable_data'>", add);
	mobs = (yield* g.call(f, P("/proc/sortmobs"), null, []));
	i = 1;
	M = null;
	rt.forList(f, 0, live(mobs), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.fv(f, "ckey", live(M)))) {
			color = "#e6e6e6";
			if (isEqual(rt.modulus(live(i), 2), 0)) {
				color = "#f2f2f2";
			}
			is_antagonist = (yield* g.call(f, P("/proc/is_special_character"), null, [live(M)]));
			M_job = "";
			if (truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
				if (truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
					if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
						M_job = rt.fv(f, "job", live(M));
					} else {
						if (truthy((rt.istype(live(M), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
							M_job = "Monkey";
						} else {
							if (truthy((rt.istype(live(M), T("/mob/living/carbon/alien")) ? 1 : 0))) {
								if (truthy((rt.istype(live(M), T("/mob/living/carbon/alien/larva")) ? 1 : 0))) {
									M_job = "Alien larva";
								} else {
									M_job = "Alien";
								}
							} else {
								M_job = "Carbon-based";
							}
						}
					}
				} else {
					if (truthy((rt.istype(live(M), T("/mob/living/silicon")) ? 1 : 0))) {
						if (truthy((rt.istype(live(M), T("/mob/living/silicon/ai")) ? 1 : 0))) {
							M_job = "AI";
						} else {
							if (truthy((rt.istype(live(M), T("/mob/living/silicon/pai")) ? 1 : 0))) {
								M_job = "pAI";
							} else {
								if (truthy((rt.istype(live(M), T("/mob/living/silicon/robot")) ? 1 : 0))) {
									M_job = "Cyborg";
								} else {
									M_job = "Silicon-based";
								}
							}
						}
					} else {
						if (truthy((rt.istype(live(M), T("/mob/living/simple_animal")) ? 1 : 0))) {
							if (truthy((rt.istype(live(M), T("/mob/living/simple_animal/pet/dog/corgi")) ? 1 : 0))) {
								M_job = "Corgi";
							} else {
								if (truthy((rt.istype(live(M), T("/mob/living/simple_animal/slime")) ? 1 : 0))) {
									M_job = "slime";
								} else {
									M_job = "Animal";
								}
							}
						} else {
							M_job = "Living";
						}
					}
				}
			} else {
				if (truthy((rt.istype(live(M), T("/mob/dead/new_player")) ? 1 : 0))) {
					M_job = "New player";
				} else {
					if (truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0))) {
						if (truthy(rt.gv(f, "started_as_observer", (O = live(M))))) {
							M_job = "Observer";
						} else {
							M_job = "Ghost";
						}
					}
				}
			}
			M_name = (yield* g.call(f, P("/proc/html_encode"), null, [rt.fv(f, "name", live(M))]));
			M_rname = (yield* g.call(f, P("/proc/html_encode"), null, [rt.fv(f, "real_name", live(M))]));
			M_key = (yield* g.call(f, P("/proc/html_encode"), null, [rt.fv(f, "key", live(M))]));
			dat = rt.modify(live(dat), fmt("\n\n\t\t\t\t<tr id='data＀' name='＀' onClick=\"addToLocked('item＀','data＀','notice_span＀')\">\n\t\t\t\t\t<td align='center' bgcolor='＀'>\n\t\t\t\t\t\t<span id='notice_span＀'></span>\n\t\t\t\t\t\t<a id='link＀'\n\t\t\t\t\t\tonmouseover='expand(\"item＀\",\"＀\",\"＀\",\"＀\",\"--unused--\",\"＀\",\"＀\",＀,\"＃\")'\n\t\t\t\t\t\t>\n\t\t\t\t\t\t<b id='search＀'>＀ - ＀ - ＀ (＀)</b>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<br><span id='item＀'></span>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\n\t\t\t", [live(i), live(i), live(i), live(i), live(i), live(color), live(i), live(i), live(i), live(M_job), live(M_name), live(M_rname), live(M_key), rt.fv(f, "lastKnownIP", live(M)), live(is_antagonist), live(M), live(i), live(M_name), live(M_rname), live(M_key), live(M_job), live(i)]), add);
			i = rt.inc(live(i), 1);
		}
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), "\n\t\t</table>\n\t\t</span>\n\n\t\t<script type='text/javascript'>\n\t\t\tvar maintable = document.getElementById(\"maintable_data_archive\");\n\t\t\tvar complete_list = maintable.innerHTML;\n\t\t</script>\n\t</body></html>\n\t", add);
	rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=players;size=600x480"], false);
	return f.dot;
}, true);

// /datum/admins/proc/check_antagonists  (code/modules/admin/player_panel.dm:313)  may sleep
rt.def("/datum/admins/proc/check_antagonists", function* check_antagonists(f: Frame) {
	let dat: Value = null, timeleft: Value = null, connected_players: Value = null, lobby_players: Value = null, observers: Value = null, observers_connected: Value = null, living_players: Value = null, living_players_connected: Value = null, living_players_antagonist: Value = null, brains: Value = null, other_players: Value = null, living_skipped: Value = null, drones: Value = null, M: Value = null, N: Value = null, M_13: Value = null, disk_loc: Value = null, M_14: Value = null, O: Value = null, mob_loc: Value = null, G: Value = null, N_13: Value = null, changeling: Value = null, wizard: Value = null, apprentice: Value = null, traitor: Value = null, abductor: Value = null, E: Value = null, abductee: Value = null, X: Value = null, devil: Value = null, devilinfo: Value = null, sintouched: Value = null, blob_minds: Value = null, B: Value = null, mode: Value = null, blob: Value = null, eek: Value = null, M_15: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $e: any;
	f.vars = () => [dat, timeleft, connected_players, lobby_players, observers, observers_connected, living_players, living_players_connected, living_players_antagonist, brains, other_players, living_skipped, drones, M, N, M_13, disk_loc, M_14, O, mob_loc, G, N_13, changeling, wizard, apprentice, traitor, abductor, E, abductee, X, devil, devilinfo, sintouched, blob_minds, B, mode, blob, eek, M_15, $0, $1, $2, $3, $4, $e];
	if (truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
		dat = "<html><head><title>Round Status</title></head><body><h1><B>Round Status</B></h1>";
		if (truthy(rt.gv(f, "replacementmode", rt.fv(f, "mode", rt.gl("SSticker"))))) {
			dat = rt.modify(live(dat), fmt("Former Game Mode: <B>＀</B><BR>", [rt.gv(f, "name", rt.fv(f, "mode", rt.gl("SSticker")))]), add);
			dat = rt.modify(live(dat), fmt("Replacement Game Mode: <B>＀</B><BR>", [rt.gv(f, "name", rt.gv(f, "replacementmode", rt.fv(f, "mode", rt.gl("SSticker"))))]), add);
		} else {
			dat = rt.modify(live(dat), fmt("Current Game Mode: <B>＀</B><BR>", [rt.gv(f, "name", rt.fv(f, "mode", rt.gl("SSticker")))]), add);
		}
		dat = rt.modify(live(dat), fmt("Round Duration: <B>＀:＀:＀＀</B><BR>", [(yield* g.call(f, P("/proc/round"), null, [divide(rt.worldTime(f), 36000)])), (yield* g.call(f, P("/proc/add_zero"), null, [fmt("＀", [rt.modulus(divide(rt.worldTime(f), 600), 60)]), 2])), rt.modulus(divide(rt.worldTime(f), 100), 6), rt.modulus(divide(rt.worldTime(f), 100), 10)]), add);
		dat = rt.modify(live(dat), "<B>Emergency shuttle</B><BR>", add);
		if ((truthy(rt.fv(f, "emergency", rt.gl("SSshuttle"))) && (isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "idle") || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "recall")))) {
			dat = rt.modify(live(dat), "<a href='?_src_=holder;call_shuttle=1'>Call Shuttle</a><br>", add);
		} else {
			timeleft = (yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "timeLeft", []));
			if (isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "call")) {
				dat = rt.modify(live(dat), fmt("ETA: <a href='?_src_=holder;edit_shuttle_time=1'>＀:＀</a><BR>", [rt.modulus(divide(live(timeleft), 60), 60), (yield* g.call(f, P("/proc/add_zero"), null, [(yield* g.call(f, P("/proc/num2text"), null, [rt.modulus(live(timeleft), 60)])), 2]))]), add);
				dat = rt.modify(live(dat), "<a href='?_src_=holder;call_shuttle=2'>Send Back</a><br>", add);
			} else {
				dat = rt.modify(live(dat), fmt("ETA: <a href='?_src_=holder;edit_shuttle_time=1'>＀:＀</a><BR>", [rt.modulus(divide(live(timeleft), 60), 60), (yield* g.call(f, P("/proc/add_zero"), null, [(yield* g.call(f, P("/proc/num2text"), null, [rt.modulus(live(timeleft), 60)])), 2]))]), add);
			}
		}
		dat = rt.modify(live(dat), "<B>Continuous Round Status</B><BR>", add);
		if (truthy(rt.index(rt.fv(f, "continuous", rt.gl("config")), rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker")))))) {
			$0 = "Continue if antagonists die";
		} else {
			$0 = "End on antagonist death";
		}
		dat = rt.modify(live(dat), fmt("<a href='?_src_=holder;toggle_continuous=1'>＀</a>", [$0]), add);
		if (truthy(rt.index(rt.fv(f, "continuous", rt.gl("config")), rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker")))))) {
			if (truthy(rt.index(rt.fv(f, "midround_antag", rt.gl("config")), rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker")))))) {
				$0 = "creating replacement antagonists";
			} else {
				$0 = "not creating new antagonists";
			}
			dat = rt.modify(live(dat), fmt(", <a href='?_src_=holder;toggle_midround_antag=1'>＀</a><BR>", [$0]), add);
		} else {
			dat = rt.modify(live(dat), "<BR>", add);
		}
		if (truthy(rt.index(rt.fv(f, "midround_antag", rt.gl("config")), rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker")))))) {
			dat = rt.modify(live(dat), fmt("Time limit: <a href='?_src_=holder;alter_midround_time_limit=1'>＀ minutes into round</a><BR>", [rt.fv(f, "midround_antag_time_check", rt.gl("config"))]), add);
			dat = rt.modify(live(dat), fmt("Living crew limit: <a href='?_src_=holder;alter_midround_life_limit=1'>＀% of crew alive</a><BR>", [multiply(rt.fv(f, "midround_antag_life_check", rt.gl("config")), 100)]), add);
			if (truthy(rt.gv(f, "round_ends_with_antag_death", rt.fv(f, "mode", rt.gl("SSticker"))))) {
				$0 = "End The Round";
			} else {
				$0 = "Continue As Extended";
			}
			dat = rt.modify(live(dat), fmt("If limits past: <a href='?_src_=holder;toggle_noncontinuous_behavior=1'>＀</a><BR>", [$0]), add);
		}
		dat = rt.modify(live(dat), fmt("<a href='?_src_=holder;end_round=＃'>End Round Now</a><br>", [live(f.usr)]), add);
		if (truthy(rt.fv(f, "delay_end", rt.gl("SSticker")))) {
			$0 = "End Round Normally";
		} else {
			$0 = "Delay Round End";
		}
		dat = rt.modify(live(dat), fmt("<a href='?_src_=holder;delay_round_end=1'>＀</a>", [$0]), add);
		connected_players = rt.len(f, rt.gl("clients"));
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
		M = null;
		rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (truthy(rt.fv(f, "ckey", live(M)))) {
				if (truthy((rt.istype(live(M), T("/mob/dead/new_player")) ? 1 : 0))) {
					lobby_players = rt.inc(live(lobby_players), 1);
					continue;
				}
				if (((!isEqual(rt.fv(f, "stat", live(M)), 2) && truthy(rt.fv(f, "mind", live(M)))) && !truthy((rt.istype(live(M), T("/mob/living/brain")) ? 1 : 0)))) {
					if (truthy((rt.istype(live(M), T("/mob/living/simple_animal/drone")) ? 1 : 0))) {
						drones = rt.inc(live(drones), 1);
						continue;
					}
					if (isEqual(rt.fv(f, "z", live(M)), 1)) {
						living_skipped = rt.inc(live(living_skipped), 1);
						continue;
					}
					living_players = rt.inc(live(living_players), 1);
					if (truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(M))))) {
						living_players_antagonist = rt.inc(live(living_players_antagonist), 1);
					}
					if (truthy(rt.fv(f, "client", live(M)))) {
						living_players_connected = rt.inc(live(living_players_connected), 1);
					}
				} else {
					if ((isEqual(rt.fv(f, "stat", live(M)), 2) || truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0)))) {
						observers = rt.inc(live(observers), 1);
						if (truthy(rt.fv(f, "client", live(M)))) {
							observers_connected = rt.inc(live(observers_connected), 1);
						}
					} else {
						if (truthy((rt.istype(live(M), T("/mob/living/brain")) ? 1 : 0))) {
							brains = rt.inc(live(brains), 1);
						} else {
							other_players = rt.inc(live(other_players), 1);
						}
					}
				}
			}
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), fmt("<BR><b><font color='blue' size='3'>Players:|＀ ingame|＀ connected|＀ lobby|</font></b>", [subtract(live(connected_players), live(lobby_players)), live(connected_players), live(lobby_players)]), add);
		dat = rt.modify(live(dat), fmt("<BR><b><font color='green'>Living Players:|＀ active|＀ disconnected|＀ antagonists|</font></b>", [live(living_players_connected), subtract(live(living_players), live(living_players_connected)), live(living_players_antagonist)]), add);
		dat = rt.modify(live(dat), fmt("<BR><b><font color='#bf42f4'>SKIPPED [On centcom Z-level]: ＀ living players|＀ living drones|</font></b>", [live(living_skipped), live(drones)]), add);
		dat = rt.modify(live(dat), fmt("<BR><b><font color='red'>Dead/Observing players:|＀ active|＀ disconnected|＀ brains|</font></b>", [live(observers_connected), subtract(live(observers), live(observers_connected)), live(brains)]), add);
		if (truthy(live(other_players))) {
			dat = rt.modify(live(dat), fmt("<BR><span class='userdanger'>＀ players in invalid state or the statistics code is bugged!</span>", [live(other_players)]), add);
		}
		dat = rt.modify(live(dat), "<BR>", add);
		if (truthy(rt.getLen(f, rt.gv(f, "syndicates", rt.fv(f, "mode", rt.gl("SSticker")))))) {
			dat = rt.modify(live(dat), "<br><table cellspacing=5><tr><td><B>Syndicates</B></td><td></td></tr>", add);
			N = null;
			rt.forList(f, 0, rt.gv(f, "syndicates", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
			while (($e = rt.next(f, 0)) !== undefined) {
				N = $e;
				if (truthy((M_13 = rt.fv(f, "current", live(N))))) {
					$0 = live(M_13);
					$1 = rt.fv(f, "real_name", live(M_13));
					if (truthy(rt.fv(f, "client", live(M_13)))) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (isEqual(rt.fv(f, "stat", live(M_13)), 2)) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "ckey", live(M_13))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td></tr>", [live(M_13)]), add);
				} else {
					dat = rt.modify(live(dat), fmt("<tr><td><i><a href='?_src_=vars;Vars=＃'>＀(＀)</a> Nuclear Operative Body destroyed!</i></td>", [live(N), rt.fv(f, "name", live(N)), rt.fv(f, "key", live(N))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td></tr>", [rt.fv(f, "key", live(N))]), add);
				}
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table><br><table><tr><td><B>Nuclear Disk(s)</B></td></tr>", add);
			N = null;
			rt.forList(f, 0, rt.gl("poi_list"), T("/obj/item/weapon/disk/nuclear"));
			while (($e = rt.next(f, 0)) !== undefined) {
				N = $e;
				dat = rt.modify(live(dat), fmt("<tr><td>＀, ", [rt.fv(f, "name", live(N))]), add);
				disk_loc = rt.fv(f, "loc", live(N));
				while (!truthy((yield* g.call(f, P("/proc/isturf"), null, [live(disk_loc)])))) {
					if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(disk_loc)])))) {
						dat = rt.modify(live(dat), fmt("carried by <a href='?_src_=holder;adminplayeropts=＃'>＀</a> ", [(M_14 = live(disk_loc)), rt.fv(f, "real_name", live(M_14))]), add);
					}
					if (truthy((rt.istype(live(disk_loc), T("/obj")) ? 1 : 0))) {
						dat = rt.modify(live(dat), fmt("in ＇！ ", [rt.gv(f, "name", (O = live(disk_loc)))]), add);
					}
					disk_loc = rt.fv(f, "loc", live(disk_loc));
				}
				dat = rt.modify(live(dat), fmt("in ＀ at (＀, ＀, ＀)</td></tr>", [rt.fv(f, "loc", live(disk_loc)), rt.fv(f, "x", live(disk_loc)), rt.fv(f, "y", live(disk_loc)), rt.fv(f, "z", live(disk_loc))]), add);
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table>", add);
		}
		if ((truthy(rt.getLen(f, rt.gv(f, "head_revolutionaries", rt.fv(f, "mode", rt.gl("SSticker"))))) || truthy(rt.getLen(f, rt.gv(f, "revolutionaries", rt.fv(f, "mode", rt.gl("SSticker"))))))) {
			dat = rt.modify(live(dat), "<br><table cellspacing=5><tr><td><B>Revolutionaries</B></td><td></td></tr>", add);
			N = null;
			rt.forList(f, 0, rt.gv(f, "head_revolutionaries", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
			while (($e = rt.next(f, 0)) !== undefined) {
				N = $e;
				if (!truthy((M_13 = rt.fv(f, "current", live(N))))) {
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Head Revolutionary body destroyed!</i></td>", [live(N), rt.fv(f, "name", live(N)), rt.fv(f, "key", live(N))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td></tr>", [rt.fv(f, "key", live(N))]), add);
				} else {
					$0 = live(M_13);
					$1 = rt.fv(f, "real_name", live(M_13));
					if (truthy(rt.fv(f, "client", live(M_13)))) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (isEqual(rt.fv(f, "stat", live(M_13)), 2)) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a> <b>(Leader)</b>＀＀</td>", [$0, $1, $2, $3]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "ckey", live(M_13))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td></tr>", [live(M_13)]), add);
				}
			}
			rt.endFor(f, 0);
			N = null;
			rt.forList(f, 0, rt.gv(f, "revolutionaries", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
			while (($e = rt.next(f, 0)) !== undefined) {
				N = $e;
				if (truthy((M_13 = rt.fv(f, "current", live(N))))) {
					$0 = live(M_13);
					$1 = rt.fv(f, "real_name", live(M_13));
					if (truthy(rt.fv(f, "client", live(M_13)))) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (isEqual(rt.fv(f, "stat", live(M_13)), 2)) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "ckey", live(M_13))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td></tr>", [live(M_13)]), add);
				}
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table><table cellspacing=5><tr><td><B>Target(s)</B></td><td></td><td><B>Location</B></td></tr>", add);
			N = null;
			rt.forList(f, 0, (yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "get_living_heads", [])), T("/datum/mind"));
			while (($e = rt.next(f, 0)) !== undefined) {
				N = $e;
				if (truthy((M_13 = rt.fv(f, "current", live(N))))) {
					$0 = live(M_13);
					$1 = rt.fv(f, "real_name", live(M_13));
					if (truthy(rt.fv(f, "client", live(M_13)))) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (isEqual(rt.fv(f, "stat", live(M_13)), 2)) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "ckey", live(M_13))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td>", [live(M_13)]), add);
					dat = rt.modify(live(dat), fmt("<td>＀</td></tr>", [rt.gv(f, "loc", (mob_loc = rt.getStep(f, live(M_13), 0)))]), add);
				} else {
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Head body destroyed!</i></td>", [live(N), rt.fv(f, "name", live(N)), rt.fv(f, "key", live(N))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td></tr>", [rt.fv(f, "key", live(N))]), add);
				}
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table>", add);
		}
		G = null;
		rt.forList(f, 0, rt.gv(f, "gangs", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/gang"));
		while (($e = rt.next(f, 0)) !== undefined) {
			G = $e;
			dat = rt.modify(live(dat), fmt("<br><table cellspacing=5><tr><td><B>＀ Gang: ＀% Control</B></td><td></td></tr>", [rt.fv(f, "name", live(G)), (yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.getLen(f, rt.fv(f, "territory", live(G))), rt.fv(f, "num_territories", rt.gl("start_state"))), 100), 1]))]), add);
			N_13 = null;
			rt.forList(f, 1, rt.fv(f, "bosses", live(G)), T("/datum/mind"));
			while (($e = rt.next(f, 1)) !== undefined) {
				N_13 = $e;
				if (!truthy((M_14 = rt.fv(f, "current", live(N_13))))) {
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Gang Boss body destroyed!</i></td>", [live(N_13), rt.fv(f, "name", live(N_13)), rt.fv(f, "key", live(N_13))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td></tr>", [rt.fv(f, "key", live(N_13))]), add);
				} else {
					$0 = live(M_14);
					$1 = rt.fv(f, "real_name", live(M_14));
					if (truthy(rt.fv(f, "client", live(M_14)))) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (isEqual(rt.fv(f, "stat", live(M_14)), 2)) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a> <b>(Boss)</b>＀＀</td>", [$0, $1, $2, $3]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "ckey", live(M_14))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td></tr>", [live(M_14)]), add);
				}
			}
			rt.endFor(f, 1);
			N_13 = null;
			rt.forList(f, 1, rt.fv(f, "gangsters", live(G)), T("/datum/mind"));
			while (($e = rt.next(f, 1)) !== undefined) {
				N_13 = $e;
				if (truthy((M_14 = rt.fv(f, "current", live(N_13))))) {
					$0 = live(M_14);
					$1 = rt.fv(f, "real_name", live(M_14));
					if (truthy(rt.fv(f, "client", live(M_14)))) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (isEqual(rt.fv(f, "stat", live(M_14)), 2)) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td></tr>", [rt.fv(f, "ckey", live(M_14))]), add);
				}
			}
			rt.endFor(f, 1);
			dat = rt.modify(live(dat), "</table>", add);
		}
		rt.endFor(f, 0);
		if (rt.gt(rt.getLen(f, rt.gv(f, "changelings", rt.fv(f, "mode", rt.gl("SSticker")))), 0)) {
			dat = rt.modify(live(dat), "<br><table cellspacing=5><tr><td><B>Changelings</B></td><td></td><td></td></tr>", add);
			changeling = null;
			rt.forList(f, 0, rt.gv(f, "changelings", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
			while (($e = rt.next(f, 0)) !== undefined) {
				changeling = $e;
				if (truthy((M_13 = rt.fv(f, "current", live(changeling))))) {
					$0 = rt.gv(f, "changelingID", rt.gv(f, "changeling", rt.fv(f, "mind", live(M_13))));
					$1 = live(M_13);
					$2 = rt.fv(f, "real_name", live(M_13));
					if (truthy(rt.fv(f, "client", live(M_13)))) {
						$3 = "";
					} else {
						$3 = " <i>(No Client)</i>";
					}
					if (isEqual(rt.fv(f, "stat", live(M_13)), 2)) {
						$4 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$4 = "";
					}
					dat = rt.modify(live(dat), fmt("<tr><td>＀ as <a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3, $4]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "ckey", live(M_13))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td>", [live(M_13)]), add);
					dat = rt.modify(live(dat), fmt("<td><A HREF='?_src_=holder;traitor=＃'>Show Objective</A></td></tr>", [live(M_13)]), add);
				} else {
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Changeling body destroyed!</i></td>", [live(changeling), rt.fv(f, "name", live(changeling)), rt.fv(f, "key", live(changeling))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td></tr>", [rt.fv(f, "key", live(changeling))]), add);
				}
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table>", add);
		}
		if (rt.gt(rt.getLen(f, rt.gv(f, "wizards", rt.fv(f, "mode", rt.gl("SSticker")))), 0)) {
			dat = rt.modify(live(dat), "<br><table cellspacing=5><tr><td><B>Wizards</B></td><td></td><td></td></tr>", add);
			wizard = null;
			rt.forList(f, 0, rt.gv(f, "wizards", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
			while (($e = rt.next(f, 0)) !== undefined) {
				wizard = $e;
				if (truthy((M_13 = rt.fv(f, "current", live(wizard))))) {
					$0 = live(M_13);
					$1 = rt.fv(f, "real_name", live(M_13));
					if (truthy(rt.fv(f, "client", live(M_13)))) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (isEqual(rt.fv(f, "stat", live(M_13)), 2)) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "ckey", live(M_13))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td>", [live(M_13)]), add);
					dat = rt.modify(live(dat), fmt("<td><A HREF='?_src_=holder;traitor=＃'>Show Objective</A></td></tr>", [live(M_13)]), add);
				} else {
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Wizard body destroyed!</i></td></tr>", [live(wizard), rt.fv(f, "name", live(wizard)), rt.fv(f, "key", live(wizard))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td></tr>", [rt.fv(f, "key", live(wizard))]), add);
				}
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table>", add);
		}
		if (rt.gt(rt.getLen(f, rt.gv(f, "apprentices", rt.fv(f, "mode", rt.gl("SSticker")))), 0)) {
			dat = rt.modify(live(dat), "<br><table cellspacing=5><tr><td><B>Apprentice</B></td><td></td><td></td></tr>", add);
			apprentice = null;
			rt.forList(f, 0, rt.gv(f, "apprentices", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
			while (($e = rt.next(f, 0)) !== undefined) {
				apprentice = $e;
				if (truthy((M_13 = rt.fv(f, "current", live(apprentice))))) {
					$0 = live(M_13);
					$1 = rt.fv(f, "real_name", live(M_13));
					if (truthy(rt.fv(f, "client", live(M_13)))) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (isEqual(rt.fv(f, "stat", live(M_13)), 2)) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "ckey", live(M_13))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td>", [live(M_13)]), add);
					dat = rt.modify(live(dat), fmt("<td><A HREF='?_src_=holder;traitor=＃'>Show Objective</A></td></tr>", [live(M_13)]), add);
				} else {
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Apprentice body destroyed!!</i></td></tr>", [live(apprentice), rt.fv(f, "name", live(apprentice)), rt.fv(f, "key", live(apprentice))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td></tr>", [rt.fv(f, "key", live(apprentice))]), add);
				}
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table>", add);
		}
		if (truthy(rt.getLen(f, rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker")))))) {
			dat = rt.modify(live(dat), "<br><table cellspacing=5><tr><td><B>Cultists</B></td><td></td></tr>", add);
			N = null;
			rt.forList(f, 0, rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
			while (($e = rt.next(f, 0)) !== undefined) {
				N = $e;
				if (truthy((M_13 = rt.fv(f, "current", live(N))))) {
					$0 = live(M_13);
					$1 = rt.fv(f, "real_name", live(M_13));
					if (truthy((yield* g.callName(f, live(N), "has_antag_datum", [T("/datum/antagonist/cult/master")])))) {
						$2 = "<i><font color=red> [Master]</font></i>";
					} else {
						$2 = "";
					}
					if (truthy(rt.fv(f, "client", live(M_13)))) {
						$3 = "";
					} else {
						$3 = " <i>(No Client)</i>";
					}
					if (isEqual(rt.fv(f, "stat", live(M_13)), 2)) {
						$4 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$4 = "";
					}
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀＀</td>", [$0, $1, $2, $3, $4]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "ckey", live(M_13))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td></tr>", [live(M_13)]), add);
				}
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table>", add);
		}
		if (truthy(rt.getLen(f, rt.gv(f, "servants_of_ratvar", rt.fv(f, "mode", rt.gl("SSticker")))))) {
			dat = rt.modify(live(dat), "<br><table cellspacing=5><tr><td><B>Servants of Ratvar</B></td><td></td></tr>", add);
			N = null;
			rt.forList(f, 0, rt.gv(f, "servants_of_ratvar", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
			while (($e = rt.next(f, 0)) !== undefined) {
				N = $e;
				if (truthy((M_13 = rt.fv(f, "current", live(N))))) {
					$0 = live(M_13);
					$1 = rt.fv(f, "real_name", live(M_13));
					if (truthy(rt.fv(f, "client", live(M_13)))) {
						$2 = "";
					} else {
						$2 = " <i>(ghost)</i>";
					}
					if (isEqual(rt.fv(f, "stat", live(M_13)), 2)) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "ckey", live(M_13))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td></tr>", [live(M_13)]), add);
				}
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table>", add);
		}
		if (rt.gt(rt.getLen(f, rt.gv(f, "traitors", rt.fv(f, "mode", rt.gl("SSticker")))), 0)) {
			dat = rt.modify(live(dat), "<br><table cellspacing=5><tr><td><B>Traitors</B></td><td></td><td></td></tr>", add);
			traitor = null;
			rt.forList(f, 0, rt.gv(f, "traitors", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
			while (($e = rt.next(f, 0)) !== undefined) {
				traitor = $e;
				if (truthy((M_13 = rt.fv(f, "current", live(traitor))))) {
					$0 = live(M_13);
					$1 = rt.fv(f, "real_name", live(M_13));
					if (truthy(rt.fv(f, "client", live(M_13)))) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (isEqual(rt.fv(f, "stat", live(M_13)), 2)) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "ckey", live(M_13))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td>", [live(M_13)]), add);
					dat = rt.modify(live(dat), fmt("<td><A HREF='?_src_=holder;traitor=＃'>Show Objective</A></td></tr>", [live(M_13)]), add);
				} else {
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Traitor body destroyed!</i></td>", [live(traitor), rt.fv(f, "name", live(traitor)), rt.fv(f, "key", live(traitor))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td></tr>", [rt.fv(f, "key", live(traitor))]), add);
				}
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table>", add);
		}
		if (truthy(rt.getLen(f, rt.gv(f, "abductors", rt.fv(f, "mode", rt.gl("SSticker")))))) {
			dat = rt.modify(live(dat), "<br><table cellspacing=5><tr><td><B>Abductors</B></td><td></td><td></td></tr>", add);
			abductor = null;
			rt.forList(f, 0, rt.gv(f, "abductors", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
			while (($e = rt.next(f, 0)) !== undefined) {
				abductor = $e;
				if (truthy((M_13 = rt.fv(f, "current", live(abductor))))) {
					$0 = live(M_13);
					$1 = rt.fv(f, "real_name", live(M_13));
					if (truthy(rt.fv(f, "client", live(M_13)))) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (isEqual(rt.fv(f, "stat", live(M_13)), 2)) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "ckey", live(M_13))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td>", [live(M_13)]), add);
					dat = rt.modify(live(dat), fmt("<td><A HREF='?_src_=holder;traitor=＃'>Show Objective</A></td></tr>", [live(M_13)]), add);
				} else {
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Abductor body destroyed!</i></td></tr>", [live(abductor), rt.fv(f, "name", live(abductor)), rt.fv(f, "key", live(abductor))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "key", live(abductor))]), add);
				}
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table>", add);
			dat = rt.modify(live(dat), "<br><table cellspacing=5><tr><td><B>Abductees</B></td><td></td><td></td></tr>", add);
			E = null;
			rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/abductor/experiment"));
			while (($e = rt.next(f, 0)) !== undefined) {
				E = $e;
				abductee = null;
				rt.forList(f, 1, rt.fv(f, "abductee_minds", live(E)), T("/datum/mind"));
				while (($e = rt.next(f, 1)) !== undefined) {
					abductee = $e;
					if (truthy((M_14 = rt.fv(f, "current", live(abductee))))) {
						$0 = live(M_14);
						$1 = rt.fv(f, "real_name", live(M_14));
						if (truthy(rt.fv(f, "client", live(M_14)))) {
							$2 = "";
						} else {
							$2 = " <i>(No Client)</i>";
						}
						if (isEqual(rt.fv(f, "stat", live(M_14)), 2)) {
							$3 = " <b><font color=red>(DEAD)</font></b>";
						} else {
							$3 = "";
						}
						dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]), add);
						dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "ckey", live(M_14))]), add);
						dat = rt.modify(live(dat), fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td>", [live(M_14)]), add);
						dat = rt.modify(live(dat), fmt("<td><A HREF='?_src_=holder;traitor=＃'>Show Objective</A></td></tr>", [live(M_14)]), add);
					} else {
						dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Abductee body destroyed!</i></td>", [live(abductee), rt.fv(f, "name", live(abductee)), rt.fv(f, "key", live(abductee))]), add);
						dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td></tr>", [rt.fv(f, "key", live(abductee))]), add);
					}
				}
				rt.endFor(f, 1);
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table>", add);
		}
		if (truthy(rt.getLen(f, rt.gv(f, "devils", rt.fv(f, "mode", rt.gl("SSticker")))))) {
			dat = rt.modify(live(dat), "<br><table cellspacing=5><tr><td><B>devils</B></td><td></td><td></td></tr>", add);
			X = null;
			rt.forList(f, 0, rt.gv(f, "devils", rt.fv(f, "mode", rt.gl("SSticker"))));
			while (($e = rt.next(f, 0)) !== undefined) {
				X = $e;
				devil = live(X);
				M_14 = rt.fv(f, "current", live(devil));
				devilinfo = (yield* g.callName(f, live(devil), "has_antag_datum", [T("/datum/antagonist/devil")]));
				if (truthy(live(M_14))) {
					$0 = live(M_14);
					$1 = rt.fv(f, "real_name", live(M_14));
					$2 = rt.fv(f, "truename", live(devilinfo));
					if (truthy(rt.fv(f, "client", live(M_14)))) {
						$3 = "";
					} else {
						$3 = " <i>(No Client)</i>";
					}
					if (isEqual(rt.fv(f, "stat", live(M_14)), 2)) {
						$4 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$4 = "";
					}
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀ : ＀</a>＀＀</td>", [$0, $1, $2, $3, $4]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "ckey", live(M_14))]), add);
					dat = rt.modify(live(dat), fmt("<td><A HREF='?_src_=holder;traitor=＃'>Show Objective</A></td></tr>", [live(M_14)]), add);
					dat = rt.modify(live(dat), fmt("<td><A HREF='?_src_=holder;admincheckdevilinfo=＃'>Show all devil info</A></td></tr>", [live(M_14)]), add);
				} else {
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀ :  ＀ (＀)</a><i>devil body destroyed!</i></td></tr>", [live(devil), rt.fv(f, "name", live(devil)), rt.fv(f, "truename", live(devilinfo)), rt.fv(f, "key", live(devil))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "key", live(devil))]), add);
				}
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table>", add);
		}
		if (truthy(rt.getLen(f, rt.gv(f, "sintouched", rt.fv(f, "mode", rt.gl("SSticker")))))) {
			dat = rt.modify(live(dat), "<br><table cellspacing=5><tr><td><B>sintouched</B></td><td></td><td></td></tr>", add);
			X = null;
			rt.forList(f, 0, rt.gv(f, "sintouched", rt.fv(f, "mode", rt.gl("SSticker"))));
			while (($e = rt.next(f, 0)) !== undefined) {
				X = $e;
				sintouched = live(X);
				if (truthy((M_14 = rt.fv(f, "current", live(sintouched))))) {
					$0 = live(M_14);
					$1 = rt.fv(f, "real_name", live(M_14));
					if (truthy(rt.fv(f, "client", live(M_14)))) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (isEqual(rt.fv(f, "stat", live(M_14)), 2)) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "ckey", live(M_14))]), add);
					dat = rt.modify(live(dat), fmt("<td><A HREF='?_src_=holder;traitor=＃'>Show Objective</A></td></tr>", [live(M_14)]), add);
				} else {
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>sintouched body destroyed!</i></td></tr>", [live(sintouched), rt.fv(f, "name", live(sintouched)), rt.fv(f, "key", live(sintouched))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "key", live(sintouched))]), add);
				}
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table>", add);
		}
		blob_minds = rt.list();
		B = null;
		rt.forList(f, 0, rt.gl("mob_list"), T("/mob/camera/blob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			B = $e;
			(blob_minds = rt.modify(live(blob_minds), rt.fv(f, "mind", live(B)), rt.bitOr));
		}
		rt.endFor(f, 0);
		if ((truthy((rt.istype(rt.fv(f, "mode", rt.gl("SSticker")), T("/datum/game_mode/blob")) ? 1 : 0)) || truthy(rt.len(f, live(blob_minds))))) {
			dat = rt.modify(live(dat), "<br><table cellspacing=5><tr><td><B>Blob</B></td><td></td><td></td></tr>", add);
			if (truthy((rt.istype(rt.fv(f, "mode", rt.gl("SSticker")), T("/datum/game_mode/blob")) ? 1 : 0))) {
				(blob_minds = rt.modify(live(blob_minds), rt.gv(f, "blob_overminds", (mode = rt.fv(f, "mode", rt.gl("SSticker")))), rt.bitOr));
				dat = rt.modify(live(dat), fmt("<tr><td><i>Progress: ＀/＀</i></td></tr>", [rt.len(f, rt.gl("blobs_legit")), rt.fv(f, "blobwincount", live(mode))]), add);
			}
			blob = null;
			rt.forList(f, 0, live(blob_minds), T("/datum/mind"));
			while (($e = rt.next(f, 0)) !== undefined) {
				blob = $e;
				if (truthy((M_14 = rt.fv(f, "current", live(blob))))) {
					$0 = live(M_14);
					$1 = rt.fv(f, "real_name", live(M_14));
					if (truthy(rt.fv(f, "client", live(M_14)))) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (isEqual(rt.fv(f, "stat", live(M_14)), 2)) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "ckey", live(M_14))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td></tr>", [live(M_14)]), add);
				} else {
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Blob not found!</i></td>", [live(blob), rt.fv(f, "name", live(blob)), rt.fv(f, "key", live(blob))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td></tr>", [rt.fv(f, "key", live(blob))]), add);
				}
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table>", add);
		}
		if (truthy((rt.istype(rt.fv(f, "mode", rt.gl("SSticker")), T("/datum/game_mode/monkey")) ? 1 : 0))) {
			mode = rt.fv(f, "mode", rt.gl("SSticker"));
			dat = rt.modify(live(dat), "<br><table cellspacing=5><tr><td><B>Monkey</B></td><td></td><td></td></tr>", add);
			eek = null;
			rt.forList(f, 0, rt.fv(f, "ape_infectees", live(mode)), T("/datum/mind"));
			while (($e = rt.next(f, 0)) !== undefined) {
				eek = $e;
				if (truthy((M_15 = rt.fv(f, "current", live(eek))))) {
					$0 = live(M_15);
					$1 = rt.fv(f, "real_name", live(M_15));
					if (truthy(rt.fv(f, "client", live(M_15)))) {
						$2 = "";
					} else {
						$2 = " <i>(No Client)</i>";
					}
					if (isEqual(rt.fv(f, "stat", live(M_15)), 2)) {
						$3 = " <b><font color=red>(DEAD)</font></b>";
					} else {
						$3 = "";
					}
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=holder;adminplayeropts=＃'>＀</a>＀＀</td>", [$0, $1, $2, $3]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td>", [rt.fv(f, "ckey", live(M_15))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a></td></tr>", [live(M_15)]), add);
				} else {
					dat = rt.modify(live(dat), fmt("<tr><td><a href='?_src_=vars;Vars=＃'>＀(＀)</a><i>Monkey not found!</i></td>", [live(eek), rt.fv(f, "name", live(eek)), rt.fv(f, "key", live(eek))]), add);
					dat = rt.modify(live(dat), fmt("<td><A href='?priv_msg=＀'>PM</A></td></tr>", [rt.fv(f, "key", live(eek))]), add);
				}
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table>", add);
		}
		dat = rt.modify(live(dat), "</body></html>", add);
		rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=roundstatus;size=420x500"], false);
	} else {
		yield* g.call(f, P("/proc/alert"), null, ["The game hasn't started yet!"]);
	}
	return f.dot;
}, true);
