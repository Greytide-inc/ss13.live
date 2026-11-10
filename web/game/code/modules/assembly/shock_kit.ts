// Based on /tg/station's code/modules/assembly/shock_kit.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9883, "/obj/item/assembly/shock_kit", "/obj/item/assembly", {
	part1: null,
	part2: null,
	w_class: 5,
	flags: 64,
	name: "electrohelmet assembly",
	desc: "This appears to be made from both an electropack and a helmet.",
	icon: rt.rsc("icons/obj/assemblies.dmi"),
	icon_state: "shock_kit",
});

// shock_kit.dm:12
rt.def("/obj/item/assembly/shock_kit/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.part1);
	yield* qdel(this.part2);
	return (yield* parent_proc());
}, true);

// shock_kit.dm:17
rt.def("/obj/item/assembly/shock_kit/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		if (ismob((_T = this.loc))) {
			_T = _T.loc;
		}
		this.part1.loc = _T;
		this.part2.loc = _T;
		this.part1.master = null;
		this.part2.master = null;
		this.part1 = null;
		this.part2 = null;
		yield* qdel(this);
		return f.dot;
	}
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// shock_kit.dm:33
rt.def("/obj/item/assembly/shock_kit/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.part1.attack_self(user);
	yield* this.part2.attack_self(user);
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// shock_kit.dm:39
rt.def("/obj/item/assembly/shock_kit/proc/receive_signal", function* receive_signal(f: Frame) {
	let C: Value = null;
	if (rt.istype(this.loc, T("/obj/structure/chair/e_chair"))) {
		yield* (C = this.loc).shock();
	}
	return f.dot;
}, true);
