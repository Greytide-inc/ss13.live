// From code/_onclick/hud/constructs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(67, "/datum/hud/constructs", "/datum/hud", {
	ui_style_icon: rt.rsc("icons/mob/screen_construct.dmi"),
});

// /datum/hud/constructs/proc/New  (code/_onclick/hud/constructs.dm:6)  may sleep
rt.def("/datum/hud/constructs/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "pull_icon", (yield* g.new_(f, T("/obj/screen/pull"), [])));
	rt.setFv(f, "icon", rt.sv(f, "pull_icon"), rt.rsc("icons/mob/screen_construct.dmi"));
	yield* g.callName(f, rt.sv(f, "pull_icon"), "update_icon", [rt.sv(f, "mymob")]);
	rt.setFv(f, "screen_loc", rt.sv(f, "pull_icon"), "EAST,CENTER-2:15");
	rt.modSrcVar(f, "static_inventory", rt.sv(f, "pull_icon"), add);
	rt.setSv(f, "healths", (yield* g.new_(f, T("/obj/screen/healths/construct"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "healths"), add);
	return f.dot;
}, true, { args: ["owner"] });

// /mob/living/simple_animal/hostile/construct/proc/create_mob_hud  (code/_onclick/hud/constructs.dm:17)  may sleep
rt.def("/mob/living/simple_animal/hostile/construct/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(truthy(rt.sv(f, "client")) && !truthy(rt.sv(f, "hud_used")))) return f.dot;
	rt.setSv(f, "hud_used", (yield* g.new_(f, T("/datum/hud/constructs"), [live(f.src)])));
	return f.dot;
}, true);
