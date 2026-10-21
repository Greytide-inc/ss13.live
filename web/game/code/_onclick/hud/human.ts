// From code/_onclick/hud/human.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11130, "/obj/screen/human/toggle", "/obj/screen/human", {
	name: "toggle",
	icon_state: "toggle",
});

// /obj/screen/human/toggle/proc/Click  (code/_onclick/hud/human.dm:10)
rt.def("/obj/screen/human/toggle/proc/Click", function Click(f: Frame) {
	let targetmob: Value = null, M: Value = null;
	f.vars = () => [targetmob, M];
	targetmob = live(f.usr);
	if (truthy((rt.istype(live(f.usr), T("/mob/dead/observer")) ? 1 : 0))) {
		if ((truthy((rt.istype(rt.gv(f, "eye", rt.fv(f, "client", live(f.usr))), T("/mob/living/carbon/human")) ? 1 : 0)) && !isEqual(rt.gv(f, "eye", rt.fv(f, "client", live(f.usr))), live(f.usr)))) {
			targetmob = (M = rt.gv(f, "eye", rt.fv(f, "client", live(f.usr))));
		}
	}
	if ((truthy(rt.gv(f, "inventory_shown", rt.fv(f, "hud_used", live(f.usr)))) && truthy(rt.fv(f, "hud_used", live(targetmob))))) {
		rt.setFv(f, "inventory_shown", rt.fv(f, "hud_used", live(f.usr)), 0);
		(rt.modField(f, rt.fv(f, "client", live(f.usr)), "screen", rt.gv(f, "toggleable_inventory", rt.fv(f, "hud_used", live(targetmob))), subtract));
	} else {
		rt.setFv(f, "inventory_shown", rt.fv(f, "hud_used", live(f.usr)), 1);
		rt.modField(f, rt.fv(f, "client", live(f.usr)), "screen", rt.gv(f, "toggleable_inventory", rt.fv(f, "hud_used", live(targetmob))), add);
	}
	rt.callName(f, rt.fv(f, "hud_used", live(targetmob)), "hidden_inventory_update", [live(f.usr)]);
	return f.dot;
});

rt.type(11131, "/obj/screen/human/equip", "/obj/screen/human", {
	name: "equip",
	icon_state: "act_equip",
});

// /obj/screen/human/equip/proc/Click  (code/_onclick/hud/human.dm:31)  may sleep
rt.def("/obj/screen/human/equip/proc/Click", function* Click(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy((rt.istype(rt.fv(f, "loc", live(f.usr)), T("/obj/mecha")) ? 1 : 0))) {
		return 1;
	}
	yield* g.callName(f, (H = live(f.usr)), "quick_equip", []);
	return f.dot;
}, true);

rt.type(11133, "/obj/screen/devil/soul_counter", "/obj/screen/devil", {
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	name: "souls owned",
	icon_state: "Devil-6",
	screen_loc: "WEST:6,CENTER-1:15",
});

// /obj/screen/devil/soul_counter/proc/update_counter  (code/_onclick/hud/human.dm:47)
rt.def("/obj/screen/devil/soul_counter/proc/update_counter", function update_counter(f: Frame, souls: Value) {
	let $0: any;
	f.vars = () => [souls, $0];
	if (live(souls) === null) {
		souls = 0;
	}
	rt.setSv(f, "invisibility", 0);
	rt.setSv(f, "maptext", fmt("<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#FF0000'>＀</font></div>", [live(souls)]));
	$0 = live(souls);
	if ($0 === 0 || isEqual($0, null)) {
		rt.setSv(f, "icon_state", "Devil-1");
	} else if ($0 === 1 || $0 === 2) {
		rt.setSv(f, "icon_state", "Devil-2");
	} else if (rt.inRange($0, 3, 5)) {
		rt.setSv(f, "icon_state", "Devil-3");
	} else if (rt.inRange($0, 6, 8)) {
		rt.setSv(f, "icon_state", "Devil-4");
	} else if (rt.inRange($0, 9, 9.999999848243207e+30)) {
		rt.setSv(f, "icon_state", "Devil-5");
	} else {
		rt.setSv(f, "icon_state", "Devil-6");
	}
	return f.dot;
});

rt.type(11135, "/obj/screen/ling/sting", "/obj/screen/ling", {
	name: "current sting",
	screen_loc: "WEST:6,CENTER-3:11",
});

// /obj/screen/ling/sting/proc/Click  (code/_onclick/hud/human.dm:73)
rt.def("/obj/screen/ling/sting/proc/Click", function Click(f: Frame) {
	let U: Value = null;
	f.vars = () => [U];
	if (truthy((rt.istype(live(f.usr), T("/mob/dead/observer")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.callName(f, (U = live(f.usr)), "unset_sting", []);
	return f.dot;
});

// /mob/living/carbon/human/proc/create_mob_hud  (code/_onclick/hud/human.dm:84)  may sleep
rt.def("/mob/living/carbon/human/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(truthy(rt.sv(f, "client")) && !truthy(rt.sv(f, "hud_used")))) return f.dot;
	rt.setSv(f, "hud_used", (yield* g.new_(f, T("/datum/hud/human"), [live(f.src), (yield* g.call(f, P("/proc/ui_style2icon"), null, [rt.gv(f, "UI_style", rt.fv(f, "prefs", rt.sv(f, "client")))]))])));
	return f.dot;
}, true);

rt.type(74, "/datum/hud/human", "/datum/hud", {});

// /datum/hud/human/proc/New  (code/_onclick/hud/human.dm:89)  may sleep
rt.def("/datum/hud/human/proc/New", function* New(f: Frame) {
	let using: Value = null, inv_box: Value = null, inv: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [using, inv_box, inv, $0, $1, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = rt.rsc("icons/mob/screen_midnight.dmi");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, live(f.args[0]), "overlay_fullscreen", ["see_through_darkness", T("/obj/screen/fullscreen/see_through_darkness")]);
	using = null;
	inv_box = null;
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/craft"), []))), live(f.args[1]));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/language_menu"), []))), live(f.args[1]));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/area_creator"), []))), live(f.args[1]));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setSv(f, "action_intent", (yield* g.new_(f, T("/obj/screen/act_intent/segmented"), [])));
	rt.setFv(f, "icon_state", rt.sv(f, "action_intent"), rt.fv(f, "a_intent", rt.sv(f, "mymob")));
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
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/drop"), []))), live(f.args[1]));
	rt.setFv(f, "screen_loc", live(using), "EAST-1:28,SOUTH+1:7");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "i_clothing");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "slot_id", live(inv_box), 14);
	rt.setFv(f, "icon_state", live(inv_box), "uniform");
	rt.setFv(f, "screen_loc", live(inv_box), "WEST:6,SOUTH+1:7");
	rt.modSrcVar(f, "toggleable_inventory", live(inv_box), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "o_clothing");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "slot_id", live(inv_box), 13);
	rt.setFv(f, "icon_state", live(inv_box), "suit");
	rt.setFv(f, "screen_loc", live(inv_box), "WEST+1:8,SOUTH+1:7");
	rt.modSrcVar(f, "toggleable_inventory", live(inv_box), add);
	yield* g.srcCall(f, "build_hand_slots", live(f.args[1]));
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/swap_hand"), []))), live(f.args[1]));
	rt.setFv(f, "icon_state", live(using), "swap_1");
	rt.setFv(f, "screen_loc", live(using), (yield* g.call(f, P("/proc/ui_swaphand_position"), null, [live(f.args[0]), 1])));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/swap_hand"), []))), live(f.args[1]));
	rt.setFv(f, "icon_state", live(using), "swap_2");
	rt.setFv(f, "screen_loc", live(using), (yield* g.call(f, P("/proc/ui_swaphand_position"), null, [live(f.args[0]), 2])));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "id");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "icon_state", live(inv_box), "id");
	rt.setFv(f, "screen_loc", live(inv_box), "CENTER-4:12,SOUTH:5");
	rt.setFv(f, "slot_id", live(inv_box), 6);
	rt.modSrcVar(f, "static_inventory", live(inv_box), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "mask");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "icon_state", live(inv_box), "mask");
	rt.setFv(f, "screen_loc", live(inv_box), "WEST+1:8,SOUTH+2:9");
	rt.setFv(f, "slot_id", live(inv_box), 2);
	rt.modSrcVar(f, "toggleable_inventory", live(inv_box), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "neck");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "icon_state", live(inv_box), "neck");
	rt.setFv(f, "screen_loc", live(inv_box), "WEST:6,SOUTH+2:9");
	rt.setFv(f, "slot_id", live(inv_box), 10);
	rt.modSrcVar(f, "toggleable_inventory", live(inv_box), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "back");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "icon_state", live(inv_box), "back");
	rt.setFv(f, "screen_loc", live(inv_box), "CENTER-2:14,SOUTH:5");
	rt.setFv(f, "slot_id", live(inv_box), 1);
	rt.modSrcVar(f, "static_inventory", live(inv_box), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "storage1");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "icon_state", live(inv_box), "pocket");
	rt.setFv(f, "screen_loc", live(inv_box), "CENTER+1:18,SOUTH:5");
	rt.setFv(f, "slot_id", live(inv_box), 15);
	rt.modSrcVar(f, "static_inventory", live(inv_box), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "storage2");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "icon_state", live(inv_box), "pocket");
	rt.setFv(f, "screen_loc", live(inv_box), "CENTER+2:20,SOUTH:5");
	rt.setFv(f, "slot_id", live(inv_box), 16);
	rt.modSrcVar(f, "static_inventory", live(inv_box), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "suit storage");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "icon_state", live(inv_box), "suit_storage");
	rt.setFv(f, "screen_loc", live(inv_box), "CENTER-5:10,SOUTH:5");
	rt.setFv(f, "slot_id", live(inv_box), 17);
	rt.modSrcVar(f, "static_inventory", live(inv_box), add);
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/resist"), []))), live(f.args[1]));
	rt.setFv(f, "screen_loc", live(using), "EAST-2:26,SOUTH+1:7");
	rt.modSrcVar(f, "hotkeybuttons", live(using), add);
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/human/toggle"), []))), live(f.args[1]));
	rt.setFv(f, "screen_loc", live(using), "WEST:6,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/human/equip"), []))), live(f.args[1]));
	rt.setFv(f, "screen_loc", live(using), (yield* g.call(f, P("/proc/ui_equip_position"), null, [rt.sv(f, "mymob")])));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "gloves");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "icon_state", live(inv_box), "gloves");
	rt.setFv(f, "screen_loc", live(inv_box), "WEST+2:10,SOUTH+1:7");
	rt.setFv(f, "slot_id", live(inv_box), 9);
	rt.modSrcVar(f, "toggleable_inventory", live(inv_box), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "eyes");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "icon_state", live(inv_box), "glasses");
	rt.setFv(f, "screen_loc", live(inv_box), "WEST:6,SOUTH+3:11");
	rt.setFv(f, "slot_id", live(inv_box), 8);
	rt.modSrcVar(f, "toggleable_inventory", live(inv_box), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "ears");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "icon_state", live(inv_box), "ears");
	rt.setFv(f, "screen_loc", live(inv_box), "WEST+2:10,SOUTH+2:9");
	rt.setFv(f, "slot_id", live(inv_box), 7);
	rt.modSrcVar(f, "toggleable_inventory", live(inv_box), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "head");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "icon_state", live(inv_box), "head");
	rt.setFv(f, "screen_loc", live(inv_box), "WEST+1:8,SOUTH+3:11");
	rt.setFv(f, "slot_id", live(inv_box), 11);
	rt.modSrcVar(f, "toggleable_inventory", live(inv_box), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "shoes");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "icon_state", live(inv_box), "shoes");
	rt.setFv(f, "screen_loc", live(inv_box), "WEST+1:8,SOUTH:5");
	rt.setFv(f, "slot_id", live(inv_box), 12);
	rt.modSrcVar(f, "toggleable_inventory", live(inv_box), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "belt");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "icon_state", live(inv_box), "belt");
	rt.setFv(f, "screen_loc", live(inv_box), "CENTER-3:14,SOUTH:5");
	rt.setFv(f, "slot_id", live(inv_box), 5);
	rt.modSrcVar(f, "static_inventory", live(inv_box), add);
	rt.setSv(f, "throw_icon", (yield* g.new_(f, T("/obj/screen/throw_catch"), [])));
	rt.setFv(f, "icon", rt.sv(f, "throw_icon"), live(f.args[1]));
	rt.setFv(f, "screen_loc", rt.sv(f, "throw_icon"), "EAST-1:28,SOUTH+1:7");
	rt.modSrcVar(f, "hotkeybuttons", rt.sv(f, "throw_icon"), add);
	rt.setSv(f, "internals", (yield* g.new_(f, T("/obj/screen/internals"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "internals"), add);
	rt.setSv(f, "healths", (yield* g.new_(f, T("/obj/screen/healths"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "healths"), add);
	rt.setSv(f, "healthdoll", (yield* g.new_(f, T("/obj/screen/healthdoll"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "healthdoll"), add);
	rt.setSv(f, "pull_icon", (yield* g.new_(f, T("/obj/screen/pull"), [])));
	rt.setFv(f, "icon", rt.sv(f, "pull_icon"), live(f.args[1]));
	yield* g.callName(f, rt.sv(f, "pull_icon"), "update_icon", [rt.sv(f, "mymob")]);
	rt.setFv(f, "screen_loc", rt.sv(f, "pull_icon"), "EAST-2:26,SOUTH+1:7");
	rt.modSrcVar(f, "static_inventory", rt.sv(f, "pull_icon"), add);
	rt.setSv(f, "lingchemdisplay", (yield* g.new_(f, T("/obj/screen/ling/chems"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "lingchemdisplay"), add);
	rt.setSv(f, "lingstingdisplay", (yield* g.new_(f, T("/obj/screen/ling/sting"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "lingstingdisplay"), add);
	rt.setSv(f, "devilsouldisplay", (yield* g.new_(f, T("/obj/screen/devil/soul_counter"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "devilsouldisplay"), add);
	rt.setSv(f, "zone_select", (yield* g.new_(f, T("/obj/screen/zone_sel"), [])));
	rt.setFv(f, "icon", rt.sv(f, "zone_select"), live(f.args[1]));
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

// /datum/hud/human/proc/update_locked_slots  (code/_onclick/hud/human.dm:313)
rt.def("/datum/hud/human/proc/update_locked_slots", function update_locked_slots(f: Frame) {
	let H: Value = null, S: Value = null, inv: Value = null;
	let $e: any;
	f.vars = () => [H, S, inv, $e];
	if (!truthy(rt.sv(f, "mymob"))) {
		return live(f.dot);
	}
	H = rt.sv(f, "mymob");
	S = rt.gv(f, "species", rt.fv(f, "dna", live(H)));
	inv = null;
	rt.forList(f, 0, add(rt.sv(f, "static_inventory"), rt.sv(f, "toggleable_inventory")), T("/obj/screen/inventory"));
	while (($e = rt.next(f, 0)) !== undefined) {
		inv = $e;
		if (truthy(rt.fv(f, "slot_id", live(inv)))) {
			if (truthy((rt.isIn(f, rt.fv(f, "slot_id", live(inv)), rt.fv(f, "no_equip", live(S))) ? 1 : 0))) {
				rt.setFv(f, "alpha", live(inv), 128);
			} else {
				rt.setFv(f, "alpha", live(inv), rt.initial(f, live(inv), "alpha"));
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/hud/human/proc/hidden_inventory_update  (code/_onclick/hud/human.dm:325)
rt.def("/datum/hud/human/proc/hidden_inventory_update", function hidden_inventory_update(f: Frame, viewer: Value) {
	let H: Value = null, screenmob: Value = null;
	f.vars = () => [H, screenmob];
	if (!truthy(rt.sv(f, "mymob"))) {
		return live(f.dot);
	}
	H = rt.sv(f, "mymob");
	if ((truthy(rt.gv(f, "inventory_shown", rt.gv(f, "hud_used", (screenmob = (live(viewer) || live(H)))))) && truthy(rt.gv(f, "hud_shown", rt.fv(f, "hud_used", live(screenmob)))))) {
		if (truthy(rt.fv(f, "shoes", live(H)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "shoes", live(H)), "WEST+1:8,SOUTH:5");
			rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "shoes", live(H)), add);
		}
		if (truthy(rt.fv(f, "gloves", live(H)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "gloves", live(H)), "WEST+2:10,SOUTH+1:7");
			rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "gloves", live(H)), add);
		}
		if (truthy(rt.fv(f, "ears", live(H)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "ears", live(H)), "WEST+2:10,SOUTH+2:9");
			rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "ears", live(H)), add);
		}
		if (truthy(rt.fv(f, "glasses", live(H)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "glasses", live(H)), "WEST:6,SOUTH+3:11");
			rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "glasses", live(H)), add);
		}
		if (truthy(rt.fv(f, "w_uniform", live(H)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "w_uniform", live(H)), "WEST:6,SOUTH+1:7");
			rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "w_uniform", live(H)), add);
		}
		if (truthy(rt.fv(f, "wear_suit", live(H)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "wear_suit", live(H)), "WEST+1:8,SOUTH+1:7");
			rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "wear_suit", live(H)), add);
		}
		if (truthy(rt.fv(f, "wear_mask", live(H)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "wear_mask", live(H)), "WEST+1:8,SOUTH+2:9");
			rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "wear_mask", live(H)), add);
		}
		if (truthy(rt.fv(f, "wear_neck", live(H)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "wear_neck", live(H)), "WEST:6,SOUTH+2:9");
			rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "wear_neck", live(H)), add);
		}
		if (truthy(rt.fv(f, "head", live(H)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "head", live(H)), "WEST+1:8,SOUTH+3:11");
			rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "head", live(H)), add);
		}
	} else {
		if (truthy(rt.fv(f, "shoes", live(H)))) {
			(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "shoes", live(H)), subtract));
		}
		if (truthy(rt.fv(f, "gloves", live(H)))) {
			(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "gloves", live(H)), subtract));
		}
		if (truthy(rt.fv(f, "ears", live(H)))) {
			(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "ears", live(H)), subtract));
		}
		if (truthy(rt.fv(f, "glasses", live(H)))) {
			(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "glasses", live(H)), subtract));
		}
		if (truthy(rt.fv(f, "w_uniform", live(H)))) {
			(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "w_uniform", live(H)), subtract));
		}
		if (truthy(rt.fv(f, "wear_suit", live(H)))) {
			(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "wear_suit", live(H)), subtract));
		}
		if (truthy(rt.fv(f, "wear_mask", live(H)))) {
			(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "wear_mask", live(H)), subtract));
		}
		if (truthy(rt.fv(f, "wear_neck", live(H)))) {
			(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "wear_neck", live(H)), subtract));
		}
		if (!truthy(rt.fv(f, "head", live(H)))) return f.dot;
		(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "head", live(H)), subtract));
	}
	return f.dot;
});

// /datum/hud/human/proc/persistent_inventory_update  (code/_onclick/hud/human.dm:373)
rt.def("/datum/hud/human/proc/persistent_inventory_update", function persistent_inventory_update(f: Frame) {
	let H: Value = null, screenmob: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [H, screenmob, I, $e];
	if (!truthy(rt.sv(f, "mymob"))) {
		return live(f.dot);
	}
	rt.callSuper(f, [], rt.Args.Same);
	H = rt.sv(f, "mymob");
	if (truthy(rt.gv(f, "hud_used", (screenmob = (live(f.args[0]) || live(H)))))) {
		if (truthy(rt.gv(f, "hud_shown", rt.fv(f, "hud_used", live(screenmob))))) {
			if (truthy(rt.fv(f, "s_store", live(H)))) {
				rt.setFv(f, "screen_loc", rt.fv(f, "s_store", live(H)), "CENTER-5:10,SOUTH:5");
				rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "s_store", live(H)), add);
			}
			if (truthy(rt.fv(f, "wear_id", live(H)))) {
				rt.setFv(f, "screen_loc", rt.fv(f, "wear_id", live(H)), "CENTER-4:12,SOUTH:5");
				rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "wear_id", live(H)), add);
			}
			if (truthy(rt.fv(f, "belt", live(H)))) {
				rt.setFv(f, "screen_loc", rt.fv(f, "belt", live(H)), "CENTER-3:14,SOUTH:5");
				rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "belt", live(H)), add);
			}
			if (truthy(rt.fv(f, "back", live(H)))) {
				rt.setFv(f, "screen_loc", rt.fv(f, "back", live(H)), "CENTER-2:14,SOUTH:5");
				rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "back", live(H)), add);
			}
			if (truthy(rt.fv(f, "l_store", live(H)))) {
				rt.setFv(f, "screen_loc", rt.fv(f, "l_store", live(H)), "CENTER+1:18,SOUTH:5");
				rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "l_store", live(H)), add);
			}
			if (truthy(rt.fv(f, "r_store", live(H)))) {
				rt.setFv(f, "screen_loc", rt.fv(f, "r_store", live(H)), "CENTER+2:20,SOUTH:5");
				rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "r_store", live(H)), add);
			}
		} else {
			if (truthy(rt.fv(f, "s_store", live(H)))) {
				(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "s_store", live(H)), subtract));
			}
			if (truthy(rt.fv(f, "wear_id", live(H)))) {
				(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "wear_id", live(H)), subtract));
			}
			if (truthy(rt.fv(f, "belt", live(H)))) {
				(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "belt", live(H)), subtract));
			}
			if (truthy(rt.fv(f, "back", live(H)))) {
				(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "back", live(H)), subtract));
			}
			if (truthy(rt.fv(f, "l_store", live(H)))) {
				(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "l_store", live(H)), subtract));
			}
			if (truthy(rt.fv(f, "r_store", live(H)))) {
				(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "r_store", live(H)), subtract));
			}
		}
	}
	if (!isEqual(rt.sv(f, "hud_version"), 3)) {
		I = null;
		rt.forList(f, 0, rt.fv(f, "held_items", live(H)), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			rt.setFv(f, "screen_loc", live(I), rt.call(f, P("/proc/ui_hand_position"), null, [rt.callName(f, live(H), "get_held_index_of_item", [live(I)])]));
			rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", live(I), add);
		}
		rt.endFor(f, 0);
	} else {
		I = null;
		rt.forList(f, 0, rt.fv(f, "held_items", live(H)), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			rt.setFv(f, "screen_loc", live(I), null);
			(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", live(I), subtract));
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, false, { args: ["viewer"] });

// /mob/living/carbon/human/verb/toggle_hotkey_verbs  (code/_onclick/hud/human.dm:429)
rt.def("/mob/living/carbon/human/verb/toggle_hotkey_verbs", function toggle_hotkey_verbs(f: Frame) {
	if (truthy(rt.fv(f, "hotkey_ui_hidden", rt.sv(f, "hud_used")))) {
		rt.modField(f, rt.sv(f, "client"), "screen", rt.fv(f, "hotkeybuttons", rt.sv(f, "hud_used")), add);
		rt.setFv(f, "hotkey_ui_hidden", rt.sv(f, "hud_used"), 0);
	} else {
		(rt.modField(f, rt.sv(f, "client"), "screen", rt.fv(f, "hotkeybuttons", rt.sv(f, "hud_used")), subtract));
		rt.setFv(f, "hotkey_ui_hidden", rt.sv(f, "hud_used"), 1);
	}
	return f.dot;
}, false, { verb: { name: "Toggle hotkey buttons", category: "OOC", desc: "This disables or enables the user interface buttons which can be used with hotkeys." } });
