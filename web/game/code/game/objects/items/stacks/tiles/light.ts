// From code/game/objects/items/stacks/tiles/light.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8973, "/obj/item/stack/tile/light", "/obj/item/stack/tile", {
	state: 0,
	flags: 64,
	name: "light tile",
	singular_name: "light floor tile",
	desc: "A floor tile, made out of glass. It produces light.",
	icon_state: "tile_e",
	attack_verb: null,
	turf_type: rt.typePath("/turf/open/floor/light"),
});

// /obj/item/stack/tile/light/proc/Initialize  (code/game/objects/items/stacks/tiles/light.dm:12)  may sleep
rt.def("/obj/item/stack/tile/light/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		rt.setSv(f, "state", 3);
	} else {
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			rt.setSv(f, "state", 2);
		} else {
			if (truthy(rt.op(f, "Prob", [], [10]))) {
				rt.setSv(f, "state", 1);
			} else {
				rt.setSv(f, "state", 0);
			}
		}
	}
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// /obj/item/stack/tile/light/proc/attackby  (code/game/objects/items/stacks/tiles/light.dm:23)  may sleep
rt.def("/obj/item/stack/tile/light/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.fv(f, "loc", live(f.args[1]))]);
		rt.incSrcVar(f, "amount", -1, true);
		yield* g.new_(f, T("/obj/item/stack/light_w"), [rt.fv(f, "loc", live(f.args[1]))]);
		if (rt.le(rt.sv(f, "amount"), 0)) {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });
