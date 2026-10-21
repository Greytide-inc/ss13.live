// From code/game/objects/items/stacks/sheets/light.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9110, "/obj/item/stack/light_w", "/obj/item/stack", {
	singular_name: "wired glass floor tile",
	throw_speed: 3,
	throw_range: 7,
	flags: 64,
	max_amount: 60,
	name: "wired glass tile",
	desc: "A glass tile, which is wired, somehow.",
	icon: rt.rsc("icons/obj/tiles.dmi"),
	icon_state: "glass_wire",
	w_class: 3,
	force: 3,
	throwforce: 5,
});

// /obj/item/stack/light_w/proc/attackby  (code/game/objects/items/stacks/sheets/light.dm:17)  may sleep
rt.def("/obj/item/stack/light_w/proc/attackby", function* attackby(f: Frame) {
	let CC: Value = null, G: Value = null, M: Value = null, L: Value = null;
	f.vars = () => [CC, G, M, L];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
		rt.setFv(f, "amount", (CC = (yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.fv(f, "loc", live(f.args[1]))]))), 5);
		yield* g.callName(f, live(CC), "add_fingerprint", [live(f.args[1])]);
		rt.incSrcVar(f, "amount", -1, true);
		yield* g.callName(f, (G = (yield* g.new_(f, T("/obj/item/stack/sheet/glass"), [rt.fv(f, "loc", live(f.args[1]))]))), "add_fingerprint", [live(f.args[1])]);
		if (rt.le(rt.sv(f, "amount"), 0)) {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/metal")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (M = live(f.args[0])), "use", [1])))) {
				yield* g.srcCall(f, "use", 1);
				L = (yield* g.new_(f, T("/obj/item/stack/tile/light"), [rt.fv(f, "loc", live(f.args[1]))]));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You make a light tile.</span>"]);
				yield* g.callName(f, live(L), "add_fingerprint", [live(f.args[1])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one metal sheet to finish the light tile!</span>"]);
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });
