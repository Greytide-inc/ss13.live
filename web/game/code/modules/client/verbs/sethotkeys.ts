// Based on /tg/station's code/modules/client/verbs/sethotkeys.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// sethotkeys.dm:8
rt.def("/client/verb/sethotkeys", function sethotkeys(f: Frame, from_pref: Value) {
	from_pref ??= 0;
	let hotkey_macro: Value = "hotkeys";
	if (this.mob) {
		hotkey_macro = this.mob.macro_hotkeys;
	}
	winset(this, null, `mainwindow.macro=${hotkey_macro} mapwindow.map.focus=true input.background-color=#e0e0e0`);
	return f.dot;
}, false, { waitfor: false, hidden: true, verb: { name: "Set Hotkeys", desc: "Used to set mob-specific hotkeys" }, argTypes: [{ type: 32 }] });
