// From code/_onclick/hud/revenanthud.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(77, "/datum/hud/revenant", "/datum/hud", {});

// /datum/hud/revenant/proc/New  (code/_onclick/hud/revenanthud.dm:3)  may sleep
rt.def("/datum/hud/revenant/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "healths", (yield* g.new_(f, T("/obj/screen/healths/revenant"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "healths"), add);
	return f.dot;
}, true, { args: ["owner"] });

// /mob/living/simple_animal/revenant/proc/create_mob_hud  (code/_onclick/hud/revenanthud.dm:9)  may sleep
rt.def("/mob/living/simple_animal/revenant/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(truthy(rt.sv(f, "client")) && !truthy(rt.sv(f, "hud_used")))) return f.dot;
	rt.setSv(f, "hud_used", (yield* g.new_(f, T("/datum/hud/revenant"), [live(f.src)])));
	return f.dot;
}, true);
