// From code/_onclick/hud/monkey.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(76, "/datum/hud/monkey", "/datum/hud", {});

// /datum/hud/monkey/proc/New  (code/_onclick/hud/monkey.dm:2)  may sleep
rt.def("/datum/hud/monkey/proc/New", function* New(f: Frame) {
	let using: Value = null, inv_box: Value = null, inv: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [using, inv_box, inv, $0, $1, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = rt.rsc("icons/mob/screen_midnight.dmi");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	using = null;
	inv_box = null;
	rt.setSv(f, "action_intent", (yield* g.new_(f, T("/obj/screen/act_intent"), [])));
	rt.setFv(f, "icon", rt.sv(f, "action_intent"), live(f.args[1]));
	rt.setFv(f, "icon_state", rt.sv(f, "action_intent"), rt.fv(f, "a_intent", rt.sv(f, "mymob")));
	rt.setFv(f, "screen_loc", rt.sv(f, "action_intent"), "EAST-3:24,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", rt.sv(f, "action_intent"), add);
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/mov_intent"), []))), live(f.args[1]));
	$0 = live(using);
	if (isEqual(rt.fv(f, "m_intent", rt.sv(f, "mymob")), "run")) {
		$1 = "running";
	} else {
		$1 = "walking";
	}
	rt.setFv(f, "icon_state", $0, $1);
	rt.setFv(f, "screen_loc", live(using), "EAST-2:26,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/language_menu"), []))), live(f.args[1]));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/drop"), []))), live(f.args[1]));
	rt.setFv(f, "screen_loc", live(using), "EAST-1:28,SOUTH+1:7");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	yield* g.srcCall(f, "build_hand_slots", live(f.args[1]));
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/swap_hand"), []))), live(f.args[1]));
	rt.setFv(f, "icon_state", live(using), "swap_1_m");
	rt.setFv(f, "screen_loc", live(using), (yield* g.call(f, P("/proc/ui_swaphand_position"), null, [live(f.args[0]), 1])));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/swap_hand"), []))), live(f.args[1]));
	rt.setFv(f, "icon_state", live(using), "swap_2");
	rt.setFv(f, "screen_loc", live(using), (yield* g.call(f, P("/proc/ui_swaphand_position"), null, [live(f.args[0]), 2])));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "mask");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "icon_state", live(inv_box), "mask");
	rt.setFv(f, "screen_loc", live(inv_box), "CENTER-4:14,SOUTH:5");
	rt.setFv(f, "slot_id", live(inv_box), 2);
	rt.modSrcVar(f, "static_inventory", live(inv_box), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "neck");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "icon_state", live(inv_box), "neck");
	rt.setFv(f, "screen_loc", live(inv_box), "CENTER-3:15,SOUTH:5");
	rt.setFv(f, "slot_id", live(inv_box), 10);
	rt.modSrcVar(f, "static_inventory", live(inv_box), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "head");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "icon_state", live(inv_box), "head");
	rt.setFv(f, "screen_loc", live(inv_box), "CENTER-5:13,SOUTH:5");
	rt.setFv(f, "slot_id", live(inv_box), 11);
	rt.modSrcVar(f, "static_inventory", live(inv_box), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "back");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "icon_state", live(inv_box), "back");
	rt.setFv(f, "screen_loc", live(inv_box), "CENTER-2:16,SOUTH:5");
	rt.setFv(f, "slot_id", live(inv_box), 1);
	rt.modSrcVar(f, "static_inventory", live(inv_box), add);
	rt.setSv(f, "throw_icon", (yield* g.new_(f, T("/obj/screen/throw_catch"), [])));
	rt.setFv(f, "icon", rt.sv(f, "throw_icon"), live(f.args[1]));
	rt.setFv(f, "screen_loc", rt.sv(f, "throw_icon"), "EAST-1:28,SOUTH+1:7");
	rt.modSrcVar(f, "hotkeybuttons", rt.sv(f, "throw_icon"), add);
	rt.setSv(f, "internals", (yield* g.new_(f, T("/obj/screen/internals"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "internals"), add);
	rt.setSv(f, "healths", (yield* g.new_(f, T("/obj/screen/healths"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "healths"), add);
	rt.setSv(f, "pull_icon", (yield* g.new_(f, T("/obj/screen/pull"), [])));
	rt.setFv(f, "icon", rt.sv(f, "pull_icon"), live(f.args[1]));
	yield* g.callName(f, rt.sv(f, "pull_icon"), "update_icon", [rt.sv(f, "mymob")]);
	rt.setFv(f, "screen_loc", rt.sv(f, "pull_icon"), "EAST-2:26,SOUTH+1:7");
	rt.modSrcVar(f, "static_inventory", rt.sv(f, "pull_icon"), add);
	rt.setSv(f, "lingchemdisplay", (yield* g.new_(f, T("/obj/screen/ling/chems"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "lingchemdisplay"), add);
	rt.setSv(f, "lingstingdisplay", (yield* g.new_(f, T("/obj/screen/ling/sting"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "lingstingdisplay"), add);
	rt.setSv(f, "zone_select", (yield* g.new_(f, T("/obj/screen/zone_sel"), [])));
	rt.setFv(f, "icon", rt.sv(f, "zone_select"), live(f.args[1]));
	yield* g.callName(f, rt.sv(f, "zone_select"), "update_icon", [rt.sv(f, "mymob")]);
	rt.modSrcVar(f, "static_inventory", rt.sv(f, "zone_select"), add);
	rt.setFv(f, "screen", rt.fv(f, "client", rt.sv(f, "mymob")), rt.list());
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/resist"), []))), live(f.args[1]));
	rt.setFv(f, "screen_loc", live(using), "EAST-2:26,SOUTH+1:7");
	rt.modSrcVar(f, "hotkeybuttons", live(using), add);
	inv = null;
	rt.forList(f, 0, add(rt.sv(f, "static_inventory"), rt.sv(f, "toggleable_inventory")), T("/obj/screen/inventory"));
	while (($e = rt.next(f, 0)) !== undefined) {
		inv = $e;
		if (truthy(rt.fv(f, "slot_id", live(inv)))) {
			rt.setFv(f, "hud", live(inv), live(f.src));
			rt.setAt(rt.sv(f, "inv_slots"), rt.fv(f, "slot_id", live(inv)), live(inv));
			yield* g.callName(f, live(inv), "update_icon", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["owner", "ui_style"] });

// /datum/hud/monkey/proc/persistent_inventory_update  (code/_onclick/hud/monkey.dm:119)
rt.def("/datum/hud/monkey/proc/persistent_inventory_update", function persistent_inventory_update(f: Frame) {
	let M: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [M, I, $e];
	if (!truthy(rt.sv(f, "mymob"))) {
		return live(f.dot);
	}
	M = rt.sv(f, "mymob");
	if (truthy(rt.sv(f, "hud_shown"))) {
		if (truthy(rt.fv(f, "back", live(M)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "back", live(M)), "CENTER-2:16,SOUTH:5");
			rt.modField(f, rt.fv(f, "client", live(M)), "screen", rt.fv(f, "back", live(M)), add);
		}
		if (truthy(rt.fv(f, "wear_mask", live(M)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "wear_mask", live(M)), "CENTER-4:14,SOUTH:5");
			rt.modField(f, rt.fv(f, "client", live(M)), "screen", rt.fv(f, "wear_mask", live(M)), add);
		}
		if (truthy(rt.fv(f, "wear_neck", live(M)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "wear_neck", live(M)), "CENTER-3:15,SOUTH:5");
			rt.modField(f, rt.fv(f, "client", live(M)), "screen", rt.fv(f, "wear_neck", live(M)), add);
		}
		if (truthy(rt.fv(f, "head", live(M)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "head", live(M)), "CENTER-5:13,SOUTH:5");
			rt.modField(f, rt.fv(f, "client", live(M)), "screen", rt.fv(f, "head", live(M)), add);
		}
	} else {
		if (truthy(rt.fv(f, "back", live(M)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "back", live(M)), null);
		}
		if (truthy(rt.fv(f, "wear_mask", live(M)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "wear_mask", live(M)), null);
		}
		if (truthy(rt.fv(f, "head", live(M)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "head", live(M)), null);
		}
	}
	if (!isEqual(rt.sv(f, "hud_version"), 3)) {
		I = null;
		rt.forList(f, 0, rt.fv(f, "held_items", live(M)), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			rt.setFv(f, "screen_loc", live(I), rt.call(f, P("/proc/ui_hand_position"), null, [rt.callName(f, live(M), "get_held_index_of_item", [live(I)])]));
			rt.modField(f, rt.fv(f, "client", live(M)), "screen", live(I), add);
		}
		rt.endFor(f, 0);
	} else {
		I = null;
		rt.forList(f, 0, rt.fv(f, "held_items", live(M)), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			rt.setFv(f, "screen_loc", live(I), null);
			(rt.modField(f, rt.fv(f, "client", live(M)), "screen", live(I), subtract));
		}
		rt.endFor(f, 0);
	}
	return f.dot;
});

// /mob/living/carbon/monkey/proc/create_mob_hud  (code/_onclick/hud/monkey.dm:154)  may sleep
rt.def("/mob/living/carbon/monkey/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(truthy(rt.sv(f, "client")) && !truthy(rt.sv(f, "hud_used")))) return f.dot;
	rt.setSv(f, "hud_used", (yield* g.new_(f, T("/datum/hud/monkey"), [live(f.src), (yield* g.call(f, P("/proc/ui_style2icon"), null, [rt.gv(f, "UI_style", rt.fv(f, "prefs", rt.sv(f, "client")))]))])));
	return f.dot;
}, true);
