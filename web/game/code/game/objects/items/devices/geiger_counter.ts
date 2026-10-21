// From code/game/objects/items/devices/geiger_counter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9231, "/obj/item/device/geiger_counter", "/obj/item/device", {
	scanning: 0,
	radiation_count: 0,
	emagged: 0,
	name: "geiger counter",
	desc: "A handheld device used for detecting and measuring radiation pulses.",
	icon_state: "geiger_off",
	item_state: "multitool",
	w_class: 2,
	slot_flags: 512,
	materials: null,
});

// /obj/item/device/geiger_counter/proc/<init>  (code/game/objects/items/devices/geiger_counter.dm:14)
rt.def("/obj/item/device/geiger_counter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 150, "$glass", 150]));
	return f.dot;
});

// /obj/item/device/geiger_counter/proc/New  (code/game/objects/items/devices/geiger_counter.dm:20)  may sleep
rt.def("/obj/item/device/geiger_counter/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/device/geiger_counter/proc/Destroy  (code/game/objects/items/devices/geiger_counter.dm:24)  may sleep
rt.def("/obj/item/device/geiger_counter/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/geiger_counter/proc/process  (code/game/objects/items/devices/geiger_counter.dm:29)
rt.def("/obj/item/device/geiger_counter/proc/process", function process(f: Frame) {
	if (truthy(rt.sv(f, "emagged"))) {
		if (rt.lt(rt.sv(f, "radiation_count"), 20)) {
			rt.incSrcVar(f, "radiation_count", 1, true);
		}
		return 0;
	}
	if (!rt.gt(rt.sv(f, "radiation_count"), 0)) return f.dot;
	rt.incSrcVar(f, "radiation_count", -1, true);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
}, false, { waitfor: false });

// /obj/item/device/geiger_counter/proc/examine  (code/game/objects/items/devices/geiger_counter.dm:37)
rt.def("/obj/item/device/geiger_counter/proc/examine", function examine(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "scanning"))) {
		return 1;
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='info'>Alt-click it to clear stored radiation levels.</span>"]);
	if (truthy(rt.sv(f, "emagged"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>The display seems to be incomprehensible.</span>"]);
		return 1;
	}
	$0 = rt.sv(f, "radiation_count");
	if (rt.inRange($0, -9.999999848243207e+30, 10)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Ambient radiation level count reports that all is well.</span>"]);
	} else if (rt.inRange($0, 11, 30)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='disarm'>Ambient radiation levels slightly above average.</span>"]);
	} else if (rt.inRange($0, 31, 75)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>Ambient radiation levels above average.</span>"]);
	} else if (rt.inRange($0, 76, 125)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>Ambient radiation levels highly above average.</span>"]);
	} else if (rt.inRange($0, 126, 200)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='suicide'>Ambient radiation levels nearing critical level.</span>"]);
	} else if (rt.inRange($0, 201, 9.999999848243207e+30)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='boldannounce'>Ambient radiation levels above critical level!</span>"]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/geiger_counter/proc/update_icon  (code/game/objects/items/devices/geiger_counter.dm:59)
rt.def("/obj/item/device/geiger_counter/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.sv(f, "scanning"))) {
		rt.setSv(f, "icon_state", "geiger_off");
		return 1;
	}
	if (truthy(rt.sv(f, "emagged"))) {
		rt.setSv(f, "icon_state", "geiger_on_emag");
		return 1;
	}
	$0 = rt.sv(f, "radiation_count");
	if (rt.inRange($0, -9.999999848243207e+30, 10)) {
		rt.setSv(f, "icon_state", "geiger_on_1");
	} else if (rt.inRange($0, 11, 30)) {
		rt.setSv(f, "icon_state", "geiger_on_2");
	} else if (rt.inRange($0, 31, 75)) {
		rt.setSv(f, "icon_state", "geiger_on_3");
	} else if (rt.inRange($0, 76, 125)) {
		rt.setSv(f, "icon_state", "geiger_on_4");
	} else if (rt.inRange($0, 126, 200)) {
		rt.setSv(f, "icon_state", "geiger_on_4");
	} else if (rt.inRange($0, 201, 9.999999848243207e+30)) {
		rt.setSv(f, "icon_state", "geiger_on_5");
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/item/device/geiger_counter/proc/rad_act  (code/game/objects/items/devices/geiger_counter.dm:81)
rt.def("/obj/item/device/geiger_counter/proc/rad_act", function rad_act(f: Frame, amount: Value) {
	let M: Value = null;
	f.vars = () => [amount, M];
	if ((!truthy(live(amount)) && truthy(rt.sv(f, "scanning")))) {
		return 0;
	}
	if (truthy(rt.sv(f, "emagged"))) {
		amount = rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [live(amount), 25])]);
	}
	rt.modSrcVar(f, "radiation_count", live(amount), add);
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living")) ? 1 : 0))) {
		M = rt.sv(f, "loc");
		if (!truthy(rt.sv(f, "emagged"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='boldannounce'>＀ RADIATION PULSE DETECTED.</span>", [rt.call(f, P("/proc/bicon"), null, [live(f.src)])])]);
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='boldannounce'>＀ Severity: ＀</span>", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(amount)])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='boldannounce'>＀ !@%$AT!(N P!LS! D/TEC?ED.</span>", [rt.call(f, P("/proc/bicon"), null, [live(f.src)])])]);
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='boldannounce'>＀ &!F2rity: <=＀#1</span>", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(amount)])]);
		}
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/device/geiger_counter/proc/attack_self  (code/game/objects/items/devices/geiger_counter.dm:97)
rt.def("/obj/item/device/geiger_counter/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	rt.setSv(f, "scanning", (!truthy(rt.sv(f, "scanning")) ? 1 : 0));
	rt.callSrc(f, "update_icon", []);
	$0 = live(user);
	$1 = rt.call(f, P("/proc/bicon"), null, [live(f.src)]);
	if (truthy(rt.sv(f, "scanning"))) {
		$2 = "on";
	} else {
		$2 = "off";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>＀ You switch ＀ ＀.</span>", [$1, $2, live(f.src)])]);
	return f.dot;
});

// /obj/item/device/geiger_counter/proc/attack  (code/game/objects/items/devices/geiger_counter.dm:102)  may sleep
rt.def("/obj/item/device/geiger_counter/proc/attack", function* attack(f: Frame) {
	if (isEqual(rt.fv(f, "a_intent", live(f.args[1])), "help")) {
		if (!truthy(rt.sv(f, "emagged"))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ scans ＀ with ＀.</span>", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You scan ＀'s radiation levels with ＀...</span>", [live(f.args[0]), live(f.src)])]);
			if (!truthy(rt.fv(f, "radiation", live(f.args[0])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ Radiation levels within normal boundaries.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))])]);
				return 1;
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='boldannounce'>＀ Subject is irradiated. Radiation levels: ＀.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)])), rt.fv(f, "radiation", live(f.args[0]))])]);
				return 1;
			}
		} else {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ scans ＀ with ＀.</span>", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='danger'>You project ＀'s stored radiation into ＀'s body!</span>", [live(f.src), live(f.args[0])])]);
			yield* g.callName(f, live(f.args[0]), "rad_act", [rt.sv(f, "radiation_count")]);
			rt.setSv(f, "radiation_count", 0);
		}
		return 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/device/geiger_counter/proc/attackby  (code/game/objects/items/devices/geiger_counter.dm:119)  may sleep
rt.def("/obj/item/device/geiger_counter/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && truthy(rt.sv(f, "emagged")))) {
		if (truthy(rt.sv(f, "scanning"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>Turn off ＀ before you perform this action!</span>", [live(f.src)])]);
			return 0;
		}
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ unscrews ＀'s maintenance panel and begins fiddling with its innards...</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You begin resetting ＀...</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.args[1]), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.args[1])], rt.Args.Named)))) {
			return 0;
		}
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ refastens ＀'s maintenance panel!</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You reset ＀ to its factory settings!</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.args[1]), rt.rsc("sound/items/screwdriver2.ogg"), 50, 1]);
		rt.setSv(f, "emagged", 0);
		rt.setSv(f, "radiation_count", 0);
		yield* g.srcCall(f, "update_icon");
		return 1;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/device/geiger_counter/proc/AltClick  (code/game/objects/items/devices/geiger_counter.dm:137)  may sleep
rt.def("/obj/item/device/geiger_counter/proc/AltClick", function* AltClick(f: Frame) {
	if ((!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)) || truthy((yield* g.callName(f, live(f.args[0]), "incapacitated", []))))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (!truthy(rt.sv(f, "scanning"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀ must be on to reset its radiation level!</span>", [live(f.src)])]);
		return 0;
	}
	rt.setSv(f, "radiation_count", 0);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You flush ＀'s radiation counts, resetting it to normal.</span>", [live(f.src)])]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/device/geiger_counter/proc/emag_act  (code/game/objects/items/devices/geiger_counter.dm:147)
rt.def("/obj/item/device/geiger_counter/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	if (truthy(rt.sv(f, "scanning"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>Turn off ＀ before you perform this action!</span>", [live(f.src)])]);
		return 0;
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You override ＀'s radiation storing protocols. It will now generate small doses of radiation, and stored rads are now projected into creatures you scan.</span>", [live(f.src)])]);
	rt.setSv(f, "emagged", 1);
	return f.dot;
});
