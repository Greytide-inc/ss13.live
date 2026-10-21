// From code/game/objects/items/weapons/implants/implant_clown.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7402, "/obj/item/weapon/implant/sad_trombone", "/obj/item/weapon/implant", {
	activated: 0,
	name: "sad trombone implant",
});

// /obj/item/weapon/implant/sad_trombone/proc/get_data  (code/game/objects/items/weapons/implants/implant_clown.dm:6)
rt.def("/obj/item/weapon/implant/sad_trombone/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Honk Co. Sad Trombone Implant<BR>\n\t\t\t\t<b>Life:</b> Activates upon death.<BR>\n\t\t\t\t");
});

// /obj/item/weapon/implant/sad_trombone/proc/trigger  (code/game/objects/items/weapons/implants/implant_clown.dm:13)
rt.def("/obj/item/weapon/implant/sad_trombone/proc/trigger", function trigger(f: Frame, emote: Value, source: Value) {
	if (!isEqual(live(emote), "deathgasp")) return f.dot;
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/misc/sadtrombone.ogg"), 50, 0]);
	return f.dot;
});
