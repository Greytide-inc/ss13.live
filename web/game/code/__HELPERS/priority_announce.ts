// From code/__HELPERS/priority_announce.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/priority_announce  (code/__HELPERS/priority_announce.dm:2)  may sleep
rt.def("/proc/priority_announce", function* priority_announce(f: Frame, text: Value, title: Value, sound: Value, type: Value) {
	let announcement: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [text, title, sound, type, announcement, M, $e];
	if (live(title) === null) {
		title = "";
	}
	if (live(sound) === null) {
		sound = rt.rsc("sound/ai/attention.ogg");
	}
	if (!truthy(live(text))) {
		return live(f.dot);
	}
	announcement = null;
	if (isEqual(live(type), "Priority")) {
		announcement = rt.modify(live(announcement), "<h1 class='alert'>Priority Announcement</h1>", add);
		if ((truthy(live(title)) && rt.gt(rt.length(live(title)), 0))) {
			announcement = rt.modify(live(announcement), fmt("<br><h2 class='alert'>＀</h2>", [(yield* g.call(f, P("/proc/html_encode"), null, [live(title)]))]), add);
		}
	} else {
		if (isEqual(live(type), "Captain")) {
			announcement = rt.modify(live(announcement), "<h1 class='alert'>Captain Announces</h1>", add);
			yield* g.callName(f, rt.gl("news_network"), "SubmitArticle", [(yield* g.call(f, P("/proc/html_encode"), null, [live(text)])), "Captain's Announcement", "Station Announcements", null]);
		} else {
			announcement = rt.modify(live(announcement), fmt("<h1 class='alert'>＀ Update</h1>", [(yield* g.call(f, P("/proc/command_name"), null, []))]), add);
			if ((truthy(live(title)) && rt.gt(rt.length(live(title)), 0))) {
				announcement = rt.modify(live(announcement), fmt("<br><h2 class='alert'>＀</h2>", [(yield* g.call(f, P("/proc/html_encode"), null, [live(title)]))]), add);
			}
			if (isEqual(live(title), "")) {
				yield* g.callName(f, rt.gl("news_network"), "SubmitArticle", [live(text), "Central Command Update", "Station Announcements", null]);
			} else {
				yield* g.callName(f, rt.gl("news_network"), "SubmitArticle", [add(add(live(title), "<br><br>"), live(text)), "Central Command", "Station Announcements", null]);
			}
		}
	}
	announcement = rt.modify(live(announcement), fmt("<br><span class='alert'>＀</span><br>", [(yield* g.call(f, P("/proc/html_encode"), null, [live(text)]))]), add);
	announcement = rt.modify(live(announcement), "<br>", add);
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((!truthy((rt.istype(live(M), T("/mob/dead/new_player")) ? 1 : 0)) && truthy((yield* g.callName(f, live(M), "can_hear", []))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), live(announcement)]);
			if (truthy(rt.bitAnd(rt.gv(f, "toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(M)))), 2048))) {
				rt.op(f, "Output", [], [live(M), (yield* g.call(f, P("/proc/sound"), null, [live(sound)]))], false);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/print_command_report  (code/__HELPERS/priority_announce.dm:34)  may sleep
rt.def("/proc/print_command_report", function* print_command_report(f: Frame, text: Value, title: Value, announce: Value) {
	let C: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [text, title, announce, C, _P, $e];
	if (live(text) === null) {
		text = "";
	}
	if (live(title) === null) {
		title = null;
	}
	if (live(announce) === null) {
		announce = 1;
	}
	if (!truthy(live(title))) {
		title = fmt("Classified ＀ Update", [(yield* g.call(f, P("/proc/command_name"), null, []))]);
	}
	if (truthy(live(announce))) {
		yield* g.call(f, P("/proc/priority_announce"), null, ["A report has been downloaded and printed out at all communications consoles.", "Incoming Classified Message", rt.rsc("sound/ai/commandreport.ogg")]);
	}
	C = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/communications"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if ((!truthy(rt.bitAnd(rt.fv(f, "stat", live(C)), 3)) && isEqual(rt.fv(f, "z", live(C)), 2))) {
			rt.setFv(f, "name", (_P = (yield* g.new_(f, T("/obj/item/weapon/paper"), [rt.fv(f, "loc", live(C))]))), fmt("paper - '＀'", [live(title)]));
			rt.setFv(f, "info", live(_P), live(text));
			yield* g.callName(f, rt.fv(f, "messagetitle", live(C)), "Add", [fmt("＀", [live(title)])]);
			yield* g.callName(f, rt.fv(f, "messagetext", live(C)), "Add", [live(text)]);
			yield* g.callName(f, live(_P), "update_icon", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/minor_announce  (code/__HELPERS/priority_announce.dm:50)
rt.def("/proc/minor_announce", function minor_announce(f: Frame, message: Value, title: Value, alert: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [title, M, $e];
	if (live(title) === null) {
		title = "Attention:";
	}
	if (!truthy(live(message))) {
		return live(f.dot);
	}
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((!truthy((rt.istype(live(M), T("/mob/dead/new_player")) ? 1 : 0)) && truthy(rt.callName(f, live(M), "can_hear", [])))) {
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<b><font size = 3><font color = red>＀</font color><BR>＀</font size></b><BR>", [live(title), live(message)])]);
			if (truthy(rt.bitAnd(rt.gv(f, "toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(M)))), 2048))) {
				if (truthy(live(alert))) {
					rt.op(f, "Output", [], [live(M), rt.call(f, P("/proc/sound"), null, [rt.rsc("sound/misc/notice1.ogg")])], false);
				} else {
					rt.op(f, "Output", [], [live(M), rt.call(f, P("/proc/sound"), null, [rt.rsc("sound/misc/notice2.ogg")])], false);
				}
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
