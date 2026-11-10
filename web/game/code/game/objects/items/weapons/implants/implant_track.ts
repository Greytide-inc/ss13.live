// Based on /tg/station's code/game/objects/items/weapons/implants/implant_track.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(7415, "/obj/item/weapon/implant/tracking", "/obj/item/weapon/implant", {
	activated: 0,
	name: "tracking implant",
	desc: "Track with this.",
	origin_tech: "materials=2;magnets=2;programming=2;biotech=2",
});

// implant_track.dm:8
rt.def("/obj/item/weapon/implant/tracking/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	GLOB.tracked_implants += this;
	return f.dot;
}, true);

// implant_track.dm:12
rt.def("/obj/item/weapon/implant/tracking/proc/Destroy", function* Destroy(f: Frame) {
	f.dot = (yield* parent_proc());
	GLOB.tracked_implants -= this;
	return f.dot;
}, true);

// implant_track.dm:22
rt.def("/obj/item/weapon/implant/tracking/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Tracking Beacon<BR>\n\t\t\t\t<b>Life:</b> 10 minutes after death of host<BR>\n\t\t\t\t<b>Important Notes:</b> None<BR>\n\t\t\t\t<HR>\n\t\t\t\t<b>Implant Details:</b> <BR>\n\t\t\t\t<b>Function:</b> Continuously transmits low power signal. Useful for tracking.<BR>\n\t\t\t\t<b>Special Features:</b><BR>\n\t\t\t\t<i>Neuro-Safe</i>- Specialized shell absorbs excess voltages self-destructing the chip if\n\t\t\t\ta malfunction occurs thereby securing safety of subject. The implant will melt and\n\t\t\t\tdisintegrate into bio-safe elements.<BR>\n\t\t\t\t<b>Integrity:</b> Gradient creates slight risk of being overcharged and frying the\n\t\t\t\tcircuitry. As a result neurotoxins can cause massive damage.");
});
