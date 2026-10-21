// From code/modules/hydroponics/growninedible.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7492, "/obj/item/weapon/grown", "/obj/item/weapon", {
	seed: null,
	name: "grown_weapon",
	icon: rt.rsc("icons/obj/hydroponics/harvest.dmi"),
	resistance_flags: 4,
});

// /obj/item/weapon/grown/proc/New  (code/modules/hydroponics/growninedible.dm:12)  may sleep
rt.def("/obj/item/weapon/grown/proc/New", function* New(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = null;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "create_reagents", 50);
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "seed", (yield* g.callName(f, live(f.args[1]), "Copy", [])));
	} else {
		if (truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.sv(f, "seed")])))) {
			rt.setSv(f, "seed", (yield* g.new_(f, rt.sv(f, "seed"), [])));
			yield* g.callName(f, rt.sv(f, "seed"), "adjust_potency", [subtract(50, rt.fv(f, "potency", rt.sv(f, "seed")))]);
		}
	}
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	if (!truthy(rt.sv(f, "seed"))) return f.dot;
	_T = null;
	rt.forList(f, 0, rt.fv(f, "genes", rt.sv(f, "seed")), T("/datum/plant_gene/trait"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.callName(f, live(_T), "on_new", [live(f.src), live(f.args[0])]);
	}
	rt.endFor(f, 0);
	if (truthy(rt.op(f, "IsType", [], [live(f.src), rt.fv(f, "product", rt.sv(f, "seed"))]))) {
		yield* g.callName(f, rt.sv(f, "seed"), "prepare_result", [live(f.src)]);
	}
	(rt.modSrcVar(f, "transform", (yield* g.call(f, P("/proc/TransformUsingVariable"), null, [rt.fv(f, "potency", rt.sv(f, "seed")), 100, 0.5])), multiply));
	yield* g.srcCall(f, "add_juice");
	return f.dot;
}, true, { args: ["newloc", "new_seed"] });

// /obj/item/weapon/grown/proc/attackby  (code/modules/hydroponics/growninedible.dm:36)  may sleep
rt.def("/obj/item/weapon/grown/proc/attackby", function* attackby(f: Frame) {
	let msg: Value = null;
	f.vars = () => [msg];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/device/plant_analyzer")) ? 1 : 0))) return f.dot;
	msg = fmt("<span class='info'>*---------*\n This is ＇<span class='name'>！</span>\n", [live(f.src)]);
	if (truthy(rt.sv(f, "seed"))) {
		msg = rt.modify(live(msg), (yield* g.callName(f, rt.sv(f, "seed"), "get_analyzer_text", [])), add);
	}
	msg = rt.modify(live(msg), "</span>", add);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), live(msg)]);
	return live(f.dot);
}, true, { args: ["O", "user", "params"] });

// /obj/item/weapon/grown/proc/Crossed  (code/modules/hydroponics/growninedible.dm:53)  may sleep
rt.def("/obj/item/weapon/grown/proc/Crossed", function* Crossed(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	if (truthy(rt.sv(f, "seed"))) {
		_T = null;
		rt.forList(f, 0, rt.fv(f, "genes", rt.sv(f, "seed")), T("/datum/plant_gene/trait"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			yield* g.callName(f, live(_T), "on_cross", [live(f.src), live(f.args[0])]);
		}
		rt.endFor(f, 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["AM"] });

// /obj/item/weapon/grown/proc/throw_impact  (code/modules/hydroponics/growninedible.dm:58)  may sleep
rt.def("/obj/item/weapon/grown/proc/throw_impact", function* throw_impact(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (!truthy(rt.sv(f, "seed"))) return f.dot;
	_T = null;
	rt.forList(f, 0, rt.fv(f, "genes", rt.sv(f, "seed")), T("/datum/plant_gene/trait"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.callName(f, live(_T), "on_throw_impact", [live(f.src), live(f.args[0])]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });
