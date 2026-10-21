// From code/game/objects/items/weapons/grenades/clusterbuster.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6901, "/obj/item/weapon/grenade/clusterbuster", "/obj/item/weapon/grenade", {
	payload: rt.typePath("/obj/item/weapon/grenade/flashbang/cluster"),
	desc: "Use of this weapon may constiute a war crime in your area, consult your local captain.",
	name: "clusterbang",
	icon: rt.rsc("icons/obj/grenade.dmi"),
	icon_state: "clusterbang",
});

// /obj/item/weapon/grenade/clusterbuster/proc/prime  (code/game/objects/items/weapons/grenades/clusterbuster.dm:12)  may sleep
rt.def("/obj/item/weapon/grenade/clusterbuster/proc/prime", function* prime(f: Frame) {
	let numspawned: Value = null, again: Value = null, more: Value = null, loop: Value = null;
	f.vars = () => [numspawned, again, more, loop];
	yield* g.srcCall(f, "update_mob");
	numspawned = (yield* g.call(f, P("/proc/rand"), null, [4, 8]));
	again = 0;
	more = null;
	more = live(numspawned);
	while (rt.gt(live(more), 0)) {
		if (truthy(rt.op(f, "Prob", [], [35]))) {
			again = rt.inc(live(again), 1);
			numspawned = rt.inc(live(numspawned), -1);
		}
		more = rt.inc(live(more), -1);
	}
	loop = null;
	loop = live(again);
	while (rt.gt(live(loop), 0)) {
		yield* g.new_(f, T("/obj/item/weapon/grenade/clusterbuster/segment"), [rt.sv(f, "loc"), rt.sv(f, "payload")]);
		loop = rt.inc(live(loop), -1);
	}
	yield* g.new_(f, T("/obj/effect/payload_spawner"), [rt.sv(f, "loc"), rt.sv(f, "payload"), live(numspawned)]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/armbomb.ogg"), 75, 1, -3]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(6902, "/obj/item/weapon/grenade/clusterbuster/segment", "/obj/item/weapon/grenade/clusterbuster", {
	desc: "A smaller segment of a clusterbang. Better run.",
	name: "clusterbang segment",
	icon: rt.rsc("icons/obj/grenade.dmi"),
	icon_state: "clusterbang_segment",
});

// /obj/item/weapon/grenade/clusterbuster/segment/proc/New  (code/game/objects/items/weapons/grenades/clusterbuster.dm:41)  may sleep
rt.def("/obj/item/weapon/grenade/clusterbuster/segment/proc/New", function* New(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = T("/obj/item/weapon/grenade/flashbang/cluster");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", "clusterbang_segment_active");
	rt.setSv(f, "payload", live(f.args[1]));
	rt.setSv(f, "active", 1);
	yield* g.call(f, P("/proc/walk_away"), null, [live(f.src), live(f.args[0]), (yield* g.call(f, P("/proc/rand"), null, [1, 4]))]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/grenade/clusterbuster/segment/proc/prime")])), (yield* g.call(f, P("/proc/rand"), null, [15, 60]))]);
	return f.dot;
}, true, { args: ["loc", "payload_type"] });

// /obj/item/weapon/grenade/clusterbuster/segment/proc/prime  (code/game/objects/items/weapons/grenades/clusterbuster.dm:50)  may sleep
rt.def("/obj/item/weapon/grenade/clusterbuster/segment/proc/prime", function* prime(f: Frame) {
	yield* g.new_(f, T("/obj/effect/payload_spawner"), [rt.sv(f, "loc"), rt.sv(f, "payload"), (yield* g.call(f, P("/proc/rand"), null, [4, 8]))]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/armbomb.ogg"), 75, 1, -3]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(11952, "/obj/effect/payload_spawner", "/obj/effect", {});

// /obj/effect/payload_spawner/proc/New  (code/game/objects/items/weapons/grenades/clusterbuster.dm:61)  may sleep
rt.def("/obj/effect/payload_spawner/proc/New", function* New(f: Frame, newloc: Value, type: Value, numspawned: Value) {
	let loop: Value = null, _P: Value = null;
	f.vars = () => [newloc, type, numspawned, loop, _P];
	loop = null;
	loop = live(numspawned);
	while (rt.gt(live(loop), 0)) {
		rt.setFv(f, "active", (_P = (yield* g.new_(f, live(type), [rt.sv(f, "loc")]))), 1);
		yield* g.call(f, P("/proc/walk_away"), null, [live(_P), rt.sv(f, "loc"), (yield* g.call(f, P("/proc/rand"), null, [1, 4]))]);
		rt.spawnTail(f, (yield* g.call(f, P("/proc/rand"), null, [15, 60])), "/obj/effect/payload_spawner/proc/New: spawn at game/objects/items/weapons/grenades/clusterbuster.dm:64", newloc, type, numspawned, loop, _P);
		loop = rt.inc(live(loop), -1);
	}
	return f.dot;
}, true);

// a spawn((yield* g.call(f, P("/proc/rand"), null, [15, 60]))) body of /obj/effect/payload_spawner/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/payload_spawner/proc/New: spawn at game/objects/items/weapons/grenades/clusterbuster.dm:64", function* (f: Frame, newloc: Value, type: Value, numspawned: Value, loop: Value, _P: Value) {
	f.vars = () => [newloc, type, numspawned, loop, _P];
	if ((truthy(live(_P)) && !(!truthy(live(_P)) || truthy(rt.fv(f, "gc_destroyed", live(_P)))))) {
		yield* g.callName(f, live(_P), "prime", []);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return null;
});

rt.type(6916, "/obj/item/weapon/grenade/clusterbuster/random", "/obj/item/weapon/grenade/clusterbuster", {});

// /obj/item/weapon/grenade/clusterbuster/random/proc/New  (code/game/objects/items/weapons/grenades/clusterbuster.dm:133)  may sleep
rt.def("/obj/item/weapon/grenade/clusterbuster/random/proc/New", function* New(f: Frame) {
	let real_type: Value = null;
	f.vars = () => [real_type];
	real_type = rt.op(f, "PickUnweighted", [1], [subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/grenade/clusterbuster")])), T("/obj/item/weapon/grenade/clusterbuster"))]);
	yield* g.new_(f, live(real_type), [rt.sv(f, "loc")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
