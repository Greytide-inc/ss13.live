// From code/game/objects/items/weapons/implants/implant_loyality.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7409, "/obj/item/weapon/implant/mindshield", "/obj/item/weapon/implant", {
	activated: 0,
	name: "mindshield implant",
	desc: "Protects against brainwashing.",
	origin_tech: "materials=2;biotech=4;programming=4",
});

// /obj/item/weapon/implant/mindshield/proc/get_data  (code/game/objects/items/weapons/implants/implant_loyality.dm:8)
rt.def("/obj/item/weapon/implant/mindshield/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Nanotrasen Employee Management Implant<BR>\n\t\t\t\t<b>Life:</b> Ten years.<BR>\n\t\t\t\t<b>Important Notes:</b> Personnel injected with this device are much more resistant to brainwashing.<BR>\n\t\t\t\t<HR>\n\t\t\t\t<b>Implant Details:</b><BR>\n\t\t\t\t<b>Function:</b> Contains a small pod of nanobots that protects the host's mental functions from manipulation.<BR>\n\t\t\t\t<b>Special Features:</b> Will prevent and cure most forms of brainwashing.<BR>\n\t\t\t\t<b>Integrity:</b> Implant will last so long as the nanobots are inside the bloodstream.");
});

// /obj/item/weapon/implant/mindshield/proc/implant  (code/game/objects/items/weapons/implants/implant_loyality.dm:21)  may sleep
rt.def("/obj/item/weapon/implant/mindshield/proc/implant", function* implant(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		if (truthy((rt.isIn(f, rt.fv(f, "mind", live(f.args[0])), rt.bitOr(rt.gv(f, "head_revolutionaries", rt.fv(f, "mode", rt.gl("SSticker"))), (yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "get_gang_bosses", [])))) ? 1 : 0))) {
			if (!truthy(live(f.args[2]))) {
				yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀ seems to resist the implant!</span>", [live(f.args[0])]), "<span class='warning'>You feel something interfering with your mental conditioning, but you resist it!</span>"]);
			}
			yield* g.srcCall(f, "removed", live(f.args[0]), 1);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return 0;
		}
		if (truthy((rt.isIn(f, rt.fv(f, "mind", live(f.args[0])), (yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "get_gangsters", []))) ? 1 : 0))) {
			yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_gangster", [rt.fv(f, "mind", live(f.args[0]))]);
			if (!truthy(live(f.args[2]))) {
				yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀ was destroyed in the process!</span>", [live(f.src)]), "<span class='notice'>You feel a sense of peace and security. You are now protected from brainwashing.</span>"]);
			}
			yield* g.srcCall(f, "removed", live(f.args[0]), 1);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return 0;
		}
		if (truthy((rt.isIn(f, rt.fv(f, "mind", live(f.args[0])), rt.gv(f, "revolutionaries", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
			yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_revolutionary", [rt.fv(f, "mind", live(f.args[0]))]);
		}
		if (!truthy(live(f.args[2]))) {
			if (truthy((rt.isIn(f, rt.fv(f, "mind", live(f.args[0])), rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You feel something interfering with your mental conditioning, but you resist it!</span>"]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You feel a sense of peace and security. You are now protected from brainwashing.</span>"]);
			}
		}
		return 1;
	}
	return 0;
}, true, { args: ["target", "user", "silent"] });

// /obj/item/weapon/implant/mindshield/proc/removed  (code/game/objects/items/weapons/implants/implant_loyality.dm:46)  may sleep
rt.def("/obj/item/weapon/implant/mindshield/proc/removed", function* removed(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		if ((!isEqual(rt.fv(f, "stat", live(f.args[0])), 2) && !truthy(live(f.args[1])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='boldnotice'>Your mind suddenly feels terribly vulnerable. You are no longer safe from brainwashing.</span>"]);
		}
		return 1;
	}
	return 0;
}, true, { args: ["target", "silent", "special"] });
