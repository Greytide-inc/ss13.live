// Based on /tg/station's code/game/objects/items/weapons/implants/implant_gang.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7407, "/obj/item/weapon/implant/gang", "/obj/item/weapon/implant", {
	gang: null,
	activated: 0,
	name: "gang implant",
	desc: "Makes you a gangster or such.",
	origin_tech: "materials=2;biotech=4;programming=4;syndicate=3",
});

// implant_gang.dm:9
rt.def("/obj/item/weapon/implant/gang/proc/New", function* New(f: Frame, loc: Value, setgang: Value) {
	yield* parent_proc();
	this.gang = setgang;
	return f.dot;
}, true);

// implant_gang.dm:13
rt.def("/obj/item/weapon/implant/gang/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Criminal brainwash implant<BR>\n\t\t\t\t<b>Life:</b> A few seconds after injection.<BR>\n\t\t\t\t<b>Important Notes:</b> Illegal<BR>\n\t\t\t\t<HR>\n\t\t\t\t<b>Implant Details:</b><BR>\n\t\t\t\t<b>Function:</b> Contains a small pod of nanobots that change the host's brain to be loyal to a certain organization.<BR>\n\t\t\t\t<b>Special Features:</b> This device will also emit a small EMP pulse, destroying any other implants within the host's brain.<BR>\n\t\t\t\t<b>Integrity:</b> Implant's EMP function will destroy itself in the process.");
});

// implant_gang.dm:25
rt.def("/obj/item/weapon/implant/gang/proc/implant", function* implant(f: Frame) {
	let I: Value = null, success: Value = null;
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!(yield* parent_proc())) return f.dot;
	for (I of each(f.args[0].implants, T("/obj/item/weapon/implant"))) {
		if (I != this) {
			yield* qdel(I);
		}
	}
	if (!f.args[0].mind || f.args[0].stat == 2) {
		return 0;
	}
	if (rt.isIn(f, f.args[0].mind, GLOB.SSticker.mode.get_gangsters())) {
		if (yield* GLOB.SSticker.mode.remove_gangster(f.args[0].mind, 0, 1)) {
			success = 1;
		}
	} else {
		success = 1;
	}
	if (rt.istype(f.args[0], T("/mob/living/carbon/human"))) {
		if (!success) {
			f.args[0].visible_message(`<span class='warning'>${f.args[0]} seems to resist the implant!</span>`, "<span class='warning'>You feel the influence of your enemies try to invade your mind!</span>");
		}
	}
	yield* qdel(this);
	return 0;
}, true, { args: ["target", "user", "silent"] });

rt.type(7435, "/obj/item/weapon/implanter/gang", "/obj/item/weapon/implanter", {
	name: "implanter (gang)",
});

// implant_gang.dm:51
rt.def("/obj/item/weapon/implanter/gang/proc/New", function* New(f: Frame, loc: Value, gang: Value) {
	if (!gang) {
		yield* qdel(this);
		return f.dot;
	}
	this.imp = (yield* new_(T("/obj/item/weapon/implant/gang"), this, gang));
	yield* parent_proc();
	return f.dot;
}, true);
