// From code/modules/assembly/shock_kit.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/assembly/shock_kit/proc/Destroy  (code/modules/assembly/shock_kit.dm:12)  may sleep
rt.def("/obj/item/assembly/shock_kit/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "part1")]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "part2")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/assembly/shock_kit/proc/attackby  (code/modules/assembly/shock_kit.dm:17)  may sleep
rt.def("/obj/item/assembly/shock_kit/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null;
	f.vars = () => [W, user, params, _T];
	if (truthy((rt.istype(live(W), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [(_T = rt.sv(f, "loc"))])))) {
			_T = rt.fv(f, "loc", live(_T));
		}
		rt.setFv(f, "loc", rt.sv(f, "part1"), live(_T));
		rt.setFv(f, "loc", rt.sv(f, "part2"), live(_T));
		rt.setFv(f, "master", rt.sv(f, "part1"), null);
		rt.setFv(f, "master", rt.sv(f, "part2"), null);
		rt.setSv(f, "part1", null);
		rt.setSv(f, "part2", null);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return live(f.dot);
}, true);

// /obj/item/assembly/shock_kit/proc/attack_self  (code/modules/assembly/shock_kit.dm:33)  may sleep
rt.def("/obj/item/assembly/shock_kit/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, rt.sv(f, "part1"), "attack_self", [live(user)]);
	yield* g.callName(f, rt.sv(f, "part2"), "attack_self", [live(user)]);
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return live(f.dot);
}, true);

// /obj/item/assembly/shock_kit/proc/receive_signal  (code/modules/assembly/shock_kit.dm:39)  may sleep
rt.def("/obj/item/assembly/shock_kit/proc/receive_signal", function* receive_signal(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/structure/chair/e_chair")) ? 1 : 0))) {
		yield* g.callName(f, (C = rt.sv(f, "loc")), "shock", []);
	}
	return live(f.dot);
}, true);
