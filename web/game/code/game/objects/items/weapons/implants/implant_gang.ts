// From code/game/objects/items/weapons/implants/implant_gang.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7407, "/obj/item/weapon/implant/gang", "/obj/item/weapon/implant", {
	gang: null,
	activated: 0,
	name: "gang implant",
	desc: "Makes you a gangster or such.",
	origin_tech: "materials=2;biotech=4;programming=4;syndicate=3",
});

// /obj/item/weapon/implant/gang/proc/New  (code/game/objects/items/weapons/implants/implant_gang.dm:9)  may sleep
rt.def("/obj/item/weapon/implant/gang/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "gang", live(f.args[1]));
	return f.dot;
}, true, { args: ["loc", "setgang"] });

// /obj/item/weapon/implant/gang/proc/get_data  (code/game/objects/items/weapons/implants/implant_gang.dm:13)
rt.def("/obj/item/weapon/implant/gang/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Criminal brainwash implant<BR>\n\t\t\t\t<b>Life:</b> A few seconds after injection.<BR>\n\t\t\t\t<b>Important Notes:</b> Illegal<BR>\n\t\t\t\t<HR>\n\t\t\t\t<b>Implant Details:</b><BR>\n\t\t\t\t<b>Function:</b> Contains a small pod of nanobots that change the host's brain to be loyal to a certain organization.<BR>\n\t\t\t\t<b>Special Features:</b> This device will also emit a small EMP pulse, destroying any other implants within the host's brain.<BR>\n\t\t\t\t<b>Integrity:</b> Implant's EMP function will destroy itself in the process.");
});

// /obj/item/weapon/implant/gang/proc/implant  (code/game/objects/items/weapons/implants/implant_gang.dm:25)  may sleep
rt.def("/obj/item/weapon/implant/gang/proc/implant", function* implant(f: Frame) {
	let I: Value = null, success: Value = null;
	let $e: any;
	f.vars = () => [I, success, $e];
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	I = null;
	rt.forList(f, 0, rt.fv(f, "implants", live(f.args[0])), T("/obj/item/weapon/implant"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!isEqual(live(I), live(f.src))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		}
	}
	rt.endFor(f, 0);
	if ((!truthy(rt.fv(f, "mind", live(f.args[0]))) || isEqual(rt.fv(f, "stat", live(f.args[0])), 2))) {
		return 0;
	}
	success = null;
	if (truthy((rt.isIn(f, rt.fv(f, "mind", live(f.args[0])), (yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "get_gangsters", []))) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_gangster", [rt.fv(f, "mind", live(f.args[0])), 0, 1])))) {
			success = 1;
		}
	} else {
		success = 1;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (!truthy(live(success))) {
			yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀ seems to resist the implant!</span>", [live(f.args[0])]), "<span class='warning'>You feel the influence of your enemies try to invade your mind!</span>"]);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return 0;
}, true, { args: ["target", "user", "silent"] });

rt.type(7435, "/obj/item/weapon/implanter/gang", "/obj/item/weapon/implanter", {
	name: "implanter (gang)",
});

// /obj/item/weapon/implanter/gang/proc/New  (code/game/objects/items/weapons/implants/implant_gang.dm:51)  may sleep
rt.def("/obj/item/weapon/implanter/gang/proc/New", function* New(f: Frame) {
	if (!truthy(live(f.args[1]))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	rt.setSv(f, "imp", (yield* g.new_(f, T("/obj/item/weapon/implant/gang"), [live(f.src), live(f.args[1])])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["loc", "gang"] });
