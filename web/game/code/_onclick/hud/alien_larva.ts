// From code/_onclick/hud/alien_larva.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(63, "/datum/hud/larva", "/datum/hud", {});

// /datum/hud/larva/proc/New  (code/_onclick/hud/alien_larva.dm:2)  may sleep
rt.def("/datum/hud/larva/proc/New", function* New(f: Frame) {
	let using: Value = null;
	f.vars = () => [using];
	yield* g.callSuper(f, [], rt.Args.Same);
	using = null;
	rt.setFv(f, "icon_state", (using = (yield* g.new_(f, T("/obj/screen/act_intent/alien"), []))), rt.fv(f, "a_intent", rt.sv(f, "mymob")));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setSv(f, "action_intent", live(using));
	rt.setSv(f, "healths", (yield* g.new_(f, T("/obj/screen/healths/alien"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "healths"), add);
	rt.setSv(f, "alien_queen_finder", (yield* g.new_(f, T("/obj/screen/alien/alien_queen_finder"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "alien_queen_finder"), add);
	rt.setSv(f, "pull_icon", (yield* g.new_(f, T("/obj/screen/pull"), [])));
	rt.setFv(f, "icon", rt.sv(f, "pull_icon"), rt.rsc("icons/mob/screen_alien.dmi"));
	yield* g.callName(f, rt.sv(f, "pull_icon"), "update_icon", [rt.sv(f, "mymob")]);
	rt.setFv(f, "screen_loc", rt.sv(f, "pull_icon"), "EAST-2:26,SOUTH+1:7");
	rt.modSrcVar(f, "hotkeybuttons", rt.sv(f, "pull_icon"), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/language_menu"), []))), "EAST-3:26,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setSv(f, "zone_select", (yield* g.new_(f, T("/obj/screen/zone_sel/alien"), [])));
	yield* g.callName(f, rt.sv(f, "zone_select"), "update_icon", [rt.sv(f, "mymob")]);
	rt.modSrcVar(f, "static_inventory", rt.sv(f, "zone_select"), add);
	return f.dot;
}, true, { args: ["owner"] });

// /mob/living/carbon/alien/larva/proc/create_mob_hud  (code/_onclick/hud/alien_larva.dm:30)  may sleep
rt.def("/mob/living/carbon/alien/larva/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(truthy(rt.sv(f, "client")) && !truthy(rt.sv(f, "hud_used")))) return f.dot;
	rt.setSv(f, "hud_used", (yield* g.new_(f, T("/datum/hud/larva"), [live(f.src)])));
	return f.dot;
}, true);
