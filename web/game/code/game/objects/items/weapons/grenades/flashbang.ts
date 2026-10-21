// From code/game/objects/items/weapons/grenades/flashbang.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6917, "/obj/item/weapon/grenade/flashbang", "/obj/item/weapon/grenade", {
	name: "flashbang",
	icon_state: "flashbang",
	item_state: "flashbang",
	origin_tech: "materials=2;combat=3",
});

// /obj/item/weapon/grenade/flashbang/proc/prime  (code/game/objects/items/weapons/grenades/flashbang.dm:8)  may sleep
rt.def("/obj/item/weapon/grenade/flashbang/proc/prime", function* prime(f: Frame) {
	let flashbang_turf: Value = null, M: Value = null, B: Value = null, distance: Value = null, damage: Value = null;
	let $e: any;
	f.vars = () => [flashbang_turf, M, B, distance, damage, $e];
	yield* g.srcCall(f, "update_mob");
	if (!truthy((flashbang_turf = rt.getStep(f, live(f.src), 0)))) {
		return live(f.dot);
	}
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/get_hearers_in_view"), null, [7, live(flashbang_turf)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.srcCall(f, "bang", rt.getStep(f, live(M), 0), live(M));
	}
	rt.endFor(f, 0);
	B = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/get_hear"), null, [8, live(flashbang_turf)])), T("/obj/structure/blob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		distance = (yield* g.call(f, P("/proc/get_dist"), null, [live(B), rt.getStep(f, live(f.src), 0)]));
		damage = (yield* g.call(f, P("/proc/round"), null, [add(divide(100, multiply(live(distance), live(distance))), 1)]));
		yield* g.callName(f, live(B), "take_damage", [live(damage), "fire", "energy"]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/flashbang/proc/bang  (code/game/objects/items/weapons/grenades/flashbang.dm:22)  may sleep
rt.def("/obj/item/weapon/grenade/flashbang/proc/bang", function* bang(f: Frame, _T: Value, M: Value) {
	let distance: Value = null;
	f.vars = () => [_T, M, distance];
	if (isEqual(rt.fv(f, "stat", live(M)), 2)) {
		return live(f.dot);
	}
	yield* g.callName(f, live(M), "show_message", ["<span class='warning'>BANG</span>", 2]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/flashbang.ogg"), 100, 1]);
	distance = (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/get_dist"), null, [rt.getStep(f, live(f.src), 0), live(_T)]))]));
	if (truthy((yield* g.callName(f, live(M), "flash_act", ["affect_silicon", 1], rt.Args.Named)))) {
		yield* g.callName(f, live(M), "Knockdown", [(yield* g.call(f, P("/proc/max"), null, [divide(100, (yield* g.call(f, P("/proc/max"), null, [1, live(distance)]))), 3]))]);
	}
	if (((!truthy(live(distance)) || isEqual(rt.sv(f, "loc"), live(M))) || isEqual(rt.sv(f, "loc"), rt.fv(f, "loc", live(M))))) {
		yield* g.callName(f, live(M), "Knockdown", [200]);
		yield* g.callName(f, live(M), "soundbang_act", [1, 200, 10, 15]);
	} else {
		yield* g.callName(f, live(M), "soundbang_act", [1, (yield* g.call(f, P("/proc/max"), null, [divide(20, (yield* g.call(f, P("/proc/max"), null, [1, live(distance)]))), 3])), (yield* g.call(f, P("/proc/rand"), null, [0, 5]))]);
	}
	return f.dot;
}, true);
