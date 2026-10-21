// From code/game/objects/items/stacks/telecrystal.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9105, "/obj/item/stack/telecrystal", "/obj/item/stack", {
	singular_name: "telecrystal",
	max_amount: 50,
	flags: 4,
	name: "telecrystal",
	desc: "It seems to be pulsing with suspiciously enticing energies.",
	icon: rt.rsc("icons/obj/telescience.dmi"),
	icon_state: "telecrystal",
	w_class: 1,
	origin_tech: "materials=6;syndicate=1",
});

// /obj/item/stack/telecrystal/proc/attack  (code/game/objects/items/stacks/telecrystal.dm:13)  may sleep
rt.def("/obj/item/stack/telecrystal/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [target, user, I, $e];
	if (!isEqual(live(target), live(user))) return f.dot;
	I = null;
	rt.forList(f, 0, live(target), T("/obj/item/weapon/implant/uplink"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if ((truthy(live(I)) && truthy(rt.fv(f, "imp_in", live(I))))) {
			rt.modField(f, rt.fv(f, "hidden_uplink", live(I)), "telecrystals", rt.sv(f, "amount"), add);
			yield* g.srcCall(f, "use", rt.sv(f, "amount"));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You press ＀ onto yourself and charge your hidden uplink.</span>", [live(f.src)])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/stack/telecrystal/proc/afterattack  (code/game/objects/items/stacks/telecrystal.dm:21)  may sleep
rt.def("/obj/item/stack/telecrystal/proc/afterattack", function* afterattack(f: Frame, I: Value, user: Value, proximity: Value) {
	let cart: Value = null;
	f.vars = () => [I, user, proximity, cart];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (((truthy((rt.istype(live(I), T("/obj/item")) ? 1 : 0)) && truthy(rt.fv(f, "hidden_uplink", live(I)))) && truthy(rt.gv(f, "active", rt.fv(f, "hidden_uplink", live(I)))))) {
		rt.modField(f, rt.fv(f, "hidden_uplink", live(I)), "telecrystals", rt.sv(f, "amount"), add);
		yield* g.srcCall(f, "use", rt.sv(f, "amount"));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You slot ＀ into the ＀ and charge its internal uplink.</span>", [live(f.src), live(I)])]);
	} else {
		if (!truthy((rt.istype(live(I), T("/obj/item/weapon/cartridge/virus/frame")) ? 1 : 0))) return f.dot;
		if (!truthy(rt.gv(f, "charges", (cart = live(I))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>The ＀ is out of charges, it's refusing to accept the ＀</span>", [live(cart), live(f.src)])]);
			return live(f.dot);
		}
		rt.modField(f, live(cart), "telecrystals", rt.sv(f, "amount"), add);
		yield* g.srcCall(f, "use", rt.sv(f, "amount"));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You slot ＀ into the ＀.  The next time it's used, it will also give telecrystals</span>", [live(f.src), live(cart)])]);
	}
	return f.dot;
}, true);
