// From code/game/objects/structures/mop_bucket.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12811, "/obj/structure/mopbucket", "/obj/structure", {
	amount_per_transfer_from_this: 5,
	container_type: 4096,
	name: "mop bucket",
	desc: "Fill it with water, but don't forget a mop!",
	icon: rt.rsc("icons/obj/janitor.dmi"),
	icon_state: "mopbucket",
	density: 1,
});

// /obj/structure/mopbucket/proc/New  (code/game/objects/structures/mop_bucket.dm:12)  may sleep
rt.def("/obj/structure/mopbucket/proc/New", function* New(f: Frame) {
	yield* g.srcCall(f, "create_reagents", 100);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/structure/mopbucket/proc/attackby  (code/game/objects/structures/mop_bucket.dm:16)  may sleep
rt.def("/obj/structure/mopbucket/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/mop")) ? 1 : 0))) {
		if (rt.lt(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＀ is out of water!</span>", [live(f.src)])]);
		} else {
			yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(f.args[0]), 5]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You wet ＀ in ＀.</span>", [live(f.args[0]), live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/slosh.ogg"), 25, 1]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });
