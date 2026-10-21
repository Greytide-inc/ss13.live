// From code/modules/mob/dead/new_player/login.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/dead/new_player/proc/Login  (code/modules/mob/dead/new_player/login.dm:2)  may sleep
rt.def("/mob/dead/new_player/proc/Login", function* Login(f: Frame) {
	let tl: Value = null, postfix: Value = null;
	f.vars = () => [tl, postfix];
	if (!truthy(rt.sv(f, "mind"))) {
		rt.setSv(f, "mind", (yield* g.new_(f, T("/datum/mind"), [rt.sv(f, "key")])));
		rt.setFv(f, "active", rt.sv(f, "mind"), 1);
		rt.setFv(f, "current", rt.sv(f, "mind"), live(f.src));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.gl("join_motd"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<div class=\"motd\">＀</div>", [rt.gl("join_motd")])]);
	}
	if (truthy(rt.gl("admin_notice"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'><b>Admin Notice:</b>\n \t ＀</span>", [rt.gl("admin_notice")])]);
	}
	if ((truthy(rt.fv(f, "soft_popcap", rt.gl("config"))) && rt.ge((yield* g.call(f, P("/proc/living_player_count"), null, [])), rt.fv(f, "soft_popcap", rt.gl("config"))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'><b>Server Notice:</b>\n \t ＀</span>", [rt.fv(f, "soft_popcap_message", rt.gl("config"))])]);
	}
	(rt.modSrcVar(f, "sight", 16, rt.bitOr));
	yield* g.srcCall(f, "new_player_panel");
	yield* g.callName(f, rt.sv(f, "client"), "playtitlemusic", []);
	if (!rt.lt(rt.fv(f, "current_state", rt.gl("SSticker")), 2)) return f.dot;
	tl = divide((yield* g.call(f, P("/proc/round"), null, [(yield* g.callName(f, rt.gl("SSticker"), "GetTimeLeft", [])), 1])), 10);
	postfix = null;
	if (rt.ge(live(tl), 0)) {
		postfix = fmt("in about ＀ seconds", [live(tl)]);
	} else {
		postfix = "soon";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Please set up your character and select \"Ready\". The game will start ＀.", [live(postfix)])]);
	return f.dot;
}, true);
