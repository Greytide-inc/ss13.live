// Based on /tg/station's code/game/objects/items/weapons/implants/implant_freedom.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7406, "/obj/item/weapon/implant/freedom", "/obj/item/weapon/implant", {
	uses: 4,
	name: "freedom implant",
	desc: "Use this to escape from those evil Red Shirts.",
	icon_state: "freedom",
	item_color: "r",
	origin_tech: "combat=5;magnets=3;biotech=4;syndicate=2",
});

// implant_freedom.dm:11
rt.def("/obj/item/weapon/implant/freedom/proc/activate", function* activate(f: Frame) {
	let C_imp_in: Value = null;
	this.uses--;
	to_chat(this.imp_in, "You feel a faint click.");
	if (rt.istype(this.imp_in, T("/mob/living/carbon"))) {
		yield* (C_imp_in = this.imp_in).uncuff();
	}
	if (this.uses) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// implant_freedom.dm:21
rt.def("/obj/item/weapon/implant/freedom/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	return (dat = "\n<b>Implant Specifications:</b><BR>\n<b>Name:</b> Freedom Beacon<BR>\n<b>Life:</b> optimum 5 uses<BR>\n<b>Important Notes:</b> <font color='red'>Illegal</font><BR>\n<HR>\n<b>Implant Details:</b> <BR>\n<b>Function:</b> Transmits a specialized cluster of signals to override handcuff locking\nmechanisms<BR>\n<b>Special Features:</b><BR>\n<i>Neuro-Scan</i>- Analyzes certain shadow signals in the nervous system<BR>\n<HR>\nNo Implant Specifics");
});
