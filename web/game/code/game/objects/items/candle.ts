// From code/game/objects/items/candle.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9657, "/obj/item/candle", "/obj/item", {
	wax: 200,
	lit: 0,
	infinite: 0,
	start_lit: 0,
	item_state: "candle1",
	w_class: 1,
	light_color: "#FAA019",
	heat: 1000,
	name: "red candle",
	desc: "In Greek myth, Prometheus stole fire from the Gods and gave it to humankind. The jewelry he kept for himself.",
	icon: rt.rsc("icons/obj/candle.dmi"),
	icon_state: "candle1",
});

// /obj/item/candle/proc/New  (code/game/objects/items/candle.dm:18)  may sleep
rt.def("/obj/item/candle/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "start_lit"))) return f.dot;
	yield* g.callSrc(f, "light", ["show_message", 0], rt.Args.Named);
	return f.dot;
}, true);

// /obj/item/candle/proc/update_icon  (code/game/objects/items/candle.dm:25)
rt.def("/obj/item/candle/proc/update_icon", function update_icon(f: Frame) {
	let i: Value = null;
	let $0: any, $1: any;
	f.vars = () => [i, $0, $1];
	i = null;
	if (rt.gt(rt.sv(f, "wax"), 150)) {
		i = 1;
	} else {
		if (rt.gt(rt.sv(f, "wax"), 80)) {
			i = 2;
		} else {
			i = 3;
		}
	}
	$0 = live(i);
	if (truthy(rt.sv(f, "lit"))) {
		$1 = "_lit";
	} else {
		$1 = "";
	}
	rt.setSv(f, "icon_state", fmt("candle＀＀", [$0, $1]));
	return f.dot;
});

// /obj/item/candle/proc/attackby  (code/game/objects/items/candle.dm:34)  may sleep
rt.def("/obj/item/candle/proc/attackby", function* attackby(f: Frame) {
	let msg: Value = null;
	f.vars = () => [msg];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((msg = (yield* g.callName(f, live(f.args[0]), "ignition_effect", [live(f.src), live(f.args[1])]))))) return f.dot;
	yield* g.srcCall(f, "light", live(msg));
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/candle/proc/fire_act  (code/game/objects/items/candle.dm:40)  may sleep
rt.def("/obj/item/candle/proc/fire_act", function* fire_act(f: Frame) {
	if (!truthy(rt.fv(f, "lit", live(f.src)))) {
		yield* g.srcCall(f, "light");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["exposed_temperature", "exposed_volume"] });

// /obj/item/candle/proc/light  (code/game/objects/items/candle.dm:45)
rt.def("/obj/item/candle/proc/light", function light(f: Frame, show_message: Value) {
	if (truthy(rt.fv(f, "lit", live(f.src)))) return f.dot;
	rt.setFv(f, "lit", live(f.src), 1);
	if (truthy(live(show_message))) {
		rt.callName(f, live(f.usr), "visible_message", [live(show_message)]);
	}
	rt.callSrc(f, "set_light", [2]);
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/candle/proc/process  (code/game/objects/items/candle.dm:56)  may sleep
rt.def("/obj/item/candle/proc/process", function* process(f: Frame) {
	if (!truthy(rt.sv(f, "lit"))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "infinite"))) {
		rt.incSrcVar(f, "wax", -1, true);
	}
	if (!truthy(rt.sv(f, "wax"))) {
		yield* g.new_(f, T("/obj/item/trash/candle"), [rt.fv(f, "loc", live(f.src))]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "open_flame");
	return f.dot;
}, true, { waitfor: false });

// /obj/item/candle/proc/attack_self  (code/game/objects/items/candle.dm:68)
rt.def("/obj/item/candle/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!truthy(rt.sv(f, "lit"))) return f.dot;
	rt.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ snuffs ＀.</span>", [live(user), live(f.src)])]);
	rt.setSv(f, "lit", 0);
	rt.callSrc(f, "update_icon", []);
	rt.callSrc(f, "set_light", [0]);
	return f.dot;
});

// /obj/item/candle/proc/is_hot  (code/game/objects/items/candle.dm:75)
rt.def("/obj/item/candle/proc/is_hot", function is_hot(f: Frame) {
	return multiply(rt.sv(f, "lit"), rt.sv(f, "heat"));
});
