// From code/game/objects/structures/showcase.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12871, "/obj/structure/showcase/fakeid", "/obj/structure/showcase", {
	name: "１Centcom identification console",
	desc: "You can use this to change ID's.",
	icon: rt.rsc("icons/obj/computer.dmi"),
	icon_state: "computer",
});

// /obj/structure/showcase/fakeid/proc/Initialize  (code/game/objects/structures/showcase.dm:21)
rt.def("/obj/structure/showcase/fakeid/proc/Initialize", function Initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "add_overlay", ["id"]);
	rt.callSrc(f, "add_overlay", ["id_key"]);
	return f.dot;
});

rt.type(12872, "/obj/structure/showcase/fakesec", "/obj/structure/showcase", {
	name: "１Centcom security records",
	desc: "Used to view and edit personnel's security records",
	icon: rt.rsc("icons/obj/computer.dmi"),
	icon_state: "computer",
});

// /obj/structure/showcase/fakesec/proc/Initialize  (code/game/objects/structures/showcase.dm:32)
rt.def("/obj/structure/showcase/fakesec/proc/Initialize", function Initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "add_overlay", ["security"]);
	rt.callSrc(f, "add_overlay", ["security_key"]);
	return f.dot;
});

rt.type(12870, "/obj/structure/showcase", "/obj/structure", {
	deconstruction_state: 1,
	anchored: 1,
	name: "showcase",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "showcase_1",
	desc: "A stand with the empty body of a cyborg bolted to it.",
	density: 1,
});

// /obj/structure/showcase/proc/attackby  (code/game/objects/structures/showcase.dm:54)  may sleep
rt.def("/obj/structure/showcase/proc/attackby", function* attackby(f: Frame, W: Value, user: Value) {
	f.vars = () => [W, user];
	if ((truthy((rt.istype(live(W), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && !truthy(rt.sv(f, "anchored")))) {
		if (isEqual(rt.sv(f, "deconstruction_state"), 2)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You screw the screws back into the showcase.</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(W)), 100, 1]);
			rt.setSv(f, "deconstruction_state", 1);
		} else {
			if (isEqual(rt.sv(f, "deconstruction_state"), 1)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You unscrew the screws.</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(W)), 100, 1]);
				rt.setSv(f, "deconstruction_state", 2);
			}
		}
	}
	if ((truthy((rt.istype(live(W), T("/obj/item/weapon/crowbar")) ? 1 : 0)) && isEqual(rt.sv(f, "deconstruction_state"), 2))) {
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(20, rt.fv(f, "toolspeed", live(W))), "target", live(f.src)], rt.Args.Named)))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(W)), 100, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You start to crowbar the showcase apart...</span>"]);
			yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.getStep(f, live(f.src), 0), 4]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	}
	if (!(isEqual(rt.sv(f, "deconstruction_state"), 1) && truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(user), live(W)))))) return f.dot;
	return live(f.dot);
}, true);

// /obj/structure/showcase/proc/examine  (code/game/objects/structures/showcase.dm:77)
rt.def("/obj/structure/showcase/proc/examine", function examine(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "deconstruction_state");
	if ($0 === 1) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "The showcase is fully constructed."]);
	} else if ($0 === 2) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "The showcase has its screws loosened."]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "If you see this, something is wrong."]);
	}
	return f.dot;
}, false, { args: ["user"] });
