// From code/datums/wires/syndicatebomb.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1076, "/datum/wires/syndicatebomb", "/datum/wires", {
	holder_type: rt.typePath("/obj/machinery/syndicatebomb"),
	randomize: 1,
});

// /datum/wires/syndicatebomb/proc/New  (code/datums/wires/syndicatebomb.dm:10)
rt.def("/datum/wires/syndicatebomb/proc/New", function New(f: Frame) {
	rt.setSv(f, "wires", rt.list("Boom", "Unbolt", "Activate", "Delay", "Proceed"));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["holder"] });

// /datum/wires/syndicatebomb/proc/interactable  (code/datums/wires/syndicatebomb.dm:13)
rt.def("/datum/wires/syndicatebomb/proc/interactable", function interactable(f: Frame, user: Value) {
	let _P: Value = null;
	f.vars = () => [_P];
	if (!truthy(rt.gv(f, "open_panel", (_P = rt.sv(f, "holder"))))) return f.dot;
	return 1;
});

// /datum/wires/syndicatebomb/proc/on_pulse  (code/datums/wires/syndicatebomb.dm:18)
rt.def("/datum/wires/syndicatebomb/proc/on_pulse", function on_pulse(f: Frame, wire: Value) {
	let B: Value = null, seconds: Value = null;
	let $0: any;
	f.vars = () => [B, seconds, $0];
	B = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Boom") {
		if (truthy(rt.fv(f, "active", live(B)))) {
			rt.callName(f, rt.sv(f, "holder"), "visible_message", [fmt("<span class='danger'>＀ An alarm sounds! It's go-</span>", [rt.call(f, P("/proc/bicon"), null, [live(B)])])]);
			rt.setFv(f, "explode_now", live(B), 1);
			rt.callSrc(f, "tell_admins", [live(B)]);
		}
	} else if ($0 === "Unbolt") {
		rt.callName(f, rt.sv(f, "holder"), "visible_message", [fmt("<span class='notice'>＀ The bolts spin in place for a moment.</span>", [rt.call(f, P("/proc/bicon"), null, [live(B)])])]);
	} else if ($0 === "Delay") {
		if (truthy(rt.fv(f, "delayedbig", live(B)))) {
			rt.callName(f, rt.sv(f, "holder"), "visible_message", [fmt("<span class='notice'>＀ The bomb has already been delayed.</span>", [rt.call(f, P("/proc/bicon"), null, [live(B)])])]);
		} else {
			rt.callName(f, rt.sv(f, "holder"), "visible_message", [fmt("<span class='notice'>＀ The bomb chirps.</span>", [rt.call(f, P("/proc/bicon"), null, [live(B)])])]);
			rt.call(f, P("/proc/playsound"), null, [live(B), rt.rsc("sound/machines/chime.ogg"), 30, 1]);
			rt.modField(f, live(B), "detonation_timer", 300, add);
			rt.setFv(f, "delayedbig", live(B), 1);
		}
	} else if ($0 === "Proceed") {
		rt.callName(f, rt.sv(f, "holder"), "visible_message", [fmt("<span class='danger'>＀ The bomb buzzes ominously!</span>", [rt.call(f, P("/proc/bicon"), null, [live(B)])])]);
		rt.call(f, P("/proc/playsound"), null, [live(B), rt.rsc("sound/machines/buzz-sigh.ogg"), 30, 1]);
		if (rt.ge((seconds = rt.callName(f, live(B), "seconds_remaining", [])), 61)) {
			rt.setFv(f, "detonation_timer", live(B), add(rt.worldTime(f), 600));
		} else {
			if (rt.ge(live(seconds), 21)) {
				(rt.modField(f, live(B), "detonation_timer", 100, subtract));
			} else {
				if (rt.ge(live(seconds), 11)) {
					rt.setFv(f, "detonation_timer", live(B), add(rt.worldTime(f), 100));
				}
			}
		}
	} else if ($0 === "Activate") {
		if ((!truthy(rt.fv(f, "active", live(B))) && !truthy(rt.fv(f, "defused", live(B))))) {
			rt.callName(f, rt.sv(f, "holder"), "visible_message", [fmt("<span class='danger'>＀ You hear the bomb start ticking!</span>", [rt.call(f, P("/proc/bicon"), null, [live(B)])])]);
			rt.callName(f, live(B), "activate", []);
			rt.callName(f, live(B), "update_icon", []);
		} else {
			if (truthy(rt.fv(f, "delayedlittle", live(B)))) {
				rt.callName(f, rt.sv(f, "holder"), "visible_message", [fmt("<span class='notice'>＀ Nothing happens.</span>", [rt.call(f, P("/proc/bicon"), null, [live(B)])])]);
			} else {
				rt.callName(f, rt.sv(f, "holder"), "visible_message", [fmt("<span class='notice'>＀ The bomb seems to hesitate for a moment.</span>", [rt.call(f, P("/proc/bicon"), null, [live(B)])])]);
				rt.modField(f, live(B), "detonation_timer", 100, add);
				rt.setFv(f, "delayedlittle", live(B), 1);
			}
		}
	}
	return f.dot;
});

// /datum/wires/syndicatebomb/proc/on_cut  (code/datums/wires/syndicatebomb.dm:58)
rt.def("/datum/wires/syndicatebomb/proc/on_cut", function on_cut(f: Frame, wire: Value, mend: Value) {
	let B: Value = null;
	let $0: any;
	f.vars = () => [B, $0];
	B = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Boom") {
		if (truthy(live(mend))) {
			rt.setFv(f, "defused", live(B), 0);
		} else {
			if (truthy(rt.fv(f, "active", live(B)))) {
				rt.callName(f, rt.sv(f, "holder"), "visible_message", [fmt("<span class='danger'>＀ An alarm sounds! It's go-</span>", [rt.call(f, P("/proc/bicon"), null, [live(B)])])]);
				rt.setFv(f, "explode_now", live(B), 1);
				rt.callSrc(f, "tell_admins", [live(B)]);
			} else {
				rt.setFv(f, "defused", live(B), 1);
			}
		}
	} else if ($0 === "Unbolt") {
		if ((!truthy(live(mend)) && truthy(rt.fv(f, "anchored", live(B))))) {
			rt.callName(f, rt.sv(f, "holder"), "visible_message", [fmt("<span class='notice'>＀ The bolts lift out of the ground!</span>", [rt.call(f, P("/proc/bicon"), null, [live(B)])])]);
			rt.call(f, P("/proc/playsound"), null, [live(B), rt.rsc("sound/effects/stealthoff.ogg"), 30, 1]);
			rt.setFv(f, "anchored", live(B), 0);
		}
	} else if ($0 === "Proceed") {
		if ((!truthy(live(mend)) && truthy(rt.fv(f, "active", live(B))))) {
			rt.callName(f, rt.sv(f, "holder"), "visible_message", [fmt("<span class='danger'>＀ An alarm sounds! It's go-</span>", [rt.call(f, P("/proc/bicon"), null, [live(B)])])]);
			rt.setFv(f, "explode_now", live(B), 1);
			rt.callSrc(f, "tell_admins", [live(B)]);
		}
	} else if ($0 === "Activate") {
		if (!(!truthy(live(mend)) && truthy(rt.fv(f, "active", live(B))))) return f.dot;
		rt.callName(f, rt.sv(f, "holder"), "visible_message", [fmt("<span class='notice'>＀ The timer stops! The bomb has been defused!</span>", [rt.call(f, P("/proc/bicon"), null, [live(B)])])]);
		rt.setFv(f, "active", live(B), 0);
		rt.setFv(f, "defused", live(B), 1);
		rt.callName(f, live(B), "update_icon", []);
	}
	return f.dot;
});

// /datum/wires/syndicatebomb/proc/tell_admins  (code/datums/wires/syndicatebomb.dm:88)
rt.def("/datum/wires/syndicatebomb/proc/tell_admins", function tell_admins(f: Frame, B: Value) {
	let _T: Value = null;
	let $0: any, $1: any;
	f.vars = () => [_T, $0, $1];
	if (truthy((rt.istype(live(B), T("/obj/machinery/syndicatebomb/training")) ? 1 : 0))) {
		return live(f.dot);
	}
	_T = rt.getStep(f, live(B), 0);
	rt.call(f, P("/proc/log_game"), null, [fmt("＆！ was detonated via boom wire at ＀.", [live(B), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
	$0 = rt.fv(f, "name", live(B));
	if (truthy(live(_T))) {
		$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
	} else {
		$1 = "nonexistent location";
	}
	rt.call(f, P("/proc/message_admins"), null, [fmt("A ＀ was detonated via boom wire at ＀.", [$0, fmt("＀", [$1])])]);
	return f.dot;
});
