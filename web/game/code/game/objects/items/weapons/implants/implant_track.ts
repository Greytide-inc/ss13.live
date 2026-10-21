// From code/game/objects/items/weapons/implants/implant_track.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7415, "/obj/item/weapon/implant/tracking", "/obj/item/weapon/implant", {
	activated: 0,
	name: "tracking implant",
	desc: "Track with this.",
	origin_tech: "materials=2;magnets=2;programming=2;biotech=2",
});

// /obj/item/weapon/implant/tracking/proc/New  (code/game/objects/items/weapons/implants/implant_track.dm:8)  may sleep
rt.def("/obj/item/weapon/implant/tracking/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("tracked_implants", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/weapon/implant/tracking/proc/Destroy  (code/game/objects/items/weapons/implants/implant_track.dm:12)  may sleep
rt.def("/obj/item/weapon/implant/tracking/proc/Destroy", function* Destroy(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	(rt.modGl("tracked_implants", live(f.src), subtract));
	return f.dot;
}, true);

// /obj/item/weapon/implant/tracking/proc/get_data  (code/game/objects/items/weapons/implants/implant_track.dm:22)
rt.def("/obj/item/weapon/implant/tracking/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Tracking Beacon<BR>\n\t\t\t\t<b>Life:</b> 10 minutes after death of host<BR>\n\t\t\t\t<b>Important Notes:</b> None<BR>\n\t\t\t\t<HR>\n\t\t\t\t<b>Implant Details:</b> <BR>\n\t\t\t\t<b>Function:</b> Continuously transmits low power signal. Useful for tracking.<BR>\n\t\t\t\t<b>Special Features:</b><BR>\n\t\t\t\t<i>Neuro-Safe</i>- Specialized shell absorbs excess voltages self-destructing the chip if\n\t\t\t\ta malfunction occurs thereby securing safety of subject. The implant will melt and\n\t\t\t\tdisintegrate into bio-safe elements.<BR>\n\t\t\t\t<b>Integrity:</b> Gradient creates slight risk of being overcharged and frying the\n\t\t\t\tcircuitry. As a result neurotoxins can cause massive damage.");
});
