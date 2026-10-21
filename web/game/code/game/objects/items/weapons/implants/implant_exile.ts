// From code/game/objects/items/weapons/implants/implant_exile.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7403, "/obj/item/weapon/implant/exile", "/obj/item/weapon/implant", {
	activated: 0,
	name: "exile implant",
	desc: "Prevents you from returning from away missions",
	origin_tech: "materials=2;biotech=3;magnets=2;bluespace=3",
});

// /obj/item/weapon/implant/exile/proc/get_data  (code/game/objects/items/weapons/implants/implant_exile.dm:11)
rt.def("/obj/item/weapon/implant/exile/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Nanotrasen Employee Exile Implant<BR>\n\t\t\t\t<b>Implant Details:</b> The onboard gateway system has been modified to reject entry by individuals containing this implant<BR>");
});
