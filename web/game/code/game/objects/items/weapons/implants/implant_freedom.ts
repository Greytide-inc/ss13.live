// From code/game/objects/items/weapons/implants/implant_freedom.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7406, "/obj/item/weapon/implant/freedom", "/obj/item/weapon/implant", {
	uses: 4,
	name: "freedom implant",
	desc: "Use this to escape from those evil Red Shirts.",
	icon_state: "freedom",
	item_color: "r",
	origin_tech: "combat=5;magnets=3;biotech=4;syndicate=2",
});

// /obj/item/weapon/implant/freedom/proc/activate  (code/game/objects/items/weapons/implants/implant_freedom.dm:11)  may sleep
rt.def("/obj/item/weapon/implant/freedom/proc/activate", function* activate(f: Frame) {
	let C_imp_in: Value = null;
	f.vars = () => [C_imp_in];
	rt.incSrcVar(f, "uses", -1, true);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "imp_in"), "You feel a faint click."]);
	if (truthy((rt.istype(rt.sv(f, "imp_in"), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, (C_imp_in = rt.sv(f, "imp_in")), "uncuff", []);
	}
	if (truthy(rt.sv(f, "uses"))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/implant/freedom/proc/get_data  (code/game/objects/items/weapons/implants/implant_freedom.dm:21)
rt.def("/obj/item/weapon/implant/freedom/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	return (dat = "\n<b>Implant Specifications:</b><BR>\n<b>Name:</b> Freedom Beacon<BR>\n<b>Life:</b> optimum 5 uses<BR>\n<b>Important Notes:</b> <font color='red'>Illegal</font><BR>\n<HR>\n<b>Implant Details:</b> <BR>\n<b>Function:</b> Transmits a specialized cluster of signals to override handcuff locking\nmechanisms<BR>\n<b>Special Features:</b><BR>\n<i>Neuro-Scan</i>- Analyzes certain shadow signals in the nervous system<BR>\n<HR>\nNo Implant Specifics");
});
