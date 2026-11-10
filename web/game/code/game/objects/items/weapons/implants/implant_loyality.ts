// Based on /tg/station's code/game/objects/items/weapons/implants/implant_loyality.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(7409, "/obj/item/weapon/implant/mindshield", "/obj/item/weapon/implant", {
	activated: 0,
	name: "mindshield implant",
	desc: "Protects against brainwashing.",
	origin_tech: "materials=2;biotech=4;programming=4",
});

// implant_loyality.dm:8
rt.def("/obj/item/weapon/implant/mindshield/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Nanotrasen Employee Management Implant<BR>\n\t\t\t\t<b>Life:</b> Ten years.<BR>\n\t\t\t\t<b>Important Notes:</b> Personnel injected with this device are much more resistant to brainwashing.<BR>\n\t\t\t\t<HR>\n\t\t\t\t<b>Implant Details:</b><BR>\n\t\t\t\t<b>Function:</b> Contains a small pod of nanobots that protects the host's mental functions from manipulation.<BR>\n\t\t\t\t<b>Special Features:</b> Will prevent and cure most forms of brainwashing.<BR>\n\t\t\t\t<b>Integrity:</b> Implant will last so long as the nanobots are inside the bloodstream.");
});

// implant_loyality.dm:21
rt.def("/obj/item/weapon/implant/mindshield/proc/implant", function* implant(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (yield* parent_proc()) {
		if (rt.isIn(f, f.args[0].mind, rt.bitOr(GLOB.SSticker.mode.head_revolutionaries, GLOB.SSticker.mode.get_gang_bosses()))) {
			if (!f.args[2]) {
				f.args[0].visible_message(`<span class='warning'>${f.args[0]} seems to resist the implant!</span>`, "<span class='warning'>You feel something interfering with your mental conditioning, but you resist it!</span>");
			}
			yield* this.removed(f.args[0], 1);
			yield* qdel(this);
			return 0;
		}
		if (rt.isIn(f, f.args[0].mind, GLOB.SSticker.mode.get_gangsters())) {
			yield* GLOB.SSticker.mode.remove_gangster(f.args[0].mind);
			if (!f.args[2]) {
				f.args[0].visible_message(`<span class='warning'>${this} was destroyed in the process!</span>`, "<span class='notice'>You feel a sense of peace and security. You are now protected from brainwashing.</span>");
			}
			yield* this.removed(f.args[0], 1);
			yield* qdel(this);
			return 0;
		}
		if (rt.isIn(f, f.args[0].mind, GLOB.SSticker.mode.revolutionaries)) {
			yield* GLOB.SSticker.mode.remove_revolutionary(f.args[0].mind);
		}
		if (!f.args[2]) {
			if (rt.isIn(f, f.args[0].mind, GLOB.SSticker.mode.cult)) {
				to_chat(f.args[0], "<span class='warning'>You feel something interfering with your mental conditioning, but you resist it!</span>");
			} else {
				to_chat(f.args[0], "<span class='notice'>You feel a sense of peace and security. You are now protected from brainwashing.</span>");
			}
		}
		return 1;
	}
	return 0;
}, true, { args: ["target", "user", "silent"] });

// implant_loyality.dm:46
rt.def("/obj/item/weapon/implant/mindshield/proc/removed", function* removed(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (yield* parent_proc()) {
		if (f.args[0].stat != 2 && !f.args[1]) {
			to_chat(f.args[0], "<span class='boldnotice'>Your mind suddenly feels terribly vulnerable. You are no longer safe from brainwashing.</span>");
		}
		return 1;
	}
	return 0;
}, true, { args: ["target", "silent", "special"] });
