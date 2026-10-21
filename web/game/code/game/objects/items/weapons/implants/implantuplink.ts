// From code/game/objects/items/weapons/implants/implantuplink.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7416, "/obj/item/weapon/implant/uplink", "/obj/item/weapon/implant", {
	starting_tc: 0,
	name: "uplink implant",
	desc: "Sneeki breeki.",
	icon: rt.rsc("icons/obj/radio.dmi"),
	icon_state: "radio",
	origin_tech: "materials=4;magnets=4;programming=4;biotech=4;syndicate=5;bluespace=5",
});

// /obj/item/weapon/implant/uplink/proc/New  (code/game/objects/items/weapons/implants/implantuplink.dm:10)  may sleep
rt.def("/obj/item/weapon/implant/uplink/proc/New", function* New(f: Frame) {
	rt.setSv(f, "hidden_uplink", (yield* g.new_(f, T("/obj/item/device/uplink"), [live(f.src)])));
	rt.setFv(f, "telecrystals", rt.sv(f, "hidden_uplink"), rt.sv(f, "starting_tc"));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/weapon/implant/uplink/proc/implant  (code/game/objects/items/weapons/implants/implantuplink.dm:15)  may sleep
rt.def("/obj/item/weapon/implant/uplink/proc/implant", function* implant(f: Frame) {
	let X: Value = null, imp_e: Value = null;
	let $e: any;
	f.vars = () => [X, imp_e, $e];
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	X = null;
	rt.forList(f, 0, rt.fv(f, "implants", live(f.args[0])));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (truthy(rt.op(f, "IsType", [], [live(X), rt.sv(f, "type")]))) {
			rt.modField(f, rt.gv(f, "hidden_uplink", (imp_e = live(X))), "telecrystals", rt.fv(f, "telecrystals", rt.sv(f, "hidden_uplink")), add);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return 1;
		}
	}
	rt.endFor(f, 0);
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		rt.setFv(f, "owner", rt.sv(f, "hidden_uplink"), fmt("＀", [rt.fv(f, "key", live(f.args[1]))]));
		return 1;
	}
	return 0;
}, true, { args: ["target", "user", "silent"] });

// /obj/item/weapon/implant/uplink/proc/activate  (code/game/objects/items/weapons/implants/implantuplink.dm:29)  may sleep
rt.def("/obj/item/weapon/implant/uplink/proc/activate", function* activate(f: Frame) {
	if (!truthy(rt.sv(f, "hidden_uplink"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "hidden_uplink"), "interact", [live(f.usr)]);
	return f.dot;
}, true);
