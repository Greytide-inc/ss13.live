// Based on /tg/station's code/modules/assembly/igniter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9361, "/obj/item/device/assembly/igniter", "/obj/item/device/assembly", {
	sparks: null,
	name: "igniter",
	desc: "A small electronic device able to ignite combustible substances.",
	icon_state: "igniter",
	materials: null,
	origin_tech: "magnets=1",
	heat: 1000,
});

// igniter.dm:7
rt.def("/obj/item/device/assembly/igniter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.sparks = new_(T("/datum/effect_system/spark_spread"));
	this.materials = rt.alist(f, ["$metal", 500, "$glass", 50]);
	return f.dot;
});

// igniter.dm:11
rt.def("/obj/item/device/assembly/igniter/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.sparks.set_up(2, 0, this);
	yield* this.sparks.attach(this);
	return f.dot;
}, true);

// igniter.dm:16
rt.def("/obj/item/device/assembly/igniter/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.sparks);
	this.sparks = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// igniter.dm:21
rt.def("/obj/item/device/assembly/igniter/proc/activate", function* activate(f: Frame) {
	let location: Value = null;
	if (!(yield* parent_proc())) {
		return 0;
	}
	if (location = rt.getStep(f, this.loc, 0)) {
		yield* location.hotspot_expose(1000, 1000);
	}
	yield* this.sparks.start();
	return 1;
}, true);

// igniter.dm:30
rt.def("/obj/item/device/assembly/igniter/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.activate();
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// igniter.dm:34
rt.def("/obj/item/device/assembly/igniter/proc/ignition_effect", function* ignition_effect(f: Frame, A: Value, user: Value) {
	f.dot = `<span class='notice'>${user} fiddles with ${this}, and manages to light ${A}.</span>`;
	yield* this.activate();
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);
