// From code/modules/mob/living/silicon/death.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/proc/spawn_gibs  (code/modules/mob/living/silicon/death.dm:2)  may sleep
rt.def("/mob/living/silicon/proc/spawn_gibs", function* spawn_gibs(f: Frame) {
	yield* g.new_(f, T("/obj/effect/gibspawner/robot"), [rt.sv(f, "loc"), rt.sv(f, "viruses")]);
	return f.dot;
}, true);

// /mob/living/silicon/proc/spawn_dust  (code/modules/mob/living/silicon/death.dm:5)  may sleep
rt.def("/mob/living/silicon/proc/spawn_dust", function* spawn_dust(f: Frame) {
	yield* g.new_(f, T("/obj/effect/decal/remains/robot"), [rt.sv(f, "loc")]);
	return f.dot;
}, true);

// /mob/living/silicon/proc/death  (code/modules/mob/living/silicon/death.dm:8)  may sleep
rt.def("/mob/living/silicon/proc/death", function* death(f: Frame) {
	if (!truthy(live(f.args[0]))) {
		yield* g.srcCall(f, "emote", "deathgasp");
	}
	yield* g.srcCall(f, "diag_hud_set_status");
	yield* g.srcCall(f, "diag_hud_set_health");
	yield* g.srcCall(f, "update_health_hud");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["gibbed"] });
