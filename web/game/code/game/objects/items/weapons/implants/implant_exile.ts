// Based on /tg/station's code/game/objects/items/weapons/implants/implant_exile.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(7403, "/obj/item/weapon/implant/exile", "/obj/item/weapon/implant", {
	activated: 0,
	name: "exile implant",
	desc: "Prevents you from returning from away missions",
	origin_tech: "materials=2;biotech=3;magnets=2;bluespace=3",
});

// implant_exile.dm:11
rt.def("/obj/item/weapon/implant/exile/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Nanotrasen Employee Exile Implant<BR>\n\t\t\t\t<b>Implant Details:</b> The onboard gateway system has been modified to reject entry by individuals containing this implant<BR>");
});
