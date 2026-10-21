// From code/game/objects/structures/fluff.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12752, "/obj/structure/fluff", "/obj/structure", {
	deconstructible: 1,
	anchored: 1,
	name: "fluff structure",
	desc: "Fluffier than a sheep. This shouldn't exist.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "minibar",
	density: 0,
	opacity: 0,
});

// /obj/structure/fluff/proc/attackby  (code/game/objects/structures/fluff.dm:14)  may sleep
rt.def("/obj/structure/fluff/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && truthy(rt.sv(f, "deconstructible")))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ starts disassembling ＀...</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You start disassembling ＀...</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.args[1]), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 50, "target", live(f.src)], rt.Args.Named)))) {
			return 0;
		}
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ disassembles ＀!</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You break down ＀ into scrap metal.</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.args[1]), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.getStep(f, live(f.src), 0)]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(12765, "/obj/structure/fluff/bus/passable/seat/driver", "/obj/structure/fluff/bus/passable/seat", {
	name: "driver's seat",
	desc: "Space Jesus is my copilot.",
	icon_state: "driverseat",
});

// /obj/structure/fluff/bus/passable/seat/driver/proc/attack_hand  (code/game/objects/structures/fluff.dm:108)
rt.def("/obj/structure/fluff/bus/passable/seat/driver/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/carhorn.ogg"), 50, 1]);
	return f.dot;
});
