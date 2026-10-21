// From code/modules/client/verbs/sethotkeys.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/verb/sethotkeys  (code/modules/client/verbs/sethotkeys.dm:8)
rt.def("/client/verb/sethotkeys", function sethotkeys(f: Frame, from_pref: Value) {
	let hotkey_macro: Value = null;
	f.vars = () => [from_pref, hotkey_macro];
	if (live(from_pref) === null) {
		from_pref = 0;
	}
	hotkey_macro = "hotkeys";
	if (truthy(rt.sv(f, "mob"))) {
		hotkey_macro = rt.fv(f, "macro_hotkeys", rt.sv(f, "mob"));
	}
	rt.call(f, P("/proc/winset"), null, [live(f.src), null, fmt("mainwindow.macro=＀ mapwindow.map.focus=true input.background-color=#e0e0e0", [live(hotkey_macro)])]);
	return f.dot;
}, false, { waitfor: false, hidden: true, verb: { name: "Set Hotkeys", desc: "Used to set mob-specific hotkeys" }, argTypes: [{ type: 32 }] });
