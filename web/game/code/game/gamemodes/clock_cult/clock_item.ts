// From code/game/gamemodes/clock_cult/clock_item.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8927, "/obj/item/clockwork", "/obj/item", {
	clockwork_desc: "A fabled artifact from beyond the stars. Contains concentrated meme essence.",
	name: "meme blaster",
	desc: "What the fuck is this? It looks kinda like a frog.",
	resistance_flags: 34,
	icon: rt.rsc("icons/obj/clockwork_objects.dmi"),
	icon_state: "rare_pepe",
	w_class: 2,
});

// /obj/item/clockwork/proc/Initialize  (code/game/gamemodes/clock_cult/clock_item.dm:12)  may sleep
rt.def("/obj/item/clockwork/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "ratvar_act");
	rt.modGl("all_clockwork_objects", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/clockwork/proc/Destroy  (code/game/gamemodes/clock_cult/clock_item.dm:17)  may sleep
rt.def("/obj/item/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("all_clockwork_objects", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/clockwork/proc/examine  (code/game/gamemodes/clock_cult/clock_item.dm:21)
rt.def("/obj/item/clockwork/proc/examine", function examine(f: Frame) {
	if (((truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0))) && truthy(rt.sv(f, "clockwork_desc")))) {
		rt.setSv(f, "desc", rt.sv(f, "clockwork_desc"));
	}
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
	return f.dot;
}, false, { args: ["user"] });
