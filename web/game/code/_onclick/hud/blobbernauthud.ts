// From code/_onclick/hud/blobbernauthud.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(65, "/datum/hud/blobbernaut", "/datum/hud", {});

// /datum/hud/blobbernaut/proc/New  (code/_onclick/hud/blobbernauthud.dm:3)  may sleep
rt.def("/datum/hud/blobbernaut/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "blobpwrdisplay", (yield* g.new_(f, T("/obj/screen/healths/blob/naut/core"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "blobpwrdisplay"), add);
	rt.setSv(f, "healths", (yield* g.new_(f, T("/obj/screen/healths/blob/naut"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "healths"), add);
	return f.dot;
}, true, { args: ["owner"] });

// /mob/living/simple_animal/hostile/blob/blobbernaut/proc/create_mob_hud  (code/_onclick/hud/blobbernauthud.dm:12)  may sleep
rt.def("/mob/living/simple_animal/hostile/blob/blobbernaut/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(truthy(rt.sv(f, "client")) && !truthy(rt.sv(f, "hud_used")))) return f.dot;
	rt.setSv(f, "hud_used", (yield* g.new_(f, T("/datum/hud/blobbernaut"), [live(f.src)])));
	return f.dot;
}, true);
