// From code/_onclick/hud/_defines.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/ui_hand_position  (code/_onclick/hud/_defines.dm:39)
rt.def("/proc/ui_hand_position", function ui_hand_position(f: Frame, i: Value) {
	let x_off: Value = null, y_off: Value = null;
	f.vars = () => [x_off, y_off];
	x_off = rt.neg((!truthy(rt.modulus(live(i), 2)) ? 1 : 0));
	y_off = rt.call(f, P("/proc/round"), null, [divide(subtract(live(i), 1), 2)]);
	return fmt("CENTER+＀:16,SOUTH+＀:5", [live(x_off), live(y_off)]);
});

// /proc/ui_equip_position  (code/_onclick/hud/_defines.dm:44)
rt.def("/proc/ui_equip_position", function ui_equip_position(f: Frame, M: Value) {
	let y_off: Value = null;
	f.vars = () => [y_off];
	return fmt("CENTER:-16,SOUTH+＀:5", [add((y_off = rt.call(f, P("/proc/round"), null, [divide(subtract(rt.getLen(f, rt.fv(f, "held_items", live(M))), 1), 2)])), 1)]);
});

// /proc/ui_swaphand_position  (code/_onclick/hud/_defines.dm:48)
rt.def("/proc/ui_swaphand_position", function ui_swaphand_position(f: Frame, M: Value, which: Value) {
	let x_off: Value = null, y_off: Value = null;
	let $0: any;
	f.vars = () => [which, x_off, y_off, $0];
	if (live(which) === null) {
		which = 1;
	}
	if (isEqual(live(which), 1)) {
		$0 = -1;
	} else {
		$0 = 0;
	}
	x_off = $0;
	y_off = rt.call(f, P("/proc/round"), null, [divide(subtract(rt.getLen(f, rt.fv(f, "held_items", live(M))), 1), 2)]);
	return fmt("CENTER+＀:16,SOUTH+＀:5", [live(x_off), add(live(y_off), 1)]);
});
