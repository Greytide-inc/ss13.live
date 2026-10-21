// From code/game/objects/effects/spawners/bombspawner.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11836, "/obj/effect/spawner/newbomb", "/obj/effect/spawner", {
	btemp1: 1500,
	btemp2: 1000,
	assembly_type: null,
	name: "bomb",
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x",
});

// /obj/effect/spawner/newbomb/proc/Initialize  (code/game/objects/effects/spawners/bombspawner.dm:10)  may sleep
rt.def("/obj/effect/spawner/newbomb/proc/Initialize", function* Initialize(f: Frame) {
	let V: Value = null, PT: Value = null, OT: Value = null, A: Value = null;
	f.vars = () => [V, PT, OT, A];
	yield* g.callSuper(f, [], rt.Args.Same);
	V = (yield* g.new_(f, T("/obj/item/device/transfer_valve"), [rt.fv(f, "loc", live(f.src))]));
	PT = (yield* g.new_(f, T("/obj/item/weapon/tank/internals/plasma/full"), [live(V)]));
	OT = (yield* g.new_(f, T("/obj/item/weapon/tank/internals/oxygen"), [live(V)]));
	rt.setFv(f, "temperature", rt.fv(f, "air_contents", live(PT)), add(rt.sv(f, "btemp1"), 273.1499938964844));
	rt.setFv(f, "temperature", rt.fv(f, "air_contents", live(OT)), add(rt.sv(f, "btemp2"), 273.1499938964844));
	rt.setFv(f, "tank_one", live(V), live(PT));
	rt.setFv(f, "tank_two", live(V), live(OT));
	rt.setFv(f, "master", live(PT), live(V));
	rt.setFv(f, "master", live(OT), live(V));
	if (truthy(rt.sv(f, "assembly_type"))) {
		A = (yield* g.new_(f, rt.sv(f, "assembly_type"), [live(V)]));
		rt.setFv(f, "attached_device", live(V), live(A));
		rt.setFv(f, "holder", live(A), live(V));
		yield* g.callName(f, live(A), "toggle_secure", []);
	}
	yield* g.callName(f, live(V), "update_icon", []);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
