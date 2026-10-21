// From code/_onclick/hud/action_button.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11002, "/obj/screen/movable/action_button", "/obj/screen/movable", {
	linked_action: null,
	actiontooltipstyle: "",
	button_icon_state: null,
	appearance_cache: null,
	screen_loc: null,
});

// /obj/screen/movable/action_button/proc/Click  (code/_onclick/hud/action_button.dm:12)  may sleep
rt.def("/obj/screen/movable/action_button/proc/Click", function* Click(f: Frame, location: Value, control: Value, params: Value) {
	let modifiers: Value = null;
	f.vars = () => [location, control, params, modifiers];
	if (truthy(rt.index((modifiers = (yield* g.call(f, P("/proc/params2list"), null, [live(params)]))), "shift"))) {
		rt.setSv(f, "moved", 0);
		yield* g.callName(f, live(f.usr), "update_action_buttons", []);
		return 1;
	}
	if (rt.gt(rt.fv(f, "next_click", live(f.usr)), rt.worldTime(f))) {
		return live(f.dot);
	}
	rt.setFv(f, "next_click", live(f.usr), add(rt.worldTime(f), 1));
	yield* g.callName(f, rt.sv(f, "linked_action"), "Trigger", []);
	return 1;
}, true);

rt.type(11003, "/obj/screen/movable/action_button/hide_toggle", "/obj/screen/movable/action_button", {
	hidden: 0,
	hide_icon: rt.rsc("icons/mob/actions.dmi"),
	hide_state: "hide",
	show_state: "show",
	name: "Hide Buttons",
	desc: "Shift-click any button to reset its position. Alt-click to reset all buttons to their default positions.",
	icon: rt.rsc("icons/mob/actions.dmi"),
	icon_state: "bg_default",
});

// /obj/screen/movable/action_button/hide_toggle/proc/Click  (code/_onclick/hud/action_button.dm:35)  may sleep
rt.def("/obj/screen/movable/action_button/hide_toggle/proc/Click", function* Click(f: Frame, location: Value, control: Value, params: Value) {
	let modifiers: Value = null, V: Value = null, A: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [location, control, params, modifiers, V, A, B, $e];
	if (truthy(rt.index((modifiers = (yield* g.call(f, P("/proc/params2list"), null, [live(params)]))), "shift"))) {
		rt.setSv(f, "moved", 0);
		yield* g.callName(f, live(f.usr), "update_action_buttons", [1]);
		return 1;
	}
	if (truthy(rt.at(live(modifiers), "alt"))) {
		V = null;
		rt.forList(f, 0, rt.fv(f, "actions", live(f.usr)));
		while (($e = rt.next(f, 0)) !== undefined) {
			V = $e;
			A = live(V);
			rt.setFv(f, "moved", (B = rt.fv(f, "button", live(A))), 0);
		}
		rt.endFor(f, 0);
		rt.setSv(f, "moved", 0);
		yield* g.callName(f, live(f.usr), "update_action_buttons", [1]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Action button positions have been reset.</span>"]);
		return 1;
	}
	rt.setFv(f, "action_buttons_hidden", rt.fv(f, "hud_used", live(f.usr)), (!truthy(rt.gv(f, "action_buttons_hidden", rt.fv(f, "hud_used", live(f.usr)))) ? 1 : 0));
	rt.setSv(f, "hidden", rt.gv(f, "action_buttons_hidden", rt.fv(f, "hud_used", live(f.usr))));
	if (truthy(rt.sv(f, "hidden"))) {
		rt.setSv(f, "name", "Show Buttons");
	} else {
		rt.setSv(f, "name", "Hide Buttons");
	}
	yield* g.srcCall(f, "UpdateIcon");
	yield* g.callName(f, live(f.usr), "update_action_buttons", []);
	return f.dot;
}, true);

// /obj/screen/movable/action_button/hide_toggle/proc/AltClick  (code/_onclick/hud/action_button.dm:60)  may sleep
rt.def("/obj/screen/movable/action_button/hide_toggle/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	let V: Value = null, A: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [user, V, A, B, $e];
	V = null;
	rt.forList(f, 0, rt.fv(f, "actions", live(user)));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		A = live(V);
		rt.setFv(f, "moved", (B = rt.fv(f, "button", live(A))), 0);
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "moved"))) {
		rt.setSv(f, "moved", 0);
	}
	yield* g.callName(f, live(user), "update_action_buttons", [1]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Action button positions have been reset.</span>"]);
	return f.dot;
}, true);

// /obj/screen/movable/action_button/hide_toggle/proc/InitialiseIcon  (code/_onclick/hud/action_button.dm:71)
rt.def("/obj/screen/movable/action_button/hide_toggle/proc/InitialiseIcon", function InitialiseIcon(f: Frame, owner_hud: Value) {
	let settings: Value = null;
	f.vars = () => [settings];
	rt.setSv(f, "icon", rt.index((settings = rt.callName(f, live(owner_hud), "get_action_buttons_icons", [])), "bg_icon"));
	rt.setSv(f, "icon_state", rt.at(live(settings), "bg_state"));
	rt.setSv(f, "hide_icon", rt.at(live(settings), "toggle_icon"));
	rt.setSv(f, "hide_state", rt.at(live(settings), "toggle_hide"));
	rt.setSv(f, "show_state", rt.at(live(settings), "toggle_show"));
	rt.callSrc(f, "UpdateIcon", []);
	return f.dot;
});

// /obj/screen/movable/action_button/hide_toggle/proc/UpdateIcon  (code/_onclick/hud/action_button.dm:80)
rt.def("/obj/screen/movable/action_button/hide_toggle/proc/UpdateIcon", function UpdateIcon(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSrc(f, "cut_overlays", []);
	$0 = rt.sv(f, "hide_icon");
	if (truthy(rt.sv(f, "hidden"))) {
		$1 = rt.sv(f, "show_state");
	} else {
		$1 = rt.sv(f, "hide_state");
	}
	rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [$0, $1])]);
	return f.dot;
});

// /obj/screen/movable/action_button/proc/MouseEntered  (code/_onclick/hud/action_button.dm:85)
rt.def("/obj/screen/movable/action_button/proc/MouseEntered", function MouseEntered(f: Frame, location: Value, control: Value, params: Value) {
	rt.call(f, P("/proc/openToolTip"), null, [null, live(f.usr), null, live(f.src), null, live(params), "title", rt.sv(f, "name"), "content", rt.sv(f, "desc"), "theme", rt.sv(f, "actiontooltipstyle")], rt.Args.Named);
	return f.dot;
});

// /obj/screen/movable/action_button/proc/MouseExited  (code/_onclick/hud/action_button.dm:89)
rt.def("/obj/screen/movable/action_button/proc/MouseExited", function MouseExited(f: Frame) {
	rt.call(f, P("/proc/closeToolTip"), null, [live(f.usr)]);
	return f.dot;
});

// /datum/hud/proc/get_action_buttons_icons  (code/_onclick/hud/action_button.dm:92)
rt.def("/datum/hud/proc/get_action_buttons_icons", function get_action_buttons_icons(f: Frame) {
	f.dot = rt.list();
	rt.setAt(live(f.dot), "bg_icon", rt.sv(f, "ui_style_icon"));
	rt.setAt(live(f.dot), "bg_state", "template");
	rt.setAt(live(f.dot), "toggle_icon", rt.rsc("icons/mob/actions.dmi"));
	rt.setAt(live(f.dot), "toggle_hide", "hide");
	rt.setAt(live(f.dot), "toggle_show", "show");
	return f.dot;
});

// /mob/proc/update_action_buttons_icon  (code/_onclick/hud/action_button.dm:104)  may sleep
rt.def("/mob/proc/update_action_buttons_icon", function* update_action_buttons_icon(f: Frame, status_only: Value) {
	let X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [status_only, X, A, $e];
	if (live(status_only) === null) {
		status_only = 0;
	}
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", [live(status_only)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/proc/update_action_buttons  (code/_onclick/hud/action_button.dm:110)  may sleep
rt.def("/mob/proc/update_action_buttons", function* update_action_buttons(f: Frame, reload_screen: Value) {
	let button_number: Value = null, A: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [reload_screen, button_number, A, B, $e];
	if ((!truthy(rt.sv(f, "hud_used")) || !truthy(rt.sv(f, "client")))) {
		return live(f.dot);
	}
	if (!isEqual(rt.fv(f, "hud_shown", rt.sv(f, "hud_used")), 1)) {
		return live(f.dot);
	}
	button_number = 0;
	if (truthy(rt.fv(f, "action_buttons_hidden", rt.sv(f, "hud_used")))) {
		A = null;
		rt.forList(f, 0, rt.sv(f, "actions"), T("/datum/action"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			rt.setFv(f, "screen_loc", rt.fv(f, "button", live(A)), null);
			if (truthy(live(reload_screen))) {
				rt.modField(f, rt.sv(f, "client"), "screen", rt.fv(f, "button", live(A)), add);
			}
		}
		rt.endFor(f, 0);
	} else {
		A = null;
		rt.forList(f, 0, rt.sv(f, "actions"), T("/datum/action"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			button_number = rt.inc(live(button_number), 1);
			yield* g.callName(f, live(A), "UpdateButtonIcon", []);
			if (!truthy(rt.gv(f, "moved", (B = rt.fv(f, "button", live(A)))))) {
				rt.setFv(f, "screen_loc", live(B), (yield* g.callName(f, rt.sv(f, "hud_used"), "ButtonNumberToScreenCoords", [live(button_number)])));
			} else {
				rt.setFv(f, "screen_loc", live(B), rt.fv(f, "moved", live(B)));
			}
			if (truthy(live(reload_screen))) {
				rt.modField(f, rt.sv(f, "client"), "screen", live(B), add);
			}
		}
		rt.endFor(f, 0);
		if (!truthy(live(button_number))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "hide_actions_toggle", rt.sv(f, "hud_used")), null);
			return live(f.dot);
		}
	}
	if (!truthy(rt.gv(f, "moved", rt.fv(f, "hide_actions_toggle", rt.sv(f, "hud_used"))))) {
		rt.setFv(f, "screen_loc", rt.fv(f, "hide_actions_toggle", rt.sv(f, "hud_used")), (yield* g.callName(f, rt.sv(f, "hud_used"), "ButtonNumberToScreenCoords", [add(live(button_number), 1)])));
	} else {
		rt.setFv(f, "screen_loc", rt.fv(f, "hide_actions_toggle", rt.sv(f, "hud_used")), rt.gv(f, "moved", rt.fv(f, "hide_actions_toggle", rt.sv(f, "hud_used"))));
	}
	if (!truthy(live(reload_screen))) return f.dot;
	rt.modField(f, rt.sv(f, "client"), "screen", rt.fv(f, "hide_actions_toggle", rt.sv(f, "hud_used")), add);
	return f.dot;
}, true);

// /datum/hud/proc/ButtonNumberToScreenCoords  (code/_onclick/hud/action_button.dm:151)
rt.def("/datum/hud/proc/ButtonNumberToScreenCoords", function ButtonNumberToScreenCoords(f: Frame, number: Value) {
	let row: Value = null, col: Value = null, coord_col: Value = null, coord_col_offset: Value = null, coord_row: Value = null;
	let $0: any;
	f.vars = () => [row, col, coord_col, coord_col_offset, coord_row, $0];
	row = rt.call(f, P("/proc/round"), null, [divide(subtract(live(number), 1), 10)]);
	col = add(rt.modulus(subtract(live(number), 1), 10), 1);
	coord_col = fmt("+＀", [subtract(live(col), 1)]);
	coord_col_offset = add(4, multiply(2, live(col)));
	if (truthy(live(row))) {
		$0 = rt.neg(live(row));
	} else {
		$0 = "+0";
	}
	coord_row = fmt("＀", [$0]);
	return fmt("WEST＀:＀,NORTH＀:-6", [live(coord_col), live(coord_col_offset), live(coord_row)]);
});

// /datum/hud/proc/SetButtonCoords  (code/_onclick/hud/action_button.dm:162)
rt.def("/datum/hud/proc/SetButtonCoords", function SetButtonCoords(f: Frame, button: Value, number: Value) {
	let row: Value = null, col: Value = null, x_offset: Value = null, y_offset: Value = null, M: Value = null;
	f.vars = () => [row, col, x_offset, y_offset, M];
	row = rt.call(f, P("/proc/round"), null, [divide(subtract(live(number), 1), 10)]);
	col = add(rt.modulus(subtract(live(number), 1), 10), 1);
	x_offset = add(add(multiply(32, subtract(live(col), 1)), 4), multiply(2, live(col)));
	y_offset = add(multiply(-32, add(live(row), 1)), 26);
	rt.callName(f, (M = rt.call(f, P("/proc/matrix"), null, [])), "Translate", [live(x_offset), live(y_offset)]);
	rt.setFv(f, "transform", live(button), live(M));
	return f.dot;
});
