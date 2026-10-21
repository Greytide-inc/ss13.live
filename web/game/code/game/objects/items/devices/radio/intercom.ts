// From code/game/objects/items/devices/radio/intercom.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9205, "/obj/item/device/radio/intercom", "/obj/item/device/radio", {
	number: 0,
	anyai: 1,
	ai: null,
	last_tick: null,
	unfastened: 0,
	anchored: 1,
	name: "station intercom",
	desc: "Talk through this.",
	icon_state: "intercom",
	w_class: 4,
	canhear_range: 2,
	dog_fashion: null,
});

// /obj/item/device/radio/intercom/proc/<init>  (code/game/objects/items/devices/radio/intercom.dm:10)
rt.def("/obj/item/device/radio/intercom/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ai", rt.list());
	return f.dot;
});

// /obj/item/device/radio/intercom/proc/Initialize  (code/game/objects/items/devices/radio/intercom.dm:19)  may sleep
rt.def("/obj/item/device/radio/intercom/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.args[2]))) {
		yield* g.srcCall(f, "setDir", live(f.args[1]));
	}
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true, { args: ["mapload", "ndir", "building"] });

// /obj/item/device/radio/intercom/proc/Destroy  (code/game/objects/items/devices/radio/intercom.dm:25)  may sleep
rt.def("/obj/item/device/radio/intercom/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/radio/intercom/proc/examine  (code/game/objects/items/devices/radio/intercom.dm:29)
rt.def("/obj/item/device/radio/intercom/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "unfastened"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>It's <b>screwed</b> and secured to the wall.</span>"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>It's <i>unscrewed</i> from the wall, and can be <b>detached</b>.</span>"]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/radio/intercom/proc/attackby  (code/game/objects/items/devices/radio/intercom.dm:36)  may sleep
rt.def("/obj/item/device/radio/intercom/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null, W: Value = null;
	f.vars = () => [S, W];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		S = live(f.args[0]);
		if (truthy(rt.sv(f, "unfastened"))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ starts tightening ＀'s screws...</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You start screwing in ＀...</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(S)), 50, 1]);
			if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(30, rt.fv(f, "toolspeed", live(S))), "target", live(f.src)], rt.Args.Named)))) {
				return live(f.dot);
			}
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ tightens ＀'s screws!</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You tighten ＀'s screws.</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/screwdriver2.ogg"), 50, 1]);
			rt.setSv(f, "unfastened", 0);
		} else {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ starts loosening ＀'s screws...</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You start unscrewing ＀...</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(S)), 50, 1]);
			if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(60, rt.fv(f, "toolspeed", live(S))), "target", live(f.src)], rt.Args.Named)))) {
				return live(f.dot);
			}
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ loosens ＀'s screws!</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You unscrew ＀, loosening it from the wall.</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/screwdriver2.ogg"), 50, 1]);
			rt.setSv(f, "unfastened", 1);
		}
		return live(f.dot);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			if (!truthy(rt.sv(f, "unfastened"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You need to unscrew ＀ from the wall first!</span>", [live(f.src)])]);
				return live(f.dot);
			}
			W = live(f.args[0]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ starts unsecuring ＀...</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You start unsecuring ＀...</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(W)), 50, 1]);
			if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(80, rt.fv(f, "toolspeed", live(W))), "target", live(f.src)], rt.Args.Named)))) {
				return live(f.dot);
			}
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ unsecures ＀!</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You detach ＀ from the wall.</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			yield* g.new_(f, T("/obj/item/wallframe/intercom"), [rt.getStep(f, live(f.src), 0)]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return live(f.dot);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/item/device/radio/intercom/proc/attack_ai  (code/game/objects/items/devices/radio/intercom.dm:72)  may sleep
rt.def("/obj/item/device/radio/intercom/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/item/device/radio/intercom/proc/attack_hand  (code/game/objects/items/devices/radio/intercom.dm:75)  may sleep
rt.def("/obj/item/device/radio/intercom/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/item/device/radio/intercom/proc/interact  (code/game/objects/items/devices/radio/intercom.dm:78)  may sleep
rt.def("/obj/item/device/radio/intercom/proc/interact", function* interact(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callSrc(f, "ui_interact", [null, live(f.args[0]), "state", rt.gl("default_state")], rt.Args.Named);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/device/radio/intercom/proc/receive_range  (code/game/objects/items/devices/radio/intercom.dm:82)
rt.def("/obj/item/device/radio/intercom/proc/receive_range", function receive_range(f: Frame, freq: Value, level: Value) {
	let position: Value = null;
	f.vars = () => [position];
	if (!truthy(rt.sv(f, "on"))) {
		return -1;
	}
	if (truthy(rt.callName(f, rt.sv(f, "wires"), "is_cut", ["Recieve"]))) {
		return -1;
	}
	if (!truthy((rt.isIn(f, 0, live(level)) ? 1 : 0))) {
		if (((position = rt.getStep(f, live(f.src), 0)) === null || !truthy((rt.isIn(f, rt.fv(f, "z", live(position)), live(level)) ? 1 : 0)))) {
			return -1;
		}
	}
	if (!truthy(rt.fv(f, "listening", live(f.src)))) {
		return -1;
	}
	if (isEqual(live(freq), 1213)) {
		if (!truthy(rt.fv(f, "syndie", live(f.src)))) {
			return -1;
		}
	}
	return rt.sv(f, "canhear_range");
});

// /obj/item/device/radio/intercom/proc/Hear  (code/game/objects/items/devices/radio/intercom.dm:100)  may sleep
rt.def("/obj/item/device/radio/intercom/proc/Hear", function* Hear(f: Frame) {
	if ((!truthy(rt.sv(f, "anyai")) && !truthy((rt.isIn(f, live(f.args[1]), rt.sv(f, "ai")) ? 1 : 0)))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["message", "speaker", "message_langs", "raw_message", "radio_freq", "spans", "message_mode"] });

// /obj/item/device/radio/intercom/proc/process  (code/game/objects/items/devices/radio/intercom.dm:105)
rt.def("/obj/item/device/radio/intercom/proc/process", function process(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (!(rt.gt(subtract(rt.fv(f, "timeofday", rt.world()), rt.sv(f, "last_tick")), 30) || rt.lt(subtract(rt.fv(f, "timeofday", rt.world()), rt.sv(f, "last_tick")), 0))) return f.dot;
	rt.setSv(f, "last_tick", rt.fv(f, "timeofday", rt.world()));
	if ((!truthy((A = rt.call(f, P("/proc/get_area"), null, [live(f.src)]))) || truthy(rt.sv(f, "emped")))) {
		rt.setSv(f, "on", 0);
	} else {
		rt.setSv(f, "on", rt.callName(f, live(A), "powered", [1]));
	}
	if (!truthy(rt.sv(f, "on"))) {
		rt.setSv(f, "icon_state", "intercom-p");
	} else {
		rt.setSv(f, "icon_state", "intercom");
	}
	return f.dot;
}, false, { waitfor: false });

rt.type(9547, "/obj/item/wallframe/intercom", "/obj/item/wallframe", {
	result_path: rt.typePath("/obj/item/device/radio/intercom/unscrewed"),
	pixel_shift: 29,
	inverse: 1,
	name: "intercom frame",
	desc: "A ready-to-go intercom. Just slap it on a wall and screw it in!",
	icon_state: "intercom",
	materials: null,
});

// /obj/item/wallframe/intercom/proc/<init>  (code/game/objects/items/devices/radio/intercom.dm:130)
rt.def("/obj/item/wallframe/intercom/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 75, "$glass", 25]));
	return f.dot;
});
