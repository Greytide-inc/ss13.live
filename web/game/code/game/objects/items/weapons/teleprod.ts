// From code/game/objects/items/weapons/teleprod.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5664, "/obj/item/weapon/melee/baton/cattleprod/teleprod", "/obj/item/weapon/melee/baton/cattleprod", {
	name: "teleprod",
	desc: "A prod with a bluespace crystal on the end. The crystal doesn't look too fun to touch.",
	w_class: 3,
	icon_state: "teleprod_nocell",
	item_state: "teleprod",
	origin_tech: "combat=2;bluespace=4;materials=3",
	slot_flags: null,
});

// /obj/item/weapon/melee/baton/cattleprod/teleprod/proc/attack  (code/game/objects/items/weapons/teleprod.dm:11)  may sleep
rt.def("/obj/item/weapon/melee/baton/cattleprod/teleprod/proc/attack", function* attack(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (((truthy(rt.sv(f, "status")) && truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[1])), 256))) && truthy(rt.op(f, "Prob", [], [50])))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ accidentally hits themself with ＀!</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='userdanger'>You accidentally hit yourself with ＀!</span>", [live(f.src)])]);
		if (truthy((yield* g.call(f, P("/proc/do_teleport"), null, [live(f.args[1]), rt.getStep(f, live(f.args[1]), 0), 50])))) {
			yield* g.callName(f, live(f.args[1]), "Knockdown", [multiply(rt.sv(f, "stunforce"), 3)]);
			yield* g.srcCall(f, "deductcharge", rt.sv(f, "hitcost"));
		} else {
			yield* g.callName(f, live(f.args[1]), "Knockdown", [multiply(rt.sv(f, "stunforce"), 3)]);
			yield* g.srcCall(f, "deductcharge", divide(rt.sv(f, "hitcost"), 4));
		}
		return live(f.dot);
	} else {
		if (!truthy(rt.sv(f, "status"))) return f.dot;
		if ((!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0)) && truthy(rt.fv(f, "anchored", live(f.args[0]))))) {
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/do_teleport"), null, [live(f.args[0]), rt.getStep(f, live(f.args[0]), 0), 15]);
		}
	}
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/weapon/melee/baton/cattleprod/proc/attackby  (code/game/objects/items/weapons/teleprod.dm:30)  may sleep
rt.def("/obj/item/weapon/melee/baton/cattleprod/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/ore/bluespace_crystal")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "cell"))) {
			S = (yield* g.new_(f, T("/obj/item/weapon/melee/baton/cattleprod/teleprod"), []));
			yield* g.srcCall(f, "remove_item_from_storage", live(f.args[1]));
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			yield* g.callName(f, live(f.args[1]), "put_in_hands", [live(S)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You place the bluespace crystal firmly into the igniter.</span>"]);
		} else {
			yield* g.callName(f, live(f.args[1]), "visible_message", ["<span class='warning'>You can't put the crystal onto the stunprod while it has a power cell installed!</span>"]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });
