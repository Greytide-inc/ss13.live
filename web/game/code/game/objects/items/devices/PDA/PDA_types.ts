// Based on /tg/station's code/game/objects/items/devices/PDA/PDA_types.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9298, "/obj/item/device/pda/clown", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/virus/clown"),
	ttone: "honk",
	name: "clown PDA",
	inserted_item: rt.typePath("/obj/item/toy/crayon/rainbow"),
	icon_state: "pda-clown",
	desc: "A portable microcomputer by Thinktronic Systems, LTD. The surface is coated with polytetrafluoroethylene and banana drippings.",
});

// PDA_types.dm:11
rt.def("/obj/item/device/pda/clown/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let M: Value = null, cart: Value = null;
	if (!rt.istype(AM, T("/mob/living/carbon"))) return f.dot;
	if (!(yield* (M = AM).slip(120, this, NO_SLIP_WHEN_WALKING))) return f.dot;
	if (!(rt.istype(M, T("/mob/living/carbon/human")) && M.real_name != this.owner)) return f.dot;
	if (!rt.istype(this.cartridge, T("/obj/item/weapon/cartridge/virus/clown"))) return f.dot;
	if (!((cart = this.cartridge).charges < 5)) return f.dot;
	cart.charges++;
	return f.dot;
}, true);

rt.type(9299, "/obj/item/device/pda/ai", "/obj/item/device/pda", {
	ttone: "data",
	fon: 0,
	detonatable: 0,
	icon_state: "NONE",
});

// PDA_types.dm:29
rt.def("/obj/item/device/pda/ai/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (this.honkamt > 0 && prob(60)) {
		this.honkamt--;
		playsound(this.loc, rt.rsc("sound/items/bikehorn.ogg"), 30, 1);
	}
	return f.dot;
});
