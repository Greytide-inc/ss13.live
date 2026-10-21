// From code/modules/ninja/suit/n_suit_verbs/ninja_stars.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/clothing/suit/space/space_ninja/proc/ninjastar  (code/modules/ninja/suit/n_suit_verbs/ninja_stars.dm:5)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninjastar", function* ninjastar(f: Frame) {
	let H: Value = null, N: Value = null;
	f.vars = () => [H, N];
	if (truthy((yield* g.srcCall(f, "ninjacost", 10)))) return f.dot;
	H = rt.sv(f, "affecting");
	N = (yield* g.new_(f, T("/obj/item/weapon/throwing_star/ninja"), [live(H)]));
	if (truthy((yield* g.callName(f, live(H), "put_in_hands", [live(N)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>A throwing star has been created in your hand!</span>"]);
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(N)]);
	}
	yield* g.callName(f, live(H), "throw_mode_on", []);
	return f.dot;
}, true);
