// From code/modules/admin/verbs/machine_upgrade.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/machine_upgrade  (code/modules/admin/verbs/machine_upgrade.dm:4)  may sleep
rt.def("/proc/machine_upgrade", function* machine_upgrade(f: Frame, M: Value) {
	let new_rating: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [M, new_rating, _P, $e];
	if ((truthy((new_rating = (yield* g.op(f, "Prompt", [32], [null, null, "Num", "Enter new rating:", null])))) && truthy(rt.fv(f, "component_parts", live(M))))) {
		_P = null;
		rt.forList(f, 0, rt.fv(f, "component_parts", live(M)), T("/obj/item/weapon/stock_parts"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_P = $e;
			rt.setFv(f, "rating", live(_P), live(new_rating));
		}
		rt.endFor(f, 0);
		yield* g.callName(f, live(M), "RefreshParts", []);
	}
	return f.dot;
}, true, { verb: { name: "Tweak Component Ratings", category: "Debug" }, argTypes: [{ type: 4, path: "/obj/machinery", source: "world" }] });
