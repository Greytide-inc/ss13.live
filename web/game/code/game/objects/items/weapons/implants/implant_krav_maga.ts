// Based on /tg/station's code/game/objects/items/weapons/implants/implant_krav_maga.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7408, "/obj/item/weapon/implant/krav_maga", "/obj/item/weapon/implant", {
	style: null,
	activated: 1,
	name: "krav maga implant",
	desc: "Teaches you the arts of Krav Maga in 5 short instructional videos beamed directly into your eyeballs.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "scroll2",
	origin_tech: "materials=2;biotech=4;combat=5;syndicate=4",
});

// implant_krav_maga.dm:8
rt.def("/obj/item/weapon/implant/krav_maga/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.style = (yield* new_(T("/datum/martial_art/krav_maga")));
	return f.dot;
}, true);

// implant_krav_maga.dm:11
rt.def("/obj/item/weapon/implant/krav_maga/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Krav Maga Implant<BR>\n\t\t\t\t<b>Life:</b> 4 hours after death of host<BR>\n\t\t\t\t<b>Implant Details:</b> <BR>\n\t\t\t\t<b>Function:</b> Teaches even the clumsiest host the arts of Krav Maga.");
});

// implant_krav_maga.dm:19
rt.def("/obj/item/weapon/implant/krav_maga/proc/activate", function* activate(f: Frame) {
	let H: Value = null;
	if (!rt.istype((H = this.imp_in), T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (!H.mind) {
		return f.dot;
	}
	if (rt.istype(H.mind.martial_art, T("/datum/martial_art/krav_maga"))) {
		yield* this.style.remove(H);
	} else {
		yield* this.style.teach(H, 1);
	}
	return f.dot;
}, true);
