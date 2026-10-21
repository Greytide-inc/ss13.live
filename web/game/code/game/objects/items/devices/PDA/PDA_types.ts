// From code/game/objects/items/devices/PDA/PDA_types.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9298, "/obj/item/device/pda/clown", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/virus/clown"),
	ttone: "honk",
	name: "clown PDA",
	inserted_item: rt.typePath("/obj/item/toy/crayon/rainbow"),
	icon_state: "pda-clown",
	desc: "A portable microcomputer by Thinktronic Systems, LTD. The surface is coated with polytetrafluoroethylene and banana drippings.",
});

// /obj/item/device/pda/clown/proc/Crossed  (code/game/objects/items/devices/PDA/PDA_types.dm:11)  may sleep
rt.def("/obj/item/device/pda/clown/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let M: Value = null, cart: Value = null;
	f.vars = () => [AM, M, cart];
	if (!truthy((rt.istype(live(AM), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	if (!truthy((yield* g.callName(f, (M = live(AM)), "slip", [120, live(f.src), 1])))) return f.dot;
	if (!(truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0)) && !isEqual(rt.fv(f, "real_name", live(M)), rt.fv(f, "owner", live(f.src))))) return f.dot;
	if (!truthy((rt.istype(rt.fv(f, "cartridge", live(f.src)), T("/obj/item/weapon/cartridge/virus/clown")) ? 1 : 0))) return f.dot;
	if (!rt.lt(rt.gv(f, "charges", (cart = rt.fv(f, "cartridge", live(f.src)))), 5)) return f.dot;
	rt.incField(f, live(cart), "charges", 1, true);
	return f.dot;
}, true);

rt.type(9299, "/obj/item/device/pda/ai", "/obj/item/device/pda", {
	ttone: "data",
	fon: 0,
	detonatable: 0,
	icon_state: "NONE",
});

// /obj/item/device/pda/ai/proc/attack_self  (code/game/objects/items/devices/PDA/PDA_types.dm:29)
rt.def("/obj/item/device/pda/ai/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if ((rt.gt(rt.sv(f, "honkamt"), 0) && truthy(rt.op(f, "Prob", [], [60])))) {
		rt.incSrcVar(f, "honkamt", -1, true);
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/bikehorn.ogg"), 30, 1]);
	}
	return live(f.dot);
});
