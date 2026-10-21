// From code/game/objects/items/weapons/implants/implant_krav_maga.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7408, "/obj/item/weapon/implant/krav_maga", "/obj/item/weapon/implant", {
	style: null,
	activated: 1,
	name: "krav maga implant",
	desc: "Teaches you the arts of Krav Maga in 5 short instructional videos beamed directly into your eyeballs.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "scroll2",
	origin_tech: "materials=2;biotech=4;combat=5;syndicate=4",
});

// /obj/item/weapon/implant/krav_maga/proc/<init>  (code/game/objects/items/weapons/implants/implant_krav_maga.dm:8)  may sleep
rt.def("/obj/item/weapon/implant/krav_maga/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "style", (yield* g.new_(f, T("/datum/martial_art/krav_maga"), [])));
	return f.dot;
}, true);

// /obj/item/weapon/implant/krav_maga/proc/get_data  (code/game/objects/items/weapons/implants/implant_krav_maga.dm:11)
rt.def("/obj/item/weapon/implant/krav_maga/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Krav Maga Implant<BR>\n\t\t\t\t<b>Life:</b> 4 hours after death of host<BR>\n\t\t\t\t<b>Implant Details:</b> <BR>\n\t\t\t\t<b>Function:</b> Teaches even the clumsiest host the arts of Krav Maga.");
});

// /obj/item/weapon/implant/krav_maga/proc/activate  (code/game/objects/items/weapons/implants/implant_krav_maga.dm:19)  may sleep
rt.def("/obj/item/weapon/implant/krav_maga/proc/activate", function* activate(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy((rt.istype((H = rt.sv(f, "imp_in")), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "mind", live(H)))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(rt.gv(f, "martial_art", rt.fv(f, "mind", live(H))), T("/datum/martial_art/krav_maga")) ? 1 : 0))) {
		yield* g.callName(f, rt.sv(f, "style"), "remove", [live(H)]);
	} else {
		yield* g.callName(f, rt.sv(f, "style"), "teach", [live(H), 1]);
	}
	return f.dot;
}, true);
