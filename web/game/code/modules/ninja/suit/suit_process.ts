// From code/modules/ninja/suit/suit_process.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/clothing/suit/space/space_ninja/proc/ntick  (code/modules/ninja/suit/suit_process.dm:6)
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ntick", function ntick(f: Frame, U: Value) {
	f.vars = () => [U];
	if (live(U) === null) {
		U = rt.sv(f, "affecting");
	}
	rt.spawnTail(f, 0, "/obj/item/clothing/suit/space/space_ninja/proc/ntick: spawn at modules/ninja/suit/suit_process.dm:6", U);
	return f.dot;
});

// a spawn(0) body of /obj/item/clothing/suit/space/space_ninja/proc/ntick, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/clothing/suit/space/space_ninja/proc/ntick: spawn at modules/ninja/suit/suit_process.dm:6", function* (f: Frame, U: Value) {
	f.vars = () => [U];
	while (truthy(rt.sv(f, "s_initialized"))) {
		if (!truthy(rt.sv(f, "affecting"))) {
			yield* g.srcCall(f, "terminate");
		} else {
			if (rt.gt(rt.fv(f, "charge", rt.sv(f, "cell")), 0)) {
				if (truthy(rt.sv(f, "s_coold"))) {
					rt.incSrcVar(f, "s_coold", -1, true);
				}
				(rt.modField(f, rt.sv(f, "cell"), "charge", rt.sv(f, "s_cost"), subtract));
				if (truthy(rt.sv(f, "s_active"))) {
					(rt.modField(f, rt.sv(f, "cell"), "charge", rt.sv(f, "s_acost"), subtract));
				}
			} else {
				rt.setFv(f, "charge", rt.sv(f, "cell"), 0);
				yield* g.srcCall(f, "cancel_stealth");
			}
		}
		yield* g.call(f, P("/proc/sleep"), null, [10]);
	}
	return null;
});
