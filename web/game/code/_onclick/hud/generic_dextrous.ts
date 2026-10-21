// From code/_onclick/hud/generic_dextrous.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(69, "/datum/hud/dextrous", "/datum/hud", {});

// /datum/hud/dextrous/proc/New  (code/_onclick/hud/generic_dextrous.dm:3)  may sleep
rt.def("/datum/hud/dextrous/proc/New", function* New(f: Frame) {
	let using: Value = null, inv: Value = null;
	let $e: any;
	f.vars = () => [using, inv, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = rt.rsc("icons/mob/screen_midnight.dmi");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	using = null;
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/drop"), []))), live(f.args[1]));
	rt.setFv(f, "screen_loc", live(using), "CENTER+1:18,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setSv(f, "pull_icon", (yield* g.new_(f, T("/obj/screen/pull"), [])));
	rt.setFv(f, "icon", rt.sv(f, "pull_icon"), live(f.args[1]));
	yield* g.callName(f, rt.sv(f, "pull_icon"), "update_icon", [rt.sv(f, "mymob")]);
	rt.setFv(f, "screen_loc", rt.sv(f, "pull_icon"), "CENTER+2:2,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", rt.sv(f, "pull_icon"), add);
	yield* g.srcCall(f, "build_hand_slots", live(f.args[1]));
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/swap_hand"), []))), live(f.args[1]));
	rt.setFv(f, "icon_state", live(using), "swap_1_m");
	rt.setFv(f, "screen_loc", live(using), (yield* g.call(f, P("/proc/ui_swaphand_position"), null, [live(f.args[0]), 1])));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/swap_hand"), []))), live(f.args[1]));
	rt.setFv(f, "icon_state", live(using), "swap_2");
	rt.setFv(f, "screen_loc", live(using), (yield* g.call(f, P("/proc/ui_swaphand_position"), null, [live(f.args[0]), 2])));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	if (truthy(rt.fv(f, "possible_a_intents", rt.sv(f, "mymob")))) {
		if (isEqual(rt.getLen(f, rt.fv(f, "possible_a_intents", rt.sv(f, "mymob"))), 4)) {
			rt.setSv(f, "action_intent", (yield* g.new_(f, T("/obj/screen/act_intent/segmented"), [])));
		} else {
			rt.setSv(f, "action_intent", (yield* g.new_(f, T("/obj/screen/act_intent"), [])));
			rt.setFv(f, "icon", rt.sv(f, "action_intent"), live(f.args[1]));
		}
		rt.setFv(f, "icon_state", rt.sv(f, "action_intent"), rt.fv(f, "a_intent", rt.sv(f, "mymob")));
		rt.modSrcVar(f, "static_inventory", rt.sv(f, "action_intent"), add);
	}
	rt.setSv(f, "zone_select", (yield* g.new_(f, T("/obj/screen/zone_sel"), [])));
	rt.setFv(f, "icon", rt.sv(f, "zone_select"), live(f.args[1]));
	yield* g.callName(f, rt.sv(f, "zone_select"), "update_icon", [rt.sv(f, "mymob")]);
	rt.modSrcVar(f, "static_inventory", rt.sv(f, "zone_select"), add);
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/craft"), []))), live(f.args[1]));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/area_creator"), []))), live(f.args[1]));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen", rt.fv(f, "client", rt.sv(f, "mymob")), rt.list());
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

// /datum/hud/dextrous/proc/persistent_inventory_update  (code/_onclick/hud/generic_dextrous.dm:64)
rt.def("/datum/hud/dextrous/proc/persistent_inventory_update", function persistent_inventory_update(f: Frame) {
	let D: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [D, I, $e];
	if (!truthy(rt.sv(f, "mymob"))) {
		return live(f.dot);
	}
	D = rt.sv(f, "mymob");
	if (!isEqual(rt.sv(f, "hud_version"), 3)) {
		I = null;
		rt.forList(f, 0, rt.fv(f, "held_items", live(D)), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			rt.setFv(f, "screen_loc", live(I), rt.call(f, P("/proc/ui_hand_position"), null, [rt.callName(f, live(D), "get_held_index_of_item", [live(I)])]));
			rt.modField(f, rt.fv(f, "client", live(D)), "screen", live(I), add);
		}
		rt.endFor(f, 0);
	} else {
		I = null;
		rt.forList(f, 0, rt.fv(f, "held_items", live(D)), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			rt.setFv(f, "screen_loc", live(I), null);
			(rt.modField(f, rt.fv(f, "client", live(D)), "screen", live(I), subtract));
		}
		rt.endFor(f, 0);
	}
	return f.dot;
});

// /mob/living/simple_animal/proc/create_mob_hud  (code/_onclick/hud/generic_dextrous.dm:79)  may sleep
rt.def("/mob/living/simple_animal/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(truthy(rt.sv(f, "client")) && !truthy(rt.sv(f, "hud_used")))) return f.dot;
	if (truthy(rt.sv(f, "dextrous"))) {
		rt.setSv(f, "hud_used", (yield* g.new_(f, rt.sv(f, "dextrous_hud_type"), [live(f.src), (yield* g.call(f, P("/proc/ui_style2icon"), null, [rt.gv(f, "UI_style", rt.fv(f, "prefs", rt.sv(f, "client")))]))])));
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true);
