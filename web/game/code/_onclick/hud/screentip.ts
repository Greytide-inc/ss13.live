// From code/_onclick/hud/screentip.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /atom/proc/MouseEntered  built in (BYOND provides it)
rt.def("/atom/proc/MouseEntered", undefined, false, { args: ["location", "control", "params"] });

// /atom/proc/MouseEntered  (code/_onclick/hud/screentip.dm:14)
rt.def("/atom/proc/MouseEntered", function MouseEntered(f: Frame, location: Value, control: Value, params: Value) {
	let M: Value = null, tip: Value = null;
	f.vars = () => [M, tip];
	if ((((!truthy((M = live(f.usr))) || !truthy(rt.fv(f, "client", live(M)))) || !truthy(rt.gv(f, "prefs", rt.fv(f, "client", live(M))))) || !truthy(rt.gv(f, "screentip_pref", rt.gv(f, "prefs", rt.fv(f, "client", live(M))))))) {
		return live(f.dot);
	}
	if ((!truthy(rt.fv(f, "hud_used", live(M))) || !truthy(rt.gv(f, "screentip_text", rt.fv(f, "hud_used", live(M)))))) {
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(f.src), T("/turf/open/floor")) ? 1 : 0)) || isEqual(rt.sv(f, "name"), ""))) {
		rt.setFv(f, "maptext", rt.gv(f, "screentip_text", rt.fv(f, "hud_used", live(M))), "");
		return live(f.dot);
	}
	if (isEqual(rt.call(f, P("/proc/text2ascii"), null, [(tip = fmt("＀", [rt.sv(f, "name")]))]), 255)) {
		tip = rt.call(f, P("/proc/copytext"), null, [live(tip), 3]);
	}
	rt.setFv(f, "maptext", rt.gv(f, "screentip_text", rt.fv(f, "hud_used", live(M))), fmt("<div align='center' style='color:#ffd391; font-size:8pt'>＀</div>", [live(tip)]));
	return f.dot;
});

// /atom/proc/MouseExited  built in (BYOND provides it)
rt.def("/atom/proc/MouseExited", undefined, false, { args: ["location", "control", "params"] });

// /atom/proc/MouseExited  (code/_onclick/hud/screentip.dm:28)
rt.def("/atom/proc/MouseExited", function MouseExited(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (!((truthy((M = live(f.usr))) && truthy(rt.fv(f, "hud_used", live(M)))) && truthy(rt.gv(f, "screentip_text", rt.fv(f, "hud_used", live(M)))))) return f.dot;
	rt.setFv(f, "maptext", rt.gv(f, "screentip_text", rt.fv(f, "hud_used", live(M))), "");
	return f.dot;
});

// /client/verb/toggle_screentips  (code/_onclick/hud/screentip.dm:37)
rt.def("/client/verb/toggle_screentips", function toggle_screentips(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	rt.setFv(f, "screentip_pref", rt.sv(f, "prefs"), (!truthy(rt.fv(f, "screentip_pref", rt.sv(f, "prefs"))) ? 1 : 0));
	if ((((!truthy(rt.fv(f, "screentip_pref", rt.sv(f, "prefs"))) && truthy(rt.sv(f, "mob"))) && truthy(rt.fv(f, "hud_used", rt.sv(f, "mob")))) && truthy(rt.gv(f, "screentip_text", rt.fv(f, "hud_used", rt.sv(f, "mob")))))) {
		rt.setFv(f, "maptext", rt.gv(f, "screentip_text", rt.fv(f, "hud_used", rt.sv(f, "mob"))), "");
	}
	$0 = live(f.src);
	$1 = "screentips";
	if (truthy(rt.fv(f, "screentip_pref", rt.sv(f, "prefs")))) {
		$2 = "true";
	} else {
		$2 = "false";
	}
	rt.call(f, P("/proc/winset"), null, [$0, $1, fmt("is-checked=＀", [$2])]);
	$0 = live(f.src);
	if (truthy(rt.fv(f, "screentip_pref", rt.sv(f, "prefs")))) {
		$1 = "on";
	} else {
		$1 = "off";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("Screentips are now ＀.", [$1])]);
	rt.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	return f.dot;
}, false, { hidden: true, verb: { name: "toggle-screentips", category: "OOC" } });
