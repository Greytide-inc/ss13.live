// From code/_onclick/hud/hud.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(60, "/datum/hud", "/datum", {
	mymob: null,
	hud_shown: 1,
	hud_version: 1,
	inventory_shown: 0,
	show_intent_icons: 0,
	hotkey_ui_hidden: 0,
	lingchemdisplay: null,
	lingstingdisplay: null,
	blobpwrdisplay: null,
	alien_plasma_display: null,
	alien_queen_finder: null,
	devilsouldisplay: null,
	deity_power_display: null,
	deity_follower_display: null,
	nightvisionicon: null,
	action_intent: null,
	zone_select: null,
	pull_icon: null,
	throw_icon: null,
	module_store_icon: null,
	static_inventory: null,
	toggleable_inventory: null,
	hotkeybuttons: null,
	infodisplay: null,
	screenoverlays: null,
	inv_slots: null,
	hand_slots: null,
	plane_masters: null,
	screentip_text: null,
	hide_actions_toggle: null,
	action_buttons_hidden: 0,
	healths: null,
	healthdoll: null,
	internals: null,
	ui_style_icon: rt.rsc("icons/mob/screen_midnight.dmi"),
});

// /datum/hud/proc/<init>  (code/_onclick/hud/hud.dm:36)
rt.def("/datum/hud/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "static_inventory", rt.list());
	$0 = $0;
	rt.setSv(f, "toggleable_inventory", rt.list());
	$0 = $0;
	rt.setSv(f, "hotkeybuttons", rt.list());
	$0 = $0;
	rt.setSv(f, "infodisplay", rt.list());
	$0 = $0;
	rt.setSv(f, "screenoverlays", rt.list());
	$0 = $0;
	rt.setSv(f, "inv_slots", rt.op(f, "CreateMultidimensionalList", [1], [20]));
	$0 = $0;
	rt.setSv(f, "plane_masters", rt.list());
	return f.dot;
});

// /datum/hud/proc/New  (code/_onclick/hud/hud.dm:56)  may sleep
rt.def("/datum/hud/proc/New", function* New(f: Frame, owner: Value, ui_style: Value) {
	let mytype: Value = null, instance: Value = null;
	let $e: any;
	f.vars = () => [owner, ui_style, mytype, instance, $e];
	if (live(ui_style) === null) {
		ui_style = rt.rsc("icons/mob/screen_midnight.dmi");
	}
	rt.setSv(f, "mymob", live(owner));
	rt.setSv(f, "ui_style_icon", live(ui_style));
	rt.setSv(f, "hide_actions_toggle", (yield* g.new_(f, T("/obj/screen/movable/action_button/hide_toggle"), [])));
	yield* g.callName(f, rt.sv(f, "hide_actions_toggle"), "InitialiseIcon", [live(f.src)]);
	rt.setSv(f, "hand_slots", rt.list());
	rt.setSv(f, "screentip_text", (yield* g.new_(f, T("/obj/screen/screentip"), [])));
	rt.modSrcVar(f, "static_inventory", rt.sv(f, "screentip_text"), add);
	mytype = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/screen/plane_master")])), T("/obj/screen/plane_master")));
	while (($e = rt.next(f, 0)) !== undefined) {
		mytype = $e;
		instance = (yield* g.new_(f, live(mytype), []));
		rt.setAt(rt.sv(f, "plane_masters"), fmt("＀", [rt.fv(f, "plane", live(instance))]), live(instance));
		yield* g.callName(f, live(instance), "backdrop", [rt.sv(f, "mymob")]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/hud/proc/Destroy  (code/_onclick/hud/hud.dm:74)  may sleep
rt.def("/datum/hud/proc/Destroy", function* Destroy(f: Frame) {
	let thing: Value = null;
	let $e: any;
	f.vars = () => [thing, $e];
	if (isEqual(rt.fv(f, "hud_used", rt.sv(f, "mymob")), live(f.src))) {
		rt.setFv(f, "hud_used", rt.sv(f, "mymob"), null);
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "hide_actions_toggle")]);
	rt.setSv(f, "hide_actions_toggle", null);
	rt.setSv(f, "screentip_text", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "module_store_icon")]);
	rt.setSv(f, "module_store_icon", null);
	if (truthy(rt.len(f, rt.sv(f, "static_inventory")))) {
		thing = null;
		rt.forList(f, 0, rt.sv(f, "static_inventory"));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(thing)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.sv(f, "static_inventory"), "Cut", []);
	}
	yield* g.callName(f, rt.sv(f, "inv_slots"), "Cut", []);
	rt.setSv(f, "action_intent", null);
	rt.setSv(f, "zone_select", null);
	rt.setSv(f, "pull_icon", null);
	if (truthy(rt.len(f, rt.sv(f, "toggleable_inventory")))) {
		thing = null;
		rt.forList(f, 0, rt.sv(f, "toggleable_inventory"));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(thing)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.sv(f, "toggleable_inventory"), "Cut", []);
	}
	if (truthy(rt.len(f, rt.sv(f, "hotkeybuttons")))) {
		thing = null;
		rt.forList(f, 0, rt.sv(f, "hotkeybuttons"));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(thing)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.sv(f, "hotkeybuttons"), "Cut", []);
	}
	rt.setSv(f, "throw_icon", null);
	if (truthy(rt.len(f, rt.sv(f, "infodisplay")))) {
		thing = null;
		rt.forList(f, 0, rt.sv(f, "infodisplay"));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(thing)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.sv(f, "infodisplay"), "Cut", []);
	}
	rt.setSv(f, "healths", null);
	rt.setSv(f, "healthdoll", null);
	rt.setSv(f, "internals", null);
	rt.setSv(f, "lingchemdisplay", null);
	rt.setSv(f, "devilsouldisplay", null);
	rt.setSv(f, "lingstingdisplay", null);
	rt.setSv(f, "blobpwrdisplay", null);
	rt.setSv(f, "alien_plasma_display", null);
	rt.setSv(f, "alien_queen_finder", null);
	rt.setSv(f, "deity_power_display", null);
	rt.setSv(f, "deity_follower_display", null);
	rt.setSv(f, "nightvisionicon", null);
	if (truthy(rt.len(f, rt.sv(f, "plane_masters")))) {
		thing = null;
		rt.forList(f, 0, rt.sv(f, "plane_masters"));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing = $e;
			yield* g.call(f, P("/proc/qdel"), null, [rt.index(rt.sv(f, "plane_masters"), live(thing))]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.sv(f, "plane_masters"), "Cut", []);
	}
	if (truthy(rt.len(f, rt.sv(f, "screenoverlays")))) {
		thing = null;
		rt.forList(f, 0, rt.sv(f, "screenoverlays"));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(thing)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.sv(f, "screenoverlays"), "Cut", []);
	}
	rt.setSv(f, "mymob", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/proc/create_mob_hud  (code/_onclick/hud/hud.dm:138)  may sleep
rt.def("/mob/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(truthy(rt.sv(f, "client")) && !truthy(rt.sv(f, "hud_used")))) return f.dot;
	rt.setSv(f, "hud_used", (yield* g.new_(f, T("/datum/hud"), [live(f.src)])));
	yield* g.srcCall(f, "update_sight");
	return f.dot;
}, true);

// /datum/hud/proc/show_hud  (code/_onclick/hud/hud.dm:144)  may sleep
rt.def("/datum/hud/proc/show_hud", function* show_hud(f: Frame, version: Value, viewmob: Value) {
	let screenmob: Value = null, display_hud_version: Value = null, h: Value = null, hand: Value = null, thing: Value = null;
	let $0: any, $e: any;
	f.vars = () => [version, viewmob, screenmob, display_hud_version, h, hand, thing, $0, $e];
	if (live(version) === null) {
		version = 0;
	}
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "mymob")])))) {
		return 0;
	}
	if (!truthy(rt.gv(f, "client", (screenmob = (live(viewmob) || rt.sv(f, "mymob")))))) {
		return 0;
	}
	rt.setFv(f, "screen", rt.fv(f, "client", live(screenmob)), rt.list());
	if (!truthy((display_hud_version = live(version)))) {
		display_hud_version = add(rt.sv(f, "hud_version"), 1);
	}
	if (rt.gt(live(display_hud_version), 3)) {
		display_hud_version = 1;
	}
	$0 = live(display_hud_version);
	if ($0 === 1) {
		rt.setSv(f, "hud_shown", 1);
		if (truthy(rt.len(f, rt.sv(f, "static_inventory")))) {
			rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.sv(f, "static_inventory"), add);
		}
		if (((truthy(rt.len(f, rt.sv(f, "toggleable_inventory"))) && truthy(rt.fv(f, "hud_used", live(screenmob)))) && truthy(rt.gv(f, "inventory_shown", rt.fv(f, "hud_used", live(screenmob)))))) {
			rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.sv(f, "toggleable_inventory"), add);
		}
		if ((truthy(rt.len(f, rt.sv(f, "hotkeybuttons"))) && !truthy(rt.sv(f, "hotkey_ui_hidden")))) {
			rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.sv(f, "hotkeybuttons"), add);
		}
		if (truthy(rt.len(f, rt.sv(f, "infodisplay")))) {
			rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.sv(f, "infodisplay"), add);
		}
		rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.sv(f, "hide_actions_toggle"), add);
		if (truthy(rt.sv(f, "action_intent"))) {
			rt.setFv(f, "screen_loc", rt.sv(f, "action_intent"), rt.initial(f, rt.sv(f, "action_intent"), "screen_loc"));
		}
	} else if ($0 === 2) {
		rt.setSv(f, "hud_shown", 0);
		if (truthy(rt.len(f, rt.sv(f, "static_inventory")))) {
			(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.sv(f, "static_inventory"), subtract));
		}
		if (truthy(rt.len(f, rt.sv(f, "toggleable_inventory")))) {
			(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.sv(f, "toggleable_inventory"), subtract));
		}
		if (truthy(rt.len(f, rt.sv(f, "hotkeybuttons")))) {
			(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.sv(f, "hotkeybuttons"), subtract));
		}
		if (truthy(rt.len(f, rt.sv(f, "infodisplay")))) {
			rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.sv(f, "infodisplay"), add);
		}
		h = null;
		rt.forList(f, 0, rt.sv(f, "hand_slots"));
		while (($e = rt.next(f, 0)) !== undefined) {
			h = $e;
			if (truthy((hand = rt.index(rt.sv(f, "hand_slots"), live(h))))) {
				rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", live(hand), add);
			}
		}
		rt.endFor(f, 0);
		if (truthy(rt.sv(f, "action_intent"))) {
			rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.sv(f, "action_intent"), add);
			rt.setFv(f, "screen_loc", rt.sv(f, "action_intent"), "EAST-1:28,SOUTH:5");
		}
	} else if ($0 === 3) {
		rt.setSv(f, "hud_shown", 0);
		if (truthy(rt.len(f, rt.sv(f, "static_inventory")))) {
			(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.sv(f, "static_inventory"), subtract));
		}
		if (truthy(rt.len(f, rt.sv(f, "toggleable_inventory")))) {
			(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.sv(f, "toggleable_inventory"), subtract));
		}
		if (truthy(rt.len(f, rt.sv(f, "hotkeybuttons")))) {
			(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.sv(f, "hotkeybuttons"), subtract));
		}
		if (truthy(rt.len(f, rt.sv(f, "infodisplay")))) {
			(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.sv(f, "infodisplay"), subtract));
		}
	}
	thing = null;
	rt.forList(f, 0, rt.sv(f, "plane_masters"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.index(rt.sv(f, "plane_masters"), live(thing)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "hud_version", live(display_hud_version));
	yield* g.srcCall(f, "persistent_inventory_update", live(screenmob));
	yield* g.callName(f, rt.sv(f, "mymob"), "update_action_buttons", [1]);
	yield* g.srcCall(f, "reorganize_alerts");
	yield* g.callName(f, rt.sv(f, "mymob"), "reload_fullscreen", []);
	yield* g.srcCall(f, "update_parallax_pref", live(screenmob));
	return f.dot;
}, true);

// /datum/hud/human/proc/show_hud  (code/_onclick/hud/hud.dm:217)  may sleep
rt.def("/datum/hud/human/proc/show_hud", function* show_hud(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "hidden_inventory_update", live(f.args[1]));
	return f.dot;
}, true, { args: ["version", "viewmob"] });

// /datum/hud/robot/proc/show_hud  (code/_onclick/hud/hud.dm:221)  may sleep
rt.def("/datum/hud/robot/proc/show_hud", function* show_hud(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_robot_modules_display");
	return f.dot;
}, true, { args: ["version", "viewmob"] });

// /datum/hud/proc/persistent_inventory_update  (code/_onclick/hud/hud.dm:228)
rt.def("/datum/hud/proc/persistent_inventory_update", function persistent_inventory_update(f: Frame, viewer: Value) {
	if (truthy(rt.sv(f, "mymob"))) return f.dot;
	return live(f.dot);
});

// /mob/verb/button_pressed_F12  (code/_onclick/hud/hud.dm:236)  may sleep
rt.def("/mob/verb/button_pressed_F12", function* button_pressed_F12(f: Frame) {
	if ((truthy(rt.sv(f, "hud_used")) && truthy(rt.sv(f, "client")))) {
		yield* g.callName(f, rt.sv(f, "hud_used"), "show_hud", []);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class ='info'>Switched HUD mode. Press F12 to toggle.</span>"]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class ='warning'>This mob type does not use a HUD.</span>"]);
	}
	return f.dot;
}, true, { hidden: true, verb: { name: "F12" } });

// /datum/hud/proc/build_hand_slots  (code/_onclick/hud/hud.dm:247)  may sleep
rt.def("/datum/hud/proc/build_hand_slots", function* build_hand_slots(f: Frame, ui_style: Value) {
	let h: Value = null, H: Value = null, hand_box: Value = null, i: Value = null, SH: Value = null, E: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [ui_style, h, H, hand_box, i, SH, E, $0, $1, $2, $e];
	if (live(ui_style) === null) {
		ui_style = rt.rsc("icons/mob/screen_midnight.dmi");
	}
	h = null;
	rt.forList(f, 0, rt.sv(f, "hand_slots"));
	while (($e = rt.next(f, 0)) !== undefined) {
		h = $e;
		if (truthy((H = rt.index(rt.sv(f, "hand_slots"), live(h))))) {
			(rt.modSrcVar(f, "static_inventory", live(H), subtract));
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "hand_slots", rt.list());
	hand_box = null;
	i = null;
	rt.forRange(f, 0, 1, rt.getLen(f, rt.fv(f, "held_items", rt.sv(f, "mymob"))), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.setFv(f, "name", (hand_box = (yield* g.new_(f, T("/obj/screen/inventory/hand"), []))), (yield* g.callName(f, rt.sv(f, "mymob"), "get_held_index_name", [live(i)])));
		rt.setFv(f, "icon", live(hand_box), live(ui_style));
		rt.setFv(f, "icon_state", live(hand_box), fmt("hand_＀", [(yield* g.callName(f, rt.sv(f, "mymob"), "held_index_to_dir", [live(i)]))]));
		rt.setFv(f, "screen_loc", live(hand_box), (yield* g.call(f, P("/proc/ui_hand_position"), null, [live(i)])));
		rt.setFv(f, "held_index", live(hand_box), live(i));
		rt.setAt(rt.sv(f, "hand_slots"), fmt("＀", [live(i)]), live(hand_box));
		rt.setFv(f, "hud", live(hand_box), live(f.src));
		rt.modSrcVar(f, "static_inventory", live(hand_box), add);
		yield* g.callName(f, live(hand_box), "update_icon", []);
	}
	rt.endFor(f, 0);
	i = 1;
	SH = null;
	rt.forList(f, 0, rt.sv(f, "static_inventory"), T("/obj/screen/swap_hand"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SH = $e;
		$0 = live(SH);
		$1 = rt.sv(f, "mymob");
		if (!truthy(rt.modulus(live(i), 2))) {
			$2 = 2;
		} else {
			$2 = 1;
		}
		rt.setFv(f, "screen_loc", $0, (yield* g.call(f, P("/proc/ui_swaphand_position"), null, [$1, $2])));
		i = rt.inc(live(i), 1);
	}
	rt.endFor(f, 0);
	E = null;
	rt.forList(f, 0, rt.sv(f, "static_inventory"), T("/obj/screen/human/equip"));
	while (($e = rt.next(f, 0)) !== undefined) {
		E = $e;
		rt.setFv(f, "screen_loc", live(E), (yield* g.call(f, P("/proc/ui_equip_position"), null, [rt.sv(f, "mymob")])));
	}
	rt.endFor(f, 0);
	if (!truthy(rt.fv(f, "hud_used", rt.sv(f, "mymob")))) return f.dot;
	yield* g.srcCall(f, "show_hud", 1, rt.sv(f, "mymob"));
	return f.dot;
}, true);
