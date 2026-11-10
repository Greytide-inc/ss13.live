// Based on /tg/station's code/__HELPERS/priority_announce.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


// priority_announce.dm:2
rt.def("/proc/priority_announce", function* priority_announce(f: Frame, text: Value, title: Value, sound: Value, type: Value) {
	let announcement: Value = null, M: Value = null;
	title ??= "";
	sound ??= rt.rsc("sound/ai/attention.ogg");
	if (!text || (type != "Captain" && is_creative())) { // tg_js: no CentCom announcements in creative mode (a captain's own still go out)
		return f.dot;
	}
	if (type == "Priority") {
		announcement += "<h1 class='alert'>Priority Announcement</h1>";
		if (title && rt.length(title) > 0) {
			announcement += `<br><h2 class='alert'>${html_encode(title)}</h2>`;
		}
	} else if (type == "Captain") {
		announcement += "<h1 class='alert'>Captain Announces</h1>";
		yield* GLOB.news_network.SubmitArticle(html_encode(text), "Captain's Announcement", "Station Announcements", null);
	} else {
		announcement += `<h1 class='alert'>${command_name()} Update</h1>`;
		if (title && rt.length(title) > 0) {
			announcement += `<br><h2 class='alert'>${html_encode(title)}</h2>`;
		}
		if (title == "") {
			yield* GLOB.news_network.SubmitArticle(text, "Central Command Update", "Station Announcements", null);
		} else {
			yield* GLOB.news_network.SubmitArticle(title + "<br><br>" + text, "Central Command", "Station Announcements", null);
		}
	}
	announcement += `<br><span class='alert'>${html_encode(text)}</span><br>`;
	announcement += "<br>";
	for (M of each(GLOB.player_list, T("/mob"))) {
		if (!rt.istype(M, T("/mob/dead/new_player")) && M.can_hear()) {
			to_chat(M, announcement);
			if (rt.bitAnd(M.client.prefs.toggles, 2048)) {
				rt.op(f, "Output", [], [M, (yield* g.call(f, P("/proc/sound"), null, [sound]))], false);
			}
		}
	}
	return f.dot;
}, true);

// priority_announce.dm:34
rt.def("/proc/print_command_report", function* print_command_report(f: Frame, text: Value, title: Value, announce: Value) {
	let C: Value = null, _P: Value = null;
	text ??= "";
	announce ??= 1;
	if (!title) {
		title = `Classified ${command_name()} Update`;
	}
	if (announce) {
		yield* priority_announce("A report has been downloaded and printed out at all communications consoles.", "Incoming Classified Message", rt.rsc("sound/ai/commandreport.ogg"));
	}
	for (C of each(GLOB.machines, T("/obj/machinery/computer/communications"))) {
		if (!rt.bitAnd(C.stat, 3) && C.z == ZLEVEL_STATION) {
			(_P = (yield* new_(T("/obj/item/weapon/paper"), C.loc))).name = `paper - '${title}'`;
			_P.info = text;
			C.messagetitle.Add(`${title}`);
			C.messagetext.Add(text);
			yield* _P.update_icon();
		}
	}
	return f.dot;
}, true);

// priority_announce.dm:50
rt.def("/proc/minor_announce", function minor_announce(f: Frame, message: Value, title: Value, alert: Value) {
	let M: Value = null;
	title ??= "Attention:";
	if (!message) {
		return f.dot;
	}
	for (M of each(GLOB.player_list, T("/mob"))) {
		if (!rt.istype(M, T("/mob/dead/new_player")) && M.can_hear()) {
			to_chat(M, `<b><font size = 3><font color = red>${title}</font color><BR>${message}</font size></b><BR>`);
			if (rt.bitAnd(M.client.prefs.toggles, 2048)) {
				if (alert) {
					rt.op(f, "Output", [], [M, sound(rt.rsc("sound/misc/notice1.ogg"))], false);
				} else {
					rt.op(f, "Output", [], [M, sound(rt.rsc("sound/misc/notice2.ogg"))], false);
				}
			}
		}
	}
	return f.dot;
});
