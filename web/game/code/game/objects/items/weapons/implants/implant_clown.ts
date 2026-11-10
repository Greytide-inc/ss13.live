// Based on /tg/station's code/game/objects/items/weapons/implants/implant_clown.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(7402, "/obj/item/weapon/implant/sad_trombone", "/obj/item/weapon/implant", {
	activated: 0,
	name: "sad trombone implant",
});

// implant_clown.dm:6
rt.def("/obj/item/weapon/implant/sad_trombone/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Honk Co. Sad Trombone Implant<BR>\n\t\t\t\t<b>Life:</b> Activates upon death.<BR>\n\t\t\t\t");
});

// implant_clown.dm:13
rt.def("/obj/item/weapon/implant/sad_trombone/proc/trigger", function trigger(f: Frame, emote: Value, source: Value) {
	if (emote != "deathgasp") return f.dot;
	playsound(this.loc, rt.rsc("sound/misc/sadtrombone.ogg"), 50, 0);
	return f.dot;
});
