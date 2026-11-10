// Based on /tg/station's code/_onclick/hud/action_button.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11002, "/obj/screen/movable/action_button", "/obj/screen/movable", {
	linked_action: null,
	actiontooltipstyle: "",
	button_icon_state: null,
	appearance_cache: null,
	screen_loc: null,
});

// action_button.dm:12
rt.def("/obj/screen/movable/action_button/proc/Click", function* Click(f: Frame, location: Value, control: Value, params: Value) {
	let modifiers: Value = null;
	if (rt.index((modifiers = params2list(params)), "shift")) {
		this.moved = 0;
		yield* f.usr.update_action_buttons();
		return 1;
	}
	if (f.usr.next_click > rt.worldTime(f)) {
		return f.dot;
	}
	f.usr.next_click = rt.worldTime(f) + 1;
	yield* this.linked_action.Trigger();
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

// action_button.dm:35
rt.def("/obj/screen/movable/action_button/hide_toggle/proc/Click", function* Click(f: Frame, location: Value, control: Value, params: Value) {
	let modifiers: Value = null, V: Value = null, A: Value = null, B: Value = null;
	if (rt.index((modifiers = params2list(params)), "shift")) {
		this.moved = 0;
		yield* f.usr.update_action_buttons(1);
		return 1;
	}
	if (rt.at(modifiers, "alt")) {
		for (V of each(f.usr.actions)) {
			A = V;
			(B = A.button).moved = 0;
		}
		this.moved = 0;
		yield* f.usr.update_action_buttons(1);
		to_chat(f.usr, "<span class='notice'>Action button positions have been reset.</span>");
		return 1;
	}
	f.usr.hud_used.action_buttons_hidden = (!f.usr.hud_used.action_buttons_hidden ? 1 : 0);
	this.hidden = f.usr.hud_used.action_buttons_hidden;
	if (this.hidden) {
		this.name = "Show Buttons";
	} else {
		this.name = "Hide Buttons";
	}
	this.UpdateIcon();
	yield* f.usr.update_action_buttons();
	return f.dot;
}, true);

// action_button.dm:60
rt.def("/obj/screen/movable/action_button/hide_toggle/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	let V: Value = null, A: Value = null, B: Value = null;
	for (V of each(user.actions)) {
		A = V;
		(B = A.button).moved = 0;
	}
	if (this.moved) {
		this.moved = 0;
	}
	yield* user.update_action_buttons(1);
	to_chat(user, "<span class='notice'>Action button positions have been reset.</span>");
	return f.dot;
}, true);

// action_button.dm:71
rt.def("/obj/screen/movable/action_button/hide_toggle/proc/InitialiseIcon", function InitialiseIcon(f: Frame, owner_hud: Value) {
	let settings: Value = null;
	this.icon = rt.index((settings = owner_hud.get_action_buttons_icons()), "bg_icon");
	this.icon_state = rt.at(settings, "bg_state");
	this.hide_icon = rt.at(settings, "toggle_icon");
	this.hide_state = rt.at(settings, "toggle_hide");
	this.show_state = rt.at(settings, "toggle_show");
	this.UpdateIcon();
	return f.dot;
});

// action_button.dm:80
rt.def("/obj/screen/movable/action_button/hide_toggle/proc/UpdateIcon", function UpdateIcon(f: Frame) {
	this.cut_overlays();
	let $0: any = this.hide_icon;
	this.add_overlay(mutable_appearance($0, this.hidden ? this.show_state : this.hide_state));
	return f.dot;
});

// action_button.dm:85
rt.def("/obj/screen/movable/action_button/proc/MouseEntered", function MouseEntered(f: Frame, location: Value, control: Value, params: Value) {
	openToolTip(f.usr, this, params, { title: this.name, content: this.desc, theme: this.actiontooltipstyle });
	return f.dot;
});

// action_button.dm:89
rt.def("/obj/screen/movable/action_button/proc/MouseExited", function MouseExited(f: Frame) {
	closeToolTip(f.usr);
	return f.dot;
});

// action_button.dm:92
rt.def("/datum/hud/proc/get_action_buttons_icons", function get_action_buttons_icons(f: Frame) {
	f.dot = list();
	rt.setAt(f.dot, "bg_icon", this.ui_style_icon);
	rt.setAt(f.dot, "bg_state", "template");
	rt.setAt(f.dot, "toggle_icon", rt.rsc("icons/mob/actions.dmi"));
	rt.setAt(f.dot, "toggle_hide", "hide");
	rt.setAt(f.dot, "toggle_show", "show");
	return f.dot;
});

// action_button.dm:104
rt.def("/mob/proc/update_action_buttons_icon", function* update_action_buttons_icon(f: Frame, status_only: Value) {
	let X: Value = null, A: Value = null;
	status_only ??= 0;
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon(status_only);
	}
	return f.dot;
}, true);

// action_button.dm:110
rt.def("/mob/proc/update_action_buttons", function* update_action_buttons(f: Frame, reload_screen: Value) {
	let A: Value = null, B: Value = null;
	if (!this.hud_used || !this.client) {
		return f.dot;
	}
	if (this.hud_used.hud_shown != HUD_STYLE_STANDARD) {
		return f.dot;
	}
	let button_number: Value = 0;
	if (this.hud_used.action_buttons_hidden) {
		for (A of each(this.actions, T("/datum/action"))) {
			A.button.screen_loc = null;
			if (reload_screen) {
				this.client.screen += A.button;
			}
		}
	} else {
		A = null;
		for (A of each(this.actions, T("/datum/action"))) {
			button_number++;
			yield* A.UpdateButtonIcon();
			if (!(B = A.button).moved) {
				B.screen_loc = this.hud_used.ButtonNumberToScreenCoords(button_number);
			} else {
				B.screen_loc = B.moved;
			}
			if (reload_screen) {
				this.client.screen += B;
			}
		}
		if (!button_number) {
			this.hud_used.hide_actions_toggle.screen_loc = null;
			return f.dot;
		}
	}
	if (!this.hud_used.hide_actions_toggle.moved) {
		this.hud_used.hide_actions_toggle.screen_loc = this.hud_used.ButtonNumberToScreenCoords(button_number + 1);
	} else {
		this.hud_used.hide_actions_toggle.screen_loc = this.hud_used.hide_actions_toggle.moved;
	}
	if (!reload_screen) return f.dot;
	this.client.screen += this.hud_used.hide_actions_toggle;
	return f.dot;
}, true);

// action_button.dm:151
rt.def("/datum/hud/proc/ButtonNumberToScreenCoords", function ButtonNumberToScreenCoords(f: Frame, number: Value) {
	let row: Value = round((number - 1) / AB_MAX_COLUMNS);
	let col: Value = (number - 1) % AB_MAX_COLUMNS + 1;
	let coord_col: Value = `+${col - 1}`;
	let coord_col_offset: Value = 4 + 2 * col;
	let coord_row: Value = `${row ? -row : "+0"}`;
	return `WEST${coord_col}:${coord_col_offset},NORTH${coord_row}:-6`;
});
