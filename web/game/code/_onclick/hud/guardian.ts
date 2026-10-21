// From code/_onclick/hud/guardian.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(73, "/datum/hud/guardian", "/datum/hud", {});

// /datum/hud/guardian/proc/New  (code/_onclick/hud/guardian.dm:3)  may sleep
rt.def("/datum/hud/guardian/proc/New", function* New(f: Frame) {
	let using: Value = null;
	f.vars = () => [using];
	yield* g.callSuper(f, [], rt.Args.Same);
	using = null;
	rt.setSv(f, "healths", (yield* g.new_(f, T("/obj/screen/healths/guardian"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "healths"), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/guardian/Manifest"), []))), (yield* g.call(f, P("/proc/ui_hand_position"), null, [2])));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/guardian/Recall"), []))), (yield* g.call(f, P("/proc/ui_hand_position"), null, [1])));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, rt.fv(f, "toggle_button_type", live(f.args[0])), []))), "CENTER+1:18,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/guardian/ToggleLight"), []))), "WEST:6,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/guardian/Communicate"), []))), "CENTER-2:14,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	return f.dot;
}, true, { args: ["owner"] });

// /mob/living/simple_animal/hostile/guardian/proc/create_mob_hud  (code/_onclick/hud/guardian.dm:31)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(truthy(rt.sv(f, "client")) && !truthy(rt.sv(f, "hud_used")))) return f.dot;
	if (truthy(rt.sv(f, "dextrous"))) {
		yield* g.callSuper(f, [], rt.Args.Same);
	} else {
		rt.setSv(f, "hud_used", (yield* g.new_(f, T("/datum/hud/guardian"), [live(f.src), (yield* g.call(f, P("/proc/ui_style2icon"), null, [rt.gv(f, "UI_style", rt.fv(f, "prefs", rt.sv(f, "client")))]))])));
	}
	return f.dot;
}, true);

rt.type(71, "/datum/hud/dextrous/guardian", "/datum/hud/dextrous", {});

// /datum/hud/dextrous/guardian/proc/New  (code/_onclick/hud/guardian.dm:38)  may sleep
rt.def("/datum/hud/dextrous/guardian/proc/New", function* New(f: Frame) {
	let using: Value = null, inv_box: Value = null;
	f.vars = () => [using, inv_box];
	if (live(f.args[1]) === null) {
		f.args[1] = rt.rsc("icons/mob/screen_midnight.dmi");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	using = null;
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/hostile/guardian/dextrous")) ? 1 : 0))) {
		inv_box = null;
		rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "internal storage");
		rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
		rt.setFv(f, "icon_state", live(inv_box), "suit_storage");
		rt.setFv(f, "screen_loc", live(inv_box), "CENTER-4:12,SOUTH:5");
		rt.setFv(f, "slot_id", live(inv_box), 20);
		rt.modSrcVar(f, "static_inventory", live(inv_box), add);
		rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/guardian/Communicate"), []))), "CENTER-5:10,SOUTH:5");
		rt.modSrcVar(f, "static_inventory", live(using), add);
	} else {
		rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/guardian/Communicate"), []))), "CENTER-4:12,SOUTH:5");
		rt.modSrcVar(f, "static_inventory", live(using), add);
	}
	rt.setSv(f, "healths", (yield* g.new_(f, T("/obj/screen/healths/guardian"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "healths"), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/guardian/Manifest"), []))), "CENTER-3:14,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/guardian/Recall"), []))), "CENTER-2:14,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, rt.fv(f, "toggle_button_type", live(f.args[0])), []))), "CENTER+2:20,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/guardian/ToggleLight"), []))), "WEST:6,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	return f.dot;
}, true, { args: ["owner", "ui_style"] });

// /datum/hud/dextrous/guardian/proc/persistent_inventory_update  (code/_onclick/hud/guardian.dm:81)
rt.def("/datum/hud/dextrous/guardian/proc/persistent_inventory_update", function persistent_inventory_update(f: Frame) {
	let D: Value = null;
	f.vars = () => [D];
	if (!truthy(rt.sv(f, "mymob"))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(rt.sv(f, "mymob"), T("/mob/living/simple_animal/hostile/guardian/dextrous")) ? 1 : 0))) {
		D = rt.sv(f, "mymob");
		if (truthy(rt.sv(f, "hud_shown"))) {
			if (truthy(rt.fv(f, "internal_storage", live(D)))) {
				rt.setFv(f, "screen_loc", rt.fv(f, "internal_storage", live(D)), "CENTER-4:12,SOUTH:5");
				rt.modField(f, rt.fv(f, "client", live(D)), "screen", rt.fv(f, "internal_storage", live(D)), add);
			}
		} else {
			if (truthy(rt.fv(f, "internal_storage", live(D)))) {
				rt.setFv(f, "screen_loc", rt.fv(f, "internal_storage", live(D)), null);
			}
		}
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(11122, "/obj/screen/guardian/Manifest", "/obj/screen/guardian", {
	icon_state: "manifest",
	name: "Manifest",
	desc: "Spring forth into battle!",
});

// /obj/screen/guardian/Manifest/proc/Click  (code/_onclick/hud/guardian.dm:105)  may sleep
rt.def("/obj/screen/guardian/Manifest/proc/Click", function* Click(f: Frame) {
	let G: Value = null;
	f.vars = () => [G];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/simple_animal/hostile/guardian")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (G = live(f.usr)), "Manifest", []);
	return f.dot;
}, true);

rt.type(11123, "/obj/screen/guardian/Recall", "/obj/screen/guardian", {
	icon_state: "recall",
	name: "Recall",
	desc: "Return to your user.",
});

// /obj/screen/guardian/Recall/proc/Click  (code/_onclick/hud/guardian.dm:116)  may sleep
rt.def("/obj/screen/guardian/Recall/proc/Click", function* Click(f: Frame) {
	let G: Value = null;
	f.vars = () => [G];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/simple_animal/hostile/guardian")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (G = live(f.usr)), "Recall", []);
	return f.dot;
}, true);

rt.type(11124, "/obj/screen/guardian/ToggleMode", "/obj/screen/guardian", {
	icon_state: "toggle",
	name: "Toggle Mode",
	desc: "Switch between ability modes.",
});

// /obj/screen/guardian/ToggleMode/proc/Click  (code/_onclick/hud/guardian.dm:126)  may sleep
rt.def("/obj/screen/guardian/ToggleMode/proc/Click", function* Click(f: Frame) {
	let G: Value = null;
	f.vars = () => [G];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/simple_animal/hostile/guardian")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (G = live(f.usr)), "ToggleMode", []);
	return f.dot;
}, true);

rt.type(11127, "/obj/screen/guardian/Communicate", "/obj/screen/guardian", {
	icon_state: "communicate",
	name: "Communicate",
	desc: "Communicate telepathically with your user.",
});

// /obj/screen/guardian/Communicate/proc/Click  (code/_onclick/hud/guardian.dm:144)  may sleep
rt.def("/obj/screen/guardian/Communicate/proc/Click", function* Click(f: Frame) {
	let G: Value = null;
	f.vars = () => [G];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/simple_animal/hostile/guardian")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (G = live(f.usr)), "Communicate", []);
	return f.dot;
}, true);

rt.type(11128, "/obj/screen/guardian/ToggleLight", "/obj/screen/guardian", {
	icon_state: "light",
	name: "Toggle Light",
	desc: "Glow like star dust.",
});

// /obj/screen/guardian/ToggleLight/proc/Click  (code/_onclick/hud/guardian.dm:155)
rt.def("/obj/screen/guardian/ToggleLight/proc/Click", function Click(f: Frame) {
	let G: Value = null;
	f.vars = () => [G];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/simple_animal/hostile/guardian")) ? 1 : 0))) return f.dot;
	rt.callName(f, (G = live(f.usr)), "ToggleLight", []);
	return f.dot;
});
