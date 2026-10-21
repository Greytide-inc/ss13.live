// From code/modules/assembly/igniter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9361, "/obj/item/device/assembly/igniter", "/obj/item/device/assembly", {
	sparks: null,
	name: "igniter",
	desc: "A small electronic device able to ignite combustible substances.",
	icon_state: "igniter",
	materials: null,
	origin_tech: "magnets=1",
	heat: 1000,
});

// /obj/item/device/assembly/igniter/proc/<init>  (code/modules/assembly/igniter.dm:7)
rt.def("/obj/item/device/assembly/igniter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "sparks", rt.new_(f, T("/datum/effect_system/spark_spread"), []));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 50]));
	return f.dot;
});

// /obj/item/device/assembly/igniter/proc/New  (code/modules/assembly/igniter.dm:11)  may sleep
rt.def("/obj/item/device/assembly/igniter/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "sparks"), "set_up", [2, 0, live(f.src)]);
	yield* g.callName(f, rt.sv(f, "sparks"), "attach", [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/device/assembly/igniter/proc/Destroy  (code/modules/assembly/igniter.dm:16)  may sleep
rt.def("/obj/item/device/assembly/igniter/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "sparks")]);
	rt.setSv(f, "sparks", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/device/assembly/igniter/proc/activate  (code/modules/assembly/igniter.dm:21)  may sleep
rt.def("/obj/item/device/assembly/igniter/proc/activate", function* activate(f: Frame) {
	let location: Value = null;
	f.vars = () => [location];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	if (truthy((location = rt.getStep(f, rt.sv(f, "loc"), 0)))) {
		yield* g.callName(f, live(location), "hotspot_expose", [1000, 1000]);
	}
	yield* g.callName(f, rt.sv(f, "sparks"), "start", []);
	return 1;
}, true);

// /obj/item/device/assembly/igniter/proc/attack_self  (code/modules/assembly/igniter.dm:30)  may sleep
rt.def("/obj/item/device/assembly/igniter/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "activate");
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

// /obj/item/device/assembly/igniter/proc/ignition_effect  (code/modules/assembly/igniter.dm:34)  may sleep
rt.def("/obj/item/device/assembly/igniter/proc/ignition_effect", function* ignition_effect(f: Frame, A: Value, user: Value) {
	f.vars = () => [A, user];
	f.dot = fmt("<span class='notice'>＀ fiddles with ＀, and manages to light ＀.</span>", [live(user), live(f.src), live(A)]);
	yield* g.srcCall(f, "activate");
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);
