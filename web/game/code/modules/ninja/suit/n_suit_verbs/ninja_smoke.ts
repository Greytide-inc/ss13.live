// From code/modules/ninja/suit/n_suit_verbs/ninja_smoke.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/clothing/suit/space/space_ninja/proc/ninjasmoke  (code/modules/ninja/suit/n_suit_verbs/ninja_smoke.dm:6)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninjasmoke", function* ninjasmoke(f: Frame) {
	let H: Value = null, smoke: Value = null;
	f.vars = () => [H, smoke];
	if (truthy((yield* g.srcCall(f, "ninjacost", 0, 2)))) return f.dot;
	H = rt.sv(f, "affecting");
	yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread/bad"), []))), "set_up", [4, rt.fv(f, "loc", live(H))]);
	yield* g.callName(f, live(smoke), "start", []);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(H)), rt.rsc("sound/effects/bamf.ogg"), 50, 2]);
	rt.incSrcVar(f, "s_bombs", -1, true);
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='notice'>There are <B>＀</B> smoke bombs remaining.</span>", [rt.sv(f, "s_bombs")])]);
	rt.setSv(f, "s_coold", 1);
	return f.dot;
}, true);
