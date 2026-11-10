// Based on /tg/station's code/_onclick/hud/_defines.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// _defines.dm:39
rt.def("/proc/ui_hand_position", function ui_hand_position(f: Frame, i: Value) {
	let x_off: Value = -(!(i % 2) ? 1 : 0);
	let y_off: Value = round((i - 1) / 2);
	return `CENTER+${x_off}:16,SOUTH+${y_off}:5`;
});

// _defines.dm:44
rt.def("/proc/ui_equip_position", function ui_equip_position(f: Frame, M: Value) {
	let y_off: Value = null;
	return `CENTER:-16,SOUTH+${(y_off = round((rt.len(f, M.held_items) - 1) / 2)) + 1}:5`;
});

// _defines.dm:48
rt.def("/proc/ui_swaphand_position", function ui_swaphand_position(f: Frame, M: Value, which: Value) {
	which ??= 1;
	let x_off: Value = which == 1 ? -1 : 0;
	let y_off: Value = round((rt.len(f, M.held_items) - 1) / 2);
	return `CENTER+${x_off}:16,SOUTH+${y_off + 1}:5`;
});
