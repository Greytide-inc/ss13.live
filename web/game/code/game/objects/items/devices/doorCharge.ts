// From code/game/objects/items/devices/doorCharge.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9229, "/obj/item/device/doorCharge", "/obj/item/device", {
	throw_range: 4,
	throw_speed: 1,
	flags: 4,
	name: "airlock charge",
	desc: null,
	item_state: "electronic",
	icon_state: "doorCharge",
	w_class: 2,
	force: 3,
	attack_verb: null,
	materials: null,
	origin_tech: "syndicate=1;combat=3;engineering=3",
});

// /obj/item/device/doorCharge/proc/<init>  (code/game/objects/items/devices/doorCharge.dm:12)
rt.def("/obj/item/device/doorCharge/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("blown up", "exploded", "detonated"));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 30]));
	return f.dot;
});

// /obj/item/device/doorCharge/proc/ex_act  (code/game/objects/items/devices/doorCharge.dm:16)  may sleep
rt.def("/obj/item/device/doorCharge/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	let $0: any;
	f.vars = () => [severity, target, $0];
	$0 = live(severity);
	if ($0 === 1) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ detonates!</span>", [live(f.src)]));
		yield* g.call(f, P("/proc/explosion"), null, [null, rt.fv(f, "loc", live(f.src)), null, 0, null, 2, null, 1, "flame_range", 4], rt.Args.Named);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.srcCall(f, "ex_act", 1);
		}
	} else if ($0 === 3) {
		if (!truthy(rt.op(f, "Prob", [], [25]))) return f.dot;
		yield* g.srcCall(f, "ex_act", 1);
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/item/device/doorCharge/proc/Destroy  (code/game/objects/items/devices/doorCharge.dm:29)  may sleep
rt.def("/obj/item/device/doorCharge/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/machinery/door/airlock")) ? 1 : 0))) {
		if (isEqual(rt.gv(f, "charge", (A = rt.sv(f, "loc"))), live(f.src))) {
			rt.setFv(f, "charge", live(A), null);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/doorCharge/proc/examine  (code/game/objects/items/devices/doorCharge.dm:36)
rt.def("/obj/item/device/doorCharge/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.isIn(f, rt.fv(f, "mind", live(f.args[0])), rt.gv(f, "traitors", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "A small explosive device that can be used to sabotage airlocks to cause an explosion upon opening. To apply, remove the airlock's maintenance panel and place it within."]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "A small, suspicious object that feels lukewarm when held."]);
	}
	return f.dot;
}, false, { args: ["user"] });
