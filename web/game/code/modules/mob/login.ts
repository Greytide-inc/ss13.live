// From code/modules/mob/login.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/proc/Login  (code/modules/mob/login.dm:2)  may sleep
rt.def("/mob/proc/Login", function* Login(f: Frame) {
	(rt.modGl("player_list", live(f.src), rt.bitOr));
	rt.setSv(f, "lastKnownIP", rt.fv(f, "address", rt.sv(f, "client")));
	rt.setSv(f, "computer_id", rt.fv(f, "computer_id", rt.sv(f, "client")));
	yield* g.call(f, P("/proc/log_access"), null, [fmt("Mob Login: ＀ was assigned to a ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), rt.sv(f, "type")])]);
	yield* g.callName(f, rt.world(), "update_status", []);
	rt.setFv(f, "screen", rt.sv(f, "client"), rt.list());
	rt.setFv(f, "images", rt.sv(f, "client"), rt.list());
	if (!truthy(rt.sv(f, "hud_used"))) {
		yield* g.srcCall(f, "create_mob_hud");
	}
	if (truthy(rt.sv(f, "hud_used"))) {
		yield* g.callName(f, rt.sv(f, "hud_used"), "show_hud", [rt.fv(f, "hud_version", rt.sv(f, "hud_used"))]);
	}
	rt.setSv(f, "next_move", 1);
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "reset_perspective", rt.sv(f, "loc"));
	if (truthy(rt.sv(f, "loc"))) {
		yield* g.callName(f, rt.sv(f, "loc"), "on_log", [1]);
	}
	yield* g.srcCall(f, "reload_huds");
	yield* g.srcCall(f, "reload_fullscreen");
	if (truthy((rt.isIn(f, rt.sv(f, "ckey"), rt.gl("deadmins")) ? 1 : 0))) {
		rt.modSrcVar(f, "verbs", P("/client/proc/readmin"), add);
	}
	yield* g.srcCall(f, "add_click_catcher");
	yield* g.srcCall(f, "sync_mind");
	yield* g.callName(f, rt.sv(f, "client"), "sethotkeys", []);
	yield* g.srcCall(f, "update_client_colour");
	if (truthy(rt.sv(f, "client"))) {
		rt.setFv(f, "click_intercept", rt.sv(f, "client"), null);
		yield* g.callName(f, rt.sv(f, "client"), "change_view", [(yield* g.callName(f, rt.sv(f, "client"), "default_view", []))]);
	}
	if (!truthy(rt.index(rt.gl("individual_log_list"), rt.sv(f, "ckey")))) {
		rt.setAt(rt.gl("individual_log_list"), rt.sv(f, "ckey"), rt.sv(f, "logging"));
	} else {
		rt.setSv(f, "logging", rt.index(rt.gl("individual_log_list"), rt.sv(f, "ckey")));
	}
	return f.dot;
}, true);
