// Based on /tg/station's code/modules/admin/verbs/machine_upgrade.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


// machine_upgrade.dm:4
rt.def("/proc/machine_upgrade", function* machine_upgrade(f: Frame, M: Value) {
	let new_rating: Value = null, _P: Value = null;
	if ((new_rating = (yield* g.op(f, "Prompt", [32], [null, null, "Num", "Enter new rating:", null]))) && M.component_parts) {
		for (_P of each(M.component_parts, T("/obj/item/weapon/stock_parts"))) {
			_P.rating = new_rating;
		}
		yield* M.RefreshParts();
	}
	return f.dot;
}, true, { verb: { name: "Tweak Component Ratings", category: "Debug" }, argTypes: [{ type: 4, path: "/obj/machinery", source: "world" }] });
