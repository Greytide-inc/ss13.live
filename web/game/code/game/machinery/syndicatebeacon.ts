// From code/game/machinery/syndicatebeacon.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10305, "/obj/machinery/power/singularity_beacon", "/obj/machinery/power", {
	cooldown: 0,
	active: 0,
	icontype: "beacon",
	anchored: 0,
	verb_say: "states",
	name: "ominous beacon",
	desc: "This looks suspicious...",
	icon: rt.rsc("icons/obj/singularity.dmi"),
	icon_state: "beacon",
	density: 1,
	layer: 3.7,
	stat: 0,
});

// /obj/machinery/power/singularity_beacon/proc/Activate  (code/game/machinery/syndicatebeacon.dm:22)
rt.def("/obj/machinery/power/singularity_beacon/proc/Activate", function Activate(f: Frame, user: Value) {
	let singulo: Value = null;
	let $e: any;
	f.vars = () => [user, singulo, $e];
	if (live(user) === null) {
		user = null;
	}
	if (rt.lt(rt.callSrc(f, "surplus", []), 1500)) {
		if (truthy(live(user))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The connected wire doesn't have enough current.</span>"]);
		}
		return live(f.dot);
	}
	singulo = null;
	rt.forList(f, 0, rt.gl("singularities"), T("/obj/singularity"));
	while (($e = rt.next(f, 0)) !== undefined) {
		singulo = $e;
		if (isEqual(rt.fv(f, "z", live(singulo)), rt.sv(f, "z"))) {
			rt.setFv(f, "target", live(singulo), live(f.src));
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "icon_state", fmt("＀1", [rt.sv(f, "icontype")]));
	rt.setSv(f, "active", 1);
	if (!truthy(live(user))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You activate the beacon.</span>"]);
	return f.dot;
});

// /obj/machinery/power/singularity_beacon/proc/Deactivate  (code/game/machinery/syndicatebeacon.dm:35)
rt.def("/obj/machinery/power/singularity_beacon/proc/Deactivate", function Deactivate(f: Frame, user: Value) {
	let singulo: Value = null;
	let $e: any;
	f.vars = () => [user, singulo, $e];
	if (live(user) === null) {
		user = null;
	}
	singulo = null;
	rt.forList(f, 0, rt.gl("singularities"), T("/obj/singularity"));
	while (($e = rt.next(f, 0)) !== undefined) {
		singulo = $e;
		if (isEqual(rt.fv(f, "target", live(singulo)), live(f.src))) {
			rt.setFv(f, "target", live(singulo), null);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "icon_state", fmt("＀0", [rt.sv(f, "icontype")]));
	rt.setSv(f, "active", 0);
	if (!truthy(live(user))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You deactivate the beacon.</span>"]);
	return f.dot;
});

// /obj/machinery/power/singularity_beacon/proc/attack_hand  (code/game/machinery/syndicatebeacon.dm:50)
rt.def("/obj/machinery/power/singularity_beacon/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.sv(f, "anchored"))) {
		if (truthy(rt.sv(f, "active"))) {
			$0 = rt.callSrc(f, "Deactivate", [live(user)]);
		} else {
			$0 = rt.callSrc(f, "Activate", [live(user)]);
		}
		return $0;
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need to screw the beacon to the floor first!</span>"]);
	return live(f.dot);
});

// /obj/machinery/power/singularity_beacon/proc/attackby  (code/game/machinery/syndicatebeacon.dm:57)  may sleep
rt.def("/obj/machinery/power/singularity_beacon/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "active"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need to deactivate the beacon first!</span>"]);
			return live(f.dot);
		}
		if (truthy(rt.sv(f, "anchored"))) {
			rt.setSv(f, "anchored", 0);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unscrew the beacon from the floor.</span>"]);
			yield* g.srcCall(f, "disconnect_from_network");
			return live(f.dot);
		} else {
			if (!truthy((yield* g.srcCall(f, "connect_to_network")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This device must be placed over an exposed, powered cable node!</span>"]);
				return live(f.dot);
			}
			rt.setSv(f, "anchored", 1);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You screw the beacon to the floor and attach the cable.</span>"]);
			return live(f.dot);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/power/singularity_beacon/proc/Destroy  (code/game/machinery/syndicatebeacon.dm:79)  may sleep
rt.def("/obj/machinery/power/singularity_beacon/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "active"))) {
		yield* g.srcCall(f, "Deactivate");
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/power/singularity_beacon/proc/process  (code/game/machinery/syndicatebeacon.dm:84)  may sleep
rt.def("/obj/machinery/power/singularity_beacon/proc/process", function* process(f: Frame) {
	let singulo: Value = null;
	let $e: any;
	f.vars = () => [singulo, $e];
	if (!truthy(rt.sv(f, "active"))) {
		return live(f.dot);
	}
	if (rt.gt((yield* g.srcCall(f, "surplus")), 1500)) {
		yield* g.srcCall(f, "add_load", 1500);
		if (rt.le(rt.sv(f, "cooldown"), rt.worldTime(f))) {
			rt.setSv(f, "cooldown", add(rt.worldTime(f), 100));
			singulo = null;
			rt.forList(f, 0, rt.gl("singularities"), T("/obj/singularity"));
			while (($e = rt.next(f, 0)) !== undefined) {
				singulo = $e;
				if (isEqual(rt.fv(f, "z", live(singulo)), rt.sv(f, "z"))) {
					yield* g.srcCall(f, "say", fmt("The ＀ is now ＀ standard lengths away to the ＀", [live(singulo), (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(singulo)])), (yield* g.call(f, P("/proc/dir2text"), null, [rt.getDir(f, live(f.src), live(singulo))]))]));
				}
			}
			rt.endFor(f, 0);
		}
	} else {
		yield* g.srcCall(f, "Deactivate");
		yield* g.srcCall(f, "say", "Insufficient charge detected - powering down");
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(9222, "/obj/item/device/sbeacondrop", "/obj/item/device", {
	droptype: rt.typePath("/obj/machinery/power/singularity_beacon/syndicate"),
	name: "suspicious beacon",
	icon: rt.rsc("icons/obj/radio.dmi"),
	icon_state: "beacon",
	desc: "A label on it reads: <i>Warning: Activating this device will send a special beacon to your location</i>.",
	origin_tech: "bluespace=6;syndicate=5",
	w_class: 2,
});

// /obj/item/device/sbeacondrop/proc/attack_self  (code/game/machinery/syndicatebeacon.dm:116)  may sleep
rt.def("/obj/item/device/sbeacondrop/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(live(user))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Locked In.</span>"]);
		yield* g.new_(f, rt.sv(f, "droptype"), [rt.fv(f, "loc", live(user))]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/pop.ogg"), 100, 1, 1]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return live(f.dot);
}, true);
