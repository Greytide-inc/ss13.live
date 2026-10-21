// From code/_onclick/hud/alien.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11082, "/obj/screen/alien/leap", "/obj/screen/alien", {
	name: "toggle leap",
	icon_state: "leap_off",
});

// /obj/screen/alien/leap/proc/Click  (code/_onclick/hud/alien.dm:9)  may sleep
rt.def("/obj/screen/alien/leap/proc/Click", function* Click(f: Frame) {
	let AH: Value = null;
	f.vars = () => [AH];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/carbon/alien/humanoid/hunter")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (AH = live(f.usr)), "toggle_leap", []);
	return f.dot;
}, true);

rt.type(62, "/datum/hud/alien", "/datum/hud", {
	ui_style_icon: rt.rsc("icons/mob/screen_alien.dmi"),
});

// /datum/hud/alien/proc/New  (code/_onclick/hud/alien.dm:32)  may sleep
rt.def("/datum/hud/alien/proc/New", function* New(f: Frame) {
	let using: Value = null, H: Value = null, inv: Value = null;
	let $e: any;
	f.vars = () => [using, H, inv, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = rt.rsc("icons/mob/screen_alien.dmi");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	using = null;
	yield* g.srcCall(f, "build_hand_slots", live(f.args[1]));
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/swap_hand"), []))), live(f.args[1]));
	rt.setFv(f, "icon_state", live(using), "swap_1");
	rt.setFv(f, "screen_loc", live(using), (yield* g.call(f, P("/proc/ui_swaphand_position"), null, [live(f.args[0]), 1])));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/swap_hand"), []))), live(f.args[1]));
	rt.setFv(f, "icon_state", live(using), "swap_2");
	rt.setFv(f, "screen_loc", live(using), (yield* g.call(f, P("/proc/ui_swaphand_position"), null, [live(f.args[0]), 2])));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "icon_state", (using = (yield* g.new_(f, T("/obj/screen/act_intent/alien"), []))), rt.fv(f, "a_intent", rt.sv(f, "mymob")));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setSv(f, "action_intent", live(using));
	if (truthy((rt.istype(rt.sv(f, "mymob"), T("/mob/living/carbon/alien/humanoid/hunter")) ? 1 : 0))) {
		rt.setFv(f, "leap_icon", (H = rt.sv(f, "mymob")), (yield* g.new_(f, T("/obj/screen/alien/leap"), [])));
		rt.setFv(f, "screen_loc", rt.fv(f, "leap_icon", live(H)), "CENTER+1:18,SOUTH:5");
		rt.modSrcVar(f, "static_inventory", rt.fv(f, "leap_icon", live(H)), add);
	}
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/language_menu"), []))), "EAST-3:26,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/drop"), []))), live(f.args[1]));
	rt.setFv(f, "screen_loc", live(using), "EAST-1:28,SOUTH+1:7");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/resist"), []))), live(f.args[1]));
	rt.setFv(f, "screen_loc", live(using), "EAST-2:26,SOUTH+1:7");
	rt.modSrcVar(f, "hotkeybuttons", live(using), add);
	rt.setSv(f, "throw_icon", (yield* g.new_(f, T("/obj/screen/throw_catch"), [])));
	rt.setFv(f, "icon", rt.sv(f, "throw_icon"), live(f.args[1]));
	rt.setFv(f, "screen_loc", rt.sv(f, "throw_icon"), "EAST-1:28,SOUTH+1:7");
	rt.modSrcVar(f, "hotkeybuttons", rt.sv(f, "throw_icon"), add);
	rt.setSv(f, "pull_icon", (yield* g.new_(f, T("/obj/screen/pull"), [])));
	rt.setFv(f, "icon", rt.sv(f, "pull_icon"), live(f.args[1]));
	yield* g.callName(f, rt.sv(f, "pull_icon"), "update_icon", [rt.sv(f, "mymob")]);
	rt.setFv(f, "screen_loc", rt.sv(f, "pull_icon"), "EAST-2:26,SOUTH+1:7");
	rt.modSrcVar(f, "static_inventory", rt.sv(f, "pull_icon"), add);
	rt.setSv(f, "healths", (yield* g.new_(f, T("/obj/screen/healths/alien"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "healths"), add);
	rt.setSv(f, "alien_plasma_display", (yield* g.new_(f, T("/obj/screen/alien/plasma_display"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "alien_plasma_display"), add);
	if (!truthy((rt.istype(rt.sv(f, "mymob"), T("/mob/living/carbon/alien/humanoid/royal/queen")) ? 1 : 0))) {
		rt.setSv(f, "alien_queen_finder", (yield* g.new_(f, T("/obj/screen/alien/alien_queen_finder"), [])));
		rt.modSrcVar(f, "infodisplay", rt.sv(f, "alien_queen_finder"), add);
	}
	rt.setSv(f, "zone_select", (yield* g.new_(f, T("/obj/screen/zone_sel/alien"), [])));
	yield* g.callName(f, rt.sv(f, "zone_select"), "update_icon", [rt.sv(f, "mymob")]);
	rt.modSrcVar(f, "static_inventory", rt.sv(f, "zone_select"), add);
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

// /datum/hud/alien/proc/persistent_inventory_update  (code/_onclick/hud/alien.dm:114)
rt.def("/datum/hud/alien/proc/persistent_inventory_update", function persistent_inventory_update(f: Frame) {
	let H: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [H, I, $e];
	if (!truthy(rt.sv(f, "mymob"))) {
		return live(f.dot);
	}
	H = rt.sv(f, "mymob");
	if (!isEqual(rt.sv(f, "hud_version"), 3)) {
		I = null;
		rt.forList(f, 0, rt.fv(f, "held_items", live(H)), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			rt.setFv(f, "screen_loc", live(I), rt.call(f, P("/proc/ui_hand_position"), null, [rt.callName(f, live(H), "get_held_index_of_item", [live(I)])]));
			rt.modField(f, rt.fv(f, "client", live(H)), "screen", live(I), add);
		}
		rt.endFor(f, 0);
	} else {
		I = null;
		rt.forList(f, 0, rt.fv(f, "held_items", live(H)), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			rt.setFv(f, "screen_loc", live(I), null);
			(rt.modField(f, rt.fv(f, "client", live(H)), "screen", live(I), subtract));
		}
		rt.endFor(f, 0);
	}
	return f.dot;
});

// /mob/living/carbon/alien/humanoid/proc/create_mob_hud  (code/_onclick/hud/alien.dm:127)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(truthy(rt.sv(f, "client")) && !truthy(rt.sv(f, "hud_used")))) return f.dot;
	rt.setSv(f, "hud_used", (yield* g.new_(f, T("/datum/hud/alien"), [live(f.src)])));
	return f.dot;
}, true);
